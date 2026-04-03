<template>
	<view class="container">
		<cos-header title='通知设置' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100"></cos-header>

		<view class="u-cell" :style="{ paddingTop: navBarHeight + 'px' }">
			<up-cell-group v-for="(item, index) in dataInfo" :key="index">
				<up-cell :title="item.messageTypeName" :border="false">
					<template #value>
						<view class="cell-h">
							<up-switch :activeColor="themeStore.themeColors.$primaryColor" size="28" v-model="item.enableFlag"
								@change="() => changeEvt(item, item.enableFlag)"></up-switch>
						</view>
					</template>
				</up-cell>
				<view class="solt-card" v-if="item.childreList" v-for="(it, idx) in item.childreList" :key="idx">
					<up-cell :title="it.messageTypeName" :border="false">
						<template #value>
							<view class="cell-h">
								<up-switch :activeColor="themeStore.themeColors.$primaryColor" size="24" v-model="it.enableFlag"
									@change="() => changeChildEvt(it, it.enableFlag)"></up-switch>
							</view>
						</template>
					</up-cell>
				</view>
			</up-cell-group>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		imgUrl,
	} from '../../config';
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive
	} from 'vue';

	import CosHeader from '@/components/customNavBar/index.vue';
	import { getMessageTypeByMemberId, changeMessageTypeEnableStatus } from '@/api/user';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	const backgroundColor = ref<string>("#FFFFFF");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const dataInfo = ref([])

	// 处理父级开关切换
	const changeEvt = async (item, status) => {
		console.log('父级状态', status);
		// 更新父级状态
		// item.enableFlag = !status;
		// 同步更新所有子级的状态
		if (item.childreList) {
			item.childreList.forEach(child => {
				child.enableFlag = status;
			});
		}
		const params = {
			messageTypeId: item.messageTypeId,
			enableFlag: status
		};
		console.log('父级参数', params);
		await changeMessageTypeEnableStatus(params);
		getMessageType();
	};

	// 处理子级开关切换
	const changeChildEvt = async (it, status) => {
		console.log('子级状态', status);
		// it.enableFlag = !status;  // 更新子级状态
		const params = {
			messageTypeId: it.messageTypeId,
			enableFlag: status
		};
		console.log('子级参数', params);
		await changeMessageTypeEnableStatus(params);
		getMessageType();
	};

	// 获取消息类型
	const getMessageType = async () => {
		const res = await getMessageTypeByMemberId();
		dataInfo.value = res.clazz;
	};

	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});

	onLoad(() => {
		getMessageType();
	})
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background: #F1EFEC;
	}

	::v-deep .u-cell-group {
		background: #fff;
		margin: 30rpx 32rpx;
		border-radius: 20rpx;
		padding: 0 32rpx 20rpx;
	}

	.no-bottom ::v-deep .u-cell-group {
		padding-bottom: 0;
	}

	::v-deep .u-cell__title-text,
	::v-deep .u-icon__icon--info {
		font-weight: 500;
		font-size: 30rpx !important;
		color: #000000 !important;
	}

	::v-deep .u-cell__body {
		padding: 30rpx 0 !important;
	}

	::v-deep .u-cell {
		border-radius: 20rpx;
	}

	.solt-card {
		::v-deep .u-cell__body {
			background: #F7F8F9 !important;
			margin-bottom: 20rpx;
			border-radius: 24rpx;
			padding: 30rpx !important;
			padding-bottom: 20rpx;
		}
	}

	.no-padding-bottom {
		padding-bottom: 0 !important;
	}
</style>
