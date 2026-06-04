      // ════════════════════════════════════════════════════
      //  TAB: キー溝寸法
      // ════════════════════════════════════════════════════
      // 新JIS B 1301:1996 平行キー溝寸法
      // [d_min, d_max, b, h, t1, t2, L_min, L_max]
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
        [130, 150, 36, 20, 12.0, 8.4, 100, 400],
        [150, 170, 40, 22, 13.0, 9.4, 110, 450],
        [170, 200, 45, 25, 15.0, 10.4, 125, 500],
        [200, 230, 50, 28, 17.0, 11.4, 140, 500],
        [230, 260, 56, 32, 20.0, 12.4, 160, 500],
        [260, 290, 63, 32, 20.0, 12.4, 180, 500],
        [290, 330, 70, 36, 22.0, 14.4, 200, 500],
        [330, 380, 80, 40, 25.0, 15.4, 220, 500],
        [380, 440, 90, 45, 28.0, 17.4, 250, 500],
        [440, 500, 100, 50, 31.0, 19.5, 280, 500],
      ];

      // こう配キー（新JIS参考） [d_min, d_max, b, h, t1, t2]
      const KW_TAPER = [
        [6, 8, 2, 2, 1.2, 1.0],
        [8, 10, 3, 3, 1.8, 1.4],
        [10, 12, 4, 4, 2.5, 1.8],
        [12, 17, 5, 5, 3.0, 2.3],
        [17, 22, 6, 6, 3.5, 2.8],
        [22, 30, 8, 7, 4.0, 3.3],
        [30, 38, 10, 8, 5.0, 3.3],
        [38, 44, 12, 8, 5.0, 3.3],
        [44, 50, 14, 9, 5.5, 3.8],
        [50, 58, 16, 10, 6.0, 4.3],
        [58, 65, 18, 11, 7.0, 4.4],
        [65, 75, 20, 12, 7.5, 4.9],
        [75, 85, 22, 14, 9.0, 5.4],
        [85, 95, 25, 14, 9.0, 5.4],
        [95, 110, 28, 16, 10.0, 6.4],
        [110, 130, 32, 18, 11.0, 7.4],
        [130, 150, 36, 20, 12.0, 8.4],
      ];

      // 旧JIS B 1301:1959 1種（すきまばめ）
      // 適用軸径の境界が新JISと一部異なる点に注意
      const KW_OLD1 = [
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
        [85, 100, 25, 14, 9.0, 5.4, 70, 280], // ← 新JISは85〜95 ※境界差
        [100, 120, 28, 16, 10.0, 6.4, 80, 320], // ← 新JISは95〜110 ※境界差
        [120, 140, 32, 18, 11.0, 7.4, 90, 360],
        [140, 160, 36, 20, 12.0, 8.4, 100, 400],
        [160, 180, 40, 22, 13.0, 9.4, 110, 450],
        [180, 200, 45, 25, 15.0, 10.4, 125, 500],
        [200, 230, 50, 28, 17.0, 11.4, 140, 500],
        [230, 260, 56, 32, 20.0, 12.4, 160, 500],
        [260, 300, 63, 32, 20.0, 12.4, 180, 500], // ← 新JISは260〜290 ※境界差
        [300, 340, 70, 36, 22.0, 14.4, 200, 500], // ← 新JISは290〜330 ※境界差
        [340, 400, 80, 40, 25.0, 15.4, 220, 500], // ← 新JISは330〜380 ※境界差
        [400, 460, 90, 45, 28.0, 17.4, 250, 500],
        [460, 500, 100, 50, 31.0, 19.5, 280, 500],
      ];

      // 旧JIS B 1301:1959 2種（中間ばめ）
      // b・h・t1・t2の公称値は1種と同一、公差体系のみ異なる
      const KW_OLD2 = [
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
        [85, 95, 25, 14, 9.0, 5.4, 70, 280], // ← 1種は85〜100 ※境界差
        [95, 110, 28, 16, 10.0, 6.4, 80, 320], // ← 1種は100〜120 ※境界差
        [110, 130, 32, 18, 11.0, 7.4, 90, 360],
        [130, 150, 36, 20, 12.0, 8.4, 100, 400],
        [150, 170, 40, 22, 13.0, 9.4, 110, 450],
        [170, 200, 45, 25, 15.0, 10.4, 125, 500],
        [200, 230, 50, 28, 17.0, 11.4, 140, 500],
        [230, 260, 56, 32, 20.0, 12.4, 160, 500],
        [260, 290, 63, 32, 20.0, 12.4, 180, 500],
        [290, 330, 70, 36, 22.0, 14.4, 200, 500],
        [330, 380, 80, 40, 25.0, 15.4, 220, 500],
        [380, 440, 90, 45, 28.0, 17.4, 250, 500],
        [440, 500, 100, 50, 31.0, 19.5, 280, 500],
      ];

      // 境界値が新JISと異なる旧JIS行にフラグ（インデックス）
      const KW_OLD1_DIFF = new Set([13, 14, 21, 22, 23]); // d境界差異行
      const KW_OLD2_DIFF = new Set([13, 14]);

      let kwCurrentTab = "new";

      function switchKwTab(tab, el) {
        kwCurrentTab = tab;
        document
          .querySelectorAll('[id^="kw-tab-"]')
          .forEach((e) => e.classList.remove("active"));
        el.classList.add("active");
        ["new", "old1", "old2"].forEach((t) => {
          const el = document.getElementById(
            `kw-table-${t}`,
          );
          if (el)
            el.style.display = t === tab ? "" : "none";
        });
        filterKeyway();
      }

      function initKeyway() {
        renderKwTable(
          "kw-tbody-new",
          KW_NEW,
          "new",
          new Set(),
        );
        renderKwTable(
          "kw-tbody-old1",
          KW_OLD1,
          "old1",
          KW_OLD1_DIFF,
        );
        renderKwTable(
          "kw-tbody-old2",
          KW_OLD2,
          "old2",
          KW_OLD2_DIFF,
        );
        renderKwTaperTable();
        filterKeyway();
      }

      function renderKwTable(
        tbodyId,
        data,
        tabType,
        diffSet,
      ) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        const bColor =
          tabType === "new"
            ? "var(--accent)"
            : tabType === "old1"
              ? "var(--warn)"
              : "var(--bad)";
        tbody.innerHTML = data
          .map((r, i) => {
            const isDiff = diffSet.has(i);
            const diffMark = isDiff
              ? ' <span style="color:var(--bad);font-size:10px" title="新JISと境界値が異なる">★境界差</span>'
              : "";
            return `<tr data-kw-idx="${i}" onclick="highlightKw(this,'${tbodyId}',${i},'${tabType}')" style="cursor:pointer">
      <td>${r[0]} 〜 ${r[1]}${diffMark}</td>
      <td style="font-weight:700;color:${bColor}">${r[2]}</td>
      <td>${r[3]}</td>
      <td style="color:var(--good)">${r[4]}</td>
      <td style="color:var(--warn)">${r[5]}</td>
      <td style="color:var(--muted);font-size:11px">${r[6]} 〜 ${r[7]}</td>
    </tr>`;
          })
          .join("");
      }

      function renderKwTaperTable() {
        const tbody = document.getElementById(
          "kw-tbody-taper",
        );
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

      function highlightKw(row, tbodyId, idx, tabType) {
        document
          .querySelectorAll(`#${tbodyId} tr`)
          .forEach((r) => (r.style.background = ""));
        row.style.background = "var(--accent-dim)";
        const dataMap = {
          new: KW_NEW,
          old1: KW_OLD1,
          old2: KW_OLD2,
        };
        const r = (dataMap[tabType] || KW_NEW)[idx];
        const card = document.getElementById(
          "kw-detail-card",
        );
        const content = document.getElementById(
          "kw-detail-content",
        );
        const label = document.getElementById(
          "kw-detail-label",
        );
        const tabLabel = {
          new: "新JIS",
          old1: "旧JIS 1種",
          old2: "旧JIS 2種",
        };
        const bColor =
          tabType === "new"
            ? "var(--accent)"
            : tabType === "old1"
              ? "var(--warn)"
              : "var(--bad)";
        const fitType =
          tabType === "new"
            ? "b₁:N9 / b₂:JS9"
            : tabType === "old1"
              ? "D10相当（すきま）"
              : "JS9相当（中間）";
        if (card && content && r) {
          card.style.display = "";
          if (label)
            label.textContent = `${tabLabel[tabType]} — 軸径 ${r[0]}〜${r[1]}mm の詳細`;
          content.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">
        <div class="card" style="border-color:${bColor};background:var(--surface2)">
          <div class="card-label">キー幅 b</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:${bColor}">${r[2]}<span style="font-size:12px;color:var(--muted)"> mm</span></div>
          <div style="font-size:10px;color:${bColor};margin-top:3px">${fitType}</div>
        </div>
        <div class="card good"><div class="card-label">軸溝深さ t₁</div><div class="card-value" style="color:var(--good)">${r[4]}<span class="card-unit">mm</span></div></div>
        <div class="card warn"><div class="card-label">ボス溝深さ t₂</div><div class="card-value" style="color:var(--warn)">${r[5]}<span class="card-unit">mm</span></div></div>
        <div class="card"><div class="card-label">キー高さ h</div><div class="card-value">${r[3]}<span class="card-unit">mm</span></div></div>
        <div class="card"><div class="card-label">適用軸径</div><div style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:600">${r[0]}〜${r[1]}<span class="card-unit">mm</span></div></div>
        <div class="card"><div class="card-label">キー長さ L</div><div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600">${r[6]}〜${r[7]}<span class="card-unit">mm</span></div></div>
      </div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:8px 10px;font-size:11px;color:var(--muted)">
        端部形状：A形（両丸）/ B形（両角）/ C形（片丸片角）— <b>いずれも上記寸法は共通</b>。端部形状はキー長有効係合長に影響するが b・h・t₁・t₂ は変わらない。
      </div>`;
        }
      }

      function filterKeyway() {
        const d =
          parseFloat(
            document.getElementById("kw-shaft-d")?.value,
          ) || 0;
        const info =
          document.getElementById("kw-match-info");
        const dataMap = {
          new: KW_NEW,
          old1: KW_OLD1,
          old2: KW_OLD2,
        };
        const diffMap = {
          new: new Set(),
          old1: KW_OLD1_DIFF,
          old2: KW_OLD2_DIFF,
        };
        const tabType = kwCurrentTab;
        const data = dataMap[tabType];
        const diffSet = diffMap[tabType];
        const tbodyId = `kw-tbody-${tabType}`;

        // 全タブ再描画（軸径ハイライト適用）
        ["new", "old1", "old2"].forEach((t) => {
          renderKwTableFiltered(
            `kw-tbody-${t}`,
            dataMap[t],
            t,
            diffMap[t],
            d,
          );
        });

        if (!info) return;
        if (d <= 0) {
          info.textContent = "全件表示中";
          return;
        }

        const matchIdx = data.findIndex(
          (r) => d > r[0] && d <= r[1],
        );
        if (matchIdx >= 0) {
          const r = data[matchIdx];
          const isDiff = diffSet.has(matchIdx);
          const diffNote = isDiff
            ? ' <span style="color:var(--bad)">★新JISと境界値が異なります</span>'
            : "";
          info.innerHTML = `✅ 軸径 <b style="color:var(--accent)">${d}mm</b> → b=<b style="color:var(--accent)">${r[2]}mm</b> h=${r[3]}mm t₁=${r[4]}mm t₂=${r[5]}mm${diffNote}`;
          // 詳細カードを自動表示
          const fakeRow = {};
          highlightKwByData(r, tabType, matchIdx);
        } else {
          info.innerHTML = `<span style="color:var(--warn)">⚠ 軸径 ${d}mm は対応範囲外（6〜500mm）</span>`;
        }
      }

      function renderKwTableFiltered(
        tbodyId,
        data,
        tabType,
        diffSet,
        highlightD,
      ) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        const bColor =
          tabType === "new"
            ? "var(--accent)"
            : tabType === "old1"
              ? "var(--warn)"
              : "var(--bad)";
        tbody.innerHTML = data
          .map((r, i) => {
            const isMatch =
              highlightD > 0 &&
              highlightD > r[0] &&
              highlightD <= r[1];
            const isDiff = diffSet.has(i);
            const bg = isMatch
              ? "background:var(--accent-dim);"
              : "";
            const diffMark = isDiff
              ? ' <span style="color:var(--bad);font-size:10px">★境界差</span>'
              : "";
            return `<tr data-kw-idx="${i}" onclick="highlightKw(this,'${tbodyId}',${i},'${tabType}')" style="cursor:pointer;${bg}">
      <td>${isMatch ? `<b style="color:var(--accent)">` : ""} ${r[0]} 〜 ${r[1]}${isMatch ? "</b>" : ""}${diffMark}</td>
      <td style="font-weight:700;color:${bColor}">${r[2]}</td>
      <td>${r[3]}</td>
      <td style="color:var(--good)">${r[4]}</td>
      <td style="color:var(--warn)">${r[5]}</td>
      <td style="color:var(--muted);font-size:11px">${r[6]} 〜 ${r[7]}</td>
    </tr>`;
          })
          .join("");
      }

      function highlightKwByData(r, tabType, idx) {
        const card = document.getElementById(
          "kw-detail-card",
        );
        const content = document.getElementById(
          "kw-detail-content",
        );
        const label = document.getElementById(
          "kw-detail-label",
        );
        const tabLabel = {
          new: "新JIS",
          old1: "旧JIS 1種",
          old2: "旧JIS 2種",
        };
        const bColor =
          tabType === "new"
            ? "var(--accent)"
            : tabType === "old1"
              ? "var(--warn)"
              : "var(--bad)";
        const fitType =
          tabType === "new"
            ? "b₁:N9 / b₂:JS9"
            : tabType === "old1"
              ? "D10相当（すきま）"
              : "JS9相当（中間）";
        if (card && content && r) {
          card.style.display = "";
          if (label)
            label.textContent = `${tabLabel[tabType]} — 軸径 ${r[0]}〜${r[1]}mm の詳細`;
          content.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">
        <div class="card" style="border-color:${bColor};background:var(--surface2)">
          <div class="card-label">キー幅 b</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:${bColor}">${r[2]}<span style="font-size:12px;color:var(--muted)"> mm</span></div>
          <div style="font-size:10px;color:${bColor};margin-top:3px">${fitType}</div>
        </div>
        <div class="card good"><div class="card-label">軸溝深さ t₁</div><div class="card-value" style="color:var(--good)">${r[4]}<span class="card-unit">mm</span></div></div>
        <div class="card warn"><div class="card-label">ボス溝深さ t₂</div><div class="card-value" style="color:var(--warn)">${r[5]}<span class="card-unit">mm</span></div></div>
        <div class="card"><div class="card-label">キー高さ h</div><div class="card-value">${r[3]}<span class="card-unit">mm</span></div></div>
        <div class="card"><div class="card-label">適用軸径</div><div style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:600">${r[0]}〜${r[1]}<span class="card-unit">mm</span></div></div>
        <div class="card"><div class="card-label">キー長さ L</div><div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600">${r[6]}〜${r[7]}<span class="card-unit">mm</span></div></div>
      </div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:8px 10px;font-size:11px;color:var(--muted)">
        端部形状：A形（両丸）/ B形（両角）/ C形（片丸片角）— <b>いずれも上記寸法は共通</b>
      </div>`;
        }
      }
