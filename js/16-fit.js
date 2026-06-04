      // ════════════════════════════════════════
      // TAB: はめあい公差（JIS B 0401）
      // IT公差等級の基本偏差＋公差テーブル
      // ════════════════════════════════════════
      // 呼び寸法区分（上限値）
      const FIT_RANGES = [
        3, 6, 10, 14, 18, 24, 30, 40, 50, 65, 80, 100, 120,
        140, 160, 180, 200, 225, 250, 280, 315, 355, 400,
        450, 500,
      ];

      // IT基本公差 (μm) IT1〜IT16 × 寸法区分
      const IT_TABLE = {
        //        IT5  IT6  IT7  IT8  IT9  IT10 IT11
        "0-3": [4, 6, 10, 14, 25, 40, 60],
        "3-6": [5, 8, 12, 18, 30, 48, 75],
        "6-10": [6, 9, 15, 22, 36, 58, 90],
        "10-18": [8, 11, 18, 27, 43, 70, 110],
        "18-30": [9, 13, 21, 33, 52, 84, 130],
        "30-50": [11, 16, 25, 39, 62, 100, 160],
        "50-80": [13, 19, 30, 46, 74, 120, 190],
        "80-120": [15, 22, 35, 54, 87, 140, 220],
        "120-180": [18, 25, 40, 63, 100, 160, 250],
        "180-250": [20, 29, 46, 72, 115, 185, 290],
        "250-315": [23, 32, 52, 81, 130, 210, 320],
        "315-400": [25, 36, 57, 89, 140, 230, 360],
        "400-500": [27, 40, 63, 97, 155, 250, 400],
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
        const row = IT_TABLE[getRange(d)];
        const idx = {
          IT5: 0,
          IT6: 1,
          IT7: 2,
          IT8: 3,
          IT9: 4,
          IT10: 5,
          IT11: 6,
        }[grade];
        return row[idx]; // μm
      }

      // 基本偏差（μm）計算
      // 穴：H=0下偏差, JS=±IT/2, K,M,N,P
      // 軸：h=0上偏差, js=±IT/2, k,m,n,p,r,s,t,u, f,g,d,e
      function getHoleLimits(d, symbol, itGrade) {
        const it = getIT(d, "IT" + itGrade); // μm
        let ei, es; // ei=下の偏差(最小材料側), es=上の偏差(最大材料側)  μm
        switch (symbol) {
          case "H":
            ei = 0;
            es = it;
            break;
          case "JS":
            ei = -Math.floor(it / 2);
            es = Math.ceil(it / 2);
            break;
          case "K": {
            const delta = getIT(d, "IT" + itGrade);
            ei = -getKDelta(d, itGrade);
            es = it - getKDelta(d, itGrade);
            break;
          }
          case "M": {
            const v = getMOffset(d, itGrade);
            ei = -v;
            es = it - v;
            break;
          }
          case "N": {
            const v = getNOffset(d, itGrade);
            ei = -v;
            es = it - v;
            break;
          }
          case "P": {
            const v = getPOffset(d, itGrade);
            ei = -(it + v);
            es = -v;
            break;
          }
          default:
            ei = 0;
            es = it;
        }
        return { upper: es / 1000, lower: ei / 1000 }; // mm
      }

      function getKDelta(d, g) {
        // K7の場合の補正量（簡易）
        const r = getRange(d);
        const deltas = {
          "0-3": 0,
          "3-6": 1,
          "6-10": 1,
          "10-18": 1,
          "18-30": 2,
          "30-50": 2,
          "50-80": 2,
          "80-120": 3,
          "120-180": 3,
          "180-250": 4,
          "250-315": 4,
          "315-400": 4,
          "400-500": 5,
        };
        return deltas[r] || 0;
      }
      function getMOffset(d, g) {
        const r = getRange(d);
        const m = {
          "0-3": 2,
          "3-6": 4,
          "6-10": 6,
          "10-18": 7,
          "18-30": 8,
          "30-50": 9,
          "50-80": 11,
          "80-120": 13,
          "120-180": 15,
          "180-250": 17,
          "250-315": 20,
          "315-400": 21,
          "400-500": 23,
        };
        return m[r] || 0;
      }
      function getNOffset(d, g) {
        const r = getRange(d);
        const n = {
          "0-3": 4,
          "3-6": 8,
          "6-10": 10,
          "10-18": 12,
          "18-30": 15,
          "30-50": 17,
          "50-80": 20,
          "80-120": 23,
          "120-180": 27,
          "180-250": 31,
          "250-315": 34,
          "315-400": 37,
          "400-500": 40,
        };
        return n[r] || 0;
      }
      function getPOffset(d, g) {
        const r = getRange(d);
        const p = {
          "0-3": 6,
          "3-6": 12,
          "6-10": 15,
          "10-18": 18,
          "18-30": 22,
          "30-50": 26,
          "50-80": 32,
          "80-120": 37,
          "120-180": 43,
          "180-250": 50,
          "250-315": 56,
          "315-400": 62,
          "400-500": 68,
        };
        return p[r] || 0;
      }

      function getShaftLimits(d, symbol, itGrade) {
        const it = getIT(d, "IT" + itGrade); // μm
        let es, ei; // es=上偏差, ei=下偏差 μm
        switch (symbol) {
          case "h":
            es = 0;
            ei = -it;
            break;
          case "js":
            es = Math.ceil(it / 2);
            ei = -Math.floor(it / 2);
            break;
          case "k": {
            const kv = getKShaftOffset(d, itGrade);
            es = kv;
            ei = kv - it;
            break;
          }
          case "m": {
            const mv = getMShaftOffset(d, itGrade);
            es = mv;
            ei = mv - it;
            break;
          }
          case "n": {
            const nv = getNShaftOffset(d, itGrade);
            es = nv;
            ei = nv - it;
            break;
          }
          case "p": {
            const pv = getPShaftOffset(d, itGrade);
            es = pv;
            ei = pv - it;
            break;
          }
          case "r": {
            const rv = getRShaftOffset(d, itGrade);
            es = rv;
            ei = rv - it;
            break;
          }
          case "s": {
            const sv = getSShaftOffset(d, itGrade);
            es = sv;
            ei = sv - it;
            break;
          }
          case "t": {
            const tv = getTShaftOffset(d, itGrade);
            es = tv;
            ei = tv - it;
            break;
          }
          case "u": {
            const uv = getUShaftOffset(d, itGrade);
            es = uv;
            ei = uv - it;
            break;
          }
          case "f": {
            const fv = getFShaftOffset(d, itGrade);
            es = -fv;
            ei = -fv - it;
            break;
          }
          case "g": {
            const gv = getGShaftOffset(d, itGrade);
            es = -gv;
            ei = -gv - it;
            break;
          }
          case "d": {
            const dv = getDShaftOffset(d, itGrade);
            es = -dv;
            ei = -dv - it;
            break;
          }
          case "e": {
            const ev = getEShaftOffset(d, itGrade);
            es = -ev;
            ei = -ev - it;
            break;
          }
          default:
            es = 0;
            ei = -it;
        }
        return { upper: es / 1000, lower: ei / 1000 }; // mm
      }

      function getGShaftOffset(d) {
        const r = getRange(d);
        const t = {
          "0-3": 2,
          "3-6": 4,
          "6-10": 5,
          "10-18": 6,
          "18-30": 7,
          "30-50": 9,
          "50-80": 10,
          "80-120": 12,
          "120-180": 14,
          "180-250": 15,
          "250-315": 17,
          "315-400": 18,
          "400-500": 20,
        };
        return t[r] || 5;
      }
      function getFShaftOffset(d) {
        const r = getRange(d);
        const t = {
          "0-3": 6,
          "3-6": 10,
          "6-10": 13,
          "10-18": 16,
          "18-30": 20,
          "30-50": 25,
          "50-80": 30,
          "80-120": 36,
          "120-180": 43,
          "180-250": 50,
          "250-315": 56,
          "315-400": 62,
          "400-500": 68,
        };
        return t[r] || 20;
      }
      function getDShaftOffset(d) {
        const r = getRange(d);
        const t = {
          "0-3": 20,
          "3-6": 30,
          "6-10": 40,
          "10-18": 50,
          "18-30": 65,
          "30-50": 80,
          "50-80": 100,
          "80-120": 120,
          "120-180": 145,
          "180-250": 170,
          "250-315": 190,
          "315-400": 210,
          "400-500": 230,
        };
        return t[r] || 80;
      }
      function getEShaftOffset(d) {
        const r = getRange(d);
        const t = {
          "0-3": 14,
          "3-6": 20,
          "6-10": 25,
          "10-18": 32,
          "18-30": 40,
          "30-50": 50,
          "50-80": 60,
          "80-120": 72,
          "120-180": 85,
          "180-250": 100,
          "250-315": 110,
          "315-400": 125,
          "400-500": 135,
        };
        return t[r] || 50;
      }
      function getKShaftOffset(d, g) {
        const r = getRange(d);
        const t = {
          "0-3": 0,
          "3-6": 2,
          "6-10": 2,
          "10-18": 2,
          "18-30": 2,
          "30-50": 3,
          "50-80": 4,
          "80-120": 4,
          "120-180": 4,
          "180-250": 5,
          "250-315": 5,
          "315-400": 5,
          "400-500": 6,
        };
        return t[r] || 2;
      }
      function getMShaftOffset(d, g) {
        const r = getRange(d);
        const t = {
          "0-3": 2,
          "3-6": 6,
          "6-10": 9,
          "10-18": 11,
          "18-30": 12,
          "30-50": 13,
          "50-80": 15,
          "80-120": 18,
          "120-180": 21,
          "180-250": 24,
          "250-315": 27,
          "315-400": 29,
          "400-500": 32,
        };
        return t[r] || 12;
      }
      function getNShaftOffset(d, g) {
        const r = getRange(d);
        const t = {
          "0-3": 4,
          "3-6": 9,
          "6-10": 13,
          "10-18": 16,
          "18-30": 20,
          "30-50": 24,
          "50-80": 28,
          "80-120": 33,
          "120-180": 39,
          "180-250": 45,
          "250-315": 50,
          "315-400": 55,
          "400-500": 60,
        };
        return t[r] || 20;
      }
      function getPShaftOffset(d, g) {
        const r = getRange(d);
        const t = {
          "0-3": 6,
          "3-6": 12,
          "6-10": 15,
          "10-18": 18,
          "18-30": 22,
          "30-50": 26,
          "50-80": 32,
          "80-120": 37,
          "120-180": 43,
          "180-250": 50,
          "250-315": 56,
          "315-400": 62,
          "400-500": 68,
        };
        return t[r] || 26;
      }
      function getRShaftOffset(d, g) {
        const r = getRange(d);
        const t = {
          "0-3": 10,
          "3-6": 15,
          "6-10": 19,
          "10-18": 23,
          "18-30": 28,
          "30-50": 34,
          "50-80": 41,
          "80-120": 48,
          "120-180": 58,
          "180-250": 68,
          "250-315": 75,
          "315-400": 83,
          "400-500": 90,
        };
        return t[r] || 34;
      }
      function getSShaftOffset(d, g) {
        const r = getRange(d);
        const t = {
          "0-3": 14,
          "3-6": 19,
          "6-10": 23,
          "10-18": 28,
          "18-30": 35,
          "30-50": 43,
          "50-80": 53,
          "80-120": 64,
          "120-180": 79,
          "180-250": 93,
          "250-315": 101,
          "315-400": 111,
          "400-500": 123,
        };
        return t[r] || 43;
      }
      function getTShaftOffset(d, g) {
        const r = getRange(d);
        const t = {
          "0-3": 18,
          "3-6": 23,
          "6-10": 28,
          "10-18": 33,
          "18-30": 41,
          "30-50": 48,
          "50-80": 59,
          "80-120": 72,
          "120-180": 92,
          "180-250": 108,
          "250-315": 119,
          "315-400": 131,
          "400-500": 146,
        };
        return t[r] || 48;
      }
      function getUShaftOffset(d, g) {
        const r = getRange(d);
        const t = {
          "0-3": 18,
          "3-6": 23,
          "6-10": 28,
          "10-18": 33,
          "18-30": 41,
          "30-50": 60,
          "50-80": 76,
          "80-120": 91,
          "120-180": 124,
          "180-250": 146,
          "250-315": 166,
          "315-400": 189,
          "400-500": 214,
        };
        return t[r] || 60;
      }

      function parseSymbol(str) {
        // 'H7' -> {symbol:'H', grade:7}  'p6' -> {symbol:'p', grade:6}
        const m = str.match(/^([A-Za-z]+)(\d+)$/);
        if (!m) return null;
        return { symbol: m[1], grade: parseInt(m[2]) };
      }

      function calcFit() {
        const d = +$("fit-size").value;
        const hStr = $("fit-hole").value;
        const sStr = $("fit-shaft").value;
        const h = parseSymbol(hStr);
        const s = parseSymbol(sStr);
        if (!h || !s) return;

        const hole = getHoleLimits(d, h.symbol, h.grade);
        const shaft = getShaftLimits(d, s.symbol, s.grade);

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
        <div class="fit-sum-label">穴 IT公差</div>
        <div class="fit-sum-val" style="color:var(--accent)">${((hole.upper - hole.lower) * 1000).toFixed(0)} μm</div>
      </div>
      <div class="fit-sum-item">
        <div class="fit-sum-label">軸 IT公差</div>
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
        <div style="margin-top:8px;font-size:12px;color:var(--accent);font-family:'JetBrains Mono',monospace">
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
        <div style="margin-top:8px;font-size:12px;color:var(--accent);font-family:'JetBrains Mono',monospace">
          Ø${d} <sup>${shaft.upper >= 0 ? "+" : ""}${(shaft.upper * 1000).toFixed(0)}</sup><sub>${shaft.lower >= 0 ? "+" : ""}${(shaft.lower * 1000).toFixed(0)}</sub> μm
        </div>
      </div>
    </div>
  `;
      }
      // 初期計算
