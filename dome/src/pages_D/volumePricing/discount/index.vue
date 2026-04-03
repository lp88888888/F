<template>
	<view class="page">
		<up-navbar bgColor="transparent" placeholder :fixed="true" title="以量优惠" autoBack></up-navbar>

		<!-- 主体内容 -->
		<view class="container">
			<!-- 头部标题 -->
			<view class="header">
				<view class="header-box-1">陕西省高速公路</view>
				<view class="header-box-2">"以量定价"</view>
				<view class="header-box-2 m-b-10">差异化收费(试点)</view>
				<view class="header-box-3" v-for="(item, index) in activeList" :key="index">
					<view class="cri"></view>
					<text class="header-text">{{ item.highName }}</text>
				</view>
			</view>

			<!-- 活动申请模块 -->
			<view class="hudong" @click="goToApply">
				<view class="hudong-left">
					<view class="hudong-1">
						活动申请
						<image :src="imgUrl + 'volumePricing/hei-right-icon.png'" class="huodong-left-icon" mode="" />
					</view>
					<view class="hudong-2">
						参与活动,享受通行
						<text class="hudong-text">优惠</text>
					</view>
				</view>
				<view class="hudong-right">立即申请</view>
			</view>

			<!-- 我的申请 / 我的优惠 -->
			<view class="youhiu">
				<view class="youhiu-1" @tap="onMyapply">
					<view class="youhiu-1-1">我的申请</view>
					<view class="youhiu-1-2">申请无忧,立项活动</view>
				</view>
				<view class="youhiu-2" @tap="onMydiscount">
					<view class="youhiu-1-1">我的优惠</view>
					<view class="youhiu-1-2">通行无忧,优惠不停</view>
				</view>
			</view>

			<!-- 消息通知区域 -->
			<view class="swiper-view-home">
				<image :src="imgUrl + 'volumePricing/lingdang-icon.png'" class="bell-icon" mode="" />
				<swiper v-if="noticeList.length" autoplay interval="2000" :duration="1000" vertical circular>
					<swiper-item v-for="(item, index) in noticeList" :key="index">
						<view class="width-more">
							<view class="swiper-item-text texNoWrap">
								{{ item.roadName1 }}——{{ item.roadName2 }}段优惠活动申请审核
								<text class="highlight-text">已通过！</text>
							</view>
							<view class="date-text">{{ item.auditTime }}</view>
						</view>
					</swiper-item>
				</swiper>
				<text v-else>暂无数据</text>
			</view>

			<!-- 常用服务 -->
			<view class="fuwu">
				<view class="fuwu-tit">常用服务</view>
				<view class="fuwu-box-1">
					<view class="fuwu-box" v-for="(item, index) in fwlist" :key="item.id" @tap="onToJump(index)">
						<image class="fuwu-img" :src="imgUrl + item.img" mode="" />
						<text class="fuwu-name">{{ item.name }}</text>
					</view>
				</view>
			</view>

			<!-- 优惠活动 -->
			<view class="promotion-section">
				<!-- 标题 -->
				<view class="promotion-title-container">
					<view class="promotion-heder">
						<view class="line"></view>
						<view class="promotion-title">优惠活动</view>
					</view>
					<view class="more-link" @tap="goToApply">
						更多
						<image :src="imgUrl + 'volumePricing/hui-right-icon.png'" class="left-icon" mode="" />
					</view>
				</view>

				<!-- 高速 tab -->
				<view class="tab-container">
					<view
						class="tab-item"
						v-for="(item, index) in activeList"
						:key="item.highId || index"
						:class="currentTab === index ? 'active' : 'active1'"
						@tap="switchTab(index)"
					>
						<image v-if="currentTab === index" class="gaosu-img" :src="imgUrl + 'volumePricing/gaosu-icon-bai.png'" mode="" />
						<image v-else class="gaosu-img" :src="imgUrl + 'volumePricing/gaosu-icon-hui.png'" mode="" />
						<text>{{ item.highName }}</text>
					</view>
				</view>

				<!-- 当前高速详细信息 -->
				<view class="promotion-details" v-if="currentTab === 0">
					<view class="promotion-header">
						<view class="promotion-name">{{ currentActive.highName }}</view>
						<view class="details-button" @tap="onDetail">
							查看详情
							<image :src="imgUrl + 'volumePricing/bai-right-icon.png'" class="left-icon" mode="" />
						</view>
					</view>

					<view class="discount-info">
						<view class="discount-highlight">路段最低优惠</view>
						<view class="dis-box">
							<view class="discount-value">
								{{ currentActive.minDiscount }}
								<text class="discount-tit">折/次</text>
							</view>
							<view class="additional-info">
								收费站 {{ currentActive.stationNum }} 个
								<view class="add-shu">|</view>
								服务区 {{ currentActive.serviceNum }} 个
							</view>
						</view>
					</view>

					<view class="implementation-object">
						<image :src="imgUrl + 'volumePricing/youhui-icon.png'" class="info-icon" mode="" />
						<text>优惠车型：{{ currentActive.goalName }}</text>
					</view>

					<view class="date-range">
						<image :src="imgUrl + 'volumePricing/time-icon.png'" class="calendar-icon" mode="" />
						<text>{{ currentActive.startTime }}-{{ currentActive.endTime }}</text>
					</view>

					<view class="section1">
						<view class="section-title">优惠路段</view>
						<view class="section-more" @tap="showPopup">
							查看全部
							<image :src="imgUrl + 'volumePricing/hui-right-icon.png'" class="left-icon-1" mode="" />
						</view>
					</view>

					<view class="section">
						<view class="section-title">参与活动基础条件</view>
						<view class="section-more" @tap="showhdpopup">
							查看全部
							<image :src="imgUrl + 'volumePricing/hui-right-icon.png'" class="left-icon-1" mode="" />
						</view>
					</view>
				</view>

				<view class="promotion-details" v-else>
					<view class="promotion-header">
						<view class="promotion-name">{{ currentActive.highName }}</view>
					</view>
					<ser-empty text="暂无内容，请等待~"></ser-empty>
				</view>
			</view>
		</view>

		<!-- 优惠路段弹窗 -->
		<up-popup :show="isPopupVisible" mode="bottom" closeable @close="hidePopup1">
			<view class="popup">
				<view class="popup-header">
					<view class="popup-header-text">优惠区间</view>
				</view>
				<scroll-view class="popup-content" scroll-y>
					<view class="table">
						<view class="table-header">
							<view class="header-cell">优惠路段</view>
							<view class="header-cell">优惠折扣</view>
						</view>
						<view class="table-body">
							<view class="table-row" v-for="(item, index) in currentActive.secList || []" :key="index" :class="index % 2 === 0 ? 'even' : 'odd'">
								<view class="cell">{{ item.roadName1 }}-{{ item.roadName2 }}</view>
								<view class="cell">{{ item.discount }}折</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="apply-button" @tap="goToApply">去申请</view>
			</view>
		</up-popup>

		<!-- 活动条件弹窗 -->
		<up-popup :show="isPopupVisiblehuodong" mode="bottom" closeable @close="hidehdPopup">
			<view class="popup">
				<view class="popup-header">
					<view class="popup-header-text">参与活动条件</view>
				</view>
				<rich-text class="popup-text" :nodes="currentActive.joinText" />
			</view>
		</up-popup>

		<!-- 完善信息弹窗 -->
		<up-popup :show="isPopupVisibleInfo" mode="center" :safeAreaInsetBottom="false">
			<view class="popup1">
				<view class="popup1-header">完善信息</view>
				<view class="popup1-text"> 本次活动需完善身份信息后方可参与活动，享受优惠～ </view>
				<view class="btn-box">
					<view class="cancel-btn" @tap="cancelEvt">取消</view>
					<view class="sure-btn" @tap="sureEvt">去完善</view>
				</view>
			</view>
		</up-popup>

		<!-- 审核中弹窗 -->
		<up-popup :show="isshPopup" mode="center" :safeAreaInsetBottom="false">
			<view class="popup1">
				<view class="popup1-header">完善信息</view>
				<view class="popup1-text"> 身份信息审核中，请等待审核通过～ </view>
				<view class="btn-box">
					<view class="cancel-btn" @tap="canceshlEvt">取消</view>
					<view class="sure-btn" @tap="sureEvt">去查看</view>
				</view>
			</view>
		</up-popup>

		<!-- 暂无法享受优惠弹窗 -->
		<up-popup :show="isyhPopup" mode="center" :safeAreaInsetBottom="false">
			<view class="popup1">
				<view class="popup1-header">暂无法享受优惠</view>
				<view class="popup1-text"> 继续通行就能解锁通行费折扣！ </view>
				<view class="btn-box">
					<view class="cancel-btn" @tap="cancelyhEvt">取消</view>
					<view class="sure-btn" @tap="sureyhEvt">查看通行次数</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed } from 'vue';
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import { yldjHighSpeedRoad, myMessageList, yldjMyyh, yldjHighSpeedRoadBiz, yldjUser, yldjCarEnterprise } from '@/api/volumePricing';
import { toNav, toRec } from '@/utils/route';

