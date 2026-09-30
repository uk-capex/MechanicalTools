      // ════════════════════════════════════════
      // TAB: 座グリ
      // JIS B 1176 / B 4633 準拠
      // cap: [呼び, d_pass, cbore_d, cbore_depth, head_h, head_d, hex_w, note]
      // csk: [呼び, d_pass, csk_d, csk_depth, angle]
      // ════════════════════════════════════════
      const CBORE_DATA = {
        // [呼び径, 通し穴径, 座グリ径, 座グリ深さ(min), ヘッド径, ヘッド高, 六角穴対辺]
        // 座ぐり径・深さ：NBK「六角穴付きボルト加工穴寸法（参考値）」D・H2 に更新 2026-09（M18は未照合）
        cap: [
          ["M3", 3.4, 6.5, 3.3, 5.5, 3.0, 2.5],
          ["M4", 4.5, 8.0, 4.4, 7.0, 4.0, 3.0],
          ["M5", 5.5, 9.5, 5.4, 8.5, 5.0, 4.0],
          ["M6", 6.6, 11.0, 6.5, 10.0, 6.0, 5.0],
          ["M8", 9.0, 14.0, 8.6, 13.0, 8.0, 6.0],
          ["M10", 11.0, 17.5, 10.8, 16.0, 10.0, 8.0],
          ["M12", 13.5, 20.0, 13.0, 18.0, 12.0, 10.0],
          ["M14", 15.5, 23.0, 15.2, 21.0, 14.0, 12.0],
          ["M16", 17.5, 26.0, 17.5, 24.0, 16.0, 14.0],
          ["M18", 20.0, 30.0, 18.5, 27.0, 18.0, 14.0],
          ["M20", 22.0, 32.0, 21.5, 30.0, 20.0, 17.0],
          ["M24", 26.0, 39.0, 25.5, 36.0, 24.0, 19.0],
        ],
        // 皿小ねじ（JIS B 1111 / ISO 7046）M2〜M10  2026-09 改修
        // [呼び径, 通し穴径(JIS B 1001 2級), 皿径=頭部径 理論最大, 深さ=頭部高さ k最大, 頭部径 実寸法最大, k]
        csk: [
          ["M2", 2.4, 4.4, 1.2, 3.8, 1.2],
          ["M2.5", 2.9, 5.5, 1.5, 4.7, 1.5],
          ["M3", 3.4, 6.3, 1.65, 5.5, 1.65],
          ["M4", 4.5, 9.4, 2.7, 8.4, 2.7],
          ["M5", 5.5, 10.4, 2.7, 9.3, 2.7],
          ["M6", 6.6, 12.6, 3.3, 11.3, 3.3],
          ["M8", 9.0, 17.3, 4.65, 15.8, 4.65],
          ["M10", 11.0, 20.0, 5.0, 18.3, 5.0],
        ],
        // 六角穴付き皿ボルト（JIS B 1194 / ISO 10642）M3〜M20
        // [呼び径, 通し穴径, 皿径=頭部径 理論最大, 深さ=k最大, 頭部径 実寸法最小, k]
        cskb: [
          ["M3", 3.4, 6.72, 1.86, 5.54, 1.86],
          ["M4", 4.5, 8.96, 2.48, 7.53, 2.48],
          ["M5", 5.5, 11.2, 3.1, 9.43, 3.1],
          ["M6", 6.6, 13.44, 3.72, 11.34, 3.72],
          ["M8", 9.0, 17.92, 4.96, 15.24, 4.96],
          ["M10", 11.0, 22.4, 6.2, 19.22, 6.2],
          ["M12", 13.5, 26.88, 7.44, 23.12, 7.44],
          ["M14", 15.5, 30.8, 8.4, 26.52, 8.4],
          ["M16", 17.5, 33.6, 8.8, 29.01, 8.8],
          ["M20", 22.0, 40.32, 10.16, 36.05, 10.16],        ],
      };
      function buildCboreSelect() {
        const type = $("cbore-type").value;
        const sel = $("cbore-size");
        const data =
          CBORE_DATA[type];
        sel.innerHTML = data
          .map(
            (r, i) =>
              `<option value="${i}">${r[0]}</option>`,
          )
          .join("");
        calcCbore();
      }
      function calcCbore() {
        const type = $("cbore-type").value;
        const data =
          CBORE_DATA[type];
        const idx = +$("cbore-size").value;
        const r = data[idx];
        if (!r) return;

        $("cb-d").innerHTML =
          `${r[0]}<span class="card-unit"></span>`;

        if (type === "cap") {
          $("cb-label1").textContent = "座グリ径";
          $("cb-label2").textContent = "座グリ深さ（最小）";
          $("cb-v1").innerHTML =
            `${r[2].toFixed(2)}<span class="card-unit"> mm</span>`;
          $("cb-v2").innerHTML =
            `${r[3].toFixed(2)}<span class="card-unit"> mm</span>`;
          const rows = [
            [
              "通し穴径（並）",
              `${r[1].toFixed(1)} mm`,
              "JIS B 1001 中",
            ],
            [
              "座グリ径",
              `${r[2].toFixed(1)} mm`,
              "ヘッド径＋余裕",
            ],
            [
              "座グリ深さ（最小）",
              `${r[3].toFixed(1)} mm`,
              "ヘッド高＋0.3mm",
            ],
            [
              "ヘッド径",
              `${r[4].toFixed(1)} mm`,
              "参考寸法",
            ],
            [
              "ヘッド高さ",
              `${r[5].toFixed(1)} mm`,
              "JIS B 1176",
            ],
            [
              "六角穴対辺",
              `${r[6].toFixed(1)} mm`,
              "レンチサイズ",
            ],
          ];
          $("cbore-tbody").innerHTML = rows
            .map(
              (x) =>
                `<tr><td>${x[0]}</td><td class="hl">${x[1]}</td><td style="color:var(--muted);font-family:'Noto Sans JP',sans-serif">${x[2]}</td></tr>`,
            )
            .join("");
          $("cbore-memo").innerHTML =
            "<b>キャップスクリュー座グリ</b>：ボルト頭が完全に埋まる円筒穴<br>座グリ深さは最小値。実際は +0.5〜1mm 増しで加工することが多い。<br>通し穴は「並」の他に「精」（−0.1mm）「荒」（+0.5mm）がある。";
        } else {
          $("cb-label1").textContent = "皿座グリ径";
          $("cb-label2").textContent = "皿座グリ深さ";
          $("cb-v1").innerHTML =
            `${r[2].toFixed(2)}<span class="card-unit"> mm</span>`;
          $("cb-v2").innerHTML =
            `${r[3].toFixed(2)}<span class="card-unit"> mm</span>`;
          const rows = [
            [
              "通し穴径（並）",
              `${r[1].toFixed(1)} mm`,
              "JIS B 1001 中",
            ],
            [
              "皿座グリ径",
              `${r[2].toFixed(2)} mm`,
              "頭部径の理論最大（これ以上で頭が沈む）",
            ],
            [
              "皿座グリ深さ（目安）",
              `${r[3].toFixed(2)} mm`,
              "頭部高さ k 最大",
            ],
            [
              type === "csk" ? "頭部径 実寸法最大" : "頭部径 実寸法最小",
              `${r[4].toFixed(2)} mm`,
              type === "csk" ? "JIS B 1111 / ISO 7046" : "JIS B 1194 / ISO 10642",
            ],
            ["皿角度", "90°", "JIS 標準"],
          ];
          $("cbore-tbody").innerHTML = rows
            .map(
              (x) =>
                `<tr><td>${x[0]}</td><td class="hl">${x[1]}</td><td style="color:var(--muted);font-family:'Noto Sans JP',sans-serif">${x[2]}</td></tr>`,
            )
            .join("");
          $("cbore-memo").innerHTML =
            "<b>皿ネジ座グリ</b>：頭部が面と同一になる 90° 皿穴加工<br>皿ザグリ深さは頭が僅かに出るくらいが仕上がりきれい。<br>皿ドリルのセンタリングに注意（通し穴は先に開ける）。";
        }
      }
