<template>
  <t-dialog
    v-model:visible="visible"
    header="编辑事项"
    width="800px"
    @confirm="handleSave"
  >
    <div v-if="localEvent" class="edit-event-dialog">
      <!-- 顶部：空间和事项类型 -->
      <div class="event-top-info">
        <t-form-item label="空间">
          <t-select v-model="localEvent.space" placeholder="请选择空间">
            <t-option value="项目A" label="项目A" />
            <t-option value="项目B" label="项目B" />
            <t-option value="项目C" label="项目C" />
          </t-select>
        </t-form-item>
        <t-form-item label="事项类型">
          <t-select v-model="localEvent.type" placeholder="请选择事项类型">
            <t-option value="需求" label="需求" />
            <t-option value="任务" label="任务" />
            <t-option value="缺陷" label="缺陷" />
          </t-select>
        </t-form-item>
      </div>

      <!-- Tab 页面 -->
      <t-tabs v-model="activeTab" class="event-tabs">
        <!-- 基本信息 -->
        <t-tab-panel value="basic" label="基本信息">
          <div class="tab-content">
            <t-form-item label="事项标题">
              <t-input v-model="localEvent.title" placeholder="请输入事项标题" />
            </t-form-item>
            <t-form-item label="优先级">
              <t-select v-model="localEvent.priority" placeholder="请选择优先级">
                <t-option value="高" label="高" />
                <t-option value="中" label="中" />
                <t-option value="低" label="低" />
              </t-select>
            </t-form-item>
            <t-form-item label="状态">
              <t-select v-model="localEvent.status" placeholder="请选择状态">
                <t-option value="pending" label="未开始" />
                <t-option value="in-progress" label="进行中" />
                <t-option value="completed" label="已完成" />
              </t-select>
            </t-form-item>
            <t-form-item label="描述">
              <t-textarea v-model="localEvent.description" placeholder="请输入描述" :autosize="{ minRows: 3, maxRows: 6 }" />
            </t-form-item>
          </div>
        </t-tab-panel>

        <!-- 人员 -->
        <t-tab-panel value="people" label="人员">
          <div class="tab-content">
            <t-form-item label="负责人">
              <t-select v-model="localEvent.assignee" placeholder="请选择负责人">
                <t-option value="Admin" label="Admin" />
                <t-option value="Tester1" label="Tester1" />
                <t-option value="Tester2" label="Tester2" />
                <t-option value="Developer1" label="Developer1" />
                <t-option value="Developer2" label="Developer2" />
              </t-select>
            </t-form-item>
            <t-form-item label="参与人员">
              <t-select v-model="localEvent.participants" placeholder="请选择参与人员" multiple>
                <t-option value="Admin" label="Admin" />
                <t-option value="Tester1" label="Tester1" />
                <t-option value="Tester2" label="Tester2" />
                <t-option value="Developer1" label="Developer1" />
                <t-option value="Developer2" label="Developer2" />
              </t-select>
            </t-form-item>
          </div>
        </t-tab-panel>

        <!-- 日期 -->
        <t-tab-panel value="date" label="日期">
          <div class="tab-content">
            <t-form-item label="开始日期">
              <t-date-picker v-model="localEvent.startDate" placeholder="请选择开始日期" />
            </t-form-item>
            <t-form-item label="结束日期">
              <t-date-picker v-model="localEvent.endDate" placeholder="请选择结束日期" />
            </t-form-item>
            <t-form-item label="开始时间">
              <t-time-picker v-model="localEvent.startTime" placeholder="请选择开始时间" />
            </t-form-item>
            <t-form-item label="结束时间">
              <t-time-picker v-model="localEvent.endTime" placeholder="请选择结束时间" />
            </t-form-item>
            <t-form-item label="全天">
              <t-switch v-model="localEvent.allDay" />
            </t-form-item>
          </div>
        </t-tab-panel>

        <!-- 进展 -->
        <t-tab-panel value="progress" label="进展">
          <div class="tab-content">
            <t-form-item label="完成进度">
              <t-slider v-model="localEvent.progress" :min="0" :max="100" :step="5" />
              <span class="progress-value">{{ localEvent.progress }}%</span>
            </t-form-item>
            <t-form-item label="工作日志">
              <t-textarea v-model="localEvent.worklog" placeholder="记录工作进展" :autosize="{ minRows: 4, maxRows: 8 }" />
            </t-form-item>
          </div>
        </t-tab-panel>

        <!-- 排期 -->
        <t-tab-panel value="schedule" label="排期">
          <div class="tab-content">
            <t-form-item label="预计工时（小时）">
              <t-input-number v-model="localEvent.estimatedHours" :min="0" :step="0.5" placeholder="请输入预计工时" />
            </t-form-item>
            <t-form-item label="实际工时（小时）">
              <t-input-number v-model="localEvent.actualHours" :min="0" :step="0.5" placeholder="请输入实际工时" />
            </t-form-item>
            <t-form-item label="里程碑">
              <t-select v-model="localEvent.milestone" placeholder="请选择里程碑">
                <t-option value="V1.0" label="V1.0" />
                <t-option value="V1.1" label="V1.1" />
                <t-option value="V2.0" label="V2.0" />
              </t-select>
            </t-form-item>
            <t-form-item label="迭代">
              <t-select v-model="localEvent.sprint" placeholder="请选择迭代">
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
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  event: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const visible = ref(props.modelValue)
const activeTab = ref('basic')
const localEvent = ref(null)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.event) {
    localEvent.value = { ...props.event }
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleSave = () => {
  emit('save', localEvent.value)
  visible.value = false
}
</script>

<style scoped lang="scss">
.edit-event-dialog {
  .event-top-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .event-tabs {
    .tab-content {
      padding: 16px 0;

      :deep(.t-form-item) {
        margin-bottom: 20px;
      }

      .progress-value {
        margin-left: 12px;
        font-size: 14px;
        color: #0052d9;
        font-weight: 500;
      }
    }
  }
}
</style>
