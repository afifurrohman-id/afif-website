
self.addEventListener('install', (event) => event.waitUntil(registerCache()))
self.addEventListener('fetch', (event) => event.respondWith(handleCache(event)))

async function registerCache() {
  const cacheAfif = `afif-web-cache`
  const cache = await caches.open(cacheAfif)
  const filesToCache = ['/', '/scripts/main.js', '/styles/index.css']
  console.info('%c Service worker caching all', 'font-weight:bold;color:green')
  await cache.addAll(filesToCache)
}

async function handleCache(networkEvent) {
  const cachedResponse = await caches.match(networkEvent.request)
  const networkResponse = fetch(networkEvent.request)
  return cachedResponse || networkResponse

}
