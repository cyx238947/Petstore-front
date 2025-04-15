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
              <el-descriptions-item label="订单编号">{{ order.orderNo }}</el-descriptions-item>
              <el-descriptions-item label="订单状态">
                <el-tag :type="getStatusType(order.status)" effect="dark">
                  {{ getStatusName(order.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="下单时间">{{ order.createTime }}</el-descriptions-item>
              <el-descriptions-item label="支付时间">{{ order.payTime || '-' }}</el-descriptions-item>
              <el-descriptions-item label="订单金额">￥{{ order.totalPrice }}</el-descriptions-item>
              <el-descriptions-item label="收货地址">{{ order.address }}</el-descriptions-item>
            </el-descriptions>
          </div>
          
          <!-- 商品清单 -->
          <div class="section">
            <div class="section-title">商品清单</div>
            <el-table 
              :data="order.goodsList" 
              border
              v-loading="loading"
              element-loading-text="数据加载中..."
              element-loading-spinner="el-icon-loading"
            >
              <el-table-column 
                prop="goodsName" 
                label="商品名称" 
                width="240"
                align="center"
              >
                <template v-slot="scope">
                  <router-link 
                    :to="'/front/detail?id=' + scope.row.goodsId"
                    class="goods-link"
                  >
                    {{ scope.row.goodsName }}
                  </router-link>
                </template>
              </el-table-column>
              
              <el-table-column 
                label="商品图片" 
                width="120"
                align="center"
              >
                <template v-slot="scope">
                  <el-image 
                    style="width: 80px; height: 60px" 
                    :src="scope.row.goodsImg" 
                    :preview-src-list="[scope.row.goodsImg]"
                    fit="contain"
                  ></el-image>
                </template>
              </el-table-column>
              
              <el-table-column 
                prop="goodsPrice" 
                label="单价"
                align="center"
              ></el-table-column>
              
              <el-table-column 
                prop="num" 
                label="数量"
                align="center"
              ></el-table-column>
              
              <el-table-column 
                prop="total" 
                label="小计"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
          
          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button 
              type="danger" 
              v-if="order.status === 0" 
              @click="pay"
              :loading="payLoading"
            >
              立即支付
            </el-button>
            
            <el-button 
              v-if="order.status === 0" 
              @click="cancel"
              :loading="cancelLoading"
            >
              取消订单
            </el-button>
            
            <el-button 
              type="success"
              v-if="order.status === 2" 
              @click="confirm"
              :loading="confirmLoading"
            >
              确认收货
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "OrderDetail",
    data() {
      return {
        order: {
          id: '',
          orderNo: '',
          status: null,
          totalPrice: '',
          createTime: '',
          payTime: '',
          address: '',
          goodsList: []
        },
        loading: false,
        payLoading: false,
        cancelLoading: false,
        confirmLoading: false
      }
    },
    created() {
      this.loadOrderDetail()
    },
    methods: {
      async loadOrderDetail() {
        this.loading = true
        try {
          const orderId = this.$route.query.id
          // 模拟API请求
          await new Promise(resolve => setTimeout(resolve, 400))
          
          // 这里应该是根据orderId获取订单详情的API请求
          // 使用模拟数据
          this.order = {
            id: orderId,
            orderNo: `NO202305${orderId}`,
            status: parseInt(orderId) % 5, // 模拟不同状态
            totalPrice: (parseInt(orderId) * 100).toFixed(2),
            createTime: `2023-05-${orderId.padStart(2, '0')} 12:34:56`,
            payTime: `2023-05-${orderId.padStart(2, '0')} 12:35:12`,
            address: '北京市海淀区中关村大街1号 张三 13800138000',
            goodsList: [
              {
                goodsId: '101',
                goodsName: '华为Mate50 Pro',
                goodsImg: 'https://imgservice.suning.cn/uimg1/b2c/image/JZvXZ8n4t4j1b3q3Z4J4Jw.jpg_200w_200h_4e',
                goodsPrice: '5999.00',
                num: 1,
                total: '5999.00'
              },
              {
                goodsId: '102',
                goodsName: 'AirPods Pro',
                goodsImg: 'https://imgservice.suning.cn/uimg1/b2c/image/JZvXZ8n4t4j1b3q3Z4J4Jw.jpg_200w_200h_4e',
                goodsPrice: '1499.00',
                num: 2,
                total: '2998.00'
              }
            ]
          }
        } catch (error) {
          console.error('加载订单详情失败:', error)
          this.$message.error('加载订单详情失败')
        } finally {
          this.loading = false
        }
      },
      
      getStatusType(status) {
        const statusMap = {
          0: '',         // 待发货 - 默认颜色
          1: 'danger',   // 已取消 - 红色
          2: 'success',  // 已发货 - 绿色
          3: 'info',     // 已收货 - 蓝色
          4: 'warning'   // 已评价 - 橙色
        }
        return statusMap[status] || ''
      },
      
      getStatusName(status) {
        const nameMap = {
          0: '待发货',
          1: '已取消',
          2: '已发货',
          3: '已收货',
          4: '已评价'
        }
        return nameMap[status] || '未知状态'
      },
      
      async pay() {
        this.payLoading = true
        try {
          await new Promise(resolve => setTimeout(resolve, 800))
          this.$message.success('支付成功')
          this.loadOrderDetail()
        } catch (error) {
          this.$message.error('支付失败')
        } finally {
          this.payLoading = false
        }
      },
      
      async cancel() {
        try {
          await this.$confirm('确定要取消此订单吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          
          this.cancelLoading = true
          await new Promise(resolve => setTimeout(resolve, 800))
          this.$message.success('订单已取消')
          this.$router.go(-1)
        } catch (error) {
          if (error !== 'cancel') {
            this.$message.error('取消订单失败')
          }
        } finally {
          this.cancelLoading = false
        }
      },
      
      async confirm() {
        try {
          await this.$confirm('确定已收到商品吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          
          this.confirmLoading = true
          await new Promise(resolve => setTimeout(resolve, 800))
          this.$message.success('确认收货成功')
          this.loadOrderDetail()
        } catch (error) {
          if (error !== 'cancel') {
            this.$message.error('确认收货失败')
          }
        } finally {
          this.confirmLoading = false
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
  
  .goods-link {
    color: #409EFF;
    text-decoration: none;
  }
  
  .goods-link:hover {
    text-decoration: underline;
  }
  
  .el-tag {
    font-weight: bold;
  }
  </style>