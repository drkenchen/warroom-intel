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
  const m = html.match(/<div[^>]+class="[^"]*maincontent[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div/);
  if (!m) return null;
  return m[1]
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

    const zhLink = zhHtml.match(/href="(news\/plaact\/\d+)"/);
    const enLink = enHtml.match(/href="(news\/plaact\/\d+)"/);
    if (!zhLink) throw new Error("No ZH plaact link found");

    const zhUrl = `${MND_BASE}/${zhLink[1]}`;
    const enUrl = enLink ? `${MND_BASE}/en/${enLink[1]}` : null;

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
    const medianLineCrossing = /逾越海峽中線|跨越.*?中線|中線以東/.test(zhText);

    // Report date from ROC calendar
    const rocMatch = zhText.match(/中華民國\s*(\d+)\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
    let reportDate = new Date().toISOString().slice(0, 10);
    if (rocMatch) {
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
      adizViolation:      !!adizMatch,
      medianLineCrossing,
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
        const doc = await db.collection("mnd").doc("latest").get();
        if (doc.exists) return res.json(doc.data());
        // Try fresh fetch if no cached data
        const data = await fetchMNDReport();
        if (data) {
          await db.collection("mnd").doc("latest").set(data);
          return res.json(data);
        }
        return res.status(404).json({ error: "MND data unavailable" });
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
