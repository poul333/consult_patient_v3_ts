import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
// 加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false
})

// import.meta.env.BASE_URL 路由基准路径  create-vue 脚手架提供的数据(环境变量)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '我的' }
        }
      ]
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '健康档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: { title: '选择科室' }
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '图文问诊' }
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: { title: '问诊支付' }
    }
  ]
})

// 访问权限控制
router.beforeEach((to) => {
  NProgress.start() // 开启加载进度条
  // return true,或啥也不写，就是放行
  // 拦截到某个页面 => return '路由地址'
  const store = useUserStore()
  // 白名单
  const whiteList = ['/login']
  // 如果没有登录，且访问的不是白名单里面的路径，拦截到登录
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
})

// 后置守卫 => 页面标题控制
router.afterEach((to) => {
  document.title = `${to.meta.title}-优医问诊` || ''
  NProgress.done() // 关闭加载进度条
})

export default router
