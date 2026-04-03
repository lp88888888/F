// services/qqMapService.ts

/**
 * 腾讯地图路线规划服务（纯 API 调用 + polyline 解码）
 * 适用于 uni-app、微信小程序、H5 等环境
 */

// 坐标类型定义
export interface LatLng {
	latitude : number;
	longitude : number;
}

// 路线规划参数
export interface RouteParams {
	from : string; // "纬度,经度" 格式，如 "39.984104,116.307503"
	to : string;   // 同上
	key ?: string; // 腾讯地图 WebService API Key
}

// 请求结果统一格式
export interface RouteResult {
	status : boolean;
	data ?: DecodedRoute[];
	message ?: string;
}
// 单条路线信息
export interface DecodedRoute {
	path : LatLng[];      // 解码后的坐标点
	distance : number;    // 距离（米）
	duration : number;    // 时间（秒）
	toll ?: number;       // 通行费
	policy ?: string;     // 路线策略
}
/**
 * 解码 polyline 字符串（核心算法）
 */
// function decodeTencentPolyline(encoded): LatLng[] {

//   const coords = coors;
//   const points: LatLng[] = [];
//   if (coords.length < 2) return [];

//   // 第一个点是真实坐标
//   let lat = coords[0];
//   let lng = coords[1];

//   points.push({ latitude: lat, longitude: lng });

//   // 后面每两个数字是增量（单位：十万分之一度）
//   for (let i = 2; i < coords.length; i += 2) {
//     const dlat = coords[i] / 1e6;     // 转为度
//     const dlng = coords[i + 1] / 1e6; // 转为度

//     lat += dlat;
//     lng += dlng;

//     points.push({ latitude: lat, longitude: lng });
//   }
// console.error(points,'coords')
//   return points;
// }

function decodeTencentPolyline(polylines : { polyline : number[] }[]) : LatLng[][] {
	const allPaths : LatLng[][] = [];

	for (const route of polylines) {
		const encoded = route.polyline;
		const points : LatLng[] = [];

		if (!encoded || encoded.length < 2) continue;

		// 第一个点是真实坐标（单位：十万分之一度）
		let lat = encoded[0];
		let lng = encoded[1];
		points.push({ latitude: lat, longitude: lng });

		// 后续为增量
		for (let i = 2; i < encoded.length; i += 2) {
			const dlat = encoded[i] / 1e6;
			const dlng = encoded[i + 1] / 1e6;
			lat += dlat;
			lng += dlng;
			points.push({ latitude: lat, longitude: lng });
		}

		allPaths.push(points);
	}
	return allPaths;
}
export async function getDrivingRoute(
	params : RouteParams
) : Promise<RouteResult> {
	const { from, to, key = '你的腾讯地图Key' } = params;

	// 参数校验
	if (!from || !to) {
		return {
			status: false,
			message: '起终点不能为空'
		};
	}

	if (!key || key === '你的腾讯地图Key') {
		return {
			status: false,
			message: '缺少腾讯地图 API Key，请在参数中设置'
		};
	}

	const url = 'https://apis.map.qq.com/ws/direction/v1/driving/';

	try {
		// 构建请求参数
		const queryParams = {
			key,
			from,
			to,
			callback: 'cb',
			get_mp: 1,
			get_speed: 1,
			output: 'json'
		};

		let data : any;

		// 判断环境
		if (typeof uni !== 'undefined' && uni.request) {
			// uni-app 或 微信小程序
			const res : any = await uni.request({
				url,
				method: 'GET',
				data: queryParams
			});
			data = res.data;
		} else {
			// H5 环境
			const searchParams = new URLSearchParams(queryParams as any);
			const response = await fetch(`${url}?${searchParams}`);
			data = await response.json();
		}

		// 处理返回结果
		if (data.status === 0) {
			const routes = data.result?.routes;
			if (routes && routes.length > 0) {
				// ✅ 使用 decodeTencentPolyline 解码所有路线
				if (routes.length == 0 || routes[0].polyline.length < 10) {
					uni.showToast({ title: '未找到可用路线', icon: 'none' });
					return
				}
				const paths = decodeTencentPolyline(routes); // 返回 LatLng[][]

				const result : DecodedRoute[] = routes.map((route : any, index : number) => ({
					path: paths[index] || [],
					distance: formatDistance(route.distance),
					duration: formatMinutesToHour(route.duration),
					toll: route.toll,
					policy: route.policy
				}));

				return { status: true, data: result };
			} else {
				uni.showToast({ title: '未找到可用路线', icon: 'none' });
			}
		} else {
			return { status: false, message: data.message || '路线请求失败' };
		}
	} catch (error : any) {
		console.error('路线请求异常:', error);
		const errorMsg =
			error.message?.includes('network') || error.errMsg?.includes('network')
				? '网络连接失败，请检查网络'
				: error.message || '路线请求失败';

		return { status: false, message: errorMsg };
	}
}
function formatMinutesToHour(ts : number) : string {
	const hours = Math.floor(ts / 60);   // 计算小时数
	const minutes = ts % 60;             // 剩余分钟数

	let result = '';
	if (hours > 0) {
		result += `${hours}小时`;
	}
	if (minutes > 0) {
		result += `${minutes}分钟`;
	}

	// 如果传入的是 0 分钟，避免返回空字符串
	if (result === '') {
		result = '0分钟';
	}

	return result;
}
const formatDistance = (value) => {
	if (value < 1000) {
		return `${Math.round(value)}m`;
	} else {
		return `${(value / 1000).toFixed(1)}km`;
	}
};