<template>
	<view class="">
		<up-sticky>
			<view :style="{background:topBgColor}">
				<up-navbar title="提交订单" bgColor="none" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			</view>
		</up-sticky>
		<view class="backColor"></view>
		
		<view class="pageView" >
			<!-- 下单信息 -->
			<view class="topCard">
				<!-- <image class="topCard-imgBa" :src="`${imgUrl}static/B-direct-add-order-bgC${type}.png`"></image> -->
				<!-- <view class="tabType">
					<view class="tabType-item" :class="[type==1?'active':'']" @click="typeChange(1)">到店自取</view>
					<view class="tabType-item" :class="[type==2?'active':'']" @click="typeChange(2)">快递到家</view>
				</view> -->
				<view class="topCenter" :style="{background: type==2?'#FFFFFF':'none',borderRadius:'20rpx'}">
					<template v-if="type == 1">
						<view class="topCenter-left">
							<view class="topCenter-left-name">安康市宁陕县京昆高速秦岭服务区北区</view>
							<up-gap height="16"></up-gap>
							<view class="topCenter-left-tems">
								<view class="topCenter-left-tems-icon">
									<up-icon :name="imgUrl+'static/B-direct-tell-FF9600.png'" size="25" ></up-icon>
								</view>
								<view class="topCenter-left-tems-name">华州服务区超市</view>
							</view>
						</view>
						<view class="topCenter-right">
							<view class="topCenter-right-jl">
								<text>距您10km</text>
								<up-icon name="arrow-right" size="10" color="#999999"></up-icon>
							</view>
							<view class="topCenter-right-imView">
								<image :src="imgUrl+'tx.jpg'" mode=""></image>
							</view>
						</view>
					</template>
					<template v-if="type == 2">
						<view class="lefIcon">收</view>
						<view class="rightTwo">
							<view class="rightTwo-text">陕西省西安市高新区</view>
							<view class="rightTwo-addr">
								<up-text text="科技一路与二路交汇处科技园区大 楼A座610室" size="16" bold color="#000000" lineHeight="50rpx" lines="2"></up-text>
								<up-icon name="arrow-right" size="10" color="#999999"></up-icon>
							</view>
							<view class="rightTwo-name">
								<text>张超远 (先生)</text>
								<text>135****0036</text>
							</view>
						</view>
					</template>
				</view>
			</view>
			<up-gap height="15"></up-gap>
			<!-- 商品信息列表 -->
			<order-shop-list :list="shopList"></order-shop-list>
			
			<up-gap height="15"></up-gap>
			<!-- 费用 -->
			<view class="costCard">
				<view class="costCard-title">费用明细</view>
				<view class="costCard-center">
					<view class="costCard-item">
						<view class="costCard-item-label">商品总价</view>
						<view class="newPrice"><text class="fs-24">￥</text>{{99}}<text class="fs-28">.56</text></view>
					</view>
					<view class="costCard-item">
						<view class="costCard-item-label">运费</view>
						<view class="newPrice"><text class="fs-24">￥</text>{{decimalPointDivision(totalAmount,'left')}}<text class="fs-28">{{decimalPointDivision(totalAmount,'right')}}</text></view>
					</view>
					<!-- <view class="costCard-item">
						<view class="costCard-item-label">优惠券</view>
						<view class="costCard-item-cop">
							<text>兑换优惠券</text>
							<up-icon name="arrow-right" size="12" color="#FF4B33"></up-icon>
						</view>
					</view> -->
					<view class="costCard-item">
						<view class="costCard-item-label"></view>
						<view class="costCard-item-totAmount">
							<text>合计：</text>
							<view class="newPrice" style="color: #FF9600;"><text class="fs-24">￥</text>{{decimalPointDivision(detail.totalFee,'left')}}<text class="fs-28">{{decimalPointDivision(detail.totalFee,'right')}}</text></view>
						</view>
					</view>
				</view>
			</view>
			<up-gap height="90"></up-gap>
			<!-- 支付按钮 -->
			<view class="bottomBut">
				<view class="newPrice" style="color: #FF9600;"><text class="fs-24">￥</text>{{decimalPointDivision(detail.totalFee,'left')}}<text class="fs-28">{{decimalPointDivision(detail.totalFee,'right')}}</text></view>
				<view class="bottomBut-item" @click="handleSave">立即支付</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import OrderShopList from "./components/OrderShopList";
	import { imgUrl } from '@/config';
	import { debounce } from '@/utils/common';
	import { toNav,toBack ,toRec} from '@/utils/route';
	import {decimalPointDivision,showToastSuccess} from "@/utils/util";
	import {payInfoPrShopCarOrder} from '@/api/points';
	import type {ShopDetail} from "./types";
	import { toast } from '@/utils/common';
	
	const topBgColor = ref<string>('transparent');
	const listShow = ref<boolean>(false);
	const detail = ref({totalFee:0});
	const type=ref(2); // 1到店自取，2快递到家
	const maxListNumShow = ref<number>(3);// 最大展示数量
	const shopList = ref<[]>([])
	const totalAmount = computed(()=>{
		let num = 0
		for(let i in shopList.value){
			num += Number(shopList.value[i].totalFee)
		}
		return num.toFixed(2)
	})
	// 创建订单
	const handleSave = debounce(() => {
		// toRec('/pages_A/pay/index')
		showToastSuccess('支付成功');
		setTimeout(()=>{
			toRec('/pages_B/directRetail/index')
		},2000)
	}, 300);
	
	
	const lookShow = ref(false);
	// 方法定义
	const typeChange =(serviceType) => {
	  type.value = serviceType
	};
	const getData = async (orderIds)=>{
		const res = await payInfoPrShopCarOrder({orderIds:orderIds.join()});
		if(res.code == 200){
			detail.value = res.data;
			shopList.value = res.data.spuVOList
		}else{
			toast(res.msg)
		}
	}
	onLoad(()=>{
		if(uni.getStorageSync('orderIds')){
			getData(uni.getStorageSync('orderIds'));
			uni.removeStorageSync('orderIds');
		}
	})
	
	onPageScroll((e) =>{
	  if (e.scrollTop < 1) {
		  topBgColor.value = 'transparent';
	  } else {
		  topBgColor.value = `linear-gradient(to bottom, rgba(255,150,1,1), rgba(252,168,49,1))`;
	  }
	})
