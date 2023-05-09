self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cacheAfif = `afif-web-cache`

      const filesToCache = ['/', '/scripts/main.js', '/styles/index.css']

      const cache = await caches.open(cacheAfif)
      console.info(
        '%c Service worker caching all',
        'font-weight:bold;color:green'
      )
      await cache.addAll(filesToCache)
    })()
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request)
      console.info(
        `%c Service Worker Fetching the resource from: ${event.request.url} `,
        'font-weight: bold; color: lightblue;'
      )
      if (cachedResponse) return cachedResponse

      const response = await fetch(event.request)

      console.info(
        `%c Service Worker cache new Resource from: ${event.request.url}`,
        'font-weight: bold; color: cyan;'
      )

      cache.put(event.request, response.clone())
      return response
    })()
  )
})
