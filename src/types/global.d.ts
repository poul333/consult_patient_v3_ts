// 拓展window的类型
interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }
  QC: {
    Login: {
      // 检查是否QQ登录
      check(): boolean
      // 获取个人信息，回调函数上是 openId
      getMe(cb: (openId: string) => void): void
    }
  }
}
