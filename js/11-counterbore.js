      // ════════════════════════════════════════
      // TAB: 座グリ
      // JIS B 1176 / B 4633 準拠
      // cap: [呼び, d_pass, cbore_d, cbore_depth, head_h, head_d, hex_w, note]
      // csk: [呼び, d_pass, csk_d, csk_depth, angle]
      // ════════════════════════════════════════
      const CBORE_DATA = {
        // [呼び径, 通し穴径, 座グリ径, 座グリ深さ(min), ヘッド径, ヘッド高, 六角穴対辺]
        cap: [
          ["M3", 3.4, 6.5, 3.4, 5.5, 3.0, 2.5],
          ["M4", 4.5, 8.0, 4.4, 7.0, 4.0, 3.0],
          ["M5", 5.5, 9.5, 5.4, 8.5, 5.0, 4.0],
          ["M6", 6.6, 11.0, 6.5, 10.0, 6.0, 5.0],
          ["M8", 9.0, 14.5, 8.6, 13.0, 8.0, 6.0],
          ["M10", 11.0, 17.5, 10.8, 16.0, 10.0, 8.0],
          ["M12", 13.5, 20.5, 13.0, 18.0, 12.0, 10.0],
          ["M14", 15.5, 23.5, 14.5, 21.0, 14.0, 12.0],
          ["M16", 17.5, 26.5, 16.5, 24.0, 16.0, 14.0],
          ["M18", 20.0, 30.0, 18.5, 27.0, 18.0, 14.0],
          ["M20", 22.0, 33.5, 20.5, 30.0, 20.0, 17.0],
          ["M24", 26.0, 40.0, 24.5, 36.0, 24.0, 19.0],
        ],
        // [呼び径, 通し穴径, 皿座グリ径, 深さ, ヘッド対角径, ヘッド高]
        csk: [
          ["M2", 2.4, 4.4, 1.2, 3.8, 1.2],
          ["M2.5", 2.9, 5.5, 1.5, 4.7, 1.5],
          ["M3", 3.4, 6.3, 1.7, 5.6, 1.7],
          ["M4", 4.5, 8.4, 2.3, 7.5, 2.3],
          ["M5", 5.5, 10.4, 2.8, 9.2, 2.8],
          ["M6", 6.6, 12.6, 3.3, 11.0, 3.3],
          ["M8", 9.0, 17.3, 4.4, 15.0, 4.4],
          ["M10", 11.0, 20.0, 5.5, 18.0, 5.5],
          ["M12", 13.5, 24.0, 6.5, 21.5, 6.5],
          ["M14", 15.5, 28.0, 7.5, 25.0, 7.5],
          ["M16", 17.5, 32.0, 8.5, 29.0, 8.5],
          ["M20", 22.0, 40.0, 10.5, 36.0, 10.5],
        ],
      };
      function buildCboreSelect() {
        const type = $("cbore-type").value;
        const sel = $("cbore-size");
        const data =
          CBORE_DATA[type === "cap" ? "cap" : "csk"];
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
          CBORE_DATA[type === "cap" ? "cap" : "csk"];
        const idx = +$("cbore-size").value;
        const r = data[idx];
        if (!r) return;

        $("cb-d").innerHTML =
          `${r[0]}<span class="card-unit"></span>`;

        if (type === "cap") {
          $("cb-label1").textContent = "座グリ径";
          $("cb-label2").textContent = "座グリ深さ（最小）";
          $("cb-v1").innerHTML =
            `${r[2].toFixed(1)}<span class="card-unit"> mm</span>`;
          $("cb-v2").innerHTML =
            `${r[3].toFixed(1)}<span class="card-unit"> mm</span>`;
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
            `${r[2].toFixed(1)}<span class="card-unit"> mm</span>`;
          $("cb-v2").innerHTML =
            `${r[3].toFixed(1)}<span class="card-unit"> mm</span>`;
          const rows = [
            [
              "通し穴径（並）",
              `${r[1].toFixed(1)} mm`,
              "JIS B 1001 中",
            ],
            [
              "皿座グリ径",
              `${r[2].toFixed(1)} mm`,
              "頭部対角径＋余裕",
            ],
            [
              "皿座グリ深さ",
              `${r[3].toFixed(1)} mm`,
              "ヘッド高さ相当",
            ],
            [
              "頭部対角径（参考）",
              `${r[4].toFixed(1)} mm`,
              "JIS B 1111",
            ],
            ["ヘッド高さ", `${r[5].toFixed(1)} mm`, "参考"],
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
