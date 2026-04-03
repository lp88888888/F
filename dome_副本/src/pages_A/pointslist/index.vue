<template>
	<view class="page">
		<!-- 头部 -->
		<!-- <cos-header title='积分明细' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="90"></cos-header> -->
		<up-sticky>
			<view class="searchView" :style="{background:backgroundColor}">
				<up-navbar bgColor="transparent" title='积分明细' @leftClick="toBack" placeholder fixed></up-navbar>
			</view>
		</up-sticky>
		<!-- 积分概览 -->
		<view class="integral-overview" :style="{
    backgroundImage:  `url(${imgUrl}static/${pageTheme}-ponts-bj-men.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }">
			<view style="display:flex;align-items:center;justify-content:space-around;width: 100%;">
				<view class="points-opk" style="border-right: 2rpx solid #fff;padding-right: 50rpx;">
					<view style="font-weight: 600;font-size: 48rpx;color: #FFFFFF;">
						{{pointsinfo.pointsAccount.commonPoint}}
					</view>
					<view style="font-weight: 400;font-size: 28rpx;color: #FFFFFF;">可用总积分</view>
				</view>
				<view class="points-opk">
					<view style="font-weight: 600;font-size: 48rpx;color: #FFFFFF;">
						{{pointsinfo.pointsAccount.asgsPoint||0}}
					</view>
					<view style="font-weight: 400;font-size: 28rpx;color: #FFFFFF;">爱上高速积分</view>
				</view>
				<view class="points-opk-1" @click="ispointtype=!ispointtype">
					查看更多 <up-icon name="arrow-down-fill" :color="themeStore.themeColors.$primaryColor"
						size="12"></up-icon>
				</view>
			</view>
			<!-- <view class="point-type" @click="ispointtype=!ispointtype" >
				其他积分 <up-icon name="arrow-down-fill" color="#000" size="12"></up-icon>
			</view>
			<view class="point-type-list" v-if="ispointtype" >
				<view class="point-type-item" v-for="(item, itemIndex) in pointsTypeList" :key="itemIndex">
					<view class="point-type-name">{{ item.pointsTypeName }}</view>
					<view class="point-type-num">{{ item.pointsNum }}</view>
				</view>
			</view> -->
		</view>


		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view style="display: flex;align-items: center;">
				<view class="date-filter" @click="show=true">
					<text v-if="firstDate">{{firstDate}}</text>
					<text v-else>选择时间</text>
					<up-icon name="arrow-down-fill" color="#000" size="12"></up-icon>
				</view>
			</view>
			<view>
				<view class="date-filter" @click="qiaojianshow=true">
					<text>条件查询</text>
					<up-icon name="arrow-down-fill" color="#000" size="12"></up-icon>
				</view>
			</view>

		</view>
		<view class="integral-detail">
			<!-- 积分明细列表 -->
			<view class="integral-list">
				<view v-for="(item, itemIndex) in pointslist" :key="itemIndex" @click="todal(item)">
					<view class="integral-item">
						<view class="date">{{filtertime(item.createTime)}}</view>
						<view>
							<view class="detail-item"> 
								<view class="">
									<view class="name">{{item.pointsDetail }}</view>
									<text class="time">{{ item.createTime }}来源:{{item.pointsSourceName}}</text>
								</view>
								<view style="width: 200rpx;display:flex;text-align: center;justify-content: center;">
									<text :class="item.operateType=='1' ? 'positive' : 'negative'">
										{{ item.pointsNum }}
									</text><br />
									<!-- <text class="yuee">余额:{{ item.pointsBalance }}</text> -->
								</view>

							</view>
						</view>
					</view>

				</view>
				<view class="empty-data" v-if="!pointslist ||  pointslist.length === 0">
					<ser-empty></ser-empty>
				</view>
			</view>
			<!-- <up-calendar :show="show" :mode="mode" @confirm="datetimeFun" @close='show=false' color='#FF9600' allowSameDay
				:minDate='minDate' :defaultDate='currentDate' monthNum='24'></up-calendar> -->
			<up-datetime-picker :show="show" v-model="value1" format='YYYY-MM' mode="year-month" @cancel='cancelTime'
				@confirm="datetimeFun"></up-datetime-picker>
			<up-popup :show="qiaojianshow" @close="qiaojianshow = false" @open="open">
				<view class="popup-content">
					<view v-for="(item, index) in xuanlist" :key="index" class="option-group">
						<!-- 分组标题 -->
						<text class="option-group-title">{{ item.tit }}</text>

						<!-- 选项列表 -->
						<view
							style="display: grid;grid-template-columns: repeat(3, 1fr);grid-gap: 20rpx 12rpx;padding: 20rpx 0;margin-top: 20rpx;">
							<view v-for="(i, v) in item.list" :key="v" class="option-item">
								<!-- 图标或边框 -->
								<view class="option-icon" @click="toggleSelection(index, v)">
									<image v-if="i.istrue" :src="`${imgUrl}static/xuanz-zicon.png`" mode="widthFix"
										style="width: 100%; height: 100%;"></image>
									<view v-else class="unselected-box"></view>
								</view>

								<!-- 文字 -->
								<text class="option-text">{{ i.dictLabel }}</text>
							</view>
						</view>

					</view>
					<view class='bnt-save' @click="savesai">
						查询
					</view>
				</view>
			</up-popup>
			<up-popup :show="ispointtype" @close="ispointtype = false">
				<view class="popup-content">
					<view class="popup-content-text">积分来源</view>
					<view class="point-type-item" v-for="(item, itemIndex) in pointsTypeList" :key="itemIndex">
						<view class="point-type-name">{{ item.pointsTypeName }}</view>
						<view class="point-type-num">{{ item.pointsNum }}</view>
					</view>
					<view class='bnt-save' @click="ispointtype = false">
						确认
					</view>
				</view>
			</up-popup>
		</view>
		<PageDurationTracker pageName="积分明细" />
	</view>




</template>

<script setup lang="ts">
	import moment from "moment";
	import CosHeader from '@/components/customNavBar/index.vue';
	import {
		imgUrl,
	} from '../../config';
	import {
		ref,
		reactive,
		computed
	} from 'vue';
	import { getDict } from '@/api/config';
	import { onLoad } from '@dcloudio/uni-app'
	import { postpointsDetailPage, getmemberpointsDetailStatistics } from '@/api/member';
	import { toNav, toBack } from '@/utils/route';
	import { filtertime } from '@/utils/util';
	const istype = ref<any>('');
	const show = ref<boolean>(false);
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	// const value1 = ref<Date>(Date.now());
	const value1 = ref(Date.now());
	const filter = ref<any>('all');
	const mode = ref('range');
	const datetimeList = ref<string>('');
	const mineid = ref('');
	const minename = ref('全部明细');
	const qianjianid = ref('');
	const qianjianname = ref('条件查询');
	const backgroundColor = ref<string>("#EEFDF1");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const firstDate = ref<string>('');
	const lastDate = ref<string>('');
	const minDate = ref<string>('2025-01-01');
	const currentDate = ref<string>('');
	const pointslist = ref<any>([]);
	const ispointtype = ref(false);
	const pointsTypeList = ref([
		{
			pointsNum: 1,
			pointsTypeName: '陕易通积分'
		},
		{
			pointsNum: 2,

			pointsTypeName: '长安驿积分'
		},
		
	])
	interface Props {
	
		type: {
		    type: String,
		    default: null // 👈 设置默认值
		  }
	}
	
	const props = defineProps<Props>();
	const pagination = reactive({
		pages: 1,
		pageSize: 99999
	})
	const createYear = ref('')
	const createMonth = ref('')
	onLoad(() => {
		// 设置默认选中当前日期
		currentDate.value = moment(new Date()).format("YYYY-MM-DD")
		console.log(currentDate.value)
		getIntegralByUserIdFun()
		// getpointsdet()
		gettypelist()
		pointsTypeList.value[0].pointsNum=pointsinfo.value.pointsAccount.sytPoint||0
		pointsTypeList.value[1].pointsNum=pointsinfo.value.pointsAccount.freezeCommonPoint||0
	});

	const cardList = ref([{
		id: '1',
		name: '全部'
	},
	{
		id: '2',

		name: '获得'
	},
	{
		id: '3',
		name: '消耗'
	},
	])
	const cateList = ref([
		{
			id: '1',
			name: '分类1'
		},
		{
			id: '2',
			name: '分类2'
		},
		{
			id: '3',
			name: '分类4'
		},
	])
	const xuanlist = ref([
		{
			tit: '积分事件',
			list: [

			]
		},
		{
			tit: '变动方式',
			list: [
				{
					istrue: false,
					dictLabel: '积分获得',
					dictValue: 1
				},
				{
					istrue: false,
					dictLabel: '积分消耗',
					dictValue: 2
				}
			]
		},

	])
	const qiaojianshow = ref(false)
	const open = () => {
		qiaojianshow.value = true
	}
	const todal = (e) => {
		uni.navigateTo({
			url: '/pages_A/pointslist/pointsdal'
		})
		uni.setStorageSync('pointdal', e);
	}
	const gettypelist = async () => {
		const res = await getDict('points_event_type')
		if (res?.code == 200) {
			console.log(res.data, 'res.data')
			res?.data.forEach((item) => {
				item.istrue = false
			})
			xuanlist.value[0].list = res.data
			// istype.value = res.data
			console.log(xuanlist.value, 'xuanlist.value')
		}
	}

	const savesai = () => {
		qiaojianshow.value = false
		getIntegralByUserIdFun()
	}
	const toggleSelection = (groupIndex, optionIndex) => {
		// 切换选择状态的逻辑
		xuanlist.value[groupIndex].list[optionIndex].istrue =
			!xuanlist.value[groupIndex].list[optionIndex].istrue
	}
	const formatTime = (dateInput : string | number | Date) => {
		const date = new Date(dateInput)
		if (isNaN(date.getTime())) {
			return '--'
		}
		// 获取本地今天的零点
		const now = new Date()
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)
		const beforeYesterday = new Date(today)
		beforeYesterday.setDate(beforeYesterday.getDate() - 2)
		// 输入日期的零点
		const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

		if (inputDate.getTime() === today.getTime()) {
			return '今天'
		} else if (inputDate.getTime() === yesterday.getTime()) {
			return '昨天'
		} else if (inputDate.getTime() === beforeYesterday.getTime()) {
			return '前天'
		} else {
			const month = date.getMonth() + 1
			const day = date.getDate()
			return `${month}.${day}`
		}
	}
	// 方法  
	const selectItem = (item) => {
		console.log(item);
		mineid.value = item.id
		minename.value = item.name
		// getIntegralByUserIdFun()
	};
	const selectItem1 = (item) => {
		qianjianid.value = item.id
		qianjianname.value = item.name
		// getIntegralByUserIdFun()
		console.log(item);
	};
	const pointsinfo = ref(uni.getStorageSync('userInfo'))
	const getpointsdet = async () => {
		const res = await getmemberpointsDetailStatistics()
		if (res?.code == 200) {
			pointsinfo.value = res.data
		}
	}
	const filteredItems = computed(() => {
		if (filter.value === 'all') return items;
		return items.map(item => ({
			...item,
			details: item.details.filter(detail => (filter.value === 'gain' && detail.value > 0) || (
				filter.value === 'consume' && detail.value < 0))
		}));
	});

	const goBack = () => {
		router.back();
	};
	const cancelTime = () => {
		firstDate.value = ''
		createYear.value = ''
		createMonth.value = ''
		show.value = false
		getIntegralByUserIdFun()
	};
	const datetimeFun = (e : any) => {
		const now = new Date(e.value)
		const year = now.getFullYear()
		const month = String(now.getMonth() + 1).padStart(2, '0') // 月份从0开始，需+1
		createYear.value = year
		createMonth.value = month
		firstDate.value = `${year}-${month}`


		show.value = false
		getIntegralByUserIdFun()
	}
	const pointsType=ref(null)
	const getIntegralByUserIdFun = async () => {
		let type1 = []
		xuanlist.value[0].list.forEach((item, index) => {
			if (item.istrue) {
				type1.push(item.dictValue)
			}
		})
		let type2 = []
		xuanlist.value[1].list.forEach((item, index) => {
			if (item.istrue) {
				type2.push(item.dictValue)
			}
		})
		let params = {
			pageNum: pagination.pages,
			pageSize: pagination.pageSize,
			createYear: createYear.value,
			createMonth: createMonth.value,
			memberType: 1,
			pointsEventTypeList: type1,
			operateTypeList: type2,
			pointsType:props.type
		}
		// if (firstDate.value) {
		// 	params.startTime = firstDate.value
		// }
		// if (lastDate.value) {
		// 	params.endTime = lastDate.value
		// }
		const res = await postpointsDetailPage(params)
		if (res?.code == 200) {
			console.log('0000--', res.data.list);
			pointslist.value = res.data.list
		}
	}
	const istypeFun = (id : any) => {
		istype.value = id
		getIntegralByUserIdFun()
	}
</script>

<style scoped lang="scss">
	.point-type {
		font-size: 26rpx;
		color: #000;
		position: absolute;
		display: flex;
		right: 30rpx;
		bottom: 10rpx;
		align-items: center;
	}

	.point-type-list {
		width: 300rpx;
		padding: 32rpx;
		z-index: 999;
		position: absolute;
		display: flex;
		align-items: center;
		flex-direction: column;
		background: #fff;
		display: flex;
		right: 0rpx;
		bottom: -328rpx;
	}

	.point-type-item {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		color: #333;
	}

	.point-type-num {
		width: 50%;
		text-align: left;
		line-height: 88rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #FF9B36;
	}

	.point-type-name {
		width: 50%;
		text-align: left;
		line-height: 88rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.popup-content-text {
		font-weight: 500;
		font-size: 32rpx;
		color: #2E3133;
		padding: 32rpx 0;
	}

	.bnt-save {
		width: 702rpx;
		height: 88rpx;
		background: linear-gradient(0deg, #759E44 0%, #ACD483 100%);
		border-radius: 12rpx;
		text-align: center;
		line-height: 88rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		margin: 0 auto;
		margin-top: 40rpx;
	}

	.page {
		min-height: 100vh;
		background: linear-gradient(0deg, #FCFFFC 0%, #ECFCEF 100%);
		padding: 25rpx;
	}

	.integral-detail {
		padding: 25rpx;
		box-sizing: border-box;
		background: #ffffff;
		box-shadow: 0rpx 2rpx 4rpx 0rpx #D3E7D1;
		border-radius: 10rpx;
		height: 1050rpx;
		overflow: hidden;
		overflow-y: auto;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
	}

	.more-options {
		display: flex;
		align-items: center;
	}

	.integral-overview {
		height: 190rpx;
		margin-bottom: 32rpx;
		border-radius: 12rpx;
		display: flex;
		// justify-content: center;
		justify-content: flex-end;
		align-items: center;
		padding-right: 30rpx;
		position: relative;

		.points-opk {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: column;
		}

		.points-opk-1 {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 148rpx;
			height: 52rpx;
			background: #F3FCE7;
			border-radius: 34rpx 34rpx 34rpx 34rpx;
			opacity: 0.75;
			font-size: 26rpx;
			color: var(--primary-color);
		}
	}

	.integral-value {
		font-size: 60rpx;
		margin-bottom: 20rpx;

		.value {
			font-weight: bold;
		}
	}

	.unit {
		font-size: 26rpx;
		margin-left: 10rpx;
	}

	.daily-stats {
		display: flex;
		justify-content: space-around;
		gap: 36rpx;
	}

	.stat-item {
		width: 290rpx;
		height: 88rpx;
		border-radius: 20rpx;
		background-color: rgba(255, 255, 255, 0.2);
		text-align: center;
		font-size: 24rpx;
		line-height: 88rpx;
		color: #FFFFFF;
		display: flex;
		justify-content: space-around;
	}

	.filter-tabs {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
		font-weight: 400;

		text {
			font-family: PingFang SC;
			font-weight: 500;
			font-size: 24rpx;
			color: #FFFFFF;
		}

		.text-1 {
			font-family: PingFang SC;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
		}
	}

	.filter-tabs-1 {
		width: 100rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 28rpx;
		text-align: center;
		line-height: 56rpx;
		margin-right: 16rpx;
		font-family: PingFang SC;
		font-size: 24rpx;
		color: #333333;
	}

	.filter-tabs-2 {
		width: 100rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 28rpx;
		text-align: center;
		line-height: 56rpx;
		margin-right: 16rpx;
		font-family: PingFang SC;
		font-size: 24rpx;
		color: $color;
	}

	.date-filter {
		height: 56rpx;
		border-radius: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 32rpx;
		gap: 10rpx;

		text {
			font-size: 24rpx;
			line-height: 56rpx;
			color: #333333;
		}
	}

	.integral-list {
		// height: 1000rpx;
		// overflow-x: scroll;
	}

	.integral-item {
		background-color: white;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.date {
		font-weight: 500;
		font-size: 28rpx;
		color: #909599;
	}

	.name {
		width: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
	}

	.positive {
		font-weight: 400;
		font-size: 28rpx;
		color: #628F2F;
	}

	.negative {
		font-weight: 400;
		font-size: 28rpx;
		color: #F21646;
	}

	.time {
		font-weight: 400;
		font-size: 20rpx;
		color: #909090;
	}

	.yuee {
		font-weight: 400;
		font-size: 24rpx;
		color: #909090;
	}

	.stat-sz {
		font-size: 32rpx;
	}

	/* 弹窗内容容器 */
	.popup-content {
		padding: 40rpx 30rpx 60rpx;
		/* 上 左右 下 */
		max-height: 80vh;
		overflow-y: auto;
		box-sizing: border-box;
	}

	/* 选项组 */
	.option-group {
		margin-bottom: 50rpx;
	}

	/* 分组标题 */
	.option-group-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 24rpx;
		line-height: 1.4;
	}

	/* 选项项容器（每行一个选项） */
	.option-item {
		display: flex;
		align-items: center;
		margin-bottom: 28rpx;
		padding: 8rpx 0;
		background: #F7F7F7;
		border-radius: 12rpx;
	}

	/* 选中图标 / 未选边框容器 */
	.option-icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 16rpx;
		flex-shrink: 0;
	}

	/* 未选状态：带边框的方块 */
	.unselected-box {
		width: 100%;
		height: 100%;
		border: 2rpx solid #909599;
		border-radius: 4rpx;
		box-sizing: border-box;
	}

	/* 选项文字 */
	.option-text {
		font-size: 28rpx;
		color: #333333;
		line-height: 1.4;
	}
</style>