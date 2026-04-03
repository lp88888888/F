/**
 * 极光推送工具类
 * 采用单例模式封装，确保全局只有一个实例
 * 提供了初始化、权限管理、事件监听等功能
 */

// 导入 JPush uni-module
import {
	init,
	setDebug,
	setChannel,
	initPush,
	getRegistrationId,
	setEventCallBack,
	addTags,
	setAlias,
	deleteAlias,
	getAlias,
	setBadgeNumber,
	resetBadge,
	getBadgeNumber,
	getPushStatus,
} from '@/uni_modules/jg-jpush-u';

// #ifdef APP-PLUS
import { requestPermission, isNotificationEnabled } from '@/uni_modules/jg-jpush-u';
import { init as initHuawei } from '@/uni_modules/jg-jpush-u-huawei';
import { init as initHonor } from '@/uni_modules/jg-jpush-u-honor';
import { init as initOppo } from '@/uni_modules/jg-jpush-u-oppo';
import { init as initVivo } from '@/uni_modules/jg-jpush-u-vivo';
import { init as initXiaomi } from '@/uni_modules/jg-jpush-u-xiaomi';
import { getAllTags } from '@/uni_modules/jg-jpush-u';
// #endif

// #ifdef APP-HARMONY
import { setAppKey } from '@/uni_modules/jg-jpush-u';
import { getTags } from '@/uni_modules/jg-jpush-u';
// #endif

class JPushService {
	private static instance: JPushService;
	private isInitialized: boolean = false;

	/**
	 * 私有构造函数，防止外部实例化
	 */
	private constructor() {}

	/**
	 * 获取单例实例
	 * @returns JPushService 实例
	 */
	public static getInstance(): JPushService {
		if (!JPushService.instance) {
			JPushService.instance = new JPushService();
		}
		return JPushService.instance;
	}

	/**
	 * 初始化极光推送服务
	 * 配置日志和连接状态监听
	 */
	public init() {
		const appAuthorizeSetting = uni.getAppAuthorizeSetting();
		console.log('查看推送的数据', appAuthorizeSetting.notificationAuthorized);

		// #ifdef APP-PLUS
		// 返回结果：1 表示开启，0 表示关闭，-1 表示检测失败
		const status = isNotificationEnabled();
		console.log('通知权限状态:', status);
		// #endif

		if (this.isInitialized) {
			console.log('JPush 服务已经初始化');
			return;
		}

		// 设置调试模式
		setDebug(process.env.NODE_ENV === 'production' ? false : true);

		// 根据平台初始化
		const platform = uni.getSystemInfoSync().platform;
		if (platform !== 'ios') {
			// Android 和 HarmonyOS 初始化
			// #ifdef MP-HARMONY
			setChannel("AppGallery")
			setAppKey('6bbf12829cce284c2d357220');
			// #endif
			init();
		} else {
			// iOS 初始化
			initPush({
				appkey: '6bbf12829cce284c2d357220',
				channel: 'App Store', // 渠道名称，用于统计
				isProduction: process.env.NODE_ENV === 'production' ? true : false, // 开发环境设为false，生产环境设为true
				advertisingId: '',
			});
		}

		this.isInitialized = true;
		// #ifndef APP-HARMONY
		initHuawei();
		initHonor();
		initOppo();
		initVivo();
		initXiaomi();
		// #endif
		console.log('JPush 服务初始化完成');
	}

	/**
	 * 设置事件回调
	 * @param callback 回调函数
	 */
	public setEventCallback(callback: (res: any) => void) {
		setEventCallBack({
			callback: (res: any) => {
				callback(res);
			},
		});
	}

	/**
	 * 获取注册 ID
	 * @returns 注册 ID
	 */
	public getRegistrationId(): string {
		return getRegistrationId();
	}

	/**
	 * 添加标签
	 * @param sequence 序列号
	 * @param tags 标签数组
	 */
	public addTags(sequence: number, tags: string[]) {
		addTags(sequence, tags);
	}

	/**
	 * 获取标签
	 * @param sequence 序列号
	 * @param type 类型（HarmonyOS）
	 */
	public getTags(sequence: number, type?: number) {
		// #ifdef APP-PLUS
		getAllTags(sequence);
		// #endif

		// #ifdef APP-HARMONY
		if (type !== undefined) {
			getTags(sequence, type);
		}
		// #endif
	}

	/**
	 * 设置别名
	 * @param sequence 序列号
	 * @param alias 别名
	 */
	public setAlias(sequence: number, alias: string) {
		setAlias(sequence, alias);
	}

	/**
	 * 删除别名
	 * @param sequence 序列号
	 */
	public deleteAlias(sequence: number) {
		deleteAlias(sequence);
	}

	/**
	 * 获取别名
	 * @param sequence 序列号
	 */
	public getAlias(sequence: number) {
		getAlias(sequence);
	}

	/**
	 * 设置徽章数量
	 * @param badgeNumber 徽章数量
	 */
	public setBadgeNumber(badgeNumber: number) {
		setBadgeNumber(badgeNumber);
	}

	/**
	 * 重置徽章
	 */
	public resetBadge() {
		resetBadge();
	}

	/**
	 * 获取徽章数量
	 * @returns 徽章数量
	 */
	public getBadgeNumber(): number {
		return getBadgeNumber();
	}

	/**
	 * 获取推送状态
	 * @param callback 回调函数
	 */
	public getPushStatus(callback: (code: number, isStopped: boolean) => void) {
		getPushStatus((code: number, isStopped: boolean) => {
			callback(code, isStopped);
		});
	}

	/**
	 * 完整的初始化流程
	 * 包括初始化服务和设置事件回调
	 * @param callback 事件回调函数
	 */
	public completeInit(callback?: (res: any) => void) {
		this.init();
		if (callback) {
			this.setEventCallback(callback);
		}
	}
}

// 导出单例实例
export const jpushService = JPushService.getInstance();

// 导出类型
export default JPushService;
