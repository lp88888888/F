import request from '@/utils/request';

// 积分明细
export function getIntegralByUserId(data: any) {
	return request({
		url: '/management/api/integral/getIntegralByUserId',
		method: 'GET',
		data: data,
	});
}
// 商品列表
export function listPrShopSpu(data: any) {
	return request({
		url: '/premium/api/prShopSpu/v1/selectAllByShopIds',
		method: 'GET',
		params: data,
	});
}
// 商品详情
export function getPrShopSpu(spuId: any) {
	return request({
		url: `/premium/api/prShopSpu/v1/${spuId}`,
		method: 'GET',
	});
}

export function listShopCar(shopType: any) {
	return request({
		url: `/premium/api/prShopProductCartItem/v1/selectAll/${shopType}`,
		method: 'GET',
		// params:data
	});
}

// 新增、修改购物车商品数量
export function addShopCar(data: any) {
	return request({
		url: '/premium/api/prShopProductCartItem/v1/changeItem',
		method: 'POST',
		data,
	});
}
// 直营零售获取购物车商品数量
export function getShopCarProdCount() {
	return request({
		url: '/paycenter/api/payRetailShopProductCartItem/v1/prodCount',
		method: 'GET',
	});
}

// 清空购物车所有商品
export function deleteAllItemShopCar() {
	return request({
		url: '/premium/api/prShopProductCartItem/v1/deleteAllItem',
		method: 'DELETE',
	});
}
// 根据购物车ids删除商品
export function deleteIdsShopCar(params) {
	return request({
		url: '/premium/api/prShopProductCartItem/v1',
		method: 'DELETE',
		params: params,
	});
}
// 新增订单 结算，生成订单信息
export function confirmPrShopOrder(data) {
	return request({
		url: '/premium/api/prShopOrder/v1/confirm',
		method: 'POST',
		data: data,
	});
}
// 购物车/立即购买 提交订单,根据店铺拆单
export function submitPrShopCarOrder() {
	return request({
		url: '/premium/api/prShopOrder/v1/submit',
		method: 'POST',
	});
}
export function payInfoPrShopCarOrder(params) {
	return request({
		url: '/premium/api/prShopOrder/v1/orderPayInfo',
		method: 'GET',
	});
}

// 根据订单号获取订单详情信息
export function getOrderInfo(params) {
	return request({
		url: '/merchant/api/trade/order/get-detail',
		method: 'GET',
		params: params,
	});
}

// 订单列表
export function listOrder(params) {
	return request({
		// url: '/premium/p/myOrder/searchOrder',
		url: '/premium/p/myOrder/orderList',
		method: 'GET',
		params: params,
	});
}

// 根据购物车主键ID数组查询购物车列表
export function getshopcarinfo(params) {
	return request({
		url: '/merchant/api/trade/cart/list-by-ids',
		method: 'GET',
		params: params,
	});
}

/** -----------------------------------------------------------积分商城新----------------------------------------------------------------------------------------------- */

// 积分商品列表
export function listPoints(params: any) {
	return request({
		url: '/merchant/api/promotion/point-activity/page',
		method: 'GET',
		params: params,
	});
}
// 积分商品详情
export function detailActivityPoints(id) {
	return request({
		url: '/merchant/api/promotion/point-activity/get-detail',
		method: 'GET',
		params: {
			id: id,
		},
	});
}

// 积分商品详情
export function detailPoints(id) {
	return request({
		url: '/merchant/api/product/spu/get-detail',
		method: 'GET',
		params: {
			id: id,
		},
	});
}
// 添加购物车商品
export function addCartPoints(data) {
	return request({
		url: '/merchant/api/trade/cart/add',
		method: 'POST',
		data,
	});
}
// 更新购物车商品数量
export function updateCountCartPoints(data) {
	return request({
		url: '/merchant/api/trade/cart/update-count',
		method: 'POST',
		data,
	});
}
// 更新购物车商品选中
export function updateSelectedCartPoints(data) {
	return request({
		url: '/merchant/api/trade/cart/update-selected',
		method: 'POST',
		data,
	});
}
// 重置购物车商品
export function resetCartPoints(data) {
	return request({
		url: '/merchant/api/trade/cart/reset',
		method: 'POST',
		data,
	});
}
// 删除购物车商品
export function deleteCartPoints(ids) {
	return request({
		url: '/merchant/api/trade/cart/delete',
		method: 'POST',
		params: {
			ids: ids,
		},
	});
}

