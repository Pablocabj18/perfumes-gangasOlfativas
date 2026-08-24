<script setup>
import { ref } from 'vue'
import { appConfig } from '../config/appConfig'

defineProps({ perfume: { type: Object, required: true }, favorite: Boolean })
const emit = defineEmits(['add', 'detail', 'favorite', 'compare'])

const imageFailed = ref(false)
const money = (value) => new Intl.NumberFormat(appConfig.currency.locale, { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
const badgeClass = { Disponible: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20', 'En falta': 'bg-red-400/10 text-red-300 ring-red-400/20', Próximamente: 'bg-amber-400/10 text-amber-300 ring-amber-400/20' }

function addWithAnimation(event, perfume) {
  const target = document.querySelector('[data-cart-button]')?.getBoundingClientRect()
  const origin = event.currentTarget.getBoundingClientRect()
  if (!target) return emit('add', perfume)
  const flyer = document.createElement('img')
  flyer.src = perfume.image
  flyer.className = 'pointer-events-none fixed z-[70] h-16 w-16 rounded-full border-2 border-gold-300 bg-black object-cover shadow-[0_0_30px_rgba(212,175,98,.55)]'
  flyer.style.left = `${origin.left + origin.width / 2 - 32}px`
  flyer.style.top = `${origin.top + origin.height / 2 - 32}px`
  document.body.appendChild(flyer)
  const distanceX = target.left + target.width / 2 - origin.left - origin.width / 2
  const distanceY = target.top + target.height / 2 - origin.top - origin.height / 2
  flyer.animate([
    { transform: 'translate(0, 0) scale(.65)', opacity: 0 },
    { transform: `translate(${distanceX * .18}px, ${distanceY * .08 - 55}px) scale(1.08)`, opacity: 1, offset: .22 },
    { transform: `translate(${distanceX * .62}px, ${distanceY * .5 - 75}px) scale(.72)`, opacity: .9, offset: .58 },
    { transform: `translate(${distanceX}px, ${distanceY}px) scale(.12)`, opacity: .15 },
  ], { duration: 760, easing: 'cubic-bezier(.22,.8,.25,1)' }).finished.finally(() => flyer.remove())
  setTimeout(() => emit('add', perfume), 650)
}
</script>

<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-glow transition duration-300 hover:-translate-y-1 hover:border-gold-400/30">
    <button class="relative aspect-[4/4.1] overflow-hidden bg-gradient-to-br from-zinc-900 to-black text-left" @click="$emit('detail', perfume)" :aria-label="`Ver detalles de ${perfume.name}`">
      <img v-if="perfume.image && !imageFailed" :src="perfume.image" :alt="`${perfume.name} de ${perfume.brand}`" loading="lazy" decoding="async" @error="imageFailed = true" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
      <div v-else class="flex h-full flex-col items-center justify-center gap-4 text-gold-400/60"><svg class="h-20 w-20" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M24 8h16v10H24zM20 21h24a5 5 0 0 1 5 5v29H15V26a5 5 0 0 1 5-5Z"/><path d="M23 36h18M28 13h8"/></svg><span class="text-xs uppercase tracking-[0.2em]">Gangas Olfativas</span></div>
      <span class="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset backdrop-blur" :class="badgeClass[perfume.availability] || badgeClass['Próximamente']">{{ perfume.availability }}</span>
      <span class="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/65 text-xl shadow-lg backdrop-blur-md transition hover:scale-110 hover:border-gold-300" :class="favorite ? 'text-gold-300' : 'text-white'" @click.stop="$emit('favorite', perfume.id)">{{ favorite ? '♥' : '♡' }}</span>
    </button>
    <div class="flex flex-1 flex-col p-5">
      <div class="mb-3 flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500"><span>{{ perfume.category }}</span><span>•</span><span>{{ perfume.gender }}</span><span>•</span><span>{{ perfume.size }}</span></div>
      <p class="text-sm text-gold-300">{{ perfume.brand }}</p>
      <button class="mt-1 text-left font-display text-2xl font-semibold leading-tight text-white hover:text-gold-300" @click="$emit('detail', perfume)">{{ perfume.name }}</button>
      <div class="mt-auto pb-5 pt-6"><p class="text-xs text-zinc-500">Precio</p><p class="text-xl font-bold text-white">{{ money(perfume.priceArs) }}</p></div>
      <div class="grid grid-cols-2 gap-2">
        <button class="rounded-full border border-white/15 px-3 py-3 text-sm font-semibold text-white hover:border-gold-400/50" @click="$emit('detail', perfume)">Ver detalle</button>
        <button class="rounded-full bg-gold-400 px-3 py-3 text-sm font-bold text-ink hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-40" :disabled="perfume.availability === 'En falta'" @click="addWithAnimation($event, perfume)">Agregar</button>
      </div>
      <button class="mt-3 text-xs font-semibold text-zinc-500 transition hover:text-gold-300" @click="$emit('compare', perfume)">＋ Agregar al comparador</button>
    </div>
  </article>
</template>
