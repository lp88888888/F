<template>
  <view class="page" :data-theme="pageTheme" >
	  <up-sticky bgColor="none">
		  <view class="topView">
			  <up-navbar :title="carNumStr" bgColor="transparent" @leftClick="goBack" placeholder
			  	:fixed="true"></up-navbar>
			  <!-- <up-navbar :title="carNumStr" bgColor="none" @leftClick="goBack" placeholder :fixed="true"></up-navbar> -->
			  <view class="change-view">
			    <view @click="change(1)" >
			      <text :class="[changeIndex === 1 ? 'tex32_33_b' : 'tex28_66']">消费数据</text>
			      <text v-if="changeIndex === 1"></text>
			    </view>
			    <view @click="change(2)">
			      <text :class="[changeIndex === 2 ? 'tex32_33_b' : 'tex28_66']">充值数据</text>
			      <text v-if="changeIndex === 2"></text>
			    </view>
			  </view>
			  <view class="title">
			    <view class="tex28_66">请选择需要开票的行程</view>
			    <picker class="picker" mode="date" :end="endMonth" :value="month" fields="month" @change="mounthChange">
			      <view>
			        <text>{{ month }}</text>
			        <image :src="imgUrl + 'etc-calendar-icon.png'" mode="" />
			      </view>
			    </picker>
			  </view>
		  </view>
	  </up-sticky>
    <!-- 状态栏占位 -->
	
    <!-- 消费列表 -->
    <block v-if="changeIndex === 1">
      <view class="pass-view">
        <view v-if="passList.length === 0" style="padding: 100rpx 0;">
          <emptyview />
        </view>
        <view
          v-for="(item, index) in passList"
          :key="index"
          class="pass"
          @click="truth(index)"
        >
          <view class="image" :class="{ 'no-border': item.check }">
            <image
              v-if="item.check"
              :src="imgUrl + 'bindetc-truth.png'"
            />
          </view>
          <view class="cont">
            <view>
              <view>
                <view></view>
                <view>
                  <text class="tex24_33_b texNoWrap max-b">{{ item.enStationName }}</text>
                  <text class="tex24_99">{{ item.enTime }}</text>
                </view>
              </view>
              <view>
                <view></view>
                <view>
                  <text class="tex24_33_b texNoWrap max-b">{{ item.exStationName }}</text>
                  <text class="tex24_99">{{ item.exTime }}</text>
                </view>
              </view>
            </view>
            <view>
              <text class="tex32_33_b">{{ item.feeStr }}</text>
              <text class="tex24_33_b">元</text>
            </view>
            <view>{{ item.provinceTypeText }}</view>
          </view>
        </view>
      </view>
    </block>

    <!-- 充值列表 -->
    <block v-else>
      <view class="pass-view">
        <view v-if="rechargeList.length === 0" style="padding: 100rpx 0;">
          <!-- <emptyview /> -->
		  <view class="emptyCon">
			  <image class="emptyImg" :src="`${imgUrl}emptyImg.png`" ></image>
			  <text class="emptyTex">暂无数据</text>
		  </view>
        </view>
        <view
          v-for="(item, index) in rechargeList"
          :key="index"
          class="recharge"
          @click="truth(index)"
        >
          <view class="image" :class="{ 'no-border': item.check }">
            <image
              v-if="item.check"
              :src="imgUrl + 'bindetc-truth.png'"
            />
          </view>
          <view class="cont">
            <view>
              <view>
                <text class="tex24_66_b">充值时间：</text>
                <text class="tex24_33_b">{{ item.time }}</text>
              </view>
              <view>
                <text class="tex24_66_b">充值渠道：</text>
                <text class="tex24_33_b texNoWrap max">{{ item.channelTypeStr }}</text>
              </view>
            </view>
            <view>
              <text class="tex32_33_b">{{ item.feeStr }}</text>
              <text class="tex24_33_b">元</text>
            </view>
          </view>
        </view>
      </view>
    </block>

    <!-- 结算栏 -->
    <view class="settle-view"></view>
    <view class="settle">
      <view>
        <view>
          <text class="tex28_33_b">已选</text>
          <text class="tex36_red">{{ selectedNum }}</text>
          <text class="tex28_33_b">个数据</text>
        </view>
        <view>
          <text class="tex28_33_b">共</text>
          <text class="tex36_red">{{ totalFee }}</text>
          <text class="tex28_33_b">元</text>
        </view>
      </view>
      <view>
        <view @click="checAll">
          <view class="image" :class="{ 'no-border': checkAll }">
            <image
              v-if="checkAll"
              :src="imgUrl + 'bindetc-truth.png'"
            />
          </view>
          <text class="tex28_33">全选</text>
        </view>
        <view @click="next">下一步</view>
      </view>
    </view>

    <!-- 邮箱输入弹窗-->
	<up-popup :show="emailShow" mode="center" :safeAreaInsetBottom="false" bgColor="transparent" round="5">
	  <view class="emailpopup">
		<view class="header">
		  <text class="tex28_33_b"><text style="color: red;">*</text>电子邮箱</text>
		  <image
			class="icClose"
			:src="imgUrl + 'ic_close.png'"
			@click="closePop"
		  />
		</view>
		<input
		  type="text"
		  v-model="email"
		  placeholder="请输入您接收发票的邮箱地址"
		  placeholder-class="tex28_99"
		  class="tex28_33 email-input"
		/>
		<view class="btn" @click="openConfirm">下一步</view>
	  </view>
	</up-popup>
    <!-- 确认弹窗 -->
	<up-popup :show="confirmShow" mode="center" :safeAreaInsetBottom="false" bgColor="transparent" round="5">
		<view class="confirm-view">
			<image
			  class="icClose"
			  :src="imgUrl + 'ic_close.png'"
			  @click="closeConfirm"
			/>
			<view class="head tex36_33_b">电子发票开具确认</view>
			<view class="info-list">
			  <view>
				<text class="tex28_66_b">抬头类型：</text>
				<text class="tex28_33_b texNoWrap2">{{ titleData.titleType === 1 ? '个人' : '企业' }}</text>
			  </view>
			  <view>
				<text class="tex28_66_b">抬头名称：</text>
				<text class="tex28_33_b texNoWrap2">{{ titleData.titleName }}</text>
			  </view>
			  <view v-if="titleData.taxNum">
				<text class="tex28_66_b">税　　号：</text>
				<text class="tex28_33_b texNoWrap2">{{ titleData.taxNum }}</text>
			  </view>
			  <view v-if="titleData.address">
				<text class="tex28_66_b">地　　址：</text>
				<text class="tex28_33_b texNoWrap2">{{ titleData.address }}</text>
			  </view>
			  <view>
				<text class="tex28_66_b">开票金额：</text>
				<text class="tex28_33_b texNoWrap2">{{ totalFee }}元</text>
			  </view>
			  <view>
				<text class="tex28_66_b">电子邮箱：</text>
				<text class="tex28_33_b texNoWrap2">{{ email }}</text>
			  </view>
			</view>
			<view class="btn" @click="confirm">确认提交</view>
		</view>
	</up-popup>

    <!-- 登录组件 -->
	<etc-login v-if="layerShow" @closePop="closePop" @loginSuc="loginSuc"></etc-login>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed as vueComputed } from 'vue';
