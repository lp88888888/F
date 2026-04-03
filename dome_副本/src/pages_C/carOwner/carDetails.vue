<template>
	<view class="hotel-details-page" :data-theme="pageTheme">
		<up-navbar title="" :bgColor="navBgColor" autoBack :fixed="true">
			<template #left>
				<view class="custom-icon-btn" @click="toBack">
					<image class="custom-icon" :src="`${imgUrl}trip-pro/arrow-left-icon_w.png`" />
				</view>
			</template>
		</up-navbar>
		<!-- Banner 区域 -->
		<view class="bannerCon" v-if="banners.length > 0">
			<u-swiper :list="banners" height="486rpx" radius="0" :indicator="true" img-mode="heightFix"
				 :current="swiperCurrent" @change="swiperChange" circular></u-swiper>
			<view class="custom-indicator">
				{{ swiperCurrent + 1 }} / {{ banners.length }}
			</view>
			<!-- <view class="custom-icon-btn" @click="toBack">
				<image class="custom-icon" :src="`${imgUrl}trip-pro/arrow-left-icon_w.png`" />
			</view> -->
		</view>
		<view class="part-con" v-if="info && info.id">
			<view class="info colCon">
				<!-- 名称 -->
				<view class="tex36_33_b" style="font-size: 36rpx;font-weight: bold;">{{ info.name }}</view>
				<!-- 主题 -->
				<view class="tex32_66" style="margin-top: 20rpx;color: #666666;font-size: 32rpx;font-weight: 500;">{{ info.theme }}</view>

				<!-- 标签 -->
				<view v-if="info.spotTag.length > 0" style="gap: 12rpx;">
					<text v-for="(tag, index) in info.spotTag" :key="index" style="font-size: 24rpx;">{{ tag }}</text>
				</view>

				<!-- 小易推荐 -->
				<!-- <view v-if="info.ownedRoad === '11'" class="owned-road">
					<view>
						<image :src="imgUrl + 'static/self-drive-re-icon.png'" mode="" />
					</view>
					<text class="tex28_33">小易推荐</text>
				</view> -->

				<!-- 分割线 -->
				<view class="baseLine"></view>

				<!-- 活动时间 -->
				<view class="rowCon" style="align-items: flex-start;">
					<image :src="imgUrl + 'static/self-drive-time.png'" class="icTime" />
					<text class="tex28_66">活动时间：</text>
					<text class="tex28_33_b" style="flex: 1;">{{ info.activityDate ? info.activityDate : '' }}</text>
				</view>

				<!-- 联系电话 -->
				<view v-if="info.fullPhone" class="rowCon" style="margin-top: 20rpx;">
					<image :src="imgUrl + 'static/self-drive-telephone.png'" class="icAddress" />
					<text class="tex28_66">联系电话：</text>
					<text class="tex28_33_b bdab" :style="{color:themeStore.themeColors.$primaryColor}" @click="makePhoneCall(info.fullPhone)">{{ firtPhone }}</text>
				</view>

				<!-- 导航 -->
				<view class="rowCon nav-view" :style="{backgroundImage: `url('${imgUrl}static/self-drive-nav-map-bg.png')`}">
					<view class="navCon">
						<view class="tex28_33_b" style="margin-bottom: 24rpx;font-weight: bold;">距离{{ info.distance ? info.distance : '' }}km</view>
						<text class="tex24_66 texNoWrap">{{ info.fullAddress }}</text>
					</view>
					<view class="icNav" @click="handleNavigation(info)">
						<image :src="imgUrl + 'static/self-drive-go-there.png'" />
						<text class="tex24_66">去这里</text>
					</view>
				</view>
			</view>
		</view>
		<view class="buy-tips" v-if="info.refund === '11'">
			<view class="tex28_66">服务</view>
			<view class="service-list">
				<view class="service-item">
					<image :src="icoUrl + 'check-car-icon.png'" mode="" />
					<text class="tex28_33">支持退款</text>
				</view>
				<view class="service-item">
					<image :src="icoUrl + 'check-car-icon.png'" mode="" />
					<text class="tex28_33">退订保障</text>
				</view>
			</view>
			<view class="detail-btn" @click="openService">
				<text class="tex24_66">详情</text>
				<up-icon name="arrow-right" color="#999999" size="20"></up-icon>
			</view>
		</view>
		<up-sticky offset-top="90" bgColor="#FFFFFF" zIndex="9">
			<view class="tab_box">
				<template v-for="(item, index) in tabdata" :key="index">
					<view class="tab_item" v-if="item.status" @click="handleTab(item)">
						<text :style="{ color: tabindex === item.value ? themeStore.themeColors.$primaryColor : '#000000' }" :class="{ active: tabindex === item.value }">{{ item.label }}</text>
						<image v-if="tabindex === item.value" class="tab_item_img" :src="`${icoUrl}tab_icon.png`" mode=""></image>
					</view>
				</template>
			</view>
		</up-sticky>
		
		<view class="depart-view pro-part jqcf" id="pro1">
			<view class="depart-head">
				<view class="tex28_33" style="font-weight: bold;">近期出发</view>
				<!-- <view @click="showForm">
					<text class="tex24_66">查看更多</text>
					<up-icon name="arrow-right" color="#999999" size="20"></up-icon>
				</view> -->
			</view>
			<view class="depart-cont">
				<scroll-view class="depart-scroll" scroll-x enable-flex>
					<view v-for="(child, index) in mouthData" :key="index" class="depart-item" @click="groupsClick(child)">
						<view class="cont">
							<view>
								<view class="tex28_33_b" style="color: #000;font-weight: bold;">{{ formatTimestamp(child.startDate,'MM-dd') }} 至 {{ formatTimestamp(child.endDate,'MM-dd') }}</view>
								<view>¥{{ child.manCost }}</view>
								<view>
									<view>
										<text class="tex24_33" style="color: #999999;">{{ info.minGroupNum }}人</text>
										<text class="tex24_66" style="color: #999999;">成团</text>
									</view>
									<view>
										<text class="tex24_66" style="color: #999999;">已报名</text>
										<text class="tex24_33" style="color: #999999;">{{ child.num }}人</text>
									</view>
								</view>
							</view>
							<view :class="{ gray: child.status != 1 }">
								{{ child.status == 2 ? '已过期' : child.status == 1 ? '进行中' : '未开始' }}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<view class="bright-spot pro-part" id="pro2">
			<view class="base-head">
				<text>{{'>>>'}}</text>
				<text>亮点</text>
			</view>
			<view class="wxParse">
				<!-- <rich-text :nodes="info.lightSpot"></rich-text> -->
				<up-parse style="width: 100%" :content="info.lightSpot" ></up-parse>
			</view>
		</view>

		<!-- 行程 -->
		<view class="journey-view pro-part" id="pro3">
			<view v-if="peoKey !== 3" class="zw-journey-scroll"></view>
			<view class="base-head">
				<text>{{'>>>'}}</text>
				<text>行程</text>
			</view>
			<scroll-view class="journey-scroll" @dragend="journeyBind" :style="{ height: journeyScrollHeight + 'px' }"
				:scroll-top="journeyScrollTop" enhanced scroll-y scroll-into-view="currentDay">
				<view v-for="(item, index) in info.roadTripRoutes" :id="'day' + index" :key="index" class="journey-item">
					<view class="wxParse">
						<!-- <rich-text :nodes="item.value"></rich-text> -->
						<up-parse style="width: 100%" :content="item.value" ></up-parse>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 费用 -->
		<view class="cost-view pro-part" id="pro4">
			<view class="base-head">
				<text>{{'>>>'}}</text>
				<text>费用</text>
			</view>
			<view class="rich-service" v-if="info.cost">
				<view class="wxParse">
					<!-- <rich-text :nodes="info.cost"></rich-text> -->
					<up-parse style="width: 100%" :content="info.cost" ></up-parse>
				</view>
			</view>
		</view>

		<!-- 须知 -->
		<view class="notice-view pro-part" id="pro5">
			<view class="base-head">
				<text>{{'>>>'}}</text>
				<text>须知</text>
			</view>
			<view class="rich-service" v-if="info.notice">
				<view class="wxParse">
					<!-- <rich-text :nodes="info.notice"></rich-text> -->
					<up-parse style="width: 100%" :content="info.notice" ></up-parse>
				</view>
			</view>
		</view>
	</view>
	 <view class="layer-shadow-view" v-if="calendarShow" @click="closeCalendar"></view>
	
	  <!-- 日历弹窗 -->
	  <view class="calendar-view" :class="{ open: calendarShow }">
	    <view class="calen-tit-tit">
	      <view class="calen-tit">选择日期/套餐/人数</view>
	    </view>
	    <scroll-view class="calendar-scroll" scroll-y :scroll-top="layerCalScrollHeight">
	      <view style="width: 100%; height: 90rpx"></view>
	
	      <!-- 日历组件 -->
	      <view class="calendar" v-if="canlengShow && info.id">
				<up-calendar ref="calendarRef" :defaultDate="defaultDate" :color="themeStore.themeColors.$primaryColor" :show="true" :formatter="formatter" pageInline  mode="single" :showTitle="false" :showConfirm="false" monthNum="13" @confirm="onRangeChange" />
	      </view>
	
	      <!-- 套餐行程 -->
	      <view class="journey">
	        <view style="font-size: 32rpx;font-weight: bold;">套餐行程</view>
	        <view :style="{background:themeStore.themeColors.$headcolor,color:'#FFFFFF'}">{{ info.name }}</view>
	      </view>
	
	      <!-- 出行人数 -->
	      <view class="reman">
	        <view class="tip" style="font-size: 32rpx;font-weight: bold;">出行人数</view>
	        <view class="nums">
	          <!-- 成人 -->
	          <view>
	            <view>
	              <text class="tex28_33_b" style="font-weight: bold;">成人</text>
	              <text class="tex28_33_b" style="font-weight: bold;">¥{{ manAllCost }}</text>
	            </view>
	            <view>
	              <text @click="subNum('adultNum')">-</text>
	              <text>{{ adultNum }}</text>
	              <text :style="{background:themeStore.themeColors.$primaryColor}" @click="addNum('adultNum')">+</text>
	            </view>
	          </view>
	          <!-- 儿童 -->
	          <view>
	            <view>
	              <text class="tex28_33_b" style="font-weight: bold;">儿童</text>
	              <text class="tex28_33_b" style="font-weight: bold;">¥{{ childAllCost }}</text>
	            </view>
	            <view>
	              <text @click="subNum('kidNum')">-</text>
	              <text>{{ kidNum }}</text>
	              <text :style="{background:themeStore.themeColors.$primaryColor}" @click="addNum('kidNum')">+</text>
	            </view>
	          </view>
	        </view>
	      </view>
	
	      <view style="width: 100%; height: 200rpx;"></view>
	
	      <!-- 下一步按钮（固定底部） -->
	      <view class="next-view" v-if="calendarShow">
	        <text style="width: 260rpx;" class="tex28_33">{{ truthData.startDaySlice }}</text>
	        <!-- <text  @click="next">下一步</text> -->
			<u-button text="下一步" :color="themeStore.themeColors.$primaryColor" shape="circle" @click="next"></u-button>
	      </view>
	    </scroll-view>
	  </view>
	
	  <!-- 服务说明弹窗 -->
	  <up-popup mode="bottom" bgColor="#FFFFFF" :safeAreaInsetBottom="false" :show="serviceShow" @close="closeService">
	  	<view class="service-cont">
	  	  <!-- Tab 切换 -->
	  	  <view class="change-tab">
	  	    <view class="fl-al-ce change-tab-item" @click="changeServiceTab(1)">
			  <up-icon v-if="serviceKey == 1" name="checkmark-circle-fill" :color="themeStore.themeColors.$primaryColor" size="22"></up-icon>
	  	      <text class="tex28_33">支持退款</text>
	  	    </view>
	  	    <view class="fl-al-ce change-tab-item" @click="changeServiceTab(2)">
			  <up-icon v-if="serviceKey == 2" name="checkmark-circle-fill" :color="themeStore.themeColors.$primaryColor" size="22"></up-icon>
	  	      <text class="tex28_33">退订保障</text>
	  	    </view>
	  	  </view>
	  		
	  	  <!-- 内容区 -->
	  	  <view class="tab-cont">
	  	    <view class="tex28_33 name">{{ info.name }}</view>
			<scroll-view class="rich-service" :scroll-y="true" style="max-height: 600rpx;">
				<view class="wxParse">
				  <!-- <rich-text :nodes="serviceKey === 1 ? info.refundPolicy : info.refundSafe" /> -->
					<up-parse style="width: 100%" :content="serviceKey === 1 ? info.refundPolicy : info.refundSafe" ></up-parse>
				</view>
			</scroll-view>
	  	    <!-- <view class="rich-service">
	  	      <view class="wxParse">
	  			<up-parse style="width: 100%" :content="serviceKey === 1 ? info.refundPolicy : info.refundSafe" ></up-parse>
	  	      </view>
	  	    </view> -->
	  	    <view style="width: 100%; height: 130rpx;"></view>
	  	  </view>
	  		
	  	  <view class="l-btn" @click="closeService">我知道了</view>
	  	</view>
	  </up-popup>
	  <!-- <view class="layer-service" v-if="serviceShow">
	    
	  </view> -->
	
	  <!-- 底部占位 -->
	  <view style="width: 100%; height: 140rpx;"></view>
	
	  <!-- 底部操作栏 -->
	  <view class="user-bar">
	    <!-- <view>
	      <view class="user-bar-item" @click="getCollet">
	        <image
	          :src="imgUrl1 + '/wximage/trip-pro/activity/' + (info.collect ? 'self-drive-collect-light' : 'self-drive-collect') + '.png'"
	          mode=""
	        />
	        <text class="tex24_33">收藏</text>
	      </view>
	      <view @click="showPop" class="user-bar-item">
	        <image :src="imgUrl1 + '/wximage/trip-pro/activity/self-drive-service.png'" mode="" />
	        <text class="tex24_33">平台客服</text>
	      </view>
	    </view> -->
	    <!-- 报名状态判断 -->
	    <template v-if="info.busStatus == 11 || info.busStatus == 13">
	      <view style="background: #999999;flex: 1;line-height: 70rpx;border-radius: 20rpx;" >
	        {{ info.busStatus == 11 ? '报名未开始' : '报名已结束' }}
	      </view>
	    </template>
	    <template v-else>
	      <!-- <view  @click="showForm">立即报名</view> -->
		  <u-button text="立即报名" :color="themeStore.themeColors.$primaryColor" :customStyle="{fontSize:'28rpx'}" shape="circle" @click="showForm"></u-button>
	    </template>
		<PageDurationTracker pageName="车主节详情" />
	  </view>
