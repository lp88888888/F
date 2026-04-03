<template>
	<view class="">
		<u-sticky>
			<view class="navBack">
				<up-navbar title="订单列表" bgColor="none" @leftClick="leftClick" leftIconColor="#000000" placeholder :fixed="false">
					<template #center>
						<view class="fl-ce-ce">
							<view :class="['viewTabs',typeValue ==1?'viewTabsActive':'']" @click="titleTabsChange(1)" style="margin-right: 60rpx;">服务区</view>
							<view :class="['viewTabs',typeValue ==2?'viewTabsActive':'']" @click="titleTabsChange(2)">景区</view>
						</view>
					</template>
				</up-navbar>
				<view class="searchView">
					<up-search v-model="keyword" :showAction="false" searchIconColor="#000000" placeholder="请输入餐厅名称或商品名称" height="36" shape="round" bgColor="#F5F5F5" />
				</view>
				<view class="tabsView">
					<up-tabs :list="tabList" lineColor="none" :activeStyle="{color:'#FF9600',fontWeight: 'bold',fontSize:'26rpx'}" :inactiveStyle="{color:'#333333',fontSize:'26rpx'}"></up-tabs>
				</view>
			</view>
		</u-sticky>
		<view class="pageView">
			<view class="card" v-for="(item,index) in dataList" :key="index"  @click="toNav('/pages_B/dining/orderDetail')">
				<view class="card-top">
					<view class="card-top-name">
						<u-icon :name="imgUrl+'static/list-icon-e.png'" size="20"></u-icon>
						<view class="card-top-name-title">
							<text>{{item.title}}</text>
						</view>
						<view class="card-top-name-icon">{{item.name}}</view>
					</view>
					<view class="card-top-state">
						<text v-if="item.state == 1" class="stateIcon1">待支付</text>
						<text v-if="item.state == 2" class="stateIcon2">待核销</text>
						<text v-if="item.state == 3" class="stateIcon4">已完成</text>
						<text v-if="item.state == 4" class="stateIcon5">已取消</text>
						<text v-if="item.state == 5" class="stateIcon4">退款中</text>
					</view>
				</view>
				<up-gap height="10"></up-gap>
				<view class="card-center">
					
					<scroll-view v-if="item.imgUrl.length > 1" class="scroll-view_H" :scroll-x="true">
						<image v-for="(url) in item.imgUrl" :src="imgUrl+url" :key="url"></image>
					</scroll-view>
					<view v-else class="scroll-view_H" style="width: calc(100% - 170rpx);">
						<image v-for="(url) in item.imgUrl" :src="imgUrl+url" :key="url"></image>
						<view class="scroll-view_H-text">{{item.shopName}}</view>
					</view>
					<view class="card-center-fiexd">
						<view class="priceView"><text style="font-size: 24rpx;">￥</text>{{flPrice(item.totalAmount,'left')}}<text style="font-size: 24rpx;">{{flPrice(item.totalAmount,'right')}}</text></view>
						<view class="totalView">共{{item.imgUrl.length}}件</view>
					</view>
				</view>
				<u-line color="#EEEEEE"></u-line>
				<up-gap height="10"></up-gap>
				<view class="card-bottom">
					<view class="card-bottom-time">{{item.time}}</view>
					<view class="card-bottom-but butColor1" v-if="item.state == 1">去支付</view>
					<view class="card-bottom-but butColor1" v-if="item.state == 2">查看券码</view>
					<view class="card-bottom-but butColor2" v-if="item.state == 3">取消</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { imgUrl } from '@/config';
	import { toNav,toBack } from '@/utils/route';
	const current = ref<string|number>(0);
	const keyword = ref<string>('');
	const typeValue = ref<string|number>(1);
	const tabList = ref([
		{name: '全部',state:0},
		{name: '待支付',state:1},
		{name: '待核销',state:2},
		{name: '已完成',state:3},
		{name: '已取消',state:4},
		{name: '退款中',state:5},
	]);
	const flPrice = computed(()=>{
		return (price:string|number,type:string) =>{
			let srt:string = String(Number(price).toFixed(2));
			if(price){
				if(type == 'left'){
					return srt.substring(0,srt.indexOf('.'))
				}else{
					return srt.substring(srt.indexOf('.'))
				}
				
			}
			return ''
		}
	})
	const dataList = ref([
		{title:'宝鸡市友好餐厅',name:'宝鸡西服务区',state:1,type:1,time:'2025-03-27 10:30:28',totalAmount:99,imgUrl:['dsewf.png','dsewf.png','dsewf.png','dsewf.png']},
		{title:'安康市美味饭庄餐厅',name:'安康服务区',state:2,type:2,time:'2025-03-27 10:30:28',totalAmount:99,imgUrl:['dsewf.png'],shopName:'擀面皮擀面皮擀面皮擀面皮擀面皮擀面皮'},
		{title:'宝鸡市友好餐厅',name:'宝鸡西服务区',state:3,type:2,time:'2025-03-27 10:30:28',totalAmount:99,imgUrl:['dsewf.png','dsewf.png']},
		{title:'安康市美味饭庄餐厅',name:'安康服务区',state:4,type:1,time:'2025-03-27 10:30:28',totalAmount:99,imgUrl:['dsewf.png','dsewf.png']},
		{title:'宝鸡市友好餐厅',name:'宝鸡西服务区',state:5,type:1,time:'2025-03-27 10:30:28',totalAmount:99,imgUrl:['dsewf.png','dsewf.png']},
	])
	const leftClick = () =>{
		uni.navigateBack({
			delta:1,
			fail: () => {
				uni.navigateTo({
					url:"/pages/home/home"
				})
			}
		})
	}
	const titleTabsChange = (type:string|number) =>{
		typeValue.value = type
	}
