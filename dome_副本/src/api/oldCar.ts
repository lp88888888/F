import request from '@/utils/request'



// 获取首页轮播图
export function listPics() {
  return request({
    url: '/premium/api/prOldCarDetail/v1/pics',
    method: 'GET'
  })
}
// 查询二手车列表
export function listPrOldCarDetail(params) {
  return request({
    url: '/premium/api/prOldCarDetail/v1',
    method: 'GET',
	  params:params
  })
}
// 获取二手车详情
export function getPrOldCarDetail(id) {
  return request({
    url: `/premium/api/prOldCarDetail/v1/${id}`,
    method: 'GET',
  })
}


// 预约列表
export function listPrAppointmentOldCar(data) {
  return request({
    url: '/premium/api/prAppointmentOldCar/v1',
    method: 'GET',
    params:data
  })
}
// // 预约详情
export function getPrAppointmentOldCar(id) {
  return request({
    url: `/premium/api/prAppointmentOldCar/v1/${id}`,
    method: 'GET'
  })
}
// 新增预约
export function addPrAppointmentOldCar(data) {
  return request({
    url: '/premium/api/prAppointmentOldCar/v1',
    method: 'POST',
    data
  })
}
// 修改预约
export function updatePrAppointmentOldCar(data) {
  return request({
    url: '/premium/api/prAppointmentOldCar/v1',
    method: 'PUT',
    data
  })
}
// 新增高价卖车
export function addPrSaleOldCar(data) {
  return request({
    url: '/premium/api/prSaleOldCar/v1',
    method: 'POST',
    data
  })
}
// 新增估价
export function addPrEvaluate(data) {
  return request({
    url: '/premium/api/prEvaluateOldCar/v1',
    method: 'POST',
    data
  })
}


