<template>
	<view class="container" :style="scroStyle" :data-theme="pageTheme">
		<scroll-view 
		      class="scroll-container"
		      scroll-y 
			  :scroll-top="scrollTop"
		      :scroll-into-view="scrollIntoViewId"
		      :scroll-with-animation="true"
			  :style="scroStyle"
		    >
		      <!-- 列表项 -->
			  <view class="pagesView" style="background: transparent;">
			  	<!-- 消息 -->
			  	<view class="messsList">
			  		<view class="messsList-item" v-for="(item,index) in messageList"  :id="'msg-' + index" :key="index" :style="{justifyContent: item.isUserType == 'user'?'flex-end':'flex-start'}">
			  			<!-- <view v-if="item.isUserType == 'service'" class="messsList-item-active">
			  				<image :src="imgUrl+'static/dh_kefu.png'" mode=""></image>
			  			</view> -->
			  			<view class="messsList-item-center">
							<view class="messView" :style="messStyle(item.isUserType)">
								<view class="mseetxt" style="display: block;" v-if="item.isUserType == 'service'">
									<view class="querBoxTitle" @click="item.queryOpenShow = !item.queryOpenShow">
										<up-icon :name="icoUrl+'BdDigitalMan/dmIcon8.png'" size="14"></up-icon>
										<text class="querBoxTitle-text">解析{{item.queryShow?'完成':'中'}}(基于「{{queryTextName(item.cot)}}」技能回答)</text>
										<up-icon name="arrow-down" size="12"></up-icon>
									</view>
									<view class="queryBoxList" v-if="item.cot && item.queryOpenShow">
										<view class="queryBoxList-item" v-for="(el,inc) in item.cot" :key="inc">
											<text class="queryBoxList-item-text">{{Number(inc) + 1}}.{{el.name}}</text>
											<up-icon v-if="el.status == 1" :name="icoUrl+'BdDigitalMan/check-circle-fill@2x.png'" size="14"></up-icon>
											<u-loading-icon v-else text=" " :show="true" size="14"></u-loading-icon>
										</view>
									</view>
								</view>
								<view class="mseetxt" >
									<text v-if="item.type == 'text'">{{item.msgText}}</text>
									<!-- <up-parse style="width: 600rpx;" v-if="item.type == 'richText'" :content="item.msgText"></up-parse> -->
									<!-- <up-parse style="width: 100%" v-if="item.type == 'richText'" :content="item.msgText" @linkTap="handleRichTextTap" ></up-parse> -->
									<up-parse style="width: 100%" v-if="item.type == 'richText'" :content="htmlConter(item.msgText)" @linkTap="handleRichTextTap" ></up-parse>
								</view>
								<view class="bottView" v-if="item.isUserType == 'service'">
									<view class="kfBoxxss" v-if="item.aiData?.action =='human'">
										<view class="kfBoxxss-title">
											<text class="kfBoxxss-title-ttt">请选择您要咨询的业务</text>
											<view class="kfBoxxss-title-right" @click="kfAiOpen('all')">
												<text class="kfBoxxss-title-right-text">全部业务</text>
												<up-icon name="arrow-right" size="12" ></up-icon>
											</view>
										</view>
										<view class="kfBoxxss-center" v-if="item.aiData?.page_data.length">
											<view class="kfBox-center-item" v-for="(el,indx) in item.aiData?.page_data.slice(0,3)" :key="indx" @click="kfAiOpen('item',el)">
												<image class="kfBox-center-item-img" :src="el.iconUrl" mode=""></image>
												<text class="kfBox-center-item-text">{{el.businessContent}}</text>
											</view>
										</view>
									</view>
									<view class="" v-if="item.aiData?.action == 'rescue' && item.aiData?.from_list" style="flex:1">
										<view class="inputView" style="flex:1">
											<text class="labelText">联系电话：</text>
											<view style="flex:1" >
												<up-input placeholder="请输入被救援人电话" type="number" maxlength="11" fontSize="24rpx" border="surround" v-model="formData.customerPhone" ></up-input>
											</view>
											
										</view>
										<view class="inputView" style="flex:1">
											<text  class="labelText">车辆类型：</text>
											<view style="flex:1" @click="carisshow=true">
												<up-input placeholder="请选择车辆类型" type="text" fontSize="24rpx" readonly border="surround" v-model="formData.vehicleType" ></up-input>
											</view>
										</view>
										<view class="submitBut"  @click="formSubmit(item)">提交表单</view>
									</view>
									<view class="vioceBox" v-if="item.aiData?.action =='invoice_choice'">
										<view class="vioceBox-title">请选择开票服务类型</view>
										<view class="vioceBox-jio" style="background: transparent;">
											<view class="vioceBox-text" 
												v-for="(el,ind) in item.aiData.skill_data" 
												:style="{
													color:item.invoiceChoiceSkillId == el.skill_id?'#FFFFFF':'#666666',
													border:`1rpx solid ${item.invoiceChoiceSkillId == el.skill_id?'none':'#666666'}`,
													background:item.invoiceChoiceSkillId == el.skill_id?themeStore.themeColors.$primaryColor:'transparent'
												}" 
												@click="skillIdClick(item,el)">{{el.skill_name}}</view>
										</view>
									</view>
									<view class="vioceBox" v-if="item.aiData?.action =='etc_invoice_list'">
										<view class="vioceBox-jio" style="background: transparent;">
											<text class="vioceBox-text" 
												v-for="(el,ind) in item.aiData.etc_card_list" 
												:style="{
													color:item.invoiceChoiceSkillId == el.cardId?'#FFFFFF':'#666666',
													border:`1rpx solid ${item.invoiceChoiceSkillId == el.cardId?'none':'#666666'}`,
													background:item.invoiceChoiceSkillId == el.cardId?themeStore.themeColors.$primaryColor:'transparent'
												}" 
												@click="etcIdClick(item,el)">{{el.plateNum}}</text>
										</view>
									</view>
									<view class="vioceBox" v-if="item.aiData?.action == 'first_highway_invoice_car'">
										<view class="vioceBox-jio" style="background: transparent;">
											<text class="vioceBox-text" 
												v-for="(el,ind) in item.aiData.car_info" 
												:style="{
													color:item.invoiceChoiceSkillId == el?'#FFFFFF':'#666666',
													border:`1rpx solid ${item.invoiceChoiceSkillId == el?'none':'#666666'}`,
													background:item.invoiceChoiceSkillId == el?themeStore.themeColors.$primaryColor:'transparent'
												}" 
												@click="carIdClick(item,el)">{{el}}</text>
										</view>
									</view>
									<image  
										v-if="item.aiData?.action == 'navigation'" 
										@click="toAddress(item.aiData)"
										class="addBut"
										:src="imgUrl+'yq-dh.png'"
										mode="scaleToFill"
									/>
									
									<view class="bottomBut" v-if="item.isUserType == 'service' && index == (messageList.length - 1)">
										<image class="bottomBut-img" :src="icoUrl+'BdDigitalMan/ai-man-new-icon1.png'" @click="copyText(item.answer)"></image>
										<!-- <image class="bottomBut-img" :src="`${icoUrl}BdDigitalMan/${item.isBobaoShow?'ai-man-new-icon2-true':'ai-man-new-icon2'}.png`" @click="stopTalk(item,index)"></image> -->
										<image class="bottomBut-img" :src="`${icoUrl}BdDigitalMan/${item.isBobaoShow?'ai-man-new-icon2-true':'ai-man-new-icon2'}.png`" @click="stopTalk(item,index)"></image>
										<image class="bottomBut-img" :src="`${icoUrl}BdDigitalMan/${item.positive?'ai-man-new-icon3-true':'ai-man-new-icon3'}.png`" @click="zanClick(item,'POSITIVE')"></image>
										<image class="bottomBut-img" :src="`${icoUrl}BdDigitalMan/${item.negative?'ai-man-new-icon4-true':'ai-man-new-icon4'}.png`" @click="zanClick(item,'NEGATIVE')"></image>
									</view>
									<view v-if="item.isUserType == 'service'" class="textAi">该内容由人工智能AI生成</view>
								</view>
								<view class="">
									
								</view>
							</view>
							<view v-if="item.aiData?.follow_up" class="problem">
							    <view v-for="(follow) in item.aiData.follow_up" :key="follow" @click="followClick(follow)" class="problem-item-wrapper">
							        <text class="problem-item">{{follow}}</text>
							    </view>
							</view>
			  			</view>
			  			<!-- <view v-if="item.isUserType == 'user'" class="messsList-item-active" style="text-align: right;">
			  				<image :src="imgUrl+'static/dh_user.png'" mode=""></image>
			  			</view> -->
			  		</view>
			  	</view>
			  </view>
		      <!-- 可选：一个占位元素，确保能滚动到最后 -->
			  <!-- <view class="loaView" v-if="isLoading">
					 <u-loading-icon text="查询中" :show="isLoading"></u-loading-icon>
			  </view> -->
		      <view id="bottom"></view>
		    </scroll-view>
			<up-picker :show="carisshow" :columns="carcolumns" @cancel='carisshow=false' @confirm='confirmdownCar' keyName="label" valueName="value"></up-picker>
			<up-popup :show="negaShow" mode="center" z-index="999" @close="close()" round="10">
				<view class="feedBox">
					<text class="feedBox-title">您不认可该回复的原因是什么？</text>
					<view class="feedBox-tebs">
						<text class="feedBox-tebs-text" :class="[negaForm.negativeFeedbackType == item.value?'activeText':'']" v-for="(item,index) in chatStore.feedbackTypeList" :key="index" @click="negaForm.negativeFeedbackType = item.value">{{item.name}}</text>
					</view>
					<view class="">
						<up-textarea v-model="negaForm.feedbackContent" height="150" placeholder="请输入内容" ></up-textarea>
					</view>
					<view class="feedBox-buts">
						<text class="feedBox-buts-item buts1" @click="close()">取消</text>
						<text class="feedBox-buts-item buts2" @click="submit">确认</text>
					</view>
				</view>
			</up-popup>
	</view>
	
