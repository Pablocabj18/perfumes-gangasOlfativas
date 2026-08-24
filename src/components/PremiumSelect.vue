<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({ modelValue: [String, Number], options: { type: Array, default: () => [] }, placeholder: { type: String, default: 'Seleccionar' } })
const emit = defineEmits(['update:modelValue'])
const open = ref(false)
const root = ref(null)
const normalized = computed(() => props.options.map((item) => typeof item === 'object' ? item : { label: item, value: item }))
const selectedLabel = computed(() => normalized.value.find((item) => item.value === props.modelValue)?.label || props.placeholder)
function select(value) { emit('update:modelValue', value); open.value = false }
function closeOutside(event) { if (!root.value?.contains(event.target)) open.value = false }
onMounted(() => document.addEventListener('pointerdown', closeOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeOutside))
</script>

<template>
  <div ref="root" class="relative">
    <button type="button" class="flex w-full items-center justify-between rounded-2xl border bg-black/25 px-4 py-3 text-left text-sm transition" :class="open ? 'border-gold-400 ring-2 ring-gold-400/10' : 'border-white/10 hover:border-gold-400/30'" @click="open = !open" @keydown.escape="open = false">
      <span class="truncate text-white">{{ selectedLabel }}</span>
      <span class="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-gold-300 transition" :class="open ? 'rotate-180 bg-gold-400 text-ink' : ''"><svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 8 4 4 4-4"/></svg></span>
    </button>
    <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="-translate-y-2 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100" leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="-translate-y-1 opacity-0 scale-95">
      <div v-if="open" class="absolute left-0 right-0 z-50 mt-2 max-h-64 origin-top overflow-y-auto rounded-2xl border border-gold-400/20 bg-[#151515] p-2 shadow-2xl shadow-black/70 luxury-menu-scroll">
        <button v-for="item in normalized" :key="item.value" type="button" class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition" :class="item.value === modelValue ? 'bg-gold-400 text-ink' : 'text-zinc-300 hover:bg-white/[0.07] hover:text-white'" @click="select(item.value)"><span>{{ item.label }}</span><span v-if="item.value === modelValue">✓</span></button>
      </div>
    </Transition>
  </div>
</template>
