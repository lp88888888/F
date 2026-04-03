<template>
	<cos-header title="发票抬头" :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
		:defaultNavBarheight="90"></cos-header>
	<view class="my-title-page">
		<!-- 抬头信息卡片 -->
		<view class="title-card">
			
			<view class="card-item">
				<text class="item-label">公司名称：</text>
				<up-input
				   placeholder="请输入内容"
				   v-model="value"
				   border="none"
				   clearable
				 ></up-input>
			</view>
			<view class="card-item">
				<text class="item-label">纳税人识别号：</text>
				<up-input
				   placeholder="请输入内容"
				   v-model="value"
				   border="none"
				   clearable
				 ></up-input>
			</view>
			<view class="card-item">
				<text class="item-label">地址：</text>
				<up-input
				   placeholder="请输入内容"
				   v-model="value"
				   border="none"
				   clearable
				 ></up-input>
			</view>
			<view class="card-item">
				<text class="item-label">电话：</text>
				<up-input
				   placeholder="请输入内容"
				   v-model="value"
				   border="none"
				   clearable
				 ></up-input>
			</view>
			<view class="card-item">
				<text class="item-label">开户行及账号：</text>
				<up-input
				   placeholder="请输入内容"
				   v-model="value"
				   border="none"
				   clearable
				 ></up-input>
			</view>
		</view>
		<!-- 操作按钮 -->
		<button class="operate-btn">确定</button>
	</view>
</template>
<script setup lang="ts">
	import { ref, onUnmounted } from 'vue';
	// 引入组件，这里假设 CosHeader 组件的类型后续补充，先简单断言
	import CosHeader from '@/components/customNavBar/index.vue';
	interface CosHeaderProps {
		title : string;
		backgroundColor : string;
		fontColor : string;
		fixed : boolean;
		defaultNavBarheight : number;
	}
	import theme from '@/utils/theme'
	// 响应式变量
	const backgroundColor = ref<string>('#FFFFFF');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const iscategory = ref<boolean>(false);
	const value = ref('');
</script>
<style scoped lang="scss" >
	/* 页面整体容器 */
	.my-title-page {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
		box-sizing: border-box;
	}

	/* 页面标题 */
	.page-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
		text-align: center;
	}

	/* 抬头信息卡片 */
	.title-card {
		background-color: #fff;
		border-radius: 12rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		padding:10rpx 30rpx 0;
		margin: 190rpx 0 40rpx;
	}

	/* 卡片内每一项 */
	.card-item {
		display: flex;
		align-items: center;
		height: 80rpx;
		border-bottom: 1px solid #eee;
		margin-bottom: 50rpx;
	}

	/* 每项的标签 */
	.item-label {
		font-size: 28rpx;
		color: #666;
		width: 200rpx;
	}

	/* 每项的值 */
	.item-value {
		font-size: 28rpx;
		color: #333;
		flex: 1;
		word-break: break-all;
	}

	/* 操作按钮 */
	.operate-btn {
		width: 90%;
		background: $bgLgColor;
		color: #fff;
		font-size: 28rpx;
		border-radius: 40rpx;
		padding: 10rpx 0;
		position: fixed;
		bottom: 100rpx;
		left: 50%;
		transform: translate(-50%);
	}
</style>