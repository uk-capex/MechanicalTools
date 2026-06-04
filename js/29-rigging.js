    function wireFilter() {
      const 構成 = document.getElementById('wire-構成').value;
      const d    = parseFloat(document.getElementById('wire-calc-d').value) || null;
      let rows = WIRE_DATA;
      if (構成 !== 'all') rows = rows.filter(r => r.構成 === 構成);
      if (d !== null)     rows = rows.filter(r => r.d === d);
      document.getElementById('wire-count').textContent = `${rows.length} 件`;
      const SF = 6;
      document.getElementById('wire-tbody').innerHTML = rows.map(r => {
        const wll_kN  = r.Fb / SF;
        const wll_tf  = wll_kN / 9.807;
        const wll_kgf = Math.round(wll_tf * 1000);
        const fb_tf   = r.Fb / 9.807;
        return `<tr>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${r.構成}</td>
          <td style="color:var(--accent);font-weight:700;font-family:'JetBrains Mono',monospace;">φ${r.d}</td>
          <td>${r.A}</td>
          <td style="font-family:'JetBrains Mono',monospace;">${r.Fb.toFixed(1)}</td>
          <td style="font-family:'JetBrains Mono',monospace;color:var(--muted);">${fb_tf.toFixed(2)}</td>
          <td style="font-family:'JetBrains Mono',monospace;color:var(--good);">${wll_kN.toFixed(2)}</td>
          <td style="font-family:'JetBrains Mono',monospace;color:var(--good);">${wll_tf.toFixed(3)}</td>
          <td style="font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:700;">${wll_kgf.toLocaleString()}</td>
          <td>${r.kg}</td>
          <td style="font-size:11px;color:var(--muted);">${r.note}</td>
        </tr>`;
      }).join('');
      wireAngleCalc();
    }

    function wireFilterByD() { wireFilter(); }

    function wireQuickCalc() {
      const d = parseFloat(document.getElementById('wire-calc-d').value) || 0;
      wireFilter();
      if (!d) { document.getElementById('wire-quick-result').innerHTML = ''; return; }
      const d2 = d * d;
      const formulas = [
        { label:'6×7',  α:16 },
        { label:'6×19', α:17 },
        { label:'6×37', α:18 },
      ];
      const SF = 6;
      const quick_kgf  = Math.round(d2 / 100 * 1000);
      const half_kgf   = Math.round(quick_kgf / 2);

      let html = `<div style="margin-bottom:5px;color:var(--ink);font-weight:700;">d=${d}mm　d²=${d2}</div>`;
      html += `<div style="font-size:10px;color:var(--muted);margin-bottom:4px;">── 構成別 簡易計算式（SF=${SF}）──</div>`;
      formulas.forEach(f => {
        const wll_kgf = Math.round(d2 / f.α / SF * 1000);
        html += `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;">
          <span style="color:var(--muted);font-size:10px;">${f.label}　d²÷${f.α}÷${SF}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--good);">${wll_kgf.toLocaleString()}kgf</span>
        </div>`;
      });
      html += `<hr style="border:none;border-top:1px solid var(--border);margin:5px 0;">
        <div style="font-size:10px;color:var(--muted);margin-bottom:3px;">── 現場概算（型番不明時）──</div>
        <div style="font-size:10px;color:var(--muted);margin-bottom:4px;">最保守（6×37 SF=6）≒d²÷108 → きりよく<b style="color:var(--ink);">d²÷100</b></div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;">
          <span style="font-size:10px;color:var(--muted);">d²÷100（使用荷重概算）</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--warn);">${quick_kgf.toLocaleString()}kgf</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:10px;color:var(--muted);">d²÷100÷2（余裕をみた目安）</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--good);">${half_kgf.toLocaleString()}kgf</span>
        </div>
        <div style="font-size:10px;color:var(--muted);margin-top:4px;line-height:1.5;">型番不明でもd²÷100の半分以下なら安全側の根拠になる。</div>`;
      document.getElementById('wire-quick-result').innerHTML = html;
    }

    function wireAngleCalc() {
      const θ     = parseFloat(document.getElementById('wire-angle').value);
      const n     = parseFloat(document.getElementById('wire-points').value);
      const W_kgf = parseFloat(document.getElementById('wire-load').value) || 0;
      const W_kN  = W_kgf * 9.807 / 1000;
      const SF = 6;
      if (θ === 0) {
        document.getElementById('wire-req-load').textContent = '∞';
        document.getElementById('wire-req-unit').textContent = '水平吊りは不可';
        return;
      }
      const rad    = θ * Math.PI / 180;
      const T_kN   = W_kN / (n * Math.sin(rad));
      const T_kgf  = Math.ceil(T_kN * 1000 / 9.807);
      const fb_kgf = Math.ceil(T_kgf * SF);
      document.getElementById('wire-req-load').textContent = `${T_kgf.toLocaleString()} kgf`;
      document.getElementById('wire-req-unit').innerHTML =
        `= ${(T_kgf/1000).toFixed(3)} tf = ${T_kN.toFixed(2)} kN / 本<br>` +
        `<span style="color:var(--warn);">必要破断荷重: ${fb_kgf.toLocaleString()} kgf 以上</span>`;
    }

    function eyeboltFilter() {
      const type  = document.getElementById('eb-type').value;
      const query = document.getElementById('eb-search').value.trim().toUpperCase();
      let rows = EYEBOLT_DATA;
      if (type !== 'all') rows = rows.filter(r => r.type === type);
      if (query) rows = rows.filter(r => r.size.toUpperCase().includes(query));
      document.getElementById('eb-count').textContent = `${rows.length} 件`;
      document.getElementById('eb-tbody').innerHTML = rows.map(r => {
        const typeLabel = r.type === 'SWIVEL' ? 'スイベル' : 'JIS B 1168';
        const nc = r.type === 'SWIVEL' ? 'var(--good)' : 'var(--muted)';
        const v_kgf   = Math.round(r.v   * 1000 / 9.807);
        const a60_kgf = Math.round(r.a60 * 1000 / 9.807);
        const a45_kgf = Math.round(r.a45 * 1000 / 9.807);
        return `<tr>
          <td style="font-size:11px;color:${nc};">${typeLabel}</td>
          <td style="color:var(--accent);font-weight:700;font-family:'JetBrains Mono',monospace;">${r.size}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${r.v.toFixed(2)}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--good);">${v_kgf.toLocaleString()}</td>
          <td style="font-family:'JetBrains Mono',monospace;">${a60_kgf.toLocaleString()}</td>
          <td style="font-family:'JetBrains Mono',monospace;">${a45_kgf.toLocaleString()}</td>
          <td>${r.kg}</td>
          <td style="font-size:11px;color:var(--muted);">${r.note}</td>
        </tr>`;
      }).join('');
      eyeboltReverse();
    }

    function eyeboltReverse() {
      const req_kgf = parseFloat(document.getElementById('eb-req').value) || 0;
      const req_kN  = req_kgf * 9.807 / 1000;
      const hit = EYEBOLT_DATA.find(r => r.v >= req_kN);
      document.getElementById('eb-rec-size').textContent = hit ? hit.size : '範囲超';
    }

    function shackleFilter() {
      const shape  = document.getElementById('sh-type').value;
      const minKgf = parseFloat(document.getElementById('sh-search-wll').value) || 0;
      const minWLL = minKgf * 9.807 / 1000;
      let rows = SHACKLE_DATA;
      if (shape !== 'all') rows = rows.filter(r => r.shape === shape);
      if (minKgf > 0) rows = rows.filter(r => r.wll >= minWLL);
      document.getElementById('sh-count').textContent = rows.length + ' 件';
      const tbody = document.getElementById('shackle-tbody');
      tbody.innerHTML = '';
      rows.forEach(r => {
        const shapeLabel = r.shape === 'bow' ? 'ボウ型' : 'Dee型';
        const kgf = Math.round(r.wll * 1000 / 9.807);
        const tf  = (r.wll / 9.807).toFixed(2);
        const tr  = document.createElement('tr');
        tr.innerHTML =
          `<td style="font-size:11px;">${shapeLabel}</td>` +
          `<td style="font-family:'JetBrains Mono',monospace;">${r.pin}</td>` +
          `<td style="font-family:'JetBrains Mono',monospace;">${r.nom}</td>` +
          `<td style="font-family:'JetBrains Mono',monospace;">${r.wll.toFixed(1)}</td>` +
          `<td style="font-family:'JetBrains Mono',monospace;">${tf}</td>` +
          `<td style="font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:700;">${kgf.toLocaleString()}</td>` +
          `<td>${r.kg}</td>` +
          `<td style="font-size:11px;color:var(--muted);">${r.wire}</td>` +
          `<td style="font-size:11px;color:var(--muted);">${r.note}</td>`;
        tbody.appendChild(tr);
      });
    }

    /* ── 吊り点数・開き角の連動 ── */
    function rigPointsChanged() {
      const n = parseFloat(document.getElementById('rc-points').value);
      const angleEl = document.getElementById('rc-angle');
      if (n === 1) {
        // 1点吊り → 開き角0°に固定してdisabled
        angleEl.value = '0';
        angleEl.disabled = true;
        angleEl.style.opacity = '0.5';
      } else {
        // 2点/4点吊り → 現在0°なら60°に変更して有効化
        if (angleEl.value === '0') angleEl.value = '60';
        angleEl.disabled = false;
        angleEl.style.opacity = '1';
      }
      rigCalc();
    }

    function rigAngleChanged() {
      const θ = parseFloat(document.getElementById('rc-angle').value);
      const pointsEl = document.getElementById('rc-points');
      if (θ === 0) {
        // 0°選択 → 1点吊りに戻す・disabled
        pointsEl.value = '1';
        document.getElementById('rc-angle').disabled = true;
        document.getElementById('rc-angle').style.opacity = '0.5';
      }
      rigCalc();
    }

    /* ── 総合選定計算 ── */
    const RIG_ANGLE_FACTOR = {0:1.00, 30:1.04, 60:1.16, 90:1.41, 120:2.00};

    function rigCalc() {
      const W_kgf  = parseFloat(document.getElementById('rc-load').value)   || 0;
      const n      = parseFloat(document.getElementById('rc-points').value)  || 1;
      const θ      = parseFloat(document.getElementById('rc-angle').value);
      const factor = RIG_ANGLE_FACTOR[θ] || 1.0;
      const SF     = 6;

      // 1本あたり張力
      const T_kgf = W_kgf / n * factor;
      const T_tf  = T_kgf / 1000;
      const T_kN  = T_kgf * 9.807 / 1000;

      // 角度警告
      const angleWarn = θ >= 120
        ? `<span style="color:var(--bad);">⚠ 開き角120°は上限。超えると使用禁止。</span><br>`
        : θ >= 90
        ? `<span style="color:var(--warn);">⚠ 開き角90°以上は張力が大きい。注意。</span><br>`
        : '';

      document.getElementById('rc-tension-box').innerHTML = `
        ${angleWarn}
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
          <div><div style="color:var(--muted);font-size:10px;">荷重</div>
            <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:15px;color:var(--ink);">${W_kgf.toLocaleString()}<span style="font-size:10px;"> kgf</span></div></div>
          <div><div style="color:var(--muted);font-size:10px;">${n}点吊り・開き角${θ}°（×${factor}）</div>
            <div style="color:var(--muted);font-size:11px;">1本あたり張力</div></div>
          <div><div style="color:var(--muted);font-size:10px;">1本あたり</div>
            <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:15px;color:var(--accent);">${Math.ceil(T_kgf).toLocaleString()}<span style="font-size:10px;"> kgf</span></div></div>
        </div>`;

      // ── ワイヤー推奨 ──
      const needFb_kN = T_kN * SF;
      const wireHits = {};
      ['6×7','6×19','6×37'].forEach(k => {
        const hit = WIRE_DATA.filter(r => r.構成 === k && r.Fb >= needFb_kN);
        wireHits[k] = hit.length ? hit[0] : null;
      });
      let wireHtml = '';
      Object.entries(wireHits).forEach(([k, r]) => {
        if (r) {
          wireHtml += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="color:var(--muted);font-size:11px;">${k}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--good);">φ${r.d} mm 以上</span>
          </div>`;
        } else {
          wireHtml += `<div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span style="color:var(--muted);font-size:11px;">${k}</span>
            <span style="color:var(--bad);font-size:11px;">範囲超・要確認</span>
          </div>`;
        }
      });
      document.getElementById('rc-wire-result').innerHTML = wireHtml;

      // ── アイボルト推奨 ──
      const ebHit = EYEBOLT_DATA.find(r => r.v >= T_kN);
      document.getElementById('rc-eyebolt-result').innerHTML = ebHit
        ? `<div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="color:var(--muted);font-size:11px;">JIS B 1168</span>
            <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--good);">${ebHit.size} 以上</span>
           </div>
           <div style="font-size:10px;color:var(--muted);margin-top:4px;">垂直吊り換算：${Math.ceil(T_kgf).toLocaleString()} kgf 以上</div>`
        : `<span style="color:var(--bad);">範囲超・スイベルアイボルト等を検討</span>`;

      // ── シャックル推奨 ──
      const shHit = SHACKLE_DATA.find(r => r.wll >= T_kN);
      document.getElementById('rc-shackle-result').innerHTML = shHit
        ? `<div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="color:var(--muted);font-size:11px;">ボウ型 推奨</span>
            <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--good);">ピン径 ${shHit.pin} mm 以上</span>
           </div>
           <div style="font-size:10px;color:var(--muted);margin-top:4px;">WLL: ${Math.round(shHit.wll*1000/9.807).toLocaleString()} kgf 以上 / 適合ワイヤー: φ${shHit.wire} mm</div>`
        : `<span style="color:var(--bad);">範囲超・要確認</span>`;
    }

    /* ── 各タブへ条件反映 ── */
    function rigApplyToTabs() {
      const W_kgf = document.getElementById('rc-load').value;
      const θ     = parseFloat(document.getElementById('rc-angle').value);
      const n     = document.getElementById('rc-points').value;
      // 開き角→片側鉛直からの角度（wireAngleCalcはθ=片側角度で計算してるので変換不要）
      // ワイヤータブへ
      document.getElementById('wire-load').value   = W_kgf;
      document.getElementById('wire-points').value = n;
      // 開き角→鉛直片側角度（開き角の半分）に変換
      const halfAngle = θ / 2;
      const wireAngleMap = {0:90, 15:75, 30:60, 45:45, 60:30};
      // 近似: 鉛直からの角度 = 90 - 開き角/2
      const vAngle = 90 - halfAngle;
      // selectのoptionに最も近い値を選ぶ
      const wireAngleEl = document.getElementById('wire-angle');
      const opts = [...wireAngleEl.options].map(o => parseFloat(o.value));
      const closest = opts.reduce((a,b) => Math.abs(b-vAngle)<Math.abs(a-vAngle)?b:a);
      wireAngleEl.value = closest;
      wireAngleCalc();
      // 1本あたり張力(kgf) を計算
      const T_kgf_apply = Math.ceil(parseFloat(W_kgf) / parseFloat(n) * (RIG_ANGLE_FACTOR[θ]||1));
      // アイボルトタブへ（1点あたり必要安全荷重）
      document.getElementById('eb-req').value = T_kgf_apply;
      eyeboltReverse();
      // シャックルタブへ（1点あたり必要WLL）
      document.getElementById('sh-search-wll').value = T_kgf_apply;
      shackleFilter();
      alert('各タブへ反映しました。タブを切り替えて確認してください。');
    }

    function showRigTab(name, btn) {
      const wrap = document.getElementById('rig-stab-wrap');
      wrap.querySelectorAll('.stab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('#tab-rigging .stab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('stab-rig-' + name).classList.add('active');
      if (btn) btn.classList.add('active');
    }

                    
    /* ══════════════════════════════════════════
       🪨 アンカー選定
    ══════════════════════════════════════════ */
    /*
      ANC_DATA: [種別, ねじ径, 下穴径, 下穴深さ, 埋込長, 端距離最小, 間隔最小, トルク, 備考]
      許容荷重データ: [種別, ねじ径, 基準引張(kN), 基準せん断(kN), Fc補正係数]
    */

    const ANC_TYPE_INFO = {
      chem:   { label:'ケミカルアンカー（一般）', color:'var(--accent)',
                desc:'接着剤（エポキシ・ビニルエステル）をホールに充填しボルトを挿入。<br>高強度・既存躯体向き。硬化時間が必要。後施工アンカーで最高強度クラス。' },
      mu:     { label:'旭化成 MUアンカー（カプセル打込み型）', color:'#ff9966',
                desc:'エポキシアクリレート樹脂カプセルをハンマーで打込むだけで施工完了。<br>撹拌不要のためL字筋・U字筋も施工可。<br>' +
                     '<b style="color:var(--warn);">M16はカプセル長と全長が異なるため注意。</b><br>' +
                     'ボルト先端は寸切り or Vカット必須（片面カット・丸棒は不可）。<br>' +
                     '5℃以下：打込み後すぐボルトを5回転以上回すこと。<br>' +
                     '-5℃以下は使用禁止。製品保存期限：製造から3年。' },
      'all-anc':{ label:'オールアンカー', color:'var(--good)',
                desc:'先端が拡張して噛み合う拡張式。施工簡単・即荷重OK。<br>貫通孔不可。引張より振動・衝撃に弱い。小〜中型設備の固定に多用。' },
      wedge:  { label:'ウェッジアンカー', color:'var(--warn)',
                desc:'打ち込み型拡張式。先端くさびが広がり固定。<br>施工スピード重視。大きな引張力に対応。重量物アンカーに使用。' },
      female: { label:'メスネジアンカー（ドロップイン）', color:'#a0c4ff',
                desc:'穴の中にめねじが残る埋め込み式。ボルトを完全に取り外し可能。<br>専用セッティングツールが必要。見た目スッキリ。設備基礎に多用。' },
    };

    // [種別, ねじ径, 下穴径, 下穴深さ, 埋込長, 端距離最小, 間隔最小, トルク(Nm), 備考]
    const ANC_DATA = [
      // ── ケミカルアンカー（一般標準値）──
      ['chem','M6',  8,  55, 50, 60, 75,  5,  'エポキシ系標準埋込長'],
      ['chem','M8',  10, 70, 65, 80, 100, 10, ''],
      ['chem','M10', 12, 85, 80, 100,125, 20, ''],
      ['chem','M12', 14, 110,100,120,150, 35, '★最多使用サイズ'],
      ['chem','M16', 19, 130,125,150,188, 80, 'φ18〜19（メーカー差あり・要確認）'],
      ['chem','M20', 24, 165,155,186,233, 150,''],
      ['chem','M22', 25, 175,165,198,248, 200,''],
      ['chem','M24', 28, 200,190,228,285, 250,'重量機器基礎'],
      ['chem','M30', 33, 250,240,288,360, 400,'大型設備・鉄骨柱脚'],
      // ── 旭化成 ARケミカルセッター MUアンカー（カプセル打込み型）──
      ['mu',  'M8',  10, 70, 65, 78, 100, 10, 'MU-8 / 打込み型・撹拌不要'],
      ['mu',  'M10', 12, 90, 80, 96, 120, 20, 'MU-10 / L字・U字筋も施工可'],
      ['mu',  'M12', 14, 110,100,120,150, 35, 'MU-12 / ★最多使用サイズ'],
      ['mu',  'M16', 19, 130,125,150,188, 80, 'MU-16 / φ19確定。カプセル長と全長が異なる点に注意'],
      ['mu',  'M20', 22, 170,155,186,233, 150,'MU-20 / 重量機器・鉄骨柱脚'],
      // ── オールアンカー ──
      ['all-anc','M6',  8,  35, 30, 40, 50,  5,  ''],
      ['all-anc','M8',  10, 45, 40, 50, 65,  10, ''],
      ['all-anc','M10', 12, 55, 50, 65, 80,  20, ''],
      ['all-anc','M12', 14, 65, 60, 75, 95,  35, '★最多使用サイズ'],
      ['all-anc','M16', 18, 80, 75, 95, 120, 80, ''],
      ['all-anc','M20', 22, 100,95, 115,150, 150,''],
      ['all-anc','M24', 28, 120,115,138,180, 250,''],
      ['all-anc','M30', 33, 150,145,174,225, 400,''],
      // ── ウェッジアンカー ──
      ['wedge','M8',  10, 70, 60, 80, 100, 20, '打ち込み型'],
      ['wedge','M10', 12, 80, 70, 95, 120, 35, ''],
      ['wedge','M12', 14, 95, 80, 110,140, 60, '★重量物固定の主力'],
      ['wedge','M16', 18, 120,105,140,175, 120,''],
      ['wedge','M20', 22, 145,130,170,215, 230,''],
      ['wedge','M24', 28, 170,155,200,255, 400,'大型重量物'],
      ['wedge','M30', 33, 210,195,250,318, 600,''],
      // ── メスネジアンカー（ドロップイン） ──
      ['female','M6',  10, 25, 22, 35, 45,  null,'専用ツール必要'],
      ['female','M8',  12, 30, 27, 40, 55,  null,''],
      ['female','M10', 15, 35, 32, 50, 65,  null,''],
      ['female','M12', 18, 42, 38, 60, 80,  null,'★最多使用サイズ'],
      ['female','M16', 22, 50, 46, 75, 100, null,''],
      ['female','M20', 28, 60, 55, 90, 120, null,'設備基礎・機械固定'],
      ['female','M24', 33, 72, 67, 110,145, null,''],
    ];

    // 許容荷重データ [種別, ねじ径, 許容引張(kN/Fc21基準), 許容せん断(kN/Fc21基準)]
    const ANC_ALLOW = {
      chem: {
        M6: [3.2, 2.1], M8: [6.5, 4.0], M10: [10.5, 6.5], M12: [16.0, 10.0],
        M16: [28.0, 17.5], M20: [45.0, 28.0], M22: [54.0, 33.5], M24: [63.0, 39.0], M30: [98.0, 61.0],
      },
      mu: {
        M8: [6.5, 4.0], M10: [10.5, 6.5], M12: [16.0, 10.0],
        M16: [28.0, 17.5], M20: [45.0, 28.0],
      },
      'all-anc': {
        M6: [2.0, 1.5], M8: [4.0, 3.0], M10: [6.5, 5.0], M12: [10.0, 7.5],
        M16: [18.0, 13.5], M20: [28.0, 21.0], M24: [40.0, 30.0], M30: [63.0, 47.0],
      },
      wedge: {
        M8: [5.0, 3.8], M10: [8.0, 6.0], M12: [12.5, 9.5],
        M16: [22.0, 16.5], M20: [35.0, 26.0], M24: [50.0, 37.5], M30: [78.0, 58.5],
      },
      female: {
        M6: [2.5, 1.8], M8: [5.0, 3.5], M10: [8.0, 5.5], M12: [12.0, 8.5],
        M16: [22.0, 15.5], M20: [34.0, 24.0], M24: [48.0, 34.0],
      },
    };

    // Fc補正係数（Fc21基準=1.0）
    const FC_FACTOR = {18:0.85, 21:1.00, 24:1.12, 27:1.22, 30:1.32};

    const ANC_TYPE_LABEL = {
      chem:'ケミカル（一般）', mu:'旭化成MU', 'all-anc':'オールアンカー', wedge:'ウェッジ', female:'メスネジ'
    };
    const ANC_TYPE_COLOR = {
      chem:'var(--accent)', mu:'#ff9966', 'all-anc':'var(--good)', wedge:'var(--warn)', female:'#a0c4ff'
    };
