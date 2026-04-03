<template>
	<!-- 这是一个用户隐私保护提示的弹窗组件 -->
	<view class="privacy-dialog">

		<up-popup :show="manShow" mode="center" round="10">
			<view class="privacy-dialog-content" :style="{ background: themeStore.themeColors.$bgTemToPageColor }">
				<view class="privacy-dialog-title">隐私政策已更新</view>
				<scroll-view scroll-y="true" class="scroll-Y">
					<up-parse :content="content"></up-parse>
				</scroll-view>
				
				<!-- <view class="privacy-dialog-text">如您同意，请点击“同意”开始接受我们的服务。</view>  -->
				<view class="agreement">
					<up-checkbox :customStyle="{ marginBottom: '4px' }" name="agree" usedAlone shape="circle" size="14"
						activeColor="#628F2F" v-model:checked="aloneChecked" @change="aloneCheckedFun">
					</up-checkbox>
					<text class="agreement-text">已阅读并同意</text>
					<text class="protocol-text" :style="{ color: themeStore.themeColors.$color }"
						@click="openProtocol('userService')">《用户服务协议》</text>
					<text class="protocol-text" :style="{ color: themeStore.themeColors.$color }"
						@click="openProtocol('privacy')">《隐私政策》</text>
				</view>
				<view class="privacy-dialog-btns">
					<text class="privacy-dialog-btn buts1"
						:style="{border: `2rpx solid ${themeStore.themeColors.$color}`,color: themeStore.themeColors.$color } "
						@click="agree">同意</text>
					<text class="privacy-dialog-btn buts2" :style="{ background: themeStore.themeColors.$butColor }"
						@click="agree2">不同意并进入浏览模式</text>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		richTextList,
		richTextInfo
	} from '@/api/config'
	import {
		getUserAgreementStatus, updateUserAgreementIsPop
	} from '@/api/user'
	import {
		useTheme
	} from '@/composables/useTheme';
	import {
		useAppStore
	} from '@/store/modules/app';
	const appStore = useAppStore();
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const aloneChecked = ref(false);

	const manShow = ref(false);
	const emit = defineEmits(['agree', 'disagree'])
	// 状态
	const content = ref('')
	// 方法
	const aloneCheckedFun = () => {
		aloneChecked.value = !aloneChecked.value;
	};
	const getData = async () => {
		let res = await richTextList()
		if (res.code == 200) {
			let arr = []
			arr = res.rows.filter(item => item.popupType == '隐私政策更新内容')


			if (arr.length) {
				let ress = await richTextInfo(arr[0].id)
				content.value = ress.data.content
			}

		}
	}
	function getIsAgree() {
		const value = uni.getStorageSync(isyskeyName)
		if (value == 1) {
			manShow.value = false
		} else if (value == 2) {
			manShow.value = true
		} else {
		}
	}
	const agree = () => {
		if (!aloneChecked.value) {
			return uni.showToast({ title: '请先阅读并同意用户协议和隐私政策', icon: 'none' });
		}
		const res = updateUserAgreementIsPop(1)
		manShow.value = false
	}
	const agree2 = () => {
		appStore.clearUserInfo()
		manShow.value = false
	}

	const openProtocol = (type) => {
		uni.navigateTo({
			url: '/pages_C/xieyi/index?type=' + type
		})
	}
	const getisshow = async () => {
		let res = await getUserAgreementStatus()
		if (res.code == 200) {
			if (res.data.isPop == 1) {
				manShow.value = false
			} else {
				manShow.value = true
			}
		}
	}
	// 初始化：读取本地存储判断是否已同意
	onMounted(() => {
		getData()
		if (uni.getStorageSync('Token')) {
			getisshow()
		}
	})
</script>

<style lang="scss" scoped>
	.scroll-Y{
		max-height: 600rpx;
	}
	.agreement {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		font-size: 24rpx;
		color: #999;
		margin-top: 50rpx;
		margin-bottom: 30rpx;
	}

	.agreement-text {
		margin-right: 10rpx;
	}

	.protocol-text {
		margin: 0 5rpx;
	}

	.privacy-dialog-content {
		position: relative;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		padding: 48rpx 40rpx 0;
		box-sizing: border-box;
		width: 630rpx;

		.privacy-dialog-title {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-weight: 400;
			font-size: 32rpx;
			color: #333333;
			line-height: 46rpx;
			text-align: center;
			margin-bottom: 20rpx;
		}

		.privacy-dialog-text {
			// font-size: 14px;
			// color: #7a7e83;
			// margin-bottom: 10px;
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 630rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
			line-height: 48rpx;
			text-align: left;
		}

		.privacy-dialog-btns {
			display: flex;
			justify-content: space-between;
			width: 530rpx;
			flex-direction: column;
			padding-bottom: 50rpx;
		}

		.privacy-dialog-btn {
			display: inline-block;
			text-align: center;
			line-height: 76rpx;
			width: 500rpx;
			height: 76rpx;
			margin: 0 10px;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			font-size: 28rpx;
			font-weight: 500;
			margin-top: 30rpx;
		}

		.buts1 {}

		.buts2 {
			color: #FFFFFF;
		}

		.buts3 {
			color: #00BEBE;
		}

		.link {
			color: #18bc37;
			text-decoration: underline;
		}
	}

	.privacy-dialog {

		/* 居中弹窗 */
		// .privacy-dialog-popup {
		// 	position: fixed;
		// 	z-index: 99;
		// 	top: 0;
		// 	bottom: 0;
		// 	right: 0;
		// 	padding: 0;
		// 	width: 100%;
		// 	height: 100vh;
		// 	display: none;
		// 	z-index: 99999; 

		// 	&.show {
		// 		display: flex;
		// 		justify-content: center;
		// 		align-items: center;
		// 	}

		// 	.privacy-dialog-popup-mask {
		// 		position: absolute;
		// 		top: 0;
		// 		left: 0;
		// 		width: 100vw;
		// 		height: 100vh;
		// 		background-color: rgba(0, 0, 0, 0.6);
		// 	}
		// }



		.disagree-box {
			padding: 15px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.agree-btn {
				width: 325px;
				height: 40px;
				line-height: 40px;
				text-align: center;
				background-color: #18bc37;
				color: #fff;
				border-radius: 5px;
				margin-top: 10px;
			}
		}
	}
</style>