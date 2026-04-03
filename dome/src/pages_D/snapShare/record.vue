<template>
	<view class="container" :data-theme="pageTheme" >
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="tab-con">
				<up-navbar title="上报记录" :bgColor="backgroundColor" @leftClick="toBack" placeholder
					:fixed="false"></up-navbar>
				<view :style="{ top: navBarHeight + 'px' }">
					<view class="sercha">
						<view
							style="background-color: #fff; width: 85%;height: 80rpx;border-radius: 40rpx;display: flex;align-items: center;padding-left: 30rpx;">
							<up-input placeholder="请输入关键字搜索" v-model="searchTex" border='none' shape='circle'
								height="35" @blur="serchinput">
								<template #prefix>
									<up-icon name="search" color="#000000" size="24"></up-icon>
								</template>
							</up-input>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>

		<!-- 日期选择器 -->
		<view class="date-picker">
			<view class="picker-value" @click="show=true">{{ datatime||'选择时间' }}
				<image :src="imgUrl+'volumePricing/vp_arrBottom.png'" mode="aspectFill" class="image-item-icon">
				</image>
			</view>

			<!-- <picker @change="onDateChange" :value="selectedDateIndex" :range="dateList">
				
				<view class="picker-value">{{ dateList[selectedDateIndex] }}
					<image :src="imgUrl+'volumePricing/vp_arrBottom.png'" mode="aspectFill" class="image-item-icon"
						@click="previewImage(img)"></image>
				</view>
			</picker> -->
		</view>
		<up-datetime-picker :show="show" @cancel="show=false" :minDate="1767225600000" @confirm="istime"
			format='YYYY-MM-DD' v-model="datatime" mode="date">
		</up-datetime-picker>
		<!-- 事件列表 -->
		<view class="event-list" v-if="events.length != 0" >
			<view v-for="(event, index) in events" :key="index" class="event-item" @click="todel(event)">
				<!-- 信息栏 -->
				<view class="info-bar">
					<text class="type">{{ event.reportCategoryName }}|{{event.reportTypeName}}</text>
					<text class="time">{{ event.updateTime }}</text>
				</view>

				<!-- 图片网格 -->
				<view class="image-grid">
					<image v-for="(img, i) in event.photoPaths" :key="i" :src="img" mode="aspectFill" class="image-item"
						@click="previewImage(img)"></image>
				</view>
			</view>
		</view>
		<view class="empty-data" v-if="!events || events.length === 0">
			<ser-empty></ser-empty>
		</view>
	</view>


</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, reactive, computed, onMounted } from 'vue';
	import {
		getopIncidentReportlist
	} from '@/api/snapShare';
	const backgroundColor = ref<string>('transparent');
	import { imgUrl } from '@/config';
	import { toBack, toNav } from "@/utils/route";
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	// 搜索关键词
	const keyword = ref('');
	const show = ref(false);
	const datatime = ref();
	// 日期选项
	const dateList = ['2025-12', '2025-11', '2025-10'];
	const selectedDateIndex = ref(0);
	onMounted(() => {
		getlist()
	})
	const searchTex = ref('');
	const serchinput = () => {
		getlist()
	}

	const getlist = async () => {

		const hasDate = datatime.value && datatime.value.trim();
		const startTime = hasDate ? `${datatime.value.trim()} 00:00:00` : '';
		const endTime = hasDate ? `${datatime.value.trim()} 23:59:59` : '';
		const res = await getopIncidentReportlist({
			pageNum: 1,
			pageSize: 999,
			keyWord: searchTex.value,
			startTime: startTime,
			endTime: endTime
		})
		if (res.code == 200) {
			events.value = res.data.list
		}
	}
	const todel = (e) => {
		toNav('/pages_D/snapShare/form?id=' + e.id)
	}
	const istime = (e) => {
		if (!e.value) {
			e.value = 1767225600000
		}
		console.log(e, 'daydaydaydayday')
		const date = new Date(e.value);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // 补零
		const day = String(date.getDate()).padStart(2, '0');
		const yearMonth = `${year}-${month}-${day}`;
		datatime.value = yearMonth
		show.value = false
		getlist()
	}
	// 事件数据
	const events = ref([]);

	// 日期选择
	const onDateChange = (e) => {
		selectedDateIndex.value = e.detail.value;
	};

	// 搜索
	const onSearch = () => {
		console.log('搜索:', keyword.value);
		// 可在此处调用 API 过滤事件
	};

	// 预览图片
	const previewImage = (url) => {
		uni.previewImage({
			current: url,
			urls: [url]
		});
	};
</script>

<style lang="scss">
	.image-item-icon {
		width: 18rpx;
		height: 11rpx;
		margin-left: 12rpx;
	}

	.sercha {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
	}

	.container {
		min-height: 100vh;
		background: var(--head-color);
	}

	.tab-con {
		width: 100%;
		box-sizing: border-box;
		// background: linear-gradient(180deg, #D1E5F9 0%, rgba(255, 255, 255, 0) 100%);
	}

	.search-bar {
		margin-bottom: 20rpx;
	}

	.search-input {
		width: 100%;
		height: 60rpx;
		border-radius: 30rpx;
		border: 1rpx solid #ddd;
		padding: 0 30rpx;
		font-size: 28rpx;
		background-color: #fff;
	}

	.date-picker {
		display: inline-block;
		padding: 20rpx 30rpx;
		background: #FFFFFF;
		border-radius: 322rpx 322rpx 322rpx 322rpx;
		margin-left: 30rpx;
		margin-top: 32rpx;
	}

	.picker-value {
		width: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		margin-right: 12rpx;

	}

	.event-list {
		background-color: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		margin: 30rpx;
		height: calc(100vh - 300rpx);
		overflow-y: auto;
		box-sizing: border-box;
	}

	.event-item {
		margin-bottom: 30rpx;
	}

	.info-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		background: var(--label-color);
		border-radius: 24rpx 24rpx 0rpx 0rpx;
		color: #007AFF;
		padding: 22rpx 28rpx;
		border-radius: 12rpx;
	}

	.type {
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
	}

	.time {
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
	}

	.image-grid {
		display: flex;
		gap: 20rpx;
		flex-wrap: wrap;
	}

	.image-item {
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}
</style>