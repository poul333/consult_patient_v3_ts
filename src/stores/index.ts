// 导出pinia

import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate' // pinia 本地存储插件

const pinia = createPinia()

// 使用 pinia 仓库持久化插件
pinia.use(persist)

export default pinia

// 引入并导出user模块   => 完整写法
// import { useUserStore } from './user'
// export { useUserStore }
//  将user模块统一导入并导出    => 简写
export * from './user'
