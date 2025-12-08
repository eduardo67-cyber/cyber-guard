const CACHE_VERSION = "encryptstudio-v1.0.0";
const CACHE_FILES = [
    "/",
    "/index.html",
    "/manifest.json",
    "/assets/icons/192.png",
    "/assets/icons/512.png",
    "/assets/icons/1024.png"
];


self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(cache => cache.addAll(CACHE_FILES))
    );
    self.skipWaiting();
});


self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_VERSION)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            return (
                cached ||
                fetch(event.request).catch(() =>
                    caches.match("/index.html")
                )
            );
        })
    );
});
