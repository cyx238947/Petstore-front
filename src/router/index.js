import Vue from 'vue'
import VueRouter from 'vue-router'
import { checkToken } from '@/utils/auth'

Vue.use(VueRouter)

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Manager',
    // component: () => import('../views/Manager.vue'),

    redirect: '/front' // 重定向到主页

    // children: [
    //   { path: '403', name: 'NoAuth', meta: { name: '无权限' }, component: () => import('../views/manager/403') },
    //   { path: 'home', name: 'Home', meta: { name: '系统首页' }, component: () => import('../views/manager/Home') },
    //   { path: 'admin', name: 'Admin', meta: { name: '管理员信息' }, component: () => import('../views/manager/Admin') },
    //   { path: 'adminPerson', name: 'AdminPerson', meta: { name: '个人信息' }, component: () => import('../views/manager/AdminPerson') },
    //   { path: 'password', name: 'Password', meta: { name: '修改密码' }, component: () => import('../views/manager/Password') },
    //   { path: 'notice', name: 'Notice', meta: { name: '公告信息' }, component: () => import('../views/manager/Notice') },
    // ]
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import('../views/Front.vue'),
    children: [
      { path: 'home', name: 'Home', meta: { name: '系统首页' }, component: () => import('../views/front/Home') },
      { path: 'person', name: 'Person', meta: { name: '个人信息' }, component: () => import('../views/front/Person') },
      { path: 'detail', name: 'Detail', meta: { name: '商品详情' }, component: () => import('../views/front/Detail') },
      { path: 'commodityDetail/:id?', name: 'commodityDetail', meta: { name: '详情' }, component: () => import('../views/front/commodityDetail') },
      { path: 'type', name: 'Type', meta: { name: '分类商品' }, component: () => import('../views/front/Type') },
      { path: 'cart', name: 'Cart', meta: { name: '购物车', requiresAuth:true }, component: () => import('../views/front/Cart') },
      { path: 'products', name: 'Products', meta: { name: '商品展示' }, component: () => import('../views/front/Products') },
      { path: 'order', name: 'Order', meta: { name: '订单' }, component: () => import('../views/front/Order') },
      { path: 'orderDetail', name: 'OrderDetail', meta: { name: '订单详情' }, component: () => import('../views/front/OrderDetail') },
      { path: 'orderCheck', name: 'OrderCheck', meta: { name: '确认订单' }, component: () => import('../views/front/OrderCheck') },
    ]
  },
  { path: '/login', name: 'Login', meta: { name: '登录' }, component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', meta: { name: '注册' }, component: () => import('../views/Register.vue') },
  { path: '*', name: 'NotFound', meta: { name: '无法访问' }, component: () => import('../views/404.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//注：不需要前台的项目，可以注释掉该路由守卫
//路由守卫
router.beforeEach((to ,from, next) => {
  if (to.meta.requiresAuth) {
    if(checkToken()){
      console.log('win');
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
})


export default router
