<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()
const stats = ref<{ tripsCount: number; entriesCount: number; photosCount: number } | null>(null)

onMounted(async () => {
  stats.value = await settingsStore.getStorageStats()
})
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-6">
    <h2 class="font-display text-lg font-semibold text-magazine-ink mb-4">数据统计</h2>
    <div v-if="stats" class="grid grid-cols-3 gap-4">
      <div class="text-center p-4 bg-magazine-cream rounded-lg">
        <p class="font-display text-3xl font-bold text-magazine-navy">{{ stats.tripsCount }}</p>
        <p class="text-xs text-gray-500 mt-1">行程</p>
      </div>
      <div class="text-center p-4 bg-magazine-cream rounded-lg">
        <p class="font-display text-3xl font-bold text-magazine-pink">{{ stats.entriesCount }}</p>
        <p class="text-xs text-gray-500 mt-1">日记</p>
      </div>
      <div class="text-center p-4 bg-magazine-cream rounded-lg">
        <p class="font-display text-3xl font-bold text-magazine-mint">{{ stats.photosCount }}</p>
        <p class="text-xs text-gray-500 mt-1">照片</p>
      </div>
    </div>
    <p v-else class="text-sm text-gray-400">加载中...</p>
  </div>
</template>
