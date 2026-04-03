<template>
	<view class="details-box">
		<cos-header :background-color="backgroundColor" :fixed="fixed" :defaultNavBarheight="navBarHeight"></cos-header>
		<!-- 顶部开票完成提示区域 -->
		<view class="top-section">
			<view class="top-section-box">
				<image :src="imgUrl + 'success.png'" class="img"></image>
			</view>
			<view class="top-section-wenzi">
				<view class="title">{{dataForm.statusStr}} :</view>
				<view class="title">&nbsp;¥&nbsp;</view>
				<view class="money" v-if="type == 'pass'">{{ dataForm.feeStr }}</view>
				<view class="money" v-else>{{ dataForm.sumAmount }}</view>
			</view>
		</view>
		<view class="toll-invoice-container">
			<!-- 信息列表区域 -->
			<view class="info-list">
				<view class="list-item">
					<text class="label">车牌号</text>
					<text class="value">{{ dataForm.carNum }}</text>
				</view>
				<template v-if="type == 'pass'">
					<view class="list-item">
						<text class="label">入口收费站</text>
						<text class="value">{{ dataForm.enStationName }}</text>
					</view>
					<view class="list-item">
						<text class="label">入口时间</text>
						<text class="value">{{ dataForm.enTime }}</text>
					</view>
					<view class="list-item">
						<text class="label">出口收费站</text>
						<text class="value">{{ dataForm.exStationName }}</text>
					</view>
					<view class="list-item">
						<text class="label">出口时间</text>
						<text class="value">{{ dataForm.exTime }}</text>
					</view>
					<view class="list-item">
						<text class="label">开票金额</text>
						<text class="value">¥{{ dataForm.feeStr }}</text>
					</view>
				</template>
				<template>
					<view class="list-item">
						<text class="label">开票金额</text>
						<text class="value">¥{{ dataForm.sumAmount }}</text>
					</view>
				</template>
				<!-- <view class="list-item">
					<text class="label">收费类型</text>
					<text class="value">ETC车道</text>
				</view> -->

				<view class="list-item" v-if="type!='pass' && dataForm.invoiceMail">
					<text class="label">电子邮箱</text>
					<text class="value">{{ dataForm.invoiceMail }}</text>
				</view>
				<view class="list-item">
					<text class="label">发票张数</text>
					<text class="value">{{ dataForm.sumInvoice }}张</text>
				</view>
				<view class="list-item">
					<text class="label">发票类型</text>
					<text class="value">{{ type == 'pass'?'消费发票申请':dataForm.applyTypeStr }}</text>
				</view>
				<view class="list-item">
					<text class="label">开票时间</text>
					<text class="value">{{ dataForm.applyTime }}</text>
				</view>
			</view>
			<!-- 操作按钮区域 -->
			<view class="btn-group">
				<template v-if="type != 'pass' && (dataForm.status == 2 || dataForm.status == 3)">
					<view class="operate-btn" @click="startTimer" style="border: 1px solid #CCCCCC;">发票换开</view>
					<view class="operate-btn" @click="handleSendEmail"
						style="border: 1px solid #51B3F7;color: #51B3F7;">发送邮箱</view>
				</template>

				<!-- <view class="operate-btn" @click="handleDownload"
					style="border: 1px solid #FF9600;color: #FF9600;margin-right: 20px;">发票下载</view> -->
				<view class="operate-btn" @click="goInvioce" style="">查看发票</view>
			</view>
		</view>

		<!-- 邮箱输入弹窗-->
		<up-popup :show="emailShow" mode="center" zIndex="999999" :safeAreaInsetBottom="false" bgColor="transparent"
			round="5">
			<view class="emailpopup">
				<view class="header">
					<text class="tex28_33_b"><text style="color: red;">*</text>电子邮箱</text>
					<image class="icClose" :src="imgUrl + 'ic_close.png'" @click="emailShow=false" />
				</view>
				<input type="text" v-model="email" placeholder="请输入您接收发票的邮箱地址" placeholder-class="tex28_99"
					class="tex28_33 email-input" />
				<view class="btn" @click="openConfirm">下一步</view>
			</view>
		</up-popup>
		<etc-login v-if="layerShow" @closePop="closePop" @loginSuc="closePop"></etc-login>
	</view>
</template>

