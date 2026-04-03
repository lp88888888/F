<template>
	<view class="container" :data-theme="pageTheme">
		<!-- <cos-header title='换电充气' :background-color="backgroundColor" style="position:fixed;top: 0;z-index: 999;"
			:font-color="fontColor" :fixed="fixed" :defaultNavBarheight="100"></cos-header> -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="tab-con">
				<up-navbar title="换电充气" :bgColor="backgroundColor" @leftClick="toBack" placeholder
					:fixed="false"></up-navbar>
				<view :style="{ top: navBarHeight + 'px' }">
					<view class="sercha">
						<view
							style="background-color: #fff; width: 85%;height: 80rpx;border-radius: 40rpx;display: flex;align-items: center;padding-left: 30rpx;">
							<up-input placeholder="请输入关键字搜索" v-model="searchTex" border='none' shape='circle'
								height="35" @blur="serchinput">
								<template #prefix>
									<up-icon name="search" color="#000000" size="24"></up-icon>
								</template>
							</up-input>
						</view>
						<!-- <view class="sercha-yuyue">
								我的<br />预约
							</view> -->
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
						<view class="" @click="tomap">
							<image :src="imgUrl + 'jiayou-icon-map.png'" class="img-icon"></image>
							<text style="text-decoration: underline;">地图找站点</text>
						</view>
					</view>

					<view class="filter-bar" style="padding: 0 40rpx;">
						<view class="filter-item filter-ls" @click="categoryFun('1')">
							<text :class="[optionindex1 > 0?'active':'']">{{textValue(1)}}</text>
							<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
						</view>
						<view class="filter-item  filter-ls" @click="categoryFun('2')">
							<text :class="[optionindex2 > 0?'active':'']">{{textValue(2)}}</text>
							<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
						</view>
						<view class="category" v-if="iscategory">
							<view v-if="typeIndex == '1'">
								<view :class="['labelBox',optionindex1 == index?'active':'']"
									v-for="(item,index) in option1" :key="index" @click="cateChange(1,index)">
									{{item.val}}
								</view>
							</view>
							<view v-if="typeIndex == '2'">
								<view :class="['labelBox',optionindex2 == index?'active':'']"
									v-for="(item,index) in option2" :key="index" @click="cateChange(2,index)">
									{{item.val}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>

		<view>
			<!-- 顶部标签栏 -->


			<up-calendar :show="show" :minDate="minDate" :mode="mode" @close="show=false"
				@confirm="confirm"></up-calendar>
			<!-- 列表区域 -->
			<scroll-view scroll-y class="list-con" :style="{ paddingTop: 0 + 'px' }" @scrolltolower="onReachBottom">
				<!-- 空状态 -->
				<view v-if="addgasolinelist.length==0">
					<ser-empty></ser-empty>
				</view>
				<!-- 订单列表 -->
				<view v-else>
					<view v-for="item in addgasolinelist" :key="item.id" class="item-con">
						<view class="box-1">
							<image v-if="item.image" :src="item.image" class="img-bj"> </image>
							<image v-else :src="imgUrl + 'dadain-img.jpg'" class="img-bj" ></image>
							<view class="box-1-left">
								<view class="box-1-left-1">
									<view v-if="item.status==1" class="box-1-left-sta">
										营业中
									</view>
									<view v-if="item.status==2"
										style="color: red;border: 2rpx solid red;background-color:#ca908d94;"
										class="box-1-left-sta">
										关闭
									</view>
									<view v-if="item.status==3"
										style="color: #ffeb3b;border: 2rpx solid #ffeb3b;background-color:#d7de9c;"
										class="box-1-left-sta">
										维护中
									</view>
									<view class="box-1-left-name">
										{{item.name}}
									</view>
								</view>
								<view class="box-1-left-2">
									<image :src="imgUrl + 'dd-time.png'" class="img-icon"></image>
									<text>营业时间｜08:00-23:00</text>
									<!-- <image :src="imgUrl + 'dd-list-jq.png'" style="margin-left: 30rpx;"
										class="img-icon"></image>
									<image :src="imgUrl + 'dd-list-jd.png'" class="img-icon"></image> -->
								</view>
								<view class="box-1-left-3">
									<view class="box-1-left-3-1">
										<image :src="imgUrl + 'jiayou-icon-map.png'" class="img-icon"></image>
										<text>{{item.cityAreaName}}</text>
									</view>
									<text>距您{{Number(item.distance).toFixed(2)}}km</text>
								</view>
								<view class="box-1-left-4">
									<view class="box-1-left-4-item" v-for="(item1,index1) in changeData(item.chargingJson)" :key="index1">
										<text :style="{background: themeStore.themeColors.$badgeBgColor }">{{item1.name}}</text>
										<text>{{item1.value}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="box-2">
							<!-- <view class="box-2-bt">
								导航到店
							</view> -->
							<view class="box-2-bt" @click="openphone(item)">
								电话联系
							</view>
							<view class="box-2-bt" @click="openmap(item)">
								导航到店
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

		</view>
		<PageDurationTracker pageName="充电换气" type='count'/>
		<ser-CustomImageLoading :modelValue="loadingVisible" text="正在获取数据..." />
	</view>
</template>
<script lang="ts" setup>
	import { ref, onMounted } from 'vue';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { getservicePoint } from '@/api/index';
	import { openAPPLocation, makePhoneCall,openLocation } from '@/utils/util';
	import { toast } from '@/utils/common';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const loadingVisible = ref<boolean>(false);
	// 假设这些是全局配置或 API 模块
	// import { integralApi } from '@/api/integralApi'
	// import { getUserInfo } from '@/utils/auth'
	// import { formatDateWeek } from '@/utils/date'
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

	const maxDate = `${year}-${month}-${date + 10}`;
	const minDate = `${year}-${month}-${date + 30}`;
	// 标签数据
	const tabs = [
		{ label: '全部', value: '' },
		{ label: '换电', value: '02' },
		{ label: '充气', value: '01' },

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
		// if(item.contactPhone) return toast('未查找到手机号')
		console.log(item);
		// #ifdef APP
		makePhoneCall(item.contactPhone)

		// #endif
		// #ifdef MP-WEIXIN
		makePhoneCall(item.contactPhone)
		// #endif

	}
	
	// 处理项目价格数据
	const changeData = (arr) => {
		if( !arr ) return [];
		let arrs = JSON.parse(arr)
		return arrs.slice(0, 2)
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
		if (pageNum.value >= totalPage.value) {
			uni.showToast({ title: '没有更多数据了', icon: 'none', duration: 1500 });
			return;
		}
		pageNum.value++;
		loadData();
	}
	const currentPage = ref('order')
	onMounted(() => {

		// 根据路由设置当前页面标识

		loadData()
	})
	// 模拟加载数据（替换为真实 API 调用）
	const loadData = () => {
		loadingVisible.value = true
		// 示例：模拟请求延迟
		let params = {
			name: searchTex.value,
			serviceScope: tabIndex.value,
			longitude: uni.getStorageSync('address').lng,
			latitude: uni.getStorageSync('address').lat,
			status: option2.value[optionindex2.value].key,
			distance: option1.value[optionindex1.value].key,
		}

		// 这里应调用真实接口，例如：
		getservicePoint(params).then(res => {
			console.log("查询的列表数据", res)
			const newList = res.rows; // 处理数据
			addgasolinelist.value = [...addgasolinelist.value, ...newList];
			totalPage.value = res.total;
			loadingVisible.value = false
		}).catch(err => {
			loadingVisible.value = false
		}).finally(() => {
			loadingVisible.value = false
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


	// 项目点击
	const itemClick = (id : number) => {
		uni.navigateTo({
			url: `/pages_D/refuelingRefilling/orderDetails?id=${id}`,
		});
	};
</script>

<style lang="scss" scoped>
	.box-1 {
		display: flex;
		align-items: flex-start;
        gap: 2rpx;
		.img-bj {
			width: 136rpx;
			height: 136rpx;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin-right: 20rpx;
		}

		.box-1-left {
			flex: 1 0;
			width: 0;
			display: flex;
			flex-direction: column;

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
				margin-top: 20rpx;
				margin-bottom: 20rpx;
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
		
			.box-1-left-4{
				width: 100%;
				margin-top: 20rpx;
				.box-1-left-4-item{
					width: 100%;
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					text:nth-child(1){
						font-size: 24rpx;
						padding: 5rpx 10rpx;
						box-sizing: border-box;
						color: var(--primary-color);
						margin-right: 10rpx;
						word-break: keep-all;
					}
					text:nth-child(2){
						flex: 1 0;
						width: 0;
						font-size: 24rpx;
						color: #a0a0a0;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						
					}
				}
				.box-1-left-4-item:last-child{
					margin-bottom: 0;
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
		background: #F8F9FB;
		display: flex;
		flex-direction: column;
	}

	/* 标签栏 */
	.tab-con {
		width: 100%;
		// height: 304rpx;
		// padding: 0 40rpx 4rpx;
		box-sizing: border-box;
		// background: linear-gradient(180deg, #D1E5F9 0%, rgba(255, 255, 255, 0) 100%);
		background: var(--head-color);

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
	}

	.item-con {
		background-color: #fff;
		margin-bottom: 24rpx;
		padding: 30rpx;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(138, 78, 0, 0.05);
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
</style>