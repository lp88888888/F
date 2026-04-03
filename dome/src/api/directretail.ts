// 直营零售
import request from '@/utils/request';

// 直营零售商户列表商品列表
export function selectMerchantList(data:any) {
  return request({
  	url: `/premium/api/prShopSpu/v1/selectMerchantList`,
  	method: 'GET',
	params: data
  });
}
// 直营零售商品列表
export function selectProductList(data:any) {
  return request({
  	url: `/premium/api/prShopSpu/v1/selectProductList`,
  	method: 'GET',
	params: data
  });
}
// 直营零售商户详情包括商品列表
export function selectMerchantById(data:any) {
  return request({
  	url: `/premium/api/prShopSpu/v1/selectMerchantById`,
  	method: 'GET',
	params: data
  });
}



