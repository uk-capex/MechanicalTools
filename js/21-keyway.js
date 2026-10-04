      // ════════════════════════════════════════════════════
      //  TAB: キー溝寸法
      // ════════════════════════════════════════════════════
      // 2026-10 旧JIS を作り直し（旧データは新JISの表を写して境界だけずらしたもので、旧JISの寸法ではなかった）
      //
      // 新JIS B 1301:1996 平行キー溝寸法  [d_min, d_max, b, h, t1, t2, L_min, L_max]
      //  出典：小原歯車 KHK「キー及びキー溝 JIS B 1301:1996より抜粋」、平和実業カタログ p.168、三木プーリ技術資料
      //  キー長さ L は規格表に 35×22 までしか記載がない（36×20 以上は「－」）→ null で「—」表示
      //  （旧データは 36×20 以上に L を入れていて、40×22 以降は1行ずれた値だった）
      //  括弧付きサイズ (7×7)(15×10)(24×16)(35×22)(38×24)(42×26) は新設計に使わないため載せない
      const KW_NEW = [
        [6, 8, 2, 2, 1.2, 1.0, 6, 20],
        [8, 10, 3, 3, 1.8, 1.4, 6, 36],
        [10, 12, 4, 4, 2.5, 1.8, 8, 45],
        [12, 17, 5, 5, 3.0, 2.3, 10, 56],
        [17, 22, 6, 6, 3.5, 2.8, 14, 70],
        [22, 30, 8, 7, 4.0, 3.3, 18, 90],
        [30, 38, 10, 8, 5.0, 3.3, 22, 110],
        [38, 44, 12, 8, 5.0, 3.3, 28, 140],
        [44, 50, 14, 9, 5.5, 3.8, 36, 160],
        [50, 58, 16, 10, 6.0, 4.3, 45, 180],
        [58, 65, 18, 11, 7.0, 4.4, 50, 200],
        [65, 75, 20, 12, 7.5, 4.9, 56, 220],
        [75, 85, 22, 14, 9.0, 5.4, 63, 250],
        [85, 95, 25, 14, 9.0, 5.4, 70, 280],
        [95, 110, 28, 16, 10.0, 6.4, 80, 320],
        [110, 130, 32, 18, 11.0, 7.4, 90, 360],
        [130, 150, 36, 20, 12.0, 8.4, null, null],
        [150, 170, 40, 22, 13.0, 9.4, null, null],
        [170, 200, 45, 25, 15.0, 10.4, null, null],
        [200, 230, 50, 28, 17.0, 11.4, null, null],
        [230, 260, 56, 32, 20.0, 12.4, null, null],
        [260, 290, 63, 32, 20.0, 12.4, null, null],
        [290, 330, 70, 36, 22.0, 14.4, null, null],
        [330, 380, 80, 40, 25.0, 15.4, null, null],
        [380, 440, 90, 45, 28.0, 17.4, null, null],
        [440, 500, 100, 50, 31.0, 19.5, null, null],
      ];

      // こう配キー（JIS B 1301:1996） [d_min, d_max, b, h, t1, t2]
      // 出典：NBK 技術資料「キー及びキー溝」、平和実業カタログ p.168（勾配キー溝寸法表）で照合。t2 は平行キーと異なる
      const KW_TAPER = [
        [6, 8, 2, 2, 1.2, 0.5],
        [8, 10, 3, 3, 1.8, 0.9],
        [10, 12, 4, 4, 2.5, 1.2],
        [12, 17, 5, 5, 3.0, 1.7],
        [17, 22, 6, 6, 3.5, 2.2],
        [22, 30, 8, 7, 4.0, 2.4],
        [30, 38, 10, 8, 5.0, 2.4],
        [38, 44, 12, 8, 5.0, 2.4],
        [44, 50, 14, 9, 5.5, 2.9],
        [50, 58, 16, 10, 6.0, 3.4],
        [58, 65, 18, 11, 7.0, 3.4],
        [65, 75, 20, 12, 7.5, 3.9],
        [75, 85, 22, 14, 9.0, 4.4],
        [85, 95, 25, 14, 9.0, 4.4],
        [95, 110, 28, 16, 10.0, 5.4],
        [110, 130, 32, 18, 11.0, 6.4],
      ];

      // 旧JIS B 1301:1959 平行キー（1種・2種共通の寸法）  [d_min, d_max, b, h, t1, t2, L_min, L_max]
      //  出典：三木プーリ「平行キー及びキー溝の寸法と許容差（JIS B 1301-1959 旧JIS 抜粋）」（〜32×20）、
      //        平和実業カタログ p.168「旧JISキー溝寸法表（JIS B 1301-1959抜粋）」（〜56×35.5）、
      //        日之出スッピル 旧JIS平行キー寸法表（b×h・キー公差 〜50×31.5）、減速機資料「JIS B 1301-1976抜粋 旧JIS 1種」
      //  ・1種と2種は適用軸径・b×h・t1・t2が同じで、違うのは公差だけ（KW_TOL）
      //  ・先頭行は「10以上13以下」、以降は「を超え〜以下」
      //  ・250mm を超える旧JISの表は出典が見つからないため載せない
      //  ・キー長さ L は出典表に記載なし → null
      const KW_OLD = [
        [10, 13, 4, 4, 2.5, 1.5, null, null],
        [13, 20, 5, 5, 3, 2, null, null],
        [20, 30, 7, 7, 4, 3, null, null],
        [30, 40, 10, 8, 4.5, 3.5, null, null],
        [40, 50, 12, 8, 4.5, 3.5, null, null],
        [50, 60, 15, 10, 5, 5, null, null],
        [60, 70, 18, 12, 6, 6, null, null],
        [70, 80, 20, 13, 7, 6, null, null],
        [80, 95, 24, 16, 8, 8, null, null],
        [95, 110, 28, 18, 9, 9, null, null],
        [110, 125, 32, 20, 10, 10, null, null],
        [125, 140, 35, 22, 11, 11, null, null],
        [140, 160, 38, 24, 12, 12, null, null],
        [160, 180, 42, 26, 13, 13, null, null],
        [180, 200, 45, 28, 14, 14, null, null],
        [200, 224, 50, 31.5, 16, 15.5, null, null],
        [224, 250, 56, 35.5, 18, 17.5, null, null],
      ];
      const KW_OLD1 = KW_OLD; // 1種
      const KW_OLD2 = KW_OLD; // 2種（寸法は1種と同じ）

      // 公差（キー幅 b / キー高さ h / 軸溝 b1 / ボス溝 b2 / 溝深さ t1・t2）
      //  出典：三木プーリ技術資料（JIS B 1301-1959 抜粋）、日之出スッピル寸法表
      //  1種：キーが p7（プラス側）で溝 H8/F7 → キーを締めて入れる側（精密）
      //  2種：キーが h8 で溝 H9/E9 → すきま側（一般）
      //  ※旧データは「1種＝D10すきま／2種＝JS9中間」と逆になっていた
      const KW_TOL = {
        new: { key: "h9", h: "h9（8×7以上は h11）", b1: "N9（普通形）", b2: "JS9（普通形）", t: "+0.1〜+0.3", note: "普通形。滑動形は b1:H9／b2:D10、締込み形は b1・b2:P9" },
        old1: { key: "p7", h: "h9", b1: "H8", b2: "F7", t: "+0.05", note: "キーをプラス側に作り、締めて入れる側" },
        old2: { key: "h8", h: "h10", b1: "H9", b2: "E9", t: "+0.1", note: "キーをマイナス側に作り、すきまで入れる側" },
      };

      let kwCurrentTab = "new";

      const KW_DATA = { new: KW_NEW, old1: KW_OLD1, old2: KW_OLD2 };
      const KW_LABEL = { new: "新JIS", old1: "旧JIS 1種", old2: "旧JIS 2種" };
      const KW_COLOR = { new: "var(--accent)", old1: "var(--warn)", old2: "var(--bad)" };
      const kwLText = (r) => (r[6] != null ? `${r[6]} 〜 ${r[7]}` : "—");
      // 適用軸径の判定：先頭行は「以上」、以降は「を超え」
      const kwHit = (data, d) =>
        data.findIndex((r, i) => (i === 0 ? d >= r[0] : d > r[0]) && d <= r[1]);
      const kwRange = (data) => `${data[0][0]}〜${data[data.length - 1][1]}`;

      function switchKwTab(tab, el) {
        kwCurrentTab = tab;
        document
          .querySelectorAll('[id^="kw-tab-"]')
          .forEach((e) => e.classList.remove("active"));
        el.classList.add("active");
        ["new", "old1", "old2"].forEach((t) => {
          const el = document.getElementById(`kw-table-${t}`);
          if (el) el.style.display = t === tab ? "" : "none";
        });
        filterKeyway();
      }

      function initKeyway() {
        renderKwTaperTable();
        filterKeyway();
      }

      function renderKwTaperTable() {
        const tbody = document.getElementById("kw-tbody-taper");
        if (!tbody) return;
        tbody.innerHTML = KW_TAPER.map(
          (r) => `
    <tr>
      <td>${r[0]} 〜 ${r[1]}</td>
      <td style="font-weight:700;color:var(--accent)">${r[2]}</td>
      <td>${r[3]}</td>
      <td style="color:var(--good)">${r[4]}</td>
      <td style="color:var(--warn)">${r[5]}</td>
    </tr>`,
        ).join("");
      }

      function renderKwTableFiltered(tabType, highlightD) {
        const tbodyId = `kw-tbody-${tabType}`;
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        const data = KW_DATA[tabType];
        const hit = highlightD > 0 ? kwHit(data, highlightD) : -1;
        const bColor = KW_COLOR[tabType];
        tbody.innerHTML = data
          .map((r, i) => {
            const isMatch = i === hit;
            const bg = isMatch ? "background:var(--accent-dim);" : "";
            const lo = i === 0 ? `${r[0]}以上` : `${r[0]}`;
            return `<tr data-kw-idx="${i}" onclick="highlightKw(this,'${tbodyId}',${i},'${tabType}')" style="cursor:pointer;${bg}">
      <td>${isMatch ? `<b style="color:var(--accent)">` : ""} ${lo} 〜 ${r[1]}${isMatch ? "</b>" : ""}</td>
      <td style="font-weight:700;color:${bColor}">${r[2]}</td>
      <td>${r[3]}</td>
      <td style="color:var(--good)">${r[4]}</td>
      <td style="color:var(--warn)">${r[5]}</td>
      <td style="color:var(--muted);font-size:11px">${kwLText(r)}</td>
    </tr>`;
          })
          .join("");
      }

      function highlightKw(row, tbodyId, idx, tabType) {
        document
          .querySelectorAll(`#${tbodyId} tr`)
          .forEach((r) => (r.style.background = ""));
        row.style.background = "var(--accent-dim)";
        highlightKwByData((KW_DATA[tabType] || KW_NEW)[idx], tabType, idx);
      }

      function highlightKwByData(r, tabType, idx) {
        const card = document.getElementById("kw-detail-card");
        const content = document.getElementById("kw-detail-content");
        const label = document.getElementById("kw-detail-label");
        const bColor = KW_COLOR[tabType];
        const tol = KW_TOL[tabType];
        if (!(card && content && r)) return;
        card.style.display = "";
        if (label)
          label.textContent = `${KW_LABEL[tabType]} — 軸径 ${r[0]}${idx === 0 ? "以上" : "超"}〜${r[1]}mm の詳細`;
        content.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">
        <div class="card" style="border-color:${bColor};background:var(--surface2)">
          <div class="card-label">キー幅 b</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:${bColor}">${r[2]}<span style="font-size:12px;color:var(--muted)"> mm</span></div>
          <div style="font-size:10px;color:${bColor};margin-top:3px">キー ${tol.key}／溝 ${tol.b1}・${tol.b2}</div>
        </div>
        <div class="card good"><div class="card-label">軸溝深さ t₁</div><div class="card-value" style="color:var(--good)">${r[4]}<span class="card-unit">mm</span></div></div>
        <div class="card warn"><div class="card-label">ボス溝深さ t₂</div><div class="card-value" style="color:var(--warn)">${r[5]}<span class="card-unit">mm</span></div></div>
        <div class="card"><div class="card-label">キー高さ h</div><div class="card-value">${r[3]}<span class="card-unit">mm</span></div></div>
        <div class="card"><div class="card-label">適用軸径</div><div style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:600">${r[0]}〜${r[1]}<span class="card-unit">mm</span></div></div>
        <div class="card"><div class="card-label">キー長さ L</div><div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600">${kwLText(r)}${r[6] != null ? '<span class="card-unit">mm</span>' : ""}</div></div>
      </div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:8px 10px;font-size:11px;color:var(--muted);line-height:1.7">
        公差：キー b ${tol.key}・h ${tol.h}／軸溝 b₁ ${tol.b1}・ボス溝 b₂ ${tol.b2}／t₁・t₂ ${tol.t}（${tol.note}）<br>
        端部形状：A形（両丸）/ B形（両角）/ C形（片丸片角）— いずれも上記寸法は共通${r[6] == null ? "<br>キー長さ L は出典の表に記載なし" : ""}
      </div>`;
      }

      function filterKeyway() {
        const d = parseFloat(document.getElementById("kw-shaft-d")?.value) || 0;
        const info = document.getElementById("kw-match-info");
        const tabType = kwCurrentTab;
        const data = KW_DATA[tabType];

        // 全タブ再描画（軸径ハイライト適用）
        ["new", "old1", "old2"].forEach((t) => renderKwTableFiltered(t, d));

        if (!info) return;
        if (d <= 0) {
          info.textContent = "全件表示中";
          if (typeof calcKeyStrength === "function") calcKeyStrength();
          return;
        }
        const idx = kwHit(data, d);
        if (idx >= 0) {
          const r = data[idx];
          // 新旧で寸法が違う場合に注意を出す
          const other = tabType === "new" ? KW_OLD : KW_NEW;
          const oi = kwHit(other, d);
          const o = oi >= 0 ? other[oi] : null;
          const same = o && o[2] === r[2] && o[3] === r[3] && o[4] === r[4] && o[5] === r[5];
          const cmp = o
            ? same
              ? ` <span style="color:var(--muted)">（${tabType === "new" ? "旧JIS" : "新JIS"}も同寸法・公差は違う）</span>`
              : ` <span style="color:var(--bad)">★${tabType === "new" ? "旧JIS" : "新JIS"}では ${o[2]}×${o[3]}（t₁=${o[4]} t₂=${o[5]}）</span>`
            : "";
          info.innerHTML = `✅ 軸径 <b style="color:var(--accent)">${d}mm</b> → b=<b style="color:var(--accent)">${r[2]}mm</b> h=${r[3]}mm t₁=${r[4]}mm t₂=${r[5]}mm${cmp}`;
          highlightKwByData(r, tabType, idx);
        } else {
          info.innerHTML = `<span style="color:var(--warn)">⚠ 軸径 ${d}mm は対応範囲外（${KW_LABEL[tabType]}は ${kwRange(data)}mm）</span>`;
        }
        if (typeof calcKeyStrength === "function") calcKeyStrength();
      }

      // ════════════════════════════════════════════════════
      //  キー強度チェック（平行キー）2026-10 追加
      // ════════════════════════════════════════════════════
      //  式（材料力学の基本式。JIS B 1301 自体に強度の規定はない）
      //   接線力      F = 2T / d
      //   有効長さ    le = L（両角）／ L − b（両丸）／ L − b/2（片丸）
      //   せん断      τ = F / (b · le)            ≦ τa = σy(キー) / (√3 · S)
      //   面圧（ボス）p = F / (k · le)  k = min(t2, h − t1)（ボス側に掛かる高さ）
      //   面圧（軸）  p = F / (t1 · le)
      //   許容面圧    pa = min(σy(相手), σy(キー)) / S
      //  ・面取り分の接触高さ減は見ていない（実際はわずかに面圧が上がる）
      //  ・安全率 S は「ツール仮定」。材料値は JIS の下限値
      //    S45C 焼ならし345・調質490、SCM440 調質835 は NBK 技術資料「鋼材」（JIS G 4051/4053 参考値）で照合（2026-10）
      //  NG時の対策：必要キー長さ／必要な降伏点（材料候補）／2本キー（一般に1.5倍の扱い）／軸径アップ（同じ規格の上のサイズ）
      //  ガタ：キー幅と溝幅の公差（JIS B 1301:1996 表、ISO 286 の IT・基本偏差で計算）からすきま／しめしろを出す
      const KS_MAT = {
        S45C:   { name: "S45C（焼ならし）", sy: 345, src: "JIS G 4051 降伏点345以上" },
        S45CH:  { name: "S45C（調質）",     sy: 490, src: "JIS G 4051 参考（調質品）の降伏点490以上" },
        SS400:  { name: "SS400",            sy: 245, src: "JIS G 3101 降伏点245以上（t≦16）" },
        SCM440: { name: "SCM440（調質）",   sy: 835, src: "JIS G 4053 参考 降伏点835以上" },
        SUS304: { name: "SUS304",           sy: 205, src: "JIS G 4303 耐力205以上" },
        FCD450: { name: "FCD450（球状黒鉛鋳鉄）", sy: 280, src: "JIS G 5502 耐力280以上" },
        FC250:  { name: "FC250（ねずみ鋳鉄）",    sy: 250, src: "JIS G 5501 引張強さ250以上（降伏点なし・脆性）", brittle: true },
        SKD11:  { name: "SKD11（焼入焼戻し）",    sy: null, src: "JIS G 4404 焼入焼戻し品（降伏点の規格値なし）", brittle: true, hard: true },
        SKD61:  { name: "SKD61（焼入焼戻し）",    sy: null, src: "JIS G 4404 焼入焼戻し品（降伏点の規格値なし）", brittle: true, hard: true },
      };
      const KS_MAT_KEY = ["S45C", "S45CH", "SS400", "SUS304"];
      const KS_MAT_HUB = ["S45C", "SS400", "FCD450", "FC250", "SUS304", "S45CH", "SKD11", "SKD61"];
      const KS_MAT_SHAFT = ["S45C", "S45CH", "SCM440", "SS400", "SUS304"];
      const ksSy = (m) => (m.sy == null ? Infinity : m.sy);

      // キー幅・溝幅の公差（μm）[下, 上]。16-fit.js の IT 表と基本偏差を使う
      //  JS9 は JIS B 1301 の表どおり ±IT/2（丸めなし。b=2,3 で ±12.5）
      function kwBTol(sym, b) {
        const i = fitIdx(b);
        const g = sym.replace(/\d+$/, "");
        const IT = getIT(b, parseInt(sym.match(/\d+$/)[0]));
        switch (g) {
          case "h": return [-IT, 0];
          case "p": return [SHAFT_DEV.p[i], SHAFT_DEV.p[i] + IT];
          case "H": return [0, IT];
          case "JS": return [-IT / 2, IT / 2];
          case "N": return b <= 3 ? [-4 - IT, -4] : [-IT, 0]; // IT9 は ES=0（3mm以下は ES=−4）
          case "P": return [-SHAFT_DEV.p[i] - IT, -SHAFT_DEV.p[i]]; // IT8 超は ES=−p
          case "D": return [SHAFT_DEV.d[i], SHAFT_DEV.d[i] + IT];
          case "E": return [SHAFT_DEV.e[i], SHAFT_DEV.e[i] + IT];
          case "F": return [SHAFT_DEV.f[i], SHAFT_DEV.f[i] + IT];
        }
        return null;
      }
      const KS_FIT = {
        normal: { label: "普通形", key: "h9", b1: "N9", b2: "JS9" },
        tight:  { label: "締込み形", key: "h9", b1: "P9", b2: "P9" },
        slide:  { label: "滑動形", key: "h9", b1: "H9", b2: "D10" },
        old1:   { label: "旧JIS 1種", key: "p7", b1: "H8", b2: "F7" },
        old2:   { label: "旧JIS 2種", key: "h8", b1: "H9", b2: "E9" },
      };
      // 溝とキーのすきま（+）／しめしろ（−）の範囲 μm
      function kwPlay(fit, b) {
        const k = kwBTol(fit.key, b), g1 = kwBTol(fit.b1, b), g2 = kwBTol(fit.b2, b);
        return { shaft: [g1[0] - k[1], g1[1] - k[0]], hub: [g2[0] - k[1], g2[1] - k[0]] };
      }
      const fmtPlay = ([lo, hi]) => {
        const f = (v) => (v > 0 ? `すきま${+v.toFixed(1)}` : v < 0 ? `しめしろ${+(-v).toFixed(1)}` : "0");
        return `${f(hi)} 〜 ${f(lo)} μm`;
      };

      function ksFillSelect(id, keys, def) {
        const el = document.getElementById(id);
        if (!el || el.options.length) return;
        el.innerHTML = keys.map((k) => `<option value="${k}"${k === def ? " selected" : ""}>${KS_MAT[k].name}${KS_MAT[k].sy ? `（σy ${KS_MAT[k].sy}）` : "（割れ注意）"}</option>`).join("");
      }

      // 判定本体（対策の逆算でも使う）
      function ksEval(T, d, r, L, cut, S, mk, mh, ms) {
        const b = r[2], h = r[3], t1 = r[4], t2 = r[5];
        const le = L - cut;
        const F = 2000 * T / d;
        const kHub = Math.min(t2, h - t1);
        const tauA = ksSy(mk) / (Math.sqrt(3) * S);
        const paHub = Math.min(ksSy(mh), ksSy(mk)) / S;
        const paShaft = Math.min(ksSy(ms), ksSy(mk)) / S;
        const items = [
          { key: "tau", name: "キーのせん断", v: F / (b * le), a: tauA, area: b },
          { key: "hub", name: "面圧（ボス側）", v: F / (kHub * le), a: paHub, area: kHub },
          { key: "shaft", name: "面圧（軸側）", v: F / (t1 * le), a: paShaft, area: t1 },
        ].map((it) => ({ ...it, ratio: it.v / it.a, leReq: F / (it.area * it.a) }));
        const worst = items.reduce((a, c) => (c.ratio > a.ratio ? c : a));
        return { F, le, kHub, items, worst, ok: worst.ratio <= 1, leReq: Math.max(...items.map((i) => i.leReq)) };
      }

      function ksGoShrink(d, T, hub) {
        const D = document.getElementById("sh-D"), Tt = document.getElementById("sh-T");
        if (D) D.value = d;
        if (Tt) Tt.value = Math.round(T);
        // ボス材を焼き嵌めタブの穴側プリセットに合わせる（同名があるものだけ）
        const map = { S45C: "S45C", S45CH: "S45C", SUS304: "SUS304", FC250: "FC250", SKD11: "SKD11" };
        const sel = document.getElementById("sh-matH-sel");
        if (sel && map[hub] && [...sel.options].some((o) => o.value === map[hub])) {
          sel.value = map[hub];
          if (typeof shrinkSyncMat === "function") shrinkSyncMat("H");
        }
        const btn = document.querySelector(`.tab-btn[onclick*="'shrink'"]`);
        showTab("shrink", btn);
        if (typeof calcShrink === "function") calcShrink();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      function calcKeyStrength() {
        const box = document.getElementById("ks-result");
        if (!box) return;
        ksFillSelect("ks-mat-key", KS_MAT_KEY, "S45C");
        ksFillSelect("ks-mat-hub", KS_MAT_HUB, "S45C");
        ksFillSelect("ks-mat-shaft", KS_MAT_SHAFT, "S45C");
        const g = (id) => parseFloat(document.getElementById(id)?.value);
        const v = (id) => document.getElementById(id)?.value;
        const mode = v("ks-mode") || "torque";
        document.getElementById("ks-torque-wrap").style.display = mode === "torque" ? "" : "none";
        document.getElementById("ks-power-wrap").style.display = mode === "power" ? "" : "none";
        const fitSel = document.getElementById("ks-fit");
        if (fitSel) fitSel.disabled = kwCurrentTab !== "new";

        const d = g("kw-shaft-d") || 0;
        const data = KW_DATA[kwCurrentTab];
        const idx = d > 0 ? kwHit(data, d) : -1;
        if (idx < 0) {
          box.innerHTML = `<div class="memo">キー強度チェック：軸径を入れると、選ばれたキーで計算する。</div>`;
          return;
        }
        const r = data[idx];
        const b = r[2], h = r[3], t1 = r[4];

        let T = 0, Tsrc = "";
        if (mode === "power") {
          const P = g("ks-P") || 0, n = g("ks-n") || 0;
          if (!(P > 0 && n > 0)) { box.innerHTML = `<div class="memo">動力と回転数を入れてください。</div>`; return; }
          T = 9549.3 * P / n;
          Tsrc = `T = 9549·P/n = 9549×${P}/${n} = ${T.toFixed(1)} N·m`;
        } else {
          T = g("ks-T") || 0;
          Tsrc = `T = ${T} N·m`;
        }
        const L = g("ks-L") || 0;
        const end = v("ks-end") || "B";
        const cutOf = (bb) => (end === "A" ? bb : end === "C" ? bb / 2 : 0);
        const cut = cutOf(b);
        if (!(T > 0) || !(L - cut > 0)) {
          box.innerHTML = `<div class="memo">トルクとキー長さを入れてください（両丸は L＞b、片丸は L＞b/2 が必要）。</div>`;
          return;
        }
        const S = g("ks-sf") || 3;
        const mk = KS_MAT[v("ks-mat-key")], mh = KS_MAT[v("ks-mat-hub")], ms = KS_MAT[v("ks-mat-shaft")];
        const shrink = v("ks-shrink") === "yes";

        const R = ksEval(T, d, r, L, cut, S, mk, mh, ms);
        const LReq = Math.ceil(R.leReq + cut);
        const Tmax = T / R.worst.ratio;

        // ── NG時（または余裕が少ない時）の対策 ──
        const fixes = [];
        if (R.worst.ratio > 0.8) {
          // 1) キー長さ
          const Lmax = Math.floor(1.5 * d);
          fixes.push(LReq <= Lmax
            ? `キー長さを <b>${LReq}mm 以上</b>にする（1.5d＝${Lmax}mm 以内なので有効）`
            : `キー長さだけでは無理（必要 ${LReq}mm ＞ 1.5d＝${Lmax}mm。長くしても端に荷重が寄るだけ）`);
          // 2) 材料（面圧・せん断が要求する降伏点）
          const it = R.worst;
          if (it.key === "tau") {
            const need = Math.ceil(it.v * Math.sqrt(3) * S);
            const cand = KS_MAT_KEY.filter((k) => ksSy(KS_MAT[k]) >= need).map((k) => KS_MAT[k].name);
            fixes.push(`キー材の降伏点を <b>${need}MPa 以上</b>に${cand.length ? `（候補：${cand.join("・")}）` : "（一覧の材料では足りない）"}`);
          } else {
            const need = Math.ceil(it.v * S);
            const side = it.key === "hub" ? "ボス" : "軸";
            const list = it.key === "hub" ? KS_MAT_HUB : KS_MAT_SHAFT;
            const cand = list.filter((k) => ksSy(KS_MAT[k]) >= need && !KS_MAT[k].hard).map((k) => KS_MAT[k].name);
            const keyOk = ksSy(mk) >= need;
            fixes.push(`${side}とキーの降伏点を両方 <b>${need}MPa 以上</b>に（面圧は弱い方で決まる。${side}候補：${cand.length ? cand.join("・") : "一覧の材料では足りない"}${keyOk ? "" : `／キーも ${mk.name} では足りない → S45C（調質）等へ`}）`);
          }
          // 3) 2本キー
          fixes.push(R.worst.ratio <= 1.5
            ? `キーを2本（180°対向）にする → 一般に1本の1.5倍程度の扱いで OK（${(R.worst.ratio / 1.5 * 100).toFixed(0)}%）。2本の溝の割出し精度が要る`
            : `2本キー（1.5倍扱い）でも足りない（${(R.worst.ratio / 1.5 * 100).toFixed(0)}%）`);
          // 4) 軸径アップ（同じ規格の上のサイズ。L は今の値と 1.5d の小さい方）
          let up = null;
          for (let j = idx + 1; j < data.length && !up; j++) {
            const rr = data[j], dd = rr[0] + (j === 0 ? 0 : 1); // その欄に入る最小の整数径
            const LL = Math.min(Math.max(L, 0), Math.floor(1.5 * dd));
            const RR = ksEval(T, dd, rr, LL, cutOf(rr[2]), S, mk, mh, ms);
            if (RR.ok) up = { dd, rr, LL, ratio: RR.worst.ratio };
          }
          fixes.push(up
            ? `軸径を <b>φ${up.dd} 以上</b>にする → キー ${up.rr[2]}×${up.rr[3]}・L${up.LL} で OK（${(up.ratio * 100).toFixed(0)}%）。改造の規模は一番大きい`
            : `軸径アップ（この規格の範囲内）では見つからない`);
          // 5) 焼き嵌め・キーレス
          fixes.push(`焼き嵌め（冷やし嵌め）を併用してトルクの一部を摩擦で持たせる、またはキーレス（パワーロック等）に替える → 「焼き嵌めも併用」を選ぶと注意点を表示`);
        }

        // ── ガタ（キー幅と溝幅のすきま） ──
        const fit = KS_FIT[kwCurrentTab === "new" ? v("ks-fit") || "normal" : kwCurrentTab];
        const play = kwPlay(fit, b);
        const playNotes = [];
        const hubLoose = play.hub[1] > 0, shaftLoose = play.shaft[1] > 0;
        if (S >= 4 && (hubLoose || shaftLoose)) {
          playNotes.push(`<span style="color:var(--bad)">正逆転・衝撃でガタがあると、反転のたびにキーが溝を打って、フレッティング → 溝が広がる → さらにガタる、と進む。静的な計算が OK でも壊れるのはたいていこれ</span>`);
          playNotes.push(kwCurrentTab === "new" && fit !== KS_FIT.tight
            ? `対策：締込み形（両側P9）にする、焼き嵌めを併用してキーに頼らない、キーレスにする`
            : `対策：焼き嵌めを併用してキーに頼らない、キーレスにする`);
        } else if (S >= 3 && hubLoose) {
          playNotes.push(`起動停止・変動があるなら、ボス側のすきまが溝の摩耗につながる。キーとボス溝は現物合わせで「軽く叩いて入る」程度に`);
        }
        if (fit === KS_FIT.slide) playNotes.push(`滑動形はボスが軸方向に動く前提（すきまが大きい）。トルク伝達だけならこの形式は選ばない`);

        // ── 焼き嵌め併用 ──
        const shrinkNotes = [];
        if (shrink) {
          shrinkNotes.push(`締め代は「トルクの一部を摩擦で持たせる」最小限に。大きすぎる締め代は、キー溝の角の応力集中（一般に2〜3倍）と焼き嵌めの周方向の引張が重なって割れの起点になる`);
          shrinkNotes.push(`キー溝の角のR（r₂）は規格の範囲で大きめに取る`);
          if (mh.hard) shrinkNotes.push(`<span style="color:var(--bad)">ボスが ${mh.name}：硬くて粘りがないので、キー溝付きの焼き嵌めは割れやすい。冷やし嵌め（ボスを加熱しない）＋締め代を控えめ、溝角R大、またはキーレスに替えるのが無難。焼戻し温度を超える加熱は硬さが落ちるので不可</span>`);
          else if (mh.brittle) shrinkNotes.push(`<span style="color:var(--bad)">ボスがねずみ鋳鉄：引張に弱いので、焼き嵌めの周方向の引張で割れやすい。締め代は控えめに</span>`);
          shrinkNotes.push(`<button class="preset-btn" style="margin-top:4px" onclick="ksGoShrink(${d}, ${T.toFixed(2)}, '${v("ks-mat-hub")}')">🔥 焼き嵌めタブで計算する（呼び径 φ${d}・トルク ${T.toFixed(0)} N·m を反映）</button>`);
        }

        const notes = [];
        if (L > 1.5 * d) notes.push(`キー長さが軸径の1.5倍（${(1.5 * d).toFixed(0)}mm）を超えている。長いキーは端に荷重が寄って、計算どおりには分担しない（一般的な目安）`);
        if (r[6] != null && (L < r[6] || L > r[7])) notes.push(`キー長さ ${L}mm は JIS の長さ範囲（${r[6]}〜${r[7]}mm）の外`);
        if (mh.brittle && !mh.hard) notes.push(`ボスがねずみ鋳鉄（脆性材）。降伏点がないので引張強さで見ている。衝撃がある使い方では安全率を大きめに`);
        if (mh.hard) notes.push(`ボスが ${mh.name}：降伏点の規格値がないため、ボス側の面圧はキー材で判定している`);
        if (kwCurrentTab !== "new") notes.push(`旧JISのキー寸法で計算している`);
        notes.push(`材料値：キー ${mk.src}／ボス ${mh.src}／軸 ${ms.src}`);
        notes.push(`安全率 S はツール仮定。式は材料力学の基本式（JIS B 1301 に強度の規定はない）。面取りによる接触高さの減少は見ていない`);

        const col = (q) => (q <= 0.8 ? "var(--good)" : q <= 1 ? "var(--warn)" : "var(--bad)");
        const block = (title, arr, color) => arr.length ? `
      <div style="background:var(--surface2);border:1px solid ${color || "var(--border)"};border-radius:6px;padding:8px 10px;font-size:12px;line-height:1.7;margin-bottom:8px">
        <b style="color:${color || "var(--ink)"}">${title}</b><br>${arr.map((n) => "・" + n).join("<br>")}
      </div>` : "";
        box.innerHTML = `
      <div class="verdict-banner" style="border-color:${R.ok ? "var(--good)" : "var(--bad)"};background:${R.ok ? "var(--good-dim)" : "var(--bad-dim)"};margin-bottom:8px">
        <div class="verdict-icon">${R.ok ? "✅" : "❌"}</div>
        <div>
          <div class="verdict-main">キー ${b}×${h}×L${L}：${R.ok ? "OK" : "NG"}（${R.worst.name}が最も厳しい・${(R.worst.ratio * 100).toFixed(0)}%）</div>
          <div class="verdict-sub">${Tsrc}／接線力 F = 2T/d = ${(R.F / 1000).toFixed(2)} kN／有効長さ le = ${R.le.toFixed(1)} mm（${end === "A" ? "両丸 L−b" : end === "C" ? "片丸 L−b/2" : "両角 L"}）</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">
        ${R.items.map((it) => `<div class="card" style="border-color:${col(it.ratio)}">
          <div class="card-label">${it.name}</div>
          <div class="card-value" style="color:${col(it.ratio)}">${it.v.toFixed(1)}<span class="card-unit">MPa</span></div>
          <div style="font-size:10px;color:var(--muted);margin-top:3px">許容 ${it.a.toFixed(1)} MPa（${(it.ratio * 100).toFixed(0)}%）<br>${it.key === "tau" ? `幅 b=${b}` : `接触高さ ${it.area}`}</div>
        </div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
        <div class="card"><div class="card-label">必要なキー長さ</div><div class="card-value" style="color:var(--accent)">${LReq}<span class="card-unit">mm 以上</span></div><div style="font-size:10px;color:var(--muted);margin-top:3px">有効長さ ${R.leReq.toFixed(1)} mm＋端部 ${cut} mm</div></div>
        <div class="card"><div class="card-label">このキーで伝えられるトルク</div><div class="card-value">${Tmax.toFixed(0)}<span class="card-unit">N·m</span></div><div style="font-size:10px;color:var(--muted);margin-top:3px">安全率 S=${S} を見込んだ値</div></div>
      </div>
      ${block(R.ok ? "余裕が少ないときの打ち手（手を付けやすい順）" : "NGのときの打ち手（手を付けやすい順）", fixes, R.ok ? "var(--warn)" : "var(--bad)")}
      ${block(`キーのガタ（${fit.label}：キー ${fit.key}／軸溝 ${fit.b1}・ボス溝 ${fit.b2}、b=${b}）`, [`軸溝とキー：${fmtPlay(play.shaft)}`, `ボス溝とキー：${fmtPlay(play.hub)}`, ...playNotes], (S >= 4 && (hubLoose || shaftLoose)) ? "var(--bad)" : null)}
      ${block("焼き嵌めを併用するときの注意", shrinkNotes, "var(--warn)")}
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:8px 10px;font-size:11px;color:var(--muted);line-height:1.7">
        ${notes.map((n) => "・" + n).join("<br>")}<br>
        ・計算式：τ = F/(b·le)、p = F/(k·le)（ボス側 k = min(t₂, h−t₁) = ${R.kHub}、軸側 k = t₁ = ${t1}）、τa = σy/(√3·S)、pa = min(相手, キー)の σy / S<br>
        ・ガタ：キー幅と溝幅の公差（JIS B 1301 の公差域、値は ISO 286）から計算。実物は溝の仕上がり・面取り・摩耗で変わる
      </div>`;
      }
