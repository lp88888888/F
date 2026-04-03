<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar title="订单记录" bgColor="transparent" @leftClick="toBack"  :placeholder="false" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="con">
		  
		  <image :src="imgUrl+'static/scanPay_navBg-new1.png'" class="header-bg" />
		  <view :class="['whiteBg-zw',carTypeIndex==1?'height-small':'height-big']"></view>
		  <view class="whiteBg">
		    <view class="change">
		      <view class="tex32_33_b">请选择缴费车辆</view>
		      <view>
		        <text @click="changeCarTypeIndex(1)" :class="[carTypeIndex==1?'active':'']">已绑定车辆</text>
		        <text @click="changeCarTypeIndex(2)" :class="[carTypeIndex==2?'active':'']">临时车辆</text>
		      </view>
		    </view>
		
		    <view class="numCon" style="margin-top: 40rpx;" @click="showCarKeyboard">
		      <view v-for="(item,index) in carNum" :key="index">
		        <!-- 蓝牌 -->
		        <block v-if="carType == 'b'">
		          <view class="carNumBg bg_blue" v-if="item != '?'" @click="selectCity(index)">{{item}}</view>
		          <view class="carNumBg bg_normal" v-else></view>
		        </block>
		        <!-- 黄牌 -->
		        <block v-else-if="carType == 'y'">
		          <view class="carNumBg bg_yellow" v-if="item != '?'" @click="selectCity(index)" >{{item}}</view>
		          <view class="carNumBg bg_normal" v-else></view>
		        </block>
		        <!-- 绿牌 -->
		        <block v-else-if="carType == 'g'" >
		          <view class="carNumBg bg_green" v-if="item != '?'" @click="selectCity(index)">{{item}}</view>
		          <view class="carNumBg bg_normal" v-else></view>
		        </block>
		        <!-- 黄绿 -->
		        <block v-else-if="carType == 'yg'">
		          <block v-if="index < 2">
		            <view class="carNumBg bg_yellow" v-if="item != '?'" @click="selectCity(index)" >{{item}}</view>
		            <view class="carNumBg bg_normal" v-else></view>
		          </block>
		          <block v-else>
		            <view class="carNumBg bg_green" v-if="item != '?'" >{{item}}</view>
		            <view class="carNumBg bg_normal" v-else></view>
		          </block>
		        </block>
		      </view>
		      <!-- <view class="carNumBg3" wx:if="{{carType!='g'&&carType!='yg'}}">新能源</view> -->
		      <view class="carNumBg3Con">
		        <view class="carNumBg3" @click="carTypeIndex==2?'changeCarType':''">新能源</view>
		        <image class="bg3Label" :src="`${imgUrl}${carType=='g'?'ic_ad_select.png':'ic_ad_normal.png'}`" v-if="carTypeIndex==2" />
		      </view>
		    </view>
		    <block v-if="carTypeIndex==1">
		      <view class="default-truth">
		        <image :src="imgUrl+'ic_ad_select.png'" mode="" />
		        <text>默认选择此绑定车辆</text>
		      </view>
		    </block>
		    <view class="btn" @click="toPay">缴费</view>
		  </view>
		
		  <block v-if="temporary.length>0">
		    <view class="tex32_33" style="margin-top:30rpx">历史缴费车辆</view>
		    <view class="whiteBg-look">
		      <view class="historyItem" v-for="(item,index) in temporary" :key="index">
		        <text class="tex32_33_b" style="flex: 1;">{{item}}</text>
		        <view class="payBtn" @click="toPay(item)">缴费</view>
		      </view>
		    </view>
		  </block>
		</view>
		
		
		<!-- <image class="service-btn" bindtap="copyWx" :src="imgUrl+'scanPay_service.png'" mode="" /> -->
		<u-keyboard v-model:show="showPlateInput" mode="car" :random="false" :autoChange="true" :overlay="true"
			:closeOnClickOverlay="true" :zIndex="10086" @change="onKeyChange" @backspace="onBackspace"
			@confirm="onConfirm" @close="onClose" @cancel="onClose" />
		<!-- 车牌号键盘 -->
		<!-- <car-plate show="{{}}" bindchange="handlePlateChange" type="{{inputType}}" bindconfirm="handlePlateConfirm" binddelete="handlePlateDelete" bindclose="handlePlateClose" /> -->
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const carNum = ref('陕??????')//?占位符
	const temporary = ref([])
	const carTypeIndex = ref(2);
	
	const changeCarTypeIndex = (type)=>{
		carTypeIndex.value = type
	}
	
	
	 
	
	const carType = ref<'b' | 'y' | 'g' | 'yg'>('b');
	const showPlateInput = ref<boolean>(false);
	const currentIndex = ref<number>(-1);        // 当前编辑的位
	const btnEnabled = ref<boolean>(true);
	const saveFlag = ref<boolean>(true);
	const modalIsShow = ref<boolean>(false);     // 简化为确认绑定弹窗
	const maxLen = computed(() => (carType.value === 'g' || carType.value === 'yg') ? 8 : 7);
	// 键盘：输入一个字符（u-keyboard car 会自动进行省份->字母数字两段切换）
	
	const onKeyChange = (val : string) => {
		if (!showPlateInput.value) return;
		// 防守：无有效 index 时回到首个 '?'
		if (currentIndex.value < 0 || currentIndex.value >= maxLen.value) {
			const firstQ = carNum.value.indexOf('?');
			currentIndex.value = firstQ !== -1 ? firstQ : (maxLen.value - 1);
		}
	
		let s = normalizeCarNumToMaxLen(carNum.value, maxLen.value);
		s = replaceAt(s, currentIndex.value, val);
		carNum.value = s;
	
		// 移动到下一个 '?'
		const nextQ = s.indexOf('?', currentIndex.value + 1);
		if (nextQ !== -1 && nextQ < maxLen.value) {
			currentIndex.value = nextQ;
		} else {
			// 若已经填满，置为最后一位，便于继续修正
			currentIndex.value = maxLen.value - 1;
		}
	};
	// 键盘：退格
	const onBackspace = () => {
		let s = normalizeCarNumToMaxLen(carNum.value, maxLen.value);
	
		// 如果当前位是 '?' 或未选定，寻找最后一个非 '?' 的位删除
		let idx = currentIndex.value;
		if (idx < 0 || idx >= maxLen.value || s[idx] === '?') {
			idx = lastFilledIndex(s);
		}
		if (idx >= 0) {
			s = replaceAt(s, idx, '?');
			carNum.value = s;
			currentIndex.value = idx; // 光标停留在被清空的位置
		}
	};
	// 键盘：确认
	const onConfirm = () => {
		showPlateInput.value = false;
		if (!isCarPlate(currentPlateString())) {
			uni.showToast({ title: '请输入正确的车牌号', icon: 'none' });
			return;
		}
		console.log('点击确认');
		// 触发后续联动
		// queryVehicleOwner();
		// checkVehicleBindStatus();
	};
	// 键盘：关闭
	const onClose = () => {
		showPlateInput.value = false;
		// 关闭时如果格式合法就联动查询，否则清空所属人
		if (isCarPlate(currentPlateString())) {
			// queryVehicleOwner();
			// checkVehicleBindStatus();
		} else {
			ownerTex.value = '';
		}
	};
	// 生成当前实际车牌字符串（截到 maxLen，去掉多余 '?')
	const currentPlateString = () : string => {
		const s = normalizeCarNumToMaxLen(carNum.value, maxLen.value);
		// 允许末尾存在 '?' 时视为不完整
		return s;
	};
	// 车牌校验（7位普通、8位新能源）
	const isCarPlate = (value : string) : boolean => {
		// 只要包含 '?' 就视为不完整
		if (value.includes('?')) return false;
		const xny = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DABCEFGHJK]$)|([DABCEFGHJK][A-HJ-NP-Z0-9][0-9]{4}$))/;
		const ryc = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
	
		if (value.length === 7) return ryc.test(value);
		if (value.length === 8) return xny.test(value);
		return false;
	};
	
	// 工具函数
	const normalizeCarNumToMaxLen = (s : string, len : number) : string => {
		if (s.length < len) s = s + '?'.repeat(len - s.length);
		if (s.length > len) s = s.substring(0, len);
		return s;
	};
	const replaceAt = (s : string, idx : number, ch : string) : string =>
		s.substring(0, idx) + ch + s.substring(idx + 1);
	const lastFilledIndex = (s : string) : number => {
		for (let i = Math.min(s.length, maxLen.value) - 1; i >= 0; i--) {
			if (s[i] !== '?') return i;
		}
		return -1;
	};
	// 调起键盘：若未选中任何位，默认编辑第一个“？”；若已全满，则编辑最后一位
	const showCarKeyboard = () => {
		const firstQ = carNum.value.indexOf('?');
		if (firstQ !== -1 && firstQ < maxLen.value) {
			currentIndex.value = firstQ;
		} else {
			currentIndex.value = maxLen.value - 1;
		}
		showPlateInput.value = true;
	};
