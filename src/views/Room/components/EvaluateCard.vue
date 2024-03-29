<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { Ref } from 'vue'
import type { EvaluateDoc } from '@/types/room'
import type { ConsultOrderItem } from '@/types/consult'
import { showToast } from 'vant'
import { evaluateConsultOrder } from '@/services/consult'

defineProps<{
  evaluateDoc?: EvaluateDoc
}>()

// 评价需要提供的数据
const score = ref(0)
const content = ref('')
const anonymousFlag = ref(false)
const disabled = computed(() => score.value === 0 || !content.value)

const consult = inject<Ref<ConsultOrderItem>>('consult')
const completeEva = inject<(score: number) => void>('completeEva')
const submit = async () => {
  if (!score.value) return showToast('请选择评分')
  if (!content.value) return showToast('请输入评语')
  if (!consult?.value) return showToast('问诊订单未找到')
  if (consult.value.docInfo?.id) {
    // 发送请求
    await evaluateConsultOrder({
      docId: consult.value.docInfo?.id,
      orderId: consult.value.id,
      score: score.value,
      content: content.value,
      anonymousFlag: anonymousFlag.value ? 1 : 0
    })
    // 评价成功
    completeEva && completeEva(score.value)
  }

  console.log(consult?.value.id)
}
</script>

<template>
  <!-- 展示卡片 -->
  <div class="evalutate-card" v-if="evaluateDoc">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :modelValue="evaluateDoc.score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
  </div>

  <!-- 收集评价 -->
  <div class="evalutate-card" v-else>
    <p class="title">感谢您的评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      v-model="score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
    <van-field
      v-model="content"
      type="textarea"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button
        :class="{ disabled }"
        type="primary"
        size="small"
        round
        @click="submit"
      >
        提交评价
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.evalutate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;
  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }
  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }
  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    ::v-deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }
        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }
        height: 16px;
      }
      .van-button {
        padding: 0 16px;
        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>
