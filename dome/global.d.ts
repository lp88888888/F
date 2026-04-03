// 扩展PageInstance类型，适配小程序平台的setData方法
declare module '@dcloudio/types' {
  interface PageInstance {
    /**
     * 小程序页面设置数据的方法
     * @param data 要设置的数据对象
     * @param callback 设置完成后的回调
     */
    setData(
      data: Record<string, any>,
      callback?: () => void
    ): void;
  }
}