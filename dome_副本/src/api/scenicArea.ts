
import request from '@/utils/request';
// 新闻
export function getodsJjbScenicSpot(data : any) {
	return request({
		url: '/premium/api/odsJjbScenicSpot/v1',
		method: 'GET',
		data: data
	});
}
export function odsJjbScenicSpotid(data) {
	return request({
		url: `/premium/api/odsJjbScenicSpot/v1/${data.id}/${data.lng}/${data.lat}`,
		method: 'GET',
	});
}
export function odsJjbScenicSpotpic(id) {
	return request({
		url: `/premium/api/odsJjbScenicSpot/v1/stock/${id}`,
		method: 'GET',
	});
}
export function postcompute(data) {
	return request({
		url: `/premium/api/odsJjbScenicSpot/v1/compute`,
		method: 'POST',
		data: data
	})
}
// 新增乘客
export function postsysIdentityInfo(data) {
	return request({
		url: `/system/api/sysIdentityInfo/v1`,
		method: 'POST',
		data: data
	})
}
// 删除乘客
export function deletesysIdentityInfo(id) {
	return request({
		url: `/system/api/sysIdentityInfo/v1/delete/${id}`,
		method: 'GET',
	})
}
// 查询乘客列表
export function getsysIdentityInfo(data) {
	return request({
		url: `/system/api/sysIdentityInfo/v1`,
		method: 'GET',
		data: data
	})
}
// 新增乘客
export function postids(data) {
	return request({
		url: `/sys/api/sysIdentityInfo/v1/ids`,
		method: 'POST',
		data: data
	})
}
// 景区门票创建订单
export function postpayScenicSpotOrder(data) {
	return request({
		url: `/paycenter/api/payScenicSpotOrder/v1`,
		method: 'POST',
		data: data
	})
}
export function getpayOrderInfo(id) {
	return request({
		url: `/paycenter/api/payOrderInfo/v1/${id}`,
		method: 'GET',
	})
}
export function getpayScenicSpotOrder(id) {
	return request({
		url: `/paycenter/api/payScenicSpotOrder/v1/pay/${id}`,
		method: 'GET',
	})
}
export function payScenicSpotOrderlist(data) {
	return request({
		url: `/paycenter/api/payScenicSpotOrder/v1`,
		method: 'GET',
		data: data
	})
}
//申请退款
export function postpayrefund(data) {
	return request({
		url: `/paycenter/api/payScenicSpotOrder/v1/refund`,
		method: 'POST',
		data: data
	})
}
export function getpaycancel(id) {
	return request({
		url: `/paycenter/api/payScenicSpotOrder/v1/cancel/${id}`,
		method: 'GET',
	})
}
export function postcreateOrder(data) {
	// #ifdef MP-WEIXIN
		return request({
			url: '/paycenter/wxPay/mini/v1/createOrder',
			method: 'POST',
			data
		});
	// #endif
	// #ifdef APP
		return request({
			url: '/paycenter/wxPay/app/v1/createOrder',
			method: 'POST',
			data
		});
	// #endif
	
}
