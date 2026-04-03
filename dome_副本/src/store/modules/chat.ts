import { defineStore } from 'pinia';
// import markdownit from 'markdown-it';
import { ref } from 'vue';
import {getAssistant,getOpenToken} from '@/api/openApi';
// import {getDict} from '@/api/config';

import { formatTimestamp } from '@/utils/util';
import { parseMarkdown } from '@/utils/markdownParser';

export const ChatStore = defineStore('user', () => {
	interface List {
		id?:string;
		type:'text'|'richText'|'voice';
		msgText?:string;
		isUserType?:'user'|'service';
		time?:Date|number;
		voice?:string;
		duration?:number;
		name?:string
		aiData?:any
		queryId?:string
		sessionId?:string
		answer?:string
		cot?:any
		queryShow?:boolean // 是否查询完成
		queryOpenShow?:boolean // 展示隐藏加载流程
		progress?:boolean // 查询进度
		positive?:boolean // 是否已点赞
		negative?:boolean // 是否已取消点赞
		feedbBackId?:string // 点赞id
		code?:string | number
		isBobaoShow?:boolean
		voiceUrl?: string | null // 音频地址
		invoiceChoiceSkillId?:string| null // 开票服务类型
		
	}
	// const removeRegularList = ref(JSON.stringify([/<[^>]+>/g,/<(?:"[^"]*"|'[^']*'|[^'">])*>/g,/[#*`~]/g,/<[^>]*>?/gm,/[|>\-\t]/g]))
	// const regularList = ref(JSON.stringify([/<[^>]+>/g,/<(?:"[^"]*"|'[^']*'|[^'">])*>/g,/[#*`~]/g,/<[^>]*>?/gm,/[|>\-\t]/g]));
	 const removeRegularList = ref(["<[^>]+>"])
	 const regularList = ref(["<[^>]+>"])
	 const endWidthSymbol = ref('！；，。？!;,.:：?~');
	const ttsConfig = ref({
		speechPersonId: 'LITE_clever_boy',// 讲话人id
		speechPitch: 5, // 讲话人音量（0-15）
		speechSpeed: 10, // 讲话人语速（0-15）
		isAutoAnimoji: false, // 是否智能动作
	})
	// 数字人基础配置
	const bdDigitalConfig = ref({
		hairId:'coco_02_hair_out',// 设置头发样式
		badgeId:'coco_02_badge_out',// 设置眼镜样式
		bodyId:'coco_02_body_out',// 设置衣服样式
		shoesId:'coco_02_shoes_out', // 鞋子样式
		cameraId : "v_half_cam", // 摄像机位    v_full_cam=全身视角，v_half_cam=半身视角，h_shoulder_cam=上半身视角，h_face_cam=脸部特写
		speechPersonId:'LITE_clever_boy',// 音色库id
		speechSpeed:10, // 播放语速0-15
		speechPitch:5,// 音调 0-15
		isAutoAnimoji:true, // 是否自动动作
	})
	
	const anualServiceDataList = ref([])
	let linkUrl = `https://www.sx96113.com/dljy-h5/#/pages/safetytips/safetytips`
	const feedbackTypeList = [
		{name:'事实错误',value:'FACTUAL_ERROR'},
		{name:'格式问题',value:'FORMAT_ISSUE'},
		{name:'回答慢',value:'SLOW_RESPONSE'},
	]
	const dataList = [	
		{name:'积分余额',type:'buts',icon:'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/dh_icon_1.png',route:'',color:'#FFF2E6',richText:`<p class="rTDevtext">您可以点击<a style="color:#169EFF" href="/pages/points/index">积分余额</a>进行查看。</p>`},
		{name:'ETC业务办理',type:'buts',icon:'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/dh_icon_2.png',route:'',color:'#EDF7FF',richText:`<p class="rTDevtext">办理ETC业务，需要您准备身份证、行驶证银行卡等信息。您可以点击<a style="color:#169EFF" href="/pages_A/tollInvoice/index">办理ETC业务</a>进行业务操作。</p>`},
		{name:'一键救援',type:'buts',icon:'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/dh_icon_3.png',route:'',color:'#FFEFEA',richText:`<p class="rTDevtext">您可以点击<a style="color:#169EFF" href="/pages_A/roadRescue/index">一键救援</a>进行查看。</p>`},
		// {name:'高速路况怎么查',type:'list',icon:'',route:'',color:'#000000',richText:`<p class="rTDevtext">您可以点击<a style="color:#169EFF" href="/pages_A/map/index">高速路况</a>进行查看。</p>`},
		// {name:'查看最近服务区信息',type:'list',icon:'',route:'',color:'#000000',richText:`<p class="rTDevtext">您可以点击<a style="color:#169EFF" href="/pages_A/station/index">服务区信息</a>进行查看。</p>`},
		{name:'打开一键救援',type:'list',icon:'',route:'',color:'#000000'}, 
		{name:'三原服务区的联系电话',type:'list',icon:'',route:'',color:'#000000'},
		// {name:'ETC发票',type:'label-top-but',icon:'',route:'',color:'#34B2FE',richText:`<p class="rTDevtext">您可以点击<a style="color:#169EFF" href="/pages_A/tollInvoice/index">ETC发票</a>进行查看。</p>`},
		// {name:'高速路况',type:'label-top-but',icon:'',route:'',color:'#FF431F',richText:`<p class="rTDevtext">您可以点击<a style="color:#169EFF" href="/pages_A/map/index">高速路况</a>进行查看。</p>`},
		// {name:'客服评价',type:'label-top-but',icon:'',route:'',color:'#000000'},
	]
	const list = ref<Array<List>>([]);
	
	// 插入用户数据
	const setUserMessage =(obj:List) =>{
		typing = false
		obj.id=Date.now().toString()
		obj.isUserType = "user"
		obj.time = (new Date()).getTime()
		list.value.push(obj)
	}
	const setServiceMessage = (obj: List) => {
		obj.id = Date.now().toString()
		obj.time = (new Date()).getTime()
		obj.isUserType = 'service'
		obj.positive = false
		obj.negative = false
		list.value.push(obj)
		// // 查找是否存在相同id的消息
		// const index = list.value.findIndex(item => item.id === obj.id)
		// if (index !== -1) {
		// 	// 如果找到相同id的消息，更新该消息
		// 	list.value[index] = obj
		// } else {
		// 	// 如果没有找到相同id的消息，添加新消息
		// 	list.value.push(obj)
		// }
	}
	let typing = false          // 组件级变量，data 或 ref 都行
	// 文本流式加载
	// const setServiceIdMessage = async (obj: List) => {
	//   obj.time = Date.now()
	//   obj.isUserType = 'service'
	
	//   const msgText = obj.msgText
	//   // obj.msgText = ''
	//   list.value.push(obj)
	
	//   // const idx = list.value.findIndex(v => v.id === obj.id)
	//   // const chars = [...msgText]
	
	//   // #ifdef APP
	//   // 用帧循环代替固定 50 ms，保证一帧只写一次
	// 	 //  for (let i = 0; i < chars.length && typing; i++) {
	// 		//   await new Promise(resolve => {
	// 		// 	const handler = () => {
	// 		// 	  if (!typing) return        // 页面已卸载，直接丢弃
	// 		// 	  list.value[idx].msgText += chars[i]
	// 		// 	  resolve(null)
	// 		// 	}
	// 		// 	typeof requestAnimationFrame !== 'undefined'
	// 		// 	  ? requestAnimationFrame(handler)
	// 		// 	  : setTimeout(handler, 16)
	// 		//   })
	// 		// }
	//   // for (let i = 0; i < chars.length; i++) {
	//   //   await new Promise(resolve => {
	//   //     const handler = () => {
	//   //       list.value[idx].msgText += chars[i]
	//   //       resolve(null)
	//   //     }
	//   //     // 兼容 uni-app 2.x / 3.x
	//   //     typeof requestAnimationFrame !== 'undefined'
	//   //       ? requestAnimationFrame(handler)
	//   //       : setTimeout(handler, 16)   // 降级
	//   //   })
	//   // }
	//   // #endif
	
	//   // #ifndef APP-NVUE
	//   // chars.forEach((ch, i) => {
	//   //   setTimeout(() => {
	//   //     list.value[idx].msgText += ch
	//   //   }, 50 * i)
	//   // })
	//   // #endif
	// }
	const setServiceIdMessage = async (obj:List)=>{
		
		obj.time = (new Date()).getTime()
		obj.isUserType = 'service'
		obj.positive = false
		obj.negative = false
		obj.isBobaoShow = false;
		const msgText = obj.msgText;
		obj.msgText = '';
		// obj.msgText = obj.msgText;
		list.value.push(obj)
		let arr = msgText.split('')
		const index = list.value.findIndex(item => item.id === obj.id)
		// list.value[index].msgText
		console.log('-------arr---->>>>',arr);
		const chars = msgText.split('')
		// #ifdef APP-NVUE
			try{
				const timer = weex.requireModule('timer')
				for (let i = 0; i < chars.length; i++) {
				  await new Promise(resolve => {
					list.value[index].msgText += chars[i]
					timer.setTimeout(resolve, 30)
				  })
				}
			}catch(err){
				list.value[index].msgText = msgText
			}
		  
		  // #endif
		
		  // #ifndef APP-NVUE
		  for (let i = 0; i < chars.length; i++) {
		    await new Promise(resolve => {
		      list.value[index].msgText += chars[i]
		      setTimeout(resolve, 30)
		    })
		  }
		  // #endif
	}
	// 招呼语
	const helloText = ref<string>('您好!我是“陕小途”，是您的智途伴行助手，有什么可以帮到您?');
	// 查询语
	const getText = ref<string>('小途正在为你查询，请耐心等待');
	// 
	const questionArr = ref([]);
	// 获取配置信息
	const getConfig = async ()=>{
		try{
			const requestTime = formatTimestamp(new Date().getTime() - 1000, 'YYYY-MM-DD HH:mm:ss');
			const tokenRes:any = await getOpenToken(requestTime);
			if (tokenRes.status === 200){
				const {result} = await getAssistant(tokenRes.result,requestTime)
				helloText.value = result.openingDialog;
				questionArr.value = result.recommendQuestions.map((item:string)=>{
					return{
						name:item,
						type:'',
						icon:'',
						route:'',
						color:'#000000'
					}
				})
			}
			
		}catch(e){
			console.log('错了',e);
			/** 请求失败后，返回默认数据 */
			helloText.value = '您好!我是“陕小途”，是您的智途伴行助手，有什么可以帮到您?';
			questionArr.value = [
				{name:'高速路上逆行扣几分?',type:'',icon:'',route:'',color:'#000000'},
				{name:'如何在雨天避免车辆打滑?',type:'',icon:'',route:'',color:'#000000'},
				{name:'我的车出事故了，怎么办?',type:'',icon:'',route:'',color:'#000000'},
			];
		}
		initList();
	}
	const initList = () => {
		for(let i in list.value){
			if(list.value[i].isUserType == 'service'){
				if(list.value[i].cot){
					list.value[i].cot = list.value[i].cot.map(item =>{
						item.status = 1;
						return item
					})
				}
				list.value[i].isBobaoShow = false
			}
		}
	}
	// 按照大模型数据流处理
	const setServiceQueryMessage = (obj:List)=>{
		obj.time = (new Date()).getTime();
		obj.isUserType = 'service';
		obj.positive = false;
		obj.negative = false;
		obj.queryShow = false;
		obj.queryOpenShow = true;
		obj.isBobaoShow = false;
		obj.voiceUrl = ''
		obj.invoiceChoiceSkillId = ''
		
		
		// let arr = msgText.split('')
		const index = list.value.findIndex(item => item.id === obj.id)
		if(index == -1 ){
			if(obj.code == 100){
				list.value.push(obj)
			}else{
				obj.queryShow = true;
				obj.queryOpenShow = false;
				obj.type = 'richText'
				const {html} = parseMarkdown(obj.answer)
				obj.msgText = html
				if(obj.cot){
					obj.cot = obj.cot.map(item => {
						item.status = 1
						return item
					})
				}
				
				list.value.push(obj)
			}
			
		}else{
			if(obj.code == 100){
				obj.answer = list.value[index].answer + obj.answer
				obj.type = 'richText'
				const {html} = parseMarkdown(obj.answer)
				// list.value[index].msgText = html
				obj.msgText = html
				// obj.answer = list.value[index].msgText + obj.answer
				list.value[index] = obj
			}else{
				obj.queryShow = true
				obj.queryOpenShow = false;
				if(obj.cot){
					obj.cot = obj.cot.map(item => {
						item.status = 1
						return item
					})
				}
				list.value[index] = obj
				list.value[index].type = 'richText'
				const {html} = parseMarkdown(obj.answer)
				list.value[index].msgText = html
			}
		}
		// list.value[index].msgText
		// console.log('-------arr---->>>>',arr);
		// const chars = msgText.split('')
	}
	// 通用更新方法（鸿蒙安全）
	const updateChatItem = (index: number, key: string, value: any) => {
	    if (index === null || index === undefined || !list.value[index]) return;
	    list.value[index][key] = value;
	    // #ifdef APP-HARMONY
	   //  // 鸿蒙：必须通过替换整个对象来触发响应式更新
	   //  const newItem = { ...list.value[index], [key]: value };
	   // list.value.splice(index, 1, newItem);
	    // #endif
	    
	    // #ifndef APP-HARMONY
	    // 其他平台：直接修改即可
	    
	    // #endif
	};
	// 返回需要导出的内容
	return { list,dataList,setUserMessage,setServiceMessage,getConfig,helloText,getText,questionArr,setServiceIdMessage,feedbackTypeList,setServiceQueryMessage,anualServiceDataList,bdDigitalConfig,updateChatItem,ttsConfig,removeRegularList,regularList,endWidthSymbol };
});