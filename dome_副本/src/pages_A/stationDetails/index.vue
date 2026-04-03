<template>
	<up-navbar title="" bgColor="transparent" autoBack :fixed="true"></up-navbar>

	<view class="head_img">
		<image :src="stationInfo.readUrl ? stationInfo.readUrl : imgUrl + 'wximage/trip-pro/service-list-banner.png'"
			alt="" :lazy-load="true" />
	</view>

	<view class="info_box">
		<view class="info_1">
			<view class="info_1_t">
				<view>
					<text>{{ stationInfo.serviceAreaName }}</text>
					<text class="direction">{{ stationInfo.lineDirection }}</text>
				</view>
				
				<text class="text-status">{{ yystatus(stationInfo.operationalStatus) }}</text>
			</view>
			<view class="info_1_b">
				<image :src="`${imgUrl}jiayou-icon-map.png`" mode=""></image>
				<text>{{ stationInfo.address }}</text>
				<text>{{ stationInfo.distance }}</text>
				<image @click="goMap(Number(stationInfo.longitude), Number(stationInfo.latitude), stationInfo.address)"
					:src="`${imgUrl}jiayou-icon-dao.png`" mode=""></image>
				<text
					@click="goMap(Number(stationInfo.longitude), Number(stationInfo.latitude), stationInfo.address)">导航</text>
			</view>
		</view>

		<view class="tab_box">
			<template v-for="(item, index) in tabdata" :key="index">
				<view class="tab_item" v-if="item.status" @click="handleTab(item)">
					<text :style="{ color: tabindex === item.value ? themeStore.themeColors.$primaryColor : '#333333' }"
						:class="{ active: tabindex === item.value }">{{ item.label }}</text>
					<image v-if="tabindex === item.value" class="tab_item_img" :src="`${icoUrl}tab_icon.png`" mode="">
					</image>
				</view>
			</template>
		</view>

		<view class="cx_box" v-if="stationInfo.serviceAreaActivityList && stationInfo.serviceAreaActivityList.length">
			<view class="tab_title">
				<view class="">
					<text>促销活动</text>
					<image :src="`${imgUrl}static/fwq_hot.png`" mode=""></image>
				</view>
				<!-- <text class="hdjztime" style="font-size: 24rpx;color: #666; " >活动截止时间:{{stationInfo.serviceAreaActivityList[0].endTime}}</text> -->
			</view>
			<!-- 	<view class="cx_texts" v-for="(item, index) in displayActivities" :key="index">
				<text>{{ item.activityContent }}</text>
			</view> -->
			<view class="activity-container">
				<text class="activity-content" :class="{ 'collapsed': !isExpanded }" @click="handleTextClick">
					{{ fullContent }}
				</text>
			</view>
			<!-- 展开/收起按钮（仅当总条数 > 3 时显示） -->
			<view v-if="fullContent" class="toggle-btn" @click="toggleExpand">
				<text>{{ isExpanded ? '收起' : '展开更多' }}</text>
				<uni-icons :type="isExpanded ? 'arrowup' : 'arrowdown'" size="14"
					:color="themeStore.themeColors.$badgeBgColor" />
			</view>
		</view>

		<view class="jc_box" v-if="jcList.length">
			<view class="tab_title">
				<text>基础设施</text>
			</view>
			<view class="jc_tags">
				<view :style="{ background: themeStore.themeColors.$badgeBgColor }" class="jc_tag_item"
					v-for="(item, index) in jcList" :key="index">
					<image :src="item.serviceInfoPicUrl" mode=""></image>
					<text :style="{ color: themeStore.themeColors.$primaryColor }">{{ item.serviceInfoName }}</text>
				</view>
			</view>
		</view>
		<view class="jc_box2" v-if="tsList.length">
			<view class="tab_title">
				<text>特色设施</text>
			</view>
			<view class="jc_tags">
				<view :style="{ background: '#FFF6DC' }" class="jc_tag_item"
					v-for="(item, index) in tsList" :key="index">
					<image :src="item.serviceInfoPicUrl" mode=""></image>
					<text :style="{ color: '#FFBC05' }">{{ item.serviceInfoName }}</text>
				</view>
			</view>
		</view>

		<view class="c_j_box" v-if="stationInfo.gasStationList.length || stationInfo.chargingStationList.length">
			<view class="tab_title">
				<text>加油/充电</text>
			</view>
			<view class="jy_item" v-for="(item, index) in stationInfo.gasStationList" :key="index"
				@click="goJyDetail(item)">
				<view class="jy_t">
					<view class="">
						<image :src="`${imgUrl}static/fwq_jy.png`" mode=""></image>
						<text>{{ item.stationName }}</text>
						<text
							:class="[item.stationStatus == '1' ? 'icon1' : 'icon2']">{{ ['', '营业中', '下架'][item.stationStatus] }}</text>
					</view>
					<view class="">
						<text>去加油</text>
						<uni-icons type="right" color="#333333"></uni-icons>
					</view>
				</view>
				<view class="jy_b">
					<view class="jy_b_item" v-for="(item1, index1) in item.odsGasStationOilPriceVoList" :key="index1">
						<text>{{ item1.oilName }}</text>
						<text>{{ item1.stationPrice }}元/L</text>
					</view>
				</view>
			</view>
			<view class="cd_item" v-for="(item, index) in stationInfo.chargingStationList" :key="index"
				@click="goCdDetail(item)">
				<view class="cd_t">
					<view class="">
						<image :src="`${imgUrl}static/fwq_cd.png`" mode=""></image>
						<text>{{ item.stationName }}</text>
						<text
							:class="[item.stationStatus == '50' ? 'icon1' : 'icon2']">{{ cdstatus(item.stationStatus) }}</text>
					</view>
					<view class="">
						<text>去充电</text>
						<uni-icons type="right" color="#333333"></uni-icons>
					</view>
				</view>
				<view class="cd_b">
					<view class="cd_b_item">
						<view class=""></view>
						<text>充电桩</text>
						<view class="">
							<text>快</text>
							<text>空{{ item.fastFree || 0 }}/{{ item.fastTotal || 0 }}</text>
						</view>
						<view class="">
							<text>慢</text>
							<text>空{{ item.slowFree || 0 }}/{{ item.slowTotal || 0 }}</text>
						</view>
					</view>
					<!-- <view class="cd_b_item">
						<view class=""></view>
						<text>充电桩</text>
						<view class="">
							<text>快</text>
							<text>空0/0</text>
						</view>
						<view class="">
							<text>慢</text>
							<text>空0/0</text>
						</view>
					</view> -->
				</view>
			</view>
		</view>

		<!-- <view class="cy_box">
			<view class="tab_title">
				<text>餐饮</text>
				<view class="mor">
					<text>全部餐饮</text>
					<uni-icons type="right" color="#333333"></uni-icons>
				</view>
			</view>
			<view class="cy_tags">
				<view :style="{ background: themeStore.themeColors.$badgeBgColor}" class="cy_tag_item" v-for="(item, index) in 7">
					<text :style="{ color: themeStore.themeColors.$primaryColor}">牛肉面</text>
				</view>
			</view>
		</view> -->

		<view class="qx_box" v-if="stationInfo.serviceAreaPointsList && stationInfo.serviceAreaPointsList.length">
			<view class="tab_title">
				<text>汽修</text>
			</view>
			<view class="qx_item" v-for="(item, index) in stationInfo.serviceAreaPointsList" :key="index"
				@click="goWxDetail(item)">
				<view class="qx_item_t">
					<image :src="item.image || `${imgUrl}service-list-default.png`" mode=""></image>
					<!-- <text class="qx_item_t_tag">离我最近</text> -->
				</view>
				<view class="qx_item_b">
					<text>{{ item.name }}</text>
					<text>营业时间｜{{ item.serviceHours }}</text>
					<view class="">
						<view
							:style="{ color: themeStore.themeColors.$primaryColor, borderColor: themeStore.themeColors.$primaryColor }"
							@click.stop="goMap(Number(item.longitude), Number(item.latitude), item.address)">导航到店</view>
						<view v-if="item.contactPhone"
							:style="{ color: themeStore.themeColors.$primaryColor, borderColor: themeStore.themeColors.$primaryColor }"
							@click.stop="makeCall(item.contactPhone)">电话联系</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="zs_box" v-if="stationInfo.hotelList && stationInfo.hotelList.length">
			<view class="tab_title">
				<text>住宿</text>
			</view>
			<view class="qx_item" v-for="(item, index) in stationInfo.hotelList" :key="index"
				@click="goHotelDetail(item)">
				<view class="qx_item_t">
					<image :src="jdimg(item.mainImage)" mode=""></image>
					<text class="zs_item_t_tag">{{ ['停业', '营业'][item.status] }}</text>
				</view>
				<view class="qx_item_b">
					<text>{{ item.hotelName }}</text>
					<text>{{ item.intro }}</text>
					<view class="">
						<view
							:style="{ color: themeStore.themeColors.$primaryColor, borderColor: themeStore.themeColors.$primaryColor }">
							去预约</view>
						<view
							:style="{ color: themeStore.themeColors.$primaryColor, borderColor: themeStore.themeColors.$primaryColor }"
							@click.stop="makeCall(item.contactPhone)">电话联系</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="wl_box">
			<view class="tab_title">
				<text>周边文旅</text>
				<view class="h_btn" :style="{ color: themeStore.themeColors.$primaryColor, borderColor: themeStore.themeColors.$primaryColor }">换一批</view>
			</view>
			<up-waterfall v-model="wldata" columns="2">
				<template v-slot:column="{ colList, colIndex }">
					<view class="wl_item" v-for="(item, index) in 7" :key="index">
						<view class="wl_t">
							<image src="/src/static/tabbar/tabbar-service.png" mode=""></image>
							<text>吃</text>
						</view>
						<view class="wl_b">
							<text>西府老街</text>
							<text>西府老街位于宝鸡市金合区胜利塬，是一个集西府…</text>
						</view>
					</view>
				</template>
			</up-waterfall>
		</view> -->
	</view>
