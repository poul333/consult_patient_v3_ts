import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义用户状态仓库
export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 用户信息
    const user = ref<User>()
    // 修改用户信息
    const setUser = (u: User) => {
      user.value = u
    }
    // 删除用户信息
    const delUser = () => {
      user.value = undefined
    }
    // 记录回跳地址
    const returnUrl = ref('')
    const setReturnUrl = (url: string) => (returnUrl.value = url)
    return { user, setUser, delUser, returnUrl, setReturnUrl }
  },
  {
    // 开启持久化，(使用本地存储，默认localStoage)
    persist: true
  }
)
