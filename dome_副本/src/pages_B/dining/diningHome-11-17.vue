<template>
	<view class="page-container">
		<up-sticky z-index="8888">
			<view class="topBox">
				<up-navbar title="宝鸡西服务区餐厅" bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" placeholder :fixed="false" :titleStyle="{fontWeight:'bold'}"></up-navbar>
			</view>
		</up-sticky>
		<view id="topCard" class="topCard">
			<up-image :src="imgUrl+'static/din-xb-2.png'" width="100%" height="380rpx" radius="26rpx" lazyLoad></up-image>
			<view class="fl-ce-sb m-t-20">
				<view class="leftBox">
					<image :src="imgUrl+'hotel-banner.png'" mode></image>
					<view class="leftBox-text texNoWrap">宝鸡西服务区</view>
				</view>
				<view class="rightBox">
					<view class="fl-ce-sb">
						<view class="nameBox">宝鸡西服务区餐厅</view>
						<view class="iconBox" @click="toNav('./diningDetail')">详情</view>
					</view>
					<view class="csBox m-t-20">
						<view class="csBox-item">
							<text class="csBox-item-name">评分</text>
							<text class="csBox-item-value">4.8</text>
						</view>
						<view class="csBox-HHH"></view>
						<view class="csBox-item">
							<text class="csBox-item-name">月售</text>
							<text class="csBox-item-value">2000+</text>
						</view>
						<view class="csBox-HHH"></view>
						<view class="csBox-item">
							<text class="csBox-item-name">人均</text>
							<text class="csBox-item-value">￥25</text>
						</view>
						<view class="csBox-HHH"></view>
						<view class="csBox-item">
							<text class="csBox-item-name">营业时间</text>
							<text class="csBox-item-value">08:00~23:00</text>
						</view>
					</view>
				</view>
			</view>
			<view class="addrBox fl-ce-sb">
				<view class="fl-al-ce">
					<up-icon name="map" size="12" color="#000000"></up-icon>
					<text class="font1 texNoWrap m-l-10">宝鸡市渭滨区宝鸡西服务区</text>
				</view>
				<view class="fl-al-ce">
					<text class="font1 m-r-10">距您30.6km</text>
					<up-icon name="arrow-right" size="12" color="#000000"></up-icon>
				</view>
			</view>
		</view>
		<up-gap height="15"></up-gap>
		<view class="cardBotBox">
			<view class="botTabs fl-al-ce">
				<view class="botTabs-item"  @click="tabsChange(1)">
					<view :class="['botTabs-item-text',typePage ==1?'botTabsActibe':'']">点餐</view>
					<view class="botTabs-item-line" v-if="typePage ==1"></view>
				</view>
				<view class="botTabs-item" @click="tabsChange(2)">
					<view :class="['botTabs-item-text',typePage ==2?'botTabsActibe':'']">评价<text> ({{pjList.length}})</text></view>
					<view class="botTabs-item-line" v-if="typePage ==2"></view>
				</view>
			</view>
			<up-gap height="5" bgColor="#FFFFFF"></up-gap>
			<view v-if="typePage == 1" style="background: #FFFFFF;">
				<view class="tjBox">
					<view class="tjBox-title">
						今日推荐</view>
						<image class="wenzibj" :src="imgUrl+'static/bj-bgz-gb.png'" mode></image>
					<view class="tjGrod">
						<view class="tjGrod-item" v-for="(item,index) in recommendList" :key="index" @click="toNav('./goodsDetail')">
							<image class="tjGrod-item-img" :src="imgUrl+'hotel-banner.png'" mode></image>
							<view class="tjGrod-item-cent">
								<view class="tjGrod-item-name">{{item.name}}</view>
								<view class="fl-ce-sb">
									<view class="tjPrice">
										<text class="fs-24">￥</text>
										<text class="fs-32">{{decimalPointDivision(item.price,'left')}}</text>
										<text class="fs-24">{{decimalPointDivision(item.price,'right')}}</text>
									</view>
									<view class="tjGrod-item-Icon">
										<up-icon :name="imgUrl+'static/car-add-icon.png'" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
										<up-badge max="99" bgColor="#FF4B33" absolute :offset="[-9,-9]" :value="item.number" :customStyle="{border:'2rpx solid #FFFFFF',fontSize:'16rpx'}"></up-badge>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<up-gap height="10"></up-gap>
				<view class="fl-fs-sb">
					<view class="leftTabs">
						<view class="leftTabs-item" v-for="(item,index) in tabsList" :key="index" @click="leTabsClick(item)">
							<view :class="['leftTabs-item-text',item.id == tabIndex?'tabsActive':'']">{{item.name}}</view>
							<view class="leftTabs-item-line" v-if="item.id == tabIndex"></view>
						</view>
					</view>
					<view class="rightCent">
						<ser-empty v-if="!list.length"></ser-empty>
						<view class="card" v-for="(item,index) in list" :key="index">
							<image class="card-image" lazy-load :src="imgUrl+'dsewf.png'" mode></image>
							<view class="card-center" @click="togolist" >
								<up-text :text="item.name" size="14" color="#000000" bold lines="1"></up-text>
								<view class="m-t-20 m-b-20">
									<up-text :text="`月销${item.volume}+`" size="12" color="#666666" lines="1"></up-text>
								</view>
								<view class="card-center-botom">
									<view class="card-center-price">
										<view class="newPrice"><text class="fs-24">￥</text>{{decimalPointDivision(item.price,'left')}}<text class="fs-28">{{decimalPointDivision(item.price,'right')}}</text></view>
										<view class="oldPrice">￥15</view>
									</view>
									<up-number-box v-if="item.number" v-model="item.number" bgColor="none">
										<template #minus>
											<up-icon name="minus-circle" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
										</template>
										<template #plus>
											<up-icon name="plus-circle-fill" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
										</template>
									</up-number-box>
									<up-icon v-else name="plus-circle-fill" size="22" :color="themeStore.themeColors.$primaryColor"></up-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="typePage == 2">
				<view class="starBox fl-ce-sb">
					<view class="starBox-left fl-al-fe">
						<view class="font3">4.7</view>
						<view class="m-l-20">
							<view class="font2 m-b-15">商家评分</view>
							<up-rate count="5" v-model="start" readonly :activeColor="themeStore.themeColors.$primaryColor" inactiveColor="#DDDDDD" inactiveIcon="star-fill" allowHalf gutter="2"></up-rate>
						</view>
					</view>
					<view class="starBox-right">
						<view class="csBox">
							<view class="csBox-item">
								<text class="csBox-item-name">口味</text>
								<text class="csBox-item-value" style="text-align: center;">4.7</text>
							</view>
							<view class="csBox-HHH m-r-10 m-l-20"></view>
							<view class="csBox-item">
								<text class="csBox-item-name">环境</text>
								<text class="csBox-item-value" style="text-align: center;">4.6</text>
							</view>
							<view class="csBox-HHH m-r-10 m-l-20"></view>
							<view class="csBox-item">
								<text class="csBox-item-name">服务</text>
								<text class="csBox-item-value" style="text-align: center;">4.7</text>
							</view>
						</view>
					</view>
				</view>
				<up-gap height="10"></up-gap>
				<view class="pjBox" >
					<view v-for="(item,index) in pjList" :key="index">
						<up-line v-if="index >0"  color="#EEEEEE"></up-line>
						<view class="pjBox-item">
							<view class="fl-ce-sb">
								<view class="fl-al-ce">
									<up-image :src="imgUrl+'tx.jpg'" width="44rpx" height="44rpx" shape="circle"></up-image>
									<text class="usName m-l-10">{{item.name}}</text>
								</view>
								<view class="usTime">{{item.time}}</view>
							</view>
							<view class="usText m-t-20">{{item.text}}</view>
							<view class="usImgs" v-if="item.images && item.images.length">
								<image class="usImgs-item" v-for="(url,indx) in item.images" :key="indx" :src="url" mode></image>
							</view>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		
		<!-- 购物车 -->
		<ShopCart :list="carList"></ShopCart>
		<up-gap height="90"></up-gap>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed,getCurrentInstance} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	
	import {decimalPointDivision} from "@/utils/util";
	import { onLoad, onReady } from '@dcloudio/uni-app';
	import ShopCart from './components/ShopCart';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	
	const topBgColor = ref<string>('transparent');
	const topHeight = ref(200);
	const typePage = ref<string | number>(2); // 1点餐，2评价
	const start = ref(4.5)
	const recommendList = ref([
		{name:'优质水饺包',price:9.9,oldPrice:10,number:0},
		{name:'西安特色优质豆腐脑',price:11.5,oldPrice:14,number:2},
		{name:'陕西茴香酥脆油条',price:10.9,oldPrice:15,number:1},
	]);
	const list = ref([
		{name:'酸菜肉丝酸汤米线',price:15.50,volume:1000,oldPrice:17,number:4},
		{name:'小米稀饭无糖',price:8,volume:5000,oldPrice:10,number:0},
		{name:'美味新鲜时蔬盖浇饭',price:17.9,volume:200,oldPrice:20,number:0},
		{name:'现榨脆薯条',price:13.05,volume:500,oldPrice:15,number:0}
	]);
	const tabIndex = ref(1);
	const tabsList = ref([
		{id:1,name:'为你推荐'},
		{id:2,name:'特色菜品'},
		{id:3,name:'精品套餐'},
		{id:4,name:'汤羹主食'},
		{id:5,name:'精美小吃'},
		{id:6,name:'酒水饮料'}
	]);
	const pjList = ref([
		{name:'少年的你0136',time:'2025-10-13',text:'这个服务区的餐饮做的真不错，很喜欢吃，也推荐给大家，不仅服务态度好，味道也很棒。',images:[imgUrl+'fwe.png',imgUrl+'dsewf.png',imgUrl+'ge.png',],isGive:false},
		{name:'梦想家0207',time:'2025-10-13',text:'点铺环境干净卫生，饭菜的整体口味适中，服务员态度都很好，推荐给大家。',images:[],isGive:false},
	])
	const carList = computed(()=>{
		let arr = [];
		arr = [...list.value.filter(item=>item.number > 0),...recommendList.value.filter(item=>item.number > 0)];
		return arr.map(item =>{
			item.checked = true;
			return item;
		});
	})
	const togolist = ()=>{
		toNav('/pages_B/dining/goodsDetail');
	}
	const tabsChange = (type:number|string)=>{
		typePage.value = type;
	}
	const leTabsClick = (item)=>{
		tabIndex.value = item.id;
	}
	onLoad(()=>{
		
	})
	onReady(()=>{
		
	})
