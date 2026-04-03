import request from '@/utils/request';;

/**
 * 发票记录列表
 */
export function myRecords(data) {
	return request({
		url: `/paycenter/api/invoice/v1/myRecords?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
		method: 'GET',
		data:data
	});
}
export function applyForm(data: any) {
	return request({
		url: '/paycenter/api/invoice/v1/apply',
		method: 'POST',
		data: data
	});
}

export function invoiceobj(id) {
	return request({
		url: `/paycenter/api/invoice/v1/${id}`,
		method: 'GET',
	});
}


export function download(data) {
	return request({
		url: `/paycenter/api/invoice/v1/download`,
		method: 'GET',
		data:data
	});
}

// 申请重新开票（含新抬头信息）
export function reInvoiceForm(data: any) {
	return request({
		url: '/paycenter/api/invoice/v1/reInvoice',
		method: 'POST',
		data: data
	});
}
