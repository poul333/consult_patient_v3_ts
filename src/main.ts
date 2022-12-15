import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

import 'vant/lib/index.css' // vant 全局样式
import './styles/main.scss'

const app = createApp(App)

// 使用 pinia,
app.use(pinia)
app.use(router)

app.mount('#app')
