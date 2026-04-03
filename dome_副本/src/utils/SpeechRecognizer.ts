/**
 * 百度语音识别通用服务类
 * * 策略说明：
 * 1. 微信小程序：使用 WebSocket 实时流式识别 (PCM 格式)
 * 2. 鸿蒙系统：受限于 Uni-app 在鸿蒙上无法实时获取录音帧，采用录音结束后“整段读取+单次发送”策略
 * 3. 安卓/iOS：调用 HTML5+ 原生 plus.speech 接口，性能和稳定性最优
 */

export interface RecognizerOptions {
  appId?: number;     
  appKey?: string;    
  initTimeout?: number;  // 启动后多长时间没说话自动停止 (默认10s)
  pauseTimeout?: number; // 说话停顿多长时间后自动停止 (默认1s)
  onPartialResult?: (text: string) => void; // 收到中间识别结果的回调
  onFinalResult?: (text: string) => void;   // 收到最终识别结果的回调
  onStatusChange?: (isRecording: boolean, hasSpoken: boolean) => void; // 录音状态变更回调
  onError?: (err: any) => void; 
}

export class SpeechRecognizer {
  // 默认百度语音 ASR 配置（建议生产环境通过 options 传入自己的 key）
  private static readonly DEFAULT_APP_ID = 121120321;
  private static readonly DEFAULT_APP_KEY = "LHCqobhrVzQnlUowcLwTTq1V";

  private socketTask: any = null;      // WebSocket 实例
  private recorderManager: any = null; // Uni-app 全局唯一的录音管理器
  private silenceTimer: any = null;    // 自动停止定时器
  
  public isRecording = false;          // 标识：是否正在录音
  public hasSpoken = false;            // 标识：当前识别周期内是否已经产生了文字
  private isSocketOpened = false;      // 标识：WebSocket 是否已连接

  constructor(private options: RecognizerOptions = {}) {
    this.options.appId = options.appId || SpeechRecognizer.DEFAULT_APP_ID;
    this.options.appKey = options.appKey || SpeechRecognizer.DEFAULT_APP_KEY;
    this.options.initTimeout = options.initTimeout || 10000;
    this.options.pauseTimeout = options.pauseTimeout || 1000;

    this.initRecorder();
  }

