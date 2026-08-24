const includesAny = (text, words) => words.some((word) => text.includes(word))

export function buildFragranceProfile(perfume) {
  const text = `${perfume.name} ${perfume.brand}`.toLowerCase()
  const fresh = includesAny(text, ['aqua', 'blue', 'bleu', 'ice', 'malibu', 'tropical', 'light blue', 'profondo', 'dive', 'verde'])
  const sweet = includesAny(text, ['elixir', 'khamrah', 'wanted', 'stronger', 'one million', 'scandal', 'vanilla', 'bourbon', 'qahwa'])
  const intense = includesAny(text, ['intense', 'elixir', 'parfum', 'absolu', 'black', 'noir', 'oud', 'privée'])
  const elegant = ['Nicho', 'Diseñador'].includes(perfume.category) || includesAny(text, ['chanel', 'dior', 'creed', 'xerjoff', 'valentino'])
  const style = fresh ? 'Fresco' : sweet ? 'Dulce' : intense ? 'Intenso' : elegant ? 'Elegante' : 'Versátil'
  const concentration = includesAny(text, ['parfum', 'elixir', 'absolu']) ? 'Parfum / Elixir' : text.includes('edt') ? 'Eau de Toilette' : 'Eau de Parfum'
  const family = fresh ? 'Cítrica acuática' : sweet ? 'Ámbar gourmand' : intense ? 'Amaderada especiada' : elegant ? 'Aromática amaderada' : 'Aromática'
  return {
    style,
    family,
    concentration,
    notes: fresh ? ['Cítricos', 'Acuáticos', 'Maderas'] : sweet ? ['Vainilla', 'Ámbar', 'Especias'] : intense ? ['Maderas', 'Ámbar', 'Especias'] : ['Aromáticos', 'Maderas', 'Almizcle'],
    duration: intense || sweet ? 'Alta' : 'Media',
    projection: intense ? 'Intensa' : sweet ? 'Moderada a intensa' : 'Moderada',
    occasion: fresh ? 'Día y uso diario' : intense ? 'Noche y ocasiones especiales' : 'Uso versátil',
    season: fresh ? 'Primavera / Verano' : sweet || intense ? 'Otoño / Invierno' : 'Todo el año',
  }
}

export function recommendationScore(perfume, answers) {
  const profile = buildFragranceProfile(perfume)
  let score = 0
  if (!answers.gender || answers.gender === 'Todos' || perfume.gender === answers.gender || perfume.gender === 'Unisex') score += 3
  if (profile.style === answers.style) score += 4
  if (profile.family === answers.family) score += 4
  if (profile.projection.toLowerCase().includes(answers.intensity?.toLowerCase() || '')) score += 2
  if (profile.season.toLowerCase().includes(answers.season?.toLowerCase() || '')) score += 2
  if (profile.occasion.toLowerCase().includes(answers.occasion?.toLowerCase() || '')) score += 2
  if (!answers.budget || perfume.priceArs <= answers.budget) score += 3
  return score
}
