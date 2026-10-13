// Service worker for the installable app. It keeps the app shell and the built files on the device, so the app
// still opens without a connection. API responses and profile photos are never stored: they hold the student's data.

const CACHE = 'aztusp-shell'
const INDEX = '/index.html'
const FONT_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']

// Vite names built files with a content hash, so a changed file gets a new path listed in index.html.
function assetPaths(html) {
  return [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1])
}

// Stores the index.html that was just fetched, the files it links to, and drops the files of earlier builds.
async function refreshShell(response) {
  const cache = await caches.open(CACHE)
  const assets = assetPaths(await response.clone().text())
  await cache.put(INDEX, response)

  const stored = await cache.keys()
  const storedPaths = stored.map((request) => new URL(request.url).pathname)
  await Promise.all([
    ...assets.filter((path) => !storedPaths.includes(path)).map((path) => cache.add(path)),
    ...stored
      .filter((_, index) => storedPaths[index].startsWith('/assets/') && !assets.includes(storedPaths[index]))
      .map((request) => cache.delete(request)),
  ])
}

self.addEventListener('install', (event) => {
  // Fetch the shell now, so the files are kept even when the first visit is the only one before going offline.
  event.waitUntil(
    fetch(INDEX, { cache: 'no-cache' })
      .then((response) => response.ok && refreshShell(response))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// Pages: try the network so a new deploy shows at once, and fall back to the stored shell when offline.
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) refreshShell(response.clone()).catch(() => {})
    return response
  } catch {
    const cache = await caches.open(CACHE)
    return (await cache.match(INDEX)) ?? Response.error()
  }
}

// Built files are named by their content, so a stored copy never goes out of date.
async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone()).catch(() => {})
  return response
}

// Icons, the manifest and the fonts: answer from the store at once and refresh it in the background.
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  const refresh = fetch(request).then((response) => {
    if (response.ok || response.type === 'opaque') cache.put(request, response.clone()).catch(() => {})
    return response
  })

  if (cached) {
    refresh.catch(() => {})
    return cached
  }
  return refresh
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin === self.location.origin) {
    // The API is on its own origin, but keep same-origin /api requests out of the store as well.
    if (url.pathname.startsWith('/api/')) return

    if (request.mode === 'navigate') event.respondWith(networkFirst(request))
    else if (url.pathname.startsWith('/assets/')) event.respondWith(cacheFirst(request))
    else event.respondWith(staleWhileRevalidate(request))
  } else if (FONT_ORIGINS.includes(url.origin)) {
    event.respondWith(staleWhileRevalidate(request))
  }
  // Everything else, the API and profile photos included, goes straight to the network.
})
