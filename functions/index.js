const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const xml2js = require("xml2js");

admin.initializeApp();
const db = admin.firestore();

// ─── RSS Sources ────────────────────────────────────────────────────────────
const RSS_SOURCES = [
  // Chinese-language sources
  { id: "cna", name: "中央社 CNA", lang: "zh", region: "TW",
    url: "https://www.cna.com.tw/rss/aopl.aspx" },
  { id: "ltn", name: "自由時報", lang: "zh", region: "TW",
    url: "https://news.ltn.com.tw/rss/world.xml" },
  { id: "bbc_zh", name: "BBC中文", lang: "zh", region: "INTL",
    url: "https://feeds.bbci.co.uk/zhongwen/trad/rss.xml" },
  { id: "rfa", name: "自由亞洲電台", lang: "zh", region: "INTL",
    url: "https://www.rfa.org/mandarin/rss2.xml" },
  { id: "voa_zh", name: "美國之音中文", lang: "zh", region: "INTL",
    url: "https://www.voachinese.com/api/zmgqo-uyoqu" },
  // English sources
  { id: "reuters", name: "Reuters World", lang: "en", region: "INTL",
    url: "https://feeds.reuters.com/reuters/worldNews" },
  { id: "ap", name: "Associated Press", lang: "en", region: "INTL",
    url: "https://rsshub.app/apnews/topics/apf-intlnews" },
  { id: "guardian", name: "The Guardian World", lang: "en", region: "INTL",
    url: "https://www.theguardian.com/world/rss" },
  // Chinese state/military media — early warning signal sources
  { id: "globaltimes", name: "Global Times", lang: "en", region: "CN",
    url: "https://www.globaltimes.cn/rss/outbrain.xml" },
  { id: "xinhua_en", name: "Xinhua English", lang: "en", region: "CN",
    url: "https://feeds.feedburner.com/xinhuanet/EEXX" },
  { id: "scmp", name: "SCMP Asia", lang: "en", region: "INTL",
    url: "https://www.scmp.com/rss/91/feed" },
];

// ─── Severity Scoring ───────────────────────────────────────────────────────
const KEYWORDS = {
  critical: [
    "war","warfare","invasion","invaded","nuclear","missile strike","bombed",
    "airstrike","air strike","chemical weapon","biological weapon","ground troops",
    "战争","入侵","核武","导弹攻击","轰炸","空袭","侵台","攻台","武统",
    "全面进攻","核打击"
  ],
  high: [
    "military","troops","attack","conflict","crisis","sanctions","escalation",
    "warship","aircraft carrier","fighter jet","submarine","blockade","siege",
    "解放军","军事演习","制裁","封锁","危机","台海","军舰","航母",
    "战斗机","潜艇","导弹","飞弹","PLA","PLAAF","PLAN"
  ],
  medium: [
    "tension","protest","unrest","alert","warning","mobilization","deployment",
    "紧张","抗议","动乱","警告","动员","部署","演习","威胁","挑衅"
  ]
};

function kwMatch(text, kw) {
  const k = kw.toLowerCase();
  // Chinese/CJK characters don't use word boundaries — use substring match
  if (/[\u4e00-\u9fff]/.test(k)) return text.includes(k);
  // For English keywords, require word boundaries to avoid false substring hits
  // e.g. "war" should NOT match "warm-up" or "award"
  return new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text);
}

function scoreSeverity(text) {
  const t = text.toLowerCase();
  for (const kw of KEYWORDS.critical) if (kwMatch(t, kw)) return "critical";
  for (const kw of KEYWORDS.high)     if (kwMatch(t, kw)) return "high";
  for (const kw of KEYWORDS.medium)   if (kwMatch(t, kw)) return "medium";
  return "low";
}

// ─── Taiwan-related Detection ───────────────────────────────────────────────
const TAIWAN_KEYWORDS = [
  "taiwan","taipei","strait","pla","plaaf","adiz","tsai","lai ching-te",
  "台灣","台海","解放軍","共軍","中共","兩岸","統一","獨立","飛彈",
  "航母","台積電","TSMC","台海危機","第一島鏈"
];

