<script setup>
import PerfumeGrid from './PerfumeGrid.vue'
defineProps({ id: String, eyebrow: String, title: String, description: String, perfumes: Array, favoriteIds: { type: Array, default: () => [] } })
defineEmits(['add', 'detail', 'favorite', 'compare'])
</script>

<template><section v-if="perfumes?.length" :id="id" class="scroll-mt-40 py-14 sm:py-20"><div class="mb-8"><p class="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">{{ eyebrow }}</p><h2 class="mt-2 font-display text-4xl font-semibold sm:text-5xl">{{ title }}</h2><p class="mt-3 max-w-xl text-sm leading-6 text-zinc-400">{{ description }}</p></div><PerfumeGrid :perfumes="perfumes" :favorite-ids="favoriteIds" @add="$emit('add', $event)" @detail="$emit('detail', $event)" @favorite="$emit('favorite', $event)" @compare="$emit('compare', $event)" /></section></template>
