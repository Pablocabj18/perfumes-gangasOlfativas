const RATE_URLS = ['oficial', 'bna', 'blue'].map((type) => `https://monedapi.ar/api/v2/usd/${type}`)

export async function getAverageSellingRate() {
  const results = await Promise.allSettled(RATE_URLS.map(async (url) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Cotización no disponible')
    return Number((await response.json()).sell)
  }))
  const rates = results.filter((result) => result.status === 'fulfilled' && result.value).map((result) => result.value)
  if (rates.length < 2) throw new Error('No se pudo calcular la cotización promedio')
  return rates.reduce((total, rate) => total + rate, 0) / rates.length
}
