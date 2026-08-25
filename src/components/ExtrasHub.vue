<script setup>
import { computed, ref } from 'vue'
import PerfumeGrid from './PerfumeGrid.vue'
import { getLoyalty, saveCustomer } from '../services/backendService'

const props = defineProps({ perfumes: { type: Array, default: () => [] }, favoriteIds: { type: Array, default: () => [] } })
defineEmits(['add', 'detail', 'favorite'])
const tab = ref('benefits')
const climate = ref('Calor')
const birthday = ref(localStorage.getItem('gangas-birthday') || '')
const customer = ref(JSON.parse(localStorage.getItem('gangas-customer') || '{"name":"","phone":""}'))
const points = ref(0)
const message = ref('')
const round = (value) => Math.ceil(value / 1000) * 1000
const decants = computed(() => props.perfumes.filter((p) => p.availability === 'Disponible').slice(0, 8).map((p) => ({ ...p, id: `decant-${p.id}`, name: `Decant ${p.name}`, size: '10 ml', priceArs: round(p.priceArs * .16), category: 'Decant', availability: 'Disponible' })))
const sets = computed(() => props.perfumes.filter((p) => p.availability === 'Disponible').slice(0, 6).reduce((result, perfume, index, source) => { if (index % 2 === 0 && source[index + 1]) result.push({ ...perfume, id: `set-${perfume.id}-${source[index + 1].id}`, name: `Dúo ${perfume.name} + ${source[index + 1].name}`, brand: 'Gangas Olfativas', size: `${perfume.size} + ${source[index + 1].size}`, priceArs: round((perfume.priceArs + source[index + 1].priceArs) * .9), category: 'Set', image: perfume.image }); return result }, []))
const climatePicks = computed(() => props.perfumes.filter((p) => climate.value === 'Calor' ? p.style === 'Fresco' : ['Dulce', 'Intenso'].includes(p.style)).slice(0, 4))
async function saveBirthday() {
  if (!customer.value.phone || !birthday.value) { message.value = 'Completá celular y cumpleaños.'; return }
  try {
    localStorage.setItem('gangas-birthday', birthday.value)
    await saveCustomer({ ...customer.value, birthday: birthday.value })
    points.value = (await getLoyalty(customer.value.phone).catch(() => ({ points: 0 }))).points
    message.value = 'Datos guardados correctamente.'
  } catch { message.value = 'No pudimos guardar los datos.' }
}
async function shareFavorites() { const names = props.favoriteIds.map((id) => props.perfumes.find((p) => p.id === id)?.name).filter(Boolean); const text = `Mi lista de regalos de Gangas Olfativas:\n${names.map((name) => `• ${name}`).join('\n')}`; if (navigator.share) await navigator.share({ title: 'Mi lista de regalos', text }); else await navigator.clipboard.writeText(text) }
async function referral() { const text = 'Descubrí Gangas Olfativas y encontrá tu próxima fragancia.'; if (navigator.share) await navigator.share({ title: 'Gangas Olfativas', text, url: location.href }); else await navigator.clipboard.writeText(`${text} ${location.href}`) }
</script>
<template>
  <section id="beneficios" class="scroll-mt-36 py-16">
    <div class="text-center"><p class="text-xs uppercase tracking-[0.22em] text-gold-400">Más formas de descubrir</p><h2 class="mt-3 font-display text-4xl sm:text-5xl">Experiencia Gangas</h2></div>
    <div class="mx-auto mt-7 flex max-w-2xl gap-2 overflow-x-auto rounded-full border border-white/10 bg-panel p-2 luxury-scroll"><button v-for="item in [{id:'benefits',label:'Beneficios'},{id:'decants',label:'Decants'},{id:'sets',label:'Combos'},{id:'climate',label:'Según el clima'}]" :key="item.id" class="shrink-0 flex-1 rounded-full px-5 py-2.5 text-sm font-semibold" :class="tab===item.id?'bg-gold-400 text-ink':'text-zinc-400'" @click="tab=item.id">{{ item.label }}</button></div>
    <div class="mt-9">
      <PerfumeGrid v-if="tab==='decants'" :perfumes="decants" @add="$emit('add',$event)" @detail="$emit('detail',$event)" />
      <PerfumeGrid v-else-if="tab==='sets'" :perfumes="sets" @add="$emit('add',$event)" @detail="$emit('detail',$event)" />
      <div v-else-if="tab==='climate'"><div class="mb-7 flex justify-center gap-2"><button v-for="item in ['Calor','Frío']" :key="item" class="rounded-full border px-5 py-2" :class="climate===item?'border-gold-400 bg-gold-400 text-ink':'border-white/10'" @click="climate=item">{{ item }}</button></div><PerfumeGrid :perfumes="climatePicks" @add="$emit('add',$event)" @detail="$emit('detail',$event)" /></div>
      <div v-else class="grid gap-4 md:grid-cols-2">
        <div class="rounded-3xl border border-white/10 bg-panel p-6"><p class="text-gold-300">Cupón de bienvenida</p><h3 class="mt-2 font-display text-3xl">GANGAS5</h3><p class="mt-2 text-sm text-zinc-500">Aplicalo dentro del carrito para obtener 5% de descuento.</p></div>
        <div class="rounded-3xl border border-white/10 bg-panel p-6"><p class="text-gold-300">Programa de puntos</p><h3 class="mt-2 font-display text-3xl">{{ points }} puntos</h3><p class="mt-2 text-sm text-zinc-500">Sumás 1 punto cada $1.000 en compras completadas.</p></div>
        <button class="rounded-3xl border border-white/10 bg-panel p-6 text-left" @click="shareFavorites"><p class="text-gold-300">Lista de regalos</p><h3 class="mt-2 font-display text-3xl">Compartir favoritos</h3></button>
        <button class="rounded-3xl border border-white/10 bg-panel p-6 text-left" @click="referral"><p class="text-gold-300">Referidos</p><h3 class="mt-2 font-display text-3xl">Invitar a un amigo</h3></button>
        <div class="rounded-3xl border border-white/10 bg-panel p-6 md:col-span-2"><p class="text-gold-300">Recordatorio de cumpleaños</p><div class="mt-4 grid gap-3 sm:grid-cols-3"><input v-model="customer.name" class="rounded-full border border-white/10 bg-black/25 px-4 py-3" placeholder="Tu nombre"><input v-model="customer.phone" inputmode="tel" class="rounded-full border border-white/10 bg-black/25 px-4 py-3" placeholder="Tu celular"><input v-model="birthday" type="date" class="rounded-full border border-white/10 bg-black/25 px-4 py-3"></div><button class="mt-4 rounded-full bg-gold-400 px-6 py-3 font-bold text-ink" @click="saveBirthday">Guardar mis datos</button><p v-if="message" class="mt-3 text-sm" :class="message.includes('correctamente') ? 'text-green-300' : 'text-red-300'">{{ message }}</p></div>
      </div>
    </div>
  </section>
</template>
