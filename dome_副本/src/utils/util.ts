interface RouteParams {
	lat: string | number;
	lng: string | number;
	key?: string; // 腾讯地图 WebService API Key
}
// 请求结果统一格式
interface RouteResult {
	status: boolean;
	data?: any;
	message?: string;
}
import { geoconvLab } from '@/api/address';

// APP 中打开微信小程序
export function AppLaunchMiniProgram(id,path='/'){
	plus.share.getServices(res => {
		console.log('-00---0-0-0--0',res);
	  const weixin = res.find(i => i.id === 'weixin')
	  weixin && weixin.launchMiniProgram({
	    id: id, // 原始ID，以gh_开头
	    // type: 0, // 0正式版 1开发版 2体验版
	    path: path
	  })
	})
}
//app解析手机号
export function parseToken(token) {
	if (!token) return null;

	try {
		// JWT 由三部分组成：header.payload.signature
		const payloadBase64 = token.split('.')[1];
		// Base64Url 解码
		const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
		return JSON.parse(payloadJson);
	} catch (e) {
		console.error('Token 解析失败:', e);
		return null;
	}
}
//小程序解析手机号
export function parseTokens(token) {
	if (!token) return null;

	try {
		const payloadBase64 = token.split('.')[1];
		if (!payloadBase64) return null;

		const buffer = wx.base64ToArrayBuffer(payloadBase64);
		const uint8Arr = new Uint8Array(buffer);

		let binary = '';
		for (let i = 0; i < uint8Arr.length; i++) {
			binary += String.fromCharCode(uint8Arr[i]);
		}

		const payloadString = decodeURIComponent(escape(binary));
		return JSON.parse(payloadString);
	} catch (e) {
		console.error('Token 解析失败:', e);
		return null;
	}
}
//解析扫小程序码进入的scene
export function parseQueryString(queryString) {
	if (!queryString) return {};
	const query = queryString.startsWith('?') ? queryString.substring(1) : queryString;
	return query.split('&').reduce((obj, pair) => {
		const [key, value] = pair.split('=');
		obj[decodeURIComponent(key)] = decodeURIComponent(value || '');
		return obj;
	}, {});
}
export function filtertime(distance) {
	if (!distance) return '';
	const date = new Date(distance);
	if (isNaN(date.getTime())) {
		return '--';
	}
	// 获取本地今天的零点
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const beforeYesterday = new Date(today);
	beforeYesterday.setDate(beforeYesterday.getDate() - 2);
	// 输入日期的零点
	const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	if (inputDate.getTime() === today.getTime()) {
		return '今天';
	} else if (inputDate.getTime() === yesterday.getTime()) {
		return '昨天';
	} else if (inputDate.getTime() === beforeYesterday.getTime()) {
		return '前天';
	} else {
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${month}.${day}`;
	}
}
export async function wgs84Togcj02(params: RouteParams): Promise<RouteResult> {
	const { lat, lng, key = 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' } = params;

	// 参数校验
	if (!lat || !lng) {
		return {
			status: false,
			message: '经纬度为空',
		};
	}

	if (!key) {
		return {
			status: false,
			message: '缺少腾讯地图 API Key，请在参数中设置',
		};
	}
	const url = 'https://apis.map.qq.com/ws/coord/v1/translate';
	try {
		// 构建请求参数
		const queryParams = {
			locations: `${lat},${lng}`,
			type: 1, // 1: wgs84->gcj02
			key: key,
		};

		let data: any;
		// 判断环境
		if (typeof uni !== 'undefined' && uni.request) {
			// uni-app 或 微信小程序
			const res: any = await uni.request({
				url,
				method: 'GET',
				data: queryParams,
			});
			data = res.data;
			console.log(data);
		} else {
			// H5 环境
			const searchParams = new URLSearchParams(queryParams as any);
			const response = await fetch(`${url}?${searchParams}`);
			data = await response.json();
		}

		// 处理返回结果
		if (data.status === 0) {
			const locations = data.locations;
			if (locations && locations.length > 0) {
				return { status: true, data: locations[0] };
			} else {
				uni.showToast({ title: '转换失败', icon: 'none' });
			}
			// if (routes && routes.length > 0) {
			// 	// ✅ 使用 decodeTencentPolyline 解码所有路线
			// 	if (routes.length == 0 || routes[0].polyline.length < 10) {
			// 		uni.showToast({ title: '未找到可用路线', icon: 'none' });
			// 		return
			// 	}
			// 	const paths = decodeTencentPolyline(routes); // 返回 LatLng[][]

			// 	const result : DecodedRoute[] = routes.map((route : any, index : number) => ({
			// 		path: paths[index] || [],
			// 		distance: formatDistance(route.distance),
			// 		duration: formatMinutesToHour(route.duration),
			// 		toll: route.toll,
			// 		policy: route.policy
			// 	}));

			// 	return { status: true, data: result };
			// } else {
			// 	uni.showToast({ title: '未找到可用路线', icon: 'none' });
			// }
		} else {
			return { status: false, message: data.message || '请求失败' };
		}
	} catch (error: any) {
		const errorMsg =
			error.message?.includes('network') || error.errMsg?.includes('network') ? '网络连接失败，请检查网络' : error.message || '路线请求失败';

		return { status: false, message: errorMsg };
	}
}
// 拨打电话
export function makePhoneCall(phoneNumber) {
	console.log('phoneNumber', phoneNumber);
	const cleanNumber = String(phoneNumber).replace(/[^0-9]/g, '');
	// #ifdef MP-WEIXIN || APP-HARMONY
	
	uni.makePhoneCall({
		phoneNumber: cleanNumber,
		fail: (err) => {
			console.log(err);
		},
	});
	// #endif
	// #ifdef APP-PLUS
	plus.runtime.openURL(
		`tel:${cleanNumber}`,
		() => {
			// uni.showToast({
			// 	title: '正在拨号...',
			// 	icon: 'none'
			// });
		},
		(e) => {
			console.error('拨号失败:', e.message);
			uni.showToast({
				title: '无法拨号',
				icon: 'error',
			});
		}
	);

	// #endif
}
export function formatTimestamp(timestamp, type = 'YYYY-MM-DD') {
	if (typeof timestamp == 'string') {
		timestamp = timestamp.replace(/-/g, '/');
	}
	const date = new Date(timestamp);
	let year: string | number = date.getFullYear();
	let month: string | number = date.getMonth() + 1; // 月份从0开始，需要加1
	let day: string | number = date.getDate();
	let hours: string | number = date.getHours();
	let minutes: string | number = date.getMinutes();
	let seconds: string | number = date.getSeconds();
	let weekDay: string | number = date.getDay();

	const weeklObj = {
		0: '星期日',
		1: '星期一',
		2: '星期二',
		3: '星期三',
		4: '星期四',
		5: '星期五',
		6: '星期六',
	};
	if (month < 10) {
		month = `0${month}`;
	}
	if (day < 10) {
		day = `0${day}`;
	}
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	if (seconds < 10) {
		seconds = `0${seconds}`;
	}
	if (hours < 10) {
		hours = `0${hours}`;
	}

	if (type == 'YYYY-MM-DD HH:mm:ss' || type == 'yyyy-MM-dd hh:mm:ss') {
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	} else if (type == 'YYYY-MM-DD HH:mm') {
		return `${year}-${month}-${day} ${hours}:${minutes}`;
	} else if (type == 'MM-DD HH:mm') {
		return `${month}-${day} ${hours}:${minutes}`;
	} else if (type == 'week') {
		return weeklObj[weekDay];
	} else if (type == 'mm月dd日 hh:MM') {
		return `${month}月${day}日 ${hours}:${minutes}`;
	} else if (type == 'YYYY.MM.DD' || type == 'yyyy-MM-dd') {
		return `${year}.${month}.${day}`;
	}else if (type == 'MM.DD' || type == 'MM-dd') {
		return `${month}-${day}`;
	} else {
		return `${year}-${month}-${day}`;
	}
}
interface OpenLocation {
	latitude: string | number;
	longitude: string | number;
	scale?: number;
	name?: string;
	address?: string;
}
// 导航
export function openLocation(obj: OpenLocation) {
	if (!obj.latitude || !obj.longitude) return;
	// #ifdef MP-WEIXIN
	uni.openLocation({
		latitude: Number(obj.latitude), //维度
		longitude: Number(obj.longitude), //经度
		scale: obj.scale || 18, //缩放比例，范围5~18，默认为18
		name: obj.name || '',
		address: obj.address || '',
		fail: () => {},
	});
	// #endif
	// #ifdef APP-HARMONY
	// uni.showToast({
	// 	icon: 'none',
	// 	title: '本次导航需使用百度地图，使用前请安装百度地图',
	// });
	navigate({
		latitude: obj.latitude,
		longitude: obj.longitude,
		address: obj.name || obj.address,
	});

	// #endif
}
/**
 * 前往导航APP使用
 * obj 对象包含{
	 * longitude
	 * latitude
	 * address
 }
 * @param {startLocation} obj 起始位置(必填)
 * @param {endLocation} obj  终点位置(必填)
 * @param [passingLocationList] Array[obj]  途经点位置
 * 示例：{
	  "startLocation": {
			"longitude": 108.964162,
			"latitude": 34.218285,
			"address": "大雁塔",
		},
		"passingLocationList":[
			{
				"longitude": 108.91972,
				"latitude": 34.88478,
				"address": "牡丹园"
			},
			{
				"longitude": 108.91972,
				"latitude": 34.88478,
				"address": "牡丹园"
			},
			...
		],
		"endLocation": {
			"longitude": 108.91972,
			"latitude": 34.88478,
			"address": "牡丹园"
		}
	 }
 */
export function openAPPLocation(obj) {
	// #ifdef APP-PLUS
	const bdMapPlugin = uni.requireNativePlugin('bdMapPlugin');
	uni.showToast({
		icon: 'none',
		title: '导航正在加载中~',
	});
	if (!obj.startLocation) {
		let start = { lat: 34.2778, lng: 108.953098, address: '西安市' };
		if (uni.getStorageSync('address')) {
			start.lat = uni.getStorageSync('address').lat;
			start.lng = uni.getStorageSync('address').lng;
			start.address = uni.getStorageSync('address').standardAddress || uni.getStorageSync('address').city;
		}
		obj.startLocation = {
			longitude: start.lng,
			latitude: start.lat,
			address: start.address,
		};
	}

	bdMapPlugin.openBdNavigation(JSON.stringify(obj), (res) => {
		console.log('打开导航回调', res);
	});
	// #endif
	// #ifdef APP-HARMONY
	// uni.showToast({
	// 	icon: 'none',
	// 	title: '本次导航需使用百度地图，使用前请安装百度地图',
	// });
	navigate(obj.endLocation);
	// #endif
}

// 获取当前位置
export function getAddress(){
	const bdMapPlugin = uni.requireNativePlugin('bdMapPlugin');
	uni.getLocation({
		type: 'wgs84',
		success: (res) => {
			console.log('首次进入拉起定位', res);
			bdMapPlugin.getCurrentLocation((event) => {
				console.log('当前位置', JSON.parse(event));
				const res = JSON.parse(event);
				if (res.z) {
					const result = res.z;
					let address = {
						lat: res.c,
						lng: res.d,
						city: result.city,
						cityCode: result.adcode.substr(0, 4) + '00',
						province: result.province,
						provinceCode: result.adcode.substr(0, 2) + '0000',
						district: result.district,
						districtCode: result.adcode,
						standardAddress: result.address,
					};
					uni.setStorageSync('address', address);
				}
			});
		},
		fail: (err) => {
			console.log('首次进入拉起定位失败', err);
			let address = {
				lat: 34.2778,
				lng: 108.953098,
				city: '西安市',
				cityCode: '610100',
				province: '陕西省',
				provinceCode: '610000',
				district: '雁塔区',
				districtCode: '610104',
				standardAddress:"陕西省西安市雁塔区"
			};
			uni.setStorageSync('address', address);
			console.log('err', err);
		},
	});
	
}

async function navigate(destination, preferMap = 'baidu') {
	let longitude = destination.longitude;
	let latitude = destination.latitude;

	// 鸿蒙中对地址进行转换（高德和腾讯地图）
	let ress = await geoconvLab(`${destination.longitude},${destination.latitude}`, 5);
	console.log(ress);
	if (ress.status == 0) {
		longitude = ress.result[0].x;
		latitude = ress.result[0].y;
	}
	const maps = {
		baidu: {
			name: '百度地图',
			url: `baidumap://map/direction?destination=latlng:${destination.latitude},${destination.longitude}|name:${encodeURIComponent(
				destination.address
			)}&mode=driving&src=app`,
		},
		amap: {
			name: '高德地图',
			url: `amapuri://route/plan/?dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(destination.address)}&dev=0&t=0`,
		},
		qq: {
			name: '腾讯地图',
			url: `qqmap://map/routeplan?type=drive&tocoord=${latitude},${longitude}&to=${encodeURIComponent(destination.address)}&referer=app`,
		},
	};
	uni.showActionSheet({
		// itemList: ['百度地图', '高德地图', '腾讯地图'],
		itemList: ['百度地图', '高德地图'],
		success: (res) => {
			let key = res.tapIndex == 2 ? 'qq' : res.tapIndex == 1 ? 'amap' : 'baidu';
			const map = maps[key] || maps.baidu;
			plus.runtime.openURL(map.url, () => {
				uni.showModal({
					title: '未安装地图',
					content: `是否下载${map.name}？`,
					success: (res) => {
						if (res.confirm) {
							plus.runtime.openURL(`https://www.baidu.com/s?wd=${encodeURIComponent(map.name + '下载')}`);
						}
					},
				});
			});
		},
		fail: (res) => {
			console.log(res.errMsg);
		},
	});
}

