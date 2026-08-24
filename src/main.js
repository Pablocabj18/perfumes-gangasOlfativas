import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

createApp(App).mount('#app')

if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js')

const pixelId = import.meta.env.VITE_META_PIXEL_ID
if (pixelId) {
  window.fbq = window.fbq || function () { window.fbq.callMethod ? window.fbq.callMethod(...arguments) : window.fbq.queue.push(arguments) }
  window.fbq.queue = []; window.fbq.loaded = true; window.fbq.version = '2.0'
  const script = document.createElement('script'); script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(script)
  window.fbq('init', pixelId); window.fbq('track', 'PageView')
}
