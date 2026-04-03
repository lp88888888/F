<template>
	<view class="page">
		<view class="pagebg"></view>

		<up-navbar title="首页" bgColor="transparent" placeholder :fixed="false">
			<template #left>
				<span></span>
			</template>
		</up-navbar>

		<view class="car_box">
			<view class="car_l" @click="handleBackDefault">
				<image class="bkicon" :src="imgUrl + 'static/old_user_back.png'" mode="scaleToFill" />
				<text class="titleText">常规版</text>
			</view>
			<view class="car_l">
				<image v-if="vehicleType == 1 && carNumber" class="kfImg" :src="icoUrl + 'huo_icon.png'" mode="scaleToFill" />
				<image v-if="vehicleType != 1 && carNumber" class="kfImg" :src="icoUrl + 'ke_icon.png'" mode="scaleToFill" />
				<text class="titleText" @click="toNav('/pages_A/car/myCar')">{{ carNumber ? carNumber : '请绑定车辆' }}</text>
				<view v-if="carNumber" @tap.stop>
					<picker mode="selector" :range="licensePlateRange" :value="carPickerIndex" @change="onCarPickerChange">
						<view class="native-select">
							<image class="qhImg" :src="imgUrl + 'static/qh_kh_icon.png'" mode="scaleToFill" />
						</view>
					</picker>
				</view>
			</view>
		</view>

		<scroll-view scroll-y="true" class="scroll_Y">
			<view class="card">
				<view class="card_item" v-for="(item, index) in girdlist.slice(0, 3)" :key="index" @click="tabsClick(item)">
					<image class="card_img" :src="item.iconUrl" mode=""></image>
					<text class="card_text">{{ item.entryName }}</text>
				</view>
			</view>

			<view class="info_box">
				<view class="info_tq" @click="toNav('/pages_A/weather/index')">
					<view class="tq_box">
						<view class="tq_add">
							<view class="add_box">
								<image class="add_icon" :src="icoUrl + 'fw_locatuon.png'" mode=""></image>
								<text class="add_text">{{ address.district }}</text>
							</view>
							<view class="tq_tips">
								<text class="tips_text"></text>
								<text class="tips_text"></text>
							</view>
						</view>
						<view class="tq_now">
							<image class="tq_img" :src="`https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${weatherNow.icon}.png`" mode=""></image>
							<text class="tq_txt">{{ weatherText(weatherNow.text) || '晴' }}</text>
						</view>
					</view>
					<view class="tq_we">
						<text class="wd_num">{{ weatherNow.temp || '15' }}°</text>
						<view class="wd_box">
							<text class="we_d"></text>
							<text class="we_d"></text>
						</view>
					</view>
				</view>
				<view class="info_jf">
					<text class="jf_title">积分商城</text>
					<view class="jf_num_box">
						<text class="jf_num">{{ getAlljf }}</text>
						<text class="jf_text">分</text>
					</view>
					<view class="jf_btn" @click="toNav('/pages/points/index')">
						<text class="jf_btn_text">积分兑换</text>
					</view>
				</view>
			</view>

			<view class="ad_box">
				<image class="ad_img" :src="icoUrl + 'old_ad_sw.png'" mode=""></image>
			</view>

			<view class="card">
				<view class="card_item" v-for="(item, index) in girdlist.slice(3, girdlist.length)" :key="index" @click="tabsClick(item)">
					<image class="card_img" :src="item.iconUrl" mode=""></image>
					<text class="card_text">{{ item.entryName }}</text>
				</view>
			</view>
			<up-gap height="90"></up-gap>
			
			<SateLayer ref="sateLayerRef"></SateLayer>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import SateLayer from '@/components/SateLayer/index.vue';
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { onPageScroll, onUnload, onShow, onReady, onBackPress } from '@dcloudio/uni-app';
import { toNav, toRec, toLau } from '@/utils/route';
import { useAppStore } from '@/store/modules/app';
import { getByUserIdAndVehicleAll } from '@/api/user';
import { getTadayApi } from '@/api/weather';
import { getLocationInfoid } from '@/api/index';
import { gridMenu } from '@/api/home';
import { toast } from '@/utils/common';
import { imgUrl } from '../../config';
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);

const sateLayerRef = ref(null);

const carNumber = ref<any>(uni.getStorageSync('carNumber'));
const vehicleType = ref(2);
const weatherNow = ref<any>({});

const licensePlateRange = computed(() =>
	carNumberList.value.map((v) => v?.licensePlate).filter((s: any) => typeof s === 'string' && s.trim().length > 0)
);
const carNumberList = ref<any[]>([]);
const carPickerIndex = ref(0);

