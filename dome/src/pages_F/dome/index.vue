<template>
  <view class="page-view">
    <!-- <view class="status-bar" v-if="isRecording">
      <text class="dot"></text> 
      <text v-if="hasSpoken" class="status-active">正在识别... (2秒未出文字自动结束)</text>
      <text v-else>等待说话... (5秒未出文字自动结束)</text>
    </view>

    <scroll-view scroll-y class="result-box" :scroll-into-view="scrollTopId">
      <view class="result-item" v-for="(item, index) in finalResults" :key="index">{{ item }}</view>
      <view class="temp-text" v-if="tempResult">{{ tempResult }}</view>
      <view id="bottom-gap" style="height: 1px;"></view>
    </scroll-view>

    <view class="btn-container">
      <button @click="toggleSpeech" :class="{ 'is-recording': isRecording }">
        {{ isRecording ? '停止识别' : '开始识别' }}
      </button>
    </view> -->
	<SpeechRecognizer></SpeechRecognizer>
  </view>
</template>

<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue';
import SpeechRecognizer from '@/components/OpenAiHuman/SpeechRecognizer.nvue'
// 导入自定义的语音识别工具类
// import { SpeechRecognizer } from './SpeechRecognizer';

// // --- 响应式状态变量 ---
// const isRecording = ref(false);     // 是否正处于录音/识别状态
// const hasSpoken = ref(false);       // 本次录音是否已经检测到有效语音
// const finalResults = ref<string[]>([]); // 存储已确定的识别文本列表
// const tempResult = ref('');         // 存储当前未完成句子的临时文本
// const scrollTopId = ref('');        // 控制 scroll-view 滚动的位置 ID

// /**
//  * 实例化语音识别器
//  * 配置回调函数，将识别器的内部状态同步到 Vue 响应式变量中
//  */
// const recognizer = new SpeechRecognizer({
//   // 当识别到中间结果时触发（如：我... 我想...）
//   onPartialResult: (text) => {
//     tempResult.value = text;
//   },
//   // 当识别到一段完整的句子时触发
//   onFinalResult: (text) => {
//     finalResults.value.push(text); // 加入正式列表
//     tempResult.value = '';         // 清空临时文本
//     // 等 DOM 更新后，将滚动条拉到底部
//     nextTick(() => { 
//       scrollTopId.value = 'bottom-gap'; 
//     });
//   },
//   // 识别器状态（录音中、说话中）变化时的回调
//   onStatusChange: (rec, spoken) => {
//     isRecording.value = rec;
//     hasSpoken.value = spoken;
//   },
//   // 发生错误（如网络断开、权限拒绝）时的回调
//   onError: () => {
//     uni.showToast({ title: '识别异常', icon: 'none' });
//   }
// });

// /**
//  * 按钮点击事件：切换开始和停止
//  */
// const toggleSpeech = () => {
//   if (isRecording.value) {
//     recognizer.stop();
//   } else {
//     recognizer.start();
//   }
// };

// /**
//  * 生命周期钩子：页面卸载时务必停止识别，释放麦克风资源和 WebSocket 连接
//  */
// onUnmounted(() => {
//   recognizer.stop();
// });
</script>