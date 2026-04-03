<template>
	<view class="page-container">
		<up-navbar title=" " bgColor="transparent" @leftClick="toBack" leftIconColor="#333333" :placeholder="false"
			:titleStyle="{fontWeight:'600'}"></up-navbar>
		<swiper class="swiperBox" :circular="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<image class="swiperBox-img" :src="item" mode=""></image>
			</swiper-item>
		</swiper>
		<view class="pageView">
			<view class="card"
				style="margin-top: -30rpx;padding: 42rpx 32rpx 38rpx 32rpx;position: relative;z-index: 2;">
				<view class="detName">{{Detail.goodsName}}</view>
				<view class="detTetx texNoWrap"></view>
				<view class="fl-ce-sb">
					<view class="item-price" style="padding-left: 0;">
						<view class="newPrice"><text
								class="fs-24">￥</text>{{decimalPointDivision(Detail.discountPrice,'left')}}<text
								class="fs-28">{{decimalPointDivision(Detail.discountPrice,'right')}}</text></view>
						<view class="oldPrice m-l-20">¥{{ Detail.price }}</view>
					</view>
					<!-- <view class="addCarBox">加入购物车</view> -->
				</view>
			</view>
			<view class="card m-t-30" style="padding: 20rpx 32rpx 38rpx 32rpx;">
				<!-- <view class="tabsBox fl-ce-sb">
					<view class="tabsBox-item" @click="tabsChange(1)">
						<view class="tabsBox-item-label" :class="[tabsIndex == 1?'tabsActive':'']">商品详情</view>
						<view class="tabsBox-item-line" v-if="tabsIndex == 1"></view>
					</view>
					<view class="tabsBox-item" @click="tabsChange(2)">
						<view class="tabsBox-item-label" :class="[tabsIndex == 2?'tabsActive':'']">评价</view>
						<view class="tabsBox-item-line" v-if="tabsIndex == 2"></view>
					</view>
				</view> -->
				<view class="detaiInfo-tabs">
					<view class="text-with-line">套餐详情</view>
					<view class="section"  v-for="(item, index) in dishList" :key="index">7-q
						<view class="section-title">{{item.ombineDesc}}</view>
						<view class="dish-item">
							<view class="dish-name">{{ item.goodsName }}</view>
							<view><text class="dish-moneys">(1份，标准)</text></view>
						</view>
					</view>

					<!-- 饮品区域 -->
					<view class="section">
						<view class="section-title">饮品（三选一）</view>
						<view class="dish-item" v-for="(item, index) in rinkList" :key="index">
							<view class="dish-name">{{ item.goodsName }}</view>
						    <view><text class="dish-text">¥{{ item.price }}</text></view>
						</view>
					</view>
					<!-- <view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">产地</view>
						<view class="detaiInfo-tabs-item-text">陕西西安</view>
					</view>
					<view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">套餐内容</view>
						<view class="detaiInfo-tabs-item-text">肉夹馍+擀面皮</view>
					</view>
					<view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">净含量</view>
						<view class="detaiInfo-tabs-item-text">200g</view>
					</view> -->
				</view>
			</view>
			<view class="card m-t-30" style="padding: 20rpx 32rpx 38rpx 32rpx;">
				<view class="detaiInfo-tabs">
					<view class="text-with-line">产品介绍</view>
                     <rich-text :nodes="goodsDesc"></rich-text>
				</view>
			</view>
			<!-- <view class="card m-t-30" style="padding: 40rpx 32rpx 10rpx 32rpx;">
				<view class="fl-ce-sb">
					<view class="card-title">
						用户评价
					</view>
					<view class="fl-al-ce">
						<text class="title-right">查看全部（<text>{{list.length || 0}}</text>）</text>
						<up-icon name="arrow-right" color="#999999" size="12"></up-icon>
					</view>
				</view>
				<view class="pjBox" >
					<view v-for="(item,index) in list" :key="index">
						<up-line v-if="index >0"  color="#EEEEEE"></up-line>
						<view class="pjBox-item">
							<view class="fl-ce-sb">
								<view class="fl-al-ce">
									<up-image :src="imgUrl+'tx.jpg'" width="44rpx" height="44rpx" shape="circle"></up-image>
									<text class="usName m-l-10">{{item.name}}</text>
								</view>
								<view class="usTime">{{item.time}}</view>
							</view>
							<view class="usText m-t-20">{{item.text}}</view>
							<view class="usImgs" v-if="item.images && item.images.length">
								<image class="usImgs-item" v-for="(url,indx) in item.images" :key="indx" :src="url" mode></image>
							</view>
							<view class="fl-ce-fe">
								<image class="usDzImg" @click.stop="giveClick(item,index)" :src="imgUrl+`${item.isGive?'static/B-din-dz-true-icon.png':'static/B-din-dz-false-icon.png'}`" mode=""></image>
								<text class="usDzText m-l-10" :style="{color: item.isGive?theme.$color:'#333333'}" @click.stop="giveClick(item,index)">点赞</text>
							</view>
						</view>
					</view>
					
				</view>
			</view> -->
		</view>
		<up-gap height="90"></up-gap>
		<!-- <view class="carView" >
			<view class="carView-left">
				<view class="carView-left-item">
					<view class="badgebox">
						<up-icon :name="imgUrl+'static/B-direct-car-active.png'" size="40" :color="theme.$color"></up-icon>
						 <up-badge max="99" bgColor="#FF4B33" absolute :offset="[-4,-4]" value="5" :customStyle="{border:'5rpx solid #FFFFFF'}"></up-badge>
					</view>
					<view class="item-price" >
						<view class="newPrice"><text class="fs-28">￥</text>{{133}}<text class="fs-28">.56</text></view>
						<view class="jPrice m-l-20">共减￥10</view>
					</view>
				</view>
			</view>
			<view class="carView-right">
				<view class="carView-right-item subButt" @click="tojisuan" >去结算</view>
			</view>
		</view> -->
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import theme from '@/utils/theme';
	import { onLoad } from '@dcloudio/uni-app';
	import { decimalPointDivision } from "@/utils/util";
	import {odsFzgRestaurantGoods} from"@/api/premium"
	const list = ref([
		{ name: '少年的你0136', time: '2025-10-13', text: '这个服务区的餐饮做的真不错，很喜欢吃，也推荐给大家，不仅服务态度好，味道也很棒。', images: [imgUrl + 'fwe.png', imgUrl + 'dsewf.png', imgUrl + 'ge.png',], isGive: false },
		{ name: '梦想家0207', time: '2025-10-13', text: '点铺环境干净卫生，饭菜的整体口味适中，服务员态度都很好，推荐给大家。', images: [], isGive: false },
	]);
	const Detail = ref({});
	const swiperList = ref([])
	const tabsIndex = ref(1);
	const shopid= ref('');
	const goodsDesc= ref('');
	const dishList = ref([])
	const rinkList = ref([])
	const tabsChange = (index) => {
		tabsIndex.value = index
	}
	const tojisuan = () => {
		toNav('/pages_B/dining/orderAdd')
	}
	const giveClick = (item, index) => {
		list.value[index].isGive = !item.isGive
	}
	const odsFzgRestaurantGoodsFun = async (id:number) => {
		const res = await odsFzgRestaurantGoods(id);
		goodsDesc.value=res.data.goodsDesc
		dishList.value=res.data.odsFzgRestaurantGoodsPackageDetailVoList
		rinkList.value=res.data.odsFzgRestaurantSpecGoodsVoList
	}
	onLoad((opticon) => {
		if (uni.getStorageSync('diningGoodsDetail')) {
			Detail.value = uni.getStorageSync('diningGoodsDetail');
			swiperList.value = Detail.value.goodsPicture ? Detail.value.goodsPicture.split(',') : [];
			// odsFzgRestaurantGoodsFun(opticon.id)
			odsFzgRestaurantGoodsFun('1766123013')
			
		}
	})
