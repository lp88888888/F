
import request from '@/utils/request';
// 使用说明
export function getrichTextPopup(data : any) {
	return request({
		url: '/system/richTextPopup/list',
		method: 'GET',
		data: data
	});
}
// 获得事件分类列表
export function getcategorylist(data) {
	return request({
		url: `/operation/incident/category/list`,
		method: 'GET',
		data: data
	});
}

export function postcompute(data) {
	return request({
		url: `/premium/api/odsJjbScenicSpot/v1/compute`,
		method: 'POST',
		data: data
	})
}
// 新增随手拍
export function postinsertopInc(data) {
	return request({
		url: `/operation/opIncidentReport/insert`,
		method: 'POST',
		data: data
	})
}
// 修改随手拍
export function postupdateopInc(data) {
	return request({
		url: `/operation/opIncidentReport/update`,
		method: 'POST',
		data: data
	})
}
// 获得事件分类列表
export function getopIncidentReportlist(data) {
	return request({
		url: `/operation/opIncidentReport`,
		method: 'GET',
		data: data
	});
}
// 通过主键查询单条数据
export function getopIncidentReportinfo(id) {
	return request({
		url: `/operation/opIncidentReport/${id}`,
		method: 'GET'
	})
}