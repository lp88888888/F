
export function getTadayApi(params) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://ng6apw7tu7.yun.qweatherapi.com/v7/weather/now', 
            data: params,
            method: 'GET',
            success: res => {
                resolve(res.data); 
            },
            fail: err => {
                reject(err.errMsg); 
            }
        });
    });
}
// 今天空气质量
export function getairNowapi(params) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://ng6apw7tu7.yun.qweatherapi.com/v7/air/now',
            data: params,
            method: 'GET',
            success: res => {
                resolve(res.data);
            },
            fail: err => {
                reject(err.errMsg);
            }
        });
    });
}
// 未来24小时
export function getWeather24api(params) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://ng6apw7tu7.yun.qweatherapi.com/v7/weather/24h',
            data: params,
            method: 'GET',
            success: res => {
                resolve(res.data);
            },
            fail: err => {
                reject(err.errMsg);
            }
        });
    });
}
// 未来七天的
export function getWeather7dapi(params) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://ng6apw7tu7.yun.qweatherapi.com/v7/weather/7d',
            data: params,
            method: 'GET',
            success: res => {
                resolve(res.data);
            },
            fail: err => {
                reject(err.errMsg);
            }
        });
    });
}
// 生活指数
export function getIndices1dapi(params) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://ng6apw7tu7.yun.qweatherapi.com/v7/indices/1d',
            data: params,
            method: 'GET',
            success: res => {
                resolve(res.data);
            },
            fail: err => {
                reject(err.errMsg);
            }
        });
    });
}

