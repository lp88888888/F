<template>
	<view>
		<view class="orderItem">
			<view class="orderItem-label" :style="{width:labelWidth}">
				<slot name="label">
					{{label}}
				</slot>
			</view>
			<view class="orderItem-text" :style="textStyle">
				<slot name="text">
					{{text}}
					<text v-if="isBut" @click="butClick">{{butText}}</text>
				</slot>
			</view>
		</view>
		<up-line v-if="borderBottom" :color="borderColor"></up-line>
	</view>
</template>
<script setup lang="ts">
	import {ref,computed} from 'vue';
	const emits = defineEmits(["butClick"]);
	interface Props {
		label:string;
		text:string;
		isBut:boolean;
		butText:string;
		borderBottom:boolean;
		borderColor:string;
		labelWidth:string;
		textAlign:string;
	}
	interface TextStyle {
		width?:string;
		textAlign?:string;
	}
	const props = withDefaults(defineProps<Props>(), {
		label:'',
		isBut:false,
		borderBottom:false,
		butText: '复制',
		borderColor:'#EEEEEE',
		labelWidth:'140rpx',
		textAlign:'right'
	});
	
	const butClick = () =>{
		emits('butClick');
	}
	const textStyle = computed(()=>{
		let style:TextStyle = {};
		style.width = `calc(100% - ${props.labelWidth} - 20rpx)`;
		style.textAlign = props.textAlign
		return style
	})
	
	
</script>

<style lang="scss" scoped>
	.orderItem{
		width: 100%;
		display: flex;
		// align-items: center;
		justify-content: space-between;
		padding: 36rpx 0;
		
		.orderItem-label{
			font-weight: 500;
			font-size: 26rpx;
			color: #666666;
		}
		.orderItem-text{
			font-weight: 500;
			font-size: 28rpx;
			color: #333333;
			text{
				display: inline-block;
				width: 56rpx;
				height: 28rpx;
				line-height: 28rpx;
				text-align: center;
				background: #FFFFFF;
				border-radius: 6rpx;
				border: 1px solid #CCCCCC;
				font-weight: 500;
				font-size: 20rpx;
				color: #666666;
			}
		}
	}
</style>