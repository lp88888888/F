<template>
	<view class="container" :data-theme="pageTheme" >
		<!-- <cos-header :title="infoData.auditStatus == '2' ? '通过' : infoData.auditStatus == '3' ? '驳回' : infoData.auditStatus == '04' ? '作废' : infoData.auditStatus == '0' ? '待审核' : ''" :carIcon="infoData.auditStatus == '02' ? 'car_pass.png' : infoData.auditStatus == '03' ? 'car_reject.png' : ''" :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100" :backUrl="'/pages_A/car/myCar'"></cos-header> -->
		<!-- 0待审核、1审核通过、2审核驳回 -->

		<up-navbar
			:title="infoData.auditStatus == '1' ? '通过' : infoData.auditStatus == '2' ? '驳回' : infoData.auditStatus == '4' ? '作废' : infoData.auditStatus == '0' ? '待审核' : ''"
			@leftClick="toBack" :placeholder="true" :fixed="true" bgColor="transparent" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<!-- <scroll-view class="pageCon" :style="{ paddingTop: navBarHeight + 'px' }"> -->
		<view v-if="userIdentity != 2" class="status-box" :class="statusClass">
			<text class="status-title m-b-10">{{ statusMeta.title }}</text>
			<text class="status-desc">{{ statusMeta.desc }}</text>
		</view>
		<scroll-view class="pageCon"   :scroll-y="true"
      :style="{ height: '100%' }">
			<view class="whiteBg flex ali-cen just-sb">
				<text>企业名称</text>
				<text>{{infoData.enterpriseName}}</text>
			</view>

			<view class="whiteBg flex flex-col">
				<view class="title flex ali-cen">
					<text class="fs-28 fw-400">车牌号码</text>
				</view>
				<view class="numCon" style="margin-top: 40rpx;">
					<view v-for="(item, index) in infoData.licensePlate" :key="index">
						<!-- 蓝牌 -->
						<block v-if="infoData.plateColor == '1'">
							<view class="carNumBg bg_blue" v-if="item !== '?'" :data-index="index">{{ item }}</view>
							<view class="carNumBg bg_normal" v-else></view>
						</block>
						<!-- 黄牌 -->
						<block v-else-if="infoData.plateColor == '3'">
							<view class="carNumBg bg_yellow" v-if="item !== '?'" :data-index="index">{{ item }}</view>
							<view class="carNumBg bg_normal" v-else></view>
						</block>
						<!-- 绿牌 -->
						<block v-else-if="infoData.plateColor == '2'">
							<view class="carNumBg bg_green" v-if="item !== '?'" :data-index="index">{{ item }}</view>
							<view class="carNumBg bg_normal" v-else></view>
						</block>
						<!-- 黄绿 -->
						<block v-else-if="infoData.plateColor == '6'">
							<block v-if="index < 2">
								<view class="carNumBg bg_yellow" v-if="item !== '?'" :data-index="index">{{ item }}
								</view>
								<view class="carNumBg bg_normal" v-else></view>
							</block>
							<block v-else>
								<view class="carNumBg bg_green" v-if="item !== '?'">{{ item }}</view>
								<view class="carNumBg bg_normal" v-else></view>
							</block>
						</block>
					</view>
					<view class="carNumBg3" v-if="carType !== 'g' && carType !== 'yg'">新能源</view>
				</view>

				<view class="title flex ali-cen">
					<text class="fs-28 fw-400">车牌颜色</text>
				</view>
				<view class="flex just-sb ali-cen">
					<block v-if="infoData.plateColor == '1'">
						<view class="car-box">
							<image class="carImg m-t-25" :src="imgUrl + 'mine/car_b.png'" />
							<text class="car-text w">{{infoData.licensePlate}}</text>
						</view>
						<text class="m-t-25 fs28 fw-500 col3">小型货车/小型客车</text>
					</block>
					<block v-if="infoData.plateColor == '3'">
						<view class="car-box">
							<image class="carImg m-t-25" :src="imgUrl + 'mine/car_y.png'" />
							<text class="car-text b">{{infoData.licensePlate}}</text>
						</view>
						<text class="m-t-25">大型货车/大型客车</text>
					</block>
					<block v-if="infoData.plateColor == '2'">
						<view class="car-box">
							<image class="carImg m-t-25" :src="imgUrl + 'mine/car_g.png'" />
							<text class="car-text b">{{infoData.licensePlate}}</text>
						</view>
						<text class="m-t-25">小型新能源车</text>
					</block>
					<block v-if="infoData.plateColor == '6'">
						<view class="car-box">
							<image class="carImg m-t-25" :src="imgUrl + 'mine/car_yg.png'" />
							<text class="car-text b">{{infoData.licensePlate}}</text>
						</view>
						<text class="m-t-25">大型新能源车</text>
					</block>
				</view>
			</view>

			<view class="whiteBg flex flex-col">
				<!-- <text v-if="infoData.auditStatus == '2'" class="fs-24 colff9 m-b-20">驳回原因：{{infoData.auditOpinion}}</text> -->
				<view class="title flex ali-cen m-b-25">
					<text class="fs-28 fw-400">行驶证</text>
				</view>
				<view class="flex ali-cen">
					<view class="upload-box">
						<u-image class="dri-img" width="190rpx" radius="8" height="190rpx"
							:src="infoData.drivingLicenseFront" mode="aspectFill" lazy-load></u-image>
						<view class="upload-box-bg" @click="previewImage(infoData.drivingLicenseFront)">
							<image :src="imgUrl+'static/img_view.png'" class="icon-look"></image>
						</view>
					</view>
					<view class="upload-box m-l-30">
						<u-image v-if="infoData.drivingLicenseBack" radius="8" class="dri-img" width="190rpx"
							height="190rpx" :src="infoData.drivingLicenseBack" mode="aspectFill"
							@click="previewImage(infoData.drivingLicenseBack)" lazy-load></u-image>
						<view v-if="infoData.drivingLicenseBack" class="upload-box-bg"
							@click="previewImage(infoData.drivingLicenseFront)">
							<image :src="imgUrl+'static/img_view.png'" class="icon-look"></image>
						</view>
					</view>
				</view>
			</view>

			<view class="whiteBg flex flex-col">
				<view class="flex ali-cen just-sb">
					<text class="fs-28 col3 fw-400 m-b-30 b-line">车辆所属</text>
					<text class="fs28 fw-500 col3">{{infoData.vehicleOwnership == 1 ? '公司' : '个人'}}</text>
				</view>
				<view class="flex ali-cen just-sb">
					<text class="fs-28 col3 fw-400 m-t-30 m-b-30 b-line">所属人姓名</text>
					<text class="fs28 fw-500 col3">{{infoData.vehicleOwnerName}}</text>
				</view>
				<!-- 个人 -->
				<view class="flex ali-cen just-sb" v-if="infoData.auditStatus == 1 && userIdentity != 2">
					<text class="fs-28 col3 fw-400 m-t-30 m-b-30 b-line">所属人手机号</text>
					<text class="fs28 fw-500 col3">{{infoData.ownerPhone}}</text>
				</view>
				<view class="flex ali-cen just-sb" v-if="infoData.auditStatus == 1 && userIdentity != 2">
					<text class="fs-28 col3 fw-400 m-t-30 m-b-30 b-line">积分分成比例</text>
					<text class="fs28 fw-500 col3">{{infoData.pointDivisionRatio}}%</text>
				</view>
				<!-- 企业 -->
				<view class="flex ali-cen just-sb" v-if="userIdentity == 2">
					<text class="fs-28 col3 fw-400 m-t-30 m-b-30 b-line">所属人手机号</text>
					<text class="fs28 fw-500 col3">{{infoData.ownerPhone}}</text>
				</view>
				<view v-if="userIdentity == 2" class="flex just-sb ali-cen"
					style="padding: 30rpx 0;border-bottom: 2rpx solid #EAEAEA;display: flex;align-items: center;">
					<view class="rowCon flex just-sb ali-cen" style="width: 49%;">
						<text class="fs-28 fw-500" style="width: 220rpx;">个人比例</text>
						<!-- 编辑态 -->
						<input
						  v-if="infoData.auditStatus == 1 && isEdit"
						  class="tex32_33"
						  style="text-align: right;"
						  placeholder-class="tex30_66"
						  placeholder="请输入"
						  :disabled="false"
						  :value="userpointDivisionRatio"
						  type="number"
						  inputmode="numeric"
						  maxlength="3"
						  @input="onUserRatioInput"
						/>
						
						<!-- 非编辑态 -->
						<input
						  v-if="infoData.auditStatus == 1 && !isEdit"
						  class="tex32_33"
						  style="text-align: right;"
						  placeholder-class="tex30_66"
						  :placeholder="isEdit ? '请输入' : ''"
						  :disabled="true"
						  :value="userpointDivisionRatio"
						  type="number"
						  inputmode="numeric"
						  maxlength="3"
						/>
						<!-- 审批 -->
						<input
						  v-if="infoData.auditStatus == 0"
						  class="tex32_33"
						  style="text-align: right;"
						  placeholder-class="tex30_66"
						  :placeholder="isEdit ? '请输入' : ''"
						  :value="userpointDivisionRatio"
						  type="number"
						  inputmode="numeric"
						  maxlength="3"
						  @input="onUserRatioInput"
						/>% 
					</view>
					<view class="rowCon flex just-sb ali-cen" style="width: 49%;">
						<text class="fs-28 fw-500" style="width: 220rpx;">企业比例</text>
						<input v-if="infoData.auditStatus == 1" class="tex32_33" readonly style="text-align: right;" placeholder-class="tex30_66"
							placeholder="自动计算" :disabled="true" :value="isEdit ? pointDivisionRatio : infoData.pointDivisionRatio" />
						<input v-if="infoData.auditStatus == 0" class="tex32_33" readonly style="text-align: right;" placeholder-class="tex30_66"
							placeholder="自动计算" :disabled="true" :value="pointDivisionRatio" />
							%
					</view>
				</view>
				<view class="tips" v-if="userIdentity == 2">
					说明：设置积分分成比例后，该车辆的里程积分40%归属于企业，60%归属于司机个人。
				</view>
			</view>
			<view style="height: 400rpx;"></view>
		</scroll-view>
		<up-gap height="90"></up-gap>

		<view class="bottom-bar" v-if="userIdentity == 2 && infoData.auditStatus == 1">
			<view class="add-vehicle" @click="editBtn">
				<text>{{ isEdit ? '提交': '编辑'}}</text>
			</view>
		</view>
		<view class="bottom-bar" v-if="userIdentity == 2 && infoData.auditStatus == 0">
			<view class="flex ali-cen just-sb">
				<view class="reject-btn" @click="openRejectPopup">审批驳回</view>
				<view class="pass-btn" @click="submitBatchPass">审批通过</view>
			</view>
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
							审批通过的车辆所产生的里程积分将按照公司{{isEdit ? pointDivisionRatio : infoData.pointDivisionRatio}}%，个人{{userpointDivisionRatio}}%的基础比例配置，如需修改请前往车辆详情中配置积分比例。
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
	import { ref, onMounted, computed } from 'vue';
	import { imgUrl } from '../../config';
	import { toBack } from '@/utils/route';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { getUserVehicleByUserId, updateRatio, vehicleAudit } from '@/api/car';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const carNum = ref('陕UU708M');
	const carType = ref('b');
	const vehicleId = ref('')
	const status = ref(1)
	const infoData = ref<Record<string, any>>({});
	const userIdentity = ref(uni.getStorageSync('userIdentity')?.[0]?.identityType ?? '');
	const isEdit = ref<boolean>(false); // 是否编辑

	// 企业可编辑字段
	const editOwnerPhone = ref<string>('');            // 手机号
	const userpointDivisionRatio = ref<string>('60'); // 个人积分分成比例
	// 企业比例：自动计算
	const pointDivisionRatio = computed(() => {
	  const pStr = clampIntRatio(userpointDivisionRatio.value);
	  if (pStr === '') return '';
	  const p = parseInt(pStr, 10);
	  return String(100 - p);
	});
	/** ========= uView Plus 弹窗：驳回理由 ========= */
	const showRejectPopup = ref(false);
	const rejectReason = ref('');
	const rejectCount = ref(0);
	const isReject = ref(false);

	const canConfirmReject = computed(() => rejectReason.value.trim().length > 0);
	const clampIntRatio = (raw: any): string => {
	  let v = (raw ?? '').toString();
	
	  // 只保留数字，去掉小数点/负号/其他字符
	  v = v.replace(/[^\d]/g, '');
	
	  // 允许清空
	  if (v === '') return '';
	
	  // 转整数并限制 0~100
	  let n = parseInt(v, 10);
	  if (Number.isNaN(n)) n = 0;
	  if (n < 0) n = 0;
	  if (n > 100) n = 100;
	
	  return String(n);
	};
	
	const onUserRatioInput = (e: any) => {
	  const next = clampIntRatio(e?.detail?.value);
	  userpointDivisionRatio.value = next;
	};

	const openRejectPopup = () => {
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
		isReject.value = false
		showRejectPopup.value = true;
	};

	const buildBatchListPayload = (auditStatus : 1 | 2, opinion ?: string) => {
		const enterprise = Number(infoData.value.enterpriseId);
		const auditOpinion = (opinion || '').trim();
		return {
			id: vehicleId.value,
			enterpriseId: enterprise,
			auditStatus,
			auditOpinion,
			pointDivisionRatio: pointDivisionRatio.value
		}
	};
	/** 弹窗“确定”提交 */
	const confirmReject = async () => {
		// 驳回：理由必填
		if (isReject.value && !rejectReason.value.trim()) {
			uni.showToast({ title: '请填写驳回理由（最多50字）', icon: 'none' });
			return;
		}

		try {

			if (isReject.value) {
				await vehicleAudit(buildBatchListPayload(2, rejectReason.value));
			} else {
				await vehicleAudit(buildBatchListPayload(1));
			}

			uni.showToast({ title: '操作成功', icon: 'none' });
			uni.$emit('vehicle_audit_done', {
			  vehicleId: infoData.value?.id || vehicleId.value,
			});
			closeRejectPopup();
			setTimeout(() => {
			  uni.navigateBack({ delta: 1 });
			}, 300);
		} catch (e : any) {
			uni.showToast({ title: e?.msg || '操作失败', icon: 'none' });
		} finally {
		}
	};
	// const pointDivisionRatio = ref<string>(''); // 企业积分分成比例
	onLoad((options) => {
		if (options) {
			vehicleId.value = options.vehicleId
			getUserVehicleByUser();
		}
	})
	/** 基础校验 */
	const isValidPhone = (v : string) => /^1\d{10}$/.test(v);
	const isValidRatio = (v: string) => {
	  if (v === '') return false;
	  if (!/^\d{1,3}$/.test(v)) return false; // 纯整数
	  const n = Number(v);
	  return Number.isInteger(n) && n >= 0 && n <= 100;
	};
	const editBtn = async () => {
		// 进入编辑态：回填一次，避免用户前面修改后再进来字段是旧的
		if (!isEdit.value) {
			isEdit.value = true;
			editOwnerPhone.value = String(infoData.value.ownerPhone || '');
			// const ratio = infoData.value.pointDivisionRatio ?? '';
			// userpointDivisionRatio.value = ratio === '' ? '' : String(ratio);
			return;
		}

		// 保存：校验
		if (!isValidRatio(userpointDivisionRatio.value)) {
			uni.showToast({ title: '个人比例请输入0~100之间的数值', icon: 'none' });
			return;
		}

		try {
			uni.showLoading({ title: '保存中...' });
			await saveEnterpriseEdit();
			uni.showToast({ title: '保存成功', icon: 'none' });

			isEdit.value = false;
			await getUserVehicleByUser();
		} catch (e) {
			uni.showToast({ title: '保存失败，请稍后重试', icon: 'none' });
		} finally {
			uni.hideLoading();
		}
	};

	/** 保存接口 */
	const saveEnterpriseEdit = async () => {
		const personalStr = clampIntRatio(userpointDivisionRatio.value);
		  if (personalStr === '') {
		    uni.showToast({ title: '个人比例请输入0~100的整数', icon: 'none' });
		    return;
		  }
		const personal = Number(userpointDivisionRatio.value)
		const company = 100 - personal
		const payload = {
			id: vehicleId.value,
			enterpriseId: infoData.value.enterpriseId,
			pointDivisionRatio: company
		};

		const res = await updateRatio(payload)
		if (res.code == 200) {
			uni.showToast({ title: '修改成功', icon: 'none' })
			setTimeout(() => {
			  uni.navigateBack({ delta: 1 });
			}, 300);
		}
	};
	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});

	const statusMeta = computed(() => {
		const s = Number(infoData.value.auditStatus);
		if (s === 1) {
			return {
				title: '已通过',
				desc: '审批已通过，可正常使用',
				cls: 'status-pass'
			};
		}
		if (s === 2) {
			return {
				title: '已驳回',
				desc: '驳回原因：企业有误',
				cls: 'status-reject'
			};
		}
		// 默认：0 待审核
		return {
			title: '审核中',
			desc: '申请正在审核中，请耐心等待～',
			cls: 'status-pending'
		};
	});

	const statusClass = computed(() => statusMeta.value.cls);

	// 图片预览
	const previewImage = (img) => {
		uni.previewImage({
			current: img,
			urls: [img]
		});
	};
	// 车辆详情
	const getUserVehicleByUser = async () => {
		const res = await getUserVehicleByUserId(vehicleId.value)
		infoData.value = res.data
		if (userIdentity.value == 2) {
			const company = Number(infoData.value.pointDivisionRatio)
			const safeCompany = Number.isFinite(company) ? company : 40;
			const personal = 100 - safeCompany;

			userpointDivisionRatio.value = clampIntRatio(Math.round(personal));
		}
	}

	/** 跳转 */
	const toJump = (url : string) => {
		uni.navigateTo({ url });
	};
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		overflow: hidden;
		background: var(--head-color);
	}

	.pageCon {
		// height: calc(100vh - 400rpx);
		padding-bottom: 200rpx;
	}

	.whiteBg {
		padding: 40rpx 30rpx 30rpx;
		margin: 20rpx 32rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		box-shadow: 0rpx 0rpx 20rpx 0rpx #E7EBF1;
		box-sizing: border-box;

		.title {
			.line {
				width: 8rpx;
				height: 34rpx;
				background: var(--primary-color);
				border-radius: 0rpx 4rpx 4rpx 0rpx;
				margin-right: 17rpx;
			}
		}

		.dri-img {
			width: 190rpx;
			height: 190rpx;
			background: #F5F6F7;
			border-radius: 16rpx;
			margin-top: 27rpx;
		}

		.numCon {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			margin-bottom: 50rpx;

			.carNumBg3 {
				width: 67rpx;
				height: 82rpx;
				background-color: #EEFCF8;
				border-radius: 10rpx;
				border: dashed 1rpx #00BD75;
				font-size: 22rpx;
				color: #00BD75;
				writing-mode: vertical-rl;
				text-align: center;
				line-height: 70rpx;
				letter-spacing: 2rpx;
			}

			.carNumBg {
				width: 67rpx;
				height: 82rpx;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 500;
				line-height: 82rpx;
				text-align: center;
			}

			.bg_blue {
				background-color: #4B88F5;
				color: #ffffff;
			}

			.bg_yellow {
				background-color: #FFDE23;
				color: #000000;
			}

			.bg_green {
				background: linear-gradient(0deg, #6DBF5B, #E9F5E7);
				color: #000000;
			}

			.bg_normal {
				background-color: #f0f0f0;
				color: #333333;
			}
		}

		.carImg {
			width: 230rpx;
			height: 70rpx;
		}
	}

	.car-box {
		position: relative;
	}

	.car-text {
		position: absolute;
		left: 50%;
		top: 45rpx;
		transform: translateX(-50%);
		font-weight: 500;
		font-size: 26rpx;
		width: 100%;
		text-align: center;
	}

	.w {
		color: #fff;
	}

	.b {
		color: #000000;
	}

	::v-deep .u_image__image {
		width: 300rpx;
		height: 168rpx;
	}

	.status-box {
		width: 750rpx;
		height: 120rpx;
		background: #E8F1FF;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		padding: 20rpx 34rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.status-title {
		font-weight: 500;
		font-size: 32rpx;
		line-height: 36rpx;
	}

	.status-desc {
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		;
		line-height: 32rpx;
	}

	/* 0 待审核 */
	.status-pending {
		background: #E8F1FF;

		.status-title {
			color: #4788FA;
		}
	}

	/* 1 审核通过 */
	.status-pass {
		background: #E0F7F7;

		.status-title {
			color: #00BEBE;
		}
	}

	/* 2 审核驳回 */
	.status-reject {
		background: #FFF0F0;

		.status-title {
			color: #FD4848;
		}
	}

	.upload-box {
		width: 190rpx;
		height: 190rpx;
		position: relative;
		border-radius: 16rpx;
		position: relative;
	}

	.upload-box-bg {
		width: 190rpx;
		height: 190rpx;
		background: rgba(0, 0, 0, .5);
		position: absolute;
		top: 0;
		border-radius: 16rpx;
	}

	.icon-look {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		margin: 0 auto;
		padding-top: 70rpx;
	}

	.tips {
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
		margin-top: 30rpx;
		line-height: 36rpx;
	}

	.b-line {
		border-bottom: 2rpx solid #EAEAEA;
	}

	.bottom-bar {
		width: 100%;
		height: 176rpx;
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		padding: 30rpx 64rpx 50rpx;
		z-index: 8;
		box-sizing: border-box;

		.add-vehicle {
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
			width: 622rpx;
			height: 96rpx;
			background: var(--but-color-line);
			border-radius: 48rpx;
		}
	}

	.reject-btn {
		width: 242rpx;
		height: 96rpx;
		background: #FFFFFF;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		border: 2rpx solid var(--primary-color);
		line-height: 96rpx;
		box-sizing: border-box;
		text-align: center;
		font-weight: 500;
		font-size: 32rpx;
		color: var(--primary-color);
	}

	.pass-btn {
		width: 398rpx;
		height: 96rpx;
		background: var(--primary-color);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		line-height: 96rpx;
		box-sizing: border-box;
		text-align: center;
		font-weight: 500;
		font-size: 32rpx;
		color: #FFFFFF;
		margin-left:
			30rpx;
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