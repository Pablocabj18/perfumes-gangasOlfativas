<script setup>
defineProps({ href: { type: String, required: true }, label: { type: String, default: 'Consultar por WhatsApp' }, compact: Boolean })
</script>

<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-black transition hover:bg-[#49df7d] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-ink" :class="compact ? 'px-4 py-2.5 text-sm' : 'px-5 py-3 text-sm'">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a9.8 9.8 0 0 0-8.42 14.82L2.05 22l5.3-1.47A9.94 9.94 0 1 0 12 2Zm0 17.95a8 8 0 0 1-4.08-1.12l-.29-.17-3.14.87.84-3.07-.19-.31A8.04 8.04 0 1 1 12 19.95Zm4.4-6.02c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.26 7.26 0 0 1-1.34-1.67c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z"/></svg>
    {{ label }}
  </a>
</template>
