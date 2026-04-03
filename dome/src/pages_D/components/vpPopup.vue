<template>
	<view class="popup-container">
		<view class="popup-content">
			<view class="popup-header">
				<view class="popup-title">
					<image class="gth-icon" :src="imgUrl + 'volumePricing/vp_gth.png'" />
					<view class="header-box">
						<view class="g-txt">平台保障 | 您已完成 <text class="r-txt">身份信息</text>补充 </view>
					</view>
				</view>
				<image class="close-btn" @click="closePopup" :src="imgUrl + 'volumePricing/vp_close_btn.png'" />
			</view>

			<view class="popup-con">
				<!-- 车辆信息 -->
				<view class="car-info">
					<view class="car-title">
						<text>车辆信息</text>
						<view class="edit-box" @click="selectCar('edit')">
							<image class="all-icon" :src="imgUrl + 'volumePricing/vp_edit.png'" />
							<text>编辑</text>
						</view>
					</view>
					<view v-if="!props.vehicleNumberList.length" class="add-car" @click="selectCar('select')">
						<image class="add-icon" :src="imgUrl + 'volumePricing/vp_add.png'" />
						<text>选择车辆</text>
					</view>
					<view class="car-data">
						<text class="car-msg" v-if="props.vehicleNumberList.length">已选车辆</text>
						<view class="car-num-g" v-for="(item, index) in props.vehicleNumberList" :key="index">{{ item }}</view>
					</view>
				</view>

				<!-- 路段选择 -->
				<view class="route-selection">
					<view class="route-title">
						<text>优惠路段（6）</text>
						<view class="all-box">
							<image class="all-icon" :src="imgUrl + 'volumePricing/vp_all.png'" />
							<text>全选</text>
						</view>
					</view>

					<view class="route-option" v-for="(item, index) in props.routes" :key="index">
						<view
							class="route-item"
							@click="toggleSelect(index)"
							:style="{
								backgroundColor: '#FFF0EC',
								border: '1px solid #FF6503',
							}"
						>
							<text class="route-text"> {{ item.roadName1 }}——{{ item.roadName2 }} ({{ item.discount }}折)</text>
						</view>
					</view>
				</view>

				<!-- 协议勾选 -->
				<view class="agree-con">
					<image v-if="!isChecked" @click="onProtocol" class="agree-icon" :src="imgUrl + 'volumePricing/vp_agree.png'" />
					<image v-else class="agree-icon" :src="imgUrl + 'volumePricing/vp_agreed.png'" />
					<view>
						<text class="agree-txt">已阅读并同意</text>
						<text @click="onProtocol" class="protocol">《服务协议》</text>
					</view>
				</view>

				<view class="confirm-btn" @click="confirmSelection"> 确认申请 </view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { imgUrl } from '../../config';
import { toNav, toRec } from '@/utils/route';
const props = defineProps({
	isChecked: {
		type: Boolean,
		default: false,
	},
	vehicleNumberList: {
		type: Array,
		value: [],
	},
	routes: {
		type: Array,
		value: [],
	},
	isUser: {
		type: [String, Number],
		value: false,
	},
});
// 声明事件
const emit = defineEmits<{
	(e: 'close'): void;
	(e: 'onConfirm'): void;
	(e: 'onProtocol'): void;
}>();
// const routes = ref([
// 	{ name: '永辉——金段（3.5折）', value: 'route1', checked: true },
// 	{ name: '青花——线段（3.0折）', value: 'route2', checked: true },
// 	{ name: '永辉——金段（3.5折）', value: 'route3', checked: true },
// 	{ name: '子赫——金段（3.0折）', value: 'route4', checked: true },
// 	{ name: '子赫——金段（3.0折）', value: 'route5', checked: true },
// 	{ name: '子长东——青化砭路段（3.0折）', value: 'route6', checked: true },
// ]);

// 关闭弹窗
const closePopup = () => {
	emit('close');
};

