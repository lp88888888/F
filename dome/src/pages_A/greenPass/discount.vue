<template>
	<view class="container">
		<view class="header">
			<view class="time-header">
				<view class="time-header-day">
					<text>全部车牌</text>
					<uni-icons type="bottom" size="16" color="#999"></uni-icons>
				</view>
				<view class="time-header-day">
					<text>全部活动</text>
					<uni-icons type="bottom" size="16" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		<view class="youhui">
			<view class="time-youhui">
				<text>优惠开始时间</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			至
			<view class="time-youhui">
				<text>优惠结束时间</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
		</view>
		<view class="invoicelist">
			<view class="invoicelist-card" v-for="(item,index) in invoiceList" :key="index">
				<view class="boay-box">
					<view class="boay-box-left">
						<view class="gs-time">
							{{item.time}}
						</view>
						<view class="gs-code">
							{{item.code}}
						</view>
						<view class="gs-name">
							{{item.name}}
						</view>
					</view>
					<view class="boay-box-right">
						<text>优惠</text>
						<view class="gs-price">
							{{item.price}}
						</view>
						元
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../config';

	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const check = ref(false);
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	const invoiceList = ref([
		{
			code: '陕Axxxxxx',
			time: '优惠时间 : 2025-03-20 18:52:27',
			name: '活动名称:xxx活动1',
			price: 30
		},
		{
			code: '陕Axxxxxx',
			time: '优惠时间 : 2025-03-20 18:52:27',
			name: '活动名称:xxx活动1',
			price: 30
		},
		{
			code: '陕Axxxxxx',
			time: '优惠时间 : 2025-03-20 18:52:27',
			name: '活动名称:xxx活动1',
			price: 30
		}
	])
	const toInvoicing = () => {
		uni.navigateTo({
			url: '../../pages_A/tollInvoice/Invoicing',
		})
	}
</script>

<style scoped lang="scss">
	.boay-box-right {
		display: flex;
		align-items: center;
		font-weight: 700;
		font-size: 28rpx;
		color: #999999;

		text {
			font-weight: 400;
			font-size: 28rpx;
			color: $color;
		}
	}

	.youhui {
		display: flex;
		align-items: center;
		margin-top: 20rpx;

		.time-youhui {
			width: 220rpx;
			height: 56rpx;
			background: #fff;
			border-radius: 28rpx 28rpx 28rpx 28rpx;
			text-align: center;
			line-height: 56rpx;
			margin-right: 24rpx;
			margin-left: 20rpx;
			padding-left: 20rpx;


			text {
				font-weight: 400;
				font-size: 28rpx;
				color: #666666;
				line-height: 28rpx;
				margin-right: 20rpx;

			}
		}
	}

	.container {
		height: calc(100vh - 88rpx);
		background: #F6F5F4;
	}

	.header {
		background: #FCFCFC;
		padding: 40rpx;
	}

	.invoicelist {
		padding: 32rpx;
	}


	.invoicelist-card {
		padding: 32rpx;
		width: 622rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
		margin-bottom: 24rpx;

		.check-box {
			display: flex;
		}

	}

	.boay-box {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.gs-name {
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
		}

		.gs-time {
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			margin-bottom:40rpx ;

		}
		.gs-code{
			font-weight: 700;
			font-size: 32rpx;
			color: #666666;
			margin-bottom:24rpx ;
		}
		.gs-price {
			font-weight: 700;
			font-size: 48rpx;
			color: #FF6200;
			line-height: 48rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}

		.gs-paytpye-wx {
			width: 128rpx;
			height: 48rpx;
			background: rgba(0, 128, 66, 0.06);
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			text-align: center;
			line-height: 48rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #00964E;
			margin-top: 20rpx;
		}
	}

	.input-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 32rpx;
		padding-right: 32rpx;
		width: 604rpx;
		height: 72rpx;
		background: #FCFCFC;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #EBEBEB;

		text {
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
			line-height: 28rpx;

		}
	}

	.time-header {
		display: flex;
		align-items: center;
		margin-top: 10rpx;

		.time-header-day {
			width: 220rpx;
			height: 56rpx;
			background: #F0F0F0;
			border-radius: 28rpx 28rpx 28rpx 28rpx;
			text-align: center;
			line-height: 56rpx;
			margin-right: 24rpx;

			text {
				font-weight: 400;
				font-size: 28rpx;
				color: #666666;
				line-height: 28rpx;
				margin-right: 20rpx;

			}
		}
	}
</style>