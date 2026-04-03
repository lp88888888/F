<template>

	<view class="page" :data-theme="pageTheme">
		<up-sticky>
			<view class="searchView">
				<up-navbar bgColor="transparent" title='榜单赚积分' @leftClick="toBack" placeholder fixed></up-navbar>
			</view>
		</up-sticky>
		<view class="tab-header">
			<!-- 标签页 -->
			<view class="tabs">
				<view v-for="(tab, index) in tabs" :key="index" class="tab-item"
					:class="{ active: currentIndex === index }" @click="switchTab(index)">
					{{ tab }}
					<view v-if="currentIndex === index" class="line-tabs"></view>
				</view>
			</view>
		</view>
		<view class='pags-box'>
			<view class="textBox">以下福利有效兑换时间：2026.1.1～2.29</view>
			<view class='rank-box'>
				<view class="top-rank-container" v-if="top3Items.length>0">
					<!-- TOP 2 -->
					<view class="rank-item rank1 " v-if="top3Items.length>=2">
						<view class="pank-q-1">
							<image class="top1-avatar" :src="top3Items[1]?.avatar" mode="aspectFill">
							</image>
							<view class="pank-t-1">
								TOP 2
							</view>
						</view>
						<view class="username">{{ top3Items[1]?.name}}</view>
						<text v-if="currentIndex==2" class="pontin">{{ top3Items[1]?.totalMileage}}</text>
						<text v-else class="pontin">{{ top3Items[1]?.totalPoints}}</text>
					</view>
					<!-- TOP 1 -->
					<view class="rank-item rank2 " v-if="top3Items.length>=1">
						<view class="pank-q">
							<image class="top1-pgone" :src="top3Items[0]?.avatar" mode="aspectFill">
							</image>
							<view class="pank-t">
								TOP 1
							</view>
							<image class="top1-pgone-1" :src="imgUrl+'vipcard/pgone-1.png'" mode="aspectFill">
							</image>
							<image class="top1-pgone-2" :src="imgUrl+'vipcard/pgone-2.png'" mode="aspectFill">
							</image>
							<image class="top1-pgone-3" :src="imgUrl+'vipcard/pgone-3.png'" mode="aspectFill">
							</image>
						</view>
						<view class="username">{{ top3Items[0]?.name}}</view>
						<text v-if="currentIndex==2" class="pontin">{{ top3Items[0]?.totalMileage}}</text>
						<text v-else class="pontin">{{ top3Items[0]?.totalPoints}}</text>
					</view>

					<!-- TOP 3 -->
					<view class="rank-item rank3 " v-if="top3Items.length>=3">
						<view class="pank-q-2">
							<image class="top1-avatar" :src="top3Items[2]?.avatar" mode="aspectFill">
							</image>
							<view class="pank-t-2">
								TOP 3
							</view>
						</view>
						<view class="username">{{ top3Items[2]?.name}}</view>
						<text v-if="currentIndex==2" class="pontin">{{ top3Items[2]?.totalMileage}}</text>
						<text v-else class="pontin">{{ top3Items[2]?.totalPoints}}</text>
					</view>
				</view>
				<image :src="`${imgUrl}static/rank-dz.png`" class="dizuicon" mode="widthFix"
					style="width: 100%; height: 100%;"></image>
			</view>
			<view class="rank-list-container">
				<!-- 表头 -->
				<view class="header" v-if="otherItems.length>0">
					<view class="col1">名次</view>
					<view class="col2">用户</view>
					<view class="col3">有效通行</view>
					<view class="col4">奖励积分</view>
				</view>

				<!-- 排行榜列表 -->
				<view class="list" v-if="otherItems.length>0">
					<view v-for="(item, index) in otherItems" :key="index" class="list-item"
						:class="{ 'my-rank': item.isMe }">
						<view class="rank">{{ index+4 }}</view>
						<view class="user">
							<text class="name">{{ item.name }}</text>
						</view>
						<view class="score">800km</view>
						<view class="score">{{ item.totalPoints }}</view>
					</view>
				</view>
			</view>
		
			<view class="my-rank-tip" v-if="currentIndex!=2 && myRankInfo.name!=''">
				<view class="label">我的名次</view>
				<view class="content">
					<image :src="myRankInfo.avatar" mode="aspectFill" class="avatar-small"></image>
					<text class="username">{{ myRankInfo.name }}</text>
					<text v-if="currentIndex==0" class="score">获得{{ myRankInfo.points }}分</text>
					<text v-if="currentIndex==1" class="score">消耗{{ myRankInfo.points }}分</text>
					<text class="status">{{ myRankInfo.currentRanking||'未进TOP100' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import moment from "moment";
	import { imgUrl } from '@/config';
	import {ref,reactive,computed} from 'vue';
	import {getLeaderboard} from '@/api/truck';
	import {getmemberpointsRanking,getmileageRankinglist} from '@/api/member';
	
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	import { onLoad } from '@dcloudio/uni-app'
	import { toNav, toBack } from '@/utils/route';
	const backgroundColor = ref("#EEFDF1")
	const tabs = ref(['个人车主通行榜', '企业通行榜']);
	const pickshow = ref(false)
	
	const userinfo = ref(uni.getStorageSync('userInfo'))
	const currentIndex = ref(0);
	const top3Items = ref([])
	const otherItems = ref([])
	const myponklist = ref([])
	const rawData = ref([])
	const memberType = ref(1)
	
	const membername = ref('个人榜单')
	const dateType = ref('month')
	const monthsai = ref(null)
	const yearsai = ref(null)
	const monthshow = ref(false)
	const typerank = ref(1)
	const activityId = ref('')
	onLoad((option) => {
		activityId.value=option.id
		setDefaultMonth()
	})
	const setDefaultMonth = () => {
		const now = new Date()
		const year = now.getFullYear()
		const month = String(now.getMonth() + 1).padStart(2, '0') // 月份从0开始，需+1
		// monthsai.value = `${year}-${month}`
		yearsai.value=year
		monthsai.value = month
		search()
	}
	const onConfirm = (e : any) => {
		monthshow.value = false
		const now = new Date(e.value)
		const year = now.getFullYear()
		const month = String(now.getMonth() + 1).padStart(2, '0') // 月份从0开始，需+1
		yearsai.value=year
		// monthsai.value = `${year}-${month}`
		monthsai.value = month
		if (currentIndex.value == 2) {
			getranklist()
			top3Items.value = []
			otherItems.value = []
		} else {
			search()
		}
	}
	const confirmpick = (e) => {
		console.log('confirm', e);
		membername.value = e.value[0]
		if (e.value[0] == '个人榜单') {
			memberType.value = 1
		} else {
			memberType.value = 2
		}
		search()
		pickshow.value = false;
	};
	const getpangdanlist = async () => {
		let params = {
			activityId:activityId.value,
			type: typerank.value,
			limit:999
		}
		let res = await getLeaderboard(params)
		console.log(res.data)
		if (res.code == 200 && res.data.rankings != undefined) {
			rawData.value = res.data.rankings
			top3Items.value = res.data.rankings.slice(0, 3)
			otherItems.value = res.data.rankings.slice(3)
			// myRankInfo.value.name = res.data.nikeName
			// myRankInfo.value.points = res.data.points
			// myRankInfo.value.currentRanking = res.data.currentRanking
			// myRankInfo.value.avatar = res.data.avatar
		} else {
			top3Items.value = []
			otherItems.value = []
		}
	}
	const search = () => {
		getpangdanlist()
		top3Items.value = []
		otherItems.value = []
		myponklist.value = []
		myRankInfo.value.name = ''
		myRankInfo.value.points = null
		myRankInfo.value.currentRanking = ''
		myRankInfo.value.avatar = ''
	}

	const switchTab = (index : number) => {
		currentIndex.value = index
		if (currentIndex.value == 1) {
			typerank.value = 2
			search()
		}  else {
			typerank.value = 1
			search()
		}

	}
	const getranklist = async () => {
		let params = {
			memberType: memberType.value,
			month: Number(monthsai.value),
			year: Number(yearsai.value)
		}
		
		let res = await getmileageRankinglist(params)
		console.log(res.data.mileageRankingList)
		if (res.code == 200 && res.data.mileageRankingList != undefined) {
			rawData.value = res.data.mileageRankingList
			top3Items.value = res.data.mileageRankingList.slice(0, 3)
			otherItems.value = res.data.mileageRankingList.slice(3)
			myponklist.value = res.data.currentRankingList
			console.log(top3Items.value, 'top3Items')
			console.log(otherItems.value, 'otherItems')
		} else {
			top3Items.value = []
			otherItems.value = []
		}
	}
	const rankList = ref([
		{ rank: 4, name: '张三', avatar: imgUrl + 'hou-wtouxiang.png', score: 5810, isMe: false },
		{ rank: 5, name: '李四', avatar: imgUrl + 'hou-wtouxiang.png', score: 4800, isMe: false },
		{ rank: 6, name: '李昭', avatar: imgUrl + 'hou-wtouxiang.png', score: 4800, isMe: false },
		{ rank: 7, name: '赏伦', avatar: imgUrl + 'hou-wtouxiang.png', score: 4800, isMe: false },
		{ rank: 8, name: '皮琼', avatar: imgUrl + 'hou-wtouxiang.png', score: 4800, isMe: false },
		{ rank: 9, name: '玉星俊', avatar: imgUrl + 'hou-wtouxiang.png', score: 4800, isMe: false },
		{ rank: 10, name: '郦姬君', avatar: imgUrl + 'hou-wtouxiang.png', score: 4800, isMe: false },
		{ rank: 11, name: '赏伦', avatar: imgUrl + 'hou-wtouxiang.png', score: 4800, isMe: false },
		{ rank: 12, name: '皮琼', avatar: imgUrl + 'hou-wtouxiang.png', score: 4800, isMe: false },
		{ rank: 13, name: '玉星俊', avatar: imgUrl + 'hou-wtouxiang.png', score: 4800, isMe: false }
	])
	const myRankInfo = ref({

	})
</script>

<style scoped lang="scss">
	.page {
		min-height: 100vh;
		background: linear-gradient(180deg, #CAECD0 0%, #F5F8F5 25%);
	}

	.pags-box {
		padding: 0 25rpx;
	}

	.tab-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(98, 143, 47, 0.07);
		box-sizing: border-box;
	}

	/* 标签栏 */
	.tabs {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.tab-item {
		width: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 98rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #909599;
		transition: all 0.3s ease;
		position: relative;
	}

	.rank-box {
		height: 402rpx;
		// background: linear-gradient(180deg, #D4EFB8 10%, #FDFFFC 80%);
		background: linear-gradient(180deg, #D4EFB8 0%, #FDFFFC 34%);
		box-shadow: 0rpx 0rpx 8rpx 0rpx #D3E7D1;
		border-radius: 24rpx 24rpx 0 0;
		position: relative;
	}

	.dizuicon {
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.tab-item.active {
		background: rgba(98, 143, 47, 0.09);
		font-weight: 500;
		font-size: 28rpx;
		color: var(--primary-color);
	}

	.line-tabs {
		position: absolute;
		bottom: 0rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 4rpx;
		background: var(--primary-color);
		border-radius: 2rpx;
	}
	.textBox{
		padding: 24rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: 500;
		color: #9E9E9E;
	}
	.date-sai {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 0;
	}

	.date-filter {
		height: 56rpx;
		border-radius: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 32rpx;
		gap: 10rpx;

		text {
			font-size: 32rpx;
			line-height: 56rpx;
			color: #333333;
			font-weight: 600;
		}
	}

	.top-rank-container {
		display: flex;
		justify-content: space-around;
		padding: 40rpx 20rpx 20rpx;
		border-radius: 16rpx;
		position: relative;

	}

	.rank1 {
		position: absolute;
		left: 80rpx;
		top: 84rpx;
	}

	.rank2 {
		position: absolute;
		left: 270rpx;
		top: 37rpx;
	}

	.rank3 {
		position: absolute;
		left: 470rpx;
		top: 100rpx;
	}

	.rank-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 140rpx;
	}

	.pank-q {
		width: 118rpx;
		height: 118rpx;
		border-radius: 50%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3rpx solid #F79F02;
		margin-bottom: 22rpx;
	}

	.top1-pgone {
		width: 118rpx;
		height: 118rpx;
		border-radius: 50%;
	}

	.top1-pgone-1 {
		width: 38rpx;
		height: 38rpx;
		position: absolute;
		left: 16rpx;
		top: 4rpx;
	}

	.top1-pgone-2 {
		width: 26rpx;
		height: 28rpx;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.top1-pgone-3 {
		width: 26rpx;
		height: 28rpx;
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.pank-t {
		width: 69rpx;
		height: 28rpx;
		background: linear-gradient(123deg, #F9BF64 0%, #F5B570 100%);
		border-radius: 5rpx;
		text-align: center;
		line-height: 28rpx;
		font-size: 18rpx;
		color: #FFFFFF;
		position: absolute;
		bottom: -10rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.pank-q-1 {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3rpx solid #E73B8E;
		margin-bottom: 22rpx;
	}

	.pank-q-1 image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.pank-t-1 {
		width: 69rpx;
		height: 28rpx;
		background: linear-gradient(123deg, #F43594 0%, #F89C55 100%);
		border-radius: 5rpx;
		text-align: center;
		line-height: 28rpx;
		font-size: 18rpx;
		color: #FFFFFF;
		position: absolute;
		bottom: -10rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.pank-q-2 {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3rpx solid #3CA3DE;
		margin-bottom: 22rpx;
	}

	.pank-q-2 image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.pank-t-2 {
		width: 69rpx;
		height: 28rpx;
		background: linear-gradient(135deg, #46BAE4 0%, #7F2BDD 100%);
		border-radius: 5rpx;
		text-align: center;
		line-height: 28rpx;
		font-size: 18rpx;
		color: #FFFFFF;
		position: absolute;
		bottom: -10rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.username {
		font-weight: 400;
		font-size: 28rpx;
		color: #2E3133;
		width: 200rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.pontin {
		font-weight: 400;
		font-size: 24rpx;
		color: #FF9B36;
	}

	/* 整体容器 */
	.rank-list-container {}

	/* 表头 */
	.header {
		display: flex;
		justify-content: space-between;
		background-color: var(--label-color);
		font-size: 28rpx;
		color: #333;
		border-bottom: 1rpx solid #ddd;
	}

	.header .col {
		flex: 1;
		text-align: center;
	}

	.col1 {
		width: 114rpx;
		height: 76rpx;
		text-align: center;
		line-height: 76rpx;
	}

	.col2 {
		flex: 1;
		height: 76rpx;
		text-align: left;
		line-height: 76rpx;
	}

	.col3 {
		width: 160rpx;
		height: 76rpx;
		text-align: center;
		line-height: 76rpx;
	}

	.col4 {
		width: 160rpx;
		height: 76rpx;
		text-align: center;
		line-height: 76rpx;
	}

	/* 列表项 */
	.list {
		margin-top: 10rpx;
	}

	.list-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		background-color: white;
		border-bottom: 1rpx solid #eee;
	}

	.list-item.my-rank {
		background-color: #fffbea;
		border-left: 4rpx solid #ff9800;
		padding-left: 16rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.list-item .rank {
		width: 114rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333;
	}

	.list-item .user {
		flex: 1;
		display: flex;
		margin: 0 20rpx;
	}

	.list-item .avatar {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		margin-right: 12rpx;
	}

	.list-item .name {
		font-weight: 400;
		font-size: 28rpx;
		color: #2E3133;
	}

	.list-item .score {
		width: 160rpx;
		font-size: 28rpx;
		color: #2E3133;
		min-width: 80rpx;
		text-align: center;
	}

	/* 我的名次提示 */
	.my-rank-tip {
		margin-top: 20rpx;
		background-color: #fffbea;
		border-radius: 12rpx;
		padding: 26rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
	}

	.my-rank-tip .label {
		font-size: 24rpx;
		color: #ffffff;
		background-color: #ff9800;
		padding: 4rpx 8rpx;
		border-radius: 4rpx;
		display: inline-block;
		margin-bottom: 8rpx;
		border-radius: 0 14rpx 14rpx 0;
		position: absolute;
		left: 0;
		top: 0;
	}

	.my-rank-tip .content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		gap: 16rpx;
	}

	.my-rank-tip .avatar-small {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
	}

	.my-rank-tip .username {
		font-size: 28rpx;
		color: #333;
	}

	.my-rank-tip .score {
		font-size: 24rpx;
		color: #666;
		margin-right: 16rpx;
	}

	.my-rank-tip .status {
		font-size: 24rpx;
		color: #999;
	}
</style>