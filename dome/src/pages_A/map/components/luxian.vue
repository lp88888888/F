<template>
	<view class="container" :data-theme="pageTheme"  style="height: 500rpx; box-sizing: border-box;">
		<view class="headen-tab">
			<view :class="activeTag==index?'headen-list-1':'headen-list'" v-for="(item,index) in invoiceList"
				:key="item.id" @click="selectRoute(index)">
				<view class="tax1">{{ item.rkname }}</view>
				<view class="tax2">{{ item.duration }}</view>
				<view class="tax3"> {{ item.distance }} </view>
			</view>
		</view>
		<view class="headen-dh">
			<view class="headen-left">
				<view class="">小程序不具备导航功能，</view>
				<view class="">请使用对外服务平台APP或其他软件进行导航</view>
			</view>
			<view class="headen-bott" @click="navigateToApp">到这去</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import {openLocation} from '@/utils/util'
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const props = defineProps({
		routelist: {
			default: [],
		},
		tolatitude: {
			type: String,
			default: '',
		},
		tolongitude: {
			type: String,
			default: '',
		},
		toname: {
			type: String,
			default: '',
		},
		
	});
	onMounted(() => {
		getroutelist()
	})
	// 标签列表
	const invoiceList = ref([
	])

	// 当前选中标签
	const activeTag = ref(0)
	const emit = defineEmits<{
		(e : 'call-parent', data : string) : void
	}>()
	// 选择路线事件
	const selectRoute = (item) => {
		emit('qiehuantab', item)
		activeTag.value = item;
		console.log('选择了路线:', item);
	}
	const getroutelist = () => {
		console.log(invoiceList.value, 'invoiceList.value')
		invoiceList.value = props.routelist
		if (props.routelist.length > 0) {
			invoiceList.value[0].rkname = '最优路线'
		}
		if (
			props.routelist.length == 2
		) {
			invoiceList.value[1].rkname = '大家常走'
		}
		if (
			props.routelist.length == 3
		) {
			if (invoiceList.value[1].toll > invoiceList.value[2].toll) {
				invoiceList.value[1].rkname = '收费少'
				invoiceList.value[2].rkname = '大家常走'
			} else {
				invoiceList.value[1].rkname = '大家常走'
				invoiceList.value[2].rkname = '收费少'
			}
		}
		console.log(invoiceList.value, 'invoiceList.value')
	}
	// 导航到外部应用
	// const navigateToApp = () => {
	// 	if (activeTag.value) {
	// 		uni.showToast({
	// 			title: `已选择${invoiceList.value[activeTag.value - 1].rkname}，请打开外部导航应用`,
	// 			icon: 'none'
	// 		});
	// 	} else {
	// 		uni.showToast({
	// 			title: '请选择一条路线',
	// 			icon: 'none'
	// 		});
	// 	}
	// }
	const navigateToApp = () => {
		openLocation({
			latitude: props.tolatitude,//维度
			longitude: props.tolongitude,//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name: props.toname,
		})
	}
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);


	}

	.headen-tab {
		margin: 30rpx;
		display: flex;
		align-items: center;
		height: 210rpx;
		background: var(--success-color);
		border-radius: 30rpx;
		border: 3px solid #FFFFFF;
	}

	.headen-list {
		min-width: calc(33% - 20px);
		background-color: #f9f9f9;
		border-radius: 8px;
		padding: 10px;
		text-align: center;
		cursor: pointer;
		transition: background-color 0.3s;
		color: #000000;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.tax3 {
			font-weight: 500;
			font-size: 22rpx;
			color: #999999;
		}
	}

	.headen-list-1 {
		min-width: calc(33% - 20px);
		background-color: #f9f9f9;
		border-radius: 8px;
		padding: 10px;
		text-align: center;
		cursor: pointer;
		transition: background-color 0.3s;
		color: var(--primary-color);
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.tax3 {
			font-weight: 500;
			font-size: 22rpx;
			color: var(--primary-color);
		}
	}

	.tax1 {
		font-weight: bold;
		font-size: 22rpx;
		margin-bottom: 25rpx;
	}

	.tax2 {
		font-weight: bold;
		font-size: 34rpx;
		margin-bottom: 25rpx;
	}


	.headen-dh {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 118rpx;
		background-color: #fff;
		padding: 40rpx;
	}

	.headen-left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-weight: 500;
		font-size: 20rpx;
		color: #666666;
		line-height: 40rpx;
	}

	.headen-bott {
		width: 230rpx;
		height: 78rpx;
		background: var(--secondary-color);
		border-radius: 39rpx;
		color: #fff;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s;
		text-align: center;
		line-height: 78rpx;

	}
</style>