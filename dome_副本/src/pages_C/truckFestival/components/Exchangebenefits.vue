<template>
	<view class="page_box">
		<up-navbar title="兑换福利" bgColor="transparent" placeholder autoBack :fixed="true"></up-navbar>

		<view class="point_box">
			<view>
				<text>活动积分：</text>
				<text>{{pointinfo.value}}</text>
				<text>活动兑换订单</text>
			</view>
			<view @click="toNav('/pages_C/truckFestival/pointsdetail?type=2')">积分明细</view>
		</view>

		<view class="point_tips">以下福利有效兑换时间：{{activitydel.preSignupTime}}-{{activitydel.endTime}}</view>

		<view class="point_list">
			<view class="point_item" v-for="(item, index) in items"
				@click="toNav('/pages_A/points/details?id=' + item.id+'&campaignId='+activitydel.id)" :key="index">
				<image class="item_img" :src="item.picUrl" mode=""></image>
				<text class="item_name">{{item.spuName}}</text>
				<view class="item_nums">
					<text>库存：{{item.stock}}</text>
					<text>{{item.point}}</text>
					<text>积分</text>
				</view>
			</view>
		</view>
		<ser-empty v-if="!items.length" text="暂无商品"></ser-empty>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { toast, debounce } from '@/utils/common';
	import { getexclusivePage, getCurrentTruckFestival } from '@/api/truck';
	import { getBalance } from '@/api/travel';
	import { useTheme } from '@/composables/useTheme';
	import { defineProps } from 'vue';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const pointinfo = ref(0);
	// 定义 props
	interface Props {
		campaignId : number;
		type : string;
	}

	const props = defineProps<Props>();
	const activitydel = ref({})
	const getactivity = async () => {
		try {
			const res = await getCurrentTruckFestival({
				campaignId: props.campaignId
			})
			activitydel.value = res.data
			// myregistrations()
		} catch (err) {
		}
	}
	// 假设你有一个获取数据的方法
	const items = ref([]);

	const getshoplist = async () => {
		try {
			const res = await getexclusivePage({
				generalActivityPointId: props.campaignId,
				pageSize: 99999,
				pageNum: 1,
			});
			console.log(res);
			items.value = res.data.list || []; // 假设返回的数据结构中有 data 字段
		} catch (error) {
			console.error('获取数据失败:', error);
		}
	};
	const getBalancepoint = async () => {
		try {
			const res = await getBalance({ activityId: props.campaignId, memberType: 1 });
			console.log(res);
			pointinfo.value = res.data || 0;
		} catch (error) {
			console.error('获取数据失败:', error);
		}
	};
	onMounted(() => {
		getshoplist();
		getBalancepoint();
		getactivity()
	});
</script>

<style lang="scss" scoped>
	view,
	text {
		box-sizing: border-box;
	}

	.page_box {
		width: 750rpx;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: calc(env(safe-area-inset-bottom) + 188rpx);

		.point_box {
			width: 690rpx;
			height: 156rpx;
			border-radius: 16rpx;
			background: linear-gradient(102deg, #86bc48 0%, #61af0a 98%);
			padding: 36rpx 32rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-bottom: 20rpx;

			view:nth-child(1) {
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #ffffff;

				text:nth-child(1) {
					font-size: 24rpx;
					font-weight: 500;
				}

				text:nth-child(2) {
					flex: 1 0;
					font-size: 40rpx;
					font-weight: bold;
				}

				text:nth-child(3) {
					font-size: 24rpx;
					font-weight: 500;
					text-decoration: underline;
				}
			}

			view:nth-child(2) {
				width: 124rpx;
				height: 38rpx;
				border-radius: 16rpx;
				background-color: #628f2f;
				text-align: center;
				line-height: 38rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #ffffff;
			}
		}

		.point_tips {
			width: 100%;
			font-size: 24rpx;
			font-weight: 500;
			color: #9e9e9e;
			text-align: center;
			margin-bottom: 20rpx;
		}

		.point_list {
			width: 690rpx;
			display: grid;
			height: 1100rpx;
			overflow-y: auto;
			overflow-x: hidden;
			-webkit-overflow-scrolling: touch;
			grid-template-columns: repeat(2, 1fr);
			gap: 30rpx;

			.point_item {
				width: 100%;
				height: 490rpx;
				border-radius: 16rpx;
				background-color: #ffffff;
				box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, 0.05);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 18rpx;

				.item_img {
					width: 100%;
					height: 330rpx;
					border-radius: 16rpx 16rpx 0rpx 0rpx;
					background-color: #EDF3FF;
				}

				.item_name {
					width: 100%;
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					padding: 0 20rpx;
				}

				.item_nums {
					width: 100%;
					padding: 0 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					text:nth-child(1) {
						font-size: 24rpx;
						color: #666666;
					}

					text:nth-child(2) {
						flex: 1 0;
						font-size: 28rpx;
						font-weight: 500;
						color: #FF5405;
						text-align: right;
					}

					text:nth-child(3) {
						font-size: 24rpx;
						color: #FF5405;
					}
				}
			}
		}
	}
</style>