<template>
	<view class="listCard">
		<view class="listCard-title">商品 <text></text></view>
		<view class="catTab">
			<scroll-view class="catTab-left" :style="{height}" :scroll-y="true">
				<view class="tabItem" :class="{active:selectInde == index}" v-for="(item,index) in tabList" :key="index" @click="tabClick(item,index)">
					{{item.name}}
					<view v-if="selectInde == index" class="active-icon"></view>
				</view>
			</scroll-view>
			
			<scroll-view class="catTab-right" :style="{height}" :scroll-y="true">
				<view class="listItem">
					<GoodsListItemVue ></GoodsListItemVue>
					<up-gap height="10"></up-gap>
				</view>
				<!-- <view class="listItem">
					<GoodsListItemVue></GoodsListItemVue>
					<up-gap height="10"></up-gap>
				</view>
				<view class="listItem">
					<GoodsListItemVue></GoodsListItemVue>
					<up-gap height="10"></up-gap>
				</view>
				<view class="listItem">
					<GoodsListItemVue></GoodsListItemVue>
					<up-gap height="10"></up-gap>
				</view>
				<view class="listItem">
					<GoodsListItemVue></GoodsListItemVue>
					<up-gap height="10"></up-gap>
				</view> -->
			</scroll-view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import {ref} from 'vue';
	import GoodsListItemVue from './GoodsListItem.vue';
	const selectInde = ref(0);
	const props = defineProps({
		height:{
			type:String,
			default:'60vh',
		},
		stockId:{
			type:String,
            default: false
		},
	});
	const tabList = ref([
		{name:'全部'},
	]);
	const tabClick = (item,index)=>{
		console.log(item);
		selectInde.value = index
	}
</script>

<style lang="scss" scoped>
	.listCard{
		width: 100%;
		.listCard-title{
			width: 100%;
			height: 88rpx;
			background: #FFFFFF;
			border-radius: 20rpx 20rpx 0rpx 0rpx;
			line-height: 88rpx;
			padding: 0 33rpx;
			box-sizing: border-box;
			font-weight: 800;
			font-size: 32rpx;
			color: #000000;
			border-bottom: 1rpx solid #E0E0E0;
			text{
				font-size: 24rpx;
				font-weight: 500;
			}
		}
	}
	.catTab{
		width: 100%;
		display: flex;
		justify-content: space-between;
		background:$pageBgColor;
		.catTab-left{
			width: 160rpx;
			// height: 50vh;
			.tabItem{
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				font-size: 26rpx;
				color: #666666;
				position: relative;
			}
			.active{
				font-weight: bold;
				color: $color;
				background: #FFFFFF;
				.active-icon{
					position: absolute;
					left: 0;
					top: 25rpx;
					width: 6rpx;
					height: 50rpx;
					background: $color;
					border-radius: 0rpx 4rpx 4rpx 0rpx;
				}
			}
		}
		.catTab-right{
			width: calc(100% - 160rpx);
			// height: 50vh;
		}
	}
</style>