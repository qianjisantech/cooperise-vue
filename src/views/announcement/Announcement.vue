<template>
  <div class="announcement-container">
    <t-card class="announcement-card">
      <!-- Tab标签页 -->
      <t-tabs v-model="activeTab" @change="handleTabChange">
        <!-- 系统更新Tab -->
        <t-tab-panel value="systemUpdate" label="系统更新">
          <div class="tab-content">
            <!-- 操作按钮区域 -->
            <div class="action-bar">
              <t-space>
                <t-button v-permission="'announcement:add'" theme="primary" size="medium" @click="handleCreate">
                  <template #icon>
                    <t-icon name="add" />
                  </template>
                  创建系统更新
                </t-button>
                <t-button theme="primary" @click="handleSearch">查询</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
              </t-space>
            </div>

            <!-- 搜索条件 -->
            <div class="search-form">
              <t-form :data="searchForm" layout="inline">
                <t-form-item label="标题" name="title">
                  <t-input v-model="searchForm.title" placeholder="请输入标题" clearable style="width: 200px;" />
                </t-form-item>

                <t-form-item label="状态" name="status">
                  <t-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px;">
                    <t-option :value="0" label="草稿" />
                    <t-option :value="1" label="已发布" />
                  </t-select>
                </t-form-item>
              </t-form>
            </div>

            <t-table
              :data="announcementList"
              :columns="systemUpdateColumns"
              :loading="loading"
              row-key="id"
              stripe
              hover
              class="announcement-table"
              @row-click="handleRowClick"
            >
              <template #status="{ row }">
                <t-switch
                  :value="row.status === 1"
                  @change="(value) => handlePublishSwitch(row, value)"
                  @click.stop
                />
              </template>

              <template #operation="{ row }">
                <t-button v-permission="'announcement:edit'" theme="primary" variant="text" @click.stop="handleEdit(row)">
                  编辑
                </t-button>
                <t-button v-permission="'announcement:delete'" theme="danger" variant="text" @click.stop="handleDelete(row)">
                  删除
                </t-button>
              </template>
            </t-table>

            <!-- 分页组件 -->
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
          </div>
        </t-tab-panel>

        <!-- 顶部通知Tab -->
        <t-tab-panel value="topNotification" label="顶部通知">
          <div class="tab-content">
            <!-- 操作按钮区域 -->
            <div class="action-bar">
              <t-space>
                <t-button v-permission="'announcement:add'" theme="primary" size="medium" @click="handleCreate">
                  <template #icon>
                    <t-icon name="add" />
                  </template>
                  创建顶部通知
                </t-button>
                <t-button theme="primary" @click="handleSearch">查询</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
              </t-space>
            </div>

            <!-- 搜索条件 -->
            <div class="search-form">
              <t-form :data="searchForm" layout="inline">
                <t-form-item label="标题" name="title">
                  <t-input v-model="searchForm.title" placeholder="请输入标题" clearable style="width: 200px;" />
                </t-form-item>

                <t-form-item label="类型" name="type">
                  <t-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 150px;">
                    <t-option :value="1" label="信息" />
                    <t-option :value="2" label="警告" />
                    <t-option :value="3" label="错误" />
                    <t-option :value="4" label="成功" />
                  </t-select>
                </t-form-item>

                <t-form-item label="状态" name="status">
                  <t-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px;">
                    <t-option :value="0" label="草稿" />
                    <t-option :value="1" label="已发布" />
                  </t-select>
                </t-form-item>
              </t-form>
            </div>

            <t-table
              :data="announcementList"
              :columns="topNotificationColumns"
              :loading="loading"
              row-key="id"
              stripe
              hover
              class="announcement-table"
              @row-click="handleRowClick"
            >
              <template #type="{ row }">
                <t-tag :theme="getNotificationTypeTheme(row.type)" size="small">
                  {{ getNotificationTypeText(row.type) }}
                </t-tag>
              </template>

              <template #status="{ row }">
                <t-switch
                  :value="row.status === 1"
                  @change="(value) => handlePublishSwitch(row, value)"
                  @click.stop
                />
              </template>

              <template #operation="{ row }">
                <t-button v-permission="'announcement:edit'" theme="primary" variant="text" @click.stop="handleEdit(row)">
                  编辑
                </t-button>
                <t-button v-permission="'announcement:delete'" theme="danger" variant="text" @click.stop="handleDelete(row)">
                  删除
                </t-button>
              </template>
            </t-table>

            <!-- 分页组件 -->
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
          </div>
        </t-tab-panel>
      </t-tabs>
    </t-card>

    <!-- 详情抽屉 -->
    <t-drawer
      v-model:visible="showDetailDrawer"
      :header="activeTab === 'systemUpdate' ? '系统更新详情' : '顶部通知详情'"
      size="60%"
      :close-btn="true"
      destroy-on-close
    >
      <div class="announcement-detail" v-if="currentAnnouncement">
        <div class="detail-header">
          <h2>{{ currentAnnouncement.title }}</h2>
          <div class="detail-meta">
            <span v-if="currentAnnouncement.publisherName">发布人：{{ currentAnnouncement.publisherName }}</span>
            <span v-if="currentAnnouncement.publishTime">发布时间：{{ currentAnnouncement.publishTime }}</span>
            <span v-if="currentAnnouncement.version">版本号：{{ currentAnnouncement.version }}</span>
          </div>
        </div>
        <div class="detail-content">
          {{ currentAnnouncement.content }}
        </div>
      </div>
    </t-drawer>

    <!-- 表单弹窗 -->
    <AnnouncementFormDialog
      v-model="showFormDialog"
      :tab-type="activeTab"
      :announcement-data="editingAnnouncement"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import {
  getSystemUpdatePage,
  deleteSystemUpdate,
  publishSystemUpdate,
  getPublishedSystemUpdate,
  getTopNotificationPage,
  deleteTopNotification,
  publishTopNotification,
  getPublishedTopNotification
} from '@/api/announcement.js'
import AnnouncementFormDialog from './components/AnnouncementFormDialog.vue'

