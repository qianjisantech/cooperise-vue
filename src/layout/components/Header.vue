<template>
  <div class="header-container">
    <div class="header-left">
      <AppLogo :clickable="true" />
      <div >
        <QSearch
            style="margin-left: 20px"
            v-model="searchValue"
            placeholder="搜索任务"
            :suggestions="searchSuggestions"
            @search="handleSearch"
        />

      </div>
    </div>
    <div class="header-right">
      <t-button theme="primary" size="medium" @click="handleCreateIssue" class="create-issue-btn">
        <template #icon>
          <t-icon name="add" />
        </template>
        新建
      </t-button>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useWorkspaceStore } from '@/store/workspace'
import { MessagePlugin } from 'tdesign-vue-next'
import { searchIssues } from '@/api/workspace'
import QSearch from '@/components/QSearch/index.vue'
import AppLogo from '@/components/AppLogo.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const workspaceStore = useWorkspaceStore()
const searchValue = ref('')
const searchWithButton = ref('')
const searchIssueNumber = ref('')
const searchFocused = ref(false)
const showSearchResults = ref(false)
const searchResults = ref([])
let searchTimeout = null
const searchInput = ref(null)
const highlightedIndex = ref(-1)
const searchSuggestions = [
  {
    icon: '✓',
    iconColor: '#52c41a',
    title: 'cld-es适配录屏',
    code: 'UG-646789'
  },
  {
    icon: '🐛',
    iconColor: '#ff4d4f',
    title: '修复用户登录异常问题',
    code: 'BUG-123456'
  },
  {
    icon: '📋',
    iconColor: '#1890ff',
    title: '优化项目看板性能',
    code: 'TASK-789012'
  }
]
const handleSearch = (value) => {
  console.log('搜索:', value)
}
// flattened view helper
const flattenedResults = computed(() => {
  return Array.isArray(searchResults.value) ? searchResults.value : []
})

// grouped by project/space (fallback to '其他')
const groupedResults = computed(() => {
  const groupsMap = {}
  const flat = flattenedResults.value
  for (const it of flat) {
    const key = it.projectName || it.spaceName || it.companyName || '其他'
    if (!groupsMap[key]) groupsMap[key] = []
    groupsMap[key].push(it)
  }
  return Object.keys(groupsMap).map(k => ({ title: k, items: groupsMap[k] }))
})

const flattenedIndex = (item) => {
  return flattenedResults.value.indexOf(item)
}

