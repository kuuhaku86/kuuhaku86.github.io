const CACHE_NAME = "ChelseaNews-v1";
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if(workbox)
    console.log('Workbox berhasil dimuat');
else
    console.log('Workbox gagal dimuat');

workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1'},
    { url: '/nav.html', revision: '1'},
    { url: '/index.html', revision: '1'},
    { url: '/pages/matches.html', revision: '1'},
    { url: '/pages/standings.html', revision: '1'},
    { url: '/pages/favorites.html', revision: '1'},
    { url: '/css/materialize.min.css', revision: '1'},
    { url: '/js/materialize.min.js', revision: '1'},
    { url: '/js/script.js', revision: '1'},
    { url: '/img/icon-192x192.png', revision: '1'},
    { url: '/img/icon-512x512.png', revision: '1'},
    { url: '/manifest.json', revision: '1'},
    { url: '/service-worker.js', revision: '1'},
    { url: '/start.js', revision: '1'},
    { url: '/js/api.js', revision: '1'},
]);
    
workbox.routing.registerRoute(
    /^https:\/\/api\.football\-data\.org\/v2\//,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'api-football-data',
    })
);
// self.addEventListener("fetch",function(e) {
//     const base_url = "https://api.football-data.org/v2/";
//     if(e.request.url.indexOf(base_url) > -1) {
//         e.respondWith(
//             caches.open(CACHE_NAME).then(function(cache) {
//                 return fetch(e.request)
//                     .then(function(response) {
//                         cache.put(e.request.url, response.clone());
//                         return response;
//                     })
//             })
//         );
//     }else{
//         e.respondWith(
//             caches.match(e.request, {
//                     ignoreSearch: true,
//             }).then(function(response) {
//                 return response || fetch(e.request);
//             })
//         )
//     }
// });

// self.addEventListener("activate", function(e) {
//     e.waitUntil(
//         caches.keys().then(function(cacheNames) {
//             return Promise.all(
//                 cacheNames.map(function(cacheName) {
//                     if(cacheName != CACHE_NAME) {
//                         console.log(("ServiceWorker : cache " + cacheName + " dihapus"));
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

self.addEventListener('push', function(e) {
    var body;
    if (e.data) {
        body = e.data.text();
    } else {
        body = "Push message no payload";
    }
    var options = {
        body: body,
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    e.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});