// ── Warroom Intelligence Dashboard ─────────────────────────────────────────
// Fetch strategy: rss2json.com (CORS-safe) + single GDELT call

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";
const GDELT_BASE = "https://api.gdeltproject.org/api/v2/doc/doc";
const CACHE_KEY  = "warroom_v7";
const CACHE_TTL  = 10 * 60 * 1000; // 10 minutes

// ── Working RSS Feeds (verified via rss2json.com) ─────────────────────────
const RSS_FEEDS = [
  // Chinese-language news
  { id: "bbc_zh",  name: "BBC中文",       lang: "zh", url: "https://feeds.bbci.co.uk/zhongwen/trad/rss.xml" },
  { id: "ltn",     name: "自由時報",      lang: "zh", url: "https://news.ltn.com.tw/rss/world.xml" },
  { id: "rfa",     name: "自由亞洲電台",  lang: "zh", url: "https://www.rfa.org/mandarin/rss2.xml" },
  { id: "dw_zh",   name: "DW中文",        lang: "zh", url: "https://rss.dw.com/rdf/rss-chi-all" },
  // English news
  { id: "guardian",   name: "The Guardian",   lang: "en", url: "https://www.theguardian.com/world/rss" },
  { id: "aljazeera",  name: "Al Jazeera",     lang: "en", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { id: "defenseone", name: "Defense One",    lang: "en", url: "https://www.defenseone.com/rss/all/" },
  { id: "breakingdef",name: "Breaking Defense",lang: "en",url: "https://breakingdefense.com/feed/" },
  // Authoritative geopolitics think-tanks
  { id: "diplomat",   name: "The Diplomat",    lang: "en", url: "https://thediplomat.com/feed/",                    taiwan: true },
  { id: "wotr",       name: "War on the Rocks",lang: "en", url: "https://warontherocks.com/feed/",                  taiwan: true },
  { id: "aspi",       name: "ASPI Strategist", lang: "en", url: "https://www.aspistrategist.org.au/feed/",          taiwan: true },
  { id: "bellingcat", name: "Bellingcat",       lang: "en", url: "https://www.bellingcat.com/feed/" },
  { id: "lawfare",    name: "Lawfare",          lang: "en", url: "https://www.lawfaremedia.org/feed" },
  { id: "atlantic_council", name: "Atlantic Council", lang: "en", url: "https://www.atlanticcouncil.org/feed/" },
  { id: "carnegie",   name: "Carnegie Endowment",lang:"en", url: "https://carnegieendowment.org/feed/" },
  { id: "brookings",  name: "Brookings",        lang: "en", url: "https://www.brookings.edu/feed/" },
  { id: "mwi",        name: "Modern War Institute",lang:"en",url: "https://mwi.westpoint.edu/feed/",                taiwan: true },
  { id: "justsecurity",name:"Just Security",    lang: "en", url: "https://www.justsecurity.org/feed/" },
  { id: "rand",       name: "RAND Blog",         lang: "en", url: "https://www.rand.org/blog.rss",                  taiwan: true },
  { id: "isw",        name: "ISW",               lang: "en", url: "https://www.understandingwar.org/rss.xml" },
  { id: "natsec",     name: "National Interest", lang: "en", url: "https://nationalinterest.org/rss.xml" },
  { id: "fp",         name: "Foreign Policy",    lang: "en", url: "https://foreignpolicy.com/feed/" },
  // OSINT-adjacent: equivalent to credible X intel accounts
  { id: "kyiv_ind",   name: "Kyiv Independent",  lang: "en", url: "https://kyivindependent.com/feed/" },
  { id: "rferl",      name: "RFE/RL",            lang: "en", url: "https://www.rferl.org/api/epiqr_tmoklk" },
  { id: "eurasianet", name: "Eurasianet",        lang: "en", url: "https://eurasianet.org/rss.xml" },
  { id: "def_blog",   name: "Defense Blog",      lang: "en", url: "https://defence-blog.com/feed/" },
  { id: "mil_times",  name: "Military Times",    lang: "en", url: "https://www.militarytimes.com/arc/outboundfeeds/rss/" },
  { id: "militarnyi", name: "Militarnyi",        lang: "en", url: "https://militarnyi.com/en/feed/", taiwan: false },
];

// ── Hotspot Coordinates for Map ───────────────────────────────────────────
const HOTSPOT_LATLNG = [
  { region:"台海",          lat:23.7,  lng:121.0,  risk:"high",     emoji:"🇹🇼" },
  { region:"烏克蘭/俄羅斯", lat:49.0,  lng:32.0,   risk:"critical", emoji:"🇺🇦" },
  { region:"中東加薩",      lat:31.5,  lng:34.5,   risk:"critical", emoji:"🇵🇸" },
  { region:"以色列/黎巴嫩", lat:33.8,  lng:35.5,   risk:"high",     emoji:"🇮🇱" },
  { region:"伊朗",          lat:35.7,  lng:51.4,   risk:"high",     emoji:"🇮🇷" },
  { region:"朝鮮半島",      lat:38.5,  lng:126.0,  risk:"high",     emoji:"🇰🇵" },
  { region:"緬甸",          lat:19.7,  lng:96.1,   risk:"high",     emoji:"🇲🇲" },
  { region:"蘇丹",          lat:15.6,  lng:32.5,   risk:"high",     emoji:"🇸🇩" },
  { region:"葉門",          lat:15.4,  lng:44.2,   risk:"high",     emoji:"🇾🇪" },
  { region:"南海",          lat:11.0,  lng:114.0,  risk:"medium",   emoji:"🌊" },
  { region:"委內瑞拉",      lat:10.5,  lng:-66.9,  risk:"medium",   emoji:"🇻🇪" },
  { region:"南亞",          lat:28.7,  lng:77.1,   risk:"medium",   emoji:"🇮🇳" },
  { region:"中國",          lat:35.9,  lng:104.2,  risk:"medium",   emoji:"🇨🇳" },
];

// ── Leaflet Map ────────────────────────────────────────────────────────────
let _map        = null;
let _mapMarkers = [];
let _mapVisible = true;

function initMap() {
  if (typeof L === "undefined") {
    // Leaflet not loaded yet — retry shortly
    setTimeout(initMap, 300);
    return;
  }
  const el = document.getElementById("world-map");
  if (!el || _map) return;

  _map = L.map("world-map", {
    center: [20, 20],
    zoom: 2,
    minZoom: 2,
    maxZoom: 6,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
  });

  // CartoDB Dark Matter — native dark tiles, English labels, clear borders
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 6,
  }).addTo(_map);

  // On mobile: collapse map by default so events are immediately visible
  if (window.innerWidth < 768) {
    _mapVisible = false;
    document.getElementById("map-panel")?.classList.add("collapsed");
    const btn = document.getElementById("map-collapse-btn");
    if (btn) btn.textContent = "▼";
  } else {
    // Ensure tiles render after container is painted
    setTimeout(() => _map.invalidateSize(), 150);
  }

  // Collapse toggle
  document.getElementById("map-collapse-btn")?.addEventListener("click", () => {
    _mapVisible = !_mapVisible;
    const panel = document.getElementById("map-panel");
    const btn   = document.getElementById("map-collapse-btn");
    panel?.classList.toggle("collapsed", !_mapVisible);
    if (btn) btn.textContent = _mapVisible ? "▲" : "▼";
    if (_mapVisible) setTimeout(() => _map.invalidateSize(), 250);
  });

  updateMapMarkers();
}

