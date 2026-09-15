(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Math.max(0, Number(n) || 0));
  const compact = n => new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 }).format(n);
  const getProp = id => PROPERTIES.find(p => p.id === Number(id));
  const readJSON = (key, fallback = []) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const saved = () => readJSON("ZENROVA -favourites", []);
  const setSaved = a => localStorage.setItem("ZENROVA -favourites", JSON.stringify(a));
  const compared = () => readJSON("ZENROVA -compare", []);
  const setCompared = a => localStorage.setItem("ZENROVA -compare", JSON.stringify(a));
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[c]));

  const zones = [
    ["Nigeria", "Lagos", "Africa/Lagos", "en-NG"],
    ["U.K.", "London", "Europe/London", "en-GB"],
    ["U.S.A", "New York", "America/New_York", "en-US"],
    ["Norway", "Oslo", "Europe/Oslo", "en-GB"],
    ["France", "Paris", "Europe/Paris", "fr-FR"]
  ];

  function clocksMarkup() {
  return `<section class="world-clock-strip" aria-label="Real-time world clocks"><div class="container clock-row">${zones.map((z, i) => `<div class="clock-item"><span>${z[0]}</span><strong data-date="${i}">-- --- ----</strong><strong data-clock="${i}">--:--:--</strong><small>${z[1]}</small></div>`).join("")}</div></section>`;
}
  function updateClocks() {
    $$('[data-clock]').forEach(el => {
        const z = zones[Number(el.dataset.clock)];
        const now = new Date();

        const time = new Intl.DateTimeFormat(z[3], {
            timeZone: z[2],
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).format(now);

        const date = new Intl.DateTimeFormat(z[3], {
            timeZone: z[2],
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(now);

        el.textContent = time;

        const dateEl = el.parentElement.querySelector('[data-date]');
        if (dateEl) dateEl.textContent = date;
    });
}

  function header() {
    const page = document.body.dataset.page;
    $("#site-header").innerHTML = `<header class="site-header"><div class="container nav"><a class="brand" href="index.html"><strong>ZENRONVA Realty</strong><small>L A G O S  •  N I G E R I A</small></a><button class="menu-btn" aria-label="Open navigation" aria-expanded="false">☰</button><nav class="nav-links">
      <a class="${page === "home" ? "active" : ""}" href="index.html">Home</a>
      <a class="${["properties", "property", "favourites"].includes(page) ? "active" : ""}" href="properties.html">Properties</a>
      <a class="${page === "tools" ? "active" : ""}" href="tools.html">Tools</a>
      <a class="${page === "services" ? "active" : ""}" href="services.html">Services</a>
      <a class="${page === "about" ? "active" : ""}" href="about.html">About</a>
      <a class="nav-cta ${page === "contact" ? "active" : ""}" href="contact.html">Contact ↗</a>
    </nav></div></header>${clocksMarkup()}`;
    const h = $(".site-header"), btn = $(".menu-btn"), links = $(".nav-links");
    btn?.addEventListener("click", () => { const open = links.classList.toggle("open"); btn.setAttribute("aria-expanded", String(open)); });
    $$(".nav-links a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
    const onScroll = () => { h.classList.toggle("scrolled", scrollY > 30); document.documentElement.style.setProperty("--scroll-progress", `${Math.min(100, (scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100)}%`); };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    updateClocks(); setInterval(updateClocks, 1000);
  }

  function footer() {
    $("#site-footer").innerHTML = `<footer class="site-footer"><div class="container footer-grid"><div>
    <a class="brand" href="index.html">
    <strong>ZENVORA Realty</strong>
    <span class="brand-location">L A G O S  •  N I G E R I A</span>
</a>
<p>A refined property advisory experience for buyers, sellers and investors who value clarity, quality and considered spaces.</p></div><div><h4>Explore</h4><a href="properties.html">Properties</a><a href="tools.html">Property tools</a><a href="services.html">Services</a><a href="about.html">About</a><a href="contact.html">Contact</a></div><div><h4>Connect</h4><a href="mailto:adesanyaoloruntoba@gmail.com">adesanyaoloruntoba@gmail.com</a><a href="tel:07035310262">07035310262</a><a href="https://github.com/drnm3024-hash" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.instagram.com/adesanyaboluwatifeayodele?stkn=djZ0c3ZhZnI1aWFo" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/in/adesanya-boluwatife-6464a2381" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} ZENROVA Realty</span><span>Interactive Real Estate Website · Built for Property Discovery, Comparison & Enquiries</span></div></footer>`;
  }

  function toast(msg) {
    let t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.append(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(window._toast); window._toast = setTimeout(() => t.classList.remove("show"), 2400);
  }

  function favourite(id) {
    let a = saved(); a = a.includes(id) ? a.filter(x => x !== id) : [...a, id]; setSaved(a); refreshFavouriteButtons(); toast(a.includes(id) ? "Added to favourites" : "Removed from favourites"); renderCompareBar();
  }
  function refreshFavouriteButtons() {
    const a = saved(); $$('[data-fav]').forEach(b => { const yes = a.includes(Number(b.dataset.fav)); b.classList.toggle("saved", yes); b.textContent = yes ? "♥" : "♡"; });
    const count = $("#fav-count"); if (count) { count.textContent = a.length; count.classList.toggle("hidden", !a.length); }
  }
  function toggleCompare(id) {
    let a = compared();
    if (a.includes(id)) a = a.filter(x => x !== id);
    else if (a.length >= 3) { toast("Compare up to 3 properties at once"); return; }
    else a = [...a, id];
    setCompared(a); refreshCompareButtons(); renderCompareBar(); toast(a.includes(id) ? "Added to comparison" : "Removed from comparison");
  }
  function refreshCompareButtons() { const a = compared(); $$('[data-compare]').forEach(b => { const yes = a.includes(Number(b.dataset.compare)); b.classList.toggle("selected", yes); b.textContent = yes ? "Compared" : "Compare"; }); }

  function card(p, options = {}) {
    const fav = saved().includes(p.id), cmp = compared().includes(p.id);
    return `<article class="property-card reveal-card" data-property-card="${p.id}"><div class="property-media-wrap"><a href="property.html?id=${p.id}" class="property-image" aria-label="View ${escapeHTML(p.title)}"><img loading="lazy" src="${p.images[0]}" alt="${escapeHTML(p.title)}"><span class="property-badge">${escapeHTML(p.tag)}</span><span class="image-count">${p.images.length} photos</span></a><button class="heart ${fav ? "saved" : ""}" data-fav="${p.id}" aria-label="${fav ? "Remove" : "Save"} ${escapeHTML(p.title)}">${fav ? "♥" : "♡"}</button></div><div class="property-info"><div class="property-meta"><span>${escapeHTML(p.location)} · ${escapeHTML(p.type)}</span><span>${p.beds} bed · ${p.baths} bath</span></div><h3>${escapeHTML(p.title)}</h3><p class="card-desc">${escapeHTML(p.description)}</p><div class="property-bottom"><span class="price">${money(p.price)}</span><div class="card-actions"><button class="compare-btn ${cmp ? "selected" : ""}" data-compare="${p.id}">${cmp ? "Compared" : "Compare"}</button><a class="text-link" href="property.html?id=${p.id}">View ↗</a></div></div></div></article>`;
  }
  function bindPropertyActions() {
    $$('[data-fav]').forEach(b => b.onclick = e => { e.preventDefault(); e.stopPropagation(); favourite(Number(b.dataset.fav)); });
    $$('[data-compare]').forEach(b => b.onclick = e => { e.preventDefault(); toggleCompare(Number(b.dataset.compare)); });
    refreshFavouriteButtons(); refreshCompareButtons();
  }

  function renderCompareBar() {
    let bar = $("#compare-bar"); if (!bar) return;
    const items = compared().map(getProp).filter(Boolean);
    if (!items.length) { bar.classList.remove("show"); return; }
    bar.innerHTML = `<div><strong>${items.length} selected</strong><span>${items.map(p => escapeHTML(p.title)).join(" · ")}</span></div><div class="compare-bar-actions"><a class="btn btn-light small" href="compare.html">Compare now ↗</a><button class="bar-clear" id="clear-compare">Clear</button></div>`;
    bar.classList.add("show"); $("#clear-compare")?.addEventListener("click", () => { setCompared([]); refreshCompareButtons(); renderCompareBar(); });
  }
  function mountCompareBar() { if (!$("#compare-bar")) { const d = document.createElement("div"); d.id = "compare-bar"; d.className = "compare-bar"; document.body.append(d); } renderCompareBar(); }

  function home() {
    const grid = $("#featured-grid"); if (!grid) return;
    grid.innerHTML = PROPERTIES.filter(p => p.featured).map(card).join(""); bindPropertyActions();
    $$("[data-count]").forEach(el => { let target = +el.dataset.count, done = false; const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting && !done) { done = true; let n = 0; const timer = setInterval(() => { n = Math.min(target, n + Math.max(1, Math.ceil(target / 36))); el.textContent = n + (target > 20 ? "+" : ""); if (n >= target) clearInterval(timer) }, 24) } })); io.observe(el); });
    $$("[data-spotlight]").forEach(el => el.addEventListener("mouseenter", () => el.classList.add("is-active")));
  }

  function listings() {
    const grid = $("#property-grid"); if (!grid) return;
    const q = $("#q"), loc = $("#location"), type = $("#type"), beds = $("#beds"), min = $("#min-price"), max = $("#max-price"), status = $("#status"), amenity = $("#amenity"), sort = $("#sort"), match = $("#match-mode");
    if (!loc || !type) return;
    [...new Set(PROPERTIES.map(p => p.location))].sort().forEach(x => loc.insertAdjacentHTML("beforeend", `<option>${escapeHTML(x)}</option>`));
    [...new Set(PROPERTIES.map(p => p.type))].sort().forEach(x => type.insertAdjacentHTML("beforeend", `<option>${escapeHTML(x)}</option>`));
    [...new Set(PROPERTIES.map(p => p.status))].sort().forEach(x => status?.insertAdjacentHTML("beforeend", `<option>${escapeHTML(x)}</option>`));
    [...new Set(PROPERTIES.flatMap(p => p.features))].sort().forEach(x => amenity?.insertAdjacentHTML("beforeend", `<option>${escapeHTML(x)}</option>`));
    function render() {
      let arr = PROPERTIES.filter(p => {
        const text = `${p.title} ${p.location} ${p.type} ${p.features.join(" ")}`.toLowerCase();
        const query = (q?.value || "").trim().toLowerCase();
        const matchMode = match?.value || "all";
        const queryOK = !query || text.includes(query);
        const minOK = !min?.value || p.price >= Number(min.value);
        const maxOK = !max?.value || p.price <= Number(max.value);
        const bedOK = !beds?.value || p.beds >= Number(beds.value);
        const amenityOK = !amenity?.value || p.features.includes(amenity.value);
        const base = queryOK && (!loc.value || p.location === loc.value) && (!type.value || p.type === type.value) && bedOK && minOK && maxOK && (!status?.value || p.status === status.value) && amenityOK;
        if (!base) return false;
        if (matchMode === "value") return p.yield >= 6;
        if (matchMode === "space") return p.size >= 250;
        return true;
      });
      if (sort?.value === "price-low") arr.sort((a, b) => a.price - b.price);
      if (sort?.value === "price-high") arr.sort((a, b) => b.price - a.price);
      if (sort?.value === "newest") arr.sort((a, b) => b.year - a.year);
      if (sort?.value === "yield") arr.sort((a, b) => b.yield - a.yield);
      grid.innerHTML = arr.map(card).join("");
      $("#result-count").textContent = `${arr.length} ${arr.length === 1 ? "property" : "properties"}`;
      $("#empty-state")?.classList.toggle("hidden", arr.length > 0);
      const live = $("#live-status"); if (live) live.textContent = "Live filter · browser only";
      bindPropertyActions(); renderCompareBar();
    }
    [q, loc, type, beds, min, max, status, amenity, sort, match].filter(Boolean).forEach(x => x.addEventListener(x.tagName === "INPUT" ? "input" : "change", render));
    $("#filter-form")?.addEventListener("reset", () => setTimeout(render, 0)); $("#empty-reset")?.addEventListener("click", () => { $("#filter-form").reset(); render(); });
    render();
    const params = new URLSearchParams(location.search); if (params.get("q")) { q.value = params.get("q"); render(); } if (params.get("location")) { loc.value = params.get("location"); render(); }
  }

  function openLightbox(images, i = 0) {
    let l = $("#lightbox"); if (!l) { l = document.createElement("div"); l.id = "lightbox"; l.className = "lightbox hidden"; l.innerHTML = `<button class="lightbox-close" aria-label="Close">×</button><button class="lightbox-prev" aria-label="Previous">‹</button><figure><img id="lightbox-img" alt=""><figcaption id="lightbox-caption"></figcaption></figure><button class="lightbox-next" aria-label="Next">›</button>`; document.body.append(l); }
    let index = i; const img = $("#lightbox-img"), cap = $("#lightbox-caption"); const paint = () => { index = (index + images.length) % images.length; img.src = images[index]; cap.textContent = `Image ${index + 1} of ${images.length}`; }; paint(); l.classList.remove("hidden");
    const close = () => l.classList.add("hidden"), next = () => { index++; paint() }, prev = () => { index--; paint() };
    $(".lightbox-close", l).onclick = close; $(".lightbox-next", l).onclick = next; $(".lightbox-prev", l).onclick = prev; l.onclick = e => { if (e.target === l) close() };
    const key = e => { if (l.classList.contains("hidden")) return; if (e.key === "Escape") { close(); document.removeEventListener("keydown", key); } if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); }; document.addEventListener("keydown", key);
  }

  function detail() {
    const root = $("#property-detail"); if (!root) return;
    const p = getProp(new URLSearchParams(location.search).get("id") || 1); if (!p) { root.innerHTML = `<section class="section container"><div class="empty-state"><h2>Property not found.</h2><a class="btn btn-dark" href="properties.html">Back to properties</a></div></section>`; return; }
    document.title = `${p.title} — Adesanya Estates`;
    root.innerHTML = `<section class="property-detail-hero container"><div class="property-detail-head"><div><span class="eyebrow">${escapeHTML(p.location)} · ${escapeHTML(p.type)} · ${escapeHTML(p.status)}</span><h1>${escapeHTML(p.title)}</h1><div class="detail-actions"><button class="outline-pill" data-fav="${p.id}">${saved().includes(p.id) ? "♥ Saved" : "♡ Save property"}</button><button class="outline-pill" id="detail-compare">${compared().includes(p.id) ? "✓ Compared" : "＋ Compare"}</button><button class="outline-pill" id="share-property">↗ Share</button></div></div><strong class="detail-price">${money(p.price)}</strong></div><div class="gallery-grid"><button class="gallery-tile gallery-main" data-gallery="0"><img src="${p.images[0]}" alt="${escapeHTML(p.title)} exterior"><span>Open gallery</span></button><button class="gallery-tile" data-gallery="1"><img src="${p.images[1]}" alt="${escapeHTML(p.title)} interior"></button><button class="gallery-tile" data-gallery="2"><img src="${p.images[2]}" alt="${escapeHTML(p.title)} interior"></button></div></section>
    <section class="container detail-layout"><div><div class="detail-stat-row"><div><strong>${p.beds}</strong><span>Bedrooms</span></div><div><strong>${p.baths}</strong><span>Bathrooms</span></div><div><strong>${p.size}</strong><span>m² internal</span></div><div><strong>${p.yield}%</strong><span>Indicative yield</span></div></div><span class="eyebrow">The residence</span><p class="detail-description">${escapeHTML(p.description)}</p><div class="feature-list">${p.features.map(f => `<div>${escapeHTML(f)}<span>Included</span></div>`).join("")}</div><div class="neighbourhood-card"><div><span class="eyebrow">Neighbourhood insight</span><h3>${escapeHTML(p.location)} at a glance</h3><p>Explore the location as part of the decision, with a quick local profile and practical considerations.</p></div><div class="insight-grid"><span><strong>${p.location === "Ikoyi" ? "Prime" : "Connected"}</strong><small>Positioning</small></span><span><strong>${p.yield}%</strong><small>Indicative yield</small></span><span><strong>${p.size}m²</strong><small>Residence size</small></span></div></div></div><aside class="detail-card"><span class="eyebrow">Private viewing</span><h3>See it in person.</h3><label>Your name<input id="view-name" placeholder="Full name" autocomplete="name"></label><label>Preferred date<input id="view-date" type="date"></label><label>Preferred time<select id="view-time"><option>10:00</option><option>12:00</option><option>14:00</option><option>16:00</option></select></label><button class="btn btn-dark" id="book-btn">Request viewing <span>↗</span></button><div class="mortgage-box"><span class="eyebrow">Live payment estimate</span><div class="mini-calc"><label>Deposit %<input id="detail-deposit" type="number" min="0" max="90" value="20"></label><label>Rate %<input id="detail-rate" type="number" min="0" max="40" step="0.1" value="12"></label><label>Years<select id="detail-years"><option>15</option><option selected>20</option><option>25</option><option>30</option></select></label></div><strong id="monthly">${money(monthlyPayment(p.price * .8, .12, 20))}</strong><small>Estimated monthly principal + interest. Frontend estimate only.</small></div></aside></section>`;
    $$('[data-gallery]').forEach(b => b.addEventListener("click", () => openLightbox(p.images, Number(b.dataset.gallery))));
    const favBtn = $('[data-fav]', root); favBtn.onclick = () => { favourite(p.id); favBtn.textContent = saved().includes(p.id) ? "♥ Saved" : "♡ Save property"; };
    $("#detail-compare").onclick = () => { toggleCompare(p.id); $("#detail-compare").textContent = compared().includes(p.id) ? "✓ Compared" : "＋ Compare"; };
    $("#share-property").onclick = async () => { try { await navigator.clipboard.writeText(location.href); toast("Property link copied"); } catch { toast("Copy this page URL to share"); } };
    $("#book-btn").onclick = () => { if (!$("#view-name").value || !$("#view-date").value) { toast("Please add your name and preferred date"); return; } toast(`Viewing request prepared for ${$("#view-date").value} at ${$("#view-time").value}`); };
    const recalc = () => { const dep = Number($("#detail-deposit").value) || 0, rate = (Number($("#detail-rate").value) || 0) / 100, years = Number($("#detail-years").value) || 20; $("#monthly").textContent = money(monthlyPayment(p.price * (1 - dep / 100), rate, years)); };
    ["#detail-deposit", "#detail-rate", "#detail-years"].forEach(s => $(s).addEventListener("input", recalc));
  }

  function monthlyPayment(principal, annualRate, years) { const n = years * 12, r = annualRate / 12; if (!principal) return 0; return r === 0 ? principal / n : principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1); }

  function tools() {
    const calc = $("#mortgage-tool"); if (!calc) return;
    const inputs = { price: $("#m-price"), deposit: $("#m-deposit"), rate: $("#m-rate"), years: $("#m-years") };
    function draw() {
      const price = Number(inputs.price.value) || 0, dep = Math.min(90, Math.max(0, Number(inputs.deposit.value) || 0)), rate = Math.max(0, Number(inputs.rate.value) || 0) / 100, years = Number(inputs.years.value) || 20;
      const loan = price * (1 - dep / 100), payment = monthlyPayment(loan, rate, years), total = payment * years * 12, interest = Math.max(0, total - loan);
      $("#m-payment").textContent = money(payment); $("#m-loan").textContent = money(loan); $("#m-interest").textContent = money(interest); $("#m-total").textContent = money(total);
      $("#m-deposit-output").textContent = money(price * dep / 100); $("#m-rate-output").textContent = `${(rate * 100).toFixed(1)}%`; $("#m-years-output").textContent = `${years} yrs`;
      drawMortgageBars(loan, interest);
    }
    Object.values(inputs).forEach(x => x.addEventListener("input", draw)); draw();
    const roiInputs = { price: $("#roi-price"), rent: $("#roi-rent"), costs: $("#roi-costs"), occupancy: $("#roi-occupancy"), growth: $("#roi-growth") };
    function drawROI() { const price = Number(roiInputs.price.value) || 1, rent = Number(roiInputs.rent.value) || 0, costs = Number(roiInputs.costs.value) || 0, occ = Math.min(100, Math.max(0, Number(roiInputs.occupancy.value) || 0)) / 100, growth = Math.max(0, Number(roiInputs.growth.value) || 0) / 100; const gross = rent * 12 * occ, net = gross - costs, gy = gross / price * 100, ny = net / price * 100, five = price * Math.pow(1 + growth, 5); $("#roi-gross").textContent = `${gy.toFixed(2)}%`; $("#roi-net").textContent = `${ny.toFixed(2)}%`; $("#roi-income").textContent = money(net); $("#roi-value").textContent = money(five); }
    Object.values(roiInputs).forEach(x => x?.addEventListener("input", drawROI)); drawROI();
  }
  function drawMortgageBars(loan, interest) { const el = $("#mortgage-bars"); if (!el) return; const total = loan + interest || 1; el.innerHTML = `<div class="bar-segment principal" style="width:${loan / total * 100}%"></div><div class="bar-segment interest" style="width:${interest / total * 100}%"></div>`; }

  function compare() {
    const root = $("#compare-root"); if (!root) return;
    const items = compared().map(getProp).filter(Boolean); if (!items.length) { root.innerHTML = `<div class="empty-state"><h2>Your comparison is empty.</h2><p>Select up to three properties from the collection.</p><a class="btn btn-dark" href="properties.html">Browse properties</a></div>`; return; }
    root.innerHTML = `<div class="compare-head"><div><span class="eyebrow">Decision studio</span><h1>Compare with <em>clarity.</em></h1><p>Put your shortlisted homes side by side before you decide.</p></div><button class="outline-pill" id="clear-all-compare">Clear comparison</button></div><div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>Metric</th>${items.map(p => `<th><img src="${p.images[0]}" alt=""><strong>${escapeHTML(p.title)}</strong><button data-remove-compare="${p.id}">Remove</button></th>`).join("")}</tr></thead><tbody>${[["Price", p => money(p.price)], ["Location", p => p.location], ["Type", p => p.type], ["Bedrooms", p => p.beds], ["Bathrooms", p => p.baths], ["Size", p => `${p.size} m²`], ["Indicative yield", p => `${p.yield}%`], ["Release", p => p.year]].map(([label, fn]) => `<tr><td>${label}</td>${items.map(p => `<td>${fn(p)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    $$('[data-remove-compare]').forEach(b => b.onclick = () => { setCompared(compared().filter(id => id !== Number(b.dataset.removeCompare))); compare(); renderCompareBar(); }); $("#clear-all-compare").onclick = () => { setCompared([]); compare(); renderCompareBar(); };
  }

  function services() {
    if (!$("#service-explorer")) return;
    const servicesData = [
      ["01", "Acquisition advisory", "From brief to negotiation", "A structured search that turns a broad wish list into a shortlist you can act on.", ["Private property matching", "Value & negotiation guidance", "Due-diligence checklist", "Viewing coordination"]],
      ["02", "Property marketing", "Position your asset beautifully", "Present a property with the photography, narrative and digital exposure it deserves.", ["Editorial listing strategy", "Premium image presentation", "Targeted digital exposure", "Lead-ready enquiry flow"]],
      ["03", "Investment guidance", "Numbers before emotion", "Evaluate rental potential, yield and long-term positioning with practical browser-based tools.", ["Rental yield modelling", "5-year growth scenario", "Neighbourhood comparison", "Acquisition strategy"]],
      ["04", "Private viewings", "A better way to see", "Move from scrolling to a focused viewing experience built around your schedule.", ["Flexible viewing requests", "Property briefing before arrival", "Follow-up notes", "Shortlist management"]]
    ];
    const tabs = $("#service-tabs"), panel = $("#service-panel"); tabs.innerHTML = servicesData.map((s, i) => `<button class="service-tab ${i === 0 ? "active" : ""}" data-service="${i}"><span>${s[0]}</span><strong>${s[1]}</strong><small>${s[2]}</small></button>`).join("");
    const render = i => { const s = servicesData[i]; panel.innerHTML = `<div class="service-panel-copy"><span class="eyebrow">${s[0]} / ${s[1]}</span><h2>${s[2]}</h2><p>${s[3]}</p><div class="service-checks">${s[4].map(x => `<span>✓ ${x}</span>`).join("")}</div><a class="btn btn-dark" href="contact.html?service=${encodeURIComponent(s[1])}">Discuss this service <span>↗</span></a></div><div class="service-panel-visual"><div class="orbit-card"><span>AD</span><strong>${s[1]}</strong><small>Adesanya Estates</small></div><div class="floating-stat"><strong>${i === 2 ? "6.3%" : "24h"}</strong><span>${i === 2 ? "sample portfolio yield" : "typical response window"}</span></div></div>`; $$('.service-tab').forEach((b, j) => b.classList.toggle('active', j === i)); };
    tabs.addEventListener("click", e => { const b = e.target.closest("[data-service]"); if (b) render(Number(b.dataset.service)); }); render(0);
  }

  function contact() {
    const form = $("#contact-form"); if (!form) return;
    const service = new URLSearchParams(location.search).get("service"); if (service && $("#contact-service")) $("#contact-service").value = service;
    form.addEventListener("submit", e => { e.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; } $("#contact-success").classList.remove("hidden"); form.reset(); toast("Enquiry prepared successfully"); });
  }

  function favouritesPage() {
    const grid = $("#favourites-grid"); if (!grid) return; const items = saved().map(getProp).filter(Boolean); grid.innerHTML = items.length ? items.map(card).join("") : "<div class='empty-state'><h2>No saved properties yet.</h2><p>Use the heart on any property card to build a shortlist.</p><a class='btn btn-dark' href='properties.html'>Explore properties</a></div>"; bindPropertyActions();
  }

  function motion() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }), { threshold: .08 }); $$('.reveal,.reveal-card').forEach(x => io.observe(x));
    if (matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) { $$('.property-card,.service-panel-visual,.feature-spot').forEach(el => { el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.setProperty('--rx', `${y * -2}deg`); el.style.setProperty('--ry', `${x * 2}deg`); }); el.addEventListener('mouseleave', () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); }); }); }
  }

  function pageExtras() {
    const today = new Date().toISOString().split("T")[0]; $$('input[type="date"]').forEach(x => { if (!x.min) x.min = today; });
    $$('a[href]').forEach(a => { if (a.target || a.href.startsWith('mailto:') || a.href.startsWith('tel:') || a.href.includes('#')) return; a.addEventListener('click', () => document.body.classList.add('page-leaving')); });
  }

  header(); footer(); home(); listings(); detail(); tools(); compare(); services(); contact(); favouritesPage(); mountCompareBar(); motion(); pageExtras();
})();
