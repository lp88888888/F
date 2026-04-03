<template>
	<view class="">
		<OrderAdd></OrderAdd>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import OrderAdd from './orderAdd.vue';
</script>

<style lang="scss" scoped>
	
</style>