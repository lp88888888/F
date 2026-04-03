let baseUrl : string;
let imgUrl:string 
let aiUrl:string 
let envVersionWeixin:string 
// https://super-apaas.baidu.com

// http://219.144.200.109:9031
// 西公院测试环境服务访问地址：https://tydwfwpt.shanyitong.com:31082
// 西公院预发布环境服务访问地址：https://services.sxjk-cloud.com:31085
// envVersionWeixin 小程序码 正式版为 "release"，体验版为 "trial"，开发版为 "develop"
if (process.env.NODE_ENV === 'production') {
	// 生产环境
	// baseUrl = 'https://app.aishanggaosu.com:31084/api';
	// aiUrl = 'https://app.aishanggaosu.com:31084/sse'
	// envVersionWeixin = 'release'
	
	baseUrl = 'https://tydwfwpt.shanyitong.com:31082/api';
	aiUrl = 'https://super-apaas.baidu.com'
	envVersionWeixin = 'trial'
	
} else if (process.env.NODE_ENV === 'development') {
	// 预生产
	// baseUrl = 'https://app.aishanggaosu.com:31084/api';
	// aiUrl = 'https://app.aishanggaosu.com:31084/sse'
	// envVersionWeixin = 'release'
	
	// 测试
	baseUrl = 'https://tydwfwpt.shanyitong.com:31082/api';
	aiUrl = 'https://super-apaas.baidu.com';
	envVersionWeixin = 'trial'
} else {
	// 其他环境
	baseUrl = 'http://192.168.3.8:8088/api';
}
// 图片地址
 imgUrl='https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/'
// 应用全局配置
export { baseUrl, imgUrl, aiUrl ,envVersionWeixin};