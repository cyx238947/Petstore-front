<template>
  <div class="main-content">
    <div style="width: 60%; background-color: white; min-height: 1000px; margin: 20px auto; border-radius: 20px">
      <div style="padding: 15px 20px">
        <el-row :gutter="20">
          <el-col :span="12">
            <img :src="goodsData.img" alt="" style="width: 100%; height: 400px; border-radius: 20px">
          </el-col>
          <el-col :span="12">
            <div style="font-size: 20px; font-weight: 900; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">{{goodsData.name}}</div>
            <div style="color: #666666FF; margin-top: 5px">销量：{{goodsData.count}}</div>
            <div style="color: red; margin-top: 15px">折后价：<span style="font-size: 20px">{{goodsData.price}} / {{goodsData.unit}}</span></div>
            <div style="margin-top: 20px">
              <img src="@/assets/imgs/right.jpg" alt="" style="width: 70%; height: 130px; border-radius: 15px">
            </div>
            <div style="color: #666666FF; margin-top: 20px">分类：{{goodsData.typeName}}</div>
            <div style="color: #666666FF; margin-top: 20px">
              <el-button type="warning">加入购物车</el-button>

            </div>
          </el-col>
        </el-row>
      </div>
    
    </div>
  </div>
</template>

<script>

export default {

  data() {
    // let goodsId = this.$route.query.id
    return {

    }
  },
  mounted() {
    // this.loadGoods()
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {

  }
}
</script>