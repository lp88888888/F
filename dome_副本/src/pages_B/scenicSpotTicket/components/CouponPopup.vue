<!-- 优惠券选择 -->
<template>
	<up-popup :show="show" @close="close" round="8">
		<view class="copBox">
			<view class="paddBox fl-ce-sb">
				<up-icon name="close" size="20" color="#3D3D3D" @click="close"></up-icon>
				<view class="nameText">选择优惠券</view>
				<view class="subBox" @click="submit">使用</view>
			</view>
			<view class="tabs" style="padding-top: 10rpx;padding-bottom: 32rpx;">
				<view :class="['tabs-item', tabsId == item.id?'tabsActive':'']" v-for="(item,index) in tabsList" :key="index" @click.stop="tabsChane(item)">
					<view class="tabs-item-text">{{item.name}}</view>
					<view class="tabs-item-line"></view>
				</view>
			</view>
			
			<scroll-view :scroll-y="true" class="scroll-Y" >
				<view v-for="(item,index) in dataList" :key="index">
					<view class="fl-ce-sb copItem" :style="{opacity:tabsId == 1?1:.6}" @click="copClick(item)">
						<view class="copIcon">
							<view class="copIcon-item">
								<text class="copIcon-item-num">{{item.discount}}</text>
								<text class="copIcon-item-ut">折</text>
							</view>
							<up-gap height="10"></up-gap>
							<view class="copIcon-text">满意一张可用</view>
						</view>
						<view class="copCen fl-ce-sb">
							<view>
								<view class="copCen-name texNoWrap">{{item.name}}</view>
								<up-gap height="14"></up-gap>
								<view class="copCen-text texNoWrap">有效期至2025-4-26 23:59:59</view>
							</view>
							<up-icon :name="`${imgUrl}${copId == item.id?'bindetc-truth':'static/B-scen-coup-false'}.png`" size="24" @click="toBack"></up-icon>
						</view>
					</view>
					<up-gap height="12"></up-gap>
				</view>
				<up-gap height="20"></up-gap>
			</scroll-view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import {  guid } from '@/uni_modules/uview-plus';
	const show = ref(false);
	
	const tabsId = ref(1);
	const tabsList = ref([
		{name:'可用',id:1},
		{name:'不可用',id:2},
		{name:'已失效',id:3},
	])
	const copId = ref('')
	const dataList = ref([
		{name:'优惠券',discount:9,id:guid()},
		{name:'优惠券',discount:8,id:guid()},
		{name:'优惠券',discount:7,id:guid()},
		{name:'优惠券',discount:6,id:guid()},
		{name:'优惠券',discount:5,id:guid()}
	])
	const close = ()=>{
		show.value = false;
	}
	const open = ()=>{
		show.value = true;
	}
	const tabsChane = (item)=>{
		tabsId.value = item.id
	}
	
	const copClick = (item) =>{
		// 不是可用状态禁止选中
		if(tabsId.value != 1) return
		copId.value = item.id
	}
	const submit= ()=>{
		
		
		close()
	}
	defineExpose({
		open
	})
</script>

<style lang="scss" scoped>
	@import url('../style.scss');
	.scroll-Y{
		width: 100%;
		max-height: 40vh;
		padding: 0 40rpx ;
		box-sizing: border-box;
	}
	.copItem{
		width: 100%;
		height: 192rpx;
		background: #F6F1E4;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
	}
	.copIcon{
		width: 192rpx;
		height: 192rpx;
		background: linear-gradient( 180deg, #FFB038 0%, #EA8100 100%);
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		color: #FFFFFF;
		display: flex;flex-direction: column;
		justify-content: center;
		align-items: center;
		.copIcon-text{
			font-weight: 400;
			font-size: 24rpx;
			color: rgba(255,255,255,0.9);
			line-height: 24rpx;
		}
	}
	.copIcon-item{
		display: flex;
		align-items: flex-end;
	}
	.copIcon-item-num{
		font-weight: 700;
		font-size: 72rpx;
		color: #FFFFFF;
		line-height: 72rpx;
	}
	.copIcon-item-ut{
		font-weight: 700;
		font-size: 40rpx;
		color: rgba(255,255,255,0.8);
		line-height: 50rpx;
		margin-left: 10rpx;
	}
	
	.copCen{
		width: calc(100% - 192rpx);
		height: 192rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
	}
	.copCen-name{
		font-weight: 700;
		font-size: 32rpx;
		color: #764B00;
		line-height: 32rpx;
	}
	.copCen-text{
		font-weight: 400;
		font-size: 24rpx;
		color: #BC915C;
		line-height: 24rpx;
	}
</style>