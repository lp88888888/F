<template>
  <view class="container" :data-theme="pageTheme" >
    <!-- 自定义导航栏 -->
	<!-- <up-navbar title="ETC绑卡" bgColor="none" @leftClick="leftClick" placeholder :fixed="false"></up-navbar> -->
	<u-sticky bgColor="transparent" z-index="99999">
		<view class="searchView">
			<up-navbar title="ETC绑卡" bgColor="transparent" @leftClick="leftClick" placeholder
				:fixed="true"></up-navbar>
		</view>
	</u-sticky>
	<!-- <image class="backImg" :src="`${imgUrl}invoice-bg.png`" mode=""></image> -->
    <!-- 页面内容 -->
	<view class="bind-view">
		<view class="tab">
			<view class='tab1' v-if="tabisshow === '1'" @click="tabPage('1')">查询输入</view>
			<view class='tab1-wenzi1' v-if="tabisshow === '2'" @click="tabPage('1')">查询输入</view>
			<view class='tab2' v-if="tabisshow === '2'" @click="tabPage('2')">手动输入</view>
			<view class='tab1-wenzi2' v-if="tabisshow === '1'" @click="tabPage('2')"> 手动输入</view>
		</view>
		<view class="formView" v-if="tabisshow === '2'">
			<up-form labelPosition="left" :model="form" ref="uFormRes" labelWidth="83" :labelStyle="{ fontSize: '28rpx',textAlignLast: 'justify' }">
				<up-form-item label="ETC卡编号" prop="etcNumber" borderBottom>
					<up-input v-model="form.etcNumber" fontSize="14" placeholder="请输入ETC卡编号" border="none"></up-input>
				</up-form-item>
				<up-form-item label="预留手机号" prop="mobile" borderBottom>
					<up-input v-model="form.mobile" fontSize="14" placeholder="请输入ETC卡预留手机号码" border="none" disabled></up-input>
				</up-form-item>
				<up-form-item label="验证码" prop="code" borderBottom>
					<up-input type="number" v-model="form.code" fontSize="14" placeholder="请输入验证码" border="none">
						<template #suffix>
							<text class="codeTextClass" :disabled="count < 60" @click="getVertifyCode"> {{ count < 60 ? `${count}s后重新获取` : '获取验证码' }}</text>
						</template>
					</up-input>
				</up-form-item> 
				<view class='inquiry' @click="tabPage('1')">
					 <view class='lj'>
						 <image :src="imgUrl+'lj.png'" class="lj-img" />
						 忘记ETC编号？点击查询获取ETC信息 
					 </view>
					 <view class='inquiry-qcx'>去查询</view>
				</view>
			</up-form>
		</view>
		<view class="formView" v-else >
			<up-form labelPosition="left" :model="form" ref="uFormRes" labelWidth="83" :labelStyle="{ fontSize: '28rpx',textAlignLast: 'justify' }">
				<up-form-item label="姓名" prop="etcname" borderBottom>
					<up-input v-model="form.etcname" fontSize="14" @blur="getoneBlur" placeholder="请输入姓名" border="none"></up-input>
				</up-form-item>
				<up-form-item label="身份证号码" prop="etcidCoder" borderBottom>
					<up-input v-model="form.etcidCoder" fontSize="14" @blur="getoneBlur" placeholder="请输入身份证号码" border="none"></up-input>
				</up-form-item>
				<up-form-item label="手机号码" prop="etcphone" borderBottom>
					<up-input type="number" v-model="form.etcphone" fontSize="14" @blur="getoneBlur" placeholder="请输入ETC卡预留手机号码" border="none" disabled></up-input>
				</up-form-item>
				<up-form-item label="验证码" prop="etccode" borderBottom>
					<up-input type="number" v-model="form.etccode" fontSize="14" @blur="getoneBlur" placeholder="请输入验证码" border="none">
						<template #suffix>
							<text class="codeTextClass" :disabled="counts < 60" @click="getVertifycodeETC"> {{ counts < 60 ? `${counts}s后重新获取` : '获取验证码' }}</text>
						</template>
					</up-input>
				</up-form-item>
			</up-form>
		</view>
	</view>
	<view class="bind-btn" @click="querybind" v-if="tabisshow=== '1'">查询</view>
	<view class="bind-btn" @click="bind" v-if="tabisshow=== '2'">确认绑定</view>
    <view class="page-content">
      <!-- 登录组件 -->
      
      <!-- 选择ETC弹窗 -->
	  
	  <up-popup :show="isshow" @close="isshow=false">
		  <view class='overlay-box'>
			<view class="overlay-title">ETC卡查询结果</view>
			<view v-for="(item,index) in ectlist" :key="item.cardId" @click="isshowsFun(item.cardId)">
				<view :class="[selectedMap[item.cardId] ? 'overlaybg' : '' ]" style='padding:14rpx 30rpx 20rpx;border-bottom: 1px solid #eee;'>
				<view class='license'>{{item.plateNum}}</view>
				<view class='overlay-cxk'>
					<text>{{item.cardId}}</text>
					<view class='card'>{{item.cardType}}</view>
					<view>
						<view class="rowCon">
						  <image class="icAddRaido" :src="`${imgUrl}${selectedMap[item.cardId] ?'ic_ad_select.png':'ic_ad_normal.png'}`" />
						</view>
					</view>
				</view>
				<view>
					<text>{{item.mobile}}</text>
					<text>{{item.hasBind==false?'未绑车':'已绑车'}}</text>
				</view>
			  </view>
			</view>
			 <view class="bind-btn" @click="bindingfun">确认绑定</view>
		</view>
		</up-popup>
    </view>
	
	<etc-login v-if="layerShow" @closePop="closePop" @loginSuc="loginSuc"></etc-login>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted,onUnmounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import EtcLogin from './components/EtcLogin.vue';
