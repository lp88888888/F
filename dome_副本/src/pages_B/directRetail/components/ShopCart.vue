<template>
	<!-- 购物车 -->
	<view class="carView" :style="{ zIndex }">
		<view class="carView-left">
			<view class="leftKongView" v-if="!shopList.length">
				<up-icon :name="imgUrl+'static/B-direct-car-kong.png'" size="40" ></up-icon>
				<text>购物车是空的</text>
			</view>
			<view v-else class="carView-left-item" @click="open">
				<view class="badgebox">
					<up-icon :name="imgUrl+'static/B-direct-car-active.png'" size="40" :color="{color: themeStore.themeColors.$primaryColor}"></up-icon>
					 <up-badge max="99" bgColor="#FF4B33" absolute :offset="[-2,-2]" value="5"></up-badge>
				</view>
				<view class="item-price" >
					<view class="newPrice"><text class="fs-28">￥</text>{{99}}<text class="fs-28">.56</text></view>
					<view class="oldPrice">￥15</view>
				</view>
			</view>
		</view>
		<view class="carView-right">
			<view class="carView-right-item kongView" v-if="!shopList.length">￥56起送</view>
			<view class="carView-right-item subButt" v-else @click="toNav('./orderAdd')">去结算</view>
		</view>
	</view>
	<up-popup :show="show" @close="close" round="10" @open="open" :safeAreaInsetBottom="false">
		<view class="shopPop">
			<view class="shopPop-title">
				<view class="flex-alims-cen" @click="allSelect">
					<up-icon :name="imgUrl+'del/select_false.png'" size="16"></up-icon>
					<text class="shopPop-title-text1">全选</text>
					<text class="shopPop-title-text2">（已选<text>{{2}}</text>件）</text>
				</view>
				<view class=" flex-alims-cen" @click="clearSelect">
					<up-icon :name="imgUrl+'static/B-direct-trash.png'" size="15" color="#999999"></up-icon>
					<text class="titleCleartetx">清空</text>
				</view>
			</view>
			<scroll-view class="shopPop-scroll" :scroll-y="true">
				<view class="scrollItem">
					<view class="scrollItem-select">
						<up-icon :name="imgUrl+'del/select_true.png'" size="16"></up-icon>
					</view>
					<GoodsListItem imgSize="126rpx" type="shopCar" cardPadding="10rpx 30rpx 10rpx 0"></GoodsListItem>
				</view>
				<view class="scrollItem">
					<view class="scrollItem-select">
						<up-icon :name="imgUrl+'del/select_true.png'" size="16"></up-icon>
					</view>
					<GoodsListItem imgSize="126rpx" type="shopCar" cardPadding="10rpx 30rpx 10rpx 0"></GoodsListItem>
				</view>
				<up-gap height="10"></up-gap>
			</scroll-view>
		</view>
		<up-gap height="80"></up-gap>
	</up-popup>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { toNav,toBack } from '@/utils/route';
	import GoodsListItem from './GoodsListItem.vue';
	import { imgUrl } from '@/config';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	
	const props = defineProps({
		zIndex:{
			type:[String,Number],
			default:10085,
		}
	});
	const show = ref<Boolean>(false);
	const shopList = ref([{}]);
	
	const close = () =>{
		show.value = false
	}
	const open = () =>{
		show.value = true
	}
	
	// 全选
	const allSelect = () =>{
		
	}
	// 清除
	const clearSelect = () => {
		
	}
	
</script>

<style lang="scss" scoped>
	.carView{
		width: 100%;
		height: 160rpx;
		padding: 20rpx 32rpx 60rpx 32rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 0;
		background: #FFFFFF;
		
		border-top: 1rpx solid #E0E0E0;
		
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.carView-left{
			.carView-left-item{
				display: flex;
				align-items: center;
				.badgebox{
					position: relative;
				}
				.item-price{
					display: flex;
					align-items: flex-end;
					padding-left: 20rpx;
					box-sizing: border-box;
					line-height: 33rpx;
					.newPrice{
						color: $color;
						font-size: 44rpx;
					}
					.oldPrice{
						margin-left: 11rpx;
						color: #BCBCBD;
						font-size: 24rpx;
						text-decoration-line: line-through;
					}
				}
			}
			.leftKongView{
				display: flex;
				align-items: center;
				text{
					font-weight: 500;
					font-size: 28rpx;
					color: #666666;
					margin-left: 20rpx;
				}
			}
		}
		.carView-right{
			.carView-right-item{
				width: 216rpx;
				height: 78rpx;
				border-radius: 39rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				font-size: 30rpx;
			}
			.kongView{
				background: linear-gradient(-40deg, #AFB0AF, #C7C6C6);
				color: #FFFFFF;
			}
			.subButt{
				background: $bgLgColor;
				color: #FFFFFF;
			}
		}
	}
	
	.shopPop{
		.shopPop-title{
			height: 96rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #E0E0E0;
			.shopPop-title-text1{
				margin-left: 20rpx;
				font-weight: bold;
				font-size: 28rpx;
				color: #000000;
			}
			.shopPop-title-text2{
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
				text{
					color: $color;
				}
			}
			.titleCleartetx{
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
				margin-left: 10rpx;
			}
		}
		.shopPop-scroll{
			max-height: 50vh;
			.scrollItem{
				display: flex;
				align-items: center;
				.scrollItem-select{
					width: 80rpx;
					display: flex;
					justify-content: center;
				}
			}
		}
	}
</style>