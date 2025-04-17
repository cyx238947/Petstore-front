<template>
  <div class="main-content">
    <div style="width: 70%; background-color: white; margin: 30px auto; border-radius: 20px">
      <div style="padding-bottom: 10px">
        <div style="display: flex; font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid;">
          <div style="margin-left: 20px; flex: 1">全部商品（{{cartItems.length}}件）</div>

          <div style="flex: 1; font-size: 16px; text-align: right; padding-right: 20px">
            已选商品 ￥{{subTotal}} <el-button type="danger" round @click="pay">下单</el-button>
          </div>
        </div>
        <div style="margin: 20px 0; padding: 0 50px">
          <div class="table">
            <div v-if="cartItems.length > 0">
              <div v-for="(item, index) in cartItems" :key="index" style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee;">
                <!-- 选择框 -->
                <div style="width: 50px;">
                  <el-checkbox v-model="selectedItems[index]"></el-checkbox>
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
                  <el-button size="mini" type="danger" plain @click="removeItem(item.item.itemId)">移除</el-button>
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
                  :current-page="pageNum"
                  :page-sizes="[5, 10, 20]"
                  :page-size="pageSize"
                  layout="total, prev, pager, next"
                  :total="cartItems.length">
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
      subTotal: 0,    // 购物车总价
      selectedItems: [], // 选中的商品
      pageNum: 1,
      pageSize: 10
    }
  },

  created() {
    if (!checkToken()) {
      this.$router.push('/login');
    } else {
      this.loadCart();
    }
  },

  methods: {
    async loadCart() {
      try {
        const response = await authrequest.get("/cart/getCart");
        this.cartItems = response.data.data.cartItems;  // 直接使用 cartItems[n] 访问
        this.subTotal = response.data.data.subTotal;    // 直接使用 subTotal
        this.selectedItems = new Array(this.cartItems.length).fill(false);
      } catch (error) {
        console.error("加载购物车失败:", error);
        this.$message.error("加载购物车失败");
      }
    },

    async removeItem(itemId) {
      try {
        const response = await authrequest.post("/cart/remove", { itemId });
        if (response.data.data) {
          this.$message.success("移除成功");
          await this.loadCart();
        } else {
          this.$message.error("移除失败");
        }
      } catch (error) {
        console.error("移除商品失败:", error);
        this.$message.error("移除商品失败");
      }
    },

    async updateQuantity(item) {
      try {
        const response = await authrequest.post("/cart/update", {
          itemId: item.item.itemId,
          quantity: item.quantity
        });
        if (!response.data.data) {
          this.$message.error("更新数量失败");
          await this.loadCart(); // 恢复原始数据
        }
      } catch (error) {
        console.error("更新数量失败:", error);
        this.$message.error("更新数量失败");
        await this.loadCart(); // 恢复原始数据
      }
    },

    handleCurrentChange(val) {
      this.pageNum = val;
    },

    getImageUrl(description) {
      // 从描述中提取图片URL
      const match = description.match(/src="([^"]+)"/);
      return match ? match[1] : '';
    },

    async pay() {
      const selectedCount = this.selectedItems.filter(item => item).length;
      if (selectedCount === 0) {
        this.$message.warning("请选择要购买的商品");
        return;
      }
      
      // 获取选中的商品
      const selectedProducts = this.cartItems.filter((item, index) => this.selectedItems[index]);
      
      // 这里添加下单逻辑
      this.$message.success(`已成功下单 ${selectedCount} 件商品，总价: ￥${this.subTotal}`);
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
