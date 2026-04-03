import request from '@/utils/request';

// 根据业务类型查询搜索记录
export function getSeacheRecord(params) {
	return request({
		url: `/system/api/sysSearchRecord/v1/${params}`,
		method: 'GET',
	});
}

// 搜索默认页
export function getglobalsearch() {
	return request({
		url: `/operation/api/global-search/v1`,
		method: 'GET',
	});
}

// 获取服务区信息列表
export function getServiceSiteList(data) {
	return request({
		url: `/travel/unLoginApi/getServiceSiteList`,
		method: 'POST',
		data: data,
	});
}

// 全局搜索根据商品名称搜索积分商城和直营零售的商品
export function getAllProduct(params) {
	return request({
		url: `/merchant/api/promotion/point-activity/selectAllProduct`,
		method: 'GET',
		params: params,
	});
}

// 全局搜索-货源
export function getsourceSearch(params) {
	return request({
		url: `/premium/api/prSupplySource/v1/sourceSearch`,
		method: 'POST',
		data: params,
	});
}

// 服务搜索
export function getservicesearch(params) {
	return request({
		url: `/operation/api/global-search/v1/serviceSearch`,
		method: 'GET',
		params: params,
	});
}
// 积分商品列表
export function listPoints(params: any) {
	return request({
		url: '/merchant/api/promotion/point-activity/page',
		method: 'GET',
		params: params,
	});
}