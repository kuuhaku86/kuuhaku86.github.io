const CACHE_NAME = "ChelseaNews-v1";
var urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/pages/matches.html",
    "/pages/standings.html",
    "/pages/favorites.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/script.js",
    "/img/icon-192x192.png",
    "/img/icon-512x512.png",
    "/manifest.json",
    "/service-worker.js",
    "/start.js",
    "/js/api.js",
];

self.addEventListener("install",function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
        );
    });
    
self.addEventListener("fetch",function(e) {
    const base_url = "https://api.football-data.org/v2/";
    if(e.request.url.indexOf(base_url) > -1) {
        e.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(e.request)
                    .then(function(response) {
                        cache.put(e.request.url, response.clone());
                        return response;
                    })
            })
        );
    }else{
        e.respondWith(
            caches.match(e.request, {
                    ignoreSearch: true,
            }).then(function(response) {
                return response || fetch(e.request);
            })
        )
    }
});

self.addEventListener("activate", function(e) {
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if(cacheName != CACHE_NAME) {
                        console.log(("ServiceWorker : cache " + cacheName + " dihapus"));
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

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