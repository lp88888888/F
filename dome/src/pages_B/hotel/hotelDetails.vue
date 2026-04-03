<template>
	<view class="hotel-details-page" :data-theme="pageTheme">
		<!-- Banner 区域 -->
		<view class="bannerCon" v-if="banners.length > 0">
			<u-swiper :list="banners" height="486rpx" radius="0" indicator="none" img-mode="heightFix"
				@change="swiperChange" :current="swiperCurrent"></u-swiper>
			<view class="custom-indicator">
				{{ swiperCurrent + 1 }} / {{ banners.length }}
			</view>
			<view class="custom-icon-btn" @click="ongoback">
				<image class="custom-icon" :src="`${imgUrl}trip-pro/arrow-left-icon_w.png`" />
			</view>
		</view>

		<!-- 主内容区 -->
		<view class="ceaten">
			<!-- 酒店信息容器 -->
			<view class="hotel-container">
				<view class="hotel-name-address flex just-sb ali-cen">
					<view class="hotel-name">{{formData.hotelName}}</view>
					<image class="star-icon"
						:src="`${imgUrl}trip-pro/${formData.isCollected ? 'hotel_star_s.png' : 'hotel_star_o.png'}`"
						@click="toggleCollect(formData.isCollected)" />
				</view>

				<view class="facilities">
					<view v-for="(item, index) in formData.serviceItems" :key="index" class="facility-item">
						{{ item }}
					</view>
					<!-- <view class="details-link" @click="showDetails">详情/设施 ></view> -->
				</view>

				<view class="rating-reviews">
					<view class="rating">
						<view class="score">{{formData.avgScore}}</view>
						<view v-if="formData.avgScore<=1" class="description">极差</view>
						<view v-if="formData.avgScore<=2&&formData.avgScore>1" class="description">较差</view>
						<view v-if="formData.avgScore<=3&&formData.avgScore>2" class="description">一般</view>
						<view v-if="formData.avgScore<=4&&formData.avgScore>3" class="description">良好</view>
						<view v-if="formData.avgScore>=4" class="description">优秀</view>

					</view>
					<view class="reviews-count" @click="showReviews">{{formData.commentCount}}条评价</view>
				</view>

				<view class="address-info">
					<view>
						<text class="address">
							{{formData.address}}
						</text>
						<view class="distance">距您{{formData.distance}}km</view>
					</view>
					<view class="contact-map-buttons">
						<view class="contact-button" @click="makeCall">
							<u-image :src="imgUrl+'hotel/phone-2-icon.png'" mode="aspectFit" width="80rpx"
								height="80rpx" class="bot-icon" />
							<text>电话</text>
						</view>
						<view class="map-button" @click="showMap">
							<u-image :src="imgUrl+'hotel/map2-icon.png'" mode="aspectFit" width="80rpx" height="80rpx"
								class="bot-icon" />
							<text>地图</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 酒店资讯 -->
			<view class="news_sw" v-if="newsinfo&&newsinfo.length">
				<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular
					style="width: 702rpx; height: 100rpx">
					<swiper-item class="news_sw_it" v-for="(item,index) in newsinfo" :key="index"
						@click="toNav(`/pages_A/points/newsdetail?id=${item.id}&type=hotel`)">
						<view class="news_title">
							<uni-icons type="sound-filled" color="#3D3D3D" size="24"></uni-icons>
							<text class="news_title_text">{{item.title || ''}}</text>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<!-- 房型列表 -->
			<view class="room-list">
				<view v-for="(item, index) in rooms" :key="index" class="room-item" @click="tohomeDetails">
					<u-image :src="item.mainImage" mode="aspectFill" width="188rpx" height="260rpx"
						border-radius="10rpx" class="room-image" />

					<view class="room-info">
						<view class="room-title" @click.stop="bookRoom(item)">
							<text>{{ item.roomTypeName }}</text>
							<up-icon size="14" name="arrow-right"></up-icon>
						</view>
						<view class="room-description">{{ item.bedType }}</view>
						<view class="room-description">{{ item.zaocan }}</view>
						<view class="boomrt">
							<view>
								<!-- <view class="confirm-button">立即确认</view> -->
								<view class="hotel-price">
									<view class="hotel-pric-1">¥</view>
									{{ item.salePrice }}
									<view class="hotel-pric-2">起</view>
									<view class="hotel-pric-3">¥{{ item.basePrice }}</view>
								</view>
							</view>

							<view :class="item.availableCount >= 1 ? 'book-button' : 'stop-button'"
								@click.stop="bookRoom(item)">
								{{item.availableCount >= 1 ? '订' : '满'}}
								<!-- <view :class="item.availableCount >= 1 ? 'zaixin' : 'stop-zaixin'">在线付</view> -->
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 用户评价区域 -->
			<view class="reviews-container" v-if="reviews.length>0">
				<view class="header">
					<text class="title">网友评价</text>
					<text class="see-all" decode @click="handleSeeAll">查看全部 &gt;</text>
				</view>

				<view class="ratings">
					<view class="total-rating">
						<text class="score1">{{scoredata.totalScore}}</text>
						<view v-if="scoredata.totalScore<=1" class="description1">极差</view>
						<view v-if="scoredata.totalScore<=2&&scoredata.totalScore>1" class="description1">较差</view>
						<view v-if="scoredata.totalScore<=3&&scoredata.totalScore>2" class="description1">一般</view>
						<view v-if="scoredata.totalScore<=4&&scoredata.totalScore>3" class="description1">良好</view>
						<view v-if="scoredata.totalScore>=4" class="description1">优秀</view>
					</view>
					<view class="sub-ratings">
						<view v-for="(item, index) in scoredata.scoreList" :key="index" class="sub-rating">
							<text>{{ item.score }}</text>
							<text>{{ item.scoreDesc }}</text>
						</view>
					</view>
				</view>

				<view class="review-list">
					<view v-for="(item, index) in reviews" :key="index" class="review-item">
						<view class="review-content">
							<view class="user-info">
								<view class="user-left">
									<u-avatar :src="item.userAvatar || defaultAvatar" size="80rpx"></u-avatar>
									<text class="username">{{ item.userNickname }}</text>
								</view>
								<text class="date">{{ item.createTime }}</text>
							</view>
							<text class="comment">{{ item.commentContent }}</text>
							<view class="list_img" v-if="item?.picUrl">
								<image
									class="img_item"
									:src="item1"
									mode=""
									v-for="(item1, index1) in (item?.picUrl || '').split(',')"
									:key="index1"
									@click="$previewListImage(index1, (item?.picUrl || '').split(','))"
								></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import theme from '@/utils/theme'
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { openAPPLocation ,openLocation,$previewListImage,makePhoneCall} from '@/utils/util';
	import { toNav } from '@/utils/route';
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	import { getManagedat, getroomRellist, getcommenthotel, collectionAdd, collectionDelete, gethotelservices,gethotelscoretotal, hotelNews } from '@/api/hotel'
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 类型定义（可提取到 types.ts）

	interface TabItem {
		name : string;
		active : boolean;
	}

	interface RoomItem {
		imageUrl : string;
		name : string;
		description : string;
		zaocan : string;
		currentPrice : number;
		originalPrice : number;
	}

	interface SubRating {
		score : string;
		label : string;
	}

	interface ReviewItem {
		avatar : string;
		username : string;
		date : string;
		comment : string;
	}

	// 响应式数据

	const defaultAvatar = ref('/static/avatar-default.png');
	const swiperCurrent = ref(0);
	const banners = ref<string[]>([]);
	const tabs = ref<TabItem[]>([
		{ name: '封面', active: true },
		{ name: '房间', active: false },
		{ name: '环境', active: false },
	]);

	const facilities = ref<string[]>(['免费停车', '餐厅', '会议室', '健身房']);

	const rooms = ref<RoomItem[]>([

	]);
	const hotelid = ref('');
	const formData = ref({});
	const scoreList = ref([])
	const zongfen = ref(0)
	const bedOptions = ref([])
	const toggleCollect = (type) => {
		let params = {
			hotelId: hotelid.value
		}
		if (type == true) {
			collectionDelete(hotelid.value).then((res : any) => {
				formData.value.isCollected = false
			})
		} else {
			collectionAdd(params).then((res : any) => {
				formData.value.isCollected = true
			})
		}
	}
	const getsaixunlist1 = () => {
		gethotelservices('hotel_services').then(res => {
			bedOptions.value = res.data.map(item => ({
				...item,
			}))
			formData.value.serviceItems = formData.value.serviceItems.map(value => {
				const dictItem = bedOptions.value.find(item => item.dictValue === value);
				return dictItem ? dictItem.dictLabel : value; // 如果找不到对应的标签，保持原值
			});
			console.log(formData.value.serviceItems, 'formData.value.serviceItems')

		})
	}
	const ongoback = () => {
		uni.navigateBack()
	}
	const swiperChange = (e) => {
		swiperCurrent.value = e.current;
	};
	const handleSeeAll = () =>{
		uni.navigateTo({
			url:`/pages_C/evaluation/list?type=hotel&spuId=${hotelid.value}`
		})
	}
	
	const getInfo = () => {
		let params = {
			id: hotelid.value,
			longitude: currentLng.value,
			latitude: currentLat.value,
		}
		getManagedat(params).then((res : any) => {
			formData.value = res.data
			banners.value = res.data.mainImage.split(',')
			console.log(banners.value, 'banners')
			getsaixunlist1()
			// console.log(res.data, 'res.data')
		})
	}
	const getrooomlist = () => {
		let params = {
			hotelId: hotelid.value,
			pageNum: 1,
			pageSize: 10,
			status: 1
		}

		getroomRellist(params).then((res : any) => {
			rooms.value = res.rows
			console.log('---0-00--00---0', res.rows);
			rooms.value.forEach((item, index) => {
				if (item.mainImage) {
					item.mainImage = item.mainImage.split(',')[0]
				}
			})
		})
	}
	const getcommenthotellist = () => {
		let params = {
			hotelId: hotelid.value,
			pageNum: 1,
			pageSize: 10
		}
		getcommenthotel(params).then((res : any) => {
			reviews.value = res.rows
			scoreList.value = res.rows[0].scoreList
			zongfen.value = res.rows[0].totalScore
		})
	}
	
	const scoredata = ref({
		totalScore:0,
		scoreList:[]
	})
	const getallscore = async () =>{
		try{
			const res = await gethotelscoretotal(hotelid.value)
			console.log("查询的总分",res)
			scoredata.value = res.data
		}catch(err){
			console.error("查询的总分报错",err)
		}
	}
	const subRatings = ref<SubRating[]>([
		{ score: '4.8', label: '位置' },
		{ score: '4.7', label: '设施' },
		{ score: '4.9', label: '服务' },
		{ score: '5.0', label: '卫生' },
	]);
	const reviews = ref<ReviewItem[]>([

	]);

	// 路由
	const router = useRouter();

	// 方法
	const switchTab = (index : number) => {
		tabs.value = tabs.value.map((tab, i) => ({
			...tab,
			active: i === index,
		}));
	};

	const tohomeDetails = () => {
		router.push('/packageA/pages/hotel/hotellist/homeDetails/index');
	};

	const bookRoom = (item : HotelItemr) => {
		if (item.availableCount == 0) return uni.showToast({ title: '该房型已满房', icon: 'none' });
		uni.navigateTo({
			url: `/pages_B/hotel/homeDetails?id=${item.id}`
		})
	};

	const showDetails = () => {
		router.push('/pages/details/details');
	};

	const showReviews = () => {
		router.push('/pages/reviews/reviews');
	};

	const showMap = () => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": formData.value.longitude,
					"latitude": formData.value.latitude,
					"address": formData.value.address
				}
			}
			openAPPLocation(navigationInfo)
		} else {
			openLocation({
				latitude: formData.value.latitude,
				longitude: formData.value.longitude,
				scale: 18,
				name: formData.value.hotelName,
				address: formData.value.address,
			});
		}

	};

	const makeCall = () => {
		makePhoneCall(formData.value.contactPhone);
	};

	const showMore = () => {
		uni.showToast({ title: '相册功能暂未开放', icon: 'none' });
	};
	onLoad((options) => {
		console.log(options, 'options')
		hotelid.value = options.id; // 修正了这一行
		getNewsList()
		initMap()
	})
	const currentLat = ref('')
	const currentLng = ref('')
	const initMap = async () => {
		try {
			// 获取用户位置
			currentLat.value = uni.getStorageSync('address').lat;
			currentLng.value = uni.getStorageSync('address').lng;
			getInfo()

		} catch (err) {
			console.error('初始化地图失败:', err);
		} finally {

		}
	}
	
	const newsinfo = ref([])
	const getNewsList = async () => {
		try{
			const res = await hotelNews({
				pageNum: 1,
				pageSize: 100,
				status: 0,
				hotelId: hotelid.value
			})
			console.log("查询的资讯信息", res)
			newsinfo.value = res.rows
		}	catch(err){
			console.log("咨询查询失败", err)
		}
	}

	onShow(() => {
		getcommenthotellist();
		getrooomlist();
		getallscore();
	});
