<template>
    <view class="page-cnent" :data-theme="pageTheme" >
        <u-sticky>
			<!-- <view class="navBack">
				<view class="tabsView">
					<u-tabs :list="tabList" :current="current" :lineColor="themeStore.themeColors.$primaryColor" :activeStyle="{color:themeStore.themeColors.$primaryColor,fontWeight: 'bold'}" :inactiveStyle="{color:'#333333'}" @change="tabChange" :itemStyle="{width:'100rpx',height:'88rpx',fontSize:'28rpx'}" lineWidth="33"></u-tabs>
				</view>
			</view> -->
		</u-sticky>
        <view class="pageView" >
            <view class="" v-for="(item,index) in dataList" :key="index">
                 <view class="card">
                    <view class="card-ccc">
                        <view class="card-name">{{item.prCarMarketingActivityVo?.activityName}}</view>
                    <view class="card-text" style="margin-top: 28rpx;">报名时间｜{{item.registrationTime}}</view>
                    </view>
                    <view class="card-icon" :class="[item.prCarMarketingActivityVo?.activityStatus==2?'iconColor3':item.prCarMarketingActivityVo?.activityStatus==1?'iconColor2':'iconColor1']">
                        <view class="fl-al-ce">
                            <image
                                class="iconImg"
                                :src="imgUrl+'static/newCar-time-icon.png'"
                                mode="scaleToFill"
                            />
                            <view class="card-text">活动时间：{{item.prCarMarketingActivityVo.startTime}} 至 {{item.prCarMarketingActivityVo.endTime}}</view>
                        </view>
                        <text class="tetxColor">{{stetusText(item.prCarMarketingActivityVo?.activityStatus)}}</text>
                    </view>
                </view>
                <u-gap height="15"></u-gap>
            </view>
           <ser-empty v-if="!dataList.length"></ser-empty>
            
        </view>
    </view>
</template>

<script lang="ts" setup>
    import {ref,computed} from 'vue';
    import {timeFormat } from '@/uni_modules/uview-plus';
    import { imgUrl } from '@/config';
    import {listActivityApplyList }from '@/api/car';
    import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
    const current = ref(0);
// 未开始、进行中、已完成
    const tabList = ref([
		{name: '全部',state:9999},
		{name: '未开始',state:0},
		{name: '进行中',state:1},
		{name: '已完成',state:2},
	]);
    const stetusText = computed(() => (activityStatus: string | number) => {
        let obj = {
            0:'未开始', 
            1:'进行中',
            2:'已完成'
        }
        return obj[activityStatus]
    })

   const listQuery = ref({
        activityStatus:undefined,
        pageName:1,
        pageSize:10
    });
    const total = ref(0);
    const dataList = ref([]);
    const tabChange = (e)=>{
        console.log("e", e)
        if(e.state==9999){
            listQuery.value.activityStatus = undefined
        }else{
            listQuery.value.activityStatus = e.state
        }
        listQuery.value.pageName = 1
        total.value = 0;
        getData();
    }
    const getData = async ()=>{
        const params = {
            ...listQuery.value,
        }
        let res = await listActivityApplyList(listQuery.value)
        if(res.code==200){
            if(res.rows){
                 dataList.value = listQuery.value.pageName==1?res.rows:dataList.value.concat(res.rows)
                 total.value = res.total
            }else{
                dataList.value = []
                total.value = 0
            }
           
        }else{
            uni.showToast({
                title:res.msg,
                icon:'none'
            })
        }
    }
    onLoad(()=>{
        getData()
    })
    onReachBottom(()=>{
        if(listQuery.value.pageName *listQuery.value.pageSize < total.value){
             listQuery.value.pageName++
             getData()
        }
    })
</script>

<style lang="scss" scoped>
.page-cnent{
 min-height: 100vh;
    background: var(--head-color);
}
.pageView{
   
    padding: 25rpx;
    box-sizing: border-box;
}
.navBack{
    width: 100%;
    background: #FFFFFF;
}
.card{
    width: 100%;
    background: #FFFFFF;
    border-radius: 24rpx 24rpx 24rpx 24rpx;
    .card-ccc{
        padding: 30rpx;
        box-sizing: border-box;
    }
    .card-name{
        font-weight: 700;
        font-size: 32rpx;
        color: #333333;
        line-height: 32rpx;
    }
    .card-text{
        
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 28rpx;
    }
    .card-icon{
       width: 100%;
        height: 74rpx;
        border-radius: 0rpx 0rpx 24rpx 24rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 25rpx;
        box-sizing: border-box;
        .iconImg{
            width: 32rpx;
            height: 32rpx;
            margin-right: 5rpx;
        }
    }
    .iconColor1{
        background: #FFF8EE;
        .tetxColor{
           font-weight: 400;
            font-size: 24rpx;
            color: var(--primary-color);
            line-height: 34rpx;
        }
    }
    .iconColor2{
        background: #EEF7FF;
        .tetxColor{
           font-weight: 400;
            font-size: 24rpx;
            color: #005FEE;
            line-height: 34rpx;
        }
    }
    .iconColor3{
        background: #EAEAEA;
         .tetxColor{
           font-weight: 400;
            font-size: 24rpx;
            color: #333333;
            line-height: 34rpx;
        }
    }
}
</style>