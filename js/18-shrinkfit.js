      // ════════════════════════════════════════
      // TAB: 焼き嵌め / 冷やし嵌め
      // ════════════════════════════════════════
      // ════════════════════════════════════════
      // 焼き嵌め — 材質データベース
      // α: 線膨張係数(/℃), E: 縦弾性係数(MPa), sy: 降伏応力(MPa)
      // ════════════════════════════════════════
      const SHRINK_MAT = {
        S45C: {
          name: "鋼・S45C",
          alpha: 12.0e-6,
          E: 206000,
          sy: 490,
          note: "最汎用。調質品(HRC20前後)の値",
        },
        SCM440: {
          name: "合金鋼・SCM440",
          alpha: 11.8e-6,
          E: 206000,
          sy: 785,
          note: "高強度。焼き嵌め後の強度維持に優れる",
        },
        FC250: {
          name: "ねずみ鋳鉄・FC250",
          alpha: 10.5e-6,
          E: 100000,
          sy: 250,
          note: "引張強さ基準。脆性材のため安全率大きめに",
        },
        FCD600: {
          name: "球状黒鉛鋳鉄・FCD600",
          alpha: 11.0e-6,
          E: 170000,
          sy: 370,
          note: "鋳鉄中では靭性あり。焼き嵌めに適す",
        },
        SUS304: {
          name: "SUS304",
          alpha: 17.3e-6,
          E: 193000,
          sy: 205,
          note: "降伏応力低め。加工硬化考慮なし",
        },
        SUS440C: {
          name: "SUS440C（焼入れ）",
          alpha: 10.2e-6,
          E: 200000,
          sy: 1900,
          note: "マルテンサイト系。高硬度・高強度",
        },
        A5052: {
          name: "アルミ・A5052",
          alpha: 23.8e-6,
          E: 70000,
          sy: 195,
          note: "汎用アルミ合金。低E値に注意",
        },
        A2017: {
          name: "アルミ・A2017",
          alpha: 23.0e-6,
          E: 72000,
          sy: 275,
          note: "ジュラルミン。A5052より高強度",
        },
        C3604: {
          name: "真鍮・C3604",
          alpha: 20.5e-6,
          E: 97000,
          sy: 245,
          note: "快削黄銅。低速・低荷重用途",
        },
      };

      function shrinkSyncMat(side) {
        const sel = $(`sh-mat${side}-sel`);
        const key = sel.value;
        const wrap = $(`sh-mat${side}-custom-wrap`);
        const info = $(`sh-mat${side}-info`);

        if (key === "custom") {
          wrap.style.display = "";
          if (info) info.textContent = "";
        } else {
          wrap.style.display = "none";
          const m = SHRINK_MAT[key];
          if (info && m) {
            info.innerHTML = `α = ${(m.alpha * 1e6).toFixed(1)}×10⁻⁶ /℃　E = ${(m.E / 1000).toFixed(0)} GPa　σy = ${m.sy} MPa<br><span style="color:var(--muted)">${m.note}</span>`;
          }
        }
        calcShrink();
      }

      function getShrinkMat(side) {
        const sel = $(`sh-mat${side}-sel`);
        const key = sel.value;
        if (key === "custom") {
          return {
            alpha: +$(`sh-alpha${side}-custom`).value,
            E: +$(`sh-E${side}-custom`).value,
            sy: +$(`sh-sy${side}-custom`).value,
          };
        }
        return SHRINK_MAT[key] || SHRINK_MAT["S45C"];
      }

      function calcShrink() {
        const D = +$("sh-D").value;
        const delta = +$("sh-delta").value;
        const margin = +$("sh-margin").value;
        const TH0 = +$("sh-TH0").value;
        const THt = +$("sh-THt").value;
        const TS0 = +$("sh-TS0").value;
        const TSt = +$("sh-TSt").value;
        const safety = +$("sh-safety").value;

        const matH = getShrinkMat("H");
        const matS = getShrinkMat("S");
        const { alpha: alphaH, E: EH, sy: syH } = matH;
        const { alpha: alphaS, E: ES, sy: syS } = matS;

        if (
          [
            D,
            delta,
            margin,
            TH0,
            THt,
            TS0,
            TSt,
            alphaH,
            alphaS,
          ].some((v) => isNaN(v) || v === 0)
        )
          return;

        // ── 温度計算（既存） ──
        const dHole = alphaH * D * (THt - TH0);
        const dShaft = alphaS * D * (TS0 - TSt);
        const effClear = dHole + dShaft;
        const reqClear = delta + margin;
        const surplus = effClear - reqClear;
        const needDT_hole = reqClear / (alphaH * D);
        const needDT_shaft = reqClear / (alphaS * D);

        // ── 推奨締めしろ計算 ──
        // 穴側：引張応力（外径∞近似で σ_hoop = E * δ/D）
        // 軸側：圧縮応力（同様に σ = E * δ/D）
        // 制約：両方の材料で σ ≤ σy / S
        // δ_max = min( syH/EH , syS/ES ) * D / S
        const eps_allowH = syH / EH / safety; // 穴側許容ひずみ
        const eps_allowS = syS / ES / safety; // 軸側許容ひずみ
        const eps_allow = Math.min(eps_allowH, eps_allowS); // 制約側
        const limiting =
          eps_allowH <= eps_allowS
            ? "穴側が制約"
            : "軸側が制約";

        const delta_max = eps_allow * D; // 上限締めしろ
        const delta_min = delta_max * 0.3; // 下限（上限の30%：最低限の保持力確保）
        const delta_mid = (delta_min + delta_max) * 0.5;

        // 現在の締めしろ判定
        let judgeHtml;
        if (delta <= 0) {
          judgeHtml = `<span style="color:var(--muted)">狙い締め代を入力してください</span>`;
        } else if (delta > delta_max) {
          judgeHtml = `<span style="color:var(--bad)">⚠ 設定締め代 <b>${delta.toFixed(3)} mm</b> が上限 <b>${delta_max.toFixed(3)} mm</b> を超過 — 降伏リスクあり（${limiting}）</span>`;
        } else if (delta < delta_min) {
          judgeHtml = `<span style="color:var(--warn)">△ 設定締め代 <b>${delta.toFixed(3)} mm</b> が推奨下限 <b>${delta_min.toFixed(3)} mm</b> 未満 — 保持力不足のおそれ</span>`;
        } else {
          judgeHtml = `<span style="color:var(--good)">✓ 設定締め代 <b>${delta.toFixed(3)} mm</b> は推奨範囲内です（${limiting}、ε = ${((delta / D) * 1000).toFixed(2)}×10⁻³）</span>`;
        }

        $("sh-rec-min").innerHTML =
          `${delta_min.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("sh-rec-min-sub").textContent =
          `ε = ${(eps_allow * 0.3 * 1000).toFixed(2)}×10⁻³`;
        $("sh-rec-mid").innerHTML =
          `${delta_mid.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("sh-rec-mid-sub").textContent =
          `ε = ${(eps_allow * 0.65 * 1000).toFixed(2)}×10⁻³`;
        $("sh-rec-max").innerHTML =
          `${delta_max.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("sh-rec-max-sub").textContent =
          `ε_allow = ${(eps_allow * 1000).toFixed(2)}×10⁻³ (${limiting})`;
        $("sh-delta-judge").innerHTML = judgeHtml;

        // ── 判定バー（既存） ──
        let vcls, vicon, vmain, vsub;
        if (surplus >= 0.02) {
          vcls = "good";
          vicon = "✓";
          vmain = "クリアランス十分 — 組立可能";
          vsub = `余剰 ${surplus.toFixed(3)} mm の余裕あり`;
        } else if (surplus >= 0) {
          vcls = "warn";
          vicon = "△";
          vmain = "ギリギリ OK — 余裕は少ない";
          vsub = `余剰 ${surplus.toFixed(3)} mm。作業速度・部品質量に注意`;
        } else {
          vcls = "bad";
          vicon = "✕";
          vmain = "クリアランス不足 — 温度を見直して";
          vsub = `不足 ${Math.abs(surplus).toFixed(3)} mm`;
        }

        $("sh-verdict").className = `card ${vcls}`;
        $("sh-verdict-icon").textContent = vicon;
        $("sh-verdict-main").textContent = vmain;
        $("sh-verdict-sub").textContent = vsub;

        $("sh-clear").innerHTML =
          `${effClear.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("sh-clear-sub").textContent =
          `必要 ${reqClear.toFixed(3)} mm`;
        $("sh-dhole").innerHTML =
          `${dHole.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("sh-dhole-sub").textContent =
          `ΔT = ${(THt - TH0).toFixed(0)} ℃`;
        $("sh-dshaft").innerHTML =
          `${dShaft.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("sh-dshaft-sub").textContent =
          `ΔT = ${(TS0 - TSt).toFixed(0)} ℃`;

        $("sh-tbody").innerHTML = [
          ["呼び径 D", `${D.toFixed(3)} mm`],
          ["穴側 α", alphaH.toExponential(2) + " /℃"],
          ["軸側 α", alphaS.toExponential(2) + " /℃"],
          [
            "穴側 E / σy",
            `${(EH / 1000).toFixed(0)} GPa / ${syH} MPa`,
          ],
          [
            "軸側 E / σy",
            `${(ES / 1000).toFixed(0)} GPa / ${syS} MPa`,
          ],
          [
            "許容ひずみ ε_allow",
            `${(eps_allow * 1000).toFixed(3)} ×10⁻³ (${limiting})`,
          ],
          [
            "推奨締めしろ上限 δ_max",
            `${delta_max.toFixed(3)} mm`,
          ],
          ["穴拡大量 ΔD穴", `${dHole.toFixed(4)} mm`],
          ["軸縮小量 ΔD軸", `${dShaft.toFixed(4)} mm`],
          [
            "組立時クリアランス",
            `${effClear.toFixed(4)} mm`,
          ],
          [
            "必要クリアランス (δ+M)",
            `${reqClear.toFixed(4)} mm`,
          ],
          ["余剰クリアランス", `${surplus.toFixed(4)} mm`],
        ]
          .map(
            (r, i, a) =>
              `<tr${i === a.length - 1 ? ' class="highlight-row"' : ""}><td>${r[0]}</td><td class="hl">${r[1]}</td></tr>`,
          )
          .join("");

        $("sh-rev-hole").textContent =
          `+ ${needDT_hole.toFixed(0)} ℃`;
        $("sh-rev-hole-sub").textContent =
          `20℃ → ${(20 + needDT_hole).toFixed(0)} ℃`;
        $("sh-rev-shaft").textContent =
          `− ${needDT_shaft.toFixed(0)} ℃`;
        $("sh-rev-shaft-sub").textContent =
          `20℃ → ${(20 - needDT_shaft).toFixed(0)} ℃`;

        const LN2 = alphaS * D * 216;
        $("sh-memo").innerHTML =
          `<b>実務メモ</b><br>材質から算出した推奨締め代：<b>${delta_min.toFixed(3)} 〜 ${delta_max.toFixed(3)} mm</b>（安全率 S = ${safety}）<br>液体窒素（20℃→−196℃）で軸を冷やした場合の収縮量：<b>${LN2.toFixed(3)} mm</b><br>両側温調（穴加熱＋軸冷却）は必要温度差が小さく済み、歪み・焼戻しリスクを低減できる。`;
      }
