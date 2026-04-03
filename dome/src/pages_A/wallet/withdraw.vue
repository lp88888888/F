<template>
	<view class="withdraw-page" :data-theme="pageTheme">
		<!-- 姓名输入 -->
		<view class="input-group">
			<view class="label-row">
				<text class="label">真实姓名*</text>
				<input v-model="realName" type="text" placeholder="请输入名称" class="input" />
			</view>
			<text class="tip">提示：根据微信转账规定，请输入提现帐户对应的真实姓名</text>
		</view>

		<!-- 提现金额区域 -->
		<view class="amount-group">
			<text class="max-tip">单次最高提现200元</text>
			<view class="amount-input">
				<text class="currency">¥</text>
				<input v-model="withdrawAmount" type="number" placeholder="输入提现金额" class="amount-input-field" />
				<view @click="handleAllWithdraw" class="all-btn">全部提现</view>
			</view>
			<view class="balance-info">
				<text>可提现余额 ¥{{ balance }}</text>
				<text>剩余提现次数：{{ getConfigObj.dailyWithdrawTimes }}</text>
			</view>
		    <image class="box-img" :src="imgUrl+'static/txje.png'" mode=""></image>
		</view>

		<!-- 提款方式 -->
		<view class="payment-method">
			<text class="method-label">提款方式</text>
			<view class="wechat-option">
				<view class="wechat-text">
				  <image class="success-box-img" :src="imgUrl+'static/wxzf_z.png'" mode=""></image>微信
				</view>
			</view>
		</view>

		<!-- 提现规则 -->
		<!-- <view class="rules">
			<view class="rule-title">提现规则：</view>
			<view class="rule-item">1. 最低提现金额为2元</view>
			<view class="rule-item">2. 每日提现次数为5次</view>
			<view class="rule-item">3. 支持微信与支付宝提现</view>
		</view> -->

		<!-- 提现按钮 -->
		<view :disabled="!canWithdraw" class="submit-btn" @click="payDistributionWithdrawMoneyFun">
			提现
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { payDistributionWithdrawMoney,getConfig } from '@/api/distribution';
	import { onLoad, onShow, onPageScroll, onHide } from '@dcloudio/uni-app';
	// 数据定义
	import { useTheme } from "@/composables/useTheme";
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	import { imgUrl } from '../../config';
	const realName = ref('')
	const withdrawAmount = ref<number | string>('') // 允许初始为空字符串
	const balance = ref('')
    const getConfigObj= ref('')
	// 计算是否可以提现
	const canWithdraw = computed(() => {
		const amount = Number(withdrawAmount.value) || 0
		return (
			realName.value.trim() !== '' &&
			amount >= 2 &&
			amount <= 200 &&
			amount <= balance.value &&
			remainingTimes.value > 0
		)
	})

	// 全部提现
	const handleAllWithdraw = () => {
		withdrawAmount.value = balance.value
	}

	// 提现操作
	const handleWithdraw = () => {
		uni.showToast({
			title: '提现成功',
			icon: 'success'
		})
		// 这里可以调用接口提交提现请求
	}
   const getConfigFun = async () =>{
	   let res = await getConfig();
	   getConfigObj.value=res.data
   }
   
	const payDistributionWithdrawMoneyFun = async () => {
		if(getConfigObj.value.dailyWithdrawTimes>1 || getConfigObj.value.dailyWithdrawTimes=='0'){
			uni.showToast({
				title: '剩余提现次数为0',
				icon: 'none'
			})
			return
		}
		if (!realName.value) {
			uni.showToast({
				title: '请输入姓名',
				icon: 'none'
			})
			return
		}
		if (!withdrawAmount.value) {
			uni.showToast({
				title: '请输入提现金额',
				icon: 'none'
			})
			return
		}
		if (withdrawAmount.value=='0') {
			uni.showToast({
				title: '提现余额不足',
				icon: 'none'
			})
			return
		}
		const id = uni.getStorageSync('userInfo').id
		let params = {
			withdrawAmount: withdrawAmount.value,
			memberId: id,
			accountType: '2'
		}
		let res = await payDistributionWithdrawMoney(params)
		if (res.code == 200) {
			uni.showToast({
				title: '提现成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages_A/wallet/withdrawsucceed?money='+withdrawAmount.value
				});
			}, 1000);

		}
	}
	onLoad((options: any)=>{
		if(options.money){
			balance.value=options.money
		}
		getConfigFun()
	})
</script>

<style scoped lang="scss">
	.withdraw-page {
		height: 100vh;
		background-color: #F8F9FA;
		;
		padding: 20rpx;
		color: #333;
		font-size: 28rpx;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1px solid #eee;
		position: relative;

		.title {
			font-size: 36rpx;
			font-weight: bold;
		}

		.back-btn {
			font-size: 40rpx;
		}

		.more-btn {
			display: flex;
			align-items: center;
			gap: 10rpx;
			font-size: 32rpx;
			color: #999;

			.circle {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				background-color: #000;
				display: inline-block;
			}
		}
	}

	.input-group {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

		.label-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			border-bottom: 1px solid #ddd;

			.label {
				font-weight: 500;
				color: #333;
			}

			.input {
				flex: 1;
				padding: 10rpx;

				font-size: 28rpx;
				text-align: right;
			}
		}

		.tip {
			font-size: 24rpx;
			color: #999;
		}
	}

	.amount-group {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
        position: relative;
		.max-tip {
			color: #e74c3c;
			font-size: 28rpx;
			margin-bottom: 20rpx;
		}

		.amount-input {
			display: flex;
			align-items: center;
			margin: 20rpx 0;
			border-bottom: 1px dashed #ccc;

			.currency {
				margin-right: 10rpx;
				font-size: 32rpx;
			}

			.amount-input-field {
				flex: 1;
				font-size: 36rpx;
				text-align: left;
				padding: 10rpx;

			}

			.all-btn {
				margin-left: 10rpx;
				font-size: 24rpx;
				color: #333333;
				background: none;
				border: none;
				padding: 0;
				cursor: pointer;
			}
		}

		.balance-info {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			color: #666;
		}
	}

	.payment-method {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-between;
		align-items: center;

		.method-label {
			font-weight: 500;
		}

		.wechat-option {
			display: flex;
			align-items: center;
			gap: 10rpx;

			.wechat-icon {
				width: 40rpx;
				height: 40rpx;
			}

			.wechat-text {
				display: flex;
				align-items: center;
				gap: 10rpx;
				font-size: 28rpx;
			}
		}
	}

	.rules {
		margin-bottom: 60rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		color: #666;

		.rule-title {
			font-weight: 500;
			margin-bottom: 10rpx;
		}

		.rule-item {
			margin-bottom: 10rpx;
		}
	}

	.submit-btn {
		width: 100%;
		height: 96rpx;
		background: var(--but-color-line);
		color: white;
		font-size: 32rpx;
		border-radius: 48rpx;
		margin-top: 20rpx;
		border: none;
		font-weight: 500;
		line-height: 96rpx;
		text-align: center;

		&:disabled {
			background-color: #cccccc;
			opacity: 0.6;
		}
	}
	.success-box-img{
		width: 50rpx;
		height: 50rpx;
	}
	.box-img{
		width: 120rpx;
		height: 120rpx;
		position: absolute;
		bottom: 0;
		right: 0;
	}
</style>