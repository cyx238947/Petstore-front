Remove-Item package-lock.json, yarn.lock -ErrorAction SilentlyContinue<template>
    <div class="main-content">
      <div class="order-container">
        <div class="order-header">
          <div class="header-title">我的订单（{{total}}笔）</div>
          <div class="header-search">
            <el-input 
              v-model="search" 
              placeholder="输入订单号搜索" 
              clearable
              @keyup.enter.native="handleSearch"
            >
              <el-button 
                slot="append" 
                icon="el-icon-search" 
                @click="handleSearch"
                ></el-button>
            </el-input>
          </div>
        </div>
        
        <div class="order-body">
          <el-table 
            :data="pagedOrderData" 
            stripe
            v-loading="loading"
            element-loading-text="数据加载中..."
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column 
              prop="orderNo" 
              label="订单编号" 
              width="200"
              align="center"
            ></el-table-column>
            
            <el-table-column 
              label="订单状态" 
              align="center"
            >
              <template v-slot="scope">
                <el-tag 
                  :type="getStatusType(scope.row.status)"
                  effect="dark"
                >
                  {{ getStatusName(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column 
              prop="totalPrice" 
              label="订单金额" 
              align="center"
            ></el-table-column>
            
            <el-table-column 
              prop="createTime" 
              label="下单时间" 
              width="180"
              align="center"
            ></el-table-column>
            
            <el-table-column 
              label="操作" 
              width="180"
              align="center"
            >
              <template v-slot="scope">
                <el-button 
                  size="mini" 
                  type="primary"
                  @click="navToDetail(scope.row.id)"
                >
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
  
          <div class="pagination-wrapper">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-size="pageSize"
              :total="total"
              layout="total, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "OrderList",
    data() {
      return {
        allOrderData: [],    // 所有订单数据
        pagedOrderData: [],  // 当前页数据
        pageNum: 1,          // 当前页码
        pageSize: 6,         // 每页6条
        total: 0,            // 总数据量
        search: '',          // 搜索关键词
        loading: false       // 加载状态
      }
    },
    created() {
      this.generateMockData()
      this.loadOrderData()
    },
    methods: {
      // 生成10条模拟订单数据
      generateMockData() {
        const statuses = [0, 1, 2, 3, 4]
        const prices = [199, 299, 399, 499, 599]
        
        this.allOrderData = [
          { id: '1', orderNo: 'NO20230601001', status: 0, totalPrice: '￥199.00', createTime: '2023-06-01 10:15:32' },
          { id: '2', orderNo: 'NO20230601002', status: 1, totalPrice: '￥299.00', createTime: '2023-06-01 11:20:45' },
          { id: '3', orderNo: 'NO20230601003', status: 2, totalPrice: '￥399.00', createTime: '2023-06-01 14:05:18' },
          { id: '4', orderNo: 'NO20230601004', status: 3, totalPrice: '￥499.00', createTime: '2023-06-01 16:30:22' },
          { id: '5', orderNo: 'NO20230601005', status: 4, totalPrice: '￥599.00', createTime: '2023-06-01 18:45:37' },
          { id: '6', orderNo: 'NO20230601006', status: 0, totalPrice: '￥199.00', createTime: '2023-06-01 20:10:55' },
          { id: '7', orderNo: 'NO20230601007', status: 1, totalPrice: '￥299.00', createTime: '2023-06-02 09:15:32' },
          { id: '8', orderNo: 'NO20230601008', status: 2, totalPrice: '￥399.00', createTime: '2023-06-02 10:20:45' },
          { id: '9', orderNo: 'NO20230601009', status: 3, totalPrice: '￥499.00', createTime: '2023-06-02 13:05:18' },
          { id: '10', orderNo: 'NO20230601010', status: 4, totalPrice: '￥599.00', createTime: '2023-06-02 15:30:22' }
        ]
        
        this.total = this.allOrderData.length
      },
      
      // 加载订单数据
      async loadOrderData() {
        this.loading = true
        try {
          // 模拟API请求延迟
          await new Promise(resolve => setTimeout(resolve, 400))
          
          // 实际项目中替换为API调用：
          // const res = await api.getOrders({
          //   page: this.pageNum,
          //   size: this.pageSize,
          //   keyword: this.search
          // })
          // this.allOrderData = res.data.list
          // this.total = res.data.total
          
          // 搜索过滤
          let filteredData = this.allOrderData
          if (this.search) {
            filteredData = this.allOrderData.filter(item => 
              item.orderNo.includes(this.search)
            )
          }
          
          // 分页处理
          const start = (this.pageNum - 1) * this.pageSize
          const end = start + this.pageSize
          this.pagedOrderData = filteredData.slice(start, end)
          this.total = filteredData.length
          
        } catch (error) {
          console.error('加载订单数据失败:', error)
          this.$message.error('加载订单数据失败')
        } finally {
          this.loading = false
        }
      },
      
      // 状态标签类型
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
      
      // 状态名称
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
      
      // 页码变化
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum
        this.loadOrderData()
      },
      
      // 搜索处理
      handleSearch() {
        this.pageNum = 1
        this.loadOrderData()
      },
      
      // 查看详情
      navToDetail(orderId) {
        this.$router.push({
          path: '/front/orderDetail',
          query: { id: orderId }
        })
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
    font-size: 18px;
    font-weight: 500;
    color: #303133;
  }
  
  .header-search {
    width: 300px;
  }
  
  .order-body {
    padding: 20px;
  }
  
  .pagination-wrapper {
    margin-top: 20px;
    text-align: center;
  }
  
  .el-tag {
    font-weight: bold;
  }
  </style>