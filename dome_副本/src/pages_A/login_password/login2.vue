<template>
	<view class="login-container" :data-theme="pageTheme" >
		<!-- 顶部应用展示区域 -->
		<view class="app-show">
			<image :src="imgUrl + 'login_icon.png'" class="img"></image>
		</view>

		<view class="from">
			<view class="phone">
				<up-input
					placeholder="请输入手机号"
					v-model="formData.loginMobile"
					type="number"
					shape="circle"
					border="surround"
					maxlength="11"
					fontSize="16"
					:customStyle="phoneInputStyle"
					@focus="onPhoneInput"
					@blur="validatePhone"
				></up-input>
				<text class="rules-text" v-if="errors.loginMobile">{{ errors.loginMobile }}</text>
			</view>

			<view class="password">
				<view class="pwd-input-wrap">
					<!-- #ifdef MP-WEIXIN -->
					<!-- 微信小程序：固定 type="text"，用 :password 控制隐藏，避免切换清空 -->
					<input
						class="pwd-input"
						type="text"
						:password="!showPassword"
						placeholder="请输入密码"
						placeholder-style="color: #C3C3C3"
						maxlength="16"
						v-model="formData.pwd"
						:focus="keepFocus"
						:selection-start="cursorPos"
						:selection-end="cursorPos"
						@input="onPwdInput"
						@blur="validatePassword"
					/>
					<!-- #endif -->

					<!-- #ifndef MP-WEIXIN -->
					<!-- 非微信端：两套 input，用 v-show 切换，彻底避免切 type 清空 -->
					<input
						v-show="!showPassword"
						class="pwd-input"
						type="password"
						placeholder="请输入密码"
						placeholder-style="color: #C3C3C3"
						maxlength="16"
						v-model="formData.pwd"
						@blur="validatePassword"
					/>
					<input
						v-show="showPassword"
						class="pwd-input"
						type="text"
						placeholder="请输入密码"
						placeholder-style="color: #C3C3C3"
						maxlength="16"
						v-model="formData.pwd"
						@blur="validatePassword"
					/>
					<!-- #endif -->

					<!-- 图标事件改为 togglePwd，并阻止触摸导致失焦 -->
					<image
						:src="imgUrl + (showPassword ? 'eye-open.png' : 'check.png')"
						class="check_img eye-btn"
						@touchstart.stop.prevent="togglePwd"
						@click.stop.prevent="togglePwd"
					/>
				</view>
				<text class="rules-text" v-if="errors.pwd">{{ errors.pwd }}</text>
			</view>
		</view>

		<!-- 登录按钮区域 -->
		<view class="btn-group">
			<view class="login-btn" hover-class="btn-hover" @click="doSearch">登录</view>
		</view>

		<!-- 协议及兜底按钮 -->
		<view class="agreement-box">
			<view class="agreement">
				<up-checkbox
					:customStyle="{ marginBottom: '4px' }"
					name="agree"
					usedAlone
					shape="circle"
					size="14"
					activeColor="#069FA4"
					v-model:checked="aloneChecked"
					@change="aloneCheckedFun"
				>
				</up-checkbox>
				<text class="agreement-text">已阅读并同意</text>
				<text class="protocol-text" @click="openProtocol('userService')">《用户服务协议》</text>
				<text class="protocol-text" @click="openProtocol('privacy')">《隐私政策》</text>
			</view>
			<text class="rules-text" v-if="errors.agreement" style="text-align: center; display: block; margin-top: 8px">
				{{ errors.agreement }}
			</text>
		</view>

		<image :src="imgUrl + 'logo_bottom.png'" class="bottom-img"></image>
	</view>
</template>

<script setup lang="ts">
import { imgUrl } from '../../config';
import { signInMobilePwd, getMiniUserInfo } from '@/api/login';
import { setToken } from '@/utils/token';
import { ref, reactive, watch, computed, nextTick } from 'vue';
import { debounce } from '@/utils/common';
import { onLoad } from '@dcloudio/uni-app';
import { useAppStore } from '@/store/modules/app';
import { useMqttStore } from '@/store/modules/mqtt';
import { updateUserAgreement }from '@/api/user';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
const mqttStore = useMqttStore();
const appStore = useAppStore();
const showPassword = ref(false);
const aloneChecked = ref(false);
const phoneStatus = ref<'default' | 'error' | 'success'>('default');

// 小程序端稳焦点/光标
const keepFocus = ref(false);
const cursorPos = ref(0);
//防抖
const doSearch = debounce(() => {
	loginfun();
}, 500);
// 原逻辑保持
const aloneCheckedFun = () => {
	aloneChecked.value = !aloneChecked.value;
	if (aloneChecked.value) {
		errors.agreement = '';
	}
};

