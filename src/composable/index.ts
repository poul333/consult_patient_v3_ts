import { ref } from 'vue'
import type { FollowType } from '@/types/consult'
import { followTarget, getPrescriptionPic } from '@/services/consult'
import { showImagePreview } from 'vant'

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
