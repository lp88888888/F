<template>
	<view class="page-conent" :data-theme="pageTheme">
		<up-sticky>
			<view class="searchView">
				<up-navbar title="我的预约" leftIconColor="#000000" bgColor="transparent" @leftClick="toBack"
					:placeholder="true" :fixed="true" ></up-navbar>
				<!-- 可滑动标签栏核心：使用 scroll-view 实现横向滚动 -->
				<scroll-view class="tab-con1" scroll-x show-scrollbar="false" :scroll-left="scrollLeft">
					<view class="tab-bar-bql">
						<view v-for="(item, index) in tabs" :key="index"
							:class="['tab-item', { active: activeisow == index }]"
							:style="{ '--tab-active-bg': `url(${icoUrl}tabimg.png)` }"
							@click="tabChange(index, item.value)">
							{{ item.label }}
						</view>
					</view>
				</scroll-view>
				<view class="qyx-data">
					<view class="qyx-text" :class="{ actives: tiveisow == index }" v-for="(item,index) in statusList"
						:key="index" @click="tabchangeTime(index, item.value)">
						{{item.label}}
					</view>
				</view>
			</view>
		</up-sticky>
		<!-- 订单列表区域 - 增加下拉刷新和上拉加载 -->
		<scroll-view :style="{ height: listHeight + 'px' }">
			<!-- 以旧换新 -->
			<view class="usedcar-box" v-for="(item,index) in dataList" :key="index" v-if="tabindex==1"
			 @click="toNav('/pages_F/appointment/oldfornewsdetail?id='+item.id)">
				<view class='usedcar-title' :class="statuszt(item.status)=='待服务'? 'dfw-title':'yfw-title'">
					<view class="yydh-item">
						<view class="yydh">预约单号</view>
						<view class='yydh-xian'></view>
						<view>{{item.id}}</view>
					</view>
					<view class="status-text" v-if="statuszt(item.status)=='待服务'">{{statuszt(item.status)}}</view>
					<view class="status-text" style="color: #333;" v-else>{{statuszt(item.status)}}</view>
				</view>
				<view class="wn-box" style="font-size: 24rpx;">
					<view class="carlct">
						<view class="dot dot_color" style="font-size: 24rpx;">旧</view>
						<view class="dot-wenzi">{{item.prCarOldTypeVo?.name}}</view>
					</view>
					<view class='xian'></view>
					<view class="carlct" style="margin-bottom: 25rpx;">
						<view class="dot dot_color1">新</view>
						<view class="dot-wenzi">{{item.prCarNewTypeVo?.name}}</view>
					</view>
					<view class="phone">
						<view><up-icon name="phone" size="20"></up-icon></view>
						<view class="yydh-item">
							<view class="yydh">联系电话</view>
							<view class='yydh-xian'></view>
							<view>{{item?.phone}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 上门估计 -->
			<view class="usedcar-box" v-for="(item,index) in dataList" :key="index" 
				v-if="tabindex==2"  @click="toNav('/pages_F/appointment/onsitevaluation?id='+item.id)">
				<view class='usedcar-title' :class="statuszt(item.status)=='待服务'? 'dfw-title':'yfw-title'">
					<view class="yydh-item">
						<view class="yydh">预约单号</view>
						<view class='yydh-xian'></view>
						<view>{{item.id}}</view>
					</view>
					<view class="status-text" v-if="statuszt(item.status)=='待服务'">{{statuszt(item.status)}}</view>
					<view class="status-text" style="color: #333;" v-else>{{statuszt(item.status)}}</view>
				</view>
				<view class="wn-box" style="font-size: 24rpx;">
					<view class="wn-box-text">{{item.prCarSeriesVo?.name}}{{item.prCarTypeVo?.name}}</view>
					<view class="phone">
						<view><up-icon name="map" size="16"></up-icon></view>
						<view class="yydh-item">
							<view class="yydh">估计地区</view>
							<view class='yydh-xian'></view>
							<view>{{item.evaluateProvince}}-{{item.evaluateCity}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 新车 -->
			<view class="usedcar-box" v-for="(item,index) in dataList" :key="index" 
				v-if="tabindex==3" @click="toNav('/pages_D/newCar/orderDetail?id='+item.id)">
				<view class='usedcar-title' :class="statuszt(item.status)=='待服务'? 'dfw-title':'yfw-title'">
					<view class="yydh-item">
						<view class="yydh">预约单号</view>
						<view class='yydh-xian'></view>
						<view>{{item.id}}</view>
					</view>
					<view class="status-text" v-if="statuszt(item.status)=='待服务'">{{statuszt(item.status)}}</view>
					<view class="status-text" style="color: #333;" v-else>{{statuszt(item.status)}}</view>
				</view>
				<view class="wn-box" style="font-size: 24rpx;">
					<view class="wn-box-text">{{item?.carName}}</view>
					<view class="newcar">
						<view>
							<image class="h-item-img" :src="item.prIndustry4sVo?.image" mode=""></image>
						</view>
						<view>
							<view class="phone" style="margin: 20rpx 0;gap:10rpx">
								<view><up-icon name="clock" size="16"></up-icon></view>
								<view class="yydh-item">
									<view class="yydh">{{item?.appointmentTime}}</view>
								</view>
							</view>
							<view class="phone" style="margin: 20rpx 0;gap:10rpx">
								<view><up-icon name="map" size="16"></up-icon></view>
								<view class="yydh-item">
									<view class="yydh">{{item.prIndustry4sVo?.address}}</view>
								</view>
							</view>
						</view>
					</view>

				</view>
			</view>

			<!-- 二手车 -->
			<view class="usedcar-box" v-for="(item,index) in dataList" :key="index" 
				v-if="tabindex==4" @click="toNav('/pages_D/usedCar/orderDetail?id='+item.id)">
				<view class='usedcar-title' :class="statuszt(item.status)=='待服务'? 'dfw-title':'yfw-title'">
					<view class="yydh-item">
						<view class="yydh">预约单号</view>
						<view class='yydh-xian'></view>
						<view>{{item.id}}</view>
					</view>
					<view class="status-text" v-if="statuszt(item.status)=='待服务'">{{statuszt(item.status)}}</view>
					<view class="status-text" style="color: #333;" v-else>{{statuszt(item.status)}}</view>
				</view>
				<view class="wn-box" style="font-size: 24rpx;">
					<view class="wn-box-text">
						{{item.prCarBrandVo?.name}}{{item.prCarSeriesVo?.name}}{{item.prCarTypeVo?.name}}</view>
					<view class="newcar">
						<view>
							<image class="h-item-img" :src="item.prIndustry4sVo?.image" mode=""></image>
						</view>
						<view>
							<view class="phone" style="margin: 20rpx 0;gap:10rpx">
								<view><up-icon name="clock" size="16"></up-icon></view>
								<view class="yydh-item">
									<view class="yydh">{{item.appointmentTime}}</view>
								</view>
							</view>
							<view class="phone" style="margin: 20rpx 0;gap:10rpx">
								<view><up-icon name="map" size="16"></up-icon></view>
								<view class="yydh-item">
									<view class="yydh">{{item.prIndustry4sVo?.address}}</view>
								</view>
							</view>
						</view>
					</view>

				</view>
			</view>
			<view class="usedcar-box" v-for="(item,index) in dataList" :key="index"
				v-if="tabindex==5"
				 @click="toNav('/pages_B/rentCar/rentCarDetails?id='+item.id)"
				>
				<view class='usedcar-title' :class="statuszt(item.status)=='待服务'? 'dfw-title':'yfw-title'">
					<view class="yydh-item">
						<view class="yydh">预约单号</view>
						<view class='yydh-xian'></view>
						<view>{{item.id}}</view>
					</view>
					<view class="status-text" v-if="statuszt(item.status)=='待服务'">{{statuszt(item.status)}}</view>
					<view class="status-text" style="color: #333;" v-else>{{statuszt(item.status)}}</view>
				</view>
				<view class="wn-box" style="font-size: 24rpx;">
					<view class="wn-box-text">{{item?.typeName}}</view>
					<view class="newcar">
						<view>
							<image class="h-item-img" :src="item.prIndustry4sVo?.image" mode=""></image>
						</view>
						<view>
							<view class="phone" style="margin: 20rpx 0;gap:10rpx">
								<view><up-icon name="clock" size="16"></up-icon></view>
								<view class="yydh-item">
									<view class="yydh">{{item?.appointmentTime}}</view>
								</view>
							</view>
							<view class="phone" style="margin: 20rpx 0;gap:10rpx">
								<view><up-icon name="map" size="16"></up-icon></view>
								<view class="yydh-item">
									<view class="yydh">{{item.prIndustry4sVo?.address}}</view>
								</view>
							</view>
						</view>
					</view>

				</view>
			</view>
			<!-- 加载状态提示 -->
			<view class="load-more" v-if="dataList && dataList.length > 0">
				<text class="no-more">没有更多数据了</text>
			</view>

			<!-- 空数据提示 -->
			<view class="empty-data" v-if="!refreshing && (!dataList || dataList.length === 0)">
				<ser-empty></ser-empty>
			</view>
		</scroll-view>
		<PageDurationTracker pageName="我的预约" />
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, computed } from 'vue';
	import { onLoad, onPageScroll, onReady, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '../../config';
	import { toNav, toBack } from '@/utils/route';
	import { prAppointmentOldCar, prEvaluateOldCar, prCarOldForNewlist, selectByUserId, appointmentRentCar } from '@/api/car'
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const activeisow = ref(0);
	const tiveisow = ref(0);
	const pageNum = ref(1); // 当前页码
	const pageSize = ref(30); // 每页条数
	const dataList = ref([])
	const tabindex = ref('1');
	const tabchangeindex = ref('');
	// 标签列表
	const tabs = [
		{ label: '以旧换新', value: '1' },
		{ label: '上门估价', value: '2' },
		{ label: '新车试驾', value: '3' },
		{ label: '二手车试驾', value: '4' },
		{ label: '租车预约', value: '5' },
	];
	const statusList = [
		{ label: '全部', value: '' },
		{ label: '待服务', value: '0' },
		{ label: '已服务', value: '1' },
	];

	// Tab 切换 + 自动滑动（修复版）
	const tabChange = async (index : number, val : string) => {
		dataList.value = []
		if (val == 1) {
			prCarOldForNewFun()
		} else if (val == 2) {
			prEvaluateOldCarFun()
		} else if (val == 3) {
			selectByUserIdFun()
		} else if (val == 4) {
			prAppointmentOldCarFun()
		} else if (val == 5) {
			appointmentRentCarFun()
		}
		activeisow.value = index;
		tabindex.value = val

	};
	const tabchangeTime = (index : number, val : string) => {
		tiveisow.value = index
		tabchangeindex.value = val
		dataList.value = []
		if (tabindex.value == 1) {
			prCarOldForNewFun()
		} else if (tabindex.value == 2) {
			prEvaluateOldCarFun()
		} else if (tabindex.value == 3) {
			selectByUserIdFun()
		} else if (tabindex.value == 4) {
			prAppointmentOldCarFun()
		} else if (tabindex.value == 5) {
			appointmentRentCarFun()
		}
	}
	const statuszt = (val) => {
		switch (val) {
			case 0:
				return '待服务'
			case '0':
				return '待服务'
			case '1':
				return '已服务'
			case 1:
				return '已服务'
			case '':
				return '未知'
		}
	}
	//上门估计
	const prEvaluateOldCarFun = async () => {
		let params = {
			status: tabchangeindex.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		};
		try {
			const res = await prEvaluateOldCar(params)
			if (res.code == 200) {
				dataList.value = res.rows
			}
		} catch (error) {

		} finally {

		}
	}
	//以旧换新
	const prCarOldForNewFun = async () => {
		let params = {
			status: tabchangeindex.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		};
		try {
			const res = await prCarOldForNewlist(params)
			if (res.code == 200) {
				dataList.value = res.rows
			}
		} catch (error) {

		} finally {

		}
	}
	// 新车
	const selectByUserIdFun = async () => {
		let params = {
			status: tabchangeindex.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		};
		try {
			const res = await selectByUserId(params)
			if (res.code == 200) {
				dataList.value = res.data
			}
		} catch (error) {

		} finally {

		}
	}
	// 二手车预约
	const prAppointmentOldCarFun = async () => {
		let params = {
			status: tabchangeindex.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		};
		try {
			const res = await prAppointmentOldCar(params)
			if (res.code == 200) {
				console.log(res.rows,9999999999999)
				dataList.value = res.rows
			}
		} catch (error) {

		} finally {

		}
	}
	//租车
	const appointmentRentCarFun = async () => {
		let params = {
			status: tabchangeindex.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		};
		try {
			const res = await appointmentRentCar(params)
			if (res.code == 200) {
				dataList.value = res.rows
			}
		} catch (error) {

		} finally {

		}
	}

	onLoad((options) => {
		if(options.type){
			 activeisow.value=options.type
			 dataList.value=[]
			if (options.type == 0) {
				 tabindex.value=1
				prCarOldForNewFun()
			} else if (options.type == 1) {
				 tabindex.value=2
				prEvaluateOldCarFun()
			} else if (options.type == 2) {
				tabindex.value=3
				selectByUserIdFun()
			} else if (options.type == 3) {
				tabindex.value=4
				prAppointmentOldCarFun()
			} else if (options.type == 4) {
				tabindex.value=5
				appointmentRentCarFun()
			}
		}else{
			prCarOldForNewFun()
		}
		
	})
	onMounted(() => {

	});
	onShow(() => {

	})
	onUnmounted(() => {

	});
</script>

<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}

	// scroll-view 样式
	.tab-con1 {
		width: 100%;
		padding: 10rpx 30rpx;
		margin: 14rpx 0 0;
		box-sizing: border-box;
		white-space: nowrap; // 确保内部不换行

		// 隐藏滚动条（各平台兼容）
		&::-webkit-scrollbar {
			display: none;
		}

		scrollbar-width: none;
	}

	.tab-bar-bql {
		display: inline-flex; // 让内部标签横向排列
		align-items: center;
		padding-bottom: 15rpx;
		color: #333333;
		position: relative;
	}

	.tab-item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8rpx 0;
		margin-right: 40rpx; // 标签间距
		text-align: center;
		font-size: 28rpx;
		line-height: 1.4;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
		position: relative;
	}

	.tab-item.active {
		color: #333333;
		font-weight: bold;
		transform: scale(1.05);
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 12rpx;
		background: var(--tab-active-bg);
		background-size: 100% 100%;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.qyx-data {
		padding: 0 30rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 40rpx;
		font-size: 28rpx;
	}

	.qyx-text {
		background-color: #FFFFFF;
		border-radius: 8rpx;
		text-align: center;
		padding: 5rpx 20rpx;
	}

	.actives {
		border: 1px solid var(--secondary-color);
		background-color: var(--bgqtmd);
		color:var(--primary-color) ;
	}

	.usedcar-box {
		width: 94%;
		background: #FFFFFF;
		border-radius: 8px 8px 8px 8px;
		box-shadow: 0px 2px 8px 0px var(--bgqtmd);
		margin: 30rpx auto 15rpx;
	}

	.usedcar-title {
		width: 100%;
		height: 37px;

		border-top-right-radius: 16rpx;
		border-top-left-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.dfw-title {
		background-color: var(--bgqtmd);
	}

	.yfw-title {
		background: #EDEDED;
	}

	.yydh-item {
		display: flex;
		align-items: center;
		color: #666666;
		gap: 16rpx;
	}

	.yydh-xian {
		width: 1px;
		height: 22rpx;
		background: #A3AFA5;
	}
    .yydh{
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1; /* 可以设置为任意行数 */
		overflow: hidden;
	}
	.dot {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		font-size: 20rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;

	}
    .dot_color{
		background: var(--bgqtmd);
		color: var(--primary-color);
	}
	.dot_color1{
		background: var(--primary-color);
	}
	.carlct {
		display: flex;
		align-items: center;
		gap: 30rpx;
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 50rpx;
	}

	.wn-box {
		padding: 30rpx 40rpx 15rpx;
		box-sizing: border-box;
		position: relative;
	}

	.xian {
		height: 58rpx;
		border: 1px dashed var(--secondary-color);
		position: absolute;
		top: 65rpx;
		left: 56rpx;
	}

	.phone {
		display: flex;
		gap: 15rpx;
	}

	.wn-box-text {
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 20rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1; /* 可以设置为任意行数 */
		overflow: hidden;
	}

	.h-item-img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
	}

	.newcar {
		display: flex;
		gap: 20rpx;
	}

	.status-text {
		color: var(--secondary-color);
	}

	.status-text1 {
		color: #666666;
	}

	/* 加载提示 */
	.load-more {
		text-align: center;
		padding: 20rpx 0;
		font-size: 24rpx;
		color: #999;
	}
	.dot-wenzi{
		width: 550rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1; /* 可以设置为任意行数 */
		overflow: hidden;
	}
</style>