// 查询用户在购物车中的商品数量
export function getCountCartPoints() {
	return request({
		url: '/merchant/api/trade/cart/get-count',
		method: 'GET',
	});
}
// 查询用户的购物车列表
export function listCartPoints() {
	return request({
		url: '/merchant/api/trade/cart/list',
		method: 'GET',
	});
}
export function updatecount(data) {
	return request({
		url: '/merchant/api/trade/cart/update-count',
		method: 'POST',
		data,
	});
}

/**----------------收藏----------------- */
// 添加商品收藏
export function addcreate(data) {
	return request({
		url: '/merchant/api/product/favorite/create',
		method: 'POST',
		data,
	});
}
// 取消商品收藏
export function deletecreate(data) {
	return request({
		url: '/merchant/api/product/favorite/delete',
		method: 'POST',
		data,
	});
}
// 检查是否收藏过商品
export function exitscreate(data) {
	return request({
		url: '/merchant/api/product/favorite/exits',
		method: 'GET',
		data,
	});
}

// 批量取消商品收藏
export function deleteFavoriteAll(data) {
	return request({
		url: '/merchant/api/product/favorite/deleteList',
		method: 'POST',
		data,
	});
}
// 删除购物车商品
export function deleteShopping(ids) {
	return request({
		url: '/merchant/api/trade/cart/delete',
		method: 'POST',
		params: {
			ids: ids,
		},
	});
}
// 获得订单结算信息
export function settlement(data) {
	return request({
		url: '/merchant/api/trade/order/settlement',
		method: 'POST',
		data,
	});
}
// 获得商品结算信息
export function settlementProduct(data) {
	return request({
		url: '/merchant/api/trade/order/settlement-product',
		method: 'GET',
		data,
	});
}
// 创建订单
export function orderCreate(data) {
	return request({
		url: '/merchant/api/trade/order/create',
		method: 'POST',
		data,
	});
}
// 更新订单为已支付
export function updatePaid(data) {
	return request({
		url: '/merchant/api/trade/order/update-paid',
		method: 'POST',
		data,
	});
}
// 获得交易订单
export function getOrderDetail(data) {
	return request({
		url: '/merchant/api/trade/order/get-detail',
		method: 'GET',
		data,
	});
}
// 积分商城订单详情
export function getOrderInfoDetail(data) {
	return request({
		url: '/merchant/api/trade/order/parent/get-detail',
		method: 'GET',
		params: data,
	});
}
// 获得交易订单分页
export function orderPage(data) {
	return request({
		url: '/merchant/api/trade/order/page',
		method: 'GET',
		data,
	});
}
// 获得交易订单数量
export function getOrderCount(data) {
	return request({
		url: '/merchant/api/trade/order/get-count',
		method: 'GET',
		data,
	});
}
// 获得交易订单项
export function orderReceive(data) {
	return request({
		url: '/merchant/api/trade/order/receive',
		method: 'POST',
		data,
	});
}
// 取消交易订单
export function orderCancel(data) {
	return request({
		url: '/merchant/api/trade/order/cancel',
		method: 'POST',
		data,
	});
}
// 删除交易订单
export function orderDelete(data) {
	return request({
		url: '/merchant/api/trade/order/delete',
		method: 'POST',
		data,
	});
}
// 获得交易订单项
export function getOrderItem(data) {
	return request({
		url: '/merchant/api/trade/order/item/get',
		method: 'GET',
		data,
	});
}
// 创建交易订单项的评价
export function createComment(data) {
	return request({
		url: '/merchant/api/trade/order/item/create-comment',
		method: 'POST',
		data,
	});
}
// 获得善品分类列表
export function getcategorylist(data) {
	return request({
		url: '/merchant/api/product/category/list',
		method: 'GET',
		data,
	});
}

