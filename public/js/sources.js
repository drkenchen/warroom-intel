// ── Data Source Definitions ───────────────────────────────────────────────
const SOURCES = {
  zh: [
    { id: "cna",     name: "中央社 CNA",       lang: "zh", type: "RSS", url: "https://www.cna.com.tw/rss/aopl.aspx",
      note: "台灣官方通訊社",               noteEn: "Taiwan's official wire service" },
    { id: "ltn",     name: "自由時報",          lang: "zh", type: "RSS", url: "https://news.ltn.com.tw/rss/world.xml",
      note: "台灣主要報紙",                 noteEn: "Taiwan's leading independent newspaper" },
    { id: "bbc_zh",  name: "BBC中文",           lang: "zh", type: "RSS", url: "https://feeds.bbci.co.uk/zhongwen/trad/rss.xml",
      note: "BBC繁體中文版",                noteEn: "BBC Traditional Chinese edition" },
    { id: "rfa",     name: "自由亞洲電台 RFA",  lang: "zh", type: "RSS", url: "https://www.rfa.org/mandarin/rss2.xml",
      note: "美國國會資助，關注亞洲人權民主",   noteEn: "US Congress-funded, focused on Asian human rights & democracy" },
    { id: "voa_zh",  name: "美國之音中文",      lang: "zh", type: "RSS", url: "https://www.voachinese.com/api/zmgqo-uyoqu",
      note: "美國官方對外廣播中文版",         noteEn: "Official US international broadcasting, Chinese edition" },
    { id: "rti",     name: "中央廣播電台 RTI",  lang: "zh", type: "RSS", url: "https://www.rti.org.tw/rss/news/cate/id/6",
      note: "台灣對外廣播",                 noteEn: "Taiwan's international broadcaster" },
    { id: "dw_zh",   name: "DW中文",            lang: "zh", type: "RSS", url: "https://rss.dw.com/rdf/rss-chi-all",
      note: "德國之聲中文版",               noteEn: "Deutsche Welle Chinese edition" },
    { id: "ttnews",  name: "Taiwan News",       lang: "en", type: "RSS", url: "https://www.taiwannews.com.tw/rss",
      note: "台灣英文新聞，對外發布",         noteEn: "Taiwan English news, international outreach" },
    { id: "tptimes", name: "Taipei Times",      lang: "en", type: "RSS", url: "https://www.taipeitimes.com/RSS/news.rss",
      note: "台北時報，英文台灣官方媒體",      noteEn: "English-language Taiwan newspaper of record" },
  ],
  en: [
    { id: "guardian",   name: "The Guardian",       lang: "en", type: "RSS", url: "https://www.theguardian.com/world/rss",
      note: "英國主要媒體",                 noteEn: "Major UK newspaper, global coverage" },
    { id: "aljazeera",  name: "Al Jazeera",          lang: "en", type: "RSS", url: "https://www.aljazeera.com/xml/rss/all.xml",
      note: "中東視角全球報導",              noteEn: "Global coverage with Middle East perspective" },
    { id: "diplomat",   name: "The Diplomat",        lang: "en", type: "RSS", url: "https://thediplomat.com/feed/",
      note: "亞太地緣政治最具深度英文媒體",    noteEn: "Premier English-language Asia-Pacific geopolitics outlet" },
    { id: "wotr",       name: "War on the Rocks",    lang: "en", type: "RSS", url: "https://warontherocks.com/feed/",
      note: "美國軍事戰略學者深度評論",        noteEn: "In-depth US military strategy analysis by academics & practitioners" },
    { id: "aspi",       name: "ASPI Strategist",     lang: "en", type: "RSS", url: "https://www.aspistrategist.org.au/feed/",
      note: "澳洲戰略政策研究所，印太安全",    noteEn: "Australian Strategic Policy Institute, Indo-Pacific security" },
    { id: "defenseone", name: "Defense One",         lang: "en", type: "RSS", url: "https://www.defenseone.com/rss/all/",
      note: "美國防衛政策媒體，五角大廈消息",  noteEn: "US defense policy media, Pentagon coverage" },
    { id: "breakingdef",name: "Breaking Defense",    lang: "en", type: "RSS", url: "https://breakingdefense.com/feed/",
      note: "美國防務工業與軍事科技媒體",      noteEn: "US defense industry & military technology media" },
    { id: "gdelt",      name: "GDELT Project",       lang: "en", type: "API", url: "https://api.gdeltproject.org",
      note: "全球事件資料庫，分析27語言媒體",  noteEn: "Global event database, analyzes media in 27 languages" },
  ],
  forums: [
    { id: "cfr",         name: "Council on Foreign Relations", lang: "en", type: "RSS", url: "https://www.cfr.org/rss.xml",
      note: "美國頂尖外交政策智庫（CFR）",      noteEn: "Top US foreign policy think tank" },
    { id: "fp",          name: "Foreign Policy",               lang: "en", type: "RSS", url: "https://foreignpolicy.com/feed/",
      note: "外交政策深度分析雜誌",             noteEn: "In-depth foreign policy analysis magazine" },
    { id: "fa",          name: "Foreign Affairs",              lang: "en", type: "RSS", url: "https://www.foreignaffairs.com/rss.xml",
      note: "CFR旗艦學術期刊",                  noteEn: "CFR flagship academic journal" },
    { id: "bellingcat",  name: "Bellingcat",                   lang: "en", type: "RSS", url: "https://www.bellingcat.com/feed/",
      note: "開源調查新聞，軍事衝突地理核實",    noteEn: "Open-source investigative journalism, military conflict geolocation" },
    { id: "lawfare",     name: "Lawfare",                      lang: "en", type: "RSS", url: "https://www.lawfaremedia.org/feed",
      note: "國家安全法律政策頂尖智庫",          noteEn: "Top think tank for national security law & policy" },
    { id: "atlantic_council", name: "Atlantic Council",        lang: "en", type: "RSS", url: "https://www.atlanticcouncil.org/feed/",
      note: "跨大西洋安全政策研究所",            noteEn: "Transatlantic security policy institute" },
    { id: "carnegie",    name: "Carnegie Endowment",           lang: "en", type: "RSS", url: "https://carnegieendowment.org/feed/",
      note: "全球政策研究，中國/印太深度分析",    noteEn: "Global policy research, deep analysis on China & Indo-Pacific" },
    { id: "brookings",   name: "Brookings Institution",        lang: "en", type: "RSS", url: "https://www.brookings.edu/feed/",
      note: "美國最具影響力智庫之一",            noteEn: "One of the most influential US think tanks" },
    { id: "stimson",     name: "Stimson Center",               lang: "en", type: "RSS", url: "https://www.stimson.org/feed/",
      note: "亞洲安全、軍備控制研究",            noteEn: "Asia security & arms control research" },
    { id: "mwi",         name: "Modern War Institute",         lang: "en", type: "RSS", url: "https://mwi.westpoint.edu/feed/",
      note: "西點軍校現代戰爭研究機構",          noteEn: "West Point's Modern War Institute" },
    { id: "justsecurity",name: "Just Security",                lang: "en", type: "RSS", url: "https://www.justsecurity.org/feed/",
      note: "國家安全法律與政策分析",            noteEn: "National security law & policy analysis" },
    { id: "rand",        name: "RAND Corporation",             lang: "en", type: "RSS", url: "https://www.rand.org/blog.rss",
      note: "美國頂尖防衛政策研究機構",          noteEn: "Top US defense & policy research institution" },
    { id: "csis_main",   name: "CSIS",                         lang: "en", type: "RSS", url: "https://www.csis.org/rss/csis_all.xml",
      note: "戰略暨國際研究中心",                noteEn: "Center for Strategic and International Studies" },
    { id: "csis_cp",     name: "CSIS China Power",             lang: "en", type: "WEB", url: "https://chinapower.csis.org",
      note: "CSIS台海與中國力量專題分析",        noteEn: "CSIS flagship China & Taiwan Strait analysis hub" },
    { id: "iiss",        name: "IISS",                         lang: "en", type: "WEB", url: "https://www.iiss.org",
      note: "國際戰略研究所，軍力平衡年報",       noteEn: "International Institute for Strategic Studies, Military Balance yearbook" },
    { id: "sipri",       name: "SIPRI",                        lang: "en", type: "WEB", url: "https://www.sipri.org",
      note: "斯德哥爾摩國際和平研究所，軍費資料庫", noteEn: "Stockholm International Peace Research Institute, arms & military expenditure database" },
    { id: "cnas",        name: "CNAS",                         lang: "en", type: "WEB", url: "https://www.cnas.org",
      note: "美國新安全中心，印太戰略研究",       noteEn: "Center for a New American Security, Indo-Pacific strategy" },
    { id: "isw",         name: "ISW",                          lang: "en", type: "RSS", url: "https://www.understandingwar.org/rss.xml",
      note: "戰爭研究所，烏克蘭/中東每日戰場評估", noteEn: "Institute for the Study of War, daily Ukraine/Middle East battlefield assessment" },
    { id: "natsec",      name: "The National Interest",        lang: "en", type: "RSS", url: "https://nationalinterest.org/rss.xml",
      note: "現實主義地緣政治分析",              noteEn: "Realist geopolitical analysis" },
    { id: "p2049",       name: "Project 2049 Institute",       lang: "en", type: "WEB", url: "https://www.project2049.net",
      note: "台灣/中國政策研究機構，台灣安全首選", noteEn: "Taiwan/China policy institute, preferred for Taiwan security research" },
    { id: "kyiv_ind",    name: "Kyiv Independent",             lang: "en", type: "RSS", url: "https://kyivindependent.com/feed/",
      note: "烏克蘭前線即時報導，等同 @DefMon3 等 OSINT 帳號", noteEn: "Ukraine frontline live coverage, equivalent to @DefMon3 OSINT" },
    { id: "rferl",       name: "RFE/RL",                       lang: "en", type: "RSS", url: "https://www.rferl.org/api/epiqr_tmoklk",
      note: "美國政府資助，俄羅斯/東歐/中亞深度報導", noteEn: "US government-funded, deep Russia/Eastern Europe/Central Asia coverage" },
    { id: "eurasianet",  name: "Eurasianet",                   lang: "en", type: "RSS", url: "https://eurasianet.org/rss.xml",
      note: "高加索/中亞衝突，@IntelCrab 等帳號常引用", noteEn: "Caucasus/Central Asia conflicts, frequently cited by OSINT analysts" },
    { id: "def_blog",    name: "Defense Blog",                 lang: "en", type: "RSS", url: "https://defence-blog.com/feed/",
      note: "全球軍事裝備損失追蹤，等同 @WarMonitor3 觀點", noteEn: "Global military equipment loss tracking, equivalent to @WarMonitor3" },
    { id: "mil_times",   name: "Military Times",               lang: "en", type: "RSS", url: "https://www.militarytimes.com/arc/outboundfeeds/rss/",
      note: "美軍政策/五角大廈消息，@RALee85 等學者常引用", noteEn: "US military policy & Pentagon coverage, cited by leading defense scholars" },
    { id: "militarnyi",  name: "Militarnyi",                   lang: "en", type: "RSS", url: "https://militarnyi.com/en/feed/",
      note: "烏克蘭軍方即時情報，等同 @OSINTdefender 烏克蘭視角", noteEn: "Ukraine military live intelligence, equivalent to @OSINTdefender Ukraine perspective" },
  ],
  specialized: [
    { id: "firms",    name: "NASA FIRMS",             lang: "en", type: "API",   url: "https://firms.modaps.eosdis.nasa.gov",
      note: "NASA火點/熱點衛星偵測",         noteEn: "NASA satellite fire & thermal hotspot detection" },
    { id: "opensky",  name: "OpenSky Network",        lang: "en", type: "API",   url: "https://opensky-network.org",
      note: "全球航班即時追蹤",               noteEn: "Global live flight tracking" },
    { id: "ata",      name: "台灣研析中心",           lang: "zh", type: "WEB",   url: "https://www.taich.gov.tw",
      note: "台灣政府研析報告",               noteEn: "Taiwan government research & analysis reports" },
  ],
  // X accounts: reference links + included as AI analysis guidance (no RSS available)
  x_osint: [
    { id: "x_intelcrab",    name: "@IntelCrab",         lang: "en", type: "𝕏", url: "https://x.com/IntelCrab",
      note: "全球OSINT情報，重大衝突事件即時報導",       noteEn: "Global OSINT intel, live major conflict coverage" },
    { id: "x_ralee85",      name: "@RALee85",           lang: "en", type: "𝕏", url: "https://x.com/RALee85",
      note: "CNA研究員，俄羅斯軍事戰略深度分析",        noteEn: "CNA researcher, deep Russia military strategy analysis" },
    { id: "x_osintdef",     name: "@OSINTdefender",     lang: "en", type: "𝕏", url: "https://x.com/OSINTdefender",
      note: "OSINT防衛情報，熱點事件即時監控",           noteEn: "OSINT defense intel, live hotspot event monitoring" },
    { id: "x_kofman",       name: "@KofmanMichael",     lang: "en", type: "𝕏", url: "https://x.com/KofmanMichael",
      note: "俄羅斯軍事戰略頂尖學者，CNA研究員",        noteEn: "Top Russia military strategy scholar, CNA researcher" },
    { id: "x_trbrtc",       name: "@trbrtc",            lang: "en", type: "𝕏", url: "https://x.com/trbrtc",
      note: "台灣/解放軍專題OSINT追蹤",                  noteEn: "Taiwan/PLA specialist OSINT tracking" },
    { id: "x_asiaelec",     name: "@AsiaElec",          lang: "en", type: "𝕏", url: "https://x.com/AsiaElec",
      note: "亞洲/台灣地緣政治深度分析",                 noteEn: "Asia/Taiwan geopolitical deep analysis" },
    { id: "x_geoconfirmed", name: "@GeoConfirmed",      lang: "en", type: "𝕏", url: "https://x.com/GeoConfirmed",
      note: "地理確認衝突事件，衛星影像佐證",             noteEn: "Geolocated conflict events verified with satellite imagery" },
    { id: "x_warmonitor",   name: "@WarMonitor3",       lang: "en", type: "𝕏", url: "https://x.com/WarMonitor3",
      note: "全球戰場即時監控",                           noteEn: "Global battlefield live monitoring" },
    { id: "x_defmon3",      name: "@DefMon3",           lang: "en", type: "𝕏", url: "https://x.com/DefMon3",
      note: "烏克蘭前線OSINT，裝備損失追蹤",             noteEn: "Ukraine frontline OSINT, equipment loss tracking" },
    { id: "x_hawkingav",    name: "@HawkingAviator",    lang: "en", type: "𝕏", url: "https://x.com/HawkingAviator",
      note: "軍用航空情報追蹤，PLA空軍動態",              noteEn: "Military aviation intel tracking, PLA air force dynamics" },
    { id: "x_dfrlab",       name: "@DFRLab",            lang: "en", type: "𝕏", url: "https://x.com/DFRLab",
      note: "大西洋理事會數位鑑識研究室，資訊戰",         noteEn: "Atlantic Council Digital Forensic Research Lab, information warfare" },
    { id: "x_bellingcat",   name: "@bellingcatint",     lang: "en", type: "𝕏", url: "https://x.com/bellingcatint",
      note: "開源調查核實，軍事地理定位",                 noteEn: "Open source investigation & military geolocation" },
    { id: "x_indopacific",  name: "@IndoPacificNow",    lang: "en", type: "𝕏", url: "https://x.com/IndoPacificNow",
      note: "印太地緣政治即時分析",                       noteEn: "Indo-Pacific geopolitical live analysis" },
    { id: "x_shanghpact",   name: "@ShanghaiPact",      lang: "en", type: "𝕏", url: "https://x.com/ShanghaiPact",
      note: "中俄印太戰略研究追蹤",                       noteEn: "China-Russia Indo-Pacific strategy tracking" },
    { id: "x_osintukr",     name: "@OsintUkraine",      lang: "en", type: "𝕏", url: "https://x.com/OsintUkraine",
      note: "烏克蘭開源情報，前線動態",                   noteEn: "Ukraine open source intel, frontline updates" },
    { id: "x_archer83",     name: "@Archer83Able",      lang: "en", type: "𝕏", url: "https://x.com/Archer83Able",
      note: "OSINT熱點事件即時追蹤",                      noteEn: "OSINT hotspot event live tracking" },
    { id: "x_noclador",     name: "@noclador",          lang: "en", type: "𝕏", url: "https://x.com/noclador",
      note: "船艦追蹤，南海/台海海事動態",                noteEn: "Vessel tracking, South China Sea/Taiwan Strait maritime dynamics" },
    { id: "x_cna_def",      name: "@CNAdefense",        lang: "en", type: "𝕏", url: "https://x.com/CNAdefense",
      note: "美國海軍分析中心，解放軍與印太安全",         noteEn: "US Naval Analysis Center, PLA & Indo-Pacific security" },
  ],
};