function updateMapMarkers() {
  if (!_map) return;

  // Remove previous markers
  _mapMarkers.forEach(m => m.remove());
  _mapMarkers = [];

  const RISK_COLOR = { critical:"#ff3b5c", high:"#ff7a00", medium:"#ffd60a", low:"#4ade80" };
  const ORDER      = { critical:0, high:1, medium:2, low:3 };

  // Build live risk & count from current events
  const liveRisk  = {};
  const liveCount = {};
  for (const e of State.events) {
    const r = e.regionInfo?.region;
    if (!r) continue;
    liveCount[r] = (liveCount[r] || 0) + 1;
    if (!liveRisk[r] || ORDER[e.severity] < ORDER[liveRisk[r]])
      liveRisk[r] = e.severity;
  }

  let totalPinned = 0;

  for (const h of HOTSPOT_LATLNG) {
    const risk  = (liveRisk[h.region] && ORDER[liveRisk[h.region]] < ORDER[h.risk])
                    ? liveRisk[h.region] : h.risk;
    const color = RISK_COLOR[risk] || RISK_COLOR.medium;
    const count = liveCount[h.region] || 0;
    const label = fmt.severityLabel(risk);

    // Outer pulse ring (critical/high only)
    if (risk === "critical" || risk === "high") {
      const pulse = L.circleMarker([h.lat, h.lng], {
        radius:      risk === "critical" ? 20 : 15,
        fillColor:   "transparent",
        color:       color,
        weight:      1.5,
        opacity:     0,
        fillOpacity: 0,
        className:   `map-pulse-ring map-pulse-${risk}`,
        interactive: false,
      }).addTo(_map);
      // Animate via CSS class — the circleMarker SVG path gets the class
      const el = pulse.getElement();
      if (el) { el.style.setProperty("--pc", color); }
      _mapMarkers.push(pulse);
    }

    // Main dot
    const dot = L.circleMarker([h.lat, h.lng], {
      radius:      risk === "critical" ? 10 : risk === "high" ? 8 : 6,
      fillColor:   color,
      color:       "#fff",
      weight:      1.5,
      opacity:     0.9,
      fillOpacity: 0.85,
    }).addTo(_map);

    const regionDisplay = typeof tRegion === "function" ? tRegion(h.region) : h.region;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const countText = count > 0
      ? `<div class="lf-popup-count">◎ ${count} ${isEn ? "live events" : "條即時情報"}</div>`
      : `<div class="lf-popup-count" style="color:#666">${isEn ? "No live events" : "暫無即時情報"}</div>`;
    const isEn2 = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    dot.bindPopup(
      `<div class="lf-popup">` +
      `<div class="lf-popup-title">${h.emoji} <strong>${regionDisplay}</strong></div>` +
      `<div class="lf-popup-risk" style="color:${color}">▮ ${label}</div>` +
      countText +
      `<div class="lf-popup-filter" style="font-size:10px;color:#4a8fff;margin-top:6px;cursor:pointer">${isEn2 ? "▶ Filter events for this region" : "▶ 篩選此地區事件"}</div>` +
      `</div>`,
      { maxWidth: 200, className: "lf-popup-wrap" }
    );

    dot.on("click", () => {
      // After popup opens, switch to global tab and filter by this region
      setTimeout(() => {
        State.activeRegion = h.region;
        const sel = document.getElementById("region-filter");
        if (sel) sel.value = h.region;
        // Switch to global tab
        document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
        const globalBtn = document.querySelector(".nav-btn[data-tab='global']");
        const globalTab = document.getElementById("tab-global");
        if (globalBtn) globalBtn.classList.add("active");
        if (globalTab) globalTab.classList.add("active");
        State.currentTab = "global";
        applyFilters();
        renderGlobalEvents();
        if (_mapVisible) setTimeout(() => _map?.invalidateSize(), 80);
      }, 200);
    });

    _mapMarkers.push(dot);
    totalPinned++;
  }

  const countEl = document.getElementById("map-event-count");
  if (countEl) countEl.textContent = t("map_count", State.events.length, totalPinned);
}

