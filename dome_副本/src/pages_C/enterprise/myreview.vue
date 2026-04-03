<template>
	<view class="container" :data-theme="pageTheme">
			<u-sticky bgColor="transparent" z-index="99999">
				<view class="searchView">
				  <up-navbar title="我的审批" :bgColor="backgroundColor"  @leftClick="toBack" placeholder :fixed="false">
				   	<template #right>
				   		<view v-if="isBatchMode" class="nav-right" @click="exitBatchMode">退出</view>
				   	</template>
				   </up-navbar>
				</view>
			</u-sticky>
		
		<!-- 列表区域：预留底部按钮高度 -->
		<view class="list-wrap" :style="{ paddingBottom: isBatchMode ? '190rpx' : '176rpx' }">
			<scroll-view scroll-y class="list-con" :style="{ paddingTop: 0 + 'px' }" @scrolltolower="onReachBottom">
				<ser-empty v-if="addgasolinelist.length <= 0"></ser-empty>
				<view v-else>
					<view v-for="item in addgasolinelist" :key="item.id" class="item-con" :style="{
							backgroundImage: `url(${bgImageUrl})`,
							backgroundSize: '100%',
							backgroundPosition: 'cover',
							backgroundRepeat: 'no-repeat'
						}" @click="onItemClick(item)">
						<!-- 左侧选择圈：仅批量模式显示 -->
						<view v-if="isBatchMode" class="select-area" @click.stop="toggleSelect(item)">
							<view :class="['select-circle', { 'select-circle--on': isSelected(item) }]">
								<text v-if="isSelected(item)" class="select-check">✓</text>
							</view>
						</view>

						<!-- 右侧内容 -->
						<view class="item-main">
							<view class="row-between">
								<view class="carcode" :style="{
										backgroundImage: `url(${dynamicBgImageUrl})`,
										backgroundSize: '240rpx 72rpx',
										backgroundPosition: 'center',
										backgroundRepeat: 'no-repeat'
									}">
									{{ item.licensePlate }}
								</view>
								<text class="box-text-2">{{ getAuditText(item.auditStatus) }}</text>
							</view>

							<view class="box-1">
								<text>电话号码｜{{ item.ownerPhone }}</text>
								<text>{{ getVehicleType(item.vehicleType) }}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 底部：非批量模式 -->
		<view v-if="!isBatchMode" class="foot-box">
			<view class="foot-box-bnt" @click="enterBatchMode">批量审批</view>
		</view>

		<!-- 底部：批量模式 -->
		<view v-else class="batch-bar">
			<view class="batch-left" @click="toggleSelectAll">
				<view :class="['select-circle', { 'select-circle--on': isAllSelected }]">
					<text v-if="isAllSelected" class="select-check">✓</text>
				</view>
				<text class="batch-all-text">全部</text>
			</view>

			<!-- 驳回：打开 uView Plus 弹窗 -->
			<view class="batch-btn batch-btn--reject" @click="openRejectPopup">审批驳回</view>
			<view class="batch-btn batch-btn--pass" @click="submitBatchPass">审批通过</view>
		</view>

		<!-- ========== 弹窗 ========== -->
		<up-popup v-model:show="showRejectPopup" mode="center" bgColor="transparent" :round="0"
			:safeAreaInsetBottom="false" :closeOnClickOverlay="true"
			:overlayStyle="{ backgroundColor: 'rgba(0,0,0,0.55)' }" @close="closeRejectPopup">
			<view class="reject-wrap">
				<view class="reject-dialog">
					<view class="reject-dialog-header">
						<text v-if="isReject" class="reject-title">请填写驳回理由</text>
						<text v-else class="reject-title">审批须知</text>
					</view>

					<view class="reject-input-wrap">
						<up-textarea v-if="isReject" v-model="rejectReason" placeholder="请输入" :maxlength="50"
							:height="90" :autoHeight="false" :border="true" count />
						<view v-if="!isReject">
							审批通过的车辆所产生的里程积分将按照公司40%，个人60%的基础比例配置，如需修改请前往车辆详情中配置积分比例。
						</view>
					</view>

					<view class="reject-actions">
						<up-button text="取消" shape="circle" plain :hairline="true" :customStyle="{
								height: '76rpx',
								lineHeight: '76 rpx',
								borderColor: '#00BEBE',
								color: '#00BEBE',
								fontSize: '28rpx'
							}" @click="closeRejectPopup" />
						<up-button text="确定" shape="circle" :customStyle="{
								height: '76rpx',
								lineHeight: '76rpx',
								background: '#00BEBE',
								borderColor: '#00BEBE',
								color: '#FFFFFF',
								fontSize: '28rpx',
							}" @click="confirmReject" />
					</view>
				</view>

				<view class="reject-close" @click="closeRejectPopup">
					<up-icon name="close" color="rgba(255,255,255,0.92)" size="18"></up-icon>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import { onLoad, onUnload } from '@dcloudio/uni-app';
	import { computed, onMounted, ref } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { enterpriseVehicle, batchAudit } from '@/api/car';
	import { getDict } from '@/api/config';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	/** ========= 基础状态 ========= */
	const backgroundColor = ref<string>('transparent');
	const navBarHeight = ref(0);

	const enterpriseId = ref<string>('');
	const dynamicBgImageUrl = ref(imgUrl + 'mine/car_b.png');
	const bgImageUrl = ref(imgUrl + 'static/car_bg_00.png');

	/** 审核状态：0待审核、1审核通过、2审核驳回 */
	const statusText : Record<number, string> = {
		0: '待审核',
		1: '审核通过',
		2: '审核驳回'
	};
	const getAuditText = (s : any) => statusText[Number(s)] || '';

	/** ========= 字典：车辆类型 ========= */
	const columns = ref<any[]>([]);
	const getCarTypeList = async () => {
		try {
			const res : any = await getDict('vehicle_type');
			columns.value = Array.isArray(res?.data) ? res.data : [];
		} catch (e) {
			columns.value = [];
		}
	};
	const getVehicleType = (vehicleType : any) => {
		const vt = String(vehicleType ?? '');
		const type = columns.value.find((item : any) => String(item.dictValue) === vt);
		return type ? type.dictLabel : '其他';
	};

	/** ========= 列表与分页 ========= */
	interface VehicleItem {
		id : number | string;
		licensePlate : string;
		ownerPhone : string;
		vehicleType : string | number;
		auditStatus : number | string;
	}

	const addgasolinelist = ref<VehicleItem[]>([]);
	const pageNum = ref(1);
	const pageSize = ref(10);
	const totalCount = ref(0);

	const totalPage = computed(() => {
		if (!totalCount.value) return 1;
		return Math.max(1, Math.ceil(totalCount.value / pageSize.value));
	});

	const refreshList = async () => {
		addgasolinelist.value = [];
		pageNum.value = 1;
		totalCount.value = 0; // 有的话就清一下
		await loadData();
	};


	const loadData = async () => {
		const params : any = {
			enterpriseId: enterpriseId.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			// 只展示“待审核”：保留；若全量展示请删掉
			auditStatus: 0
		};

		try {
			const res : any = await enterpriseVehicle(params);
			const list = res?.data?.list ?? res?.data ?? [];
			const total = res?.data?.total ?? res?.total ?? 0;

			const newList : VehicleItem[] = Array.isArray(list) ? list : [];
			addgasolinelist.value = pageNum.value == 1?newList:[...addgasolinelist.value, ...newList];
			totalCount.value = Number(total) || 0;

			// 批量模式且全选态：加载更多后保持“全选”
			if (isBatchMode.value && isAllSelected.value) {
				selectedIds.value = [...selectableIds.value];
			}
		} catch (e) { }
	};

	const onReachBottom = () => {
		if ((pageNum.value * pageSize.value) >= totalCount.value) {
			uni.showToast({ title: '没有更多数据了', icon: 'none', duration: 1500 });
			return;
		}
		pageNum.value += 1;
		loadData();
	};

	/** ========= 批量审批：选择逻辑 ========= */
	const isBatchMode = ref(false);
	const selectedIds = ref<number[]>([]);

	const canSelect = (item : VehicleItem) => Number(item.auditStatus) === 0;

	const selectableIds = computed(() =>
		(addgasolinelist.value || [])
			.filter((x) => canSelect(x))
			.map((x) => Number(x.id))
	);

	const isSelected = (item : VehicleItem) => selectedIds.value.includes(Number(item.id));

	const isAllSelected = computed(() => {
		const all = selectableIds.value;
		if (!all.length) return false;
		return all.every((id) => selectedIds.value.includes(id));
	});

	const enterBatchMode = () => {
		if (!addgasolinelist.value.length) {
			uni.showToast({ title: '暂无数据', icon: 'none' });
			return;
		}
		isBatchMode.value = true;
		// 默认全选（仅待审核）
		selectedIds.value = [...selectableIds.value];
	};

	const exitBatchMode = () => {
		isBatchMode.value = false;
		selectedIds.value = [];
	};

	const toggleSelect = (item : VehicleItem) => {
		if (!canSelect(item)) {
			uni.showToast({ title: '仅可操作待审核车辆', icon: 'none' });
			return;
		}
		const id = Number(item.id);
		const idx = selectedIds.value.indexOf(id);
		if (idx === -1) selectedIds.value.push(id);
		else selectedIds.value.splice(idx, 1);
	};

	const toggleSelectAll = () => {
		const all = selectableIds.value;
		if (!all.length) {
			uni.showToast({ title: '暂无可审批车辆', icon: 'none' });
			return;
		}
		if (isAllSelected.value) selectedIds.value = [];
		else selectedIds.value = [...all];
	};

	const onItemClick = (item : VehicleItem) => {
		if (isBatchMode.value) {
			toggleSelect(item);
			return;
		} else {
			toNav(`/pages_C/enterprise/carInfo?vehicleId=${item.id}`)
		}
	};

	/** ========= uView Plus 弹窗：驳回理由 ========= */
	const showRejectPopup = ref(false);
	const rejectReason = ref('');
	const rejectCount = ref(0);
	const isReject = ref(false);

	const canConfirmReject = computed(() => rejectReason.value.trim().length > 0);

	const openRejectPopup = () => {
		if (!selectedIds.value.length) {
			uni.showToast({ title: '请先选择车辆', icon: 'none' });
			return;
		}
		isReject.value = true
		rejectReason.value = '';
		showRejectPopup.value = true;
	};

	const closeRejectPopup = () => {
		showRejectPopup.value = false;
		rejectReason.value = '';
		rejectCount.value = 0;
	};

	/** 通过 */
	const submitBatchPass = async () => {
		if (!selectedIds.value.length) {
			uni.showToast({ title: '请先选择车辆', icon: 'none' });
			return;
		}
		isReject.value = false
		showRejectPopup.value = true;
	};

	const buildBatchListPayload = (auditStatus : 1 | 2, opinion ?: string) => {
		const enterprise = Number(enterpriseId.value);
		const auditOpinion = (opinion || '').trim();

		return selectedIds.value.map((id) => {
			const item : any = {
				enterpriseId: enterprise,
				id,
				auditStatus
			};
			// 驳回才带理由（如果后端通过也要求带，可删除判断）
			if (auditStatus === 2) item.auditOpinion = auditOpinion;
			return item;
		});
	};

	/** 弹窗“确定”提交 */
	const confirmReject = async () => {
		if (!selectedIds.value.length) {
			uni.showToast({ title: '请先选择车辆', icon: 'none' });
			return;
		}

		// 驳回：理由必填
		if (isReject.value && !rejectReason.value.trim()) {
			uni.showToast({ title: '请填写驳回理由（最多50字）', icon: 'none' });
			return;
		}

		try {
			uni.showLoading({ title: '处理中...' });

			if (isReject.value) {
				await batchAudit(buildBatchListPayload(2, rejectReason.value));
			} else {
				await batchAudit(buildBatchListPayload(1));
			}

			uni.showToast({ title: '操作成功', icon: 'none' });

			closeRejectPopup();
			exitBatchMode();
			addgasolinelist.value = [];
			pageNum.value = 1;
			await loadData();
		} catch (e : any) {
			uni.showToast({ title: e?.msg || '操作失败', icon: 'none' });
		} finally {
			uni.hideLoading();
		}
	};


	/** ========= 生命周期 ========= */
	onLoad(async (options : any) => {
		enterpriseId.value = options?.id || '';
		await getCarTypeList();
		await loadData();
		uni.$on('vehicle_audit_done', async () => {
			exitBatchMode();
			await refreshList();
		});
	});
	onUnload(() => {
		uni.$off('vehicle_audit_done');
	});

	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44;
	});
