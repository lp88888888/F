<template>
	<view class="">
		<view class="pageView">
			<!-- 图片、名称 -->
			<view class="topCard">
				<image class="topCard-img" :src="imgUrl+'del/car-detail-icon.png'" :lazy-load="true"></image>
				<view class="topCard-center fl-al-ce">
					<view class="names texNoWrap">2022雪佛兰科鲁泽</view>
					<view class="priceBox fl-ce-ce">
						<view>
							<text class="priceBox-sm">￥</text>
							<text class="priceBox-ppr">168</text>
						</view>
						<view class="priceBox-sm">日均</view>
					</view>
				</view>
			</view>
			<view class="cards m-t-30">
				<view class="cards-title">基本信息</view>
				<view class="gordBox m-t-20">
					<view class="gordBox-item fl-ce-ce" v-for="(item,index) in jibList" :key="index">
						<view class="gordBox-item-name">{{item.name}}</view>
						<view class="gordBox-item-text m-t-20">{{item.text}}</view>
					</view>
				</view>
			</view>
			<view class="cards m-t-30">
				<view class="cards-title">车型配置</view>
				<view class="gordBox m-t-20" style="grid-template-columns: repeat(4,1fr);grid-gap: 0;">
					<view class="gordBox-item fl-ce-ce" style="background: transparent;" v-for="(item,index) in pzList" :key="index">
						<up-icon :name="item.icon" size="25"></up-icon>
						<view class="gordBox-item-name2 m-t-15">{{item.name}}</view>
						
					</view>
				</view>
			</view>
			<view class="cards m-t-30">
				<view class="fl-ce-sb">
					<view class="cards-title">
						用户评价
						<text>（212）</text>
					</view>
					<view class="fl-al-ce">
						<text class="title-right">查看全部</text>
						<up-icon name="arrow-right" color="#999999" size="12"></up-icon>
					</view>
				</view>
				
				<view class="pjBox" >
					<view>
						<view class="pjBox-item">
							<view class="fl-ce-sb">
								<view class="fl-al-ce">
									<up-image :src="imgUrl+'tx.jpg'" width="66rpx" height="66rpx" shape="circle"></up-image>
									<text class="usName m-l-10">浪漫色彩</text>
								</view>
								<view class="usTime">2025.03.23</view>
							</view>
							<view class="usText m-t-20">
								酒店有停车场，酒店旁边就是万达广场，购物方便，吃饭方便，前台服务热情，酒店环境不错值得推荐。
							</view>
						</view>
						<up-line color="#EEEEEE"></up-line>
					</view>
					<view>
						<view class="pjBox-item">
							<view class="fl-ce-sb">
								<view class="fl-al-ce">
									<up-image :src="imgUrl+'tx.jpg'" width="66rpx" height="66rpx" shape="circle"></up-image>
									<text class="usName m-l-10">浪漫色彩</text>
								</view>
								<view class="usTime">2025.03.23</view>
							</view>
							<view class="usText m-t-20">
								酒店有停车场，酒店旁边就是万达广场，购物方便，吃饭方便，前台服务热情，酒店环境不错值得推荐。
							</view>
						</view>
					</view>
					
				</view>
			</view>
			
		</view>
		<up-gap height="80" ></up-gap>
		<!-- 底部按钮 -->
		<view class="bottomBut">
			<view class="bottomBut-item" @click="toNav('/pages_B/rentCar/orderSubmit')">立即预定</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	import { imgUrl } from '@/config';
	import { toNav,toBack } from '@/utils/route';
	const selectIndex = ref('');
	const dataList = ref([
		{name:'计划有变，无法使用'},
		{name:'车辆状况异常'},
	])
	const totalAmount = ref(68.45);
	const jibList= ref([
		{name:'车型结构',text:'三厢'},
		{name:'变速箱',text:'自动'},
		{name:'座位数',text:'5座'},
		{name:'能源类型',text:'汽油'},
		{name:'排量',text:'1.6'},
		{name:'油箱容积',text:'46L'},
	])
	const pzList= ref([
		{name:'倒车雷达',icon:imgUrl+'static/car-type-icon-1.png'},
		{name:'倒车影像',icon:imgUrl+'static/car-type-icon-2.png'},
		{name:'360°全景影像',icon:imgUrl+'static/car-type-icon-3.png'},
		{name:'自动驻车',icon:imgUrl+'static/car-type-icon-4.png'},
		{name:'一键启动',icon:imgUrl+'static/car-type-icon-1.png'},
		{name:'定速巡航',icon:imgUrl+'static/car-type-icon-2.png'},
		{name:'自适应巡航',icon:imgUrl+'static/car-type-icon-3.png'},
		{name:'胎压监测',icon:imgUrl+'static/car-type-icon-4.png'},
		{name:'蓝牙',icon:imgUrl+'static/car-type-icon-1.png'},
		{name:'天窗',icon:imgUrl+'static/car-type-icon-2.png'},
		{name:'电动座椅调节',icon:imgUrl+'static/car-type-icon-3.png'},
		{name:'CarPlay',icon:imgUrl+'static/car-type-icon-4.png'},
	])
	const seleClick = (item:any) =>{
		selectIndex.value = item.name;
	}
