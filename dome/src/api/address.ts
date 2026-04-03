// sn 校验文件
const AK = 'D5RzSIhdhH31lFaDl6SIQC0UtapIAdUT'
export function geoconvLab(coords,model=1) {
  return new Promise((resolve, reject) => {
	  /* 
		转换方式可选值model：
		1：amap/tencent to bd09ll
		2：gps to bd09ll
		3：bd09ll to bd09mc
		4：bd09mc to bd09ll
		5：bd09ll to amap/tencent
		6：bd09mc to amap/tencent
	  */
    uni.request({
      url: `https://api.map.baidu.com/geoconv/v2/?coords=${coords}&model=${model}&ak=${AK}`,
      method: 'GET',
      success: res => {
        console.log('res', res)
        resolve(res.data);
      },
      fail: err => {
        reject(err.errMsg);
      }
    });
  });
}

// https://api.map.baidu.com/reverse_geocoding/v3/?ak=您的ak&extensions_poi=1&entire_poi=1&sort_strategy=distance&output=json&coordtype=bd09ll&location=39.951335108535, 116.51484487905

export function reverseGeocoding(location) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `https://api.map.baidu.com/reverse_geocoding/v3/?location=${location}&model=1&ak=${AK}&extensions_poi=1&entire_poi=1&sort_strategy=distance&output=json&coordtype=bd09ll`,
      method: 'GET',
      // header: {
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json'
      // },
      success: res => {
        console.log('res', res)
        resolve(res.data);
      },
      fail: err => {
        reject(err.errMsg);
      }
    });
  });
}