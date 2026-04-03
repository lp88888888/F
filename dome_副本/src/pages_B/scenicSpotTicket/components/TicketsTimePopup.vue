<template>
	<view :data-theme="pageTheme">
		<up-popup :show="show" @close="close" round="8">
			<view class="popView">
				<view class="paddBox fl-ce-sb">
					<up-icon name="close" size="20" color="#3D3D3D" @click="close"></up-icon>
					<view class="nameText">成人票</view>
					<view class="subBox"></view>
				</view>
				<!-- <view class="nameBox paddBox">
					<view class="nameBox-icon">
						<up-icon name="close" size="20" color="#3D3D3D" @click="close"></up-icon>
					</view>
					<view class="nameBox-text">成人票</view>
				</view> -->
				<view class="paddBox">
					<view>
						<view class="textName">使用时期</view>
						<up-gap height="12"></up-gap>
						<view class="datBox fl-ce-sb">
							<scroll-view class="dateGrod" :scroll-x="true">
								<view
									:class="['dateGrod-item', dateSelect == item.fullDate ? 'gropActive' : '']"
									:style="{
										color: dateSelect == item.fullDate ? themeStore.themeColors.$pColor : '#333',
										borderColor: dateSelect == item.fullDate ? themeStore.themeColors.$pColor : '',
										backgroundColor: dateSelect == item.fullDate ? themeStore.themeColors.$pColorOpa : '',
									}"
									v-for="(item, index) in dateList"
									:key="index"
									@click="dateClick(item)"
								>
									<view class="dateGrod-item-label">{{ item.label }}</view>
									<up-gap height="8"></up-gap>
									<view class="dateGrod-item-das">{{ item.date1 }}</view>
									<up-gap height="3"></up-gap>
									<view class="dateGrod-item-price">￥{{ item.salesPrice?item.salesPrice:'0' }}</view>
									<up-gap height="3"></up-gap>
									<view class="dateGrod-item-price" style="color: #000; font-size: 20rpx">余{{ item.quantity?item.quantity:'0' }}</view>
								</view>
							</scroll-view>
							<!-- @click="calendarShow = true" -->
							<!-- <view class="datBox-right fl-ce-ce" >
								<text>日期</text>
								<up-icon name="arrow-right" size="13" color="#3D3D3D"></up-icon>
							</view> -->
						</view>
					</view>
					<!-- <up-gap height="20"></up-gap>
					<view>
						<view class="textName">可选门点</view>
						<up-gap height="12"></up-gap>
						<view class="grodBox">
							<view :class="['grodBox-item',lotSelect == item.name?'gropActive':'']"
								v-for="(item,index) in lotOpticon" :key="index" @click="gropChange(item,'lot')">
								{{item.name}}
							</view>
						</view>
					</view> -->
					<up-gap height="20"></up-gap>
					<view>
						<view class="textName">入园时段</view>
						<up-gap height="12"></up-gap>
						<view class="grodBox">
							<view
								:class="['grodBox-item', timeSelect == item.name ? 'gropActive' : '']"
								:style="{
									color: timeSelect == item.name ? themeStore.themeColors.$pColor : '#333',
									borderColor: timeSelect == item.name ? themeStore.themeColors.$pColor : '',
									backgroundColor: dateSelect == item.fullDate ? themeStore.themeColors.$pColorOpa : '',
								}"
								v-for="(item, index) in timeOpticon"
								:key="index"
								@click="gropChange(item, 'time')"
							>
								{{ item.name }}
							</view>
						</view>
					</view>
				</view>
				<view class="butBox paddBox fl-ce-sb">
					<view class="deaPric">
						<text class="fh">￥</text>
						<text class="num">{{ settlePrice }}</text>
					</view>
					<view class="butBox-but" :style="{ background:themeStore.themeColors.$bgLgColor }" @click="next()">下一步</view>
				</view>
			</view>
		</up-popup>

		<!-- 更多日期 -->
		<up-calendar
			:show="calendarShow"
			color="#FF9600"
			:defaultDate="dateSelect"
			closeOnClickOverlay
			@close="calenClose"
			@confirm="calenConfirm"
		></up-calendar>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { toNav, toBack } from '@/utils/route';
import { getDays } from '@/utils/date';
import { showToast } from '@/utils/util';
import { imgUrl } from '@/config';
import { odsJjbScenicSpotpic } from '@/api/scenicArea';
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = computed(() => themeStore.imgUrl);

