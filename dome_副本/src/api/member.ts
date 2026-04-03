import request from '@/utils/request';

// 个人还是企业获取所有等级
export function findAll(data: any) {
	return request({
		url: '/membership/api/level/config/v1/findAll',
		method: 'GET',
		data: data
	});
}
// 根据当前登录用户获取等级详情
export function details(data: any) {
	return request({
		url: '/membership/api/level/config/v1/details',
		method: 'GET',
		data: data
	});
}
// 列表
export function pageList(data: any) {
	return request({
		url: '/membership/level/config/v1/page',
		method: 'GET',
		data: data
	});
}
// -=-----------------------------------------------------大会员
// ETC卡成功后积分赠送
export function postsaveEtcGetPoint(data) {
	return request({
		url: `/membership/api/member/v1/saveEtcGetPoint`,
		method: 'POST',
		data: data
	})
}
// 根据当前登录用户获取等级详情
export function getmemberdetails(data: any) {
	return request({
		url: '/membership/api/member/v1/details',
		method: 'GET',
		data: data
	});
}
// ETC卡成功后积分赠送
export function postsaveMonthFixedPoint(data) {
	return request({
		url: `/membership/api/gift/receive`,
		method: 'POST',
		params: data
	})
}
// 根据当前登录用户获取等级详情
export function getmembermonthFixedPoint(data: any) {
	return request({
		url: '/membership/api/gift/month',
		method: 'GET',
		data: data
	});
}
// 未登录的会员权益数量
export function getmembermemRightsCount(data: any) {
	return request({
		url: '/membership/api/member/v1/memRightsCount',
		method: 'GET',
		data: data
	});
}
// 根据个人还是企业获取所有等级以及权益等数据
export function getmemberfindAllLevel(data: any) {
	return request({
		url: '/membership/api/member/v1/findAllLevel',
		method: 'GET',
		data: data
	});
}
// 获取积分排行
export function getmemberpointsRanking(data: any) {
	return request({
		url: '/membership/api/member/v1/pointsRanking',
		method: 'GET',
		data: data
	});
}
// 会员升级接口
export function postmemberUpgrade(data) {
	return request({
		url: `/membership/api/member/v1/memberUpgrade`,
		method: 'POST',
		data: data
	})
}
// 领取生日积分接口
export function postsaveBirthdayPoint(data) {
	return request({
		url: `/membership/api/member/v1/saveBirthdayPoint`,
		method: 'POST',
		data: data
	})
}
//转发分享积分赠送
export function postsaveForwardSharePoint(data) {
	return request({
		url: `/membership/api/member/v1/saveForwardSharePoint`,
		method: 'POST',
		data: data
	})
}
//浏览与阅读积分赠送
export function postsaveLookReadPoint(data) {
	return request({
		url: `/membership/api/member/v1/saveLookReadPoint`,
		method: 'POST',
		data: data
	})
}
//每日签到积分赠送
export function postsaveSignInPoint() {
	return request({
		url: `/membership/api/member/v1/saveSignInPoint`,
		method: 'POST',
	})
}
//完善信息积分赠送
export function postsaveCompleteInfo(data) {
	return request({
		url: `/membership/api/member/v1/saveCompleteInfo`,
		method: 'POST',
		data: data
	})
}
//分页查询积分明细列表
export function postpointsDetailPage(data) {
	return request({
		url: `/membership/api/member/v1/pointsDetailPage?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
		method: 'POST',
		data: data
	})
}
//用户绑定车辆积分赠送
export function postsaveBindVehiclePoint(data) {
	return request({
		url: `/membership/api/member/v1/saveBindVehiclePoint`,
		method: 'POST',
		data: data
	})
}
//绑定银行卡积分赠送
export function postsaveBindCardPoint(data) {
	return request({
		url: `/membership/api/member/v1/saveBindCardPoint`,
		method: 'POST',
		data: data
	})
}
//信息认证积分赠送
export function postsaveInfoAuthPoint(data) {
	return request({
		url: `/membership/api/member/v1/saveInfoAuthPoint`,
		method: 'POST',
		data: data
	})
}
//注册积分赠送
export function postsaveRegisterPoint(data) {
	return request({
		url: `/membership/api/member/v1/saveRegisterPoint`,
		method: 'POST',
		data: data
	})
}
//查询车辆兑换规则
export function getmembermileageExchangePointMessage() {
	return request({
		url: `/membership/api/member/v1/mileageExchangePointMessage`,
		method: 'GET',
	})
}
//查询里程换积分详情列表
export function getmembermileageExchangePointDetailList() {
	return request({
		url: `/membership/api/member/v1/mileageExchangePointDetailList`,
		method: 'GET',
	})
}
//赚积分页面展示数据用到的所有积分规则
export function getmembermakePoint(data) {
	return request({
		url: `/membership/api/member/v1/makePoint`,
		method: 'GET',
		data: data
	})
}
//获取会员生日赠送的积分，当data为null时候代表该会员不能领取生日积分，卡片不应展示
export function getmemberbirthdayPoint(data) {
	return request({
		url: `/membership/api/member/v1/birthdayPoint`,
		method: 'GET',
		data: data
	})
}
//显示会员未注册之前赠送的积分
export function getmemberregisterPoint(data) {
	return request({
		url: `/membership/api/member/v1/registerPoint`,
		method: 'GET',
		data: data
	})
}
//查询精选会员权益
export function getmembermemRightsChoiceness(data) {
	return request({
		url: `/membership/api/member/v1/memRightsChoiceness`,
		method: 'GET',
		data: data
	})
}
//查询积分明细统计
export function getmemberpointsDetailStatistics() {
	return request({
		url: `/membership/api/member/v1/pointsDetailStatistics`,
		method: 'GET'
	})
}
//注册
export function postwechatRegister(data) {
	return request({
		url: `/auth/login/wechatRegister`,
		method: 'POST',
		data: data
	})
}
//查询积分明细统计
export function getmembermemberPage(couponFlag) {
	return request({
		url: `/merchant/api/promotion/point-activity/memberPage/${couponFlag}`,
		method: 'GET',
	})
}
// 获取手机号
export function getgetUserPhoneNumber(data: Record<string, any>) {
	return request({
		url: '/auth/login/getUserPhoneNumber',
		method: 'POST',
		data,
	});
}
// 获取手机号
export function postregisterEnterprise(data) {
	return request({
		url: '/auth/login/registerEnterprise',
		method: 'POST',
		data,
	});
}
//查询积分明细统计
export function getmemRightsGroupTypePage(couponFlag) {
	return request({
		url: `/membership/api/member/v1/memRightsGroupType`,
		method: 'GET',
	})
}
//获取里程榜
export function getmileageRankinglist(data) {
	return request({
		url: `/membership/api/member/v1/mileageRanking`,
		method: 'GET',
		data: data
	})
}