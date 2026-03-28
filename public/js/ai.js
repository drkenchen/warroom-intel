// ── AI Analysis Module ────────────────────────────────────────────────────
// Primary:  Google Gemini 2.0 Flash (free: 15 RPM, 1500 RPD)
// Fallback: Groq llama-3.3-70b    (free: 30 RPM, 14400 RPD)

const AI = {

  // ── Config ───────────────────────────────────────────────────────────────
  GEMINI_BASE:  "https://generativelanguage.googleapis.com/v1/models/",
  GROQ_ENDPOINT:"https://api.groq.com/openai/v1/chat/completions",
  STORAGE_KEY:  "warroom_ai_cfg",
  DEFAULT_MODEL:"gemini-2.5-pro",

  // ── State ─────────────────────────────────────────────────────────────────
  isAnalyzing: false,
  lastAnalysis: null,

  // ── Persist config ────────────────────────────────────────────────────────
  loadConfig() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "{}"); }
    catch { return {}; }
  },
  saveConfig(cfg) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cfg));
  },

  // ── System Instruction (sets analyst persona) ────────────────────────────
  get SYSTEM_INSTRUCTION() {
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    return isEn
      ? `You are a senior global security intelligence analyst with the following background:
- 20 years at top think tanks including RAND Corporation, CSIS, and ISW
- Expertise: geopolitical risk assessment, military posture analysis, intelligence evaluation
- Familiar with IC Analytic Standards: use confidence markers (HIGH/MODERATE/LOW), distinguish facts from inference
- Writing style: precise, incisive, evidence-based — no vague generalities
- Output language: English`
      : `你是一位資深全球安全情報分析師，具備以下背景：
- 曾任職於RAND Corporation、CSIS、ISW等頂級智庫20年
- 專長：地緣政治風險評估、軍事態勢分析、情報研判
- 熟悉情報社群分析標準（IC Analytic Standards）：使用可信度標記（HIGH/MODERATE/LOW）、區分事實與推斷
- 行文風格：精準、犀利、有具體依據，不使用模糊措辭
- 輸出語言：繁體中文，專有名詞首次出現附英文原文`;
  },

  // ── Build structured event context ───────────────────────────────────────
  _buildEventContext(events) {
    const SEV = { critical:"🔴 重大", high:"🟠 高危", medium:"🟡 中危", low:"⚪ 一般" };

    // Group by region
    const byRegion = {};
    for (const e of events) {
      const r = e.regionInfo?.region || "全球";
      if (!byRegion[r]) byRegion[r] = [];
      byRegion[r].push(e);
    }

    // Critical & high events in full
    const critHigh = events
      .filter(e => e.severity === "critical" || e.severity === "high")
      .slice(0, 30)
      .map((e, i) => `${i+1}. ${SEV[e.severity]} [${e.regionInfo?.region||"全球"}] ${e.title}\n   來源: ${e.source} | 時間: ${e.publishedAt?.slice(0,16).replace("T"," ")||"—"}${e.description?.length > 20 ? "\n   摘要: " + e.description.slice(0, 150) : ""}`)
      .join("\n\n");

    // Other events summarized by region
    const regionSummary = Object.entries(byRegion)
      .map(([r, evs]) => {
        const counts = { critical:0, high:0, medium:0, low:0 };
        evs.forEach(e => counts[e.severity]++);
        return `**${r}**: ${evs.length}條 (重大${counts.critical} 高危${counts.high} 中危${counts.medium})`;
      }).join(" ｜ ");

    const twEvents = events.filter(e => e.isTaiwan);
    const twLines = twEvents.slice(0, 10).map((e, i) =>
      `${i+1}. ${SEV[e.severity]} ${e.title} (${e.source})`
    ).join("\n");

    return { critHigh, regionSummary, twLines, twCount: twEvents.length,
      critCount: events.filter(e=>e.severity==="critical").length,
      highCount:  events.filter(e=>e.severity==="high").length,
      total: events.length };
  },

  // ── Main Intelligence Report Prompt ──────────────────────────────────────
  buildPrompt(events) {
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const ctx  = this._buildEventContext(events);
    const now  = new Date().toLocaleString(isEn ? "en-US" : "zh-TW");
    const srcSet = [...new Set(events.map(e => e.source).filter(Boolean))].slice(0, 12).join(", ");

    const osintRef = isEn
      ? `## OSINT Community Reference
The following are leading open-source intelligence analysts. Emulate their analytical rigor and methodology:

| Account | Expertise | Methodology |
|---------|-----------|-------------|
| @IntelCrab | Global conflict OSINT | Multi-source cross-validation, avoid single-source bias |
| @RALee85 (Rob Lee, CNA) | Russian military strategy | Academic rigor, distinguish intent from capability |
| @KofmanMichael | Russian military capability | Quantitative assessment, guard against over/underestimation |
| @OSINTdefender | Global defense OSINT | Verification-first, source-tier labeling |
| @GeoConfirmed | Conflict geo-verification | Satellite imagery corroboration, precise location |
| @trbrtc | Taiwan/PLA dynamics | PLA organizational structure, gray-zone identification |
| @DFRLab | Information warfare | Disinformation tracing, narrative manipulation detection |
| @bellingcatint | Open-source investigation | Multi-layer verification, imagery geolocation |

Core principles: **multi-source cross-validation**, **fact vs. inference distinction**, **confidence level labeling**.`
      : `## OSINT 社群參考視角
以下為全球頂尖開源情報分析師與可信帳號，分析時請參考其觀點與方法論，模擬這些專家的分析角度與嚴謹程度：

| 帳號 | 專長領域 | 方法論重點 |
|------|----------|-----------|
| @IntelCrab | 全球衝突OSINT | 多源交叉比對，避免單一來源偏差 |
| @RALee85 (Rob Lee, CNA) | 俄羅斯軍事戰略 | 學術嚴謹，區分意圖與能力 |
| @KofmanMichael (Michael Kofman) | 俄軍作戰能力 | 量化評估，警惕誇大/低估 |
| @OSINTdefender | 全球OSINT防衛情報 | 事件核實優先，標注信源等級 |
| @GeoConfirmed | 地理確認衝突事件 | 衛星影像佐證，精確定位 |
| @trbrtc | 台灣/解放軍動態 | PLA組織架構，灰色地帶識別 |
| @DFRLab | 資訊戰/認知作戰 | 假訊息溯源，敘事操控偵測 |
| @bellingcatint | 開源調查核實 | 多層核實，影像地理定位 |

分析時請特別注意：這些帳號共同強調的核心原則：**多源交叉驗證**、**區分事實與推斷**、**標注信心水準**。`;

    if (isEn) {
      return `# Global Security Intelligence Report
Generated: ${now}
Sources: ${ctx.total} multi-source events (${srcSet}, etc.)
Output language: English

## I. Raw Intelligence Data

### Critical/High Events (${ctx.critCount + ctx.highCount} items, with descriptions)

${ctx.critHigh || "(No critical or high events this cycle)"}

### Regional Event Distribution
${ctx.regionSummary}

### Taiwan Strait Intelligence (${ctx.twCount} items)
${ctx.twLines || "(No Taiwan Strait events this cycle)"}

---

${osintRef}

---

## II. Analysis Requirements

Write a global security situation assessment report conforming to intelligence community standards. Respond entirely in English.

Label each judgment with a confidence level:
- **[HIGH]** = Multiple independent sources corroborate; judgment is certain
- **[MODERATE]** = Partial corroboration; uncertainty factors remain
- **[LOW]** = Based on inference or single source; requires further confirmation

---

### I. Key Judgments Summary
List 3–5 core judgments from this analysis. One sentence each, with confidence label.
Format: **[CONFIDENCE]** Judgment statement.

---

### II. Global Security Situation Assessment

**2.1 Macro Strategic Environment**
Analyze overall pressure on the international order: US-China structural competition, Ukraine war attrition effects, Middle East conflict regional spillover risks, security implications of accelerating multipolarity. Identify which structural forces are reshaping the global security landscape.

**2.2 Hotspot Linkage Analysis**
Analyze strategic linkages between conflicts:
- How the Ukraine war affects Beijing's Taiwan timeline assessment
- How the Middle East situation diverts US strategic attention
- North Korea–Russia military cooperation spillover effects on the Indo-Pacific
- Cumulative drain on US global force deployment capacity

**2.3 Key Actor Intent Assessment**
For each actor below, 2–3 sentences on current strategic intent and direction:
- China (Xi Jinping regime)
- Russia (Putin regime)
- Iran (theocratic government)
- United States (current administration foreign policy)

---

### III. Taiwan Strait Threat Assessment

**3.1 Recent PLA Activity Patterns**
Based on intelligence events, analyze PLA Eastern Theater Command exercise patterns, naval/air movements, and gray-zone operations. Assess whether these constitute "routine deterrence" or operational readiness indicators.

**3.2 Strategic Deterrence Posture**
Assess US-Japan alliance deterrence credibility: US forward deployment status, political reliability of Taiwan security commitments, substantive actions following Japan's National Security Strategy documents.

**3.3 Taiwan Resilience Assessment**
Evaluate Taiwan's defensive resilience: defense reform progress, civil defense mobilization readiness, critical infrastructure vulnerabilities (energy/semiconductors/food), social cohesion.

**3.4 Escalation Trigger Scenarios**
Identify the most likely "red line events" (trigger events): which specific actions or incidents, if they occurred, would signal irreversible crisis escalation in the Taiwan Strait?

---

### IV. Future Situation Assessment

**4.1 72-Hour Watch List**
List 3–5 specific indicators requiring immediate tracking; explain why each matters and what to monitor.

**4.2 30-Day Trend Outlook**
Analyze major risk trends over the next month: which situations may deteriorate? Where are de-escalation opportunities?

**4.3 Tail Risks**
List 2–3 currently low-probability but high-impact "black swan" scenarios.

---

### V. Analyst Notes

**Confidence Statement**: Self-assessment of overall analytical confidence based on source quality and quantity.
**Intelligence Gaps**: Most important gaps — what critical information is currently insufficient?
**Recommended Actions**: 1–2 most important follow-up actions for decision-makers or researchers.

---
Output requirements: professional, precise, evidence-based. Avoid hollow generalizations. Embed key data or historical cases directly into the analysis.`;
    }

    return `# 全球安全情報報告
生成時間：${now}
情報來源：${ctx.total} 條多源事件（${srcSet}等）
輸出語言：繁體中文

## 一、情報原始資料

### 重大/高危事件（${ctx.critCount + ctx.highCount} 條，含描述）

${ctx.critHigh || "（本次無重大或高危事件）"}

### 各地區事件分布
${ctx.regionSummary}

### 台海專項情報（${ctx.twCount} 條）
${ctx.twLines || "（本次無台海相關情報）"}

---

${osintRef}

---

## 二、分析要求

請撰寫一份符合情報社群標準的全球安全態勢評估報告，以繁體中文回應。

每項判斷請標注可信度：
- **【HIGH】** = 有多個獨立來源佐證，判斷確定
- **【MODERATE】** = 有部分佐證，但存在不確定因素
- **【LOW】** = 基於推斷或單一來源，需進一步確認

---

### 一、關鍵判斷摘要（Key Judgments）
列出3-5條本次分析最重要的核心判斷。每條一句話，標注可信度。
格式：**【可信度】** 判斷內容。

---

### 二、全球安全態勢評估

**2.1 宏觀戰略環境**
分析當前國際秩序的整體壓力：美中博弈結構性對抗、俄烏戰爭的持續消耗效應、中東衝突的地區擴散風險、全球多極化加速的安全影響。識別哪些結構性力量正在重塑全球安全格局。

**2.2 熱點聯動效應分析**
分析不同衝突之間的戰略關聯性：
- 烏克蘭戰爭如何影響中共對台時間窗口評估
- 中東局勢如何分散美國戰略注意力
- 北韓-俄羅斯軍事合作對印太的外溢影響
- 各衝突對美軍全球部署能力的累積消耗

**2.3 主要行為體意圖研判**
針對以下行為體，各用2-3句分析其當前戰略意圖與行動方向：
- 中國（習近平政權）
- 俄羅斯（普丁政權）
- 伊朗（神權政體）
- 美國（當前政府對外政策）

---

### 三、台海威脅深度評估

**3.1 解放軍近期行動模式**
基於情報事件，分析PLA東部戰區的演訓模式、海空軍動向、灰色地帶行動。判斷這些行動是「例行性威懾」還是具有實戰準備指向。

**3.2 戰略嚇阻態勢**
評估美日同盟的嚇阻可信度：美軍前沿部署現況、對台安全承諾的政治可靠性、日本安保三文件後的實質行動。

**3.3 台灣韌性評估**
評估台灣的防禦韌性：國防改革進展、全民防衛動員準備度、關鍵基礎設施脆弱性（能源/半導體/糧食）、社會凝聚力。

**3.4 衝突引爆情境**
識別最可能引發危機升級的「紅線事件」（trigger events）：
哪些具體行動或事件，一旦發生，將代表台海局勢進入不可逆的危機升級通道？

---

### 四、未來情勢研判

**4.1 未來 72 小時監控清單**
列出3-5個需要立即追蹤的具體指標，說明為何重要、監控方向。

**4.2 未來 30 天趨勢**
分析未來一個月的主要風險趨勢：哪些局勢可能惡化？哪些存在緩和機會？

**4.3 尾部風險（Tail Risks）**
列出2-3個目前機率低、但一旦發生將造成重大衝擊的「黑天鵝」情境。

---

### 五、分析師評注

**可信度說明**：基於本次情報來源的質量與數量，對整體分析可信度的自我評估。
**資訊缺口**：指出最重要的情報缺口——哪些關鍵資訊我們目前掌握不足？
**建議關注**：對決策者或研究者，最重要的1-2個後續追蹤行動。

---
輸出要求：專業、精確、有具體依據。避免空洞概括。如引用重要數據或歷史案例，直接嵌入分析中。`;
  },

  // ── Gemini Streaming ──────────────────────────────────────────────────────
  async analyzeWithGemini(prompt, apiKey, model, onChunk, onDone, onError) {
    const url = this.GEMINI_BASE + model + ":streamGenerateContent?key=" + apiKey + "&alt=sse";
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: this.SYSTEM_INSTRUCTION + "\n\n" + prompt }] }],
          generationConfig: {
            temperature:      0.3,
            maxOutputTokens:  8192,
            topP:             0.85,
            topK:             40,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT",  threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT",         threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH",        threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",  threshold: "BLOCK_NONE" },
          ]
        })
      });
    } catch(e) {
      onError("網路連接失敗: " + e.message);
      return;
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      let msg = `Gemini API 錯誤 (${response.status})`;
      try {
        const j = JSON.parse(errText);
        msg = j.error?.message || msg;
      } catch {}
      onError(msg);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const raw = line.slice(5).trim();
        if (raw === "[DONE]") continue;
        try {
          const obj = JSON.parse(raw);
          const chunk = obj.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (chunk) {
            fullText += chunk;
            onChunk(chunk, fullText);
          }
        } catch {}
      }
    }
    onDone(fullText);
  },

  // ── Groq Streaming ────────────────────────────────────────────────────────
  async analyzeWithGroq(prompt, apiKey, onChunk, onDone, onError) {
    let response;
    try {
      response = await fetch(this.GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model:       "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: this.SYSTEM_INSTRUCTION },
            { role: "user",   content: prompt }
          ],
          temperature: 0.3,
          max_tokens:  8000,
          stream:      true,
        })
      });
    } catch(e) {
      onError("網路連接失敗: " + e.message);
      return;
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      let msg = `Groq API 錯誤 (${response.status})`;
      try { msg = JSON.parse(errText).error?.message || msg; } catch {}
      onError(msg);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const raw = line.slice(5).trim();
        if (raw === "[DONE]") continue;
        try {
          const chunk = JSON.parse(raw).choices?.[0]?.delta?.content || "";
          if (chunk) {
            fullText += chunk;
            onChunk(chunk, fullText);
          }
        } catch {}
      }
    }
    onDone(fullText);
  },

  // ── Main: try Gemini → fallback Groq ─────────────────────────────────────
  async analyze(events) {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    const cfg = this.loadConfig();
    const model = cfg.geminiModel || this.DEFAULT_MODEL;
    const prompt = this.buildPrompt(events);
    const outputEl = document.getElementById("ai-output");
    const statusEl = document.getElementById("ai-status");
    const btnEl    = document.getElementById("ai-analyze-btn");

    if (!outputEl) { this.isAnalyzing = false; return; }

    // Reset UI
    outputEl.innerHTML = "";
    outputEl.classList.add("streaming");
    if (btnEl) { btnEl.disabled = true; btnEl.textContent = t("ai_analyzing"); }

    const renderChunk = (_, full) => {
      outputEl.innerHTML = this.formatMarkdown(full) + '<span class="cursor">▋</span>';
      outputEl.scrollTop = outputEl.scrollHeight;
    };

    const onDone = (full) => {
      this.lastAnalysis = { text: full, ts: new Date().toISOString(), events: events.length, model };
      this.saveConfig({ ...cfg, lastAnalysis: this.lastAnalysis });
      outputEl.innerHTML = this.formatMarkdown(full) + this._buildSourcesHTML(events);
      outputEl.classList.remove("streaming");
      const wordCount = full.replace(/\s+/g, " ").split(" ").length;
      const readMin   = Math.ceil(wordCount / 300);
      if (statusEl) statusEl.innerHTML = t("ai_done", wordCount, readMin, model);
      // Render action bar below output
      let actionBar = document.getElementById("ai-action-bar");
      if (!actionBar) {
        actionBar = document.createElement("div");
        actionBar.id = "ai-action-bar";
        actionBar.className = "ai-action-bar";
        outputEl.parentNode.insertBefore(actionBar, outputEl.nextSibling);
      }
      const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
      actionBar.innerHTML =
        `<button class="ai-copy-btn" onclick="AI.copyReport()">⎘ ${isEn ? "Copy Report" : "複製報告"}</button>` +
        `<button class="ai-pdf-btn"  onclick="AI.downloadPDF()">↓ ${isEn ? "Download PDF" : "下載 PDF"}</button>`;
      if (btnEl) { btnEl.disabled = false; btnEl.textContent = t("ai_reanalyze"); }
      this.isAnalyzing = false;
    };

    const onError = (msg) => {
      outputEl.classList.remove("streaming");
      outputEl.innerHTML = `<div class="ai-error">⚠ ${msg}</div>`;
      if (statusEl) statusEl.textContent = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en" ? "Analysis failed" : "分析失敗";
      if (btnEl)  { btnEl.disabled = false; btnEl.textContent = t("ai_reanalyze"); }
      this.isAnalyzing = false;
    };

    // Try Gemini first
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    if (cfg.geminiKey) {
      if (statusEl) statusEl.textContent = (isEn ? "Analyzing with " : "使用 ") + model + (isEn ? "..." : " 分析中...");
      await this.analyzeWithGemini(prompt, cfg.geminiKey, model, renderChunk, onDone, async (err) => {
        // Fallback to Groq if Gemini fails and Groq key exists
        if (cfg.groqKey) {
          if (statusEl) statusEl.textContent = (isEn ? "Gemini failed, switching to Groq Llama... (" : "Gemini 失敗，切換至 Groq Llama... (") + err + ")";
          outputEl.innerHTML = "";
          await this.analyzeWithGroq(prompt, cfg.groqKey, renderChunk, onDone, onError);
        } else {
          onError(err);
        }
      });
    } else if (cfg.groqKey) {
      if (statusEl) statusEl.textContent = isEn ? "Analyzing with Groq Llama-3.3-70B..." : "使用 Groq Llama-3.3-70B 分析中...";
      await this.analyzeWithGroq(prompt, cfg.groqKey, renderChunk, onDone, onError);
    } else {
      onError(isEn ? "Please set an API Key (⚙ Settings)" : "請先設定 API Key（點擊右上角「⚙ 設定」）");
      this.isAnalyzing = false;
    }
  },

  // ── Model helpers ─────────────────────────────────────────────────────────
  modelIcon(model) {
    if (model.includes("2.5-pro"))   return "🔮";
    if (model.includes("2.5-flash")) return "⚡";
    if (model.includes("1.5-pro"))   return "💎";
    if (model.includes("flash"))     return "⚡";
    return "✦";
  },

  modelDesc(model) {
    const map = {
      "gemini-2.5-pro":   "Google Plus 旗艦 · 最強推理<br>輸出 8,192 tokens · 深度報告",
      "gemini-2.5-flash": "Google Plus 快速 · 均衡品質<br>8,192 tokens · 高速推理",
      "gemini-2.0-flash": "Google 快速模型 · 免費帳號可用<br>8,192 tokens · 15 次/分",
      "gemini-1.5-pro":   "Google 高品質 · 2M 上下文<br>8,192 tokens 輸出",
      "gemini-1.5-flash": "Google 均衡模型<br>8,192 tokens · 15 次/分",
    };
    return map[model] || ("Google Gemini<br>" + model);
  },

  // ── Markdown → HTML (full report renderer) ───────────────────────────────
  formatMarkdown(text) {
    // Process line-by-line for better control
    const lines = text.split("\n");
    const out = [];
    let inList = false;

    const closeList = () => { if (inList) { out.push("</div>"); inList = false; } };

    const esc = s => s
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

    const inline = s => esc(s)
      // Confidence badges: 【HIGH】【MODERATE】【LOW】
      .replace(/【(HIGH|MODERATE|LOW)】/g, (_, c) =>
        `<span class="conf-badge conf-${c.toLowerCase()}">${c}</span>`)
      // **bold** (after badge processing)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // *italic*
      .replace(/\*([^*]+?)\*/g, "<em>$1</em>")
      // `code`
      .replace(/`([^`]+)`/g, `<code class="ai-code">$1</code>`);

    for (let raw of lines) {
      const line = raw.trimEnd();

      // # H1
      if (/^# /.test(line)) {
        closeList();
        out.push(`<h2 class="ai-report-title">${inline(line.slice(2))}</h2>`);
        continue;
      }
      // ## H2
      if (/^## /.test(line)) {
        closeList();
        out.push(`<h3 class="ai-h2">${inline(line.slice(3))}</h3>`);
        continue;
      }
      // ### H3
      if (/^### /.test(line)) {
        closeList();
        out.push(`<h4 class="ai-section-title">${inline(line.slice(4))}</h4>`);
        continue;
      }
      // #### H4 — sub-section label (e.g. **2.1 xxx**)
      if (/^\*\*\d+\.\d+/.test(line) || /^\*\*[一二三四五六七八九十]、/.test(line)) {
        closeList();
        out.push(`<div class="ai-subsection">${inline(line)}</div>`);
        continue;
      }
      // Horizontal rule
      if (/^---+$/.test(line.trim())) {
        closeList();
        out.push('<hr class="ai-hr">');
        continue;
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        if (!inList) { out.push('<div class="ai-ol">'); inList = true; }
        out.push(`<div class="ai-list-item">${inline(line.replace(/^\d+\.\s+/, ""))}</div>`);
        continue;
      }
      // Bullet list  (-, •, ▸)
      if (/^[-•▸]\s/.test(line)) {
        if (!inList) { out.push('<div class="ai-ul">'); inList = true; }
        out.push(`<div class="ai-bullet">${inline(line.replace(/^[-•▸]\s+/, ""))}</div>`);
        continue;
      }
      // Blank line
      if (line.trim() === "") {
        closeList();
        out.push('<div class="ai-para-gap"></div>');
        continue;
      }
      // Normal paragraph
      closeList();
      out.push(`<p class="ai-p">${inline(line)}</p>`);
    }
    closeList();
    return out.join("\n");
  },

  // ── Render the AI tab ─────────────────────────────────────────────────────
  renderTab() {
    const el = document.getElementById("tab-ai");
    if (!el) return;

    let cfg = {};
    try { cfg = this.loadConfig(); } catch(e) {}

    const hasGemini = !!(cfg.geminiKey && cfg.geminiKey.length > 5);
    const hasGroq   = !!(cfg.groqKey   && cfg.groqKey.length > 5);
    const hasKey    = hasGemini || hasGroq;
    const model     = cfg.geminiModel || this.DEFAULT_MODEL;
    const providerLabel = hasGemini ? model : hasGroq ? "Groq llama-3.3-70b" : "未設定";

    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const statusText = this.lastAnalysis
      ? t("ai_last", new Date(this.lastAnalysis.ts).toLocaleString(isEn ? "en-US" : "zh-TW"), this.lastAnalysis.events)
      : t("ai_no_analysis");

    let outputContent = `<div class="ai-placeholder">${t("ai_placeholder")}</div>`;
    if (this.lastAnalysis && this.lastAnalysis.text) {
      try { outputContent = this.formatMarkdown(this.lastAnalysis.text); } catch(e) {}
    }

    const noKeyLabel  = isEn ? "⚠ API Key not set" : "⚠ 未設定 API Key";
    const keySetLabel = isEn ? "✓ set · Change →"  : "已設定 · 變更 Key →";
    const getKeyLabel = isEn ? "Get API Key →"      : "取得 API Key →";
    const getFreeKey  = isEn ? "Get Free Key →"     : "取得免費 Key →";
    const groqDesc    = isEn ? "Ultra-fast · Free tier<br>30 rpm · 14,400/day" : "超快推理 · 免費方案<br>30 次/分 · 14,400 次/日";

    el.innerHTML = [
      '<div class="ai-header">',
      '  <div>',
      '    <h2 class="ai-title">' + t("ai_title") + '</h2>',
      '    <div class="ai-provider-row">',
      '      <span class="ai-provider-badge ' + (hasKey ? "active" : "") + '">',
      '        ' + (hasKey ? "▶ " + providerLabel : noKeyLabel),
      '      </span>',
      '      <span class="ai-free-note">' + t("ai_free") + '</span>',
      '    </div>',
      '  </div>',
      '  <div class="ai-header-actions">',
      '    <button class="ai-settings-btn" onclick="AI.openSettings()">' + t("ai_settings") + '</button>',
      '    <button class="btn-analyze" id="ai-analyze-btn" onclick="AI.analyze(State.events)" ' + (!hasKey ? "disabled" : "") + '>',
      '      ' + (hasKey ? t("ai_start") : t("ai_need_key")),
      '    </button>',
      '  </div>',
      '</div>',
      '<div class="ai-meta" id="ai-status">' + statusText + '</div>',
      '<div class="ai-output-box" id="ai-output">',
      '  ' + outputContent,
      '</div>',
      '<div class="ai-info-row">',
      '  <div class="ai-info-card ' + (hasGemini ? "active-card" : "") + '">',
      '    <div class="ai-info-icon">' + this.modelIcon(model) + '</div>',
      '    <div>',
      '      <div class="ai-info-title">' + model + '</div>',
      '      <div class="ai-info-desc">' + this.modelDesc(model) + '</div>',
      '      <a class="ai-get-key" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">',
      '        ' + (hasGemini ? keySetLabel : getKeyLabel),
      '      </a>',
      '    </div>',
      '  </div>',
      '  <div class="ai-info-card ' + (hasGroq ? "active-card" : "") + '">',
      '    <div class="ai-info-icon">🦙</div>',
      '    <div>',
      '      <div class="ai-info-title">Groq Llama 3.3 70B</div>',
      '      <div class="ai-info-desc">' + groqDesc + '</div>',
      '      <a class="ai-get-key" href="https://console.groq.com/keys" target="_blank" rel="noopener">',
      '        ' + (hasGroq ? keySetLabel : getFreeKey),
      '      </a>',
      '    </div>',
      '  </div>',
      '</div>',
    ].join("\n");
  },

  // ── Build cited sources reference list ───────────────────────────────────
  _buildSourcesHTML(events, taiwanOnly = false) {
    const isEn  = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const pool  = taiwanOnly ? events.filter(e => e.isTaiwan) : events;

    // Collect unique sources with representative URL and event count
    const map = new Map();
    for (const e of pool) {
      if (!e.source) continue;
      if (!map.has(e.source)) {
        map.set(e.source, { name: e.source, url: e.link || e.url || null, count: 0 });
      }
      map.get(e.source).count++;
      // Prefer a real article URL over a feed URL
      if (!map.get(e.source).url && (e.link || e.url)) {
        map.get(e.source).url = e.link || e.url;
      }
    }

    if (map.size === 0) return "";

    // Sort by event count descending
    const sorted = [...map.values()].sort((a, b) => b.count - a.count);

    const title   = isEn ? "References" : "引用來源";
    const countLbl = (n) => isEn ? `${n} article${n > 1 ? "s" : ""}` : `${n} 條`;

    const items = sorted.map((s, i) => {
      const link = s.url
        ? `<a class="ai-src-link" href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`
        : `<span class="ai-src-name">${s.name}</span>`;
      return `<div class="ai-src-item"><span class="ai-src-num">[${i + 1}]</span>${link}<span class="ai-src-count">${countLbl(s.count)}</span></div>`;
    }).join("");

    return `<div class="ai-sources-section">
  <div class="ai-sources-title">◎ ${title}</div>
  <div class="ai-sources-list">${items}</div>
