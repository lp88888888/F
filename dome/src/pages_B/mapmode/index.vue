<template>
	<view class="page" :style="{ height: pageHeight + 'px' }" :data-theme="pageTheme">
		<up-navbar title="地图模式" bgColor="transparent" autoBack placeholder :fixed="true"></up-navbar>

		<!-- 头部背景色 -->
		<view class="bgcolor" :style="{ background: themeStore.themeColors.$pageBgColor }"></view>

		<view class="add_box" :style="{ top: safeAreaTop + 'px' }">
			<view class="add_info">
				<view class="info_l">
					<text class="info_l_text1">{{ routeByLngLat.totalDistance }}km，</text>
					<text class="info_l_text2">{{ routeByLngLat.totalTime }}</text>
				</view>
				<view class="info_r" @click="handleBack">
					<!-- <image class="info_r_img" src="/src/static/tabbar/tabbar-service.png" mode=""></image>
					<text class="info_r_text">返回列表模式</text> -->
				</view>
			</view>
			<view class="add_b">
				<view class="add_b_box">
					<text class="route-place">{{ mylocationinfo.name || '' }}</text>
					<text class="route-location">{{ mylocationinfo.city || mylocationinfo.address || '我的位置' }}</text>
				</view>
				<image class="arrow_img" :src="icoUrl + 'to_line.png'"></image>
				<view class="add_b_box">
					<text class="route-place">{{ endlocationinfo.name || '' }}</text>
					<text class="route-location">{{ endlocationinfo.city || endlocationinfo.address || '目的地' }}</text>
				</view>
			</view>
		</view>

		<map
			ref="bdMapViewRef"
			v-if="currentLat"
			:latitude="currentLat"
			:longitude="currentLng"
			:scale="scale"
			:markers="markers"
			:polyline="polyline"
			:include-points="includePoints"
			show-location
			class="map"
			:style="{ height: pageHeight / 2 + 'px', width: '750rpx' }"
			@markertap="handleMarkerTap"
		></map>

		<view class="drawer_box" :style="{ height: drawerheight + 'px' }">
			<view class="drawer_line" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
				<view class="drawer_line_s"></view>
			</view>
			<scroll-view class="scroll_box" scroll-y="true" @scrolltolower="scrolltolower">
				<view class="sc_tab">
					<view class="tab_item" v-for="(item, index) in tabdata" :key="index" @click="handleTab(item)">
						<view class="tab_item_imgs" :style="{ background: tabval == item.id ? themeStore.themeColors.$butColor : themeStore.themeColors.$butColorDef }">
							<image class="tab_item_img" v-if="tabval == item.id" :src="item.img" mode="heightFix"></image>
							<image class="tab_item_img" v-else :src="item.imga" mode="heightFix"></image>
						</view>
						<text class="tab_item_text" :style="{ color: tabval == item.id ? themeStore.themeColors.$primaryColor : '#333333' }">{{ item.name }}</text>
					</view>
				</view>

				<view class="tag_box">
					<text class="tag_tips">沿途共有{{ total }}个{{ getsubtipstext() }}</text>
					<view class="tag_flex" v-if="['1', '2', '3', '4', '7'].includes(tabval)">
						<template v-if="tabval === '1'">
							<text
								class="tag_text"
								:style="{
									color: sfztabval == item.id ? themeStore.themeColors.$primaryColor : '#333333',
									background: sfztabval == item.id ? themeStore.themeColors.$badgeBgColor : '#F4F5F6',
									borderColor: sfztabval == item.id ? themeStore.themeColors.$primaryColor : '#F4F5F6',
								}"
								v-for="(item, index) in sfztab"
								:key="index"
								@click="handleSubTab(item)"
								>{{ item.rkname }}</text
							>
						</template>
						<template v-if="tabval === '2'">
							<text
								class="tag_text"
								:style="{
									color: cdztabval == item.id ? themeStore.themeColors.$primaryColor : '#333333',
									background: cdztabval == item.id ? themeStore.themeColors.$badgeBgColor : '#F4F5F6',
									borderColor: cdztabval == item.id ? themeStore.themeColors.$primaryColor : '#F4F5F6',
								}"
								v-for="(item, index) in cdztab"
								:key="index"
								@click="handleSubTab(item)"
								>{{ item.rkname }}</text
							>
						</template>
						<template v-if="tabval === '3'">
							<text
								class="tag_text"
								:style="{
									color: fwqtabval == item.id ? themeStore.themeColors.$primaryColor : '#333333',
									background: fwqtabval == item.id ? themeStore.themeColors.$badgeBgColor : '#F4F5F6',
									borderColor: fwqtabval == item.id ? themeStore.themeColors.$primaryColor : '#F4F5F6',
								}"
								v-for="(item, index) in fwqtab"
								:key="index"
								@click="handleSubTab(item)"
								>{{ item.rkname }}</text
							>
						</template>
						<template v-if="tabval === '4'">
							<text
								class="tag_text"
								:style="{
									color: etctabval == item.id ? themeStore.themeColors.$primaryColor : '#333333',
									background: etctabval == item.id ? themeStore.themeColors.$badgeBgColor : '#F4F5F6',
									borderColor: etctabval == item.id ? themeStore.themeColors.$primaryColor : '#F4F5F6',
								}"
								v-for="(item, index) in etctab"
								:key="index"
								@click="handleSubTab(item)"
								>{{ item.rkname }}</text
							>
						</template>
						<template v-if="tabval === '7'">
							<text
								class="tag_text"
								:style="{
									color: jyztabval == item.id ? themeStore.themeColors.$primaryColor : '#333333',
									background: jyztabval == item.id ? themeStore.themeColors.$badgeBgColor : '#F4F5F6',
									borderColor: jyztabval == item.id ? themeStore.themeColors.$primaryColor : '#F4F5F6',
								}"
								v-for="(item, index) in jyztab"
								:key="index"
								@click="handleSubTab(item)"
								>{{ item.rkname }}</text
							>
						</template>
					</view>
				</view>

				<template v-if="tabval == '1'">
					<view class="card-container" v-for="(item, index) in scrolllist" :key="index" >
						<image class="top-right-badge" v-if="serviceScopeShow(item.serviceScope,'20')" :src="imgUrl+'static/static-iocn-zh.png'" lazy-load mode=""></image>
					    <view class="main-content">
					      <view class="image-wrapper">
					        <image 
					          class="station-image" 
					          :src="item.tollStationImg || `${imgUrl}service-list-default.png`" 
					          mode="aspectFill"
							  lazy-load
					        ></image>
					       <view class="status-badge green" v-if="item.operationalStatus === '01'">
					        	<text class="status-text">正常</text>
					        </view>
					        <view class="status-badge gray" v-if="item.operationalStatus === '02'">
					        	<text class="status-text">关闭</text>
					        </view>
					        <view class="status-badge halfClose" v-if="item.operationalStatus === '05'">
					        	<text class="status-text">管制</text>
					        </view>
					        <view class="status-badge halfClose" v-if="item.operationalStatus === '03'">
					        	<text class="status-text">入口关闭，出口正常</text>
					        </view>
					        <view class="status-badge halfClose" v-if="item.operationalStatus === '04'">
					        	<text class="status-text">入口正常，出口关闭</text>
					        </view>
					      </view>
					
					      <view class="info-area">
					        <view class="title-row">
					          <text class="title">{{item.tollStationName}}</text>
					          <text class="distance">{{item.distance || '0km'}}</text>
					        </view>
							<view class="stats-row" >
							  <text class="stat-text" style="margin-right: 14rpx;" v-for="(enl,inx) in laneInfoList(item.laneInfo)">{{enl.name}} | {{enl.value}}</text>
							</view>
					        <view class="tags-row">
					          <view class="hollow-tag" v-if="serviceScopeShow(item.serviceScope,'18')">
					            <text class="hollow-tag-text">可办理ETC</text>
					          </view>
					          <view class="hollow-tag" v-if="serviceScopeShow(item.serviceScope,'19')">
					            <text class="hollow-tag-text">绕城包年</text>
					          </view>
					          <view class="hollow-tag" v-if="item.volumePricingFlag == 1">
					            <text class="hollow-tag-text">以量定价</text>
					          </view>
					        </view>
					
					        
					      </view>
					    </view>
					    <view class="bottom-area">
					      <text class="address-text texNoWrap">{{ item.tollStationAddress }}</text>
					      <view class="nav-button" @click.stop="openAdd(item)">
					        <up-icon :name="imgUrl+'static/station-dh-icon.png'" size="32rpx" color="#666"></up-icon>
					        <text class="nav-text">导航</text>
					      </view>
					    </view>
					    
					  </view>
					<!-- <view class="area_box" v-for="(item, index) in scrolllist" :key="index">
						<view class="area_l">
							<image class="area_l_img" v-if="item?.detailList" :src="item?.detailList[0]?.serviceInfoPicUrl" mode="aspectFill"></image>
							<image class="area_l_img" v-else src="https://tranalioss.shanyitong.com/images/20230225/1677317200274.jpeg" mode="aspectFill"></image>
						</view>
						<view class="area_r">
							<view class="area_t">
								<text class="area_t_title">{{ item.tollStationName }}</text>
								<text class="area_t_km">{{ item.distance }}</text>
							</view>
							<text class="area_sfz_add">{{ item.tollStationAddress }}</text>
							<text></text>
						</view>
					</view> -->
				</template>

				<template v-if="tabval == '2'">
					<view class="cdz_card" v-for="(item, index) in scrolllist" :key="index" @click="handleCdzDetail(item.stationId)">
						<view class="cdz_l">
							<text class="cdz_l_name">{{ item.stationName }}</text>
							<view class="cdz_l_jl">
								<image class="cdz_l_jl_icon" :src="`${icoUrl}route_line_icon.png`" mode="aspectFit"></image>
								<text class="cdz_l_jl_text">距您{{ item.distance }}</text>
							</view>
							<view class="cdz_l_price">
								<text class="cdz_l_price_text1" :style="{ color: themeStore.themeColors.$color }">¥</text>
								<text class="cdz_l_price_text" :style="{ color: themeStore.themeColors.$color }">{{ item.minPrice }}/度</text>
								<text class="cdz_l_price_text2">起</text>
							</view>
						</view>
						<!-- 状态与充电信息 -->
						<view class="cdz_r">
							<!-- <text class="cdz_status"></text> -->
							<text></text>
							<view class="cdz_fast">
								<text class="type">快</text>
								<text class="availability">{{ item.fastFree || 0 }}/{{ item.fastTotal }}</text>
							</view>
							<view class="cdz_slow">
								<text class="type">慢</text>
								<text class="availability">{{ item.slowFree || 0 }}/{{ item.slowTotal }}</text>
							</view>
						</view>
					</view>
				</template>

				<template v-if="tabval == '3'">
					<view class="service-card" v-for="(item, index) in scrolllist" :key="index" @click="handleFwqDetail(item.id)">
						<view class="image-container">
							<image class="service-image" :src="item.serviceAreaPicture || `${imgUrl}service-list-default.png`" lazy-load ></image>
							<view class="status-badge gray" v-if="item.operationalStatus === '02'">
								<text class="status-text">关闭</text>
							</view>
							<view class="status-badge green" v-else>
								<text class="status-text">正常</text>
							</view>
							<view class="star-overlay" v-if="item.starRatingLabel">
								<text class="star-text">{{item.starRatingLabel}}</text>
							</view>
						</view>
					
						<view class="info-container">
							<view class="header-row">
								<text class="title">{{ item.serviceAreaName }}</text>
								<text class="direction">{{item.lineDirection || ''}}</text>
							</view>
							
							<view class="location-row">
								<text class="location-text">{{ item.address }}</text>
								<text class="distance">{{ item.distance || '0km' }}</text>
								
								<view class="nav-btn" @click.stop="openAdd(item)">
									<up-icon :name="imgUrl+'static/station-dh-icon.png'" size="32rpx" color="#666"></up-icon>
									<text class="nav-text">导航</text>
								</view>
							</view>
								
							<view class="icon-row">
								<view class="icon-item" v-for="(item1, index1) in item.displayTags" :key="index1">
									<up-icon :name="item1.serviceInfoPicUrl" size="36rpx"></up-icon>
								</view>
							</view>
						</view>
						<image class="watermark" v-if="item.themeLabel == '红色印记'" :src="imgUrl+'static/station-icon-1.png'" lazy-load></image>
						<image class="watermark" v-if="item.themeLabel == '綜台服务'" :src="imgUrl+'static/station-icon-2.png'" lazy-load></image>
						<image class="watermark" v-if="item.themeLabel == '交文旅融合'" :src="imgUrl+'static/station-icon-3.png'" lazy-load></image>
						<image class="watermark" v-if="item.themeLabel == '休闲运动'" :src="imgUrl+'static/station-icon-4.png'" lazy-load></image>
						<image class="watermark" v-if="item.themeLabel == '温馨驿站'" :src="imgUrl+'static/station-icon-5.png'" lazy-load></image>
						<image class="watermark" v-if="item.themeLabel == '红色文化'" :src="imgUrl+'static/station-icon-6.png'" lazy-load></image>
					</view>
					<!-- <view class="area_box" v-for="(item, index) in scrolllist" :key="index" @click="handleFwqDetail(item.id)">
						<view class="area_l">
							<image class="area_l_img" :src="item.serviceAreaPicture" mode=""></image>
							<text class="area_l_text">{{ handlestatus(item.operationalStatus) }}</text>
						</view>
						<view class="area_r">
							<view class="area_t">
								<text class="area_t_title">{{ item.serviceAreaName }}{{ handleEstimate(item) }}</text>
								<text class="area_t_km">{{ item.distance }}</text>
								<image class="area_t_icon" :src="`${icoUrl}route_line_icon.png`" mode="aspectFit"></image>
							</view>
							<text class="area_c">{{ item.address }}</text>
							<view class="area_b" >
								<image v-for="(item1,index1) in (item.detailList || []).slice(0, 5)" :src="item1.serviceInfoPicUrl" mode="aspectFill" class="area_b_icons"></image>
							</view>
						</view>
					</view> -->
				</template>

				<template v-if="tabval == '4'">
					<view class="area_box" v-for="(item, index) in scrolllist" :key="index">
						<view class="area_r">
							<view class="area_t" style="width: 650rpx">
								<text class="area_t_title">{{ item.name }}</text>
								<text class="area_t_km">{{ item.distance }}</text>
								<!-- <image class="area_t_icon" :src="`${icoUrl}route_line_icon.png`" mode="aspectFit"></image> -->
							</view>
							<text class="area_sfz_add">{{ item.address }}</text>
							<text></text>
						</view>
					</view>
				</template>

				<template v-if="tabval == '5'">
					<view class="tq_box" v-for="(item, index) in scrolllist" :key="index" @click="handleTqDetail(item)">
						<view class="tq_t">
							<text class="tr_t_title">{{ item.district }}</text>
							<view class="tr_t_tags" v-if="item.alerts!=null">
								<view class="alert_tag" :class="getLevelClass(item.alerts[0].color?.code)">
									<text class="alert_tag_type">{{ item.alerts[0].eventType?.name }}</text>
								</view>
							</view>
							<view class="tr_t_more" @click="topath(item)">
								<text class="tr_t_more_text">更多</text>
								<u-icon name="arrow-right" color="#999999" size="14"></u-icon>
							</view>
						</view>
						<view class="tq_b">
							<view class="tq_b_temp">
								<text class="tq_b_temp_text">{{ item.temp }}</text>
								<text class="tq_b_temp_text1">℃</text>
							</view>
							<view class="tq_b_info">
								<view class="tq_b_info_top">
									<view class="tq_b_info_top_content">
										<text class="tq_b_weather_text">{{ item.text }}</text>
										<text class="dayText" :style="{ color: themeStore.themeColors.$color }">(今天)</text>
									</view>
								</view>
								<view class="tq_b_info_bottom">
									<view class="tq_b_info_item">
										<image :src="imgUrl + 'img/kongqi.png'" mode="aspectFill" class="tq_b_info_icon"></image>
										<text class="tq_b_info_text">空气{{ item.category }}</text>
									</view>
									<view class="tq_b_info_item">
										<image :src="imgUrl + 'img/fenicon.png'" mode="aspectFill" class="tq_b_info_icon"></image>
										<text class="tq_b_info_text">风力{{ item.windScale }}级</text>
									</view>
									<image
										:src="`https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${item.icon}.png`"
										mode="aspectFill"
										class="tq_b_weather_icon"
									>
									</image>
								</view>
							</view>
						</view>
						<view v-if="item.alerts" class="swiper-container" style="margin-top: 20rpx">
							<swiper class="swiper-container" :indicator-dots="true" :autoplay="true" :interval="4000" :duration="500" circular>
								<swiper-item v-for="(item2, index2) in item.alerts" :key="index2">
									<view class="swiper-card" :class="[getLevelClass(item2.color?.code)]" @click.stop="handleClick(item)">
										<view class="icon1">⚠️</view>
										<view class="title1">{{ item2.headline }}</view>
									</view>
								</swiper-item>
							</swiper>
						</view>
					</view>
				</template>

				<template v-if="tabval == '6'">
					<view class="lx_box" v-for="(item, index) in scrolllist" :key="index" @click="chengrouter(index)">
						<text
							:class="routeractiveTag == index ? 'actiTax1' : 'tax1'"
							:style="{ color: routeractiveTag == index ? themeStore.themeColors.$color : '#333' }"
							>{{ item.rkname }}</text
						>
						<text
							:class="routeractiveTag == index ? 'actiTax2' : 'tax2'"
							:style="{ color: routeractiveTag == index ? themeStore.themeColors.$color : '#333' }"
							>{{ item.duration }}</text
						>
						<text
							:class="routeractiveTag == index ? 'actiTax3' : 'tax3'"
							:style="{ color: routeractiveTag == index ? themeStore.themeColors.$color : '#333' }"
						>
							{{ item.distance }}
						</text>
					</view>
				</template>

				<template v-if="tabval == '7'">
					<view class="area_box" v-for="(item, index) in scrolllist" :key="index" @click="goJyDetail(item.id)">
						<view class="area_l">
							<image class="area_l_img" v-if="item?.logo" :src="item?.logo" mode="aspectFill"></image>
							<image class="area_l_img" v-else src="https://tranalioss.shanyitong.com/images/20230225/1677317200274.jpeg" mode="aspectFill"></image>
							<!-- <text class="area_l_text">{{ handlestatus(item.status) }}</text> -->
						</view>
						<view class="area_r">
							<view class="area_t">
								<text class="area_t_title">{{ item.stationName }}</text>
								<text class="area_t_km">{{ item.straightLineDistance }}</text>
								<!-- <image class="area_t_icon" :src="`${icoUrl}route_line_icon.png`" mode="aspectFit"></image> -->
							</view>
							<text class="area_sfz_add">{{ item.address }}</text>
							<text></text>
						</view>
					</view>
				</template>
				
				<ser-empty v-if="!scrolllist.length"></ser-empty>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { showLoading, hideLoading, showToast, ID2, openAPPLocation,openLocation } from '@/utils/util';
