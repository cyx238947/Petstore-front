<template>
  <div class="main-content">
    <div style="display: flex; width: 70%; background-color: white; margin: 30px auto; border-radius: 20px">
      <div style="flex: 1; padding: 0 20px">
        <div style="font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid">Birds</div>
        <div style="margin: 20px 0">
          <el-row :gutter="20">
           
            <el-col :span="6">
              <img src="@/assets/imgs/bg.jpg" alt="" style="width: 100%; height: 175px; border-radius: 10px; border: #cccccc 1px solid">
              <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 180px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">bird1</div>
              <div style="margin-top: 5px; font-size: 20px; color: #FF5000FF">￥ 10 <button style="margin-left: 50px;">加入购物车</button></div>
            </el-col>

            <el-col :span="6">
              <img src="@/assets/imgs/bg.jpg" alt="" style="width: 100%; height: 175px; border-radius: 10px; border: #cccccc 1px solid">
              <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 180px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">bird1</div>
              <div style="margin-top: 5px; font-size: 20px; color: #FF5000FF">￥ 10</div>
            </el-col>

            <el-col :span="6">
              <img src="@/assets/imgs/bg.jpg" alt="" style="width: 100%; height: 175px; border-radius: 10px; border: #cccccc 1px solid">
              <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 180px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">bird1</div>
              <div style="margin-top: 5px; font-size: 20px; color: #FF5000FF">￥ 10</div>
            </el-col>

            <el-col :span="6">
              <img src="@/assets/imgs/bg.jpg" alt="" style="width: 100%; height: 175px; border-radius: 10px; border: #cccccc 1px solid">
              <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 180px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">bird1</div>
              <div style="margin-top: 5px; font-size: 20px; color: #FF5000FF">￥ 10</div>
            </el-col>

            <el-col :span="6">
              <img src="@/assets/imgs/bg.jpg" alt="" style="width: 100%; height: 175px; border-radius: 10px; border: #cccccc 1px solid">
              <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 180px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">bird1</div>
              <div style="margin-top: 5px; font-size: 20px; color: #FF5000FF">￥ 10</div>
            </el-col>

            <el-col :span="6">
              <img src="@/assets/imgs/bg.jpg" alt="" style="width: 100%; height: 175px; border-radius: 10px; border: #cccccc 1px solid">
              <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 180px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">bird1</div>
              <div style="margin-top: 5px; font-size: 20px; color: #FF5000FF">￥ 10</div>
            </el-col>


          </el-row>
        </div>
      </div>
      <div style="width: 250px; padding: 0 20px; border-left: #cccccc 1px solid">
        <div style="font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid">猜你喜欢</div>
        <div style="margin: 20px 0; padding: 0 10px">
          <div style="margin-bottom: 20px">
            <img  src="@/assets/imgs/bg.jpg" alt="" style="width: 100%; height: 175px; border-radius: 10px; border: #cccccc 1px solid">
            <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 180px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">111</div>
            <div style="margin-top: 5px; font-size: 20px; color: #FF5000FF">￥ 44/件</div>
          </div>
          <div>
            <img  src="@/assets/imgs/bg.jpg" alt="" style="width: 100%; height: 175px; border-radius: 10px; border: #cccccc 1px solid">
            <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 180px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">222</div>
            <div style="margin-top: 5px; font-size: 20px; color: #FF5000FF">￥ 44/件</div>
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
  mounted() {

  },
  
  methods: {
    
  }
}
</script>