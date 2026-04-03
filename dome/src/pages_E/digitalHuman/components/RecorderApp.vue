<template>
	<view class="record-button-container"  @touchstart="onStartRecord"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd">
		<!-- 录音按钮 -->
		<view class="reText">{{buttonText}}</view>
		<!-- 弹窗提示 -->
		<view v-if="showPopup" class="recording-popup" >
			<view class="popup-content">
				<view class="popup-content-text">{{popupText}}</view>
				<view class="popupView" :style="{background:isSlideOut?'#FF3C2F':'#0066FF'}">
					<image class="popupView-img" :src="imgUrl+'static/seekp_icon.gif'" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import uploadFile from '@/utils/upload' // 您的封装的 uni.uploadFile
	const emits = defineEmits(["change"]);
	/**录音实例 */
	const recorderManager = uni.getRecorderManager()
	const buttonText = ref('按住说话');
	const popupText = ref('松手发送，上移取消')
	const showPopup = ref(false);
	let startRecordStamp = 0;
	const isRecording = ref(false);
	const startY = ref(0);
	const isSlideOut = ref(false);
	const isLocked = ref(false);
	const RECORD_COOLDOWN = 1000;
	
	/**录音状态 */
	const recordState = ref('stop')
	
	/**开始录音 */
	const onStartRecord = (e: TouchEvent) => {
	  console.log('开始录音')
	  if (isLocked.value) return;
	  startY.value = e.touches[0].clientY;
	  isRecording.value = true;
	  isSlideOut.value = false
	  popupText.value = '松手发送，上移取消'
	  try {
		  // #ifdef APP-HARMONY
			recorderManager.start({
			  format:'m4a', // aac,wav,m4a(百度语音识别目前直客使用m4a)
			  duration: 60000,
			  sampleRate: 16000,    // 8k/16k/48k 都行，按业务选
			  numberOfChannels: 1,
			  encodeBitRate: 48000 ,
			  frameSize: 50,
			})
		  // #endif
		  // #ifdef MP-WEIXIN
			recorderManager.start({
			  format:'pcm',
			  duration: 60000,
			  sampleRate: 16000,
			  numberOfChannels: 1,
			  encodeBitRate: 24000 ,
			  frameSize: 50,
			})
		  // #endif
	    
		showPopup.value = true;
	  } catch (error) {
	    console.log('录音失败', error)
	  }
	}
	
	const onTouchMove = (e: TouchEvent) => {
	  if (!isRecording.value) return
	  const currentY = e.touches[0].clientY
	  const moveY = startY.value - currentY // 向上为正
	
	  if (moveY > 60) {
	    if (!isSlideOut.value) {
	      isSlideOut.value = true
	      popupText.value = '松手取消'
	    }
	  } else {
	    if (isSlideOut.value) {
	      isSlideOut.value = false
	      popupText.value = '松手发送，上移取消'
	    }
	  }
	}

	const onTouchEnd = (e: TouchEvent) => {
	  console.log("onTouchEnd");
	  if (!isRecording.value) return;
	  isLocked.value = true;
	  
	  if (isSlideOut.value) {
	    cancelRecord();
	  } else {
	    stopRecord();
	  }

	  setTimeout(() => {
	    isLocked.value = false;
	  }, RECORD_COOLDOWN);
	}
	
	// 取消录音
	const cancelRecord = () => {
	  if (!isRecording.value) return
	  isRecording.value = false
	  showPopup.value = false
	  buttonText.value = '按住说话'
	
	  recorderManager.stop()
	}
	
	/**结束录音 */
	const stopRecord = () => {
	  if (!isRecording.value) return
	  isRecording.value = false
	  showPopup.value = false
	  buttonText.value = '按住说话'
	
	  recorderManager.stop()
	}
	
	/** 开始录音 */
	recorderManager.onStart((res) => {
	  console.log('recorder start' + JSON.stringify(res))
	  recordState.value = 'recording'
	  startRecordStamp = new Date().getTime()
	})
	
	/** 结束录音 */
	recorderManager.onStop((res) => {
	  console.log('recorder stop' + JSON.stringify(res))
	  recordState.value = 'stop'
	  const duration = new Date().getTime() - startRecordStamp
	  if (duration < 1000 || res.duration < 1000) {
	    uni.showToast({
	      title: '录音时间太短',
	      icon: 'none',
	    })
	    return
	  }
	  console.log('---------结果------------',res);
	  console.log('---------结果------------',isSlideOut.value);
	  if(!isSlideOut.value){
		  console.log('-------');
		  uploadFile({
		  	url: '/file/upload', // 替换为您的上传接口
		  	filePath:res.tempFilePath,
		  }).then(res=>{
			  console.log('---------res-----res-------',res);
		  }).catch(err=>{
			  console.log('---------err-------err-----',err);
		  })
		  emits('change',{
		    success: true,
		    filePath: res.tempFilePath,
		    voiceState:'录音',
		    duration:res.duration || duration,
		    size: res.size
		  });
		  
	  }
	  
	  
	})
	
	/** 录音出错 */
	recorderManager.onError((res) => {
	  console.log('recorder error', res)
	  recordState.value = 'stop'
	  if (uni.getSystemInfoSync().uniPlatform != 'mp-weixin') {
	    uni.showToast({
	      title: '录音失败',
	      icon: 'none',
	    })
	  } else {
	    if (res.errMsg == 'operateRecorder:fail auth deny') {
	      uni.showToast({
	        title: '录音失败',
	        icon: 'none',
	      })
	    }
	  }
	})
</script>

<style scoped lang="scss">
	.popupView{
		width: 690rpx;
		height: 120rpx;
		background: red;
		border-radius: 30rpx;
		.popupView-img{
			width: 650rpx;
			height: 120rpx;
		}
	}
	.record-button-container {
		width: 100%;
		position: relative;
		display: inline-block;
	}
	.reText{
		// width: 655rpx;
		text-align: center;
		font-weight: bold;
		font-size: 32rpx;
		color: #333333;
	}
	
	.recording-popup {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		z-index: 100;
	}
	
	.popup-content {
		width: 100%;
		height: 320rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		// background: #FFFFFF;
		
		.popup-content-line {
			width: 194rpx;
			height: 30rpx;
		}
	
		.popup-content-text {
			font-weight: 500;
			font-size: 26rpx;
			color: #666666;
			padding: 32rpx 0;
		}
	
		.popup-content-icon {
			width: 216rpx;
			height: 216rpx;
		}
	}
</style>
