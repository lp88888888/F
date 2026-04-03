<template>
	<view>
		<CareerPoster :posterData="posterData"></CareerPoster>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import CareerPoster from "@/components/Share/poster/CareerPoster.vue";
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const posterData = {
		name: '西安城墙碑林历史文化景区',
		logo:imgUrl+'del/newCar-banner.png',
		title: '西安城墙碑林历史文化景区',
		backImg:imgUrl+'static/shear-bg-icon1.png',
		QrCodeObj:{
			scene:`id=2222`,
			page:'',
			width:280,
			is_hyaline:false,
			env_version:'develop',// 正式版为 "release"，体验版为 "trial"，开发版为 "develop"
		}
	}
	
</script>

<style lang="scss" scoped>
	
</style>