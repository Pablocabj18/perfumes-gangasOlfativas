import { perfumesMock } from '../data/perfumes.mock'
import { perfumeImageUrl, resolveBrand } from '../utils/brandResolver'
import { getAverageSellingRate } from './exchangeRateService'
import { buildFragranceProfile } from '../utils/fragranceProfile'

const truthy = (value) => ['true', '1', 'sí', 'si', 'x'].includes(String(value ?? '').trim().toLowerCase())

const canonical = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

function valueFor(row, ...names) {
  const entries = Object.entries(row)
  for (const name of names) {
    const target = canonical(name)
    const entry = entries.find(([key]) => canonical(key) === target || canonical(key).endsWith(target))
    if (entry) return entry[1]
  }
  return undefined
}

function parsePrice(value) {
  if (typeof value === 'number') return value
  const clean = String(value ?? '').replace(/[^\d.,-]/g, '')
  if (!clean) return 0
  if (clean.includes(',') && clean.includes('.')) return Number(clean.replace(/,/g, ''))
  if (/,\d{3}$/.test(clean)) return Number(clean.replace(',', ''))
  return Number(clean.replace(',', '.')) || 0
}

function normalizeRow(row, index = 0) {
  const name = valueFor(row, 'nombre', 'perfume', 'name') ?? ''
  const brand = resolveBrand(name, valueFor(row, 'marca', 'brand'))
  const perfume = {
    id: valueFor(row, 'id') || `${canonical(name).replace(/[^a-z0-9]+/g, '-')}-${index}`,
    name,
    brand,
    category: valueFor(row, 'categoría', 'categoria', 'category') ?? '',
    gender: valueFor(row, 'público', 'publico', 'gender') ?? '',
    size: valueFor(row, 'presentación', 'presentacion', 'size') ?? '',
    priceUsd: parsePrice(valueFor(row, 'precioUSD', 'precio USD', 'priceUsd')),
    priceArs: parsePrice(valueFor(row, 'precioARS', 'precio ARS', 'priceArs')),
    availability: valueFor(row, 'disponibilidad', 'availability') || 'Disponible',
    image: valueFor(row, 'imagen', 'image') || perfumeImageUrl(name, brand),
    featured: truthy(valueFor(row, 'destacado', 'featured')),
    bestseller: truthy(valueFor(row, 'bestseller')),
  }
  return { ...perfume, ...buildFragranceProfile(perfume) }
}

function csvToRows(csv) {
  const lines = csv.trim().split(/\r?\n/)
  const parse = (line) => {
    const cells = []
    let current = ''
    let quoted = false
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i]
      if (char === '"' && line[i + 1] === '"' && quoted) { current += '"'; i += 1 }
      else if (char === '"') quoted = !quoted
      else if (char === ',' && !quoted) { cells.push(current); current = '' }
      else current += char
    }
    cells.push(current)
    return cells
  }
  const headers = parse(lines.shift()).map((item) => item.trim())
  return lines.filter(Boolean).map((line) => Object.fromEntries(parse(line).map((value, index) => [headers[index], value.trim()])))
}

export async function getPerfumes() {
  if (import.meta.env.VITE_DATA_SOURCE !== 'sheets') return perfumesMock.map(normalizeRow)
  const url = import.meta.env.VITE_GOOGLE_SHEETS_URL
  if (!url) throw new Error('Falta configurar VITE_GOOGLE_SHEETS_URL')
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error('No se pudo cargar el catálogo')
  const perfumes = csvToRows(await response.text()).map(normalizeRow).filter((perfume) => perfume.name)
  const rateResult = await getAverageSellingRate().catch(() => null)
  if (!rateResult) return perfumes
  return perfumes.map((perfume) => ({
    ...perfume,
    priceArs: Math.round((perfume.priceUsd * rateResult) / 1000) * 1000,
  }))
}