const loading = ref(false)
const showDetailDrawer = ref(false)
const currentAnnouncement = ref(null)
const showFormDialog = ref(false)
const editingAnnouncement = ref(null)
const activeTab = ref('systemUpdate')

// 搜索表单
const searchForm = ref({
  title: '',
  type: undefined,
  status: undefined
})

// 分页参数
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

// 系统更新表格列配置
const systemUpdateColumns = [
  {
    colKey: 'title',
    title: '更新标题',
    width: 300,
    align: 'left'
  },
  {
    colKey: 'version',
    title: '版本号',
    width: 120,
    align: 'center'
  },
  {
    colKey: 'publisherName',
    title: '发布人',
    width: 120,
    align: 'center'
  },
  {
    colKey: 'publishTime',
    title: '发布时间',
    width: 180,
    align: 'center'
  },
  {
    colKey: 'status',
    title: '是否发布',
    width: 100,
    align: 'center'
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 200,
    align: 'center',
    fixed: 'right'
  }
]

// 顶部通知表格列配置
const topNotificationColumns = [
  {
    colKey: 'title',
    title: '通知标题',
    width: 300,
    align: 'left'
  },
  {
    colKey: 'type',
    title: '类型',
    width: 100,
    align: 'center'
  },
  {
    colKey: 'publisherName',
    title: '发布人',
    width: 120,
    align: 'center'
  },
  {
    colKey: 'publishTime',
    title: '发布时间',
    width: 180,
    align: 'center'
  },
  {
    colKey: 'status',
    title: '是否发布',
    width: 100,
    align: 'center'
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 200,
    align: 'center',
    fixed: 'right'
  }
]

// 公告列表数据
const announcementList = ref([])

// 获取公告列表
const fetchAnnouncementList = async () => {
  try {
    loading.value = true
    const params = {
      current: pagination.value.current,
      pageSize: pagination.value.pageSize
    }

    // 添加搜索条件
    if (searchForm.value.title) {
      params.title = searchForm.value.title
    }
    if (searchForm.value.type !== undefined && searchForm.value.type !== null) {
      params.type = searchForm.value.type
    }
    if (searchForm.value.status !== undefined && searchForm.value.status !== null) {
      params.status = searchForm.value.status
    }

    let res
    if (activeTab.value === 'systemUpdate') {
      res = await getSystemUpdatePage(params)
    } else {
      res = await getTopNotificationPage(params)
    }

    if (res.success) {
      announcementList.value = res.data.records || []
      pagination.value.total = res.data.total || 0
    } else {
      await MessagePlugin.error(res.message || '获取列表失败')
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    await MessagePlugin.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

// 处理Tab切换
const handleTabChange = (value) => {
  activeTab.value = value
  // 重置搜索条件和分页
  searchForm.value = {
    title: '',
    type: undefined,
    status: undefined
  }
  pagination.value.current = 1
  fetchAnnouncementList()
}

// 处理页码变化
const handlePageChange = (pageInfo) => {
  pagination.value.current = pageInfo.current
  fetchAnnouncementList()
}

// 处理每页条数变化
const handlePageSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.current = 1
  fetchAnnouncementList()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchAnnouncementList()
})

// 处理搜索
const handleSearch = () => {
  pagination.value.current = 1
  fetchAnnouncementList()
}

// 处理重置
const handleReset = () => {
  searchForm.value = {
    title: '',
    type: undefined,
    status: undefined
  }
  pagination.value.current = 1
  fetchAnnouncementList()
}

// 获取通知类型文本
const getNotificationTypeText = (type) => {
  const typeMap = {
    1: '信息',
    2: '警告',
    3: '错误',
    4: '成功'
  }
  return typeMap[type] || '未知'
}

// 获取通知类型主题色
const getNotificationTypeTheme = (type) => {
  const themeMap = {
    1: 'primary',
    2: 'warning',
    3: 'danger',
    4: 'success'
  }
  return themeMap[type] || 'default'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: '草稿',
    1: '已发布'
  }
  return statusMap[status] || '未知'
}

