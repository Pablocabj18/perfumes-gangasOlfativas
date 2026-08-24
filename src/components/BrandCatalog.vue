<script setup>
import { computed } from 'vue'
import PerfumeGrid from './PerfumeGrid.vue'

const props = defineProps({ perfumes: { type: Array, default: () => [] }, favoriteIds: { type: Array, default: () => [] } })
defineEmits(['add', 'detail', 'favorite', 'compare'])
const groups = computed(() => Object.entries(props.perfumes.reduce((result, perfume) => {
  ;(result[perfume.brand] ||= []).push(perfume)
  return result
}, {})).sort(([a], [b]) => a.localeCompare(b, 'es')))
</script>

<template>
  <div v-if="groups.length" class="space-y-14">
    <section v-for="([brand, items]) in groups" :key="brand">
      <div class="mb-5 flex items-end justify-between border-b border-white/10 pb-3">
        <h3 class="font-display text-3xl font-semibold text-white">{{ brand }}</h3>
        <span class="text-xs text-zinc-500">{{ items.length }} {{ items.length === 1 ? 'perfume' : 'perfumes' }}</span>
      </div>
      <PerfumeGrid :perfumes="items" :favorite-ids="favoriteIds" @add="$emit('add', $event)" @detail="$emit('detail', $event)" @favorite="$emit('favorite', $event)" @compare="$emit('compare', $event)" />
    </section>
  </div>
  <PerfumeGrid v-else :perfumes="[]" />
</template>
