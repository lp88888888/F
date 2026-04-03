<template>
	<!-- 背景色 -->
	<view class="search_bg" :style="{background:themeStore.themeColors.$bgTemToPageColor}"></view>
	<view class="search_page">
		<!-- 导航栏 -->
		<up-navbar :bgColor="themeStore.themeColors.$pageBgColor" placeholder :fixed="true" title="搜索" autoBack></up-navbar>

		<!-- 搜索栏 -->
		<view class="search_bar">
			<uni-icons type="search" size="20" color="#3D3D3D"></uni-icons>
			<input
				class="s_input"
				type="text"
				v-model="searchValue"
				placeholder="请输入"
				@focus="onFocus"
				@blur="onBlur"
				@confirm="onSearch"
				@input="debounceSearch"
			/>
			<view class="search_bar_btn" :style="{background:themeStore.themeColors.$bgLgColor}" @click="onSearch">
				<text class="search_bar_btn_text">搜索</text>
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
		</view>
           <view class="goods_list1_wrap">
           	<view class="goods_list">
           		<view style="flex-direction: row; align-items: center; justify-content: space-between; flex-wrap: wrap">
           			<view class="goods_item" v-for="(item, index) in allListData" :key="index"
           				@click="toNav('/pages_A/points/details?id=' + item.id)">
           				<image class="goods_item_img" :src="item.picUrl" mode=""></image>
           				<text class="goods_item_txt">{{ item.spuName }}</text>
           				<view class="goods_item_nums">
           					<image v-if='item.returnActivityType==4' class="goods_item_img-1"
           						:src="imgUrl + 'zhekou-3.png'" mode="">
           					</image>
           					<view><text class="goods_item_num">{{ item.point }}</text></view>
           					<image class="goods_item_icon" :src="imgUrl + 'static/jf_icon_yellow.png'" mode="">
           					</image>
           					<image v-if='item.returnActivityType==1' class="goods_item_img-2"
           						:src="imgUrl + 'fanquan-3.png'" mode="">
           					</image>
           					<text class="goods_item_txt1">已兑换{{ item.salesCount || 0 }}+</text>
           				</view>
           				<image v-if='item.returnActivityType==3' class="goods_item_img-3"
           					:src="imgUrl + 'miaosha-3.png'" mode=""></image>
           			</view>
					<ser-empty v-if="!allListData.length"></ser-empty>
           		</view>
           	</view>
           </view>
		<!-- 问问数字人按钮 -->
		<!-- #ifdef APP-PLUS -->
		<view class="numberpersion" :style="{borderColor:themeStore.themeColors.$primaryColor}" v-if="micstatus" @click="openCheck">
			<uni-icons type="mic" size="20" :color="themeStore.themeColors.$primaryColor"></uni-icons>
			<text class="numberpersion_text" :style="{color:themeStore.themeColors.$primaryColor}">问问数字人</text>
		</view>
		<!-- #endif -->

		<!-- 实时语音弹窗 -->
		<SpeechRecognition :show="speekstatus" @close="closeSpeek"></SpeechRecognition>

		<SateLayer ref="sateLayerRef"></SateLayer>
	</view>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { imgUrl } from '../../config';
import { toNav } from '@/utils/route';
import { toast } from '@/utils/common';
import { openAPPLocation ,CurrentPage, showAlert2} from '@/utils/util';
import { getSeacheRecord, getServiceSiteList, getglobalsearch, getAllProduct,
 getsourceSearch, getservicesearch,listPoints} from '@/api/globasearch';
import { getDict, delSearchRecord, delAllSearchRecord, addSearchRecord } from '@/api/config';
import { requestMicrophonePermission, permission } from '@/utils/usePermission';
import { useAppStore } from '@/store/modules/app';
import SpeechRecognition from '@/components/SpeechRecognition';
import SateLayer from '@/components/SateLayer/index.vue';
import { onReachBottom } from '@dcloudio/uni-app';

// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);
const sateLayerRef = ref(null);
// 讲话弹窗
const speekstatus = ref(false);
const closeSpeek = async (val) => {
	console.log('讲话的状态', val);
	const hasPermission = await checkRecordAuth();
	if (!hasPermission) {
		uni.showToast({ title: '未获取麦克风权限', icon: 'none' });
		return;
	}
	speekstatus.value = val;
};
const listQuery = ref({
		pageNum: 1,
		pageSize: 999,
});
const openCheck = () => {
	if (isLogin.value) {
		closeSpeek(true);
	}else{
		uni.showToast({ title: '登录后使用，请先登录', icon: 'none' });
	}
	
}
// 焦点状态
const micstatus = ref(true);

// 获取焦点
const onFocus = () => {
	console.log('焦点获取');
	micstatus.value = false;
};

// 失去焦点
const onBlur = () => {
	console.log('焦点丢失');
	micstatus.value = true;
	// onSearch();
};

const searchValue = ref('');
const debounceTimer = ref(null);

// 防抖函数
const debounceSearch = () => {
	if (debounceTimer.value) {
		clearTimeout(debounceTimer.value);
	}
	debounceTimer.value = setTimeout(() => {
		if (!searchValue.value) {
			allListData.value = []
			return
		};
		onSearch();
	}, 300);
};

const onSearch = () => {
	if (!searchValue.value) {
		toast('请输入搜索的内容');
		return;
	}
	getgoodsinfo()
	addsearchval();
};

