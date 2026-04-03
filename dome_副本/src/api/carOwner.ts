import request from '@/utils/request';

// 自驾行列表
export function roadTripPageList(data : any) {
	return request({
		url: '/membership/api/roadTrip/v1/pageList',
		method: 'GET',
		data: data
	});
}

// 详情
export function roadTripInfo(data : any) {
	return request({
		url: '/membership/api/roadTrip/v1/detail',
		method: 'GET',
		params: data
	});
}
// 详情
export function getGroupList(data : any) {
	return request({
		url: '/membership/api/roadTrip/v1/group/list',
		method: 'GET',
		params: data
	});
}

// 查询出行人列表
export function roadTripVisitorList() {
	return request({
		url: '/membership/api/roadTrip/v1/visitor/list',
		method: 'GET',
	});
}
// 新增修改行人
export function roadTripSaveOrUpdate(data : any) {
	return request({
		url: '/membership/api/roadTrip/v1/visitor/saveOrUpdate',
		method: 'POST',
		data: data
	});
}
// 订单列表
export function roadTripOrderPage(data : any) {
	return request({
		url: '/paycenter/api/roadTrip/order/v1/page',
		method: 'GET',
		params: data
	});
}
// 订单详情
export function roadTripOrderDetails(orderId) {
	return request({
		url: `/paycenter/api/roadTrip/order/v1/details/${orderId}`,
		method: 'GET'
	});
}
// 计算金额
export function roadTripCalculateAmount(data : any) {
	return request({
		url: '/paycenter/api/roadTrip/order/v1/calculateAmount',
		method: 'POST',
		data: data
	});
}

// 创建订单
export function roadTripCreate(data : any) {
	return request({
		url: '/paycenter/api/roadTrip/order/v1/create',
		method: 'POST',
		data: data
	});
}
// 取消
export function roadTripCancel(parentOrderId : any) {
	return request({
		url: `/paycenter/api/roadTrip/order/v1/cancel/${parentOrderId}`,
		method: 'GET',
	});
}
// 退款
export function roadTripRefund(data : any) {
	return request({
		url: `/paycenter/api/roadTrip/order/v1/refund`,
		method: 'POST',
		data
	});
}
