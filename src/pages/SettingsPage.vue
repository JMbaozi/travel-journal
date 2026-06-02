<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useUIStore } from '@/stores/uiStore'
import StorageStats from '@/components/settings/StorageStats.vue'
import ExportImport from '@/components/settings/ExportImport.vue'
import ClearDataButton from '@/components/settings/ClearDataButton.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const settingsStore = useSettingsStore()
const uiStore = useUIStore()

const showClearConfirm = ref(false)

async function handleClearAll() {
  showClearConfirm.value = false
  await settingsStore.clearAllData()
  uiStore.showToast('所有数据已清除', 'info')
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="font-display text-3xl font-bold text-magazine-ink mb-8">设置</h1>

    <div class="space-y-6">
      <StorageStats />
      <ExportImport />
      <ClearDataButton @clear="showClearConfirm = true" />
    </div>

    <ConfirmDialog
      :open="showClearConfirm"
      title="清除全部数据"
      message="此操作将永久删除所有行程、日记和照片数据，不可恢复。确定要继续吗？"
      confirm-label="确认清除"
      :dangerous="true"
      @confirm="handleClearAll"
      @cancel="showClearConfirm = false"
    />
  </div>
</template>