export function selectionLocation() {
	const bdMapPlugin = uni.requireNativePlugin('bdMapPlugin');
	bdMapPlugin.selectionLocation((e) => {
		const res = JSON.parse(e);
		return res;
	});
}

export function showToast(msg, duration = 2000) {
	uni.showToast({
		title: msg,
		duration: duration,
		icon: 'none',
	});
}

export function showToastSuccess(msg, duration = 2000) {
	uni.showToast({
		title: msg,
		duration: duration,
		icon: 'success',
	});
}
export function hideLoading() {
	uni.hideLoading();
}

export function showLoading(titleStr: string = '') {
	uni.showLoading({
		title: titleStr ? titleStr : '请求中',
		mask: true,
	});
}
export function isEmpty(obj) {
	if (typeof obj == 'undefined' || obj == null || obj == '') {
		return true;
	} else {
		return false;
	}
}
// 验证手机号码是否有效
export function isPhoneAvailable(phone: string) {
	var myreg = /^1[3456789]\d{9}$/;
	if (!myreg.test(phone)) {
		return false;
	} else {
		return true;
	}
}
//小程序弹框提示2
export function showAlert2(title: string, msg, showCancel, cancelText, okText, confirmCallBack, failCallBack) {
	wx.showModal({
		title: title,
		content: msg,
		showCancel: showCancel,
		cancelText: cancelText, //默认是“取消”
		cancelColor: '#666666', //取消文字的颜色
		cancelFont: '1rpx',
		confirmText: okText, //默认是“确定”
		confirmColor: '#fe7215', //确定文字的颜色
		success: function (res) {
			if (res.confirm) {
				confirmCallBack();
			} else {
				failCallBack();
			}
		},
	});
}
export function formatPlateNum(plateNum: string) {
	return plateNum.substring(0, 5) + '**';
}