// ── State ──────────────────────────────────────────────────────────────────
const API_BASE = "https://us-central1-warroom-intel.cloudfunctions.net/api";

const State = {
  events:        [],
  filtered:      [],
  currentTab:    "global",
  activeFilter:  "all",
  activeRegion:  "all",
  activeLang:    "all",
  isLoading:     false,
  lastUpdated:   null,
  sourceStatus:  {},
  mnd:           null,
  history:       [],
  mndHistory:    [],
  playbackDate:  null, // null = live mode
  earlyWarning:  null,
};

// Tier-1 source IDs for badge display
const TIER1_SOURCE_IDS = new Set([
  "rand","isw","aspi","bellingcat","wotr","diplomat","lawfare",
  "carnegie","brookings","csis_main","cfr","fa","fp","mwi","justsecurity",
]);

// ── Helpers ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const fmt = {
  time(iso) {
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    try {
      const diff = Date.now() - new Date(iso).getTime();
      if (diff < 3600000) {
        const m = Math.floor(diff / 60000);
        return isEn ? `${m}m ago` : `${m} 分鐘前`;
      }
      if (diff < 86400000) {
        const h = Math.floor(diff / 3600000);
        return isEn ? `${h}h ago` : `${h} 小時前`;
      }
      const d = new Date(iso);
      return d.toLocaleDateString(isEn ? "en-US" : "zh-TW", { month: "numeric", day: "numeric", hour:"2-digit", minute:"2-digit" });
    } catch { return ""; }
  },
  severityLabel(s) {
    const k = { critical:"lbl_critical", high:"lbl_high", medium:"lbl_medium", low:"lbl_low" }[s];
    return k && typeof t === "function" ? t(k) : ({ critical:"重大", high:"高危", medium:"中危", low:"一般" }[s] || s);
  }
};

function showToast(msg, duration = 3500) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

function setLoadingText(text) {
  const el = $("loading-sub");
  if (el) el.textContent = text;
}

function hideLoading() {
  $("loading-overlay")?.classList.add("hidden");
}

// ── Cache ──────────────────────────────────────────────────────────────────
function saveCache(events) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ events, ts: Date.now() }));
  } catch(e) {}
}

function loadCache() {
  try {
    const { events, ts } = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    if (events && Date.now() - ts < CACHE_TTL) return events;
  } catch {}
  return null;
}

// ── Fetch: rss2json ────────────────────────────────────────────────────────
async function fetchRSS(source) {
  const url = RSS2JSON + encodeURIComponent(source.url);
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(tid);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data.status !== "ok") throw new Error("rss2json: " + data.status);

    State.sourceStatus[source.id] = "ok";
    return (data.items || []).slice(0, 15).map(item => {
      const combined = `${item.title || ""} ${item.description || ""}`;
      const regInfo  = detectRegion(combined);
      return {
        id:          btoa(encodeURIComponent(item.link || item.title || "")).slice(0, 24),
        title:       (item.title || "").replace(/<[^>]+>/g, "").trim(),
        description: (item.description || "").replace(/<[^>]+>/g, "").slice(0, 320).trim(),
        url:         item.link || "",
        source:      source.name,
        sourceId:    source.id,
        lang:        source.lang,
        severity:    scoreSeverity(combined),
        isTaiwan:    isTaiwanRelated(combined),
        regionInfo:  regInfo,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        fetchedAt:   new Date().toISOString(),
      };
    }).filter(e => e.title.length > 3);
  } catch (err) {
    clearTimeout(tid);
    State.sourceStatus[source.id] = "err";
    console.warn(`[${source.id}] RSS failed:`, err.message);
    return [];
  }
}

