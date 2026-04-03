const TokenKey = 'Token'

// 获取token
export function getToken() {
	return uni.getStorageSync(TokenKey)
}
// 写入token
export function setToken(token) {
	return uni.setStorageSync(TokenKey, token)
}

// 删除token
export function removeToken() {
	return uni.removeStorageSync(TokenKey)
}