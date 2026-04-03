<template>
	<view class="searchTop" :data-theme="pageTheme" :class="{isfixed:isFixed}">
		<!-- <cos-header title="充电桩查询" :background-color="themeStore.themeColors.$pageBBgColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="90"></cos-header> -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="充电桩查询" bgColor="transparent" @leftClick="toBack" placeholder
					:fixed="true"></up-navbar>
				<view class="search">
					<up-search placeholder="请输入充电站名称或地址" v-model="keyword" @change="onSearch" @close="onSearch"
						placeholderColor="#999999" shape="round" bgColor='#fff' :showAction="false"
						height="36"></up-search>
				</view>
				<view class="searchIcons flex-alims-cen">
					<view class="searchIcons-item flex-alims-cen" @click="categoryFun('1')">
						<text>{{textValue(1)}}</text>
						<up-icon name="arrow-down" size="11"></up-icon>
					</view>
					<view class="searchIcons-item flex-alims-cen" @click="categoryFun('2')">
						<text>{{textValue(2)}}</text>
						<up-icon name="arrow-down" size="11"></up-icon>
					</view>
					<view class="searchIcons-item flex-alims-cen" @click="categoryFun('3')">
						<text>{{textValue(3)}}</text>
						<up-icon name="arrow-down" size="11"></up-icon>
					</view>
					<view class="searchIcons-item flex-alims-cen" @click="categoryFun('4')">
						<text>{{textValue(4)}}</text>
						<up-icon name="arrow-down" size="11"></up-icon>
					</view>
				</view>
				<view class="category" v-if="iscategory">
					<view v-if="typeIndex == '1'">
						<view :class="['labelBox',serindex1 == index?'active':'']" v-for="(item,index) in opticons1"
							:key="index" @click="cateChange(1,index)">{{item.name}}</view>
					</view>
					<view v-if="typeIndex == '2'">
						<view :class="['labelBox',serindex2 == index?'active':'']" v-for="(item,index) in opticons2"
							:key="index" @click="cateChange(2,index)">{{item.name}}</view>
					</view>
					<view v-if="typeIndex == '3'">
						<view :class="['labelBox',serindex3 == index?'active':'']" v-for="(item,index) in opticons3"
							:key="index" @click="cateChange(3,index)">{{item.name}}</view>
					</view>
					<view v-if="typeIndex == '4'">
						<view :class="['labelBox',serindex4 == index?'active':'']" v-for="(item,index) in opticons4"
							:key="index" @click="cateChange(4,index)">{{item.name}}</view>
					</view>
				</view>
			</view>


		</u-sticky>

	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import theme from '@/utils/theme';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { toNav, toBack } from '@/utils/route';
	const props = defineProps({
		isFixed: {
			type: Boolean,
			default: false,
		},
		boxHeight: {
			type: String,
			default: ''
		},
	});

	const navBarHeight = ref(0);
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	interface changeObj {
		stationName : string;
		stationStatus : number | string;
	}
	watch(
		() => props.boxHeight,
		(newVal, oldVal) => {
			if (newVal == 1300) {
				iscategory.value = false
			}
		}
	)
	const emit = defineEmits<{
		(e : 'change', obj : changeObj) : void;
	}>();
	const pickerShow = ref(false);
	const selectType = ref<string | number>('1');
	const iscategory = ref(false)
	const stationStatus = ref<number | string>('');
	const opticons1 = ref([
		{ name: '全部', value: '' },
		{ name: '快充', value: 1 },
		{ name: '慢充', value: 0 },
	]);
	const opticons2 = ref([
		{ name: '全部', value: '' },
		{ name: '空闲', value: 0 },
		{ name: '占用', value: 1 },
	]);
	// 0=未知，1=建设中，5=关闭 6:维护中 50:正常使⽤
	const opticons3 = ref([
		{ name: '全部', value: '' },
		{ name: '未知', value: 0 },
		{ name: '建设中', value: 1 },
		{ name: '关闭', value: 5 },
		{ name: '维护中', value: 6 },
		{ name: '营业中', value: 50 },
	]);
	const opticons4 = ref([
		{ name: '全部', value: '' },
		{ name: '50km', value: 0 },
		{ name: '100km', value: 1 },
		{ name: '200km', value: 2 },
	]);
	const serindex1 = ref(0)
	const serindex2 = ref(0)
	const serindex3 = ref(0)
	const serindex4 = ref(0)

	const columns = []
	const keyword = ref('');
	const typeIndex = ref('');
	const categoryFun = (type) => {
		typeIndex.value = type;
		iscategory.value = !iscategory.value
		if (iscategory.value) {
			emit('onAction')
		}
	}
	const cateChange = (type, index) => {
		if (type == 1) {
			serindex1.value = index
		}
		if (type == 2) {
			serindex2.value = index
		}
		if (type == 3) {

			serindex3.value = index
		}
		if (type == 4) {

			serindex4.value = index
		}
		onSearch()
		iscategory.value = false
	}
	const textValue = computed(() => {
		return (type) => {
			if (type == 1) {
				if (serindex1.value == '') return '功率'
				else return opticons1.value[serindex1.value].name
			}
			if (type == 2) {
				if (serindex2.value == '') return '充电状态'
				else return opticons2.value[serindex2.value].name
			}
			if (type == 3) {
				if (serindex3.value == '') return '站点状态'
				else return opticons3.value[serindex3.value].name
			}
			if (type == 4) {
				if (serindex4.value == '') return '距离'
				else return opticons4.value[serindex4.value].name
			}

		}
	})
	const selectClaick = (type : string | number) => {
		selectType.value = type;
		if (type === '1') {
			columns.value = [opticons1.value];
		}
	}
	const prickClose = () => {
		pickerShow.value = false;
	}
	const prickConfirm = (e) => {
		console.log(e);
		// pickerShow.value = false;
	}
	const onSearch = (e : string) => {
		// keyword.value = e;
		changeSearch();
	}
	const changeSearch = () => {
		emit('change', {
			stationName: keyword.value,
			power: opticons1.value[serindex1.value].value,
			chargingStatus: opticons2.value[serindex2.value].value,
			stationStatus: opticons3.value[serindex3.value].value,
			distanceRange: opticons4.value[serindex4.value].value,
		});
	}
