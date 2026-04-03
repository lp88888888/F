<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar
			bgColor="transparent"
			leftIconColor="#FFFFFF"
			title="我的试驾"
			@leftClick="toBack"
			placeholder
			:titleStyle="{ fontWeight: 'bold', color: '#FFFFFF' }"
		></up-navbar>
		<up-gap height="15"></up-gap>
		<!-- <view class="textView">
			<view class="textView-text">驾驭未来</view>
			<view class="textView-text">先人一步</view>
		</view> -->
		<view style="width: 100%; display: flex; align-items: center; justify-content: center">
			<image class="textView" :src="imgUrl + 'static/new-car-add-text-icon.png'" mode=""></image>
		</view>
		<up-gap height="15"></up-gap>
		<view class="formCard">
			<view class="formCard-item">
				<up-input
					v-model="formData.name"
					placeholder="请输入姓名"
					type="text"
					maxlength="15"
					placeholderStyle="color: #9C948D"
					fontSize="28rpx"
					border="none"
				></up-input>
			</view>
			<view class="formCard-item">
				<up-input
					v-model="formData.tel"
					placeholder="请输入手机号码"
					placeholderStyle="color: #9C948D"
					type="number"
					maxlength="11"
					fontSize="28rpx"
					border="none"
				>
					<!-- <template #suffix>
						<view class="inpuBut">获取</view>
					</template> -->
				</up-input>
			</view>
			<view class="formCard-item" @click="barOpen">
				<!-- <up-input v-model="brandName" placeholder="请选择品牌" readonly placeholderStyle="color: #9C948D" fontSize="28rpx" border="none" ></up-input> -->
				<view class="inputBoooxxx">
					<text class="inputBoooxxx-text1" v-if="brandName">{{ brandName }}</text>
					<text class="inputBoooxxx-text2" style="color: #9c948d" v-else>请选择品牌</text>
					<!-- <up-icon name="arrow-right" size="16"></up-icon> -->
				</view>
			</view>
			<view class="formCard-item" @click="barOpen">
				<!-- <up-input v-model="modelsName" placeholder="请选择车系" readonly placeholderStyle="color: #9C948D" fontSize="28rpx" border="none" ></up-input> -->
				<view class="inputBoooxxx">
					<text class="inputBoooxxx-text1" v-if="modelsName">{{ modelsName }}</text>
					<text class="inputBoooxxx-text2" style="color: #9c948d" v-else>请选择车系</text>
					<!-- <up-icon name="arrow-right" size="16"></up-icon> -->
				</view>
			</view>
			<view class="formCard-item" @click="barOpen">
				<!-- <up-input v-model="seriesName" placeholder="请选择车型" readonly placeholderStyle="color: #9C948D" fontSize="28rpx" border="none" ></up-input> -->
				<view class="inputBoooxxx">
					<text class="inputBoooxxx-text1" v-if="seriesName">{{ seriesName }}</text>
					<text class="inputBoooxxx-text2" style="color: #9c948d" v-else>请选择车型</text>
					<!-- <up-icon name="arrow-right" size="16"></up-icon> -->
				</view>
			</view>
			<view class="formCard-item" @click="timeShow = true">
				<!-- <up-input v-model="formData.time" placeholder="请选择到店时间" readonly placeholderStyle="color: #9C948D" fontSize="28rpx" border="none" ></up-input> -->
				<view class="inputBoooxxx">
					<text class="inputBoooxxx-text1" v-if="formData.time">{{ formData.time }}</text>
					<text class="inputBoooxxx-text2" style="color: #9c948d" v-else>请选择到店时间</text>
					<!-- <up-icon name="arrow-right" size="16"></up-icon> -->
				</view>
			</view>
			<view class="formCard-item" @click="selectListFun" v-if="isshow">
				<!-- <up-input v-model="dealerName" placeholder="请选择门店" readonly placeholderStyle="color: #9C948D" fontSize="28rpx" border="none" ></up-input> -->
				<view class="inputBoooxxx">
					<text class="inputBoooxxx-text1" v-if="dealerName">{{ dealerName }}</text>
					<text class="inputBoooxxx-text2" style="color: #9c948d" v-else>请选择门店</text>
					<!-- <up-icon name="arrow-right" size="16"></up-icon> -->
				</view>
			</view>
		</view>
		<up-datetime-picker
			:show="timeShow"
			v-model="timeValue"
			:minDate="minDate"
			 :max-date="maxDate"
			closeOnClickOverlay
			mode="datetime"
			@cancel="timeClose"
			@close="timeClose"
			@confirm="timeConfirm"
		></up-datetime-picker>
		<up-gap height="25"></up-gap>
		<view class="butto">
			<view class="butto-item butColor1" @click="toNav('/pages_F/appointment/myAppointment?type=' + 2)">我的记录</view>
			<view class="butto-item butColor2" @click="sumbit">立即预约</view>
		</view>
		<BrandSelectPopup ref="brandSelect" @change="brandChange"></BrandSelectPopup>
		<up-picker
			:show="dealerShow"
			:columns="columns"
			:confirmColor="themeStore.themeColors.$primaryColor"
			keyName="name"
			valueName="id"
			@close="prickClose"
			@cancel="prickClose"
			@confirm="prickConfirm"
		></up-picker>
	</view>
