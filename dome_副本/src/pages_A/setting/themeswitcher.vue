<template>
	<view class="page-container" :data-theme="pageTheme">
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="主题色选择" bgColor="transparent" @leftClick="toBack" placeholder
					:fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<!-- 主题切换器组件 -->
		<theme-switcher />
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { toNav, toBack } from '@/utils/route';
	// 主题切换
	import { useThemeStore } from '@/stores/theme';
	import { storeToRefs } from 'pinia';
	const themeStore = useThemeStore();
	const { theme } = storeToRefs(themeStore);


	// 组件
	import ThemeSwitcher from '@/components/ThemeSwitcher.vue';


	// 页面数据
	const pageTheme = ref(theme.value);
	const currentTheme = computed(() => theme.value);
	const storedTheme = ref('');
	const showDebug = ref(false);
	const pagePath = ref('');
	const isCSSVariablesWorking = ref(false);
	const cssVariables = ref({});

	// 生命周期
	onLoad(() => {
		console.log('页面加载');

		// 获取当前页面路径
		const pages = getCurrentPages();
		if (pages.length) {
			const currentPage = pages[pages.length - 1];
			pagePath.value = currentPage.route || '';
		}

		// 读取存储的主题
		try {
			const saved = uni.getStorageSync('app-theme');
			storedTheme.value = saved || '无';
		} catch (e) {
			storedTheme.value = '读取失败';
		}

		// 检查CSS变量
		checkCSSVariables();
	});

	onShow(() => {
		console.log('页面显示，当前主题:', currentTheme.value);
		pageTheme.value = currentTheme.value;
	});

	// 监听主题变化
	const themeChangeHandler = (newTheme : string) => {
		console.log('页面收到主题变化:', newTheme);
		pageTheme.value = newTheme;

		// 更新存储的主题显示
		try {
			const saved = uni.getStorageSync('app-theme');
			storedTheme.value = saved;
		} catch (e) {
			console.error('读取存储失败:', e);
		}

		// 重新检查CSS变量
		setTimeout(() => {
			checkCSSVariables();
		}, 100);
	};

	// 注册事件监听
	onMounted(() => {
		uni.$on('themeChanged', themeChangeHandler);
	});

	// 清理事件监听
	onUnmounted(() => {
		uni.$off('themeChanged', themeChangeHandler);
	});

	// 检查CSS变量是否生效
	const checkCSSVariables = () => {
		// #ifdef H5
		if (typeof document !== 'undefined') {
			const html = document.documentElement;
			const computedStyle = getComputedStyle(html);

			cssVariables.value = {
				textColor: computedStyle.getPropertyValue('--text-color').trim(),
				bgColor: computedStyle.getPropertyValue('--background-color').trim(),
				primary: computedStyle.getPropertyValue('--primary-color').trim(),
			};

			isCSSVariablesWorking.value = cssVariables.value.textColor !== '';
			console.log('CSS变量状态:', cssVariables.value);
		}
		// #endif

		// #ifndef H5
		isCSSVariablesWorking.value = true; // 小程序默认认为生效
		// #endif
	};
</script>

<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}

	.page-container {
		// min-height: 100vh;
		// padding: 30rpx;

		transition: all 0.3s ease;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid var(--border-color);
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		color: var(--text-color);
	}

	.current-theme {
		font-size: 28rpx;
		color: var(--primary-color);
		background-color: rgba(59, 130, 246, 0.1);
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
	}

	.demo-content {
		margin-top: 40rpx;
	}

	.demo-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: var(--text-color);
		margin-bottom: 30rpx;
	}

	.color-demo {
		display: flex;
		gap: 20rpx;
		margin-bottom: 40rpx;
		flex-wrap: wrap;
	}

	.color-box {
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 24rpx;
		font-weight: bold;
	}

	.text-demo {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		margin-bottom: 40rpx;
	}

	.text-demo text {
		font-size: 32rpx;
		font-weight: 500;
	}

	.theme-button {
		width: 100%;
		margin: 30rpx 0;
	}

	.theme-info {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
		margin-top: 30rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid var(--border-color);
		font-size: 26rpx;
		color: var(--text-color);
		opacity: 0.8;
	}

	.debug-panel {
		margin-top: 40rpx;
		padding: 20rpx;
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 12rpx;
		font-size: 24rpx;
		color: var(--text-color);
	}

	.debug-title {
		display: block;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.debug-panel text {
		display: block;
		margin: 5rpx 0;
		word-break: break-all;
	}
</style>