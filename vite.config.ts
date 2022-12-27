import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 默认 / 是基准路径
  // base: '/',
  plugins: [
    vue({
      reactivityTransform: true
    }),
    // 自动导入的插件，解析器可以是 vant element and-vue
    // 默认自动加载 component 下的组件，通用级别的组件
    Components({
      dts: false, // 是否开启自动生成类型声明文件
      // 原因：Toast Confirm 这类组件的样式还是需要单独引入，样式全局引入了，关闭自动引入
      resolvers: [VantResolver({ importStyle: false })]
    }),
    // 打包svg图标
    createSvgIconsPlugin({
      // 指定打包图标文件夹，绝对路径（NODE代码）
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