export function formatBankCardNum(cardNo: string) {
	return cardNo
		.replace(/\s/g, '')
		.replace(/[^\d]/g, '')
		.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatBankCardNumWithMask(cardNo: string) {
	if (typeof cardNo !== 'string' || !cardNo.trim()) {
		return '';
	}
	const cleaned = cardNo.replace(/\s/g, '');
	if (cleaned.length < 8) {
		return cardNo;
	}
	return cleaned.replace(/^(\d{4})\d+(\d{4})$/, '**** **** **** $2');
}

export function formatBankCardNumWithMaskNew(cardNo: string) {
	return cardNo.replace(/^(\d{4})\d+(\d{3})$/, '$1 **** **** $2');
}

export function formatIdCardNumWithMask(cardNo: string) {
	return cardNo.replace(/^(\d{4})\d+(\d{4})$/, '$1**********$2');
}

export function formatPhoneNumWithMask(cardNo: string) {
	return cardNo.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2');
}

export function formatDouyinNumWithMask(cardNo: string) {
	return cardNo.replace(/^(\w{3})\w+(\w{3})$/, '$1 ****  $2');
}

export function formatCardStatusStr(num: number) {
	switch (num) {
		case 1:
			return '正常';
		case 2:
			return '有卡挂起';
		case 3:
			return '无卡挂起';
		case 4:
			return '有卡注销';
		case 5:
			return '无卡注销';
		case 6:
			return '卡挂失';
	}
}

export function formatCardTypeStr(num) {
	switch (num) {
		case 1:
			return '个人卡';
		case 2:
			return '单位卡';
	}
}

export function add0(m: number) {
	return m < 10 ? '0' + m : m;
}

export function formatTime(shijianchuo: string | number) {
	if (typeof shijianchuo === 'string' && !/^\d+$/.test(shijianchuo)) {
		throw new Error('Invalid timestamp format');
	}
	const timestamp = typeof shijianchuo === 'string' ? parseInt(shijianchuo, 10) : shijianchuo;
	const time = new Date(timestamp);
	if (isNaN(time.getTime())) {
		throw new Error('Invalid timestamp value');
	}
	const y = time.getFullYear();
	const m = time.getMonth() + 1;
	const d = time.getDate();
	const h = time.getHours();
	const mm = time.getMinutes();
	const s = time.getSeconds();
	return `${y}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(mm)}:${add0(s)}`;
}
// 获取当前页面参数
export function CurrentPage() {
	let pages = getCurrentPages();
	var currentPage = pages[pages.length - 1];
	var url = '/' + currentPage.route;
	var options = currentPage.options; //如果要获取url中所带的参数可以查看options
	//拼接url的参数
	var urlWithArgs = url + '?';
	for (var key in options) {
		var value = options[key];
		urlWithArgs += key + '=' + value + '&';
	}
	urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
	return urlWithArgs;
}
/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accAdd(arg1: number, arg2: number) {
	if (isNaN(arg1)) {
		arg1 = 0;
	}
	if (isNaN(arg2)) {
		arg2 = 0;
	}
	arg1 = Number(arg1);
	arg2 = Number(arg2);
	var r1, r2, m, c;
	try {
		r1 = arg1.toString().split('.')[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split('.')[1].length;
	} catch (e) {
		r2 = 0;
	}
	c = Math.abs(r1 - r2);
	m = Math.pow(10, Math.max(r1, r2));
	if (c > 0) {
		var cm = Math.pow(10, c);
		if (r1 > r2) {
			arg1 = Number(arg1.toString().replace('.', ''));
			arg2 = Number(arg2.toString().replace('.', '')) * cm;
		} else {
			arg1 = Number(arg1.toString().replace('.', '')) * cm;
			arg2 = Number(arg2.toString().replace('.', ''));
		}
	} else {
		arg1 = Number(arg1.toString().replace('.', ''));
		arg2 = Number(arg2.toString().replace('.', ''));
	}
	return (arg1 + arg2) / m;
}
// 验证手机号码是否有效
export function isEmail(email: string) {
	var myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
	if (!myreg.test(email)) {
		return false;
	} else {
		return true;
	}
}

// 分割小数点前后（价格中使用）
// type =left 整数部分，type =right 小数部分
export function decimalPointDivision(price: string | number, type: string, toFix: number = 2) {
	let srt: string = String(Number(price).toFixed(toFix));
	if (price) {
		if (type == 'left') {
			return srt.substring(0, srt.indexOf('.'));
		} else {
			return srt.substring(srt.indexOf('.'));
		}
	}
	return '';
}

export function getUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
}

export function copyText(data: string) {
	uni.setClipboardData({
		data,
		success: () => {
			console.log('success');
			// #ifdef APP-HARMONY
			uni.showToast({
				icon: 'none',
				title: '复制成功',
			});
			// #endif
		},
	});
}

// 处理省市名称
export function formatProvince(provinceName: string) {
	if (!provinceName || typeof provinceName !== 'string') {
		return '';
	}

	// 特殊情况映射
	const specialMap = {
		新疆维吾尔自治区: '新疆',
		新疆维吾尔族自治区: '新疆',
		广西壮族自治区: '广西',
		宁夏回族自治区: '宁夏',
		西藏自治区: '西藏',
		内蒙古自治区: '内蒙古',
	};

	if (specialMap[provinceName]) {
		return specialMap[provinceName];
	}

	// 通用规则
	return provinceName
		.replace(/自治区$/, '')
		.replace(/特别行政区$/, '')
		.replace(/省$/, '')
		.replace(/市$/, '');
}
export function ID2(n) {
	var t = '';
	for (var i = 0; i < n; i++) {
		t += Math.floor(Math.random() * 10);
	}
	return Number(t);
}
// 同步获取设备信息
export function systemInfo() {
	return uni.getSystemInfoSync();
}

// 查看单个图片
export const $previewItemImage = (url: string) => {
	if (!url) return;
	let newArr = [];
	newArr.push(url);
	uni.previewImage({
		urls: newArr,
	});
};
// 查看多个图片
export const $previewListImage = (current = 0, urls: any, type = '') => {
	let newArr = [];
	if (type) {
		urls = urls.map((item) => item[type]);
	}
	if (Array.isArray(urls)) {
		newArr = urls;
	} else {
		newArr.push(urls);
	}
	console.log(current);
	console.log(newArr);
	uni.previewImage({
		current,
		urls: newArr,
	});
};

const formatNumber = (n) => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};

