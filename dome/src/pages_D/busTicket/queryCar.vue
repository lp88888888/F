<template>
	<view class="page-container" :data-theme="pageTheme">

		<up-navbar title="车票查询" bgColor="none" @leftClick="toBack" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>

		<view class="destination">
			<view>{{busTicketStore.startPlace.name}}</view>
			<image :src="imgUrl+'queryCar-fx.png'" mode="" class="swap-icon"></image>
			<view>{{busTicketStore.endPlace.name}}</view>
		</view>
		<view>
			<view class="date-selector-wrapper">
				<view style="width:626rpx;">
					<DateSelector :model-value="busTicketStore.selectedDate" @day-selected="onDaySelected" />
				</view>
				<view class="data-xz" @click="handleSelTime()">
					<image :src="imgUrl+'queryCar-rl.png'" mode="" class="ri-icon"></image>
					<view>日历</view>
				</view>
				<view class="date-selector-lb"></view>
			</view>

			<!-- 页面其他内容 -->
			<!-- 	<view class="content">
					<view class="content-tab">
						发车时间
						<image :src="imgUrl+'rentCar-iocn4.png'" mode="" class="s-icon"></image>
					</view>
					<view class="content-tab">
						价格
						<image :src="imgUrl+'rentCar-iocn4.png'" mode="" class="s-icon"></image>
					</view>
					<view class="content-tab">
						座位类型
						<image :src="imgUrl+'rentCar-iocn4.png'" mode="" class="s-icon"></image>
					</view>
					<view class="content-tab">
						有余票
						<image :src="imgUrl+'rentCar-iocn4.png'" mode="" class="s-icon"></image>
					</view>
				</view> -->
		</view>

		<scroll-view scroll-y class="list-con" @scrolltolower="onReachBottom">

			<view class="ticket-list" v-if="tickets.length">
				<!-- 车票项 -->
				<view v-for="(ticket, index) in tickets" :key="index" class="ticket-item" @click="toUrl(ticket)">
					<view class="left-content">
						<!-- 出发时间 -->
						<view class="">
							<view class="departure-time">{{ ticket.departTime }}</view>
							<view class="duration" v-if="ticket.runtime && ticket.runtime>0">大约 {{ticket.runtime }}小时</view>
						</view>
						<!-- 站点信息 -->
						<view class="stations">
							<view class="station">
								<image :src="imgUrl+'dian.png'" class="circle-icon"></image>
								<text>{{busTicketStore.startPlace.name}}</text>
							</view>
							<view class="arrow">
								<image :src="imgUrl+'queryCar-down.png'" class="arrow-icon"></image>
							</view>
							<view class="station">
								<image :src="imgUrl+'dian.png'" class="circle-icon"></image>
								<text>{{ ticket.stationName }}</text>
							</view>
						</view>
						<view class="price"><text>¥</text> {{ ticket.fullPrice }}</view>
					</view>

					<!-- 右侧价格和余票 -->
					<!-- <view class="right-content">
						<view class="remaining-tickets">余票: {{ ticket.remainingTickets }}张</view>
					</view> -->
				</view>
				<view style="height: 30rpx;"></view>
			</view>

			<template v-if="!tickets.length">
				<ser-empty></ser-empty>
			</template>

			<up-popup :show="show" @close="close" mode="top" safeAreaInsetTop='true' closeIconPos='top-left' :round="10"
				@open="open">
				<view class="popup-box">
					<view class="popup-top">更换城市</view>
					<view class="popup-city">省西安汽车站 <image src="" mode="" class="popup-icon"></image> 敖江 </view>
					<view class="popup-data"> 3月15日 <text>周四</text> </view>
					<view class="popup-save">
						确定
					</view>
				</view>
			</up-popup>


			<up-popup :show="saixunshow" @close="shaixuanclose" mode="bottom" closeIconPos='top-left' :round="10"
				@open="shaixuanopen">
				<view class="filter-options">
					<view class="popup-top">筛选</view>
					<!-- 出发时间 -->
					<view class="section">
						<view class="title">出发时间</view>
						<view class="options">
							<view v-for="(option, index) in departureTimeOptions" :key="index" class="popup-button"
								:class="  { active: selectedDepartureTime === option.value }"
								@click="selectDepartureTime(option.value)">
								{{ option.label }}
							</view>
						</view>
					</view>

					<!-- 是否有余票 -->
					<view class="section">
						<view class="title">是否有余票</view>
						<view class="options">
							<view v-for="(option, index) in ticketStatusOptions" :key="index" class="popup-button"
								:class="{ active: selectedTicketStatus === option.value }"
								@click="selectTicketStatus(option.value)">
								{{ option.label }}
							</view>
						</view>
					</view>

					<!-- 操作按钮 -->
					<view class="actions">
						<view class="reset" @click="resetFilters">重置</view>
						<view class="submit" @click="submitFilters">完成</view>
					</view>
				</view>
			</up-popup>

			<up-calendar v-model="rangeDate" :defaultDate="defaultDateMultiple" :show="dateshow" mode="single" @confirm="dateconfirm" @close="dateshow = false"
				:maxDate='maxDate' monthNum='1' :color="calendarColor" />
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { onLoad, onPageScroll } from '@dcloudio/uni-app';
	import DateSelector from './components/data.vue';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { useBusTicketStore } from '../../stores/busTicket'
	import { timeFormat } from '@/uni_modules/uview-plus';
	import { schedule } from '@/api/busticket';
	const busTicketStore = useBusTicketStore()
	const backgroundColor = ref<string>();
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const show = ref(false);
	const saixunshow = ref(false);
	const tickets = ref([]);
	const loading = ref(false);
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	// 最大日期
	const defaultDateMultiple=ref([])
	const d = new Date();
	const year = d.getFullYear();
	let month = d.getMonth() + 1;
	month = month < 14 ? `0${month}` : month;
	const date = d.getDate();
	const maxDate = `${year}-${month}-${date + 14}`;
	const departureTimeOptions = [
		{ label: '全部时间', value: 'all' },
		{ label: '00:00-05:59', value: '00-06' },
		{ label: '06:00-11:59', value: '06-12' },
		{ label: '12:00-17:59', value: '12-18' },
		{ label: '18:00-23:59', value: '18-24' }
	];

	const scheduleFun = async () => {
		tickets.value = []
		loading.value = true;
		console.log('出发地：', busTicketStore.startPlace)
		// console.log('目的地：', busTicketStore.endPlace)
		// console.log('日期：', busTicketStore.selectedDate)
		const params = {
			departDate: busTicketStore.selectedDate,
			startStationCode: busTicketStore.startPlace.code,
			startStationName: busTicketStore.startPlace.name,
			departOrgCodes: busTicketStore.endPlace.code,
			reachStationName: busTicketStore.endPlace.name,
		};
		const res = await schedule(params);
		loading.value = false;
		if (res.code === 200 && res.data) {
			tickets.value = res.data;
		}
	};
	const calendarColor = computed(() => {
		const themeName = uni.getStorageSync('app-theme') || 'default';
		switch (themeName) {
			case 'green':
				return '#628F2F';
			case 'blue':
				return '#5FAFFF';
			case 'orange':
			default:
				return '#628F2F'; // 默认橙色
		}
	});

	// 初始化是否有余票选项
	const ticketStatusOptions = [
		{ label: '不限', value: 'all' },
		{ label: '有余票', value: 'available' }
	];

	// 当前选中的出发时间
	const selectedDepartureTime = ref('all');

	// 当前选中的是否有余票状态
	const selectedTicketStatus = ref('all');

	// 选择出发时间
	const selectDepartureTime = (value : string) => {
		selectedDepartureTime.value = value;
	};

	// 选择是否有余票状态
	const selectTicketStatus = (value : string) => {
		selectedTicketStatus.value = value;
	};

	// 重置筛选条件
	const resetFilters = () => {
		selectedDepartureTime.value = 'all';
		selectedTicketStatus.value = 'all';
	};

	// 提交筛选条件
	const submitFilters = () => {
		console.log('Selected Departure Time:', selectedDepartureTime.value);
		console.log('Selected Ticket Status:', selectedTicketStatus.value);
	};
	// 引入日期选择组件
	const dateshow = ref(false)
	const handleSelTime = () => {
		dateshow.value = true
	defaultDateMultiple.value = [busTicketStore.selectedDate]
	}
	const dateconfirm = async (e : string) => {
		const time = e[0]
		console.log('日历选中日期：', time)
		// 关键：更新store中的选中日期，子组件会自动监听并同步选中状态
		busTicketStore.selectedDate = time;
		// 重新请求车票数据（原有逻辑保留）
		const params = {
			departDate: time,
			startStationCode: busTicketStore.startPlace.code,
			startStationName: busTicketStore.startPlace.name,
			departOrgCodes: busTicketStore.endPlace.code,
			reachStationName: busTicketStore.endPlace.name,
		};
		const res = await schedule(params);
		if (res.code === 200 && res.data) {
			tickets.value = res.data;
		}
		dateshow.value = false
	};

	// 存储用户选中的日期
	const selectedDate = ref<string | null>(null);
	const getCurrentYear = () => {
		return new Date().getFullYear();
	};
	// 接收子组件传递的选中日期
	const onDaySelected = (fullDate : string) => {
		busTicketStore.selectedDate = fullDate;
		scheduleFun();
	};


	// 页面生命周期（可选）
	onLoad(() => {
		if (!busTicketStore.selectedDate) {
			busTicketStore.selectedDate = timeFormat(new Date(), 'yyyy-mm-dd');
		}
		console.log('页面加载');
		scheduleFun()
	});
	const close = () => {
		// 关闭逻辑，设置 show 为 false  
		show.value = false;
		// console.log('close');  
	};
	const open = () => {
		// 关闭逻辑，设置 show 为 false  
		show.value = true;
		// console.log('close');  
	};
	const shaixuanclose = () => {
		// 关闭逻辑，设置 show 为 false  
		saixunshow.value = false;
		// console.log('close');  
	};
	const shaixuanopen = () => {
		// 关闭逻辑，设置 show 为 false  
		saixunshow.value = true;
		// console.log('close');  
	};
	onPageScroll((e) => {
		// 处理页面滚动
	});
	const toUrl = (item) => {
		busTicketStore.formData.departTime = item.departTime
		busTicketStore.formData.runtime = item.runtime
		busTicketStore.formData.fullPrice = item.fullPrice
		busTicketStore.formData.scheduleCode = item.scheduleCode
		busTicketStore.formData.seatType = item.seatType
		busTicketStore.formData.stationCode = item.stationCode
		uni.navigateTo({
			url: '/pages_D/busTicket/orderFilling'
		})
	}
