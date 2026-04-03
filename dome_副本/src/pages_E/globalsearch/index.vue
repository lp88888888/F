<template>
	<!-- 背景色 -->
	<view class="search_bg" :style="{ background: themeStore.themeColors.$pageheadbg }"></view>
	<view class="search_page">
		<!-- 导航栏 -->
		<up-navbar bgColor="transparent" placeholder :fixed="false" title="搜索" autoBack></up-navbar>

		<scroll-view scroll-y="true" class="scrollY" @scrolltolower="scrolltolower">
			<view class="scrobox">
				<!-- 搜索栏 -->
				<view :class="['search-box', aimodelstatus ? 'searchActive' : '']">
					<view class="search_bar">
						<up-icon :name="imgUrl + 'static/search-icons3.png'" size="18"></up-icon>
						<view style="padding: 0 20rpx; flex: 1">
							<up-input
								placeholder="请输入"
								border="none"
								v-model="searchValue"
								@focus="onFocus"
								@blur="onBlur"
								@confirm="onSearch"
								clearable
							></up-input>
						</view>
						<uni-icons type="mic-filled" :color="yystatus ? themeStore.themeColors.$color : '#272536'" size="20" @click="handleYy"></uni-icons>
					</view>
					<view class="fl-ce-sb" style="flex-direction: row">
						<view
							class="fl-al-ce aiBox"
							@click="handleAiModel"
							:style="{
								color: aimodelstatus ? themeStore.themeColors.$color : '#999999',
								background: aimodelstatus ? themeStore.themeColors.$badgeBgColor : '#F4F4F4',
								borderColor: aimodelstatus ? themeStore.themeColors.$color : '#999999',
							}"
						>
							<up-icon :name="`${aimodelstatus ? icoUrl + 'search-ai-icon.png' : imgUrl + 'static/search-ai-icon.png'}`" size="16"></up-icon>
							<text class="m-l-10">AI模式</text>
						</view>
						<view class="search_bar_btn" :style="{ background: themeStore.themeColors.$bgLgColor }" @click="onSearch">
							<text class="search_bar_btn_text">搜索</text>
						</view>
					</view>
				</view>

				<!-- 语音提示 -->
				<view class="yy_box_o" v-if="yystatus">
					<view class="yy_box">
						<view class="yy_box1">
							<!-- #ifdef APP -->
							<RecorderApp @change="recorderChange"></RecorderApp>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<RecorderApp @change="recorderChange"></RecorderApp>
							<!-- #endif -->
						</view>
					</view>
				</view>

				<!-- ai回答模块 -->
				<view class="aimsg_box" v-if="aimodelstatus && searchValue && isLogin">
					<view class="aimsg_item">
						<view class="aimsg_serve">
							<view class="querBoxTitle">
								<up-icon :name="icoUrl + 'BdDigitalMan/dmIcon8.png'" size="14"></up-icon>
								<text class="querBoxTitle-text">解析{{ !qureyShow ? '完成' : '中' }}(基于「{{ queryTextName(chatCot) }}」技能回答)</text>
							</view>
							<view class="queryBoxText" :style="{ height: morebtn ? '' : '100rpx' }">
								<text class="queryBoxText_text">{{ answerText }}</text>
							</view>
							<view class="queryBoxBt">
								<view class="queryBoxBt_l">
									<view class="queryBoxBt_l_btns">
										<image class="queryBoxBt_l-img" :src="icoUrl + 'BdDigitalMan/ai-man-new-icon1.png'" @click="copyText(answerText)"></image>
										<image
											class="queryBoxBt_l-img"
											:src="`${icoUrl}BdDigitalMan/${isBobaoShow ? 'ai-man-new-icon2-true' : 'ai-man-new-icon2'}.png`"
											@click="stopTalk(answerText)"
										></image>
										<image
											class="queryBoxBt_l-img"
											:src="`${icoUrl}BdDigitalMan/${positive ? 'ai-man-new-icon3-true' : 'ai-man-new-icon3'}.png`"
											@click="zanClick('POSITIVE')"
										></image>
										<image
											class="queryBoxBt_l-img"
											:src="`${icoUrl}BdDigitalMan/${negative ? 'ai-man-new-icon4-true' : 'ai-man-new-icon4'}.png`"
											@click="zanClick('NEGATIVE')"
										></image>
									</view>
									<text class="queryBoxBt_l_tips">该内容由人工智能AI生成</text>
								</view>
								<view class="queryBoxBt_r" :style="{ background: themeStore.themeColors.$bgLgColor }" @click="handleAgain">
									<text class="queryBoxBt_r_text">继续追问</text>
								</view>
							</view>
						</view>
					</view>
					<view class="more_btn" @click="handlemore">
						<text class="more_text">{{ morebtn ? '收起' : '展开' }}</text>
						<uni-icons :type="morebtn ? 'top' : 'bottom'" size="12" color="#666666"></uni-icons>
					</view>
				</view>

				<!-- 没有搜索的展示 -->
				<view class="no_page" v-if="!searchValue">
					<!-- 标题 -->
					<view class="bt_box">
						<text class="bt_box_title">历史搜索</text>
						<uni-icons type="trash" size="12" color="#333333" @click="handleAll"></uni-icons>
						<text class="bt_box_rtext" @click="handleAll">删除</text>
					</view>

					<!-- 历史搜索 -->
					<view class="ls_list">
						<view class="ls_item" v-for="(item, index) in historylist" :key="index">
							<text class="ls_item_text" @click="handleSelItem(item.searchName)">{{ item.searchName }}</text>
							<uni-icons type="close" size="16" color="#333333" @click="handleOne(item.id)"></uni-icons>
						</view>
					</view>

					<!-- 推荐搜索标题 -->
					<view class="bt_box">
						<image class="bt_box_img" :src="`${imgUrl}static/search_page_icon.png`" mode=""></image>
						<text class="bt_box_title">推荐搜索</text>
					</view>

					<!-- 推荐搜索 -->
					<view class="ls_list">
						<view class="ls_item" v-for="(item, index) in defaultdata.recommendList" :key="index" @click="handleSelItem(item.content)">
							<text class="ls_item_text">{{ item.content }}</text>
						</view>
					</view>

					<!-- 排行榜tab -->
					<scroll-view class="rankstab" scroll-x="true" :show-scrollbar="false">
						<view class="scrout" v-for="(item, index) in rankingtab" :key="index" @click="handleRank(item)">
							<view class="bt_box">
								<image class="bt_box_img" :src="`${imgUrl}static/hot_icon.png`" mode=""></image>
								<text class="bt_box_title">{{ item.name }}</text>
							</view>
						</view>
					</scroll-view>

					<!-- 排行榜List -->
					<view class="ph_box">
						<view class="ph_item" v-for="(item, index) in defaultdata[rankingval]" :key="index" @click="handleSelItem(item.content)">
							<text class="ph_item_num" :class="{ active: [0, 1, 2].includes(index) }">{{ index + 1 }}</text>
							<text class="ph_item_cont">{{ item.content }}</text>
							<!-- <text class="ph_item_tips">{{ item.hotness }}人参与评价</text> -->
						</view>
					</view>
				</view>

				<!-- 搜索时的tab -->
				<view class="yesbox" v-else>
					<!-- 搜索的tab -->
					<view class="tab_list">
						<view class="tab_item" v-for="(item, index) in tabdata" :key="index" @click="handleTab(item.val)">
							<text class="tab_item_text">{{ item.name }}</text>
							<image v-if="tabindex === item.val" class="tab_item_img" :src="`${icoUrl}tab_icon.png`" mode=""></image>
						</view>
					</view>

					<!-- 服务模块 -->
					<view class="fwbox" v-if="tabindex === 0">
						<text class="fw_title" v-if="fwinitdata.length">“{{ searchValue }}”&nbsp;&nbsp;相关的服务入口</text>
						<view class="fw_rout" v-for="(item, index) in fwinitdata" :key="index" @click="handleTypeInit(item)">
							<text class="fw_rout_text">{{ item.name }}</text>
							<uni-icons type="right" size="16" color="#575B66"></uni-icons>
						</view>
						<text class="fw_title">“{{ searchValue }}”&nbsp;&nbsp;相关的搜索结果</text>
						<view class="fw_item" v-for="(item, index) in allListData" :key="index" @click="navigateToApp(item)">
							<image class="fw_item_img" :src="item.image || `${imgUrl}service-list-default.png`" mode=""></image>
							<view class="fw_item_r">
								<text class="fw_item_r_text">{{ item.name }}</text>
								<view class="fw_item_r_tag">
									<text class="fw_item_r_tag_text">{{ fwtagstr1(item) }}</text>
									<!-- <text class="fw_item_r_tag_text1">￥200</text> -->
									<text class="fw_item_r_tag_text2" decode> &lt; {{ item.distanceStr }} </text>
								</view>
								<view class="fw_item_r_info">
									<image class="fw_item_r_info_img" :src="`${imgUrl}static/search_add_icon.png`" mode=""> </image>
									<text class="fw_item_r_info_text">{{ item.address }}</text>
								</view>
							</view>
						</view>
					</view>

					<!-- 活动模块 -->
					<template v-if="tabindex === 1">
						<view class="hdbox" v-for="(item, index) in 0" :key="index">
							<view class="hd_head">
								<view class="hd_head_l">
									<text class="hd_head_l_text">一起"趣"旅行</text>
									<image class="hd_head_l_img" :src="`${imgUrl}static/card_lt_icon_green.png`" mode=""> </image>
								</view>
								<image class="hd_head_r" :src="`${imgUrl}static/card_rt_icon.png`" mode=""> </image>
							</view>
							<view class="hd_info">
								<image class="hd_info_img" :src="`${imgUrl}static/card_activity_img.png`" mode=""></image>
								<view class="hd_info_r">
									<text class="hd_info_r_text">跟着黄河去旅行</text>
									<text class="hd_info_r_text1">2026.3.15-18</text>
									<view class="hd_info_r_b">
										<text class="hd_info_r_text2">已报名：</text>
										<text class="hd_info_r_text3">32人</text>
										<view class="hd_info_r_btn">
											<text class="hd_info_r_btn_text">报名中</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</template>

					<!-- 商品模块 -->
					<view class="spbox" v-if="tabindex === 2">
						<view class="goods_item" v-for="(item, index) in allListData" :key="index" @click="gogoodsdetail(item)">
							<image class="goods_item_img" :src="item.picUrl" mode=""></image>
							<text class="goods_item_txt">{{ item.productName }}</text>
							<view class="goods_item_nums">
								<text class="goods_item_num">{{ item.type == 1 ? item.point : item.price }}</text>
								<image class="goods_item_icon" :src="`${imgUrl}static/jf_icon_yellow.png`" mode=""> </image>
								<text class="goods_item_txt1"></text>
								<!-- 已兑{{ item.salesCount || 0 }}+ -->
							</view>
						</view>
					</view>

					<!-- 货源模块 -->
					<view class="hybox" v-if="tabindex === 3">
						<view
							class="card_order"
							v-for="(item, index) in allListData"
							:key="index"
							@click="toNav('/pages_D/informationMatch/detail?id=' + item.id)"
						>
							<view class="card_order_t">
								<text class="card_order_t_start">{{ item.loadingAddrName ? item.loadingAddrName[2] : '灞桥区' }}</text>
								<image class="arrow_img" :src="imgUrl + 'static/card_to_line.png'"></image>
								<text class="card_order_t_end">{{ item.unloadingAddrName ? item.unloadingAddrName[2] : '长安区' }}</text>
								<text class="card_order_t_type">{{ item.weight || '0' }}吨{{ item.goodsName || '' }}</text>
							</view>
							<view class="card_order_time">
								<text class="card_order_time_txt">发布时间</text>
								<text class="card_order_time_txt">{{ item.createTime }}</text>
							</view>
							<view class="card_order_user">
								<text class="card_order_user_txt">发布人</text>
								<text class="card_order_user_txt1">{{ item.contactPerson || '' }}</text>
								<view class="card_order_user_btn">
									<text class="card_order_user_btn_txt">抢单</text>
								</view>
							</view>
						</view>
					</view>

					<ser-empty v-if="!allListData.length"></ser-empty>
				</view>
			</view>

			<!-- 跳转小程序 -->
			<SateLayer ref="sateLayerRef"></SateLayer>

			<!-- SSE客户端 -->
			<gao-ChatSSEClient ref="chatSSEClientRef" :heartbeat-timeout="120000" :timeout="300000" :max-retry-count="5" :debug="false"></gao-ChatSSEClient>

			<!-- 点踩弹窗 -->
			<up-popup :show="negaShow" mode="center" z-index="999" @close="closepop" round="10">
				<view class="feedBox">
					<text class="feedBox-title">您不认可该回复的原因是什么？</text>
					<view class="feedBox-tebs">
						<text
							class="feedBox-tebs-text"
							:class="[negaForm.negativeFeedbackType == item.value ? 'activeText' : '']"
							v-for="(item, index) in chatStore.feedbackTypeList"
							:key="index"
							@click="negaForm.negativeFeedbackType = item.value"
							>{{ item.name }}</text
						>
					</view>
					<view class="">
						<up-textarea v-model="negaForm.feedbackContent" height="150" placeholder="请输入内容"></up-textarea>
					</view>
					<view class="feedBox-buts">
						<text class="feedBox-buts-item buts1" @click="closepop">取消</text>
						<text class="feedBox-buts-item buts2" @click="submitpop">确认</text>
					</view>
				</view>
			</up-popup>
		</scroll-view>
		<AudioPlayer ref="audioRef" @onEnded="handleEnded"></AudioPlayer>
	</view>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { imgUrl, aiUrl } from '../../config';
