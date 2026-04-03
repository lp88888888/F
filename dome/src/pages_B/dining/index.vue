<template>
	<view class="food-page" :data-theme="pageTheme">
		<up-sticky z-index="8888">
			<view id="navId" :style="{ background: 'linear-gradient( 180deg, #D1E5F9 0%, #F8F9FB 96%)' }">
				<up-navbar title="餐饮美食" bgColor="transparent" leftIconColor="#000000"
					:titleStyle="{ fontWeight: 'bold', color: '#000000' }" @leftClick="toBack" placeholder
					:fixed="false"></up-navbar>
				<view class="search-row">
					<up-search v-model="keyword" :showAction="false" placeholder="请输入商品名,商家名查找" :disabled="true"
						height="36" shape="round" bgColor="#FFFFFF"
						@click="toNav(`/pages_B/dining/search?gitu=${listQuery.gitu}&titu=${listQuery.titu}`)" />
				</view>
				<view class="tab-card">
					<scroll-view class="scroll-wrapper" scroll-x="true">
						<view class="cat-items">
							<view v-for="(c, i) in categories" :key="i" class="cat-item" @click="onPickCat(c.type)">
								<image class="cat-icon" :src="imgUrl+c.icon" mode="aspectFit" />
								<text
									:class="['cat-text', currentCat == currentCat.value ? 'activeTextBox' : '']">{{ c.name }}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="filters">
					<view class="chip" @click="selectPopClick('sortField')">
						<text>{{ columns2name }}</text>
						<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
					</view>
					<view class="chip" @click="selectPopClick('status')">
						<text>筛选</text>
						<up-icon :name="imgUrl+'static/D-inf-sift-icon.png'" size="13" color="#333333"></up-icon>
					</view>
					<!-- <view class="chip" @click="selectClick('status')">
						<text>{{ listQuery.openState == '01' ? '营业中' : listQuery.openState == '00' ? '休息中' : '全部' }}</text>
						<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
					</view> -->
					<!-- <view class="reset" @click="reset()">重置</view> -->
				</view>
				<!-- <view class="filters">
					<view class="chip" @click="selectClick('sortField')">
						<text>{{ columns2name }}</text>
						<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
					</view>
					<view class="chip" @click="selectClick('status')">
						<text>{{ listQuery.openState == '01' ? '营业中' : listQuery.openState == '00' ? '休息中' : '全部' }}</text>
						<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
					</view>
					<view class="reset" @click="reset()">重置</view>
				</view> -->
			</view>
		</up-sticky>
		<up-popup :show="selectShow" @close="close" mode="top" round="10" z-index="99">
			<view class="selectPop">
				<view :style="{height:300+'px'}"></view>
				<view v-if="selectType == 'sortField'">
					<view class="teItem fl-ce-sb" v-for="(item,index) in opticon1" :key="index" @click="pxClic(item)">
						<text class="textBox"
							:class="[newValue == item.value?'activeTextBox':'']">{{item.name}}</text>
						<u-icon
							:name="`${imgUrl}${newValue == item.value?'login_checked1':'login_unchecked'}.png`"
							size="16" />
					</view>
				</view>
				<view v-if="selectType == 'status'">
					<view class="popView-title">距离</view>
					<view class="popView-cenGrid">
						<view :class="['popView-cenGrid-item',screenObj.goodsType == item.dictValue?'gridActive':'']"
							v-for="(item,index) in opticon2" :key="index" @click="selectItemClick(item,1)">
							{{item.dictLabel}}</view>
					</view>
					<view class="popView-title">人均价格区间</view>
					<view class="popView-cenGrid">
						<view :class="['popView-cenGrid-item',screenObj.priceValue == item.dictValue?'gridActive':'']"
							v-for="(item,index) in opticon3" :key="index" @click="selectItemClick(item,2)">
							{{item.dictLabel}}</view>
					</view>
					<view class="popView-title">评价等级</view>
					<view class="popView-cenGrid">
						<view :class="['popView-cenGrid-item',screenObj.seValue == item.dictValue?'gridActive':'']"
							v-for="(item,index) in opticon4" :key="index" @click="selectItemClick(item,3)">
							{{item.dictLabel}}</view>
					</view>
					<u-gap height="24" />
					<view class="fiexView">
						<view class="fiexView-item" @click="reset">重置</view>
						<view class="fiexView-item iconBut" @click="seleSubmit">确认</view>
					</view>
				</view>
			</view>
		</up-popup>
		<view class="content-box">
			<u-gap height="15" />
			<!-- 店铺卡片列表 -->
			<scroll-view class="list" scroll-y :refresher-enabled="true" @refresherrefresh="onRefresh"
				:refresher-triggered="isRefreshing" refresher-background="#f5f5f5" @scrolltolower="onLoadMore"
				:scroll-with-animation="false" :show-scrollbar="false">
				<ser-empty v-if="!dataList.length"></ser-empty>
				<view v-for="shop in dataList" :key="shop.id" :border="false" :headBorderBottom="false"
					:footBorderTop="true" :padding="0" @click="toDetail(shop)"
					bodyStyle="padding: 16rpx 20rpx 20rpx 20rpx;" class="shop-card">
					<view class="shop-row">
						<u--image :src="shop.shopImage" width="170rpx" height="170rpx" radius="13" />
						<view class="shop-main">
							<view class="fl-al-ce">
								<text class="statusText">{{ shop.openState == '01' ? '营业中' : '休息中' }}</text>
								<text class="name">{{ shop.shopName }}</text>
							</view>
							<view class="fl-al-ce">
								<u-icon :name="imgUrl+'time.png'" size="13" />
								<text class="time">
									营业时间：
									<text class="times">{{ shop.eatInOpenTime }}</text>
								</text>
							</view>
							<view class="name-row">
								<view class="metas-row">
									<!-- <text class="meta-addr">{{shop.listGroupName}}</text> -->
								</view>
								<view class="phone" @click.stop="call(shop.phone)">
									<u-icon :name="imgUrl+'static/eat-ipone-ionc.png'" size="22" />
								</view>
							</view>
						</view>
					</view>
					<view class="addr-row" @click.stop="navigation(shop)">
						<u-icon name="map" size="16" color="#000000" />
						<text class="addr">{{ shop.address }}</text>
						<view class="flex-spacer" />
						<text class="dist">距您{{ shop.straightLineDistance }}</text>
						<u-icon name="arrow-right" size="12" color="#333333" />
					</view>
				</view>
				<u-gap height="30" />
				<!-- 上拉加载提示 -->
				<view v-if="isLoading" class="loading-tip"
					style="text-align: center; padding: 20rpx 0; font-size: 24rpx; color: #999;">
					加载中...
				</view>
				<view v-if="!isLoading && dataList.length > 0 && listQuery.pageNum * listQuery.pageSize >= total"
					class="loading-tip" style="text-align: center; padding: 20rpx 0; font-size: 24rpx; color: #999;">
					没有更多数据了
				</view>
			</scroll-view>
		</view>
		<u-picker :show="pickerShow" :columns="columns" keyName="name"
			:confirmColor="themeStore.themeColors.$primaryColor" @close="prickClose" @cancel="prickClose"
			@confirm="prickConfirm"></u-picker>
		<u-gap height="24" />
		<u-picker :show="pickerShow2" :columns="columns2" keyName="name"
			:confirmColor="themeStore.themeColors.$primaryColor" @close="prickClose2" @cancel="prickClose2"
			@confirm="prickConfirm2"></u-picker>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import QQMapWX from "@/common/qqmap-wx-jssdk.js"
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import theme from '@/utils/theme';
	import { onLoad, onReady, onReachBottom } from '@dcloudio/uni-app';
	import { listOdsFzgRestaurantInfo } from '@/api/premium';
	import { toast } from '@/utils/common';
	import { openLocation, makePhoneCall, openAPPLocation } from '@/utils/util';
	import GoodsListItemVue from './GoodsListItem.vue';

	import { useElementRects } from '@/utils/useElementRect';


	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const { queryAll } = useElementRects(['#navId']);
	const navHeight = ref(200);
    const newValue= ref('');
	const selectShow = ref(false);
	const selectType = ref('');
	const selectIndex = ref(0);
	const screenObj = ref({
		goodsType: '',
		priceValue: '',
		seValue: '',
	})
	const opticon1 = ref([
		{ name: '距离优先', value: 1 },
		{ name: '好评优先', value: 2 },
		{ name: '销量优先', value: 3 },
		{ name: '低价优先', value: 4 },
		{ name: '高价优先', value: 5 },
	]);
	const opticon2 = ref([
		{ dictLabel: '附近1km', dictValue: 1 }, { dictLabel: '附近附近5km', dictValue: 5 }, { dictLabel: '附近10km', dictValue: 10 },
	]);
	const opticon3 = ref([
		{ dictLabel: '0-50', dictValue: 12, min: '0', max: '50' }, { dictLabel: '50-200', dictValue: 13, min: '50', max: '200' }, { dictLabel: '200以上', dictValue: 14, min: '', max: '200' },
	])
	const opticon4 = ref([
		{ dictLabel: '3星以下', dictValue: 3 }, { dictLabel: '4星以上', dictValue: 4 }, { dictLabel: '5星', dictValue: 5 },
	])
	const currentCat = ref('全部')
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	const categories = [
		{ name: '特色美食', icon: 'static/eat-icon-1.png',type:'SPECIALTY_FOOD'},
		{ name: '连锁快餐', icon: 'static/eat-icon-2.png',tyep:'FAST_FOOD' },
		{ name: '现做热食', icon: 'static/eat-icon-3.png' ,type:'HOT_MEALS'},
		{ name: '休闲小吃', icon: 'static/eat-icon-4.png',type:'SNACKS' },
	]
	// 搜索关键词
	const keyword = ref('')
	// 下拉刷新状态（控制刷新动画）
	const isRefreshing = ref(false);
	// 上拉加载状态（防抖+加载提示）
	const isLoading = ref(false);

	const listQuery = ref({
		pageNum: 1,
		pageSize: 10,
		openState: undefined,
		scope: undefined,
		gitu: '', // 纬度
		titu: '', // 经度
	});

	// 状态选择器配置（修复原代码中00后的制表符问题）
	const pickerShow = ref(false);
	const columns = [
		[{ name: '全部', value: undefined }, { name: '休息中', value: '00' }, { name: '营业中', value: '01' }],
	]

	// 距离选择器配置
	const columns2 = [
		[{ name: '距离', value: undefined }, { name: '10km', value: '10' }, { name: '20km', value: '20' }, { name: '50km', value: '50' }],
	]
	const columns2name = ref('距离');
	const pickerShow2 = ref(false);

	// 数据列表及总数
	const total = ref(0);
	const dataList = ref([]);

	// 选择器关闭方法
	const prickClose = () => {
		pickerShow.value = false;
	};
	const prickClose2 = () => {
		pickerShow2.value = false;
	};

	// 进入店铺详情
	const toDetail = (shop) => {
		uni.setStorageSync('diningShopInfo', shop);
		toNav('/pages_B/dining/diningHome?id=' + shop.shopId)
	};

	// 状态选择确认
	const prickConfirm = (event) => {
		const { value } = event;
		listQuery.value.openState = value[0].value;
		// 重置页码并重新请求
		listQuery.value.pageNum = 1;
		dataList.value = [];
		getData()
		prickClose();
	}

	// 距离选择确认
	const prickConfirm2 = (event) => {
		const { value } = event;
		listQuery.value.scope = value[0].value;
		columns2name.value = value[0].name;
		// 重置页码并重新请求
		listQuery.value.pageNum = 1;
		dataList.value = [];
		getData()
		prickClose2();
	}

	// 选择器点击事件
	const selectClick = (field) => {
		if (field === 'sortField') {
			pickerShow2.value = true;
		};
		if (field === 'status') {
			pickerShow.value = true;
		};
	};

	// 导航到店铺位置
	const navigation = (shop) => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": shop.gitu,
					"latitude": shop.titu,
					"address": shop.address || '商家位置'
				}
			}
			openAPPLocation(navigationInfo)
		} else if (isWechatMP) {
			openLocation({
				latitude: shop.titu,
				longitude: shop.gitu,
				name: shop.shopName,
				address: shop.address,
			});
		}
	}

	// 拨打电话
	function call(phone : string) {
		if (!phone) return
		makePhoneCall(phone)
	};

	// 获取用户地址并初始化数据
	const getUserAddress = () => {
		// 从缓存获取地址（实际项目中建议添加缓存不存在的处理）
		const address = uni.getStorageSync('address');
		if (address) {
			listQuery.value.titu = address.lat; // 纬度
			listQuery.value.gitu = address.lng; // 经度
		} else {
			// 没有地址时的默认处理（可选）
			toast('未获取到您的位置信息');
		}
		getData()
	}

	// 获取数据列表
	const getData = async () => {
		// 上拉加载防抖：如果正在加载，直接返回
		if (isLoading.value) return;
		try {
			// 标记为加载中
			isLoading.value = true;
			const params = {
				...listQuery.value,
			}
			const res = await listOdsFzgRestaurantInfo(params);
			if (res.code === 200) {
				// 分页数据拼接：第一页直接替换，后续页追加
				dataList.value = listQuery.value.pageNum === 1 ? res.data.list : [...dataList.value, ...res.data.list];
				total.value = res.data.total;
			} else {
				toast(res.msg);
			}
		} catch (e) {
			console.log("数据加载异常：", e);
			toast('数据加载失败，请稍后重试');
		} finally {
			// 无论成功/失败，都关闭刷新动画和加载状态
			isRefreshing.value = false;
			isLoading.value = false;
		}
	}

	// 重置筛选条件
	const reset = () => {
		columns2name.value = '距离';
		listQuery.value.scope = undefined;
		listQuery.value.openState = undefined;
		listQuery.value.reviewGradeGood = ''
		// 销量优先
		listQuery.value.salesVolumeMore = ''
		//低价优先
		listQuery.value.perCapitaLow = ''
		// 高价优先
		listQuery.value.perCapitaHigh = ''
		// 人均价格区间开始
		listQuery.value.perCapitaStart = ''
		// 人均价格区间结束
		listQuery.value.perCapitaEnd = ''
		listQuery.value.reviewGradeThree = '';
		listQuery.value.reviewGradeFour = '';
		listQuery.value.reviewGradeFive = '';
		listQuery.value.cuisineType=''
		listQuery.value.pageNum = 1;
		newValue.value=''
		screenObj.value = {
			goodsType: '',
			priceValue: '',
			seValue: '',
		}
		close();
		dataList.value = [];
		getData();
	}
	const handleQuery = async () => {
		try {
			const result = await queryAll()
			if (result) {
				console.log(result);
				let total = 15
				for (let i in result) {
					if (result[i]) {
						total += result[i].height
					}
				}
				navHeight.value = total;
			}
		} catch (err) {
			console.log('卡片尺寸shib:', err)
		}
	}
	function onPickCat(c : { value : string }) {
		currentCat.value = c
		listQuery.value.cuisineType=c
		getData();
	}
	const selectPopClick = (field) => {
		selectType.value = field
		selectShow.value = true;
	}
	const close = () => {
		selectShow.value = false;
	}
	const pxClic = (item) => {
		newValue.value=item.value
		console.log(item);
		// 好评优先
		listQuery.value.reviewGradeGood = item.value == 2 ? true : ''
		// 销量优先
		listQuery.value.salesVolumeMore = item.value == 3 ? true : ''
		//低价优先
		listQuery.value.perCapitaLow = item.value == 4 ? true : ''
		// 高价优先
		listQuery.value.perCapitaHigh = item.value == 5 ? true : ''
		// listQuery.value.scope = item.value
		columns2name.value = item.name;
		listQuery.value.pageNum = 1;
		dataList.value = [];
		nextTick(() => {
			setTimeout(() => {
				close();
			}, 300);
		})
		getData()
	}
	const selectItemClick = (item, type) => {
		if(type == 1){
			screenObj.value.goodsType = item.dictValue
		}
		if(type == 2){
			screenObj.value.priceValue = item.dictValue
		}
		if(type == 3){
			screenObj.value.seValue = item.dictValue
		}
		listQuery.value.reviewGradeThree = '';
		listQuery.value.reviewGradeFour = '';
		listQuery.value.reviewGradeFive = '';
		switch (item.dictValue) {
			case 1:
				listQuery.value.scope = item.dictValue
				break;
			case 5:
				listQuery.value.scope = item.dictValue
				listQuery.value.reviewGradeFive = true;
				break;
			case 10:
				listQuery.value.scope = item.dictValue
				break;
			case 12:
				listQuery.value.perCapitaStart = item.min
				listQuery.value.perCapitaEnd = item.max
				break;
			case 13:
				listQuery.value.perCapitaStart = item.min
				listQuery.value.perCapitaEnd = item.max
				break;
			case 14:
				listQuery.value.perCapitaStart = item.min
				listQuery.value.perCapitaEnd = item.max
				break;
			case 3:
				listQuery.value.reviewGradeThree = true;
				break;
			case 4:
				listQuery.value.reviewGradeFour = true;
				break;
			default:
				break;
		}
		console.log(item)
	}
	const seleSubmit = () => {
		close();
		// 处理数据请求接口
		listQuery.value.pageNum = 1;
		dataList.value = [];
		getData()
	}
	// 页面加载时执行
	onLoad(() => {
		getUserAddress();
	});
	onReady(() => {
		// 从cos-header组件获取实际高度或计算
		nextTick(() => {
			setTimeout(() => {
				handleQuery();
			}, 300);
		})
	})
	// 下拉刷新
	const onRefresh = () => {
		// 标记为刷新中（显示刷新动画）
		isRefreshing.value = true;
		listQuery.value.pageNum = 1;
		dataList.value = [];
		getData();
	}

	// 上拉加载更多
	const onLoadMore = () => {
		// 防抖：正在加载/没有更多数据时，直接返回
		if (isLoading.value || listQuery.value.pageNum * listQuery.value.pageSize >= total.value) {
			return;
		}
		listQuery.value.pageNum++;
		getData();
	}
