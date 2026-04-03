import request from '@/utils/request';

// 获取服务区列表
export function getgetServiceAreaPageList(data: any) {
	return request({
		url: '/management/unLoginApi/getServiceAreaPageList',
		method: 'POST',
		data: data
	});
}
// 获取服务区详情
// export function getServiceAreaById(data: any) {
// 	return request({
// 		url: `/operation/opServiceArea/${data.id}`,
// 		method: 'POST',
// 		params:data,
// 	});
// }
// 获取服务区详情
export function getServiceAreaById(id: any, params) {
	return request({
		url: `/travel/unLoginApi/getServiceAreaById/${id}`,
		method: 'GET',
		params
	});
}
// 获取收费站列表
export function getgetTollStationByIdList(data: any) {
	return request({
		url: '/management/unLoginApi/getTollStationPageList',
		method: 'POST',
		data: data
	});
}
// 获取收费站详情
export function getTollStationById(data: any) {
	return request({
		url: `/operation/opTollStation/${data.id}`,
		method: 'POST',
		params:data,
	});
}

// 获取etc列表
export function getlistPageEtcBranchList(data: any) {
	return request({
		url: '/travel/unLoginApi/listPageEtcBranch',
		method: 'POST',
		data: data
	});
}

// etc网点站列表
export function getlistPageRingCityNetwork(data) {
	return request({
		url: '/travel/unLoginApi/listPageEtcBranch',
		method: 'POST',
		data: data
	});
}

// 获取两个点的之间的天气
export function getqueryAllWeather(data) {
  return request({
    url: '/dataServer/weather/getTravelWeather',
    method: 'GET',
	data:data
  })
}
// 获取两个点的之间的收费站
export function getTollStationByLngLatList(data) {
  return request({
	  url: '/travel/unLoginApi/getTollStationByLngLat',
	  method: 'POST',
	  // params:data
	  data:data
  })
}

// 校验距离是否符合申请条件
export function checkDistanceRequirement(data) {
  return request({
    url: '/travel/unLoginApi/checkDistanceRequirement',
    method: 'POST',
	data:data
  })
}

// 通过用户ID获取最新路况纠错申请
export function getRoadConditionCorrectionByUserId(data) {
  return request({
    url: '/travel/unLoginApi/getRoadConditionCorrectionByUserId',
    method: 'POST',
	params:data
  })
}

// 提交纠错申请
export function saveRoadConditionCorrection(data) {
  return request({
    url: '/travel/unLoginApi/saveRoadConditionCorrection',
    method: 'POST',
	data:data
  })
}

// 获取路况信息
export function getEvents(data: any) {
	return request({
		url: `/travel/api/roadEvent/v1/getEvents`,
		method: 'POST',
		data:data,
	});
}
// 根据经纬度查询沿途充电站
export function getStationByLngLatlist(data: any) {
	return request({
		url: `/travel/api/charging/v1/getStationByLngLat`,
		method: 'POST',
		data:data,
	});
}
// 根据经纬度查询沿途服务区
export function getServiceAreaByLngLatlist(data: any) {
	return request({
		url: `/travel/unLoginApi/getServiceAreaByLngLat`,
		method: 'POST',
		data:data,
	});
}
// 根据经纬度查询沿途etc
export function getEtcBranchListByLngLatlist(data: any) {
	return request({
		url: `/travel/unLoginApi/getEtcBranchListByLngLat`,
		method: 'POST',
		data:data,
	});
}
// 获取车生活地图服务列表
export function postmapServicesList(data: any) {
	return request({
		url: `/travel/unLoginApi/mapServicesList`,
		method: 'POST',
		data:data,
	});
}
// 加气站列表
export function getnaturalGasStationlist(data) {
  return request({
    url: '/premium/api/naturalGasStation/v1/list',
    method: 'GET',
	data:data
  })
}
// 获取加气站详情
export function getnaturalGasStation(id: any) {
	return request({
		url: `/premium/api/naturalGasStation/v1/detail/${id}`,
		method: 'GET'
	});
}

// 获取两点间的加油站
export function gettwodotgasstation(data) {
	return request({
		url: '/premium/api/odsGasStation/v1/getGasStationByLngLat',
		method: 'POST',
		data: data
	})
}