import { toNav } from '@/utils/route';
import { toast } from '@/utils/common';
import { openAPPLocation, CurrentPage, showAlert2, getUUID, formatTimestamp, copyText,fixQuotes } from '@/utils/util';
import { getSeacheRecord, getServiceSiteList, getglobalsearch, getAllProduct, getsourceSearch, getservicesearch } from '@/api/globasearch';
import { getDict, delSearchRecord, delAllSearchRecord, addSearchRecord } from '@/api/config';
import { requestMicrophonePermission, permission } from '@/utils/usePermission';
import { useAppStore } from '@/store/modules/app';
import SpeechRecognition from '@/components/SpeechRecognition';
import AudioPlayer from '@/components/AudioPlayer';

import SateLayer from '@/components/SateLayer/index.vue';
import { onReachBottom, onReady } from '@dcloudio/uni-app';
import { getOpenToken, openChat, feedbackAi, feedbackDeleteAi } from '@/api/openApi';
import { getToken } from '@/utils/token';
import { ChatStore } from '@/store/modules/chat';
import RecorderApp from '../digitalHuman/components/RecorderApp.vue';
import { voiceToken, voiceTotext, createTextToVoice, queryTextToVoice, textCensor } from '@/api/language';
// #ifdef APP-PLUS
	import { request } from '@/uni_modules/hans-request'
	// #endif

// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = computed(() => themeStore.imgUrl);
const sateLayerRef = ref(null);


const audioRef = ref(null);
const handleEnded = () => {
	isBobaoShow.value = false;
  // uni.showToast({ title: '播报完毕', icon: 'none' });
};

const appStore = useAppStore();
const chatStore = ChatStore();
const isLogin = computed(() => appStore.checkLogin());

// 语音模式
const yystatus = ref(false);
const handleYy = () => {
	yystatus.value = !yystatus.value;
};

// AI模式状态
const aimodelstatus = ref(false);
const handleAiModel = () => {
	aimodelstatus.value = !aimodelstatus.value;
	if (aimodelstatus.value && searchValue.value && isLogin.value) {
		onSearch();
	}
};