</script>

<style lang="scss">
	page{
		background: $pageBgColor;
	}
	.navBack{
		width: 100%;
		background: linear-gradient(0deg, #FFFFFF, #FFECCE);
	}
	.viewTabs{
		font-weight: bold;
		font-size: 30rpx;
		line-height: 30rpx;
		color: #000000;
		text-align: center;
	}
	.viewTabsActive{
		font-weight: 800;
		font-size: 36rpx;
		line-height: 36rpx;
	}
	.searchView{
		width: 100%;
		padding: 0 32rpx;
		box-sizing: border-box;
	}
	.tabsView{
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	.pageView{
		padding: 30rpx 32rpx;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: repeat(1,100%);
		grid-gap: 30rpx;
	}
	.card{
		width: 100%;
		padding: 25rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		.card-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.card-top-name{
				display: flex;
				align-items: center;
				.card-top-name-title{
					line-height: 40rpx;
					font-weight: bold;
					font-size: 28rpx;
					color: #000000;
					padding: 0 16rpx;
				}
				.card-top-name-icon{
					line-height: 22rpx;
					padding: 5rpx 9rpx;
					box-sizing: border-box;
					text-align: center;
					border-radius: 6rpx;
					border: 1rpx solid #FF9600;
					font-weight: 500;
					font-size: 22rpx;
					color: #FF9600;
				}
			}
			.card-top-state{
				font-weight: 500;
				font-size: 26rpx;
				.stateIcon1{color: #FF9600;}
				.stateIcon2{color: #51B3F7;}
				.stateIcon3{color: #0077FF;}
				.stateIcon4{color: #999999;}
				.stateIcon5{color: #BCBCBD;}
			}
		}
		.card-center{
			position: relative;
			.scroll-view_H {
				
				width: 100%;
				white-space: nowrap;
				display: flex;
				align-items: center;
				padding-right: 150rpx;
				
				image{
					width: 136rpx;
					height: 136rpx;
					background: #F5F5F5;
					border-radius: 16rpx;
					margin-right: 15rpx;
				}
				
				.scroll-view_H-text{
					width: calc(100% - 140rpx);
					white-space: nowrap;
					/* 禁止换行 */
					overflow: hidden;
					/* 超出部分隐藏 */
					text-overflow: ellipsis;
					/* 使用省略号替代超出部分 */
				}
			}
			.card-center-fiexd{
				width: 150rpx;
				height: 136rpx;
				position: absolute;
				top: 0;
				right: 0;
				z-index: 2;
				background: rgba(255, 255, 255, 0.93);
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-end;
				.priceView{
					font-weight: bold;
					font-size: 28rpx;
					color: #000000;
				}
				.totalView{
					font-weight: 500;
					font-size: 24rpx;
					color: #999999;
				}
			}
		}
		.card-bottom{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.card-bottom-time{
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
			}
			.card-bottom-but{
				width: 160rpx;
				height: 60rpx;
				border-radius: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				font-size: 28rpx;
			}
			.butColor1{
				color: #FF9600;
				border: 1rpx solid #FF9600;
			}
			.butColor2{
				color: #999999;
				border: 1rpx solid #E2E2E2;
			}
		}
	}
	
	::v-deep .u-navbar__content{
		background: none !important;
	}
	
</style>