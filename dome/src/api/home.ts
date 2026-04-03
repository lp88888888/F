
import request from '@/utils/request';
// 新闻
export function getNewsList(data: any) {
	return request({
		url: '/management/unLoginApi/getNewsList',
		method: 'POST',
		data: data
	});
}

// 我的订单
export function payOrderInfo(data: any) {
	return request({
		url: '/paycenter/api/payOrderInfo/v1',
		method: 'GET',
		params: data
	});
}

// 新增体验官体验反馈
export function addFeedback(data: any) {
	return request({
		url: '/system/api/feedback/v1/add',
		method: 'POST',
		data: data
	});
}

// 查询体验官体验反馈列表
export function feedbackList(data: any) {
	return request({
		url: '/system/api/feedback/v1/list',
		method: 'GET',
		params: data
	});
}

// 获取体验官体验反馈详细信息
export function feedbackInfo(id: any) {
	return request({
		url: `/system/api/feedback/v1/${id}`,
		method: 'GET'
	});
}

// 新增体验官报名信息
export function addExperience(data: any) {
	return request({
		url: '/system/api/experience/v1/add',
		method: 'POST',
		data: data
	});
}

// 查询体验官报名信息列表
export function experienceList(data: any) {
	return request({
		url: `/system/api/experience/v1/list`,
		method: 'GET',
		params: data
	});
}

// 修改体验官报名信息
export function editExperience(data: any) {
	return request({
		url: '/system/api/experience/v1/update',
		method: 'POST',
		data: data
	});
}

// 根据用户id获取体验官报名状态
export function experienceInfo() {
	return request({
		url: `/system/api/experience/v1/getExperienceApply`,
		method: 'GET',
	});
}

// 记录用户弹窗展示
export function recordShow(data: any) {
	return request({
		url: '/system/system/popup/recordShow',
		method: 'POST',
		data: data
	});
}

// 判断用户是否应该显示弹窗
export function shouldShow() {
	return request({
		url: `/system/system/popup/shouldShow`,
		method: 'GET',
	});
}
//banner
export function bannerList(id) {
  return request({
    url: `/system/api/banner/v1/${id}`,
    method: 'GET',
  })
}
//金刚区
export function gridMenu(id, data) {
  return request({
    url: `/system/api/gridMenu/v1/business/${id}`,
    method: 'GET',
	params: data
  })
}

// 根据经纬度获取路线
export function getRouteByLngLat(data: any) {
	return request({
		url: '/travel/unLoginApi/getRouteByLngLat',
		method: 'POST',
		data: data
	});
}

//判断用户类型并返回对应礼物配置
export function checkGiftType(data: any) {
  return request({
    url: `/membership/api/gift/checkUserType`,
    method: 'GET',
	params: data
  })
}

// 用户领取礼物
export function receiveGift(data: any) {
	return request({
		url: '/membership/api/gift/receive',
		method: 'POST',
		params: data
	});
}

// 积分季弹窗展示
export function recordIntegral() {
	return request({
		url: '/membership/api/gift/recordIntegralPopupShow',
		method: 'POST',
	});
}

//控制体验管
export function tiyanguan() {
	return request({
		url: '/system/config/configKey/tiyanguan',
		method: 'GET',
	});
}

//控制红色首页
export function getredindex() {
	return request({
		url: '/system/config/configKey/redindex',
		method: 'GET',
	});
}


export function updateMigrationStatus(data: any) {
  return request({
    url: `/membership/api/member/v1/updateMigrationStatus`,
    method: 'POST',
	params: data
  })
}

// 首页推荐设置
export function gethomeconfig(params){
	return request({
		url:'/system/sys-home-page/recommendations',
		method: 'GET',
		params
	})
}

// 首页服务区轮播
export function gethomefwq(params){
	return request({
		url: '/travel/unLoginApi/getHomeServiceAreaInfo',
		method: 'GET',
		params
	})
}
export function serviceareaactivity(data:any){
	return request({
		url: '/operation/api/service-area-activity/v1/list',
		method: 'GET',
		data: data
	})
}
export function getActiveList(data:any){
	return request({
		url: '/operation/api/activity-entrance/v1/getActiveList',
		method: 'GET',
		data: data
	})
}