// 展开更多
const morebtn = ref(false);
const handlemore = () => {
	morebtn.value = !morebtn.value;
	console.log('切换的状态', morebtn.value);
};

// 焦点状态
const micstatus = ref(true);

// 获取焦点
const onFocus = () => {
	console.log('焦点获取');
	micstatus.value = false;
	yystatus.value = false;
};

// 失去焦点
const onBlur = () => {
	console.log('焦点丢失');
	micstatus.value = true;
	onSearch(false);
};

const searchValue = ref('');
const debounceTimer = ref(null);

// 防抖函数
const debounceSearch = () => {
	if (debounceTimer.value) {
		clearTimeout(debounceTimer.value);
	}
	debounceTimer.value = setTimeout(() => {
		if (!searchValue.value) return;
		onSearch();
	}, 300);
};

// 搜索
const onSearch = (status = true) => {
	if (!searchValue.value) {
		toast('请输入搜索的内容');
		return;
	}
	if (aimodelstatus.value && status) {
		setChat(searchValue.value);
	}
	changetablist();
	addsearchval();
};

// 增加搜索历史
const addsearchval = async () => {
	const res = await addSearchRecord({
		businessType: 1,
		searchName: searchValue.value,
	});
	console.log('增加了历史搜索', res);
	getdefaultrequest();
};

// 删除所有历史搜索
const handleAll = async () => {
	if (!historylist.value.length) return;
	const res = await delAllSearchRecord(1);
	console.log('全部删除历史搜索', res);
	getdefaultrequest();
};

// 删除单个历史搜索
const handleOne = async (id) => {
	const res = await delSearchRecord(id);
	console.log('删除单个历史', res);
	getdefaultrequest();
};

const tabindex = ref(0);
const tabdata = [
	{
		name: '服务',
		val: 0,
	},
	{
		name: '活动',
		val: 1,
	},
	{
		name: '商品',
		val: 2,
	},
	{
		name: '货源',
		val: 3,
	},
];
const handleTab = (index) => {
	tabindex.value = index;
	allListData.value = [];
	changetablist();
};

// 查询对应tabs数据
const changetablist = () => {
	switch (tabindex.value) {
		case 0:
			getserverlist();
			getserverinit();
			break;
		case 1:
			break;
		case 2:
			getgoodsinfo();
			break;
		case 3:
			getsupplysource();
			break;
	}
};

// 点击推荐搜索、热搜列表
const handleSelItem = (str) => {
	searchValue.value = str.replace(/[。.]$/, "");
	onSearch();
};

// 服务tag的数据
const fwtagstr = (item) => {
	const res = dictList.value.find((e) => e.dictValue == item.type);
	return res?.dictLabel || '';
};

// 服务子项类型
const fwtagstr1 = (item) => {
	const typsarr = ['', '加油站', '充电站', '监测站', '4S店', '维修站', '景区', '酒店', '餐饮餐厅'];
	return typsarr[item.type] || '';
};

const fwpath = {
	1: {
		url: '/pages_A/map/index',
	},
	2: {
		url: '/pages_A/mapInfo/index',
	},
	3: {
		url: '',
	},
	4: {
		url: '/pages_A/station/index',
	},
	5: {
		url: '/pages_A/toll/index',
	},
	6: {
		url: '',
		appid: 'wxe442a27a2747b061',
	},
	7: {
		url: '/pages_A/tollInvoice/query',
	},
	8: {
		url: '',
	},
	9: {
		url: '/pages_A/tollInvoice/index',
	},
	10: {
		url: '',
		appid: 'wxf52b8d2bb696e5f4',
	},
	11: {
		url: '/pages_A/chargingPiles/index',
	},
	12: {
		url: '/pages_D/refuelingRefilling/index',
	},
	13: {
		url: '/pages_B/hotel/hotelist',
	},
	14: {
		url: '/pages_D/repair/carRepair',
	},
	15: {
		url: '/pages_B/dining/index',
	},
	16: {
		url: '/pages_B/rentCar/index',
	},
	17: {
		url: '',
		appid: 'wx19e20461b663b96c',
	},
	18: {
		url: '/pages_D/busTicket/index',
	},
	19: {
		url: '/pages_D/usedCar/index',
	},
	20: {
		url: '/pages_D/newCar/index',
	},
	21: {
		url: '/pages_D/newCar/dealer',
	},
	22: {
		url: '/pages_D/JumpStart/weizhilist',
	},
	23: {
		url: '/pages_D/inspection/index',
	},
	24: {
		url: '',
		appid: 'wxa153df20e8888c68',
	},
	25: {
		url: '',
		appid: 'wx00a6d2bbd6cf9160',
	},
};
// 根据类型前往对应功能
const handleTypeInit = (item) => {
	let url = fwpath[item.type].url;
	let appid = fwpath[item.type].appid || '';
	if (url) {
		toNav(url);
	} else {
		if (appid) {
			// #ifdef APP
			toast('该功能正在快马加鞭赶来的路上~');
			// #endif
			// #ifdef MP-WEIXIN
			navLink(appid);
			// #endif
		} else {
			toast('该功能正在快马加鞭赶来的路上~');
		}
	}
};

const navLink = (appid) => {
	// 登录校验
	if (!isLogin.value) {
		showAlert2(
			'提示',
			'本次操作需要您进行登录验证',
			false,
			'取消',
			'确定',
			(success) => {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages_A/login/login?fromPage=' + CurrentPage(),
				});
				// #endif
				// #ifdef APP
				uni.navigateTo({ url: '/pages_A/login_password/login' });
				// #endif
			},
			null
		);
		return;
	}

	if (appid == 'wxe442a27a2747b061') {
		sateLayerRef.value.open({
			address: '',
			appId: 'wxe442a27a2747b061',
			appSrcId: 'gh_95045762f7a8',
			enterprise: '陕西高速公路电子收费有限公司',
			name: 'ETC申请',
			state: '01',
			status: '01',
		});
	}
	if (appid == 'wxf52b8d2bb696e5f4') {
		sateLayerRef.value.open({
			address: '',
			appId: 'wxf52b8d2bb696e5f4',
			appSrcId: 'gh_dd4bedd2010f',
			enterprise: '行云数聚（北京）科技有限公司',
			name: '通行费补缴',
			state: '01',
			status: '01',
		});
	}
	if (appid == 'wxa153df20e8888c68') {
		sateLayerRef.value.open({
			address: '/pages/appointment/view/index/index',
			appId: 'wxa153df20e8888c68',
			appSrcId: 'gh079c162b7d29',
			enterprise: '陕西蓝德智慧交通科技有限公司',
			name: '绿通预约',
			state: '01',
			status: '01',
		});
	}

	if (appid == 'wx00a6d2bbd6cf9160') {
		sateLayerRef.value.open({
			address: '',
			appId: 'wx00a6d2bbd6cf9160',
			appSrcId: '',
			enterprise: '中国交通通信信息中心',
			name: '运政办理',
			state: '01',
			status: '01',
		});
	}

	if (appid == 'wx19e20461b663b96c') {
		sateLayerRef.value.open({
			address: '',
			appId: 'wx19e20461b663b96c',
			appSrcId: '',
			enterprise: '的盟天下(延安)科技有限公司',
			name: '网约车',
			state: '01',
			status: '01',
		});
	}

	if (appid == 'https://yjglfp.sx12122.cn/') {
		uni.navigateTo({
			url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
		});
	}
	if (appid == 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/MainTest.html?wxH5=1') {
		uni.navigateTo({
			url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
		});
	}
};