</template>

<script setup lang="ts">
	import {ref,reactive,computed,onMounted} from 'vue';
	import { deepClone } from '@/uni_modules/uview-plus';
	import { imgUrl } from '@/config';
	import { toBack,toNav } from "@/utils/route";
	// import { openLocation } from "@/utils/util";
	import {ChatStore} from '@/store/modules/chat';
	import { carTypeList } from '@/api/rescue';
	import {  openLocation,copyText,formatTimestamp } from '@/utils/util';
	import {getOpenToken, feedbackAi,feedbackDeleteAi } from '@/api/openApi';
	import { toast } from '@/utils/common';
	
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const chatStore = ChatStore();
	const scrollIntoViewId = ref<string>('bottom') // 默认指向底部占位符
	const emits = defineEmits(["butChange","followClick",'formSubmit','stopTalk','kfAiOpen','skillId','etcId','carNumber']);
	const scrollTop = ref(0);
	const isLoading = ref(false)
	const porps = defineProps({
		height: {
			type: String,
			default: ''
		},
	});
	const kfAiOpen = (type,item)=>{
		emits('kfAiOpen',{type,item,clearType:true});
	}
	const htmlConter = computed(()=>{
		return (text)=>{
			return `<p style='font-size:28rpx;color:#333333;line-height: 48rpx;'>${text}</p>`
		}
	});
	const negaShow = ref(false);
	const negaObj = ref({});
	const negaForm = ref({
		negativeFeedbackType:'',
		feedbackContent:'',
	});
	const scroStyle = computed(()=>{
		let style = {};
		if(porps.height){
			style.height = porps.height;
		}
		return style;
	});
	const queryTextName = computed(()=>{
		return (cot)=>{
			let title = '大模型'
			console.log();
			if(cot && Array.isArray(cot) && cot.length){
				if(cot[0].outputs){
					title = cot[0].outputs.name
				}
			}
			
			return title
		}
	})
	// --- 音频播放相关 ---
	const audioContext = uni.createInnerAudioContext()
	const playingVoiceId = ref<string | null>(null) // 当前播放的语音ID
	
	const carisshow = ref<boolean>(false);
	const carcolumns = ref<any>([]);
	const formData = reactive({
		memberId:'',
		// 被救援人姓名
		customerName: '',
		// 被救援人电话
		customerPhone: '',
		// 故障车牌号
		handFilledLicensePlate: '',
		// 车辆类型
		vehicleType: '',
		// 车辆类型值
		vehicleTypeValue: '',
		// 救援地址
		fault: {
			address: '',
			longitude: '',
			latitude: ''
		},
		// 目的地址
		destination: {
			address: '',
			longitude: '',
			latitude: ''
		},
		// 行驶方向
		direction: '',
		// 高速公路路段
		highwayName: '',
		// 高速公路路段
		highwayNameId: '',
		// 占据车道
		lane: ''
	});
	const confirmdownCar = (e : any) => {
		const station = e.value[0]
		console.log("e", e)
		formData.vehicleType = station.label
		carisshow.value = false
	}
	const followClick = (item)=>{
		emits('followClick',{msgText:item,clearType:true});
	}
	const messageList = computed(() =>{
		return chatStore.list
	})
	const list = computed(()=>{
		return (type:string) =>{
			return chatStore.dataList.filter(item => item.type == type)
		}
	})
	const messStyle = computed(()=>{
		return (isUserType:string)=>{
			interface Style {
				background?:string;
				borderRadius?:string;
				color?:string;
			}
			let style:Style = {}
			if(isUserType == 'user'){
				style.background=themeStore.themeColors.$DigitaColor;
				style.borderRadius='32rpx 32rpx 0rpx 32rpx';
				style.color='#FFFFFF';
			}
			if(isUserType == 'service'){
				style.background='#FFFFFF';
				style.borderRadius='32rpx';
				style.color='#000000';
			}
			
			return style
		}
	});
	const formSubmit = (item)=>{
		const phoneReg = /^1[3-9]\d{9}$/;
		if(!formData.customerPhone) return toast('请填写手机号码');
		if (!phoneReg.test(formData.customerPhone)) {
			return toast('请输入正确的手机号格式');
		}
		if(!formData.vehicleType) return toast('请选择车辆类型');
		formData.customerName = formData.customerPhone
		formData.memberId = uni.getStorageSync('userInfo').id
		emits('formSubmit',{msgText:'确定提交救援订单',formData:deepClone(formData),clearType:true});
		delete item.aiData.from_list;
		resetForm()
	}
	const resetForm = ()=>{
		formData.customerPhone = '';
		formData.customerName = '';
		formData.vehicleType = '';
	}
	const toAddress = (item)=>{
		openLocation({
			latitude:item.destination.latitude,
			longitude:item.destination.longitude,
			name:item.destination.name,
		})
	};
	const scrollToBottom = () => {
	  scrollTop.value = messageList.value.length * 999;
	  setTimeout(() => {
	    scrollTop.value += 1;
	  }, 400);
	};
	// 选择功能按钮
	const selectClick = (item)=>{
		emits('butChange',{msgText:item.name,clearType:true});
	}
	// --- 播放语音 ---
	const playVoice = (voicePath: string, messageId: string) => {
	  // 如果正在播放其他语音，先停止
	  if (playingVoiceId.value && playingVoiceId.value !== messageId) {
	    audioContext.stop()
	  }
	  // 如果点击的是当前正在播放的语音，暂停播放
	  if (playingVoiceId.value === messageId) {
	    audioContext.pause()
	    playingVoiceId.value = null
	    return
	  }
	  // 播放新语音
	  audioContext.src = voicePath
	  audioContext.play()
	  playingVoiceId.value = messageId
	  
	  audioContext.onEnded(() => {
	    playingVoiceId.value = null
	  })
	  
	  audioContext.onError((res) => {
	    console.error('播放失败:', res.erssrMsg)
	    uni.showToast({ title: '播放失败', icon: 'none' })
	    playingVoiceId.value = null
	  })
	}
	//汽车类型
	const carTypefun = async () => {
		const res = await carTypeList();
		carcolumns.value = [res.data]
	}
	
	const handleRichTextTap=(e)=>{
		toNav(e['data-link'])
		console.log('-00990878966465587',e);
	}
	// 播报
	const stopTalk = (item,index)=>{
		
		emits('stopTalk',{
			text:item.answer || item.msgText,
			id:item.id,
			index:index,
			isBobaoShow:item.isBobaoShow,
			voiceUrl:item.voiceUrl,
			clearType:true
		});
		// if(item.isBobaoShow){
		// 	item.isBobaoShow = false
		// }else{
		// 	item.isBobaoShow = true
		// }
		
	}
	
	const zanClick = (item,type)=>{
		if(type == 'POSITIVE'){
			if(item.positive){
				delFeed(item,type)
			}else{
				praiseClick(item,type)
			}
			
		}else{
			if(item.negative){
				delFeed(item,type)
			}else{
				negaObj.value = item
				negaShow.value = true;
			}
		}
	}
	const close = () => {
		negaShow.value = false;
		negaObj.value = {}
		negaForm.value = {
			negativeFeedbackType:'',
			feedbackContent:'',
		}
	}
	const submit = () => {
		if(!negaForm.value.negativeFeedbackType && !negaForm.value.feedbackContent) return toast('内容不能为空')
		praiseClick(negaObj.value,'NEGATIVE')
	}
	const praiseClick = async (item,type)=>{
		//  type POSITIVE 正反馈，NEGATIVE负反馈
		try{
			const requestTime = formatTimestamp(new Date().getTime() - 1000, 'YYYY-MM-DD HH:mm:ss');
			const tokenRes:any = await getOpenToken(requestTime);
			if (tokenRes.status === 200){
				let params = {
					requestTime:requestTime,
					feedbackType:type,
					sessionId:item.sessionId,
					queryId:item.queryId,
					lastQueryId:item.queryId,
					feedbackContent:'',
				}
				if(type == 'NEGATIVE'){
					if(negaForm.value.feedbackContent){
						params.feedbackContent = negaForm.value.feedbackContent
						params.negativeFeedbackType = 'OTHER'
					}
					if(negaForm.value.negativeFeedbackType){
						params.feedbackContent = ''
						params.negativeFeedbackType = negaForm.value.negativeFeedbackType
					}
				}
				console.log('09-=-=================',params);
				const ress = await feedbackAi(tokenRes.result,params)
				if(ress.status == 200){
					item.feedbBackId = ress.result
					if(type == 'POSITIVE'){
						item.positive = true
						item.negative = false
					}else{
						item.negative = true
						item.positive = false
					}
					close()
					uni.showToast({ title: type == 'POSITIVE'?'点赞成功':'反馈成功', icon: 'none' })
				}else{
					uni.showToast({ title: '提交失败', icon: 'none' })
				}
				console.log('0--0-0--0-00-0-0-09-0--0',ress);
				
			}else{
				uni.showToast({ title: 'token获取失败', icon: 'none' })
			}
		}catch(e){
			console.log('-----------------0',e);
			uni.showToast({ title: e.message, icon: 'none' })
		}
	}
	
	const delFeed = async (item,type)=>{
		console.log('=--=-0--990-9',item);
		try{
			const requestTime = formatTimestamp(new Date().getTime() - 1000, 'YYYY-MM-DD HH:mm:ss');
			const tokenRes:any = await getOpenToken(requestTime);
			if(tokenRes.status == 200){
				const ress = await feedbackDeleteAi(tokenRes.result,{
					requestTime:requestTime,
					id:item.feedbBackId
				})
				if(ress.status == 200){
					item.feedbBackId = ress.result
					item.positive = false
					item.negative = false
					uni.showToast({ title: '取消成功', icon: 'none' })
				}else{
					console.log('yteuiopfcgvhbjnklm;,.');
					// uni.showToast({ title: '取消失败', icon: 'none' })
					item.positive = false
					item.negative = false
				}
			}else{
				uni.showToast({ title: '获取token失败', icon: 'none' })
			}
		}catch(err){
			console.log('-----------',err);
		}
	}
	// 通用更新方法（鸿蒙安全）
	const updateChatItem = (index: number, key: string, value: any) => {
		console.log('------------1111111111111-------------------');
	    if (index === null || index === undefined || !chatStore.list[index]) return;
		console.log('------------2222222222222-------------------');
	    chatStore.list[index][key] = value;
	};
	const skillIdClick = (item,el)=>{
		item.invoiceChoiceSkillId = el.skill_id
		emits('skillId',el);
	}
	const etcIdClick = (item,el)=>{
		item.invoiceChoiceSkillId = el.cardId
		// emits('etcId',el);
		emits('etcId',{obj:el,skillId:item.aiData.skill_info});
	}
	const carIdClick = (item,el)=>{
		item.invoiceChoiceSkillId = el
		// emits('carNumber',el);
		emits('carNumber',{text:el,skillId:item.aiData.skill_info});
	}
	onMounted(()=>{
		carTypefun();
		scrollToBottom()
	})
	defineExpose({
	  scrollToBottom,
	  isLoading,
	  updateChatItem
	});