interface NoticeItem {
	auditTime?: string;
	roadName1?: string;
	roadName2?: string;
	[key: string]: any;
}

interface SecItem {
	roadName1: string;
	roadName2: string;
	discount: string | number;
	[key: string]: any;
}

interface ActiveItem {
	id?: number | string;
	highId?: number | string;
	highName?: string;
	minDiscount?: string | number;
	stationNum?: number;
	serviceNum?: number;
	goalName?: string;
	startTime?: string;
	endTime?: string;
	joinText?: string;
	secList?: SecItem[];
	address?: string;
	[key: string]: any;
}

const state = reactive({
	statusBarHeight: 0,
	titleBarHeight: 0,
	getTabBarH: 0,
	tabs: [] as any[],
	fwlist: [
		{
			img: 'volumePricing/cy-1-icon.png',
			id: 0,
			name: '我的通行次数',
			url: '/pages_D/volumePricing/passesNum/index',
		},
		{
			img: 'volumePricing/cy-2-icon.png',
			id: 1,
			name: '我的车辆',
			url: '',
		},
		{
			img: 'volumePricing/cy-3-icon.png',
			id: 2,
			name: '身份信息',
			url: '',
		},
		{
			img: 'volumePricing/cy-4-icon.png',
			id: 3,
			name: '意见反馈',
			url: '/pages_D/volumePricing/feedbackList/index',
		},
	],
	noticeList: [] as NoticeItem[],
	currentTab: 0,
	isUser: 0,
	isEnterprise: 0,
	isUserSuccess: 0,
	isEnterpriseSuccess: 0,
	isPopupVisible: false,
	isPopupVisiblehuodong: false,
	isPopupVisibleInfo: false,
	isyhPopup: false,
	isshPopup: false,
	speedinfo: {} as any,
	routes: [] as any[],
	rawList: [] as any[],
	activeList: [] as ActiveItem[],
	currentNoticeIndex: 0,
	notificationTop: 0,
	noticeTimer: null as any,
	discountList: [] as any[],
	pageNum: 1,
	pageSize: 10,
	id: '' as string | number | undefined,
});

