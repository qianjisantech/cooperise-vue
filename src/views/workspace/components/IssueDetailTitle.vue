<template>
  <div class="task-title-section">
    <!-- 编辑模式：输入框 -->
    <t-input
      v-if="isEditingTitle"
      v-model="localSummary"
      class="task-title-input"
      placeholder="输入事项标题"
      :bordered="false"
      :maxlength="255"
      show-word-limit
      autofocus
      @blur="handleBlur"
      @keyup.enter="handleBlur"
      @keyup.esc="handleCancel"
    />
    <!-- 非编辑模式：文字 + 编辑图标 -->
    <div v-else class="task-title-display">
      <h2 class="task-title-text">{{ summary }}</h2>
      <t-icon
        name="edit"
        size="18px"
        class="title-edit-icon"
        @click="startEdit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  summary: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:summary'])

const isEditingTitle = ref(false)
const localSummary = ref(props.summary)

watch(() => props.summary, (newVal) => {
  localSummary.value = newVal
})

const startEdit = () => {
  localSummary.value = props.summary
  isEditingTitle.value = true
}

const handleBlur = () => {
  isEditingTitle.value = false
  if (localSummary.value !== props.summary) {
    emit('update:summary', localSummary.value)
  }
}

const handleCancel = () => {
  localSummary.value = props.summary
  isEditingTitle.value = false
}
</script>

<style scoped lang="scss">
.task-title-section {
  margin-bottom: 24px;

  .task-title-input {
    :deep(.t-input__inner) {
      font-size: 20px;
      font-weight: 600;
      color: #1f2329;
    }

    :deep(.t-input__limit) {
      font-size: 12px;
      color: #8f959e;
      margin-top: 4px;
    }
  }

  .task-title-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;

    .title-edit-icon {
      color: #646a73;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s;
      flex-shrink: 0;

      &:hover {
        color: #0052d9;
        transform: scale(1.1);
      }
    }

    .task-title-text {
      font-size: 20px;
      font-weight: 600;
      color: #1f2329;
      margin: 0;
    }

    &:hover {
      .title-edit-icon {
        opacity: 1;
      }
    }
  }
}
</style>
