<template>
	<view>
		<view v-for="(item,index) in list" :key="index">
			<view class="card" :style="cardStyle" @click="handleNav(item.id)">
				 <up-image :src="item.images" width="172rpx" height="172rpx" radius="16rpx" :lazy-load="true"></up-image>
				<view class="card-center">
					<view class="card-name texNoWrap2">{{item.name}}</view>
					<up-gap height="10"></up-gap>
					<view class="card-price">{{item.price}}万起</view>
				</view>
				<image 
				      v-if="user==1"
				      class="card-icon" 
				      :src="item.icon || imgUrl + `static/new-car-logo-icon${index < 3 ? index + 1 :5}.png`" 
				      mode=""
				    ></image>
			</view>
			<up-gap height="12" v-if="isGap"></up-gap>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed,defineProps} from 'vue';
	import {imgUrl} from '@/config';
	import { toNav,toBack } from '@/utils/route';
	import type {CarType} from '../types';
	interface Props {
	  list: CarType[];
	  isIcon:boolean;
	  padding:string;
	  isGap:boolean;
	  user: number;
	}
	const props = withDefaults(defineProps<Props>(), {
		isIcon:false,
		padding:'',
		isGap:true,
	
	});
	const cardStyle = computed(()=>{
		let style = {};
		if(props.padding) {
			style.padding = props.padding;
		}
		if(props.isIcon) {
			style.paddingTop = '40rpx';
		}
		return style;
	})
	const handleNav=(id:Number)=>{
			uni.navigateTo({
			    url: `/pages_D/newCar/detail?id=${id}`
			});
			
		}
</script>
<style lang="scss" scoped>
	.card{
		width: 100%;
		padding: 40rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 14rpx;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138,78,0,0.05);
		
		display: flex;
		justify-content: space-between;
		position: relative;
		.card-icon{
			width: 126rpx;
			height: 40rpx;
			position: absolute;
			left: 24rpx;
			top: 16rpx;
		}
		.card-center{
			width: calc(100% - 172rpx - 30rpx);
			.card-name{
				font-weight: 700;
				font-size: 32rpx;
				color: #333333;
				line-height: 60rpx;
			}
			.card-price{
				font-weight: 700;
				font-size: 28rpx;
				color: #FF9000;
			}
			
		}
		
	}
</style>