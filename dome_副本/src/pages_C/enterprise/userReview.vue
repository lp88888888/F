<template>
	<view class="container" :data-theme="pageTheme" >

		<u-sticky bgColor="transparent" z-index="99999">
			<view class="tab-con">
				<up-navbar title="企业车辆" :titleStyle="{ fontSize: '36rpx', color: '#333333' }"
					:bgColor="backgroundColor" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			</view>
		</u-sticky>
		<view class="company-card flex ali-cen just-sb" v-if="addgasolinelist.length > 0">
			<text class="fs-26 col3" style="width: 120rpx;">企业名称</text>
			<text class="fs-26 col3">{{enterpriseName}}</text>
		</view>
		<view style="margin-bottom: 176rpx;">
			<scroll-view scroll-y class="list-con" :style="{ paddingTop: 0 + 'px' }" @scrolltolower="onReachBottom">
				<!-- 空状态 -->
				<ser-empty v-if="addgasolinelist.length <= 0" />

				<!-- 订单列表 -->
				<view v-else>
					<view v-for="item in addgasolinelist" :key="item.id"
						:style="{backgroundImage: `url(${bgImageUrl})`, backgroundSize: '100%',backgroundPosition: 'cover',backgroundRepeat: 'no-repeat'}"
						class="item-con">
						<view class="carcode"
							:style="{backgroundImage: `url(${dynamicBgImageUrl})`, backgroundSize: '240rpx 72rpx', /* 固定背景图尺寸 */backgroundPosition: 'center',backgroundRepeat: 'no-repeat'}">
							{{item.licensePlate}}
						</view>
						<view class="box-1">
							<text>加入公司｜{{item.enterpriseName}}</text>
							<text>{{ getVehicleType(item.vehicleType) }}</text>
						</view>

						<view class="bnt-box">
							<view class="bnt-box-1" @click="toNav(`/pages_C/enterprise/carInfo?vehicleId=${item.id}`)">
								查看详情
							</view>
							<!-- <view class="bnt-box-1 m-r-30" @click.stop="handleUnbind(item)">
								解绑
							</view> -->
						</view>
					</view>
				</view>
			</scroll-view>

		</view>
		<view class="foot-box">
			<view class="foot-box-1" @click="toNav(`/pages_C/enterprise/myApply?id=${enterpriseId}`)">
				<image class="foot-img" :src="imgUrl + 'static/car_fk.png'" mode=""></image>
				<text class="foot-tet">我的申请</text>
			</view>
			<view class="foot-box-bnt"
				@click="toNav(`/pages_C/enterprise/bindcar?id=${enterpriseId}&name=${enterpriseName}`)">
				新增车辆
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { ref, onMounted } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { enterpriseVehicle, unbindVehicle } from '@/api/car';
	import { openAPPLocation } from '@/utils/util';
	import { getDict } from '@/api/config';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const navBarHeight = ref(0);
	// const backgroundColor = ref<string>('#D1E5F9');
	const backgroundColor = ref<string>('transparent');
	const show = ref(false);
	const mode = ref('range');
	const d = new Date()
	const year = d.getFullYear();
	let month = d.getMonth() + 1;
	month = month < 10 ? `0${month}` : month;
	const date = d.getDate();
	const dynamicBgImageUrl = ref(imgUrl + 'mine/car_b.png')
	const bgImageUrl = ref(imgUrl + 'static/car_bg_00.png')
	const maxDate = `${year}-${month}-${date + 10}`;
	const minDate = `${year}-${month}-${date + 30}`;
	// 标签数据
	const tabs = [
		{ label: '全部', value: '' },
		{ label: '审核中', value: '01' },
		{ label: '审核通过', value: '02' },
		{ label: '审核驳回', value: '03' },
	];
	const enterpriseId = ref<string>('');
	const enterpriseName = ref<string>('');

	const tabIndex = ref<string>('');
	const searchTex = ref<string>('');
	// 映射表
	const statusText = {
		0: '待支付',
		1: '已预订',
		2: '已入住',
		3: '已完成',
		4: '已取消',
	};

	const statusCls = {
		0: 'status-1',
		1: 'status-1',
		2: 'status-2',
		3: 'status-3',
		4: 'status-4',
	};
	const cancelMap = {
		4: true,
		'04': true,
		CANCELLED: true,
		'已取消': true,
	};

	const typeIndex = ref('')
	const columns = ref<any[]>([]);
	type UserIdentity = {
		enterpriseId ?: string | number
		enterpriseName ?: string
	}
	const userIdentity = ref<UserIdentity>({
		enterpriseId: '',
		enterpriseName: ''
	})
	// 布局
	const vehicleTypeList = ref<any[]>([])
	// 获取车辆类型
	const getCarTypeList = async () => {
		try {
			const res = await getDict('vehicle_type')
			vehicleTypeList.value = Array.isArray(res.data) ? res.data : []
		} catch (e) {
			vehicleTypeList.value = []
		}
	}

	// 获取车辆类型名称
	const getVehicleType = (vehicleType : string | number) => {
		const vt = String(vehicleType ?? '')
		const type = vehicleTypeList.value.find((item : any) => String(item.dictValue) === vt)
		return type ? type.dictLabel : '其他'
	}

	const tomap = () => {
		uni.navigateTo({
			url: '/pages_D/JumpStart/maplist'
		})
	}


	const confirm = (e) => {
		console.log(e);
	};
	onLoad(async (options) => {
		if (uni.getStorageSync('userIdentity')) {
			userIdentity.value = uni.getStorageSync('userIdentity')[0]
			enterpriseId.value = options.id || userIdentity.value.enterpriseId
			enterpriseName.value = options.name || userIdentity.value.enterpriseName
			console.log('++++++++', userIdentity.value);
		}

		await getCarTypeList()
		loadData()
	})
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});

	const addgasolinelist = ref<OrderItem[]>([

	]);

	// 类型定义
	interface OrderItem {
		id : number;
		imageUrl : string;
		name : string;
		address : string;
		price : number;
		status : number | string;
		date : string;
	}




	// 下拉刷新
	const refresh = () => {
		uni.startPullDownRefresh(); // 触发下拉动画
		setTimeout(() => {
			addgasolinelist.value = []; // 清空旧数据
			pageNum.value = 1;
			loadData();
		}, 100);
	};

	// 上拉加载更多
	const onReachBottom = () => {
		if ((pageNum.value * pageSize.value) >= totalPage.value) {
			uni.showToast({ title: '没有更多数据了', icon: 'none', duration: 1500 });
			return;
		}
		pageNum.value++;
		loadData();
	}
	const currentPage = ref('order')

	const loadData = () => {
		// 示例：模拟请求延迟
		let params = {
			enterpriseId: enterpriseId.value,
			auditStatus: 1
		}

		enterpriseVehicle(params
		).then(res => {
			const newList = res.data.list; // 处理数据
			addgasolinelist.value = pageNum.value == 1?newList:[...addgasolinelist.value, ...newList];
			totalPage.value = res.data.total;
		}).catch(err => {
		}).finally(() => {
		});
		// 模拟返回数据（仅用于演示）

	};

	// Tab 切换
	const tabChange = (index : number) => {
		const newValue = tabs[index].value;
		addgasolinelist.value = [];
		tabIndex.value = newValue;
		loadData();
	};

	/** 解绑车辆 */
	const handleUnbind = async (item : VehicleItem) => {
		try {
			const result = await uni.showModal({
				title: '提示',
				content: `确定要解绑车牌号为 ${item.licensePlate} 的车辆吗？`,
			});

			if (!result.confirm) return;

			const params = {
				vehicleId: item.id,
				enterpriseId: enterpriseId.value,
				memberId: item.vehicleOwnerId,
			};

			await unbindVehicle(params);
			console.log('+++++++', result);
			uni.showToast({ title: result.msg, icon: 'none' });
			addgasolinelist.value = [];
			loadData();

		} catch (error) {
			uni.showToast({ title: error.msg, icon: 'none' });
		}
	};
	// 项目点击
	const itemClick = (id : number) => {
		uni.navigateTo({
			url: `/pages_D/refuelingRefilling/orderDetails?id=${id}`,
		});
	};
