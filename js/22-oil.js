      // ════════════════════════════════════════════════════
      //  TAB: 油脂類
      // ════════════════════════════════════════════════════
      // 粘度範囲は ISO 3448（中心値 ±10%、40℃ mm²/s）。用途・特徴は一般的な傾向（銘柄・機種指定を優先）
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
          "汎用グレード。迷ったら VG32 か 46（機械メーカー指定を優先）",
        ],
        [
          "VG 46",
          "41.4〜50.6",
          "汎用中〜高圧油圧",
          "産業用油圧ユニット、プレス機、成形機、射出成型機",
          "VG32 と並んで工場で最も多く使われるグレード",
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
          "61.2〜74.8",
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
          "28.8〜35.2",
          "回転式コンプレッサ",
          "スクリュー・ベーンコンプレッサ",
          "専用品推奨。エアー混合で劣化しやすい",
        ],
        [
          "コンプレッサ油 VG 46",
          "41.4〜50.6",
          "回転式・小型往復式コンプレッサ",
          "スクリュー（高温時）・小型レシプロ",
          "酸化安定性重要。往復式は VG68〜100 が多い（機種指定に従う）",
        ],
        [
          "コンプレッサ油 VG 68",
          "61.2〜74.8",
          "高圧往復式コンプレッサ",
          "高圧多段レシプロコンプレッサ",
          "供給量制御が必要",
        ],
        [
          "タービン油 VG 32",
          "28.8〜35.2",
          "ガスタービン・蒸気タービン",
          "高速回転機器、大型タービン軸受",
          "高酸化安定性・水分離性が必要",
        ],
        [
          "タービン油 VG 46",
          "41.4〜50.6",
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
          "61.2〜74.8",
          "コンベヤチェーン（常温）",
          "食品・一般搬送コンベヤチェーン",
          "食品用は白色鉱物油を使用",
        ],
        [
          "チェーン油 VG 100",
          "90〜110",
          "コンベヤチェーン（高温）",
          "やや高温のコンベヤチェーン",
          "鉱物油は 100〜120℃程度まで。炉内など高温は合成（エステル）系の高温チェーン油",
        ],
        [
          "冷凍機油 VG 32",
          "28.8〜35.2",
          "冷凍・冷蔵コンプレッサ",
          "冷凍・冷蔵コンプレッサ",
          "冷媒で油種が決まる（アンモニア・旧フロン＝鉱油/合成炭化水素、HFC＝エステル/エーテル系）。機種指定に従う",
        ],
        [
          "冷凍機油 VG 46",
          "41.4〜50.6",
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
          "炉周辺コンベヤ軸受など（連続 150℃前後まで）",
          "Li複合石けんで耐熱性向上。それ以上はウレア・フッ素系",
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

      // 増ちょう剤の耐熱は「連続使用の目安上限」（2026-10 一般的な値に修正：Li-X・Ca-X 200→150、Ca 80→60、Na 140→120 等）。
      //   実際の上限は基油と添加剤で変わるので銘柄のTDSで確認
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
          "〜150℃",
          "良好",
          "良好",
          "高温・高荷重対応。多目的グリスに最適",
        ],
        [
          "カルシウム（Ca）",
          "〜60℃",
          "優れる",
          "普通",
          "旧来型。耐水・防錆に優れるが低耐熱",
        ],
        [
          "カルシウムコンプレックス（Ca-X）",
          "〜150℃",
          "優れる",
          "良好",
          "高耐熱と耐水を両立。食品機械向けも",
        ],
        [
          "ウレア（ポリウレア）",
          "〜150〜180℃",
          "良好",
          "良好",
          "電動機軸受に最適。長寿命・耐熱・高速向き",
        ],
        [
          "ナトリウム（Na）",
          "〜120℃",
          "不良",
          "普通",
          "旧来型。耐水性低い。代替品推奨",
        ],
        [
          "ベントナイト（非石けん）",
          "〜150〜200℃",
          "良好",
          "普通",
          "滴点がなく溶けないが、上限は基油の酸化で決まる。高温・間欠給脂向け",
        ],
        [
          "PTFE（フッ素系＝PFPE基油）",
          "〜250℃前後",
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

      // 銘柄対応表 2026-09 作り直し：旧データに実在しない銘柄名が多数あったため、
      // 確認できた銘柄のみ掲載（ENEOS・出光は各社商品紹介資料で確認）。「—」は未照合。購入時は必ずTDSで確認
      // 2026-09 出光のギヤ・タービン・グリース、Shell/Mobil のウレア・Li-X を追加（出光SDS製品一覧・販売店掲載で実在確認）
      const BRAND_HYD = [
        ["VG 22", "Shell Tellus S2 M 22", "Mobil DTE 10 Excel 22（HV）", "出光 ダフニー スーパーハイドロA 22", "ENEOS スーパーハイランド 22", "Castrol Hyspin AWS 22"],
        ["VG 32", "Shell Tellus S2 M 32", "Mobil DTE 10 Excel 32（HV）", "出光 ダフニー スーパーハイドロA 32", "ENEOS スーパーハイランド 32", "Castrol Hyspin AWS 32"],
        ["VG 46", "Shell Tellus S2 M 46", "Mobil DTE 10 Excel 46（HV）", "出光 ダフニー スーパーハイドロA 46", "ENEOS スーパーハイランド 46", "Castrol Hyspin AWS 46"],
        ["VG 68", "Shell Tellus S2 M 68", "Mobil DTE 10 Excel 68（HV）", "出光 ダフニー スーパーハイドロA 68", "ENEOS スーパーハイランド 68", "Castrol Hyspin AWS 68"],
        ["VG 100", "Shell Tellus S2 M 100", "Mobil DTE 10 Excel 100（HV）", "—", "ENEOS スーパーハイランド 100", "Castrol Hyspin AWS 100"],
      ];

      const BRAND_GEAR = [
        ["VG 68（EP）", "Shell Omala S2 GX 68", "Mobilgear 600 XP 68", "出光 ダフニー スーパーギヤーオイル 68", "ENEOS ボンノックTS 68", "Castrol Alpha SP 68"],
        ["VG 100（EP）", "Shell Omala S2 GX 100", "Mobilgear 600 XP 100", "出光 ダフニー スーパーギヤーオイル 100", "ENEOS ボンノックTS 100", "Castrol Alpha SP 100"],
        ["VG 150（EP）", "Shell Omala S2 GX 150", "Mobilgear 600 XP 150", "出光 ダフニー スーパーギヤーオイル 150", "ENEOS ボンノックTS 150", "Castrol Alpha SP 150"],
        ["VG 220（EP）", "Shell Omala S2 GX 220", "Mobilgear 600 XP 220", "出光 ダフニー スーパーギヤーオイル 220", "ENEOS ボンノックTS 220", "Castrol Alpha SP 220"],
        ["VG 320（EP）", "Shell Omala S2 GX 320", "Mobilgear 600 XP 320", "出光 ダフニー スーパーギヤーオイル 320", "ENEOS ボンノックTS 320", "Castrol Alpha SP 320"],
        ["VG 460（EP）", "Shell Omala S2 GX 460", "Mobilgear 600 XP 460", "出光 ダフニー スーパーギヤーオイル 460", "ENEOS ボンノックTS 460", "Castrol Alpha SP 460"],
        ["VG 68（合成）", "Shell Omala S4 GX 68", "—", "—", "ENEOS ボンノックAX 68", "—"],
        ["VG 220（合成）", "Shell Omala S4 GX 220", "—", "—", "ENEOS ボンノックAX 220", "—"],
        ["VG 320（合成）", "Shell Omala S4 GX 320", "—", "—", "ENEOS ボンノックAX 320", "—"],
      ];

      const BRAND_TURB = [
        ["VG 32", "Shell Turbo T 32", "Mobil DTE 732", "出光 ダフニー タービンオイル 32", "ENEOS FBKタービン 32", "—"],
        ["VG 46", "Shell Turbo T 46", "Mobil DTE 746", "出光 ダフニー タービンオイル 46", "ENEOS FBKタービン 46", "—"],
        ["VG 68", "Shell Turbo T 68", "Mobil DTE 768", "出光 ダフニー タービンオイル 68", "ENEOS FBKタービン 68", "—"],
      ];

      const BRAND_GREASE = [
        ["汎用 #2（Li）", "Shell Gadus S2 V100 2", "Mobilux EP 2", "出光 ダフニーグリース MP No.2", "ENEOS エピノックグリースAP(N)2", "—"],
        ["汎用 #3（Li）", "Shell Gadus S2 V100 3", "Mobilux EP 3", "—", "ENEOS エピノックグリースAP(N)3", "—"],
        ["高温 #2（Li-X）", "Shell Gadus S3 V220C 2", "Mobilith SHC 220（合成）", "出光 ダフニー エポネックスSR No.2", "—", "—"],
        ["極圧 #2（Li+EP）", "Shell Gadus S2 V220 2", "Mobilux EP 2", "出光 ダフニーグリース MP No.2", "ENEOS エピノックグリースAP(N)2", "—"],
        ["ウレア #2", "Shell Gadus S3 T100 2", "Mobil Polyrex EM（電動機軸受向け）", "出光 ダフニー ポリレックスアルファ No.2（合成油）", "ENEOS パイロノックグリース ユニバーサル 2", "—"],
        ["食品用 #2（NSF H1）", "—", "Mobilgrease FM 102", "—", "—", "—"],
        ["直動ガイド用", "—（グリース：各ガイドメーカー指定品）", "Mobil Vactra Oil No.2（摺動面油）", "—", "—", "THK AFB-LF"],
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
