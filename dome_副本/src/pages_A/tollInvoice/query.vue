<template>
	<view class="container" :data-theme="pageTheme" >
		<up-navbar bgColor="transparent" title=' ' @leftClick="toBack" :placeholder="false" fixed></up-navbar>
		<view class="header" :style="{ background: `url(${imgUrl}fl_bg1.png) no-repeat`, 'background-size': '100%' }">
			<!-- <cos-header title='ssds' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
				:defaultNavBarheight="100"></cos-header> -->
		</view>

		<view class="form-card">
		  <up-form :model="formData" ref="formRef" :rules="rules">
		    <!-- 入口 -->
		    <view class="field-block">
		      <view class="field-title">
		        <image class="field-icon" :src="imgUrl + 'fl_in.png'" mode="widthFix" />
		        <text class="field-label">入口</text>
		      </view>
		
		      <up-form-item prop="userInfo.entrance" :borderBottom="false" labelWidth="0">
		        <up-input
		          v-model="formData.userInfo.entrance"
		          placeholder="请输入入口收费站名称"
		          border="none"
		          clearable
		          @change="entranceFun"
		          :customStyle="inputStyle"
		        />
		      </up-form-item>
		    </view>
		
		    <!-- 出口 -->
		    <view class="field-block">
		      <view class="field-title">
		        <image class="field-icon" :src="imgUrl + 'fl_out.png'" mode="widthFix" />
		        <text class="field-label">出口</text>
		      </view>
		
		      <up-form-item prop="userInfo.exit" :borderBottom="false" labelWidth="0">
		        <up-input
		          v-model="formData.userInfo.exit"
		          placeholder="请输入出口收费站名称"
		          border="none"
		          clearable
		          @change="entranceFuns"
		          :customStyle="inputStyle"
		        />
		      </up-form-item>
		    </view>
		
		    <!-- 车型 -->
		    <view class="field-block">
		      <view class="field-title">
		        <image class="field-icon" :src="imgUrl + 'fl_car_icon.png'" mode="widthFix" />
		        <text class="field-label">车型</text>
		      </view>
		
		      <up-form-item prop="userInfo.car" :borderBottom="false" labelWidth="0">
		        <view class="car-input" @click="vehicleModel">
		          <!-- 用 readonly（不要 disabled），避免置灰 -->
		          <up-input
		            v-model="formData.userInfo.car"
		            placeholder="请选择您的车型"
		            border="none"
		            readonly
		            :customStyle="carInputStyle"
		          />
		          <view class="car-right" @click.stop="showCarEvt">
		            <image class="icon-q" :src="imgUrl + 'wh_icon1.png'" mode="widthFix" />
		            <up-icon name="arrow-right" color="#C2C2C2" size="16"></up-icon>
		          </view>
		        </view>
		      </up-form-item>
		    </view>
		  </up-form>
		</view>
		<view class="tips">
			<image class="icon-t" :src="imgUrl + 'wh_icon2.png'" mode="widthFix" />
			<text class="fs-24 col6">本功能暂时只提供陕西省内的通行费预估</text>
		</view>
		<view class="bottom-bar">
			<text class="msg">《陕西省通行费收费标准》</text>
			<view class="btn" @click="doSearch">通行费估算</view>
		</view>
		<!-- 入口出口 弹窗 -->
		<up-picker :show="isshow"  :columns="columns" 
			@cancel='isshow=false' @confirm='confirmDown' keyName="label" valueName="id"></up-picker>
			<!-- 车类型 -->
			<up-picker :show="carshow" :columns="carcolumns" 
				@cancel='carshow=false' @confirm='confirmdownCar' keyName="configName" valueName="configKey"></up-picker>
				
		<!-- 车型弹窗 -->
		<view class="car-type">
			<up-popup :show="show" :safeAreaInsetBottom="false" :round="30" mode="center" @close="close" @open="open">
				<view class="car-card">
					<view class="fs-36 fw-600 tc">车型</view>
					<view class="car-item m-b-58">
						<view class="car-title flex ali-cen">
							<!-- <view class="line"></view> -->
							<text class="fs-30 fw-600">客车分类标准</text>
						</view>
						<view class="car-content fs-24 col3 fw-500">
						   <rich-text :nodes="bus" class="box_wenzi"></rich-text>
						</view>
						<image class="fl-car" :src="imgUrl + 'fl_car_1.png'" mode=""></image>
					</view>
					<view class="car-item">
						<view class="car-title flex ali-cen">
							<!-- <view class="line"></view> -->
							<text class="fs-30 fw-600">货车分类标准</text>
						</view>
						<view class="car-content fs-24 col3 fw-500">
							<rich-text :nodes="truck" class="box_wenzi"></rich-text>
						</view>
						<image class="fl-car" :src="imgUrl + 'fl_car_2.png'" mode=""></image>
					</view>
					<view class="close-btn" @click="close">
						<up-icon name="close-circle" color="#FFFFFF" size="32"></up-icon>
					</view>
				</view>
			</up-popup>
		</view>

		<!-- 通行费估算弹窗 -->
		<view class="ygfy">
			<up-popup :show="showCalc" :safeAreaInsetBottom="false" :round="30" mode="center" @close="closes" @open="opens">
				<view class="calc-card">
					<view class="calc-header flex flex-col" :style="bgStyle">
						<view>
							<image class="fl_circle" :src="imgUrl + 'fl_circle.png'" mode=""></image>
							{{carobj.entryStationName}}
						</view>
						<View>
							<image class="fl_line" :src="imgUrl + 'fl_lines.png'" mode=""></image>
						</View>
						<view>
							<image class="fl_circle" :src="imgUrl + 'fl_circle.png'" mode=""></image>
							{{carobj.exitStationName}}
						</view>
					</view>
					<view class="card-popup">
						<view class="calc-content flex flex-col ali-cen">
							<view class="calc-price m-b-10" style="color: #FF5405">
								<text class="fs-28 fw-b">￥</text>
								<text>{{carobj.passFee}}</text>
							</view>
							<text class="fs-26 fw-b">预估算通行费</text>
						</view>
						<view class="calc-footer flex ali-cen">
							<image class="wh_icon2" :src="imgUrl + 'wh_icon2.png'" mode=""></image>
							<text class="cala-info fs-22 col9 fw-500">当前计算为估算费额，仅供参考，以实际收费额为准。</text>
						</view>
					</view>
					<view class="close-btn" @click="closes">
						<up-icon name="close-circle" color="#FFFFFF" size="32"></up-icon>
					</view>
				</view>
			</up-popup>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { imgUrl } from '../../config';
	import { ref, onMounted, computed } from 'vue';
	import theme from '@/utils/theme'
	import CosHeader from '@/components/customNavBar/index.vue';
	import { onLoad } from '@dcloudio/uni-app'
	import { debounce } from '@/utils/common';
	import { toNav,toBack } from '@/utils/route';
	import { getTollPageList, getPassFee,getConfigList,getStationPassFeeAgreement} from '@/api/query';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const isshow = ref<boolean>(false);
	const loading = ref<boolean>(false);
	const columns = ref<Array<Array<any>>>([[]]);
	const carcolumns = ref<Array<Array<any>>>([[]]);
	const uPickerRef = ref<any>(null)
	const entrance=ref<string>('');
	const exit=ref<string>('');
	const entranceid=ref<string>('');
	const exitid=ref<string>('');
	const type= ref<string>('');
	const carshow= ref<boolean>(false);
	const configKey= ref<string>('');
	const carobj= ref<any>('');
	const bus= ref<any>('');
	const truck= ref<any>('');
	const backgroundImage = ref(imgUrl + 'car_up_bg.png')
	const bgStyle = computed(() => {
		if (!backgroundImage.value) return {}
		return {
			backgroundImage: `url(${backgroundImage.value})`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat'
		}
	})
	const inputStyle = {
	  background: '#F8F9FB',
	  borderRadius: '16rpx',
	  padding: '22rpx 24rpx',
	  height: '88rpx',
	  boxSizing: 'border-box'
	}
	
	const carInputStyle = {
	  background: '#F8F9FB',
	  borderRadius: '16rpx',
	  padding: '22rpx 90rpx 22rpx 24rpx', // 右侧留空间给问号/箭头
	  height: '88rpx',
	  boxSizing: 'border-box'
	}

	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 84; // 44是默认导航栏高度
	});
	onLoad(() => {
		getAddresEchoFun()
		getStationPassFeeAgreementFun()
	
	})
	const entranceFun = (e:any) => {
		type.value='1'
		exit.value=''
		isshow.value = true
		entrance.value=e
		getAddresEchoFun()
	}
	const entranceFuns = (e:any) => {
		type.value='2'
		entrance.value=''
		isshow.value = true
		exit.value=e
		getAddresEchoFun()
	}
	const vehicleModel = (e:any) => {
		carshow.value = true
		getConfigListFun()
	}
	const confirmdownCar = (e:any) => {
		const station =e.value[0]
		formData.value.userInfo.car=station.configName
		configKey.value=station.configKey
		carshow.value = false
	}
	
	const confirmDown = (e:any) => {
		console.log(e)
		const station =e.value[0]
		if(type.value=='1'){
			entranceid.value=station.id
			formData.value.userInfo.entrance = station.label
		}else{
			exitid.value=station.id
			formData.value.userInfo.exit = station.label
		}
		isshow.value = false
	}

	const handleCustomTagBlur = () => {
		if (customTag.value.trim()) {
			formData.tag = customTag.value
			isCustomTag.value = true
		}
		showCustomTag.value = false
	}
	const getAddresEchoFun = async () => {
		let address=uni.getStorageSync('address')
		let params = {
			'pageNum': 1,
			"pageSize": 500,
			"tollStationName": entrance.value?entrance.value:exit.value,
			"longitude":address.lng,
			"latitude":address.lat
			
		}
		const res = await getTollPageList(params)
		if (res?.code == 200) {
			let data = res.rows
			 columns.value = [data]
		}
	}
	const hideKeyboard=()=>{
		uni.hideKeyboard();
	}
	const getConfigListFun = async () => {
		const res = await getConfigList()
		carcolumns.value = [res.clazz]	
	}
	const getStationPassFeeAgreementFun = async () => {
		const res = await getStationPassFeeAgreement()
		if (res?.code == '0') {
			let busData= res.clazz[5]
			let truckData= res.clazz[6]
			bus.value=busData[0].content
			truck.value=truckData[0].content
		}
		
	}
	//防抖
	const doSearch = debounce(() => {
		getPassFeeFun();
	}, 300);
	
	 // 通行费估算
	const getPassFeeFun = async () => {
		showCalc.value = true
		if(!entranceid.value){
			uni.showToast({
				title: '入口收费站名称为空',
				icon:'none'
			})	
			return
		}
		if(!exitid.value){
			uni.showToast({
				title: '出口收费站名称为空',
				icon:'none'
			})
			return
		}
		if(!configKey.value){
			uni.showToast({
				title: '请选择车型',
			    icon:'none'  
			})
			return
		}
		let params = {
			"entryStationId":entranceid.value,
			"exitStationId": exitid.value,
			"vehicleType": configKey.value
		}
		const res = await getPassFee(params)
		if (res?.code == '0') {
			carobj.value=res.clazz
			showCalc.value = true
		}
		
	}

	// 表单数据及校验规则
	interface FormData {
		userInfo : {
			entrance : string;
			exit : string;
			car : string;
			// 可以添加其他字段
		};
	}

	const formData = ref<FormData>({
		userInfo: {
			entrance: '',
			exit: '',
			car: '',
		}
	});

	const rules = ref({
		'userInfo.entrance': [
			{ required: true, message: '请输入入口收费站名称', trigger: ['blur', 'change'] },
			
		],
		'userInfo.exit': [
			{ required: true, message: '请输入出口收费站名称', trigger: ['blur', 'change']},
		]
	});

	const formRef = ref(); // 表单引用
	const show = ref(false);
	const showCalc = ref(false);

	const open = () => {
		show.value = true;
	}

	const close = () => {
		show.value = false;
	}

	const opens = () => {
		showCalc.value = true;
	}

	const closes = () => {
		showCalc.value = false;
	}

	const showCarEvt = () => {
		show.value = true;
	}


	
