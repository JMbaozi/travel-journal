<script setup lang="ts">
import type { Mood, Weather, Location, ExpenseItem } from '@/types'
import MoodPicker from './MoodPicker.vue'
import WeatherPicker from './WeatherPicker.vue'
import LocationMiniMap from './LocationMiniMap.vue'
import ExpenseLineItems from './ExpenseLineItems.vue'

interface SidebarData {
  mood: Mood | undefined
  weather: Weather | undefined
  location: Location | undefined
  expenses: ExpenseItem[]
}

const props = defineProps<{
  tripId: string
  tripStartDate: string
  dayNumber: number
  modelValue: SidebarData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SidebarData]
}>()

function updateMood(mood?: Mood) {
  emit('update:modelValue', { ...props.modelValue, mood })
}

function updateWeather(weather?: Weather) {
  emit('update:modelValue', { ...props.modelValue, weather })
}

function updateLocation(location?: Location) {
  emit('update:modelValue', { ...props.modelValue, location })
}

function updateExpenses(expenses: ExpenseItem[]) {
  emit('update:modelValue', { ...props.modelValue, expenses })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Mood -->
    <div class="bg-white rounded-xl border border-gray-100 p-4">
      <h3 class="font-display text-sm font-semibold text-magazine-ink mb-3">心情</h3>
      <MoodPicker :model-value="modelValue.mood" @update:model-value="updateMood" />
    </div>

    <!-- Weather -->
    <div class="bg-white rounded-xl border border-gray-100 p-4">
      <h3 class="font-display text-sm font-semibold text-magazine-ink mb-3">天气</h3>
      <WeatherPicker :model-value="modelValue.weather" @update:model-value="updateWeather" />
    </div>

    <!-- Location -->
    <div class="bg-white rounded-xl border border-gray-100 p-4">
      <h3 class="font-display text-sm font-semibold text-magazine-ink mb-3">位置</h3>
      <LocationMiniMap :model-value="modelValue.location" @update:model-value="updateLocation" />
    </div>

    <!-- Expenses -->
    <div class="bg-white rounded-xl border border-gray-100 p-4">
      <h3 class="font-display text-sm font-semibold text-magazine-ink mb-3">消费</h3>
      <ExpenseLineItems :model-value="modelValue.expenses" @update:model-value="updateExpenses" />
    </div>
  </div>
</template>
