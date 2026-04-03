<template>
	<view class="pageView" :data-theme="pageTheme">
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="系统权限管理" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<view class="navtopBox"></view>
		<view style="position:relative;z-index: 1;">
			<view class="textBox">为了向您提供更好的用户体验，我们会在特定场景下向您申请以下手机系统权限</view>
			<view class="card">
				<view class="iteBox" v-for="(item,index) in configList" :key="index" @click="openConfig(item)">
					<view class="iteBox-left">
						<view class="iteBox-left-name">{{item.name}}</view>
						<view class="iteBox-left-text">{{item.text}}</view>
					</view>
					<view class="iteBox-right">
						<!-- #ifdef APP-PLUS -->
							<text class="iteBox-right-text activeColor" v-if="item.ststus">已开启</text>
							<text class="iteBox-right-text" v-else >未开启</text>
						<!-- #endif -->
						<up-icon name="arrow-right" size="12" color="#575B66"></up-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import { onShow } from '@dcloudio/uni-app';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	const objPrt = {
		isLocationOpen:false,// 位置权限
		isBluetoothOpen:false,// 蓝牙权限
		isCameraOpen:false,// 相机权限
		isThumbOpen:false,// 存储权限
		isMicOpen:false,// 麦克风权限状态
		isTellOpen:false,// 电话权限
		isCopyOpen:false,// 剪切板权限
	}
	const configList = ref([
		{name:'位置权限',text:'开启后，可为您推荐周边服务',filedName:'isLocationOpen',ststus:false},
		// #ifndef APP-HARMONY
		{name:'相机权限',text:'开启后，可实现扫描、照相、录视频',filedName:'isCameraOpen',ststus:false},
		{name:'存储权限',text:'开启后，可用于发票、视频、照片、下载存储',filedName:'isThumbOpen',ststus:false},
		{name:'电话权限',text:'开启后，可用于快捷拨打服务电话',filedName:'isTellOpen',ststus:false},
		{name:'麦克风权限',text:'开启后，可用于语音指令、智能体语音交互',filedName:'isMicOpen',ststus:false},
		{name:'剪切板权限',text:'开启后，可用于分享复制页面内容',filedName:'isCopyOpen',ststus:false},
		// #endif
	])
	
	const openConfig = async (item)=>{
		// 根据不同权限类型跳转到系统设置
		uni.openAppAuthorizeSetting({
			success (res) {
				console.log('打开设置成功', res)
				// 返回设置页面后重新检查权限
				setTimeout(() => {
					getPermission()
				}, 1000)
			},
			fail(err){
				console.log('打开设置失败',err)
				uni.showToast({
					title: '打开设置失败',
					icon: 'none'
				})
			}
		})
	}
	
	// #ifdef APP-PLUS
	// 判断是否为iOS
	const isIos = () => {
		return plus.os.name === "iOS";
	}
	
	// 检查系统定位是否开启
	const checkSystemEnableLocation = () => {
		if (isIos()) {
			let cllocationManger = plus.ios.import("CLLocationManager");
			let result = cllocationManger.locationServicesEnabled();
			console.log("系统定位开启:" + result);
			plus.ios.deleteObject(cllocationManger);
			return result;
		} else {
			try {
				let context = plus.android.importClass("android.content.Context");
				let locationManager = plus.android.importClass("android.location.LocationManager");
				let main = plus.android.runtimeMainActivity();
				let mainSvr = main.getSystemService(context.LOCATION_SERVICE);
				let result = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
				console.log("系统定位开启:" + result);
				return result
			} catch (error) {
				console.warn('检查系统定位失败:', error)
				return true // 默认返回true
			}
		}
	}
	
	// ============ iOS权限检查方法 ============
	
	// iOS位置权限检查
	const judgeIosPermissionLocation = (flag = false) => {
		const CLLocationManager = plus.ios.import("CLLocationManager");
		const status = CLLocationManager.authorizationStatus();
		console.log('当前定位权限状态:', status);
	
		const isAuthorized = (status === 3 || status === 4);
		if (!flag) {
			plus.ios.deleteObject(CLLocationManager);
			return isAuthorized;
		}
		if (isAuthorized) {
			plus.ios.deleteObject(CLLocationManager);
			objPrt.isLocationOpen = true;
			return true;
		}
		if (status === 2) {
			plus.ios.deleteObject(CLLocationManager);
			return false;
		}
	
		const manager = plus.ios.newObject("CLLocationManager");
		try {
			const delegate = plus.ios.implements("CLLocationManagerDelegate", {});
			plus.ios.invoke(manager, "setDelegate:", delegate);
			timer && clearInterval(timer);
			timer = setInterval(() => {
				if (objPrt.isLocationOpen) {
					timer && clearInterval(timer);
				} else {
					objPrt.isLocationOpen = judgeIosPermissionLocation();
				}
			}, 2000)
		} catch (e) {
			console.error(e)
		}
	
		if (status === 0) {
			plus.ios.invoke(manager, "requestWhenInUseAuthorization");
		}
		return false;
	}
	
	// iOS相机权限检查
	const judgeIosPermissionCamera = (flag = false) => {
		let AVCaptureDevice = plus.ios.import("AVCaptureDevice");
		let authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide');
		console.log('camera status', authStatus)
	
		if (flag) {
			if (authStatus === 0) {
				plus.ios.invoke("AVCaptureDevice", "requestAccessForMediaType:completionHandler:", "vide", (granted) => {
					let newState = AVCaptureDevice.authorizationStatusForMediaType('vide');
					console.log("Camera permission granted:", granted, newState);
					objPrt.isCameraOpen = newState === 3;
				})
			} else if (authStatus === 2) {
				plus.ios.invoke("AVCaptureDevice", "requestAccessForMediaType:completionHandler:", "vide", (granted) => {
					let newState = AVCaptureDevice.authorizationStatusForMediaType('vide');
					console.log("Camera permission granted:", granted, newState);
					objPrt.isCameraOpen = newState === 3;
				})
			}
		}
	
		plus.ios.deleteObject(AVCaptureDevice);
		return authStatus === 3; // Authorized
	};
	
	// iOS存储权限检查
	const judgeIosPermissionPhotoLibrary = (flag = false) => {
		let PHPhotoLibrary = plus.ios.import("PHPhotoLibrary");
		let authStatus = PHPhotoLibrary.authorizationStatus();
		console.log('thumb status', authStatus)
		if (flag) {
			if (authStatus === 0) {
				// NotDetermined
				PHPhotoLibrary.requestAuthorization(() => {
					let newState = PHPhotoLibrary.authorizationStatus();
					console.log("PHPhotoLibrary permission granted:", newState);
					objPrt.isThumbOpen = newState === 3;
				});
			} else if (authStatus === 2) {
				// Denied
			}
		}
		plus.ios.deleteObject(PHPhotoLibrary);
		return authStatus === 3; // Authorized
	};
	
	// iOS麦克风权限检查
	const judgeIosPermissionRecord = (flag = false) => {
		let AVAudioSession = plus.ios.import("AVAudioSession");
		let avaudio = AVAudioSession.sharedInstance();
		let permissionStatus = avaudio.recordPermission();
		console.log('record status', permissionStatus)
		if (flag) {
			if (permissionStatus === 1970168948) {
				// Undetermined
				avaudio.requestRecordPermission(() => {
					let newState = avaudio.recordPermission();
					console.log("Microphone permission granted:", newState);
					objPrt.isMicOpen = newState === 1735552628;
				});
			} else if (permissionStatus === 1684369017) {
				// Denied
			}
		}
	
		plus.ios.deleteObject(AVAudioSession);
		return permissionStatus === 1735552628; // Granted
	};
	
	// iOS电话权限检查
	const judgeIosPermissionPhone = () => {
		try {
			// iOS 14+ 检查设备跟踪权限（ATTrackingManager）
			const systemInfo = uni.getSystemInfoSync()
			const versionMatch = systemInfo.system.match(/iOS (\d+)/)
			const iosVersion = versionMatch ? parseInt(versionMatch[1]) : 0
			
			if (iosVersion >= 14) {
				// iOS 14+ 需要检查设备跟踪权限
				const ATTrackingManager = plus.ios.importClass('ATTrackingManager')
				if (ATTrackingManager) {
					const status = ATTrackingManager.trackingAuthorizationStatus()
					console.log('iOS电话/设备跟踪权限状态:', status)
					// 0: notDetermined, 1: restricted, 2: denied, 3: authorized
					return status === 3
				}
			}
			
			// iOS 13及以下，或者无法检查时，默认返回true
			return true
		} catch (error) {
			console.warn('检查iOS电话权限失败:', error)
			return true
		}
	}
	
	// iOS剪切板权限检查
	const judgeIosPermissionClipboard = async () => {
		try {
			const systemInfo = uni.getSystemInfoSync()
			const versionMatch = systemInfo.system.match(/iOS (\d+)/)
			const iosVersion = versionMatch ? parseInt(versionMatch[1]) : 0
			
			// iOS 13及以下不需要剪贴板权限
			if (iosVersion < 14) {
				return true
			}
			
			// iOS 14+ 需要检查剪贴板权限
			// 尝试读取剪贴板来检查权限
			return new Promise((resolve) => {
				uni.getClipboardData({
					success: () => {
						// 能成功读取，说明有权限
						resolve(true)
					},
					fail: (error) => {
						// iOS 错误码 2001 表示权限被拒绝
						if (error.errCode === 2001) {
							resolve(false)
						} else {
							// 其他错误（可能是剪贴板为空）
							resolve(true)
						}
					}
				})
			})
		} catch (error) {
			console.warn('检查iOS剪切板权限失败:', error)
			return true
		}
	}
	
	// ============ Android权限检查方法 ============
	
	// Android权限检查
	const checkAndroidPermission = async () => {
		try {
			// 检查plus对象是否可用
			if (typeof plus === 'undefined' || !plus.android) {
				console.warn('plus对象不可用')
				return false
			}
			
			const PackageManager = plus.android.importClass("android.content.pm.PackageManager");
			const main = plus.android.runtimeMainActivity();
			const ContextCompat = plus.android.importClass("androidx.core.content.ContextCompat");
			
			// 位置权限
			const locationPermissions = [
				'android.permission.ACCESS_COARSE_LOCATION',
				'android.permission.ACCESS_FINE_LOCATION'
			];
			
			objPrt.isLocationOpen = locationPermissions.some(permission => {
				try {
					let result = ContextCompat.checkSelfPermission(main, permission);
					return result === PackageManager.PERMISSION_GRANTED;
				} catch {
					return false;
				}
			});
			
			// 相机权限
			try {
				let result = ContextCompat.checkSelfPermission(main, 'android.permission.CAMERA');
				objPrt.isCameraOpen = (result === PackageManager.PERMISSION_GRANTED);
			} catch {
				objPrt.isCameraOpen = false;
			}
			
			// 存储权限
			const storagePermissions = [
				'android.permission.READ_EXTERNAL_STORAGE',
				'android.permission.WRITE_EXTERNAL_STORAGE',
				'android.permission.READ_MEDIA_IMAGES',
				'android.permission.READ_MEDIA_VIDEO'
			];
			
			objPrt.isThumbOpen = storagePermissions.some(permission => {
				try {
					let result = ContextCompat.checkSelfPermission(main, permission);
					return result === PackageManager.PERMISSION_GRANTED;
				} catch {
					return false;
				}
			});
			
			// 麦克风权限
			try {
				let result = ContextCompat.checkSelfPermission(main, 'android.permission.RECORD_AUDIO');
				objPrt.isMicOpen = (result === PackageManager.PERMISSION_GRANTED);
			} catch {
				objPrt.isMicOpen = false;
			}
			
			// 电话权限
			try {
				let result = ContextCompat.checkSelfPermission(main, 'android.permission.READ_PHONE_STATE');
				objPrt.isTellOpen = (result === PackageManager.PERMISSION_GRANTED);
			} catch {
				objPrt.isTellOpen = false;
			}
			
			// Android剪贴板权限检查（Android通常不需要特殊权限）
			objPrt.isCopyOpen = await checkAndroidClipboardPermission();
			
		} catch (error) {
			console.error('Android权限检查失败:', error);
			// 检查失败时，设置默认值
			objPrt.isLocationOpen = false;
			objPrt.isCameraOpen = false;
			objPrt.isThumbOpen = false;
			objPrt.isMicOpen = false;
			objPrt.isTellOpen = false;
			objPrt.isCopyOpen = true; // 剪贴板默认允许
		}
	}
	
	// Android剪贴板权限检查
	const checkAndroidClipboardPermission = async () => {
		return new Promise((resolve) => {
			try {
				// 获取Android版本
				const systemInfo = uni.getSystemInfoSync()
				const versionMatch = systemInfo.system.match(/Android (\d+)/)
				const androidVersion = versionMatch ? parseInt(versionMatch[1]) : 0
				
				// Android 9及以下不需要剪贴板权限
				if (androidVersion < 10) {
					resolve(true)
					return
				}
				
				// Android 10+ 可能有限制，但通常在前台可以访问
				// 这里简化处理，假设应用在前台时可以访问剪贴板
				if (typeof plus !== 'undefined' && plus.android) {
					try {
						// 检查应用是否在前台
						const main = plus.android.runtimeMainActivity()
						const am = plus.android.importClass('android.app.ActivityManager')
						const context = plus.android.importClass('android.content.Context')
						
						const activityManager = main.getSystemService(context.ACTIVITY_SERVICE)
						const runningAppProcesses = activityManager.getRunningAppProcesses()
						
						let isAppInForeground = false
						for (let i = 0; i < runningAppProcesses.size(); i++) {
							const processInfo = runningAppProcesses.get(i)
							if (processInfo.processName === main.getPackageName()) {
								isAppInForeground = processInfo.importance === 
									am.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
								break
							}
						}
						// 应用在前台，假设可以访问剪贴板
						resolve(isAppInForeground)
					} catch (e) {
						console.warn('Android剪贴板权限检查失败:', e)
						resolve(true) // 默认允许
					}
				} else {
					resolve(true) // 无法检查，默认允许
				}
			} catch (error) {
				console.warn('检查Android剪切板权限失败:', error)
				resolve(true) // 出错时默认允许
			}
		})
	}
	
	// ============ 统一权限检查方法 ============
	
	const getPermission = async ()=>{
		console.log('开始检查权限...')
		
		if (isIos()) {
			// iOS权限检查
			objPrt.isLocationOpen = judgeIosPermissionLocation();
			objPrt.isCameraOpen = judgeIosPermissionCamera();
			objPrt.isThumbOpen = judgeIosPermissionPhotoLibrary();
			objPrt.isMicOpen = judgeIosPermissionRecord();
			objPrt.isTellOpen = judgeIosPermissionPhone();
			
			// iOS剪贴板权限检查（异步）
			try {
				objPrt.isCopyOpen = await judgeIosPermissionClipboard()
			} catch (error) {
				console.warn('iOS剪贴板权限检查失败:', error)
				objPrt.isCopyOpen = true // 出错时默认允许
			}
		} else {
			// Android权限检查
			await checkAndroidPermission()
		}
		
		// 检查系统定位是否开启（只影响位置权限）
		let isLocationSys = checkSystemEnableLocation();
		objPrt.isLocationOpen = isLocationSys ? objPrt.isLocationOpen : false;
		
		// 更新配置列表状态
		updateConfigListStatus()
		
		console.log('权限检查完成:', objPrt)
	}
	
	// 更新配置列表状态
	const updateConfigListStatus = () => {
		configList.value.forEach((item)=>{
			item.ststus = objPrt[item.filedName]
		})
	}
	
	// #endif
	
	onShow(() => {
		// #ifdef APP-PLUS
		getPermission()
		// #endif
	})
