<template>
  <div class="main-content">
    <div style="height:80px;background-color:rgb(255,239,213);"></div>
    <div style="display: flex;">
      <div class="left"></div>
      <div style="width: 66%;height: 1000px;background-color: white;">

        <div style="color: #FE0137FF; margin: 15px 0 15px 18px; font-weight: bold; font-size: 20px">主题市场</div>
        <div style="display: flex; margin: 0 25px;height: 1000px;">
          <div style="flex: 2">

            <div style="display: flex; color: #666666FF; margin: 14px 0">
              <img src="@/assets/imgs/bg.jpg" alt="" style="height: 20px; width: 20px">
              <div style="margin-left: 10px; font-size: 14px"><a href="javascript:;" @click="navTo('/front/products', {categoryId: 'BIRDS'})">Birds</a></div>
            </div>

            <div style="display: flex; color: #666666FF; margin: 14px 0">
              <img src="@/assets/imgs/bg.jpg" alt="" style="height: 20px; width: 20px">
              <div style="margin-left: 10px; font-size: 14px"><a href="javascript:;" @click="navTo('/front/products', {categoryId: 'CATS'})">Cats</a></div>
            </div>

            <div style="display: flex; color: #666666FF; margin: 14px 0">
              <img src="@/assets/imgs/bg.jpg" alt="" style="height: 20px; width: 20px">
              <div style="margin-left: 10px; font-size: 14px"><a href="javascript:;" @click="navTo('/front/products', {categoryId: 'DOGS'})">Dogs</a></div>
            </div>

            <div style="display: flex; color: #666666FF; margin: 14px 0">
              <img src="@/assets/imgs/bg.jpg" alt="" style="height: 20px; width: 20px">
              <div style="margin-left: 10px; font-size: 14px"><a href="javascript:;" @click="navTo('/front/products', {categoryId: 'FISH'})">Fish</a></div>
            </div>

            <div style="display: flex; color: #666666FF; margin: 14px 0">
              <img src="@/assets/imgs/bg.jpg" alt="" style="height: 20px; width: 20px">
              <div style="margin-left: 10px; font-size: 14px"><a href="javascript:;" @click="navTo('/front/products', {categoryId: 'REPTILES'})">Reptiles</a></div>
            </div>

            <div style="display: flex; color: #666666FF; margin: 24px 0">
              <img src="@/assets/imgs/bg.jpg" alt="" style="height: 20px; width: 20px">
              <div style="margin-left: 10px; font-size: 14px"><a href="javascript:;" @click="navTo('/front/products')" style="color: #FE0137FF; font-weight: bold;">全部商品</a></div>
            </div>

          </div>
          <div style="flex: 5; height: 300px;margin-top: 15px;">
           
            <!-- 自动展示窗口 -->
            <div>
              <el-carousel height="500px" style="border-radius: 10px">
                <el-carousel-item v-for="item in carousel_top">
                  <img :src="item" alt="" style="width: 100%; height: 500px; border-radius: 10px" >
                </el-carousel-item>
              </el-carousel>
            </div>

            <div style="margin-top: 30px;display: flex;">
              <div style="flex: 1;">
                <el-carousel height="300px" style="border-radius: 10px">
                <el-carousel-item v-for="item in carousel_top">
                  <img @click="navTo('/front/detail') " :src="item" alt="" style="width: 100%; height: 200px; border-radius: 10px">
                </el-carousel-item>
              </el-carousel>
            </div>
            

            <div style="flex: 1;margin-left: 5px;">
                <el-carousel height="300px" style="border-radius: 10px">
                <el-carousel-item v-for="item in carousel_top">
                  <img :src="item" alt="" style="width: 100%; height: 200px; border-radius: 10px">
                </el-carousel-item>
              </el-carousel>
            </div>

            </div>
          </div>
         
          <div style="flex: 3; background-color: rgb(243,243,243);margin-top: 15px;margin-left: 15px;height: 900px;">
            <div style="text-align: center;margin-top: 30px;">
              <img @click="navTo('/front/person')" src="@/assets/imgs/avatar.png" alt="" style="width:120px;height: 120px; border-radius: 50%">
              <div style="margin-top: 10px;">Hi,用户</div>
            </div>

            <div style="margin-top: 20px;padding: 0 15px;">
              <img src="@/assets/imgs/right.jpg" alt="" style="height: 150px;width: 100%;border-radius: 20px;" >
            </div>

            <div style="display: flex;margin-top: 50px;">
               <div style="flex: 1;text-align: center;">
                <a href="javascript:;" @click="navTo('/front/cart')"><img src="@/assets/imgs/购物车.jpg" alt="" style="height: 25px;width: 25px;"></a>
                <div>购物车</div>
               </div>
               <div style="flex: 1;text-align: center;">
                <a href="javascript:;" @click="navTo('/front/products')"><img src="@/assets/imgs/dog3.gif" alt="" style="height: 25px;width: 25px;"></a>
                <div>商品展示</div>
               </div>
               <div style="flex: 1;text-align: center;">
                <a href="javascript:;" @click="navTo('/front/order')"><img src="@/assets/imgs/订单.jpg" alt="" style="height: 25px;width: 25px;"></a>
                <div>订单</div>
               </div>
            </div>

          </div>

        </div>

      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
      user:JSON.parse(localStorage.getItem('xm-user')||'{}'),
      typeData: [],
      carousel_top: [
        require('@/assets/imgs/bird1.gif'),
        require('@/assets/imgs/cat1.gif'),
        require('@/assets/imgs/dog1.gif'),
      ],
    }
  },
  mounted() {

  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    navTo(url, query = {}) {
      this.$router.push({
        path: url,
        query: query
      });
    },

  }
}
</script>

<style scoped>
.main-content {
  min-height: 100vh;
  /*overflow: hidden;*/
  background-size: 100%;
  background-image: url('@/assets/imgs/img.jpg');
}
.left {
  width: 17%;
  background-repeat: no-repeat;
  background-image: url('@/assets/imgs/left-img.jpg');
}
.right {
  width: 17%;
  background-repeat: no-repeat;
  background-image: url('@/assets/imgs/right-img.jpg')
}
.el-col-5{
  width: 20%;
  max-width: 20%;
  padding: 10px 10px;
}
</style>