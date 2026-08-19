const CACHE = "rescom-qr-v30-6-account-delete-temp-1652";
const CORE = [
  "./index.html",
  "./version.json",
  "./manifest.webmanifest",
  "./qrcode.min.js",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./modern-ui.css",
  "./modern-ui.js"
];

self.addEventListener("install", event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    for(const asset of CORE){try{await cache.add(new Request(asset,{cache:"reload"}))}catch(_){}}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith("rescom-qr") && k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

async function networkFirst(request,fallbackPath){
  const cache=await caches.open(CACHE);
  try{
    const response=await fetch(request,{cache:"no-store"});
    if(response&&response.ok)await cache.put(request,response.clone());
    return response;
  }catch(_){
    return (await cache.match(request)) || (fallbackPath?await cache.match(fallbackPath):null) || Response.error();
  }
}

self.addEventListener("fetch", event => {
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  const navigation=event.request.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/Rescom-hvac-qr/");
  const fresh=navigation || /\/(version\.json|modern-ui\.css|modern-ui\.js|service-worker\.js)$/.test(url.pathname);
  if(fresh){event.respondWith(networkFirst(event.request,navigation?"./index.html":null));return}
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(async response=>{if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put(event.request,response.clone())}return response}).catch(()=>Response.error())));
});