function mapToJson(map: any) {
	var results = {};
	var keys = Object.keys(map).sort();
	for (let index in keys) {
		let key = keys[index];
		console.log('key=' + key);
		results[key] = map[key];
	}
	console.log(results);
	return JSON.stringify(results);
}

function jsonToMap(jsonStr: string) {
	if (typeof jsonStr !== 'string') {
		throw new Error('Input must be a string');
	}
	try {
		const json = JSON.parse(jsonStr);
		if (typeof json !== 'object' || json === null) {
			throw new Error('Invalid JSON format');
		}
		const results: Record<string, any> = {};
		for (const k of Object.keys(json)) {
			results[k] = json[k];
		}
		return results;
	} catch (error) {
		throw new Error('Failed to parse JSON string');
	}
}

function timeStampStr() {
	var timestamp = Date.parse(new Date());
	timestamp = timestamp / 1000;
	return timestamp.toString();
}

const signKey = '@2020!02301440*';

function formatVehicleNumWithMask(vehicleNum: string) {
	let result = '';
	if (vehicleNum && vehicleNum.length > 6) {
		result = vehicleNum.substring(0, 4) + '**' + vehicleNum.substring(6);
	} else {
		result = vehicleNum ? vehicleNum : '';
	}
	return result;
}

function formatUserNameWithMask(str: string) {
	let result = '';
	if (str && str.length > 1) {
		result = str.substring(0, 1) + '*' + str.substring(2);
	} else {
		result = str ? str : '';
	}
	return result;
}

