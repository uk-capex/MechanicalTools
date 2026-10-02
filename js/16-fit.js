      // ════════════════════════════════════════
      // TAB: はめあい公差（JIS B 0401-1:2016 / ISO 286-1）
      // 2026-09 ファクトチェック改修：基本偏差表を作り直し、
      //   軸 k〜u は下の許容差 ei、穴 K〜P は ES = −ei + Δ で組むよう修正
      // ════════════════════════════════════════
      // 呼び寸法区分（上限値）— 基本偏差用の細区分
      const FIT_RANGES = [
        3, 6, 10, 14, 18, 24, 30, 40, 50, 65, 80, 100, 120,
        140, 160, 180, 200, 225, 250, 280, 315, 355, 400,
        450, 500,
      ];
      function fitIdx(d) {
        const i = FIT_RANGES.findIndex((u) => d <= u);
        return i < 0 ? FIT_RANGES.length - 1 : i;
      }

      // IT基本公差 (μm)  IT4〜IT11（IT4はΔ計算用）
      const IT_TABLE = {
        //        IT4 IT5  IT6  IT7  IT8  IT9  IT10 IT11
        "0-3":     [3,  4,  6, 10, 14,  25,  40,  60],
        "3-6":     [4,  5,  8, 12, 18,  30,  48,  75],
        "6-10":    [4,  6,  9, 15, 22,  36,  58,  90],
        "10-18":   [5,  8, 11, 18, 27,  43,  70, 110],
        "18-30":   [6,  9, 13, 21, 33,  52,  84, 130],
        "30-50":   [7, 11, 16, 25, 39,  62, 100, 160],
        "50-80":   [8, 13, 19, 30, 46,  74, 120, 190],
        "80-120":  [10, 15, 22, 35, 54, 87, 140, 220],
        "120-180": [12, 18, 25, 40, 63, 100, 160, 250],
        "180-250": [14, 20, 29, 46, 72, 115, 185, 290],
        "250-315": [16, 23, 32, 52, 81, 130, 210, 320],
        "315-400": [18, 25, 36, 57, 89, 140, 230, 360],
        "400-500": [20, 27, 40, 63, 97, 155, 250, 400],
      };
      function getRange(d) {
        if (d <= 3) return "0-3";
        if (d <= 6) return "3-6";
        if (d <= 10) return "6-10";
        if (d <= 18) return "10-18";
        if (d <= 30) return "18-30";
        if (d <= 50) return "30-50";
        if (d <= 80) return "50-80";
        if (d <= 120) return "80-120";
        if (d <= 180) return "120-180";
        if (d <= 250) return "180-250";
        if (d <= 315) return "250-315";
        if (d <= 400) return "315-400";
        return "400-500";
      }
      function getIT(d, grade) {
        const n = typeof grade === "string" ? parseInt(grade.replace("IT", "")) : grade;
        return IT_TABLE[getRange(d)][n - 4]; // μm
      }
      // Δ = IT(n) − IT(n−1)（穴 K〜P の補正量）
      function getDelta(d, n) {
        if (n < 5 || n > 8) return 0;
        return getIT(d, n) - getIT(d, n - 1);
      }

      // 軸の基本偏差（μm）FIT_RANGES の25区分に対応
      //  d,e,f,g : 上の許容差 es の絶対値（es = −値）
      //  k,m,n,p,r,s,t,u : 下の許容差 ei（ei = +値）
      const SHAFT_DEV = {
        d: [20,30,40,50,50,65,65,80,80,100,100,120,120,145,145,145,170,170,170,190,190,210,210,230,230],
        e: [14,20,25,32,32,40,40,50,50,60,60,72,72,85,85,85,100,100,100,110,110,125,125,135,135],
        f: [6,10,13,16,16,20,20,25,25,30,30,36,36,43,43,43,50,50,50,56,56,62,62,68,68],
        g: [2,4,5,6,6,7,7,9,9,10,10,12,12,14,14,14,15,15,15,17,17,18,18,20,20],
        k: [0,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,4,4,5,5], // IT4〜IT7のみ。それ以外は0
        m: [2,4,6,7,7,8,8,9,9,11,11,13,13,15,15,15,17,17,17,20,20,21,21,23,23],
        n: [4,8,10,12,12,15,15,17,17,20,20,23,23,27,27,27,31,31,31,34,34,37,37,40,40],
        p: [6,12,15,18,18,22,22,26,26,32,32,37,37,43,43,43,50,50,50,56,56,62,62,68,68],
        r: [10,15,19,23,23,28,28,34,34,41,43,51,54,63,65,68,77,80,84,94,98,108,114,126,132],
        s: [14,19,23,28,28,35,35,43,43,53,59,71,79,92,100,108,122,130,140,158,170,190,208,232,252],
        t: [null,null,null,null,null,null,41,48,54,66,75,91,104,122,134,146,166,180,196,218,240,268,294,330,360],
        u: [18,23,28,33,33,41,48,60,70,87,102,124,144,170,190,210,236,258,284,315,350,390,435,490,540],
      };

      function getShaftLimits(d, symbol, itGrade) {
        const it = getIT(d, itGrade);
        const i = fitIdx(d);
        let es, ei;
        if (symbol === "h") { es = 0; ei = -it; }
        else if (symbol === "js") { const h = Math.floor(it / 2); es = h; ei = -h; }  // 奇数ITは±(IT−1)/2
        else if ("defg".includes(symbol) && SHAFT_DEV[symbol]) {
          es = -SHAFT_DEV[symbol][i]; ei = es - it;
        } else if (SHAFT_DEV[symbol]) {
          let v = SHAFT_DEV[symbol][i];
          if (v === null) return null;               // 規格にない区分（t は24mm以下なし）
          if (symbol === "k" && (itGrade < 4 || itGrade > 7)) v = 0;
          ei = v; es = ei + it;
        } else { es = 0; ei = -it; }
        return { upper: es / 1000, lower: ei / 1000 }; // mm
      }

      function getHoleLimits(d, symbol, itGrade) {
        const it = getIT(d, itGrade);
        const i = fitIdx(d);
        const small = d <= 3;
        const Δ = small ? 0 : getDelta(d, itGrade);
        let ES, EI;
        switch (symbol) {
          case "H": EI = 0; ES = it; break;
          case "JS": { const h = Math.floor(it / 2); ES = h; EI = -h; break; }
          case "K":
            ES = itGrade <= 8 ? -SHAFT_DEV.k[i] + Δ : 0;
            if (small) ES = 0;
            EI = ES - it; break;
          case "M":
            ES = itGrade <= 8 ? -SHAFT_DEV.m[i] + Δ : -SHAFT_DEV.m[i];
            if (small) ES = -2;
            EI = ES - it; break;
          case "N":
            ES = itGrade <= 8 ? -SHAFT_DEV.n[i] + Δ : 0;
            if (small) ES = -4;
            EI = ES - it; break;
          case "P":
            ES = itGrade <= 7 ? -SHAFT_DEV.p[i] + Δ : -SHAFT_DEV.p[i];
            if (small) ES = -6;
            EI = ES - it; break;
          default: EI = 0; ES = it;
        }
        return { upper: ES / 1000, lower: EI / 1000 }; // mm
      }

      function parseSymbol(str) {
        // 'H7' -> {symbol:'H', grade:7}  'p6' -> {symbol:'p', grade:6}
        const m = str.match(/^([A-Za-z]+)(\d+)$/);
        if (!m) return null;
        return { symbol: m[1], grade: parseInt(m[2]) };
      }

      function calcFit() {
        const d = parseFloat($("fit-size").value);
        if (!(d > 0) || d > 500) {
          $("fit-right").innerHTML = `<div class="memo">呼び寸法は 0 を超え 500 mm 以下で入れてください（JIS B 0401 の表の範囲）。</div>`;
          return;
        }
        const hStr = $("fit-hole").value;
        const sStr = $("fit-shaft").value;
        const h = parseSymbol(hStr);
        const s = parseSymbol(sStr);
        if (!h || !s) return;

        const hole = getHoleLimits(d, h.symbol, h.grade);
        const shaft = getShaftLimits(d, s.symbol, s.grade);
        if (!shaft) {
          $("fit-right").innerHTML = `<div class="memo">${sStr} は呼び径 ${d} mm の区分では規格に定義がありません（t は 24 mm 超から）。</div>`;
          return;
        }

        const hMax = d + hole.upper;
        const hMin = d + hole.lower;
        const sMax = d + shaft.upper;
        const sMin = d + shaft.lower;

        // すきま（正）/ しめしろ（負のすきま）
        const maxClear = hMax - sMin; // 最大すきま（正ならすきま）
        const minClear = hMin - sMax; // 最小すきま（負ならしめしろ）

        let fitType, fitClass, fitIcon;
        if (minClear >= 0) {
          fitType = "すきまばめ";
          fitClass = "good";
          fitIcon = "🔵";
        } else if (maxClear <= 0) {
          fitType = "しまりばめ";
          fitClass = "bad";
          fitIcon = "🔴";
        } else {
          fitType = "中間ばめ";
          fitClass = "warn";
          fitIcon = "🟡";
        }

        const right = $("fit-right");
        right.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 18px">
      <div style="font-size:24px">${fitIcon}</div>
      <div>
        <div style="font-weight:700;font-size:16px">${hStr} / ${sStr} &nbsp;
          <span class="fit-type-badge ${fitClass === "good" ? "good-text" : fitClass === "bad" ? "bad-text" : "warn-text"}" style="border-color:currentColor">${fitType}</span>
        </div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px">呼び径 ${d} mm</div>
      </div>
    </div>

    <div class="fit-summary">
      <div class="fit-sum-item">
        <div class="fit-sum-label">最大すきま / しめしろ</div>
        <div class="fit-sum-val ${maxClear >= 0 ? "good-text" : "bad-text"}">${maxClear >= 0 ? "+" : ""}${(maxClear * 1000).toFixed(1)} μm</div>
      </div>
      <div class="fit-sum-item">
        <div class="fit-sum-label">最小すきま / しめしろ</div>
        <div class="fit-sum-val ${minClear >= 0 ? "good-text" : "bad-text"}">${minClear >= 0 ? "+" : ""}${(minClear * 1000).toFixed(1)} μm</div>
      </div>
      <div class="fit-sum-item">
        <div class="fit-sum-label">穴の公差幅（IT${h.grade}）</div>
        <div class="fit-sum-val" style="color:var(--accent)">${((hole.upper - hole.lower) * 1000).toFixed(0)} μm</div>
      </div>
      <div class="fit-sum-item">
        <div class="fit-sum-label">軸の公差幅（IT${s.grade}）</div>
        <div class="fit-sum-val" style="color:var(--accent)">${((shaft.upper - shaft.lower) * 1000).toFixed(0)} μm</div>
      </div>
    </div>

    <div class="fit-result-grid">
      <div class="fit-block">
        <div class="fit-block-title">🕳 穴 — ${hStr}</div>
        <div class="fit-dim-row"><span class="fit-dim-label">最大穴径（上の寸法）</span><span class="fit-dim-val hl">Ø ${hMax.toFixed(3)} mm</span></div>
        <div class="fit-dim-row"><span class="fit-dim-label">最小穴径（下の寸法）</span><span class="fit-dim-val">${hMin.toFixed(3)} mm</span></div>
        <div class="fit-dim-row"><span class="fit-dim-label">上偏差 ES</span><span class="fit-dim-val">${hole.upper >= 0 ? "+" : ""}${(hole.upper * 1000).toFixed(0)} μm</span></div>
        <div class="fit-dim-row"><span class="fit-dim-label">下偏差 EI</span><span class="fit-dim-val">${hole.lower >= 0 ? "+" : ""}${(hole.lower * 1000).toFixed(0)} μm</span></div>
        <div class="fit-dim-row"><span class="fit-dim-label">公差幅</span><span class="fit-dim-val">${((hole.upper - hole.lower) * 1000).toFixed(0)} μm</span></div>
        <div style="margin-top:8px;font-size:12px;color:var(--accent);font-family:'Inter',monospace">
          Ø${d} <sup>+${(hole.upper * 1000).toFixed(0)}</sup><sub>${hole.lower >= 0 ? "+" : ""}${(hole.lower * 1000).toFixed(0)}</sub> μm
        </div>
      </div>
      <div class="fit-block">
        <div class="fit-block-title">⚙️ 軸 — ${sStr}</div>
        <div class="fit-dim-row"><span class="fit-dim-label">最大軸径（上の寸法）</span><span class="fit-dim-val hl">Ø ${sMax.toFixed(3)} mm</span></div>
        <div class="fit-dim-row"><span class="fit-dim-label">最小軸径（下の寸法）</span><span class="fit-dim-val">${sMin.toFixed(3)} mm</span></div>
        <div class="fit-dim-row"><span class="fit-dim-label">上偏差 es</span><span class="fit-dim-val">${shaft.upper >= 0 ? "+" : ""}${(shaft.upper * 1000).toFixed(0)} μm</span></div>
        <div class="fit-dim-row"><span class="fit-dim-label">下偏差 ei</span><span class="fit-dim-val">${shaft.lower >= 0 ? "+" : ""}${(shaft.lower * 1000).toFixed(0)} μm</span></div>
        <div class="fit-dim-row"><span class="fit-dim-label">公差幅</span><span class="fit-dim-val">${((shaft.upper - shaft.lower) * 1000).toFixed(0)} μm</span></div>
        <div style="margin-top:8px;font-size:12px;color:var(--accent);font-family:'Inter',monospace">
          Ø${d} <sup>${shaft.upper >= 0 ? "+" : ""}${(shaft.upper * 1000).toFixed(0)}</sup><sub>${shaft.lower >= 0 ? "+" : ""}${(shaft.lower * 1000).toFixed(0)}</sub> μm
        </div>
      </div>
    </div>
  `;
      }
      // 初期計算
