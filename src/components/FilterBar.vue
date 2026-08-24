<script setup>
import PremiumSelect from './PremiumSelect.vue'
defineProps({ category: String, gender: String, brand: String, brands: { type: Array, default: () => [] }, sort: String, size: String, note: String, maxPrice: Number, favoritesOnly: Boolean })
defineEmits(['update:category', 'update:gender', 'update:brand', 'update:sort', 'update:size', 'update:note', 'update:maxPrice', 'update:favoritesOnly'])
const categories = ['Todos', 'Diseñador', 'Árabe', 'Nicho']
const genders = ['Todos', 'Hombre', 'Mujer', 'Unisex']
const sizes = [{ label: 'Todos los tamaños', value: 'Todas' }, '50 ml', '75 ml', '100 ml', '125 ml', '150 ml', '200 ml']
const sorting = [{ label: 'Nombre: A - Z', value: 'az' }, { label: 'Menor precio', value: 'price-low' }, { label: 'Mayor precio', value: 'price-high' }, { label: 'Marca', value: 'brand' }]
const notes = ['Todas', 'Cítricos', 'Acuáticos', 'Maderas', 'Vainilla', 'Ámbar', 'Especias', 'Aromáticos', 'Almizcle']
</script>

<template>
  <div class="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.02] shadow-2xl shadow-black/20 backdrop-blur-xl">
    <div class="grid gap-px bg-white/10 lg:grid-cols-3">
      <fieldset class="bg-panel/95 p-5"><legend class="sr-only">Tipo</legend><p class="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400">Tipo</p><div class="flex gap-2 overflow-x-auto pb-1 luxury-scroll"><button v-for="item in categories" :key="item" @click="$emit('update:category', item)" class="shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all" :class="category === item ? 'border-gold-400 bg-gold-400 text-ink shadow-lg shadow-gold-400/10' : 'border-white/10 bg-black/20 text-zinc-300 hover:border-gold-400/40 hover:text-white'">{{ item }}</button></div></fieldset>
      <fieldset class="bg-panel/95 p-5"><legend class="sr-only">Público</legend><p class="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400">Público</p><div class="flex gap-2 overflow-x-auto pb-1 luxury-scroll"><button v-for="item in genders" :key="item" @click="$emit('update:gender', item)" class="shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all" :class="gender === item ? 'border-gold-400 bg-gold-400 text-ink shadow-lg shadow-gold-400/10' : 'border-white/10 bg-black/20 text-zinc-300 hover:border-gold-400/40 hover:text-white'">{{ item }}</button></div></fieldset>
      <div class="bg-panel/95 p-5"><p class="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400">Favoritos</p><button class="flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all" :class="favoritesOnly ? 'border-gold-400 bg-gold-400/10 text-gold-300' : 'border-white/10 bg-black/20 text-zinc-300 hover:border-gold-400/40'" @click="$emit('update:favoritesOnly', !favoritesOnly)"><span>{{ favoritesOnly ? 'Mostrando favoritos' : 'Solo mis favoritos' }}</span><span class="flex h-8 w-8 items-center justify-center rounded-full" :class="favoritesOnly ? 'bg-gold-400 text-ink' : 'bg-white/5 text-gold-300'">{{ favoritesOnly ? '♥' : '♡' }}</span></button></div>
    </div>
    <div class="grid gap-4 border-t border-white/10 p-5 sm:grid-cols-2 lg:grid-cols-5">
      <label><span class="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Marca</span><PremiumSelect :model-value="brand" :options="[{ label: 'Todas las marcas', value: 'Todas' }, ...brands]" @update:model-value="$emit('update:brand', $event)" /></label>
      <label><span class="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Presentación</span><PremiumSelect :model-value="size" :options="sizes" @update:model-value="$emit('update:size', $event)" /></label>
      <label><span class="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Nota olfativa</span><PremiumSelect :model-value="note" :options="notes" @update:model-value="$emit('update:note', $event)" /></label>
      <label><span class="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Ordenar por</span><PremiumSelect :model-value="sort" :options="sorting" @update:model-value="$emit('update:sort', $event)" /></label>
      <label><span class="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500"><span>Precio máximo</span><span class="text-gold-300">$ {{ maxPrice?.toLocaleString('es-AR') }}</span></span><div class="flex h-[46px] items-center rounded-2xl border border-white/10 bg-black/25 px-4"><input :value="maxPrice" type="range" min="50000" max="1000000" step="25000" class="w-full accent-gold-400" @input="$emit('update:maxPrice', Number($event.target.value))" /></div></label>
    </div>
  </div>
</template>