import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
import EtcLogin from './components/EtcLogin.vue';
import { imgUrl } from '@/config';
// 工具函数（需自行实现或引入）
import {accAdd,formatPlateNum,hideLoading,showLoading,showToast,isEmail} from '@/utils/util';
import {formatMonthDate,formatDate} from '@/utils/date';
import { etcInvoice } from '@/api/etcInvoice';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
// 消费数据类型
interface PassItem {
  tradeId: string; 
  provinceType: string;
  enStationName: string;
  exStationName: string;
  enTime: string;
  exTime: string;
  fee: number;
  allowance: number;
  consumerTransType: string;
  invoiceProgressStatus: string;
  titleId?: string;
  titleType?: number;
  titleName?: string;
  taxNum?: string;
  address?: string;
  tel?: string;
  bank?: string;
  bankAccount?: string;
  handleType?: number;
  splitCount?:number;
  // 新增
  feeStr: string;
  provinceTypeText: string;
  check: boolean;
}

// 充值数据类型
interface RechargeItem {
  tradeId: string;
  channelType: number;
  time: string;
  fee: number;
  invoiceProgressStatus:number;
  titleId?: string;
  titleType?: string;
  titleName?: string;
  taxNum?: string;
  address?: string;
  tel?: string;
  bank?: string;
  bankAccount?: string;
  // 新增
  feeStr: string;
  channelTypeStr: string;
  check: boolean;
}

