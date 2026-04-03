<template>
	<view class="contribute-page">
		<!-- 顶部导航栏 - 修复背景色和边框 -->
		<view class="contribute-box">
			<u-navbar title="作品详情" left-icon="arrow-left" :border-bottom="false" bg-color=""
				:title-style="{color: '#333', fontSize: '18px', fontWeight: '500'}" :left-icon-style="{color: '#333'}"
				@left-click="leftClickFun"></u-navbar>
		</view>
		<view class="box">
			<!-- 表单区域 - 调整外层间距 -->
			<view class="form-wrap">
				<u-form ref="formRef" :model="formData" class="form-container">
					<view
						style="width: 100%; background: #fff;padding:30rpx 30rpx; margin-bottom: 30rpx; box-sizing: border-box;box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.04);border-radius: 20rpx;">
						<!-- 1. 爱上高速 标语 -->
						<u-form-item label="“爱上高速”标语：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<u-input v-model="formData.slogan" placeholder="请输入" class="input-style" maxlength="14"
								disabled></u-input>
						</u-form-item>

						<!-- 2. 标语设计理念 -->
						<u-form-item label="设计理念：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<u-textarea v-model="formData.sloganIdea" placeholder="请简要描述一下您的设计理念~" :maxlength="100"
								count :show-word-limit="true" class="textarea-style" disabled></u-textarea>
						</u-form-item>
					</view>
					<view
						style="width: 100%; background: #fff;padding:30rpx 30rpx; margin-bottom: 30rpx; box-sizing: border-box;box-shadow: 0rpx -6rpx 16rpx 0rpx rgba(0,0,0,0.04);border-radius: 20rpx;">
						<!-- 3. 爱上高速 LOGO -->
						<u-form-item label="“爱上高速”LOGO：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<view>
								<image :src="formData.logo" class="icon-img" @click="imgPreview(formData.logo)"></image>
							</view>
						</u-form-item>
						<!-- 4. LOGO设计理念 -->
						<u-form-item label="设计理念：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<u-textarea v-model="formData.logoIdea" placeholder="请简要描述一下您的设计理念~" :maxlength="100" count
								:show-word-limit="true" class="textarea-style" disabled></u-textarea>
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
									<image :src="formData.ipImg1" class="icon-img" @click="imgPreview(formData.ipImg1)">
									</image>
								</view>
								<!-- 侧面 -->
								<view class="ip-upload-item">
									<text class="ip-label">侧面</text>
									<image :src="formData.ipImg2" class="icon-img" @click="imgPreview(formData.ipImg2)">
									</image>
								</view>
								<!-- 背面 -->
								<view class="ip-upload-item">
									<text class="ip-label">背面</text>
									<image :src="formData.ipImg3" class="icon-img" @click="imgPreview(formData.ipImg3)">
									</image>
								</view>
							</view>
						</u-form-item>
						<!-- 6. IP形象设计理念 -->
						<u-form-item label="设计理念：" required required-color="#f00" label-position="left"
							label-width="auto" class="form-item">
							<u-textarea v-model="formData.ipIdea" placeholder="请简要描述一下您的设计理念~" :maxlength="100" count
								:show-word-limit="true" class="textarea-style" disabled></u-textarea>
						</u-form-item>
					</view>
				</u-form>
			</view>
		</view>
		
		<!-- 提交按钮 -->
		<view class="foot" >
			<view class="submit-btn">给他投票</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { workDetail } from '@/api/voting';
	import uploadFile from '@/utils/upload';
	const id = ref('')
	const objData = ref('')
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
	const success = ref(false);
	const activePrimaryTab = ref(true);
	// 表单实例
	const formRef = ref();
	const workSubmitFun = async () => {
		const res = await workDetail(id.value);
		// 7. 处理结果
		if (res.code == 200) {
			objData.value = res.data
			const ipImgUrls = res.data.ipImg.split(',');
			formData.value.slogan = res.data.slogan,
				formData.value.sloganIdea = res.data.sloganIdea,
				formData.value.logo = res.data.logo,
				formData.value.logoIdea = res.data.logoIdea,
				formData.value.ipImg1 = ipImgUrls[0] || '';
			formData.value.ipImg2 = ipImgUrls[1] || '';
			formData.value.ipImg3 = ipImgUrls[2] || '';
			formData.value.ipIdea = res.data.ipIdea
			formData.value.name = res.data.name,
				formData.value.phone = res.data.phone
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

	onLoad((options) => {
		id.value = options.id
		workSubmitFun()
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
		height:80vh;
		overflow-y: scroll;
		margin-top: 28%;
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

	.icon-img {
		width: 199rpx;
		height: 199rpx;
	}

	/* 卡片容器核心样式，使用rpx适配多端 */
	.vote-card {
		width: 85%;
		max-width: 750rpx;
		/* uni-app常用最大宽度，适配手机屏幕 */
		margin: 28% auto 20rpx;
		padding: 24rpx 24rpx 0;
		border: 1rpx solid #8DAB77;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		background-color: #ffffff;
	}

	/* 头部布局 */
	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 18rpx;
		/* 头像与文字间距 */
	}

	.avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background-color: #d1d5db;
		/* 头像占位色 */
	}

	.user-base {
		display: flex;
		align-items: center;
	}

	.user-name {
		font-size: 28rpx;
		color: #111827;
		margin-right: 18rpx;
	}

	.user-id {
		margin-left: 120rpx;
		font-size: 24rpx;
		color: #6b7280;
	}

	.store-image {
		width: 36rpx;
		height: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
		color: #6b7280;
	}

	/* 票数和排名样式 */
	.vote-info {
		margin-bottom: 24rpx;
		display: flex;
		gap: 120rpx;
	}

	.vote-count {
		font-size: 24rpx;
		color: #374151;
		display: block;
		/* 独占一行 */
		margin-bottom: 8rpx;
	}

	.rank-wrap {
		display: flex;
		flex-direction: column;
		/* 排名和差距文字垂直排列 */
	}

	.rank-text {
		font-size: 24rpx;
		color: #FF9B36;
		/* 橙色排名文字 */
		font-weight: 500;
	}

	.rank-gap {
		font-size: 22rpx;
		color: #6b7280;
		margin-top: 4rpx;
	}

	/* 底部样式 */
	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 22rpx;
		padding: 20rpx 0;
		border-top: 1rpx solid #D8D8D8;
	}

	.publish-time {
		color: #6b7280;
	}

	.audit-status {
		color: #10b981;
		/* 绿色审核通过文字 */
		font-weight: 500;
	}

	.audit-status1 {
		color: #00A6FF;
		/* 绿色审核通过文字 */
		font-weight: 500;
	}

	.audit-status2 {
		color: #FF0000;
		/* 绿色审核通过文字 */
		font-weight: 500;
	}

	.foot {
		width: 100%;
		padding: 10rpx 0;
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	::v-deep .u-textarea--disabled {
		background: #fff !important;
		border: 1px solid #ccc !important;
	}

	::v-deep .u-input {
		background: #fff !important;
		border: 1px solid #ccc !important;
	}
</style>