const CACHE="agenda-v16";
const CORE=["./","./index.html","./auth.js","./cloud-sync.js","./manifest.webmanifest"];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(key=>key.startsWith("agenda-") && key!==CACHE)
          .map(key=>caches.delete(key))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  // Non intercettare API Google, OAuth o risorse esterne alla sotto-app.
  if(url.origin !== self.location.origin ||
     !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  const isAppShell =
    url.pathname.endsWith("/agenda-semplice/") ||
    url.pathname.endsWith("/agenda-semplice/index.html") ||
    url.pathname.endsWith("/agenda-semplice/auth.js") ||
    url.pathname.endsWith("/agenda-semplice/cloud-sync.js") ||
    url.pathname.endsWith("/agenda-semplice/sw.js");

  if(isAppShell){
    event.respondWith(
      fetch(event.request,{cache:"no-cache"})
        .then(response=>{
          if(response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache=>cache.put(event.request,copy));
          }
          return response;
        })
        .catch(async()=> (await caches.match(event.request)) ||
          (event.request.mode === "navigate" ? await caches.match("./index.html") : null) ||
          new Response("Risorsa non disponibile offline",{status:503}))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached) return cached;
      return fetch(event.request).then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        }
        return response;
      }).catch(async()=>
        (event.request.mode === "navigate" ? await caches.match("./index.html") : null) ||
        new Response("Risorsa non disponibile offline",{status:503}));
    })
  );
});


self.addEventListener("notificationclick",event=>{
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({type:"window",includeUncontrolled:true}).then(clients=>{
      for(const client of clients){
        if("focus" in client) return client.focus();
      }
      if(self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});

