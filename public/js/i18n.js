// ── Internationalization ───────────────────────────────────────────────────
const LANG_STATE = {
  current: localStorage.getItem("warroom_lang") || "zh",
};

const I18N = {
  zh: {
    logo_sub:        "全球危機情報",
    lbl_critical:    "重大",
    lbl_high:        "高危",
    lbl_medium:      "中危",
    lbl_low:         "一般",
    lbl_loading:     "載入中...",
    nav_global:      "全球危機",
    nav_taiwan:      "台海專題",
    nav_hotspots:    "危機熱點",
    nav_sources:     "消息來源",
    nav_ai:          "AI分析",
    filter_all:      "全部",
    filter_critical: "重大",
    filter_high:     "高危",
    filter_medium:   "中危",
    region_all:      "所有地區",
    lang_all:        "中英文",
    lang_zh:         "僅中文",
    lang_en:         "僅英文",
    h_global:        "全球重大事件",
    h_hotspots:      "全球危機熱點分析",
    h_sources:       "情報來源",
    tw_tension:      "◉ 台海緊張指數",
    tw_ai_label:     "✦ AI 深度分析",
    tw_ai_desc:      "使用 AI 對台海局勢進行六面向深度分析：解放軍行動、灰色地帶戰術、美日嚇阻評估、情境風險、早期預警信號。",
    tw_ai_btn:       "啟動台海深度分析",
    tw_mnd:          "▌ 國防部每日共軍動態",
    tw_threat:       "▌ 威脅面向分析",
    tw_scenario:     "▌ 情境預測模型（未來12個月）",
    tw_indicators:   "▌ 關鍵監控指標",
    tw_events:       "▌ 最新台海情報事件",
    tw_sources:      "▌ 權威情報來源",
    empty:           "目前無符合條件的事件",
    empty_tw:        "目前無台海相關事件",
    modal_link:      "前往原始來源 →",
    modal_related:   "相關事件",
    no_desc:         "（無詳細描述，請點擊原始連結閱讀全文）",
    taiwan_tag:      "台海",
    ai_title:        "AI 情報綜合分析",
    ai_placeholder:  "◌ 點擊「開始分析」，AI 將綜合所有已載入的情報事件進行深度分析。",
    ai_start:        "開始分析",
    ai_reanalyze:    "重新分析",
    ai_need_key:     "需設定 Key",
    ai_analyzing:    "分析中...",
    ai_no_analysis:  "尚未分析",
    ai_free:         "免費額度 · 不儲存於伺服器",
    ai_settings:     "⚙ 設定 Key",
    ai_last:         (dt, n) => `上次分析: ${dt} · ${n} 條事件`,
    ai_done:         (wc, rm, model) => `分析完成 &nbsp;·&nbsp; ${new Date().toLocaleTimeString("zh-TW")} &nbsp;·&nbsp; ${model} &nbsp;·&nbsp; 約 ${wc} 字 / ${rm} 分鐘閱讀 &nbsp;`,
    src_zh:          "中文新聞來源",
    src_en:          "英文新聞媒體",
    src_forums:      "地緣政治論壇 / 智庫",
    src_special:     "專業情報資料庫",
    src_x:           "𝕏 開源情報帳號",
    loading_main:    "正在掃描情報來源...",
    loading_sub:     "連接資料庫",
    updated:         (t) => `更新: ${t}`,
    toast_ok:        (n, ok) => `✓ 已載入 ${n} 條情報（${ok} 個來源成功）`,
    toast_fail:      "⚠ 所有來源載入失敗，請檢查網路後重試",
    toast_copied:    "✓ 已複製到剪貼簿",
    btn_copy:        "⎘ 複製",
    btn_pdf:         "↓ PDF",
    hotspot_count:   (n) => `◎ ${n} 條相關事件`,
    map_count:       (ev, pt) => `${ev} 條事件 · ${pt} 個熱點`,
    tier1:           "🔬 一級核心來源",
    tier2:           "📖 二級專業來源",
    calculating:     "計算中...",
    ai_gemini_hint:  "Plus 帳號建議選 gemini-2.5-pro 獲得最佳分析品質",
    ai_output_lang:  "繁體中文",
  },
  en: {
    logo_sub:        "Global Crisis Intel",
    lbl_critical:    "Critical",
    lbl_high:        "High",
    lbl_medium:      "Medium",
    lbl_low:         "Low",
    lbl_loading:     "Loading...",
    nav_global:      "Global Crisis",
    nav_taiwan:      "Taiwan Strait",
    nav_hotspots:    "Hotspots",
    nav_sources:     "Sources",
    nav_ai:          "AI Analysis",
    filter_all:      "All",
    filter_critical: "Critical",
    filter_high:     "High",
    filter_medium:   "Medium",
    region_all:      "All Regions",
    lang_all:        "All Languages",
    lang_zh:         "Chinese Only",
    lang_en:         "English Only",
    h_global:        "Global Major Events",
    h_hotspots:      "Global Crisis Hotspot Analysis",
    h_sources:       "Intelligence Sources",
    tw_tension:      "◉ Taiwan Strait Tension Index",
    tw_ai_label:     "✦ AI Deep Analysis",
    tw_ai_desc:      "Six-dimensional AI deep analysis: PLA operations, gray zone tactics, US-Japan deterrence, scenario risks, early warning signals.",
    tw_ai_btn:       "Launch Taiwan Deep Analysis",
    tw_mnd:          "▌ MND Daily PLA Report",
    tw_threat:       "▌ Threat Dimension Analysis",
    tw_scenario:     "▌ Scenario Forecast (Next 12 Months)",
    tw_indicators:   "▌ Key Watch Indicators",
    tw_events:       "▌ Latest Taiwan Strait Intelligence",
    tw_sources:      "▌ Authoritative Intelligence Sources",
    empty:           "No events match current filters",
    empty_tw:        "No Taiwan Strait events found",
    modal_link:      "Go to Source →",
    modal_related:   "Related Events",
    no_desc:         "(No description — click link to read full article)",
    taiwan_tag:      "Taiwan",
    ai_title:        "AI Intelligence Analysis",
    ai_placeholder:  "◌ Click 'Start Analysis' to generate a comprehensive intelligence report.",
    ai_start:        "Start Analysis",
    ai_reanalyze:    "Re-analyze",
    ai_need_key:     "API Key Required",
    ai_analyzing:    "Analyzing...",
    ai_no_analysis:  "Not yet analyzed",
    ai_free:         "Free tier · Not stored on servers",
    ai_settings:     "⚙ Settings",
    ai_last:         (dt, n) => `Last analysis: ${dt} · ${n} events`,
    ai_done:         (wc, rm, model) => `Done &nbsp;·&nbsp; ${new Date().toLocaleTimeString("en-US")} &nbsp;·&nbsp; ${model} &nbsp;·&nbsp; ~${wc} words / ${rm} min read &nbsp;`,
    src_zh:          "Chinese-Language News",
    src_en:          "English-Language News",
    src_forums:      "Geopolitical Forums / Think Tanks",
    src_special:     "Specialized Intelligence Sources",
    src_x:           "𝕏 OSINT Accounts",
    loading_main:    "Scanning intelligence sources...",
    loading_sub:     "Connecting to database",
    updated:         (t) => `Updated: ${t}`,
    toast_ok:        (n, ok) => `✓ Loaded ${n} events (${ok} sources)`,
    toast_fail:      "⚠ All sources failed — check network connection",
    toast_copied:    "✓ Copied to clipboard",
    btn_copy:        "⎘ Copy",
    btn_pdf:         "↓ PDF",
    hotspot_count:   (n) => `◎ ${n} related events`,
    map_count:       (ev, pt) => `${ev} events · ${pt} hotspots`,
    tier1:           "🔬 Tier-1 Core Sources",
    tier2:           "📖 Tier-2 Professional Sources",
    calculating:     "Calculating...",
    ai_gemini_hint:  "Plus users: select gemini-2.5-pro for best analysis quality",
    ai_output_lang:  "English",
  }
};

