      // ════════════════════════════════════════
      // TAB: 管径探索
      // ════════════════════════════════════════
      const PS_FLUID_DB = {
        water20: {
          rho: 1000,
          mu: 1.004e-3,
          label: "水（20°C）",
          isAir: false,
          vMin: 0.5,
          vMax: 3.0,
        },
        water60: {
          rho: 983,
          mu: 0.467e-3,
          label: "水（60°C）",
          isAir: false,
          vMin: 0.5,
          vMax: 3.0,
        },
        water100: {
          rho: 958,
          mu: 0.282e-3,
          label: "熱水（100°C）",
          isAir: false,
          vMin: 0.5,
          vMax: 3.0,
        },
        oil22: {
          rho: 860,
          mu: 22e-3,
          label: "鉱物油 VG22",
          isAir: false,
          vMin: 0.5,
          vMax: 2.0,
        },
        oil46: {
          rho: 870,
          mu: 46e-3,
          label: "鉱物油 VG46",
          isAir: false,
          vMin: 0.5,
          vMax: 2.0,
        },
        oil68: {
          rho: 875,
          mu: 68e-3,
          label: "鉱物油 VG68",
          isAir: false,
          vMin: 0.5,
          vMax: 2.0,
        },
        seawater: {
          rho: 1025,
          mu: 1.08e-3,
          label: "海水（20°C）",
          isAir: false,
          vMin: 0.5,
          vMax: 3.0,
        },
        air6: {
          rho: 8.2,
          mu: 1.81e-5,
          label: "エア（0.6MPa·g）",
          isAir: true,
          vMin: 6,
          vMax: 15,
        },
        air7: {
          rho: 9.3,
          mu: 1.81e-5,
          label: "エア（0.7MPa·g）",
          isAir: true,
          vMin: 6,
          vMax: 15,
        },
        custom: {
          rho: 1000,
          mu: 1.004e-3,
          label: "カスタム",
          isAir: false,
          vMin: 0.5,
          vMax: 3.0,
        },
      };

      const PS_FITTINGS = [
        { label: "エルボ 90°（標準）", LeD: 30 },
        { label: "エルボ 90°（ロング）", LeD: 20 },
        { label: "エルボ 45°", LeD: 16 },
        { label: "チーズ（直流）", LeD: 20 },
        { label: "チーズ（分岐）", LeD: 60 },
        { label: "ゲートバルブ（全開）", LeD: 7 },
        { label: "ボールバルブ（全開）", LeD: 3 },
        { label: "グローブバルブ（全開）", LeD: 350 },
        { label: "チェックバルブ", LeD: 100 },
        { label: "ストレーナ", LeD: 150 },
        { label: "レデューサ（急縮小）", LeD: 20 },
      ];

      function psColebrook(Re, epsRel) {
        if (Re < 2300) return 64 / Re;
        return (
          0.25 /
          Math.pow(
            Math.log10(
              epsRel / 3.7 + 5.74 / Math.pow(Re, 0.9),
            ),
            2,
          )
        );
      }

      function psGetID(sizeA, ptype) {
        const d = PIPE_DB[sizeA];
        if (!d) return null;
        if (ptype === "sgp") return d.sgp_od - 2 * d.sgp_t;
        if (ptype === "sus") return d.sus_od - 2 * d.sus_t;
        return d.cu_od - 2 * d.cu_t;
      }

      function psCalcOne(id_mm, Q_m3s, rho, mu, L_m) {
        const D = id_mm / 1000;
        const A = (Math.PI * D * D) / 4;
        const v = Q_m3s / A;
        const Re = (rho * v * D) / mu;
        const eps = 0.046e-3; // 炭素鋼 mm→m
        const f = psColebrook(Re, eps / D);
        const g = 9.80665;
        const hf = (f * (L_m / D) * v * v) / (2 * g);
        const dP = (rho * g * hf) / 1000; // kPa
        return { v, Re, f, hf, dP };
      }

      function calcPipeSiz() {
        const fluidKey = $("ps-fluid").value;
        const isCustom = fluidKey === "custom";
        $("ps-custom-wrap").style.display = isCustom
          ? ""
          : "none";

        const fd =
          PS_FLUID_DB[fluidKey] || PS_FLUID_DB.water20;
        const rho = isCustom
          ? parseFloat($("ps-rho").value) || 1000
          : fd.rho;
        const mu = isCustom
          ? parseFloat($("ps-mu").value) || 1e-3
          : fd.mu;
        const isAir = fd.isAir;
        const vMin = fd.vMin,
          vMax = fd.vMax;

        // エア時: 実効流速用の体積圧縮比（P_atm / P₁）
        // P_atm=0.1013 MPa, P₁はfluidKeyから推定
        const P_atm = 0.101325;
        const P1_abs =
          fluidKey === "air6"
            ? 0.6 + P_atm
            : fluidKey === "air7"
              ? 0.7 + P_atm
              : P_atm;
        const vRatio = isAir ? P_atm / P1_abs : 1.0; // 実体積 / Nm³体積

        // 実効流速用の推奨範囲（エア: 液体換算で 1〜3 m/s 程度が妥協範囲）
        const vEffMin = 1.0,
          vEffMax = 5.0;

        // 流量 (m³/s)
        const Q_raw = parseFloat($("ps-Q").value) || 0;
        const Q_m3s = isAir
          ? Q_raw / 60 // Nm³/min → m³/s
          : Q_raw / 1000 / 60; // L/min → m³/s
        const Q_eff = isAir ? Q_m3s * vRatio : Q_m3s; // 実体積流量
        $("ps-q-label").textContent = isAir
          ? "流量 Q（Nm³/min）"
          : "流量 Q（L/min）";

        // エア用UI表示切替
        $("ps-eff-cards").style.display = isAir
          ? ""
          : "none";
        $("ps-veff-assess").style.display = isAir
          ? ""
          : "none";
        const thVeff = $("ps-th-veff");
        const thVeffJudge = $("ps-th-veff-judge");
        if (thVeff)
          thVeff.style.display = isAir ? "" : "none";
        if (thVeffJudge)
          thVeffJudge.style.display = isAir ? "" : "none";

        const L_m = parseFloat($("ps-L").value) || 10;
        const ptype = $("ps-pipetype").value;
        const singleA = parseInt($("ps-single-size").value);

        // ── 単管計算 ──
        const id_single = psGetID(singleA, ptype);
        $("ps-single-title").textContent =
          `${singleA}A の計算結果`;
        $("ps-r-id").textContent = id_single
          ? id_single.toFixed(1)
          : "—";

        if (id_single && Q_m3s > 0) {
          const r = psCalcOne(
            id_single,
            Q_m3s,
            rho,
            mu,
            L_m,
          );
          $("ps-r-dp").textContent = r.dP.toFixed(2);
          $("ps-r-dp-u").textContent = "kPa";
          if (isAir) {
            $("ps-r-hf-label").textContent = "圧損（参考）";
            $("ps-r-hf").textContent = r.dP.toFixed(2);
            $("ps-r-hf-u").textContent = "kPa";

            // 実効流速
            const A_m2 =
              (Math.PI * (id_single / 1000) ** 2) / 4;
            const vEff = Q_eff / A_m2;
            $("ps-r-veff").textContent = vEff.toFixed(2);
            $("ps-r-veff-sub").textContent =
              `Nm³基準 ${r.v.toFixed(2)} m/s の ${vRatio.toFixed(3)} 倍`;
            $("ps-r-vratio").textContent =
              vRatio.toFixed(3);

            // 実効流速判定バナー
            const effAssess = $("ps-veff-assess");
            let eText, eBg, eBc;
            if (vEff <= vEffMax) {
              eText = `✅ 実効流速 ${vEff.toFixed(2)} m/s — 配管設計上は適正範囲内（〜${vEffMax} m/s）`;
              eBg = "var(--good-dim)";
              eBc = "var(--good)";
            } else if (vEff <= vEffMax * 1.5) {
              eText = `🔶 実効流速 ${vEff.toFixed(2)} m/s — やや高め。工事費との妥協点として許容範囲内の場合も。`;
              eBg = "var(--warn-dim)";
              eBc = "var(--warn)";
            } else {
              eText = `❌ 実効流速 ${vEff.toFixed(2)} m/s — 高すぎ。エロージョン・騒音リスクあり。`;
              eBg = "rgba(248,81,73,0.1)";
              eBc = "#f85149";
            }
            effAssess.innerHTML = `<div style="font-size:11px;color:var(--muted);margin-bottom:3px">💡 実効流速（配管内実体積換算）</div>${eText}`;
            effAssess.style.background = eBg;
            effAssess.style.borderColor = eBc;
            effAssess.style.color = "var(--ink)";
          } else {
            $("ps-r-hf-label").textContent = "損失水頭 hf";
            $("ps-r-hf").textContent = r.hf.toFixed(2);
            $("ps-r-hf-u").textContent = "m";
          }
          $("ps-r-v").textContent = r.v.toFixed(2);
          $("ps-r-re").textContent = r.Re.toLocaleString(
            "ja",
            { maximumFractionDigits: 0 },
          );
          $("ps-r-f").textContent = r.f.toFixed(4);

          let regime, reColor;
          if (r.Re < 2300) {
            regime = "層流";
            reColor = "var(--good)";
          } else if (r.Re < 4000) {
            regime = "遷移域";
            reColor = "var(--warn)";
          } else {
            regime = "乱流";
            reColor = "var(--accent)";
          }
          $("ps-r-regime").textContent = regime;
          $("ps-re-card").style.borderColor = reColor;

          // Nm³基準 流速評価
          const assess = $("ps-v-assess");
          let aText, bg, bc;
          if (r.v < vMin * 0.5) {
            aText = `⚠ ${r.v.toFixed(2)} m/s — 低すぎ。スラッジ堆積・腐食のリスク。`;
            bg = "var(--warn-dim)";
            bc = "var(--warn)";
          } else if (r.v < vMin) {
            aText = `⚡ ${r.v.toFixed(2)} m/s — やや低め（推奨: ${vMin}〜${vMax} m/s）`;
            bg = "var(--warn-dim)";
            bc = "var(--warn)";
          } else if (r.v <= vMax) {
            aText = `✅ ${r.v.toFixed(2)} m/s — 適正範囲（${vMin}〜${vMax} m/s）`;
            bg = "var(--good-dim)";
            bc = "var(--good)";
          } else if (r.v <= vMax * 1.5) {
            aText = `⚡ ${r.v.toFixed(2)} m/s — やや高め。エロージョン・騒音に注意。`;
            bg = "var(--warn-dim)";
            bc = "var(--warn)";
          } else {
            aText = `❌ ${r.v.toFixed(2)} m/s — 高すぎ。管径を大きくしてください。`;
            bg = "rgba(248,81,73,0.1)";
            bc = "#f85149";
          }
          const prefix = isAir
            ? '<span style="font-size:11px;color:var(--muted)">Nm³基準　</span>'
            : "";
          assess.innerHTML = prefix + aText;
          assess.style.background = bg;
          assess.style.borderColor = bc;
          assess.style.color = "var(--ink)";

          // 継手テーブル
          const D_m = id_single / 1000;
          $("ps-fitting-tbody").innerHTML = PS_FITTINGS.map(
            (ft) => {
              const Le = ft.LeD * D_m;
              const dPf =
                (r.f * ft.LeD * rho * r.v * r.v) / 2 / 1000;
              const hilight =
                ft.label.includes("レデューサ") ||
                ft.label.includes("グローブ")
                  ? `style="background:rgba(210,153,34,0.07)"`
                  : "";
              return `<tr ${hilight}>
        <td style="padding:4px 8px;color:var(--ink)">${ft.label}</td>
        <td style="padding:4px 8px;text-align:right;font-family:'JetBrains Mono',monospace">${ft.LeD}</td>
        <td style="padding:4px 8px;text-align:right;font-family:'JetBrains Mono',monospace">${Le.toFixed(2)}</td>
        <td style="padding:4px 8px;text-align:right;font-family:'JetBrains Mono',monospace;color:${dPf > r.dP * 0.3 ? "var(--warn)" : "var(--ink)"}">${dPf.toFixed(3)}</td>
      </tr>`;
            },
          ).join("");
        }

        // ── 管径一覧比較 ──
        const SIZES = [
          10, 15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150,
          200, 250,
        ];
        $("ps-size-tbody").innerHTML = SIZES.map((sz) => {
          const id_mm = psGetID(sz, ptype);
          if (!id_mm || Q_m3s <= 0) return "";
          const r = psCalcOne(id_mm, Q_m3s, rho, mu, L_m);
          const ok = r.v >= vMin && r.v <= vMax;
          const low = r.v < vMin;
          const hi = r.v > vMax;
          const isSelected = sz === singleA;
          const badge = ok
            ? `<span style="color:var(--good);font-weight:700">✅ 適正</span>`
            : low
              ? `<span style="color:var(--muted)">⬇ 低め</span>`
              : `<span style="color:#f85149;font-weight:700">⬆ 速すぎ</span>`;
          const vColor = ok
            ? "var(--good)"
            : hi
              ? "#f85149"
              : "var(--muted)";
          const rowBg = isSelected
            ? "background:var(--accent-dim);"
            : ok
              ? "background:var(--good-dim);"
              : "";

          // エア時: 実効流速列
          let vEffCell = "",
            vEffBadgeCell = "";
          if (isAir) {
            const A_m2 =
              (Math.PI * (id_mm / 1000) ** 2) / 4;
            const vEff = Q_eff / A_m2;
            const effOk = vEff <= vEffMax;
            const effHi = vEff > vEffMax * 1.5;
            const effBadge = effOk
              ? `<span style="color:var(--good)">✅ OK</span>`
              : effHi
                ? `<span style="color:#f85149">❌ 高すぎ</span>`
                : `<span style="color:var(--warn)">🔶 やや高</span>`;
            const effColor = effOk
              ? "var(--accent)"
              : effHi
                ? "#f85149"
                : "var(--warn)";
            vEffCell = `<td style="padding:5px 8px;text-align:right;font-family:'JetBrains Mono',monospace;color:${effColor}">${vEff.toFixed(2)}</td>`;
            vEffBadgeCell = `<td style="padding:5px 8px;text-align:center">${effBadge}</td>`;
          }

          return `<tr style="${rowBg}${isSelected ? "outline:1px solid var(--accent);" : ""}">
      <td style="padding:5px 8px;font-weight:${isSelected ? "700" : "400"};color:${isSelected ? "var(--accent)" : "var(--ink)"}">${sz}A</td>
      <td style="padding:5px 8px;text-align:right;font-family:'JetBrains Mono',monospace">${id_mm.toFixed(1)}</td>
      <td style="padding:5px 8px;text-align:right;font-family:'JetBrains Mono',monospace;color:${vColor};font-weight:${ok ? "700" : "400"}">${r.v.toFixed(2)}</td>
      ${vEffCell}
      <td style="padding:5px 8px;text-align:right;font-family:'JetBrains Mono',monospace">${r.Re.toLocaleString("ja", { maximumFractionDigits: 0 })}</td>
      <td style="padding:5px 8px;text-align:right;font-family:'JetBrains Mono',monospace">${r.dP.toFixed(2)}</td>
      <td style="padding:5px 8px;text-align:center">${badge}</td>
      ${vEffBadgeCell}
    </tr>`;
        }).join("");
      }
      function calcPumpPow() {
        const fluidSel = $("pp-fluid");
        const isCustom = fluidSel.value === "custom";
        $("pp-rho-field").style.display = isCustom
          ? ""
          : "none";
        const rho = isCustom
          ? parseFloat($("pp-rho-custom").value) || 1000
          : parseFloat(fluidSel.value);

        const Q_m3h = parseFloat($("pp-Q").value) || 0;
        const H_m = parseFloat($("pp-H").value) || 0;
        const etaP =
          (parseFloat($("pp-eta-p").value) || 70) / 100;
        const etaM =
          (parseFloat($("pp-eta-m").value) || 90) / 100;
        const N_rpm = parseFloat($("pp-N").value) || 1450;
        const g = 9.80665;
        const Q_m3s = Q_m3h / 3600;

        const P_hydro = rho * g * Q_m3s * H_m;
        const P_shaft = P_hydro / (etaP * etaM);
        const eta_ovr = (P_hydro / P_shaft) * 100;
        const torque =
          P_shaft / etaM / ((2 * Math.PI * N_rpm) / 60);
        const Ns =
          (N_rpm * Math.sqrt(Q_m3s)) / Math.pow(H_m, 0.75);

        const fmt = (n, d) =>
          isFinite(n) ? n.toFixed(d) : "—";
        const setText = (id, v) => {
          const e = $(id);
          if (e) e.textContent = v;
        };

        setText("pp-r-shaft", fmt(P_shaft / 1000, 2));
        setText("pp-r-hydro", fmt(P_hydro / 1000, 2));
        setText("pp-r-eta", fmt(eta_ovr, 1));
        setText("pp-r-Qlps", fmt(Q_m3s * 1000, 2));
        setText("pp-r-torque", fmt(torque, 1));

        let nsType = "—";
        if (Ns < 100) nsType = "高揚程遠心ポンプ";
        else if (Ns < 300) nsType = "遠心ポンプ";
        else if (Ns < 700) nsType = "斜流ポンプ";
        else nsType = "軸流ポンプ";
        setText(
          "pp-r-ns",
          isFinite(Ns) ? Math.round(Ns).toString() : "—",
        );
        setText("pp-r-ns-type", nsType);

        // モータ選定
        const kW = P_shaft / 1000;
        const STD = [
          0.1, 0.2, 0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3.7,
          5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75,
          90, 110, 132, 160, 200,
        ];
        const rec =
          STD.find((v) => v >= kW * 1.1) ||
          STD[STD.length - 1];
        const nearby = STD.filter(
          (v) => v >= kW * 0.9 && v <= kW * 3,
        ).join(", ");
        $("pp-motor-guide").innerHTML =
          `<b>計算軸動力：</b>${kW.toFixed(2)} kW<br>` +
          `<b>推奨モータ（×1.1 余裕）：</b>≥ ${(kW * 1.1).toFixed(2)} kW → <b style="color:var(--accent)">${rec} kW</b> 標準モータ<br>` +
          `<span style="font-size:12px">IEC標準出力近傍: ${nearby} kW</span>`;

        // NPSHa
        const P_atm =
          (parseFloat($("pp-patm").value) || 101.325) *
          1000;
        const P_v =
          (parseFloat($("pp-pv").value) || 2.338) * 1000;
        const Hs = parseFloat($("pp-hs").value) || 0;
        const hf = parseFloat($("pp-hf").value) || 0;
        const NPSHa = (P_atm - P_v) / (rho * g) - Hs - hf;
        setText("pp-r-npsh", fmt(NPSHa, 2));

        const warn = $("pp-npsh-warn");
        if (NPSHa < 2) {
          warn.style.display = "";
          warn.style.cssText +=
            ";background:var(--warn-dim);border:1px solid var(--warn);color:var(--warn)";
          warn.textContent = `⚠ NPSHa低 (${NPSHa.toFixed(2)} m)。キャビテーション発生の危険あり。ポンプの必要NPSHrを確認してください。`;
        } else if (NPSHa < 4) {
          warn.style.display = "";
          warn.style.cssText +=
            ";background:rgba(210,153,34,0.1);border:1px solid var(--warn);color:var(--warn)";
          warn.textContent = `⚡ NPSHa やや低め (${NPSHa.toFixed(2)} m)。ポンプカーブのNPSHrと要確認。`;
        } else {
          warn.style.display = "none";
        }
      }

      // ── 継手 相当長さ係数テーブル (Le/d) ──
      // 代表値（スケジュール40相当）
      const FITTING_LED = {
        "ft-elbow90": 30,
        "ft-elbow45": 16,
        "ft-tee-s": 20,
        "ft-tee-b": 60,
        "ft-gate": 7,
        "ft-ball": 3,
        "ft-check": 100,
        "ft-strainer": 150,
      };
      const FITTING_LABEL = {
        "ft-elbow90": "エルボ90°",
        "ft-elbow45": "エルボ45°",
        "ft-tee-s": "チーズ(直流)",
        "ft-tee-b": "チーズ(分岐)",
        "ft-gate": "ゲートバルブ",
        "ft-ball": "ボールバルブ",
        "ft-check": "チェックバルブ",
        "ft-strainer": "ストレーナ",
      };

      function onFluidChange() {
        const fluid = $("pl-fluid").value;
        const isAir = fluid === "air";
        $("pl-kin-wrap").style.display =
          fluid === "oil" ? "" : "none";
        $("pl-air-wrap").style.display = isAir
          ? ""
          : "none";
        $("pl-height-wrap").style.display = isAir
          ? "none"
          : "";
        $("pl-liquid-cards").style.display = isAir
          ? "none"
          : "";
        $("pl-air-cards").style.display = isAir
          ? ""
          : "none";
        $("pl-q-conv").style.display = isAir ? "" : "none";
        // 流量ラベル・placeholder 切り替え
        const qLabel = $("pl-q-label");
        const qInput = $("pl-q");
        if (isAir) {
          qLabel.textContent = "流量 Q（Nm³/min）";
          qInput.placeholder = "例: 0.5";
          qInput.step = "0.01";
        } else {
          qLabel.textContent = "流量 Q（L/min）";
          qInput.placeholder = "例: 30";
          qInput.step = "0.1";
        }
        // 区間別内訳テーブルのヘッダ変更
        const col = $("pl-seg-col-loss");
        if (col)
          col.textContent = isAir
            ? "ΔP (kPa)"
            : "損失水頭 (m)";
        calcPipeLoss();
      }

      function setOilViscosity() {
        const v = $("pl-oil-grade").value;
        if (v) {
          $("pl-kin").value = v;
          calcPipeLoss();
        }
      }

      // ── 区間管理 ──
      const SEGMENT_LABELS = ["A", "B", "C", "D", "E"];
      const MAX_SEGMENTS = 5;
      let segments = []; // [{id, label}]
      let segIdSeq = 0;

      function segHtml(id, label) {
        const ftKeys = Object.keys(FITTING_LED);
        const ftInputs = ftKeys
          .map(
            (k) =>
              `<div style="display:grid;grid-template-columns:1fr 44px;align-items:center;gap:4px;margin-bottom:3px">
      <span style="font-size:11px;color:var(--muted)">${FITTING_LABEL[k]}</span>
      <input type="number" id="seg${id}-${k}" value="0" min="0" step="1"
        style="width:100%;padding:3px;border:1px solid var(--border);border-radius:3px;font-size:12px;text-align:center"
        oninput="calcPipeLoss()">
    </div>`,
          )
          .join("");
        return `<div id="seg-block-${id}" style="border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:8px;background:var(--bg)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <b style="font-size:13px;color:var(--accent)">区間 ${label}</b>
      ${segments.length > 1 ? `<button onclick="removeSegment(${id})" style="padding:2px 8px;font-size:11px;background:none;border:1px solid var(--border);border-radius:3px;cursor:pointer;color:var(--muted)">削除</button>` : ""}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px">
      <div class="field" style="margin:0"><label style="font-size:11px">内径 d（mm）</label>
        <input type="number" id="seg${id}-d" placeholder="例:25" step="0.1" oninput="calcPipeLoss()"></div>
      <div class="field" style="margin:0"><label style="font-size:11px">長さ L（m）</label>
        <input type="number" id="seg${id}-L" placeholder="例:10" step="0.1" oninput="calcPipeLoss()"></div>
    </div>
    <div class="field" style="margin:0 0 6px"><label style="font-size:11px">材質（粗さ）</label>
      <select id="seg${id}-rough" onchange="calcPipeLoss()" style="width:100%;padding:4px;border:1px solid var(--border);border-radius:3px;font-size:12px">
        <option value="0.046">鋼管（ε=0.046mm）</option>
        <option value="0.002">SUS管（ε=0.002mm）</option>
        <option value="0.0015">塩ビ管（ε=0.0015mm）</option>
        <option value="0.25">鋳鉄管（ε=0.25mm）</option>
      </select>
    </div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:4px">継手・バルブ（個数）</div>
    ${ftInputs}
    <div style="display:grid;grid-template-columns:1fr 44px;align-items:center;gap:4px;margin-top:4px">
      <span style="font-size:11px;color:var(--muted)">追加相当長さ（m）</span>
      <input type="number" id="seg${id}-extraLe" value="0" step="0.1" oninput="calcPipeLoss()"
        style="width:100%;padding:3px;border:1px solid var(--border);border-radius:3px;font-size:12px;text-align:center">
    </div>
  </div>`;
      }

      function renderSegments() {
        $("pl-segments").innerHTML = segments
          .map((s) => segHtml(s.id, s.label))
          .join("");
        $("pl-add-btn").style.display =
          segments.length >= MAX_SEGMENTS ? "none" : "";
      }

      function addSegment() {
        if (segments.length >= MAX_SEGMENTS) return;
        const id = ++segIdSeq;
        segments.push({
          id,
          label: SEGMENT_LABELS[segments.length],
        });
        renderSegments();
        calcPipeLoss();
      }

      function removeSegment(id) {
        segments = segments.filter((s) => s.id !== id);
        segments.forEach(
          (s, i) => (s.label = SEGMENT_LABELS[i]),
        );
        renderSegments();
        calcPipeLoss();
      }

      // ── コールブルック式 ──
      function calcLambda(Re, eps_rel) {
        if (Re < 2300) return 64 / Re;
        let lam =
          0.25 /
          Math.pow(
            Math.log10(
              eps_rel / 3.7 + 5.74 / Math.pow(Re, 0.9),
            ),
            2,
          );
        for (let i = 0; i < 30; i++) {
          const lam_new =
            1 /
            Math.pow(
              -2 *
                Math.log10(
                  eps_rel / 3.7 +
                    2.51 / (Re * Math.sqrt(lam)),
                ),
              2,
            );
          if (Math.abs(lam_new - lam) < 1e-9) break;
          lam = lam_new;
        }
        return lam;
      }

      // ── 配管損失（多区間対応）──
      function calcPipeLoss() {
        const fluid = $("pl-fluid").value;
        const isAir = fluid === "air";
        const Q_lpm = +$("pl-q").value || 0;
        const g = 9.81;
        const fmt = (n, d = 2) =>
          isFinite(n) ? n.toFixed(d) : "—";

        if (!Q_lpm || segments.length === 0) {
          clearPipeLoss();
          return;
        }

        // 流体物性（全区間共通）
        let rho,
          nu,
          P1_MPa = 0,
          Q_m3s;
        const P_atm = 0.101325; // MPa（ANR / ノルマル基準圧力）
        if (fluid === "water") {
          rho = 1000;
          nu = 1.004e-6;
          Q_m3s = Q_lpm / 1000 / 60;
        } else if (fluid === "oil") {
          nu = (+$("pl-kin").value || 46) * 1e-6;
          rho = 870;
          Q_m3s = Q_lpm / 1000 / 60;
        } else {
          // エア：入力は Nm³/min（ノルマル換算）→ 配管内実体積流量に変換
          // Q_Nm3min [Nm³/min] × (P_atm / P1) → 配管内 m³/min → /60 → m³/s
          P1_MPa = +$("pl-p1").value || 0.7;
          const T_K = (+$("pl-temp").value || 20) + 273.15;
          rho = (P1_MPa * 1e6) / (287 * T_K); // 配管内密度 [kg/m³]
          const mu = 1.81e-5; // 空気粘性係数 [Pa·s]（圧力によらずほぼ一定）
          nu = mu / rho; // 動粘度 [m²/s]
          // Q_lpm はここでは Nm³/min として扱う（ラベル変更済み）
          const Q_Nm3min = Q_lpm; // 変数名を明示（内部は同じフィールド流用）
          Q_m3s = (Q_Nm3min * P_atm) / P1_MPa / 60; // m³/s（配管内実流量）

          // 単位換算を入力欄下に表示
          if ($("pl-q-nm3h"))
            $("pl-q-nm3h").textContent = (
              Q_Nm3min * 60
            ).toFixed(3);
          if ($("pl-q-nlmin"))
            $("pl-q-nlmin").textContent = (
              Q_Nm3min * 1000
            ).toFixed(1);
          if ($("pl-q-nls"))
            $("pl-q-nls").textContent = (
              (Q_Nm3min * 1000) /
              60
            ).toFixed(2);
        }

        // 区間ごとに計算
        let totalHf = 0,
          totalHm = 0,
          totalHr = 0; // 液体：直管・継手・レデューサー
        let totalDPf = 0,
          totalDPm = 0,
          totalDPr = 0; // エア：直管・継手・レデューサー
        const segRows = [];
        let hasInvalidSeg = false; // 未入力区間フラグ（結果表示の抑制に使用）
        for (const seg of segments) {
          const id = seg.id;
          const d_mm =
            +document.getElementById(`seg${id}-d`)?.value ||
            0;
          const L_m =
            +document.getElementById(`seg${id}-L`)?.value ||
            0;
          const eps =
            +document.getElementById(`seg${id}-rough`)
              ?.value || 0.046;
          const extraLe =
            +document.getElementById(`seg${id}-extraLe`)
              ?.value || 0;

          if (!d_mm) {
            hasInvalidSeg = true;
            segRows.push(
              `<tr><td colspan="5" style="padding:5px;color:var(--muted)">区間${seg.label}: 内径未入力</td></tr>`,
            );
            continue;
          }

          const d_m = d_mm / 1000;
          const A = (Math.PI * d_m * d_m) / 4;
          const v = Q_m3s / A;
          const Re = (v * d_m) / nu;
          const eps_r = eps / 1000 / d_m;
          const lam = calcLambda(Re, eps_r);

          // 継手相当長さ
          let Le = extraLe;
          for (const [k, led] of Object.entries(
            FITTING_LED,
          )) {
            const n =
              +document.getElementById(`seg${id}-${k}`)
                ?.value || 0;
            Le += led * d_m * n;
          }

          // ── 前区間との境界でのレデューサー損失（バーダ・カルノー式）──
          let reducerNote = "";
          const si = segments.indexOf(seg);
          if (si > 0) {
            const prevId = segments[si - 1].id;
            const prevD_mm =
              +document.getElementById(`seg${prevId}-d`)
                ?.value || 0;
            if (prevD_mm && prevD_mm !== d_mm) {
              const d1 = prevD_mm / 1000;
              const d2 = d_mm / 1000;
              const A1 = (Math.PI * d1 * d1) / 4;
              const A2 = (Math.PI * d2 * d2) / 4;
              const v1 = Q_m3s / A1;
              const v2 = Q_m3s / A2;
              let hr_or_dPr;
              if (d2 < d1) {
                // 縮小（絞り）: K = 0.5(1 - A2/A1)  近似
                const K = 0.5 * (1 - A2 / A1);
                if (isAir) {
                  hr_or_dPr = (K * rho * v2 * v2) / 2; // Pa
                  totalDPr += hr_or_dPr;
                } else {
                  hr_or_dPr = (K * v2 * v2) / (2 * g); // m
                  totalHr += hr_or_dPr;
                }
                reducerNote = `縮小(${prevD_mm}→${d_mm}mm) K=${K.toFixed(3)}`;
              } else {
                // 拡大: バーダ式  h = (v1-v2)²/2g
                if (isAir) {
                  hr_or_dPr =
                    (rho * (v1 - v2) * (v1 - v2)) / 2; // Pa
                  totalDPr += hr_or_dPr;
                } else {
                  hr_or_dPr =
                    ((v1 - v2) * (v1 - v2)) / (2 * g); // m
                  totalHr += hr_or_dPr;
                }
                reducerNote = `拡大(${prevD_mm}→${d_mm}mm)`;
              }
              const rLoss = isAir
                ? `${fmt(hr_or_dPr / 1000, 3)} kPa`
                : `${fmt(hr_or_dPr, 4)} m`;
              segRows.push(`<tr style="background:var(--surface)">
          <td style="padding:3px 6px;border-bottom:1px solid var(--border);font-size:11px;color:var(--muted)" colspan="3">↕ ${reducerNote}</td>
          <td style="text-align:right;padding:3px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--warn)">${rLoss}</td>
          <td style="padding:3px 6px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">自動算出</td>
        </tr>`);
            }
          }

          const flowType =
            Re < 2300
              ? "層流"
              : Re < 4000
                ? "遷移"
                : "乱流";

          if (isAir) {
            const dPf =
              (lam * (L_m / d_m) * rho * v * v) / 2;
            const dPm =
              (lam * (Le / d_m) * rho * v * v) / 2;
            totalDPf += dPf;
            totalDPm += dPm;
            const dPtotal = dPf + dPm;
            segRows.push(`<tr>
        <td style="padding:4px 6px;border-bottom:1px solid var(--border)"><b>${seg.label}</b><br><span style="font-size:10px;color:var(--muted)">${d_mm}mm / ${L_m}m</span></td>
        <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace">${d_mm}mm</td>
        <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace">${fmt(v, 2)} m/s</td>
        <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace;color:var(--accent)">${fmt(dPtotal / 1000, 2)} kPa</td>
        <td style="padding:4px 6px;border-bottom:1px solid var(--border);font-size:11px;color:var(--muted)">${flowType}</td>
      </tr>`);
          } else {
            const hf =
              (lam * (L_m / d_m) * v * v) / (2 * g);
            const hm = (lam * (Le / d_m) * v * v) / (2 * g);
            totalHf += hf;
            totalHm += hm;
            segRows.push(`<tr>
        <td style="padding:4px 6px;border-bottom:1px solid var(--border)"><b>${seg.label}</b><br><span style="font-size:10px;color:var(--muted)">${d_mm}mm / ${L_m}m</span></td>
        <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace">${d_mm}mm</td>
        <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace">${fmt(v, 2)} m/s</td>
        <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace;color:var(--accent)">${fmt(hf + hm, 3)} m</td>
        <td style="padding:4px 6px;border-bottom:1px solid var(--border);font-size:11px;color:var(--muted)">${flowType}</td>
      </tr>`);
          }
        }
        $("pl-seg-tbody").innerHTML = segRows.join("");

        if (isAir) {
          const dP_total_Pa =
            totalDPf + totalDPm + totalDPr;
          const dP_kPa = dP_total_Pa / 1000;
          const dP_MPa = dP_total_Pa / 1e6;
          const Pend = P1_MPa - dP_MPa;
          const drop = (dP_MPa / P1_MPa) * 100;

          $("pl-dPf").innerHTML =
            `${fmt(totalDPf / 1000, 2)}<span class="card-unit"> kPa</span>`;
          $("pl-dPm").innerHTML =
            `${fmt(totalDPm / 1000, 2)}<span class="card-unit"> kPa</span>`;
          $("pl-dPr").innerHTML =
            totalDPr > 0
              ? `${fmt(totalDPr / 1000, 2)}<span class="card-unit"> kPa</span>`
              : `<span style="color:var(--muted)">—</span>`;
          $("pl-dP").innerHTML =
            `${fmt(dP_kPa, 2)}<span class="card-unit"> kPa</span>`;
          $("pl-dP-sub").textContent =
            `= ${fmt(dP_MPa, 4)} MPa（-${fmt(drop, 1)}%）`;
          $("pl-Pend").innerHTML =
            Pend <= 0
              ? `<span style="color:var(--bad)">≒ 0</span>`
              : `${fmt(Pend, 3)}<span class="card-unit"> MPa</span>`;
          $("pl-Pend-sub").textContent =
            Pend <= 0
              ? `損失過大 — 配管径・長さを見直してください`
              : `${P1_MPa} MPa − ${fmt(dP_MPa, 4)} MPa`;

          $("pl-detail-tbody").innerHTML = [
            [
              "流量 Q (ノルマル)",
              `${Q_lpm} Nm³/min`,
              "ノルマル換算入力値",
            ],
            [
              "　= Nm³/h",
              `${(Q_lpm * 60).toFixed(3)} Nm³/h`,
              "× 60",
            ],
            [
              "　= NL/min",
              `${(Q_lpm * 1000).toFixed(1)} NL/min`,
              "× 1000",
            ],
            [
              "　= NL/s",
              `${((Q_lpm * 1000) / 60).toFixed(2)} NL/s`,
              "÷ 60",
            ],
            [
              "配管内実流量",
              `${(Q_m3s * 1000 * 60).toFixed(4)} L/min`,
              `= Q×${P_atm}/${P1_MPa} (P₁換算)`,
            ],
            [
              "流体密度 ρ",
              `${fmt(rho, 3)} kg/m³`,
              `${P1_MPa} MPa abs`,
            ],
            ["入口圧力 P₁", `${P1_MPa} MPa`, "絶対圧"],
            [
              "直管ΔP合計",
              `${fmt(totalDPf / 1000, 3)} kPa`,
              "",
            ],
            [
              "継手ΔP合計",
              `${fmt(totalDPm / 1000, 3)} kPa`,
              "（相当長さ法）",
            ],
            [
              "レデューサーΔP",
              `${fmt(totalDPr / 1000, 3)} kPa`,
              "（バーダ・カルノー式）",
            ],
            [
              "総ΔP",
              `${fmt(dP_kPa, 3)} kPa`,
              `${fmt(dP_MPa, 5)} MPa`,
            ],
            ["末端圧力", `${fmt(Pend, 4)} MPa`, "P₁ − ΔP"],
            ["圧力降下率", `${fmt(drop, 2)} %`, ""],
          ]
            .map(
              (
                r,
              ) => `<tr><td style="padding:4px 6px;border-bottom:1px solid var(--border)">${r[0]}</td>
      <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace;color:var(--accent)">${r[1]}</td>
      <td style="padding:4px 6px;border-bottom:1px solid var(--border);color:var(--muted);font-size:11px">${r[2]}</td></tr>`,
            )
            .join("");

          // needP_MPa = コンプレッサーが出すべき圧力 = 入口圧力 P1
          // （末端必要圧 + 配管損失ΔP = P1 として設計されているため）
          window._pumpLossResult = {
            isAir: true,
            Q_Nm3min: Q_lpm, // Nm³/min（エア流量入力値）
            Q_lpm: null,
            needP_MPa: P1_MPa, // 代替判定へ渡す圧力 = P1（ΔPではない）
            dP_MPa, // 配管損失（参考値）
            P1_MPa,
            Pend_MPa: Pend,
          };
        } else {
          const z1 = +$("pl-z1").value || 0;
          const z2 = +$("pl-z2").value || 0;
          const hz = z2 - z1;
          const H = totalHf + totalHm + totalHr + hz;
          const P_MPa = (rho * g * H) / 1e6;

          $("pl-hf").innerHTML =
            `${fmt(totalHf, 3)}<span class="card-unit"> m</span>`;
          $("pl-hm").innerHTML =
            `${fmt(totalHm, 3)}<span class="card-unit"> m</span>`;
          $("pl-hr").innerHTML =
            totalHr > 0
              ? `${fmt(totalHr, 3)}<span class="card-unit"> m</span>`
              : `<span style="color:var(--muted)">—</span>`;
          $("pl-hz").innerHTML =
            `${fmt(hz, 1)}<span class="card-unit"> m</span>`;
          $("pl-H").innerHTML =
            `${fmt(H, 2)}<span class="card-unit"> m</span>`;
          $("pl-P").innerHTML =
            P_MPa <= 0
              ? `<span style="color:var(--good)">≒ 0</span>`
              : `${fmt(P_MPa, 3)}<span class="card-unit"> MPa</span>`;
          $("pl-P-sub").textContent =
            P_MPa <= 0
              ? `自然流下が可能（ポンプ不要）`
              : `= ${fmt(P_MPa * 10, 2)} bar = ${fmt((P_MPa * 1e6) / 9810, 2)} kgf/cm²`;
          $("pl-Le").innerHTML = `—`;

          $("pl-detail-tbody").innerHTML = [
            ["流量 Q", `${Q_lpm} L/min`, "全区間共通"],
            ["流体密度 ρ", `${fmt(rho, 1)} kg/m³`, ""],
            [
              "直管損失 Σhf",
              `${fmt(totalHf, 3)} m`,
              "全区間合計",
            ],
            [
              "継手損失 Σhm",
              `${fmt(totalHm, 3)} m`,
              "（相当長さ法）",
            ],
            [
              "レデューサー損失",
              `${fmt(totalHr, 3)} m`,
              "（バーダ・カルノー式）",
            ],
            ["静揚程 hz", `${fmt(hz, 2)} m`, "Z₂−Z₁"],
            [
              "全揚程 H",
              `${fmt(H, 3)} m`,
              "Σhf+Σhm+Σhr+hz",
            ],
            ["必要圧力 P", `${fmt(P_MPa, 4)} MPa`, "ρgH"],
          ]
            .map(
              (
                r,
              ) => `<tr><td style="padding:4px 6px;border-bottom:1px solid var(--border)">${r[0]}</td>
      <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace;color:var(--accent)">${r[1]}</td>
      <td style="padding:4px 6px;border-bottom:1px solid var(--border);color:var(--muted);font-size:11px">${r[2]}</td></tr>`,
            )
            .join("");

          window._pumpLossResult = {
            isAir: false,
            Q_Nm3min: null,
            Q_lpm, // 液体流量入力値 L/min
            needP_MPa: P_MPa, // 代替判定へ渡す圧力 = ρgH（必要揚程から算出）
            dP_MPa: null,
            P1_MPa: null,
            Pend_MPa: null,
          };
        }
      }

      function clearPipeLoss() {
        [
          "pl-hf",
          "pl-hm",
          "pl-hr",
          "pl-hz",
          "pl-H",
          "pl-P",
          "pl-Le",
          "pl-dPf",
          "pl-dPm",
          "pl-dPr",
          "pl-dP",
          "pl-Pend",
        ].forEach((id) => {
          const el = $(id);
          if (el) el.innerHTML = "—";
        });
        ["pl-P-sub", "pl-dP-sub", "pl-Pend-sub"].forEach(
          (id) => {
            const el = $(id);
            if (el) el.textContent = "";
          },
        );
        $("pl-detail-tbody").innerHTML = "";
        $("pl-seg-tbody").innerHTML = "";
      }

      function sendToAlt() {
        const r = window._pumpLossResult;
        if (!r) {
          alert("先に配管損失を計算してください");
          return;
        }

        // 流量：エアは Nm³/min→L/min 換算して渡す、液体はそのまま
        const qVal = r.isAir
          ? (r.Q_Nm3min * 1000).toFixed(1) // Nm³/min → NL/min（代替判定はL/min単位）
          : r.Q_lpm.toFixed(1);

        // 圧力：液体=ρgH（必要圧力）、エア=P1（コンプレッサー出口圧）
        const pVal = r.needP_MPa.toFixed(4);

        $("pa-q").value = qVal;
        $("pa-p").value = pVal;

        // エアモード時は代替判定の単位ラベルにノートを追加
        const noteEl = $("pa-q-note");
        if (noteEl) {
          if (r.isAir) {
            noteEl.textContent = `※ エアモード送信値: ${r.Q_Nm3min} Nm³/min = ${qVal} NL/min / 必要圧力 = P₁ ${r.P1_MPa} MPa（配管損失 ΔP = ${r.dP_MPa.toFixed(4)} MPa）`;
            noteEl.style.display = "";
          } else {
            noteEl.textContent = "";
            noteEl.style.display = "none";
          }
        }

        showPumpTab("palt", $("ptab-palt"));
        calcPumpAlt();
      }

      function calcPumpAlt() {
        const needQ = +$("pa-q").value || 0;
        const needP = +$("pa-p").value || 0;
        const marginQ = +$("pa-margin-q").value ?? 20;
        const marginP = +$("pa-margin-p").value ?? 20;
        const curQ = +$("pa-cur-q").value || 0;
        const curP = +$("pa-cur-p").value || 0;
        const curEff = +$("pa-cur-eff").value || 70;
        const altQ = +$("pa-alt-q").value || 0;
        const altP = +$("pa-alt-p").value || 0;
        const altEff = +$("pa-alt-eff").value || 70;
        const useRelief = $("pa-relief").checked;
        const fmt = (n, d = 2) =>
          n != null && isFinite(n) ? n.toFixed(d) : "—";

        $("pa-relief-wrap").style.display = useRelief
          ? ""
          : "none";
        $("pa-relief-result").style.display =
          useRelief && altQ && altP ? "" : "none";

        // ── 現ポンプ評価 ──
        const curCard = $("pa-cur-card");
        if (curQ && curP && needQ && needP) {
          const qDiff = curQ - needQ;
          const pDiff = curP - needP;
          const qRatio = (curQ / needQ - 1) * 100; // % 余裕（マイナスは不足）
          const pRatio = (curP / needP - 1) * 100;

          const qLabel =
            qRatio >= 0
              ? `<span style="color:var(--good)">+${fmt(qRatio, 1)}%（+${fmt(qDiff, 1)} L/min）</span>`
              : `<span style="color:var(--bad)">${fmt(qRatio, 1)}%（${fmt(qDiff, 1)} L/min）</span>`;
          const pLabel =
            pRatio >= 0
              ? `<span style="color:var(--good)">+${fmt(pRatio, 1)}%（+${fmt(pDiff, 3)} MPa）</span>`
              : `<span style="color:var(--bad)">${fmt(pRatio, 1)}%（${fmt(pDiff, 3)} MPa）</span>`;

          const qOk = curQ >= needQ;
          const pOk = curP >= needP;
          let icon, main, color;
          if (qOk && pOk) {
            if (qRatio >= marginQ && pRatio >= marginP) {
              icon = "🟢";
              main = "現ポンプ：余裕あり";
              color = "var(--good)";
            } else {
              icon = "✅";
              main = "現ポンプ：要求を満足";
              color = "var(--good)";
            }
          } else if (!qOk && !pOk) {
            icon = "❌";
            main = "現ポンプ：流量・圧力ともに不足";
            color = "var(--bad)";
          } else if (!qOk) {
            icon = "❌";
            main = "現ポンプ：流量不足";
            color = "var(--bad)";
          } else {
            icon = "❌";
            main = "現ポンプ：圧力不足";
            color = "var(--bad)";
          }
          $("pa-cur-icon").textContent = icon;
          $("pa-cur-main").textContent = main;
          $("pa-cur-sub").innerHTML =
            `流量: ${qLabel}　圧力: ${pLabel}`;
          curCard.style.borderColor = color;
        } else {
          $("pa-cur-icon").textContent = "—";
          $("pa-cur-main").textContent =
            curQ && curP
              ? "要求条件を入力してください"
              : "現ポンプのスペックを入力してください";
          $("pa-cur-sub").innerHTML = "";
          curCard.style.borderColor = "var(--border)";
        }

        // ── 代替可能レンジ ──
        const rangeBlock = $("pa-range-block");
        if (needQ && needP) {
          const recQ = needQ * (1 + marginQ / 100);
          const recP = needP * (1 + marginP / 100);
          const maxQ = curQ ? curQ * 1.5 : needQ * 2.0;
          const maxP = curP ? curP * 1.5 : needP * 2.0;

          $("pa-range-q-min").textContent = fmt(needQ, 1);
          $("pa-range-q-rec").textContent = fmt(recQ, 1);
          $("pa-range-q-max").textContent = fmt(maxQ, 1);
          $("pa-range-p-min").textContent = fmt(needP, 3);
          $("pa-range-p-rec").textContent = fmt(recP, 3);
          $("pa-range-p-max").textContent = fmt(maxP, 3);

          $("pa-range-note").innerHTML =
            `推奨下限は余裕率 Q:${marginQ}% / P:${marginP}% を加味した値です。` +
            `上限目安は現ポンプ定格の 150%（現ポンプ未入力時は要求値の 200%）。` +
            `<br>過剰スペックのポンプはリリーフ弁での圧力調整が必要になる場合があります。`;
          rangeBlock.style.display = "";
        } else {
          rangeBlock.style.display = "none";
        }

        // ── 代替候補評価 ──
        const altSection = $("pa-alt-section");
        if (altQ && altP && needQ && needP) {
          altSection.style.display = "";
          const qDiff = altQ - needQ;
          const pDiff = altP - needP;
          const qRatio = (altQ / needQ - 1) * 100;
          const pRatio = (altP / needP - 1) * 100;
          const qOk = altQ >= needQ;
          const pOk = altP >= needP;
          const qWarn = qRatio >= -marginQ && qRatio < 0; // 要求割れだが余裕率内
          const pWarn = pRatio >= -marginP && pRatio < 0;

          // 上限目安（代替レンジと同じ基準）
          const maxQ = curQ ? curQ * 1.5 : needQ * 2.0;
          const maxP = curP ? curP * 1.5 : needP * 2.0;
          const qOver = altQ > maxQ; // 流量が上限目安超え
          const pOver = altP > maxP; // 圧力が上限目安超え

          const qLabel =
            qRatio >= 0
              ? `<span style="color:${qOver ? "var(--warn)" : "var(--good)"}">+${fmt(qRatio, 1)}%（+${fmt(qDiff, 1)} L/min）${qOver ? "⚠️過剰" : ""}</span>`
              : qWarn
                ? `<span style="color:var(--warn)">${fmt(qRatio, 1)}%（${fmt(qDiff, 1)} L/min）要確認</span>`
                : `<span style="color:var(--bad)">${fmt(qRatio, 1)}%（${fmt(qDiff, 1)} L/min）</span>`;
          const pLabel =
            pRatio >= 0
              ? `<span style="color:${pOver ? "var(--warn)" : "var(--good)"}">+${fmt(pRatio, 1)}%（+${fmt(pDiff, 3)} MPa）${pOver ? "⚠️過剰" : ""}</span>`
              : pWarn
                ? `<span style="color:var(--warn)">${fmt(pRatio, 1)}%（${fmt(pDiff, 3)} MPa）要確認</span>`
                : `<span style="color:var(--bad)">${fmt(pRatio, 1)}%（${fmt(pDiff, 3)} MPa）</span>`;

          let icon,
            main,
            color,
            sub2 = "";
          if (qOk && pOk && (qOver || pOver)) {
            // 上限目安超え → 過剰スペック警告
            icon = "⚠️";
            main = "代替候補：スペック過剰（要検討）";
            color = "var(--warn)";
            const overItems = [
              ...(qOver
                ? [
                    `流量 ${fmt(altQ, 1)} L/min（上限目安 ${fmt(maxQ, 1)}）`,
                  ]
                : []),
              ...(pOver
                ? [
                    `圧力 ${fmt(altP, 3)} MPa（上限目安 ${fmt(maxP, 3)}）`,
                  ]
                : []),
            ];
            sub2 = `上限目安超え：${overItems.join(" / ")}<br>リリーフ弁・インバータ制御等の対策が前提となります。`;
          } else if (
            qOk &&
            pOk &&
            qRatio >= marginQ &&
            pRatio >= marginP
          ) {
            icon = "🟢";
            main = "代替候補：余裕あり（推奨）";
            color = "var(--good)";
          } else if (qOk && pOk) {
            icon = "✅";
            main = "代替候補：要求を満足";
            color = "var(--good)";
          } else if ((qWarn || qOk) && (pWarn || pOk)) {
            icon = "⚠️";
            main = "代替候補：要確認（余裕率未満）";
            color = "var(--warn)";
            sub2 = `余裕率の範囲内での不足です。末端機器の最低要求値と照合してください。`;
          } else if (!qOk && !pOk) {
            icon = "❌";
            main = "代替候補：流量・圧力ともに不足";
            color = "var(--bad)";
          } else if (!qOk) {
            icon = "❌";
            main = "代替候補：流量不足";
            color = "var(--bad)";
          } else {
            icon = "❌";
            main =
              "代替候補：圧力不足（リリーフ弁での補填は不可）";
            color = "var(--bad)";
          }
          $("pa-alt-icon").textContent = icon;
          $("pa-alt-main").textContent = main;
          $("pa-alt-sub").innerHTML =
            `流量: ${qLabel}　圧力: ${pLabel}` +
            (sub2 ? `<br>${sub2}` : "");
          $("pa-alt-card").style.borderColor = color;

          // リリーフ弁検討
          if (useRelief) {
            const reliefP = +$("pa-relief-p").value || 0;
            const rCard = $("pa-relief-card");
            if (!reliefP) {
              $("pa-relief-icon").textContent = "🔧";
              $("pa-relief-main").textContent =
                "リリーフ設定圧力を入力してください";
              $("pa-relief-sub").textContent = "";
              rCard.style.borderColor = "var(--border)";
            } else if (!pOk && !pWarn) {
              // 余裕率を超えた圧力不足 → リリーフでは補えない
              $("pa-relief-icon").textContent = "❌";
              $("pa-relief-main").textContent =
                "リリーフ弁では対応不可（代替候補の圧力が不足）";
              $("pa-relief-sub").textContent =
                `代替 ${altP} MPa ＜ 必要 ${needP} MPa。リリーフ弁は高圧を逃がすものであり、圧力不足の補填には使えません`;
              rCard.style.borderColor = "var(--bad)";
            } else if (!qOk && !qWarn) {
              // 余裕率を超えた流量不足 → リリーフでは補えない
              $("pa-relief-icon").textContent = "❌";
              $("pa-relief-main").textContent =
                "リリーフでは対応不可（流量不足）";
              $("pa-relief-sub").textContent =
                "リリーフ弁は圧力調整のみ。流量不足は解消できません";
              rCard.style.borderColor = "var(--bad)";
            } else if (pWarn || qWarn) {
              // 余裕率内の不足 → ⚠️ で要確認扱い
              $("pa-relief-icon").textContent = "⚠️";
              $("pa-relief-main").textContent =
                "要確認（余裕率未満）";
              $("pa-relief-sub").textContent =
                `スペックは余裕率の範囲内での不足です。末端機器の最低要求値と照合した上でリリーフ設定を検討してください`;
              rCard.style.borderColor = "var(--warn)";
            } else {
              // 圧力・流量ともに十分 → リリーフで圧力を絞れるか確認
              if (pOver) {
                // 大幅過剰 → リリーフ必須の旨を強調
                if (reliefP <= needP) {
                  $("pa-relief-icon").textContent = "⚠️";
                  $("pa-relief-main").textContent =
                    "リリーフ弁必須（圧力大幅過剰）";
                  $("pa-relief-sub").textContent =
                    `代替 ${altP} MPa は上限目安 ${fmt(maxP, 3)} MPa を超えています。リリーフ設定 ${reliefP} MPa で使用可能ですが、配管・機器の耐圧も要確認。`;
                  rCard.style.borderColor = "var(--warn)";
                } else {
                  $("pa-relief-icon").textContent = "⚠️";
                  $("pa-relief-main").textContent =
                    "リリーフ設定圧力が高すぎます（圧力大幅過剰）";
                  $("pa-relief-sub").textContent =
                    `代替 ${altP} MPa は上限目安超え。リリーフ設定を ${needP} MPa 以下にしてください。`;
                  rCard.style.borderColor = "var(--warn)";
                }
              } else if (reliefP <= needP) {
                $("pa-relief-icon").textContent = "✅";
                $("pa-relief-main").textContent =
                  "リリーフ弁で圧力調整可能";
                $("pa-relief-sub").textContent =
                  `代替 ${altP} MPa → リリーフ設定 ${reliefP} MPa（≤ 必要 ${needP} MPa） / 流量 OK`;
                rCard.style.borderColor = "var(--good)";
              } else {
                $("pa-relief-icon").textContent = "⚠️";
                $("pa-relief-main").textContent =
                  "リリーフ設定圧力が高すぎます";
                $("pa-relief-sub").textContent =
                  `設定 ${reliefP} MPa ＞ 必要 ${needP} MPa。${needP} MPa 以下に設定してください`;
                rCard.style.borderColor = "var(--warn)";
              }
            }
          }

          // スペック比較テーブル
          const shaftPow = (Q, P, eff) =>
            !Q || !P || !eff
              ? null
              : ((Q / 1000 / 60) * P * 1e6) / (eff / 100);
          const curPow = shaftPow(curQ, curP, curEff);
          const altPow = shaftPow(altQ, altP, altEff);
          const badge = (val, need, unit, decimals = 1) => {
            if (!val || !need)
              return `${fmt(val, decimals)} ${unit}`;
            const ratio = (val / need - 1) * 100;
            const color =
              ratio >= marginQ
                ? "var(--good)"
                : ratio >= 0
                  ? "var(--good)"
                  : ratio >= -marginQ
                    ? "var(--warn)"
                    : "var(--bad)";
            const sign = ratio >= 0 ? "+" : "";
            return `<span style="color:${color}">${fmt(val, decimals)} ${unit} (${sign}${fmt(ratio, 1)}%)</span>`;
          };
          $("pa-tbody").innerHTML = [
            [
              "流量 Q",
              `${fmt(needQ, 1)} L/min`,
              badge(curQ, needQ, "L/min", 1),
              badge(altQ, needQ, "L/min", 1),
            ],
            [
              "圧力",
              `${fmt(needP, 3)} MPa`,
              badge(curP, needP, "MPa", 3),
              badge(altP, needP, "MPa", 3),
            ],
            [
              "ポンプ効率",
              "—",
              `${curEff} %`,
              `${altEff} %`,
            ],
            [
              "軸動力（概算）",
              "—",
              curPow
                ? `${(curPow / 1000).toFixed(2)} kW`
                : "—",
              altPow
                ? `${(altPow / 1000).toFixed(2)} kW`
                : "—",
            ],
          ]
            .map(
              (r) => `<tr>
      <td style="padding:5px 6px;border-bottom:1px solid var(--border)">${r[0]}</td>
      <td style="text-align:center;padding:5px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace">${r[1]}</td>
      <td style="text-align:center;padding:5px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace">${r[2]}</td>
      <td style="text-align:center;padding:5px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace">${r[3]}</td>
    </tr>`,
            )
            .join("");

          // アドバイス
          const advLines = [];
          if (!qOk && !qWarn)
            advLines.push(
              "❌ <b>流量不足：</b>リリーフ弁での解消は不可。配管径の拡大かポンプの大型化を検討してください。",
            );
          if (!pOk && !pWarn)
            advLines.push(
              "❌ <b>圧力不足：</b>リリーフ弁は高圧を逃がすものであり、圧力不足の補填には使えません。",
            );
          if (qWarn || pWarn)
            advLines.push(
              "⚠️ <b>要確認：</b>不足率が余裕率の範囲内です。末端機器の最低要求値・実運転条件で問題ないか確認してください。",
            );
          if (qOver)
            advLines.push(
              "⚠️ <b>流量過剰：</b>上限目安を超えています。インバータ制御や絞り弁による流量調整が必要です。エネルギーロスにも注意してください。",
            );
          if (pOver)
            advLines.push(
              "⚠️ <b>圧力過剰：</b>上限目安を超えています。リリーフ弁での圧力管理が必須です。配管・機器・シールの耐圧も確認してください。",
            );
          if (qOk && pOk && !qOver && !pOver)
            advLines.push(
              "✅ <b>代替可能：</b>スペック上は要求を満足します。ただし実機での確認を推奨します。",
            );
          const adv = $("pa-advice");
          if (advLines.length) {
            adv.innerHTML = advLines.join("<br>");
            adv.style.display = "";
          } else {
            adv.style.display = "none";
          }
        } else {
          altSection.style.display = "none";
          $("pa-advice").style.display = "none";
        }
      }

      // 初期化
             // 最初の区間Aを追加
            
      // ════════════════════════════════════════════
      // 🎡 テーパーころ軸受 JS
      // ════════════════════════════════════════════
