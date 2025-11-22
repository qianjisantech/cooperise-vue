<template>
  <t-dialog
    :visible="visible"
    :header="isEditMode ? '编辑反馈' : '新建反馈'"
    width="700px"
    :footer="false"
    @close="$emit('update:visible', false)"
  >
    <div class="new-feedback-form">
      <div class="form-group">
        <label class="form-label">标题 <span class="required">*</span></label>
        <t-input
          :model-value="feedback.title"
          placeholder="简要描述您的反馈"
          size="large"
          @update:model-value="$emit('update:feedback', { ...feedback, title: $event })"
        />
      </div>

      <div class="form-group">
        <label class="form-label">类型 <span class="required">*</span></label>
        <div class="type-card-group">
          <div
            v-for="typeOption in feedbackTypeOptions"
            :key="typeOption.value"
            class="type-card"
            :class="{ active: feedback.type === typeOption.value }"
            @click="$emit('update:feedback', { ...feedback, type: typeOption.value })"
          >
            <div class="type-card-icon" :style="{ color: typeOption.color }">
              <t-icon :name="typeOption.icon" size="24px" />
            </div>
            <div class="type-card-content">
              <div class="type-card-title">{{ typeOption.label }}</div>
              <div class="type-card-desc">{{ typeOption.description }}</div>
            </div>
            <div class="type-card-check">
              <t-icon name="check-circle-filled" size="20px" />
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">详细描述 <span class="required">*</span></label>
        <t-textarea
          :model-value="feedback.content"
          placeholder="请详细描述您遇到的问题或建议..."
          :autosize="{ minRows: 8, maxRows: 16 }"
          @update:model-value="$emit('update:feedback', { ...feedback, content: $event })"
        />
        <div class="form-tip">支持 Markdown 格式</div>
      </div>

      <div class="form-group">
        <label class="form-label">联系方式（可选）</label>
        <t-input
          :model-value="feedback.contactInfo"
          placeholder="邮箱或电话，方便我们与您联系"
          @update:model-value="$emit('update:feedback', { ...feedback, contactInfo: $event })"
        />
      </div>

      <div class="form-actions">
        <t-button theme="default" variant="outline" @click="$emit('cancel')">
          取消
        </t-button>
        <t-button theme="primary" @click="$emit('submit')">
          {{ isEditMode ? '保存' : '提交' }}
        </t-button>
      </div>
    </div>
  </t-dialog>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isEditMode: {
    type: Boolean,
    default: false
  },
  feedback: {
    type: Object,
    required: true
  },
  feedbackTypeOptions: {
    type: Array,
    default: () => [
      {
        value: 'bug',
        label: '问题反馈',
        description: '报告系统存在的问题或错误',
        icon: 'bug',
        color: '#e34d59'
      },
      {
        value: 'feature',
        label: '功能建议',
        description: '建议添加新的功能特性',
        icon: 'lightbulb',
        color: '#0052d9'
      },
      {
        value: 'improvement',
        label: '改进建议',
        description: '对现有功能的改进意见',
        icon: 'chart-bubble',
        color: '#29cc85'
      },
      {
        value: 'other',
        label: '其他',
        description: '其他类型的反馈',
        icon: 'chat',
        color: '#646a73'
      }
    ]
  }
})

defineEmits(['update:visible', 'update:feedback', 'submit', 'cancel'])
</script>

<style scoped lang="scss">
.new-feedback-form {
  .form-group {
    margin-bottom: 24px;

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #1f2329;
      margin-bottom: 8px;

      .required {
        color: #e34d59;
      }
    }

    .form-tip {
      margin-top: 6px;
      font-size: 12px;
      color: #8f959e;
    }

    .type-card-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;

      .type-card {
        position: relative;
        display: flex;
        gap: 12px;
        padding: 16px;
        border: 2px solid #e7e7e7;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        background: #ffffff;

        &:hover {
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
        }

        &.active {
          border-color: #667eea;
          background: #f5f7ff;

          .type-card-check {
            opacity: 1;
          }
        }

        .type-card-icon {
          flex-shrink: 0;
        }

        .type-card-content {
          flex: 1;

          .type-card-title {
            font-size: 14px;
            font-weight: 600;
            color: #1f2329;
            margin-bottom: 4px;
          }

          .type-card-desc {
            font-size: 12px;
            color: #8f959e;
            line-height: 1.4;
          }
        }

        .type-card-check {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #667eea;
          opacity: 0;
          transition: opacity 0.3s;
        }
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #e7e7e7;
  }
}
</style>
