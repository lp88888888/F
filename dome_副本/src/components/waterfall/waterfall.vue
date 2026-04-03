<template>
	<div class="fs-virtual-waterfall-container" :style="{ height: screenHeight + 'px' }">
		<scroll-view scroll-y="true" @scroll="handleScroll" :style="{ height: screenHeight + 'px' }">
			<div class="fs-virtual-waterfall-list" :style="contentStyle">
				<div class="fs-virtual-waterfall-item" v-for="item in renderList" :key="item.item.id"
					:style="item.style">
					<slot name="item" :item="item"></slot>
				</div>
			</div>
		</scroll-view>
	</div>
</template>

<script setup lang="ts">
	import { computed, reactive, onMounted, type CSSProperties } from 'vue';
	import type { IColumnQueue, IDataItem, IItemRect, IRenderItem, FsVirtualWaterfallRequest } from './type';
	import { debounce, rafThrottle } from './tool';

	interface IVirtualWaterFallProps {
		// 列数
		column ?: number;
		// 列表计数
		columnItemCount ?: number;
		// 请求数量
		requestSize ?: number;
		// 间距
		gap ?: number;
		// 文本高度
		textHeight ?: number;
		// 自定义样式
		customStyle ?: object;
		// 请求方法
		request ?: FsVirtualWaterfallRequest;
	}
	const props = withDefaults(defineProps<IVirtualWaterFallProps>(), {
		request: async () => ({ list: [], total: 0 }),
		gap: 20,
		column: 4,
		columnItemCount: 6,
		textHeight: 0,
		requestSize: 0,
		customStyle: async () => ({}),
	});
	// 组件宽高
	const screenHeight = (await uni.getSystemInfo()).windowHeight;
	const screenWidth = (await uni.getSystemInfo()).windowWidth;
	const emit = defineEmits<{
		finishGetList : [];
	}>();

	const dataState = reactive({
		loading: false,
		isFinish: false,
		currentPage: 1,
		total: 0,
		list: [] as IDataItem[],
	});
	const columnState = reactive({
		queue: Array(props.column)
			.fill(0)
			.map<IColumnQueue>(() => ({ list: [], height: 0 })),
		len: 0,
	});
	const scrollState = reactive({
		viewWidth: 0,
		viewHeight: 0,
		start: 0,
		get end() {
			return this.start + this.viewHeight;
		},
	});

	const contentStyle = computed(() => ({ height: `${computedHeight.value.maxHeight}px` }) as CSSProperties);
	const columnList = computed(() => columnState.queue.reduce<IRenderItem[]>((pre, { list }) => pre.concat(list), []));
	const renderList = computed(() => columnList.value.filter((i) => i.h + i.y > scrollState.start && i.y < scrollState.end));
	const computedHeight = computed(() => {
		let minIndex = 0,
			maxIndex = 0,
			minHeight = Infinity,
			maxHeight = -Infinity;
		columnState.queue.forEach(({ height }, index) => {
			if (height < minHeight) {
				minHeight = height;
				minIndex = index;
			}
			if (height > maxHeight) {
				maxHeight = height;
				maxIndex = index;
			}
		});

		return {
			minIndex,
			maxIndex,
			minHeight,
			maxHeight,
		};
	});

	const itemSizeInfo = computed(() =>
		dataState.list.reduce<Map<IDataItem['id'], IItemRect>>((pre, current) => {
			const itemWidth = Math.floor((scrollState.viewWidth - (props.column - 1) * props.gap) / props.column);
			pre.set(current.id, {
				width: itemWidth,
				height: Math.floor((itemWidth * current.height) / current.width),
			});
			return pre;
		}, new Map())
	);

	const requestSize = computed(() => props.requestSize || props.column * props.columnItemCount);

	const hasMoreData = computed(() => columnState.len < dataState.list.length);

	const loadDataList = async () => {
		if (dataState.isFinish) return;
		dataState.loading = true;
		const { list, total } = await props.request(dataState.currentPage++, requestSize.value);
		if (!list.length) {
			dataState.isFinish = true;
			emit('finishGetList');
			return;
		}
		dataState.list.push(...Object.freeze(list));
		dataState.total = total;
		dataState.loading = false;
	};

	const addInQueue = (size = props.column) => {
		for (let i = 0; i < size; i++) {
			if (!hasMoreData.value) return;
			const minIndex = computedHeight.value.minIndex;
			const currentColumn = columnState.queue[minIndex];
			const before = currentColumn.list[currentColumn.list.length - 1] || null;
			const dataItem = dataState.list[columnState.len];
			const item = generatorItem(dataItem, before, minIndex);
			currentColumn.list.push(item);
			currentColumn.height += item.h;
			columnState.len++;
		}
	};

	const assignProperties = (source : object, target : object) : void => {
		for (let key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	};
	const generatorItem = (item : IDataItem, before : IRenderItem | null, index : number) : IRenderItem => {
		const rect = itemSizeInfo.value.get(item.id);
		const width = rect?.width || 0;
		const height = rect?.height + props.textHeight || 0;
		const imgHeight = rect?.height || 0;
		let y = 0;
		if (before) y = before.y + before.h + props.gap;
		const style = {
			width: `${width}px`,
			height: `${height}px`,
			transform: `translate3d(${index === 0 ? 0 : (width + props.gap) * index}px, ${y}px, 0)`,
		};
		assignProperties(props.customStyle, style);
		return Object.freeze({
			item,
			y,
			h: height,
			imgHeight: `${imgHeight}px`,
			style,
		});
	};

	const reComputedQueue = () => {
		columnState.queue = columnState.queue.map((q, index) => {
			let height = 0;
			const list = q.list.reduce<IRenderItem[]>((total, { item }, i) => {
				const before = total[i - 1] || null;
				const result = generatorItem(item, before, index);
				height += result.h;
				total.push(result);
				return total;
			}, []);
			return {
				height,
				list,
			};
		});
	};
	const handleScroll = rafThrottle((event : any) => {
		const scrollTop = event.detail.scrollTop;
		const clientHeight = screenHeight;
		scrollState.start = scrollTop;
		if (!dataState.loading && !hasMoreData.value) {
			loadDataList().then(() => {
				addInQueue();
			});
			return;
		}
		if (scrollTop + clientHeight > computedHeight.value.minHeight) addInQueue();
	});

	const handleResize = debounce((e : any) => {
		initScrollState(e);
		reComputedQueue();
	}, 300);

	const initScrollState = (e ?: { width : number; height : number }) => {
		const defaultSize = {
			width: screenWidth,
			height: screenHeight,
		};

		const { width, height } = e || defaultSize;
		scrollState.viewWidth = width;
		scrollState.viewHeight = height;
		// scrollState.start = 0;
	};

	const init = async () => {
		initScrollState();
		await loadDataList();
		addInQueue(requestSize.value);
		uni.onWindowResize((res) => {
			handleResize({ height: res.size.windowHeight, width: res.size.windowWidth });
		});
	};
	onMounted(() => {
		init();
	});
</script>

<style scoped lang="scss">
	.fs-virtual-waterfall {
		&-container {
			width: 100%;
			height: 100%;
		}

		&-content {
			width: 100%;
			height: 100%;
		}

		&-list {
			position: relative;
			width: 100%;
		}

		&-item {
			position: absolute;
			top: 0;
			left: 0;
			transition: all 0.3s;
			box-sizing: content-box;
		}
	}
</style>