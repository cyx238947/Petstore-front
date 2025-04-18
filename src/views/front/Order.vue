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
                @click="navToDetail(scope.row.orderNo)"
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
import request from '@/utils/authrequest'

export default {
  name: "OrderList",
  data: () => ({
    allOrders: [],
    pagedOrderData: [],
    pageNum: 1,
    pageSize: 6,
    total: 0,
    search: '',
    loading: false,
    statusMap: {
      0: { name: '待发货', type: '' },
      1: { name: '已取消', type: 'danger' },
      2: { name: '已发货', type: 'success' },
      3: { name: '已收货', type: 'info' },
      4: { name: '已评价', type: 'warning' }
    }
  }),
  created() {
    this.loadOrderData()
  },
  methods: {
    async loadOrderData() {
      this.loading = true;
      try {
        const { data } = await request.get('/itemOrder/getOrder');
        if (data?.status !== 0 || !data.data) {
          throw new Error(data?.statusInfo || '获取订单数据异常');
        }

        // 所有订单数据
        this.allOrders = data.data.map(order => ({
          id: order.item?.itemId || '',
          orderNo: order.code || '无订单号',
          status: order.status ?? 0,
          totalPrice: `￥${(order.total || 0).toFixed(2)}`,
          createTime: this.formatDateTime(order.addTime),
        }));

        // 初始加载显示所有订单
        this.applySearchAndPagination();

      } catch (error) {
        console.error('订单加载错误:', error);
        this.$message.error(error.message || '加载订单失败');
      } finally {
        this.loading = false;
      }
    },

    // 搜索和分页
    applySearchAndPagination() {
      // 搜索
      const filteredData = this.search
        ? this.allOrders.filter(item => 
            item.orderNo.includes(this.search))
        : this.allOrders;
    
      // 分页
      const start = (this.pageNum - 1) * this.pageSize;
      this.pagedOrderData = filteredData.slice(start, start + this.pageSize);
      this.total = filteredData.length;
    },

    // 搜索按钮
    handleSearch() {
      this.pageNum = 1; // 搜索时重置到第一页
      this.applySearchAndPagination();
    },

    // 页数改变
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.applySearchAndPagination();
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
    
    navToDetail(orderNo) {
      console.log('跳转订单详情:', { orderNo: orderNo })
      this.$router.push({ 
         path: '/front/orderDetail', 
         query: { 
           orderNo: orderNo // 仅保留订单编号
          } 
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