// 点击服务地址
// type: 1、加油站 2、充电站 3、检测站 4、4S店 5、维修站 6、景区 7、酒店 8、餐饮餐厅
const linkObj = {
	1: '/pages_D/refuelingRefilling/details?merId=',
	2: '/pages_A/chargingPiles/queryDetail?id=',
	3: '/pages_D/inspection/details?merId=',
	4: '/pages_D/newCar/dealerDetail?id=',
	5: '/pages_D/newCar/dealerDetail?id=',
	6: '/pages_B/scenicSpotTicket/detail?id=',
	7: '/pages_B/hotel/hotelDetails?id=',
	8: '/pages_B/dining/diningHome?id=',
	9: '/pages_A/station/details?id=',
};
const navigateToApp = (item) => {
	let route = linkObj[item.type] + item.id;
	if (linkObj[item.type]) {
		toNav(route);
	} else {
		toast('未配置路径');
	}
	// openAPPLocation({
	// 	endLocation: {
	// 		longitude: item.longitude,
	// 		latitude: item.latitude,
	// 		address: item.address,
	// 	},
	// });
};

// 跳转商品详情
const gogoodsdetail = (item) => {
	if (item.type == 1) {
		toNav('/pages_A/points/details?id=' + item.id);
	} else {
		toNav('/pages_B/directRetail/shopDetail?spuId=' + item.id);
	}
};

const historylist = ref([]);
// 查询历史记录
const gethistory = async () => {
	try {
		const res = await getSeacheRecord(1);
		console.log('全局搜索历史记录', res);
		historylist.value = res.data;
	} catch (err) {
		console.error('历史记录错误', err);
	}
};

// 默认数据-排行榜
const rankingval = ref('hotServiceList');
const rankingtab = [
	{
		name: '热搜服务',
		key: 'hotServiceList',
	},
	{
		name: '热搜商品',
		key: 'hotGoodList',
	},
];
const handleRank = (item) => {
	rankingval.value = item.key;
};
const defaultdata = ref({
	hotGoodList: [],
	hotServiceList: [],
	recommendList: [],
});
// 搜索默认页面
const getdefault = async () => {
	try {
		const res = await getglobalsearch();
		console.log('搜索默认的数据', res);
		defaultdata.value = res.data;
	} catch (err) {
		console.error('默认页数据错误', err);
	}
};
const address = computed(() => uni.getStorageSync('address'));
const allListData = ref([]);
const querydata = ref({
	pageSize: 20,
	pageNum: 1,
	total: 0,
});

// 查询的服务的数据
const getserverlist = async () => {
	try {
		const res = await getServiceSiteList({
			pageNum: querydata.value.pageNum,
			pageSize: querydata.value.pageSize,
			keyWord: searchValue.value,
			longitude: address.value.lng,
			latitude: address.value.lat,
		});
		console.log('查询的服务数据', address.value, res.data.length, res);
		if (querydata.value.pageNum == 1) {
			allListData.value = res.data.list;
		} else {
			allListData.value = allListData.value.concat(res.data.list);
		}
		querydata.value.total = res.data.total;
	} catch (err) {
		console.error('服务查询出错', err);
	}
};

const fwinitdata = ref([]);
const getserverinit = async () => {
	try {
		const res = await getservicesearch({ keyword: searchValue.value });
		console.log('查询的服务入口', res);
		fwinitdata.value = res.data;
	} catch (err) {
		console.error('服务入口报错', err);
	}
};

// 查询商品信息
const getgoodsinfo = async () => {
	try {
		const res = await getAllProduct({ name: searchValue.value });
		console.log('搜索的商品分类', res);
		allListData.value = res.data;
	} catch (err) {
		console.error('商品查询错误', err);
	}
};

// 查询货源
const getsupplysource = async () => {
	try {
		let params = {
			keyword: searchValue.value,
			longitude: address.value.lng,
			latitude: address.value.lat,
			pageNum: querydata.value.pageNum,
			pageSize: querydata.value.pageSize,
		};
		const res = await getsourceSearch(params);
		console.log('搜索的货源分类', res);
		if (querydata.value.pageNum == 1) {
			allListData.value = res.data.list;
		} else {
			allListData.value = allListData.value.concat(res.data.list);
		}
		querydata.value.total = res.data.total;
	} catch (err) {
		console.error('货源查询错误', err);
	}
};

const dictList = ref([]);
// 查询字典类型
const getdictlist = async () => {
	try {
		const res = await getDict('op_service_entrance');
		console.log('字典数据', res);
		dictList.value = res.data;
	} catch (err) {
		console.error('字典数据错误', err);
	}
};

// 默认查询
const getdefaultrequest = () => {
	gethistory();
	getdefault();
};

// 查询麦克风权限
const checkRecordAuth = async () => {
	const platform = uni.getSystemInfoSync().platform;
	let granted = false;
	if (platform === 'android') {
		const result = await permission.requestAndroidPermission('android.permission.RECORD_AUDIO');
		granted = result === 1; // 1 允许  0 拒绝  -1 永久拒绝
	} else if (platform === 'ios') {
		granted = permission.judgeIosPermission('record');
	}
	if (!granted) {
		uni.showModal({
			title: '需要麦克风权限',
			content: '是否前往设置手动开启？',
			success: (res) => res.confirm && permission.gotoAppPermissionSetting(),
		});
	}
	return granted;
};

// 滚动视图区域触底
const scrolltolower = () => {
	console.log('触底加载');
	if (querydata.value.total > allListData.value.length) {
		querydata.value.pageNum += 1;
		changetablist();
	}
};

// 继续追问
const handleAgain = () => {
	toNav('/pages_E/digitalHuman/index');
};

// AI相关变量
const qureyShow = ref(false);
const answerText = ref('');
const chatCot = ref('');
const isBobaoShow = ref(false);
let audioVoice = null;

const sessionId = ref('');
const queryId = ref('');
const chatSSEClientRef = ref(null);

const sseLog = ref('');
const sseStatus = ref('');
const sseRunning = ref(false);
const uuid = getUUID();
let sseBuffer = '';

// 技能名称映射
const queryTextName = (cot) => {
	const nameMap = {
		TRAFFIC_LAW: '交通法规',
		WEATHER: '天气查询',
		NAVIGATION: '导航服务',
		SERVICE: '服务查询',
	};
	return nameMap[cot] || '智能问答';
};

// AI聊天
const setChat = async (query) => {
	answerText.value = '';
	qureyShow.value = true;
	chatCot.value = [];
	positive.value = false;
	negative.value = false;
	feedbBackId.value = '';
	sessionId.value = '';
	queryId.value = '';
	const requestTime = formatTimestamp(new Date().getTime() - 1000, 'YYYY-MM-DD HH:mm:ss');
	try {
		const tokenRes = await getOpenToken(requestTime);
		if (tokenRes.status === 200) {
			// #ifdef APP-PLUS
			if (uni.getSystemInfoSync().platform == 'ios') {
				iosStart(tokenRes.result, requestTime, query);
			} else {
				start(tokenRes.result, requestTime, query);
			}
			// #endif
			// #ifdef MP-WEIXIN || APP-HARMONY
			const messageIdVal = getUUID();
			const task = uni.request({
				url: aiUrl + '/copilot/v1/openApi/chat',
				header: {
					copilotToken: tokenRes.result,
					requestTime: requestTime,
					copilotAk: 'copilot_ak_4qZ84MGWrRoXcMwY',
					assistantId: 118,
				},
				enableChunked: true,
				responseType: 'arraybuffer',
				method: 'POST',
				data: {
					type: 'IM_CLICK',
					assistantId: 118,
					query: query,
					sessionId: uuid,
					params: {
						userCode: getToken(),
						userLat: uni.getStorageSync('address').lat || '',
						userLon: uni.getStorageSync('address').lng || '',
						useLon: uni.getStorageSync('address').lng || '',
						member_id: uni.getStorageSync('userInfo').id || '',
					},
				},
				complete: (e) => {
					console.log('微信鸿蒙流式返回', e);
				},
			});

			let textBuf = '';
			let byteBuf = new ArrayBuffer(0);

			task.onChunkReceived(({ data }) => {
				if (!data || data.byteLength === 0) return;
				const tmp = new Uint8Array(byteBuf.byteLength + data.byteLength);
				tmp.set(new Uint8Array(byteBuf), 0);
				tmp.set(new Uint8Array(data), byteBuf.byteLength);

				const { str, remain } = safeDecode(tmp.buffer);
				textBuf += str;
				byteBuf = tmp.buffer.slice(tmp.buffer.byteLength - remain);

				const pieces = textBuf.split('\n\n');
				textBuf = pieces.pop() || '';
				pieces.forEach((chunk) => {
					if (!chunk.startsWith('data:')) return;
					const jsonStr = chunk.slice(5).trim();
					try {
						const msg = JSON.parse(jsonStr);
						console.log('微信鸿蒙流式返回的数据', msg);
						chatCot.value = msg.data.cot;
						if (msg.code == 100) {
							answerText.value = answerText.value + (msg.data.answer || '');
						} else {
							answerText.value = msg.data.answer;
							sessionId.value = msg.data.sessionId;
							queryId.value = msg.data.queryId;
							qureyShow.value = false;
							getVoice(answerText.value)
						}
					} catch (e) {
						console.warn('JSON 解析失败:', e, jsonStr);
					}
				});
			});
			// #endif
		} else {
			console.log('------tokenRes-------', tokenRes);
			toast(tokenRes.message);
		}
	} catch (e) {
		console.log('------e-------', e);
		toast(e.message);
	}
};

