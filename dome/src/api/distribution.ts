// 直营零售
import request from '@/utils/request';

// 申请成为外部分销员-c端调用
export function distributorList(data:any) {
  return request({
  	url: `/membership/api/distributor/apply`,
  	method: 'POST',
	data: data
  });
}
// 获取公司下拉框数据
export function getAllCompany(data:any) {
  return request({
  	url: `/system/api/dept/getAllCompany`,
  	method: 'GET',
	params: data
  });
}
// 获取分销员详细信息
export function distributorDetail() {
  return request({
  	url: `/membership/api/distributor/detail`,
  	method: 'GET',
  });
}

export function findNumAndAmountByDistributionMemberId(data:any) {
  return request({
  	url: `/paycenter/api/payDistributionOrderDetail/v1/findNumAndAmountByDistributionMemberId`,
  	method: 'GET',
	params: data
  });
}
//
export function payOrderInfo(data:any) {
  return request({
  	url: `/paycenter/api/payOrderInfo/v1`,
  	method: 'GET',
	params: data
  });
}
//查询钱包信息（可提现余额、结算中金额、已提现金额、累计金额）
export function distributionAmounts(id) {
  return request({
  	url: `/paycenter/api/payDistributionOrderDetail/v1/distributionAmounts/${id}`,
  	method: 'GET',
  });
}

// 查询提现记录列表
export function payDistributionWithdraw(data) {
  return request({
  	url: `/paycenter/api/member/payDistributionWithdraw/v1`,
  	method: 'GET',
	params: data
  });
}

// 分销订单记录列表
export function payDistributionOrderDetail(data) {
  return request({
  	url: `/paycenter/api/payDistributionOrderDetail/v1`,
  	method: 'GET',
	params: data
  });
}
// 提交提现申请
export function payDistributionWithdrawMoney(data) {
  return request({
  	url: `/paycenter/api/member/payDistributionWithdraw/v1/apply`,
    method: 'POST',
    data: data
  });
}
// 获取全局配置
export function getConfig() {
  return request({
  	url: `/membership/api/distributor/getConfig`,
  	method: 'GET',
  });
}
//
export function isDistributor() {
  return request({
  	url: `/membership/api/distributor/isDistributor`,
  	method: 'GET',
  });
}
