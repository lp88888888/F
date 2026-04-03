<template>
	<view class="page-container" :data-theme="pageTheme">
		<!-- 页面标题 -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="修改密码" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<view style="padding: 30rpx 30rpx 60rpx;">

			<view class="page-title">请为您的账号{{phone}}{{hasPwd==1?"修改密码":"设置密码"}}</view>
			<view class="form-item" v-if="hasPwd==1">
				<view class="form-label">旧密码</view>
				<up-input v-model="form.oldPwd" type="text" placeholder="请输入旧密码" border="none" input-align="left"
					maxlength='16' :style="{ fontSize: '28rpx' }" v-if="showhasPwd">
				</up-input>
				<up-input v-model="form.oldPwd" type="password" placeholder="请输入旧密码" border="none" input-align="left"
					maxlength='16' :style="{ fontSize: '28rpx' }" v-else>
				</up-input>
			</view>
			<view class="form-item">
				<view class="form-label">新密码</view>
				<up-input v-model="form.newPwd" type="text" placeholder="密码必须是8-16位英文字母、数字、字符组合" border="none"
					input-align="left" maxlength='16' :style="{ fontSize: '28rpx' }" v-if="showNewPwd">
					<!-- 显示/隐藏密码图标 -->
				</up-input>
				<up-input v-model="form.newPwd" type="password" placeholder="密码必须是8-16位英文字母、数字、字符组合" border="none"
					input-align="left" maxlength='16' :style="{ fontSize: '28rpx' }" v-else>
					<!-- 显示/隐藏密码图标 -->
				</up-input>
			</view>
			<!-- 确认新密码输入框（带显示/隐藏） -->
			<view class="form-item">
				<view class="form-label">请确认新密码</view>
				<up-input v-model="form.confirmPwd" type="text" placeholder="请再次输入新密码" border="none" input-align="left"
					maxlength='16' :style="{ fontSize: '28rpx' }" v-if="showConfirmPwd">
				</up-input>
				<up-input v-model="form.confirmPwd" type="password" placeholder="请再次输入新密码" border="none"
					input-align="left" maxlength='16' :style="{ fontSize: '28rpx' }" v-else>
				</up-input>
			</view>
			<view class="wjpass" @click="wjpasswordFun">忘记密码</view>
			<!-- 保存按钮 -->
			<view class="btn-bar" @click="handleSavePwd">
				确定
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import {
		setPwdFun,
		resetPwd
	} from '@/api/password.ts'
	// 表单数据
	const form = reactive({
		oldPwd: '',
		newPwd: '', // 新密码
		confirmPwd: '' // 确认新密码
	});
	import {
		onLoad,
		onShow,
		onPageScroll
	} from '@dcloudio/uni-app';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 密码显示/隐藏开关
	const showhasPwd = ref(false);
	const showNewPwd = ref(false); // 新密码可见性
	const showConfirmPwd = ref(false); // 确认密码可见性
	const phone = ref(uni.getStorageSync('userInfo').mobile);
	const hasPwd = ref('')
	// 按钮禁用状态（表单为空时禁用）
	const isBtnDisabled = computed(() => {
		return !form.newPwd || !form.confirmPwd;
	});
	// 保存密码核心逻辑
	const handleSavePwd = async () => {
		// 2. 新密码格式校验（8-16位字母/数字）
		const pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;
		if (!pwdReg.test(form.newPwd)) {
			uni.showToast({
				title: '密码必须是8-16位英文字母、数字、字符组合',
				icon: 'none',
				duration: 2000
			});
			return;
		}
		// 3. 两次密码一致性校验
		if (form.newPwd !== form.confirmPwd) {
			uni.showToast({
				title: '两次输入的新密码不一致',
				icon: 'none',
				duration: 2000
			});
			return;
		}
		if (hasPwd.value == 1) {
			let params = {
				originalPwd: form.oldPwd,
				pwd: form.newPwd
			}
			const res = await resetPwd(params);
			if (res.code == 200) {
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '密码修改成功',
						icon: 'success',
						duration: 500
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1 // 返回的页面数，默认为1
						});
					}, 800)
					let userInfo = uni.getStorageSync('userInfo');
					if (!userInfo || typeof userInfo !== 'object') {
						userInfo = {};
					}
					userInfo.hasPwd = '1';
					uni.setStorageSync('userInfo', userInfo);
				}, 1500);
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'error',
					duration: 500
				});
			}
		} else {
			let params = {
				pwd: form.newPwd
			}
			const res = await setPwdFun(params);
			if (res.code == 200) {
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '密码设置成功',
						icon: 'success',
						duration: 500
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1 // 返回的页面数，默认为1
						});
					}, 800)
				}, 1500);
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'error',
					duration: 500
				});
			}
		}

	};
	const wjpasswordFun = () => {
		uni.navigateTo({
			url: '/pages_E/passwordSettings/forgetPassword'
		});
	}
	onShow(() => {
		hasPwd.value = uni.getStorageSync('userInfo').hasPwd
	})
	onLoad(() => {
		hasPwd.value = uni.getStorageSync('userInfo').hasPwd
	})
</script>

<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}

	.page-container {
		// padding: 30rpx 30rpx 60rpx;
		min-height: 100vh;
	}

	.page-title {
		font-size: 32rpx;
		color: #333;
		margin: 20rpx 0 80rpx;
	}

	.form-item {
		background-color: #fff;
		padding: 20rpx 10rpx;
		margin-bottom: 10rpx;
		border-bottom: 1rpx solid #eee;
	}

	.form-label {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.old-pwd-tip {
		font-size: 28rpx;
		color: #999;
		margin-right: 10rpx;
	}

	.icon-btn {
		padding: 0 10rpx;
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.btn-bar {
		width: 686rpx;
		height: 80rpx;
		background: var(--but-color-line);
		border-radius: 40rpx;
		font-weight: 500;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		position: fixed;
		bottom: 400rpx;
	}

	.wjpass {
		display: flex;
		float: right;
		padding: 20rpx 10rpx;
	}
</style>