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