function unformatBankCardNum(cardNo: string) {
	return cardNo.replace(/\s|\xA0/g, '');
}

//小程序弹框提示
function showAlert(msg: string, cancelText: string, okText: string, confirmCallBack: any) {
	wx.showModal({
		title: '温馨提示',
		content: msg,
		showCancel: true,
		cancelText: cancelText, //默认是“取消”
		cancelColor: '#666666', //取消文字的颜色
		cancelFont: '1rpx',
		confirmText: okText, //默认是“确定”
		confirmColor: '#fe7215', //确定文字的颜色
		success: function (res) {
			if (res.confirm) {
				confirmCallBack();
			}
		},
	});
}

//信息提示
function showMessage(title, msg, okText) {
	wx.showModal({
		title: title,
		content: msg,
		showCancel: false,
		cancelText: '', //默认是“取消”
		cancelColor: '#666666', //取消文字的颜色
		cancelFont: '1rpx',
		confirmText: okText, //默认是“确定”
		confirmColor: '#fe7215', //确定文字的颜色
		// success: function (res) {
		//   if (res.confirm) {
		//     confirmCallBack()
		//   }else{
		//     failCallBack()
		//   }
		// }
	});
}

function callPhone(phoneNumber) {
	uni.makePhoneCall({
		phoneNumber: phoneNumber,
		success: function () {},
		fail: function () {},
	});
}

