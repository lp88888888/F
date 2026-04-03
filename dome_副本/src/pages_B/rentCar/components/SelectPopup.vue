<template>
	<up-popup :show="show" mode="top" z-index="999" @close="close">
		<view class="popView">
			<up-gap :height="paddingTop" ></up-gap>
			<up-gap height="10" ></up-gap>
			<template v-if="type == 1">
				<view class="seleItemLine" v-for="(item,index) in options1">{{item.label}}</view>
			</template>
			<view v-if="type == 3">
				
			</view>
			<template v-if="type == 4">
				<view class="popView-title">能源类型</view>
				<view class="popView-cenGrid">
					<view :class="['popView-cenGrid-item',selectLsit.indexOf(item.name) != -1?'gridActive':'']" v-for="(item,index) in energyList" :key="index" @click="selectClick(item)">{{item.name}}</view>
				</view>
				<view class="popView-title">座位数</view>
				<view class="popView-cenGrid">
					<view :class="['popView-cenGrid-item',selectLsit.indexOf(item.name) != -1?'gridActive':'']" v-for="(item,index) in seatList" :key="index" @click="selectClick(item)">{{item.name}}</view>
				</view>
			</template>
			<view class="fiexView">
				<view class="fiexView-item " style="width: 190rpx;" @click="reset">{{type==4?'重置':'清空筛选'}}</view>
				<view class="fiexView-item iconBut" style="width: 470rpx;" @click="submit">确认</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import {ref,computed,reactive} from 'vue';
	import {deepClone} from '@/uni_modules/uview-plus';
	import {formatProvince} from "@/utils/util";
	const emits = defineEmits(["change"]);
	interface Props {
	  paddingTop?: number;
	}
	const props = withDefaults(defineProps<Props>(),{
		paddingTop:160
	})
	const show = ref<boolean>(false);
	const type = ref<0|1|2|3|4>(1); // 1 距离排序，2品牌 ，3价格,4筛选
	const options1 = ref([
	  {
	    label: '默认排序',
	    value: 1,
	  },
	  {
	    label: '距离优先',
	    value: 2,
	  },
	  {
	    label: '价格优先',
	    value: 3,
	  }
	]);
	interface SelectArr {
		name:string
	}
	const energyList = ref<Array<SelectArr>>([{name:'燃油'},{name:'纯电'},{name:'混动'}]);
	const seatList = ref<Array<SelectArr>>([{name:'5座'},{name:'6座'},{name:'7座'}]);
	
	
	const selectLsit = ref([])
	const close = ()=>{
		show.value = false;
		type.value = 0;
		reset()
	}
	const open = (type:number,event)=>{
		show.value = true;
		if(type == 4){
			selectLsit.value = deepClone(event.screenList);
		}
		
		if(type == 1){
			
		}
	}
	
	//
	const selectClick = (item)=>{
		
		if(selectLsit.value.indexOf(item.name) == -1){
			selectLsit.value.push(item.name);
		}else{
			selectLsit.value = selectLsit.value.filter(el => el != item.name);
		}
	}
	// 确定
	const submit = () =>{
		if(type.value == 4){
			emits('change',{
				type:4,
				screenList:selectLsit.value,
			});
		}
		
		if(type.value == 1){}
		close()
	}
	// 清空，重置
	const reset = () =>{
		if(type.value == 4){
			
		}
		if(type.value == 3 || type.value == 2){
			
		}
		selectLsit.value = [];
	}
	defineExpose({
		show,
		type,
		open,
		close
	})
</script>

<style lang="scss" scoped>
	.popView{
		height: 100vh;
		padding: 0 32rpx 0 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		position: relative;
		.seleItemLine{
			height: 80rpx;
			line-height: 90rpx;
			border-bottom: 1rpx solid #EEEEEE;
		}
		.popView-title{
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
			text{
				color: #999999;
				font-weight: 500;
			}
		}
		.seleView{
			width: 686rpx;
			height: 88rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 35rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			
			.seleView-left{
				// width: 400rpx;
				display: flex;
				align-items: center;
				
				.seleView-left-text{
					font-weight: bold;
					font-size: 30rpx;
					color: #000000;
					line-height: 88rpx;
				}
				.selectActive{
					color: #FF9600 !important;
					position: relative;
					.selectActive-line{
						width: 52rpx;
						height: 6rpx;
						background: #FF9600;
						border-radius: 4rpx 4rpx 0rpx 0rpx;
						position: absolute;
						left: calc((100% - 52rpx) / 2);
						bottom: 0;
					}
				}
			}
			.seleView-right{
				font-weight: 500;
				font-size: 24rpx;
				color: #FF9600;
			}
		}
		.popView-cenGrid{
			padding: 30rpx 0;
			width: 100%;
			display: grid;
			grid-template-columns: repeat(4,1fr);
			grid-gap: 22rpx;
			.popView-cenGrid-item{
				width: 100%;
				height: 67rpx;
				line-height: 67rpx;
				text-align: center;
				font-weight: 500;
				font-size: 26rpx;
				color: #333333;
				background: #F5F5F5;
				border-radius: 16rpx;
				border: 1px solid #F5F5F5;
			}
			.gridActive{
				background: #FDF9F5;
				border-radius: 16rpx;
				border: 1px solid #FF9600;
				color: #FF9600;
			}
		}
		
		.fiexView{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 158rpx;
			background: #FFFFFF;
			padding: 15rpx 32rpx 0 32rpx;
			box-sizing: border-box;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			.fiexView-item{
				width: 328rpx;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: #FFFFFF;
				border-radius: 44rpx;
				border: 1px solid #CCCCCC;
				font-weight: 500;
				font-size: 30rpx;
				color: #000000;
			}
			.iconBut{
				background: #FF9600;
				border: 1px solid #FF9600;
				color: #FFFFFF;
			}
		}
	}
	
</style>