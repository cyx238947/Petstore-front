<template>
  <div class="main-content">
    <div style="width: 70%; background-color: white; margin: 30px auto; border-radius: 20px">
      <div style="padding-bottom: 10px">
        <div style="display: flex; font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid;">
          <div style="margin-left: 20px; flex: 1">全部商品（{{totalItems}}件）</div>

          <div style="flex: 1; font-size: 16px; text-align: right; padding-right: 20px">
            已选商品 ￥{{selectedSubTotal}} <el-button type="danger" round @click="pay">下单</el-button>
          </div>
        </div>
        <div style="margin: 20px 0; padding: 0 50px">
          <div class="table">
            <div v-if="filteredCartItems.length > 0">
              <div v-for="(item, index) in paginatedItems" :key="index" style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee;">
                <!-- 选择框 -->
                <div style="width: 50px;">
                  <el-checkbox v-model="item.selected" @change="updateSelectedItems"></el-checkbox>
                </div>
                
                <!-- 商品图片 -->
                <div style="width: 120px;">
                  <el-image style="width: 80px; height: 60px; border-radius: 3px" 
                           :src="getImageUrl(item.item.description)" 
                           :preview-src-list="[getImageUrl(item.item.description)]"></el-image>
                </div>
                
                <!-- 商品名称 -->
                <div style="width: 240px;">
                  <a :href="'/front/detail?id=' + item.item.itemId">{{item.item.name}}</a>
                </div>
                
                <!-- 商品价格 -->
                <div style="width: 100px;">
                  {{item.item.listPrice}}
                </div>
                
                <!-- 数量选择 -->
                <div style="width: 150px;">
                  <el-input-number v-model="item.quantity" style="width: 100px" 
                                  @change="updateQuantity(item)" 
                                  :min="1" 
                                  :max="item.item.quantity"></el-input-number>
                </div>
                
                <!-- 操作按钮 -->
                <div style="width: 180px;">
                  <el-button size="mini" type="danger" plain @click="confirmRemoveItem(item)">移除</el-button>
                </div>
              </div>
            </div>
            <div v-else style="text-align: center; padding: 50px 0;">
              购物车为空
            </div>

            <div class="pagination" style="margin-top: 20px">
              <el-pagination
                  background
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  :current-page="pageNum"
                  :page-sizes="[5, 10, 20]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next"
                  :total="filteredCartItems.length">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authrequest from '@/utils/authrequest';
import { checkToken } from '@/utils/auth';

