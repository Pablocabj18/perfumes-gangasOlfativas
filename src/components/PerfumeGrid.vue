<script setup>
import PerfumeCard from './PerfumeCard.vue'
defineProps({ perfumes: { type: Array, default: () => [] }, loading: Boolean, favoriteIds: { type: Array, default: () => [] } })
defineEmits(['add', 'detail', 'favorite', 'compare'])
</script>

<template>
  <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Cargando perfumes"><div v-for="n in 8" :key="n" class="overflow-hidden rounded-2xl border border-white/10 bg-panel"><div class="aspect-[4/4.1] animate-pulse bg-white/[0.05]"></div><div class="space-y-4 p-5"><div class="h-3 w-1/3 animate-pulse rounded bg-white/[0.06]"></div><div class="h-7 w-4/5 animate-pulse rounded bg-white/[0.06]"></div><div class="h-12 animate-pulse rounded-full bg-white/[0.06]"></div></div></div></div>
  <div v-else-if="perfumes.length" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><PerfumeCard v-for="perfume in perfumes" :key="perfume.id" :perfume="perfume" :favorite="favoriteIds.includes(perfume.id)" @add="$emit('add', $event)" @detail="$emit('detail', $event)" @favorite="$emit('favorite', $event)" @compare="$emit('compare', $event)" /></div>
  <div v-else class="rounded-2xl border border-dashed border-white/15 py-16 text-center"><p class="font-display text-3xl text-white">No encontramos perfumes</p><p class="mt-2 text-sm text-zinc-500">Probá con otra búsqueda o combinación de filtros.</p></div>
</template>
