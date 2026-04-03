import { showConfirm } from '@/utils/common'
export function errCode(code : number,dataMsg:string) {
	switch (code) {
		case 400:
			uni.showToast({
				title: '无效的请求，请重试',
				icon: 'none',
				position: 'top'
			});
			break;
		case 401:
			showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(() => {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages_A/login/login',
				});
				// #endif
				// #ifdef APP
				uni.navigateTo({ url: '/pages_A/login_password/login' });
				// #endif
			})
			break;
		case 403:
			uni.showToast({
				title: '当前没有操作权限',
				icon: 'none',
				position: 'top'
			});
			break;
		case 404:
			uni.showToast({
				title: '访问资源不存在',
				icon: 'none',
				position: 'top'
			});
			break;
		default:
			uni.showToast({
				title: '未知错误，请联系管理员',
				icon: 'none',
				position: 'top'
			});
			break;
	}
}