function isTaiwanRelated(text) {
  const t = text.toLowerCase();
  return TAIWAN_KEYWORDS.some(k => t.includes(k.toLowerCase()));
}

// ─── Region Detection ───────────────────────────────────────────────────────
const REGION_MAP = {
  "ukraine": "烏克蘭/俄羅斯",
  "russia":  "烏克蘭/俄羅斯",
  "gaza":    "中東加薩",
  "israel":  "中東以色列",
  "iran":    "伊朗",
  "korea":   "朝鮮半島",
  "north korea": "朝鮮半島",
  "myanmar": "緬甸",
  "sudan":   "蘇丹",
  "yemen":   "葉門",
  "venezuela":"委內瑞拉",
  "taiwan":  "台海",
  "台灣":    "台海",
  "台海":    "台海",
  "烏克蘭":  "烏克蘭/俄羅斯",
  "俄羅斯":  "烏克蘭/俄羅斯",
  "以色列":  "中東以色列",
  "加薩":    "中東加薩",
  "伊朗":    "伊朗",
};

function detectRegion(text) {
  const t = text.toLowerCase();
  for (const [key, region] of Object.entries(REGION_MAP)) {
    if (t.includes(key.toLowerCase())) return region;
  }
  return "全球";
}

// ─── RSS Parser ─────────────────────────────────────────────────────────────
async function fetchRSS(source) {
  try {
    const res = await fetch(source.url, {
      timeout: 10000,
      headers: { "User-Agent": "Warroom-Intelligence/1.0" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });

    const channel = parsed.rss?.channel || parsed["rdf:RDF"]?.channel;
    if (!channel) return [];

    const items = Array.isArray(channel.item) ? channel.item : [channel.item];
    return items.slice(0, 15).map(item => {
      const title = item.title?._ || item.title || "";
      const desc  = item.description?._ || item.description || "";
      const link  = item.link?._ || item.link || "";
      const pubDate = item.pubDate || item["dc:date"] || item.updated || new Date().toISOString();

      const combined = `${title} ${desc}`;
      const rhetoricLevel = detectRhetoricLevel(combined);
      return {
        id: Buffer.from(link).toString("base64").slice(0, 20),
        title: title.replace(/<[^>]+>/g, "").trim(),
        description: desc.replace(/<[^>]+>/g, "").slice(0, 300).trim(),
        url: link,
        source: source.name,
        sourceId: source.id,
        lang: source.lang,
        severity: scoreSeverity(combined),
        isTaiwan: isTaiwanRelated(combined),
        region: detectRegion(combined),
        publishedAt: new Date(pubDate).toISOString(),
        fetchedAt: new Date().toISOString(),
        isExercise: detectExercise(combined),
        rhetoricLevel,
      };
    }).filter(e => e.title);
  } catch (err) {
    console.error(`RSS fetch failed [${source.id}]:`, err.message);
    return [];
  }
}

// ─── GDELT Fetch ─────────────────────────────────────────────────────────────
async function fetchGDELT(query, maxRecords = 20) {
  try {
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=${maxRecords}&format=json&timespan=48h&sort=hybridrel`;
    const res = await fetch(url, { timeout: 15000 });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.articles) return [];

    return data.articles.map(a => ({
      id: Buffer.from(a.url || "").toString("base64").slice(0, 20),
      title: a.title || "",
      description: a.seendate ? `發布於 ${a.seendate}` : "",
      url: a.url || "",
      source: a.domain || "GDELT",
      sourceId: "gdelt",
      lang: a.language === "Chinese" ? "zh" : "en",
      severity: scoreSeverity(a.title || ""),
      isTaiwan: isTaiwanRelated(a.title || ""),
      region: detectRegion(a.title || ""),
      publishedAt: a.seendate
        ? new Date(a.seendate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6")).toISOString()
        : new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
    })).filter(e => e.title);
  } catch (err) {
    console.error("GDELT fetch failed:", err.message);
    return [];
  }
}

// ─── MND (Taiwan Ministry of National Defense) PLA Activity Fetcher ──────────
const MND_BASE    = "https://www.mnd.gov.tw";
const MND_ZH_LIST = `${MND_BASE}/news/plaactlist`;
const MND_EN_LIST = `${MND_BASE}/en/news/plaactlist`;

function mndHeaders(referer, lang = "zh") {
  return {
    "User-Agent":      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept":          "text/html,application/xhtml+xml",
    "Accept-Language": lang === "en" ? "en-US,en;q=0.9" : "zh-TW,zh;q=0.9,en;q=0.8",
    "Referer":         referer,
  };
}

function extractMainContent(html) {
  // Find the start of maincontent div
  const startM = html.match(/<div[^>]+class="[^"]*maincontent[^"]*"[^>]*>/);
  if (!startM) return null;
  const start = startM.index + startM[0].length;
  // Walk the HTML to find the matching closing tag (track nesting depth)
  let depth = 1;
  let i = start;
  while (i < html.length && depth > 0) {
    const openTag  = html.indexOf("<div", i);
    const closeTag = html.indexOf("</div", i);
    if (closeTag === -1) break;
    if (openTag !== -1 && openTag < closeTag) {
      depth++;
      i = openTag + 4;
    } else {
      depth--;
      i = closeTag + 5;
    }
  }
  const raw = html.slice(start, i);
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&rsquo;/g, "'")
    .replace(/&#\d+;/g, "").replace(/\s+/g, " ").trim();
}

async function fetchMNDReport() {
  try {
    // Fetch ZH and EN list pages in parallel
    const [zhList, enList] = await Promise.all([
      fetch(MND_ZH_LIST, { timeout: 12000, headers: mndHeaders(MND_ZH_LIST, "zh") }),
      fetch(MND_EN_LIST, { timeout: 12000, headers: mndHeaders(MND_EN_LIST, "en") }),
    ]);
    if (!zhList.ok) throw new Error(`ZH list HTTP ${zhList.status}`);

    const [zhHtml, enHtml] = await Promise.all([zhList.text(), enList.ok ? enList.text() : Promise.resolve("")]);

    // Find all article links with their list-page dates (format: 115.03.29)
    // The date div immediately follows each article link in the HTML
    const zhEntries = [...zhHtml.matchAll(/href="(news\/plaact\/(\d+))"[\s\S]*?<div[^>]*date[^>]*>(\d+\.\d+\.\d+)<\/div>/g)];
    if (!zhEntries.length) throw new Error("No ZH plaact link found");
    // Pick the entry with the highest article ID
    const zhBest = zhEntries.reduce((best, m) => parseInt(m[2]) > parseInt(best[2]) ? m : best, zhEntries[0]);

    const enEntries = [...enHtml.matchAll(/href="(news\/plaact\/(\d+))"[\s\S]*?<div[^>]*date[^>]*>(\d+\.\d+\.\d+)<\/div>/g)];
    const enBest = enEntries.length
      ? enEntries.reduce((best, m) => parseInt(m[2]) > parseInt(best[2]) ? m : best, enEntries[0])
      : null;

    const zhUrl = `${MND_BASE}/${zhBest[1]}`;
    const enUrl = enBest ? `${MND_BASE}/en/${enBest[1]}` : null;

    // Publication date from list page (ROC year format: 115.03.29 → 2026-03-29)
    let listReportDate = null;
    if (zhBest[3]) {
      const parts = zhBest[3].split(".");
      if (parts.length === 3) {
        const wy = parseInt(parts[0]) + 1911;
        listReportDate = `${wy}-${parts[1].padStart(2,"0")}-${parts[2].padStart(2,"0")}`;
      }
    }

    // Fetch ZH and EN articles in parallel
    const [zhArticle, enArticle] = await Promise.all([
      fetch(zhUrl, { timeout: 12000, headers: mndHeaders(MND_ZH_LIST, "zh") }),
      enUrl ? fetch(enUrl, { timeout: 12000, headers: mndHeaders(MND_EN_LIST, "en") }) : Promise.resolve(null),
    ]);
    if (!zhArticle.ok) throw new Error(`ZH article HTTP ${zhArticle.status}`);

    const [zhArticleHtml, enArticleHtml] = await Promise.all([
      zhArticle.text(),
      enArticle?.ok ? enArticle.text() : Promise.resolve(""),
    ]);

    const zhText = extractMainContent(zhArticleHtml);
    const enText = enArticleHtml ? extractMainContent(enArticleHtml) : null;
    if (!zhText) throw new Error("ZH maincontent not found");

    // Parse metrics from ZH text
    const aircraftMatch = zhText.match(/(?:偵獲)?共機\s*(\d+)\s*架次/) ||
                          zhText.match(/共軍飛機\s*(\d+)\s*架次/) ||
                          zhText.match(/共[軍機][^，。]{0,5}?(\d+)\s*架次/);
    const shipsMatch    = zhText.match(/共艦\s*(\d+)\s*艘/) || zhText.match(/艦[船]*\s*(\d+)\s*艘/);
    const adizMatch     = zhText.match(/進入[^，。]*?空域\s*(\d+)\s*架次/);
    // Match "8架次逾越中線" or "逾越中線...13架次" or boolean variants
    const medianMatch   = zhText.match(/(\d+)\s*架次逾越中線/) ||
                          zhText.match(/逾越中線[^，。]*?(\d+)\s*架次/);
    const medianLineCrossings = medianMatch ? parseInt(medianMatch[1]) : null;
    const medianLineCrossing  = !!medianMatch || /逾越海峽中線|跨越.*?中線|中線以東/.test(zhText);

    // Report date: prefer list-page publication date, fall back to ROC date in article body
    const rocMatch = zhText.match(/中華民國\s*(\d+)\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
    let reportDate = listReportDate || new Date().toISOString().slice(0, 10);
    if (!listReportDate && rocMatch) {
      const year = parseInt(rocMatch[1]) + 1911;
      reportDate = `${year}-${String(rocMatch[2]).padStart(2,"0")}-${String(rocMatch[3]).padStart(2,"0")}`;
    }

    // Aircraft types
    const types = [];
    const typeRe = /(殲[-\w]+|轟[-\w]+|運[-\w]+|直[-\w]+|偵察機|預警機|反潛機|空警[-\w]*|電戰機|殲擊機)\s*(\d+)\s*架/g;
    let m;
    while ((m = typeRe.exec(zhText)) !== null) types.push(`${m[1]} ${m[2]}架`);

    // Summaries
    const zhSummaryMatch = zhText.match(/(?:活動動態[：:]\s*)(.{0,300})/);
    const zhSummary = zhSummaryMatch ? zhSummaryMatch[1].trim() : zhText.slice(0, 300);

    // EN summary: extract "PLA activities:" section
    let enSummary = null;
    if (enText) {
      const enMatch = enText.match(/(?:PLA activities?[:\s]+)(.{0,400})/i);
      enSummary = enMatch ? enMatch[1].trim() : enText.slice(0, 400);
    }

    return {
      aircraft:           aircraftMatch ? parseInt(aircraftMatch[1]) : null,
      ships:              shipsMatch    ? parseInt(shipsMatch[1])    : null,
      adizCount:          adizMatch     ? parseInt(adizMatch[1])     : null,
      adizViolation:        !!adizMatch,
      medianLineCrossing,
      medianLineCrossings,
      types,
      summary:   zhSummary,
      summaryEn: enSummary,
      reportDate,
      url:   zhUrl,
      urlEn: enUrl,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("MND fetch failed:", err.message);
    return null;
  }
}

// ─── PLA Exercise & Rhetoric Detection ──────────────────────────────────────
const EXERCISE_KW = [
  "joint sword","联合利剑","聯合利劍",
  "pla exercise","military drill","live-fire drill","amphibious exercise",
  "combat readiness patrol","戰備巡邏","실탄훈련",
  "eastern theater command","eastern theatre","東部戰區演習",
  "encirclement exercise","blockade drill","封鎖演習",
  "rocket force","火箭軍演習","ballistic missile test",
  "joint combat readiness","聯合戰備",
  "snap drill","no-notice exercise","突擊演習",
  "carrier strike group","航母戰鬥群演習",
];

// Escalatory CCP/PLA rhetoric — three tiers
const RHETORIC_L3 = [ // Critical: ultimatum / red line / imminent
  "武力統一","武統","cross the red line","跨越紅線",
  "invasion imminent","ultimatum","final warning","最後警告",
  "reunification by force","強制統一",
];
const RHETORIC_L2 = [ // High: deadline / timeline / stern warning
  "reunification timeline","統一時間表","統一期限",
  "stern warning","严正警告","嚴正警告",
  "taiwan independence means war","台獨就是戰爭",
  "one china principle","底線","不惜一切",
];
const RHETORIC_L1 = [ // Elevated: general tension language
  "taiwan strait tension","cross-strait escalat",
  "反分裂","separatist","provocation","挑釁升溫",
  "military option","軍事選項",
];

function detectExercise(text) {
  const t = text.toLowerCase();
  return EXERCISE_KW.some(k => t.includes(k.toLowerCase()));
}
function detectRhetoricLevel(text) {
  const t = text.toLowerCase();
  if (RHETORIC_L3.some(k => t.includes(k.toLowerCase()))) return 3;
  if (RHETORIC_L2.some(k => t.includes(k.toLowerCase()))) return 2;
  if (RHETORIC_L1.some(k => t.includes(k.toLowerCase()))) return 1;
  return 0;
}

// ─── Main Sweep Function ─────────────────────────────────────────────────────
async function runSweep() {
  const results = await Promise.allSettled([
    ...RSS_SOURCES.map(s => fetchRSS(s)),
    fetchGDELT("military conflict crisis war"),
    fetchGDELT("Taiwan strait China military PLA ADIZ"),
  ]);

  const allEvents = [];
  const seen = new Set();

  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const e of r.value) {
        if (!seen.has(e.title)) {
          seen.add(e.title);
          allEvents.push(e);
        }
      }
    }
  }

  // Sort: critical > high > medium > low, then by date
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  allEvents.sort((a, b) => {
    if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  // Fetch MND report in parallel with sweep save
  const [mndData] = await Promise.allSettled([fetchMNDReport()]);
  const mnd = mndData.status === "fulfilled" ? mndData.value : null;

  // Save to Firestore
  const batch = db.batch();
  batch.set(db.collection("sweeps").doc("latest"), {
    updatedAt: new Date().toISOString(),
    totalEvents: allEvents.length,
    events: allEvents.slice(0, 100),
  });
  if (mnd) {
    batch.set(db.collection("mnd").doc("latest"), mnd);
  }
  await batch.commit();

  // Write historical daily summary records
  try {
    const todayKey = new Date().toISOString().slice(0, 10);
    const twEvents = allEvents.filter(e => e.isTaiwan);
    const critCount = twEvents.filter(e => e.severity === "critical").length;
    const highCount = twEvents.filter(e => e.severity === "high").length;
    const medCount  = twEvents.filter(e => e.severity === "medium").length;
    const eventScore = Math.min(25,
      critCount * 6 +
      Math.sqrt(highCount) * 4 +
      Math.sqrt(medCount) * 1.5
    );
    let tensionIdx = 38 + eventScore;
    if (mnd) {
      const ac = mnd.aircraft;
      if (ac != null) tensionIdx += ac >= 30 ? 15 : ac >= 20 ? 10 : ac >= 10 ? 4 : ac >= 1 ? 1 : 0;
      if (mnd.medianLineCrossing) tensionIdx += 12;
      if (mnd.adizViolation)      tensionIdx += 3;
      const ships = mnd.ships || 0;
      if (ships >= 10) tensionIdx += 6;
      else if (ships >= 5) tensionIdx += 2;
    }
    tensionIdx = Math.round(Math.min(95, tensionIdx));

    const exerciseEvents = allEvents.filter(e => e.isExercise);
    const maxRhetoric    = allEvents.reduce((mx, e) => Math.max(mx, e.rhetoricLevel || 0), 0);
    const stateMediCount = allEvents.filter(e => ["globaltimes","xinhua_en"].includes(e.sourceId) && e.isTaiwan).length;

    const histBatch = db.batch();
    histBatch.set(db.collection("sweeps_history").doc(todayKey), {
      date:              todayKey,
      tensionIndex:      tensionIdx,
      criticalCount:     allEvents.filter(e => e.severity === "critical").length,
      highCount:         allEvents.filter(e => e.severity === "high").length,
      mediumCount:       allEvents.filter(e => e.severity === "medium").length,
      topEvents:         allEvents.slice(0, 5).map(e => ({ title: e.title, source: e.source, severity: e.severity })),
      exerciseCount:     exerciseEvents.length,
      exerciseTitles:    exerciseEvents.slice(0, 3).map(e => e.title),
      maxRhetoricLevel:  maxRhetoric,
      stateMediaTaiwan:  stateMediCount,
      updatedAt:         new Date().toISOString(),
    }, { merge: true });

    if (mnd) {
      const mndKey = mnd.reportDate || todayKey;
      histBatch.set(db.collection("mnd_history").doc(mndKey), {
        date:               mndKey,
        aircraft:           mnd.aircraft,
        ships:              mnd.ships,
        adizViolation:      mnd.adizViolation,
        adizCount:          mnd.adizCount,
        medianLineCrossing: mnd.medianLineCrossing,
        updatedAt:          new Date().toISOString(),
      }, { merge: true });
    }
    await histBatch.commit();
  } catch (histErr) {
    console.error("History write failed:", histErr.message);
  }

  console.log(`Sweep complete: ${allEvents.length} events, MND: ${mnd ? `${mnd.aircraft}架/${mnd.ships}艘` : "unavailable"}`);
  return allEvents;
}

// ─── HTTP API Endpoint ────────────────────────────────────────────────────────
exports.api = functions
  .runWith({ timeoutSeconds: 60, memory: "512MB" })
  .https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");

    const path = req.path;

    if (path === "/api/events" || path === "/events") {
      try {
        // Try cached data first (max 15 min old)
        const doc = await db.collection("sweeps").doc("latest").get();
        if (doc.exists) {
          const data = doc.data();
          const age = Date.now() - new Date(data.updatedAt).getTime();
          if (age < 15 * 60 * 1000) {
            return res.json({ events: data.events, updatedAt: data.updatedAt, cached: true });
          }
        }
        // Run fresh sweep
        const events = await runSweep();
        return res.json({ events, updatedAt: new Date().toISOString(), cached: false });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
    }

    if (path === "/api/sweep" || path === "/sweep") {
      try {
        const events = await runSweep();
        return res.json({ events, updatedAt: new Date().toISOString() });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    if (path === "/api/mnd" || path === "/mnd") {
      try {
        const forceRefresh = req.query.refresh === "1";
        const doc = await db.collection("mnd").doc("latest").get();
        if (doc.exists && !forceRefresh) {
          const cached = doc.data();
          const ageMs = Date.now() - new Date(cached.fetchedAt || 0).getTime();
          // Return cache if < 25 hours old (MND publishes once per day)
          if (ageMs < 25 * 60 * 60 * 1000) return res.json({ ...cached, cached: true });
        }
        // Cache is stale or missing — fetch fresh data
        const data = await fetchMNDReport();
        if (data) {
          await db.collection("mnd").doc("latest").set(data);
          // Also write to mnd_history
          await db.collection("mnd_history").doc(data.reportDate).set({
            date:               data.reportDate,
            aircraft:           data.aircraft,
            ships:              data.ships,
            adizViolation:      data.adizViolation,
            adizCount:          data.adizCount,
            medianLineCrossing: data.medianLineCrossing,
            updatedAt:          new Date().toISOString(),
          }, { merge: true });
          return res.json(data);
        }
        // Fresh fetch failed — return stale cache if available, with warning
        if (doc.exists) return res.json({ ...doc.data(), stale: true });
        return res.status(404).json({ error: "MND data unavailable" });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    if (path === "/api/history" || path === "/history") {
      try {
        const days = Math.min(60, parseInt(req.query.days || "30"));
        const snap = await db.collection("sweeps_history")
          .orderBy("date", "desc")
          .limit(days)
          .get();
        const history = snap.docs.map(d => d.data()).reverse();
        return res.json({ history });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    if (path === "/api/mnd-history" || path === "/mnd-history") {
      try {
        const days = Math.min(60, parseInt(req.query.days || "30"));
        const snap = await db.collection("mnd_history")
          .orderBy("date", "desc")
          .limit(days)
          .get();
        const history = snap.docs.map(d => d.data()).reverse();
        return res.json({ history });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    if (path === "/api/early-warning" || path === "/early-warning") {
      try {
        const [sweepSnap, mndSnap, latestSnap] = await Promise.all([
          db.collection("sweeps_history").orderBy("date","desc").limit(30).get(),
          db.collection("mnd_history").orderBy("date","desc").limit(30).get(),
          db.collection("sweeps").doc("latest").get(),
        ]);

        const sweepHist = sweepSnap.docs.map(d => d.data()).reverse();
        const mndHist   = mndSnap.docs.map(d => d.data()).reverse();
        const latestEvt = latestSnap.exists ? (latestSnap.data().events || []) : [];

        // ── Helper: rolling average of last N items ───────────────────────
        const avg = (arr, key, n) => {
          const vals = arr.slice(-n).map(d => d[key] ?? null).filter(v => v !== null);
          return vals.length ? vals.reduce((s,v) => s+v, 0) / vals.length : null;
        };

        // ── Indicator 1: Aircraft sortie surge ───────────────────────────
        const latestMND  = mndHist[mndHist.length - 1] || {};
        const avg7Sorties = avg(mndHist.slice(0, -1), "aircraft", 7);
        const todaySorties = latestMND.aircraft ?? null;
        let sortie_level = 0;
        let sortie_pct   = null;
        if (todaySorties !== null && avg7Sorties) {
          sortie_pct = ((todaySorties - avg7Sorties) / avg7Sorties) * 100;
          sortie_level = sortie_pct >= 100 ? 3 : sortie_pct >= 50 ? 2 : sortie_pct >= 20 ? 1 : 0;
        }

        // ── Indicator 2: Consecutive median line crossing days ────────────
        let median_streak = 0;
        for (let i = mndHist.length - 1; i >= 0; i--) {
          if (mndHist[i].medianLineCrossing) median_streak++;
          else break;
        }
        const median_level = median_streak >= 6 ? 3 : median_streak >= 3 ? 2 : median_streak >= 1 ? 1 : 0;

        // ── Indicator 3: ADIZ intrusion intensity ─────────────────────────
        const avg7ADIZ    = avg(mndHist.slice(0,-1), "adizCount", 7);
        const todayADIZ   = latestMND.adizCount ?? null;
        let adiz_level = 0, adiz_pct = null;
        if (todayADIZ !== null && avg7ADIZ) {
          adiz_pct  = ((todayADIZ - avg7ADIZ) / avg7ADIZ) * 100;
          adiz_level = adiz_pct >= 100 ? 3 : adiz_pct >= 50 ? 2 : adiz_pct >= 20 ? 1 : 0;
        }

        // ── Indicator 4: Tension index 7-day trend ────────────────────────
        const recent7 = sweepHist.slice(-7).map(d => d.tensionIndex || 0);
        let tension_slope = 0;
        if (recent7.length >= 2) {
          tension_slope = recent7[recent7.length-1] - recent7[0];
        }
        const tension_level = tension_slope >= 12 ? 3 : tension_slope >= 6 ? 2 : tension_slope >= 2 ? 1 : 0;

        // ── Indicator 5: PLA exercise detection (7-day window) ────────────
        const ex7d = sweepHist.slice(-7).reduce((s,d) => s + (d.exerciseCount||0), 0);
        const exTitles = sweepHist.slice(-7).flatMap(d => d.exerciseTitles||[]).slice(0,3);
        // Also check latest events
        const liveExCount = latestEvt.filter(e => e.isExercise).length;
        const totalEx = ex7d + liveExCount;
        const exercise_level = totalEx >= 5 ? 3 : totalEx >= 2 ? 2 : totalEx >= 1 ? 1 : 0;

        // ── Indicator 6: CCP/PLA escalatory rhetoric ─────────────────────
        const maxRhet7d = sweepHist.slice(-7).reduce((mx,d) => Math.max(mx, d.maxRhetoricLevel||0), 0);
        const liveRhet  = latestEvt.reduce((mx,e) => Math.max(mx, e.rhetoricLevel||0), 0);
        const rhetoric_level = Math.max(maxRhet7d, liveRhet);

        // ── Indicator 7: Chinese state media Taiwan coverage heat ─────────
        const stateMedia7d = sweepHist.slice(-7).reduce((s,d) => s + (d.stateMediaTaiwan||0), 0);
        const liveState    = latestEvt.filter(e => ["globaltimes","xinhua_en"].includes(e.sourceId) && e.isTaiwan).length;
        const stateTotal   = stateMedia7d + liveState;
        const state_level  = stateTotal >= 10 ? 3 : stateTotal >= 5 ? 2 : stateTotal >= 2 ? 1 : 0;

        // ── Indicator 8: Taiwan event cluster (last 24h) ──────────────────
        const cutoff24h   = Date.now() - 24*60*60*1000;
        const cluster24h  = latestEvt.filter(e =>
          e.isTaiwan &&
          (e.severity === "critical" || e.severity === "high") &&
          new Date(e.publishedAt).getTime() > cutoff24h
        ).length;
        const cluster_level = cluster24h >= 7 ? 3 : cluster24h >= 4 ? 2 : cluster24h >= 2 ? 1 : 0;

        // ── Composite score ───────────────────────────────────────────────
        const levels = [sortie_level, median_level, adiz_level, tension_level,
                        exercise_level, rhetoric_level, state_level, cluster_level];
        const score  = levels.reduce((s,v) => s+v, 0);
        const maxScore = levels.length * 3;
        const composite_level =
          score >= Math.round(maxScore * 0.75) ? 4 :
          score >= Math.round(maxScore * 0.55) ? 3 :
          score >= Math.round(maxScore * 0.35) ? 2 :
          score >= Math.round(maxScore * 0.15) ? 1 : 0;

        return res.json({
          indicators: {
            sortie_surge:   { level: sortie_level,   value: todaySorties, avg7d: avg7Sorties ? +avg7Sorties.toFixed(1) : null, pctChange: sortie_pct ? +sortie_pct.toFixed(0) : null },
            median_streak:  { level: median_level,   streak: median_streak },
            adiz_intensity: { level: adiz_level,     value: todayADIZ, avg7d: avg7ADIZ ? +avg7ADIZ.toFixed(1) : null, pctChange: adiz_pct ? +adiz_pct.toFixed(0) : null },
            tension_trend:  { level: tension_level,  slope: +tension_slope.toFixed(1), recent7 },
            exercise_detect:{ level: exercise_level, count7d: totalEx, titles: exTitles },
            pla_rhetoric:   { level: rhetoric_level },
            state_media:    { level: state_level,    count7d: stateTotal },
            event_cluster:  { level: cluster_level,  count24h: cluster24h },
          },
          composite: { score, maxScore, level: composite_level },
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(404).json({ error: "Not found" });
  });

// ─── Scheduled Sweep (every 20 minutes) ──────────────────────────────────────
exports.scheduledSweep = functions.pubsub
  .schedule("every 20 minutes")
  .onRun(async () => {
    await runSweep();
    return null;
  });
