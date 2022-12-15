import { createRouter, createWebHistory } from 'vue-router'

// import.meta.env.BASE_URL 路由基准路径  create-vue 脚手架提供的数据(环境变量)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
