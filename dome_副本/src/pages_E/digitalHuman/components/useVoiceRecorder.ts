// @/composables/useVoiceRecorder.ts

import { ref, Ref } from 'vue';
import type { VoiceRecorderOptions, VoiceRecorderReturn } from '../types';
import { requestMicrophonePermission } from '@/utils/usePermission';

// 默认配置
const DEFAULT_OPTIONS: Required<VoiceRecorderOptions> = {
	maxDuration: 60000,
	format: 'aac',
	sampleRate: 16000,
	encodeBitRate: 48000,
	onResult: () => { },
	onError: (err) => console.error('录音错误:', err),
	emitStart: () => {},
	lang: '',
	
};

/**
 * 可复用的语音录音 Hook
 * 支持：App（plus.audio）、微信小程序、H5（uni.getRecorderManager）
 * 特性：滑动取消、防频发、自动冷却、权限检测、真实时长
 */
export function useVoiceRecorder(customOptions?: VoiceRecorderOptions): VoiceRecorderReturn {
  const options = { ...DEFAULT_OPTIONS, ...customOptions };

  const platform = uni.getSystemInfoSync().platform;
  const isApp = platform === 'android' || platform === 'ios';

  const isRecording = ref(false);
  const isSlideOut = ref(false);
  const showPopup = ref(false);
  const popupText = ref('上滑取消，松开结束');
  const isLocked = ref(false); // 防频繁调用锁
  const isEnd = ref(false); // 是否结束触摸


  let startY = 0;
  let startTime = 0; // 用于计算录音时长
  let currentTempPath = '';

  const RECORD_COOLDOWN = 800; // 冷却时间（防止 -13000）
  const buttonText = ref('按住说话');
  // #ifdef APP
  		buttonText.value = '按住说话';
  // #endif
  // #ifdef MP-WEIXIN
  		buttonText.value = '长按/点击说话';
  // #endif

  // ========== App 专用：plus.audio.getRecorder() 实例 ==========
  let plusRecorder: any = null;
  if (isApp) {
    try {
      plusRecorder = plus.audio.getRecorder();
    } catch (e) {
      console.error('初始化 plus.audio 录音器失败', e);
    }
  }

  // ========== 获取音频真实时长（毫秒）==========
  function getAudioDuration(filePath: string): Promise<number> {
    return new Promise((resolve) => {
      if (!filePath) return resolve(0);
      try {
        const player = plus.audio.AudioPlayer();
        player.setDataSource(
          filePath,
          () => {
            const duration = player.getDuration(); // 单位：秒
            player.release();
            resolve(Math.round(duration * 1000)); // 转为毫秒
          },
          () => {
            player.release();
            resolve(0);
          }
        );
        player.load();
      } catch (e) {
        console.error('获取音频时长失败', e);
        resolve(0);
      }
    });
  }

  // ========== 开始录音 ==========
  const startRecord = async () => {
	  options.emitStart?.()
	  const hasPermission = await requestMicrophonePermission();
	  if (!hasPermission) {
	    uni.showToast({ title: '未获取麦克风权限', icon: 'none' });
	    return;
	  }
    if (isLocked.value || isRecording.value) return;
    if (!isEnd.value) return;

    isLocked.value = true;
    isRecording.value = true;
    showPopup.value = true;
    isSlideOut.value = false;
    buttonText.value = '松开发送';
    popupText.value = '上滑取消，点击/松开结束';

    currentTempPath = '';
    startTime = Date.now();

    try {
      if (isApp && plusRecorder) {
        // App 使用 plus.audio
        const recordOptions = {
          samplerate: String(options.sampleRate),
          channels: 1,
          bitrate: String(options.encodeBitRate),
          format: options.format,
          maxDuration: options.maxDuration,
        };

        plusRecorder.record(
          recordOptions,
          async (path: string) => {
            if (!path) return;

            currentTempPath = path;
            const endTime = Date.now();
            const duration = endTime - startTime;

            // 获取文件大小
            uni.getFileInfo({
              filePath: path,
              success: (infoRes) => {
				  
                const size = infoRes.size;
				handleStopOrCancel(false, path, duration, size);
                // 获取精确时长
                // getAudioDuration(path).then((realDuration) => {
                //   const finalDuration = realDuration > 0 ? realDuration : duration;
                //   handleStopOrCancel(false, path, finalDuration, size);
                // });
              },
              fail: () => {
                handleStopOrCancel(false, path, duration, 0);
              },
            });
          },
          (error: any) => {
            console.error('plus.audio 录音失败sdd', error);
            isRecording.value = false;
            showPopup.value = false;
            isLocked.value = false;
            options.onError?.(error);
          }
        );
      } else {
        // 小程序/H5 使用 uni.getRecorderManager()
        const recorderManager = uni.getRecorderManager();
        const recordOptions = {
          duration: options.maxDuration,
          sampleRate: options.sampleRate,
          numberOfChannels: 1,
          encodeBitRate: options.encodeBitRate,
          format: options.format,
        };

        // 解绑旧监听，防止重复触发
        recorderManager.onStop(null);

        recorderManager.onStop((res) => {
          currentTempPath = res.tempFilePath;
          const duration = res.duration || (Date.now() - startTime);
          const size = res.fileSize || 0;
          handleStopOrCancel(false, res.tempFilePath, duration, size);
        });

        recorderManager.onError((err) => {
          console.error('recorderManager.onError', err);
          options.onError?.(err);
          isRecording.value = false;
          showPopup.value = false;
          isLocked.value = false;
        });

        recorderManager.start(recordOptions);
      }
    } catch (err) {
      console.error('启动录音失败', err);
      options.onError?.(err);
      isRecording.value = false;
      showPopup.value = false;
      isLocked.value = false;
    }
  };

  // ========== 停止录音（发送）==========
  const stopRecord = () => {
    if (!isRecording.value) return;
	// showPopup.value = false;
    let stopTimer: ReturnType<typeof setTimeout> | null = null;
    if (isApp && plusRecorder) {
      plusRecorder.stop(); // ✅ 正确：调用 recorder 实例的 stop()
      // #ifdef APP-PLUS
		  stopTimer && clearTimeout(stopTimer);
		  stopTimer = setTimeout(() => {
			if (!isRecording.value) return;          // 已经走成功回调了
			console.warn('录音 stop 回调超时，强制回收');
			try { plusRecorder.stop(); } catch {}    // 再调一次无妨
			handleStopOrCancel(true, '', 0, 0);      // 标记为失败
		  }, 800);
      // #endif
      
    } else {
      uni.getRecorderManager().stop();
    }
  };
  // ========== 取消录音（上滑取消）==========
  const cancelRecord = () => {
    if (!isRecording.value) return;

    if (isApp && plusRecorder) {
      plusRecorder.stop(); // ✅ 同样使用 stop()
    } else {
      uni.getRecorderManager().stop();
    }
  };

  // ========== 统一处理录音结果 ==========
  function handleStopOrCancel(cancelled: boolean, path: string, duration: number, size: number) {
    if (!isRecording.value) return;
    isRecording.value = false;
    showPopup.value = false;
    
	// #ifdef APP
			buttonText.value = '按住说话';
	// #endif
	// #ifdef MP-WEIXIN
			buttonText.value = '长按说话';
	// #endif
	
    // 判断是否太短（误触）
    if (duration < 800) {
      options.onResult?.({
        success: false,
        cancelled: true,
        filePath: path,
        duration,
        size,
      });
      setTimeout(() => (isLocked.value = false), RECORD_COOLDOWN);
      return;
    }

    if (cancelled || isSlideOut.value) {
      options.onResult?.({
        success: false,
        cancelled: true,
        filePath: path,
        duration,
        size,
      });
    } else {
      options.onResult?.({
        success: true,
        filePath: path,
        duration,
        size,
      });
    }
    // 冷却解锁
    setTimeout(() => {
      isLocked.value = false;
    }, RECORD_COOLDOWN);
  }

  // ========== Touch 事件 ==========
  const onTouchStart = async (e: TouchEvent) => {
	const hasPermission = await requestMicrophonePermission();
	if (!hasPermission) {
	  uni.showToast({ title: '未获取麦克风权限', icon: 'none' });
	  return;
	}
  if (isLocked.value) return;
    startY = e.touches[0].clientY;
    isEnd.value = true;
    // #ifdef APP-PLUS
      setTimeout(() => {
        if (!isEnd.value) return;
        startRecord();
      }, 200);
    // #endif
    // #ifdef MP-WEIXIN
      startRecord();
    // #endif
    // setTimeout(() => {
		// if (!isEnd.value) return;
    //   startRecord();
    // }, 200);
    // await startRecord();
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isRecording.value) return;
    const currentY = e.touches[0].clientY;
    const moveY = startY - currentY; // 向上为正

    if (moveY > 60) {
      if (!isSlideOut.value) {
        isSlideOut.value = true;
        popupText.value = '松手取消';
      }
    } else {
      if (isSlideOut.value) {
        isSlideOut.value = false;
        popupText.value = '上滑取消';
      }
    }
  };

  const onTouchEnd = () => {
	  isEnd.value = false;
    console.log('=========isRecording=============', isRecording.value)
    console.log('=========isSlideOut=============', isSlideOut.value)
    if(!isRecording.value && !isSlideOut.value){
      console.log('object', '录音结束')
      isEnd.value = false;
	  // stopRecord
      cancelRecord();
	  stopRecord();
      return
    }
    if (!isRecording.value) return;
    if (isSlideOut.value) {
      cancelRecord();
	  isEnd.value = false;
    } else {
      stopRecord();
	  isEnd.value = false;
    }
  };
  const emitStart = ()=>{
	  console.log('-----------开始录音l-------------');
  }

  return {
    isRecording,
    isSlideOut,
    showPopup,
    popupText,
    buttonText,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    startRecord,
    stopRecord,
    cancelRecord,
	emitStart,
  };
}