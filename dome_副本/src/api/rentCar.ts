import request from '@/utils/request'

// 新增数据
export function addRentCar(data: any) {
  return request({
    url: '/premium/api/appointmentRentCar/v1/addRentCar',
    method: 'POST',
	data: data
  })
}
// 租车详情
export function rentCarInfo(id: any) {
  return request({
    url: `/premium/api/appointmentRentCar/v1/${id}`,
    method: 'GET'
  })
}
export function selectRentCarList(data: any) {
  return request({
    url: '/premium/api/appointmentRentCar/v1/selectRentCarList',
    method: 'POST',
	data: data
  })
}
