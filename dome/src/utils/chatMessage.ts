import { ChatStore } from "@/store/modules/chat";
import { openLocation,openAPPLocation } from "@/utils/util";
const chatStore = ChatStore();

const $kfMessageChange = (res,messageId) =>{
	let  msg  = null
	let  data  = null
	// #ifdef MP-WEIXIN
		msg = res
		data =res
	// #endif
	// #ifdef APP
		msg = JSON.parse(res)
		data = JSON.parse(JSON.parse(res).data)
	// #endif
	// const msg = JSON.parse(res)
	// let data = JSON.parse(JSON.parse(res).data)
	console.log("-------------",data);
	let messageObj = {
		id:messageId,
		  type:'richText',
		  msgText:'',
		  aiData:null,
		  progress:true,
		  queryId:'',
		  sessionId:'',
		  answer:'',
		  positive:false, // 是否已点赞
		  negative:false // 是否已取消点赞
	}
	// if(msg.code == 100){
	// 	chatStore.setServiceMessage(messageObj)
	// }
	if(msg.code != 200 && msg.code != 100){
		messageObj.msgText = '抱歉，小途未找到该业务，请重新描述业务';
		messageObj.progress = false
		chatStore.setServiceMessage(messageObj)
	}
	if(msg.code == 200){
		if(data.data.answer.indexOf('http:') != -1 || data.data.answer.indexOf('https:') != -1 ){
			// messageOanswerbj.msgText = `<p style="fontSize:14px">${linkify(data.data.answer)}</p>`;
			messageObj.msgText = parseRichText(data.data.answer);
		}else if(data.data.answer.indexOf('/pages') != -1){
			
			console.log('00990',`<p>${parseInnerLink(data.data.answer)}</p>`);
			
			messageObj.msgText = `<p>${parseInnerLink(data.data.answer)}</p>`;
		}
		else{
			messageObj.msgText = data.data.answer
		}

		if(data.data.data.action == 'navigation'){
			setTimeout(() => {
				// #ifdef APP
				let start ={"lat": 34.2778,"lng": 108.953098,"address": "西安市"}
					if(uni.getStorageSync('address')){
						start.lat = uni.getStorageSync('address').lat
						start.lng = uni.getStorageSync('address').lng
						start.address = uni.getStorageSync('address').standardAddress || uni.getStorageSync('address').city
					}
					openAPPLocation({
						startLocation:{
							longitude:start.lng,
							latitude:start.lat,
							address:start.address,
						},
						endLocation:{
							longitude:data.data.data.destination.longitude,
							latitude:data.data.data.destination.latitude,
							address:data.data.data.destination.name,
						}
					})
				// #endif
				// #ifdef MP-WEIXIN
					openLocation(data.data.data.destination)
				// #endif
			},1000)
		}
		messageObj.progress = false
		messageObj.aiData = data.data.data;
		messageObj.queryId = data.data.queryId;
		messageObj.sessionId = data.data.sessionId;
		messageObj.answer = data.data.answer;
		console.log('------messageObj---',messageObj);
		chatStore.setServiceMessage(messageObj)
	
		console.log(chatStore.list);
	}
}


const parseRichText = (text: string) => {
    // 处理图片
    let richText = text.replace(/!\[.*?\]\((.*?)\)/g, (match, url) => {
        return `<img src="${url}" style="max-width: 200px; height: auto;" />`;
    });

    // 处理链接
    richText = richText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        return `<a href="${url}" style="color: #169EFF">${text}</a>`;
    });

    // 处理换行
    richText = richText.replace(/\n/g, '<br>');

    // 处理加粗文本
    richText = richText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 处理数字列表
    richText = richText.replace(/^\d+\.\s/gm, '<br>$&');

    return richText;
};
function parseInnerLink(text) {
  // 匹配 /pages 开头的路径（允许带 query 和 hash）
  const reg = /(\/pages(?:_\w+)?\/[^\s]+)/g
  return text.replace(reg, url => {
    // 去掉尾部标点
    url = url.replace(/[，。！？；：”"’'）】」]$/, '')
	uni.navigateTo({
		url:url
	})
    // return `<navigator class="inner-link" style="color:#2979ff" @tap.stop="navtoLike(${url})" url="${url}">${url}</navigator>`
    return `<a href="${url}" style="color: #169EFF">${url}</a>`
  })
}
function linkify(str) {
  // 1. 先转义 HTML，防止 XSS
  const escape = s => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. 匹配 http/https 地址
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s"'<>]*/gi;

  return escape(str).replace(urlRegex, url =>
    `<a href="${url}" target="_blank" rel="noopener">${url}</a>`
  );
}
export {
	$kfMessageChange
}