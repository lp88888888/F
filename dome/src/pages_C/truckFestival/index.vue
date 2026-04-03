<template>
	<view class="page-container" :data-theme="pageTheme">

		<ActivityRules :campaignId="activeInfo.id" v-if="indexActive == 'activityRules'" />
		<Exchangebenefits :campaignId="activeInfo.id" v-if="indexActive == 'welfare'" />
		<Points :campaignId="activeInfo.id" v-if="indexActive == 'points'" />
		<Service :campaignId="activeInfo.id" v-if="indexActive == 'service'" />

		<view class="footer-fixed">
			<view class="tab-bar">
				<view class="tab-item" @click="tabChange('activityRules')">
					<image class="tab-icon"
						:src="`${imgUrl}static/C-truck/tab-icon1${indexActive == 'activityRules'?'-active':''}.png`"
						mode=""></image>
					<text class="tab-text" :class="[indexActive == 'activityRules'?'textActive':'']">活动规则</text>
				</view>
				<view class="tab-item" @click="tabChange('points')">
					<image class="tab-icon"
						:src="`${imgUrl}static/C-truck/tab-icon2${indexActive == 'points'?'-active':''}.png`" mode="">
					</image>
					<text class="tab-text" :class="[indexActive == 'points'?'textActive':'']">赚取积分</text>
				</view>
				<view class="tab-item" @click="tabChange('welfare')">
					<image class="tab-icon"
						:src="`${imgUrl}static/C-truck/tab-icon3${indexActive == 'welfare'?'-active':''}.png`" mode="">
					</image>
					<text class="tab-text" :class="[indexActive == 'welfare'?'textActive':'']">兑换福利</text>
				</view>
				<view class="tab-item" @click="tabChange('service')">
					<image class="tab-icon"
						:src="`${imgUrl}static/C-truck/tab-icon4${indexActive == 'service'?'-active':''}.png`" mode="">
					</image>
					<text class="tab-text" :class="[indexActive == 'service'?'textActive':'']">相关服务</text>
				</view>
			</view>
		</view>
		<!-- <up-gap height="100"></up-gap> -->
	</view>
</template>

<script setup lang="ts">
	import ActivityRules from './components/ActivityRules';
	import Points from './components/Points';
	import Service from './components/Service';
	import Exchangebenefits from './components/Exchangebenefits'
	import { getCurrentTruckFestival } from '@/api/truck'
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { useCommonStore } from '@/store/modules/common';
	const commonState = useCommonStore();
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	const indexActive = ref('points')
	const activeInfo = ref({})


	const tabChange = (type : string) => {
		indexActive.value = type
		getData()
	}
	// 查询活动
	const getData = async () => {
		try {
			let res = await getCurrentTruckFestival()
			activeInfo.value = res.data || {}
			commonState.truckFestivalInfo = res.data || {}
			console.log('0-0--00-0-', res);
		} catch (err) {
			console.log('0-0--00-0-', err);
		}
	}
	// const get

	onLoad(() => {
		getData()
	})
</script>

<style lang="scss" scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #E8F5E9; // 页面整体浅绿背景
	}


	/* 6. 底部固定 */
	.footer-fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #FFFFFF;
		padding-bottom: env(safe-area-inset-bottom);
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);

		.tab-bar {
			background-color: #fff;
			display: flex;
			justify-content: space-around;
			padding: 10rpx 0;
			border-top: 1rpx solid #eee;

			.tab-item {
				display: flex;
				flex-direction: column;
				align-items: center;

				.tab-icon {
					width: 52rpx;
					height: 52rpx;
				}

				.tab-text {
					font-size: 28rpx;
					color: #9DA4BA;
				}

				.textActive {
					color: #333333;
				}

				&.active .tab-text {
					color: #2E7D32;
					font-weight: bold;
				}
			}
		}
	}

	.safe-area-bottom {
		height: 280rpx;
	}

	/* 为底部固定区域预留空间 */
</style>