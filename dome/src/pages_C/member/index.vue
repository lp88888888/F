<template>
	<view :data-theme="pageTheme" :style="{
		background:bgcolor
	}">
		<!-- :style="{
		background:bgcolor
	}" -->
	<!-- <view class="topBox" :style="{background:bgcolor}">{{bgcolor}}</view> -->
		<up-navbar title="会员中心" :bgColor="backgroundColor" @leftClick="toBack" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<up-gap height="15"></up-gap>
		<!-- 已登录 -->
		<view v-if="isLogin">
			<view class="headCard" :style="{
    backgroundImage:  `url(${imgUrl}vipcard/bg${vipcardtype}.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }">
				<view style="width: 100%;display: flex;margin-top: 30rpx;">
					<image class="headCard-img" :src="userinfo.headImageUrl" :lazy-load="true" />
					<view class="headCard-center">
						<view class="headCen ">
							<view class="headCen-left fl-al-ce">
								<view class="fontText" style="line-height: 40rpx;margin-right: 10rpx;">
									{{userinfo.nickName}}
								</view>
								<up-icon :name="imgUrl+'static/onejb-icon.png'" size="20"></up-icon>
								<view class="fontText2" style="line-height: 40rpx;margin-left: 10rpx;font-size: 20rpx;"
									v-if="userinfo.bindStatus==0">绑定车辆后积分可见</view>
								<view class="fontText2" style="line-height: 40rpx;margin-left: 10rpx;font-size: 20rpx;"
									v-else>
									积分{{userinfo.pointsAccount.commonPoint}}
								</view>
							</view>
							<image class="dongwu-icon" :src="`${imgUrl}vipcard/dw${vipcardtype}.png`" mode="">
							</image>
							<view class="headCen-icon" :style="{
		color:btcolor,backgroundImage:gcolor
	}" v-if="userinfo.pointsAccount.memberType==1"><up-icon :name="`${imgUrl}vipcard/jb${vipcardtype}.png`"
									size="12"></up-icon>个人会员</view>
							<view class="headCen-icon " :style="{
		color:btcolor,backgroundImage:gcolor
	}" v-if="userinfo.pointsAccount.memberType==2"><up-icon :name="`${imgUrl}vipcard/jb${vipcardtype}.png`"
									size="12"></up-icon>企业会员</view>
						</view>
						<view class="fontText2 temColor" v-if="userinfo.bindStatus==0">未绑定车辆</view>
						<view class="fontText2 temColor" v-if="userinfo.bindStatus==1">
							已行驶里程：{{userinfo.totalMileage}}km</view>
					</view>
				</view>
			</view>
			<up-gap height="20"></up-gap>
			<!-- 		<view class="tan-pupo" v-if="pantsqingk">
				<image class="jinggao-icon" :src="imgUrl+'jinzgao-icon.png'" mode=""></image>
				<view class="tan-pupo-right">
					<view class="tan-pupo-right-top">
						<text class="tan-pupo-right-top-t">
							积分清零通知
						</text>
						<image class="tan-pupo-right-top-x" :src="imgUrl+'shanchu-icon.png'" @click="pantsqingk=false"
							mode=""></image>
					</view>
					<view class="tan-pupo-right-boom-t">
						您有2024.12.1~31的 <text>350积分</text> ，将在2026.1.1 00:00:00执行清零
					</view>
				</view>
			</view> -->
			<view class="gnGrid">
				<view class="gnGrid-item" v-for="(item,index) in qyList1" :key="index" @click="toLink(item.path)">
					<view class="gnGrid-item-img">
						<image class="gnGrid-item-img-ddd" :src="item.icon" mode=""></image>
					</view>
					<view class="gnGrid-item-text">{{item.name}}</view>
				</view>
			</view>
			<up-gap height="20"></up-gap>
			<view class="cardBox" v-if="isshoubirthday" :style="{
    backgroundImage: `url(${imgUrl+'wei-bar-icon.png'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }">
				<view>
					<text class="cardBox-cenr-title">{{userinfo.nickName}}，生日快乐!</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text" style="color: #B2A08E;">{{userinfo.birthday||'2025-11-23'}}</text>
				</view>
				<view style="margin-top: 28rpx;">
					<view class="jl-fa">奖励已发放</view>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text" style="color: #B2A08E;">赠送积分{{birthdaypoint}}</text>
				</view>
				<!-- <view class="cardBox" v-if="isshoubirthday"> -->

			</view>
			<view v-if="isshoumouter" class="cardBox" :style="{
    backgroundImage: `url(${imgUrl+'wei-tow-icon.png'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }">
				<!-- <view class="cardBox" v-if="isshoumouter"> -->
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">{{months}}月份赠送礼包</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text" style="color: #C9A8A5;">赠送积分{{mouterpoint}}</text>
				</view>
				<view class="cardBox-but" @click="claimyue">领取礼包</view>
			</view>
			<view class="rank-list-container">
				<!-- 标签切换 -->
				<view class="tab-header">
					<view class="tab-item" :class="{ active: activeTab === 'gain' }" @click="switchTab('gain')">
						积分获得榜
						<view class="line-tab" v-if="activeTab=='gain'"></view>
					</view>
					<view class="tab-item" :class="{ active: activeTab === 'consume' }" @click="switchTab('consume')">
						积分消耗榜
						<view class="line-tab" v-if="activeTab=='consume'"></view>
					</view>
				</view>
				<!-- 筛选器 -->
				<view style="display: flex;align-items: center;flex-direction: row-reverse;">
					<view class="filter-bar" v-if="userinfo.memberType!=1">
						<picker @change="onFilterChange" :value="filterValue" :range="filterOptions">
							<view class="filter-item">{{ filterOptions[filterValue] }}
								<image class="avatar2" :src="imgUrl+'heixia-icon.png'" mode="aspectFill"></image>
							</view>
						</picker>
					</view>
					<view class="filter-bar">
						<picker @change="onFilterChange1" :value="filterValue1" :range="filterOptions1">
							<view class="filter-item">{{ filterOptions1[filterValue1] }}
								<image class="avatar2" :src="imgUrl+'heixia-icon.png'" mode="aspectFill"></image>
							</view>
						</picker>
					</view>
				</view>
				<view class="top-rank-container">
					<!-- TOP 2 -->
					<view class="rank-item">
						<view class="pank-q-1">
							<image class="top1-avatar" :src="top3Items[1]?.avatar" mode="aspectFill"></image>
							<view class="pank-t-1">
								TOP 2
							</view>
						</view>
						<text class="username">{{ top3Items[1]?.nickname ||''}}</text>
					</view>

					<!-- TOP 1 -->
					<view class="rank-item">
						<view class="pank-q">
							<image class="top1-pgone" :src="top3Items[0]?.avatar" mode="aspectFill"></image>
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
						<text class="username">{{ top3Items[0]?.nickname ||''}}</text>
					</view>

					<!-- TOP 3 -->
					<view class="rank-item">
						<view class="pank-q-2">
							<image class="top1-avatar" :src="top3Items[2]?.avatar" mode="aspectFill"></image>
							<view class="pank-t-2">
								TOP 3
							</view>
						</view>
						<text class="username">{{ top3Items[2]?.nickname ||''}}</text>
					</view>
				</view>
				<!-- 榜单列表 -->
				<view class="rank-list">
					<!-- TOP 3 特殊展示 -->
					<view class="normal-item">
						<view class="score" style="width: 180rpx;">
							排名
						</view>
						<view class="user-info">
							用户
						</view>
						<view class="score">积分</view>
					</view>
					<view v-for="(item, index) in top3Items" :key="index" class="top-item">
						<image class="avatar1" v-if="index+1==1" :src="imgUrl+'top-1-icon.png'" mode="aspectFill">
						</image>
						<image class="avatar1" v-if="index==1" :src="imgUrl+'top-2-icon.png'" mode="aspectFill">
						</image>
						<image class="avatar1" v-if="index==2" :src="imgUrl+'top-3-icon.png'" mode="aspectFill"></image>
						<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
						<view class="user-info">
							<text class="username">{{ item.nickname||'' }}</text><br />
							<text class="nickname">{{ item.nickname ||''}}</text>
						</view>
						<view class="score">{{ item.totalPoints }}</view>
					</view>

					<!-- 其他名次 -->
					<view v-for="(item, index) in otherItems" :key="index" class="normal-item">
						<view class="rank">{{ index+4 }}</view>
						<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
						<view class="user-info">
							<text class="username">{{ item.nickname||'' }}</text><br />
							<text class="nickname">{{ item.nickname||'' }}</text>
						</view>
						<view class="score">{{ item.totalPoints }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 未登录 -->
		<view v-else>
			<view class="headCard2" :style="{
    backgroundImage: `url(${imgUrl}vipcard/wdl${vipcardtype}.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }">
				<image class="headCard-img" :src="imgUrl+'hou-wtouxiang.png'" :lazy-load="true" />
				<view class="headCard-center">
					<view class="fontText">未登录</view>
					<view class="fontText2" style="width: 450rpx;">开通爱上高速会员，享受{{RightsCount}}项会员权益</view>
				</view>
			</view>
			<view class="pageView">
				<view class="fontTitle">-会员专属八大精选权益-</view>
				<view class="qyGrid" @click="toNav('/pages_C/member/interests')">
					<view class="qyGrid-item" v-for="(item,index) in qyList" :key="index">
						<image class="qyGrid-item-img" :src="item.pic" mode=""></image>
						<text class="qyGrid-item-text texNoWrap">{{item.name}}</text>
					</view>
				</view>
				<up-gap height="30"></up-gap>
				<view class="butBox">
					<view class="butBox-item butColor1" @click="toNav('/pages_C/member/registeredPersonal')">
						<text class="butBox-item-title ">个人会员一键开通</text>
						<view class="butBox-item-icon">开通即送积分</view>
					</view>
					<up-gap height="15"></up-gap>
					<view class="butBox-item butColor2" @click="toNav('/pages_C/member/registeredEnterprises')">
						<text class="butBox-item-title">企业会员开通</text>
						<text class="butBox-item-text">适合物流车队</text>
					</view>
				</view>
				<up-gap height="15"></up-gap>
				<view class="dhBox">
					<view class="dhBox-title">
						<view class="fontdhTitle">积分可兑换商品 <image class="dhBoxView-jinbi"
								:src="imgUrl+'static/card_lt_icon_green.png'" mode="aspectFit"></image>
						</view>
						<view class="fontdhText">更多 <image class="dhBoxView-jinbi"
								:src="imgUrl+'shuangjiantou-icon.png'" mode="aspectFit"></image>
						</view>
					</view>
					<view class="dhBoxView">
						<view class="dhBoxView-item" v-for="(item,index) in dhList" :key="index">
							<image class="dhBoxView-item-img" :src="item.picUrl" mode="aspectFit"></image>
							<view class="dhBoxView-item-text-1">{{item.spuName}}</view>
							<view class="dhBoxView-item-text">{{item.price}}
								<image class="dhBoxView-jinbi" :src="imgUrl+'jinbi-icon.png'" mode="aspectFit"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="dhBox">
					<view class="dhBox-title">
						<view class="fontdhTitle">积分可兑换服务 <image class="dhBoxView-jinbi"
								:src="imgUrl+'static/card_lt_icon_green.png'" mode="aspectFit"></image>
						</view>
						<view class="fontdhText">更多 <image class="dhBoxView-jinbi"
								:src="imgUrl+'shuangjiantou-icon.png'" mode="aspectFit"></image>
						</view>
					</view>
					<view class="dhBoxView">
						<view class="dhBoxView-item" v-for="(item,index) in fulist" :key="index">
							<image class="dhBoxView-item-img" :src="item.picUrl" mode="aspectFit"></image>
							<view class="dhBoxView-item-text-1">{{item.spuName}}</view>
							<view class="dhBoxView-item-text">{{item.price}}
								<image class="dhBoxView-jinbi" :src="imgUrl+'jinbi-icon.png'" mode="aspectFit"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
     <PageDurationTracker pageName="会员中心" />
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	const backgroundColor = ref<string>('transparent');
	import {
		onReady
	} from '@dcloudio/uni-app';
	import {
		getmembermemRightsChoiceness,
		getmembermemberPage,
		getmembermemRightsCount,
		getmembermonthFixedPoint,
		getmemberbirthdayPoint,
		postsaveMonthFixedPoint,
		postsaveBirthdayPoint,
		getmemberpointsRanking
	} from '@/api/member';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const userinfo = ref(uni.getStorageSync('userInfo'))
	const activeTab = ref('gain')
	const pantsqingk = ref(true)
	// 筛选选项
	const filterOptions = ['个人榜', '企业榜']
	const filterValue = ref(0)
	const filterOptions1 = ['月榜', '周榜', '年榜']
	const filterValue1 = ref(0)
	const top3Items = ref([])
	const otherItems = ref([])
	const memberType = ref('1')
	const dateType = ref('month')
	// 切换标签
	const tabtype = ref('1')
	const switchTab = (tab) => {
		if (tab == 'gain') {
			tabtype.value = '1'
		} else {
			tabtype.value = '2'
		}
		activeTab.value = tab
		getpangdanlist()
	}

	// 筛选器变化
	const onFilterChange = (e) => {
		filterValue.value = e.detail.value
		memberType.value = filterValue.value == 0 ? '1' : '2'
		getpangdanlist()
	}
	const onFilterChange1 = (e) => {
		filterValue1.value = e.detail.value
		if (filterValue1.value == 1) {
			dateType.value = 'week'
		} else if (filterValue1.value == 2) {
			dateType.value = 'year'
		} else {
			dateType.value = 'month'

		}
		getpangdanlist()
	}
	const toLink = (url) => {
		if (url == '1') {
			uni.showToast({
				title: '该功能正在快马加鞭赶来的路上',
				icon: 'none'
			})
			return
		} else {
			toNav(url)
		}

	}
	// 模拟数据
	const rawData = ref([])
	const getpangdanlist = async () => {
		let params = {
			memberType: memberType.value,
			type: tabtype.value,
			dateType: dateType.value
		}
		let res = await getmemberpointsRanking(params)
		console.log(res.data.pointsRankingList)
		if (res.code == 200 && res.data.pointsRankingList != undefined) {
			rawData.value = res.data.pointsRankingList
			top3Items.value = res.data.pointsRankingList.slice(0, 3)
			otherItems.value = res.data.pointsRankingList.slice(3)

		} else {
			top3Items.value = []
			otherItems.value = []
		}
	}
	const bgcolor = ref('linear-gradient( 180deg, #C7E7A5 0%, #FCFFFC 30%)')
	const gcolor = ref('linear-gradient( 270deg, #D7EEBB 0%, #EDF8DF 100%)')
	const btcolor = ref('#8FB563')
	const vipcardtype = ref(uni.getStorageSync('vipCardType')||0)

	onMounted(() => {
		if (uni.getStorageSync('userInfo')) {
			isLogin.value = true
			getmother()
			getbirthday()
			getpangdanlist()
		} else {
			isLogin.value = false
			getmembermemRightsChoicenessData();
			getdulianlist1()
			getdulianlist0()
			getnum()
		}
		if (pageTheme.value == 'blue' && vipcardtype.value == 0) {
			console.log('-0-0-0-0--0-0-',vipcardtype.value);
			bgcolor.value = 'linear-gradient( 180deg, #CCEBFE 0%, #FCFFFC 30%)'
			gcolor.value = 'linear-gradient( 270deg, #D0E8FF 0%, #DFE9F8 100%)'
			backgroundColor.value = '#D3EEFE'
			btcolor.value = '#4881F5'
			vipcardtype.value = 5
		} else {
			let viptype = uni.getStorageSync('vipCardType')
			if (viptype == 1) {
				bgcolor.value = 'linear-gradient(180deg, #FE997D 0%, #FCFFFC 30%)'
				gcolor.value = 'linear-gradient( 270deg, #FE997D 0%, #FCFFFC 100%)'
				backgroundColor.value = '#FDA890'
				btcolor.value = '#DA4D1E'
			} else if (viptype == 2) {
				bgcolor.value = 'linear-gradient( 180deg, #E9A677 0%, #FCFFFC 30%)'
				gcolor.value = 'linear-gradient( 270deg, #E9A677 0%, #FCFFFC 100%)'
				btcolor.value = '#9E5327'
				backgroundColor.value = '#ECB38B'
			} else if (viptype == 3) {
				bgcolor.value = 'linear-gradient( 180deg, #B9BDBD 0%, #FCFFFC 30%)'
				gcolor.value = 'linear-gradient( 90deg, #FCFFFC 0%, #B9BDBD 100%)'
				btcolor.value = '#051818'
				backgroundColor.value = '#C3C7C6'
			} else {
				bgcolor.value = 'linear-gradient( 180deg, #C7E7A5 0%, #FCFFFC 30%)'
				gcolor.value = 'linear-gradient( 270deg, #D7EEBB 0%, #EDF8DF 100%)'
				btcolor.value = '#8FB563'
				backgroundColor.value = '#D0EBB3'
			}
		}
	})
	const getmonths = () => {
		const now = new Date()
		const year = now.getFullYear()
		const month = String(now.getMonth() + 1).padStart(2, '0') // getMonth() 返回 0-11
		months.value = month
	}
	const months = ref('')
	const RightsCount = ref(0)
	const isLogin = ref(false);
	const avatarUrl = ref('');
	const qyList1 = ref([
		{ name: '会员任务', icon: imgUrl + 'vip-qy1-icon.png', path: '/pages_C/member/earnPoints' },
		{ name: '会员权益', icon: imgUrl + 'vip-qy2-icon.png', path: '/pages_C/member/interests' },
		// #ifndef APP-HARMONY
		{ name: '会员抽奖', icon: imgUrl + 'vip-qy3-icon.png', path: '1' },
		// #endif
		{ name: '积分榜单', icon: imgUrl + 'vip-qy4-icon.png', path: '/pages_C/member/rankingList' },
		// #ifndef APP-HARMONY
		{ name: '会员规则', icon: imgUrl + 'vip-qy5-icon.png', path: '/pages_C/member/PointsRules?type=1' },
		// #endif
		// #ifndef APP-HARMONY
		{ name: 'plus会员', icon: imgUrl + 'vip-qy6-icon.png', path: '1' },
		// #endif
	])
	const qyList = ref([
	])
	const mouterpoint = ref(0)
	const birthdaypoint = ref(0)
	const isshoumouter = ref(false)
	const isshoubirthday = ref(false)
	const claimyue = async () => {

		let res = await postsaveMonthFixedPoint({ giftType: Number(4) })
		if (res.code == 200) {
			uni.showToast({
				title: '领取成功',
				icon: 'none'
			})
			isshoumouter.value = false
		}
	}
	const claimbirthday = async () => {
		let res = await postsaveBirthdayPoint()
		if (res.code == 200) {
			uni.showToast({
				title: '领取成功',
				icon: 'none'
			})
			isshoubirthday.value = false
		}
	}
	const getmother = async () => {
		let res = await getmembermonthFixedPoint()
		if (res.code == 200) {
			if (res.data.isReceived == 0) {
				isshoumouter.value = false

			} else {
				isshoumouter.value = true
				mouterpoint.value = res.data.givePoints
			}
		}
	}
	const getbirthday = async () => {
		let res = await getmemberbirthdayPoint()
		if (res.code == 200) {
			if (res.data == null) {
				isshoubirthday.value = false

			} else {
				isshoubirthday.value = true
				birthdaypoint.value = res.data.point
			}
		}
	}

	//未登录会员数量
	const getnum = async () => {
		let res = await getmembermemRightsCount()
		if (res.code == 200) {
			RightsCount.value = res.data
		}
	}
	//获取兑换权益列表
	const getdulianlist1 = async () => {
		const res = await getmembermemberPage(0);
		if (res.code == 200) {
			fulist.value = res.data.list
		}
	}
	// 获取兑换商品列表
	const getdulianlist0 = async () => {
		const res = await getmembermemberPage(1);
		if (res.code == 200) {
			dhList.value = res.data.list
		}
	}
	const fulist = ref([

	])
	const dhList = ref([

	])
	// 获取权益列表
	const getmembermemRightsChoicenessData = async () => {
		const res = await getmembermemRightsChoiceness();
		if (res.code == 200) {
			qyList.value = res.data;
		}
		console.log(res);
	}
	const gnList = ref([
		{ name: '里程换积分', icon: imgUrl + 'road-show-shijian.png' },
		{ name: '赚积分', icon: imgUrl + 'road-show-shijian.png' },
		{ name: '积分换福利', icon: imgUrl + 'road-show-shijian.png' },
		{ name: '积分明细', icon: imgUrl + 'road-show-shijian.png' },
		{ name: '会员权益', icon: imgUrl + 'road-show-shijian.png' },
		{ name: '等级提升', icon: imgUrl + 'road-show-shijian.png' },
		{ name: '榜单奖励', icon: imgUrl + 'road-show-shijian.png' },
		{ name: '游戏抽奖', icon: imgUrl + 'road-show-shijian.png' },
	]);

	const selectIndex = ref(3);
	const spekList = ref([
		{ name: '普通' },
		{ name: '铂金' },
		{ name: '钻石' },
		{ name: '黑钻' }
	]);
</script>

<style lang="scss" scoped>
	.pages {
		// background: linear-gradient(180deg, #C7E7A5 0%, #FCFFFC 30%);
	}
	.topBox{
		position:absolute;
		top:0;
		left:0;
		width: 100%;
		height:400rpx;
	}

	.container {
		width: 100%;
		min-height: 100vh;
		background: #F5F5F4;
	}

	.cardBox {
		width: 702rpx;
		min-height: 160rpx;
		margin: 24rpx;
		border-radius: 20rpx;
		background: #F8F8F8;
		display: flex;
		padding: 24rpx 24rpx 24rpx 167rpx;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;

		.cardBox-cenr-title {
			font-weight: 500;
			display: inline-block;
			width: 280rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 36rpx;
		}

		.cardBox-cenr-text {
			font-size: 20rpx;
		}

		.cardBox-cenr {
			display: flex;
			flex-direction: column;

			.cardBox-cenr-text1 {
				font-size: 24rpx;
				color: #FF7745;
				margin-top: 4rpx;
				text-align: right;
			}
		}

		.cardBox-but {
			width: 135rpx;
			height: 48rpx;
			background: #ECB2B1;
			border-radius: 10rpx;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
		}
	}

	.gnGrid {
		width: 680rpx;
		padding: 20rpx;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 20rpx;

		.gnGrid-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.gnGrid-item-img {
				width: 100rpx;
				height: 100rpx;

				.gnGrid-item-img-ddd {
					width: 100rpx;
					height: 100rpx;
				}
			}

			.gnGrid-item-text {
				margin-top: 10rpx;
				font-size: 26rpx;
			}
		}
	}

	.spekBox {

		width: 550rpx;
		margin: 0 auto;

		.spekBox-line {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.spekBox-line-rod {
				width: 20rpx;
				height: 20rpx;
				border: 1rpx solid #BBBBBB;
				border-radius: 50%;
				position: relative;

				.spekBox-line-rod-text {
					width: 70rpx;
					line-height: 38rpx;
					text-align: center;
					border-radius: 10rpx;
					position: absolute;
					top: -45rpx;
					left: 50%;
					transform: translateX(-50%);
					font-size: 24rpx;
				}
			}

			.spekBox-line-lin {
				flex: 1;
				height: 4rpx;
				background: #BBBBBB;
			}

			.activeTextColor {
				background: var(--primary-color);
				color: #FFFFFF;
			}

			.activeColor {
				background: var(--primary-color);
			}
		}
	}

	.headCen {
		display: flex;
		align-items: center;
		.headCen-icon {
			display: flex;
			align-items: center;
			font-size: 22rpx;
			color: #FFFFFF;
			width: 138rpx;
			height: 38rpx;
			background: linear-gradient(270deg, #D7EEBB 0%, #EDF8DF 100%);
			border-radius: 100rpx 0rpx 0rpx 100rpx;
			padding: 4rpx 10rpx;
			position: absolute;
			right: 0;
			top: 18rpx;
		}

		.dongwu-icon {
			position: absolute;
			width: 179rpx;
			height: 250rpx;
			right: 53rpx;
			bottom: 0;
		}
	}

	.temColor {
		color: #fff;
	}

	.headCard2 {
		width: 680rpx;
		// height: 200rpx;
		padding: 24rpx;
		box-sizing: border-box;
		margin: 0 auto;
		// border: 1rpx solid #EEEEEE;
		border-radius: 34rpx 34rpx 0 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		// box-shadow:
		// 	0 -8px 14px -3px rgba(0, 0, 0, .2),
		// 	/* 上面阴影 */
		// 	-8px 0 14px -3px rgba(0, 0, 0, .2),
		// 	/* 左侧阴影 */
		// 	8px 0 14px -3px rgba(0, 0, 0, .2);

		/* 右侧阴影 */
		.headCard-img {
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
			background: #EEEEEE;
		}

		.headCard-center {
			width: calc(100% - 150rpx);

			.fontText {
				color: #000000;
				font-size: 28rpx;
				font-weight: 700;
				margin-bottom: 10rpx;
			}

			.fontText2 {
				width: 200rpx;

				font-size: 24rpx;
				color: #fff;
			}
		}
	}

	.headCard {
		width: 702rpx;
		height: 313rpx;
		padding: 24rpx;
		box-sizing: border-box;
		margin: 24rpx;
		border-radius: 34rpx;
		display: flex;
		position: relative;
		justify-content: space-between;


		/* 右侧阴影 */
		.headCard-img {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			background: #EEEEEE;
			margin-right: 20rpx;
		}

		.headCard-center {
			width: calc(100% - 150rpx);

			.fontText {
				display: inline-block;
				width: 140rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #fff;
				font-size: 28rpx;
				font-weight: 700;
				margin-bottom: 10rpx;
			}

			.fontText2 {
				min-width: 300rpx;
				z-index: 999999;
				font-size: 24rpx;
				color: #fff;
			}
		}
	}

	.fontTitle {
		color: var(--primary-color);
		font-size: 30rpx;
		font-weight: 700;
		text-align: center;
		line-height: 100rpx;
	}

	.pageView {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		// box-shadow: 0 -8px 12px -8px rgba(0, 0, 0, 0.3);
		position: relative;
		z-index: 1;
	}

	.qyGrid {
		width: 100%;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 20rpx;
		padding: 20rpx 60rpx;

		.qyGrid-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.qyGrid-item-img {
			width: 100rpx;
			height: 100rpx;
		}

		.qyGrid-item-text {
			margin-top: 28rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #333333;
		}
	}

	.butBox {
		padding: 20rpx;
		box-sizing: border-box;

		.butColor1 {
			background: var(--but-color-line);
		}

		.butColor2 {
			background: linear-gradient(272deg, #FF8B0E 0%, #FFC688 100%);
		}

		.butBox-item {
			width: 100%;
			height: 107rpx;
			color: #FFFFFF;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-radius: 10rpx;
			position: relative;

			.butBox-item-title {
				font-size: 28rpx;
			}

			.butBox-item-text {
				font-size: 22rpx;
				margin-top: 5rpx;
			}

			.butBox-item-icon {
				line-height: 44rpx;
				display: inline-block;
				font-size: 20rpx;
				background: #FF8B0E;
				padding: 0rpx 20rpx;
				border-radius: 20rpx;
				position: absolute;
				top: -20rpx;
				left: 50%;
				transform: translateX(-50%);

			}
		}
	}

	.dhBox {
		padding: 20rpx;
		box-sizing: border-box;

		.dhBox-title {
			height: 90rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.fontdhTitle {
				display: flex;
				align-items: self-start;
				font-family: DingTalk, DingTalk;
				font-weight: normal;
				font-size: 32rpx;
				color: #333333;
				font-weight: 600;
			}

			.fontdhText {
				font-size: 24rpx;
				color: #666666;
			}
		}

		.dhBoxView::-webkit-scrollbar {
			display: none;
		}

		.dhBoxView {
			display: flex;
			flex-wrap: nowrap;
			/* 不换行 */
			overflow-x: auto;
			/* 横向可滚动 */
			-webkit-overflow-scrolling: touch;
			/* iOS 惯性滚动 */
			scroll-behavior: smooth;
			/* 平滑滚动（可选） */
			padding: 20rpx 0;
			margin: 0 -20rpx;

			.dhBoxView-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 164rpx;
				text-align: center;
				margin-right: 20rpx;

				.dhBoxView-item-img {
					height: 99rpx;
					margin: 32rpx;
				}

				.dhBoxView-item-text-1 {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 100%;
					display: block;
					font-weight: 400;
					font-size: 24rpx;
					color: #333333;
				}

				.dhBoxView-jinbi {
					width: 27rpx;
					height: 21rpx;
					margin-left: 20rpx;
				}

				.dhBoxView-item-text {
					font-weight: 400;
					font-size: 28rpx;
					color: #FF9B36;
					display: flex;
					align-items: center;
					margin-top: 10rpx;
				}
			}
		}
	}

	.dhBoxView-jinbi {
		width: 27rpx;
		height: 21rpx;
		margin-left: 8rpx;
	}

	.jl-fa {
		width: 148rpx;
		height: 48rpx;
		background: #EFEFEF;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 400;
		font-size: 24rpx;
		color: #909599;
	}

	.tan-pupo {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff8e6;
		/* 浅橙色背景 */
		border-radius: 47rpx;
		box-shadow: 0 4rpx 12rpx rgba(255, 150, 0, 0.1);
		box-sizing: border-box;
		margin: 20rpx;
		font-size: 28rpx;
		color: #333;
		position: relative;
		overflow: hidden;
	}

	.jinggao-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
		vertical-align: middle;
	}

	.tan-pupo-right {
		flex: 1;
	}

	.tan-pupo-right-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.tan-pupo-right-top-t {
		font-weight: bold;
		color: #FF9B36;
		font-size: 24rpx;
	}

	.tan-pupo-right-top-x {
		width: 20rpx;
		height: 20rpx;
		cursor: pointer;
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	.tan-pupo-right-top-x:hover {
		opacity: 1;
	}

	.tan-pupo-right-boom-t {
		font-size: 20rpx;
		color: #666;
		line-height: 1.5;
	}

	.tan-pupo-right-boom-t text {
		color: #D9B7B8;
		font-weight: bold;
	}

	// ----------
	.rank-list-container {
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tab-header {
		display: flex;
		justify-content: space-around;
		padding: 20rpx 0;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
	}

	.tab-item {
		font-size: 32rpx;
		color: #666;
		padding: 10rpx 0;
		border-bottom: 2rpx solid transparent;
		display: flex;
		align-items: center;
		flex-direction: column;
		flex: 1;
		text-align: center;
	}

	.tab-item.active {
		color: var(--primary-color);
		font-weight: bold;
	}

	.line-tab {
		width: 32rpx;
		height: 4rpx;
		background: var(--primary-color);
		border-radius: 2rpx;
		margin-top: 20rpx;
	}

	.filter-bar {
		width: 160rpx;
		padding: 10rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
	}

	.filter-item {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		text-align: center;
	}

	.rank-list {
		padding: 20rpx;
		background-color: #f9f9f9;
		max-height: 800rpx;
		overflow-y: auto;
		/* 允许垂直滚动 */
	}

	.rank-list::-webkit-scrollbar {
		display: none;
	}

	.top-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		background-color: var(--label-color);
		border-bottom: 1rpx solid #ddd;
	}



	.normal-item {

		display: flex;
		align-items: center;
		padding: 24rpx;
		background: var(--tabbar-bg);
		border-bottom: 1rpx solid #eee;
	}

	.top-badge {
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 50%;
		color: white;
		font-size: 24rpx;
		margin-right: 20rpx;
		font-weight: bold;
	}

	.top-1 {
		background-color: #f7931a;
	}

	.top-2 {
		background-color: #1e90ff;
	}

	.top-3 {
		background-color: #ff6347;
	}

	.avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		border: 2rpx solid #fff;
		margin-left: 37rpx;
	}

	.avatar2 {
		width: 17rpx;
		height: 11rpx;
		margin-left: 20rpx;
	}

	.avatar1 {
		width: 65rpx;
		height: 41rpx;
	}

	.user-info {
		width: 260rpx;
	}

	.username {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}

	.nickname {
		font-size: 24rpx;
		color: #999;
	}

	.score {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}

	.rank {
		width: 40rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-right: 20rpx;
	}


	.top-rank-container {
		display: flex;
		justify-content: space-around;
		padding: 40rpx 20rpx 20rpx;
		background-color: #fff;
		border-radius: 16rpx;
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


	// .avatar-overlay {
	// 	width: 72rpx;
	// 	height: 72rpx;
	// 	border-radius: 50%;
	// 	position: absolute;
	// 	z-index: 2;
	// 	border: 2rpx solid #fff;
	// 	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.15);
	// }

	/* 手动调整头像位置 */

	.username {
		font-size: 26rpx;
		color: #333;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 120rpx;
	}

	::v-deep .u-navbar__content {
		background: none !important;
	}
</style>