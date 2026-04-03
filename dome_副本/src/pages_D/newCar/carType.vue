<template>
	<view class="app-container" :data-theme="pageTheme" >
		<view class="header">
			<view class="topView">
				<view class="scroView">
					<view class="scroView-label">价格：</view>
					<scroll-view class="scroView-item" scroll-x="true">
						<view :class="['scroView-item-text',seleIndex1 == item.name?'textActive':'']"
							v-for="(item,index) in opticon1" :key="index" @click="scroClick(item,1)">{{item.name}}
						</view>
					</scroll-view>
				</view>
				<up-gap height="15"></up-gap>
				<view class="scroView">
					<view class="scroView-label">类型：</view>
					<scroll-view class="scroView-item" scroll-x="true">
						<view :class="['scroView-item-text',seleIndex2 == item.name?'textActive':'']"
							v-for="(item,index) in opticon2" :key="index" @click="scroClick(item,2)">{{item.name}}
						</view>
					</scroll-view>
				</view>
				<up-gap height="15"></up-gap>
				<view class="scroView">
					<view class="scroView-label">能源：</view>
					<scroll-view class="scroView-item" scroll-x="true">
						<view :class="['scroView-item-text',seleIndex3 == item.name?'textActive':'']"
							v-for="(item,index) in opticon3" :key="index" @click="scroClick(item,3)">{{item.name}}
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="rxView">
				<!-- <up-icon name="bell-fill" color="#FF9500"></up-icon> -->
				<up-icon :name="imgUrl+'static/new-car-logo-icon.png'" width="26rpx" height="36rpx"></up-icon>
				<text>根据车型热度为您展示</text>
			</view>
		</view>
		<view class="pageView">
			<CarList :list="dataList" isIcon :user='1'></CarList>
			<template v-if="!dataList.length">
				<ser-empty></ser-empty>
			</template>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
	import { selectHotNewCar } from '@/api/car';
	import CarList from './components/CarList.vue';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import { imgUrl } from '@/config';
	const opticon1 = ref([{ name: '不限', type: '' }, { name: '10万以下',type1: '', type: '10' }, { name: '10-15万', type1: '10',type: '15' }, { name: '15-20万',type1: '15',type: '20' }, { name: '20-25万',type1: '20', type: '25' }]);
	const opticon2 = ref([{ name: '全部', type: '' }, { name: '轿车', type: 'limousine' }, { name: 'SUV', type: 'suv' }, { name: 'MPV', type: 'mpv' }]);
	const opticon3 = ref([{ name: '全部', type: '' }, { name: '新能源', type: 'newenergy' }, { name: '燃油', type: 'fuel' }]);

	const seleIndex1 = ref('不限');
	const seleIndex2 = ref('全部');
	const seleIndex3 = ref('全部');
	const fuelType = ref('')
	const segment = ref('')
	const minPrice = ref('')
	const maxPrice = ref('')
	const dataList = ref([])

	const scroClick = (item, type : number) => {
		console.log(item)
		switch (type) {
			case 1:
				seleIndex1.value = item.name;
				minPrice.value = item.type1;
				maxPrice.value = item.type;
				break;
			case 2:
				seleIndex2.value = item.name;
				segment.value = item.type
				break;
			case 3:
				seleIndex3.value = item.name;
				fuelType.value = item.type
				break;
			default:
				break;
		}
		selectHotNewCarFun()
	}
	const selectHotNewCarFun = async () => {
		let params = {
			segment: segment.value,
			fuelType: fuelType.value,
			minPrice: minPrice.value,
			maxPrice: maxPrice.value,
			pageNum: 1,
			pageSize: 99
		}
		const res = await selectHotNewCar(params);
		dataList.value = res.rows
	}
	onLoad((options) => {
		if (options.type == 2) {
			if (options.name == '更多条件') {
				seleIndex2.value = '全部'
				segment.value = ''
			} else {
				seleIndex2.value = options.name
				segment.value = options.val
			}
		} else {
			seleIndex1.value = options.name
			minPrice.value = options.val1
			maxPrice.value = options.val
		}
		selectHotNewCarFun()
	})
</script>

<style lang="scss">
	

	.topView {
		width: 100%;
		padding: 20rpx 32rpx 32rpx 32rpx;
		box-sizing: border-box;
		background: #F6F5F4;
	}

	.scroView {
		width: 100%;
		height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.scroView-label {
			font-weight: 400;
			font-size: 24rpx;
			color: #333333;
		}

		.scroView-item {
			width: calc(100% - 80rpx);
			white-space: nowrap;
			display: flex;
			align-items: center;

			.scroView-item-text {
				display: inline-block;
				width: 120rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				background: rgba(225, 220, 216, 0.7);
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				margin-right: 16rpx;
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}

			.textActive {
				background: var(--label-color);
				font-weight: 700;
			}
		}
	}

	.rxView {
		width: 686rpx;
		height: 64rpx;
		padding: 0 22rpx;
		box-sizing: border-box;
		margin: 0 auto;
		display: flex;
		align-items: center;
		background: #FFF2E1;
		border-radius: 8rpx 8rpx 8rpx 8rpx;

		font-weight: 400;
		font-size: 24rpx;
		color: #333333;

		text {
			margin-left: 10rpx;
		}
	}


	.app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
		background: var(--head-color);
	}

	.header {
		position: sticky;
		top: 0;
		z-index: 10;
		/* 确保在内容上方 */
	}

	.pageView {
		padding: 24rpx 32rpx;
		box-sizing: border-box;
		flex: 1;
		/* 占据剩余全部空间 */
		overflow-y: auto;
		/* 内容超出时显示垂直滚动条 */
		padding: 20px;
	}
</style>