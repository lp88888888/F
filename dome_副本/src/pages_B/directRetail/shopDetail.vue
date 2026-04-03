<template>
	<view>
		<view class="fiexdLeft">
			<up-icon :name="imgUrl+'static/B-direct-back.png'" size="30" color="#AEA48F" @click="toBack"></up-icon>
		</view>
		<view class="swiperView">
			<swiper class="swiper" autoplay :current="current" @change="swiperChange">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image class="swiper-image" :src="item"></image>
					<!-- 	<image :src="imgUrl+'data-shop.png'" style="width: 100%;height: 800rpx;" v-else></image> -->
				</swiper-item>
			</swiper>
			<!-- <view class="swiperView-duration">{{current + 1}}/{{swiperList.length}}</view> -->
		</view>
		<view class="pageView">
			<view class="detaiViewCard card">
				<up-text :text="cartCount.productName" size="17" color="#000000" bold lines="1"></up-text>
				<up-gap height="13"></up-gap>
				<!-- 	<up-text :text="`月售${listObj.productName}`" size="12" color="#999999" lines="1"></up-text> -->
				<up-gap height="9"></up-gap>
				<view class="detaiViewCard-botom">
					<view class="detaiViewCard-price">
						<view class="newPrice"><text class="fs-32">￥</text>{{cartCount.sellingPrice}}</view>
						<!-- 					<view class="oldPrice">￥{{listObj.marketPriceFee}}</view> -->
					</view>
					<!-- 	<view class="detaiViewCard-botom-but">加入收藏</view> -->
				</view>
			</view>
			<up-gap height="15"></up-gap>
			<view class="card detaiInfo">
				<view class="detaiInfo-title">商品详情</view>
				<up-gap height="15"></up-gap>
				<view class="detaiInfo-tabs">
					<view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">产地</view>
						<view class="detaiInfo-tabs-item-text">{{cartCount.brand}}</view>
					</view>
					<view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">简介</view>
						<view class="detaiInfo-tabs-item-text">{{cartCount.remarks}}</view>
					</view>
					<!-- <view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">储存条件</view>
						<view class="detaiInfo-tabs-item-text">冷藏</view>
					</view>
					<view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">净含量</view>
						<view class="detaiInfo-tabs-item-text">200g</view>
					</view> -->
				</view>
				<up-gap height="15"></up-gap>
				<!-- 	<image class="detaiInfo-imsge" :src="imgUrl+'banner4.png'" mode="widthFix"></image> -->
				<up-gap height="15"></up-gap>
				<view class="detaiInfo-text">
					<u-parse :content="listObj.detail"></u-parse>
				</view>
			</view>
		</view>

		<view class="fixedBut">
			<view class="fixedBut-item" style="width: 100%;" @click="toNav('/pages_B/directRetail/list')">立即支付</view>
		</view>

		<view class="fixedBut">
			<view style="display: flex;align-items: center;gap: 40rpx;">
				<view class="pr flex flex-col ali-cen" @click="toNav('/pages_B/directRetail/shopCar')">
					<image class="icon-44" :src="imgUrl + 'jf/jf_cart.png'" mode=""></image>
					<text class="fs-22 col3">购物车</text>
					<view v-if="Count > 0" class="dot"
						:class="['dot',Count < 10 ? 'dot--1' : (Count < 100 ? 'dot--2' : 'dot--3')]">
						{{ Count > 99 ? '99+' : Count }}
					</view>

				</view>
				<view class="pr flex flex-col ali-cen">
					<up-icon name="star" size="24" v-if="collect" @click="addcreateFun()"></up-icon>
					<up-icon name="star-fill" color="#069FA4" size="24" v-else @click="deletecreateFun()"></up-icon>
					<view class="fs-22 col3">收藏</view>
				</view>
			</view>

			<view class="btn-group">
				<view class="btn-cart" @click="addCarShop">加入购物车</view>
				<view class="btn-pay" @click="payAmount">立即支付</view>
			</view>
			<!-- <view class="fixedBut-item" @click="addCarShop">加入购物车</view> -->
		</view>

		<up-gap height="80"></up-gap>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, computed } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import {
		userDefaultAddr
	} from '@/api/user';
	import { getPrShopSpu, postshopincrItem, getShopOrderlist, getShopCarProdCount, addcreate, getprodCount, exitscreate, deletecreate } from '@/api/points';
	import { toast, debounce } from '@/utils/common';
	import { showToastSuccess } from '@/utils/util';
	import { selectProductList } from '@/api/directretail';
	const cartCount = ref({});
	const Count = ref(0)
	const current = ref<number>(0);
	const listObj = ref<any>({})
	const swiperList = ref([])
	const collect = ref(true)
	const swiperChange = (e) => {
		current.value = e.detail.current;
	}
	const addrId = ref('')
	const getPrShopSpuFun = async (id : string | number) => {
		const res = await getPrShopSpu(id);
		listObj.value = res.data
		swiperList.value = res.data.imgUrls ? res.data.imgUrls.split(',') : []
	}
	const addCarShop = debounce(async () => {

		const res = await postshopincrItem({
			shopId: cartCount.value.stockId,
			spuId: cartCount.value.id,
		})
		if (res.code == 200) {
			showToastSuccess('加入购物车成功');
			getprodCountFun();
		} else {
			toast(res.msg);
		}
	}, 300)
	// 收藏 
	const addcreateFun = async () => {
		let params = {
			spuId: cartCount.value.id,
			stockid: cartCount.value.stockId,
			merchantType: 2
		}
		let res = await addcreate(params)
		if (res.code === 200) {
			collect.value = false
			uni.showToast({ title: '加入收藏成功', icon: 'success' })
		}
	}
	const payAmount = debounce(async () => {
		if (!addrId.value) return toast('请先添加地址');
		const res = await getShopOrderlist({
			payRetailShopOrderItemDtoList: [{
				shopId: cartCount.value.stockId,
				count: 1,
				spuId: cartCount.value.id,
			}],

			orderAddrId: addrId.value,
		})
		if (res.code == 200) {
			toNav('/pages_B/directRetail/list')
		} else {
			toast(res.msg);
		}

	}, 1000)
	const deletecreateFun = async () => {
		let params = {
			spuId: cartCount.value.id,
			stockid: cartCount.value.stockId,
			merchantType: 2
		}
		let res = await deletecreate(params)
		if (res.code === 200) {
			collect.value = true
			uni.showToast({ title: '取消收藏', icon: 'none' })
		}
	}
	const exitscreateFun = async (id : string | number) => {
		let params = {
			spuId: id,
			merchantType: 2
		}
		let res = await exitscreate(params)
		if (res.code == 200) {
			if (res.data == true) {
				collect.value = false
			} else {
				collect.value = true
			}
		}
	}
	const getprodCountFun = async () => {
		let res = await getprodCount()
		if (res.code === 200) {
			Count.value = res.data
		}
	}
	const selectMerchantByIdFun = async (id : any) => {
		let params = {
			id: id
		}
		let res = await selectProductList(params)
		if (res.code === 200) {
			cartCount.value = res.rows[0]
			swiperList.value.push(res.rows[0].imgUrl)
		}
	}
	const getAddr = async () => {
		try {
			const res = await userDefaultAddr()
			if (res.code == 200) {
				addrId.value = res.data.addrId
			}
		} catch (err) {
			console.log(err);
		}
	}
	onLoad((options) => {
		selectMerchantByIdFun(options.spuId);
		exitscreateFun(options.spuId)
		getAddr()
	})
	onShow(() => {
		getprodCountFun()
	})
