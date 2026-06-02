<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Location } from '@/types'
import L from 'leaflet'

const props = defineProps<{
  modelValue?: Location
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Location | undefined]
}>()

const mapContainer = ref<HTMLDivElement>()
const locationName = ref(props.modelValue?.name || '')
let map: L.Map | null = null
let marker: L.Marker | null = null

onMounted(() => {
  if (!mapContainer.value) return

  const defaultLat = props.modelValue?.lat || 35
  const defaultLng = props.modelValue?.lng || 105

  map = L.map(mapContainer.value, {
    center: [defaultLat, defaultLng],
    zoom: props.modelValue ? 12 : 3,
    zoomControl: false,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OSM',
    maxZoom: 18,
  }).addTo(map)

  if (props.modelValue) {
    placeMarker(props.modelValue.lat, props.modelValue.lng)
  }

  map.on('click', (e: L.LeafletMouseEvent) => {
    placeMarker(e.latlng.lat, e.latlng.lng)
    updateValue()
  })
})

function placeMarker(lat: number, lng: number) {
  if (marker) marker.remove()
  marker = L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }),
  }).addTo(map!)
}

function updateValue() {
  if (marker) {
    const latlng = marker.getLatLng()
    emit('update:modelValue', {
      lat: latlng.lat,
      lng: latlng.lng,
      name: locationName.value.trim() || 'Pinned Location',
    })
  }
}

function onNameChange() {
  updateValue()
}
</script>

<template>
  <div>
    <div ref="mapContainer" class="w-full h-48 rounded-lg overflow-hidden border border-gray-200" />
    <input
      v-model="locationName"
      @input="onNameChange"
      type="text"
      placeholder="地点名称（如：东京塔）"
      class="w-full mt-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-magazine-pink"
    />
    <p v-if="!modelValue" class="text-xs text-gray-400 mt-1">点击地图标记位置</p>
    <button
      v-if="modelValue"
      @click="emit('update:modelValue', undefined)"
      class="text-xs text-red-400 hover:text-red-600 mt-1"
    >
      清除位置
    </button>
  </div>
</template>
