<template>
	<view class="pageView" :data-theme="pageTheme">
		<!-- <up-navbar title="个人会员注册" :bgColor="backgroundColor" @leftClick="toBack" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar> -->
			<u-sticky bgColor="transparent" z-index="99999">
				<view class="searchView">
					<up-navbar title="个人会员注册" bgColor="transparent":titleStyle="{fontWeight: 'bold'}" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
				</view>
			</u-sticky>
		<view class="formCard">
			<!-- #ifdef MP-WEIXIN -->
			<button class="avatar" plain open-type="chooseAvatar" @chooseavatar="chooseAvatar">
				<up-avatar :src="formData.avatar" size="80"></up-avatar>
			</button>
			<!-- #endif -->
			<!-- #ifdef APP -->
			<view class="avatar">
				<up-avatar :src="formData.avatar" size="80" @click="selectActive"></up-avatar>
			</view>
			<!-- #endif -->
			<up-gap height="5"></up-gap>
			<view class="inputBox">
				<view class="inputBox-left">昵称</view>
				<view class="inputBox-center">
					<up-input placeholder="请输入" border="none" fontSize="14" v-model="formData.name"></up-input>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="inputBox-button" @click="getWechatNickname"> {{ isFetching ? '获取中...' : '获取微信昵称' }}</view>
				<!-- #endif -->
			</view>

			<view class="inputBox">
				<view class="inputBox-left">手机号</view>
				<view class="inputBox-center">
					<up-input type="number" maxlength="11" placeholder="请输入" border="none" fontSize="14"
						v-model="formData.phone"></up-input>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="inputBox-button" border="none" open-type="getPhoneNumber"
					@getphonenumber="onGetPhoneNumber" :loading="isGettingPhone">
					{{ isGettingPhone ? '获取中...' : '获取手机号' }}
				</button>
				<!-- #endif -->
			</view>
		</view>
		<view class="butBox" @click="submit">提交</view>
		<view class="tishi">
			<image class="dhBoxView-jinbi" :src="imgUrl+'jf_icon.png'" mode="aspectFit"></image>开通即送积分
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { debounce } from '@/utils/common';
	import uploadFile from '@/utils/upload'
	import {
		postwechatRegister,
		getgetUserPhoneNumber,
		postsaveRegisterPoint,
	} from '@/api/member';
	import { fetchWechatInfo } from '@/api/login';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	const avatarUrl = ref('');
	const backgroundColor = ref<string>('#EEFDF1');
	const formData = reactive({
		avatar: '',
		name: '',
		phone: ''
	})
	const isGettingPhone = ref(false)
	const isFetching = ref(false)

	// 表单校验：逐条检查，遇到第一个错误就提示并返回 false
	const validateForm = () : boolean => {
		// 1. 请选择头像
		if (!formData.avatar?.trim()) {
			uni.showToast({ title: '请选择头像', icon: 'none', duration: 2000 });
			return false;
		}

		// 2. 名称
		if (!formData.name?.trim()) {
			uni.showToast({ title: '请获取名称', icon: 'none', duration: 2000 });
			return false;
		}

		// 3. 手机号
		if (!formData.phone) {
			uni.showToast({ title: '手机号不能为空', icon: 'none', duration: 2000 });
			return false;
		}
		const mobileReg = /^1[3-9]\d{9}$/;
		if (!mobileReg.test(formData.phone)) {
			uni.showToast({ title: '手机号格式不正确', icon: 'none', duration: 2000 });
			return false;
		}
		// ✅ 所有校验通过
		return true;
	};
	const submit = debounce(() => {
		if (validateForm()) {
			handleSave();
		}
	}, 300);
	//注册成功送积分
	const egisterPoint = async () => {
		let res = await postsaveRegisterPoint()
		if (res.code == 200) {
			uni.showToast({
				title: '注册成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		}
	}
	//注册会员
	const handleSave = async () => {
		let params = {
			avatarUrl: formData.avatar,
			loginMobile: formData.phone,
			nickName: formData.name,
		}
		let res = await postwechatRegister(params)
		if (res.code == 200) {
			egisterPoint()
			// setTimeout(() => {
			// 	toNav('/pages_C/member/registeredSuccess')
			// }, 1000)
		}
	}


	// 处理微信授权回调
	const onGetPhoneNumber = async (e) => {
		if (e.detail.errMsg !== 'getPhoneNumber:ok') {
			uni.showToast({ title: '已取消授权', icon: 'none' })
			return
		}
		const phoneCode = e.detail.code;
		isGettingPhone.value = true
		try {
			// 将加密数据发送给后端解密
			const wxCode = await getWxLoginCode();
			const wxInfoResp : any = await fetchWechatInfo({ code: wxCode });
			if (wxInfoResp?.code != 0 || !wxInfoResp?.clazz?.openid) {
				throw new Error(wxInfoResp?.msg || '获取微信用户标识失败');
			}
			const { openid, session_key, unionid } = wxInfoResp.clazz || {};
			const res = await getgetUserPhoneNumber({ code: phoneCode, openid })
			formData.phone = res.clazz
			uni.showToast({ title: '获取成功', icon: 'success' })
		} catch (err) {
			console.error('获取手机号失败:', err)
			uni.showToast({ title: '获取失败，请重试', icon: 'none' })
		} finally {
			isGettingPhone.value = false
		}
	}
	//获取微信code
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
				}
			});
			// #endif

			// #ifndef MP-WEIXIN
			reject(new Error('非小程序环境'));
			// #endif
		});
	};
	// 获取微信昵称（需用户授权）
	const getWechatNickname = async () => {
		if (isFetching.value) return

		isFetching.value = true
		try {
			// const wxCode = await getWxLoginCode();
			const res = await new Promise((resolve, reject) => {
				uni.getUserProfile({
					desc: '用于完善用户资料', // 必填，声明用途
					success: resolve,
					fail: reject
				})
			})
			formData.name = res.userInfo.nickName
			uni.showToast({ title: '获取成功', icon: 'success' })

		} catch (err) {
			console.error('获取微信昵称失败:', err)
			// 用户拒绝授权 or 其他错误
			uni.showToast({
				title: err.errMsg.includes('auth deny') ? '已取消授权' : '获取失败',
				icon: 'none'
			})
		} finally {
			isFetching.value = false
		}
	}
	//获取头像
	const chooseAvatar = async (e) => {
		console.log('头像', e.detail.avatarUrl);
		try {
			uni.showLoading({
				title: '上传中...'
			});
			const uploadRes = await uploadFile({
				url: '/file/upload',
				filePath: e.detail.avatarUrl, // 使用微信返回的头像路径
			});
			console.log('上传结果', uploadRes.data.url);
			formData.avatar = uploadRes.data.url
			// 		await updateMember({
			// 			headImageUrl: uploadRes.data.url,
			// 		});
			// 		avatarUrl.value = uploadRes.data.url;
		} catch (err) {
			uni.showToast({
				title: '上传失败',
				icon: 'none'
			});
		} finally {
			uni.hideLoading();
		}
	};
	const selectActive = async () => {
		const path = await chooseOneImage();
		if (path) {
			const uploadRes = await uploadFile({
				url: '/file/upload',
				filePath: path, // 使用微信返回的头像路径
			});
			console.log('上传结果', uploadRes.data.url);

			formData.avatar = uploadRes.data.url
		}

		console.log(path);
	}
	const chooseOneImage = () : Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			// #ifdef MP-WEIXIN
			uni.chooseMedia({
				count: 1,
				mediaType: ['image'],
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				camera: 'back',
				success: (res) => {
					const file = res.tempFiles?.[0];
					if (file?.tempFilePath) {
						console.log('压缩后大小：', file.size, '字节');
						resolve(file.tempFilePath);
					} else {
						reject(new Error('未选择图片'));
					}
				},
				fail: (err) => reject()
			});
			// #endif

			// #ifndef MP-WEIXIN
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const path = res.tempFilePaths?.[0];
					if (path) resolve(path);
					else reject(new Error('未选择图片'));
				},
				fail: (err) => reject()
			});
			// #endif
		});
	};