// 用 togglePwd 替代原 checkFun，且不切 type（MP 用 :password）
const togglePwd = () => {
	const len = formData.pwd ? formData.pwd.length : 0;
	showPassword.value = !showPassword.value;

	// 仅 MP-Weixin 有效：保持焦点并恢复光标
	keepFocus.value = true;
	nextTick(() => {
		cursorPos.value = len;
	});
};

const formData = reactive({
	loginMobile: '',
	pwd: '',
	loginType: 7,
	signType: 1,
});

const errors = reactive({
	loginMobile: '',
	pwd: '',
	agreement: '',
});

// 计算边框样式类
const phoneInputStyle = computed(() => {
	let borderColor = '#e5e5e5 !important';

	switch (phoneStatus.value) {
		case 'error':
			borderColor = '#ff5500 !important';
			break;
		case 'success':
			borderColor = '#07c160 !important';
			break;
		default:
			borderColor = '#e5e5e5 !important';
	}

	return {
		borderColor: borderColor,
	};
});

// 监听手机号输入变化
watch(
	() => formData.loginMobile,
	(newVal) => {
		if (newVal.length === 0) {
			errors.loginMobile = '';
			phoneStatus.value = 'default';
			return;
		}
		const phoneRegex = /^1[3-9]\d{0,9}$/; // 允许输入部分号码

		if (!phoneRegex.test(newVal)) {
			errors.loginMobile = '手机号格式不正确';
			phoneStatus.value = 'error';
			return;
		}

		if (newVal.length === 11) {
			const fullPhoneRegex = /^1[3-9]\d{9}$/;
			if (fullPhoneRegex.test(newVal)) {
				errors.loginMobile = '';
				phoneStatus.value = 'success';
			} else {
				errors.loginMobile = '请输入有效的手机号';
				phoneStatus.value = 'error';
			}
		} else {
			errors.loginMobile = '';
			phoneStatus.value = 'default';
		}
	}
);
onLoad(() => {
	let pages = getCurrentPages();
	console.log('-----------pages--------pages---------------', pages);
	console.log('-----------pages--------pages---------------', pages.length);
});
// 手机号输入时处理（按你原逻辑保留）
const onPhoneInput = (e: any) => {
	formData.loginMobile = (typeof e === 'string' ? e : '')?.replace(/[^\d]/g, '');
};

// 验证手机号格式
const validatePhone = () => {
	if (!formData.loginMobile) {
		errors.loginMobile = '请输入手机号';
		phoneStatus.value = 'error';
		return false;
	}
	const phoneRegex = /^1[3-9]\d{9}$/;
	if (!phoneRegex.test(formData.loginMobile)) {
		errors.loginMobile = '请输入有效的手机号';
		phoneStatus.value = 'error';
		return false;
	}
	errors.loginMobile = '';
	phoneStatus.value = 'success';
	return true;
};

// 验证密码
const validatePassword = () => {
	if (!formData.pwd) {
		errors.pwd = '请输入密码';
		return false;
	}
	// if (formData.pwd.length < 8 || formData.pwd.length > 16) {
	//   errors.pwd = '密码必须是8-16位英文字母、数字、字符组合';
	//   return false;
	// }
	errors.pwd = '';
	return true;
};

// [修改] 记录小程序的光标位置（与 v-model 配合使用）
const onPwdInput = (e: any) => {
	cursorPos.value = e?.detail?.cursor ?? (formData.pwd?.length || 0);
};

// 验证协议是否勾选
const validateAgreement = () => {
	if (!aloneChecked.value) {
		errors.agreement = '请先阅读并同意用户协议和隐私政策';
		return false;
	}
	errors.agreement = '';
	return true;
};

// 验证单个字段
const validateField = (field: string) => {
	if (field === 'loginMobile') {
		validatePhone();
	} else if (field === 'pwd') {
		validatePassword();
	}
};

// 执行全部验证
const validateForm = () => {
	const isPhoneValid = validatePhone();
	const isPasswordValid = validatePassword();
	const isAgreementValid = validateAgreement();
	return isPhoneValid && isPasswordValid && isAgreementValid;
};

