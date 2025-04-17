<template>
  <div class="main-content">
    <div class="order-container">
      <div class="order-header">
        <div class="header-title">订单详情</div>
        <el-button 
          type="primary" 
          icon="el-icon-arrow-left"
          @click="$router.go(-1)"
        >
          返回
        </el-button>
      </div>
      
      <div class="order-body">
        <!-- 订单基本信息 -->
        <div class="section">
          <div class="section-title">订单信息</div>
            <el-descriptions :column="2" border>
            <el-descriptions-item label="订单编号">{{ currentOrder.code }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.status)" effect="dark">
               {{ getStatusName(currentOrder.status) }}
            </el-tag>
            </el-descriptions-item>
              <el-descriptions-item label="订单金额">{{ currentOrder.totalPrice }}</el-descriptions-item>
              <el-descriptions-item label="下单时间">{{ currentOrder.createTime }}</el-descriptions-item>
              <el-descriptions-item label="收货地址">{{ currentOrder.address }}</el-descriptions-item>
            </el-descriptions>
       </div>

        <!-- 商品清单 -->
        <div class="section">
          <div class="section-title">商品清单</div>
          <el-table :data="currentOrder.item ? [currentOrder.item] : []" border>
            <el-table-column label="商品图片" width="120" align="center">
              <template v-slot="scope">
                 <el-image v-if="scope.row.image" :src="scope.row.image" style="width: 80px; height: 60px" fit="contain"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="240" align="center"/>
            <el-table-column label="单价" align="center">
              <template v-slot="scope">￥{{ scope.row.unitCost.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center"/>
            <el-table-column label="小计" align="center">
              <template v-slot="scope">￥{{ scope.row.subtotal.toFixed(2) }}</template>
            </el-table-column>
         </el-table>
       </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button 
            type="danger"
            v-if="canDelete"
            @click="handleDelete"
          >
            删除订单
          </el-button>
          
          <el-button 
            type="success"
            v-if="canReceive"
            @click="handleReceive"
          >
            确认收货
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/authrequest'

export default {
  name: "OrderDetail",
  data() {
    return {
      loading: false,       // 页面加载状态
      currentOrder: null,
      statusMap: {
        0: { name: '待发货', type: '' },
        1: { name: '已取消', type: 'danger' },
        2: { name: '已发货', type: 'success' },
        3: { name: '已收货', type: 'info' },
        4: { name: '已评价', type: 'warning' }
      }
    }
  },
  computed: {
    canDelete() {
      return [1, 3, 4].includes(this.currentOrder?.status)
    },
    canReceive() {
      return this.currentOrder?.status === 2
    },
  },
  created() {
    this.loadOrderDetail()
  },
  methods: {
    async loadOrderDetail() {
  this.loading = true;
  try {
    const { orderNo } = this.$route.query;
    const { data } = await request.get('/itemOrder/getOrder');
    
    if (data?.status !== 0 || !data.data) {
      throw new Error(data?.statusInfo || '获取订单数据异常');
    }

    // 查找订单并格式化数据
    const currentOrder = data.data.find(order => order.code === orderNo);
    if (!currentOrder) {
      throw new Error(`未找到订单: ${orderNo}`);
    }
    console.log('商品信息：',currentOrder.item)

    // 格式化订单数据
    this.currentOrder = {
      ...currentOrder,
      //基本信息
      code: currentOrder.code || '无订单号',
      address: currentOrder.address || '未填写地址',
      status: currentOrder.status ?? 0,
    
      totalPrice: `￥${(currentOrder.total || 0).toFixed(2)}`,
      createTime: this.formatDateTime(currentOrder.addTime),
      
      // 商品信息
      //显示不全
      item: {
        ...currentOrder.item,
        name: currentOrder.itemId || '未知商品',
        quantity: currentOrder.total || 1,
        //没数据
        unitCost: currentOrder.item?.unitCost || 0,
        subtotal: (currentOrder.item?.unitCost || 0) * (currentOrder.item?.quantity || 1),
        image: this.getProductImage(currentOrder.item)
      }
    };

  } catch (error) {
    this.$message.error(error.message || '加载失败');
    setTimeout(() => this.$router.go(-1), 1500);
  } finally {
    this.loading = false;
  }
},

    // 从商品描述中提取图片
    getProductImage(item) {
      if (!item?.description) return ''
      const imgMatch = item.description.match(/<image src="([^"]+)"/)
      return imgMatch ? imgMatch[1] : ''
    },

    formatDateTime(dateObj) {
      if (!dateObj) return '未知时间'
      try {
        return new Date(dateObj).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-')
      } catch {
        return '无效时间'
      }
    },

    getStatusName(status) {
      return this.statusMap[status]?.name || `未知状态(${status})`
    },

    getStatusType(status) {
      return this.statusMap[status]?.type || ''
    },

    async handleDelete() {
      try {
        await this.$confirm('确定删除此订单吗?', '提示', { type: 'warning' })
        const res = await request.post('/itemOrder/delete',{code: this.currentOrder.code })
        console.log('删除结果:', res)
        this.$message.success('删除成功')
        this.$router.go(-1)
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error(error.message || '删除失败')
        }
      }
    },

    async handleReceive() {
      try {
        await this.$confirm('确定已收到商品?', '提示', { type: 'warning' })
        const res = await request.post('/itemOrder/receive', {code: this.currentOrder.code})
        console.log('收货结果:', res)
        console.log('订单号:', this.currentOrder.code)
        this.$message.success('收货成功')
        this.loadOrderDetail() // 刷新状态
      } catch (error) {
        if (error !== 'cancel') {
          console.error('收货失败:', error)
          this.$message.error(error.message || '操作失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.main-content {
  background-color: #f5f5f5;
  min-height: calc(100vh - 50px);
  padding: 20px 0;
}

.order-container {
  width: 70%;
  background-color: white;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 80px;
  border-bottom: 1px solid #ebeef5;
}

.header-title {
  font-size: 24px;
  font-weight: 500;
  color: #303133;
}

.order-body {
  padding: 20px;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #606266;
}

.action-buttons {
  text-align: right;
  margin-top: 30px;
}

.el-tag {
  font-weight: bold;
}
</style>
