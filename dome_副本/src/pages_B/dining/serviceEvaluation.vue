<template>
	<view class="page-container">
		<view class="pageView">
			<view class="card">
				<view class="font1">您对商家/菜品满意吗？</view>
				<view class="minCard fl-ce-sb">
					<image :src="imgUrl+'hotel-banner.png'" mode=""></image>
					<view  class="minCard-cnet">
						<view class="font2">宝鸡西服务区餐厅</view>
						<view class="font3 m-t-20">宝鸡西服务区</view>
					</view>
				</view>
				<view class="pfBox fl-al-ce">
					<text class="font2 m-r-20">总体</text>
					<u-rate count="5" v-model="value" inactiveColor="#FF9600" activeColor="#FF9600"  size="20"></u-rate>
				</view>
				<view class="pfBox fl-al-ce">
					<text class="font2 m-r-20">口味</text>
					<u-rate count="5" v-model="value" inactiveColor="#FF9600" activeColor="#FF9600"  size="20"></u-rate>
				</view>
				<view class="pfBox fl-al-ce">
					<text class="font2 m-r-20">服务</text>
					<u-rate count="5" v-model="value" inactiveColor="#FF9600" activeColor="#FF9600"  size="20"></u-rate>
				</view>
				<view class="pfBox fl-al-ce">
					<text class="font2 m-r-20">环境</text>
					<u-rate count="5" v-model="value" inactiveColor="#FF9600" activeColor="#FF9600"  size="20"></u-rate>
				</view>
			</view>
			<view class="card m-t-30">
				<view class="font2">评价</view>
				<view class="textsView m-t-30">
					<up-textarea v-model="value1" border="none" placeholder="输入对本商家或菜品的其他评价，供大家参考" :customStyle="{background:'transparent'}"></up-textarea>
				</view>
				<view class="font2 m-t-30">添加图片</view>
				<view class="m-t-30">
					<image-uploader :max="6" :upload-url="'https://your-api.com/upload'"
						:header="{ 'Authorization': 'Bearer ' }" @success="onUploadSuccess" @remove="onRemove"
						@fail="onFail" />
				</view>
			</view>
			<view class="card m-t-30 fl-ce-sb">
				<view class="names fl-al-ce">
					<image :src="imgUrl+'dsewf.png'" mode=""></image>
					<text>美味时蔬盖浇饭</text>
				</view>
				<view class="fl-al-ce">
					<view class="dzIcon fl-al-ce" @click="dzValue=2">
						<image :src="imgUrl+`static/B-din-ca-${dzValue==2?'true':'false'}-icon.png`" mode=""></image>
						<text>踩</text>
					</view> 
					<view class="dzIcon fl-al-ce m-l-20" @click="dzValue=1">
						<image :src="imgUrl+`static/B-din-dz-${dzValue==1?'true':'false'}-icon.png`" mode=""></image>
						<text>赞</text>
					</view>
				</view>
			</view>
		</view>
		<view class="fiexView">
			<view class="fiexView-but">立即提交</view>
		</view>
		<up-gap height="90"></up-gap>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import ImageUploader from '@/components/ImageUploader'
	const value = ref(3);
	const value1 = ref('');
	const dzValue = ref(1); // 1赞，2踩
	
	
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

<style lang="scss" scoped>
	.page-container{
		min-height: 100vh;
		background: $pageBgColor;
	}
	.names{
	 text{
		 font-weight: 500;
		 font-size: 28rpx;
		 color: #333333;
	 }
	 image{
		 width: 96rpx;
		 height: 96rpx;
		 background: #F5F5F5;
		 border-radius: 16rpx;
		 margin-right: 20rpx;
	 }
	}
	.dzIcon{
		image{
			width: 32rpx;
			height: 32rpx;
			margin-right: 10rpx;
		}
		text{
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
		}
	}
	.textsView{
		width: 100%;
		min-height: 250rpx;
		background: #F7F8F9;
		border-radius: 20rpx;
		padding: 14rpx;
		box-sizing: border-box;
	}
	.font1{
		font-weight: bold;
		font-size: 30rpx;
		color: #000000;
		line-height: 30rpx;
	}
	.font2{
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
		line-height: 28rpx;
	}
	.font3{
		font-weight: 500;
		font-size: 24rpx;
		color: #666666;
		line-height: 24rpx;
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.pfBox{
		height: 70rpx;
	}
	.card{
		width: 100%;
		padding: 35rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
	}
	.minCard{
		width: 100%;
		padding: 21rpx 24rpx;
		box-sizing: border-box;
		background: #F7F8F9;
		border-radius: 20rpx;
		margin-top: 30rpx;
		image{
			width: 88rpx;
			height: 88rpx;
			border-radius: 20rpx;
		}
		.minCard-cnet{
			width: calc(100% - 114rpx);
		}
	}
	.fiexView{
		width: 750rpx;
		height: 158rpx;
		background: #FFFFFF;
		padding: 15rpx 32rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 9;
		.fiexView-but{
			width: 100%;
			height: 88rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 44rpx;
			line-height: 88rpx;
			text-align: center;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
		}
	}
</style>