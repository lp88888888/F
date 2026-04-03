<template>
	  <view class="audio-wrapper">
	    <slot :playing="isPlaying" :duration="duration" :currentTime="currentTime"></slot>
	  </view>
	</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  // props 现在只保留控制类参数，src 设为可选
  loop: { type: Boolean, default: false },
  volume: { type: Number, default: 1.0 }
});

const emit = defineEmits(['onPlay', 'onStop', 'onEnded', 'onError']);

const isPlaying = ref(false);
const duration = ref(0);
const currentTime = ref(0);
let audioCtx = null;

// 1. 核心初始化：只创建实例，不看 props.src
const ensureInstance = () => {
  if (audioCtx) return audioCtx;

  console.log('--- 准备音频实例 ---');
  audioCtx = uni.createInnerAudioContext();
  
  // 关键：适配 iOS/鸿蒙 静音开关（可选）
  // #ifdef APP-PLUS || MP-WEIXIN
  uni.setInnerAudioOption({ obeyMuteSwitch: false });
  // #endif

  // 绑定事件
  audioCtx.onPlay(() => {
    isPlaying.value = true;
    emit('onPlay');
  });
  audioCtx.onEnded(() => {
    isPlaying.value = false;
    emit('onEnded');
  });
  audioCtx.onError((res) => {
    isPlaying.value = false;
    console.error("播放异常:", res);
    emit('onError', res);
  });
  audioCtx.onTimeUpdate(() => {
    currentTime.value = audioCtx.currentTime;
    duration.value = audioCtx.duration;
  });

  return audioCtx;
};

/**
 * 外部调用的核心方法
 * @param {String} url 传入的音频链接
 */
const play = (url) => {
  console.log('--- 收到播放请求 ---', url);
  if (!url) return;

  const ctx = ensureInstance();

  // 1. 强制停止当前（解决“第二次不响”的关键）
  ctx.stop();
  
  // 2. 切换新地址
  ctx.src = url;
  ctx.volume = props.volume;
  ctx.loop = props.loop;

  // 3. 异步触发播放（给原生层留出切换 src 的缓冲时间）
  // 100ms 是经验值，能解决大部分安卓机型切换不响应的问题
  setTimeout(() => {
    ctx.play();
    console.log('--- 执行 play() ---');
  }, 100);
};

const stop = () => {
  if (audioCtx) {
    audioCtx.stop();
    isPlaying.value = false;
  }
};

const destroyAudio = () => {
  if (audioCtx) {
    audioCtx.destroy();
    audioCtx = null;
  }
};

onMounted(() => {
  // 页面挂载时预创建实例，保证 play 调用时 ctx 不为 null
  ensureInstance();
});

onUnmounted(() => destroyAudio());

// 暴露方法给父组件
defineExpose({ play, stop, isPlaying });
</script>

<style lang="scss" scoped>
</style>