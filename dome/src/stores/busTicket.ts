// src/stores/busTicket.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义站点类型（与组件中的 SelectedPlace 一致）
interface SelectedPlace {
  name: string
  code: string
}

interface SelectedForm {
  departTime: string
  runtime: string
  fullPrice: string
  scheduleCode: string
  seatType: string
  stationCode: string
}
// 定义 Pinia 仓库
export const useBusTicketStore = defineStore('busTicket', () => {
  // 状态：出发地
  const startPlace = ref<SelectedPlace>({ name: '', code: '' })
  // 状态：目的地
  const endPlace = ref<SelectedPlace>({ name: '', code: '' })
  // 状态：选中的日期
  const selectedDate = ref<string>('')
  // 状态：预计行驶时间
  const formData = ref<SelectedForm>({ departTime: '', runtime: '', fullPrice: '', scheduleCode: '', seatType: '', stationCode: '' })
	
  // 行动：设置出发地
  const setStartPlace = (place: SelectedPlace) => {
    startPlace.value = place
  }

  // 行动：设置目的地
  const setEndPlace = (place: SelectedPlace) => {
    endPlace.value = place
  }

  // 行动：设置选中的日期
  const setSelectedDate = (date: string) => {
    selectedDate.value = date
  }
  
  // 行动：预计行驶时间
  const setFormData = (form: SelectedForm) => {
    formData.value = form
  }

  // 行动：重置所有状态（可选，根据需求添加）
  const resetBusTicketState = () => {
    startPlace.value = { name: '', code: '' }
    endPlace.value = { name: '', code: '' }
    selectedDate.value = ''
	formData.value = { 
		departTime: '',
		runtime: '',
		fullPrice: '',
		scheduleCode: '',
		seatType: '',
		stationCode: '',
	}
  }

  // 暴露状态和行动
  return {
    startPlace,
    endPlace,
    selectedDate,
	formData,
    setStartPlace,
    setEndPlace,
    setSelectedDate,
	setFormData,
    resetBusTicketState
  }
})