<script setup lang="ts">
	import { imgUrl } from '../../config';
	import { ref, onUnmounted } from 'vue';
	import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
	import EtcLogin from '@/pages_A/etcInvoice/components/EtcLogin.vue';
	import { etcInvoice } from '@/api/etcInvoice';
	import { showToast, showToastSuccess, showLoading, hideLoading, isEmpty, isEmail } from '@/utils/util';
	import CosHeader from '@/components/customNavBar/index.vue';
	interface CosHeaderProps {
		backgroundColor : string;
		fixed : boolean;
		defaultNavBarheight : number;
	}
	import theme from '@/utils/theme'
	const fixed = ref<boolean>(true);
	const backgroundColor = ref<string>('#FFFFFF');
	const navBarHeight = ref<number>(0);
	// 定义响应式数据
	const type = ref<string>('');
	const emailShow = ref(false);
	const layerShow = ref(false);

	const email = ref('')
	const dataForm = ref({})
	// 定义按钮点击事件处理函数
	const startTimer = () => {
		uni.showModal({
			title: '重要情况告知',
			content: '如您确需提交红冲(或换票)申请,请自觉遵守国家财税相关法律法规要求,并积极配合财税主管部门进行核查。您本次提交的申请将被如实记录,请务必谨慎操作。',
			confirmText: '已知晓',
			success: (res) => {
				if (res.confirm) {
					openOtherlayer()
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	};
	const openOtherlayer = () => {
		uni.showModal({
			title: '重要情况告知',
			content: '您正在申请发票更换,为了保证发票合规性,仅支持2次换票操作。请您认真核对将变更的发票信息，换票申请提交后，系统将在3个工作日处理您的申请，换票完成后原有发票将无法继续使用。',
			success: (res) => {
				if (res.confirm) {
					changeTitle()
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	};
	// 更换抬头
	const changeTitle = () => {
		uni.redirectTo({
			url: `/pages_A/etcInvoice/headIndex?type=change&applyId=${dataForm.value.applyId}&id=${dataForm.value.cardId}`,
		})
	}
	const handleSendEmail = () => {
		emailShow.value = true;
	};
	const openConfirm = () => {
		let that = this
		if (isEmpty(email.value)) {
			showToast('请输入电子邮箱')
			return
		} else if (!isEmail(email.value)) {
			showToast('邮箱格式有误')
			return
		}

		showLoading()
		let params = {
			serverUrl: 'appInvoiceApplySendRequest',
			cardId: dataForm.value.cardId,
			applyId: dataForm.value.applyId,
			invoiceMail: email.value,
			month: dataForm.value.month,
		}
		etcInvoice(params).then(res => {
			hideLoading()
			if (res.data.success) {
				showToastSuccess('重发发票申请成功')
			} else {
				showToast(res.data.msg)
			}
			emailShow.value = false;
		}).catch(err => {
			hideLoading()
			if (err == 'etcTokenLoad') {
				emailShow.value = false;
				layerShow.value = false;
			} else {
				showToast(err)
			}
		})
	}
	const handleDownload = () => {
		// “发票下载”逻辑，比如调用下载接口、处理文件流等
		uni.showToast({
			title: '点击了发票下载',
			icon: 'none'
		});
	};

	const goInvioce = () => {
		let applyData = dataForm.value
		if (applyData.status == 1) {
			showToast('开票中，请稍后查看~')
			return
		} else if (applyData.status == 4) {
			showToast('开票失败，请重新开票~')
			return
		}
		if (type.value == 'pass') {
			wx.navigateTo({
				url: `../invoice/invoice?tradeId=${applyData.tradeId}&card=${applyData.cardId}`
			})
			return
		}
		uni.navigateTo({
			url: `../invoice/invoice?apply=${applyData.applyId}&card=${applyData.cardId}`
		})
	}
	const realStatus = (status : number, type : any) => {
		switch (status) {
			case 1:
				if (type == 7) {
					return '换票中'
				}
				return '开票中'
			case 2:
				if (type == 7) {
					return '换票完成'
				}
				return '开票完成'
			case 3:
				return '发票已发送'
			case 4:
				return '开票失败'
		}
	}
	const closePop = () => {
		layerShow.value = false
	}
	onLoad((options) => {
		type.value = options.type
		let applyData = uni.getStorageSync('applyData')
		if (applyData) {
			if (type.value == 'pass') {
				applyData['applyTime'] = applyData.exTime
				applyData['statusStr'] = realStatus(applyData.invoiceProgressStatus, 0)
				applyData['sumAmount'] = applyData.feeStr
			}
			dataForm.value = applyData

			console.log(dataForm.value);
		}
	})
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});
</script>

<style scoped lang="scss">
	.details-box {
		width: 100%;
		height: 100vh;
		background: #f1efec;
	}

	.toll-invoice-container {
		padding: 15px;
		z-index: 99999;
		position: fixed;
		width: 90%;
		margin: 0 auto;
		top: 460rpx;
		left: 0;
	}

	.top-section {
		width: 100%;
		height: 500rpx;
		background-color: $color;
		position: fixed;
		z-index: 999;
		top: 155rpx;
		border-bottom-left-radius: 100% 16px;
		border-bottom-right-radius: 100% 16px;

		.img {
			width: 200rpx;
			height: 200rpx;
		}
	}

	.check-icon {
		width: 40px;
		height: 40px;
		margin-right: 10px;
	}



	.kpwc {
		font-size: 24rpx;
	}

	.info-list {
		margin-bottom: 20px;
		background-color: #fff;
		padding: 0 30rpx 0;
		border-radius: 26rpx;
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.label {
		color: #999;
		width: 30%;
	}

	.value {
		flex: 1;
		text-align: right;
	}

	.btn-group {
		width: 100%;
		height: 180rpx;
		background: #fff;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-right: auto;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
	}

	.operate-btn {
		border: 1px solid $color;
		color: $color;
		margin-right: 20px;
		width: 25%;
		padding: 10rpx 0;
		border-radius: 28rpx;
		text-align: center;
		margin: 0 20rpx 0 5rpx;
	}

	.top-section-box {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 10rpx 0 20rpx;
	}

	.top-section-wenzi {
		display: flex;
		justify-content: center;
		align-items: center;

		.title {
			font-size: 26rpx;
			color: #F5FAFF;
			margin-top: 4rpx;
		}

		.money {
			font-size: 44rpx;
			color: #FFFFFF;
			font-weight: bold;
		}
	}

	.icClose {
		width: 31rpx;
		height: 32rpx;
		position: absolute;
		top: 28rpx;
		right: 28rpx;
	}

	.email-input {
		width: 100%;
		height: 90rpx;
		background-color: #f0f0f0;
		border-radius: 10rpx;
		text-align: center;
		margin: 20rpx 0;
	}

	.emailpopup {
		width: 690rpx;
		height: 352rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		padding: 0 24rpx;
		box-sizing: border-box;
	}

	.emailpopup .header {
		height: 40rpx;
		border-bottom: solid 1rpx #e1e1e1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0 30rpx;
	}

	.emailpopup .btn {
		width: 90%;
		height: 90rpx;
		background-color: $color;
		border-radius: 10rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 32rpx;
		color: #fff;
		margin: 0 auto;
	}
</style>