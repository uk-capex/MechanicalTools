      // ════════════════════════════════════════════════════
      //  TAB: 油脂類
      // ════════════════════════════════════════════════════
      const OIL_HYD = [
        [
          "VG 10",
          "9〜11",
          "高速・低圧油圧",
          "精密油圧機器、高速油圧ポンプ、薄膜潤滑部",
          "低温始動性良好。漏れに注意",
        ],
        [
          "VG 15",
          "13.5〜16.5",
          "低圧・高速油圧",
          "一部の低圧工作機械油圧、一般工業用小型装置",
          "極低温環境向け",
        ],
        [
          "VG 22",
          "19.8〜24.2",
          "汎用低圧油圧",
          "小型油圧ユニット、一般機械油圧（低圧系）",
          "低温流動性が必要な場合",
        ],
        [
          "VG 32",
          "28.8〜35.2",
          "汎用中圧油圧",
          "一般産業用油圧ユニット、工作機械油圧、NC装置",
          "最も汎用的なグレード。迷ったらVG32or46",
        ],
        [
          "VG 46",
          "41.4〜50.6",
          "汎用中〜高圧油圧",
          "産業用油圧ユニット、プレス機、成形機、射出成型機",
          "国内工場で最多使用グレード",
        ],
        [
          "VG 68",
          "61.2〜74.8",
          "高圧・中速油圧",
          "高圧油圧システム、重負荷プレス、建設機械油圧",
          "夏季高温環境に適する",
        ],
        [
          "VG 100",
          "90〜110",
          "高圧・低速油圧",
          "重作業用油圧クレーン、高負荷・低速シリンダ",
          "高温・高負荷環境向け",
        ],
        [
          "VG 150",
          "135〜165",
          "超高圧・極低速",
          "特殊高圧プレス、鍛造機械",
          "一般用途には粘度過多",
        ],
      ];

      const OIL_LUB = [
        [
          "ギヤ油 VG 68",
          "61〜75",
          "ウォームギア・平歯車の潤滑",
          "低速・高負荷の閉形歯車装置、一般ギアボックス",
          "EP添加剤入りタイプ推奨",
        ],
        [
          "ギヤ油 VG 100",
          "90〜110",
          "閉形歯車・スピンドル歯車",
          "インライン・ヘリカルギア、標準閉鎖型歯車箱",
          "汎用ギアオイルの標準",
        ],
        [
          "ギヤ油 VG 150",
          "135〜165",
          "中速・高荷重歯車",
          "傘歯車、ハイポイドギア（一般）",
          "極圧性が必要な場合はEPグレード",
        ],
        [
          "ギヤ油 VG 220",
          "198〜242",
          "低速・高荷重歯車",
          "低速大型ギアボックス、ウォームギア（高比率）",
          "最も汎用性の高いギア油グレード",
        ],
        [
          "ギヤ油 VG 320",
          "288〜352",
          "超低速・重負荷歯車",
          "製鉄・製紙の低速大型減速機",
          "高温環境での粘度安定性が必要",
        ],
        [
          "ギヤ油 VG 460",
          "414〜506",
          "極低速・超重負荷",
          "露天クレーン減速機、製鉄所圧延設備",
          "低温流動性に注意",
        ],
        [
          "コンプレッサ油 VG 32",
          "29〜35",
          "回転式コンプレッサ",
          "スクリュー・ベーンコンプレッサ",
          "専用品推奨。エアー混合で劣化しやすい",
        ],
        [
          "コンプレッサ油 VG 46",
          "41〜51",
          "往復式・汎用コンプレッサ",
          "レシプロコンプレッサ（低圧〜中圧段）",
          "酸化安定性重要",
        ],
        [
          "コンプレッサ油 VG 68",
          "61〜75",
          "高圧往復式コンプレッサ",
          "高圧多段レシプロコンプレッサ",
          "供給量制御が必要",
        ],
        [
          "タービン油 VG 32",
          "29〜35",
          "ガスタービン・蒸気タービン",
          "高速回転機器、大型タービン軸受",
          "高酸化安定性・水分離性が必要",
        ],
        [
          "タービン油 VG 46",
          "41〜51",
          "中型タービン・水力発電",
          "水車軸受、中型蒸気タービン",
          "防錆性・消泡性重視",
        ],
        [
          "スピンドル油 VG 2",
          "1.8〜2.2",
          "超高速精密軸受",
          "高速グラインダースピンドル（20,000rpm超）",
          "オイルミスト潤滑用",
        ],
        [
          "スピンドル油 VG 5",
          "4.5〜5.5",
          "高速精密軸受",
          "精密研削盤スピンドル（10,000〜20,000rpm）",
          "ミスト・循環供給両用",
        ],
        [
          "スピンドル油 VG 10",
          "9〜11",
          "精密工作機械軸受",
          "旋盤・MC主軸（〜10,000rpm）",
          "低発熱・高精度維持",
        ],
        [
          "チェーン油 VG 68",
          "61〜75",
          "コンベヤチェーン（常温）",
          "食品・一般搬送コンベヤチェーン",
          "食品用は白色鉱物油を使用",
        ],
        [
          "チェーン油 VG 100",
          "90〜110",
          "コンベヤチェーン（高温）",
          "高温オーブン・焼付炉内コンベヤ（〜150℃）",
          "150℃超はシンセティック系推奨",
        ],
        [
          "冷凍機油 VG 32",
          "29〜35",
          "冷凍・冷蔵コンプレッサ",
          "アンモニア・フロン冷媒コンプレッサ",
          "冷媒との相溶性確認が必須",
        ],
        [
          "冷凍機油 VG 46",
          "41〜51",
          "空調・大型冷凍機",
          "大型チラー、産業用冷凍設備",
          "HFC対応はエステル系",
        ],
      ];

      const OIL_GREASE = [
        [
          "000（半流動）",
          "68〜220",
          "金属石けん系",
          "ギアボックス内部の充填潤滑",
          "密閉ギアボックス、ウォームギア",
          "オイルとグリスの中間。流動性高い",
        ],
        [
          "00（半流動）",
          "68〜220",
          "金属石けん系",
          "ギアボックス充填・セントラル供給",
          "自動給脂装置（集中潤滑）",
          "ポンプ圧送が容易",
        ],
        [
          "0（軟質）",
          "46〜150",
          "リチウム系",
          "低速・重負荷すべり軸受",
          "鉄鋼・製紙設備の低速軸受",
          "チャージ量多め可",
        ],
        [
          "1（軟質）",
          "46〜150",
          "リチウム系",
          "一般機械軸受・汎用グリス",
          "低速〜中速転がり軸受、スライド部",
          "汎用性高い。手動給脂に適す",
        ],
        [
          "2（標準・最汎用）",
          "46〜220",
          "リチウム系",
          "汎用転がり軸受・スライド部",
          "電動機軸受、コンベヤ軸受、ロッド端",
          "最も広く使用されるちょう度",
        ],
        [
          "2（高温用）",
          "100〜460",
          "リチウムコンプレックス",
          "高温転がり軸受",
          "炉内コンベヤ軸受、熱処理炉周辺（〜200℃）",
          "Li複合石けんで耐熱性向上",
        ],
        [
          "2（食品用）",
          "46〜220",
          "アルミ系/合成",
          "食品機械の軸受・スライド",
          "食品・製薬工場の接触可能箇所",
          "NSF H1認定品を使用。白色外観",
        ],
        [
          "2（極圧用）",
          "68〜460",
          "リチウム系+EP",
          "重負荷・衝撃荷重環境",
          "クレーン・建設機械ピン・ブッシュ",
          "MoS2（モリブデン）入りも有",
        ],
        [
          "3（硬質）",
          "100〜460",
          "リチウム系",
          "高速軽荷重軸受・水平面",
          "電動工具軸受、精密機器",
          "漏れにくい。高速に有利",
        ],
        [
          "3（防水用）",
          "100〜460",
          "リチウム系/ウレア",
          "水洗い・水没環境の軸受",
          "食品機械洗浄ライン、船舶補機軸受",
          "耐水洗性。Ca系も選択肢",
        ],
        [
          "4〜6（固形）",
          "150〜460",
          "各種",
          "カップグリス・特殊用途",
          "鉄道車軸、特殊工業機器",
          "現在は限定的使用",
        ],
      ];

      const OIL_THICKENER = [
        [
          "リチウム（Li）",
          "〜130℃",
          "良好",
          "普通",
          "汎用性最高。最も広く使用。コスト低い",
        ],
        [
          "リチウムコンプレックス（Li-X）",
          "〜200℃",
          "良好",
          "良好",
          "高温・高荷重対応。多目的グリスに最適",
        ],
        [
          "カルシウム（Ca）",
          "〜80℃",
          "優れる",
          "普通",
          "旧来型。耐水・防錆に優れるが低耐熱",
        ],
        [
          "カルシウムコンプレックス（Ca-X）",
          "〜200℃",
          "優れる",
          "良好",
          "高耐熱と耐水を両立。食品機械向けも",
        ],
        [
          "ウレア（ポリウレア）",
          "〜180℃",
          "良好",
          "良好",
          "電動機軸受に最適。長寿命・耐熱・高速向き",
        ],
        [
          "ナトリウム（Na）",
          "〜140℃",
          "不良",
          "普通",
          "旧来型。耐水性低い。代替品推奨",
        ],
        [
          "ベントナイト",
          "〜250℃",
          "良好",
          "普通",
          "石けん不使用。超高温専用（炉内等）",
        ],
        [
          "PTFE（テフロン）",
          "〜260℃",
          "優れる",
          "普通",
          "化学耐性・耐薬品性が必要な特殊用途",
        ],
        [
          "二硫化モリブデン（MoS2）",
          "—",
          "—",
          "優れる",
          "固体潤滑剤添加。極圧・衝撃荷重環境",
        ],
      ];

      const BRAND_HYD = [
        [
          "VG 10",
          "Shell Tellus S2 V 10",
          "Mobil DTE 10 Excel 10",
          "出光ダフニー スーパーハイドローリック 10",
          "ENEOS ハイドロ 10",
          "Castrol Hyspin AWH-M 10",
        ],
        [
          "VG 22",
          "Shell Tellus S2 V 22",
          "Mobil DTE 10 Excel 22",
          "出光ダフニー スーパーハイドローリック 22",
          "ENEOS ハイドロ 22",
          "Castrol Hyspin AWH-M 22",
        ],
        [
          "VG 32",
          "Shell Tellus S2 V 32",
          "Mobil DTE 10 Excel 32",
          "出光ダフニー スーパーハイドローリック 32",
          "ENEOS ハイドロ 32",
          "Castrol Hyspin AWS 32",
        ],
        [
          "VG 46",
          "Shell Tellus S2 V 46",
          "Mobil DTE 10 Excel 46",
          "出光ダフニー スーパーハイドローリック 46",
          "ENEOS ハイドロ 46",
          "Castrol Hyspin AWS 46",
        ],
        [
          "VG 68",
          "Shell Tellus S2 V 68",
          "Mobil DTE 10 Excel 68",
          "出光ダフニー スーパーハイドローリック 68",
          "ENEOS ハイドロ 68",
          "Castrol Hyspin AWS 68",
        ],
        [
          "VG 100",
          "Shell Tellus S2 V 100",
          "Mobil DTE 10 Excel 100",
          "出光ダフニー スーパーハイドローリック 100",
          "ENEOS ハイドロ 100",
          "Castrol Hyspin AWS 100",
        ],
      ];

      const BRAND_GEAR = [
        [
          "VG 68（EP）",
          "Shell Omala S2 G 68",
          "Mobil Gear 600 XP 68",
          "出光ダフニー マルチギア 68",
          "ENEOS ギヤオイル EP 68",
          "Castrol Alpha SP 68",
        ],
        [
          "VG 100（EP）",
          "Shell Omala S2 G 100",
          "Mobil Gear 600 XP 100",
          "出光ダフニー マルチギア 100",
          "ENEOS ギヤオイル EP 100",
          "Castrol Alpha SP 100",
        ],
        [
          "VG 150（EP）",
          "Shell Omala S2 G 150",
          "Mobil Gear 600 XP 150",
          "出光ダフニー マルチギア 150",
          "ENEOS ギヤオイル EP 150",
          "Castrol Alpha SP 150",
        ],
        [
          "VG 220（EP）",
          "Shell Omala S2 G 220",
          "Mobil Gear 600 XP 220",
          "出光ダフニー マルチギア 220",
          "ENEOS ギヤオイル EP 220",
          "Castrol Alpha SP 220",
        ],
        [
          "VG 320（EP）",
          "Shell Omala S2 G 320",
          "Mobil Gear 600 XP 320",
          "出光ダフニー マルチギア 320",
          "ENEOS ギヤオイル EP 320",
          "Castrol Alpha SP 320",
        ],
        [
          "VG 460（EP）",
          "Shell Omala S2 G 460",
          "Mobil Gear 600 XP 460",
          "出光ダフニー マルチギア 460",
          "ENEOS ギヤオイル EP 460",
          "Castrol Alpha SP 460",
        ],
        [
          "VG 68（合成）",
          "Shell Omala S4 GX 68",
          "Mobil SHC Gear 68",
          "出光ダフニー スーパーマルチギア 68",
          "ENEOS スーパーギヤ 68",
          "—",
        ],
        [
          "VG 220（合成）",
          "Shell Omala S4 GX 220",
          "Mobil SHC Gear 220",
          "出光ダフニー スーパーマルチギア 220",
          "ENEOS スーパーギヤ 220",
          "—",
        ],
        [
          "VG 320（合成）",
          "Shell Omala S4 GX 320",
          "Mobil SHC Gear 320",
          "出光ダフニー スーパーマルチギア 320",
          "ENEOS スーパーギヤ 320",
          "—",
        ],
      ];

      const BRAND_TURB = [
        [
          "VG 32",
          "Shell Turbo T 32",
          "Mobil DTE 732",
          "出光タービン 32",
          "ENEOS タービン 32",
          "Castrol Turbinol X-32",
        ],
        [
          "VG 46",
          "Shell Turbo T 46",
          "Mobil DTE 746",
          "出光タービン 46",
          "ENEOS タービン 46",
          "Castrol Turbinol X-46",
        ],
        [
          "VG 68",
          "Shell Turbo T 68",
          "Mobil DTE 768",
          "出光タービン 68",
          "ENEOS タービン 68",
          "—",
        ],
        [
          "VG 32（合成）",
          "Shell Turbo S4 X 32",
          "Mobil SHC Turbine 32",
          "出光ダフニー スーパータービン 32",
          "ENEOS スーパータービン 32",
          "—",
        ],
        [
          "VG 46（合成）",
          "Shell Turbo S4 X 46",
          "Mobil SHC Turbine 46",
          "出光ダフニー スーパータービン 46",
          "ENEOS スーパータービン 46",
          "—",
        ],
      ];

      const BRAND_GREASE = [
        [
          "汎用 #2（Li）",
          "Shell Gadus S2 V100 2",
          "Mobilux EP 2",
          "出光ダフニー グリース SRL #2",
          "ENEOS リチウムグリース #2",
          "THK AFB-LF",
        ],
        [
          "汎用 #3（Li）",
          "Shell Gadus S2 V100 3",
          "Mobilux EP 3",
          "出光ダフニー グリース SRL #3",
          "ENEOS リチウムグリース #3",
          "—",
        ],
        [
          "高温 #2（Li-X）",
          "Shell Gadus S3 V220C 2",
          "Mobilith SHC 220",
          "出光ダフニー コンプレックスグリース",
          "ENEOS コンプレックス #2",
          "THK AFE-CA",
        ],
        [
          "極圧 #2（Li+EP）",
          "Shell Gadus S2 V220AC 2",
          "Mobilux EP 2",
          "出光ダフニー EPグリース",
          "ENEOS EPグリース #2",
          "—",
        ],
        [
          "ウレア #2",
          "Shell Gadus S5 T100 2",
          "Mobilith SHC 100",
          "出光ダフニー ウレアグリース",
          "ENEOS ユニウレア #2",
          "THK Lucina A",
        ],
        [
          "食品用 #2（NSF H1）",
          "Shell Gadus S2 FG 2",
          "Mobilgrease FM 102",
          "出光ダフニー フードグリース",
          "ENEOS フードグリース #2",
          "—",
        ],
        [
          "直動ガイド用",
          "Shell Gadus S2 V100 2",
          "Mobil Vactra Oil No.2",
          "出光ダフニー ウェイオイル 68",
          "ENEOS スライドウェイ 68",
          "THK AFE",
        ],
        [
          "半流動（#00）",
          "Shell Gadus S2 OG 00",
          "Mobilgear OGL 007",
          "出光ダフニー マルチギアグリース",
          "ENEOS セミフルード 00",
          "—",
        ],
      ];

      let oilCurrentTab = "hyd";
      let brandCurrentTab = "hyd";

      function switchOilTab(tab, el) {
        oilCurrentTab = tab;
        document
          .querySelectorAll('[id^="oil-tab-"]')
          .forEach((e) => e.classList.remove("active"));
        el.classList.add("active");
        ["hyd", "lub", "grease", "brand"].forEach((t) => {
          const div = document.getElementById(
            "oil-table-" + t,
          );
          if (div)
            div.style.display = t === tab ? "" : "none";
        });
      }

      function switchBrandTab(tab, el) {
        brandCurrentTab = tab;
        document
          .querySelectorAll('[id^="brand-tab-"]')
          .forEach((e) => e.classList.remove("active"));
        el.classList.add("active");
        ["hyd", "gear", "turb", "grease"].forEach((t) => {
          const div = document.getElementById(
            "brand-table-" + t,
          );
          if (div)
            div.style.display = t === tab ? "" : "none";
        });
      }

      function initOil() {
        renderOilTable("oil-tbody-hyd", OIL_HYD);
        renderOilTable("oil-tbody-lub", OIL_LUB);
        renderGreaseTable();
        renderThickenerTable();
        renderBrandTable(
          "oil-tbody-brand-hyd",
          BRAND_HYD,
          false,
        );
        renderBrandTable(
          "oil-tbody-brand-gear",
          BRAND_GEAR,
          false,
        );
        renderBrandTable(
          "oil-tbody-brand-turb",
          BRAND_TURB,
          false,
        );
        renderBrandTable(
          "oil-tbody-brand-grease",
          BRAND_GREASE,
          true,
        );
      }

      function renderOilTable(tbodyId, data) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.innerHTML = data
          .map(
            (r) =>
              '<tr><td style="font-family:JetBrains Mono,monospace;color:var(--accent);font-weight:600">' +
              r[0] +
              "</td><td>" +
              r[1] +
              "</td><td>" +
              r[2] +
              '</td><td style="color:var(--muted);font-size:12px">' +
              r[3] +
              '</td><td style="color:var(--muted);font-size:11px">' +
              r[4] +
              "</td></tr>",
          )
          .join("");
      }

      function renderGreaseTable() {
        const tbody = document.getElementById(
          "oil-tbody-grease",
        );
        if (!tbody) return;
        tbody.innerHTML = OIL_GREASE.map(
          (r) =>
            '<tr><td style="font-family:JetBrains Mono,monospace;color:var(--warn);font-weight:600">' +
            r[0] +
            "</td><td>" +
            r[1] +
            '</td><td style="color:var(--muted);font-size:12px">' +
            r[2] +
            "</td><td>" +
            r[3] +
            '</td><td style="color:var(--muted);font-size:12px">' +
            r[4] +
            '</td><td style="color:var(--muted);font-size:11px">' +
            r[5] +
            "</td></tr>",
        ).join("");
      }

      function renderThickenerTable() {
        const tbody = document.getElementById(
          "oil-tbody-thickener",
        );
        if (!tbody) return;
        const colors = {
          優れる: "var(--good)",
          良好: "var(--accent)",
          普通: "var(--muted)",
          不良: "var(--bad)",
        };
        tbody.innerHTML = OIL_THICKENER.map((r) => {
          const c1 = colors[r[2]] || "var(--muted)";
          const c2 = colors[r[3]] || "var(--muted)";
          return (
            '<tr><td style="font-weight:600;color:var(--ink)">' +
            r[0] +
            '</td><td style="font-family:JetBrains Mono,monospace;color:var(--warn)">' +
            r[1] +
            '</td><td style="color:' +
            c1 +
            ';font-weight:600">' +
            r[2] +
            '</td><td style="color:' +
            c2 +
            ';font-weight:600">' +
            r[3] +
            '</td><td style="color:var(--muted);font-size:12px">' +
            r[4] +
            "</td></tr>"
          );
        }).join("");
      }

      function renderBrandTable(tbodyId, data, isGrease) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.innerHTML = data
          .map((r) => {
            const cells = r
              .slice(1)
              .map(
                (v) =>
                  '<td style="font-size:11px;color:' +
                  (v === "—"
                    ? "var(--muted)"
                    : "var(--ink)") +
                  '">' +
                  v +
                  "</td>",
              )
              .join("");
            return (
              '<tr><td style="font-family:JetBrains Mono,monospace;font-weight:700;color:' +
              (isGrease ? "var(--warn)" : "var(--accent)") +
              ';white-space:nowrap">' +
              r[0] +
              "</td>" +
              cells +
              "</tr>"
            );
          })
          .join("");
      }

      // ════════════════════════════════════════════════════════
      // 🔧 ポンプタブ JS
      // ════════════════════════════════════════════════════════

      function showPumpTab(name, btn) {
        document
          .querySelectorAll("#tab-pump .stab-content")
          .forEach((e) => e.classList.remove("active"));
        document
          .querySelectorAll("#tab-pump .stab-btn")
          .forEach((e) => e.classList.remove("active"));
        const el = $("stab-" + name);
        if (el) el.classList.add("active");
        if (btn) btn.classList.add("active");
      }