function useCheckUser() {
	wx.showModal({
		title: '温馨提示',
		content: '您已经是平台老会员，无法参加新人活动',
		showCancel: false,
		confirmText: '返回首页', //默认是“确定”
		success: function (res) {
			if (res.confirm) {
				wx.switchTab({
					url: '/pages/home/home',
				});
			}
		},
	});
}

function getUUID25() {
	let digits = '';
	for (let i = 0; i < 24; i++) {
		digits += Math.floor(Math.random() * 10); // 生成0-9之间的随机数字
	}
	return digits;
}

/**检查活动状态 */
function checkActivityValid() {
	var info = wx.getStorageSync('activity');
	var status = '';
	var startTime = '';
	if (info) {
		status = info.status;
		startTime = info.startTime;
	}
	//0进行中  1未开始  2已结束
	if (status == 0) {
		return true;
	} else if (status == 1) {
		this.showToast('活动将于' + startTime + '开始,敬请期待!');
		// this.showToast('活动暂未开始,敬请期待!')
		return false;
	} else {
		this.showMessage('提示', '活动已结束，敬请关注下期活动!', '好的');
		return false;
	}
}

/**检查活动状态 */
function checkDriveActivityValid() {
	var info = wx.getStorageSync('driveAct');
	var status = '';
	var startTime = '';
	if (info) {
		status = info.status;
		startTime = info.startTime;
	}
	//0进行中  1未开始  2已结束
	if (status == 0) {
		return true;
	} else if (status == 1) {
		this.showToast('活动将于' + startTime + '开始,敬请期待!');
		return false;
	} else {
		this.showMessage('提示', '活动已结束，敬请关注下期活动!', '好的');
		return false;
	}
}

