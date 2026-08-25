<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import Header from '../components/Header.vue'
import PromoBanner from '../components/PromoBanner.vue'
import Hero from '../components/Hero.vue'
import BenefitsBar from '../components/BenefitsBar.vue'
import BrandCarousel from '../components/BrandCarousel.vue'
import FilterBar from '../components/FilterBar.vue'
import PerfumeGrid from '../components/PerfumeGrid.vue'
import BrandCatalog from '../components/BrandCatalog.vue'
import FeaturedSection from '../components/FeaturedSection.vue'
import CartDrawer from '../components/CartDrawer.vue'
import PerfumeDetail from '../components/PerfumeDetail.vue'
import RecommenderQuiz from '../components/RecommenderQuiz.vue'
import AboutFaq from '../components/AboutFaq.vue'
import InstagramSection from '../components/InstagramSection.vue'
import BackToTop from '../components/BackToTop.vue'
import CompareDrawer from '../components/CompareDrawer.vue'
import RecentlyViewed from '../components/RecentlyViewed.vue'
import PwaControls from '../components/PwaControls.vue'
import ExtrasHub from '../components/ExtrasHub.vue'
import Footer from '../components/Footer.vue'
import { getPerfumes } from '../services/perfumesService'
import { saveCart } from '../services/backendService'

const perfumes = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const category = ref('Todos')
const gender = ref('Todos')
const brand = ref('Todas')
const size = ref('Todas')
const sort = ref('az')
const maxPrice = ref(1000000)
const favoritesOnly = ref(false)
const note = ref('Todas')
const visibleCount = ref(12)
const selectedPerfume = ref(null)
const cartOpen = ref(false)
const cartPulse = ref(0)
const recommenderOpen = ref(false)
const compareOpen = ref(false)
const cart = ref(JSON.parse(localStorage.getItem('gangas-cart') || '[]'))
const favoriteIds = ref(JSON.parse(localStorage.getItem('gangas-favorites') || '[]'))
const compareItems = ref(JSON.parse(localStorage.getItem('gangas-compare') || '[]'))
const recentIds = ref(JSON.parse(localStorage.getItem('gangas-recent') || '[]'))
const recoveredCart = ref(cart.value.length > 0)

onMounted(async () => {
  try { perfumes.value = await getPerfumes() }
  catch (e) { error.value = e.message || 'Ocurrió un error al cargar el catálogo.' }
  finally { loading.value = false }
})

watch(cart, (value) => { localStorage.setItem('gangas-cart', JSON.stringify(value)); saveCart(value).catch(() => {}) }, { deep: true })
watch(favoriteIds, (value) => localStorage.setItem('gangas-favorites', JSON.stringify(value)), { deep: true })
watch(compareItems, (value) => localStorage.setItem('gangas-compare', JSON.stringify(value)), { deep: true })
watch(recentIds, (value) => localStorage.setItem('gangas-recent', JSON.stringify(value)), { deep: true })
watch(selectedPerfume, (perfume) => { if (perfume) recentIds.value = [perfume.id, ...recentIds.value.filter((id) => id !== perfume.id)].slice(0, 4) })
watch([search, category, gender, brand, size, note, sort, maxPrice, favoritesOnly], () => { visibleCount.value = 12 })
watch(brand, async (value) => {
  if (value === 'Todas') return
  await nextTick()
  const section = [...document.querySelectorAll('[data-brand-section]')].find((item) => item.dataset.brand === value)
  ;(section || document.querySelector('#catalogo'))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

const brands = computed(() => [...new Set(perfumes.value.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'es')))
const filtered = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('es')
  const result = perfumes.value.filter((p) =>
    (!term || `${p.name} ${p.brand}`.toLocaleLowerCase('es').includes(term)) &&
    (category.value === 'Todos' || p.category === category.value) &&
    (gender.value === 'Todos' || p.gender === gender.value) &&
    (brand.value === 'Todas' || p.brand === brand.value) &&
    (size.value === 'Todas' || p.size === size.value) && p.priceArs <= maxPrice.value &&
    (note.value === 'Todas' || p.notes?.includes(note.value)) &&
    (!favoritesOnly.value || favoriteIds.value.includes(p.id)))
  return result.sort((a, b) => sort.value === 'price-low' ? a.priceArs - b.priceArs : sort.value === 'price-high' ? b.priceArs - a.priceArs : sort.value === 'brand' ? a.brand.localeCompare(b.brand, 'es') : a.name.localeCompare(b.name, 'es'))
})
const visiblePerfumes = computed(() => filtered.value.slice(0, visibleCount.value))
const featured = computed(() => perfumes.value.filter((p) => p.featured).slice(0, 4))
const bestsellers = computed(() => perfumes.value.filter((p) => p.bestseller).slice(0, 4))
const newArrivals = computed(() => perfumes.value.slice(-4).reverse())
const weeklyRanking = computed(() => perfumes.value.filter((p) => p.availability === 'Disponible').slice(0, 4))
const recentPerfumes = computed(() => recentIds.value.map((id) => perfumes.value.find((item) => item.id === id)).filter(Boolean))

