<template>
  <view class="container" :data-theme="pageTheme">
	<up-navbar title="邀请赚积分" bgColor="transparent" @leftClick="toBack" :placeholder="true" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
    <!-- 选项卡切换 -->
    <view class="tabs-container">
      <view class="tabs">
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 0 }" 
          @click="activeTab = 0"
        >邀请海报</view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 1 }" 
          @click="activeTab = 1"
        >我的邀请</view>
      </view>
    </view>

    <view class="stats-card">
      <view class="stats-item">
        <text class="stats-value">120</text>
        <text class="stats-label">今日邀请</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">120</text>
        <text class="stats-label">累计邀请</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">120</text>
        <text class="stats-label">获取积分</text>
      </view>
    </view>
	<view style="padding: 0 30rpx;box-sizing: border-box;">
		<view class="list-header">
		  <text class="header-text">用户</text>
		  <text class="header-text">有效行程</text>
		</view>
		<view class="list-content">
		  <view v-for="(item, index) in inviteList" :key="index" :class="['list-item', index % 2 === 1 ? 'bg-grey' : '']">
		    <view class="user-info">
		      <image :src="item.avatar" class="avatar"></image>
		      <text class="user-name">{{ item.name }}</text>
		    </view>
		    <text class="mileage">{{ item.km }}km</text>
		  </view>
		</view>
	</view>
    

    
  </view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const activeTab = ref(1);
	// 模拟数据
	const inviteList = ref([
	  { name: '袁亚(陕A85**1)', km: '760', avatar: 'https://via.placeholder.com/40' },
	  { name: '姚昊(陕A85**1)', km: '758', avatar: 'https://via.placeholder.com/40' },
	  { name: '章三(陕A85**1)', km: '760', avatar: 'https://via.placeholder.com/40' },
	  { name: '李司棋(陕A85**1)', km: '758', avatar: 'https://via.placeholder.com/40' },
	  { name: '巴菲特(陕A85**1)', km: '760', avatar: 'https://via.placeholder.com/40' },
	  { name: '张琪(陕A85**1)', km: '758', avatar: 'https://via.placeholder.com/40' },
	]);

	const goBack = () => {
	  uni.navigateBack();
	};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #CAECD0 0%, #F5F8F5 25%);
  display: flex;
  flex-direction: column;
}

.tabs-container {
  padding: 20px 40px;
  padding-bottom: 0;
  .tabs {
    display: flex;
    background: #fff;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
  .tab-item {
    flex: 1;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    color: #666;
    transition: all 0.3s;
    
    &.active {
      background: #6b8e23;
      color: #fff;
      border-radius: 25px;
    }
  }
}

.stats-card {
  background: linear-gradient(180deg, #D4EFB8 0%, #FFFFFF 56%);
  margin: 20rpx 30rpx;
  border-radius: 24rpx;
  display: flex;
  padding: 40rpx 0;
  box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.05);
  
  .stats-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stats-value {
      font-size: 48rpx;
      font-weight: bold;
      color: #333;
    }
    
    .stats-label {
      font-size: 24rpx;
      color: #888;
      margin-top: 10rpx;
    }
  }
}

.list-header {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 60rpx;
  background: rgba(98, 143, 47, 0.0941);
  margin-top: 20rpx;
  
  .header-text {
    font-size: 13px;
    color: #888;
  }
}

.list-content {
  flex: 1;
  background-color: #fff;
  
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 60rpx;
    
    &.bg-grey {
      background-color: #F7F7F7;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      
      .avatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 24rpx;
        background-color: #eee;
      }
      
      .user-name {
        font-size: 28rpx;
        color: #333;
      }
    }
    
    .mileage {
      font-size: 28rpx;
      color: #444;
    }
  }
}
</style>