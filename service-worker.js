const CACHE = "rescom-qr-v30-16-diagnostics-email-pin-offline-photos-1225";
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

  // v30.15: Cloud/API data must always be live. The old cache-first rule could keep stale
  // Airtable account/PIN responses and make a newly changed PIN fail until the cache changed.
  if(url.origin!==self.location.origin){
    event.respondWith(fetch(event.request,{cache:"no-store"}).catch(()=>Response.error()));
    return;
  }

  const navigation=event.request.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/Rescom-hvac-qr/");
  const fresh=navigation || /\/(version\.json|modern-ui\.css|modern-ui\.js|service-worker\.js)$/.test(url.pathname);
  if(fresh){event.respondWith(networkFirst(event.request,navigation?"./index.html":null));return}

  // Only same-origin static app files use cache-first/offline behavior.
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(async response=>{
    if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put(event.request,response.clone())}
    return response;
  }).catch(()=>Response.error())));
});
