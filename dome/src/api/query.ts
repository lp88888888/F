import request from '@/utils/request'


// 积分明细
export function getTollPageList(data: any) {
	return request({
		url: '/management/unLoginApi/getTollPageList',
		method: 'POST',
		data: data
	});
}
// 查询价格
export function getPassFee(data: any) {
	return request({
		url: '/management/unLoginApi/getPassFee',
		method: 'POST',
		data: data
	});
}
//车型
export function getConfigList() {
	return request({
		url: '/management/unLoginApi/getConfigList',
		method: 'GET',
	});
}
// 文字
export function getStationPassFeeAgreement() {
	return request({
		url: '/management/unLoginApi/getStationPassFeeAgreement',
		method: 'POST',
	});
}