import {
	getTollStationByLngLatList,
	getStationByLngLatlist,
	getServiceAreaByLngLatlist,
	getEtcBranchListByLngLatlist,
	getqueryAllWeather,
	gettwodotgasstation,
} from '@/api/map';
import { imgUrl } from '@/config';
import { toNav, toBack } from '@/utils/route';
import { useTheme } from '@/composables/useTheme';
import { getDrivingRoute } from '@/utils/polyline';
const { themeStore, pageTheme } = useTheme();
const icoUrl = computed(() => themeStore.imgUrl);

const pageHeight = computed(() => uni.getSystemInfoSync().screenHeight);
const safeAreaTop = computed(() => uni.getSystemInfoSync().safeArea.top + 56);

const searchValue = ref('');
const handleSeach = () => {};

const bdMapViewRef = ref(null);
const mylocationinfo = ref({});
const endlocationinfo = ref({});
const routeByLngLat = ref({});
const currentLat = ref(0);
const currentLng = ref(0);
const scale = ref(15);
const polyline = ref([]);
const includePoints = ref([]);
const serviceScopeShow = computed(()=>{
		return (scope,value)=>{
			let isShow = false
			if(scope){
				if(scope.indexOf(value) != -1){
					isShow = true
				}
			}
			return isShow
		}
	})
	const laneInfoList = computed(()=>{
		return (laneInfo)=>{
			if(laneInfo){
				return JSON.parse(laneInfo)
			}
			return []
		}
	}) 
