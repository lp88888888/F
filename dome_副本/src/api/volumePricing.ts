import request from '@/utils/request';

// 优惠申请
export function yldjHighSpeedRoad(data: any) {
	return request({
		url: '/premium/api/yldjHighSpeedRoad/discountList',
		method: 'GET',
		params: data,
	});
}

// app首页-优惠活动
export function yldjDiscountApply(data: any) {
	return request({
		url: '/premium/api/yldjDiscountApply/apply',
		method: 'POST',
		data,
	});
}

// 活动列表
export function yldjHighSpeedRoadBiz(data: any) {
	return request({
		url: '/premium/api/yldjHighSpeedRoadBiz/discountList',
		method: 'GET',
		params: data,
	});
}

// 优惠统计
export function orderStatistics(data: any) {
	return request({
		url: '/premium/api/YldjOrder/orderStatistics',
		method: 'POST',
		data,
	});
}

// 优惠统计图
export function orderStatisticsDetail(data: any) {
	return request({
		url: '/premium/api/YldjOrder/orderStatisticsDetail',
		method: 'POST',
		data,
	});
}

// 查询当前登陆人个人信息
export function yldjUser(data: any) {
	return request({
		url: '/premium/api/yldjUser/getInfo',
		method: 'GET',
		params: data,
	});
}

// 查询当前登陆人企业信息
export function yldjEnterprise(data: any) {
	return request({
		url: '/premium/api/yldjEnterprise/pageList',
		method: 'POST',
		data,
	});
}

// 新增个人信息
export function yldjSaveUser(data: any) {
	return request({
		url: '/premium/api/yldjUser/saveUser',
		method: 'POST',
		data,
	});
}

// 编辑个人信息
export function yldjEditUser(data: any) {
	return request({
		url: '/premium/api/yldjUser/updateUser',
		method: 'POST',
		data,
	});
}

// 新增企业信息
export function yldjSaveEnterprise(data: any) {
	return request({
		url: '/premium/api/yldjEnterprise/saveEnterprise',
		method: 'POST',
		data,
	});
}

// 新增车辆
export function saveVehicle(data) {
	return request({
		url: '/premium/api/yldjVehicles/saveVehicle',
		method: 'POST',
		data,
	});
}

// 车辆列表
export function yldjCarList(data: any) {
	return request({
		url: '/premium/api/yldjVehicles/vehiclePage',
		method: 'POST',
		data,
	});
}

// 车辆列表-申请
export function getVehiclePage(data: any) {
	return request({
		url: '/premium/api/yldjVehicles/getVehiclePage',
		method: 'POST',
		data,
	});
}

// 解绑车辆
export function yldjunBindVehicle(data) {
	return request({
		url: '/premium/api/yldjVehicles/deleteYldjVehicle',
		method: 'GET',
		data,
	});
}

// 企业信息
export function yldjCarEnterprise(data: any) {
	return request({
		url: '/premium/api/yldjEnterprise/pageList',
		method: 'POST',
		data,
	});
}

// 企业详情
export function getByCreditCode(data: any) {
	return request({
		url: '/premium/api/yldjEnterprise/getByCreditCode',
		method: 'GET',
		params: data,
	});
}

// 我的优惠
export function yldjMyyh(data: any) {
	return request({
		url: '/premium/api/YldjOrder/pageList',
		method: 'POST',
		data,
	});
}

// 优惠详情
export function yldjyhInfo(data: any) {
	return request({
		url: '/premium/api/YldjOrder/infoById',
		method: 'GET',
		params: data,
	});
}

// 重新提交车辆
export function updateVehicle(data: any) {
	return request({
		url: '/premium/api/yldjVehicles/updateVehicle',
		method: 'POST',
		data,
	});
}

// 我的申请
export function yldjMyApply(data: any) {
	return request({
		url: '/premium/api/yldjDiscountApply/myPageList',
		method: 'POST',
		data,
	});
}

// 申请详情
export function yldjApplyInfo(data: any) {
	return request({
		url: '/premium/api/yldjDiscountApply/infoById',
		method: 'GET',
		params: data,
	});
}

// 撤回申请
export function yldjRevokeApply(data: any) {
	return request({
		url: '/premium/api/yldjVehicles/infoById',
		method: 'GET',
		params: data,
	});
}

// 车辆详情
export function yldjCarInfo(data: any) {
	return request({
		url: '/premium/api/yldjDiscountApply/revokeApply',
		method: 'GET',
		params: data,
	});
}

// 获取高速list
export function getgaosulist(data: any) {
	return request({
		url: '/premium/api/dict/getDictListByType',
		method: 'GET',
		params: data,
	});
}

// 获取高路段list
export function getgaosuluduanlist(data: any) {
	return request({
		url: '/premium/api/yldjAppHighSpeedRoadSec/getRoadSecListByHighId',
		method: 'GET',
		params: data,
	});
}

