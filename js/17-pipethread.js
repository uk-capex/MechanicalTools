      // ════════════════════════════════════════
      // TAB: 管用ネジ
      // ════════════════════════════════════════
      // SGP外径: JIS G 3452, 肉厚: スケジュール標準
      // SUS: JIS G 3459 Sch10S の肉厚に修正 2026-09（旧値は規格外の値）
      // 銅管: JIS H 3300 配管用銅管の寸法（K/L/M）に修正 2026-09（KMCT 建築用銅管標準寸法で照合）
      //   旧値は Lタイプ肉厚で、6A〜15A が1サイズずれ（15A に 5/8=19.05 を割当て等）→内径過大
      //   6A と 200A 以上は JIS H 3300 に該当なし。Kタイプは 50A まで、Mタイプは 10A から
      // 管用テーパネジ: JIS B 0203
      // [呼びA, インチ呼び, SGP外径, SGP肉厚, SUS外径, SUS肉厚, 銅外径, 銅肉厚,
      //  Rcネジ呼び, ピッチ, ヤマ数/25.4, 有効径, タップ下穴径, テーパ基準径]
      const PIPE_DB = {
        6: {
          inch: '1/8"',
          sgp_od: 10.5,
          sgp_t: 2.0,
          sus_od: 10.5,
          sus_t: 1.2,
          cu_od: null,
          cu_t: null,
          rc: "Rc 1/8",
          pitch: 0.9071,
          tpi: 28,
          eff_d: 9.147,
          ref_d: 9.728,
          d1: 8.566,
        },
        8: {
          inch: '1/4"',
          sgp_od: 13.8,
          sgp_t: 2.3,
          sus_od: 13.8,
          sus_t: 1.65,
          cu_od: 9.52,
          cu_t: { K: 0.89, L: 0.76, M: null },
          rc: "Rc 1/4",
          pitch: 1.3368,
          tpi: 19,
          eff_d: 12.301,
          ref_d: 13.157,
          d1: 11.445,
        },
        10: {
          inch: '3/8"',
          sgp_od: 17.3,
          sgp_t: 2.3,
          sus_od: 17.3,
          sus_t: 1.65,
          cu_od: 12.70,
          cu_t: { K: 1.24, L: 0.89, M: 0.64 },
          rc: "Rc 3/8",
          pitch: 1.3368,
          tpi: 19,
          eff_d: 15.806,
          ref_d: 16.662,
          d1: 14.95,
        },
        15: {
          inch: '1/2"',
          sgp_od: 21.7,
          sgp_t: 2.8,
          sus_od: 21.7,
          sus_t: 2.1,
          cu_od: 15.88,
          cu_t: { K: 1.24, L: 1.02, M: 0.71 },
          rc: "Rc 1/2",
          pitch: 1.8143,
          tpi: 14,
          eff_d: 19.793,
          ref_d: 20.955,
          d1: 18.631,
        },
        20: {
          inch: '3/4"',
          sgp_od: 27.2,
          sgp_t: 2.8,
          sus_od: 27.2,
          sus_t: 2.1,
          cu_od: 22.22,
          cu_t: { K: 1.65, L: 1.14, M: 0.81 },
          rc: "Rc 3/4",
          pitch: 1.8143,
          tpi: 14,
          eff_d: 25.279,
          ref_d: 26.441,
          d1: 24.117,
        },
        25: {
          inch: '1"',
          sgp_od: 34.0,
          sgp_t: 3.2,
          sus_od: 34.0,
          sus_t: 2.8,
          cu_od: 28.58,
          cu_t: { K: 1.65, L: 1.27, M: 0.89 },
          rc: "Rc 1",
          pitch: 2.3091,
          tpi: 11,
          eff_d: 31.77,
          ref_d: 33.249,
          d1: 30.291,
        },
        32: {
          inch: '1-1/4"',
          sgp_od: 42.7,
          sgp_t: 3.5,
          sus_od: 42.7,
          sus_t: 2.8,
          cu_od: 34.92,
          cu_t: { K: 1.65, L: 1.40, M: 1.07 },
          rc: "Rc 1-1/4",
          pitch: 2.3091,
          tpi: 11,
          eff_d: 40.431,
          ref_d: 41.91,
          d1: 38.952,
        },
        40: {
          inch: '1-1/2"',
          sgp_od: 48.6,
          sgp_t: 3.5,
          sus_od: 48.6,
          sus_t: 2.8,
          cu_od: 41.28,
          cu_t: { K: 1.83, L: 1.52, M: 1.24 },
          rc: "Rc 1-1/2",
          pitch: 2.3091,
          tpi: 11,
          eff_d: 46.324,
          ref_d: 47.803,
          d1: 44.845,
        },
        50: {
          inch: '2"',
          sgp_od: 60.5,
          sgp_t: 3.8,
          sus_od: 60.5,
          sus_t: 2.8,
          cu_od: 53.98,
          cu_t: { K: 2.11, L: 1.78, M: 1.47 },
          rc: "Rc 2",
          pitch: 2.3091,
          tpi: 11,
          eff_d: 58.135,
          ref_d: 59.614,
          d1: 56.656,
        },
        65: {
          inch: '2-1/2"',
          sgp_od: 76.3,
          sgp_t: 4.2,
          sus_od: 76.3,
          sus_t: 3.0,
          cu_od: 66.68,
          cu_t: { K: null, L: 2.03, M: 1.65 },
          rc: "Rc 2-1/2",
          pitch: 2.3091,
          tpi: 11,
          eff_d: 73.705,
          ref_d: 75.184,
          d1: 72.226,
        },
        80: {
          inch: '3"',
          sgp_od: 89.1,
          sgp_t: 4.2,
          sus_od: 89.1,
          sus_t: 3.0,
          cu_od: 79.38,
          cu_t: { K: null, L: 2.29, M: 1.83 },
          rc: "Rc 3",
          pitch: 2.3091,
          tpi: 11,
          eff_d: 86.405,
          ref_d: 87.884,
          d1: 84.926,
        },
        100: {
          inch: '4"',
          sgp_od: 114.3,
          sgp_t: 4.5,
          sus_od: 114.3,
          sus_t: 3.0,
          cu_od: 104.78,
          cu_t: { K: null, L: 2.79, M: 2.41 },
          rc: "Rc 4",
          pitch: 2.3091,
          tpi: 11,
          eff_d: 111.551,
          ref_d: 113.03,
          d1: 110.072,
        },
        125: {
          inch: '5"',
          sgp_od: 139.8,
          sgp_t: 4.5,
          sus_od: 139.8,
          sus_t: 3.4,
          cu_od: 130.18,
          cu_t: { K: null, L: 3.18, M: 2.77 },
          rc: "Rc 5",
          pitch: 2.3091,
          tpi: 11,
          eff_d: 136.951,
          ref_d: 138.43,
          d1: 135.472,
        },
        150: {
          inch: '6"',
          sgp_od: 165.2,
          sgp_t: 5.0,
          sus_od: 165.2,
          sus_t: 3.4,
          cu_od: 155.58,
          cu_t: { K: null, L: 3.56, M: 3.10 },
          rc: "Rc 6",
          pitch: 2.3091,
          tpi: 11,
          eff_d: 162.351,
          ref_d: 163.83,
          d1: 160.872,
        },
        200: {
          inch: '8"',
          sgp_od: 216.3,
          sgp_t: 5.8,
          sus_od: 216.3,
          sus_t: 4.0,
          cu_od: null,
          cu_t: null,
          rc: null,
          pitch: null,
          tpi: null,
          eff_d: null,
          ref_d: null,
        },
        250: {
          inch: '10"',
          sgp_od: 267.4,
          sgp_t: 6.6,
          sus_od: 267.4,
          sus_t: 4.0,
          cu_od: null,
          cu_t: null,
          rc: null,
          pitch: null,
          tpi: null,
          eff_d: null,
          ref_d: null,
        },
      };

      // 管用ねじ 下穴（参考）  単位 mm
      //  str   : Rc ストレート下穴（リーマなし）… ヤマワ「困ったときの知恵袋 No.103」
      //  tpDr  : Rc テーパ下穴時の先行ドリル（テーパリーマ仕上げ）… 旭機工 ねじ下穴径表（リーマ使用）
      //  tpEnd : テーパ下穴の端面径（= JIS B 0203 谷の径 d1、管端での内径基準寸法）
      //  g     : G（管用平行）下穴 … 旭機工 ねじ下穴径表（G,PF）
      //  len   : 有効ねじ部の長さ（最小）[不完全ねじ部あり, なし] … ヤマワ No.103
      const PIPE_TAP = {
        6:  { str: 8.2,  tpDr: 8.1,  g: 8.7,  len: [6.2, 4.4] },
        8:  { str: 10.9, tpDr: 10.7, g: 11.7, len: [9.4, 6.7] },
        10: { str: 14.4, tpDr: 14.2, g: 15.2, len: [9.7, 7.0] },
        15: { str: 17.9, tpDr: 17.6, g: 19.0, len: [12.7, 9.1] },
        20: { str: 23.3, tpDr: 23.0, g: 24.5, len: [14.1, 10.2] },
        25: { str: 29.3, tpDr: 29.0, g: 30.6, len: [16.2, 11.6] },
        32: { str: 37.9, tpDr: 37.5, g: 39.2, len: [18.5, 13.4] },
        40: { str: 43.8, tpDr: 43.4, g: 45.0, len: [18.5, 13.4] },
        50: { str: 55.4, tpDr: 54.9, g: 57.0, len: [22.8, 16.9] },
        // 65・80：東大生研 試作工場「管用テーパねじ下穴」表（旭機工と同形式：リーマなし／リーマ使用）2026-09
        // 100〜150：同表に内径（有効ねじ部最小位置＝108.051 等）のみ記載でドリル径なし →
        //   65・80 と同じ決め方（その内径を 0.5mm 単位で切下げ＝リーマなし、さらに −0.5＝リーマ使用）で算出 ※計算値
        // len：JIS B 0203 表（テーパめねじ 不完全ねじ部あり l ／なし t）
        // g：G（JIS B 0202）めねじ内径 D1＋0.3（内径許容差 0〜+0.64 の中央付近）※計算値。大径は旋盤中ぐり前提
        65:  { str: 70.5,  tpDr: 70.0,  g: 72.5,  len: [26.7, 18.6] },
        80:  { str: 83.0,  tpDr: 82.5,  g: 85.2,  len: [29.8, 21.1] },
        100: { str: 108.0, tpDr: 107.5, g: 110.4, len: [35.8, 25.9], calc: true },
        125: { str: 133.0, tpDr: 132.5, g: 135.8, len: [40.1, 29.3], calc: true },
        150: { str: 158.5, tpDr: 158.0, g: 161.2, len: [40.1, 29.3], calc: true },
      };

      // 管種別の外径・肉厚（銅管は cu-K / cu-L / cu-M）。該当なしは null
      function pipeDims(sizeA, ptype) {
        const d = PIPE_DB[sizeA];
        if (!d) return null;
        if (ptype === "sgp")
          return { od: d.sgp_od, t: d.sgp_t, label: "SGP（JIS G 3452）" };
        if (ptype === "sus")
          return { od: d.sus_od, t: d.sus_t, label: "SUS（JIS G 3459 Sch10S）" };
        const ty = ptype.slice(3); // K / L / M
        if (!d.cu_od || !d.cu_t || d.cu_t[ty] == null) return null;
        return { od: d.cu_od, t: d.cu_t[ty], label: `銅管（JIS H 3300 ${ty}タイプ）` };
      }

      function calcPipe() {
        const ptype = $("pipe-type").value;
        const size = +$("pipe-size").value;
        const d = PIPE_DB[size];
        if (!d) return;

        // 種別ごとのOD/肉厚
        const dims = pipeDims(size, ptype);
        $("pipe-a").innerHTML =
          `${size}<span class="card-unit"> A</span>`;
        $("pipe-inch").innerHTML = d.inch;
        if (!dims) {
          $("pipe-od").innerHTML = "—";
          $("pipe-tbody").innerHTML =
            `<tr><td colspan="3" style="color:var(--muted)">この呼び径・タイプの銅管は JIS H 3300 にありません（Kタイプは50Aまで、Mタイプは10Aから、6A・200A以上は規格外）</td></tr>`;
        }
        const od = dims ? dims.od : null;
        const t = dims ? dims.t : null;
        const typeLabel = dims ? dims.label : "";
        const isCu = ptype.startsWith("cu-");
        const dg = isCu ? 2 : 1;
        const id = dims ? od - 2 * t : null;

        if (dims) {
        // メインカード
        $("pipe-od").innerHTML =
          `${od.toFixed(dg)}<span class="card-unit"> mm</span>`;

        // 配管詳細テーブル
        const rows = [
          ["配管種別", typeLabel, "JIS 規格"],
          ["呼び径（A）", `${size} A`, ""],
          ["インチ呼び", d.inch, "参考"],
          ["外径 OD", `${od.toFixed(dg)} mm`, "JIS 規格値"],
          [
            "肉厚 t",
            `${t.toFixed(dg)} mm`,
            ptype === "sgp"
              ? "標準肉厚"
              : ptype === "sus"
                ? "Sch10S"
                : `${ptype.slice(3)} タイプ`,
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
        }

        // 管用テーパネジ詳細
        let thread_rows;
        if (!d.rc) {
          thread_rows = [["ネジ呼び", "—", "この呼び径は管用ねじの規格外（溶接・フランジ接続）"]];
        } else {
          const tp = PIPE_TAP[size];
          const f1 = (v) => (v != null ? `${v.toFixed(1)} mm` : "—");
          thread_rows = [
            ["ネジ呼び", d.rc, "JIS B 0203"],
            ["ピッチ", `${d.pitch.toFixed(4)} mm`, `${d.tpi} 山 / 25.4mm`],
            ["外径（基準径の位置）", `${d.ref_d.toFixed(3)} mm`, "管端から基準の長さの位置"],
            ["有効径（基準径の位置）", `${d.eff_d.toFixed(3)} mm`, "JIS B 0203"],
            ["谷の径 d1（基準径の位置）", `${d.d1.toFixed(3)} mm`, "JIS B 0203"],
            ["テーパ", "1/16（1:16）", "全角 3°34′（片側 1°47′）"],
            ["Rc 下穴①ストレート", tp ? f1(tp.str) : "—", tp && tp.calc ? "計算値（65・80と同じ決め方）。実際は旋盤中ぐり" : "ドリルのみ（リーマなし）"],
            ["Rc 下穴②テーパ",
              tp ? `${tp.tpDr.toFixed(1)} mm → 端面 φ${d.d1.toFixed(3)}` : "メーカー表参照",
              "ドリル後、1/16テーパリーマで端面径まで仕上げ"],
            ["有効ねじ部の長さ（最小）",
              tp && tp.len ? `${tp.len[0]} mm（不完全ねじ部なし時 ${tp.len[1]} mm）` : "—", "JIS B 0203"],
            ["G（平行）下穴（参考）", tp && tp.g ? f1(tp.g) : "—", size >= 65 ? "Gねじの場合。内径 D1＋0.3 の計算値（旋盤中ぐり目安）" : "Gねじの場合。Rcとは別物"],
            ...(tp && tp.len && size >= 65 ? [[
              "旋盤中ぐり目安（Rc）",
              `φ${(d.d1 - (tp.len[0] - 3.46) / 16).toFixed(3)} 以下`,
              `有効ねじ部の最小位置（端面から ${(tp.len[0] - 3.46).toFixed(1)}mm）の内径。ストレートならこれ以下、テーパなら端面 φ${d.d1.toFixed(3)}→1/16で`,
            ]] : []),
            ["シール方法", "シールテープ / ペースト", "Rc/R の場合（Gはガスケット等）"],
          ];
        }
        $("pipe-thread-tbody").innerHTML = thread_rows
          .map(
            (r) =>
              `<tr><td>${r[0]}</td><td class="hl">${r[1]}</td><td style="color:var(--muted);font-family:'Noto Sans JP',sans-serif">${r[2]}</td></tr>`,
          )
          .join("");
      }