//判断车辆审核状态(01待审核，02同意，03拒绝，04作废)
function checkVehicleAuditStatus() {
	var vehicle = wx.getStorageSync('userInfo').vehicle;
	if (!vehicle || this.isEmpty(vehicle.vehicleNumber)) {
		this.showAlert('此操作需要绑定车辆信息,是否现在绑定', '取消', '确定', function confirm() {
			wx.navigateTo({
				url: '/pages/mine/bindCar/bindCar',
			});
		});
		return false;
	}
	if (vehicle && vehicle.auditStatus == '01') {
		this.showMessage('提示', '您的车辆信息正在审核中,请稍后再试!', '好的');
		return false;
	}
	if (vehicle && vehicle.auditStatus == '03') {
		var auditOpinions = vehicle.auditOpinions ? vehicle.auditOpinions : '车辆信息被驳回,请核对信息';
		this.showAlert(auditOpinions, '取消', '确定', function confirm() {
			wx.navigateTo({
				url: '/pages/mine/myCar/myCar',
			});
		});
		return false;
	}
	return true;
}

function checkAndToLogin(n) {
	if (!getApp().checkLogin()) {
		this.showAlert2(
			'提示',
			'本次操作需要您进行登录验证',
			true,
			'取消',
			'确定',
			function success() {
				// #ifdef MP-WEIXIN
				wx.navigateTo({
					url: '/pages/login/login?fromPage=' + encodeURIComponent(getApp().CurrentPage()),
				});
				// #endif
				// #ifdef APP
				uni.navigateTo({ url: '/pages_A/login_password/login' });
				// #endif
			},
			function fail() {
				n ? wx.navigateBack({ delta: 1 }) : '';
			}
		);
		return false;
	} else {
		return true;
	}
}

