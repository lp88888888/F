<template>
	<!-- 背景色 -->
	<view class="my_bg" :style="{ 'background-image': vipcardColor[vipcardtype].bgcolor }"></view>
	<view class="my_page">
		<up-navbar bgColor="transparent" placeholder :fixed="true">
			<template #left>
				<view> </view>
			</template>
			<template #center>
				<text></text>
			</template>
		</up-navbar>

		<!-- 用户信息 -->
		<view class="info" :style="{ paddingBottom: vipqrstatus ? '499rpx' : '0', marginBottom: vipqrstatus ? '0' : '32rpx' }">
			<!-- 用户信息模块 -->
			<view class="info_user">
				<image class="info_user_avatar" :src="userInfo.headImageUrl || imgUrl + 'avatar-01.png'" mode="" @click="navUserTo"></image>
				<view class="info_user_r">
					<view class="info_user_r_t">
						<text class="info_user_r_t_txt" @click="navUserTo">{{ userInfo.nickName ? userInfo.nickName : '游客' }}</text>
						<view style="position: relative" @click="toLinkPath()">
							<image class="info_user_r_t_img" :src="`${imgUrl}static/my_msg_icon.png`" mode=""></image>
							<text class="message-dot" v-if="dot"></text>
						</view>
						<image class="info_user_r_t_img" :src="`${imgUrl}static/my_set_icon.png`" mode="" @click="toNav('/pages_A/setting/setting')"></image>
					</view>
					<view class="info_user_r_b">
						<view class="info_user_r_b_ticket" @click="toLink('/pages_C/coupon/index')">
							<image class="info_user_r_b_ticket_img" :src="vipcardColor[vipcardtype].ticketImg" mode=""> </image>
							<text class="info_user_r_b_ticket_txt" :style="{ color: vipcardColor[vipcardtype].color }">我的卡券</text>
						</view>
						<image class="info_user_r_b_img" :src="vipcardColor[vipcardtype].skinImg" mode="" @click="handleSelDw"></image>
					</view>
				</view>
			</view>

			<!-- 会员卡片 -->
			<view class="info_vip">
				<image class="info_vip_bg" :src="themeInfoList.cardImg" mode=""></image>
				<view class="vip_box">
					<view class="vip_box_t">
						<image class="vip_box_t_img" :src="`${imgUrl}static/my_vip_icon.png`" mode=""></image>
						<view class="vip_box_t_texts">
							<text class="vip_box_t_texts_img">{{ themeInfoList.name }}</text>
							<text class="vip_box_t_texts_txt" :style="{ color: vipcardColor[vipcardtype].color1 }">万里长安会员俱乐部</text>
						</view>
					</view>
					<view class="vip_box_b" v-if="!vipqrstatus">
						<view class="vip_box_b_item" @click.stop="toLink('/pages_A/pointslist/index')">
							<text class="vip_box_b_item_txt" :style="{ color: vipcardColor[vipcardtype].color2 }">我的积分</text>
							<view class="vip_box_b_item_nums">
								<text class="vip_box_b_item_nums_txt" :style="{ color: vipcardColor[vipcardtype].color3 }">{{ getAlljf() }}</text>
								<uni-icons type="right" size="11" :color="vipcardColor[vipcardtype].color3"></uni-icons>
							</view>
						</view>
						<view class="vip_box_b_item">
							<text class="vip_box_b_item_txt" :style="{ color: vipcardColor[vipcardtype].color2 }">更多会员权益</text>
							<view class="vip_box_b_item_nums">
								<text class="vip_box_b_item_nums_txt1" @click="toNav('/pages_C/member/index')" :style="{ color: vipcardColor[vipcardtype].color3 }"
									>会员中心</text
								>
								<uni-icons type="right" size="11" :color="vipcardColor[vipcardtype].color3"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 动物模块 -->
			<view class="dw_box" :style="{ bottom: vipqrstatus ? '632rpx' : '133rpx' }">
				<image class="dw_box_img" :src="themeInfoList.mascotIcon" mode="widthFix"></image>
				<!-- <view class="dw_box_btn" :style="{ background: vipcardColor[vipcardtype].btcolor }" @click="handlevipqr">
					<template v-if="!vipqrstatus">
						<image class="dw_box_btn_img" :src="`${imgUrl}static/my_vip_qr.png`" mode=""></image>
						<text class="dw_box_btn_txt">会员码</text>
					</template>
					<template v-else>
						<uni-icons type="top" size="12" color="#ffffff"></uni-icons>
						<text class="dw_box_btn_txt">收起</text>
					</template>
				</view> -->
			</view>

			<!-- 提示模块 -->
			<view class="tipsbox" v-if="knowstatus === '0'">
				<image class="tips_bg" :src="`${icoUrl}my_dw_tips.png`" mode="widthFix"></image>
				<view class="tips_main">
					<view class="tips_main_l">
						<text class="tips_main_l_txt" :style="{ color: themeStore.themeColors.$primaryColor }">这里有更多我的小伙伴哦 </text>
						<text class="tips_main_l_txt" :style="{ color: themeStore.themeColors.$primaryColor }">快来看看吧～</text>
					</view>
					<view class="tips_main_r" :style="{ background: themeStore.themeColors.$butColor }" @click="handleKonw">
						<text class="tips_main_r_txt">我知道了</text>
					</view>
				</view>
			</view>

			<!-- 二维码模块 -->
			<view class="qrbox" :style="{ background: vipcardColor[vipcardtype].qrcolor }" v-if="vipqrstatus">
				<view class="qr_in">
					<image class="qr_in_img" :src="`${imgUrl}static/my_vip_qrcode.png`" mode=""></image>
					<view class="qr_in_info" @click="handlecopyvipcode('5525456995521365')">
						<text class="qr_in_txt">5525456995521365</text>
						<image class="qr_in_copy" :src="`${imgUrl}static/my_vipnum_copy.png`" mode=""></image>
					</view>
				</view>
			</view>

			<!-- 选择动物弹窗 -->
			<view class="dwpop" v-if="dwListStatus">
				<image class="dwpop_bg" :src="vipcardColor[vipcardtype].selBgImg" mode=""></image>
				<view class="popmain">
					<view class="pop_t">
						<text class="pop_t_txt" :style="{ color: vipcardColor[vipcardtype].color }">{{ themeNewList[dwselindex].description }}</text>
						<view class="pop_t_btn" :style="{ backgroundImage: vipcardColor[vipcardtype].seldwbtnbg }" @click="changeDwSumbit">
							<text class="pop_t_btn_txt">确认</text>
						</view>
					</view>
					<view class="pop_list">
						<view class="pop_item" v-for="(item, index) in themeNewList" :key="index" @click="handleChangeDw(index)">
							<image class="pop_item_img" :class="{ active: dwselindex === index }" :src="item.mascotIcon" mode="aspectFit"> </image>
							<view class="pop_item_box" :style="{ background: dwselindex == index ? vipcardColor[vipcardtype].color : '#ffffff' }"> </view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 我的订单 -->
		<view class="orderbox" :style="{ background: themeStore.themeColors.$mineCardBg, boxShadow: themeStore.themeColors.$mineCardBoxShadow }">
			<view class="card_icon_card_header">
				<view class="card_icon_card_header_lt">
					<image class="card_icon_card_header-img" :src="icoUrl + 'icon_bg.png'" mode=""> </image>
					<text class="title_text_primary">我的订单</text>
					<image class="card_title_icon" :src="imgUrl + 'static/card_lt_icon.png'" mode=""></image>
				</view>
			</view>

			<view class="gridlist">
				<view class="gridlist_item" v-for="(item, index) in gridList" :key="index" @click="toTabLink(item)">
					<image :src="item.iconUrl" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">{{ item.entryName }}</text>
				</view>
			</view>
		</view>

		<!-- 合伙人\邀请 -->
		<!-- <view class="activitybox">
			<view class="activity_item" @click="isDistributorFun()">
				<view class="activity_bg"></view>
				<view class="activity_bg1"></view>
				<image class="activity_img" :src="`${imgUrl}static/my_people.png`" mode=""></image>
				<view class="activity_r">
					<text class="activity_txt">成为合伙人</text>
					<view class="activity_btn">
						<text decode class="activity_btn_txt">Go &gt;</text>
					</view>
				</view>
			</view>
			<view class="activity_item ac_bggreen" @click="toLink('')">
				<view class="activity_bg"></view>
				<view class="activity_bg1"></view>
				<image class="activity_img" :src="`${imgUrl}static/my_invite.png`" mode=""></image>
				<view class="activity_r">
					<text class="activity_txt">邀请有礼</text>
					<view class="activity_btn">
						<text decode class="activity_btn_txt">Go &gt;</text>
					</view>
				</view>
			</view>
		</view> -->

		<!-- 其他服务 -->
		<view class="otherbox" :style="{ background: themeStore.themeColors.$mineCardBg, boxShadow: themeStore.themeColors.$mineCardBoxShadow }">
			<view class="card_icon_card_header">
				<view class="card_icon_card_header_lt">
					<image class="card_icon_card_header-img" :src="icoUrl + 'icon_bg.png'" mode=""> </image>
					<text class="title_text_primary">其他服务</text>
					<image class="card_title_icon" :src="imgUrl + 'static/card_lt_icon.png'" mode=""></image>
				</view>
			</view>

			<view class="other_gird">
				<view @click="toLink('/pages_A/car/myCar')" class="gridlist_item">
					<image :src="`${imgUrl}static/my_car_s.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">我的车辆</text>
				</view>
				<view @click="toEnterprise" class="gridlist_item">
					<image :src="`${imgUrl}static/my_enterprise_s.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">我的企业</text>
				</view>
				<view v-if="qyShow" @click="toLink('/pages_C/enterprise/userReview')" class="gridlist_item">
					<image :src="`${imgUrl}static/my_enterprise_car.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">企业车辆</text>
				</view>
				<view @click="toLink('/pages_A/address/index')" class="gridlist_item">
					<image :src="`${imgUrl}static/my_address_s.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">我的地址</text>
				</view>
				<view @click="toLink('/pages_F/myInvoice/index')" class="gridlist_item">
					<image :src="`${imgUrl}wd-fp.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">我的发票</text>
				</view>
				<view @click="toLink('/pages_B/directRetail/newCollection')" class="gridlist_item">
					<image :src="`${imgUrl}static/my_collect_s.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">我的收藏</text>
				</view>
				<view @click="toLink('/pages_F/appointment/myAppointment')" class="gridlist_item">
					<image :src="`${imgUrl}static/my_sub_s.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">我的预约</text>
				</view>
				
				<view @click="toLink('/pages_B/scenicSpotTicket/contactsList?isshow=' + 'false')" class="gridlist_item">
					<image :src="`${imgUrl}static/my_person_s.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">常用联系人</text>
				</view>
				<view @click="toLink('/pages_D/snapShare/index')" class="gridlist_item">
					<image :src="`${imgUrl}static/my_hand_patted_s.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">随手拍</text>
				</view>
				<view @click="toLink('/pages_F/errorcorrection/mycorrections')" class="gridlist_item">
					<image :src="`${imgUrl}wd-jc.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">我的纠错</text>
				</view>
				<view @click="handleGoOld" class="gridlist_item">
					<image :src="`${imgUrl}static/new_old_icon.png`" class="gridlist_item_img"></image>
					<text class="gridlist_item_txt">适老关怀版</text>
				</view>
			</view>
			<!-- <view class="other_old">
				<view class="old_btn" @click="handleGoOld">
					<text class="old_btn_txt">适老关怀版</text>
				</view>
				<image class="old_img" :src="`${imgUrl}static/my_old_icon.png`" mode=""></image>
			</view> -->
		</view>
		<view class="banner" v-if="isshowtyg" @click="toNavEX()">
			<image :src="bannerInfo.imageUrl" mode="aspectFill" class="banner-img" />
		</view>
		
		<!-- 一键救援悬浮 -->
		<!-- <view class="kf-box" @click="toLink('')">
			<image class="kf-img" :src="`${imgUrl}static/my_pop_btn.png`"></image>
		</view> -->
		
		<!-- 完成任务 -->
		<view class="taskcard card-w" v-if="taskStatus == 1">
			<view class="card_icon_card_header">
				<view class="card_icon_card_header_lt">
					<image class="card_icon_card_header-img" :src="icoUrl + 'icon_bg.png'"></image>
					<text class="title_text_primary">完成任务</text>
					<image class="card_title_icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
				</view>
		
				<view class="card-icon-card-header_rt">
					<image class="card-icon-card-header_rt_img"
						:src="imgUrl + 'static/card_jf_icon.png'"></image>
					<view class="card-icon-card-header_rt_r" @click="handleCloseTask">
						<text class="card-icon-card-header_rt_r_txt">不再提示任务</text>
						<uni-icons type="closeempty" size="12" color="#909599"></uni-icons>
					</view>
				</view>
			</view>
		
			<view class="card-item">
				<view class="rw_item card-w" v-for="(item, index) in taskList" :key="index">
					<image class="rw_item_img" :src="icoUrl+item.icon"></image>
					<text class="rw_item_text">{{ item.name }}</text>
					<view class="rw_item_btn-1" v-if="item.info?.getPoint">
						<text class="rw_item_btn_text-1">奖励已发放</text>
					</view>
					<view class="rw_item_btn" v-else @click="toLink(item.path)">
						<text class="rw_item_btn_text">领{{ item.info?.point || '' }}积分</text>
					</view>
				</view>
			</view>
		</view>
		
		<PageDurationTracker pageName="我的" />
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getMiniUserInfo } from '@/api/login';
import { toast } from '@/utils/common';
import PageDurationTracker from '@/components/PageDurationTracker.vue'
import { onLoad, onShow } from '@dcloudio/uni-app';
import { details, getmemberpointsDetailStatistics, getmembermakePoint } from '@/api/member';
import { toNav, toBack, toLau } from '@/utils/route';
// 用户信息
import { useAppStore } from '@/store/modules/app';
import { bannerList, experienceInfo, gridMenu, tiyanguan } from '@/api/home';
import { enterpriseUserIdentity } from '@/api/car';
import { isDistributor } from '@/api/distribution';
import { distributorDetail } from '@/api/distribution';
import { CurrentPage, showAlert2, openAPPLocation } from '@/utils/util';
// 主题
import { useTheme } from '@/composables/useTheme';
import { imgUrl } from '@/config';
const { themeStore, pageTheme } = useTheme();
// const userInfo = ref(uni.getStorageSync('userInfo') || {});
const userInfo = computed(() => {
	return appStore.userInfo || uni.getStorageSync('userInfo') || {};
});
// 判断消息
const dot = ref(false);
import { useMqttStore } from '@/store/modules/mqtt';
const messageStore = useMqttStore();
const list = ref(messageStore.swiperInfo);
const gridList = ref([]);

