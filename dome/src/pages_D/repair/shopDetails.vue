<template>
	<view class="container">
		<view class="container-top">
			<up-swiper :list="list6" @change="e => currentNum = e.current" :autoplay="false"
				indicatorStyle="right: 20rpx;top:20rpx" radius='20rpx 20rpx 0rpx 0rpx' height='385rpx'>
				<template #indicator>
					<view class="indicator-num">
						<text class="indicator-num__text">{{ currentNum + 1 }}/{{ list6.length }}</text>
					</view>
				</template>
			</up-swiper>
			<view class="jieshao">
				<view class="store-item">
					<!-- 店名 -->
					<text class="store-name">{{ store.name }}</text>
					<!-- 营业时间 -->
					<view class="store-info">
						<image :src="imgUrl+'static/wx-time-icon.png'" class="info-icon"></image>
						<text class="info-text">营业时间：{{ store.openTime }}  -  {{ store.closeTime }}</text>
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
							<view class="btn btn-navigate" @click="godaohang(store)">
								<image :src="imgUrl+'static/hrt.png'" class="btn-icon"></image>
								<text class="btn-text">导航</text>
							</view>
							<view class="btn btn-call" @click="callPhone(store)">
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
			<image :src="imgUrl+store.image" class="store-image"></image>
			<!-- 公司位置和经营车型信息 -->
			<view class="additional-info">
				<text>{{ store.locationAndModels }}</text>
			</view>
		</view>
	<!-- 	<view class="header-box">
			
			<view class="title">
				<view class="title-icon"></view>
				<text>用户评价</text>
			</view>
			<view class="reviewBox">
				<view v-for="(item,index) in listReview" :key="index">
					<up-line color="#EBEBEB"></up-line>
					<view class="fl-fs-sb itemBox" >
						<image class="reviewBox-item-img" :src="imgUrl + 'tx.jpg'" mode=""></image>
						<view class="reviewBox-item">
							<view class="reviewBox-item-info">
								<view class="fl-ce-sb m-b-5">
									<text class="name">{{item.name}}</text>
									<text class="time">2025.05.20</text>
								</view>
								<up-rate count="5" v-model="item.score" size="14" :readonly="true" ></up-rate>
							</view>
							<view class="tetxFont m-t-15">{{ item.content }}</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- <view class="footer-box">
			<view class="footer-box-1" @click="toyuyue()">
				在线预约
			</view>
		</view>
		<up-gap height="95"></up-gap> -->
	</view>

</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { onLoad, onPageScroll } from '@dcloudio/uni-app';
	import { prIndustry4sDetails,getcomlist,getprIndustry4simglist } from '@/api/car';
	import { openAPPLocation ,openLocation,makePhoneCall} from '@/utils/util';
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	const currentNum = ref(0);
	const value1 = ref(Date.now());
	const listReview = ref([
		{name:'张三',score:4,content:'很喜欢这款车，性能很好'},
		{name:'李四',score:4,content:'试驾非常好'},
		{name:'王五',score:4,content:'车 very good'},
		{name:'赵六',score:4,content:'车 very good'},
	]);
	const show = ref(false);
	const keyword = ref('');
	const store = ref({});
	const list6 = ref([
		'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/fewg.png',
		'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/fewg.png',
		'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/fewg.png',
	]);
	onLoad((options) => {
		getPrIndustry4sDetails(options.id);
		getcomlistpj(options.id)
		getprIndustry4simglistsss(options.id)
	})
	const getcomlistpj = async (id) => {
		const res = await getcomlist(id,'AUTO_REPAIR_APPOINTMENT');
		listReview.value=res.data
	}
	const getprIndustry4simglistsss = async (id) => {
		const res = await getprIndustry4simglist(id);
		list6.value=res.data.pr4sPicsVoList.map(item=>item.picUrl)
	}
	const toyuyue = () => {
		uni.navigateTo({
			url: `/pages_D/repair/ScheduleRepair?id=${store.value.id}&name=${store.value.name}`
		})
	}
	// 获取门店详情
	const getPrIndustry4sDetails = async (id: Number | String) => {
		const res = await prIndustry4sDetails(id);
		store.value = res.data;
	}
	const godaohang=async (store: Store) => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": Number(store.longitude),
					"latitude": Number(store.latitude),
					"address": store.address
				}
			}
			openAPPLocation(navigationInfo)
		} else {
			openLocation({
				latitude: Number(store.latitude),
				longitude: Number(store.longitude) ,
				name: store.name,
				address: store.address,
				scale: 14,
			});
		}
		
	};
	const getPrIndustry4sList = async () => {
		let params = {
			typeCodes: 3,
			pageNum: 1,
			pageSize: 10,
			longitude: longitude.value,
			latitude: latitude.value
		}
		const res = await prIndustry4sList(params);
		shops.value = res.rows;
	}
	const callPhone = (store : Store) => {
		console.log(`拨打: ${store.phone}`);
		makePhoneCall(store.contactNumber)
	};
	onPageScroll((e) => {
		console.log(e);
	})
</script>

<style scoped lang="scss">
.reviewBox{
		padding: 0 25rpx;
		box-sizing: border-box;
		.reviewBox-item-img{
			width: 62rpx;
			height: 62rpx;
		}
		.itemBox{
padding: 28rpx 0;box-sizing: border-box;
		}
		.reviewBox-item{
			flex: 1;
			padding-left: 20rpx;
			box-sizing: border-box;
		}
		.name{
			font-weight: 600;
			font-size: 24rpx;
			color: #333333;
			line-height: 34rpx;	
		}
		.time{
			font-weight: 400;
			font-size: 22rpx;
			color: #999999;
			line-height: 30rpx;
		}
		.tetxFont{
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
			line-height: 40rpx;
		}
	}
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

	.footer-box-1 {
		width: 100%;
height: 96rpx;
background: linear-gradient( 180deg, #FFA836 0%, #FF9000 100%);
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
border: 2rpx solid $color;
line-height: 96rpx;
		text-align: center;
font-weight: 700;
font-size: 32rpx;
color: $color;
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
		color: $color;
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
			background: $bgLgColor;
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