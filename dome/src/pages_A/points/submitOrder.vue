<template>
	<view class="container">
		<!-- <cos-header title='提交订单' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100"></cos-header> -->
		<up-sticky z-index="8888">
			<view :style="{background: backgroundColor}">
				<up-navbar title="提交订单" bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" placeholder :fixed="false" :titleStyle="{fontWeight:'bold'}"></up-navbar>
			</view>
		</up-sticky>
		<view class="content">
			<!-- 公司信息 -->
			<view class="com-info">
				<view class="com-head flex ali-cen p-b-25">
					<image class="com-icon" :src="imgUrl+'fp_icon.png'" mode=""></image>
					<text class="fs-28 fw-b">安康宏晖鑫达商贸有限公司</text>
				</view>
				
				<view class="com-bottom flex just-sb">
					<view class="flex">
						<image class="icon-24 m-r-15 m-t-10" :src="imgUrl+'ind-icon20.png'" mode=""></image>
						<view class="flex flex-col">
							<view class="fs-26 col3 m-b-25">安康市宁陕县京昆高速秦岭服务区北区</view>
							<text class="fs-24 col9">距您2.6km</text>
						</view>
					</view>
					<view class="flex">
						<view class="flex flex-col ali-cen m-r-35">
							<image class="head-icon" :src="imgUrl+'yq-dh.png'" mode=""></image>
							<text>导航</text>
						</view>
						<view class="flex flex-col ali-cen">
							<image class="head-icon" :src="imgUrl+'yq-phone.png'" mode=""></image>
							<text>电话</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 商品信息 -->
			<view class="goods-list">
				<view class="fs-28 fw-b m-b-25">
					商品信息
				</view>
				
				<view class="goos-item flex">
					<image class="goods-img m-r-25" :src="imgUrl+'tx.jpg'" mode=""></image>
					<view class="goods-title m-t-20 flex-1">小型客车普洗优惠商品抵用券</view>
					<view class="flex flex-col m-l-50">
						<text class="fs-24 fw-b colff9">106积分</text>
						<text class="fs-24 fw-500 clo9 m-t-50">×1</text>
					</view>
				</view>
				
				<view class="goosd-bottom flex flex-end p-t-25">
					<text>共1件，总计：</text>
					<text>106积分</text>
				</view>
			</view>
			
			<!-- 积分兑换说明 -->
			<view class="integral-info">
				<view class="integra-title fs-28 colf">
					积分兑换说明
				</view>
				<view class="lh50">
					1、凭此券可在小楹甄选商城抵扣1次对应产品的销售价具体以优惠券价值为准;
					2、每天仅限使用一张优惠券；
					3、基础商品券后仅付快递费，"快递费自理。输入地址自动计算快递邮费;包邮产品偏远地区需要额外收取邮费，输入地址自动计算快递邮费；
					4、非基础款需要支付商品差价，具体金额以第三方平台为准；
					5、除特殊注明外，本优惠不能与其他优惠同时享受。
				</view>
			</view>
		</view>
		
		<!-- 底部 -->
		<u-gap height="90" />
		<view class="bottom-bar flex just-sb ali-cen">
			<view class="flex ali-cen">
				<text class="fs-24 fw-500 col3">总计：</text>
				<text class="fs-44 fw-b colff9 m-r-5 m-b-5">{{detail.totalFee || 0}}</text>
				<text class="fs-24 fw-b colff9">积分</text>
			</view>
			<view class="pay-btn" @click="toJump('/pages_A/points/payOrder')">
				立即支付
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		imgUrl,
	} from '../../config';
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		ref,
		onMounted,
		reactive
	} from 'vue';
	import { toast } from '@/utils/common';
	import { toBack } from '@/utils/route';
	import {payInfoPrShopCarOrder} from '@/api/points';
	import CosHeader from '@/components/customNavBar/index.vue';
	
	const backgroundColor = ref<string>("#FFFFFF");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const detail = ref<any>({});
	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	const toJump = ( url: String ) => {
		uni.navigateTo({
			url: url
		})
	};
	const getData = async (orderIds)=>{
		console.log("orderIds", orderIds);
	
		// const res = await payInfoPrShopCarOrder(orderIds.join());
		const res2 = await payInfoPrShopCarOrder({orderIds:orderIds.join()});
		// if(res.code == 200){
		// 	detail.value = res.data;
		// }else{
		// 	toast(res.msg)
		// }
	}
	onLoad((opticon)=>{
		// getData(opticon.orderId);
		if(uni.getStorageSync('orderIds')){
			getData(uni.getStorageSync('orderIds'));
			uni.removeStorageSync('orderIds');
		}
	})
</script>

<style scoped lang="scss">
	.container {
		min-height: 100vh;
		background: #F1EFEC;
		
		.content {
			padding: 0 32rpx;
			margin-top: 30rpx;
			
			.com-info {
				height: 260rpx;
				box-sizing: border-box;
				background: #FFFFFF;
				border-radius: 20rpx;
				padding: 36rpx 30rpx;
				
				.com-head {
					border-bottom: 1rpx solid #EEEEEE;
					
					.com-icon {
						width: 50rpx;
						height: 50rpx;
						border-radius: 12rpx;
						margin-right: 23rpx;
					}
				}
				
				.com-bottom {
					padding-top: 30rpx;
					
					.head-icon {
						width: 46rpx;
						height: 46rpx;
						margin-bottom: 8rpx;
					}
				}
			}
			
			.goods-list {
				height: 360rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				margin: 30rpx 0;
				padding: 32rpx;
				box-sizing: border-box;
				
				.goos-item {
					border-bottom: 1rpx solid #EEEEEE;
					padding-bottom: 30rpx;
					
					.goosd-bottom {
						align-content: flex-end;
					}
				}
				
				.goods-img {
					width: 150rpx;
					height: 150rpx;
					background: #D9CDB3;
					border-radius: 20rpx;
				}
				
				.goods-title {
					width: 277rpx;
				}
			}
			
			.integral-info {
				padding: 32rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				
				.integra-title {
					width: 230rpx;
					height: 56rpx;
					background: $bgLgColor;
					border-radius: 28rpx 28rpx 0rpx 0rpx;
					text-align: center;
					line-height: 56rpx;
					margin: 0 auto 33rpx;
				}
			}
		}
		
		.bottom-bar {
			width: 750rpx;
			height: 158rpx;
			background: #FFFFFF;
			position: fixed;
			bottom: 0;
			padding: 18rpx 30rpx 62rpx;
			box-sizing: border-box;
			
			.pay-btn {
				width: 276rpx;
				height: 78rpx;
				background: $bgLgColor;
				border-radius: 39rpx;
				font-weight: 500;
				font-size: 30rpx;
				color: #FFFFFF;
				text-align: center;
				line-height: 78rpx;
			}
		}
	}
</style>