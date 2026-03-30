# Warroom Intelligence Dashboard

> 全球危機即時情報儀表板｜Global Crisis Intelligence Dashboard

**[繁體中文](#繁體中文) · [English](#english)**

---

## 繁體中文

### 專案簡介

Warroom Intelligence 是一個以地緣政治與軍事危機為核心的即時情報儀表板，靈感源自專業危機監控平台。系統自動彙整來自全球 30+ 個智庫、媒體與官方機構的 RSS 訊息，結合 AI 深度分析，提供台海、烏克蘭、中東等熱點地區的即時威脅評估。

**線上示範：** https://warroom-intel.web.app

---

### 功能特色

#### 即時情報聚合
- 自動抓取 30+ 個新聞來源（中英文並行），涵蓋 BBC 中文、自由亞洲電台、The Diplomat、ISW、RAND、Bellingcat、環球時報、新華社（英）、南華早報等
- GDELT 全球事件資料庫整合，分析 27 語言媒體；顯示 30 日媒體聲量與情緒走勢圖
- 以嚴重程度（重大 / 高危 / 中危 / 低）自動分類事件
- 每 10 分鐘自動刷新，搭配智慧快取

#### 台海專題模組
- **台海緊張指數**：綜合即時情報與台灣國防部每日共軍動態，動態計算 0–100 分威脅指數，並顯示近 30 日趨勢圖
- **國防部每日共軍動態**：自動抓取台灣國防部官網（中英文版），即時顯示共軍飛機架次、艦船數量、逾越中線架次及 ADIZ 侵入情況，並附 30 日動態趨勢圖
- **多維預警雷達**：依據 CSIS、Project 2049、美國國防部年度報告等專家框架，實作 8 項關鍵預警指標，計算複合預警等級（觀察→注意→警戒→升溫→緊急）
- **異常升溫偵測**：以 Z 分數（σ）自動判斷今日緊張指數是否顯著偏離 7 日均值，高於 +1.5σ 或低於 −1.5σ 時顯示警示橫幅
- **動態情境概率**：根據當前緊張指數、MND 數據動態調整四大情境概率（灰色地帶 / 海上封鎖 / 飛彈打擊 / 全面入侵），每項顯示與基準值的差值
- **歷史快照時光機**：選擇過去任意日期，重現當時的緊張指數、MND 數據與代表事件；趨勢圖以垂直線標記選取日期
- 威脅面向分析（軍事 / 灰色地帶 / 經濟 / 外交 / 網路）
- 關鍵監控指標（ADIZ 侵入率、航母動向、美軍前沿部署等）
- 權威情報來源導覽（CSIS、RAND、ASPI、ISW、Project 2049 等）

#### 多維預警雷達指標說明

| 指標 | 說明 | 資料來源 |
|------|------|---------|
| 出擊架次異常 | 近期架次較 7 日均值高出 1σ+ | MND 歷史資料 |
| 中線連續跨越 | 近 3 日均有逾越中線紀錄 | MND 歷史資料 |
| ADIZ 侵入強度 | 依侵入架次分級評分 | MND 即時資料 |
| 緊張指數趨勢 | 近 7 日趨勢方向與幅度 | 掃描歷史 |
| 軍演關鍵字偵測 | 監控「聯合利劍」等 20+ 演習關鍵詞 | RSS 事件流 |
| 中共升溫修辭 | 三級修辭強度（一般→警告→威脅） | RSS 事件流 |
| 官媒台灣聲量 | 環球時報、新華社英文涉台報導密度 | 中國官媒 RSS |
| 事件密度叢集 | 24 小時內高嚴重事件件數 | 即時掃描 |

#### AI 深度分析
- 整合 Google Gemini 2.5 Pro（主要）及 Groq LLaMA-3.3-70B（備援）
- 生成具有 RAND/CSIS/ASPI 智庫分析師視角的深度報告
- 台海專項深度分析，含六大維度：局勢評估、PLA 軍事行動、灰色地帶戰術、美日嚇阻態勢、情境風險、早期預警信號
- 串流輸出、可下載 PDF

#### 危機熱點地圖
- 互動式地圖（Leaflet + CartoDB）
- 11 個熱點地區即時風險標注（台海、烏克蘭/俄羅斯、中東加薩、伊朗等）
- 脈衝動畫標示高風險區域

#### 其他
- **中英雙語介面**，一鍵切換
- **PWA 支援**：可安裝至桌面/手機，離線可用快取資料
- 事件篩選（重大 / 高危 / 中危 + 地區 + 語言）
- 暗色介面設計

---

### 技術架構

```
warroom/
├── public/                  # 前端靜態資源（Firebase Hosting）
│   ├── index.html           # 主頁面（單頁應用）
│   ├── sw.js                # Service Worker（PWA / 快取）
│   ├── manifest.json        # PWA 設定
│   ├── css/style.css        # 全域樣式
│   └── js/
│       ├── app.js           # 主應用邏輯、RSS 抓取、事件渲染
│       ├── taiwan.js        # 台海分析模組（含預警雷達、歷史快照）
│       ├── ai.js            # AI 分析模組（Gemini / Groq）
│       ├── sources.js       # 來源定義、嚴重性分類、地區偵測
│       └── i18n.js          # 中英雙語翻譯
├── functions/               # 後端（Firebase Cloud Functions）
│   └── index.js             # RSS 掃描、MND 抓取、Firestore 寫入、預警計算
├── firebase.json            # Firebase 設定
└── .firebaserc              # Firebase 專案設定
```

**前端：** 純 HTML / CSS / Vanilla JavaScript（無框架）
**後端：** Firebase Cloud Functions (Node.js 20)
**資料庫：** Firebase Firestore（快取每次掃描結果、歷史快照）
**地圖：** Leaflet.js + CartoDB Basemaps
**RSS Proxy：** rss2json.com（CORS 解決方案）
**AI：** Google Gemini API + Groq API
**部署：** Firebase Hosting + Firebase Cloud Functions

### 後端 API 端點

| 端點 | 說明 |
|------|------|
| `/api/sweep` | 掃描所有 RSS 來源，寫入 Firestore，觸發預警計算 |
| `/api/events` | 取得最新情報事件清單 |
| `/api/mnd` | 取得台灣國防部最新共軍動態（含 25 小時快取 TTL） |
| `/api/history` | 取得近 N 日緊張指數與 MND 歷史數據 |
| `/api/early-warning` | 計算並回傳 8 項預警指標與複合預警等級 |

---

### 資料來源

#### 中文媒體
| 來源 | 說明 |
|------|------|
| BBC 中文 | BBC 繁體中文版 |
| 自由時報 | 台灣主要獨立報紙 |
| 自由亞洲電台 (RFA) | 美國國會資助，專注亞洲人權民主 |
| DW 中文 | 德國之聲中文版 |
| 中央社 CNA | 台灣官方通訊社 |
| 美國之音中文 | 美國官方對外廣播 |

#### 英文媒體與智庫
| 來源 | 說明 |
|------|------|
| The Diplomat | 亞太地緣政治深度分析 |
| War on the Rocks | 美國軍事戰略學者評論 |
| ASPI Strategist | 澳洲戰略政策研究所 |
| ISW | 戰爭研究所，每日烏克蘭/中東評估 |
| RAND Blog | 美國頂尖防衛政策研究 |
| Bellingcat | 開源調查新聞 |
| Defense One / Breaking Defense | 美國防衛政策媒體 |
| Kyiv Independent | 烏克蘭前線即時報導 |
| Foreign Policy | 外交政策深度分析 |
| Atlantic Council, Carnegie, Brookings | 頂尖美國智庫 |
| Lawfare, Just Security | 國家安全法律政策 |
| Eurasianet, RFE/RL | 俄羅斯/中亞/高加索報導 |
| South China Morning Post | 香港英文大報 |

#### 中國官方媒體（預警信號監控）
| 來源 | 說明 |
|------|------|
| 環球時報（英）| 中國對外強硬立場指標 |
| 新華社（英）| 中國官方通訊社對外發稿 |

#### 官方來源
| 來源 | 說明 |
|------|------|
| 台灣國防部 (MND) | 每日共軍動態公告（中英雙語） |
| GDELT Project | 全球事件資料庫，27 語言媒體分析 |

---

### 快速部署

#### 前置需求
- Node.js 20+
- Firebase CLI：`npm install -g firebase-tools`
- Firebase 專案（需 Blaze 方案以使用 Cloud Functions）
- Google Gemini API 金鑰（免費，15 RPM）
- Groq API 金鑰（免費，30 RPM）—— 選用備援

#### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/drkenchen/warroom-intel.git
cd warroom-intel

# 2. 安裝 Functions 依賴
cd functions && npm install && cd ..

# 3. 登入 Firebase
firebase login

# 4. 設定 Firebase 專案
firebase use --add   # 選擇你的 Firebase 專案

# 5. 部署
firebase deploy
```

#### 使用 AI 分析功能

在儀表板右上角「AI 分析」頁籤，輸入你的 API 金鑰：
- **Gemini API Key**：至 [Google AI Studio](https://aistudio.google.com) 免費取得
- **Groq API Key**：至 [Groq Console](https://console.groq.com) 免費取得

金鑰僅儲存於瀏覽器 `localStorage`，不會傳送至任何伺服器。

---

### 授權

MIT License — 自由使用、修改與散布，請保留原始出處。

---

## English

### Overview

Warroom Intelligence is a real-time geopolitical and military crisis monitoring dashboard. It aggregates intelligence from 30+ think tanks, media outlets, and official sources worldwide, combines AI-powered deep analysis, and provides live threat assessments for the Taiwan Strait, Ukraine, the Middle East, and other flashpoints.

**Live Demo:** https://warroom-intel.web.app

---

### Features

#### Real-Time Intelligence Aggregation
- Automated ingestion from 30+ sources in Chinese and English — including BBC Chinese, RFA, The Diplomat, ISW, RAND, Bellingcat, Global Times, Xinhua English, and SCMP
- GDELT global event database integration (27-language media monitoring) with 30-day volume & sentiment trend charts
- Automatic severity classification: Critical / High / Medium / Low
- 10-minute auto-refresh with smart caching

#### Taiwan Strait Module
- **Taiwan Strait Tension Index**: Dynamic 0–100 threat score combining live news events and MND daily PLA reports, with a 30-day trend chart
- **MND Daily PLA Activity**: Auto-fetches Taiwan's Ministry of National Defense website (Chinese & English), displaying PLA aircraft sorties, ship counts, median line crossings (count), and ADIZ violations in real time, with a 30-day activity trend chart
- **Multi-Dimensional Early Warning Radar**: 8 expert-framework indicators (CSIS, Project 2049, DoD Annual Report) computing a composite warning level: Monitor → Watch → Alert → Elevated → Critical
- **Anomaly Detection Banner**: Z-score analysis flags when today's tension index deviates more than ±1.5σ from the 7-day rolling mean
- **Dynamic Scenario Probability**: Rule-based model adjusts the four scenario probabilities (Gray Zone / Naval Blockade / Missile Strike / Full Invasion) in real time based on tension index and MND data, showing delta vs. baseline
- **Historical Playback**: Select any past date to replay its tension gauge, MND data, and representative events; trend charts mark the selected date with a vertical reference line
- Threat dimension analysis (Military / Gray Zone / Economic / Diplomatic / Cyber)
- Key watch indicators (ADIZ intrusion rate, carrier movements, US 7th Fleet posture, etc.)
- Authoritative source directory (CSIS, RAND, ASPI, ISW, Project 2049, etc.)

#### Early Warning Radar — Indicators

| Indicator | Description | Data Source |
|-----------|-------------|-------------|
| Sortie Surge | Recent sorties exceed 7-day avg by 1σ+ | MND historical data |
| Median Line Streak | Crossings recorded in each of the past 3 days | MND historical data |
| ADIZ Intensity | Severity score based on intrusion sortie count | MND live data |
| Tension Trend | Direction and magnitude of 7-day tension trajectory | Sweep history |
| Exercise Detection | 20+ PLA exercise keywords (e.g., 聯合利劍, snap drill) | RSS event stream |
| CCP Rhetoric Level | 3-tier escalatory language scoring | RSS event stream |
| State Media Signal | Global Times / Xinhua coverage density on Taiwan | Chinese state media RSS |
| Event Cluster | High-severity event count in the past 24 hours | Live sweep |

#### AI Deep Analysis
- Powered by Google Gemini 2.5 Pro (primary) with Groq LLaMA-3.3-70B (fallback)
- Generates reports from the perspective of RAND/CSIS/ASPI analysts
- Taiwan-specific deep analysis across six dimensions: overall assessment, PLA military activity, gray-zone tactics, US-Japan deterrence posture, scenario risk, and early warning signals
- Streaming output with PDF download

#### Crisis Hotspot Map
- Interactive map (Leaflet + CartoDB)
- 11 hotspot regions with live risk indicators (Taiwan Strait, Ukraine/Russia, Gaza, Iran, etc.)
- Pulse animation for high-risk zones

#### Other
- **Bilingual UI** (Traditional Chinese / English) — one-click toggle
- **PWA support**: installable on desktop/mobile, offline-capable via cache
- Event filtering by severity, region, and language
- Dark-mode interface

---

### Architecture

```
warroom/
├── public/                  # Frontend static assets (Firebase Hosting)
│   ├── index.html           # Main page (SPA)
│   ├── sw.js                # Service Worker (PWA / caching)
│   ├── manifest.json        # PWA manifest
│   ├── css/style.css        # Global styles
│   └── js/
│       ├── app.js           # Core logic, RSS fetching, event rendering
│       ├── taiwan.js        # Taiwan Strait module (early warning radar, historical playback)
│       ├── ai.js            # AI analysis (Gemini / Groq)
│       ├── sources.js       # Source definitions, severity scoring, region detection
│       └── i18n.js          # Bilingual translations
├── functions/               # Backend (Firebase Cloud Functions)
│   └── index.js             # RSS sweep, MND scraping, Firestore writes, early warning computation
├── firebase.json            # Firebase configuration
└── .firebaserc              # Firebase project binding
```

**Frontend:** Plain HTML / CSS / Vanilla JavaScript (no framework)
**Backend:** Firebase Cloud Functions (Node.js 20)
**Database:** Firebase Firestore (caches sweep results and daily snapshots)
**Map:** Leaflet.js + CartoDB Basemaps
**RSS Proxy:** rss2json.com (CORS workaround)
**AI:** Google Gemini API + Groq API
**Deployment:** Firebase Hosting + Firebase Cloud Functions

### Backend API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/sweep` | Scans all RSS sources, writes to Firestore, triggers early warning computation |
| `/api/events` | Returns the latest intelligence event list |
| `/api/mnd` | Returns latest MND PLA activity data (25-hour cache TTL, `?refresh=1` to force) |
| `/api/history` | Returns N-day tension index and MND historical data |
| `/api/early-warning` | Computes and returns 8 early warning indicators with composite level |

---

### Data Sources

#### Chinese-Language Media
| Source | Description |
|--------|-------------|
| BBC Chinese | BBC Traditional Chinese edition |
| Liberty Times (自由時報) | Taiwan's leading independent newspaper |
| RFA (Radio Free Asia) | US Congress-funded, Asia human rights & democracy focus |
| DW Chinese | Deutsche Welle Chinese edition |
| CNA (中央社) | Taiwan's official wire service |
| VOA Chinese | US official international broadcasting |

#### English Media & Think Tanks
| Source | Description |
|--------|-------------|
| The Diplomat | Premier Asia-Pacific geopolitics outlet |
| War on the Rocks | US military strategy analysis by scholars |
| ASPI Strategist | Australian Strategic Policy Institute |
| ISW | Institute for the Study of War — daily Ukraine/Middle East assessments |
| RAND Blog | Top US defense & policy research |
| Bellingcat | Open-source investigative journalism |
| Defense One / Breaking Defense | US defense policy media |
| Kyiv Independent | Ukraine frontline live coverage |
| Foreign Policy | In-depth foreign policy analysis |
| Atlantic Council, Carnegie, Brookings | Leading US think tanks |
| Lawfare, Just Security | National security law & policy |
| Eurasianet, RFE/RL | Russia/Central Asia/Caucasus coverage |
| South China Morning Post | Hong Kong English-language broadsheet |

#### Chinese State Media (Early Warning Signal Monitoring)
| Source | Description |
|--------|-------------|
| Global Times (English) | Indicator of China's hawkish external positioning |
| Xinhua English | China's official state wire service (international) |

#### Official Sources
| Source | Description |
|--------|-------------|
| Taiwan MND (國防部) | Daily PLA activity reports (Chinese & English) |
| GDELT Project | Global event database, 27-language media monitoring |

---

### Deployment

#### Prerequisites
- Node.js 20+
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project (Blaze plan required for Cloud Functions)
- Google Gemini API key (free, 15 RPM)
- Groq API key (free, 30 RPM) — optional fallback

#### Setup

```bash
# 1. Clone the repository
git clone https://github.com/drkenchen/warroom-intel.git
cd warroom-intel

# 2. Install Functions dependencies
cd functions && npm install && cd ..

# 3. Authenticate with Firebase
firebase login

# 4. Link to your Firebase project
firebase use --add

# 5. Deploy
firebase deploy
```

#### Enabling AI Analysis

In the dashboard, go to the **AI Analysis** tab and enter your API keys:
- **Gemini API Key**: Get one free at [Google AI Studio](https://aistudio.google.com)
- **Groq API Key**: Get one free at [Groq Console](https://console.groq.com)

Keys are stored only in browser `localStorage` and are never sent to any server.

#### Firebase IAM (required for Cloud Functions)

After your first deployment, grant the compute service account Storage Object Viewer permission:

```
IAM & Admin → find {project-number}-compute@developer.gserviceaccount.com → add role: Storage Object Viewer
```

---

### License

MIT License — free to use, modify, and distribute. Please credit the original source.
