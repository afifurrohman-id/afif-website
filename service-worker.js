self.addEventListener('install', (event) => event.waitUntil(registerCache()))
self.addEventListener('fetch', (event) => event.respondWith(handleCache(event)))

async function openCache() {
  const cacheAfif = `afif-web-cache`
  const cache = await caches.open(cacheAfif)
  return cache
}
async function registerCache() {
  const cache = await openCache()
  const filesToCache = ['/', '/scripts/main.js', '/styles/index.css']
  console.info('%c Service worker caching all', 'font-weight: bold; color: lightgreen;')
  await cache.addAll(filesToCache)
}

async function handleCache(networkEvent) {
  try {
    console.info('%c Service Worker Trying Fetch from Network', 'font-weight: bold; color: blue;')
    const networkResponse = await fetch(networkEvent.request)
    return networkResponse
  } catch (error) {
    console.info(`%c ${error} | Service Worker using cache`, 'font-weight: bold; color: yellow')
    const cache = await openCache()
    const cachedResponse = await cache.match(networkEvent.request)
    return cachedResponse
  }
}
