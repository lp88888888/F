import request from '@/utils/request'

// 发布作品
export function workSubmit(data: any) {
	return request({
		url: '/membership/member/memSloganActivity/v1/workSubmit',
		method: 'POST',
		data,
	});
}

// 查询投票活动配置
export function config() {
	return request({
		url: '/membership/member/memSloganActivity/v1/config',
		method: 'GET',
	});
}

// 作品列表查询
export function selectWorkPage(data:any) {
	return request({
		url: '/membership/member/memSloganActivity/v1/selectWorkPage',
		method: 'GET',
		data,
	});
}

// 我的作品列表查询
export function selectMyWorkPageW() {
	return request({
		url: '/membership/member/memSloganActivity/v1/selectMyWorkPage',
		method: 'GET',
	});
}

//投稿人数
export function workSubmitCount() {
	return request({
		url: '/membership/member/memSloganActivity/v1/workSubmitCount',
		method: 'GET',
	});
}


//投票
export function memSloganActivity(id) {
	return request({
		url: `/membership/member/memSloganActivity/v1/vote/${id}`,
		method: 'GET',
	});
}
//详情
export function workDetail(id) {
	return request({
		url: `/membership/member/memSloganActivity/v1/workDetail/${id}`,
		method: 'GET',
	});
}