</script>

<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}

	.container {
		background: #F8F9FB;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.tab-con {
		width: 100%;
		box-sizing: border-box;
	}

	.nav-right {
		font-size: 28rpx;
		color: #333;
		padding-right: 20rpx;
	}

	.list-wrap {
		flex: 1;
	}

	.list-con {
		height: calc(100vh - 160rpx);
		padding: 0 32rpx;
		box-sizing: border-box;
		overflow-y: auto;
		margin-top: 30rpx;
	}

	.item-con {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		display: flex;
		align-items: flex-start;
	}

	.select-area {
		width: 64rpx;
		padding-top: 6rpx;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.select-circle {
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		border: 2rpx solid #cfcfcf;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
	}

	.select-circle--on {
		border-color: #00BEBE;
		background: #00BEBE;
	}

	.select-check {
		color: #fff;
		font-size: 22rpx;
		font-weight: 600;
		line-height: 1;
	}

	.item-main {
		flex: 1;
	}

	.row-between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.carcode {
		width: 240rpx;
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		font-size: 28rpx;
		color: #FFFFFF;
	}

	.box-text-2 {
		font-weight: 400;
		font-size: 24rpx;
		color: #4788FA;
	}

	.box-1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 600;
		font-size: 24rpx;
		color: #333333;
		padding: 24rpx 0;
	}

	/* 非批量底部 */
	.foot-box {
		width: 100%;
		padding: 30rpx 64rpx 50rpx;
		background-color: #fff;
		box-sizing: border-box;
		position: fixed;
		display: flex;
		align-items: center;
		left: 0;
		bottom: 0;
		z-index: 20;
	}

	.foot-box-bnt {
		width: 690rpx;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		font-weight: 500;
		font-size: 32rpx;
		color: #FFFFFF;
		background: var(--but-color-line);
		border-radius: 48rpx;
	}

	/* 批量底栏 */
	.batch-bar {
		width: 100%;
		padding: 30rpx 32rpx 50rpx;
		background: #fff;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		gap: 20rpx;
		z-index: 20;
		border-top: 1rpx solid #eee;
	}

	.batch-left {
		display: flex;
		align-items: center;
		width: 180rpx;
	}

	.batch-all-text {
		margin-left: 16rpx;
		font-size: 28rpx;
		color: #333;
	}

	.batch-btn {
		flex: 1;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		border-radius: 48rpx;
		font-size: 30rpx;
		font-weight: 500;
	}

	.batch-btn--reject {
		border: 2rpx solid #00BEBE;
		color: #00BEBE;
		background: #fff;
	}

	.batch-btn--pass {
		background: #00BEBE;
		color: #fff;
	}

	/* ====== uView Plus 弹窗内容布局（仿截图） ====== */
	.reject-wrap {
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.reject-dialog {
		width: 570rpx;
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.reject-dialog-header {
		background: linear-gradient(180deg, #C8FFFD 0%, #FFFFFF 100%);
		padding: 28rpx 50rpx 18rpx;
		text-align: center;
	}

	.reject-title {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	.reject-input-wrap {
		padding: 18rpx 50rpx 30rpx;
		box-sizing: border-box;
	}

	.reject-counter {
		margin-top: 10rpx;
		text-align: right;
		font-size: 22rpx;
		color: #999;
	}

	.reject-actions {
		padding: 16rpx 50rpx 44rpx;
		display: flex;
		justify-content: space-between;
		gap: 24rpx;
		box-sizing: border-box;
	}

	.reject-close {
		margin-top: 40rpx;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		border: 2rpx solid rgba(255, 255, 255, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:v-deep .u-textarea {
		border: 2rpx solid #E4E4E4 !important;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
	}
</style>