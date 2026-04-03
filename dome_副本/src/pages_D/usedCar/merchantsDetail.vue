<template>
	<view class="container" :data-theme="pageTheme" >
		<view class="container-top">
			<up-swiper :list="list6" @change="e => currentNum = e.current" :autoplay="false"
				indicatorStyle="right: 20rpx;top:20rpx" radius='20rpx 20rpx 0rpx 0rpx' height='385rpx'>
				<!-- <template #indicator>
					<view class="indicator-num">
						<text class="indicator-num__text">{{ currentNum + 1 }}/{{ list6.length }}</text>
					</view>
				</template> -->
			</up-swiper>
			<view class="jieshao">
				<view class="store-item">
					<!-- 店名 -->
					<text class="store-name">{{ store.name }}</text>
					<!-- 营业时间 -->
					<view class="store-info">
						<image :src="imgUrl+'static/wx-time-icon.png'" class="info-icon"></image>
						<text class="info-text">营业时间：{{ store.openTime }}-{{store.closeTime}}</text>
					</view>
					<!-- 地址和距离 -->
					<view class="store-info">
						<image :src="imgUrl+'static/wx-weizhi-icon.png'" class="info-icon"></image>
						<text class="info-text">{{ store.address }}</text>
					</view>
					<!-- 导航和电话按钮 -->
					<view class="action-buttons">
						<view class="distance">{{ store.distance }}</view>
						<view style="display: flex;align-items: center;">
							<view class="btn btn-navigate" @click="navigateTo(store.longitude,store.latitude,store.name)">
								<image :src="imgUrl+'static/hrt.png'" class="btn-icon"></image>
								<text class="btn-text">导航</text>
							</view>
							<view class="btn btn-call" @click="callPhone(store.contactNumber)">
								<image :src="imgUrl+'static/rgeg.png'" class="btn-icon"></image>
								<text class="btn-text">电话</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="header-box">
			<!-- 标题 -->
			<view class="title">
				<view class="title-icon"></view>
				<text>门店介绍</text>
				
			</view>
			<!-- <text class="title">门店介绍</text> -->
			<!-- 门店介绍文本 -->
			<view class="description">
				<text>{{ store.introduction }}</text>
			</view>
			<!-- 图片展示 -->
		<!-- 	<image :src="storeInfo.imageUrl" class="store-image"></image> -->
			<!-- 公司位置和经营车型信息 -->
		<!-- 	<view class="additional-info">
				<text>{{ storeInfo.locationAndModels }}</text>
			</view> -->
		</view>
		<view class="header-box">
			<!-- 标题 -->
			<!-- <text class="title">本店热门车型</text> -->
			<view class="title">
				<view class="title-icon"></view>
				<text>本店热门车型</text>
			</view>
			<view v-for="(item,index) in dataList" :key="index">
				<view class="card" @click="toNav('/pages_D/usedCar/carDetail?id='+ item.id)">
					<up-image :src="item.picture" width="172rpx" height="172rpx" radius="16rpx" :lazy-load="true"></up-image>
					<view class="card-center">
						<view class="card-name texNoWrap2">{{item.name}}</view>
						<up-gap height="10"></up-gap>
						<view class="fl-fe-sb" >
							<view class="center-text">{{item.mileage}}公里/ {{ item.transactionsNumber || 0}}手</view>
							<view class="card-price">{{item.price}}万起</view>
						</view>
						
					</view>
				</view>
				<up-gap height="12" ></up-gap>
			</view>
			<!-- <CarList :list="dataList" padding="15rpx 0" :isGap="false"></CarList> -->
		</view>
		<view class="footer-box">
			<view class="footer-box-2" @click="navigateTo(store.longitude,store.latitude,store.name)">
				导航
			</view>
			<view class="footer-box-1" @click="callPhone(store.contactNumber)">
				电话
			</view>
		</view>
		<up-gap height="95"></up-gap>
	</view>

</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { selectOne,selectListBY4sId } from '@/api/car';
	// import CarList from './components/CarList.vue';
	import { toNav, toBack } from '@/utils/route';
	import { listPrOldCarDetail,listPics } from '@/api/oldCar';
	import { onLoad, onPageScroll } from '@dcloudio/uni-app';
	import { openAPPLocation ,openLocation,makePhoneCall} from '@/utils/util';
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	const currentNum = ref(0);
	const value1 = ref(Date.now());
	const dataList = ref([])
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 模拟数据
	const storeInfo = ref({
		description: '陕西福腾汽车贸易有限公司成立于2006年9月，是长安福特公司授权的西部地区最大的福特品牌4S旗舰店。',
		imageUrl: 'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/gr.png', // 替换为真实图片 URL
		locationAndModels: '公司位于西安三桥西部国际车城南门口，与诸多国际知名汽车品牌专营店相毗邻，交通便利，地理位置优越。公司主要经营福特蒙迪欧、锐际、锐界、探险者等车型。'
	});
	const store=ref({});
	const show = ref(false);
	const keyword = ref('');
	const stores = ref([
		{
			id: 1,
			name: '一汽奔腾4S店 (陕西盛达)',
			openingHours: '09:00 - 18:00',
			address: '陕西省西安市雁塔区西沣公路58号',
			distance: '距离您2.25km',
			phone: '13800138000'
		}
	]);
	const list6 = ref([]);
	onLoad((options) => {
     selectOneFun(options.id)
	 selectListBY4sIdFun(options.id)
	})
	const selectOneFun=async (id: Number | String) =>{
	 const res = await selectOne(id);
	   store.value=res.data
	   res.data.pr4sPicsVoList.forEach(item => {
	     list6.value.push(item.picUrl); // 逐个添加到数组
	   });
	   console.log(list6.value)
	}
	const navigateTo = (lon,lat,name) => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": Number(lon),
					"latitude": Number(lat),
					"address": name
				}
			}
			openAPPLocation(navigationInfo)
		} else {
			openLocation({
				latitude:Number(lat),//维度
				longitude:Number(lon),//经度
				scale: 18,//缩放比例，范围5~18，默认为18
				name:name,
			})
		}
		
		
	};

	const callPhone = (store : Store) => {
		console.log(store);
		makePhoneCall(store)
	};
	const selectListBY4sIdFun=async (id: Number | String) =>{
		     let params={
				pageNum:1,
				 pageSize:1000,
				 industryId:id
			 }
	 const res = await listPrOldCarDetail(params);
	   dataList.value=res.rows
	}
	
	onPageScroll((e) => {
		console.log(e);
	})
