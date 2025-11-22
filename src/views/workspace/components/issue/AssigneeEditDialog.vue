<template>
  <t-dialog
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    header="修改经办人"
    width="480px"
    :footer="false"
    :close-on-overlay-click="false"
  >
    <div class="assignee-edit-form">
      <t-form label-align="left" label-width="80px">
        <t-form-item label="当前经办人" name="currentAssignee">
          <div class="current-assignee-display">
            <span>{{ currentIssue?.assignee }}</span>
          </div>
        </t-form-item>

        <t-form-item label="新经办人" name="newAssignee">
          <t-select
            v-model="localSelectedAssignee"
            placeholder="请选择经办人"
            clearable
          >
            <t-option
              v-for="assignee in assigneeOptions"
              :key="assignee.value"
              :value="assignee.value"
              :label="assignee.label"
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
  assigneeOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)
const localSelectedAssignee = ref('')

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    localSelectedAssignee.value = props.currentIssue?.assignee || ''
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleCancel = () => {
  visible.value = false
}

const handleConfirm = () => {
  if (!localSelectedAssignee.value) {
    MessagePlugin.warning('请选择新经办人')
    return
  }
  emit('confirm', localSelectedAssignee.value)
  visible.value = false
}
</script>

<style scoped lang="scss">
.assignee-edit-form {
  padding: 20px 0;

  .current-assignee-display {
    display: flex;
    align-items: center;
    height: 32px;
    font-size: 14px;
    color: #1f2329;
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
