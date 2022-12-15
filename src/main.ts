import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

import './styles/main.scss'

const app = createApp(App)

// 使用 pinia,
app.use(pinia)
app.use(router)

app.mount('#app')
