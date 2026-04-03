import request from '@/utils/request'
// 校验距离是否符合申请条件
export function checkDistanceRequirement(data:any) {
  return request({
  	url: `/travel/api/road-condition-correction/v1/checkDistanceRequirement`,
  	method: 'POST',
	data: data
  });
}
// 新增路况纠错申请
export function saveform(data:any) {
  return request({
  	url: `/travel/api/road-condition-correction/v1/save`,
  	method: 'POST',
	data: data
  });
}

// 收费站详情
export function getTollStationById(id) {
	return request({
		url: `/travel/unLoginApi/getTollStationById/${id}`,
		method: 'GET'
	});
}
// 通过ID获取路况纠错申请
export function getById(data:any) {
  return request({
  	url: `/travel/api/road-condition-correction/v1/getById`,
  	method: 'POST',
	params: data
  });
}
export function getList(data:any) {
  return request({
  	url: `/travel/api/road-condition-correction/v1/getList`,
  	method: 'POST',
	params: data
  });
}

export function getChargeStationErrorPoint() {
  return request({
  	url: `/membership/api/member/v1/getChargeStationErrorPoint`,
  	method: 'POST'
  });
}
