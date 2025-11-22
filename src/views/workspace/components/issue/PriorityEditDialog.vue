<template>
  <t-dialog
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    header="修改优先级"
    width="480px"
    :footer="false"
    :close-on-overlay-click="false"
  >
    <div class="priority-edit-form">
      <t-form label-align="left" label-width="80px">
        <t-form-item label="当前优先级" name="currentPriority">
          <div class="current-priority-display">
            <t-tag
              :theme="getPriorityTheme(currentIssue?.priority)"
              size="medium"
            >
              {{ currentIssue?.priority }}
            </t-tag>
          </div>
        </t-form-item>

        <t-form-item label="新优先级" name="newPriority">
          <t-select
            v-model="localSelectedPriority"
            placeholder="请选择优先级"
            clearable
          >
            <t-option
              v-for="priority in priorityOptions"
              :key="priority.value"
              :value="priority.value"
              :label="priority.label"
            />
          </t-select>
        </t-form-item>
      </t-form>

      <div class="dialog-footer">
        <t-button theme="default" variant="outline" @click="handleCancel">
          取消
        </t-button>
        <t-button theme="primary" @click="handleConfirm">
          确定
        </t-button>
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
  currentIssue: {
    type: Object,
    default: null
  },
  priorityOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)
const localSelectedPriority = ref('')

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    localSelectedPriority.value = props.currentIssue?.priority || ''
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const getPriorityTheme = (priority) => {
  const themeMap = {
    '高': 'danger',
    '中': 'warning',
    '低': 'success'
  }
  return themeMap[priority] || 'default'
}

const handleCancel = () => {
  visible.value = false
}

const handleConfirm = () => {
  if (!localSelectedPriority.value) {
    MessagePlugin.warning('请选择新优先级')
    return
  }
  emit('confirm', localSelectedPriority.value)
  visible.value = false
}
</script>

<style scoped lang="scss">
.priority-edit-form {
  padding: 20px 0;

  .current-priority-display {
    display: flex;
    align-items: center;
    height: 32px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e7e7e7;
  }
}
</style>
