import request from '@/utils/request'

// 个人报名/企业负责人报名
export function applyRegistration(data: any) {
	return request({
		url: '/membership/marketing/campaign/registration/v1/personal/auto-apply',
		method: 'POST',
		data,
	});
}

// 企业自动报名
export function autoApplyEnterprise(data) {
	return request({
		url: '/membership/marketing/campaign/registration/v1/enterprise/auto-apply',
		method: 'POST',
		data,
	});
}

// 查看自己在指定活动中的报名状态  campaignId==活动ID
export function getMyRegistrations(params) {
	return request({
		url: '/membership/marketing/campaign/registration/v1/my-registrations',
		method: 'GET',
		params,
	});
}
// 获取活动报名统计信息  campaignId==活动ID
export function getRegistrationStats(params) {
	return request({
		url: '/membership/marketing/campaign/registration/v1/statistics',
		method: 'GET',
		params,
	});
}

// 查询里程积分明细（只统计活动路段）
export function getMileagePointDetails(data) {
	return request({
		url: '/membership/marketing/campaign/registration/v1/mileage-point-details',
		method: 'POST',
		data,
	});
}

// 查询榜单数据
export function getLeaderboard(data) {
	return request({
		url: '/membership/marketing/campaign/registration/v1/leaderboard',
		method: 'POST',
		data,
	});
}
// 获取当前激活的货车节活动信息
export function getCurrentTruckFestival() {
	return request({
		url: '/membership/marketing/campaign/registration/v1/current-truck-festival',
		method: 'GET',
	});
}
// 查询积分余额
export function getBalance() {
	return request({
		url: '/membership/activity-points/account/balance',
		method: 'GET',
	});
}
export function getAccountInfo() {
	return request({
		url: '/membership/activity-points/account/info',
		method: 'GET',
	});
}
// 获取邀请链接和二维码
export function getGenerateLink() {
	return request({
		url: '/membership/marketing/invite/generate-link',
		method: 'POST',
	});
}
// 获取当前用户的邀请统计数据
export function getStatistics() {
	return request({
		url: '/membership/marketing/invite/statistics',
		method: 'GET',
	});
}
// 处理被邀请人接受邀请
export function getAccept(data) {
	return request({
		url: '/membership/marketing/invite/accept',
		method: 'POST',
		data
	});
}
// 分页查询专属活动积分商城商品列表
export function getexclusivePage(params) {
	return request({
		url: '/merchant/api/promotion/point-activity/exclusive-page',
		method: 'GET',
		params,
	});
}
// 根据活动ID查询社群列表
export function getassociationList(data) {
  return request({
    url: `/membership/member/campaign/v1/associationList/${data}`,
    method: 'GET',
  })
}
// 查询当前用户里程积分明细（只统计活动路段）
export function postregistration(data) {
	return request({
		url: '/membership/marketing/campaign/registration/v1/my-mileage-point-details',
		method: 'POST',
		data
	});
}
// 获取当前用户榜单信息
export function getMyleaderboard(data) {
  return request({
    url: `/membership/marketing/campaign/registration/v1/my-leaderboard`,
    method: 'GET',
  })
}