</script>

<style lang="scss" scoped>
	.textAi{
		font-size: 26rpx;
		padding: 0 30rpx 30rpx 30rpx;
		color: #666666;
	}
	.vioceBox{
		.vioceBox-title{
			font-size: 28rpx;
			color:#000000;
			margin-bottom: 20rpx;
		}
		.vioceBox-jio{
			display: flex;
			flex-direction: row;
			align-items: center;
			
		}
		.vioceBox-text{
			width: 220rpx;
			line-height: 60rpx;
			text-align: center;
			font-size: 26rpx;
			// color:#666666;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			// border: 1rpx solid #666666;
			border-radius: 10rpx;
		}
	}
	.kfBoxxss{
		.kfBoxxss-title{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;
			.kfBoxxss-title-ttt{
				font-weight: 400;
				font-size: 28rpx;
				color: rgba(0,0,0,0.85);
				line-height: 40rpx;
			}
			.kfBoxxss-title-right{
				display: flex;
				align-items: center;
				.kfBoxxss-title-right-text{
					font-weight: 400;
					font-size: 24rpx;
					color: #989898;
					line-height: 34rpx;
				}
			}
		}
		.kfBoxxss-center{
			display: flex;
			// flex-wrap: wrap;
			.kfBox-center-item{
				margin-right: 10rpx;
				width: 196rpx;
				height: 64rpx;
				background: linear-gradient( to left, #FDF8EE, #FFFCF2 );
				border-radius: 4rpx 4rpx 4rpx 4rpx;
				// border: 2rpx solid #FF890B;
				text-align: center;
				position: relative;
				.kfBox-center-item-img{
					width: 26rpx;
					height: 26rpx;
					position: absolute;
					left: 12rpx;
					bottom: 12rpx;
				}
				.kfBox-center-item-text{
					text-align: center;
					line-height: 64rpx;
					font-weight: 700;
					font-size: 24rpx;
					color: #222222;
				}
			}
		}
		
	}
	.querBoxTitle{
		flex: 1;
		height: 44rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.querBoxTitle-text{
			width: 523rpx;
			height: 28rpx;
			line-height: 28rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
			text-align: left;
		}
	}
	.queryBoxList{
		flex: 1;
		margin-top: 10rpx;
		.queryBoxList-item{
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
		}
		.queryBoxList-item-text{
			font-weight: 400;
			font-size: 24rpx;
			color: #6E6E6E;
		}
	}
	.feedBox{
		width: 660rpx;
		padding: 30rpx;
		border-radius: 30rpx;
		.feedBox-buts{
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			padding-top: 25rpx;
			.feedBox-buts-item{
				width: 260rpx;
				height: 70rpx;
				border-radius: 15rpx;
				line-height: 70rpx;
				text-align: center;
				display: inline-block;
			}
			.buts1{
				border: 1rpx solid #EEEEEE;
			}
			.buts2{
				background: #539DFF;
				color: #FFFFFF;
			}
		}
		.feedBox-title{
			font-size: 30rpx;
			font-weight: bold;
			
		}
		.feedBox-tebs{
			padding: 20rpx 0;
			flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			.feedBox-tebs-text{
				display: inline-block;
				width: 180rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size: 24rpx;
				border: 1rpx solid #EEEEEE; 
				border-radius: 14rpx;
			}
			.activeText{
				color: #FFFFFF;
				background: #539DFF;
				border: 1rpx solid #539DFF; 
			}
		}
	}
	.bottomBut{
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding: 10rpx 20rpx 20rpx 20rpx;
		border-top: 1rpx solid #EEEEEE; 
		.bottomBut-img{
			width: 65rpx;
			height: 65rpx;
			margin-right: 30rpx;
		}
	}
	.container {
		width: 100%;
	  height: calc(100vh - 180rpx);
	  box-sizing: border-box;
	  // position: absolute;
	  // top: 0;
	}
	.inputView{
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		.labelText{
			font-size: 26rpx;
		}
	}
	
	.bottView{
		padding: 20rpx 25rpx;
		// display: flex;
		justify-content: flex-end;
		.addBut{
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
		}
		.submitBut{
			width: 160rpx;
			height: 60rpx;
			background-color: var(--primary-color);
			font-size: 28rpx;
			line-height: 60rpx;
			text-align: center;
			border-radius: 20rpx;
			color: #FFFFFF;
			font-size: 26rpx;
		}
	}
	
	.loaView{
		
		display: flex;
		justify-content: flex-start;
		padding: 0 0 20rpx 50rpx;
	}
	.scroll-container {
	  flex: 1;
	  height: 100%;
	  max-height: 100%;
	}
	.problem{
		max-width: 100%;
	    .problem-item-wrapper {
	        display: inline-block;
	        margin-top: 20rpx;
			max-width: 100%;
			border-radius: 12rpx;
			border: 1px solid #D3E7D1;
			
			padding: 24rpx 24rpx;
	    }
	    .problem-item{
	        font-size: 28rpx;
	        
			// max-width: 440rpx;          /* 限制最大宽度（可按实际调整） */
			// white-space: normal;        /* 允许换行 */
			// word-break: break-all;      /* 英文/数字超长时强制换行 */
	    }
	}
	.messsList{
		width: 100%;
		padding: 30rpx 0;
		box-sizing: border-box;
		.messsList-item{
			width: 100%;
			display: flex;
			align-items: flex-start;
			
			padding-bottom: 30rpx;
			.messsList-item-active{
				width: 85rpx;
				
				image{
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}
			.messsList-item-center{
				max-width: 100%;
				.messView{

				}
				.mseetxt{
					padding: 12rpx 32rpx;
					box-sizing: border-box;
					font-weight: 500;
					font-size: 28rpx;
					line-height: 50rpx;
					display: flex;
					.voicView{
						display: flex;
						align-items: center;
						image{
							width: 40rpx;
							height: 40rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
	}
	.voice-message {
	  display: flex;
	  align-items: center;
	  // padding: 10px 15px;
	  // background-color: #f0f0f0;
	  // border-radius: 18px;
	  cursor: pointer;
	  // min-width: 80px;
	}
	.cardList-item {
	  width: 400rpx;
	  // height: 76rpx;
	  // background: #f5f5f5;
	  // border-radius: 16rpx;
	  display: flex;
	  align-items: center;
	  padding: 6rpx 0;
		margin-bottom: 25rpx;
		  .cardList-item-img {
			width: 32rpx;
			height: 32rpx;
			margin-right: 20rpx;
		  }
		.cardList-item-dot{
			font-size: 64rpx;line-height: 26rpx;color: #539DFF;
		}
	  .cardList-item-text {
	    font-weight: 500;
	    font-size: 26rpx;
	    color: #539DFF;
	  }
	}
	.my-message .voice-message {
	  background-color: #ffffff;
	  border-bottom-right-radius: 4px;
	}
	
	.other-message .voice-message {
	  background-color: #ffffff;
	  border-bottom-left-radius: 4px;
	}
	.voice-wave {
	  display: flex;
	  align-items: center;
	  margin-right: 10px;
	}
	
	.wave-bar {
	  width: 3px;
	  background-color: #666;
	  margin: 0 1px;
	  border-radius: 2px;
	  transition: all 0.3s ease;
	}
	
	.wave-bar.playing {
	  animation: wave 1s ease-in-out infinite alternate;
	}
	
	@keyframes wave {
	  0% {
	    transform: scaleY(0.5);
	  }
	  100% {
	    transform: scaleY(1.5);
	  }
	}
	
	.voice-duration {
	  font-size: 14px;
	  color: #666;
	}
</style>