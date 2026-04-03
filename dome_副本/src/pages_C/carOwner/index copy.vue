<template>
  <view class="page-container" :data-theme="pageTheme">
    <view class="banner-header">
      <image 
        class="banner-img" 
        :src="imgUrl+'del/car-back1.png'"
        mode="aspectFill"
      />
    </view>

    <view class="checkin-wrapper">
      <view class="checkin-card">
        <view class="left-content">
          <image class="gift-icon" src="https://api.iconify.design/fluent-emoji-flat:wrapped-gift.svg" mode="aspectFit" />
          <view class="text-info">
            <text class="title">打卡有礼</text>
            <text class="subtitle">参与打卡 · 奖励积分好礼</text>
          </view>
        </view>
        <view class="btn-checkin">去打卡</view>
      </view>
    </view>

    <view class="section-container">
      <view class="section-header study-header">
        <view class="title-box">
          <image class="header-icon" src="https://api.iconify.design/mdi:graduation-cap.svg?color=%23ffffff" mode="aspectFit" />
          <text class="title-text">趣研学</text>
        </view>
        <view class="more-link">更多 <text class="arrow">></text></view>
      </view>

      <view class="activity-card">
        <view class="img-wrapper">
          <image 
            class="activity-img" 
            :src="imgUrl+'del/car-back1.png'"
            mode="aspectFill" 
          />
        </view>
        <view class="card-content">
          <view class="card-title">千年米仓道，早晚恩阳河-恩阳船说、特色银耳宴</view>
          
          <view class="tags-and-distance">
            <view class="tags">
              <text class="tag">恩阳古镇</text>
              <text class="tag">古镇茶乡</text>
              <text class="tag">梯壁栈道惊险刺激</text>
            </view>
            <text class="distance">5.6km</text>
          </view>
          
          <view class="card-bottom">
            <view class="location">
              <text class="icon-loc">📍</text>
              <text class="loc-text line-clamp-1">陕西省汉中市洋县洋州街道洋县服务...</text>
            </view>
            <view class="btn-enroll">立即报名</view>
          </view>
          
          <view class="dots">
            <view class="dot active"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="section-container">
      <view class="section-header travel-header">
        <view class="title-box-simple">
          <view class="vertical-line"></view>
          <text class="title-text-dark">趣旅行</text>
        </view>
        <view class="more-link dark">更多 <text class="arrow">></text></view>
      </view>

      <view class="activity-card">
        <view class="img-wrapper">
          <image 
            class="activity-img" 
            :src="imgUrl+'del/car-back1.png'"
            mode="aspectFill" 
          />
        </view>
        <view class="card-content">
          <view class="card-title">千年米仓道，早晚恩阳河-恩阳船说、特色银耳宴</view>
          
          <view class="tags-and-distance">
            <view class="tags">
              <text class="tag">恩阳古镇</text>
              <text class="tag">古镇茶乡</text>
              <text class="tag">梯壁栈道惊险刺激</text>
            </view>
            <text class="distance">5.6km</text>
          </view>
          
          <view class="card-bottom">
            <view class="location">
              <text class="icon-loc">📍</text>
              <text class="loc-text line-clamp-1">陕西省汉中市洋县洋州街道洋县服务...</text>
            </view>
            <view class="btn-enroll">立即报名</view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="safe-bottom"></view>
  </view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const dataList = ref([])
</script>

