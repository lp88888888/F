<template>
	<view class="record-button-container" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
		@touchcancel="onTouchEnd">
		<!-- @touchstart="startRecord"
					@touchmove="handleTouchMove" @touchend="handleTouchEnd" @touchcancel="handleTouchCancel" -->
		<!-- 录音按钮 -->
		<view class="reText">{{buttonText}}</view>
		<!-- 弹窗提示 -->
		<view v-if="showPopup" class="recording-popup" >
			<view class="popup-content">
				<image  class="popup-content-backg" :src="`${imgUrl}static/dh_sp_back.png`" mode=""></image>
				<image class="popup-content-line" :src="imgUrl+'static/dh_sp_line.png'" mode=""></image>
				<view class="popup-content-text">{{popupText}}</view>
				<image class="popup-content-icon" :src="imgUrl+'static/dh_sp_see.png'" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed,onMounted } from 'vue';
	import { imgUrl } from '@/config';
	import {showToast} from '@/utils/util'
	// import { useVoiceRecorder } from './useVoiceRecorder'
	import { onLoad } from '@dcloudio/uni-app';
	const emits = defineEmits(["change"]);
	var plugin = requirePlugin("WechatSI")
	let recorderManager = plugin.getRecordRecognitionManager()
	const isRecording = ref(false)
	const isSlideOut = ref(false)
	const showPopup = ref(false)
	const popupText = ref('上滑取消')
	const isLocked = ref(false) // 防频发锁
	const hasRecordAuth = ref(false);
	let startY = 0
	const RECORD_COOLDOWN = 800
	const buttonText = ref('按住说话')
	// 开始录音
	const startRecord = () => {
	  if (isLocked.value || isRecording.value) return
	
	  isLocked.value = true
	  isRecording.value = true
	  showPopup.value = true
	  isSlideOut.value = false
	  buttonText.value = '松开发送'
	  popupText.value = '上滑取消'
	

	console.log("---------------------");
	  try {
	    recorderManager.start({
			duration: 30000,
			lang: "zh_CN"
		})
		console.log("---------22------------");
	  } catch (err) {
	    console.error('recorderManager.start failed', err)
	    isLocked.value = false
	    isRecording.value = false
	    showPopup.value = false
	    // options.onError?.(err)
	  }
	}
	
	// 停止录音（发送）
	const stopRecord = () => {
	  if (!isRecording.value) return
	  isRecording.value = false
	  showPopup.value = false
	  buttonText.value = '按住说话'
	
	  recorderManager.stop()
	}
	
	// 取消录音
	const cancelRecord = () => {
	  if (!isRecording.value) return
	  isRecording.value = false
	  showPopup.value = false
	  buttonText.value = '按住说话'
	
	  recorderManager.stop()
	}
	
	// Touch 事件
	const onTouchStart = async (e: TouchEvent) => {
		// emits('change',{
		//   success: true,
		//   filePath: 'siskosksos',
		//   voiceState:'积分',
		// 	duration:2324,
		//    size: 223223
		// });
		// return
		try {
			await checkRecordPermission() // 先检查权限
			console.log(hasRecordAuth.value);
			if (!hasRecordAuth.value) return
			if (isLocked.value) return
			startY = e.touches[0].clientY
			startRecord()
		} catch (error) {
			console.error('录音权限异常', error)
		}
		
	}
	
	const onTouchMove = (e: TouchEvent) => {
	  if (!isRecording.value) return
	  const currentY = e.touches[0].clientY
	  const moveY = startY - currentY // 向上为正
	
	  if (moveY > 60) {
	    if (!isSlideOut.value) {
	      isSlideOut.value = true
	      popupText.value = '松手取消'
	    }
	  } else {
	    if (isSlideOut.value) {
	      isSlideOut.value = false
	      popupText.value = '上滑取消'
	    }
	  }
	}
	
	const onTouchEnd = (e: TouchEvent) => {
		  console.log("onTouchEnd");
	  if (!isRecording.value) return
	  if (isSlideOut.value) {
	    cancelRecord()
	  } else {
	    stopRecord()
	  }
	
	  // 冷却期
	  setTimeout(() => {
	    isLocked.value = false
	  }, RECORD_COOLDOWN)
	}
	const initRecord= ()=> {
		console.log('------------------');
		recorderManager.onStart = (res)=> {
			console.log("正在录音",res);
			// voiceState.value = "onStart:" + res.msg + "正在录音"
		};
		//有新的识别内容返回，则会调用此事件  
		recorderManager.onRecognize = (res) => {
			// voiceState.value = res.result;
		}
		// 识别结束事件  
		recorderManager.onStop = (res) => {
			  console.log('-----',res);
		  if (!res.tempFilePath) {
			showToast('发送失败')
		    return
		  }
		
		  const duration = res.duration || 0
		  if (duration < 800) {
		    // 太短，视为误触取消
			showToast('时间太短')
			console.log('视为误触取消');
		    return
		  }
		
		  if (isSlideOut.value) {
			  showToast('取消发送')
			  console.log('取消发送');
		    
		  } else {
			  console.log('成功发送',res);
			   
			  emits('change',{
				  success: true,
				  filePath: res.tempFilePath,
				  voiceState: res.result,
					duration:res.duration,
				   size: res.fileSize
			  });
		  
		  }
		}
		// 识别错误事件  
		// 监听错误
		recorderManager.onError = (err) => {
		  console.error('RecorderManager Error:', err)
		  isRecording.value = false
		  showPopup.value = false
		  isLocked.value = false
		  showToast(err.msg)
		  if(err.retcode= 30011){
			  cancelRecord()
			  recorderManager.stop()
		  }
			
		}
	}
	const checkRecordPermission = () => {
	  return new Promise((resolve, reject) => {
	    // 1. 检查当前平台是否支持录音 API
	    if (!uni.getRecorderManager && !uni.startRecord) {
	      uni.showToast({ title: '当前环境不支持录音', icon: 'none' })
	      reject(new Error('不支持录音'))
	      return
	    }
	
	    // 2. 获取权限设置
	    uni.getSetting({
	      success: (res) => {
	        const isAuth = res.authSetting['scope.record'] ?? res.authSetting['scope.recordAudio'] ?? false
	        if (isAuth) {
	          // 已授权
	          hasRecordAuth.value = true
	          resolve(true)
	        } else {
	          // 未授权，申请权限
	          uni.authorize({
	            scope: 'scope.record', // 微信、QQ 等用此 scope
	            success: () => {
	              hasRecordAuth.value = false
	              resolve(true)
	            },
	            fail: () => {
	              // 用户拒绝授权
	              uni.showModal({
	                title: '需要录音权限',
	                content: '请在设置中开启录音权限，否则无法使用录音功能',
	                confirmText: '去设置',
	                success: (modalRes) => {
	                  if (modalRes.confirm) {
	                    uni.openSetting({ // 跳转设置页
	                      success: (settingRes) => {
	                        const granted = settingRes.authSetting['scope.record']
	                        // hasRecordAuth.value = granted
	                        resolve(granted)
	                      }
	                    })
	                  } else {
	                    reject(new Error('用户拒绝授权'))
	                  }
	                }
	              })
	            }
	          })
	        }
	      },
	      fail: () => {
	        reject(new Error('获取权限设置失败'))
	      }
	    })
	  })
	}
	onMounted(()=>{
		initRecord()
		checkRecordPermission().then(res =>{
			
		}).catch(err=>{})
		
	})
	// const { 
	//   isRecording, 
	//   isSlideOut, 
	//   showPopup, 
	//   popupText, 
	//   buttonText,
	//   onTouchStart,
	//   onTouchMove,
	//   onTouchEnd 
	// } = useVoiceRecorder({
	//   maxDuration: 60000,
	//   lang: 'zh_CN',
	//   onResult: (res) => {
	// 	  console.log(res);
	//     if (res.success && res.filePath) {
	//       console.log('✅ 录音完成，发送:', res.filePath, `时长:${res.duration}ms`)
	// 	  emits('change',res);
	//     } else {
	// 		// uni.showToast({ title: '录音失败,时间太短', icon: 'error' })
	//     }
	//   },
	//   onError: (err) => {
	// 	console.log('-----录音失败',err);
	//     uni.showToast({ title: '录音失败', icon: 'error' })
	//   }
	// })
</script>

<style scoped lang="scss">
	.record-button-container {
		position: relative;
		display: inline-block;
	}
	.reText{
		// width: 546rpx;
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
		height: 450rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		.popup-content-backg{
			width: 100%;
			height: 450rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
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