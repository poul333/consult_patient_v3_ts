// 给components 下的全局组件，设置类型
import CpNavBar from '@/components/CpNavBar.vue'

declare module 'vue' {
  interface GlobalComponents {
    // 指定组件类型， typeof 从组件对象得到类型，设置给全局组件
    CpNavBar: typeof CpNavBar
  }
}