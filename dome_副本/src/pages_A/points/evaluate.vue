<template>
	<view class="page-container">
		<view class="details-eva">
			<view class="eva-item flex flex-col m-b-30">
				<view class="flex just-sb ali-cen m-b-25">
					<view class="flex ali-cen">
						<image class="icon-44 br50 m-r-15" :src="imgUrl+'tx.jpg'" mode=""></image>
						<text class="fs-24 fw-b">少年的你0136</text>
					</view>
					<text class="fs-24 col6">2025-03-10</text>
				</view>
				<view class="eva-info">
					酒店有停车场，酒店旁边就是万达广场，购物方便，吃饭方便，前台服务热情，酒店环境不错值得推荐。
				</view>
				<view class="eva-img-box flex just-sb">
					<image class="eva-img" v-for="(item, index) in list7" :key="index" :src="item" mode=""></image>
				</view>
			</view>
			<view class="eva-item flex flex-col m-b-30">
				<view class="flex just-sb ali-cen m-b-25">
					<view class="flex ali-cen">
						<image class="icon-44 br50 m-r-15" :src="imgUrl+'tx.jpg'" mode=""></image>
						<text class="fs-24 fw-b">少年的你0136</text>
					</view>
					<text class="fs-24 col6">2025-03-10</text>
				</view>
				<view class="eva-info">
					酒店有停车场，酒店旁边就是万达广场，购物方便，吃饭方便，前台服务热情，酒店环境不错值得推荐。
				</view>
				<view class="eva-img-box flex just-sb">
					<image class="eva-img" v-for="(item, index) in list7" :key="index" :src="item" mode=""></image>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script setup lang="ts">
	import {ref,reactive,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import { onLoad,onReachBottom } from '@dcloudio/uni-app';
	const list7 = reactive([
		'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/fwe.png',
		'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/dsewf.png',
		'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/ge.png',
	]);
	const dataList = ref([]);

	const listQuery = ref({
		pageNum:1,
		pageSize:10,
	});
	const total = ref(0);

	const init = ()=>{
		listQuery.value.pageNum = 1;
		getData();
	};
	// 获取数据
	const getData = async ()=>{

	};
	onLoad(()=>{
		init();
	})
	onReachBottom(()=>{
		if(listQuery.value.pageNum * listQuery.value.pageSize < total.value){
			getData()
		}
	})
</script>

<style lang="scss" scoped>
	.page-container{
		min-height: 100vh;
		background: #F1EFEC;
	}
	.details-eva {
		padding: 30rpx 30rpx;
		box-sizing: border-box;
	
		.eva-item {
			background: #FFFFFF;
			padding-bottom: 40rpx;
			border-bottom: 1rpx solid #ECECEC;
			padding: 25rpx ;
			box-sizing: border-box;
			border-radius: 20rpx;
	
			.eva-info {
				font-weight: 500;
				font-size: 26rpx;
				color: #333333;
				line-height: 50rpx;
			}
	
			.eva-img-box {
				border-radius: 20rpx;
				height: 196rpx;
				margin-top: 25rpx;
				overflow: hidden;
	
				.eva-img {
					width: 196rpx;
					height: 196rpx;
					font-weight: 500;
					font-size: 26rpx;
					color: #333333;
					line-height: 50rpx;
				}
			}
		}
	}
</style>