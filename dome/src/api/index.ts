import request from '@/utils/request';

// 小程序跳转埋点
export function updateClickVolume(data: any) {
	return request({
		url: '/management/unLoginApi/updateClickVolume',
		method: 'POST',
		params: data
	});
}
/**
 *  根据用户停留模块时间，赠送积分
 */
export function partGiftPoints(data: any) {
	return request({
		url: '/management/api/giftPoints/partGiftPoints',
		method: 'POST',
		data: data
	});
}
export function getAdvertisingListByType(data: any) {
	// type homeSpecialService
	return request({
		url: '/management/unLoginApi/getAdvertisingListByType',
		method: 'POST',
		data: data
	});
}

// 获取加油列表
export function getKycMerchantInfoList(data: any) {
	return request({
		// url: '/management/unLoginApi/getKycMerchantInfoList',
		url:'/premium/api/odsGasStation/v1',
		method: 'GET',
		params: data
	});
}
export function getlistPageMerchant(data: any) {
	// type homeSpecialService
	return request({
		url: '/travel/unLoginApi/listPageMerchant',
		method: 'POST',
		data: data
	});
}
export function getLocationInfoid(data: any) {
	// type homeSpecialService
	return request({
		url: '/travel/unLoginApi/getLocationInfo',
		method: 'POST',
		data: data
	});
}
export function odsGasStationdel(data) {
  return request({
    url: `/premium/api/odsGasStation/v1/${data.merId}/${data.lng}/${data.lat}`,
    method: 'GET',
  })
}
export function postpayGasStationOrder(data: any) {
	// type homeSpecialService
	return request({
		url: '/paycenter/api/payGasStationOrder/v1',
		method: 'POST',
		data: data
	});
}
export function getpayOrderInfoList(data: any) {
	return request({
		url:`/paycenter/api/payGasStationOrder/v1`,
		method: 'GET',
		data: data
	});
}
export function postpayGasStationOrderinfo(id) {
	// type homeSpecialService
	return request({
		url: `/paycenter/api/payGasStationOrder/v1/cancel/${id}`,
		method: 'GET'
	});
}
export function postpayrefundinfo(data: any) {
	// type homeSpecialService
	return request({
		url: '/paycenter/api/payGasStationOrder/v1/refund',
		method: 'POST',
		data: data
	});
}
export function getpayOrderInfodel(id) {
	return request({
		url:`/paycenter/api/payOrderInfo/v1/${id}`,
		method: 'GET'
	});
}
export function getservicePoint(data: any) {
	return request({
		url:`/travel/unLoginApi/getServicePoint`,
		method: 'POST',
		data: data
	});
}
export function odsGasStationpic(data) {
  return request({
    url: `/premium/api/odsGasStation/v1/compute`,
    method: 'POST',
	data: data
  })
}
export function getcouponslist(data: any) {
	return request({
		url: '/system/api/user/coupons/v1',
		method: 'GET',
		data: data
	});
}

export function qrCode(data: any) {
	return request({
		url: '/system/api/sysUserWriteOffCoupons/v1/qrCode',
		method: 'GET',
		data: data
	});
}

