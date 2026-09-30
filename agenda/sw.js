const CACHE="adinolfi-agenda-v4";
const ASSETS=["./","./index.html","./manifest.webmanifest"];

self.addEventListener("install",e=>
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  )
);

self.addEventListener("activate",e=>
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys
          .filter(k=>k.startsWith("adinolfi-agenda-")&&k!==CACHE)
          .map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  )
);

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;

  const u=new URL(e.request.url);

  // Do not intercept external requests (e.g. Google Apps Script JSONP).
  if(u.origin!==self.location.origin) return;

  if(
    u.pathname.endsWith("/app.js") ||
    u.pathname.endsWith("/index.html") ||
    u.pathname.endsWith("/sw.js")
  ){
    e.respondWith(
      fetch(e.request,{cache:"no-store"})
        .catch(()=>caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});