<template>
	<view class="cancel-order">
		<view class="form">
			<view class="form-header">
				<text class="title">退款原因</text>
				<!-- <text class="required">*</text> -->
			</view>
			<view class="form-cont">
				<view v-for="(item, index) in labelList" :key="index" class="form-item"
					@click="selectReason(item.dictValue)">
					<text class="form-label">{{ item.dictLabel }}</text>
					<image class="circle-icon"
						:src="imgUrl+'trip-pro/' + (selectedId === item.dictValue ? 'is-xuanz.png' : 'is-wei-xuanz.png')" />
				</view>
			</view>
			<view style="background-color:#F8F9FB;">
				<up-textarea :height='90' :custom-style="{ backgroundColor: '#F8F9FB' }" border="none" :maxlength="500" v-model="evaluationText" placeholder="输入备注"
					count></up-textarea>
			</view>

		</view>
		<view class="bottom-bar">

			<view class="cancel-button" @click="handleCancelOrder">确认退款</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { getDict } from '@/api/config';
	// 假设 activityApi 是一个模块，导出 imgUrl
	import { imgUrl } from '@/config';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { postpayrefundinfo } from '@/api/index';
	// 数据
	const orederid = ref('')

	const selectedId = ref('')
	const evaluationText = ref('')
	onLoad((options) => {
		orederid.value = options.id; // 修正了这一行
		// getInfo();
	})
	onMounted(() => {
		gettypelist()
	})
	const labelList = ref([])
	const gettypelist = async () => {
		let res = await getDict('reason_select_gas_station')
		labelList.value = res.data
	}
	// 方法
	const selectReason = (label : string) => {
		selectedId.value = label
	}
	const handleCancelOrder = () => {
		if (selectedId.value === null) {
			uni.showToast({ title: '请选择退款原因', icon: 'none' })
			return
		}
		let params = {
			superId: orederid.value,
			superReason: evaluationText.value,
			superReasonSelect: selectedId.value,
		}
		postpayrefundinfo(params).then(res => {
			if (res.code == 200) {
				uni.showToast({ title: '申请成功', icon: 'none' })
				uni.reLaunch({
					url: '/pages_D/refuelingRefilling/orderList'
				})
			} else {
				uni.showToast({ title: res.msg, icon: 'none' })
			}
		})
	}
</script>

<style scoped>
	.eva-textarea {
		width: 710rpx;
		/* 建议留边距 */
		height: 200rpx;
		/* 高度自定义 */
		background-color: #F8F9FB;
		border-radius: 16rpx;
		padding: 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #333;
		line-height: 44rpx;
	}

	.cancel-order {
		padding: 30rpx;
		background: #F8F9FB;
		min-height: calc(100vh - 160rpx);
	}

	.bottom-bar {
		width: 750rpx;
		height: 160rpx;
		background: #ffffff;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.03);
		border: 2rpx solid rgba(0, 0, 0, 0.1);
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 32rpx 40rpx;
		box-sizing: border-box;
	}

	.bar-left {
		display: flex;
		flex-direction: column;
	}

	.unit {
		font-weight: 700;
		font-size: 32rpx;
		color: #ff9000;
	}

	.price {
		font-weight: 700;
		font-size: 48rpx;
		color: #ff9000;
	}

	.refund {
		font-weight: 400;
		font-size: 28rpx;
		color: #999999;
		margin-top: 6rpx;
	}

	.form {
		background: linear-gradient(180deg, #DEF9F8 2%, #FFFFFF 20%);
		border-radius: 16rpx;
		padding: 30rpx;
	}

	.form-header {
		display: flex;
		align-items: center;
	}

	.form-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 30rpx 0;
	}

	.circle-icon {
		width: 28rpx;
		height: 28rpx;
		background: #ffffff;
		border: 2rpx solid #c9c9c9;
		border-radius: 50%;
	}

	.form-label {
		font-weight: 400;
		font-size: 32rpx;
		color: #333333;
		line-height: 48rpx;
	}

	.title {
		font-weight: 700;
		font-size: 28rpx;
		color: #000;
	}

	.required {
		font-weight: 400;
		font-size: 28rpx;
		color: #fd4848;
		margin-left: 12rpx;
	}

	.cancel-button {
		width: 622rpx;
		height: 96rpx;
		background: #00BEBE;
		border-radius: 48rpx;
		font-weight: 700;
		font-size: 32rpx;
		color: #ffffff;
		text-align: center;
		line-height: 96rpx;
	}
</style>