// ── Severity Keywords ─────────────────────────────────────────────────────
const SEVERITY_KEYWORDS = {
  critical: [
    "war","warfare","invasion","invaded","nuclear launch","missile strike","bombed",
    "airstrike","air strike","chemical weapon","biological weapon","ground offensive",
    "carpet bombing","genocide","coup","全面","战争","入侵","核武","导弹攻击","轰炸",
    "空袭","侵台","攻台","武统","全面进攻","核打击","政变","屠杀"
  ],
  high: [
    "military","troops","attack","conflict","crisis","sanctions","escalation",
    "warship","aircraft carrier","fighter jet","submarine","blockade","siege",
    "hostage","explosion","assassin","drone strike","naval","artillery",
    "解放军","共军","军事演习","制裁","封锁","危机","台海","军舰","航母",
    "战斗机","潜艇","导弹","飞弹","PLA","PLAAF","PLAN","火箭军","炮击",
    "无人机","暗杀","劫持","爆炸"
  ],
  medium: [
    "tension","protest","unrest","alert","warning","mobilization","deployment",
    "rally","clash","demonstration","riot","standoff","confrontation",
    "紧张","抗议","动乱","警告","动员","部署","演习","威胁","挑衅",
    "对峙","冲突","示威","镇压"
  ]
};