</script>

<style lang="scss" scoped>
	.foot-box {
		width: 100%;
		padding: 30rpx 30rpx 50rpx;
		background-color: #fff;
		box-sizing: border-box;
		position: fixed;
		display: flex;
		align-items: center;
		left: 0;
		bottom: 0;
		justify-content: space-between;
	}

	.foot-box-1 {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 36rpx;
	}

	.foot-img {
		width: 39rpx;
		height: 45rpx;
		margin-bottom: 20rpx;

	}

	.foot-tet {
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.foot-box-bnt {
		width: 522rpx;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		font-weight: 500;
		font-size: 32rpx;
		color: #FFFFFF;
		background: var(--primary-color);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
	}

	.carcode {
		width: 240rpx;
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		font-size: 28rpx;
		color: #FFFFFF;
		background-size: 240rpx 72rpx;
		/* 固定背景图尺寸 */
		background-position: center;
		background-repeat: no-repeat;
	}

	.box-1 {
		display: flex;
		align-items: center;
		font-weight: 600;
		font-size: 24rpx;
		color: #333333;
		padding: 24rpx 0;
		border-bottom: 2rpx solid #EAEAEA;
		margin-bottom: 20rpx;

		.img-bj {
			width: 136rpx;
			height: 136rpx;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin-right: 20rpx;
		}

		.box-1-left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 136rpx;

			.box-1-left-1 {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;

				.box-1-left-sta {
					font-weight: 500;
					font-size: 20rpx;
					color: var(--primary-color);
					background: #EAFFFF;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					border: 2rpx solid var(--primary-color);
					width: 70rpx;
					height: 32rpx;
					line-height: 32rpx;
					text-align: center;
					margin-right: 20rpx;
				}

				.box-1-left-name {
					font-weight: 500;
					font-size: 32rpx;
					color: #333333;
				}
			}

			.box-1-left-2 {
				font-weight: 400;
				font-size: 24rpx;
				color: #666666;
				display: flex;
				align-items: center;
			}

			.box-1-left-3 {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: 400;
				font-size: 24rpx;
				color: #333333;

				.box-1-left-3-1 {
					font-weight: 400;
					font-size: 24rpx;
					color: #666666;
					display: flex;
					align-items: center;
				}
			}
		}
	}

	.box-2 {
		display: flex;
		align-items: center;
		flex-direction: row-reverse;
		margin-top: 40rpx;

		.box-2-bt {
			width: 160rpx;
			height: 56rpx;
			background: #FFFFFF;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			border: 2rpx solid var(--primary-color);
			font-weight: 500;
			font-size: 28rpx;
			color: var(--primary-color);
			line-height: 56rpx;
			text-align: center;
			margin-right: 30rpx;
		}
	}

	.img-icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 20rpx;
	}

	.sercha {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
	}

	.sercha-yuyue {
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
		margin-left: 20rpx;
	}

	.filter-bar {
		box-sizing: border-box;
		display: flex;
		border-radius: 8px;
		position: relative;
		margin-bottom: 30rpx;
		margin-top: 15rpx;
	}

	.filter-item {
		display: flex;
		text-align: center;
		font-size: 14px;
		width: 156rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 322rpx 322rpx 322rpx 322rpx;
		line-height: 56rpx;
		margin-right: 30rpx;

	}

	.filter-ls {
		align-items: center;
		justify-content: center;
	}

	.filter-wz {
		font-size: 28rpx;
	}

	.zhi {
		color: #999999;
		margin: 0 10rpx;
	}

	.down {
		margin-left: 6rpx;
		display: inline-block;
		padding-top: 5rpx;
	}

	.category {
		width: 100%;
		min-height: 280rpx;
		background-color: #fff;
		position: absolute;
		top: 80rpx;
		left: 0;
		border-top: 1px solid #eee;
	}

	.active {
		color: var(--primary-color);
	}

	.labelBox {
		padding: 25rpx 32rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}

	.jiayoulist {
		height: 118rpx;
		padding: 20rpx 60rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #F8F9FB;
		border-radius: 12rpx 12rpx 12rpx 12rpx
	}

	.list-box-q {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
	}

	.list-box-1 {
		font-weight: 400;
		font-size: 20rpx;
		color: #666666;
	}

	.list-box-2 {
		line-height: 56rpx;
		font-weight: 500;
		font-size: 28rpx;
		color: #000;

	}

	.container {
		background: var(--head-color);
		display: flex;
		flex-direction: column;
	}

	/* 标签栏 */
	.tab-con {
		width: 100%;
		// height: 304rpx;
		// padding: 0 40rpx 4rpx;
		box-sizing: border-box;
		background: linear-gradient(180deg, #D1E5F9 0%, rgba(255, 255, 255, 0) 100%);
		// position: fixed;
		// z-index: 999;
		// left: 0;
		// position: fixed;

	}

	.tab-con1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 20rpx 0;
	}

	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 60rpx;
	}

	.tab-text {
		font-size: 32rpx;
		margin-bottom: 12rpx;
	}

	.tab-select {
		font-weight: bold;
		color: #333;
		font-size: 32rpx;
		position: relative;
	}

	.tab-normal {
		font-weight: 500;
		color: #666;
	}

	/* 列表区域 */
	.list-con {
		height: calc(100vh - 50rpx);
		flex: 1;
		padding: 0 32rpx;
		box-sizing: border-box;
		overflow-y: auto;
		margin-top: 30rpx;
	}

	.item-con {
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}

	.bnt-box {
		display: flex;
		align-items: center;
		flex-direction: row-reverse;
	}

	.bnt-box-1 {
		width: 136rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		border: 2rpx solid var(--primary-color);
		font-weight: 500;
		font-size: 24rpx;
		color: var(--primary-color);
		line-height: 56rpx;
		text-align: center;
	}

	.box-1 {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.box-text-1 {
			font-weight: 600;
			font-size: 32rpx;
			color: #333333;
			margin-bottom: 24rpx;
		}

		.box-text-2 {
			font-weight: 400;
			font-size: 24rpx;
			color: #4788FA;
		}
	}

	.box-text {
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
		padding-bottom: 28rpx;
		border-bottom: 2rpx solid #EAEAEA;
		margin-bottom: 28rpx;
	}

	.item-bg {
		background-color: #ffffff;
		padding: 32rpx;
	}

	.item-bg--disabled {
		background: #fff;
		opacity: 0.6;
	}

	.item-bg--disabled .ht-name,
	.item-bg--disabled .tex24_66 {
		color: #bfbfbf !important;
	}

	.item-bg--disabled .goods-img,
	.item-bg--disabled .ht-icon {
		opacity: 0.3;
		filter: grayscale(100%);
	}

	/* 标题行 */
	.between-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 26rpx;
		border-bottom: 2rpx solid #EBEBEB;
	}

	.ht-icon {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-right: 16rpx;
	}

	.ht-name {
		flex: 1;
		max-width: 428rpx;
		font-weight: bold;
		font-size: 32rpx;
		color: #333;
		line-height: 36rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.ht-label {
		width: 120rpx;
		height: 48rpx;
		border-radius: 24rpx;
		font-size: 24rpx;
		text-align: center;
		line-height: 48rpx;
	}

	/* 状态样式 */
	.status-1 {
		color: #005fee;
		background: rgba(0, 95, 238, 0.06);
	}

	.status-2,
	.status-4 {
		color: #333;
		background: rgba(51, 51, 51, 0.06);
	}

	.status-3 {
		color: #008042;
		background: rgba(0, 128, 66, 0.06);
	}

	.status-4 {
		color: #999;
	}

	/* 内容行 */
	.row-con {
		display: flex;
		align-items: flex-start;
	}

	.goods-img {
		width: 128rpx;
		height: 128rpx;
		border-radius: 8rpx;
		margin-right: 32rpx;
	}

	.goods-name {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.tex24_66 {
		font-size: 24rpx;
		color: #666;
	}

	.m-tb-24 {
		margin-top: 24rpx;
		margin-bottom: 24rpx;
	}

	.company-card {
		width: 690rpx;
		height: 96rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 20rpx 0rpx #E7EBF1;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		margin: 20rpx 30rpx 0;
		padding: 30rpx;
		box-sizing: border-box;
	}
</style>