// 数据
const cardId = ref('');
const etcUser = ref({});
const carNum = ref('');
const carNumStr = ref('');
const month = ref('');
const endMonth = ref('');
const changeIndex = ref(1);
const checkAll = ref(false);
const passList = ref<PassItem[]>([]);
const rechargeList = ref<RechargeItem[]>([]);
const email = ref('');
const emailShow = ref(false);
const confirmShow = ref(false);
const titleData = ref<any>({});
const cardType = ref('');

const selectedNum = ref(0);
const totalFee = ref('0.00');
const layerShow = ref(false);

// onLoad
onLoad((options) => {
  const app = getApp();
  cardId.value = (options.id as string) || '';
  carNum.value = (options.car as string) || '';
  carNumStr.value = formatPlateNum(carNum.value);
  cardType.value = (options.cardtype as string) || '2';
  month.value = formatMonthDate(new Date());
  console.log(month.value);
  endMonth.value = formatDate(new Date());
  etcUser.value = uni.getStorageSync('etcUser');
});

onShow(() => {
  emailShow.value = false;
  confirmShow.value = false;
  getPassFee();
});

// 方法
const goBack = () => {
  uni.navigateBack();
};

const closePopLogin = () => {
  layerShow.value = false;
};

const loginSuc = () => {
  getPassFee();
};

const closeConfirm = () => {
  confirmShow.value = false;
};

const closePop = () => {
  emailShow.value = false;
};


const truth = (index:number|string) => {
  const list:any = changeIndex.value === 1 ? passList.value : rechargeList.value;
  list[index].check = !list[index].check;

  const filter = list.filter(item => item.check);
  if (changeIndex.value === 1) {
    passList.value = [...list];
  } else {
    rechargeList.value = [...list];
  }
  checkAll.value = filter.length === list.length;
  totalFeeCalc();
};

const next = () => {
  if (selectedNum.value === 0) {
    showToast(changeIndex.value === 1 ? '请先勾选消费数据' : '请先勾选充值数据');
    return;
  }
  emailShow.value = true;
};

const openConfirm = () => {
  if (!email.value) {
    showToast('请输入电子邮箱');
    return;
  }
  if (!isEmail(email.value)) {
    showToast('邮箱格式有误');
    return;
  }

  const list = changeIndex.value === 1 ? passList.value : rechargeList.value;
  const filter = list.filter(item => item.check);
  if (filter.length > 0) {
    titleData.value = filter[0];
  }

  emailShow.value = false;
  confirmShow.value = true;
};

const totalFeeCalc = () => {
  const list = changeIndex.value === 1 ? passList.value : rechargeList.value;
  const filter = list.filter(item => item.check);
  selectedNum.value = filter.length;

  if (filter.length === 0) {
    totalFee.value = '0.00';
  } else {
    let totFee = 0;
    filter.forEach(item => {
      totFee = accAdd(totFee, item.fee);
    });
    totalFee.value = toPrice(totFee);
  }
};

const checAll = () => {
  const list = changeIndex.value === 1 ? passList.value : rechargeList.value;
  const allChecked = !checkAll.value;
  list.forEach(item => {
    item.check = allChecked;
  });
  checkAll.value = allChecked;
  totalFeeCalc();
};

const mounthChange = (e: any) => {
  const val = e.detail.value;
  if (val === month.value) return;
  month.value = val;
  selectedNum.value = 0;
  totalFee.value = '0.00';
  getPassFee();
};

const getPassFee = () => {
	// return
  showLoading();
  const params = {
    serverUrl: 'appInvoiceTransListRequest',
    cardId: cardId.value,
    month: month.value,
    pageNum: 1,
    pageSize: 1000,
  };
  try{
	  console.log('-------------------',params);
	  etcInvoice(params).then(res=>{
	  	hideLoading();
		console.log('-0-0-330-0-',res);
	  	const items = res.data?.items || [];
	  	const list = items.map((item: any) => ({
	  	  ...item,
	  	  enTime: item.enTime.replace(/T/, ' '),
	  	  exTime: item.exTime.replace(/T/, ' '),
	  	  feeStr: toPrice(item.fee),
	  	  check: false,
	  	}));
	  	passList.value = list;
	  	
	  	if (cardType.value === '2') {
	  	  getRechargeFee();
	  	}
	  }).catch(err=>{
		  console.log('-0-0-03322-0-',err);
	  	hideLoading();
	  	if (err === 'etcTokenLoad') {
	  	  layerShow.value = true;
	  	} else {
	  	  showToast(err);
	  	}
	  })
  }catch(err){
	  console.log('-0-0-0-0-',err);
  }
};

