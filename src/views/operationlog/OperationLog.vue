<template>
  <div class="operation-log-container">
    <t-card class="log-card">
      <!-- 筛选条件 -->
      <div class="filter-section">
        <t-form layout="inline" @submit="handleSearch">
          <t-form-item label="请求方法">
            <t-select v-model="searchForm.requestMethod" placeholder="请选择" clearable style="width: 150px">
              <t-option label="GET" value="GET" />
              <t-option label="POST" value="POST" />
              <t-option label="PUT" value="PUT" />
              <t-option label="DELETE" value="DELETE" />
              <t-option label="PATCH" value="PATCH" />
            </t-select>
          </t-form-item>
          <t-form-item label="请求路径">
            <t-input v-model="searchForm.requestUrl" placeholder="请输入请求路径" clearable style="width: 200px" />
          </t-form-item>
          <t-form-item label="用户名">
            <t-input v-model="searchForm.username" placeholder="请输入用户名" clearable style="width: 150px" />
          </t-form-item>
          <t-form-item label="关键词">
            <t-input v-model="searchForm.keyword" placeholder="搜索..." clearable style="width: 200px" />
          </t-form-item>
          <t-form-item>
            <t-space :size="12">
              <t-button theme="primary" type="submit">查询</t-button>
              <t-button theme="default" variant="outline" @click="handleReset">重置</t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </div>

      <!-- 表格 -->
      <t-table
        :data="logList"
        :columns="columns"
        :loading="loading"
        row-key="id"
        stripe
        hover
        class="log-table"
      >
        <template #requestMethod="{ row }">
          <t-tag :theme="getMethodTheme(row.requestMethod)" size="small">
            {{ row.requestMethod }}
          </t-tag>
        </template>

        <template #requestUrl="{ row }">
          <span class="url-text">{{ row.requestUrl }}</span>
        </template>

        <template #statusCode="{ row }">
          <t-tag :theme="row.statusCode === 200 ? 'success' : 'danger'" size="small">
            {{ row.statusCode }}
          </t-tag>
        </template>

        <template #executionTime="{ row }">
          <span :class="getExecutionTimeClass(row.executionTime)">
            {{ row.executionTime }}ms
          </span>
        </template>

        <template #operation="{ row }">
          <t-button theme="primary" variant="text" size="small" @click="handleViewDetail(row)">
            查看详情
          </t-button>
        </template>
      </t-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <t-pagination
          v-model="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-size-options="[10, 20, 50, 100]"
          show-page-size
          show-page-number
          show-jumper
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </t-card>

    <!-- 详情对话框 -->
    <t-dialog
      v-model:visible="showDetailDialog"
      header="操作日志详情"
      width="900px"
      :footer="false"
    >
      <div v-if="currentLog" class="log-detail">
        <t-descriptions bordered>
          <t-descriptions-item label="请求方法">
            <t-tag :theme="getMethodTheme(currentLog.requestMethod)" size="small">
              {{ currentLog.requestMethod }}
            </t-tag>
          </t-descriptions-item>
          <t-descriptions-item label="请求路径">{{ currentLog.requestUrl }}</t-descriptions-item>
          <t-descriptions-item label="状态码">
            <t-tag :theme="currentLog.statusCode === 200 ? 'success' : 'danger'" size="small">
              {{ currentLog.statusCode }}
            </t-tag>
          </t-descriptions-item>
          <t-descriptions-item label="执行时间">{{ currentLog.executionTime }}ms</t-descriptions-item>
          <t-descriptions-item label="用户名">{{ currentLog.username || '-' }}</t-descriptions-item>
          <t-descriptions-item label="IP地址">{{ currentLog.ipAddress || '-' }}</t-descriptions-item>
          <t-descriptions-item label="操作时间" :span="2">{{ formatTime(currentLog.createTime) }}</t-descriptions-item>
        </t-descriptions>

        <div class="detail-section">
          <h4>请求参数</h4>
          <t-textarea
            :value="currentLog.requestParams || '无'"
            readonly
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </div>

        <div class="detail-section">
          <h4>请求体</h4>
          <t-textarea
            :value="formatJson(currentLog.requestBody) || '无'"
            readonly
            :autosize="{ minRows: 5, maxRows: 15 }"
          />
        </div>

        <div class="detail-section">
          <h4>响应体</h4>
          <t-textarea
            :value="formatJson(currentLog.responseBody) || '无'"
            readonly
            :autosize="{ minRows: 5, maxRows: 15 }"
          />
        </div>

        <div v-if="currentLog.errorMsg" class="detail-section">
          <h4>错误信息</h4>
          <t-textarea
            :value="currentLog.errorMsg"
            readonly
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </div>

        <div class="detail-section">
          <h4>User Agent</h4>
          <t-textarea
            :value="currentLog.userAgent || '无'"
            readonly
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { getOperationLogPage } from '@/api/operationLog.js'

