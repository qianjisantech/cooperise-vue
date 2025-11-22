<template>
  <t-dialog
    v-model:visible="visible"
    :header="event?.title"
    width="500px"
  >
    <template #footer>
      <t-button theme="primary" @click="handleEdit">编辑</t-button>
      <t-button theme="default" @click="visible = false">关闭</t-button>
    </template>
    <div v-if="event" class="event-detail">
      <div class="detail-item">
        <label>时间</label>
        <div class="detail-value">
          <t-icon name="time" size="14px" />
          <span v-if="event.allDay">全天</span>
          <span v-else>
            {{ event.startDate }}
            {{ event.startTime }} - {{ event.endTime }}
          </span>
        </div>
      </div>

      <div v-if="event.location" class="detail-item">
        <label>地点</label>
        <div class="detail-value">
          <t-icon name="location" size="14px" />
          {{ event.location }}
        </div>
      </div>

      <div class="detail-item">
        <label>负责人</label>
        <div class="detail-value">
          <t-avatar size="20px">{{ event.assignee?.charAt(0) }}</t-avatar>
          {{ event.assignee }}
        </div>
      </div>

      <div class="detail-item">
        <label>优先级</label>
        <div class="detail-value">
          <t-tag :theme="getPriorityTheme(event.priority)">
            {{ event.priority }}
          </t-tag>
        </div>
      </div>

      <div v-if="event.tags && event.tags.length" class="detail-item">
        <label>标签</label>
        <div class="detail-value tags">
          <t-tag
            v-for="tag in event.tags"
            :key="tag"
            size="small"
            variant="outline"
          >
            {{ tag }}
          </t-tag>
        </div>
      </div>

      <div v-if="event.participants && event.participants.length" class="detail-item">
        <label>参与人员</label>
        <div class="detail-value participants">
          <t-avatar
            v-for="participant in event.participants"
            :key="participant"
            size="24px"
          >
            {{ participant.charAt(0) }}
          </t-avatar>
        </div>
      </div>

      <div v-if="event.description" class="detail-item">
        <label>描述</label>
        <div class="detail-value">{{ event.description }}</div>
      </div>

      <div class="detail-item">
        <label>状态</label>
        <div class="detail-value">
          <t-tag :theme="getStatusTheme(event.status)">
            {{ getStatusText(event.status) }}
          </t-tag>
        </div>
      </div>
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

const emit = defineEmits(['update:modelValue', 'edit'])

const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  visible.value = val
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

const getStatusTheme = (status) => {
  const themeMap = {
    'pending': 'default',
    'in-progress': 'primary',
    'completed': 'success'
  }
  return themeMap[status] || 'default'
}

const getStatusText = (status) => {
  const textMap = {
    'pending': '未开始',
    'in-progress': '进行中',
    'completed': '已完成'
  }
  return textMap[status] || status
}

const handleEdit = () => {
  emit('edit', props.event)
  visible.value = false
}
</script>

<style scoped lang="scss">
.event-detail {
  .detail-item {
    margin-bottom: 16px;
    display: flex;
    gap: 12px;

    label {
      min-width: 70px;
      font-weight: 500;
      color: #646a73;
      font-size: 13px;
    }

    .detail-value {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #1f2329;

      &.tags,
      &.participants {
        flex-wrap: wrap;
      }
    }
  }
}
</style>
