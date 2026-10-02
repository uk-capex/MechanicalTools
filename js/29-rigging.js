    /* ══════════════════════════════════════════
       🪝 吊り具選定（2026-09 ファクトチェック改修）
       ・4点吊りは3本で負担する前提（荷の傾き・長さ誤差で均等に掛からないため）
    ══════════════════════════════════════════ */
    const G_ACC = 9.80665;
    const kgf2kN = kgf => kgf * G_ACC / 1000;
    const kN2kgf = kN  => kN * 1000 / G_ACC;
    const rigEffLegs = n => (n >= 4 ? 3 : n);
    const RIG_SF_WIRE = 6;   // クレーン等安全規則 第213条

    // 破断力 ≒ K × d² の係数（kN/mm²、JIS G 3525 A種の表値から算出）
    const WIRE_K = { '6×7':0.595, '6×19':0.540, '6×24':0.493, '6×37':0.531 };

    function wireFilter() {
      const 構成 = document.getElementById('wire-構成').value;
      const d    = parseFloat(document.getElementById('wire-calc-d').value) || null;
      let rows = WIRE_DATA;
      if (構成 !== 'all') rows = rows.filter(r => r.構成 === 構成);
      if (d !== null && rows.some(r => r.d === d)) rows = rows.filter(r => r.d === d);
      document.getElementById('wire-count').textContent = `${rows.length} 件`;
      document.getElementById('wire-tbody').innerHTML = rows.map(r => {
        const wll_kN  = r.Fb / RIG_SF_WIRE;
        const wll_tf  = wll_kN / G_ACC;
        const wll_kgf = Math.round(kN2kgf(wll_kN));
        const fb_tf   = r.Fb / G_ACC;
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
      const box = document.getElementById('wire-quick-result');
      if (!d) { box.innerHTML = ''; return; }
      const d2 = d * d;
      let html = `<div style="margin-bottom:5px;color:var(--ink);font-weight:700;">d=${d}mm　d²=${d2}</div>`;
      html += `<div style="font-size:10px;color:var(--muted);margin-bottom:4px;">── 構成別 使用荷重（A種・SF=${RIG_SF_WIRE}）──</div>`;
      ['6×24','6×19','6×37','6×7'].forEach(k => {
        const hit = WIRE_DATA.find(r => r.構成 === k && r.d === d);
        const fb  = hit ? hit.Fb : WIRE_K[k] * d2;
        const wll = Math.round(kN2kgf(fb / RIG_SF_WIRE));
        html += `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;">
          <span style="color:var(--muted);font-size:10px;">${k}　${hit ? 'JIS表値' : '概算 ' + WIRE_K[k] + '×d²'}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--good);">${wll.toLocaleString()}kgf</span>
        </div>`;
      });
      const quick_kgf = Math.round(d2 / 120 * 1000);
      html += `<hr style="border:none;border-top:1px solid var(--border);margin:5px 0;">
        <div style="font-size:10px;color:var(--muted);margin-bottom:3px;">── 現場概算（構成不明時）──</div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:10px;color:var(--muted);">d²÷120（t）</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--warn);">${quick_kgf.toLocaleString()}kgf</span>
        </div>
        <div style="font-size:10px;color:var(--muted);margin-top:4px;line-height:1.5;">6×24 A種（一番弱い構成）をSF6で見た値。<br>※旧版の d²÷100 は約2割甘かったため変更。</div>`;
      box.innerHTML = html;
    }

    function wireAngleCalc() {
      const θ     = parseFloat(document.getElementById('wire-angle').value);   // 水平からの角度
      const n     = parseFloat(document.getElementById('wire-points').value);
      const W_kgf = parseFloat(document.getElementById('wire-load').value) || 0;
      if (θ === 0) {
        document.getElementById('wire-req-load').textContent = '∞';
        document.getElementById('wire-req-unit').textContent = '水平吊りは不可';
        return;
      }
      const nEff   = rigEffLegs(n);
      const T_kgf  = Math.ceil(W_kgf / (nEff * Math.sin(θ * Math.PI / 180)));
      const T_kN   = kgf2kN(T_kgf);
      const fb_kgf = Math.ceil(T_kgf * RIG_SF_WIRE);
      document.getElementById('wire-req-load').textContent = `${T_kgf.toLocaleString()} kgf`;
      document.getElementById('wire-req-unit').innerHTML =
        `= ${(T_kgf/1000).toFixed(3)} tf = ${T_kN.toFixed(2)} kN / 本` +
        (n >= 4 ? `<br>※4点吊りは3本で負担として計算` : '') +
        `<br><span style="color:var(--warn);">必要破断荷重: ${fb_kgf.toLocaleString()} kgf 以上</span>`;
    }

    /* ── アイボルト ── */
    function eyeboltFilter() {
      const type  = document.getElementById('eb-type').value;
      const query = document.getElementById('eb-search').value.trim().toUpperCase();
      let rows = EYEBOLT_DATA;
      if (type !== 'all') rows = rows.filter(r => r.type === type);
      if (query) rows = rows.filter(r => r.size.toUpperCase().includes(query));
      document.getElementById('eb-count').textContent = `${rows.length} 件`;
      document.getElementById('eb-tbody').innerHTML = rows.map(r => {
        const isRUD = r.type === 'RUD';
        const v_kgf = Math.round(kN2kgf(r.v));
        const label = isRUD ? `RUD<br><span style="font-size:10px;">${r.model}</span>` : 'JIS B 1168';
        const nc    = isRUD ? 'var(--good)' : 'var(--muted)';
        const slant = isRUD
          ? `全方向 ${v_kgf.toLocaleString()} /個`
          : `2個45°で合計 ${v_kgf.toLocaleString()}`;
        return `<tr>
          <td style="font-size:11px;color:${nc};">${label}</td>
          <td style="color:var(--accent);font-weight:700;font-family:'JetBrains Mono',monospace;">${r.size}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${r.v.toFixed(2)}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--good);">${v_kgf.toLocaleString()}</td>
          <td style="font-size:11px;">${slant}</td>
          <td>${r.kg}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${isRUD ? r.torque : '—'}</td>
          <td style="font-size:11px;color:var(--muted);">${r.note}</td>
        </tr>`;
      }).join('');
      eyeboltReverse();
    }

    function eyeboltReverse() {
      const req_kN = kgf2kN(parseFloat(document.getElementById('eb-req').value) || 0);
      const jis = EYEBOLT_DATA.find(r => r.type === 'JIS' && r.v >= req_kN);
      const rud = EYEBOLT_DATA.find(r => r.type === 'RUD' && r.v >= req_kN);
      document.getElementById('eb-rec-size').innerHTML =
        `<div style="font-size:14px;">JIS（垂直1個）: ${jis ? jis.size : '範囲超'}</div>` +
        `<div style="font-size:14px;color:var(--good);">RUD: ${rud ? rud.size + ' <span style="font-size:10px;">' + rud.model + '</span>' : '範囲超'}</div>`;
    }

    /* ── シャックル ── */
    function shackleFilter() {
      const minKgf = parseFloat(document.getElementById('sh-search-wll').value) || 0;
      const minWLL = kgf2kN(minKgf);
      let rows = SHACKLE_DATA;
      if (minKgf > 0) rows = rows.filter(r => r.wll >= minWLL);
      document.getElementById('sh-count').textContent = rows.length + ' 件';
      document.getElementById('shackle-tbody').innerHTML = rows.map(r => `<tr>
          <td style="font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:700;">${r.nom}</td>
          <td style="font-size:11px;">${r.form}</td>
          <td style="font-family:'JetBrains Mono',monospace;">${r.t}</td>
          <td style="font-family:'JetBrains Mono',monospace;">${r.wll.toFixed(1)}</td>
          <td style="font-family:'JetBrains Mono',monospace;color:var(--good);font-weight:700;">${Math.round(r.t * 1000).toLocaleString()}</td>
          <td style="font-size:11px;color:var(--muted);">等級M</td>
        </tr>`).join('');
    }

    /* ── 吊り点数・開き角の連動 ── */
    function rigPointsChanged() {
      const n = parseFloat(document.getElementById('rc-points').value);
      const angleEl = document.getElementById('rc-angle');
      if (n === 1) {
        angleEl.value = '0';
        angleEl.disabled = true;
        angleEl.style.opacity = '0.5';
      } else {
        if (angleEl.value === '0') angleEl.value = '60';
        angleEl.disabled = false;
        angleEl.style.opacity = '1';
      }
      rigCalc();
    }

    function rigAngleChanged() {
      const θ = parseFloat(document.getElementById('rc-angle').value) || 0;
      if (θ === 0) {
        document.getElementById('rc-points').value = '1';
        document.getElementById('rc-angle').disabled = true;
        document.getElementById('rc-angle').style.opacity = '0.5';
      }
      rigCalc();
    }

    /* ── 総合選定計算 ── */
    // 張力係数 = 1/cos(開き角/2)
    //  2026-10 開き角を手入力に。係数は 1/cos(θ/2) を小数2桁で切上げ（30°1.04・60°1.16・90°1.42 ※表の1.41は四捨五入）
    const rigAngleFactor = θ => θ > 0 ? Math.ceil(1 / Math.cos(θ / 2 * Math.PI / 180) * 100) / 100 : 1.0;
    // 開き角の判定：厚労省「玉掛け作業の安全に係るガイドライン」（つり角度は原則90°以内。吊り方により60°以内）
    function rigAngleNote(θ) {
      if (θ > 120) return `<span style="color:var(--bad);">✕ 開き角120°超（張力2倍超）は計算対象外。天秤（スプレッダ）で角度を小さくする</span><br>`;
      if (θ > 90)  return `<span style="color:var(--bad);">✕ ガイドラインの原則「つり角度90°以内」を超える。天秤の使用・吊り点の見直しを</span><br>`;
      if (θ > 60)  return `<span style="color:var(--warn);">⚠ 推奨の60°を超える（ガイドライン原則90°以内）。2本4点半掛け・あだ巻き等の吊り方は60°以内</span><br>`;
      return '';
    }

    function rigRow(label, value, color) {
      return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="color:var(--muted);font-size:11px;">${label}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${color};">${value}</span>
      </div>`;
    }

    function rigCalc() {
      const W_kgf  = parseFloat(document.getElementById('rc-load').value)   || 0;
      const n      = parseFloat(document.getElementById('rc-points').value)  || 1;
      const θ      = Math.max(0, parseFloat(document.getElementById('rc-angle').value) || 0);
      const factor = rigAngleFactor(θ);
      const nEff   = rigEffLegs(n);

      const T_kgf = W_kgf / nEff * factor;   // 1本あたり張力
      const T_kN  = kgf2kN(T_kgf);
      const W_kN  = kgf2kN(W_kgf);

      const angleWarn = rigAngleNote(θ);
      if (θ > 120) {
        document.getElementById('rc-tension-box').innerHTML = angleWarn;
        ['rc-wire-result','rc-eyebolt-result','rc-shackle-result'].forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = '—'; });
        return;
      }
      const legNote = n >= 4 ? `<div style="color:var(--muted);font-size:10px;margin-top:6px;">※4点吊りは3本で負担として計算（均等には掛からない前提）</div>` : '';

      document.getElementById('rc-tension-box').innerHTML = `
        ${angleWarn}
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
          <div><div style="color:var(--muted);font-size:10px;">荷重</div>
            <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:15px;color:var(--ink);">${W_kgf.toLocaleString()}<span style="font-size:10px;"> kgf</span></div></div>
          <div><div style="color:var(--muted);font-size:10px;">${n}点吊り・開き角${θ}°（×${factor}）</div>
            <div style="color:var(--muted);font-size:11px;">1本あたり張力</div></div>
          <div><div style="color:var(--muted);font-size:10px;">1本あたり</div>
            <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:15px;color:var(--accent);">${Math.ceil(T_kgf).toLocaleString()}<span style="font-size:10px;"> kgf</span></div></div>
        </div>${legNote}`;

      // ── ワイヤー（破断力 ≥ 張力×6） ──
      const needFb_kN = T_kN * RIG_SF_WIRE;
      let wireHtml = '';
      ['6×24','6×19','6×37','6×7'].forEach(k => {
        const r = WIRE_DATA.find(x => x.構成 === k && x.Fb >= needFb_kN);
        wireHtml += r
          ? rigRow(k + (k === '6×24' ? '（玉掛け汎用）' : ''), `φ${r.d} mm 以上`, 'var(--good)')
          : rigRow(k, '範囲超・要確認', 'var(--bad)');
      });
      document.getElementById('rc-wire-result').innerHTML = wireHtml;

      // ── アイボルト ──
      let ebHtml = '';
      // JIS B 1168：垂直1個 or 2個45°（開き角90°以内・合計値）。4点も2個で持つ前提で総重量判定
      if (n > 1 && θ > 90) {
        ebHtml += rigRow('JIS B 1168', '開き角90°超は使用不可', 'var(--bad)');
      } else {
        const jis = EYEBOLT_DATA.find(r => r.type === 'JIS' && r.v >= W_kN);
        ebHtml += jis
          ? rigRow('JIS B 1168', `${jis.size} 以上`, 'var(--good)')
          : rigRow('JIS B 1168', '範囲超', 'var(--bad)');
        if (n > 1) ebHtml += `<div style="font-size:10px;color:var(--muted);margin:-2px 0 6px;">総重量 ${W_kgf.toLocaleString()} kgf で判定（JISの45度づりは2個合計値）。座ぐりで座面密着・リングを同一平面に揃えること</div>`;
      }
      // RUD VLBG-PLUS：カタログの吊り方係数で判定
      const f = rudLoadFactor(n, θ / 2);
      if (f === 0) {
        ebHtml += rigRow('RUD VLBG-PLUS', '傾斜60°超は範囲外', 'var(--bad)');
      } else {
        const needT = W_kgf / 1000 / f;
        const rud = EYEBOLT_DATA.find(r => r.type === 'RUD' && r.t >= needT);
        ebHtml += rud
          ? rigRow('RUD VLBG-PLUS', `${rud.size}（${rud.t}t）以上`, 'var(--good)')
          : rigRow('RUD VLBG-PLUS', '範囲超', 'var(--bad)');
        ebHtml += `<div style="font-size:10px;color:var(--muted);margin-top:-2px;">吊り方係数 ×${f}（カタログ値）・締付トルク厳守</div>`;
      }
      document.getElementById('rc-eyebolt-result').innerHTML = ebHtml;

      // ── シャックル（1本あたり張力 ≤ 使用荷重） ──
      const sh = SHACKLE_DATA.find(r => r.wll >= T_kN);
      document.getElementById('rc-shackle-result').innerHTML = sh
        ? rigRow('JIS B 2801 等級M', `呼び ${sh.nom} 以上（${sh.t}t）`, 'var(--good)') +
          `<div style="font-size:10px;color:var(--muted);">呼び＝本体径（ピン径ではない）・${sh.form}</div>`
        : rigRow('JIS B 2801 等級M', '範囲超・要確認', 'var(--bad)');
    }

    /* ── 各タブへ条件反映 ── */
    function rigApplyToTabs() {
      const W_kgf = parseFloat(document.getElementById('rc-load').value) || 0;
      const θ     = parseFloat(document.getElementById('rc-angle').value);
      const n     = parseFloat(document.getElementById('rc-points').value);
      // ワイヤータブ：角度は「水平から」。開き角θ → 90 − θ/2。丸めは安全側（小さい角度）へ
      document.getElementById('wire-load').value   = W_kgf;
      document.getElementById('wire-points').value = n;
      const hAngle = 90 - θ / 2;
      const wireAngleEl = document.getElementById('wire-angle');
      const opts = [...wireAngleEl.options].map(o => parseFloat(o.value)).filter(v => v > 0 && v <= hAngle + 1e-9);
      wireAngleEl.value = String(Math.max(...opts));
      wireAngleCalc();
      // 1本あたり張力
      const T_kgf = Math.ceil(W_kgf / rigEffLegs(n) * rigAngleFactor(θ));
      document.getElementById('eb-req').value = T_kgf;
      eyeboltReverse();
      document.getElementById('sh-search-wll').value = T_kgf;
      shackleFilter();
      alert('各タブへ反映しました（1本あたり張力 ' + T_kgf.toLocaleString() + ' kgf）。\n※JISアイボルトの多点吊りは総合選定タブの判定（総重量基準）を見てください。');
    }

    function showRigTab(name, btn) {
      const wrap = document.getElementById('rig-stab-wrap');
      wrap.querySelectorAll('.stab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('#tab-rigging .stab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('stab-rig-' + name).classList.add('active');
      if (btn) btn.classList.add('active');
    }

                    
    /* ══════════════════════════════════════════
       🪨 アンカー選定（2026-09 ファクトチェック改修：メーカー値に差替え）
       ・旭化成 ARケミカルセッター AP / MU … 出典: サンコーテクノ製品ページ（AP）、JCAA認証資料・販売店資料（MU）
         許容引張荷重はメーカー算定値（Fc21、Mねじ SS400）。せん断はカタログ記載なし
       ・サンコーテクノ オールアンカー Cタイプ … 出典: サンコーテクノ製品ページ
         カタログは「最大荷重」のみ（許容値ではない）→ 本ツールでは 長期=最大÷3、短期=長期×2 と仮定
       ・サンコーテクノ トルコンアンカー TCW（ウェッジ式）／グリップアンカー GA（メスネジ・本体打込み式）… 出典: サンコーテクノ製品ページ（2026-09照合）
         どちらもカタログは「最大荷重」のみ → オールアンカーと同じく 長期=最大÷3 のツール仮定。GAはせん断記載なし
       ・MU：旭化成 MUアンカー カタログ（16.10.0C.V14）で照合。M10以上の許容値は異形棒鋼の付着破壊モード算定値のため、
         Mねじボルト使用時は AP（Mねじ SS400 算定）の値と小さい方を採用
    ══════════════════════════════════════════ */
    const ANC_TYPE_INFO = {
      ap:     { label:'旭化成 ARケミカルセッター AP（回転・打撃型）', color:'var(--accent)',
                desc:'ガラス管カプセルを穿孔に入れ、ボルトを回転・打撃で挿入して撹拌。<br>エポキシアクリレート樹脂。耐アルカリ性・初期剛性が高い。<br>' +
                     '硬化時間（気中）目安：0℃ 60分／10℃ 25分／20℃ 15分／30℃ 10分。硬化前は動かさない。<br>使用期限：製造から3年。' },
      mu:     { label:'旭化成 ARケミカルセッター MU（打込み型）', color:'#ff9966',
                desc:'カプセルをハンマーで打込むだけで施工完了。撹拌不要のためL字筋・U字筋も施工可。<br>' +
                     'ボルト先端は寸切り or Vカット（片面カット・丸棒は不可）。<br>' +
                     '<b style="color:var(--warn);">APと穿孔径・深さが違う（例：M12はAP φ14.5×100、MU φ15×110）。異形棒鋼は穿孔径が変わる（D10 φ12.5／D13 φ16／D16 φ20）。</b><br>' +
                     '硬化時間（最大強度の約80%まで）：−5℃ 360分／0℃ 180分／5℃ 120分／10℃ 70分／15℃ 45分／20℃ 30分／25℃ 25分／30℃ 20分。<br>' +
                     '5℃以下は打込み後すぐボルトを5回転以上回す。−5℃未満は使用不可。水中不可（水を除いた湿孔はOK）。MU-8は1.0kg程度のハンマーで（曲がりやすい）。' },
      'all-anc':{ label:'サンコーテクノ オールアンカー Cタイプ（芯棒打込み式）', color:'var(--good)',
                desc:'芯棒を打込んで拡張させる。施工簡単・即荷重OK。取付物の上から施工可。<br>' +
                     '<b style="color:var(--warn);">穿孔径はアンカー外径とほぼ同じ（M12→φ12.7）。</b><br>' +
                     'カタログ値は最大荷重のみ。許容はツール仮定（最大÷3）。' },
      wedge:  { label:'サンコーテクノ トルコンアンカー TCW（ウェッジ式）', color:'var(--warn)',
                desc:'ナットを締めるとスリーブが開いて固着。本体径＝ねじ径で、取付物の上から穿孔・施工できる。<br>' +
                     '<b style="color:var(--warn);">穿孔径＝ねじ径（M12→φ12.0）。穿孔深さは「全長−取付物厚」（表は最短品番の値）。</b><br>' +
                     'ねじ部のラインマークがナット上に出たら施工不良→打ち直し。<br>' +
                     'M12 は TCW-1290 以上（有効埋込50）の値。TCW-1280（有効埋込45）は最大引張 18.2kN と低い。<br>' +
                     'カタログ値は最大荷重のみ。許容はツール仮定（最大÷3）。' },
      female: { label:'サンコーテクノ グリップアンカー GA（メスネジ・本体打込み式）', color:'#a0c4ff',
                desc:'本体を打込み専用ホルダーでコーンを押し込んで拡張。設備撤去後もアンカーが邪魔にならない。<br>' +
                     '<b style="color:var(--warn);">穿孔径はアンカー外径より大きい（M10→φ14.5、M12→φ18.0）。ねじ径の下穴では入らない。</b><br>' +
                     '表は標準長さ。M10/M12 のショート（GA-10MS/12MS、埋込30/40）は最大引張 10.8/17.6kN と低い。<br>' +
                     'カタログは最大引張荷重のみ（せん断記載なし）。許容はツール仮定（最大÷3）。' },
    };

    // [種別, ねじ径, 下穴径, 下穴深さ, 埋込長, 端距離最小, 間隔最小, トルク(Nm), 備考]
    // 端距離・間隔は下の ANC_SPACING で埋込長から自動設定（推奨値）
    const ANC_DATA = [
      // ── 旭化成 ARケミカルセッター AP（標準） ──
      ['ap','M8',  9.0,  70, 70, null,null,null,'AP-8'],
      ['ap','M10', 12.0, 90, 90, null,null,null,'AP-10'],
      ['ap','M12', 14.5, 100,100,null,null,null,'AP-12'],
      ['ap','M16', 19.0, 130,130,null,null,null,'AP-16'],
      ['ap','M20', 24.0, 200,200,null,null,null,'AP-20（短い AP-2016 は深さ160）'],
      ['ap','M22', 28.0, 250,250,null,null,null,'AP-22'],
      ['ap','M24', 32.0, 300,300,null,null,null,'AP-24'],
      ['ap','M30', 40.0, 350,350,null,null,null,'AP-30'],
      ['ap','M36', 48.0, 400,400,null,null,null,'AP-36'],
      // ── 旭化成 ARケミカルセッター MU（打込み型） ──
      ['mu','M8',  9.5,  70, 70, null,null,null,'MU-8'],
      ['mu','M10', 12.0, 90, 90, null,null,null,'MU-10'],
      ['mu','M12', 15.0, 110,110,null,null,null,'MU-12'],
      ['mu','M16', 19.0, 140,140,null,null,null,'MU-16（カプセル長120／穿孔深さ140）'],
      ['mu','M20', 23.0, 170,170,null,null,null,'MU-20'],
      // ── サンコーテクノ オールアンカー Cタイプ（標準埋込み） ──
      ['all-anc','M6',  6.4,  36, 30, null,null,4,  'C-660 ほか'],
      ['all-anc','M8',  8.5,  43, 35, null,null,9,  'C-850 ほか（C-840は埋込25）'],
      ['all-anc','M10', 10.5, 50, 40, null,null,18, 'C-1060 ほか（C-1050は埋込30）'],
      ['all-anc','M12', 12.7, 62, 50, null,null,31, 'C-1270 ほか（C-1260は埋込40）'],
      ['all-anc','M16', 17.0, 76, 60, null,null,80, 'C-1610 ほか（C-1680は埋込50）'],
      ['all-anc','M20', 21.5, 100,80, null,null,150,'C-2013 ほか（C-2010は埋込60）'],
      // ── サンコーテクノ トルコンアンカー TCW（下穴深さ＝最短品番の全長−最大取付物厚、埋込長＝有効埋込み長さ） ──
      ['wedge','M6',  6.0,  50, 30, null,null,5,  'TCW-655 ほか'],
      ['wedge','M8',  8.0,  55, 35, null,null,15, 'TCW-860 ほか'],
      ['wedge','M10', 10.0, 65, 40, null,null,30, 'TCW-1070 ほか'],
      ['wedge','M12', 12.0, 80, 50, null,null,50, 'TCW-1290 ほか（TCW-1280は有効埋込45）'],
      ['wedge','M16', 16.0, 105,64, null,null,100,'TCW-1612 ほか'],
      // ── サンコーテクノ グリップアンカー GA（標準長さ） ──
      ['female','M6',  11.0, 33, 30, null,null,4,  'GA-6M'],
      ['female','M8',  12.5, 39, 35, null,null,9,  'GA-8M'],
      ['female','M10', 14.5, 45, 40, null,null,18, 'GA-10M（ショートGA-10MSは埋込30）'],
      ['female','M12', 18.0, 56, 50, null,null,31, 'GA-12M（ショートGA-12MSは埋込40）'],
      ['female','M16', 22.0, 68, 60, null,null,80, 'GA-16M'],
      ['female','M20', 26.0, 90, 80, null,null,150,'GA-20M'],
      ['female','M22', 29.0, 105,90, null,null,200,'GA-22M'],
      ['female','M24', 33.0, 127,110,null,null,260,'GA-24M'],
    ];

    // ── へりあき・間隔（推奨値）2026-09 ──
    //  サンコーテクノ総合カタログの施工上の目安：接着系 ピッチ≧埋込み×2・へりあき≧埋込み×1、金属系 ピッチ≧埋込み×3.5・へりあき≧埋込み×2
    //  旭化成FAQ：へりあきは最低でも50mm確保（0.5L以下は強度計算で確認のうえ可）
    //  いずれも「強度低下・ひび割れを避けるための望ましい距離」。これ未満はせん断のへりあき計算（qa3）等で確認
    const ANC_SPACING = { ap:[1,2], mu:[1,2], 'all-anc':[2,3.5], wedge:[2,3.5], female:[2,3.5] };
    ANC_DATA.forEach(r => {
      const k = ANC_SPACING[r[0]]; if (!k) return;
      if (r[5] == null) r[5] = Math.max(Math.ceil(r[4] * k[0]), r[0] === 'ap' || r[0] === 'mu' ? 50 : 0);
      if (r[6] == null) r[6] = Math.ceil(r[4] * k[1]);
    });

    // 強度データ（kN, Fc21）
    //  Nl/Ns: 許容引張 長期/短期、Ql/Qs: 許容せん断 長期/短期（null＝記載なし）
    //  Nmax/Qmax: 最大荷重（オールアンカーのみ・カタログ値）
    const ANC_MAX_SF = 3;  // 金属系（オールアンカー・トルコン・グリップ）：最大荷重→長期許容 の仮定安全率
    function ancFromMax(n, q) {
      return { Nmax:n, Qmax:q,
        Nl:+(n/ANC_MAX_SF).toFixed(2), Ns:+(n/ANC_MAX_SF*2).toFixed(2),
        Ql: q != null ? +(q/ANC_MAX_SF).toFixed(2) : null, Qs: q != null ? +(q/ANC_MAX_SF*2).toFixed(2) : null };
    }
    const ANC_STRENGTH = {
      ap: {
        M8:{Nl:5.9,Ns:8.9}, M10:{Nl:9.4,Ns:14.2}, M12:{Nl:13.7,Ns:20.6}, M16:{Nl:25.4,Ns:38.1},
        M20:{Nl:38.3,Ns:57.5}, M22:{Nl:47.4,Ns:71.2}, M24:{Nl:55.3,Ns:82.9}, M30:{Nl:87.8,Ns:131.8}, M36:{Nl:119.4,Ns:179.1},
      },
      mu: {
        // カタログ（付着破壊）と AP（Mねじ SS400）の小さい方。M20 はカタログ 36.5/54.7 が支配（旧値 38.3/57.5 は過大だった）
        M8:{Nl:5.9,Ns:8.9}, M10:{Nl:9.4,Ns:14.2}, M12:{Nl:13.7,Ns:20.6}, M16:{Nl:25.3,Ns:38.0}, M20:{Nl:36.5,Ns:54.7},
      },
      'all-anc': Object.fromEntries(Object.entries({
        M6:[3.9,6.3], M8:[6.5,10.1], M10:[10.2,16.0], M12:[17.1,23.3], M16:[29.9,47.9], M20:[41.4,73.6],
      }).map(([k,[n,q]]) => [k, ancFromMax(n,q)])),
      // トルコンアンカー TCW（最大荷重 引張/せん断、Fc21）
      wedge: Object.fromEntries(Object.entries({
        M6:[5.2,7.4], M8:[10.3,11.7], M10:[16.4,20.4], M12:[23.0,28.3], M16:[38.9,57.5],
      }).map(([k,[n,q]]) => [k, ancFromMax(n,q)])),
      // グリップアンカー GA（最大引張荷重のみ、Fc21）
      female: Object.fromEntries(Object.entries({
        M6:9.3, M8:12.7, M10:14.9, M12:25.5, M16:33.3, M20:52.9, M22:60.8, M24:76.5,
      }).map(([k,n]) => [k, ancFromMax(n,null)])),
    };

    // ── せん断：あと施工アンカーの許容せん断力式（2026-09 追加）──
    //  qa1 = φ1·0.7·σy·sca（鋼材）  qa2 = φ2·αc·0.5√(Fc·Ec)·sca（支圧）  qa3 = φ2·αc·0.31√Fc·0.5πc²（へりあき方向のコーン破壊）
    //  φ1: 長期2/3・短期1.0、φ2: 長期1/3・短期2/3、αc=0.75（施工ばらつき）
    //  出典：国交省「あと施工アンカー・連続繊維補強設計・施工指針」の強度式（サンコーテクノ技術資料の整理で確認）
    //  sca はボルトのねじ部有効断面積（SS400・σy=235 を仮定。アンカー本体の方が太い金属系では安全側）
    //  Ec = 3.35e4·(γ/24)²·(Fc/60)^(1/3)、γ=23（普通コンクリート）
    const ANC_BOLT_AS = { M6:20.1, M8:36.6, M10:58.0, M12:84.3, M16:157, M20:245, M22:303, M24:353, M30:561, M36:817 };
    const ANC_BOLT_SY = 235;
    function ancShearCalc(size, Fc, c) {
      const sca = ANC_BOLT_AS[size];
      if (!sca) return null;
      const Ec = 3.35e4 * Math.pow(23/24, 2) * Math.cbrt(Fc/60);
      const ac = 0.75;
      const f = (phi1, phi2) => {
        const q1 = phi1 * 0.7 * ANC_BOLT_SY * sca / 1000;
        const q2 = phi2 * ac * 0.5 * Math.sqrt(Fc * Ec) * sca / 1000;
        const q3 = (c != null && c > 0) ? phi2 * ac * 0.31 * Math.sqrt(Fc) * 0.5 * Math.PI * c * c / 1000 : null;
        return { q1, q2, q3 };
      };
      return { Ec, sca, L: f(2/3, 1/3), S: f(1.0, 2/3) };
    }

    // Fc補正：カタログはFc21の値。Fc21未満は√(Fc/21)で低減、Fc21以上は増やさない（安全側）
    const ancFcFactor = fc => fc < 21 ? Math.sqrt(fc / 21) : 1.0;

    const ANC_TYPE_LABEL = {
      ap:'旭化成 AP', mu:'旭化成 MU', 'all-anc':'サンコー オールアンカーC', wedge:'サンコー トルコンTCW', female:'サンコー グリップGA'
    };
    const ANC_TYPE_COLOR = {
      ap:'var(--accent)', mu:'#ff9966', 'all-anc':'var(--good)', wedge:'var(--warn)', female:'#a0c4ff'
    };
