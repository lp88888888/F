<template>
	<view class="card" :data-theme="pageTheme" @click="toNav('/pages_A/chargingPiles/queryDetail?id='+detail.stationId)">
		<view class="card-top">
			<view class="card-top-center">
				<view class="cardStatus">
					<text
						:class="[detail.stationStatus == '50' ? 'icon1' : 'icon2']">{{ statusTetx(detail.stationStatus) }}</text>
				</view>
				<view class="cardTitle texNoWrap">{{detail.stationName}}</view>
			</view>
			<view class="cardAddress flex-alims-cen">
				<text>距您{{detail.distance}}</text>
			</view>

		</view>
		<view class="cardAddress flex-alims-cen">
			<up-icon name="map" size="15"></up-icon>
			<text>{{detail.address}}</text>
		</view>
		<view class="card-buttom">
			<view class="card-buttom-left">
				<view class="price">
					<text class="price-dw">￥</text>
					<text class="price-it">{{detail.minPrice}}元/度</text>
					<text class="price-q">起</text>
				</view>
				<view class="card-buttom-left-text">（含服务费）</view>
			</view>
			<view class="card-icon">
				<view class="card-icon-item iconK m-b-20" v-if="detail.fastTotal">
					<view class="card-icon-item-text iconK-text">快</view>
					<view class="card-icon-item-num">{{detail.fastFree || 0}}/{{ detail.fastTotal }}</view>
				</view>
				<view class="card-icon-item iconM m-b-20" v-if="detail.slowTotal" style="margin-left: 20rpx;">
					<view class="card-icon-item-text iconM-text">慢</view>
					<view class="card-icon-item-num">{{detail.slowFree || 0}}/{{ detail.slowTotal }}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		toNav,
		toBack
	} from '@/utils/route';
	const props = defineProps({
		detail: {
			type: Object,
			default: {}
		}
	})
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const statusTetx = computed(() => {
		return (stationStatus) => {
			switch (stationStatus) {
				case '50':
					return '营业中';
				case '6':
					return '维护中';
				case '5':
					return '关闭';
				case '1':
					return '建设中';
				default:
					return '未知';
			}
		}
	})
</script>

<style lang="scss" scoped>
	.card {
		width: 100%;
		padding: 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
		border-radius: 16rpx;

		.card-top {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.card-top-center {
				width: calc(100% - 240rpx);
				height: 88rpx;
				display: flex;
				align-items: center;

				.cardTitle {
					font-weight: 700;
					font-size: 32rpx;
					color: #666666;
					line-height: 32rpx;
				}

				.cardAddress {
					font-weight: 400;
					font-size: 28rpx;
					color: #666666;
					line-height: 28rpx;

					text {
						margin-left: 10rpx;
					}
				}
			}

			.cardStatus {
				width: 120rpx;

				text {
					display: inline-block;
					line-height: 48rpx;
					text-align: center;
					font-weight: 400;
					font-size: 24rpx;
					width: 120rpx;
					height: 48rpx;
					border-radius: 24rpx 24rpx 24rpx 24rpx;
				}

				.icon1 {
					color: #00964E;
					background: rgba(0, 128, 66, 0.06);
				}

				.icon2 {
					color: #999999;
					background: rgba(51, 51, 51, 0.06);
				}
			}
		}

		.card-buttom {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			padding-top: 12rpx;

			.card-buttom-left {
				display: flex;
				align-items: flex-end;

				.price {
					display: flex;
					align-items: flex-end;

					.price-dw {
						font-weight: 600;
						font-size: 24rpx;
						color: #FF5405;
						
					}

					.price-it {
						font-weight: 600;
						font-size: 32rpx;
						color: #FF5405;
					}

					.price-q {
						font-weight: 400;
						font-size: 28rpx;
						color: #666666;
						margin-left: 10rpx;
					}
				}

				.card-buttom-left-text {
					padding-top: 24rpx;
					font-weight: 400;
					font-size: 24rpx;
					color: #999999;

				}
			}

			.card-icon {
				display: flex;
				align-items: center;

				.card-icon-item {
					width: 116rpx;
					height: 32rpx;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					border: 2rpx solid none;
					display: flex;
					font-size: 24rpx;

					.card-icon-item-text {
						width: 40rpx;
						height: 32rpx;
						line-height: 32rpx;
						text-align: center;

						color: #FFFFFF;
						border-radius: 8rpx 0rpx 0rpx 8rpx;
						font-weight: 700;
					}

					.card-icon-item-num {
						width: 76rpx;
						line-height: 32rpx;
						text-align: center;
						font-weight: 400;
					}
				}

				// 快
				.iconK {
					color: #47DFDA;
					background: #EAFFFF;
					border: 2rpx solid #47DFDA;

					&-text {
						color: #fff;
						background: #47DFDA;
					}
				}

				// 超
				.iconC {
					color: #4381ED;
					background: #EAF1FF;
					border: 2rpx solid #4381ED;

					&-text {
						background: #4381ED;
						color: #fff;
					}
				}

				// 慢
				.iconM {
					color: #4381ED;
					background: #EAF1FF;
					border: 2rpx solid #4381ED;
				
					&-text {
						background: #4381ED;
						color: #fff;
					}
				}
			}
		}
	}
</style>