const escapeHtml = (s = '') => String(s).replace(/[&<>"'`]/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[ch]))

const highlightText = (text, keyword) => {
  if (!keyword) return escapeHtml(text)
  try {
    const k = String(keyword).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`(${k})`, 'ig')
    return escapeHtml(text).replace(re, '<mark>$1</mark>')
  } catch (e) {
    return escapeHtml(text)
  }
}

// keyboard handling inside search input
const handleSearchKeydown = (e) => {
  if (!showSearchResults.value) return
  const max = Math.max(0, flattenedResults.value.length - 1)
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedIndex.value = Math.min(max, Math.max(0, highlightedIndex.value + 1))
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedIndex.value = Math.max(0, highlightedIndex.value - 1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (highlightedIndex.value >= 0 && flattenedResults.value[highlightedIndex.value]) {
      handleSelectIssue(flattenedResults.value[highlightedIndex.value])
    } else {
      handleDirectSearch()
    }
  } else if (e.key === 'Escape') {
    showSearchResults.value = false
  }
}


// 通知数据
const notices = ref([])

// 从环境变量读取通知配置
const loadNoticeFromEnv = () => {
  const title = import.meta.env.VITE_TOP_NOTIFICATION_TITLE
  const type = import.meta.env.VITE_TOP_NOTIFICATION_TYPE
  const link = import.meta.env.VITE_TOP_NOTIFICATION_LINK
  const showUnderline = import.meta.env.VITE_TOP_NOTIFICATION_UNDERLINE

  // 如果配置了通知内容，使用环境变量的值
  if (title) {
    const noticeConfig = {
      id: 'env-notice',
      title: title,
      type: type ? Number(type) : 1, // 默认为信息类型
      link: link && link.trim() ? link.trim() : undefined, // 跳转链接
      showUnderline: showUnderline === 'true' || showUnderline === '1' // 是否显示下划线
    }
    console.log('[Header] 从环境变量加载通知:', noticeConfig)
    notices.value = [noticeConfig]
    return true // 表示已从环境变量加载
  }
  console.log('[Header] 未配置环境变量通知')
  return false // 表示未配置环境变量
}

// WebSocket 连接
let websocket = null
let reconnectTimeout = null
let heartbeatInterval = null

// 组织相关已移除

// 页面标题映射
const pageTitleMap = {
  // 工作台
  '/workspace/issue': '我的事项',
  '/workspace/myview': '我的视图',
  '/workspace/view/my': '我的视图',
  // 权限管理
  '/rbac/user': '用户管理',
  '/rbac/role': '角色管理',
  '/rbac/menu': '菜单管理',
  '/rbac/dict': '字典管理',
  '/rbac/config': '配置管理',
  // 其他一级菜单
  '/announcement': '公告',
  '/feedback': '问题反馈',
  '/changelog': '发布日志',
  '/changelog/detail': '日志详情',
  '/operation-log': '操作日志'
}

// 设置页面标题特殊处理
const getSettingsTitle = (path) => {
  const settingsTitles = {
    '/settings/account': '账号设置',
    '/settings/notification': '通知设置',
    '/settings/privacy': '隐私设置',
    '/settings/system-basic': '基础设置',
    '/settings/system-advanced': '高级设置',
    '/settings/security-password': '密码管理',
    '/settings/security-auth': '双重认证',
    '/settings/security-log': '登录日志'
  }
  return settingsTitles[path] || '设置'
}

const pageTitle = computed(() => {
  // 如果是设置页面，使用特殊处理
  if (route.path.startsWith('/settings')) {
    return getSettingsTitle(route.path)
  }

  // 如果路径在映射表中，直接返回
  if (pageTitleMap[route.path]) {
    return pageTitleMap[route.path]
  }

  // 处理动态路由（如视图详情页）
  if (route.path.startsWith('/workspace')) {
    return '工作台'
  }
  if (route.path.startsWith('/rbac')) {
    return '权限管理'
  }
  if (route.path.startsWith('/changelog')) {
    return '发布日志'
  }

  return '工作台'
})

// 组织相关已移除


// 顶部通知配置：通过环境变量控制
// 方式1：静态配置（推荐）- 在 .env 或 .env.production 中配置：
//   VITE_TOP_NOTIFICATION_TITLE=通知内容文本
//   VITE_TOP_NOTIFICATION_TYPE=1  (1=信息/蓝色, 2=警告/橙色, 3=错误/红色, 4=成功/绿色)
//   VITE_TOP_NOTIFICATION_LINK=https://example.com  (可选，点击通知跳转的链接)
//
// 方式2：动态 WebSocket（如果未配置静态通知）- 在 .env 中配置：
//   VITE_ENABLE_TOP_NOTIFICATION=true
const webSocketTemporarilyDisabled = import.meta.env.VITE_ENABLE_TOP_NOTIFICATION !== 'true'

// 初始化WebSocket连接
const initWebSocket = () => {
  // 获取WebSocket协议（根据当前页面协议）
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

  // 解析 API 基础地址，优先使用环境变量，否则使用当前站点
  let host = window.location.host
  if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.startsWith('http')) {
    try {
      const apiUrl = new URL(import.meta.env.VITE_API_BASE_URL)
      host = apiUrl.host
    } catch (error) {
      console.warn('[WebSocket] 解析 API 基础地址失败，使用当前站点 host', error)
    }
  }

  const wsUrl = `${protocol}//${host}/ws/top-notification`

  console.log('[WebSocket] 尝试连接:', wsUrl)

  try {
    websocket = new WebSocket(wsUrl)

    websocket.onopen = () => {
      console.log('[WebSocket] 连接成功')
      // 启动心跳
      startHeartbeat()
    }

    websocket.onmessage = (event) => {
      console.log('[WebSocket] 收到消息:', event.data)
      try {
        const notification = JSON.parse(event.data)
        if (notification && notification.id) {
          // 更新通知数组
          notices.value = [notification]
        } else {
          // 没有已发布的通知
          notices.value = []
        }
      } catch (error) {
        console.error('[WebSocket] 解析消息失败:', error)
      }
    }

    websocket.onerror = (error) => {
      console.error('[WebSocket] 连接错误:', error)
    }

    websocket.onclose = () => {
      console.log('[WebSocket] 连接关闭')
      stopHeartbeat()
      // 5秒后尝试重连
      reconnectTimeout = setTimeout(() => {
        console.log('[WebSocket] 尝试重连...')
        initWebSocket()
      }, 5000)
    }
  } catch (error) {
    console.error('[WebSocket] 创建连接失败:', error)
  }
}