</script>

<style lang="scss" scoped>
	.iteBox{
		width: 100%;
		height: 146rpx;
		display:flex;
		align-items: center;
		justify-content:space-between;
		border-bottom:2rpx solid #EBEBEB;
		.iteBox-left{
			max-width: 500rpx;
			.iteBox-left-name{
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
				line-height: 40rpx;
			}
			.iteBox-left-text{
				font-weight: 400;
				font-size: 24rpx;
				color: #666666;
				line-height: 34rpx;
				margin-top: 12rpx;
			}
		}
		.iteBox-right{
			display:flex;
			align-items: center;
			.iteBox-right-text{
				font-weight: 400;
				font-size: 22rpx;
				color: #666666;
				line-height: 28rpx;
				margin-right: 8rpx;
			}
			.activeColor{
				color:var(--primary-color);
			}
		}
	}
	.pageView{
		width: 100%;
		min-height: 100vh;
		background:#FCFFFC;
	}
	.searchView {
		background: var(--head-color);
	}
	.card{
		margin: 0 auto;
		width: 690rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(211,231,209,0.4);
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		padding:30rpx;
		box-sizing:border-box;
	}
	.textBox{
		margin: 30rpx auto;
		width: 690rpx;
		height: 76rpx;
		font-family: Source Han Sans, Source Han Sans;
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
		line-height: 34rpx;
	}
	.navtopBox{
		width: 750rpx;
		height: 448rpx;
		background: var(--head-color);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position:absolute;
		top:0;
		left: 0;
		z-index: 0;
	}
</style>