const userInfonew = ref(uni.getStorageSync('userInfo').id);
const icoUrl = ref(themeStore.imgUrl);
const appStore = useAppStore();
// const isLogin = ref(appStore.checkLogin());
const isLogin = computed(() => {
	return appStore.checkLogin();
});
const carNumber = ref(uni.getStorageSync('carNumber'));
const memberInfo = ref('');
// 是否企业
const qyShow = computed(() => {
	let userInfo = uni.getStorageSync('userInfo');
	if (userInfo && userInfo.memberType != 1) {
		return true;
	}
	return false;
});
const isshowtyg = ref('');
const checkExperiencePopup = async () => {
	const res: any = await tiyanguan();
	if (res.data == 1) {
		isshowtyg.value = true;
	} else {
		isshowtyg.value = false;
	}
};
const toTabLink = (item) => {
	console.log('电机的tab菜单', item);
	// '待评价'
	if (item.jumpPage != '/') {
		toNav(item.jumpPage);
	} else {
		toast('该功能正在快马加鞭赶来的路上');
	}
};
const toLinkPath = async () => {
	const isLoggedIn = await toIsLogin();
	if (isLoggedIn) {
		uni.navigateTo({
			url: '/pages_A/message/index',
		});
		dot.value = false;
	}
};
const pad2 = (n: number) => String(n).padStart(2, '0');
const formatToMinuteWithSec00 = (d: Date) => {
	const y = d.getFullYear();
	const m = pad2(d.getMonth() + 1);
	const day = pad2(d.getDate());
	const hh = pad2(d.getHours());
	const mm = pad2(d.getMinutes());
	return `${y}-${m}-${day} ${hh}:${mm}:00`;
};
// 根据业务类型查询金刚列表
const businessTypeFun = async (val) => {
	const now = new Date();
	const params = {
		startTime: formatToMinuteWithSec00(now),
		endTime: formatToMinuteWithSec00(now),
		secondaryIconPath: val,
	};
	const res: any = await gridMenu('6', params);
	console.log("我的页面订单金刚区",res)
	if (res?.code == 200) {
		const truedata = res.rows.filter((item) => item.enabled == 1);
		// #ifdef APP-HARMONY
		const harmonydata = truedata.filter((item) => item.showDeviceTypes.includes('2'));
		gridList.value = harmonydata;
		// #endif
		// #ifndef APP-HARMONY
		gridList.value = truedata;
		// #endif
	}
};

