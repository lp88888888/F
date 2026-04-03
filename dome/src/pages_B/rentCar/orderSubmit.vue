<template>
	<view class="">
		<up-sticky>
			<view :style="{background:navBgColor}">
				<up-navbar title="提交订单" bgColor="transparent" @leftClick="toBack(1)" placeholder :fixed="false" :titleStyle="{fontWeight:'600'}"></up-navbar>
			</view>
		</up-sticky>
		<view class="backColor"></view>
		<view class="pageView"> 
			<view class="card fl-ce-sb">
				<up-image :src="imgUrl+'del/car-img.png'" width="200rpx" height="160rpx" lazy-load></up-image>
				<view class="carView">
					<view class="carName texNoWrap">捷达VA3</view>
					<view class="fl-fe-sb">
						<view class="cartext texNoWrap">
							轿车丨5座丨1.6丨自动
						</view>
						<view class="price">
							<text class="price-dw">日均￥</text>
							<text class="price-item">168</text>
						</view>
					</view>
				</view>
			</view>
			<u-gap height="10"></u-gap>
			<view class="card ">
				<view class="timeView fl-ce-sb">
					<view class="fl-al-ce">
						<text class="timeView-item">{{startTime}}</text>
						<text class="timeView-icon " style="margin: 0 15rpx;">3天</text>
						<text class="timeView-item">{{endTime}}</text>
					</view>
					<u-icon :name="imgUrl+'static/edit-icon-000.png'" size="14"></u-icon>
				</view>
				<u-line color="#EEEEEE"></u-line>
				<u-gap height="15"></u-gap>
				<view class="fl-ce-sb">
					<view class="addNameIcon">取/还地点</view>
					<view class="addNameItem">安康宏晖鑫达商贸有限公司</view>
				</view>
				<u-gap height="15"></u-gap>
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
				<u-gap height="22"></u-gap>
			</view>
			<u-gap height="15"></u-gap>
			<view class="card">
				<view class="cardTitle">费用明细</view>
				<view class="fl-ce-sb">
					<view class="labelName">车辆租赁费</view>
					<view class="labelRight">¥150</view>
				</view>
				<view class="gridsViuew">
					<view class="gridsViuew-item fl-ce-ce" v-for="(item,index) in list" :key="index">
						<view class="gridsViuew-item-text">{{item.time}}</view>
						<view class="gridsViuew-item-price m-t-20">{{item.price}}</view>
					</view>
				</view>
				<view class="labelName">租期总计：<text>3天</text></view>
				<u-gap height="18"></u-gap>
			</view>
			<u-gap height="15"></u-gap>
			<view class="card">
				<view class="cardTitle">押金说明</view>
				<view class="fl-ce-sb ">
					<view class="labelName">违章押金<text>（还车30天后无违章全退）</text></view>
					<view class="labelRight">¥2000</view>
				</view>
				<view class="m-t-35 m-b-35">
					<u-line color="#EEEEEE"></u-line>
				</view>
				<view class="fl-ce-sb ">
					<view class="labelName">车辆押金<text>（还车后全退）</text></view>
					<view class="labelRight">¥3000</view>
				</view>
				<u-gap height="25"></u-gap>
			</view>
			<u-gap height="15"></u-gap>
			<view class="card">
				<view class="cardTitle">租车须知</view>
				<view class="fl-ce-sb ">
					<view class="label2Name">取车凭证</view>
					<view class="label2Right">本人有效身份证及驾驶证</view>
				</view>
				<view class="m-t-35 m-b-35">
					<u-line color="#EEEEEE"></u-line>
				</view>
				<view class="fl-ce-sb ">
					<view class="label2Name">发票开具</view>
					<view class="label2Right">订单完成后，向商家索取</view>
				</view>
				<u-gap height="25"></u-gap>
			</view>
		</view>
		<u-gap height="90"></u-gap>
		<view class="fixedBott fl-fs-sb">
			<view class="fixedBott-left fl-fe-ce">
				<text class="tex">预计：</text>
				<text class="dw">￥</text>
				<text class="pric">150.00</text>
			</view>
			<view class="fixedBott-but fl-ce-ce">立即预定<text>（线下付）</text></view>
		</view>
		<!-- <uni-datetime-picker v-model="range" type="datetimerange" @maskClick="maskClick" :clearIcon="false" hideSecond /> -->
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	
	const navBgColor = ref('linear-gradient(to bottom, rgba(255,150,1,1), rgba(252,168,49,1))');
	
	const startTime=ref('03月27日 12:00');
	const endTime=ref('03月29日 13:00');
	
	const list = ref([
		{time:'10-09 周四',price:'￥50'},
		{time:'10-10 周五',price:'￥50'},
		{time:'10-11 周六',price:'￥50'},
	]);
	
