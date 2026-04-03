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
					<up-input placeholder="请输入手机号" v-model="formData.loginMobile" class="pwd-input" type="number"
						shape="circle" border="surround" maxlength="11" fontSize="16"></up-input>

					<text class="rules-text" v-if="errors.loginMobile">{{ errors.loginMobile }}</text>
					<image :src="imgUrl + 'login-wx-phone.png'" class="check_img eye-btn-left" />
				</view>

				<view class="password">
					<view class="pwd-input-wrap">
						<!-- #ifdef MP-WEIXIN -->
						<!-- 微信小程序：固定 type="text"，用 :password 控制隐藏，避免切换清空 -->
						<input class="pwd-input" type="text" :password="!showPassword" placeholder="请输入密码"
							placeholder-style="color: #C3C3C3" maxlength="16" v-model="formData.pwd" />
						<!-- #endif -->

						<!-- #ifndef MP-WEIXIN -->
						<!-- 非微信端：两套 input，用 v-show 切换，彻底避免切 type 清空 -->
						<input v-show="!showPassword" class="pwd-input" type="password" placeholder="请输入密码"
							placeholder-style="color: #C3C3C3" maxlength="16" v-model="formData.pwd" />
						<input v-show="showPassword" class="pwd-input" type="text" placeholder="请输入密码"
							placeholder-style="color: #C3C3C3" maxlength="16" v-model="formData.pwd" />
						<!-- #endif -->

						<!-- 图标事件改为 togglePwd，并阻止触摸导致失焦 -->
						<image :src="imgUrl + (showPassword ? 'eye-open.png' : 'check.png')" class="check_img eye-btn"
							@touchstart.stop.prevent="togglePwd" @click.stop.prevent="togglePwd" />
						<image :src="imgUrl + 'login-xw-mima.png'" class="check_img eye-btn-left" />
					</view>
					<text class="rules-text" v-if="errors.pwd">{{ errors.pwd }}</text>
				</view>
			</view>
			<view class="wenz-box">
				<text class="wenz-box-1" @click="cancelLogin">游客登录</text>
				<text class="wenz-box-1" @click="loginpass">忘记密码？</text>
			</view>
			<!-- 登录按钮区域 -->
			<view class="btn-group">
				<view class="login-btn" hover-class="btn-hover" @click="doSearch">登录</view>
			</view>
			<view class="login-text" @click="loginphonefun">验证码登录</view>
			<!-- #ifdef APP -->
			<view class="login-san">
				<text class="login-san-text">第三方直接登录</text>
				<view class="fl-ce-ce" style="gap: 20rpx;">
					<!-- #ifdef APP-HARMONY -->
					<image :src="imgUrl + 'login-huawei-icon.png'" :lazy-load="true" @click="weixinAppLogin('huawei')"
						class="login-san-img" />
					<!-- #endif -->
					<image :src="imgUrl + 'login-wx-icon.png'" :lazy-load="true" @click="weixinAppLogin('weixin')"
						class="login-san-img" />
					<image v-if="isIos()" :src="imgUrl + 'login-apple-icon.png'" :lazy-load="true"
						@click="weixinAppLogin('apple')" class="login-san-img" />
				</view>
			</view>
			<!-- #endif -->

			<!-- 协议及兜底按钮 -->
			<view class="agreement-box">
				<view class="agreement">
					<up-checkbox :customStyle="{ marginBottom: '4px' }" name="agree" usedAlone shape="circle" size="14"
						activeColor="#628F2F" v-model:checked="aloneChecked" @change="aloneCheckedFun">
					</up-checkbox>
					<text class="agreement-text">已阅读并同意</text>
					<text class="protocol-text" @click="openProtocol('userService')">《用户服务协议》</text>
					<text>和</text>
					<text class="protocol-text" @click="openProtocol('privacy')">《隐私政策》</text>
				</view>
				<text class="rules-text" v-if="errors.agreement"
					style="text-align: center; display: block; margin-top: 8px">
					{{ errors.agreement }}
				</text>
			</view>
		</view>
		<up-popup mode="center" bgColor="transparent" :safeAreaInsetBottom="false" :show="modelshow"
			@close="modelshow=false">
			<view style="width: 600rpx;">
				<view class="modal-container">
					<view class="modal-text">是否同意勾选《用户服务协议》和《隐私政策》</view>
					<view class="footer-btns">
						<button class="btn-cancel" @click="modelshow=false">取消</button>
						<button class="btn-submit" @click="modelconfirm" >确认</button>
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import { imgUrl } from '../../config';
	import { signInMobilePwd, getMiniUserInfo, fetchWechatInfo, getWxAppToken, appWxLogin } from '@/api/login';
	import { setToken } from '@/utils/token';
	import { ref, reactive, watch, computed, nextTick } from 'vue';
	import { debounce } from '@/utils/common';
	import { onLoad } from '@dcloudio/uni-app';
	import { useAppStore } from '@/store/modules/app';
	import { useMqttStore } from '@/store/modules/mqtt';
	import { updateUserAgreement } from '@/api/user';
	import { toNav, toBack } from '@/utils/route';
	import { isIos } from '@/utils/platform';
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
	const showPassword = ref(false);
	const aloneChecked = ref(false);
	const phoneStatus = ref<'default' | 'error' | 'success'>('default');
	const modelshow = ref(false);
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
	const loginphonefun = () : void => {
		uni.redirectTo({ url: '../login_phone/login' });
	};
	const loginpass = () : void => {
		uni.redirectTo({ url: '/pages_E/passwordSettings/forgetPassword' });
	};

	const cancelLogin = () : void => {
		uni.reLaunch({ url: '../../pages/home/home' });
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
	const modelconfirm = () => {
		modelshow.value = false
		aloneChecked.value=true
		loginfun()
	}
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

	onLoad(() => {
		let pages = getCurrentPages();
		console.log('-----------pages--------pages---------------', pages);
		console.log('-----------pages--------pages---------------', pages.length);
	});




	// [修改] 记录小程序的光标位置（与 v-model 配合使用）
	const onPwdInput = (e : any) => {
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




	const loginfun = async () => {
		
			if (!aloneChecked.value) {
				modelshow.value = true
				return
			}
		// 1. 手机号校验
		const mobileReg = /^1[3-9]\d{9}$/
		if (!formData.loginMobile) {
			uni.showToast({ title: '请输入手机号', icon: 'none' })
			return false
		}
		if (!mobileReg.test(formData.loginMobile)) {
			uni.showToast({ title: '手机号格式不正确', icon: 'none' })
			return false
		}

		// 2. 密码校验（示例：6-20位，可包含字母、数字、下划线）
		if (!formData.pwd) {
			uni.showToast({ title: '请输入密码', icon: 'none' })
			return false
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
			uni.hideLoading();
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
		uni.hideLoading();
	};

	const toWhere = async (userId : string) => {
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
		console.log('api拿到的用户数据', userInfo);
	};

	const openProtocol = (type : string) => {
		uni.navigateTo({ url: '/pages_C/xieyi/index?type=' + type });
	};
	// APP中微信登陆
	const weixinAppLogin = (provider = 'weixin') => {
		if (!aloneChecked.value) {
			errors.agreement = '请先阅读并同意用户协议和隐私政策';
			return false;
		}
		uni.showLoading({
			title: '登录中...',
			mask: true,
		});
		try {
			uni.login({
				provider: provider,
				success: async (loginRes) => {
					/* 安卓可直接拿到openid，鸿蒙需要调用接口获取 */
					console.log('------------成功-------------', loginRes);
					// #ifdef APP-HARMONY
					if (provider == 'weixin') {
						weixinAppGetUser(loginRes.code)
					}
					if (provider == 'huawei') {
						const { openid } = loginRes.authResult
						if (!openid) return uni.showToast({ title: '授权失败，请重新登录' });
						loginApp(provider, openid)
					}
					// #endif
					// #ifdef APP-PLUS
					const { openid, unionid } = loginRes.authResult
					if (!openid && !unionid) return uni.showToast({ title: '授权失败，请重新登录' });

					loginApp(provider, provider == 'weixin' ? unionid : openid)
					// #endif
				},
				fail: (err) => {
					console.log('------------失败-------------', err);
					// 登录授权失败
					// err.code是错误码
				}
			});
		} catch (err) {
			console.log('-0-0-0', err);
			uni.hideLoading();
		}
	}
	const weixinAppGetUser = async (code) => {
		try {
			const wxInfoResp : any = await getWxAppToken(code);
			console.log('9999099', wxInfoResp);
			if (wxInfoResp.statusCode == 200) {
				const { openid, unionid, access_token, refresh_token } = wxInfoResp.data
				loginApp('weixin', unionid)
			}
		} catch (err) {
			console.log('-0-0-0', err);
			uni.hideLoading();
		}

	}
	const loginApp = async (type, unionid) => {
		try {
			let data = {}
			if (type == 'weixin') {
				data.unionId = unionid
			}
			if (type == 'apple') {
				data.appleId = unionid
			}
			if (type == 'huawei') {
				data.huaweiId = unionid
			}
			console.log('9989-', data);
			if (!data.unionId && !data.appleId && !data.huaweiId) return uni.showToast({ title: '授权失败，请重新登录' });
			const authResp = await appWxLogin(data)
			console.log('8989090-', authResp);
			if (authResp.code == 0) {
				if (authResp.clazz) {
					if (authResp?.code == '0') {
						console.log('成功code', authResp);

						// 登录成功处理
						if (authResp.clazz.token) {
							uni.setStorageSync('Token', authResp.clazz.token);
							await toWhere(authResp.clazz.userid);
							await updateUserAgreement(1)
							console.log('用户信息拿到了');
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
						console.log('+++++22');
						uni.hideLoading();
						setTimeout(() => {
							throw new Error(authResp?.resultMsg || '登录失败');
						}, 500);
					}
				} else {
					toNav(`/pages_A/login_password/add_phone?${type}=${unionid}`)
				}
			}
		} catch (err) {
			console.log('-------', err);
		}
		uni.hideLoading();
	}
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
		height: 220rpx;
	}

	::v-deep .u-input {
		background: #F3F3F3;
		height: 50rpx;

	}

	.phone {
		margin-bottom: 30rpx;
		position: relative;
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

	.check_img {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.bottom-img {
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
		height: 92rpx;
		box-sizing: border-box;
	}

	::v-deep .u-input__content__field-wrapper__field {
		margin-left: 20rpx !important;
		padding-left: 58rpx !important;
	}

	.pwd-input-wrap {
		position: relative;
	}

	.pwd-input {
		width: 100%;
		height: 92rpx;
		line-height: 92rpx;
		padding: 0 96rpx 0 90rpx;
		border: 1rpx solid #e5e5e5;
		border-radius: 9999rpx;
		font-size: 32rpx;
		box-sizing: border-box;
		background-color: #F3F3F3;
	}

	.eye-btn {
		position: absolute;
		right: 24rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 30rpx;
		height: 30rpx;
	}

	.eye-btn-left {
		position: absolute;
		left: 24rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 30rpx;
		height: 30rpx;
	}

	.agreement-box {
		z-index: 99;
	}
</style>