</script>

<style lang="scss" scoped>
	.page-container{
		min-height: 100vh;
		// background: #FFFFFF;
		background: $pageBgColor;
	}
	.font2{
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
	}
	.font3{
		font-weight: bold;
		font-size: 60rpx;
		line-height: 44rpx;
		color: $color;
	}
	.leftTabs{
		width: 160rpx;
		background: #F5F5F5;
		.leftTabs-item{
			width: 160rpx;
			line-height: 100rpx;
			text-align: center;
			position: relative;
			
			.leftTabs-item-text{
				font-weight: 500;
				font-size: 26rpx;
				color: #666666;
			}
			.tabsActive{
				font-weight: bold;
				color: $color;
				background: #FFFFFF;
			}
			.leftTabs-item-line{
				position: absolute;
				left:0;
				top: 25rpx;
				width: 6rpx;
				height: 50rpx;
				background:$color;
				border-radius: 0rpx 4rpx 4rpx 0rpx;
			}
		}
	}
	.rightCent{
		width: calc(100% - 160rpx);
		.card{
			width: 100%;
			padding: 25rpx 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			background: #FFFFFF;
			border-radius: 20rpx 0rpx 0rpx 20rpx;
			.card-image{
				width: 160rpx;
				height: 160rpx;
				background: #F5F5F5;
				border-radius: 16rpx;
			}
			.card-center{
				width: calc(100% - 160rpx);
				padding-left: 27rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.card-center-botom{
					.card-center-price{
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
					
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
		}
	}
	.cardBotBox{
		width: 100%;
		// background: #FFFFFF;
		// border-radius: 26rpx 26rpx 0rpx 0rpx;
		.botTabs{
			padding: 35rpx 32rpx;
			box-sizing: border-box;
			border-radius: 26rpx 26rpx 0rpx 0rpx;
			background: #FFFFFF;
			.botTabs-item{
				display: inline-block;
				margin-right: 60rpx;
				position: relative;
			}
			
			.botTabs-item-text{
				font-weight: 500;
				font-size: 32rpx;
				color: #666666;
				line-height: 32rpx;
				text{
					font-size: 24rpx;
				}
			}
			.botTabsActibe{
				font-weight: bold;
				color: #000000;
			}
			.botTabs-item-line{
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: -16rpx;
				width: 40rpx;
				height: 8rpx;
				background: $bgLgColor;
				border-radius: 4rpx;
			}
		}
		
		.tjBox{
			margin: 0 auto;
			width: 686rpx;
			background: #FEF2DC;
			border-radius: 26rpx;
			padding: 80rpx 25rpx 64rpx 25rpx;
			box-sizing: border-box;
			position: relative;
			.tjBox-title{
				position: absolute;
				left: 0;
				top: -10rpx;
				width: 226rpx;
				height: 89rpx;
				border-radius: 31rpx 0rpx 26rpx 0rpx;
				
				font-weight: 400;
				font-size: 36rpx;
				color: #FFFFFF;
				padding-top: 13rpx;
				padding-left: 43rpx;
				box-sizing: border-box;
				z-index:999 ;
				
			}
			.wenzibj{
				position: absolute;
				left: 0;
				top: -10rpx;
				width: 226rpx;
				height: 89rpx;
			}
			.tjGrod{
				display: grid;
				grid-template-columns:repeat(3,200rpx);
				grid-gap: 18rpx;
				.tjGrod-item{
					background: #FFFFFF;
					border-radius: 16rpx;
					.tjGrod-item-img{
						width: 200rpx;
						height: 200rpx;
						background: #FFFFFF;
						border-radius: 16rpx 16rpx 0rpx 0rpx;
					}
					.tjGrod-item-cent{
						width: 100%;
						height: 160rpx;
						padding: 16rpx 20rpx 25rpx 20rpx;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
					.tjGrod-item-name{
						line-height: 30rpx;
						font-weight: bold;
						font-size: 26rpx;
						color: #000000;
					}
					.tjGrod-item-Icon{position: relative;}
				}
				
			}
			
		}
		.tjPrice{
			color: #000000;
			font-weight: bold;
		}
	}
	.addrBox{
		width: 100%;
		height: 76rpx;
		background: #F5F5F5;
		border-radius: 16rpx;
		margin-top: 24rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
	}
	.leftBox{
		width: 136rpx;
		height: 136rpx;
		border-radius: 16rpx;
		position: relative;
		image{
			width: 136rpx;
			height: 136rpx;
			border-radius: 16rpx;
		}
		.leftBox-text{
			position: absolute;
			left: 0;
			bottom: 0;
			width: 136rpx;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			padding: 0 15rpx;
			box-sizing: border-box;
			background: #000000;
			border-radius: 0 0 16rpx 16rpx;
			opacity: 0.3;
			font-weight: 500;
			font-size: 18rpx;
			color: #FFFFFF;
		}
	}
	.rightBox{
		width: calc(100% - 156rpx);
		.nameBox{
			font-weight: 800;
			font-size: 36rpx;
			color: #000000;
		}
		.iconBox{
			width: 88rpx;
			height: 36rpx;
			line-height: 36rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 18rpx;
			border: 1px solid $color;
			
			font-weight: 500;
			font-size: 24rpx;
			color: $color;
		}
		
		
	}
	
	.csBox{
		display:flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 10rpx;
		.csBox-item{
			display: flex;flex-direction: column;
			.csBox-item-name{
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
			}
			.csBox-item-value{
				margin-top: 10rpx;
				font-weight: bold;
				font-size: 24rpx;
				color: #000000;
			}
		}
		.csBox-HHH{
			width: 1rpx;
			height: 40rpx;
			background: #E3E3E3;
		}
	}
	.font1{
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
	}
	.topBox{
		background: $bgTopColor;
	}
	.topCard{
		width: 750rpx;
		background: #FFFFFF;
		border-radius: 0rpx 0rpx 26rpx 26rpx;
		padding: 10rpx 32rpx 35rpx 32rpx;
		box-sizing: border-box;
	}
	.starBox{
		border-radius: 0rpx 0rpx 26rpx 26rpx;
		background: #FFFFFF;
		padding: 0 40rpx 50rpx 40rpx;
		box-sizing: border-box;
		.starBox-left{
			
		}
		.starBox-right{
			width: 300rpx;
		}
	}
	.pjBox{
		padding: 0 32rpx;
		box-sizing: border-box;
		border-radius: 26rpx 26rpx 0rpx 0rpx;
		background: #FFFFFF;
		.pjBox-item{
			padding: 30rpx 0;
			box-sizing: border-box;
		}
		.usName{
			font-weight: bold;
			font-size: 24rpx;
			color: #000000;
		}
		.usTime{
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
		}
		.usText{
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			line-height: 50rpx;
		}
		.usImgs{
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 10rpx;
			margin: 20rpx 0;
			.usImgs-item{
				width: 196rpx;
				height: 196rpx;
			}
		}
	
		.usDzImg{
			width: 26rpx;
			height: 26rpx;
		}
		.usDzText{
			font-size: 24rpx;
			font-weight: 500;
		}
	}
	
</style>