const handleBack = () => {
	toBack();
};

const handleEstimate = (item) => {
	if (item.serviceAreaName == '曲江服务区' || item.serviceAreaName == '汉城服务区') {
		return `(${['', '内环', '外环'][item.locationDirection]})`;
	}
	if (item.locationDirection) {
		return `(${
			item.serviceAreaName.indexOf('绕城') != -1 ? ['', '内环', '外环'][item.locationDirection] : ['', '上行', '下行'][item.locationDirection]
		})`;
	}
	return '';
};

const getsubtipstext = () => {
	const obj = tabdata.value.find((e) => e.id == tabval.value);
	if (!obj) return '';
	return obj.name || '';
};

const tabval = ref('1');
const tabdata = ref([
	{
		img: `${imgUrl}map/mapmode_tab_sfz.png`,
		imga: `${icoUrl.value}mapmode_tab_sfz.png`,
		name: '收费站',
		id: '1',
	},
	{
		img: `${imgUrl}map/mapmode_tab_fwq.png`,
		imga: `${icoUrl.value}mapmode_tab_fwq.png`,
		name: '服务区',
		id: '3',
	},
	{
		img: `${imgUrl}map/mapmode_tab_jy.png`,
		imga: `${icoUrl.value}mapmode_tab_jy.png`,
		name: '加油',
		id: '7',
	},
	{
		img: `${imgUrl}map/mapmode_tab_cd.png`,
		imga: `${icoUrl.value}mapmode_tab_cd.png`,
		name: '充电',
		id: '2',
	},
	// {
	// 	img: 'img/tabetc.png',
	// 	name: 'ETC网点',
	// 	id: '4',
	// },
	{
		img: `${imgUrl}map/mapmode_tab_tq.png`,
		imga: `${icoUrl.value}mapmode_tab_tq.png`,
		name: '天气',
		id: '5',
	},
	// {
	// 	img: 'img/sfzicon.png',
	// 	name: '路线',
	// 	id: '6',
	// },
]);
const handleTab = (item) => {
	console.log('点击的标签', item);
	if (item.id == tabval) return;
	tabval.value = item.id;
	console.log('复制', tabval.value);
	total.value = 0;
	pageNum.value = 1;
	scrolllist.value = [];
	switch (tabval.value) {
		case '1':
			getsfzlist();
			break;
		case '2':
			getcdzlist();
			break;
		case '3':
			getfwqlist();
			break;
		case '4':
			getetclist();
			break;
		case '5':
			gettqlist();
			break;
		case '6':
			scrolllist.value = routerLinedata.value;
			total.value = routerLinedata.value.length;
			break;
		case '7':
			getjyzList();
			break;
		default:
			break;
	}
};

// 切换状态
const handleSubTab = (item) => {
	total.value = 0;
	pageNum.value = 1;
	scrolllist.value = [];
	switch (tabval.value) {
		case '1':
			sfztabval.value = item.id;
			getsfzlist();
			break;
		case '2':
			cdztabval.value = item.id;
			getcdzlist();
			break;
		case '3':
			fwqtabval.value = item.id;
			getfwqlist();
			break;
		case '4':
			etctabval.value = item.id;
			getetclist();
			break;
		case '7':
			jyztabval.value = item.id;
			getjyzList();
			break;
		default:
			break;
	}
};

// 路线数据
const routerLinedata = ref([]);
const routeractiveTag = ref(0);
const chengrouter = (value) => {
	console.log('切换', value);
	routeractiveTag.value = value;
	// 切换路线颜色
	polyline.value = polyline.value.map((route, index) => ({
		...route,
		color: index === value ? '#09BABE' : '#5DC476',
		zIndex: index === value ? 999 : 5,
	}));
};

