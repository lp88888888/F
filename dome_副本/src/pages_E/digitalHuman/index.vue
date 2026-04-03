<template>
	<view class="conView">
		<up-navbar title=" " bgColor="transparent" @leftClick="toBack" placeholder fixed></up-navbar>
		<!-- 顶部背景 -->
		<image class="absImage" :src="icoUrl + 'BdDigitalMan/page-bg.png'" mode=""></image>
		<view id="topAllView" class="topAllView">
			<!-- 顶部背景 -->
			<up-gap height="10"></up-gap>
			<view class="tooBack" :style="{height: isSkillShow?'610rpx':'286rpx'}">
				<image class="tooBack-bg" :src="icoUrl+'BdDigitalMan/card-icon.png'" :lazy-load="true" mode=""></image>
				<view class="tooBack-venter" :style="{height: isSkillShow?'610rpx':'286rpx'}">
					<view class="tooBack-venter-topks">
						<text class="textFont1">Hi. 我是"速小猴"</text>
						<text class="textFont2">{{chatStore.helloText}}</text>
					</view>
					<view class="tooBack-venter-botBox" :style="{height: isSkillShow?'290rpx':'76rpx'}">
						<view class="tooBack-venter-bot">
							<view class="tooBack-venter-bot-text">
								<text class="fontText1">专属技能</text>
								<text class="fontText2">点击感兴趣的技能，开始提问吧</text>
								<image class="imagesBox"
									:src="`${icoUrl}BdDigitalMan/${isSkillShow?'dmIcon2-close':'dmIcon2'}.png`"
									@click="isSkillShow = !isSkillShow" mode=""></image>
							</view>
						</view>
						<swiper v-if="isSkillShow" class="tooBack-venter-botBox-sw" :indicator-dots="false"
							:current="currentIndex" @change="swiperChange" :autoplay="false" :interval="3000"
							:duration="1000">
							<swiper-item class="botBox-sw" v-for="(item,index) in skillResult" :key="index">
								<view class="swiper-item" :style="{background:skillId == el.id?themeStore.themeColors.$DigitaButColor2:'transparent'}"
									v-for="(el,indx) in item" :key="indx" @click="skillId = el.id">
									<image class="swiper-item-icon" :src="el.iconUrl" mode=""></image>
									<text class="swiper-item-text">{{el.skillName}}</text>
								</view>
							</swiper-item>
						</swiper>
						<view v-if="isSkillShow" class="tooBack-venter-botBox-lot">
							<view :class="[currentIndex == index?'lotItemActive':'lotItem']"
								v-for="(item,index) in skillResult" :key="index"></view>
						</view>
					</view>
					<scroll-view class="scroll-view_H" scroll-x="true" :show-scrollbar="false" v-if="isSkillShow">
						<!-- <view class="h-item" v-for="(item,index) in questionList" :key="index" @click="addMessage({msgText:item.guidingQuestion,type:'text'})"> -->
						<view class="h-item" v-for="(item,index) in questionList" :key="index" @click="querySelect(item.guidingQuestion)">
							<text class="h-item-text" :style="{color:themeStore.themeColors.$DigitaColor}">{{item.guidingQuestion}}</text>
							<image class="h-item-img" :src="icoUrl+'BdDigitalMan/dmIcon6.png'" mode=""></image>
						</view>
					</scroll-view>
				</view>
			</view>
			<image class="tooBack-mokeyBox" v-if="bobaoShow" :src="icoUrl+'BdDigitalMan/bobao_2.gif'" :lazy-load="true" mode=""></image>
			<image class="tooBack-mokeyBox" v-else :src="icoUrl+'BdDigitalMan/idle_2.gif'" :lazy-load="true" mode=""></image>
			<image class="tooBack-call" :src="icoUrl+'BdDigitalMan/call-icon.png'" :lazy-load="true" mode=""></image>
		</view>
		<!-- 列表 -->
		<MessageList ref="msgListRef" :height="messHeight" @butChange="addMessage" @followClick="addMessage"
			@formSubmit="formSubmit" @kfAiOpen="kfAiOpen" @stopTalk="stopTalk" @skillId="skillIdChange" @etcId="etcIdChange" @carNumber="carNumChange"></MessageList>
		<!-- 底部 -->
		<up-gap height="90"></up-gap>
		<MessageButton ref="msgButtonRef" :dataList="chatStore.dataList" @inputChange="addMessage"></MessageButton>
		<!-- #ifdef APP -->
		<gao-ChatSSEClient ref="chatSSEClientRef" :heartbeat-timeout="120000" :timeout="300000" :max-retry-count="5"
			@onOpen="openCore" @onError="errorCore" @onMessage="messageCore" @onFinish="finishCore" />
		<!-- #endif -->
		<up-popup :show="kfShow" mode="bottom" z-index="999" closeable @close="kfShow = false" round="10">
			<view class="kfBox">
				<view class="kfBox-title" style="font-weight: bold;">选择业务类型</view>
				<view class="kfBox-tabs">
					<up-tabs v-if="list1.length" :list="list1" @change="kfTabsChange" keyName="dictLabel"
						:current="kfCurrent" lineWidth="28" lineColor="#628F2F"
						:activeStyle="{fontSize:'32rpx',color:'#000',fontWeight:'bold'}"
						:inactiveStyle="{fontSize:'32rpx'}"></up-tabs>
				</view>
				<view style="min-height: 400rpx;">
					<view class="kfBox-center">
						<view class="kfBox-center-item" v-for="(item,index) in kfItemList" :key="index"
							@click="kfOpen(item)">
							<image class="kfBox-center-item-img" :src="item.iconUrl" mode=""></image>
							<text class="kfBox-center-item-text">{{item.businessContent}}</text>
						</view>
					</view>
				</view>
				<view class="kfBox-bottom">
					<view class="kfBox-flex">
						<image class="kfBox-bottom-img" :src="imgUrl+'BdDigitalMan/dmIcon9.png'" mode=""></image>
						<text class="kfBox-bottom-text">没有我要找的业务，联系平台专属客服</text>
					</view>
					<view>
						<button @tap="openKf" class="btn-lx">去联系</button>
					</view>
				</view>
			</view>
		</up-popup>
		<up-popup :show="kfItemShow" mode="bottom" z-index="999" closeable @close="kfItemShow = false" round="10">
			<view class="boolBox">
				<view v-if="kfItemObj.manualChannel == 1" class="boolBox-img">
					<image class="boolBox-image" :src="kfItemObj.qrCode" @click="$previewItemImage(kfItemObj.qrCode)"
						mode="widthFix"></image>
					<view class="boolBox-img-text">点击长按保存</view>
				</view>
				<view class="boolBox-cneter" v-if="kfItemObj.manualChannel == 0">
					<view class="boolBox-cneter-title">{{kfItemObj.businessContent}}</view>
					<view class="boolBox-cneter-text">竭诚为您服务~</view>
					<view class="boolBox-cneter-card">
						<image class="boolBox-cneter-card-img" :src="imgUrl+'BdDigitalMan/dmIcon10.png'" mode="">
						</image>
						<view class="boolBox-cneter-card-box">
							<view class="boolBox-cneter-card-box-text">电话客服</view>
							<view class="boolBox-cneter-card-box-tel">{{kfItemObj.contactPhone}}</view>
						</view>
					</view>
					<view class="boolBox-cneter-but" @click="makePhoneCall(kfItemObj.contactPhone)">立即拨打</view>
				</view>
			</view>
		</up-popup>
		<PageDurationTracker pageName="AI数字人" />
		<!-- #ifdef MP-HARMONY -->
		<audio id="myAudio" style="display:none;"></audio>
		<!-- #endif -->
	</view>
