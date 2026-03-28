// ── Taiwan Strait Deep Analysis Module ───────────────────────────────────
// Sources: CSIS, RAND, ASPI, ISW, Project 2049, INDSR, War on the Rocks,
//          The Diplomat, Jamestown Foundation, Global Taiwan Institute

const TaiwanAnalysis = {

  // ── Authoritative Source Registry ────────────────────────────────────────
  authSources: [
    { name:"CSIS China Power",          type:"智庫", typeEn:"Think Tank", lang:"EN", tier:1,
      url:"https://chinapower.csis.org",
      desc:"美國戰略暨國際研究中心，解放軍軍力最權威量化分析",
      descEn:"CSIS flagship hub for quantitative PLA military power analysis" },
    { name:"RAND Corporation",          type:"智庫", typeEn:"Think Tank", lang:"EN", tier:1,
      url:"https://www.rand.org/topics/taiwan.html",
      descEn:"Taiwan Strait conflict scenario modeling & US military response assessment",
      desc:"台海衝突情境模擬與美軍應對能力評估" },
    { name:"ASPI (澳洲戰略政策研究所)", type:"智庫", typeEn:"Think Tank", lang:"EN", tier:1,
      url:"https://www.aspistrategist.org.au",
      desc:"印太安全最活躍智庫，解放軍追蹤與技術威脅分析",
      descEn:"Most active Indo-Pacific security think tank; PLA tracking & tech threat analysis" },
    { name:"ISW (戰爭研究所)",          type:"智庫", typeEn:"Think Tank", lang:"EN", tier:1,
      url:"https://understandingwar.org",
      desc:"即時衝突地圖與軍事行動深度分析",
      descEn:"Real-time conflict mapping and in-depth military operations analysis" },
    { name:"Project 2049 Institute",    type:"智庫", typeEn:"Think Tank", lang:"EN", tier:1,
      url:"https://project2049.net",
      desc:"台海安全最專注智庫，台灣、中國、東南亞情報研究",
      descEn:"Most focused think tank on Taiwan Strait security; Taiwan, China & SE Asia intelligence research" },
    { name:"國防安全研究院 INDSR",       type:"官方", typeEn:"Official",   lang:"ZH", tier:1,
      url:"https://indsr.org.tw",
      desc:"台灣國防部外圍智庫，解放軍威脅評估官方立場",
      descEn:"Taiwan MND affiliated think tank; official assessment of PLA threats" },
    { name:"中華民國國防部",            type:"官方", typeEn:"Official",   lang:"ZH", tier:1,
      url:"https://www.mnd.gov.tw",
      desc:"每日發布解放軍侵台動態，ADIZ侵入即時報告",
      descEn:"Daily PLA incursion updates; real-time ADIZ violation reports" },
    { name:"War on the Rocks",          type:"分析", typeEn:"Analysis",   lang:"EN", tier:2,
      url:"https://warontherocks.com",
      desc:"美國軍事戰略學者深度評論，含台海衝突分析",
      descEn:"In-depth US military strategy analysis by scholars; covers Taiwan Strait scenarios" },
    { name:"The Diplomat",              type:"媒體", typeEn:"Media",      lang:"EN", tier:2,
      url:"https://thediplomat.com",
      desc:"亞太地緣政治最具深度英文媒體",
      descEn:"Premier English-language Asia-Pacific geopolitics outlet" },
    { name:"Jamestown Foundation",      type:"智庫", typeEn:"Think Tank", lang:"EN", tier:2,
      url:"https://jamestown.org",
      desc:"中國軍事事務（PLA）與台海監控專門機構",
      descEn:"Specialist institution for Chinese military affairs (PLA) & Taiwan Strait monitoring" },
    { name:"Global Taiwan Institute",   type:"智庫", typeEn:"Think Tank", lang:"EN", tier:2,
      url:"https://globaltaiwan.org",
      desc:"台灣政策倡議，關注對台政策與雙邊關係",
      descEn:"Taiwan policy advocacy; focused on US-Taiwan policy & bilateral relations" },
    { name:"Brookings Institution",     type:"智庫", typeEn:"Think Tank", lang:"EN", tier:2,
      url:"https://www.brookings.edu/topic/china/",
      desc:"美國最具影響力智庫，中美關係與台灣政策深度研究",
      descEn:"Top US think tank; deep research on US-China relations & Taiwan policy" },
    { name:"Atlantic Council",          type:"智庫", typeEn:"Think Tank", lang:"EN", tier:2,
      url:"https://www.atlanticcouncil.org/programs/indo-pacific-security-initiative/",
      desc:"印太安全與北約盟友協作分析",
      descEn:"Indo-Pacific security and NATO allied coordination analysis" },
    { name:"Mercator Institute (MERICS)",type:"智庫",typeEn:"Think Tank", lang:"EN", tier:2,
      url:"https://merics.org/en",
      desc:"歐洲最大中國研究機構，對歐政策影響分析",
      descEn:"Europe's largest China research institute; analyzes China's policy influence on Europe" },
    { name:"前瞻基金會 Prospect Fdn",   type:"智庫", typeEn:"Think Tank", lang:"ZH", tier:2,
      url:"https://www.pf.org.tw",
      desc:"台灣外交政策、兩岸關係與印太戰略研究",
      descEn:"Taiwan foreign policy, cross-strait relations & Indo-Pacific strategy research" },
  ],

  // ── Threat Dimensions ─────────────────────────────────────────────────────
  threatDimensions: [
    { key:"military",    label:"軍事威脅",  labelEn:"Military Threat",  icon:"⚔️",
      desc:"PLA演習、ADIZ侵擾、飛彈部署、兩棲能力",
      descEn:"PLA exercises, ADIZ violations, missile deployment, amphibious capability",
      level:"high",    score:72 },
    { key:"gray_zone",  label:"灰色地帶",  labelEn:"Gray Zone",        icon:"🌫️",
      desc:"認知作戰、網路攻擊、海巡騷擾、假訊息",
      descEn:"Cognitive warfare, cyber attacks, coast guard harassment, disinformation",
      level:"critical", score:85 },
    { key:"economic",   label:"經濟施壓",  labelEn:"Economic Coercion",icon:"📉",
      desc:"貿易限制、觀光禁令、農漁產品禁入、投資管制",
      descEn:"Trade restrictions, tourism bans, agricultural import bans, investment controls",
      level:"medium",  score:58 },
    { key:"diplomatic", label:"外交孤立",  labelEn:"Diplomatic Isolation",icon:"🚫",
      desc:"邦交國滲透、國際組織排除、對台售武阻撓",
      descEn:"Ally poaching, exclusion from international orgs, blocking arms sales",
      level:"high",    score:68 },
    { key:"cyber",      label:"資訊/網路戰",labelEn:"Cyber/Info War",  icon:"💻",
      desc:"政府機關攻擊、選舉干預、關鍵基礎設施滲透",
      descEn:"Government attacks, election interference, critical infrastructure penetration",
      level:"high",    score:75 },
  ],

  // ── Invasion Scenarios ────────────────────────────────────────────────────
  scenarios: [
    { id:"gray_zone",  label:"灰色地帶升級", labelEn:"Gray Zone Escalation",
      prob:55, horizon:"持續進行中", horizonEn:"Ongoing",
      color:"var(--medium)",
      desc:"最可能路徑。解放軍維持「煮青蛙」策略：頻繁侵入ADIZ、海上騷擾、資訊戰、外交壓力，逐步消耗台灣韌性與國際支持，無需開戰即削弱台灣意志。",
      descEn:"Most likely path. PLA maintains 'boiling frog' strategy: frequent ADIZ intrusions, maritime harassment, information warfare, and diplomatic pressure — eroding Taiwan's resilience without open conflict.",
      indicators:["ADIZ侵入頻率增加","海巡船隻對峙","駭客攻擊頻率","假訊息規模"],
      indicatorsEn:["ADIZ intrusion frequency","Coast guard standoffs","Cyberattack rate","Disinformation scale"] },
    { id:"blockade",   label:"海上封鎖",     labelEn:"Naval Blockade",
      prob:18, horizon:"2-5年視窗", horizonEn:"2–5 Year Window",
      color:"var(--high)",
      desc:"解放軍宣布「演習」進行事實封鎖，切斷台灣能源及物資進口。關鍵考驗：美日是否突破封鎖，台灣能源儲備（約11天原油）能否撐過外交解決。RAND研究顯示封鎖可能在數週內使台灣屈服而無需登陸。",
      descEn:"PLA declares an 'exercise' and enacts a de facto blockade, severing Taiwan's energy/goods imports. Key test: will US/Japan break the blockade? Taiwan's ~11-day oil reserve. RAND research suggests a blockade could force capitulation within weeks without a landing.",
      indicators:["PLAN艦隊集結","港口封鎖演習","燃料供應中斷","美日盟友態度"],
      indicatorsEn:["PLAN fleet concentration","Port blockade exercises","Fuel supply disruption","US-Japan stance"] },
    { id:"missile",    label:"精準飛彈打擊", labelEn:"Precision Strike Campaign",
      prob:15, horizon:"危機升溫時", horizonEn:"During Crisis Escalation",
      color:"var(--high)",
      desc:"針對台灣軍事基地、指揮中心、機場、港口的精準打擊，摧毀抵抗能力。解放軍已部署1,000枚以上可打擊台灣的彈道/巡弋飛彈（DF-11/15/16/17、CJ-10）。配合信息戰癱瘓指管系統。",
      descEn:"Precision strikes on Taiwan's military bases, command centers, airports, and ports. PLA has 1,000+ ballistic/cruise missiles (DF-11/15/16/17, CJ-10) capable of hitting Taiwan, paired with EW to paralyze C2.",
      indicators:["火箭軍部隊調動","彈藥前置部署","電磁攻擊演習","台灣防空警報"],
      indicatorsEn:["Rocket Force movements","Forward ammo pre-positioning","EW exercises","Taiwan air-defense alerts"] },
    { id:"invasion",   label:"全面兩棲登陸", labelEn:"Full Amphibious Invasion",
      prob:12, horizon:"2027-2035", horizonEn:"2027–2035",
      color:"var(--critical)",
      desc:"習近平反覆提及2027/2035目標。解放軍積極擴建兩棲登陸艦隊（075型兩棲攻擊艦、071型綜合登陸艦），但台灣海峽天候窗口有限（春秋各約一個月），且需克服「黑色海灘」登陸困難。美軍推演顯示美介入可能阻止登陸。",
      descEn:"Xi has repeatedly cited 2027/2035 targets. PLA actively expanding amphibious fleet (Type 075 LHD, Type 071 LPD), but weather windows are limited (~one month each spring/fall) and 'black beach' landings are extremely difficult. US wargames suggest intervention could repel a landing.",
      indicators:["登陸艦艇動員","空降部隊演習","台灣海峽特殊天候","美軍是否前沿部署"],
      indicatorsEn:["Landing craft mobilization","Airborne exercises","Strait weather conditions","US forward deployment"] },
  ],

  // ── Key Watch Indicators ──────────────────────────────────────────────────
  watchIndicators: [
    { label:"PLA東部戰區警戒",      labelEn:"PLA Eastern TC Alert",        status:"elevated", desc:"持續高姿態演訓",     descEn:"Sustained high-tempo exercises",    src:"INDSR" },
    { label:"ADIZ侵入頻率",         labelEn:"ADIZ Intrusion Frequency",    status:"high",     desc:"幾近每日發生",       descEn:"Near-daily occurrences",            src:"MND" },
    { label:"PLAN航母戰鬥群動向",   labelEn:"PLAN Carrier Group Activity", status:"active",   desc:"山東艦西太平洋部署", descEn:"Shandong CVG in Western Pacific",   src:"ASPI" },
    { label:"美7艦隊前沿部署",      labelEn:"US 7th Fleet Posture",        status:"elevated", desc:"定期台海穿越演練",   descEn:"Regular Taiwan Strait transits",    src:"CSIS" },
    { label:"日本自衛隊戒備",       labelEn:"JSDF Readiness",              status:"elevated", desc:"強化西南島嶼防禦",   descEn:"Strengthening SW island defense",   src:"War on Rocks" },
    { label:"台灣全民防衛動員",     labelEn:"Taiwan Civil Defense",        status:"active",   desc:"延長義務役至1年",    descEn:"Service extended to 1 year",        src:"INDSR" },
    { label:"對台軍售進度",         labelEn:"Arms Sales to Taiwan",        status:"elevated", desc:"M1A2、F-16V交付中",  descEn:"M1A2, F-16V deliveries ongoing",    src:"RAND" },
    { label:"兩岸對話管道",         labelEn:"Cross-Strait Dialogue",       status:"normal",   desc:"官方對話停滯",       descEn:"Official dialogue stalled",         src:"Brookings" },
    { label:"台灣海峽中線默契",     labelEn:"Strait Median Line",          status:"high",     desc:"解放軍頻繁跨越",     descEn:"PLA frequent crossings",            src:"Project 2049" },
    { label:"網路/認知戰活動",      labelEn:"Cyber/Cognitive Ops",         status:"critical", desc:"選舉期間大幅升高",   descEn:"Major spike during elections",      src:"MERICS" },
  ],

  // ── Tension Index Calculation ─────────────────────────────────────────────
  calculateTensionIndex(events, mndData) {
    const tw = (events || []).filter(e => e.isTaiwan);
    let score = 42 +
      tw.filter(e => e.severity === "critical").length * 10 +
      tw.filter(e => e.severity === "high").length * 4 +
      tw.filter(e => e.severity === "medium").length * 1.5;

    // MND daily PLA activity boost
    if (mndData) {
      const ac = mndData.aircraft;
      if (ac !== null && ac !== undefined) {
        score += ac >= 20 ? 15 : ac >= 10 ? 10 : ac >= 5 ? 5 : ac >= 1 ? 2 : 0;
      }
      if (mndData.medianLineCrossing) score += 8;
      if (mndData.adizViolation)      score += 5;
      if (mndData.ships >= 5)         score += 3;
    }

    return Math.round(Math.min(98, score));
  },

  tensionLabel(index) {
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    if (index >= 85) return { text: isEn ? "Critical"  : "極度緊張", color:"var(--critical)", cls:"crit" };
    if (index >= 65) return { text: isEn ? "High"      : "高度緊張", color:"var(--high)",     cls:"high" };
    if (index >= 45) return { text: isEn ? "Moderate"  : "中度緊張", color:"var(--medium)",   cls:"med"  };
    return               { text: isEn ? "Stable"    : "相對穩定", color:"var(--low)",      cls:"low"  };
  },

  // ── AI Deep Analysis Prompt ───────────────────────────────────────────────
  buildDeepAnalysisPrompt(events) {
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const SEV  = { critical:"🔴 Critical", high:"🟠 High", medium:"🟡 Medium", low:"⚪ Low" };
    const now  = new Date().toLocaleString(isEn ? "en-US" : "zh-TW");

    // Primary: Taiwan-tagged events (full detail)
    const tw = events.filter(e => e.isTaiwan).slice(0, 25);
    const twLines = tw.map((e, i) => {
      const ts   = e.publishedAt ? e.publishedAt.slice(0, 16).replace("T", " ") : "—";
      const desc = e.description?.length > 20 ? `\n   Summary: ${e.description.slice(0, 150)}` : "";
      return `${i+1}. ${SEV[e.severity]||e.severity} ${e.title}\n   Source: ${e.source} | Time: ${ts}${desc}`;
    }).join("\n\n");

    // Supporting context events
    const twIds = new Set(tw.map(e => e.id));
    const contextKeywords = ["china","beijing","xi jinping","pla","plaaf","plan","中國","北京","習近平","解放軍","共軍",
      "united states","pentagon","white house","us military","seventh fleet","aircraft carrier","航母","美軍","五角大廈",
      "japan","自衛隊","indo-pacific","south china sea","南海","north korea","朝鮮"];
    const ctxEvents = events
      .filter(e => !twIds.has(e.id) && (e.severity === "critical" || e.severity === "high"))
      .filter(e => {
        const txt = (e.title + " " + (e.description || "")).toLowerCase();
        return contextKeywords.some(k => txt.includes(k));
      })
      .slice(0, 10);
    const ctxLines = ctxEvents.map((e, i) => {
      const ts = e.publishedAt ? e.publishedAt.slice(0, 16).replace("T", " ") : "—";
      return `${i+1}. ${SEV[e.severity]||e.severity} [${e.regionInfo?.region||"Global"}] ${e.title} (${e.source}, ${ts})`;
    }).join("\n");

    if (isEn) {
      return `You are a senior Asia-Pacific security and Taiwan Strait strategy expert with 20 years of experience at think tanks (RAND/CSIS/ASPI etc.).
Based on the following **latest real-time intelligence** and your professional expertise, write a deep-analysis report on the Taiwan Strait situation **entirely in English**.

Report generated: ${now}
Taiwan-related intelligence: ${tw.length} items | Strategic context intelligence: ${ctxEvents.length} items

---

## I. Taiwan Direct Intelligence (${tw.length} items, full summaries)

${twLines || "(No current Taiwan-related real-time intelligence — analyze based on overall background knowledge)"}

---

## II. Strategic Context Intelligence (China/US military/regional dynamics, ${ctxEvents.length} items)

${ctxLines || "(No additional strategic context events)"}

---

## III. OSINT Community Reference (Taiwan/Indo-Pacific focus)

| Account | Expertise | Analytical Focus |
|---------|-----------|-----------------|
| @trbrtc | Taiwan/PLA OSINT | PLA Eastern Theater dynamics, gray-zone operation identification |
| @HawkingAviator | Military aviation intelligence | PLAAF mission patterns, ADIZ incursion analysis |
| @IntelCrab | Global OSINT | Indo-Pacific multi-source cross-validation |
| @IndoPacificNow | Indo-Pacific live updates | US-Japan-Australia ally movements, multilateral security |
| @noclador | Maritime tracking | PLAN fleet movements, Taiwan Strait naval posture |
| @DFRLab | Cognitive warfare | CCP information warfare vs. Taiwan, influence operations |
| @bellingcatint | Open-source verification | Satellite imagery analysis, PLA deployment verification |

---

## Analysis Framework

Complete the following six analytical dimensions in order. Begin each with ###. **Cite the intelligence events above as evidence**:

### I. Overall Situation Assessment
Assess the current Taiwan Strait situation at the strategic level: Xi Jinping's policy orientation, PLA combat readiness, US-Taiwan relations dynamics.
Label each judgment: **[HIGH]** multiple sources / **[MODERATE]** partial corroboration / **[LOW]** single-source inference
(Concise, incisive, under 150 words)

### II. Recent PLA Military Activity Analysis
Based on the intelligence above, analyze PLA Eastern Theater exercise patterns, naval/air movements, missile deployments, and advanced weapons development.
Assess whether these activities exceed "routine" deterrence and whether operational readiness indicators are present. Cite specific intelligence events as evidence.

### III. Gray-Zone Tactics Identification
Identify current non-military coercive tactics employed by the CCP, with specific examples from the intelligence above:
- Cognitive warfare and disinformation operations
- Cyber and critical infrastructure attacks
- Maritime harassment (Coast Guard, fishing militia)
- Diplomatic and economic pressure
- Lawfare (Three Warfares doctrine)

### IV. US-Japan Deterrence Posture Assessment
Using the US military/Japan-related intelligence above, assess the current state of US "strategic ambiguity," US-Japan alliance commitments on Taiwan, and the deterrent effect of forward military deployments (carriers/submarines/ground-based missiles) on Beijing.

### V. Scenario Risk Assessment (Next 12 Months)
Based on current intelligence indicators, estimate the probability (%) of each scenario:
1. Continued gray-zone escalation
2. Partial naval blockade
3. Missile coercion strikes
4. Full-scale military action
Identify the key trigger factors (red line events) for each scenario.

### VI. Analyst Early Warning Signals
List 3–5 "leading indicators" that warrant immediate attention.
If these signals appear, they indicate the situation is moving toward crisis.
Link to observable intelligence trends identified above.

---
Maintain academic objectivity. Cite specific intelligence events and data. Avoid generalities.`;
    }

    return `你是一位具有20年資歷的亞太安全與台海戰略專家，曾任職於智庫（RAND/CSIS/ASPI等）。
請根據以下**最新即時情報**及你的專業知識，用**繁體中文**撰寫一份台海局勢深度分析報告。

分析生成時間：${now}
台海相關情報：${tw.length} 條 ｜ 戰略背景情報：${ctxEvents.length} 條

---

## 一、台海直接相關情報（${tw.length} 條，含完整摘要）

${twLines || "（目前無台海相關即時情報，請依整體背景知識分析）"}

---

## 二、戰略背景情報（中國/美軍/周邊動態，${ctxEvents.length} 條）

${ctxLines || "（無額外戰略背景事件）"}

---

## 三、OSINT 社群參考視角（台海/印太專項）

以下為專注台海與印太安全的頂尖 OSINT 分析師，分析時請模擬這些專家的觀點與方法論：

| 帳號 | 專長 | 分析重點 |
|------|------|---------|
| @trbrtc | 台灣/解放軍OSINT | PLA東部戰區動態、灰色地帶行動識別 |
| @HawkingAviator | 軍用航空情報 | PLAAF任務模式、ADIZ侵入分析 |
| @IntelCrab | 全球OSINT | 印太事件多源交叉比對 |
| @IndoPacificNow | 印太即時動態 | 美日澳盟友動向、多邊安全架構 |
| @noclador | 海事追蹤 | PLAN艦隊動向、台海海上態勢 |
| @DFRLab | 認知作戰 | 中共對台資訊戰、選舉干預手法 |
| @bellingcatint | 開源核實 | 衛星影像分析、解放軍部署核實 |

---

## 分析框架

請依序完成以下六個分析面向，每個面向以 ### 開頭，務必**充分引用上方情報事件**作為論據：

### 一、當前局勢總體評估
從戰略層次評估台海現況：習近平政策取向、解放軍戰備狀態、美台關係動態。
每項判斷標注可信度：**【HIGH】** 多源佐證 / **【MODERATE】** 部分佐證 / **【LOW】** 單源推斷
（150字以內，精準犀利）

### 二、解放軍近期軍事行動分析
基於上方情報，分析PLA東部戰區的演訓模式、海空軍動向、飛彈部署、新型武器裝備進展。
評估這些行動是否超出「例行性」範疇，是否存在實戰準備跡象。
引用具體情報事件作為證據。

### 三、灰色地帶戰術識別
辨識中共當前使用的非軍事脅迫手段，並結合上方情報進行具體舉例：
- 認知作戰與假訊息操作
- 網路與關鍵基礎設施攻擊
- 海上騷擾（海警船、漁船民兵）
- 外交、經濟施壓
- 法律戰（三戰）

### 四、美日盟友嚇阻態勢評估
結合上方美軍/日本相關情報，評估美國「戰略模糊」政策現況、美日同盟的台海承諾、
前沿軍事部署（航母/潛艦/陸基飛彈）對中共的嚇阻效果。

### 五、情境風險評估（未來12個月）
依據當前情報指標，評估以下四種情境的可能性（給出百分比估計）：
1. 灰色地帶持續升溫
2. 局部海上封鎖
3. 飛彈威懾打擊
4. 全面軍事行動
並說明觸發各情境的關鍵因素（紅線事件）。

### 六、分析師警示
列出3-5個值得立即關注的「早期預警信號」（leading indicators），
如果這些信號出現，代表局勢正在向危機方向發展。
盡量連結到上方已觀察到的情報趨勢。

---
請保持分析的學術客觀性，援引上方具體情報事件與數據，避免空泛論斷。`;
  },

  // ── Render Full Taiwan Tab ────────────────────────────────────────────────
  render(events, mndData) {
    this._renderGauge(events, mndData);
    this._renderMNDSummary(mndData);
    this._renderThreatDimensions();
    this._renderScenarios();
    this._renderWatchIndicators(mndData);
    this._renderAuthSources();
  },

  _renderGauge(events, mndData) {
    const index = this.calculateTensionIndex(events, mndData);
    const label = this.tensionLabel(index);

    const fill = document.getElementById("gauge-fill");
    const val  = document.getElementById("gauge-value");
    const tw   = events.filter(e => e.isTaiwan).length;

    if (fill) setTimeout(() => { fill.style.width = index + "%"; }, 120);
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const basedOn = isEn ? `based on ${tw} live events` : `基於 ${tw} 條即時情報`;
    if (val)  val.innerHTML =
      `<span style="color:${label.color};font-weight:700;font-size:16px">${label.text}</span>` +
      `&nbsp; <span style="font-family:var(--mono);font-size:13px">${index} / 100</span>` +
      `<span style="font-size:11px;color:var(--text3);margin-left:8px">${basedOn}</span>`;
  },

  _renderMNDSummary(mndData) {
    const c = document.getElementById("taiwan-mnd-summary");
    if (!c) return;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";

    if (!mndData) {
      c.innerHTML = `<div class="mnd-card mnd-unavailable">
        <span class="mnd-label">${isEn ? "MND Daily Report" : "國防部今日公告"}</span>
        <span class="mnd-na">${isEn ? "Data unavailable" : "資料載入中"}</span>
      </div>`;
      return;
    }

    const ac    = mndData.aircraft;
    const ships = mndData.ships;
    const acColor = ac >= 20 ? "var(--critical)" : ac >= 10 ? "var(--high)" : ac >= 5 ? "var(--medium)" : "var(--low)";
    const medLine = mndData.medianLineCrossing;
    const adiz    = mndData.adizViolation;

    const acText    = ac    !== null && ac    !== undefined ? `${ac} ${isEn ? "sorties" : "架次"}` : "—";
    const adizText  = mndData.adizCount != null ? `${mndData.adizCount} ${isEn ? "sorties" : "架次"}` : (mndData.adizViolation ? (isEn ? "Yes" : "有") : "—");
    const shipText  = ships !== null && ships !== undefined ? `${ships} ${isEn ? "ships"   : "艘"}`   : "—";
    const typesHtml = mndData.types?.length
      ? `<div class="mnd-types">${mndData.types.map(t => `<span class="hotspot-tag">${t}</span>`).join("")}</div>`
      : "";

    c.innerHTML = `
      <div class="mnd-card">
        <div class="mnd-header">
          <span class="mnd-label">${isEn ? "MND Daily PLA Report" : "國防部每日共軍動態"}</span>
          <span class="mnd-date">${mndData.reportDate || ""}</span>
          <a class="mnd-src-link" href="${isEn && mndData.urlEn ? mndData.urlEn : mndData.url}" target="_blank" rel="noopener">→ ${isEn ? "Source" : "原文"}</a>
        </div>
        <div class="mnd-metrics">
          <div class="mnd-metric">
            <span class="mnd-metric-label">${isEn ? "Aircraft" : "飛機架次"}</span>
            <span class="mnd-metric-val" style="color:${acColor}">${acText}</span>
          </div>
          <div class="mnd-metric">
            <span class="mnd-metric-label">${isEn ? "Ships" : "艦船"}</span>
            <span class="mnd-metric-val">${shipText}</span>
          </div>
          <div class="mnd-metric">
            <span class="mnd-metric-label">${isEn ? "Median Line" : "海峽中線"}</span>
            <span class="mnd-metric-val" style="color:${medLine ? "var(--critical)" : "var(--low)"}">
              ${medLine ? (isEn ? "Crossed" : "⚠ 逾越") : (isEn ? "No" : "未逾越")}
            </span>
          </div>
          <div class="mnd-metric">
            <span class="mnd-metric-label">${isEn ? "ADIZ Intrusion" : "ADIZ 侵入"}</span>
            <span class="mnd-metric-val" style="color:${adiz ? "var(--high)" : "var(--low)"}">
              ${adizText}
            </span>
          </div>
        </div>
        ${typesHtml}
        ${(() => { const s = isEn && mndData.summaryEn ? mndData.summaryEn : mndData.summary; return s ? `<div class="mnd-summary">${s}</div>` : ""; })()}
      </div>`;
  },

  _renderThreatDimensions() {
    const c = document.getElementById("taiwan-threat-dims");
    if (!c) return;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const levelLabel = isEn
      ? { critical:"Very High", high:"High", medium:"Med" }
      : { critical:"極高", high:"高", medium:"中" };
    c.innerHTML = this.threatDimensions.map(d => `
      <div class="tw-dim-card">
        <div class="tw-dim-header">
          <span class="tw-dim-icon">${d.icon}</span>
          <span class="tw-dim-label">${isEn && d.labelEn ? d.labelEn : d.label}</span>
          <span class="tw-dim-badge tw-dim-${d.level}">${levelLabel[d.level] || d.level}</span>
        </div>
        <div class="tw-dim-bar-wrap">
          <div class="tw-dim-bar tw-bar-${d.level}" style="width:${d.score}%"></div>
          <span class="tw-dim-score">${d.score}</span>
        </div>
        <div class="tw-dim-desc">${isEn && d.descEn ? d.descEn : d.desc}</div>
      </div>`).join("");
  },

  _renderScenarios() {
    const c = document.getElementById("taiwan-scenarios");
    if (!c) return;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    c.innerHTML = this.scenarios.map(s => {
      const displayLabel = isEn && s.labelEn ? s.labelEn : s.label;
      const displayHorizon = isEn && s.horizonEn ? s.horizonEn : s.horizon;
      const displayDesc = isEn && s.descEn ? s.descEn : s.desc;
      const displayIndicators = isEn && s.indicatorsEn ? s.indicatorsEn : s.indicators;
      return `
      <div class="tw-scenario">
        <div class="tw-scenario-header">
          <span class="tw-scenario-label">${displayLabel}</span>
          <div class="tw-scenario-meta">
            <span class="tw-scenario-horizon">${displayHorizon}</span>
            <span class="tw-scenario-prob" style="color:${s.color}">${s.prob}%</span>
          </div>
        </div>
        <div class="tw-scenario-bar-wrap">
          <div class="tw-scenario-bar" style="width:${s.prob}%;background:${s.color}"></div>
        </div>
        <div class="tw-scenario-desc">${displayDesc}</div>
        <div class="tw-scenario-indicators">
          ${displayIndicators.map(i=>`<span class="hotspot-tag">▸ ${i}</span>`).join("")}
        </div>
      </div>`;
    }).join("");
  },

  _renderWatchIndicators(mndData) {
    const c = document.getElementById("taiwan-indicators");
    if (!c) return;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const statusLabel = isEn
      ? { critical:"Critical", high:"High", elevated:"Elevated", active:"Active", normal:"Normal" }
      : { critical:"極高", high:"高危", elevated:"升高", active:"活躍", normal:"正常" };

    // Override ADIZ indicator with live MND data
    const indicators = this.watchIndicators.map(ind => {
      if (ind.label === "ADIZ侵入頻率" && mndData?.aircraft !== null && mndData?.aircraft !== undefined) {
        const ac = mndData.aircraft;
        const liveStatus = ac >= 20 ? "critical" : ac >= 10 ? "high" : ac >= 5 ? "elevated" : "active";
        const liveDesc   = isEn
          ? `Today: ${ac} sorties${mndData.medianLineCrossing ? ", median line crossed" : ""}`
          : `今日 ${ac} 架次${mndData.medianLineCrossing ? "，逾越中線" : ""}`;
        return { ...ind, status: liveStatus, desc: liveDesc, descEn: liveDesc };
      }
      return ind;
    });

    c.innerHTML = indicators.map(ind => `
      <div class="indicator-row">
        <span class="indicator-label">
          ${isEn && ind.labelEn ? ind.labelEn : ind.label}
          <span class="ind-src">${ind.src}</span>
        </span>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="indicator-desc">${isEn && ind.descEn ? ind.descEn : ind.desc}</span>
          <span class="indicator-value ind-${ind.status}">
            ${statusLabel[ind.status] || ind.status}
          </span>
        </div>
      </div>`).join("");
  },

  _renderAuthSources() {
    const c = document.getElementById("taiwan-auth-sources");
    if (!c) return;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const tier1 = this.authSources.filter(s => s.tier === 1);
    const tier2 = this.authSources.filter(s => s.tier === 2);
    const group = (title, items) => `
      <div class="tw-src-group">
        <div class="tw-src-group-title">${title}</div>
        ${items.map(s => `
          <a class="tw-src-item" href="${s.url}" target="_blank" rel="noopener">
            <div class="tw-src-main">
              <span class="tw-src-name">${s.name}</span>
              <span class="tw-src-badges">
                <span class="tw-src-type">${isEn && s.typeEn ? s.typeEn : s.type}</span>
                <span class="tw-src-lang">${s.lang}</span>
              </span>
            </div>
            <div class="tw-src-desc">${isEn && s.descEn ? s.descEn : s.desc}</div>
          </a>`).join("")}
      </div>`;
    c.innerHTML = group(t("tier1"), tier1) + group(t("tier2"), tier2);
  },
};
