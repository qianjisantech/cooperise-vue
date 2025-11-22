/**
 * Issue 格式化工具函数
 */
export function useIssueFormatters(userList = []) {
  // 获取事项类型标签
  const getIssueTypeLabel = (issueType) => {
    const labelMap = {
      1: '任务',
      2: 'bug',
      3: '需求',
      4: '线上问题'
    }
    return labelMap[issueType] || '未设置'
  }

  // 获取事项类型图标
  const getIssueTypeIcon = (issueType) => {
    const iconMap = {
      1: 'task',
      2: 'bug',
      3: 'lightbulb',
      4: 'error-circle'
    }
    return iconMap[issueType] || 'file-icon'
  }

  // 获取事项类型颜色
  const getIssueTypeColor = (issueType) => {
    const colorMap = {
      1: '#0052d9',
      2: '#e34d59',
      3: '#29cc85',
      4: '#ff9800'
    }
    return colorMap[issueType] || '#646a73'
  }

  // 获取状态标签
  const getStatusLabel = (status) => {
    const labelMap = {
      0: '已取消',
      1: '待处理',
      2: '进行中',
      3: '已完成'
    }
    return labelMap[status] || '未知状态'
  }

  // 获取状态主题色
  const getStatusTheme = (status) => {
    const themeMap = {
      0: 'default',    // 已取消
      1: 'warning',    // 待处理
      2: 'primary',    // 进行中
      3: 'success'     // 已完成
    }
    return themeMap[status] || 'default'
  }

  // 获取优先级标签
  const getPriorityLabel = (priority) => {
    const labelMap = {
      1: '高',
      2: '中',
      3: '低'
    }
    return labelMap[priority] || '未设置'
  }

  // 获取优先级主题色
  const getPriorityTheme = (priority) => {
    const themeMap = {
      1: 'danger',
      2: 'warning',
      3: 'success'
    }
    return themeMap[priority] || 'default'
  }

  // 获取优先级图标
  const getPriorityIcon = (priority) => {
    const iconMap = {
      1: 'arrow-up',
      2: 'minus',
      3: 'arrow-down'
    }
    return iconMap[priority] || 'minus'
  }

  // 获取优先级颜色
  const getPriorityColor = (priority) => {
    const colorMap = {
      1: '#e34d59',
      2: '#ed7b2f',
      3: '#2ba471'
    }
    return colorMap[priority] || '#646a73'
  }

  // 获取经办人名称
  const getAssigneeName = (row, assigneeOptions) => {
    // 优先使用 assigneeName 字段（数据库表字段）
    if (row.assigneeName) {
      return row.assigneeName
    }
    // 兼容旧的 assigneeNickname 字段
    if (row.assigneeNickname) {
      return row.assigneeNickname
    }
    // 其次使用 assignee 字段（如果后端已经关联查询了用户名）
    if (row.assignee) {
      return row.assignee
    }
    // 如果只有 assigneeId，尝试从经办人列表中查找
    if (row.assigneeId && assigneeOptions) {
      const assignee = assigneeOptions.find(a => a.value === row.assigneeId)
      return assignee ? assignee.label : `用户${row.assigneeId}`
    }
    return '未分配'
  }

  return {
    getIssueTypeLabel,
    getIssueTypeIcon,
    getIssueTypeColor,
    getStatusLabel,
    getStatusTheme,
    getPriorityLabel,
    getPriorityTheme,
    getPriorityIcon,
    getPriorityColor,
    getAssigneeName
  }
}
