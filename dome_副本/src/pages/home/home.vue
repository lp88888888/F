<template>
	<view class="page-container" :data-theme="pageTheme">
		<template v-if="!oldpersondata">
			<IndexPage v-if="tabbarType == 'index' && redpagestatus == '0'" :scroll-top="scrollTop" ref="indexRef">
			</IndexPage>
			<redIndex v-if="tabbarType == 'index' && redpagestatus == '1'" :scroll-top="scrollTop" ref="indexRef">
			</redIndex>
			<ServicePage v-if="tabbarType == 'service'" ref="mineRef"></ServicePage>
			<PointsPage v-if="tabbarType == 'points'" ref="mineRef"></PointsPage>
			<MinePage v-if="tabbarType == 'mine'" ref="mineRef"></MinePage>
			<up-gap height="20"></up-gap>

			<view class="tabbars" :style="{ '--safebottom': safeAreaInsetsBottom }" v-if="redpagestatus == '0'">
				<view class="tabbars_4" :style="{background: themeStore.themeColors.$tabbarBg}">
					<view class="tabbar-item" @click="changeTab('index')">
						<image v-if="tabbarType == 'index'" class="tabbar_icon_image"
							:src="icoUrl+'tabbar/tabbar-home-active.png'" :lazy-load="true"></image>
						<image v-else class="tabbar_icon_image" src="@/static/tabbar/tabbar-home.png" :lazy-load="true">
						</image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'index' ? themeStore.themeColors.$primaryColor : '#909599' }">首页</text>
					</view>
					<view class="tabbar-item" @click="changeTab('service')">
						<image v-if="tabbarType == 'service'" class="tabbar_icon_image"
							:src="icoUrl+'tabbar/tabbar-service-active.png'" :lazy-load="true"></image>
						<image v-else class="tabbar_icon_image" src="@/static/tabbar/tabbar-service.png"
							:lazy-load="true">
						</image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'service' ? themeStore.themeColors.$primaryColor : '#909599' }">服务</text>
					</view>
					<view class="tabbar-item"></view>
					<view class="tabbar-item" @click="changeTab('points')">
						<image v-if="tabbarType == 'points'" class="tabbar_icon_image"
							:src="icoUrl+'tabbar/tabbar-points-active.png'" :lazy-load="true"></image>
						<image v-else class="tabbar_icon_image" src="@/static/tabbar/tabbar-points.png"
							:lazy-load="true">
						</image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'points' ? themeStore.themeColors.$primaryColor : '#909599' }">积分商城</text>
					</view>
					<view class="tabbar-item" @click="changeTab('mine')">
						<image v-if="tabbarType == 'mine'" class="tabbar_icon_image"
							:src="icoUrl+'tabbar/tabbar-mine-active.png'" :lazy-load="true"></image>
						<image v-else class="tabbar_icon_image" src="@/static/tabbar/tabbar-mine.png" :lazy-load="true">
						</image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'mine' ? themeStore.themeColors.$primaryColor : '#909599' }">我的</text>
					</view>
				</view>
				<view class="tabbar_cen">
					<view class="tabbar_item_center" @click="changeTab('allAdd')">
						<image class="tabMintImg" :src="icoUrl+'tabbar/min-but.png'" :lazy-load="true"> </image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'allAdd' ? themeStore.themeColors.$primaryColor : '#909599' }">速小猴</text>
					</view>
				</view>
			</view>

			<view class="tabbars" :style="{ '--safebottom': safeAreaInsetsBottom }" v-if="redpagestatus == '1'">
				<view class="tabbars_4" :style="{background: 'linear-gradient( to bottom, #FEFEFE 0%, #FFFBFB 100%);'}">
					<view class="tabbar-item" @click="changeTab('index')">
						<image v-if="tabbarType == 'index'" class="tabbar_icon_image"
							:src="imgUrl+'redindex/tabbar-home-active.png'" :lazy-load="true"></image>
						<image v-else class="tabbar_icon_image" :src="imgUrl+'redindex/tabbar-home-active.png'"
							:lazy-load="true">
						</image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'index' ? '#FD3924' : '#909599' }">首页</text>
					</view>
					<view class="tabbar-item" @click="changeTab('service')">
						<image v-if="tabbarType == 'service'" class="tabbar_icon_image"
							:src="imgUrl+'redindex/tabbar-service-active.png'" :lazy-load="true"></image>
						<image v-else class="tabbar_icon_image" :src="imgUrl+'redindex/tabbar-service-active.png'"
							:lazy-load="true">
						</image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'service' ? '#FD3924' : '#909599' }">服务</text>
					</view>
					<view class="tabbar-item"></view>
					<view class="tabbar-item" @click="changeTab('points')">
						<image v-if="tabbarType == 'points'" class="tabbar_icon_image"
							:src="imgUrl+'redindex/tabbar-points-active.png'" :lazy-load="true"></image>
						<image v-else class="tabbar_icon_image" :src="imgUrl+'redindex/tabbar-points-active.png'"
							:lazy-load="true">
						</image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'points' ? '#FD3924' : '#909599' }">积分商城</text>
					</view>
					<view class="tabbar-item" @click="changeTab('mine')">
						<image v-if="tabbarType == 'mine'" class="tabbar_icon_image"
							:src="imgUrl+'redindex/tabbar-mine-active.png'" :lazy-load="true"></image>
						<image v-else class="tabbar_icon_image" :src="imgUrl+'redindex/tabbar-mine-active.png'"
							:lazy-load="true">
						</image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'mine' ? '#FD3924' : '#909599' }">我的</text>
					</view>
				</view>
				<view class="tabbar_cen">
					<view class="tabbar_item_center" @click="changeTab('allAdd')">
						<image class="tabMintImg" :src="imgUrl+'redindex/min-but.png'" :lazy-load="true"> </image>
						<text class="tabbar-item-text"
							:style="{ color: tabbarType == 'allAdd' ? themeStore.themeColors.$primaryColor : '#909599' }">速小猴</text>
					</view>
				</view>
			</view>
			<up-gap height="90"></up-gap>
		</template>

		<template v-else>
			<oldIndex></oldIndex>
			<view class="oldtabbar" :style="{ '--safebottom': safeAreaInsetsBottom }">
				<view class="oldtabbar_box" @click="changeTab('allAdd')">
					<image class="oldtabbar_img" :src="icoUrl + 'tabbar/min-but.png'" :lazy-load="true"> </image>
					<text class="oldtabbar_text">智能伴行</text>
				</view>
			</view>
		</template>

		<!-- 新人礼 -->
		<homePopup :show="xrlshow" :bg="userType == 1 ? `${imgUrl}static/home_xrl.png` : `${imgUrl}static/home_sjl.png`"
			:btnBg="imgUrl + 'static/home_sjl_btn.png'" width="540rpx" height="1000rpx" btnWidth="296rpx"
			btnHeight="88rpx" @confirm="receiveGiftFun" @close="receiveGiftFun">
		</homePopup>
		<!-- 新人礼 - 查看 -->
		<homePopup :show="xrlCardshow" :bg="imgUrl + 'static/home_sjl_view.png'"
			:btnBg="imgUrl + 'static/home_sjl_view_btn.png'" width="710rpx" height="1120rpx" btnWidth="384rpx"
			btnHeight="100rpx" @confirm="xrlCardshow = false" @close="xrlCardshow = false">
			<view class="content-card">
				<scroll-view scroll-y :style="{ height: scrollHeight }">
					<view v-for="(item, index) in couponList" class="coupon-bar flex ali-cen just-sb" :style="bgStyle">
						<view class="coupon-left">
							<!-- <text class="coupon-num">50</text>
				      <text class="coupon-unit">元</text> -->
							<text class="coupon-title u-line-1">{{ item.name }}</text>
						</view>
						<view @click="toNav('/pages_C/coupon/index')" class="coupon-right">立即查看</view>
					</view>
					<view class="coupon-bar flex ali-cen just-sb" :style="bgStyle">
						<view class="coupon-left">
							<text class="coupon-title">获得积分</text>
							<text class="coupon-num">{{ givePoints }}</text>
						</view>
						<view @click="toRec('/pages_A/pointslist/index')" class="coupon-right">立即查看</view>
					</view>
				</scroll-view>
				<view class="coupon-content">
					新人礼领取成功！{{ givePoints }}积分已存入您的积分账户可以前往积分商城兑换喜欢的礼品~加油券包可前往【我的】【我的卡券】中使用哦~
				</view>
			</view>
		</homePopup>
		<!-- 积分季 -->
		<homePopup v-model:show="jfjshow" :bg="`${imgUrl}static/home_jfj.png`"
			:btnBg="imgUrl + 'static/home_jfj_btn.png'" width="750rpx" height="1000rpx" btnWidth="372rpx"
			btnHeight="178rpx" @confirm="jfjshow = false" @close="jfjshow = false">
			<view class="content-card">
				<view class="jfj-content">
					<view class="jfj-title">绑车即可得<text class="fs-48">{{ jfjData.doublePointsRuleName }}</text>里程积分！
					</view>
					<scroll-view class="m-t-100" scroll-y :style="{ height: scrollHeight1 }">
						<view class="jfj-text">规则：</view>
						<view class="jfj-text"> 平台上线2个月内里程积分{{ jfjData.doublePointsRuleName }}发放，其余积分不变。 </view>
						<view class="jfj-text fs-20 col3 fw-500">
							活动时间{{ jfjData.activityStartTime }}-{{ jfjData.activityEndTime }} 可在“我的”积分明细中查看详细积分记录哦~
						</view>
					</scroll-view>
				</view>
			</view>
		</homePopup>
		<!-- <view class="home" :style="{ paddingBottom: safeAreaInsetsBottom + 'px' }">
			<view class="home-content">
				<IndexPage v-if="tabbarType == 'index'" />
				<ServicePage v-if="tabbarType == 'service'" />
			</view>
		</view> -->
	</view>
