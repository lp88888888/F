<template>
	<view class="container" :data-theme="pageTheme">
		<u-sticky z-index="99999">
			<view class="searchView">
				<up-navbar title="收货地址" @leftClick="toBack" bgColor="transparent" placeholder fixed></up-navbar>
			</view>
		</u-sticky>
		<view class="address-page" :style="{ paddingTop: '25rpx' }">
			<scroll-view scroll-y class="address-list" :style="{ height: scrollHeight }">
				<view v-for="(item, index) in addressList" :key="item.id" class="address-card" @click="onCardClick(item)">
					<view class="address-info">
						<view class="user-info">
							<text class="name">{{ item.consignee }}</text>
							<text class="phone">{{ item.mobile }}</text>
							<view class="tag" :class="item.label == 'company' ? 'tag-error' : 'tag-warning'" v-if="item.tag">
								{{ item.tag }}
							</view>
						</view>
						<view class="address-detail"> {{ item.province }}{{ item.city }}{{ item.area }}{{ item.addr }} </view>
					</view>

					<view class="address-actions">
						<view class="flex ali-cen" @click.stop="setDefault(index, item)">
							<image
								style="width: 35rpx; height: 35rpx"
								:src="item.defaultFlag == 1 ? imgUrl + 'car_select.png' : imgUrl + 'car_normal.png'"
								mode=""
							/>
							<text class="default-text">设为默认</text>
						</view>
						<view class="action-buttons">
							<view class="btn" @click.stop="deleteAddress(index, item.addrId)">删除</view>
							<view class="btn" @click.stop="editAddress(item.addrId)">修改</view>
						</view>
					</view>
				</view>

				<ser-empty v-if="!addressList.length"></ser-empty>
			</scroll-view>

			<view class="add-address" v-if="istype!=1" >
				<view class="add-btn" @click="addAddress">+新增收货地址</view>
			</view>
		</view>
		<PageDurationTracker pageName="收货地址" />
	</view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { toBack } from '@/utils/route';
import { imgUrl } from '@/config';
import { getMemberDeliveryAddress, updateDfMemberDeliveryAddress, deleteMemberDeliveryAddress, saveOrUpdateMemberDeliveryAddress } from '@/api/user';

// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);
const fontColor = ref<string>('#000');
const fixed = ref<boolean>(true);
const navBarHeight = ref(0);
onMounted(() => {
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = sysInfo.statusBarHeight + 44;
});

// 是否从“积分弹窗选择地址”入口进入
const fromSelect = ref(false);
const istype= ref(null)
// 地址类型（用 any 防止你后端字段不一致时报错）
interface AddressItem {
	[key: string]: any;
}

const scrollHeight = ref('0px');
const defaultAddress = ref('');
const addressList = ref<AddressItem[]>([]);

// 计算滚动区域高度
const calculateScrollHeight = () => {
	const systemInfo = uni.getSystemInfoSync();
	scrollHeight.value = `${systemInfo.windowHeight - 60}px`;
};

// 选中卡片：在“选择模式”下把地址回传给上一页（弹窗所在页面）
const onCardClick = (item: AddressItem) => {
	uni.setStorageSync('address1', item);
	if (!fromSelect.value) return;

	const pages = getCurrentPages();
	const currentPage: any = pages[pages.length - 1];
	const eventChannel = currentPage.getOpenerEventChannel ? currentPage.getOpenerEventChannel() : null;

	if (eventChannel) {
		const fullAddress = (item.province || '') + (item.city || '') + (item.area || '') + (item.addr || '');
		eventChannel.emit('chooseAddressCb', {
			id: item.addrId || item.id,
			fullAddress: fullAddress || item.addr || '',
		});
	}

	uni.navigateBack();
};

// 设置默认地址
const setDefault = (index: number, item: any) => {
	// 先将所有地址设为非默认
	addressList.value.forEach((addr) => {
		addr.defaultFlag = 0;
	});
	// 当前选中地址为默认
	addressList.value[index].defaultFlag = 1;
	const params = { ...item, defaultFlag: 1 };

	saveOrUpdateMemberDeliveryAddress(params).then(() => {
		getAddressList();
		onCardClick(item);
	});
};

// 删除地址
const deleteAddress = (index: number, addrId: any) => {
	uni.showModal({
		title: '提示',
		content: '确定要删除该地址吗？',
		success: (res) => {
			if (res.confirm) {
				deleteAddressFun(addrId, index);
			}
		},
	});
};

