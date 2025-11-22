// 获取事项类型图标
export const getIssueTypeIcon = (issueType) => {
  const iconMap = {
    '任务': 'task',
    'bug': 'bug',
    '需求': 'lightbulb',
    '线上问题': 'error-circle'
  }
  return iconMap[issueType] || 'file-icon'
}

// 获取事项类型颜色
export const getIssueTypeColor = (issueType) => {
  const colorMap = {
    '任务': '#0052d9',
    'bug': '#e34d59',
    '需求': '#29cc85',
    '线上问题': '#ff9800'
  }
  return colorMap[issueType] || '#646a73'
}

// 获取状态主题色
export const getStatusTheme = (status) => {
  const themeMap = {
    '1': 'default',
    '2': 'primary',
    '3': 'success',
    '0': 'danger'
  }
  return themeMap[status] || 'default'
}

// 获取优先级主题色
export const getPriorityTheme = (priority) => {
  const themeMap = {
    '高': 'danger',
    '中': 'warning',
    '低': 'success'
  }
  return themeMap[priority] || 'default'
}

// 获取优先级图标
export const getPriorityIcon = (priority) => {
  const iconMap = {
    '高': 'arrow-up',
    '中': 'minus',
    '低': 'arrow-down'
  }
  return iconMap[priority] || 'minus'
}

// 获取优先级颜色
export const getPriorityColor = (priority) => {
  const colorMap = {
    '高': '#e34d59',
    '中': '#ed7b2f',
    '低': '#2ba471'
  }
  return colorMap[priority] || '#646a73'
}

// 将事项类型数字转换为文本
export const getIssueTypeText = (issueType) => {
  const typeMap = {
    1: '任务',
    2: 'Bug',
    3: '需求',
    4: '线上问题'
  }
  return typeMap[issueType] || '未知'
}

// 将状态数字转换为文本
export const getStatusText = (status) => {
  const statusMap = {
    0: '已关闭',
    1: '待处理',
    2: '进行中',
    3: '已完成'
  }
  return statusMap[status] || '未知'
}

// 将优先级数字转换为文本
export const getPriorityText = (priority) => {
  const priorityMap = {
    1: '高',
    2: '中',
    3: '低'
  }
  return priorityMap[priority] || '未知'
}

// 获取状态图标
export const getStatusIcon = (status) => {
  const iconMap = {
    0: 'close-circle',
    1: 'time',
    2: 'loading',
    3: 'check-circle'
  }
  return iconMap[status] || 'circle'
}

// 获取状态颜色
export const getStatusColor = (status) => {
  const colorMap = {
    0: '#646a73',
    1: '#0052d9',
    2: '#ed7b2f',
    3: '#2ba471'
  }
  return colorMap[status] || '#646a73'
}
