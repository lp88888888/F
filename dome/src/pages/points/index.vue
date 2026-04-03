<template>
	<!-- 背景色 -->
	<view class="mall_bg" :style="{ background: themeStore.themeColors.$pageBgColor }"></view>
	<view class="mall_page">
		<!-- 导航栏 -->
		<up-navbar :bgColor="themeStore.themeColors.$color2" placeholder :fixed="true">
			<template #left>
				<view> </view>
			</template>
			<template #center>
				<text>积分商城</text>
			</template>
		</up-navbar>

		<!-- 搜索框 -->
		<view class="mall_seach" @click="handleSeach">
			<!-- <up-search
				v-model="searchValue"
				placeholder="搜索商品"
				:showAction="false"
				shape="square"
				bgColor="#fff"
				border-radius="20"
				@confirm="handleSeach"
				@clear="handleSeach"
			/> -->
			<up-icon name="search" color="#909599" style="margin-left: 24rpx"></up-icon>
			<text style="font-size: 28rpx; color: #909599; flex: 1">有什么想要的，搜一下</text>
			<view class="mall_seach_btn" :style="{ background: themeStore.themeColors.$bgLgColor }"
				@click="handleSeach">
				<text class="mall_seach_btn_text">搜索</text>
			</view>
		</view>

		<!-- 积分信息 -->
		<view class="jf_card">
			<image class="jf_card_bg" :src="themeInfoList.cardImg" mode=""></image>
			<image class="jf_info_dw" :src="themeInfoList.mascotIcon" mode="heightFix"></image>
			<view class="jf_info">
				<view class="jf_info_t">
					<view class="jf_info_t_l">
						<image class="jf_info_t_l_img" :src="`${imgUrl}static/my_vip_icon.png`" mode=""></image>
						<text class="jf_info_t_l_txt">{{ themeInfoList.name }}</text>
					</view>
					<view class="jf_info_t_r" :style="{ backgroundImage: vipcardColor[vipcardtype].namebg }">
						<text class="jf_info_t_r_txt"
							:style="{ color: vipcardColor[vipcardtype].namecolor }">{{ userInfo?.nickName || '账号登录' }}</text>
					</view>
				</view>
				<view class="num_box">
					<view class="num_box_item" @click="toNav('/pages_A/pointslist/index')">
						<text class="num_box_item_txt">可用积分</text>
						<text class="num_box_item_nums">{{ getAlljf }}</text>
					</view>
				</view>
				<view class="explain_box" :style="{ backgroundImage: vipcardColor[vipcardtype].btinfobg }">
					<text class="explain_box_txt" decode :style="{ color: vipcardColor[vipcardtype].namecolor }"
						@click="toNav('/pages_A/pointslist/index')">积分明细 &gt;</text>
					<text class="explain_box_txt1">|</text>
					<text class="explain_box_txt" decode :style="{ color: vipcardColor[vipcardtype].namecolor }"
						@click="toNav('/pages_C/member/PointsRules')">积分规则 &gt;</text>
				</view>
			</view>
		</view>

		<!-- 积分金刚区 -->
		<view class="jf_gird"
			:style="{ background: themeStore.themeColors.$linearColor, boxShadow: themeStore.themeColors.$mineCardBoxShadow }">
			<!-- toNav('/pages_B/directRetail/index') -->
			<view class="jf_gird_item" v-for="(item, index) in gridList" :key="index" @click="toLink(item)">
				<image :src="item.iconUrl" class="jf_gird_item_img" mode=""></image>
				<text class="jf_gird_item_txt">{{ item.entryName }}</text>
			</view>
			<!-- <view class="jf_gird_item" @click="totsd()">
				<image :src="imgUrl + 'static/jf_card_1.png'" class="jf_gird_item_img" mode=""></image>
				<text class="jf_gird_item_txt">直营零售</text>
			</view>
			<view class="jf_gird_item" @click="toNav('/pages_B/directRetail/newCollection')">
				<image :src="imgUrl + 'static/jf_card_2.png'" class="jf_gird_item_img" mode=""></image>
				<text class="jf_gird_item_txt">我的收藏</text>
			</view>
			<view class="jf_gird_item" @click="toNav('/pages_A/order/index')">
				<image :src="imgUrl + 'static/jf_card_3.png'" class="jf_gird_item_img" mode=""></image>
				<text class="jf_gird_item_txt">我的订单</text>
			</view>
			<view class="jf_gird_item" @click="totsd">
				<image :src="imgUrl + 'static/jf_card_4.png'" class="jf_gird_item_img" mode=""></image>
				<text class="jf_gird_item_txt">商务合作</text>
			</view> -->
		</view>

		<!-- 轮播图 -->
		<view class="banner_box">
			<up-swiper :list="bannerList" keyName="image" height="124" radius="16" showTitle :autoplay="false"
				circular />
		</view>

		<!-- 活动、秒杀 -->
		<view class="special_box" v-if="msGoodsGrouped.length!=0" >
			<view class="special_ms">
				<view class="card_icon_card_header">
					<view class="card_icon_card_header_lt">
						<image class="card_icon_card_header-img" :src="icoUrl + 'icon_bg.png'" mode="">
						</image>
						<text class="title_text_primary">有品秒杀</text>
						<image class="card_title_icon" :src="imgUrl + 'static/card_lt_icon.png'" mode=""></image>
					</view>
					<view class="card_icon_card_header_rt">
						<view class="card_icon_card_header_rt_txt1" style="display:flex;align-items: center;">
							<view>距离活动结束</view>
							<view style="margin-top: -5rpx;">
								<up-count-down  :time="timeshengyu"   autoStart millisecond @change="onChange"  format="HH:mm:ss">
									<view class="time">
									            <view class="time__custom">
									                <text class="time__custom__item">{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}</text>
									            </view>
									            <text class="time__doc">:</text>
									            <view class="time__custom">
									                <text class="time__custom__item">{{ timeData.minutes }}</text>
									            </view>
									            <text class="time__doc">:</text>
									            <view class="time__custom">
									                <text class="time__custom__item">{{ timeData.seconds }}</text>
									            </view>
									        </view>
								</up-count-down>
							</view>
						</view>
						<text class="card_icon_card_header_rt_txt" @click="tomiaosha">更多</text>
						<uni-icons type="right" size="12" color="#909599"></uni-icons>
					</view>
				</view>

				<view class="specialmain">
					<swiper class="goods_sw" :indicator-dots="true"  indicatorActiveColor="#628F2F"  :autoplay="false" :interval="3000" :duration="1000"
						style="width: 702rpx; height: 275rpx">
						<swiper-item class="goods_sw_1"  style="width: 702rpx; height: 275rpx; align-items: center"
							v-for="(item, index) in msGoodsGrouped" :key="index">
							<view class="goods_sw_1">
								<view class="goods_sw_1_nes" v-for="(item1, index1) in item" :key="index1"
									@click="toNav('/pages_A/points/details?id=' + item1.pointActivityId)">
									<image class="goods_sw_img" :src="item1.picUrl" mode=""></image>
									<text class="goods_sw_txt1">{{ item1.spuName }}</text>
									<view class="goods_sw_txt2">
										<view  style="display:flex;align-items: center;" >
											<text class="goods_sw_txt3">{{ item1.point }}</text>
											<image class="goods_sw_img1" :src="imgUrl + 'static/jf_icon_yellow.png'"
												mode=""> </image>
										</view>
										
										<text class="goods_sw_txt4">{{ item1.pointPrice }}</text>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>

		<!-- 资讯模块 -->
		<!-- <view class="news_sw" v-if="newsinfo && newsinfo.length">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000"
				style="width: 702rpx; height: 100rpx">
				<swiper-item class="news_sw_it" v-for="(item, index) in newsinfo" :key="index"
					@click="toNav(`/pages_A/points/newsdetail?id=${item.id}`)">
					<view class="news_title">
						<uni-icons type="sound-filled" color="#3D3D3D" size="24"></uni-icons>
						<text class="news_title_text">{{ item.title || '' }}</text>
					</view>
				</swiper-item>
			</swiper>
		</view> -->

		<!-- 商品列表 -->
		<view :class="categories.length ? 'goods_list' : 'goods_list1'"
			:style="{ background: themeStore.themeColors.$linear2Color, boxShadow: themeStore.themeColors.$mineCardBoxShadow }">
			<!-- tab切换 -->
			<!-- <scroll-view :scroll-x="true" :show-scrollbar="false" class="tab_box">
				<view class="tab_item" :class="{ activetabtxt: activeIndex == item.id }"
					v-for="(item, index) in categories" :key="index" @click="switchTab(item)">
					<image class="tab_item_bg" v-if="activeIndex == item.id" :src="icoUrl + 'jf_tab_bg.png'" mode="">
					</image>
					<view class="tab_item_info" :style="{ width: activeIndex == item.id ? '240rpx' : '134rpx' }">
						<text class="tab_item_info_txt"
							:style="{ color: activeIndex == item.id ? '#FFFFFF' : themeStore.themeColors.$primaryColor }">{{
							item.name
						}}</text>
						<image class="tab_item_info_img" v-if="activeIndex == item.id"
							:src="imgUrl + 'static/card_lt_icon.png'" mode=""></image>
					</view>
				</view>
			</scroll-view> -->
			<scroll-view :scroll-x="true" :show-scrollbar="false" class="tab_box">
				<view class="tab_item" :class="{ activetabtxt: activeIndex == item.id }"
					v-for="(item, index) in categories" :key="index" @click="switchTab(item)">
					<image class="tab_item_bg"  :style="{ height:imgFir(index).height }" v-if="activeIndex == item.id" :src="imgFir(index).img" mode="">
					</image>
					<view class="tab_item_info" :style="{ width: activeIndex == item.id ? '240rpx' : '134rpx' }">
						<text class="tab_item_info_txt"
							:style="{ color: activeIndex == item.id ? '#FFFFFF' : themeStore.themeColors.$primaryColor }">{{
							item.name
						}}</text>
						<image class="tab_item_info_img" v-if="activeIndex == item.id"
							:src="imgUrl + 'static/card_lt_icon.png'" mode=""></image>
					</view>
				</view>
			</scroll-view>


			<!-- 筛选模块 -->
			<view class="selmode">
				<view class="sel_box">
					<picker @change="bindPickerChange" :value="dictindex" :range="dictLabel">
						<view class="sel_box_qj">
							<text class="sel_box_qj_txt">积分区间</text>
							<view class="sel_box_qj_icons">
								<image class="sel_box_qj_icon" style="width: 20rpx; height: 22rpx" v-if="rangeStatus"
									:src="imgUrl + 'static/sj-top.png'" mode=""></image>
								<image class="sel_box_qj_icon" style="width: 20rpx; height: 22rpx" v-if="!rangeStatus"
									:src="imgUrl + 'static/sj-bottom.png'" mode=""></image>
							</view>
						</view>
					</picker>

					<view class="sel_box_jf" @click="changePointsNum">
						<text class="sel_box_jf_txt">积分值</text>
						<view class="sel_box_jf_icons">
							<uni-icons type="top" size="6" :color="pointSort == 0 ? '#909599' : '#333333'"
								style="height: 10rpx; line-height: 8rpx"></uni-icons>
							<uni-icons type="bottom" size="6" :color="pointSort == 1 ? '#909599' : '#333333'"
								style="height: 10rpx; line-height: 8rpx"></uni-icons>
						</view>
					</view>
					<view class="sel_box_dh" @click="changeSalesCount">
						<text class="sel_box_dh_txt">兑换量</text>
						<view class="sel_box_dh_icons">
							<uni-icons type="top" size="6" :color="salesCountSort == 0 ? '#909599' : '#333333'"
								style="height: 10rpx; line-height: 8rpx"></uni-icons>
							<uni-icons type="bottom" size="6" :color="salesCountSort == 1 ? '#909599' : '#333333'"
								style="height: 10rpx; line-height: 8rpx"></uni-icons>
						</view>
					</view>
					<view class="sle_no_box"></view>
					<!-- <view class="sel_box_ck" @click="checkboxChange" v-if="isshow">
						<view class="sel_box_ck_out">
							<view class="sel_box_ck_in" v-if="redeemable"> </view>
						</view>
						<text class="sel_box_ck_txt">仅看可兑</text>
					</view> -->
				</view>

				<!-- 积分区间 -->
				<view class="rangbox" v-if="rangeStatus">
					<up-slider :rangeValue="rangeValue" isRange="1" min="1" max="9999" showValue height="10px"
						@changing="changing"></up-slider>
				</view>
			</view>
			<view class="activity-tabs">
				<view v-for="(item, index) in activitylist" :key="index" class="tab-item"
					:class="{ active: activeIndextas === index }" @click="handleClick(index,item.id)">
					<image :src="activeIndextas === index ? item.icon1 : item.icon2" class="tab-icon" />
					<text class="tab-text">{{ item.text }}</text>
				</view>
			</view>
			<!-- 列表模块（核心修改：改为scroll-view实现上拉加载） -->
			<view class="goods_list1_wrap">
				<scroll-view scroll-y class="goods_list1" @scrolltolower="loadMore" lower-threshold="50">
					<view style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap">
						<view class="goods_item"
							:style="{ background: themeStore.themeColors.$linear2Color, boxShadow: themeStore.themeColors.$mineCardBoxShadow }"
							v-for="(item, index) in productList" :key="index"
							@click="toNav('/pages_A/points/details?id=' + item.id)">
							<image class="goods_item_img" :src="item.picUrl" mode=""></image>
							<text class="goods_item_txt">{{ item.spuName }}</text>
							<view class="goods_item_nums">
								<image v-if='item.returnActivityType==4' class="goods_item_img-1"
									:src="imgUrl + 'zhekou-3.png'" mode="">
								</image>
								<text class="goods_item_num" v-if="item.returnActivityType==3||item.returnActivityType==4" >{{ item.activityPoint }}</text>
								<text class="goods_item_num" v-if="item.returnActivityType!=3&&item.returnActivityType!=4" >{{ item.point }}</text>
								<image class="goods_item_icon" :src="imgUrl + 'static/jf_icon_yellow.png'" mode="">
								</image> 
								<text class="goods_sw_txt4" v-if='item.returnActivityType==3||item.returnActivityType==4' >{{ item.point }}</text>
								<image v-if='item.returnActivityType==1' class="goods_item_img-2"
									:src="imgUrl + 'fanquan-3.png'" mode="">
								</image>
								<text class="goods_item_txt1">已兑{{ item.salesCount || 0 }}+</text>
							</view>
							<image v-if='item.returnActivityType==3' class="goods_item_img-3"
								:src="imgUrl + 'miaosha-3.png'" mode=""></image>
						</view>
					</view>

					<!-- 空数据提示 -->
					<ser-empty v-if="!productList.length && !loading" text="暂无商品"></ser-empty>

					<!-- 加载状态提示 -->
					<view class="load-more" v-if="productList.length">
						<text v-if="loading">加载中...</text>
						<text v-else-if="noMore">没有更多数据了</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 购物车悬浮 -->
		<view class="kf-box" @click="toNavShopFun()">
			<image class="kf-img" :src="imgUrl + 'static/jf_buycar.png'"></image>
			<text class="kf-text">购物车</text>
		</view>
		<SateLayer ref="sateLayerRef"></SateLayer>
		<PageDurationTracker pageName="积分商城" />
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, watch, onMounted } from 'vue';
	import { onPullDownRefresh } from '@dcloudio/uni-app'; // 移除onReachBottom，改用scroll-view的scrolltolower
	import { imgUrl } from '../../config';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import SateLayer from '@/components/SateLayer/index.vue';
	import { toNav } from '@/utils/route';
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { listPoints, getCountCartPoints, getcategorylist, getSeckillGoodsLimitlist, pointsnews } from '@/api/points';
	import { getDict } from '@/api/config';
	import { getmemberpointsDetailStatistics } from '@/api/member';
	import { getMiniUserInfo } from '@/api/login';
	import { useAppStore } from '@/store/modules/app';
	import { CurrentPage, showAlert2, openAPPLocation } from '@/utils/util';
	import { gridMenu } from '@/api/home';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	import { toast } from '@/utils/common';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const isshow = ref(false);
	const returnActivityType = ref(null)
	// 当前激活的索引
	const timeData = ref({});  
	  
	// 定义 onChange 方法  
	const onChange = (e) => {  
	  timeData.value = e;  
	};  
	const activeIndextas = ref(null)
	const imgFir = computed(()=>{
		return (index)=>{
			let length = categories.value.length
			let obj = {}
			if(length < 4){
				if(index == 0) {
					obj.img = icoUrl.value + 'jf_tab_bg_left.png'
					obj.height = '80rpx'
				}
				else{
					obj.img = icoUrl.value + 'jf_tab_bg.png'
					obj.height = '48rpx'
				} 
			}else{
				if(index == 0){
					obj.img = icoUrl.value + 'jf_tab_bg_left.png'
					obj.height = '80rpx'
				} 
				else if(index == (length - 1)){
					obj.img = icoUrl.value + 'jf_tab_bg_right.png'
					obj.height = '80rpx'
				}
				else {
					obj.img = icoUrl.value + 'jf_tab_bg.png'
					obj.height = '48rpx'
				}
			}
			return obj
		}
	})
	// 点击处理函数
	const handleClick = (index, id) => {
		if(index==activeIndextas.value){
			activeIndextas.value = null
			returnActivityType.value = null
		}else{
			activeIndextas.value = index
			returnActivityType.value = id
		}
		
		init()
	}
	const activitylist = ref([
	{
		text: '折扣',
		icon2: imgUrl + 'zhekou-2.png',
		icon1: imgUrl + 'zhekou-1.png',
		id: 4
	},
		{
			text: '限时秒杀',
			icon2: imgUrl + 'miaosha-2.png',
			icon1: imgUrl + 'miaosha-1.png',
			id: 3
		},
		{
			text: '消费返券',
			icon2: imgUrl + 'fanquan-2.png',
			icon1: imgUrl + 'fanquan-1.png',
			id: 1
		},

	])
	const sateLayerRef = ref(null);
	// 监听themeStore.imgUrl的变化并更新icoUrl
	watch(
		() => themeStore.imgUrl,
		(newVal) => {
			icoUrl.value = newVal;
		}
	);
	const jkky = () => {
		const userId = uni.getStorageSync('userInfo')?.id;
		if (!userId) {
			isshow.value = false;
		} else {
			isshow.value = true;
		}
	};
	onShow(() => {
	})

	// 购物车跳转
	const toNavShopFun = () => {
		const userId = uni.getStorageSync('userInfo')?.id;
		if (!userId) {
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
		uni.navigateTo({
			url: '/pages_A/shoppingCart/index',
		});
	};
	const timeshengyu = ref(null)
	const msGoodsGrouped = ref([])
	const getmiaoshalist = () => {
		msGoodsGrouped.value=[]
		getSeckillGoodsLimitlist().then((res) => {
			console.log('秒杀列表', res);
			msGoods.value = res.data;
			const endTimeStr = res.data[0].endTime; // 从接口 res.data.endTime 获取

			const [datePart, timePart] = endTimeStr.split(' ');
			const [y, m, d] = datePart.split('-').map(Number);
			const [h, min, s] = timePart.split(':').map(Number);
			timeshengyu.value = Math.max(0, new Date(y, m - 1, d, h, min, s).getTime() - Date.now());
			msGoodsGrouped.value = chunkArray(res.data, 3); // 每3个一组
		});
	};
	const chunkArray = (arr : any[], chunkSize : number) => {
		const result = [];
		for (let i = 0; i < arr.length; i += chunkSize) {
			result.push(arr.slice(i, i + chunkSize));
		}
		return result;
	};

	// 功能开发中提示
	const totsd = (url) => {
		return toast('该功能正在快马加鞭赶来的路上');
		// toNav(url)
	};
	const toLink = (item) => {
		// if (jumpPage == '/') return toast('该功能正在快马加鞭赶来的路上');
		// toNav(jumpPage);
		if (item.jumpType == 0) {
			toNav(item.jumpPage);
		} else if (item.jumpType == 1) {
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(item.jumpPage),
			});
		} else if (item.jumpType == 2) {
			navLink(item.jumpPage)
		}
	};
	const navLink = (appid : string) => {
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
		if (appid == 'https://yjglfp.sx12122.cn/') {
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
			});
		} else if (appid == 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/MainTest.html?wxH5=1') {
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
			});
		} else {
			sateLayerRef.value.open(appStore.MiniProgramConfig[appid]);
		}
	};
	// 用户信息
	const userInfo = computed(() => {
		return uni.getStorageSync('userInfo');
	});

	const appStore = useAppStore();
	const isLogin = computed(() => {
		return appStore.checkLogin();
	});

	// 资讯
	const newsinfo = ref([]);
	const get_news = async () => {
		try {
			const res = await pointsnews({ recommendBanner: true });
			console.log('查询的商品资讯', res);
			newsinfo.value = res.rows;
		} catch (err) {
			console.log('资讯失败', err);
		}
	};

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
	const vipcardtype = computed(() => {
		return uni.getStorageSync('vipCardType') || 0;
	});
	const tomiaosha = () => {
		toNav('/pages_A/points/seckill');
	};

	// 会员卡主题颜色
	const vipcardColor = computed(() => {
		let arr = vipcardOldColor.value.filter((item) => !item.type);
		let newArr = vipcardOldColor.value.filter((item) => item.type == pageTheme.value);
		return [...newArr, ...arr];
	});
	const vipcardOldColor = ref([
		{
			title: '金丝猴.金绒灵捷卡',
			namebg: 'linear-gradient(to left, #D4E2FF , #F0F5FF)',
			namecolor: '#4881F5',
			btinfobg: 'linear-gradient(to bottom, #F0F5FF , #D4E2FF)',
			type: 'blue',
		},
		{
			title: '金丝猴.金绒灵捷卡',
			namebg: 'linear-gradient(to left, #D7EEBB , #EDF8DF)',
			namecolor: '#628F2F',
			btinfobg: 'linear-gradient(to bottom, #FCFFFC , #C7E7A4)',
			type: 'green',
		},
		{
			title: '朱鹮.红羽暖心卡',
			namebg: 'linear-gradient(to left, #FE997D , #FCFFFC)',
			namecolor: '#E65328',
			btinfobg: 'linear-gradient(to bottom, #FCFFFC , #FE997D)',
		},
		{
			title: '羚羊.青角稳行卡',
			namebg: 'linear-gradient(to left, #E9A677 , #FCFFFC)',
			namecolor: '#9B5029',
			btinfobg: 'linear-gradient(to bottom, #FCFFFC , #E9A677)',
		},
		{
			title: '熊猫.胖达悠享卡',
			namebg: 'linear-gradient(to left, #FCFFFC , #B9BDBD)',
			namecolor: '#0B1B18',
			btinfobg: 'linear-gradient(to bottom, #FCFFFC , #B9BDBD)',
		},
	]);

	// 秒杀商品模拟数据
	const msGoods = ref([]);

	// 搜索相关
	const searchValue = ref('');
	const handleSeach = () => {
		// init();
		toNav('/pages_E/globalsearch/shopsearch');
	};

	// 积分区间筛选
	const rangeStatus = ref(false);
	const pointRangeStart = ref(undefined);
	const pointRangeEnd = ref(undefined);
	const rangeValue = ref([100, 1000]);
	const handleInterval = () => {
		rangeStatus.value = !rangeStatus.value;
	};
	const changing = (e) => {
		pointRangeStart.value = e[0];
		pointRangeEnd.value = e[1];
		init();
	};

	// 积分值排序 0：倒序 1：正序
	const pointSort = ref(0);
	const changePointsNum = () => {
		salesCountSort.value = '';
		pointSort.value = pointSort.value === 0 ? 1 : 0;
		init();
	};

	// 兑换量排序 0：倒序 1：正序
	const salesCountSort = ref(0);
	const changeSalesCount = () => {
		pointSort.value = '';
		salesCountSort.value = salesCountSort.value === 0 ? 1 : 0;
		init();
	};

	// 仅看可兑换
	const redeemable = ref(false);
	const checkboxChange = () => {
		redeemable.value = !redeemable.value;
		init();
	};

	// 轮播图数据
	const bannerList = [
		{
			image: imgUrl + 'static/my-3.png',
		},
		{
			image: imgUrl + 'static/jifen-ban2.png',
		},
	];

	// 分类tab切换
	const activeIndex = ref('000');
	const switchTab = (item) => {
		activeIndex.value = item.id;
		init();
	};

	// 获取分类列表
	const categories = ref([]);
	const getDictData = async () => {
		const res = await getcategorylist();
		if (res.code == 200 && res.data.length) {
			categories.value = [
				{
					name: '全部',
					id: '000',
				},
				...res.data,
			];
		}
	};

	// 加载状态控制（核心新增）
	const loading = ref(false); // 是否正在加载
	const noMore = ref(false); // 是否无更多数据

	// 商品列表分页
	const total = ref<number>(0);
	const listQuery = ref({
		pageNum: 1,
		pageSize: 30,
		shopType: 1,
	});
	const productList = ref([]);

	// 获取商品列表（重构：增加加载状态）
	const getData = async () => {
		if (loading.value) return; // 防止重复请求
		loading.value = true;

		try {
			const params = {
				...listQuery.value,
				categoryId: activeIndex.value === '000' ? undefined : activeIndex.value,
				buyStatus: redeemable.value ? 1 : 0,
				spuName: searchValue.value || undefined,
				pointSort: pointSort.value,
				salesCountSort: salesCountSort.value,
				pointRangeStart: pointRangeStart.value,
				pointRangeEnd: pointRangeEnd.value,
				returnActivityType: returnActivityType.value
			};
			const res = await listPoints(params);
			if (res.code == 200) {
				let { list, total: totalCount } = res.data;
				productList.value = listQuery.value.pageNum == 1 ? list : [...productList.value, ...list];
				total.value = Number(totalCount);
				// 判断是否无更多数据
				noMore.value = productList.value.length >= total.value;
			}
		} catch (error) {
			console.error('获取商品列表失败', error);
			toast('加载失败，请稍后重试');
		} finally {
			loading.value = false;
		}
	};

	// 上拉加载更多（核心新增）
	const loadMore = () => {
		if (loading.value || noMore.value) return;
		listQuery.value.pageNum++;
		getData();
	};

	// 初始化商品列表
	const init = () => {
		listQuery.value.pageNum = 1;
		productList.value = [];
		noMore.value = false; // 重置无更多状态
		getData();
	};
	const poinshoucomm = ref(0)
	// 积分
	const getAlljf = computed(() => {
		if (!isLogin.value) return 0;
		const info = appStore.userInfo || uni.getStorageSync('userInfo');
		if (!info.pointsAccount) return 0;
		return info.pointsAccount.commonPoint || 0;
	});

	// 查询积分区间字典
	const dictindex = ref(0);
	const dictData = ref([]);
	const bindPickerChange = (e) => {
		dictindex.value = e.detail.value;
		let item = dictData.value[dictindex.value];
		if (dictindex.value == 0) {
			pointRangeStart.value = undefined;
			pointRangeEnd.value = undefined;
		} else {
			let arr = item.dictValue.split('-');
			pointRangeStart.value = arr[0];
			pointRangeEnd.value = arr[1];
		}
		init();
	};
	const dictLabel = computed(() => {
		return dictData.value.map((e) => e.dictLabel);
	});
	const getPointsDict = async () => {
		let res = await getDict('point_interval');
		dictData.value = res.data;
	};
	const gridList = ref([]);
	// 根据业务类型查询金刚列表
	const businessTypeFun = async (val) => {
		const now = new Date();
		const params = {
			startTime: formatToMinuteWithSec00(now),
			endTime: formatToMinuteWithSec00(now),
			secondaryIconPath: val,
		};
		const res : any = await gridMenu('7', params);
		console.log('积分商城金刚区', res);
		if (res?.code == 200) {
			const truedata = res.rows.filter(item => item.enabled == 1)
			// #ifdef APP-HARMONY
			const harmonydata = truedata.filter(item => item.showDeviceTypes.includes('2'))
			gridList.value = harmonydata
			// #endif
			// #ifndef APP-HARMONY
			gridList.value = truedata
			// #endif
		}
	};
	const pad2 = (n : number) => String(n).padStart(2, '0');
	const formatToMinuteWithSec00 = (d : Date) => {
		const y = d.getFullYear();
		const m = pad2(d.getMonth() + 1);
		const day = pad2(d.getDate());
		const hh = pad2(d.getHours());
		const mm = pad2(d.getMinutes());
		return `${y}-${m}-${day} ${hh}:${mm}:00`;
	};
	// 下拉刷新（页面级）
	onPullDownRefresh(async () => {
		try {
			listQuery.value.pageNum = 1;
			productList.value = [];
			noMore.value = false;
			await getData();
		} catch (error) {
			toast('刷新失败，请稍后重试');
		} finally {
			uni.stopPullDownRefresh();
		}
	});

	// 页面挂载
	onMounted(() => {
		businessTypeFun(pageTheme.value);
		jkky();
		getDictData();
		init();
		getPointsDict();
		getmiaoshalist();
		get_news();
	});
