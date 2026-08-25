<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
const visible = ref(false)
const update = () => { visible.value = window.scrollY > 500 }
const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
onMounted(() => { update(); window.addEventListener('scroll', update, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', update))
</script>
<template><Transition enter-active-class="transition duration-300" enter-from-class="translate-y-4 opacity-0" leave-active-class="transition duration-200" leave-to-class="translate-y-4 opacity-0"><button v-if="visible" class="fixed bottom-24 right-5 z-30 h-11 w-11 rounded-full border border-white/15 bg-panel text-gold-300 shadow-xl" aria-label="Volver arriba" @click="goTop">↑</button></Transition></template>
