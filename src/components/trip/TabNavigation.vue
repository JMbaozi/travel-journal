<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabs = [
  { key: 'journal', label: '日记', icon: '📝' },
  { key: 'gallery', label: '画廊', icon: '🖼️' },
  { key: 'map', label: '地图', icon: '🗺️' },
  { key: 'stats', label: '统计', icon: '📊' },
]
</script>

<template>
  <div class="flex border-b border-gray-200">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      @click="emit('update:modelValue', tab.key)"
      :class="[
        'flex-1 py-3 text-sm font-medium transition-colors relative',
        modelValue === tab.key
          ? 'text-magazine-pink'
          : 'text-gray-400 hover:text-gray-600'
      ]"
    >
      <span class="mr-1">{{ tab.icon }}</span>
      {{ tab.label }}
      <div
        v-if="modelValue === tab.key"
        class="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-magazine-pink rounded-full"
      />
    </button>
  </div>
</template>
