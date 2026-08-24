<script setup>
import { computed, ref } from 'vue'
import { appConfig } from '../config/appConfig'
import { cartWhatsAppUrl } from '../utils/whatsapp'
import { createOrder, saveCustomer, validateCoupon } from '../services/backendService'

const props = defineProps({ open: Boolean, items: { type: Array, default: () => [] }, pulseKey: { type: Number, default: 0 } })
defineEmits(['close', 'remove', 'increase', 'decrease', 'clear'])
const count = computed(() => props.items.reduce((total, item) => total + item.quantity, 0))
const total = computed(() => props.items.reduce((sum, item) => sum + item.perfume.priceArs * item.quantity, 0))
const customer = ref(JSON.parse(localStorage.getItem('gangas-customer') || '{"name":"","phone":""}'))
const couponCode = ref('')
const coupon = ref(null)
const couponMessage = ref('')
const finalTotal = computed(() => Math.max(0, total.value - (coupon.value?.discount || 0)))
const money = (value) => new Intl.NumberFormat(appConfig.currency.locale, { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
const shareCart = async () => {
  const text = `Mi selección en Gangas Olfativas:\n${props.items.map((item) => `${item.quantity}x ${item.perfume.name}`).join('\n')}`
  if (navigator.share) await navigator.share({ title: 'Mi carrito', text })
  else await navigator.clipboard.writeText(text)
}
async function applyCoupon() {
  coupon.value = await validateCoupon(couponCode.value, total.value)
  couponMessage.value = coupon.value ? `Descuento: ${money(coupon.value.discount)}` : 'Cupón no válido.'
}
async function checkout() {
  if (customer.value.phone) {
    await saveCustomer(customer.value)
    await createOrder(props.items, customer.value, coupon.value)
  }
  window.open(cartWhatsAppUrl(props.items), '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <button :key="pulseKey" data-cart-button class="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-gold-400 px-5 font-bold text-ink shadow-2xl" :class="pulseKey ? 'animate-bounce' : ''" @click="$emit('close')" aria-label="Abrir carrito">
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
    Carrito <span class="rounded-full bg-ink px-2 py-0.5 text-xs text-white">{{ count }}</span>
  </button>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" @click.self="$emit('close')">
    <aside class="ml-auto flex h-full w-full max-w-md animate-[slide-in_.35s_ease-out] flex-col border-l border-white/10 bg-panel p-5 shadow-2xl">
      <div class="flex items-center justify-between"><div><p class="text-xs uppercase tracking-widest text-gold-400">Tu selección</p><h2 class="font-display text-3xl">Carrito</h2></div><button class="h-10 w-10 rounded-full border border-white/10 text-xl" @click="$emit('close')">×</button></div>
      <div v-if="items.length" class="mt-6 flex-1 space-y-3 overflow-y-auto">
        <article v-for="item in items" :key="item.perfume.id" class="flex gap-3 rounded-xl border border-white/10 p-3">
          <img :src="item.perfume.image" :alt="item.perfume.name" class="h-20 w-20 rounded-lg bg-black object-cover" />
          <div class="min-w-0 flex-1"><p class="truncate font-semibold">{{ item.perfume.name }}</p><p class="text-xs text-zinc-500">{{ item.perfume.size }} · {{ money(item.perfume.priceArs) }}</p><div class="mt-3 flex items-center gap-3"><button class="h-7 w-7 rounded-full border border-white/15" @click="$emit('decrease', item.perfume.id)">−</button><span>{{ item.quantity }}</span><button class="h-7 w-7 rounded-full border border-white/15" @click="$emit('increase', item.perfume.id)">+</button><button class="ml-auto text-xs text-red-300" @click="$emit('remove', item.perfume.id)">Quitar</button></div></div>
        </article>
      </div>
      <div v-else class="flex flex-1 items-center justify-center text-zinc-500">Tu carrito está vacío.</div>
      <div v-if="items.length" class="border-t border-white/10 pt-5"><div class="grid grid-cols-2 gap-2"><input v-model="customer.name" class="rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm" placeholder="Tu nombre"><input v-model="customer.phone" inputmode="tel" class="rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm" placeholder="Tu celular"></div><div class="mt-3 flex gap-2"><input v-model="couponCode" class="min-w-0 flex-1 rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm uppercase" placeholder="Cupón"><button class="rounded-full border border-gold-400/40 px-4 text-sm text-gold-300" @click="applyCoupon">Aplicar</button></div><p v-if="couponMessage" class="mt-2 text-xs" :class="coupon ? 'text-green-300' : 'text-red-300'">{{ couponMessage }}</p><div class="my-4 flex justify-between"><span class="text-zinc-400">Total estimado</span><strong class="text-xl">{{ money(finalTotal) }}</strong></div><button class="block w-full rounded-full bg-[#25D366] px-5 py-3.5 text-center font-bold text-black" @click="checkout">Consultar todo por WhatsApp</button><button class="mt-3 w-full rounded-full border border-white/10 py-3 text-sm text-white" @click="shareCart">Compartir carrito</button><button class="mt-3 w-full text-sm text-zinc-500" @click="$emit('clear')">Vaciar carrito</button></div>
    </aside>
  </div>
</template>
