<template>
	<view class="pageView">
		<cos-header title='搜索' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="80"></cos-header>
		<ser-empty v-if="!dataList.length"></ser-empty>
		
		<view class="lisBox" :style="{ paddingTop: navBarHeight + 'px' }">
			<view class="fl-al-ce">
				<view class="searBox fl-al-ce">
					<up-icon name="search" color="#333333" size="22"></up-icon>
					<up-input placeholder="请输入商品名称" placeholder-style="font-size: 28rpx;color: #999999;" border="none" :focus="true" fontSize="13" v-model="keyword"></up-input>
				</view>
				<view class="searBox-but fs-32 col3">搜索</view>
			</view>
			<view class="lisView">
				<view class="lisView-item" v-for="(item,index) in dataList" :key="index" @click="toNav('/pages_B/directRetail/shopDetail')">
					<view class="lisView-item-img">
						<image lazy-load :src="imgUrl+item.shopUrl"></image>
					</view>
					<view class="lisView-item-center">
						<view class="lisView-item-shopName">
							<image :src="imgUrl+item.shopUrl"></image>
							<up-text :text="item.shopName" size="11" color="#666666" lines="1"></up-text>
						</view>
						<up-gap height="11"></up-gap>
						<up-text :text="item.name" size="14" color="#000000" lines="1"></up-text>
						<up-gap height="11"></up-gap>
						<view class="lisView-item-price">
							<view class="newPrice"><text style="font-size: 24rpx;">￥</text>{{flPrice(item.price,'left')}}<text style="font-size: 28rpx;">{{flPrice(item.price,'right')}}</text></view>
							<view class="oldPrice">￥{{item.oldPrice}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import GoodsListItemVue from './components/GoodsListItem.vue';
	import CosHeader from '@/components/customNavBar/index.vue';
	import {imgUrl} from '@/config';
	const keyword = ref('');
	const dataList = ref([
		{url:'del/goods1.png',name:'海南香蕉约500克',shopName:'华州服务区超市',price:10.99,oldPrice:15,shopUrl:'del/shopIcon.png'},
		{url:'del/goods2.png',name:'耙耙柑3个约600g',shopName:'华州服务区超市',price:23.01,oldPrice:25,shopUrl:'del/shopIcon.png'},
		{url:'del/goods3.png',name:'陕西特产麻将凉皮',shopName:'华州服务区超市',price:9.00,oldPrice:10,shopUrl:'del/shopIcon.png'},
		{url:'del/goods4.png',name:'洛川苹果4粒 约1.1kg',shopName:'华州服务区超市',price:29.00,oldPrice:32,shopUrl:'del/shopIcon.png'},
	]);
	// 布局
	const backgroundColor = ref<string>("#FFFFFF");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref<number>(0);
	
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});
	
	const flPrice = computed(()=>{
		return (price:string|number,type:string) =>{
			let srt:string = String(Number(price).toFixed(2));
			if(price){
				if(type == 'left'){
					return srt.substring(0,srt.indexOf('.'))
				}else{
					return srt.substring(srt.indexOf('.'))
				}
			}
			return ''
		}
	});
</script>

<style lang="scss" scoped>
	.pageView{
		min-height: 100vh;
		background: $bgTopColor;
	}
	.lisBox{
		padding: 25rpx;
		box-sizing: border-box;
	}
	.searBox{
		width: 610rpx;
		height: 72rpx;
		background: #FFFFFF;
		border-radius: 40rpx;
		padding: 16rpx 28rpx;
		box-sizing: border-box;
		margin-bottom: 28rpx;
		&-but{
			display: inline-block;
			margin-left: 16rpx;
			margin-bottom: 28rpx;
		}
		
		::v-deep.u-icon--right{
			margin-right: 16rpx;
		}
		
		.placeholder {
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
		}
	}
	
	.lisView {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2,1fr);
		grid-gap: 30rpx;
		
		.lisView-item{
			width: 100%;
			padding: 0 25rpx 25rpx 25rpx;
			box-sizing: border-box;
			border-radius: 24rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0,0,0,0.02);
			.lisView-item-img{
				width: 100%;
				height: 328rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width: 240rpx;
					height: 240rpx;
				}
			}
			.lisView-item-center{
				margin-top: -18rpx;
				.lisView-item-shopName{
					width: 100%;
					height: 36rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					border: 1rpx solid #EEEEEE;
					padding: 4rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					image{
						width: 28rpx;
						height: 28rpx;
						border-radius: 8rpx;
						margin-right: 6rpx;
					}
				}
				.lisView-item-price{
					display: flex;
					align-items: flex-end;
					.newPrice{
						color: $color;
						font-weight: bold;
						font-size: 36rpx;
					}
					.oldPrice{
						margin-left: 11rpx;
						color: #BCBCBD;
						font-size: 24rpx;
						text-decoration-line: line-through;
					}
				}
			}
		}
	}
</style>