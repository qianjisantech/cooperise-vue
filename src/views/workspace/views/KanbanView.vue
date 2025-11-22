<template>
  <div class="kanban-view">
    <div class="view-header">
      <h3>{{ viewData?.name || '看板视图' }}</h3>
      <div class="view-actions">
        <t-button class="filter-btn" theme="default" size="medium" @click="handleFilter">
          <template #icon><t-icon name="filter" /></template>
          筛选
        </t-button>
        <t-button theme="default" size="medium" @click="handleRefresh">
          <template #icon><t-icon name="refresh" /></template>
          刷新
        </t-button>
      </div>
    </div>

    <div class="kanban-content">
      <div class="kanban-columns">
        <!-- 看板列 -->
        <div
          v-for="column in kanbanColumns"
          :key="column.id"
          class="kanban-column"
        >
          <div class="column-header">
            <div class="column-title">
              <span class="title-text">{{ column.name }}</span>
              <span class="count-badge">{{ column.items.length }}</span>
            </div>
            <t-dropdown :min-column-width="120">
              <t-icon name="more" class="more-icon" />
              <t-dropdown-menu>
                <t-dropdown-item @click="handleEditColumn(column)">
                  编辑列
                </t-dropdown-item>
                <t-dropdown-item @click="handleAddCard(column)">
                  添加卡片
                </t-dropdown-item>
                <t-dropdown-item divider />
                <t-dropdown-item @click="handleDeleteColumn(column)">
                  删除列
                </t-dropdown-item>
              </t-dropdown-menu>
            </t-dropdown>
          </div>

          <!-- 卡片列表 -->
          <div class="column-cards">
            <div
              v-for="item in column.items"
              :key="item.id"
              class="kanban-card"
              @click="handleCardClick(item)"
            >
              <div class="card-header">
                <span class="card-id">{{ item.issueNo || `#${item.id}` }}</span>
                <t-tag
                  v-if="item.priority"
                  size="small"
                  :theme="getPriorityTheme(item.priority)"
                  variant="light"
                >
                  {{ item.priority }}
                </t-tag>
              </div>
              <div class="card-title">{{ item.title }}</div>
              <div class="card-meta">
                <div class="card-tags" v-if="item.tags && item.tags.length > 0">
                  <t-tag
                    v-for="(tag, index) in item.tags"
                    :key="index"
                    size="small"
                    variant="outline"
                  >
                    {{ tag }}
                  </t-tag>
                </div>
                <div class="card-footer">
                  <div class="assignee-info">
                    <t-avatar v-if="item.assignee" size="20px">
                      {{ item.assignee.charAt(0) }}
                    </t-avatar>
                    <span class="assignee-name">{{ item.assignee }}</span>
                  </div>
                  <span class="card-date" v-if="item.dueDate !== '-'">
                    <t-icon name="time" size="12px" />
                    {{ item.dueDate }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 空状态提示 -->
            <div v-if="column.items.length === 0" class="empty-column">
              <t-icon name="inbox" size="32px" />
              <p>暂无事项</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选弹窗 -->
    <t-dialog
      v-model:visible="filterVisible"
      header="筛选条件"
      width="500px"
      :footer="true"
      @confirm="handleFilterConfirm"
      @cancel="filterVisible = false"
    >
      <div class="filter-content">
        <div class="filter-item">
          <label class="filter-label">优先级</label>
          <t-checkbox-group v-model="filterOptions.priority">
            <t-checkbox value="高">高</t-checkbox>
            <t-checkbox value="中">中</t-checkbox>
            <t-checkbox value="低">低</t-checkbox>
          </t-checkbox-group>
        </div>

        <div class="filter-item">
          <label class="filter-label">负责人</label>
          <t-select
            v-model="filterOptions.assignee"
            placeholder="请选择负责人"
            clearable
            multiple
          >
            <t-option value="Admin" label="Admin" />
            <t-option value="Tester1" label="Tester1" />
            <t-option value="Tester2" label="Tester2" />
          </t-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">标签</label>
          <t-select
            v-model="filterOptions.tags"
            placeholder="请选择标签"
            clearable
            multiple
          >
            <t-option value="前端" label="前端" />
            <t-option value="后端" label="后端" />
            <t-option value="UI" label="UI" />
            <t-option value="优化" label="优化" />
            <t-option value="设计" label="设计" />
            <t-option value="架构" label="架构" />
            <t-option value="文档" label="文档" />
            <t-option value="代码审查" label="代码审查" />
            <t-option value="Bug修复" label="Bug修复" />
            <t-option value="维护" label="维护" />
          </t-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">截止日期</label>
          <t-date-range-picker
            v-model="filterOptions.dateRange"
            placeholder="请选择日期范围"
            clearable
          />
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const props = defineProps({
  viewData: {
    type: Object,
    default: null
  },
  viewId: {
    type: String,
    required: true
  },
  issueData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['refresh'])

// 筛选弹窗状态
const filterVisible = ref(false)

// 筛选选项
const filterOptions = ref({
  priority: [],
  assignee: [],
  tags: [],
  dateRange: []
})

// 状态映射配置（匹配后端Integer状态）
const statusColumns = [
  { id: 'TODO', name: '待处理', status: 1 },
  { id: 'IN_PROGRESS', name: '进行中', status: 2 },
  { id: 'REVIEW', name: '待审核', status: 3 },
  { id: 'DONE', name: '已完成', status: 0 }
]

// 根据事项数据生成看板列
const kanbanColumns = computed(() => {
  const issues = props.issueData?.records || []

  console.log('[看板视图] 收到的事项数据:', issues)

  return statusColumns.map(column => {
    // 筛选出对应状态的事项
    const items = issues.filter(issue => issue.status === column.status).map(issue => {
      // 解析tags字段（如果是JSON字符串）
      let tags = []
      if (issue.tags) {
        try {
          tags = typeof issue.tags === 'string' ? JSON.parse(issue.tags) : issue.tags
        } catch (e) {
          tags = []
        }
      }

      return {
        id: issue.id,
        issueNo: issue.issue_no,
        title: issue.summary || '无标题',
        priority: issue.priority || '-',
        tags: tags,
        assignee: issue.assignee_name || '未分配',
        dueDate: formatDate(issue.due_date || issue.create_time),
        spaceKeyword: issue.space_keyword || ''
      }
    })

    console.log(`[看板视图] ${column.name} 列有 ${items.length} 个事项`)

    return {
      id: column.id,
      name: column.name,
      status: column.status,
      items
    }
  })
})

// 优先级主题映射（匹配后端中文优先级）
const getPriorityTheme = (priority) => {
  const themeMap = {
    '高': 'danger',
    '中': 'warning',
    '低': 'default',
    '紧急': 'danger'
  }
  return themeMap[priority] || 'default'
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

const handleFilter = () => {
  filterVisible.value = true
}

const handleFilterConfirm = () => {
  console.log('筛选条件:', filterOptions.value)
  MessagePlugin.success('筛选条件已应用')
  filterVisible.value = false
}

const handleRefresh = () => {
  emit('refresh')
  MessagePlugin.success('刷新成功')
}

const handleAddColumn = () => {
  MessagePlugin.info('添加列功能')
}

const handleEditColumn = (column) => {
  MessagePlugin.info(`编辑列: ${column.name}`)
}

const handleDeleteColumn = (column) => {
  MessagePlugin.warning(`删除列: ${column.name}`)
}

const handleAddCard = (column) => {
  MessagePlugin.info(`在 ${column.name} 中添加卡片`)
}

const handleCardClick = (item) => {
  MessagePlugin.info(`查看卡片: ${item.title}`)
}
</script>

<style scoped lang="scss">
.kanban-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .view-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: #fff;
    border-bottom: 1px solid #e7e7e7;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2329;
    }

    .view-actions {
      display: flex;
      gap: 8px;

      .filter-btn {
        background: linear-gradient(135deg, #f5f2ff 0%, #ede9fe 100%);
        color: #667eea;
        border-color: transparent;

        &:hover {
          background: linear-gradient(135deg, #ede9fe 0%, #e5dffe 100%);
          color: #764ba2;
        }
      }
    }
  }

  .kanban-content {
    flex: 1;
    padding: 20px;
    overflow-x: auto;
    overflow-y: hidden;

    .kanban-columns {
      display: flex;
      gap: 16px;
      min-height: 100%;
      padding-bottom: 20px;

      .kanban-column {
        flex-shrink: 0;
        width: 300px;
        background: #f0f0f0;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 200px);

        .column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #fff;
          border-radius: 8px 8px 0 0;

          .column-title {
            display: flex;
            align-items: center;
            gap: 8px;

            .title-text {
              font-size: 14px;
              font-weight: 600;
              color: #1f2329;
            }

            .count-badge {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-width: 20px;
              height: 20px;
              padding: 0 6px;
              background: #fff;
              border-radius: 10px;
              font-size: 12px;
              color: #646a73;
            }
          }

          .more-icon {
            cursor: pointer;
            color: #646a73;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;

            &:hover {
              background: rgba(0, 0, 0, 0.06);
              color: #0052d9;
            }
          }
        }

        .column-cards {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;

          &::-webkit-scrollbar {
            width: 6px;
          }

          &::-webkit-scrollbar-thumb {
            background: #dcdcdc;
            border-radius: 3px;
          }

          .kanban-card {
            background: #fff;
            border-radius: 8px;
            padding: 14px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);

            &:hover {
              box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
              transform: translateY(-3px);
              border: 1px solid rgba(102, 126, 234, 0.1);
            }

            .card-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 8px;

              .card-id {
                font-size: 12px;
                color: #646a73;
                font-weight: 500;
              }
            }

            .card-title {
              font-size: 14px;
              color: #1f2329;
              line-height: 1.5;
              margin-bottom: 12px;
              word-break: break-word;
            }

            .card-meta {
              .card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 8px;
                min-height: 20px;
              }

              .card-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .assignee-info {
                  display: flex;
                  align-items: center;
                  gap: 6px;

                  .assignee-name {
                    font-size: 12px;
                    color: #646a73;
                  }
                }

                .card-date {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  font-size: 12px;
                  color: #646a73;
                }
              }
            }
          }

          // 空状态
          .empty-column {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            color: #bbb;

            .t-icon {
              margin-bottom: 12px;
            }

            p {
              margin: 0;
              font-size: 13px;
            }
          }
        }
      }
    }
  }

  // 筛选弹窗样式
  .filter-content {
    padding: 16px 0;

    .filter-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .filter-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #1f2329;
      }
    }
  }
}
</style>
