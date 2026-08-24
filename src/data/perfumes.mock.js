const img = (seed) => `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=900&q=80`

export const perfumesMock = [
  { id: 1, name: 'JPG Le Male Elixir', brand: 'Jean Paul Gaultier', category: 'Diseñador', gender: 'Hombre', size: '125 ml', priceUsd: 165, priceArs: 248000, availability: 'Disponible', image: img('1594035910387-fea47794261f'), featured: true, bestseller: true },
  { id: 2, name: 'JPG Paradise Garden', brand: 'Jean Paul Gaultier', category: 'Diseñador', gender: 'Hombre', size: '125 ml', priceUsd: 155, priceArs: 233000, availability: 'Disponible', image: img('1619994403073-2cec844b8e63'), featured: true, bestseller: true },
  { id: 3, name: 'Invictus Victory Elixir', brand: 'Rabanne', category: 'Diseñador', gender: 'Hombre', size: '100 ml', priceUsd: 145, priceArs: 218000, availability: 'En falta', image: img('1541643600914-78b084683601'), featured: false, bestseller: true },
  { id: 4, name: 'The Most Wanted Parfum', brand: 'Azzaro', category: 'Diseñador', gender: 'Hombre', size: '100 ml', priceUsd: 135, priceArs: 203000, availability: 'Disponible', image: img('1592945403244-b3fbafd7f539'), featured: true, bestseller: false },
  { id: 5, name: 'Uomo Born in Roma Coral Fantasy', brand: 'Valentino', category: 'Diseñador', gender: 'Hombre', size: '100 ml', priceUsd: 145, priceArs: 218000, availability: 'Próximamente', image: img('1563170351-be82bc888aa4'), featured: false, bestseller: true },
  { id: 6, name: 'Bleu de Chanel EDP', brand: 'Chanel', category: 'Diseñador', gender: 'Hombre', size: '100 ml', priceUsd: 185, priceArs: 278000, availability: 'Disponible', image: img('1615634260167-c8cdede054de'), featured: true, bestseller: true },
  { id: 7, name: '9 PM', brand: 'Afnan', category: 'Árabe', gender: 'Hombre', size: '100 ml', priceUsd: 55, priceArs: 83000, availability: 'Disponible', image: img('1590156546946-ce55a12a6a08'), featured: false, bestseller: true },
  { id: 8, name: 'Khamrah Qahwa', brand: 'Lattafa', category: 'Árabe', gender: 'Unisex', size: '100 ml', priceUsd: 65, priceArs: 98000, availability: 'Disponible', image: img('1610461888750-10bfc601b874'), featured: true, bestseller: true },
  { id: 9, name: 'Bharara King', brand: 'Bharara', category: 'Árabe', gender: 'Hombre', size: '100 ml', priceUsd: 90, priceArs: 135000, availability: 'Próximamente', image: img('1595425970377-c9703cf48b6d'), featured: true, bestseller: false },
  { id: 10, name: 'Hawas Ice', brand: 'Rasasi', category: 'Árabe', gender: 'Hombre', size: '100 ml', priceUsd: 75, priceArs: 113000, availability: 'Disponible', image: img('1587017539504-67cfbddac569'), featured: false, bestseller: true },
]