const getRechargeFee = () => {
  showLoading();
  const params = {
    serverUrl: 'appInvoiceRechargeListRequest',
    cardId: cardId.value,
    month: month.value,
    pageNum: 1,
    pageSize: 10,
  };
	etcInvoice(params).then(res =>{
		hideLoading();
		const items = res.data?.items || [];
		const list = items.map((item: any) => ({
		  ...item,
		  time: item.time.replace(/T/, ' '),
		  feeStr: toPrice(item.fee),
		  channelTypeStr: realStr(item.channelType),
		  check: false,
		}));
		rechargeList.value = list;
	}).catch(err =>{
		hideLoading();
		if (err === 'etcTokenLoad') {
		  layerShow.value = true;
		} else {
		  showToast(err);
		}
	})
};

const toPrice = (x: number): string => {
  if (x === null || x === undefined) return x as any;
  const f = Math.round((x / 100) * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};

const realStr = (tip: number): string => {
  switch (tip) {
    case 1: return '服务网点';
    case 2: return '自助终端';
    case 3: return '线上渠道';
    default: return '';
  }
};

const change = (index:number) => {
  if (index === changeIndex.value) return;
  changeIndex.value = index;
  passList.value.forEach(item => (item.check = false));
  rechargeList.value.forEach(item => (item.check = false));
  checkAll.value = false;
  totalFeeCalc();
};

const confirm = () => {
  showLoading();
  const type = changeIndex.value;
  const list = type === 1 ? passList.value : rechargeList.value;
  const filter = list.filter(item => item.check);
  const titleId = filter[0]?.titleId;
  const plateNum = carNum.value;

  const paramsList = filter.map(item => ({ tradeId: item.tradeId }));
  const items = [...filter];

  const params: any = {
    serverUrl: type === 1 ? 'appInvoiceTransApplyRequest' : 'appInvoiceRechargeApplyRequest',
    cardId: cardId.value,
    month: month.value,
    invoiceMail: email.value,
    titleId,
    plateNum,
    items,
  };

  if (type === 1) {
    params.tradeIds = paramsList;
  } else {
    params.tradeIdList = paramsList;
  }
	etcInvoice(params).then(() =>{
		hideLoading();
		uni.redirectTo({ url: './success?type=change' });
	}).catch(err =>{
		hideLoading();
		if (err === 'etcTokenLoad') {
		  layerShow.value = true;
		  closeConfirm();
		} else {
		  showToast(err);
		}
	})

};

// 计算 totalFee
totalFeeCalc();
</script>

<style lang="scss">


page {
  background: var(--head-color);
}

.fixed-view {
  position: fixed;
  left: 0;
  width: 100%;
  z-index: 10;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}
.topView{
	width: 100%;
	min-height: 250rpx;
	background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/invoice-bg-record.png') no-repeat, #f0f0f0;
	background-size: 100% 100%;
	padding-bottom: 1rpx;
}

.change-view {
  width: 100%;
  display: flex;
  align-items: flex-end;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.change-view > view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90rpx;
}

.change-view > view:nth-child(2) {
  margin-left: 140rpx;
}

.change-view > view > text:nth-child(2) {
  display: inline-block;
  margin-top: 10rpx;
  width: 60rpx;
  height: 6rpx;
  background-color: $color;
}

.title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30rpx 0 40rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.picker {
  width: 160rpx;
  height: 41rpx;
  border-radius: 20rpx;
  border: solid 1rpx #959595;
}

.picker view {
  width: 100%;
  height: 41rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker view text {
  font-size: 24rpx;
  color: #000;
  line-height: 24rpx;
}

.picker view image {
  width: 26rpx;
  height: 26rpx;
  margin-left: 14rpx;
}

.settle-view {
  height: 180rpx;
}

.settle {
  width: 100%;
  height: 180rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 10;
}
.tex28_33_b{
	font-size: 28rpx;
	color: #333333;
	font-weight: bold;
}
.tex36_red{
	font-size: 36rpx;
	color: #ff0000;
}
.settle > view:nth-child(1) {
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28rpx;
  box-sizing: border-box;
  border-bottom: solid 1rpx #e1e1e1;
}

.settle > view:nth-child(2) {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28rpx;
  box-sizing: border-box;
}

.settle > view:nth-child(2) > view:nth-child(1) {
  display: flex;
  align-items: center;
}

.image {
  width: 36rpx !important;
  height: 37rpx !important;
  border: solid 1rpx #999 !important;
  border-radius: 100% !important;
  box-sizing: border-box;
  margin-right: 18rpx;
}

.no-border {
  border: 0 !important;
}

.image image {
  width: 36rpx;
  height: 37rpx;
}

.settle > view:nth-child(2) > view:nth-child(2) {
  width: 301rpx;
  height: 91rpx;
  background-color: var(--primary-color);
  border-radius: 10rpx;
  text-align: center;
  line-height: 91rpx;
  font-size: 32rpx;
  color: #fff;
}

.pass-view {
  padding: 0 28rpx;
  box-sizing: border-box;
}

.pass {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.pass .cont {
  flex: 1;
  height: 190rpx;
  background-color: #fff;
  border-radius: 10rpx;
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 30rpx;
}

.pass .cont > view:nth-child(1) {
  height: 190rpx;
  flex: 1;
  padding: 20rpx 0 0 24rpx;
  box-sizing: border-box;
}

.pass .cont > view:nth-child(1) > view {
  display: flex;
}

.pass .cont > view:nth-child(1) > view > view:nth-child(1) {
  width: 17rpx;
  height: 17rpx;
  background-color: var(--primary-color);
  border-radius: 100%;
  margin-right: 20rpx;
  margin-top: 8rpx;
}

.pass .cont > view:nth-child(1) > view:nth-child(1) {
  margin-bottom: 14rpx;
}

.pass .cont > view:nth-child(1) > view:nth-child(2) > view:nth-child(1) {
  background-color: #f00 !important;
}

.pass .cont > view:nth-child(3) {
  position: absolute;
  top: 0;
  right: 0;
  height: 40rpx;
  background-color: #ffe8cf;
  border-radius: 0 10rpx 0 0;
  line-height: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: var(--primary-color);
  padding: 0 10rpx;
}

.recharge {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.recharge .cont {
  height: 130rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
}

.recharge .cont > view:nth-child(1) {
  flex: 1;
  height: 90rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.max {
  max-width: 300rpx;
}

.max-b {
  max-width: 400rpx;
}

/* 弹窗 */
.layer {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layer > view {
  width: 690rpx;
  height: 352rpx;
  background-color: #fff;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  padding: 0 24rpx;
  box-sizing: border-box;
  margin-top: -50rpx;
}



.icClose {
 width: 31rpx;
 height: 32rpx;
 position: absolute;
 top: 28rpx;
 right: 28rpx;
}

.email-input {
  width: 100%;
  height: 90rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
  text-align: center;
  margin: 20rpx 0;
}

.emailpopup .btn,
.confirm-view .btn {
  width: 90%;
  height: 90rpx;
  background-color: var(--primary-color);
  border-radius: 10rpx;
  line-height: 90rpx;
  text-align: center;
  font-size: 32rpx;
  color: #fff;
  margin: 0 auto;
}

.confirm-view {
  width: 690rpx;
  background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/layer-etc-make-bg.png') no-repeat;
  background-size: 690rpx 718rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 28rpx;
  box-sizing: border-box;
}

.confirm-view .head {
  height: 156rpx;
  line-height: 156rpx;
  text-align: center;
  
}

.confirm-view > view:nth-child(3) {
  flex: 1;
  padding: 30rpx 40rpx 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.info-list > view {
  display: flex;
  margin-bottom: 20rpx;
}

.info-list > view > text:nth-child(1) {
  width: 200rpx;
}

.info-list > view > text:nth-child(2) {
  flex: 1;
}

.tex36_33_b {
    font-size: 36rpx;
    color: #333333;
    font-weight: 800;
}
.emptyCon {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.emptyImg {
    width: 250rpx;
    height: 250rpx;
}
.emptyTex {
    font-size: 30rpx;
    color: #666666;
    margin-top: 20rpx;
}
.emailpopup{
	width: 690rpx;
	height: 352rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	display: flex;
	flex-direction: column;
	padding: 0 24rpx;
	box-sizing: border-box;
}
.emailpopup .header {
  height: 40rpx;
  border-bottom: solid 1rpx #e1e1e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0 30rpx;
}
.tex32_33_b {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
}
.tex24_66_b{
	font-size: 24rpx;
	color: #666;
	font-weight: bold;
}
.tex24_33_b {
	font-size: 24rpx;
	color: #333;
	font-weight: bold;
}

.tex24_99{
	font-size: 24rpx;
	color: #999;
}

::v-deep .u-navbar__content{
	background: none !important;
}
</style>