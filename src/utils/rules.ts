// 表单验证模块

import type { FieldRule } from 'vant'

export const mobileRules: FieldRule[] = [
  {
    required: true,
    message: '请输入手机号'
  },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
]

export const passwordRules: FieldRule[] = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '请输入8至24位字符' }
]

export const codeRules: FieldRule[] = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '请输入6位数验证码' }
]
