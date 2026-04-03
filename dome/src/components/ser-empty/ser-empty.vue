<template>
  <view class="empty">
    <!-- 用计算属性兜底 -->
    <image class="empty-img" :src="realImg" :style="imgStyle" mode />
    <text class="empty-text" :style="textStyle">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { imgUrl } from '@/config'
import { useTheme } from '@/composables/useTheme'

const { themeStore } = useTheme()

interface Props {
  text?: string
  imgSrc?: string
  imgStyle?: Record<string, any>
  textStyle?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  text: '页面已准备好，就差数据来做客啦~',
  imgSrc: '',          // 先给空串，避免运行时变量
  imgStyle: () => ({}),
  textStyle: () => ({ fontSize: '28rpx' })
})

/* 计算属性：如果外部没传图，再拼默认路径 */
const realImg = computed(() =>
  props.imgSrc || `${themeStore.imgUrl}default-page.png`
)
</script>

<style lang="scss" scoped>
.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .empty-img {
    width: 582rpx;
    height: 520rpx;
    margin: 0 auto;
  }
  .empty-text {
    line-height: 40rpx;
    text-align: center;
  }
}
</style>