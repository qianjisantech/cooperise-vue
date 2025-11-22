<template>
  <div class="detail-header">
    <t-breadcrumb>
      <t-breadcrumb-item>{{ issue.spaceName || '未知空间' }}</t-breadcrumb-item>
      <t-breadcrumb-item>{{ issue.issueNo || '-' }}</t-breadcrumb-item>
    </t-breadcrumb>
  </div>
</template>

<script setup>
defineProps({
  issue: {
    type: Object,
    required: true
  }
})
</script>

<style scoped lang="scss">
.detail-header {
  padding: 12px 24px;
  border-bottom: 1px solid #e7e7e7;

  :deep(.t-breadcrumb) {
    font-size: 14px;
  }
}
</style>
