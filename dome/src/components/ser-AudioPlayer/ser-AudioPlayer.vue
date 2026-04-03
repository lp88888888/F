<template>
	<template>
	  <view class="audio-wrapper">
	    <slot :playing="isPlaying" :duration="duration" :currentTime="currentTime"></slot>
	  </view>
	</template>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  src: { type: String, default: "" },
  autoplay: { type: Boolean, default: false },
  loop: { type: Boolean, default: false },
  volume: { type: Number, default: 1.0 }
});

const emit = defineEmits(['onPlay', 'onStop', 'onEnded', 'onError', 'timeUpdate']);

// 响应式状态
const isPlaying = ref(false);
const duration = ref(0);
const currentTime = ref(0);
let audioCtx = null;

// 初始化音频实例
const initAudio = () => {
  if (!props.src) return;

  // 销毁旧实例防止内存泄露
  destroyAudio();

  audioCtx = uni.createInnerAudioContext();
  audioCtx.src = props.src;
  audioCtx.autoplay = props.autoplay;
  audioCtx.loop = props.loop;
  audioCtx.volume = props.volume;

  // --- 平台差异化处理 ---
  // #ifdef APP-PLUS || MP-WEIXIN
  // 适配 iOS：即使开启静音键也能播报（适合导航、语音提醒类）
  if (uni.setInnerAudioOption) {
    uni.setInnerAudioOption({
      obeyMuteSwitch: false, 
      fail: (err) => console.warn("音频选项设置失败", err)
    });
  }
  // #endif

  // 事件监听
  audioCtx.onPlay(() => {
    isPlaying.value = true;
    emit('onPlay');
  });
  
  audioCtx.onPause(() => (isPlaying.value = false));
  
  audioCtx.onStop(() => {
    isPlaying.value = false;
    emit('onStop');
  });

  audioCtx.onEnded(() => {
    isPlaying.value = false;
    emit('onEnded');
  });

  audioCtx.onTimeUpdate(() => {
    currentTime.value = audioCtx.currentTime;
    duration.value = audioCtx.duration;
    emit('timeUpdate', { current: currentTime.value, total: duration.value });
  });

  audioCtx.onError((res) => {
    isPlaying.value = false;
    console.error("音频播放异常:", res);
    emit('onError', res);
  });
};

// 操作方法
const play = () => audioCtx?.play();
const pause = () => audioCtx?.pause();
const stop = () => audioCtx?.stop();

const destroyAudio = () => {
  if (audioCtx) {
    audioCtx.destroy();
    audioCtx = null;
  }
};

// 监听 src 变化
watch(() => props.src, (newSrc) => {
  if (newSrc) {
    initAudio();
  } else {
    stop();
  }
});

// 生命周期
onMounted(() => initAudio());
onUnmounted(() => destroyAudio());

// 暴露给父组件的方法
defineExpose({
  play,
  pause,
  stop,
  isPlaying,
  duration,
  currentTime
});
</script>

<style lang="scss" scoped>
</style>