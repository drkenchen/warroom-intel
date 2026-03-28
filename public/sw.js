// ── Warroom PWA Service Worker ─────────────────────────────────────────────
const CACHE   = "warroom-sw-v4";
const SHELL   = [
  "/css/style.css",
  "/js/i18n.js",
  "/js/sources.js",
  "/js/taiwan.js",
  "/js/ai.js",
  "/js/app.js",
  "/manifest.json",
  "/icons/icon.svg",
  // Leaflet (CDN — cached on first load)
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
];

// External API hostnames — always network, never cache
const API_HOSTS = [
  "api.rss2json.com",
  "api.gdeltproject.org",
  "generativelanguage.googleapis.com",
  "api.groq.com",
];

// ── Install: pre-cache app shell ───────────────────────────────────────────
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge old caches ─────────────────────────────────────────────
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch strategy ─────────────────────────────────────────────────────────
self.addEventListener("fetch", e => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and browser-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") return;

  // External API calls — network only, no caching
  if (API_HOSTS.includes(url.hostname)) return;

  // HTML navigation requests — always network-first so updates appear immediately
  if (request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/") {
    e.respondWith(
      fetch(request)
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Map tiles (CartoDB) — network-first, cache as fallback
  if (url.hostname.endsWith("basemaps.cartocdn.com")) {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // JS/CSS/static assets — network-first, cache fallback
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
