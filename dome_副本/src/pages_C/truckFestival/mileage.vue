<template>
	<view class="page-view" :data-theme="pageTheme">
		<up-navbar title="里程赚积分" bgColor="transparent" @leftClick="toBack" :placeholder="true" :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="ctrdsBox">
			<image class="ctrdsBox-bgImg" :src="imgUrl+'static/C-truck/card-icom2.png'" mode=""></image>
			<view class="ctrdsBox-cent">
				<view class="location-toggle" @click="carshow=true" v-if="!enterpriseList.length">
					<up-icon :name="imgUrl+'static/C-truck/card-icon4.png'" size="18"></up-icon>
					<text style="margin-right: 20rpx;margin-left:20rpx">{{licensePlate||'选择车辆'}}</text>
					<up-icon name="arrow-down" color="#FFFFFF" size="18"></up-icon>
				</view>
				<view class="location-top" v-if="enterpriseList.length">
					<view class="location-toggle1" @click="qyshow=true">
						<up-icon :name="imgUrl+'static/C-truck/card-icon4.png'" size="18"></up-icon>
						<text style="margin-right: 20rpx;margin-left:20rpx">{{qyname||'选择企业'}}</text>
						<up-icon name="arrow-down" color="#FFFFFF" size="18"></up-icon>
					</view>
					<view class="location-toggle1" @click="carshow=true">
						<up-icon :name="imgUrl+'static/C-truck/card-icon4.png'" size="18"></up-icon>
						<text style="margin-right: 20rpx;margin-left:20rpx">{{licensePlate||'选择车辆'}}</text>
						<up-icon name="arrow-down" color="#FFFFFF" size="18"></up-icon>
					</view>
				</view>
				<view class="stats-card">
					<view class="stats-item">
						<text class="stats-num">{{mapointobj.mileage||0}}km</text>
						<text class="stats-label">我的有效里程</text>
					</view>
					<view class="divider"></view>
					<view class="stats-item">
						<text class="stats-num">{{mapointobj.rewardPoints||0}}</text>
						<text class="stats-label">我的奖励积分</text>
					</view>
					<image class="medal-icon" src="/static/medal.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<up-gap height="10"></up-gap>
		<view class="title">每日里程换积分明细</view>
		<view class="lisBoc">
			<view class="lisBoc-item" v-for="item in pointlist">
				<text>{{item.date}}</text>
				<text>{{item.mileage}}km={{item.activityPoints}}活动积分</text>
			</view>
		</view>
		<ser-empty v-if="!pointlist.length" text="暂无信息"></ser-empty>
		<up-picker :show="carshow" :columns="carlist" keyName='licensePlate' valueName='licensePlate'
			@confirm="onStatusConfirm" @cancel="carshow = false"></up-picker>
		<up-picker :show="qyshow" :columns="enterpriseList" keyName='enterpriseName' valueName='id'
			@confirm="onStatusConfirmqy" @cancel="qyshow = false"></up-picker>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	import { getByUserIdAndVehicleAll } from '@/api/user';
	import { postregistration, getMyleaderboard } from '@/api/truck';
	import { getEnterList } from '@/api/volumePricing';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const switchShow = ref(true)
	const carshow = ref(false)
	const qyshow = ref(false)
	const stationList = ref([
		{
			name: '宝鸡西收费站',
			address: '宝鸡市渭滨区连霍高速',
			distance: '30.6',
			image: imgUrl + 'del/car-back2.png',
			checked: false
		},
		{
			name: '宝鸡西收费站',
			address: '宝鸡市渭滨区连霍高速',
			distance: '30.6',
			image: imgUrl + 'del/car-back2.png',
			checked: true
		},
		{
			name: '宝鸡西收费站',
			address: '宝鸡市渭滨区连霍高速',
			distance: '30.6',
			image: imgUrl + 'del/car-back2.png',
			checked: false
		}
	]);
	const qyname = ref('')
	const qyid = ref('')

	const getEnterpriseList = async () => {
		const params = {
			pageNum: 1,
			pageSize: 1000,
		};

		try {
			const res = await getEnterList(params);

			if (res && res.page) {
				enterpriseList.value = res.page.records;

			}
		} catch (error) {
			console.error('获取企业列表失败:', error);
		}
	};
	const getlist = async () => {
		let params = {
			licensePlate: licensePlate.value,
			enterpriseId: qyid.value,
			activityId: activityId.value,
			pageNum: 1,
			pageSize: 99999
		}
		const res = await postregistration(params);
		console.log(res)
		pointlist.value = res.data
	}
	const mapointobj = ref({})
	const getmypoint = async () => {

		const res = await getMyleaderboard();
		mapointobj.value = res.data.rankings[0]
	}
	const pointlist = ref([])
	const enterpriseList = ref([])
	const onStatusConfirm = (e : any) => {
		console.log('onStatusConfirm', e);
		licensePlate.value = e.value[0].licensePlate;
		getlist()
		carshow.value = false;
	};
	const onStatusConfirmqy = (e : any) => {
		console.log('onStatusConfirm', e);
		qyid.value = e.value[0].id;
		qyname.value = e.value[0].enterpriseName;
		licensePlate.value = e.value[0].licensePlate;
		getlist()
		carshow.value = false;
	};
	const getcarlist = async () => {
		carlist.value = []
		try {
			const userId = uni.getStorageSync('userInfo')?.id;
			if (!userId) return;
			const params = {
				userId: userId,
			};
			const res : any = await getByUserIdAndVehicleAll(params);
			carlist.value.push(res.data)

		} catch (e) {
			// console.error('getData error', e);
		}
	};
	const carlist = ref([])
	const activityId = ref('')
	const licensePlate = ref('')
	onLoad((option) => {
		activityId.value = option.id
		getlist()
		getcarlist()
		getEnterpriseList()
		getmypoint()
	});
	const handleCheckIn = (index) => {
		if (!stationList.value[index].checked) {
			stationList.value[index].checked = true;
			uni.showToast({ title: '打卡成功！', icon: 'success' });
		}
	};

	const goBack = () => uni.navigateBack();
	const onToggleLocation = (e) => console.log('定位状态:', e.detail.value);
