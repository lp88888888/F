<template>
	<view class="searView" :style="searchStyle">
		<up-input :placeholder="placeholder" fontSize="28rpx" border="none" v-model="keyword"></up-input>
		<up-icon name="search" size="22" color="#D8D8D8"></up-icon>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	const keyword = ref('')
	interface Props {
	  bgColor: string
	  radius:string
	  placeholder:string
	}
	const props = withDefaults(defineProps<Props>(), {
		bgColor:'#FCFCFC',
		radius:'8rpx 8rpx 8rpx 8rpx',
		placeholder:'请输入车型名称'
	});
	
	const searchStyle = computed(()=>{
		let style:any = {}
		style.background = props.bgColor;
		style.borderRadius = props.radius;
		return style
	})
</script>

<style lang="scss" scoped>
	.searView{
		width: 100%;
		height: 72rpx;
		// border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #EBEBEB;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
</style>