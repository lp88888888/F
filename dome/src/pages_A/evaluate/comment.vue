<template>
	<view class="integral-detail">
		<view class="haden-box">
			<view class="haden-box-1">
				商品<u-rate :count="5" :activeColor='themeStore.themeColors.$primaryColor' inactiveColor='#F8F9FB' size="18" gutter="15"
					:value="shopnum"></u-rate>
			</view>
			<view class="haden-box-1">
				快递<u-rate :count="5" :activeColor='themeStore.themeColors.$primaryColor' inactiveColor='#F8F9FB'  size="18" gutter="15"
					:value="kuaidinum"></u-rate>
			</view>
		</view>
		<view class="baby-box">
			<view class="baby-box-1">
				评价
			</view>
			<u--textarea v-model="contenttext" height="180" border="0"
				style="background-color:#F7F8F9 ;margin-bottom: 40rpx;" placeholder="点击输入其他评价内容"></u--textarea>
			<view class="baby-box-1">
				添加图片
			</view>
			<view class="page">
				<image-uploader :max="6" :upload-url="'https://your-api.com/upload'"
					:header="{ 'Authorization': 'Bearer ' + token }" @success="onUploadSuccess" @remove="onRemove"
					@fail="onFail" />
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import theme from '@/utils/theme'
	import ImageUploader from '@/components/ImageUploader'
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const shopnum = ref(3)
	const kuaidinum = ref(2)
	const contenttext = ref('')
	const onUploadSuccess = (data, index) => {
		console.log('上传成功:', data, '索引:', index)
	}

	const onRemove = (item, index) => {
		console.log('删除图片:', item)
	}

	const onFail = (msg, index) => {
		console.error('上传失败:', msg)
	}
</script>

<style scoped lang="scss">
	.integral-detail {
		height: calc(100vh - 44rpx);
		padding: 30rpx 32rpx;
		background: #F1EFEC;
	}

	.haden-box {
		height: 106rpx;
		padding: 50rpx 35rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.haden-box-1 {
		display: flex;
		align-items: center;
	}

	.baby-box {
		padding: 50rpx 35rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		margin-top: 30rpx;

		.baby-box-1 {
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
			margin-bottom: 30rpx;
		}
	}
</style>