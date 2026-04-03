// store/modules/app.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { imgUrl } from '@/config';


interface UserInfo {
	id ?: string;
	mobile ?: string;
	// 其他用户信息字段
}
interface UserEtcInfo {
	ticketId ?: string;
	mobile ?: string;
	// 其他用户信息字段
}

export const useAppStore = defineStore('app', () => {
	const memberId = ref<string | null>(null);
	const userInfo = ref<UserInfo | null>(null);
	const etcUserInfo = ref<UserEtcInfo | null>(null);

	const updateUserInfo = (info : UserInfo) => {
		userInfo.value = info;
		if (info.id) {
			memberId.value = info.id;
		}
		uni.setStorageSync('userInfo', info);
	};
	
	const updateEtcUserInfo = (info : UserEtcInfo) => {
		etcUserInfo.value = info;
		uni.setStorageSync('etcUser', info)
	}

	const clearUserInfo = () => {
		userInfo.value = null;
		memberId.value = null;
		uni.removeStorageSync('userInfo');
		uni.removeStorageSync('wxOauthDate');
		uni.removeStorageSync('Token');
		uni.removeStorageSync('carNumber')
		uni.removeStorageSync('vclType')
		uni.removeStorageSync('mycar')
		uni.removeStorageSync('carName')
		uni.removeStorageSync('userIdentity')
		uni.removeStorageSync('token')
		uni.removeStorageSync('locationId')
		uni.removeStorageSync('vipCardType')
		// uni.removeStorageSync('themlist')
		// uni.removeStorageSync('address')
	};

	const initUserInfo = () => {
		
		const storedInfo = uni.getStorageSync('userInfo');
		if (storedInfo) {
			userInfo.value = storedInfo;
			if (storedInfo.id) {
				memberId.value = storedInfo.id;
			}
		}
	};

	const checkLogin = () => {
		if(uni.getStorageSync('userInfo') || userInfo.value) {
			return true;
		}
		return false;
	}
	
	//	跳转第三方链接或小程序通用配置
	const MiniProgramConfig = ref({
		"wxe442a27a2747b061":{
			address: '',
			appId: 'wxe442a27a2747b061',
			appSrcId: 'gh_95045762f7a8',
			enterprise: '陕西高速公路电子收费有限公司',
			name: 'ETC申请',
			state: '01',
			status: '01',
		},
		'wxf52b8d2bb696e5f4':{
			address: '',
			appId: 'wxf52b8d2bb696e5f4',
			appSrcId: 'gh_dd4bedd2010f',
			enterprise: '行云数聚（北京）科技有限公司',
			name: '通行费补缴',
			state: '01',
			status: '01',
		},
		'wxa153df20e8888c68':{
			address: '/pages/appointment/view/index/index',
			appId: 'wxa153df20e8888c68',
			appSrcId: 'gh_079c162b7d29',
			enterprise: '陕西蓝德智慧交通科技有限公司',
			name: '绿通预约',
			state: '01',
			status: '01',
		},
		'wx00a6d2bbd6cf9160':{
			address: '',
			appId: 'wx00a6d2bbd6cf9160',
			appSrcId: 'gh_355fb14fb592',
			enterprise: '中国交通通信信息中心',
			name: '运政办理',
			state: '01',
			status: '01',
		},
		'wx19e20461b663b96c':{
			address: '',
			appId: 'wx19e20461b663b96c',
			appSrcId: 'gh_b0b2faa40ad6',
			enterprise: '的盟天下(延安)科技有限公司',
			name: '的盟95128',
			state: '01',
			status: '01',
		},
		'wxdc19ca1e27782277':{
			address: '',
			appId: 'wxdc19ca1e27782277',
			appSrcId: 'gh_36e8c6390f17',
			enterprise: '陕西交控服务管理集团有限公司渭南西服务区分公司 ',
			name: '长安驿有购线上商城',
			state: '01',
			status: '01',
		},
		'sx12122':{
			address: '',
			appId: 'https://yjglfp.sx12122.cn/',
			appSrcId: '',
			enterprise: '',
			name: '',
			state: '',
			status: '',
		},
		'ruitong369':{
			address: '',
			appId: 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/MainTest.html?wxH5=1',
			appSrcId: '',
			enterprise: '',
			name: '',
			state: '',
			status: '',
		}
	});
	
	// 获取省市区json文件
	const cascaderDatas = ref([])
	const fetchOnlineData = () => {
	      const url = imgUrl+'cascaderDatas.json';
	      uni.request({
	        url: url,
	        method: 'GET',
	        success: (res) => {
	          if (res.statusCode === 200) {
	            cascaderDatas.value = res.data
	            console.log('数据加载成功',res);
	          } else {
				  console.log('-------',res);
	            // this.errorMsg = '数据加载失败：状态码' + res.statusCode;
	            // console.error(this.errorMsg);
	          }
	        },
	        fail: (err) => {
	          // this.errorMsg = '网络请求失败';
	          console.error(err);
	          uni.showToast({ title: '加载失败', icon: 'none' });
	        },
	        complete: () => {
	          // this.loading = false;
	        }
	      });
	    }
	return {
		memberId,
		userInfo,
		updateUserInfo,
		clearUserInfo,
		initUserInfo,
		checkLogin,
		updateEtcUserInfo,
		MiniProgramConfig,
		fetchOnlineData,
		cascaderDatas
	};
});

export type AppStore = ReturnType<typeof useAppStore>;