<template>
  <view class="conete" :data-theme="pageTheme" >
    <!-- 市场活动列表子组件 -->
    <MarketActivityList
      :list="dataList"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 空状态：修复判断条件为数组长度 -->
    <template v-if="dataList.length === 0">
      <ser-empty></ser-empty>
    </template>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, watch } from 'vue';
// 接口
import { selectActivityList } from '@/api/car';
// 子组件
import MarketActivityList from './components/MarketActivityList.vue';
// 类型
import type { MarketActivity } from './types';
import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
// 活动列表数据
const dataList = ref<MarketActivity[]>([]);
// 搜索关键词
const searchKeyword = ref('');
// 上一次的搜索关键词（用于去重，避免重复请求）
const lastKeyword = ref('');

/**
 * 请求活动列表数据
 */
const selectActivityListFun = async () => {
  try {
    const res = await selectActivityList({ activityName: searchKeyword.value });
    console.log('接口返回数据：', res);
    // 确保rows存在，否则赋值空数组
    dataList.value = res?.rows || [];
  } catch (error) {
    console.error('活动列表请求失败：', error);
    // 错误提示
    uni.showToast({
      title: '请求失败，请重试',
      icon: 'none'
    });
    dataList.value = [];
  }
};

// 页面加载时请求数据
onLoad(() => {
  selectActivityListFun();
});

/**
 * 搜索回调
 * @param keyword 搜索关键词
 */
const handleSearch = (keyword: string) => {
  console.log('父组件接收到搜索关键词：', keyword);
  // 若关键词相同，不重复请求
  if (keyword === lastKeyword.value) return;
  lastKeyword.value = keyword;
  searchKeyword.value = keyword;
  selectActivityListFun();
};

/**
 * 重置搜索回调
 */
const handleReset = () => {
  console.log('父组件接收到重置事件');
  // 重置关键词和去重标记
  searchKeyword.value = '';
  lastKeyword.value = '';
  selectActivityListFun();
};
</script>

<style lang="scss">
.conete {
  background: var(--head-color);
}

.topSele {
  padding: 20rpx 40rpx 40rpx 40rpx;
  box-sizing: border-box;
  background: #ffffff;
  display: flex;
  align-items: center;

  .topSele-item {
    height: 56rpx;
    background: #f0f0f0;
    border-radius: 28rpx;
    margin-right: 24rpx;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    box-sizing: border-box;
    font-weight: 400;
    font-size: 28rpx;
    color: #666666;

    text {
      margin-right: 10rpx;
    }
  }
}
</style>