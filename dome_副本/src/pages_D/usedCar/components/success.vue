<template>
    <view class="fixedBox" @click="close" :data-theme="pageTheme">
        <view class="card">
            <image
                class="card-close"
                :src="imgUrl+'ic_close.png'"
            />
            <view class="card-title">提交成功</view>
            <view class="card-text">请耐心等待，稍后有工作人员联系您！</view>
            <view class="card-but">继续看车</view>
        </view>
    </view>
</template>
<script setup lang="ts">
    import { imgUrl } from '@/config';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
    const emit = defineEmits<{
	  (e: 'close'): void
	}>()
    const close = () => {
		 emit('close')
	}
</script>

<style lang="scss" scoped>
    .fixedBox{
        width: 100%;
        height: 100vh;
        background: rgba($color: #000000, $alpha: 0.5);
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
    }
    .card{
        margin: 0 auto;
        margin-top: 25vh;
        width: 610rpx;
        height: 394rpx;
        background: linear-gradient( 180deg, #FFFFFF 0%, #FFECD4 100%);
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .card-close{
            position: absolute;
            right: 30rpx;
            top: 30rpx;
            width: 30rpx;
            height: 30rpx;
        }
        .card-title{
            font-weight: 500;
            font-size: 32rpx;
            color: #333333;
            line-height: 32rpx;
        }
        .card-text{
            font-weight: 500;
            font-size: 28rpx;
            color: #3D3D3D;
            line-height: 44rpx;
            margin:60rpx auto ;
        }
        .card-but{
            width: 488rpx;
            height: 76rpx;
            line-height: 76rpx;
            text-align: center;
            background: var(--primary-color);
            border-radius: 48rpx 48rpx 48rpx 48rpx;
            font-weight: 700;
            font-size: 28rpx;
            color: #FFFFFF;
        }
    }
</style>