<script setup>const goTop = () => scrollTo({ top: 0, behavior: 'smooth' })</script>
<template><button class="fixed bottom-24 right-5 z-30 h-11 w-11 rounded-full border border-white/15 bg-panel text-gold-300 shadow-xl" aria-label="Volver arriba" @click="goTop">↑</button></template>
