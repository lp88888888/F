const AK = 'D5RzSIhdhH31lFaDl6SIQC0UtapIAdUT';

// 坐标转换
export const coordinateConversion = (lng, lat) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://api.map.baidu.com/geoconv/v2/?coords=${lng},${lat}&from=1&to=5&ak=${AK}`,
			method: 'GET',
			success: (res) => {
				if (res.data.status === 0) {
					resolve({
						lng: res.data.result[0].x,
						lat: res.data.result[0].y,
					});
				} else {
					reject(new Error(`百度接口错误，status=${res.data.status}`));
				}
			},
			fail: reject,
		});
	});
};

//
export const DBReverseGeocoding = (lng, lat) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${AK}&extensions_poi=0&entire_poi=1&sort_strategy=distance&output=json&coordtype=bd09ll&location=${lat},${lng}`,
			method: 'GET',
			success: (res) => {
				if (res.data.status === 0) {
					resolve(res.data.result);
				} else {
					reject(new Error(`百度接口错误，status=${res.data.status}`));
				}
			},
			fail: reject,
		});
	});
};

// 逆地理编码Poi
export const DBReverseGeocodingPoi = (lng, lat) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${AK}&extensions_poi=1&entire_poi=1&sort_strategy=distance&output=json&coordtype=bd09ll&location=${lat},${lng}`,
			method: 'GET',
			success: (res) => {
				if (res.data.status === 0) {
					resolve(res.data.result);
				} else {
					reject(new Error(`百度接口错误，status=${res.data.status}`));
				}
			},
			fail: reject,
		});
	});
};