</template>
<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue';
	import { onLoad, onReady, onShow, onTabItemTap, onPageScroll, onHide, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
	// #ifdef APP-HARMONY
	import "@/uni_modules/harmony-permissions"
	// #endif
	const tabbarType = ref('');
	import homePopup from './components/homePopup.vue';
	import IndexPage from './index.vue';
	import MinePage from '@/pages/individual/individual.vue';
	import PointsPage from '@/pages/points/index.vue';
	import ServicePage from '@/pages/service/index.vue';
	import oldIndex from '@/pages_E/oldindex/index.vue';
	import redIndex from '@/pages_E/redindex/index.vue';
	import { toNav, toRec } from '@/utils/route';
	import { getByUserIdAndVehicleAll } from '@/api/user';
	import { checkGiftType, receiveGift, recordIntegral, getredindex, updateMigrationStatus } from '@/api/home';
	import { imgUrl } from '@/config';
	import { getThemeData } from '@/api/config';
	import { useAppStore } from '@/store/modules/app';
	// #ifndef MP-WEIXIN
	import { jpushService } from '@/utils/jpush';
	// #endif
	import { getMiniUserInfo } from '@/api/login';
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const scrollTop = ref(0);
	const phone = ref('');
	// 适老
	const oldpersondata = computed(() => {
		console.log('有没有适老版的缓存', uni.getStorageSync('oldperson'));
		return uni.getStorageSync('oldperson');
	});

	// 新人礼
	const xrlshow = ref(false);
	const xrlCardshow = ref(false);
	const jfjshow = ref(false);
	const appStore = useAppStore();
	const bgStyle = computed(() => ({
		width: '490rpx',
		height: '160rpx',
		margin: '0 auto',
		padding: '0 42rpx',
		boxSizing: 'border-box',
		backgroundImage: `url(${imgUrl + 'static/home_view_carrd_bg.png'})`,
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	}));
	const couponList = ref([]);
	const scrollHeight = ref('340rpx');
	const scrollHeight1 = ref('200rpx');
	const safeAreaInsetsBottom = computed(() => {
		return uni.getSystemInfoSync().safeAreaInsets.bottom;
	});

	watch(
		() => themeStore.imgUrl,
		(newVal) => {
			icoUrl.value = newVal;
		}
	);
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop;
		// console.log('距离', e.scrollTop)
	});
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB', // 请替换为你的腾讯地图key
	});
	const getUserAddress = () => {
		qqmapsdk.reverseGeocoder({
			success: (res) => {
				const adInfo = res.result.ad_info;
				let address = {
					lat: res.result.location.lat,
					lng: res.result.location.lng,
					city: res.result.address_component.city,
					cityCode: adInfo.adcode.substr(0, 4) + '00',
					province: res.result.address_component.province,
					provinceCode: adInfo.adcode.substr(0, 2) + '0000',
					district: res.result.address_component.district,
					districtCode: adInfo.adcode,
					standardAddress: res.result.formatted_addresses.standard_address,
				};
				console.log(address, 888888888)
				uni.setStorageSync('address', address);
			},
			fail: (err) => {
				let address = {
					lat: 34.2778,
					lng: 108.953098,
					city: '西安市',
					cityCode: '610100',
					province: '陕西省',
					provinceCode: '610000',
					district: '雁塔区',
					districtCode: '610104',
					standardAddress: '西安市',
				};
				uni.setStorageSync('address', address);
			},
		});
	};
	const isExternal = ref(false);
	const updateMigrationStatusFun = async (val : string | number, isSecond : boolean) => {
		const params = {
			phone: val
		};
		console.log('第一次小程序跳转过来', params, 999999999999)
		if (isSecond) {
			params.to = 'second';
		
		}
		console.log('第二次小程序跳转过来', params, 888888888888)
		const res : any = await updateMigrationStatus(params);
	}
	onLoad((options) => {
		console.log(9999999999999999,options.phone,'测试11')
		// #ifndef MP-WEIXIN
		jpushService.completeInit((res) => {
			console.log('JPush Event:', res.eventName, res.eventData);
		});
		// #endif
		if (options.phone) {
			console.log(99999999999,options.phone,'测试22')
			phone.value = options.phone
			updateMigrationStatusFun(options.phone)
		}
		// 清空上次未登录401缓存
		uni.removeStorageSync('oldShowModel');

		uni.$on('updatevipcardtype', (data) => {
			console.log('监听到事件来自 update ，携带参数 msg 为：', data);
			themeInfoList.value = uni.getStorageSync('themlist')[data.index];
		});
		getUserAddress()
		// #ifndef MP-WEIXIN
		if(uni.getStorageSync('userInfo')?.id){
			jpushService.setAlias(uni.getStorageSync('userInfo')?.id*1,uni.getStorageSync('userInfo')?.id)
		}
		// #endif
	
		const link = options?.link || '';
		if (isExternalLinkSimple(link) || phone.value) {
			isExternal.value = true;
		} else {
			isExternal.value = false;
		}

		if (options.type) {
			tabbarType.value = options.type;
		} else {
			tabbarType.value = 'index';
		}
		
		
	});
	const isExternalLinkSimple = (url : string) : boolean => {
		if (!url) return false;
		const s = String(url).trim().toLowerCase();
		return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//');
	};
	const isLogin = computed(() => {
		return appStore.checkLogin();
	});
	// 获取组件颜色
	const componentColor = themeStore.themeColors;
	const changeTab = (type) => {
		if (type == 'allAdd') {
			if (isLogin.value) {
				toNav('/pages_E/digitalHuman/index');
			} else {
				uni.showToast({ title: '登录后使用，请先登录', icon: 'none' });
			}
		} else {
			tabbarType.value = type;
		}
		getpagecolorval()
	};

	// 获取红色状态  1: 红色首页  0：正常页面
	const redpagestatus = ref('0')
	const getpagecolorval = async () => {
		try {
			const res = await getredindex()
			redpagestatus.value = res.data
			console.log("查询的红色状态", res)
		} catch (err) {
			redpagestatus.value = "0"
		}
	}

	onShow(() => {
		console.log(999999999999999999999,phone.value,'测试33')
		// getcarData();
		getThemeinfo();
		checkGiftTypeFun();
		recordIntegralFun();
		if (uni.getStorageSync('userInfo')?.id) {
			getUserInfo();
		}
		getpagecolorval()
		if (phone.value) {
			console.log(999999999999999999999,phone.value,'测试44')
			if (uni.getStorageSync('userInfo')) {
				if (uni.getStorageSync('userInfo').migrationStatus != 1) {
					updateMigrationStatusFun(phone.value, true)
				}
			}
		}
		
		appStore.fetchOnlineData()
	});
	onHide(() => {
		uni.$off('updatevipcardtype');
	});
	const carNumber = ref('');
	const getcarData = async () => {
		try {
			const userId = uni.getStorageSync('userInfo')?.id;
			if (!userId) return;
			const params = {
				userId: userId,
			};
			const res : any = await getByUserIdAndVehicleAll(params);
			carNumber.value = res.data[0] ? res.data[0].licensePlate : '';
			uni.setStorageSync('carNumber', carNumber.value);
		} catch (e) {
			carNumber.value = '';
		}
	};
	const givePoints = ref(0);
	const userType = ref('');
	const checkGiftTypeFun = async () => {
		console.log('触发了新人礼', uni.getStorageSync('userInfo'));
		const userInfo = uni.getStorageSync('userInfo').id;
		if (!userInfo) return;
		const params = {
			sourcePlatform: 1,
		};
		const res : any = await checkGiftType(isExternal.value ? params : {});
		console.log('新人礼数据', res);
		if (res.data.userType == 1 || res.data.userType == 2) {
			xrlshow.value = true;
		}
		userType.value = res.data.userType;
	};

	const receiveGiftFun = async () => {
		const userInfo = uni.getStorageSync('userInfo').id;
		if (!userInfo) return;
		xrlshow.value = false;
		const res : any = await receiveGift({ giftType: Number(userType.value) });
		if (res.code == 200) {
			xrlCardshow.value = true;
			couponList.value = res.data.giftCouponList;
			givePoints.value = res.data.givePoints;
		}
	};
	const jfjData = ref({});
	// 积分
	const recordIntegralFun = async () => {
		const userInfo = uni.getStorageSync('userInfo').id;
		if (!userInfo) return;
		const res : any = await recordIntegral();
		if (res.code == 200 && res.data) {
			jfjshow.value = true;
			jfjData.value = res.data;
		}
	};
	const getUserInfo = async () => {
		const res = await getMiniUserInfo();
		console.log('用户信息', res);
		appStore.updateUserInfo(res.clazz);
	};
	// 吉祥物数据
	const themeInfoList = ref({
		cardImg: 'https://services.sxjk-cloud.com:32570/test/38bf9498-37c4-4d63-8da0-03b0edcbd78b.png',
		description: '小主～快选我做你的专属吉祥物呀～',
		id: '2009594965780353026',
		isDefault: 1,
		mascotBtn: 'https://services.sxjk-cloud.com:32570/test/44018a99-5522-4c55-95ca-6e8d210685ea.png',
		mascotGit: 'https://services.sxjk-cloud.com:32570/test/7d9ef8be-34ad-4c73-aa38-16cfee873aa7.gif',
		mascotIcon: 'https://services.sxjk-cloud.com:32570/test/9cb18e21-cbc3-4f56-b551-23bd52c75a9d.png',
		name: '金丝猴·金灵捷卡',
	});
	const vipCardType = ref(0);
	// 查询主题数据
	const getThemeinfo = async () => {
		try {
			const res = await getThemeData();
			console.log('我的页面查询的主题', res);
			const list = res.data.list;
			if (list.length > 0) {
				uni.setStorageSync('themlist', list);
				if (typeof uni.getStorageSync('vipCardType') === 'number') {
					vipCardType.value = uni.getStorageSync('vipCardType');
				} else {
					vipCardType.value = list.findIndex((e) => e.isDefault === 1);
					uni.setStorageSync('vipCardType', vipCardType.value);
				}
				themeInfoList.value = list[vipCardType.value];
			}
		} catch (err) {
			console.log('报错了', err);
		}
	};

	onShareAppMessage(() => {
		return {
			title: '让出行迈入AI新纪元',
			path: '/pages/home/home', // 所有页面都分享首页
			imageUrl: 'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/fx2-logo.png',
			mpWeixin: {
				appId: 'wxe855aef6746428d4',
				path: '/pages/home/home',
			}
		}
	});
	onShareTimeline(() => {
		return {
			title: '让出行迈入AI新纪元',
			imageUrl: 'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/fx2-logo.png',
			path: '/pages/home/home'
		}
	});
