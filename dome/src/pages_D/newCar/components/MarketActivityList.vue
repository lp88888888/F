<template>
  <view class="pageView" :data-theme="pageTheme">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="searcch-box flex">
        <image
          class="icon-32 m-r-10"
          :src="imgUrl + 'new_search.png'"
          mode="aspectFit"
        ></image>
        <up-input
          v-model="activityName"
          placeholder="请输入活动关键字搜索"
          border="none"
          placeholder-style="color: #999"
          @confirm="handleSearch(activityName.value)"
          clearable
          @clear="handleClear"
          @change="handleInput"
        />
      </view>
      <view class="btn" @click="toNav(`/pages_D/newCar/activityApplyList`)">
        我的报名
      </view>
    </view>

    <!-- 活动列表 -->
    <view class="content" v-for="(item, index) in list" :key="index">
      <view
        class="card"
        @click="toNav(`/pages_D/newCar/activityDetails?id=${item.id}`)"
      >
        <image class="card-img" :src="item.coverImageUrl" mode="aspectFill"></image>
        <view class="card-cnet">
          <view class="card-cnet-left">
            <view class="card-cnet-name texNoWrap">{{ item.activityName }}</view>
            <up-gap height="12"></up-gap>
            <view class="card-cnet-text">
              <up-icon name="map" color="#FF9600"></up-icon>
              <text class="texNoWrap">{{ item.location }}</text>
            </view>
          </view>
          <view
            class="card-cnet-but b-btn"
			v-if="!item.prCarMarketingActivityApplyVo&&item.status == 1 && item.registrationStatus == 'open' "
          >
             我要报名
          </view>
		  <view
		    class="card-cnet-but g-btn"
			v-if="item.prCarMarketingActivityApplyVo&&item.status == 1 && item.registrationStatus == 'open' "
		  >
		    已报名
		  </view>
		  <view
		    class="card-cnet-but g-btn"
		  			v-if="item.status == 0 "
		  >
		    已结束
		  </view>
		  <view
		    class="card-cnet-but g-btn"
		  			v-if="item.status == 1 && item.registrationStatus == 'closed'"
		  >
		    已截止
		  </view>
		  <view
		    class="card-cnet-but g-btn"
		  			v-if="item.status = 1 && item.registrationStatus == 'full'"
		  >
		    已满员
		  </view>
        </view>
      </view>
      <up-gap height="20"></up-gap>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
// 配置
import { imgUrl } from '@/config';
// 工具函数
import { debounce, toast } from '@/utils/common';
import { toNav, toBack } from '@/utils/route';
// 类型
import type { MarketActivity } from '../types';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
/** 组件props */
interface Props {
  list: MarketActivity[];
}

// 定义props并添加默认值
const props = withDefaults(defineProps<Props>(), {
  list: () => [], // 默认空数组
});

/** 组件事件 */
const emit = defineEmits<{
  (e: 'search', keyword: string): void;
  (e: 'reset'): void;
}>();

// 搜索框绑定值
const activityName = ref<string>('');

/**
 * 搜索处理函数
 * @param keyword 搜索关键词（可选，优先使用传入的关键词）
 */
const handleSearch = (keyword?: string) => {
  // 优先使用传入的关键词，否则用搜索框的值，并去除首尾空格
  const key = keyword ? keyword.trim() : activityName.value.trim();
  console.log('子组件触发search事件，关键词：', key);
  emit('search', key);
};

/**
 * 输入防抖处理：延迟300ms执行搜索
 */
const handleInput = debounce((value: string) => {
  console.log('防抖输入触发，输入值：', value);
  handleSearch(value);
}, 300);

/**
 * 清空搜索框处理
 */
const handleClear = () => {
  console.log('子组件触发clear，执行reset');
  activityName.value = '';
  emit('reset');
};
</script>

<style lang="scss" scoped>
.pageView {
  box-sizing: border-box;
}

.search-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  box-sizing: border-box;
  background: #ffffff;

  .searcch-box {
    height: 70rpx;
    background: #f5f5f5;
    border-radius: 410rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    flex: 1;
  }

  .icon-32 {
    width: 32rpx;
    height: 32rpx;
  }

  .m-r-10 {
    margin-right: 10rpx;
  }

  .btn {
    width: 76rpx;
    background: var(--primary-color);
    border-radius: 16rpx;
    font-weight: 500;
    font-size: 24rpx;
    color: #ffffff;
    box-sizing: border-box;
    padding: 8rpx 14rpx;
    margin-left: 32rpx;
    text-align: center;
  }
}

.content {
  padding: 24rpx 30rpx 0;
}

.card {
  width: 100%;
  background: #ffffff;
  box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
  border-radius: 16rpx 16rpx 0 0;

  .card-img {
    width: 100%;
    max-height: 254rpx;
    border-radius: 16rpx 16rpx 0 0;
  }

  .card-cnet {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 26rpx 32rpx;
    box-sizing: border-box;

    .card-cnet-left {
      width: calc(100% - 166rpx);
    }

    .card-cnet-name {
      font-weight: 700;
      font-size: 32rpx;
      color: #333333;
    }

    .card-cnet-text {
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 28rpx;
      color: #666666;

      text {
        margin-left: 10rpx;
      }
    }

    .card-cnet-but {
      width: 146rpx;
      height: 64rpx;
      line-height: 64rpx;
      text-align: center;
      border-radius: 8rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #ffffff;
    }
  }
}

// 文本超出隐藏
.texNoWrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 已报名按钮样式
.g-btn {
  background: #999999;
}

// 我要报名按钮样式
.b-btn {
  background: var(--primary-color)
}
</style>