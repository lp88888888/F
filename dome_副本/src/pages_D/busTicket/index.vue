<template>
	<view class="box" :data-theme="pageTheme">
		<!-- <cos-header title='预约' :background-color="backgroundColor" :font-color="fontColor"
			:defaultNavBarheight="90"></cos-header> -->
			<up-navbar title="预约" :bgColor="backgroundColor" autoBack placeholder :fixed="true"></up-navbar>
		<view style="background: #F8F9FB;flex: 1;">
			<image :src="imgUrl+'busTicket_newbg.png'" mode="widthFix" class="location-img"></image>
			<view class="container">
				<view class="container-header">
					<!-- 出发地和目的地 -->
					<view class="location-container">
						<view class="location-item">
							<view class="location-subtitle">出发地</view>
							<view class="location-dizhi" @click="() => busStationFun(1)">
								<view class="location-title">{{ startPlace.name || '选择出发地' }}</view>
								<image :src="imgUrl+'rentCar-iocn4.png'" mode="widthFix" class="icon"></image>
							</view>
						</view>
						<view class="busTicket-ca" @click="transformation()">
							<image :src="imgUrl+'busTicket-car.png'" mode="widthFix" class="swap-icon"></image>
						</view>
						<view class="location-item">
							<view class="location-subtitle">目的地</view>
							<view class="location-dizhi" @click="() => dataFun()">
								<view class="location-title">{{ endPlace.name || '选择目的地' }}</view>
								<image :src="imgUrl+'rentCar-iocn4.png'" mode="widthFix" class="icon"></image>
							</view>
						</view>
					</view>

					<!-- 日期选择 -->
					<view class="date-container" @click="chooseDate">
						<text>{{ selectedDate }}</text>
						<!-- <text class="date-text"> 周四</text> -->
					</view>

					<!-- 历史记录 -->
					<view class="history-container" v-if="historyRecords.length > 0">
						<view class="history-container-left">
							<view v-for="(history, index) in historyRecords" :key="index" class="history-item" @click="historyHq(history)">
								<text>{{ history.startStationName }}-{{ history.reachStationName }}</text>
							</view>
						</view>

						<view class="clear-history" @click="clearHistory">清除</view>
					</view>
					<!-- 查询车票按钮 -->
					<button class="search-button" @click="trainTicket()">查询车票</button>
				<!-- 	<button class="search-button" @click="toNav('/pages_D/busTicket/queryCar')">查询车票</button> -->

					<!-- 查看订单按钮 -->
				<!-- 	<view class="order-container" @click="toNav('/pages_D/busTicket/list')">
						<image src="/static/icons/order.png" mode="widthFix" class="order-icon"></image>
						<view class="order-text">
							<image :src="imgUrl+'busTicket-ckdd.png'" mode="widthFix" class="icon"></image>
							查看订单
						</view>
					</view> -->
				</view>
				<image :src="imgUrl+'busTicket-foot.png'" mode="widthFix" class="location-img"></image>
			</view>
		</view>
		<!-- 选择位置 -->
		<view class="box">
				<!-- 选择位置弹窗 -->
				<up-popup 
					:show="stationPopupShow" 
					mode="bottom" 
					@close="stationPopupShow=false"  
					round='20' 
					:customStyle="popupStyle"
				>
					<view class="station-select-container">
						<view class="station-header">
							<text class="station-title">{{flagP == 1 ? '选择出发地' : '选择目的地' }}</text>
							<text class="station-close" @click="stationPopupShow = false">×</text>
						</view>
						<!-- 左侧列表区域 -->
						<view class="station-content">
							<scroll-view class="list-scroll" scroll-y :scroll-into-view="scrollToId" scroll-with-animation>
								<!-- 循环渲染分组（按类型 H/X 分组） -->
								<view v-for="(group, key) in groupedData" :key="key" :id="'group-' + key">
									<!-- 分组标题（如 H、X） -->
									<view class="group-title">{{ key }} 类站点</view>
									<!-- 分组内的站点项 -->
									<view class="list-item" v-for="(item, idx) in group" :key="idx"
										@click="selectStation(item)">
										<!-- 站点名称 -->
										<text class="item-name">{{ item.name }}</text>
										<!-- 站点区域 -->
										<text class="item-area">{{ item.areaName }}</text>
									</view>
								</view>
							</scroll-view>
		
							<!-- 右侧索引栏 -->
							<view class="index-bar">
								<text class="index-item" v-for="(indexKey, idx) in indexKeys" :key="idx"
									@click="scrollToGroup(indexKey)">
									{{ indexKey }}
								</text>
							</view>
						</view>
					</view>
				</up-popup>
				<!-- 其他代码不变 -->
			</view>
		<!-- 日历 -->
		<up-calendar :show="isshow" :mode="single" :min-date="minDate" 
		:max-date="maxDate" @confirm="confirm" @close="isshow = false" :color="themeStore.themeColors.$color" ></up-calendar>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { imgUrl } from '@/config';
	import { toNav } from '@/utils/route';
	import { onLoad } from '@dcloudio/uni-app';
	import CosHeader from '@/components/customNavBar/index.vue';
	import {timeFormat} from '@/uni_modules/uview-plus';
	import { busStation,history,historyClean } from '@/api/busticket';
	import { useBusTicketStore } from '../../stores/busTicket'
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const busTicketStore = useBusTicketStore()
	const popupStyle = ref({
			maxHeight: '80vh', // 最大高度为视口高度的80%
			minHeight: '50vh', // 最小高度为视口高度的50%
			height: 'auto' // 高度自适应内容
		});
	// 定义类型接口
	interface BusStation {
		stationCode : string;
		name : string;
		secondName : string | null;
		stationLvl : string;
		county : string;
		city : string;
		province : string;
		orgCode : string;
		areaCode : string;
		areaName : string;
	}

	interface StationGroup {
		type : string;
		busStationList : BusStation[];
	}

	interface SelectedPlace {
		name : string;
		code : string;
	}

	// 导航栏样式
	const backgroundColor = ref<string>('#A1E6E3');
	const fontColor = ref<string>('#000');
	const navBarHeight = ref(0);

	// 站点数据相关
	const groupedData = ref<Record<string, BusStation[]>>({}); // 按类型分组后的数据
	const indexKeys = ref<string[]>([]); // 右侧索引栏的类型列表
	const scrollToId = ref(''); // 滚动到的分组ID
	const stationData = ref<StationGroup[]>([]); // 原始接口数据
    const newStationData = ref<string[]>([]); 
	// 选择的地点
	const startPlace = ref<SelectedPlace>({ name: '', code: '' });
	const endPlace = ref<SelectedPlace>({ name: '', code: '' });
	const isStartPlace = ref<boolean>(true); // 是否选择出发地
	const stationPopupShow = ref<boolean>(false); // 站点选择弹窗显示状态
    const typePlace= ref('');
	// 日期和历史记录
	const isshow= ref<boolean>(false); 
	const selectedDate = ref<string>('');
	const timestamp = ref(new Date());
	const historyRecords = ref([]);
	const today = new Date();
	// 最小日期：今天
	const minDate = timeFormat(today, 'yyyy-mm-dd');
	
	// 最大日期：+7天
	const maxDate = (() => {
	  const d = new Date(today);
	  d.setDate(today.getDate() + 14);
	  return timeFormat(d, 'yyyy-mm-dd');
	})();
	// 清除历史记录
	const clearHistory=async()=>{
		const res = await historyClean();
		if(res.data==true){
			historyRecords.value = [];
		}
	};

	// 选择日期（可扩展为日期选择器）
	const chooseDate = () => {
		isshow.value=true
	};
	const confirm = (e) => {
		 const date = e[0]
		selectedDate.value=date
		isshow.value=false
		busTicketStore.setSelectedDate(date)
	};
	const flagP = ref(1)
	// 获取站点数据
	const busStationFun = async (flag : string | number) => {
		flagP.value = 1
		stationData.value=[]
		typePlace.value=flag
		// 标记是选择出发地还是目的地
		isStartPlace.value = flag === 1;
		try {
			const params = { startingFlag: flag };
			const res = await busStation(params);
			if (res.code === 200 && res.data) {
				stationData.value = res.data;
				// 处理数据分组
				groupDataByType();
				// 显示弹窗
				stationPopupShow.value = true;
			}
		} catch (error) {
			console.error('获取站点数据失败：', error);
			uni.showToast({ title: '获取站点失败', icon: 'none' });
		}
	};
	// 获取站点数据
	const busStationData = async (flag : string | number) => {
		// 标记是选择出发地还是目的地
		isStartPlace.value = 0
		try {
			const params = { startingFlag: flag };
			const res = await busStation(params);
			if (res.code === 200 && res.data) {
				newStationData.value = res.data;
			}
		} catch (error) {
			console.error('获取站点数据失败：', error);
			uni.showToast({ title: '获取站点失败', icon: 'none' });
		}
	};
    const dataFun=()=>{
		flagP.value = 2
		typePlace.value=2
		stationData.value=newStationData.value 
		groupDataByType();
		scrollToId.value=''
		stationPopupShow.value = true;
	}
	// 按类型（H/X）分组数据
	const groupDataByType = () => {
		const groups : Record<string, BusStation[]> = {};
		stationData.value.forEach((item) => {
			// 以type作为分组键
			groups[item.type] = item.busStationList;
		});
		// 生成索引栏（按类型排序）
		indexKeys.value = Object.keys(groups).sort();
		groupedData.value = groups;
	};

	// 点击索引，滚动到对应分组
	const scrollToGroup = (key : string) => {
		scrollToId.value = `group-${key}`;
	};

	// 选择站点
	const selectStation = (item : BusStation) => {
		if (typePlace.value==1) {
			const place = { name: item.name, code: item.stationCode}
			 busTicketStore.setStartPlace(place)
			startPlace.value = place
		} else {
			const place = { name: item.name, code: item.orgCode}
			 busTicketStore.setEndPlace(place)
			 endPlace.value = place  
		}
		// 隐藏弹窗
		stationPopupShow.value = false;
		// 添加到历史记录（去重）
	};
	
	// 历史记录点击
	  const	historyHq=(item:any)=>{
		  console.log('disanji', item);
		  const place = { name: item.startStationName, code: item.startStationCode}
		  const placeReach = { name: item.reachStationName, code: item.reachStationCode}
		  busTicketStore.setStartPlace(place)
		  busTicketStore.setEndPlace(placeReach)
		  startPlace.value = place
		  endPlace.value = placeReach
	  }
	//转换
		const transformation=()=>{
			const place = busTicketStore.endPlace
			const placeReach = busTicketStore.startPlace
			busTicketStore.setStartPlace(place)
			busTicketStore.setEndPlace(placeReach)
			startPlace.value = place
			endPlace.value = placeReach
		}
	
  const trainTicket=()=>{
	  if(!startPlace.value.name){
		  uni.showToast({ title: '请选择出发地', icon: 'none' });
		   return
	  }else if(!endPlace.value.name){
		  uni.showToast({ title: '请选选择目的地', icon: 'none' });
		  return
	  }
	  uni.navigateTo({
		  url: "/pages_D/busTicket/queryCar"
	  })
  }
  const historyFun=async()=>{
	  const res = await history();
	  historyRecords.value=res.data
  }
  const calendarColor = computed(() => {
  	const themeName = uni.getStorageSync('app-theme') || 'default';
  	switch (themeName) {
  		case 'green':
  			return '#628F2F';
  		case 'blue':
  			return '#5FAFFF';
  		case 'orange':
  		default:
  			return '#FF9F0F'; // 默认橙色
  	}
  });
  
	// 生命周期
	onMounted(() => {
		// 获取系统信息计算导航栏高度
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44;
		selectedDate.value =timeFormat(timestamp.value,'yyyy-mm-dd');
		busStationData(0)
	});

	onLoad(() => {
		// 页面加载时的逻辑
		console.log('页面加载完成');
		historyFun()
	});
