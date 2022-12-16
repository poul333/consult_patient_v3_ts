<script setup lang="ts">
const fn = () => {
  console.log('组件业务')
}
</script>

<template>
  <cp-nav-bar title="登录" rightText="保存" @click-right="fn"></cp-nav-bar>
  <cp-nav-bar></cp-nav-bar>
</template>

<style lang="scss" scoped></style>
