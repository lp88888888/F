import request from '@/utils/request';

// 分页查询附近充电站列表
export function listCharging(params) {
  return request({
    url: '/travel/api/charging/v1/page',
    method: 'GET',
    params
  })
}
// 站点详情
export function getCharging(data) {
  return request({
    url: '/travel/api/charging/v1/detail',
    method: 'POST',
    data
  })
}
// 查询货车节积分余额
export function getBalance(params) {
  return request({
    url: '/membership/activity-points/account/balance',
    method: 'GET',
    params
  })
}