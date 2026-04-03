<template>
	<view class="fixedView2" :data-theme="pageTheme">
		<!-- 根据输入框内容筛选符合的功能 -->
		<!-- <view class="fixedView-select" v-if="messageValue">
			<view class="fixedView-select-item" v-for="(item,index) in selectList" :key="index"
				@click="selectClick(item)">{{item.name}}</view>
		</view> -->
		<!-- <view class="fixedView-topLabel" v-else>
			<view class="fixedView-topLabel-item" v-for="(item,index) in list('label-top-but')" :key="index"
				:style="{color:item.color}" @click="selectClick(item)">{{item.name}}</view>
		</view> -->
		<view class="fixedView-card">
			<view class="fixedView-inputs">
				<view class="fixedView-inputs-item" v-if="isText">
					<up-icon :name="icoUrl+'BdDigitalMan/kefu.gif'" size="44"></up-icon>
					<up-textarea v-model="messageValue" placeholder="请输入您要咨询的问题" autoHeight height="44rpx" :adjust-position="true" border='none'></up-textarea>
					<view class="fl-al-ce">
						<up-icon v-if="messageValue" :name="icoUrl+'BdDigitalMan/submt-icon.png'" size="28" @click="subClick"></up-icon>
						<up-icon v-else :name="icoUrl+'BdDigitalMan/dmIcon4.png'" size="28" @click="textChange"></up-icon>
					</view>
					<!-- <up-input placeholder="请输入您要咨询的问题" border="none" v-model="messageValue" @confirm="subClick">
						<template #prefix>
							<view style="padding: 0 10rpx;">
								<up-icon :name="imgUrl+'BdDigitalMan/kefu.gif'" size="44"></up-icon>
							</view>
						</template>
						<template #suffix>
							<up-icon v-if="messageValue" :name="imgUrl+'BdDigitalMan/submt-icon.png'" size="28" @click="subClick"></up-icon>
							<up-icon v-else :name="imgUrl+'BdDigitalMan/dmIcon4.png'" size="28" @click.stop="textChange"></up-icon>
						</template>
					</up-input> -->
				</view>
				
				<view class="fixedView-inputs-item" v-else style="display: flex;justify-content: space-between;align-items: center;">
					
					<up-icon :name="icoUrl+'BdDigitalMan/kefu.gif'" size="44"></up-icon>
					<!-- #ifdef APP -->
						<RecorderApp @change="recorderChange"></RecorderApp>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
						<RecorderApp @change="recorderChange"></RecorderApp>
					<!-- #endif -->
					<up-icon :name="icoUrl+'BdDigitalMan/dmIcon7.png'" size="25" @click="isText = !isText"></up-icon>
				</view>
				<!-- <up-icon :name="imgUrl+'static/dh_tel.png'" color="#FFFFFF" size="44"></up-icon> -->
			</view>
			<!-- <view class="fixedView-bottLabel">
				<view class="fixedView-bottLabel-item" :class="[isDeepThinking?'activeClass':'']" @click="opChange(1)">
					<image :src="`${imgUrl}static/${isDeepThinking?'dh_deek2':'dh_deek1'}.png`"></image>
					<text>深度思考</text>
				</view>
				<view class="fixedView-bottLabel-item" :class="[isNetworkedSearch?'activeClass':'']"
					@click="opChange(2)">
					<image :src="`${imgUrl}static/${isNetworkedSearch?'dh_search2':'dh_search1'}.png`"></image>
					<text>联网搜索</text>
				</view>
			</view> -->
		</view>
	</view>

	
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import Recorder from './Recorder.vue';
	import RecorderApp from './RecorderApp.vue';
	import { ChatStore } from '@/store/modules/chat';
	import type {VoiceRecordResult} from "../types";
	import { requestMicrophonePermission } from '@/utils/usePermission';
	// #ifdef APP-HARMONY
		import "@/uni_modules/harmony-permissions"
	// #endif
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const chatStore = ChatStore();
	
	const messageValue = ref<string>('');

	const emits = defineEmits(["inputChange"]);
	const isDeepThinking = ref<boolean>(true); // 是否开启深度思考
	const isNetworkedSearch = ref<boolean>(false); // 是否开启联网搜索

	const isText = ref(true);// 是文字

	const props = defineProps({
		dataList: {
			type: Array,
			default: () => []
		},
	});
	const list = computed(() => {
		return (type : string) => {
			return props.dataList.filter(item => item.type == type)
		}
	})
	const selectList = computed(() => {
		let arr = []
		if (messageValue.value) {
			arr = props.dataList.filter(item => item.name.indexOf(messageValue.value) != -1)
		}
		return arr
	})
	// 选择功能按钮
	const subClick = () => {
		if (!messageValue.value) return
		emits('inputChange', {msgText:messageValue.value,clearType:true});
		messageValue.value = ''
	}
	const selectClick = (item) => {
		console.log(item.name);
		messageValue.value = ''
		emits('inputChange', {msgText:item.name,clearType:true});
	}
	/* 开启/关闭深度思考，联网搜索 */
	const opChange = (type : number) => {
		if (type == 1) {
			isDeepThinking.value = !isDeepThinking.value
		}
		if (type == 2) {
			isNetworkedSearch.value = !isNetworkedSearch.value
		}
	}
	const textChange = async() =>{
		console.log('099099009098080');
		const hasPermission = await requestMicrophonePermission();
		if (!hasPermission) {
		  uni.showToast({ title: '未获取麦克风权限', icon: 'none' });
		  return;
		}
		isText.value = !isText.value
	}
	const recorderChange = async (event:VoiceRecordResult)=>{
		console.log(event);
		if(event.success){
			// #ifdef APP-HARMONY
			// ① 保存到沙盒（鸿蒙必须）
				const saved = await uni.saveFile({ tempFilePath: event.filePath });
				console.log('-0-00-0-0saved-0-0--0-',saved);
				const savedPath = saved.savedFilePath; // 真实可用路径
				emits('inputChange', {voice:savedPath,duration:event.duration,voiceState:event.voiceState});
			// #endif
			// #ifdef MP-WEIXIN
				emits('inputChange', {voice:event.filePath,duration:event.duration,voiceState:event.voiceState});
			// #endif
		}
	}
	
	defineExpose({
	  messageValue
	});
