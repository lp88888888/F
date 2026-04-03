<template>
	<!-- 这是一个用户隐私保护提示的弹窗组件 -->
	<view class="privacy-dialog">
		<up-popup :show="manShow" bgColor="transparent" mode="center" round="10">
			<view class="privacy-dialog-content">
				<view class="privacy-dialog-title">温馨提示</view>
				<view class="privacy-dialog-text">欢迎使用由陕西中交信通网络科技有限公司受托运营的“爱上高速”APP/小程序，欢迎使用！我们将通过 《<navigator style="color: #00BEBE;display: inline;" url="/pages_C/xieyi/index?type=userService">用户服务协议</navigator> 》和《<navigator style="color: #00BEBE;display: inline;" url="/pages_C/xieyi/index?type=privacy">隐私政策</navigator> 》帮助您了解我们所提供的服务以及我们收集和处理您个人信息的情况，并告知您所享有的相关权利。为向您提供更加安全、便捷、个性化的服务，我们会在您使用相关功能时申请有关设备权限，您可通过“系统权限设置”查阅并选择是否授权我们收集。</view>
				<view class="privacy-dialog-text">如您同意，请点击“同意”开始接受我们的服务。</view> 
				<view class="privacy-dialog-btns">
					<view class="privacy-dialog-btn buts1" @click="agree">同意并继续</view>
					<view class="privacy-dialog-btn buts2" @click="agree2">不同意并进入浏览模式</view>
					<view class="privacy-dialog-btn buts3" @click="quit">退出</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Props & Emits
const props = defineProps({
	tabBar: {
		type: Boolean,
		default: false
	}
})

const manShow = ref(false);
const emit = defineEmits(['agree', 'disagree'])

// 状态
const isAgree = ref(null)
const show = ref(false)
const keyName = 'uni-privacy-agree'

const quit = ()=>{
	plus.runtime.quit();
}

// 方法
function getIsAgree() {
	const value = uni.getStorageSync(keyName)
	if(!value){
		manShow.value = true
	}
}

function open() {
	manShow.value = true
}

function close() {
	show.value = false
}

const agree =() =>{
	uni.setStorageSync(keyName, true)
	manShow.value = false
}
const agree2 =() =>{
	uni.setStorageSync(keyName, false)
	manShow.value = false
}


function disagree() {
	uni.showModal({
		title: '提示',
		content: '您必须同意我们的隐私政策才能继续使用我们的产品',
		showCancel: true,
		cancelText: '不同意',
		confirmText: '同意',
		success: (res) => {
			if (res.confirm) {
				agree()
			} else {
				quit()
			}
		}
	})
}

// 初始化：读取本地存储判断是否已同意
onMounted(() => {
	getIsAgree()
})
</script>

<style lang="scss" scoped>
	.privacy-dialog-content {
		position: relative;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		padding: 48rpx 52rpx;
		box-sizing: border-box;
		width: 630rpx;
		background: linear-gradient( 180deg, #C8FFFD 0%, #FFFFFF 100%);
	
		.privacy-dialog-title {
			font-weight: 400;
			font-size: 32rpx;
			color: #333333;
			line-height: 46rpx;
			text-align: center;
		}
	
		.privacy-dialog-text {
			// font-size: 14px;
			// color: #7a7e83;
			// margin-bottom: 10px;
			
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
			line-height: 48rpx;
			text-align: left;
		}
	
		.privacy-dialog-btns {
			display: flex;
			justify-content: space-between;
			width: 100%;
			flex-direction: column;
		}
	
		.privacy-dialog-btn {
			height: 76rpx;
			margin: 0 10px;
			line-height: 76rpx;
			text-align: center;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			font-size: 28rpx;
			font-weight: 500;
			margin-top: 30rpx;
		}
		.buts1{
			background: #00BEBE;
			color: #FFFFFF;
		}
		.buts2{
			border: 2rpx solid #00BEBE;
			color: #00BEBE;
		}
		.buts3{
			color: #00BEBE;
		}
	
		.link {
			color: #18bc37;
			text-decoration: underline;
		}
	}
.privacy-dialog {
	/* 居中弹窗 */
	.privacy-dialog-popup {
		position: fixed;
		z-index: 99;
		top: 0;
		bottom: 0;
		right: 0;
		padding: 0;
		width: 100%;
		height: 100vh;
		display: none;
		z-index: 99999;

		&.show {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.privacy-dialog-popup-mask {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.6);
		}
	}

	

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