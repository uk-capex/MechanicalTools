      const MATERIAL = {
        steel: {
          E: 206000,
          rho: 7.85e-3,
          sigma_allow: 156,
          name: "SS400（一般構造用鋼）",
        },
        ss490: {
          E: 206000,
          rho: 7.85e-3,
          sigma_allow: 196,
          name: "SS490",
        },
        s45c: {
          E: 206000,
          rho: 7.85e-3,
          sigma_allow: 270,
          name: "S45C（調質）",
        },
        sus304: {
          E: 193000,
          rho: 7.93e-3,
          sigma_allow: 138,
          name: "SUS304",
        },
        a6063: {
          E: 70000,
          rho: 2.7e-3,
          sigma_allow: 90,
          name: "A6063-T5（アルミ押出）",
        },
        a6061: {
          E: 69000,
          rho: 2.7e-3,
          sigma_allow: 138,
          name: "A6061-T6（アルミ合金）",
        },
        a2017: {
          E: 72000,
          rho: 2.79e-3,
          sigma_allow: 207,
          name: "A2017-T4（超々ジュラルミン）",
        },
        alumi: {
          E: 70000,
          rho: 2.7e-3,
          sigma_allow: 90,
          name: "アルミ A6063-T5",
        }, // 後方互換
      };

      // H鋼 JIS (細幅+中幅 混合) [label, H, B, tw, tf, Ix_cm4, Zx_cm3, 単位質量kg/m(JIS G3192表値)]
      const PRESETS_H = [
        ["100×50", 100, 50, 5.0, 7.0, 187, 37.5, 9.3],
        ["125×60", 125, 60, 6.0, 8.0, 409, 65.5, 13.2],
        ["150×75", 150, 75, 5.0, 7.0, 666, 88.8, 14.0],
        ["175×90", 175, 90, 5.0, 8.0, 1210, 138, 18.1],
        ["200×100", 200, 100, 5.5, 8.0, 1810, 181, 21.3],
        ["250×125", 250, 125, 6.0, 9.0, 3960, 317, 29.6],
        ["300×150", 300, 150, 6.5, 9.0, 7210, 481, 36.7],
        ["350×175", 350, 175, 7.0, 11.0, 13500, 771, 49.6],
        ["400×200", 400, 200, 8.0, 13.0, 23500, 1170, 66.0],
        ["450×200", 450, 200, 9.0, 14.0, 32900, 1460, 76.0],
        ["500×200", 500, 200, 10.0, 16.0, 46800, 1870, 89.6],
        ["600×200", 600, 200, 11.0, 17.0, 75600, 2520, 106],
      ];

      // 溝形鋼 JIS G3192 表12 [label, H, B, t1, t2, Ix_cm4, Zx_cm3, A_cm2, 単位質量kg/m]
      const PRESETS_C = [
        ["75×40", 75, 40, 5.0, 7.0, 75.3, 20.1, 8.818, 6.92],
        ["100×50", 100, 50, 5.0, 7.5, 188, 37.6, 11.92, 9.36],
        ["125×65", 125, 65, 6.0, 8.0, 424, 67.8, 17.11, 13.4],
        ["150×75", 150, 75, 6.5, 10.0, 861, 115, 23.71, 18.6],
        ["150×75×9", 150, 75, 9.0, 12.5, 1050, 140, 30.59, 24.0],
        ["180×75", 180, 75, 7.0, 10.5, 1380, 154, 27.20, 21.4],
        ["200×80", 200, 80, 7.5, 11.0, 1950, 195, 31.33, 24.6],
        ["200×90", 200, 90, 8.0, 13.5, 2490, 249, 38.65, 30.3],
        ["250×90", 250, 90, 9.0, 13.0, 4180, 335, 44.07, 34.6],
        ["300×90", 300, 90, 9.0, 13.0, 6440, 429, 48.57, 38.1],
      ];

      // 等辺山形鋼 JIS G3192 [label, A, B (=A), t, Ix_cm4, Zx_cm3, e_cm, A_cm2, 単位質量kg/m]
      const PRESETS_L = [
        ["30×3", 30, 30, 3.0, 1.42, 0.66, 0.844, 1.727, 1.36],
        ["40×3", 40, 40, 3.0, 3.53, 1.21, 1.09, 2.336, 1.83],
        ["40×5", 40, 40, 5.0, 5.42, 1.91, 1.17, 3.755, 2.95],
        ["50×4", 50, 50, 4.0, 9.06, 2.49, 1.37, 3.892, 3.06],
        ["50×6", 50, 50, 6.0, 12.6, 3.55, 1.44, 5.644, 4.43],
        ["60×5", 60, 60, 5.0, 19.6, 4.52, 1.66, 5.802, 4.55],
        ["65×6", 65, 65, 6.0, 29.4, 6.27, 1.81, 7.527, 5.91],
        ["75×6", 75, 75, 6.0, 46.1, 8.47, 2.06, 8.727, 6.85],
        ["90×7", 90, 90, 7.0, 93.0, 14.2, 2.46, 12.22, 9.59],
        ["100×7", 100, 100, 7.0, 129, 17.7, 2.71, 13.62, 10.7],
        ["100×10", 100, 100, 10.0, 175, 24.4, 2.82, 19.00, 14.9],
        ["120×8", 120, 120, 8.0, 258, 29.5, 3.24, 18.76, 14.7],
        ["150×12", 150, 150, 12.0, 740, 68.2, 4.14, 34.77, 27.3],
      ];

      // 角形鋼管 JIS G3466 (STKR) [label, H, B, t, Ix_cm4, Zx_cm3, A_cm2, 単位質量kg/m]
      const PRESETS_SQ = [
        ["40×40×2.3", 40, 40, 2.3, 7.73, 3.86, 3.332, 2.62],
        ["50×50×2.3", 50, 50, 2.3, 15.9, 6.34, 4.252, 3.34],
        ["50×50×3.2", 50, 50, 3.2, 20.4, 8.16, 5.727, 4.5],
        ["60×60×3.2", 60, 60, 3.2, 36.9, 12.3, 7.007, 5.5],
        ["60×30×3.2", 60, 30, 3.2, 21.4, 7.15, 5.087, 3.99],
        ["75×45×3.2", 75, 45, 3.2, 50.8, 13.5, 7.007, 5.5],
        ["75×75×4.5", 75, 75, 4.5, 98.6, 26.3, 12.17, 9.55],
        ["80×80×4.5", 80, 80, 4.5, 122, 30.4, 13.07, 10.3],
        ["100×50×4.5", 100, 50, 4.5, 147, 29.3, 12.17, 9.55],
        ["100×100×4.5", 100, 100, 4.5, 249, 49.9, 16.67, 13.1],
        ["150×150×6", 150, 150, 6.0, 1150, 153, 33.63, 26.4],
      ];

      // 丸鋼 [label, d]
      const PRESETS_RD = [
        20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
      ].map((d) => [`φ${d}`, d]);

      // ミスミ HFSシリーズ アルミフレーム [label, Ix_mm4, Zx_mm3, A_mm2, section_type, dims]
      // ミスミカタログ・技術情報より (HFS標準タイプ)
      const PRESETS_ALUMI = [
        // label,        Ix(mm4),  Zx(mm3),  A(mm2),  H,   B
        ["HFS5-2020\n(20×20)", 4200, 420, 156, 20, 20],
        ["HFS5-2040\n(20×40)", 20400, 1020, 220, 40, 20],
        ["HFS6-3030\n(30×30)", 20530, 1369, 318, 30, 30],
        ["HFS6-3060\n(30×60)", 205300, 6843, 556, 60, 30],
        ["HFS6-4040\n(40×40)", 69700, 3485, 576, 40, 40],
        ["HFS8-4040\n(40×40 8s)", 78800, 3940, 720, 40, 40],
        ["HFS8-4080\n(40×80)", 606400, 15160, 1120, 80, 40],
        ["HFS8-6060\n(60×60)", 290900, 9697, 1300, 60, 60],
        [
          "HFS8-8080\n(80×80)",
          1039000,
          25975,
          2240,
          80,
          80,
        ],
        ["GNFS8-4040\n(高剛性)", 103000, 5150, 900, 40, 40],
      ];

      // ════════════════════════════════════════════════════
      //  STATE
      // ════════════════════════════════════════════════════
      // 丸パイププリセット [名称, 外径D(mm), 肉厚t(mm)]
      // 単管 JIS A 8951 / 配管用鋼管 JIS G 3452
      const PRESETS_PIPE = [
        // 単管
        ['単管 φ48.6×2.4',  48.6, 2.4],
        ['単管 φ42.7×2.3',  42.7, 2.3],
        ['単管 φ34.0×2.3',  34.0, 2.3],
        ['単管 φ27.2×2.0',  27.2, 2.0],
        // SGP 配管用鋼管 JIS G 3452
        ['SGP 15A φ21.7×2.8',  21.7, 2.8],
        ['SGP 20A φ27.2×2.8',  27.2, 2.8],
        ['SGP 25A φ34.0×3.2',  34.0, 3.2],
        ['SGP 32A φ42.7×3.5',  42.7, 3.5],
        ['SGP 40A φ48.6×3.5',  48.6, 3.5],
        ['SGP 50A φ60.5×3.8',  60.5, 3.8],
        ['SGP 65A φ76.3×4.2',  76.3, 4.2],
        ['SGP 80A φ89.1×4.2',  89.1, 4.2],
        ['SGP 100A φ114.3×4.5',114.3, 4.5],
        ['SGP 125A φ139.8×4.5',139.8, 4.5],
        ['SGP 150A φ165.2×5.0',165.2, 5.0],
        ['SGP 200A φ216.3×5.8',216.3, 5.8],
      ];
      let state = {
        matType: "steel_H",
        selectedPreset: null,
        sectionType: "rect",
      };

      // ════════════════════════════════════════════════════
      //  INIT
      // ════════════════════════════════════════════════════
      function init() {
        buildPresets(
          "steel_H",
          PRESETS_H,
          (p) => `${p[0]}`,
        );
        buildPresets(
          "steel_C",
          PRESETS_C,
          (p) => `${p[0]}`,
        );
        buildPresets(
          "steel_L",
          PRESETS_L,
          (p) => `${p[0]}`,
        );
        buildPresets(
          "steel_sq",
          PRESETS_SQ,
          (p) => `${p[0]}`,
        );
        buildPresets(
          "steel_rd",
          PRESETS_RD,
          (p) => `φ${p[1]}`,
        );
        buildPresets(
          "steel_pipe",
          PRESETS_PIPE,
          (p) => p[0].replace('単管 ','').replace('SGP ',''),
        );
        buildPresets(
          "alumi",
          PRESETS_ALUMI,
          (p) => p[0].split("\n")[0],
        );

        // 断面計算タブ 材料選択ボタン生成
        buildSecMatButtons();

        // Select defaults
        selectPreset("steel_H", 0);
        calcBeam();
        calcSection();
      }

      function buildSecMatButtons() {
        const grid =
          document.getElementById("sec-mat-grid");
        if (!grid) return;
        // alumi は後方互換用なのでスキップ
        const keys = Object.keys(MATERIAL).filter(
          (k) => k !== "alumi",
        );
        keys.forEach((key, i) => {
          const m = MATERIAL[key];
          const btn = document.createElement("button");
          btn.className =
            "sec-mat-btn" + (i === 0 ? " selected" : "");
          btn.innerHTML = `<span>${m.name}</span><br><span class="mat-e">E=${m.E.toLocaleString()} / σ=${m.sigma_allow}</span>`;
          btn.onclick = () => {
            document
              .querySelectorAll(".sec-mat-btn")
              .forEach((b) =>
                b.classList.remove("selected"),
              );
            btn.classList.add("selected");
            const eEl = document.getElementById("sec-E");
            const sEl =
              document.getElementById("sec-sigma");
            if (eEl) {
              eEl.value = m.E;
            }
            if (sEl) {
              sEl.value = m.sigma_allow;
            }
            calcSection();
          };
          grid.appendChild(btn);
        });
      }

      function buildPresets(type, arr, labelFn) {
        const container = document.getElementById(
          `pg-${type}`,
        );
        arr.forEach((p, i) => {
          const btn = document.createElement("button");
          btn.className = "preset-btn";
          btn.textContent = labelFn(p);
          btn.onclick = () => {
            selectPreset(type, i);
            calcBeam();
          };
          container.appendChild(btn);
        });
      }

      function selectPreset(type, idx) {
        const container = document.getElementById(
          `pg-${type}`,
        );
        if (!container) return;
        [
          ...container.querySelectorAll(".preset-btn"),
        ].forEach((b, i) => {
          b.classList.toggle("selected", i === idx);
        });
        state.selectedPreset = idx;
      }

      // ════════════════════════════════════════════════════
      //  MAT TYPE SWITCH
      // ════════════════════════════════════════════════════
      function setMatType(type, el) {
        state.matType = type;
        document
          .querySelectorAll("#matTabs .mat-tab")
          .forEach((t) => t.classList.remove("active"));
        el.classList.add("active");
        document
          .querySelectorAll(".preset-group")
          .forEach((g) => (g.style.display = "none"));
        const pg = document.getElementById(
          `preset-${type}`,
        );
        if (pg) pg.style.display = "";

        // auto-select first preset
        if (type !== "custom") {
          selectPreset(type, 0);
        }
        calcBeam();
      }

      function applyPipeCustom() {
        const D = parseFloat(document.getElementById('pipe-custom-D').value) || 48.6;
        const t = parseFloat(document.getElementById('pipe-custom-t').value) || 2.4;
        // PRESETS_PIPEに任意サイズを末尾に追加 or 上書き
        const label = `任意 φ${D}×${t}`;
        // 末尾に追加（重複なら上書き）
        const lastIdx = PRESETS_PIPE.length - 1;
        if (PRESETS_PIPE[lastIdx][0].startsWith('任意')) {
          PRESETS_PIPE[lastIdx] = [label, D, t];
        } else {
          PRESETS_PIPE.push([label, D, t]);
        }
        // プリセットグリッド再描画
        const pg = document.getElementById('pg-steel_pipe');
        if (pg) {
          pg.innerHTML = '';
          buildPresets('steel_pipe', PRESETS_PIPE, (p) => p[0].replace('単管 ','').replace('SGP ','').replace('任意 ',''));
        }
        selectPreset('steel_pipe', PRESETS_PIPE.length - 1);
        calcBeam();
      }

      // ════════════════════════════════════════════════════
      //  SECTION DATA RESOLUTION
      // ════════════════════════════════════════════════════
      function getSectionData() {
        const t = state.matType;
        const si = state.selectedPreset ?? 0;
        let I,
          Z,
          A,
          E,
          sigma_allow,
          matName,
          label,
          H_dim = 0,
          B_dim = 0;
        let Iy = 0,
          Zy = 0;
        // 重量計算用: rho=密度[g/mm³], unitW=単位重量[kg/m]（JIS表値がある場合のみセット、無ければA×rhoで計算）
        let rho = MATERIAL.steel.rho;
        let unitW = null;

        if (t === "steel_H") {
          const p = PRESETS_H[si];
          [, H_dim, B_dim, , ,] = p;
          I = p[5] * 1e4;
          Z = p[6] * 1e3;
          A = calcHarea(p[1], p[2], p[3], p[4]); // H,B,tw,tf
          unitW = p[7]; // JIS G3192 表値 kg/m
          E = MATERIAL.steel.E;
          sigma_allow = MATERIAL.steel.sigma_allow;
          matName = `H鋼 ${p[0]}`;
          label = p[0];
        } else if (t === "steel_C") {
          const p = PRESETS_C[si];
          [, H_dim, B_dim, , ,] = p;
          I = p[5] * 1e4;
          Z = p[6] * 1e3;
          A = p[7] * 100; // JIS表値 cm²→mm²
          unitW = p[8]; // JIS G3192 表値 kg/m
          E = MATERIAL.steel.E;
          sigma_allow = MATERIAL.steel.sigma_allow;
          matName = `溝形鋼 ${p[0]}`;
          label = p[0];
        } else if (t === "steel_L") {
          const p = PRESETS_L[si];
          [, H_dim, B_dim] = p;
          I = p[4] * 1e4;
          Z = p[5] * 1e3;
          A = p[7] * 100; // JIS表値 cm²→mm²
          unitW = p[8]; // JIS G3192 表値 kg/m
          E = MATERIAL.steel.E;
          sigma_allow = MATERIAL.steel.sigma_allow;
          matName = `等辺山形鋼 ${p[0]}`;
          label = p[0];
        } else if (t === "steel_sq") {
          const p = PRESETS_SQ[si];
          H_dim = p[1];
          B_dim = p[2];
          I = p[4] * 1e4;
          Z = p[5] * 1e3;
          A = p[6] * 100; // JIS表値 cm²→mm²
          unitW = p[7]; // JIS G3466 表値 kg/m
          E = MATERIAL.steel.E;
          sigma_allow = MATERIAL.steel.sigma_allow;
          matName = `角形鋼管 ${p[0]}`;
          label = p[0];
        } else if (t === "steel_rd") {
          const p = PRESETS_RD[si];
          const d = p[1];
          H_dim = d;
          B_dim = d;
          I = (Math.PI * d ** 4) / 64;
          Z = (Math.PI * d ** 3) / 32;
          A = (Math.PI * d ** 2) / 4;
          E = MATERIAL.steel.E;
          sigma_allow = MATERIAL.steel.sigma_allow;
          matName = `丸鋼 φ${d}`;
          label = `φ${d}`;
        } else if (t === "steel_pipe") {
          const p = PRESETS_PIPE[si];
          const D = p[1], tt = p[2];
          const di = D - 2 * tt;
          H_dim = D; B_dim = D;
          I = Math.PI * (D ** 4 - di ** 4) / 64;
          Z = I / (D / 2);
          A = Math.PI * (D ** 2 - di ** 2) / 4;
          E = MATERIAL.steel.E;
          sigma_allow = MATERIAL.steel.sigma_allow;
          matName = p[0];
          label = p[0].replace('単管 ','').replace('SGP ','');
        } else if (t === "alumi") {
          const p = PRESETS_ALUMI[si];
          H_dim = p[4];
          B_dim = p[5];
          I = p[1];
          Z = p[2];
          A = p[3];
          E = MATERIAL.alumi.E;
          sigma_allow = MATERIAL.alumi.sigma_allow;
          rho = MATERIAL.alumi.rho; // アルミ密度 2.7e-3 g/mm³
          matName = `アルミフレーム ${p[0]}`;
          label = p[0];
        } else {
          // custom
          I =
            parseFloat(
              document.getElementById("custom-I").value,
            ) || 1;
          Z =
            parseFloat(
              document.getElementById("custom-Z").value,
            ) || 1;
          A =
            parseFloat(
              document.getElementById("custom-A").value,
            ) || 1;
          E =
            parseFloat(
              document.getElementById("custom-E").value,
            ) || 206000;
          sigma_allow =
            parseFloat(
              document.getElementById("custom-allow").value,
            ) || 150;
          matName = "カスタム断面";
          label = "カスタム";
          H_dim = 100;
          B_dim = 100;
          // カスタム弱軸（Iy/Zy）は後でIy計算ブロックで上書きされる前に直接セット
          Iy =
            parseFloat(
              document.getElementById("custom-Iy")?.value,
            ) || I;
          Zy =
            parseFloat(
              document.getElementById("custom-Zy")?.value,
            ) || Z;
        }

        // ── 弱軸 Iy/Zy を計算 ──
        if (t === "steel_H") {
          const p = PRESETS_H[si];
          const H = p[1],
            B = p[2],
            tw = p[3],
            tf = p[4];
          Iy =
            (2 * tf * B ** 3 + (H - 2 * tf) * tw ** 3) / 12;
          Zy = Iy / (B / 2);
        } else if (t === "steel_C") {
          const p = PRESETS_C[si];
          const H = p[1],
            B = p[2],
            tw = p[3],
            tf = p[4];
          // 溝形鋼：弱軸は重心位置がズレる → 外側端距離で計算
          Iy =
            2 * ((tf * B ** 3) / 12) +
            ((H - 2 * tf) * tw ** 3) / 12;
          Zy = Iy / B; // 外端まで（保守側）
        } else if (t === "steel_L") {
          // 等辺山形：弱軸 ≒ 強軸と同等（45°回転の主軸）
          Iy = I;
          Zy = Z;
        } else if (t === "steel_sq") {
          const p = PRESETS_SQ[si];
          const H = p[1],
            B = p[2],
            tt = p[3];
          Iy =
            (H * B ** 3 -
              (H - 2 * tt) * (B - 2 * tt) ** 3) /
            12;
          Zy = Iy / (B / 2);
        } else if (t === "steel_rd") {
          Iy = I;
          Zy = Z; // 円は等方
        } else if (t === "steel_pipe") {
          Iy = I;
          Zy = Z; // 円管は等方
        } else if (t === "alumi") {
          // アルミフレームは正方形系が多い。HxBが逆の場合で近似
          const p = PRESETS_ALUMI[si];
          const H = p[4],
            B = p[5];
          if (H === B) {
            Iy = I;
            Zy = Z;
          } else {
            // 長方形断面で近似: Iy ≒ Ix * (B/H)^3
            Iy = I * Math.pow(B / H, 3);
            Zy = Iy / (H / 2);
          }
        } else {
          // カスタムは上で既にIy/Zyをセット済み（ここでは上書きしない）
          if (t !== "custom") {
            Iy = I;
            Zy = Z;
          }
        }
        // mm4/mm3単位に統一（Iy,Zyは mm4/mm3）
        // steel系はすでにcm→mmしてある。aluは元からmm
        // → steel: IはすでにI=p[5]*1e4なのでmm4、Iyも同じ単位になるよう計算済み
        // ただし上のIy計算はmm寸法で直接計算しているのでmm4で正しい

        return {
          I,
          Z,
          Iy,
          Zy,
          A,
          E,
          sigma_allow,
          rho,
          unitW,
          matName,
          label,
          H_dim,
          B_dim,
          matType: t,
          presetIdx: si,
        };
      }

      // approx area helpers
      function calcHarea(H, B, tw, tf) {
        return B * tf * 2 + (H - 2 * tf) * tw;
      }
      function calcCarea(H, B, tw, tf) {
        return B * tf * 2 + (H - 2 * tf) * tw;
      }

      // ════════════════════════════════════════════════════
      //  SUPPORT TYPE -> FORMULAS
      // ════════════════════════════════════════════════════
      function getLoadN() {
        const val =
          parseFloat(
            document.getElementById("load-val").value,
          ) || 0;
        const unit =
          document.getElementById("load-unit").value;
        if (unit === "kN") return val * 1000;
        if (unit === "kgf") return val * 9.80665;
        if (unit === "N/m") return val / 1000; // → N/mm
        return val; // N or N/mm
      }

      function isDistributed() {
        const unit =
          document.getElementById("load-unit").value;
        return unit === "N/mm" || unit === "N/m";
      }

      function calcBeamResults(I, E, L, P_or_w, sType, a) {
        // Returns {M, delta, RA, RB, formula}
        let M, delta, RA, RB, formula;
        const P = P_or_w,
          w = P_or_w;

        if (sType === "ss_center") {
          M = (P * L) / 4;
          delta = (P * L ** 3) / (48 * E * I);
          RA = RB = P / 2;
          formula = "M = PL/4  |  δ = PL³/(48EI)";
        } else if (sType === "ss_uni") {
          M = (w * L ** 2) / 8;
          delta = (5 * w * L ** 4) / (384 * E * I);
          RA = RB = (w * L) / 2;
          formula = "M = wL²/8  |  δ = 5wL⁴/(384EI)";
        } else if (sType === "ss_any") {
          const b = L - a;
          M = (P * a * b) / L;
          // max deflection (approx under point load)
          delta =
            (P *
              a *
              b *
              (a + 2 * b) *
              Math.sqrt(3 * a * (a + 2 * b))) /
            (27 * E * I * L);
          RA = (P * b) / L;
          RB = (P * a) / L;
          formula =
            "M = Pab/L  |  δ = Pab(a+2b)√[3a(a+2b)] / (27EIL)";
        } else if (sType === "cant_end") {
          M = P * L;
          delta = (P * L ** 3) / (3 * E * I);
          RA = P;
          RB = 0;
          formula = "M = PL  |  δ = PL³/(3EI)";
        } else if (sType === "cant_uni") {
          M = (w * L ** 2) / 2;
          delta = (w * L ** 4) / (8 * E * I);
          RA = w * L;
          RB = 0;
          formula = "M = wL²/2  |  δ = wL⁴/(8EI)";
        } else if (sType === "fix_center") {
          M = (P * L) / 8;
          delta = (P * L ** 3) / (192 * E * I);
          RA = RB = P / 2;
          formula = "M = PL/8  |  δ = PL³/(192EI)";
        } else if (sType === "fix_uni") {
          M = (w * L ** 2) / 12;
          delta = (w * L ** 4) / (384 * E * I);
          RA = RB = (w * L) / 2;
          formula = "M = wL²/12  |  δ = wL⁴/(384EI)";
        }
        return { M, delta, RA, RB, formula };
      }

      // ════════════════════════════════════════════════════
      // ════════════════════════════════════════════════════
      //  MAIN CALC
      // ════════════════════════════════════════════════════
      function calcBeam() {
        const sec = getSectionData();
        const { I, Z, Iy, Zy, E, sigma_allow } = sec;

        const L =
          parseFloat(
            document.getElementById("span-L").value,
          ) || 1000;
        const SF =
          parseFloat(
            document.getElementById("sf-val").value,
          ) || 2;
        const sType =
          document.getElementById("supportType").value;

        document.getElementById("field-a").style.display =
          sType === "ss_any" ? "" : "none";

        const a =
          parseFloat(
            document.getElementById("span-a").value,
          ) || L / 2;
        const P_raw = getLoadN();
        const dist = isDistributed();
        let P, w;
        if (dist) {
          w = P_raw;
          P = 0;
        } else {
          P = P_raw;
          w = 0;
        }
        const Peff = dist ? w : P;

        // 強軸計算
        const rs = calcBeamResults(I, E, L, Peff, sType, a);
        const sigmaS = rs.M / Z;
        const deltaS = rs.delta;
        const sfS =
          sigmaS > 0 ? sigma_allow / sigmaS : Infinity;

        // 弱軸計算（同じ荷重・スパン、I=Iy, Z=Zy）
        const rw = calcBeamResults(
          Iy,
          E,
          L,
          Peff,
          sType,
          a,
        );
        const sigmaW = rw.M / Zy;
        const deltaW = rw.delta;
        const sfW =
          sigmaW > 0 ? sigma_allow / sigmaW : Infinity;

        const sigma_allow_sf = sigma_allow / SF;

        // Verdict → 強軸で判定
        updateVerdict(
          sigmaS,
          sigma_allow_sf,
          sfS,
          deltaS,
          L,
        );

        // 比率
        const ratioI = Iy > 0 ? (I / Iy).toFixed(1) : "∞";
        const ratioZ = Zy > 0 ? (Z / Zy).toFixed(1) : "∞";
        const ratioSigma =
          sigmaS > 0 ? (sigmaW / sigmaS).toFixed(1) : "∞";
        const ratioDelta =
          deltaS > 0 ? (deltaW / deltaS).toFixed(1) : "∞";

        const sfSc =
          sfS >= SF ? "good" : sfS >= 1 ? "warn" : "bad";
        const sfWc =
          sfW >= SF ? "good" : sfW >= 1 ? "warn" : "bad";

        const rows = [
          {
            label: "断面二次モーメント I",
            unit: "mm⁴",
            vs: fmtNum(I, 0),
            vw: fmtNum(Iy, 0),
            ratio: `強軸は弱軸の ×${ratioI}`,
          },
          {
            label: "断面係数 Z",
            unit: "mm³",
            vs: fmtNum(Z, 0),
            vw: fmtNum(Zy, 0),
            ratio: `強軸は弱軸の ×${ratioZ}`,
          },
          {
            label: "最大曲げ応力 σ",
            unit: "N/mm²",
            vs: sigmaS.toFixed(2),
            vw: sigmaW.toFixed(2),
            ratio: `弱軸は強軸の ×${ratioSigma}`,
          },
          {
            label: "最大たわみ δ",
            unit: "mm",
            vs: deltaS.toFixed(3),
            vw: deltaW.toFixed(3),
            ratio: `弱軸は強軸の ×${ratioDelta}`,
          },
          {
            label: "安全率 S.F.",
            unit: "—",
            vs: sfS === Infinity ? "∞" : sfS.toFixed(2),
            vw: sfW === Infinity ? "∞" : sfW.toFixed(2),
            ratio: "—",
            csS: sfSc,
            csW: sfWc,
          },
          {
            label: "L/δ 比",
            unit: "—",
            vs: deltaS > 0 ? (L / deltaS).toFixed(0) : "∞",
            vw: deltaW > 0 ? (L / deltaW).toFixed(0) : "∞",
            ratio: "—",
          },
        ];
        document.getElementById("compare-tbody").innerHTML =
          rows
            .map(
              (r) =>
                `<tr>
      <td>${r.label}<br><span style="color:var(--muted);font-size:10px">[${r.unit}]</span></td>
      <td class="val strong ${r.csS || ""}">${r.vs}</td>
      <td class="val weak ${r.csW || ""}">${r.vw}</td>
      <td class="ratio-cell">${r.ratio}</td>
    </tr>`,
            )
            .join("");

        // ── 重量（参考値）──
        // 単位重量[kg/m]: JIS表値があればそれ、無ければ A[mm²]×ρ[g/mm³] = g/mm = kg/m
        const unitW =
          sec.unitW != null ? sec.unitW : sec.A * sec.rho;
        const spanW = (unitW * L) / 1000; // kg
        const wNote =
          ["steel_H", "steel_C", "steel_L"].includes(
            sec.matType,
          )
            ? "JIS G3192 表値"
            : sec.matType === "steel_sq"
              ? "JIS G3466 表値"
              : sec.matType === "custom"
                ? "計算値・密度7.85（鋼材想定）"
                : "断面積×密度の計算値";
        const fmtW = (v) =>
          v >= 10 ? v.toFixed(1) : v.toFixed(2);

        // 詳細（強軸）
        document.getElementById("detail-tbody").innerHTML =
          [
            ["スパン", "L", `${L.toFixed(0)}`, "mm"],
            [
              "荷重",
              dist ? "w" : "P",
              dist
                ? `${Peff.toFixed(2)}`
                : `${Peff.toFixed(0)}`,
              dist ? "N/mm" : "N",
            ],
            ["ヤング率", "E", E.toLocaleString(), "N/mm²"],
            [
              "最大曲げモーメント",
              "Mmax",
              fmtNum(rs.M, 0),
              "N·mm",
            ],
            [
              "許容応力 (÷SF)",
              "σ/SF",
              `${sigma_allow_sf.toFixed(1)}`,
              "N/mm²",
            ],
            [
              `単位重量<br><span style="color:var(--muted);font-size:10px">※${wNote}</span>`,
              "w′",
              fmtW(unitW),
              "kg/m",
            ],
            [
              `スパン重量<br><span style="color:var(--muted);font-size:10px">※L=${L.toFixed(0)}mm分の自重（参考）</span>`,
              "W",
              fmtW(spanW),
              "kg",
            ],
          ]
            .map(
              ([n, s, v, u]) =>
                `<tr><td>${n}</td><td style="color:var(--muted);font-size:11px">${s}</td>
     <td class="hl">${v}</td><td style="color:var(--muted)">${u}</td></tr>`,
            )
            .join("");

        document.getElementById(
          "formula-text",
        ).textContent = rs.formula;

        // 断面図（強軸/弱軸 2枚）
        drawAxisPreviews(sec);

        // Beam diagram
        drawBeamDiagram(
          sType,
          L,
          Peff,
          dist,
          rs.RA,
          rs.RB,
          a,
        );
      }

      // ════════════════════════════════════════════════════
      //  VERDICT
      // ════════════════════════════════════════════════════
      function updateVerdict(
        sigma,
        sigma_allow_sf,
        sf_actual,
        delta,
        L,
      ) {
        const el = document.getElementById("beam-verdict");
        const icon =
          document.getElementById("verdict-icon");
        const main =
          document.getElementById("verdict-main");
        const sub = document.getElementById("verdict-sub");

        el.classList.remove("good", "warn", "bad");
        const ratio = sigma / sigma_allow_sf;

        if (ratio <= 0.8) {
          el.classList.add("good");
          icon.textContent = "✅";
          main.textContent = "余裕あり — 設計OK";
          sub.textContent = `応力比 ${(ratio * 100).toFixed(0)}% (安全率 ${sf_actual === Infinity ? "∞" : sf_actual.toFixed(2)})`;
        } else if (ratio <= 1.0) {
          el.classList.add("warn");
          icon.textContent = "⚠️";
          main.textContent = "許容内 — 要注意";
          sub.textContent = `応力比 ${(ratio * 100).toFixed(0)}% — 動荷重・疲労を要確認`;
        } else {
          el.classList.add("bad");
          icon.textContent = "❌";
          main.textContent = "許容超過 — 断面増大が必要";
          sub.textContent = `応力比 ${(ratio * 100).toFixed(0)}% — 現在の断面では強度不足`;
        }
      }

      // ════════════════════════════════════════════════════
      //  SECTION PREVIEW SVG (梁計算タブ)
      //  断面計算タブと同じ描画ロジックを使用
      // ════════════════════════════════════════════════════
      // ════════════════════════════════════════════════════
      //  AXIS PREVIEWS — 強軸/弱軸 断面図 & 諸元
      // ════════════════════════════════════════════════════
      // ════════════════════════════════════════════════════
      //  AXIS PREVIEWS — 強軸/弱軸 断面図 & 諸元
      // ════════════════════════════════════════════════════

      // 弱軸SVGは「強軸と同じ形を90°回転」して描く
      function drawWeakSvg(svgId, shape, a, b, c, d) {
        // まず強軸と同じパラメータで描いてから、SVG全体を90°回転
        drawShapeToSvg(svgId, shape, a, b, c, d);
        const svg = document.getElementById(svgId);
        // 既存の子要素をgでラップしてrotate
        const children = svg.innerHTML;
        svg.innerHTML = `<g transform="rotate(90,40,40)">${children}</g>`;
      }

      function drawAxisPreviews(sec) {
        const t = sec.matType;
        const si = sec.presetIdx ?? 0;
        let infoS = [],
          infoW = [];
        let titleS = "強軸 (x-x)",
          titleW = "弱軸 (y-y)";
        let shape, a, b, c, d;
        let weakRotate = true; // 弱軸をrotateで描くか

        if (t === "steel_H") {
          const p = PRESETS_H[si];
          const H = p[1],
            B = p[2],
            tw = p[3],
            tf = p[4];
          [shape, a, b, c, d] = ["H", H, B, tw, tf];
          titleS = `${p[0]} 縦置き`;
          titleW = `${p[0]} 横倒し`;
          const Iy =
            (2 * tf * B ** 3 + (H - 2 * tf) * tw ** 3) / 12;
          const Zy = Iy / (B / 2);
          infoS = [
            ["H×B", `${H}×${B} mm`],
            ["tw/tf", `${tw}/${tf} mm`],
            ["Ix", `${p[5]} cm⁴`],
            ["Zx", `${p[6]} cm³`],
          ];
          infoW = [
            ["H×B (回転後)", `${B}×${H} mm`],
            ["Iy", `${(Iy / 1e4).toFixed(1)} cm⁴`],
            ["Zy", `${(Zy / 1e3).toFixed(1)} cm³`],
            ["Ix/Iy", `×${((p[5] * 1e4) / Iy).toFixed(1)}`],
          ];
        } else if (t === "steel_C") {
          const p = PRESETS_C[si];
          const H = p[1],
            B = p[2],
            tw = p[3],
            tf = p[4];
          [shape, a, b, c, d] = ["C", H, B, tw, tf];
          titleS = `${p[0]} 縦置き`;
          titleW = `${p[0]} 横倒し`;
          // 弱軸Iy：フランジ2枚 + ウェブ（重心ズレ含む簡易式）
          const Iy =
            (2 * tf * B ** 3) / 12 +
            ((H - 2 * tf) * tw ** 3) / 12;
          const Zy = Iy / B; // 外端まで（保守側）
          infoS = [
            ["H×B", `${H}×${B} mm`],
            ["tw/tf", `${tw}/${tf} mm`],
            ["Ix", `${p[5]} cm⁴`],
            ["Zx", `${p[6]} cm³`],
          ];
          infoW = [
            ["H×B (回転後)", `${B}×${H} mm`],
            ["Iy(概算)", `${(Iy / 1e4).toFixed(1)} cm⁴`],
            ["Zy", `${(Zy / 1e3).toFixed(1)} cm³`],
            ["Ix/Iy", `×${((p[5] * 1e4) / Iy).toFixed(1)}`],
          ];
        } else if (t === "steel_L") {
          const p = PRESETS_L[si];
          [shape, a, b, c, d] = ["L", p[1], p[2], p[3]];
          titleS = `${p[0]} (等辺)`;
          titleW = `${p[0]} 90°回転`;
          infoS = [
            ["A×t", `${p[1]}×${p[3]} mm`],
            ["Ix", `${p[4]} cm⁴`],
            ["Zx", `${p[5]} cm³`],
          ];
          infoW = [
            ["等辺なので対称", "Iy≒Ix"],
            ["Iy", `${p[4]} cm⁴`],
            ["Zy", `${p[5]} cm³`],
          ];
        } else if (t === "steel_sq") {
          const p = PRESETS_SQ[si];
          const H = p[1],
            B = p[2],
            tt = p[3];
          [shape, a, b, c] = ["SQ", H, B, tt];
          titleS = `${p[0]} 縦`;
          titleW = `${p[0]} 横`;
          // 強軸Ix = B*H³/12 - (B-2t)*(H-2t)³/12  弱軸Iy = H*B³/12 - (H-2t)*(B-2t)³/12
          const Ix_calc =
            (B * H ** 3 -
              (B - 2 * tt) * (H - 2 * tt) ** 3) /
            12;
          const Iy =
            (H * B ** 3 -
              (H - 2 * tt) * (B - 2 * tt) ** 3) /
            12;
          const Zy = Iy / (B / 2);
          // 正方形(H=B)なら完全等値
          const isSquare = H === B;
          infoS = [
            ["H×B", `${H}×${B} mm`],
            ["t", `${tt} mm`],
            ["Ix", `${p[4]} cm⁴`],
            ["Zx", `${p[5]} cm³`],
          ];
          if (isSquare) {
            infoW = [
              ["正方形 → 等方", "Iy=Ix"],
              ["Iy", `${p[4]} cm⁴`],
              ["Zy", `${p[5]} cm³`],
            ];
          } else {
            infoW = [
              ["H×B (回転後)", `${B}×${H} mm`],
              ["Iy", `${(Iy / 1e4).toFixed(2)} cm⁴`],
              ["Zy", `${(Zy / 1e3).toFixed(2)} cm³`],
              ["Ix/Iy", `×${(Ix_calc / Iy).toFixed(2)}`],
            ];
          }
        } else if (t === "steel_rd") {
          const p = PRESETS_RD[si];
          [shape, a] = ["circle", p[1]];
          weakRotate = false;
          titleS = `φ${p[1]}`;
          titleW = `φ${p[1]} (等方)`;
          const I = (Math.PI * p[1] ** 4) / 64,
            Z = (Math.PI * p[1] ** 3) / 32;
          infoS = [
            ["d", `${p[1]} mm`],
            ["I", `${(I / 1e4).toFixed(2)} cm⁴`],
            ["Z", `${(Z / 1e3).toFixed(2)} cm³`],
          ];
          infoW = [
            ["円形 → 全方向等値", ""],
            ["I", `${(I / 1e4).toFixed(2)} cm⁴`],
            ["Z", `${(Z / 1e3).toFixed(2)} cm³`],
          ];
        } else if (t === "steel_pipe") {
          const p = PRESETS_PIPE[si];
          const D = p[1], tt = p[2], di = D - 2 * tt;
          [shape, a, b] = ["pipe", D, tt];  // b=肉厚tを渡す（drawShapeToSvgがri=r*(D-2t)/Dで計算）
          weakRotate = false;
          titleS = p[0].replace('単管 ','').replace('SGP ','');
          titleW = `${titleS} (等方)`;
          const Ip = Math.PI * (D**4 - di**4) / 64;
          const Zp = Ip / (D / 2);
          infoS = [
            ["外径 D", `${D} mm`],
            ["肉厚 t", `${tt} mm`],
            ["内径 di", `${di.toFixed(1)} mm`],
            ["I", `${(Ip / 1e4).toFixed(2)} cm⁴`],
            ["Z", `${(Zp / 1e3).toFixed(2)} cm³`],
          ];
          infoW = [
            ["円管 → 全方向等値", ""],
            ["I", `${(Ip / 1e4).toFixed(2)} cm⁴`],
            ["Z", `${(Zp / 1e3).toFixed(2)} cm³`],
          ];
        } else if (t === "alumi") {
          const p = PRESETS_ALUMI[si];
          const H = p[4],
            B = p[5];
          [shape, a, b] = ["alumi", H, B];
          const label0 = p[0].replace(/\n/g, " ");
          titleS = `${label0} 縦`;
          titleW = `${label0} 横`;
          // アルミフレーム弱軸: HとBが異なる場合は比例近似
          const Iy =
            H === B
              ? p[1]
              : (H * B ** 3 -
                  (H - B * 0.28) * (B * 0.72) ** 3) /
                12; // 正方形近似
          const Zy = H === B ? p[2] : Iy / (B / 2);
          infoS = [
            ["H×B", `${H}×${B} mm`],
            ["Ix", `${(p[1] / 1e4).toFixed(2)} cm⁴`],
            ["Zx", `${(p[2] / 1e3).toFixed(2)} cm³`],
          ];
          if (H === B) {
            infoW = [
              ["正方形 → 等方", "Iy=Ix"],
              ["Iy", `${(p[1] / 1e4).toFixed(2)} cm⁴`],
            ];
          } else {
            infoW = [
              ["H×B (回転後)", `${B}×${H} mm`],
              ["Iy(概算)", `${(Iy / 1e4).toFixed(2)} cm⁴`],
              ["Zy", `${(Zy / 1e3).toFixed(2)} cm³`],
            ];
          }
        } else {
          // カスタム：縦横ともユーザー入力のI/Zで表示
          const I_c =
            parseFloat(
              document.getElementById("custom-I")?.value,
            ) || 1;
          const Z_c =
            parseFloat(
              document.getElementById("custom-Z")?.value,
            ) || 1;
          const Iy_c =
            parseFloat(
              document.getElementById("custom-Iy")?.value,
            ) || I_c;
          const Zy_c =
            parseFloat(
              document.getElementById("custom-Zy")?.value,
            ) || Z_c;
          [shape, a, b] = ["rect", 100, 60];
          weakRotate = false;
          titleS = "カスタム 強軸";
          titleW = "カスタム 弱軸";
          infoS = [
            ["Ix", `${fmtNum(I_c, 0)} mm⁴`],
            ["Zx", `${fmtNum(Z_c, 0)} mm³`],
          ];
          infoW = [
            ["Iy", `${fmtNum(Iy_c, 0)} mm⁴`],
            ["Zy", `${fmtNum(Zy_c, 0)} mm³`],
          ];
        }

        // 強軸SVG描画
        drawShapeToSvg("svg-strong", shape, a, b, c, d);
        setText("ax-strong-title", titleS);
        document.getElementById(
          "ax-strong-info",
        ).innerHTML = infoS
          .map(
            ([l, v]) =>
              `<div class="axis-row"><span>${l}</span><span style="color:var(--accent)">${v}</span></div>`,
          )
          .join("");

        // 弱軸SVG描画（強軸を90°回転）
        if (weakRotate) {
          drawWeakSvg("svg-weak", shape, a, b, c, d);
        } else {
          drawShapeToSvg("svg-weak", shape, a, b, c, d);
        }
        setText("ax-weak-title", titleW);
        document.getElementById("ax-weak-info").innerHTML =
          infoW
            .map(
              ([l, v]) =>
                `<div class="axis-row"><span>${l}</span><span style="color:var(--warn)">${v}</span></div>`,
            )
            .join("");

        // 強軸/弱軸 比率バナー
        if (sec.I > 0 && sec.Iy > 0) {
          const ratio = sec.I / sec.Iy;
          const ratioEl =
            document.getElementById("ax-ratio");
          if (ratioEl) {
            const color =
              ratio > 5
                ? "var(--bad)"
                : ratio > 2
                  ? "var(--warn)"
                  : "var(--good)";
            if (Math.abs(ratio - 1) < 0.01) {
              ratioEl.innerHTML = `<span style="color:var(--good)">強軸 = 弱軸（等方）</span>`;
            } else {
              ratioEl.innerHTML = `Ix / Iy = <b style="color:${color}">×${ratio.toFixed(1)}</b>`;
            }
          }
        }
      }

      // 汎用描画ルーター — svgId に対して断面形状を描く（断面計算タブ・梁計算タブ共用）
      function drawShapeToSvg(svgId, shape, a, b, c, d) {
        const svg = document.getElementById(svgId);
        const W = 80,
          SH = 80;
        const fill = "var(--accent-dim)",
          stroke = "var(--accent)";

        if (shape === "rect") {
          const B = a,
            H = b,
            s = Math.min(W / B, SH / H) * 0.75;
          const bw = B * s,
            bh = H * s,
            ox = (W - bw) / 2,
            oy = (SH - bh) / 2;
          svg.innerHTML = `<rect x="${ox}" y="${oy}" width="${bw}" height="${bh}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" rx="1"/>
      <line x1="${ox + bw / 2}" y1="${oy}" x2="${ox + bw / 2}" y2="${oy + bh}" stroke="${stroke}" stroke-width="0.5" stroke-dasharray="3,2" opacity="0.5"/>
      <line x1="${ox}" y1="${oy + bh / 2}" x2="${ox + bw}" y2="${oy + bh / 2}" stroke="${stroke}" stroke-width="0.5" stroke-dasharray="3,2" opacity="0.5"/>`;
        } else if (shape === "H") {
          const Hd = a,
            Bd = b,
            tw = c,
            tf = d;
          const s = Math.min(W / Bd, SH / Hd) * 0.78;
          const bw = Bd * s,
            bh = Hd * s,
            tw2 = tw * s,
            tf2 = Math.max(tf * s, 3);
          const ox = (W - bw) / 2,
            oy = (SH - bh) / 2;
          svg.innerHTML = `<rect x="${ox}" y="${oy}" width="${bw}" height="${tf2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
       <rect x="${ox}" y="${oy + bh - tf2}" width="${bw}" height="${tf2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
       <rect x="${ox + (bw - tw2) / 2}" y="${oy + tf2}" width="${tw2}" height="${bh - 2 * tf2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
        } else if (shape === "C") {
          const Hd = a,
            Bd = b,
            tw = c,
            tf = d;
          const s = Math.min(W / Bd, SH / Hd) * 0.78;
          const bw = Bd * s,
            bh = Hd * s,
            tw2 = Math.max(tw * s, 3),
            tf2 = Math.max(tf * s, 3);
          const ox = (W - bw) / 2,
            oy = (SH - bh) / 2;
          svg.innerHTML = `<rect x="${ox}" y="${oy}" width="${bw}" height="${tf2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
       <rect x="${ox}" y="${oy + bh - tf2}" width="${bw}" height="${tf2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
       <rect x="${ox}" y="${oy + tf2}" width="${tw2}" height="${bh - 2 * tf2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
        } else if (shape === "L") {
          const A = a,
            B = b,
            t = c;
          const s = Math.min(W / A, SH / B) * 0.78;
          const aw = A * s,
            bh = B * s,
            t2 = Math.max(t * s, 3);
          const ox = (W - aw) / 2,
            oy = (SH - bh) / 2;
          svg.innerHTML = `<rect x="${ox}" y="${oy + bh - t2}" width="${aw}" height="${t2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
       <rect x="${ox}" y="${oy}" width="${t2}" height="${bh}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
        } else if (shape === "SQ" || shape === "alumi") {
          const Hd = a,
            Bd = b,
            t =
              shape === "alumi" ? Math.max(a, b) * 0.14 : c;
          const s = Math.min(W / Bd, SH / Hd) * 0.78;
          const bw = Bd * s,
            bh = Hd * s,
            t2 = Math.max(t * s, 2.5);
          const ox = (W - bw) / 2,
            oy = (SH - bh) / 2;
          svg.innerHTML = `<rect x="${ox}" y="${oy}" width="${bw}" height="${bh}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" rx="1.5"/>
       <rect x="${ox + t2}" y="${oy + t2}" width="${bw - 2 * t2}" height="${bh - 2 * t2}" fill="var(--bg)" stroke="${stroke}" stroke-width="0.8" rx="1"/>`;
        } else if (shape === "circle") {
          const D = a,
            r = Math.min(W, SH) * 0.36;
          svg.innerHTML = `<circle cx="${W / 2}" cy="${SH / 2}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${W / 2}" y1="${SH / 2 - r}" x2="${W / 2}" y2="${SH / 2 + r}" stroke="${stroke}" stroke-width="0.5" stroke-dasharray="3,2" opacity="0.5"/>
      <line x1="${W / 2 - r}" y1="${SH / 2}" x2="${W / 2 + r}" y2="${SH / 2}" stroke="${stroke}" stroke-width="0.5" stroke-dasharray="3,2" opacity="0.5"/>`;
        } else if (shape === "pipe") {
          const D = a,
            t = b,
            r = Math.min(W, SH) * 0.36,
            ri = (r * (D - 2 * t)) / D;
          svg.innerHTML = `<circle cx="${W / 2}" cy="${SH / 2}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <circle cx="${W / 2}" cy="${SH / 2}" r="${ri}" fill="var(--bg)" stroke="${stroke}" stroke-width="1"/>`;
        }
      }

      // ════════════════════════════════════════════════════
      //  BEAM DIAGRAM SVG
      // ════════════════════════════════════════════════════
      function drawBeamDiagram(
        sType,
        L,
        P,
        dist,
        RA,
        RB,
        a,
      ) {
        const svg = document.getElementById("beam-svg");
        const W = 500,
          H = 110;
        const bx = 60,
          by = 55,
          bw = 380,
          bh = 14;
        const isCant = sType.startsWith("cant");
        const isDist = dist;
        const color = {
          beam: "#388bfd",
          arrow: "#3fb950",
          react: "#d29922",
          text: "#768390",
        };

        let s = ``;

        // Beam body
        s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="3" fill="#1c3a6b" stroke="#388bfd" stroke-width="1.5"/>`;

        // Support symbols
        if (isCant) {
          // Fixed wall left
          s += `<rect x="${bx - 14}" y="${by - 16}" width="14" height="${bh + 32}" fill="#2a3444" stroke="#768390" stroke-width="1"/>`;
          for (let y = by - 12; y < by + bh + 16; y += 8)
            s += `<line x1="${bx - 14}" y1="${y}" x2="${bx - 28}" y2="${y + 8}" stroke="#768390" stroke-width="1"/>`;
          // Free end
          s += `<circle cx="${bx + bw}" cy="${by + bh / 2}" r="4" fill="none" stroke="#768390" stroke-width="1.5"/>`;
        } else {
          // Pin left
          s += triangle(bx, by + bh + 2, 14, color.react);
          // Pin/roller right
          s += triangle(
            bx + bw,
            by + bh + 2,
            14,
            color.react,
          );
          // ground lines
          s += groundLine(bx, by + bh + 16, color.react);
          s += groundLine(
            bx + bw,
            by + bh + 16,
            color.react,
          );
        }

        // Reactions labels
        if (isCant) {
          s += label(
            bx - 7,
            by + bh + 38,
            `R=${RA.toFixed(0)}N`,
            color.react,
            true,
          );
        } else {
          s += label(
            bx,
            by + bh + 38,
            `RA=${RA.toFixed(0)}N`,
            color.react,
            true,
          );
          s += label(
            bx + bw,
            by + bh + 38,
            `RB=${RB.toFixed(0)}N`,
            color.react,
            true,
          );
        }

        // Load
        if (isDist) {
          // distributed arrows
          for (
            let x = bx + 10;
            x <= bx + bw - 10;
            x += 24
          ) {
            s += arrow(x, by - 28, x, by, color.arrow);
          }
          s += `<line x1="${bx + 10}" y1="${by - 28}" x2="${bx + bw - 10}" y2="${by - 28}" stroke="${color.arrow}" stroke-width="1.5"/>`;
          s += label(
            bx + bw / 2,
            by - 35,
            `w=${P.toFixed(2)} N/mm`,
            color.arrow,
            true,
          );
        } else if (sType === "ss_any") {
          const ax = bx + (a / L) * bw;
          s += arrow(ax, by - 40, ax, by, color.arrow);
          s += label(
            ax,
            by - 48,
            `P=${P.toFixed(0)}N`,
            color.arrow,
            true,
          );
          // dimension a
          s += dimLine(
            bx,
            by + bh + 52,
            ax,
            by + bh + 52,
            `a=${a.toFixed(0)}`,
            color.text,
          );
        } else {
          // center or end
          const lx = isCant ? bx + bw : bx + bw / 2;
          s += arrow(lx, by - 40, lx, by, color.arrow);
          s += label(
            lx,
            by - 48,
            `P=${P.toFixed(0)}N`,
            color.arrow,
            true,
          );
        }

        // Span label
        s += dimLine(
          bx,
          by - 8,
          bx + bw,
          by - 8,
          `L=${L.toFixed(0)} mm`,
          color.text,
        );

        svg.innerHTML = s;
      }

      function triangle(cx, y, size, color) {
        const h = size * 0.8;
        return `<polygon points="${cx},${y} ${cx - size / 2},${y + h} ${cx + size / 2},${y + h}" fill="${color}" opacity="0.8"/>`;
      }
      function groundLine(cx, y, color) {
        return `<line x1="${cx - 10}" y1="${y}" x2="${cx + 10}" y2="${y}" stroke="${color}" stroke-width="1.5"/>
          <line x1="${cx - 12}" y1="${y + 4}" x2="${cx + 12}" y2="${y + 4}" stroke="${color}" stroke-width="1"/>`;
      }
      function arrow(x1, y1, x2, y2, color) {
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"/>
          <polygon points="${x2},${y2} ${x2 - 4},${y2 - 8} ${x2 + 4},${y2 - 8}" fill="${color}"/>`;
      }
      function label(x, y, text, color, center = false) {
        const anchor = center ? "middle" : "start";
        return `<text x="${x}" y="${y}" fill="${color}" font-size="11" font-family="JetBrains Mono,monospace" text-anchor="${anchor}">${text}</text>`;
      }
      function dimLine(x1, y, x2, y2, text, color) {
        const mx = (x1 + x2) / 2;
        return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="0.8" stroke-dasharray="3,2"/>
          <text x="${mx}" y="${y - 4}" fill="${color}" font-size="10" font-family="JetBrains Mono,monospace" text-anchor="middle">${text}</text>`;
      }

      // ════════════════════════════════════════════════════
      //  SECTION TAB CALC
      // ════════════════════════════════════════════════════
      let sectionType = "rect";

      function setSectionType(type, el) {
        sectionType = type;
        document
          .querySelectorAll(".sec-form")
          .forEach((f) => (f.style.display = "none"));
        // 'H' type のフォームIDは sec-Hform（sec-H はinput IDと衝突するため）
        const formId =
          type === "H" ? "sec-Hform" : `sec-${type}`;
        document.getElementById(formId).style.display = "";
        document
          .querySelectorAll("#stab-section .mat-tab")
          .forEach((t) => t.classList.remove("active"));
        el.classList.add("active");
        calcSection();
      }

      // 断面計算の最新値を転記用に保持
      let _secResult = null;

      function calcSection() {
        let Ix, Iy, Zx, Zy, A;
        let shape, sa, sb, sc, sd; // for SVG drawing

        if (sectionType === "rect") {
          const B = getV("sec-B"),
            H = getV("sec-rect-H");
          Ix = (B * H ** 3) / 12;
          Iy = (H * B ** 3) / 12;
          Zx = Ix / (H / 2);
          Zy = Iy / (B / 2);
          A = B * H;
          [shape, sa, sb] = ["rect", B, H];
        } else if (sectionType === "H") {
          const H = getV("secH-H"),
            B = getV("secH-B"),
            tw = getV("secH-tw"),
            tf = getV("secH-tf");
          Ix =
            (B * H ** 3 - (B - tw) * (H - 2 * tf) ** 3) /
            12;
          Zx = Ix / (H / 2);
          Iy =
            (2 * tf * B ** 3 + (H - 2 * tf) * tw ** 3) / 12;
          Zy = Iy / (B / 2);
          A = 2 * B * tf + (H - 2 * tf) * tw;
          [shape, sa, sb, sc, sd] = ["H", H, B, tw, tf];
        } else if (sectionType === "C") {
          const H = getV("secC-H"),
            B = getV("secC-B"),
            tw = getV("secC-tw"),
            tf = getV("secC-tf");
          Ix =
            (B * H ** 3 - (B - tw) * (H - 2 * tf) ** 3) /
            12;
          Zx = Ix / (H / 2);
          const yc = B / 2;
          Iy =
            2 *
              ((tf * B ** 3) / 12 +
                tf * B * (B / 2 - yc) ** 2) +
            ((H - 2 * tf) * tw ** 3) / 12 +
            (H - 2 * tf) * tw * (tw / 2 - yc) ** 2;
          Zy = Iy / yc;
          A = 2 * B * tf + (H - 2 * tf) * tw;
          [shape, sa, sb, sc, sd] = ["C", H, B, tw, tf];
        } else if (sectionType === "sq_pipe") {
          const H = getV("secSQ-H"),
            B = getV("secSQ-B"),
            t = getV("secSQ-t");
          Ix =
            (B * H ** 3 - (B - 2 * t) * (H - 2 * t) ** 3) /
            12;
          Zx = Ix / (H / 2);
          Iy =
            (H * B ** 3 - (H - 2 * t) * (B - 2 * t) ** 3) /
            12;
          Zy = Iy / (B / 2);
          A = H * B - (H - 2 * t) * (B - 2 * t);
          [shape, sa, sb, sc] = ["SQ", H, B, t];
        } else if (sectionType === "circle") {
          const D = getV("secCR-D");
          Ix = (Math.PI * D ** 4) / 64;
          Iy = Ix;
          Zx = (Math.PI * D ** 3) / 32;
          Zy = Zx;
          A = (Math.PI * D ** 2) / 4;
          [shape, sa] = ["circle", D];
        } else if (sectionType === "pipe") {
          const D = getV("secP-D"),
            t = getV("secP-t");
          const d = D - 2 * t;
          Ix = (Math.PI * (D ** 4 - d ** 4)) / 64;
          Iy = Ix;
          Zx = Ix / (D / 2);
          Zy = Zx;
          A = (Math.PI * (D ** 2 - d ** 2)) / 4;
          [shape, sa, sb] = ["pipe", D, t];
        }

        // ── 強軸SVG ──
        drawShapeToSvg(
          "sec-svg-strong",
          shape,
          sa,
          sb,
          sc,
          sd,
        );

        // ── 弱軸SVG（90°回転）──
        const isSymmetric =
          shape === "circle" ||
          shape === "pipe" ||
          (shape === "SQ" &&
            getV("secSQ-H") === getV("secSQ-B")) ||
          (shape === "rect" &&
            getV("sec-B") === getV("sec-H"));
        if (isSymmetric) {
          drawShapeToSvg(
            "sec-svg-weak",
            shape,
            sa,
            sb,
            sc,
            sd,
          );
        } else {
          drawWeakSvg(
            "sec-svg-weak",
            shape,
            sa,
            sb,
            sc,
            sd,
          );
        }

        // ── タイトル ──
        const shapeLabels = {
          rect: "矩形",
          H: "H形",
          C: "溝形",
          SQ: "角パイプ",
          circle: "丸棒",
          pipe: "丸パイプ",
        };
        setText(
          "sec-strong-title",
          `${shapeLabels[shape] || shape} 強軸`,
        );
        setText(
          "sec-weak-title",
          `${shapeLabels[shape] || shape} 弱軸`,
        );

        // ── 強軸info ──
        const infoS = [
          ["Ix", `${fmtNum(Ix, 0)} mm⁴`],
          ["Zx", `${fmtNum(Zx, 0)} mm³`],
          ["A", `${fmtNum(A, 1)} mm²`],
        ];
        document.getElementById(
          "sec-strong-info",
        ).innerHTML = infoS
          .map(
            ([l, v]) =>
              `<div class="axis-row"><span>${l}</span><span style="color:var(--accent)">${v}</span></div>`,
          )
          .join("");

        // ── 弱軸info ──
        const infoW = [
          ["Iy", `${fmtNum(Iy, 0)} mm⁴`],
          ["Zy", `${fmtNum(Zy, 0)} mm³`],
        ];
        document.getElementById("sec-weak-info").innerHTML =
          infoW
            .map(
              ([l, v]) =>
                `<div class="axis-row"><span>${l}</span><span style="color:var(--warn)">${v}</span></div>`,
            )
            .join("");

        // ── 比率バナー ──
        const ratioI = Iy > 0 ? Ix / Iy : Infinity;
        const ratioEl =
          document.getElementById("sec-ax-ratio");
        if (Math.abs(ratioI - 1) < 0.001) {
          ratioEl.innerHTML = `<span style="color:var(--good)">強軸 = 弱軸（等方）</span>`;
        } else {
          const col =
            ratioI > 5
              ? "var(--bad)"
              : ratioI > 2
                ? "var(--warn)"
                : "var(--good)";
          ratioEl.innerHTML = `Ix / Iy = <b style="color:${col}">×${ratioI.toFixed(1)}</b>`;
        }

        // ── 断面積・重心 ──
        setText("sec-A", fmtNum(A, 1));
        setText("sec-yc", fmtNum(Ix / Zx, 2));

        // ── 材料プロパティ読み込み ──
        const E_sec = getV("sec-E") || 206000;
        const sig_allow = getV("sec-sigma") || 156;

        // ── 比較テーブル ──
        const ratioZ = Zy > 0 ? Zx / Zy : Infinity;
        // 許容モーメント = σ_allow × Z
        const Mx_allow = sig_allow * Zx;
        const My_allow = sig_allow * Zy;
        const rows = [
          [
            "断面二次モーメント I",
            "mm⁴",
            fmtNum(Ix, 0),
            fmtNum(Iy, 0),
            `×${ratioI.toFixed(1)}`,
          ],
          [
            "断面係数 Z",
            "mm³",
            fmtNum(Zx, 0),
            fmtNum(Zy, 0),
            `×${ratioZ.toFixed(1)}`,
          ],
          [
            "重心距離 y",
            "mm",
            fmtNum(Ix / Zx, 2),
            fmtNum(Iy / Zy, 2),
            "—",
          ],
          [
            "許容曲げモーメント",
            "N·mm",
            fmtNum(Mx_allow, 0),
            fmtNum(My_allow, 0),
            `×${ratioZ.toFixed(1)}`,
          ],
        ];
        document.getElementById(
          "sec-compare-tbody",
        ).innerHTML = rows
          .map(
            ([n, u, vs, vw, r]) =>
              `<tr>
      <td>${n}<br><span style="color:var(--muted);font-size:10px">[${u}]</span></td>
      <td class="val strong">${vs}</td>
      <td class="val weak">${vw}</td>
      <td class="ratio-cell">${r}</td>
    </tr>`,
          )
          .join("");

        // 転記用に最新値を保存
        _secResult = {
          Ix,
          Iy,
          Zx,
          Zy,
          A,
          E: E_sec,
          sigma_allow: sig_allow,
          shape: sectionType,
        };
      }

      // ════════════════════════════════════════════════════
      //  TRANSFER: 断面計算 → 梁計算カスタム
      // ════════════════════════════════════════════════════
      function transferToBeamCalc() {
        if (!_secResult) {
          return;
        }
        const r = _secResult;

        // カスタムフィールドに値をセット
        const set = (id, val) => {
          const el = document.getElementById(id);
          if (el)
            el.value =
              typeof val === "number"
                ? Math.round(val)
                : val;
        };

        set("custom-I", r.Ix);
        set("custom-Z", r.Zx);
        set("custom-Iy", r.Iy);
        set("custom-Zy", r.Zy);
        set("custom-A", r.A);
        set("custom-E", r.E);
        set("custom-allow", r.sigma_allow);

        // 梁計算タブのカスタムに切り替え
        // 1. 材種タブを「カスタム」に切替
        const customTab = document.querySelector(
          '[onclick*="custom"]',
        );
        if (customTab) {
          setMatType("custom", customTab);
        } else {
          // mat-tabからcustomを探して切り替え
          document
            .querySelectorAll("#stab-beam .mat-tab")
            .forEach((t) => {
              if (t.textContent.includes("カスタム"))
                setMatType("custom", t);
            });
        }

        // 2. 梁計算タブに移動
        const beamTabBtn =
          document.querySelector(".stab-btn");
        showStab("beam", beamTabBtn);

        // 3. 再計算
        calcBeam();

        // 4. 完了メッセージ
        const msg = document.getElementById("transfer-msg");
        if (msg) {
          msg.textContent = `✓ Ix=${fmtNum(r.Ix, 0)} / Iy=${fmtNum(r.Iy, 0)} mm⁴ を転記しました`;
          msg.classList.add("show");
          setTimeout(
            () => msg.classList.remove("show"),
            3000,
          );
        }
      }

      // ════════════════════════════════════════════════════
      //  UTILITIES
      // ════════════════════════════════════════════════════
      function showStab(id, el) {
        document
          .querySelectorAll("#tab-beam .stab-content")
          .forEach((c) => c.classList.remove("active"));
        document
          .querySelectorAll("#tab-beam .stab-btn")
          .forEach((b) => b.classList.remove("active"));
        document
          .getElementById(`stab-${id}`)
          .classList.add("active");
        el.classList.add("active");
      }

      function fmtNum(n, dec) {
        if (!isFinite(n)) return "∞";
        if (n === 0) return "0";
        if (Math.abs(n) >= 1e6)
          return (n / 1e6).toFixed(2) + "×10⁶";
        if (Math.abs(n) >= 1e4)
          return n.toLocaleString("ja", {
            maximumFractionDigits: 0,
          });
        return n.toFixed(dec);
      }
      function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      }
      function getV(id) {
        return (
          parseFloat(document.getElementById(id)?.value) ||
          0
        );
      }

      // ════════════════════════════════════════════════════
      //  BOOT
      // ════════════════════════════════════════════════════
