<template>
  <view class="order-query-page">
    
    <!-- 搜索栏 -->
    <view class="search-container">
        <view class="search-box">
          <u-icon 
            name="search" 
            color="#999999" 
            size="24" 
            class="search-icon"
          ></u-icon>
          <input 
            v-model="searchKeyword" 
            placeholder="请输入关键字搜索" 
            class="search-input"
          />
        </view>
        <text class="search-btn">搜索</text>
		<image :src="imgUrl + 'hotel/shaixuan.png'" mode="" class="filter-icon"></image>
      </view>
    
    <!-- 状态标签栏 -->
    <u-tabs 
      v-model="activeTab" 
      :list="statusTabs" 
      :is-scroll="true"
      active-color="$color"
      inactive-color="#666666"
      font-size="14"
      height="44"
      class="status-tabs"
    ></u-tabs>
    
    <!-- 订单列表 -->
    <view class="order-list">
      <u-empty 
        v-if="filteredOrders.length === 0" 
        text="暂无相关订单" 
        mode="order"
        class="empty-placeholder"
      ></u-empty>
      
      <view 
        v-for="(order, index) in filteredOrders" 
        :key="index" 
        class="order-item"
		@click="toNav('/pages_D/busTicket/details')"
      >
        <!-- 订单基本信息 -->
        <view class="order-main">
          <view class="route-info">
            <text class="station">{{ order.fromStation }}</text>
            <text class="separator">——</text>
            <text class="station">{{ order.toStation }}</text>
          </view>
          
          <view class="order-status" :class="`status-${order.status}`">
            {{ order.statusText }}
          </view>
        </view>
        
        <!-- 发车时间 -->
        <view class="departure-time">
          发车时间:{{ order.departureTime }}
        </view>
        
        <!-- 乘客信息 -->
        <view class="passenger-info">
          <text class="info-item">乘车人姓名</text>
          <text class="info-item">联系电话</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { imgUrl } from '@/config';
import { toNav,toBack } from '@/utils/route';
// 订单状态类型定义
type OrderStatus = 'all' | 'pendingPayment' | 'pendingTravel' | 'cancelled' | 'completed' | 'refunded';

// 订单信息接口
interface OrderInfo {
  id: number;
  fromStation: string;
  toStation: string;
  departureTime: string;
  status: Exclude<OrderStatus, 'all'>;
  statusText: string;
}

// 状态标签配置
const statusTabs = [
  { name: '全部', value: 'all' },
  { name: '待支付', value: 'pendingPayment' },
  { name: '待出行', value: 'pendingTravel' },
  { name: '已取消', value: 'cancelled' },
  { name: '已完成', value: 'completed' },
  { name: '退票', value: 'refunded' },
];

// 搜索关键词
const searchKeyword = ref('');

// 当前激活的标签
const activeTab = ref<OrderStatus>('all');

// 订单数据
const orders = ref<OrderInfo[]>([
  {
    id: 1,
    fromStation: '省西汽车站',
    toStation: '兵马俑',
    departureTime: '2025年11月10日',
    status: 'completed',
    statusText: '已完成'
  },
  {
    id: 2,
    fromStation: '省西汽车站',
    toStation: '兵马俑',
    departureTime: '2025年11月10日',
    status: 'pendingPayment',
    statusText: '待支付'
  },
  {
    id: 3,
    fromStation: '省西汽车站',
    toStation: '兵马俑',
    departureTime: '2025年11月10日',
    status: 'pendingTravel',
    statusText: '待出行'
  },
  {
    id: 4,
    fromStation: '省西汽车站',
    toStation: '兵马俑',
    departureTime: '2025年11月10日',
    status: 'cancelled',
    statusText: '已取消'
  },
  {
    id: 5,
    fromStation: '省西汽车站',
    toStation: '兵马俑',
    departureTime: '2025年11月10日',
    status: 'refunded',
    statusText: '已退票'
  },
  {
    id: 6,
    fromStation: '省西汽车站',
    toStation: '兵马俑',
    departureTime: '2025年11月10日',
    status: 'cancelled',
    statusText: '已取消'
  }
]);

// 根据状态和搜索词过滤订单
const filteredOrders = computed<OrderInfo[]>(() => {
  return orders.value.filter(order => {
    // 状态过滤
    const statusMatch = activeTab.value === 'all' || order.status === activeTab.value;
    
    // 搜索词过滤
    const keywordMatch = 
      !searchKeyword.value || 
      order.fromStation.includes(searchKeyword.value) ||
      order.toStation.includes(searchKeyword.value) ||
      order.departureTime.includes(searchKeyword.value) ||
      order.statusText.includes(searchKeyword.value);
      
    return statusMatch && keywordMatch;
  });
});
</script>

<style lang="scss" scoped>
.order-query-page {
  background-color: #F5F5F5;
  min-height: 100vh;
  padding-bottom: 20rpx;
  
  .search-container {
    display: flex;
    align-items: center;
    padding: 16rpx 20rpx;
    background-color: #FFFFFF;
    
    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      background-color: #F5F5F5;
      border-radius: 60rpx;
      padding: 12rpx 24rpx;
      margin-right: 20rpx;
      
      .search-icon {
        margin-right: 12rpx;
      }
      
      .search-input {
        flex: 1;
        font-size: 28rpx;
        color: #333333;
        background: transparent;
        border: none;
        outline: none;
        height: 36rpx;
        line-height: 36rpx;
        
        &::placeholder {
          color: #C0C0C0;
        }
      }
    }
    
    .search-btn {
      font-size: 28rpx;
      color: $color;
      font-weight: 500;
      margin-right: 20rpx;
      white-space: nowrap;
    }
    
    .filter-icon {
      width: 40rpx;
	  height: 40rpx;
    }
  }
  
  .status-tabs {
    background-color: #FFFFFF;
    margin-bottom: 20rpx;
  }
  
  .order-list {
    padding: 0 20rpx;
    
    .empty-placeholder {
      margin-top: 200rpx;
    }
    
    .order-item {
      position: relative;
      background-color: #FFFFFF;
      border-radius: 12rpx;
      padding: 24rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      
      .order-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        
        .route-info {
          display: flex;
          align-items: center;
          
          .station {
            font-size: 30rpx;
            color: #333333;
            font-weight: 500;
          }
          
          .separator {
            margin: 0 16rpx;
            color: #999999;
          }
        }
        
        .order-status {
          font-size: 26rpx;
          padding: 4rpx 16rpx;
          border-radius: 20rpx;
          font-weight: 500;
        }
        
        // 不同状态的样式
        .status-pendingPayment {
          color: #FF7D00;
          background-color: rgba(255, 125, 0, 0.1);
        }
        
        .status-pendingTravel {
          color: #007AFF;
          background-color: rgba(0, 122, 255, 0.1);
        }
        
        .status-cancelled, .status-refunded {
          color: #999999;
          background-color: rgba(153, 153, 153, 0.1);
        }
        
        .status-completed {
          color: #00B42A;
          background-color: rgba(0, 180, 42, 0.1);
        }
      }
      
      .departure-time {
        font-size: 26rpx;
        color: #666666;
        margin-bottom: 20rpx;
      }
      
      .passenger-info {
        display: flex;
        gap: 30rpx;
        
        .info-item {
          font-size: 26rpx;
          color: #999999;
        }
      }
    }
  }
}
</style>