</script>

<style scoped lang="scss">
	.page-container {
		width: 100%;
		min-height: 100vh;
		background: #f5f5f4;
		background: transparent;
	}

	.tabbars {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		width: 750rpx;
		height: calc(170rpx + var(--safebottom) * 1px);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;

		.tabbars_4 {
			width: 750rpx;
			height: calc(98rpx + var(--safebottom) * 1px);
			padding-left: 20rpx;
			padding-right: 20rpx;
			padding-bottom: calc(var(--safebottom) * 1px);
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			background: linear-gradient(180deg, #fefefe 0%, #ebf8ee 100%);
			box-shadow: 0rpx -2rpx 9rpx 0rpx rgba(211, 231, 209, 0.43);
			border-top-right-radius: 32rpx;
			border-top-left-radius: 32rpx;
			box-sizing: border-box;

			.tabbar-item {
				flex: 1;
				height: 98rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.tabbar_icon_image {
					width: 48rpx;
					height: 48rpx;
					margin-bottom: 8rpx;
				}
			}
		}

		.tabbar_cen {
			width: 136rpx;
			height: calc(170rpx + var(--safebottom) * 1px);
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);

			.tabbar_item_center {
				width: 136rpx;
				height: 170rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding-bottom: calc(5rpx + var(--safebottom) * 1px);

				.tabMintImg {
					width: 136rpx;
					height: 136rpx;
				}
			}
		}

		.tabbar-item-text {
			font-size: 26rpx;
		}
	}

	.oldtabbar {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		width: 750rpx;
		height: calc(95rpx + var(--safebottom) * 1px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: calc(var(--safebottom) * 1px);
		box-sizing: border-box;
		border-radius: 32rpx 32rpx 0rpx 0rpx;
		background-color: var(--tabbar-bg);

		.oldtabbar_box {
			display: flex;
			align-items: center;

			.oldtabbar_img {
				width: 95rpx;
				height: 95rpx;
				margin-right: 12rpx;
			}

			.oldtabbar_text {
				font-weight: 400;
				font-size: 32rpx;
				color: #333333;
			}
		}
	}

	.iconTab {
		// margin-top: -40rpx;
		margin-top: 4rpx;
		width: 120rpx;
		// height: 120rpx;
		// background: #fff;
		// border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;

		// justify-content: center;
		.iconTab-img {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			// background:linear-gradient(to bottom, #5AD6D6, #069FA4) ;
			image {
				width: 90rpx;
				height: 90rpx;
			}
		}

		.iconTab-text {
			font-size: 12px;
			color: #999999;
		}
	}

	.tabbar_icon_image {
		width: 48rpx;
		height: 48rpx;
	}

	.tabbar {
		width: 90%;
		height: 80rpx;
		background: salmon;
		margin: 0 auto;
		border-radius: 40rpx;
	}

	.iconTab {
		width: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translateY(-20rpx);

		.iconTab-img {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: linear-gradient(to bottom, #5ad6d6, #069fa4);

			image {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.iconTab-text {
			font-size: 12px;
			color: #999999;
			margin-top: 4rpx;
		}
	}

	.content-card {
		position: absolute;
		top: 380rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 1;
	}

	.coupon-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx !important;
	}

	.coupon-left {
		color: #80a653;
		font-size: 32rpx;
		display: flex;
		align-items: baseline;
	}

	.coupon-num {
		font-weight: 700;
		font-size: 40rpx;
		margin-right: 6rpx;
	}

	.coupon-unit {
		font-weight: 600;
		margin-right: 6rpx;
	}

	.coupon-title {
		font-weight: 600;
	}

	.u-line-1 {
		width: 272rpx;
	}

	.coupon-right {
		width: 70rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: #fff;
		text-align: right;
	}

	.coupon-content {
		width: 466rpx;
		margin: 38rpx auto 0;
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		line-height: 36rpx;
	}

	.jfj-content {
		width: 466rpx;
		margin: 38rpx auto 0;
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		line-height: 36rpx;
	}

	.jfj-title {
		font-weight: 700;
		font-size: 32rpx;
		color: #f72c25;
		text-align: right;
	}

	.jfj-text {
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
		padding: 0 20rpx;
	}

	.m-t-100 {
		margin-top: 100rpx;
	}
</style>