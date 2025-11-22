<template>
  <t-dialog
    :visible="visible"
    header="编辑事项"
    width="800px"
    @confirm="handleConfirm"
    @close="handleClose"
    @update:visible="handleClose"
  >
    <div v-if="editingIssue" class="edit-issue-dialog">
      <!-- 顶部：空间和事项类型 -->
      <div class="issue-top-info">
        <t-form-item label="空间">
          <t-input disabled v-model="editingIssue.space" readonly class="readonly-field" />
        </t-form-item>
        <t-form-item label="事项类型">
          <t-input disabled v-model="editingIssue.issueType" readonly class="readonly-field" />
        </t-form-item>
      </div>

      <!-- Tab 页面 -->
      <t-tabs v-model="activeTab" class="issue-edit-tabs">
        <!-- 基本信息 -->
        <t-tab-panel value="basic" label="基本信息">
          <div class="tab-content">
            <t-form-item label="事项标题">
              <t-input v-model="editingIssue.summary" placeholder="请输入事项标题" />
            </t-form-item>
            <t-form-item label="优先级">
              <t-select v-model="editingIssue.priority" placeholder="请选择优先级">
                <t-option value="高" label="高" />
                <t-option value="中" label="中" />
                <t-option value="低" label="低" />
              </t-select>
            </t-form-item>
            <t-form-item label="状态">
              <t-select v-model="editingIssue.status" placeholder="请选择状态">
                <t-option value="1" label="待处理" />
                <t-option value="2" label="进行中" />
                <t-option value="3" label="已完成" />
                <t-option value="0" label="已关闭" />
              </t-select>
            </t-form-item>
            <t-form-item label="描述">
              <t-textarea v-model="editingIssue.description" placeholder="请输入描述" :autosize="{ minRows: 3, maxRows: 6 }" />
            </t-form-item>
          </div>
        </t-tab-panel>

        <!-- 人员 -->
        <t-tab-panel value="people" label="人员">
          <div class="tab-content">
            <t-form-item label="负责人">
              <t-select v-model="editingIssue.assignee" placeholder="请选择负责人">
                <t-option v-for="assignee in assigneeOptions" :key="assignee.value" :value="assignee.value" :label="assignee.label" />
              </t-select>
            </t-form-item>
            <t-form-item label="参与人员">
              <t-select v-model="editingIssue.participants" placeholder="请选择参与人员" multiple>
                <t-option v-for="assignee in assigneeOptions" :key="assignee.value" :value="assignee.value" :label="assignee.label" />
              </t-select>
            </t-form-item>
          </div>
        </t-tab-panel>

        <!-- 日期 -->
        <t-tab-panel value="date" label="日期">
          <div class="tab-content">
            <t-form-item label="开始日期">
              <t-date-picker v-model="editingIssue.startDate" placeholder="请选择开始日期" />
            </t-form-item>
            <t-form-item label="结束日期">
              <t-date-picker v-model="editingIssue.endDate" placeholder="请选择结束日期" />
            </t-form-item>
            <t-form-item label="截止日期">
              <t-date-picker v-model="editingIssue.dueDate" placeholder="请选择截止日期" />
            </t-form-item>
          </div>
        </t-tab-panel>

        <!-- 进展 -->
        <t-tab-panel value="progress" label="进展">
          <div class="tab-content">
            <t-form-item label="完成进度">
              <t-slider v-model="editingIssue.progress" :min="0" :max="100" :step="5" />
              <span class="progress-value">{{ editingIssue.progress }}%</span>
            </t-form-item>
            <t-form-item label="工作日志">
              <t-textarea v-model="editingIssue.worklog" placeholder="记录工作进展" :autosize="{ minRows: 4, maxRows: 8 }" />
            </t-form-item>
          </div>
        </t-tab-panel>

        <!-- 排期 -->
        <t-tab-panel value="schedule" label="排期">
          <div class="tab-content">
            <t-form-item label="预计工时（小时）">
              <t-input-number v-model="editingIssue.estimatedHours" :min="0" :step="0.5" placeholder="请输入预计工时" />
            </t-form-item>
            <t-form-item label="实际工时（小时）">
              <t-input-number v-model="editingIssue.actualHours" :min="0" :step="0.5" placeholder="请输入实际工时" />
            </t-form-item>
            <t-form-item label="里程碑">
              <t-select v-model="editingIssue.milestone" placeholder="请选择里程碑">
                <t-option value="V1.0" label="V1.0" />
                <t-option value="V1.1" label="V1.1" />
                <t-option value="V2.0" label="V2.0" />
              </t-select>
            </t-form-item>
            <t-form-item label="迭代">
              <t-select v-model="editingIssue.sprint" placeholder="请选择迭代">
                <t-option value="Sprint 1" label="Sprint 1" />
                <t-option value="Sprint 2" label="Sprint 2" />
                <t-option value="Sprint 3" label="Sprint 3" />
              </t-select>
            </t-form-item>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
  </t-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editingIssue: {
    type: Object,
    default: null
  },
  assigneeOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

const activeTab = ref('basic')

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  emit('confirm')
}

// 每次打开对话框时重置 tab 为基本信息
watch(() => props.visible, (newVal) => {
  if (newVal) {
    activeTab.value = 'basic'
  }
})
</script>

<style scoped lang="scss">
.edit-issue-dialog {
  .issue-top-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e7e7e7;
  }

  .issue-edit-tabs {
    .tab-content {
      padding: 16px 0;

      .t-form-item {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .progress-value {
        margin-left: 12px;
        font-size: 14px;
        font-weight: 600;
        color: #0052d9;
      }
    }
  }

  .readonly-field {
    :deep(.t-input) {
      background-color: #f5f5f5;
      color: #bbb;
      cursor: not-allowed;
    }
  }
}
</style>