</template>

<script lang="ts" setup>
	import theme from '@/utils/theme'
	import { ref, onMounted,computed ,nextTick,reactive} from 'vue';
	import { onLoad, onReady ,onPageScroll} from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import Calendar from '@/components/Calendar.vue'
	import { roadTripInfo ,roadTripVisitorList,getGroupList} from '@/api/carOwner';
	import { openAPPLocation, openLocation, makePhoneCall ,formatTimestamp,isDateBetween} from '@/utils/util';
	import { toNav, toRec ,toBack } from '@/utils/route';
	const systemInfo = uni.getSystemInfoSync()
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const calendarShow = ref(false)
	const serviceShow = ref(false)
	const canlengShow = ref(true)
	const serviceKey = ref(1)
	const layerCalScrollHeight = ref(0)
	const detailInfo = ref({})
	const maxDate = ref(0)
	const navBgColor = ref('transparent')
// 人数
	const adultNum = ref(1)
	const kidNum = ref(0)
	const swiperCurrent = ref(0);
	const imgUrl1 = ref('https://tranalioss.shanyitong.com');
	const banners = ref<string[]>([]);
	const info = ref({
		fullPhone:''
	})
	const swiperChange = (event)=>{
		swiperCurrent.value = event.current
	}
	const truthData = reactive({
	  startDaySlice: '',
	  endDaySlice: ''
	})
	const defaultDate = ref([]);
	const selectedDate = ref('')
	const firtPhone = computed(()=>{
		if(info.value?.fullPhone){
			let str = String(info.value.fullPhone);
			if (str.length !== 11) return str; // 如果不是11位，原样返回或做其他处理
			return str.slice(0, 3) + '****' + str.slice(7);
		}
		return ''
	})
	// 成人价格
	const manAllCost = computed(()=>{
		let dataSrt = info.value?.manCost
		for(let i in mouthData.value){
			if(mouthData.value[i].startDate == selectedDate.value){
				dataSrt = mouthData.value[i].manCost
			}
		}
		
		return dataSrt
	})
	// 儿童价格
	const childAllCost = computed(()=>{
		let dataSrt = info.value?.childCost
		for(let i in mouthData.value){
			if(mouthData.value[i].startDate == selectedDate.value){
				dataSrt = mouthData.value[i].childCost
			}
		}
		return dataSrt
	})
	const tabindex = ref(0);
	const tabdata = ref([
		{
			label: '近期出发',
			value: 0,
			id: '.jqcf',
			status: true,
		},
		{
			label: '亮点',
			value: 1,
			id: '.bright-spot',
			status: true,
		},
		{
			label: '行程',
			value: 2,
			id: '.journey-view',
			status: true,
		},
		{
			label: '费用',
			value: 3,
			id: '.cost-view',
			status: true,
		},
		{
			label: '须知',
			value: 4,
			id: '.notice-view',
			status: true,
		},
		// {
		// 	label: '评价',
		// 	value: 5,
		// 	id: '.zs_box',
		// 	status: true,
		// },
	]);
	const handleTab = (item) => {
		console.log('点击切换', item);
		tabindex.value = item.value;
	
		// 使用节点查询获取元素位置和页面滚动高度
		const query = uni.createSelectorQuery();
		query.select(item.id).boundingClientRect();
		query.selectViewport().scrollOffset();
		
		query.exec((res) => {
			if (res[0] && res[1]) {
				const rect = res[0];   // 目标节点的信息 (包含 relative top)
				const scroll = res[1]; // 页面的滚动信息 (包含 scrollTop)
				
				// 核心：计算你需要预留出来的顶部偏移量
				// 你的 Tab 栏高 110rpx，加上 up-navbar 以及手机状态栏的高度，大约需要 200rpx ~ 240rpx 左右
				// 我们使用 uni.upx2px 将 rpx 转换为当前设备的 px 进行精确计算
				const offsetPx = uni.upx2px(260); // <- 如果觉得还是偏上或偏下，微调这个数值即可
	
				// 计算目标位置：当前已滚动的距离 + 元素离视口顶部的距离 - 需要预留的顶部高度
				const targetScrollTop = scroll.scrollTop + rect.top - offsetPx;
	
				uni.pageScrollTo({
					scrollTop: targetScrollTop,
					duration: 300
				});
			}
		});
	};
	// const handleTab = (item) => {
	// 	console.log('点击切换', item);
	// 	tabindex.value = item.value;
	// 	// uni.pageScrollTo({
	// 	// 	selector: item.id,
	// 	// });
	// 	uni.pageScrollTo({
	// 	        selector: item.id,
	// 	        duration: 300,
	// 	        // 根据你的顶部 Navbar 和 Tab 栏高度调整这个负值
	// 	        // 假设顶部占用了 200rpx，这里可以尝试偏移
	// 	        scrollTop: 200
	// 	    });
	// };
	// 方法
	const closeCalendar = () => {
	  calendarShow.value = false
	}
	
	const showForm = () => {
		calendarShow.value = true
		console.log('打开报名表单')
		// uni.navigateTo({ url: '/pages/form/form' })
	}
	
	const next = () => {
		if(!selectedDate.value) return uni.showToast({ title: '请选择日期', icon: 'none' })
		console.log('下一步，提交:', { adultNum: adultNum.value, kidNum: kidNum.value, date: selectedDate.value })
		uni.setStorageSync('carOwner-carDetails',{ adultNum: adultNum.value, kidNum: kidNum.value, date: selectedDate.value,manCost:manAllCost.value,childCost:childAllCost.value })
		calendarShow.value = false
		toNav('/pages_C/carOwner/addOrder?id='+info.value.id)
	}
	
	const getCollet = () => {
	  info.collect = !info.collect
	  uni.showToast({ title: info.collect ? '已收藏' : '已取消收藏', icon: 'none' })
	}
	
	const showPop = () => {
	  uni.makePhoneCall({ phoneNumber: '4001234567' })
	}
	
	const cancel = () => {
	  uni.showModal({
	    title: '确认取消?',
	    success: (res) => {
	      if (res.confirm) {
	        info.roadTripRecordId = ''
	        uni.showToast({ title: '已取消报名', icon: 'none' })
	      }
	    }
	  })
	}
	
	// 人数增减
	const addNum = (key: 'adultNum' | 'kidNum') => {
	  if (key === 'adultNum') adultNum.value++
	  else kidNum.value++
	}
	const subNum = (key: 'adultNum' | 'kidNum') => {
	  if (key === 'adultNum' && adultNum.value > 1) adultNum.value--
	  if (key === 'kidNum' && kidNum.value > 0) kidNum.value--
	}
	
	// 范围选择
	const onRangeChange = (e) => {
		console.log("范围选择器",e)
		selectedDate.value = e[0]
		truthData.startDaySlice = e[0]
	}
	
	// 服务弹窗
	const changeServiceTab = (key: number) => {
	  serviceKey.value = key
	}
	const openService = ()=>{
		serviceShow.value = true
	}
	const closeService = () => {
	  serviceShow.value = false
	}
	const mouthData = ref([])
	const peoKey = ref(1)
	const journeyScrollHeight = ref(300) // 示例高度
	const journeyScrollTop = ref(0)
	const currentDay = ref('day0');
	
	// 导航
	const handleNavigation = (item) => {
		// #ifdef APP-PLUS
		const navigationInfo = {
			endLocation: {
				longitude: Number(item.longitude),
				latitude: Number(item.latitude),
				address: item.fullAddress,
			},
		};
		openAPPLocation(navigationInfo);
		//  #endif
		// #ifdef MP-WEIXIN || APP-HARMONY
		openLocation({
			latitude: Number(item.latitude), // 纬度
			longitude: Number(item.longitude), // 经度
			name: item.address, // 地址名称（服务区名称）
			address: item.fullAddress, // 地址
			scale: 18, // 缩放级别，1~20，数值越大，地图越精细
		});
		// #endif
	}
	
	const groupsId = ref(null);
	const groupsClick = (item)=>{
		if(item.status == 0) return uni.showToast({ title: '团期未开始', icon: 'none' })
		if(item.status == 2) return uni.showToast({ title: '团期已过期', icon: 'none' })
		calendarShow.value = true
		canlengShow.value = false;
		groupsId.value = item.id
		defaultDate.value = item.startDate
		selectedDate.value = item.startDate
		truthData.startDaySlice = item.startDate
		nextTick(() => {
			canlengShow.value = true;
			calendarShow.value = true;
		});
	}
	const groupRow = async ()=>{
		const requestTime = formatTimestamp((new Date().getTime() - 1000), 'YYYY-MM-DD');
		try{
			const res = await getGroupList({
				roadTripId:infoId.value,
				startDate:requestTime+" 00:00:00"
			})
			
			console.log('-00-00-0--0-0-',res);
		}catch(err){
			console.log('-00-00-0err--0-0-',err);
		}
	}
	const getData = async ()=>{
		try{
			const res = await roadTripInfo({
				id:infoId.value,
				longitude:currentLng.value,
				latitude:currentLat.value,
			})
			
			info.value = res.data
			info.value.spotTag = res.data.spotTag?res.data.spotTag.split(","):[]
			banners.value = res.data.images ?[res.data.imagesContraction,...res.data.images.split(",")] :res.data.imagesContraction ?[res.data.imagesContraction]: []
			maxDate.value = new Date(res.data.endTime)
			mouthData.value = res.data.roadTripGroups || []
			// roadTripGroups
			// groupRow()
			
			console.log('-00-00-0--0-0-',res);
		}catch(err){
			// console.log('-00-00-0err--0-0-',err);
		}
	}
	const calendarRef = ref(null)
	const formatter = (day) => {
		let dataSrt = info.value?.manCost
		if(mouthData.value.length){
			
			for(let i in mouthData.value){
				const d = new Date(mouthData.value[i].startDate);
				let month = d.getMonth() + 1;
				const date = d.getDate();
				if(day.month == month && day.day == date){
					dataSrt = mouthData.value[i].manCost
				}
			}
		}
		day.bottomInfo = '￥'+dataSrt;
		return day;
	};
	onLoad((opticon) => {
		console.log(opticon);
		currentLat.value = uni.getStorageSync('address').lat;
		currentLng.value = uni.getStorageSync('address').lng;
		infoId.value = opticon.id
		getData()
	})
	const currentLat = ref('')
	const currentLng = ref('')
	const infoId = ref('')


	onReady(() => {
		
		// #ifdef MP-WEIXIN
			calendarRef.value.setFormatter(formatter);
		// #endif
		
	});
	onPageScroll((e) => {
		if(e.scrollTop < 20){
			navBgColor.value = 'transparent'
		}else{
			navBgColor.value = themeStore.themeColors.$labelColor
		}
	});
