<!-- 出现 -->
<template>
	<view class="travel-box">
		<view class="grid-container">
			<view class="grid-item">
				<image :src="imgUrl + 'tr2-icon1.png'" class="img"></image>
				<text class="item-text">积分商城</text>
			</view>
			<view class="grid-item"  >
				<image :src="imgUrl + 'tr2-icon2.png'" class="img"></image>
				<view class="item-text">景区门票</view>
			</view>
			<view class="grid-item" @click="togoueat" >
				<image :src="imgUrl + 'tr2-icon3.png'" class="img"></image>
				<text class="item-text">餐饮美食</text>
			</view>
			<view class="grid-item" @click="togohotel" >
				<image :src="imgUrl + 'tr2-icon4.png'" class="img"></image>
				<text class="item-text">酒店住宿</text>
			</view>
		</view>
		<view class="flex-container">
			<view class="flex-item">
				<image :src="imgUrl + 'tr2-icon5.png'" class="img"></image>
				<text>客运售票</text>
			</view>
			<view class="flex-item">
				<image :src="imgUrl + 'tr2-icon6.png'" class="img"></image>
				<text>服务区零售</text>
			</view>
			<view class="flex-item" @click="toNav('/pages_B/rentCar/index')">
				<image :src="imgUrl + 'tr2-icon7.png'" class="img"></image>
				<text>租车</text>
			</view>
			<view class="flex-item">
				<image :src="imgUrl + 'tr2-icon8.png'" class="img"></image>
				<text>网约车</text>
			</view>
		</view>
		<view class="title-container">
			<view class="title-text">
				为你精选
			</view>
			<view class="title">
				<text>全部</text>
				<view style="margin-top: 4rpx;"><up-icon name="arrow-right" color="#666666" size="14"></up-icon>
				</view>
			</view>
		</view>
		<view class="container">
			<!-- scroll-view 实现可滑动，设置 scroll-x 开启水平滑动，需给 scroll-view 固定高度或设置为 flex 项让父级分配高度 -->
			<scroll-view class="scroll-view" scroll-x="true" show-scrollbar="false">
				<view class="flex-wrap">
					<view class="flex-item">
						<view class="flex-item-img">
							<view class="classify">住宿</view>
							<image :src="imgUrl + 'hotel-banner.png'" class="img"></image>
							 <view class="flex-text"><text>西安特色舒适酒店</text></view>
							 <view class="flex-money">
								 <view>￥<text  class="money">36.00</text></view>
								 <view style="margin-top: 4rpx;color: #999999;">￥<text class="money-decoration">36.00</text></view>
							 </view>
						</view>
						
					</view>
					<view class="flex-item">
						<view class="flex-item-img">
							<view class="classify">美食</view>
							<image :src="imgUrl + 'lp-banner.png'" class="img"></image>
							 <view class="flex-text"><text>陕西味道特色凉皮</text></view>
							 <view class="flex-money">
								 <view>￥<text  class="money">8.00</text></view>
							 </view>
						</view>
						
					</view>
					<view class="flex-item">
						<view class="flex-item-img">
							<image :src="imgUrl + 'lp-banner.png'" class="img"></image>
							 <view class="flex-text"><text>西安特色舒适酒店</text></view>
							 <view class="flex-money">
								 ￥<text class="money">36.00</text>
							 </view>
						</view>
						
					</view>
				</view>
			</scroll-view>
		</view>
		<up-gap :height="bottomHeight" ></up-gap>
		<!-- 底部服务 -->
		<view class="container-bottom">
			<view class="line-img" :style="{
			  background: 'url(' + imgUrl + 'line.png) no-repeat',
			  'background-size': '100% 100%',
			  'background-position': 'center'
			}">
				<view class="nodes item1" @click="handleCallParent('travel')">
					<view class="node-wenzi">出行</view>
					<view>服务</view>
				</view>
				<view class="node item2" @click="handleCallParent('travel2')">
					<view class="node-wenzi">生活</view>
					<view>服务</view>
				</view>
				<view class="nodes item3" @click="handleCallParent('travel3')">
					<view class="node-wenzi">业务</view>
					<view>办理</view>
				</view>
				<view class="nodes item4" @click="handleCallParent('travel4')">
					<view class="node-wenzi">车辆</view>
					<view>服务</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup lang="ts">
	import {
		ref
	} from 'vue';
	import { toNav } from '@/utils/route';
	import { imgUrl } from '../../config';
	const props = defineProps<{
	  parentMethod: (msg: string) => void;
	  bottomHeight:number|string
	}>();
	const togoueat = () => {
		toNav('/pages_B/dining/index')
	};
	const togohotel = () => {
		toNav('/pages_B/hotel/hotelist')
	};
	// 子组件内部调用父组件方法
	const handleCallParent = (name:string) => {
	  // 调用父组件传递的方法，并传入参数
	  props.parentMethod(name);
	};
