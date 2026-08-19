/* Res-Com HVAC QR v30.2 — modern field UX + iPhone Easy Install PWA layer */
(() => {
  "use strict";

  const MODERN_VERSION = "30.2";
  const MODERN_BUILD = "Aug 19, 2026 12:11 PM";
  const THEME_KEY = "rescom_theme_v30";
  let bugUploadBusy = false;
  let deferredInstallPrompt = null;

  const byId = id => document.getElementById(id);
  const escapeHTML = s => {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  };

  function installedAsApp(){
    return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone===true;
  }
  function devicePlatform(){
    const ua=navigator.userAgent||"";
    const p=navigator.userAgentData?.platform||navigator.platform||"";
    if(/iPad|iPhone|iPod/i.test(ua) || (p==="MacIntel" && navigator.maxTouchPoints>1))return "ios";
    if(/Android/i.test(ua))return "android";
    return "other";
  }
  const IOS_INSTALL_SEEN_KEY="rescom_ios_install_seen_v30_2";
  function isIOSSafari(){
    if(devicePlatform()!=="ios")return false;
    const ua=navigator.userAgent||"";
    return /Safari/i.test(ua) && !/(CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo)/i.test(ua);
  }
  function installBaseURL(){
    try{return new URL(".",location.href).href}catch{return location.href.split(/[?#]/)[0]}
  }
  async function copyInstallLink(){
    const text=installBaseURL();
    try{
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
      else{
        const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
      }
      const b=byId("rcCopyInstallLink");if(b){const old=b.textContent;b.textContent="✓ LINK COPIED — OPEN SAFARI";setTimeout(()=>{if(b)b.textContent=old},2200)}
    }catch(err){
      try{logBug?.("Navigation","Could not copy iPhone install link","iPhone install helper",String(err?.message||err),"UI")}catch{}
      alert("Copy this Res-Com address, then paste it into Safari:\n\n"+text);
    }
  }
  function closeInstallGuide(){byId("rcInstallBackdrop")?.remove()}
  function showInstallGuide(autoShown=false){
    closeInstallGuide();
    const kind=devicePlatform(), safari=isIOSSafari();
    const wrap=document.createElement("div");wrap.id="rcInstallBackdrop";
    let body="";
    if(kind==="ios"){
      body=`<div class="iosInstallLead"><b>iPhone / iPad setup</b><span>Apple does not allow a website to press “Add to Home Screen” for you, so Res-Com shows the exact three taps.</span></div>
      ${!safari?`<div class="iosSafariWarning"><b>First open Res-Com in Safari.</b><span>You are in another browser. Copy the clean Res-Com link below, open Safari, paste it, and continue.</span></div><button type="button" id="rcCopyInstallLink" class="installSecondary" data-safe-bound="yes">COPY RES-COM LINK FOR SAFARI</button>`:""}
      <div class="iosInstallSteps">
        <div class="iosInstallStep"><span class="iosStepNum">1</span><div><b>Tap Share</b><p>In Safari, tap the square-with-up-arrow Share button.</p><span class="iosShareIcon" aria-label="Share icon"><i></i><em>↑</em></span></div></div>
        <div class="iosInstallStep"><span class="iosStepNum">2</span><div><b>Tap “Add to Home Screen”</b><p>If you do not see it immediately, scroll the Share menu down.</p></div></div>
        <div class="iosInstallStep"><span class="iosStepNum">3</span><div><b>Tap “Add”</b><p>The Res-Com icon will appear on the iPhone Home Screen. Open that icon from then on.</p></div></div>
      </div>`;
    }else if(kind==="android"){
      body=`<ol><li>Open Res-Com in <b>Chrome</b>.</li><li>Tap Chrome's <b>⋮ menu</b>.</li><li>Choose <b>Install app</b> or <b>Add to Home screen</b>.</li><li>Approve the install, then open the Res-Com icon.</li></ol>`;
    }else{
      body=`<ol><li>Open Res-Com in Chrome, Edge, or another PWA-capable browser.</li><li>Use the browser's <b>Install app</b> control or install icon in the address bar/menu.</li><li>Approve the install and launch Res-Com from your applications.</li></ol>`;
    }
    const title=kind==="ios"?"Add Res-Com to iPhone":"Install Res-Com";
    wrap.innerHTML=`<div id="rcInstallSheet" role="dialog" aria-modal="true" aria-label="Install Res-Com"><div class="installSheetLogo"><img src="apple-touch-icon.png" alt="Res-Com"></div><h2>${title}</h2><p>No App Store or Google Play is needed.</p>${body}<div class="installBenefits"><b>After it is added:</b><span>Open Res-Com from the Home Screen icon. It launches in its own app window and keeps using the same permanent QR links.</span></div><div class="installSheetActions"><button type="button" id="rcInstallClose" data-safe-bound="yes">${kind==="ios"?"DONE / CLOSE":"GOT IT"}</button><button type="button" id="rcInstallLater" class="installSecondary" data-safe-bound="yes">NOT NOW</button></div></div>`;
    document.body.appendChild(wrap);
    if(kind==="ios")try{localStorage.setItem(IOS_INSTALL_SEEN_KEY,"yes")}catch{}
    byId("rcCopyInstallLink")?.addEventListener("click",copyInstallLink);
    byId("rcInstallClose")?.addEventListener("click",closeInstallGuide);
    byId("rcInstallLater")?.addEventListener("click",closeInstallGuide);
    wrap.addEventListener("click",e=>{if(e.target===wrap)closeInstallGuide()});
    if(autoShown)wrap.classList.add("autoInstallGuide");
  }
  function updateInstallUI(){
    const card=byId("installAppCard"),btn=byId("installAppBtn"),status=byId("installAppStatus"),title=byId("installAppTitle");
    if(!card||!btn)return;
    if(installedAsApp()){
      card.classList.add("hidden");
      return;
    }
    card.classList.remove("hidden");
    btn.dataset.safeBound="yes";
    const kind=devicePlatform();
    if(kind==="ios"){
      card.classList.add("iphoneInstallCard");
      if(title)title.textContent="Put Res-Com on this iPhone";
      btn.textContent="ADD TO IPHONE";
      if(status)status.textContent=isIOSSafari()?"3 easy taps: Share → Add to Home Screen → Add.":"Tap here, then copy the Res-Com link into Safari for the easiest install.";
    }else{
      card.classList.remove("iphoneInstallCard");
      if(title)title.textContent="Install Res-Com on this device";
      btn.textContent="INSTALL RES-COM";
      if(status){
        status.textContent=deferredInstallPrompt
          ? "Ready to install directly on this device — no app store required."
          : kind==="android"
          ? "Install directly from Chrome, or use Chrome → Install app / Add to Home screen."
          : "Install from your browser so Res-Com opens like a normal app.";
      }
    }
  }
  function maybeShowIOSInstallNudge(){
    if(devicePlatform()!=="ios"||installedAsApp())return;
    try{if(localStorage.getItem(IOS_INSTALL_SEEN_KEY)==="yes")return}catch{}
    try{const q=new URLSearchParams(location.search);if(q.has("unit")||q.has("equipment"))return}catch{}
    setTimeout(()=>{if(!installedAsApp()&&!byId("rcInstallBackdrop"))showInstallGuide(true)},900);
  }
  async function installResCom(){
    if(installedAsApp()){
      updateInstallUI();
      return;
    }
    if(deferredInstallPrompt){
      const promptEvent=deferredInstallPrompt;
      deferredInstallPrompt=null;
      try{
        await promptEvent.prompt();
        const choice=await promptEvent.userChoice;
        if(choice?.outcome!=="accepted")showInstallGuide();
      }catch(_){showInstallGuide()}
      updateInstallUI();
      return;
    }
    showInstallGuide();
  }
  function ensureInstallExperience(){
    const btn=byId("installAppBtn");
    if(btn&&btn.dataset.rcInstallBound!=="yes"){
      btn.dataset.rcInstallBound="yes";
      btn.dataset.safeBound="yes";
      btn.addEventListener("click",installResCom);
    }
    updateInstallUI();
  }
  window.addEventListener("beforeinstallprompt",e=>{
    e.preventDefault();
    deferredInstallPrompt=e;
    updateInstallUI();
  });
  window.addEventListener("appinstalled",()=>{
    deferredInstallPrompt=null;
    updateInstallUI();
  });
  try{window.matchMedia?.("(display-mode: standalone)")?.addEventListener?.("change",updateInstallUI)}catch{}

  function currentTheme(){
    try{return localStorage.getItem(THEME_KEY)==="dark"?"dark":"light"}catch{return "light"}
  }
  function applyTheme(theme){
    const t=theme==="dark"?"dark":"light";
    document.documentElement.dataset.theme=t;
    document.body?.setAttribute("data-theme",t);
    try{localStorage.setItem(THEME_KEY,t)}catch{}
    document.querySelectorAll("[data-theme-choice]").forEach(b=>b.classList.toggle("selected",b.dataset.themeChoice===t));
  }

  function updateVersionUI(){
    const badge = byId("appVersionBadge");
    if(badge) badge.textContent = `APP v${MODERN_VERSION} • UPDATED ${MODERN_BUILD}`;
    const lv = byId("loadingVersion");
    if(lv) lv.textContent = `Installed v${MODERN_VERSION}`;
    document.documentElement.dataset.rescomUi = MODERN_VERSION;
  }

  function techName(){
    try { return currentUser?.()?.name || "Res-Com"; } catch { return "Res-Com"; }
  }

  function addWelcomeStrip(){
    const home = byId("home");
    if(!home) return;
    let strip=byId("rcWelcomeStrip");
    if(!strip){
      strip=document.createElement("div");strip.id="rcWelcomeStrip";home.prepend(strip);
    }
    strip.innerHTML = `<div class="copy"><h2>Ready, ${escapeHTML(techName())}</h2><p>Scan. Service. Save. Everything stays tied to the equipment QR.</p></div><div class="avatar"><img src="icon-192.png" alt="Res-Com"></div>`;
  }

  function makeMoreMenu(){
    const nav = byId("globalNav");
    if(!nav) return;
    const accounts=byId("navAccounts");if(accounts)accounts.textContent="TEAM";
    let more=byId("rcMoreNav");
    if(!more){
      more=document.createElement("button");more.id="rcMoreNav";more.type="button";more.textContent="MORE";more.dataset.safeBound="yes";nav.appendChild(more);
    }
    if(byId("rcMoreBackdrop"))return;
    const wrap=document.createElement("div");wrap.id="rcMoreBackdrop";
    wrap.innerHTML=`<div id="rcMoreSheet" role="dialog" aria-modal="true" aria-label="More menu"><div class="handle"></div><h3>More</h3><div class="rcMoreGrid"><button type="button" data-rc-more="settings">⚙️ Settings</button><button type="button" data-rc-more="manual">📘 Manual</button><button type="button" data-rc-more="patchnotes">📝 What’s New</button><button type="button" data-rc-more="health">🩺 System Health</button><button type="button" data-rc-more="install">📱 Install Help</button></div></div>`;
    document.body.appendChild(wrap);
    more.addEventListener("click",()=>wrap.classList.add("open"));
    wrap.addEventListener("click",e=>{if(e.target===wrap)wrap.classList.remove("open")});
    wrap.querySelectorAll("[data-rc-more]").forEach(btn=>btn.addEventListener("click",async()=>{
      wrap.classList.remove("open");
      const target=btn.dataset.rcMore;
      if(target==="settings"){try{await navGoSettings()}catch{show("settings")}}
      if(target==="manual"){show("manualScreen");scrollTo(0,0)}
      if(target==="patchnotes"){show("patchNotes");scrollTo(0,0)}
      if(target==="health"){try{await openSystemHealth()}catch{show("healthScreen")}}
      if(target==="install"){if(installedAsApp())alert("Res-Com is already installed on this device.");else showInstallGuide()}
    }));
  }

  function updateActiveNav(){
    ["navHome","navEquipment","navAccounts","navBugs","rcMoreNav"].forEach(id=>byId(id)?.classList.remove("rc-active"));
    let screen="";try{screen=currentScreenName()}catch{}
    const map={home:"navHome",equipmentScreen:"navEquipment",accountsScreen:"navAccounts",accountDetailScreen:"navAccounts",bugScreen:"navBugs",healthScreen:"navBugs"};
    const active=byId(map[screen]||(["settings","manualScreen","patchNotes"].includes(screen)?"rcMoreNav":""));active?.classList.add("rc-active");
  }
  function installNavObserver(){
    const root=document.querySelector("main");if(!root)return;
    const obs=new MutationObserver(updateActiveNav);obs.observe(root,{subtree:true,attributes:true,attributeFilter:["class"]});updateActiveNav();
  }

  function prepareCustomerHandoff(){
    const section=byId("qrHandoff"),card=section?.querySelector(".card");if(!card||byId("rcCustomerNotice"))return;
    const notice=document.createElement("div");notice.id="rcCustomerNotice";
    notice.innerHTML=`<div class="shield">🛠</div><h2>Service Technician QR</h2><p>This label is used by HVAC service professionals to open the equipment’s technical service history.</p><div class="customerLine">Customer? No action is required.</div>`;
    card.prepend(notice);
    const tools=document.createElement("div");tools.id="rcTechHandoffTools";tools.className="hiddenByNotice";
    Array.from(card.children).filter(el=>el!==notice).forEach(el=>tools.appendChild(el));card.appendChild(tools);
    const techBtn=document.createElement("button");techBtn.type="button";techBtn.className="orange";techBtn.textContent="I’M A RES-COM TECHNICIAN";techBtn.dataset.safeBound="yes";notice.appendChild(techBtn);
    techBtn.addEventListener("click",()=>{tools.classList.remove("hiddenByNotice");techBtn.remove();tools.scrollIntoView({behavior:"smooth",block:"start"})});
  }

  function modernizePrintCenter(){
    const options=document.querySelector("#labelScreen .printOptions");
    if(options&&!byId("rcPrintSummary")){const s=document.createElement("div");s.id="rcPrintSummary";s.textContent="Choose a quantity, then tap Generate. Codes are created only when you generate labels.";options.appendChild(s)}
    document.querySelectorAll(".qtyBtn").forEach(old=>{
      if(old.dataset.rcFixed==="yes")return;
      const clone=old.cloneNode(true);clone.dataset.rcFixed="yes";clone.dataset.safeBound="yes";old.replaceWith(clone);
      clone.addEventListener("click",()=>{const input=byId("qrPrintQuantity");if(input)input.value=clone.dataset.qty||"1";const s=byId("rcPrintSummary");if(s)s.textContent=`${clone.dataset.qty||1} label${clone.dataset.qty==="1"?"":"s"} selected. Tap Generate when ready.`});
    });
    const create=byId("createBlank");
    if(create&&create.dataset.rcFixed!=="yes"){
      const clone=create.cloneNode(true);clone.dataset.rcFixed="yes";clone.dataset.safeBound="yes";create.replaceWith(clone);
      clone.addEventListener("click",()=>{const input=byId("qrPrintQuantity");if(input)input.value="1";const area=byId("printArea");if(area)area.innerHTML="";try{generatedLabelIds=[];currentId=null}catch{}const setup=byId("setupNow");if(setup)setup.classList.add("hidden");const s=byId("rcPrintSummary");if(s)s.textContent="Choose a quantity, then tap Generate. No QR IDs are created until then.";show("labelScreen")});
    }
    try{
      renderQrLabels=function(ids){
        generatedLabelIds=(ids||[]).slice();const area=byId("printArea");if(!area)return;
        area.innerHTML=generatedLabelIds.map((id,i)=>`<div class="print-label"><h2>RES-COM HVAC</h2><div class="label-sub">Equipment Service History</div><div class="qr-cell" id="qrLabel_${i}"></div><div class="qr-code-text">QR CODE: <span class="mono">${escapeHTML(id)}</span></div><div class="tech-only">FOR SERVICE TECHNICIANS</div><div class="label-footer">Customer action is not required. Scan to set up or service this equipment.</div></div>`).join("");
        generatedLabelIds.forEach((id,i)=>new QRCode(byId("qrLabel_"+i),{text:appURL(id),width:200,height:200,correctLevel:QRCode.CorrectLevel.M}));
        currentId=generatedLabelIds[0]||null;const setup=byId("setupNow");if(setup)setup.classList.toggle("hidden",generatedLabelIds.length!==1);const s=byId("rcPrintSummary");if(s)s.textContent=`${generatedLabelIds.length} unique QR label${generatedLabelIds.length===1?"":"s"} ready to print.`;
      };
    }catch{}
  }

  function cleanupLegacySettings(){
    ["companyUsersAdmin","newCompanyPin","confirmCompanyPin","changeCompanyPin","lockAppNow","techNameInput","addTechnician","technicianList"].forEach(id=>{const el=byId(id);if(el)el.style.display="none"});
    document.querySelectorAll("#settings h3").forEach(h=>{const t=(h.textContent||"").trim();if(["Company QR PIN","Company Users","Technicians"].includes(t))h.style.display="none"});
    document.querySelectorAll("#settings p.small").forEach(p=>{const t=p.textContent||"";if(t.includes("4-digit company PIN")||t.includes("Technicians saved here")||t.includes("Admins can add Res-Com employee profiles"))p.style.display="none"});
    if(!byId("rcAppearanceCard")){
      const card=document.querySelector("#settings .card");if(card){
        const box=document.createElement("div");box.id="rcAppearanceCard";box.className="unit";box.innerHTML=`<h3>App Appearance</h3><p class="small">Choose the background that is easiest to read on this device.</p><div class="themeChoices"><button type="button" data-theme-choice="light">☀️ WHITE</button><button type="button" data-theme-choice="dark">🌙 BLACK</button></div>`;
        const firstHr=card.querySelector("hr");card.insertBefore(box,firstHr||card.firstChild);
        box.querySelectorAll("[data-theme-choice]").forEach(b=>b.addEventListener("click",()=>applyTheme(b.dataset.themeChoice)));
      }
    }
    applyTheme(currentTheme());
  }

  function updateManualAndPatchNotes(){
    const navBtn=document.querySelector('.manualJump[data-target="m-accounts"]');if(navBtn)navBtn.textContent="Team";
    const acctSec=byId("m-accounts");if(acctSec)acctSec.innerHTML=`<h3>Team Accounts</h3><p>Res-Com now uses one simple Team account system. The first person who creates an account becomes Admin automatically.</p><p>Every Admin and Tech signs in with their own email and password. New employee self-signups require the current 4-digit company PIN, which only Admins manage.</p><p>Admins can create accounts, promote Techs to Admin, disable accounts, reset passwords, and rotate the company PIN from the Team tab.</p>`;
    const manualCard=document.querySelector("#manualScreen .card");
    if(manualCard&&!byId("m-ios-install")){
      const sec=document.createElement("div");sec.className="manual-section";sec.id="m-ios-install";sec.innerHTML=`<h3>Version 30.2 — Easier iPhone / iPad Installation</h3><p><b>Home:</b> iPhone and iPad users now see a dedicated ADD TO IPHONE card with a three-step guide: Share → Add to Home Screen → Add.</p><p><b>Safari helper:</b> if Res-Com is opened in another iPhone browser, the guide provides a COPY RES-COM LINK FOR SAFARI button so the technician can paste the clean app address into Safari.</p><p><b>First-use help:</b> on a normal iPhone launch, the install guide appears once automatically and then stays available from Home and More → Install Help.</p><p><b>Home Screen icon:</b> added a dedicated Apple touch icon and iOS standalone/status-bar metadata for a more app-like launch.</p><p><b>QR safety:</b> the clean install link never changes existing printed QR URLs, and QR scans are not interrupted by the automatic install guide.</p><p><b>Recovery:</b> automatic Bug & Recovery logging remains enabled.</p>`;manualCard.insertBefore(sec,manualCard.firstElementChild?.nextSibling||null)
    }
    if(manualCard&&!byId("m-install")){
      const sec=document.createElement("div");sec.className="manual-section";sec.id="m-install";sec.innerHTML=`<h3>Version 30.1 — Install Res-Com Without an App Store</h3><p><b>Home:</b> tap INSTALL RES-COM APP. Android/Chrome will use a direct install prompt when the browser allows it. iPhone/iPad will show the Safari Share → Add to Home Screen steps.</p><p><b>Installed mode:</b> once Res-Com is launched from its Home Screen/app icon, the install card hides automatically and the site opens in standalone app mode.</p><p><b>QR compatibility:</b> installation does not change the GitHub Pages address or printed RC equipment links.</p><p><b>Recovery:</b> automatic Bug & Recovery logging, update checks, and offline service-worker caching stay enabled.</p>`;manualCard.insertBefore(sec,manualCard.firstElementChild?.nextSibling||null)
    }
    if(manualCard&&!byId("m-v30")){
      const sec=document.createElement("div");sec.className="manual-section";sec.id="m-v30";sec.innerHTML=`<h3>Version 30 — Simplified Accounts, Equipment Search & Themes</h3><p><b>Accounts:</b> customer account records and separate technician lists are no longer part of the app workflow. Customer name, email and phone are stored directly on each equipment record.</p><p><b>Team:</b> the first Res-Com employee to create an App Account is automatically Admin. Everyone else is a Tech unless an Admin changes the role.</p><p><b>Company PIN:</b> only Admins can generate and manage the 4-digit company PIN. It authorizes new employee account creation; Techs sign in with their own email and password.</p><p><b>Equipment:</b> Equipment search combines QR units scanned/created on this device with every equipment record downloaded from the shared Airtable database.</p><p><b>Status:</b> Loading Shared Equipment always finishes as Equipment Ready, Local Equipment Ready, or Cloud Error — Local Equipment Ready.</p><p><b>Appearance:</b> Settings now has White and Black app themes with explicit text/background contrast.</p>`;manualCard.insertBefore(sec,manualCard.firstElementChild?.nextSibling||null)
    }
    const patch=document.querySelector("#patchNotes .card");
    if(patch&&!byId("rcPatch302")){
      const b=document.createElement("div");b.className="unit";b.id="rcPatch302";b.innerHTML=`<h3>Version 30.2 — iPhone Easy Install</h3><p><b>Released:</b> Aug 19, 2026 12:11 PM</p><p>• Added a dedicated ADD TO IPHONE Home card.</p><p>• Added a large three-step iPhone guide showing Share → Add to Home Screen → Add.</p><p>• Added COPY RES-COM LINK FOR SAFARI when the app is opened in another iPhone browser.</p><p>• Added a one-time iPhone first-use install guide that does not interrupt equipment QR scans.</p><p>• Added More → Install Help so technicians can reopen the instructions anytime.</p><p>• Added a dedicated Apple Home Screen icon and iOS standalone metadata.</p><p>• Synchronized the core app version with the PWA version to prevent false update warnings.</p><p>• Kept automatic Bug & Recovery logging and all permanent QR links unchanged.</p>`;const first=patch.querySelector(".unit");patch.insertBefore(b,first||null)
    }
    if(patch&&!byId("rcPatch301")){
      const b=document.createElement("div");b.className="unit";b.id="rcPatch301";b.innerHTML=`<h3>Version 30.1 — Installable Res-Com App</h3><p><b>Released:</b> Aug 19, 2026 12:04 PM</p><p>• Added INSTALL RES-COM APP on Home.</p><p>• Added direct browser install prompts where supported.</p><p>• Added iPhone/iPad and Android fallback install instructions.</p><p>• Added installed-app detection and standalone launch polish.</p><p>• Improved manifest/mobile web-app metadata while keeping all permanent QR URLs compatible.</p><p>• Kept automatic Bug & Recovery logging, offline caching, and update checks.</p>`;const first=patch.querySelector(".unit");patch.insertBefore(b,first||null)
    }
    if(patch&&!byId("rcPatch30")){
      const b=document.createElement("div");b.className="unit";b.id="rcPatch30";b.innerHTML=`<h3>Version 30.0 — Accounts & Search Cleanup</h3><p><b>Released:</b> Aug 19, 2026 11:43 AM</p><p>• Replaced confusing customer Accounts / technician lists with one Team account system.</p><p>• First App Account automatically becomes Admin; later self-created accounts are Tech.</p><p>• Added individual email/password login for Admins and Techs.</p><p>• Company 4-digit PIN is Admin-only and used only to authorize employee account creation.</p><p>• Admins can rotate the company PIN and prepare one email addressed to all active Admins.</p><p>• Customer name, email and phone now save directly on the equipment record.</p><p>• Equipment search now merges local scanned/blank QR units with the full shared Airtable equipment database.</p><p>• Fixed the Loading Shared Equipment badge so it always resolves.</p><p>• Added White / Black appearance setting with contrast fixes.</p><p>• Cleans old local technician/account identity data without deleting equipment or service history.</p>`;const first=patch.querySelector(".unit");patch.insertBefore(b,first||null)
    }
  }

  function hardenBugUploader(){
    try{
      uploadBugToAirtable=async function(entry){
        if(bugUploadBusy||!token?.()||!navigator.onLine)return false;bugUploadBusy=true;
        try{
          const fields={[B.code]:entry.code,[B.reported]:entry.time,[B.category]:entry.category,[B.version]:MODERN_VERSION,[B.action]:entry.action||entry.screen||"",[B.message]:entry.message||"",[B.notes]:entry.notes||"",[B.unit]:entry.unit||"",[B.technician]:entry.technician||"",[B.device]:entry.device||"",[B.status]:"Open"};
          const res=await fetch(`https://api.airtable.com/v0/${BASE}/${BUG_TABLE}`,{method:"POST",headers:{Authorization:"Bearer "+token(),"Content-Type":"application/json"},body:JSON.stringify({records:[{fields}],typecast:true})});
          if(!res.ok)return false;entry.cloudSaved=true;const all=loadBugLog?.()||[];const i=all.findIndex(x=>x.code===entry.code);if(i>=0){all[i]=entry;saveBugLog?.(all);renderBugLog?.()}return true;
        }catch{return false}finally{bugUploadBusy=false}
      }
    }catch{}
  }

  function debounceEquipmentSearch(){
    const old=byId("equipmentSearch");if(!old||old.dataset.rcDebounced==="yes")return;
    const clone=old.cloneNode(true);clone.dataset.rcDebounced="yes";old.replaceWith(clone);let t;clone.addEventListener("input",()=>{clearTimeout(t);t=setTimeout(()=>{try{renderList()}catch{}},90)});
  }
  function lighterPhotos(){
    const set=()=>document.querySelectorAll(".photo-grid img").forEach(img=>{img.loading="lazy";img.decoding="async"});set();const obs=new MutationObserver(set);obs.observe(document.body,{childList:true,subtree:true});
  }

  function refreshAll(){
    updateVersionUI();applyTheme(currentTheme());addWelcomeStrip();makeMoreMenu();prepareCustomerHandoff();modernizePrintCenter();cleanupLegacySettings();updateManualAndPatchNotes();ensureInstallExperience();updateActiveNav();debounceEquipmentSearch();
  }
  window.rescomRefreshModernUI=refreshAll;

  function initialize(){
    hardenBugUploader();lighterPhotos();installNavObserver();refreshAll();maybeShowIOSInstallNudge();
    const observer=new MutationObserver(()=>{prepareCustomerHandoff();modernizePrintCenter();cleanupLegacySettings();updateManualAndPatchNotes();ensureInstallExperience();updateActiveNav()});
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});else initialize();
})();
