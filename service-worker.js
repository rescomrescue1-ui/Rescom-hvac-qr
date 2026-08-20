const CACHE = "rescom-qr-v30-16-7-signed-in-no-company-pin-1504";
const LIVE_VERSION = "30.16.7";
const LIVE_BUILD = "Aug 20, 2026 3:04 PM";
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

function patchIndexHTML(text){
  let out=String(text||"");
  out=out.replace('const APP_VERSION="30.16.6";','const APP_VERSION="30.16.7";');
  out=out.replace('const APP_BUILD="Aug 20, 2026 2:35 PM";','const APP_BUILD="Aug 20, 2026 3:04 PM";');
  out=out.replaceAll(
    'if(!isCompanyUnlocked()){pendingProtectedUnit=clean;showPinGate("Enter company PIN to open this equipment.");return}',
    'if(!currentUser()){pendingProtectedUnit=clean;await renderAccountGateV30("Sign in to open this equipment.");return}'
  );
  out=out.replace('./modern-ui.css?v=30.16.5','./modern-ui.css?v=30.16.7');
  out=out.replace('./modern-ui.js?v=30.16.5','./modern-ui.js?v=30.16.7');

  if(!out.includes('id="m-v30167"')){
    const manual='<div class="manual-section" id="m-v30167"><h3>Version 30.16.7 — Signed-In Equipment Access</h3><p><b>No extra Company PIN after sign-in:</b> once a Res-Com employee is signed in with their employee account and personal PIN, opening or scanning equipment goes directly to that equipment record.</p><p>The <b>4-digit Company PIN</b> is still used for employee account creation and personal-PIN reset authorization. It is no longer requested just to open equipment while an employee is signed in.</p><p>QR links, Unit IDs, service history, Airtable records, and the fixed 4-label print sheet are unchanged.</p></div>';
    out=out.replace('<div class="manual-section" id="m-v30166">',manual+'<div class="manual-section" id="m-v30166">');
  }
  if(!out.includes('id="rcPatch3167"')){
    const patch='<div class="unit" id="rcPatch3167"><h3>Version 30.16.7 — Signed-In Equipment Access</h3><p><b>Released:</b> Aug 20, 2026 3:04 PM</p><p>• Signed-in Res-Com employees no longer enter the 4-digit Company PIN to open equipment.</p><p>• Equipment opens directly after employee sign-in.</p><p>• Company PIN remains in place for account creation and personal-PIN reset authorization.</p><p>• Existing QR links, equipment records, history, and 4-label printing are unchanged.</p></div>';
    out=out.replace('<div class="unit" id="rcPatch3166">',patch+'<div class="unit" id="rcPatch3166">');
  }
  return out;
}

function htmlResponse(text,source){
  const headers=new Headers(source?.headers||{});
  headers.set("content-type","text/html; charset=utf-8");
  headers.set("cache-control","no-cache");
  return new Response(text,{status:source?.status||200,statusText:source?.statusText||"OK",headers});
}

function versionResponse(){
  return new Response(JSON.stringify({
    version:LIVE_VERSION,
    build:LIVE_BUILD,
    notes:"Signed-in Res-Com employees can open equipment without entering the 4-digit Company PIN. Company PIN remains for account creation and personal-PIN reset authorization."
  },null,2),{headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-cache"}});
}

async function fetchAndPatchIndex(request){
  const cache=await caches.open(CACHE);
  try{
    const raw=await fetch(request,{cache:"no-store"});
    if(!raw.ok)return raw;
    const patched=htmlResponse(patchIndexHTML(await raw.text()),raw);
    await cache.put(request,patched.clone());
    await cache.put("./index.html",patched.clone());
    return patched;
  }catch(_){
    const cached=(await cache.match(request)) || (await cache.match("./index.html"));
    if(!cached)return Response.error();
    return htmlResponse(patchIndexHTML(await cached.text()),cached);
  }
}

self.addEventListener("install", event => {
  // Do NOT skipWaiting. The update activates safely after existing Res-Com windows close.
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    for(const asset of CORE){
      try{
        if(asset==="./index.html"){
          const raw=await fetch(asset,{cache:"reload"});
          if(raw.ok)await cache.put(asset,htmlResponse(patchIndexHTML(await raw.text()),raw));
        }else if(asset==="./version.json"){
          await cache.put(asset,versionResponse());
        }else{
          await cache.add(new Request(asset,{cache:"reload"}));
        }
      }catch(_){}
    }
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

  if(url.pathname.endsWith("/version.json")){
    event.respondWith(Promise.resolve(versionResponse()));
    return;
  }

  const navigation=event.request.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/Rescom-hvac-qr/");
  if(navigation){
    event.respondWith(fetchAndPatchIndex(event.request));
    return;
  }

  const fresh=/\/(modern-ui\.css|modern-ui\.js|service-worker\.js)$/.test(url.pathname);
  if(fresh){event.respondWith(networkFirst(event.request,null));return}

  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(async response=>{
    if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put(event.request,response.clone())}
    return response;
  }).catch(()=>Response.error())));
});
