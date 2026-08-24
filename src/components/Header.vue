<script setup>
import { appConfig } from '../config/appConfig'
import { priceListWhatsAppUrl } from '../utils/whatsapp'
import SearchBar from './SearchBar.vue'
import WhatsAppButton from './WhatsAppButton.vue'
defineProps({ search: { type: String, default: '' } })
defineEmits(['update:search'])
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <a href="#inicio" class="shrink-0 font-display text-2xl font-semibold tracking-wide text-gold-300">{{ appConfig.businessName }}</a>
      <nav class="order-3 flex w-full gap-5 overflow-x-auto text-sm text-zinc-400 luxury-scroll sm:order-none sm:w-auto" aria-label="Principal">
        <a href="#catalogo" class="whitespace-nowrap hover:text-white">Catálogo</a><a href="#mas-vendidos" class="whitespace-nowrap hover:text-white">Más vendidos</a><a href="#destacados" class="whitespace-nowrap hover:text-white">Destacados</a>
      </nav>
      <div class="order-2 ml-auto hidden w-full max-w-xs lg:block"><SearchBar :model-value="search" @update:model-value="$emit('update:search', $event)" /></div>
      <WhatsAppButton class="ml-auto lg:ml-0" :href="priceListWhatsAppUrl()" label="WhatsApp" compact />
      <div class="order-4 w-full lg:hidden"><SearchBar :model-value="search" @update:model-value="$emit('update:search', $event)" /></div>
    </div>
  </header>
</template>