const {
	statusBarHeight,
	titleBarHeight,
	fwlist,
	noticeList,
	currentTab,
	isPopupVisible,
	isPopupVisiblehuodong,
	isPopupVisibleInfo,
	isyhPopup,
	isshPopup,
	activeList,
	rawList,
	isUser,
	isEnterprise,
	isUserSuccess,
	isEnterpriseSuccess,
} = toRefs(state);

// 读取全局 / 系统尺寸
const initBars = () => {
	try {
		// 优先读全局
		// @ts-ignore
		const app = getApp && getApp();
		// @ts-ignore
		const g = app?.globalData || {};
		state.statusBarHeight = g.statusBarHeight ?? uni.getSystemInfoSync().statusBarHeight ?? 20;
		state.titleBarHeight = g.titleBarHeight ?? 44;
	} catch {
		const sys = uni.getSystemInfoSync();
		state.statusBarHeight = (sys.statusBarHeight as number) || 20;
		state.titleBarHeight = 44;
	}
};

const currentActive = computed<ActiveItem>(() => {
	if (!activeList.value || activeList.value.length === 0) {
		return {} as ActiveItem;
	}
	return activeList.value[currentTab.value] || ({} as ActiveItem);
});

/** 通知列表（async/await 版） */
const getMyMessageList = async () => {
	try {
		const params = {};
		const res: any = await myMessageList(params);
		const formattedNoticeList: NoticeItem[] = (res.page?.records || []).map((item: any) => {
			let formattedTime = '';
			if (item.auditTime && typeof item.auditTime === 'string' && item.auditTime.includes('-')) {
				const timeParts = item.auditTime.split('-');
				const month = timeParts[1] || '';
				const day = (timeParts[2] || '').slice(0, 2);
				formattedTime = `${month}/${day}`;
			}
			return {
				...item,
				auditTime: formattedTime,
			};
		});
		state.noticeList = formattedNoticeList;
	} catch (error: any) {
		uni.showToast({
			title: error?.message || '获取通知失败',
			icon: 'none',
		});
	}
};

