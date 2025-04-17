<template>
  <div class="main-content">
    <div class="order-container">
      <div class="order-header">
        <div class="header-title">订单确认</div>
        <el-button 
          type="primary" 
          icon="el-icon-arrow-left"
          @click="$router.go(-1)"
        >
          返回购物车
        </el-button>
      </div>
      
      <div class="order-body">
        <!-- 系统生成信息 -->
        <div class="section">
          <div class="section-title">订单信息</div>
          <div class="system-info">
            <div class="info-row">
              <span class="info-label">订单编号：</span>
              <span class="info-value">{{ form.code }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">创建时间：</span>
              <span class="info-value">{{ displayAddTime }}</span>
            </div>
          </div>
        </div>

        <!-- 手动输入部分 -->
        <div class="section">
          <div class="section-title">订单详情</div>
          <el-form :model="form" :rules="rules" ref="form" label-width="120px">
            <el-form-item label="商品ID" prop="itemId">
              <el-input v-model="form.itemId" placeholder="请输入商品ID"></el-input>
            </el-form-item>
            <el-form-item label="订单金额" prop="total">
              <el-input v-model="form.total" placeholder="请输入订单金额">
                <template slot="prepend">￥</template>
              </el-input>
            </el-form-item>
            <el-form-item label="收货地址" prop="address">
              <el-input
                v-model="form.address"
                type="textarea"
                :rows="2"
                placeholder="请输入详细收货地址"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>

        <!-- 商品清单展示 -->
        <div class="section">
          <div class="section-title">商品清单</div>
          <el-table :data="[form]" border>
            <el-table-column prop="itemId" label="商品ID" align="center"></el-table-column>
            <el-table-column label="订单金额" align="center">
              <template v-slot="scope">￥{{ scope.row.total || '0.00' }}</template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 订单金额 -->
        <div class="section">
          <div class="section-title">订单金额</div>
          <div class="price-summary">
            <div class="price-item total">
              <span>应付总额：</span>
              <span class="total-price">￥{{ form.total || '0.00' }}</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button 
            type="danger" 
            @click="submitOrder"
            :loading="submitLoading"
          >
            提交订单
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/authrequest'

export default {
  name: "OrderCheck",
  data() {
    return {
      submitLoading: false,
      form: {
        itemId: '',
        total: '',
        address: '',
        username: localStorage.getItem('username') || '',
        code: Date.now() % 1000000000,
        addtime: this.formatGMTDate(),
      },
      rules: {
        itemId: [
          { required: true, message: '请输入商品ID', trigger: 'blur' }
        ],
        total: [
          { required: true, message: '请输入订单金额', trigger: 'blur' },
          { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效金额格式' }
        ],
        address: [
          { required: true, message: '请输入收货地址', trigger: 'blur' },
          { min: 5, message: '地址长度至少5个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    displayAddTime() {
      if (!this.form.addtime) return ''
      const date = new Date()
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  },
  methods: {
    formatGMTDate() {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                     'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      const date = new Date()
      const day = date.getDate().toString().padStart(2, '0')
      const month = months[date.getMonth()]
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      
      return `${day} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`
    },
    
    async submitOrder() {
      try {
        await this.$refs.form.validate()
        
        await this.$confirm('确认提交订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        this.submitLoading = true
        
        const orderData = {
          id: this.form.code,
          itemid: this.form.itemId,
          username: this.form.username,
          code: this.form.code,
          addtime: this.form.addtime,
          total: this.form.total,
          isdelete: '0',
          status: '0',
          address: this.form.address
        }
        
        const { data } = await request.post('/itemOrder/CDS', orderData)
        
        if (data) {
          this.$message.success('订单提交成功')
          this.$router.push('/front/order')
        } else {
          throw new Error(data?.statusinfo || '订单提交失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('提交订单失败:', error)
          this.$message.error(error.message || '提交订单失败')
        }
      } finally {
        this.submitLoading = false
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
  
  /* 价格汇总样式 */
  .price-summary {
    width: 300px;
    margin-left: auto;
  }
  
  .price-item.total {
    padding-top: 10px;
    border-top: 1px solid #ebeef5;
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
  
  .total-price {
    color: #f56c6c;
    font-size: 18px;
  }
  
  /* 调整后的地址输入框样式 */
  .address-input-item {
    margin-bottom: 0;
  }
  
  .address-input {
    font-size: 16px;
  }
  
  .address-input ::v-deep .el-textarea__inner {
    min-height: 60px !important;
    height: 60px;
    font-size: 16px;
    line-height: 1.5;
    padding: 10px 15px;
  }
  </style>
