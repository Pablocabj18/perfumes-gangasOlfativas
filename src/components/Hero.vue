<script setup>
import { appConfig } from '../config/appConfig'
import heroImage from '../assets/hero-perfume.webp'
</script>

<template>
  <section id="inicio" class="relative isolate min-h-[570px] overflow-hidden border-b border-white/10">
    <img :src="heroImage" alt="Frasco de perfume sobre un fondo oscuro con luz dorada" class="absolute inset-0 -z-20 h-full w-full object-cover object-[67%_center] sm:object-center" fetchpriority="high" />
    <div class="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/20 sm:via-black/70"></div>
    <div class="mx-auto flex min-h-[570px] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
      <div class="max-w-2xl">
        <p class="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">{{ appConfig.businessName }}</p>
        <h1 class="font-display text-5xl font-semibold leading-[0.95] text-white sm:text-7xl">{{ appConfig.heroTitle }}</h1>
        <p class="mt-6 max-w-md text-base leading-7 text-zinc-300 sm:text-lg">{{ appConfig.tagline }}</p>
        <a href="#catalogo" class="mt-9 inline-flex rounded-full bg-gold-400 px-7 py-3.5 text-sm font-bold text-ink transition hover:bg-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-black">Ver perfumes</a>
      </div>
    </div>
  </section>
</template>
