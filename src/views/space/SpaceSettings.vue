<template>
  <div class="space-settings-page">
    <t-card :bordered="false" class="space-settings-card">
      <div class="space-settings-body">
        <SpaceSettingsDrawer
          v-if="spaceId"
          :space-id="spaceId"
        />
        <t-empty v-else description="未指定空间，请从空间列表进入" />
      </div>
    </t-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkspaceStore } from '@/store/workspace'
import SpaceSettingsDrawer from './components/SpaceSettingsDrawer.vue'

const route = useRoute()
const workspaceStore = useWorkspaceStore()

const spaceId = computed(() => {
  const idFromQuery = route.query.spaceId || route.query.id
  const idFromParam = route.params.spaceId || route.params.id
  const id = idFromQuery || idFromParam
  return id ? Number(id) : null
})

const spaceName = computed(() => {
  if (!spaceId.value) return ''
  const list = workspaceStore.spaceList || []
  const target = list.find(s => String(s.id) === String(spaceId.value))
  return target?.name || ''
})
</script>

<style scoped lang="scss">
.space-settings-page {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  .space-settings-card {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.t-card__header) {
      padding: 16px 24px;
      border-bottom: 1px solid #e7e7e7;
    }

    :deep(.t-card__body) {
      padding: 16px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

  .space-settings-body {
    margin-top: 8px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>