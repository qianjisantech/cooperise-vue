<template>
  <t-dialog
    v-model:visible="visible"
    header="新建视图"
    width="520px"
    :footer="false"
    :close-on-overlay-click="false"
  >
    <div class="create-view-form">
      <t-form :data="localForm" label-align="left" label-width="80px">
        <t-form-item label="视图名称" name="viewName">
          <t-input
            v-model="localForm.viewName"
            placeholder="请输入视图名称"
            clearable
          />
        </t-form-item>

        <t-form-item label="视图类型" name="viewType">
          <div class="view-type-grid">
            <div
              v-for="type in viewTypeOptions"
              :key="type.value"
              class="view-type-card"
              :class="{ 'is-selected': localForm.viewType === type.value }"
              @click="localForm.viewType = type.value"
            >
              <div class="view-type-icon">
                <t-icon :name="type.icon" size="32px" />
              </div>
              <div class="view-type-label">{{ type.label }}</div>
              <div class="view-type-desc">{{ type.description }}</div>
            </div>
          </div>
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
  viewName: '',
  viewType: ''
})

const viewTypeOptions = [
  {
    value: 'list',
    label: '列表',
    icon: 'view-list',
    description: '以表格形式查看事项'
  },
  {
    value: 'gantt',
    label: '甘特图',
    icon: 'chart-bar',
    description: '时间线视图展示任务进度'
  },
  {
    value: 'resource',
    label: '资源',
    icon: 'user-circle',
    description: '按资源维度查看分配情况'
  },
  {
    value: 'board',
    label: '看板',
    icon: 'view-module',
    description: '卡片式看板拖拽管理'
  },
  {
    value: 'calendar',
    label: '日历',
    icon: 'calendar',
    description: '日历视图规划事项'
  }
]

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
    viewName: '',
    viewType: ''
  }
}

const handleCancel = () => {
  visible.value = false
  resetForm()
}

const handleSubmit = () => {
  if (!localForm.value.viewName) {
    MessagePlugin.warning('请输入视图名称')
    return
  }
  if (!localForm.value.viewType) {
    MessagePlugin.warning('请选择视图类型')
    return
  }

  emit('submit', { ...localForm.value })
  visible.value = false
}
</script>

<style scoped lang="scss">
.create-view-form {
  .view-type-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 12px;
  }

  .view-type-card {
    padding: 16px;
    border: 2px solid #e7e7e7;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;

    &:hover {
      border-color: #0052d9;
      background-color: #f0f5ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 82, 217, 0.15);
    }

    &.is-selected {
      border-color: #0052d9;
      background-color: #e6f2ff;
      box-shadow: 0 4px 12px rgba(0, 82, 217, 0.2);
    }

    .view-type-icon {
      color: #646a73;
      margin-bottom: 8px;
    }

    .view-type-label {
      font-size: 14px;
      font-weight: 600;
      color: #1f2329;
      margin-bottom: 4px;
    }

    .view-type-desc {
      font-size: 12px;
      color: #8a8e99;
      line-height: 1.4;
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