const loading = ref(false)
const showDetailDialog = ref(false)
const currentLog = ref(null)

// 搜索表单
const searchForm = ref({
  requestMethod: '',
  requestUrl: '',
  username: '',
  keyword: ''
})

// 分页参数
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0
})

// 表格列配置
const columns = [
  {
    colKey: 'id',
    title: 'ID',
    width: 80,
    align: 'center'
  },
  {
    colKey: 'requestMethod',
    title: '请求方法',
    width: 100,
    align: 'center'
  },
  {
    colKey: 'requestUrl',
    title: '请求路径',
    width: 300,
    align: 'left'
  },
  {
    colKey: 'username',
    title: '用户名',
    width: 120,
    align: 'center'
  },
  {
    colKey: 'ipAddress',
    title: 'IP地址',
    width: 150,
    align: 'center'
  },
  {
    colKey: 'statusCode',
    title: '状态码',
    width: 100,
    align: 'center'
  },
  {
    colKey: 'executionTime',
    title: '执行时间',
    width: 120,
    align: 'center'
  },
  {
    colKey: 'createTime',
    title: '操作时间',
    width: 180,
    align: 'center'
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 100,
    align: 'center',
    fixed: 'right'
  }
]

// 日志列表
const logList = ref([])

// 获取日志列表
const fetchLogList = async () => {
  try {
    loading.value = true
    const res = await getOperationLogPage({
      current: pagination.value.current,
      size: pagination.value.pageSize,
      ...searchForm.value
    })
    if (res.success) {
      logList.value = res.data.records || []
      pagination.value.total = res.data.total || 0
    } else {
      MessagePlugin.error(res.message || '获取日志列表失败')
    }
  } catch (error) {
    console.error('获取日志列表失败:', error)
    MessagePlugin.error('获取日志列表失败')
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handlePageChange = (pageInfo) => {
  pagination.value.current = pageInfo.current
  fetchLogList()
}

// 处理每页条数变化
const handlePageSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.current = 1
  fetchLogList()
}

// 处理搜索
const handleSearch = () => {
  pagination.value.current = 1
  fetchLogList()
}

// 处理重置
const handleReset = () => {
  searchForm.value = {
    requestMethod: '',
    requestUrl: '',
    username: '',
    keyword: ''
  }
  pagination.value.current = 1
  fetchLogList()
}

// 处理查看详情
const handleViewDetail = (row) => {
  currentLog.value = row
  showDetailDialog.value = true
}

// 获取请求方法主题
const getMethodTheme = (method) => {
  const themeMap = {
    'GET': 'success',
    'POST': 'primary',
    'PUT': 'warning',
    'DELETE': 'danger',
    'PATCH': 'warning'
  }
  return themeMap[method] || 'default'
}

// 获取执行时间样式类
const getExecutionTimeClass = (time) => {
  if (time < 100) return 'time-fast'
  if (time < 500) return 'time-normal'
  return 'time-slow'
}

// 格式化时间（后端已经格式化好了，直接返回）
const formatTime = (time) => {
  if (!time) return '-'
  return time
}

// 格式化JSON
const formatJson = (jsonStr) => {
  if (!jsonStr) return ''
  try {
    const obj = JSON.parse(jsonStr)
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return jsonStr
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchLogList()
})
</script>

<style scoped lang="scss">
.operation-log-container {
  .log-card {
    :deep(.t-card__body) {
      padding: 24px;
    }

    .filter-section {
      margin-bottom: 24px;
      padding: 16px;
      background: #f5f7fa;
      border-radius: 6px;

      :deep(.t-form) {
        .t-form-item {
          margin-bottom: 0;
        }
      }
    }

    .log-table {
      .url-text {
        font-size: 13px;
        color: #1f2329;
        word-break: break-all;
      }

      .time-fast {
        color: #2ba471;
        font-weight: 500;
      }

      .time-normal {
        color: #ed7b2f;
        font-weight: 500;
      }

      .time-slow {
        color: #e34d59;
        font-weight: 500;
      }

      :deep(.t-table) {
        border: 1px solid #e7e7e7;
        border-radius: 6px;
      }

      :deep(.t-table__header) {
        background: #f5f7fa;

        th {
          font-weight: 600;
          color: #1f2329;
          border-bottom: 1px solid #e7e7e7;
        }
      }
    }

    .pagination-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e7e7e7;
    }
  }

  .log-detail {
    .detail-section {
      margin-top: 24px;

      h4 {
        font-size: 14px;
        font-weight: 600;
        color: #1f2329;
        margin-bottom: 12px;
      }

      :deep(.t-textarea__inner) {
        font-family: 'Courier New', monospace;
        font-size: 12px;
      }
    }
  }
}
</style>