// ── Core translation function ──────────────────────────────────────────────
function t(key, ...args) {
  const val = I18N[LANG_STATE.current]?.[key] ?? I18N.zh[key] ?? key;
  return typeof val === "function" ? val(...args) : val;
}

// ── Region display name ────────────────────────────────────────────────────
const REGION_EN = {
  "烏克蘭/俄羅斯": "Ukraine/Russia",
  "中東加薩":      "Middle East/Gaza",
  "以色列/黎巴嫩": "Israel/Lebanon",
  "伊朗":         "Iran",
  "台海":         "Taiwan Strait",
  "中國":         "China",
  "朝鮮半島":     "Korean Peninsula",
  "緬甸":         "Myanmar",
  "蘇丹":         "Sudan",
  "葉門":         "Yemen",
  "南海":         "South China Sea",
  "委內瑞拉":     "Venezuela",
  "南亞":         "South Asia",
  "全球":         "Global",
};

function tRegion(zhName) {
  if (LANG_STATE.current === "en" && REGION_EN[zhName]) return REGION_EN[zhName];
  return zhName;
}

// ── Ensure lang toggle button exists (injected if old HTML cached) ────────
function _ensureLangBtn() {
  if (document.getElementById("lang-toggle-btn")) return;
  const headerInner = document.querySelector(".header-inner");
  if (!headerInner) return;
  const btn = document.createElement("button");
  btn.id = "lang-toggle-btn";
  btn.className = "lang-toggle-btn";
  btn.onclick = () => setLang(LANG_STATE.current === "zh" ? "en" : "zh");
  // Insert before refresh button, or at end of header
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    headerInner.insertBefore(btn, refreshBtn);
  } else {
    headerInner.appendChild(btn);
  }
}

// ── Apply data-i18n translations to static HTML ───────────────────────────
function applyTranslations() {
  _ensureLangBtn();
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = I18N[LANG_STATE.current]?.[key] ?? I18N.zh[key];
    if (typeof val === "string") el.textContent = val;
  });
  // Sync lang select options in filter bar
  const langSel = document.getElementById("lang-filter");
  if (langSel) {
    langSel.options[0].text = t("lang_all");
    langSel.options[1].text = t("lang_zh");
    langSel.options[2].text = t("lang_en");
  }
  const regAll = document.querySelector('#region-filter option[value="all"]');
  if (regAll) regAll.text = t("region_all");
  // Update toggle button label
  const btn = document.getElementById("lang-toggle-btn");
  if (btn) btn.textContent = LANG_STATE.current === "zh" ? "EN" : "中文";
}

// ── Language switch ────────────────────────────────────────────────────────
function setLang(lang) {
  LANG_STATE.current = lang;
  localStorage.setItem("warroom_lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-TW" : "en";
  applyTranslations();
  if (typeof renderAll === "function") renderAll();
}
