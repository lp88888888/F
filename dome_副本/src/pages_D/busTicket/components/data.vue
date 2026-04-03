<template>
  <view class="date-selector" :data-theme="pageTheme">
    <scroll-view
      class="date-scroll-view"
      scroll-x
      scroll-with-animation
      :scroll-left="scrollLeft"
    >
      <view class="date-list">
        <view
          v-for="(day, index) in days"
          :key="day.fullDate"
          class="date-item"
          :class="{ selected: selectedDay === day.fullDate }"
          @click="selectDay(day)"
        >
          <view class="day-name">{{ day.name }}</view>
          <view class="day-date">{{ day.date }}</view>
        </view>
    
        <view class="tail-spacer"></view>
      </view>
    </scroll-view>

  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits, defineProps, watch, nextTick } from 'vue';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);
interface Day {
  name: string;
  date: string;
  fullDate: string;
}

const props = defineProps<{
  modelValue?: string; // yyyy-mm-dd
}>();

const emit = defineEmits<{
  (e: 'day-selected', val: string): void;
}>();

const days = ref<Day[]>([]);
const selectedDay = ref<string>('');
const scrollLeft = ref(0);

const loadDaysCount = 15;
const maxDays = 15;

const SAFE_RIGHT_RPX = 10;

const ITEM_W_RPX = 90;
const GAP_RPX = 35;

// ---------- 工具函数 ----------
const getDayName = (date: Date) => {
  const map = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return map[date.getDay()];
};

const formatDate = (date: Date) => `${date.getMonth() + 1}-${date.getDate()}`;

const formatFullDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseFullDate = (str: string) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const isAtMaxDate = () => {
  if (!days.value.length) return false;
  const last = parseFullDate(days.value[days.value.length - 1].fullDate);

  const today = new Date();
  const max = new Date(today);
  max.setDate(today.getDate() + maxDays);

  return last >= max;
};

const loadMoreDays = () => {
  if (!days.value.length) return;
  if (isAtMaxDate()) return;

  const last = parseFullDate(days.value[days.value.length - 1].fullDate);

  for (let i = 1; i <= loadDaysCount; i++) {
    const d = new Date(last);
    d.setDate(last.getDate() + i);

    const today = new Date();
    const max = new Date(today);
    max.setDate(today.getDate() + maxDays);
    if (d > max) break;

    days.value.push({
      name: getDayName(d),
      date: formatDate(d),
      fullDate: formatFullDate(d),
    });
  }
};

const scrollToIndex = async (idx: number) => {
  await nextTick();

  if (idx >= days.value.length - 1) {
    scrollLeft.value = 999999; 
    return;
  }

  const stepPx = uni.upx2px(ITEM_W_RPX + GAP_RPX);
  const baseOffsetPx = uni.upx2px(80);
  const safeRightPx = uni.upx2px(SAFE_RIGHT_RPX);

  scrollLeft.value = Math.max(0, idx * stepPx - baseOffsetPx + safeRightPx);
};

const selectDay = async (day: Day) => {
  selectedDay.value = day.fullDate;
  emit('day-selected', day.fullDate);

  const idx = days.value.findIndex(d => d.fullDate === day.fullDate);
  if (idx !== -1) await scrollToIndex(idx);
};

onMounted(async () => {
  const today = new Date();

  for (let i = 0; i < loadDaysCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    days.value.push({
      name: getDayName(d),
      date: formatDate(d),
      fullDate: formatFullDate(d),
    });
  }

  const todayFull = formatFullDate(today);

  if (props.modelValue) {
    selectedDay.value = props.modelValue;
  } else {
    selectedDay.value = todayFull;
    emit('day-selected', todayFull);
  }

  await nextTick();

  const idx = days.value.findIndex(d => d.fullDate === selectedDay.value);
  if (idx !== -1) {
    await scrollToIndex(idx);
  }
});

watch(
  () => props.modelValue,
  async (val) => {
    if (!val) return;
    // 边界判断：如果传入的日期不在当前days列表中，不执行后续操作（避免报错）
    const isDateInList = days.value.some(d => d.fullDate === val);
    if (!isDateInList) return;
    
    selectedDay.value = val;
    const idx = days.value.findIndex(d => d.fullDate === val);
    if (idx !== -1) {
      await scrollToIndex(idx);
    }
  },
  { immediate: true } // 新增：立即执行，保证初始值也能触发
);
</script>

<style scoped>
.date-selector {
  display: flex;
  align-items: center;
}

.date-scroll-view {
  flex: 1;
  white-space: nowrap;
}

.date-list {
  display: inline-flex;
  /* gap: 35rpx; */
  padding-left: 10rpx;
  box-sizing: border-box;
}

.tail-spacer {
  flex: 0 0 auto;
  width: 10rpx;   /* 同 SAFE_RIGHT_RPX */
  height: 1px;
}

.date-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  padding: 10rpx;
  border-radius: 10rpx;
}

.date-item.selected {
	border: 1rpx solid var(--primary-color); 
	background-color: #ffffff;
}

.day-name {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.day-date {
  font-weight: 700;
  font-size: 22rpx;
  color: #333;
}

.selected .day-name,
.selected .day-date {
  color: var(--primary-color);
}
</style>
