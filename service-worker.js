// FinVision Service Worker - PWA Support
const CACHE_NAME = "finvision-v1.0.0"
const RUNTIME_CACHE = "finvision-runtime"

// Recursos para cache offline
const PRECACHE_URLS = [
  "/",
  "/dashboard",
  "/transacoes",
  "/metas",
  "/investimentos",
  "/assistente",
  "/configuracoes",
  "/corporativo",
  "/manifest.json",
  "/icon-192x192.jpg",
  "/icon-512x512.jpg",
]

// Instalação - Pre-cache de recursos estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Pre-caching app shell")
        return cache.addAll(PRECACHE_URLS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Ativação - Limpar caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log("[SW] Removing old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch - Estratégia Network First com fallback para cache
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Para requisições de navegação, use Network First
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.match("/")
        })
      }),
    )
    return
  }

  // Para outros recursos, use Cache First com network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return caches.open(RUNTIME_CACHE).then((cache) => {
        return fetch(event.request).then((response) => {
          // Cache apenas respostas válidas
          if (response && response.status === 200) {
            cache.put(event.request, response.clone())
          }
          return response
        })
      })
    }),
  )
})

// Mensagens do cliente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
