// vue-router 自定义类型拓展

// typings.d.ts or router.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}
