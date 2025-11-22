<template>
  <t-dialog
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    header="修改状态"
    width="480px"
    :footer="false"
    :close-on-overlay-click="false"
  >
    <div class="status-edit-form">
      <t-form label-align="left" label-width="80px">
        <t-form-item label="当前状态" name="currentStatus">
          <div class="current-status-display">
            <t-tag
              :theme="getStatusTheme(currentIssue?.status)"
              size="medium"
            >
              {{ currentIssue?.status }}
            </t-tag>
          </div>
        </t-form-item>

        <t-form-item label="新状态" name="newStatus">
          <t-select
            v-model="localSelectedStatus"
            placeholder="请选择状态"
            clearable
          >
            <t-option
              v-for="status in statusOptions"
              :key="status.value"
              :value="status.value"
              :label="status.label"
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
  statusOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)
const localSelectedStatus = ref('')

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    localSelectedStatus.value = props.currentIssue?.status || ''
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const getStatusTheme = (status) => {
  const themeMap = {
    '1': 'default',
    '2': 'primary',
    '3': 'success',
    '0': 'default'
  }
  return themeMap[status] || 'default'
}

const handleCancel = () => {
  visible.value = false
}

const handleConfirm = () => {
  if (!localSelectedStatus.value) {
    MessagePlugin.warning('请选择新状态')
    return
  }
  emit('confirm', localSelectedStatus.value)
  visible.value = false
}
</script>

<style scoped lang="scss">
.status-edit-form {
  padding: 20px 0;

  .current-status-display {
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