/** 判断是否有优惠（我的优惠列表） */
const getyhList = async () => {
	try {
		const params = {
			pageNum: 1,
			pageSize: 10,
			highId: 1,
		};
		const res: any = await yldjMyyh(params);
		state.rawList = res.page?.records || [];
	} catch (error: any) {
		uni.showToast({
			title: error?.message || '获取优惠信息失败',
			icon: 'none',
		});
	}
};

/** 获取优惠活动列表 */
const getsqList = async () => {
	try {
		const params = {
			pageNum: state.pageNum,
			pageSize: state.pageSize,
		};
		const res: any = await yldjHighSpeedRoadBiz(params);
		console.log('查询的优惠活动高速', res);
		state.activeList = res.clazz || [];
	} catch (error: any) {
		uni.showToast({
			title: error?.message || '获取优惠活动失败',
			icon: 'none',
		});
	}
};

/** 查看详情 */
const onDetail = () => {
	const item = currentActive.value;
	if (!item) return;
	if (item.highId == 1) {
		toNav(`/pages_D/volumePricing/activityDetails/index?id=${item.id}&isUser=${state.isUser}`);
	} else if (item.address) {
		toNav(item.address);
	}
};

/** 个人信息 */
const getyldjUser = async () => {
	try {
		const params = {};
		const res: any = await yldjUser(params);
		console.log('个人信息', res);
		let isSuccess = 0;
		if (res.clazz && res.clazz.user && res.clazz.user.auditStatus === '02') {
			isSuccess = 1;
		}
		state.isUserSuccess = isSuccess;
		state.isUser = res.clazz && res.clazz.user ? 1 : 0;
	} catch (error: any) {
		uni.showToast({
			title: error?.message || '获取个人信息失败',
			icon: 'none',
		});
	}
};

/** 企业信息 */
const getyldjEnterprise = async () => {
	try {
		const params = {
			pageNum: 1,
			pageSize: 1000,
		};
		const res: any = await yldjCarEnterprise(params);
		console.log('企业信息', res);
		let isSuccess = 0;
		const records = res.page?.records || [];
		if (records.length > 0 && records[0].auditStatus === '02') {
			isSuccess = 1;
		}
		state.isEnterprise = records.length > 0 ? 1 : 0;
		state.isEnterpriseSuccess = isSuccess;
	} catch (error: any) {
		uni.showToast({
			title: error?.message || '获取企业信息失败',
			icon: 'none',
		});
	}
};

/** 高速信息 */
const getHighway = async () => {
	try {
		const params = {};
		const res: any = await yldjHighSpeedRoad(params);
		const list = res.clazz && res.clazz.length > 0 ? res.clazz[0] : [];
		state.speedinfo = list;
	} catch (error) {
		console.error('获取高速信息失败', error);
	}
};

/** 切换 tab */
const switchTab = (index: number) => {
	state.currentTab = index;
};

