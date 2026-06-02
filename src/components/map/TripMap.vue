<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDayEntryStore } from '@/stores/dayEntryStore'
import EmptyState from '@/components/common/EmptyState.vue'
import L from 'leaflet'

const props = defineProps<{
  tripId: string
}>()

const dayEntryStore = useDayEntryStore()
const mapContainer = ref<HTMLDivElement>()
const hasLocations = ref(false)

onMounted(async () => {
  const entries = dayEntryStore.getEntriesForTrip(props.tripId)
  const locations = entries
    .filter((e) => e.location)
    .map((e) => ({
      lat: e.location!.lat,
      lng: e.location!.lng,
      name: e.location!.name,
      dayNumber: e.dayNumber,
      title: e.title || `Day ${e.dayNumber}`,
      mood: e.mood,
    }))

  if (locations.length === 0) {
    hasLocations.value = false
    return
  }

  hasLocations.value = true

  // Wait for DOM to render the map container
  await new Promise((r) => setTimeout(r, 0))

  if (!mapContainer.value) return

  const map = L.map(mapContainer.value).setView([locations[0].lat, locations[0].lng], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map)

  // Add markers
  locations.forEach((loc, i) => {
    const icon = L.divIcon({
      html: `<div style="
        width:28px;height:28px;border-radius:50%;
        background:${i === 0 ? '#e85d75' : '#1a2744'};
        color:white;display:flex;align-items:center;justify-content:center;
        font-size:12px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.3);
        border:2px solid white;
      ">${loc.dayNumber}</div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })

    L.marker([loc.lat, loc.lng], { icon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:system-ui,sans-serif;min-width:120px">
          <strong>Day ${loc.dayNumber}</strong>
          ${loc.title ? `<br>${loc.title}` : ''}
          ${loc.mood ? `<br>${loc.mood}` : ''}
          <br><span style="color:#666;font-size:12px">${loc.name}</span>
        </div>
      `)
  })

  // Draw polyline
  if (locations.length > 1) {
    const coords = locations.map((l) => [l.lat, l.lng] as [number, number])
    L.polyline(coords, {
      color: '#e85d75',
      weight: 3,
      opacity: 0.7,
      dashArray: '8 4',
    }).addTo(map)
  }

  // Fit bounds
  const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng] as [number, number]))
  map.fitBounds(bounds.pad(0.2))
})
</script>

<template>
  <div>
    <div v-if="!hasLocations" class="py-16">
      <EmptyState
        icon="🗺️"
        title="还没有位置数据"
        description="在日记中添加位置信息后，足迹会显示在地图上"
      />
    </div>
    <div
      ref="mapContainer"
      class="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200"
    />
  </div>
</template>
