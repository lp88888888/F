<template>
  <view class="product-card">
    <!-- 商品图片 -->
    <image 
      class="product-image" 
      :src="product.image" 
      mode="widthFix"
      @load="handleImageLoad"
    ></image>

    <!-- 商品信息 -->
    <view class="product-info">
      <text class="product-name">{{ product.name }}</text>

      <view class="product-meta">
        <view class="flex align-center">
          <image class="icon-28 m-r-10" src="/static/logo_1.png" mode=""></image>
          <text class="product-price">¥{{ product.price }}</text>
        </view>
        <text class="product-stock">余{{ product.stock }}件</text>
      </view>

      <view class="product-points" v-if="product.requiredPoints">
        <text>兑换{{ product.requiredPoints }}+</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface ProductItem {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  requiredPoints?: number;
  category?: string;
  // 瀑布流需要的高度
  height?: number;
}

const props = defineProps<{
  product: ProductItem;
}>();

const emit = defineEmits(['heightChange']);

// 图片加载完成后计算高度
const handleImageLoad = (event: any) => {
  uni.getImageInfo({
    src: props.product.image,
    success: (res) => {
      // 计算图片高度（根据实际宽度和图片宽高比）
      const imageRatio = res.height / res.width;
      const imageHeight = 340 * imageRatio;
      
      // 商品卡片总高度 = 图片高度 + 固定信息区域高度
      const cardHeight = imageHeight + 180; // 180是信息区域的预估高度
      
      // 通知父组件高度变化
      emit('heightChange', {
        id: props.product.id,
        height: cardHeight
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.product-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .product-image {
    width: 100%;
    display: block;
  }

  .product-info {
    padding: 20rpx;

    .product-name {
      font-size: 28rpx;
      color: #000;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 40rpx;
      min-height: 80rpx;
    }

    .product-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20rpx;

      .flex {
        display: flex;
        align-items: center;
      }
      
      .m-r-10 {
        margin-right: 10rpx;
      }
      
      .icon-28 {
        width: 28rpx;
        height: 28rpx;
      }

      .product-price {
        font-size: 32rpx;
        color: #FF9600;
        font-weight: bold;
      }

      .product-stock {
        font-size: 24rpx;
        color: #FF9600;
      }
    }

    .product-points {
      margin-top: 10rpx;
      font-size: 22rpx;
      color: #999;
    }
  }
}
</style>