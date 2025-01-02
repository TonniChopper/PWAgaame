const CACHE_NAME = 'space-game-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/src/styles/main.css',
    '/src/app.js',
    '/src/game/items.js',
    '/src/game/engine.js',
    '/src/game/levels.js',
    '/src/ui/renderer.js',
    '/src/game/entities.js',
    '/src/game/levels.json',
    '/src/game/physics.js',
    '/src/ui/controls.js',
    '/src/utils/storage.js',
    '/public/assets/images/Helmet.png',
    '/public/assets/images/Asteroid.png',
    '/public/assets/images/IN_GAME.png',
    '/public/assets/images/ExtraTime.png',
    '/public/assets/images/background.webp',
    '/public/assets/images/GAME_DONE.png',
    '/public/assets/images/GAME_OVER.png',
    '/public/assets/images/space.jpg',
    '/public/assets/images/alian.png',
    '/public/assets/favicon/android-chrome-192x192.png',
    '/public/assets/favicon/android-chrome-512x512.png',
    '/public/assets/favicon/apple-touch-icon.png',
    '/public/assets/favicon/favicon-16x16.png',
    '/public/assets/fonts/Audiowide-Regular.ttf',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache resources:', error);
                urlsToCache.forEach(url => {
                    fetch(url).catch(fetchError => {
                        console.error('Failed to fetch:', url, fetchError);
                    });
                });
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});