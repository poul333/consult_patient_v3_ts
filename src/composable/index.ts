import { ref } from 'vue'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import {
  cancelOrder,
  deleteOrder,
  followTarget,
  getPrescriptionPic
} from '@/services/consult'
import { showFailToast, showImagePreview, showSuccessToast } from 'vant'
import { OrderType } from '@/enums'

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
