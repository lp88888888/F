<template>
	<view class="box" :data-theme="pageTheme" >
		<view class="pageView">
			<view class="search-bar">
				<view class="searcch-box flex">
					<up-search placeholder="请输入关键字搜索" v-model="searchKeyword" 
					searchIconColor="#000000" shape="round" bgColor="#F5F5F5"
					 @search="searchChange" actionText :showAction="false" clearable @change="handleSearch"></up-search>
		<!-- 			<image class="icon-32 m-r-10" :src="imgUrl+'new_search.png'" mode=""></image>
					<u-input v-model="searchKeyword" placeholder="请输入关键字搜索" border="none"
						placeholder-style="color: #999" @confirm="handleSearch" clearable @change="handleSearch" /> -->
				</view>
			</view>
			<view class="list-box">
				<view class="content" v-for="(item,index) in dataList" :key="index">
					<view class="card" @click="toNav(`/pages_D/usedCar/activityDetails?id=${item.id}`)">
						<image class="card-img" :src="item.photoPath" mode=""></image>
						<view class="card-cnet">
							<view class="card-cnet-left">
								<view class="card-cnet-name texNoWrap">{{item.name}}</view>
							</view>
						</view>
						<view class="card-cnet-text">
							{{item.releaseTime}}
						</view>
					</view>
				</view>
				<template v-if="!dataList.length">
					<ser-empty></ser-empty>
				</template>
				<up-gap height="20"></up-gap>
			</view>
			
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app';
	import { ref, computed } from 'vue';
	import { prOldCarPolicy } from '@/api/car';
	import { toNav, toBack } from '@/utils/route';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const dataList = ref([]);
	const searchKeyword = ref('');
	const selectActivityListFun = async () => {
		let params = {
			name: searchKeyword.value,
			content: ''
		}
		const res = await prOldCarPolicy(params);
		console.log('数据', res)
		dataList.value = res.rows
	}
	onLoad(() => {
		selectActivityListFun()
	})
	// 搜索回调
	const handleSearch = (keyword : string) => {
		searchKeyword.value = keyword;
		selectActivityListFun()
	};

	// 重置搜索
	const handleReset = () => {
		searchKeyword.value = '';
		selectActivityListFun()
	};
</script>

<style lang="scss">
	page {
	}

	.box {
		height: 100vh;
		overflow: hidden;
		background: var(--head-color);
	}

	.topSele {
		padding: 20rpx 40rpx 40rpx 40rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		display: flex;
		align-items: center;

		.topSele-item {
			// width: 200rpx;
			height: 56rpx;
			background: #F0F0F0;
			border-radius: 28rpx 28rpx 28rpx 28rpx;
			margin-right: 24rpx;
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			box-sizing: border-box;

			font-weight: 400;
			font-size: 28rpx;
			color: #666666;

			text {
				margin-right: 10rpx;
			}
		}
	}

	.pageView {
		box-sizing: border-box;
	}

	.search-bar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;

		.searcch-box {
			height: 70rpx;
			background: #F5F5F5;
			border-radius: 410rpx 410rpx 410rpx 410rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0rpx 24rpx;
			flex: 1
		}

		.btn {
			width: 76rpx;
			// background: #FF8B03;
			background: var(--primary-color);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #FFFFFF;
			box-sizing: border-box;
			padding: 8rpx 14rpx;
			margin-left: 32rpx;
		}
	}

	.content {
		padding: 24rpx 30rpx 0;
	}

	.card {
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);

		.card-img {
			width: 100%;
			max-height: 254rpx;
			border-radius: 16rpx 16rpx 0rpx 0rpx;
		}

		.card-cnet {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 26rpx 32rpx;
			box-sizing: border-box;

			.card-cnet-left {}

			.card-cnet-name {
				font-weight: 700;
				font-size: 32rpx;
				color: #333333;
			}



			.card-cnet-but {
				width: 146rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #FFFFFF;

			}
		}
	}

	.card-cnet-text {
		display: flex;
		justify-content: flex-end;
		font-weight: 400;
		font-size: 28rpx;
		color: #999999;
		margin-right: 20rpx;
		padding-bottom: 10rpx;
	}

	.g-btn {
		background: #999999;
	}

	.b-btn {
		background: var(--primary-color);
	}

	.list-box {
		height: 90vh;
		overflow-x: scroll;
	}

	.texNoWrap {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>