<script setup lang="ts">
import { bindMobile, loginByQQ, sendMobileCode } from '@/services/user'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { mobileRules, codeRules } from '@/utils/rules'
import { type FormInstance, showSuccessToast } from 'vant'
import type { User } from '@/types/user'
import { useUserStore } from '@/stores'

const openId = ref('')
const isBind = ref(false)
onMounted(() => {
  if (window.QC.Login.check()) {
    // 代表QQ已经登录
    window.QC.Login.getMe((id) => {
      openId.value = id
      //   进行登录
      loginByQQ(id)
        .then((res) => {
          // 如果绑定过，也将数据进行存储
          loginSuccess(res.data)
        })
        .catch(() => {
          console.log('登录失败')
          isBind.value = true
        })
    })
  }
})

// 短信验证码
const mobile = ref('')
const code = ref('')
const form = ref<FormInstance | null>(null)
const time = ref(0) // 倒计时
let timerId: number = -1 // 定时器
const send = async () => {
  if (time.value > 0) return // 倒计时期间无法发送验证码
  await form.value?.validate('mobile') // 校验手机号
  await sendMobileCode(mobile.value, 'bindMobile') //发送请求

  time.value = 60
  if (timerId !== -1) clearInterval(timerId)
  timerId = setInterval(() => {
    time.value--
    if (time.value <= 0) clearInterval(timerId)
  }, 1000)
}
// 销毁定时器
onUnmounted(() => {
  clearInterval(timerId)
})

// 登录成功
const store = useUserStore()
const router = useRouter()
const loginSuccess = (user: User) => {
  //存储用户信息
  store.setUser(user)
  //   登录后回跳地址
  router.replace(store.returnUrl || '/user')
  //   跳转后将回跳地址置空
  store.setReturnUrl('')
  //   提示登录成功
  showSuccessToast('登录成功')
}

// 绑定请求
const bind = async () => {
  const res = await bindMobile({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res.data)
}
</script>

<template>
  <div class="login-page" v-if="isBind">
    <cp-nav-bar></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form" @submit="bind">
      <van-field
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
      ></van-field>
      <van-field
        name="code"
        v-model="code"
        :rules="codeRules"
        placeholder="请输入验证码"
      >
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">
          立即绑定
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
