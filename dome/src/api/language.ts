import request from '@/utils/request';

// 授权码：
// const APIKey = '2xnOMq793gJxnmhmbXh54vha'; // Access Key 
// const SecretKey = '0mWgd1wNQ1faTB29X6VpO1lW5h4CFB7k'; // Secrect Key
const APIKey = 'deRJTYboc6KXUedA9ndi8GEA'; // Access Key 
const SecretKey = 'VCpNxjKAOmzc3T7d0UhiZcckv9YKk66M'; // Secrect Key
// 获取token
export function voiceToken() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=${'client_credentials'}&client_id=${APIKey}&client_secret=${SecretKey}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        console.log('res', res)
        resolve(res.data);
      },
      fail: err => {
        reject(err.errMsg);
      }
    });
  });
}

// 语音转文字接口
export function voiceTotext(accessToken,base64Speech) {
  return new Promise((resolve, reject) => {
    const buf = uni.base64ToArrayBuffer(base64Speech); // 三端通用
    let param = {
        format: 'pcm',
        rate: 16000,
        channel: 1,
        cuid: 'test_' + Date.now(),   // 任意唯一字符串
        token: accessToken,
        speech: base64Speech,
        len: buf.byteLength // 原始字节长度
      }
	  // #ifdef APP-PLUS
		
		const systemInfo = uni.getSystemInfoSync();
		 const platform = systemInfo.platform; // 'android' 或 'ios'
		 if(platform === 'ios'){
			 param.format = 'wav'
		 }else{
			 param.format = 'amr'
		 }
	  // #endif
	  // #ifdef APP-HARMONY
		
		param.rate = 16000 // wav
		param.format = 'm4a' // m4a(鸿蒙只能使用m4a格式转换文字成功)
	  // #endif
	  console.log('--------param----------',param);
    uni.request({
      url: 'https://vop.baidu.com/server_api',
      // url: 'https://vop.baidu.com/pro_api',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: param,
      success: res => {
        console.log('res', res)
        resolve(res.data);
      },
      fail: err => {
        reject(err.errMsg);
      }
    });
  });
}

// 语音转文字接口
export function voiceRawTotext(accessToken,audioBuffer) {
  return new Promise((resolve, reject) => {
  //   const buf = uni.base64ToArrayBuffer(base64Speech); // 三端通用
  //   let param = {
  //       format: 'pcm',
  //       rate: 16000,
  //       channel: 1,
  //       cuid: 'test_' + Date.now(),   // 任意唯一字符串
  //       token: accessToken,
  //       speech: base64Speech,
  //       len: buf.byteLength // 原始字节长度
  //     }
	 //  // #ifdef APP
		// param.format = 'amr'
	 //  // #endif
    uni.request({
      url: `http://vop.baidu.com/server_api?dev_pid=1537&cuid=test_${Date.now()}&token=${accessToken}`,
      method: 'POST',
      header: { 'Content-Type': 'audio/wav;rate=16000' },
      data: audioBuffer,
	  responseType: 'arraybuffer', // 百度返回 json 但先按二进制收
      success: res => {
        console.log('res', res)
        resolve(res.data);
      },
      fail: err => {
        reject(err.errMsg);
      }
    });
  });
}
// 短文本在线识别
export function text2audioTextToVoice(data) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `http://tsn.baidu.com/text2audio`,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
      },
      data:{lan:'zh',ctp:1,per:6561,...data},
	  responseType: 'arraybuffer', // 要二进制
      success: res => {
        console.log('res', res)
        resolve(res.data);
      },
      fail: err => {
        reject(err.errMsg);
      }
    });
  });
}
// 长文本在线合成API
export function createTextToVoice(accessToken,data) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `https://aip.baidubce.com/rpc/2.0/tts/v1/create?access_token=${accessToken}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data:{lang:'zh',"pit":5,"spd":5,"vol":5,"per":0,"aue":3,...data},
      success: res => {
        console.log('res', res)
        resolve(res.data);
      },
      fail: err => {
        reject(err.errMsg);
      }
    });
  });
}
// 查询长文本在线合成任务
export function queryTextToVoice(accessToken,task_ids) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `https://aip.baidubce.com/rpc/2.0/tts/v1/query?access_token=${accessToken}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
		  task_ids
	  },
      success: res => {
        console.log('res', res)
        resolve(res.data);
      },
      fail: err => {
        reject(err.errMsg);
      }
    });
  });
}
// 语音合成返回http链接
export function textCensor(data: any) {
	return request({
		url: '/operation/api/textCensor/v1',
		method: 'POST',
		data: data
	});
}

    