function utf8Decode(ab) {
	const view = new DataView(ab);
	let out = '';
	let i = 0;
	while (i < view.byteLength) {
		const byte1 = view.getUint8(i++);
		if (byte1 < 0x80) {
			out += String.fromCharCode(byte1);
		} else if (byte1 < 0xe0) {
			if (i >= view.byteLength) break;
			const byte2 = view.getUint8(i++);
			out += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
		} else if (byte1 < 0xf0) {
			if (i + 1 > view.byteLength) break;
			const byte2 = view.getUint8(i++);
			const byte3 = view.getUint8(i++);
			out += String.fromCharCode(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
		} else {
			if (i + 2 > view.byteLength) break;
			const byte2 = view.getUint8(i++);
			const byte3 = view.getUint8(i++);
			const byte4 = view.getUint8(i++);
			const code = (((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f)) - 0x10000;
			out += String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff));
		}
	}
	return out;
}

function safeDecode(ab) {
	const view = new DataView(ab);
	let cutPos = view.byteLength;
	while (cutPos > 0 && (view.getUint8(cutPos - 1) & 0x80) !== 0) {
		cutPos--;
		const b = view.getUint8(cutPos);
		if ((b & 0xe0) === 0xc0 && view.byteLength - cutPos >= 2) break;
		if ((b & 0xf0) === 0xe0 && view.byteLength - cutPos >= 3) break;
		if ((b & 0xf8) === 0xf0 && view.byteLength - cutPos >= 4) break;
	}
	const slice = view.buffer.slice(0, cutPos);
	return { str: utf8Decode(slice), remain: view.byteLength - cutPos };
}

const iosStart = (token, requestTime, query) => {
	sseBuffer = '';
	try {
		const task = request({
			url: aiUrl + '/copilot/v1/openApi/chat',
			method: 'POST',
			responseType: 'text',
			enableChunked: true,
			timeout: 10 * 60 * 1000,
			header: {
				Accept: 'text/event-stream',
				'Content-Type': 'application/json',
				copilotToken: token,
				requestTime: requestTime,
				copilotAk: 'copilot_ak_4qZ84MGWrRoXcMwY',
				assistantId: '118',
			},
			data: {
				type: 'IM_CLICK',
				assistantId: 118,
				query: query,
				sessionId: uuid,
				params: {
					userCode: getToken(),
					userLat: uni.getStorageSync('address').lat || '',
					userLon: uni.getStorageSync('address').lng || '',
					useLon: uni.getStorageSync('address').lng || '',
					member_id: uni.getStorageSync('userInfo').id || '',
				},
			},
			complete: (e) => {
				console.log('IOS流式request', e);
			},
		});
		if (task && typeof task.onHeadersReceived === 'function') {
			task.onHeadersReceived((res) => {
				console.log('-0-0-22111112220-0--', res);
				sseLog.value = `${sseLog.value}[HEADERS] statusCode=${res.statusCode}\n`;
				if (res.statusCode === 401) sseStatus.value = 'UNAUTHORIZED (401)';
				else sseStatus.value = `CONNECTED (${res.statusCode})`;
			});
		}

		if (task && typeof task.onTextChunkReceived === 'function') {
			task.onTextChunkReceived((res) => {
				const text = res.text || '';
				if (!text) return;
				sseBuffer += text;
				processSSEBuffer();
			});
		} else if (task && typeof task.onChunkReceived === 'function') {
			task.onChunkReceived((res) => {
				const text = res.text || '';
				if (!text) return;
				sseBuffer += text;
				processSSEBuffer();
			});
		}
	} catch (err) {
		console.log('-0-00999980', err);
	}
};

function processSSEBuffer() {
	let boundaryIndex;
	while ((boundaryIndex = sseBuffer.indexOf('\n\n')) !== -1) {
		const chunk = sseBuffer.substring(0, boundaryIndex);
		sseBuffer = sseBuffer.substring(boundaryIndex + 2);
		parseAndHandleSSEChunk(chunk);
	}
	if (sseBuffer.length > 10000) {
		const lastNewline = sseBuffer.lastIndexOf('\n');
		if (lastNewline > 0) {
			const chunk = sseBuffer.substring(0, lastNewline);
			sseBuffer = sseBuffer.substring(lastNewline + 1);
			parseAndHandleSSEChunk(chunk);
		}
	}
}

function parseAndHandleSSEChunk(chunk) {
	const lines = chunk.split('\n');
	let dataLines = [];
	let eventType = '';

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;

		if (trimmed.startsWith('event:')) {
			eventType = trimmed.substring(6).trim();
		} else if (trimmed.startsWith('data:')) {
			dataLines.push(trimmed.substring(5).trim());
		}
	}

	const dataStr = dataLines.join('\n');

	if (!dataStr || dataStr === '[DONE]') {
		if (dataStr === '[DONE]') {
			finishCore();
		}
		return;
	}

	try {
		const parsed = JSON.parse(dataStr);
		handleParsedMessage(parsed);
	} catch (e) {
		console.warn('JSON 解析失败，可能是未完成的数据:', dataStr.substring(0, 100));
	}
}

function handleParsedMessage(msg) {
	console.log('收到消息:', msg);

	if (!msg || !msg.data) return;

	const { code, data } = msg;

	chatCot.value = data.cot;
	if (code == 100) {
		answerText.value = answerText.value + (data.answer || '');
	} else {
		answerText.value = data.answer;
		qureyShow.value = false;
		getVoice(answerText.value)
	}
}

const start = (token, requestTime, query) => {
	chatSSEClientRef.value.startChat({
		url: aiUrl + '/copilot/v1/openApi/chat',
		headers: {
			copilotToken: token,
			requestTime: requestTime,
			copilotAk: 'copilot_ak_4qZ84MGWrRoXcMwY',
			assistantId: '118',
		},
		method: 'post',
		body: {
			type: 'IM_CLICK',
			assistantId: 118,
			query: query,
			sessionId: sessionId.value,
			params: {
				userCode: getToken(),
				userLat: uni.getStorageSync('address').lat || '',
				userLon: uni.getStorageSync('address').lng || '',
				useLon: uni.getStorageSync('address').lng || '',
				member_id: uni.getStorageSync('userInfo').id || '',
			},
		},
		onMessage: messageCore,
		onError: errorCore,
		onOpen: openCore,
		onFinish: finishCore,
	});
};

const openCore = (response) => {
	console.log('open sse：', response);
};

const errorCore = (err) => {
	console.log('error sse：', err);
};

const messageCore = (msg) => {
	const data = JSON.parse(msg.data);
	console.log('返回数据：', data);

	chatCot.value = data.data.cot;
	if (data.code == 100) {
		answerText.value = answerText.value + (data.data.answer || '');
	} else {
		answerText.value = data.data.answer;
		sessionId.value = msg.data.sessionId;
		queryId.value = msg.data.queryId;
		qureyShow.value = false;
		getVoice(answerText.value)
	}
};

