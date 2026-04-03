<template>
  <view class="theme-wrapper">

    <!-- 主题卡片网格 -->
    <view class="theme-grid" :style="themeGridStyle">
      <view
        v-for="item in themeList"
        :key="item.id"
        class="theme-card"
        :class="{
          'theme-card--active': item.id === currentTheme,
          'theme-card--disabled': item.disabled,
          'theme-card--more': item.id === 'more'
        }"
        :style="{
          backgroundImage: `url(${
            item.id === currentTheme ? item.activeBg : item.bg
          })`
        }"
        @tap="onSelect(item)"
      >
        <!-- 图标区域：虚线框 + 图片 -->
        <view
          class="theme-card__icon-box"
          :class="{ 'theme-card__icon-box--more': item.id === 'more' }"
        >
          <image
            class="theme-card__icon"
            :class="{ 'theme-card__icon--more': item.id === 'more' }"
            :src="item.icon"
            mode="widthFix"
          />
        </view>

        <!-- 主题名称 / 提示 -->
        <text
          v-if="!item.disabled"
          class="theme-card__name"
        >
          {{ item.name }}
        </text>
        <view
          v-else
          class="theme-card__more"
        >
          <text>更多主题</text>
          <text>敬请期待～</text>
        </view>

        <!-- 按钮：正常主题显示“选择TA”，灰卡不显示按钮 -->
        <view
          v-if="!item.disabled"
          class="theme-card__btn"
          :style="{
            backgroundColor: item.id === currentTheme ? '#C7C7C7' : item.btnColor
          }"
        >
          <text class="theme-card__btn-text">
            {{ item.id === currentTheme ? '选TA了' : '选择TA' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import { imgUrl } from '@/config'

interface ThemeItem {
  id: string
  name: string
  icon: string
  bg: string        // 未选中背景图
  activeBg: string  // 选中背景图
  btnColor: string
  disabled?: boolean
}

// 主题 store
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
const currentTheme = computed(() => theme.value)

// 网格整体背景图（保持原逻辑）
const themeGridStyle = computed(() => ({
  backgroundImage: `url(${imgUrl}static/theme_bg.png)`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center'
}))

// 主题卡片配置（保持原 vue1 配置）
const themeList = ref<ThemeItem[]>([
  {
    id: 'blue',
    name: '科技蓝主题',
    icon: imgUrl + 'static/icon_techblue.png',
    bg: imgUrl + 'static/card_techblue_normal.png',
    activeBg: imgUrl + 'static/card_techblue_active.png',
    btnColor: '#4381ED'
  },
  {
    id: 'green',
    name: '玉髓绿主题',
    icon: imgUrl + 'static/icon_green.png',
    bg: imgUrl + 'static/card_green_normal.png',
    activeBg: imgUrl + 'static/card_green_active.png',
    btnColor: '#21C65E'
  },
  {
    id: 'more',
    name: '更多主题',
    icon: imgUrl + 'static/icon_more.png',
    bg: imgUrl + 'static/card_more_normal.png',
    activeBg: imgUrl + 'static/card_more_normal.png',
    btnColor: '#333333',
    disabled: true
  }
])

// 根据 id 找到主题名字，用于 toast 文案
const getThemeName = (id: string) => {
  const t = themeList.value.find(t => t.id === id)
  return t ? t.name : '未知'
}

// 选中主题（逻辑参考 vue2，样式完全用 vue1）
const onSelect = (item: ThemeItem) => {
  if (item.disabled) return
  if (item.id === currentTheme.value) return

  try {
    // 使用和 vue2 一样的切换方法
    themeStore.toggleTheme(item.id)
    // 通知父页面（你父组件已经在监听 themeChanged）
    uni.$emit('themeChanged', item.id)

    uni.showToast({
      title: `已切换至${getThemeName(item.id)}主题`,
      icon: 'none',
      duration: 1500,
      position: 'top'
    })

    // 振动反馈
    // #ifdef APP-PLUS || MP-WEIXIN
    uni.vibrateShort()
    // #endif
  } catch (error) {
    console.error('切换主题失败:', error)
    uni.showToast({
      title: '主题切换失败',
      icon: 'error',
      duration: 2000
    })
  }
}
</script>

<style scoped lang="scss">
.theme-wrapper {
  box-sizing: border-box;
  min-height: calc(100vh - 46rpx);
  background: var(--linear-color);
}

/* 网格：2 列布局 */
.theme-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 66rpx 30rpx;
  // margin-top: 46rpx;
}

/* 单个卡片 */
.theme-card {
  width: 278rpx;
  height: 336rpx;
  margin-bottom: 24rpx;
  padding: 28rpx 24rpx 26rpx;
  box-sizing: border-box;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  border: none !important;
  align-items: center;
}

/* 选中态可以略微加个阴影感（背景主要靠图片变化） */
.theme-card--active {
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.06);
}

/* 禁用卡片（“更多主题敬请期待”） */
.theme-card--disabled {
  opacity: 0.85;
}

/* 虚线图标框 */
.theme-card__icon-box {
  width: 96rpx;
  height: 96rpx;
  border-radius: 16rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.theme-card__icon {
  width: 82rpx;
  height: 82rpx;
}

.theme-card__icon-box--more {
  width: 160rpx;
  height: 94rpx;
  border-radius: 16rpx;
  background-color: #ffffff;
  margin-top: 20rpx;
  margin-bottom: 36rpx;
}

.theme-card__icon--more {
  width: 160rpx;
  height: auto;
}

.theme-card--more {
  padding-top: 28rpx;
}

/* 主题名称 */
.theme-card__name {
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  margin-bottom: 18rpx;
}

/* 更多主题文案 */
.theme-card__more {
  margin-top: 6rpx;
  margin-bottom: 14rpx;
  text-align: center;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  line-height: 34rpx;

  text {
    display: block;
  }
}

/* 按钮 */
.theme-card__btn {
  margin-top: 24rpx;
  width: 164rpx;
  height: 64rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-card__btn-text {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 500;
}
</style>
