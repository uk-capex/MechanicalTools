      /* ══════════════════════════════════════════
         インサート下穴データ
         出典：スプリュー（日本スプリュー）スプリュータップ下穴表の適用下穴ドリル径
         2026-09 全サイズ照合済（杉本産業 特殊ねじ.com 掲載のスプリュー表）
      ══════════════════════════════════════════ */
      const INS_DATA = {
        // 2026-09 全サイズをスプリュー（日本スプリュー）適用下穴ドリル径で照合・追加
        //   変更：M2.6 2.7→2.8、M12×1.25 12.5→12.4（ヤマワ STI下穴上限12.483超え）、M20×2 20.5→20.6
        //   追加：M2、M22・M24・M30（並目）、M8×1・M22×1.5・M24×1.5/2・M30×1.5（細目）
        coarse: [
          // [呼び, ピッチ, インサート下穴(drill), 通常下穴]
          ["M2",    0.4,  2.1,  1.6],
          ["M2.5",  0.45, 2.6,  2.1],
          ["M2.6",  0.45, 2.8,  2.2],
          ["M3",    0.5,  3.1,  2.5],
          ["M4",    0.7,  4.2,  3.3],
          ["M5",    0.8,  5.2,  4.2],
          ["M6",    1.0,  6.3,  5.0],
          ["M8",    1.25, 8.4,  6.8],
          ["M10",   1.5,  10.5, 8.5],
          ["M12",   1.75, 12.5, 10.3],
          ["M14",   2.0,  14.5, 12.0],
          ["M16",   2.0,  16.5, 14.0],
          ["M18",   2.5,  19.0, 15.5],
          ["M20",   2.5,  21.0, 17.5],
          ["M22",   2.5,  23.0, 19.5],
          ["M24",   3.0,  25.0, 21.0],
          ["M30",   3.5,  31.0, 26.5],
        ],
        fine: [
          // [呼び, ピッチ, インサート下穴, 通常下穴]
          ["M8",   1.0,  8.3,  7.0],
          ["M10",  1.0,  10.3, 9.0],
          ["M10",  1.25, 10.4, 8.8],
          ["M12",  1.25, 12.4, 10.8],
          ["M12",  1.5,  12.5, 10.5],
          ["M14",  1.5,  14.5, 12.5],
          ["M16",  1.5,  16.5, 14.5],
          ["M18",  1.5,  18.5, 16.5],
          ["M20",  1.5,  20.5, 18.5],
          ["M20",  2.0,  20.6, 18.0],
          ["M22",  1.5,  22.5, 20.5],
          ["M24",  1.5,  24.5, 22.5],
          ["M24",  2.0,  24.5, 22.0],
          ["M30",  1.5,  30.5, 28.5],
        ],
      };

      function insRender() {
        const type  = document.getElementById("ins-type").value;
        const rows  = INS_DATA[type];
        const jump  = document.getElementById("ins-jump");

        /* ジャンプセレクト更新 */
        const seen  = new Set();
        jump.innerHTML = '<option value="">— 選択してジャンプ —</option>';
        rows.forEach((r, i) => {
          if (!seen.has(r[0])) {
            seen.add(r[0]);
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = r[0];
            jump.appendChild(opt);
          }
        });

        /* テーブル描画 */
        const tbody = rows.map((r, i) => {
          const [name, pitch, insDrill, normDrill] = r;
          const diff = normDrill !== null
            ? `+${(insDrill - normDrill).toFixed(2)}`
            : "—";
          const rowId = `ins-row-${i}`;
          return `
  <tr id="${rowId}" style="border-bottom:1px solid var(--border);">
    <td style="padding:9px 10px;font-weight:700;color:var(--ink);font-size:14px;">${name}</td>
    <td style="padding:9px 10px;font-family:'Inter',monospace;color:var(--muted);text-align:center;">${pitch}</td>
    <td style="padding:9px 10px;font-family:'Inter',monospace;color:var(--accent);text-align:center;font-size:15px;font-weight:700;">Φ ${insDrill.toFixed(1)}</td>
    <td style="padding:9px 10px;font-family:'Inter',monospace;color:var(--muted);text-align:center;">${normDrill !== null ? "Φ " + normDrill.toFixed(1) : "—"}</td>
    <td style="padding:9px 10px;font-family:'Inter',monospace;color:var(--good);text-align:center;">${diff}</td>
  </tr>`;
        }).join("");

        const html = `
<div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;">
  ${type === 'coarse' ? 'メートル並目（STIタップ）下穴径一覧' : 'メートル細目（STIタップ）下穴径一覧'}
</div>
<div style="overflow-x:auto;">
<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead>
    <tr style="border-bottom:2px solid var(--border);">
      <th style="padding:8px 10px;text-align:left;color:var(--muted);font-weight:600;">ねじ呼び</th>
      <th style="padding:8px 10px;text-align:center;color:var(--muted);font-weight:600;">ピッチ<br><span style="font-size:10px;">(mm)</span></th>
      <th style="padding:8px 10px;text-align:center;color:var(--accent);font-weight:700;">インサート<br>下穴径 (mm)</th>
      <th style="padding:8px 10px;text-align:center;color:var(--muted);font-weight:600;">通常タップ<br>下穴径 (mm)</th>
      <th style="padding:8px 10px;text-align:center;color:var(--good);font-weight:600;">差分<br>(mm)</th>
    </tr>
  </thead>
  <tbody>
    ${tbody}
  </tbody>
</table>
</div>
<p style="font-size:11px;color:var(--muted);margin-top:12px;">
  ※ 出典：インサート下穴＝スプリュー（日本スプリュー）適用下穴ドリル径、通常下穴＝JIS B 1004 系の一般値。被削材・タップ種類により最適値は異なる場合があります。
</p>`;
        document.getElementById("ins-table-wrap").innerHTML = html;
      }

      function insJump() {
        const idx = document.getElementById("ins-jump").value;
        if (idx === "") return;
        const el = document.getElementById(`ins-row-${idx}`);
        if (el) {
          el.style.background = "var(--accent-dim)";
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => { el.style.background = ""; }, 1500);
        }
      }

      /* 初回描画 */