// 启动心跳
const startHeartbeat = () => {
  heartbeatInterval = setInterval(() => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send('ping')
    }
  }, 30000) // 每30秒发送一次心跳
}

// 停止心跳
const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
    heartbeatInterval = null
  }
}

// 关闭WebSocket连接
const closeWebSocket = () => {
  stopHeartbeat()
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
  if (websocket) {
    websocket.close()
    websocket = null
  }
}



// 组件挂载时初始化通知和组织列表
onMounted(() => {
  // 优先从环境变量加载通知
  const loadedFromEnv = loadNoticeFromEnv()
  
  // 如果环境变量没有配置通知，且 WebSocket 功能未禁用，则尝试 WebSocket
  if (!loadedFromEnv && !webSocketTemporarilyDisabled) {
    initWebSocket()
  }

})

// 组件卸载时关闭WebSocket
onBeforeUnmount(() => {
  if (!webSocketTemporarilyDisabled) {
    closeWebSocket()
  }
})


// 处理新建事项
const handleCreateIssue = async () => {
  console.log('[Header.vue] handleCreateIssue called')
  // 先跳转到我的事项页面
  await router.push('/workspace/issue')
  console.log('[Header.vue] route navigation completed')
  // 等待路由导航完成后，延迟触发对话框
  setTimeout(() => {
    console.log('[Header.vue] triggering create issue dialog')
    workspaceStore.triggerCreateIssue()
    console.log('[Header.vue] showCreateIssueDialog:', workspaceStore.showCreateIssueDialog)
  }, 100)
}

// 搜索框获取焦点
const handleSearchFocus = () => {
  searchFocused.value = true
  if (searchIssueNumber.value.trim()) {
    showSearchResults.value = true
  }
}

// 搜索框失去焦点
const handleSearchBlur = () => {
  searchFocused.value = false
  // 延迟隐藏，让点击事件能够触发
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

// global shortcut: press '/' to focus search (unless focused in an input)
const onGlobalKey = (e) => {
  if (e.key === '/' && document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault()
    nextTick(() => {
      if (searchInput.value && searchInput.value.$el) {
        // t-input exposes $el; try focus on inner input
        const el = searchInput.value.$el.querySelector('input')
        if (el) el.focus()
      } else if (searchInput.value && searchInput.value.focus) {
        searchInput.value.focus()
      }
    })
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKey)
})

// watch route focus toggling if needed (ensure highlightedIndex reset)
watch(searchIssueNumber, (v) => {
  if (!v) highlightedIndex.value = -1
})

// 输入内容变化时自动搜索
const handleSearchInput = () => {
  // 清除之前的定时器
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  const keyword = searchIssueNumber.value.trim()

  if (!keyword) {
    showSearchResults.value = false
    searchResults.value = []
    return
  }

  // 防抖：输入停止300ms后才开始搜索
    searchTimeout = setTimeout(async () => {
    try {
      const res = await searchIssues(keyword)
      // 无论后端返回结构如何，都尽量使用返回的数据展示下拉（即使为空也显示“暂无数据”）
      const payload = res?.data ?? (Array.isArray(res) ? res : [])
      searchResults.value = payload || []
      showSearchResults.value = true
      // reset highlighted index
      highlightedIndex.value = searchResults.value.length > 0 ? 0 : -1
    } catch (error) {
      console.error('搜索事项失败:', error)
      searchResults.value = []
      showSearchResults.value = true
    }
  }, 300)
}

