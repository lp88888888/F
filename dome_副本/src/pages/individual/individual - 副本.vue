<template>
	<view class="my-page" :data-theme="pageTheme">
		<image :src="icoUrl+'fixed-img.png'" class="fixed-img" mode=""></image>
		<!-- 头部 -->
		<view class="header">
			<view class="user-info" v-if="userInfo.nickName"  @click="toNav('/pages_A/personalinformation/personal')">
				<view>
					<image :src="userInfo.headImageUrl" class="avatar" v-if="userInfo.headImageUrl" />
					<image :src="imgUrl+'avatar-01.png'" class="avatar" v-else />
				</view>
				<view class="text">
					<view class="name">{{ userInfo.nickName?userInfo.nickName:"账号登录" }}</view>
					<view class="plate">
						<view class="plate-ke">
							客
						</view> {{ carNumber || '未绑定车辆' }}
					</view>
				</view>
			</view>
			<view class="user-info" v-else @click="toNav('/pages_A/login/login')">
				<view >
					<image :src="userInfo.headImageUrl" class="avatar" v-if="userInfo.headImageUrl" />
					<image :src="imgUrl+'avatar-01.png'" class="avatar" v-else />
				</view>
				<view class="text">
					<view class="name">{{ userInfo.nickName?userInfo.nickName:"账号登录" }}</view>
					<view class="plate">
						<view class="plate-ke">
							客
						</view> {{ carNumber || '未绑定车辆' }}
					</view>
				</view>
			</view>
			<view class="right-icons" v-if="userInfo.nickName">
				<image :src="imgUrl+'my-map-icon01.png'" @click="toNav('/pages_A/address/index')"
					class="my-top-left" mode=""></image>
				<image :src="imgUrl+'my-shezhi01.png'" @click="toNav('/pages_A/setting/setting')"
					class="my-top-left" mode=""></image>
			</view>
		</view>

		<!-- 统计卡片 -->
		<!-- <view class="stats" v-if="userInfo.nickName">
			<view style="display: flex;justify-content: space-between;align-items: center;padding: 0 100rpx;">
				<view class="stat-item">
					<text class="num">{{ stats.browse }}</text>
					<text class="label">浏览历史</text>
				</view>
				<view class="stat-item" @click="toNav('/pages_A/pointslist/index')">
					<text class="num">{{ userInfo.userPoints }}</text>
					<text class="label">可用积分</text>
				</view>
				<view class="stat-item" @click="toNav('/pages_A/coupon/index')">
					<text class="num">{{userInfo.couponQuantity}} <text style="font-size: 24rpx;"> 张</text></text>
					<text class="label">优惠券</text>
				</view>
			</view>
		</view> -->
		<!-- 会员等级 -->
		<view class="membership" :style="bgStyle" v-if="userInfo.id">
			<view>
				<view class="member-content" @click="toNav('/pages_A/vip/index')">
					<view class="level">
						<view class="title">{{memberInfo.levelName?memberInfo.levelName:''}}</view>
						<view class="info">{{memberInfo.levelType==1?'个人':'企业'}}</view>
					</view>
					<view class="progress">
						<text class="current">{{ memberInfo.levelValue }}/{{memberInfo.maxPoint}}<text class="info" style="margin-left: 10rpx;">{{memberInfo.levelCode}}</text></text>
					</view>
					<view class="btn" @click="toNav('/pages_A/benefit/index')">
						<view style="width: 60%;"><up-line-progress :showText="false" :percentage="member.levelValue"
								height="4" activeColor="#F5F9FF" inactiveColor="#BAC8DF"/>
						</view>查看会员权益
					</view>
				</view>
			</view>
		</view>

		<!-- 分销员信息 -->
		<!-- 	<view class="sales-info" :style="bgStyle2">
			<view>
				<view class="sales-header">
					<text class="sales-level">Lv.2分销员</text>
					
				</view>
				<view class="sales-data">
					<view class="data-item">
						<text class="value">¥{{ sales.withdraw }}</text>
						<text class="label">可提现(元)</text>
					</view>
					<view class="data-item">
						<text class="value">¥{{ sales.monthly }}</text>
						<text class="label">本月收益(元)</text>
					</view>
					<view class="data-item">
						<text class="value">{{ sales.promotion }}</text>
						<text class="label">月有效推广</text>
					</view>
				</view>
			</view>
		</view> -->

		<!-- 我的订单 -->
		<view class="orders">
			<view>
				<view class="order-title">
					<text>我的订单</text>
					<text class="all" @click="toNav('/pages_A/order/myorder')">全部</text>
				</view>
				<view class="order-tabs">
					<view @click="goOrder('pending')" class="tag-box">
						<image :src="icoUrl+'order-1-icon.png'" class="order-icon" mode=""></image>
						待支付
					</view>
					<view @click="goOrder('using')" class="tag-box">
						<image :src="icoUrl+'order-2-icon.png'" class="order-icon" mode=""></image>待使用
					</view>
					<view @click="goOrder('using')" class="tag-box">
						<image :src="icoUrl+'order-3-icon.png'" class="order-icon" mode=""></image>待收货
					</view>
					<view @click="toNav('/pages_D/snapShare/index')" class="tag-box">
						<image :src="icoUrl+'order-4-icon.png'" class="order-icon" mode=""></image>待评价
					</view>
					<view @click="isDistributorFun" class="tag-box">
						<image :src="icoUrl+'order-5-icon.png'" class="order-icon" mode=""></image>退款/售后
					</view>
				</view>
			</view>
		</view>

		<!-- 车辆管理 -->
		<view class="vehicle-manage">
			<view>
				<view class="title">车辆管理</view>
				<view class="vehicle-box flex just-sb">
					<view class="vehicle-item" :style="bgStyle3" @click="toNav('/pages_A/car/myCar')">
						<text class="vehicle-title cgr">个人车辆</text>
						<view class="flex ali-cen">
							<text class="vehicle-info">{{carNumber?carNumber:'请绑定车辆'}}</text>
							<image :src="`${imgUrl}volumePricing/back.png`" class="back-icon" mode=""></image>
						</view>
					</view>
					<view class="vehicle-item" :style="bgStyle4" @click="toEnterprise">
						<text class="vehicle-title cqy">企业车辆</text>
						<view class="flex ali-cen">
							<text class="vehicle-info">加入企业</text>
							<image :src="`${imgUrl}volumePricing/back.png`" class="back-icon" mode=""></image>
						</view>
					</view>
				</view>