</script>

<style scoped lang="scss">
	.footer-box {
		width: 100%;
		height: 160rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		padding: 20rpx 32rpx;
		box-sizing: border-box;
	}
	.card{
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 14rpx;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138,78,0,0.05);
		
		display: flex;
		justify-content: space-between;
		position: relative;
		.card-icon{
			width: 126rpx;
			height: 40rpx;
			position: absolute;
			left: 24rpx;
			top: 16rpx;
		}
		.card-center{
			width: calc(100% - 172rpx - 30rpx);
			
			.card-name{
				font-weight: 700;
				font-size: 32rpx;
				color: #333333;
				line-height: 46rpx;
			}
			.center-text{
				font-size: 24rpx;
				font-weight: 400;
				color: #A5A5A5;
				padding: 10rpx 0;
			}
			.card-price{
				font-weight: 700;
				font-size: 28rpx;
				color: var(--primary-color);
			}
			
		}
		
	}

	.footer-box-1 {
		width: 320rpx;
height: 96rpx;
background: var(--primary-color);
border-radius: 48rpx 48rpx 48rpx 48rpx;
		line-height: 96rpx;
		text-align: center;
		color: #FFFFFF;

		font-weight: 700;
font-size: 32rpx;
	}
	.footer-box-2 {
		width: 320rpx;
height: 96rpx;
background: #FFFFFF;
border-radius: 48rpx 48rpx 48rpx 48rpx;
border: 2rpx solid var(--primary-color);
line-height: 96rpx;
		text-align: center;
font-weight: 700;
font-size: 32rpx;
color: var(--primary-color);
	}

	.container {
		background: #F1EFEC;
		padding: 30rpx;
	}

	.indicator-num {
		padding: 2px 0;
		background-color: rgba(0, 0, 0, 0.35);
		border-radius: 100px;
		width: 35px;
		@include flex;
		justify-content: center;

		&__text {
			color: #FFFFFF;
			font-size: 12px;
		}
	}

	.container-top {
		background: #FFFFFF;
		border-radius: 20rpx 20rpx 0rpx 0rpx;
	}

	.jieshao {
		padding: 31rpx;
		border-radius: 0rpx 0rpx 20rpx 20rpx;
	}

	.store-item {
		background-color: #ffffff;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	.store-name {
		font-size: 34rpx;
		color: #000;
		font-weight: bold;
		margin-bottom: 12rpx;
	}

	.store-info {
		display: flex;
		align-items: center;
		margin-top: 31rpx;
	}

	.info-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 17rpx;
	}

	.info-text {
		font-size: 26rpx;
		color: #000000;
	}

	.distance {
		padding-left: 41rpx;
		font-size: 24rpx;
		color: #999;
		margin-left: 10rpx;
	}

	.action-buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.btn {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.btn-icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}

	.btn-text {
		font-size: 22rpx;
		color: #000;
	}

	.btn-navigate {
		color: var(--primary-color);
	}

	.btn-call {
		color: #007aff;
	}

	.header-box {
		margin-top: 30rpx;
		// margin-bottom: 208rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 36rpx 27rpx;
	}

	.title {
		
		height: 40rpx;
		margin-bottom: 20rpx;
		// border-left: 8rpx solid #ff9600;
		// padding-left: 16rpx;
		display: flex;
		align-items: center;
		.title-icon{
			display: inline-block;
			width: 8rpx;
			height: 32rpx;
			background: var(--primary-color);
			border-radius: 122rpx 122rpx 122rpx 122rpx;
			margin-right: 8rpx;
		}
		text{
			font-size: 36rpx;
			line-height: 36rpx;
			color: #333;
			font-weight: bold;
		}
	}
	.description {
		margin-top: 37rpx;
		font-size: 28rpx;
		color: #666;
		line-height: 48rpx;
		margin-bottom: 20rpx;
	}

	.store-image {
		width: 100%;
		height: 230rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}

	.additional-info {
		font-size: 28rpx;
		color: #666;
		line-height: 48rpx;
	}
</style>