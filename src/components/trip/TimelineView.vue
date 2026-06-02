<script setup lang="ts">
import { useDayEntryStore } from '@/stores/dayEntryStore'
import DayEntryCard from './DayEntryCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  tripId: string
}>()

const dayEntryStore = useDayEntryStore()
const router = useRouter()
const entries = dayEntryStore.getEntriesForTrip(props.tripId)
</script>

<template>
  <div>
    <div v-if="entries.length === 0" class="py-16">
      <EmptyState
        icon="📔"
        title="还没有日记"
        description="开始记录你的第一天旅程吧"
        action-label="写日记"
        @action="router.push({ name: 'day-new', params: { id: tripId } })"
      />
    </div>
    <div v-else class="relative">
      <!-- Timeline line -->
      <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
      <div class="space-y-8">
        <DayEntryCard
          v-for="(entry, index) in entries"
          :key="entry.id"
          :entry="entry"
          :side="index % 2 === 0 ? 'left' : 'right'"
        />
      </div>
    </div>
  </div>
</template>