</script>

<style scoped lang="scss">
	.fiexView {
		width: 100%;
		height: 84rpx;
		background: #FFFFFF;
		padding: 15rpx 32rpx 0 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: flex-start;
		justify-content: space-around;

		.fiexView-item {
			width: 260rpx;
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 44rpx;
			border: 1px solid #CCCCCC;
			font-weight: 500;
			font-size: 30rpx;
			color: #000000;
		}

		.iconBut {
			background: $color;
			border: 1px solid $color;
			color: #FFFFFF;
		}
	}

	.popView-title {
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;

		text {
			color: #999999;
			font-weight: 500;
		}
	}

	.popView-cenGrid {
		padding: 30rpx 0;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 22rpx;

		.popView-cenGrid-item {
			width: 100%;
			height: 67rpx;
			line-height: 67rpx;
			text-align: center;
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			background: #F8F9FB;
			border-radius: 16rpx;
			border: 1px solid #F8F9FB;
		}

		.gridActive {
			background: #F8F9FB;
			border-radius: 16rpx;
			border: 1px solid var(--primary-color);
			color: var(--primary-color);
		}
	}

	.selectPop {

		padding: 0 30rpx 30rpx;
		box-sizing: border-box;
	}

	.teItem {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #EBEBEB;
	}

	.textBox {
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		line-height: 34rpx;
	}

	.activeTextBox {
		color: var(--primary-color) !important;
		font-weight: 600;
	}

	.food-page {
		height: 100vh;
		min-height: 100vh;
		overflow: hidden;
		background: $pageBgColor;
	}

	.bg-box {
		position: absolute;
		z-index: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 280rpx;
		background: $color;
		border-radius: 0 0 40rpx 40rpx;
	}

	/* 头部 */
	.header {
		padding-bottom: 20rpx;
		background: $color;
	}

	.search-row {
		// height: 72rpx;
		// background: #FFFFFF;
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 32rpx;
		box-sizing: border-box;
	}

	.gap8 {
		width: 16rpx;
		height: 1rpx;
	}

	.tab-card {
		width: 686rpx;
		// height: 120rpx;
		background: #FFFFFF;
		border-radius: 26rpx;
		border: 8rpx solid #FFFFFF;
		margin: 0 32rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		padding: 10rpx 10rpx;

		// padding-left: 30rpx;
	}

	.scroll-wrapper {
		height: 120rpx;
		display: flex;
		overflow-x: auto;
		white-space: nowrap;
	}

	.cat-items {
		display: flex;
		// height: 200rpx;
	    justify-content: space-between;
		flex-wrap: nowrap;
	}

	.cat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.cat-icon {
		width: 78rpx;
		height: 65rpx;
	}

	.cat-text {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #7a7f87;
	}

	.cat-text.active {
		color: $color;
		font-weight: 600;
	}

	.filters {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
		padding: 20rpx 32rpx 20rpx 32rpx;
	}

	.chip {
		height: 56rpx;
		line-height: 56rpx;
		box-sizing: border-box;
		padding: 0 26rpx;
		background: #fff;
		border-radius: 28rpx;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chip--active {
		color: #FFFFFF;
		background: $bgLgColor;
	}

	/* 列表 */
	.list {
		width: 95%;
		margin: 0 auto;
		height: 80vh;
		overflow: scroll;
		padding: 0 0 20rpx;
	}

	.shop-card {
		margin-bottom: 20rpx;
		border-radius: 26rpx;
		background: #FFFFFF;
		padding: 30rpx;
	}

	.shop-row {
		display: flex;
		gap: 20rpx;
	}

	.shop-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.name-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.name {
		font-weight: 800;
		font-size: 32rpx;
		color: #000000;
	}

	.statusText {
		font-size: 24rpx;
		color: $color;
		line-height: 30rpx;
		padding: 0 14rpx;
		box-sizing: border-box;
		border: 1rpx solid $color;
		border-radius: 16rpx;
		margin-right: 10rpx;
	}

	.phone {
		width: 56rpx;
		height: 56rpx;
		justify-content: center;
		align-items: center;
		display: flex;
		/* 新增：确保图标居中 */
	}

	.rate-row {
		display: flex;
		align-items: center;
		color: #8a8f99;
		font-size: 22rpx;
	}

	.icon-box {
		width: 34rpx;
		height: 34rpx;
		line-height: 34rpx;
		background: linear-gradient(-40deg, #FF4C26, #FF8A51);
		border-radius: 6rpx 0rpx 0rpx 6rpx;
	}

	.score {
		width: 90rpx;
		height: 34rpx;
		line-height: 34rpx;
		background: #FFEFE8;
		border-radius: 0rpx 6rpx 6rpx 0rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #FF5000;
		padding-left: 12rpx;
		margin-right: 20rpx;
	}

	.time {
		margin-left: 8rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #666666;
		display: flex;
		align-items: center;
	}

	.times {
		color: $color;
	}

	.metas-row {
		display: flex;
		flex-direction: column;
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 12rpx;

		.meta {
			font-size: 22rpx;
			color: #333333;
		}

		.divider {
			width: 1rpx;
			height: 22rpx;
			background: #CCCCCC;
		}
	}

	.meta-addr {
		font-weight: 500;
		font-size: 22rpx;
		color: #666666;
	}

	.addr-row {
		height: 76rpx;
		background: #F5F5F5;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		margin-top: 24rpx;
		padding: 0 24rpx;

		.addr {
			width: 320rpx;
			font-size: 24rpx;
			color: #333333;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-left: 10rpx;
		}

		.dist {
			font-size: 24rpx;
			color: #333333;
			margin-right: 12rpx;
		}
	}

	.flex-spacer {
		flex: 1;
	}

	.u-grid {
		height: 200rpx;
	}

	.reset {
		font-size: 24rpx;
		border: 1rpx solid #09BABE;
		border-radius: 30rpx;
		text-align: center;
		width: 100rpx;
		line-height: 40rpx;
		height: 40rpx;
		margin-top: 6rpx;
	}
</style>