<script setup lang="ts">
import { MOODS } from '@/types'
import type { Mood } from '@/types'

defineProps<{
  modelValue?: Mood
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Mood | undefined]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <button
      v-for="m in MOODS"
      :key="m.value"
      type="button"
      @click="emit('update:modelValue', modelValue === m.value ? undefined : m.value)"
      :class="[
        'text-2xl p-1.5 rounded-lg transition-all',
        modelValue === m.value ? 'bg-magazine-pink/10 ring-2 ring-magazine-pink scale-110' : 'hover:bg-gray-100'
      ]"
      :title="m.label"
    >
      {{ m.value }}
    </button>
  </div>
</template>
