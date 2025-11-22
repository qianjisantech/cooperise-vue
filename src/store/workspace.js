import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkspaceStore = defineStore('workspace', () => {
  const issueCount = ref(0)
  const searchIssueNumber = ref('')
  const refreshTrigger = ref(0) // 用于触发列表刷新的计数器
  const showCreateIssueDialog = ref(false) // 控制新建事项对话框的显示

  const setIssueCount = (count) => {
    issueCount.value = count
  }

  const setSearchIssueNumber = (issueNumber) => {
    searchIssueNumber.value = issueNumber
  }

  // 触发刷新事项列表
  const refreshIssueList = () => {
    refreshTrigger.value++
  }

  // 触发显示新建事项对话框
  const triggerCreateIssue = () => {
    console.log('[workspace store] triggerCreateIssue called, setting showCreateIssueDialog to true')
    showCreateIssueDialog.value = true
    console.log('[workspace store] showCreateIssueDialog is now:', showCreateIssueDialog.value)
  }

  // 关闭新建事项对话框
  const closeCreateIssueDialog = () => {
    console.log('[workspace store] closeCreateIssueDialog called')
    showCreateIssueDialog.value = false
  }

  return {
    issueCount,
    searchIssueNumber,
    refreshTrigger,
    showCreateIssueDialog,
    setIssueCount,
    setSearchIssueNumber,
    refreshIssueList,
    triggerCreateIssue,
    closeCreateIssueDialog
  }
})
