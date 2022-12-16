<!-- 封装NavBar组件 -->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps<{
  title?: string
  rightText?: string
}>()

const emit = defineEmits<{
  (e: 'click-right'): void
}>()

const onClickLeft = () => {
  // 实现返回
  // 如果有历史记录，back()返回，没有则返回首页
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
const onClickRight = () => {
  // 右侧按钮逻辑
  emit('click-right')
}
</script>

<template>
  <van-nav-bar
    left-arrow
    fixed
    @click-left="onClickLeft"
    :title="title"
    :right-text="rightText"
    @click="onClickRight"
  ></van-nav-bar>
</template>

<style scoped lang="scss">
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
