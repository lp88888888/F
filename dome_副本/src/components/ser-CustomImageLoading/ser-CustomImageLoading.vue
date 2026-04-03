<!-- /components/CustomImageLoading.vue -->
<template>
  <view v-if="modelValue" class="custom-loading-mask">
    <view class="loading-content">
      <!-- 自定义 loading 图片（建议 80x80 px 左右） -->
      <image 
        :src="imgUrl+'loading.gif'" 
        class="loading-image"
        mode="aspectFit"
      />
      <text v-if="text" class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup>
	import {imgUrl} from '@/config';
// 接收 props
const props = defineProps({
  // 控制显示/隐藏（用于 v-model:visible）
  modelValue: {
    type: Boolean,
    default: false
  },
  // 提示文字
  text: {
    type: String,
    default: '加载中...'
  },
})

// defineExpose({
//   show() {
//     emit('update:modelValue', true)
//   },
//   hide() {
//     emit('update:modelValue', false)
//   }
// })
</script>

<style scoped>
/* 全屏遮罩 - 压屏 */
.custom-loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 1250rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* 确保在最上层 */
}

/* 内容容器 */
.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 24rpx;
  width: 260rpx;
}

/* 自定义图片 + 旋转动画 */
.loading-image {
  width: 180rpx;
  height: 180rpx;
}


/* 文字样式 */
.loading-text {
  margin-top: 20rpx;
  color: #ffffff;
  font-size: 28rpx;
  text-align: center;
  /* line-height: 1.4; */
}
</style>