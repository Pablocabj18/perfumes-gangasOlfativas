<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { recommendationScore } from '../utils/fragranceProfile'
import PerfumeGrid from './PerfumeGrid.vue'

const props = defineProps({ open: Boolean, perfumes: { type: Array, default: () => [] } })
defineEmits(['close', 'add', 'detail'])
const step = ref(0)
const answers = reactive({ gender: 'Todos', style: 'Fresco', family: 'Cítrica acuática', intensity: 'Moderada', occasion: 'Día', season: 'Verano', budget: 250000 })
const questions = [
  { key: 'gender', title: '¿Para quién es?', subtitle: 'Elegí la opción que mejor represente a quien lo va a usar.', options: ['Todos', 'Hombre', 'Mujer', 'Unisex'] },
  { key: 'style', title: '¿Qué sensación buscás?', subtitle: 'Pensá cómo querés que se sienta la fragancia.', options: ['Fresco', 'Dulce', 'Intenso', 'Elegante', 'Versátil'] },
  { key: 'family', title: '¿Qué familia te atrae?', subtitle: 'No hace falta saber de perfumes: elegí la que más te identifique.', options: ['Cítrica acuática', 'Ámbar gourmand', 'Amaderada especiada', 'Aromática amaderada', 'Aromática'] },
  { key: 'occasion', title: '¿Cuándo lo usarías?', subtitle: 'Esto ayuda a elegir intensidad y personalidad.', options: ['Día', 'Noche', 'Uso diario', 'Ocasiones especiales'] },
  { key: 'season', title: '¿En qué clima?', subtitle: 'Algunas fragancias brillan más según la estación.', options: ['Verano', 'Invierno', 'Todo el año'] },
]
const finished = computed(() => step.value >= questions.length + 1)
const current = computed(() => questions[step.value])
const results = computed(() => [...props.perfumes].filter((p) => p.priceArs <= answers.budget).sort((a, b) => recommendationScore(b, answers) - recommendationScore(a, answers)).slice(0, 4))
function choose(value) { answers[current.value.key] = value; setTimeout(() => { step.value += 1 }, 180) }
watch(() => props.open, (value) => { if (value) step.value = 0 })
</script>
<template><div v-if="open" class="fixed inset-0 z-50 overflow-y-auto bg-black/85 p-4 backdrop-blur-md" @click.self="$emit('close')"><div class="mx-auto my-8 max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-2xl"><div class="h-1 bg-white/5"><div class="h-full bg-gold-400 transition-all duration-500" :style="{ width: `${Math.min(100, ((step + 1) / (questions.length + 2)) * 100)}%` }"></div></div><div class="p-6 sm:p-10"><div class="flex justify-between"><div><p class="text-xs uppercase tracking-widest text-gold-400">Perfume para vos · {{ Math.min(step + 1, questions.length + 2) }}/{{ questions.length + 2 }}</p></div><button class="h-10 w-10 rounded-full border border-white/10 text-xl" @click="$emit('close')">×</button></div><Transition mode="out-in" enter-active-class="transition duration-300" enter-from-class="translate-x-8 opacity-0" leave-active-class="transition duration-150" leave-to-class="-translate-x-8 opacity-0"><div :key="step" class="mt-8"><div v-if="current"><h2 class="font-display text-4xl sm:text-5xl">{{ current.title }}</h2><p class="mt-3 text-zinc-400">{{ current.subtitle }}</p><div class="mt-8 grid gap-3 sm:grid-cols-2"><button v-for="option in current.options" :key="option" class="rounded-2xl border border-white/10 bg-black/20 p-5 text-left font-semibold transition hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-400/10 hover:text-gold-300" @click="choose(option)">{{ option }} <span class="float-right text-gold-400">→</span></button></div></div><div v-else-if="step === questions.length"><h2 class="font-display text-4xl">¿Cuál es tu presupuesto?</h2><p class="mt-3 text-zinc-400">Buscaremos las mejores opciones dentro de este valor.</p><input v-model.number="answers.budget" type="range" min="50000" max="1000000" step="25000" class="mt-10 w-full accent-gold-400" /><p class="mt-4 text-center font-display text-4xl text-gold-300">$ {{ answers.budget.toLocaleString('es-AR') }}</p><button class="mx-auto mt-8 block rounded-full bg-gold-400 px-8 py-4 font-bold text-ink" @click="step += 1">Ver mis recomendaciones</button></div><div v-else><div class="mb-7 text-center"><p class="text-xs uppercase tracking-widest text-gold-400">Tu selección personalizada</p><h2 class="mt-2 font-display text-4xl">Estas fragancias son para vos</h2><p class="mt-2 text-sm text-zinc-400">Elegidas según tus gustos, ocasión y presupuesto.</p></div><PerfumeGrid :perfumes="results" @add="$emit('add', $event)" @detail="$emit('detail', $event)" /><button class="mx-auto mt-7 block text-sm text-gold-300" @click="step = 0">Volver a empezar</button></div></div></Transition></div></div></div></template>