</script>

<style scoped lang="scss">
	.filter-options {
		padding: 36rpx 40rpx;

		.section {
			margin-bottom: 20rpx;

			.title {
				font-weight: 700;
				font-size: 28rpx;
				color: #3D3D3D;
				margin-bottom: 24rpx;
			}

			.options {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.popup-button {
					width: 304rpx;
					height: 72rpx;
					background: #F9F7F5;
					border-radius: 40rpx 40rpx 40rpx 40rpx;
					font-size: 28rpx;
					color: #666666;
					text-align: center;
					line-height: 72rpx;
					margin-bottom: 24rpx;

					&.active {
						background: #F7F0E4;
						border-radius: 40rpx 40rpx 40rpx 40rpx;
						border: 2rpx solid #FF9F0F;
						color: #FF9F0F;
					}
				}
			}
		}

		.actions {
			display: flex;
			justify-content: space-around;
			margin-top: 20rpx;

			.reset {
				width: 256rpx;
				height: 96rpx;
				background: #EAEAEA;
				border-radius: 48rpx 48rpx 48rpx 48rpx;
				font-weight: 400;
				font-size: 32rpx;
				color: #666666;
				line-height: 96rpx;
				text-align: center;
			}

			.submit {
				width: 256rpx;
				height: 96rpx;
				background: linear-gradient(180deg, #FFA836 0%, #FF9000 100%);
				border-radius: 48rpx 48rpx 48rpx 48rpx;
				font-weight: 700;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 96rpx;
				text-align: center;
			}
		}
	}

	.popup-box {
		padding: 34rpx 40rpx 0rpx 40rpx;
		box-sizing: border-box;
	}

	.popup-top {
		font-weight: 700;
		font-size: 36rpx;
		color: #333333;
		margin-bottom: 70rpx;
		text-align: center;
	}

	.popup-city {
		font-weight: 700;
		font-size: 36rpx;
		color: #333333;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.popup-icon {
			width: 52rpx;
			height: 52rpx;
		}
	}

	.popup-data {
		font-weight: 700;
		font-size: 36rpx;
		color: #333333;
		margin-bottom: 66rpx;
		margin-top: 56rpx;

		text {
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
		}
	}

	.popup-save {
		width: 654rpx;
		height: 96rpx;
		background: linear-gradient(180deg, #FFA836 0%, #FF9000 100%);
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(255, 144, 0, 0.3);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		text-align: center;
		line-height: 96rpx;
		font-weight: 400;
		font-size: 36rpx;
		color: #FFFFFF;
	}

	.page-container {
		height: 100vh;
		overflow: hidden;
		background: var(--head-color);
		display: flex;
		flex-direction: column;
	}

	.date-selector-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx;
		border-radius: 16rpx;
		position: relative;
	}

	.content {
		padding: 24rpx 40rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	::v-deep .u-navbar__content {
		background: #ffffff !important;
	}

	.content-tab {
		display: flex;
		align-items: center;
		padding: 8rpx 20rpx;
		border-radius: 28rpx 28rpx 28rpx 28rpx;
		font-size: 24rpx;
		color: #666666;
		background: #FFFFFF;
	}

	.list-con {
		width: 750rpx;
		flex: 1 0;
		height: 0;
	}

	.ticket-list {
		padding: 24rpx 32rpx;
		box-sizing: border-box;

		.shop-image {
			width: 103rpx;
			height: 37rpx;
			margin-bottom: 28rpx;
		}

		.ticket-item {
			background-color: #fff;
			border-radius: 10rpx;
			margin-bottom: 24rpx;
			padding: 16rpx 24rpx;

			.left-content {
				display: flex;
				justify-content: space-between;
				align-items: baseline;

				.departure-time {
					font-size: 40rpx;
					color: #333;
					font-weight: bold;
				}

				.duration {
					font-size: 24rpx;
					color: #999;
					margin-top: 10rpx;
				}

				.stations {
					display: flex;
					align-items: baseline;
					flex-direction: column;

					.station {
						display: flex;
						align-items: center;

						.circle-icon {
							width: 20rpx;
							height: 20rpx;
							margin-right: 10rpx;
						}

						text {
							font-size: 28rpx;
							color: #333;
						}
					}

					.arrow {


						.arrow-icon {
							width: 10rpx;
							height: 50rpx;
							margin-left: 10rpx;
						}
					}
				}

				.price {
					text {
						font-size: 24rpx;
						color: #ff6200;
					}

					font-size: 48rpx;
					color: #ff6200;
					font-weight: bold;
				}
			}

			.right-content {
				display: flex;
				flex-direction: column;
				align-items: flex-end;

				.remaining-tickets {
					font-size: 24rpx;
					color: #666;
					border-radius: 24rpx;
					margin-top: -70rpx;
				}
			}
		}
	}

	.destination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 22rpx;
		font-size: 36rpx;
		color: #333333;
	}

	.swap-icon {
		width: 120rpx;
		height: 15rpx;
	}

	.date-selector-lb {
		width: 26rpx;
		height: 80rpx;
		position: absolute;
		right: 100rpx;
	}

	.data-xz {
		text-align: center;
		font-size: 22rpx;
		margin-right: 25rpx;
	}

	.ri-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.s-icon {
		width: 30rpx;
		height: 30rpx;
	}

	::v-deep .u-navbar__content {
		background: transparent !important;
	}
</style>