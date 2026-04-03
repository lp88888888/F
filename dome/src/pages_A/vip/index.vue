<template>
	<view class="container">
		<cos-header title='' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="80"></cos-header>

		<view class="header" :style="{ paddingTop: navBarHeight + 'px' }">
			<view class="vip-card flex flex-col"
				:style="{ background: 'url(' + imgUrl + 'bg_hy.png) no-repeat', backgroundSize: '100% 100%' }">
				<view class="title">{{ memberInfo.levelName }}</view>
				<text class="fs-26 fw-500"></text>
			</view>
			<view class="vip-level flex colf"
				:style="{ background: 'url(' + imgUrl + 'mine/line.png) no-repeat', backgroundSize: '100%', backgroundPosition: 'center center' }">
				<view class="flex flex-col ali-cen m-t-10">
					<view class="actived" v-if="memberInfo.levelCode=='LV1'"
						:style="{ background: 'url(' + imgUrl + 'mine/level.png) no-repeat', backgroundSize: '100% 100%' }">
						当前等级</view>
					<view class="circle"></view>
					<text class="v-active">V1</text>
				</view>
				<view class="flex flex-col ali-cen">
					<view class="actived" v-if="memberInfo.levelCode=='LV2'"
						:style="{ background: 'url(' + imgUrl + 'mine/level.png) no-repeat', backgroundSize: '100% 100%' }">
						当前等级</view>
					<view class="vip-tit" v-else></view>
					<view class="circle" style="margin-top: 40rpx;"></view>
					<text class="v-active">V2</text>
				</view>
				<view class="flex flex-col ali-cen m-t-10">
					<view class="actived" v-if="memberInfo.levelCode=='LV3'"
						:style="{ background: 'url(' + imgUrl + 'mine/level.png) no-repeat', backgroundSize: '100% 100%' }">
						当前等级</view>
					<view class="vip-tit" v-else></view>
					<view class="circle"></view>
					<text class="v-active">V3</text>
				</view>
				<view class="flex flex-col ali-cen">
					<view class="actived" v-if="memberInfo.levelCode=='LV4'" 
						:style="{ background: 'url(' + imgUrl + 'mine/level.png) no-repeat', backgroundSize: '100% 100%' }">
						当前等级</view>
					<view class="vip-tit" v-else></view>
					<view class="circle"></view>
					<text class="v-active">V4</text>
				</view>
			</view>
		</view>

		<view class="content">
			<view class="equity-card">
				<view class="flex ali-cen just-sb">
					<view class="card-title fs-34 fw-600">
						可享
						<text class="nine fs-60">{{ memberInfo.memRightsList?.length || 0 }}</text> <!-- 增加空值保护 -->
						项权益
					</view>
					<view class="flex ali-cen fs-24 col6" @click="toJump('/pages_A/benefit/index')">
						<text>全部</text>
						<image class="icon-32" :src="imgUrl + 'more.png'" mode=""></image>
					</view>
				</view>

				<view class="benefit-container">
					<!-- 增加空值判断，避免数组为空时循环 -->
					<view v-for="(item, index) in memberInfo.memRightsList" :key="index" class="benefit-item"
						@click="handleItemClick(item)"> <!-- 优化：直接传item，而非index -->
						<image class="benefit-icon" :src="item.pic" mode="aspectFit" />
						<text class="benefit-text">{{ item.name }}</text>
					</view>
				</view>
			</view>

			<view class="banner-card p-20" @click="dcPath()">
				<image class="banner-img" :src="imgUrl + 'mine/cxyy.png'"></image>
			</view>

			<view class="active-card">
				<view class="fs-34 fw-600">活动与福利</view>
				<view class="flex m-t-30 just-sb">
					<view class="jfsc" @click="toNav('/pages_B/directRetail/index')">
						服务区零售
						<image class="jfsc-img" :src="imgUrl + 'mine/jfsc.png'"></image>
					</view>
					<view class="card-right flex flex-col just-sb">
						<view class="jqmp" @click="toNav('/pages_B/scenicSpotTicket/index')">
							景区门票
							<image class="jqmp-img" :src="imgUrl + 'mine/jqmp.png'"></image>
						</view>
						<view class="card-bottom flex just-sb">
							<view class="jdzs" @click="toNav('/pages_B/hotel/hotelist')">
								酒店住宿
								<image class="jdzs-img" :src="imgUrl + 'mine/jdzs.png'"></image>
							</view>
							<view class="cyms" @click="toNav('/pages_B/dining/index')">
								餐饮美食
								<image class="cyms-img" :src="imgUrl + 'mine/cyms.png'"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<sate-layer ref="sateLayerRef"></sate-layer>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onShow,onLoad } from '@dcloudio/uni-app'
	import { imgUrl } from '../../config';
	import CosHeader from '@/components/customNavBar/index.vue';
	// 修正2：引入SateLayer组件（请替换为实际路径）
	import SateLayer from '@/components/SateLayer/index.vue'; // 关键：确保组件正确引入
	import { details, findAll } from '@/api/member';
	import { toNav } from '@/utils/route';

	// 定义类型，增加类型约束（优化）
	interface MemberInfo {
		levelName: string;
		levelCode: string;
		memRightsList: Array<{
			pic: string;
			name: string;
			// 其他字段
		}>;
		// 其他字段
	}

	// 初始化数据时赋予默认值，避免undefined（关键）
	const memberInfo = ref<MemberInfo>({
		levelName: '',
		levelCode: '',
		memRightsList: []
	});
	const backgroundColor = ref<string>('#1C1D23');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);

	// 修正3：指定ref的类型，避免null类型问题（TS优化）
	const sateLayerRef = ref<InstanceType<typeof SateLayer> | null>(null);

	// 原benefitList未使用，可保留或删除
	interface BenefitItem {
		name: string;
		icon: string;
	}
	const benefitList = ref<BenefitItem[]>([
		{ name: '加气优惠', icon: imgUrl + 'mine/hy_jqyh.png' },
		{ name: '轮胎补气券', icon: imgUrl + 'mine/hy_ltbq.png' },
		{ name: '审车优惠', icon: imgUrl + 'mine/hy_scyh.png' },
		{ name: '洗车券', icon: imgUrl + 'mine/hy_xc.png' },
		{ name: '租车优惠', icon: imgUrl + 'mine/hy_zc.png' },
		{ name: '商城优惠', icon: imgUrl + 'mine/hy_scyh.png' },
		{ name: '基础维修优惠', icon: imgUrl + 'mine/hy_jcwx.png' }
	]);

	// 修正4：优化接口请求逻辑，避免重复赋值memberInfo
	const initData = async () => {
		try {
			// 并行请求（优化性能）
			const [detailsRes, findAllRes] = await Promise.all([
				details(),
				findAll({ levelType: '1' })
			]);
			// 合并数据（根据实际业务逻辑调整，避免覆盖）
			memberInfo.value = {
				...detailsRes.data,
				...findAllRes.data
			};
		} catch (error) {
			console.error('数据初始化失败：', error);
		}
	};

	const handleItemClick = (item: any) => {
		// 处理点击逻辑，参数改为item更直观
		console.log('点击了:', item.name);
		// 可添加跳转等逻辑
	};

	// 修正5：调用组件方法前增加空值判断（核心解决null问题）
	const dcPath = () => {
		if (!sateLayerRef.value) {
			console.warn('SateLayer组件未挂载');
			return;
		}
		// 调用组件的open方法
		sateLayerRef.value.open({
			address: "",
			appId: "wx19e20461b663b96c",
			appSrcId: "",
			enterprise: "的盟天下(延安)科技有限公司",
			name: "网约车",
			state: "01",
			status: "01",
		});
	};

	const toJump = (url: string) => {
		uni.navigateTo({
			url: url as string
		});
	};

	// 生命周期调整：onLoad在onMounted前执行，适合初始化数据
	onLoad(() => {
		// 获取系统信息，计算导航栏高度
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44;
	});

	onMounted(() => {
		initData(); // 统一初始化数据
	});

	onShow(() => {
		// 如需每次显示页面刷新数据，可在此调用initData()
	});
