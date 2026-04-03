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
					<up-icon :name="imgUrl+'static/B-direct-car-active.png'" size="40" ></up-icon>
					 <up-badge max="99" bgColor="#FF4B33" absolute :offset="[-2,-2]" :value="totalObj.total"></up-badge>
				</view>
				<view class="item-price" >
					<view class="newPrice"><text class="fs-28">￥</text>{{decimalPointDivision(totalObj.amount,'left')}}<text class="fs-28">{{decimalPointDivision(totalObj.amount,'right')}}</text></view>
					<view class="oldPrice">￥{{totalObj.oldAmount}}</view>
				</view>
			</view>
		</view>
		<view class="carView-right">
			<view class="carView-right-item kongView" v-if="!totalObj.amount">去结算</view>
			<view class="carView-right-item subButt" v-else @click="payAmount">去结算</view>
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
				<view class="scrollItem" v-for="(item,index) in list" :key="index">
					<view class="scrollItem-select">
						<up-icon :name="imgUrl+'del/select_true.png'" size="16"></up-icon>
					</view>
					<view class="card" >
						<image class="card-image" lazy-load :src="imgUrl+'dsewf.png'" mode></image>
						<view class="card-center">
							<up-text :text="item.name" size="14" color="#000000" bold lines="1"></up-text>
							<view class="card-center-botom">
								<view class="card-center-price">
									<view class="newPrice"><text class="fs-24">￥</text>{{decimalPointDivision(item.price,'left')}}<text class="fs-28">{{decimalPointDivision(item.price,'right')}}</text></view>
									<view class="oldPrice">￥15</view>
								</view>
								<up-number-box v-if="item.number" v-model="item.number" bgColor="none">
									<template #minus>
										<up-icon name="minus-circle" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
									</template>
									<template #plus>
										<up-icon name="plus-circle-fill" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
									</template>
								</up-number-box>
								<up-icon v-else name="plus-circle-fill" size="22" :color="themeStore.themeColors.$primaryColor"></up-icon>
							</view>
						</view>
					</view>
				</view>
				<up-gap height="10"></up-gap>
			</scroll-view>
		</view>
		<up-gap height="80"></up-gap>
	</up-popup>
</template>

<script setup lang="ts">
	import {decimalPointDivision} from "@/utils/util";
	import { imgUrl } from '@/config';
	
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	
	const props = defineProps({
		zIndex:{
			type:[String,Number],
			default:10085,
		},
		list:{
			type:Array,
			default:()=>[{}]
		}
	});
	const show = ref<Boolean>(false);
	const shopList = ref([{}]);
	const totalObj = computed(()=>{
		let tot = {
			total:0,
			amount:0,
			oldAmount:0,
		}
		for(let i in props.list){
			tot.total += props.list[i].number
			tot.amount += props.list[i].number * props.list[i].price
			tot.oldAmount += props.list[i].number * props.list[i].oldPrice
		}
		return tot
	})
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
	// 去支付
	const payAmount = () =>{
		
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
				.card{
					width: calc(100% - 80rpx);
					padding: 10rpx 30rpx 10rpx 0;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					background: #FFFFFF;
					border-radius: 20rpx 0rpx 0rpx 20rpx;
					.card-image{
						width: 126rpx;
						height: 126rpx;
						background: #F5F5F5;
						border-radius: 16rpx;
					}
					.card-center{
						width: calc(100% - 126rpx);
						padding-left: 27rpx;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.card-center-botom{
							.card-center-price{
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
							
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: space-between;
						}
					}
				}
			}
		}
	}
	
	
</style>