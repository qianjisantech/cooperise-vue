<template>
  <t-dialog
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    header="拆分任务"
    width="900px"
    :footer="false"
    :close-on-overlay-click="false"
    placement="center"
    @close="handleClose"
  >
    <div class="split-task-dialog">
      <!-- 需求信息 -->
      <div class="requirement-info">
        <h4 class="section-title">需求信息</h4>
        <div class="info-item">
          <span class="label">需求标题：</span>
          <span class="value">{{ splitTaskData.requirementSummary }}</span>
        </div>
        <div class="info-item">
          <span class="label">需求描述：</span>
          <div class="value description" v-html="splitTaskData.requirementDescription"></div>
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="tasks-section">
        <h4 class="section-title">拆分后的任务（共 {{ splitTaskData.tasks.length }} 个）</h4>
        <div class="tasks-list">
          <div
            v-for="(task, index) in splitTaskData.tasks"
            :key="index"
            class="task-card"
          >
            <div class="task-header">
              <span class="task-role">{{ task.roleName }}</span>
            </div>
            <div class="task-form">
              <div class="form-row">
                <div class="form-item full-width">
                  <label>任务标题</label>
                  <t-input
                    v-model="task.summary"
                    placeholder="请输入任务标题"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-item">
                  <label>负责人</label>
                  <t-select
                    v-model="task.assignee"
                    placeholder="请选择负责人"
                    clearable
                  >
                    <t-option
                      v-for="assignee in assigneeOptions"
                      :key="assignee.value"
                      :value="assignee.value"
                      :label="assignee.label"
                    />
                  </t-select>
                </div>
                <div class="form-item">
                  <label>优先级</label>
                  <t-select
                    v-model="task.priority"
                    placeholder="请选择优先级"
                  >
                    <t-option
                      v-for="priority in priorityOptions"
                      :key="priority.value"
                      :value="priority.value"
                      :label="priority.label"
                    />
                  </t-select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-item">
                  <label>排期时间</label>
                  <t-date-range-picker
                    v-model="task.dateRange"
                    placeholder="选择开始和结束日期"
                    clearable
                  />
                </div>
                <div class="form-item">
                  <label>预估工时（小时）</label>
                  <t-input-number
                    v-model="task.estimatedHours"
                    placeholder="请输入预估工时"
                    :min="0"
                    :step="0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="dialog-footer">
        <t-button theme="default" variant="outline" @click="handleCancel">
          取消
        </t-button>
        <t-button theme="primary" @click="handleConfirm">
          确认拆分
        </t-button>
      </div>
    </div>
  </t-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  splitTaskData: {
    type: Object,
    default: () => ({
      requirementSummary: '',
      requirementDescription: '',
      tasks: []
    })
  },
  assigneeOptions: {
    type: Array,
    default: () => []
  },
  priorityOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

const handleClose = () => {
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped lang="scss">
.split-task-dialog {
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #0052d9;
  }

  .requirement-info {
    margin-bottom: 24px;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 6px;

    .info-item {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        font-size: 14px;
        font-weight: 500;
        color: #646a73;
        margin-right: 8px;
      }

      .value {
        font-size: 14px;
        color: #1f2329;

        &.description {
          margin-top: 8px;
          padding: 12px;
          background-color: #fff;
          border-radius: 4px;
          line-height: 1.6;
          max-height: 120px;
          overflow-y: auto;
        }
      }
    }
  }

  .tasks-section {
    margin-bottom: 24px;

    .tasks-list {
      max-height: 500px;
      overflow-y: auto;
      padding-right: 8px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #dcdcdc;
        border-radius: 3px;

        &:hover {
          background-color: #bbb;
        }
      }
    }

    .task-card {
      margin-bottom: 16px;
      padding: 16px;
      background-color: #fff;
      border: 1px solid #e7e7e7;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

      &:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
        transform: translateY(-1px);
      }

      .task-header {
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e7e7e7;

        .task-role {
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
        }
      }

      .task-form {
        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          .form-item {
            flex: 1;
            display: flex;
            flex-direction: column;

            &.full-width {
              flex: 1 1 100%;
            }

            label {
              font-size: 13px;
              font-weight: 500;
              color: #646a73;
              margin-bottom: 6px;
            }

            :deep(.t-input),
            :deep(.t-select),
            :deep(.t-date-range-picker),
            :deep(.t-input-number) {
              width: 100%;
            }
          }
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e7e7e7;
  }
}
</style>
