import { type Ref, ref, onMounted, onUnmounted } from 'vue'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import {
  cancelOrder,
  deleteOrder,
  followTarget,
  getPrescriptionPic
} from '@/services/consult'
import {
  showFailToast,
  showImagePreview,
  showSuccessToast,
  type FormInstance
} from 'vant'
import { OrderType } from '@/enums'
import type { OrderDetail } from '@/types/order'
import { getMedicalOrderDetail } from '@/services/order'
import { sendMobileCode } from '@/services/user'
import type { CodeType } from '@/types/user'

// 关注hook封装
export const useFollow = (type: FollowType = 'doc') => {
  // 关注逻辑
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followTarget(item.id, type)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

// 查看处方图片hook
export const useShowPrescription = () => {
  const showPrescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)
      showImagePreview([res.data?.url])
    }
  }
  return { showPrescription }
}

// 取消订单hook
export const useCancelOrder = () => {
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
  return { loading, cancelConsultOrder }
}

// 删除订单hook
export const useDeleteOrder = (cb: () => void) => {
  const loading = ref(false)
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    loading.value = true
    try {
      await deleteOrder(item.id)
      // 成功，通知父组件删除这条信息，提示，详情就是跳转列表页面
      // emit('on-delete', item.id)
      cb && cb()
      showSuccessToast('删除成功')
    } catch (error) {
      showFailToast('删除失败')
    } finally {
      loading.value = false
    }
  }
  return { loading, deleteConsultOrder }
}

// 获取订单详情hook
export const useOrderDetail = (id: string) => {
  const order = ref<OrderDetail>()
  const loading = ref(false)
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res.data
    } finally {
      loading.value = false
    }
  })
  return { order, loading }
}

// 短信验证码hook
export const useSendMobileCode = (mobile: Ref<string>, type: CodeType) => {
  const form = ref<FormInstance | null>(null)
  const time = ref(0) // 倒计时
  let timerId: number = -1 // 定时器
  const send = async () => {
    if (time.value > 0) return // 倒计时期间无法发送验证码
    await form.value?.validate('mobile') // 校验手机号
    await sendMobileCode(mobile.value, type) //发送请求

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

  return { form, time, send }
}
