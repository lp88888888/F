<template>
	<!-- 背景色 -->
	<view class="service_bg" :style="{background:themeStore.themeColors.$pageBgColor}"></view>
	<view class="service-page" :data-theme="pageTheme">
		<!-- 导航栏 -->
		<up-navbar :bgColor="themeStore.themeColors.$color2" placeholder :fixed="true">
			<template #left>
				<view class="navleft_box">
					<image class="navleft_box_img" :src="icoUrl + 'fw_locatuon.png'" mode=""></image>
					<view class="navleft_box_info">
						<text class="navleft_box_info_text">当前定位</text>
						<text class="navleft_box_info_text1">{{ address.city }}·{{ address.district }}</text>
					</view>
				</view>
			</template>
			<template #center>
				<text>服务</text>
			</template>
		</up-navbar>

		<!-- 搜索栏 -->
		<view class="search_bar" @click="onSearch">
			<!-- <up-search
				v-model="searchValue"
				placeholder="您有什么想吃的，或者想去的？"
				:showAction="false"
				shape="square"
				bgColor="#fff"
				border-radius="20"
				@confirm="onSearch"
			/> -->
			<up-icon name="search" color="#909599" style="margin-left: 24rpx"></up-icon>
			<text style="font-size: 28rpx; color: #909599; flex: 1">您有什么想吃的，或者想去的？</text>
			<image class="search_bar_img" :src="icoUrl + 'monkey_mike.png'" mode=""></image>
			<view class="search_bar_btn" @click="onSearch">
				<text class="search_bar_btn_text">搜索</text>
			</view>
		</view>

		<!-- 出行模块 -->
		<view class="qingse_box">
			<image class="qingse_box_img" :src="imgUrl + 'static/fw_zc.png'" mode=""
				@click="toNav('/pages_B/rentCar/index')"></image>
			<image class="qingse_box_img" :src="imgUrl + 'static/fw_dc.png'" mode="" @click="dcPath()"></image>
			<image class="qingse_box_img" :src="imgUrl + 'static/fw_kyp.png'" mode=""
				@click="pathNav()"></image>
		</view>

		<!-- 车辆交易与服务 -->
		<view class="fw_deal">
			<view v-for="(item, index) in vehicleServices" :key="index" @click="toNav(item.path)" class="fw_deal_item">
				<image :src="item.icon" mode="aspectFit" class="fw_deal_item_img" />
				<text class="fw_deal_item_text">{{ item.title }}</text>
			</view>
		</view>

		<!-- 广告横幅 -->
		<view class="ad_banner">
			<image :src="imgUrl + 'static/my-3.png'" mode="aspectFill" class="ad_img" />
		</view>

		<!-- 车生活 -->
		<!-- #ifdef APP || MP-WEIXIN -->
		<view class="card card1_bg">
			<view class="card_icon_card_header">
				<view class="card_icon_card_header_lt">
					<image class="card_icon_card_header-img" :src="icoUrl + 'icon_bg.png'" mode=""></image>
					<text class="title_text_primary">出行生活+</text>
					<image class="card_title_icon" :src="imgUrl + 'static/card_lt_icon.png'" mode=""></image>
				</view>
				<image
					class="card_icon_card_header_rt"
					:src="icoUrl + 'fw_card_icon.png'"
					mode="heightFix"
					@click="toNav('/pages_E/service/carlife')"
				></image>
			</view>
		<!-- #ifdef APP  -->
		<!-- <view class="subsection_box">
			<view class="subsection_box_item" v-for="(item, index) in subsectionData" :key="index" @click="handleTab(item)">
				<text :class="{ subsection_box_item_text: true, active: subsectionIndex === item.id }" :style="{color:subsectionIndex === item.id?themeStore.themeColors.$primaryColor:''}">{{ item.name }}</text>
			</view>
		</view> -->
		<!-- #endif -->
		<!-- 最新的TAB -->
		<view class="subsection_box">
			<view class="subsection_box_item" v-for="(item, index) in subsectionData" :key="index" @click="handleTab(item)">
				<text :class="{ subsection_box_item_text: true, active: subsectionIndex === item.id }" :style="{color:subsectionIndex === item.id?themeStore.themeColors.$primaryColor:''}">{{ item.name }}</text>
				<view class="subsection_box_item_line" :style="{background:subsectionIndex === item.id?themeStore.themeColors.$primaryColor:''}" v-if="subsectionIndex === item.id"></view>
			</view>
		</view>
		
		<view class="card_list">
				<view
					class="card_goods"
					v-for="(item, index) in [foodItems, ticketItems, hotelItems, tourItems][subsectionIndex]"
					:key="index"
					@click="toLink(item)"
				>
					<view class="card_goods_img">
						<image v-if="subsectionIndex == 0" :src="item.shopImage" mode="aspectFill" class="card_goods_img1" />
						<image v-if="subsectionIndex == 1" :src="item.image" mode="aspectFill" class="card_goods_img1" />
						<image v-if="subsectionIndex == 2" :src="item.mainImage" mode="aspectFill" class="card_goods_img1" />
						<image v-if="subsectionIndex == 3" :src="imgUrl + item.image" mode="aspectFill" class="card_goods_img1" />
						<text class="card_goods_img_jl">{{ item.straightLineDistance }}</text>
					</view>
					<text class="card_goods_title">{{ [item.shopName, item.poiName, item.hotelName, item.name][subsectionIndex] }}</text>
					<view class="card_goods_dec">
						<text class="card_goods_dec1">{{ [item.listGroupName, item.city, '', item.desc][subsectionIndex] }}</text>
						<text class="card_goods_dec2">￥</text>
						<text class="card_goods_dec3" v-if="subsectionIndex == 0">0</text>
						<text class="card_goods_dec3" v-if="subsectionIndex == 1">{{ handelJqPric(item) }}</text>
						<text class="card_goods_dec3" v-if="subsectionIndex == 2">{{ item.minPrice || 0 }}</text>
						<text class="card_goods_dec3" v-if="subsectionIndex == 3">0</text>
						<text class="card_goods_dec2">/人</text>
					</view>
				</view>
				<!-- <view class="" v-if="![foodItems, ticketItems, hotelItems, tourItems][subsectionIndex].length" style="margin: 0 auto">暂无数据</view> -->
				<ser-empty v-if="![foodItems, ticketItems, hotelItems, tourItems][subsectionIndex].length"></ser-empty>
			</view>
			
			<text
				class="card_goods_more"
				@click="toNav(['/pages_B/dining/index', '/pages_B/scenicSpotTicket/index', '/pages_B/hotel/hotelist', ''][subsectionIndex])"
				>进入{{ firterName }}频道 {{ '>' }}
			</text>
		</view>
		<!-- #endif -->
		

		<!-- <view class="card card2_bg">
			<view class="card_icon_card_header">
				<view class="card_icon_card_header_lt">
					<image class="card_icon_card_header-img" :src="imgUrl + 'static/card_lt_bg.png'" mode=""></image>
					<text class="title_text_primary">购物零售</text>
					<image class="card_title_icon" :src="imgUrl + 'static/card_lt_icon.png'" mode=""></image>
				</view>
			</view>

			<view class="card_list">
				<view
					class="card_goods"
					v-for="(item, index) in retailItems"
					:key="index"
					@click="toNav('/pages_B/directRetail/shopDetail?spuId=' + item.id)"
				>
					<view class="card_goods_img">
						<image :src="item.imgUrl" mode="aspectFill" class="card_goods_img1" />
						<text class="card_goods_img_jl">{{ item.distance }}</text>
					</view>
					<text class="card_goods_title">{{ item.productName }}</text>
					<view class="card_goods_dec">
						<text class="card_goods_dec1">{{ item.desc }}</text>
						<text class="card_goods_dec2">￥</text>
						<text class="card_goods_dec3">{{ item.sellingPrice }}</text>
						<text class="card_goods_dec2"></text>
					</view>
				</view>
			</view>

			<text class="card_goods_more" @click="toNav('/pages_B/directRetail/index')">进入零售购物频道 {{ '>' }} </text>
		</view> -->
		
		<SateLayer ref="sateLayerRef"></SateLayer>
		<PageDurationTracker pageName="服务" />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		imgUrl
	} from '../../config';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import {
		toNav
	} from '@/utils/route';
	import SateLayer from '@/components/SateLayer/index.vue';
	import {
		listOdsFzgRestaurantInfo
	} from '@/api/premium';
	import {
		getodsJjbScenicSpot
	} from '@/api/scenicArea';
	import {
		gethotelList
	} from '@/api/hotel';
	import {
		selectProductList
	} from '@/api/directretail';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import {
		useTheme
	} from '@/composables/useTheme';
	import {
		toast
	} from '@/utils/common';
	import {
		onShow
	} from '@dcloudio/uni-app';
	import {
		useAppStore
	} from '@/store/modules/app';
	const appStore = useAppStore();
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	// 监听themeStore.imgUrl的变化并更新icoUrl
	watch(
		() => themeStore.imgUrl,
		(newVal) => {
			icoUrl.value = newVal;
		}
	);
	// 搜索关键词
	const keyword = ref('');
	const sateLayerRef = ref(null);
	// 当前选中的 tab
	const currentTab = ref(1);
	const goto = (url) => {
		uni.navigateTo({
			url: url,
		});
	};
	// 底部导航配置
	const tabList = [{
			icon: 'home',
			text: '首页',
			name: 'home',
		},
		{
			icon: 'service',
			text: '服务',
			name: 'service',
		},
		{
			icon: 'rescue',
			text: '一键救援',
			name: 'rescue',
		},
		{
			icon: 'gift',
			text: '积分商城',
			name: 'points',
		},
		{
			icon: 'avatar',
			text: '我的',
			name: 'mine',
		},
	];

	// 出行卡片数据
	const travelCards = [{
			title: '租车',
			desc: '租车游 超便利',
			icon: '/static/icons/car-rental.png',
			bgColor: '#e8f8f5',
		},
		{
			title: '打车',
			desc: '速度快 不等待',
			icon: '/static/icons/taxi.png',
			bgColor: '#fffaf0',
		},
		{
			title: '客运售票',
			desc: '线路多 全覆盖',
			icon: '/static/icons/bus-ticket.png',
			bgColor: '#f0f8ff',
		},
	];

	// 车辆服务
	const vehicleServices = [{
			title: '二手车交易',
			desc: '验车审核 轻松过户',
			icon: imgUrl + 'static/fw_deal.png',
			path: '/pages_D/usedCar/index',
		},
		{
			title: '新车买卖',
			desc: '挑选心仪 更懂你心',
			icon: imgUrl + 'static/fw_buycar.png',
			path: '/pages_D/newCar/index',
		},
		{
			title: '4S店查询',
			desc: '官方授权 贴心放心',
			icon: imgUrl + 'static/fw_4s.png',
			path: '/pages_D/newCar/dealer',
		},
		{
			title: '换电充气',
			desc: '汽车搭电 轮胎充气',
			icon: imgUrl + 'static/fw_addair.png',
			path: '/pages_D/JumpStart/weizhilist',
		},
		{
			title: '检测站',
			desc: '认证站点 规范专业',
			icon: imgUrl + 'static/fw_testing.png',
			path: '/pages_D/inspection/index',
		},
		// {
		// 	title: '随手拍',
		// 	desc: '记录美好 发现问题',
		// 	icon: icoUrl.value + 'fuwu-12-icon.png',
		// 	path: '/pages_D/snapShare/index',
		// },
	];

	// 餐饮美食
	const foodItems = ref([]);
	const getlistOdsFzgRestaurantInfo = async () => {
		let params = {
			pageNum: 1,
			pageSize: 6,
			openState: undefined,
			scope: undefined,
			gitu: address.value.lat, // 纬度
			titu: address.value.lng, // 经度
		};
		const res = await listOdsFzgRestaurantInfo(params);
		console.log('餐饮美食参数', res);
		foodItems.value = res.data.list;
	};
	
	const toLink = (item) => {
		if (subsectionIndex.value == 0) {
			return toast('该功能正在快马加鞭赶来的路上');
		}
		toNav(
			[
				'/pages_B/dining/diningHome?id=' + item.shopId,
				'/pages_B/scenicSpotTicket/detail?id=' + item.poiId,
				'/pages_B/hotel/hotelDetails?id=' + item.id,
				'',
			][subsectionIndex.value]
		)
	}
	// 景区门票
	const handelJqPric = (e) => {
		console.log('景区的数据', e);
		if (!Array.isArray(e.odsJjbProductVoList)) {
			return 0;
		}
		return e.odsJjbProductVoList[0].odsJjbStockVo.salesPrice;
	};
	const ticketItems = ref([]);
	const getgetodsJjbScenicSpot = async () => {
		let params = {
			pageNum: 1,
			pageSize: 6,
			city: address.value.city,
			longitude: address.value.lng,
			latitude: address.value.lat,
		};
		let res = await getodsJjbScenicSpot(params);
		console.log('景区门票参数', res);
		let data = res.data.list;
		ticketItems.value = data.map((e) => {
			let arr = JSON.parse(e.images);
			return {
				...e,
				image: arr.length ? arr[0] : ''
			};
		});
	};

	// 酒店住宿
	const hotelItems = ref([]);
	const hotelList = async () => {
		let params = {
			pageNum: 1,
			pageSize: 6,
			longitude: address.value.lng,
			latitude: address.value.lat,
		};
		// 这里替换成实际的API调用
		const res = await gethotelList(params);
		console.log('酒店住宿参数', res);
		hotelItems.value = res.rows;
	};

	// 旅游线路
	const tourItems = [{
			name: '博物馆爱好者寻踪之路',
			desc: '串联千古一帝到大唐盛世一眼千年',
			image: 'trip-pro/hy_zj.png',
		},
		{
			name: '省会西安这样玩',
			desc: '逛城墙吃泡馍爬华山来陕西必须感受的访古迹吃碳水...',
			image: 'trip-pro/publish-bg.png',
		},
	];

	// 直营零售
	const retailItems = ref([]);
	const getselectProductList = async () => {
		let params = {
			pageNum: 1,
			pageSize: 6,
		};
		const res = await selectProductList(params);
		console.log('直营零售参数', res);
		retailItems.value = res.rows;
	};

	const backgroundImage = ref(imgUrl + 'static/fuwu-bj01.png');
	const bgStyle = computed(() => {
		if (!backgroundImage.value) return {};
		return {
			backgroundImage: `url(${backgroundImage.value})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
		};
	});
	const backgroundImage1 = ref(imgUrl + 'static/fuwu-bj03.png');
	const bgStyle1 = computed(() => {
		if (!backgroundImage.value) return {};
		return {
			backgroundImage: `url(${backgroundImage1.value})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
		};
	});
	const backgroundImage2 = ref(imgUrl + 'static/fuwu-bj02.png');
	const bgStyle2 = computed(() => {
		if (!backgroundImage2.value) return {};
		return {
			backgroundImage: `url(${backgroundImage2.value})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
		};
	});

	// 搜索
	const searchValue = ref('');
	const onSearch = () => {
		console.log('搜索:', keyword.value);
		// toast('“全局搜索”正在赶来的路上');
		toNav('/pages_E/globalsearch/index');
	};

	const dcPath = () => {
		sateLayerRef.value.open(appStore.MiniProgramConfig['wx19e20461b663b96c']);
		// // #ifdef APP-HARMONY
		// return toast('该功能正在快马加鞭赶来的路上')
		// // #endif
		// sateLayerRef.value.open({
		// 	address: '',
		// 	appId: 'wx19e20461b663b96c',
		// 	appSrcId: '',
		// 	enterprise: '的盟天下(延安)科技有限公司',
		// 	name: '网约车',
		// 	state: '01',
		// 	status: '01',
		// });
	};

	const pathNav = () => {
		toNav('/pages_D/busTicket/index');
		// toast('该功能正在快马加鞭赶来的路上');
	};
	const firterName = computed(()=>{
		let arr = subsectionData.value.filter(item => item.id == subsectionIndex.value)
		return arr[0].name
	})
	// 车生活分段数据
	const subsectionIndex = ref(1);
	const subsectionData = ref([
		// {name:'餐饮美食',id:0},
		{name:'景区门票',id:1},
		{name:'酒店住宿',id:2},
		// {name:'旅游路线',id:3},
	]);
	const handleTab = (item) => {
		subsectionIndex.value = item.id;
	};

	const address = ref({});
	const getUserAddress = () => {
		address.value = uni.getStorageSync('address');
		console.log('用户当前位置', address.value);
	};

	onMounted(() => {
		getUserAddress();
		// getlistOdsFzgRestaurantInfo();
		getgetodsJjbScenicSpot();
		hotelList();
		// getselectProductList();
	});
</script>

<style scoped lang="scss">
	.service_bg {
		width: 750rpx;
		height: 725rpx;
		background-image: var(--linear-color);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}

	.service-page {
		display: flex;
		flex-direction: column;
		align-items: center;

		// 导航栏左侧
		.navleft_box {
			display: flex;
			align-items: center;

			.navleft_box_img {
				width: 48rpx;
				height: 48rpx;
				margin-right: 12rpx;
			}

			.navleft_box_info {
				height: 48rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.navleft_box_info_text {
					font-weight: 400;
					font-size: 20rpx;
					color: #909599;
				}

				.navleft_box_info_text1 {
					font-weight: 400;
					font-size: 24rpx;
					color: #333333;
				}
			}
		}

		// 搜索框
		.search_bar {
			width: 702rpx;
			height: 78rpx;
			background: #ffffff;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 32rpx;
			overflow: hidden;

			.search_bar_img {
				width: 40rpx;
				height: 40rpx;
				margin-right: 24rpx;
			}

			.search_bar_btn {
				width: 97rpx;
				height: 58rpx;
				background-image: var(--but-color-line);
				border-radius: 16rpx;
				text-align: center;

				.search_bar_btn_text {
					font-weight: 400;
					font-size: 28rpx;
					color: #ffffff;
					text-align: center;
					line-height: 58rpx;
				}
			}
		}

		// 出行、交易服务
		.qingse_box,
		.fw_deal {
			width: 702rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 32rpx;

			.qingse_box_img {
				width: 220rpx;
				height: 132rpx;
			}

			.fw_deal_item {
				display: flex;
				flex-direction: column;
				align-items: center;

				.fw_deal_item_img {
					width: 100rpx;
					height: 100rpx;
					margin-bottom: 24rpx;
				}

				.fw_deal_item_text {
					font-weight: 400;
					font-size: 24rpx;
					color: #333333;
				}
			}
		}

		// 广告栏
		.ad_banner {
			width: 702rpx;
			height: 248rpx;
			margin-bottom: 32rpx;

			.ad_img {
				width: 702rpx;
				height: 248rpx;
			}
		}

		.card {
			width: 702rpx;
			/* 750 - 30*2 */
			border-radius: 32rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
			margin-bottom: 32rpx;
		}

		.card1_bg {
			background: var(--linear-color);
		}

		.card2_bg {
			background: var(--linear-color);
		}

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
				}

				.card_title_icon {
					width: 16rpx;
					height: 16rpx;
					margin-left: 8rpx;
					margin-top: 8rpx;
					z-index: 2;
				}
			}

			.card_icon_card_header_rt {
				width: 209rpx;
				height: 48rpx;
				margin-top: 10rpx;
			}
		}

		// 分段器
		.subsection_box {
			width: 654rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 24rpx;
		
			.subsection_box_item {
				// flex: 1;
				// height: 45rpx;
				// position: relative;
					flex: 1;
				    height: 50rpx;
				    position: relative;
					display: flex;
					flex-direction: column;
				    /* --- 新增：确保容器内部内容水平居中 --- */
				    align-items: center; 
				    justify-content: center;
					
		
				.subsection_box_item_text {
					font-weight: 400;
					font-size: 28rpx;
					color: #6e6e6e;
					text-align: center;
					line-height: 45rpx;
				}
		
				.active {
					font-weight: 500;
					font-size: 32rpx;
					color: #628f2f;
				}
		
				.subsection_box_item_line {
					width: 45rpx;
					height: 6rpx;
					background: #628f2f;
					border-radius: 2rpx;
				}
			}
		}
		// .subsection_box {
		// 	width: 654rpx;
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: space-between;
		// 	margin-bottom: 24rpx;

		// 	.subsection_box_item {
		// 		flex: 1;
		// 		position: relative;
		// 		text-align: center;

		// 		.subsection_box_item_text {
		// 			font-weight: 400;
		// 			font-size: 28rpx;
		// 			color: #6e6e6e;
		// 			text-align: center;
		// 			line-height: 45rpx;
		// 			padding-bottom: 8rpx;
		// 		}

		// 		.active {
		// 			font-weight: 500;
		// 			font-size: 32rpx;
		// 			color: #628f2f;
		// 			position: relative;
		// 		}

		// 		.active::after {
		// 			content: '';
		// 			width: 45rpx;
		// 			height: 4rpx;
		// 			background: #628f2f;
		// 			border-radius: 2rpx;
		// 			position: absolute;
		// 			bottom: 0;
		// 			left: 50%;
		// 			transform: translateX(-50%);
		// 			z-index: 2;
		// 		}
		// 	}
		// }

		// 卡片列表
		.card_list {
			width: 654rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.card_goods {
				width: 317rpx;
				height: 435rpx;
				background: var(--linear-color);
				box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
				border-radius: 32rpx;
				margin-bottom: 32rpx;

				.card_goods_img {
					width: 316rpx;
					height: 317rpx;
					border-top-left-radius: 32rpx;
					border-top-right-radius: 32rpx;
					overflow: hidden;
					position: relative;
					margin-bottom: 24rpx;

					.card_goods_img1 {
						width: 316rpx;
						height: 317rpx;
						border-top-left-radius: 32rpx;
						border-top-right-radius: 32rpx;
					}

					.card_goods_img_jl {
						position: absolute;
						bottom: 12rpx;
						left: 12rpx;
						font-weight: 400;
						font-size: 24rpx;
						color: #ffffff;
					}
				}

				.card_goods_title {
					display: block;
					width: 100%;
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					padding-left: 20rpx;
					padding-right: 20rpx;
					margin-bottom: 10rpx;
					box-sizing: border-box;
				}

				.card_goods_dec {
					display: flex;
					align-items: center;
					padding-left: 20rpx;
					padding-right: 12rpx;
					box-sizing: border-box;

					.card_goods_dec1 {
						flex: 1;
						font-weight: 400;
						font-size: 24rpx;
						color: #909599;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.card_goods_dec2 {
						font-weight: 400;
						font-size: 20rpx;
						color: #ff9b36;
						line-height: 40rpx;
					}

					.card_goods_dec3 {
						font-weight: 400;
						font-size: 32rpx;
						color: #ff9b36;
					}
				}
			}
		}

		.card_goods_more {
			font-weight: 400;
			font-size: 28rpx;
			color: var(--primary-color);
			margin-bottom: 32rpx;
		}
	}
</style>