// watch(
//   [isLogin, () => themeStore.imgUrl],
//   ([newLogin, newImgUrl], [oldLogin, oldImgUrl]) => {
//     // 处理登录状态变化
//     if (newLogin !== oldLogin) {
//       if (newLogin) {
//         console.log('已登录');
//         getUserInfo();
//       } else {
//         console.log('未登录');
//       }
//     }

//     // 处理 imgUrl 变化
//     if (newImgUrl !== oldImgUrl) {
//       icoUrl.value = newImgUrl;
//     }
//   }
// );
// 监听 messageStore.swiperInfo 的变化

// 会员卡主题颜色
const vipcardColor = computed(() => {
	let arr = vipcardOldColor.value.filter((item) => !item.type);
	let newArr = vipcardOldColor.value.filter((item) => item.type == pageTheme.value);
	return [...newArr, ...arr];
});
const vipcardOldColor = ref([
	{
		title: '金丝猴.金绒灵捷卡',
		bgcolor: 'linear-gradient(to bottom, #CBEBFE, #F5FBFF)',
		color: '#4881F5',
		btcolor: '#4881F5',
		color1: '#E0F2FF',
		color2: '#E0F2FF',
		color3: '#F4FBE9',
		qrcolor: '#1C57CE',
		seldwbtnbg: 'linear-gradient( to bottom left, #4881F5, #82AAF9)',
		ticketImg: imgUrl + 'vipcard/ticket0-blue.png',
		skinImg: imgUrl + 'vipcard/skin0-blue.png',
		selBgImg: imgUrl + 'vipcard/sel_bg0-blue.png',
		type: 'blue',
	},
	{
		title: '金丝猴.金绒灵捷卡',
		bgcolor: 'linear-gradient(to bottom, #C7E7A4, #fcfffc)',
		color: '#628F2F',
		btcolor: '#8FB563',
		color1: '#B2D78B',
		color2: '#D1EEB3',
		color3: '#F4FBE9',
		qrcolor: '#618F2C',
		seldwbtnbg: 'linear-gradient( to bottom left, #759E44, #ACD483)',
		ticketImg: imgUrl + 'vipcard/ticket0.png',
		skinImg: imgUrl + 'vipcard/skin0.png',
		selBgImg: imgUrl + 'vipcard/sel_bg0.png',
		type: 'green',
	},
	{
		title: '朱鹮.红羽暖心卡',
		bgcolor: 'linear-gradient(to bottom, #FE997D, #fcfffc)',
		color: '#E65328',
		btcolor: '#F06435',
		color1: '#F78159',
		color2: '#FAEDE8',
		color3: '#FFF4E5',
		qrcolor: '#C62902',
		seldwbtnbg: 'linear-gradient( to bottom left, #CF4314, #EE5E2E)',
		ticketImg: imgUrl + 'vipcard/ticket1.png',
		skinImg: imgUrl + 'vipcard/skin1.png',
		selBgImg: imgUrl + 'vipcard/sel_bg1.png',
	},
	{
		title: '羚羊.青角稳行卡',
		bgcolor: 'linear-gradient(to bottom, #E9A677, #fcfffc)',
		color: '#AC6840',
		btcolor: '#B86F47',
		color1: '#CC825A',
		color2: '#F5EEE9',
		color3: '#FFFFFF',
		qrcolor: '#904822',
		seldwbtnbg: 'linear-gradient( to bottom left, #964D23, #B86934)',
		ticketImg: imgUrl + 'vipcard/ticket2.png',
		skinImg: imgUrl + 'vipcard/skin2.png',
		selBgImg: imgUrl + 'vipcard/sel_bg2.png',
	},
	{
		title: '熊猫.胖达悠享卡',
		bgcolor: 'linear-gradient(to bottom, #B9BDBD, #fcfffc)',
		color: '#3A3A3A',
		btcolor: '#303B3B',
		color1: '#A8A8A8',
		color2: '#E6E8E8',
		color3: '#FFFFFF',
		qrcolor: '#04110F',
		seldwbtnbg: 'linear-gradient( to bottom left, #031717, #484C4C)',
		ticketImg: imgUrl + 'vipcard/ticket3.png',
		skinImg: imgUrl + 'vipcard/skin3.png',
		selBgImg: imgUrl + 'vipcard/sel_bg3.png',
	},
]);

