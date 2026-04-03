<template>
	<view class="feedback-list-page">
		<!-- 顶部筛选 + 新增 -->
		<view class="toolbar">
			<view class="filter" @tap="onOpenStatusPicker">
				<text class="filter-label">{{ currentStatusLabel }}</text>
				<image class="filter-arrow" :src="imgUrl + 'experience/ex_arrow_down.png'" mode="widthFix" />
			</view>

			<view class="add-btn" @tap="onAddFeedback">
				<image class="add-btn__icon" :src="imgUrl + 'experience/ex_add_black.png'" mode="aspectFit" />
				<text class="add-btn__text">新增建议</text>
			</view>
		</view>

		<!-- 列表 -->
		<view class="list-wrap">
			<view v-for="item in list" :key="item.id" class="card"
				@tap="toNav(`/pages_E/experience/suggestedDetails?id=${item.id}&tag=${item.tagName}`)">
				<!-- 标题行 -->
				<view class="card-header">
					<text class="card-title">{{ item.tagName }}</text>
					<text class="status-tag" :class="'status-tag--' + item.reviewStatus">
						{{ statusTextMap[item.reviewStatus] }}
					</text>
				</view>

				<!-- 内容 -->
				<view class="card-body">
					<view class="row">
						<text class="row-label">建议内容</text>
						<view class="row-value row-value--content"
							:class="{ 'row-value--ellipsis': item.contentEllipsis }">
							{{ item.coreFeedback }}
						</view>
					</view>
					<view class="row">
						<text class="row-label">提交时间</text>
						<text class="row-value">{{ item.createTime }}</text>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-if="!loading && !list.length" class="empty">
				<text class="empty-text">暂无数据</text>
			</view>

			<!-- 底部加载状态 -->
			<view v-if="list.length" class="load-more">
				<text v-if="loading">加载中...</text>
				<text v-else-if="finished">没有更多了</text>
				<text v-else>上拉加载更多</text>
			</view>
		</view>

		<!-- 状态筛选 Picker -->
		<up-picker :show="showStatusPicker" :columns="[statusOptions]" keyName="label" @confirm="onConfirmStatus"
			@cancel="showStatusPicker = false" @close="showStatusPicker = false" />
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
	import { imgUrl } from '@/config'
	import { feedbackList } from '@/api/home'
	import { getDict } from '@/api/config'
	import { toNav } from "@/utils/route";

	// 状态：'' 表示全部，0/1/2 分别对应待处理/已通过/未通过
	type FeedbackStatus = '' | '0' | '1' | '2'

	// 单条记录结构按实际接口来，这里和 template 对齐
	interface FeedbackItem {
		id : number | string
		feedbackType : string        // 字典 value，用来换成 dictLabel
		tagName ?: string            // 映射后的标签名（显示用）
		coreFeedback : string
		contentEllipsis ?: boolean
		createTime : string
		reviewStatus : '0' | '1' | '2'
	}

	// 字典项结构
	interface DictItem {
		dictValue : string
		dictLabel : string
	}

	// 状态文案映射
	const statusTextMap : Record<'0' | '1' | '2', string> = {
		'0': '待处理',
		'1': '已通过',
		'2': '未通过'
	}

	// 顶部筛选相关
	const statusFilter = ref<FeedbackStatus>('') // 默认“全部”

	const statusOptions = ref<{ label : string; value : FeedbackStatus }[]>([
		{ label: '状态筛选', value: '' },
		{ label: '待处理', value: '0' },
		{ label: '已通过', value: '1' },
		{ label: '未通过', value: '2' }
	])

	const currentStatusLabel = computed(() => {
		const item = statusOptions.value.find(i => i.value === statusFilter.value)
		return item ? item.label : '状态筛选'
	})

	const showStatusPicker = ref(false)
	const onOpenStatusPicker = () => {
		showStatusPicker.value = true
	}

	const onConfirmStatus = (e : any) => {
		const selected = e.value?.[0]
		if (!selected) return

		statusFilter.value = selected.value as FeedbackStatus
		showStatusPicker.value = false

		// 状态切换后，重新拉取列表
		fetchList(true)
	}

	/* ================== 字典：feedbackType → 标签名 ================== */

	const tagList = ref<DictItem[]>([])

	// dictValue → dictLabel 的映射表
	const tagMap = computed<Record<string, string>>(() => {
		const map : Record<string, string> = {}
		tagList.value.forEach(item => {
			map[item.dictValue] = item.dictLabel
		})
		return map
	})

	// 拉字典
	const getDictData = async () => {
		try {
			const res : any = await getDict('sys_experience_feedback')
			if (res?.code === 200 && Array.isArray(res.data)) {
				tagList.value = res.data
			}
		} catch (err) {
			console.error('获取反馈类型字典失败：', err)
		}
	}

	/* ================== 列表 & 分页 ================== */

	const list = ref<FeedbackItem[]>([])
	const pageNum = ref(1)
	const pageSize = ref(10)
	const loading = ref(false)
	const finished = ref(false)

	// 拉取列表
	const fetchList = async (reset = false) => {
		if (loading.value) return
		if (!reset && finished.value) return

		if (reset) {
			pageNum.value = 1
			finished.value = false
			list.value = []
		}

		loading.value = true
		try {
			// 筛选传参：带上 reviewStatus、分页参数
			const params : any = {
				pageNum: pageNum.value,
				pageSize: pageSize.value
			}
			if (statusFilter.value) {
				params.reviewStatus = statusFilter.value   // 后端按状态筛选
			}

			const res : any = await feedbackList(params)
			const rows : FeedbackItem[] = res?.rows || []

			// 把 feedbackType 映射成 tagName，用于展示
			const mappedRows : FeedbackItem[] = rows.map(row => ({
				...row,
				tagName: tagMap.value[row.feedbackType] || row.tagName || '',
				// 如果后端没给 contentEllipsis，可按长度补一个简单逻辑
				contentEllipsis:
					row.contentEllipsis ??
					(row.coreFeedback && row.coreFeedback.length > 40)
			}))

			if (mappedRows.length < pageSize.value) {
				finished.value = true
			}

			list.value = reset
				? mappedRows
				: list.value.concat(mappedRows)

			pageNum.value += 1
		} catch (e) {
			console.error('获取反馈列表失败：', e)
		} finally {
			loading.value = false
		}
	}

	// 触底加载
	onReachBottom(() => {
		fetchList()
	})

	// 新增建议
	const onAddFeedback = () => {
		uni.navigateTo({
			url: '/pages_E/experience/information'
		})
	}

	// 页面初始化：先拉字典，再拉列表，保证 tagName 能正常映射
	onLoad(async () => {
		await getDictData()
		await fetchList(true)
	})
	onShow(() => {
		getDictData()
		fetchList(true)
	})