export default {
  data() {
    return {
      cartItems: [],  // 购物车商品列表
      selectedSubTotal: 0,    // 选中商品总价
      pageNum: 1,
      pageSize: 10,
      isLoggedIn: false // 登录状态标识
    }
  },

  computed: {
    // 计算总商品数量
    totalItems() {
      return this.cartItems.length;
    },
    
    // 过滤后的购物车商品（用于分页）
    filteredCartItems() {
      return this.cartItems;
    },
    
    // 分页后的商品
    paginatedItems() {
      const start = (this.pageNum - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredCartItems.slice(start, end);
    },
    
    // 选中的商品
    selectedItems() {
      return this.cartItems.filter(item => item.selected);
    }
  },

  watch: {
    // 监听选中商品变化，更新总价
    selectedItems: {
      handler(newVal) {
        this.selectedSubTotal = newVal.reduce((total, item) => {
          return total + (item.item.listPrice * item.quantity);
        }, 0);
      },
      deep: true
    }
  },

  created() {
    this.isLoggedIn = checkToken();
    if (!this.isLoggedIn) {
      this.loadCartFromLocalStorage();
    } else {
      this.loadCartFromServer();
    }
  },

  methods: {
    // 从服务器加载购物车
    async loadCartFromServer() {
      try {
        const response = await authrequest.get("/cart/getCart");
        this.cartItems = response.data.data.cartItems.map(item => ({
          ...item,
          selected: false
        }));
        this.selectedSubTotal = 0;
        // 同步到本地存储
        this.saveCartToLocalStorage();
      } catch (error) {
        console.error("加载购物车失败:", error);
        this.$message.error("加载购物车失败");
      }
    },
    
    // 从本地存储加载购物车
    loadCartFromLocalStorage() {
      const cartData = localStorage.getItem('shoppingCart');
      if (cartData) {
        try {
          const parsedData = JSON.parse(cartData);
          this.cartItems = (parsedData.cartItems || []).map(item => ({
            ...item,
            selected: false
          }));
          this.selectedSubTotal = 0;
        } catch (e) {
          console.error("解析本地购物车数据失败:", e);
        }
      }
    },
    
    // 保存购物车到本地存储
    saveCartToLocalStorage() {
      const cartData = {
        cartItems: this.cartItems.map(item => {
          const { selected, ...rest } = item;
          return rest;
        })
      };
      localStorage.setItem('shoppingCart', JSON.stringify(cartData));
    },
    
    // 确认移除商品
    confirmRemoveItem(item) {
      this.$confirm('确定要从购物车移除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeItem(item.item.itemId);
      }).catch(() => {
        this.$message.info('已取消移除');
      });
    },
    
    // 移除商品
    async removeItem(itemId) {
      if (this.isLoggedIn) {
        try {
          const response = await authrequest.post("/cart/remove", { itemId });
          if (response.data.data) {
            this.$message.success("移除成功");
            await this.loadCartFromServer();
          } else {
            this.$message.error("移除失败");
          }
        } catch (error) {
          console.error("移除商品失败:", error);
          this.$message.error("移除商品失败");
        }
      } else {
        // 本地移除逻辑
        this.cartItems = this.cartItems.filter(item => item.item.itemId !== itemId);
        this.saveCartToLocalStorage();
        this.$message.success("移除成功");
      }
    },
    
    // 更新数量
    async updateQuantity(item) {
      if (this.isLoggedIn) {
        try {
          const response = await authrequest.post("/cart/update", {
            itemId: item.item.itemId,
            quantity: item.quantity
          });
          if (!response.data.data) {
            this.$message.error("更新数量失败");
            await this.loadCartFromServer(); // 恢复原始数据
          }
        } catch (error) {
          console.error("更新数量失败:", error);
          this.$message.error("更新数量失败");
          await this.loadCartFromServer(); // 恢复原始数据
        }
      } else {
        this.saveCartToLocalStorage();
      }
    },
    
    // 更新选中状态
    updateSelectedItems() {
      this.saveCartToLocalStorage();
    },

    // 处理分页变化
    handleCurrentChange(val) {
      this.pageNum = val;
    },
    
    // 处理每页条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
    },

    // 从描述中获取图片URL
    getImageUrl(description) {
      const match = description.match(/src="([^"]+)"/);
      return match ? match[1] : '';
    },
    
    // 下单
    async pay() {
      if (this.selectedItems.length === 0) {
        this.$message.warning("请选择要购买的商品");
        return;
      }
      
      if (!this.isLoggedIn) {
        this.$message.warning("请先登录");
        this.$router.push('/login');
        return;
      }
      
      try {
        // 生成订单号
        const orderCode = 'ORD' + Date.now();
        
        // 调用下单接口
        const response = await authrequest.post("/itemOrder/CDS", {
          code: orderCode,
          items: this.selectedItems.map(item => ({
            itemId: item.item.itemId,
            quantity: item.quantity
          }))
        });
        
        if (response.data.data) {
          this.$message.success("下单成功");
          
          // 下单成功后跳转到订单详情页
          this.$router.push({
            path: '/front/orderDetail',
            query: { id: orderCode }
          });
          
          // 重新加载购物车
          await this.loadCartFromServer();
        } else {
          this.$message.error("下单失败");
        }
      } catch (error) {
        console.error("下单失败:", error);
        this.$message.error("下单失败");
      }
    }
  }
}
</script>

<style scoped>
.main-content {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}
</style>
