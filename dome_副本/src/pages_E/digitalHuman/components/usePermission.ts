// 是否获取麦克风权限
import { isApp, isWeixin, isAlipay } from '@/utils/platform';

export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    if (isApp() || isWeixin()) {
      return await new Promise<boolean>((resolve) => {
        uni.authorize({
          scope: 'scope.record',
          success: () => resolve(true),
          fail: () => {
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