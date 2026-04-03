<template>
  <view class="calendar-container">
    <!-- 头部：年月 + 切换按钮 -->
    <view class="calendar-header">
      <view class="arrow-left" @click="prevMonth">‹</view>
      <view class="header-title">{{ currentYear }}年{{ currentMonth + 1 }}月</view>
      <view class="arrow-right" @click="nextMonth">›</view>
    </view>

    <!-- 星期栏 -->
    <view class="week-header">
      <view v-for="(week, index) in weeks" :key="index" class="week-day">{{ week }}</view>
    </view>

    <!-- 日期格子 -->
    <view class="days-container">
      <view
        v-for="(item, index) in days"
        :key="index"
        class="day"
        :class="{
          'other-month': !item.isCurrentMonth,
          today: item.isToday,
          selected: item.isSelected,
          disabled: item.disabled
        }"
        @click="item.disabled ? null : selectDay(item.date)"
      >
        <view class="day-number">
          <text class="day-title">{{ item.day }}</text>
          <text v-if="!item.disabled" class="day-price">￥{{ adultCost }}</text>
          <image
            v-if="item.isSelected"
            class="truth-view-icon"
            src="https://tranalioss.shanyitong.com/wximage/trip-pro/activity/self-drive-truth-light.png"
            mode=""
          />
        </view>
        <view v-if="item.hasDot" class="day-dot"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  markedDates: {
    type: Array as () => string[],
    default: () => []
  },
  selectedDate: {
    type: String,
    default: ''
  },
  adultCost: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits<{
  (e: 'dayClick', date: string): void
  (e: 'monthChange', payload: { year: number; month: number }): void
}>()

// Data
const currentYear = ref(0)
const currentMonth = ref(0)
const days = ref<any[]>([])
const weeks = ['日', '一', '二', '三', '四', '五', '六']
const today = ref('')
const minDate = ref('') // 最小可选日期（明天）
const maxDate = ref('') // 最大可选日期（本年年底）

// 格式化日期：YYYY-MM-DD
const formatDate = (date: Date): string => {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
}

// 判断是否被标记
const isMarked = (date: Date): boolean => {
  return props.markedDates.includes(formatDate(date))
}

// 判断是否禁用
const isDisabled = (dateStr: string): boolean => {
  return dateStr < minDate.value || dateStr > maxDate.value
}

// 生成日历数据
const generateDays = (year: number, month: number, selectedDate?: string) => {
  const dayList: any[] = []

  const firstDay = new Date(year, month, 1)
  const firstDayWeekDay = firstDay.getDay()
  const monthDays = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  // 上个月
  for (let i = 0; i < firstDayWeekDay; i++) {
    const day = prevMonthDays - firstDayWeekDay + i + 1
    const date = new Date(year, month - 1, day)
    const dateStr = formatDate(date)
    dayList.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      date: dateStr,
      hasDot: isMarked(date),
      disabled: isDisabled(dateStr)
    })
  }

  // 当月
  for (let i = 1; i <= monthDays; i++) {
    const date = new Date(year, month, i)
    const dateStr = formatDate(date)
    dayList.push({
      day: i,
      isCurrentMonth: true,
      isToday: dateStr === today.value,
      isSelected: false,
      date: dateStr,
      hasDot: isMarked(date),
      disabled: isDisabled(dateStr)
    })
  }

  // 下个月（补足6行42格）
  const total = dayList.length
  const nextCount = 42 - total
  for (let i = 1; i <= nextCount; i++) {
    const date = new Date(year, month + 1, i)
    const dateStr = formatDate(date)
    dayList.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      date: dateStr,
      hasDot: isMarked(date),
      disabled: isDisabled(dateStr)
    })
  }

  days.value = dayList

  // 设置选中状态
  if (selectedDate) {
    setSelectedDate(selectedDate)
  }

  emit('monthChange', { year, month: month + 1 })
}

// 设置选中日期
const setSelectedDate = (date: string) => {
  if (!date || days.value.length === 0) return

  days.value = days.value.map(day => ({
    ...day,
    isSelected: day.date === date
  }))

  // 如果不在当前月份，自动跳转
  const dateObj = new Date(date)
  const targetYear = dateObj.getFullYear()
  const targetMonth = dateObj.getMonth()

  if (targetYear !== currentYear.value || targetMonth !== currentMonth.value) {
    currentYear.value = targetYear
    currentMonth.value = targetMonth
    generateDays(targetYear, targetMonth, date)
  }
}

// 点击日期
const selectDay = (date: string) => {
  setSelectedDate(date)
  emit('dayClick', date)
}

// 切换月份
const prevMonth = () => {
  let year = currentYear.value
  let month = currentMonth.value - 1
  if (month < 0) {
    month = 11
    year--
  }
  currentYear.value = year
  currentMonth.value = month
  generateDays(year, month)
}

const nextMonth = () => {
  let year = currentYear.value
  let month = currentMonth.value + 1
  if (month > 11) {
    month = 0
    year++
  }
  currentYear.value = year
  currentMonth.value = month
  generateDays(year, month)
}

// 初始化
onMounted(() => {
  const now = new Date()
  today.value = formatDate(now)

  // 最小日期：明天
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  minDate.value = formatDate(tomorrow)

  // 最大日期：本年12月31日
  const endOfYear = new Date(now.getFullYear(), 11, 31)
  maxDate.value = formatDate(endOfYear)

  currentYear.value = now.getFullYear()
  currentMonth.value = now.getMonth()

  // 默认选中：props.selectedDate 或 明天
  const defaultSelected = props.selectedDate || minDate.value
  generateDays(currentYear.value, currentMonth.value, defaultSelected)
})

// 监听外部 selectedDate 变化
watch(
  () => props.selectedDate,
  (newVal) => {
    if (newVal) {
      setSelectedDate(newVal)
    }
  }
)
</script>

<style scoped lang="scss">
.calendar-container {
  width: 100%;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  padding: 30rpx;
  box-sizing: border-box;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  font-size: 32rpx;
  font-weight: bold;
}

.arrow-left,
.arrow-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 40rpx;
}

.arrow-left:active,
.arrow-right:active {
  background-color: #f5f5f5;
}

.week-header {
  display: flex;
  margin-bottom: 20rpx;
}

.week-day {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #666;
}

.days-container {
  display: flex;
  flex-wrap: wrap;
}

.day {
  width: calc(100% / 7);
  height: 120rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 28rpx;
}

.day-number {
  width: 100rpx;
  height: 160rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.other-month {
  color: #ccc;
}

.today .day-number {
  color: #1ab16c;
  font-weight: bold;
}

.day-title {
  font-size: 30rpx;
  margin-bottom: 20rpx;
}

.day-price {
  font-size: 24rpx;
  color: #333;
}

.selected .day-number {
  background-color: rgba(0, 189, 171, 0.4);
  border: solid 1rpx #00bdab;
  position: relative;
}

.day-dot {
  width: 6rpx;
  height: 6rpx;
  background-color: #f56c6c;
  position: absolute;
  bottom: 10rpx;
}

.disabled .day-number {
  color: #ccc !important;
  opacity: 0.6;
}

.disabled {
  pointer-events: none;
}

.truth-view-icon {
  width: 36rpx;
  height: 36rpx;
  position: absolute;
  bottom: 0;
  right: -18rpx;
}
</style>