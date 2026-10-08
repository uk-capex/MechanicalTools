      /* ===== 改修セーフティネット =====================================
         目的: onclick等のハンドラを修正してリンクが切れた時、
               「静かに動かない」のを防ぎ、原因を画面に即表示する。
         ・実行時エラー → 画面上部に赤バナーで関数名・行番号を表示
         ・読込時 → 全[onclick]を走査し、未定義の関数を一覧警告
         不要になったらこのブロックごと削除してOK(他に影響なし)
      ============================================================= */
      (function () {
        function banner(msg) {
          let b = document.getElementById("__errbar");
          if (!b) {
            b = document.createElement("div");
            b.id = "__errbar";
            b.style.cssText =
              "position:fixed;top:0;left:0;right:0;z-index:99999;background:#c62828;color:#fff;" +
              "font:13px/1.5 monospace;padding:8px 40px 8px 12px;white-space:pre-wrap;box-shadow:0 2px 8px rgba(0,0,0,.4)";
            const x = document.createElement("span");
            x.textContent = "✕";
            x.style.cssText = "position:absolute;top:6px;right:12px;cursor:pointer;font-weight:bold";
            x.onclick = () => b.remove();
            b.appendChild(x);
            (document.body || document.documentElement).appendChild(b);
          }
          const line = document.createElement("div");
          line.textContent = msg;
          b.appendChild(line);
        }
        // 実行時エラーを可視化
        window.addEventListener("error", function (e) {
          banner("⚠ エラー: " + e.message + (e.lineno ? "  (行 " + e.lineno + ")" : ""));
        });
        // 読込後、壊れたonclickハンドラを自己診断
        window.addEventListener("DOMContentLoaded", function () {
          const seen = new Set(), missing = [];
          document.querySelectorAll("[onclick]").forEach(function (el) {
            const m = (el.getAttribute("onclick") || "").match(/^\s*([A-Za-z_$][\w$]*)\s*\(/);
            if (m) {
              const fn = m[1];
              if (!seen.has(fn) && typeof window[fn] !== "function") {
                seen.add(fn);
                missing.push(fn);
              }
            }
          });
          if (missing.length) {
            banner("⚠ 未定義のボタン関数(タイプミス/消し忘れの可能性): " + missing.join(", "));
          }
        });
      })();
      /* ===== セーフティネットここまで ===== */

      const $ = (id) => document.getElementById(id);

      // ════ タブ切り替え ════
      function showTab(name, btn) {
        document
          .querySelectorAll(".tab-content")
          .forEach((e) => e.classList.remove("active"));
        document
          .querySelectorAll(".tab-btn")
          .forEach((e) => e.classList.remove("active"));
        const tabEl = $("tab-" + name);
        if (tabEl) tabEl.classList.add("active");
        // iOS Safari: currentTargetが取れないケースへの保険
        const target =
          btn || event?.currentTarget || event?.target;
        if (target && target.classList)
          target.classList.add("active");
      }

      function filterCat(cat, btn) {
        // 大分類ボタンのactive切り替え
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // タブボタンの表示/非表示
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(b => {
          b.style.display = (cat === 'all' || b.dataset.cat === cat) ? '' : 'none';
        });
        // 現在activeなタブが非表示になる場合、表示中の最初のタブに切り替え
        const activeBtn = document.querySelector('.tab-btn.active');
        if (activeBtn && activeBtn.style.display === 'none') {
          const firstVisible = document.querySelector('.tab-btn[style=""],.tab-btn:not([style])');
          if (firstVisible) firstVisible.click();
        }
      }

      // ════════════════════════════════════════
      // 共通：モーター容量からトルクの概算（2026-10 追加。焼き嵌め・キー溝で共用）
      //  入力欄は {pfx}-P / -poles / -hz / -ratio / -eff
      //  モーター回転数は同期回転数 120f/p の約97%（すべり約3%）で概算。
      //  出力軸トルク T = 9549·P/n_motor × 減速比 × 効率（直結＝減速比1のときは効率を掛けない）
      // ════════════════════════════════════════
      function motorTorqueEst(pfx) {
        const g = (k) => parseFloat(document.getElementById(`${pfx}-${k}`)?.value);
        const P = g("P"), poles = g("poles"), hz = g("hz");
        if (!(P > 0 && poles > 0 && hz > 0)) return null;
        const ratio = g("ratio") > 1 ? g("ratio") : 1;
        const effIn = g("eff");
        const eff = ratio > 1 ? (effIn > 0 && effIn <= 1 ? effIn : 1) : 1;
        const ns = (120 * hz) / poles, n = ns * 0.97, nOut = n / ratio;
        const Tm = (9549.3 * P) / n, T = Tm * ratio * eff;
        const txt =
          `${P} kW・${poles}P・${hz} Hz → モーター 約${n.toFixed(0)} min⁻¹・定格 ${Tm.toFixed(1)} N·m` +
          (ratio > 1 ? ` → 1/${ratio}・効率${eff} で出力軸 約${nOut.toFixed(0)} min⁻¹` : "") +
          `：<b style="color:var(--ink)">約 ${T.toFixed(0)} N·m</b>`;
        return { P, poles, hz, ratio, eff, ns, n, nOut, Tm, T, txt };
      }
      function motorTorqueNote() {
        return "回転数は同期回転数の約97%で概算。起動・停止のときは、誘導モーターは一般に定格の2倍前後のトルクが出る";
      }

      // ════════════════════════════════════════
      // 共通：select を「選択肢を全部並べたボタン」に見せる（2026-10 追加）
      //  select 本体は隠して残す（各計算は今まで通り select.value を読む）。
      //  ボタンを押すと select の値を変えて change を発火 → inline の onchange がそのまま動く。
      // ════════════════════════════════════════
      function segify(id) {
        const sel = document.getElementById(id);
        if (!sel || sel.dataset.seg) return;
        sel.dataset.seg = "1";
        const box = document.createElement("div");
        box.className = "seg";
        box.id = `${id}-seg`;
        [...sel.options].forEach((o) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = o.textContent.trim();
          b.dataset.value = o.value;
          b.addEventListener("click", () => {
            if (sel.value === o.value) return;
            sel.value = o.value;
            sel.dispatchEvent(new Event("change", { bubbles: true }));
          });
          box.appendChild(b);
        });
        sel.style.display = "none";
        sel.after(box);
        const sync = () =>
          box.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.value === sel.value));
        sel.addEventListener("change", sync);
        sync();
      }
