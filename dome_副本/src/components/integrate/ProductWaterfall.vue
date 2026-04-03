<template>
  <view class="product-waterfall">
    <!-- 使用uView Plus的瀑布流组件 -->
    <u-waterfall 
      v-model="waterfallData" 
      ref="uWaterfall"
      :add-time="100"
      @change="handleWaterfallChange"
    >
      <template v-slot:left="{ leftList }">
        <view 
          class="waterfall-item" 
          v-for="(product, index) in leftList" 
          :key="product.id"
          @click="handleItemClick(product)"
        >
          <product-card 
            :product="product" 
            @heightChange="handleHeightChange"
          />
        </view>
      </template>
      <template v-slot:right="{ rightList }">
        <view 
          class="waterfall-item" 
          v-for="(product, index) in rightList" 
          :key="product.id"
          @click="handleItemClick(product)"
        >
          <product-card 
            :product="product" 
            @heightChange="handleHeightChange"
          />
        </view>
      </template>
    </u-waterfall>
    
    <!-- 加载更多提示 -->
    <u-loadmore 
      :status="loadStatus" 
      :icon-type="iconType"
      :load-text="loadText"
      margin-top="20"
      margin-bottom="20"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { ProductItem } from './ProductCard.vue';

const props = defineProps<{
  products: ProductItem[]; // 商品数据
  loading?: boolean;       // 是否正在加载
  finished?: boolean;      // 是否加载完成
}>();

const emit = defineEmits(['itemClick', 'loadMore']);

const uWaterfall = ref();
const waterfallData = ref<ProductItem[]>([]);

// 加载状态
const loadStatus = computed(() => {
  if (props.loading) return 'loading';
  if (props.finished) return 'nomore';
  return 'loadmore';
});

const iconType = ref('circle');
const loadText = ref({
  loadmore: '上拉加载更多',
  loading: '正在加载...',
  nomore: '没有更多了'
});

// 监听products变化
watch(() => props.products, (newVal) => {
  waterfallData.value = newVal;
}, { immediate: true });

// 处理商品点击
const handleItemClick = (product: ProductItem) => {
  emit('itemClick', product);
};

// 处理高度变化
const handleHeightChange = ({ id, height }: { id: number; height: number }) => {
  const index = waterfallData.value.findIndex(item => item.id === id);
  if (index !== -1) {
    waterfallData.value[index].height = height;
    uWaterfall.value.updateKey(id);
  }
};

// 瀑布流数据变化时触发
const handleWaterfallChange = () => {
  // 可以在这里处理滚动到底部加载更多
  // 这里简单示例，实际可以根据滚动位置判断
  if (!props.loading && !props.finished) {
    emit('loadMore');
  }
};

// 暴露方法给父组件
defineExpose({
  clear: () => {
    waterfallData.value = [];
    uWaterfall.value.clear();
  },
  add: (items: ProductItem[]) => {
    waterfallData.value.push(...items);
    uWaterfall.value.add(items);
  }
});
</script>

<style lang="scss" scoped>
.product-waterfall {
  padding: 20rpx;
  
  .waterfall-item {
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }
}
</style>