      // ════════════════════════════════════════
      // TAB: 管用ネジ
      // ════════════════════════════════════════
      // SGP外径: JIS G 3452, 肉厚: スケジュール標準
      // SUS: JIS G 3459, 銅管: JIS H 3300 Kタイプ
      // 管用テーパネジ: JIS B 0203
      // [呼びA, インチ呼び, SGP外径, SGP肉厚, SUS外径, SUS肉厚, 銅外径, 銅肉厚,
      //  Rcネジ呼び, ピッチ, ヤマ数/25.4, 有効径, タップ下穴径, テーパ基準径]
      const PIPE_DB = {
        6: {
          inch: '1/8"',
          sgp_od: 10.5,
          sgp_t: 2.0,
          sus_od: 10.5,
          sus_t: 1.0,
          cu_od: 9.52,
          cu_t: 0.89,
          rc: "Rc 1/8",
          pitch: 0.907,
          tpi: 28,
          eff_d: 9.147,
          tap_d: 8.8,
          ref_d: 9.728,
        },
        8: {
          inch: '1/4"',
          sgp_od: 13.8,
          sgp_t: 2.3,
          sus_od: 13.8,
          sus_t: 1.2,
          cu_od: 12.7,
          cu_t: 0.89,
          rc: "Rc 1/4",
          pitch: 1.337,
          tpi: 19,
          eff_d: 12.301,
          tap_d: 11.8,
          ref_d: 13.157,
        },
        10: {
          inch: '3/8"',
          sgp_od: 17.3,
          sgp_t: 2.3,
          sus_od: 17.3,
          sus_t: 1.2,
          cu_od: 15.88,
          cu_t: 1.02,
          rc: "Rc 3/8",
          pitch: 1.337,
          tpi: 19,
          eff_d: 15.806,
          tap_d: 15.3,
          ref_d: 16.662,
        },
        15: {
          inch: '1/2"',
          sgp_od: 21.7,
          sgp_t: 2.8,
          sus_od: 21.7,
          sus_t: 1.6,
          cu_od: 19.05,
          cu_t: 1.07,
          rc: "Rc 1/2",
          pitch: 1.814,
          tpi: 14,
          eff_d: 19.793,
          tap_d: 19.1,
          ref_d: 20.955,
        },
        20: {
          inch: '3/4"',
          sgp_od: 27.2,
          sgp_t: 2.8,
          sus_od: 27.2,
          sus_t: 1.6,
          cu_od: 22.22,
          cu_t: 1.14,
          rc: "Rc 3/4",
          pitch: 1.814,
          tpi: 14,
          eff_d: 25.279,
          tap_d: 24.6,
          ref_d: 26.441,
        },
        25: {
          inch: '1"',
          sgp_od: 34.0,
          sgp_t: 3.2,
          sus_od: 34.0,
          sus_t: 1.6,
          cu_od: 28.58,
          cu_t: 1.27,
          rc: "Rc 1",
          pitch: 2.309,
          tpi: 11,
          eff_d: 31.77,
          tap_d: 30.9,
          ref_d: 33.249,
        },
        32: {
          inch: '1-1/4"',
          sgp_od: 42.7,
          sgp_t: 3.5,
          sus_od: 42.7,
          sus_t: 1.6,
          cu_od: 34.93,
          cu_t: 1.4,
          rc: "Rc 1-1/4",
          pitch: 2.309,
          tpi: 11,
          eff_d: 41.91,
          tap_d: 41.1,
          ref_d: 41.91,
        },
        40: {
          inch: '1-1/2"',
          sgp_od: 48.6,
          sgp_t: 3.5,
          sus_od: 48.6,
          sus_t: 1.6,
          cu_od: 41.28,
          cu_t: 1.52,
          rc: "Rc 1-1/2",
          pitch: 2.309,
          tpi: 11,
          eff_d: 47.803,
          tap_d: 46.9,
          ref_d: 47.803,
        },
        50: {
          inch: '2"',
          sgp_od: 60.5,
          sgp_t: 3.8,
          sus_od: 60.5,
          sus_t: 2.0,
          cu_od: 53.98,
          cu_t: 1.78,
          rc: "Rc 2",
          pitch: 2.309,
          tpi: 11,
          eff_d: 59.614,
          tap_d: 58.7,
          ref_d: 59.614,
        },
        65: {
          inch: '2-1/2"',
          sgp_od: 76.3,
          sgp_t: 4.2,
          sus_od: 76.3,
          sus_t: 2.0,
          cu_od: 66.68,
          cu_t: 2.03,
          rc: "Rc 2-1/2",
          pitch: 2.309,
          tpi: 11,
          eff_d: 75.184,
          tap_d: 74.2,
          ref_d: 75.184,
        },
        80: {
          inch: '3"',
          sgp_od: 89.1,
          sgp_t: 4.2,
          sus_od: 89.1,
          sus_t: 2.0,
          cu_od: 79.38,
          cu_t: 2.29,
          rc: "Rc 3",
          pitch: 2.309,
          tpi: 11,
          eff_d: 87.884,
          tap_d: 86.9,
          ref_d: 87.884,
        },
        100: {
          inch: '4"',
          sgp_od: 114.3,
          sgp_t: 4.5,
          sus_od: 114.3,
          sus_t: 2.0,
          cu_od: 104.78,
          cu_t: 2.79,
          rc: "Rc 4",
          pitch: 2.309,
          tpi: 11,
          eff_d: 113.03,
          tap_d: 112.0,
          ref_d: 113.03,
        },
        125: {
          inch: '5"',
          sgp_od: 139.8,
          sgp_t: 4.5,
          sus_od: 139.8,
          sus_t: 2.0,
          cu_od: 130.18,
          cu_t: 3.05,
          rc: "Rc 5",
          pitch: 2.309,
          tpi: 11,
          eff_d: 138.435,
          tap_d: 137.4,
          ref_d: 138.435,
        },
        150: {
          inch: '6"',
          sgp_od: 165.2,
          sgp_t: 5.0,
          sus_od: 165.2,
          sus_t: 2.0,
          cu_od: 155.58,
          cu_t: 3.4,
          rc: "Rc 6",
          pitch: 2.309,
          tpi: 11,
          eff_d: 163.83,
          tap_d: 162.8,
          ref_d: 163.83,
        },
        200: {
          inch: '8"',
          sgp_od: 216.3,
          sgp_t: 5.8,
          sus_od: 216.3,
          sus_t: 2.0,
          cu_od: null,
          cu_t: null,
          rc: null,
          pitch: null,
          tpi: null,
          eff_d: null,
          tap_d: null,
          ref_d: null,
        },
        250: {
          inch: '10"',
          sgp_od: 267.4,
          sgp_t: 6.0,
          sus_od: 267.4,
          sus_t: 2.0,
          cu_od: null,
          cu_t: null,
          rc: null,
          pitch: null,
          tpi: null,
          eff_d: null,
          tap_d: null,
          ref_d: null,
        },
      };

      function calcPipe() {
        const ptype = $("pipe-type").value;
        const size = +$("pipe-size").value;
        const d = PIPE_DB[size];
        if (!d) return;

        // 種別ごとのOD/肉厚
        let od, t, typeLabel;
        if (ptype === "sgp") {
          od = d.sgp_od;
          t = d.sgp_t;
          typeLabel = "SGP（JIS G 3452）";
        } else if (ptype === "sus") {
          od = d.sus_od;
          t = d.sus_t;
          typeLabel = "SUS（JIS G 3459）";
        } else {
          od = d.cu_od;
          t = d.cu_t;
          typeLabel = "銅管（JIS H 3300 K）";
        }

        const id = od - 2 * t;

        // メインカード
        $("pipe-a").innerHTML =
          `${size}<span class="card-unit"> A</span>`;
        $("pipe-inch").innerHTML = d.inch;
        $("pipe-od").innerHTML =
          `${od.toFixed(1)}<span class="card-unit"> mm</span>`;

        // 配管詳細テーブル
        const rows = [
          ["配管種別", typeLabel, "JIS 規格"],
          ["呼び径（A）", `${size} A`, ""],
          ["インチ呼び", d.inch, "参考"],
          ["外径 OD", `${od.toFixed(1)} mm`, "JIS 規格値"],
          [
            "肉厚 t",
            `${t.toFixed(1)} mm`,
            ptype === "sgp"
              ? "標準肉厚"
              : ptype === "sus"
                ? "Sch5S相当"
                : "K タイプ",
          ],
          [
            "内径 ID（参考）",
            `${id.toFixed(1)} mm`,
            "= OD − 2t",
          ],
          [
            "断面積（流路）",
            `${((Math.PI / 4) * id * id).toFixed(0)} mm²`,
            "内径から計算",
          ],
        ];
        $("pipe-tbody").innerHTML = rows
          .map(
            (r) =>
              `<tr><td>${r[0]}</td><td class="hl">${r[1]}</td><td style="color:var(--muted);font-family:'Noto Sans JP',sans-serif">${r[2]}</td></tr>`,
          )
          .join("");

        // 管用テーパネジ詳細
        const thread_rows = [
          ["ネジ呼び", d.rc, "JIS B 0203"],
          ["ピッチ", `${d.pitch.toFixed(3)} mm`, ""],
          ["山数 / 25.4mm（TPI）", `${d.tpi} 山`, ""],
          [
            "有効径（基準径）",
            `${d.eff_d.toFixed(3)} mm`,
            "管端基準面",
          ],
          ["テーパ", "1/16（1:16）", "= 3.576°"],
          [
            "Rc タップ下穴径（目安）",
            `${d.tap_d.toFixed(1)} mm`,
            "鋳鉄・鋼",
          ],
          [
            "R 雄ねじ 基準径",
            `${d.ref_d.toFixed(3)} mm`,
            "参考",
          ],
          [
            "シール方法",
            "シールテープ / ペースト",
            "Rc/R の場合",
          ],
        ];
        $("pipe-thread-tbody").innerHTML = thread_rows
          .map(
            (r) =>
              `<tr><td>${r[0]}</td><td class="hl">${r[1]}</td><td style="color:var(--muted);font-family:'Noto Sans JP',sans-serif">${r[2]}</td></tr>`,
          )
          .join("");
      }