</script>
<style scoped lang="scss">
	.travel-box {
		padding: 0 30rpx;
		box-sizing: border-box;
		min-height: 100vh;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/home-bj-z.png')no-repeat;
		background-position: center;
		background-size: 100% 100%;
		overflow: hidden;
	}

	.travel-head {
		width: 100%;
		height: 220rpx;
		margin: 30% 0 30rpx;

		.img {
			width: 100%;
			height: 220rpx;
		}
	}

	.grid-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 30%;
	}

	.grid-item {
		width: 48%;
		height: 150rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		background-color: #fff;
		border-radius: 10rpx;

		.img {
			width: 60rpx;
			height: 60rpx;
			margin: 0 20rpx 0 50rpx;
		}
	}

	.grid-item-three {
		width: 31%;
		/* 一行三个，每个约占31%宽度，留出3%的间距 */
		height: 210rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border-radius: 10rpx;

		.img {
			width: 60rpx;
			height: 60rpx;
			margin-bottom: 20rpx;
		}
	}

	.item-text {
		font-size: 28rpx;
		color: #333;

	}



	.container-bottom {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: -20rpx;
	}

	.node,
	.nodes {
		width: 106rpx;
		height: 106rpx;
		border-radius: 50%;

		font-size: 26rpx;
		text-align: center;
	}

	.node-wenzi {
		margin-top: 20rpx;
	}

	.node {
		color: #fff;
		background: linear-gradient(-40deg, #FF7E00, #FF9600);
		border: 5px solid #FFD5A3;
		;
	}

	.nodes {
		color: #000;
		background: #fff;
		box-shadow: #C9BFC0;
	}

	.line {
		color: #000;
		position: absolute;
		top: 12px;
		height: 2px;
		background-color: #ccc;
	}

	.customer {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 350rpx;
		right: 40rpx;

		.img {
			width: 100%;
			height: 110rpx;
		}
	}

	.line-img {
		width: 100%;
		height: 200rpx;
		position: relative;
		z-index: 9;

	}

	.item1 {
		position: absolute;
		top: 13%;
		left: 8%;
		z-index: 99;
	}

	.item2 {
		position: absolute;
		top: -25%;
		left: 31%;
		z-index: 99;
	}

	.item3 {
		position: absolute;
		top: -25%;
		left: 54%;
		z-index: 99;
	}

	.item4 {
		position: absolute;
		top: 15%;
		left: 76%;
		z-index: 99;
	}

	/* 容器样式，设置为弹性布局 */
	.flex-container {
		display: flex;
		/* 让子元素在水平方向均匀分布，可根据需求调整，如 space-between、center 等 */
		justify-content: space-around;
		/* 让子元素在垂直方向居中对齐，可按需调整 */
		align-items: center;
		/* 可选，设置容器宽度，比如占满父容器 */
		width: 100%;
		/* 可选，给容器加些内边距，让内容不贴着边缘 */
		padding: 10px 0;
		background: #FFFFFF;
	}

	/* 子项样式 */
	.flex-item {
		/* 让子项内部也用弹性布局，实现图标和文字垂直排列居中 */
		display: flex;
		flex-direction: column;
		/* 图标和文字上下排列 */
		align-items: center;
		/* 水平居中 */
		font-size: 28rpx;
		color: #000;
	}

	/* 图标样式，根据实际图标大小调整宽高 */
	.flex-item .img {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 5px;
		/* 图标和文字之间的间距 */
	}
	.title-container{
		display: flex;
		justify-content: space-between;
		margin: 30rpx 0;
	}
	.title-text{
		font-weight: 800;
		font-size: 40rpx;
		color: #000000;
	}
	.title{
	   display: flex;	
	   font-size: 26rpx;
	   margin-top: 15rpx;
	   font-weight: bold;
	}
	.flex-wrap {
	  /* flex 布局，水平排列 */
	  display: flex;
	  flex-direction: row; 
	  align-items: center;
	  .flex-item {
	    width: 310rpx;
		height: 400rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    margin-right: 30rpx;
	    flex-shrink: 0; 
	  }
	}
	.flex-item-img{
	width: 310rpx;
	height: 260rpx;
	border-radius: 10rpx 10rpx 0rpx 0rpx;
	position: relative;
	.img{
		width: 100%;
		height: 260rpx;
	 }
	}
	.flex-text{
		text-align: center;
		font-weight: bold;
		font-size: 30rpx;
		color: #030812;
		margin-top: 10rpx;
	}
	.flex-money{
		display: flex;
		color: #FF9600;
		margin: 10rpx 30rpx;
	}
	.money{
		font-size: 34rpx;
		margin-right: 5px;

	}
	.money-decoration{
		font-size: 28rpx;
		text-decoration: line-through;
	}
	.classify{
		width: 70rpx;
		height: 36rpx;
		background:rgba(0, 0, 0, .2);
		border-radius: 18rpx;
		position: absolute;
		top:20rpx;
		left:20rpx;
		line-height: 36rpx;
		text-align: center;
		font-size: 22rpx;
		color: #FFFFFF;
	}
</style>