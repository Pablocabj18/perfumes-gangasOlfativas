import { hasSupabase, supabaseConfig } from '../config/supabaseConfig'

const localKey = 'gangas-customer'
const headers = () => ({ apikey: supabaseConfig.anonKey, Authorization: `Bearer ${supabaseConfig.anonKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation' })

async function request(path, options = {}) {
  if (!hasSupabase) return null
  const response = await fetch(`${supabaseConfig.url}/rest/v1/${path}`, { ...options, headers: { ...headers(), ...options.headers } })
  if (!response.ok) throw new Error('No pudimos guardar los datos.')
  return response.status === 204 ? null : response.json()
}

function getCustomer() {
  try { return JSON.parse(localStorage.getItem(localKey) || '{}') } catch { return {} }
}

export async function saveCustomer(data) {
  const customer = { ...getCustomer(), ...data }
  localStorage.setItem(localKey, JSON.stringify(customer))
  if (!hasSupabase || !customer.phone) return customer
  const rows = await request('customers?on_conflict=phone', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(customer) })
  return rows?.[0] || customer
}

export async function saveBirthday(birthday) {
  return saveCustomer({ birthday })
}

export async function saveCart(items) {
  const customer = getCustomer()
  if (!hasSupabase || !customer.phone) return null
  return request('saved_carts?on_conflict=customer_phone', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify({ customer_phone: customer.phone, items, updated_at: new Date().toISOString() }) })
}

export async function validateCoupon(code, total) {
  if (!hasSupabase) return code.toUpperCase() === 'GANGAS5' ? { code: 'GANGAS5', discount: Math.round(total * .05) } : null
  const rows = await request(`coupons?code=eq.${encodeURIComponent(code.toUpperCase())}&active=eq.true&select=code,discount_type,discount_value,min_purchase,expires_at`)
  const coupon = rows?.[0]
  if (!coupon || total < Number(coupon.min_purchase || 0) || (coupon.expires_at && new Date(coupon.expires_at) < new Date())) return null
  const discount = coupon.discount_type === 'fixed' ? Number(coupon.discount_value) : Math.round(total * Number(coupon.discount_value) / 100)
  return { code: coupon.code, discount }
}

export async function createReferral(referrerPhone, referredPhone) {
  if (!hasSupabase) return null
  return request('referrals', { method: 'POST', body: JSON.stringify({ referrer_phone: referrerPhone, referred_phone: referredPhone }) })
}

export async function createOrder(items, customer, coupon = null) {
  const subtotal = items.reduce((sum, item) => sum + item.perfume.priceArs * item.quantity, 0)
  if (!hasSupabase) return { id: crypto.randomUUID(), subtotal, status: 'pending' }
  const rows = await request('orders', { method: 'POST', body: JSON.stringify({ customer_phone: customer.phone, customer_name: customer.name, items, subtotal, coupon_code: coupon?.code || null, discount: coupon?.discount || 0 }) })
  return rows?.[0]
}

export async function getLoyalty(phone) {
  if (!hasSupabase || !phone) return { points: 0 }
  const rows = await request(`loyalty_accounts?customer_phone=eq.${encodeURIComponent(phone)}&select=points`)
  return rows?.[0] || { points: 0 }
}
