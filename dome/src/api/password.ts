import request from '@/utils/request'
// 确定修改密码
export function setPwdFun(data: any) {
  return request({
    url: '/auth/pwd/setPwd',
    method: 'POST',
	data: data
  })
}
export function resetPwd(data: any) {
  return request({
    url: '/auth/pwd/resetPwd',
    method: 'POST',
	data: data
  })
}
// 忘记密码
export function forgetPwd(data: any) {
  return request({
    url: '/auth/pwd/forgetPwd',
    method: 'POST',
	data: data
  })
}



