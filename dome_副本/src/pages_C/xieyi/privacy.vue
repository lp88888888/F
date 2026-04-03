<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-parse :content="content"></up-parse>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import { richTextList , richTextInfo } from '@/api/config'

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	import { onLoad } from '@dcloudio/uni-app';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const content = ref('')
	const getData = async ()=>{
		let res = await richTextList()
		if(res.code == 200){
			let arr = res.rows.filter(item => item.popupType == '隐私政策弹窗')
			let ress = await richTextInfo(arr[0].id)
			content.value = ress.data.content
		}
	}
	onLoad(()=>{
		getData()
	})
</script>

<style lang="scss" scoped>
	.pageView{
		padding: 20rpx;
		box-sizing: border-box;
	}
</style>