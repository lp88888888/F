import request from '@/utils/request';

const baseURL = '/message';

/**
 * 获取topic列表
 */
export function getTopicList() {
	return request({
		url: baseURL+'/msg/v1/topics',
		method: 'GET'
	});
}

/**
 * 更改topic订阅状态
 */
export function updateTopicSubscribe(params) {
	return request({
		url: baseURL+'/msg/v1/topics/subscribe',
		method: 'GET',
		params
	});
}
/**
 * 消息分页查询
 */
export function msgSendRecord(params) {
	return request({
		url: baseURL+'/api/msg/msgSendRecord',
		method: 'GET',
		params
	});
}

/**
 * 消息为已读
 */
export function msgSendRecordRead(params) {
	return request({
		url: baseURL+`/api/msg/msgSendRecord/read`,
		method: 'GET',
		params
	});
}

// 一键已读
export function msgSendRecordReadAll() {
	return request({
		url: baseURL+`/api/msg/msgSendRecord/readAll`,
		method: 'GET'
	});
}

export function ScenarioCategoryList() {
	return request({
		url: baseURL+`/api/msg/msgSendRecord/ScenarioCategoryList`,
		method: 'GET'
	});
}

