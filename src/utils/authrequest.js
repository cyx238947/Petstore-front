import axios from 'axios'
import router from "@/router";
import {checkToken, getToken } from './auth';

//需要用到jwt的页面来
// 创建可一个新的axios对象
const authrequest = axios.create({
    baseURL: process.env.VUE_APP_BASEURL,   // 后端的接口地址  ip:port
    withCredentials: true,
    timeout: 20000,                         // 30s请求超时

})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
authrequest.interceptors.request.use((config) => {


    config.headers['Content-Type'] = 'application/json;charset=utf-8';        // 设置请求头格式
    if(!checkToken()){
        window.location.href = "/login";
        localStorage.removeItem('jwt_token');
        throw new Error('reset');
    }

    // let token = `Bearer ${getToken()}`;
    // console.log(token);
    // config.headers['Authorization'] = token;  // 设置请求头
    // 判断是否有 token
    if (getToken()) {
        config.headers.Authorization = getToken(); // 带上token
        console.log('Authorization:', getToken());
    }
    return config;
}, error => {
    console.error('request error: ' + error); // for debug
    return Promise.reject(error);
});

// response 拦截器
authrequest.interceptors.response.use(
    (response) => {
        // ✅ 关键：直接暴露完整响应对象（包含 headers）
        return {
            data: response.data, // 业务数据
            headers: response.headers, // 响应头
            status: response.status, // 状态码
        };
    },
    (error) => {
        // 统一处理错误（如 401 跳转登录）
        if (error.response?.status === 40100000) {
            localStorage.removeItem("jwt_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);


export default authrequest
