# Gangas Olfativas

Catálogo web mobile-first para un emprendimiento de perfumes. Permite explorar fragancias, buscar por nombre o marca, combinar filtros y consultar cada producto directamente por WhatsApp.

## Stack

- Vue 3 + Vite + JavaScript
- Tailwind CSS
- Fuente de datos intercambiable: mocks o Google Sheets público
- Firebase Hosting con soporte para rutas SPA

## 1. Instalación

Requiere Node.js 20.19+ o 22.12+.

```bash
npm install
```

## 2. Desarrollo

```bash
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## 3. Configuración del negocio y WhatsApp

Editar `src/config/appConfig.js`. El número debe tener código de país y área, sin `+`, espacios ni guiones. Ejemplo para Argentina: `54911XXXXXXXX`.

También se configuran allí el nombre, Instagram, textos y formato de moneda. Todos los enlaces y mensajes de WhatsApp se generan en `src/utils/whatsapp.js`.

## 4. Agregar perfumes

Mientras se use el modo mock, editar `src/data/perfumes.mock.js`. Cada perfume utiliza:

```js
{
  id: 1,
  name: 'JPG Le Male Elixir',
  brand: 'Jean Paul Gaultier',
  category: 'Diseñador',
  gender: 'Hombre',
  size: '125 ml',
  priceUsd: 165,
  priceArs: 248000,
  availability: 'Disponible',
  image: 'https://...',
  featured: true,
  bestseller: true
}
```

Si `image` está vacío o la URL falla, la tarjeta muestra automáticamente un placeholder.

## 5. Categorías, público y estados

Los filtros visibles se encuentran en `src/components/FilterBar.vue`. Categorías actuales: `Diseñador`, `Árabe` y `Nicho`. Públicos: `Hombre`, `Mujer` y `Unisex`.

Estados admitidos: `Disponible`, `En falta` y `Próximamente`. Para agregar opciones nuevas, actualizar el filtro y, si corresponde, el mapa visual `badgeClass` de `PerfumeCard.vue`.

## 6. Conectar Google Sheets

La interfaz nunca consulta Sheets directamente: solo usa `src/services/perfumesService.js`. Esto permite reemplazar ese servicio por Supabase sin modificar los componentes.

1. Crear una hoja exclusiva para datos públicos con estos encabezados exactos:
   `id`, `nombre`, `marca`, `categoría`, `público`, `presentación`, `precioUSD`, `precioARS`, `disponibilidad`, `imagen`, `destacado`, `bestseller`.
2. No incluir costo de proveedor, margen, ganancia ni notas internas. Mantenerlos en otro archivo u hoja privada no publicada.
3. En Google Sheets, usar **Archivo > Compartir > Publicar en la Web**, elegir la pestaña pública y formato CSV.
4. Copiar `.env.example` a `.env.local` y configurar:

```env
VITE_DATA_SOURCE=sheets
VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
```

5. Reiniciar `npm run dev`.

Los campos `destacado` y `bestseller` aceptan `TRUE`, `1`, `sí` o `x`. Las variables `VITE_*` se incluyen en el navegador: la URL debe apuntar únicamente a una hoja pública. No guardar claves privadas en ellas.

Para volver a los datos locales, usar `VITE_DATA_SOURCE=mock`.

### Migración futura a Supabase

Mantener la función pública `getPerfumes()` y devolver objetos con el mismo formato normalizado. Solo será necesario reemplazar la implementación de `src/services/perfumesService.js`; la UI no cambia.

## 7. Compilar

```bash
npm run build
npm run preview
```

La salida de producción se genera en `dist/`.

## 8. Publicar con Firebase Hosting

Instalar Firebase CLI si todavía no está disponible:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

Durante la inicialización:

- Seleccionar o crear el proyecto Firebase.
- Usar `dist` como directorio público.
- Responder **Sí** a “Configure as a single-page app”.
- No sobrescribir `index.html`.

El archivo `firebase.json` ya incluye el fallback SPA y caché para recursos estáticos.

```bash
npm run build
firebase deploy
```

## 9. Dominio propio

En Firebase Console abrir **Hosting > Agregar dominio personalizado**, ingresar el dominio y añadir en el proveedor DNS los registros que Firebase indique. La validación y el certificado SSL pueden tardar. Mantener el dominio registrado y renovar sus DNS según el proveedor.

## 10. SEO e identidad

Título, descripción, Open Graph y favicon están preparados en `index.html`. Antes de producción se puede reemplazar `public/og-image.jpg` por una imagen de marca de 1200 × 630 px y completar la URL pública definitiva en las etiquetas Open Graph.

## Seguridad

- `.env` y `.env.local` están ignorados por Git.
- El frontend no necesita credenciales privadas para leer una Sheet publicada.
- Nunca publicar inventario interno, costos, márgenes ni claves de servicios en Google Sheets público o variables `VITE_*`.
## Backend con Supabase

El esquema completo está en `supabase/schema.sql`. Crear un proyecto en Supabase, ejecutar ese archivo en SQL Editor, copiar `.env.example` como `.env` y completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

Incluye clientes, cumpleaños, cupones, puntos, referidos, carritos recuperables, pedidos y alertas de reposición. La clave `service_role` nunca debe agregarse al frontend.
