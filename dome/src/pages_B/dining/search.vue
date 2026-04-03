<template>
  <view class="page-container">
    <up-sticky z-index="8888">
        <view class="topBox" :style="{background: '#FFFFFF'}">
            <up-navbar title="搜索" bgColor="transparent"  @leftClick="toBack" placeholder :fixed="false" :titleStyle="{ fontWeight: 'bold' }" ></up-navbar>
            <view class="serachView">
                <u-search v-model="keyword" :showAction="false" placeholder="请输入商品名/商家名查找" shape="round" bgColor="#eee" @focus="searchFocus" @search="onSearch" />
            </view>
        </view>
    </up-sticky>
    <view class="pageView">
        <view class="hisBox" v-if="isFocus">
            <view class="fl-ce-sb">
                <text class="hisBox-title">历史搜索</text>
                <view class="hisBox-title-right" @click="isDel = !isDel">
                    <image
                        :src="imgUrl + 'static/edit-icon-000.png'"
                        mode="scaleToFill"
                    />
                    <text>{{ isDel ? '完成' : '编辑' }}</text>
                </view> 
            </view>
            <view class="hisBox-list">
                <view class="hisBox-item" v-for="(item,index) in historyList" :key="index" @click="hisClick(item)">
                    <text>{{ item.searchName }}</text>
                    <image
                        v-if="isDel"
                        :src="imgUrl + 'static/del-his-icon.png'"
                        mode="scaleToFill"
                    />
                </view>
            </view>
            <view class="fl-ce-sb" v-if="isDel">
                <text class="hisBox-title"></text>
                <view class="hisBox-title-right" @click="clearAll">
                    <image
                        :src="imgUrl + 'static/edit-icon-000.png'"
                        mode="scaleToFill"
                    />
                    <text>全部删除</text>
                </view> 
            </view>
        </view>
        <view v-else>
            <view class="list">
				<view v-for="shop in dataList" :key="shop.id" :border="false" :headBorderBottom="false"
					:footBorderTop="false" :padding="0" @click="toDetail(shop)" bodyStyle="padding: 16rpx 20rpx 20rpx 20rpx;" class="shop-card">
					<view class="shop-row">
						<u--image :src="shop.shopImage" width="170rpx" height="170rpx" radius="13" />
						<view class="shop-main">
							<view class="fl-al-ce">
								<text class="statusText">{{shop.openState == '01'?'营业中':'休息中'}}</text>
								<text class="name">{{ shop.shopName }}</text>
							</view>
							<view>
								<text class="time">
									营业时间：
									<text class="times">{{ shop.eatInOpenTime }}</text>
								</text>
							</view>
							<view class="name-row">
								<view class="metas-row">
									<!-- <text class="meta-addr">{{shop.listGroupName}}</text> -->
								</view>
								<view class="phone" @click.stop="makePhoneCall(shop.phone)">
									<u-icon :name="imgUrl+'static/eat-ipone-ionc.png'" size="22"/>
								</view>
							</view>
						</view>
					</view>
					<view class="addr-row" @click.stop="navigation(shop)">
						<u-icon name="map" size="16" color="#000000" />
						<text class="addr">{{ shop.address }}</text>
						<view class="flex-spacer" />
						<text class="dist">距您{{ shop.straightLineDistance }}</text>
						<u-icon name="arrow-right" size="12" color="#333333" />
					</view>
				</view>
			</view>
            <ser-empty v-if="!dataList.length"></ser-empty>
        </view>
    </view>
    
    
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { toBack,toNav } from "@/utils/route";
import { imgUrl } from "@/config";
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import {listOdsFzgRestaurantInfo} from '@/api/premium';
import {listSearchRecord,addSearchRecord,delSearchRecord,delAllSearchRecord} from '@/api/config';
import {openLocation,makePhoneCall} from '@/utils/util';
import theme from '@/utils/theme';
import {toast} from '@/utils/common';
const historyList = ref([]); // 历史记录
const listQuery = ref({
    pageNum:1,
    pageSize:10,
    // openState:undefined,
    gitu:'', // 纬度
    titu:'', // 经度
});
const total = ref(0); // 总数
const dataList = ref([]); // 数据列表
const keyword = ref(''); //
const isDel = ref(false); // 是否显示删除按钮
const isFocus = ref(true); // 是否聚焦
const searchFocus = ()=>{
 isFocus.value = true;
}
const toDetail = (shop) => {
    uni.setStorageSync('diningShopInfo', shop);
    toNav('/pages_B/dining/diningHome?id='+shop.shopId)
};
const onSearch = async ()=>{
    if(keyword.value){
        await addSearchRecord({
            businessType:0,
            searchName:keyword.value
        })
    };
    isFocus.value = false;
    init();
}
const hisClick = (item)=>{
    if(isDel.value){
        delHisItem(item.id);
    }else{
        keyword.value = item.searchName;
        isFocus.value = false;
        init();
    }
}
// 删除单个历史记录
const delHisItem = async(id)=>{
    const res = await delSearchRecord(id);
    if(res.code === 200){
        toast('删除成功');
        getHisData();
    }else{
        toast(res.msg);
    }
}
// 清除全部
const clearAll=async()=>{
   
    const res =await delAllSearchRecord(0);
    if(res.code === 200){
        toast('删除成功');
         historyList.value = [];
        getHisData();
        isDel.value = false;
    }else{
        toast(res.msg);
    }
}
const init = ()=>{
    listQuery.value.pageNum = 1;
    getList();
    getHisData();
}
const navigation = (shop) => {
    openLocation({
        latitude: shop.titu,
        longitude: shop.gitu,
        name: shop.shopName,
        address: shop.address,
    });
}

