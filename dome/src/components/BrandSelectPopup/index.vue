<template>
	<up-popup :show="bandShow" round="20" @close="close">
		<view class="popsView">
			<view class="titleBox fl-ce-sb">
				<view style="width:44rpx;height:44rpx;">
					<up-icon v-if="pageIndex!=0" name="arrow-left" size="22" color="#333333"
						@click="pageIndex--"></up-icon>
				</view>
				<view class="titleBox-item">请选择车型</view>
				<up-icon name="close" size="22" color="#333333" @click="close"></up-icon>
			</view>
			<view class="index-list-container">
				<!-- 右侧滚动内容 -->
				<scroll-view :scroll-y="true" class="content" :scroll-into-view="scrollViewId"
					:scroll-with-animation="true" @scroll="onScroll"
					:style="{ height: '75vh'}">
					<template v-if="pageIndex==0">
						<view v-for="group in listData" :key="group.initial" :id="'anchor-' + group.initial">
							<view class="letter-title">{{ group.initial }}</view>
							<view class="item" v-for="item in group.items" :key="item.id" @click="selectItem(item,0)">
								<image :src="item.logo" style="height: 70rpx;" mode="heightFix" />
								<text>{{ item.name }}</text>
							</view>
						</view>
					</template>
					<template v-if="pageIndex==1">
						<view v-for="group in listSeries" :key="group.initial" :id="'anchor-' + group.initial">
							<view class="letter-title">{{ group.initial }}</view>
							<view class="item" v-for="item in group.items" :key="item.id" @click="selectItem(item,1)">
								<text>{{ item.name }}</text>
							</view>
						</view>
					</template>
					<template v-if="pageIndex==2">
						<view>
							<!-- <view class="letter-title">{{ group.initial }}</view> -->
							<view class="item" v-for="group in listModels" :key="group.id" @click="selectItem(group,2)">
								<text>{{ group.name }}</text>
							</view>
						</view>
					</template>
				</scroll-view>
				<!-- 左侧索引栏 -->
				<view class="index-bar" v-if="pageIndex==0">
					<!-- <view v-for="letter in letters" :key="letter" class="index-item"
						:class="{ active: activeLetter === letter }" @touchstart="onTouchStart(letter)"
						@touchmove="onTouchMove" @touchend="onTouchEnd">
						{{ letter }}
					</view> -->
					<view v-for="letter in letters" :key="letter" class="index-item"
						:class="{ active: activeLetter === letter }" @click="onClick(letter)">
						{{ letter }}
					</view>
				</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, getCurrentInstance } from "vue";
	import { toNav, toBack } from "@/utils/route";
	import { imgUrl } from "@/config";
	import { prCarBrand, prCarSeries, prCarType } from '@/api/car';
	const instance = getCurrentInstance()
	const bandShow = ref(false);
	const pageIndex = ref<number>(0); //0-品牌，1车系，2车型
	const brandName = ref<string>('');
	const seriesName = ref<string>('');
	const modelsName = ref<string>('');
	const brandId = ref<string>('');
	const seriesId = ref<string>('');
	const modelsId = ref<string>('');

	const emit = defineEmits(['change']);
	const props = defineProps({
		// brand--只选择品牌
		type: {
			type: String,
			default: ''
		}
	});
	const close = () => {
		console.log("-----");
		bandShow.value = false;
		pageIndex.value = 0;
	};
	const open = () => {
		bandShow.value = true;
		pageIndex.value = 0;
		brandName.value = '';
		seriesName.value = '';
		modelsName.value = '';
		getCarBrandList();
	}
	const selectItem = (item : any, index : number) => {
		pageIndex.value = index + 1;
		if (index == 0) {
			brandName.value = item.name
			brandId.value = item.id
			if(props.type == 'brand'){
				emit('change', {
					brandName: brandName.value,
					brandId: brandId.value,
				});
				close();
			}else{
				getCarSeriesList(item.id);
			}
			
		}
		if (index == 1) {
			seriesName.value = item.name
			seriesId.value = item.id
			getCarModelsList(item.id);
		}
		if (index == 2) {
			modelsName.value = item.name;
			modelsId.value = item.id
			emit('change', {
				brandName: brandName.value,
				brandId: brandId.value,
				seriesName: seriesName.value,
				seriesId: seriesId.value,
				modelsName: modelsName.value,
				modelsId: modelsId.value,
				models:item
			});
			close();
		}
	};
	const listModels = ref([]);

	const listSeries = ref([]);
	// 示例数据
	const listData = ref([]);

	// 所有字母索引
	const letters = computed(() => {
		return listData.value.map((group) => group.initial);
	});

	// 当前滚动到的锚点ID
	const scrollViewId = ref("");

	// 当前激活的字母
	const activeLetter = ref("A");

	// 触摸状态
	let touchStartY = 0;
	let itemHeight = 0;
	let isTouching = false;

	// 页面高度
	const windowHeight = ref(uni.getSystemInfoSync().windowHeight);

	// 计算每个索引项的高度（假设等高）
	onMounted(() => {
		getCarBrandList();
		const query = uni.createSelectorQuery().in(instance);
		query.select(".index-bar").boundingClientRect((res) => {
			if (res) {
				itemHeight = res.height / letters.value.length;
			}
		});
		query.exec();
	});

	// 滚动事件处理
	const onScroll = (e) => {
		if (isTouching) {
			isTouching = false;
			return
		};
		const scrollTop = e.detail.scrollTop;
		let currentLetter = activeLetter.value;

		// 预先计算所有锚点的位置
		const query = uni.createSelectorQuery().in(instance);

		listData.value.forEach((group, index) => {
			query.select(`#anchor-${group.letter}`).boundingClientRect((rect) => {
				if (rect && rect.top <= scrollTop + 10) {
					currentLetter = group.letter;
				}
			});
		});
		query.exec(() => {
			// 在所有查询完成后更新当前字母
			activeLetter.value = currentLetter;
		});
	};
	const onClick = (letter) => {
		isTouching = true;
		scrollViewId.value = "anchor-" + letter;
		activeLetter.value = letter;
	}
	// 索引触摸开始
	const onTouchStart = (letter) => {
		isTouching = true;
		scrollViewId.value = "anchor-" + letter;
		activeLetter.value = letter;
	};

	// 索引触摸移动
	const onTouchMove = (e) => {
		if (!isTouching) return;
		const touchY = e.touches[0].clientY;
		const barTop =
			uni.getSystemInfoSync().windowHeight / 2 - (itemHeight * letters.value.length) / 2;
		const index = Math.floor((touchY - barTop) / itemHeight);
		if (index >= 0 && index < letters.value.length) {
			const letter = letters.value[index];
			scrollViewId.value = "anchor-" + letter;
			activeLetter.value = letter;
		}
	};

	// 触摸结束
	const onTouchEnd = () => {
		isTouching = false;
	};

	defineExpose({
		open
	})

	// 获取品牌
	const getCarBrandList = async () => {
		const res = await prCarBrand();
		const groupedData : Record<string, typeof listData.value[0]> = {};
		res.rows.forEach(brand => {
			const initial = brand.initial;
			if (!groupedData[initial]) {
				groupedData[initial] = { initial, items: [] };
			}
			groupedData[initial].items.push({
				id: brand.id,
				name: brand.name,
				logo: brand.logo
			});
		});
		listData.value = Object.values(groupedData).sort((a, b) => {
			return a.initial.localeCompare(b.initial);
		});
		if (listData.value.length > 0) {
			activeLetter.value = listData.value[0].initial;
			scrollViewId.value = `anchor-${listData.value[0].initial}`;
		}
	};

	// 获取车系
	const getCarSeriesList = async (brandId : number | string) => {
		const res = await prCarSeries(brandId);
		const groupedData : Record<string, typeof listSeries.value[0]> = {};
		res.rows.forEach(series => {
			const initial = series.initial;
			if (!groupedData[initial]) {
				groupedData[initial] = { initial, items: [] };
			}
			groupedData[initial].items.push({ id: series.id, name: series.name });
		});
		listSeries.value = Object.values(groupedData).sort((a, b) => a.initial.localeCompare(b.initial));
	}

	// 获取车型
	const getCarModelsList = async (seriesId : number | string) => {
		const res = await prCarType(seriesId);
		listModels.value = res.rows;
	}
