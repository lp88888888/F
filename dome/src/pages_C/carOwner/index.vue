<template>
	<view class="tourism_page" :data-theme="pageTheme">
		<up-navbar title="" bgColor="transparent" autoBack @leftClick="toBack" :fixed="true"></up-navbar>

		<image class="tourism_img" :src="`${imgUrl}static/cartourism_head_img.png`" mode=""></image>

		<view class="clockin_box">
			<image class="c_bg" :src="`${imgUrl}static/cartourism_check_bg.png`" mode=""></image>
			<image class="c_icon" :src="`${imgUrl}static/cartourism_check_icon.png`" mode=""></image>
			<view class="c_text">
				<text>打卡有礼</text>
				<text>参与打卡·奖励积分好礼</text>
			</view>
			<view class="c_btn" @click="tocheckin('/pages_C/carOwner/tourismcheckin')">
				<text>去打卡</text>
			</view>
		</view>

		<view class="s_card">
			<view class="card_title">
				<image class="title_bg" :src="`${imgUrl}static/cartourism_subnav_bg.png`" mode=""></image>
				<image class="title_icon" :src="`${imgUrl}static/cartourism_subnav_icon.png`" mode=""></image>
				<text>趣研学</text>
				<text @click="toNav('/pages_C/carOwner/selfDrive?id='+1)">更多</text>
				<uni-icons type="right" color="#ffffff" size="10"></uni-icons>
			</view>
			<swiper class="c_sw" style="min-height: 600rpx;" indicatorActiveColor="#628F2F" :indicator-dots="true" circular :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item,index) in amusingList" :key="index">
					<view class="card_box" @click="handleRegistration(item)">
						<image class="card_img" :src="item.imagesContraction" mode=""></image>
						<view class="card_name">{{item.name}}</view>
						<view class="card_tag" v-if="item.spotTag">
							<!-- 核心修改：标签容器增加 tag-wrap 类 -->
							<view class="tag-wrap" style="overflow: hidden;height: 42rpx;">
								<text v-for="(tag, index) in (item.spotTag || '').split(',').filter(tag => tag.trim())" :key="index">{{ tag }}</text>
							</view>
							<text>{{item.distance}}km</text>
						</view>
						<view class="card_line"></view>
						<view class="card_add">
							<uni-icons type="location-filled" color="#979797" size="14"></uni-icons>
							<text>{{item.province}}{{item.city}}</text>
							<view class="card_btn btnOver" v-if="item.busStatus == '11'||item.busStatus == '13'" >{{item.busStatus == '11'?'报名未开始':'报名已结束'}}</view>
							<view class="card_btn" v-else >立即报名</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="sub_nav">
			<view class="sub_line"></view>
			<text>趣旅行</text>
			<text @click="toNav('/pages_C/carOwner/selfDrive')">更多</text>
			<uni-icons type="right" color="#979797" size="14"></uni-icons>
		</view>

		<view class="c_sw" v-for="(item,index) in playSxList" :key="index" >
			<view class="card_box" @click="handleRegistration(item)">
				<image class="card_img" :src="item.imagesContraction" mode=""></image>
				<view class="card_name">{{item.name}}</view>
				<view class="card_tag" v-if="item.spotTag">
					<!-- 核心修改：标签容器增加 tag-wrap 类 -->
					<view class="tag-wrap">
						<text v-for="(tag, index) in (item.spotTag || '').split(',').filter(tag => tag.trim())" :key="index">{{ tag }}</text>
					</view>
					<text>{{item.distance}}km</text>
				</view>
				<view class="card_line"></view>
				<view class="card_add">
					<uni-icons type="location-filled" color="#979797" size="14"></uni-icons>
					<text>{{item.fullAddress}}</text>
					<view class="card_btn btnOver" v-if="item.busStatus == '11'||item.busStatus == '13'" >{{item.busStatus == '11'?'报名未开始':'报名已结束'}}</view>
					<view class="card_btn" v-else >立即报名</view>
				</view>
			</view>
		</view>
		<PageDurationTracker pageName="车主节" />
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, computed } from 'vue'; // 补充导入 computed
	import { onLoad, onReady } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { getByUserIdAndVehicleAll } from '@/api/user';
	import { toNav, toRec,toBack } from '@/utils/route';
	import { roadTripPageList } from '@/api/carOwner';
	import { toast ,debounce} from '@/utils/common';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const pageNum = ref(1); // 当前页码
	const pageSize = ref(10); // 每页条数
	const amusingList=ref([])
	const playSxList=ref([])
	const tocheckin = (url) => {
		if(carNumberList.value.length == 0) return toast('请先绑定车辆')
		toNav(url);
	};

	const handleRegistration = (item) => {
		console.log('-0-000-0-0-0--=-=',item);
		toNav('/pages_C/carOwner/carDetails?id='+item.id);
	}
	const roadTripPageListFun = async () => {
		let lat = uni.getStorageSync('address').lat;
		let lng = uni.getStorageSync('address').lng;
		let params = {
			pageNum: pageNum.value,
			pageSize: 5,
			longitude:lng,
			latitude:lat,
			typeOne: 10
		};
		try {
			const res = await roadTripPageList(params)
			if (res.code == 200) {
				console.log('-0-0-0-0',res);
				amusingList.value = res.data.list
			}
		} catch (error) {

		}
	};
	const roadTripPageListFunw = async () => {
		let lat = uni.getStorageSync('address').lat;
		let lng = uni.getStorageSync('address').lng;
		let params = {
			pageNum: pageNum.value,
			pageSize: 2,
			longitude:lng,
			latitude:lat,

		};
		try {
			const res = await roadTripPageList(params)
			if (res.code == 200) {
	          playSxList.value=res.data.list
			}
		} catch (error) {
	
		}
	};
	const carNumberList = ref([]);
	// 查询车辆列表
	const getcarList = async () => {
		const userId = uni.getStorageSync('userInfo')?.id;
		if (!userId) return;
		const params = {
			userId: userId,
		};
		const res : any = await getByUserIdAndVehicleAll(params);
		carNumberList.value = res.data;
		
	};
	onLoad(()=>{
		getcarList()
		roadTripPageListFun()
		roadTripPageListFunw()
	})
