<template>
	<view class="container">
		<view v-if="toll" class="con-header">
			<view class="con-title">待审核</view>
			<view class="con-text">路况已提交，正在审核中...</view>
		</view>
		<view class="con-body">
			<!-- 收费站名称 -->
			<up-form labelPosition="left" :model="formData" ref="uFormRes" labelWidth="100">
				<up-form-item label="收费站名称" required>
					<up-input disabled v-model="formData.stationName" placeholder="请输入收费站名称" />
				</up-form-item>
				<!-- 当前定位 -->
				<up-form-item label="当前定位" required>
					<up-input disabled v-model="formData.location" placeholder="请输入当前定位" />
				</up-form-item>
				<!-- 运营状态 -->
				<up-form-item label="运营状态" required>
					<view class="flex just-sb ali-cen" @click="onchangeEvt">
						<view>
							{{operationStatusLabel || '请选择运营状态'}}
						</view>
						<up-icon name="arrow-right"></up-icon>
					</view>
				</up-form-item>
				<!-- 现场照片 -->
				<up-form-item label="现场照片" required>
					<view class="photo-upload">
						<up-upload :file-list="file ? [{url: file}] : []"
							:deletable="toll ? false : true" @after-read="handleAfterRead"
							@delete="handleDelete" multiple accept="image">
							<view v-if="!file" class="upload-btn">
								<up-icon name="plus" size="24" color="#999" />
							</view>
						</up-upload>
					</view>
				</up-form-item>
				<!-- 详情描述 -->
				<up-form-item label="详情描述">
					<up-textarea v-model="formData.description" :disabled="toll ? true : false"
						placeholder="请输入详情描述" count autoHeight></up-textarea>
				</up-form-item>
			</up-form>
			<!-- 确认提交按钮 -->
			<view v-if="!toll" class="submit-btn">
				<view @click="handleSubmit">确认提交</view>
			</view>
			<up-picker :show="showStatus" :columns="[operationStatusList]" @cancel='showStatus=false'
				@confirm='statusSelect' keyName="label" valueName="value">
			</up-picker>
		</view>
	</view>
</template>

