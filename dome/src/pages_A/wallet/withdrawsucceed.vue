<template>
	<view class="container" :data-theme="pageTheme">
		<view class="tab-con">
			<u-sticky bgColor="transparent" z-index="99999">
				<up-navbar title="提现成功" :bgColor="backgroundColor" @leftClick="goBack" placeholder
					:fixed="false"></up-navbar>
			</u-sticky>
		</view>
	
		<view class="withdraw-success-page">
		    <!-- 主体内容 -->
		    <view class="content">
		    <view class="content-box">
				<!-- 成功图标 -->
				<image class="success-icon" :src="imgUrl+'static/succeed_1.png'" mode="aspectFit" />
				<!-- 标题 -->
				<view class="success-text">提现成功</view>
			</view>
		
		      <!-- 详细信息 -->
		      <view class="info-list">
		        <view class="info-item">
		          <text class="label">提现金额</text>
		          <text class="value">¥{{ balance }}</text>
		        </view>
		        <view class="info-item">
		          <text class="label">提现时间</text>
		          <text class="value">{{ time }}</text>
		        </view>
		        <view class="info-item">
		          <text class="label">提现渠道</text>
		          <text class="value">微信</text>
		        </view>
		      </view>
		
		      <!-- 提示框 -->
		      <view class="tip-box">
				<up-icon name="info-circle" size="16"></up-icon>
		        <text class="tip-text">若姓名校验不成功，则提现无法到账，请修改为真实姓名后再次操作</text>
		      </view>
		    </view>
		
		    <!-- 返回按钮 -->
		    <view class="return-btn" @click="goBack">返回</view>
		  </view>
		</view>

</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { onLoad, onShow, onPageScroll, onHide } from '@dcloudio/uni-app';
	import { debounce } from '@/utils/common'
	import { imgUrl } from '../../config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import moment from "moment";
	import { toNav, toBack } from '@/utils/route';
	import { useTheme } from "@/composables/useTheme";
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const balance=ref('')
	const time=ref(moment(new Date()).format("YYYY-MM-DD"))
	const backgroundColor = ref<string>('transparent');
	const goBack=()=>{
		uni.navigateBack({
		delta: 2,
		});
	}
	onLoad((options: any)=>{
		if(options.money){
			balance.value=options.money
		}
		
	})
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}
	.tab-con {
		width: 100%;
		box-sizing: border-box;
		background: var(--head-color)
	}
	
	.withdraw-success-page {
	  min-height: 100vh;
	  padding: 0 20rpx;
	  box-sizing: border-box;
	}
	
	.header {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  height: 80rpx;
	  font-size: 36rpx;
	  color: #333;
	  margin-bottom: 100rpx;
	}
	
	.success-icon {
	  width: 120rpx;
	  height: 120rpx;
	  margin: 80rpx auto 40rpx;
	}
	
	.success-text {
	  font-size: 40rpx;
	  color: #333;
	  text-align: center;
	  margin-bottom: 60rpx;
	}
	
	.info-list {
	  margin-bottom: 40rpx;
	  .info-item {
	    display: flex;
	    justify-content: space-between;
	    font-size: 28rpx;
	    color: #333;
	    margin-bottom: 20rpx;
		padding: 0 30rpx;
	    .label {
	      color: #666;
	    }
	    .value {
	      color: #333;
	    }
	  }
	}
	
	.tip-box {
	  background-color: #FFEEEE;
	  border-radius: 16rpx;
	  padding: 20rpx 30rpx;
	  margin-bottom: 100rpx;
	  display: flex;
	  align-items: flex-start;
	  gap: 10rpx;
	  font-size: 24rpx;
	  color: #666;
	  .tip-icon {
	    font-size: 28rpx;
	  }
	}
	
	.return-btn {
	  width: 622rpx;
	  height: 96rpx;
	  text-align:center;
	  line-height: 96rpx;
	  background: var(--but-color-line);
	  color: white;
	  border-radius: 48rpx;
	  font-size: 32rpx;
	  margin: 0 auto;
	
	}
	.content-box{
		text-align: center;
	}
</style>