// 查询路径数据
const getrouterdata = async () => {
	polyline.value = [];

	const from = `${currentLat.value},${currentLng.value}`;
	const to = `${endlocationinfo.value.location.latitude},${endlocationinfo.value.location.longitude}`;

	try {
		const result = await getDrivingRoute({
			from: from,
			to: to,
			key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB',
		});
		console.log('查询的路径', result);
		routerLinedata.value = result.data || [];

		if (result && result.data) {
			// 处理 points 格式并移除鸿蒙不支持的属性
			const formattedRoutes = result.data.map((route, index) => {
				// 确保 points 是标准格式 {latitude, longitude}
				const points = route.path.map((point) => ({
					latitude: point.lat || point.latitude,
					longitude: point.lng || point.longitude,
				}));
				// #ifdef APP-HARMONY
				return {
					points: points,
					color: index === 0 ? '#09BABE' : '#5DC476',
					width: 6,
					// ❌ 鸿蒙不支持以下属性，需移除或条件编译
					// arrowLine: true,
					// borderColor: '#ccc',
					// zIndex: index === 0 ? 999 : 5
				};
				// #endif
				// #ifdef MP-WEIXIN
				return {
					points: points,
					color: index === 0 ? '#09BABE' : '#5DC476',
					width: 6,
					arrowLine: true,
					borderColor: '#ccc',
					zIndex: index === 0 ? 999 : 5,
				};
				// #endif
			});

			// 使用 nextTick 确保 DOM 更新后再赋值
			nextTick(() => {
				polyline.value = formattedRoutes;
			});

			// 更新 markers（使用公用的 marker 方法）
			const anchorMarkers = [
				{
					id: 999,
					latitude: endlocationinfo.value.location.latitude,
					longitude: endlocationinfo.value.location.longitude,
					title: '目的地',
					iconPath: imgUrl + 'map/zhong.png',
				},
				{
					id: 777,
					latitude: currentLat.value,
					longitude: currentLng.value,
					title: '起点',
					iconPath: imgUrl + 'map/qi.png',
				},
			];
			// 保留现有的非 anchor 类型的 markers
			const nonAnchorMarkers = markers.value.filter((item) => item.type !== 'anchor');
			// 转换 anchor 类型的 markers
			const convertedAnchorMarkers = convertToMarkers(anchorMarkers, 'anchor');
			// 合并所有 markers
			markers.value = [...nonAnchorMarkers, ...convertedAnchorMarkers];
			// #ifdef MP-WEIXIN
			// 调整视野
			setTimeout(() => {
				const mapCtx = uni.createMapContext('bdMapViewRef');
				mapCtx.includePoints({
					points: [
						{ latitude: currentLat.value, longitude: currentLng.value },
						{ latitude: endlocationinfo.value.location.latitude, longitude: endlocationinfo.value.location.longitude },
					],
					padding: [20, 20, 20, 20],
				});
			}, 300);
			// #endif

			console.log('-0-00-0--0-00--0', currentLat.value, currentLng.value);
		} else {
			uni.showToast({
				title: result.message || '路线规划失败',
				icon: 'none',
			});
		}
	} catch (err) {
		console.error('路线获取异常:', err);
		uni.showToast({ title: '网络异常', icon: 'none' });
	}
};

// 地图打点
const markers = ref([]);
const addMap = () => {
	console.log('-=-=-=---=-p=--', markers.value);
	// 对于 uni-app 的 map 组件，markers 会自动更新，不需要手动调用方法
};

// 列表数据
const scrolllist = ref([]);
const pageNum = ref(1);
const pageSize = ref(20);
const total = ref(0);

// 判断状态
const handlestatus = (val) => {
	const tabMap = { '1': sfztab.value, '2': cdztab.value, '3': fwqtab.value, '4':etctab.value,'7': jyztab.value  };
	const e = tabMap[tabval.value]?.find((e) => e.id == val);
	return e ? e.rkname : '';
};

const markerConfig = {
	sfz: {
		getLatitude: (item) => item.latitude,
		getLongitude: (item) => item.longitude,
		getTitle: (item) => item.tollStationName,
		getIconPath: () => imgUrl + 'map/sfzdingwei-icon.png',
		getSize: () => ({ width: 24, height: 24 }),
		getType: () => 'sfz',
		getExtraFields: (item) => ({ delid: item.id }),
	},
	cdz: {
		getLatitude: (item) => Number(item.stationLat),
		getLongitude: (item) => Number(item.stationLng),
		getTitle: (item) => item.stationName,
		getIconPath: () => imgUrl + 'static/oil-map-icon.png',
		getSize: () => ({ width: 20, height: 20 }),
		getType: () => 'cdz',
		getExtraFields: (item) => ({ stationId: item.stationId }),
	},
	fwq: {
		getLatitude: (item) => item.latitude,
		getLongitude: (item) => item.longitude,
		getTitle: (item) => `${ item.serviceAreaName }${ handleEstimate(item) }`,
		getIconPath: () => imgUrl + 'map/fuwuqudingwei-icon.png',
		getSize: () => ({ width: 20, height: 20 }),
		getType: () => 'fuq',
		getExtraFields: (item) => ({ fwqid: item.id }),
	},
	etc: {
		getLatitude: (item) => item.latitude,
		getLongitude: (item) => item.longitude,
		getTitle: (item) => item.name,
		getIconPath: () => imgUrl + 'map/etcdianwei-icon.png',
		getSize: () => ({ width: 20, height: 20 }),
		getType: () => 'etc',
		getExtraFields: (item) => ({ delid: item.id }),
	},
	tq: {
		getLatitude: (item) => item.coordinate.lat,
		getLongitude: (item) => item.coordinate.lng,
		getTitle: (item) => item.district,
		getIconPath: (item) => `https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${item.icon}.png`,
		getSize: () => ({ width: 24, height: 24 }),
		getType: () => 'tq',
		getExtraFields: (item) => ({ city: item.city, locationId: item.locationId, district: item.district }),
	},
	anchor: {
		getLatitude: (item) => item.latitude,
		getLongitude: (item) => item.longitude,
		getTitle: (item) => item.title,
		getIconPath: (item) => item.iconPath,
		getSize: () => ({ width: 40, height: 40 }),
		getType: () => 'anchor',
		getExtraFields: (item) => ({
			anchor: { x: 0.5, y: 1 },
			callout: {
				content: item.title,
				display: 'ALWAYS',
				borderRadius: 6,
				bgColor: '#000',
				color: '#fff',
				fontSize: 12,
				padding: 5,
			},
		}),
	},
	jyz: {
		getLatitude: (item) => item.latitude,
		getLongitude: (item) => item.longitude,
		getTitle: (item) => item.stationName,
		getIconPath: () => imgUrl + 'static/jy-icon.png',
		getSize: () => ({ width: 20, height: 20 }),
		getType: () => 'jyz',
		getExtraFields: (item) => ({ jyzid: item.id }),
	},
};

const convertToMarkers = (list, type) => {
	const config = markerConfig[type];
	if (!config) return [];
	return list.map((item, index) => {
		const { width, height } = config.getSize();
		const marker = {
			id: index + 1,
			latitude: config.getLatitude(item),
			longitude: config.getLongitude(item),
			title: config.getTitle(item),
			iconPath: typeof config.getIconPath === 'function' ? config.getIconPath(item) : config.getIconPath(),
			width,
			height,
			type: config.getType(),
			callout: {
				content: config.getTitle(item),
				color: '#333',
				fontSize: 12,
				borderRadius: 4,
				bgColor: '#fff',
				padding: 5,
				display: 'BYCLICK',
			},
			...config.getExtraFields(item),
		};
		return marker;
	});
};

const updateMarkersAndMap = (list, type) => {
	const arr = convertToMarkers(list, type);
	markers.value = arr;
	// 对于 uni-app 的 map 组件，markers 会自动更新，不需要手动调用方法
};