/** 活动条件弹窗 */
const showhdpopup = () => {
	state.isPopupVisiblehuodong = true;
};
const hidehdPopup = () => {
	state.isPopupVisiblehuodong = false;
};

/** 优惠路段弹窗 */
const showPopup = () => {
	state.isPopupVisible = true;
};
const hidePopup1 = () => {
	state.isPopupVisible = false;
};
const hidePopup = () => {
	state.isPopupVisible = false;
	state.isPopupVisiblehuodong = false;
};

/** 多选（保留原逻辑） */
const toggleSelection = (id: number | string) => {
	state.discountList = state.discountList.map((item: any) => (item.id === id ? { ...item, selected: !item.selected } : item));
};

/** 去申请 */
const goToApply = () => {
	let data = 0;
	if (state.isUser) {
		data = state.isEnterprise ? 3 : 1;
	} else {
		data = state.isEnterprise ? 2 : 0;
	}
	isPopupVisible.value = false;
	toNav(`/pages_D/volumePricing/activity/apply?isUser=${data}`);
};

/** 我的申请 */
const onMyapply = () => {
	toNav('/pages_D/volumePricing/myApply/index');
};

/** 我的优惠 */
const onMydiscount = () => {
	if (state.rawList.length > 0) {
		toNav('/pages_D/volumePricing/myDiscount/index');
	} else {
		state.isyhPopup = true;
	}
};

/** 常用服务跳转 */
const onToJump = (index: number) => {
	console.log('是否有信息', !!(state.isUser || state.isEnterprise));
	console.log('是否用户信息且审核通过', state.isUserSuccess);

	let data = 0;
	if (state.isUser) {
		data = state.isEnterprise ? 3 : 1;
	} else {
		data = state.isEnterprise ? 2 : 0;
	}

	if (index === 2) {
		const url = '/pages_D/volumePricing/information/index';
		toNav(url);
	} else if (index === 1) {
		console.log('是否有企业信息', state.isEnterpriseSuccess);
		if (state.isUserSuccess || state.isEnterpriseSuccess) {
			const url = `/pages_D/volumePricing/carlist/index?type=1&isUser=${data}`;
			toNav(url);
		} else if (state.isUser || state.isEnterprise) {
			state.isshPopup = true;
		} else {
			state.isPopupVisibleInfo = true;
		}
	} else {
		const target = state.fwlist[index];
		if (target && target.url) {
			toNav(target.url);
		}
	}
};

/** 各类弹窗按钮 */
const cancelEvt = () => {
	state.isPopupVisibleInfo = false;
};
const canceshlEvt = () => {
	state.isshPopup = false;
};
const cancelyhEvt = () => {
	state.isyhPopup = false;
};
const sureyhEvt = () => {
	toNav('/pages_D/volumePricing/passesNum/index');
	state.isyhPopup = false;
};
const sureEvt = () => {
	toNav(`/pages_D/volumePricing/improve/index?id=${state.id}`);
	state.isPopupVisibleInfo = false;
};

/** 生命周期 */
onLoad(() => {
	initBars();
});

onShow(() => {
	getHighway();
	getyldjUser();
	getyldjEnterprise();
	getyhList();
	getsqList();
	getMyMessageList();
});

onHide(() => {
	if (state.noticeTimer) {
		clearInterval(state.noticeTimer);
		state.noticeTimer = null;
	}
});

onUnload(() => {
	if (state.noticeTimer) {
		clearInterval(state.noticeTimer);
		state.noticeTimer = null;
	}
});
</script>

<style lang="scss" scoped>
.page {
	background: url('https://tranalioss.shanyitong.com/volumePricing/beijing-icon.png');
	background-size: 100% auto;
	background-repeat: no-repeat;
}

.container {
	padding: 0 30rpx 30rpx 30rpx;
}

.back {
	width: 100%;
	position: relative;
	/* font-size: 36rpx; */
}

.back-tit {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}

.header {
	width: 100%;
	margin-top: 94rpx;
	box-sizing: border-box;
}

.header-box-1 {
	font-family: Source Han Sans;
	font-size: 30rpx;
	font-weight: 500;
	line-height: 60rpx;
	color: #f4ac82;
}

