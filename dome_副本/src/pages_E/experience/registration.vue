<template>
	<view class="recruit-page">
		<up-navbar
		  title=" "
		  bgColor="transparent"
		 @leftClick="toBack" :placeholder="false" 
		></up-navbar>
		<!-- 顶部背景 -->
		<view class="top-bg">
			<view class="title-box">
				<image :src="imgUrl+'experience/ex_bg.jpg'" class="img"></image>
			</view>
		</view>
		<view class="box">
			<!-- 表单卡片 -->
			<view class="form-card">
				<image 
				    :src="imgUrl + 'experience/' + (auditStatus == 1 ? 'ex_xy.png' : auditStatus == 2 ? 'ex_xyl.png' : 'ex_xy2.png')" 
				    class="icon"
				  ></image>
				<text class="form-wenzi">{{auditStatus == 1 ? '恭喜您，报名成功！' : auditStatus == 2 ? '您的报名未通过，感谢参与！' : '您的报名待审核，请耐心等待！'}}</text>
				<view class="cause" v-if="auditStatus == 2 && remarkStatus ">原因：{{remarkStatus}}</view>
			</view>
			<!-- 活动说明 -->
			<view class="activity-info">
				<view class="info-title">活动说明</view>
				<view class="info-content">
					<view class="info-section">
						<text class="section-title">一、报名规则</text>
						<text class="section-content">用户在活动期间提交真实信息，经平台审核通过后，正式成为活动体验官。</text>
					</view>

					<view class="info-section">
						<text class="section-title">二、奖励机制</text>
						<!-- <text class="section-content">1. 报名奖励：成为活动体验官，即时发放 88 积分。</text> -->
						<text class="section-content">1. 基础奖励：提交每条合格建议经平台审核通过奖励 50 积分。</text>
						<text class="section-content">2. 活跃奖励：自然月内累计提交 5 条及以上合格建议，额外奖励 200 积分。</text>
					</view>

					<view class="info-section">
						<text class="section-title">三、建议规范及审核机制</text>
						<text class="section-content">1. 合格建议判定条件：</text>
						<text class="section-content">（1）内容规范：无广告推广、辱骂、闲聊等违规内容；</text>
						<text class="section-content">（2）明确建议场景、使用痛点或优化方向，可落地性强议；</text>
						<text class="section-content">（3）与历史提交的建议无高度相似（核心观点重合度＜80%）。</text>
						<text class="section-content">2. 审核与积分发放机制：</text>
						<text class="section-content">（1）用户提交建议后，平台将在 3-5 个工作日内完成审核；</text>
						<text class="section-content">（2）积分可用于后续平台积分商城商品兑换；</text>
						<text class="section-content">（3）积分自发放之日起 12 个月内有效，逾期未使用自动失效；</text>
						<text class="section-content">（4）参与本次活动即视为同意本规则全部内容，平台拥有活动最终解释权。</text>
					</view>
				</view>
			</view>

			<!-- 报名按钮 -->
			<view class="foot" v-if="auditStatus == 2">
			  <view class="submit-btn">
				<view @click="submitForm" class="btn">再次报名</view>
			  </view>
			</view>
			<view class="foot-btn" v-if="auditStatus == 1">
				<view class="btn-submit">
					<view @click="toNav('/pages_E/experience/suggest')" class="btn1">我的建议</view>
					<view @click="toNav('/pages_E/experience/information')" class="btn">提建议</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { imgUrl } from "@/config";
	import { onLoad } from '@dcloudio/uni-app'
	import { toNav,toBack } from '@/utils/route';
	import { experienceInfo } from '@/api/home'
	// 定义表单数据类型
	interface FormData {
		phone : string
		checkedFunctions : string[]
		reason : string
		functionList : string[]
	}

	// 表单数据
	const phone = ref(uni.getStorageSync('userInfo').mobile)
	const checkedFunctions = ref<string[]>([])
	const reason = ref<string>('')
	const functionList : string[] = [
		'确定功能', '服务功能', '车辆服务',
		'积分兑换', '通行功能', '加油充电',
		'业务办理', '违章查询', 'AI数字人'
	]
	const auditStatus = ref<string>('')
	const remarkStatus = ref<string>('')

	// 表单提交
	const submitForm = () => {
		uni.navigateTo({
			url: '/pages_E/experience/index?from=edit'
		})
	}
	
	// 列表
	const list = ref([])
	const getList = async () => {
		const res = await experienceInfo()
		auditStatus.value = res.data.auditStatus
		remarkStatus.value = res.data.remark
	}
	onLoad(async () => {
	  await getList()
	})
</script>