</script>

<style scoped lang="scss">
	.container {
		// padding-top: v-bind('navBarHeight + "px"');
		height: 100vh;
		background: #F8F9FB;

		.header {
			width: 750rpx;
			height: 787rpx;
		}

		.form-card {
			margin: -175rpx 30rpx 0;
			padding: 32rpx 32rpx 0;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;

			::v-deep .u-form-item {
				height: 116rpx;
				line-height: 116rpx;
				background: #FFFFFF;
				border-radius: 30rpx;
				margin-bottom: 30rpx;
				box-sizing: border-box;
				// padding: 0 20rpx;
			}

			::v-deep .u-form-item__body {
				padding: 0;
			}

			::v-deep .u-form-item__body__left__content__label {
				font-weight: bold;
				font-size: 28rpx;
				color: #000000;
			}

			::v-deep .u-input__content__field-wrapper {
				padding-left: 40rpx;
			}

			::v-deep .u-form-item__body__right__message {
				margin-left: 120rpx !important;
			}

			::v-deep .icon-wrapper {
				display: flex;
				align-items: center;

				.u-icon--right:first-child {
					margin-right: 20rpx !important;
				}
			}
		}

		.bottom-bar {
			position: fixed;
			bottom: 0;
			width: 750rpx;
			height: 158rpx;
			background: #FFFFFF;

			.msg {
				position: absolute;
				top: -60rpx;
				left: 50%;
				transform: translateX(-50%);
				font-weight: 500;
				font-size: 26rpx;
				color: var(--primary-color);
			}

			.btn {
				height: 96rpx;
				background: var(--primary-color);
				border-radius: 48rpx;
				margin: 30rpx 64rpx 0;
				text-align: center;
				line-height: 96rpx;
				font-weight: 500;
				font-size: 30rpx;
				color: #FFFFFF;
				box-sizing: border-box;
			}
		}

		.car-card {
			padding: 36rpx 25rpx;
			width: 680rpx;
			background: linear-gradient( 180deg, #A4C5FF 0%, #FFFFFF 100%);
			border-radius: 36rpx;
			box-sizing: border-box;

			.car-item {
				width: 100%;
				background: #FFFFFF;
				border-radius: 26rpx;
				margin-top: 30rpx;
				padding: 36rpx 30rpx;
				position: relative;

				.car-title {
					margin-bottom: 34rpx;

					.line {
						width: 8rpx;
						height: 32rpx;
						background: var(--primary-color);
						border-radius: 4rpx;
						margin-right: 17rpx;
					}
				}

				.car-content {
					line-height: 43rpx;
				}

				.fl-car {
					position: absolute;
					width: 100rpx;
					height: 100rpx;
					top: -22rpx;
					right: 35rpx;
				}
			}

			.close-btn {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
			}
		}

		.calc-card {
			width: 680rpx;
			height: 570rpx;
			// background: #FFFFFF;
			border-radius: 30rpx;

			.calc-header {
				width: 590rpx;
				height: 178rpx;
				margin: 0 50rpx;
				background: var(--primary-color);
				justify-content: space-evenly;
				border-radius: 30rpx 30rpx 0 0;
				font-weight: bold;
				font-size: 34rpx;
				color: #FFFFFF;
				padding: 40rpx 50rpx;
				box-sizing: border-box;
				
				.fl_circle {
					width: 14rpx;
					height: 14rpx;
				}

				.fl_line {
					width: 6rpx;
					height: 36rpx;
					margin-left: 6rpx;
					margin-top: 10rpx;
				}
			}

			.calc-content {
				// margin: 80rpx auto 66rpx;

				.calc-price {
					font-size: 76rpx;
					font-weight: bold;
					color: var(--primary-color);
				}
			}

			.calc-footer {
				width: 624rpx;
				height: 96rpx;
				border-radius: 30rpx;
				margin: 0 30rpx;
				padding: 0 26rpx;
				box-sizing: border-box;

				.cala-info {
					margin-left: 17rpx;
				}
				
				.wh_icon2 {
					width: 28rpx;
					height: 28rpx;
				}
			}

			.close-btn {
				position: absolute;
				bottom: 24rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}

	::v-deep .u-form-item__body__right {
		display: flex;
		align-items: center;
	}
	
.form-card {
  margin: -175rpx 30rpx 0;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 24rpx;
}

/* 每个字段块（上下结构） */
.field-block {
  margin-bottom: 28rpx;
}

.field-title {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.field-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 16rpx;
}

.field-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

/* 让 form-item 不要额外占位/边框 */
::v-deep .u-form-item {
  padding: 0;
  margin: 0;
}
::v-deep .u-form-item__body {
  padding: 0;
}
::v-deep .u-form-item__body__left {
  width: 0 !important; /* 左侧 label 区域彻底干掉 */
}
::v-deep .u-form-item__body__right {
  padding: 0 !important;
}

/* 车型：输入框 + 右侧图标叠在一起 */
.car-input {
  position: relative;
  width: 100%;
}

.car-right {
  position: absolute;
  right: 22rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.icon-q {
  width: 28rpx;
  height: 28rpx;
}

.tips {
	display: flex;
	align-items: center;
}

.icon-t {
	width: 28rpx;
	height: 28rpx;
	margin-right: 4rpx;
	padding-left: 32rpx;
	font-weight: 400;
	font-size: 24rpx;
	color: #666666;
}

.m-b-58 {
	margin-bottom: 58rpx;
}
.ygfy {
	::v-deep .u-popup__content {
		background: transparent !important;
	}
}
// .car-type {
//   ::v-deep .u-popup__content {
//     background: #fff !important;
//   }
// }
.card-popup {
	width: 690rpx;
	height: 316rpx;
	background: #FFFFFF;
	border-radius: 36rpx 36rpx 36rpx 36rpx;
}
</style>