const finishCore = () => {
	console.log('finish sse');
};

// 语音播报初始化
const audioInit = () => {
	audioVoice = uni.createInnerAudioContext();
	audioVoice.onPause(() => {
		voiceStop();
	});
	audioVoice.onStop(() => {
		voiceStop();
	});
	audioVoice.onEnded(() => {
		voiceStop();
	});
	audioVoice.onError((e) => {
		console.log('音频播放错误',e);
	});
};

const voicePlay = (audioSrc) => {
	audioRef.value.play(audioSrc)
	isBobaoShow.value = true
	// if (!audioSrc) return;
	// try{
	// 	// 1. 停止当前
	// 	    audioVoice.stop();
	// 	audioVoice.src = audioSrc;
	// 	isBobaoShow.value = true;
	// 	setTimeout(() => {
	// 		audioVoice.play();
	// 	}, 100);
	// }catch(e){
	// 	console.log('播放错误0',e);
	// }
	
};

const voiceStop = () => {
	// audioVoice.stop();
	// // #ifdef MP-WEIXIN
	// audioVoice.src = '';
	// // #endif
	audioRef.value.stop()
	isBobaoShow.value = false;
};

const getVoice = async (text) => {
	uni.showLoading({ title: '合成中' });
	try {
		let res = await textCensor({
			lan: 'zh',
			ctp: 1,
			tex: fixQuotes(text),
			cuid: getUUID(),
			per: 6561,
		});
		if (res.code == 200) {
			voicePlay(res.data.url);
			
		}else{
			uni.showToast({ title: res.msg || '合成失败', icon: 'none' });
		}
		console.log('语音合123', res);
	} catch (e) {
		console.log('语音合成失败', e);
		uni.showToast({ title: e.msg || '合成失败', icon: 'none' });
	}
	uni.hideLoading();
};

const stopTalk = (text) => {
	if (isBobaoShow.value) {
		voiceStop();
		return;
	}
	getVoice(text);
};

// 长安语音识别
const recorderChange = async (event) => {
	console.log(event);
	if (event.success) {
		let obj = {};
		// #ifdef APP-HARMONY
		const saved = await uni.saveFile({ tempFilePath: event.filePath });
		const savedPath = saved.savedFilePath; // 真实可用路径
		obj = { voice: savedPath, duration: event.duration, voiceState: event.voiceState };
		// #endif
		// #ifdef MP-WEIXIN
		obj = { voice: event.filePath, duration: event.duration, voiceState: event.voiceState };
		// #endif
		uploadPcm(obj);
	}
};
const uploadPcm = (data) => {
	// return
	// 1. 读文件
	// #ifdef MP-WEIXIN || APP-HARMONY
	const fs = uni.getFileSystemManager();
	fs.readFile({
		filePath: data.voice,
		encoding: 'base64',
		success: (res) => {
			// console.log("base64res", res);
			getVoictToText(res.data, data);
		},
		fail: (e) => console.error('读文件失败', e),
	});
	// #endif
	// #ifdef APP-PLUS
	plus.io.resolveLocalFileSystemURL(data.voice, (entry) => {
		entry.file((file) => {
			const reader = new plus.io.FileReader();
			reader.onloadend = (e) => {
				getVoictToText(e.target.result.split(',')[1], data);
			};
			reader.readAsDataURL(file);
		});
	});
	// #endif
};
// 语音转文字
const getVoictToText = async (base64Speech, datas) => {
	try {
		const tokRes = await voiceToken();
		const accessToken = tokRes.access_token || null;
		if (accessToken) {
			// #ifdef APP-HARMONY
			base64Speech = base64Speech.replace(/^AAAAAA......../, '');
			// #endif
			const res = await voiceTotext(accessToken, base64Speech);
			if (res.err_no == 0) {
				let valueText = res.result.join();
				if (!valueText) {
					toast('未识别出文字');
					return;
				} else {
					searchValue.value = res.result.join().replace(/[。.]$/, "");
					onSearch();
					yystatus.value = false;
				}
			} else {
				toast(e.err_msg);
			}
		} else {
			toast(tokRes.error);
		}
	} catch (e) {
		toast(e.error);
	}
};

// 点赞、点踩
const positive = ref(false);
const negative = ref(false);
const feedbBackId = ref('');
const negaObj = ref({});
const zanClick = async (type) => {
	const item = {
		sessionId: sessionId.value,
		queryId: queryId.value,
		feedbBackId: feedbBackId.value,
		positive: positive.value,
		negative: negative.value,
	};
	if (type == 'POSITIVE') {
		if (positive.value) {
			delFeed(item, type);
		} else {
			praiseClick(item, type);
		}
	} else {
		if (negative.value) {
			delFeed(item, type);
		} else {
			negaObj.value = item;
			negaShow.value = true;
		}
	}
};

const negaShow = ref(false);
const negaForm = ref({
	negativeFeedbackType: '',
	feedbackContent: '',
});
const closepop = () => {
	negaShow.value = false;
	negaForm.value.negativeFeedbackType = '';
	negaForm.value.feedbackContent = '';
};
const submitpop = () => {
	praiseClick(negaObj.value, 'NEGATIVE');
};

const praiseClick = async (item, type) => {
	try {
		const requestTime = formatTimestamp(new Date().getTime() - 1000, 'YYYY-MM-DD HH:mm:ss');
		const tokenRes = await getOpenToken(requestTime);
		if (tokenRes.status === 200) {
			let params = {
				requestTime: requestTime,
				feedbackType: type,
				sessionId: item.sessionId,
				queryId: item.queryId,
				lastQueryId: item.queryId,
				feedbackContent: '',
			};
			if (type == 'NEGATIVE') {
				params.feedbackContent = negaForm.value.feedbackContent;
				params.negativeFeedbackType = negaForm.value.negativeFeedbackType;
			}
			const ress = await feedbackAi(tokenRes.result, params);
			if (ress.status == 200) {
				feedbBackId.value = ress.result;
				if (type == 'POSITIVE') {
					positive.value = true;
					negative.value = false;
				} else {
					negative.value = true;
					positive.value = false;
				}
				closepop();
				uni.showToast({ title: type == 'POSITIVE' ? '点赞成功' : '反馈成功', icon: 'none' });
			} else {
				uni.showToast({ title: '提交失败', icon: 'none' });
			}
		} else {
			uni.showToast({ title: 'token获取失败', icon: 'none' });
		}
	} catch (e) {
		console.log('-----------------0', e);
		uni.showToast({ title: e.message, icon: 'none' });
	}
};

const delFeed = async (item, type) => {
	try {
		const requestTime = formatTimestamp(new Date().getTime() - 1000, 'YYYY-MM-DD HH:mm:ss');
		const tokenRes = await getOpenToken(requestTime);
		if (tokenRes.status == 200) {
			const ress = await feedbackDeleteAi(tokenRes.result, {
				requestTime: requestTime,
				id: item.feedbBackId,
			});
			if (ress.status == 200) {
				positive.value = false;
				negative.value = false;
				feedbBackId.value = '';
				uni.showToast({ title: '取消成功', icon: 'none' });
			} else {
				positive.value = false;
				negative.value = false;
				feedbBackId.value = '';
			}
		} else {
			uni.showToast({ title: '获取token失败', icon: 'none' });
		}
	} catch (err) {
		console.log('-----------', err);
	}
};

onMounted(() => {
	getdefaultrequest();
	getdictlist();
	aimodelstatus.value = isLogin.value ? true : false;
});
onReady(() => {
	// audioInit();
});
onUnmounted(() => {
	if (audioVoice) {
		audioVoice.destroy();
	}
});
</script>

<style lang="scss">
.search_bg {
	width: 750rpx;
	height: 448rpx;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 0;
}

view {
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	position: relative;
}