</div>`;
  },

  // ── Copy report to clipboard ──────────────────────────────────────────────
  copyReport() {
    const text = this.lastAnalysis?.text;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => showToast(t("toast_copied")));
  },

  // ── Build full Taiwan report HTML (for PDF) ───────────────────────────────
  _buildTaiwanFullHTML(events) {
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const TA   = typeof TaiwanAnalysis !== "undefined" ? TaiwanAnalysis : null;
    const parts = [];

    // ── Tension Gauge ──────────────────────────────────────────────────────
    if (TA) {
      const idx   = TA.calculateTensionIndex(events);
      const label = TA.tensionLabel(idx);
      const tw    = events.filter(e => e.isTaiwan).length;
      const basedOn = isEn ? `based on ${tw} live events` : `基於 ${tw} 條即時情報`;
      parts.push(`<div class="tw-print-section">
  <div class="tw-print-title">${isEn ? "◉ Taiwan Strait Tension Index" : "◉ 台海緊張指數"}</div>
  <div class="tw-gauge-row">
    <div class="tw-gauge-bar-wrap"><div class="tw-gauge-fill" style="width:${idx}%;background:${label.color}"></div></div>
    <span style="color:${label.color};font-weight:700;font-size:15px;margin-left:12px">${label.text}</span>
    <span style="font-size:12px;margin-left:8px;color:#888">${idx}/100 · ${basedOn}</span>
  </div>