const appStore = useAppStore();
const isLogin = computed(() => {
	return appStore.checkLogin();
});
const weatherText = computed(()=>{
	return (text)=>{
		if(text){
			const pattern = /[晴雾云雨雪阴]/g;
			const matches = text.match(pattern);
			console.log('-0-0-0-00--0-0',matches);
			return matches[0] || '晴'
		}else{
			return '晴'
		}
	}
})
const address = ref({});
const getUserAddress = () => {
	address.value = uni.getStorageSync('address');
	console.log('用户当前位置', address.value);
};

/** ========= 天气 ========= */
const getWeatherNow = async (locationId: string) => {
	const params = {
		key: 'c378003293184af18adad854cc0c12bc',
		location: locationId,
		lang: 'zh-hans',
		unit: 'm',
	};
	try {
		const response: any = await getTadayApi(params);
		weatherNow.value = response.now;
	} catch (error) {}
};

const getcityid = async (e: any) => {
	const params = { locationNameZh: e.district, adm2NameZh: e.city };
	const response: any = await getLocationInfoid(params);
	if (response.code === 200) {
		await getWeatherNow(response.data.locationId);
		uni.setStorageSync('locationId', response.data.locationId);
	}
};

// 返回常规版
const handleBackDefault = () => {
	uni.setStorageSync('oldperson', false);
	toLau('/pages/home/home');
};

// 选择车辆
const onCarPickerChange = (e: any) => {
	const idx = Number(e?.detail?.value ?? 0);
	if (!licensePlateRange.value.length) {
		toast('暂无可选车辆');
		return;
	}
	carPickerIndex.value = idx;
	const plate = licensePlateRange.value[idx];
	vehicleType.value = carNumberList.value[idx].vehicleType;
	carNumber.value = plate;
	uni.setStorageSync('carNumber', carNumber.value);
};

// 金刚区点击
const tabsClick = (item) => {
	console.log('首页金刚区点击', item);
	if (item.jumpPage == '/') return toast('该功能正在快马加鞭赶来的路上');
	// 内部 0，
	if (item.jumpType == 0) {
		toNav(item.jumpPage);
		// 外部 1，
	} else if (item.jumpType == 1) {
		
		// #ifdef MP-WEIXIN
		if (item.custom == 1) return toast('该功能正在快马加鞭赶来的路上');
		// #endif
		uni.navigateTo({
			url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(item.jumpPage),
		});
		// 小程序 2
	} else if (item.jumpType == 2) {
		navLink(item.jumpPage)
	}
};
const navLink = (appid: string) => {
		// 登录校验
		if(appid == 'https://yjglfp.sx12122.cn/'){
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
			});
		}else if(appid == 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/MainTest.html?wxH5=1'){
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
			});
		}else{
			sateLayerRef.value.open(appStore.MiniProgramConfig[appid]);
		}
	};
// 积分
const getAlljf = computed(() => {
	if (!isLogin.value) return 0;
	const info = appStore.userInfo || uni.getStorageSync('userInfo');
	if (!info.pointsAccount) return 0;
	return info.pointsAccount.commonPoint || 0;
});

const getcarData = async () => {
	try {
		const userId = uni.getStorageSync('userInfo')?.id;
		if (!userId) return;
		const params = {
			userId: userId,
		};
		const res: any = await getByUserIdAndVehicleAll(params);
		carNumberList.value = res.data;
		console.log('查询的车辆信息', res.data);
		if (carNumber.value) {
			console.log('存在车牌号', carNumber.value);
			let index = carNumberList.value.findIndex((e) => e.licensePlate == carNumber.value);
			console.log('缓存的车牌在数据哪里', carNumberList.value[index]);
			carPickerIndex.value = index;
			vehicleType.value = carNumberList.value[index].vehicleType;
		} else {
			console.log('不存在车牌号', carNumber.value);
			if (res.data.length) {
				carNumber.value = res.data[0].licensePlate;
				vehicleType.value = res.data[0].vehicleType;
				uni.setStorageSync('carNumber', carNumber.value);
			}
		}
		uni.setStorageSync('vclType', vehicleType.value);
	} catch (e) {}
};

