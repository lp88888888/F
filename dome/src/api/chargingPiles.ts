
import request from '@/utils/request';
// 分页查询附近充电站列表
export function getchargingList(data: any) {
	return request({
		url: '/travel/api/charging/v1/page',
		method: 'POST',
		data: data
	});
}