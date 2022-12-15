// 二次封装axios
import router from '@/router'
import { useUserStore } from '@/stores'
import axios, { type Method } from 'axios'
import { showToast } from 'vant'
import type { User } from '@/types/user'

// 1. axios 的配置
// 1.1 创建新的axios 实例，配置基准地址，配置响应超时时间
const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 1.2 添加请求拦截器，在请求头携带token
instance.interceptors.request.use(
  (config) => {
    // 修改config
    // 获取token => 获取user
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      // 如果有token 并且 请求头存在
      config.headers['Authorization'] = `Bearer ${store.user?.token}`
    }
    return config
  },
  (err) => Promise.reject(err) // 请求失败返回失败Promise
)

// 1.3 添加响应拦截器，判断业务是否成功，剥离无效数据，401错误拦截去登录页面
instance.interceptors.response.use(
  (res) => {
    // status = 200,代表响应成功        res.data.code = 10000，代表业务成功
    // 如果 code 不等于 10000，使用vant轻提示，报错阻断程序
    if (res.data.code !== 10000) {
      showToast(res.data.message || '网络异常')
      return Promise.reject(res.data)
    }
    // 业务逻辑成功 剥离无效数据
    return res.data
  },
  (err) => {
    //  处理响应错误
    // 跳转登录页面，登录成功后，跳回登录前的页面（默认为首页）
    if (err.response.status === 401) {
      // 需要删除当前用户信息
      const store = useUserStore()
      store.delUser()
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }

    return Promise.reject(err)
  }
)

// 2. 请求工具函数
// 2.1 参数：url    method   submitData
// 2.2 返回 instance 调用接口的Promise 对象
// const request = (url: string, method: string, submitData: object) => {
//   return instance.request({
//     url,
//     method,
//     // 区分get 和其他请求post
//     // get 提交数据，选项：params
//     // 其他请求post 提交数据，选项：data
//     [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
//   })
// }

type Data<T> = {
  code: string
  message: string
  data: T
}

const request = <T>(
  url: string,
  method: Method = 'get',
  submitData?: object
) => {
  // 泛型的第二个参数，可以自定义响应数据类型
  return instance.request<T, Data<T>>({
    url,
    method,
    // 区分get 和其他请求post
    // get 提交数据，选项：params
    // 其他请求post 提交数据，选项：data
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

export { instance, baseURL, request }
