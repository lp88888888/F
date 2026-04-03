<template>
	<view class="pageView" :data-theme="pageTheme" >
		<up-index-list v-if="indexList.length > 0 && itemArr.length > 0" activeColor="#FF9600" :index-list="indexList" customNavHeight="0">
			<template v-for="(item, index) in itemArr">
				<up-index-item>
					<view class="indText">{{indexList[index]}}</view>
					<view class="listView">
						<view v-for="(cell, indesx) in item" :key="indesx">
							<view class="list-cell" @click="seriesClick(cell)">
									<!-- <view class="list-cell-icon">
										<image :src="imgUrl+'static/B-direct-log-icon.png'" mode="heightFix"></image>
									</view> -->
								<view class="list-cell-text">{{cell}}</view>
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
		return ['A','P','S','H']
	})
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const itemArr = ref([
	  ['朗逸', '朗逸纯电'],
	  ['Polo', '帕萨特', '帕萨特 插电混动', 'Polo(海外)'],
	  ['桑塔纳'],
	  ['辉昂', '辉昂 插电混动']
	]);
	
	// 车系选择
	const seriesClick = (item)=>{
		if(pageType.value == 'select'){
			uni.setStorageSync('selectBrandSeries',{brandName:'上汽大众',seriesName:item})
			
		}
		toBack(2);
	}
	onLoad((opticon)=>{
		if(opticon.type) pageType.value = opticon.type
		uni.setNavigationBarTitle({
		  title: '上汽大众'
		})
	})
</script>

<style lang="scss">
	.pageView{
		padding: 0 40rpx 40rpx 40rpx;
		box-sizing: border-box;
		background: var(--head-color);
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