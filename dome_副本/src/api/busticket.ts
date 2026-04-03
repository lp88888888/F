import request from '@/utils/request';
// 根据首字母查看站点
export function busStation(data: any) {
  return request({
    url: '/dataServer/busStation/list',
    method: 'GET',
	params: data
  })
}
//查询
export function schedule(data: any) {
  return request({
    url: '/dataServer/busStation/schedule',
    method: 'GET',
	params: data
  })
}


// 查询历史列表
export function history(data: any) {
  return request({
    url: '/paycenter/api/busTicket/history/v1',
    method: 'GET',
	params: data
  })
}

// 删除历史
export function historyClean(data: any) {
  return request({
    url: '/paycenter/api/busTicket/history/v1/clean',
    method: 'POST',
	params: data
  })
}

// 根据车站编码查询站点信息
export function stationInfo(data: any) {
  return request({
    url: '/dataServer/busStation/stationInfo',
    method: 'GET',
	params: data
  })
}

// 创建汽车票订单信息
export function busTicketOrder(data: any) {
  return request({
    url: '/paycenter/api/busTicketOrder/v1/add',
    method: 'POST',
	data
  })
}

// 汽车票订单列表
export function busTicketOrderList(data: any) {
  return request({
    url: '/paycenter/api/busTicketOrder/v1',
    method: 'GET',
	params: data
  })
}

// 查询汽车票订单详情
export function busTicketOrderInfo(orderNo: any) {
  return request({
    url: `/paycenter/api/busTicketOrder/v1/${orderNo}`,
    method: 'GET'
  })
}

// 取消订单
export function cancelBusTicketOrder(data: any) {
  return request({
    url: '/paycenter/api/busTicketOrder/v1/cancel',
    method: 'POST',
	params: data
  })
}

// 获取支付参数
export function getPayParam(data: any) {
  return request({
    url: '/paycenter/api/busTicketOrder/v1/getPayParam',
    method: 'POST',
	data
  })
}

// 计算退票手续费
export function calculateRefundFee(netTicketId: any) {
  return request({
    url: `/paycenter/api/busTicketOrder/v1/calculateRefundFee/${netTicketId}`,
    method: 'GET'
  })
}

// 退票退款
export function refundBusTicketOrder(data: any) {
  return request({
    url: '/paycenter/api/busTicketOrder/v1/refund',
    method: 'POST',
	data
  })
}