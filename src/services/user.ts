// 用户相关请求模块
import type { CodeType, PatientList, User, UserInfo } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('login/password', 'post', { mobile, password })

//  发送短信验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request('code', 'get', { mobile, type })

//  短信验证码登录
export const loginByCode = (mobile: string, code: string) =>
  request<User>('login', 'post', { mobile, code })

export const getUserInfo = () => request<UserInfo>('patient/myUser')

// 获取家庭档案患者信息
export const getPatientList = () => request<PatientList>('patient/mylist')
