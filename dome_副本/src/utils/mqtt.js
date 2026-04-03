import mqtt from 'mqtt/dist/mqtt.js'

export default class MQTTClient {
  constructor() {
    this.client = null // MQTT 客户端实例
    this.options = {
      clientId: `uniapp_client_${Math.random().toString(36).substr(2, 8)}_${new Date().getTime()}`, // 唯一 Client ID
      // username: 'your_username',
      // password: 'your_password',
      clean: true, // 清除会话（断开连接后是否保留订阅）
      keepalive: 60, // 心跳间隔（秒）
      reconnectPeriod: 1000, // 重连间隔（毫秒）
      connectTimeout: 30 * 1000 // 连接超时（毫秒）
    }
    // this.serverUrl = 'wss://mqtt.example.com:8084/mqtt' // 替换为你的 MQTT 服务器 WebSocket 地址（小程序必须用 wss）
      // #ifdef H5
      this.serverUrl = 'ws://219.144.200.109:31083/mqtt'
      // #endif
      // #ifdef MP-WEIXIN||APP-PLUS
      this.serverUrl = 'wx://219.144.200.109:31083/mqtt'
      // #endif
  }

  /**
   * 连接 MQTT 服务器
   * @param {Function} successCallback 连接成功回调
   * @param {Function} errorCallback 连接失败回调
   * @param {Function} reconnectCallback 重连回调
   */
  connect(successCallback, errorCallback, reconnectCallback) {
    // 若已连接，直接返回
    if (this.client && this.client.connected) {
      successCallback && successCallback()
      return
    }

    // 创建客户端实例
    this.client = mqtt.connect(this.serverUrl, this.options)

    // 连接成功事件
    this.client.on('connect', () => {
      console.log('MQTT 连接成功，Client ID：', this.options.clientId)
      successCallback && successCallback()
    })

    // 连接失败事件
    this.client.on('error', (err) => {
      console.error('MQTT 连接失败：', err)
      errorCallback && errorCallback(err)
    })

    // 重连事件
    this.client.on('reconnect', () => {
      console.log('MQTT 正在重连...')
      reconnectCallback && reconnectCallback()
    })

    // 断开连接事件
    this.client.on('close', () => {
      console.log('MQTT 连接已断开')
    })

    // 接收消息事件
    this.client.on('message', (topic, message) => {
      // console.log(`收到主题 ${topic} 的消息：`, message.toString())
      // 可在这里分发消息到全局或页面
      uni.$emit('mqttMessage', { topic, message: message.toString() })
    })
  }

  /**
   * 订阅主题
   * @param {String|Array} topic 要订阅的主题（单个主题字符串或主题数组）
   * @param {Function} successCallback 订阅成功回调
   * @param {Function} errorCallback 订阅失败回调
   */
  subscribe(topic, successCallback, errorCallback) {
    if (!this.client || !this.client.connected) {
      errorCallback && errorCallback(new Error('MQTT 未连接'))
      return
    }

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error('订阅主题失败：', err)
        errorCallback && errorCallback(err)
      } else {
        console.log(`订阅主题 ${topic} 成功`)
        successCallback && successCallback()
      }
    })
  }

  /**
   * 发布消息
   * @param {String} topic 要发布的主题
   * @param {String|Buffer} message 要发布的消息（字符串或 Buffer）
   * @param {Function} successCallback 发布成功回调
   * @param {Function} errorCallback 发布失败回调
   */
  publish(topic, message, successCallback, errorCallback) {
    if (!this.client || !this.client.connected) {
      errorCallback && errorCallback(new Error('MQTT 未连接'))
      return
    }

    this.client.publish(topic, message, (err) => {
      if (err) {
        console.error('发布消息失败：', err)
        errorCallback && errorCallback(err)
      } else {
        // console.log(`向主题 ${topic} 发布消息：`, message)
        successCallback && successCallback()
      }
    })
  }

  /**
   * 断开 MQTT 连接
   */
  disconnect() {
    if (this.client && this.client.connected) {
      this.client.end()
      console.log('MQTT 连接已断开')
    }
  }

  /**
   * 判断 MQTT 是否连接
   * @return {Boolean} 是否连接成功
   */
  isConnected() {
    return this.client && this.client.connected
  }
}