</script>

<style scoped lang="scss">
	
	:deep(.custom-countdown .u-count-down__text) {
	  color: #e74c3c !important;
	  font-weight: bold;
	}
	.activity-tabs {
		width: 100%;
		display: flex;
		border-radius: 16rpx;
		overflow: hidden;
		padding: 8rpx;
		margin-bottom: 32rpx;
	}

	.tab-item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16rpx;
		border-radius: 12rpx;
		transition: all 0.3s ease;
		background-color: #ffffff;
		margin-right: 32rpx;
		color: #7B7E7C;
	}

	.tab-item.active {
		color: #fff;
		background: var(--but-color-line);
	}

	.tab-icon {
		width: 23rpx;
		height: 23rpx;
		margin-right: 16rpx;
	}

	.tab-text {
		font-weight: 400;
		font-size: 26rpx;
	}

	.mall_bg {
		width: 750rpx;
		height: 725rpx;
		background-image: linear-gradient(to top, #fcfffc, #ecfcef);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}

	.mall_page {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 20rpx;
		box-sizing: border-box;

		// 搜索框
		.mall_seach {
			width: 702rpx;
			height: 78rpx;
			background: #ffffff;
			border-radius: 16rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 12rpx;
			margin-bottom: 24rpx;
			box-sizing: border-box;

			.mall_seach_btn {
				width: 97rpx;
				height: 58rpx;
				background: linear-gradient(to right, #b2d38a, #80a653);
				border-radius: 16rpx;
				text-align: center;

				.mall_seach_btn_text {
					font-weight: 400;
					font-size: 28rpx;
					color: #ffffff;
					text-align: center;
					line-height: 58rpx;
				}
			}
		}

		// 积分信息卡片
		.jf_card {
			width: 702rpx;
			height: 301rpx;
			margin-bottom: 32rpx;
			position: relative;

			.jf_card_bg {
				width: 702rpx;
				height: 301rpx;
				border-top-left-radius: 36rpx;
				border-top-right-radius: 36rpx;
			}

			.jf_info_dw {
				width: 101rpx;
				height: 157rpx;
				position: absolute;
				right: 60rpx;
				bottom: 62rpx;
			}

			.jf_info {
				width: 702rpx;
				height: 301rpx;
				position: absolute;
				top: 0;
				left: 0;
				padding-top: 32rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				box-sizing: border-box;

				.jf_info_t {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-left: 32rpx;
					box-sizing: border-box;

					.jf_info_t_l {
						display: flex;
						align-items: center;

						.jf_info_t_l_img {
							width: 24rpx;
							height: 21rpx;
							margin-right: 7rpx;
						}

						.jf_info_t_l_txt {
							font-weight: bold;
							font-size: 32rpx;
							color: #ffffff;
						}
					}

					.jf_info_t_r {
						height: 43rpx;
						background: linear-gradient(to left, #d7eebb, #edf8df);
						border-top-left-radius: 100rpx;
						border-bottom-left-radius: 100rpx;
						padding-left: 24rpx;
						padding-right: 18rpx;
						box-sizing: border-box;

						.jf_info_t_r_txt {
							font-weight: 400;
							font-size: 24rpx;
							color: #628f2f;
							line-height: 43rpx;
						}
					}
				}

				.num_box {
					display: flex;
					align-items: center;
					justify-content: space-around;

					.num_box_item {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: center;

						.num_box_item_txt {
							font-weight: 400;
							font-size: 32rpx;
							color: #ffffff;
							margin-right: 32rpx;
						}

						.num_box_item_nums {
							font-weight: 600;
							font-size: 40rpx;
							color: #ffffff;
						}
					}
				}

				.explain_box {
					width: 702rpx;
					height: 62rpx;
					background: linear-gradient(to bottom, rgba(224, 255, 190, 0.34), #f0ffe1);
					display: flex;
					align-items: center;
					justify-content: space-between;

					.explain_box_txt {
						flex: 1;
						font-weight: 400;
						font-size: 24rpx;
						color: #628f2f;
						text-align: center;
						line-height: 62rpx;
					}

					.explain_box_txt1 {
						height: 36rpx;
						color: #628f2f;
						opacity: 0.2;
					}
				}
			}
		}

		// 积分金刚区
		.jf_gird {
			width: 702rpx;
			height: 170rpx;
			background: linear-gradient(to bottom right, #fefefe, #ebf8ee);
			box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
			border-radius: 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin-bottom: 32rpx;

			.jf_gird_item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.jf_gird_item_img {
					width: 58rpx;
					height: 58rpx;
					margin-bottom: 20rpx;
				}

				.jf_gird_item_txt {
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
				}
			}
		}

		// 轮播图
		.banner_box {
			width: 702rpx;
			margin-bottom: 32rpx;
			z-index: 99
		}

		// 活动、秒杀
		.special_box {
			width: 702rpx;
			height: 349rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 32rpx;

			.special_hd,
			.special_ms {
				flex: 1;
				height: 349rpx;
				background: linear-gradient(to bottom, #fefefe, #ebf8ee);
				border-top-left-radius: 32rpx;
				border-top-right-radius: 32rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				.special_head {
					width: 702rpx;
					height: 74rpx;
					background: linear-gradient(to right, #80a653, #b2d38a);
					border-top-left-radius: 32rpx;
					border-top-right-radius: 32rpx;
					justify-content: space-between;

					.special_head_info {
						height: 50rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-left: 23rpx;
						padding-right: 23rpx;
						box-sizing: border-box;

						.special_head_info_txt {
							font-size: 32rpx;
							color: #ffffff;
							line-height: 50rpx;
						}

						.special_head_info_img {
							width: 16rpx;
							height: 16rpx;
							margin-left: 8rpx;
							margin-top: -10rpx;
						}

						.special_head_info_txt1 {
							flex: 1;
							font-weight: 400;
							font-size: 24rpx;
							color: #ffffff;
							text-align: right;
							line-height: 50rpx;
						}
					}

					.special_head_w {
						height: 24rpx;
						background-color: #fcfdfd;
						border-top-left-radius: 32rpx;
						border-top-right-radius: 32rpx;
					}
				}

				.specialmain {
					height: 275rpx;
					width: 702rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
			}

			.special_hd {
				border-bottom-left-radius: 32rpx;
			}

			.special_ms {
				border-bottom-right-radius: 32rpx;
			}

			.goods_item {
				width: 351rpx;
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-bottom: 25rpx;

				.goods_item_img {
					width: 164rpx;
					height: 164rpx;
					margin-bottom: 12rpx;
				}

				.goods_item_tag {
					width: 95rpx;
					height: 45rpx;
					position: absolute;
					top: 12rpx;
					left: 228rpx;
				}

				.goods_item_txt {
					font-weight: 400;
					font-size: 24rpx;
					color: #333333;
				}

				.goods_item_txt1 {
					font-weight: 400;
					font-size: 28rpx;
					color: #ff9b36;
				}
				
			}

			.goods_sw {
				width: 702rpx;
				height: 275rpx;

				.goods_sw_1 {
					width: 702rpx;
					height: 275rpx;
					display: flex;
					gap: 30rpx;

					.goods_sw_1_nes {
						width: 200rpx;
						height: 275rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
					}

					.goods_sw_img {
						width: 150rpx;
						height: 150rpx;
						margin-bottom: 12rpx;
					}

					.goods_sw_txt1 {
						width: 100%;
						font-weight: 400;
						font-size: 24rpx;
						color: #333333;
						margin-bottom: 8rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.goods_sw_txt2 {
						width: 200rpx;
						display: flex;
						align-items: center;
						justify-content: space-around;

						.goods_sw_txt3 {
							font-weight: 400;
							font-size: 28rpx;
							color: #ff9b36;
						}

						.goods_sw_img1 {
							width: 28rpx;
							height: 28rpx;
						}

						.goods_sw_txt4 {
							font-weight: 400;
							font-size: 24rpx;
							color: #909599;
							text-decoration: line-through;
							text-align: right;
						}
					}
				}
			}
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
					z-index: 0;
				}

				.title_text_primary {
					font-family: DingTalk, DingTalk;
					font-weight: normal;
					font-size: 32rpx;
					color: #ffffff;
					line-height: 30rpx;
					z-index: 2;
				}

				.card_title_icon {
					width: 16rpx;
					height: 16rpx;
					margin-left: 8rpx;
					z-index: 2;
				}
			}

			.card_icon_card_header_rt {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				.card_icon_card_header_rt_txt1 {
					font-weight: 400;
					font-size: 24rpx;
					color: #ef4519;
					margin-right: 32rpx;
					
					
				}

				.card_icon_card_header_rt_txt {
					font-weight: 400;
					font-size: 24rpx;
					color: #909599;
					margin-right: 10rpx;
				}
			}
		}

		.time {
		    @include flex;
		    align-items: center;
		
		    &__custom {
		         margin-top: 4px;
		         width: 22px;
		         height: 22px;
		         border-radius: 4px;
		         /* #ifndef APP-NVUE */
		         display: flex;
		         /* #endif */
		         justify-content: center;
		         align-items: center;
		    
		        &__item {
		             color:  #ef4519;
		             font-size: 12px;
		             text-align: center;
		         }
		    }
		    
		    &__doc {
		         color:  #ef4519;
		         padding: 0px 4px;
		     }
		    
		    &__item {
		         color: #ef4519;
		         font-size: 15px;
		         margin-right: 4px;
		     }
		}

		.goods_list1 {
			width: 702rpx;
			background: var(--head-color);
			box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
			border-radius: 32rpx;
			// padding-left: 24rpx;
			// padding-right: 24rpx;
			box-sizing: border-box;
		}

		// tab切换
		.tab_box {
			width: 702rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: nowrap;
			white-space: nowrap;

			.tab_item {
				width: 134rpx;
				height: 80rpx;
				position: relative;
				display: inline-block;

				.tab_item_bg {
					width: 240rpx;
					height: 48rpx;
					position: absolute;
					top: 0;
				}

				.tab_item_info {
					width: 134rpx;
					height: 48rpx;
					position: absolute;
					top: 0;
					left: 0;
					display: flex;
					justify-content: center;
					justify-content: center;

					.tab_item_info_txt {
						font-weight: normal;
						font-size: 28rpx;
						color: #628f2f;
						line-height: 48rpx;
					}

					.tab_item_info_img {
						width: 14rpx;
						height: 14rpx;
						margin-left: 8rpx;
						margin-top: 8rpx;
					}
				}
			}

			.activetabtxt {
				width: 240rpx;

				.tab_item_info {
					width: 210rpx;

					.tab_item_info_txt {
						font-size: 32rpx;
						color: #ffffff;
					}
				}
			}
		}

		// 资讯
		.news_sw {
			width: 702rpx;
			background-color: #f8f9fa;
			border-radius: 16rpx;
			margin-bottom: 30rpx;

			.news_sw_it {
				width: 702rpx;
				height: 100rpx;
				padding: 0 30rpx;
				box-sizing: border-box;

				.news_title {
					width: 100%;
					height: 90rpx;
					display: flex;
					align-items: center;

					>text:nth-child(2) {
						flex: 1 0;
						width: 0;
						font-size: 32rpx;
						font-weight: 500;
						color: #333333;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						margin-left: 26rpx;
					}
				}
			}
		}

		// 商品列表
		.goods_list {
			width: 702rpx;
			height: 1100rpx;
			background: linear-gradient(to bottom right, #fefefe, #ebf8ee);
			box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
			border-radius: 32rpx;
			padding-left: 24rpx;
			padding-right: 24rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;

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

			// 商品列表容器（核心新增样式）
			.goods_list1_wrap {
				// 关键：设置固定高度，可根据页面调整（如calc(100vh - 600rpx)）
				height: 1000rpx;
				overflow: hidden;
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
				width: 318rpx;
				height: 247rpx;
				background: linear-gradient(to bottom right, #fefefe, #ebf8ee);
				box-shadow: 0rpx 2rpx 4rpx 0rpx #d3e7d1;
				border-radius: 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-bottom: 24rpx;
				position: relative;

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



				.goods_item_nums {
					width: 280rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					.goods_item_num {
						font-weight: 400;
						font-size: 28rpx;
						color: #ff9b36;
					}
.goods_sw_txt4 {
							font-weight: 400;
							font-size: 24rpx;
							color: #909599;
							text-decoration: line-through;
							text-align: right;
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
			}
		}

		// 购物车悬浮按钮
		.kf-box {
			position: fixed;
			top: 960rpx;
			right: 10rpx;
			z-index: 9;
			display: flex;
			flex-direction: column;
			align-items: center;
			z-index: 99999;

			.kf-img {
				width: 100rpx;
				height: 100rpx;
				z-index: 99999;
			}

			.kf-text {
				font-weight: 400;
				font-size: 20rpx;
				color: #ff9b36;
			}
		}
	}
</style>