<script setup>
defineProps({ modelValue: { type: String, default: '' } })
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="relative block w-full">
    <span class="sr-only">Buscar por perfume o marca</span>
    <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
    <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="search" placeholder="Buscar perfume o marca..." class="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/10" />
  </label>
</template>
