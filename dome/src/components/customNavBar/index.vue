<template>
	<!-- #ifndef MP-ALIPAY -->
	<view class="cos-header" :class="{ 'is_fixed': fixed }"
		:style="{ height: defaultNavBarheight + 'px', background: backgroundColor, zIndex: zIndex, color: fontColor }">
		<image :src="backgroundImage" class="nav-bg" mode="scaleToFill" :style="{ height: height + 'px' }"></image>
		<!-- 状态栏占位 -->
		<div :style="{ height: statusBarHeight + 'px' }"></div>
		<!-- 导航栏 -->
		<view class="nav-wrapper" :style="{ height: navBarHeight + 'px' }">
			<!-- 返回按钮 -->
			<view class="nav-back" v-if="isShowLeft" :style="{ width: menuButtonRect.width + 'px' }"
				@click="handleBack">
				<slot name="left">
					<template>
						<image :src="backIcon || imgUrl + 'prev.png'" :class="backIcon ? 'w-img' : 'img'"></image>
					</template>
				</slot>
			</view>
			<view class="nav-back" v-if="!isShowLeft" :style="{ width: menuButtonRect.width + 'px' }"
				@click="handleBack">
				<slot name="left">
					<template>
						<!-- <image src="/src/static/car_bg_w.png" class="img"></image> -->
					</template>
				</slot>
			</view>
			<view class="nav-title">
				<slot>
					<view class="flex ali-cen">
						<image v-if="carIcon" :src="`${imgUrl}${carIcon}`" class="car-img"></image>
						<text>{{ title }}</text>
						<image @click="onMessageClick" v-if="isMessage" :src="imgUrl + 'clear.png'" class="clear-img"></image>
					</view>
				</slot>
			</view>
			<!-- 胶囊位置 -->
			<view class="nav-menu" v-if="isShowRight" :style="{ width: menuButtonRect.width + 'px' }">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
	<!-- #endif -->
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		onLoad,
		onUnload,
		onShow,
		onBackPress,
		onPullDownRefresh
	} from '@dcloudio/uni-app'
	import { imgUrl } from '../../config';
	/**
	 * NavBar 自定义导航
	 {String} title 标题文字
	 {String} homeUrl 左侧点击返回主页地址
	{String} homeIcon 左侧主页图标
	 {String} backUrl 左侧点击返回地址
	 {String} backIcon 左侧返回图标
	 {Boolean} fixed = [true|false] 是否固定顶部
	 {Number} zIndex = 显示层级
	{String} backgroundColor 导航栏背景颜色
	 {String} backgroundImage 导航栏背景图片
	 {String} fontColor 图标和文字颜色
	{Boolean} isShowBack 是否显示返回图标
	 {Boolean} isShowLeft 是否显示左侧
	 {Boolean} isShowRight 是否显示右侧
	 {Number} defaultNavBarheight 默认导航栏高度
	 {Number} defaultMenuWidth 默认菜单宽度
	 {Object} jumpMap 主页跳转方法映射
	 */
	const props = defineProps({
		title: {
			type: String,
			default: ''
		},
		homeUrl: {
			type: String,
			default: '/pages/home/home'
		},
		homeIcon: {
			type: String,
			default: ''
		},
		backUrl: {
			type: String,
			default: ''
		},
		backIcon: {
			type: String,
			default: ''
		},
		fixed: {
			type: Boolean,
			default: false
		},
		zIndex: {
			type: Number,
			default: 99
		},
		backgroundColor: {
			type: String,
			default: '#fff'
		},
		backgroundImage: {
			type: String,
			default: ''
		},
		fontColor: {
			type: String,
			default: '#000'
		},
		isShowBack: {
			type: Boolean,
			default: true
		},
		isShowLeft: {
			type: Boolean,
			default: true
		},
		isShowRight: {
			type: Boolean,
			default: true
		},
		defaultNavBarheight: {
			type: Number,
			default: 40
		},
		defaultMenuWidth: {
			type: Number,
			default: 40
		},
		jumpMap: {
			type: Object,
			default: () => ({
				home: '',
				back: ''
			})
		},
		isMessage: {
			type: Boolean,
			default: false
		},
		carIcon: {
			type: String,
			default: ''
		},
	});

	// 响应式变量
	const statusBarHeight = ref(0);
	const navBarHeight = ref(props.defaultNavBarheight);
	const menuButtonRect = ref({
		width: props.defaultMenuWidth
	});
	const height = ref(props.defaultNavBarheight);
	const isFirstPage = ref(true);

	// 方法定义
	const setTitle = () => {
		// 针对支付宝进行动态设置
		// #ifdef MP-ALIPAY
		uni.setNavigationBarTitle({
			title: props.title
		});
		// #endif
		// #ifdef H5
		document.title = props.title;
		// #endif
	};
	const emit = defineEmits();
	// 点击消息图标时触发的事件
	const onMessageClick = () => {
	  emit('messageClick'); // 触发 messageClick 事件
	};

	const getRectInfo = () => {
		// 获取状态栏高度
		const sysInfo = uni.getSystemInfoSync();
		statusBarHeight.value = sysInfo.statusBarHeight;
		uni.setStorageSync('statusBarHeight', statusBarHeight.value)
		// 默认高度
		height.value = statusBarHeight.value + props.defaultNavBarheight;

		// #ifndef APP || H5
		// 判断获取微信小程序胶囊API是否可用 H5出现为true情况无法使用
		if (uni.canIUse('getMenuButtonBoundingClientRect')) {
			// 获取微信小程序胶囊布局位置信息
			menuButtonRect.value = uni.getMenuButtonBoundingClientRect();
			// (胶囊上部高度-状态栏高度)*2 + 胶囊高度 = 导航栏高度（不包含状态栏）
			// 以此保证胶囊位于中间位置，多机型适配
			navBarHeight.value = (menuButtonRect.value.top - sysInfo.statusBarHeight) * 2 + menuButtonRect.value
			.height;
			// 状态栏高度 + 导航栏高度 = 自定义导航栏高度总和
			height.value = statusBarHeight.value + navBarHeight.value;
		}
		uni.setStorageSync('navBarHeight', navBarHeight.value)
		// #endif
	};

	const getPageInfo = () => {
		const pages = getCurrentPages();
		isFirstPage.value = pages.length === 1;
	};

	const handleBack = () => {
		if (!props.isShowBack) return;

		if (!isFirstPage.value && !props.backUrl) {
			uni.navigateBack({
				delta: 1
			});
			return;
		}

		const url = isFirstPage.value ? props.homeUrl : props.backUrl;
		if (!url) return;

		// 判断目标页面是否是 TabBar 页面
		const tabBarPages = ["/pages/home/home", "/pages/points/index","/pages/individual/individual"];
		const isTabBarPage = tabBarPages.includes(url);

		if (isTabBarPage) {
			uni.navigateTo({
				url
			}); // 使用 switchTab 跳转 TabBar 页面
			return;
		}
		
		const type = isFirstPage.value ? (props.jumpMap.home || '') : (props.jumpMap.back || '');
		if (type) {
			uni[type]({
				url
			});
			return;
		}

		try {
			uni.navigateTo({
				url
			});
		} catch (error) {
			uni.navigateTo({
				url
			});
		}
	};
	// 挂载时初始化
	onLoad(() => {
		getRectInfo();
		getPageInfo();
		setTitle();
	})
</script>

<style>
	.cos-header {
		position: relative;
		width: 100vw;
	}

	.nav-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100vw;
	}

	.is_fixed {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 99;
	}

	.nav-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 8px;
	}

	.img {
		width: 20rpx;
		height: 35rpx;
		margin-left:15rpx;
	}
	
	.w-img {
		width: 48rpx;
		height: 48rpx;
		margin-left: 15rpx;
	}

	.nav-back {
		flex-shrink: 0;
	}

	.nav-title {
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
	}

	.nav-menu {
		flex-shrink: 0;
	}
	
	.clear-img {
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid #E1E1E1;
		border-radius: 50%;
		margin-left: 10rpx;
		padding: 4rpx;
	}
	
	.car-img {
		width: 34rpx;
		height: 34rpx;
		margin-right: 13rpx;
	}
	
</style>