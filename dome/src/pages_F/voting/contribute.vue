<template>
	<view class="contribute-page">
		<!-- 顶部导航栏 - 修复背景色和边框 -->
		<view class="contribute-box">
			<u-navbar title="投稿作品" left-icon="arrow-left" :border-bottom="false" bg-color=""
				:title-style="{color: '#333', fontSize: '18px', fontWeight: '500'}"
				:left-icon-style="{color: '#333'}"  @left-click="leftClickFun"></u-navbar>
		</view>
		<!-- 顶部提示栏 - 简化布局适配小程序 -->
		<view class="tip-bar">
			<view class="tip-text">
				<view class="tip-img"></view>
			</view>
		</view>

		<view class="box">
			<!-- 表单区域 - 调整外层间距 -->
			<view class="form-wrap">
				<u-form ref="formRef" :model="formData" class="form-container">
					<view
						style="width: 100%; background: #fff;padding:20rpx 30rpx; margin-bottom: 30rpx; box-sizing: border-box;box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.04);border-radius: 20rpx;">
						<!-- 1. 爱上高速 标语 -->
						<u-form-item label="“爱上高速”标语：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<u-input v-model="formData.slogan" placeholder="请输入" class="input-style"
								maxlength="14"></u-input>

						</u-form-item>

						<!-- 2. 标语设计理念 -->
						<u-form-item label="设计理念：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<u-textarea v-model="formData.sloganIdea" placeholder="请简要描述一下您的设计理念~" :maxlength="100"
								count :show-word-limit="true" class="textarea-style"></u-textarea>
						</u-form-item>
					</view>
					<view
						style="width: 100%; background: #fff;padding:30rpx 30rpx; margin-bottom: 30rpx; box-sizing: border-box;box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.04);border-radius: 20rpx;">
						<!-- 3. 爱上高速 LOGO -->
						<u-form-item label="“爱上高速”LOGO：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<view @click="uploadImg('logo')">
								<view class="up-bg" v-if="!formData.logo">
									<image :src="imgUrl+'static/up-sc.png'" class="icon-sfz"></image>
									<text>上传照片</text>
								</view>
								<image :src="formData.logo" class="icon-img" v-else></image>
							</view>
						</u-form-item>
						<!-- 4. LOGO设计理念 -->
						<u-form-item label="设计理念：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<u-textarea v-model="formData.logoIdea" placeholder="请简要描述一下您的设计理念~" :maxlength="100" count
								:show-word-limit="true" class="textarea-style"></u-textarea>
						</u-form-item>
					</view>
					<view
						style="width: 100%; background: #fff;padding:30rpx 30rpx; margin-bottom: 30rpx; box-sizing: border-box;box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.04);border-radius: 20rpx;">
						<!-- 5. 爱上高速 IP形象 -->
						<u-form-item label="“爱上高速”IP形象：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item ip-form-item">
							<view class="ip-upload-container">
								<!-- 正面 -->
								<view class="ip-upload-item">
									<text class="ip-label">正面</text>
									<view @click="uploadImg('ipImg1')">
										<view class="up-bg" v-if="!formData.ipImg1">
											<image :src="imgUrl+'static/up-sc.png'" class="icon-sfz"></image>
											<text>上传照片</text>
										</view>
										<image :src="formData.ipImg1" class="icon-img" v-else></image>
									</view>
								</view>
								<!-- 侧面 -->
								<view class="ip-upload-item">
									<text class="ip-label">侧面</text>
									<view @click="uploadImg('ipImg2')">
										<view class="up-bg" v-if="!formData.ipImg2">
											<image :src="imgUrl+'static/up-sc.png'" class="icon-sfz"></image>
											<text>上传照片</text>
										</view>
										<image :src="formData.ipImg2" class="icon-img" v-else></image>
									</view>
								</view>
								<!-- 背面 -->
								<view class="ip-upload-item">
									<text class="ip-label">背面</text>
									<view @click="uploadImg('ipImg3')">
										<view class="up-bg"v-if="!formData.ipImg3">
											<image :src="imgUrl+'static/up-sc.png'" class="icon-sfz"></image>
											<text>上传照片</text>
										</view>
										<image :src="formData.ipImg3" class="icon-img" v-else></image>
									</view>
								</view>
							</view>
						</u-form-item>
						<!-- 6. IP形象设计理念 -->
						<u-form-item label="设计理念：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<u-textarea v-model="formData.ipIdea" placeholder="请简要描述一下您的设计理念~" :maxlength="100" count
								:show-word-limit="true" class="textarea-style"></u-textarea>
						</u-form-item>
					</view>
					<view
						style="width: 100%; background: #fff;padding:30rpx 30rpx; margin-bottom: 30rpx; box-sizing: border-box;box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.04);border-radius: 20rpx;">
						<!-- 7. 姓名 -->
						<u-form-item label="姓名" required required-color="#f00" label-position="left" label-width="auto"
							class="form-item">
							<u-input v-model="formData.name" placeholder="请输入" class="input-style"
							maxlength="15"	></u-input>
						</u-form-item>

						<!-- 8. 联系方式 -->
						<u-form-item label="联系方式" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<u-input v-model="formData.phone" placeholder="请输入" class="input-style" maxlength="11"></u-input>
						</u-form-item>
					</view>
					<!-- 温馨提示 -->
					<view class="tips-container">
						<view style="display: flex;gap: 5rpx;">
							<u-icon name="question-circle" color="#999" size="14"></u-icon>
							<text class="tips-title">温馨提示：</text>
						</view>
						<view class="tips-list">
							<text>1.投稿作品会经过平台官方审核，审核通过方可上线；</text>
							<text>2.您也可以在【活动主页面-我的作品】查看您投稿的作品。</text>
						</view>
					</view>
				</u-form>
			</view>
		</view>
		<!-- 提交按钮 -->
		<view class="foot">
			<view class="submit-btn" @click="workSubmitFun">提交</view>
		</view>
		<view style="width: 100%;height: 100vh;background: rgba(0,0,0,.4);position: absolute;top: 0;z-index: 1;" v-if="success">
		<view class="success" >
			 <image :src="imgUrl+'static/zj-succes.png'" class="store-image"></image>
			 <view class="success-tetx">
				 <view style="font-size: 38rpx;color: #181713;margin: 20rpx 0;">提交成功，审核中</view>
				 <view style="font-size: 26rpx;color: #7D7F7E;text-align: center;">您的投稿作品已提交成功，请耐心等待平台审核哦！</view>
			 </view>
		</view>	
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { workSubmit } from '@/api/voting';
	import uploadFile from '@/utils/upload';
	// 表单数据
	const formData = ref({
		slogan: '', // 标语
		sloganIdea: '', // 标语设计理念
		logo: '', // LOGO文件
		logoIdea: '', // LOGO设计理念
		ipImg1: '',
		ipImg2: '',
		ipImg3: '',
		ipIdea: '', // IP设计理念
		name: '', // 姓名
		phone: '' // 联系方式（默认值）
	});
   const success= ref(false);
	// 表单实例
	const formRef = ref();
	const workSubmitFun = async () => {
		 // 1. 表单验证
		 const validationRules = [
		 	{ field: 'slogan', message: '请输入爱上高速标语' },
		 	{ field: 'sloganIdea', message: '请输入标语设计理念' },
		 	{ field: 'logo', message: '请上传LOGO' },
		 	{ field: 'logoIdea', message: '请输入LOGO设计理念' },
		 	{ field: 'ipImg1', message: '请上传正面形象' },
		 	{ field: 'ipImg2', message: '请上传侧面形象' },
		 	{ field: 'ipImg3', message: '请上传背面形象' },
		 	{ field: 'ipIdea', message: '请输入IP设计理念' },
		 	{ field: 'name', message: '请输入姓名' },
		 	{ field: 'phone', message: '请输入手机号' }
		 ];
		 // 验证每个字段
		 for (const rule of validationRules) {
		 	if (!formData.value[rule.field as keyof typeof formData.value]) {
		 		uni.showToast({
		 			title: rule.message,
		 			icon: 'none',
		 		});
		 		return;
		 	}
		 }
		 // 2. 手机号格式验证
		 const phoneRegex = /^1[3-9]\d{9}$/;
		 if (!phoneRegex.test(formData.value.phone)) {
		 	uni.showToast({
		 		title: '请输入正确的手机号',
		 		icon: 'none',
		 	});
		 	return;
		 }
		 const submitData = {
		 	slogan: formData.value.slogan,
		 	sloganIdea: formData.value.sloganIdea,
		 	logo: formData.value.logo,
		 	logoIdea: formData.value.logoIdea,
		 	// 合并IP图片为一个字符串，用逗号分隔
		 	ipImg: [formData.value.ipImg1, formData.value.ipImg2, formData.value.ipImg3]
		 		.filter(img => img) // 过滤空值
		 		.join(','),
		 	ipIdea: formData.value.ipIdea,
		 	name: formData.value.name,
		 	phone: formData.value.phone
		 };
		 
		 // 6. 提交数据
		 const res = await workSubmit(submitData);
		 // 7. 处理结果
		 if (res.code == 200) {
		 	success.value=true
		 	// 提交成功后重置表单
		 	setTimeout(() => {
		 		formData.value = {
		 			slogan: '',
		 			sloganIdea: '',
		 			logo: '',
		 			logoIdea: '',
		 			ipImg1: '',
		 			ipImg2: '',
		 			ipImg3: '',
		 			ipIdea: '',
		 			name: '',
		 			phone: ''
		 		};
				success.value=false
		 		uni.navigateBack();
		 	}, 1200);
		}
	};
	// 上传
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
	// 上传
	const uploadImg = async (type : string | number) => {
		try {
			const path = await chooseOneImage();
			if (path) {
				const uploadRes : any = await uploadFile({
					url: '/file/upload',
					filePath: path,
				});
				uni.showLoading({
				     title: '上传中..',
				     mask: true
				   });
				if (uploadRes.code == 200) {
					uni.hideLoading();
					if (type == 'logo') {
						formData.value.logo = uploadRes.data.url
					} else if (type == 'ipImg1') {
						formData.value.ipImg1 = uploadRes.data.url
					} else if (type == 'ipImg2') {
						formData.value.ipImg2 = uploadRes.data.url
					} else if (type == 'ipImg3') {
						formData.value.ipImg3 = uploadRes.data.url
					}
					
				}
			}

		} catch (e : any) {
			uni.showToast({ title: e?.resultMsg || '选择失败', icon: 'none' });
		}
	};
	const leftClickFun = () => {
		 uni.navigateBack({
		        delta: 1 // 返回的页面数，默认是1
		      })
	}
	// 预览
	const imgPreview = (url) => {
		uni.previewImage({
			urls: [url]
		})
	}
	const parseToken = (token) => {
		if (!token) return null;
	
		try {
			const payloadBase64 = token.split('.')[1];
			if (!payloadBase64) return null;
	
			const buffer = wx.base64ToArrayBuffer(payloadBase64);
			const uint8Arr = new Uint8Array(buffer);
	
			let binary = '';
			for (let i = 0; i < uint8Arr.length; i++) {
				binary += String.fromCharCode(uint8Arr[i]);
			}
	
			const payloadString = decodeURIComponent(escape(binary));
			return JSON.parse(payloadString);
		} catch (e) {
			console.error('Token 解析失败:', e);
			return null;
		}
	};
	const parseTokenApp = (token) => {
		if (!token) return null;
	
		try {
			// JWT 由三部分组成：header.payload.signature
			const payloadBase64 = token.split('.')[1];
			// Base64Url 解码
			const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
			return JSON.parse(payloadJson);
		} catch (e) {
			console.error('Token 解析失败:', e);
			return null;
		}
	}
	onLoad(()=>{
		const token = uni.getStorageSync('Token');
		const name= uni.getStorageSync('userInfo');
		// #ifdef MP-WEIXIN
		const userInfo = parseToken(token);
		// #endif
		// #ifdef APP-PLUS
		const userInfo = parseTokenApp(token); 
		// #endif
		formData.value.phone = userInfo.member_phone
		formData.value.name= name.nickName
	})