// ── Taiwan-related Keywords ────────────────────────────────────────────────
const TAIWAN_KEYWORDS = [
  "taiwan","taipei","strait","pla","plaaf","adiz","tsai","lai ching-te",
  "lai qingde","william lai","golden gate","kinmen","matsu","penghu",
  "台灣","台海","解放軍","共軍","中共","兩岸","統一","獨立","飛彈",
  "航母","台積電","TSMC","台海危機","第一島鏈","金門","馬祖","澎湖",
  "賴清德","蔡英文","防衛","國防","空軍","海軍","侵台","攻台"
];

// ── Region Detection Map ───────────────────────────────────────────────────
const REGION_KEYWORDS = [
  { keys: ["ukraine","ukrania","kyiv","kiev","kharkiv","kherson","mariupol","zelensky","zelenskyy","烏克蘭","基輔","哈爾科夫"],
    region: "烏克蘭/俄羅斯", risk: "critical", emoji: "🇺🇦" },
  { keys: ["russia","moscow","kremlin","putin","俄羅斯","莫斯科","普丁","克里姆林"],
    region: "烏克蘭/俄羅斯", risk: "critical", emoji: "🇷🇺" },
  { keys: ["gaza","hamas","rafah","khan younis","加薩","哈瑪斯","拉法"],
    region: "中東加薩", risk: "critical", emoji: "🇵🇸" },
  { keys: ["israel","netanyahu","idf","以色列","以色列國防軍","內塔尼亞胡"],
    region: "以色列/黎巴嫩", risk: "high", emoji: "🇮🇱" },
  { keys: ["iran","tehran","khamenei","伊朗","德黑蘭","哈梅內伊"],
    region: "伊朗", risk: "high", emoji: "🇮🇷" },
  { keys: ["taiwan","taipei","strait","adiz","台灣","台海","台北"],
    region: "台海", risk: "high", emoji: "🇹🇼" },
  { keys: ["china","beijing","xi jinping","pla","plaaf","中國","北京","習近平","解放軍"],
    region: "中國", risk: "medium", emoji: "🇨🇳" },
  { keys: ["north korea","kim jong","pyongyang","朝鮮","金正恩","平壤"],
    region: "朝鮮半島", risk: "high", emoji: "🇰🇵" },
  { keys: ["myanmar","yangon","junta","緬甸","仰光","軍政府"],
    region: "緬甸", risk: "high", emoji: "🇲🇲" },
  { keys: ["sudan","khartoum","darfur","蘇丹","喀土穆","達爾富爾"],
    region: "蘇丹", risk: "high", emoji: "🇸🇩" },
  { keys: ["yemen","houthi","葉門","胡塞"],
    region: "葉門", risk: "high", emoji: "🇾🇪" },
  { keys: ["south china sea","spratly","paracel","南海","南中國海","南沙群島","西沙群島"],
    region: "南海", risk: "medium", emoji: "🌊" },
  { keys: ["venezuela","caracas","maduro","委內瑞拉","卡拉卡斯","馬杜羅"],
    region: "委內瑞拉", risk: "medium", emoji: "🇻🇪" },
  { keys: ["pakistan","india","kashmir","巴基斯坦","印度","喀什米爾"],
    region: "南亞", risk: "medium", emoji: "🇮🇳" },
];

function kwMatch(text, kw) {
  const k = kw.toLowerCase();
  if (/[\u4e00-\u9fff]/.test(k)) return text.includes(k);
  return new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text);
}

function scoreSeverity(text) {
  const txt = (text || "").toLowerCase();
  for (const kw of SEVERITY_KEYWORDS.critical)
    if (kwMatch(txt, kw)) return "critical";
  for (const kw of SEVERITY_KEYWORDS.high)
    if (kwMatch(txt, kw)) return "high";
  for (const kw of SEVERITY_KEYWORDS.medium)
    if (kwMatch(txt, kw)) return "medium";
  return "low";
}

function isTaiwanRelated(text) {
  const txt = (text || "").toLowerCase();
  return TAIWAN_KEYWORDS.some(k => txt.includes(k.toLowerCase()));
}

function detectRegion(text) {
  const txt = (text || "").toLowerCase();
  for (const entry of REGION_KEYWORDS)
    if (entry.keys.some(k => txt.includes(k.toLowerCase())))
      return { region: entry.region, risk: entry.risk, emoji: entry.emoji };
  return { region: "全球", risk: "low", emoji: "🌍" };
}
