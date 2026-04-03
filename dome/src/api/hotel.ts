
import { request } from 'http';
import request from '@/utils/request';
// 新闻
export function gethotelList(data: any) {
	return request({
		url: '/hotel/hotel/manage/list',
		method: 'POST',
		data: data
	});
}
export function getManagedat(data: any) {
	return request({
		url: `/hotel/hotel/manage/detail`,
		method: 'POST',
		data: data
	});
}
export function getroomRellist(data: any) {
	return request({
		url: '/hotel/hotel/roomRel/list',
		method: 'POST',
		data: data
	});
}
export function getcommenthotel(data: any) {
	return request({
		url: `/hotel/comment/hotel/list`,
		method: 'POST',
		data: data
	});
}
export function getdetail(id: String) {
	return request({
		url: `/hotel/hotel/roomRel/detail/${id}`,
		method: 'GET',
	});
}
export function getmerchantOrderlist(data: any) {
	return request({
		url: '/hotel/hotel/merchantOrder/list',
		method: 'POST',
		data: data
	});
}
export function getmerchantOrderdetail(id: String) {
	return request({
		url: `/hotel/hotel/merchantOrder/${id}`,
		method: 'GET',
	});
}
export function getordercancel(data: any) {
	return request({
		url: '/hotel/hotel/order/cancel',
		method: 'POST',
		data: data
	});
}
export function getordercreate(data: any) {
	return request({
		url: '/hotel/hotel/order/create',
		method: 'POST',
		data: data
	});
}
export function gethotelservices(type:String) {
	return request({
		url: `/system/dict/data/type/${type}`,
		method: 'GET',
	});
}
export function getcommentsubmit(data: any) {
	return request({
		url: '/hotel/comment/submit',
		method: 'POST',
		data: data
	});
}

// 酒店收藏列表
export function collectionList(data: any) {
	return request({
		url: '/hotel/system/collection/list',
		method: 'POST',
		data: data
	});
}

// 酒店收藏
export function collectionAdd(data: any) {
	return request({
		url: '/hotel/system/collection/add',
		method: 'POST',
		data: data
	});
}

// 酒店收藏删除
export function collectionDelete(id: any) {
	return request({
		url: `/hotel/system/collection/delete/${id}`,
		method: 'GET'
	});
}
// 新车买卖的报名
export function postactivityApply(data: any) {
	return request({
		url: '/premium/api/prCarAppointmentTestDrive/v1/activityApply',
		method: 'POST',
		data: data
	});
}

// 评论总分数
export function gethotelscoretotal(hotelId){
	return request({
		url:`/hotel/comment/self/scoreTotal/${hotelId}`,
		method: 'GET'
	})
}

// 查询酒店资讯
export function hotelNews(params) {
	return request({
		url: `/hotel/web/hotel/article/page`,
		method: 'GET',
		params
	})
}

// 酒店资讯详情
export function getHotelArticleDetail(id) {
  return request({
    url: `/hotel/web/hotel/article/get`,
    method: 'get',
    params: {
      id: id
    }
  })
}
