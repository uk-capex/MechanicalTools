      // ════════════════════════════════════════════════════
      //  歯車タブ：現物からモジュール推定（平歯車・2026-10 追加）
      // ════════════════════════════════════════════════════
      //  1段目：歯先円径 da と歯数 z → m ≒ da/(z+2)。標準モジュールと DP（m = 25.4/DP）の候補を並べ、
      //         ずれは転位 x = (da/m − z − 2)/2 として表示（歯先を削っていない前提）
      //  2段目：またぎ歯厚 Wk・Wk+1 → 差は法線ピッチ pb = π·m·cosα。標準モジュール×圧力角（20°/14.5°）で照合し、
      //         Wk から転位 x = {Wk − m·cosα(π(k−0.5) + z·invα)} / (2·m·sinα)
      //         またぎ歯数の目安 k ≒ z·α/180 + 0.5（x=0 のとき）
      //  式の検算：m4・z20・α20°・x0・k3 → W = 30.642（島根大 歯車製図例 30.6418 と一致）
      //  標準モジュール：JIS B 1701-2（ISO 54）の第Ⅰ系列・第Ⅱ系列。1 未満は小モジュールの慣用値（参考）
      //  2026-10 照合：小原歯車「歯車の歯形及び寸法」表3.2、ツールリメイク（JIS B 1701-2 表1・表2 抜粋）
      //    Ⅰ系列 0.1〜0.8・1〜50、Ⅱ系列 0.15〜0.9（0.65 含む）・1.125〜45、6.5 は「できるだけ避ける」
      const GEAR_M1 = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50];
      const GEAR_M2 = [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.7, 0.75, 0.9, 1.125, 1.375, 1.75, 2.25, 2.75, 3.5, 4.5, 5.5, 7, 9, 11, 14, 18, 22, 28, 36, 45];
      const GEAR_MS = [6.5]; // できるだけ避ける値（古い機械にはある）
      const GEAR_DP = [2, 2.5, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 24, 32, 48];
      const inv = (a) => Math.tan(a) - a;
      const deg = (d) => (d * Math.PI) / 180;

      function gearCandidates() {
        return [
          ...GEAR_M1.map((m) => ({ m, label: `m${m}`, tag: "第Ⅰ系列" })),
          ...GEAR_M2.map((m) => ({ m, label: `m${m}`, tag: "第Ⅱ系列" })),
          ...GEAR_MS.map((m) => ({ m, label: `m${m}`, tag: "第Ⅱ系列（避ける値）" })),
          ...GEAR_DP.map((dp) => ({ m: 25.4 / dp, label: `DP${dp}`, tag: `インチ（m${(25.4 / dp).toFixed(3)}）` })),
        ];
      }

      function gearEstimate() {
        const box = document.getElementById("gear-est-result");
        if (!box) return;
        const g = (id) => parseFloat(document.getElementById(id)?.value);
        const z = Math.round(g("ge-z"));
        let da = g("ge-da");
        const bore = g("ge-bore"), tip = g("ge-tip");
        const odd = z % 2 === 1;
        let daNote = "";
        if (!(da > 0) && bore > 0 && tip > 0) { da = bore + 2 * tip; daNote = `（穴径 ${bore} ＋ 穴から歯先 ${tip}×2 ＝ ${da.toFixed(2)}）`; }
        if (!(z > 0 && da > 0)) {
          box.innerHTML = `<div class="memo" style="font-size:11px">歯数と歯先円径を入れてください。歯数が奇数だと歯先の直径を直接は挟めないので、「穴径」と「穴の縁から歯先まで」を測れば換算する。</div>`;
          return;
        }

        // ── 1段目：歯先円径から ──
        const mEst = da / (z + 2);
        const rows = gearCandidates()
          .map((c) => ({ ...c, x: (da / c.m - z - 2) / 2 }))
          .filter((c) => Math.abs(c.x) <= 1.0)
          .sort((a, b) => Math.abs(a.x) - Math.abs(b.x))
          .slice(0, 5);

        // ── 2段目：またぎ歯厚から ──
        const k = Math.round(g("ge-k")), W1 = g("ge-W1"), W2 = g("ge-W2");
        let spanHtml = "";
        const kRec = (a) => Math.max(2, Math.round((z * a) / 180 + 0.5));
        if (k > 0 && W1 > 0 && W2 > 0) {
          const pb = W2 - W1;
          const list = [];
          for (const c of gearCandidates()) {
            for (const a of [20, 14.5]) {
              const pbx = Math.PI * c.m * Math.cos(deg(a));
              const err = Math.abs(pb - pbx);
              const x = (W1 - c.m * Math.cos(deg(a)) * (Math.PI * (k - 0.5) + z * inv(deg(a)))) / (2 * c.m * Math.sin(deg(a)));
              list.push({ ...c, a, pbx, err, x });
            }
          }
          list.sort((p, q) => p.err - q.err);
          const top = list.slice(0, 4);
          const best = top[0];
          spanHtml = `
      <div class="section-title" style="margin-top:8px">またぎ歯厚から（法線ピッチ pb = W${k + 1} − W${k} = ${pb.toFixed(3)} mm）</div>
      <div class="data-table-wrap" style="overflow-x:auto;margin-bottom:6px"><table>
        <thead><tr><th>候補</th><th>圧力角</th><th>pb（規格）</th><th>差</th><th>転位 x</th></tr></thead>
        <tbody>${top.map((r, i) => `<tr${i === 0 ? ' style="background:var(--accent-dim)"' : ""}>
          <td style="font-weight:700">${r.err <= 0.03 ? "◎" : r.err <= 0.08 ? "○" : "△"} ${r.label}</td>
          <td>${r.a}°</td><td>${r.pbx.toFixed(3)}</td><td>${r.err.toFixed(3)}</td>
          <td style="color:${Math.abs(r.x) > 0.6 ? "var(--warn)" : "inherit"}">${r.x >= 0 ? "+" : ""}${r.x.toFixed(2)}</td></tr>`).join("")}</tbody>
      </table></div>
      <div style="font-size:11px;color:var(--muted);line-height:1.7;margin-bottom:6px">
        ・法線ピッチは歯先の摩耗・削り直しに関係なく決まるので、歯先円径より確実。${best.err > 0.08 ? '<span style="color:var(--warn)">差が大きい → はすば歯車・測り違い・歯面の摩耗を疑う</span>' : ""}<br>
        ・転位 x は W${k} から逆算（バックラッシ分の歯厚減も x に混ざるので、−0.05 程度は「転位なし」とみてよい）<br>
        ・この歯数なら、またぎ歯数は 20°で k=${kRec(20)}、14.5°で k=${kRec(14.5)} が目安（転位があると変わる）
      </div>`;
        } else {
          spanHtml = `<div class="memo" style="font-size:11px;margin-top:8px">確定させたいときは、またぎ歯厚を2つ（k枚と k+1枚）測って入れる。この歯数なら 20°で k=${kRec(20)} 枚、14.5°で k=${kRec(14.5)} 枚が目安。歯厚マイクロかノギスで、歯面に平らに当てる。</div>`;
        }

        // ── 3段目：中心距離チェック ──
        const z2 = Math.round(g("ge-z2")), a = g("ge-a");
        let caHtml = "";
        if (z2 > 0 && a > 0 && rows.length) {
          const m0 = rows[0].m;
          const a0 = (m0 * (z + z2)) / 2;
          caHtml = `<div style="font-size:12px;line-height:1.7;margin-top:6px">中心距離：${rows[0].label} なら標準 ${a0.toFixed(2)} mm、実測 ${a} mm（差 ${(a - a0) >= 0 ? "+" : ""}${(a - a0).toFixed(2)}）。${Math.abs(a - a0) < 0.1 * m0 ? "標準の中心距離（転位なし or 合計ゼロ）" : `ずれが大きい → 転位歯車の組（ペアで x を合わせて作る）か、モジュール違い`}</div>`;
        }

        box.innerHTML = `
      <div class="section-title">歯先円径から（m ≒ da/(z+2) = ${da.toFixed(2)}/${z + 2} = ${mEst.toFixed(3)}）${daNote}</div>
      ${rows.length ? `<div class="data-table-wrap" style="overflow-x:auto;margin-bottom:6px"><table>
        <thead><tr><th>候補</th><th>区分</th><th>標準の歯先円径</th><th>転位とみると x</th></tr></thead>
        <tbody>${rows.map((r, i) => `<tr${i === 0 ? ' style="background:var(--accent-dim)"' : ""}>
          <td style="font-weight:700">${Math.abs(r.x) <= 0.1 ? "◎" : Math.abs(r.x) <= 0.5 ? "○" : "△"} ${r.label}</td>
          <td>${r.tag}</td><td>${(r.m * (z + 2)).toFixed(2)}</td>
          <td style="color:${Math.abs(r.x) > 0.5 ? "var(--warn)" : "inherit"}">${r.x >= 0 ? "+" : ""}${r.x.toFixed(2)}</td></tr>`).join("")}</tbody>
      </table></div>` : `<div class="memo" style="color:var(--warn)">近い標準モジュールが見つからない。はすば歯車（正面モジュールが大きく出る）か、測り違いを確認</div>`}
      <div style="font-size:11px;color:var(--muted);line-height:1.7">
        ・歯先は摩耗・面取り・削り直しで小さく出やすい。x が −0.1〜−0.2 くらいなら転位より摩耗を疑う<br>
        ・|x| が 0.5 を超える候補は、転位にしては大きい（他の候補か DP を疑う）<br>
        ・はすば歯車は歯先円径から出るのが正面モジュール（m/cosβ）なので、ここでは合わない。歯すじが斜めなら対象外${odd ? "<br>・歯数が奇数：歯先の直径は「穴径＋穴の縁から歯先×2」で入れると正確" : ""}
      </div>
      ${spanHtml}
      ${caHtml}
      <div style="font-size:11px;color:var(--muted);line-height:1.7;margin-top:6px">
        出典・式：標準モジュール JIS B 1701-2 第Ⅰ・第Ⅱ系列（小原歯車 表3.2 で照合）、またぎ歯厚 W = m·cosα{π(k−0.5) + z·invα} + 2xm·sinα（並歯・平歯車）。
      </div>`;
      }

      window.addEventListener("DOMContentLoaded", () => {
        if (document.getElementById("gear-est-result")) gearEstimate();
      });
