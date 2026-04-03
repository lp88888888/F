<template>
	<view class="pjall" :data-theme="pageTheme">
		<view class="pg_bg"></view>
		<up-navbar bgColor="transparent" placeholder :fixed="true" title="全部已评价" autoBack></up-navbar>

		<!-- tab切换 -->
		<view class="tab_box">
			<view class="tab_item" v-for="(item, index) in dictlist" :key="index" @click="handleTab(item)">
				<text class="item_text" :class="{ active: tabindex === item.dictValue }">{{ item.dictLabel }}</text>
				<image v-if="tabindex === item.dictValue" class="item_img" :src="`${imgUrl}static/search_tab_icon.png`" mode=""></image>
			</view>
		</view>

		<scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="lower">
			<!-- 评价list -->
			<template v-if="rewiverlist.length">
				<view class="list_box" v-for="(item, index) in rewiverlist" :key="index">
					<view class="list_time">
						<text class="time_text">{{ item.createTime }}</text>
						<uni-icons type="trash" size="14" @click="handleDel(item)"></uni-icons>
					</view>
					<!-- <view class="list_rate" v-for="(item1, index1) in item.sysReviewDimensionScoreVoList || item.scoreList" :key="index1">
						<text class="rate_text">{{ item1.dimensionName || item1.scoreDesc }}</text>
						<up-rate count="5" :value="item1.score" readonly size="18" activeColor="#FF9600" inactiveColor="#FF9600"></up-rate>
						<text class="rate_text1">{{ item1.score }}</text>
					</view> -->
					<view class="list_rate">
						<text class="rate_text">评分</text>
						<up-rate count="5" :modelValue="item.totalScore" readonly size="18" activeColor="#FF9600" inactiveColor="#FF9600"></up-rate>
						<text class="rate_text1">{{ item.totalScore }}</text>
					</view>
					<text class="list_comment">{{ item.content || item.commentContent }}</text>
					<template v-if="tabindex == 'HOTEL_APPOINTMENT'">
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
					</template>
					<template v-else>
						<view class="list_img">
							<image
								class="img_item"
								:src="item1"
								mode=""
								v-for="(item1, index1) in item.imageUrls"
								:key="index1"
								@click="$previewListImage(index1, item.imageUrls)"
							></image>
						</view>
					</template>
					<up-line></up-line>
					<view class="list_info" v-if="tabindex == 'HOTEL_APPOINTMENT'">
						<image class="info_img" :src="item.mainImage" mode=""></image>
						<view class="info_box">
							<text class="info_title">{{ item.hotelName }}</text>
							<text class="info_gg">{{ item.specification }}</text>
						</view>
					</view>
					<view class="list_info" v-else>
						<image class="info_img" :src="item?.payNotReviewOrderVo.orderImage" mode=""></image>
						<view class="info_box">
							<text class="info_title">{{ item?.payNotReviewOrderVo.orderTitle }}</text>
							<text class="info_gg">{{ item?.payNotReviewOrderVo.specification }}</text>
						</view>
					</view>
				</view>
			</template>

			<!-- 没有数据 -->
			<ser-empty v-else text="暂无评价"></ser-empty>

			<!-- 删除弹窗 -->
			<up-popup :show="popshow" mode="center" :closeOnClickOverlay="false" :safeAreaInsetBottom="false" @close="closePop">
				<view class="pop_box">
					<view class="pop_title">提示</view>
					<view class="pop_cont">删除后无法恢复，您确认要删除该条评价吗？</view>
					<view class="btn_box">
						<view class="btn_1" @click="closePop"> 取消 </view>
						<view class="btn_2" @click="changeDel"> 确定 </view>
					</view>
				</view>
				<template #bottom>
					<view class="close_icon">
						<uni-icons type="close" size="30" color="#ffffff" @click="closePop"></uni-icons>
					</view>
				</template>
			</up-popup>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { toNav, toBack } from '@/utils/route';
import { imgUrl } from '../../config';
// 主题
import { useTheme } from '@/composables/useTheme';
import { ref } from 'vue';
const { themeStore, pageTheme } = useTheme();
import { getorderReview, getHotelReview, delHotelReview, delorderReview } from '@/api/points';
import { getDict } from '@/api/config';
import { $previewListImage } from '@/utils/util';

const tabindex = ref('');
const handleTab = (item) => {
	tabindex.value = item.dictValue;
	pageNum.value = 1;
	if (tabindex.value === 'HOTEL_APPOINTMENT') {
		gethotellist();
	} else {
		orderreview();
	}
};

const score = ref(3);

const popshow = ref(false);
const infodata = ref({});

// 点击删除
const handleDel = (item) => {
	infodata.value = item;
	popshow.value = true;
};

// 确认删除评论
const changeDel = async () => {
	try {
		const res = tabindex.value === 'HOTEL_APPOINTMENT' ? await delHotelReview({ id: infodata.value.id }) : await delorderReview(infodata.value.id);
		console.log('删除的评论', res);
		const index = rewiverlist.value.findIndex((e) => e.id == infodata.value.id);
		rewiverlist.value.splice(index, 1);
		closePop();
	} catch (err) {
		console.error('删除错误', err);
	}
};

