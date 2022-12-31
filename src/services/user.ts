// 用户相关请求模块
import type {
  CodeType,
  Patient,
  PatientList,
  User,
  UserInfo
} from '@/types/user'
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

// 添加患者
export const addPatient = (patient: Patient) =>
  request('patient/add', 'post', patient)

// 编辑患者
export const updatePatient = (patient: Patient) =>
  request('patient/update', 'put', patient)

// 删除患者信息
export const daletePatient = (id: string) =>
  request(`patient/del/${id}`, 'DELETE')

// 查询患者详情
export const getPatientDetial = (id: string) =>
  request<Patient>(`patient/info/${id}`)

// QQ登录
export const loginByQQ = (openId: string) =>
  request<User>('login/thirdparty', 'post', { openId, source: 'qq' })

// 三方登录绑定手机
export const bindMobile = (data: {
  mobile: string
  code: string
  openId: string
}) => request<User>('login/binding', 'post', data)
