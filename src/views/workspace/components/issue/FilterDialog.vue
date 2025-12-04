<template>
  <t-dialog
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    header="筛选器"
    width="600px"
    :footer="false"
  >
    <div class="filter-dialog-content">
      <div class="filter-list">
        <div v-for="(filter, index) in localFilterConditions" :key="filter.id" class="filter-item">
          <t-select
            v-model="filter.field"
            placeholder="选择字段"
            size="small"
            class="filter-field"
          >
            <t-option label="搜索" value="keyword" />
            <t-option label="事项类型" value="issue_type" />
            <t-option label="状态" value="status" />
            <t-option label="优先级" value="priority" />
            <t-option label="经办人" value="assignee" />
          </t-select>

          <!-- 搜索框 -->
          <t-input
            v-if="filter.field === 'keyword'"
            v-model="filter.value"
            placeholder="搜索事项概要或单号..."
            clearable
            size="small"
            class="filter-value"
          >
            <template #prefix-icon>
              <t-icon name="search" />
            </template>
          </t-input>

          <!-- 任务类型选择 -->
          <t-select
            v-else-if="filter.field === 'issue_type'"
            v-model="filter.value"
            placeholder="请选择"
            clearable
            size="small"
            class="filter-value"
          >
            <t-option label="任务" value="任务" />
            <t-option label="bug" value="bug" />
            <t-option label="需求" value="需求" />
            <t-option label="线上问题" value="线上问题" />
          </t-select>

          <!-- 状态选择 -->
          <t-select
            v-else-if="filter.field === 'status'"
            v-model="filter.value"
            placeholder="请选择"
            clearable
            size="small"
            class="filter-value"
          >
            <t-option label="待处理" value="1" />
            <t-option label="进行中" value="2" />
            <t-option label="待审核" value="3" />
            <t-option label="已完成" value="0" />
          </t-select>

          <!-- 优先级选择 -->
          <t-select
            v-else-if="filter.field === 'priority'"
            v-model="filter.value"
            placeholder="请选择"
            clearable
            size="small"
            class="filter-value"
          >
            <t-option label="高" value="高" />
            <t-option label="中" value="中" />
            <t-option label="低" value="低" />
          </t-select>

          <!-- 经办人选择 -->
          <t-select
            v-else-if="filter.field === 'assignee'"
            v-model="filter.value"
            placeholder="请选择"
            clearable
            size="small"
            class="filter-value"
          >
            <t-option label="张三" value="张三" />
            <t-option label="李四" value="李四" />
            <t-option label="王五" value="王五" />
            <t-option label="赵六" value="赵六" />
            <t-option label="孙七" value="孙七" />
          </t-select>

          <!-- 删除按钮 -->
          <t-button
            theme="default"
            variant="text"
            size="small"
            @click="handleRemoveFilter(index)"
            class="filter-remove"
          >
            <template #icon>
              <t-icon name="close" />
            </template>
          </t-button>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="filter-actions">
        <div class="actions-left">
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
          <t-button
            theme="default"
            variant="outline"
            size="small"
            @click="handleResetFilters"
          >
            <template #icon>
              <t-icon name="refresh" />
            </template>
            重置
          </t-button>
        </div>
        <t-button
          theme="primary"
          size="small"
          @click="handleSaveFilter"
        >
          <template #icon>
            <t-icon name="check" />
          </template>
          保存
        </t-button>
      </div>

      <!-- 结果统计 -->
      <div class="filter-result">
        共筛选出 <span class="highlight">{{ filteredCount }}</span> 个事项
      </div>
    </div>
  </t-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  filterConditions: {
    type: Array,
    default: () => []
  },
  filteredCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'update:filterConditions'])

const visible = ref(props.modelValue)
const localFilterConditions = ref([...props.filterConditions])
let filterIdCounter = props.filterConditions.length

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    localFilterConditions.value = [...props.filterConditions]
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.filterConditions, (val) => {
  localFilterConditions.value = [...val]
}, { deep: true })

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
  if (localFilterConditions.value.length === 1) {
    MessagePlugin.warning('至少保留一个筛选条件')
    return
  }
  localFilterConditions.value.splice(index, 1)
  MessagePlugin.success('已删除筛选条件')
}

// 重置筛选器
const handleResetFilters = () => {
  localFilterConditions.value = [
    { id: filterIdCounter++, field: 'keyword', value: '' }
  ]
  MessagePlugin.success('已重置筛选条件')
}

// 保存筛选器
const handleSaveFilter = () => {
  emit('update:filterConditions', localFilterConditions.value)
  visible.value = false
  MessagePlugin.success('筛选条件已应用')
}
</script>

<style scoped lang="scss">
.filter-dialog-content {
  .filter-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;

    .filter-item {
      display: flex;
      align-items: center;
      gap: 12px;

      .filter-field {
        width: 140px;
      }

      .filter-value {
        flex: 1;
      }

      .filter-remove {
        flex-shrink: 0;
      }
    }
  }

  .filter-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-top: 1px solid #e7e7e7;
    border-bottom: 1px solid #e7e7e7;

    .actions-left {
      display: flex;
      gap: 8px;
    }
  }

  .filter-result {
    margin-top: 16px;
    font-size: 14px;
    color: #646a73;

    .highlight {
      color: #0052d9;
      font-weight: 600;
    }
  }
}
</style>
