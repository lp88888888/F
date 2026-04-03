<template>
	<view class="address-edit-page">
		<!-- 表单区域 -->
		<view class="ts-box" style="margin-bottom: 24rpx;" >
			<image :src="imgUrl+'img/gantan.png'" mode=""></image>
			<text>温馨提示:</text>仅支持领取CPC通行卡用户预约，且只能预...
		</view>
		<view class="form-card">
			<view class="form-item">
				<text class="label">车牌号</text>
				<input v-model="formData.name" class="input" type="number" placeholder="请选择运输车辆车牌号"
					placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
			</view>
			<view class="form-item">
				<text class="label">驾驶员电话</text>
				<input v-model="formData.name" class="input" type="number" placeholder="请输入驾驶员电话"
					placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />

			</view>

		</view>
		<text class="text-a">运输路线(陕西省内)</text>
		<view class="form-card">
			<view class="form-item">
				<text class="label">高速入口站</text>
				<input v-model="formData.email" class="input" placeholder="请选择高速入口站" placeholder-class="placeholder"
					placeholder-style="color: #C8C9CB" />
			</view>
			<view class="form-item">
				<text class="label">高速出口站</text>
				<view class="input">
					<input v-model="formData.taxid" class="input" type="number" placeholder="请选择高速出口站"
						placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
				</view>
			</view>
			<view class="form-item">
				<text class="label">运输货物</text>
				<view class="input">
					<input v-model="formData.taxid" class="input" type="number" placeholder="请选择运输货物"
						placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
				</view>
			</view>
			<view class="form-item">
				<text class="label">车货总量(kg)</text>
				<view class="input">
					<input v-model="formData.taxid" class="input" type="number" placeholder="请选择车货总量(kg)"
						placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
				</view>
			</view>
		</view>
		<view class="lookimg">
			<text class="text-a">运输照片</text>
			<view class="lookimg-1" style="margin-bottom: 34rpx;" >
				<image :src="imgUrl+'img/look.png'" mode=""></image>
				查看示例照片
			</view>
		</view>
		<view class="ts-box">
			<image :src="imgUrl+'img/gantan.png'" mode=""></image>
			<text>温馨提示:</text>仅支持领取CPC通行卡用户预约，且只能预...
		</view>
		<view class="">
			
		</view>
		<!-- 保存按钮 -->
		<view class="bottom-bar">
			<view class="button-left">
				<view class="button-quxiao">
					取消
				</view>
				<view class="button-zancun">
					暂存
				</view>
			</view>
			<view class="button-shangbao">
				预约上报
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import { imgUrl } from '../../../config';
	// 表单数据类型
	interface FormData {
		name : string
		type : string
		taxid : string
		email : string
	}

	// 响应式数据
	const formData = reactive<FormData>({
		name: '',
		type: '1',
		taxid: '',
		email: '',
	})
</script>

<style scoped lang="scss">
	.lookimg{
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-weight: 500;
		font-size: 28rpx;
		color: $color;
		
		image{
			width: 38rpx;
			height: 32rpx;
			margin-right: 14rpx;
			vertical-align: middle;
		}
	}
	.text-a{
		display: inline-block;
		font-weight: 500;
		font-size: 28rpx;
		color: #666666;
		margin-bottom: 34rpx;
	}
	.ts-box {
		height: 64rpx;
		background: #FFF2E1;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #000;
		line-height: 64rpx;
		padding-left: 30rpx;
		text {
			color: $color;
		}
		image{
			width: 32rpx;
			height: 32rpx;
			margin-right: 20rpx;
		}
	}

	.address-edit-page {
		padding: 40rpx 32rpx 0;
		background-color: #F1EFEC;
		min-height: 100vh;
		box-sizing: border-box;

		.form-card {
			width: 686rpx;
			background: #FFFFFF;
			border-radius: 26rpx;
			margin-bottom: 40rpx;
		}

		.form-item-label {
			padding: 40rpx 0 40rpx 30rpx;
			display: flex;
			justify-content: flex-start;

			.label {

				width: 170rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #000000;

			}


		}

		.form-item {
			display: flex;
			align-items: center;
			padding: 40rpx 0 40rpx 62rpx;
			border-bottom: 1rpx solid #eee;

			.label {
				width: 170rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #7F7F7F;
				position: relative;
				display: inline-block;
			}

			.label::before {
				content: "*";
				color: red;
				position: absolute;
				left: -20rpx;
			}

			.input {
				flex: 1;
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 28rpx;
				color: #000000;
				padding-right: 20rpx;

				&.full-width {
					margin-left: 170rpx;
				}

				.value {
					flex: 1;

					&.placeholder {
						color: #C8C9CB;
					}
				}
			}
			.placeholder {
				color: #C8C9CB;
			}
		}
		.tag-container {
			display: flex;
			flex-wrap: wrap;
			flex: 1;
			.tag {
				min-width: 130rpx;
				height: 56rpx;
				padding: 10rpx 30rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				background: #F6F6F6;
				border-radius: 28rpx;
				font-size: 28rpx;
				color: #000000;
				box-sizing: border-box;
				text-align: center;
				

				&.active {
					background-color: #F4AA31;
					color: #fff;
				}
			}
			.custom-input {
				width: 150rpx;
				height: 60rpx;
				background-color: #f5f5f5;
				border-radius: 30rpx;
				padding: 0 20rpx;
				font-size: 26rpx;
			}
		}

		.bottom-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			display: flex;
			height: 160rpx;
			align-items: center;
			justify-content: space-between;
			padding-left: 30rpx;
			padding-right: 30rpx;
			.button-left{
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.button-quxiao{
					width: 160rpx;
					height: 70rpx;
					background: #F1F1F1;
					border-radius: 48rpx 48rpx 48rpx 48rpx;
					text-align: center;
					line-height: 70rpx;
					margin-right: 30rpx;
				}
				.button-zancun{
					width: 160rpx;
					height: 60rpx;
					background: #FFFFFF;
					border-radius: 48rpx 48rpx 48rpx 48rpx;
					border: 1rpx solid $color;
					text-align: center;
					line-height: 60rpx;
					font-weight: 400;
					font-size: 28rpx;
					color: $color;
				}
				
			}
			.button-shangbao{
				width: 192rpx;
				height:60rpx;
				background: $bgLgColor;
				border-radius: 48rpx 48rpx 48rpx 48rpx;
				text-align: center;
				line-height: 60rpx;
				font-weight: 700;
				font-size: 28rpx;
				color: #FFFFFF;
			}
			
		}
	}
</style>