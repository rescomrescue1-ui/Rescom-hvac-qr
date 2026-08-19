/* Res-Com HVAC QR v29 — modern field UX layer */
(() => {
  "use strict";

  const MODERN_VERSION = "29.1";
  const MODERN_BUILD = "Aug 19, 2026 11:11 AM";
  const ONBOARD_KEY = "rescom_onboarded_v29";
  let bugUploadBusy = false;

  const byId = id => document.getElementById(id);
  const escapeHTML = s => {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  };

  function updateVersionUI(){
    const badge = byId("appVersionBadge");
    if(badge) badge.textContent = `APP v${MODERN_VERSION} • UPDATED ${MODERN_BUILD}`;
    const lv = byId("loadingVersion");
    if(lv) lv.textContent = `Installed v${MODERN_VERSION}`;
    document.documentElement.dataset.rescomUi = MODERN_VERSION;
  }

  function techName(){
    try { return currentUser?.()?.name || "Technician"; } catch { return "Technician"; }
  }

  function addWelcomeStrip(){
    const home = byId("home");
    if(!home || byId("rcWelcomeStrip")) return;
    const strip = document.createElement("div");
    strip.id = "rcWelcomeStrip";
    strip.innerHTML = `<div class="copy"><h2>Ready, ${escapeHTML(techName())}</h2><p>Scan. Service. Save. Everything stays tied to the equipment QR.</p></div><div class="avatar">RC</div>`;
    home.prepend(strip);
  }

  function makeMoreMenu(){
    const nav = byId("globalNav");
    if(!nav || byId("rcMoreNav")) return;
    const more = document.createElement("button");
    more.id = "rcMoreNav";
    more.type = "button";
    more.textContent = "MORE";
    more.dataset.safeBound = "yes";
    nav.appendChild(more);

    const wrap = document.createElement("div");
    wrap.id = "rcMoreBackdrop";
    wrap.innerHTML = `<div id="rcMoreSheet" role="dialog" aria-modal="true" aria-label="More menu">
      <div class="handle"></div>
      <h3>More</h3>
      <div class="rcMoreGrid">
        <button type="button" data-rc-more="settings">⚙️ Settings</button>
        <button type="button" data-rc-more="manual">📘 Manual</button>
        <button type="button" data-rc-more="patchnotes">📝 What’s New</button>
        <button type="button" data-rc-more="health">🩺 System Health</button>
      </div>
    </div>`;
    document.body.appendChild(wrap);

    more.addEventListener("click", () => wrap.classList.add("open"));
    wrap.addEventListener("click", e => { if(e.target === wrap) wrap.classList.remove("open"); });
    wrap.querySelectorAll("[data-rc-more]").forEach(btn => btn.addEventListener("click", async () => {
      wrap.classList.remove("open");
      const target = btn.dataset.rcMore;
      if(target === "settings") { try { await navGoSettings(); } catch { show("settings"); } }
      if(target === "manual") { show("manualScreen"); scrollTo(0,0); }
      if(target === "patchnotes") { show("patchNotes"); scrollTo(0,0); }
      if(target === "health") { try { await openSystemHealth(); } catch { show("healthScreen"); } }
    }));
  }

  function updateActiveNav(){
    const ids = ["navHome","navEquipment","navAccounts","navBugs","rcMoreNav"];
    ids.forEach(id => byId(id)?.classList.remove("rc-active"));
    let screen = "";
    try { screen = currentScreenName(); } catch {}
    const map = {home:"navHome",equipmentScreen:"navEquipment",accountsScreen:"navAccounts",accountDetailScreen:"navAccounts",bugScreen:"navBugs",healthScreen:"navBugs"};
    const active = byId(map[screen] || (['settings','manualScreen','patchNotes'].includes(screen) ? 'rcMoreNav' : ''));
    active?.classList.add("rc-active");
  }

  function installNavObserver(){
    const root = document.querySelector("main");
    if(!root) return;
    const obs = new MutationObserver(updateActiveNav);
    obs.observe(root,{subtree:true,attributes:true,attributeFilter:["class"]});
    updateActiveNav();
  }

  function prepareCustomerHandoff(){
    const section = byId("qrHandoff");
    if(!section) return;
    const card = section.querySelector(".card");
    if(!card || byId("rcCustomerNotice")) return;

    const notice = document.createElement("div");
    notice.id = "rcCustomerNotice";
    notice.innerHTML = `<div class="shield">🛠</div>
      <h2>Service Technician QR</h2>
      <p>This label is used by HVAC service professionals to open the equipment’s technical service history.</p>
      <div class="customerLine">Customer? No action is required.</div>`;
    card.prepend(notice);

    const tools = document.createElement("div");
    tools.id = "rcTechHandoffTools";
    tools.className = "hiddenByNotice";
    const keep = Array.from(card.children).filter(el => el !== notice);
    keep.forEach(el => tools.appendChild(el));
    card.appendChild(tools);

    const techBtn = document.createElement("button");
    techBtn.type = "button";
    techBtn.className = "orange";
    techBtn.textContent = "I’M A RES-COM TECHNICIAN";
    techBtn.dataset.safeBound = "yes";
    notice.appendChild(techBtn);
    techBtn.addEventListener("click", () => {
      tools.classList.remove("hiddenByNotice");
      techBtn.remove();
      tools.scrollIntoView({behavior:"smooth",block:"start"});
    });
  }

  function modernizePrintCenter(){
    const options = document.querySelector("#labelScreen .printOptions");
    if(options && !byId("rcPrintSummary")){
      const summary = document.createElement("div");
      summary.id = "rcPrintSummary";
      summary.textContent = "Choose a quantity, then tap Generate. Codes are created only when you generate labels.";
      options.appendChild(summary);
    }

    document.querySelectorAll(".qtyBtn").forEach(old => {
      if(old.dataset.rcFixed === "yes") return;
      const clone = old.cloneNode(true);
      clone.dataset.rcFixed = "yes";
      clone.dataset.safeBound = "yes";
      old.replaceWith(clone);
      clone.addEventListener("click", () => {
        const input = byId("qrPrintQuantity");
        if(input) input.value = clone.dataset.qty || "1";
        const summary = byId("rcPrintSummary");
        if(summary) summary.textContent = `${clone.dataset.qty || 1} label${clone.dataset.qty === "1" ? "" : "s"} selected. Tap Generate when ready.`;
      });
    });

    const create = byId("createBlank");
    if(create && create.dataset.rcFixed !== "yes"){
      const clone = create.cloneNode(true);
      clone.dataset.rcFixed = "yes";
      clone.dataset.safeBound = "yes";
      create.replaceWith(clone);
      clone.addEventListener("click", () => {
        const input = byId("qrPrintQuantity"); if(input) input.value = "1";
        const area = byId("printArea"); if(area) area.innerHTML = "";
        try { generatedLabelIds = []; currentId = null; } catch {}
        const setup = byId("setupNow"); if(setup) setup.classList.add("hidden");
        const s = byId("rcPrintSummary"); if(s) s.textContent = "Choose a quantity, then tap Generate. No QR IDs are created until then.";
        show("labelScreen");
      });
    }

    try {
      renderQrLabels = function(ids){
        generatedLabelIds = (ids || []).slice();
        const area = byId("printArea"); if(!area) return;
        area.innerHTML = generatedLabelIds.map((id,i) => `<div class="print-label">
          <h2>RES-COM HVAC</h2>
          <div class="label-sub">Equipment Service History</div>
          <div class="qr-cell" id="qrLabel_${i}"></div>
          <div class="qr-code-text">QR CODE: <span class="mono">${escapeHTML(id)}</span></div>
          <div class="tech-only">FOR SERVICE TECHNICIANS</div>
          <div class="label-footer">Customer action is not required. Scan to set up or service this equipment.</div>
        </div>`).join("");
        generatedLabelIds.forEach((id,i) => new QRCode(byId("qrLabel_"+i),{text:appURL(id),width:200,height:200,correctLevel:QRCode.CorrectLevel.M}));
        currentId = generatedLabelIds[0] || null;
        const setup = byId("setupNow"); if(setup) setup.classList.toggle("hidden",generatedLabelIds.length !== 1);
        const summary = byId("rcPrintSummary");
        if(summary) summary.textContent = `${generatedLabelIds.length} unique QR label${generatedLabelIds.length === 1 ? "" : "s"} ready to print.`;
      };
    } catch {}
  }

  function addOnboarding(){
    if(byId("rcOnboarding")) return;
    const wrap = document.createElement("div");
    wrap.id = "rcOnboarding";
    wrap.innerHTML = `<div class="rcOnboardCard">
      <img class="rcOnboardLogo" src="icon-192.png" alt="Res-Com">
      <div class="rcOnboardSteps"><span class="active"></span><span></span><span></span></div>
      <div class="rcOnboardPanel active" data-step="0">
        <h1>Welcome to Res-Com</h1>
        <p>Everything you need for equipment service history, without digging through paperwork.</p>
        <div class="rcOnboardFeature"><div class="i">▣</div><div><b>Scan or search</b><span>Open the right unit in seconds.</span></div></div>
        <div class="rcOnboardFeature"><div class="i">＋</div><div><b>Service & save</b><span>Add work notes, parts and photos in one place.</span></div></div>
        <div class="rcOnboardFeature"><div class="i">✓</div><div><b>Works in the field</b><span>Phone, tablet or desktop. Offline fallback stays available.</span></div></div>
      </div>
      <div class="rcOnboardPanel" data-step="1">
        <h1>Who’s using the app?</h1>
        <p>Pick your technician name so service history is credited correctly.</p>
        <label>Technician</label>
        <select id="rcOnboardTech"><option value="">Choose technician…</option></select>
        <label>Or enter your name</label>
        <input id="rcOnboardTechCustom" placeholder="Technician name">
      </div>
      <div class="rcOnboardPanel" data-step="2">
        <h1>You’re ready</h1>
        <p>The four main jobs stay right on Home: create a label, search a QR, scan a QR, or report a problem.</p>
        <div class="rcOnboardFeature"><div class="i">1</div><div><b>Create / print labels</b><span>One or many, each with a unique permanent code.</span></div></div>
        <div class="rcOnboardFeature"><div class="i">2</div><div><b>Stick one label per unit</b><span>The QR belongs to that equipment for its life.</span></div></div>
        <div class="rcOnboardFeature"><div class="i">3</div><div><b>Scan on every visit</b><span>See prior work and add the new service entry.</span></div></div>
      </div>
      <div class="rcOnboardActions"><button id="rcOnboardBack" class="gray" type="button">BACK</button><button id="rcOnboardNext" class="orange" type="button">CONTINUE</button></div>
    </div>`;
    document.body.appendChild(wrap);

    let step = 0;
    const panels = Array.from(wrap.querySelectorAll(".rcOnboardPanel"));
    const dots = Array.from(wrap.querySelectorAll(".rcOnboardSteps span"));
    const back = byId("rcOnboardBack"), next = byId("rcOnboardNext"), sel = byId("rcOnboardTech");
    const names = new Set();
    try { (techs?.() || []).forEach(n => names.add(n)); } catch {}
    try { const u = currentUser?.(); if(u?.name && u.name !== "Res-Com Technician") names.add(u.name); } catch {}
    names.forEach(n => sel.insertAdjacentHTML("beforeend",`<option value="${escapeHTML(n)}">${escapeHTML(n)}</option>`));

    const paint = () => {
      panels.forEach((p,i) => p.classList.toggle("active",i===step)); dots.forEach((d,i) => d.classList.toggle("active",i===step));
      back.style.visibility = step ? "visible" : "hidden";
      next.textContent = step === 2 ? "GO TO APP" : "CONTINUE";
    };
    back.dataset.safeBound = next.dataset.safeBound = "yes";
    back.addEventListener("click",()=>{ if(step>0){step--;paint();} });
    next.addEventListener("click",()=>{
      if(step===1){
        const custom = (byId("rcOnboardTechCustom")?.value || "").trim();
        const name = custom || sel.value;
        if(!name){ alert("Choose or enter your technician name."); return; }
        try {
          const existing = currentUser?.() || {};
          saveCurrentUser({...existing,name,role:existing.role || "Technician",active:true});
          addTechName?.(name);
        } catch {}
      }
      if(step<2){step++;paint();return;}
      localStorage.setItem(ONBOARD_KEY,"yes");
      wrap.classList.remove("open");
      addWelcomeStrip();
    });
    paint();
  }

  function maybeShowOnboarding(){
    if(localStorage.getItem(ONBOARD_KEY)==="yes") return;
    const loadingHidden = byId("loadingScreen")?.classList.contains("hidden");
    const pinHidden = byId("pinGate")?.classList.contains("hidden");
    if(loadingHidden && pinHidden){
      addOnboarding();
      byId("rcOnboarding")?.classList.add("open");
    }
  }

  function installOnboardWatcher(){
    const timer = setInterval(() => {
      maybeShowOnboarding();
      if(localStorage.getItem(ONBOARD_KEY)==="yes") clearInterval(timer);
    },400);
    setTimeout(()=>clearInterval(timer),120000);
  }

  function injectManualAndPatchNotes(){
    const manualCard = document.querySelector("#manualScreen .card");
    if(manualCard && !byId("m-modern-v29")){
      const section = document.createElement("div");
      section.className = "manual-section";
      section.id = "m-modern-v29";
      section.innerHTML = `<h3>Modern v29 Layout</h3>
        <p>Home is a simple four-action dashboard: Create QR Label, Search QR by ID, Scan QR, and Report a Problem.</p>
        <p>The bottom navigation now keeps the most-used tabs visible: Home, Equipment, Accounts, Bugs, and More. More contains Settings, Manual, What’s New, and System Health.</p>
        <p>On a new device, enter the company PIN, choose your technician name, then follow the three-step onboarding. The same layout automatically adapts to iPhone, Samsung/Android phones, tablets, and desktop browsers.</p>
        <p>Blank label quantity buttons only choose a quantity. New permanent QR IDs are created only after tapping Generate. Multi-label printing uses a two-column Letter-page layout with smaller 3-inch labels to reduce clipping.</p>
        <p>When a customer scans an equipment QR, the first message explains that the QR is for service technicians and that no customer action is required.</p>`;
      manualCard.insertBefore(section, manualCard.firstElementChild?.nextSibling || null);
    }

    const patchCard = document.querySelector("#patchNotes .card");
    if(patchCard && !byId("rcPatch29")){
      const block = document.createElement("div");
      block.className = "unit";
      block.id = "rcPatch29";
      block.innerHTML = `<h3>Version 29.0 — Modern UI</h3><p><b>Major redesign release</b></p>
        <p>• Complete modern visual redesign inspired by current social/mobile apps: cleaner spacing, white surfaces, navy/blue chrome, rounded action cards, and faster visual scanning.</p>
        <p>• Rebuilt bottom navigation to five obvious tabs: Home, Equipment, Accounts, Bugs, More.</p>
        <p>• Added a compact More bottom sheet for Settings, Manual, What’s New, and System Health.</p>
        <p>• Added three-step new-user onboarding and technician selection.</p>
        <p>• Added technician-first customer QR landing notice: customer action is not required.</p>
        <p>• Improved responsive layouts for iPhone, Samsung/Android, tablets, and desktop browsers.</p>
        <p>• Reworked multi-label printing to prevent accidental blank QR creation and reduce print clipping.</p>
        <p>• Added technician-only wording on printed equipment labels.</p>
        <p>• Hardened cloud bug upload to prevent recursive error storms if Airtable bug logging itself fails.</p>
        <p>• Kept the same GitHub Pages path and legacy unit/equipment QR query compatibility.</p>`;
      const firstUnit = patchCard.querySelector(".unit");
      patchCard.insertBefore(block, firstUnit || null);
    }
  }

  function hardenBugUploader(){
    try {
      uploadBugToAirtable = async function(entry){
        if(bugUploadBusy || !token?.() || !navigator.onLine) return false;
        bugUploadBusy = true;
        try {
          const fields = {
            [B.code]:entry.code,[B.reported]:entry.time,[B.category]:entry.category,[B.version]:MODERN_VERSION,
            [B.action]:entry.action||entry.screen||"",[B.message]:entry.message||"",[B.notes]:entry.notes||"",
            [B.unit]:entry.unit||"",[B.technician]:entry.technician||"",[B.device]:entry.device||"",[B.status]:"Open"
          };
          const res = await fetch(`https://api.airtable.com/v0/${BASE}/${BUG_TABLE}`,{
            method:"POST",headers:{Authorization:"Bearer "+token(),"Content-Type":"application/json"},
            body:JSON.stringify({records:[{fields}],typecast:true})
          });
          if(!res.ok) return false; // intentionally do not call api()/logBug() here
          entry.cloudSaved = true;
          const all = loadBugLog?.() || [];
          const i = all.findIndex(x=>x.code===entry.code);
          if(i>=0){ all[i]=entry; saveBugLog?.(all); renderBugLog?.(); }
          return true;
        } catch { return false; }
        finally { bugUploadBusy = false; }
      };
    } catch {}
  }

  function debounceEquipmentSearch(){
    const old = byId("equipmentSearch");
    if(!old || old.dataset.rcDebounced==="yes") return;
    const clone = old.cloneNode(true);
    clone.dataset.rcDebounced = "yes";
    old.replaceWith(clone);
    let t;
    clone.addEventListener("input",()=>{clearTimeout(t);t=setTimeout(()=>{try{renderList();}catch{}},110);});
  }

  function lighterPhotos(){
    document.querySelectorAll(".photo-grid img").forEach(img=>{img.loading="lazy";img.decoding="async";});
    const obs = new MutationObserver(()=>document.querySelectorAll(".photo-grid img").forEach(img=>{img.loading="lazy";img.decoding="async";}));
    obs.observe(document.body,{childList:true,subtree:true});
  }

  function modernizePinCopy(){
    const gate = byId("pinGate");
    if(!gate) return;
    const h = gate.querySelector("h2"), p = gate.querySelector("p");
    if(h) h.textContent = "Technician Access";
    if(p) p.textContent = "Enter the 4-digit Res-Com company PIN.";
    const b = byId("unlockCompany"); if(b) b.textContent = "CONTINUE";
  }

  function initialize(){
    updateVersionUI();
    modernizePinCopy();
    addWelcomeStrip();
    makeMoreMenu();
    installNavObserver();
    prepareCustomerHandoff();
    modernizePrintCenter();
    injectManualAndPatchNotes();
    hardenBugUploader();
    debounceEquipmentSearch();
    lighterPhotos();
    installOnboardWatcher();

    // Keep modern UI applied to screens that are rendered after startup.
    const observer = new MutationObserver(() => {
      prepareCustomerHandoff();
      modernizePrintCenter();
      injectManualAndPatchNotes();
      updateActiveNav();
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",initialize,{once:true});
  else initialize();
})();