// 根据业务类型和商户id查询评价列表
export function sysReview(data) {
	return request({
		url: `/system/api/sysReview/v1/${data.bizType}/${data.merchantId}`,
		method: 'GET',
		data,
	});
}

// 根据业务类型和商户id和订单id查询评价详情
export function sysReviewDetails(data) {
	return request({
		url: `/system/api/sysReview/v1/${data.bizType}/${data.merchantId}/${data.bizId}`,
		method: 'GET',
		data,
	});
}
// 提交评价
export function sysReviewShop(data) {
	return request({
		url: '/system/api/sysReview/v1',
		method: 'POST',
		data,
	});
}

// 根据业务类型和商户id和订单id查询评价详情
export function sysReviewOpinion(data) {
	return request({
		url: `/system/api/sysReview/v1/inner/${data.bizType}/${data.merchantId}/${data.bizId}/${data.spuId}`,
		method: 'GET',
		data,
	});
}
// 直营零售-----------------------------------------------
// 查询购物车商品数量
export function getprodCount(data) {
	return request({
		url: `/paycenter/api/payRetailShopProductCartItem/v1/prodCount`,
		method: 'GET',
		data,
	});
}
// 添加购物车
export function postaddcar(data) {
	return request({
		url: '/paycenter/api/payRetailShopProductCartItem/v1/add',
		method: 'POST',
		data,
	});
}
/* 新增评价
	bizType 业务类型
	OLD_CAR_APPOINTMENT(二手车),NEW_CAR_APPOINTMENT(新车预约),AUTO_REPAIR_APPOINTMENT(汽车维修)，MERCHANT_POINT_APPPOINTMENT（积分商城商品评价）
 */
export function addReview(data) {
	return request({
		url: '/system/api/sysReview/v1',
		method: 'POST',
		data,
	});
}
// 查询分页查询购物车列表
export function getCarlist(data) {
	return request({
		url: `/paycenter/api/payRetailShopProductCartItem/v1/list`,
		method: 'GET',
		data,
	});
}
// 购物车计算金额接口
export function postshopCarPriceCompute(data) {
	return request({
		url: '/paycenter/api/payRetailShopProductCartItem/v1/shopCarPriceCompute',
		method: 'POST',
		data: data,
	});
}
// 零售商超订单信息列表
export function getShopOrderlist(data) {
	return request({
		url: `/paycenter/api/payRetailShopOrder/v1`,
		method: 'POST',
		data,
	});
}
// 创建零售商超订单信息列表
export function getShopOrder(data) {
	return request({
		url: `/paycenter/api/payRetailShopOrder/v1`,
		method: 'GET',
		data,
	});
}
// 增量添加购物车
export function postshopincrItem(data) {
	return request({
		url: '/paycenter/api/payRetailShopProductCartItem/v1/incrItem',
		method: 'POST',
		data: data,
	});
}
// 删除购物车
export function postshopremoveItem(data) {
	return request({
		url: '/paycenter/api/payRetailShopProductCartItem/v1/removeItem',
		method: 'POST',
		data: data,
	});
}
// 根据业务类型和商户id和订单id查询评价详情（单条）
export function getOneReview(data) {
	return request({
		url: '/system/api/sysReview/v1/inner',
		method: 'GET',
		params: data,
	});
}

// 根据业务类型和商户id和订单id查询评价详情（多条）
export function listReview(data) {
	return request({
		url: '/system/api/sysReview/v1/innerPage',
		method: 'GET',
		params: data,
	});
}
// 查询个人自己评价列表
export function listUserReview(data) {
	return request({
		url: '/system/api/sysReview/v1/reviewList',
		method: 'GET',
		params: data,
	});
}
export function getpayOrderInfo(id) {
	// type homeSpecialService
	return request({
		url: `/paycenter/api/payOrderInfo/v1/${id}`,
		method: 'GET',
	});
}

