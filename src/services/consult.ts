import type {
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  DoctorPage,
  FollowType,
  TopDep,
  Image,
  ConsultOrderPreParams,
  ConsultOrderPreData,
  PartialConsult,
  ConsultOrderItem
} from '@/types/consult'
import { request } from '@/utils/request'

// 获取首页文章列表
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('patient/home/knowledge', 'get', params)

// 获取关注医生列表
export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('home/page/doc', 'get', params)

// 关注
export const followTarget = (id: string, type: FollowType = 'doc') =>
  request('like', 'post', { id, type })

// 获取科室列表
export const getAllDep = () => request<TopDep[]>('dep/all')

// 上传文件
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('upload', 'post', fd)
}

// 获取生成订单信息，确定金额
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request<ConsultOrderPreData>('patient/consult/order/pre', 'get', params)

// 生成订单
export const createConsultOrder = (data: PartialConsult) =>
  request<{ id: string }>('patient/consult/order', 'post', data)

// 订单支付
export const getConsultOrderPayUrl = (data: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request<{ payUrl: string }>('patient/consult/pay', 'post', data)

// 订单详情
export const getConsultOrderDetail = (orderId: string) =>
  request<ConsultOrderItem>('patient/consult/order/detail', 'get', { orderId })

// 查看处方单
export const getPrescriptionPic = (id: string) =>
  request<{ url: string }>(`patient/consult/prescription/${id}`)