import { imgUrl } from '@/config';
import { etcInvoice,requestEtc,requestetcXy,requestetcXy2,requestetcXy3 } from '@/api/etcInvoice';
import {showToast,showToastSuccess,hideLoading,showLoading,isEmpty,isPhoneAvailable} from '@/utils/util';
import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
// 响应式数据

const count = ref(60);
const counts = ref(60);
const layerShow = ref(false);
const etcUser = ref<any>({});
const etcCards = ref<any[]>([]);
const from = ref('');
const isshow = ref(false);
const tabisshow = ref('1');
const overlayType = ref<string[]>([]);
const selectedMap = ref({});
const ectlist = ref<any[]>([]);
const popup = ref();
const fromOpt = ref('')
const form = ref({
	mobile:'',
	count:'',
	code:'',
	etccode:'',
	etcNumber: '',
	etcname:'',
	etcidCoder:'',
	etcphone:'',
})

// 定时器
let timer = null;
let timers = null;
const leftClick = () =>{
	uni.navigateBack({
		delta:1,
		fail: () => {
			uni.navigateTo({
				url:"/pages/home/home"
			})
		}
	})
}
// 页面加载
onLoad((options: any) => {
  etcUser.value = uni.getStorageSync('etcUser');
  fromOpt.value = options.from || '';
});

// 页面显示
onShow(() => {
  getEtcCard(1);
   let phone=uni.getStorageSync('phoneEtc');
   form.value.etcphone=phone
   form.value.mobile=phone
});



// 登录成功
const loginSuc = (res: any) => {
  etcUser.value = res.detail;
  etcCards.value = [];
  getEtcCard(1);
};
const closePop = () => {
  layerShow.value = false
};

// 获取ETC卡片
const getEtcCard = async (type: number) => {
  if (type > 2) return;
  
  const params = {
    serverUrl: 'appCardListRequest',
    mobile: etcUser.value.mobile,
    userType: String(type),
    cardIdQueryStr: '',
    plateNumQueryStr: '',
  };
  
  try {
    showLoading();
    const res = await etcInvoice(params);
    hideLoading();
    
    const cardItems = res.data.items;
    etcCards.value = etcCards.value.concat(cardItems);
    getEtcCard(type + 1);
  } catch (error: any) {
    hideLoading();
    if (error == 'etcTokenLoad') {
      layerShow.value = true;
    } else {
      showToast(error);
    }
  }
};

