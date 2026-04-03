<template>
  <view class="container">
    <!-- 数字人 WebView -->
    <web-view
      id="digital-human-iframe"
      ref="webViewRef"
      :src="renderUrl"
      @message="handleWebViewMessage"
      @load="onWebViewLoad"
      style="width: 100%; height: 600rpx;"
    />

    <!-- 覆盖层容器（始终显示） -->
    <view class="overlay-container">
      <!-- 首次引导按钮 -->
      <view v-if="!userInteracted" class="start-overlay">
        <button type="primary" @click="activateAudio" class="start-button">
          🔊 点击开始体验数字人
        </button>
      </view>

      <!-- 控制按钮区域（激活后显示） -->
      <view v-else class="controls-overlay">
        <button type="primary" @click="speakFixed" class="control-button">
          说："你好，我是小途"
        </button>

        <button
          :type="isVoiceSupported ? 'warn' : 'default'"
          :disabled="!isVoiceSupported"
          @click="startVoiceInput"
          class="control-button voice-button"
        >
          {{ isVoiceSupported ? '🎤 语音输入' : '当前平台不支持语音输入' }}
        </button>

        <!-- 显示识别结果 -->
        <text v-if="recognizedText" class="result-text">你说的是：{{ recognizedText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app';
import DHIframe from '@bddh/starling-dhiframe';
const dhIframe = new DHIframe('digital-human-iframe'); 

// ===== 状态定义 =====
const renderUrl = ref('https://statich.shanyitong.com/guide-h5/shuzi/index.html')
const isWebViewLoaded = ref(false)
const userInteracted = ref(false)
const hasPlayedIntro = ref(false)
const recognizedText = ref('')

// 平台与能力检测
let currentPlatform = ''
const isVoiceSupported = ref(false)

// 配置
const figureId = 'A2A_V2-3to2_meihan'
const autoChromaKey = true
const token = 'i-rksrpasm77yub/e811c01458b05142647fc227d231aa4723f9bd8faf842b6f2e526ac71b83dbde/2139-12-18T18:13:56.236Z'
const initText = '你好，这是我的开场白自我介绍，我是数字人'

// ===== 工具函数 =====
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const getWebViewContext = () => {
  try {
    if (currentPlatform === 'weixin' || currentPlatform === 'devtools' ) {
      const context = uni.createWebViewContext('digital-human-iframe')
      return context && typeof context.postMessage === 'function' ? context : null
    }
  } catch (error) {
    console.warn('创建 WebView 上下文失败:', error)
  }
  return null
}

// ===== 生命周期 =====
onLoad(() => {
  // const sysInfo = uni.getSystemInfoSync()
  // currentPlatform = sysInfo.uniPlatform || 'h5'
  // // currentPlatform = sysInfo.platform || 'h5'
  // isVoiceSupported.value = ['weixin', 'app'].includes(currentPlatform)

  // const encodedText = encodeURIComponent(initText)
  // renderUrl.value = `https://open.xiling.baidu.com/cloud/realtime?token=${token}&initMode=noAudio&cameraId=0&figureId=${figureId}&autoChromaKey=${autoChromaKey}&initText=${encodedText}&platform=${currentPlatform}&message=${encodedText}`
  // console.log('渲染链接:', renderUrl.value)
})

// ===== Webview 加载完成 =====
const onWebViewLoad = () => {
  console.log('web-view 加载完成')
  // isWebViewLoaded.value = true;
  // setTimeout(()=>{
  //   const encodedText= '你好，这是我的开场白自我介绍，我是数字人'
  //   // sendDigitalHumanMessage('你好数字人')；
  //   const webViewContext = uni.createWebViewContext('digital-human-iframe')
  //     webViewContext.postMessage({
  //       data: {
  //         action: 'TEXT_RENDER',
  //         text: '你好，这是我的开场白自我介绍，我是数字人你好，这是我的开场白自我介绍，我是数字人你好，这是我的开场白自我介绍，我是数字人'
  //       }
  //     })
  //     // uni.postMessage({
  //     //   data: {
  //     //     action: 'TEXT_RENDER',
  //     //     text: '你好，这是我的开场白自我介绍，我是数字人你好，这是我的开场白自我介绍，我是数字人你好，这是我的开场白自我介绍，我是数字人'
  //     //   }
  //     // })
  //   // uni.postMessage({
  //   //   data: {
  //   //     action: 'TEXT_RENDER',
  //   //     text: messageText
  //   //   }
  //   // });
  //   //  renderUrl.value = `https://open.xiling.baidu.com/cloud/realtime?token=${token}&initMode=noAudio&cameraId=0&figureId=${figureId}&autoChromaKey=${autoChromaKey}&initText=${encodedText}&platform=${currentPlatform}&message=${encodedText}`
  //   // console.log('渲染链接:', renderUrl.value)
  //   },10000)
  
}

// ===== 激活音频（用户点击）=====
const activateAudio = () => {
  userInteracted.value = true

  // 延迟一点确保 WebView 已准备好
  setTimeout(() => {
    if (isWebViewLoaded.value && !hasPlayedIntro.value) {
      sendDigitalHumanMessage(initText)
      hasPlayedIntro.value = true
    }
  }, 300)
}

// ===== 发送消息核心函数 =====
const sendDigitalHumanMessage = (text='nihao，我是小途') => {
  // if (!text || !isWebViewLoaded.value) {
  //   console.warn('数字人未就绪或文本为空')
  //   return
  // }
  let requestId = generateUUID()
  console.log("----------------------", requestId)
  const message = {
    action: 'TEXT_RENDER',
    body: '数字人未就绪或文本为空',
    // requestId: requestId
  }

  try {
    if (currentPlatform === 'h5') {
      const iframe = document.getElementById('digital-human-iframe')
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(message, '*')
      }
    } else if (currentPlatform === 'weixin' || currentPlatform === 'devtools') {
      console.log("------------1----")
      const webViewContext = getWebViewContext()
      if (webViewContext) {
        webViewContext.postMessage({ data: message })
         console.log("------------2----")
      } else {
        uni.postMessage?.({ data: message })
        console.log("------------3----")
      }
    } else {
      console.log("------------4----",currentPlatform)
      uni.postMessage?.({ data: message })
    }
    console.log(`${currentPlatform}：发送消息 ->`, text)
  } catch (err) {
    console.error('发送失败', err)
  }
}

// ===== 消息接收 =====
const handleWebViewMessage = (e) => {
  const data = e.detail?.data
  const message = Array.isArray(data) ? data[0] : data
  if (!message) return

  if (message.action === 'FINISHED') {
    console.log('数字人播报完成')
  } else if (message.action === 'ERROR') {
    console.error('数字人错误:', message.body)
  }
}

// ===== 按钮方法 =====
const speakFixed = () => {
  sendDigitalHumanMessage('你好，我是小途')
}

const startVoiceInput = () => {
  if (!isVoiceSupported.value) {
    uni.showToast({ title: '当前平台不支持语音输入', icon: 'none' })
    return
  }

  recognizedText.value = '正在识别...'

  uni.showModal({
    title: '语音输入',
    content: '请开始说话，最长5秒',
    success: (res) => {
      if (res.confirm) {
        startRecording()
      }
    }
  })
}

const startRecording = () => {
  uni.startRecord({
    success: () => {
      setTimeout(() => uni.stopRecord(), 5000)
    },
    fail: (err) => {
      console.error('录音失败', err)
      recognizedText.value = '录音失败，请重试'
      uni.showToast({ title: '录音失败', icon: 'error' })
    }
  })

  uni.onVoiceRecordEnd((res) => {
    const { tempFilePath } = res
    if (!tempFilePath) {
      recognizedText.value = '未检测到语音'
      return
    }

    uni.translateVoice({
      filePath: tempFilePath,
      success: (translateRes) => {
        const text = translateRes.result.trim()
        recognizedText.value = text || '未识别到有效内容'
        if (text) {
          sendDigitalHumanMessage(text)
        }
      },
      fail: (err) => {
        console.error('语音识别失败', err)
        recognizedText.value = '识别失败，请重试'
        uni.showToast({ title: '识别失败', icon: 'error' })
      }
    })
  })
}

// 暴露方法
defineExpose({
  speak: sendDigitalHumanMessage
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 50vh;
  background-color: #f5f5f5;
  position: relative;
  box-sizing: border-box;
  overflow: visible; /* 确保子元素不被裁剪 */
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%; /* 与父容器同高 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 确保在最上层 */
  pointer-events: none;
}

/* 确保 web-view 层级低于覆盖层 */
::v-deep #digital-human-iframe {
  width: 100%;
  height: 600rpx;
  position: relative;
  z-index: 1;
}

.start-overlay,
.controls-overlay {
  pointer-events: auto;
  /* 其他样式保持不变 */
}
.start-button,
.control-button {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  margin: 0;
}

.voice-button {
  margin-top: 12px;
}

.result-text {
  margin-top: 20rpx;
  color: #666;
  font-size: 28rpx;
  text-align: center;
  width: 100%;
  word-break: break-all;
  padding: 0 20rpx;
}
</style>