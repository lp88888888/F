<template>
  <view class="swiper-css zqui-rel" :style="{ height: hpx }">
    <!-- 轮播 -->
    <swiper
      class="swiper"
      :style="{ height: hpx }"
      :indicator-dots="false"
      :autoplay="false"
      :interval="10000"
      :duration="500"
      next-margin="0"
      @change="guideAction"
    >
      <swiper-item class="flex1" v-for="(item, index) in imageList" :key="index">
       <!-- <view class="flex-column title-box">
          <view class="guide-title">{{ item.name }}</view>
          <view class="guide-subtitle">{{ item.subtitle }}</view>
        </view> -->
        <image
          class="flex-column image-size"
          mode=""
          :src="item.src"
        />
      </swiper-item>
    </swiper>

    <!-- 自定义指示点 -->
    <view v-if="cur !== 2" class="flex-column dots">
      <view
        v-for="(item, index) in imageList"
        :key="index"
        class="dot"
        :class="{ active: index === cur }"
      />
    </view>

    <!-- 第三页「立即体验」按钮 -->
    <button v-if="cur === 2" class="flex-column cu-btn footer" @click="launchApp">
      立即体验
    </button>

    <!-- 右上角跳过 -->
    <view class="btn-box" @click="launchApp">
      <text class="passbtn">跳过</text>
    </view>
	<!-- <PrivacyDialog></PrivacyDialog> -->
  </view>
</template>

<script setup>
/* ==========================
 * Vue3 + Composition-api
 * ========================== */
import {ref,computed} from 'vue';
import { toNav,toBack } from '@/utils/route';
import {imgUrl} from '@/config';

import PrivacyDialog from '@/components/PrivacyDialog/PrivacyDialog.vue'
/* ---------- 静态数据 ---------- */
const imageList = ref([
  {
    name: '跨端数量多',
    subtitle: '一套代码，可发布到iOS、Android、小程序、H5等多个平台。',
    src: imgUrl+'launchPage/icon1.jpg'
    // src: imgUrl+'launchPage/false(1).webp'
  },
  {
    name: '性能体验优秀',
    subtitle: '体验更好的Hybrid框架，加载页面速度更快。\nAPP端支持WEEX原生渲染，可支持更流畅的用户体验。',
    src: imgUrl+'launchPage/icon2.jpg'
  },
  {
    name: '学习成本低',
    subtitle: '基于通用前端技术栈，采用VUE语法+微信小程序API，无额外学习成本。',
    src: imgUrl+'launchPage/icon3.jpg'
  }
])

/* ---------- 响应式变量 ---------- */
const hpx = ref('100vh')          // swiper 高度
const cur = ref(0)               // 当前索引

/* ---------- 生命周期 ---------- */
onMounted(() => {
  // 关闭启动图
  // #ifdef APP-PLUS
  plus.navigator.closeSplashscreen()
  // #endif

  // // 获取可用窗口高度
  // uni.getSystemInfo({
  //   success: (res) => {
  //     hpx.value = res.windowHeight + 'px'
  //   }
  // })

  // 默认第一屏动画
  move(0, 1)
})

/* ---------- 事件处理 ---------- */
function guideAction(e) {
  const index = e.detail.current
  cur.value = index

  if (index === 0) {
    move(0, 1); moveTwo(150, 0.1); moveThree(150, 0.1)
  } else if (index === 1) {
    moveTwo(0, 1); move(150, 0.1); moveThree(150, 0.1)
  } else if (index === 2) {
    moveThree(0, 1); moveTwo(150, 0.1); move(150, 0.1)
  }
}

function launchApp() {
  uni.setStorage({
    key: 'launchFlag',
    data: true,
    success: () => {
      uni.redirectTo({ url: '/pages/home/home' })
    }
  })
}

/* ---------- 动画封装 ---------- */
function move(tran, opa) {
  // 这里仅保留逻辑，若需要真实节点动画可改用
  // uni.createSelectorQuery() 或 CSS 动画
}
function moveTwo(tran, opa) {}
function moveThree(tran, opa) {}
</script>

<style lang="scss">
/* 样式与原来完全一致，直接复用即可 */
page {
  background-color: #ffffff;
  min-height: 100%;
  height: 100vh;
}
.flex1 {
  flex: 1;
  width: 100%;
  height: 100vh;
}
.image-size {
  // width: 630rpx;
  // height: 600rpx;
  width: 750rpx;
  height: 100vh;
  // margin-left: 60rpx;
}
.title-box {
  padding: 250rpx 0 120rpx 64rpx;
}
.guide-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #3a3d44;
}
.guide-subtitle {
  margin-top: 20rpx;
  font-size: 35rpx;
  color: #838892;
  line-height: 50rpx;
}
.footer {
  width: 231rpx;
  height: 80rpx;
  text-align: center;
  position: fixed;
  bottom: 30rpx;
  left: 37%;
  font-size: 30rpx;
  color: #ffffff;
  background-color: #2b9939;
}
.btn-box {
  position: absolute;
  z-index: 999;
  right: 40rpx;
  top: 120rpx;
}
.dots {
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 999;
  height: 151rpx;
  left: 0;
  right: 0;
  bottom: 0rpx;
}
.passbtn {
  color: #838892;
  text-align: center;
  border: 1rpx solid rgba(0, 0, 0, 0.5);
  border-radius: 30rpx;
  font-size: 28rpx;
  padding: 10rpx 25rpx;
}
.dot {
  margin: 0 4rpx;
  width: 15rpx;
  height: 15rpx;
  background: #cdd2dd;
  border-radius: 8rpx;
  transition: all 0.6s;
  &.active {
    width: 40rpx;
    background: #838892 !important;
  }
}
.zqui-rel {
  position: relative;
}
.swiper-css {
  width: 750rpx;
}
</style>