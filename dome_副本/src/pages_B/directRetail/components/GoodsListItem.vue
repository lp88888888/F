<template>
	<view class="card" :style="{padding:cardPadding}">
		<image class="card-image" :style="[imgStyle]" lazy-load :src="imgUrl+'tx.jpg'" mode=""></image>
		<view class="card-center" :style="[cenStyle]">
			<up-text text="名称名称名称名称名称名称名称名称名称" size="14" color="#000000" bold lines="1"></up-text>
			<up-text v-if="type == 'list'" text="月售200+" size="12" color="#666666" lines="1"></up-text>
			<up-text v-if="type == 'collection'" text="宝鸡西服务区" size="12" color="#999999" lines="1"></up-text>
			<view class="card-center-botom">
				<view class="card-center-price">
					<view class="newPrice"><text class="fs-24">￥</text>{{99}}<text class="fs-28">.56</text></view>
					<view class="oldPrice">￥15</view>
				</view> 
			<!-- 	<up-icon v-if="type == 'list'" name="plus-circle-fill" size="22" :color="themeStore.themeColors.$primaryColor"></up-icon> -->
				<up-number-box v-if="type == 'shopCar'" v-model="value" @change="onChange" bgColor="none">
					<template #minus>
						<up-icon name="minus-circle" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
					</template>
					<template #plus>
						<up-icon name="plus-circle-fill" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
					</template>
				</up-number-box>
			</view>
			<up-text v-if="type == 'collection'" :prefixIcon="imgUrl+'static/B-direct-shop-icon2.png'" :iconStyle="{width:'12px',height:'12px',marginRight:'10rpx'}" text="昆仑好客" size="11" color="#666666" lines="1"></up-text>
		</view>
	</view>
</template>

<script setup>
	import theme from '@/utils/theme'
	import {ref,computed} from 'vue';
	import { imgUrl } from '@/config';
	
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	
	const value = ref(1);
	const props = defineProps({
		imgSize:{
			type:[Number,String],
			default:'160rpx'
		},
		type:{
			type:String,
			default:'list'
		},
		cardPadding:{
			type:String,
			default:'30rpx'
		}
	});
	// 
	const imgStyle = computed(()=>{
		const style = {}
		style.width = props.imgSize;
		style.height = props.imgSize;
		return style
	})
	const cenStyle = computed(()=>{
		const style = {}
		style.width = `calc(100% - ${props.imgSize})`;
		style.minHeight = props.imgSize
		return style
	})
	const onChange = (event) =>{
		console.log(event);
	}
</script>

<style lang="scss" scoped>
	.card{
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		border-radius: 20rpx 0rpx 0rpx 20rpx;
		.card-image{
			border-radius: 16rpx;
		}
		.card-center{
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
</style>