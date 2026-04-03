<template>
	<view class="pagess" :data-theme="pageTheme">
		<up-navbar title="确认支付" :bgColor="backgroundColor" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
		<view class="centerBox">
			<up-image :src="imgUrl + 'paysecc.png'" width="120rpx" height="120rpx"></up-image>
			<up-gap height="16"></up-gap>
			<view class="textBox">
				<text class="textBox-item">支付成功</text>
			</view>
			<template v-if="pageType == 'yearsCard'">
				<up-gap height="32"></up-gap>
				<!-- <view class="textBox"> 
					<text class="textBox-item2">兑换码:{{exchangeCode}}</text>
					<text class="textBox-copy m-l-20" @click="copyText(exchangeCode)">复制</text>
				</view> -->
			</template>
			<up-gap height="55"></up-gap>
			<view class="butBox butIcon1" :style="{ background: themeStore.themeColors.$bgLgColor }" @click="toRec('/pages_B/scenicSpotTicket/myOlderList')"
				>查看我的订单</view
			>
			<up-gap height="20"></up-gap>
			<view
				class="butBox butIcon2"
				:style="{
					color: themeStore.themeColors.$pColor,
					borderColor: themeStore.themeColors.$pColor,
				}"
				@click="toHome"
				>返回首页</view
			>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toRec, toHome } from '@/utils/route';
import { copyText } from '@/utils/util';
import { imgUrl } from '@/config';
import { onLoad } from '@dcloudio/uni-app';
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = computed(() => themeStore.imgUrl);
const backgroundColor = ref<string>('transparent');
const pageType = ref('yearsCard');
const exchangeCode = ref<string>('0000000909090909');

onLoad((opticon) => {
	if (opticon.type) pageType.value = opticon.type;
	if (opticon.code) exchangeCode.value = opticon.code;
});
</script>

<style lang="scss">

.pagess {
		background: var(--head-color);
	}
.centerBox {
	min-height: 80vh;
	padding-top: 80rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.textBox {
	.textBox-item {
		font-weight: 400;
		font-size: 32rpx;
		color: #999999;
		line-height: 32rpx;
	}

	.textBox-item2 {
		font-weight: 400;
		font-size: 28rpx;
		color: #999999;
		line-height: 28rpx;
	}

	.textBox-copy {
		font-weight: 700;
		font-size: 28rpx;
		color: #ff9000;
		line-height: 28rpx;
	}
}

.butBox {
	width: 540rpx;
	height: 96rpx;
	border-radius: 48rpx 48rpx 48rpx 48rpx;
	font-size: 32rpx;
	line-height: 96rpx;
	text-align: center;
}

.butIcon1 {
	background: #00bebe;
	border-radius: 48rpx 48rpx 48rpx 48rpx;
	font-weight: 700;
	color: #ffffff;
}

.butIcon2 {
	background: linear-gradient(180deg, #f0f0f0 0%, #cbcbcb 100%);
	font-weight: 400;
	background: #ffffff;
	border-radius: 48rpx 48rpx 48rpx 48rpx;
	border: 2rpx solid #00bebe;
	color: #00bebe;
}
</style>
