      // ════════════════════════════════════════
      // TAB: ネジ
      // ════════════════════════════════════════
      const SCREW_DATA = {
        metric: [
          {
            name: "M2",
            d: 2,
            p: 0.4,
            drill_tap: 1.6,
            drill_die: 1.95,
            area: 2.07,
          },
          {
            name: "M2.5",
            d: 2.5,
            p: 0.45,
            drill_tap: 2.05,
            drill_die: 2.45,
            area: 3.39,
          },
          {
            name: "M3",
            d: 3,
            p: 0.5,
            drill_tap: 2.5,
            drill_die: 2.95,
            area: 5.03,
          },
          {
            name: "M4",
            d: 4,
            p: 0.7,
            drill_tap: 3.3,
            drill_die: 3.95,
            area: 8.78,
          },
          {
            name: "M5",
            d: 5,
            p: 0.8,
            drill_tap: 4.2,
            drill_die: 4.95,
            area: 14.2,
          },
          {
            name: "M6",
            d: 6,
            p: 1.0,
            drill_tap: 5.0,
            drill_die: 5.95,
            area: 20.1,
          },
          {
            name: "M8",
            d: 8,
            p: 1.25,
            drill_tap: 6.8,
            drill_die: 7.95,
            area: 36.6,
          },
          {
            name: "M10",
            d: 10,
            p: 1.5,
            drill_tap: 8.5,
            drill_die: 9.95,
            area: 58.0,
          },
          {
            name: "M12",
            d: 12,
            p: 1.75,
            drill_tap: 10.2,
            drill_die: 11.95,
            area: 84.3,
          },
          {
            name: "M14",
            d: 14,
            p: 2.0,
            drill_tap: 12.0,
            drill_die: 13.95,
            area: 115,
          },
          {
            name: "M16",
            d: 16,
            p: 2.0,
            drill_tap: 14.0,
            drill_die: 15.95,
            area: 157,
          },
          {
            name: "M18",
            d: 18,
            p: 2.5,
            drill_tap: 15.5,
            drill_die: 17.95,
            area: 192,
          },
          {
            name: "M20",
            d: 20,
            p: 2.5,
            drill_tap: 17.5,
            drill_die: 19.95,
            area: 245,
          },
          {
            name: "M22",
            d: 22,
            p: 2.5,
            drill_tap: 19.5,
            drill_die: 21.95,
            area: 303,
          },
          {
            name: "M24",
            d: 24,
            p: 3.0,
            drill_tap: 21.0,
            drill_die: 23.95,
            area: 353,
          },
          {
            name: "M27",
            d: 27,
            p: 3.0,
            drill_tap: 24.0,
            drill_die: 26.95,
            area: 459,
          },
          {
            name: "M30",
            d: 30,
            p: 3.5,
            drill_tap: 26.5,
            drill_die: 29.95,
            area: 561,
          },
          {
            name: "M36",
            d: 36,
            p: 4.0,
            drill_tap: 32.0,
            drill_die: 35.95,
            area: 817,
          },
          {
            name: "M42",
            d: 42,
            p: 4.5,
            drill_tap: 37.5,
            drill_die: 41.95,
            area: 1120,
          },
          {
            name: "M48",
            d: 48,
            p: 5.0,
            drill_tap: 43.0,
            drill_die: 47.95,
            area: 1470,
          },
        ],
        "inch-unc": [
          {
            name: "#4-40",
            d: 2.845,
            p: 0.635,
            drill_tap: 2.26,
            drill_die: 2.79,
            area: 4.1,
            inch: "#4",
          },
          {
            name: "#6-32",
            d: 3.505,
            p: 0.794,
            drill_tap: 2.77,
            drill_die: 3.45,
            area: 6.4,
            inch: "#6",
          },
          {
            name: "#8-32",
            d: 4.166,
            p: 0.794,
            drill_tap: 3.45,
            drill_die: 4.11,
            area: 9.4,
            inch: "#8",
          },
          {
            name: "#10-24",
            d: 4.826,
            p: 1.058,
            drill_tap: 3.76,
            drill_die: 4.75,
            area: 12.3,
            inch: "#10",
          },
          {
            name: "1/4-20",
            d: 6.35,
            p: 1.27,
            drill_tap: 5.1,
            drill_die: 6.27,
            area: 20.5,
            inch: '1/4"',
          },
          {
            name: "5/16-18",
            d: 7.938,
            p: 1.411,
            drill_tap: 6.6,
            drill_die: 7.85,
            area: 32.3,
            inch: '5/16"',
          },
          {
            name: "3/8-16",
            d: 9.525,
            p: 1.588,
            drill_tap: 8.0,
            drill_die: 9.45,
            area: 47.7,
            inch: '3/8"',
          },
          {
            name: "7/16-14",
            d: 11.11,
            p: 1.814,
            drill_tap: 9.4,
            drill_die: 11.0,
            area: 64.5,
            inch: '7/16"',
          },
          {
            name: "1/2-13",
            d: 12.7,
            p: 1.954,
            drill_tap: 10.7,
            drill_die: 12.6,
            area: 84.0,
            inch: '1/2"',
          },
          {
            name: "5/8-11",
            d: 15.88,
            p: 2.309,
            drill_tap: 13.5,
            drill_die: 15.7,
            area: 130,
            inch: '5/8"',
          },
          {
            name: "3/4-10",
            d: 19.05,
            p: 2.54,
            drill_tap: 16.3,
            drill_die: 18.9,
            area: 189,
            inch: '3/4"',
          },
          {
            name: "7/8-9",
            d: 22.23,
            p: 2.822,
            drill_tap: 19.1,
            drill_die: 22.0,
            area: 258,
            inch: '7/8"',
          },
          {
            name: '1"-8',
            d: 25.4,
            p: 3.175,
            drill_tap: 21.8,
            drill_die: 25.2,
            area: 335,
            inch: '1"',
          },
        ],
        "inch-unf": [
          {
            name: "#6-40",
            d: 3.505,
            p: 0.635,
            drill_tap: 2.9,
            drill_die: 3.45,
            area: 7.0,
            inch: "#6",
          },
          {
            name: "#8-36",
            d: 4.166,
            p: 0.706,
            drill_tap: 3.55,
            drill_die: 4.11,
            area: 10.1,
            inch: "#8",
          },
          {
            name: "#10-32",
            d: 4.826,
            p: 0.794,
            drill_tap: 4.0,
            drill_die: 4.75,
            area: 13.4,
            inch: "#10",
          },
          {
            name: "1/4-28",
            d: 6.35,
            p: 0.907,
            drill_tap: 5.55,
            drill_die: 6.27,
            area: 22.9,
            inch: '1/4"',
          },
          {
            name: "5/16-24",
            d: 7.938,
            p: 1.058,
            drill_tap: 7.0,
            drill_die: 7.85,
            area: 35.7,
            inch: '5/16"',
          },
          {
            name: "3/8-24",
            d: 9.525,
            p: 1.058,
            drill_tap: 8.6,
            drill_die: 9.45,
            area: 54.7,
            inch: '3/8"',
          },
          {
            name: "1/2-20",
            d: 12.7,
            p: 1.27,
            drill_tap: 11.6,
            drill_die: 12.6,
            area: 97.3,
            inch: '1/2"',
          },
          {
            name: "5/8-18",
            d: 15.88,
            p: 1.411,
            drill_tap: 14.6,
            drill_die: 15.7,
            area: 152,
            inch: '5/8"',
          },
          {
            name: "3/4-16",
            d: 19.05,
            p: 1.588,
            drill_tap: 17.6,
            drill_die: 18.9,
            area: 222,
            inch: '3/4"',
          },
          {
            name: '1"-12',
            d: 25.4,
            p: 2.117,
            drill_tap: 23.3,
            drill_die: 25.2,
            area: 390,
            inch: '1"',
          },
        ],
      };
      // 細目ピッチデータ（JIS B 0207）
      // [呼び径, 並目p, 細目p1, 細目p2, 細目p3, 細目p4(極細目)]  null=なし
      const FINE_PITCH = [
        // ── M2〜M7（小径：細目は限定的）──
        [2,   0.4,  null, null, null, null],
        [2.5, 0.45, null, null, null, null],
        [3,   0.5,  null, null, null, null],
        [4,   0.7,  null, null, null, null],
        [5,   0.8,  null, null, null, null],
        [6,   1.0,  0.75, null, null, null],
        [7,   1.0,  0.75, null, null, null],
        // ── M8〜M18 ──
        [8,   1.25, 1.0,  0.75, null, null],
        [9,   1.25, 1.0,  0.75, null, null],
        [10,  1.5,  1.25, 1.0,  0.75, null],
        [11,  1.5,  1.0,  0.75, null, null],
        [12,  1.75, 1.5,  1.25, 1.0,  null],
        [14,  2.0,  1.5,  1.25, 1.0,  null],
        [15,  1.5,  1.0,  null, null, null],  // 非標準径・一部規格に存在
        [16,  2.0,  1.5,  1.0,  null, null],
        [17,  1.5,  1.0,  null, null, null],  // 非標準径
        [18,  2.5,  2.0,  1.5,  1.0,  null],
        // ── M20以上 ──
        [20,  2.5,  2.0,  1.5,  1.0,  null],  // P1.0：シリンダーヘッド・燃料系等
        [22,  2.5,  2.0,  1.5,  1.0,  null],
        [24,  3.0,  2.0,  1.5,  1.0,  null],
        [25,  null, 2.0,  1.5,  1.0,  null],  // 並目なし・細目専用規格
        [26,  null, 1.5,  null, null, null],
        [27,  3.0,  2.0,  1.5,  1.0,  null],
        [28,  null, 2.0,  1.5,  1.0,  null],
        [30,  3.5,  2.0,  1.5,  1.0,  null],
        [32,  null, 2.0,  1.5,  null, null],
        [33,  3.5,  2.0,  1.5,  null, null],
        [35,  null, 1.5,  null, null, null],
        [36,  4.0,  3.0,  2.0,  1.5,  null],
        [38,  null, 1.5,  null, null, null],
        [39,  4.0,  3.0,  2.0,  1.5,  null],
        [40,  null, 3.0,  2.0,  1.5,  null],
        [42,  4.5,  3.0,  2.0,  1.5,  null],
        [45,  4.5,  3.0,  2.0,  1.5,  null],
        [48,  5.0,  3.0,  2.0,  1.5,  null],
        [50,  null, 3.0,  2.0,  1.5,  null],
        [52,  5.0,  4.0,  3.0,  2.0,  1.5],
        [55,  null, 4.0,  3.0,  2.0,  1.5],
        [56,  5.5,  4.0,  3.0,  2.0,  1.5],
        [58,  null, 4.0,  3.0,  2.0,  1.5],
        [60,  5.5,  4.0,  3.0,  2.0,  1.5],
        [62,  null, 4.0,  3.0,  2.0,  1.5],
        [64,  6.0,  4.0,  3.0,  2.0,  1.5],
        [65,  null, 4.0,  3.0,  2.0,  1.5],
        [68,  6.0,  4.0,  3.0,  2.0,  1.5],
        [70,  null, 6.0,  4.0,  3.0,  2.0],
        [72,  6.0,  4.0,  3.0,  2.0,  1.5],
        [76,  6.0,  4.0,  3.0,  2.0,  1.5],
        [80,  6.0,  4.0,  3.0,  2.0,  1.5],
        [85,  null, 6.0,  4.0,  3.0,  2.0],
        [90,  6.0,  4.0,  3.0,  2.0,  null],
        [95,  null, 6.0,  4.0,  3.0,  2.0],
        [100, 6.0,  4.0,  3.0,  2.0,  null],
      ];

      function buildScrewSelect() {
        const type = $("screw-type").value;
        const sel = $("screw-size");
        sel.innerHTML = SCREW_DATA[type]
          .map(
            (s, i) =>
              `<option value="${i}">${s.name}</option>`,
          )
          .join("");
        calcScrew();
      }

      function calcScrew() {
        const type = $("screw-type").value;
        const s = SCREW_DATA[type][+$("screw-size").value];
        if (!s) return;
        $("sc-d").innerHTML =
          `${s.d.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("sc-pitch").innerHTML =
          `${s.p.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("sc-area").innerHTML =
          `${s.area.toFixed(1)}<span class="card-unit"> mm²</span>`;

        // ────── 締結強度計算 ──────
        // 強度区分 → 降伏点・引張強さ (MPa)
        const GRADE_TABLE = {
          "4.8":  { Sy: 320,  Su: 400  },
          "6.8":  { Sy: 480,  Su: 600  },
          "8.8":  { Sy: 640,  Su: 800  },
          "10.9": { Sy: 940,  Su: 1040 },
          "12.9": { Sy: 1100, Su: 1220 },
        };
        const grade  = $("screw-grade").value;
        const k      = parseFloat($("screw-k").value);
        const util   = parseFloat($("screw-util").value);
        const { Sy }  = GRADE_TABLE[grade];
        const As      = s.area;          // mm²
        const d_m     = s.d;             // mm

        // 許容軸力 F_allow（降伏点ベース）
        const F_allow = Sy * As * util / 1000;  // kN

        // 推奨締付けトルク（許容軸力を使って逆算）
        const T_rec   = k * d_m * (F_allow * 1000) / 1000;  // N·m

        // そのときの軸力（＝ F_allow そのもの）
        const F_axial = F_allow;  // kN

        // 引張応力（= Sy × util、参考値）
        const sigma   = Sy * util;  // MPa

        // せん断耐力（von Mises: τy = Sy/√3）
        const tau_y   = Sy / Math.sqrt(3);
        const F_shear = tau_y * As / 1000;  // kN

        const setStrength = (id, val, dec=1) => {
          const el = $(id);
          if (el) el.innerHTML = `${val.toFixed(dec)}<span class="card-unit">${el.innerHTML.match(/card-unit[^>]*>([^<]+)/)?.[1] ?? ""}</span>`;
        };

        // カード更新（card-unit はHTMLに既にある）
        $("sc-torque").innerHTML    = `${T_rec.toFixed(1)}<span class="card-unit">N·m</span>`;
        $("sc-axial").innerHTML     = `${F_axial.toFixed(2)}<span class="card-unit">kN</span>`;
        $("sc-stress").innerHTML    = `${sigma.toFixed(0)}<span class="card-unit">MPa</span>`;
        $("sc-axial-max").innerHTML = `${F_allow.toFixed(2)}<span class="card-unit">kN</span>`;
        $("sc-shear").innerHTML     = `${F_shear.toFixed(2)}<span class="card-unit">kN</span>`;
        // ────────────────────────────

        const rows = [
          [
            "タップ下穴径（鉄・鋼 推奨）",
            `${s.drill_tap.toFixed(2)} mm`,
            "標準的な切削タップ",
          ],
          [
            "タップ下穴径（アルミ・軟材）",
            `${(s.drill_tap + 0.1).toFixed(2)} mm`,
            "軟材は少し大きめ",
          ],
          [
            "ダイス加工用軸径",
            `${s.drill_die.toFixed(2)} mm`,
            "公差 −0/+0.01 程度",
          ],
          [
            "有効断面積 As",
            `${s.area.toFixed(1)} mm²`,
            "軸力計算に使用",
          ],
          [
            "谷径（概算）",
            `${(s.d - 1.2269 * s.p).toFixed(3)} mm`,
            "h=0.6134p",
          ],
          ...(s.inch
            ? [["インチ呼び", s.inch, "参考"]]
            : []),
        ];
        $("screw-tbody").innerHTML = rows
          .map(
            (r) =>
              `<tr><td>${r[0]}</td><td class="hl">${r[1]}</td><td style="color:var(--muted);font-family:'Noto Sans JP',sans-serif">${r[2]}</td></tr>`,
          )
          .join("");

        // 細目テーブル：メートルネジのみ表示
        const fineSection = $("fine-pitch-section");
        if (type !== "metric") {
          fineSection.style.display = "none";
          return;
        }
        fineSection.style.display = "";

        $("fine-pitch-tbody").innerHTML = FINE_PITCH.map(
          (r) => {
            const [d, coarse, f1, f2, f3, f4] = r;
            const cell = (v, isUltra) => {
              if (v === null) return `<td style="color:var(--border)">—</td>`;
              const dieMin = (d - v * 0.15).toFixed(2);
              const dieMax = (d - v * 0.1).toFixed(2);
              return `<td class="hl" style="${isUltra ? 'background:var(--warn-dim);' : ''}">
                    <span style="${isUltra ? 'color:var(--warn);font-weight:700' : ''}">${v.toFixed(2)} mm</span>
                    <span style="display:block;color:var(--muted);font-size:10px">下穴 Ø${(d - v).toFixed(2)}</span>
                    <span style="display:block;color:var(--accent);font-size:10px">軸径 Ø${dieMin}〜${dieMax}</span>
                   </td>`;
            };
            const coarseDisp = coarse !== null
              ? `<td style="color:var(--muted)">${coarse.toFixed(2)} mm</td>`
              : `<td style="color:var(--border)">—</td>`;
            return `<tr>
      <td style="font-family:'JetBrains Mono',monospace;color:var(--ink);font-weight:700">M${d}</td>
      ${coarseDisp}
      ${cell(f1,false)}${cell(f2,false)}${cell(f3,false)}${cell(f4,true)}
    </tr>`;
          },
        ).join("");
      }