const themelist = computed(() => {
	console.log('我的页面获取的动物数据', uni.getStorageSync('themlist'));
	return uni.getStorageSync('themlist');
});
const themeNewList = computed(() => {
	let arr = themelist.value.filter((item) => !item.type);
	let startArr = themelist.value.filter((item) => item.type == pageTheme.value);
	return [...startArr, ...arr];
});
const themeInfoList = computed(() => {
	return themeNewList.value[vipcardtype.value];
});
// vip会员擦片类型
const vipcardtype = ref(0);
const dwListStatus = ref(false);
// 打开选择动物
const handleSelDw = () => {
	dwListStatus.value = !dwListStatus.value;
	dwselindex.value = JSON.parse(JSON.stringify(vipcardtype.value));
};
// 选择动物
const dwselindex = ref(0);
const handleChangeDw = (index) => {
	dwselindex.value = index;
};
// 确认选择动物
const changeDwSumbit = () => {
	vipcardtype.value = JSON.parse(JSON.stringify(dwselindex.value));
	dwListStatus.value = false;
	uni.setStorageSync('vipCardType', vipcardtype.value);
	uni.$emit('updatevipcardtype', { index: vipcardtype.value });
};

// 查看会员码
const vipqrstatus = ref(false);
const handlevipqr = async () => {
	const isLoggedIn = await toIsLogin();
	if (isLoggedIn) {
		vipqrstatus.value = !vipqrstatus.value;
	}
};

// 第一次提示框
const knowstatus = ref('0');
const handleKonw = () => {
	knowstatus.value = '1';
	uni.setStorageSync('onceinit', '1');
};

// 判断是否登录
const toIsLogin = async () => {
	if (isLogin.value) {
		return true;
	}
	return new Promise((resolve) => {
		showAlert2(
			'提示',
			'本次操作需要您进行登录验证',
			true,
			'取消',
			'确定',
			(success) => {
				console.log('点击success', success);
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages_A/login/login?fromPage=' + CurrentPage(),
				});
				// #endif
				// #ifdef APP
				uni.navigateTo({ url: '/pages_A/login_password/login' });
				// #endif
				resolve(false);
			},
			(err) => {
				console.log('取消', err);
				resolve(false);
			}
		);
	});
};

// 点击头像
const navUserTo = () => {
	if (userInfo.value.nickName) {
		toNav('/pages_A/personalinformation/personal');
	} else {
		// #ifdef MP-WEIXIN
		uni.navigateTo({
			url: '/pages_A/login/login?fromPage=' + CurrentPage(),
		});
		// #endif
		// #ifdef APP
		uni.navigateTo({ url: '/pages_A/login_password/login' });
		// #endif
	}
};

