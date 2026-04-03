// 企业报名绑车
import request from '@/utils/request';

// 注册企业
export function registerEnterprise(data: any) {
	return request({
		url: '/membership/api/enterprise/v1/registerEnterprise',
		method: 'POST',
		data: data
	});
}
// 驳回再次提交
export function againSubmit(data: any) {
	return request({
		url: '/membership/api/enterprise/v1/againSubmit',
		method: 'POST',
		data: data
	});
}
// 获取企业详情
export function enterpriseDetail(id) {
  return request({
    url: `/membership/api/enterprise/v1/${id}`,
    method: 'GET'
  })
}

// 获取企业列表
export function enterpriseList(data: any) {
	return request({
		url: '/membership/api/enterprise/v1',
		method: 'POST',
		data: data
	});
}

// 企业车辆列表
export function enterprisecarList(data: any) {
	return request({
		url: '/system/api/enterprise/vehicle/v1/list',
		method: 'POST',
		data: data
	});
}