<template>
	<view class="formBox fl-al-ce"  :class="{borBox:borderBotttom}">
		<view class="formBox-label">{{label}}</view>
		<view class="formBox-center" @click="cenClick">
			<slot></slot>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	const emits = defineEmits(["cenClick"]);
	interface Props {
	  label: string;
	  labelWidth?:string;
	  borderBotttom?:boolean;
	}
	const props = withDefaults(defineProps<Props>(),{
		borderBotttom:true,
		labelWidth:'160rpx'
	})
	const cenClick = () =>{
		emits('cenClick');
	}
</script>

<style lang="scss" scoped>
	.formBox{
		height: 116rpx;
		.formBox-label{
			width: 160rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}
		.formBox-center{
			width: calc(100% - 160rpx);
		}
		.textBut{
			font-weight: 500;
			font-size: 28rpx;
			color: #FF9600;
			background: none;
			border: 0;
		}
	}
	.borBox{
		border-bottom: 1rpx solid #F2F2F2;
	}
</style>