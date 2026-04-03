
import { CurrentPage } from '@/utils/util'
import {
	useAppStore
} from '@/store/modules/app';
/**
* 显示消息提示框
* @param content 提示的标题
*/
export function toast(content) {
	console.log('---------------toast-------------------', content);
	uni.showToast({
		icon: 'none',
		title: content
	})
}

/**
* 
* @param content 提示的显示模态弹窗标题
*/
export function showConfirm(content) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示',
			content: content,
			cancelText: '取消',
			confirmText: '确定',
			success: function (res) {
				uni.removeStorageSync('oldShowModel')
				if (res.confirm) {
					let Store = useAppStore()
					Store.clearUserInfo() 
					// #ifdef MP-WEIXIN
					uni.navigateTo({
						url: '/pages_A/login/login?fromPage=' + CurrentPage(),
					});
					// #endif
					// #ifdef APP
					uni.navigateTo({ url: '/pages_A/login_password/login' });
					// #endif

				} else if (res.cancel) {
					let Store = useAppStore()
					Store.clearUserInfo() 

					uni.navigateBack({
						delta: 1,
						success: (res) => {

						},
						fail: (err) => {
							uni.reLaunch({
								url: '/pages/home/home'
							})
						}
					});
					// uni.navigateTo({
					//   url: '/pages_A/login/login'
					// });
				}
			}
		})
	})
}

export function debounce<T extends (...args : any[]) => void>(fn : T, delay = 500) {
	let timer : any = null;
	return (...args : Parameters<T>) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}

/**
* 参数处理
* @param params 参数
*/
export function tansParams(params) {
	let result = ''
	for (const propName of Object.keys(params)) {
		const value = params[propName]
		var part = encodeURIComponent(propName) + "="
		if (value !== null && value !== "" && typeof (value) !== "undefined") {
			if (typeof value === 'object') {
				for (const key of Object.keys(value)) {
					if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
						let params = propName + '[' + key + ']'
						var subPart = encodeURIComponent(params) + "="
						result += subPart + encodeURIComponent(value[key]) + "&"
					}
				}
			} else {
				result += part + encodeURIComponent(value) + "&"
			}
		}
	}
	return result
}

/**
* 隐私手机号
* @param 手机号
*/
export function formatPhoneNumWithMask(cardNo : string) : string {
	return cardNo.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2");
}