</div>`);
    }

    // ── Threat Dimensions ──────────────────────────────────────────────────
    if (TA) {
      const levelLabel = isEn
        ? { critical:"Very High", high:"High", medium:"Med" }
        : { critical:"極高", high:"高", medium:"中" };
      const levelColor = { critical:"#ff3b3b", high:"#ff8c00", medium:"#f0c020" };
      const dimRows = TA.threatDimensions.map(d => `
  <div class="tw-dim-print">
    <div class="tw-dim-print-header">
      <span>${d.icon} ${isEn && d.labelEn ? d.labelEn : d.label}</span>
      <span style="color:${levelColor[d.level]||'#aaa'};font-weight:600">${levelLabel[d.level]||d.level} · ${d.score}/100</span>
    </div>
    <div class="tw-gauge-bar-wrap"><div class="tw-gauge-fill" style="width:${d.score}%;background:${levelColor[d.level]||'#aaa'}"></div></div>
    <div class="tw-dim-print-desc">${isEn && d.descEn ? d.descEn : d.desc}</div>
  </div>`).join("");
      parts.push(`<div class="tw-print-section">
  <div class="tw-print-title">${isEn ? "▌ Threat Dimension Analysis" : "▌ 威脅面向分析"}</div>
  ${dimRows}
</div>`);
    }

    // ── Scenarios ──────────────────────────────────────────────────────────
    if (TA) {
      const scRows = TA.scenarios.map(s => {
        const label  = isEn && s.labelEn   ? s.labelEn   : s.label;
        const desc   = isEn && s.descEn    ? s.descEn    : s.desc;
        const horiz  = isEn && s.horizonEn ? s.horizonEn : s.horizon;
        const inds   = isEn && s.indicatorsEn ? s.indicatorsEn : s.indicators;
        return `<div class="tw-sc-print">
    <div class="tw-sc-print-header">
      <span style="font-weight:600">${label}</span>
      <span style="color:${s.color};font-weight:700">${s.prob}%</span>
      <span style="color:#888;font-size:11px">${horiz}</span>
    </div>
    <div class="tw-gauge-bar-wrap"><div class="tw-gauge-fill" style="width:${s.prob}%;background:${s.color}"></div></div>
    <div style="font-size:12px;margin:4px 0">${desc}</div>
    <div style="font-size:11px;color:#666">${inds.map(i=>`▸ ${i}`).join("  ")}</div>
  </div>`;
      }).join("");
      parts.push(`<div class="tw-print-section">
  <div class="tw-print-title">${isEn ? "▌ Scenario Forecast (Next 12 Months)" : "▌ 情境預測模型（未來12個月）"}</div>
  ${scRows}
