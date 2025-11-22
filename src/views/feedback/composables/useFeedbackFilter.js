import { ref, computed } from 'vue'

/**
 * Feedback 筛选逻辑
 */
export function useFeedbackFilter(feedbackList) {
  // 筛选条件
  const filterStatus = ref('all')  // all, open, closed
  const filterType = ref('all')
  const searchKeyword = ref('')
  const sortBy = ref('newest')

  // 计算统计数量
  const openCount = computed(() => {
    return feedbackList.value.filter(f => f.status === 'open').length
  })

  const closedCount = computed(() => {
    return feedbackList.value.filter(f => f.status === 'closed').length
  })

  // 筛选后的列表
  const filteredFeedbackList = computed(() => {
    let result = [...feedbackList.value]

    // 按状态筛选
    if (filterStatus.value !== 'all') {
      result = result.filter(f => f.status === filterStatus.value)
    }

    // 按类型筛选
    if (filterType.value !== 'all') {
      result = result.filter(f => f.type === filterType.value)
    }

    // 关键词搜索
    if (searchKeyword.value.trim()) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(f => {
        return f.title?.toLowerCase().includes(keyword) ||
               f.content?.toLowerCase().includes(keyword)
      })
    }

    // 排序
    if (sortBy.value === 'newest') {
      result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    } else if (sortBy.value === 'oldest') {
      result.sort((a, b) => new Date(a.createTime) - new Date(b.createTime))
    } else if (sortBy.value === 'mostLiked') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    } else if (sortBy.value === 'mostCommented') {
      result.sort((a, b) => {
        const aComments = a.feedbackComments?.length || 0
        const bComments = b.feedbackComments?.length || 0
        return bComments - aComments
      })
    }

    return result
  })

  // 状态切换
  const handleFilterStatusChange = (status) => {
    filterStatus.value = status
  }

  // 重置筛选
  const handleReset = () => {
    filterStatus.value = 'all'
    filterType.value = 'all'
    searchKeyword.value = ''
    sortBy.value = 'newest'
  }

  return {
    filterStatus,
    filterType,
    searchKeyword,
    sortBy,
    openCount,
    closedCount,
    filteredFeedbackList,
    handleFilterStatusChange,
    handleReset
  }
}