</template>

<script setup lang="ts">
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import { ref, computed,onUnmounted } from "vue";
	import { deepClone } from "@/uni_modules/uview-plus";
	import { imgUrl, aiUrl } from "@/config";
	import { toBack, toNav } from "@/utils/route";
	import MessageButton from "./components/MessageButton";
	import MessageList from "./components/MessageList.vue";
	import { ChatStore } from "@/store/modules/chat";
	import { toast } from "@/utils/common";
	import { getOpenToken, openChat } from "@/api/openApi";
	import { voiceToken, voiceTotext,createTextToVoice,queryTextToVoice,textCensor } from "@/api/language";
	import { getToken } from "@/utils/token";
	import { $kfMessageChange } from '@/utils/chatMessage';
	import { formatTimestamp, getUUID, systemInfo, makePhoneCall, $previewItemImage,parseToken,parseTokens,fixQuotes } from "@/utils/util";
	import { onLoad, onReady, onShow,onHide } from "@dcloudio/uni-app";
	import { useElementRects } from '@/utils/useElementRect';
	import { manualServiceList, skillList, getDict } from "@/api/config";
	import { chatAiService } from '@/utils/chatAiService'; // 引入刚才封装的服务
	// import { tts } from '@/common/baiduTTS.js'
	// 以下路径需根据项目实际情况填写
	
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	
	
	const audioSrc = ref('')
	const { queryAll } = useElementRects(['#topAllView'])
	const assistantId = ref(118);
	const chatSSEClientRef = ref(null);
	const msgButtonRef = ref(null);
	const uuid = getUUID();
	const chatStore = ChatStore();
	const msgListRef = ref(null);
	const queryText = ref("");

	const topHeught = ref(100);

	const isShsow = ref(true);
	const messageList = ref(true);

	const skillId = ref(0);
	const currentIndex = ref(0);
	const isSkillShow = ref(true);
	const anualServiceDataList = ref([]); // 客服列表
	const skillDataList = ref([]); // 列表
	
	/* 音频插件 */
	let audioVoice = null
	const bobaoShow = ref(false);
	// 开始播放
	const voicePlay =async  (audioSrc)=>{
		// audioVoice.src = 'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/del/text2audio.mp3'
		audioVoice.src = audioSrc
		msgListRef.value.updateChatItem(stopItemBoIndex.value, 'isBobaoShow', true)
		bobaoShow.value = true;
		audioVoice.play()
		console.log('-0-002220333--0----', JSON.parse(JSON.stringify(chatStore.list)));
	}
	// 停止播放
	const voiceStop = (type=false) => {
		audioVoice.stop()
		// #ifdef MP-WEIXIN
			audioVoice.src = '';
		// #endif
		
		msgListRef.value.updateChatItem(stopItemBoIndex.value, 'isBobaoShow', false)
		stopItemBoIndex.value = null
		bobaoShow.value = false;
		
		console.log('-0-002220--0----', JSON.parse(JSON.stringify(chatStore.list)));
	}
	
	const querySelect = (text) => {
		msgButtonRef.value.messageValue = text
	}

	const kfItemShow = ref(false);
	const kfItemObj = ref({});
	const kfCurrent = ref(0)
	const kfDictValue = ref(0)
	const kfShow = ref(false);
	const kfDict = ref([]);
	const list1 = computed(() => {
		let arr = kfDict.value.filter((item => item.dictValue != '4'))
		return arr
	});
	//
	const kfItemList = computed(() => {
		let arr = chatStore.anualServiceDataList.filter((item => item.businessType == kfDictValue.value))
		return arr
	});
	const getkfDict = async () => {
		let res = await getDict('customer_business_type');
		if (res.code == 200) {
			kfDict.value = res.data;
			kfDictValue.value = res.data[0].dictValue
		}
	}
	const kfTabsChange = (event) => {
		kfCurrent.value = event.index;
		kfDictValue.value = event.dictValue
	}
	const kfOpen = (item) => {
		console.log('=======', item);
		kfItemObj.value = item
		kfItemShow.value = true;
	}
	const openKf = () => {
		wx.openCustomerServiceChat({
			extInfo: { url: 'https://work.weixin.qq.com/kfid/kfcb259be3a3bff95fe' },
			corpId: 'ww9b8cea23f9dd42fd',
			success(res) {
				console.log('成功了', res)
			}, fail(err) {
				console.error('打开客服聊天失败', err);
				uni.showToast({
					title: '打开客服失败，请重试',
					icon: 'none'
				});
			}
		})
	}
	const stopItemBoIndex = ref(null);
	const stopTalk = async (event)=>{
		// console.log('--0-0-0-0-00--0',event);
		stopItemBoIndex.value = event.index
		if(event.isBobaoShow){
			voiceStop()
			return
		}
		let { text } = event
		if(event.voiceUrl){
			// bobaoShow.value = true;
			voicePlay(event.voiceUrl)
		}else{
			getVoice(text)
		}
		
	}
	const skillData = ref({});
	// 选择开票类型
	const skillIdChange = (obj) =>{
		skillData.value = obj
		addMessage({msgText:obj.skill_name,type:'text'})
	}
	const etcData = ref({});
	// 选择etc
	const etcIdChange = (event) =>{
		// etcData.value = obj
		// addMessage({msgText:obj.plateNum,type:'text'})
		etcData.value = event.obj
		skillData.value.skill_id = event.skillId
		addMessage({msgText:event.obj.plateNum,type:'text'})
	}
	const plateNum = ref({});
	// 选择车牌号（一级公路）
	const carNumChange = (event) =>{
		// plateNum.value = text
		// addMessage({msgText:text,type:'text'})
		plateNum.value = event.text
		skillData.value.skill_id = event.skillId
		addMessage({msgText:event.text,type:'text'})
	}
	// 替换函数
	const getVoice = async (text,type=false) => {
		uni.showLoading({ title: '合成中' })
		if(type){
			stopItemBoIndex.value = chatStore.list.length - 1;
		}
		try {
			let res = await textCensor({
				lan:'zh',
				ctp:1,
				tex:fixQuotes(text),
				cuid:getUUID(),
				per:6561,
			})
			if(res.code == 200){
				// bobaoShow.value = true;
				voicePlay(res.data.url)
				// chatStore.list[stopItemBoIndex.value].isBobaoShow = true
				chatStore.list[stopItemBoIndex.value].voiceUrl = res.data.url
			}
		} catch (e) {
			console.log('222332232',e);
			uni.showToast({ title: e.message || '合成失败', icon: 'none' })
		}
		uni.hideLoading()
	}


	// }
	const kfAiOpen = (event) => {
		if (event.type == 'all') {
			kfShow.value = true
		} else {
			// #ifdef MP-WEIXIN 
				if(event.item.id == 1 || event.item.businessContent == '人工客服'){
					openKf()
				}else{
					kfOpen(event.item)
				}
			// #endif
			// #ifdef APP-HARMONY
				kfOpen(event.item)
			// #endif
			
			
		}
	}


	const skillResult = computed(() => {
		let arr = skillDataList.value.filter(item => item.id != 0 || item.skillName != '通用');
		let newArr = [];
		for (let i = 0; i < arr.length; i += 4) {
			newArr.push(arr.slice(i, i + 4));
		}
		return newArr
	});
	const questionList = computed(() => {
		let arr = skillDataList.value.filter(item => item.id == skillId.value)
		if (arr.length) {
			return arr[0].questionList
		} else {
			return []
		}
	})
	const swiperChange = (e) => {
		currentIndex.value = e.detail.current
	}

	// 功能按钮
	const dataList = ref(chatStore.dataList);
	const list = computed(() => {
		return (type : string) => {
			return chatStore.dataList.filter((item) => item.type == type);
		};
	});
	const messHeight = computed(() => {
		let total = systemInfo().windowHeight - topHeught.value - 160;
		if (!isSkillShow.value) {
			total = total + 160
		}
		return `${total || 500}px`
	})
	// 选择功能按钮
	const selectClick = (item) => {
		console.log(item.msgText);
	};
	interface Objs {
		name ?: string;
		id ?: string;
		type : "text" | "richText" | "voice";
		msgText ?: string;
		isUserType ?: "user" | "service";
		time ?: Date | number;
		voice ?: string;
		voiceState ?: string;
		duration ?: number;
	}
	const formData = ref(null)
	const formSubmit = (obj) => {
		formData.value = obj.formData;
		if (uni.getStorageSync('address')) {
			formData.value.fault = {
				address: uni.getStorageSync('address').standardAddress,
				longitude: uni.getStorageSync('address').lng,
				latitude: uni.getStorageSync('address').lat
			}
			formData.value.destination = {
				address: uni.getStorageSync('address').standardAddress,
				longitude: uni.getStorageSync('address').lng,
				latitude: uni.getStorageSync('address').lat
			}

		}
		addMessage({ msgText: obj.msgText, type: 'text',clearType:true })
	}
	// 发送消息
	const addMessage = (objs : Objs) => {
		isSkillShow.value = false;
		if(bobaoShow.value){
			voiceStop()
		}
		
		let obj : Objs = { type: "text" };
		if (objs.msgText) {
			obj.msgText = objs.msgText;
			obj.type = "text";
			queryText.value = objs.msgText;
			if(objs.clearType){
				skillData.value = {}
			}
			chatStore.setUserMessage(deepClone(obj));
			msgListRef?.value?.scrollToBottom();
			setTimeout(() => {
				addKfMessage(deepClone(obj));
			}, 100);
		}
		console.log("object", objs);
		if (objs.voice) {
			skillData.value = {}
			obj.voice = objs.voice;
			obj.duration = objs.duration;
			obj.type = "voice";
			obj.voiceState = objs.voiceState;
			// chatStore.setUserMessage(deepClone(obj))
			uploadPcm(objs);
		}
	};
	// 根据用户消息客服回复
	interface NewObj {
		type ?: string;
		msgText ?: string;
	}
	const addKfMessage = (obj : Objs) => {
		let msgText = obj.msgText || "";
		if (obj.voice) {
			let newObj : NewObj = {
				type: "text",
			};

			let arr = chatStore.dataList.filter(
				(item) =>
					item.name.indexOf(obj.voiceState) != -1 || obj.voiceState.indexOf(item.name) != -1
			);
			if (arr.length) {
				if (arr[0].richText) {
					newObj.type = "richText";
					newObj.msgText = arr[0].richText;
				} else {
					newObj.msgText = "你好，该功能暂未开通";
				}
				chatStore.setServiceMessage(newObj);
			} else {
				newObj.msgText = "你好，请描述所需办理的业务";
				chatStore.setServiceMessage(newObj);
			}
			// chatStore.setServiceMessage(newObj)
		} else {
			// let arr = chatStore.dataList.filter(item => item.name.indexOf(msgText) != -1 || msgText.indexOf(item.name) != -1)
			// if(arr.length){
			// 	if(arr[0].richText){
			// 		obj.type = 'richText'
			// 		obj.msgText = arr[0].richText
			// 	}else{
			// 		obj.msgText = "你好，该功能暂未开通"
			// 	}
			// 	chatStore.setServiceMessage(obj)
			// }else{
			// 	obj.msgText = "你好，请描述所需办理的业务"
			// 	chatStore.setServiceMessage(obj)
			// }
			setChat(obj);
		}
		msgListRef?.value?.scrollToBottom();
	};

	const uploadPcm = (data) => {
		console.log("data", data);
		audioSrc.value = data.voice
		
		// return
		// 1. 读文件
		// #ifdef MP-WEIXIN || APP-HARMONY
		
			const fs = uni.getFileSystemManager();
			fs.readFile({
				filePath: data.voice,
				encoding: "base64",
				success: (res) => {
					// console.log("base64res", res);
					getVoictToText(res.data, data);
				},
				fail: (e) => console.error("读文件失败", e),
			});
		// #endif
		// #ifdef APP-PLUS
		plus.io.resolveLocalFileSystemURL(data.voice, (entry) => {
			entry.file(file => {
				const reader = new plus.io.FileReader()
				reader.onloadend = e => {
					getVoictToText(e.target.result.split(',')[1], data);
				}
				reader.readAsDataURL(file)
			})
		});

		// #endif
	};
	// 语音转文字
	const getVoictToText = async (base64Speech, datas) => {
		try {
			const tokRes = await voiceToken();
			const accessToken = tokRes.access_token || null;
			console.log("---------1----", accessToken);
			if (accessToken) {
				// #ifdef APP-HARMONY
					base64Speech = base64Speech.replace(/^AAAAAA......../,'')
				// #endif
				
				const res = await voiceTotext(accessToken, base64Speech);
				if (res.err_no == 0) {
					let valueText = res.result.join()
					if (!valueText) {
						toast('未识别出文字')
						return
					} else {
						let obj = {
							msgText: res.result.join(),
							type: "text",
						};
						queryText.value = res.result.join();
						chatStore.setUserMessage(deepClone(obj));
						msgListRef?.value?.scrollToBottom();
						setTimeout(() => {
							addKfMessage(deepClone(obj));
						}, 100);
					}
				} else {
					toast(e.err_msg);
				}
			} else {
				toast(tokRes.error);
			}
		} catch (e) {
			toast(e.error);
		}
	};
	const setChat = async (messageObj) => {
	    msgListRef.value.isLoading = true;
	
	    // 1. 组装业务参数
	    const customParams = {
	        userCode: getToken(),
	        'user_info': formData.value || undefined,
	        userLat: uni.getStorageSync('address').lat || '',
	        userLon: uni.getStorageSync('address').lng || '',
	        useLon: uni.getStorageSync('address').lng || '', 
	        'member_id': uni.getStorageSync('userInfo').id || '',
	        'memberType': uni.getStorageSync('userInfo').memberType || '1',
	        mobile: parseToken(uni.getStorageSync('Token'))?.member_phone,
	        etcCarId: etcData.value.cardId || undefined,
	        plateNum: plateNum.value || undefined
	    };
	
	    // 2. 调用封装好的多端 LLM 服务
	    chatAiService.sendChat({
	        query: queryText.value,
	        sessionId: uuid,
	        skillId: skillData.value?.skill_id,
	        params: customParams,
	        appClientRef: chatSSEClientRef.value, // 用于安卓端的 SSE 插件
	        // 当收到服务端消息时 (已解决多端数据格式统一问题)
	        onMessage: (parsed, messageId) => {
	            console.log('收到流式消息:', parsed);
	            const { code, data } = parsed;
	            
	            // 提取文本内容 (兼容 llm_result 流式片段和 answer 最终答案)
	            let textFragment = data.llm_result || (code == 200 ? data.answer : '');
	
	            if (textFragment || data.answer || data.queryId) {
	                chatStore.setServiceQueryMessage({
	                    type: 'text',
	                    id: messageId,
	                    queryId: data.queryId,
	                    sessionId: data.sessionId || '',
	                    code: code,
	                    cot: data.cot,
	                    msgText: data.answer || '',       // 完整答案
	                    answer: data.answer || '',
	                    aiData: data.data || null,
	                    isLoading: code !== 200,          // 200 表示完成
	                    streamText: textFragment          // 用于流式打字机效果
	                });
	                
	                msgListRef.value?.scrollToBottom();
	            }
	
	            // 对话结束的独立操作
	            if (code == 200) {
	                console.log('对话完全结束，code 200');
	                etcData.value = {};
	                plateNum.value = '';
	                if (data.answer) {
	                    getVoice(data.answer, true);
	                }
	            }
	        },
	        
	        // 请求报错时
	        onError: (err) => {
	            console.error("流式请求报错:", err);
	            msgListRef.value.isLoading = false;
	            toast(err.message || "服务请求异常");
	        },
	        
	        // 数据流完全关闭时
	        onFinish: () => {
	            console.log("流式连接关闭");
	            msgListRef.value.isLoading = false;
	            formData.value = null; 
	        }
	    });
	};
	
	const messageId = ref('')
	

	const openCore = (response) => {
		//   openLoading.value = false;
		console.log("open sse：", response);
	};
	const errorCore = (err) => {
		msgListRef.value.isLoading = true;
		console.log("error sse：", err);
	};
	const messageCore = (msg) => {
	
		const data = JSON.parse(msg.data)
		console.log('返回数据：',data);
		
		// if (data.data.answer) {
			
		// }
		chatStore.setServiceQueryMessage({
			type: 'text',
			id: messageId.value,
			queryId: data.data.queryId,
			sessionId: data.data.sessionId || '',
			code: data.code,
			cot: data.data.cot,
			msgText: data.data.answer ? data.data.answer : '',
			answer: data.data.answer ? data.data.answer : '',
			aiData: data.data.data || null
		})
		msgListRef.value?.scrollToBottom()
		if(data.code == 200){
			etcData.value = {};
			plateNum.value = ''
			getVoice(data.data.answer,true)
		}
	};
	const finishCore = () => {
		console.log("finish sse");
		msgListRef.value.isLoading = false;
		//   loading.value = false;
	};
	const handleQuery = async () => {
		try {
			const result = await queryAll()
			if (result) {
				console.log(result);
				let total = 15
				for (let i in result) {
					if (result[i]) {
						total += result[i].height
					}
				}
				topHeught.value = total;
			}
		} catch (err) {
			console.log('卡片尺寸shib:', err)
		}
	}
	const getKf = async () => {
		try {
			const res = await manualServiceList();
			const res2 = await skillList();
			if (res.code == 200) {
				chatStore.anualServiceDataList = res.data
				anualServiceDataList.value = res.data
			}
			if (res2.code == 200) {
				skillDataList.value = res2.data
			}
			console.log('---------------res--------3-----------', chatStore.anualServiceDataList);
			console.log('---------------res-------------------', res);
			console.log('---------------code2-------------------', res2);
		} catch (err) {
			console.log('---------------err-------------------', err);
		}


	}
	// 音频初始化
	const audioInit = ()=>{
		audioVoice = uni.createInnerAudioContext() 
		// 音频停止事件
		audioVoice.onPause(event=>{
			console.log('---------------onPause-------------------', event);
			voiceStop()
		})
		// 音频停止事件
		audioVoice.onStop(event=>{
			console.log('---------------onStop-------------------', event);
			voiceStop()
		})
		// 音频自然播放结束事件
		audioVoice.onEnded(event=>{
			console.log('---------------onEnded-------------------', event);
			voiceStop()
		})
		audioVoice.onError(event=>{
			console.log('---------------onError-------------------', event);
			// voiceStop()
		})
	}
	onReady(() => {
		audioInit()
		nextTick(() => {
			
			setTimeout(() => {
				handleQuery()
			}, 300)
		})
	})
	onShow(() => {
		getKf()
		if (!kfDict.value.length) {
			getkfDict();
		}
	})
	onLoad(() => {
		chatStore.getConfig()
	});
	onUnmounted(()=>{
		// 页面卸载，销毁数据
		audioVoice.destroy()
	})
	onHide(()=>{
		voiceStop()
	})