// const props = defineProps({
// 	 info: {
// 	     type: Object,
// 	       default: () => ({})
// 	  },
// })
const show = ref(false);
const info = ref({});
const mpinfo = ref({});
const settlePrice = ref('');
const calendarShow = ref(false);
const minDate = ref(new Date());
const lotSelect = ref('');
const lotOpticon = ref([{ name: '含光门' }, { name: '长乐门(东门)' }, { name: '安定门(西门)' }, { name: '安远门(北门)' }]);
const timeSelect = ref('');
const timeOpticon = ref([]);
const dateSelect = ref(''); //
const dateList = ref([]);
onMounted(() => {});
const getpic = async () => {
	try {
		let res: any = await odsJjbScenicSpotpic(info.value.productId);
		if (res.code == 200) {
			dateList.value = dateList.value.map((item, i) => ({
				...item,
				...(res.data[i] || {}),
			}));
			mpinfo.value = dateList.value[0];
			settlePrice.value = dateList.value[0].salesPrice;
			dateSelect.value = dateList.value[0].fullDate;
			timeOpticon.value = dateList.value[0].timeSlot.map(item => {
				return {
					name:`${item.startTime}-${item.endTime}`
				}
			})
		} else {
			uni.showToast({ title: res.msg, icon: 'none' });
		}
	} catch (err) {}
};
const dateClick = (item) => {
	console.log(item, 'sssssssssssss');
	mpinfo.value = item;
	settlePrice.value = item.salesPrice;
	dateSelect.value = item.fullDate;
	timeOpticon.value = item.timeSlot.map(item => {
		return {
			name:`${item.startTime}-${item.endTime}`
		}
	})
};
const close = () => {
	show.value = false;
};
const open = (e) => {
	show.value = true;
	info.value = e;
	dateList.value = getDays(7);
	getpic();
};
const calenClose = () => {
	calendarShow.value = false;
};
const calenConfirm = (event) => {
	dateSelect.value = event[0];
	calenClose();
};
const gropChange = (item, type) => {
	if (type == 'time') {
		timeSelect.value = item.name;
	}
	if (type == 'lot') {
		lotSelect.value = item.name;
	}
};
// 下一步
const next = () => {
	// if (!lotSelect.value) return showToast('请选择可选门点');
	if (!timeSelect.value) return showToast('请选择入园时段');
	if (!dateSelect.value) return showToast('请选择使用时期');
	mpinfo.value.lotSelect = lotSelect.value;
	mpinfo.value.timeSelect = timeSelect.value;
	mpinfo.value.dateSelect = dateSelect.value;
	uni.setStorageSync('mpinfo', mpinfo.value);
	close();
	uni.redirectTo({
	  url: '/pages_B/scenicSpotTicket/addOrder'
	})
};
defineExpose({
	open,
});
</script>

<style lang="scss" scoped>
@import url('../style.scss');

.textName {
	font-size: 28rpx;
	font-weight: bold;
	line-height: 28rpx;
	color: #3d3d3d;
}

.grodBox {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 25rpx;

	.grodBox-item {
		width: 100%;
		height: 72rpx;
		border-radius: 40rpx;
		background: #f9f7f5;
		font-size: 28rpx;
		font-weight: normal;
		line-height: 72rpx;
		text-align: center;
		color: #666666;
		border: 2rpx solid #f9f7f5;
	}
}

.datBox {
	.dateGrod {
		
		white-space: nowrap;
		display: flex;

		.dateGrod-item {
			display: inline-flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100rpx;
			height: 144rpx;
			border-radius: 8rpx;
			background: #f9f7f5;
			margin-right: 16rpx;
			border: 2rpx solid #f9f7f5;
			box-sizing: border-box;
			font-size: 24rpx;

			line-height: 24rpx;
			color: #333333;

			.dateGrod-item-label {
				font-weight: normal;
			}

			.dateGrod-item-das {
				font-weight: bold;
			}

			.dateGrod-item-price {
				font-weight: bold;
				color: #fd4848;
			}
		}
	}

	.datBox-right {
		width: 128rpx;
		height: 144rpx;
		border-radius: 8rpx;
		background: #f9f7f5;
		padding: 0 20rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		font-weight: normal;
		line-height: 24rpx;
		color: #333333;

		text {
			display: inline-block;
			width: 48rpx;
		}
	}
}

.gropActive {
	// border: 2rpx solid $pColor ;
	// background: #f7f0e4 ;
	// color: $pColor ;

	// .dateGrod-item-label,
	// .dateGrod-item-das {
	// 	color: $pColor ;
	// }
}

.butBox {
	border-top: 2rpx solid rgba(0, 0, 0, 0.1);
	box-shadow: 0px -8rpx 20rpx 0px rgba(0, 0, 0, 0.03);

	.butBox-but {
		width: 280rpx;
		height: 96rpx;
		border-radius: 48rpx;
		background: $pColor;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 96rpx;
		text-align: center;
		color: #ffffff;
	}
}

.deaPric {
	.fh {
		font-size: 32rpx;
		font-weight: 700;
		line-height: 32rpx;
		color: #333;
	}

	.num {
		font-size: 48rpx;
		font-weight: 700;
		line-height: 48rpx;
		color: #333333;
		margin-right: 6rpx;
	}
}
</style>