</script>

<style lang="scss">
	page {
		background: $pageBgColor;
	}

	.btn-box {
		background: rgba(0, 0, 0, 0.26);
		border-radius: 50%;
		// opacity: 0.26;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 10rpx;
		margin-right: 16rpx;
	}

	.btn-group {
		width: 55%;
		margin-top: 20rpx;
		display: flex;
		border: 2rpx solid #2dd4bf;
		/* 边框颜色（和按钮主色一致） */
		border-radius: 28px;
		/* 圆角，根据按钮高度调整 */
		overflow: hidden;
		/* 裁剪子元素圆角外的部分 */
		height: 70rpx;
	}

	.btn-cart,
	.btn-pay {
		flex: 1;
		padding: 15rpx 0;
		font-size: 28rpx;
		font-weight: 500;
		text-align: center;
		cursor: pointer;
		border: none;
		outline: none;
	}

	/* 加入购物车按钮样式 */
	.btn-cart {
		background-color: #fff;
		color: #00BEBE;
	}

	/* 立即支付按钮样式 */
	.btn-pay {
		background-color: #00BEBE;
		color: #fff;
	}

	.pageView {
		padding: 32rpx;
		box-sizing: border-box;
	}

	.fiexdLeft {
		position: fixed;
		top: 100rpx;
		left: 30rpx;
		z-index: 99;
	}

	.swiperView {
		width: 750rpx;
		height: 750rpx;
		position: relative;

		.swiperView-duration {
			display: inline-block;
			background: #000000;
			border-radius: 21rpx;
			opacity: 0.2;
			font-weight: 500;
			font-size: 26rpx;
			color: #FFFFFF;
			padding: 4rpx 19rpx;
			box-sizing: border-box;
			position: absolute;
			right: 42rpx;
			bottom: 70rpx;
		}
	}

	.swiper {
		width: 750rpx;
		height: 750rpx;

		.swiper-image {
			width: 750rpx;
			height: 750rpx;
		}
	}

	.card {
		width: 100%;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 32rpx;
		box-sizing: border-box;
	}

	.detaiViewCard {
		// margin-top: -70rpx;
		position: relative;
		z-index: 2;

		.detaiViewCard-botom {
			.detaiViewCard-price {
				display: flex;
				align-items: flex-end;
				line-height: 32rpx;

				.newPrice {
					color: $color;
					font-weight: bold;
					font-size: 50rpx;

				}

				.oldPrice {
					margin-left: 11rpx;
					color: #BCBCBD;
					font-size: 32rpx;
					text-decoration-line: line-through;
				}
			}

			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.detaiViewCard-botom-but {
				width: 170rpx;
				height: 60rpx;
				background: $bgLgColor;
				border-radius: 30rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.detaiInfo {
		.detaiInfo-title {
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}

		.detaiInfo-tabs {
			background: #F5F5F5;
			border-radius: 20rpx;
			padding: 18rpx 20rpx;
			box-sizing: border-box;

			&-item {
				display: flex;
				// align-items: center;
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

		.detaiInfo-imsge {
			width: 100%;
		}

		.detaiInfo-text {
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			line-height: 56rpx;
		}
	}

	.fixedBut {
		width: 750rpx;
		height: 158rpx;
		background: #FFFFFF;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		padding: 15rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;

		.pr {
			position: relative;
		}

		.dot {
			position: absolute;
			top: -4rpx;
			right: 0;
			height: 28rpx;
			min-width: 28rpx;
			padding: 0;
			background: #F4190A;
			border-radius: 14rpx;
			font-weight: 500;
			font-size: 20rpx;
			color: #FFFFFF;
			text-align: center;
			line-height: 28rpx;
			box-sizing: border-box;
			transform: translate(30%, -30%);
		}

		/* 个位（0-9）：保持正圆 */
		.dot--1 {}

		/* 两位数（10-99）：椭圆 */
		.dot--2 {
			padding: 0 10rpx;
			min-width: 28rpx;
		}

		/* 100+：显示 99+ */
		.dot--3 {
			padding: 0 8rpx;
			font-size: 18rpx;
			min-width: 36rpx;
		}

		.fixedBut-item {
			width: 570rpx;
			height: 88rpx;
			background: $bgLgColor;
			border-radius: 44rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	::v-deep .u-navbar__content {
		background: transparent !important;
	}
</style>