</script>

<style scoped lang="scss">
	// 保留原有样式，可根据需要优化
	.container {
		background: #1C1D23;
	}

	.header {
		padding: 0 32rpx 40rpx;

		.vip-card {
			background-size: 100% 100%;
			height: 200rpx;
			padding: 40rpx;
			box-sizing: border-box;

			text {
				color: #63300E;
			}
		}

		.vip-level {
			justify-content: space-around;
			position: relative;
			font-size: 20rpx;

			.vip-tit {
				width: 112rpx;
				height: 46rpx;
				text-align: center;
				line-height: 46rpx;
				font-weight: 500;
				font-size: 24rpx;
				color: #FFFFFF;
			}

			.actived {
				width: 112rpx;
				height: 46rpx;
				border-radius: 15rpx;
				text-align: center;
				line-height: 46rpx;
				font-weight: 500;
				font-size: 20rpx;
				color: #FFFFFF;
			}

			.circle {
				width: 18rpx;
				height: 18rpx;
				background: #1C1D23;
				border-radius: 50%;
				border: 2rpx solid #FFFFFF;
				margin: 28rpx 0 20rpx;
				text-align: center;
				line-height: 18rpx;
			}

			.v {
				font-size: 28rpx;
				color: #FFFFFF;
				font-style: italic;
				opacity: 0.5;
			}

			.v-active {
				font-weight: 600;
				font-size: 28rpx;
				color: #FFFFFF;
			}

			.cir-active {
				background: $color;
			}
		}
	}

	.content {
		width: 750rpx;
		height: 1342rpx;
		background: #F1EFEC;
		border-radius: 26rpx 26rpx 0 0;
		padding-top: 30rpx;

		.equity-card {
			background: #FFFFFF;
			border-radius: 20rpx;
			margin: 0 32rpx 30rpx;
			padding: 30rpx 30rpx 0;

			.card-title {
				margin-top: -22rpx;
			}

			.nine {
				color: $color;
			}

			.benefit-container {
				display: flex;
				flex-wrap: wrap;
				padding: 30rpx 0 10rpx;
				background-color: #fff;
				justify-content: flex-start;
			}

			.benefit-item {
				width: 25%;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-bottom: 40rpx;
			}

			.benefit-icon {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 10rpx;
			}

			.benefit-text {
				font-size: 24rpx;
				color: #333;
				text-align: center;
			}
		}

		.banner-card {
			background: #FFFFFF;
			border-radius: 26rpx;
			margin: 0 32rpx;

			.banner-img {
				width: 646rpx;
				height: 170rpx;
				background: #FEEED2;
				border-radius: 16rpx;
			}
		}

		.active-card {
			margin: 30rpx 32rpx 0;
			background: #FFFFFF;
			border-radius: 20rpx;
			padding: 36rpx 20rpx;

			.jfsc-img {
				width: 174rpx;
				height: 202rpx;
				position: absolute;
				bottom: 40rpx;
				left: 50%;
				transform: translateX(-50%);
			}

			.jqmp-img {
				width: 130rpx;
				height: 102rpx;
				position: absolute;
				right: 30rpx;
				top: 50%;
				transform: translateY(-50%);
			}

			.jdzs-img {
				width: 88rpx;
				height: 79rpx;
				position: absolute;
				bottom: 15rpx;
				left: 50%;
				transform: translateX(-50%);
			}

			.cyms-img {
				width: 92rpx;
				height: 76rpx;
				position: absolute;
				bottom: 15rpx;
				left: 50%;
				transform: translateX(-50%);
			}

			.jfsc {
				width: 266rpx;
				height: 362rpx;
				background: linear-gradient(-40deg, #FEF2E0, #FFF6EE);
				border-radius: 20rpx;
				padding: 40rpx 30rpx;
				box-sizing: border-box;
				position: relative;
			}

			.jqmp {
				width: 360rpx;
				height: 172rpx;
				background: linear-gradient(-40deg, #EEECFF, #F4F3FF);
				border-radius: 20rpx;
				box-sizing: border-box;
				line-height: 172rpx;
				padding-left: 30rpx;
				position: relative;
			}

			.jdzs {
				width: 170rpx;
				height: 170rpx;
				background: linear-gradient(-40deg, #E5F4FF, #F3FAFF);
				border-radius: 20rpx;
				box-sizing: border-box;
				text-align: center;
				padding-top: 30rpx;
				position: relative;
			}

			.cyms {
				width: 170rpx;
				height: 170rpx;
				background: linear-gradient(-40deg, #FEECEB, #FFF5F4);
				border-radius: 20rpx;
				box-sizing: border-box;
				text-align: center;
				padding-top: 30rpx;
				position: relative;
			}
		}
	}
	.title{
		font-size: 36rpx;
		    font-weight: 700;
		    color: #556a8b;
		    margin: 12rpx ;
	}
</style>