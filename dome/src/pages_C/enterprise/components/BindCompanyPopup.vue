<template>
	<view class="popup-overlay" :data-theme="pageTheme" v-if="show">
		<view class="popup-wrap">
			<!-- 弹窗主体 -->
			<view class="popup-container">
				<!-- 步骤条（截图样式） -->
				<view class="step-bar">
					<view class="steps">
						<view class="step-col">
							<view class="step-dot" :class="{ active: currentStep >= 1 }">1</view>
							<text class="step-text" :class="{ active: currentStep >= 1 }">选择加入企业</text>
						</view>

						<view class="step-line" :class="{ active: currentStep >= 2 }"></view>

						<view class="step-col">
							<view class="step-dot" :class="{ active: currentStep >= 2 }">2</view>
							<text class="step-text" :class="{ active: currentStep >= 2 }">选择企业车辆</text>
						</view>

						<view class="step-line" :class="{ active: currentStep >= 3 }"></view>

						<view class="step-col">
							<view class="step-dot" :class="{ active: currentStep >= 3 }">3</view>
							<text class="step-text" :class="{ active: currentStep >= 3 }">提交成功</text>
						</view>
					</view>
				</view>

				<!-- 内容区域 -->
				<view class="content">
					<!-- 步骤1：选择企业 -->
					<view v-if="currentStep === 1">
						<view class="input-row">
							<text class="row-left">企业名称</text>
							<input class="row-input" @input="enterpriseListFun" v-model="companyName"
								placeholder="输入企业名称" />
						</view>

						<scroll-view class="list-group" scroll-y v-if="ishow">
							<view v-for="(item, index) in companies" :key="index" class="list-item"
								@click="selectCompany(item)">
								<text class="list-main">{{ item.licensePlate }}</text>
							</view>
						</scroll-view>
					</view>

					<!-- 步骤2：选择车辆（截图结构） -->
					<view v-if="currentStep === 2">
						<view class="row">
							<text class="row-left">企业名称</text>
							<text class="row-right">{{ companyName }}</text>
						</view>

						<view class="row fold-row" @click="toggleFold">
							<text class="row-left">已绑定车辆加入企业</text>
							<view class="row-right fold-ctl">
								<!-- <text class="fold-text">{{ foldOpen ? '收起' : '展开' }}</text> -->
								<image class="car-icon" :src="imgUrl + 'static/car_g_icon.png'" />
								<up-icon :name="foldOpen ? 'arrow-up' : 'arrow-down'" color="#666" size="14" />

							</view>
						</view>

						<view v-show="foldOpen" class="tag-area">
							<view v-for="(car, index) in cars" :key="index" class="tag"
								:class="{ selected: isCarSelected(car) }" @click="toggleCar(car)">
								<view class="tag-ico" :class="{ selected: isCarSelected(car) }"></view>
								<text class="tag-text">{{ car.licensePlate }}</text>
							</view>
						</view>

						<view class="row bind-row" v-if="cars.length<3">
							<text class="row-left">绑定新车</text>
							<view class="row-right link"
								@click.stop="toNav(`/pages_C/enterprise/bindcar?id=${enterpriseId}&name=${companyName}`)">
								<text>去绑定</text>
								<up-icon name="arrow-right" color="#999" size="14" />
							</view>
						</view>
					</view>

					<!-- 步骤3：提交成功 -->
					<view v-if="currentStep === 3">
						<view class="success-title">提交成功</view>

						<view class="row">
							<text class="row-left">企业名称</text>
							<text class="row-right strong">{{ companyName }}</text>
						</view>

						<view class="row">
							<text class="row-left">绑定车辆</text>
							<text class="row-right">
								{{ selectedCars.map(car => car.licensePlate).join('、') }}
							</text>
						</view>

						<view class="success-tips">{{ countdown }}s后自动返回</view>
					</view>
				</view>

				<!-- 底部按钮（截图样式） -->
				<view class="footer" v-if="currentStep !== 3">
					<view class="btn btn-outline" v-if="currentStep === 2" @click="prevStep">上一步</view>
					<view class="btn btn-outline" v-if="currentStep === 1" @click="cancel">取消</view>

					<view class="btn btn-solid" v-if="currentStep === 1" @click="nextStep">下一步</view>
					<view class="btn btn-solid" v-if="currentStep === 2" @click="submit">提交</view>
				</view>
			</view>

			<!-- 底部关闭（截图样式） -->
			<view class="close-out" @click="close">
				<text class="close-x">×</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue'
	import {
		enterpriseList
	} from '@/api/enterprise'
	import {
		etBindVehicle
	} from '@/api/car'
	import {
		toNav
	} from '@/utils/route'
	import {
		postboundlist
	} from '@/api/user'
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const props = defineProps({
		show: {
			type: Boolean,
			default: false
		}
	})
	const emit = defineEmits(['update:show', 'close'])
	const ishow = ref(true)
	const enterpriseId = ref('')
	const companyName = ref('')
	const selectedCars = ref([])
	const companies = ref([])
	const cars = ref([])
	const currentStep = ref(1)

	const foldOpen = ref(true)
	/** 倒计时*/
	const countdown = ref(5)
	let countdownTimer = null
	const clearCountdown = () => {
		if (countdownTimer) {
			clearInterval(countdownTimer)
			countdownTimer = null
		}
	}
	const startCountdown = () => {
		clearCountdown()
		countdown.value = 5
		countdownTimer = setInterval(() => {
			if (countdown.value <= 1) {
				clearCountdown()
				close()
				toNav(`/pages_C/enterprise/userReview?id=${enterpriseId.value}&name=${companyName.value}`)
				return
			}
			countdown.value--
		}, 1000)
	}
	watch(() => props.show, (newVal) => {
		if (newVal) {
			// 如需每次打开重置：取消注释
			resetForm()
		} else {
			clearCountdown()
		}
	})

	const toggleFold = () => {
		foldOpen.value = !foldOpen.value
	}

	const isCarSelected = (car) => selectedCars.value.some(v => v.id === car.id)

	const close = () => {
		clearCountdown()
		emit('update:show', false)
		emit('close')
	}

	const cancel = () => close()

	const prevStep = () => {
		if (currentStep.value > 1) {
			currentStep.value--
			if (currentStep.value === 1) selectedCars.value = []
		}
	}

	const nextStep = () => {
		if (currentStep.value === 1) {
			if (!companyName.value) {
				uni.showToast({
					title: '请选择企业',
					icon: 'none'
				})
				return
			}
			if (!enterpriseId.value) {
				uni.showToast({
					title: '请从列表中选择企业',
					icon: 'none'
				})
				return
			}
			enterprisecarListFun()
			currentStep.value++
		}
	}

	const submit = () => {
		etBindVehicleFun()
	}

	const selectCompany = (val) => {
		companyName.value = val.licensePlate
		enterpriseId.value = val.id
		ishow.value = false
	}

	const toggleCar = (car) => {
		const index = selectedCars.value.findIndex(item => item.id === car.id)
		if (index === -1) {
			selectedCars.value.push({
				...car,
				enterpriseId: Number(enterpriseId.value)
			})
		} else {
			selectedCars.value.splice(index, 1)
		}
	}

	const etBindVehicleFun = async () => {
		uni.showLoading({
			title: '提交中...'
		})
		try {
			const res = await etBindVehicle(selectedCars.value)
			if (res.code === 200) {
				currentStep.value = 3
				startCountdown()
				setTimeout(() => {
					close()
					// 你原本跳转逻辑保留：需要就继续用
					toNav(
						`/pages_C/enterprise/userReview?id=${enterpriseId.value}&name=${companyName.value}`)
				}, 5000)
			} else {
				uni.showToast({
					title: res.msg || '操作失败',
					icon: 'none'
				})
			}
		} catch (e) {
			uni.showToast({
				title: e?.msg || '操作失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	const enterpriseListFun = async () => {
		if (!companyName.value) {
			ishow.value = false
			return
		} else {
			ishow.value = true
		}

		const params = {
			enterpriseName: companyName.value,
			auditStatus: 1
		}
		const res = await enterpriseList(params)
		if (res.code === 200) {
			companies.value = res.data.list.map(item => ({
				id: item.id,
				licensePlate: item.enterpriseName,
				ownerPhone: item.ownerPhone,
				plateColor: item.plateColor,
				vehicleType: item.vehicleType,
				vehicleOwnerId: item.vehicleOwnerId,
				drivingLicenseFront: item.drivingLicenseBack,
				drivingLicenseBack: item.drivingLicenseFront
			}))
		}
	}

	const enterprisecarListFun = async () => {
		const userId = uni.getStorageSync('userInfo')?.id
		const res = await postboundlist({
			userId
		})
		if (res.code === 200) {
			res.data.forEach(item => {
				if(!item.enterpriseName){
					if (!cars.value.some(car => car.id === item.id)) {
					  cars.value.push(item);
					}
				}
			})
			selectedCars.value = []
			foldOpen.value = true
		}
	}

	const resetForm = () => {
		clearCountdown()
		currentStep.value = 1
		companyName.value = ''
		enterpriseId.value = ''
		companies.value = []
		cars.value = []
		selectedCars.value = []
		foldOpen.value = true
	}
</script>

<style scoped lang="scss">
	.popup-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.popup-wrap {
		position: relative;
		width: 660rpx;
	}

	.popup-container {
		width: 660rpx;
		border-radius: 24rpx;
		overflow: hidden;
		background: linear-gradient(180deg, #D8F7DE 0%, #FFFFFF 38%);
		padding: 28rpx 28rpx 24rpx;
		box-sizing: border-box;
	}

	.step-bar {
		padding: 8rpx 8rpx 18rpx;
	}

	.steps {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.step-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
		width: 170rpx;
	}

	.step-dot {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		background: #CFCFCF;
		color: #fff;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.08);
	}

	.step-dot.active {
		background: var(--primary-color);
	}

	.step-text {
		font-size: 24rpx;
		color: #9A9A9A;
		line-height: 1.2;
	}

	.step-text.active {
		color: #1E1E1E;
		font-weight: 600;
	}

	.step-line {
		flex: 1;
		margin-top: 22rpx;
		/* 对齐圆点中部 */
		border-top: 2rpx dashed #C9D8B3;
		opacity: 0.9;
	}

	.step-line.active {
		border-top-color: var(--primary-color);
	}

	.content {
		background: rgba(255, 255, 255, 0.65);
		border-radius: 18rpx;
		padding: 22rpx 22rpx 8rpx;
		min-height: 320rpx;
		box-sizing: border-box;
	}

	.row,
	.input-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18rpx 0;
		border-bottom: 1rpx solid #EEF0EE;
	}

	.row-left {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}

	.row-right {
		font-size: 28rpx;
		color: #333;
		max-width: 420rpx;
		text-align: right;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.row-right.strong {
		font-weight: 700;
	}

	.row-input {
		flex: 1;
		text-align: right;
		font-size: 28rpx;
		color: #333;
		padding-left: 24rpx;
	}

	.fold-row {
		cursor: pointer;
	}

	.fold-ctl {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.fold-text {
		font-size: 26rpx;
		color: #666;
	}

	.list-group {
		max-height: 220rpx;
		overflow-y: auto;
		margin-top: 14rpx;
		border-radius: 14rpx;
		background: #fff;
		box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
	}

	.list-item {
		padding: 22rpx;
		border-bottom: 1rpx solid #F2F2F2;
	}

	.list-item:last-child {
		border-bottom: none;
	}

	.list-main {
		font-size: 28rpx;
		color: #333;
	}

	.tag-area {
		display: flex;
		flex-wrap: wrap;
		gap: 18rpx;
		padding: 18rpx 0 6rpx;
	}

	.tag {
		display: flex;
		align-items: center;
		gap: 12rpx;
		height: 72rpx;
		padding: 0 18rpx;
		border-radius: 16rpx;
		background: #F3F5F7;
		color: #333;
		max-width: 300rpx;
		box-sizing: border-box;
	}

	.tag.selected {
		background: #FFFFFF;
		border: 2rpx solid var(--primary-color);
	}

	.tag-ico {
		width: 28rpx;
		height: 22rpx;
		border-radius: 4rpx;
		background: #A7A7A7;
		flex: none;
	}

	.tag-ico.selected {
		background: var(--primary-color);
	}

	.tag-text {
		font-size: 26rpx;
		color: inherit;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.bind-row .link {
		display: flex;
		align-items: center;
		gap: 8rpx;
		color: #999;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		gap: 22rpx;
		margin-top: 100rpx;
		padding: 0 60rpx;
	}

	.btn {
		flex: 1;
		height: 76rpx;
		border-radius: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		font-weight: 600;
	}

	.btn-outline {
		border: 2rpx solid var(--primary-color);
		color: var(--primary-color);
		background: #FFFFFF;
	}

	.btn-solid {
		background: var(--primary-color);
		color: #FFFFFF;
	}

	.success-title {
		font-size: 34rpx;
		font-weight: 800;
		color: #1E1E1E;
		padding: 10rpx 0 6rpx;
	}

	.success-tips {
		padding: 24rpx 0 6rpx;
		font-size: 24rpx;
		color: var(--primary-color);
		text-align: center;
		font-weight: 600;
	}

	.close-out {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		border: 2rpx solid rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: -92rpx;
		background: rgba(0, 0, 0, 0.15);
	}

	.close-x {
		color: #fff;
		font-size: 46rpx;
		line-height: 46rpx;
		margin-top: -4rpx;
	}

	.car-icon {
		width: 32rpx;
		height: 32rpx;
	}
</style>