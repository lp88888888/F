<template>
	<view class="page">
		<!-- 顶部筛选 -->
		<view class="header">
			<!-- 日期筛选 -->
			<view class="filter-section">
				<text class="filter-title">日期筛选</text>
				<view class="date-range">
					<view class="segment-picker" @click="handlePickerTime('start')">
						<view class="picker-view">
							<text>{{ startDate || '开始时间' }}</text>
						</view>
					</view>
					<text class="to-text">至</text>
					<view class="segment-picker" @click="handlePickerTime('end')" :class="{ disabled: !startDate }">
						<view class="picker-view">
							<text>{{ endDate || '结束时间' }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 身份筛选 -->
			<!-- <view class="filter-section">
        <text class="filter-title">身份筛选</text>
        <view class="date-range">
          <picker 
            class="segment-picker" 
            mode="selector" 
            range-key="name" 
            :value="identityIndex" 
            :range="identityOptions" 
            @change="onIdentityChange"
          >
            <view class="picker-view">
              <text>{{identityError || '身份筛选'}}</text>
              <image :src="imgUrl + '/wximage/trip-pro/arrow-right-icon.png'" class="arrow-icon"></image>
            </view>
          </picker>
        </view>
      </view> -->

			<!-- 路段筛选（多选入口） -->
			<!-- <view class="filter-section">
				<text class="filter-title">路段筛选</text>
				<view class="segment-picker-route" @click="handleSegmentChange">
					<view v-if="selectedRoutesText.length > 0" class="picker-view-route" v-for="(item, index) in selectedRoutesText" :key="index">
						<text>{{ item }}</text>
					</view>
					<view v-if="!selectedRoutesText.length" class="picker-view">
						<text>{{ segments1[selectedIndex] }}</text>
						<image :src="imgUrl + '/wximage/trip-pro/arrow-right-icon.png'" class="arrow-icon"></image>
					</view>
				</view>
			</view> -->

			<!-- 车辆筛选 v-if="roadId && userType" -->
			<!-- <view class="filter-section">
				<text class="filter-title">车辆筛选</text>
				<view class="segment-picker-route" @click="handleVehicleChange">
					<view v-if="selectedVehiclesText.length <= 3" class="picker-view-route" v-for="(item, index) in selectedVehiclesText" :key="index">
						<text v-if="selectedVehiclesText.length">{{ item }}</text>
					</view>
					<view v-if="selectedVehiclesText.length > 3" class="picker-view-route">
						<text>共{{ selectedVehiclesText.length }}辆</text>
					</view>
					<view v-if="!selectedVehiclesText.length" class="picker-view">
						<text>请选择车辆</text>
						<image :src="imgUrl + '/wximage/trip-pro/arrow-right-icon.png'" class="arrow-icon"></image>
					</view>
				</view>
			</view> -->
		</view>

		<view class="lan"></view>

		<!-- 通行数据卡片 -->
		<view class="tongxindata">
			<view class="header-2">
				<text class="title">通行数据</text>
			</view>

			<view class="data-section">
				<view :class="selectedField === 'shouldPriceTotal' ? 'footer-item-xuanz' : 'footer-item'" data-field="shouldPriceTotal" @click="handleSelect">
					<text class="footer-label">累计应付金额</text>
					<text class="footer-value">{{ shouldPriceTotal || 0 }}</text>
				</view>
				<view :class="selectedField === 'yldjPriceTotal' ? 'data-item-xuanz' : 'data-item'" data-field="yldjPriceTotal" @click="handleSelect">
					<text class="label">累计优惠金额</text>
					<text class="value">{{ yldjPriceTotal || 0 }}</text>
				</view>
			</view>

			<view class="footer">
				<view :class="selectedField === 'actualPriceTotal' ? 'footer-item-xuanz' : 'footer-item'" data-field="actualPriceTotal" @click="handleSelect">
					<text class="footer-label">累计实付金额</text>
					<text class="footer-value">{{ actualPriceTotal || 0 }}</text>
				</view>
				<view :class="selectedField === 'passNumTotal' ? 'data-item-xuanz' : 'data-item'" data-field="passNumTotal" @click="handleSelect">
					<text class="label">累计通行次数</text>
					<text class="value">{{ passNumTotal || 0 }}</text>
				</view>
			</view>
		</view>

		<!-- 趋势图（弹层展开时隐藏） -->
		<view class="tongxindata" v-show="!isPopupVisible">
			<view class="header-2">
				<image :src="imgUrl + '/volumePricing/scsd.png'" class="arrow-icon" />
				<text class="title">累计优惠金额趋势图</text>
			</view>
			<view class="charts">
				<qiun-data-charts
					type="line"
					:chartData="chartData"
					:opts="chartOpts"
					:ontouch="true"
					width="750rpx"
					height="500rpx"
					@rendered="onChartRendered"
				/>
				<view class="legend-box">
					<view class="legend"></view>
					<text>优惠</text>
				</view>
			</view>
		</view>

		<!-- 开始时间选择 -->
		<up-datetime-picker
			v-model="pickerdate"
			:show="showStartPicker"
			mode="date"
			:minDate="31536000000"
			format="YYYY-MM-DD"
			:defaultValue="pickerdate ? Number(new Date(pickerdate)) : Number(new Date())"
			@confirm="handleStartDateConfirm"
			@cancel="showStartPicker = false"
		></up-datetime-picker>

		<!-- 结束时间选择 -->
		<up-datetime-picker
			v-model="pickerdate"
			:show="showEndPicker"
			mode="date"
			format="YYYY-MM-DD"
			:minDate="dateStringToTimestamp(startDate)"
			:maxDate="maxEndDate"
			@confirm="handleEndDateConfirm"
			@cancel="showEndPicker = false"
		></up-datetime-picker>

		<!-- 区间筛选弹窗 -->
		<!-- <view class="overlay" v-show="isPopupVisible" @click="hidePopup"></view> -->
		<up-popup :show="isPopupVisible" mode="bottom" @close="hidePopup">
			<view class="pupop-tab">
				<view class="header-3">
					<text>路段筛选（{{ routesList.length }}）</text>
					<view class="icon-quanxuan" @click="toggleAllSelection">
						<image :src="imgUrl + '/volumePricing/cscfse.png'" class="arrow-icon" />
						全选
					</view>
				</view>
				<view class="segment-list">
					<view
						class="segment-item"
						:class="{ selected: item.checked }"
						v-for="(item, index) in routesList"
						:key="index"
						@click="toggleSelection(index)"
					>
						{{ item.roadName1 }}——{{ item.roadName2 }}
					</view>
				</view>
				<view class="buttons">
					<view class="buttons-1" @click="resetSelection">重置</view>
					<view class="buttons-2" @click="confirmSelection">确定</view>
				</view>
			</view>
		</up-popup>

		<!-- 车辆筛选弹窗 -->
		<!-- <view class="overlay" v-show="isClPopupVisible" @click="hideClPopup"></view> -->
		<up-popup :show="isClPopupVisible" mode="bottom" @close="hideClPopup">
			<view class="pupop-tab">
				<view class="header-3">
					<text>车辆筛选（{{ clroutesList.length }}）</text>
					<view class="icon-quanxuan" @click="toggleAllVehicleSelection">
						<image :src="imgUrl + '/volumePricing/cscfse.png'" class="arrow-icon" />
						全选
					</view>
				</view>

				<view class="segment-list">
					<view
						class="segment-item"
						:class="{ selected: item.checked }"
						v-for="(item, index) in clroutesList"
						:key="index"
						@click="toggleVehicleSelection(index)"
					>
						{{ item.vehicleNumber }}
					</view>
				</view>

				<view class="buttons">
					<view class="buttons-1" @click="resetVehicleSelection">重置</view>
					<view class="buttons-2" @click="confirmVehicleSelection">确定</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { orderStatistics, orderStatisticsDetail, getgaosuluduanlist, vehiclePageByRoadId } from '@/api/volumePricing';
import qiunDataCharts from '../../components/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue';

const imgUrl = ref('https://tranalioss.shanyitong.com');

// ===== 日期相关 =====
const startDate = ref<string>('');
const endDate = ref<string>('');
const showStartPicker = ref(false);
const showEndPicker = ref(false);
const maxEndDate = ref<number>(0);

// 时间戳转日期字符串
const timestampToDateString = (timestamp: number) => {
	if (!timestamp) return '';
	const date = new Date(timestamp);
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 日期字符串转时间戳
const dateStringToTimestamp = (dateStr: string) => {
	if (!dateStr) return 0;
	return new Date(dateStr).getTime();
};

// 计算最大结束日期（时间戳）
const calculateMaxEndDate = (startDateStr: string) => {
	if (!startDateStr) {
		maxEndDate.value = 0;
		return;
	}
	const startDateObj = new Date(startDateStr);
	const maxEndDateObj = new Date(startDateObj);
	maxEndDateObj.setMonth(startDateObj.getMonth() + 1);
	maxEndDate.value = maxEndDateObj.getTime();
};

// ===== 身份筛选 =====
const identityOptions = ref([
	{ id: 0, name: '全部' },
	{ id: 1, name: '个人' },
	{ id: 2, name: '企业' },
]);
const identityIndex = ref(0);
const identityError = ref('');
const userType = ref<number | string>('');

// ===== 路段筛选 =====
const segments1 = ref<string[]>(['请选择区间', '区间A', '区间B', '区间C']);
const selectedIndex = ref(0);
const isPopupVisible = ref(false);
const secList = ref<any[]>([]);
const routesList = ref<any[]>([]);
const selectedRoutesText = ref<string[]>([]);
const roadId = ref<string>('');
const allSelected = ref(false);

// ===== 车辆筛选 =====
const isClPopupVisible = ref(false);
const carlist = ref<any[]>([]);
const clroutesList = ref<any[]>([]);
const selectedVehiclesText = ref<string[]>([]);

// ===== 通行数据 =====
const selectedField = ref('yldjPriceTotal');
const shouldPriceTotal = ref<number | string>('');
const yldjPriceTotal = ref<number | string>('');
const actualPriceTotal = ref<number | string>('');
const passNumTotal = ref<number | string>('');

// ===== 图表数据 =====
const chartData = ref({
	categories: [],
	series: [
		{
			name: '',
			data: [],
		},
	],
});

const chartOpts = ref({
	color: ['#D75763'],
	padding: [15, 0, 0, 0],
	legend: {
		show: false,
	},
	enableScroll: true,
	touchMoveLimit: 24,
	xAxis: {
		gridColor: '#EEEEEE',
		rotateLabel: true,
		itemCount: 6,
		scrollShow: true,
		scrollAlign: 'left',
		marginTop: 10,
	},
	yAxis: {
		gridColor: '#EEEEEE',
		format: (val: number) => `${val}元`,
	},
	extra: {
		scroll: {
			enable: true,
			itemCount: 6,
		},
	},
});

const onChartRendered = (e: any) => {
	console.log('图表渲染完成', e);
};

const pickerdate = ref('');
const handlePickerTime = (type) => {
	if (type === 'start') {
		pickerdate.value = startDate.value ? Number(new Date(startDate.value)) : Number(new Date());
		showStartPicker.value = true;
	} else {
		pickerdate.value = endDate.value;
		showEndPicker.value = true;
	}
};

// ===== 日期选择事件 =====
const handleStartDateConfirm = (e) => {
	if (!e || !e.value) {
		showStartPicker.value = false;
		return;
	}
	console.log('选择的开始时间', e);
	const timestamp = e.value;
	const selectedStartDate = timestampToDateString(timestamp);
	calculateMaxEndDate(selectedStartDate);

	let end = endDate.value;
	if (end && new Date(end) > new Date(maxEndDate.value)) {
		end = '';
		uni.showToast({
			title: '结束时间不能超过开始时间后一个月',
			icon: 'none',
		});
	}

	startDate.value = selectedStartDate;
	endDate.value = end;
	showStartPicker.value = false;
};

const handleEndDateConfirm = (e) => {
	if (!e || !e.value) {
		showEndPicker.value = false;
		return;
	}
	console.log('选择的结束时间', e);
	const timestamp = e.value;
	const selectedEndDate = timestampToDateString(timestamp);
	const startDateObj = new Date(startDate.value);
	const endDateObj = new Date(selectedEndDate);

	if (endDateObj < startDateObj) {
		uni.showToast({
			title: '结束时间不能早于开始时间',
			icon: 'none',
		});
		showEndPicker.value = false;
		return;
	}

	const maxEndDateObj = new Date(startDateObj);
	maxEndDateObj.setMonth(startDateObj.getMonth() + 1);
	if (endDateObj > maxEndDateObj) {
		uni.showToast({
			title: '选择范围不能超过一个月',
			icon: 'none',
		});
		showEndPicker.value = false;
		return;
	}

	endDate.value = selectedEndDate;
	showEndPicker.value = false;
	getorderStatistics();
	getorderStatisticsDetail();
};

// ===== 身份筛选 =====
const onIdentityChange = (e: any) => {
	const index = e.detail.value;
	const list = identityOptions.value[index];
	identityError.value = list.name;
	userType.value = list.id;
	getcarlist();
	getorderStatistics();
	getorderStatisticsDetail();
};

// ===== 路段筛选 =====
const getyldjHighSpeedRoad = async () => {
	try {
		const params = { highId: 1 };
		const res = await getgaosuluduanlist(params);
		const originalRoutes = res.clazz || [];
		const checkedRoutes = originalRoutes.map((route: any) => ({
			...route,
			checked: false,
		}));
		secList.value = originalRoutes;
		routesList.value = checkedRoutes;
		selectedRoutesText.value = [];
	} catch (error) {
		console.error('获取路段列表失败', error);
	}
};

const handleSegmentChange = () => {
	if (secList.value.length === 0) {
		uni.showToast({
			title: '请申请区间',
			icon: 'none',
		});
		return;
	}
	isPopupVisible.value = true;
};

const toggleSelection = (index: number) => {
	routesList.value[index].checked = !routesList.value[index].checked;
};

const toggleAllSelection = () => {
	const next = !allSelected.value;
	routesList.value.forEach((s: any) => (s.checked = next));
	allSelected.value = next;
};

const resetSelection = () => {
	routesList.value.forEach((s: any) => (s.checked = false));
	allSelected.value = false;
};

const confirmSelection = () => {
	const selectedRoutes = routesList.value.filter((route: any) => route.checked);
	const selectedRoutesText1 = selectedRoutes.map((route: any) => `${route.roadName1}——${route.roadName2}`);
	const selectedRoutesId = selectedRoutes.map((route: any) => route.id);
	roadId.value = selectedRoutesId.join(',');
	selectedRoutesText.value = selectedRoutesText1;
	isPopupVisible.value = false;

	getcarlist();
	getorderStatistics();
	getorderStatisticsDetail();

	console.log('已选区间文本:', selectedRoutesText.value);
	console.log('已选区间id:', selectedRoutesId);
};

const hidePopup = () => {
	isPopupVisible.value = false;
};

// ===== 车辆筛选 =====
const getcarlist = async () => {
	try {
		const params = {
			pageNum: '1',
			pageSize: '10000',
			bindType: userType.value == 1 ? '01' : '02',
			roadId: roadId.value,
		};
		const res = await vehiclePageByRoadId(params);
		const originalRoutes = res.page?.records || [];
		const checkedRoutes = originalRoutes.map((route: any) => ({
			...route,
			checked: false,
		}));
		carlist.value = originalRoutes;
		clroutesList.value = checkedRoutes;
		selectedVehiclesText.value = [];
	} catch (error) {
		console.error('获取车辆列表失败', error);
	}
};

const handleVehicleChange = () => {
	isClPopupVisible.value = true;
};

const toggleVehicleSelection = (index: number) => {
	clroutesList.value[index].checked = !clroutesList.value[index].checked;
};

const toggleAllVehicleSelection = () => {
	const next = !allSelected.value;
	clroutesList.value.forEach((s: any) => (s.checked = next));
	allSelected.value = next;
};

const resetVehicleSelection = () => {
	clroutesList.value.forEach((s: any) => (s.checked = false));
	allSelected.value = false;
};

const confirmVehicleSelection = () => {
	const selectedVehicles = clroutesList.value.filter((vehicle: any) => vehicle.checked);
	const selectedVehiclesText = selectedVehicles.map((vehicle: any) => vehicle.vehicleNumber);
	selectedVehiclesText.value = selectedVehiclesText;
	isClPopupVisible.value = false;

	getorderStatistics();
	getorderStatisticsDetail();

	console.log('已选车辆文本:', selectedVehiclesText);
};

const hideClPopup = () => {
	isClPopupVisible.value = false;
};

// ===== 通行数据 =====
const getorderStatistics = async () => {
	try {
		const params = {
			startTime: startDate.value,
			endTime: endDate.value,
			userType: userType.value || '',
			secIds: roadId.value ? roadId.value.split(',') : [],
			vehicleNumber: selectedVehiclesText.value,
		};
		const res = await orderStatistics(params);
		console.log('通行数据', res);
		const data = res.clazz || {};
		shouldPriceTotal.value = data.shouldPriceTotal || '';
		yldjPriceTotal.value = data.yldjPriceTotal || '';
		actualPriceTotal.value = data.actualPriceTotal || '';
		passNumTotal.value = data.passNumTotal || '';
	} catch (error) {
		console.error('获取通行数据失败', error);
	}
};

// ===== 趋势图数据 =====
const getorderStatisticsDetail = async () => {
	try {
		const params = {
			startTime: startDate.value,
			endTime: endDate.value,
			userType: userType.value || '',
			secIds: roadId.value ? roadId.value.split(',') : [],
			vehicleNumber: selectedVehiclesText.value,
		};
		const res = await orderStatisticsDetail(params);
		console.log('趋势图数据', res);
		const data = res.clazz;
		if (data && data.times && data.yldjPriceTotals) {
			chartData.value = {
				categories: data.times,
				series: [
					{
						name: '优惠',
						data: data.yldjPriceTotals,
					},
				],
			};
		}
	} catch (error) {
		console.error('获取趋势图数据失败', error);
	}
};

// ===== 选中事件 =====
const handleSelect = (e: any) => {
	const field = e.currentTarget.dataset.field;
	const newSelectedField = selectedField.value === field ? '' : field;
	selectedField.value = newSelectedField;
};

onMounted(() => {
	getorderStatistics();
	getorderStatisticsDetail();
	getyldjHighSpeedRoad();
});
</script>

<style lang="scss" scoped>
.page {
	background-color: #fff;
	min-height: 100vh;
}

.header {
	padding: 30rpx;
}

.filter-section {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.filter-title {
	font-size: 28rpx;
	color: #080912;
	margin-right: 50rpx;
	min-width: 112rpx;
}

.date-range {
	display: flex;
	align-items: center;
}

.segment-picker {
	width: 199rpx;
	height: 54rpx;
	background-color: #f5f5f5;
	border-radius: 8rpx;
	padding-left: 10rpx;
	box-sizing: border-box;
	font-size: 26rpx;
	color: #a2a2a2;
}

.segment-picker.disabled {
	opacity: 0.5;
	pointer-events: none;
}

.picker-view {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 180rpx;
	font-size: 26rpx;
	color: #a2a2a2;
	background-color: #f5f5f5;
	padding: 8rpx 12rpx;
}

.segment-picker-route {
	margin-right: 30rpx;
}

.picker-view-route {
	display: inline-block;
	height: 54rpx;
	line-height: 54rpx;
	box-sizing: border-box;
	background-color: #f5f5f5;
	border-radius: 8rpx;
	padding: 0 10rpx;
	font-size: 26rpx;
	color: #a2a2a2;
	margin-right: 20rpx;
	margin-bottom: 10rpx;
}

.to-text {
	font-size: 30rpx;
	color: #666;
	margin: 0 20rpx;
}

.arrow-icon {
	width: 30rpx;
	height: 30rpx;
	margin-left: 10rpx;
}

.lan {
	width: 100%;
	height: 8rpx;
	background: #f7f7f7;
}

.tongxindata {
	width: 750rpx;
	padding: 32rpx;
	box-sizing: border-box;
}

.header-2 {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.title {
	font-size: 32rpx;
	color: #333;
	font-weight: 700;
	margin-right: 20rpx;
}

.data-section {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.data-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 10rpx;
	border: 2rpx solid #e6e6e7;
	width: 256rpx;
	height: 144rpx;
}

.data-item-xuanz {
	background: #fef5f0;
	border: 1rpx solid #ff6503;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 10rpx;
	width: 256rpx;
	height: 144rpx;
}

.label {
	font-size: 26rpx;
	color: #000000;
	margin-bottom: 10rpx;
}

.value {
	font-size: 36rpx;
	color: #000000;
}

.footer {
	display: flex;
	justify-content: space-between;
}

.footer-item {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	border-radius: 10rpx;
	width: 410rpx;
	height: 144rpx;
	border: 2rpx solid #e6e6e7;
}

.footer-item-xuanz {
	background: #fef5f0;
	border: 1rpx solid #ff6503;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 10rpx;
	width: 410rpx;
	height: 144rpx;
}

.footer-label {
	font-size: 26rpx;
	color: #000000;
	margin-bottom: 10rpx;
}

.footer-value {
	font-size: 36rpx;
	color: #000000;
}

.charts {
	width: 100%;
	height: 500rpx;
}

.legend-box {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #515151;
	font-size: 22rpx;
}

.legend {
	width: 56rpx;
	height: 10rpx;
	border-radius: 2rpx;
	background: #d75763;
	margin-right: 14rpx;
}

.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
}

.pupop-tab {
	padding: 20rpx;
	// position: fixed;
	// bottom: 0;
	// left: 0;
	// right: 0;
	// z-index: 9993;
	background-color: #fff;
	border-radius: 24rpx 24rpx 0px 0px;
	box-sizing: border-box;
}

.header-3 {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	margin-top: 20rpx;
}

.icon-quanxuan {
	display: flex;
	align-items: center;
}

.segment-list {
	margin-bottom: 50rpx;
	margin-top: 30rpx;
}

.segment-item {
	box-sizing: border-box;
	width: 100%;
	font-size: 26rpx;
	color: #333;
	background-color: #f0f0f0;
	padding: 10rpx 20rpx;
	margin-bottom: 30rpx;
	border-radius: 10rpx;
}

.segment-item.selected {
	box-sizing: border-box;
	background: #fff0ec;
	border: 2rpx solid #ff6503;
}

.buttons {
	display: flex;
	align-items: center;
	justify-content: space-around;
	margin-bottom: 50rpx;
}

.buttons-1 {
	text-align: center;
	line-height: 96rpx;
	width: 280rpx;
	height: 96rpx;
	border-radius: 64rpx;
	opacity: 1;
	background: #fffbf6;
	box-sizing: border-box;
	border: 1rpx solid #ff9000;
	color: #333;
	font-size: 32rpx;
}

.buttons-2 {
	text-align: center;
	line-height: 96rpx;
	width: 280rpx;
	height: 96rpx;
	border-radius: 64rpx;
	opacity: 1;
	background: #ff9000;
	box-sizing: border-box;
	color: #fff;
	font-size: 32rpx;
}
</style>