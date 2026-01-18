<template>
  <div class="q-tabs">
    <QTab
      v-for="tab in tabs"
      :key="tab.key"
      :name="tab.key"
      :label="tab.label"
      :active="modelValue === tab.key"
      @click="handleTabClick"
    />
  </div>
</template>

<script setup>
import QTab from '../QTab/index.vue'

defineOptions({
  name: 'QTabs'
})

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleTabClick = (key) => {
  if (key !== props.modelValue) {
    emit('update:modelValue', key)
    emit('change', key)
  }
}
</script>

<style scoped>
.q-tabs {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 24px;
  border-bottom: 1px solid #e7e7e7;
  width: 100%;
}
</style>
