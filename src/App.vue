<script setup lang="ts">
import { Button as VanButton } from 'vant'
import { useUserStore } from './stores'
import type { User } from './types/user'
import { request } from './utils/request'

const store = useUserStore()
const login = () => {
  request<User>('login/password', 'post', {
    mobile: '13211112222',
    password: 'abc12345'
  })
    .then((res) => {
      store.setUser(res.data)
    })
    .catch((err) => {
      // 报错
      console.log(err)
    })
}

const getUserInfo = () => {
  request('patient/myUser').then((res) => {
    console.log(res)
  })
}
</script>

<template>
  <van-button type="primary" @click="login">登录</van-button>
  <van-button type="primary" @click="getUserInfo">用户信息</van-button>
</template>