// 通行次数列表
export function yldjNumberPassesList(data: any) {
	return request({
		url: '/premium/api/YldjNumberPasses/pageList',
		method: 'POST',
		data,
	});
}

// 通行次数详情
export function yldjNumberPassesInfo(data: any) {
	return request({
		url: '/premium/api/YldjNumberPasses/infoById',
		method: 'GET',
		params: data,
	});
}

// 车辆列表
export function vehiclePage(data: any) {
	return request({
		url: '/premium/api/yldjVehicles/vehiclePage',
		method: 'POST',
		data,
	});
}

// 车辆列表筛选
export function vehiclePageByRoadId(data: any) {
	return request({
		url: '/premium/api/yldjVehicles/vehiclePageByRoadId',
		method: 'POST',
		data,
	});
}

// 企业筛选
export function getEnterList(data: any) {
	return request({
		url: '/premium/api/yldjEnterprise/pageList',
		method: 'POST',
		data,
	});
}

// 提交反馈
export function postvsaveFeedback(data: any) {
	return request({
		url: '/premium/api/YldjFeedback/saveFeedback',
		method: 'POST',
		data,
	});
}

// 问题反馈列表
export function getYldjFeedbackpageList(data: any) {
	return request({
		url: '/premium/api/YldjFeedback/pageList',
		method: 'POST',
		data,
	});
}

// 问题详情
export function getYldjFeedbackinfoById(data: any) {
	return request({
		url: '/premium/api/YldjFeedback/infoById',
		method: 'GET',
		params: data,
	});
}

// 首页通知
export function myMessageList(data: any) {
	return request({
		url: '/premium/api/yldjDiscountApply/myMessageList',
		method: 'POST',
		data,
	});
}

// 宜高速地址获取
export function getEhyMiniweb(data: any) {
	return request({
		url: '/premium/api/ehy/getEhyMiniweb',
		method: 'POST',
		data,
	});
}

// 查询六型货车
export function dictList(data: any) {
	return request({
		url: '/system/dict/data/list',
		method: 'GET',
		data,
	});
}

// 用户同步对应的车辆用户信息
export function getKycVehicleAndUserInfo(data: any) {
	return request({
		url: '/premium/api/user-vehicle/getKycVehicleAndUserInfo',
		method: 'POST',
		data,
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
	});
}

// 根据车牌号查询车辆所属人和公司名称接口
export function queryEnterpriseValue(data: any) {
	return request({
		url: '/premium/api/promotionManage/queryEnterpriseValue',
		method: 'POST',
		data,
	});
}


// 车辆解绑规则说明
export function getUnbindRules(data = '') {
	return request({
		url: '/premium/api/user-vehicle/getUnbindRules',
		method: 'POST',
		data,
	});
}

import { getToken } from '@/utils/token';
// 上传图片
export function uploadMerchantImage(filePath: string, moduleName: string, successHandler: Function, failHandler: Function) {
	let header = {
		'Content-Type': 'multipart/form-data',
	};
	let wxOauthDate = uni.getStorageSync('wxOauthDate');
	if (getToken()) {
		header['Authorization'] = getToken();
		header['cacheId'] = wxOauthDate['sid'];
	}
	uni.uploadFile({
		url: '/premium/api/merchantManage/uploadMerchantImage',
		filePath: filePath,
		name: 'file',
		header: header,
		formData: {
			moduleName: moduleName,
			ocrType: '',
		},
		success: function (res) {
			if (res.statusCode === 200) {
				const data = JSON.parse(res.data);
				if (data.code === 0) {
					successHandler(data.clazz);
				} else {
					failHandler(data.resultMsg || '上传失败');
				}
			} else {
				failHandler('上传失败');
			}
		},
		fail: function (res) {
			failHandler('上传失败');
		},
	});
}

// 上传视频
export function uploadVideo(filePath: string, moduleName: string, successHandler: Function, failHandler: Function) {
	let header = {
		'Content-Type': 'multipart/form-data',
	};
	let wxOauthDate = uni.getStorageSync('wxOauthDate');
	if (wxOauthDate) {
		header['Authorization'] = wxOauthDate['token'];
		header['cacheId'] = wxOauthDate['sid'];
	}
	uni.uploadFile({
		url: '/premium/merchantManage/uploadVideo',
		filePath: filePath,
		name: 'file',
		header: header,
		formData: {
			moduleName: moduleName,
			ocrType: '',
		},
		success: function (res) {
			if (res.statusCode === 200) {
				const data = JSON.parse(res.data);
				if (data.code === 0) {
					successHandler(data.clazz);
				} else {
					failHandler(data.resultMsg || '上传失败');
				}
			} else {
				failHandler('上传失败');
			}
		},
		fail: function (res) {
			failHandler('上传失败');
		},
	});
}
