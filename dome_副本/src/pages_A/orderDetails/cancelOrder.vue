<!-- 抵用券 -->
<template>
	<cos-header title="订单详情" :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
		:defaultNavBarheight="90"></cos-header>
	<view class="merchant-bg">
		<!-- 顶部状态栏区域 -->
		<view class="status-bar">
			<text class="status-text">已取消</text>
		</view>

		<!-- 商家信息区域 -->
		<view class="merchant-info">
			<view class="merchant-img">
				<image src="/static/merchant.png" />
			</view>
			<view class="merchant-desc">
				<text class="merchant-name">朋乐乐购</text>
				<view class="merchant-location">
					<up-icon name="map" color="#000000" size="14"></up-icon>秦岭服务区北区秦岭服秦岭服
				</view>
			</view>
			<!-- <view class="merchant-icons">
				<image src="../../static/etc.png" class="icon" />
				<image src="../../static/etc.png" class="icon" />
			</view> -->
		</view>
			<view class="service-bar">
				<!-- 在线客服 -->
				<view class="service-item">
				  <image :src="imgUrl + 'etc.png'" class="icon" />
				  <text class="text">在线客服</text>
				</view>
				<!-- 联系商家 -->
				<view class="service-item">
				  <image :src="imgUrl + 'etc.png'" class="icon" />
				  <text class="text">联系商家</text>
				</view>
				<!-- 地图导航 -->
				<view class="service-item no-border">
				  <image :src="imgUrl + 'etc.png'" class="icon" />
				  <text class="text">地图导航</text>
				</view>
			  </view>
		<!-- 商品信息区域 -->
		<view class="goods-info">
			<text class="goods-title">商品信息</text>
			<view class="goods-item">
				<view class="goods-img">
					<image src="/static/coupon.png" />
				</view>
				<view class="goods-desc">
					<text class="goods-name">小型客车普洗优惠商品抵用券</text>
					<text class="goods-points">106 积分</text>
				</view>
				<text class="goods-count">×1</text>
			</view>
			<text class="total-points"><text style="color:#333333;">总计：</text>106 积分</text>
		</view>

		<!-- 订单信息区域 -->
		<view class="order-info">
			<text class="order-title">订单信息</text>
			<view class="order-item">
				<text class="order-label">订单编号</text>
				<text class="order-value">JD20250328153154<text class="copy-btn">复制</text></text>

			</view>
			<view class="order-item">
				<text class="order-label">下单时间</text>
				<text class="order-value">2025-03-27 10:30:28</text>
			</view>
			<view class="order-item">
				<text class="order-label">支付时间</text>
				<text class="order-value">2025-03-27 10:31:00</text>
			</view>
			<view class="order-item">
				<text class="order-label">取消时间</text>
				<text class="order-value">2025-03-27 10:31:00</text>
			</view>
		</view>

		<!-- 底部操作栏区域 -->
		<view class="bottom-bar">
			<view class="bottom-box">
				<view class="service-btn">
				<image :src="imgUrl + 'etc.png'" class="icon" />
				<view>
					在线客服
				</view>	
				</view>
				<view class="operation">
					<view class="evaluate-btn">&emsp;评价&emsp;</view>
					<view class="cancel-btn">取消订单</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref } from 'vue';
	
		import { imgUrl } from '../../config';
	// 引入组件，这里假设 CosHeader 组件的类型后续补充，先简单断言
	import CosHeader from '@/components/customNavBar/index.vue';
	interface CosHeaderProps {
		title : string;
		backgroundColor : string;
		fontColor : string;
		fixed : boolean;
		defaultNavBarheight : number;
	}
	// 响应式变量
	const backgroundColor = ref<string>('#FFFFFF');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