<style lang="scss" scoped>
.page-container {
  width: 750rpx;
  min-height: 100vh;
  background: linear-gradient(117deg, #EBF8EE 0%, #FEFEFE 100%);
}

/* 1. Banner */
.banner-header {
  width: 100%;
  height: 658rpx;
  position: relative;
  
  .banner-img {
    width: 100%;
    height: 100%;
	border-radius: 0rpx 0rpx 32rpx 32rpx;
  }
}

/* 2. 打卡悬浮卡片 */
.checkin-wrapper {
	// width: 721rpx;
	// height: 159rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
  margin-top: -60rpx; /* 负边距实现向上悬浮覆盖 */
  position: relative;
  z-index: 10;
}

.checkin-card {
	width: 100%;
	height: 160rpx;
  background: linear-gradient(to right, #ffffff, #EAF8F1);
  border-radius: 40rpx;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);

  .left-content {
    display: flex;
    align-items: center;
    
    .gift-icon {
      width: 80rpx;
      height: 80rpx;
      margin-right: 20rpx;
    }

    .text-info {
      display: flex;
      flex-direction: column;

      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 6rpx;
      }
      .subtitle {
        font-size: 22rpx;
        color: #666;
      }
    }
  }

  .btn-checkin {
    color: #fff;
    font-size: 28rpx;
    font-weight: 500;
	
	width: 108rpx;
	height: 108rpx;
	line-height: 108rpx;
	text-align: center;
	background: linear-gradient( 180deg, #82D070 0%, #65D486 100%);
	box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(208,208,208,0.5), inset 0rpx 22rpx 15rpx 0rpx rgba(0,0,0,0.05), inset 0rpx -2rpx 10rpx 0rpx #FFFFFF;
	border: 2rpx solid rgba(253,253,253,0.8);
	border-radius: 50%;
	box-sizing: border-box;
  }
}

/* 3. 列表区域通用 */
.section-container {
  padding: 0 30rpx;
  margin-top: 40rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  .more-link {
    font-size: 24rpx;
    color: #999;
    display: flex;
    align-items: center;
    .arrow { margin-left: 4rpx; }
    
    &.dark { color: #666; }
  }
}

/* 趣研学 Header 样式 */
.study-header {
  .title-box {
    background-color: #84D07D;
    padding: 8rpx 24rpx 8rpx 16rpx;
    border-radius: 8rpx 24rpx 0 8rpx;
    display: flex;
    align-items: center;
    
    .header-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 8rpx;
    }
    
    .title-text {
      color: #fff;
      font-size: 28rpx;
      font-weight: bold;
    }
  }
}

/* 趣旅行 Header 样式 */
.travel-header {
  .title-box-simple {
    display: flex;
    align-items: center;
    
    .vertical-line {
      width: 8rpx;
      height: 32rpx;
      background-color: #84D07D;
      border-radius: 4rpx;
      margin-right: 12rpx;
    }
    
    .title-text-dark {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
}

/* 卡片样式 */
.activity-card {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 15rpx rgba(0,0,0,0.03);

  .img-wrapper {
    width: 100%;
    height: 300rpx;
    
    .activity-img {
      width: 100%;
      height: 100%;
    }
  }

  .card-content {
    padding: 24rpx;
    
    .card-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      line-height: 1.4;
      margin-bottom: 16rpx;
    }

    .tags-and-distance {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24rpx;

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;

        .tag {
          font-size: 20rpx;
          color: #84D07D;
          border: 1rpx solid #84D07D;
          padding: 4rpx 12rpx;
          border-radius: 6rpx;
        }
      }

      .distance {
        font-size: 22rpx;
        color: #999;
        white-space: nowrap;
        margin-left: 10rpx;
      }
    }

    .card-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .location {
        display: flex;
        align-items: center;
        flex: 1;
        margin-right: 20rpx;
        overflow: hidden;

        .icon-loc {
          font-size: 24rpx;
          margin-right: 8rpx;
          color: #999;
        }

        .loc-text {
          font-size: 22rpx;
          color: #999;
        }
      }

      .btn-enroll {
        background: linear-gradient(to right, #FF9B44, #FF7B22);
        color: #fff;
        font-size: 26rpx;
        padding: 12rpx 32rpx;
        border-radius: 30rpx;
        font-weight: 500;
        white-space: nowrap;
      }
    }

    .dots {
      display: flex;
      justify-content: center;
      margin-top: 20rpx;
      gap: 8rpx;

      .dot {
        width: 8rpx;
        height: 8rpx;
        background-color: #E0E0E0;
        border-radius: 50%;
        
        &.active {
          width: 24rpx;
          background-color: #84D07D;
          border-radius: 4rpx;
        }
      }
    }
  }
}

/* 实用工具类 */
.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.safe-bottom {
  height: 60rpx;
}
</style>