<template>
	<view class="">
		<up-sticky>
			<view id="navBar" class="navBack">
				<up-navbar title="提交订单" bgColor="transparent" @leftClick="toBack" placeholder :fixed="false" :titleStyle="{fontWeight:'600'}"></up-navbar>
				<view class="search">
					<up-search placeholder="请输入车辆名称" shape="round" searchIconColor="#333333" bgColor="#FFFFFF" v-model="keyword" :showAction="false"></up-search>
				</view>
			</view>
		</up-sticky>
		<view class="topBack"></view>
		<view id="cardId" class="card">
			<view class="fl-ce-sb">
				<up-image :src="imgUrl+'static/wx-banner.png'" width="130rpx" height="130rpx" radius="8" lazy-load></up-image>
				<view class="busiCard">
					<view class="nameBox">安康宏晖鑫达商贸有限公司</view>
					<view class="timeBox m-t-25">营业时间：8:00-20:00</view>
				</view>
			</view>
			<up-line color="#EEEEEE" margin="30rpx 0"></up-line>
			<view class="fl-ce-sb">
				<view class="fl-al-fs">
					<u-icon :name="imgUrl+'static/B-direct-position.png'" width="20rpx" height="24rpx"></u-icon>
					<view style="padding-left: 15rpx;">
						<view class="addrNam">西安市雁塔区西沣公路58号</view>
						<view class="addrText m-t-20">距您2.6km</view>
					</view>
				</view>
				<view class="fl-al-ce">
					<view class="iconView">
						<u-icon :name="imgUrl+'static/addr-icon.png'" size="23"></u-icon>
						<text class="m-t-5">导航</text>
					</view>
					<view class="iconView m-l-25">
						<u-icon :name="imgUrl+'static/tel-icon-000.png'" size="23"></u-icon>
						<text class="m-t-5">电话</text>
					</view>
				</view>
			</view>
		</view>
		<up-gap height="15" ></up-gap>
		<view class="fl-ce-sb" :style="{height:`calc(100vh - ${maxHeight}px)`}">
			<scroll-view class="tabBox" :scroll-y="true" :style="{height:`calc(100vh - ${maxHeight}px)`}">
				<view :class="['tabBox-item',selectId == item.id?'tabActive':'']" :style="{borderRadius:index == 0?'20rpx 0 0 0':''}" v-for="(item,index) in tabsList" :key="index" @click="tabChange(item)">
					<view class="tabBox-item-name">{{item.name}}</view>
					<view class="tabBox-item-text">{{item.startPrice}}</view>
					<view class="tabBox-item-line" v-if="selectId == item.id"></view>
				</view>
			</scroll-view>
			<scroll-view class="lisBox" :scroll-y="true" :style="{height:`calc(100vh - ${maxHeight}px)`}">
				<view v-for="(item,index) in dataList" :key="index">
					<view class="lisBox-item fl-ce-sb" :style="{borderRadius:index == 0?'0 20rpx 0 20rpx':''}" @click="toNav('/pages_B/rentCar/carDetail')">
						<up-image :src="imgUrl+'del/car-img.png'" width="200rpx" height="152rpx" lazy-load></up-image>
						<view class="lisBox-item-center">
							<view class="lisBox-item-name">{{item.name}}</view>
							<view class="lisBox-item-text m-tb-25">{{item.text}}</view>
							<view class="fl-ce-sb">
								<view class="lisBox-item-price">日均￥<text>{{item.price}}</text> 起</view>
								<view class="lisBox-item-but">预定</view>
							</view>
						</view>
					</view>
					<up-gap height="10" bgColor="#F1EFEC"></up-gap>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import { useElementRects} from '@/utils/useElementRect';
	import { onReady } from '@dcloudio/uni-app';
	const { queryAll } = useElementRects(['#navBar','#cardId'])
	const maxHeight = ref()
	const keyword = ref<string>('');
	
	const selectId = ref(1);
	const tabsList = ref([
		{id:1,name:'全部车型',startPrice:'¥40起'},
		{id:2,name:'经济型',startPrice:'¥36起'},
		{id:3,name:'经济型',startPrice:'¥40起'},
		{id:4,name:'商务型',startPrice:'¥60起'},
		{id:5,name:'豪华型',startPrice:'¥351起'},
		{id:6,name:'SUV',startPrice:'¥80起'},
		{id:7,name:'MPV',startPrice:'¥150起'},
	]);
	const dataList = ref([
		{name:'捷达VA3',text:'轿车丨5座丨1.6丨自动',price:'68'},
		{name:'丰田卡罗拉',text:'轿车丨5座丨1.5丨自动',price:'70'},
		{name:'大众途岳',text:'轿车丨5座丨1.4丨自动',price:'85'},
		{name:'雪佛兰沃兰多',text:'轿车丨7座丨1.3丨自动',price:'60'},
		{name:'雪佛兰沃兰多',text:'轿车丨7座丨1.3丨自动',price:'60'},
		{name:'雪佛兰沃兰多',text:'轿车丨7座丨1.3丨自动',price:'60'},
		{name:'雪佛兰沃兰多',text:'轿车丨7座丨1.3丨自动',price:'60'},
	]);
	const tabChange = (item) =>{
		selectId.value = item.id;
	};
	const handleQuery = async () => {
		try{
			const result =await queryAll() 
			if(result){
				console.log(result);
				let total  = 15
				for(let i in result){
					if(result[i]){
						total += result[i].height
					}
				}
				maxHeight.value = total;
			}
		}catch(err){
			console.log('卡片尺寸shib:', err)
		}
	}
	onReady(()=>{
		nextTick(() => {
			setTimeout(() => {
			  handleQuery()
			}, 300)
		})
	})
