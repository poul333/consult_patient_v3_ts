<script setup lang="ts">
import { bindMobile, loginByQQ } from '@/services/user'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mobileRules, codeRules } from '@/utils/rules'
import { showSuccessToast } from 'vant'
import type { User } from '@/types/user'
import { useUserStore } from '@/stores'
import { useSendMobileCode } from '@/composable'

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
const { form, time, send } = useSendMobileCode(mobile, 'bindMobile')

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
