<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import DoctorCard from './DoctorCard.vue'
import type { DoctorList } from '@/types/consult'
import { getDoctorPage } from '@/services/consult'

// 自己实现宽度变化 DoctorCard 卡片宽度跟着变化
// const width = ref(150)
// const setWidth = () => (width.value = (150 / 375) * window.innerWidth)
// onMounted(() => {
//   setWidth()
//   window.addEventListener('resize', setWidth)
// })
// onUnmounted(() => {
//   window.removeEventListener('resize', setWidth)
// })

// vueuse/core实现
const { width } = useWindowSize()

// 获取关注医生列表
// 获取第一页数据
const list = ref<DoctorList>([])
onMounted(async () => {
  const res = await getDoctorPage({ current: 1, pageSize: 5 })
  list.value = res.data.rows
})
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe
        :loop="false"
        :show-indicators="false"
        :width="(150 / 375) * width"
      >
        <van-swipe-item v-for="item in list" :key="item.id">
          <DoctorCard :item="item"></DoctorCard>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
