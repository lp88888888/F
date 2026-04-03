<template>
	<view class="page-view" :data-theme="pageTheme">
		<image class="topBgImg" :src="imgUrl+'static/C-truck/points-bg.png'" ></image>
		<up-navbar title="赚取积分" bgColor="transparent" @leftClick="toBack"  :placeholder="true" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="container">
			<view class="container-posr">
				<view class="container-top">
					<image class="container-top-img" :src="imgUrl+'static/C-truck/points-icon1.png'" mode=""></image>
					<view class="container-top-text">赚取方式</view>
				</view>
			</view>
			
		    <view class="list-container" >
		      <view 
		        v-for="(item, index) in taskList" 
		        :key="index" 
		        class="task-card"
				@click="toNav(item.router)"
		      >
		        
		        <view class="card-content">
		          <view class="header-row">
		            <image class="main-icon" :src="item.icon" mode="aspectFit"></image>
		            <text class="title">{{ item.title }}</text>
		          </view>
		          
		          <view class="desc-box">
		            <text class="desc-text">{{ item.description }}</text>
		          </view>
		        </view>
		        
		        <view class="arrow-btn" :style="{background: themeStore.themeColors.$primaryColor}">去参加</view>
		      </view>
		    </view>
		  </view>
		  <up-gap height="100" ></up-gap>
		  <PageDurationTracker pageName="货车节赚取积分" type="time" />
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { toNav,toBack } from '@/utils/route';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	// 模拟任务数据
	const taskList = ref([
	  {
	    title: '游戏抽奖',
	    description: '规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明',
	    icon: imgUrl+'static/C-truck/pon-icon-1.png', // 请替换为你的实际图片路径
	    bgColor: imgUrl+'static/C-truck/pon-bg-1.png', // 浅橙色
	    router: ''
	  },
	  {
	    title: '榜单赚积分',
	    description: '规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明',
	    icon: imgUrl+'static/C-truck/pon-icon-2.png', // 请替换为你的实际图片路径
	    bgColor: imgUrl+'static/C-truck/pon-bg-2.png', // 浅橙色
	    router: '/pages_C/truckFestival/pointsRankingList?id=26'
	  },
	  {
	    title: '邀请赚积分',
	    description: '规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明',
	    icon: imgUrl+'static/C-truck/pon-icon-3.png', // 请替换为你的实际图片路径
	    bgColor: imgUrl+'static/C-truck/pon-bg-3.png', // 浅橙色
	    router: '/pages_C/truckFestival/pointsInvitation?id=26'
	  },
	  {
	    title: '里程赚积分',
	    description: '规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明',
	    icon: imgUrl+'static/C-truck/pon-icon-4.png', // 请替换为你的实际图片路径
	    bgColor: imgUrl+'static/C-truck/pon-bg-4.png', // 浅橙色
	    router: '/pages_C/truckFestival/mileage?id=26'
	  },
	  {
	    title: '打卡赚积分',
	    description: '规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明规则说明',
	    icon: imgUrl+'static/C-truck/pon-icon-5.png', // 请替换为你的实际图片路径
	    bgColor: imgUrl+'static/C-truck/pon-bg-5.png', // 浅橙色
	    router: '/pages_C/truckFestival/clockIn'
	  }
	]);
</script>

<style lang="scss" scoped>
	.page-view {
	  min-height: 100vh;
	  background-color: #E0F8F9; // 页面整体淡绿色背景
	  // padding: 0 30rpx 40rpx;
	  position: relative;
	}
	.topBgImg{
		position: absolute;
		z-index: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
	}
	.container{
		margin-top: 530rpx;
		margin-left: 30rpx;
		width: 690rpx;
		min-height: 458px;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.1);
		box-sizing: border-box;
		border: 2rpx solid #FFFFFF;
		backdrop-filter: blur(6px);
		box-shadow: 0px 0px 10px 0px rgba(0, 190, 190, 0.3);
		padding-top: 90rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		.container-posr{
			width: 300rpx;
			height: 80rpx;
			position: absolute;
			top: -20rpx;
			left: 195rpx;
			z-index: 1;
		}
		.container-top{
			width: 300rpx;
			height: 80rpx;
			position: relative;
			.container-top-img{
				width: 300rpx;
				height: 80rpx;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
			}
			.container-top-text{
				width: 300rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 3;
				font-weight: 500;
				color: #333333;
				font-size: 32rpx;
			}
		}
	}
	
	.list-container {
		width: 100%;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  // position: absolute;
	  // z-index: 1;
	}
	
	.task-card {
		margin: 0 auto;
		width: 630rpx;
		height: 144rpx;
	  position: relative;
	  border-radius: 30rpx;
	  margin-bottom: 30rpx;
	  padding: 40rpx 30rpx;
	  box-sizing: border-box;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  background-color: #fff; // 默认白色
	  box-shadow: 0px 0px 10px 0px rgba(0, 190, 190, 0.3);
	  // background: #333 !important;
	
	  // 右下角背景大图
	  // .bg-icon {
	  //   position: absolute;
	  //   right: -20rpx;
	  //   bottom: -20rpx;
	  //   width: 160rpx;
	  //   height: 160rpx;
	  //   opacity: 0.1; // 极低透明度，形成水印感
	  //   transform: rotate(-15deg);
	  // }
	
	  .card-content {
	    flex: 1;
	    z-index: 1;
	
	    .header-row {
	      display: flex;
	      align-items: center;
	      margin-bottom: 12rpx;
	
	      .main-icon {
	        width: 48rpx;
	        height: 48rpx;
	        margin-right: 16rpx;
	      }
	
	      .title {
	        font-size: 32rpx;
	        font-weight: 700;
	        color: #333;
	      }
	
	      .progress {
	        font-size: 32rpx;
	        color: #333;
	        margin-left: 10rpx;
	        font-weight: 600;
	      }
	    }
	
	    .desc-box {
	      width: 85%;
	      .desc-text {
	        font-size: 24rpx;
	        color: #888;
	        line-height: 1.4;
	        display: -webkit-box;
	        -webkit-box-orient: vertical;
	        -webkit-line-clamp: 1; // 限制行数
	        overflow: hidden;
	      }
	    }
	  }
	
	  .arrow-btn {
	    width: 120rpx;
	    height: 56rpx;
	    // background-color: rgba(255,255,255,0.6);
	    // border: 2rpx solid #DDD;
	    border-radius:48rpx;
		font-size: 24rpx;
		color:#FFFFFF;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    z-index: 1;
	  }
	}
</style>