</script>

<style lang="scss">
	page{
		background: $pageBgColor;
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.cards{
		padding: 32rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		.cards-title{
			font-weight: bold;
			font-size: 32rpx;
			color: #000000;
			text{
				font-weight: 500;
				font-size: 24rpx;
				color: #FF9600;
			}
		}
		.title-right{
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
		}
	}
	.topCard{
		border: 3rpx solid #FFFFFF;
		background: #FFFFFF;
		border-radius: 20rpx;
		.topCard-img{
			width: 100%;
			height: 380rpx;
			border-radius: 20rpx 20rpx 0 40rpx;
		}
		.topCard-center{
			height: 100rpx;
			padding: 0 30rpx;
			position: relative;
		}
		.names{
			width: calc(100% - 130rpx);
			font-weight: 800;
			font-size: 30rpx;
			color: #000000;
		}
		.priceBox{
			position: absolute;
			right: 30rpx;
			top: -70rpx;
			z-index: 2;
			width: 130rpx;
			height: 130rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			box-shadow: 0rpx 10rpx 30rpx 0rpx rgba(252,155,12,0.2);
			border-radius: 50%;
			border: 10rpx solid #FFFFFF;
			color: #FFFFFF;
			flex-direction: column;
			.priceBox-sm{
				font-weight: 500;
				font-size: 24rpx;
			}
			.priceBox-ppr{
				font-size: 40rpx;
                font-weight: 600;
			}
		}
	}
	
	.gordBox{
		display: grid;
		grid-template-columns: repeat(3,1fr);
		grid-gap: 13rpx;
		
		.gordBox-item{
			height: 116rpx;
			background: #F5F5F5;
			border-radius: 12rpx;
			flex-direction: column;
		}
		.gordBox-item-name2{
			font-weight: 500;
			font-size: 24rpx;
			color: #333333;
		}
		.gordBox-item-name{
			font-weight: bold;
			font-size: 26rpx;
			color: #000000;
		}
		.gordBox-item-text{
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
		}
	}
	.pjBox{
		.pjBox-item{
			padding: 30rpx 0;
			box-sizing: border-box;
		}
		.usName{
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}
		.usTime{
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
		}
		.usText{
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			line-height: 50rpx
		}
	}
	
	
	.bottomBut{
		position: fixed;
		z-index: 99;
		left: 0;
		bottom: 0;
		background: #FFFFFF;
		width: 750rpx;
		padding: 18rpx 36rpx 60rpx 36rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.bottomBut-item{
			width: 100%;
			height: 80rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>