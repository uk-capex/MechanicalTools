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


      // ── 低温側の収縮量（20℃基準の ΔL/L、代表値）2026-09 追加 ──
      // 線膨張係数は低温ほど小さくなるため、常温αで冷やし嵌めを計算すると収縮を過大評価する（危険側）。
      // 値：アルミ −196℃ 0.39% は文献値（Ekin, 293→77 K）
      // 2026-09 照合：SUS304 は NIST 低温物性の近似式で −196℃ 0.280%・−78℃ 0.146%（表 0.281/0.142）、
      //   鉄 0.198%・黄銅 0.340%（Ekin の表、300→100 K。100 K 以下の収縮は僅か）と表の値が ±5% 以内で一致。
      //   鋼（S45C等）0.19% は鉄より約5%小さめ＝収縮を控えめに見る側（冷やし嵌めでは安全側）。鋳鉄・440C は鉄からの推定値
      const LOWT_CONTR = {
        S45C:    { c78: 0.00100, c196: 0.00190 },
        SCM440:  { c78: 0.00100, c196: 0.00190 },
        FC250:   { c78: 0.00088, c196: 0.00166 },
        FCD600:  { c78: 0.00092, c196: 0.00174 },
        SUS304:  { c78: 0.00142, c196: 0.00281 },
        SUS440C: { c78: 0.00095, c196: 0.00180 },
        A5052:   { c78: 0.00204, c196: 0.00393 },
        A2017:   { c78: 0.00200, c196: 0.00385 },
        C3604:   { c78: 0.00180, c196: 0.00340 },
      };
      // 20℃→T(℃) の収縮ひずみ（T<20）。表がない材料・0℃以上は常温α
      function shContraction(key, alpha, T) {
        const t = LOWT_CONTR[key];
        if (T >= 0 || !t) return alpha * (20 - T);
        const e0 = alpha * 20;                       // 20→0℃ は常温α
        if (T >= -78) return e0 + (t.c78 - e0) * (0 - T) / 78;
        if (T >= -196) return t.c78 + (t.c196 - t.c78) * (-78 - T) / 118;
        return t.c196;                                // −196℃より下は頭打ち
      }
      // 収縮ひずみ eps を得るのに必要な温度（20℃から冷却）
      function shTempForContraction(key, alpha, eps) {
        const t = LOWT_CONTR[key];
        if (!t || eps <= alpha * 20) return 20 - eps / alpha;
        let lo = -196, hi = 0;
        if (eps > t.c196) return null;               // 液体窒素でも届かない
        for (let k = 0; k < 60; k++) {
          const mid = (lo + hi) / 2;
          if (shContraction(key, alpha, mid) > eps) lo = mid; else hi = mid;
        }
        return (lo + hi) / 2;
      }

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
        const keyS = $("sh-matS-sel").value;
        // 軸：初期温度TS0→冷却TSt。低温側は材料別の収縮量表を使用
        const dShaft = D * (shContraction(keyS, alphaS, TSt) - shContraction(keyS, alphaS, TS0));
        const effClear = dHole + dShaft;
        const reqClear = delta + margin;
        const surplus = effClear - reqClear;
        const needDT_hole = reqClear / (alphaH * D);
        const needT_shaft = shTempForContraction(keyS, alphaS, reqClear / D);
        const needDT_shaft = needT_shaft === null ? Infinity : 20 - needT_shaft;

        // ── 推奨締めしろ計算（2026-10 厚肉円筒＝ラメの式に作り直し）──
        //  旧：σ = E·δ/D の簡易式、下限は上限の30%（根拠なし）
        //  面圧 p と直径締め代 δ の関係（平面応力、ν=0.3）：
        //    δ = p·D·[ (KH + ν)/EH + (KS − ν)/ES ]、KH=(1+Q²)/(1−Q²)（Q=D/Do）、KS=(1+q²)/(1−q²)（q=di/D）
        //  上限：ボス内面の相当応力（ミーゼス）σ = p·√(3+Q⁴)/(1−Q²)、中実軸 σ = p、中空軸の内面 σ = 2p/(1−q²) がそれぞれ σy/S 以下
        //  下限：伝達トルク T = μ·p·π·D²·L/2 から、すべり安全率を掛けて必要な面圧 → 必要締め代
        const nu = 0.3;
        const DoIn = parseFloat($("sh-Do")?.value), diIn = parseFloat($("sh-di")?.value) || 0, LIn = parseFloat($("sh-L")?.value);
        const Do = DoIn > D ? DoIn : 2 * D;
        const di = diIn > 0 && diIn < D ? diIn : 0;
        const Lf = LIn > 0 ? LIn : D;
        const T_Nm = parseFloat($("sh-T")?.value);
        const mu = parseFloat($("sh-mu")?.value) || 0.15;
        const Sslip = parseFloat($("sh-Sslip")?.value) || 2;
        const Q = D / Do, q = di / D;
        const KH = (1 + Q * Q) / (1 - Q * Q), KS = (1 + q * q) / (1 - q * q);
        const C = (KH + nu) / EH + (KS - nu) / ES;            // δ/(p·D)  [1/MPa]
        const fH = Math.sqrt(3 + Q ** 4) / (1 - Q * Q);       // ボス内面 σeq / p
        const fS = di > 0 ? 2 / (1 - q * q) : 1;              // 軸 σeq / p
        const pH = syH / safety / fH, pS = syS / safety / fS; // 降伏で決まる許容面圧
        const p_max = Math.min(pH, pS);
        const limiting = pH <= pS ? "ボス側が制約" : "軸側が制約";
        const delta_max = p_max * D * C;
        const p_req = T_Nm > 0 ? (2 * Sslip * T_Nm * 1000) / (mu * Math.PI * D * D * Lf) : null;
        const delta_min = p_req != null ? p_req * D * C : null;
        const delta_mid = delta_min != null ? (delta_min + delta_max) / 2 : null;
        const p_at = delta > 0 ? delta / (D * C) : 0;          // 狙い締め代での面圧
        const T_at = (mu * p_at * Math.PI * D * D * Lf) / 2 / 1000; // そのときの伝達トルク N·m
        const eps_allow = delta_max / D;

        // 現在の締めしろ判定
        let judgeHtml;
        const tqTxt = `面圧 ${p_at.toFixed(0)} MPa・伝達トルク ${T_at.toFixed(0)} N·m（μ${mu}）`;
        if (delta <= 0) {
          judgeHtml = `<span style="color:var(--muted)">狙い締め代を入力してください</span>`;
        } else if (delta > delta_max) {
          judgeHtml = `<span style="color:var(--bad)">⚠ 設定締め代 <b>${delta.toFixed(3)} mm</b> が上限 <b>${delta_max.toFixed(3)} mm</b> を超過 — 降伏のおそれ（${limiting}）。${tqTxt}</span>`;
        } else if (delta_min != null && delta < delta_min) {
          judgeHtml = `<span style="color:var(--warn)">△ 設定締め代 <b>${delta.toFixed(3)} mm</b> が必要下限 <b>${delta_min.toFixed(3)} mm</b> 未満 — トルク ${T_Nm} N·m に対してすべりのおそれ。${tqTxt}</span>`;
        } else {
          judgeHtml = `<span style="color:var(--good)">✓ 設定締め代 <b>${delta.toFixed(3)} mm</b> は${delta_min != null ? "推奨範囲内" : "上限以内"}（${limiting}）。${tqTxt}</span>`;
        }

        $("sh-rec-min").innerHTML = delta_min != null
          ? `${delta_min.toFixed(3)}<span class="card-unit"> mm</span>` : `—<span class="card-unit"> mm</span>`;
        $("sh-rec-min-sub").textContent = delta_min != null
          ? `T${T_Nm}N·m×${Sslip} に必要な面圧 ${p_req.toFixed(0)} MPa` : "伝達トルクを入れると出る";
        $("sh-rec-mid").innerHTML = delta_mid != null
          ? `${delta_mid.toFixed(3)}<span class="card-unit"> mm</span>` : `—<span class="card-unit"> mm</span>`;
        $("sh-rec-mid-sub").textContent = delta_min != null && delta_min > delta_max
          ? "下限が上限を超える→長さ・外径・材質を見直し" : (delta_mid != null ? "下限と上限の中央" : "");
        $("sh-rec-max").innerHTML =
          `${delta_max.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("sh-rec-max-sub").textContent =
          `許容面圧 ${p_max.toFixed(0)} MPa（${limiting}・S${safety}）`;
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
          ["ボス外径 Do / 軸内径 di / 長さ L", `${Do} / ${di} / ${Lf} mm${DoIn > D ? "" : "（Do 未入力＝2D）"}`],
          ["許容面圧（ボス側 / 軸側）", `${pH.toFixed(0)} / ${pS.toFixed(0)} MPa（${limiting}）`],
          ["推奨締めしろ上限 δ_max", `${delta_max.toFixed(3)} mm（d の 1/${Math.round(D / delta_max)}）`],
          ["狙い締め代での面圧・トルク", `${p_at.toFixed(0)} MPa ・ ${T_at.toFixed(0)} N·m`],
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
        $("sh-rev-shaft").textContent = isFinite(needDT_shaft)
          ? `− ${needDT_shaft.toFixed(0)} ℃` : "冷却のみでは不可";
        $("sh-rev-shaft-sub").textContent = isFinite(needDT_shaft)
          ? `20℃ → ${(20 - needDT_shaft).toFixed(0)} ℃`
          : "液体窒素(−196℃)でも不足。穴加熱を併用";

        const LN2 = D * shContraction(keyS, alphaS, -196);
        const DRY = D * shContraction(keyS, alphaS, -78);
        const lowNote = LOWT_CONTR[keyS] ? "（低温で小さくなるαを考慮）" : "（任意材料のため常温α使用＝過大評価の可能性）";
        $("sh-memo").innerHTML =
          `<b>実務メモ</b><br>推奨締め代：${delta_min != null ? `<b>${delta_min.toFixed(3)} 〜 ${delta_max.toFixed(3)} mm</b>` : `上限 <b>${delta_max.toFixed(3)} mm</b>（下限は伝達トルクを入れると出る）`}（降伏 S = ${safety}、すべり S = ${Sslip}）<br>軸の冷却収縮量${lowNote}：液体窒素（−196℃）<b>${LN2.toFixed(3)} mm</b>／ドライアイス（−78℃）<b>${DRY.toFixed(3)} mm</b><br>両側温調（穴加熱＋軸冷却）は必要温度差が小さく済み、歪み・焼戻しリスクを低減できる。<br><span style="color:var(--muted)">※厚肉円筒（ラメの式）・平面応力・ν=0.3。表面のならし（Rz の和の約0.8倍だけ有効締め代が減る）、遠心力、運転温度での締め代変化は含まない。キー併用・段付きの場合は別途検討。</span>`;
      }
