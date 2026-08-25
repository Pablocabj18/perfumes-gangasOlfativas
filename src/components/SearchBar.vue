<script setup>
import { computed, ref } from 'vue'
const props = defineProps({ modelValue: { type: String, default: '' }, perfumes: { type: Array, default: () => [] } })
const emit = defineEmits(['update:modelValue', 'select'])
const focused = ref(false)
const suggestions = computed(() => {
  const term = props.modelValue.trim().toLocaleLowerCase('es')
  if (term.length < 2) return []
  const brands = [...new Set(props.perfumes.map((item) => item.brand))].filter((brand) => brand.toLocaleLowerCase('es').includes(term)).slice(0, 3).map((brand) => ({ type: 'brand', label: brand }))
  const products = props.perfumes.filter((item) => `${item.name} ${item.brand}`.toLocaleLowerCase('es').includes(term)).slice(0, 6).map((item) => ({ type: 'perfume', label: item.name, subtitle: item.brand, perfume: item }))
  return [...brands, ...products].slice(0, 7)
})
function choose(item) { focused.value = false; emit('select', item) }
function hide() { window.setTimeout(() => { focused.value = false }, 150) }
</script>

<template>
  <label class="relative block w-full">
    <span class="sr-only">Buscar por perfume o marca</span>
    <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
    <input :value="modelValue" @focus="focused = true" @blur="hide" @input="$emit('update:modelValue', $event.target.value)" type="search" autocomplete="off" placeholder="Buscar perfume o marca..." class="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/10" />
    <div v-if="focused && suggestions.length" class="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-panel p-2 shadow-2xl">
      <button v-for="item in suggestions" :key="`${item.type}-${item.label}`" type="button" class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-white/[0.06]" @mousedown.prevent="choose(item)"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-sm text-gold-300">{{ item.type === 'brand' ? 'M' : '✦' }}</span><span class="min-w-0"><strong class="block truncate text-sm text-white">{{ item.label }}</strong><small class="block truncate text-xs text-zinc-500">{{ item.type === 'brand' ? 'Ver toda la marca' : item.subtitle }}</small></span></button>
    </div>
  </label>
</template>
