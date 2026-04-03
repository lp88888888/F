<template>
	<view class="container" :data-theme="pageTheme">
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="我的车辆" bgColor="transparent" @leftClick="toBack" :placeholder="true" :fixed="true"
					:titleStyle="{ fontWeight: 'bold' }"></up-navbar>
				<!-- 搜索栏 -->
				<view class="search-bar">
					<view class="search-wrapper">
						<up-icon name="search" color="#000000" size="28"></up-icon>
						<input class="search-input" type="text" v-model="searchKeyword" placeholder="请输入关键字搜索"
							placeholder-style="color: #C0C3CB" confirm-type="search" @input="doSearch" />
						<view v-if="searchKeyword" class="clear-btn" @click="onClearSearch"> × </view>
					</view>
					<view class="filter-container">
						<!-- 车辆类型 -->
						<view class="native-select" @click="showVehicleTypePicker = true">
							<text class="native-select__label">车辆类型</text>
							<text class="native-select__val">{{ vehicleTypeLabels[vehicleTypeIndex] }}</text>
							<image class="dropImg" :src="imgUrl + 'down.png'" />
						</view>

						<!-- 审核状态 -->
						<view class="native-select" @click="showStatusPicker = true">
							<text class="native-select__label">审核状态</text>
							<text class="native-select__val">{{ statusLabels[statusIndex] }}</text>
							<image class="dropImg" :src="imgUrl + 'down.png'" />
						</view>
					</view>
				</view>
			</view>
		</u-sticky>

		<!-- 车辆列表 -->
		<view class="vehicle-list">
			<view v-for="(item, index) in vehicleList" :data-color="item.plateColor" :key="index"
				class="vehicle-item m-b-30" @click="toInfo(item)">
				<view class="vehicle-info flex">
					<view class="plate-number" :style="getPlateNumberStyle(item.plateColor)"> {{ item.licensePlate }}
					</view>
					<!-- <view class="status" :class="{
				'status-passed': item.auditStatus == '2',
				'status-pending': item.auditStatus == '1' || item.auditStatus == '0',
				'status-rejected': item.auditStatus == '3' || item.auditStatus == '4'
				}">
						{{getValue(item.auditStatus)}}
					</view> -->
					<view class="status status-passed">
						{{ item.enterpriseId ? '企业' : '个人' }}
					</view>
				</view>
				<view class="action flex" v-if="item.auditStatus== '1'">
					<!-- 阻止冒泡，避免触发父级跳转 -->
					<view v-if="!item.enterpriseId" class="unbind m-t-20" @click.stop="handleUnbind(item)">解绑</view>
					<view v-if="item.enterpriseId && userIdentity.identityType == 2" class="unbind m-t-20" @click.stop="handleUnbind(item)">解绑</view>
				</view>
			</view>
			<view class="empty-state" v-if="vehicleList.length === 0">
				<ser-empty></ser-empty>
			</view>
		</view>

		<!-- 新增车辆按钮 -->
		<view class="bottom-bar">
			<view class="add-vehicle" @click="toJump('/pages_A/car/addCar')">
				<u-icon name="plus" color="#ffffff" size="8" />
				<text>新增车辆</text>
			</view>
		</view>

		<!-- 车辆类型 -->
		<up-picker :show="showVehicleTypePicker" :columns="vehicleTypeOptions" keyName="dictLabel" valueName="dictValue"
			@confirm="onVehicleTypeConfirm" @cancel="showVehicleTypePicker = false"></up-picker>

		<!-- 审核状态 -->
		<up-picker :show="showStatusPicker" :columns="statusOptions" keyName="dictLabel" valueName="dictValue"
			@confirm="onStatusConfirm" @cancel="showStatusPicker = false"></up-picker>
			<PageDurationTracker pageName="我的车辆" />
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme';
	import { ref, computed, onMounted } from 'vue';
	import { debounce } from '@/utils/common';
	import { toBack } from '@/utils/route';
	import { imgUrl } from '../../config';
	import { getByUserIdAndVehicleAll, getVehicleAuditStatus, getVehicleType, unBindVehicle } from '@/api/user';
	import { getDict } from '@/api/config';
	import { onShow } from '@dcloudio/uni-app';
	import { useTheme } from '@/composables/useTheme';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	const { themeStore, pageTheme } = useTheme();

	interface VehicleItem {
		vehicleId : string;
		vehicleNumber : string;
		plateColor : string;
		auditStatus : string;
		plateNumber ?: string;
		status ?: '通过' | '待审核' | '驳回' | '作废';
		type ?: string;
	}

	const backgroundColor = ref<string>('#FFFFFF');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);

	const searchKeyword = ref('');

	/** 下拉筛选的 v-model（与 computed 直接联动） */
	const vehicleTypeValue = ref(''); // '' 表示全部
	const statusValue = ref<string>(''); // 审核状态码：''全部，'01'待审，'02'通过，'03'驳回，'04'作废

	/** 车辆类型选项 */
	const vehicleTypeOptions = ref([]);
	const showVehicleTypePicker = ref(false);
	const showStatusPicker = ref(false);

	/** 审核状态选项） */
	const statusOptions = ref([]);

	/** picker 需要的展示数组与当前索引 */
	const vehicleTypeLabels = computed(() => {
		const options = vehicleTypeOptions.value[0];
		return options ? options.map((o : any) => o.dictLabel) : [];
	});
	const statusLabels = computed(() => {
		const options = statusOptions.value[0];
		return options ? options.map((o : any) => o.dictLabel) : [];
	});
	const vehicleTypeIndex = ref(0);
	const statusIndex = ref(0);
	/** 列表数据 */
	const vehicleList = ref<VehicleItem[]>([]);
	const userIdentity = ref({}); // 企业身份 0-无 1-普通成员，2-企业管理员
	onMounted(() => {
		initOptionsAndData();
		if(uni.getStorageSync('userIdentity')){
			userIdentity.value = uni.getStorageSync('userIdentity');
		}
	});
	onShow(() => {
		getData();
	});

	const initOptionsAndData = async () => {
		await Promise.all([getVehicleAuditStatusList(), getVehicleTypeList()]);
		// 默认索引对齐（第0项“全部”）
		vehicleTypeIndex.value = findIndexByValue(vehicleTypeOptions.value[0], vehicleTypeValue.value);
		statusIndex.value = findIndexByValue(statusOptions.value[0], statusValue.value);
	};

	const findIndexByValue = (arr : any[], v : string) => {
		if (!arr) return 0;
		const i = arr.findIndex((x : any) => x.dictValue === v);
		return i >= 0 ? i : 0;
	};

	const getValue = (type : string) => {
		let value = '';
		const options = statusOptions.value[0];
		if (options) {
			for (let i in options) {
				if (options[i].dictValue == type) {
					value = options[i].dictLabel;
				}
			}
		}
		return value;
		// switch (type) {
		// 	case '01': return '待审核';
		// 	case '02': return '通过';
		// 	case '03': return '驳回';
		// 	case '04': return '作废';
		// 	default: return '';
		// }
	};

	const getPlateNumberStyle = (colorCode : string) => {
		return {
			'--car-b': `url(${imgUrl}mine/car_b.png)`,
			'--car-y': `url(${imgUrl}mine/car_y.png)`,
			'--car-g': `url(${imgUrl}mine/car_g.png)`,
			'--car-gy': `url(${imgUrl}mine/car_gy.png)`,
		};
	};
	const carlist = ref([])
	const getData = async () => {
		carlist.value=[]
		try {
			const userId = uni.getStorageSync('userInfo')?.id;
			if (!userId) return;
			const params = {
				userId: userId,
				licensePlate: searchKeyword.value,
				vehicleType: vehicleTypeValue.value,
				auditStatus: statusValue.value,
			};
			const res : any = await getByUserIdAndVehicleAll(params);
			vehicleList.value = res.data;
			vehicleList.value.forEach((item) => {
				if (!item.enterpriseId) {
					carlist.value.push(item)
				}
			});
			const car = res.data[0].licensePlate;
			const vclType = res.data[0].vehicleType;
			uni.setStorageSync('mycar', car);
			uni.setStorageSync('carNumber', car);
			uni.setStorageSync('vclType', vclType);
		} catch (e) {
			// console.error('getData error', e);
		}
	};
	/** 车辆的审核状态 */
	const getVehicleAuditStatusList = async () => {
		const res = await getDict('sys_common_audit_stauts');
		console.log('查询的车辆审核状态', res);
		const filteredData = res.data.filter(item => item.dictLabel !== "审核驳回");
		statusOptions.value = [[{ dictLabel: '全部', dictValue: '' }, ...(filteredData || [])]];
	};
	/** 车辆的类型 */
	const getVehicleTypeList = async () => {
		const res = await getDict('vehicle_type');
		console.log('查询的车辆类型', res);
		vehicleTypeOptions.value = [[{ dictLabel: '全部', dictValue: '' }, ...(res.data || [])]];
	};

	const onVehicleTypeConfirm = (e : any) => {
		console.log('onVehicleTypeConfirm', e);
		const idx = e.indexs[0];
		vehicleTypeIndex.value = idx;
		vehicleTypeValue.value = e.value[0]?.dictValue ?? '';
		showVehicleTypePicker.value = false;
		getData();
	};

	const onStatusConfirm = (e : any) => {
		console.log('onStatusConfirm', e);
		const idx = e.indexs[0];
		statusIndex.value = idx;
		statusValue.value = e.value[0]?.dictValue ?? '';
		showStatusPicker.value = false;
		getData();
	};
	const toInfo = (item) => {
		console.log('item', item);
		uni.setStorageSync('mycar', item);
		toJump('/pages_A/car/info?vehicleId=' + item.id);
	};
	/** 解绑车辆 */
	const handleUnbind = async (item : VehicleItem) => {
		try {
			const result = await uni.showModal({
				title: '提示',
				content: `确定要解绑车牌号为 ${item.licensePlate} 的车辆吗？`,
			});

			if (!result.confirm) return;

			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo?.id) {
				uni.showToast({ title: '用户信息获取失败', icon: 'error' });
				return;
			}

			const params = {
				// userId: userInfo.id,
				vehicleId: item.id,
			};

			await unBindVehicle(params);
			uni.removeStorageSync('carNumber');
			uni.removeStorageSync('vclType');
			// 更新车辆列表
			// vehicleList.value = vehicleList.value.filter(
			// 	v => v.vehicleId !== item.vehicleId
			// );
			getData();
			uni.showToast({ title: '解绑成功', icon: 'success' });
		} catch (error) {
			console.error('解绑车辆失败:', error);
			uni.showToast({ title: '解绑失败', icon: 'error' });
		}
	};

	/** 跳转 */
	const toJump = (url : string) => {
		uni.navigateTo({ url });
	};
	const doSearch = debounce(() => {
		getData();
	}, 300);

	const onClearSearch = () => {
		searchKeyword.value = '';
		getData();
	};
	const onFilterChange = () => {
		// 下拉筛选项改变时立即刷新
		getData();
	};
