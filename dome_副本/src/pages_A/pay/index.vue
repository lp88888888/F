<template>
  <view class="page-container">
    <up-navbar
      title="支付订单"
      bgColor="transparent"
      @leftClick="toBack"
      placeholder
      :fixed="true"
      :titleStyle="{ fontWeight: 'bold' }"
    ></up-navbar>
    <view class="cenBox fl-ce-ce">
      <view class="cenBox-text">支付剩余时间 14:30</view>
      <up-gap height="13"></up-gap>
      <view class="price">
        <text class="price-text1">￥</text>
        <text class="price-text2">46.60</text>
      </view>
      <up-gap height="20"></up-gap>
      <view class="cenBox-text">朋乐乐购｜3940573929223</view>
    </view>
    <up-gap height="15"></up-gap>
    <view class="patBox">
      <view class="patBox-item fl-ce-sb">
        <view class="fl-al-ce">
          <up-icon :name="imgUrl + 'static/pay-wx.png'" size="30"></up-icon>
          <text class="fontText">微信支付</text>
        </view>
        <up-icon :name="imgUrl + 'bindetc-truth.png'" size="14"></up-icon>
      </view>
    </view>
    <up-gap height="200"></up-gap>
    <view class="buttBox" style="margin: 0 auto" @click="payAmount">确认支付</view>
    <up-popup :show="popShow" @close="close" round="20" closeable>
      <view class="popView">
        <image
          class="succImg"
          :src="imgUrl + 'static/pay-success.png'"
          lazy-load
          mode=""
        ></image>
        <view class="tetxFont1">支付成功 ￥34.56</view>
        <up-gap height="50"></up-gap>
        <view class="buttBox" @click="close">完成</view>
      </view>
    </up-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { toNav, toBack } from "@/utils/route";
import { imgUrl } from "@/config";
const popShow = ref(false);
const close = () => {
  popShow.value = false;
};
const payAmount = () => {
  popShow.value = true;
};
</script>

<style lang="scss" scoped>
.page-container {
  height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(255, 150, 0, 0.18) 0%,
    rgba(216, 216, 216, 0) 100%
  );
}
.cenBox {
  padding: 70rpx 30rpx;
  box-sizing: border-box;
  flex-direction: column;
  .cenBox-text {
    font-weight: 400;
    font-size: 28rpx;
    color: #666666;
  }
  .price {
    font-weight: bold;
    .price-text1 {
      font-size: 32rpx;
    }
    .price-text2 {
      font-size: 54rpx;
    }
  }
}
.patBox {
  width: 690rpx;
  background: #ffffff;
  border-radius: 25rpx;
  margin: 0 auto;

  .patBox-item {
    padding: 30rpx 25rpx;
    box-sizing: border-box;
  }
  .fontText {
    margin-left: 20rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #333333;
    line-height: 32rpx;
  }
}
.popView {
  width: 100%;
  padding: 50rpx 30rpx 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  .tetxFont1 {
    font-weight: 500;
    font-size: 40rpx;
    color: #333333;
    line-height: 56rpx;
  }
  .tetxFont2 {
    font-size: 26rpx;
    text-align: center;
    color: #666666;
  }
  .succImg {
    width: 110rpx;
    height: 110rpx;
    // margin: 30rpx auto;
  }
}
.fixBot {
  position: fixed;
  left: 30rpx;
  bottom: 30rpx;
}
.buttBox {
  width: 690rpx;
  height: 90rpx;
  border-radius: 45rpx;
  background: $bgLgColor;
  color: #ffffff;
  line-height: 90rpx;
  text-align: center;
  font-weight: 600;
}
</style>
