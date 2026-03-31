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
  // Scale: 0-44 = Stable | 45-64 = High | 65-84 = Very High | 85+ = Critical
  // Calibration target: routine PLA activity (~10-15 sorties, ADIZ) → ~55
  //                     median line crossing + surge → ~70-80
  //                     large-scale exercise / confirmed escalation → 85+
  calculateTensionIndex(events, mndData) {
    const tw = (events || []).filter(e => e.isTaiwan);

    // Event contribution — use sqrt scaling so volume of news has diminishing returns.
    // A spike of unique critical events matters; routine high-vol doesn't inflate it.
    const critCount = tw.filter(e => e.severity === "critical").length;
    const highCount = tw.filter(e => e.severity === "high").length;
    const medCount  = tw.filter(e => e.severity === "medium").length;
    const eventScore = Math.min(25,
      critCount * 6 +
      Math.sqrt(highCount) * 4 +
      Math.sqrt(medCount) * 1.5
    );

    // Base: 38 — represents the structural background tension that always exists
    let score = 38 + eventScore;

    // MND PLA activity — calibrated to realistic norms for the Taiwan Strait
    // 1–9 sorties: below-average, 10–19: elevated but routine,
    // 20–29: significant surge, 30+: major exercise-level
    if (mndData) {
      const ac = mndData.aircraft;
      if (ac != null) {
        score += ac >= 30 ? 15 : ac >= 20 ? 10 : ac >= 10 ? 4 : ac >= 1 ? 1 : 0;
      }
      if (mndData.medianLineCrossing) score += 12; // Strong escalation signal
      if (mndData.adizViolation)      score += 3;  // Notable but now routine
      const ships = mndData.ships || 0;
      if (ships >= 10) score += 6;
      else if (ships >= 5) score += 2;
    }

    return Math.round(Math.min(95, score));
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
  render(events, mndData, history, mndHistory, playbackData, earlyWarning) {
    const h   = history    || [];
    const mh  = mndHistory || [];
    const idx = this.calculateTensionIndex(events, mndData);

    this._renderGauge(events, mndData, playbackData);
    this._renderAnomalyBanner(h, mh, mndData, playbackData);
    this._renderEarlyWarningRadar(earlyWarning, h, mh, mndData, events);
    this._renderMNDSummary(mndData, playbackData);
    this._renderMNDChart(mh, playbackData);
    this._renderTensionChart(h, playbackData);
    this._fetchAndRenderGDELT(); // async, fire-and-forget
    this._renderThreatDimensions();
    const dynProbs = this._computeDynamicScenarios(idx, h, mh);
    this._renderScenarios(dynProbs);
    this._renderWatchIndicators(mndData);
    this._renderAuthSources();
    if (playbackData) this._renderPlaybackEvents(playbackData);
  },

  _renderGauge(events, mndData, playbackData) {
    const index = playbackData
      ? (playbackData.tensionIndex || 42)
      : this.calculateTensionIndex(events, mndData);
    const label = this.tensionLabel(index);

    const fill = document.getElementById("gauge-fill");
    const val  = document.getElementById("gauge-value");
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";

    if (fill) setTimeout(() => { fill.style.width = index + "%"; }, 120);

    let basedOn;
    if (playbackData) {
      basedOn = isEn ? `archived snapshot · ${playbackData.date}` : `歷史存檔 · ${playbackData.date}`;
    } else {
      const tw = events.filter(e => e.isTaiwan).length;
      basedOn = isEn ? `based on ${tw} live events` : `基於 ${tw} 條即時情報`;
    }
    if (val) val.innerHTML =
      `<span style="color:${label.color};font-weight:700;font-size:16px">${label.text}</span>` +
      `&nbsp; <span style="font-family:var(--mono);font-size:13px">${index} / 100</span>` +
      `<span style="font-size:11px;color:var(--text3);margin-left:8px">${basedOn}</span>`;
  },

  _renderMNDSummary(mndData, playbackData) {
    // In playback mode, substitute archived MND snapshot
    if (playbackData && playbackData.aircraft !== undefined) {
      mndData = {
        aircraft:           playbackData.aircraft,
        ships:              playbackData.ships,
        adizViolation:      playbackData.adizViolation,
        adizCount:          playbackData.adizCount,
        medianLineCrossing: playbackData.medianLineCrossing,
        reportDate:         playbackData.date,
        summary: null, summaryEn: null, url: null, urlEn: null,
      };
    }
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
              ${medLine
                ? (mndData.medianLineCrossings != null
                    ? `⚠ ${mndData.medianLineCrossings} ${isEn ? "sorties" : "架次"}`
                    : (isEn ? "⚠ Crossed" : "⚠ 逾越"))
                : (isEn ? "No" : "未逾越")}
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

  // ── MND Activity Trend Chart (30-day bar chart) ───────────────────────────
  _renderMNDChart(history, playbackData) {
    const noData = document.getElementById("mnd-chart-no-data");
    const canvas = document.getElementById("mnd-trend-chart");
    if (!canvas) return;

    if (!history || history.length < 2) {
      canvas.style.display = "none";
      if (noData) { noData.classList.add("visible"); noData.textContent = t("tw_chart_no_data"); }
      return;
    }
    if (noData) noData.classList.remove("visible");
    canvas.style.display = "block";

    const dpr  = window.devicePixelRatio || 1;
    const W    = canvas.parentElement.clientWidth - 28;
    if (W <= 0) return; // tab hidden — will redraw when tab becomes visible
    const H    = 100;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const PAD = { t: 8, r: 8, b: 22, l: 28 };
    const cW = W - PAD.l - PAD.r;
    const cH = H - PAD.t - PAD.b;

    // Background
    ctx.fillStyle = "#0e1425";
    ctx.fillRect(0, 0, W, H);

    const maxAC = Math.max(1, ...history.map(d => d.aircraft || 0));
    const barW  = Math.max(2, cW / history.length - 2);

    history.forEach((d, i) => {
      const x   = PAD.l + i * (cW / history.length);
      const ac  = d.aircraft || 0;
      const bH  = Math.max(2, (ac / Math.max(maxAC, 10)) * cH);
      const y   = PAD.t + cH - bH;

      // Bar color based on aircraft count
      ctx.fillStyle = ac >= 20 ? "#ff3b3b" : ac >= 10 ? "#ff8c00" : ac >= 5 ? "#f0c020" : "#2a7fff55";
      ctx.fillRect(x, y, barW, bH);

      // Median line crossing marker (orange dot above bar)
      if (d.medianLineCrossing) {
        ctx.beginPath();
        ctx.arc(x + barW / 2, y - 5, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ff8c00";
        ctx.fill();
      }
      // ADIZ violation marker (red dot)
      if (d.adizViolation && !d.medianLineCrossing) {
        ctx.beginPath();
        ctx.arc(x + barW / 2, y - 5, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ff3b3b";
        ctx.fill();
      }
    });

    // X-axis date labels (every ~7 entries)
    ctx.fillStyle = "#4a6090";
    ctx.font = `${9 * dpr / dpr}px JetBrains Mono, monospace`;
    ctx.textAlign = "center";
    const step = Math.max(1, Math.floor(history.length / 5));
    history.forEach((d, i) => {
      if (i % step === 0 || i === history.length - 1) {
        const x = PAD.l + i * (cW / history.length) + barW / 2;
        ctx.fillText(d.date ? d.date.slice(5) : "", x, H - 6);
      }
    });

    // Y-axis max label
    ctx.textAlign = "right";
    ctx.fillText(maxAC, PAD.l - 3, PAD.t + 8);
    ctx.fillText("0", PAD.l - 3, PAD.t + cH);

    // Legend
    ctx.textAlign = "left";
    ctx.fillStyle = "#4a6090";
    ctx.font = `9px JetBrains Mono, monospace`;
    ctx.fillText("架次", 2, PAD.t + 8);
  },

  // ── Tension Index Trend Chart (30-day line chart) ─────────────────────────
  _renderTensionChart(history, playbackData) {
    const noData = document.getElementById("tension-chart-no-data");
    const canvas = document.getElementById("tension-trend-chart");
    if (!canvas) return;

    if (!history || history.length < 2) {
      canvas.style.display = "none";
      if (noData) { noData.classList.add("visible"); noData.textContent = t("tw_chart_no_data"); }
      return;
    }
    if (noData) noData.classList.remove("visible");
    canvas.style.display = "block";

    const dpr  = window.devicePixelRatio || 1;
    const W    = canvas.parentElement.clientWidth - 28;
    if (W <= 0) return; // tab hidden — will redraw when tab becomes visible
    const H    = 100;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const PAD = { t: 8, r: 8, b: 22, l: 32 };
    const cW = W - PAD.l - PAD.r;
    const cH = H - PAD.t - PAD.b;

    // Background
    ctx.fillStyle = "#0e1425";
    ctx.fillRect(0, 0, W, H);

    // Reference lines at 45, 65, 85
    const refs = [
      { val: 85, color: "#ff3b3b33", label: "85" },
      { val: 65, color: "#ff8c0033", label: "65" },
      { val: 45, color: "#f0c02033", label: "45" },
    ];
    refs.forEach(r => {
      const y = PAD.t + cH - (r.val / 100) * cH;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(PAD.l, y);
      ctx.lineTo(W - PAD.r, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#4a6090";
      ctx.font = `9px JetBrains Mono, monospace`;
      ctx.textAlign = "right";
      ctx.fillText(r.label, PAD.l - 3, y + 3);
    });

    // Gradient fill under line
    const pts = history.map((d, i) => ({
      x: PAD.l + i * (cW / (history.length - 1)),
      y: PAD.t + cH - ((d.tensionIndex || 42) / 100) * cH,
    }));

    const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + cH);
    grad.addColorStop(0, "rgba(42,127,255,0.35)");
    grad.addColorStop(1, "rgba(42,127,255,0.02)");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, PAD.t + cH);
    ctx.lineTo(pts[0].x, PAD.t + cH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = "#2a7fff";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Dots at each data point
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#2a7fff";
      ctx.fill();
    });

    // X-axis date labels
    ctx.fillStyle = "#4a6090";
    ctx.font = `9px JetBrains Mono, monospace`;
    ctx.textAlign = "center";
    const step = Math.max(1, Math.floor(history.length / 5));
    history.forEach((d, i) => {
      if (i % step === 0 || i === history.length - 1) {
        const x = PAD.l + i * (cW / (history.length - 1));
        ctx.fillText(d.date ? d.date.slice(5) : "", x, H - 6);
      }
    });

    // Playback vertical marker
    if (playbackData?.date) {
      const pbIdx = history.findIndex(d => d.date === playbackData.date);
      if (pbIdx >= 0) {
        const xPb = PAD.l + pbIdx * (cW / Math.max(history.length - 1, 1));
        ctx.strokeStyle = "#ff8c00";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(xPb, PAD.t);
        ctx.lineTo(xPb, PAD.t + cH);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  },

  // ── GDELT Media Volume + Tone Trend (client-side fetch) ───────────────────
  async _fetchAndRenderGDELT() {
    const canvas  = document.getElementById("gdelt-trend-chart");
    const noData  = document.getElementById("gdelt-chart-no-data");
    if (!canvas) return;

    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";

    // Show loading state
    canvas.style.display = "none";
    if (noData) { noData.classList.add("visible"); noData.textContent = t("tw_chart_loading"); }

    try {
      // Fetch volume and tone in parallel
      const base = "https://api.gdeltproject.org/api/v2/doc/doc";
      const common = "query=Taiwan+strait+PLA+military&timespan=30d&format=json&smoothing=5";
      const ctrl = new AbortController();
      const tid  = setTimeout(() => ctrl.abort(), 35000);

      // GDELT enforces 5s between requests — fetch sequentially
      const volRes  = await fetch(`${base}?${common}&mode=timelinevol`,  { signal: ctrl.signal });
      await new Promise(r => setTimeout(r, 5500));
      const toneRes = await fetch(`${base}?${common}&mode=timelinesent`, { signal: ctrl.signal });
      clearTimeout(tid);

      // Parse and aggregate hourly GDELT data into daily buckets
      const parseGDELT = async (res, agg = "avg") => {
        if (!res.ok) return null;
        const text = await res.text();
        if (!text.trim().startsWith("{")) return null;
        const data = JSON.parse(text);
        const raw = data?.timeline?.[0]?.data;
        if (!raw) return null;
        // Aggregate by day (date key = YYYYMMDD)
        const byDay = {};
        for (const pt of raw) {
          const day = pt.date.slice(0, 8);
          if (!byDay[day]) byDay[day] = [];
          byDay[day].push(pt.value);
        }
        return Object.entries(byDay)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([day, vals]) => ({
            date: day, // keep "YYYYMMDD" format for draw function
            value: agg === "sum"
              ? vals.reduce((s, v) => s + v, 0)
              : vals.reduce((s, v) => s + v, 0) / vals.length,
          }));
      };

      const volDataRaw  = await parseGDELT(volRes,  "sum");
      const toneDataRaw = await parseGDELT(toneRes, "avg");
      const [volData, toneData] = [volDataRaw, toneDataRaw];

      if (!volData || volData.length < 2) throw new Error("No GDELT volume data");

      if (noData) noData.classList.remove("visible");
      canvas.style.display = "block";
      this._drawGDELTChart(canvas, volData, toneData, isEn);

    } catch (err) {
      console.warn("GDELT fetch failed:", err.message);
      if (noData) { noData.textContent = t("tw_gdelt_fail"); }
    }
  },

  _drawGDELTChart(canvas, volData, toneData, isEn) {
    const dpr  = window.devicePixelRatio || 1;
    const W    = canvas.parentElement.clientWidth - 28;
    const hasTone = toneData && toneData.length >= 2;
    const H    = hasTone ? 180 : 100;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const PAD    = { t: 16, r: 10, b: 24, l: 44 };
    const cW     = W - PAD.l - PAD.r;
    const volH   = hasTone ? Math.floor((H - PAD.t - PAD.b) * 0.52) : H - PAD.t - PAD.b;
    const toneH  = hasTone ? (H - PAD.t - PAD.b - volH - 8) : 0;
    const divY   = PAD.t + volH + 4;

    ctx.fillStyle = "#0e1425";
    ctx.fillRect(0, 0, W, H);

    // ── Volume panel ─────────────────────────────────────────────────────────
    const n       = volData.length;
    const volVals = volData.map(d => d.value || 0);
    const minVol  = Math.min(...volVals);
    const maxVol  = Math.max(...volVals);
    // Use relative scale (min→max) so fluctuations are visible
    const volRange = (maxVol - minVol) || maxVol || 1;

    const volPts = volData.map((d, i) => ({
      x:    PAD.l + i * (cW / Math.max(n - 1, 1)),
      y:    PAD.t + volH - ((d.value || 0) - minVol) / volRange * volH,
      date: (d.date || "").slice(0, 8),
      val:  d.value || 0,
    }));

    const gradVol = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + volH);
    gradVol.addColorStop(0, "rgba(255,140,0,0.45)");
    gradVol.addColorStop(1, "rgba(255,140,0,0.03)");
    ctx.beginPath();
    ctx.moveTo(volPts[0].x, volPts[0].y);
    volPts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(volPts[n - 1].x, PAD.t + volH);
    ctx.lineTo(volPts[0].x,     PAD.t + volH);
    ctx.closePath();
    ctx.fillStyle = gradVol;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "#ff8c00";
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    volPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Vol label + Y-axis values
    ctx.fillStyle = "#ff8c0099";
    ctx.font = `9px JetBrains Mono, monospace`;
    ctx.textAlign = "left";
    ctx.fillText(isEn ? "▲ Media Volume (rel.)" : "▲ 媒體聲量（相對）", PAD.l + 4, PAD.t + 11);
    ctx.textAlign = "right";
    ctx.fillStyle = "#4a6090";
    ctx.fillText(maxVol.toFixed(3), PAD.l - 3, PAD.t + 10);
    ctx.fillText(minVol.toFixed(3), PAD.l - 3, PAD.t + volH);

    // Divider + Tone panel
    if (hasTone) {
      const toneTop = divY;

      // Divider
      ctx.strokeStyle = "#1e2d4a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD.l, toneTop);
      ctx.lineTo(W - PAD.r, toneTop);
      ctx.stroke();

      const toneN    = toneData.length;
      const toneVals = toneData.map(d => d.value || 0);
      const avgTone  = toneVals.reduce((s, v) => s + v, 0) / toneVals.length;
      const minTone  = Math.min(...toneVals);
      const maxTone  = Math.max(...toneVals);
      const range    = (maxTone - minTone) || 1;
      // zero line y within tone panel (tone=0 position)
      const zeroFrac = maxTone / range; // fraction from top
      const zeroY    = toneTop + zeroFrac * toneH;

      // Zero reference line
      ctx.strokeStyle = "#253660";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(PAD.l, zeroY);
      ctx.lineTo(W - PAD.r, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);

      const tonePts = toneData.map((d, i) => ({
        x:   PAD.l + i * (cW / Math.max(toneN - 1, 1)),
        y:   toneTop + (1 - ((d.value || 0) - minTone) / range) * toneH,
        val: d.value || 0,
      }));

      // Filled area
      ctx.beginPath();
      ctx.moveTo(tonePts[0].x, tonePts[0].y);
      tonePts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(tonePts[toneN - 1].x, zeroY);
      ctx.lineTo(tonePts[0].x, zeroY);
      ctx.closePath();
      const gradTone = ctx.createLinearGradient(0, toneTop, 0, toneTop + toneH);
      if (avgTone < 0) {
        gradTone.addColorStop(0, "rgba(255,59,59,0.05)");
        gradTone.addColorStop(1, "rgba(255,59,59,0.35)");
      } else {
        gradTone.addColorStop(0, "rgba(42,127,255,0.35)");
        gradTone.addColorStop(1, "rgba(42,127,255,0.05)");
      }
      ctx.fillStyle = gradTone;
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = avgTone < 0 ? "#ff3b3b" : "#2a7fff";
      ctx.lineWidth = 1.8;
      ctx.lineJoin = "round";
      tonePts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Tone label
      const toneColor = avgTone < 0 ? "#ff3b3b" : "#2a7fff";
      ctx.fillStyle = toneColor + "99";
      ctx.font = `9px JetBrains Mono, monospace`;
      ctx.textAlign = "left";
      const toneDesc = avgTone < 0
        ? (isEn ? "▼ Tone: Alarming" : "▼ 情緒：緊張/負面")
        : (isEn ? "▲ Tone: Calm"     : "▲ 情緒：平靜/正面");
      ctx.fillText(toneDesc, PAD.l + 4, toneTop + 11);

      // Tone Y-axis min/max labels
      ctx.fillStyle = "#4a6090";
      ctx.textAlign = "right";
      ctx.fillText(maxTone.toFixed(2), PAD.l - 3, toneTop + 10);
      ctx.fillText(minTone.toFixed(2), PAD.l - 3, toneTop + toneH - 2);
      // Zero label
      if (zeroY > toneTop + 12 && zeroY < toneTop + toneH - 8) {
        ctx.fillText("0", PAD.l - 3, zeroY + 3);
      }
    }

    // X-axis date labels (shared)
    ctx.fillStyle = "#4a6090";
    ctx.font = `9px JetBrains Mono, monospace`;
    ctx.textAlign = "center";
    const step = Math.max(1, Math.floor(n / 6));
    volPts.forEach((p, i) => {
      if (i % step === 0 || i === n - 1) {
        const d = p.date;
        const label = d.length >= 8 ? `${d.slice(4,6)}/${d.slice(6,8)}` : "";
        ctx.fillText(label, p.x, H - 6);
      }
    });
  },

  // ── Feature A: Anomaly Detection Banner ──────────────────────────────────
  _renderAnomalyBanner(history, mndHistory, mndData, playbackData) {
    const el = document.getElementById("anomaly-banner");
    if (!el) return;
    el.className = "anomaly-banner";
    el.textContent = "";

    // Need at least 3 data points to be meaningful
    if (!history || history.length < 3 || playbackData) return;

    const recent  = history.slice(-7).map(d => d.tensionIndex || 42);
    const current = history[history.length - 1]?.tensionIndex
                    ?? this.calculateTensionIndex([], mndData);
    const prev    = recent.slice(0, -1); // exclude today
    if (prev.length < 2) return;

    const mean   = prev.reduce((s, v) => s + v, 0) / prev.length;
    const stddev = Math.sqrt(prev.reduce((s, v) => s + (v - mean) ** 2, 0) / prev.length);
    if (stddev < 1) return; // Too stable to measure anomaly meaningfully

    const sigma = ((current - mean) / stddev).toFixed(1);
    const delta = Math.round(current - mean);

    if (sigma >= 1.5) {
      el.classList.add("anomaly-up");
      el.textContent = t("anomaly_up", delta, sigma);
    } else if (sigma <= -1.5) {
      el.classList.add("anomaly-down");
      el.textContent = t("anomaly_down", delta, sigma);
    }
  },

  // ── Feature B: Dynamic Scenario Probability ───────────────────────────────
  _computeDynamicScenarios(tensionIndex, history, mndHistory) {
    // Base probabilities (long-term Taiwan Strait background)
    const base = { gray_zone: 55, blockade: 18, missile: 15, invasion: 12 };
    const adj  = { gray_zone: 0,  blockade: 0,  missile: 0,  invasion: 0  };

    // Tension-index adjustments
    if (tensionIndex > 80) {
      adj.blockade += 6; adj.missile += 4; adj.invasion += 3; adj.gray_zone -= 13;
    } else if (tensionIndex > 65) {
      adj.blockade += 3; adj.missile += 2; adj.gray_zone -= 5;
    } else if (tensionIndex < 45) {
      adj.gray_zone += 8; adj.blockade -= 3; adj.missile -= 3; adj.invasion -= 2;
    }

    // Median line crossings in last 7 days
    const recentMND = (mndHistory || []).slice(-7);
    const medianCrossings = recentMND.filter(d => d.medianLineCrossing).length;
    if (medianCrossings >= 2) { adj.blockade += 5; adj.missile += 3; }
    else if (medianCrossings === 1) { adj.blockade += 2; adj.missile += 1; }

    // Aircraft surge (7-day average)
    if (recentMND.length > 0) {
      const avgAC = recentMND.reduce((s, d) => s + (d.aircraft || 0), 0) / recentMND.length;
      if (avgAC > 30) { adj.missile += 3; adj.invasion += 3; }
      else if (avgAC > 20) { adj.missile += 4; adj.blockade += 2; }
    }

    // Cap adjustments at ±15 per scenario
    const MAX_ADJ = 15;
    for (const k of Object.keys(adj)) {
      adj[k] = Math.max(-MAX_ADJ, Math.min(MAX_ADJ, adj[k]));
    }

    // Compute raw values and normalize to 100%
    const raw   = {};
    for (const k of Object.keys(base)) raw[k] = Math.max(1, base[k] + adj[k]);
    const total = Object.values(raw).reduce((s, v) => s + v, 0);
    const probs = {};
    for (const k of Object.keys(raw)) probs[k] = Math.round((raw[k] / total) * 100);

    // Fix rounding drift
    const sum = Object.values(probs).reduce((s, v) => s + v, 0);
    probs.gray_zone += (100 - sum);

    // Return map of scenario id → { prob, delta }
    return {
      gray_zone: { prob: probs.gray_zone, delta: probs.gray_zone - base.gray_zone },
      blockade:  { prob: probs.blockade,  delta: probs.blockade  - base.blockade  },
      missile:   { prob: probs.missile,   delta: probs.missile   - base.missile   },
      invasion:  { prob: probs.invasion,  delta: probs.invasion  - base.invasion  },
    };
  },

  // ── Feature C helpers ─────────────────────────────────────────────────────
  _renderPlaybackEvents(playbackData) {
    const c = document.getElementById("taiwan-events");
    if (!c || !playbackData?.topEvents?.length) return;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const label = isEn ? t("tw_playback_events") : t("tw_playback_events");
    c.innerHTML =
      `<div class="tw-section-title" style="margin-bottom:10px">${label}</div>` +
      playbackData.topEvents.map(e => `
        <div class="event-card severity-${e.severity}" style="cursor:default">
          <div class="event-top">
            <span class="severity-badge badge-${e.severity}">${e.severity}</span>
            <span class="event-title">${e.title}</span>
          </div>
          <div class="event-meta">
            <span class="event-source-tag">${e.source || ""}</span>
          </div>
        </div>`).join("");
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

  _renderScenarios(dynProbs) {
    const c = document.getElementById("taiwan-scenarios");
    if (!c) return;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    c.innerHTML = this.scenarios.map(s => {
      const displayLabel      = isEn && s.labelEn      ? s.labelEn      : s.label;
      const displayHorizon    = isEn && s.horizonEn    ? s.horizonEn    : s.horizon;
      const displayDesc       = isEn && s.descEn       ? s.descEn       : s.desc;
      const displayIndicators = isEn && s.indicatorsEn ? s.indicatorsEn : s.indicators;

      // Dynamic probability override
      const dyn   = dynProbs?.[s.id];
      const prob  = dyn ? dyn.prob  : s.prob;
      const delta = dyn ? dyn.delta : 0;
      const deltaHtml = (delta !== 0 && Math.abs(delta) >= 1)
        ? `<span class="scenario-delta ${delta > 0 ? "scenario-delta-up" : "scenario-delta-down"}">${delta > 0 ? "▲" : "▼"}${Math.abs(delta)}</span>`
        : "";

      return `
      <div class="tw-scenario">
        <div class="tw-scenario-header">
          <span class="tw-scenario-label">${displayLabel}</span>
          <div class="tw-scenario-meta">
            <span class="tw-scenario-horizon">${displayHorizon}</span>
            <span class="tw-scenario-prob" style="color:${s.color}">${prob}%${deltaHtml}</span>
          </div>
        </div>
        <div class="tw-scenario-bar-wrap">
          <div class="tw-scenario-bar" style="width:${prob}%;background:${s.color}"></div>
        </div>
        <div class="tw-scenario-desc">${displayDesc}</div>
        <div class="tw-scenario-indicators">
          ${displayIndicators.map(i=>`<span class="hotspot-tag">▸ ${i}</span>`).join("")}
        </div>
      </div>`;
    }).join("") +
    (dynProbs ? `<div class="scenario-dynamic-note">◎ ${t("scenario_dynamic_note")}</div>` : "");
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

  // ── Feature D: Early Warning Radar ───────────────────────────────────────
  _renderEarlyWarningRadar(ew, history, mndHistory, mndData, events) {
    const c = document.getElementById("tw-early-warning");
    if (!c) return;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";

    // ── Fallback: compute locally if API data absent ──────────────────────
    let ind = ew?.indicators || null;
    let composite = ew?.composite || null;

    if (!ind) {
      // Compute key indicators from local history
      const mh = mndHistory || [];
      const h  = history    || [];

      // median streak
      let median_streak = 0;
      for (let i = mh.length - 1; i >= 0; i--) {
        if (mh[i].medianLineCrossing) median_streak++; else break;
      }

      // tension trend
      const recent7 = h.slice(-7).map(d => d.tensionIndex || 0);
      const tension_slope = recent7.length >= 2 ? recent7[recent7.length-1] - recent7[0] : 0;

      // sortie surge
      const latestMND = mh[mh.length - 1] || {};
      const prev = mh.slice(-8, -1).map(d => d.aircraft).filter(v => v != null);
      const avg7 = prev.length ? prev.reduce((s,v)=>s+v,0)/prev.length : null;
      const sortiePct = (latestMND.aircraft != null && avg7)
        ? ((latestMND.aircraft - avg7) / avg7) * 100 : null;

      // event cluster 24h
      const cutoff = Date.now() - 86400000;
      const cluster = (events||[]).filter(e =>
        e.isTaiwan && (e.severity==="critical"||e.severity==="high") &&
        new Date(e.publishedAt).getTime() > cutoff
      ).length;

      ind = {
        sortie_surge:   { level: sortiePct!=null ? (sortiePct>=100?3:sortiePct>=50?2:sortiePct>=20?1:0) : 0,
                          value: latestMND.aircraft, avg7d: avg7?+avg7.toFixed(1):null, pctChange: sortiePct?+sortiePct.toFixed(0):null },
        median_streak:  { level: median_streak>=6?3:median_streak>=3?2:median_streak>=1?1:0, streak: median_streak },
        adiz_intensity: { level: 0, value: latestMND.adizCount },
        tension_trend:  { level: tension_slope>=12?3:tension_slope>=6?2:tension_slope>=2?1:0, slope: tension_slope },
        exercise_detect:{ level: 0, count7d: 0, titles: [] },
        pla_rhetoric:   { level: 0 },
        state_media:    { level: 0, count7d: 0 },
        event_cluster:  { level: cluster>=7?3:cluster>=4?2:cluster>=2?1:0, count24h: cluster },
      };
      const score = Object.values(ind).reduce((s,v) => s+(v.level||0), 0);
      composite = { score, maxScore: 24, level: score>=18?4:score>=13?3:score>=8?2:score>=3?1:0 };
    }

    // ── Level metadata ────────────────────────────────────────────────────
    const LEVEL_META = isEn
      ? [ { label:"Normal",    cls:"ew-l0", dot:"○" },
          { label:"Elevated",  cls:"ew-l1", dot:"◐" },
          { label:"High",      cls:"ew-l2", dot:"●" },
          { label:"Critical",  cls:"ew-l3", dot:"⬤" } ]
      : [ { label:"正常",      cls:"ew-l0", dot:"○" },
          { label:"輕度警戒",  cls:"ew-l1", dot:"◐" },
          { label:"中度警戒",  cls:"ew-l2", dot:"●" },
          { label:"高度警戒",  cls:"ew-l3", dot:"⬤" } ];

    const COMPOSITE_META = isEn
      ? ["Normal","Elevated","Moderate Alert","High Alert","Emergency"]
      : ["正常","輕度警戒","中度警戒","高度警戒","緊急預警"];

    const cl = composite?.level ?? 0;
    const compositeLabel = COMPOSITE_META[Math.min(cl, 4)];
    const compositeCls   = `ew-composite-l${Math.min(cl, 4)}`;

    // ── Indicator card helper ─────────────────────────────────────────────
    const card = (key, titleZh, titleEn, descFn) => {
      const d    = ind[key] || { level: 0 };
      const lv   = Math.min(d.level || 0, 3);
      const meta = LEVEL_META[lv];
      return `
        <div class="ew-card ew-card-l${lv}">
          <div class="ew-card-header">
            <span class="ew-dot ${meta.cls}">${meta.dot}</span>
            <span class="ew-card-title">${isEn ? titleEn : titleZh}</span>
            <span class="ew-card-badge ${meta.cls}">${meta.label}</span>
          </div>
          <div class="ew-card-body">${descFn(d, isEn)}</div>
        </div>`;
    };

    // ── Description functions per indicator ───────────────────────────────
    const desc = {
      sortie_surge: (d, en) => {
        if (d.value == null) return en ? "No data" : "無資料";
        const base = en ? `Today: ${d.value} sorties` : `今日: ${d.value} 架次`;
        if (d.avg7d == null) return base;
        const dir = (d.pctChange||0) >= 0 ? "▲" : "▼";
        const pct = Math.abs(d.pctChange||0);
        return `${base} · ${dir}${pct}% ${en?"vs 7-day avg":"較7日均值"} (${d.avg7d})`;
      },
      median_streak: (d, en) => {
        if (d.streak === 0) return en ? "No crossings recently" : "近期無逾越中線";
        return en
          ? `${d.streak} consecutive day${d.streak>1?"s":""} with median line crossing`
          : `連續 ${d.streak} 日偵測到逾越中線`;
      },
      adiz_intensity: (d, en) => {
        if (d.value == null) return en ? "No data" : "無資料";
        const base = en ? `Today: ${d.value} ADIZ intrusions` : `今日: ${d.value} 架次侵入ADIZ`;
        if (d.avg7d == null) return base;
        const dir = (d.pctChange||0) >= 0 ? "▲" : "▼";
        return `${base} · ${dir}${Math.abs(d.pctChange||0)}% ${en?"vs avg":"較均值"}`;
      },
      tension_trend: (d, en) => {
        const slope = d.slope || 0;
        if (Math.abs(slope) < 1) return en ? "Tension index stable over 7 days" : "7日緊張指數持平";
        const dir = slope > 0 ? "▲" : "▼";
        return en
          ? `${dir} ${Math.abs(slope)} pts change over 7 days`
          : `${dir} 7日緊張指數變化 ${Math.abs(slope)} 點`;
      },
      exercise_detect: (d, en) => {
        if (!d.count7d) return en ? "No exercise announcements in 7 days" : "過去7日無演習宣告偵測";
        const base = en
          ? `${d.count7d} exercise signal${d.count7d>1?"s":""} in 7 days`
          : `過去7日偵測到 ${d.count7d} 則演習相關訊號`;
        if (d.titles?.length) return `${base}: ${d.titles[0].slice(0,60)}...`;
        return base;
      },
      pla_rhetoric: (d, en) => {
        const labels = en
          ? ["No escalatory language detected","General cross-strait tension language","Stern warning / deadline language","Red line / ultimatum language"]
          : ["未偵測到升溫言論","一般緊張措辭","嚴正警告/期限言論","跨越紅線/最後通牒"];
        return labels[Math.min(d.level||0, 3)];
      },
      state_media: (d, en) => {
        if (!d.count7d) return en ? "Normal state media coverage" : "官媒台灣相關報導正常";
        return en
          ? `${d.count7d} Taiwan-focused items from state media in 7 days`
          : `過去7日官媒（環時/新華社）台灣相關報導 ${d.count7d} 則`;
      },
      event_cluster: (d, en) => {
        if (!d.count24h) return en ? "No high-severity Taiwan events in 24h" : "24小時內無台海高危事件";
        return en
          ? `${d.count24h} critical/high-severity Taiwan events in last 24h`
          : `24小時內偵測到 ${d.count24h} 則台海重大/高危事件`;
      },
    };

    // ── Context sentence ──────────────────────────────────────────────────
    const contextMsg = () => {
      const ex  = ind.exercise_detect?.level || 0;
      const rh  = ind.pla_rhetoric?.level    || 0;
      const ms  = ind.median_streak?.level   || 0;
      const tt  = ind.tension_trend?.level   || 0;
      if (cl >= 4) return isEn ? "⚠ Multiple critical signals detected. Elevated escalation risk." : "⚠ 多項關鍵指標觸發，升溫風險顯著提升。";
      if (cl >= 3) return isEn ? "⚠ Significant warning signals present across several indicators." : "⚠ 多項指標出現警示，需密切追蹤。";
      if (ex >= 2) return isEn ? "PLA exercise signals detected — monitor for escalation pattern." : "偵測到解放軍演習訊號，請追蹤是否形成升溫態勢。";
      if (rh >= 2) return isEn ? "Elevated CCP rhetoric — watch for follow-on military signals." : "偵測到升溫官方言論，注意後續軍事動態。";
      if (ms >= 2) return isEn ? "Sustained median line crossings — key gray zone escalation signal." : "連續逾越中線為灰色地帶升溫關鍵指標。";
      if (tt >= 2) return isEn ? "Tension index rising — cross-reference with MND activity data." : "緊張指數上升趨勢，建議對照MND每日數據。";
      return isEn ? "Current signals consistent with ongoing gray zone operations. No invasion/blockade indicators." : "當前信號符合灰色地帶常態。無封鎖/入侵前置跡象。";
    };

    c.innerHTML = `
      <div class="ew-panel">
        <div class="ew-panel-header">
          <span class="ew-panel-title">${isEn ? "◉ Early Warning Radar" : "◉ 多維預警雷達"}</span>
          <span class="ew-composite ${compositeCls}">
            ${LEVEL_META[Math.min(cl,3)].dot} ${compositeLabel}
            <span class="ew-score">${composite?.score ?? "?"}/${composite?.maxScore ?? 24}</span>
          </span>
        </div>

        <div class="ew-grid">
          <div class="ew-group">
            <div class="ew-group-title">${isEn ? "PLA Military Activity" : "PLA 軍事活動"}</div>
            ${card("sortie_surge",   "架次突波",    "Sortie Surge",      desc.sortie_surge)}
            ${card("median_streak",  "逾越中線連續","Median Line Streak", desc.median_streak)}
            ${card("adiz_intensity", "ADIZ 強度",   "ADIZ Intensity",    desc.adiz_intensity)}
          </div>
          <div class="ew-group">
            <div class="ew-group-title">${isEn ? "Intelligence Signals" : "情報訊號"}</div>
            ${card("tension_trend",  "緊張趨勢",    "Tension Trend",     desc.tension_trend)}
            ${card("event_cluster",  "事件聚集",    "Event Cluster",     desc.event_cluster)}
            ${card("exercise_detect","演習宣告",    "Exercise Detection",desc.exercise_detect)}
          </div>
          <div class="ew-group">
            <div class="ew-group-title">${isEn ? "Political / Rhetoric" : "政治/言論訊號"}</div>
            ${card("pla_rhetoric",   "升溫言論",    "PLA Rhetoric",      desc.pla_rhetoric)}
            ${card("state_media",    "官媒熱度",    "State Media Heat",  desc.state_media)}
          </div>
        </div>

        <div class="ew-context">
          <span class="ew-context-icon">ⓘ</span>
          ${contextMsg()}
          <span class="ew-source-note">${isEn ? "Sources: MND, GDELT, RSS sweep · Expert framework: CSIS, Project 2049, DoD" : "資料來源：國防部、GDELT、RSS掃描 · 專家框架：CSIS、Project 2049、美國國防部"}</span>
        </div>
      </div>`;
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
