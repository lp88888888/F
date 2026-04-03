<template>
	<view class='container'>
		<view class="page-conent" :data-theme="pageTheme">
			<up-sticky>
				<view class="searchView">
					<up-navbar title="信息纠错" leftIconColor="#000000" bgColor="transparent" @leftClick="toBack"
						:placeholder="true" :fixed="true"></up-navbar>
				</view>
			</up-sticky>
			<view class='box'>
				<view class="location-bar">
					<view class="location-icon">
						<up-icon name="checkmark-circle" size="16" :color="themeStore.themeColors.$color"></up-icon>
					</view>
					<view class="location-text">
						<text class="sub-text">{{errorcorrectionObj.name}}</text>
						<text class="main-text">已定位到附近收费站</text>
						<text class="tip-text">当前距离：{{errorcorrectionObj.distance}}，可进行纠错上报</text>
					</view>
				</view>
				<view class="section" v-if="tollStatiobj.eventDesc">
					<text class="section-title">管制信息</text>
					<view class="empty-placeholder">
						<text class="placeholder-text">
							{{tollStatiobj.eventDesc}}
						</text>
					</view>
				</view>
				<view class="section">
					<view>
						<view class="label">我要纠错</view>
						<view style="color: #999999;font-size: 24rpx;margin: 20rpx 0 10rpx;">请选择实际遇到的收费站状态，帮助我们更新更准确的信息
						</view>
					</view>
					<view class="form-item" style="padding: 20rpx 0;">
						<text class="label">错误类型<text class="required">*</text></text>
						<template>
							<view style="display: flex;align-items: center;">
								<view style="width: 300rpx;">
									<up-picker-data v-model="formData.errorcorrection" title="请选择"
										:options="yesNoOptions" 
										
										valueKey="id" labelKey="name">
									</up-picker-data>
								</view>
								<up-icon name="arrow-right" color="#999999" size="16"></up-icon>
							</view>

						</template>
					</view>

					<view>
						<view class="label" style="margin: 20rpx 0;">详细描述</view>
						<template>
							<view class="textarea-wrapper">
								<up-textarea v-model="formData.description" class="textarea"
									placeholder="请描述具体的错误情况，例如：ETC通道全部关 闭，只有2个人工通道开放，排队约200米…" maxlength="100"
									:show-confirm-bar="false" />
							</view>
						</template>
					</view>
					<view class="form-items">
						<view class="form-item" style="flex-direction: column; align-items: self-start;border: none;">
							<text class="label">上传图片<text class="required"></text><text
									style="font-weight: 400;font-size: 24rpx;color: #999999;">（选填，最多上传3张）</text></text>
							<template>
								<view style="margin-top: 32rpx;">
									<FormFile :urls="imageList" :limit="2" @deleteFile="deleteFile"
										@uploadFile="uploadFile">
									</FormFile>
								</view>
							</template>
						</view>
						<text style="font-size: 24rpx;color: #999999;">上传现场照片可帮助运营人员更快核实信息</text>
					</view>
				</view>
				<view style="height: 100rpx;"></view>
			</view>
			<view class="foot-but">
				<view class="btn-bar" @click="getAuthCodeDebounced()">
					提交纠错信息
				</view>
			</view>
			<PageDurationTracker pageName="纠错信息" />
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, computed } from 'vue';
	import { onLoad, onPageScroll, onReady, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '../../config';
	import { toNav, toBack } from '@/utils/route';
	import { checkDistanceRequirement,getTollStationById,saveform } from '@/api/errorcorrection'
	import FormFile from '@/components/FormFile.vue';
	import { useTheme } from '@/composables/useTheme';
	import { debounce } from '@/utils/common';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const imageList = ref([]);
	const tollStatiobj=ref({});
	const errorcorrectionObj = reactive({
		id: '',
		name: '',
		distance: ''
	})
	const formData = reactive({
		errorcorrection: '',
		description: '',
		photoPaths: ''
	})
	const yesNoOptions = [{
		id: '01',
		name: '开启'
	},
	{
		id: '02',
		name: '关闭'
	}, {
		id: '05',
		name: '管制'
	}
	];
	// const checkDistanceRequirementFun = async (id : Number | string) => {
	// 	let longitude = uni.getStorageSync('address').lng
	// 	let latitude = uni.getStorageSync('address').lat
	// 	let params = {
	// 		tollStationId: id,
	// 		longitude: longitude,
	// 		latitude: latitude,
	// 	};
	// 	try {
	// 		const res = await checkDistanceRequirement(params)
	// 		if (res.code == 200) {

	// 		}
	// 	} catch (error) {

	// 	} finally {

	// 	}
	// }
	const getTollStationByIdFun = async (id : Number | string) => {
		try {
			const res = await getTollStationById(id)
			if (res.code == 200) {
	           tollStatiobj.value=res.data
			}
		} catch (error) {
	
		} finally {
	
		}
	}
	
	// 防抖包装：300ms 内多次点击只触发一次
	const getAuthCodeDebounced = debounce(() => {
		saveformFun();
	}, 300);
	const saveformFun = async () => {
		if(!formData.errorcorrection){
			uni.showToast({
				title: '请选择错误类型',
				icon: 'none'
			});
			return
		}
		let longitude = uni.getStorageSync('address').lng
		let latitude = uni.getStorageSync('address').lat
		let location = uni.getStorageSync('address')
		let params = {
			tollStationId: errorcorrectionObj.id,
			submitOperationalStatus: formData.errorcorrection,
			location: location.province + location.city + location.district,
			longitude: longitude,
			latitude: latitude,
			imageUrl: formData.photoPaths,
			description: formData.description
		};
		try {
			const res = await saveform(params)
			if (res.code == 200) {
				// 投票成功提示
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				});
				
				// 使用防抖处理，避免频繁刷新
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages_F/errorcorrection/scusses?id='+res.data,
					});
				}, 1000);
			}
		} catch (error) {

		} finally {

		}
	}
    const deleteFile = (index) => {
		imageList.value.splice(index, 1);
		// 3. 字符串转数组删除后，再转回字符串
		const pathArr = formData.photoPaths ? formData.photoPaths.split(',') : []
		pathArr.splice(index, 1)
		formData.photoPaths = pathArr.join(',')
	};
	const uploadFile = (url) => {
		console.log(url, '图片上传')
		// 2. 先转数组判断长度，再追加后转回字符串
		const pathArr = formData.photoPaths ? formData.photoPaths.split(',') : []
		if (pathArr.length < 3) { // 修正：最多3张，所以用 < 3
			pathArr.push(url.url)
			formData.photoPaths = pathArr.join(',')
			imageList.value.push(url);
		}
	};
	onLoad((options) => {
		if (options.id) {
			getTollStationByIdFun(options.id)
			errorcorrectionObj.id = options.id
			errorcorrectionObj.name = options.name
			errorcorrectionObj.distance = options.distance

		}
	})
	onMounted(() => {

	});
	onShow(() => {

	})
	onUnmounted(() => {

	});
