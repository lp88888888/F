<template>
	<view class="container" :data-theme="pageTheme" >
		<cos-header title='活动报名' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100"></cos-header>
		<image class="bg-img" :src="imgUrl+'new_ac_bg.png'" mode=""></image>

		<view class="content" :style="{ paddingTop: navBarHeight + 'px' }">
			<image class="title-img m-r-15" :src="imgUrl+'activity_tit.png'" mode=""></image>

			<view class="form-container">
				<!-- 姓名输入 -->
				<view class="form-item flex flex-col">
					<view class="flex ali-cen">
						<image class="icon-36 m-r-15" :src="imgUrl+'new_user.png'" mode=""></image>
						<text class="label">姓名</text>
					</view>
					<view class="input-box">
						<u-input v-model="form.name" placeholder="请输入姓名" border="none" placeholder-style="color: #999"
							class="input" />
					</view>

				</view>

				<!-- 电话输入 -->
				<view class="form-item flex flex-col">
					<view class="flex ali-cen">
						<image class="icon-36 m-r-15" :src="imgUrl+'new_phone.png'" mode=""></image>
						<text class="label">电话</text>
					</view>
					<view class="input-box">
						<u-input v-model="form.phone" maxlength="11" placeholder="请输入您的联系方式" border="none"
							placeholder-style="color: #999" class="input" />
					</view>
				</view>

				<!-- 报名按钮 -->
				<view class="submit-btn" @click="handleSubmit">
					我要报名
				</view>
			</view>

			<!-- 协议勾选 -->
			<!-- <view class="agreement">
				<image :src="imgUrl + (agree ? 'login_checked.png' : 'login_unchecked.png')" class="check_img"
					@click="agreeFun"></image>
				<text class="agreement-text">
					已阅读并同意 
					<text @click="openProtocol('user')">《个人信息保护声明》</text @click="openProtocol('privacy')">及<text>《隐私协议》</text>
				</text>
			</view> -->
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { makePhoneCall, openLocation } from '@/utils/util';
	import { imgUrl } from '@/config';
	import { postactivityApply } from '@/api/hotel';
	import CosHeader from '@/components/customNavBar/index.vue';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 布局
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref<number>(0);

	const form = reactive({
		name: '',
		phone: '',
		activityId: ''
	})
	
	const openProtocol = (type : 'user' | 'privacy') : void => {
		const urls = {
			user: '/pages/protocol/user',
			privacy: '/pages/protocol/privacy'
		};
		uni.navigateTo({ url: urls[type] });
	};

	const agree = ref(false)
	onLoad((option) => {
		form.activityId = option.id || 1

	})
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});

	const agreeFun = () => {
		agree.value = !agree.value;
	}

	const handleSubmit = () => {
		// 验证姓名
		if (!form.name.trim()) {
			uni.showToast({
				title: '请输入姓名',
				icon: 'none'
			})
			return
		}

		// 验证手机号
		if (!form.phone.trim()) {
			uni.showToast({
				title: '请输入联系方式',
				icon: 'none'
			})
			return
		}

		// 验证手机号格式
		const phoneReg = /^1[3-9]\d{9}$/
		if (!phoneReg.test(form.phone)) {
			uni.showToast({
				title: '请输入正确的手机号',
				icon: 'none'
			})
			return
		}

		// 验证协议
		// if (!agree.value) {
		// 	uni.showToast({
		// 		title: '请同意相关协议',
		// 		icon: 'none'
		// 	})
		// 	return
		// }

		let params = {
			userName:form.name,
			userPhone:form.phone,
			activityId: form.activityId
		}
		postactivityApply(params).then(res => {
			if (res.code === 200) {
				uni.showToast({
					title: '报名成功',
					icon: 'success',
					duration: 2000,
					complete: () => {
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages_D/newCar/activityApplyList'
							})
						}, 2000)
					}
				})

			}
		})
	}
</script>

<style lang="scss" scoped>
	.bg-img {
		width: 453rpx;
		height: 482rpx;
		float: right;
		z-index: 1;
	}

	.container {
		width: 100%;
		min-height: 100vh;
		background: var(--head-color);
	}

	.content {
		border-radius: 20rpx;
		z-index: 2;
		position: absolute;

		.title-img {
			width: 612rpx;
			height: 125rpx;
			margin: 90rpx 72rpx 30rpx 66rpx;
		}

		.form-container {
			width: 670rpx;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			margin: 0 40rpx;
			padding: 46rpx;
			box-sizing: border-box;
		}

		.form-item {
			display: flex;
			padding: 0 25rpx;

			.input-box {
				background: #F4F4F4;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				margin: 24rpx 0 40rpx;
				padding: 22rpx;
			}

			.icon {
				margin-right: 20rpx;
			}

			.label {
				font-weight: 500;
				font-size: 32rpx;
				color: #333333;
			}

			.input {
				flex: 1;
				font-size: 30rpx;
				color: #333;
				padding: 0;
			}
		}

		.submit-btn {
			width: 488rpx;
			height: 76rpx;
			background: var(--primary-color);
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			color: #FFFFFF;
			line-height: 76rpx;
			font-weight: 600;
			text-align: center;
			margin: 0 auto;
		}

		.agreement {
			display: flex;
			align-items: center;
			margin-top: 28rpx;
			padding: 0 40rpx;

			.agreement-text {
				font-size: 24rpx;
				color: #999;
				margin-left: 15rpx;
				line-height: 1.4;
			}

			.check_img {
				width: 30rpx;
				height: 30rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>