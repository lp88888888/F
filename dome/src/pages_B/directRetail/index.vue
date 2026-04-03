<template>
	<view class="">
		<Home v-if="tabbarType == 'home'" :topBgColor="topBgColor"></Home>
		<Collection v-if="tabbarType == 'collection'"></Collection>
		<OrderList v-if="tabbarType == 'order'"></OrderList>
	<!-- 	<up-tabbar
			:value="tabbarType"
			@change="changeTab"
			:activeColor="theme.$color"
			:customStyle="{paddingTop:'10rpx'}"
			:fixed="true"
			:placeholder="true"
			:safeAreaInsetBottom="true"
		>
			<up-tabbar-item name="home" text="推荐"  @click="click1" >
				<template #active-icon><image class="tabbar_icon_image" :src="imgUrl+'static/B-direct-tabbar-home-active.png'"></image></template>
				<template #inactive-icon><image class="tabbar_icon_image" :src="imgUrl+'static/B-direct-tabbar-home-inactive.png'"></image></template>
			</up-tabbar-item>
			<up-tabbar-item name="collection" text="收藏" @click="click1" >
				<template #active-icon><image class="tabbar_icon_image" :src="imgUrl+'static/B-direct-tabbar-collection-active.png'"></image></template>
				<template #inactive-icon><image class="tabbar_icon_image" :src="imgUrl+'static/B-direct-tabbar-collection-inactive.png'"></image></template>
			</up-tabbar-item>
			<up-tabbar-item name="order" text="订单" @click="click1" >
				<template #active-icon><image class="tabbar_icon_image" :src="imgUrl+'static/B-direct-tabbar-order-active.png'"></image></template>
				<template #inactive-icon><image class="tabbar_icon_image" :src="imgUrl+'static/B-direct-tabbar-order-inactive.png'"></image></template>
			</up-tabbar-item>
		</up-tabbar> -->
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import Home from './home.vue';
	import Collection from './collection.vue';
	import OrderList from './list.vue';
	import { toNav,toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	const topBgColor = ref<string>("#FFFFFF");
	const keyword = ref('');
	const tabbarType = ref('home');
	
	const changeTab = (type) =>{
		tabbarType.value = type
	}
	const click1 = () =>{}
	onPageScroll((e)=>{
		if (e.scrollTop < 1) {
		  topBgColor.value = 'rgba(255,255,255,0)'
		} else {
		  topBgColor.value = "#FFFFFF"
		}
	})
</script>

<style lang="scss">
	@import './index.scss';
	.tabbar_icon_image{
		width: 42rpx;
		height: 42rpx;
	}
	.card{
		width: 100%;
		background: linear-gradient(0deg, #FFFFFF, #FFF3E0);
		border-radius: 20rpx;
		border: 3px solid #FFFFFF;
		padding: 36rpx 31rpx;
		box-sizing: border-box;
		.card-title{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.card-title-left{
				font-family: TBMCYXT;
				font-weight: 400;
				font-size: 36rpx;
				color: #000000;
				.tetxIcon{
					color: $color;
				}
			}
			.card-title-right{
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
			}
		}
	}
	
	.gropFj{
		display: grid;
		grid-template-columns: repeat(2,1fr);
		grid-gap: 32rpx;
		.gropFj-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.gropFj-item-img{
				width: 100rpx;
				height: 100rpx;
				border-radius: 16rpx;
				
			}
			.gropFj-item-cent{
				width: calc(100% - 117rpx);
				.gropFj-item-cent-icon{
					display: inline-block;
					font-size: 20rpx;
					color: $color;
					padding: 4rpx 10rpx;
					border-radius: 6rpx;
					border: 1rpx solid $color;
					box-sizing: border-box;
					
				}
			}
		}
	}
	
	.lisView {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2,1fr);
		grid-gap: 30rpx;
		
		.lisView-item{
			width: 100%;
			padding: 0 25rpx 25rpx 25rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			background: #FFFFFF;
			.lisView-item-img{
				width: 100%;
				height: 328rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width: 240rpx;
					height: 240rpx;
				}
			}
			.lisView-item-center{
				margin-top: -18rpx;
				.lisView-item-shopName{
					width: 100%;
					height: 36rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					border: 1rpx solid #EEEEEE;
					padding: 4rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					image{
						width: 28rpx;
						height: 28rpx;
						border-radius: 8rpx;
						margin-right: 6rpx;
					}
				}
				.lisView-item-price{
					display: flex;
					align-items: flex-end;
					.newPrice{
						color: $color;
						font-weight: bold;
						font-size: 36rpx;
					}
					.oldPrice{
						margin-left: 11rpx;
						color: #BCBCBD;
						font-size: 24rpx;
						text-decoration-line: line-through;
					}
				}
			}
		}
	}
</style>