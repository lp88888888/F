import { ref, Ref } from 'vue';
interface Message {
  type:'text'|'richText'|'voice';
  msgText?:string;
  isUserType?:'user'|'service';
  time?:Date|number;
  voice?:string;
  voiceState?:string
  duration?:number;
}
// 录音结果
interface VoiceRecordResult {
  success: boolean
  filePath?: string
  voiceState?:string
  duration?: number // 毫秒
  size?: number
  cancelled?: boolean
}
// 录音配置项
interface VoiceRecorderOptions {
  maxDuration?: number // 最长录音时间（ms），默认 60000 (60s)
  format?: 'aac' | 'mp3' | 'wav' // 推荐 aac，兼容性好
  lang?:string;
  sampleRate?: number // 采样率
  encodeBitRate?: number
  onResult?: (result: VoiceRecordResult) => void
  onError?: (error: any) => void
  emitStart?: (error: any) => void
  
}

// 录音 Hook 返回类型
interface VoiceRecorderReturn {
  isRecording: Ref<boolean>
  isSlideOut: Ref<boolean>
  showPopup: Ref<boolean>
  popupText: Ref<string>
  buttonText: Ref<string>
	
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: (e: TouchEvent) => void

  startRecord: () => void
  stopRecord: () => void
  cancelRecord: () => void
}
export type {
  Message,
  VoiceRecordResult,
  VoiceRecorderOptions,
  VoiceRecorderReturn
};