</script>

<style lang="scss" scoped>
	.page-container {
		min-height: 100vh;
		background: $pageBgColor;
	}

	.swiperBox {
		width: 100%;
		height: 750rpx;

		.swiperBox-img {
			width: 100%;
			height: 100%;
		}
	}

	.pageView {
		padding: 0 32rpx 32rpx 32rpx;
		box-sizing: border-box;
	}

	.detName {
		font-weight: 800;
		font-size: 34rpx;
		color: #000000;
		line-height: 34rpx;
	}

	.detTetx {
		margin: 26rpx 0;
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
		line-height: 24rpx;
	}

	.addCarBox {
		width: 200rpx;
		height: 60rpx;
		background: $bgLgColor;
		border-radius: 30rpx;
		font-weight: 500;
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 60rpx;
		text-align: center;
	}

	.card {
		width: 100%;
		padding: 0 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 26rpx;
	}

	.tabsBox {
		margin-bottom: 20rpx;

		.tabsBox-item {
			flex: 1;
			height: 60rpx;
			position: relative;

			.tabsActive {
				font-weight: bold !important;
			}

			.tabsBox-item-label {
				line-height: 60rpx;
				text-align: center;
				font-weight: 500;
				font-size: 28rpx;
				color: #000000;
			}

			.tabsBox-item-line {
				width: 50rpx;
				height: 6rpx;
				background: $bgLgColor;
				border-radius: 4rpx 4rpx 0rpx 0rpx;
				position: absolute;
				left: calc((100% - 50rpx) / 2);
				bottom: 0;
			}
		}

	}



	.detaiInfo-tabs {
		border-radius: 20rpx;
		box-sizing: border-box;

		&-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 18rpx 0;

			&-label {
				width: 186rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #999999;
			}

			&-text {
				width: calc(100% - 186rpx - 20rpx);
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
			}
		}

	}

	.card-title {
		font-weight: bold;
		font-size: 32rpx;
		color: #000000;
	}

	.title-right {
		font-weight: 500;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #999999;
	}

	.title-right text {
		color: $color;
	}

	.pjBox {
		.pjBox-item {
			padding: 30rpx 0;
			box-sizing: border-box;
		}

		.usName {
			font-weight: bold;
			font-size: 24rpx;
			color: #000000;
		}

		.usTime {
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
		}

		.usText {
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			line-height: 50rpx;
		}

		.usImgs {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 10rpx;
			margin: 20rpx 0;

			.usImgs-item {
				width: 196rpx;
				height: 196rpx;
			}
		}

		.usDzImg {
			width: 26rpx;
			height: 26rpx;
		}

		.usDzText {
			font-size: 24rpx;
			font-weight: 500;
		}
	}

	.carView {
		width: 100%;
		height: 160rpx;
		padding: 20rpx 32rpx 60rpx 32rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.carView-left {
			.carView-left-item {
				display: flex;
				align-items: center;

				.badgebox {
					position: relative;
				}

			}

			.leftKongView {
				display: flex;
				align-items: center;

				text {
					font-weight: 500;
					font-size: 28rpx;
					color: #666666;
					margin-left: 20rpx;
				}
			}
		}

		.carView-right {
			.carView-right-item {
				width: 216rpx;
				height: 78rpx;
				border-radius: 39rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				font-size: 30rpx;
			}

			.kongView {
				background: linear-gradient(-40deg, #AFB0AF, #C7C6C6);
				color: #FFFFFF;
			}

			.subButt {
				background: $bgLgColor;
				color: #FFFFFF;
			}
		}
	}

	.item-price {
		display: flex;
		align-items: flex-end;
		padding-left: 20rpx;
		box-sizing: border-box;
		line-height: 33rpx;

		.newPrice {
			color: $color;
			font-weight: bold;
			font-size: 44rpx;
		}

		.jPrice {
			font-weight: 500;
			font-size: 20rpx;
			color: #FF4B33;
		}

		.oldPrice {
			color: #BCBCBD;
			font-size: 24rpx;
			text-decoration-line: line-through;
		}
	}

	.text-with-line {
		position: relative;
		padding-left: 20rpx;
	}

	.text-with-line::before {
		content: '';
		position: absolute;
		left: 0;
		top: 4rpx;
		width: 6rpx;
		height: 80%;
		background: $pColor;
		border-radius: 0rpx 8rpx 8rpx 0rpx;
	}

	.section {
		padding: 20rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 15rpx;
		color: #333;
	}

	.dish-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15rpx 0;
	}

	.dish-name {
		max-width: 470rpx;
		font-size: 28rpx;
		color: #333;
	}

	.dish-desc {
		font-size: 24rpx;
		color: #999;
		margin: 0 20rpx;
	}

	.dish-price {
		width: 240rpx;
		display: flex;
		justify-content: space-between;
	}
	.dish-money {
		color: #999999;
		font-size: 24rpx;
		margin-right: 40rpx;
	}
    .dish-moneys{
		color: #999999;
		font-size: 24rpx;
	}
	.dish-text {
		font-size: 28rpx;
		color: #666666;
	}
</style>