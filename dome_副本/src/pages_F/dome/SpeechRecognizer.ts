/**
 * 百度语音识别通用服务类
 * 微信小程序：WebSocket 实时流式识别
 * 鸿蒙系统：因底层限制，采用录音结束后一次性发送识别
 */

export interface RecognizerOptions {
  appId?: number;     
  appKey?: string;    
  initTimeout?: number;  
  pauseTimeout?: number; 
  onPartialResult?: (text: string) => void; 
  onFinalResult?: (text: string) => void;   
  onStatusChange?: (isRecording: boolean, hasSpoken: boolean) => void; 
  onError?: (err: any) => void; 
}

export class SpeechRecognizer {
  private static readonly DEFAULT_APP_ID = 121120321;
  private static readonly DEFAULT_APP_KEY = "LHCqobhrVzQnlUowcLwTTq1V";

  private socketTask: any = null;      
  private recorderManager: any = null; 
  private silenceTimer: any = null;    
  
  public isRecording = false;          
  public hasSpoken = false;            
  private isSocketOpened = false;      

  constructor(private options: RecognizerOptions = {}) {
    this.options.appId = options.appId || SpeechRecognizer.DEFAULT_APP_ID;
    this.options.appKey = options.appKey || SpeechRecognizer.DEFAULT_APP_KEY;
    this.options.initTimeout = options.initTimeout || 10000;
    this.options.pauseTimeout = options.pauseTimeout || 2000;

    this.initRecorder();
  }

  private initRecorder() {
    this.recorderManager = uni.getRecorderManager();
      
    // 监听实时录音帧（鸿蒙下这个方法会被底层直接无视）
    this.recorderManager.onFrameRecorded((res: any) => {
      if (this.isRecording && this.socketTask && this.isSocketOpened && res.frameBuffer && res.frameBuffer.byteLength > 0) {
        this.socketTask.send({ data: res.frameBuffer });
      }
    });
  
    // 监听录音停止
    this.recorderManager.onStop((res: any) => {
      this.clearAllTimers();
      
      // #ifdef APP-HARMONY
      // 鸿蒙环境：拿到录音文件后，一次性上传处理
      this.handleHarmonyUpload(res.tempFilePath);
      // #endif
      
      // #ifndef APP-HARMONY
      // 其他环境：正常关闭实时流
      this.sendFinishFrame(); 
      this.isRecording = false;
      this.options.onStatusChange?.(false, this.hasSpoken);
      // #endif
    });
  
    this.recorderManager.onError((err: any) => {
      console.error('【严重报错】录音底层报错详情:', err);
      this.stop();
      this.options.onError?.(err);
    });
  }

  private resetAutoStopTimer(duration: number) {
    this.clearAllTimers();
    this.silenceTimer = setTimeout(() => {
      console.log(`[Speech] 自动停止: ${duration}ms 无文字产出`);
      this.stop();
    }, duration);
  }

  private clearAllTimers() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  public async start() {
    if (this.isRecording) return;

    const hasAuth = await this.checkPermission();
    if (!hasAuth) return;

    this.hasSpoken = false;
    this.isRecording = true;
    this.options.onStatusChange?.(true, false);
    this.resetAutoStopTimer(this.options.initTimeout!);

    // === 鸿蒙环境特供逻辑 ===
    // #ifdef APP-HARMONY
    console.log('[Speech] 鸿蒙环境：只启动录音，停止时再发给百度');
    this.recorderManager.start({
      format: 'wav', 
      duration: 60000, // 鸿蒙最长录音60秒
      sampleRate: 16000,    
      numberOfChannels: 1,
      frameSize: 10
    });
    return; // 鸿蒙系统直接返回，不需要在此刻连WebSocket
    // #endif

    // === 微信/App 实时流正常逻辑 ===
    // #ifndef APP-HARMONY
    this.connectWebSocket();
    // #endif
  }

