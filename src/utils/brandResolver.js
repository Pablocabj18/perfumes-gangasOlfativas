const brandRules = [
  ['Carolina Herrera', /^(212|Bad Boy|La Bomba)/i],
  ['Giorgio Armani', /^(Acqua di Giò|Stronger With You)/i],
  ['Afnan', /^(Afnan|Supremacy)/i],
  ['Al Haramain', /^Al Haramain/i],
  ['Lattafa', /^(Art of Universe|Asad|Atlas|Bade'e Al Oud|Fakhar|His Confession|Honor & Glory|Khamrah|Teriaq|The Kingdom|Vintage Radio)/i],
  ['Azzaro', /^Azzaro/i],
  ['Bharara', /^Bharara/i],
  ['Yves Saint Laurent', /^(Black Opium|Libre|MYSLF|YSL Y)/i],
  ['Chanel', /^Bleu de Chanel/i],
  ['Bvlgari', /^Bvlgari/i],
  ['Armaf', /^(Club de Nuit|Odyssey)/i],
  ['Creed', /^Creed/i],
  ['Dolce & Gabbana', /^Dolce & Gabbana/i],
  ['Xerjoff', /^(Erba Gold|Erba Pura|Naxos|Torino 21)/i],
  ['Givenchy', /^(Givenchy|Irresistible)/i],
  ['Rasasi', /^Hawas/i],
  ['Rabanne', /^(Invictus|One Million)/i],
  ['Issey Miyake', /^Issey Miyake/i],
  ['Maison Alhambra', /^(Jean Lowe|Maison Alhambra|Salvo)/i],
  ['Jean Paul Gaultier', /^(JPG|Scandal)/i],
  ['Lancôme', /^Lancôme/i],
  ['French Avenue', /^Liquid Brun/i],
  ['Mancera', /^Mancera/i],
  ['Dior', /^(Miss Dior|Sauvage)/i],
  ['Montale', /^Montale/i],
  ['Parfums de Marly', /^Parfums de Marly/i],
  ['Rayhaan', /^Rayhaan/i],
  ['Viktor & Rolf', /^Spicebomb/i],
  ['Valentino', /^Valentino/i],
  ['Versace', /^Versace/i],
]

export function resolveBrand(name, sheetBrand = '') {
  if (sheetBrand && sheetBrand !== 'Marca no informada') return sheetBrand
  return brandRules.find(([, pattern]) => pattern.test(name))?.[0] || 'Otras marcas'
}

export function perfumeImageUrl(name, brand) {
  const query = encodeURIComponent(`${brand} ${name} perfume bottle product`)
  return `https://tse1.mm.bing.net/th?q=${query}&pid=Api&w=700&h=700&c=7&rs=1`
}