</script>

<style lang="scss" scoped>
	.pageView{
		background-color: #F0F0F2;
		min-height: 100vh;
	}
	.con {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 30rpx 24rpx;
		padding-top: 0;
		box-sizing: border-box;
		// position: relative;
	}
	
	.header-bg {
		width: 100%;
		height: 342rpx;
		// position: absolute;
		// top: 0;
		// left: 0;
		// z-index: 1;
	}
	
	.change {
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.change>view:nth-child(2) {
		width: 260rpx;
		height: 50rpx;
		background-color: #ffffff;
		border-radius: 10rpx 0rpx 0rpx 10rpx;
		border: solid 1rpx #e1e1e1;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}
	
	.change>view:nth-child(2)>text {
		display: inline-block;
		flex: 1;
		text-align: center;
		line-height: 50rpx;
		font-size: 24rpx;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: -3rpx;
		color: #999999;
		font-weight: bold;
	}
	
	.change>view:nth-child(2)>text:nth-child(1) {
		border-radius: 10rpx 0rpx 0rpx 10rpx;
	}
	
	.change>view:nth-child(2)>text:nth-child(2) {
		border-radius: 0rpx 10rpx 10rpx 0rpx;
	}
	
	.change>view:nth-child(2) .active {
		background-color: #ed933a;
		color: #fff;
	}
	
	.whiteBg-zw {
		width: 702rpx;
	}
	
	.height-big {
		height: 1140rpx;
	}
	
	.height-small {
		height: 770rpx;
	}
	
	.whiteBg-look {
		width: 702rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 0 20rpx 0;
		box-sizing: border-box;
		margin-top: 30rpx;
	}
	
	.whiteBg {
		width: 702rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 20rpx 20rpx 45rpx;
		box-sizing: border-box;
		position: absolute;
		top: 294rpx;
		left: 50%;
		margin-left: -351rpx;
		z-index: 2;
	}
	
	.payBtn {
		width: 140rpx;
		height: 60rpx;
		background-color: #FBE8D5;
		border-radius: 10rpx;
		border: solid 1rpx #ed933a;
		font-size: 32rpx;
		font-weight: bold;
		font-stretch: normal;
		letter-spacing: 1rpx;
		color: #ed933a;
		text-align: center;
		line-height: 60rpx;
	}
	
	.btn {
		width: 660rpx;
		height: 91rpx;
		background-image: linear-gradient(178deg,
				#ffd9b2 0%,
				#e7771a 100%,
				#ec6132 100%,
				#f14a4a 100%,
				#f85f30 100%,
				#fe7416 100%),
			linear-gradient(#ec9248,
				#ec9248);
		background-blend-mode: normal,
			normal;
		border-radius: 10rpx;
		font-size: 36rpx;
		line-height: 90rpx;
		letter-spacing: 1rpx;
		color: #ffffff;
		text-align: center;
		margin: 70rpx 0 0;
	}
	
	.historyItem {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 100rpx;
		border-bottom: 1px solid #e1e1e1;
	}
	
	.historyItem:last-child {
		border-bottom: none;
	}
	
	.numCon {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		margin-bottom: 40rpx;
	}
	
	.carNumBg {
		width: 70rpx;
		height: 90rpx;
		border-radius: 10rpx;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 90rpx;
		text-align: center;
	}
	
	.bg_blue {
		background-color: #1342B8;
		color: #ffffff;
	}
	
	.bg_yellow {
		background-color: #FCDE3A;
		color: #333333;
	}
	
	.bg_green {
		background-color: #88EBA9;
		color: #333333;
	}
	
	.bg_normal {
		background-color: #f0f0f0;
		color: #333333;
	}
	
	.carNumBg3Con{
		position: relative;
	}
	
	.bg3Label{
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		top: -14rpx;
		right: -14rpx;
	}
	
	.carNumBg3 {
		width: 66rpx;
		height: 86rpx;
		background-color: #f2fff6;
		border-radius: 10rpx;
		border: dashed 1rpx #46d375;
		font-size: 24rpx;
		color: #6ebf89;
		writing-mode: vertical-rl;
		text-align: center;
		line-height: 70rpx;
	}
	
	.carImg {
		width: 260rpx;
		height: 90rpx;
		margin: 40rpx 0 20rpx;
	}
	
	.cardBg {
		width: 250rpx;
		height: 140rpx;
		background-color: #fff7f1;
		border-radius: 10rpx;
	}
	
	.cardTip {
		margin-top: 20rpx;
	}
	
	.icCopy {
		width: 27rpx;
		height: 28rpx;
		margin-left: 20rpx;
		margin-right: 4rpx;
	}
	
	.texCopy {
		font-size: 28rpx;
		color: #fe7215;
		padding: 0 20rpx;
	}
	
	
	.plateBg {
		width: 260rpx;
		height: 90rpx;
		margin: 40rpx 0 20rpx;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.texBlack {
		font-size: 28rpx;
		color: #000000;
		font-weight: bold;
		position: absolute;
		z-index: 1;
		letter-spacing: 4rpx;
	}
	
	.plateImg {
		width: 260rpx;
		height: 90rpx;
		position: absolute;
		top: 0;
		left: 0;
	}
	
	.icAddRaido {
		width: 45rpx;
		height: 44rpx;
		margin-right: 20rpx;
	}
	
	.icSelect {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		bottom: 30rpx;
		right: -20rpx;
	}
	
	.between {
		justify-content: space-between;
	}
	
	.colCenter {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-right: 30rpx;
	}
	
	.default-truth {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0 16rpx;
		box-sizing: border-box;
	}
	
	.default-truth image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	
	.default-truth text {
		font-size: 24rpx;
		letter-spacing: -3rpx;
		color: #666666;
		font-weight: bold;
	}
	
	.service-btn{
		width: 122rpx;
		height: 125rpx;
		position: fixed;
		top: 940rpx;
		right: 0;
		z-index: 9;
	}
</style>