function changeNumToHan(num) {
	var arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
	var arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'];
	if (!num || isNaN(num)) return '零';
	var english = num.toString().split('');
	var result = '';
	for (var i = 0; i < english.length; i++) {
		var des_i = english.length - 1 - i; // 倒序排列设值
		result = arr2[i] + result;
		var arr1_index = english[des_i];
		result = arr1[arr1_index] + result;
	}
	result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十'); // 将【零千、零百】换成【零】 【十零】换成【十】
	result = result.replace(/零+/g, '零'); // 合并中间多个零为一个零
	result = result.replace(/零亿/g, '亿').replace(/零万/g, '万'); // 将【零亿】换成【亿】【零万】换成【万】
	result = result.replace(/亿万/g, '亿'); // 将【亿万】换成【亿】
	result = result.replace(/零+$/, ''); // 移除末尾的零
	// 将【一十】换成【十】
	result = result.replace(/^一十/g, '十');
	return result;
}

/**
 * 查询定位
 * 'authorized'：表示已经获得授权，无需再次请求授权；
 *'denied'：表示请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
 *'not determined'：表示尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
 * 'config error'
 */
export async function getLocation() {
	const appAuthorizeSetting = uni.getAppAuthorizeSetting();
	console.log('查询定位权限', appAuthorizeSetting.locationAuthorized);
	if (appAuthorizeSetting.locationAuthorized == 'denied') retuen;
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'wgs84',
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject({
					lat: 34.2778,
					lng: 108.953098,
					city: '西安市',
					cityCode: '610100',
					province: '陕西省',
					provinceCode: '610000',
					district: '雁塔区',
					districtCode: '610104',
				});
			},
		});
	});
}
/**
 * 判断日期是否在区间内
 * @param {string|Date} date 待检测日期
 * @param {string|Date} start 开始日期
 * @param {string|Date} end 结束日期
 * @returns {boolean}
 */
 export function isDateBetween(date, start, end) {
  const d = new Date(date);
  const s = new Date(start);
  const e = new Date(end);

  // 逻辑：d 大于等于 s 且 小于等于 e
  return d >= s && d <= e;
}

export function addDays(dateStr, days) {
  const date = new Date(dateStr);
  // 直接在当前天数上累加
  date.setDate(date.getDate() + days);
  
  // 格式化输出为 YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// 去除播报文本中的特殊字符
export function fixQuotes(str){
	return str
		// 将 HTML 属性的双引号改为单引号
		.replace(/<[^>]+>/g,'')
		// .replace(/href="/g, "")
		// .replace(/target="/g, "")
		// .replace(/" >/g, "")
		// .replace(/" >/g, "") // 闭合标签
		// 清理路径中的多余空格
		.replace(/\*\*(.*?)\*\*/g, '$1') // 去除加粗的 **
		.replace(/\*(.*?)\*/g, '$1')     // 去除列表或斜体的 *
		.replace(/`(.*?)`/g, '$1')       // 去除行内代码的 `
		.replace(/#/g, '')               // 去除标题的 #
		.replace(/>/g, '')               // 去除引用的 >
		// 将换行符替换为逗号或句号，保证语音引擎在这里会有自然的停顿，而不是直接连读
		.replace(/\s+/g, '')             // 清除多余的空格
		.replace(/[*`]/g, '') // 移除星号和反引号
		.replace(/\n+/g, '，') // 将换行替换为逗号，让语音有停顿
		// .replace(/\/\s+/g, '') // 移除多余空格
		.replace(/\s+\//g, '')
		// 修复换行符显示
		.replace(/\n/g, '');
}