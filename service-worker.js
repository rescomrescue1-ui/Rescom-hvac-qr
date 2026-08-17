
const CACHE = "rescom-qr-v25-phone-login";
const ASSETS = ["./","./index.html","./version.json","./manifest.webmanifest","./qrcode.min.js","./icon-192.png","./icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  ]));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url=new URL(e.request.url);
  const isFresh=e.request.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/version.json");
  if(isFresh){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(resp=>{
      const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
  }else{
    e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(resp=>{
      const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;
    })));
  }
});