const deleteAddressFun = async (id: string, index: number): Promise<void> => {
	try {
		const res: DeleteAddressResponse = await deleteMemberDeliveryAddress(id);
		console.log('地址删除成功', res);
		if (res?.code == 200) {
			// 使用 Vue 的响应式方法或直接操作
			addressList.value.splice(index, 1);
			uni.showToast({
				title: '删除成功',
				icon: 'success',
				duration: 2000,
			});
		} else {
			// 处理非200响应
			const errorMessage = res?.message || '删除失败，请重试';
			throw new Error(errorMessage);
		}
		getAddressList();
	} catch (error) {
		// 友好的错误提示
		uni.showToast({
			title: error.msg,
			icon: 'none',
			duration: 2000,
		});

		// 可以根据错误类型执行不同的处理逻辑
		// 例如：重新尝试、记录错误日志等
	} finally {
		// 可以在这里添加一些清理操作
		// 例如：隐藏加载状态等
	}
};
// 编辑地址
const editAddress = (id: string) => {
	uni.navigateTo({
		url: `/pages_A/address/edit?id=${id}`,
	});
};

// 新增地址
const addAddress = () => {
	uni.navigateTo({
		url: '/pages_A/address/edit',
	});
};

onLoad((options: any) => {
	calculateScrollHeight();
	// 是否从积分弹窗选择入口进入
	istype.value = options.type
	if (options && options.from === 'select') {
		fromSelect.value = true;
	}

	const defaultItem = addressList.value.find((item) => item.isDefault);
	if (defaultItem) {
		defaultAddress.value = defaultItem.id;
	}
});

const getAddressList = async () => {
	const params = {
		memberId: uni.getStorageSync('userInfo').id,
		pageNum: 1,
		pageSize: 99,
		status: 1,
	};
	const res: any = await getMemberDeliveryAddress(params);
	console.log('地址列表的数据', res);
	addressList.value = res.rows || [];
};

// 设置默认地址接口调用
const defaultselectionFun = async (val: string) => {
	const params = { id: val };
	const res: any = await updateDfMemberDeliveryAddress(params);
	if (res?.code == '200') {
		uni.showToast({
			title: '已设为默认地址',
			icon: 'success',
		});
	}
};

// 删除接口
// const deleteAddressFun = async (val : string, index : number) => {
// 	const res : any = await deleteMemberDeliveryAddress(val);
// 	if (res?.code == '200') {
// 		addressList.value.splice(index, 1);
// 		uni.showToast({
// 			title: '删除成功',
// 			icon: 'success',
// 		});
// 	}
// };

onShow(() => {
	getAddressList();
});
</script>

<style scoped lang="scss">
.searchView {
	background: var(--head-color);
}
.address-page {
	background-color: #f1efec;
	padding-bottom: 120rpx;

	.address-list {
		padding: 32rpx;
		box-sizing: border-box;

		.address-card {
			background-color: #fff;
			border-radius: 20rpx;
			margin-bottom: 24rpx;
			padding: 36rpx 30rpx 17rpx;
		}

		.address-info {
			padding-bottom: 16rpx;
			border-bottom: 1rpx solid #eeeeee;

			.user-info {
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;
				font-size: 30rpx;
				font-weight: bold;

				.name {
					margin-right: 30rpx;
				}

				.phone {
					margin-right: 26rpx;
				}

				.tag {
					padding: 0 4rpx;
					height: 28rpx;
					background: #ffffff;
					border-radius: 6rpx;
					font-weight: 500;
					font-size: 20rpx;
					text-align: center;
					line-height: 28rpx;
				}

				.tag-error {
					border: 1px solid #ff3c00;
					color: #ff3c00;
				}

				.tag-warning {
					border: 1px solid $color;
					color: $color;
				}
			}

			.address-detail {
				font-size: 28rpx;
				color: #333;
				line-height: 1.5;
			}
		}

		.address-actions {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 16rpx;

			.default-text {
				font-size: 24rpx;
				color: #333;
				margin-left: 12rpx;
			}

			.action-buttons {
				display: flex;

				.btn {
					width: 116rpx;
					height: 50rpx;
					background: #f6f6f6;
					border-radius: 25rpx;
					margin-left: 20rpx;
					font-weight: 500;
					font-size: 24rpx;
					color: #000000;
					line-height: 50rpx;
					text-align: center;
				}
			}
		}
	}

	.add-address {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 15rpx 32rpx 63rpx;
		background-color: #fff;

		.add-btn {
			height: 80rpx;
			background: var(--but-color-line);
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #ffffff;
			text-align: center;
			line-height: 80rpx;
		}
	}
}
</style>
