import request from '@/utils/request';

// 查询用户是否存在
export function isExist(query: unknown) {
	return request({
		url: '/isExist',
		headers: {
			isToken: false,
		},
		method: 'GET',
		params: query,
	});
}
// 获取验证码
export function getCode(query: unknown) {
	return request({
		url: '/code',
		headers: {
			isToken: false,
		},
		method: 'GET',
		params: query,
	});
}
// 获取验证码
export function getloginCode(query: unknown) {
	return request({
		url: '/auth/smsCode',
		headers: {
			isToken: false,
		},
		method: 'POST',
		params: query,
	});
}
export function appLoginCode(data) {
	return request({
		url: '/auth/login/smsCode',
		headers: {
			isToken: false,
		},
		method: 'POST',
		data:data
	});
}

// 登录方法
export function login(username, password, code, uuid) {
	const data = {
		username,
		password,
		code,
		uuid,
	};
	return request({
		url: '/login',
		headers: {
			isToken: false,
		},
		method: 'POST',
		data: data,
	});
}
// 微信登录
export function fetchWechatInfo(query: unknown) {
	return request({
		url: '/auth/login/jsCodeSession',
		headers: {
			isToken: false,
		},
		method: 'POST',
		params: query,
	});
}

// 获取手机号
export function fetchWechatInfoAuthorization(data: Record<string, any>) {
	return request({
		url: '/auth/login/wxLogin',
		headers: {
			isToken: false,
		},
		method: 'POST',
		data,
	});
}

// 获取用户详细信息
export function getMiniUserInfo() {
	return request({
		url: `/membership/member/info/v1`,
		method: 'GET',
	});
}

// 退出方法
export function logout() {
	return request({
		url: '/logout',
		method: 'POST',
	});
}

// 获取验证码
export function getCodeImg() {
	return request({
		url: '/captchaImage',
		headers: {
			isToken: false,
		},
		method: 'GET',
		timeout: 20000,
	});
}

// 密码登录
export function signInMobilePwd (data: any) {
	return request({
		url: '/auth/login/pwd',
		headers: {
			isToken: false,
		},
		method: 'POST',
		data: data
	});
}
// 用户注销
export function cancellationMember (data: any) {
	return request({
		url: '/membership/api/member/v1/cancellation',
		method: 'POST',
		data: data
	});
}
export function cancellationtCode (data: any) {
	return request({
		url: '/auth/smsCode',
		method: 'POST',
		params: data
	});
}
export function getWxAppToken(code) {
  return new Promise((resolve, reject) => {
  	uni.request({
  		url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx90c850f92690cb19&secret=7120048fc4edb88d1579dc4fbb9f2abc&code=${code}&grant_type=authorization_code`,
  		method: 'GET',
  		success: resolve,
  		fail: reject,
  	});
  });
}
export function appWxLogin(data: any) {
	return request({
		url: '/auth/login/appWxLogin',
		method: 'POST',
		data: data
	});
}
export function bindThirdAccount(data: any) {
	return request({
		url: '/auth/login/bindThirdAccount',
		method: 'POST',
		data: data
	});
}