</script>

<style lang="scss">
	
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
				font-size: 32rpx;
				color: #333333;
				margin-bottom: 8rpx;
				font-weight: bold;
				white-space: nowrap;
				word-break: keep-all;
			}
	
			image {
				width: 30rpx;
				height: 6rpx;
			}
	
			.active {
				font-weight: bold;
				color: #628f2f;
			}
		}
	}
	.custom-indicator {
		position: absolute;
		bottom: 50rpx; // 调整距离底部的距离
		right: 20rpx; // 调整距离右侧的距离
		background-color: rgba(0, 0, 0, 0.3); // 半透明黑色背景
		color: #ffffff; // 白色文字
		padding: 6rpx 16rpx; // 内边距
		border-radius: 20rpx; // 圆角
		font-size: 24rpx; // 字体大小
		z-index: 10; // 确保在轮播图之上
	}
	.bg-primary-gradient {
	    background: var(--but-color-line) !important;
	    background-image: none !important;
	}
	.custom-icon-btn {
		width: 48rpx;
		height: 48rpx;
		background: rgba(0, 0, 0, 0.4);
		// position: absolute;
		// top: 106rpx; // 调整距离底部的距离
		// left: 20rpx; // 调整距离右侧的距离
		// z-index: 10; // 确保在轮播图之上
		border: 50%;
		text-align: center;
		line-height: 48rpx;
		border-radius: 50%;
	}

	.custom-icon {
		width: 32rpx;
		height: 32rpx;
		margin-top: 6rpx;
	}

	.hotel-details-page {
		background: var(--head-color);
		min-height: 100vh;
	}

	.bannerCon {
		position: relative;
		height: 486rpx;
	}

	.banner-line {
		position: absolute;
		bottom: 12rpx;
		left: 12rpx;
		display: flex;
		align-items: center;
		width: 400rpx;
		height: 48rpx;
		border-radius: 32rpx;
		background: rgba(0, 0, 0, 0.7);
		padding-left: 10rpx;
	}

	.part-con {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: -26rpx;
		position: relative;
	}

	.part-con .info {
		width: 100%;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 40rpx 28rpx 20rpx;
		box-sizing: border-box;
	}

	.part-con .info>view:nth-child(3) {
		width: 100%;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 32rpx;
	}
	
	.part-con .info>view:nth-child(3)>text {
		// height: 40rpx;
		line-height: 40rpx;
		background-color: #ffffff;
		border-radius: 2rpx;
		border: solid 1rpx var(--primary-color);
		padding: 0 15rpx;
		margin-right: 24rpx;
		font-size: 24rpx;
		color: var(--primary-color);
	}

	.part-con .info .owned-road {
		width: 222rpx;
		height: 48rpx;
		background-color: rgba(255, 231, 231, 0.3);
		border-radius: 24rpx;
		display: flex;
		align-items: center;
	}

	.part-con .info .owned-road>view:nth-child(1) {
		width: 58rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10rpx;
		border-right: solid 1rpx #e1e1e1;
		box-sizing: border-box;
	}

	.part-con .info .owned-road>view:nth-child(1)>image {
		width: 34rpx;
		height: 34rpx;
	}

	.part-con .info .baseLine {
		width: 100%;
		height: 1rpx;
		background-color: #e1e1e1;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.rowCon {
		display: flex;
		align-items: center;
	}

	.icTime,
	.icAddress {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}

	.nav-view {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.navCon {
		flex: 1;
	}

	.icNav {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.icNav image {
		width: 44rpx;
		height: 44rpx;
		margin-bottom: 16rpx;
	}

	.nav-view {
		width: 702rpx;
		height: 150rpx;
		background-image: url('https://tranalioss.shanyitong.com/wximage/trip-pro/activity/self-drive-nav-map-bg.png');
		background-size: 100% 150rpx;
		padding: 0 60rpx 0 24rpx;
		box-sizing: border-box;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.buy-tips {
		width: 750rpx;
		height: 90rpx;
		background-color: #ffffff;
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		padding: 0 24rpx;
		justify-content: space-between;
		box-sizing: border-box;
		margin-bottom: 10rpx;
	}

	.service-list {
		display: flex;
		align-items: center;
		flex: 1;
		padding-left: 60rpx;
		box-sizing: border-box;
	}

	.service-item {
		display: flex;
		align-items: center;
		margin-right: 40rpx;
	}

	.service-item image {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}

	.detail-btn {
		display: flex;
		align-items: center;
	}

	.detail-btn image {
		width: 12rpx;
		height: 22rpx;
		margin-left: 10rpx;
	}

	.depart-view {
		width: 100%;
		height: 380rpx;
		padding: 0 0 36rpx;
		box-sizing: border-box;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		margin-bottom: 10rpx;
	}

	.depart-view .depart-head {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24rpx;
		box-sizing: border-box;
	}

	.depart-view .depart-head image {
		width: 12rpx;
		height: 22rpx;
		margin-left: 10rpx;
	}

	.depart-view .depart-cont {
		height: 280rpx;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
	}

	.depart-scroll {
		width: 100%;
		height: 280rpx;
		display: flex;
		align-items: center;
	}

	.depart-view .depart-cont .depart-item:first-child {
		margin-left: 24rpx;
	}

	.depart-view .depart-cont .depart-item {
		width: 360rpx;
		height: 240rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 0rpx 9rpx 0rpx rgba(0, 0, 0, 0.15);
		border-radius: 10rpx;
		margin-right: 16rpx;
		display: inline-block;
		margin-top: 20rpx;
		transition: all 0.2s;
	}

	.depart-view .depart-cont .depart-item.active {
		width: 370rpx !important;
		height: 250rpx !important;
	}

	.depart-view .depart-cont .active .cont {
		width: 370rpx !important;
		height: 250rpx !important;
	}

	.depart-view .depart-cont .depart-item .cont {
		width: 360rpx;
		height: 240rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		transition: all 0.2s;
	}

	.depart-view .depart-cont .depart-item .cont>view:nth-child(1) {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		box-sizing: border-box;
	}

	.depart-view .depart-cont .depart-item .cont>view:nth-child(1)>view:nth-child(2) {
		font-size: 36rpx;
		color: #ff0000;
		font-weight: bold;
	}

	.depart-view .depart-cont .depart-item .cont>view:nth-child(1)>view:nth-child(3) {
		width: 300rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.depart-view .depart-cont .depart-item .cont>view:nth-child(2) {
		width: 100%;
		height: 60rpx;
		// background-image: linear-gradient(218deg, #f45243 0%, #eb903f 72%), linear-gradient(269deg, #ff6600 0%, #f5a348 100%), linear-gradient(#ff0000, #ff0000);
		background-image:var(--but-color-line);
		background-blend-mode: normal;
		border-radius: 0rpx 0rpx 10rpx 10rpx;
		text-align: center;
		line-height: 60rpx;
		font-size: 28rpx;
		color: #ffffff;
	}

	.depart-view .depart-cont .depart-item .cont .gray {
		background: #f0f0f0 !important;
		color: #959595 !important;
	}

	.bright-spot,
	.journey-view,
	.cost-view,
	.notice-view {
		width: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 0 24rpx;
		box-sizing: border-box;
		background-color: #fff;
		margin-bottom: 10rpx;
		padding-bottom: 20rpx;
		position: relative;
	}

	.bright-spot image,
	.journey-view image {
		width: 100%;
		height: auto;
	}

	.base-head {
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
	}

	.base-head>text:nth-child(1) {
		font-size: 32rpx;
		color: var(--primary-color);
		font-weight: bold;
	}

	.base-head>text:nth-child(2) {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	.layer-shadow-view {
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  top: 0;
	  left: 0;
	  background-color: rgba(0, 0, 0, 0.4);
	  z-index: 9;
	}
	
	.calendar-view {
	  transition: all 0.2s;
	  width: 100%;
	  height: 1234rpx;
	  background-color: #ffffff;
	  border-radius: 20rpx 20rpx 0rpx 0rpx;
	  position: fixed;
	  bottom: -1234rpx;
	  left: 0;
	  z-index: 9999;
	  overflow-y: scroll;
	  box-sizing: border-box;
	}
	
	.calendar-scroll {
	  width: 100%;
	  height: 1234rpx;
	}
	
	.calendar-view.open {
	  bottom: 0 !important;
	}
	
	.calen-tit-tit {
	  width: 100%;
	  height: 0;
	  position: relative;
	}
	
	.calendar-view .calen-tit {
	  font-size: 28rpx;
	  color: #333333;
	  text-align: center;
	  position: absolute;
	  top: 0;
	  left: 0;
	  height: 90rpx;
	  line-height: 90rpx;
	  width: 100%;
	  z-index: 3;
	  background-color: #fff;
	}
	
	/* 行程 & 人数 */
	.calendar-view .journey,
	.calendar-view .reman {
	  width: 100%;
	  padding: 0 24rpx;
	  box-sizing: border-box;
	}
	
	.calendar-view .journey > view:nth-child(1),
	.calendar-view .reman > view:nth-child(1) {
	  font-size: 28rpx;
	  color: #333333;
	  font-weight: bold;
	  margin-top: 50rpx;
	  margin-bottom: 30rpx;
	}
	
	.calendar-view .journey > view:nth-child(2) {
	  width: 702rpx;
	  background-color: rgba(0, 189, 171, 0.1);
	  border: solid 1rpx var(--primary-color);
	  padding: 0 20rpx;
	  box-sizing: border-box;
	  font-size: 28rpx;
	  color: #333333;
	  line-height: 70rpx;
	}
	
	.calendar-view .reman .nums > view {
	  display: flex;
	  height: 80rpx;
	  align-items: center;
	  justify-content: space-between;
	}
	
	.calendar-view .reman .nums > view > view:nth-child(1) > text:nth-child(1) {
	  margin-right: 55rpx;
	}
	
	.calendar-view .reman .nums > view > view:nth-child(2) {
	  display: flex;
	  align-items: center;
	}
	
	.calendar-view .reman .nums > view > view:nth-child(2) > text:nth-child(1),
	.calendar-view .reman .nums > view > view:nth-child(2) > text:nth-child(3) {
	  width: 80rpx;
	  height: 50rpx;
	  text-align: center;
	  line-height: 50rpx;
	  font-size: 36rpx;
	}
	
	.calendar-view .reman .nums > view > view:nth-child(2) > text:nth-child(1) {
	  background-color: #f0f0f0;
	  color: #999999;
	}
	
	.calendar-view .reman .nums > view > view:nth-child(2) > text:nth-child(3) {
	  background-color: var(--primary-color);
	  border: solid 1rpx #f0f0f2;
	  color: #fefefe;
	}
	
	.calendar-view .reman .nums > view > view:nth-child(2) > text:nth-child(2) {
	  font-size: 28rpx;
	  color: #333333;
	  font-weight: bold;
	  margin: 0 30rpx;
	}
	
	/* 下一步按钮 */
	.next-view {
	  width: 100%;
	  height: 120rpx;
	  background-color: #ffffff;
	  box-shadow: 0rpx -3rpx 3rpx 0rpx rgba(0, 0, 0, 0.08);
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  padding: 0 26rpx;
	  box-sizing: border-box;
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  z-index: 12;
	}
	.next-view-text{
		
	}
	// .next-view-but{
	// 	width: 285rpx;
	// 	height: 80rpx;
	// 	// background-image: linear-gradient(218deg, #f45243 0%, #eb903f 72%),
	// 	//   linear-gradient(269deg, #ff6600 0%, #f5a348 100%),
	// 	//   linear-gradient(#f5a348, #f5a348);
	// 	// background:var(--but-color-line);
	// 	// background-blend-mode: normal, normal, normal;
	// 	background:var(--but-color-line);
	// 	background-blend-mode: normal;
	// 	border-radius: 40rpx;
	// 	font-size: 28rpx;
	// 	color: #ffffff;
	// 	font-weight: bold;
	// 	text-align: center;
	// 	line-height: 80rpx;
	// }
	.next-view > text:nth-child(2) {
	  width: 285rpx;
	  height: 80rpx;
	  background-image: linear-gradient(218deg, #f45243 0%, #eb903f 72%),
	    linear-gradient(269deg, #ff6600 0%, #f5a348 100%),
	    linear-gradient(#f5a348, #f5a348);
		// background:var(--but-color-line);
	  background-blend-mode:normal,normal,normal;
	  border-radius: 40rpx;
	  font-size: 28rpx;
	  color: #ffffff;
	  font-weight: bold;
	  text-align: center;
	  line-height: 80rpx;
	}
	
	/* 服务弹窗 */
	.layer-service {
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  background: #fff;
	  z-index: 20;
	  padding: 40rpx 24rpx 60rpx;
	  border-radius: 20rpx 20rpx 0 0;
	  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	}
	
	.service-cont {
		padding: 20rpx;
		box-sizing: border-box;
	  .change-tab {
	    display: flex;
	    justify-content: space-around;
	    margin-bottom: 30rpx;
	    position: relative;
		.change-tab-item{
			height: 80rpx;
			image {
			  width: 36rpx;
			  height: 36rpx;
			  margin-right: 20rpx;
			}
		}
	    
	    > view:nth-child(1) .active,
	    > view:nth-child(2) .active {
	      display: none; /* 实际用下面的绝对定位条 */
	    }
	
	    > view .active {
	      position: absolute;
	      bottom: -10rpx;
	      width: 80rpx;
	      height: 6rpx;
	      background: var(--primary-color);
	      border-radius: 3rpx;
	    }
	  }
	
	  .tab-cont {
	    .name {
	      margin-bottom: 20rpx;
	    }
	  }
	
	  .l-btn {
	    position: absolute;
	    bottom: 20rpx;
	    left: 24rpx;
	    right: 24rpx;
	    height: 80rpx;
	    background: var(--primary-color);
	    color: white;
	    text-align: center;
	    line-height: 80rpx;
	    border-radius: 40rpx;
	    font-weight: bold;
	  }
	}
	.butBox{
		background:var(--but-color-line) !important;
	}
	/* 底部操作栏 */
	.user-bar {
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	  height: 140rpx;
	  background: #fff;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  padding: 0 24rpx;
	  box-sizing: border-box;
	  z-index: 10;
	  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	.user-bar-item{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	  > view:first-child {
		width: 360rpx;
	    display: flex;
		justify-content: space-evenly;
	    gap: 40rpx;
	    image {
	      width: 48rpx;
	      height: 48rpx;
	      margin-bottom: 10rpx;
	    }
	    text {
	      font-size: 24rpx;
	      color: #333;
	    }
	  }
	
	  > view:last-child {
	    width: 285rpx;
	    height: 80rpx;
	    background-image: linear-gradient(218deg, #f45243 0%, #eb903f 72%),
	      linear-gradient(269deg, #ff6600 0%, #f5a348 100%),
	      linear-gradient(#f5a348, #f5a348);
		// background:var(--but-color-line);
	    background-blend-mode: normal, normal, normal;
	    border-radius: 40rpx;
	    font-size: 28rpx;
	    color: #ffffff;
	    font-weight: bold;
	    text-align: center;
	    line-height: 80rpx;
	  }
	}
	
	/* 其他通用样式（保留）*/
	.wxParse {
	  position: relative;
	  font-size: 28rpx;
	  color: #333333;
	}
</style>