// 触底加载
const scrolltolower = () => {
	// 检查是否还有更多数据
	if (scrolllist.value.length >= total.value) return;

	// 增加页码
	pageNum.value++;

	// 根据当前标签调用对应的接口
	switch (tabval.value) {
		case '1':
			getsfzlist(true);
			break;
		case '2':
			getcdzlist(true);
			break;
		case '3':
			getfwqlist(true);
			break;
		case '4':
			getetclist(true);
			break;
		case '7':
			getjyzList(true);
			break;
		default:
			break;
	}
};

// 收费站相关
const sfztab = ref([
	{ id: '', rkname: '全部' },
	{ id: '01', rkname: '正常' },
	{ id: '02', rkname: '关闭' },
	{ id: '05', rkname: '管制' },
]);
const sfztabval = ref('');
const getsfzlist = async (isLoadMore = false) => {
	const params = {
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		myLongitude: mylocationinfo.value.location.longitude,
		myLatitude: mylocationinfo.value.location.latitude,
		startLongitude: mylocationinfo.value.location.longitude,
		startLatitude: mylocationinfo.value.location.latitude,
		endLongitude: endlocationinfo.value.location.longitude,
		endLatitude: endlocationinfo.value.location.latitude,
		operationalStatus: sfztabval.value,
	};
	const res = await getTollStationByLngLatList(params);
	console.log('查询的收费站', res);
	if (isLoadMore) {
		scrolllist.value = [...scrolllist.value, ...res.data.list];
	} else {
		scrolllist.value = res.data?.list || [];
	}
	total.value = res.data?.total || 0;
	updateMarkersAndMap(scrolllist.value, 'sfz');
};

// 充电桩相关
const cdztab = ref([
	{ id: '', rkname: '全部' },
	{ id: '50', rkname: '营业中' },
	{ id: '5', rkname: '关闭' },
]);
const cdztabval = ref('');
const getcdzlist = (isLoadMore = false) => {
	getStationByLngLatlist({
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		startLongitude: mylocationinfo.value.location.longitude,
		startLatitude: mylocationinfo.value.location.latitude,
		endLongitude: endlocationinfo.value.location.longitude,
		endLatitude: endlocationinfo.value.location.latitude,
		stationStatus: cdztabval.value,
	}).then((res) => {
		console.log('查询的充电桩', res);
		if (isLoadMore) {
			scrolllist.value = [...scrolllist.value, ...res.data.list];
		} else {
			scrolllist.value = res.data?.list || [];
		}
		total.value = res.data?.total || 0;
		updateMarkersAndMap(scrolllist.value, 'cdz');
	});
};
const handleCdzDetail = (id) => {
	uni.navigateTo({
		url: '/pages_A/chargingPiles/queryDetail?id=' + id,
	});
};

// 服务区相关
const fwqtab = ref([
	{ id: '', rkname: '全部' },
	{ id: '01', rkname: '正常' },
	{ id: '02', rkname: '关闭' },
]);
const fwqtabval = ref('');
const getfwqlist = (isLoadMore = false) => {
	getServiceAreaByLngLatlist({
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		startLongitude: mylocationinfo.value.location.longitude,
		startLatitude: mylocationinfo.value.location.latitude,
		endLongitude: endlocationinfo.value.location.longitude,
		endLatitude: endlocationinfo.value.location.latitude,
		operationalStatus: fwqtabval.value,
	}).then((res) => {
		console.log('查询的服务区', res);
		if (isLoadMore) {
			scrolllist.value = [...scrolllist.value, ...res.data.list];
		} else {
			scrolllist.value = res.data?.list || [];
		}
		total.value = res.data?.total || 0;
		updateMarkersAndMap(scrolllist.value, 'fwq');
	});
};
const handleFwqDetail = (id) => {
	uni.navigateTo({
		url: '/pages_A/stationDetails/index?id=' + id,
	});
};

// ETC相关
const etctab = ref([
	{ id: 0, rkname: '全部' },
	{ id: 1, rkname: '绕城包年网点' },
	{ id: 2, rkname: '收费站网点' },
	{ id: 3, rkname: '服务区网点' },
]);
const etctabval = ref(0);
const getetclist = (isLoadMore = false) => {
	getEtcBranchListByLngLatlist({
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		startLongitude: mylocationinfo.value.location.longitude,
		startLatitude: mylocationinfo.value.location.latitude,
		endLongitude: endlocationinfo.value.location.longitude,
		endLatitude: endlocationinfo.value.location.latitude,
		type: etctabval.value,
	}).then((res) => {
		console.log('查询的ETC', res);
		if (isLoadMore) {
			scrolllist.value = [...scrolllist.value, ...res.data.list];
		} else {
			scrolllist.value = res.data?.list || [];
		}
		total.value = res.data?.total || 0;
		updateMarkersAndMap(scrolllist.value, 'etc');
	});
};

// 天气数据
const getLevelClass = (level) => {
	const map = {
		blue: 'bg-blue',
		yellow: 'bg-yellow',
		orange: 'bg-orange',
		red: 'bg-red',
	};
	return map[level || ''] || 'bg-default';
};
const gettqlist = async () => {
	const params = {
		from: `${mylocationinfo.value.location.latitude},${mylocationinfo.value.location.longitude}`,
		to: `${endlocationinfo.value.location.latitude},${endlocationinfo.value.location.longitude}`,
	};
	const res = await getqueryAllWeather(params);
	console.log('查询的天气', res);
	scrolllist.value = res?.data || [];
	total.value = scrolllist.value.length;
	updateMarkersAndMap(res?.data, 'tq');
};
const handleTqDetail = (item) => {
	uni.navigateTo({
		url: `/pages_A/weather/index?coordinate=${item.locationId}&district=${item.district}&city=${item.city}`,
	});
};
const handleClick = (item) => {
	uni.navigateTo({
		url: `/pages_A/weather/warning?location=${item.locationId}`,
	});
};

// 查询加油站信息
const jyztab = ref([
	{ id: '', rkname: '全部' },
	{ id: '01', rkname: '正常' },
	{ id: '02', rkname: '关闭' },
]);
const jyztabval = ref('');
const getjyzList = (isLoadMore = false) => {
	gettwodotgasstation({
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		startLongitude: mylocationinfo.value.location.longitude,
		startLatitude: mylocationinfo.value.location.latitude,
		endLongitude: endlocationinfo.value.location.longitude,
		endLatitude: endlocationinfo.value.location.latitude,
		operationalStatus: jyztabval.value,
	}).then((res) => {
		console.log('查询的加油站数据', res);
		if (isLoadMore) {
			scrolllist.value = [...scrolllist.value, ...res.data.list];
		} else {
			scrolllist.value = res.data?.list || [];
		}
		total.value = res.data?.total || '';
		updateMarkersAndMap(scrolllist.value, 'jyz');
	});
};
const goJyDetail = (id) => {
	// toNav('/pages_D/refuelingRefilling/details?merId=' + id)
}

// 处理地图标记点击事件
const handleMarkerTap = (e) => {
	console.log('点击了标记', e);
	const markerId = e.detail.markerId;
	const clickedMarker = markers.value.find((m) => m.id === markerId);
	if (!clickedMarker) return;

	// 根据标记类型处理点击事件
	if (clickedMarker.type === 'sfz') {
		// 处理收费站点击
	} else if (clickedMarker.type === 'cdz') {
		// 处理充电桩点击
		handleCdzDetail(clickedMarker.stationId);
	} else if (clickedMarker.type === 'fuq') {
		// 处理服务区点击
		handleFwqDetail(clickedMarker.fwqid);
	} else if (clickedMarker.type === 'etc') {
		// 处理ETC网点点击
	} else if (clickedMarker.type === 'tq') {
		// 处理天气点击
		handleTqDetail(clickedMarker);
	} else if (clickedMarker.type === 'jyz') {
		// 处理加油站点击
		goJyDetail(clickedMarker.jyzid);
	}
};