</div>`);
    }

    // ── Watch Indicators ───────────────────────────────────────────────────
    if (TA) {
      const statusColor = { critical:"#ff3b3b", high:"#ff8c00", elevated:"#f0c020", active:"#3d7fff", normal:"#44d4a0" };
      const statusLabel = isEn
        ? { critical:"Critical", high:"High", elevated:"Elevated", active:"Active", normal:"Normal" }
        : { critical:"極高", high:"高危", elevated:"升高", active:"活躍", normal:"正常" };
      const indRows = TA.watchIndicators.map(ind => `
  <div class="tw-ind-print">
    <div class="tw-ind-print-name">${isEn && ind.labelEn ? ind.labelEn : ind.label} <span style="color:#aaa;font-size:10px">${ind.src}</span></div>
    <div class="tw-ind-print-row">
      <span style="font-size:12px">${isEn && ind.descEn ? ind.descEn : ind.desc}</span>
      <span style="color:${statusColor[ind.status]||'#aaa'};font-weight:600;font-size:11px;white-space:nowrap">${statusLabel[ind.status]||ind.status}</span>
    </div>
  </div>`).join("");
      parts.push(`<div class="tw-print-section">
  <div class="tw-print-title">${isEn ? "▌ Key Watch Indicators" : "▌ 關鍵監控指標"}</div>
  ${indRows}