</template>

<script setup lang="ts">
import { imgUrl } from '@/config';
import { ref, computed } from 'vue';
import { timeFormat } from '@/uni_modules/uview-plus';
import { debounce } from '@/utils/common';
import theme from '@/utils/theme';
import { insertAppointmentTes, selectList } from '@/api/car';
import { onLoad, onShow, onPageScroll, onUnload } from '@dcloudio/uni-app';
import BrandSelectPopup from '@/components/BrandSelectPopup/index';
import { toNav, toBack } from '@/utils/route';
// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);

const timeShow = ref(false);
const brandSelect = ref(null);
const timeValue = ref<Date>(new Date());
const minDate = ref<Date>(new Date());
const dealerShow = ref(false);
const brandName = ref<any>('');
const modelsName = ref<any>('');
const seriesName = ref<any>('');
const dealerName = ref<any>('');
const columns = ref([]);
const timer = ref(null);
const isshow = ref<Boolean>(false);
const formData = ref({
	name: '',
	tel: '',
	brandId: '',
	seriesId: '',
	typeId: '',
	dealerId: '',
	time: '',
});
const phoneReg = /^1[3-9]\d{9}$/;
const barOpen = () => {
	brandSelect.value.open();
};

  // 有营业结束时间，格式如 '18:30'
 const maxDate = computed(() => {
   if (!closetime.value) {
     return new Date('2030-12-31T18:30:00');
   }
   const [hour, minute] = closetime.value.split(':').map(Number);
   const farFuture = new Date('2030-12-31');
   farFuture.setHours(hour, minute || 0, 0, 0);
   return farFuture;
 });
const brandChange = (event) => {
	console.log('选择的车牌等信息', event);
	brandName.value = event.brandName;
	modelsName.value = event.seriesName;
	dealerName.value = '';
	seriesName.value = event.modelsName;
	formData.value.brandId = event.brandId;
	formData.value.seriesId = event.seriesId;
	formData.value.dealerId = ''
	formData.value.typeId = event.modelsId;
	if (formData.value.typeId) {
		isshow.value = true;
	}
};
const prickClose = () => {
	dealerShow.value = false;
};
const prickConfirm = ({ value }) => {
	const selectedId = value[0].id;
	formData.value.dealerId = selectedId;
	dealerName.value = value[0].name;
	prickClose();
};

const sumbit = debounce(() => {
	insertAppointmentTesFun();
}, 100);

