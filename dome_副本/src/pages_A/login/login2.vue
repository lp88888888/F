<template>
	<view class="login-container" :data-theme="pageTheme">
		<!-- <u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="登录" bgColor="transparent" @leftClick="toBack" :titleStyle="{fontWeight: 'bold'}"
					placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky> -->
		<!-- 顶部应用展示区域 -->
		<image :src="imgUrl + 'login_1.jpg'" class="img"></image>
		<!-- 登录按钮区域 -->
		<view class="btn-group">
			<!-- #ifdef MP-WEIXIN -->
			<view>
				<!-- 一键获取手机号 -->
				<button v-if="aloneChecked" class="login-btn" hover-class="btn-hover" open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber">
					手机号一键登录
				</button>
				<view v-else @click="getPhoneNumber" class="login-btn">手机号一键登录</view>
			</view>
			<!-- #endif -->

			<view class="other-login-btn" hover-class="btn-hover" @click="loginphonefun">手机号码登录</view>
			<view class="pwd-login-btn" hover-class="btn-hover" @click="loginpasswordfun">密码登录</view>
		</view>

		<!-- 协议及兜底按钮 -->
		<view class="agreement-box">
			<view class="agreement">
				<up-checkbox :customStyle="{ marginBottom: '4px' }" name="agree" usedAlone shape="circle" size="14"
					activeColor="#069FA4" v-model:checked="aloneChecked" @change="aloneCheckedFun">
				</up-checkbox>
				<text class="agreement-text">已阅读并同意</text>
				<text class="protocol-text" @click="openProtocol('userService')">《用户服务协议》</text>
				<text class="protocol-text" @click="openProtocol('privacy')">《隐私政策》</text>
			</view>
			<view class="cancel-login-btn" hover-class="btn-hover" @click="cancelLogin">暂不登录</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { imgUrl } from '../../config';
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { setToken } from '@/utils/token';
	import { fetchWechatInfo, fetchWechatInfoAuthorization, getMiniUserInfo } from '@/api/login';
	import { updateUserAgreement } from '@/api/user';
	import { getgetUserPhoneNumber } from '@/api/member';
	import { useAppStore } from '@/store/modules/app';
	import { useMqttStore } from '@/store/modules/mqtt';
	import { toNav, toBack } from '@/utils/route';
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
	const inviterPhone = ref('');
	const inviterChannel = ref('');
	const inviterPromotionType = ref('');
	const channelCodeId = ref('');
	const isApp = ref('');
	onLoad(() => {
		const systemInfo = uni.getSystemInfoSync();
		isApp.value = ['mp-weixin', 'mp-alipa'].includes(systemInfo.platform);
		// #ifdef MP-WEIXIN
		uni.login({
			provider: 'weixin',
			success: (res) => {
				console.log('微信登录code', res.code);
			},
			fail: (e) => {
				console.log('微信登录失败', e);
				console.warn('[onLoad] wx.login fail', e);
			},
		});
		// #endif
	});
	const aloneCheckedFun = () => {
		aloneChecked.value = !aloneChecked.value;
	};
	// 一键获取手机号
	const getPhoneNumber = async (e : any) => {
		if (!aloneChecked.value) {
			return uni.showToast({ title: '请先阅读并同意用户协议和隐私政策', icon: 'none' });
		}
		if (!e.detail) {
			return uni.showToast({ title: '获取信息失败，请重试', icon: 'none' });
		}
		try {
			// 用户拒绝授权
			if (!e.detail?.code) {
				console.log('用户取消授权');
				uni.showToast({ title: '已取消手机号授权', icon: 'none' });
				return;
			}

			const phoneCode = e.detail.code;
			let loadingShown = false;

			try {
				// 显示加载中
				uni.showLoading({
					title: '登录中...',
					mask: true,
				});
				loadingShown = true;

				// 1. 获取微信登录code
				const wxCode = await getWxLoginCode();
				console.log('获取到的wxCode', wxCode);

				// 2. 用code换取openid/session_key
				const wxInfoResp : any = await fetchWechatInfo({ code: wxCode });
				console.log('微信信息响应', wxInfoResp);

				if (wxInfoResp?.code != 0 || !wxInfoResp?.clazz?.openid) {
					throw new Error(wxInfoResp?.msg || '获取微信用户标识失败');
				}

				const { openid, session_key, unionid } = wxInfoResp.clazz || {};

				// 3. 准备请求参数
				const params = {
					code: phoneCode,
					openid,
					unionid,
					inviterPhone: inviterPhone.value || undefined,
					isActivity: inviterChannel.value || undefined,
					promotionType: inviterPromotionType.value || undefined,
					channelCodeId: channelCodeId.value || undefined,
				};
				console.log('请求参数', params);

				// 4. 调用登录接口
				// const res = await getgetUserPhoneNumber({ code: phoneCode, openid });
				// uni.setStorageSync('myphone', res.clazz);
				const authResp : any = await fetchWechatInfoAuthorization(params);
				console.log('登录响应', authResp);

				if (authResp?.code == '0') {

					mqttStore.initMqtt();
					console.log('成功code');
					// 登录成功处理
					if (authResp.clazz.status == 1) {
						uni.setStorageSync('wxOauthDate', authResp.clazz.wxOauthDate);
						setToken(authResp.clazz.wxOauthDate.token);
						uni.setStorageSync('Token', authResp.clazz.wxOauthDate.token);
						await toWhere(authResp.clazz.memberId);
						await updateUserAgreement(1)
						console.log('wxOauthDate已存储', authResp.clazz.wxOauthDate);
					} else {
						uni.showToast({ title: '用户被禁用，请联系管理员' });
					}
					uni.showToast({ title: '登录成功', icon: 'success' });
					console.log('登录成功', authResp.clazz.wxOauthDate);
					uni.setStorageSync('mytaskstatus', 1);
					setTimeout(() => {
						// uni.navigateTo({ url: '/pages/home/home' });
						let pages = getCurrentPages();
						console.log('-----------pages--------pages---------------', pages.length);
						if (pages.length > 1) {
							uni.navigateBack({
								delta: 1,
								success: (res) => { },
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
						// uni.navigateBack({
						// 	  delta:1,
						// 	  fail: (err) => {
						// 		uni.reLaunch({
						// 			url:"/pages/home/home"
						// 		})
						// 	  }
						// })
					}, 300);
				} else {
					throw new Error(authResp?.msg || '登录失败');
				}
			} finally {
				if (loadingShown) {
					uni.hideLoading();
				}
			}
		} catch (err : any) {
			console.log('登录过程出错', err);
			uni.showToast({
				title: err?.message || '登录失败',
				icon: 'none',
				duration: 3000,
			});
		}
	};

	const toWhere = async (userId : String) => {
		uni.showLoading({
			title: '请求中...',
			mask: true,
		});
		// const params = {
		//   id: userId,
		// };

		const userInfo = await getMiniUserInfo();
		uni.setStorageSync('userInfo', userInfo.clazz);
		appStore.initUserInfo();
		console.log('用户信息', userInfo.clazz);
	};

	// 其他方法保持不变
	const toastMpOnly = () => {
		uni.showToast({ title: '仅微信小程序支持一键取号', icon: 'none' });
	};

	const getWxLoginCode = () : Promise<string> => {
		return new Promise((resolve, reject) => {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success: (res) => {
					if (res?.code) {
						resolve(res.code);
					} else {
						reject(new Error('未返回 code'));
					}
				},
				fail: (e) => {
					reject(e);
				},
			});
			// #endif

			// #ifndef MP-WEIXIN
			reject(new Error('非小程序环境'));
			// #endif
		});
	};

	const loginphonefun = () : void => {
		uni.navigateTo({ url: '../login_phone/login' });
	};

	const loginpasswordfun = () : void => {
		uni.navigateTo({ url: '../login_password/login' });
	};

	const openProtocol = (type : 'userService' | 'privacy') : void => {
		// const urls = {
		// 	user: '/pages/protocol/user',
		// 	privacy: '/pages_C/xieyi/privacy'
		// };
		uni.navigateTo({ url: '/pages_C/xieyi/index?type=' + type });
	};

	const cancelLogin = () : void => {
		uni.reLaunch({ url: '../../pages/home/home' });
	};
</script>

<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}

	/* 原有样式保持不变 */
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #f1efef;
		// padding: 0 20rpx;
	}

	.img {
		width: 100%;
		height: 700rpx;
		margin: -220px 0 30rpx;
	}

	.btn-group {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 40rpx;
	}

	.btn-hover {
		opacity: 0.8;
	}

	.login-btn,
	.other-login-btn {
		width: 620rpx;
		height: 88rpx;
		font-size: 30rpx;
		border-radius: 40rpx;
		line-height: 88rpx;
		margin: 0 auto 40rpx;
		text-align: center;
	}

	.login-btn {
		background: var(--but-color-line);
		color: #fff;
		border: 0;
	}

	.other-login-btn {
		background: #ffffff;
		color: var(--primary-color);
	}

	.pwd-login-btn {
		color: #333333;
		font-size: 26rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin-bottom: 40rpx;
		text-align: center;
	}

	.agreement-box {
		position: fixed;
		bottom: 150rpx;
	}

	.agreement {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 30rpx;
	}

	.agreement-text {
		margin-right: 10rpx;
	}

	.protocol-text {
		color: var(--primary-color);
		margin: 0 5rpx;
	}

	.cancel-login-btn {
		color: #999;
		font-size: 26rpx;
		text-align: center;
	}

	.check_img {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}
</style>