// 选择搜索结果
const handleSelectIssue = (issue) => {
  // 跳转到事项详情页
  router.push(`/workspace/issue/${issue.id}`)
  // 清空搜索框和结果
  searchIssueNumber.value = ''
  searchResults.value = []
  showSearchResults.value = false
}

// 直接搜索（回车键）
const handleDirectSearch = async () => {
  if (!searchIssueNumber.value.trim()) {
    await MessagePlugin.warning('请输入搜索内容')
    return
  }

  // 如果有搜索结果，跳转到第一个
  if (searchResults.value.length > 0) {
    handleSelectIssue(searchResults.value[0])
    return
  }

  // 否则跳转到工作台并搜索
  workspaceStore.setSearchIssueNumber(searchIssueNumber.value)
  if (route.path !== '/workspace/issue') {
    router.push('/workspace/issue')
  }
  showSearchResults.value = false
}

// 获取优先级主题色
const getPriorityTheme = (priority) => {
  const themeMap = {
    '高': 'danger',
    'high': 'danger',
    '中': 'warning',
    'medium': 'warning',
    '低': 'success',
    'low': 'success'
  }
  return themeMap[priority] || 'default'
}

// 处理通知点击
const handleNoticeClick = (notice) => {
  if (notice.link) {
    // 如果有链接，判断是内部路由还是外部链接
    if (notice.link.startsWith('http://') || notice.link.startsWith('https://')) {
      // 外部链接，新窗口打开
      window.open(notice.link, '_blank')
    } else {
      // 内部路由
      router.push(notice.link)
    }
  }
}

// 获取通知类型对应的CSS类名
const getNoticeTypeClass = (type) => {
  const typeClassMap = {
    1: 'notice-type-info',     // 信息 - 蓝色
    2: 'notice-type-warning',  // 警告 - 橙色
    3: 'notice-type-error',    // 错误 - 红色
    4: 'notice-type-success'   // 成功 - 绿色
  }
  return typeClassMap[type] || 'notice-type-info'
}
</script>

<style scoped lang="scss">
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 48px;
  min-height: 48px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0 var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .header-left {
    display: flex;
    align-items: center;
    margin-left: 30px;

    :deep(.app-logo) {
      padding-right: var(--spacing-md);
      border-right: 1px solid rgba(0, 0, 0, 0.06);
      .space-switch-select {
        min-width: 160px;
      }
    }
    
    .left-create-btn {
      margin-left: 12px;
    }

  }

  .header-right {
    margin-right: 40px;
    display: flex;
    align-items: center;
    .create-issue-btn {
      font-size: 13px;
    }

  }
}

/* 搜索框聚焦时展开到 300px */
.header-container .search-wrapper {
  width: 220px;
  transition: width 0.22s ease;
  position: relative;
}
.header-container .search-wrapper.search-focused {
  width: 300px !important;
}
/* 仅当有结果时显示下拉，并固定为 300x100 */
.header-container .search-wrapper.show-results .search-results,
.header-container .search-wrapper.show-results .search-no-result {
  width: 300px !important;
  max-height: 100px !important;
  min-height: 100px !important;
  overflow-y: auto !important;
}

.search-results {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
  padding: 8px;
  border: 1px solid rgba(0,0,0,0.04);
  position: absolute;
  left: 0;
  top: 54px;
  z-index: 200;
}
.search-group {
  font-size: 12px;
  color: #8e8e93;
  padding: 6px 8px;
  border-bottom: 1px solid rgba(0,0,0,0.02);
}
.search-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s ease;
}
.search-result-item:hover,
.search-result-item.is-highlighted {
  background: rgba(0,0,0,0.04);
}
.issue-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.issue-no {
  font-size: 12px;
  color: #6b6b72;
  min-width: 60px;
}
.issue-summary {
  font-size: 13px;
  color: #1f2329;
}
.search-no-result {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 14px rgba(0,0,0,0.06);
  padding: 18px;
  text-align: center;
  color: #8e8e93;
  position: absolute;
  left: 0;
  top: 54px;
  z-index: 200;
}


</style>




