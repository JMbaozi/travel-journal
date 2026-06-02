<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'
import { useTripStore } from '@/stores/tripStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useUIStore } from '@/stores/uiStore'
import { onMounted } from 'vue'

const tripStore = useTripStore()
const settingsStore = useSettingsStore()
const uiStore = useUIStore()

onMounted(async () => {
  await settingsStore.loadSettings()
  await tripStore.loadAllTrips()

  // If no local data exists, try to load published journal data
  if (tripStore.trips.length === 0) {
    try {
      const resp = await fetch('/data/journal.json')
      if (resp.ok) {
        const json = await resp.text()
        await settingsStore.importAllData(json)
        await tripStore.loadAllTrips()
        uiStore.isPublished = true
      }
    } catch {
      // Journal file doesn't exist or is invalid — normal local mode
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-magazine-cream">
    <AppHeader />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <ToastNotification />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
