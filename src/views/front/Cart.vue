<template>
  <div class="main-content">
    <div style="width: 70%; background-color: white; margin: 30px auto; border-radius: 20px">
      <div style="padding-bottom: 10px">
        <div style="display: flex; font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid;">
          <div style="margin-left: 20px; flex: 1">全部商品（20件）</div>

          <div style="flex: 1; font-size: 16px; text-align: right; padding-right: 20px">
            已选商品 ￥10 <el-button type="danger" round @click="pay">下单</el-button>
          </div>
        </div>
        <div style="margin: 20px 0; padding: 0 50px">
          <div class="table">
            <el-table :data="goodsData" strip @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="商品图片" width="120px">
                <template v-slot="scope">
                  <el-image style="width: 80px; height: 60px; border-radius: 3px" v-if="scope.row.goodsImg"
                            :src="scope.row.goodsImg" :preview-src-list="[scope.row.goodsImg]"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称" width="240px">
                <template v-slot="scope">
                  <a :href="'/front/detail?id=' + scope.row.goodsId">{{scope.row.goodsName}}</a>
                </template>
              </el-table-column>

              <el-table-column prop="goodsPrice" label="商品价格"></el-table-column>
              <el-table-column prop="num" label="选择数量">
                <template v-slot="scope">
                  <el-input-number v-model="scope.row.num" style="width: 100px" @change="handleChange(scope.row)" :min="1"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作"  width="180">
                <template v-slot="scope">
                  <el-button size="mini" type="danger" plain @click="del(scope.row.id)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination" style="margin-top: 20px">
              <el-pagination
                  background
                  @current-change="handleCurrentChange"
                  :current-page="pageNum"
                  :page-sizes="[5, 10, 20]"
                  :page-size="pageSize"
                  layout="total, prev, pager, next"
                  :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {

    }
  },

  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    
    navTo(url) {
      location.href = url
    },
   
    }
  }

</script>