</script>

<style lang="scss">
	.boolBox {
		// min-height: 700rpx;
		padding: 28rpx 34rpx;
		background: linear-gradient( to bottom, #F6FBF7, #FDFEFD );
		.boolBox-img {
			padding: 40rpx 0;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			.boolBox-img-text {
				font-weight: 400;
				font-size: 28rpx;
				color: #9C9CB7;
				line-height: 40rpx;
			}

			.boolBox-image {
				width: 600rpx;
				// height: 600rpx;
			}
		}


		.boolBox-cneter {
			flex: 1;
			align-items: center;
			padding: 40rpx 0;

			.boolBox-cneter-title {
				font-weight: 700;
				font-size: 40rpx;
				color: #3E3E3E;
				line-height: 58rpx;
				text-align: center;
			}

			.boolBox-cneter-text {
				font-weight: 400;
				font-size: 26rpx;
				color: #7A7A7A;
				line-height: 38rpx;
				text-align: center;
				margin-top: 20rpx;
			}

			.boolBox-cneter-but {
				margin: 0 auto;
				width: 420rpx;
				height: 82rpx;
				line-height: 82rpx;
				text-align: center;
				background: #07C07D;
				box-shadow: 0rpx 8rpx 50rpx 0rpx #DBFFD8;
				border-radius: 54rpx 54rpx 54rpx 54rpx;
				font-weight: 400;
				font-size: 28rpx;
				color: #FFFFFF;

			}

			.boolBox-cneter-card {
				margin-top: 70rpx;
				margin-bottom: 118rpx;
				width: 662rpx;
				height: 178rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
				border-radius: 4rpx 4rpx 4rpx 4rpx;
				padding: 0 44rpx;
				display: flex;
				align-items: center;

				.boolBox-cneter-card-img {
					width: 84rpx;
					height: 84rpx;
					margin-right: 20rpx;
				}

				.boolBox-cneter-card-box {

					.boolBox-cneter-card-box-text {
						font-weight: 500;
						font-size: 36rpx;
						color: #424242;
						line-height: 52rpx;
						margin-bottom: 10rpx;
					}

					.boolBox-cneter-card-box-tel {
						font-weight: 400;
						font-size: 32rpx;
						color: #979797;
						line-height: 46rpx;
					}
				}
			}
		}
	}

	.kfBox {
		min-height: 700rpx;
		padding: 28rpx 25rpx;

		.kfBox-title {
			text-align: center;
			font-weight: 500;
			font-size: 32rpx;
			color: #000000;
		}

		.kfBox-tabs {
			padding: 30rpx 0;
		}


		.kfBox-center {
			// min-height: 400rpx;
			// display: flex;
			// flex-wrap: wrap;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 20rpx 25rpx;

			.kfBox-center-item {
				// margin-bottom: 20rpx;
				// margin-right: 25rpx;
				width: 196rpx;
				height: 64rpx;
				background: linear-gradient(to left, #FDF8EE, #FFFCF2);
				border-radius: 4rpx 4rpx 4rpx 4rpx;
				border: 2rpx solid #FF890B;
				position: relative;
				text-align: center;

				.kfBox-center-item-img {
					width: 26rpx;
					height: 26rpx;
					position: absolute;
					left: 12rpx;
					bottom: 12rpx;
				}

				.kfBox-center-item-text {
					text-align: center;
					line-height: 64rpx;
					font-weight: 700;
					font-size: 24rpx;
					color: #222222;
				}
			}

		}

		.kfBox-bottom {
			flex: 1;
			height: 102rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10rpx;
			background: linear-gradient(to right, #E3F6E7, #FEFEFE);
			border-radius: 26rpx 26rpx 26rpx 26rpx;
			.kfBox-bottom-img {
				width: 60rpx;
				height: 80rpx;
			}

			.kfBox-bottom-text {
				font-weight: 400;
				font-size: 28rpx;
				color: #628F2F;
				line-height: 34rpx;
			}

			.kfBox-bottom-but {
				width: 106rpx;
				height: 46rpx;
				line-height: 46rpx;
				text-align: center;
				background: linear-gradient(to right, #80A653, #B2D38A);
				border-radius: 58rpx 58rpx 58rpx 58rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}
	}

	.conView {
		width: 750rpx;
		overflow: hidden;
		height: 100vh;
		/* 固定视口高度 */
	}

	.tooBack {
		width: 702rpx;
		// min-height: 286rpx;
		position: relative;
		margin: 0 24rpx;

		.tooBack-bg {
			width: 702rpx;
			height: 286rpx;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}

		.tooBack-venter {
			width: 702rpx;
			// min-height: 286rpx;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;

			.tooBack-venter-topks {
				width: 702rpx;
				height: 210rpx;
				padding: 50rpx 0 30rpx 32rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;

				.textFont1 {
					font-weight: 500;
					font-size: 42rpx;
					color: #333333;
					line-height: 63rpx;
				}

				.textFont2 {
					width: 460rpx;
					font-weight: 400;
					font-size: 24rpx;
					color: #6E6E6E;
					line-height: 38rpx;
				}
			}

			.scroll-view_H {
				white-space: nowrap;
				width: 702rpx;
				display: flex;
				padding-top: 40rpx;
				box-sizing: border-box;

				.h-item {
					padding: 16rpx 24rpx;
					box-sizing: border-box;
					height: 60rpx;
					background: #FAFFFC;
					border-radius: 30rpx;
					margin-right: 24rpx;
					display: inline-flex;
					align-items: center;
					box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(237, 235, 235, 0.3);

					.h-item-text {
						font-weight: 400;
						font-size: 28rpx;
						color: #07C07D;
						// line-height: 42rpx;
					}

					.h-item-img {
						width: 16rpx;
						height: 16rpx;
						margin-left: 10rpx;
					}
				}

			}

			.tooBack-venter-botBox {
				width: 702rpx;

				background: #FFFFFF;
				border-radius: 38rpx;


				.tooBack-venter-bot {
					width: 702rpx;
					height: 76rpx;
					// background: #FFFFFF;
					border-radius: 38rpx;
					padding: 0 32rpx;
					box-sizing: border-box;
					align-items: center;

					.tooBack-venter-bot-text {
						width: 638rpx;
						height: 76rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.fontText1 {
							font-weight: 500;
							font-size: 32rpx;
							color: #333333;
							line-height: 48rpx;
						}

						.fontText2 {
							width: 400rpx;
							font-weight: 400;
							font-size: 28rpx;
							color: #6E6E6E;
							line-height: 42rpx;
						}

						.imagesBox {
							width: 48rpx;
							height: 48rpx;
						}
					}
				}

				.tooBack-venter-botBox-sw {
					width: 702rpx;
					height: 180rpx;

					.botBox-sw {
						width: 702rpx;
						padding: 0 30rpx 20rpx 30rpx;
						box-sizing: border-box;
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;

						.swiper-item {
							width: 300rpx;
							height: 78rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;

							border-radius: 17rpx;
							margin-bottom: 12rpx;

							.swiper-item-icon {
								width: 58rpx;
								height: 58rpx;
								margin-left: 20rpx;
							}

							.swiper-item-text {
								margin-left: 24rpx;
								font-weight: 400;
								font-size: 28rpx;
								color: #333333;
								line-height: 42rpx;
							}
						}
					}

				}

				.tooBack-venter-botBox-lot {
					display: flex;
					align-items: center;
					justify-content: center;

					.lotItem {
						width: 12rpx;
						height: 12rpx;
						background: #FAFAFA;
						border-radius: 6rpx;
						margin-right: 20rpx;
					}

					.lotItemActive {
						width: 38rpx;
						height: 12rpx;
						background: #EFEFEF;
						border-radius: 6rpx;
						margin-right: 20rpx;
					}
				}
			}

		}

	}

	.topAllView {
		position: relative;
		.tooBack-mokeyBox {
			width: 320rpx;
			height: 320rpx;
			position: absolute;
			top: -60rpx;
			right: 12rpx;
		}
		.tooBack-call {
			width: 76rpx;
			height: 76rpx;
			position: absolute;
			top: -10rpx;
			right: 24rpx;
		}
	}

	.pagesView {
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.topView {
		position: relative;
		height: 200rpx;
		display: flex;
		justify-content: flex-end;
		padding: 0 20rpx;
		box-sizing: border-box;

		.topView-left {
			padding-top: 40rpx;
			width: 510rpx;
			box-sizing: border-box;

			.topView-title {
				display: flex;
				line-height: 50rpx;
				align-items: center;
				font-weight: 800;
				font-size: 40rpx;
				color: #000000;

				image {
					width: 38rpx;
					height: 38rpx;
					margin: 0 5rpx;
				}
			}

			.topView-text {
				font-weight: bold;
				font-size: 40rpx;
				color: #000000;
			}
		}

		.topView-right {
			width: 170rpx;
			height: 200rpx;
			position: absolute;
			top: 0;
			left: 0;
		}
	}

	.card {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		// box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(0, 0, 0, 0.02);
		border-radius: 26rpx;
		background: #F8F9FB;
	}

	.gridView {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 20rpx;

		.gridView-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 130rpx;

			border-radius: 20rpx;

			image {
				width: 75rpx;
				height: 75rpx;
			}

			text {
				margin-top: -15rpx;
				font-weight: 500;
				font-size: 24rpx;
				color: #000000;
			}
		}
	}

	.cardList {
		width: 100%;
		background: #FFFFFF;
		padding: 20rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		margin-top: 20rpx;

		.cardList-title {
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
			padding-bottom: 30rpx;
			// margin-bottom: 20rpx;
		}

		.cardList-center {
			margin-top: 20rpx;
		}

		// .cardList-center {
		//   display: grid;
		//   grid-template-columns: repeat(1, 1fr);
		//   grid-gap: 25rpx;
		// }
		// .cardList-item {
		//   width: 100%;
		//   height: 76rpx;
		//   background: #f5f5f5;
		//   border-radius: 16rpx;
		//   display: flex;
		//   align-items: center;
		//   padding: 24rpx;
		//   box-sizing: border-box;
		//   image {
		//     width: 32rpx;
		//     height: 32rpx;
		//     margin-right: 20rpx;
		//   }
		//   text {
		//     font-weight: 500;
		//     font-size: 26rpx;
		//     color: #000000;
		//   }
		// }
	}

	.absImage {
		width: 750rpx;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
	::v-deep .u-navbar__content {
		background: transparent !important;
	}
	/* 基础按钮样式 */
	.btn-lx {
	  background: linear-gradient( 270deg, #80A653 0%, #B2D38A 100%);
	  color: #ffffff; 
	  border-radius: 50rpx; 
	  border: none; 
	  font-size: 26rpx; 
	  background-clip: padding-box;
	}
	.btn-lx::after {
	  border: none; /* 去掉点击时的默认边框 */
	  background-color: rgba(0, 0, 0, 0.1); /* 点击时的浅灰色遮罩 */
	}
	
	/* H5/APP 端点击态 */
	.btn-lx:active {
	  background-color: #0066dd; /* 点击时背景色加深 */
	}
	.kfBox-flex{
		display: flex;
		align-items: center;
	}
</style>