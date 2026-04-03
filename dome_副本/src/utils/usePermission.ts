// 是否获取麦克风权限
import { isApp, isWeixin, isAlipay,isHarmony } from '@/utils/platform';
// // #ifdef APP-HARMONY
// import { requestPermissions, Permissions } from '@kit.PermissionsKit';
// // #endif
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
	  // console.log('---0-0-p-',isApp());
	  // console.log('---0-0-p-',isWeixin());
	  // if(isHarmony()){
		 //  return await requestHarmonyMicrophonePermission();
	  // }else 
	 if(isApp() || isWeixin()) {
		  console.log('-----9898----');
      return await new Promise<boolean>((resolve) => {
		  console.log('-----983398----');
        uni.authorize({
          scope: 'scope.record',
          success: (ree) => {
			  console.log('-----ree-----',ree);
			  resolve(true)
		  },
          fail: (eree) => {
			  console.log('-----eree-----',eree);
            uni.showModal({
              title: '麦克风权限未开启',
              content: '需要麦克风权限才能发送语音，请到设置中开启',
              showCancel: true,
              confirmText: '去设置',
              success: (res) => {
                if (res.confirm) {
                  uni.openSetting({
                    success: (setting) => {
                      resolve(!!setting.authSetting?.['scope.record']);
                    },
                    fail: () => resolve(false)
                  });
                } else {
                  resolve(false);
                }
              }
            });
          }
        });
      });
    } else if (isAlipay()) {
      return new Promise<boolean>((resolve) => {
        // @ts-ignore
        if (typeof my !== 'undefined') {
          // @ts-ignore
          my.authorize({
            scope: 'scope.microphone',
            success: () => resolve(true),
            fail: () => {
              // @ts-ignore
              my.alert({
                title: '权限不足',
                content: '请在支付宝设置中开启麦克风权限'
              });
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    } else {
      return true; // H5 或其他平台暂不处理
    }
  } catch {
    return false;
  }
}
// #ifdef APP-HARMONY
async function requestHarmonyMicrophonePermission(): Promise<boolean> {
  try {
    const result = await requestPermissions({
      permissions: [Permissions.MICROPHONE]
    });
	console.log('00990990',result);
    return result[Permissions.MICROPHONE]?.grantStatus === 'granted';
  } catch (error) {
    console.error('鸿蒙麦克风权限申请失败:', error);
    return false;
  }
}
// #endif

export const permission = {
	// Android 动态申请
	  requestAndroidPermission(perm) {
	    return new Promise((resolve) => {
	      plus.android.requestPermissions([perm], (e) => {
	        if (e.granted.length > 0) resolve(1)
	        else if (e.deniedAlways.length > 0) resolve(-1)
	        else resolve(0)
	      }, () => resolve(0))
	    })
	  },
	  // iOS 查询
	  judgeIosPermission(perm) {
	    if (perm === 'record') {
	      const AVAudioSession = plus.ios.import('AVAudioSession')
	      const status = AVAudioSession.sharedInstance().recordPermission()
	      plus.ios.deleteObject(AVAudioSession)
	      return status === 1735552628      // AVAudioSessionRecordPermissionGranted
	    }
	    return false
	  },
	  // 跳设置
	  gotoAppPermissionSetting() {
	    const main = plus.android.runtimeMainActivity()
	    const Intent = plus.android.import('android.content.Intent')
	    const Settings = plus.android.import('android.provider.Settings')
	    const Uri = plus.android.import('android.net.Uri')
	    const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
	    const uri = Uri.fromParts('package', main.getPackageName(), null)
	    intent.setData(uri)
	    main.startActivity(intent)
	  }
}

// 检查并获取定位权限
// utils/permission.js

export const checkAndGetLocationPermission = async () => {
    // #ifdef APP-PLUS
        if (uni.getSystemInfoSync().platform === 'android') {
            const main = plus.android.runtimeMainActivity(); // 获取当前 Activity
            const ContextCompat = plus.android.importClass('androidx.core.content.ContextCompat');
            const Manifest = plus.android.importClass('android.Manifest');
            const PERMISSION_GRANTED = 0; // 安卓常量：已授权
    
            // 检查精细定位权限
            const hasPermission = ContextCompat.checkSelfPermission(
                main,
                Manifest.permission.ACCESS_FINE_LOCATION
            );
			console.log('---hasPermission-----：', hasPermission);
            if (hasPermission !== PERMISSION_GRANTED) {
                console.log('未获得定位权限，准备申请...');
                // App端申请权限最简单的方法：直接调用 getLocation，系统会自动弹窗
                return new Promise((resolve) => {
                    uni.getLocation({
                        type: 'wgs84',
                        success: () => resolve(true),
                        fail: (err) => {
                            console.log('用户拒绝或失败：', err);
                            // 如果权限被永久拒绝，引导去设置
                            // showSettingModal();
                            resolve(false);
                        }
                    });
                });
            }
            return true; // 已有权限
        }
        // #endif
        
        // 非 App 环境（如 H5）直接返回 true，让后续业务逻辑处理错误
        return true;
};

function showSettingModal() {
    uni.showModal({
        title: '权限提示',
        content: '应用需要定位权限，请在设置中开启',
        confirmText: '去设置',
        success: (res) => {
            if (res.confirm) {
                gotoAppSetting();
            }
        }
    });
}

function gotoAppSetting() {
   uni.openAppAuthorizeSetting({
   	success (res) {
   		console.log('打开设置成功', res)
   		
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