</script>

<style lang="scss" scoped>
	view,
	text {
		box-sizing: border-box;
	}

	.tourism_page {
		width: 750rpx;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;

		.tourism_img {
			width: 750rpx;
			height: 658rpx;
			border-radius: 0rpx 0rpx 32rpx 32rpx;
		}

		.clockin_box {
			width: 750rpx;
			height: 189rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 22rpx;
			padding-right: 35rpx;
			margin-top: -92rpx;
			margin-bottom: 30rpx;
			z-index: 10;
			position: relative;

			.c_bg {
				width: 750rpx;
				height: 189rpx;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}

			.c_icon {
				width: 159rpx;
				height: 144rpx;
			}

			.c_text {
				flex: 1 0;
				width: 0;
				height: 159rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;

				text:nth-child(1) {
					font-weight: 700;
					font-size: 36rpx;
					color: #3d3d3d;
					margin-bottom: 4rpx;
				}

				text:nth-child(2) {
					font-weight: 500;
					font-size: 24rpx;
					color: #3d3d3d;
				}
			}

			.c_btn {
				width: 108rpx;
				height: 108rpx;
				background: linear-gradient(180deg, #82d070 0%, #65d486 100%);
				box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(208, 208, 208, 0.5), inset 0rpx 22rpx 15rpx 0rpx rgba(0, 0, 0, 0.05), inset 0rpx -2rpx 10rpx 0rpx #ffffff;
				border: 2rpx solid rgba(253, 253, 253, 0.8);
				text-align: center;
				line-height: 108rpx;
				border-radius: 50%;

				text {
					font-weight: 500;
					font-size: 28rpx;
					color: #ffffff;
				}
			}
		}

		.c_sw {
			width: 721rpx;
			min-height: 568rpx;
			background: #ffffff;
			box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
			border-radius: 0rpx 32rpx 32rpx 32rpx;
			margin: 15rpx auto;

			.card_box {
				width: 721rpx;
				padding: 17rpx 20rpx;
				box-sizing: border-box;

				.card_img {
					width: 100%;
					height: 300rpx;
					border-radius: 12rpx 12rpx 12rpx 12rpx;
					margin-bottom: 18rpx;
				}

				.card_name {
					width: 100%;
					font-weight: 700;
					font-size: 30rpx;
					color: #333333;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-bottom: 24rpx;
				}

				.card_tag {
					width: 100%;
					display: flex;
					align-items: flex-start; // 修改为顶部对齐，适配换行
					justify-content: space-between;
					margin-bottom: 30rpx;
					
					// 核心新增样式：标签自动换行容器
					.tag-wrap {
						width: 80%;
						display: flex;
						flex-wrap: wrap; // 开启自动换行
						align-items: center;
						gap: 12rpx 12rpx; // 行列间距（替代column-gap）
						row-gap: 10rpx; // 行间距
						
						text {
							display: inline-block;
							padding:4rpx 10rpx;
							border-radius: 2rpx;
							border: 1rpx solid var(--primary-color);
							font-weight: 400;
							font-size: 20rpx;
							color: var(--primary-color);
							text-align: center;
							// 可选：限制标签最大宽度，防止单个标签过长
							max-width: 100%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}

					>text:nth-child(2) {
						font-weight: 400;
						font-size: 24rpx;
						color: #909090;
						// 确保距离文字垂直居中
						margin-top: 4rpx;
					}
				}

				.card_line {
					width: 100%;
					height: 2rpx;
					background-color: #d8d8d8;
					margin-bottom: 16rpx;
				}

				.card_add {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;

					text:nth-child(2) {
						flex: 1 0;
						width: 0;
						font-weight: 400;
						font-size: 22rpx;
						color: #7f7f7f;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						margin: 0 20rpx 0 10rpx;
					}
					
					.card_btn {
						min-width: 156rpx;
						height: 56rpx;
						background: var(--but-color-line);
						border-radius: 200rpx;
						text-align: center;
						line-height: 56rpx;
						font-weight: 500;
						font-size: 28rpx;
						color: #ffffff;
						padding: 0 16rpx;
					}
					.btnOver {
					  background: #EDEDED !important;
					  color: #999999 !important;
					  font-weight: normal !important;
					}
				}
			}
		}

		.s_card {
			width: 721rpx;
			margin-bottom: 32rpx;
            
			.card_title {
				width: 358rpx;
				height: 54rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 67rpx 0 20rpx;
				position: relative;

				.title_bg {
					width: 358rpx;
					height: 54rpx;
					position: absolute;
					top: 0;
					left: 0;
					z-index: -1;
				}

				.title_icon {
					width: 40rpx;
					height: 30rpx;
					margin-right: 17rpx;
				}

				text:nth-child(3) {
					flex: 1 0;
					font-weight: 400;
					font-size: 28rpx;
					color: #ffffff;
				}

				text:nth-child(4) {
					font-weight: 400;
					font-size: 22rpx;
					color: #ffffff;
				}
			}

			.c_sw {
				margin-bottom: 0;
			}
		}

		.sub_nav {
			width: 721rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 19rpx;

			.sub_line {
				width: 6rpx;
				height: 36rpx;
				background: #628f2f;
				border-radius: 0rpx 4rpx 4rpx 0rpx;
				margin-right: 18rpx;
			}

			text:nth-child(2) {
				flex: 1 0;
				font-weight: 700;
				font-size: 34rpx;
				color: #333333;
			}

			text:nth-child(3) {
				font-weight: 400;
				font-size: 26rpx;
				color: #979797;
			}
		}
	}
</style>