<style scoped lang="scss">
	.box {
		width: 100%;
		border-radius: 36rpx 36rpx 0 0;
		margin-top: -50px;
		z-index: 99;
		overflow: hidden;
		position: relative;
		background: linear-gradient(180deg, #E7ECF6 0%, #FFFFFF 100%);
		box-sizing: border-box;
		box-shadow: 0px -5px 13px 0px rgba(0, 0, 0, 0.1);
	}

	.recruit-page {
		min-height: 100vh;
		padding-bottom: 60rpx;
	}

	.top-bg {
		width: 100%;
		.title-box {
			width: 100%;

			.main-title {
				font-size: 48rpx;
				font-weight: bold;
				color: #fff;
				display: block;
				margin-bottom: 16rpx;
			}

			.sub-title {
				font-size: 28rpx;
				color: #fff;
				display: block;
				margin-bottom: 12rpx;
			}

			.desc {
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.8);
				display: block;
				width: 80%;
				margin: 0 auto;
			}
		}

		.floating-icon {
			position: absolute;
			right: 60rpx;
			top: 40rpx;
			z-index: 2;

			.badge-img {
				width: 140rpx;
				height: 140rpx;
				animation: float 3s ease-in-out infinite;
			}
		}
	}

	@keyframes float {

		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-10rpx);
		}
	}

	.form-card {
		width: 85%;
		margin: 40rpx auto 40rpx;
		display: flex;
		flex-direction: column;
		/* 主轴改为垂直方向 */
		align-items: center;
		/* 此时交叉轴是水平方向，实现水平居中 */
		justify-content: center;
		/* 主轴（垂直方向）居中 */
		gap: 12rpx;
		/* 垂直方向的间距 */
		background-color: #fff;
		border-radius: 24rpx;
		padding: 10rpx 30rpx 40rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
		position: relative;

		.form-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 40rpx;
			padding-left: 10rpx;
		}

		.form-tyg {
			margin-bottom: 40rpx;
		}

		.form-item {
			margin-bottom: 40rpx;

			.input-field {
				width: 100%;
				height: 80rpx;
				border: 1px solid #e5e6eb;
				border-radius: 12rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
			}

			.checkbox-group {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				gap: 30rpx;

				.checkbox-item {
					margin-bottom: 20rpx;
					width: 28%;
				}
			}

			.textarea-field {
				width: 100%;
				border: 1px solid #e5e6eb;
				border-radius: 12rpx;
				padding: 20rpx;
				font-size: 28rpx;
				min-height: 200rpx;
			}

			.word-count {
				font-size: 24rpx;
				color: #999;
				float: right;
				margin-top: 10rpx;
			}
		}
	}

	.activity-info {
		width: 85%;
		margin: 0 auto 110rpx;
		background-color: #fff;
		border-radius: 24rpx;
		padding: 40rpx 30rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);

		.info-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30rpx;
			padding-left: 10rpx;
		}

		.info-content {
			font-size: 26rpx;
			color: #666;
			line-height: 1.8;

			.info-section {
				margin-bottom: 30rpx;

				.section-title {
					font-weight: bold;
					color: #333;
					display: block;
					margin-bottom: 15rpx;
				}

				.section-content {
					display: block;
					margin-bottom: 10rpx;
					text-indent: 52rpx;
				}

				.section-content:first-of-type {
					text-indent: 0;
				}
			}
		}
	}

	.foot{
		width: 100%;
		height: 120rpx;
		background: #fff;
		position: fixed;
		bottom: 0;
		padding-top: 30rpx;
	}
	.submit-btn {
	  width: 90%;
	  margin: 0 auto;
	}
	.btn {
	  height: 90rpx;
	  line-height: 90rpx;
	  font-size: 28rpx;
	  border-radius: 10rpx;
	  color: #fff;
	  background: #171715;
	  text-align: center;
	}

	

	.form-item-phone {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 60rpx;
	}

	.label-text {
		font-weight: 500;
		font-size: 32rpx;
		color: #000000;
		font-weight: 500;
	}

	.num {
		color: #E53D3D;
		font-size: 32rpx;
		margin-right: 15rpx;
	}

	.phone {
		color: #000000;
	}

	.dx {
		font-size: 26rpx;
		color: #2C69C3;
	}

	.item-label {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.wenzi {
		font-size: 22rpx;
		color: #B7B9C3;
		margin-bottom: 20rpx;
	}

	::v-deep .u-textarea {
		height: 250rpx;
	}

	.img {
		width: 100%;
		height: 540rpx;
	}

	.icon {
		width: 180rpx;
		height: 180rpx;
	}

	.form-wenzi {
		color: #000;
		font-size: 30rpx;
		object-fit: contain;
	}
	.foot-btn{
		width: 100%;
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	.btn-submit{
		width: 85%;
		margin: 30rpx auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.btn, .btn1{
			width: 45%;
		}
	}
	.btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 28rpx;
		border-radius: 10rpx;
		color: #fff;
		border: 2rpx solid #171715;
		background-color: #171715;
		text-align: center;
	}
	
	.btn1 {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 28rpx;
		border-radius: 10rpx;
		color: #000;
		border: 2rpx solid #000000;
		text-align: center;
	}
	.cause{
		font-size: 26rpx;
		color: #808080;
	}

</style>