.header-box-2 {
	font-size: 44rpx;
	font-weight: 600;
	line-height: 63rpx;
	letter-spacing: 0em;
	color: #203877;
}

.m-b-10 {
	margin-bottom: 10rpx;
}

.header-box-3 {
	display: flex;
	align-items: center;
}

.cri {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: #817d8e;
	margin-right: 12rpx;
}

.header-text {
	font-size: 22rpx;
	font-weight: 500;
	line-height: 46rpx;
	color: #817d8e;
}

.hudong {
	height: 174rpx;
	box-sizing: border-box;
	width: 100%;
	margin-top: 20rpx;
	border-radius: 12rpx;
	opacity: 1;
	background: url('https://tranalioss.shanyitong.com/volumePricing/huodong-icon.png');
	background-repeat: no-repeat;
	background-size: 100% 202rpx;
	padding-left: 32rpx;
	padding-right: 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.hudong-left {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.hudong-right {
	width: 176rpx;
	height: 70rpx;
	background: linear-gradient(270deg, #3d78f6 13%, #57b0ec 100%);
	font-size: 28rpx;
	font-weight: bold;
	text-align: center;
	line-height: 70rpx;
	border-radius: 36rpx;
	color: #fff;
}

.hudong-1 {
	font-size: 34rpx;
	font-weight: 500;
	color: #000000;
	margin-bottom: 25rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
}

.huodong-left-icon {
	width: 12rpx;
	height: 24rpx;
	margin-left: 18rpx;
}

.hudong-2 {
	font-size: 26rpx;
	font-weight: normal;
	color: #7a8190;
}

.hudong-text {
	color: #e02205;
}

.youhiu {
	width: 100%;
	margin-top: 20rpx;
	display: flex;
	gap: 20rpx;
}

.youhiu-1 {
	width: 100%;
	padding: 30rpx 30rpx 25rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 140rpx;
	border-radius: 12rpx;
	background: linear-gradient(183deg, #e7f7f6 4%, #feffff 95%);
}

.youhiu-2 {
	width: 100%;
	padding-left: 32rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	border-radius: 12rpx;
	background: linear-gradient(180deg, #ffedde -29%, #feffff 68%);
}

.youhiu-1-1 {
	font-size: 30rpx;
	font-weight: 600;
	margin-bottom: 20rpx;
	color: #091211;
}

.youhiu-1-2 {
	font-size: 22rpx;
	font-weight: 500;
	color: #566366;
}

.fuwu {
	box-sizing: border-box;
	border-radius: 12rpx;
	padding: 18rpx 30rpx;
	margin-bottom: 40rpx;
	background: linear-gradient(0deg, #ffffff, #ffffff), #ffffff;
}

.fuwu-img {
	width: 40rpx;
	height: 40rpx;
	margin-right: 24rpx;
}

.fuwu-tit {
	font-size: 34rpx;
	font-weight: 600;
	color: #2c2c2c;
}

.fuwu-box {
	display: flex;
	align-items: center;
	width: 50%;
	margin-bottom: 20rpx;
	margin-top: 20rpx;
}

.fuwu-box-1 {
	padding: 15rpx;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.notification-container {
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	padding: 18rpx 30rpx;
	background: rgba(247, 250, 254, 0.8);
	border-radius: 12rpx;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
}

.bell-icon {
	width: 38rpx;
	height: 38rpx;
	margin-right: 10rpx;
}

.notification-text {
	font-size: 24rpx;
	color: #7a8190;
}

.highlight-text {
	font-size: 24rpx;
	color: #e02205;
}

.date-text {
	font-size: 24rpx;
	color: #7a8190;
	margin-left: 20rpx;
}

/* pages/index/index.wxss */
.promotion-section {
	width: 100%;
}

.promotion-title-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 36rpx;
}

.promotion-title {
	font-size: 32rpx;
	font-weight: 600;
	padding-left: 10rpx;
}

.promotion-heder {
	display: flex;
	align-items: center;
}

.line {
	width: 6rpx;
	height: 32rpx;
	border-radius: 0px 2rpx 0px 0px;
	background: #15377d;
	margin-left: 7rpx;
}

.more-link {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #949596;
}

.tab-container {
	display: flex;
	justify-content: space-around;
}

.tab-item {
	position: relative;
	text-align: center;
	cursor: pointer;
	box-sizing: border-box;
	width: 211rpx;
	height: 141.43rpx;
	border-radius: 13rpx;
	font-size: 28rpx;
	font-weight: bold;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 18rpx 4rpx 0;
}

.gaosu-img {
	width: 42rpx;
	height: 42rpx;
	margin-bottom: 10rpx;
}

.tab-item.active {
	background: url('https://tranalioss.shanyitong.com/volumePricing/xiaosanjiao-icon.png');
	background-size: 211rpx 141.43rpx;
	background-repeat: no-repeat;
	color: white;
}

.tab-item.active1 {
	background: url('https://tranalioss.shanyitong.com/volumePricing/xiaosan-bai-icon.png');
	background-size: 211rpx 141.43rpx;
	background-repeat: no-repeat;
	color: #525d6d;
}

.tab-item .triangle {
	display: none;
	width: 0;
	height: 0;
	border-left: 10rpx solid transparent;
	border-right: 10rpx solid transparent;
	border-top: 10rpx solid #347dff;
	border-radius: 10rpx;
	position: absolute;
	bottom: -10rpx;
	left: 50%;
	transform: translateX(-50%);
}

.tab-item.active .triangle {
	display: block;
}

.promotion-details {
	background: linear-gradient(180deg, #f6f9fe 0%, #ffffff 100%);
	border-radius: 10rpx;
	margin-top: 22rpx;
}

.promotion-header {
	height: 132rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	background: url('https://tranalioss.shanyitong.com/volumePricing/cai-top-icon.png');
	background-size: 700rpx 132rpx;
	background-repeat: no-repeat;
}

.promotion-name {
	width: 260rpx;
	text-align: center;
	font-size: 28rpx;
	font-weight: 700;
	color: #363d50;
	margin-left: 16rpx;
}

.details-button {
	display: flex;
	align-items: center;
	color: #ffffff;
	border: none;
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
	font-size: 26rpx;
}

.discount-info {
	margin-bottom: 20rpx;
	padding: 0 39rpx;
}

.dis-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.discount-highlight {
	font-size: 24rpx;
	color: #a2a2a2;
	margin-bottom: 10rpx;
}

.discount-tit {
	font-size: 24rpx;
	font-weight: 500;
	color: #156fff;
	margin-left: 7rpx;
}

.discount-value {
	font-size: 40rpx;
	color: #ec4e4c;
	font-weight: 500;
}

.additional-info {
	font-size: 20rpx;
	font-weight: 500;
	color: #a2a2a2;
	display: flex;
	align-items: center;
}

.add-shu {
	margin: 0 39rpx 0 29rpx;
}

.implementation-object {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	background: #eaf2ff;
	font-size: 24rpx;
	font-weight: normal;
	line-height: normal;
	letter-spacing: 0em;
	color: #a2a2a2;
	padding: 18rpx 23rpx 15rpx;
	border-radius: 15rpx;
	margin: 0 39rpx;
}

.date-range {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	font-size: 24rpx;
	font-weight: normal;
	line-height: normal;
	letter-spacing: 0em;
	color: #a2a2a2;
	padding: 18rpx 17rpx;
	border-radius: 15rpx;
	margin: 0 39rpx;
}

.info-icon,
.calendar-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
}

.section1 {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding: 36rpx 0;
	margin: 0 36rpx;
	border-bottom: 1rpx solid #d8d8d8;
}

.section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding: 36rpx;
}

.section-title {
	font-size: 28rpx;
	color: #36435a;
	font-weight: bold;
}

.section-more {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 24rpx;
	color: #a2a2a2;
}

/* index.wxss */
.containers {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
}

.popup {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
	min-height: 483rpx;
	box-sizing: border-box;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
}

.popup-header-text {
	text-align: center;
	font-size: 36rpx;
	font-weight: 500;
	color: #000000;
}

.popup-content {
	height: 600rpx;
	overflow-y: auto;
}

.discount-item {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	transition: background-color 0.3s;
	/* 平滑过渡效果 */
}

.discount-item.selected {
	background: #ffdace;
}

.text1 {
	font-size: 30rpx;
	font-weight: 700;
	color: #2f3035;
	margin-bottom: 20rpx;
}

.text2 {
	font-size: 26rpx;
	font-weight: 500;

	color: #2f3035;
	margin-bottom: 20rpx;
}

.text4 {
	font-size: 36rpx;
	font-weight: 500;

	color: #ff3c00;
}

.text5 {
	font-size: 26rpx;
	font-weight: 500;

	color: #ff3c00;
}

.text3 {
	font-size: 24rpx;
	color: #888ea6;
}

.table {
	background-color: #fff;
	border-radius: 10rpx;
	overflow: hidden;
}

.table-header,
.table-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.table-header {
	background: #399ffe;
	color: #fff;
}

.header-cell,
.cell {
	flex: 1;
	text-align: center;
}

.even {
	background-color: #fff;
}

.odd {
	background: #eef4fd;
}

.apply-button {
	width: 620rpx;
	height: 92rpx;
	text-align: center;
	line-height: 90rpx;
	margin: 40rpx auto;
	border-radius: 8rpx;
	background: linear-gradient(180deg, #f7b77f 0%, #ec8733 100%), #ff6503;
	color: #fff;
	font-size: 30rpx;
	font-weight: 500;
}

.popup-text {
	font-size: 26rpx;
	font-weight: normal;
	line-height: 54rpx;
	color: #393939;
}

.popup-tex image {
	width: 100%;
	height: 100%;
}

.left-icon {
	width: 28rpx;
	height: 28rpx;
	margin-left: 12rpx;
}

.left-icon-1 {
	width: 24rpx;
	height: 24rpx;
	margin-left: 10rpx;
}

.left-icon-2 {
	width: 42rpx;
	height: 42rpx;
	border-radius: 4px;
	background: #efefef;
}

.no-data {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-bottom: 300rpx;
}

.nodata-icon {
	width: 286rpx;
	height: 286rpx;
}
.no-data-title {
	color: #949596;
	font-size: 28rpx;
}

.popup1 {
	width: 615rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
	box-sizing: border-box;
}

.popup1-header {
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	margin-bottom: 20rpx;
}

.popup1-text {
	text-align: center;
	font-size: 28rpx;
	font-weight: normal;
	color: #a9a9a9;
	line-height: 42rpx;
	word-break: break-all;
}

.popup1-content {
	height: 600rpx;
	overflow-y: auto;
}

.btn-box {
	display: flex;
	margin-top: 36rpx;
}

.cancel-btn {
	width: 246rpx;
	height: 70rpx;
	border-radius: 10rpx;
	background: #ffffff;
	border: 1rpx solid #6b7073;
	margin-right: 34rpx;
	text-align: center;
	line-height: 70rpx;
	box-sizing: border-box;
}

.sure-btn {
	width: 246rpx;
	height: 70rpx;
	border-radius: 10rpx;
	background: linear-gradient(180deg, #f7b77f 0%, #ec8733 100%), #ff6503;
	text-align: center;
	line-height: 70rpx;
	color: #fff5f3;
	box-sizing: border-box;
}

.swiper-view-home {
	width: 670rpx;
	height: 84rpx;
	width: 100%;
	box-sizing: border-box;
	padding: 18rpx 30rpx;
	background: rgba(247, 250, 254, 0.8);
	border-radius: 12rpx;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
	overflow: hidden;
}

.swiper-view-home .width-more {
	width: 100%;
	height: 66rpx;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	padding-right: 20rpx;
}

.swiper-view-home swiper,
.swiper-view-home swiper-item {
	width: 100%;
	height: 66rpx;
}

.swiper-view-home .width-more .swiper-item-text {
	flex: 1;
	font-size: 24rpx;
	color: #333;
	height: 66rpx;
	line-height: 66rpx;
	max-width: 480rpx;
}
</style>