<!-- 				<view class="item" @click="toNav('/pages_A/car/myCar')">
					<view style="display: flex;align-items: center;">
						<image :src="imgUrl+'static/car-1icon1.png'" class="order-icon" mode=""></image>
						<text class="text">个人车辆</text>

					</view>

					<text class="plate-text">{{carNumberr}}</text>
					<u-icon name="arrow-right" size="18" color="#ccc" />
				</view>
				<view class="item" @click="goEnterpriseVehicle">
					<view style="display: flex;align-items: center;">
						<image :src="imgUrl+'static/car-2icon2.png'" class="order-icon" mode=""></image>
						<text class="text">企业车辆</text>
					</view>

					<u-icon name="arrow-right" size="18" color="#ccc" />
				</view> -->
			</view>
		</view>

		<!-- 广告横幅 -->
		<view class="banner" v-if="bannerInfo.imageUrl" @click="toNavEX()">
			<image :src="bannerInfo.imageUrl" mode="aspectFill" class="banner-img" />
		</view>
		
		<view class="item-ex flex just-sb ali-cen" v-if="applyStatus == 1" @click="toNav('/pages_E/experience/suggest')">
			<view style="display: flex;align-items: center;">
				<image :src="imgUrl+'experience/ex_icon.png'" class="ex-icon" mode=""></image>
				<text class="text">体验官的建议</text>

			</view>
			<u-icon name="arrow-right" size="18" color="#ccc" />
		</view>

		<!-- 底部导航 -->
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {
		getMiniUserInfo
	} from '@/api/login';
	import { toast } from "@/utils/common";
	import {
		onLoad,onShow
	} from '@dcloudio/uni-app'
	import {
			details
		} from '@/api/member';
	import {
		toNav,
		toBack
	} from '@/utils/route';
	// 用户信息
	import {
		useAppStore
	} from '@/store/modules/app';
	import {bannerList, experienceInfo} from '@/api/home';
	import {enterpriseUserIdentity} from '@/api/car';
	import { isDistributor} from '@/api/distribution';
		import {distributorDetail } from '@/api/distribution';
	// 主题
	import { useTheme } from '@/composables/useTheme';
	import {imgUrl} from '@/config'; 
	const { themeStore, pageTheme } = useTheme();
	// const userInfo = ref(uni.getStorageSync('userInfo') || {});
	const userInfo = computed(()=>{
		return appStore.userInfo  || uni.getStorageSync('userInfo') || {}
	})
	const userInfonew= ref(uni.getStorageSync('userInfo').id);
    const icoUrl = ref(themeStore.imgUrl);
	const appStore = useAppStore();
	// const isLogin = ref(appStore.checkLogin());
	const isLogin = computed(()=>{
		return appStore.checkLogin()
	})
	const carNumber = ref(uni.getStorageSync('carNumber'))
	const memberInfo=ref('')
	// watch(
	//   [isLogin, () => themeStore.imgUrl],
	//   ([newLogin, newImgUrl], [oldLogin, oldImgUrl]) => {
	//     // 处理登录状态变化
	//     if (newLogin !== oldLogin) {
	//       if (newLogin) {
	//         console.log('已登录');
	//         getUserInfo();
	//       } else {
	//         console.log('未登录');
	//       }
	//     }
	
	//     // 处理 imgUrl 变化
	//     if (newImgUrl !== oldImgUrl) {
	//       icoUrl.value = newImgUrl;
	//     }
	//   }
	// );
	const bannerInfo = ref({})
	const detailsFun = async () => {
		const res = await details();
		memberInfo.value=res.data
	 };
		 
	const getMenuData = async ()=>{
		const res = await bannerList(5);
		bannerInfo.value = res.rows[0];
	};
	watch(() => themeStore.imgUrl, (newVal) => {
		icoUrl.value = newVal;
	});
	// watch(userInfo, (val,value) => {
	// 	if(val != value){
	// 		getUserInfo()
	// 		detailsFun()
	// 		getMenuData()
	// 		getExperienceInfo()
	// 		console.log('vuex userInfo 变了', val)
	// 		console.log('vuex userInfo 变value了', value)
	// 	}
		
	// }, { deep: true })
	// 获取用户信息
	const getUserInfo = async () => {
		const res = await getMiniUserInfo();
		// userInfo.value = res.clazz
		// integralTotalNumber.value = Number(res.clazz.userPoints || 0) + Number(res.clazz.activityIntegral || 0)
		appStore.updateUserInfo(res.clazz);
	}
	const auditStatus = ref(false)
	const applyStatus = ref('')
	
	// 获取报名详情（编辑态用）
	const getExperienceInfo = async () => {
	  const res = await experienceInfo()
	  if (res.code === 200) {
		  auditStatus.value = res?.data ? true : false
		  applyStatus.value = res?.data?.auditStatus
		  console.log('++++', auditStatus.value);
	  }
	}
	const userIdentity = ref({}) // 企业身份 0-无 1-普通成员，2-企业管理员
	// 获取当前用户企业身份
	const getEnterpriseUserIdentity = async () => {
	  const res = await enterpriseUserIdentity()
	  if (res.code === 200) {
		  userIdentity.value = res.data ? res.data[0] : null
		  uni.setStorageSync('userIdentity', res.data)
	  }
	}
	const isEmptyObject= (obj) => {
	  // 第一步：先校验类型，排除 null、数组、非对象类型
	  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
	    return false;
	  }
	  // 第二步：判断属性数组长度是否为 0
	  return Object.keys(obj).length === 0;
	}

	const isDistributorFun = async () => {
		  const res = await distributorDetail()
		  if((res.data && res.data.status=='NORMAL')){
			  uni.navigateTo({
			  	url:'/pages_A/mystore/index'
			  })
		  }else if((res.data && res.data.status=='PENDING_AUDIT') || (res.data && res.data.status=='REJECTED') || (res.data && res.data.status=='FROZEN')){
			 uni.navigateTo({
			 	url:'/pages_A/partner/index?type='+1
			 }) 
		  }else{
			 uni.navigateTo({
			 	url:'/pages_A/partner/index'
			 })  
		  }
	}
	const toEnterprise = () => {
		if (!userIdentity.value) {
			toNav('/pages_C/enterprise/index')
		} else if (userIdentity.value.identityType == 1) {
			toNav('/pages_C/enterprise/userReview')
		} else if (userIdentity.value.identityType == 2) {
			toNav('/pages_C/enterprise/myenteprise')
		}
		
	}
	onMounted(() => {
		if(userInfo.value.id){
			detailsFun()
			getMenuData()
			getExperienceInfo()
			getEnterpriseUserIdentity()
		}
		// isLogin.value = appStore.checkLogin();
		
	})
	onShow(() => {
		// isLogin.value = appStore.checkLogin();
		carNumber.value = uni.getStorageSync('carNumber')
		if (isLogin.value) {
			getUserInfo()
			detailsFun()
			getMenuData()
			getExperienceInfo()
			getEnterpriseUserIdentity()
		}
		
	});
	// 统计数据
	const stats = {
		browse: 32,
		points: 620,
		vouchers: 26
	}

	// 会员信息
	const member = {
		progress: 1356,
		percent: (1356 / 3000) * 100
	}

	// 分销员数据
	const sales = {
		withdraw: 128.42,
		monthly: 32.79,
		promotion: 54
	}

	// 底部导航
	const tabList = [{
			icon: 'home',
			text: '首页',
			page: '/pages/index/index'
		},
		{
			icon: 'folder',
			text: '服务',
			page: '/pages/service/service'
		},
		{
			icon: 'lightning',
			text: '一键救援',
			page: '/pages/rescue/rescue'
		},
		{
			icon: 'gift',
			text: '积分商城',
			page: '/pages/mall/mall'
		},
		{
			icon: 'person',
			text: '我的',
			page: '/pages/my/my'
		}
	]
	const backgroundImage = ref(imgUrl + 'bg_hy.png')
	const bgStyle = computed(() => {
		if (!backgroundImage.value) return {}
		return {
			backgroundImage: `url(${backgroundImage.value})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat'
		}
	})
	const backgroundImage2 = ref(imgUrl + 'static/my-erweima.png')
	const backgroundImage3 = ref(imgUrl + 'volumePricing/gr-bg.png')
	const backgroundImage4 = ref(imgUrl + 'volumePricing/qy-bg.png')
	const bgStyle2 = computed(() => {
		if (!backgroundImage.value) return {}
		return {
			backgroundImage: `url(${backgroundImage2.value})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat'
		}
	})
	const bgStyle3 = computed(() => {
		if (!backgroundImage3.value) return {}
		return {
			backgroundImage: `url(${backgroundImage3.value})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat'
		}
	})
	const bgStyle4 = computed(() => {
		if (!backgroundImage4.value) return {}
		return {
			backgroundImage: `url(${backgroundImage4.value})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat'
		}
	})
	// 当前选中项
	const activeIndex = ref(4)

	// 跳转方法
	const goMemberRights = () => uni.navigateTo({
		url: '/pages/member-rights/member-rights'
	})
	const goAllOrders = () => uni.navigateTo({
		url: '/pages/orders/all-orders'
	})
	const goOrder = (status) => uni.navigateTo({
		url: `/pages/orders/order-list?status=${status}`
	})
	const goPersonalVehicle = () => uni.navigateTo({
		url: '/pages/vehicle/personal'
	})
	const goEnterpriseVehicle = () => uni.navigateTo({
		url: '/pages/vehicle/enterprise'
	})
	const toNavEX = () => {
		if (auditStatus.value == false) {
			uni.navigateTo({
				url: '/pages_E/experience/index'
			})
		} else {
			uni.navigateTo({
				url: '/pages_E/experience/registration'
			})
		}
	}