</script>

<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}

	.container {
		background-color: #f1efec;
		min-height: 100vh;
		padding-bottom: 180rpx;
		/* 给底部按钮预留空间，避免被遮挡 */
	}

	::v-deep .u-search {
		padding: 0 32rpx;
	}

	.search-bar {
		padding: 15rpx 0;

		.filter-container {
			display: flex;
			justify-content: space-evenly;
			gap: 20rpx;
			padding: 20rpx 32rpx 0;

			.native-select {
				// min-width: 320rpx;
				height: 72rpx;
				padding: 0 24rpx;
				border-radius: 36rpx;
				// background: #f7f7f7;
				display: flex;
				align-items: center;
				justify-content: space-between;

				&__label {
					font-size: 26rpx;
					color: #666;
					margin-right: 16rpx;
				}

				&__val {
					font-size: 26rpx;
					color: #111;
				}
			}

			.dropImg {
				width: 38rpx;
				height: 38rpx;
			}
		}
	}

	.vehicle-list {
		margin: 30rpx 0 0;

		.vehicle-item {
			display: flex;
			flex-direction: column;
			padding: 30rpx;
			border: 3px solid #ffffff;
			border-radius: 26rpx;
			margin: 0 32rpx 30rpx;

			// 黄色车牌 - 01
			&[data-color='3'] {
				background: linear-gradient(17deg, rgba(255, 255, 217, 1) 0%, rgba(255, 255, 255, 1) 41%);

				.plate-number {
					background: var(--car-y) no-repeat;
					background-size: 100% 100%;
					color: #000000 !important;
				}
			}

			// 蓝色车牌 - 02
			&[data-color='1'] {
				background: linear-gradient(17deg, rgba(219, 238, 255, 1) 0%, rgba(255, 255, 255, 1) 41%);

				.plate-number {
					background: var(--car-b) no-repeat;
					background-size: 100% 100%;
					color: #ffffff !important;
				}
			}

			// 绿色车牌 - 03/2
			&[data-color='2'] {
				background: linear-gradient(17deg, rgba(217, 255, 228, 1) 0%, rgba(255, 255, 255, 1) 41%);

				.plate-number {
					background: var(--car-g) no-repeat;
					background-size: 100% 100%;
					color: #000000 !important;
				}
			}

			// 黄绿色车牌 - 04/6
			&[data-color='6'] {
				background: linear-gradient(17deg, rgba(255, 255, 217, 1) 0%, rgba(255, 255, 255, 1) 41%);

				.plate-number {
					// background: var(--car-gy) no-repeat;
					background: linear-gradient(to right, yellow 10%, #43f243 80%);
					background-size: 100% 100%;
					color: #000000 !important;
				}
			}

			// 默认样式
			&:not([data-color]) {
				background: linear-gradient(17deg, rgba(240, 240, 240, 1) 0%, rgba(255, 255, 255, 1) 41%);

				.plate-number {
					background: var(--car-b) no-repeat;
					background-size: 100% 100%;
					color: #ffffff !important;
				}
			}

			.vehicle-info {
				display: flex;
				justify-content: space-between;
				padding-bottom: 30rpx;
				border-bottom: 1rpx solid #eeeeee;

				.plate-number {
					width: 230rpx;
					height: 70rpx;
					border-radius: 12rpx;
					font-weight: 500;
					font-size: 26rpx;
					text-align: center;
					line-height: 70rpx;
				}

				.status {
					width: fit-content;
					height: 36rpx;
					font-size: 24rpx;
					border-radius: 20rpx;
					text-align: center;
					line-height: 36rpx;
					padding: 0 16rpx;

					&.status-passed {
						background: rgba(0, 210, 158, 0.06);
						border-radius: 10rpx;
						border: 1px solid #00d29e;
						font-weight: 500;
						color: #00d29e;
					}

					&.status-pending {
						background: rgba(50, 156, 255, 0.06);
						border-radius: 10rpx;
						border: 1px solid #329cff;
						font-weight: 500;
						color: #329cff;
					}

					&.status-rejected {
						background: rgba(255, 95, 7, 0.06);
						border-radius: 10rpx;
						border: 1px solid #ff5f07;
						font-weight: 500;
						color: #ff5f07;
					}
				}
			}

			.action {
				display: flex;
				justify-content: flex-end;

				.unbind {
					width: 170rpx;
					height: 58rpx;
					background: var(--primary-color);
					border-radius: 29rpx;
					font-weight: bold;
					font-size: 26rpx;
					color: #ffffff;
					text-align: center;
					line-height: 58rpx;
				}
			}
		}
	}

	.bottom-bar {
		width: 750rpx;
		height: 158rpx;
		background: #ffffff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 15rpx 32rpx;
		box-sizing: border-box;
	}

	.add-vehicle {
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 500;
		font-size: 30rpx;
		color: #ffffff;
		width: 686rpx;
		height: 80rpx;
		background: var(--primary-color);
		border-radius: 40rpx;

		text {
			margin-left: 10rpx;
		}
	}

	.search-wrapper {
		display: flex;
		align-items: center;
		background: #f7f7f7;
		border-radius: 36rpx;
		margin: 0 32rpx;
		padding-left: 20rpx;

		.search-input {
			flex: 1;
			height: 72rpx;
			font-size: 28rpx;
			padding: 0 20rpx;
			border-radius: 36rpx;
		}

		.clear-btn {
			margin-left: 10rpx;
			font-size: 36rpx;
			color: #999;
			margin-right: 20rpx;
		}
	}
</style>