</template>

<script setup lang="ts">
	import { imgUrl } from '../../config';
	import { ref, onMounted, computed } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { getServiceAreaById, getTollStationById } from '@/api/map';
	import { openAPPLocation, openLocation, makePhoneCall } from '@/utils/util';
	import { toNav } from '@/utils/route';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = computed(() => themeStore.imgUrl);

	const id = ref<string>('');
	const latitude = ref<number>(0);
	const longitude = ref<number>(0);
	const isExpanded = ref(false)
	const stationInfo = ref<any>({
		serviceAreaActivityList: [],
		detailList: [],
	});
const numberToChineseDigits = (num: number) => {
	 const map = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
	  return String(num)
	    .split('')
	    .map(digit => map[Number(digit)])
	    .join('');
};
	const jcList = computed(()=>{
		if(stationInfo.value.detailList && stationInfo.value.detailList.length){
			return stationInfo.value.detailList.filter(item=>item.serviceInfoCode != '05' && item.serviceInfoCode != '13'  && item.serviceInfoCode != '16')
		}else{
			return []
		}
	})
	const tsList = computed(()=>{
		if(stationInfo.value.detailList && stationInfo.value.detailList.length){
			return stationInfo.value.detailList.filter(item=>item.serviceInfoCode == '05' || item.serviceInfoCode == '13' || item.serviceInfoCode == '16')
		}else{
			return []
		}
	})
	const fullContent = computed(() => {
		return (stationInfo.value.serviceAreaActivityList || [])
			.map((item, index) => { const timeRange = `\n活动${numberToChineseDigits(index + 1)}:\n时间：${item.startTime}-${item.endTime}\n`; return `${timeRange} ${item.activityContent}` })
			.join('\n')
	})
	const shouldShowToggle = ref(false)

	const toggleExpand = () => {
		isExpanded.value = !isExpanded.value
	}
	// 运营状态
	const yystatus = (val) => {
		const obj = {
			'01': '正常',
			'02': '关闭',
		};
		return obj[val] || '';
	};
	const handleEstimate = (item) => {
		if (item.serviceAreaName == '曲江服务区' || item.serviceAreaName == '汉城服务区') {
			return `(${['', '内环', '外环'][item.locationDirection]})`;
		}
		if (item.locationDirection) {
			return `(${item.serviceAreaName.indexOf('绕城') != -1 ? ['', '内环', '外环'][item.locationDirection] : ['', '上行', '下行'][item.locationDirection]
				})`;
		}
		return '';
	};
	// 充电站状态
	const cdstatus = (val) => {
		switch (val) {
			case '50':
				return '营业中';
			case '6':
				return '维护中';
			case '5':
				return '关闭';
			case '1':
				return '建设中';
			default:
				return '未知';
		}
	};

	// 酒店照片
	const jdimg = (val) => {
		if (!val) return '';
		const arr = val.split(',');
		return arr[0];
	};

	const tabindex = ref(0);
	const tabdata = ref([
		{
			label: '促销活动',
			value: 0,
			id: '.cx_box',
			status: computed(() => stationInfo.value.serviceAreaActivityList && stationInfo.value.serviceAreaActivityList.length > 0),
		},
		{
			label: '基础设施',
			value: 1,
			id: '.jc_box',
			// status: computed(() => stationInfo.value.detailList && stationInfo.value.detailList.length > 0),
			status: computed(() => jcList.value && jcList.value.length > 0),
		},
		{
			label: '特色设施',
			value: 7,
			id: '.jc_box2',
			// status: computed(() => stationInfo.value.detailList && stationInfo.value.detailList.length > 0),
			status: computed(() => tsList.value && tsList.value.length > 0),
		},
		{
			label: '加油/充电',
			value: 2,
			id: '.c_j_box',
			status: computed(() => (stationInfo.value.gasStationList && stationInfo.value.gasStationList.length > 0) || (stationInfo.value.chargingStationList && stationInfo.value.chargingStationList.length > 0)),
		},
		{
			label: '餐饮',
			value: 3,
			id: '.cy_box',
			status: false,
		},
		{
			label: '汽修',
			value: 4,
			id: '.qx_box',
			status: computed(() => stationInfo.value.serviceAreaPointsList && stationInfo.value.serviceAreaPointsList.length > 0),
		},
		{
			label: '住宿',
			value: 5,
			id: '.zs_box',
			status: computed(() => stationInfo.value.hotelList && stationInfo.value.hotelList.length > 0),
		},
		{
			label: '周边文旅',
			value: 6,
			id: '.wl_box',
			status: false,
		},
	]);
	const handleTab = (item) => {
		console.log('点击切换', item);
		tabindex.value = item.value;
		uni.pageScrollTo({
			selector: item.id,
		});
	};

	// 文旅数据
	const wldata = ref([]);

	// 跳转到地图页面
	const goMap = (longitude, latitude, address) => {
		// #ifdef APP-PLUS
		const navigationInfo = {
			endLocation: {
				longitude: Number(stationInfo.value.longitude),
				latitude: Number(stationInfo.value.latitude),
				address: stationInfo.value.address,
			},
		};
		openAPPLocation(navigationInfo);
		//  #endif
		// #ifdef MP-WEIXIN || APP-HARMONY
		openLocation({
			latitude: Number(stationInfo.value.latitude), // 纬度
			longitude: Number(stationInfo.value.longitude), // 经度
			name: stationInfo.value.serviceAreaName, // 地址名称（服务区名称）
			address: stationInfo.value.address, // 地址
			scale: 18, // 缩放级别，1~20，数值越大，地图越精细
		});
		// #endif
	};

	// 去加油
	const goJyDetail = (item) => {
		toNav('/pages_D/refuelingRefilling/details?merId=' + item.stationId);
	};

	// 去充电
	const goCdDetail = (item) => {
		toNav('/pages_A/chargingPiles/queryDetail?id=' + item.stationId);
	};

	// 去维修
	// const goWxDetail = (item) => {
	// 	toNav('/pages_D/repair/shopDetails?id=' + item.id);
	// };

	// 跳转酒店详情
	const goHotelDetail = (item) => {
		toNav('/pages_B/hotel/hotelDetails?id=' + item.id);
	};

	// 联系电话
	const makeCall = (phone) => {
		makePhoneCall(phone);
	};

	// 获取站点详情
	const getDetail = async () => {
		try {
			// 请求服务区数据
			const res = await getServiceAreaById(id.value,{
				longitude: uni.getStorageSync('address').lng,
				latitude: uni.getStorageSync('address').lat,
			});
			console.log('查询的服务区数据', res);
			const info = res.data;

			latitude.value = Number(info.latitude) || Number(info.baseInfo?.latitude) || 0;
			longitude.value = Number(info.longitude) || Number(info.baseInfo?.longitude) || 0;

			// 更新状态
			stationInfo.value = info;
			console.log('服务区详情数据', stationInfo.value);
		} catch (error) {
			console.error('获取站点详情失败:', error);
		}
	};

	onLoad((options) => {
		id.value = options.id;
	});
	// 页面加载时获取数据
	onShow(() => {
		getDetail();
	});
