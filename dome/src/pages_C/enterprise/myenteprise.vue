<template>
	<view class="container" :data-theme="pageTheme">
			<u-sticky bgColor="transparent" z-index="99999">
				<view class="searchView">
				<view class="tab-con">
					<up-navbar title="我的企业" bgColor="transparent"  @leftClick="toBack" placeholder
							:fixed="true"></up-navbar>
					<view style="width: 95%; height:170rpx;margin: 0 auto;position: relative;">
						<image style="width:100%; height: 80px;" :src="imgUrl+'static/wdqy.png'" mode=""></image>
						<view
							style="position: absolute;left:15%;top: 40%;transform: translate(40%, 15%);color: #fff;display: flex;align-items: center;gap: 20rpx;">
							<view style="font-size: 26rpx;">普通积分</view>
							<view style="font-size: 36rpx;">{{commonPoint}}</view>
						</view>
						<view style="position: absolute;top:20rpx;right: 14rpx;color: #628F2F;" @click="tomapMoney()">积分明细</view>
					</view>
					<view class="tab-con1" style="padding: 0 40rpx;">
						<view v-for="(tab, index) in tabs" :key="index" class="tab-item" @click="tabChange(index)">
							<text :class="['tab-text', tabIndex === tab.value ? 'tab-select' : 'tab-normal']">
								{{ tab.label }}
							</text>
							<image v-if="tabIndex === tab.value" style="width: 30rpx; height: 8rpx;"
								:src="imgUrl+'zcby.png'" mode=""></image>
							<!-- <view  class="tab-line"></view> -->
						</view>
					</view>
				</view>
				</view>
			</u-sticky>
		
		
		<view>

			<scroll-view scroll-y class="list-con" :style="{ paddingTop: 0 + 'px' }" @scrolltolower="onReachBottom">
				<!-- 空状态 -->
				<ser-empty v-if="addgasolinelist.length <= 0" />

				<!-- 订单列表 -->
				<view v-else>
					<view v-for="item in addgasolinelist" :key="item.id" class="item-con">
						<view class="box-1">
							<text class="box-text-1">{{item.enterpriseName}}</text>
							<text class="box-text-2">{{getAuditStatusText(item.auditStatus)}}</text>
						</view>
						<view class="box-text">
							{{item.createTime}}
						</view>
						<view class="bnt-box">
							<view class="bnt-box-1" @click="toNav(`/pages_C/enterprise/joinEnteprise?id=${item.id}`)">
								查看详情
							</view>
							<view v-if="item.auditStatus == 1" class="bnt-box-1"
								@click="toNav(`/pages_C/enterprise/entercar?id=${item.id}&name=${item.enterpriseName}&enterpriseManagerId=${item.memberId}`)">
								管理车辆
							</view>
							<view v-if="item.auditStatus == 0 && isOver24h(item.createTime)" class="bnt-box-1"
								:style="urgingMap[item.id] ? 'opacity:0.6;' : ''" @click="urgeAuditEvt(item)">
								{{ urgingMap[item.id] ? '催办中...' : '催办' }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="bottom-bar" v-if="userIdentity == 2" @click="toNav('/pages_C/enterprise/joinEnteprise')">
			<view class="add-vehicle">
				<text>新增企业</text>
			</view>
		</view>
		<PageDurationTracker pageName="我的企业" />
	</view>
</template>
<script lang="ts" setup>
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { ref, onMounted } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { enterpriseList, urgeAudit } from '@/api/car';
	import { openAPPLocation ,openLocation,makePhoneCall} from '@/utils/util';
   // 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	// 假设这些是全局配置或 API 模块
	// import { integralApi } from '@/api/integralApi'
	// import { getUserInfo } from '@/utils/auth'
	// import { formatDateWeek } from '@/utils/date'
	const navBarHeight = ref(0);
	// const backgroundColor = ref<string>('#D1E5F9');
	const backgroundColor = ref<string>('transparent');
	const show = ref(false);
	const mode = ref('range');
	const commonPoint = ref('');
	const d = new Date()
	const year = d.getFullYear();
	let month = d.getMonth() + 1;
	month = month < 10 ? `0${month}` : month;
	const date = d.getDate();

	const maxDate = `${year}-${month}-${date + 10}`;
	const minDate = `${year}-${month}-${date + 30}`;
	const userIdentity = ref(uni.getStorageSync('userIdentity')?.[0]?.identityType ?? '');
	// 标签数据
	const tabs = [
		{ label: '全部', value: '' },
		{ label: '审核中', value: '0' },
		{ label: '审核通过', value: '1' },
		{ label: '审核驳回', value: '2' },

	];
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
	const option1 = ref([{ key: '', val: '距离' }, { key: '10', val: '10km' }, { key: '20', val: '20km' }, { key: '30', val: '30km' }]);
	const optionindex1 = ref<number>(0);
	const option2 = ref([{ key: '', val: '营业状态' }, { key: '1', val: '营业中' }, { key: '2', val: '关闭' }, { key: '3', val: '维护中' }]);
	const optionindex2 = ref<number>(0);
	const iscategory = ref<boolean>(false);
	const typeIndex = ref('')
	const auditStatusMap = {
		0: '待审核',
		1: '审核通过',
		2: '审核驳回'
	}

	const getAuditStatusText = (status : number) => {
		return auditStatusMap[status as keyof typeof auditStatusMap] || '';
	};
	// 24小时毫秒数
	const DAY_MS = 24 * 60 * 60 * 1000

	// 解析 createTime（兼容 "YYYY-MM-DD HH:mm:ss" / "YYYY-MM-DDTHH:mm:ss"）
	const parseTime = (t : any) : number => {
		if (!t) return 0
		if (typeof t === 'number') return t
		const s = String(t).trim()
		// iOS/Safari 对 "YYYY-MM-DD HH:mm:ss" 可能不兼容，这里统一替换
		const normalized = s.replace(/-/g, '/').replace('T', ' ')
		const ts = Date.parse(normalized)
		return Number.isNaN(ts) ? 0 : ts
	}

	// 是否超过24小时
	const isOver24h = (createTime : any) : boolean => {
		const ct = parseTime(createTime)
		if (!ct) return false
		return Date.now() - ct >= DAY_MS
	}

	// 催办中：防止重复点击
	const urgingMap = ref<Record<string | number, boolean>>({})

	// 催办
	const urgeAuditEvt = async (item : any) => {
		// 二次校验：仅待审核 + 超24h 才允许
		if (Number(item?.auditStatus) !== 0) return
		if (!isOver24h(item?.createTime)) return

		const eid = item?.id
		if (!eid) {
			uni.showToast({ title: '企业ID缺失，无法催办', icon: 'none' })
			return
		}

		if (urgingMap.value[eid]) return
		urgingMap.value[eid] = true

		try {
			const modal = await uni.showModal({
				title: '提示',
				content: '确定要发起催办吗？',
				confirmText: '确定',
				cancelText: '取消'
			})
			if (!modal.confirm) return

			uni.showLoading({ title: '催办中...', mask: true })

			const res = await urgeAudit(eid)

			if (res?.code === 200) {
				uni.showToast({ title: '已催办', icon: 'none' })
				// 如需要刷新列表可放开：
				// addgasolinelist.value = []
				// pageNum.value = 1
				// loadData()
			} else {
				uni.showToast({ title: res?.msg || '催办失败', icon: 'none' })
			}
		} catch (e : any) {
			uni.showToast({ title: e?.msg || '催办失败', icon: 'none' })
		} finally {
			uni.hideLoading()
			urgingMap.value[eid] = false
		}
	}

	// 布局
	const openmap = (item) => {
		console.log();
		// #ifdef APP
		openAPPLocation({
			endLocation: {
				"longitude": item.longitude,
				"latitude": item.latitude,
				"address": item.name
			}
		})
		// #endif
		// #ifdef MP-WEIXIN
		openLocation({
			latitude: Number(item.latitude),//维度
			longitude: Number(item.longitude),//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name: item.name,
		})
		// #endif

	}
	// 拨打电话
	const openphone = (item) => {
		makePhoneCall(item.contactPhone)
		
	}
	const serchinput = (item) => {
		addgasolinelist.value = []; // 清空旧数据
		loadData();
	}

	const categoryFun = (type) => {
		typeIndex.value = type;
		iscategory.value = !iscategory.value
	}
	const cateChange = (type, index) => {
		if (type == 1) {
			optionindex1.value = index
		}
		if (type == 2) {
			optionindex2.value = index
		}
		serchinput()
		iscategory.value = false
	}
	const tomap = () => {
		uni.navigateTo({
			url: '/pages_D/JumpStart/maplist'
		})
	}
	const tomapMoney = () => {
		uni.navigateTo({
			url: '/pages_A/pointslist/enterprise'
		})
	}

	const textValue = computed(() => {
		return (type) => {
			if (type == 1) {
				if (optionindex1.value == 0) return '距离'
				else return option1.value[optionindex1.value].val
			}
			if (type == 2) {
				if (optionindex1.value == 0) return '营业状态'
				else return option2.value[optionindex2.value].val
			}

		}
	})

	const confirm = (e) => {
		console.log(e);
	};
	onLoad((options) => {
		let user = uni.getStorageSync('userInfo')
		if (user) {
			commonPoint.value = user.enterprisePointsAccount.commonPoint
		}
		// loadData()
console.log('-0-0-onLoad0-0-');

	});
	onShow(()=>{
		tabIndex.value = ''
		pageNum.value = 1;
		console.log('-0-0-0-0-');
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
			// loadData();
		}, 100);
	};
	const pageNum = ref(1);
	const pageSize = ref(10);
	const totalPage = ref(0);

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
		let params = {
			auditStatus: tabIndex.value || '',
			memberId: uni.getStorageSync('userInfo').id,
			pageNum:pageNum.value,
			pageSize:pageSize.value,
		}

		enterpriseList(params
		).then(res => {
			console.log('09090909',res);
			const newList = res.data.list;
			addgasolinelist.value = pageNum.value == 1?newList:[...addgasolinelist.value, ...newList];
			totalPage.value = res.data.total;
		}).catch(err => {
		}).finally(() => {
		});

	};

	// Tab 切换
	const tabChange = (index : number) => {
		const newValue = tabs[index].value;
		addgasolinelist.value = [];
		tabIndex.value = newValue;
		pageNum.value = 1;
		loadData();
	};


	// 项目点击
	const itemClick = (id : number) => {
		uni.navigateTo({
			url: `/pages_D/refuelingRefilling/orderDetails?id=${id}`,
		});
	};
</script>

<style lang="scss" scoped>
	.searchView{
	 background:var(--head-color);
	}
	.box-1 {
		display: flex;
		align-items: center;

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
					color: #00BEBE;
					background: #EAFFFF;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					border: 2rpx solid #47DFDA;
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
			border: 2rpx solid #00BEBE;
			font-weight: 500;
			font-size: 28rpx;
			color: #00BEBE;
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
		color: #FF9000;
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
		display: flex;
		flex-direction: column;
	}

	/* 标签栏 */
	.tab-con {
		width: 100%;
		box-sizing: border-box;
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
	}

	.item-con {
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		box-shadow:var(--shadow);
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
		color:var(--primary-color); 
		line-height: 56rpx;
		text-align: center;
		margin-right: 30rpx;
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
			width: 500rpx;
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

	.bottom-bar {
		width: 100%;
		height: 176rpx;
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		padding: 30rpx 64rpx 50rpx;
		z-index: 8;
		box-sizing: border-box;

		.add-vehicle {
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
			width: 622rpx;
			height: 96rpx;
			background: var(--but-color-line);
			border-radius: 48rpx;
		}
	}
</style>