// 复制会员码
const handlecopyvipcode = (code) => {
	uni.setClipboardData({
		data: code,
		success: () => {
			toast('复制成功');
		},
	});
};

// 跳转逻辑
const toLink = async (path = '') => {
	if (!path) {
		toast('该功能正在快马加鞭赶来的路上');
		return;
	}
	const isLoggedIn = await toIsLogin();
	if (isLoggedIn) {
		toNav(path);
	}
};

const bannerInfo = ref({});
const detailsFun = async () => {
	const res = await details();
	memberInfo.value = res.data;
};

const getMenuData = async () => {
	// const res = await bannerList(5);
	// bannerInfo.value = res.rows[0];
	try {
		const res = await bannerList(5);
		console.log('查询的banner', res);
		bannerInfo.value = res.rows[0] || {};
	} catch (err) {
		console.log('-0-0-0-0--,,,,', err);
	}
};
watch(
	() => themeStore.imgUrl,
	(newVal) => {
		icoUrl.value = newVal;
	}
);
watch(
	() => messageStore?.swiperInfo,
	(newVal) => {
		console.log('swiperInfo 发生变化：', newVal);
		list.value = newVal || [];
		if (newVal.length > 0) {
			dot.value = true;
		}
	},
	{
		deep: true,
		immediate: true,
	}
);
// watch(userInfo, (val,value) => {
// 	if(val != value){
// 		getUserInfo()
// 		detailsFun()
// 		getMenuData()
// 		getExperienceInfo()
// 		console.log('vuex userInfo 变了', val)
// 		console.log('vuex userInfo 变value了', value)
// 	}

// }, { deep: true })
// 获取用户信息
const getUserInfo = async () => {
	const res = await getMiniUserInfo();
	// userInfo.value = res.clazz
	// integralTotalNumber.value = Number(res.clazz.userPoints || 0) + Number(res.clazz.activityIntegral || 0)
	appStore.updateUserInfo(res.clazz);
};

// 积分
const getAlljf = () => {
	if (!isLogin.value) return 0;
	const info = uni.getStorageSync('userInfo');
	if (!info.pointsAccount) return 0;
	return info.pointsAccount.commonPoint || 0;
};

const auditStatus = ref(false);
const applyStatus = ref('');

// 获取报名详情（编辑态用）
const getExperienceInfo = async () => {
	const res = await experienceInfo();
	if (res.code === 200) {
		auditStatus.value = res?.data ? true : false;
		applyStatus.value = res?.data?.auditStatus;
		console.log('++++', auditStatus.value);
	}
};
const userIdentity = ref({}); // 企业身份 0-无 1-普通成员，2-企业管理员
// 获取当前用户企业身份
const getEnterpriseUserIdentity = async () => {
	const res = await enterpriseUserIdentity();
	if (res.code === 200) {
		userIdentity.value = res.data ? res.data[0] : null;
		uni.setStorageSync('userIdentity', res.data);
	}
};
const isEmptyObject = (obj) => {
	// 第一步：先校验类型，排除 null、数组、非对象类型
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		return false;
	}
	// 第二步：判断属性数组长度是否为 0
	return Object.keys(obj).length === 0;
};

const isDistributorFun = async () => {
	const res = await distributorDetail();
	if (res.data && res.data.status == 'NORMAL') {
		uni.navigateTo({
			url: '/pages_A/mystore/index',
		});
	} else if (
		(res.data && res.data.status == 'PENDING_AUDIT') ||
		(res.data && res.data.status == 'REJECTED') ||
		(res.data && res.data.status == 'FROZEN')
	) {
		uni.navigateTo({
			url: '/pages_A/partner/index?type=' + 1,
		});
	} else {
		uni.navigateTo({
			url: '/pages_A/partner/index',
		});
	}
};
const toEnterprise = () => {
	if (!userIdentity.value) {
		toNav('/pages_C/enterprise/index');
	} else if (userIdentity.value.identityType == 1) {
		toNav('/pages_C/enterprise/userReview');
	} else if (userIdentity.value.identityType == 2) {
		toNav('/pages_C/enterprise/myenteprise');
	}
};

onMounted(() => {
	businessTypeFun(pageTheme.value);
	if (userInfo.value.id) {
		// detailsFun();
		getMenuData();
		getExperienceInfo();
		getEnterpriseUserIdentity();
		getPointsinfo();
	}
	checkExperiencePopup();
	// isLogin.value = appStore.checkLogin();
	vipcardtype.value = uni.getStorageSync('vipCardType') || 0;
	knowstatus.value = uni.getStorageSync('onceinit') ? '1' : '0';
	taskStatus.value = uni.getStorageSync('mytaskstatus') || 1;
});
onShow(() => {
	// isLogin.value = appStore.checkLogin();
	carNumber.value = uni.getStorageSync('carNumber');
	businessTypeFun(pageTheme.value);
	if (isLogin.value) {
		getUserInfo();
		// detailsFun();
		getMenuData();
		getExperienceInfo();
		getEnterpriseUserIdentity();
		checkExperiencePopup();
	}
});
// 统计数据
const stats = {
	browse: 32,
	points: 620,
	vouchers: 26,
};

// 会员信息
const member = {
	progress: 1356,
	percent: (1356 / 3000) * 100,
};

// 分销员数据
const sales = {
	withdraw: 128.42,
	monthly: 32.79,
	promotion: 54,
};

