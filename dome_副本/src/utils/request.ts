import { baseUrl } from '@/config';
import { getToken } from '@/utils/token';
import { errCode } from '@/utils/errorCode';
import { tansParams, toast, showConfirm } from '@/utils/common';
interface RequestConfig {
	url: string;
	method?: UniApp.RequestOptions['method'];
	timeout?: number;
	baseUrl?: string;
	data?: any;
	header?: Record<string, any>;
	params?: Record<string, any>;
	/** 只放控制字段，真正发请求用 header */
	headers?: {
		isToken?: boolean;
	};
}

let timeout = 100000;

const request = (config: RequestConfig) => {
	const isTokenDisabled = (config.headers || {}).isToken === false;
	config.header = config.header || {};

	// let wxOauthDate = uni.getStorageSync('wxOauthDate')
	// // const h: Record<string, any> = {}
	// const h: Record<string, any> = {...config.header}
	// // 携带 token（除非显式禁用）
	// if (getToken() && !isTokenDisabled) {
	//   h['Authorization'] = wxOauthDate['token']||wxOauthDate['access_token']
	//   h['cacheId'] = wxOauthDate['sid']
	// }
	let wxOauthDate = uni.getStorageSync('wxOauthDate');
	let token = uni.getStorageSync('Token');
	// const h: Record<string, any> = {}
	const h: Record<string, any> = { ...config.header };
	// 携带 token（除非显式禁用）
	if (getToken() && !isTokenDisabled) {
		if (wxOauthDate) {
			h['Authorization'] = wxOauthDate['token'] || wxOauthDate['access_token'];
			h['cacheId'] = wxOauthDate['sid'];
		} else {
			h['Authorization'] = token;
		}
	}

	// GET 参数拼接（保留原 query）
	if (config.params && Object.keys(config.params).length) {
		const query = tansParams(config.params);
		if (query) {
			config.url = config.url + (config.url.includes('?') ? '&' : '?') + query;
		}
	}

	const finalUrl = (config.baseUrl || baseUrl) + config.url;

	return new Promise((resolve, reject) => {
		uni
			.request({
				method: config.method || 'GET',
				timeout: config.timeout || timeout,
				url: finalUrl,
				data: config.data,
				header: h,
				dataType: 'json',
			})
			.then((response) => {
				const res: any = response.data || {};
				// const bizCode = (res.code == 0 || res.code == 200) ? res.code : (res.code ?? 200)
				let bizCode = null;
				if (res.code == 0 || res.code == 200) {
					bizCode = res.code;
				} else if (res.status == 200) {
					bizCode = res.status;
				}

				if (bizCode == 0 || bizCode == 200 || bizCode == 100) {
					resolve(res);
					return;
				}
				if (res.code == 401) {
					console.log('===========================', finalUrl, uni.getStorageSync('oldShowModel'));

					if (!uni.getStorageSync('oldShowModel')) {
						uni.setStorageSync('oldShowModel', 1);
						showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(() => {});
					}

					return;
				}

				if (res.code == 1 || res.code == 100 || res.code == 500) {
					uni.showToast({
						title: res.resultMsg || res.msg || '系统错误，请联系管理员',
						icon: 'none',
						position: 'top',
						duration: 3000,
					});
					// uni.hideLoading();
					reject(res);
					return;
				}
				reject(res);
			})
			.catch((error) => {
				let message = error?.errMsg || '';
				if (message === 'Network Error') {
					message = '后端接口连接异常';
				} else if (message.includes('timeout')) {
					message = '系统接口请求超时';
				} else if (message.includes('Request failed with status code')) {
					message = '系统接口' + message.slice(-3) + '异常';
				}
				toast(message || '请求失败');
				reject(error);
			});
	});
};

export default request;
