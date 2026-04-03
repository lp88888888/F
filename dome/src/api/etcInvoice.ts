import request from '@/utils/request';

/**
 * etc发票接口公共入口
 */
export function etcInvoice(params: any) {
	let blackUrl = ['getTicketId', 'appAuthMobileRequest', 'appAuthLoginRequest']
	if (!blackUrl.includes(params.serverUrl)) {
	  params['ticketId'] = uni.getStorageSync('etcUser').ticketId
	  params['mobile'] = uni.getStorageSync('etcUser').mobile
	}
	
	// let url = '/management/api/etc/invoice/request?key='+ params.serverUrl
	let url = '/travel/api/etcInvoice/v1/'+ params.serverUrl
	
	delete params.serverUrl
	
	return request({
		url: url,
		method: 'POST',
		data: params
	});
}
/**
 * ETC
 */
// 获取短信
export function requestEtc(params: any) {
  return request({
  	url: '/travel/api/etcInvoice/v1/appAuthMobileRequest',
  	method: 'POST',
  	data: params
  });
}
export function requestetcXy(params: any) {
  return request({
  	url: '/travel/api/etcInvoice/v1/etcCardMobileList',
  	method: 'POST',
  	data: params
  });
}
export function requestetcXy2(params: any) {
  return request({
  	url: '/travel/api/etcInvoice/v1/etcCardCheckCustomer',
  	method: 'POST',
  	data: params
  });
}
export function requestetcXy3(params: any) {
 return request({
   	url: '/travel/api/etcInvoice/v1/etcCardManyCardBind',
   	method: 'POST',
   	data: params
   });
}

// etc 常见问题
export function questionAnswerList(params: any) {
 return request({
   	url: '/travel/etcQuestionAnswer/v1/questionAnswerList',
   	method: 'POST',
   	params: params
   });
}

//获取登录验证标识
export function getTicketId(params: any) {
 return request({
   	url: '/travel/api/etcInvoice/v1/getTicketId',
   	method: 'POST',
   	data: params
   });
}