// 增加搜索历史
const addsearchval = async () => {
	const res = await addSearchRecord({
		businessType: 2,
		searchName: searchValue.value,
	});
	console.log('增加了历史搜索', res);
	getdefaultrequest();
};

// 删除所有历史搜索
const handleAll = async () => {
	if (!historylist.value.length) return;
	const res = await delAllSearchRecord(2);
	gethistory();
};

// 删除单个历史搜索
const handleOne = async (id) => {
	const res = await delSearchRecord(id);
	console.log('删除单个历史', res);
	getdefaultrequest();
};
// 默认查询
const getdefaultrequest = () => {
	gethistory();
	getdefault();
};

const tabindex = ref(0);



// 点击推荐搜索、热搜列表
const handleSelItem = (str) => {
	searchValue.value = str;
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
const appStore = useAppStore();
// 登录态（computed，不要对它赋值）
const isLogin = computed(() => appStore.checkLogin());
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
		const res = await getSeacheRecord(2);
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


// 查询商品信息
// const getgoodsinfo = async () => {
// 	try {
// 		const res = await getAllProduct({ name:searchValue.value });
// 		console.log('搜索的商品分类', res);
// 		allListData.value = res.data;
// 	} catch (err) {
// 		console.error('商品查询错误', err);
// 	}
// };


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
	const getgoodsinfo = async () => {
		try {
			const params = {
				...listQuery.value,
				spuName: searchValue.value || '',
				
			};
			const res = await listPoints(params);
			if (res.code == 200) {
				let { list, total: totalCount } = res.data;
				allListData.value = listQuery.value.pageNum == 1 ? list : [...productList.value, ...list];
			}
		} catch (error) {
			console.error('获取商品列表失败', error);
			toast('加载失败，请稍后重试');
		} finally {
		}
	};
onReachBottom(() => {
	console.log('触底加载');
	if (querydata.value.total > allListData.value.length) {
		querydata.value.pageNum += 1;
	}
});

onMounted(() => {
	gethistory()

});
</script>

<style lang="scss" scoped>
.search_bg {
	width: 750rpx;
	height: 448rpx;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 0;
	// transform: rotate(180deg);
}

view {
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	position: relative;
}

.search_page {
	align-items: center;
	z-index: 2;

	// 搜索框
	.search_bar {
		width: 690rpx;
		height: 80rpx;
		background: #ffffff;
		border-radius: 16rpx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-right: 10rpx;
		padding-left: 20rpx;
		overflow: hidden;

		.s_input {
			flex: 1 0;
			height: 80rpx;
			margin-left: 10rpx;
			font-weight: 400;
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
}


// 商品列表容器（核心新增样式）
			.goods_list1_wrap {
				padding-top: 30rpx;
			}
// 商品列表
		.goods_list {
			width: 690rpx;
			
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			// align-items: center;

			// 筛选模块
			.selmode {
				width: 644rpx;
				margin-bottom: 41rpx;
			}

			.rangbox {
				background-color: #ffffff;
			}

			.sel_box {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.sle_no_box {
					flex: 1;
				}

				.sel_box_qj,
				.sel_box_jf,
				.sel_box_dh {
					display: flex;
					align-items: center;
					margin-right: 32rpx;

					.sel_box_qj_txt {
						font-weight: 500;
						font-size: 28rpx;
						color: #333333;
						margin-right: 10rpx;
					}

					.sel_box_qj_icons,
					.sel_box_jf_icons,
					.sel_box_dh_icons {
						width: 17rpx;
						height: 28rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.sel_box_qj_icon {
							width: 17rpx;
							height: 17rpx;
						}
					}

					.sel_box_jf_txt,
					.sel_box_dh_txt {
						font-weight: 400;
						font-size: 24rpx;
						color: #6e6e6e;
						margin-right: 6rpx;
					}
				}

				.sel_box_ck {
					display: flex;
					align-items: center;

					.sel_box_ck_out {
						width: 23rpx;
						height: 23rpx;
						border-width: 1rpx;
						border-style: solid;
						border-color: #628f2f;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						border-radius: 50%;

						.sel_box_ck_in {
							width: 15rpx;
							height: 15rpx;
							background: #628f2f;
							border-radius: 50%;
						}
					}

					.sel_box_ck_txt {
						font-weight: 400;
						font-size: 24rpx;
						color: #6e6e6e;
						margin-left: 10rpx;
					}
				}
			}

			// 商品列表（核心修改）
			.goods_list1 {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				height: 100%;
				overflow-y: auto;
			}

			// 加载更多提示样式（核心新增）
			.load-more {
				width: 100%;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;

				text {
					font-size: 24rpx;
					color: #909599;
				}
			}

			// 商品项样式（原有）
			.goods_item {
				width: 330rpx;
				background: linear-gradient(to bottom right, #fefefe, #ebf8ee);
				box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
				border-radius: 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-bottom: 24rpx;
				position: relative;
				padding: 18rpx 0;

				.goods_item_img-3 {
					width: 132rpx;
					height: 56rpx;
					position: absolute;
					top: 0;
					left: 0;
				}

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
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-bottom: 18rpx;
				}



				
			}
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
		
			.goods_item_img-2 {
				width: 84rpx;
				height: 24rpx;
				margin-left: 10rpx;
			}
		
			.goods_item_img-1 {
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;
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
</style>