</script>

<style lang="scss" scoped>
	.page-view {
		min-height: 100vh;
		background: linear-gradient(0deg, #FCFFFC 70%, #D8F7DE 100%);
		padding: 0 24rpx;
	}

	.ctrdsBox {
		width: 690rpx;
		height: 216rpx;
		position: relative;

		.ctrdsBox-bgImg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 690rpx;
			height: 216rpx;
			z-index: 0;
		}

		.ctrdsBox-cent {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 690rpx;
			height: 216rpx;
			z-index: 1;
		}
	}

	.location-top {
		width: 100%;
		height: 60rpx;
		border-radius: 8px 0px 34px 0px;
		box-sizing: border-box;
		display: flex;
		background: rgba(255, 255, 255, 0.2);
		// justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: #FFFFFF;

		.location-toggle1 {
			width: 50%;
			padding: 0 20rpx;
		}
	}

	.location-toggle {
		width: 280rpx;
		height: 60rpx;
		border-radius: 8px 0px 34px 0px;
		padding: 0 20rpx;
		box-sizing: border-box;
		display: flex;
		// background: rgba(255, 255, 255, 0.2);
		// justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.stats-card {
		margin-top: -10rpx;
		// background-color: #76B83E;
		border-radius: 0 0 16rpx 16rpx;
		height: 180rpx;
		display: flex;
		align-items: center;
		padding: 0 40rpx;
		position: relative;
		color: #fff;
		z-index: 1;

		.stats-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			.stats-num {
				font-size: 44rpx;
				font-weight: bold;
			}

			.stats-label {
				font-size: 24rpx;
				opacity: 0.9;
			}
		}

		.divider {
			width: 3rpx;
			height: 80rpx;
			background-color: rgba(255, 255, 255, 1);
		}

		.medal-icon {
			position: absolute;
			right: 30rpx;
			width: 120rpx;
			height: 120rpx;
		}
	}

	.title {
		width: 690rpx;
		line-height: 60rpx;
		margin: 0 30rpx;
		font-size: 28rpx;
		color: #333333;
	}

	.lisBoc {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;

		.lisBoc-item {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			min-height: 84rpx;
			border-radius: 16rpx;
			background: #FFFFFF;
			box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
			padding: 20rpx 24rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			color: #666666;
			margin-bottom: 30rpx;
		}
	}
</style>