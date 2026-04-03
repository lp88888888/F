<template>

	<view class="page" :data-theme="pageTheme">
		<up-sticky>
			<view class="searchView" >
				<up-navbar :bgColor="themeStore.themeColors.$color2" :title='titer' @leftClick="toBack" placeholder fixed></up-navbar>
			</view>
		</up-sticky>
	<image class="top1-pgone-2" :src="imgUrl+'points-rulrs-img.png'" mode="aspectFill">
	</image>
	<PageDurationTracker pageName="积分规则" />
	</view>
</template>

<script setup lang="ts">
	import {
		imgUrl,
	} from '../../config';
	import {
		ref,
		reactive,
		computed
	} from 'vue';

	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	import { onLoad } from '@dcloudio/uni-app'
	import { toNav, toBack } from '@/utils/route';
	const userinfo = ref(uni.getStorageSync('userInfo'))
	const titer=ref('积分规则')
	onLoad((option) => {
		if(option.type==1){
			titer.value='会员规则'
		}else{
			titer.value='积分规则'
		}
	})

</script>

<style scoped lang="scss">
	.page {
		min-height: 100vh;
		background: var(--head-color);
	}
.top1-pgone-2{
	width: 750rpx;
	height: 3008rpx;
}
</style>