// 底部导航
const tabList = [
	{
		icon: 'home',
		text: '首页',
		page: '/pages/index/index',
	},
	{
		icon: 'folder',
		text: '服务',
		page: '/pages/service/service',
	},
	{
		icon: 'lightning',
		text: '一键救援',
		page: '/pages/rescue/rescue',
	},
	{
		icon: 'gift',
		text: '积分商城',
		page: '/pages/mall/mall',
	},
	{
		icon: 'person',
		text: '我的',
		page: '/pages/my/my',
	},
];
const backgroundImage = ref(imgUrl + 'bg_hy.png');
const bgStyle = computed(() => {
	if (!backgroundImage.value) return {};
	return {
		backgroundImage: `url(${backgroundImage.value})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	};
});
const backgroundImage2 = ref(imgUrl + 'static/my-erweima.png');
const backgroundImage3 = ref(imgUrl + 'volumePricing/gr-bg.png');
const backgroundImage4 = ref(imgUrl + 'volumePricing/qy-bg.png');
const bgStyle2 = computed(() => {
	if (!backgroundImage.value) return {};
	return {
		backgroundImage: `url(${backgroundImage2.value})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	};
});
const bgStyle3 = computed(() => {
	if (!backgroundImage3.value) return {};
	return {
		backgroundImage: `url(${backgroundImage3.value})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	};
});
const bgStyle4 = computed(() => {
	if (!backgroundImage4.value) return {};
	return {
		backgroundImage: `url(${backgroundImage4.value})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	};
});
// 当前选中项
const activeIndex = ref(4);

// 跳转方法
const goMemberRights = () =>
	uni.navigateTo({
		url: '/pages/member-rights/member-rights',
	});
const goAllOrders = () =>
	uni.navigateTo({
		url: '/pages/orders/all-orders',
	});
const goOrder = (status) => {
	toast('该功能正在快马加鞭赶来的路上');
	// uni.navigateTo({
	// 	url: `/pages/orders/order-list?status=${status}`,
	// });
};

const goPersonalVehicle = () =>
	uni.navigateTo({
		url: '/pages/vehicle/personal',
	});
const goEnterpriseVehicle = () =>
	uni.navigateTo({
		url: '/pages/vehicle/enterprise',
	});
const toNavEX = () => {
	if (auditStatus.value == false) {
		uni.navigateTo({
			url: '/pages_E/experience/index',
		});
	} else {
		uni.navigateTo({
			url: '/pages_E/experience/registration',
		});
	}
};

const handleGoOld = () =>{
	uni.setStorageSync('oldperson', true);
	toNav('/pages/home/home');
}


// 关闭任务
const taskStatus = ref(1);
const handleCloseTask = () => {
	taskStatus.value = 2;
	uni.setStorageSync('mytaskstatus', 2);
};
// 积分列表
const taskList = ref([{
	name: '加入会员',
	icon: 'vip_icon.png',
	type: '',
	route: '/pages_A/chargingPiles/index',
	info: {
		getPoint: false,
		point: '',
	},
	path: '/pages_C/member/registeredPersonal',
},
{
	name: '绑定车辆',
	icon: 'bdcl_icon.png',
	type: '',
	route: '/pages_D/refuelingRefilling/index',
	info: {
		getPoint: false,
		point: '',
	},
	path: '/pages_A/car/addCar',
},
{
	name: '完善信息',
	icon: 'wsxx_icon.png',
	type: '',
	route: '/pages_B/hotel/hotelist',
	info: {
		getPoint: false,
		point: '',
	},
	path: '/pages_A/personalinformation/personal',
}])
const getPointsinfo = async () => {
	try {
		const res = await getmembermakePoint();
		console.log('我的页面的任务列表', res);
		taskList.value[0].info = res.data.registerPointRule;
		taskList.value[1].info = res.data.bindVehiclePointRule;
		taskList.value[2].info = res.data.completeInfoPointRule;
		const allGetPointTrue = taskList.value.every((item) => {
			return item.info != null && item.info.getPoint === true;
		});
		if (allGetPointTrue) {
			handleCloseTask();
		}
	} catch (err) {
		console.log('---积分规则err----', err);
	}
};
</script>

