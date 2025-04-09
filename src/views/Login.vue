<template>
  <div class="container">
    <div style="width: 400px; padding: 30px; background-color: white; border-radius: 5px;">
      <div style="text-align: center; font-size: 20px; margin-bottom: 20px; color: #333">欢迎使用</div>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入账号" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" show-password  v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%; background-color: #333; border-color: #333; color: white" @click="login">登 录</el-button>
        </el-form-item>
<!--        <div style="display: flex; align-items: center">-->
<!--          <div style="flex: 1"></div>-->
<!--          <div style="flex: 1; text-align: right">-->
<!--            还没有账号？请 <a href="/register">注册</a>-->
<!--          </div>-->
<!--        </div>-->
      </el-form>
    </div>
   
  </div>
</template>

<script>
import request from '@/utils/request';
import { setToken } from '@/utils/auth';
export default {
  name: "Login",
  data() {
    return {
      dialogVisible: true,
      form: { id:1, valid:true, role:['ADMIN'] , username:"", password:"" },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  async created() {
   
    
  },
  methods: {
    async login() {
      try {
        console.log('asdasdawawdwqsa')
        const response = await request.post("/tokens", this.form);
        
        console.log(response);
        console.log(response.headers.authorization);
        const token = response.headers.authorization.split(' ')[1];
        setToken(token);
        this.$router.push('/dashboard'); // 跳转到主页
      } catch (error) {
        console.log(error);
        alert('登录失败');
      }
    }
  }


  //   login() {
  //     console.log('assxsa');
  //     this.$refs['formRef'].validate((valid) => {
  //       console.log("asdas");
  //       if (valid) {
  //         // 验证通过
  //         this.$request.post('/user', this.form).then(res => {
  //           const token = response.headers['authorization'].split(' ')[1];
  //           localStorage.setItem('jwt_token', token); // 存储 Token
  //           this.$router.push('/front/home'); // 跳转到主页
  //         })
  //       }
  //     })
  //   }
  // }
}
</script>

<style scoped>
.container {
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/imgs/bg.jpg");
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
a {
  color: #2a60c9;
}
</style>