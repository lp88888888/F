<template>
	<view class="rule-page">
		<!-- 头部：标题+卡通形象 -->
		<view class="header">
			<u-navbar title="活动规则" left-icon="arrow-left" :border-bottom="false" bg-color="none"
				:title-style="{color: '#333', fontSize: '18px', fontWeight: '500'}" :left-icon-style="{color: '#333'}"
				@left-click="leftClickFun"></u-navbar>
		</view>
      <view style="padding: 0 20rpx;box-sizing: border-box;margin-top: -70rpx;z-index: 99;">
		  <!-- 征集规则板块 -->
		  <view class="rule-section">
		  	<view class="section-title">征集规则</view>
		  	<view class="section-content">
		  		<view class="item">
		  			<view style="display: flex;">
		  				<view class="number-badge">
							<image :src="imgUrl+'static/zj-icon1.png'" class="icon1"></image>
						</view>
		  				<view class="item-title">作品要求：</view>
		  			</view>
		  			<view class="item-desc">
		  				<rich-text :nodes="objdata.workRequire"></rich-text>
		  			</view>
		  		</view>
		  
		  		<view class="item">
		  			<view style="display: flex;">
		  				<view class="number-badge">
		  					<image :src="imgUrl+'static/zj-icon2.png'" class="icon1"></image>
		  				</view>
		  				<view class="item-title">提交限制：</view>
		  			</view>
		  			<view class="item-desc">
		  				<rich-text :nodes="objdata.commitLimit"></rich-text>
		  			</view>
		  		</view>
		  
		  		<view class="item">
					<view style="display: flex;">
						<view class="number-badge">
							<image :src="imgUrl+'static/zj-icon3.png'" class="icon1"></image>
						</view>
						<view class="item-title">审核标准：</view>
					</view>
		  			<view class="item-desc">
		  				<rich-text :nodes="objdata.auditStandard"></rich-text>
		  			</view>
		  		</view>
		  	</view>
		  </view>
		  
		  <!-- 投票规则板块 -->
		  <view class="rule-section">
		  	<view class="section-title">投票规则</view>
		  	<view class="section-content">
		  		<view class="item-desc">
		  			<rich-text :nodes="objdata.voteRule"></rich-text>
		  		</view>
		  	</view>
		  </view>
		  
		  <!-- 奖励说明板块 -->
		  <view class="rule-section">
		  	<view class="section-title">奖励说明</view>
		  	<view class="section-content">
		  		<view class="item-desc">
					<view style="display: flex;">
						<image :src="imgUrl+'static/zj-icon4.png'" class="icon1"></image>
						<rich-text :nodes="objdata.awardFirst"></rich-text>
					</view>
		  			<view  style="display: flex;">
						<image :src="imgUrl+'static/zj-icon5.png'" class="icon1"></image>
						<rich-text :nodes="objdata.awardSecond"></rich-text>
					</view>
		  			<view  style="display: flex;">
					    <image :src="imgUrl+'static/zj-icon6.png'" class="icon1"></image>
						<rich-text :nodes="objdata.awardThird"></rich-text>
					</view>
		  			<rich-text :nodes="objdata.awardOther"></rich-text>
		  		</view>
		  	</view>
		  </view>
		  
		  <!-- 授权声明板块 -->
		  <view class="rule-section">
		  	<view class="section-title">授权声明</view>
		  	<view class="section-content">
		  		<view class="item-desc">
		  			<rich-text :nodes="objdata.authStatement"></rich-text>
		  		</view>
		  	</view>
		  </view>
		  
		  <!-- 其他规则板块 -->
		  <view class="rule-section">
		  	<view class="section-title">其他规则</view>
		  	<view class="section-content">
		  		<view class="item-desc">
		  			<rich-text :nodes="objdata.otherRule"></rich-text>
		  		</view>
		  	</view>
		  </view>
		  <view style="height: 50rpx;"></view>
	  </view>
		
	</view>
</template>
<script setup lang="ts">
	import { ref, onMounted, onUnmounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { config } from '@/api/voting';
	const objdata=ref('')
	//查询投票活动配置
	const configFun = async () => {
		const res = await config();
		if (res.code == 200) {
			objdata.value = res.data;
			// 配置加载完成后开始倒计时
		}
	};
	const leftClickFun = () => {
		 uni.navigateBack({
		        delta: 1 // 返回的页面数，默认是1
		      })
	}
	onLoad(() => {
		configFun();
	});
</script>
<style scoped>
	/* 页面整体背景 */
	.rule-page {
		background-color: #d4f1c5;
		min-height: 100vh;
	}

	/* 头部区域 */
	.header {
		width: 100%;
		height: 500rpx;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/gz-bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		margin-bottom: 20rpx;
		padding-top: 10rpx;
		z-index: 1;
	}
    .icon1{
		width: 40rpx;
		height: 40rpx;
        margin: 2rpx 0 0 6rpx;
	}
	.main-title {
		font-size: 60rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin: 20rpx 0;
	}

	.cartoon-img {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		width: 150rpx;
		height: auto;
	}

	.cartoon-text {
		position: absolute;
		top: 10rpx;
		right: 180rpx;
		font-size: 24rpx;
		color: #666;
	}

	/* 规则板块通用样式 */
	.rule-section {
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.section-title {
		background: linear-gradient(270deg, #80A653 0%, #ABD17D 100%);
		color: #fff;
		font-size: 30rpx;
		padding: 15rpx 20rpx;
		width:184rpx;
		border-radius: 24rpx 24rpx 0rpx 24rpx;
		text-align: center;
    	margin: 32rpx;
	}

	.section-content {
		padding:0 20rpx 20rpx;
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
	}

	/* 板块内内容样式 */
	.item {
		margin-bottom: 15rpx;
	}

	.item-title {
		margin-bottom: 10rpx;
		font-size: 30rpx;
		font-weight: bold;
	}

	.item-desc text {
		display: block;
		margin-bottom: 10rpx;
	}
	.number-badge{
		  width: 32px;
		  height: 32px;
	}
	.store-image{
		width:100%;
	}
	::v-deep .u-navbar__content{
		background: none !important;
	}
	::v-deep .u-navbar--fixed{
		position: inherit !important;
	}
</style>