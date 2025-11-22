<template>
  <t-drawer
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    header="筛选器"
    size="480px"
    :footer="true"
    :close-on-overlay-click="false"
    destroy-on-close
  >
    <template #header>
      <div class="drawer-header">
        <div class="header-title">
          <t-icon name="filter" class="title-icon" />
          <span>高级筛选</span>
          <t-tag v-if="activeFilterCount > 0" theme="primary" variant="light" size="small">
            {{ activeFilterCount }}
          </t-tag>
        </div>
      </div>
    </template>

    <IssueFilter
      :filter-conditions="localFilterConditions"
      :filtered-count="filteredCount"
      :user-list="userList"
      :space-list="spaceList"
      @update:filter-conditions="handleUpdateConditions"
      @apply="handleApply"
    />

    <template #footer>
      <div class="drawer-footer">
        <t-button theme="default" variant="outline" @click="handleCancel">
          取消
        </t-button>
        <t-button theme="primary" @click="handleConfirm">
          确定
        </t-button>
      </div>
    </template>
  </t-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import IssueFilter from './IssueFilter.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  filterConditions: {
    type: Array,
    default: () => []
  },
  filteredCount: {
    type: Number,
    default: null
  },
  userList: {
    type: Array,
    default: () => []
  },
  spaceList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:filterConditions', 'confirm'])

const visible = ref(props.modelValue)
const localFilterConditions = ref([...props.filterConditions])

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    localFilterConditions.value = [...props.filterConditions]
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.filterConditions, (val) => {
  localFilterConditions.value = [...val]
}, { deep: true })

// 计算激活的筛选条件数量
const activeFilterCount = computed(() => {
  return localFilterConditions.value.filter(f => f.value !== '' && f.value !== null && f.value !== undefined).length
})

// 更新筛选条件
const handleUpdateConditions = (conditions) => {
  localFilterConditions.value = conditions
}

// 应用筛选
const handleApply = (conditions) => {
  localFilterConditions.value = conditions
}

// 取消
const handleCancel = () => {
  visible.value = false
}

// 确定
const handleConfirm = () => {
  emit('update:filterConditions', localFilterConditions.value)
  emit('confirm', localFilterConditions.value)
  visible.value = false
}
</script>

<style scoped lang="scss">
.drawer-header {
  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;

    .title-icon {
      color: #0052d9;
    }
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e7e7e7;
}
</style>