const loginfun = async () => {
	if (!validateForm()) {
		return;
	}
	uni.showLoading({
		title: '登录中...',
		mask: true,
	});
	const params = {
		loginMobile: formData.loginMobile,
		pwd: formData.pwd,
		loginType: 7,
		signType: 1,
	};
	const authResp = await signInMobilePwd(params);
	if (authResp?.code == '0') {
		
		if (authResp.clazz.memberStatus == 1) {
			uni.setStorageSync('wxOauthDate', authResp.clazz.unifiedOauthDate);
			setToken(authResp.clazz.unifiedOauthDate.access_token);
			uni.setStorageSync('token', authResp.clazz.unifiedOauthDate.access_token);
			await toWhere(authResp.clazz.memberId);
			await updateUserAgreement(1)
			console.log('用户信息拿到了');
		} else {
			uni.showToast({ title: '用户被禁用，请联系管理员' });
		}
		uni.showToast({ title: '登录成功', icon: 'success' });
		mqttStore.initMqtt();
		uni.setStorageSync('mytaskstatus', 1);
		setTimeout(() => {
			// uni.navigateTo({ url: '/pages/home/home' });
			let pages = getCurrentPages();
			console.log('-----------pages--------pages---------------', pages.length);
			if (pages.length > 2) {
				uni.navigateBack({
					delta: 2,
					success: (res) => {
						console.log('-------------------res-->>>>>>>>>>>>>>', res);
					},
					fail: (err) => {
						console.log('--------------------->>>>>>>>>>>>>>', err);
						uni.reLaunch({
							url: '/pages/home/home',
						});
					},
				});
			} else {
				uni.reLaunch({
					url: '/pages/home/home',
				});
			}
		}, 300);
	} else {
		console.log('+++++22');
		uni.hideLoading();
		setTimeout(() => {
			throw new Error(authResp?.resultMsg || '登录失败');
			}, 500);
	}
};

const toWhere = async (userId: string) => {
	uni.showLoading({
		title: '请求中...',
		mask: true,
	});
	const userInfo = await getMiniUserInfo();
	uni.setStorageSync('userInfo', userInfo.clazz);
	appStore.initUserInfo();
	console.log('api拿到的用户数据', userInfo);
};

const openProtocol = (type: string) => {
	const urls = {
		user: '/pages/protocol/user',
		privacy: '/pages_C/xieyi/privacy',
	};
	uni.navigateTo({ url: '/pages_C/xieyi/index?type=' + type });
};
</script>

<style scoped lang="scss">
@import './login.scss';
	/* 页面整体容器 */
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #F1EFEC;
		/* 可根据实际需求调整背景色 */
		padding: 0 20rpx;
	}

	/* 应用展示区域布局 */
	.img {
		width: 200rpx;
		height: 200rpx;
		margin: -280rpx 0 80rpx;
	}

	/* 手机图片样式，作为背景承载应用图标等 */
	.phone-img {
		width: 100%;
		height: 100%;
	}

	/* 应用图标，可调整位置等 */
	.app-icon {
		position: absolute;
		top: 80rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 120rpx;
		height: 120rpx;
	}

	/* 城市建筑等背景图，可调整位置、大小等 */
	.city-img {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 300rpx;
		height: 200rpx;
	}

	/* 按钮组样式 */
	.btn-group {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 20rpx;
		z-index: 99;
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
		background: var( --but-color-line);
		color: #fff;
	}

	/* 其他手机号登录按钮 */
	.other-login-btn {
		background: #FFFFFF;
		color:var(--primary-color);
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
		color: var(--primary-color);
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
	}

	::v-deep .u-input {
		background: #FFFFFF;
		height: 50rpx;

	}

	.phone {
		margin-bottom: 30rpx;
	}

	.password {
		margin-bottom: 80rpx;
	}

	.rules-text {
		font-size: 22rpx;
		margin-left: 30rpx;
		color: var(--primary-color);
		display: none;
	}
	.check_img{
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}
	.bottom-img{
		width: 100%;
		position: fixed;
		bottom: 0;
	}
	.rules-text {
	  color: #FD4848;
	  font-size: 12px;
	  margin-top: 4px;
	  display: block;
	}
/* 手机号输入框边框样式 */
	.phone-input-default ::v-deep .u-border {
		border-color: #e5e5e5 !important;
	}
	
	.phone-input-error ::v-deep .u-border {
		border-color: #ff5500 !important;
	}
	
	.phone-input-success ::v-deep .u-border {
		border-color: #07c160 !important;
	}
::v-deep .u-input {
	height: 88rpx;
	box-sizing: border-box;
}

::v-deep .u-input__content__field-wrapper__field {
	margin-left: 20rpx !important;
}

.pwd-input-wrap {
	position: relative;
}

.pwd-input {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	padding: 0 96rpx 0 32rpx;
	border: 1rpx solid #e5e5e5;
	border-radius: 9999rpx;
	font-size: 32rpx;
	box-sizing: border-box;
	background-color: #fff;
}

.eye-btn {
	position: absolute;
	right: 24rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 30rpx;
	height: 30rpx;
}

.agreement-box {
	position: fixed;
	bottom: 20%;
	z-index: 99;
}
</style>