</script>

<style lang="scss" scoped>
	.popsView {

		.titleBox {
			height: 100rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
		}
	}

	.indText {
		width: 100%;
		height: 64rpx;
		line-height: 64rpx;
		// background: linear-gradient( 270deg, #F6F5F4 0%, rgba(216,216,216,0) 100%);
		background: #f6f5f4;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #3d3d3d;
		padding-left: 52rpx;
		box-sizing: border-box;
	}

	.scroll-H {
		height: 75vh;
	}

	.list-cell {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		height: 100rpx;
		// padding: 20rpx 24rpx;
		padding: 0 32rpx;
		overflow: hidden;
		font-size: 14px;
		line-height: 24px;
		background: #f8f9fb;

		.list-cell-icon {
			width: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				height: 70rpx;
			}
		}

		.list-cell-text {
			font-weight: 700;
			font-size: 28rpx;
			color: #3d3d3d;
			line-height: 28rpx;
		}
	}

	.index-list-container {
		position: relative;
		display: flex;
	}

	/* 内容区 */
	.content {
		flex: 1;
		background-color: #fff;
	}

	.letter-title {
		background-color: #f0f0f0;
		padding: 10rpx 20rpx;
		font-size: 28rpx;
		color: #666;
	}

	.item {
		padding: 20rpx;
		border-bottom: 1px solid #eee;
		font-size: 30rpx;
		display: flex;
		align-items: center;

		text {
			font-size: 28rpx;
			margin-left: 20rpx;
		}
	}

	/* 索引栏 */
	.index-bar {
		position: fixed;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 20rpx;
		padding: 10rpx 0;
	}

	.index-item {
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
	}

	.index-item.active {
		background-color: $color;
		border-radius: 50%;
	}
	
	.repair {
		color: #303133;
		font-size: 15px;
	}
</style>