const getList = async ()=>{
    try{
        const res = await listOdsFzgRestaurantInfo({
            ...listQuery.value,
            search:keyword.value,
        });
        if(res.code === 200){
            const {data} = res;
            dataList.value = listQuery.value.pageNum === 1? res.data.list : [...dataList.value,...res.data.list];
            total.value = res.data.total;
        }else{
            toast(res.msg);
        }
    }catch(e){
        console.log(e);
    }
};
// 获取搜索记录列表
const getHisData = async ()=>{
    const res = await listSearchRecord(0);
    if(res.code === 200){
        historyList.value = res.data;
    }
}


onLoad((opticon)=>{
    // if(uni.getStorageSync('diningSearchHistory')){
    //     historyList.value = uni.getStorageSync('diningSearchHistory');
    // }
    if(opticon){
        listQuery.value.gitu = opticon.gitu;
        listQuery.value.titu = opticon.titu;
    }
    getHisData();
});
onReachBottom(()=>{	
    if(listQuery.value.pageNum*listQuery.value.pageSize <= total.value){
        listQuery.value.pageNum++;
        getList();
    }
});

</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background:$pageBgColor;
}
.pageView{
    padding: 30rpx;
    box-sizing: border-box;
}
.topBox{
    width: 100%;

}
.serachView{
    width: 100%;
    padding: 20rpx 32rpx;
    box-sizing: border-box;
}

.hisBox{
    .hisBox-title{
        font-weight: 400;
        font-size: 32rpx;
        color: #333333;
        line-height: 46rpx;
    }
    .hisBox-title-right{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        image{
            width: 24rpx;
            height: 24rpx;
            margin-right: 4rpx;
        }
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 34rpx;
    }
    .hisBox-list{
        padding: 25rpx 0;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        grid-gap: 20rpx;
        .hisBox-item{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6rpx 34rpx;
            box-sizing: border-box;
            background: #FFFFFF;
            border-radius: 28rpx 28rpx 28rpx 28rpx;
            font-weight: 400;
            font-size: 26rpx;
            color: #333333;
            line-height: 40rpx;
            image{
                width: 24rpx;
                height: 24rpx;
                margin-left: 5rpx;
            }
        }
    }
}
// .list {
// 		padding: 0 32rpx 20rpx;
// 	}

	.shop-card {
		margin-bottom: 20rpx;
		border-radius: 26rpx;
		background: #FFFFFF;
		padding: 30rpx;
	}

	.shop-row {
		display: flex;
		gap: 20rpx;
	}

	.shop-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.name-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.name {
		font-weight: 800;
		font-size: 32rpx;
		color: #000000;
	}
	.statusText{
		font-size: 24rpx;
		color: $color;
		line-height: 30rpx;
		padding: 0 14rpx;
		box-sizing: border-box;
		border: 1rpx solid $color;
		border-radius: 16rpx;
		margin-right: 10rpx;
	}

	.phone {
		width: 56rpx;
		height: 56rpx;
		justify-content: center;
		align-items: center;
	}

	.rate-row {
		display: flex;
		align-items: center;
		color: #8a8f99;
		font-size: 22rpx;
	}
	
	.icon-box {
		width: 34rpx;
		height: 34rpx;
		line-height: 34rpx;
		background: linear-gradient(-40deg, #FF4C26, #FF8A51);
		border-radius: 6rpx 0rpx 0rpx 6rpx;
	}

	.score {
		width: 90rpx;
		height: 34rpx;
		line-height: 34rpx;
		background: #FFEFE8;
		border-radius: 0rpx 6rpx 6rpx 0rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #FF5000;
		padding-left: 12rpx;
		margin-right: 20rpx;
	}

	.time {
		margin-left: 8rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #666666;
	}
	
	.times {
		color: $color;
	}
	
	.metas-row {
		display: flex;
		flex-direction: column;
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 12rpx;

		.meta {
			font-size: 22rpx;
			color: #333333;
		}
		
		.divider {
			width: 1rpx;
			height: 22rpx;
			background: #CCCCCC;
		}
	}
	
	.meta-addr {
		font-weight: 500;
		font-size: 22rpx;
		color: #666666;
	}

	.addr-row {
		height: 76rpx;
		background: #F5F5F5;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		margin-top: 24rpx;
		padding: 0 24rpx;

		.addr {
			flex: 1;
			font-size: 24rpx;
			color: #333333;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-left: 10rpx;
		}

		.dist {
			font-size: 24rpx;
			color: #333333;
			margin-right: 12rpx;
		}
	}

</style>