  /**
   * 初始化录音管理器并绑定全局监听
   */
  private initRecorder() {
    this.recorderManager = uni.getRecorderManager();
      
    // 【实时流模式】监听录音帧（每隔一段时间产生一段二进制音频）
    this.recorderManager.onFrameRecorded((res: any) => {
      // 仅在非鸿蒙环境下生效：将音频切片实时通过 WebSocket 发往百度
      if (this.isRecording && this.socketTask && this.isSocketOpened && res.frameBuffer && res.frameBuffer.byteLength > 0) {
        this.socketTask.send({ data: res.frameBuffer });
      }
    });
  
    // 监听录音停止事件
    this.recorderManager.onStop((res: any) => {
      this.clearAllTimers();
      
      // #ifdef APP-HARMONY
      // 鸿蒙环境特有逻辑：录音停止后才拿到 tempFilePath，此时进行一次性识别处理
      this.handleHarmonyUpload(res.tempFilePath);
      // #endif
      
      // #ifndef APP-HARMONY
      // 非鸿蒙环境（如微信）：录音停止意味着流结束，发送结束帧给百度
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

  /**
   * 重置静音自动停止计时器
   * @param duration 毫秒数
   */
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

  /**
   * 开启语音识别入口
   */
  public async start() {
    if (this.isRecording) return;

    // 1. 权限检查
    const hasAuth = await this.checkPermission();
    if (!hasAuth) return;

    this.hasSpoken = false;
    this.isRecording = true;
    this.options.onStatusChange?.(true, false);
    
    // 设置初始超时：如果 10s 内不说话则自动关闭
    this.resetAutoStopTimer(this.options.initTimeout!);

    // 场景 A：鸿蒙 App 环境
    // #ifdef APP-HARMONY
    console.log('[Speech] 鸿蒙环境：启动录音管理器，等待 onStop 触发识别');
    this.recorderManager.start({
      format: 'wav',  // 鸿蒙环境下建议 wav 或 mp3
      duration: 60000, 
      sampleRate: 16000,    
      numberOfChannels: 1,
      frameSize: 10   // 此处 frameSize 在鸿蒙下通常无效
    });
    return; 
    // #endif

    // 场景 B：安卓 / iOS 原生 App 环境
    // #ifdef APP-PLUS
    console.log('[Speech] 安卓/iOS 原生环境：调用系统原生语音接口');
    this.startPlusSpeech();
    return; 
    // #endif

    // 场景 C：微信小程序 / H5 环境
    // #ifndef APP-PLUS
    this.connectWebSocket();
    // #endif
  }

  /**
   * 调用 HTML5+ 原生语音识别 (iOS/Android)
   * 百度原生 SDK 会自动处理录音、降噪和网络传输，效果最稳
   */
  private startPlusSpeech() {
    // @ts-ignore
    if (typeof plus === 'undefined') {
      console.error('[Speech] 未找到 plus 对象');
      return;
    }

    // @ts-ignore
    plus.speech.startRecognize({
      engine: 'baidu',
      lang: 'zh-cn',
      userInterface: false, // 不显示原生弹窗
      continue: true,      // 连续识别
      vadEos: 500,         // 语音终点检测灵敏度
      nbest: 1,
      punctuation: true,   // 是否带标点
      interimResults: true // 是否返回临时中间结果
    }, (res: string) => {
      this.hasSpoken = true;
      this.options.onStatusChange?.(true, true);
      this.resetAutoStopTimer(this.options.pauseTimeout!); // 每次说话重置“停顿超时”
      
      this.options.onPartialResult?.(res);
      this.options.onFinalResult?.(res);
    }, (err: any) => {
      console.error('【严重报错】原生语音识别报错:', err);
      this.options.onError?.(err);
      this.stop();
    });
  }

  /**
   * 连接百度语音 WebSocket 接口
   * @param onReadyCallback 连接成功且握手后的回调
   */
  private connectWebSocket(onReadyCallback?: () => void) {
    this.socketTask = uni.connectSocket({
      url: `wss://vop.baidu.com/realtime_asr?sn=${Date.now()}`,
      success: () => console.log('[Speech] WebSocket Connecting...')
    });

    this.socketTask.onOpen(() => {
      this.isSocketOpened = true;
      this.sendStartFrame(); // 发送百度要求的 START 帧（配置参数）
      
      if (onReadyCallback) {
        // 鸿蒙模式：握手成功后直接上传已录好的整段音频
        onReadyCallback();
      } else {
        // 普通流模式：握手成功后开启录音机，不断触发 onFrameRecorded
        this.recorderManager.start({
          format: 'pcm', 
          duration: 600000,      
          sampleRate: 16000,     
          numberOfChannels: 1,   
          frameSize: 4           // 每 4kb 触发一次帧回调
        });
      }
    });

    // 监听百度服务端回传的消息
    this.socketTask.onMessage((res: any) => {
      try {
        const data = JSON.parse(res.data);
        // MID_TEXT: 中间结果，FIN_TEXT: 最终识别结果
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
        
        // #ifdef APP-HARMONY
        // 鸿蒙补丁：因为是一次性上传，收到 FIN_TEXT 意味着全过程结束
        if (data.type === 'FIN_TEXT') {
            uni.hideLoading();
            this.isRecording = false;
            this.options.onStatusChange?.(false, this.hasSpoken);
            this.closeSocket();
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
      console.error('【严重报错】WebSocket底层报错:', err);
      this.options.onError?.(err);
    });
  }

  /**
   * 鸿蒙专供：从文件系统中读取录音文件并单次推送至 WebSocket
   */
  private handleHarmonyUpload(filePath: string) {
      uni.showLoading({ title: '正在转写文字...' });
      
      this.connectWebSocket(() => {
        const fs = uni.getFileSystemManager();
        fs.readFile({
          filePath: filePath,
          success: (readRes: any) => {
            console.log('[Speech] 鸿蒙文件读取成功，大小:', readRes.data.byteLength);
            
            // 1. 发送全量二进制音频数据
            this.socketTask.send({ 
              data: readRes.data,
              success: () => {
                console.log('[Speech] 录音数据发送成功，准备发送 FINISH');
                // 2. 数据发完后，紧跟一个 FINISH 帧告知服务端开始转写
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

  /**
   * 停止录音/识别
   */
  public stop() {
    this.clearAllTimers();
    
    // 场景 A：原生环境
    // #ifdef APP-PLUS
    // @ts-ignore
    if (typeof plus !== 'undefined') plus.speech.stopRecognize();
    this.isRecording = false;
    this.options.onStatusChange?.(false, this.hasSpoken);
    return;
    // #endif

    // 场景 B：小程序/鸿蒙
    if (this.isRecording && this.recorderManager) {
      // 调用 stop 会触发 initRecorder 中的 onStop 监听
      this.recorderManager.stop(); 
    } else {
      this.closeSocket();
      this.isRecording = false;
      this.options.onStatusChange?.(false, this.hasSpoken);
    }
  }

  /**
   * 发送百度的握手 START 帧
   */
  private sendStartFrame() {
    if (!this.socketTask || !this.isSocketOpened) return;
    this.socketTask.send({
      data: JSON.stringify({
        type: "START",
        data: {
          appid: this.options.appId,
          appkey: this.options.appKey,
          dev_pid: 15372, // 15372 代表普通话（有标点）
          cuid: this.getUUID(),
          format: "pcm",  // 虽然鸿蒙录的是 wav，但 wav 只是在 pcm 前面多了个头
          sample: 16000   // 百度要求采样率必须是 16000
        }
      })
    });
  }

  /**
   * 发送结束 FINISH 帧
   */
  private sendFinishFrame() {
      if (this.socketTask && this.isSocketOpened) {
        this.socketTask.send({
          data: JSON.stringify({ type: "FINISH" }),
          success: () => {
            console.log('[Speech] FINISH 帧发送成功');
          }
        });
      }
    }

  /**
   * 关闭 WebSocket
   */
  private closeSocket() {
    if (this.socketTask) {
      this.socketTask.close();
      this.socketTask = null;
      this.isSocketOpened = false;
    }
  }

  /**
   * 生成唯一机器标识符 (cuid)
   */
  private getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * 麦克风权限校验
   */
  private async checkPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      // 微信小程序需要明确调起授权框
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

      // App 端权限通常在 manifest.json 声明，由系统自动触发，此处直接放行
      // #ifdef APP-HARMONY || APP-PLUS
      resolve(true); 
      // #endif
    });
  }
}