</script>

<style lang="scss">
	page{
		background: $pageBgColor;
	}
	.topBack{
		width: 750rpx;
		height: 771rpx;
		background: linear-gradient(0deg, #F1EFEC, #FFECCE);
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.search{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.navBack{
		background: linear-gradient(to bottom, #FFEDCE, #FDF2E0);
	}
	.card{
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		margin: 0 auto;
		padding: 30rpx;
		box-sizing: border-box;
	}
	.busiCard{
		width: calc(100% - 150rpx);
		.nameBox{
			font-weight: bold;
			font-size: 30rpx;
			color: #000000;
			line-height: 30rpx;
		}
		.timeBox{
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
			line-height: 24rpx;
		}
	}
	.iconView{
		text-align: center;
		font-weight: 500;
		font-size: 22rpx;
		color: #333333;
	}
	
	.addrNam{
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
		line-height: 24rpx;
	}
	.addrText{
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
	}
	.tabBox{
		width: 136rpx;
		background: $pageBgColor;
		.tabBox-item{
			width: 136rpx;
			height: 114rpx;
			position: relative;
			padding: 30rpx 20rpx;
			box-sizing: border-box;
			.tabBox-item-name{
				font-weight: bold;
				font-size: 24rpx;
				color: #000000;
			}
			.tabBox-item-text{
				font-weight: 500;
				font-size: 24rpx;
				color: #747574;
			}
			.tabBox-item-line{
				position: absolute;
				left: 0;
				top: calc((114rpx - 50rpx) / 2);
				width: 6rpx;
				height: 50rpx;
				background: #FF9600;
				border-radius: 0rpx 4rpx 4rpx 0rpx;
			}
		}
		.tabActive{
			background: #FFFFFF !important;
			.tabBox-item{
				padding: 32rpx;
				box-sizing: border-box;
				background: #FFFFFF;
				
			}
		}
	}
	.lisBox{
		width: calc(100% - 136rpx);
		.lisBox-item{
			width: 100%;
			background: #FFFFFF;
			padding: 32rpx;
			box-sizing: border-box;
			
			.lisBox-item-center{
				width: calc(100% - 220rpx);
			}
			.lisBox-item-name{
				font-weight: bold;
				font-size: 30rpx;
				color: #000000;
				line-height: 30rpx;
			}
			.lisBox-item-text{
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
				line-height: 24rpx;
			}
			.lisBox-item-price{
				font-weight: 500;
				font-size: 24rpx;
				color: #FF9600;
				text{
					font-weight: 600;
					font-size: 36rpx;
				}
			}
			.lisBox-item-but{
				padding: 8rpx 25rpx;
				box-sizing: border-box;
				border-radius: 6rpx;
				border: 2rpx solid #FF9600;
				font-weight: bold;
				font-size: 26rpx;
				color: #FF9600;
			}
		}
	}
</style>