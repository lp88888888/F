<template>
	<view class="container">
		<view class="header">

			<view class="time-header">
				<view class="time-header-day">
					<text>2005年3月</text>
					<uni-icons type="bottom" size="16" color="#999"></uni-icons>
				</view>
				<view class="time-header-day">
					<text>全部</text>
					<uni-icons type="bottom" size="16" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		<view class="invoicelist">
			<view class="invoicelist-card" v-for="(item,index) in invoiceList" :key="index">

				<view class="boay-box" @click="torefund" >
					<view class="boay-box-left">
						<view class="list-cp">
							{{item.rkname}}
						</view>
						<view class="list-type">
							<image :src="imgUrl+'img/huowu.png'" mode=""></image>
							预约货物:水果
						</view>
						<view class="gs-time">
							开放时间 : 2025-03-20 15:25:00
						</view>
						<view class="gs-time">
							预约码 : 18510004756-20250320 xxxxxxxxx
						</view>
					</view>
					<view class="boay-box-right">
						<view v-if="item.paytpye==1" class="gs-paytpye-wx">
							已预约
						</view>
						<view v-else class="gs-paytpye-zfb">
							待提交预约
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../../config';
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
			paytpye:1,
			rkname: '陕Axxxxxx',
		},
		{
			paytpye:1,
			rkname: '陕Axxxxxx',
		},
		{
			paytpye:1,
			rkname: '陕Axxxxxx',
		}
	])
	const torefund = () => {
		uni.navigateTo({
			url: '../../pages_A/greenPass/refund',
		})
	}
</script>

<style scoped lang="scss">
	.container {
		height: calc(100vh - 88rpx);
		background: #F6F5F4;
	}
	.header {
		
		padding: 0rpx 0 0rpx 40rpx; 
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
		border-radius: 24rpx;
		.check-box {
			display: flex;
		}
	}
	.boay-box {
		display: flex;
		justify-content: space-between;
		.list-cp {
			font-weight: 700;
			font-size: 32rpx;
			color: #666666;
			margin-bottom: 24rpx;
		}
		.list-type {
			display: flex;
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			align-items: center;
			margin-bottom: 44rpx;

			image {
				width: 28rpx;
				height: 28rpx;
				margin-right: 20rpx;

			}
		}


		.gs-time {
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
			margin-bottom: 28rpx;

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
			background: #fff;
			border-radius: 28rpx 28rpx 28rpx 28rpx;
			text-align: center;
			line-height: 56rpx;
			margin-right: 24rpx;
			border: 2rpx solid #D8D8D8;

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