</script>

<style lang="scss" scoped>
	.searchView {
		background: var(--head-color);
	}
	.pageView {
		width: 100%;
		min-height: 100vh;
		padding: 25rpx;
		box-sizing: border-box;
		background: var(--head-color) ;
	}

	.formCard {
		padding: 30rpx 0;
		box-sizing: border-box;

		.inputBox {
			border-radius: 9rpx;
			border: 2rpx solid #E9E9E9;
			padding: 38rpx 24rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 43rpx;
			margin-bottom: 32rpx;

			.inputBox-left {
				width: 204rpx;
				text-align: left;
				font-size: 26rpx;
				border-right: 2rpx solid #E5E5E5;
				margin-right: 32rpx;
			}

			.inputBox-center {
				width: calc(100% - 100rpx - 170rpx - 40rpx);
			}

			.inputBox-button {
				width: 210rpx;
				font-weight: 400;
				font-size: 28rpx;
				color:var(--primary-color);
			}
		}

	}

	.avatar {
		width: 100%;
		display: flex;
		justify-content: center;
		// width: 75rpx;
		// height: 78rpx;
		border: none;
	}

	button {
		padding: 0;
		border: none;
		border-radius: 20rpx;
		background: transparent;
	}


	.butBox {
		width: 100%;
		height: 90rpx;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--but-color-line);
		border-radius: 10rpx;
	}

	.tishi {
		margin: 0 auto;
		margin-top: 20rpx;
		width: 80%;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		color: #DA940B;
		border-radius: 10rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}


	.dhBoxView-jinbi {
		width: 40rpx;
		height: 40rpx;
		margin-right: 12rpx;
	}
</style>