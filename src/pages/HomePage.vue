<script setup lang="ts">
import { useTripStore } from '@/stores/tripStore'
import { useUIStore } from '@/stores/uiStore'
import HeroBanner from '@/components/home/HeroBanner.vue'
import SearchFilterBar from '@/components/home/SearchFilterBar.vue'
import TripGrid from '@/components/home/TripGrid.vue'
import NewTripDialog from '@/components/home/NewTripDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const tripStore = useTripStore()
const uiStore = useUIStore()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <HeroBanner v-if="tripStore.tripCount > 0" />
    <SearchFilterBar />
    <LoadingSpinner v-if="tripStore.isLoading" />
    <TripGrid v-else-if="tripStore.filteredTrips.length > 0" />
    <EmptyState
      v-else
      icon="✈️"
      title="还没有旅行记录"
      description="开始你的第一趟旅程，记录沿途的风景与故事"
      :action-label="uiStore.isPublished ? undefined : '创建行程'"
      @action="uiStore.isNewTripDialogOpen = true"
    />
    <NewTripDialog
      v-if="!uiStore.isPublished"
      :open="uiStore.isNewTripDialogOpen"
      @close="uiStore.isNewTripDialogOpen = false"
    />
    <!-- FAB for creating new trip -->
    <button
      v-if="tripStore.tripCount > 0 && !uiStore.isPublished"
      @click="uiStore.isNewTripDialogOpen = true"
      class="fixed bottom-8 right-8 w-14 h-14 bg-magazine-pink text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl z-40 no-print"
      title="创建行程"
    >
      +
    </button>
  </div>
</template>
