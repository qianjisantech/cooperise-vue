<template>
  <div class="my-view-container">
    <div v-if="loading" class="loading-state">
      <t-loading text="加载中..." size="large" />
    </div>

    <div v-else-if="error" class="error-state">
      <t-icon name="error-circle" size="48px" />
      <p>{{ error }}</p>
      <t-button theme="primary" @click="loadViewData">重试</t-button>
    </div>

    <component
      v-else-if="currentViewComponent"
      :is="currentViewComponent"
      :view-data="viewData"
      :view-id="viewId"
      :issue-data="issueData"
    />

    <div v-else class="empty-state">
      <t-icon name="inbox" size="48px" />
      <p>未找到对应的视图</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { getViewDetail, getIssueList } from '@/api/workspace'

// 导入不同类型的视图组件
import GanttView from './views/GanttView.vue'
import KanbanView from './views/KanbanView.vue'
import TableView from './views/TableView.vue'
import CalendarView from './views/CalendarView.vue'
import ResourceGanttView from './views/ResourceGanttView.vue'

const route = useRoute()

const loading = ref(false)
const error = ref('')
const viewData = ref(null)
const issueData = ref(null)
const currentViewComponent = shallowRef(null)

// 从 URL 获取视图 ID
const viewId = computed(() => route.query.id)

// 视图类型与组件的映射
const viewComponentMap = {
  'gantt': GanttView,
  'kanban': KanbanView,
  'board': KanbanView, // board 也映射到看板视图
  'table': TableView,
  'calendar': CalendarView,
  'resource-gantt': ResourceGanttView
}

/**
 * 解析视图配置并转换为查询参数
 * @param {string|object} config - 视图配置
 * @returns {object} - 查询参数
 */
const parseViewConfigToQuery = (config) => {
  try {
    // 如果 config 是字符串，解析为对象
    const configObj = typeof config === 'string' ? JSON.parse(config) : config

    const queryParams = {
      current: 1,
      size: 100 // 默认每页100条
    }

    // 解析过滤条件
    if (configObj.filters) {
      const { filters } = configObj

      // 状态筛选
      if (filters.status && filters.status.length > 0) {
        queryParams.status = filters.status
      }

      // 优先级筛选
      if (filters.priority && filters.priority.length > 0) {
        queryParams.priority = filters.priority
      }

      // 负责人筛选
      if (filters.assignee && filters.assignee.length > 0) {
        queryParams.assigneeId = filters.assignee
      }

      // 创建人筛选
      if (filters.creator && filters.creator.length > 0) {
        queryParams.creatorId = filters.creator
      }

      // 关键词筛选
      if (filters.keyword) {
        queryParams.keyword = filters.keyword
      }

      // 日期范围筛选
      if (filters.dateRange) {
        if (filters.dateRange.start) {
          queryParams.startDateFrom = filters.dateRange.start
        }
        if (filters.dateRange.end) {
          queryParams.startDateTo = filters.dateRange.end
        }
      }
    }

    // 解析排序条件
    if (configObj.sort) {
      queryParams.sortField = configObj.sort.field || 'createTime'
      queryParams.sortOrder = configObj.sort.order || 'desc'
    }

    return queryParams
  } catch (err) {
    console.error('[解析视图配置失败]', err)
    return {
      current: 1,
      size: 100
    }
  }
}

/**
 * 加载事项数据
 * @param {object} viewConfig - 视图配置
 */
const loadIssueData = async (viewConfig) => {
  try {
    // 解析视图配置为查询参数
    const queryParams = parseViewConfigToQuery(viewConfig)

    console.log('[加载事项数据] 查询参数:', queryParams)

    // 调用事项查询接口
    const res = await getIssueList(queryParams)

    if (res.success && res.data) {
      issueData.value = res.data
      console.log('[加载事项数据] 成功，共', res.data.total, '条')
    } else {
      console.error('[加载事项数据] 失败:', res.message)
      MessagePlugin.warning('加载事项数据失败: ' + (res.message || '未知错误'))
    }
  } catch (err) {
    console.error('[加载事项数据] 异常:', err)
    MessagePlugin.error('加载事项数据失败')
  }
}

// 加载视图数据
const loadViewData = async () => {
  if (!viewId.value) {
    error.value = '缺少视图 ID'
    return
  }

  loading.value = true
  error.value = ''
  issueData.value = null

  try {
    // 调用 API 获取视图数据
    const res = await getViewDetail(viewId.value)

    if (res.success && res.data) {
      const viewDetail = res.data

      viewData.value = {
        id: viewDetail.id,
        name: viewDetail.name,
        type: viewDetail.type,
        config: viewDetail.config || {},
        data: viewDetail.data || {}
      }

      // 根据视图类型加载对应的组件
      const viewType = viewDetail.type
      if (viewComponentMap[viewType]) {
        currentViewComponent.value = viewComponentMap[viewType]
      } else {
        error.value = `不支持的视图类型: ${viewType}`
      }

      // 加载事项数据
      await loadIssueData(viewDetail.config)
    } else {
      error.value = res.message || '视图不存在'
    }

    loading.value = false
  } catch (err) {
    loading.value = false
    error.value = err.message || '加载视图失败'
    MessagePlugin.error('加载视图失败')
  }
}

// 监听视图 ID 变化
watch(viewId, (newId) => {
  if (newId) {
    loadViewData()
  }
}, { immediate: true })

onMounted(() => {
  if (viewId.value) {
    loadViewData()
  }
})
</script>

<style scoped lang="scss">
.my-view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .loading-state,
  .error-state,
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: #646a73;

    .t-icon {
      color: #bbb;
    }

    p {
      font-size: 14px;
      margin: 0;
    }
  }

  .error-state {
    .t-icon {
      color: #e34d59;
    }
  }
}
</style>
