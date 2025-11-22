<template>
  <div class="space-container">
    <t-card class="space-card">
      <!-- 操作按钮区域 -->
      <div class="action-bar">
        <t-space>
          <t-button v-permission="'space:add'" theme="primary" size="medium" @click="handleCreate">
            <template #icon>
              <t-icon name="add" />
            </template>
            新增空间
          </t-button>
          <t-button theme="primary" @click="handleSearch">查询</t-button>
          <t-button theme="default" @click="handleReset">重置</t-button>
        </t-space>
      </div>

      <!-- 搜索条件 -->
      <div class="search-form">
        <t-form :data="searchForm" layout="inline">
          <t-form-item label="空间名称" name="name">
            <t-input v-model="searchForm.name" placeholder="请输入空间名称" clearable style="width: 200px;" />
          </t-form-item>

          <t-form-item label="关键词" name="keyword">
            <t-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable style="width: 200px;" />
          </t-form-item>
        </t-form>
      </div>

      <t-table
        :data="spaceList"
        :columns="columns"
        :loading="loading"
        row-key="id"
        stripe
        hover
        class="space-table"
      >
        <template #name="{ row }">
          <div class="space-info">
            <t-icon :name="row.icon || 'layers'" size="20px" style="color: #0052d9;" />
            <span class="space-name">{{ row.name }}</span>
          </div>
        </template>

        <template #owner="{ row }">
          <span>{{ row.owner || row.ownerName || '-' }}</span>
        </template>

        <template #keywords="{ row }">
          <span>{{ row.code || '-' }}</span>
        </template>

        <template #operation="{ row }">
          <t-space>
            <t-button v-permission="'space:view'" theme="primary" variant="text" size="small" @click="handleEnterSpace(row)">
              进入空间
            </t-button>
            <t-button v-permission="'space:edit'" theme="primary" variant="text" size="small" @click="handleEdit(row)">
              编辑
            </t-button>
            <t-button v-permission="'space:delete'" theme="danger" variant="text" size="small" @click="handleDelete(row)">
              删除
            </t-button>
          </t-space>
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
    </t-card>

    <!-- 创建/编辑空间对话框 -->
    <SpaceFormDialog
      v-model="showFormDialog"
      :space-data="currentSpace"
      @success="handleFormSuccess"
    />

    <!-- 空间设置抽屉 -->
    <t-drawer
      v-model:visible="showSettingsDrawer"
      :header="`空间设置 - ${currentSpace?.name || ''}`"
      size="large"
      :footer="false"
      destroy-on-close
    >
      <SpaceSettingsDrawer
        v-if="showSettingsDrawer && currentSpace"
        :space-id="currentSpace.id"
      />
    </t-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { getSpaceListPage, deleteSpace } from '@/api/space.js'
import SpaceFormDialog from './components/SpaceFormDialog.vue'
import SpaceSettingsDrawer from './components/SpaceSettingsDrawer.vue'

const router = useRouter()

const loading = ref(false)

// 搜索表单
const searchForm = ref({
  name: '',
  keyword: ''
})

// 分页参数
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const columns = [
  {
    colKey: 'name',
    title: '空间名称',
    width: 280,
    align: 'left'
  },
  {
    colKey: 'keyword',
    title: '关键词',
    width: 150,
    align: 'center'
  },
  {
    colKey: 'owner',
    title: '负责人',
    width: 100,
    align: 'center'
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 150,
    align: 'center',
    fixed: 'right'
  }
]

// 空间列表
const spaceList = ref([])

// 控制表单对话框显示
const showFormDialog = ref(false)

// 控制设置抽屉显示
const showSettingsDrawer = ref(false)

// 当前操作的空间数据
const currentSpace = ref(null)

// 获取空间列表
const fetchSpaceList = async () => {
  try {
    loading.value = true
    const params = {
      current: pagination.value.current,
      size: pagination.value.pageSize
    }

    // 添加搜索条件
    if (searchForm.value.name) {
      params.name = searchForm.value.name
    }
    if (searchForm.value.keyword) {
      params.keyword = searchForm.value.keyword
    }

    const res = await getSpaceListPage(params)
    if (res.success) {
      const records = res.data.records || res.data.list || []
      spaceList.value = records
      // 更新总数
      pagination.value.total = res.data.total || records.length
    } else {
      await MessagePlugin.error(res.message || '获取空间列表失败')
    }
  } catch (error) {
    console.error('获取空间列表失败:', error)
    await MessagePlugin.error('获取空间列表失败')
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handlePageChange = (pageInfo) => {
  pagination.value.current = pageInfo.current
  fetchSpaceList()
}

// 处理每页条数变化
const handlePageSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.current = 1  // 重置到第一页
  fetchSpaceList()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchSpaceList()
})

// 处理搜索
const handleSearch = () => {
  pagination.value.current = 1  // 重置到第一页
  fetchSpaceList()
}

// 处理重置
const handleReset = () => {
  searchForm.value = {
    name: '',
    keyword: ''
  }
  pagination.value.current = 1  // 重置到第一页
  fetchSpaceList()
}

// 处理创建空间
const handleCreate = () => {
  currentSpace.value = null
  showFormDialog.value = true
}

// 处理编辑空间
const handleEdit = (row) => {
  currentSpace.value = { ...row }
  showFormDialog.value = true
}

// 处理删除空间
const handleDelete = (row) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '确认删除',
    body: `确定要删除空间"${row.name}"吗？此操作不可恢复。`,
    confirmBtn: '删除',
    cancelBtn: '取消',
    theme: 'danger',
    onConfirm: async () => {
      try {
        await deleteSpace(row.id)
        MessagePlugin.success('空间删除成功')
        // 刷新列表
        fetchSpaceList()
        confirmDialog.hide()
      } catch (error) {
        console.error('删除空间失败:', error)
        const message = error.response?.data?.message || error.message || '删除失败'
        MessagePlugin.error(message)
      }
    }
  })
}

// 处理进入空间
const handleEnterSpace = (row) => {
  currentSpace.value = { ...row }
  showSettingsDrawer.value = true
}

// 处理表单提交成功
const handleFormSuccess = () => {
  fetchSpaceList()
}
</script>

<style scoped lang="scss">
.space-container {
  .space-card {
    :deep(.t-card__body) {
      padding: 24px;
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

    .space-table {
      .space-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .space-name {
          font-size: 14px;
          font-weight: 500;
          color: #1f2329;
          margin-left: 8px;
        }
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
}
</style>