const drawerheight = computed(() => {
	return drawerstatus.value === 'small' ? (pageHeight.value - safeAreaTop.value) / 2 : pageHeight.value - safeAreaTop.value - 100;
});
const drawerstatus = ref('small');
const startY = ref(0);
const currentY = ref(0);
const handleTouchStart = (e) => {
	e.preventDefault();
	// console.log('触摸开始', e);
	startY.value = e.touches[0].clientY;
};
const handleTouchMove = (e) => {
	// 阻止默认的滚动行为
	e.preventDefault();
	// console.log('触摸中', e);
	currentY.value = e.touches[0].clientY;
};
const handleTouchEnd = (e) => {
	e.preventDefault();
	// console.log('触摸结束', e);
	const deltaY = startY.value - currentY.value;
	if (deltaY > 0 && drawerstatus.value === 'small') {
		drawerstatus.value = 'big';
	} else if (deltaY < 0 && drawerstatus.value === 'big') {
		drawerstatus.value = 'small';
	}
};
const systemInfo = uni.getSystemInfoSync();
const isWechatMP = systemInfo.uniPlatform === 'mp-weixin';
const isApp = systemInfo.uniPlatform === 'app';
const openAdd = (station) => {
		// 获取点击的服务区索引
		const latitude = parseFloat(station.latitude); // 获取服务区纬度
		const longitude = parseFloat(station.longitude); // 获取服务区经度
		const address = station.address; // 获取服务区地址
		if (isApp) {
			const navigationInfo = {
				endLocation: {
					longitude: Number(longitude),
					latitude: Number(latitude),
					address: address,
				},
			};
			openAPPLocation(navigationInfo);
		} else {
			openLocation({
				latitude: latitude, // 纬度
				longitude: longitude, // 经度
				name: station.serviceAreaName, // 地址名称（服务区名称）
				address: address, // 地址
				scale: 18, // 缩放级别，1~20，数值越大，地图越精细
				success() {
					console.log('地图打开成功');
				},
				fail() {
					uni.showToast({
						title: '地图定位失败',
						icon: 'none',
					});
				},
			});
		}
	};
onLoad(() => {
	console.log("进入哦那L哦D")
	let data = uni.getStorageSync('mapmodedata')
	mylocationinfo.value = JSON.parse(data.mylocationinfo);
	endlocationinfo.value = JSON.parse(data.endlocationinfo);
	routeByLngLat.value = JSON.parse(data.routeByLngLat);
	// 初始化地图中心坐标
	currentLat.value = mylocationinfo.value.location.latitude;
	currentLng.value = mylocationinfo.value.location.longitude;
	// 更新 includePoints，确保地图能够显示所有标记
	includePoints.value = [
		{ latitude: currentLat.value, longitude: currentLng.value },
		{ latitude: endlocationinfo.value.location.latitude, longitude: endlocationinfo.value.location.longitude },
	];
	nextTick(() => {
		getrouterdata();
		handleTab({ id: '1' });
	});
	// uni.$on('mapmodedata', (data) => {
	// 	console.log('监听到事件来自 update1：' + data.mylocationinfo);
	// 	console.log('监听到事件来自 update2：' + data.endlocationinfo);
	// 	console.log('监听到事件来自 update3：' + data.routeByLngLat);
	// 	mylocationinfo.value = JSON.parse(data.mylocationinfo);
	// 	endlocationinfo.value = JSON.parse(data.endlocationinfo);
	// 	routeByLngLat.value = JSON.parse(data.routeByLngLat);
	// 	// 初始化地图中心坐标
	// 	currentLat.value = mylocationinfo.value.location.latitude;
	// 	currentLng.value = mylocationinfo.value.location.longitude;
	// 	// 更新 includePoints，确保地图能够显示所有标记
	// 	includePoints.value = [
	// 		{ latitude: currentLat.value, longitude: currentLng.value },
	// 		{ latitude: endlocationinfo.value.location.latitude, longitude: endlocationinfo.value.location.longitude },
	// 	];
	// 	nextTick(() => {
	// 		getrouterdata();
	// 		handleTab({ id: '1' });
	// 	});
	// });
});
onUnload(()=>{
	// uni.$off('mapmodedata')
	uni.removeStorageSync('mapmodedata')
})
</script>