</script>

<style lang="scss" >
	@import './index.scss';
	.pageView{
		padding: 32rpx;
	} 
	.topCard{
		width: 686rpx;
		// min-height: 333rpx;
		position: relative;
		.topCard-imgBa{
			position: absolute;
			z-index: -1;
			width: 686rpx;
			// height: 333rpx;
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
			width: 276rpx;
			height: 80rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 39rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	
	.costCard{
		padding: 0 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		.costCard-title{
			line-height: 90rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
			border-bottom: 1rpx solid #F2F2F2;
		}
		.costCard-center{
			padding: 20rpx 0;
		}
		.costCard-item{
			height: 70rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.costCard-item-label{
				font-weight: 500;
				font-size: 28rpx;
				color: #666666;
			}
			.costCard-item-cop{
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 26rpx;
				color: #FF4B33;
			}
		}
	}
	
	
	.newPrice{
		// color: #FF9600;
		font-weight: bold;
		font-size: 36rpx;
		display: inline-block;
	}
	
	.tabType{
		width: 100%;
		display: flex;
		align-items: flex-end;
		height: 90rpx;
		// background: #FFF6E6;
		// border-radius: 20rpx 20rpx 0 0;
		text-align: center;
		.tabType-item{
			flex: 1;
			// width: 390rpx;
			height: 68rpx;
			line-height: 68rpx;
			// background: #FFF6E6;
			border-radius: 20rpx;
		}
		.active{
			// width: 356rpx;
			width: 50%;
			height: 90rpx;
			line-height: 90rpx;
			// background: #FFFFFF;
			border-radius: 20rpx 20rpx 0rpx 0rpx;
			
		}
	}
	
	.topCenter{
		// background: #FFFFFF;
		border-radius: 0 0 20rpx 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		position: relative;
		.lefIcon{
			margin-top: 20rpx;
			width: 36rpx;
			height: 36rpx;
			line-height: 36rpx;
			text-align: center;
			background: #FFF8EB;
			border-radius: 6rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #FF9600;
		}
		.rightTwo{
			width: calc(100% - 56rpx);
			
			.rightTwo-text{
				font-weight: 500;
				font-size: 24rpx;
				color: #000000;
				line-height: 50rpx;
			}
			.rightTwo-addr{
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 538rpx;
				height: 84rpx;
				font-family: PingFang SC;
				font-weight: 800;
				font-size: 36rpx;
				color: #000000;
				line-height: 50rpx;
			}
			.rightTwo-name{
				display: flex;
				align-items: center;
				
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
				line-height: 50rpx;
				text{
					margin-right: 20rpx;
				}
			}
		}
		&-left{
			width: calc(100% - 200rpx);
			&-name{
				
				font-weight: 800;
				font-size: 36rpx;
				color: #000000;
				line-height: 50rpx;
			}
			&-tems{
				display: flex;
				align-items: center;
				&-icon{
					// width: 50rpx;
					// height: 50rpx;
					// background: #FF9600;
					// border-radius: 25rpx;
					// position: relative;
					z-index: 2;
					// display: flex;
					// align-items: center;
					// justify-content: center;
				}
				&-name{
					min-width: 226rpx;
					height: 46rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					background: #FFF8EB;
					border-radius: 0rpx 23rpx 23rpx 0rpx;
					margin-left: -20rpx;
					font-weight: 500;
					font-size: 24rpx;
					color: #FF9600;
					padding: 0 21rpx;
					box-sizing: border-box;
				}
			}
		}
		&-right{
			width: 220rpx;
			height: 220rpx;
			display: flex;
			flex-direction: column;
			// background: #FFF6E6;
			
			&-jl{
				position: absolute;
				top: 70rpx;
				right: 30rpx;
				width: 180rpx;
				height: 50rpx;
				line-height: 50rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0,0,0,0.06);
				border-radius: 25rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			&-imView{
				position: absolute;
				top: 140rpx;
				right: 70rpx;
				width: 76rpx;
				height: 76rpx;
				box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0,0,0,0.06);
				border-radius: 10rpx;
				padding: 7rpx;
				box-sizing: border-box;
				background: #FFFFFF;
				image{
					width: 69rpx;
					height: 69rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
				}
			}
		}
	}
</style>