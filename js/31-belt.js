      // ════════════════════════════════════════════════════
      //  TAB: Vベルト・タイミングベルト（2026-10 追加）
      // ════════════════════════════════════════════════════
      //  出典
      //   ・三ツ星ベルト「V-BELT & MAXSTAR WEDGE 設計資料」V852-E（2020年3月改訂）
      //     ベルト長さ L = 2C + π(D+d)/2 + (D−d)²/(4C)
      //     軸間距離 C = { b + √(b² − 8(D−d)²) } / 8、b = 2L − π(D+d)
      //     接触角 θ = 180 − 57.3(D−d)/C、スパン長さ Ls = √(C² − (D−d)²/4)
      //     一般Vベルト：呼び＝ピッチ周長（インチ）、計算はピッチ径（M形のみ外周長）
      //     ウェッジ 3V/5V/8V：呼び＝有効周長（インチ×10）、計算は有効径。有効径−ピッチ径＝1.2/2.6/5.0mm
      //     ウェッジの標準長さ（表1-1）・軸間距離の調整範囲（表2-14）・最小プーリ有効径（表2-11-2）
      //     ベルト速度 30m/s 超は鋳物プーリ不可・動バランス要
      //   ・一般Vベルトの在庫範囲の目安：三ツ星レッド M17〜55／A20〜145／B22〜165／C51〜195（インチ）
      //   ・SP形（SPZ/SPA/SPB/SPC）：呼び＝基準長さ（mm）、計算は基準径
      //   ・タイミングベルト：ピッチ周長＝歯数×ピッチ、プーリピッチ円径＝歯数×ピッチ/π
      //     台形歯（MXL/XL/L/H/XH）の呼びはピッチ周長を 0.1インチ単位で表す（例：210XL＝21.0インチ）
      //     T形・HTD（3M/5M/8M/14M）・STS（S3M/S5M/S8M/S14M）の呼びはピッチ周長 mm
      //   ・タイミングベルトのかみ合い歯数 6歯以上は一般的な目安（ツール仮定として表示）
      //   ・ベルト単位質量 mass（kg/m）：三ツ星「Vベルトの取付け方法」表2-1・2-2（スタンダード/レッド、マックスターウェッジ）
      //   ・タイミングプーリの外径＝ピッチ円径−2u（u2＝2u）。MXL 0.508 はミスミ BMXL（P.D.6.47/O.D.5.96）、
      //     T5 0.85 は T5 プーリ寸法表（10T：15.92/15.05）で確認。2026-10 追加照合：5M 1.14（20T 31.83/30.69）、8M 1.37（22T 56.02/54.65）、
      //     H 1.37（三ツ星 20H 80.85/79.48）、14M 2.80（64T 285.21/282.41）。ただし HTD は小径で外径を小さめに作る例あり（8M 28T 1.22、14M 28T 2.66）
      //     XL 0.51（ミスミ XL 20T 32.34/31.83）、L 0.77（ミスミ L 14T 42.45/41.68）、XH 2.794（XH 18T PD 5.0134in/OD 4.9034in）、
      //     S3M 0.76（ミスミ S3M 20T 19.10/18.34）、S8M 1.37（ミスミ S8M 20T 50.93/49.56）を確認。
      //     S5M は 0.96（ミスミ S5M 30T 47.75/46.79）で HTD 5M（1.14）と違う → 個別の値に修正（2026-10）。
      //     3M（HTD）は一般値 0.762（S3M と同値）、S14M は HTD 14M と同じ値を仮定（どちらも未照合）
      const BELT_TYPES = {
        // kind: classic / wedge / sp / timing
        M:  { kind: "classic", label: "一般Vベルト M形", w: 10.0, h: 5.5, mass: 0.05, range: [17, 55], outer: true },
        A:  { kind: "classic", label: "一般Vベルト A形", w: 12.5, h: 9.0, mass: 0.12, range: [20, 145] },
        B:  { kind: "classic", label: "一般Vベルト B形", w: 16.5, h: 11.0, mass: 0.20, range: [22, 165] },
        C:  { kind: "classic", label: "一般Vベルト C形", w: 22.0, h: 14.0, mass: 0.35, range: [51, 195] },
        D:  { kind: "classic", label: "一般Vベルト D形", w: 31.5, h: 19.0, mass: 0.65, range: null },
        "3V": { kind: "wedge", label: "細幅（ウェッジ）3V", w: 9.5, h: 8.0, mass: 0.08, dEP: 1.2, minDe: 67, minDeX: 56,
          sizes: [250,265,280,300,315,335,355,375,400,425,450,475,500,530,560,600,630,670,710,750,800,850,900,950,1000,1060,1120,1180,1250,1320,1400],
          adj: [[475,15,25],[710,20,35],[1060,20,40],[1250,20,50],[1400,20,60]] },
        "5V": { kind: "wedge", label: "細幅（ウェッジ）5V", w: 16.0, h: 13.5, mass: 0.23, dEP: 2.6, minDe: 180, minDeX: 112,
          sizes: [500,530,560,600,630,670,710,750,800,850,900,950,1000,1060,1120,1180,1250,1320,1400,1500,1600,1700,1800,1900,2000,2120,2240,2360,2500,2650,2800,3000,3150,3350,3550],
          adj: [[710,25,35],[1060,25,40],[1250,25,50],[1700,25,60],[2000,25,65],[2240,35,75],[2360,35,80],[2650,35,85],[3000,35,90],[3550,35,105]] },
        "8V": { kind: "wedge", label: "細幅（ウェッジ）8V", w: 25.5, h: 23.0, mass: 0.60, dEP: 5.0, minDe: 315, minDeX: null,
          sizes: [1000,1060,1120,1180,1250,1320,1400,1500,1600,1700,1800,1900,2000,2120,2240,2360,2500,2650,2800,3000,3150,3350,3550,3750,4000,4250,4500,4750,5000,5600,6000],
          adj: [[1060,40,40],[1250,40,50],[1700,40,60],[2000,50,65],[2240,50,75],[2360,50,80],[2650,50,85],[3000,50,90],[3150,50,105],[3550,55,105],[3750,55,115],[6000,55,140]] },
        SPZ: { kind: "sp", label: "SP形 SPZ（ISO）" },
        SPA: { kind: "sp", label: "SP形 SPA（ISO）" },
        SPB: { kind: "sp", label: "SP形 SPB（ISO）" },
        SPC: { kind: "sp", label: "SP形 SPC（ISO）" },
        MXL: { kind: "timing", label: "MXL（台形歯）", p: 2.032, inch: true, u2: 0.508 },
        XL:  { kind: "timing", label: "XL（台形歯）", p: 5.08, inch: true, u2: 0.508 },
        L:   { kind: "timing", label: "L（台形歯）", p: 9.525, inch: true, u2: 0.762 },
        H:   { kind: "timing", label: "H（台形歯）", p: 12.7, inch: true, u2: 1.372 },
        XH:  { kind: "timing", label: "XH（台形歯）", p: 22.225, inch: true, u2: 2.794 },
        T5:  { kind: "timing", label: "T5（T形）", p: 5, u2: 0.85 },
        T10: { kind: "timing", label: "T10（T形）", p: 10 },
        "3M":  { kind: "timing", label: "3M（HTD円弧歯）", p: 3, u2: 0.762 },
        "5M":  { kind: "timing", label: "5M（HTD円弧歯）", p: 5, u2: 1.143 },
        "8M":  { kind: "timing", label: "8M（HTD円弧歯）", p: 8, u2: 1.372 },
        "14M": { kind: "timing", label: "14M（HTD円弧歯）", p: 14, u2: 2.794 },
        S3M:  { kind: "timing", label: "S3M（STS）", p: 3, u2: 0.762 },
        S5M:  { kind: "timing", label: "S5M（STS）", p: 5, u2: 0.96 },
        S8M:  { kind: "timing", label: "S8M（STS）", p: 8, u2: 1.372 },
        S14M: { kind: "timing", label: "S14M（STS）", p: 14, u2: 2.794 },
      };

      // ── 基本式 ──
      const beltLen = (C, D, d) => 2 * C + (Math.PI * (D + d)) / 2 + (D - d) ** 2 / (4 * C);
      function beltC(L, D, d) {
        const b = 2 * L - Math.PI * (D + d);
        const disc = b * b - 8 * (D - d) ** 2;
        if (b <= 0 || disc < 0) return NaN;
        return (b + Math.sqrt(disc)) / 8;
      }
      const beltTheta = (C, D, d) => 180 - (57.3 * (D - d)) / C;
      const beltSpan = (C, D, d) => Math.sqrt(C * C - ((D - d) ** 2) / 4);

      // 呼び ⇔ 計算に使う長さ（mm）
      function beltNomToLen(t, nom) {
        if (t.kind === "classic") return nom * 25.4;
        if (t.kind === "wedge") return Math.round((nom / 10) * 25.4);
        if (t.kind === "sp") return nom;
        if (t.kind === "timing") return t.inch ? (nom / 10) * 25.4 : nom;
        return NaN;
      }
      function beltNomLabel(code, t, nom) {
        if (t.kind === "classic") return `${code}${nom}`;
        if (t.kind === "wedge") return `${code}-${nom}`;
        if (t.kind === "sp") return `${code}${nom}`;
        if (t.kind === "timing") return t.inch ? `${nom}${code}` : `${code}-${nom}`;
        return "";
      }
      // 必要長さの前後にある規格候補（呼び）を返す
      function beltCandidates(t, Lreq) {
        if (t.kind === "wedge") {
          const list = t.sizes;
          let i = list.findIndex((n) => beltNomToLen(t, n) >= Lreq);
          if (i < 0) i = list.length;
          return list.slice(Math.max(0, i - 2), Math.min(list.length, i + 2));
        }
        if (t.kind === "classic") {
          const x = Lreq / 25.4, f = Math.floor(x);
          return [f - 1, f, f + 1, f + 2].filter((n) => n > 0);
        }
        if (t.kind === "timing") {
          // 歯数で刻む（呼びは歯数×ピッチ）
          const z = Lreq / t.p, f = Math.floor(z);
          return [f - 1, f, f + 1, f + 2].filter((n) => n > 0).map((n) => ({ teeth: n, Ln: n * t.p }));
        }
        return []; // SP は規格長さ一覧を持たない
      }
      function beltAdj(t, nom) {
        if (t.kind !== "wedge") return null;
        const row = t.adj.find((r) => nom <= r[0]);
        return row ? { inner: row[1], outer: row[2] } : null;
      }

      function beltSyncForm() {
        const code = document.getElementById("belt-type")?.value || "B";
        const t = BELT_TYPES[code];
        const mode = document.getElementById("belt-mode")?.value || "fromC";
        const isT = t.kind === "timing";
        const show = (id, on) => { const el = document.getElementById(id); if (el) el.style.display = on ? "" : "none"; };
        show("belt-dia-wrap", !isT);
        show("belt-teeth-wrap", isT);
        show("belt-C-wrap", mode === "fromC");
        show("belt-nom-wrap", mode === "fromNom");
        const dl = document.getElementById("belt-dia-label");
        if (dl) dl.textContent = t.kind === "wedge" ? "プーリ有効径（mm）" : t.kind === "sp" ? "プーリ基準径（mm）" : "プーリピッチ径（呼び径）（mm）";
        const nl = document.getElementById("belt-nom-label");
        if (nl) nl.textContent =
          t.kind === "classic" ? `ベルト呼び番号（インチ）例：${code}45 → 45` :
          t.kind === "wedge" ? `ベルト呼び（インチ×10）例：${code}-1500 → 1500` :
          t.kind === "sp" ? `基準長さ（mm）例：${code}1250 → 1250` :
          t.inch ? `ベルト呼び（0.1インチ）例：210${code} → 210` : `ピッチ周長（mm）例：${code}-1200 → 1200`;
      }

      function calcBelt() {
        beltSyncForm();
        const box = document.getElementById("belt-result");
        if (!box) return;
        const g = (id) => parseFloat(document.getElementById(id)?.value);
        const code = document.getElementById("belt-type").value;
        const t = BELT_TYPES[code];
        const mode = document.getElementById("belt-mode").value;
        const n1 = g("belt-n") || 0;

        // プーリ径（タイミングは歯数からピッチ円径）
        let d, D, z1, z2;
        if (t.kind === "timing") {
          z1 = g("belt-z1"); z2 = g("belt-z2");
          if (!(z1 > 0 && z2 > 0)) { box.innerHTML = `<div class="memo">プーリの歯数を入れてください。</div>`; return; }
          if (z1 > z2) [z1, z2] = [z2, z1];
          d = (z1 * t.p) / Math.PI; D = (z2 * t.p) / Math.PI;
        } else {
          d = g("belt-d"); D = g("belt-D");
          if (!(d > 0 && D > 0)) { box.innerHTML = `<div class="memo">プーリ径を入れてください。</div>`; return; }
          if (d > D) [d, D] = [D, d];
        }

        const notes = [];
        let L, C, rows = [];
        if (mode === "fromC") {
          C = g("belt-C");
          if (!(C > 0)) { box.innerHTML = `<div class="memo">軸間距離を入れてください。</div>`; return; }
          if (C <= (D + d) / 2) notes.push(`<span style="color:var(--bad)">軸間距離がプーリ半径の和（${((D + d) / 2).toFixed(0)}mm）以下で、プーリ同士が当たる</span>`);
          L = beltLen(C, D, d);
          rows = beltCandidates(t, L).map((c) => {
            const nom = typeof c === "object" ? c.teeth : c;
            const Ln = typeof c === "object" ? c.Ln : beltNomToLen(t, nom);
            const Cn = beltC(Ln, D, d);
            return { nom, Ln, Cn, dC: Cn - C, adj: beltAdj(t, nom) };
          }).filter((r) => isFinite(r.Cn));
        } else {
          const nom = g("belt-nom");
          if (!(nom > 0)) { box.innerHTML = `<div class="memo">ベルトの呼びを入れてください。</div>`; return; }
          L = beltNomToLen(t, nom);
          C = beltC(L, D, d);
          if (!isFinite(C)) { box.innerHTML = `<div class="memo" style="color:var(--bad)">このベルトはプーリに対して短すぎて掛からない。</div>`; return; }
          rows = [{ nom, Ln: L, Cn: C, dC: 0, adj: beltAdj(t, nom) }];
          if (t.kind === "wedge" && !t.sizes.includes(nom)) notes.push(`${code}-${nom} は標準長さの表にない（三ツ星 表1-1）`);
          if (t.kind === "timing") {
            const teeth = L / t.p;
            if (Math.abs(teeth - Math.round(teeth)) > 0.01) notes.push(`<span style="color:var(--bad)">ピッチ周長 ${L.toFixed(1)}mm はピッチ ${t.p}mm の整数倍にならない（歯数 ${teeth.toFixed(2)}）。呼びを確認</span>`);
          }
        }

        const theta = beltTheta(C, D, d);
        const span = beltSpan(C, D, d);
        const ratio = t.kind === "wedge" ? (D - t.dEP) / (d - t.dEP) : D / d; // ウェッジはピッチ径の比
        const V = n1 > 0 ? (Math.PI * d * n1) / 60000 : null;

        // 注意
        if (t.kind === "classic" && t.range) {
          const nomC = L / 25.4;
          if (nomC < t.range[0] || nomC > t.range[1]) notes.push(`${code}形の一般的な在庫範囲（${code}${t.range[0]}〜${code}${t.range[1]}、三ツ星レッドの例）から外れる。メーカーに確認`);
        }
        if (t.outer) notes.push(`M形の呼びは外周長（他の形はピッチ周長）。ここの計算はピッチ周長なので、呼びは外周の実測かメーカー表で確認`);
        if (t.kind === "wedge") {
          if (d < t.minDe) notes.push(`<span style="color:var(--warn)">小プーリ有効径 ${d}mm が ${code} の最小有効径 ${t.minDe}mm 未満（コグ付き ${code}X は ${t.minDeX ?? "—"}mm まで可）。曲げで寿命が落ちる</span>`);
          notes.push(`ピッチ径に直すと 小 ${(d - t.dEP).toFixed(1)}／大 ${(D - t.dEP).toFixed(1)}mm（有効径−${t.dEP}mm）。回転比はピッチ径の比で出している`);
        }
        if (t.kind === "sp") notes.push(`SP形は規格長さの一覧を持っていない。計算した基準長さに近いものをメーカー表で選ぶ`);
        if (theta < 120) notes.push(`<span style="color:var(--warn)">小プーリの接触角 ${theta.toFixed(0)}° が120°未満。伝動容量が大きく落ちる（三ツ星の補正係数 Kθ は120°で0.82）。軸間距離を広げるかアイドラを検討</span>`);
        if (V != null && V > 30) notes.push(`<span style="color:var(--bad)">ベルト速度 ${V.toFixed(1)}m/s が30m/s超。鋳物プーリは使えない（鋼製プーリ・動バランスが要る）</span>`);
        else if (V != null && V > 20 && t.kind !== "timing") notes.push(`ベルト速度 ${V.toFixed(1)}m/s。20〜30m/sは鋳物プーリでもバランス取りが要る（三ツ星）`);
        if (t.kind === "timing") {
          const mesh = (z1 * theta) / 360;
          if (mesh < 6) notes.push(`<span style="color:var(--warn)">小プーリのかみ合い歯数 ${mesh.toFixed(1)}歯。6歯未満は歯飛び・歯欠けしやすい（一般的な目安）</span>`);
          notes.push(`かみ合い歯数（小プーリ）：${mesh.toFixed(1)}歯　／　ピッチ円径 小 ${d.toFixed(2)}・大 ${D.toFixed(2)}mm`);
          notes.push(`候補は歯数1枚刻みの計算値。在庫している長さはメーカー表で確認（台形歯の呼びは0.1インチ単位の「相当」表示）`);
          notes.push(`軸間距離は近似式。タイミングベルトは伸びしろが小さいので、テンショナか軸間の調整代を必ず取る`);
        }

        const card = (label, val, unit, sub = "", color = "") =>
          `<div class="card"><div class="card-label">${label}</div><div class="card-value"${color ? ` style="color:${color}"` : ""}>${val}<span class="card-unit">${unit}</span></div>${sub ? `<div style="font-size:10px;color:var(--muted);margin-top:3px">${sub}</div>` : ""}</div>`;
        const lenUnitTxt = t.kind === "wedge" ? "有効周長" : t.kind === "sp" ? "基準長さ" : t.kind === "timing" ? "ピッチ周長" : t.outer ? "ピッチ周長（呼びは外周長）" : "ピッチ周長";
        const nomOfL =
          t.kind === "classic" ? `${(L / 25.4).toFixed(1)} インチ` :
          t.kind === "wedge" ? `${((L / 25.4) * 10).toFixed(0)}（インチ×10）` :
          t.kind === "timing" ? `${(L / t.p).toFixed(1)} 歯` : "";

        const table = rows.length ? `
      <div class="data-table-wrap" style="margin-bottom:8px;overflow-x:auto">
        <table>
          <thead><tr><th>ベルト</th><th>${lenUnitTxt}</th>${t.kind === "timing" ? "<th>歯数</th>" : ""}<th>軸間距離</th>${mode === "fromC" ? "<th>今の軸間との差</th>" : ""}${t.kind === "wedge" ? "<th>調整代（内／外）</th>" : ""}</tr></thead>
          <tbody>${rows.map((r) => `<tr${mode === "fromC" && Math.abs(r.dC) === Math.min(...rows.map((x) => Math.abs(x.dC))) ? ' style="background:var(--accent-dim)"' : ""}>
            <td style="font-weight:700">${t.kind === "timing" && mode === "fromC" ? (t.inch ? `${Math.round(r.Ln / 2.54)}${code} 相当` : `${code}-${Math.round(r.Ln)}`) : beltNomLabel(code, t, r.nom)}</td>
            <td>${r.Ln.toFixed(t.kind === "timing" && t.inch ? 1 : 0)} mm</td>
            ${t.kind === "timing" ? `<td>${Math.round(r.Ln / t.p)}</td>` : ""}
            <td>${r.Cn.toFixed(1)} mm</td>
            ${mode === "fromC" ? `<td style="color:${r.dC >= 0 ? "var(--good)" : "var(--warn)"}">${r.dC >= 0 ? "+" : ""}${r.dC.toFixed(1)} mm</td>` : ""}
            ${t.kind === "wedge" ? `<td>${r.adj ? `−${r.adj.inner}／+${r.adj.outer} mm` : "—"}</td>` : ""}
          </tr>`).join("")}</tbody>
        </table>
      </div>` : "";

        box.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">
        ${mode === "fromC"
          ? card(`必要な${lenUnitTxt}`, L.toFixed(1), "mm", nomOfL, "var(--accent)")
          : card("軸間距離", C.toFixed(1), "mm", `${lenUnitTxt} ${L.toFixed(1)} mm`, "var(--accent)")}
        ${card("小プーリ接触角", theta.toFixed(1), "°", theta < 120 ? "120°未満" : "", theta < 120 ? "var(--warn)" : "")}
        ${card("回転比", ratio.toFixed(3), "", n1 > 0 ? `大プーリ ${(n1 / ratio).toFixed(0)} rpm` : "")}
        ${card("スパン長さ", span.toFixed(1), "mm", "張りの点検でたわみを測る長さ")}
        ${card("ベルト速度", V != null ? V.toFixed(2) : "—", V != null ? "m/s" : "", V != null ? "" : "回転数を入れると出る")}
        ${card("プーリ径", `${d.toFixed(1)}／${D.toFixed(1)}`, "mm", t.kind === "timing" ? `歯数 ${z1}／${z2}` : t.kind === "wedge" ? "有効径" : t.kind === "sp" ? "基準径" : "ピッチ径")}
      </div>
      ${table}
      ${notes.length ? `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:8px 10px;font-size:12px;line-height:1.7;margin-bottom:8px">${notes.map((n) => "・" + n).join("<br>")}</div>` : ""}
      ${beltTensionHtml(t, code, d, D, C, span, V)}
      <div style="font-size:11px;color:var(--muted);line-height:1.7">
        式：L = 2C + π(D+d)/2 + (D−d)²/(4C)、C = {b + √(b² − 8(D−d)²)}/8（b = 2L − π(D+d)）、θ = 180 − 57.3(D−d)/C。
        出典：三ツ星ベルト 設計資料 V852-E。一般Vベルトはピッチ径・ピッチ周長、ウェッジは有効径・有効周長で計算する。
        伝動容量（掛け本数）はメーカー表の裏取り後に追加予定。
      </div>`;
      }

      // ════════════════════════════════════════════════════
      //  張りの点検（ペンシル型張力計・たわみ荷重）
      // ════════════════════════════════════════════════════
      //  三ツ星 設計資料 V852-E 公式一覧：初張力 To = 0.9{500(2.5−Kθ)Pd/(Kθ·nb·V) + W·V²}
      //  三ツ星「Vベルトの取付け方法」：たわみ量は 100mm スパンあたり 1.6mm、新品取付は To×1.5、張り直しは To×1.3
      //  たわみ荷重 Td は、スパン中央を δ 押したときの釣合い（弦の近似）F = 4T·δ/Ls に δ = 0.016Ls を入れて T/15.6 ≒ T/16。
      //  メーカーの式はこれにベルトの曲げ剛性分の補正を足すので、実際の規定値は少し大きめになる → 目安として表示
      const KTH_V = [1.00, 0.99, 0.98, 0.96, 0.94, 0.93, 0.91, 0.89, 0.87, 0.85, 0.82, 0.80, 0.77, 0.74, 0.70, 0.66]; // (D−d)/C = 0〜1.5（表2-5）
      const KTH_W = [1.00, 0.99, 0.97, 0.96, 0.94, 0.93, 0.91, 0.89, 0.87, 0.85, 0.82, 0.80, 0.77, 0.73, 0.70, 0.65]; // 同（ウェッジ 表2-12）
      function beltKtheta(t, D, d, C) {
        const x = Math.min(1.5, Math.max(0, (D - d) / C)) * 10;
        const tbl = t.kind === "wedge" ? KTH_W : KTH_V;
        const i = Math.floor(x), f = x - i;
        return i >= 15 ? tbl[15] : tbl[i] + (tbl[i + 1] - tbl[i]) * f;
      }
      function beltTensionHtml(t, code, d, D, C, span, V) {
        if (!(t.kind === "classic" || t.kind === "wedge")) {
          return `<div class="memo" style="font-size:11px">張りの点検：${t.kind === "sp" ? "SP形" : "タイミングベルト"}は出典の表（三ツ星の単位質量・初張力式）が無いので未対応。メーカーの張力表で確認してください。</div>`;
        }
        const g = (id) => parseFloat(document.getElementById(id)?.value);
        const P = g("belt-P"), Ks = g("belt-Ks") || 1.3, nb = Math.max(1, Math.round(g("belt-nb") || 1));
        if (!(P > 0) || V == null) {
          return `<div class="memo" style="font-size:11px">張りの点検：伝動動力（kW）と小プーリ回転数を入れると、ペンシル型張力計のたわみ量とたわみ荷重の目安が出ます。</div>`;
        }
        const Kth = beltKtheta(t, D, d, C);
        const Pd = P * Ks;
        const W = t.mass;
        const To = 0.9 * ((500 * (2.5 - Kth) * Pd) / (Kth * nb * V) + W * V * V);
        const delta = (span * 1.6) / 100;
        const Td = (T) => T / 16;
        const Fs = 1.5 * (2 * nb * To * Math.sin((beltTheta(C, D, d) / 2) * Math.PI / 180));
        const card = (label, val, unit, sub = "", color = "") =>
          `<div class="card"><div class="card-label">${label}</div><div class="card-value"${color ? ` style="color:${color}"` : ""}>${val}<span class="card-unit">${unit}</span></div>${sub ? `<div style="font-size:10px;color:var(--muted);margin-top:3px">${sub}</div>` : ""}</div>`;
        return `
      <div class="section-title" style="margin-top:6px">張りの点検（ペンシル型張力計）— ${code}・${nb}本掛け</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">
        ${card("たわみ量（リングの目盛）", delta.toFixed(1), "mm", `スパン ${span.toFixed(0)}mm × 1.6/100`, "var(--accent)")}
        ${card("たわみ荷重（新品取付）", Td(To * 1.5).toFixed(1), "N", `${(Td(To * 1.5) / 9.807).toFixed(2)} kgf・初張力 ${(To * 1.5).toFixed(0)} N`, "var(--accent)")}
        ${card("たわみ荷重（張り直し）", Td(To * 1.3).toFixed(1), "N", `${(Td(To * 1.3) / 9.807).toFixed(2)} kgf・なじみ運転後`)}
        ${card("初張力 To（1本）", To.toFixed(0), "N", `設計動力 Pd = ${P}×${Ks} = ${Pd.toFixed(2)} kW`)}
        ${card("接触角補正 Kθ", Kth.toFixed(3), "", `(D−d)/C = ${((D - d) / C).toFixed(2)}`)}
        ${card("静止時の軸荷重", (Fs / 1000).toFixed(2), "kN", "軸受・軸の確認用（To 基準）")}
      </div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:8px 10px;font-size:11px;color:var(--muted);line-height:1.7;margin-bottom:8px">
        ・使い方：張力計のたわみリングを ${delta.toFixed(1)}mm、荷重リングをゼロにして、スパン中央を押す。たわみリングがプーリ外周を結ぶ線に重なったときの荷重を読む<br>
        ・新品は「新品取付」の値で張って約1分ならし運転 → 1時間〜数日運転してなじんだら「張り直し」の値に（三ツ星）<br>
        ・<b>たわみ荷重は下限側の目安</b>：弦の釣合い F = 4T·δ/Ls（＝T/16）から出している。メーカーの規定値はベルトの曲げ剛性分を足すので、これより少し大きい。この値を下回っていたら張り不足。検算：NBK の計算例（A68・88/212・2.2kW・2本）で初張力 112N（NBK 114N）、軸荷重 0.67kN（同 678N）は一致、たわみ荷重は 10.5N に対し NBK 11.6N（約1割大きい）。正確な値は三ツ星の「適正張力計算コーナー」で<br>
        ・簡易チェック（三ツ星）：プーリが熱い → 張り不足・スリップ。軸受が熱い → 張りすぎ<br>
        ・式：To = 0.9{500(2.5−Kθ)Pd/(Kθ·nb·V) + W·V²}（W＝${W} kg/m、三ツ星 表2-1/2-2）、軸荷重 Fs = 1.5·2·nb·To·sin(θ/2)。過負荷係数 Ks は三ツ星 表2-1 で 1.0〜1.8（起動停止が多い・粉塵・熱などは +0.2）
      </div>`;
      }

      // ════════════════════════════════════════════════════
      //  現物から種類を探す（Vプーリの溝・タイミングプーリの外径と歯数）
      // ════════════════════════════════════════════════════
      //  V溝の上幅 W・外径との差
      //   一般V：三ツ星 設計資料 表1-3（長さ測定用V溝プーリ、溝角34〜36°）の W と K（外径＝ピッチ径＋2K）
      //   ウェッジ：三ツ星 プーリ溝寸法 W、外径＝有効径＋1mm
      //   SP：NBK イソメックSPプーリー 溝部寸法（ISO 4183）w1、外径＝データム径＋2b、使えるベルト
      //   溝ピッチ e：ウェッジ（三ツ星）、SP（NBK）。一般V A/B/C は SP の兼用表（SPA=A 15、SPB=B 19、SPC=C 25.5）
      const GROOVES = [
        { code: "M", W: [9.65, 9.65], e: null, conv: (Do) => Do - 2 * 2.7, dname: "ピッチ径", belts: "M" },
        { code: "A", W: [11.95, 11.95], e: 15.0, conv: (Do) => Do - 2 * 4.5, dname: "ピッチ径", belts: "A" },
        { code: "B", W: [15.86, 15.86], e: 19.0, conv: (Do) => Do - 2 * 5.5, dname: "ピッチ径", belts: "B" },
        { code: "C", W: [21.18, 21.18], e: 25.5, conv: (Do) => Do - 2 * 7.0, dname: "ピッチ径", belts: "C" },
        { code: "D", W: [30.78, 30.78], e: null, conv: (Do) => Do - 2 * 9.5, dname: "ピッチ径", belts: "D" },
        { code: "3V", W: [8.9, 8.9], e: 10.3, conv: (Do) => Do - 1, dname: "有効径", belts: "3V" },
        { code: "5V", W: [15.2, 15.2], e: 17.5, conv: (Do) => Do - 1, dname: "有効径", belts: "5V" },
        { code: "8V", W: [25.4, 25.78], e: 28.6, conv: (Do) => Do - 1, dname: "有効径", belts: "8V" },
        { code: "SPZ", W: [9.72, 9.88], e: 12, conv: (Do) => Do - 2 * 2.0, dname: "データム径", belts: "SPZ・M・3V" },
        { code: "SPA", W: [12.68, 12.89], e: 15, conv: (Do) => Do - 2 * 2.75, dname: "データム径", belts: "SPA・A" },
        { code: "SPB", W: [16.14, 16.41], e: 19, conv: (Do) => Do - 2 * 3.5, dname: "データム径", belts: "SPB・B・5V" },
        { code: "SPC", W: [21.94, 22.31], e: 25.5, conv: (Do) => Do - 2 * 4.8, dname: "データム径", belts: "SPC・C" },
      ];

      function beltIdentify() {
        const box = document.getElementById("belt-id-result");
        if (!box) return;
        const g = (id) => parseFloat(document.getElementById(id)?.value);
        const kind = document.getElementById("belt-id-kind")?.value || "v";
        ["v", "t"].forEach((k) => { const el = document.getElementById(`belt-id-${k}-wrap`); if (el) el.style.display = k === kind ? "" : "none"; });
        if (kind === "v") {
          const W = g("belt-id-W"), e = g("belt-id-e"), Do = g("belt-id-Do");
          if (!(W > 0)) { box.innerHTML = `<div class="memo" style="font-size:11px">溝の上幅（プーリ外周の位置で、溝の両肩の間）をノギスで測って入れてください。</div>`; return; }
          const list = GROOVES.map((gr) => {
            const dW = W < gr.W[0] ? gr.W[0] - W : W > gr.W[1] ? W - gr.W[1] : 0;
            const de = e > 0 && gr.e ? Math.abs(e - gr.e) : null;
            const score = dW / 0.5 + (de != null ? de / 0.4 : 0) + (e > 0 && !gr.e ? 0.5 : 0);
            return { gr, dW, de, score };
          }).filter((x) => x.dW <= 1.2 && (x.de == null || x.de <= 1.5)).sort((a, b) => a.score - b.score);
          if (!list.length) { box.innerHTML = `<div class="memo" style="color:var(--warn)">溝上幅 ${W}mm に合う溝形が見つからない。測る位置（外周の肩）と、溝の摩耗を確認してください。</div>`; return; }
          box.innerHTML = `
      <div class="data-table-wrap" style="overflow-x:auto;margin-bottom:6px"><table>
        <thead><tr><th>溝形</th><th>溝上幅（規格）</th><th>溝ピッチ</th>${Do > 0 ? "<th>計算に使う径</th>" : ""}<th>掛かるベルト</th><th></th></tr></thead>
        <tbody>${list.map((x, i) => {
          const gr = x.gr, dia = Do > 0 ? gr.conv(Do) : null;
          const mark = x.score <= 0.6 ? "◎" : x.score <= 1.5 ? "○" : "△";
          const target = BELT_TYPES[gr.code] ? gr.code : null;
          return `<tr${i === 0 ? ' style="background:var(--accent-dim)"' : ""}>
            <td style="font-weight:700">${mark} ${gr.code}</td>
            <td>${gr.W[0] === gr.W[1] ? gr.W[0] : `${gr.W[0]}〜${gr.W[1]}`}（差 ${x.dW.toFixed(2)}）</td>
            <td>${gr.e ?? "—"}${x.de != null ? `（差 ${x.de.toFixed(1)}）` : ""}</td>
            ${Do > 0 ? `<td>${gr.dname} ${dia.toFixed(1)}</td>` : ""}
            <td>${gr.belts}</td>
            <td>${target && dia ? `<button class="preset-btn" style="padding:2px 8px;font-size:11px" onclick="beltUseId('${target}', ${dia.toFixed(1)})">この径で計算</button>` : ""}</td>
          </tr>`; }).join("")}</tbody>
      </table></div>
      <div style="font-size:11px;color:var(--muted);line-height:1.7">
        ・◎○△は溝上幅と溝ピッチの近さ。<b>B・5V・SPB は溝幅がほぼ同じ</b>なので、溝ピッチ（多本溝なら溝の中心間）と、掛かっているベルトの刻印で決める<br>
        ・SPプーリーは一般V・細幅も掛かる兼用溝（NBK）。溝が摩耗すると上幅が広く出る<br>
        ・一般Vの規格幅は溝角34°の値。大径プーリ（36°・38°）はわずかに広い<br>
        ・出典：三ツ星 設計資料 V852-E（一般V・ウェッジの溝）、NBK イソメックSPプーリー 溝部寸法（ISO 4183）
      </div>`;
        } else {
          const z = Math.round(g("belt-id-z")), Do = g("belt-id-tDo");
          if (!(z > 0 && Do > 0)) { box.innerHTML = `<div class="memo" style="font-size:11px">歯数と外径（歯先の直径）を入れてください。</div>`; return; }
          const list = Object.entries(BELT_TYPES).filter(([, t]) => t.kind === "timing" && t.u2 != null).map(([code, t]) => {
            const PD = (z * t.p) / Math.PI, OD = PD - t.u2;
            return { code, t, PD, OD, err: Math.abs(Do - OD) };
          }).filter((x) => x.err <= 2).sort((a, b) => a.err - b.err).slice(0, 5);
          if (!list.length) { box.innerHTML = `<div class="memo" style="color:var(--warn)">歯数 ${z}・外径 ${Do}mm に合う種類が見つからない（T10 など未登録の種類か、外径の測り違い）。</div>`; return; }
          box.innerHTML = `
      <div class="data-table-wrap" style="overflow-x:auto;margin-bottom:6px"><table>
        <thead><tr><th>種類</th><th>ピッチ</th><th>外径（規格）</th><th>差</th><th>ピッチ円径</th><th></th></tr></thead>
        <tbody>${list.map((x, i) => `<tr${i === 0 ? ' style="background:var(--accent-dim)"' : ""}>
          <td style="font-weight:700">${x.err <= 0.15 ? "◎" : x.err <= 0.4 ? "○" : "△"} ${x.code}</td>
          <td>${x.t.p} mm</td><td>${x.OD.toFixed(2)}</td><td>${x.err.toFixed(2)}</td><td>${x.PD.toFixed(2)}</td>
          <td><button class="preset-btn" style="padding:2px 8px;font-size:11px" onclick="beltUseIdT('${x.code}', ${z})">この歯数で計算</button></td>
        </tr>`).join("")}</tbody>
      </table></div>
      <div style="font-size:11px;color:var(--muted);line-height:1.7">
        ・外径＝ピッチ円径（歯数×ピッチ/π）− 2u で照合。<b>S3M・S8M は HTD（3M・8M）と外径が同じ</b>なので歯形で見分ける（HTD は丸い歯、STS は頭が平たい）。S5M は 5M より外径が 0.18mm 大きい<br>
        ・ベルトがあれば、歯の山を10山ほどノギスで測ってピッチを出すのが確実（5mm と 5.08mm の区別など）<br>
        ・2u：MXL・XL・L・H・XH・T5・5M・8M・14M・S3M・S5M・S8M はメーカー寸法表で確認。HTD の小径プーリ（8M・14M の28〜32歯あたり）は外径を0.1〜0.2mm小さく作る例があるので、○でも当たりのことがある<br>
        ・3M（HTD）と S14M は一般値（未照合）。T10 は値が未確認のため候補に出さない
      </div>`;
        }
      }
      function beltUseId(code, dia) {
        const sel = document.getElementById("belt-type"); sel.value = code;
        const dEl = document.getElementById("belt-d"); dEl.value = dia;
        calcBelt();
      }
      function beltUseIdT(code, z) {
        const sel = document.getElementById("belt-type"); sel.value = code;
        document.getElementById("belt-z1").value = z;
        calcBelt();
      }

      window.addEventListener("DOMContentLoaded", () => {
        if (document.getElementById("belt-type")) { calcBelt(); beltIdentify(); }
      });
