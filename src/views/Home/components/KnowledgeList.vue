<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type {
  KnowledgeList,
  KnowledgeParams,
  KnowledgeType
} from '@/types/consult'
import { getKnowledgePage } from '@/services/consult'

const props = defineProps<{
  type: KnowledgeType
}>()
// 实现加载更多
const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)
// 查询参数
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
const onLoad = async () => {
  // 发请求
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  loading.value = false
  // 判断是否加载完成
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    // 将页码进行自增，用于发请求获取下一页数据
    params.value.current++
  }
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
