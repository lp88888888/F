
<template>
	<view class="contant" :data-theme="pageTheme" >
		
  <!-- 状态栏占位 -->
  <u-sticky bgColor="transparent" z-index="99999">
  	<view class="searchView">
  		<up-navbar :title="type === 'change' ? '换开发票成功' : '关联发票抬头'" bgColor="transparent" @leftClick="goBack" placeholder
  			:fixed="true"></up-navbar>
  	</view>
  </u-sticky>
  <!-- <up-navbar :title="type === 'change' ? '换开发票成功' : '关联发票抬头'" bgColor="none" @leftClick="goBack" placeholder :fixed="false"></up-navbar> -->
  <!-- 成功页面内容 -->
  <block v-if="type === 'change'">
    <view class="success-view">
      <image :src="imgUrl + 'bindetc-success-icon.png'" />
      <view>提交开票成功</view>
      <view>
        开具申请已经受理，可进入
        <text @tap="goMyInvoice">【我的发票】</text>
        查看。
      </view>
      <view @tap="goHome">回首页</view>
    </view>
  </block>

  <block v-else>
    <view class="success-view">
      <image :src="imgUrl + 'bindetc-success-icon.png'" />
      <view>恭喜您，关联发票抬头成功</view>
      <view></view>
      <view @tap="goMake">去开票</view>
      <view @tap="goHome">回首页</view>
    </view>
  </block>
  </view>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';

import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
const type = ref<string>('')
// 响应式数据
const etcUser = ref<any>({})


// 页面加载
onLoad((opticon) => {
  type.value = opticon.type
  etcUser.value = uni.getStorageSync('etcUser')
})

// 事件处理函数
const goBack = () => {
  uni
}

const goMake = () => {
  uni.reLaunch({
    // url: '/pages_A/invoice/index?to=make',
    url: '/pages_A/etcInvoice/etcCards?type=my',
	
  })
}

const goMyInvoice = () => {
  // uni.navigateBack({
  //   delta: 2
  // })
  let successData = uni.getStorageSync('successData')
  uni.navigateTo({
    url: `/pages/invoice/index?id=${successData.cardId}&car=${successData.carNum}&cardtype=${successData.cardType}`
  })
}

const goHome = () => {
 uni.reLaunch({ url: '/pages/home/home' })
}
</script>



<style lang="scss">
	.contant{
		width: 100vw;
		background: var(--head-color);
	}
// page {
//   background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/invoice-bg.png') no-repeat, #f0f0f2;
//   background-size: 100% 412rpx;
//   padding-bottom: 30rpx;
// }
.success-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 140rpx;

  > image:nth-child(1) {
    width: 140rpx;
    height: 174rpx;
    margin-bottom: 24rpx;
  }

  > view:nth-child(2) {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 40rpx;
  }

  > view:nth-child(3) {
    width: 674rpx;
    font-size: 24rpx;
    color: #666666;
    line-height: 44rpx;
    margin-bottom: 40rpx;
    text-align: center;
  }

  > view:nth-child(3) text {
    font-size: 24rpx;
    color: #333333;
  }

  > view:nth-child(4),
  > view:nth-child(5) {
    width: 703rpx;
    height: 80rpx;
    border-radius: 10rpx;
    font-size: 32rpx;
    line-height: 80rpx;
    text-align: center;
    margin-bottom: 32rpx;
  }

  > view:nth-child(4) {
    background-color: var(--primary-color);
    color: #ffffff;
  }

  > view:nth-child(5) {
    background-color: #e1e1e1;
    color: #666;
  }
}

.fixed-view {
  position: fixed;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 999;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
}

.head-palce {
  /* 占位符 */
}

::v-deep .u-navbar__content{
		background: none !important;
	}
</style>