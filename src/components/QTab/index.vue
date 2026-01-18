<template>
  <div
    class="q-tab"
    :class="{ 'is-active': active }"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </div>
</template>

<script setup>
defineOptions({
  name: 'QTab'
})

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  name: {
    type: [String, Number],
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.name)
}
</script>

<style scoped>
.q-tab {
  padding: 4px 12px;
  font-size: 12px;
  color: #000000;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s;
  background-color: #ffffff;
  flex-shrink: 0;
  user-select: none;
}

.q-tab:hover {
  background-color: #f5f7fa;
  color: #000000;
}

.q-tab.is-active {
  background-color: #ffffff;
  color: #0052D9;
  font-weight: 500;
}
</style>