</script>
<style scoped lang="scss">
	/* 顶部状态栏样式 */
	.status-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 200rpx 0 30rpx 0;
		padding: 0 20rpx;
	}

	.merchant-bg {
		height: 90vh;
		background: $bgTopColor;
		overflow: hidden;
		padding: 0 30rpx;
		box-sizing: border-box;

	}

	.status-text {
		font-size: 18px;
		font-weight: bold;
	}

	.navigate-text {
		display: flex;
		font-size: 24rpx;
		color: #333333;
	}

	.card-text {
		display: flex;
		justify-content: center;
		align-self: center;
		color: $color;
	}

	.card-jt {
		padding-top: 6rpx;
	}

	/* 商家信息样式 */
	.merchant-info {
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 8px;
		margin: 20rpx 0;
		padding: 20rpx 30rpx;
	}

	.merchant-img {
		width: 60px;
		height: 60px;
		background: salmon;
		border-radius: 4px;
	}

	.merchant-desc {
		flex: 1;
		margin: 0 10px;
	}

	.merchant-name {
		font-size: 26rpx;
		font-weight: bold;
		margin-bottom: 5px;
		display: block;
	}

	.merchant-location {
		display: flex;
		gap: 2px;
		font-size: 24rpx;
		color: #999;
	}

	.merchant-icons {
		display: flex;
		gap: 16px;
		margin-right: 30rpx;
	}

	.icon {
		width: 20px;
		height: 20px;
	}

	/* 商品信息样式 */
	.goods-info {
		padding: 0 30rpx;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 8px;
	}

	.goods-title {
		font-size: 26rpx;
		font-weight: bold;
		display: block;
		padding: 20rpx 0;
	}

	.goods-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 15px;
		position: relative;
	}

	.goods-img {
		width: 150rpx;
		height: 150rpx;
		background: sandybrown;
		border-radius: 4px;
	}

	.goods-desc {
		display: flex;
	}

	.goods-name {
		width: 300rpx;
		font-size: 14px;
		display: block;
		margin-bottom: 5px;
		margin-right: 45rpx;
	}

	.goods-points {
		font-size: 26rpx;
		color: $color;
	}

	.goods-count {
		font-size: 24rpx;
		color: #999;
		position: absolute;
		right: 0;
		bottom: 10rpx;
	}

	.total-points {
		border-top: 1px solid #EEEEEE;
		font-size: 24rpx;
		color: $color;
		text-align: right;
		display: block;
		padding: 20rpx 0;

	}

	/* 订单信息样式 */
	.order-info {
		padding: 0 30rpx;
		background-color: #fff;
		border-radius: 8px;
		margin-top: 20rpx;
	}

	.order-title {
		font-size: 26rpx;
		font-weight: bold;
		padding: 20rpx 0;
		display: block;
	}

	.order-item {
		display: flex;
		padding: 20rpx 0;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #eee;
	}

	.order-item:last-child {
		border-bottom: none;
	}

	.order-label {
		font-size: 14px;
		color: #999;
	}

	.order-value {
		font-size: 14px;
	}

	.copy-btn {
		font-size: 24rpx;
		color: #666666;
		padding: 5rpx 10rpx;
		border: 1px solid #CCCCCC;
		margin: 0 10rpx;
		border-radius: 16rpx;
	}

	/* 底部操作栏样式 */
	.bottom-bar {
		width: 100%;
		background-color: #fff;
		border-top: 1px solid #eee;
		position: fixed;
		bottom: 0;
		left: 0;
	}
  .bottom-box{
	  width: 90%;
	  margin: 20rpx auto 50rpx;
	  display: flex;
	  justify-content: space-between;
  }
	.operation {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 30rpx;
	}

	.service-btn {
		color: #333;
		margin-left: 10rpx;
		.icon{
			width: 30rpx;
			height: 30rpx;
			margin-left: 40rpx;
		}
	}

	.evaluate-btn {
		padding: 15rpx 20rpx;
		border: 1px solid $color;
		color: $color;
		border-radius: 44rpx;
	}

	.cancel-btn {
		padding: 15rpx 20rpx;
		border: 1px solid #CCCCCC;
		color: #333;
		border-radius: 44rpx;
	}
	.service-bar {
	  display: flex; /* Flex 横向布局 */
	  padding: 10px;
	  background-color: #fff;
	  margin-bottom: 20rpx;
	  border-radius: 8px;
	}
	
	.service-item {
	  flex: 1; /* 三个模块均分宽度 */
	  display: flex;
	  align-items: center; /* 图标和文字垂直居中 */
	  justify-content: center; /* 水平居中 */
	  border-right: 1px solid #eee; /* 竖线分隔 */
	  .icon{
		  margin-right: 15rpx;
	  }
	}
	
	/* 最后一个模块去掉右边框 */
	.no-border {
	  border-right: none;
	}
	
	.iconfont {
	  font-size: 24px; /* 图标大小 */
	  margin-right: 5px; /* 图标与文字间距 */
	}
	
	.text {
	  font-size: 14px; /* 文字大小 */
	}
</style>