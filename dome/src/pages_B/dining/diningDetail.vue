<template>
	<view class="page-container">
		<up-sticky z-index="8888">
			<view :style="{background: topBgColor}">
				<up-navbar title="餐厅详情" bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" placeholder :fixed="false" :titleStyle="{fontWeight:'bold'}"></up-navbar>
			</view>
		</up-sticky>
		<view class="backOrderColor"></view>
		
		<view class="pageView">
			<view class="cards tabs">
				<view class="tabs-item" v-for="(item,index) in tabsList" :key="index" @click="tabsClick(item)">
					<view :class="['tabs-item-text',item.id == tabsIndex?'activeText':'']">{{item.title}}</view>
					<view class="tabs-item-line" v-if="item.id == tabsIndex"></view>
				</view>
			</view>
			<view class="cards m-t-20" style="padding: 46rpx 34rpx;">
				<view class="text m-b-10">西贝餐饮集团（简称“西贝”）创立于1988年，从一家内蒙古临河的“黄土坡小吃店”开始，经过36年发展，西贝已经成为中国头部餐饮品牌之一。</view>
				<up-image :src="imgUrl+'static/din-xb-2.png'" width="100%" height="300rpx" radius="26rpx" lazyLoad></up-image>
				<view class="text m-t-10 m-b-10">截至2024年2月，西贝已经拥有近400家直营门店，遍布中国近60个城市，员工2万余人，每年服务超6000万人次用餐 [47]。2021年经权威机构评估，西贝获“服务家庭超1亿人次”及“中餐领先”认证 [10-11]。自创立以来，西贝始终坚持“好吃”战略，选用优质食材，让顾客得到高品质的消费体验。</view>
				<view class="imgs">
					<up-image :src="imgUrl+'static/din-xb-1.png'" width="300rpx" height="300rpx" radius="26rpx" lazyLoad></up-image>
					<up-image :src="imgUrl+'static/din-xb-3.png'" width="300rpx" height="300rpx" radius="26rpx" lazyLoad></up-image>
				</view>
			</view>
		</view>
		
		<up-gap height="10"></up-gap>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import {decimalPointDivision} from "@/utils/util";
	import { onPageScroll } from '@dcloudio/uni-app';
	import theme from '@/utils/theme';
	const topBgColor = ref<string>('transparent');
	const tabsIndex = ref<number>(1);
	const tabsList = ref<any>([
		{id:1,title:'餐厅介绍',icon:''},
		{id:2,title:'菜品风格',icon:''},
		{id:3,title:'餐厅故事',icon:''},
	]);
	const tabsClick = (item:any)=>{
		tabsIndex.value = item.id;
	}
	onPageScroll((e) =>{
	  if (e.scrollTop < 1) {
		  topBgColor.value = 'transparent';
	  } else {
		  topBgColor.value = "#FFFFFF"
	  }
	})
</script>

<style lang="scss" scoped>
	.page-container{
		width: 100%;
		min-height: 100vh;
		background: $pageBgColor;
	}
	.text{
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
		line-height: 56rpx;
	}
	.imgOne{
		width: 100%;
		height: 300rpx;
		border-radius: 20rpx;
	}
	.pageView{
		padding: 0 32rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}
	.imgs{
		display: grid;
		grid-template-columns: repeat(2,300rpx);
		grid-gap: 26rpx;
	}
	.tabs{
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		.tabs-item{
			display: inline-block;
			position: relative;
			height: 100rpx;
			.tabs-item-text{
				line-height: 100rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #666666;
			}
			.activeText{
				font-weight: bold;
				color: #000000;
			}
			.tabs-item-line{
				width: 50rpx;
				height: 8rpx;
				background: $bgLgColor;
				border-radius: 4rpx 4rpx 0rpx 0rpx;
				position: absolute;
				bottom: 0;
				left: calc((100% - 50rpx) / 2);
			}
		}
	}
	
	
	
	.cards{
		background: #FFFFFF;
		border-radius: 26rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		.cards-title{
			padding-top: 38rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}
	}
	.backOrderColor{
		width: 750rpx;
		height: 771rpx;
		position: absolute;
		top: 0;
		left: 0;
		background: $bgTemToPageColor;
	}
</style>