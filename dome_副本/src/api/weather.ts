
import request from '@/utils/request';
// 今日天气
export function getTadayApi(data : any) {
	return request({
		url: '/dataServer/weather/getTodayApi',
		method: 'GET',
		data: data
	});
}
// 今日空气质量
export function getairNowapi(data : any) {
	return request({
		url: '/dataServer/weather/getAirNowApi',
		method: 'GET',
		data: data
	});
}
// 未来24小时的
export function getWeather24api(data : any) {
	return request({
		url: '/dataServer/weather/getWeather24Api',
		method: 'GET',
		data: data
	});
}
// 未来七天的
export function getWeather7dapi(data : any) {
	return request({
		url: '/dataServer/weather/getWeather7dApi',
		method: 'GET',
		data: data
	});
}
// 生活质量
export function getIndices1dapi(data : any) {
	return request({
		url: '/dataServer/weather/getIndices1dApi',
		method: 'GET',
		data: data
	});
}
// 生活质量
export function getWeatherWarnings(data : any) {
	return request({
		url: '/dataServer/weather/getWarningApi',
		method: 'GET',
		data: data
	});
}