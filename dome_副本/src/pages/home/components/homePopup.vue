<template>
  <up-popup
    v-model:show="innerShow"
    mode="center"
    bgColor="transparent"
    :round="0"
    :safeAreaInsetBottom="false"
    :closeOnClickOverlay="true"
    :overlayStyle="{ backgroundColor: 'rgba(0,0,0,0.55)' }"
    @close="handleClose"
  >
    <view class="wrap" @click.stop>
      <view class="card" :style="cardStyle">
        <view class="slot-area">
		  <slot/>
		</view>
        <image
          class="btn"
          :style="btnSizeStyle"
          :src="btnBg"
          mode="aspectFit"
          @click.stop="emitConfirm"
        />

        <image
          class="close-btn"
          :src="imgUrl + 'static/home_close_btn.png'"
          mode="aspectFit"
          @click.stop="handleClose"
        />
      </view>
    </view>
  </up-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { imgUrl } from '@/config';

const props = withDefaults(defineProps<{
  show: boolean;
  bg: string;
  btnBg: string;

  // 弹窗背景图容器尺寸
  width?: string;
  height?: string;

  // 按钮尺寸
  btnWidth?: string;
  btnHeight?: string;
}>(), {
  width: '540rpx',
  height: '858rpx',
  btnWidth: '296rpx',
  btnHeight: '88rpx',
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'close'): void;
  (e: 'update:show', v: boolean): void;
}>();

const innerShow = ref(false);
watch(
  () => props.show,
  (v) => (innerShow.value = !!v),
  { immediate: true }
);

const cardStyle = computed(() => ({
  width: props.width,
  height: props.height,
  backgroundImage: `url(${props.bg})`,
  backgroundSize: '100% auto',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}));

const btnSizeStyle = computed(() => ({
  width: props.btnWidth,
  height: props.btnHeight,
}));

const emitConfirm = () => {
  emit('confirm');
  handleClose();
};

const handleClose = () => {
  emit('update:show', false); // 同步父组件
  innerShow.value = false;
  emit('close');
};
</script>

<style scoped lang="scss">
.wrap {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.btn {
  position: absolute;
  bottom: 86rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3; // 添加层级
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3; // 添加层级
}

.slot-area {
  position: relative;
  width: 100%;
  height: 100%;
  // 移除 z-index: 1，或者设置为更高的值
  z-index: 2; // 修改为 2
}
</style>
