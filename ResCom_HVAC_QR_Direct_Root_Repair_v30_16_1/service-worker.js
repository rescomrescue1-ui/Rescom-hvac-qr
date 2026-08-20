const CACHE = "rescom-qr-v30-16-1-direct-root-safe-update-1342";
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
  // Do NOT skipWaiting. A new build must not replace the service worker under an
  // already-open field session. It activates after existing Res-Com windows close.
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    for(const asset of CORE){try{await cache.add(new Request(asset,{cache:"reload"}))}catch(_){}}
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>(k.startsWith("rescom-qr")||k.includes("release-launcher")) && k!==CACHE).map(k=>caches.delete(k)));
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

  // Never cache Airtable/API data. PIN/account/equipment reads must be fresh.
  if(url.origin!==self.location.origin){
    event.respondWith(fetch(event.request,{cache:"no-store"}).catch(()=>Response.error()));
    return;
  }

  const navigation=event.request.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/Rescom-hvac-qr/");
  const fresh=navigation || /\/(version\.json|modern-ui\.css|modern-ui\.js|service-worker\.js)$/.test(url.pathname);
  if(fresh){event.respondWith(networkFirst(event.request,navigation?"./index.html":null));return}

  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(async response=>{
    if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put(event.request,response.clone())}
    return response;
  }).catch(()=>Response.error())));
});
