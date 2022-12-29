<script setup lang="ts">
import { ref } from 'vue'
import type { ConsultType } from '@/enums'
import ConsultItem from './ConsultItem.vue'
import type { ConsultOrderParams, ConsultOrderItem } from '@/types/consult'
import { getConsultOrderList } from '@/services/consult'
const props = defineProps<{
  type: ConsultType
}>()
// 准备查询参数
const params = ref<ConsultOrderParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])
// 加载效果
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  list.value.push(...res.data.rows)
  //  如果页码不足
  if (params.value.current < res.data.pageTotal) {
    // 准备下一页页码
    params.value.current++
  } else {
    // 加载完毕
    finished.value = true
  }
  loading.value = false
}
// 删除订单
const onDelete = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item
        v-for="item in list"
        :key="item.id"
        :item="item"
        @on-delete="onDelete"
      ></consult-item>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