const girdlist = ref([]);
// 根据业务类型查询金刚列表
const businessTypeFun = async () => {
	const now = new Date();
	const params = {
		startTime: formatToMinuteWithSec00(now),
		endTime: formatToMinuteWithSec00(now),
		secondaryIconPath: pageTheme.value,
	};
	const res: any = await gridMenu('5', params);
	console.log('适老版高速路况金刚区', res);
	if (res?.code == 200) {
		const truedata = res.rows.filter((item) => item.enabled == 1);
		// #ifdef APP-HARMONY
		girdlist.value = truedata.filter((item) => item.showDeviceTypes.includes('2'));
		// #endif
		// #ifndef APP-HARMONY
		girdlist.value = truedata;
		// #endif
	}
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const formatToMinuteWithSec00 = (d: Date) => {
	const y = d.getFullYear();
	const m = pad2(d.getMonth() + 1);
	const day = pad2(d.getDate());
	const hh = pad2(d.getHours());
	const mm = pad2(d.getMinutes());
	return `${y}-${m}-${day} ${hh}:${mm}:00`;
};

// 初始化
const initfun = () => {
	getUserAddress();
	getcarData();
	businessTypeFun();
	if (address.value.district) {
		getcityid(address.value);
	}
}

onBackPress((options) => {
	console.log('from:' + options.from)
	uni.setStorageSync('oldperson', false);
})

onMounted(() => {
	initfun()
});

onShow(() => {
	initfun()
});
</script>

<style lang="scss" scoped>
.page {
	width: 750rpx;
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.pagebg {
		width: 750rpx;
		height: 457rpx;
		background: var(--success-color);
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.car_box {
		width: 750rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 24rpx;
		box-sizing: border-box;
		margin-bottom: 48rpx;

		.car_l {
			display: flex;
			flex-direction: row;
			align-items: center;

			.kfImg {
				width: 48rpx;
				height: 48rpx;
				margin-right: 20rpx;
			}
			.titleText {
				font-weight: 400;
				font-size: 36rpx;
				color: #333333;
			}
			.native-select {
				width: 30rpx;
				height: 30rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				margin-left: 10rpx;
				.qhImg {
					width: 30rpx;
					height: 30rpx;
				}
			}

			.bkicon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 12rpx;
			}
		}
	}

	.scroll_Y {
		width: 750rpx;
		flex: 1 0;
		height: 0;
		padding: 0 24rpx;
		.card {
			width: 702rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;

			.card_item {
				width: 234rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.card_img {
					width: 128rpx;
					height: 128rpx;
					margin-bottom: 12rpx;
				}
				.card_text {
					font-weight: 400;
					font-size: 36rpx;
					color: #333333;
				}
			}
		}

		.info_box {
			width: 702rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin: 32rpx 0;
			.info_tq {
				width: 328rpx;
				height: 328rpx;
				background: var(--linear-color);
				box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
				border-radius: 36rpx;
				display: flex;
				flex-direction: row;
				flex-direction: column;
				justify-content: space-around;

				.tq_box {
					width: 328rpx;
					flex: 1 0;
					height: 0;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					margin-bottom: 24rpx;
					padding: 33rpx 27rpx 0 31rpx;
					box-sizing: border-box;
					.tq_add {
						flex: 1 0;
						width: 0;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.add_box {
							display: flex;
							flex-direction: row;
							align-items: center;
							.add_icon {
								width: 48rpx;
								height: 48rpx;
								margin-right: 12rpx;
							}
							.add_text {
								font-weight: 400;
								font-size: 36rpx;
								color: #333333;
							}
						}
						.tq_tips {
							display: flex;
							flex-direction: column;
							.tips_text {
								font-weight: 400;
								font-size: 36rpx;
								color: #909599;
							}
						}
					}
					.tq_now {
						width: 70rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						.tq_img {
							width: 59rpx;
							height: 59rpx;
							margin-bottom: 20rpx;
						}
						.tq_txt {
							font-weight: 400;
							font-size: 60rpx;
							color: var(--primary-color);
							word-break: keep-all;
						}
					}
				}

				.tq_we {
					width: 328rpx;
					height: 93rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					padding: 0 28rpx 18rpx 28rpx;
					box-sizing: border-box;
					.wd_num {
						font-weight: 500;
						font-size: 88rpx;
						color: var(--primary-color);
					}
					.wd_box {
						flex: 1 0;
						height: 93rpx;
						margin-left: 22rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.we_d {
							font-weight: 400;
							font-size: 32rpx;
							color: #333333;
						}
					}
				}
			}
			.info_jf {
				width: 328rpx;
				height: 328rpx;
				background: var(--linear-color);
				box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
				border-radius: 36rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 38rpx 20rpx 24rpx 20rpx;
				box-sizing: border-box;
				.jf_title {
					font-size: 40rpx;
					color: var(--primary-color);
				}
				.jf_num_box {
					display: flex;
					flex-direction: row;
					align-items: flex-end;
					justify-content: center;
					.jf_num {
						font-weight: 500;
						font-size: 80rpx;
						color: #333333;
					}
					.jf_text {
						font-size: 40rpx;
						color: #333333;
						line-height: 70rpx;
					}
				}
				.jf_btn {
					width: 206rpx;
					height: 62rpx;
					background: var(--but-color-line);
					border-radius: 31rpx;
					margin: 0 41rpx;
					text-align: center;
					.jf_btn_text {
						text-align: center;
						line-height: 62rpx;
						font-weight: 400;
						font-size: 32rpx;
						color: #ffffff;
					}
				}
			}
		}

		.ad_box {
			width: 702rpx;
			height: 248rpx;
			background: #d8d8d8;
			box-shadow: 0rpx 0rpx 8rpx 0rpx #d3e7d1;
			border-radius: 32rpx;
			margin-bottom: 32rpx;
			.ad_img {
				width: 702rpx;
				height: 248rpx;
			}
		}
	}
}
</style>