// 关闭弹窗
const closePop = () => {
	popshow.value = false;
	infodata.value = {};
};

const pageNum = ref(1);
const pageSize = ref(20);
const total = ref(0);
const rewiverlist = ref([]);

// 查询除酒店外的评价列表
const orderreview = async () => {
	try {
		const res = await getorderReview(tabindex.value, {
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		});
		console.log('查询的已评价', res);
		rewiverlist.value = pageNum.value == 1 ? res.data.list : rewiverlist.value.concat(res.data.list);
		total.value = res.data.total;
	} catch (err) {
		console.error('查询的已评价失败', err);
	}
};

// 查询酒店评价列表
const gethotellist = async () => {
	try {
		const res = await getHotelReview({
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		});
		console.log('查询的酒店已评价', res);
		rewiverlist.value = pageNum.value == 1 ? res.data.list : rewiverlist.value.concat(res.data.list);
		total.value = res.data.total;
	} catch (err) {
		console.error('查询的酒店已评价失败', err);
	}
};

// 查询字典
const dictlist = ref([]);
const getdictlist = async () => {
	try {
		const res = await getDict('review_biz_type');
		console.log('查询的字典', res);
		dictlist.value = res.data;
		if (dictlist.value.length) {
			if (!tabindex.value) {
				tabindex.value = dictlist.value[0].dictValue;
			}
			if (tabindex.value === 'HOTEL_APPOINTMENT') {
				gethotellist();
			} else {
				orderreview();
			}
		}
	} catch (err) {
		console.error('字典查询失败', err);
	}
};

// 触底加载
const lower = () => {
	console.log('上拉加载');
	if (total.value > rewiverlist.value.length) {
		pageNum.value += 1;
		if (tabindex.value === 'HOTEL_APPOINTMENT') {
			gethotellist();
		} else {
			orderreview();
		}
	}
};

onLoad((e) => {
	if (e.type) {
		tabindex.value = e.type;
	}
});
onShow(() => {
	// orderreview();
	getdictlist();
});
</script>

<style lang="scss" scoped>
.pg_bg {
	width: 750rpx;
	height: 448rpx;
	background-image: var(--linear-color);
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: -1;
}
.pjall {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;

	.tab_box {
		width: 690rpx;
		height: 92rpx;
		display: flex;
		align-items: flex-start;
		column-gap: 60rpx;
		overflow: auto;
		.tab_item {
			display: flex;
			flex-direction: column;
			align-items: center;
			.item_text {
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
				margin-bottom: 8rpx;
			}
			.active {
				font-weight: 500;
			}
			.item_img {
				width: 30rpx;
				height: 6rpx;
			}
		}
	}

	.scroll-Y {
		width: 690rpx;
		flex: 1;
		height: 0;
		white-space: nowrap;
	}

	.list_box {
		width: 690rpx;
		background: #ffffff;
		box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(209, 220, 231, 0.4);
		border-radius: 16rpx;
		padding: 30rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		.list_time {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;
			.time_text {
				font-weight: 400;
				font-size: 24rpx;
				color: #666666;
			}
		}
		.list_rate {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			.rate_text,
			.rate_text1 {
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
				margin-right: 20rpx;
			}
		}
		.list_comment {
			display: block;
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
			line-height: 36rpx;
			margin-bottom: 20rpx;
			white-space: break-spaces;
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
		.list_info {
			display: flex;
			align-items: center;
			margin-top: 32rpx;
			.info_img {
				width: 140rpx;
				height: 140rpx;
				background: #f4f4f4;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				margin-right: 26rpx;
			}
			.info_box {
				flex: 1 0;
				width: 0;
				height: 130rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.info_title {
					width: 100%;
					font-weight: 500;
					font-size: 28rpx;
					color: #333333;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.info_gg {
					font-weight: 400;
					font-size: 24rpx;
					color: #666666;
				}
			}
		}
	}
}

.pop_box {
	width: 570rpx;
	height: 400rpx;
	background-image: var(--linear-color);
	border-radius: 24rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	padding: 30rpx 50rpx;
	box-sizing: border-box;
	.pop_title {
		font-weight: 500;
		font-size: 32rpx;
		color: #333333;
	}
	.pop_cont {
		width: 470rpx;
		padding: 0 18rpx;
		font-size: 28rpx;
		color: #333333;
		line-height: 48rpx;
		text-align: center;
		box-sizing: border-box;
		white-space: break-spaces;
	}
	.btn_box {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.btn_1,
		.btn_2 {
			width: 220rpx;
			height: 76rpx;
			border-radius: 414rpx;
			text-align: center;
			line-height: 76rpx;
			font-weight: 500;
			font-size: 28rpx;
		}
		.btn_1 {
			border: 2rpx solid var(--primary-color);
			color: var(--primary-color);
			line-height: 72rpx;
		}
		.btn_2 {
			background: var(--but-color-line);
			color: #ffffff;
		}
	}
}

.close_icon {
	margin-top: 56rpx;
}
</style>