</script>


<style scoped lang="scss">
	.feedback-list-page {
		min-height: 100vh;
		background-color: #F5F5F5;
		box-sizing: border-box;
	}

	/* 顶部工具栏 */
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #FFFFFF;
		padding: 14rpx 24rpx 24rpx 48rpx;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	/* 状态筛选 */
	.filter {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.filter-label {
		margin-right: 10rpx;
		font-size: 28rpx;
		color: #080912;
	}

	.filter-arrow {
		width: 20rpx;
		height: 12rpx;
	}

	/* 新增按钮 */
	.add-btn {
		padding: 16rpx 28rpx;
		border-radius: 999rpx;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		border: 2rpx solid #000000;
	}

	.add-btn__icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 14rpx;
	}

	.add-btn__text {
		font-size: 28rpx;
		color: #171715;
	}

	/* 列表卡片 */
	.list-wrap {
		padding: 24rpx 28rpx;
	}

	.card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 20rpx 20rpx 24rpx;
		margin-bottom: 16rpx;
	}

	/* 卡片标题行 */
	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 50rpx;
	}

	.card-title {
		font-size: 30rpx;
		font-weight: 600;
	}

	.status-tag {
		font-size: 26rpx;
	}

	.status-tag--0 {
		color: #FF6F22;
	}

	.status-tag--1 {
		color: #1CC26C;
	}

	.status-tag--2 {
		color: #FF0000;
	}

	/* 卡片内容 */
	.card-body {
		margin-top: 4rpx;
	}

	.row {
		display: flex;
		align-items: center;
		margin-top: 8rpx;
	}

	.row-label {
		width: 150rpx;
		font-size: 26rpx;
		color: #7F7F7F;
		margin-bottom: 10rpx;
	}

	.row-value {
		flex: 1;
		font-size: 26rpx;
	}

	.row-value--content {
		line-height: 1.5;
	}

	.row-value--ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* 空状态 */
	.empty {
		padding: 80rpx 0;
		text-align: center;
	}

	.empty-text {
		font-size: 26rpx;
		color: #b0b0b0;
	}

	/* 底部加载 */
	.load-more {
		padding: 24rpx 0;
		text-align: center;
		font-size: 24rpx;
		color: #999999;
	}
</style>