<template>
	<view class="container">
		<cos-header title='退租' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="90"></cos-header>
		<view class="content" :style="{ paddingTop: navBarHeight + 'px' }">
			<view>
				
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { imgUrl } from '../../config';
	import CosHeader from '@/components/customNavBar/index.vue';
	
	const backgroundColor = ref<string>('#FFFFFF');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44 是默认导航栏高度
	});
</script>

<style lang="scss" scoped>>
	.container {
		padding: 32rpx;
		background-color: #F1EFEC;
		min-height: 100vh;
	}
</style>