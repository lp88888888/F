<template>
	<view class="pageView">
		<up-index-list v-if="indexList.length > 0 && itemArr.length > 0" activeColor="#FF9600" :index-list="indexList" customNavHeight="0">
			<template v-for="(item, index) in itemArr">
				<up-index-item>
					<view class="indText">{{indexList[index]}}</view>
					<view class="listView">
						<view v-for="(cell, indesx) in item" :key="indesx">
							<view class="list-cell" @click="toNav('/pages_D/usedCar/series?type='+pageType)">
									<view class="list-cell-icon">
										<image :src="cell.icon" mode="heightFix"></image>
									</view>
								<view class="list-cell-text">{{cell.name}}</view>
							</view>
							<up-line v-if="indesx < (item.length - 1)" color="#F5F5F5"></up-line>
						</view>
					</view>
				</up-index-item>
			</template>
		</up-index-list>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import { onLoad } from '@dcloudio/uni-app';
	const pageType = ref<string>('');
	const indexList  = computed(()=>{
		return ['A','B']
	})
	const itemArr = ref([
	  [{name:'奥迪',icon:imgUrl+'del/car-brand-1.png'}, 
	  {name:'埃安',icon:imgUrl+'del/car-brand-2.png'}, 
	  {name:'阿莫迪罗',icon:imgUrl+'del/car-brand-3.png'}, 
	  {name:'AEV ROBOTICS',icon:imgUrl+'del/car-brand-4.png'},
	  {name:'阿斯顿·马丁',icon:imgUrl+'del/car-brand-5.png'},
	  ],  
	  [
		  {name:'本田',icon:imgUrl+'del/car-brand-6.png'}, 
		  {name:'奔驰',icon:imgUrl+'del/car-brand-7.png'}, 
		  {name:'宝马',icon:imgUrl+'del/car-brand-8.png'}, 
		  {name:'别克',icon:imgUrl+'del/car-brand-9.png'}, 
		  {name:'比亚迪',icon:imgUrl+'del/car-brand-10.png'}, 
	  ],
	  // ['长安', '长安起源', '长城', '长安凯程', '长安跨越', '长安欧尚'],
	  // ['大众', '东风风神', '东风风行', '东风奕派', '东风纳米'],
	  // ['212'],
	  // ['丰田', '方程豹', '福特', '福田', '法拉利', '福特'],
	]);
	
	onLoad((opticon)=>{
		if(opticon.type) pageType.value = opticon.type
	})
</script>

<style lang="scss">
	page{
		background: #F1EFEC;
	}
	.pageView{
		padding: 0 40rpx 40rpx 40rpx;
		box-sizing: border-box;
	}
	.listView{
		width: 100%;
		background: #FFFFFF;
		border-radius: 30rpx;
		padding: 0 32rpx;
		box-sizing: border-box;
	}
	.list-cell {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		height: 120rpx;
		// padding: 20rpx 24rpx;
		// padding: 0 32rpx;
		overflow: hidden;
		font-size: 14px;
		line-height: 24px;
		
		.list-cell-icon{
			width: 120rpx;
			display: flex;align-items: center;
			justify-content: center;
			image{
				height: 70rpx;
			}
		}
		.list-cell-text{
			font-weight: 700;
			font-size: 28rpx;
			color: #3D3D3D;
			line-height: 28rpx;
		}
	}
	.indText{
		width: 100%;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		font-weight: 500;
		font-size: 28rpx;
		color: #999999;
		padding-left:30rpx;
		box-sizing: border-box;
	}
</style>