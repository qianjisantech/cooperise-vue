<template>
  <div class="action-buttons">
    <t-button theme="primary" size="medium" @click="emit('edit')">
      编辑
    </t-button>
    <t-button v-if="issueType === '需求'" theme="default" size="medium" @click="emit('split-task')">
      拆分任务
    </t-button>
    <t-button theme="default" size="medium" @click="emit('assign')">
      分配
    </t-button>
    <t-button theme="default" size="medium" @click="emit('pause')">
      暂停
    </t-button>
    <t-dropdown @click="handleDropdownClick">
      <t-button theme="default" size="medium">
        更多操作
      </t-button>
      <t-dropdown-menu>
        <t-dropdown-item value="copy">复制链接</t-dropdown-item>
        <t-dropdown-item value="delete">删除</t-dropdown-item>
      </t-dropdown-menu>
    </t-dropdown>
  </div>
</template>

<script setup>
const props = defineProps({
  issueType: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['edit', 'split-task', 'assign', 'pause', 'more-action'])

const handleDropdownClick = (data) => {
  emit('more-action', data.value)
}
</script>

<style scoped lang="scss">
.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e7e7e7;

  :deep(.t-button) {
    transition: all 0.2s;

    // 默认按钮浅灰色背景
    &.t-button--variant-base.t-button--theme-default {
      background-color: #f5f7fa;
      border-color: #f5f7fa;

      &:hover {
        background-color: #e8eaed;
        border-color: #e8eaed;
      }
    }

    &:hover {
      transform: translateY(-1px);
    }
  }
}
</style>
