<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
const prompt = ref(null)
const notifyEnabled = ref(typeof Notification !== 'undefined' && Notification.permission === 'granted')
const capture = (event) => { event.preventDefault(); prompt.value = event }
onMounted(() => addEventListener('beforeinstallprompt', capture))
onBeforeUnmount(() => removeEventListener('beforeinstallprompt', capture))
async function install() { await prompt.value?.prompt(); prompt.value = null }
async function notifications() { if (!('Notification' in window)) return; notifyEnabled.value = await Notification.requestPermission() === 'granted'; if (notifyEnabled.value) new Notification('Gangas Olfativas', { body: 'Te avisaremos sobre nuevos ingresos y promociones.', icon: '/favicon.svg' }) }
</script>
<template><section class="grid gap-4 py-10 sm:grid-cols-2"><button v-if="prompt" class="rounded-2xl border border-gold-400/30 bg-gold-400/10 p-5 text-left" @click="install"><strong class="block text-gold-300">Instalar Gangas Olfativas</strong><span class="mt-1 block text-sm text-zinc-400">Accedé como una app desde tu celular.</span></button><button class="rounded-2xl border border-white/10 bg-panel p-5 text-left" @click="notifications"><strong class="block">{{ notifyEnabled ? 'Notificaciones activadas' : 'Activar notificaciones' }}</strong><span class="mt-1 block text-sm text-zinc-400">Recibí avisos de nuevos ingresos.</span></button></section></template>
