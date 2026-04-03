<template>
  <view class="modal" v-if="show">
    <view class="carPlate">
      <view class="wordList">
        <text> </text>
        <text class="closeTex" @click.stop="close">收起</text>
      </view>

      <block v-if="type === 1">
        <view class="wordList" v-for="(items, index) in cityKeywords" :key="index">
          <view class="wordItem" @click="handleClick" data-type="1" :data-item="item" v-for="(item, idx) in items" :key="idx">{{ item }}</view>
        </view>
      </block>

      <block v-else>
        <view class="wordList">
          <view class="wordItem" @click="handleClick" data-type="2" :data-item="item" v-for="(item, index) in keyNumber" :key="index">{{ item }}</view>
        </view>
        <view class="wordList">
          <view class="wordItem" @click="handleClick" data-type="2" :data-item="item" v-for="(item, index) in wordList1" :key="index">{{ item }}</view>
        </view>
        <view class="wordList">
          <view class="wordItem" @click="handleClick" data-type="2" :data-item="item" v-for="(item, index) in wordList2" :key="index">{{ item }}</view>
          <view class="wordItem wordClear" @click="handleClick" data-item="delete">
            <image src="https://tranalioss.shanyitong.com/images/activeIcons/input_clear.png" class="clearImg"></image>
          </view>
        </view>
        <view class="wordList">
          <view class="wordItem" @click="handleClick" :data-item="item" v-for="(item, index) in wordList3" :key="index">{{ item }}</view>
          <view class="wordItem wordConfirm" @click="handleClick" data-item="confirm">确定</view>
        </view>
      </block>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'CarNumInput',
  props: {
    type: {
      type: Number as PropType<number>,
      default: 1,
    },
    show: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  data() {
    return {
      cityKeywords: [
        ['京沪浙苏粤鲁晋冀豫', '川渝辽吉黑皖鄂湘赣', '闽陕甘宁蒙津贵云', '桂琼青新藏港澳台'], // Combined cityKeywords for easier iteration
      ],
      keyNumber: '1234567890',
      wordList1: 'QWERTYUIOP',
      wordList2: 'ASDFGHJKL',
      wordList3: 'ZXCVBNM',
    };
  },
  methods: {
    handleClick(e: Event) {
      const value = (e.currentTarget as HTMLElement).dataset.item;
      const type = (e.currentTarget as HTMLElement).dataset.type;
      switch (value) {
        case 'confirm':
          this.$emit('confirm');
          break;
        case 'delete':
          this.$emit('delete');
          break;
        default:
          this.$emit('change', { value, type });
      }
    },
    close() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss">
.carPlate{
  position: fixed;
  padding: 12rpx 12rpx 30rpx;
  left: 0;
  bottom: 0;
  width: 100%;
  /* height: 150px; */
  font-size: 30rpx;
  background: #fff;
  box-sizing: border-box;
  border-top: 1px solid rgb(211, 207, 207);
  z-index: 200;
}
.wordList{
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.wordItem{
  margin: 5rpx;
  width: 70rpx;
  height: 78rpx;
  line-height: 78rpx;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 10rpx;
}
.wordConfirm{
  width: 130rpx;
  color: #fff;
  background: #e7771a;
}
.wordClear{
  width: 100rpx;
}
.clearImg{
  width: 60rpx;
  height: 60rpx;
  vertical-align: middle;
}
.closeTex{
  font-size: 28rpx;
  color: #e7771a;
  padding: 10rpx;
}

.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, .5);
  z-index: 9;
}
</style>
