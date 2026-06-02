<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useUIStore } from '@/stores/uiStore'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const settingsStore = useSettingsStore()
const uiStore = useUIStore()

const isExporting = ref(false)
const showImportConfirm = ref(false)
const pendingImportData = ref<string | null>(null)

async function handleExport() {
  isExporting.value = true
  try {
    const json = await settingsStore.exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `travel-journal-backup-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    uiStore.showToast('数据导出成功！', 'success')
  } catch {
    uiStore.showToast('导出失败', 'error')
  } finally {
    isExporting.value = false
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    pendingImportData.value = reader.result as string
    showImportConfirm.value = true
  }
  reader.onerror = () => {
    uiStore.showToast('文件读取失败', 'error')
  }
  reader.readAsText(file)
  input.value = ''
}

async function confirmImport() {
  showImportConfirm.value = false
  if (!pendingImportData.value) return
  try {
    await settingsStore.importAllData(pendingImportData.value)
    uiStore.showToast('数据导入成功！请刷新页面', 'success')
    setTimeout(() => window.location.reload(), 1500)
  } catch {
    uiStore.showToast('导入失败：无效的备份文件', 'error')
  }
  pendingImportData.value = null
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-6">
    <h2 class="font-display text-lg font-semibold text-magazine-ink mb-4">数据备份</h2>
    <p class="text-sm text-gray-500 mb-4">导出所有数据为 JSON 文件以备份。你可以随时导入该文件恢复数据。</p>
    <div class="flex gap-3">
      <button
        @click="handleExport"
        :disabled="isExporting"
        class="px-4 py-2 bg-magazine-navy text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {{ isExporting ? '导出中...' : '导出备份 (JSON)' }}
      </button>
      <label class="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        导入备份
        <input type="file" accept=".json" class="hidden" @change="handleFileSelect" />
      </label>
    </div>
  </div>

  <ConfirmDialog
    :open="showImportConfirm"
    title="确认导入"
    message="导入数据将替换当前全部数据，此操作不可撤销。确定要继续吗？"
    confirm-label="确认导入"
    :dangerous="true"
    @confirm="confirmImport"
    @cancel="showImportConfirm = false"
  />
</template>
