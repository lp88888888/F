<template>
	<view class="page_box">
		<up-navbar title="积分明细" bgColor="transparent" placeholder autoBack :fixed="true"></up-navbar>

		<view class="jf_box">
			<view class="jf_text">
				<text>我的有效通行</text>
				<view class="">
					<text>458</text>
					<text>km</text>
				</view>
			</view>
			<view class="jf_text">
				<text>我的奖励积分</text>
				<view class="">
					<text>458</text>
					<text>分</text>
				</view>
			</view>
			<image class="jf_icon" src="/src/static/tabbar/tabbar-points.png" mode=""></image>
		</view>

		<view class="screen_box">
			<picker mode="selector" :range="array" @change="handlePickerChange">
				<view class="picker_view">
					<text class="picker_text">{{ selectedOption ? array[selectedOption] : '请选择个人或企业' }}</text>
					<uni-icons type="bottom" color="#333333" size="18"></uni-icons>
				</view>
			</picker>
			<view class="screen_r" @click="handlePop">
				<image class="screen_icon" src="/src/static/tabbar/tabbar-points.png" mode=""></image>
				<text>查询条件</text>
			</view>
		</view>

		<view class="list_box">
			<view class="list_item" v-for="(item, index) in 3" :key="index">
				<view class="item_tome">今天{{ index + 1 }}号</view>
				<view class="item_slist" v-for="(item1, index1) in 3" :key="index1">
					<view class="slist_t">
						<image src="/src/static/tabbar/tabbar-points.png" mode="scaleToFill" />
						<text>打卡</text>
						<text>+99</text>
					</view>
					<view class="slist_b">
						<text>2026-03-02 15:20:30</text>
						<text>余额9999989</text>
					</view>
				</view>
			</view>
		</view>

		<up-popup :show="popshow" mode="top" closeable @close="handleClose">
			<view class="popup_box">
				<view class="pop_head">
					<text>筛选条件</text>
				</view>
				<view class="pop_item">
					<text>积分事件</text>
					<view></view>
					<text>变动方式</text>
					<view></view>
					<view>查询</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const selectedOption = ref('');
const array = ref(['中国', '美国', '巴西', '日本']);
const handlePickerChange = (e) => {
	console.log('请选择个人或企业:', e.detail.value);
};

const popshow = ref(false);
const handlePop = () => {
	console.log('查询条件');
	popshow.value = true;
};
const handleClose = () => {
	popshow.value = false;
};
</script>

<style lang="scss" scoped>
view,
text {
	box-sizing: border-box;
}
.page_box {
	width: 750rpx;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 100rpx;
	.jf_box {
		width: 690rpx;
		height: 188rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0px 0px 20rpx 0px #e7ebf1;
		padding: 36rpx 0 36rpx 30rpx;
		margin-bottom: 47rpx;
		.jf_text {
			flex: 1 0;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			color: #333333;
			> text:nth-child(1) {
				font-size: 28rpx;
			}
			view {
				text:nth-child(1) {
					font-weight: 500;
					font-size: 36rpx;
				}
				text:nth-child(2) {
					font-weight: 500;
					font-size: 24rpx;
				}
			}
		}
		.jf_icon {
			width: 188rpx;
			height: 188rpx;
		}
	}

	.screen_box {
		width: 690rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 26rpx;
		.picker_view {
			display: flex;
			align-items: center;
			.picker_text {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				margin-right: 10rpx;
			}
		}
		.screen_r {
			display: flex;
			align-items: center;
			.screen_icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
			text {
				font-size: 24rpx;
				color: #333333;
			}
		}
	}

	.list_box {
		width: 690rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		box-shadow: 0px 0px 20rpx 0px #e7ebf1;
		padding: 20rpx 32rpx;

		.list_item {
			.item_tome {
				font-size: 24rpx;
				color: #333333;
				margin-bottom: 6rpx;
			}
			.item_slist {
				width: 100%;
				height: 130rpx;
				border-bottom: 1px dashed #e7ebf1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 30rpx 8rpx 20rpx 0;
				.slist_t {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					image {
						width: 28rpx;
						height: 28rpx;
						margin-right: 6rpx;
					}
					text:nth-child(2) {
						flex: 1 0;
						font-size: 28rpx;
						color: #333333;
					}
					text:nth-child(3) {
						font-size: 32rpx;
						color: #333333;
					}
				}
				.slist_b {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					text {
						font-size: 24rpx;
						color: #999999;
					}
				}
			}
			.item_slist:last-child {
				margin-bottom: 40rpx;
			}
		}
	}

	.popup_box{
		width: 750rpx;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		background-color: #FFFFFF;
		.pop_head{
			width: 100%;
			height: 116rpx;
			text-align: center;
			line-height: 116rpx;
			font-size: 32rpx;
			color: #333333;
		}
	}
}
</style>
