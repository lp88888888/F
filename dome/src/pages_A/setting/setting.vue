<!-- 系统设置 -->
<template>
	<view class="setting-box" :data-theme="pageTheme">
		<!-- <cos-header title='系统设置' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100"></cos-header> -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="系统设置" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<!-- <up-navbar title="系统设置" :bgColor="backgroundColor" @leftClick="toBack" placeholder :fixed="true"></up-navbar> -->
		<view :style="{ paddingTop: 10 + 'px' }">
			<up-cell-group>
				<!-- <up-cell title="账号与安全" isLink>
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell> -->
				<!-- <up-cell title="设置密码" isLink  @click="pathOn(5)"> -->
				<up-cell title="设置密码" isLink url="/pages_E/passwordSettings/index" @click="pathOn(5)">
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell>
				<up-cell title="主题设置" isLink url="/pages_A/setting/themeswitcher" :border="false">
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell>
				
			</up-cell-group>

			<up-cell-group>
				<!-- #ifdef APP -->
					<up-cell title="系统权限管理" isLink @click="pathOn(6)">
						<template #value>
							<view class="cell-h"> </view>
						</template>
					</up-cell>
				<!-- #endif -->
				
				<up-cell title="个人信息收集清单" isLink @click="pathOn(1)">
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell>
				<up-cell title="第三方信息共享清单" isLink @click="pathOn(2)">
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell>
				<up-cell title="隐私政策" isLink @click="pathOn(3)">
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell>
				<up-cell title="用户协议" isLink :border="false" @click="pathOn(4)">
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell>
				<up-cell title="注销账号" isLink url="/pages_A/setting/cancellation" :border="false">
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell>
			</up-cell-group>
			<!-- #ifdef APP -->
			<up-cell-group>
				<!-- <up-cell title="意见反馈" isLink>
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell> -->
				<up-cell title="缓存大小">
					<template #value>
						<view class="cell-h">{{currentSize}}</view>
					</template>
				</up-cell>
				<up-cell title="软件版本">
					<template #value>
						<view class="cell-h">{{appVersion}}</view>
					</template>
				</up-cell>
				<!-- <up-cell title="关于我们" isLink :border="false">
					<template #value>
						<view class="cell-h"> </view>
					</template>
				</up-cell> -->
			</up-cell-group>
			<view class="beiClasss"
				@click="toNav('/pages_A/raffleH5/index?linkUrl=https://beian.miit.gov.cn/#/Integrated/recordQuery')">
				ICP备案号：陕ICP备2025078872号-3A</view>
				<!-- #endif -->

			<view class="btn-bar" @click="clear" v-if="userInfo">
				退出登录
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { toNav, toBack } from '@/utils/route';
	import {
		imgUrl,
	} from '../../config';
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive
	} from 'vue';
	import {
		showConfirm
	} from '@/utils/common';
	import {
		useAppStore
	} from '@/store/modules/app';
	import { CurrentPage, showAlert2, openAPPLocation } from '@/utils/util';
	import theme from '@/utils/theme'
	import CosHeader from '@/components/customNavBar/index.vue';
	const backgroundColor = ref<string>("#FFFFFF");
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const currentSize = uni.getStorageInfoSync().currentSize + 'KB';
	const appVersion = uni.getSystemInfoSync().appVersion;
	const userInfo = uni.getStorageSync('userInfo').id;
	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	const appStore = useAppStore();
	const pathOn = (val : string) => {
		if (val == 1) {
			uni.navigateTo({
				url: '/pages_C/xieyi/index?type=' + 'personalInformationCollectionAndUseList'
			})
		} else if (val == 2) {
			uni.navigateTo({
				url: '/pages_C/xieyi/index?type=' + 'listOfThirdPartyInformationSharing'
			})
		} else if (val == 3) {
			uni.navigateTo({
				url: '/pages_C/xieyi/index?type=' + 'privacy'
			})
		} else if (val == 4) {
			uni.navigateTo({
				url: '/pages_C/xieyi/index?type=' + 'userService'
			})
		} else if (val == 5) {
			uni.navigateTo({
				url: '/pages_E/passwordSettings/index'
			})
		}else if (val == 6) {
			uni.navigateTo({
				url: '/pages_A/setting/systemPermission'
			})
		}
	}
	onLoad(() => {
	})
	const clear = () => {
		appStore.clearUserInfo()
		// #ifdef MP-WEIXIN
		uni.reLaunch({
			url: '/pages_A/login/login?fromPage=' + CurrentPage(),
		});
		// #endif
		// #ifdef APP
		uni.reLaunch({ url: '/pages_A/login_password/login' });
		// #endif
		
	}
</script>

<style scoped>
	@import './setting.scss';

	.searchView {
		background: var(--head-color);
	}

	.btn-bar {
		width: 686rpx;
		height: 80rpx;
		background: var(--but-color-line);
		border-radius: 40rpx;
		font-weight: 500;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		margin: 0 32rpx;
		position: fixed;
		bottom: 63rpx;
	}
</style>