</script>

<style lang="scss">
	page{
		background: $pageBgColor;
	}
	.fixedBott{
		width: 750rpx;
		height: 158rpx;
		background: #FFFFFF;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
		padding: 26rpx 32rpx 0 32rpx;
		box-sizing: border-box;
		.fixedBott-left{
			height: 80rpx;
			margin-top: 10rpx;
			.tex{
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}
			.dw{
				font-weight: 500;
				font-size: 26rpx;
				color: #FF9600;
			}
			.pric{
				font-weight: 800;
				font-size: 50rpx;
				color: #FF9600;
			}
		}
		.fixedBott-but{
			width: 390rpx;
			height: 80rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 40rpx;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 30rpx;
			color: #FFFFFF;
			text{
				font-weight: 400;
				font-size: 26rpx;
			}
		}
		
	}
	.pageView{
		padding: 0 32rpx;
		box-sizing: border-box;
	}
	.card{
		width: 100%;
		padding: 0 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		.cardTitle{
			font-weight: bold;
			font-size: 32rpx;
			color: #000000;
			padding: 35rpx 0 30rpx 0;
		}
	}
	.backColor{
		width: 750rpx;
		height: 750rpx;
		background: linear-gradient(180deg,#FF9600 0%,#F1EFEC 100%) ;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.carView{
		width: calc(100% - 220rpx);
		.carName{
			font-weight: bold;
			font-size: 30rpx;
			color: #000000;
		}
		.cartext{
			font-weight: 500;
			font-size: 24rpx;
			color: #333333;
		}
	}
	.price{
		color: #FF9600;
		.price-dw{
			font-weight: 500;
			font-size: 24rpx;
		}
		.price-item{
			font-weight: 600;
			font-size: 36rpx;
		}
	}
	.timeView{
		padding-top: 45rpx;
		padding-bottom: 30rpx;
		
		.timeView-item{
			font-weight: bold;
			font-size: 32rpx;
			line-height: 32rpx;
			color: #000000;
		}
		.timeView-icon{
			background: #FFEFD1;
			border-radius: 17rpx;
			padding: 7rpx 14rpx;
			font-weight: 500;
			font-size: 22rpx;
			line-height: 22rpx;
			color: #FF9600;
		}
	}
	
	.addNameIcon{
		padding: 5rpx 10rpx;
		box-sizing: border-box;
		background: linear-gradient(-40deg, #FF9600, #F4AA31);
		border-radius: 6rpx;
		font-weight: bold;
		font-size: 22rpx;
		line-height: 24rpx;
		color: #FFFFFF;
	}
	.addNameItem{
		width: calc(100% - 136rpx);
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
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
	.labelName{
		font-weight: 500;
		font-size: 26rpx;
		color: #000000;
		text{
			color: #FF9600;
		}
	}
	.labelRight{
		font-weight: 800;
		font-size: 26rpx;
		color: #000000;
	}
	.label2Name{
		font-weight: 500;
		font-size: 26rpx;
		color: #888B93;
	}
	.label2Right{
		font-weight: 500;
		font-size: 26rpx;
		color: #000000;
	}
	.gridsViuew{
		padding-top: 25rpx;
		padding-bottom: 30rpx;
		display: grid;
		grid-template-columns: repeat(3,1fr);
		grid-gap: 15rpx;
		
		.gridsViuew-item{
			width: 100%;
			height: 116rpx;
			background: #F5F5F5;
			border-radius: 12rpx;
			flex-direction: column;
		}
		.gridsViuew-item-text{
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
		}
		.gridsViuew-item-price{
			font-weight: 500;
			font-size: 26rpx;
			color: #000000;
		}
	}
</style>