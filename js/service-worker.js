const CACHE_NAME = "firstpwa-v1";
var urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/pages/home.html",
    "/pages/about.html",
    "/pages/contact.html",
    "/article.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/api.js",
    "/js/article.js",
    "/js/service-worker.js",
    "/icon.png",
    "/README.md",
    "/manifest.json",
    "/LICENSE"
];

self.addEventListener("install",function(e) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch",function(e) {
    var base_url = "https://readerapi.codepolitan.com/";

    if(e.request.url.indexOf(base_url) > -1) {
        e.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(e.request).then(function(response) {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request, {ignoreSearch: true}).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }
    e.respondWith(
        caches
            .match(e.request, { cacheName : CACHE_NAME})
            .then(function(response) {
                if(response){
                    console.log("ServiceWorker : Gunakan aset dari cache : ", response.url);
                    return response;
                }

                console.log(
                    "ServiceWorker : Memuat aset dari server: ",
                    e.request.url
                );
                return fetch(e.request);
            })
    );
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