import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/store/workspace.js'

/**
 * Issue 筛选逻辑
 */
export function useIssueFilter(issueList) {
  const workspaceStore = useWorkspaceStore()

  // 筛选条件
  const filterConditions = ref([
    { id: 0, field: 'keyword', value: '' }
  ])

  // 计算有效的筛选条件数量
  const activeFilterCount = computed(() => {
    return filterConditions.value.filter(condition => condition.value).length
  })

  // 处理筛选条件更新
  const handleFilterUpdate = (conditions) => {
    filterConditions.value = conditions
  }

  // 处理筛选确认
  const handleFilterConfirm = (conditions) => {
    filterConditions.value = conditions
  }

  // 筛选后的任务列表
  const filteredIssueList = computed(() => {
    return issueList.value.filter(task => {
      // 首先检查全局搜索（来自Header的搜索框）
      if (workspaceStore.searchIssueNumber) {
        const searchValue = workspaceStore.searchIssueNumber.toLowerCase()
        const matchNumber = task.issueNo?.toLowerCase().includes(searchValue)
        const matchSummary = task.summary?.toLowerCase().includes(searchValue)
        if (!matchNumber && !matchSummary) return false
      }

      // 遍历所有筛选条件，只要有一个条件不满足就过滤掉
      for (const condition of filterConditions.value) {
        if (!condition.value) continue // 跳过空值

        const field = condition.field
        const value = condition.value

        if (field === 'keyword') {
          // 关键词筛选（搜索概要和任务单号）
          const keyword = value.toLowerCase()
          const matchSummary = task.summary?.toLowerCase().includes(keyword)
          const matchNumber = task.issueNo?.toLowerCase().includes(keyword)
          if (!matchSummary && !matchNumber) return false
        } else if (field === 'issue_type') {
          // 事项类型筛选
          if (task.issueType !== value) return false
        } else if (field === 'status') {
          // 状态筛选
          if (task.status !== value) return false
        } else if (field === 'priority') {
          // 优先级筛选
          if (task.priority !== value) return false
        } else if (field === 'assignee') {
          // 经办人筛选
          if (task.assignee !== value) return false
        }
      }

      return true
    })
  })

  return {
    filterConditions,
    activeFilterCount,
    filteredIssueList,
    handleFilterUpdate,
    handleFilterConfirm
  }
}
