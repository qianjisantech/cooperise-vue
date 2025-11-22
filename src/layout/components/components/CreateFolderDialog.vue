<template>
  <t-dialog
    v-model:visible="visible"
    header="新建文件夹"
    width="420px"
    :footer="false"
    :close-on-overlay-click="false"
  >
    <div class="create-folder-form">
      <t-form :data="localForm" label-align="left" label-width="80px">
        <t-form-item label="文件夹名称" name="folderName">
          <t-input
            v-model="localForm.folderName"
            placeholder="请输入文件夹名称"
            clearable
            autofocus
          />
        </t-form-item>
      </t-form>

      <div class="dialog-footer">
        <t-button theme="default" variant="outline" @click="handleCancel">
          取消
        </t-button>
        <t-button theme="primary" @click="handleSubmit">
          创建
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
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
const localForm = ref({
  folderName: ''
})

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    resetForm()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const resetForm = () => {
  localForm.value = {
    folderName: ''
  }
}

const handleCancel = () => {
  visible.value = false
  resetForm()
}

const handleSubmit = () => {
  if (!localForm.value.folderName) {
    MessagePlugin.warning('请输入文件夹名称')
    return
  }

  emit('submit', { ...localForm.value })
  visible.value = false
}
</script>

<style scoped lang="scss">
.create-folder-form {
  :deep(.t-form-item) {
    margin-bottom: 20px;
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