// 选择车辆
const selectCar = (action) => {
	if (action === 'edit') {
		// 编辑
		uni.navigateTo({
			url: '/pages_D/volumePricing/carlist/index?vehicleNumberList=' + props.vehicleNumberList + '&isUser=' + props.isUser + '&type=2',
		});
	} else if (action === 'select') {
		// 选择车辆
		uni.navigateTo({
			url: '/pages_D/volumePricing/carlist/index?type=2&isUser=' + props.isUser,
		});
	}
};

// 切换路段选择
const toggleSelect = (index: number) => {
	// const selectedRoute = routes.value[index];
	// selectedRoute.checked = !selectedRoute.checked;
};

// 确认选择
const confirmSelection = () => {
	// const item = props.routes.value.filter((e) => e.checked);
	const id = props.routes.map((v) => v.id);
	let data = {
		routes: id,
		vehicleNumberList: props.vehicleNumberList,
	};
	emit('onConfirm', data);
	// 确认申请的逻辑
};

// 协议
const onProtocol = () => {
	emit('onProtocol');
};
</script>

<style lang="scss">
.popup-container {
	width: 100%;
	height: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: flex-end;
	z-index: 9999;
}

.popup-content {
	width: 100%;
	background-color: #fff;
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.popup-header {
	height: 72rpx;
	line-height: 72rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 26rpx;
	background: #f1faf1;
	padding: 0 30rpx;
	border-radius: 24px 24px 0px 0px;
}

.popup-con {
	padding: 37rpx 30rpx 86rpx;
}

.popup-title {
	display: flex;
	align-items: center;
	text-align: center;
}

.header-box {
	display: flex;
	align-items: center;
}

.g-txt {
	color: #1ab84e;
}

.r-txt {
	color: #ff6503;
}

.gth-icon {
	width: 28rpx;
	height: 28rpx;
	margin-right: 10rpx;
}

.close-btn {
	width: 26rpx;
	height: 26rpx;
	position: absolute;
	right: 23rpx;
}

.car-info,
.route-selection {
	border-bottom: 1rpx solid #d8d8d8;
}

.car-info {
	margin-bottom: 48rpx;
}

.route-selection {
	margin-bottom: 30rpx;
}

.car-title {
	font-size: 30rpx;
	font-weight: 500;
	color: #000000;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.add-car {
	width: 386rpx;
	height: 88rpx;
	border-radius: 4rpx;
	border: 1rpx solid #ff6503;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ff6503;
	font-size: 32rpx;
	font-weight: bold;
	margin: 40rpx auto;
}

.car-data {
	display: flex;
	align-items: center;
	margin: 40rpx auto;
}

.car-msg {
	font-size: 28rpx;
	margin-right: 105rpx;
}

.car-num-g {
	height: 60rpx;
	border-radius: 8rpx;
	background: #f7f7f7;
	border: 1rpx solid #d1d4da;
	font-size: 28rpx;
	font-weight: 500;
	color: #000000;
	text-align: center;
	line-height: 60rpx;
	padding: 0 20rpx;
}

.add-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 5rpx;
}

.route-title {
	margin-bottom: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.edit-box {
	display: flex;
	align-items: center;
}

.edit-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 6rpx;
}

.all-box {
	display: flex;
	align-items: center;
}

.all-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 6rpx;
}

.route-options-container {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.route-item {
	padding: 10rpx 20rpx;
	margin-bottom: 24rpx;
	border-radius: 8rpx;
	display: inline-flex;
	justify-content: flex-start;
	align-items: center;
	width: auto;
	flex-shrink: 0;
	transition: border 0.2s ease;
}

.route-text {
	font-size: 26rpx;
	white-space: nowrap;
}

.agree-con {
	display: flex;
	align-items: center;
}

.agree-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 26rpx;
}

.agree-txt {
	color: #3a3a3a;
}

.protocol {
	color: #1876ff;
}

.confirm-btn {
	width: 100%;
	text-align: center;
	margin-top: 40rpx;
	height: 92rpx;
	line-height: 92rpx;
	border-radius: 8rpx;
	color: #ffffff;
	font-size: 30rpx;
	font-weight: 500;
	background: linear-gradient(180deg, #f7b77f 0%, #ec8733 100%), #ff6503;
}
</style>
