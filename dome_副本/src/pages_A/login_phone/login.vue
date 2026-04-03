<template>
	<view class="login-container-1" :data-theme="pageTheme">
		<!-- 顶部应用展示区域 -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="" bgColor="transparent" @leftClick="toBack" :titleStyle="{fontWeight: 'bold'}"
					placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<image :src="imgUrl + 'login-hou--bj.png'" class="img"></image>
		<image :src="imgUrl + 'loginbeiji-left.png'" class="img-1"></image>
		<view class="box-conter" :style="{
		  backgroundImage: `url(${imgUrl}weit-bj.png)`,
		  backgroundSize: 'cover',
		  backgroundPosition: 'center',
		  backgroundRepeat: 'no-repeat',
		}">
			<view class="from">
				<view class="phone">
					<!-- #ifndef APP-NVUE -->
					<up-input placeholder="请输入手机号" v-model="userMobile" inputType="number" maxlength="11" shape="circle"
						fontSize="16">
					<!-- #endif -->
						<!-- #ifdef APP-NVUE -->
						<up-input placeholder="请输入手机号" v-model="userMobile" inputType="number" maxlength="11"
							shape="circle" fontSize="16">
						<!-- #endif -->
							<template #prefix>
								<image :src="imgUrl + 'login-wx-phone.png'" class="check_img" />
							</template>
						<!-- #ifndef APP-NVUE -->
						</up-input>
						<!-- #endif -->
					<!-- #ifdef APP-NVUE -->
					</up-input>
					<!-- #endif -->
				</view>
				<view class="password">
					<up-input placeholder="请输入验证码" type="number" shape="circle" border="surround" v-model="mobileCode"
						fontSize="16" maxlength="6">
						<template #prefix>
							<image :src="imgUrl + 'login-xw-mima.png'" class="check_img" />
						</template>
						<template #suffix>
							<text class="yzm" v-if="!isCounting" @click="getAuthCodeDebounced">获取验证码</text>
							<text class="yzm" v-else>{{ countdown }}秒后重新发送</text>
						</template></up-input>
					<text class="rules-text">账号为空</text>
				</view>
			</view>
			<!-- #ifdef APP -->
			<view class="wenz-box">
				<text class="wenz-box-1" @click="cancelLogin">游客登录</text>
				<text class="wenz-box-1"></text>
			</view>
			<!-- #endif -->

			<!-- 登录按钮区域 -->

			<!-- #ifdef APP -->
			<view class="btn-group">
				<view class="login-btn" hover-class="btn-hover" @click="doSearch">登录</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="btn-group" style="margin-top: 180rpx;">
				<view class="login-btn" hover-class="btn-hover" @click="doSearch">登录</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="login-text" @click="loginwx">手机号码一键登录</view>
			<!-- #endif -->
			<!-- #ifdef APP -->
			<view class="login-text" @click="loginpasswordfun">密码登录</view>
			<!-- #endif -->
			<!-- #ifdef APP -->
			<!-- <view class="login-san">
				<text class="login-san-text">第三方直接登录</text>
				<image :src="imgUrl + 'login-wx-icon.png'" class="login-san-img" />
			</view> -->
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="login-san" @click="cancelLogin">
				<text class="login-san-text" @click="loginpass">游客登录</text>

			</view>
			<!-- #endif -->
			<!-- 协议及兜底按钮 -->
			<view class="agreement-box">
				<view class="agreement">
					<up-checkbox :customStyle="{ marginBottom: '4px' }" name="agree" usedAlone shape="circle" size="14"
						activeColor="#628F2F" v-model:checked="aloneChecked" @change="chengaloneChecked">
					</up-checkbox>
					<text class="agreement-text">已阅读并同意</text>
					<text class="protocol-text" @click="openProtocol('userService')">《用户服务协议》</text>和
					<text class="protocol-text" @click="openProtocol('privacy')">《隐私政策》</text>
				</view>
			</view>
		</view>
		<up-popup mode="center" bgColor="transparent" :safeAreaInsetBottom="false" :show="modelshow"
			@close="modelshow=false">
			<view style="width: 600rpx;">
				<view class="modal-container">
					<view class="modal-text">是否同意勾选《用户服务协议》和《隐私政策》</view>
					<view class="footer-btns">
						<button class="btn-cancel" @click="modelshow=false">取消</button>
						<button class="btn-submit" @click="modelconfirm">确认</button>
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { imgUrl } from '../../config';
	import theme from '@/utils/theme';
	import { onLoad } from '@dcloudio/uni-app';
	import { getloginCode, appLoginCode, getMiniUserInfo, bindThirdAccount } from '@/api/login';
	import { setToken } from '@/utils/token';
	// const islogin = ref(true);
	import { debounce } from '@/utils/common';
	import { useAppStore } from '@/store/modules/app';
	import { useMqttStore } from '@/store/modules/mqtt';
	import { updateUserAgreement } from '@/api/user';
	import { toNav, toBack } from '@/utils/route';
	// #ifndef MP-WEIXIN
	import { jpushService } from '@/utils/jpush';
	// #endif
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const mqttStore = useMqttStore();
	const appStore = useAppStore();
	const aloneChecked = ref(false);
	const countdown = ref(60); // 倒计时秒数，例如60秒
	const isCounting = ref(false); // 用于控制倒计时是否在进行
	const modelshow = ref(false);
	const userMobile = ref('');
	const mobileCode = ref('');
	const phoneReg = /^[1][3-9]\d{9}$/;
	const sendingCode = ref(false);
	const startCountdown = () => {
		if (!isCounting.value) {
			// 确保不在倒计时中
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
	};
	// 选中协议
	const chengaloneChecked = () => {
		if (aloneChecked.value) {
			aloneChecked.value = false;
		} else {
			aloneChecked.value = true;
		}
	};
	const loginpasswordfun = () : void => {
		uni.redirectTo({ url: '../login_password/login' });
	};
	const cancelLogin = () : void => {
		uni.reLaunch({ url: '../../pages/home/home' });
	};
	const loginwx = () : void => {
		uni.redirectTo({ url: '../login/login' });
	};
	// 获取验证码
	const getAuthCode = async () => {
		// 倒计时中或已发起请求，直接拦截
		if (isCounting.value || sendingCode.value) return;

		// 防止重复点击：你原来用 countdown !== 60，这里也可以保留
		if (countdown.value !== 60) return;

		const mobile = userMobile.value;
		if (!mobile) {
			return uni.showToast({ title: '请输入手机号', icon: 'none' });
		}
		if (!phoneReg.test(mobile)) {
			return uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
		}

		sendingCode.value = true;
		try {
			const res = await getloginCode({ mobile });
			if (res?.code === '0') {
				startCountdown();
				uni.showToast({ title: '短信验证码发送成功', icon: 'none' });
			} else {
				uni.showToast({ title: '验证码发送失败，请重试', icon: 'none' });
			}
		} catch (e) {

		} finally {
			sendingCode.value = false;
		}
	};

	// 防抖包装：300ms 内多次点击只触发一次
	const getAuthCodeDebounced = debounce(() => {
		getAuthCode();
	}, 300);
	//防抖
	const doSearch = debounce(() => {
		loginfun();
	}, 200);
	const modelconfirm = () => {
		modelshow.value = false
		aloneChecked.value = true
		doSearch()
	}
	const loginfun = async () => {
		// if (!islogin.value) {
		// 	return uni.showToast({ title: '请勿重复提交', icon: 'none' });
		// }
		const mobileReg = /^1[3-9]\d{9}$/
		if (!aloneChecked.value) {
			modelshow.value = true
			return
		}
		if (!userMobile.value) {
			return uni.showToast({ title: '请输入手机号', icon: 'none' });
		}
		if (!mobileReg.test(userMobile.value)) {
			uni.showToast({ title: '手机号格式不正确', icon: 'none' })
			return false
		}
		if (!mobileCode.value) {
			return uni.showToast({ title: '请输入验证码', icon: 'none' });
		}
		let loadingShown = false;
		// 显示加载中
		uni.showLoading({
			title: '登录中...',
			mask: true,
		});
		loadingShown = true;
		const params = {
			loginMobile: userMobile.value,
			verCode: mobileCode.value,
			loginType: 5,
		};
		const authResp = await appLoginCode(params);
		if (authResp?.code == '0') {
			console.log('成功code', authResp);

			// 登录成功处理
			if (authResp.clazz.token) {
				uni.setStorageSync('Token', authResp.clazz.token);
				await toWhere(authResp.clazz.userid);
				await updateUserAgreement(1)
				console.log('用户信息拿到了');
				// bdOpenId()
			} else {
				uni.showToast({ title: '用户被禁用，请联系管理员' });
			}
			uni.hideLoading();
			uni.showToast({ title: '登录成功', icon: 'success' });
			console.log('登录成功', authResp.clazz.appOauthDate);
			uni.setStorageSync('mytaskstatus', 1);

			mqttStore.initMqtt();
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
			uni.hideLoading();
			console.log('shibaicode');
			throw new Error(authResp?.resultMsg || '登录失败');
		}
	};
	const toWhere = async (userId : String) => {
		uni.showLoading({
			title: '请求中...',
			mask: true,
		});
		const userInfo = await getMiniUserInfo();
		uni.setStorageSync('userInfo', userInfo.clazz);
		appStore.initUserInfo();
		// #ifndef MP-WEIXIN
		jpushService.setAlias(userInfo.clazz.id * 1, userInfo.clazz.id)
		// #endif
		console.log('用户信息', userInfo.clazz);
	};
	const openProtocol = (type : 'userService' | 'privacy') : void => {
		uni.navigateTo({ url: '/pages_C/xieyi/index?type=' + type });
	};
	const unionId = ref('');
	const appleId = ref('');
	const bdOpenId = async () => {
		try {
			let data = {
				phone: userMobile.value,
			}
			if (unionId.value) {
				data.unionId = unionId.value
			}
			if (appleId.value) {
				data.appleId = appleId.value
			}
			console.log('-------dats---------', data);
			const res = await bindThirdAccount(data)
			console.log('-------绑定成功---------', res);
		} catch (err) {
			console.log('-0-0-0-00---0,err'.err);
		}
	}
	onLoad((opticon) => {
		console.log('-------opticonopticon---------', opticon);
		if (opticon.weixin) unionId.value = opticon.weixin
		if (opticon.apple) appleId.value = opticon.apple
	})
</script>

<style scoped lang="scss">
	.modal-container {
		width: 600rpx;
		background: linear-gradient(0deg, #FCFFFC 70%, #D8F7DE 100%);
		border-radius: 24rpx;
		padding: 60rpx 40rpx 40rpx;
		box-sizing: border-box;
	}

	.modal-title {
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 20rpx;
	}

	.modal-text {
		font-size: 28rpx;
		font-weight: 350;
		line-height: 48rpx;
		text-align: center;
		color: #333333;
		margin-bottom: 20rpx;
	}

	.footer-btns {
		display: flex;
		justify-content: space-between;
		gap: 30rpx;
	}

	.btn-cancel {
		flex: 1;
		height: 90rpx;
		line-height: 90rpx;
		background-color: transparent;
		border: 2rpx solid #7ab34d;
		color: #7ab34d;
		border-radius: 50rpx;
		font-size: 32rpx;
	}

	.btn-submit {
		flex: 1;
		height: 90rpx;
		line-height: 90rpx;
		background: linear-gradient(90deg, #80A653 4%, #B2D38A 92%);
		color: #ffffff;
		border-radius: 50rpx;
		font-size: 32rpx;
		border: none;

		&::after {
			border: none;
		}
	}

	// @import './login.scss';
	.wenz-box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 32rpx;
		padding-bottom: 112rpx;
	}

	.login-text {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 38rpx;
		margin-bottom: 140rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.login-san {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 80rpx;
	}

	.login-san-text {
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
	}

	.login-san-img {
		width: 80rpx;
		height: 80rpx;
		margin-top: 12rpx;
	}

	.wenz-box-1 {
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
		line-height: 24rpx;
	}

	// @import './login.scss';
	.box-conter {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 140rpx 58rpx 122rpx;
		margin-top: 258rpx;
		z-index: 99;
		width: 100vw;
		height: 1224rpx;
		box-sizing: border-box;
	}

	.img {
		width: 594rpx;
		height: 298rpx;
		z-index: 999;
		position: fixed;
		top: 182rpx;
		left: 48rpx;
	}

	.img-1 {
		width: 162rpx;
		height: 162rpx;
		z-index: 9;
		position: fixed;
		top: 328rpx;
		right: 0rpx;
	}

	/* 页面整体容器 */
	.login-container-1 {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: linear-gradient(360deg, #FCFFFC 0%, #D8F7DE 100%);
		/* 可根据实际需求调整背景色 */

	}

	.check_img {
		width: 30rpx;
		height: 30rpx;
		margin-left: 10rpx;
		margin-top: 5rpx;
		padding-right: 10rpx;
	}


	.agreement-box {
		z-index: 99;
	}

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
		background: linear-gradient(270deg, #80A653 0%, #B2D38A 100%);
		color: #fff;
	}

	/* 其他手机号登录按钮 */
	.other-login-btn {
		background: #FFFFFF;
		color: #80A653;
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
		color: #80A653;
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
		box-sizing: border-box;
		height: 230rpx;
	}

	::v-deep .u-input {
		background: #F3F3F3;
		border: none;
		height: 70rpx;
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
		color: #80A653;
		display: none;
	}

	.yzm {
		color: #80A653;
		font-size: 26rpx;
	}

	.phone_bh {
		color: #333333;
		font-size: 28rpx;
	}

	.phone_hg {
		color: #E7E7E7;
		margin: 0 10rpx;
	}

	.bottom-img {
		width: 100%;
		position: fixed;
		bottom: 0;
		height: 300rpx;
	}
</style>