// ── Fetch: GDELT (single call) ─────────────────────────────────────────────
async function fetchGDELT() {
  const params = new URLSearchParams({
    query:      "military conflict crisis war Taiwan Ukraine",
    mode:       "artlist",
    maxrecords: "20",
    format:     "json",
    timespan:   "48h",
    sort:       "hybridrel",
  });
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(`${GDELT_BASE}?${params}`, { signal: ctrl.signal });
    clearTimeout(tid);
    const text = await res.text();
    // GDELT sends rate-limit text instead of JSON
    if (!text.trim().startsWith("{")) {
      console.warn("[gdelt] rate limited:", text.slice(0, 80));
      return [];
    }
    const data = JSON.parse(text);
    if (!data.articles) return [];
    State.sourceStatus["gdelt"] = "ok";
    return data.articles.map(a => {
      const combined = a.title || "";
      return {
        id:          btoa(encodeURIComponent(a.url || "")).slice(0, 24),
        title:       a.title || "",
        description: `來源域名: ${a.domain || "—"}`,
        url:         a.url || "",
        source:      a.domain || "GDELT",
        sourceId:    "gdelt",
        lang:        a.language === "Chinese" ? "zh" : "en",
        severity:    scoreSeverity(combined),
        isTaiwan:    isTaiwanRelated(combined),
        regionInfo:  detectRegion(combined),
        publishedAt: a.seendate
          ? new Date(a.seendate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6")).toISOString()
          : new Date().toISOString(),
        fetchedAt:   new Date().toISOString(),
      };
    }).filter(e => e.title.length > 3);
  } catch (err) {
    clearTimeout(tid);
    console.warn("[gdelt] failed:", err.message);
    return [];
  }
}

