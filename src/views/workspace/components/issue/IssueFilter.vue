<template>
  <div class="issue-filter">
    <!-- 筛选器标题栏 -->
    <div class="filter-header">
      <div class="filter-title">
        <t-icon name="filter" class="title-icon" />
        <span>筛选条件</span>
        <t-tag v-if="activeFilterCount > 0" theme="primary" variant="light" size="small">
          {{ activeFilterCount }}
        </t-tag>
      </div>
      <div class="filter-actions">
        <t-button
          theme="default"
          variant="text"
          size="small"
          @click="handleResetFilters"
        >
          <template #icon>
            <t-icon name="refresh" />
          </template>
          重置
        </t-button>
        <t-button
          theme="primary"
          size="small"
          @click="handleApplyFilter"
        >
          <template #icon>
            <t-icon name="check" />
          </template>
          应用
        </t-button>
      </div>
    </div>

    <!-- 筛选条件列表 -->
    <div class="filter-list">
      <div
        v-for="(filter, index) in localFilterConditions"
        :key="filter.id"
        class="filter-item"
        :class="{ 'has-value': filter.value }"
      >
        <!-- 字段选择器 -->
        <div class="filter-field-select">
          <t-select
            v-model="filter.field"
            placeholder="选择字段"
            size="small"
            :popup-props="{ overlayClassName: 'filter-field-popup' }"
          >
            <t-option
              v-for="field in filterFields"
              :key="field.value"
              :value="field.value"
              :label="field.label"
            >
              <div class="field-option">
                <t-icon :name="field.icon" size="16px" />
                <span>{{ field.label }}</span>
              </div>
            </t-option>
          </t-select>
        </div>

        <!-- 条件值输入 -->
        <div class="filter-value-input">
          <!-- 搜索框 -->
          <t-input
            v-if="filter.field === 'keyword'"
            v-model="filter.value"
            placeholder="搜索事项概要或单号..."
            clearable
            size="small"
          >
            <template #prefix-icon>
              <t-icon name="search" />
            </template>
          </t-input>

          <!-- 事项类型选择 -->
          <t-select
            v-else-if="filter.field === 'issueType'"
            v-model="filter.value"
            placeholder="请选择事项类型"
            clearable
            size="small"
          >
            <t-option
              v-for="type in issueTypeOptions"
              :key="type.value"
              :value="type.value"
              :label="type.label"
            >
              <div class="type-option">
                <t-icon :name="type.icon" size="16px" />
                <span>{{ type.label }}</span>
              </div>
            </t-option>
          </t-select>

          <!-- 状态选择 -->
          <t-select
            v-else-if="filter.field === 'status'"
            v-model="filter.value"
            placeholder="请选择状态"
            clearable
            size="small"
          >
            <t-option
              v-for="status in statusOptions"
              :key="status.value"
              :value="status.value"
              :label="status.label"
            >
              <div class="status-option">
                <t-tag :theme="status.theme" variant="light" size="small">
                  {{ status.label }}
                </t-tag>
              </div>
            </t-option>
          </t-select>

          <!-- 优先级选择 -->
          <t-select
            v-else-if="filter.field === 'priority'"
            v-model="filter.value"
            placeholder="请选择优先级"
            clearable
            size="small"
          >
            <t-option
              v-for="priority in priorityOptions"
              :key="priority.value"
              :value="priority.value"
              :label="priority.label"
            >
              <div class="priority-option">
                <t-tag :theme="priority.theme" size="small">
                  {{ priority.label }}
                </t-tag>
              </div>
            </t-option>
          </t-select>

          <!-- 经办人选择 -->
          <t-select
            v-else-if="filter.field === 'assigneeId'"
            v-model="filter.value"
            placeholder="请选择经办人"
            clearable
            filterable
            size="small"
          >
            <t-option
              v-for="user in userList"
              :key="user.id"
              :value="user.id"
              :label="`${user.username} (${user.email || '无邮箱'})`"
            >
              <div class="user-option">
                <span class="user-name">{{ user.username }}</span>
                <span class="user-email">({{ user.email || '无邮箱' }})</span>
              </div>
            </t-option>
          </t-select>

          <!-- 空间选择 -->
          <t-select
            v-else-if="filter.field === 'spaceId'"
            v-model="filter.value"
            placeholder="请选择空间"
            clearable
            size="small"
          >
            <t-option
              v-for="space in spaceList"
              :key="space.id"
              :value="space.id"
              :label="space.name"
            >
              <div class="space-option">
                <t-icon :name="space.icon || 'layers'" size="16px" />
                <span>{{ space.name }}</span>
                <t-tag v-if="space.keyword" variant="light" size="small">
                  {{ space.keyword }}
                </t-tag>
              </div>
            </t-option>
          </t-select>

          <!-- 日期范围选择 -->
          <t-date-range-picker
            v-else-if="filter.field === 'dateRange'"
            v-model="filter.value"
            placeholder="选择日期范围"
            clearable
            size="small"
            enable-time-picker
          />
        </div>

        <!-- 删除按钮 -->
        <t-button
          theme="default"
          variant="text"
          size="small"
          shape="circle"
          @click="handleRemoveFilter(index)"
          class="filter-remove-btn"
        >
          <template #icon>
            <t-icon name="close" />
          </template>
        </t-button>
      </div>

      <!-- 空状态 -->
      <div v-if="localFilterConditions.length === 0" class="filter-empty">
        <t-icon name="filter-clear" size="48px" class="empty-icon" />
        <p class="empty-text">暂无筛选条件</p>
        <t-button theme="primary" variant="dashed" size="small" @click="handleAddFilter">
          <template #icon>
            <t-icon name="add" />
          </template>
          添加条件
        </t-button>
      </div>
    </div>

    <!-- 底部操作区 -->
    <div class="filter-footer">
      <t-button
        theme="primary"
        variant="dashed"
        size="small"
        @click="handleAddFilter"
      >
        <template #icon>
          <t-icon name="add" />
        </template>
        添加条件
      </t-button>

      <div v-if="filteredCount !== null" class="filter-result">
        共筛选出 <span class="highlight">{{ filteredCount }}</span> 个事项
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const props = defineProps({
  filterConditions: {
    type: Array,
    default: () => []
  },
  filteredCount: {
    type: Number,
    default: null
  },
  userList: {
    type: Array,
    default: () => []
  },
  spaceList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filterConditions', 'apply'])

// 本地筛选条件
const localFilterConditions = ref([...props.filterConditions])
let filterIdCounter = props.filterConditions.length || 0

// 监听外部条件变化
watch(() => props.filterConditions, (val) => {
  localFilterConditions.value = [...val]
}, { deep: true })

// 筛选字段配置
const filterFields = [
  { label: '关键词搜索', value: 'keyword', icon: 'search' },
  { label: '事项类型', value: 'issueType', icon: 'view-module' },
  { label: '状态', value: 'status', icon: 'task' },
  { label: '优先级', value: 'priority', icon: 'flag' },
  { label: '经办人', value: 'assigneeId', icon: 'user' },
  { label: '空间', value: 'spaceId', icon: 'layers' },
  { label: '日期范围', value: 'dateRange', icon: 'calendar' }
]

// 事项类型选项
const issueTypeOptions = [
  { label: '任务', value: 1, icon: 'task' },
  { label: 'Bug', value: 2, icon: 'bug' },
  { label: '需求', value: 3, icon: 'lightbulb' },
  { label: '线上问题', value: 4, icon: 'error-circle' }
]

// 状态选项
const statusOptions = [
  { label: '待处理', value: 1, theme: 'default' },
  { label: '进行中', value: 2, theme: 'warning' },
  { label: '已完成', value: 3, theme: 'success' },
  { label: '已关闭', value: 0, theme: 'default' }
]

// 优先级选项
const priorityOptions = [
  { label: '高', value: 1, theme: 'danger' },
  { label: '中', value: 2, theme: 'warning' },
  { label: '低', value: 3, theme: 'success' }
]

// 计算激活的筛选条件数量
const activeFilterCount = computed(() => {
  return localFilterConditions.value.filter(f => f.value !== '' && f.value !== null && f.value !== undefined).length
})

// 添加筛选条件
const handleAddFilter = () => {
  localFilterConditions.value.push({
    id: filterIdCounter++,
    field: 'keyword',
    value: ''
  })
}

// 删除筛选条件
const handleRemoveFilter = (index) => {
  localFilterConditions.value.splice(index, 1)
  MessagePlugin.success('已删除筛选条件')
}

// 重置筛选器
const handleResetFilters = () => {
  localFilterConditions.value = []
  MessagePlugin.success('已重置筛选条件')
}

// 应用筛选器
const handleApplyFilter = () => {
  emit('update:filterConditions', localFilterConditions.value)
  emit('apply', localFilterConditions.value)
  MessagePlugin.success('筛选条件已应用')
}
</script>

<style scoped lang="scss">
.issue-filter {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  // 筛选器标题栏
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #f9fafb 100%);
    border-bottom: 1px solid #e7e7e7;

    .filter-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #1f2329;

      .title-icon {
        color: #0052d9;
      }
    }

    .filter-actions {
      display: flex;
      gap: 8px;
    }
  }

  // 筛选条件列表
  .filter-list {
    padding: 20px;
    min-height: 200px;
    max-height: 500px;
    overflow-y: auto;

    .filter-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 12px;
      background: #f9fafb;
      border: 1px solid #e7e7e7;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: #f5f7fa;
        border-color: #d4d8dd;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }

      &.has-value {
        background: #e8f3ff;
        border-color: #b5d6ff;

        &:hover {
          background: #d9ebff;
          border-color: #96c7ff;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }

      .filter-field-select {
        width: 150px;
        flex-shrink: 0;
      }

      .filter-value-input {
        flex: 1;
        min-width: 0;
      }

      .filter-remove-btn {
        flex-shrink: 0;
        opacity: 0.6;
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 1;
          color: #e34d59;
        }
      }
    }

    // 空状态
    .filter-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;

      .empty-icon {
        color: #bbbfc4;
        margin-bottom: 16px;
      }

      .empty-text {
        font-size: 14px;
        color: #646a73;
        margin-bottom: 20px;
      }
    }
  }

  // 底部操作区
  .filter-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #f9fafb;
    border-top: 1px solid #e7e7e7;

    .filter-result {
      font-size: 14px;
      color: #646a73;

      .highlight {
        color: #0052d9;
        font-weight: 600;
        font-size: 18px;
        margin: 0 4px;
      }
    }
  }
}

// 自定义选项样式
.field-option,
.type-option,
.user-option,
.space-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-option,
.priority-option {
  display: flex;
  align-items: center;
}

.user-option {
  .user-name {
    font-weight: 500;
    color: #1f2329;
  }

  .user-email {
    font-size: 12px;
    color: #8a8e99;
  }
}

.space-option {
  justify-content: space-between;
  width: 100%;
}

// 滚动条样式
.filter-list::-webkit-scrollbar {
  width: 6px;
}

.filter-list::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

.filter-list::-webkit-scrollbar-thumb {
  background: #d4d8dd;
  border-radius: 3px;

  &:hover {
    background: #bbbfc4;
  }
}
</style>
