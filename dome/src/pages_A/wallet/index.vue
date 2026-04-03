<template>
	<view class="container" :data-theme="pageTheme">
		<!-- <cos-header title="钱包" :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="90" :backUrl="'/pages/individual/individual'"></cos-header> -->
		<view class="tab-con">
			<u-sticky bgColor="transparent" z-index="99999">
				<up-navbar title="钱包" :bgColor="backgroundColor" @leftClick="toBack" placeholder
					:fixed="false"></up-navbar>
			</u-sticky>
		</view>
		<view class="balance-container">
			<view class="balance-header">
				<view class="balance-title m-b-15">余额(元)</view>
				<view class="balance-amount"><text class="balance-title">￥</text>{{ moneyData.withdrawableAmount }}
				</view>
			</view>
			<view class="balance-summary">
				<view class="balance-card">
					<text class="summary-value m-b-15">
						<text class="summary-unit">￥</text>{{ moneyData.totalAmount }}</text>
					<text class="summary-label">累计收入</text>
				</view>
				<view class="balance-card">
					<text class="summary-value m-b-15">
						<text class="summary-unit">￥</text>{{ moneyData.settlingAmount }}</text>
					<text class="summary-label">结算中</text>
				</view>
				<view class="balance-card">
					<text class="summary-value m-b-15">
						<text class="summary-unit">￥</text>{{ moneyData.withdrawnAmount }}</text>
					<text class="summary-label">已提现</text>
				</view>
			</view> 
			<view class="withdraw-button"  @click="toNav(`/pages_A/wallet/withdraw?money=${moneyData.withdrawableAmount}`)">去提现</view>
			<view style="height: 20rpx;"></view>
		</view>
		<view class="content">
			<!-- 提现记录 -->
			<view class="withdraw-records">
				<view class="record-header">
					<view style="display: flex;align-items: center; justify-content: center;" @click="jlShow=true">
						<text class="record-title" style="margin-right: 10rpx;">{{selected}}</text>
						<up-icon name="arrow-down" color="#666666" size="14"></up-icon>
					</view>
					<view class="date-btn" @click="dateShow=true">
						<text class="date-title">{{ dateMonth || '按月筛选' }}</text>
						<up-icon name="arrow-down" color="#666666" size="14"></up-icon>
					</view>
				</view>
				
				<view class='box'>
					<view v-for="(item, index) in detaList" :key="index" class="record-list">
						<view v-if='record==2'>
							<view style="display: flex;justify-content: space-between;border-bottom: 1rpx solid #F0F0F0;">
								<view class="date-time">{{item.year}}-{{item.month}}</view>
								<view>{{getStatusText(item.withdrawStatus)}}</view>
							</view>
							<view  class="record-item flex just-sb">
								<view class="flex flex-col">
									<text class="record-description m-b-20">钱包提现至微信</text>
									<text class="fs-24 col9">{{ item.createTime}}</text>
								</view>
								<view class="flex flex-col ali-end">
									<text class="record-amount m-b-20">+{{ item.withdrawAmount }}</text>
									<text class="fs-24 col9">余额{{ item.availableAmount }}</text>
								</view>
							</view>
						</view>
						<view v-else>
							<view class="date-time">{{item.year}}-{{item.month}}</view>
							<view  class="record-item flex just-sb">
								<view class="flex flex-col">
									<text class="record-description m-b-20">{{item.payOrderInfoVo.orderTitle}} *{{item.payOrderInfoVo.quantity}}</text>
									<text class="fs-24 col9">{{ item.createTime}}</text>
								</view>
								<view class="flex flex-col ali-end">
									<text class="record-amount m-b-20">+{{ item.commission }}</text>
									<text class="fs-24 col9">剩余时间:{{ item.timeRemaining }}</text>
								</view>
							</view>
						</view>
					</view>
					<ser-empty v-if="detaList.length == 0"></ser-empty>
					<view style="height: 200rpx;"></view>
				</view>
				
			</view>
		</view>
		<up-datetime-picker :show="dateShow" v-model="dateVal" mode="year-month" @cancel='cancelTime'
			@confirm="datetimeFun"></up-datetime-picker>

		<up-picker :show="jlShow" v-model="record" :columns="columns" @cancel='jlShow=false' @confirm="jlFun"
			keyName="label" valueName="id"></up-picker>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { debounce } from '@/utils/common'
	import { imgUrl } from '../../config';
	import { onLoad, onShow, onPageScroll, onHide } from '@dcloudio/uni-app';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { distributionAmounts, payDistributionWithdraw,payDistributionOrderDetail } from '@/api/distribution';
	import moment from "moment";
	import { toNav, toBack } from '@/utils/route';
	const backgroundColor = ref<string>('transparent');
	import { useTheme } from "@/composables/useTheme";
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	// 初始化数据
	const moneyData = ref({});
	const selected = ref('收入明细');
	const record = ref('1');
	const columns = reactive([
		[
			{
				label: '收入明细',
				id: 1
			},
			{
				label: '提现记录',
				id: 2
			}, {
				label: '结算中明细',
				id: '0'
			}
		]
	]);
	const getStatusText=(status:any)=> {
		let statusText=''
	  switch(status) {
	    case 0:
	      statusText = '待审核';
	      break;
	    case 1:
	      statusText = '审核通过';
	      break;
	    case 2:
	      statusText = '审核拒绝';
	      break;
	    case 3:
	      statusText = '提现成功';
	      break;
	    case 4:
	      statusText = '提现失败';
	      break;
	    default:
	      statusText = '未知状态';
	  }
	  return statusText;
	}
	const withdrawRecords = ref([]);

	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const jlShow = ref<boolean>(false);
	const navBarHeight = ref(0);
	const dateShow = ref<boolean>(false);
	const dateVal = ref<string>(new Date());
	const detaList= ref([]);
	const dateMonth = ref<string>('');
    const year= ref<string>('');
	const month= ref<string>('');
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44 是默认导航栏高度
	});
	const jlFun = (e) => {
		const selectedItem = e.value[0];
		selected.value = selectedItem.label || '';
		record.value = selectedItem.id || '' ;
		jlShow.value = false;
		if(selectedItem.id==2){
			payDistributionWithdrawFun()
		}else{
			payDistributionOrderDetailFun()
		}
	}
	const datetimeFun = (e : any) => {
		// dateVal.value = moment(e.value).format("YYYY-MM")
		dateMonth.value = moment(e.value).format("YYYY-MM")
		year.value= moment(e.value).format("YYYY")
		month.value= moment(e.value).format("MM")
		dateShow.value = false
		if(record.value==2){
			payDistributionWithdrawFun()
		}else{
			payDistributionOrderDetailFun()
		}
	}

	const cancelTime = () => {
	
		dateShow.value = false

	};

	const handleWithdraw = () => {
		// 模拟提现功能
		console.log('点击提现');
	};

   const distributionAmountFun = async () => {
		const id = uni.getStorageSync('userInfo').id
		let res = await distributionAmounts(id);
		moneyData.value = res.data
	}
	const payDistributionWithdrawFun = async () => {
		let params = {
			year:year.value,
			month:month.value,
		}
		let res = await payDistributionWithdraw(params);
		console.log(res)
		detaList.value=res.rows
	}
	const payDistributionOrderDetailFun= async () => {
		let params = {
			year:year.value,
			month:month.value,
			commissionStatus:record.value 
		}
		let res = await payDistributionOrderDetail(params);
		detaList.value=res.data.list
	}
	onShow(()=>{
		distributionAmountFun()
		payDistributionOrderDetailFun()
	})
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background: #f8f9fb;
	}
    .box{
		height: 60vh;
		overflow: scroll;
	}
	.balance-container {
		padding: 20rpx 0;
		position: relative;
		box-sizing: border-box;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/money_bg.png');
		background-size: 100% 100%;
		position: relative;
	}

	.balance-header {
		margin: 65rpx 0 0 65rpx;
	}

	.balance-title {
		font-weight: 500;
		font-size: 28rpx;
		color: #333333
	}

	.balance-amount {
		font-size: 56rpx;
		color: #333333;
		font-weight: bold;
	}

	.withdraw-button {
		width: 590rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background: var(--but-color-line);
		border-radius: 40rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		margin: 0 auto 20rpx;
	}

	.balance-summary {
		height: 160rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		padding: 30rpx 40rpx;
		display: flex;
		justify-content: space-around;
	}

	.balance-card {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.summary-unit {
		font-weight: 800;
	}

	.summary-label {
		font-weight: 500;
		font-size: 24rpx;
		color: #666666;
	}

	.content {
		padding: 0 20rpx;
		margin-top: 30rpx;


		.summary-value {
			font-size: 28rpx;
			color: #000000;
		}

		.withdraw-records {
			margin-top: 30rpx;
			padding-bottom: 60rpx;
		}

		.record-header {
			font-weight: bold;
			font-size: 26rpx;
			color: #000000;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.record-title {
			font-weight: bold;
			font-size: 26rpx;
			color: #000000;
		}

		.date-btn {
			height: 56rpx;
			background: #FFFFFF;
			border-radius: 28rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 30rpx;
		}

		.date-title {
			margin-right: 10rpx;
		}

		.record-list {
			margin-bottom: 30rpx;
			background: #FFFFFF;
			border-radius: 26rpx;
			padding: 30rpx 30rpx 0;
		}

		.date-time {
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
			border-bottom: 1rpx solid #F0F0F0;
			padding-bottom: 25rpx;
		}

		.record-item {
			padding: 30rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.record-info {
			display: flex;
			flex-direction: column;
		}

		.record-description {
			font-weight: 500;
			font-size: 28rpx;
			color: #000000;
		}

		.record-amount {
			font-weight: bold;
			font-size: 28rpx;
			color: $color;
		}

		.ali-end {
			align-items: flex-end;
		}

	}

	.tab-con {
		width: 100%;
		box-sizing: border-box;
		background: var(--bgqscolor)
	}
</style>