// 根据页面类型查询所有启用的活动商品信息  页面类型(0:货车版,1:客车版)
export function getpageTypeActivityInfo(pageType) {
	return request({
		url: `/merchant/api/promotion/point-activity/activity-ids/${pageType}`,
		method: 'GET',
	});
}
// 物流接口
export function getmapTrack(id) {
	return request({
		url: `/dataServer/gateway/express/mapTrack/${id}`,
		method: 'GET',
	});
}

// 查询我的未评价的订单信息
export function getNotReview(params) {
	return request({
		url: `/paycenter/api/payOrderInfo/v1/payNotReviewOrderList`,
		method: 'GET',
		params,
	});
}

// 根据订单号查询商户id，每一个业务取商户的方式都不一样
export function getMerchantIdByOrderId(orderId, bizOrderType) {
	return request({
		url: `/paycenter/api/payOrderInfo/v1/queryMerchantIdByOrderId/${orderId}/${bizOrderType}`,
		method: 'GET',
	});
}

// 根据业务类型查询全部评价列表和订单信息
export function getorderReview(bizType, params) {
	return request({
		url: `/system/api/sysReview/v1/orderReviewListByBizType/${bizType}`,
		method: 'GET',
		params,
	});
}

// 删除业务评价
export function delorderReview(reviewId) {
	return request({
		url: `/system/api/sysReview/v1/deleteSysReview/${reviewId}`,
		method: 'GET',
	});
}

// 查询酒店评价列表
export function getHotelReview(params) {
	return request({
		url: `/hotel/comment/self/comments`,
		method: 'GET',
		params,
	});
}

// 删除酒店评论
export function delHotelReview(params) {
	return request({
		url: `/hotel/comment/self/deleteCommentById`,
		method: 'GET',
		params,
	});
}
// 确认收货
export function postorderreceive(params) {
	return request({ 
		url: `/merchant/api/trade/order/receive/${params.id}`,
		method: 'GET',
	});
}
// 获取秒杀活动iezhi
export function getgetSeckillActivity(params) {
	return request({ 
		url: `/merchant/api/campaign/seckill/getSeckillActivity`,
		method: 'GET',
	});
}
// 获取秒杀活动list
export function getSeckillProductGoodslist(params) {
	return request({ 
		url: `/merchant/api/campaign/seckill/getSeckillProductGoods`,
		method: 'GET',
		params,
	});
}
// 积分商城页获取秒杀活动list
export function getSeckillGoodsLimitlist(params) {
	return request({ 
		url: `/merchant/api/campaign/seckill/getSeckillGoodsLimit`,
		method: 'GET',
		params,
	});
}
// 积分商品资讯
export function pointsnews(params){
	return request({
		url:'/merchant/promotion/article/page',
		method:"GET",
		params
	})
}

// 资讯详情
export function pointsnewsdetail(params){
	return request({
		url:'/merchant/promotion/article/get',
		method:"GET",
		params
	})
}
// 根据服务分类查询金刚列表
export function getclassify(params){
	return request({
		url:'/system/api/gridMenu/v1/classify',
		method:"GET",
		params
	})
}
// 根据服务分类查询金刚列表
export function tradeordercreate(data){
	return request({
		url:'/merchant/api/trade/order/create',
		method: 'POST',
		data: data,
	})
}
// 查询是否有未领取的礼物
export function gethasunreceived(params){
	return request({
		url:'/merchant/api/gift/has-unreceived',
		method:"GET",
		params
	})
}
export function postreceive(data){
	return request({
		url:'/merchant/api/gift/receive',
		method: 'POST',
		data: data,
	})
}
export function getunreceivedlist(params){
	return request({
		url:'/merchant/api/gift/unreceived-list',
		method:"GET",
		params
	})
}
// 首页常用查询
export function getgridMenuhome(params){
	return request({
		url:'/system/api/gridMenu/v1/home',
		method:"GET",
		params
	})
}
// 用户修改自定义首页
export function putgridMenu(data: any) {
  return request({
    url: '/system/api/gridMenu/v1/custom',
    method: 'PUT',
    data: data
  })
}
