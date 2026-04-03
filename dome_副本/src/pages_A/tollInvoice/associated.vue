<template>
	<view class="container">
		<cos-header title='关联车票' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="90"></cos-header>

		<view class="content" :style="{ paddingTop: navBarHeight + 'px' }">
			<!-- 车辆绑定区域 -->
			<view class="car-bind-section">
				<view class="car-icon-wrap">
					<u-icon name="car" size="80" color="#C9B99F" />
					<text class="car-tip">未绑定车辆</text>
				</view>
				<view class="car-btn" @click="goBindCar">去绑定车辆</view>
			</view>
			
			<view class="list-card">
				<!-- 筛选栏 -->
				<view class="filter-bar">
					<view class="date-btn" @click="dateShow=true">
						<text class="date-title">{{ dateMonth || '按月筛选' }}</text>
						<up-icon name="arrow-down" color="#666666" size="14"></up-icon>
					</view>
					<view class="pay-btn" @click="payShow=true">
						<text class="date-title">{{ payVal || '支付方式' }}</text>
						<up-icon name="arrow-down" color="#666666" size="14"></up-icon>
					</view>
				</view>

				<!-- 无记录提示区域 -->
				<view class="empty-record">
					<view class="empty-icon-wrap">
						<u-icon name="暂无记录" size="60" color="#E6E6E6" />
						<text class="empty-tip">暂无人工车道通行费记录</text>
					</view>
				</view>
			</view>
		</view>
		
		<up-datetime-picker :show="dateShow" v-model="dateVal" mode="year-month"  @cancel='cancelTime'
			@confirm="datetimeFun"></up-datetime-picker>
		<up-picker :show="payShow" :columns="[payColumns]"  @cancel='payShow=false' @confirm='paySelect' keyName="label" valueName="value"></up-picker>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { imgUrl } from '../../config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import moment from "moment";
	
	const backgroundColor = ref<string>('#FFFFFF');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);

	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44 是默认导航栏高度
	});

	// 选中值
	const selectedMonth = ref('2005年3月');
	const selectedPayMethod = ref('支付方式');

	// 下拉变更事件
	const handleMonthChange = (value : string) => {
		selectedMonth.value = value;
		// 可在此处触发查询逻辑
	};
	const handlePayMethodChange = (value : string) => {
		selectedPayMethod.value = value;
		// 可在此处触发查询逻辑
	};

	// 去绑定车辆
	const goBindCar = () => {
		// 跳转至车辆绑定页面
		// uni.navigateTo({ url: '/pages/car-bind/car-bind' });
	};
	
	const dateShow = ref<boolean>(false);
	const dateVal = ref<string>('');
	const dateMonth = ref<string>('');
	const payShow = ref<boolean>(false);
	const payVal = ref<string>('');
	const payColumns = ref([
		{
			value: '1',
			label: '微信'
		},
		{
			value: '2',
			label: '支付宝'
		},
		{
			value: '3',
			label: '银行卡'
		},
	])
	
	const datetimeFun = (e : any) => {
		dateVal.value = moment(e.value).format("YYYY-MM")
		dateMonth.value = moment(e.value).format("YYYY-MM")
		dateShow.value = false
	}
	
	const cancelTime= () => {
		dateVal.value =''
		dateShow.value = false
	};
	
	const handleWithdraw = () => {
		// 模拟提现功能
		console.log('点击提现');
	};
	
	const paySelect = (e: any) => {
		console.log('e++',e);
		payVal.value = e.value[0].label
		payShow.value = false
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 32rpx;
		background-color: #F6F5F4;
		min-height: 100vh;
	}

	/* 车辆绑定区域样式 */
	.car-bind-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 48rpx;
		height: 564rpx;
		background: linear-gradient( 180deg, #FFFFFF 0%, #FFF7EB 100%);
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138,78,0,0.05);
		border-radius: 16rpx;
		box-sizing: border-box;

		.car-icon-wrap {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 30rpx;

			.car-tip {
				margin-top: 32rpx;
				font-weight: 600;
				font-size: 36rpx;
				color: #999999;
			}
		}
		
		.car-btn {
			width: 240rpx;
			height: 72rpx;
			background: var(--primary-color);
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #FFFFFF;
			line-height: 72rpx;
			text-align: center;
		}

		::v-deep .u-button {
			width: 200rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 30rpx;
			font-size: 28rpx;
		}
	}
	
	.list-card {
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138,78,0,0.05);
		padding: 32rpx;
		box-sizing: border-box;
		margin-top: 24rpx;
	}

	/* 筛选栏样式 */
	.filter-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.date-btn {
			width: 224rpx;
			height: 56rpx;
			background: #F6F6F6;
			border-radius: 28rpx 28rpx 28rpx 28rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 30rpx;
			box-sizing: border-box;
		}
		
		.pay-btn {
			font-weight: 700;
			font-size: 28rpx;
			color: #666666;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.date-title {
			margin-right: 24rpx;
		}
	}

	/* 无记录提示样式 */
	.empty-record {
		display: flex;
		justify-content: center;
		padding: 80rpx 0;

		.empty-icon-wrap {
			display: flex;
			flex-direction: column;
			align-items: center;

			.empty-tip {
				margin-top: 20rpx;
				font-size: 28rpx;
				color: #C9C9C9;
			}
		}
	}
</style>