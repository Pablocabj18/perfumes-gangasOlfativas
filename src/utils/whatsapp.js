import { appConfig } from '../config/appConfig'

export function createWhatsAppUrl(message) {
  const number = appConfig.whatsappNumber.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function perfumeWhatsAppUrl(perfume) {
  return createWhatsAppUrl(`Hola, vi el ${perfume.name} ${perfume.size} en ${appConfig.businessName}. ¿Sigue disponible?`)
}

export function priceListWhatsAppUrl() {
  return createWhatsAppUrl(`Hola, quisiera recibir la lista de precios de ${appConfig.businessName}.`)
}

export function cartWhatsAppUrl(items) {
  const lines = items.map(({ perfume, quantity }) => `• ${quantity}x ${perfume.name} ${perfume.size}`)
  return createWhatsAppUrl(`Hola, quiero consultar por estos perfumes:\n\n${lines.join('\n')}\n\n¿Están disponibles?`)
}
