const CACHE_NAME = 'suuj-browser-v1';
const urlsToCache = [
    'simple_browser.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching files:', urlsToCache);
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Caching failed:', err);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    return caches.match('simple_browser.html');
                });
            })
            .catch(err => {
                console.error('Fetch failed:', err);
                return caches.match('simple_browser.html');
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