const timeClose = () => {
	timeShow.value = false;
};
const timeConfirm = (event) => {
  const timestamp = event.value; // 这是 number（毫秒时间戳）
    const selectedTime = new Date(timestamp); // ✅ 转成 Date 对象

  // 🔍 如果设置了营业结束时间，进行校验
  if (closetime.value) {
    const [limitHour, limitMin] = closetime.value.split(':').map(Number);
    const selHour = selectedTime.getHours();
    const selMin = selectedTime.getMinutes();

    // ⚠️ 判断是否超过营业结束时间
    if (selHour > limitHour || (selHour === limitHour && selMin > limitMin)) {
      uni.showToast({
        title: `营业时间截止 ${closetime.value}，请选择更早时间`,
        icon: 'none',
        duration: 2000
      });
      // ❌ 不关闭弹窗，让用户重新选择
      return;
    }
  }

  // ✅ 未超限：执行原有逻辑
  timeValue.value = selectedTime;
  formData.value.time = timeFormat(selectedTime, 'yyyy-mm-dd hh:MM:ss');
  timeClose(); // 关闭 picker
};
const insertAppointmentTesFun = async () => {
	if (!formData.value.name) {
		uni.showToast({
			title: '请输入姓名',
			icon: 'none',
			duration: 1000,
		});
		return;
	} else if (!formData.value.tel) {
		uni.showToast({
			title: '请输入手机号',
			icon: 'none',
			duration: 1000,
		});
		return;
	} else if (!phoneReg.test(formData.value.tel)) {
		uni.showToast({
			title: '请输入正确的手机号格式',
			icon: 'none',
			duration: 1000,
		});
		return;
	} else if (!formData.value.brandId) {
		uni.showToast({
			title: '请选择品牌',
			icon: 'none',
			duration: 1000,
		});
		return;
	} else if (!formData.value.time) {
		uni.showToast({
			title: '请选择到店时间',
			icon: 'none',
			duration: 1000,
		});
		return;
	} else if (!formData.value.dealerId) {
		uni.showToast({
			title: '请选择门店',
			icon: 'none',
			duration: 1000,
		});
		return;
	}
	let params = {
		name: formData.value.name,
		phone: formData.value.tel,
		appointmentTime: formData.value.time,
		industryId: formData.value.dealerId,
		carBrandId: formData.value.brandId,
		carSeriesId: formData.value.seriesId,
		carTypeId: formData.value.typeId,
	};
	const res = await insertAppointmentTes(params);
	if (res.data == true) {
		uni.showToast({
			title: '预约成功',
			icon: 'success',
			duration: 500,
		});
	}
	formData.value = {
		name: '',
		tel: '',
		brandId: '',
		seriesId: '',
		typeId: '',
		dealerId: '',
		time: '',
	};
	dealerName.value = '';
	brandName.value = '';
	modelsName.value = '';
	seriesName.value = '';
	setTimeout(() => {
		uni.navigateTo({
			url: '/pages_F/appointment/myAppointment?type=' + 2,
		});
	}, 800);
};

const selectListFun = async () => {
	columns.value = [];
	let params = {
		pageNum: 1,
		pageSize: 100,
		typeCode: 1,
		typeId: formData.value.typeId,
	};
	const res = await selectList(params);
	columns.value.push(res.rows);
	dealerShow.value = true;
};
const closetime=ref('18:30:00')
onLoad((options) => {
	// 初始化状态栏颜色
	uni.setNavigationBarColor({
		frontColor: '#ffffff',
		backgroundColor: '#131313',
	});
	if (options.id) {
		const dataObj = uni.getStorageSync('brand');
		formData.value.brandId = options.id;
		formData.value.seriesId = options.brandId;
		formData.value.typeId = options.carid;
		brandName.value = dataObj.brandName;
		modelsName.value = dataObj.seriesName;
		seriesName.value = dataObj.carTypeName;
		formData.value.dealerId = options.carsid;
		dealerName.value = options.carName;
		closetime.value=dataObj.closeTime
		isshow.value = true;
	}
});
onUnload(() => {});
</script>

<style lang="scss" scoped>
.inputBoooxxx {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	.inputBoooxxx-text1 {
	}
	.inputBoooxxx-text2 {
		color: #c1c5cd;
	}
}
.pageView {
	width: 100%;
	min-height: 100vh;
	// background: #000000;
	background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/new-car-add-icon.png') no-repeat;
	background-size: 100% 100%;
}
.inpuBut {
	font-weight: 400;
	font-size: 28rpx;
	color: var(--primary-color);
}
.textView {
	width: 266rpx;
	height: 188rpx;
	margin: 0 auto;
	// font-weight: 400;
	// font-size: 72rpx;
	// color: #FFFFFF;
	// line-height: 94rpx;
	// text-align: center;
}
.formCard {
	margin: 0 auto;
	width: 622rpx;
	// height: 840rpx;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.16) 100%);
	border-radius: 24rpx 24rpx 24rpx 24rpx;
	border: 2rpx solid #ffffff;
	padding: 40rpx;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-gap: 40rpx;
	.formCard-item {
		width: 100%;
		min-height: 72rpx;
		padding: 0 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: rgba(252, 252, 252, 0.82);
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #fafafa;
	}
}
.butto {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	padding: 0 40rpx;
	.butto-item {
		width: 260rpx;
		height: 96rpx;
		line-height: 96rpx;

		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-weight: 400;
		font-size: 32rpx;

		text-align: center;
	}
	.butColor1 {
		color: #333333;
		background: var(--label-color);
	}
	.butColor2 {
		color: #ffffff;
		background: var(--primary-color);
	}
}
</style>