</script>

<style lang="scss" scoped>
	.searchView {
		width: 750rpx;
		background: var(--head-color);
		// background: red;
	}

	.isfixed {
		position: absolute;
		top: 0;
		left: 0;
	}

	.active {
		color: var(--primary-color);
	}

	.labelBox {
		padding: 25rpx 32rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}

	.searchTop {
		width: 100%;
		background: var(--linear-color);
		// padding-bottom: 32rpx;
		padding:0 0 32rpx 0 !important;
		box-sizing: border-box;
		// padding-left: 32rpx;

		.search {
			width: 710rpx;
			display: flex;
			align-items: center;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			padding: 0 20rpx;
		}

		.searchIcons {
			width: 100%;
			padding-top: 28rpx;
			padding-left: 24rpx;

			.searchIcons-item {
				padding: 14rpx 20rpx;
				box-sizing: border-box;
				background: #fff;
				border-radius: 28rpx 28rpx 28rpx 28rpx;
				font-weight: 400;
				font-size: 26rpx;
				color: #666666;
				line-height: 28rpx;
				margin-right: 14rpx;

				text {
					margin-right: 10rpx;
				}
			}
		}
	}

	::v-deep .u-search__content__input--placeholder {
		font-weight: 400;
		font-size: 28rpx;
		color: #999999;
	}

	.category {
		width: 100%;
		min-height: 280rpx;
		background-color: #fff;
		position: absolute;
		top: 335rpx;
		left: 0;
		border-top: 1px solid #eee;
	}
</style>