</script>

<style scoped lang="scss">
	.box {
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.container {
		margin-top: -100rpx;
		padding: 20rpx 32rpx;
		position: relative;
		z-index: 2;
	}

	.container-header {
		background: #fff;
		border-radius: 24rpx;
		padding: 20rpx 30rpx 0;
		margin-bottom: 30rpx;
	}

	.location-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
		padding: 0 20rpx;
	}

	.busTicket-ca {
		width: 20%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.location-item {
		width: 40%;
	}

	.location-subtitle {
		font-size: 24rpx;
		color: #999999;
		text-align: left;
		margin-top: 24rpx;
		margin-bottom: 20rpx;
	}

	.location-dizhi {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.location-title {
		font-size: 36rpx;
		color: #333333;
		text-align: left;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
	}

	.swap-icon {
		width: 50rpx;
		height: 45rpx;
		padding-top: 90rpx;
	}

	.date-container {
		margin-bottom: 40rpx;
		display: flex;
		font-size: 36rpx;
		color: #333333;
		align-items: center;
		gap: 10rpx;
		padding: 0 20rpx;
	}

	.date-text {
		font-size: 24rpx;
		color: #666666;
	}

	.history-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40rpx;
		padding: 0 20rpx;
	}

	.history-container-left {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 20rpx;
		flex: 1;
	}

	.history-item {
		padding: 5rpx 20rpx;
		text-align: center;
		line-height: 48rpx;
		background: #EAF1FF;
		border-radius: 64rpx;
		font-size: 24rpx;
		color: #4788FA;
	}

	.clear-history {
		font-size: 28rpx;
		color: #333;
		text-align: right;
		margin-left: 20rpx;
	}

	.search-button {
		width: 100%;
		height: 85rpx;
		background: var(--but-color-line);
		border-radius: 48rpx;
		color: #fff;
		font-size: 34rpx;
		margin: 50rpx auto;
		line-height: 85rpx;
		text-align: center;
		border: none;
	}

	.order-container {
		text-align: center;
		padding: 30rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1rpx solid #EAEAEA;
	}

	.order-icon {
		width: 26rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}

	.order-text {
		display: flex;
		align-items: center;
		gap: 10rpx;
		font-size: 28rpx;
		color: #333333;
	}

	.icon {
		width: 36rpx;
		height: 36rpx;
	}

	.location-img {
		width: 100%;
		height: auto;
	}

	.station-select-container {
			height: 100%; // 继承弹窗的高度
			display: flex;
			flex-direction: column;
			background: #fff;
			border-top-right-radius: 20rpx;
			border-top-left-radius: 20rpx;
		}
	
		.station-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 30rpx;
			border-bottom: 1rpx solid #eee;
		}
	
		.station-title {
			font-size: 32rpx;
			color: #333;
			font-weight: bold;
		}
	
		.station-close {
			font-size: 40rpx;
			color: #999;
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	
		.station-content {
			flex: 1; // 占满剩余高度，实现滚动
			position: relative;
			min-height: 0; // 解决flex子元素滚动问题
		}
	
		.list-scroll {
			height: 100vh;
			width: 100%;
			/* 调整内边距：原60rpx → 80rpx，为滚动条留出10rpx空间，索引栏留60rpx */
			padding-right: 80rpx; 
			/* 强制显示滚动条（部分平台默认隐藏） */
			overflow-y: scroll;
			/* 滚动条样式的兼容性前缀（针对不同浏览器/小程序内核） */
			scrollbar-width: thin; /* 火狐：细滚动条 */
			-ms-overflow-style: auto; /* IE/Edge：默认样式 */
		}
	
		/* ========== 自定义滚动条样式（webkit内核：微信小程序、H5、Chrome等） ========== */
		/* 滚动条整体 */
		.list-scroll::-webkit-scrollbar {
			/* 滚动条宽度（垂直滚动条：width；水平滚动条：height） */
			width: 6rpx; 
			/* 滚动条与内容的间距（避免与索引栏重叠） */
			margin-right: 10rpx;
		}
	
		/* 滚动条轨道（背景） */
		.list-scroll::-webkit-scrollbar-track {
			/* 轨道背景色 */
			background: #f5f5f5; 
			/* 轨道圆角 */
			border-radius: 3rpx;
		}
	
		/* 滚动条滑块（可拖动的部分） */
		.list-scroll::-webkit-scrollbar-thumb {
			/* 滑块背景色（与主题色匹配） */
			background: #A1E6E3; 
			/* 滑块圆角 */
			border-radius: 3rpx;
			/* 滑块hover效果 */
			transition: background 0.2s;
		}
	
		/* 滑块hover时的样式 */
		.list-scroll::-webkit-scrollbar-thumb:hover {
			background: #7fd9d6;
		}
	
		.group-title {
			padding: 16rpx 20rpx;
			background: #f5f5f5;
			font-size: 24rpx;
			color: #888;
			font-weight: bold;
		}
	
		.list-item {
			display: flex;
			flex-direction: column;
			padding: 20rpx;
			border-bottom: 1px solid #eee;
		}
	
		.item-name {
			font-size: 30rpx;
			color: #333;
			margin-bottom: 8rpx;
		}
	
		.item-area {
			font-size: 24rpx;
			color: #999;
		}
	
		.index-bar {
			/* 索引栏位置：右10rpx → 右20rpx，避开滚动条 */
			position: absolute;
			right: 20rpx; 
			top: 35%;
			transform: translateY(-50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			/* 确保索引栏在滚动条上方 */
			z-index: 1;
		}
	
		.index-item {
			font-size: 24rpx;
			padding: 4rpx;
			color: #666;
			cursor: pointer;
			width: 40rpx;
			text-align: center;
		}
	
		.index-item:active {
			color: #A1E6E3;
			font-weight: bold;
		}
</style>