</script>

<style lang="scss" scoped>
	.custom-indicator {
		position: absolute;
		bottom: 20rpx; // 调整距离底部的距离
		right: 20rpx; // 调整距离右侧的距离
		background-color: rgba(0, 0, 0, 0.3); // 半透明黑色背景
		color: #ffffff; // 白色文字
		padding: 6rpx 16rpx; // 内边距
		border-radius: 20rpx; // 圆角
		font-size: 24rpx; // 字体大小
		z-index: 10; // 确保在轮播图之上
	}

	.custom-icon-btn {
		width: 48rpx;
		height: 48rpx;
		background: rgba(0, 0, 0, 0.4);
		position: absolute;
		top: 106rpx; // 调整距离底部的距离
		left: 20rpx; // 调整距离右侧的距离
		z-index: 10; // 确保在轮播图之上
		border: 50%;
		text-align: center;
		line-height: 48rpx;
		border-radius: 50%;
	}

	.custom-icon {
		width: 32rpx;
		height: 32rpx;
		margin-top: 6rpx;
	}

	.hotel-details-page {
		background: var(--head-color);
		min-height: 100vh;
	}

	.bannerCon {
		position: relative;
		height: 486rpx;
	}

	.banner-line {
		position: absolute;
		bottom: 12rpx;
		left: 12rpx;
		display: flex;
		align-items: center;
		width: 400rpx;
		height: 48rpx;
		border-radius: 32rpx;
		background: rgba(0, 0, 0, 0.7);
		padding-left: 10rpx;
	}

	.tab {
		font-size: 20rpx;
		color: #fff;
		line-height: 40rpx;
		text-align: center;
		border-radius: 24rpx;
		width: 86rpx;
		height: 40rpx;
	}

	.tab.active {
		background-color: rgba(255, 255, 255, 0.8);
		color: #333;
	}

	.divider {
		margin: 0 10rpx;
		color: #999;
	}

	.arrow-icon {
		width: 12rpx;
		height: 12rpx;
		margin-left: 8rpx;
	}

	.ceaten {
		padding: 32rpx;
	}

	.hotel-container {
		padding: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}

	.hotel-name-address {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.star-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.hotel-name {
		width: 560rpx;
	}

	.facilities {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}

	.facility-item {
		height: 40rpx;
		border-radius: 4px;
		background: var(--label-color);
		font-size: 24rpx;
		color: var(--primary-color);
		text-align: center;
		line-height: 40rpx;
		margin-right: 20rpx;
		padding: 0 8rpx;
		margin-bottom: 10rpx;
	}

	.details-link {
		font-size: 24rpx;
		color: var(--primary-color);
		margin-left: auto;
	}

	.rating-reviews {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.rating {
		width: 176rpx;
		height: 56rpx;
		border-radius: 28rpx;
		display: flex;
		align-items: center;
		// background: var(--label-color);
	}

	.score {
		font-size: 40rpx;
		width: 100rpx;
		height: 56rpx;
		border-radius: 28rpx 0 0 28rpx;
		background: var(--primary-color);
		color: #fff;
		text-align: center;
		line-height: 56rpx;
		margin-right: 10rpx;
	}

	.description {
		font-size: 24rpx;
		color: var(--primary-color);
	}

	.reviews-count {
		font-size: 24rpx;
		color: var(--primary-color);
	}

	.address-info {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.address {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		width: 380rpx;
		word-break: break-word;
	}

	.distance {
		font-size: 28rpx;
		color: #666;
		margin-top: 10rpx;
	}

	.contact-map-buttons {
		display: flex;
		gap: 20rpx;
	}

	.contact-button,
	.map-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 24rpx;
		color: var(--primary-color);
	}

	.bot-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 20rpx;
	}
	
	// 资讯
	.news_sw {
		width: 702rpx;
		background-color: #f8f9fa;
		border-radius: 16rpx;
		margin-bottom: 30rpx;
	
		.news_sw_it {
			width: 702rpx;
			height: 100rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
	
			.news_title {
				width: 100%;
				height: 90rpx;
				display: flex;
				align-items: center;
	
				>text:nth-child(2) {
					flex: 1 0;
					width: 0;
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-left: 26rpx;
				}
			}
		}
	}

	.room-list {
		margin-top: 20rpx;
	}

	.room-item {
		padding: 32rpx;
		background-color: #fff;
		display: flex;
		margin-bottom: 20rpx;
		border-radius: 16rpx;
	}

	.room-image {
		width: 188rpx;
		height: 260rpx;
		border-radius: 10rpx;
	}

	.room-info {
		flex: 1;
		margin-left: 20rpx;
	}

	.room-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		display: flex;
		align-items: center;
	}

	.arrow {
		font-size: 32rpx;
		color: #999;
		margin-left: 10rpx;
	}

	.room-description {
		font-size: 24rpx;
		color: #666;
		margin: 20rpx 0;
	}

	.confirm-button {
		width: 120rpx;
		height: 40rpx;
		border: 1px solid #999;
		border-radius: 4rpx;
		color: #333;
		font-size: 24rpx;
		text-align: center;
		line-height: 40rpx;
	}

	.hotel-price {
		font-size: 48rpx;
		font-weight: bold;
		color: var(--primary-color);
		display: flex;
		align-items: center;
		margin-top: 10rpx;
	}

	.hotel-pric-1 {
		font-size: 26rpx;
		margin-right: 10rpx;
	}

	.hotel-pric-2 {
		font-size: 28rpx;
		color: #666;
		margin: 0 10rpx;
	}

	.hotel-pric-3 {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
	}

	.book-button {
		width: 96rpx;
		height: 96rpx;
		background: var(--primary-color);
		color: #fff;
		font-size: 32rpx;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.stop-button {
		width: 96rpx;
		height: 96rpx;
		background-color: #C9C9C9;
		color: #fff;
		font-size: 32rpx;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.zaixin {
		background-color: #fff;
		width: 88rpx;
		height: 40rpx;
		color: var(--primary-color);
		font-size: 24rpx;
		text-align: center;
		line-height: 40rpx;
		margin-top: 8rpx;
	}

	.stop-zaixin {
		background-color: #fff;
		width: 88rpx;
		height: 40rpx;
		color: #999999;
		font-size: 24rpx;
		text-align: center;
		line-height: 40rpx;
		margin-top: 8rpx;
	}

	.boomrt {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.reviews-container {
		background-color: #fff;
		padding: 32rpx;
		border-radius: 16rpx;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 36rpx;
		color: #333;
	}

	.see-all {
		font-size: 28rpx;
		color: var(--primary-color);
	}

	.ratings {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.total-rating {
		display: flex;
		align-items: center;
	}

	.score1 {
		font-size: 48rpx;
		color: var(--primary-color);
		margin-right: 10rpx;
	}

	.description1 {
		font-size: 28rpx;
		color: #666;
	}

	.sub-ratings {
		display: flex;
	}

	.sub-rating {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-left: 44rpx;
	}

	.sub-rating text:first-child {
		font-size: 32rpx;
		color: var(--primary-color);
	}

	.sub-rating text:last-child {
		font-size: 24rpx;
		color: #666;
	}

	.review-list {
		margin-top: 48rpx;
	}

	.review-item {
		margin-bottom: 20rpx;
	}

	.user-left {
		display: flex;
		align-items: center;
	}

	.username {
		font-size: 32rpx;
		color: #333;
		margin-left: 20rpx;
	}

	.date {
		font-size: 24rpx;
		color: #999;
	}

	.comment {
		font-size: 28rpx;
		color: #666;
		line-height: 40rpx;
		margin-top: 10rpx;
	}
	
	.list_img {
		width: 630rpx;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 30rpx;
		margin-bottom: 20rpx;
		.img_item {
			width: 100%;
			height: 190rpx;
			background: #f4f4f4;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
		}
	}
</style>