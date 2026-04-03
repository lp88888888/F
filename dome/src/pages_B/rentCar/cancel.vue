<template>
	<view class="">
		<view class="pageView" style="padding: 32rpx;">
			<view class="selView">
				<view class="selView-title"><text>*</text>请选择取消原因</view>
				<view class="selView-center">
					<view class="selView-center-item" :class="[item.name == selectIndex?'active':'']" v-for="(item,index) in dataList" :key="index" @click="seleClick(item)">
						<view class="selView-center-item-label">{{item.name}}</view>
						<view class="selView-center-item-icon">
							<up-icon v-if="item.name == selectIndex" :name="imgUrl+'del/select_true.png'" size="16"></up-icon>
							<up-icon v-else :name="imgUrl+'del/select_false.png'" size="16"></up-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottomBut">
			<view class="bottomBut-item">立即提交</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	import { imgUrl } from '@/config';
	const selectIndex = ref('');
	const dataList = ref([
		{name:'计划有变，无法使用'},
		{name:'不想租了'},
		{name:'定错了'},
		{name:'商家服务态度不好'},
		{name:'到店后告知无所订车型'},
		{name:'车辆状况异常'},
	])
	const totalAmount = ref(68.45);
	
	const seleClick = (item:any) =>{
		selectIndex.value = item.name;
	}
</script>

<style lang="scss">
	page{
		background: $pageBgColor;
	}
	.selView{
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		.selView-title{
			display: inline-flex;
			align-items: center;
			font-weight: bold;
			font-size: 32rpx;
			color: #000000;
			line-height: 30rpx;
			text{
				display: inline-block;
				line-height: 10rpx;
				color: #FF0000;
				padding-top: 10rpx;
				margin-right: 10rpx;
			}
		}
		.selView-center{
			grid-gap: 30rpx;
			display: grid;
			padding-top: 30rpx;
			.selView-center-item{
				width: 100%;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: #F7F7F7;
				border-radius: 20rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				border: 1px solid none;
			}
			.active{
				background: #FFFBF5 !important;
				border: 1px solid #FF9600;
				color:#FF9600;
			}
		}
	}
	.newPrice{
		font-weight: bold;
		font-size: 36rpx;
		display: inline-block;
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
			width: 100%;
			height: 80rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>