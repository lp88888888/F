<template>
	<view class="login-container" :data-theme="pageTheme">
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="忘记密码" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<view class="from">
			<view class="phone">
				<!-- #ifndef APP-NVUE -->
				<up-input placeholder="请输入手机号"  v-model="userMobile"  type='number' maxlength="11"  fontSize='16' shape='circle'>
				<!-- #endif -->
					<!-- #ifdef APP-NVUE -->
					<up-input placeholder="请输入手机号" v-model="userMobile" type='number' maxlength="11"  fontSize='16' shape='circle'>
					<!-- #endif -->
						<template #suffix>
							<text class="yzm" v-if="!isCounting" @click="getAuthCode">获取验证码</text>
							<text class="yzm" v-else>{{countdown }}秒后重新发送</text>
						</template>
					<!-- #ifndef APP-NVUE -->
					</up-input>
					<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				</up-input>
				<!-- #endif -->
			</view>
			<view class="password">
				<up-input placeholder="请输入验证码" type='number'  border="surround" v-model="mobileCode"
					fontSize='16' shape='circle'></up-input>
				<text class="rules-text">账号为空</text>
			</view>
			<view class="password">
				<up-input v-model="newPwd" type="text" placeholder="密码必须是8-16位英文字母、数字、字符组合" border="surround" shape='circle'
					input-align="left" maxlength='16' :style="{ fontSize: '28rpx' }" v-if="showNewPwd" >
				</up-input>
				<up-input v-model="newPwd" type="password" placeholder="密码必须是8-16位英文字母、数字、字符组合" border="surround" shape='circle'
					input-align="left" maxlength='16' :style="{ fontSize: '28rpx' }" v-else >
				</up-input>
			</view>
		</view>
		<!-- 登录按钮区域 -->
		<view class="btn-group">
			<view class="login-btn" hover-class="btn-hover" @click="doSearch">确定</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		ref
	} from 'vue';
	import {
		imgUrl
	} from '../../config';
	import {
		getloginCode, appLoginCode, getMiniUserInfo
	} from '@/api/login';
	import {
	  forgetPwd
	} from '@/api/password';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import { toNav, toBack } from '@/utils/route';
	import theme from '@/utils/theme'
	// const islogin = ref(true);
	import { debounce } from '@/utils/common'
	const aloneChecked = ref(false)
	const countdown = ref(60); // 倒计时秒数，例如60秒
	const isCounting = ref(false); // 用于控制倒计时是否在进行
	const userMobile = ref('');
	const mobileCode = ref('');
	const newPwd= ref('');
	const showNewPwd = ref(false); // 新密码可见性
	const phoneReg = /^[1][3-9]\d{9}$/;
	const startCountdown = () => {
		if (!isCounting.value) { // 确保不在倒计时中
			isCounting.value = true; // 开始倒计时
			const timer = setInterval(() => {
				if (countdown.value > 0) {
					countdown.value--; // 减少秒数
				} else {
					clearInterval(timer); // 倒计时结束，清除定时器
					isCounting.value = false; // 重置倒计时状态
					countdown.value = 60; // 可以选择重置为初始值或根据需求改变
				}
			}, 1000); // 每1000毫秒（1秒）减少一次
		}
	}
	// 获取验证码
	const getAuthCode = async () => {
		// 防止重复点击
		if (countdown.value !== 60) {
			return;
		}
		// 确定使用哪个手机号
		const mobile = userMobile.value;

		if (!mobile) {
			return uni.showToast({ title: '请输入手机号', icon: 'none' });
		}
		if (!phoneReg.test(mobile)) {
			return uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
		}
		let params = {
			mobile: mobile
		}
		const res = await getloginCode(params)
		if (res?.code == '0') {
			startCountdown();
			return uni.showToast({ title: '短信验证码发送成功', icon: 'none' });
		} else {
			return uni.showToast({ title: '验证码发送失败，请重试', icon: 'none' });
		}
	}
	//防抖
	const doSearch = debounce(() => {
		forgetPwdfun();
	}, 500);
	
	const forgetPwdfun= async () => {
		const pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;
		if (!mobileCode.value) {
			uni.showToast({
				title: '请输入验证码',
				icon: 'none',
				duration: 2000
			});
			return;
		}
		if (!pwdReg.test(newPwd.value)) {
			uni.showToast({
				title: '密码必须是8-16位英文字母、数字、字符组合',
				icon: 'none',
				duration: 2000
			});
			return;
		}
		let params = {
			loginMobile: userMobile.value,
			code:mobileCode.value,
			pwd:newPwd.value
		}
		const res = await forgetPwd(params)
		if(res.code==200){
			setTimeout(() => {
				uni.showToast({
					title: '密码设置成功',
					icon: 'success',
					duration: 500
				});
				setTimeout(() => {
					setTimeout(() => {
						uni.reLaunch({ url: '/pages_A/setting/setting' });
					}, 300);
				}, 800)
				let userInfo = uni.getStorageSync('userInfo');
				if (!userInfo || typeof userInfo !== 'object') {
				  userInfo = {}; 
				}
				userInfo.hasPwd = '1';
				uni.setStorageSync('userInfo', userInfo);
			}, 1500);
		}else{
			uni.showToast({
				title: res.msg,
				icon: 'error',
				duration: 500
			});
		}
	}
