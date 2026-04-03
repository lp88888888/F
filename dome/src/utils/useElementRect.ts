import { ref, Ref } from 'vue'

// 查询结果类型
interface ElementRect {
  id: string
  dataset: Record<string, any>
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
  x: number
  y: number
}

/**
 * 自定义 Hook：获取 DOM 元素的布局信息（跨平台兼容）
 * @param selector - 选择器，如 '#id' 或 '.class' 或 'view:nth-child(1)'
 * @returns { rect, query, isLoading }
 */
// 小程序 instance必填
export function useElementSingle(selector: string,instance?:any) {
  // 存储查询结果
  const rect: Ref<ElementRect | null> = ref(null)
  // 查询状态
  const isLoading: Ref<boolean> = ref(false)

  /**
   * 执行查询
   * @returns Promise<ElementRect | null>
   */
  const querySingle = (): Promise<ElementRect | null> => {
    return new Promise((resolve) => {
      // 防止重复查询
      if (isLoading.value) {
        resolve(null)
        return
      }

      isLoading.value = true

      try {
        // 获取当前实例
        // const instance = getCurrentInstance()
        
        // 创建查询对象
        let selectorQuery: any
        // #ifdef MP
        // 检查instance是否存在，避免Cannot read property '__route__' of null错误
        if (instance) {
          selectorQuery = uni.createSelectorQuery().in(instance)
        } else {
          selectorQuery = uni.createSelectorQuery()
        }
        // #endif
        // #ifndef MP
        selectorQuery = uni.createSelectorQuery()
        // #endif

        selectorQuery
          .select(selector)
          .boundingClientRect((data: any) => {
            if (data) {
              rect.value = {
                id: data.id,
                dataset: data.dataset || {},
                left: data.left,
                right: data.right,
                top: data.top,
                bottom: data.bottom,
                width: data.width,
                height: data.height,
                x: data.left, // 兼容 DOMRect
                y: data.top,
              }
            } else {
              rect.value = null
            }
            isLoading.value = false
            resolve(rect.value)
          })
          .exec(() => {
            // exec 回调，防止 query 未触发
            if (isLoading.value) isLoading.value = false
          })
      } catch (error) {
        console.error('Element query error:', error)
        isLoading.value = false
        rect.value = null
        resolve(null)
      }
    })
  }

  return {
    rect,       // 元素的尺寸和位置信息
    isLoading,  // 是否正在查询
    querySingle,      // 手动触发查询的方法
  }
}

// instance 小程序中组件必填
export function useElementRects(selectors: string[],instance?:any) {
  const rects = ref<(ElementRect | null)[]>(Array(selectors.length).fill(null))
  const isLoading = ref(false)

  const queryAll = () => {
    return new Promise((resolve) => {
      isLoading.value = true
      
      try {
        // 获取当前实例
        // const instance = getCurrentInstance()
        
        // 创建查询对象
        let selectorQuery: any
        // #ifdef MP
        // 检查instance是否存在，避免Cannot read property '__route__' of null错误
        if (instance) {
          selectorQuery = uni.createSelectorQuery().in(instance)
        } else {
          selectorQuery = uni.createSelectorQuery()
        }
        // #endif
        // #ifndef MP
        selectorQuery = uni.createSelectorQuery()
        // #endif

        const promises = selectors.map((sel, index) =>
          new Promise<void>((innerResolve) => {
            selectorQuery.select(sel)
              .boundingClientRect((data: any) => {
                if(data){
                  rects.value[index] = {
                    id: data.id,
                    dataset: data.dataset || {},
                    left: data.left,
                    top: data.top,
                    width: data.width,
                    height: data.height,
                    x: data.left,
                    y: data.top,
                    right: data.right,
                    bottom: data.bottom
                  }
                }else{
                  rects.value[index] = null
                }
                innerResolve()
              })
              .exec()
          })
        )

        Promise.all(promises).finally(() => {
          isLoading.value = false
          resolve(rects.value)
        })
      } catch (error) {
        console.error('Element queryAll error:', error)
        isLoading.value = false
        rects.value = Array(selectors.length).fill(null)
        resolve(rects.value)
      }
    })
  }

  return { rects, isLoading, queryAll }
}