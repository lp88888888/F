// // 当前运行设备
// export function getPlatform(): 'app' | 'mp-weixin' | 'mp-alipay' | 'h5' | 'other' {
//   // @ts-ignore
//   const info = uni.getSystemInfoSync();
//   const platform = info.uniPlatform || info.platform;
//   console.log(info);
//   if (platform === 'android' || platform === 'ios') return 'app';
//   if (platform === 'mp-weixin') return 'mp-weixin';
//   if (platform === 'mp-alipay') return 'mp-alipay';
//   if (platform === 'h5') return 'h5';
//   return 'other';
// }

// export const isApp = () => getPlatform() === 'app';
// export const isWeixin = () => getPlatform() === 'mp-weixin';
// export const isAlipay = () => getPlatform() === 'mp-alipay';


// 当前运行设备
export function getPlatform(): 'app' | 'mp-weixin' | 'mp-alipay' | 'h5' | 'harmonyos' | 'other' {
  // @ts-ignore
  const info = uni.getSystemInfoSync();
  const platform = info.platform || info.uniPlatform;
  console.log(info);
  if (platform === 'harmonyos') return 'harmonyos';
  if (platform === 'android' || platform === 'ios') return 'app';
  if (platform === 'mp-weixin') return 'mp-weixin';
  if (platform === 'mp-alipay') return 'mp-alipay';
  if (platform === 'h5') return 'h5';
  return 'other';
}

export const isHarmony = () => getPlatform() === 'harmonyos';
export const isApp = () => getPlatform() === 'app';
export const isWeixin = () => getPlatform() === 'mp-weixin';
export const isAlipay = () => getPlatform() === 'mp-alipay';
export function isIos(){
	const info = uni.getSystemInfoSync();
	const platform = info.platform || info.uniPlatform;
	console.log('-0-0-0--isIos-0-0-0-00-',platform);
	return platform === 'ios'
}
export function isAndroid(){
	const info = uni.getSystemInfoSync();
	const platform = info.platform || info.uniPlatform;
	return platform === 'android'
}