</script> 

<style scoped lang="scss">
/* 页面整体容器 */
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* 可根据实际需求调整背景色 */
		padding: 0 20rpx;
	}
	/* 按钮组样式 */
	.btn-group {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 20rpx;
		z-index: 99;
		position: fixed;
		bottom: 400rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	/* 通用按钮 hover 效果 */
	.btn-hover {
		opacity: 0.8;
	}

	/* 手机号一键登录按钮 */
	.login-btn,
	.other-login-btn {
		width: 620rpx;
		height: 88rpx;
		font-size: 30rpx;
		border-radius: 40rpx;
		height: 80rpx;
		line-height: 88rpx;
		margin: 0 auto 40rpx;
		text-align: center;
	}

	.login-btn {
		background: var(--but-color-line);
		color: #fff;
	}

	/* 其他手机号登录按钮 */
	.other-login-btn {
		background: #FFFFFF;
		color: $color;
	}

	/* 密码登录按钮 */
	.pwd-login-btn {
		color: #333333;
		font-size: 26rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin-bottom: 40rpx;
		text-align: center;
	}

	/* 协议区域样式 */
	.agreement {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 30rpx;
	}

	/* 协议复选框样式，可根据需求自定义或使用 uni-app 内置 checkbox 样式调整 */
	.agreement-checkbox {
		transform: scale(0.8);
		margin-right: 10rpx;
	}

	/* 协议文字样式 */
	.agreement-text {
		margin-right: 10rpx;
	}

	/* 协议链接文字样式 */
	.protocol-text {
		color: $color;
		margin: 0 5rpx;
	}

	/* 暂不登录按钮样式 */
	.cancel-login-btn {
		color: #999;
		font-size: 26rpx;
		text-align: center;
	}

	.from {
		width: 100%;
		padding: 0 40rpx;
		box-sizing: border-box;
		margin-top: 80rpx;
	}

	::v-deep .u-input {
		background: #FFFFFF;
		border: none;
		height: 60rpx;

	}

	.phone {
		margin-bottom: 30rpx;
		border: 1px solid #eee;
		border-radius: 20rpx;
	}

	.password {
		margin-bottom:30rpx;
		border: 1px solid #eee;
		border-radius: 20rpx;
	}

	.rules-text {
		font-size: 22rpx;
		margin-left: 30rpx;
		color: $color;
		display: none;
	}
	.yzm{
		color: $color;
		font-size: 26rpx;
	}
	.phone_bh{
		color: #333333;
		font-size: 28rpx;
	}
	.phone_hg{
		color: #E7E7E7;
		margin:0 10rpx;
	}
	.bottom-img{
		width: 100%;
		position: fixed;
		bottom: 0;
		height: 300rpx;
	}
</style>