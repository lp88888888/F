<template>
	<view class="" :data-theme="pageTheme"  >
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="topView">
				<up-navbar bgColor="none" @leftClick="toBack" placeholder :fixed="false">
					<template #center>
						<view class="tabs">
							<view :class="['tabs-item', tabsType == 1?'tabsActive':'']" @click.stop="tabsChane(1)">
								<view class="tabs-item-text">货源大厅</view>
								<view class="tabs-item-line"></view>
							</view>
							<view :class="['tabs-item', tabsType == 2?'tabsActive':'']" @click.stop="tabsChane(2)">
								<view class="tabs-item-text">我的订阅</view>
								<view class="tabs-item-line"></view>
							</view>
						</view>
					</template>
				</up-navbar>
				<template v-if="tabsType == 1">
					<view class="selectView">
						<view class="selectView-left">
							<view class="selectView-item"  @click="selectOpen(1)">
								<text class="selectView-item-text">距离排序</text>
								<!-- <image class="selectView-item-img" :src="imgUrl+'static/sj-bottom.png'" mode=""></image> -->
								<up-icon :name="`${imgUrl}static/${sortField==1?'sort-descend-icon':'sort-ascend-icon'}.png`" size="14"></up-icon>
							</view>
							<view class="selectView-item">
								<text class="selectView-item-text" :style="{color: popType == 2? themeStore.themeColors.$primaryColor :'#333333'}"  @click="selectOpen(2)">{{startCity.province.name?startCity.province.name:'全国'}}</text>
								<image class="selectView-item-img" :src="`${imgUrl}static/${popType == 2?'sj-top-ff9600':'sj-bottom'}.png`" @click="selectOpen(2)" mode=""></image>
								<image class="selectView-item-cenimg" :src="imgUrl+'static/D-inf-jt-icon.png'" mode="widthFix"></image>
								<text class="selectView-item-text" :style="{color: popType == 3? themeStore.themeColors.$primaryColor:'#333333'}" @click="selectOpen(3)">{{endCity.province.name?endCity.province.name:'全国'}}</text>
								<image class="selectView-item-img" :src="`${imgUrl}static/${popType == 3?'sj-top-ff9600':'sj-bottom'}.png`" @click="selectOpen(3)" mode=""></image>
							</view>
						</view>
						<view class="selectView-right" @click="selectOpen(4)">
							<text>筛选</text>
							<up-badge v-if="screenList.length" type="error" max="99" :value="screenList.length"></up-badge>
							<image class="selectView-right-icon" v-else :src="imgUrl+'static/D-inf-sift-icon.png'" mode=""></image>
						</view>
					</view>
					<up-gap height="5"></up-gap>
				</template>
			</view>
		</u-sticky>
		<!-- 右侧悬浮按钮 -->
		<view class="fixView" v-if="tabsType == 1">
			<view class="fixView-item" v-if="labelType == 1" @click="lebelClick(2)">
				<up-icon :name="`${imgUrl}static/D-inf-list-map-icon.png`" width="28rpx" height="34rpx"></up-icon>
				<text>地图</text>
			</view>
			<view class="fixView-item" v-if="labelType == 2" @click="lebelClick(1)">
				<up-icon :name="`${imgUrl}static/D-inf-list-lt-icon.png`" size="14"></up-icon>
				<text>列表</text>
			</view> 
			<view class="fixView-item" @click="toNav('/pages_D/informationMatch/orderList')">
				<up-icon :name="`${imgUrl}static/D-inf-list-order-icon.png`" width="28rpx" height="32rpx"></up-icon>
				<text>运单</text>
			</view>
		</view>
		<!-- 货源地图 -->
		<template v-if="tabsType == 1 && labelType == 2">
			<MapList :list="dataList" :total="total"></MapList>
		</template>
		<view class="pageView" v-else>
			<!-- 货源大厅 -->
			<template v-if="tabsType == 1 && labelType == 1">
				<view v-for="(item,index) in dataList" :key="index">
					<ItemDtail :detai="item"></ItemDtail>
				</view>
				<ser-empty v-if="!dataList.length"></ser-empty>
			</template>
			
			<!-- 我的订阅 -->
			<template v-if="tabsType == 2">
				<!-- 已订阅 -->
				<view class="cardView" v-if="mySubscribeDetail.id">
					<TitleLineView title="订阅线路" isButShow @butClick="toNav('/pages_D/informationMatch/addSubscribe')"></TitleLineView>
					<up-gap height="15"></up-gap>
					<view class="cardView-center">
						<view class="cardView-center-item">
							<view class="cardView-center-item-zIcon" style="background: #222836;">装</view>
							<view class="cardView-center-item-text">{{mySubscribeDetail.startAddress}}</view>
						</view>
						<view class="cardView-center-line"></view>
						<view class="cardView-center-item">
							<view class="cardView-center-item-zIcon" :style="{background: themeStore.themeColors.$primaryColor}">卸</view>
							<view class="cardView-center-item-text">{{mySubscribeDetail.endAddress}}</view>
						</view>
					</view>
					<up-gap height="15"></up-gap>
					<view class="cardView-text">
						<text class="cardView-text-item">{{mySubscribeDetail.carTypeText || ''}}</text>
						<view class="cardView-text-line"></view>
						<text class="cardView-text-item">{{mySubscribeDetail.bodyworkLenText}}</text>
					</view>
				</view>
				<!-- 未订阅 -->
				<view class="cardView cardViewTwo" v-else :style="{background: `url(${imgUrl}static/D-inf-card-bg-icon.png) no-repeat`, backgroundSize: '100% 653rpx'}">
					<TitleLineView title="订阅线路"></TitleLineView>
					<up-gap height="20"></up-gap>
					<view class="cardView-cut">
						<up-icon :name="imgUrl+'static/D-inf-news-icon.png'" size="44"></up-icon>
						<view class="cardView-cut-ceent">
							<view class="cardView-cut-title">实时提醒</view>
							<up-gap height="8"></up-gap>
							<view class="cardView-cut-text">有新的货源第一时间通知您</view>
						</view>
					</view>
					<up-gap height="15"></up-gap>
					<view class="cardView-cut">
						<up-icon :name="imgUrl+'static/D-inf-search-icon.png'" size="44"></up-icon>
						<view class="cardView-cut-ceent">
							<view class="cardView-cut-title">快速找货</view>
							<up-gap height="8"></up-gap>
							<view class="cardView-cut-text">方便随时查找常跑路线货源</view>
						</view>
					</view>
					<up-gap height="15"></up-gap>
					<view class="cardView-but" :style="{background: themeStore.themeColors.$primaryColor}" @click="toNav('/pages_D/informationMatch/addSubscribe')">+添加订阅线路</view>
					<up-gap height="15"></up-gap>
				</view>
				<!-- 货源列表 -->
				<view >
					<up-gap height="10"></up-gap>
					<view style="padding: 20rpx 30rpx;box-sizing: border-box;">
						<TitleLineView title="货源列表"></TitleLineView>
						<up-gap height="10"></up-gap>
					</view>
					<view v-for="(item,index) in dataList" :key="index">
						<ItemDtail :detai="item"></ItemDtail>
					</view>
					<ser-empty v-if="!dataList.length"></ser-empty>
				</view>
			</template>
		</view>
		 
		<SelectPopup ref="selectPop" @change="selectChange"></SelectPopup>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import {ref,computed,reactive} from 'vue';
	import { onLoad, onShow,onPageScroll,onReachBottom } from '@dcloudio/uni-app';
	import QQMapWX from "../../common/qqmap-wx-jssdk.js"
	import ItemDtail from "./components/ItemDtail.vue";
	import TitleLineView from "./components/TitleLineView.vue";
	import SelectPopup  from "./components/SelectPopup.vue";
	import MapList from "./mapList.vue";
	import { toNav,toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import {showToast} from '@/utils/util';
	import { listPrSupplySource , getPrSupplyRouteSubscription} from '@/api/premium';
	import { getDictValue } from '@/api/config';
	import type {ItemDetail} from "./types.ts";
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	const selectPop = ref(null);
	const tabsType = ref<number>(1); // 1货源大厅，2我的订阅
	const labelType = ref<number>(1); //1列表，2地图，3运单
	const sortField = ref(0); // 0：升序，1，降序
	
	const dataList = ref<Array<ItemDetail>>([]);
	const listQuery = ref({ 
		pageNum: 1, 
		pageSize: 100,
	});
	

	const lng = ref<number|string>('');
	const lat = ref<number|string>('');
	const total = ref(0);
	const mySubscribeDetail=ref({})
	const screenList = ref([]);//筛选内容
	const screenObj=ref({
		goodsType:'', // 货物类型
		volume:'', // 体积
		weight:'', // 重量
	})
	
	const popType = computed(()=>{
		return selectPop.value?.type
	})
	//装货地址
	const startCity = ref({
		province:{},
		city:{},
		district:{}
	}); 
	 // 卸货地址
	const endCity = ref({
		province:{},
		city:{},
		district:{}
	});
	const lebelClick = (type:number) =>{
		labelType.value = type
	}
	
	const tabsChane = (type:number) =>{
		tabsType.value = type;
		selectPop.value.close()
		init()
	}
	
	// const selectOpen =(type:number)=>{
	// 	if(type == 1){
	// 		sortField.value = sortField.value  == 1?0:1;
	// 		init()
	// 	}else{
	// 		if(selectPop.value.type == type){
	// 			selectPop.value.close()
	// 		}else{
	// 			selectPop.value.type = type
	// 			if(type == 4){
	// 				selectPop.value.open(type,{screenObj:screenObj.value})
	// 			}
	// 			if(type == 3){
	// 				selectPop.value.open(type,{...endCity.value})
	// 			}
	// 			if(type == 2){
	// 				selectPop.value.open(type,{...startCity.value})
	// 			}
				
	// 		}
	// 	}
	// }
	const selectOpen = (type:number) => {
	    if(type == 1){
	        sortField.value = sortField.value == 1?0:1;
	        init()
	    }else{
	        if(selectPop.value.type == type){
	            selectPop.value.close()
	        }else{
	            selectPop.value.type = type
	            if(type == 4){
	                selectPop.value.open(type,{screenObj:screenObj.value})
	            }
	            if(type == 3){
	                selectPop.value.open(type,{...endCity.value})
	            }
	            if(type == 2){
	                selectPop.value.open(type,{...startCity.value})
	            }
	        }
	    }
	}

	const selectChange  = (event)=>{
		console.log('-------',event);
		if(event.type == 4){
			screenObj.value = event.screenObj
		}
		if(event.type == 3){
			endCity.value.province = event.province
			endCity.value.city = event.city
			endCity.value.district = event.district
		}
		if(event.type == 2){
			startCity.value.province = event.province
			startCity.value.city = event.city
			startCity.value.district = event.district
		}
		init()
	}
	const init = async ()=>{
		listQuery.value.pageNum = 1
		total.value= 0
		getData()
	};
	// 查询数据列表
	const getData = async ()=>{
		let params = {
			pageNum:listQuery.value.pageNum,
			pageSize:listQuery.value.pageSize,
		}
		// 我的订阅
		if(tabsType.value == 2){
			params = {...params,...{
				loadingCity: mySubscribeDetail.value.loadingCity,
				loadingDistrict: mySubscribeDetail.value.loadingDistrict,
				loadingProvince: mySubscribeDetail.value.loadingProvince,
				unloadingCity: mySubscribeDetail.value.unloadingCity,
				unloadingDistrict: mySubscribeDetail.value.unloadingDistrict,
				unloadingProvince: mySubscribeDetail.value.unloadingProvince,
				bodyworkLenMax: mySubscribeDetail.value.bodyworkLenMax,
				bodyworkLenMin: mySubscribeDetail.value.bodyworkLenMin,
				carType: '',
			}}
			if(lat.value){
				params.loadingAddrLatitude = lat.value;
				params.loadingAddrLongitude = lng.value;
			}
		}
		// 货源列表
		if(tabsType.value == 1){
			params.sortField = sortField.value;
			if(lat.value){
				params.loadingAddrLatitude = lat.value;
				params.loadingAddrLongitude = lng.value;
			}
			if(startCity.value.province.code){
				params.loadingProvince = startCity.value.province.code
			}
			if(startCity.value.city.code){
				params.loadingCity = startCity.value.city.code
			}
			if(startCity.value.district.code){
				params.loadingDistrict = startCity.value.district.code
			}
			if(endCity.value.province.code){
				params.unloadingProvince = endCity.value.province.code
			}
			if(endCity.value.city.code){
				params.unloadingCity = endCity.value.city.code
			}
			if(endCity.value.district.code){
				params.unloadingDistrict = endCity.value.district.code
			}
			if(screenObj.value.goodsType){
				params.goodsType = screenObj.value.goodsType
			}
			if(screenObj.value.volume){
				let arr = screenObj.value.volume.split(',')
				params.volumeMin = arr[0];
				params.volumeMax = arr[1];
			}
			if(screenObj.value.weight){
				let arr = screenObj.value.weight.split(',')
				params.weightMin = arr[0];
				params.weightMax = arr[1];
			}
			
		}
		try{
			const res = await listPrSupplySource(params)
			if(res.code == 200){
				dataList.value = listQuery.value.pageNum == 1?res.rows:[...dataList.value,...res.rows];
				total.value = res.total;
			}
		}catch(err){

			console.error('Error fetching supply source:', err)
		}
	}
	// 查询订阅路线
	const getUserPro =async()=>{
		try{
			const res = await getPrSupplyRouteSubscription()
			if(res.data){
				mySubscribeDetail.value = res.data
				mySubscribeDetail.value.startAddress = `${res.data.loadingProvinceName}-${res.data.loadingCityName}-${res.data.loadingDistrictName}`
				mySubscribeDetail.value.endAddress = `${res.data.unloadingProvinceName}-${res.data.unloadingCityName}-${res.data.unloadingDistrictName}`
				if(res.data.bodyworkLenMax > 90){
					mySubscribeDetail.value.bodyworkLenText = `${res.data.bodyworkLenMin}米以上`
				}else if(res.data.bodyworkLenMin == 0){
					mySubscribeDetail.value.bodyworkLenText = `${res.data.bodyworkLenMax}米以下`
				}else{
					mySubscribeDetail.value.bodyworkLenText = `${res.data.bodyworkLenMin}-${res.data.bodyworkLenMax}米`
				}
				const res2 = await getDictValue('supply_route_subscription_car_type',res.data.carType);
				if(res2.code == 200){
					mySubscribeDetail.value.carTypeText = res2.code.dictLabel
				}
				init();
			}
		}catch{
			
		}
	}
	//获取当前位置 //遍历获取code
	const getUserAddress = () => {
		qqmapsdk.reverseGeocoder({
			success: (res) => {
				console.log(res, '位置信息');
				lng.value = res.result.location.lng
				lat.value = res.result.location.lat
				if(!res.result.location.lng){
					lat.value = uni.getStorageSync('address').lat;
					lng.value = uni.getStorageSync('address').lng;
				}
				// const { province, city, district } = res.result.address_component;
				// 更新显示字段loadingAddrLongitude
				init()
			},
			fail: (err) => {
				lat.value = uni.getStorageSync('address').lat;
				lng.value = uni.getStorageSync('address').lng;
				console.error('逆地理编码失败:', err);
				init()
			}
		});
	}
	onLoad(()=>{
		lat.value = uni.getStorageSync('address').lat;
		lng.value = uni.getStorageSync('address').lng;
		// uni.getLocation({
		// 	type: 'gcj02', // 腾讯地图使用gcj02坐标系
		// 	success: (res)=>{},
		// 	fail: (err)=>{}
		// });
		getUserAddress()
	})
	onShow(()=>{
		getUserPro();
		
	})
	onReachBottom(()=>{
		console.log("---------------")
		if(listQuery.value.pageNum * listQuery.value.pageSize < total.value){
			listQuery.value.pageNum++;
			getData();
		}
	})
</script>

<style lang="scss">
	page{
		background: #F1EFEC;
		min-height: 100vh;
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.topView{
		width: 750rpx;
		background: var(--head-color);
	}
	.tabs{
		display: flex;
		align-items: center;
		.tabsActive{
			font-size: 34rpx !important;
			.tabs-item-line{
				background: var(--primary-color) !important;
			}
		}
		.tabs-item{
			width: 150rpx;
			text-align: center;
			font-weight: 800;
			font-size: 30rpx;
			color: #000000;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.tabs-item-line{
				width: 50rpx;
				height: 6rpx;
				background: transparent;
				border-radius: 4rpx 4rpx 0rpx 0rpx;
				margin-top: 10rpx;
			}
		}
		
	}
	
	.selectView{
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.selectView-left{
			display: flex;
			align-items: center;
		}
		.selectView-right{
			display: flex;
			align-items: center;
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			padding-left: 30rpx;
			border-left: 1rpx solid #E6E6E6;
			text{
				margin-right: 10rpx;
			}
			.selectView-right-icon{
				width: 30rpx;
				height: 30rpx;
				
			}
		}
		.selectView-item{
			display: flex;
			align-items: center;
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			padding: 16rpx 25rpx;
			box-sizing: border-box;
			line-height: 20rpx;
			background: #F6F6F6;
			border-radius: 16rpx;
			margin-right: 20rpx;
			.selectView-item-img{
				width: 20rpx;
				height: 20rpx;
				margin-left: 10rpx;
			}
			.selectView-item-cenimg{
				width: 34rpx;
				margin: 0 16rpx;
			}
		}
	}
	.cardViewTwo{
		border: none !important;
		padding-top: 70rpx !important;
	}
	.cardView{
		padding: 30rpx;
		box-sizing: border-box;
		width: 100%;
		
		background: $bgTopColor;
		border-radius: 20rpx;
		border: 3px solid #FFFFFF;
		.cardView-center{
			width: 100%;
			height: 200rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			border: 1px dashed var(--primary-color);
			padding: 40rpx;
			box-sizing: border-box;
			.cardView-center-item{
				display: flex;
				align-items: center;
				height: 38rpx;
				line-height: 38rpx;
				.cardView-center-item-zIcon{
					width: 38rpx;
					height: 38rpx;
					border-radius: 8rpx;
					font-weight: 500;
					font-size: 24rpx;
					color: #FFFFFF;
					
					text-align: center;
				}
				.cardView-center-item-text{
					font-weight: bold;
					font-size: 32rpx;
					color: #000000;
					margin-left: 26rpx;
				}
			}
			.cardView-center-line{
				width: 1rpx;
				height: 44rpx;
				margin-left: 17rpx;
				border-left: 1rpx dashed #CCCCCC;
			}
		}
		
		.cardView-text{
			display: flex;
			align-items: center;
			.cardView-text-item{
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}
			.cardView-text-line{
				width: 1rpx;
				height: 22rpx;
				background: #999999;
				margin: 0 20rpx;
			}
		}
		
		.cardView-but{
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			// background: $bgLgColor;
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
		}
		
		.cardView-cut{
			width: 100%;
			padding: 34rpx 30rpx;
			box-sizing: border-box;
			background: #FFFFFF;
			border-radius: 16rpx;
			border: 1px dashed var(--primary-color);
			display: flex;
			
			.cardView-cut-ceent{
				padding-left: 20rpx;
				box-sizing: border-box;
			}
			.cardView-cut-title{
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
			}
			.cardView-cut-text{
				font-weight: 500;
				font-size: 26rpx;
				color: #999999;
			}
		}
		
		
		
	}

	.fixView{
		position: fixed;
		top: 20vh;
		right: 0;
		z-index: 9;
		.fixView-item{
			width: 88rpx;
			height: 88rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 30rpx 0rpx rgba(49,58,80,0.1);
			border-radius: 44rpx 0rpx 0rpx 44rpx;
			margin-bottom: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding-left: 32rpx;
			box-sizing: border-box;
			text{
				font-weight: bold;
				font-size: 18rpx;
				color: #333333;
				line-height: 30rpx;
			}
		}
	}
	
	::v-deep .u-navbar__content{
		background: none !important;
	}
</style>