</script>

<style scoped lang="scss">
	.page-container {
		background-color:  #F8F9FB;
	}
	.my-top-left {
		width: 50rpx;
		height: 50rpx;
		margin-left: 30rpx;
	}

	.my-page {
		background-color:  #F8F9FB;
		padding: 0 20rpx;
		font-size: 28rpx;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1px solid #eee;
			padding-top: 158rpx;
			position: relative;

			.user-info {
				display: flex;
				align-items: center;
				gap: 20rpx;

				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

				.text {
					.name {
						font-size: 32rpx;
						font-weight: bold;
						margin-bottom: 12rpx;
					}

					.plate {
						font-size: 24rpx;
						color: #666;
						margin-top: 4rpx;
						display: flex;
						align-items: center;

						.plate-ke {
							margin-right: 8rpx;
							padding: 8rpx;
							border: var(--secondary-color) 2rpx solid;
							color: var(--secondary-color);
							border-radius: 8rpx;
							line-height: 20rpx;

						}

					}
				}
			}

			.right-icons {
				display: flex;
				gap: 20rpx;
			}
		}

		.stats {
			.stat-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 0 20rpx;
				padding: 20rpx 0;
				text-align: center;

				.num {
					font-size: 36rpx;
					font-weight: bold;
				}

				.label {
					font-size: 24rpx;
					color: #000;
				}
			}
		}

		.membership {

			.member-content {

				padding: 30rpx;
				border-radius: 16rpx;

				.level {
					display: flex;
					align-items: center;
					padding-top: 15rpx;

					.title {
						font-size: 36rpx;
						font-weight: bold;
						color: #556A8B;
						margin-right: 12rpx;
					}

					.info {
						padding: 0 16rpx;
						border: #556A8B 2rpx solid;
						font-size: 24rpx;
						border-radius: 35rpx;
					}
				}

				.progress {
					margin: 20rpx 0;

					.current {
						font-size: 24rpx;
						color: #556A8B;
					}
				}

				.btn {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 24rpx;
					color: #9196A5;
				}
			}
		}

		.sales-info {
			margin: 30rpx 0;
			background: white;
			border-radius: 16rpx;

			.sales-header {
				position: relative;
				padding: 20rpx;
				border-radius: 16rpx;
				font-size: 36rpx;
				color: #19d4c7;
			}

			.sales-data {
				display: flex;
				justify-content: space-around;
				padding: 20rpx 0;
				border-radius: 0 0 16rpx 16rpx;

				.data-item {
					display: flex;
					flex-direction: column;
					text-align: center;

					.value {
						font-size: 32rpx;
						font-weight: bold;
					}

					.label {
						font-size: 24rpx;
						color: #999;
					}
				}
			}
		}

		.orders {
			margin: 30rpx 0;
			background-color: #fff;
			border-radius: 16rpx;

			.order-title {
				display: flex;
				justify-content: space-between;
				padding: 20rpx;
				font-size: 32rpx;
				color: #333;

				.all {
					font-size: 24rpx;
					color: #A6A9B5;
				}
			}

			.order-tabs {
				display: flex;
				justify-content: space-between;
				gap: 10rpx;
				padding: 20rpx;
				overflow-x: auto;

				.tag-box {
					display: flex;
					gap: 20rpx;
					flex-direction: column;
					align-items: center;

					.order-icon {
						width: 60rpx;
						height: 60rpx;
					}
				}
			}
		}

		.vehicle-manage {
			margin: 30rpx 0;
			background-color: #fff;
			border-radius: 16rpx;

			.title {
				padding: 20rpx;
				font-size: 32rpx;
				color: #333;
			}

			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx;
				border-bottom: 1px solid #eee;

				.order-icon {
					width: 40rpx;
					height: 40rpx;
				}

				.text {
					margin-left: 20rpx;
				}

				.plate-text {
					color: #999;
					margin-left: 20rpx;
				}
			}
			
			.vehicle-box {
				padding: 0 20rpx;
			}
			
			.vehicle-item {
				width: 300rpx;
				height: 124rpx;
				display: flex;
				flex-direction: column;
				padding: 22rpx 24rpx;
				box-sizing: border-box;
				
				.vehicle-title {
					font-weight: 500;
					font-size: 28rpx;
					margin-bottom: 12rpx;
				}
				
				.vehicle-info {
					font-weight: 400;
					font-size: 20rpx;
					color: #666666;
				}
				
				.cgr {
					color: #19A4A4;
				}
				
				.cqy {
					color: #4E9AFF;
				}
				
				.back-icon {
					width: 28rpx;
					height: 28rpx;
					margin-left: 4rpx;
				}
			}
		}

		.banner {
			margin: 30rpx 0;
			border-radius: 16rpx;
			overflow: hidden;

			.banner-img {
				width: 100%;
				height: 200rpx;
			}
		}
	}
	
	.fixed-img {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 318rpx;
		z-index: 0;
	}
	
	.item-ex {
		height: 106rpx;
		border-radius: 35rpx;
		background: #FEFEFE;
		box-sizing: border-box;
		padding: 30rpx;
	}
	
	.ex-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 14rpx;
	}
</style>