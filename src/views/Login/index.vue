<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showSuccessToast, showToast, type FormInstance } from 'vant'
import { loginByCode, loginByPassword, sendMobileCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useUserStore()

const agree = ref(false)
// 控制密码是否显示
const show = ref(false)
// 表单的数据
const mobile = ref('')
const password = ref('')
// 表单submit事件
// 同时支持 密码登录 和 短信登录
const login = async () => {
  // 判断用户是否勾选协议 轻提示
  if (!agree.value) return showToast('请勾选协议')
  // 判断登录情况
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value)
  store.setUser(res.data)
  router.replace((route.query.returnUrl as string) || '/user')
  showSuccessToast('登录成功')
}

// 密码或短信登录的切换
const isPass = ref(true)
const code = ref('')
const form = ref<FormInstance | null>(null)
const time = ref(0) // 倒计时
let timerId: number = -1 // 定时器
const send = async () => {
  if (time.value > 0) return // 倒计时期间无法发送验证码
  await form.value?.validate('mobile') // 校验手机号
  await sendMobileCode(mobile.value, 'login') //发送请求

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

// onMounted(() => {
//   // 组件渲染完毕，使用QC生成QQ登录按钮，目的得到跳转链接
//   QC.Login({
//     btnId: 'qq'
//   })
// })
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      rightText="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>

    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a @click="isPass = !isPass" href="javascript:;">
        <span>{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>

    <!-- form 表单 -->
    <van-form autocomplete="off" @submit="login" ref="form">
      <van-field
        name="mobile"
        v-model="mobile"
        type="text"
        :rules="mobileRules"
        placeholder="请输入手机号"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        :type="show ? 'text' : 'password'"
        :rules="passwordRules"
        placeholder="请输入密码"
      >
        <template #button>
          <cp-icon
            @click="show = !show"
            :name="`login-eye-${show ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <van-field
        v-model="code"
        v-else
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #button>
          <span :class="{ active: time > 0 }" class="btn-send" @click="send">{{
            time > 0 ? `${time}s后发送验证码` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <!-- <div id="qq"></div> -->
      <a
        @click="store.setReturnUrl($route.query.returnUrl as string)"
        href="https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fconsult-patients.itheima.net%2Flogin%2Fcallback"
        class="icon"
      >
        <img src="@/assets/qq.svg" alt="" />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
