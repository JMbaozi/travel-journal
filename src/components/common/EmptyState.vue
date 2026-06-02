<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description: string
  actionLabel?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <span v-if="icon" class="text-5xl mb-4">{{ icon }}</span>
    <h3 class="text-lg font-semibold text-magazine-ink mb-1">{{ title }}</h3>
    <p class="text-gray-500 text-sm max-w-xs mb-6">{{ description }}</p>
    <button
      v-if="actionLabel"
      @click="emit('action')"
      class="px-5 py-2.5 bg-magazine-navy text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