// 获取状态主题色
const getStatusTheme = (status) => {
  const themeMap = {
    0: 'default',
    1: 'success'
  }
  return themeMap[status] || 'default'
}

// 处理行点击
const handleRowClick = ({ row }) => {
  currentAnnouncement.value = row
  showDetailDrawer.value = true
}

// 处理新建
const handleCreate = () => {
  editingAnnouncement.value = null
  showFormDialog.value = true
}

// 处理编辑
const handleEdit = (row) => {
  editingAnnouncement.value = row
  showFormDialog.value = true
}

// 处理发布状态切换
const handlePublishSwitch = async (row, value) => {
  const itemName = activeTab.value === 'systemUpdate' ? '系统更新' : '顶部通知'

  if (value) {
    // 开启发布 - 先检查是否有已发布的记录
    try {
      let publishedRes
      if (activeTab.value === 'systemUpdate') {
        publishedRes = await getPublishedSystemUpdate()
      } else {
        publishedRes = await getPublishedTopNotification()
      }

      let dialogBody = ''
      if (publishedRes.success && publishedRes.data && publishedRes.data.id) {
        // 有已发布的记录
        const publishedItem = publishedRes.data
        dialogBody = `当前已有已发布的${itemName}："${publishedItem.title}"（发布人：${publishedItem.publisherName || '未知'}）。\n\n如果发布新的${itemName}，原记录将自动改为草稿状态。\n\n确定要发布"${row.title}"吗？`
      } else {
        // 没有已发布的记录
        dialogBody = `确定要发布"${row.title}"吗？`
      }

      const confirmDialog = DialogPlugin.confirm({
        header: '确认发布',
        body: dialogBody,
        confirmBtn: {
          content: '确定发布',
          theme: 'primary'
        },
        cancelBtn: '取消',
        onConfirm: async () => {
          try {
            let res
            if (activeTab.value === 'systemUpdate') {
              res = await publishSystemUpdate(row.id)
            } else {
              res = await publishTopNotification(row.id)
            }

            if (res.success) {
              MessagePlugin.success('发布成功')
              fetchAnnouncementList()
              confirmDialog.hide()
            } else {
              MessagePlugin.error(res.message || '发布失败')
            }
          } catch (error) {
            console.error('发布失败:', error)
            MessagePlugin.error('发布失败')
          }
        }
      })
    } catch (error) {
      console.error('检查已发布记录失败:', error)
      MessagePlugin.error('检查已发布记录失败')
    }
  } else {
    // 关闭发布，设置为草稿
    MessagePlugin.warning('已发布的内容不能取消发布，只能编辑后重新发布')
  }
}

// 处理表单提交成功
const handleFormSuccess = () => {
  fetchAnnouncementList()
}

// 处理删除
const handleDelete = (row) => {
  const itemName = activeTab.value === 'systemUpdate' ? '系统更新' : '顶部通知'
  const confirmDialog = DialogPlugin.confirm({
    header: '确认删除',
    body: `确定要删除${itemName}"${row.title}"吗？此操作不可撤销。`,
    confirmBtn: {
      content: '确定',
      theme: 'danger'
    },
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      try {
        let res
        if (activeTab.value === 'systemUpdate') {
          res = await deleteSystemUpdate(row.id)
        } else {
          res = await deleteTopNotification(row.id)
        }

        if (res.success) {
          MessagePlugin.success('删除成功')
          fetchAnnouncementList()
          confirmDialog.hide()
        } else {
          MessagePlugin.error(res.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        MessagePlugin.error('删除失败')
      }
    }
  })
}
</script>

<style scoped lang="scss">
.announcement-container {
  .announcement-card {
    :deep(.t-card__body) {
      padding: 24px;
    }

    .tab-content {
      padding-top: 16px;
    }

    .action-bar {
      margin-bottom: 16px;
      display: flex;
      justify-content: flex-start;
    }

    .search-form {
      background: #f5f7fa;
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 20px;

      :deep(.t-form) {
        .t-form__item {
          margin-bottom: 0;
        }
      }
    }

    .announcement-table {
      :deep(.t-table) {
        border: 1px solid #e7e7e7;
        border-radius: 6px;

        tr {
          cursor: pointer;
        }
      }

      :deep(.t-table__header) {
        background: #f5f7fa;

        th {
          font-weight: 600;
          color: #1f2329;
          border-bottom: 1px solid #e7e7e7;
        }
      }

      :deep(.t-table__body) {
        tr {
          transition: all 0.3s;

          &:hover {
            background: #f5f7fa;
          }

          td {
            color: #646a73;
            border-bottom: 1px solid #e7e7e7;
          }
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

  .announcement-detail {
    .detail-header {
      padding-bottom: 20px;
      border-bottom: 1px solid #e7e7e7;
      margin-bottom: 20px;

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #1f2329;
        margin: 0 0 12px 0;
      }

      .detail-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 13px;
        color: #646a73;
      }
    }

    .detail-content {
      font-size: 14px;
      line-height: 1.8;
      color: #1f2329;
      white-space: pre-wrap;
    }
  }
}
</style>