</div>`);
    }

    // ── AI Analysis ────────────────────────────────────────────────────────
    if (this._twAnalysisText) {
      parts.push(`<div class="tw-print-section">
  <div class="tw-print-title">${isEn ? "▌ AI Deep Analysis" : "▌ AI 深度分析"}</div>
  ${this.formatMarkdown(this._twAnalysisText)}
</div>`);
    }

    // ── Sources ────────────────────────────────────────────────────────────
    parts.push(this._buildSourcesHTML(events, true));

    return parts.join("\n");
  },

  copyTaiwanReport() {
    if (!this._twAnalysisText && !TaiwanAnalysis) return;
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const TA   = typeof TaiwanAnalysis !== "undefined" ? TaiwanAnalysis : null;
    const lines = [];

    if (TA) {
      const levelLabel = isEn
        ? { critical:"Very High", high:"High", medium:"Med" }
        : { critical:"極高", high:"高", medium:"中" };
      lines.push(isEn ? "=== THREAT DIMENSION ANALYSIS ===" : "=== 威脅面向分析 ===");
      TA.threatDimensions.forEach(d => {
        lines.push(`${d.icon} ${isEn && d.labelEn ? d.labelEn : d.label} — ${levelLabel[d.level]} (${d.score}/100)`);
        lines.push(`  ${isEn && d.descEn ? d.descEn : d.desc}`);
      });
      lines.push("");
      lines.push(isEn ? "=== SCENARIO FORECAST (Next 12 Months) ===" : "=== 情境預測模型（未來12個月）===");
      TA.scenarios.forEach(s => {
        lines.push(`${isEn && s.labelEn ? s.labelEn : s.label} — ${s.prob}%`);
        lines.push(`  ${isEn && s.descEn ? s.descEn : s.desc}`);
      });
      lines.push("");
      lines.push(isEn ? "=== KEY WATCH INDICATORS ===" : "=== 關鍵監控指標 ===");
      TA.watchIndicators.forEach(ind => {
        lines.push(`${isEn && ind.labelEn ? ind.labelEn : ind.label}: ${isEn && ind.descEn ? ind.descEn : ind.desc}`);
      });
      lines.push("");
    }

    if (this._twAnalysisText) {
      lines.push(isEn ? "=== AI DEEP ANALYSIS ===" : "=== AI 深度分析 ===");
      lines.push(this._twAnalysisText);
    }

    navigator.clipboard.writeText(lines.join("\n")).then(() => showToast(t("toast_copied")));
  },

  // ── PDF download via print window ─────────────────────────────────────────
  _openPrintWindow(htmlContent, title, isTaiwan = false) {
    const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const now  = new Date().toLocaleString(isEn ? "en-US" : "zh-TW");
    const win  = window.open("", "_blank");
    if (!win) { showToast(isEn ? "⚠ Allow pop-ups to download PDF" : "⚠ 請允許彈出視窗以下載 PDF"); return; }
    win.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Noto Sans TC', sans-serif; font-size: 13px; line-height: 1.8;
         color: #1a1a2e; background: #fff; padding: 32px 40px; max-width: 800px; margin: 0 auto; }
  .print-header { border-bottom: 2px solid #1a3a6a; padding-bottom: 12px; margin-bottom: 24px; }
  .print-header h1 { font-size: 18px; font-weight: 700; color: #080c18; }
  .print-header .meta { font-size: 11px; color: #666; margin-top: 4px; }
  h2.ai-report-title { font-size: 16px; font-weight: 700; color: #080c18; margin: 20px 0 10px; border-left: 4px solid #2a7fff; padding-left: 10px; }
  h3.ai-h2 { font-size: 14px; font-weight: 700; color: #1a3a6a; margin: 16px 0 8px; }
  h4.ai-section-title { font-size: 13px; font-weight: 600; color: #2a5ca0; margin: 12px 0 6px; border-bottom: 1px solid #e0e8f0; padding-bottom: 4px; }
  .ai-subsection { font-weight: 600; color: #333; margin: 10px 0 4px; }
  p.ai-p, .ai-bullet, .ai-list-item { margin: 4px 0; }
  .ai-ol, .ai-ul { margin: 6px 0 6px 16px; }
  .ai-bullet::before { content: "• "; color: #2a7fff; }
  .ai-list-item::before { content: counter(list-item) ". "; }
  .ai-hr { border: none; border-top: 1px solid #dde6f0; margin: 16px 0; }
  .ai-para-gap { height: 6px; }
  .conf-badge { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px; font-weight: 700; margin-right: 4px; }
  .conf-high     { background: #d4edda; color: #155724; }
  .conf-moderate { background: #fff3cd; color: #856404; }
  .conf-low      { background: #f8d7da; color: #721c24; }
  .ai-code { font-family: monospace; background: #f4f6f9; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
  /* Taiwan sections */
  .tw-print-section { margin-bottom: 24px; }
  .tw-print-title { font-size: 13px; font-weight: 700; color: #1a3a6a; border-left: 3px solid #2a7fff; padding-left: 8px; margin-bottom: 12px; }
  .tw-gauge-bar-wrap { background: #e8eef8; border-radius: 4px; height: 6px; margin: 4px 0; overflow: hidden; }
  .tw-gauge-fill { height: 100%; border-radius: 4px; }
  .tw-gauge-row { display: flex; align-items: center; margin: 8px 0; }
  .tw-dim-print { margin-bottom: 12px; padding: 8px; background: #f7f9fc; border-radius: 4px; }
  .tw-dim-print-header { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
  .tw-dim-print-desc { font-size: 11px; color: #555; margin-top: 4px; }
  .tw-sc-print { margin-bottom: 12px; padding: 8px; background: #f7f9fc; border-radius: 4px; }
  .tw-sc-print-header { display: flex; gap: 12px; align-items: baseline; margin-bottom: 4px; }
  .tw-ind-print { display: flex; flex-direction: column; gap: 2px; padding: 6px 0; border-bottom: 1px solid #eef0f5; }
  .tw-ind-print-name { font-size: 12px; font-weight: 600; color: #1a2a4a; }
  .tw-ind-print-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .ai-sources-section { margin-top: 24px; padding-top: 14px; border-top: 1.5px solid #c0cce0; }
  .ai-sources-title { font-size: 10px; font-weight: 700; color: #666; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .ai-src-item { display: flex; align-items: baseline; gap: 6px; font-size: 11px; margin-bottom: 3px; }
  .ai-src-num { font-family: monospace; font-size: 10px; color: #888; width: 26px; flex-shrink: 0; }
  .ai-src-link { color: #1a5fa8; text-decoration: none; }
  .ai-src-name { color: #333; }
  .ai-src-count { font-family: monospace; font-size: 10px; color: #888; margin-left: 6px; }
  @media print {
    body { padding: 16px; }
    @page { margin: 16mm; }
  }
</style>
</head><body>
<div class="print-header">
  <h1>◈ WARROOM — ${title}</h1>
  <div class="meta">${now}</div>
</div>
${htmlContent}
<script>window.onload = () => { window.print(); }<\/script>
</body></html>`);
    win.document.close();
  },

  _dateStamp() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  },

  downloadPDF() {
    if (!this.lastAnalysis?.text) return;
    const isEn  = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const title = (isEn ? "Global Intelligence Report" : "全球安全情報報告") + " " + this._dateStamp();
    const html  = this.formatMarkdown(this.lastAnalysis.text) +
                  this._buildSourcesHTML(State?.events || [], false);
    this._openPrintWindow(html, title);
  },

  downloadTaiwanPDF() {
    const isEn  = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
    const title = (isEn ? "Taiwan Strait Full Report" : "台海完整分析報告") + " " + this._dateStamp();
    const html  = this._buildTaiwanFullHTML(State?.events || []);
    this._openPrintWindow(html, title, true);
  },

  // ── Settings Modal ────────────────────────────────────────────────────────
  openSettings() {
    const cfg = this.loadConfig();
    const overlay = document.getElementById("ai-settings-overlay");
    document.getElementById("ai-gemini-key").value   = cfg.geminiKey   || "";
    document.getElementById("ai-groq-key").value     = cfg.groqKey     || "";
    const modelSel = document.getElementById("ai-gemini-model");
    if (modelSel && cfg.geminiModel) modelSel.value = cfg.geminiModel;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  },

  closeSettings() {
    document.getElementById("ai-settings-overlay").classList.remove("open");
  },

  saveSettings() {
    const geminiKey   = document.getElementById("ai-gemini-key").value.trim();
    const groqKey     = document.getElementById("ai-groq-key").value.trim();
    const geminiModel = document.getElementById("ai-gemini-model").value;
    this.saveConfig({ geminiKey, groqKey, geminiModel });
    this.closeSettings();
    this.renderTab();
    showToast("✓ 設定已儲存（僅存在您的瀏覽器）");
  },

  clearSettings() {
    if (!confirm("確定清除所有 API Key 設定？")) return;
    localStorage.removeItem(this.STORAGE_KEY);
    this.closeSettings();
    this.renderTab();
    showToast("已清除 API Key");
  },

  // ── Taiwan Deep Analysis ──────────────────────────────────────────────────
  async analyzeTaiwan(events) {
    const cfg = this.loadConfig();
    if (!cfg.geminiKey && !cfg.groqKey) {
      showToast("⚠ 請先在 AI分析 分頁設定 API Key");
      return;
    }
    const btn = document.querySelector(".tw-ai-btn");
    if (btn) { btn.disabled = true; btn.textContent = t("ai_analyzing"); }

    // Create output panel below button
    let outputEl = document.getElementById("tw-ai-output");
    if (!outputEl) {
      outputEl = document.createElement("div");
      outputEl.id = "tw-ai-output";
      outputEl.className = "ai-output-box tw-ai-output-box";
      document.querySelector(".tw-ai-box")?.appendChild(outputEl);
    }
    outputEl.innerHTML = "";
    outputEl.classList.add("streaming");

    const model  = cfg.geminiModel || this.DEFAULT_MODEL;
    const prompt = TaiwanAnalysis.buildDeepAnalysisPrompt(events);

    const onChunk = (_, full) => {
      outputEl.innerHTML = this.formatMarkdown(full) + '<span class="cursor">▋</span>';
      outputEl.scrollTop = outputEl.scrollHeight;
    };
    const onDone = (full) => {
      this._twAnalysisText = full;
      outputEl.innerHTML = this.formatMarkdown(full) + this._buildSourcesHTML(events, true);
      outputEl.classList.remove("streaming");
      if (btn) { btn.disabled = false; btn.textContent = t("ai_reanalyze"); }
      // Inject action buttons below output
      let actBar = document.getElementById("tw-ai-actions");
      if (!actBar) {
        actBar = document.createElement("div");
        actBar.id = "tw-ai-actions";
        actBar.style.cssText = "margin-top:8px;display:flex;gap:6px;justify-content:flex-end;";
        outputEl.parentNode.insertBefore(actBar, outputEl.nextSibling);
      }
      const isEnTw = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
      actBar.className = "ai-action-bar";
      actBar.innerHTML =
        `<button class="ai-copy-btn" onclick="AI.copyTaiwanReport()">⎘ ${isEnTw ? "Copy Full Report" : "複製完整報告"}</button>` +
        `<button class="ai-pdf-btn"  onclick="AI.downloadTaiwanPDF()">↓ ${isEnTw ? "Download Full PDF" : "下載完整 PDF"}</button>`;
      const isEn = typeof LANG_STATE !== "undefined" && LANG_STATE.current === "en";
      showToast(isEn ? "✓ Taiwan deep analysis complete" : "✓ 台海深度分析完成");
    };
    const onError = (err) => {
      outputEl.innerHTML = `<div class="ai-error">⚠ ${err}</div>`;
      outputEl.classList.remove("streaming");
      if (btn) { btn.disabled = false; btn.textContent = t("ai_reanalyze"); }
    };

    if (cfg.geminiKey) {
      await this.analyzeWithGemini(prompt, cfg.geminiKey, model, onChunk, onDone, async (err) => {
        if (cfg.groqKey) await this.analyzeWithGroq(prompt, cfg.groqKey, onChunk, onDone, onError);
        else onError(err);
      });
    } else {
      await this.analyzeWithGroq(prompt, cfg.groqKey, onChunk, onDone, onError);
    }
  },

  // ── Init ──────────────────────────────────────────────────────────────────
  init() {
    // Restore last analysis from storage
    const cfg = this.loadConfig();
    if (cfg.lastAnalysis) this.lastAnalysis = cfg.lastAnalysis;
    this.renderTab();
  }
};
