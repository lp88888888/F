// 格式化为 "YYYY-MM"
export const formatMonthDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}-${month<10?'0'+month:month}`
}

// 格式化为 "YYYY-MM-DD"
export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`
}
const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}
export const splitTime = time => {
	const hour = time.getHours()
	const minute = time.getMinutes()
	const second = time.getSeconds()

	return [hour, minute, second].map(formatNumber)
}

// 获取当前日期以及后边7天日期
export const getDays=(dayNum:number=7)=> {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const result = []
  for (let i = 0; i < dayNum; i++) {
	const date = new Date()
	date.setDate(date.getDate() + i) // 当前 + i 天

	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const weekDay = days[date.getDay()]
	let label
	if (i === 0) {
	  label = '今天'
	} else if (i === 1) {
	  label = '明天'
	} else {
	  label = weekDay
	}
	result.push({
	  date1: `${month}-${day}`,        // 格式：09-24
	  fullDate: date.toISOString().split('T')[0], // 完整日期：2025-09-24
	  weekday: weekDay,               // 周一、周二...
	  label                        // 今天 / 明天 / 周三
	})
  }
  return result
}