</script>

<style scoped lang="scss">
	// 全局页面样式 - 修复背景色和边距
	.contribute-page {
		height: 100vh;
		overflow: hidden;
		padding: 0;
		margin: 0;
		background: #EDF8EF;
	}

	// 顶部提示栏 - 适配小程序样式
	.tip-bar {
		padding: 12px 15px;
		margin-top: 25%;

		.tip-text {
			.tip-main {
				display: block;
				font-size: 15px;
				color: #333;
				font-weight: 500;
				margin-bottom: 4px;
			}

			.tip-sub {
				display: block;
				font-size: 12px;
				color: #999;
				line-height: 1.4;
			}
		}
	}

	// 表单外层包裹 - 调整间距
	.form-wrap {}

	// 表单容器
	.form-container {
		background-color: #fff;
		border-radius: 8px;
		padding: 15px;

		// 通用表单项样式
		.form-item {
			margin-bottom: 20px;
			display: flex;
			flex-direction: column; // 标签和内容垂直排列
			row-gap: 8px; // 标签和内容间距

			// 修复u-form-item标签样式
			::v-deep .u-form-item__content {
				padding: 0 !important;
			}

			::v-deep .u-form-item__label {
				font-size: 14px;
				color: #333;
				line-height: 1.4;
				padding: 0 !important;
			}

			// 必填星号样式
			::v-deep .u-form-item__required {
				margin-right: 4px;
			}
		}

		// IP形象表单项特殊处理
		.ip-form-item {
			::v-deep .u-form-item__content {
				width: 100%;
			}
		}

		// 输入框样式
		.input-style {
			font-size: 14px;
			padding: 10px 0;
			border-bottom: 1px solid #f0f0f0;
			width: 100%;
		}

		// 文本域样式
		.textarea-style {
			font-size: 14px;
			padding: 10px 0;
			min-height: 80px;
			border-bottom: 1px solid #f0f0f0;
			width: 100%;

			::v-deep .u-textarea__word-limit {
				color: #999;
				font-size: 12px;
			}
		}

		// 上传组件样式
		.upload-style {
			::v-deep .u-upload {
				width: 100%;
			}

			::v-deep .u-upload__upload {
				width: 90px;
				height: 90px;
				border: 1px dashed #d9d9d9;
				border-radius: 4px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			::v-deep .u-upload__upload-text {
				font-size: 12px;
				color: #999;
				margin-top: 4px;
			}
		}

		// IP形象上传容器 - 修复flex布局
		.ip-upload-container {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			width: 100%;
			gap: 10px; // 小程序flex兼容间距
		}
	}

	::v-deep .u-form-item__body {
		padding: 10rpx 0 0 !important;
		display: block !important;
	}

	.ip-upload-container {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		gap: 10px; // 
	}

	::v-deep .u-navbar__content {
		background: none !important;
	}

	::v-deep .u-form-item__body__left__content {
		margin: 20rpx 0;
	}

	::v-deep .u-form-item__body__left__content__required {
		left: -5px !important;
		color: #E53D3D !important;
	}

	::v-deep .u-form-item__body__left__content__label {
		color: #000 !important;
		margin-left: 12rpx !important;
	}

	.contribute-box {
		width: 100%;
		height: 190rpx;
		background: #EDF8EF;
		position: fixed;
		top: 0;
		left: 0;
	}

	.ip-upload-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1; // 均分宽度
		text-align: center;
	}

	.ip-label {
		font-size: 12px;
		color: #666;
		margin-bottom: 8px;
	}

	.box {
		height: 71vh;
		overflow-y: scroll;
	}

	.submit-btn {
		width: 80%;
		height: 46px;
		line-height: 46px;
		background: linear-gradient(273deg, #77AB39 0%, #ACD483 100%);
		border-radius: 16rpx;
		font-size: 32rpx;
		color: #fff !important;
		margin: 10rpx auto;
		text-align: center;
	}

	// 温馨提示
	.tips-container {
		font-size: 24rpx;
		color: #868686;
		display: flex;
		flex-direction: column;
		row-gap: 8px;
		margin-top: 40rpx;
		padding: 0 30rpx;
	}

	.tips-title {
		font-weight: 500;
		margin-left: 5px;
	}

	.tips-list {
		padding-left: 20px;
		line-height: 1.6;
		display: flex;
		flex-direction: column;
		row-gap: 4px;
		color: #868686;
	}

	.up-bg {
		width: 199rpx;
		height: 199rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: column;
		gap: 20rpx;
		background: #F3F3F3;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		font-size: 24rpx;
		color: #9E9E9E;
	}

	.icon-sfz {
		width: 60rpx;
		height: 60rpx;
	}
   .icon-img{
	   width: 199rpx;
	   height: 199rpx;
   }
	.foot {
		width: 100%;
		padding: 10rpx 0;
		background: #fff;
	}
	.success{
		position: absolute;
		top: 45%;
		left: 50%;
		transform: translate(-50%,-45%);
		z-index: 99;
	}
	.success-tetx{
		padding: 0 70rpx;
		    position: absolute;
		    top: 50%;
		    display: flex;
		    flex-flow: column;
		    align-items: center;
		    justify-content: center;
	}
	.tip-img{
		width: 100%;
		height: 120rpx;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/wztmdk.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
</style>