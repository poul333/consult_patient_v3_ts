<script setup lang="ts">
// 提供props属性，确定使用哪个图标，使用规则： 文件夹名——图片名称
defineProps<{
  name: string
}>()
</script>

<template>
  <svg aria-hidden="true" class="cp-icon">
    <!-- #icon-文件夹名称-图片名称 -->
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<style lang="scss" scoped>
.cp-icon {
  // 通过font-size 控制图片大小
  width: 1em;
  height: 1em;
}
</style>