// 获取ETC验证码
const getVertifycodeETC = async () => {
  if (isEmpty(form.value.etcphone)) {
    showToast('请输入ETC卡预留手机号码');
    return;
  } else if (!isPhoneAvailable(form.value.etcphone)) {
    showToast('手机号码格式有误');
    return;
  }
  
  if (counts.value < 60) {
    return;
  }
  
  const params = {
    mobile: form.value.etcphone,
    ticketId: uni.getStorageSync('etcUser').ticketId,
  };
  
  try {
    await requestEtc(JSON.stringify(params));
    showToast('验证码已发送~');
    
    timers = setInterval(() => {
		console.log("----counts---",counts.value);
      counts.value--;
      if (counts.value <= 0) {
        clearInterval(timers as number);
        counts.value = 60;
      }
    }, 1000);
  } catch (error: any) {
    showToast(error);
  }
};

// 检查身份证长度
const checkIdCardLength = (idCard: string): boolean => {
  const trimmedId = idCard.trim();
  const length = trimmedId.length;
  return length === 15 || length === 18;
};

// 查询绑定
const querybind = async () => {
  if (isEmpty(form.value.etcname)) {
    showToast('请输入姓名');
    return;
  } else if (isEmpty(form.value.etcidCoder)) {
    showToast('请输入身份证号码');
    return;
  } else if (!checkIdCardLength(form.value.etcidCoder)) {
    showToast('身份证号码格式有误');
    return;
  } else if (isEmpty(form.value.etcphone)) {
    showToast('请输入ETC卡预留手机号码');
    return;
  } else if (!isPhoneAvailable(form.value.etcphone)) {
    showToast('手机号码格式有误');
    return;
  }
  
  if (isEmpty(form.value.etccode)) {
    showToast('请输入验证码');
    return;
  }
  const params = {
    mobile: form.value.etcphone,
    ticketId: uni.getStorageSync('etcUser').ticketId,
    validCode: form.value.etccode
  };
  // ectlist.value = [
	 //  {
		//   cardId: "61051642230090984496",
		//   cardType: "记账卡",
		//   hasBind: false,
		//   mobile: "13279387030",
		//   plateColor: "蓝色",
		//   plateNum: "陕A7M1S1",
		//   status: 1,
		//   vehicleType: 1,
	 //  }
  // ]
   
  // return
  try {
    const res = await requestetcXy(params);
    if (res.data.success == true && res.data.items.length > 0) {
      ectlist.value = res.data.items;
      isshow.value = true
    } else {
      showToast('暂无ETC可绑定');
    }
	console.log('-0-0-0-0-0-0--0绑定查询成功',res);
  } catch (error: any) {
	  console.log('-0-0-0-0-0-0--0绑定报错',error);
    showToast(error);
  }
};

// 绑定ETC
const bind = async () => {
  if (isEmpty(form.value.etcNumber)) {
    showToast('请输入ETC卡编号');
    return;
  }
  
  if (isEmpty(form.value.mobile)) {
    showToast('请输入ETC卡预留手机号码');
    return;
  } else if (!isPhoneAvailable(form.value.mobile)) {
    showToast('手机号码格式有误');
    return;
  }
  
  if (isEmpty(form.value.code)) {
    showToast('请输入验证码');
    return;
  }
  
  if (etcCards.value.length === 5) {
    showToast('最多添加5张ETC卡');
    return;
  }
  
  const params = {
    serverUrl: 'appCardBindNewRequest',
    cardId: form.value.etcNumber,
    smsCode: form.value.code,
  };
  
  try {
    showLoading();
    const res = await etcInvoice(params);
    hideLoading();
    if(res.data.success){
		showToastSuccess('绑卡成功');
		setTimeout(() => {
		  if (fromOpt.value) {
		    uni.redirectTo({
		      url: `./success?etcCardSize=${etcCards.value.length}&id=${form.value.etcNumber}`,
		    });
		  } else {
		    uni.navigateTo({
		      url: `./success?etcCardSize=${etcCards.value.length}&id=${form.value.etcNumber}`,
		    });
		  }
		  
		  form.value.etcNumber = '';
		  form.value.code = '';
		  form.value.mobile = '';
		  count.value = 60;
		}, 1000);
	}else{
		showToast(res.data.msg);
	}
    
  } catch (error: any) {
    hideLoading();
    if (error === 'etcTokenLoad') {
      layerShow.value = true;
    } else {
      showToast(error);
    }
  }
};

