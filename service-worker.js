const CACHE = "rescom-qr-v29-modern-field-ui";
const VERSION = "29.0";
const BUILD = "Aug 19, 2026 10:49 AM";
const ASSETS = ["./version.json","./manifest.webmanifest","./qrcode.min.js","./icon-192.png","./icon-512.png","./modern-ui.css","./modern-ui.js"];

function modernizeHTML(text){
  let html = String(text || "");
  html = html.replace('const APP_VERSION="28.0";','const APP_VERSION="29.0";');
  html = html.replace('const APP_BUILD="Aug 19, 2026 9:30 AM";','const APP_BUILD="Aug 19, 2026 10:49 AM";');
  html = html.replace('APP v28.0 • UPDATED Aug 19, 2026 9:30 AM','APP v29.0 • UPDATED Aug 19, 2026 10:49 AM');
  html = html.replace('Installed v27.0','Installed v29.0');
  if(!html.includes('modern-ui.css')) html = html.replace('</head>','<link rel="stylesheet" href="./modern-ui.css?v=29.0">\n</head>');
  if(!html.includes('modern-ui.js')) html = html.replace('</body>','<script src="./modern-ui.js?v=29.0"></script>\n</body>');
  return html;
}

async function modernResponse(response){
  const text = await response.text();
  const headers = new Headers(response.headers);
  headers.set("content-type","text/html; charset=utf-8");
  headers.set("cache-control","no-cache");
  return new Response(modernizeHTML(text),{status:response.status,statusText:response.statusText,headers});
}

async function fetchAndModernizeIndex(request){
  const net = await fetch(request,{cache:"no-store"});
  const out = await modernResponse(net);
  const cache = await caches.open(CACHE);
  await cache.put("./index.html",out.clone());
  return out;
}

self.addEventListener("install", e => {
  e.waitUntil((async()=>{
    const c = await caches.open(CACHE);
    await c.addAll(ASSETS);
    try{
      const raw = await fetch("./index.html",{cache:"no-store"});
      const out = await modernResponse(raw);
      await c.put("./index.html",out);
    }catch(_){}
  })());
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const isIndex = e.request.mode === "navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/Rescom-hvac-qr/");
  if(isIndex){
    e.respondWith(fetchAndModernizeIndex(e.request).catch(async()=>{
      const c = await caches.open(CACHE);
      return (await c.match("./index.html")) || Response.error();
    }));
    return;
  }
  const fresh = url.pathname.endsWith("/version.json") || url.pathname.endsWith("/modern-ui.css") || url.pathname.endsWith("/modern-ui.js");
  if(fresh){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(async resp=>{
      const c=await caches.open(CACHE); await c.put(e.request,resp.clone()); return resp;
    }).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(async resp=>{
    const c=await caches.open(CACHE); await c.put(e.request,resp.clone()); return resp;
  })));
});
