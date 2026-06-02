<script setup lang="ts">
defineEmits<{
  clear: []
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-red-100 p-6">
    <h2 class="font-display text-lg font-semibold text-red-600 mb-2">危险区域</h2>
    <p class="text-sm text-gray-500 mb-4">清除所有数据后无法恢复。建议先导出备份。</p>
    <button
      @click="$emit('clear')"
      class="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
    >
      清除全部数据
    </button>
  </div>
</template>