// 获取验证码
const getVertifyCode = async () => {
  if (count.value < 60) {
    return;
  }
  
  if (isEmpty(form.value.etcNumber)) {
    showToast('请输入ETC卡编号');
    return;
  }
  
  if (isEmpty(form.value.mobile)) {
    showToast('请输入ETC卡预留手机号码');
    return;
  } else if (!isPhoneAvailable(form.value.mobile)) {
    showToast('手机号码格式有误');
    return;
  }
  
  try {
    showLoading();
    const res = await etcInvoice({
      serverUrl: 'appCardBindCheckRequest',
      cardId: form.value.etcNumber,
    });
    console.log('-0-0--->>>>>',res);
    hideLoading();
	if(res.data.success){
		const bindPhone = res.data.mobile;
		const bindPhoneSub = bindPhone.substring(bindPhone.length - 4);
		const mobileSub = form.value.mobile.substring(form.value.mobile.length - 4);
		if (bindPhoneSub !== mobileSub) {
		  showToast('输入手机号和卡预留手机号不一致，请重新输入');
		} else {
		  senCode();
		}
	}else{
		showToast(res.data.msg);
	}
    
  } catch (error: any) {
    hideLoading();
	console.log('-0-0---',error);
    if (error === 'etcTokenLoad') {
      layerShow.value = true;
    } else {
      if (error === '请勿频繁绑卡！') {
        showToast('请10分钟后重试~');
      } else if (error.indexOf(form.value.etcNumber) > -1) {
        const msgStr = error.replace(form.value.etcNumber, '');
        showToast(msgStr);
      } else {
        showToast(error);
      }
    }
  }
};

// 发送验证码
const senCode = async () => {
  try {
    showLoading();
    await etcInvoice({
      serverUrl: 'appCardBindSendCodeRequest',
      mobile: form.value.mobile,
      cardId: form.value.etcNumber,
    });
    
    hideLoading();
    showToast('验证码已发送~');
    startTimer();
  } catch (error: any) {
    hideLoading();
    if (error === 'etcTokenLoad') {
      layerShow.value = true;
    } else {
      showToast(error);
    }
  }
};

// 启动计时器
const startTimer = () => {
  timer = setInterval(() => {
    count.value--;
    if (count.value <= 0) {
      stopTimer();
      count.value = 60;
    }
  }, 1000);
};

// 停止计时器
const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// 关闭弹窗
const isshowFun = () => {
  isshow.value = false
};

// 选择ETC卡
const isshowsFun = (cardId: string) => {
  const selectedArr = [...overlayType.value];
  const map = { ...selectedMap.value };
  
  if (map[cardId]) {
    map[cardId] = false;
    const idx = selectedArr.indexOf(cardId);
    if (idx !== -1) selectedArr.splice(idx, 1);
  } else {
    map[cardId] = true;
    if (!selectedArr.includes(cardId)) selectedArr.push(cardId);
  }
  
  overlayType.value = selectedArr;
  selectedMap.value = map;
};

// 确认绑定
const bindingfun = async () => {
  const resultArray = overlayType.value.map(cardId => ({ cardId }));
  const params = {
    ticketId: uni.getStorageSync('etcUser').ticketId,
    infos: resultArray,
  };
  
  if (overlayType.value.length > 5) {
    showToast('最多添加5张ETC卡');
    return;
  }
  console.log(params);
  try {
    const res = await requestetcXy3(params);
	if(res.data.success){
		uni.navigateTo({
		  url: `./success?etcCardSize=${overlayType.value.length}`,
		});
	}else{
		showToast(res.data.msg);
	}
    
  } catch (error: any) {
    showToast('添加失败');
  }
  
  isshow.value = false
};

// 切换选项卡
const tabPage = (type: string) => {
  tabisshow.value = type;
};

// 返回
const goBack = () => {
  const app = getApp();
  if (app && app.goBack) {
    app.goBack();
  } else {
    uni.navigateBack();
  }
};

// 身份证验证
const getoneBlur = async () => {
  if (!form.value.etcname) {
    showToast('请输入姓名');
    return;
  }
  
  if (!form.value.etcidCoder) {
    showToast('请输入身份证号码');
    return;
  }
  
  const params = {
    province: '',
    name: form.value.etcname,
    idCode: form.value.etcidCoder,
    ticketId: uni.getStorageSync('etcUser').ticketId,
  };
  
  try {
    const  res = await requestetcXy2(params);
	if(!res.data.success){
		showToast(res.data.msg);
	}
  } catch (error: any) {
    showToast(error);
  }
};

