<template>
	<view class="container">
		<cos-header title='优惠券' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100"></cos-header>
		<view class="coupon-page" :style="{ paddingTop: navBarHeight + 'px' }">
			<!-- 选项卡 -->
			<view class="tabs-card flex ali-cen just-sb">
				<view v-for="(item, index) in tabList" :key="index" class="tabs-item flex"
					:class="{ active: currentTab ==item.num }" @click="handleTabChange(item.num)">
					<view class="tab-badge">{{ item.name }}
					<text v-if="item.num=='01'">({{cardUntapped}})</text>
					<text v-if="item.num=='02'">({{cardUsed}})</text>
					<text v-if="item.num=='03'">({{cardExpire}})</text>
					</view>
				</view>
			</view>

			<!-- 优惠券列表 -->
			<scroll-view class="coupon-list" scroll-y>
				<!-- 未使用优惠券 -->
				<template v-if="currentTab === '01'">
					<!-- 20元优惠券 -->
					<view class="coupon-card" :border="false" margin="15px 0" :showHead="false" :showFoot="false"
						v-for="(item,index) in couponData" :key="index">
						<view class="coupon-content" slot="body">
							<view class="coupon-left r-bg">
								<view class="coupon-amount">
									<text class="currency">¥</text>
									<text class="number">20</text>
								</view>
								<view class="coupon-condition">满200可用</view>
								<view class="coupon-icon-r">优惠券</view>
							</view>
							<view class="coupon-right">
								<view class="flex just-sb flex-col">
									<view class="coupon-title">{{item.name}}</view>
									<view class="coupon-expiry">{{item.dateEnd}} 到期</view>
									<view class="coupon-instruction" @click="toggleInstruction(index)">
										<text class="m-r-15">使用说明</text>
										<u-icon :name="showInstruction[0] ? 'arrow-up' : 'arrow-down'" size="14"
											color="#666"></u-icon>
									</view>
								</view>
								<view class="flex just-sb ali-cen">
									<view class="use-btn" @click="handleUseCoupon">去使用</view>
								</view>
							</view>
						</view>
						<view class="coupon-footer" slot="foot" v-if="showInstruction[index]">
							<view class="instruction-content">
								<text>{{item.description}}</text>
							</view>
						</view>
					</view>
				</template>

				<!-- 已使用优惠券 -->
				<template v-if="currentTab === '02'">
					<view class="couponData"  v-if="couponData.length==0">
						<u-empty mode="list" text="暂无已使用优惠券"></u-empty>
					</view>
					<!-- 兑换券 -->
					<view class="coupon-card" :border="false" margin="15px 0" :showHead="false" :showFoot="false">
						<view class="coupon-card" :border="false" margin="15px 0" :showHead="false" :showFoot="false"
						v-for="(item,index) in couponData" :key="index">
						<view class="coupon-content" slot="body">
							<view class="coupon-left r-bg">
								<view class="coupon-amount">
									<text class="currency">¥</text>
									<text class="number">20</text>
								</view>
								<view class="coupon-condition">满200可用</view>
								<view class="coupon-icon-r">优惠券</view>
							</view>
							<view class="coupon-right">
								<view class="flex just-sb flex-col">
									<view class="coupon-title">{{item.name}}</view>
									<view class="coupon-expiry">{{item.dateEnd}} 到期</view>
									<view class="coupon-instruction" @click="toggleInstruction(index)">
										<text class="m-r-15">使用说明</text>
										<u-icon :name="showInstruction[0] ? 'arrow-up' : 'arrow-down'" size="14"
											color="#666"></u-icon>
									</view>
								</view>
								<view class="flex just-sb ali-cen">
									<view class="use-btn" style="background: #ccc;">已使用</view>
								</view>
							</view>
						</view>
						<view class="coupon-footer" slot="foot" v-if="showInstruction[index]">
							<view class="instruction-content">
								<text>{{item.description}}</text>
							</view>
						</view>
					</view>
					</view>
				</template>

				<!-- 已过期优惠券 -->
				<template v-if="currentTab === '03'">
					
					<view class="couponData" v-if="couponData.length==0">
						<u-empty mode="list" text="暂无已使用优惠券"></u-empty>
					</view>
					<!-- 兑换券 -->
					<view class="coupon-card" :border="false" margin="15px 0" :showHead="false" :showFoot="false">
						<view class="coupon-card" :border="false" margin="15px 0" :showHead="false" :showFoot="false"
						v-for="(item,index) in couponData" :key="index">
						<view class="coupon-content" slot="body">
							<view class="coupon-left r-bg">
								<view class="coupon-amount">
									<text class="currency">¥</text>
									<text class="number">20</text>
								</view>
								<view class="coupon-condition">满200可用</view>
								<view class="coupon-icon-r">优惠券</view>
							</view>
							<view class="coupon-right">
								<view class="flex just-sb flex-col">
									<view class="coupon-title">{{item.name}}</view>
									<view class="coupon-expiry">{{item.dateEnd}} 到期</view>
									<view class="coupon-instruction" @click="toggleInstruction(index)">
										<text class="m-r-15">使用说明</text>
										<u-icon :name="showInstruction[0] ? 'arrow-up' : 'arrow-down'" size="14"
											color="#666"></u-icon>
									</view>
								</view>
								<view class="flex just-sb ali-cen">
									<!-- <view class="use-btn" @click="handleUseCoupon">去使用</view> -->
								</view>
							</view>
						</view>
						<view class="coupon-footer" slot="foot" v-if="showInstruction[index]">
							<view class="instruction-content">
								<text>{{item.description}}</text>
							</view>
						</view>
					</view>
					</view>
				</template>
			</scroll-view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import theme from '@/utils/theme'
	import { ref, onMounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	import { imgUrl } from '../../config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { getCardList, getCardListCount } from '@/api/individual';
	const backgroundColor = ref<string>("#FFFFFF");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const couponData = ref<any>([]);
	const cardExpire = ref<any>('');
	const cardUntapped = ref<any>('');
	const cardUsed = ref<any>('');
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});

	// id: "path",
	// amount: 20
	// code: "1"
	// couponId: "1"
	// couponStatus: "01"
	// dateEnd: "2025-09-03 18:11:09"
	// dateStart: "2025-09-18 18:11:13"
	// description: "指定商家:秦岭服务区酒店，限部分平台使用，商城指定实物类订单(特例商品除外)。"
	// id: "path"
	// name: "直营店购物优惠卷"
	// path: "11"
	// type: "01"
	// userId: "M20250901066334"
	const currentTab = ref<string>('01');
	const showInstruction = ref([false, false]);
	const pagination = reactive({
		pages: 1,
		pageSize: 10
	})
	const tabList = ref([
		{ name: '未使用', num: '01' },
		{ name: '已使用', num: '02' },
		{ name: '已过期', num: '03' }
	]);

	// 切换选项卡
	const handleTabChange = (index : string) => {
		currentTab.value = index;
		getAddresEchoFun()
	};

	// 切换使用说明显示
	const toggleInstruction = (index : number) => {
		console.log(index)
		showInstruction.value[index] = !showInstruction.value[index];
	};

	// 使用优惠券
	const handleUseCoupon = () => {
		uni.showToast({ title: '跳转使用优惠券', icon: 'none' });
	};

	const getAddresEchoFun = async () => {
		let params = {
			userId: uni.getStorageSync('userInfo').id,
			couponStatus: currentTab.value,
			pages: 1,
			pageSize: 10
		}
		const res = await getCardList(params)
		if (res?.code == '0') {
			let data = res.clazz.records
			couponData.value = data
		}
	}
	const getCardListCountFun = async () => {
		let params = {
			userId: uni.getStorageSync('userInfo').id,
		}
		const res = await getCardListCount(params)
		if (res?.code == '0') {
			cardExpire.value=res.clazz.cardExpire
			cardUntapped.value=res.clazz.cardUntapped
			cardUsed.value=res.clazz.cardUsed
		}
	}
	// 生命周期
	onLoad(() => {
		getAddresEchoFun()
		getCardListCountFun()
	})