</script>

<style lang="scss" scoped>
	.fixedView2 {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		

		.fixedView-select {
			background: #FFFFFF;

			.fixedView-select-item {
				font-size: 26rpx;
				padding: 0 50rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-bottom: 1rpx solid #F5F5F5;
			}
		}

		.fixedView-topLabel {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 30rpx;
			box-sizing: border-box;

			.fixedView-topLabel-item {
				width: 156rpx;
				height: 60rpx;
				line-height: 60rpx;
				background: #FFFFFF;
				border-radius: 16rpx;
				text-align: center;
				font-weight: 500;
				font-size: 24rpx;
			}
		}

		.fixedView-card {
			width: 100%;
			// background: #FFFFFF;
			padding: 20rpx 30rpx 50rpx 30rpx;
			box-sizing: border-box;

			.fixedView-inputs {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.fixedView-inputs-item {
					// width: 586rpx;
					width: 100%;
					min-height: 88rpx;
					background: #FFFFFF;
					border-radius: 44rpx;
					display: flex;
					align-items: center;
					padding: 0 20rpx;
					box-sizing: border-box;
					position: relative;

					.fixedView-inputs-item-but {
						font-size: 24rpx;
						color: #FFFFFF;
						background: var(--primary-color);
						padding: 5rpx 20rpx;
						border-radius: 20rpx;
					}

					.fixedView-inputs-item-icon {
						position: absolute;
						left: 30rpx;
						top: 23rpx;
					}

					.fixedView-inputs-item-text {
						width: 100%;
						display: block;
						text-align: center;
						font-weight: bold;
						font-size: 32rpx;
						color: #FFFFFF;
					}
				}
				.bgcolora{
					background: var(--primary-color);
				}
				.fixedView-inputs-icon {
					width: 88rpx;
					height: 88rpx;
					border-radius: 44rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}


		}

		.fixedView-bottLabel {
			padding-top: 20rpx;
			display: flex;
			align-items: center;

			.activeClass {
				color: var(--primary-color) !important;
			}

			.fixedView-bottLabel-item {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 200rpx;
				height: 56rpx;
				background: #F5F5F5;
				border-radius: 28rpx;
				font-weight: 500;
				font-size: 24rpx;
				color: #000000;
				margin-right: 20rpx;

				image {
					width: 26rpx;
					height: 26rpx;
					margin-right: 15rpx;
				}
			}

		}
	}

	.recording-popup {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		z-index: 1000;
	}

	.popup-content {
		width: 100%;
		height: 450rpx;
		
		// background-size: 750rpx 450rpx;
		// background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		.popup-content-backg{
			width: 100%;
			height: 450rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.popup-content-line {
			width: 194rpx;
			height: 30rpx;
		}

		.popup-content-text {
			font-weight: 500;
			font-size: 26rpx;
			color: #666666;
			padding: 32rpx 0;
		}

		.popup-content-icon {
			width: 216rpx;
			height: 216rpx;

		}
	}
</style>