<style scoped lang="scss">
.my_bg {
	width: 750rpx;
	height: 626rpx;
	background-image: linear-gradient(to bottom, var(--bgcolor), #fcfffc);
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: -1;
}

.my_page {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 100rpx;
	box-sizing: border-box;

	// 用户信息、会员信息
	.info {
		width: 702rpx;
		position: relative;
		margin-bottom: 32rpx;

		// 用户信息
		.info_user {
			width: 702rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 24rpx;

			.info_user_avatar {
				width: 134rpx;
				height: 134rpx;
				border-width: 2rpx;
				border-style: solid;
				border-color: #ffffff;
				border-radius: 50%;
				margin-right: 32rpx;
			}

			.info_user_r {
				flex: 1;
				height: 134rpx;
				padding-top: 11rpx;
				padding-bottom: 15rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				box-sizing: border-box;

				.info_user_r_t {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.info_user_r_t_txt {
						flex: 1;
						font-weight: bold;
						font-size: 36rpx;
						color: #333333;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.info_user_r_t_img {
						width: 40rpx;
						height: 40rpx;
						margin-left: 32rpx;
					}
				}

				.info_user_r_b {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.info_user_r_b_ticket {
						width: 164rpx;
						height: 48rpx;
						background: rgba(255, 255, 255, 0.47);
						border-radius: 24rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						.info_user_r_b_ticket_img {
							width: 32rpx;
							height: 32rpx;
						}

						.info_user_r_b_ticket_txt {
							font-weight: 500;
							font-size: 24rpx;
							color: #628f2f;
							margin-left: 8rpx;
						}
					}

					.info_user_r_b_img {
						width: 48rpx;
						height: 48rpx;
					}
				}
			}
		}

		// 会员卡片
		.info_vip {
			width: 702rpx;
			height: 313rpx;
			position: relative;

			.info_vip_bg {
				width: 702rpx;
				height: 313rpx;
				border-radius: 36rpx;
			}

			.vip_box {
				width: 702rpx;
				height: 313rpx;
				position: absolute;
				top: 0;
				left: 0;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-left: 19rpx;
				padding-bottom: 24rpx;
				padding-top: 27rpx;
				box-sizing: border-box;

				.vip_box_t {
					display: flex;

					.vip_box_t_img {
						width: 24rpx;
						height: 21rpx;
						margin-right: 7rpx;
						margin-top: 8rpx;
					}

					.vip_box_t_texts {
						display: flex;
						flex-direction: column;

						.vip_box_t_texts_img {
							font-size: 28rpx;
							color: #f4fbe9;
							font-weight: bold;
							margin-bottom: 12rpx;
						}

						.vip_box_t_texts_txt {
							font-size: 28rpx;
							color: #b2d78b;
						}
					}
				}

				.vip_box_b {
					padding-left: 50rpx;
					padding-right: 50rpx;
					display: flex;
					justify-content: space-between;

					.vip_box_b_item:nth-child(1) {
						flex: 1;
					}

					.vip_box_b_item {
						display: flex;
						flex-direction: column;
						align-items: flex-start;

						.vip_box_b_item_txt {
							font-size: 24rpx;
							color: #d1eeb3;
						}

						.vip_box_b_item_nums {
							display: flex;
							align-items: center;

							.vip_box_b_item_nums_txt {
								font-size: 36rpx;
								font-weight: bold;
								color: #f4fbe9;
								margin-right: 10rpx;
							}

							.vip_box_b_item_nums_txt1 {
								font-size: 32rpx;
								font-weight: bold;
								color: #f4fbe9;
								margin-right: 10rpx;
							}
						}
					}
				}
			}
		}

		// 会员码模块
		.dw_box {
			position: absolute;
			left: 489rpx;
			z-index: 2;
			align-items: center;

			.dw_box_img {
				width: 134rpx;
				height: 209rpx;
			}

			.dw_box_btn {
				width: 155rpx;
				height: 66rpx;
				background: #f06435;
				border-radius: 33rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.dw_box_btn_img {
					width: 20rpx;
					height: 20rpx;
				}

				.dw_box_btn_txt {
					font-size: 24rpx;
					color: #ffffff;
					margin-left: 10rpx;
				}
			}
		}

		// 提示模块
		.tipsbox {
			width: 529rpx;
			height: 206rpx;
			position: absolute;
			top: 134rpx;
			right: 18rpx;
			z-index: 3;

			.tips_bg {
				width: 529rpx;
				height: 206rpx;
			}

			.tips_main {
				width: 529rpx;
				height: 115rpx;
				position: absolute;
				left: 0;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: center;

				.tips_main_l {
					display: flex;
					flex-direction: column;

					.tips_main_l_txt {
						font-size: 24rpx;
						color: #628f2f;
					}
				}

				.tips_main_r {
					width: 130rpx;
					height: 42rpx;
					background: linear-gradient(to left, #759e44, #acd483);
					border-radius: 21rpx;
					margin-left: 30rpx;
					text-align: center;

					.tips_main_r_txt {
						font-weight: 400;
						font-size: 24rpx;
						color: #ffffff;
						line-height: 42rpx;
						text-align: center;
					}
				}
			}
		}

		// 二维码模块
		.qrbox {
			width: 702rpx;
			height: 525rpx;
			background: #c62902;
			box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
			border-radius: 42rpx;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			position: absolute;
			top: 403rpx;
			left: 0;
			z-index: 2;

			.qr_in {
				width: 702rpx;
				height: 515rpx;
				background: #ffffff;
				border-radius: 42rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.qr_in_img {
					width: 310rpx;
					height: 310rpx;
					margin-bottom: 40rpx;
				}

				.qr_in_info {
					display: flex;
					align-items: center;
					justify-content: center;

					.qr_in_txt {
						font-weight: 400;
						font-size: 28rpx;
						color: #333333;
						margin-right: 10rpx;
					}

					.qr_in_copy {
						width: 27rpx;
						height: 29rpx;
					}
				}
			}
		}

		// 选择动物类型
		.dwpop {
			width: 640rpx;
			height: 284rpx;
			position: absolute;
			top: 178rpx;
			right: 31rpx;
			z-index: 3;

			.dwpop_bg {
				width: 640rpx;
				height: 284rpx;
			}

			.popmain {
				width: 640rpx;
				height: 234rpx;
				position: absolute;
				right: 0;
				bottom: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				padding-top: 18rpx;
				padding-bottom: 13rpx;
				box-sizing: border-box;

				.pop_t {
					display: flex;
					align-items: center;
					justify-content: center;

					.pop_t_txt {
						font-weight: 500;
						font-size: 24rpx;
						color: #628f2f;
					}

					.pop_t_btn {
						width: 78rpx;
						height: 42rpx;
						background: linear-gradient(to bottom left, #759e44, #acd483);
						border-radius: 21rpx;
						text-align: center;

						.pop_t_btn_txt {
							font-weight: 400;
							font-size: 24rpx;
							color: #ffffff;
							text-align: center;
							line-height: 42rpx;
						}
					}
				}

				.pop_list {
					width: 640rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.pop_item {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.pop_item_img {
							width: 79rpx;
							height: 140rpx;
						}

						.pop_item_box {
							width: 79rpx;
							height: 4rpx;
							background: #fafafa;
							border-radius: 2rpx;
						}
					}
				}
			}
		}
	}

	// 我的订单模块
	.orderbox {
		width: 702rpx;
		height: 198rpx;
		background: linear-gradient(to bottom right, #fefefe, #ebf8ee);
		box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
		border-radius: 32rpx;
		margin-bottom: 32rpx;

		// 订单金刚区
		.gridlist {
			width: 702rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.gridlist_item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;

		.gridlist_item_img {
			width: 52rpx;
			height: 52rpx;
			margin-bottom: 13rpx;
		}

		.gridlist_item_txt {
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
		}
	}

	// card小标题
	.card_icon_card_header {
		width: 702rpx;
		display: flex;
		justify-content: space-between;
		padding-right: 24rpx;
		box-sizing: border-box;

		.card_icon_card_header_lt {
			position: relative;
			width: 230rpx;
			height: 74rpx;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			padding-top: 8rpx;
			box-sizing: border-box;

			.card_icon_card_header-img {
				width: 230rpx;
				height: 74rpx;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}

			.title_text_primary {
				font-family: DingTalk, DingTalk;
				font-weight: normal;
				font-size: 32rpx;
				color: #ffffff;
				z-index: 2;
				line-height: 32rpx;
			}

			.card_title_icon {
				width: 16rpx;
				height: 16rpx;
				margin-left: 8rpx;
				z-index: 2;
			}
		}
		
		.card-icon-card-header_rt {
			flex: 1 0;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		
			.card-icon-card-header_rt_img {
				width: 114rpx;
				height: 25rpx;
			}
		
			.card-icon-card-header_rt_r {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
		
				.card-icon-card-header_rt_r_txt {
					font-size: 24rpx;
					color: #909599;
					margin-right: 10rpx;
				}
			}
		}
	}

	// 合伙人\邀请
	.activitybox {
		width: 702rpx;
		display: flex;
		justify-content: space-between;
		margin-bottom: 32rpx;

		.activity_item {
			width: 339rpx;
			height: 134rpx;
			background: linear-gradient(to bottom right, #fff1e8, #fde9db);
			box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
			border-radius: 18rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 23rpx;
			position: relative;
			overflow: hidden;
			box-sizing: border-box;

			.activity_bg {
				position: absolute;
				left: 0;
				top: 0;
				width: 129rpx;
				height: 134rpx;
				background: #fce8dd;
				box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
				border-top-left-radius: 18rpx;
				border-bottom-left-radius: 18rpx;
				border-top-right-radius: 60rpx;
				border-bottom-right-radius: 60rpx;
			}

			.activity_bg1 {
				position: absolute;
				right: 0;
				bottom: 0;
				width: 58rpx;
				height: 46rpx;
				background: #ffe6d8;
				box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
				border-top-left-radius: 60rpx;
				border-bottom-right-radius: 18rpx;
			}

			.activity_img {
				width: 68rpx;
				height: 68rpx;
				z-index: 2;
			}

			.activity_r {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.activity_txt {
					font-weight: 500;
					font-size: 32rpx;
					color: #795a49;
					margin-bottom: 24rpx;
				}

				.activity_btn {
					width: 78rpx;
					background: #fab699;
					border-radius: 20rpx;
					text-align: center;

					.activity_btn_txt {
						font-weight: 400;
						font-size: 24rpx;
						color: #ffffff;
						text-align: center;
						line-height: 32rpx;
					}
				}
			}
		}

		.ac_bggreen {
			background: linear-gradient(to bottom right, #e6f8e0, #effcf1);

			.activity_bg {
				background: rgba(117, 158, 68, 0.04);
			}

			.activity_bg1 {
				background: #e3f6df;
			}

			.activity_r .activity_btn {
				background: #18cda6;
			}
		}
	}

	// 其他服务
	.otherbox {
		width: 702rpx;
		background: linear-gradient(tobottom right, #fefefe, #ebf8ee);
		box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
		border-radius: 32rpx;
		margin-bottom: 28rpx;

		.other_gird {
			display: flex;
			flex-wrap: wrap;

			.gridlist_item {
				flex: none;
				width: calc(702rpx / 4);
				margin-bottom: 40rpx;
			}
		}

		.other_old {
			height: 55rpx;
			position: relative;
			margin-left: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;

			.old_img {
				width: 32rpx;
				height: 32rpx;
				border-radius: 16rpx;
				position: absolute;
				top: 0;
				left: 146rpx;
				z-index: 2;
			}

			.old_btn {
				width: 162rpx;
				height: 48rpx;
				background: var(--but-color-line);
				border-radius: 8rpx;
				text-align: center;

				.old_btn_txt {
					font-weight: 400;
					font-size: 28rpx;
					color: #ffffff;
					text-align: center;
					line-height: 48rpx;
				}
			}
		}
	}

	/* ==================== 悬浮和背景图 ==================== */
	.kf-box {
		position: fixed;
		right: 0rpx;
		bottom: 533rpx;
		z-index: 9;
		flex-direction: column;
		align-items: center;
		z-index: 999999;

		.kf-img {
			width: 113rpx;
			height: 110rpx;
			z-index: 999999;
		}
	}
}

/* ==================== 广告横幅 ==================== */
.banner {
	margin: 0 0 28rpx 0;
	border-radius: 16rpx;
	overflow: hidden;
}

/* .banner-img {
		flex: 1;
		height: 200rpx;
	} */
.banner-box {
	margin-top: 30rpx;
	margin-bottom: 30rpx;
	border-radius: 16rpx;
	width: 710rpx;
	overflow: hidden;
}

.banner-img {
	width: 710rpx;
	height: 200rpx;
	/* resize="cover" 确保图片填充 */
}

.message-dot {
	display: inline-block;
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background-color: #ff3b30;
	margin: 5rpx 10rpx;
	position: absolute;
	left: 22px;
	top: 3rpx;
}

.active {
	transform: scale(1.2);
	/* 放大1.5倍，可以根据需要调整 */
	/* 可能需要调整z-index使其覆盖其他元素 */
	z-index: 100;
}

.taskcard {
	width: 702rpx;
	border-radius: 32rpx;
	display: flex;
	flex-direction: column;
	background-image: var(--linear-color);
	box-shadow: 0rpx 2rpx 8rpx 0rpx var(--label-color);
	margin-bottom: 32rpx;
	
	.card-item {
		width: 702rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.rw_item {
			width: 654rpx;
			height: 88rpx;
			background-image: var(--head-color);
			border-radius: 16rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding-left: 20rpx;
			padding-right: 28rpx;
			margin-bottom: 29rpx;
			border-bottom: 3rpx solid var(--secondary-color);
			box-sizing: border-box;
			&:last-child {
				margin-bottom: 0;
			}
			
			.rw_item_img {
				width: 76rpx;
				height: 76rpx;
				margin-right: 20rpx;
			}
			
			.rw_item_text {
				flex: 1 0;
				text-align: left;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
			}
			
			.rw_item_btn {
				width: 146rpx;
				height: 48rpx;
				background-color: #ff9b36;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
						
				.rw_item_btn_text {
					font-weight: 400;
					font-size: 24rpx;
					color: #ffffff;
				}
			}
			
			.rw_item_btn-1 {
				width: 148rpx;
				height: 52rpx;
				background: #efefef;
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.rw_item_btn_text-1 {
					font-weight: 400;
					font-size: 24rpx;
					color: #909599;
				}
			}
		}
	}
}

.card-w{
	background: var(--head-color);
}
</style>
