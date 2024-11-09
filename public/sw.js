const currentCache = "static-cache-v4.0";

const files = [
  "/",
  "/index.html",
  "/css/style.css",
  "/peliculas.html",
  "/images/jp2.jpg",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(currentCache).then((cache) => {
      return cache.addAll(files);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then((cahcesNames) =>
      Promise.all(
        cahcesNames
          .filter((cacheName) => {
            return cacheName !== currentCache;
          })
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request).then(function (response) {
        return response || caches.match("/offline.html");
      });
    })
  );
});

/*const cleanCache = (cacheName, maxSize) => {
  //recibes un máximo de caches
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((items) => {
      console.log(items.length);
      if (items.length >= maxSize) {
        //comparar si se supera el tamaño de caches
        cache
          .delete(items[0]) //eliminar el primer cache
          .then(() => {
            cleanCache(cacheName, maxSize);
          }); //revisar si no hay más caches para eliminar.
      }
    });
  });
}; */