</script>

<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}

	.box {
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.container {
		height: 100vh;
		background: #f8f9fb;
	}

	.location-bar {
		display: flex;
		align-items: center;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		background: #fff;
		margin: 20rpx auto;
		padding: 20rpx 10rpx 0;
		gap: 10rpx;
	}

	.location-icon {
		margin-left: 6px;
		margin-top: -4rpx;
	}

	.location-text .main-text {
		font-size: 24rpx;
		color: var(--primary-color);
		display: block;
		margin-bottom: 8px;
	}

	.location-text .sub-text {
		margin-left: -42rpx;
		font-size: 32rpx;
		color: #333333;
		display: block;
		margin-bottom: 8px;
		font-weight: 500;
	}

	.location-text .tip-text {
		font-size: 24rpx;
		color: #666666;
		display: block;
		padding-bottom: 18rpx;
	}

	.section {
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 20rpx auto;
		padding: 20rpx 20rpx 10rpx;
		background: #fff;
	}

	.placeholder-text {
		font-size:24rpx;
		display: flex;
		padding: 20rpx 0 10rpx;
	}

	.form-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #eee;
		padding: 20rpx 0 0;

	}

	.label {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		min-width: 180rpx;
		display: flex;
		align-items: center;
	}

	.required {
		font-size: 24rpx;
		color: #ff4d4f;
		margin-left: 6rpx;
	}

	.input,
	.picker-value {
		font-size: 28rpx;
		color: #333;
		border-radius: 12rpx;
		background-color: #fff;
		text-align: right;
		flex: 1;
		margin-left: 20rpx;
	}

	.form-items {
		margin-bottom: 20rpx;
	}

	.btn-bar {
		width: 686rpx;
		height: 80rpx;
		background: var(--but-color-line);
		border-radius: 40rpx;
		font-weight: 500;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		margin: 25rpx 32rpx;
	}

	.foot-but {
		width: 100%;
		height: 150rpx;
		background: #fff;
		position: fixed;
		bottom: 0;
	}

	.textarea-wrapper {
		background: #F8F9FA;
		border-radius: 16rpx;
	}

	::v-deep .u-input {
		background: transparent !important;
	}

	::v-deep .u-textarea {
		border: none !important;
		background: transparent !important;
	}

	::v-deep .u-textarea__field {
		height: 200rpx !important;
	}
	::v-deep .u-input__content__field-wrapper__field{
		text-align: right !important;  
	}
</style>