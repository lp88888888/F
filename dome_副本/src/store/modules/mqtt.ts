import {defineStore} from 'pinia';
import MQTTClient from '@/utils/mqtt.js';
import {getTopicList, updateTopicSubscribe} from '@/api/message';

interface MqttState {
    client: MQTTClient | null;
    isConnected: boolean;
    isSubscribed: boolean; // 主订阅状态（是否完成所有必要订阅）
    currentUserTopic: string | null; // 给服务端发消息的 Topic（device/{userId}/location）
    serverSubscribeTopic: string | null; // 订阅服务端消息的 Topic（service+/123/message）
    defaultTopic: string; // 给服务端发消息的默认 Topic
    testMessage: string; // 测试消息（已转为 JSON 字符串）
    heartbeatTimer: NodeJS.Timeout | null; // 心跳定时器
    heartbeatInterval: number; // 心跳间隔（毫秒）
    topics: Array<any> //  Topic 列表
    popoverVisible: boolean;
    message: string;
    swiperInfo: Array<any>;
}

const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear();
  // 月份从 0 开始，需要 +1，且补零（比如 9 月 → 09）
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // 日期补零（比如 5 号 → 05）
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export const useMqttStore = defineStore('mqtt', {
    state: (): MqttState => {
        const userId = uni.getStorageSync('userInfo')?.id || 1234;
        return {
            client: null,
            isConnected: false,
            isSubscribed: false,
            currentUserTopic: null,
            serverSubscribeTopic: 'device/123/message', // 订阅服务端消息的 Topic
            defaultTopic: `device/${userId}/location`, // 给服务端发消息的 Topic
            testMessage: JSON.stringify({
                lat: uni.getStorageSync('address').lat || 39.9042,
                lng: uni.getStorageSync('address').lng || 116.4074,
                messageId: 'test-message-' + Date.now(),
                deviceId: 'test-device-' + Date.now(),
                timestamp: Date.now()
            }),
            heartbeatTimer: null,
            heartbeatInterval: 15 * 1000, // 15秒心跳间隔
            topics: [], //  Topic 列表
            popoverVisible:false,
            message:'',
            swiperInfo:[]
        };
    },
    actions: {
        initClient() {
            if (!this.client) {
                this.client = new MQTTClient();
                this.bindGlobalMessageListener();
            }
        },

        bindGlobalMessageListener() {
            uni.$off('mqttMessage', this.handleGlobalMessage);
            uni.$on('mqttMessage', this.handleGlobalMessage);
        },

        /**
         * 更改 Topic 订阅状态
         */
        async updateTopicSubscribe(topicCode: string, isSubscribed: number) {
            try {
                const res: any = await updateTopicSubscribe({topicCode, isSubscribed});
                if (res.code === 200) {
                    // 断开连接并重新连接
                    this.disconnect();
                    setTimeout(() => {
                        this.initMqtt()
                    }, 1000);
                }
            } catch (err) {
                console.error(`更改 Topic 订阅状态失败`, err);
            }
        },
		

        /**
         * 接收 Topic 的消息
         */
        handleGlobalMessage({topic, message}: { topic: string; message: string }) {
            try {
                console.log('收到服务端推送消息：' + message);
                this.message = message;
                this.popoverVisible=true;
                setTimeout(() => {
                    this.popoverVisible=false;
                },2000)
                let name = this.topics.find(item => item.topic == topic)?.description || '系统通知';
                this.swiperInfo.unshift({name,text: JSON.parse(message),createTime:formatDateToYMD(new Date())})
            } catch (err) {
                console.error('解析服务端消息失败：', err);
            }
        },

        async connect() {
            if (!this.client) this.initClient();
            if (this.isConnected) return true;

            return new Promise((resolve, reject) => {
                this.client?.connect(
                    () => {
                        this.isConnected = true;
                        this.isSubscribed = false;
                        console.log('MQTT 连接成功')
                        this.startHeartbeat(); // 连接成功后自动启动心跳
                        resolve(true);
                    },
                    (err: Error) => {
                        this.isConnected = false;
                        this.isSubscribed = false;
                        this.stopHeartbeat(); // 连接失败停止心跳
                        reject(err);
                    },
                    () => {
                        this.isConnected = false;
                        this.isSubscribed = false;
                        this.stopHeartbeat(); // 连接断开停止心跳
                    }
                );
            });
        },

        /**
         * 通用的单个 Topic 订阅方法
         */
        async _subscribeSingleTopic(topic: string): Promise<boolean> {
            if (!this.client || !this.isConnected) {
                throw new Error('MQTT 未连接，无法订阅');
            }

            return new Promise((resolve, reject) => {
                this.client.subscribe(
                    topic,
                    () => {
                        console.log(`订阅主题成功：${topic}`);
                        resolve(true);
                    },
                    (err: Error) => {
                        console.error(`订阅主题失败：${topic}`, err);
                        reject(err);
                    }
                );
            });
        },

        /**
         * 订阅 Topic：给服务端发消息 + 接收服务端消息
         */
        async subscribeAllNecessaryTopics() {
            if (!this.client || !this.isConnected) {
                return Promise.reject(new Error('MQTT 未连接'));
            }

            try {
                // 获取 Topic 列表
                const res: any = await getTopicList();
                if (res.code === 200) {
                    this.topics = res.data;
                }
                // 订阅服务端消息的 Topic
                if (this.topics.length > 0) {
                    for (const topic of this.topics) {
                        if (topic.topic && topic.isSubscribed + '' === '1') {
                            await this._subscribeSingleTopic(topic.topic);
                        }
                    }
                }

                this.isSubscribed = true;
                return true;
            } catch (err) {
                this.isSubscribed = false;
                console.error('订阅必要 Topic 失败', err);
            }
        },

        /**
         * 生成最新的心跳消息（确保 messageId 和 timestamp 是当前时间）
         */
        generateHeartbeatMessage(): string {
            const userId = uni.getStorageSync('userInfo')?.id || 12356;
            // 可以根据实际需求修改心跳消息内容
            const heartbeatMsg = {
                lat: 39.9042, // 可以改为实际定位坐标
                lng: 117.4074, // 可以改为实际定位坐标
                messageId: `heartbeat-message-${userId}-${Date.now()}`,
                deviceId: `test-device-${userId}`, // 设备ID可以固定，也可以动态获取
                timestamp: Date.now(),
                type: 'heartbeat', // 标记为心跳消息
                status: 'online' // 在线状态
            };
            return JSON.stringify(heartbeatMsg);
        },

        /**
         * 给服务端发消息（发布到 device/{userId}/location）
         * @param message 自定义消息，默认使用最新的心跳消息
         */
        async publishToServer(message: string | Buffer = this.generateHeartbeatMessage()) {
            if (!this.client || !this.isConnected) {
                console.warn('MQTT 未连接，跳过消息发布');
                return Promise.reject(new Error('MQTT 未连接'));
            }


            return new Promise((resolve, reject) => {
                this.client.publish(
                    this.defaultTopic,
                    message,
                    () => {
                        // console.log(`[MQTT心跳] 向服务端发布消息 - 主题：${this.defaultTopic}，内容：${message}`);
                        resolve(true);
                    },
                    (err: Error) => {
                        console.error(`[MQTT心跳] 向服务端发布消息失败 - 主题：${this.defaultTopic}`, err);
                        reject(err);
                    }
                );
            });
        },

        /**
         * 启动心跳发送（15秒一次）
         */
        startHeartbeat() {
            // 先停止已有定时器，避免重复
            this.stopHeartbeat();

            if (!this.isConnected) {
                console.warn('MQTT 未连接，无法启动心跳');
                return;
            }

            console.log(`[MQTT心跳] 启动心跳，间隔：${this.heartbeatInterval / 1000}秒`);

            // 立即发送一次心跳，然后每隔15秒发送一次
            this.publishToServer().catch(err => console.error('[MQTT心跳] 初始心跳发送失败', err));

            this.heartbeatTimer = setInterval(() => {
                this.publishToServer().catch(err => {
                    console.error('[MQTT心跳] 定时心跳发送失败', err);
                    // 可选：心跳失败时尝试重连
                    this.reconnect().catch(() => {
                    });
                });
            }, this.heartbeatInterval);
        },

        /**
         * 停止心跳发送
         */
        stopHeartbeat() {
            if (this.heartbeatTimer) {
                clearInterval(this.heartbeatTimer);
                this.heartbeatTimer = null;
                console.log('[MQTT心跳] 停止心跳');
            }
        },

        /**
         * 断开 MQTT 连接
         */
        disconnect() {
            this.stopHeartbeat(); // 断开连接时停止心跳
            if (this.client && this.isConnected) {
                this.client.disconnect();
                this.isConnected = false;
                this.isSubscribed = false;
                this.currentUserTopic = null;
                this.client = null;
            }
        },

        /**
         * 重连并重新订阅所有必要 Topic
         */
        async reconnect() {
            // 先断开当前连接
            this.disconnect();

            try {
                await this.connect();
                await this.subscribeAllNecessaryTopics();
                // 重连成功后会自动启动心跳（在connect的成功回调中）
                return true;
            } catch (err) {
                console.error('MQTT 重连失败', err);
                return false;
            }
            return true;
        },

        /**
         * 完整初始化：连接 + 订阅 + 发布测试消息
         */
        async initMqtt() {
            try {
                await this.connect();
                await this.subscribeAllNecessaryTopics();
                // 不需要手动调用publishToServer，心跳会自动发送初始消息
                console.log('MQTT 完整初始化成功');
            } catch (err: any) {
                console.error('MQTT 完整初始化失败：', err.message);
                throw err;
            }
        },

        /**
         * 组件卸载时清理资源
         */
        cleanup() {
            this.stopHeartbeat();
            this.disconnect();
            uni.$off('mqttMessage', this.handleGlobalMessage);
            console.log('MQTT 资源清理完成');
        }
    },
});