// 组件卸载时清除定时器
onUnmounted(() => {
  stopTimer();
  if (timers) {
    clearInterval(timers);
  }
  if(timer){
	  clearInterval(timer);
  }
});
</script>

<style lang="scss" scoped>
	.container{
		width: 100vw;
		background: var(--head-color);
	}
	.backImg{
		width: 750rpx;
		height: 412rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.bind-view {
	    width: 100%;
	    padding: 0 24rpx;
	    box-sizing: border-box;
		
		.formView{
			background: #FFFFFF;
			padding: 0 20rpx;
			border-radius:0 0 22rpx 22rpx;
		}
		.tab {
			width: 100%;
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;
			text-align: center;
		    border-top-right-radius: 22rpx;
			border-top-left-radius: 22rpx;
		}
		
		.tab1,.tab2 {
			width: 50%;
			color: #120C08;
			display: inline-block;
			position: relative;
			padding-bottom: 5px;
		
		}
		.tab1-wenzi1{
			width: 50%;
			height: 100rpx;
			background: url('https://tranalioss.shanyitong.com/images/activeIcons/tab_left.png');
			background-size:cover;
			line-height: 100rpx;
		}
		.tab1-wenzi2{
			width: 50%;
			height: 100rpx;
			background: url('https://tranalioss.shanyitong.com/images/activeIcons/tab_right.png');
			background-size:cover;
			line-height: 100rpx;
		}	
		.tab1::after {
			content: "";
			/* 绝对定位，相对于父元素（.input-label） */
			position: absolute;
			left: 50%;
			bottom: -5px;
			/* 下划线宽度与父元素同宽 */
			width: 10%;
			/* 下划线高度，可按需调整粗细 */
			height: 5px;
			/* 下划线颜色，这里模拟橙色，可自行修改色值 */
			background-color: orange;
			transform: translateX(-50%);
		}
		.tab2::after {
			content: "";
			/* 绝对定位，相对于父元素（.input-label） */
			position: absolute;
			left: 50%;
			bottom: -5px;
			/* 下划线宽度与父元素同宽 */
			width: 10%;
			/* 下划线高度，可按需调整粗细 */
			height: 5px;
			/* 下划线颜色，这里模拟橙色，可自行修改色值 */
			background-color: orange;
			transform: translateX(-50%);
		}
	}
	
	.codeTextClass {
	    font-size: 26rpx;
	    color: var(--primary-color);
	}
	.inquiry{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		color: #232736;
		font-size: 24rpx;
		box-shadow: 0px 4px 10px 0px rgba(124, 124, 124, 0.05);
	}
	.inquiry-qcx{
		color: #FF0000;
		background: #FBE4D5;
		padding: 8rpx 12rpx;
		border-radius: 10rpx;
		font-size:24rpx;
		margin-left: 100rpx;
	}
	.lj{
		height: 40rpx;
		display: flex;
		align-items: center;
	}
	.lj-img{
		width: 25rpx;
		height: 25rpx;
		margin-right: 10rpx;
	}
	
	.bind-btn {
	    width: 702rpx;
	    height: 90rpx;
	    background-color:  var(--primary-color);
	    border-radius: 10rpx;
	    text-align: center;
	    line-height: 90rpx;
		margin: 0 auto;
	    margin-top: 80rpx;
	    font-size: 32rpx;
	    color: #ffffff;
		
	}
	
	.overlay-box{
		width: 100%;
		background: #fff;
		border-top-left-radius:24rpx ;
		border-top-right-radius:24rpx ;
		// position: fixed;
		// bottom: 0;
		// left: 0;
		// z-index: 999999999999;
	}
	.overlay-title{
		padding: 20rpx 30rpx;
		color: #000;
		font-weight: bold;
	}
	.overlaybg{
		background: #FFF5F2 !important;
	}
	.icAddRaido {
	  width: 35rpx;
	  height: 34rpx;
	  margin-right: 20rpx;
	}
	.overlay-cxk{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	::v-deep .u-navbar__content{
		background: none !important;
	}
	::v-deep .u-input--square{
		background: #fff !important;
	}
</style>