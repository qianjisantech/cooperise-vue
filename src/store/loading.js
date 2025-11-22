import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  // 全局加载状态
  const isLoading = ref(false)

  // 加载提示文本
  const loadingText = ref('正在加载中，请稍等...')

  // 加载计数器（用于处理多个并发请求）
  const loadingCount = ref(0)

  /**
   * 显示全局加载
   * @param {string} text - 加载提示文本
   */
  const showLoading = (text = '正在加载中，请稍等...') => {
    loadingCount.value++
    loadingText.value = text
    isLoading.value = true
  }

  /**
   * 隐藏全局加载
   */
  const hideLoading = () => {
    loadingCount.value--
    if (loadingCount.value <= 0) {
      loadingCount.value = 0
      isLoading.value = false
    }
  }

  /**
   * 强制隐藏全局加载（清空所有计数）
   */
  const forceHideLoading = () => {
    loadingCount.value = 0
    isLoading.value = false
  }

  return {
    isLoading,
    loadingText,
    loadingCount,
    showLoading,
    hideLoading,
    forceHideLoading
  }
})
