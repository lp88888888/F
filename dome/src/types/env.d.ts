// 环境变量类型声明
declare namespace UniApp {
  interface Uni {
    $emit: (eventName: string, data?: any) => void;
    $on: (eventName: string, callback: (data?: any) => void) => void;
    $off: (eventName: string, callback?: (data?: any) => void) => void;
  }
}

// 扩展 Window 接口
interface Window {
  pinia?: any;
}

// 扩展 Component 实例
interface ComponentPublicInstance {
  pageTheme?: string;
}