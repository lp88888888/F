// 货源
import request from '@/utils/request'
// 货源列表
export function listPrSupplySource(params) {
  return request({
    url: '/premium/api/prSupplySource/v1/list',
    method: 'GET',
	params:params
  })
}
// 通过id 查询货源详情
export function getPrSupplySource(id) {
  return request({
    url: `/premium/api/prSupplySource/v1/${id}`,
    method: 'GET',
  })
}
// 查询货源订单列表
export function listOrderPrSupplySource(data:any) {
  return request({
    url: `/premium/api/prSupplySourceMatchedRecord/v1`,
    method: 'GET',
	params:data,
  })
}
// 查询货源订单详情
export function getOrderPrSupplySource(id) {
  return request({
    url: `/premium/api/prSupplySourceMatchedRecord/v1/${id}`,
    method: 'GET',
  })
}
// 新增抢单数据
export function addOrderPrSupplySource(data:any) {
  return request({
    url: `/premium/api/prSupplySourceMatchedRecord/v1`,
    method: 'POST',
	data,
  })
}
// 新增或修改订阅信息
export function addPrSupplyRouteSubscription(data:any) {
  return request({
    url: `/premium/api/prSupplyRouteSubscription/v1`,
    method: 'POST',
	data,
  })
}
// 查询当前用户订阅信息
export function getPrSupplyRouteSubscription() {
  return request({
    url: `/premium/api/prSupplyRouteSubscription/v1`,
    method: 'GET',
  })
}

//分页根据距离查询当前服务区餐馆列表
export function listOdsFzgRestaurantInfo(params) {
  return request({
    url: '/premium/api/odsFzgRestaurantInfo/v1',
    method: 'GET',
    params
  })
}
// 根据店铺id查询菜品
export function getOdsFzgRestaurantInfo(shopId) {
  return request({
    url: `/premium/api/odsFzgRestaurantInfo/v1/${shopId}`,
    method: 'GET',
  })
}
// 根据商品id查询商品套餐以及规格
export function odsFzgRestaurantGoods(goodsId) {
  return request({
    url: `/premium/api/odsFzgRestaurantGoods/v1/${goodsId}`,
    method: 'GET',
  })
}

// 查询特色菜品
export function specialty(goodsId) {
  return request({
    url: `/premium/api/odsFzgRestaurantInfo/v1/specialty/${goodsId}`,
    method: 'GET',
  })
}