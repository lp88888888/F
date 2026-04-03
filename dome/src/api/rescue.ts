import request from '@/utils/request'


// 高速路段列表查询
export function sectionList(data) {
  return request({
    url: `/travel/api/rescue/v1/sectionList/${data}`,
    method: 'GET',
  })
}
// 获取车辆类型
export function carTypeList() {
  return request({
    url: `/travel/api/rescue/v1/carType`,
    method: 'GET',
  })
}
export function submitObj(data) {
  return request({
    url: `/travel/api/rescue/v1/submit`,
   method: 'POST',
   data: data
  })
}

// 工单列表查询

export function orderList(data) {
  return request({
    url: `/travel/api/rescue/v1/orderList/${data}`,
    method: 'GET',
  })
}
export function getorderDetail(id) {
  return request({
    url: `/travel/api/rescue/v1/orderDetail/${id}`,
    method: 'GET',
  })
}
export function cannelOrder(id) {
  return request({
    url: `/travel/api/rescue/v1/cannel/${id}`,
    method: 'POST',
  })
}
export function getrescueLocation(id) {
  return request({
    url: `/travel/api/rescue/v1/rescueLocation/${id}`,
    method: 'GET',
  })
}
