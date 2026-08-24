<script setup>
import { appConfig } from '../config/appConfig'
import { createWhatsAppUrl, priceListWhatsAppUrl } from '../utils/whatsapp'
import WhatsAppButton from './WhatsAppButton.vue'
</script>

<template><footer class="border-t border-white/10 bg-black"><div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8"><div><p class="font-display text-3xl text-gold-300">{{ appConfig.businessName }}</p><p class="mt-3 max-w-sm text-sm leading-6 text-zinc-500">{{ appConfig.tagline }}. Consultanos y te ayudamos a elegir tu próxima fragancia.</p></div><div class="space-y-4 md:text-right"><WhatsAppButton :href="priceListWhatsAppUrl()" label="Pedinos la lista de precios" /><div><a :href="createWhatsAppUrl('Hola, quisiera consultar el estado de mi pedido.')" target="_blank" class="text-sm text-zinc-400 hover:text-gold-300">Seguimiento de pedido</a></div><div><a :href="appConfig.instagram" target="_blank" rel="noopener noreferrer" class="text-sm text-zinc-400 hover:text-gold-300">Seguinos en Instagram</a></div></div></div><div class="border-t border-white/10 px-4 py-5 text-center text-xs text-zinc-600">© {{ new Date().getFullYear() }} {{ appConfig.businessName }}. Todos los derechos reservados.</div></footer></template>
