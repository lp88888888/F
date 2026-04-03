<template>
	<view class="pageView" :data-theme="pageTheme">
	<!-- 	<up-navbar title="企业会员注册" @leftClick="toBack" :bgColor="backgroundColor" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar> -->
			<u-sticky bgColor="transparent" z-index="99999">
				<view class="searchView">
					<up-navbar title="企业会员注册" bgColor="transparent":titleStyle="{fontWeight: 'bold'}" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
				</view>
			</u-sticky>
		<view class="formCard">
			<view class="inputBox">
				<view class="inputBox-left"><text class="inputBox-left-Icon">*</text>企业名称</view>
				<view class="inputBox-center">
					<up-input placeholder="请输入" border="none" fontSize="14"
						v-model="formData.enterpriseName"></up-input>
				</view>
			</view>
			<view class="inputBox">
				<view class="inputBox-left"><text class="inputBox-left-Icon">*</text>组织机构代码</view>
				<view class="inputBox-center">
					<up-input placeholder="请输入" border="none" fontSize="14" v-model="formData.orgCode"></up-input>
				</view>
			</view>
			<view class="inputBox">
				<view class="inputBox-left"><text class="inputBox-left-Icon">*</text>营业执照照片</view>
				<view class="inputBox-center">
					<view class="colCenter cameraBg" @click="uploadImg('businessLicenseUrl')" style="margin-top: 0rpx">
						<block v-if="!formData.businessLicenseUrl">
							<image class="icCamera" :src="imgUrl + 'vipcard/shexiangji.png'" />
							<text class="fs-22 fw-500 col9">上传照片</text>
						</block>
						<block v-else>
							<image class="cardImg" :src="formData.businessLicenseUrl" mode="aspectFill" />
						</block>
					</view>
				</view>
			</view>
			<view class="inputBox">
				<view class="inputBox-left"><text class="inputBox-left-Icon">*</text>上传企业授权书</view>
				<view class="inputBox-center" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="colCenter cameraBg" @click="uploadImg('authorizationLetterUrl')"
						style="margin-top: 0rpx">
						<block v-if="!formData.authorizationLetterUrl">
							<image class="icCamera" :src="imgUrl + 'vipcard/shexiangji.png'" />
							<text class="fs-22 fw-500 col9">上传照片</text>
						</block>
						<block v-else>
							<image class="cardImg" :src="formData.authorizationLetterUrl" mode="aspectFill" />
						</block>
					</view>
					<view class="fs-26" style="color:#168AFF;margin-left: 32rpx;width: 180rpx;">模版图片</view>
				</view>
			</view>

			<view class="inputBox">
				<view class="inputBox-left"><text class="inputBox-left-Icon">*</text>联系人姓名</view>
				<view class="inputBox-center">
					<up-input placeholder="请输入" border="none" fontSize="14" v-model="formData.contactName"></up-input>
				</view>
			</view>
			<view class="inputBox">
				<view class="inputBox-left"><text class="inputBox-left-Icon">*</text>联系人手机号</view>
				<view class="inputBox-center">
					<up-input placeholder="请输入" type="number" maxlength="11" border="none" fontSize="14"
						v-model="formData.contactMobile"></up-input>
				</view>
			</view>
			<view class="inputBox">
				<view class="inputBox-left"><text class="inputBox-left-Icon">*</text>法人身份证照片</view>
				<view class="inputBox-center" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="colCenter cameraBg" @click="uploadImg('legalIdFrontUrl')"
						style="margin-top: 0rpx;width: 48%;height: 138rpx;">
						<block v-if="!formData.legalIdFrontUrl">
							<image class="icCamera" :src="imgUrl + 'vipcard/shexiangji.png'" />
							<text class="fs-22 fw-500 col9">上传照片</text>
						</block>
						<block v-else>
							<image class="cardImg" style="margin-top: 0rpx;width: 100%;height: 138rpx;"
								:src="formData.legalIdFrontUrl" mode="aspectFill" />
						</block>
					</view>
					<view class="colCenter cameraBg" @click="uploadImg('legalIdBackUrl')"
						style="margin-top: 0rpx;width: 48%;height: 138rpx;">
						<block v-if="!formData.legalIdBackUrl">
							<image class="icCamera" :src="imgUrl + 'vipcard/shexiangji.png'" />
							<text class="fs-22 fw-500 col9">上传照片</text>
						</block>
						<block v-else>
							<image class="cardImg" style="margin-top: 0rpx;width: 100%;height: 138rpx;"
								:src="formData.legalIdBackUrl" mode="aspectFill" />
						</block>
					</view>
				</view>
			</view>
			<view class="inputBox">
				<view class="inputBox-left">企业车辆数量</view>
				<view class="inputBox-center">
					<up-input placeholder="请输入" type="number" border="none" fontSize="14"
						v-model="formData.vehicleQuantity"></up-input>
				</view>
			</view>
			<view class="butBox" @click="submit">提交</view>
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
		postregisterEnterprise
	} from '@/api/member';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const backgroundColor = ref<string>('#EEFDF1');
	const formData = reactive({
		enterpriseName: '',
		orgCode: '',
		businessLicenseUrl: '',
		authorizationLetterUrl: '',
		contactName: '',
		contactMobile: '',
		legalIdFrontUrl: '',
		legalIdBackUrl: '',
		vehicleQuantity: ''


	})

	const submit = debounce(() => {
		if (validateForm()) {
			handleSave();

		}
	}, 300);

	const handleSave = async () => {

		const res = await postregisterEnterprise(formData);
		if (res.code == 200) {
			uni.showToast({
				title: '提交成功',
				icon: 'success',
				duration: 2000
			});
			setTimeout(() => {
				uni.navigateBack({
					delta: 1
				});
			}, 1000);
		}
	}
	// 选择上传图片
	const uploadImg = async (type) => {
		const path = await chooseOneImage();
		if (path) {
			const uploadRes = await uploadFile({
				url: '/file/upload',
				filePath: path, // 使用微信返回的头像路径
			});
			console.log('上传结果', uploadRes.data.url);
			formData[type] = uploadRes.data.url
		}
		console.log(path);
	}
	// 表单校验：逐条检查，遇到第一个错误就提示并返回 false
	const validateForm = () : boolean => {
		// 1. 企业名称
		if (!formData.enterpriseName?.trim()) {
			uni.showToast({ title: '请输入企业名称', icon: 'none', duration: 2000 });
			return false;
		}

		// 2. 组织机构代码
		if (!formData.orgCode?.trim()) {
			uni.showToast({ title: '请输入组织机构代码', icon: 'none', duration: 2000 });
			return false;
		}

		// 3. 营业执照照片
		if (!formData.businessLicenseUrl) {
			uni.showToast({ title: '请上传营业执照照片', icon: 'none', duration: 2000 });
			return false;
		}

		// 4. 企业授权书
		if (!formData.authorizationLetterUrl) {
			uni.showToast({ title: '请上传企业授权书', icon: 'none', duration: 2000 });
			return false;
		}

		// 5. 联系人姓名
		if (!formData.contactName?.trim()) {
			uni.showToast({ title: '请输入联系人姓名', icon: 'none', duration: 2000 });
			return false;
		}

		// 6. 联系人手机号
		const mobile = formData.contactMobile?.trim();
		if (!mobile) {
			uni.showToast({ title: '请输入联系人手机号', icon: 'none', duration: 2000 });
			return false;
		}
		const mobileReg = /^1[3-9]\d{9}$/;
		if (!mobileReg.test(mobile)) {
			uni.showToast({ title: '手机号格式不正确', icon: 'none', duration: 2000 });
			return false;
		}

		// 7. 法人身份证正面
		if (!formData.legalIdFrontUrl) {
			uni.showToast({ title: '请上传法人身份证正面', icon: 'none', duration: 2000 });
			return false;
		}

		// 8. 法人身份证反面
		if (!formData.legalIdBackUrl) {
			uni.showToast({ title: '请上传法人身份证反面', icon: 'none', duration: 2000 });
			return false;
		}

		// ✅ 所有校验通过
		return true;
	};
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
	.pageView {
		width: 100%;
		min-height: 100vh;
		padding: 25rpx;
		box-sizing: border-box;
		background: var(--success-color);
	}

	.formCard {
		padding: 30rpx 26rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 8rpx 0rpx #D3E7D1;
		border-radius: 10rpx;

		.inputBox {
			padding: 15rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.inputBox-left {
				width: 210rpx;
				text-align: left;
				font-size: 26rpx;
				margin-right: 32rpx;

				.inputBox-left-Icon {
					font-size: 24rpx;
					color: red;
				}
			}

			.inputBox-center {
				width: calc(100% - 242rpx - 50rpx);
			}
		}

		.cameraBg {
			width: 300rpx;
			height: 168rpx;
			background: #fff;
			border-radius: 16rpx;
			border: 1px dashed #EFEFEF;
			margin-top: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}

		.icCamera {
			width: 50rpx;
			height: 50rpx;
			margin-bottom: 20rpx;
		}

		.cardImg {
			width: 300rpx;
			height: 168rpx;
			background: #FFFAF3;
			border-radius: 16rpx;
			border: 1px solid var(--primary-color);
			// position: absolute;
			// top: 0; left: 0;
		}
	}

	.butBox {
		background: var(--but-color-line);
		border-radius: 10rpx;
		width: 100%;
		height: 107rpx;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 98rpx;
		margin-bottom: 146rpx;
	}
</style>