  // 抽出 WebSocket 连接逻辑，方便鸿蒙复用
  private connectWebSocket(onReadyCallback?: () => void) {
    this.socketTask = uni.connectSocket({
      url: `wss://vop.baidu.com/realtime_asr?sn=${Date.now()}`,
      success: () => console.log('[Speech] WebSocket Connecting...')
    });

    this.socketTask.onOpen(() => {
      this.isSocketOpened = true;
      this.sendStartFrame(); // 无论什么端，这里面都是强写 pcm 骗过百度
      
      if (onReadyCallback) {
        onReadyCallback();
      } else {
        // 非鸿蒙环境，打开录音机准备接收实时切片
        this.recorderManager.start({
          format: 'pcm', 
          duration: 600000,      
          sampleRate: 16000,     
          numberOfChannels: 1,   
          frameSize: 4           
        });
      }
    });

    this.socketTask.onMessage((res: any) => {
      try {
        const data = JSON.parse(res.data);
        if ((data.type === 'MID_TEXT' || data.type === 'FIN_TEXT') && data.result) {
          this.hasSpoken = true;
          this.options.onStatusChange?.(true, true);
          this.resetAutoStopTimer(this.options.pauseTimeout!);

          if (data.type === 'MID_TEXT') {
            this.options.onPartialResult?.(data.result); 
          } else {
            this.options.onFinalResult?.(data.result);   
          }
        }
        // 鸿蒙环境：收到最终句时，关闭 Loading
        // #ifdef APP-HARMONY
        if (data.type === 'FIN_TEXT') {
            uni.hideLoading();
            this.isRecording = false;
            this.options.onStatusChange?.(false, this.hasSpoken);
        }
        // #endif
      } catch (e) {
        console.error('[Speech] Parse error', e);
      }
    });

    this.socketTask.onClose(() => {
      this.isSocketOpened = false;
    });
    
    this.socketTask.onError((err: any) => {
      console.error('【严重报错】WebSocket底层报错详情:', err);
      this.options.onError?.(err);
    });
  }

  /**
   * 【核心大招】鸿蒙专属：读取整段录音并一次性发给百度
   */
 private handleHarmonyUpload(filePath: string) {
     uni.showLoading({ title: '正在转写文字...' });
     
     this.connectWebSocket(() => {
       const fs = uni.getFileSystemManager();
       fs.readFile({
         filePath: filePath,
         success: (readRes: any) => {
           console.log('[Speech] 鸿蒙文件读取成功，大小:', readRes.data.byteLength);
           
           // 【修改点】：确保音频流真的发出去之后，再发送 FINISH 帧
           this.socketTask.send({ 
             data: readRes.data,
             success: () => {
               console.log('[Speech] 录音数据发送成功，准备发送 FINISH');
               this.sendFinishFrame(); 
             },
             fail: (err: any) => {
               console.error('[Speech] 录音数据发送失败:', err);
               uni.hideLoading();
             }
           });
         },
         fail: (err) => {
           console.error('[Speech] 读取鸿蒙录音文件失败:', err);
           uni.hideLoading();
           this.isRecording = false;
           this.options.onStatusChange?.(false, this.hasSpoken);
         }
       });
     });
   }

  public stop() {
    this.clearAllTimers();
    if (this.isRecording && this.recorderManager) {
      this.recorderManager.stop(); // 触发 onStop -> 执行鸿蒙上传或正常结束
    } else {
      this.closeSocket();
      this.isRecording = false;
      this.options.onStatusChange?.(false, this.hasSpoken);
    }
  }

  private sendStartFrame() {
    if (!this.socketTask || !this.isSocketOpened) return;
    this.socketTask.send({
      data: JSON.stringify({
        type: "START",
        data: {
          appid: this.options.appId,
          appkey: this.options.appKey,
          dev_pid: 15372, 
          cuid: this.getUUID(),
          format: "pcm", // 👈 统一对百度声明是 pcm，过滤掉 wav 头
          sample: 16000
        }
      })
    });
  }

  private sendFinishFrame() {
      if (this.socketTask && this.isSocketOpened) {
        this.socketTask.send({
          data: JSON.stringify({ type: "FINISH" }),
          success: () => {
            console.log('[Speech] FINISH 帧发送成功，等待百度返回结果...');
            // ⚠️ 【删除了关闭连接的代码】不要在这里关闭 Socket！让百度回传数据！
          }
        });
      }
    }

  private closeSocket() {
    if (this.socketTask) {
      this.socketTask.close();
      this.socketTask = null;
      this.isSocketOpened = false;
    }
  }

  private getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  private async checkPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      // #ifdef MP-WEIXIN
      uni.authorize({
        scope: 'scope.record',
        success: () => resolve(true),
        fail: () => {
          uni.showModal({
            title: '麦克风权限未开启',
            content: '需要麦克风权限才能发送语音，请到设置中开启',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting({
                  success: () => resolve(true),
                  fail: () => resolve(false)
                });
              } else {
                resolve(false);
              }
            }
          });
        }
      });
      // #endif

      // #ifdef APP-HARMONY || APP-PLUS
      resolve(true);
      // #endif
      
      // #ifndef MP-WEIXIN || APP-HARMONY || APP-PLUS
      resolve(true);
      // #endif
    });
  }
}