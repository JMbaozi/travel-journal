<script setup lang="ts">
import { WEATHERS } from '@/types'
import type { Weather } from '@/types'

defineProps<{
  modelValue?: Weather
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Weather | undefined]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <button
      v-for="w in WEATHERS"
      :key="w.value"
      type="button"
      @click="emit('update:modelValue', modelValue === w.value ? undefined : w.value)"
      :class="[
        'text-2xl p-1.5 rounded-lg transition-all',
        modelValue === w.value ? 'bg-magazine-sky/20 ring-2 ring-magazine-sky scale-110' : 'hover:bg-gray-100'
      ]"
      :title="w.label"
    >
      {{ w.value }}
    </button>
  </div>
</template>