.search_page {
	width: 750rpx;
	height: 100vh;
	z-index: 2;

	.scrollY {
		width: 750rpx;
		flex: 1 0;
		height: 0;
		.scrobox {
			width: 750rpx;
			align-items: center;
		}
	}

	.search-box {
		width: 690rpx;
		background: #ffffff;
		border-radius: 16rpx;
		padding: 11rpx 30rpx 22rpx 30rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
	}

	.searchActive {
		box-shadow: 0px 0px 16rpx 0px rgba(187, 244, 118, 0.7);
	}

	// 搜索框
	.search_bar {
		width: 100%;
		height: 80rpx;
		// background: #ffffff;
		// border-radius: 16rpx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		// padding-right: 10rpx;
		// padding-left: 20rpx;
		overflow: hidden;

		.s_input {
			flex: 1 0;
			height: 80rpx;
			margin-left: 10rpx;
			font-weight: 400;
			font-size: 28rpx;
		}
	}
	.aiBox {
		flex-direction: row;
		justify-content: center;
		width: 180rpx;
		height: 64rpx;
		border-radius: 38rpx;
		background: #f8fff0;
		box-sizing: border-box;
		border: 1px solid;
		font-size: 28rpx;
	}
	.search_bar_btn {
		width: 100rpx;
		height: 60rpx;
		background: linear-gradient(to bottom left, #b2d38a, #80a653);
		border-radius: 16rpx;

		.search_bar_btn_text {
			font-weight: 400;
			font-size: 28rpx;
			color: #ffffff;
			text-align: center;
			line-height: 60rpx;
		}
	}

	// 安卓语音提示
	.yy_box_o {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		.yy_box{
			width: 100%;
			padding: 20rpx 30rpx 50rpx;
			box-sizing: border-box;
			.yy_box1 {
				width: 100%;
				min-height: 88rpx;
				background: #fff;
				border-radius: 44rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 20rpx;
				box-sizing: border-box;
				position: relative;
				box-shadow: 0px 4px 16px 0px rgba(203, 227, 246, 0.5029);
				:deep(.recording-popup){
					flex-direction: row;
				}
			}
		}
	}

	// 回答的数据
	.aimsg_box {
		width: 690rpx;
		padding: 30rpx;
		border-radius: 16rpx;
		box-shadow: 0px 4rpx 16rpx 0px rgba(203, 227, 246, 0.5029);
		margin-top: 22rpx;
		.aimsg_item {
			width: 630rpx;
			overflow: hidden;
			.aimsg_user {
				width: 630rpx;
				flex-direction: row;
				justify-content: flex-end;
				margin-bottom: 50rpx;
				.aimsg_user_text {
					border-radius: 50rpx 36rpx 0rpx 50rpx;
					background: #07c07d;
					padding-top: 24rpx;
					padding-bottom: 24rpx;
					padding-left: 40rpx;
					padding-right: 40rpx;
					font-size: 28rpx;
					color: #ffffff;
				}
			}
			.aimsg_serve {
				width: 630rpx;
				margin-bottom: 50rpx;
				.querBoxTitle {
					flex-direction: row;
					align-items: center;
					margin-bottom: 14rpx;
					.querBoxTitle-text {
						font-size: 28rpx;
						color: #333333;
						margin-left: 6rpx;
					}
				}
				.queryBoxList {
					width: 630rpx;
					.queryBoxList-item {
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
						.queryBoxList-item-text {
							font-weight: 400;
							font-size: 24rpx;
							color: #6e6e6e;
						}
					}
				}
				.queryBoxText {
					width: 630rpx;
					overflow: hidden;
					.queryBoxText_text {
						font-size: 28rpx;
						color: #333333;
					}
				}
				.queryBoxBt {
					width: 630rpx;
					margin-top: 46rpx;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					border-top: 2rpx solid #efefef;
					padding-top: 20rpx;
					.queryBoxBt_l {
						.queryBoxBt_l_btns {
							flex-direction: row;
							align-items: center;
							margin-bottom: 20rpx;
							.queryBoxBt_l-img {
								width: 56rpx;
								height: 56rpx;
								border-radius: 16rpx;
								margin-right: 24rpx;
							}
						}
						.queryBoxBt_l_tips {
							font-size: 24rpx;
							color: #666666;
						}
					}
					.queryBoxBt_r {
						width: 164rpx;
						height: 64rpx;
						border-radius: 16rpx;
						text-align: center;
						.queryBoxBt_r_text {
							text-align: center;
							line-height: 64rpx;
							font-size: 28rpx;
							color: #ffffff;
						}
					}
				}
			}
		}
	}

	// 没有搜索的展示
	.no_page {
		width: 690rpx;
		padding-top: 56rpx;

		.bt_box {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 28rpx;

			.bt_box_img {
				width: 32rpx;
				height: 32rpx;
				border-radius: 8rpx;
				margin-right: 14rpx;
			}

			.bt_box_title {
				flex: 1;
				font-weight: 500;
				font-size: 32rpx;
				color: #333333;
			}

			.bt_box_rtext {
				font-weight: 400;
				font-size: 24rpx;
				color: #333333;
				margin-left: 10rpx;
			}
		}

		.ls_list {
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;

			.ls_item {
				padding-left: 18rpx;
				padding-right: 18rpx;
				height: 54rpx;
				background: #ffffff;
				box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(211, 231, 209, 0.4);
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				margin-right: 20rpx;
				margin-bottom: 20rpx;

				.ls_item_text {
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
					padding-right: 10rpx;
					box-sizing: border-box;
				}
			}
		}

		// 排行榜Tab
		.rankstab {
			width: 690rpx;
			flex-direction: row;
			white-space: nowrap;

			.scrout {
				display: inline-block;
			}

			.bt_box {
				margin-right: 54rpx;
			}
		}

		// 排行榜单
		.ph_box {
			width: 690rpx;
			padding-left: 16rpx;

			.ph_item {
				height: 80rpx;
				flex-direction: row;
				align-items: center;

				.ph_item_num {
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
				}

				.active {
					font-weight: 700;
					color: #d43b11;
				}

				.ph_item_cont {
					font-size: 28rpx;
					color: #333333;
					margin-left: 16rpx;
					margin-right: 40rpx;
				}

				.ph_item_tips {
					font-size: 28rpx;
					color: #ff3700;
				}
			}
		}
	}

	// 有数据的页面
	.yesbox {
		width: 690rpx;

		// tab切换
		.tab_list {
			flex-direction: row;
			align-items: center;
			margin-bottom: 40rpx;
			margin-top: 34rpx;

			.tab_item {
				align-items: center;
				margin-right: 60rpx;

				.tab_item_text {
					font-weight: 500;
					font-size: 28rpx;
					color: #333333;
					margin-bottom: 8rpx;
				}

				.tab_item_img {
					width: 30rpx;
					height: 6rpx;
				}
			}

			.tab_item:last-child {
				margin-right: 0;
			}
		}

		// 服务模块
		.fwbox {
			width: 690rpx;

			.fw_title {
				font-weight: 400;
				font-size: 24rpx;
				color: #333333;
				margin-bottom: 20rpx;
			}

			.fw_rout {
				width: 690rpx;
				height: 88rpx;
				background: #ffffff;
				box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(211, 231, 209, 0.4);
				border-radius: 16rpx;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding-left: 20rpx;
				padding-right: 30rpx;
				margin-bottom: 20rpx;

				.fw_rout_text {
					flex: 1;
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.fw_item {
				width: 690rpx;
				height: 204rpx;
				background: #ffffff;
				box-shadow: 0rpx 4rpx 16rpx 0rpx #d3e7d1;
				border-radius: 16rpx;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding-left: 20rpx;
				padding-right: 20rpx;
				margin-bottom: 20rpx;

				.fw_item_img {
					width: 164rpx;
					height: 164rpx;
					border-radius: 20rpx;
					margin-right: 30rpx;
				}

				.fw_item_r {
					flex: 1 0;
					width: 0;
					height: 164rpx;
					justify-content: space-between;

					.fw_item_r_text {
						font-weight: 500;
						font-size: 32rpx;
						color: #333333;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.fw_item_r_tag {
						flex-direction: row;
						justify-content: space-between;

						.fw_item_r_tag_text {
							padding-left: 8rpx;
							padding-right: 8rpx;
							height: 28rpx;
							background: rgba(98, 143, 47, 0.08);
							border-radius: 8rpx;
							border-width: 2rpx;
							border-style: solid;
							border-color: #628f2f;
							font-weight: 500;
							font-size: 20rpx;
							color: #628f2f;
							line-height: 24rpx;
						}

						.fw_item_r_tag_text1 {
							font-weight: 500;
							font-size: 28rpx;
							color: #fb0e0e;
						}
					}

					.fw_item_r_info {
						flex-direction: row;
						align-items: center;

						.fw_item_r_info_img {
							width: 28rpx;
							height: 28rpx;
							margin-right: 8rpx;
						}

						.fw_item_r_info_text {
							flex: 1;
							font-weight: 400;
							font-size: 24rpx;
							color: #333333;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
			}
		}

		// 活动模块
		.hdbox {
			width: 690rpx;
			height: 248rpx;
			background: linear-gradient(to bottom right, #ebf8ee, #fefefe);
			box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
			border-radius: 32rpx;
			padding-left: 24rpx;
			padding-right: 24rpx;
			justify-content: center;
			margin-bottom: 20rpx;

			.hd_head {
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 19rpx;

				.hd_head_l {
					flex-direction: row;
					align-items: flex-start;

					.hd_head_l_text {
						font-size: 32rpx;
						color: #333333;
						margin-right: 8rpx;
					}

					.hd_head_l_img {
						width: 16rpx;
						height: 16rpx;
					}
				}

				.hd_head_r {
					width: 80rpx;
					height: 18rpx;
				}
			}

			.hd_info {
				height: 156rpx;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.hd_info_img {
					width: 200rpx;
					height: 156rpx;
					margin-right: 20rpx;
				}

				.hd_info_r {
					flex: 1;
					height: 156rpx;
					justify-content: space-between;

					.hd_info_r_text {
						font-weight: 400;
						font-size: 28rpx;
						color: #333333;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.hd_info_r_text1 {
						font-weight: 400;
						font-size: 24rpx;
						color: #6e6e6e;
					}

					.hd_info_r_b {
						flex-direction: row;
						align-items: center;
						justify-content: space-between;

						.hd_info_r_text2 {
							font-size: 24rpx;
							color: #6e6e6e;
						}

						.hd_info_r_text3 {
							flex: 1;
							font-size: 24rpx;
							color: #ff9b36;
						}

						.hd_info_r_btn {
							width: 128rpx;
							height: 48rpx;
							background: #ff9b36;
							border-radius: 10rpx;

							.hd_info_r_btn_text {
								font-weight: 400;
								font-size: 28rpx;
								color: #ffffff;
								text-align: center;
								line-height: 48rpx;
							}
						}
					}
				}
			}
		}

		// 商品模块
		.spbox {
			width: 690rpx;
			flex-direction: row;
			justify-content: space-between;
			flex-wrap: wrap;

			.goods_item {
				width: 332rpx;
				height: 260rpx;
				background: linear-gradient(to bottom right, #fefefe, #ebf8ee);
				box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
				border-radius: 20rpx;
				align-items: center;
				justify-content: center;
				margin-bottom: 24rpx;

				.goods_item_img {
					width: 280rpx;
					height: 120rpx;
					border-radius: 20rpx;
					margin-bottom: 20rpx;
				}

				.goods_item_txt {
					width: 280rpx;
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
					text-align: left;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-bottom: 18rpx;
				}

				.goods_item_nums {
					width: 280rpx;
					flex-direction: row;
					align-items: center;
					justify-content: center;

					.goods_item_num {
						font-weight: 400;
						font-size: 28rpx;
						color: #ff9b36;
					}

					.goods_item_icon {
						width: 28rpx;
						height: 28rpx;
					}

					.goods_item_txt1 {
						flex: 1;
						font-weight: 400;
						font-size: 24rpx;
						color: #6e6e6e;
						text-align: right;
					}
				}
			}
		}

		// 货源模块
		.hybox {
			width: 690rpx;

			// 接单列表
			.card_order {
				width: 690rpx;
				height: 250rpx;
				background: linear-gradient(to left, #f8fcf9, #edfff1);
				box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
				border-radius: 16rpx;
				margin-bottom: 32rpx;
				padding-left: 24rpx;
				padding-right: 24rpx;
				padding-top: 32rpx;
				padding-bottom: 32rpx;
				justify-content: space-between;

				.card_order_t {
					flex-direction: row;
					align-items: center;

					.card_order_t_start,
					.card_order_t_end {
						flex: 1;
						font-weight: 500;
						font-size: 36rpx;
						color: #628f2f;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.arrow_img {
						width: 140rpx;
						height: 26rpx;
						margin-left: 30rpx;
						margin-right: 30rpx;
					}

					.card_order_t_type {
						font-weight: 500;
						font-size: 36rpx;
						color: #ff9b36;
					}
				}

				.card_order_time {
					flex-direction: row;
					align-items: center;

					.card_order_time_txt {
						font-weight: 400;
						font-size: 28rpx;
						color: #333333;
						margin-right: 34rpx;
					}
				}

				.card_order_user {
					flex-direction: row;
					align-items: center;
					justify-content: space-between;

					.card_order_user_txt {
						font-weight: 400;
						font-size: 28rpx;
						color: #333333;
						margin-right: 62rpx;
					}

					.card_order_user_txt1 {
						flex: 1;
						font-weight: 400;
						font-size: 28rpx;
						color: #333333;
					}

					.card_order_user_btn {
						width: 148rpx;
						height: 52rpx;
						background: #ff9b36;
						border-radius: 10rpx;

						.card_order_user_btn_txt {
							font-weight: 400;
							font-size: 28rpx;
							color: #ffffff;
							text-align: center;
							line-height: 52rpx;
						}
					}
				}
			}
		}
	}

	// 数字人按钮
	.numberpersion {
		width: 280rpx;
		height: 72rpx;
		background: #ffffff;
		border-radius: 48rpx;
		border-width: 2rpx;
		border-style: solid;
		border-color: #628f2f;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: fixed;
		right: calc((750rpx - 280rpx) / 2);
		bottom: 78rpx;
		left: calc((750rpx - 280rpx) / 2);

		.numberpersion_text {
			font-weight: 500;
			font-size: 32rpx;
			color: #628f2f;
		}
	}

	// 展开更多按钮
	.more_btn {
		width: 100%;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: 20rpx;
		.more_text {
			font-size: 24rpx;
			color: #666666;
			margin-right: 8rpx;
		}
	}
}

// 点踩弹窗
.feedBox {
	width: 660rpx;
	padding: 30rpx;
	border-radius: 30rpx;
	background: #ffffff;
	.feedBox-buts {
		flex-direction: row;
		justify-content: space-around;
		padding-top: 25rpx;
		.feedBox-buts-item {
			width: 260rpx;
			height: 70rpx;
			border-radius: 15rpx;
			line-height: 70rpx;
			text-align: center;
		}
		.buts1 {
			border: 1rpx solid #eeeeee;
		}
		.buts2 {
			background: #539dff;
			color: #ffffff;
		}
	}
	.feedBox-title {
		font-size: 30rpx;
		font-weight: bold;
	}
	.feedBox-tebs {
		padding: 20rpx 0;
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		.feedBox-tebs-text {
			width: 180rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			font-size: 24rpx;
			border: 1rpx solid #eeeeee;
			border-radius: 14rpx;
		}
		.activeText {
			color: #ffffff;
			background: #539dff;
			border: 1rpx solid #539dff;
		}
	}
}

// 数字人组件
.digiTalBox {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
}
</style>