<script setup lang="ts">
	
	import { ref, reactive } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import uploadFile from '@/utils/upload'
	import {
		getRoadConditionCorrectionByUserId,
		saveRoadConditionCorrection
	} from '@/api/map'
	const formData = ref({
		tollStationId: '',
		stationName: '',
		location: '',
		operationStatus: '',
		loadImg: '',
		description: '',
	});
	const toll = ref({})
	const fileList = ref([])
	const file = ref('')
	const locationData = ref({})
	const operationStatusList = ref([
		{ label: '正常', value: '01' },
		{ label: '关闭', value: '02' },
		{ label: '入口关闭,出口正常', value: '03' },
		{ label: '入口正常,出口关闭', value: '04' },
		{ label: '管制', value: '05' }
	]);

	const showStatus = ref(false)
	// 页面加载
	onLoad((options : any) => {
		if (options) {
			formData.value.tollStationId = options.id
			formData.value.stationName = options.name
			formData.value.operationStatus = options.status
		}
		getLocation()
		getInfo()
	});
	const getInfo = async () => {
		const params = {
			userId: uni.getStorageSync('userInfo').id,
			tollStationId: formData.value.tollStationId
		}
		console.log('-0-00--0-----02--',params);
		const res = await getRoadConditionCorrectionByUserId(params)
		console.log('-0-00--0-----0--',res);
		toll.value = res.clazz
		file.value = res.clazz.imageUrl
		formData.value.description = res.clazz.description
	}
	// 获取位置的方法
	const getLocation = () : void => {
		// #ifdef APP
			const bdMapPlugin = uni.requireNativePlugin('bdMapPlugin');
			bdMapPlugin.getCurrentLocation((event) => {
				console.log('当前位置', JSON.parse(event));
				const res = JSON.parse(event);
				if (res.z) {
					const result = res.z;
					console.log('-------------getAdddress--------------------', res.z);
					formData.value.location = result.address
					locationData.value = {
						latitude:res.c,
						longitude:res.d
					}
					// let address = {
					// 	lat: res.c,
					// 	lng: res.d,
					// 	city: result.city,
					// 	cityCode: result.adcode.substr(0, 4) + '00',
					// 	province: result.province,
					// 	provinceCode: result.adcode.substr(0, 2) + '0000',
					// 	district: result.district,
					// 	districtCode: result.adcode,
					// 	standardAddress: result.address,
					// };
					// uni.setStorageSync('address', address);
				}
			});
		// #endif
		
		// #ifdef MP-WEIXIN
			uni.getLocation({
				type: "gcj02",
				success: (res) => {
					console.log('获取位置。。', res);
					locationData.value = res
					// 拼接经纬度
					const lot = res.latitude + ',' + res.longitude;
					console.log('lot', lot);
					geocoder(lot);
				},
				fail: (err : WechatMiniprogram.GeneralCallbackResult) => {
					console.error('获取位置失败:', err);
				}
			});
		// #endif
		
	};
	const geocoder = async (location : string) => {
		try {
			const key = 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB'
			// 发起请求
			const response = await new Promise((resolve, reject) => {
				uni.request({
					url: `https://apis.map.qq.com/ws/geocoder/v1/?key=${key}&location=${location}`,
					method: 'GET',
					success: resolve,
					fail: reject
				});
			});

			const geocoderData = response.data;

			// 处理接口返回状态
			if (geocoderData.status === 0) {
				formData.value.location = geocoderData.result.address;
			}
		} catch (err) {
			// 捕获请求/解析错误
			console.error('callGeocoderAPI 错误：', err);
		} finally {
			// 无论成功/失败，结束加载状态
		}
	};
	const onchangeEvt = () => {
		if (!toll.value) {
			showStatus.value = true
		}
	}
	const statusSelect = (e) => {
		if (e && e.value && e.value.length) {
			formData.value.operationStatus = e.value[0].value;
			showStatus.value = false;
		}
	}

	// 图片上传后回调
	const handleAfterRead = async (event) => {
		console.log('上传', event);
		const uploadedFile = event.file[0].thumb;

		// 如果是单个文件，上传文件并将返回的文件路径存储为字符串
		try {
			const uploadedFileUrl = await uploadFile<{
				readUrl : string
			}>({
				url: '/file/upload',
				filePath: uploadedFile,
				moduleName: '',
			});
			console.log('上传结果', uploadedFileUrl);
			if (uploadedFileUrl.code == 200) {
				fileList.value.push(uploadedFileUrl.data.url)
				console.log('上传订单5', fileList.value);
				file.value = uploadedFileUrl.data.url;
				formData.value.loadImg = file.value
			}
		} catch (err) {
			console.error('上传文件失败：', err);
		}
	};

	// 图片删除回调
	const handleDelete = () => {
		file.value = '';
	};
	const operationStatusLabel = computed(() => {
		const item = operationStatusList.value.find(
			i => i.value === formData.value.operationStatus
		)
		return item ? item.label : ''
	})

	// 提交表单
	const handleSubmit = async () => {
		console.log('表单数据：', formData);
		if (!file.value) {
			uni.showToast({
				title: '请上传现场照片',
				icon: 'none'
			})
			return
		}

		const params = {
			id: (toll.vlue && toll.value.id) ? toll.value.id : '',
			tollStationId: formData.value.tollStationId,
			submitOperationalStatus: '0' + String(Number(formData.value.operationStatus) + 1),
			longitude: locationData.value.longitude,
			latitude: locationData.value.latitude,
			location:formData.value.location,
			imageUrl: file.value,
			description: formData.value.description,
			
			userId: uni.getStorageSync('userInfo').id
		}
		console.log('090---=-==-==-==-,',params);
		await saveRoadConditionCorrection(params)
		uni.showToast({ title: '提交成功，等待反馈' })
		setTimeout(function () {
			uni.navigateBack()
		}, 1000)
	};
</script>

<style lang="scss" scoped>
	.container {
		background-color: #fff;
		min-height: 100vh;
		box-sizing: border-box;
	}
	
	.con-body {
		padding: 32rpx;
	}

	.photo-upload {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.upload-btn {
		width: 120rpx;
		height: 120rpx;
		border: 1px dashed #ddd;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.submit-btn {
		width: 702rpx;
		height: 90rpx;
		background-color: $color;
		border-radius: 10rpx;
		text-align: center;
		line-height: 90rpx;
		font-size: 32rpx;
		color: #ffffff;
		margin: 38rpx auto;
	}
	
	.con-header {
		background: #F7EEE1;
		padding: 32rpx;
	}

	.con-title {
		font-size: 40rpx;
		margin-bottom: 20rpx;
	}

	.con-text {
		font-size: 24rpx;
		color: #999;
	}
</style>