</script>

<style lang="scss" scoped>
	.coupon-page {
		height: 100vh;
		background-color: #F1EFEC;

		.tabs-card {
			background: #FFFFFF;
			padding: 25rpx 100rpx;

			.tabs-item {
				position: relative;
			}

			.active {
				color: $color;
			}

			.active::after {
				content: '';
				position: absolute;
				width: 66rpx;
				height: 5rpx;
				background-color: $color;
				left: 50%;
				bottom: -25rpx;
				transform: translateX(-50%);
			}
		}

		.coupon-list {
			height: calc(100vh - 44px);

			.coupon-card {
				background: #F5F5F5;
				border-radius: 20rpx;
				overflow: hidden;
				margin: 30rpx 32rpx;

				.coupon-content {
					display: flex;
					margin-bottom: 30rpx;

					.r-bg {
						background: linear-gradient(-26deg, #FF2E18, #FF7C31);
					}

					.w-bg {
						background: #fff;
					}

					.coupon-left {
						width: 100px;
						border-radius: 20rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						color: #fff;
						padding: 20rpx 0;
						position: relative;

						.pro-img {
							width: 136rpx;
							height: 136rpx;
							border-radius: 16rpx;
						}

						.coupon-icon {
							position: absolute;
							top: 0;
							left: 0;
							width: 100rpx;
							height: 36rpx;
							background: $bgLgColor;
							border-radius: 20rpx 0rpx 20rpx 0;
							font-weight: 500;
							font-size: 22rpx;
							color: #FFFFFF;
							text-align: center;
							line-height: 36rpx;
						}

						.coupon-icon-r {
							position: absolute;
							top: 0;
							left: 0;
							width: 100rpx;
							height: 36rpx;
							background: $color;
							border-radius: 20rpx 0rpx 20rpx 0;
							font-weight: 500;
							font-size: 22rpx;
							color: #FFFFFF;
							text-align: center;
							line-height: 36rpx;
						}

						.coupon-amount {
							display: flex;
							align-items: baseline;

							.currency {
								font-size: 16px;
								margin-right: 2px;
							}

							.number {
								font-size: 28px;
								font-weight: bold;
							}

							.percent {
								font-size: 16px;
								margin-left: 2px;
							}
						}

						.coupon-condition {
							font-size: 12px;
							margin-top: 5px;
						}

						.coupon-type {
							font-size: 14px;
							margin-top: 5px;
						}
					}

					.coupon-right {
						height: 175rpx;
						flex: 1;
						padding: 30rpx 24rpx 25rpx 30rpx;
						display: flex;
						justify-content: space-between;
						box-sizing: border-box;
						background: #FFFFFF;

						.coupon-title {
							font-weight: bold;
							font-size: 28rpx;
							color: #030303;
						}

						.coupon-expiry,
						.coupon-merchant,
						.coupon-desc {
							font-weight: 500;
							font-size: 24rpx;
							color: #999999;
						}



						.coupon-instruction {
							display: flex;
							align-items: center;
							color: #999;
							font-size: 12px;

							.u-icon {
								margin-left: 5px;
							}
						}
					}

					.use-btn {
						width: 116rpx;
						height: 50rpx;
						background: linear-gradient(-26deg, #FF2E18, #FF7C31);
						border-radius: 25rpx;
						font-weight: 500;
						font-size: 24rpx;
						color: #FFFFFF;
						text-align: center;
						line-height: 50rpx;
					}

					.use-btn-y {
						width: 116rpx;
						height: 50rpx;
						background: $bgLgColor;
						border-radius: 25rpx;
						font-weight: 500;
						font-size: 24rpx;
						color: #FFFFFF;
						text-align: center;
						line-height: 50rpx;
					}
				}

				.coupon-footer {
					background: #F5F5F5;
					border: 2px solid #FFFFFF;
					padding: 10px 15px;
					border-top: 1px dashed #eee;

					.instruction-content {
						font-weight: 500;
						font-size: 24rpx;
						color: #333333;
						line-height: 1.5;
					}
				}
			}
		}
	}

	.couponData {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-40%, -50%);
	}
</style>