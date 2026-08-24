<script setup>
import { ref, watch } from 'vue'
import { appConfig } from '../config/appConfig'
import { createWhatsAppUrl } from '../utils/whatsapp'

const props = defineProps({ perfume: Object, related: { type: Array, default: () => [] }, favorite: Boolean })
defineEmits(['close', 'add', 'detail', 'favorite'])
const failed = ref(false)
watch(() => props.perfume, () => { failed.value = false })
const money = (value) => new Intl.NumberFormat(appConfig.currency.locale, { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
const share = async () => {
  const data = { title: props.perfume.name, text: `Mirá ${props.perfume.name} en Gangas Olfativas`, url: location.href }
  if (navigator.share) await navigator.share(data)
  else await navigator.clipboard.writeText(`${data.text} ${data.url}`)
}
const restockUrl = () => createWhatsAppUrl(`Hola, quiero que me avisen cuando vuelva ${props.perfume.name} ${props.perfume.size}.`)
</script>

<template>
  <div v-if="perfume" class="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" @click.self="$emit('close')">
    <article class="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-white/10 bg-panel sm:rounded-3xl">
      <div class="grid md:grid-cols-2">
        <div class="aspect-square bg-black"><img v-if="perfume.image && !failed" :src="perfume.image" :alt="perfume.name" @error="failed = true" class="h-full w-full object-cover" /><div v-else class="flex h-full items-center justify-center font-display text-3xl text-gold-400">Gangas Olfativas</div></div>
        <div class="relative flex flex-col p-6 sm:p-9"><button class="absolute right-5 top-5 h-10 w-10 rounded-full border border-white/10 text-xl" @click="$emit('close')">×</button><p class="text-sm text-gold-300">{{ perfume.brand }}</p><h2 class="mt-2 pr-12 font-display text-4xl font-semibold">{{ perfume.name }}</h2><p class="mt-4 text-3xl font-bold">{{ money(perfume.priceArs) }}</p><dl class="mt-8 grid grid-cols-2 gap-4 text-sm"><div><dt class="text-zinc-500">Categoría</dt><dd class="mt-1">{{ perfume.category }}</dd></div><div><dt class="text-zinc-500">Público</dt><dd class="mt-1">{{ perfume.gender }}</dd></div><div><dt class="text-zinc-500">Presentación</dt><dd class="mt-1">{{ perfume.size }}</dd></div><div><dt class="text-zinc-500">Disponibilidad</dt><dd class="mt-1">{{ perfume.availability }}</dd></div><div><dt class="text-zinc-500">Estilo</dt><dd class="mt-1">{{ perfume.style }}</dd></div><div><dt class="text-zinc-500">Duración</dt><dd class="mt-1">{{ perfume.duration }}</dd></div><div><dt class="text-zinc-500">Ocasión</dt><dd class="mt-1">{{ perfume.occasion }}</dd></div><div><dt class="text-zinc-500">Estación</dt><dd class="mt-1">{{ perfume.season }}</dd></div><div><dt class="text-zinc-500">Familia</dt><dd class="mt-1">{{ perfume.family }}</dd></div><div><dt class="text-zinc-500">Concentración</dt><dd class="mt-1">{{ perfume.concentration }}</dd></div><div><dt class="text-zinc-500">Proyección</dt><dd class="mt-1">{{ perfume.projection }}</dd></div></dl><div class="mt-6"><p class="text-xs text-zinc-500">Notas principales</p><div class="mt-2 flex flex-wrap gap-2"><span v-for="note in perfume.notes" :key="note" class="rounded-full border border-white/10 px-3 py-1 text-xs">{{ note }}</span></div></div><a v-if="perfume.availability === 'En falta'" :href="restockUrl()" target="_blank" rel="noopener noreferrer" class="mt-8 rounded-full bg-gold-400 px-6 py-4 text-center font-bold text-ink">Avisarme cuando vuelva</a><button v-else class="mt-8 rounded-full bg-gold-400 px-6 py-4 font-bold text-ink" @click="$emit('add', perfume)">Agregar al carrito</button><div class="mt-3 grid grid-cols-2 gap-2"><button class="rounded-full border border-white/10 py-3 text-sm" @click="$emit('favorite', perfume.id)">{{ favorite ? '♥ Favorito' : '♡ Favorito' }}</button><button class="rounded-full border border-white/10 py-3 text-sm" @click="share">Compartir</button></div></div>
      </div>
      <div v-if="related.length" class="border-t border-white/10 p-6 sm:p-9"><h3 class="font-display text-3xl">También podrían gustarte</h3><div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><button v-for="item in related" :key="item.id" class="rounded-xl border border-white/10 p-3 text-left" @click="$emit('detail', item)"><img :src="item.image" :alt="item.name" class="aspect-square w-full rounded-lg object-cover" /><p class="mt-2 line-clamp-2 text-sm font-semibold">{{ item.name }}</p></button></div></div>
      <div class="border-t border-white/10 p-6 text-center text-sm text-zinc-500">Opiniones de clientes · Sin opiniones todavía</div>
    </article>
  </div>
</template>