</script>

<style scoped lang="scss">
	.hdjztime {
		font-size: 24rpx;
		color: #666;
	}

	.activity-container {
		position: relative;
		overflow: hidden;
	}

	.activity-content {
		font-size: 28rpx;
		line-height: 1.6;
		color: #333;
		word-break: break-all;
	}

	/* 收起状态：最多 3 行，显示省略号 */
	.activity-content.collapsed {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		/* 最多 3 行 */
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.toggle-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 0;
		color: #628f2f;
		font-size: 28rpx;
	}

	.head_img {
		width: 750rpx;
		height: 514rpx;
		position: relative;
		z-index: 1;

		image {
			width: 100%;
			height: 100%;
			position: relative;
			z-index: 1;
		}
	}

	view,
	text {
		box-sizing: border-box;
	}

	.info_box {
		width: 100%;
		background-color: #f8f9fb;
		border-radius: 40rpx 40rpx 0px 0px;
		margin-top: -115rpx;
		position: relative;
		z-index: 1;
		padding-bottom: 100rpx;

		.info_1 {
			width: 750rpx;
			border-radius: 40rpx 40rpx 0px 0px;
			background-color: #ffffff;
			padding: 60rpx 30rpx 26rpx 30rpx;
			
			.info_1_t {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 34rpx;

				text:nth-child(1) {
					font-size: 40rpx;
					font-weight: 500;
					color: #333333;
				}

				// text:nth-child(2) {
				// 	font-size: 28rpx;
				// 	color: #8ebe57;
				// }
			}
			.text-status{
				font-size: 28rpx;
				color: #8ebe57;
			}
			.direction {
				font-size: 26rpx;
				color: #666;
				margin-left: 16rpx;
			}

			.info_1_b {
				display: flex;

				image {
					width: 28rpx;
					height: 28rpx;
					margin-right: 16rpx;
				}

				text:nth-child(2) {
					flex: 1 0;
					font-size: 28rpx;
					color: #333333;
				}

				text:nth-child(3) {
					font-size: 24rpx;
					color: #666666;
					margin-right: 30rpx;
				}

				text:nth-child(5) {
					font-size: 24rpx;
					color: #333333;
					word-break: keep-all;
				}
			}
		}

		.tab_box {
			width: 750rpx;
			height: 110rpx;
			display: flex;
			align-items: center;
			column-gap: 22rpx;
			flex-wrap: nowrap;
			white-space: nowrap;
			padding-left: 30rpx;
			overflow-x: auto;

			.tab_item {
				display: flex;
				flex-direction: column;
				align-items: center;

				text {
					font-size: 28rpx;
					color: #333333;
					margin-bottom: 8rpx;
					white-space: nowrap;
					word-break: keep-all;
				}

				image {
					width: 30rpx;
					height: 6rpx;
				}

				.active {
					font-weight: 500;
					color: #628f2f;
				}
			}
		}

		.tab_title {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 12rpx;

			view:nth-child(1) {
				display: flex;
				align-items: center;
			}

			text {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				margin-right: 10rpx;
			}

			image {
				width: 32rpx;
				height: 32rpx;
			}

			.mor {
				display: flex;
				align-items: center;

				>text:nth-child(1) {
					font-size: 24rpx;
					color: #666666;
				}
			}

			.h_btn {
				width: 120rpx;
				height: 44rpx;
				border-radius: 48rpx;
				border: 2rpx solid #628f2f;
				text-align: center;
				line-height: 40rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #628f2f;
			}
		}

		.cx_box {
			width: 750rpx;
			margin-bottom: 10rpx;
			padding: 30rpx;
			background-color: #ffffff;

			.cx_texts {
				font-size: 28rpx;
				color: #666666;
				margin-bottom: 30rpx;
			}

			.cx_texts:last-child {
				margin-bottom: 0;
			}
		}

		.jc_box,.jc_box2 {
			width: 750rpx;
			margin-bottom: 10rpx;
			padding: 30rpx;
			background-color: #ffffff;

			.jc_tags {
				width: 690rpx;
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 20rpx;

				.jc_tag_item {
					width: 100%;
					height: 60rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 14rpx;
					background-color: #ebf9eb;
					padding: 0 26rpx;
					overflow: hidden;

					image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 8rpx;
					}

					text {
						// flex: 1 0;
						// width: 0;
						font-size: 28rpx;
						color: #628f2f;
						// word-break: keep-all;
						// overflow: hidden;
						// white-space: nowrap;
						// text-overflow: ellipsis;
					}
				}
			}
		}

		.c_j_box {
			width: 750rpx;
			margin-bottom: 10rpx;
			padding: 30rpx;
			background-color: #ffffff;

			.jy_item {
				width: 100%;
				margin-bottom: 40rpx;
				background-color: #F8F9FB;
				padding: 24rpx;
				border-radius: 20rpx;

				.jy_t {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 26rpx;

					view {
						display: flex;
						align-items: center;
					}

					view:nth-child(1) {
						image {
							width: 40rpx;
							height: 40rpx;
							margin-right: 10rpx;
						}

						text:nth-child(2) {
							font-size: 32rpx;
							font-weight: 500;
							color: #333333;
							margin-right: 18rpx;
						}

						text:nth-child(3) {
							height: 32rpx;
							padding: 0 6rpx;
							border-radius: 8rpx;
							background-color: #eafff6;
							border: 2rpx solid #21c65e;
							font-size: 20rpx;
							font-weight: 500;
							color: #21c65e;
							line-height: 28rpx;
						}
					}

					view:nth-child(2) {
						text:nth-child(4) {
							font-size: 24rpx;
							color: #666666;
						}
					}
				}

				.jy_b {
					padding-left: 50rpx;
					display: grid;
					grid-template-columns: repeat(3, 1fr);

					.jy_b_item {
						width: 100%;
						display: flex;
						align-items: center;

						text:nth-child(1) {
							font-weight: 500;
							font-size: 24rpx;
							color: #333333;
							margin-right: 10rpx;
						}

						text:nth-child(2) {
							font-weight: 500;
							font-size: 28rpx;
							color: #fb0e0e;
						}
					}
				}
			}

			.cd_item {
				width: 100%;
				margin-bottom: 40rpx;
				background-color: #F8F9FB;
				padding: 24rpx;
				border-radius: 20rpx;

				.cd_t {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 26rpx;

					view {
						display: flex;
						align-items: center;
					}

					view:nth-child(1) {
						image {
							width: 40rpx;
							height: 40rpx;
							margin-right: 10rpx;
						}

						text:nth-child(2) {
							font-size: 32rpx;
							font-weight: 500;
							color: #333333;
							margin-right: 18rpx;
						}

						text:nth-child(3) {
							height: 32rpx;
							padding: 0 6rpx;
							border-radius: 8rpx;
							background-color: #eafff6;
							border: 2rpx solid #21c65e;
							font-size: 20rpx;
							font-weight: 500;
							color: #21c65e;
							line-height: 28rpx;
						}
					}

					view:nth-child(2) {
						text:nth-child(4) {
							font-size: 24rpx;
							color: #666666;
						}
					}
				}

				.cd_b {
					padding-left: 50rpx;

					.cd_b_item:nth-child(1) {
						margin-bottom: 32rpx;
					}

					.cd_b_item {
						width: 100%;
						display: flex;
						align-items: center;

						>view:nth-child(1) {
							width: 12rpx;
							height: 12rpx;
							border-radius: 50%;
							background: #94d34d;
							margin-right: 12rpx;
						}

						>text:nth-child(2) {
							font-size: 28rpx;
							color: #333333;
							margin-right: 56rpx;
						}

						>view:nth-child(3),
						>view:nth-child(4) {
							height: 36rpx;
							border-radius: 8rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-right: 40rpx;

							text:nth-child(1) {
								width: 40rpx;
								height: 36rpx;
								text-align: center;
								line-height: 36rpx;
								border-radius: 8rpx;
								font-size: 24rpx;
								font-weight: 500;
								color: #ffffff;
							}

							text:nth-child(2) {
								flex: 1 0;
								text-align: center;
								font-size: 24rpx;
								font-weight: 500;
								line-height: 36rpx;
								padding: 0 10rpx;
							}
						}

						>view:nth-child(3) {
							background: rgba(98, 143, 47, 0.1);
							border: 2rpx solid #628f2f;

							text:nth-child(1) {
								background: #628f2f;
							}

							text:nth-child(2) {
								color: #628f2f;
							}
						}

						>view:nth-child(4) {
							background: #eaf1ff;
							border: 2rpx solid #4381ed;

							text:nth-child(1) {
								background: #4381ed;
							}

							text:nth-child(2) {
								color: #4381ed;
							}
						}
					}
				}
			}

			.icon1 {
				color: #21c65e;
				background-color: #eafff6;
				border-color: #21c65e;
			}

			.icon2 {
				color: #999999;
				background-color: rgba(51, 51, 51, 0.06);
				border-color: #999999;
			}
		}

		.cy_box {
			width: 750rpx;
			margin-bottom: 10rpx;
			padding: 30rpx;
			background-color: #ffffff;

			.cy_tags {
				width: 100%;
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				gap: 20rpx;

				.cy_tag_item {
					width: 100%;
					height: 60rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 70rpx;
					background-color: #ebf9eb;

					text {
						font-size: 28rpx;
						color: #628f2f;
						word-break: keep-all;
					}
				}
			}
		}

		.qx_box,
		.zs_box {
			width: 750rpx;
			margin-bottom: 10rpx;
			padding: 30rpx;
			background-color: #ffffff;
			display: flex;
			flex-direction: column;
			row-gap: 20rpx;

			.qx_item {
				width: 100%;
				display: flex;
				align-items: center;

				.qx_item_t {
					width: 164rpx;
					height: 164rpx;
					margin-right: 20rpx;
					position: relative;
					box-shadow: 0px 0px 8rpx 0px rgba(0, 0, 0, 0.06);
					border-radius: 12rpx;

					image {
						width: 164rpx;
						height: 164rpx;
						border-radius: 12rpx;
					}

					text {
						position: absolute;
						top: 0;
						left: 0;
						height: 28rpx;
						padding: 0 8rpx;
						line-height: 28rpx;
						font-size: 20rpx;
						font-weight: 500;
						color: #ffffff;
						border-radius: 12rpx 0px 12rpx 0px;
					}

					.qx_item_t_tag {
						background: rgba(0, 0, 0, 0.35);
					}

					.zs_item_t_tag {
						background: rgba(33, 198, 94, 0.8);
					}
				}

				.qx_item_b {
					flex: 1 0;
					width: 0;
					height: 164rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					text:nth-child(1) {
						width: 100%;
						font-size: 32rpx;
						font-weight: 500;
						color: #333333;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					text:nth-child(2) {
						width: 100%;
						font-size: 24rpx;
						color: #666666;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					view:nth-child(3) {
						width: 100%;
						display: flex;
						justify-content: flex-end;
						column-gap: 18rpx;

						view {
							width: 160rpx;
							height: 56rpx;
							border-radius: 48rpx;
							box-sizing: border-box;
							border: 2rpx solid #628f2f;
							text-align: center;
							line-height: 52rpx;
							font-size: 28rpx;
							font-weight: 500;
							color: #628f2f;
						}
					}
				}
			}
		}

		.wl_box {
			width: 750rpx;
			margin-bottom: 10rpx;
			padding: 30rpx;
			background-color: #ffffff;

			.wl_item {
				width: 330rpx;
				background-color: #ffffff;
				border-radius: 16rpx;
				box-shadow: 0px 0px 12rpx 0px rgba(0, 0, 0, 0.05);
				margin-bottom: 30rpx;

				.wl_t {
					width: 330rpx;
					height: 330rpx;
					border-radius: 16rpx 16rpx 0 0;
					position: relative;
					overflow: hidden;

					image {
						width: 330rpx;
						height: 330rpx;
						background-color: red;
					}

					text {
						width: 90rpx;
						height: 48rpx;
						border-radius: 16rpx 0px 40rpx 0px;
						background: rgba(0, 0, 0, 0.5);
						position: absolute;
						top: 0rpx;
						left: 0rpx;
						font-size: 24rpx;
						color: #ffffff;
						text-align: center;
						line-height: 48rpx;
						box-sizing: border-box;
					}
				}

				.wl_b {
					width: 330rpx;
					padding: 18rpx 14rpx 12rpx 24rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;

					text:nth-child(1) {
						font-size: 32rpx;
						font-weight: 500;
						color: #333333;
						margin-bottom: 4rpx;
					}

					text:nth-child(2) {
						width: 100%;
						font-size: 24rpx;
						color: #333333;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
				}
			}
		}
	}

	.station-info {
		width: 100%;
		height: 418rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 372rpx;
		// #ifdef APP
		background: #ffffff;
		// #endif
		// #ifdef MP-WEIXIN
		background-image: linear-gradient(180deg, #fff3e9 0%, #f0f0f0 20%), linear-gradient(#ffffff, #ffffff);
		// #endif

		background-blend-mode: normal, normal;
		border-radius: 50rpx 50rpx 0px 0px;
	}

	.cont {
		width: 700rpx;
		// #ifdef APP
		// min-height: 200rpx;
		// #endif
		// #ifdef MP-WEIXIN
		height: 366rpx;
		// #endif
		background: #fff;
		margin: 20rpx auto;
		background-image: linear-gradient(180deg, #f0f0f0 0%, #ffffff 100%), linear-gradient(#ffffff, #ffffff);
		background-blend-mode: normal, normal;
		border-radius: 10rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.cont .name {
		height: 80rpx;
		width: 100%;
		line-height: 80rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		border-bottom: solid 1rpx #e1e1e1;
	}

	.cont .info {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-top: 20rpx;
	}

	.cont .info>view:nth-child(1),
	.cont .info>view:nth-child(2) {
		font-size: 28rpx;
		color: #666666;
		line-height: 45rpx;
	}

	.cont .info>view:nth-child(3) {
		width: 100%;
		height: 154rpx;
		/* background-color: #000000; */
		border-radius: 10rpx;
		margin-top: 20rpx;
	}

	.map {
		position: relative;
	}

	.map map {
		width: 100%;
		height: 154rpx;
		border-radius: 10rpx;
	}

	.map-view {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 154rpx;
		/* background-color: #ccc; */
		z-index: 3;
	}

	.station-bottom {
		width: 100%;
		// #ifdef APP
		min-height: 170rpx;
		// #endif
		// #ifdef MP-WEIXIN
		height: 368rpx;
		// #endif
	}

	.service {
		width: 700rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		margin: 0 auto;
		padding: 10rpx 18rpx 0;
		box-sizing: border-box;
		// #ifdef APP
		position: relative;
		z-index: 2;
		// #endif
	}

	.service .tit {
		font-size: 28rpx;
		font-weight: bold;
		line-height: 60rpx;
		color: #333333;
	}

	.service-icon {
		display: flex;
		flex-wrap: wrap;
	}

	.service-icon>view {
		width: 120rpx;
		height: 110rpx;
		border-radius: 10rpx;
		border: solid 1rpx #e1e1e1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 11rpx;
		margin-bottom: 15rpx;
	}

	.service-icon>view:nth-child(5n) {
		margin-right: 0;
	}

	.service-icon>view>image {
		width: 39rpx;
		height: 41rpx;
		margin-bottom: 10rpx;
	}

	.service-icon>view>text {
		font-size: 24rpx;
		color: #333333;
	}
</style>