import request from '@/utils/request';

// 优惠券
export function getCardList(data: any) {
	return request({
		url: '/management/api/card/getCardList',
		method: 'POST',
		data: data
	});
}
//数量
export function getCardListCount(data: any) {
	return request({
		url: '/management/api/card/getCardListCount',
		method: 'POST',
		data: data
	});
}