// ── Main Data Load ─────────────────────────────────────────────────────────
async function loadData(forceRefresh = false) {
  if (State.isLoading) return;
  State.isLoading = true;

  if (!forceRefresh) {
    const cached = loadCache();
    if (cached?.length > 0) {
      // Re-assign sequential IDs in case cache has stale/colliding IDs
      cached.forEach((e, i) => { e.id = "ev" + i; });
      State.events = cached;
      State.lastUpdated = new Date();
      applyFilters();
      renderAll();
      hideLoading();
      updateStatusBar();
      State.isLoading = false;
      return;
    }
  }

  setLoadingText(t("loading_sub"));

  // Fire all RSS fetches in parallel, then GDELT with slight delay
  const rssPromises = RSS_FEEDS.map(s => fetchRSS(s));
  const gdeltPromise = new Promise(resolve => {
    setTimeout(() => fetchGDELT().then(resolve), 1500); // slight delay for GDELT
  });

  const results = await Promise.allSettled([...rssPromises, gdeltPromise]);

  const allEvents = [];
  const seen = new Set();

  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const e of r.value || []) {
        const key = e.title.slice(0, 55);
        if (!seen.has(key)) {
          seen.add(key);
          allEvents.push(e);
        }
      }
    }
  }

  // Sort: severity first → date
  const ORDER = { critical:0, high:1, medium:2, low:3 };
  allEvents.sort((a, b) => {
    if (ORDER[a.severity] !== ORDER[b.severity]) return ORDER[a.severity] - ORDER[b.severity];
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  // Assign guaranteed-unique sequential IDs after sort (fixes URL-prefix collision)
  allEvents.forEach((e, i) => { e.id = "ev" + i; });

  State.events     = allEvents;
  State.lastUpdated = new Date();

  if (allEvents.length > 0) saveCache(allEvents);

  applyFilters();
  renderAll();
  hideLoading();
  updateStatusBar();
  State.isLoading = false;

  const ok  = Object.values(State.sourceStatus).filter(v => v === "ok").length;
  const err = Object.values(State.sourceStatus).filter(v => v === "err").length;
  showToast(allEvents.length > 0
    ? t("toast_ok", allEvents.length, ok)
    : t("toast_fail"));
}

// ── Filters ────────────────────────────────────────────────────────────────
function applyFilters() {
  State.filtered = State.events.filter(e => {
    if (State.activeFilter !== "all" && e.severity !== State.activeFilter) return false;
    if (State.activeLang   !== "all" && e.lang     !== State.activeLang)   return false;
    if (State.activeRegion !== "all" && e.regionInfo?.region !== State.activeRegion) return false;
    return true;
  });
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderAll() {
  // Wrap each in try-catch so one failure doesn't block the others
  try { renderGlobalEvents(); }  catch(e) { console.error("renderGlobalEvents:", e); }
  try { renderTaiwanTab(); }     catch(e) { console.error("renderTaiwanTab:", e); }
  try { renderHotspots(); }      catch(e) { console.error("renderHotspots:", e); }
  try { renderSources(); }       catch(e) { console.error("renderSources:", e); }
  try { populateRegionFilter(); }catch(e) { console.error("populateRegionFilter:", e); }
  try { updateMapMarkers(); }    catch(e) { console.error("updateMapMarkers:", e); }
  // AI tab rendered separately so it's never blocked
  try { AI.renderTab(); }        catch(e) { console.error("AI.renderTab:", e); }
}

// ── Event Card HTML ────────────────────────────────────────────────────────
function eventCardHTML(e) {
  const label    = fmt.severityLabel(e.severity);
  const time     = fmt.time(e.publishedAt);
  const ri       = e.regionInfo || {};
  const emoji    = ri.emoji  || "🌍";
  const region   = typeof tRegion === "function" ? tRegion(ri.region || "全球") : (ri.region || "全球");
  const twTag    = typeof t === "function" ? t("taiwan_tag") : "台海";

  const tier1 = TIER1_SOURCE_IDS.has(e.sourceId);

  return `
    <div class="event-card severity-${e.severity}" data-id="${e.id}" onclick="openModal('${e.id}')">
      <div class="event-top">
        <span class="severity-badge badge-${e.severity}">${label}</span>
        <span class="event-title">${e.title}</span>
        <span class="event-arrow">›</span>
      </div>
      <div class="event-meta">
        <span class="event-source-tag">${e.source}</span>
        ${tier1 ? '<span class="tier1-badge">TIER 1</span>' : ""}
        <span class="event-region-tag">${emoji} ${region}</span>
        ${e.isTaiwan ? `<span class="taiwan-tag">${twTag}</span>` : ""}
        <span class="event-meta-item">${time}</span>
        ${e.lang === "zh" ? '<span style="font-size:10px;color:var(--text3)">中</span>' : ""}
      </div>
    </div>`;
}

function renderGlobalEvents() {
  const c = $("global-events");
  if (!c) return;
  if (State.filtered.length === 0) {
    c.innerHTML = `<div class="empty-state"><div class="empty-state-icon">◌</div><p>${t("empty")}</p></div>`;
    return;
  }
  c.innerHTML = State.filtered.slice(0, 100).map(eventCardHTML).join("");
}

async function fetchMNDData() {
  try {
    const res = await fetch(`${API_BASE}/mnd`);
    if (!res.ok) return;
    State.mnd = await res.json();
  } catch (e) {
    console.warn("MND fetch failed:", e.message);
  }
}

async function fetchHistoryData() {
  try {
    const res = await fetch(`${API_BASE}/history?days=30`);
    if (!res.ok) return;
    const data = await res.json();
    State.history = data.history || [];
  } catch (e) {
    console.warn("History fetch failed:", e.message);
  }
}

async function fetchMNDHistoryData() {
  try {
    const res = await fetch(`${API_BASE}/mnd-history?days=30`);
    if (!res.ok) return;
    const data = await res.json();
    State.mndHistory = data.history || [];
  } catch (e) {
    console.warn("MND history fetch failed:", e.message);
  }
}

async function fetchEarlyWarning() {
  try {
    const res = await fetch(`${API_BASE}/early-warning`);
    if (!res.ok) return;
    State.earlyWarning = await res.json();
  } catch (e) {
    console.warn("Early warning fetch failed:", e.message);
  }
}

function renderTaiwanTab() {
  const c = $("taiwan-events");
  if (!c) return;

  // Populate playback date selector from history
  _populatePlaybackSelect();

  const playbackData = _getPlaybackData();
  TaiwanAnalysis.render(State.events, State.mnd, State.history, State.mndHistory, playbackData, State.earlyWarning);

  // In live mode, render real events; in playback mode, events handled by taiwan.js
  if (!playbackData) {
    const tw = State.events.filter(e => e.isTaiwan);
    if (tw.length === 0) {
      c.innerHTML = `<div class="empty-state"><div class="empty-state-icon">◌</div><p>${t("empty_tw")}</p></div>`;
    } else {
      c.innerHTML = tw.map(eventCardHTML).join("");
    }
  }
}

function _getPlaybackData() {
  if (!State.playbackDate) return null;
  const sweepSnap = State.history.find(d => d.date === State.playbackDate) || null;
  const mndSnap   = State.mndHistory.find(d => d.date === State.playbackDate) || null;
  if (!sweepSnap && !mndSnap) return null;
  return {
    date:        State.playbackDate,
    tensionIndex: sweepSnap?.tensionIndex,
    topEvents:    sweepSnap?.topEvents || [],
    // MND fields for _renderMNDSummary playback
    aircraft:           mndSnap?.aircraft,
    ships:              mndSnap?.ships,
    adizViolation:      mndSnap?.adizViolation,
    adizCount:          mndSnap?.adizCount,
    medianLineCrossing: mndSnap?.medianLineCrossing,
  };
}

function _populatePlaybackSelect() {
  const sel   = $("playback-select");
  const badge = $("playback-badge");
  const clear = $("playback-clear");
  const live  = $("live-badge");
  if (!sel) return;

  // Build date options from history
  const dates = State.history.map(d => d.date).filter(Boolean).sort().reverse();
  const cur = sel.value;
  while (sel.options.length > 1) sel.remove(1);
  dates.forEach(d => sel.appendChild(new Option(d, d)));

  // Restore selection or live mode
  if (State.playbackDate && dates.includes(State.playbackDate)) {
    sel.value = State.playbackDate;
    if (badge) { badge.style.display = "block"; badge.textContent = t("tw_playback_badge", State.playbackDate); }
    if (clear) clear.style.display = "inline-block";
    if (live)  live.style.display  = "none";
  } else {
    sel.value = "";
    if (badge) badge.style.display = "none";
    if (clear) clear.style.display = "none";
    if (live)  live.style.display  = "inline";
  }
}

function setPlaybackDate(date) {
  State.playbackDate = date || null;
  renderTaiwanTab();
}

function renderHotspots() {
  const c = $("hotspots-grid");
  if (!c) return;

  // Build region counts from live events
  const regionCounts = {};
  for (const e of State.events) {
    const r = e.regionInfo?.region || "全球";
    regionCounts[r] = (regionCounts[r] || 0) + 1;
  }

  const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
  const hotspots = [
    { region:"台海",         risk:"high",     emoji:"🇹🇼",
      desc:"解放軍持續軍事威脅，頻繁侵入ADIZ，並定期舉行封鎖演習。賴清德政府就職後兩岸關係緊張。",
      descEn:"PLA maintains sustained military threat, frequent ADIZ violations, and regular blockade exercises. Cross-strait tensions elevated since Lai Ching-te's inauguration.",
      tags:["PLA演習","ADIZ侵擾","軍售","台海中線"],
      tagsEn:["PLA Exercises","ADIZ Violations","Arms Sales","Median Line"] },
    { region:"烏克蘭/俄羅斯",risk:"critical", emoji:"🇺🇦",
      desc:"俄羅斯全面入侵烏克蘭持續，東部戰線激烈，俄軍持續對城市基礎設施發動導彈與無人機攻擊。",
      descEn:"Russia's full-scale invasion of Ukraine continues. Eastern front intense; Russia sustains missile and drone strikes on civilian infrastructure.",
      tags:["砲擊","無人機","前線","軍援"],
      tagsEn:["Artillery","Drones","Front Lines","Military Aid"] },
    { region:"中東加薩",     risk:"critical", emoji:"🇵🇸",
      desc:"以色列對加薩走廊軍事行動持續，人道危機嚴峻，停火談判多次破裂，平民傷亡持續攀升。",
      descEn:"Israeli military operations in Gaza continue amid a severe humanitarian crisis. Ceasefire negotiations have repeatedly collapsed; civilian casualties mount.",
      tags:["人道危機","停火談判","空襲","地道"],
      tagsEn:["Humanitarian Crisis","Ceasefire","Airstrikes","Tunnels"] },
    { region:"以色列/黎巴嫩",risk:"high",     emoji:"🇮🇱",
      desc:"以色列與真主黨停火協議脆弱，伊朗代理武裝勢力持續威脅以色列邊境安全。",
      descEn:"Fragile ceasefire between Israel and Hezbollah; Iranian proxy forces continue threatening Israeli border security.",
      tags:["真主黨","停火","伊朗支援","邊境"],
      tagsEn:["Hezbollah","Ceasefire","Iranian Support","Border"] },
    { region:"朝鮮半島",     risk:"high",     emoji:"🇰🇵",
      desc:"北韓持續試射彈道飛彈與核武研發，並向俄羅斯供應彈藥支援烏克蘭戰場，朝韓邊境緊張。",
      descEn:"North Korea continues ballistic missile tests and nuclear development, supplying ammunition to Russia. Inter-Korean border tensions persist.",
      tags:["核武","彈道飛彈","俄朝合作","邊境"],
      tagsEn:["Nuclear","Ballistic Missiles","DPRK-Russia","Border"] },
    { region:"伊朗",         risk:"high",     emoji:"🇮🇷",
      desc:"伊朗核武計畫持續推進，與以色列互相攻擊循環升溫，美伊制裁戰略博弈持續。",
      descEn:"Iran's nuclear program advances amid escalating cycles of Iran-Israel strikes. US-Iran sanctions standoff continues.",
      tags:["核武","制裁","以伊衝突","革命衛隊"],
      tagsEn:["Nuclear","Sanctions","Iran-Israel","IRGC"] },
    { region:"緬甸",         risk:"high",     emoji:"🇲🇲",
      desc:"緬甸軍政府與多個少數民族武裝及人民防衛軍衝突持續惡化，難民湧入周邊國家。",
      descEn:"Conflict between Myanmar's junta and ethnic armed groups / People's Defense Forces intensifies. Refugees flood neighboring countries.",
      tags:["軍政府","武裝衝突","難民","人權"],
      tagsEn:["Junta","Armed Conflict","Refugees","Human Rights"] },
    { region:"南海",         risk:"medium",   emoji:"🌊",
      desc:"中國在南海持續擴張，與菲律賓、越南存在主權爭議，美軍定期進行自由航行行動。",
      descEn:"China expands presence in the South China Sea. Sovereignty disputes with Philippines and Vietnam; US conducts regular FONOPs.",
      tags:["主權爭議","人工島","自由航行","菲律賓"],
      tagsEn:["Sovereignty Dispute","Artificial Islands","FONOP","Philippines"] },
    { region:"蘇丹",         risk:"high",     emoji:"🇸🇩",
      desc:"蘇丹武裝部隊與快速支援部隊（RSF）衝突造成嚴重人道危機，數百萬人流離失所。",
      descEn:"Conflict between Sudan's Armed Forces and RSF causes severe humanitarian crisis; millions displaced.",
      tags:["武裝衝突","人道危機","難民","飢荒"],
      tagsEn:["Armed Conflict","Humanitarian Crisis","Refugees","Famine"] },
  ];

  // Determine display risk (max of static + live events)
  const ORDER = { critical:0, high:1, medium:2, low:3 };
  const liveRiskForRegion = {};
  for (const e of State.events) {
    const r = e.regionInfo?.region;
    if (!r) continue;
    if (!liveRiskForRegion[r] || ORDER[e.severity] < ORDER[liveRiskForRegion[r]])
      liveRiskForRegion[r] = e.severity;
  }

  c.innerHTML = hotspots.map(h => {
    const count       = regionCounts[h.region] || 0;
    const liveRisk    = liveRiskForRegion[h.region];
    const displayRisk = liveRisk && ORDER[liveRisk] < ORDER[h.risk] ? liveRisk : h.risk;
    const displayName = typeof tRegion === "function" ? tRegion(h.region) : h.region;
    const displayDesc = isEn && h.descEn ? h.descEn : h.desc;
    const displayTags = isEn && h.tagsEn ? h.tagsEn : h.tags;
    return `
      <div class="hotspot-card risk-${displayRisk}">
        <div class="hotspot-header">
          <div class="hotspot-name">${h.emoji} ${displayName}</div>
          <span class="risk-badge risk-${displayRisk}">${fmt.severityLabel(displayRisk)}</span>
        </div>
        <div class="hotspot-desc">${displayDesc}</div>
        <div class="hotspot-indicators">
          ${displayTags.map(tag => `<span class="hotspot-tag">${tag}</span>`).join("")}
        </div>
        ${count > 0 ? `<div class="hotspot-count">${t("hotspot_count", count)}</div>` : ""}
      </div>`;
  }).join("");
}

function renderSources() {
  const c = $("sources-grid");
  if (!c) return;
  const groups = [
    { title: t("src_zh"),     items: SOURCES.zh },
    { title: t("src_en"),     items: SOURCES.en },
    { title: t("src_forums"), items: SOURCES.forums },
    { title: t("src_special"),items: SOURCES.specialized },
    { title: t("src_x"),      items: SOURCES.x_osint, isX: true },
  ];
  const isEnSrc = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
  c.innerHTML = groups.map(g => `
    <div class="source-group">
      <div class="source-group-title">${g.title}</div>
      ${g.items.map(s => {
        const isX   = g.isX || s.type === "𝕏";
        const st    = State.sourceStatus[s.id];
        const dot   = st === "ok" ? "ok" : st === "err" ? "err" : "";
        const note  = isEnSrc && s.noteEn ? s.noteEn : s.note;
        const badge = isX
          ? `<span class="source-lang x-badge">𝕏 OSINT</span>`
          : `<span class="source-lang">${s.lang.toUpperCase()} · ${s.type}</span>
             <span class="source-status ${dot}"></span>`;
        return `
          <div class="source-item" ${isX ? `onclick="window.open('${s.url}','_blank','noopener')" style="cursor:pointer"` : ""}>
            <div>
              <div class="source-name">${s.name}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:2px">${note}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">${badge}</div>
          </div>`;
      }).join("")}
    </div>`).join("");
}

// ── Status Bar ─────────────────────────────────────────────────────────────
function updateStatusBar() {
  $("count-critical").textContent = State.events.filter(e => e.severity === "critical").length;
  $("count-high").textContent     = State.events.filter(e => e.severity === "high").length;
  $("count-medium").textContent   = State.events.filter(e => e.severity === "medium").length;
  if (State.lastUpdated) {
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const timeStr = State.lastUpdated.toLocaleTimeString(isEn ? "en-US" : "zh-TW", {hour:"2-digit",minute:"2-digit"});
    $("refresh-time").textContent = t("updated", timeStr);
  }
}

// ── Region Dropdown ────────────────────────────────────────────────────────
function populateRegionFilter() {
  const sel = $("region-filter");
  if (!sel) return;
  const regions = [...new Set(State.events.map(e => e.regionInfo?.region).filter(Boolean))].sort();
  const cur = sel.value;
  while (sel.options.length > 1) sel.remove(1);
  regions.forEach(r => sel.appendChild(new Option(typeof tRegion === "function" ? tRegion(r) : r, r)));
  if (regions.includes(cur)) sel.value = cur;
}

// ── Modal ──────────────────────────────────────────────────────────────────
function openModal(id) {
  const e = State.events.find(x => x.id === id);
  if (!e) return;
  const overlay = $("modal-overlay");

  $("modal-severity").className = `modal-severity badge-${e.severity}`;
  $("modal-severity").textContent = fmt.severityLabel(e.severity);
  $("modal-title").textContent = e.title;
  $("modal-meta").innerHTML = `
    <span>${e.source}</span><span>·</span>
    <span>${e.regionInfo?.emoji||""} ${typeof tRegion==="function" ? tRegion(e.regionInfo?.region||"全球") : (e.regionInfo?.region||"全球")}</span><span>·</span>
    <span>${fmt.time(e.publishedAt)}</span>
    ${e.isTaiwan ? `<span class="taiwan-tag">${t("taiwan_tag")}</span>` : ""}
  `;
  $("modal-description").innerHTML = e.description?.length > 10
    ? e.description
    : t("no_desc");
  $("modal-link").href = e.url || "#";
  $("modal-link").textContent = t("modal_link");

  // Related events (same region, different id)
  const related = State.events
    .filter(x => x.id !== id && x.regionInfo?.region === e.regionInfo?.region)
    .slice(0, 3);
  $("modal-related").innerHTML = related.length > 0
    ? `<div class="modal-related-title">${t("modal_related")}</div>` +
      related.map(r => `
        <div class="related-item" onclick="openModal('${r.id}')">
          <div class="related-item-title">${r.title}</div>
          <div class="related-item-source">${r.source} · ${fmt.time(r.publishedAt)}</div>
        </div>`).join("")
    : "";

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("modal-overlay").classList.remove("open");
  $("modal-overlay").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// ── Bind Events ────────────────────────────────────────────────────────────
function bindEvents() {
  // Tabs
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      State.currentTab = btn.dataset.tab;
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-" + btn.dataset.tab)?.classList.add("active");
      if (btn.dataset.tab === "global" && _mapVisible)
        setTimeout(() => _map?.invalidateSize(), 80);
      // Redraw canvas charts after tab becomes visible (clientWidth was 0 while hidden)
      if (btn.dataset.tab === "taiwan")
        requestAnimationFrame(() => requestAnimationFrame(() => renderTaiwanTab()));
    });
  });

  // Severity filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      State.activeFilter = btn.dataset.severity;
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
      renderGlobalEvents();
    });
  });

  // Region select
  $("region-filter")?.addEventListener("change", e => {
    State.activeRegion = e.target.value;
    applyFilters();
    renderGlobalEvents();
  });

  // Lang select
  $("lang-filter")?.addEventListener("change", e => {
    State.activeLang = e.target.value;
    applyFilters();
    renderGlobalEvents();
  });

  // Playback date selector
  $("playback-select")?.addEventListener("change", e => {
    setPlaybackDate(e.target.value || null);
  });
  $("playback-clear")?.addEventListener("click", () => {
    setPlaybackDate(null);
  });

  // Refresh button
  $("refresh-btn")?.addEventListener("click", async () => {
    const btn = $("refresh-btn");
    btn.classList.add("spinning");
    await loadData(true);
    btn.classList.remove("spinning");
  });

  // Event modal close
  $("modal-close")?.addEventListener("click", closeModal);
  $("modal-overlay")?.addEventListener("click", e => { if (e.target === $("modal-overlay")) closeModal(); });
  // AI settings modal close
  $("ai-settings-overlay")?.addEventListener("click", e => { if (e.target === $("ai-settings-overlay")) AI.closeSettings(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); AI.closeSettings(); } });
}

// ── Init ───────────────────────────────────────────────────────────────────
async function init() {
  // Apply saved language preference to static HTML
  if (typeof applyTranslations === "function") applyTranslations();
  bindEvents();
  try { AI.init(); }   catch(e) { console.error("AI.init:", e); }
  try { initMap(); }   catch(e) { console.error("initMap:", e); }
  await Promise.all([loadData(false), fetchMNDData(), fetchHistoryData(), fetchMNDHistoryData(), fetchEarlyWarning()]);
  // Re-render Taiwan tab now that all data is available
  renderTaiwanTab();
  // Auto-refresh every 10 minutes
  setInterval(() => loadData(false), CACHE_TTL);
  // Refresh MND data every hour
  setInterval(() => fetchMNDData().then(() => {
    if (State.currentTab === "taiwan") renderTaiwanTab();
  }), 60 * 60 * 1000);
}

document.addEventListener("DOMContentLoaded", init);