function addToCart(perfume) {
  const item = cart.value.find((entry) => entry.perfume.id === perfume.id)
  if (item) item.quantity += 1
  else cart.value.push({ perfume, quantity: 1 })
  selectedPerfume.value = null
  cartPulse.value += 1
}

function changeQuantity(id, amount) {
  const item = cart.value.find((entry) => entry.perfume.id === id)
  if (!item) return
  item.quantity += amount
  if (item.quantity <= 0) removeFromCart(id)
}

function removeFromCart(id) { cart.value = cart.value.filter((entry) => entry.perfume.id !== id) }
function toggleFavorite(id) { favoriteIds.value = favoriteIds.value.includes(id) ? favoriteIds.value.filter((item) => item !== id) : [...favoriteIds.value, id] }
function toggleCompare(perfume) { if (compareItems.value.some((item) => item.id === perfume.id)) compareItems.value = compareItems.value.filter((item) => item.id !== perfume.id); else if (compareItems.value.length < 3) compareItems.value.push(perfume); compareOpen.value = true }
function selectBrand(value) { brand.value = value }
async function selectSuggestion(item) {
  if (item.type === 'brand') { search.value = ''; brand.value = item.label; return }
  search.value = item.perfume.name
  selectedPerfume.value = item.perfume
  await nextTick()
  document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function openRecoveredCart() { recoveredCart.value = false; cartOpen.value = true }
const relatedPerfumes = computed(() => selectedPerfume.value ? perfumes.value.filter((item) => item.id !== selectedPerfume.value.id && (item.brand === selectedPerfume.value.brand || item.style === selectedPerfume.value.style)).slice(0, 4) : [])
const retry = () => globalThis.location.reload()
</script>

<template>
  <div class="min-h-screen bg-ink">
    <button v-if="recoveredCart" class="fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-full border border-gold-400/30 bg-panel px-5 py-3 text-sm shadow-2xl" @click="openRecoveredCart">Recuperamos tu carrito · Ver</button>
    <PromoBanner />
    <Header v-model:search="search" :perfumes="perfumes" @select-suggestion="selectSuggestion" />
    <main>
      <Hero />
      <BenefitsBar />
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="py-12 text-center"><p class="text-xs uppercase tracking-[0.22em] text-gold-400">¿No sabés cuál elegir?</p><h2 class="mt-3 font-display text-4xl">Te recomendamos según tus gustos</h2><button class="mt-6 rounded-full bg-gold-400 px-8 py-4 font-bold text-ink" @click="recommenderOpen = true">Descubrir mi perfume</button></div>
        <BrandCarousel :brands="brands" :selected="brand" @select="selectBrand" />
        <FeaturedSection id="mas-vendidos" eyebrow="Los favoritos" title="Más vendidos" description="Fragancias elegidas una y otra vez por nuestra comunidad." :perfumes="bestsellers" :favorite-ids="favoriteIds" @add="addToCart" @detail="selectedPerfume = $event" @favorite="toggleFavorite" @compare="toggleCompare" />
        <FeaturedSection id="destacados" eyebrow="Selección especial" title="Destacados" description="Una curaduría de perfumes con personalidad para cada ocasión." :perfumes="featured" :favorite-ids="favoriteIds" @add="addToCart" @detail="selectedPerfume = $event" @favorite="toggleFavorite" @compare="toggleCompare" />
        <FeaturedSection eyebrow="Recién llegados" title="Nuevos ingresos" description="Las incorporaciones más recientes del catálogo." :perfumes="newArrivals" :favorite-ids="favoriteIds" @add="addToCart" @detail="selectedPerfume = $event" @favorite="toggleFavorite" @compare="toggleCompare" />
        <FeaturedSection eyebrow="Tendencias" title="Ranking semanal" description="Los perfumes que están marcando tendencia esta semana." :perfumes="weeklyRanking" :favorite-ids="favoriteIds" @add="addToCart" @detail="selectedPerfume = $event" @favorite="toggleFavorite" @compare="toggleCompare" />
        <section id="catalogo" class="scroll-mt-44 py-14 sm:py-20">
          <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p class="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">Todas las fragancias</p><h2 class="mt-2 font-display text-4xl font-semibold sm:text-5xl">Catálogo por marcas</h2></div><p v-if="!loading && !error" class="text-sm text-zinc-500">{{ filtered.length }} {{ filtered.length === 1 ? 'perfume' : 'perfumes' }}</p></div>
          <FilterBar v-model:category="category" v-model:gender="gender" v-model:brand="brand" v-model:size="size" v-model:note="note" v-model:sort="sort" v-model:max-price="maxPrice" v-model:favorites-only="favoritesOnly" :brands="brands" />
          <div v-if="error" role="alert" class="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-center text-red-200"><p class="font-semibold">No pudimos cargar el catálogo</p><p class="mt-1 text-sm text-red-200/70">{{ error }}</p><button class="mt-4 rounded-full border border-red-200/30 px-4 py-2 text-sm" @click="retry">Reintentar</button></div>
          <div v-else class="mt-8">
            <PerfumeGrid v-if="loading" :perfumes="[]" loading />
            <BrandCatalog v-else :perfumes="visiblePerfumes" :favorite-ids="favoriteIds" @add="addToCart" @detail="selectedPerfume = $event" @favorite="toggleFavorite" @compare="toggleCompare" />
            <button v-if="visibleCount < filtered.length" class="mx-auto mt-12 block rounded-full border border-gold-400/40 px-8 py-3 font-semibold text-gold-300 hover:bg-gold-400 hover:text-ink" @click="visibleCount += 12">Ver más perfumes</button>
          </div>
        </section>
        <ExtrasHub :perfumes="perfumes" :favorite-ids="favoriteIds" @add="addToCart" @detail="selectedPerfume = $event" @favorite="toggleFavorite" />
        <RecentlyViewed :perfumes="recentPerfumes" :favorite-ids="favoriteIds" @add="addToCart" @detail="selectedPerfume = $event" @favorite="toggleFavorite" @compare="toggleCompare" />
        <PwaControls />
        <InstagramSection />
        <AboutFaq />
      </div>
    </main>
    <Footer />
    <CartDrawer :open="cartOpen" :items="cart" :pulse-key="cartPulse" @close="cartOpen = !cartOpen" @increase="changeQuantity($event, 1)" @decrease="changeQuantity($event, -1)" @remove="removeFromCart" @clear="cart = []" />
    <PerfumeDetail :perfume="selectedPerfume" :related="relatedPerfumes" :favorite="selectedPerfume ? favoriteIds.includes(selectedPerfume.id) : false" @close="selectedPerfume = null" @add="addToCart" @detail="selectedPerfume = $event" @favorite="toggleFavorite" />
    <RecommenderQuiz :open="recommenderOpen" :perfumes="perfumes" @close="recommenderOpen = false" @add="addToCart" @detail="selectedPerfume = $event; recommenderOpen = false" />
    <button v-if="compareItems.length" class="fixed bottom-5 left-5 z-40 rounded-full border border-gold-400 bg-panel px-5 py-4 text-sm font-bold text-gold-300 shadow-2xl" @click="compareOpen = true">Comparar {{ compareItems.length }}</button>
    <CompareDrawer :open="compareOpen" :items="compareItems" @close="compareOpen = false" @remove="compareItems = compareItems.filter(item => item.id !== $event)" @detail="selectedPerfume = $event; compareOpen = false" />
    <BackToTop />
  </div>
</template>
