<script setup lang="ts">
import { ref } from 'vue'
import { OrderType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
import { cancelOrder, deleteOrder } from '@/services/consult'
import { showFailToast, showSuccessToast } from 'vant'
import { useShowPrescription } from '@/composable'

defineProps<{
  item: ConsultOrderItem
}>()
const { showPrescription } = useShowPrescription()
// const showPopover = ref(false)
// const actions = computed(() => [
//   { text: '查看处方', disabled: !props.item.prescriptionId },
//   { text: '删除订单' }
// ])

// const onSelect = (actions: { text: string }, i: number) => {
//   // 删除订单
//   if (i === 1) {
//     deleteConsultOrder(props.item)
//   }
//   // 查看处方图片
//   if (i === 0) {
//     showPrescription(props.item.prescriptionId)
//   }
// }

// 取消订单
const loading = ref(false)
const cancelConsultOrder = async (item: ConsultOrderItem) => {
  loading.value = true
  try {
    await cancelOrder(item.id)
    item.status = OrderType.ConsultCancel
    item.statusValue = '已取消'
    showSuccessToast('取消成功')
  } catch (error) {
    showFailToast('取消失败')
  } finally {
    loading.value = false
  }
}

// 删除订单
const emit = defineEmits<{
  (e: 'on-delete', id: string): void
}>()
const delLoading = ref(false)
const deleteConsultOrder = async (item: ConsultOrderItem) => {
  delLoading.value = true
  try {
    await deleteOrder(item.id)
    // 通知父组件，删除订单
    emit('on-delete', item.id)
    showSuccessToast('删除成功')
  } catch (error) {
    showFailToast('删除失败')
  } finally {
    delLoading.value = false
  }
}
</script>

<template>
  <div class="consult-item">
    <div class="head van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p>极速问诊（自动分配医生）</p>
      <span
        :class="{
          orange: item.status === OrderType.ConsultPay,
          green: item.status === OrderType.ConsultChat
        }"
        >{{ item.statusValue }}</span
      >
    </div>
    <div class="body" @click="$router.push(`/user/consult/${item.id}`)">
      <div class="body-row">
        <div class="body-label">病情描述</div>
        <div class="body-value">{{ item.illnessDesc }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">价格</div>
        <div class="body-value">¥ {{ item.payment.toFixed(2) }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">创建时间</div>
        <div class="body-value tip">{{ item.createTime }}</div>
      </div>
    </div>
    <!-- // 待支付：取消问诊+去支付 -->
    <div class="foot" v-if="item.status === OrderType.ConsultPay">
      <van-button
        class="gray"
        plain
        size="small"
        round
        :loading="loading"
        @click="cancelConsultOrder(item)"
        >取消问诊</van-button
      >
      <van-button
        type="primary"
        plain
        size="small"
        :to="`/user/consult/${item.id}`"
        round
        >去支付</van-button
      >
    </div>
    <!-- // 待接诊：取消问诊+继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultWait">
      <van-button
        class="gray"
        plain
        size="small"
        round
        :loading="loading"
        @click="cancelConsultOrder(item)"
        >取消问诊</van-button
      >
      <van-button
        type="primary"
        plain
        size="small"
        :to="`/room?orderId=${item.id}`"
        round
        >继续沟通</van-button
      >
    </div>
    <!-- // 咨询中：查看处方（如果开了）+继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultChat">
      <van-button
        class="gray"
        plain
        size="small"
        v-if="item.prescriptionId"
        round
        @click="showPrescription(item.prescriptionId)"
        >查看处方</van-button
      >
      <van-button
        type="primary"
        plain
        size="small"
        :to="`/room?orderId=${item.id}`"
        round
        >继续沟通</van-button
      >
    </div>
    <!-- // 已完成：更多（查看处方，如果开了，删除订单）+问诊记录+（未评价?写评价:查看评价） -->
    <div class="foot" v-if="item.status === OrderType.ConsultComplete">
      <!-- <div class="more">
        <van-popover
          v-model:show="showPopover"
          :actions="actions"
          @select="onSelect"
          placement="top-start"
        >
          <template #reference> 更多 </template>
        </van-popover>
      </div> -->
      <cp-consult-more
        :disabled="!item.prescriptionId"
        @on-delete="deleteConsultOrder(item)"
        @on-preview="showPrescription(item.prescriptionId)"
      ></cp-consult-more>
      <van-button
        class="gray"
        plain
        size="small"
        :to="`/room?orderId=${item.id}`"
        round
        >问诊记录</van-button
      >
      <van-button
        v-if="!item.evaluateId"
        type="primary"
        plain
        size="small"
        round
        >写评价</van-button
      >
      <van-button v-else class="gray" plain size="small" round
        >查看评价</van-button
      >
    </div>
    <!-- // 已取消：删除订单+咨询其他医生 -->
    <div class="foot" v-if="item.status === OrderType.ConsultCancel">
      <van-button
        class="gray"
        plain
        size="small"
        round
        :loading="delLoading"
        @click="deleteConsultOrder(item)"
        >删除订单</van-button
      >
      <van-button type="primary" plain size="small" to="/" round
        >咨询其他医生</van-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-item {
  border-radius: 4px;
  box-shadow: 0px 0px 22px 0px rgba(245, 245, 245, 0.1);
  background-color: #fff;
  margin-bottom: 10px;
  .head {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    .img {
      width: 20px;
      height: 20px;
    }
    > p {
      flex: 1;
      font-size: 15px;
      padding-left: 10px;
    }
    > span {
      color: var(--cp-tag);
      &.orange {
        color: #f2994a;
      }
      &.green {
        color: var(--cp-primary);
      }
    }
  }
  .body {
    padding: 15px 15px 8px 15px;
    .body-row {
      display: flex;
      margin-bottom: 7px;
    }
    .body-label {
      width: 62px;
      font-size: 13px;
      color: var(--cp-tip);
    }
    .body-value {
      width: 250px;
      &.tip {
        color: var(--cp-tip);
      }
    }
  }
  .foot {
    padding: 0 15px 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .van-button {
      margin-left: 10px;
      padding: 0 16px;
      &.gray {
        color: var(--cp-text3);
        background-color: var(--cp-bg);
      }
    }
    .more {
      color: var(--cp-tag);
      flex: 1;
      font-size: 13px;
    }
  }
}
</style>