<style lang="scss" scoped>
view,
text {
	box-sizing: border-box;
}
.service-card {
		width: 690rpx;
		display: flex;
		background-color: #ffffff;
		// margin: 20rpx 0;
		margin-bottom: 25rpx;
		padding: 24rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		position: relative;
		/* 简易阴影效果，nvue需注意各端阴影实现差异 */
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		/* 左侧样式 */
		.image-container {
			position: relative;
			width: 180rpx;
			height: 180rpx;
		}
		
		.service-image {
			width: 180rpx;
			height: 180rpx;
			border-radius: 12rpx;
		}
		
		.status-badge {
			position: absolute;
			top: 0;
			left: 0;
			background-color: #52c41a;
			padding: 4rpx 12rpx;
			border-radius: 12rpx 0rpx 16rpx 0rpx;
		}
		
		.status-text {
			color: #ffffff;
			font-size: 22rpx;
		}
		
		.star-overlay {
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(193,141,0,0.5);
			padding: 6rpx 0;
			text-align: center;
			border-bottom-left-radius: 12rpx;
			border-bottom-right-radius: 12rpx;
		}
		
		.star-text {
			color: #ffffff;
			font-size: 20rpx;
		}
		
		/* 右侧样式 */
		.info-container {
			flex: 1;
			margin-left: 24rpx;
			justify-content: space-between;
		}
		
		.header-row {
			display: flex;
			align-items: center;
		}
		
		.title {
			font-size: 34rpx;
			font-weight: bold;
			color: #333;
		}
		
		.direction {
			font-size: 26rpx;
			color: #666;
			margin-left: 16rpx;
		}
		
		.location-row {
			display: flex;
			align-items: center;
			margin-top: 10rpx;
		}
		
		.location-text {
			max-width: 200rpx;
			font-size: 26rpx;
			color: #999;
			lines: 1;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		
		.distance {
			font-size: 26rpx;
			color: #bbb;
			margin-left: 12rpx;
		}
		
		.nav-btn {
			display: flex;
			align-items: center;
			// border-width: 1rpx;
			// border-style: dashed;
			// border-color: #ccc;
			padding: 4rpx 12rpx;
			// border-radius: 8rpx;
			margin-left: auto;
		}
		
		.nav-text {
			font-size: 24rpx;
			color: #666;
			margin-left: 4rpx;
		}
		
		/* 图标区域 */
		.icon-row {
			display: flex;
			align-items: center;
			margin-top: 16rpx;
		}
		
		.icon-item {
			margin-right: 15rpx;
		}
		
		.charging {
			background-color: #52c41a;
			width: 36rpx;
			height: 36rpx;
			border-radius: 18rpx;
			justify-content: center;
			align-items: center;
		}
		
		/* 右下角印章样式 */
		.watermark {
			position: absolute;
			right: -10rpx;
			bottom: -10rpx;
			width: 96rpx;
			height: 96rpx;
			z-index: 1;
			// transform: rotate(-15deg);
			// opacity: 0.6;
		}
		
		.seal-border {
			border-width: 4rpx;
			border-style: solid;
			border-color: #52c41a;
			border-radius: 10rpx;
			padding: 4rpx 8rpx;
		}
		
		.seal-text {
			font-size: 20rpx;
			color: #52c41a;
			font-weight: bold;
		}
	}
.card-container {
		width: 690rpx;
	  position: relative;
	  background-color: #ffffff;
	  border-radius: 24rpx;
	  padding: 30rpx;
	  box-sizing: border-box;
	  // margin: 20rpx;
	  margin-bottom: 25rpx;
	  /* 基础的卡片阴影，nvue 下需要使用特定属性 */
	  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
	  .top-right-badge {
		width: 56rpx;
		height: 60rpx;
	    position: absolute;
	    top: 0;
	    right: 24rpx;
	    // background-color: #ff5a00;
	    // padding: 8rpx 12rpx;
	    /* NVUE 无法完美实现底部的锯齿效果，此处用常规圆角平替 */
	    // border-bottom-left-radius: 8rpx;
	    // border-bottom-right-radius: 8rpx;
	    // align-items: center;
	  }
	  
	  .top-badge-text {
	    color: #ffffff;
	    font-size: 20rpx;
	    line-height: 24rpx;
	  }
	  
	  .main-content {
	    display: flex;
	  }
	  
	  .image-wrapper {
	    position: relative;
	    width: 160rpx;
	    height: 160rpx;
	    margin-right: 24rpx;
	  }
	  
	  .station-image {
	    width: 160rpx;
	    height: 160rpx;
	    border-radius: 12rpx;
	    background-color: #f5f5f5;
	  }
	  
	  .status-badge {
	    position: absolute;
	    top: 0;
	    left: 0;
	    background-color: #34c759;
	    padding: 4rpx 12rpx;
	    border-radius: 12rpx 0rpx 16rpx 0rpx;
	  }
	  
	  .status-text {
	    color: #ffffff;
	    font-size: 22rpx;
	  }
	  
	  .info-area {
	    flex: 1;
	    flex-direction: column;
	    // justify-content: space-between;
	  }
	  
	  .title-row {
	    display: flex;
	    align-items: flex-end;
	    margin-bottom: 12rpx;
	  }
	  
	  .title {
	    font-size: 34rpx;
	    font-weight: bold;
	    color: #333333;
	  }
	  
	  .distance {
	    font-size: 24rpx;
	    color: #999999;
	    margin-left: 16rpx;
	    margin-bottom: 4rpx;
	  }
	  
	  .tags-row {
	    display: flex;
	    flex-wrap: wrap;
	    margin-bottom: 16rpx;
	  }
	  
	  .hollow-tag {
	    display: flex;
	    align-items: center;
	    /* NVUE 下边框需拆分写以防渲染失效 */
	    border-width: 2rpx;
	    border-style: solid;
	    border-color: #65a94e;
	    border-radius: 6rpx;
	    padding: 2rpx 10rpx;
	    margin-right: 12rpx;
	    margin-bottom: 8rpx;
	  }
	  
	  .hollow-tag-text {
	    font-size: 22rpx;
	    color: #65a94e;
	  }
	  
	  .stats-row {
	    display: flex;
	    align-items: center;
		margin-bottom: 16rpx;
		white-space: nowrap;
	  }
	  
	  .stat-text {
	    font-size: 24rpx;
	    color: #888888;
	  }
	  
	  .stat-divider {
	    width: 16rpx;
	  }
	  
	  .divider {
	    height: 1px;
	    background-color: #f0f0f0;
	    margin-top: 24rpx;
	    margin-bottom: 24rpx;
	  }
	  
	  .bottom-area {
		  margin-top: 24rpx;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	  }
	  
	  .address-text {
	    flex: 1;
	    font-size: 26rpx;
	    color: #666666;
	    /* 单行文本省略 (NVUE 兼容写法) */
	    lines: 1;
	    text-overflow: ellipsis;
	    margin-right: 20rpx;
	  }
	  
	  .nav-button {
	    display: flex;
	    align-items: center;
	  }
	  
	  .nav-icon-box {
	    /* 导航图标外圈虚线框 */
	    border-width: 2rpx;
	    border-style: dashed;
	    border-color: #cccccc;
	    padding: 4rpx;
	    margin-right: 8rpx;
	  }
	  
	  .nav-text {
	    font-size: 26rpx;
	    color: #666666;
	  }
	}
.page {
	width: 750rpx;
	position: relative;

	.bgcolor {
		position: absolute;
		width: 750rpx;
		height: 448rpx;
		z-index: 0;
	}

	.add_box {
		width: 690rpx;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		z-index: 10;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-top: 24rpx;
		padding-right: 20rpx;
		padding-bottom: 24rpx;
		padding-left: 20rpx;
		.add_info {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			.info_l {
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				.info_l_text1 {
					font-weight: 500;
					font-size: 36rpx;
					color: #333333;
				}
				.info_l_text2 {
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
				}
			}
			.info_r {
				display: flex;
				flex-direction: row;
				.info_r_img {
					width: 28rpx;
					height: 28rpx;
					margin-right: 10rpx;
				}
				.info_r_text {
					font-size: 24rpx;
					color: #666666;
				}
			}
		}
		.add_b {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			justify-content: space-between;
			margin-top: 20rpx;
			
			.add_b_box {
				flex: 1;
				width: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.route-place {
					font-weight: 400;
					font-size: 32rpx;
					color: #333333;
					lines: 1;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.route-location {
					font-weight: 400;
					font-size: 24rpx;
					color: #909599;
					margin-top: 16rpx;
					lines: 1;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.arrow_img {
				width: 106rpx;
				height: 16rpx;
				margin-left: 10rpx;
				margin-right: 10rpx;
				// margin-top: 10rpx;
				line-height: 40rpx;
			}
		}

		.seach_tag {
			display: flex;
			flex-direction: row;
			align-items: center;
			.seach_tag_text {
				padding-top: 8rpx;
				padding-right: 36rpx;
				padding-bottom: 8rpx;
				padding-left: 36rpx;
				border-radius: 8rpx;
				background-color: #f4f5f6;
				margin-right: 20rpx;
				font-size: 24rpx;
				color: #333333;
				&.active {
					font-weight: 500;
					color: #628f2f;
					background-color: #f8fff0;
					border: 2rpx solid #628f2f;
				}
			}
		}
	}

	.drawer_box {
		width: 750rpx;
		background-color: #ffffff;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		display: flex;
		flex-direction: column;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		transition: height 0.3s ease;
		.drawer_line {
			width: 750rpx;
			height: 80rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-top-left-radius: 40rpx;
			border-top-right-radius: 40rpx;
			.drawer_line_s {
				width: 126rpx;
				height: 8rpx;
				background: #d8d8d8;
				border-radius: 200rpx;
			}
		}
		.scroll_box {
			width: 750rpx;
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
			padding-left: 30rpx;
			padding-right: 30rpx;
			.sc_tab {
				width: 690rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				margin-bottom: 34rpx;
				overflow-x: auto;
				.tab_item {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-right: 60rpx;
					.tab_item_imgs {
						width: 84rpx;
						height: 84rpx;
						background: linear-gradient(to left, #ebf8ee, #fefefe);
						border-radius: 50%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						margin-bottom: 8rpx;
						.tab_item_img {
							width: 44rpx;
							height: 44rpx;
						}
					}
					.tab_item_text {
						font-size: 24rpx;
						color: #333333;
						word-break: keep-all;
					}
					.activebg {
						background: linear-gradient(to left, #94d34d, #628f2f);
					}
					.activetext {
						color: #628f2f;
						font-weight: 500;
					}
				}
			}
			.tag_box {
				width: 690rpx;
				display: flex;
				flex-direction: column;
				margin-bottom: 26rpx;
				.tag_tips {
					font-size: 24rpx;
					color: #333333;
					margin-bottom: 14rpx;
				}
				.tag_flex {
					width: 690rpx;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					align-items: center;
					overflow-x: auto;
					.tag_text {
						padding-top: 8rpx;
						padding-right: 36rpx;
						padding-bottom: 8rpx;
						padding-left: 36rpx;
						border-radius: 8rpx;
						background-color: #f4f5f6;
						margin-right: 20rpx;
						font-size: 24rpx;
						color: #333333;
						word-break: keep-all;
						border: 2rpx solid #f4f5f6;
						&.active {
							font-weight: 500;
							color: #628f2f;
							background-color: #f8fff0;
							border: 2rpx solid #628f2f;
						}
					}
				}
			}
			.area_box {
				width: 690rpx;
				height: 184rpx;
				box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding-left: 20rpx;
				padding-right: 20rpx;
				border-radius: 24rpx;
				margin-bottom: 20rpx;
				.area_l {
					width: 144rpx;
					height: 144rpx;
					border-radius: 12rpx;
					position: relative;
					margin-right: 22rpx;
					background-color: #d8d8d8;
					.area_l_img {
						width: 144rpx;
						height: 144rpx;
						border-radius: 12rpx;
					}
					.area_l_text {
						position: absolute;
						top: 0;
						left: 0;
						height: 28rpx;
						padding-left: 14rpx;
						padding-right: 14rpx;
						border-top-left-radius: 12rpx;
						border-bottom-right-radius: 12rpx;
						background-color: rgba(33, 198, 94, 0.8);
						font-size: 20rpx;
						font-weight: 500;
						color: #ffffff;
						line-height: 28rpx;
					}
				}
				.area_r {
					flex: 1;
					width: 0;
					height: 144rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.area_t {
						width: 484rpx;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
						.area_t_title {
							font-size: 32rpx;
							font-weight: 500;
							color: #333333;
							margin-right: 20rpx;
						}
						.area_t_km {
							flex: 1;
							font-size: 20rpx;
							color: #999999;
						}
						.area_t_icon {
							width: 50rpx;
							height: 50rpx;
						}
					}
					.area_c {
						width: 484rpx;
						font-size: 24rpx;
						color: #666666;
						lines: 1;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.area_sfz_add {
						width: 484rpx;
						font-size: 24rpx;
						color: #666666;
						lines: 3;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.area_b {
						width: 484rpx;
						display: flex;
						flex-direction: row;
						align-items: center;
						.area_b_icons {
							width: 32rpx;
							height: 32rpx;
							margin-right: 20rpx;
						}
					}
				}
			}

			// 充电桩样式
			.cdz_card {
				width: 690rpx;
				height: 184rpx;
				box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding-left: 20rpx;
				padding-right: 20rpx;
				border-radius: 24rpx;
				margin-bottom: 20rpx;

				.cdz_l {
					height: 184rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;

					.cdz_l_name {
						font-weight: bold;
						font-size: 30rpx;
						color: #333333;
						line-height: 60rpx;
					}
					.cdz_l_jl {
						display: flex;
						flex-direction: row;
						align-items: center;
						.cdz_l_jl_icon {
							width: 20rpx;
							height: 20rpx;
						}
						.cdz_l_jl_text {
							font-weight: 500;
							font-size: 24rpx;
							color: #999999;
						}
					}
					.cdz_l_price {
						display: flex;
						flex-direction: row;
						align-items: flex-end;
						.cdz_l_price_text {
							font-weight: 500;
							font-size: 38rpx;
							line-height: 38rpx;
							color: var(--primary-color);
						}
						.cdz_l_price_text1 {
							color: var(--primary-color);
							font-size: 24rpx;
							line-height: 24rpx;
						}

						.cdz_l_price_text2 {
							font-size: 24rpx;
							line-height: 24rpx;
							color: #999999;
						}
					}
				}
				.cdz_r {
					height: 184rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					.cdz_status {
						width: 100rpx;
						height: 42rpx;
						background: #f0f8f4;
						border-radius: 21rpx;
						font-weight: 500;
						font-size: 22rpx;
						color: #00964e;
						text-align: center;
						line-height: 42rpx;
					}
					.cdz_fast {
						display: flex;
						flex-direction: row;
						width: 158rpx;
						height: 36rpx;
						background: #ffffff;
						border-radius: 12rpx;
						border: 1rpx solid #00964e;

						.type {
							width: 56rpx;
							height: 34rpx;
							background: #00964e;
							text-align: center;
							line-height: 34rpx;
							font-size: 24rpx;
							color: #fff;
							border-radius: 12rpx;
						}

						.availability {
							width: 102rpx;
							height: 34rpx;
							font-weight: 500;
							font-size: 24rpx;
							color: #00964e;
							text-align: center;
							line-height: 34rpx;
						}
					}
					.cdz_slow {
						display: flex;
						flex-direction: row;
						width: 158rpx;
						height: 36rpx;
						background: #ffffff;
						border-radius: 12rpx;
						border: 1rpx solid #00aca6;

						.type {
							width: 56rpx;
							height: 34rpx;
							background: #00aca6;
							font-size: 24rpx;
							text-align: center;
							line-height: 34rpx;
							color: #fff;
							border-radius: 12rpx;
						}

						.availability {
							width: 102rpx;
							height: 34rpx;
							font-weight: 500;
							font-size: 24rpx;
							color: #00aca6;
							text-align: center;
							line-height: 34rpx;
						}
					}
				}
			}

			// 天气样式
			.tq_box {
				width: 690rpx;
				box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx;
				border-radius: 24rpx;
				margin-bottom: 20rpx;

				.tq_t {
					width: 650rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 20rpx;

					.tr_t_title {
						font-weight: bold;
						font-size: 28rpx;
						color: #000000;
					}

					.tr_t_tags {
						flex: 1;
						display: flex;
						flex-direction: row;
						align-items: center;
						.alert_tag {
							margin-left: 24rpx;
							border-radius: 24rpx;
							font-size: 24rpx;
							color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
							min-width: 160rpx;
							text-align: center;
							.alert_tag_type {
								font-weight: bold;
								margin-bottom: 4rpx;
							}
						}
					}

					.tr_t_more {
						display: flex;
						flex-direction: row;
						align-items: center;

						.tr_t_more_text {
							font-weight: 500;
							font-size: 24rpx;
							color: #999999;
						}
					}
				}

				.tq_b {
					width: 650rpx;
					display: flex;
					flex-direction: row;
					align-items: center;

					.tq_b_temp {
						display: flex;
						flex-direction: row;
						margin-right: 44rpx;
						align-items: flex-end;

						.tq_b_temp_text {
							font-weight: bold;
							font-size: 60rpx;
							color: #000000;
							line-height: 50rpx;
						}

						.tq_b_temp_text1 {
							font-size: 24rpx;
							line-height: 24rpx;
						}
					}

					.tq_b_info {
						display: flex;
						flex-direction: column;
						flex: 1;

						.tq_b_info_top {
							display: flex;
							flex-direction: column;

							.tq_b_info_top_content {
								display: flex;
								flex-direction: row;
								align-items: center;

								.tq_b_weather_text {
									font-weight: bold;
									font-size: 36rpx;
									color: #000000;
								}
							}
						}

						.tq_b_info_bottom {
							display: flex;
							flex-direction: row;
							align-items: center;

							.tq_b_info_item {
								display: flex;
								flex-direction: row;
								align-items: center;
								margin-right: 40rpx;

								.tq_b_info_icon {
									width: 40rpx;
									height: 40rpx;
									margin-right: 20rpx;
								}

								.tq_b_info_text {
									font-weight: 500;
									font-size: 24rpx;
									color: #000000;
								}
							}

							.tq_b_weather_icon {
								width: 66rpx;
								height: 66rpx;
							}
						}
					}
				}
				.swiper-container {
					width: 650rpx;
					height: 130rpx;

					.swiper-card {
						display: flex;
						border-radius: 16rpx;
						color: #333;
						font-size: 28rpx;
						flex-direction: row;
						align-items: center;
						width: 650rpx;
						height: 88rpx;

						.icon1 {
							font-size: 36rpx;
							margin-right: 12rpx;
							margin-left: 20rpx;
						}

						.title1 {
							font-weight: bold;
						}
					}
				}
				
				/* 背景色定义 */
				.bg-blue {
					background-color: #007aff;
				}
				
				.bg-yellow {
					background-color: #ffc107;
				}
				
				.bg-orange {
					background-color: #ff9800;
				}
				
				.bg-red {
					background-color: #f44336;
				}
				
				.bg-default {
					background-color: #9e9e9e;
				}
			}

			// 路线样式
			.lx_box {
				width: 690rpx;
				box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx;
				border-radius: 24rpx;
				margin-bottom: 20rpx;
				.tax1 {
					text-align: center;
					color: #000000;
					font-weight: bold;
					font-size: 22rpx;
				}

				.tax2 {
					color: #000000;
					font-weight: bold;
					font-size: 32rpx;
				}

				.tax3 {
					font-weight: 500;
					font-size: 22rpx;
					color: #999999;
				}

				.actiTax1 {
					font-weight: bold;
					font-size: 22rpx;
					color: var(--primary-color);
				}

				.actiTax2 {
					font-weight: bold;
					font-size: 32rpx;
					color: var(--primary-color);
				}

				.actiTax3 {
					font-weight: 500;
					font-size: 22rpx;
					color: var(--primary-color);
				}
			}
		}
	}
}
</style>
