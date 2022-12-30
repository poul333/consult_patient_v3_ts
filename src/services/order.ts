import type { AddressItem, OrderDetail, OrderPre } from '@/types/order'
import { request } from '@/utils/request'

// 查询药品订单预支付信息
export const getMedicalOrderPre = (params: { prescriptionId: string }) =>
  request<OrderPre>('patient/medicine/order/pre', 'get', params)

// 获取收获地址列表
export const getAddressList = () =>
  request<AddressItem[]>('patient/order/address')

// 药品订单
export const createMedicalOrder = (data: {
  id: string
  addressId: string
  couponId: string
}) => request<{ id: string }>('patient/medicine/order', 'post', data)

// 获取药品订单详情
export const getMedicalOrderDetail = (id: string) =>
  request<OrderDetail>(`/patient/medicine/order/detail/${id}`)
