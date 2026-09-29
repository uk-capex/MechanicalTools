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
      const θ = parseFloat(document.getElementById('rc-angle').value);
      if (θ === 0) {
        document.getElementById('rc-points').value = '1';
        document.getElementById('rc-angle').disabled = true;
        document.getElementById('rc-angle').style.opacity = '0.5';
      }
      rigCalc();
    }

    /* ── 総合選定計算 ── */
    // 張力係数 = 1/cos(開き角/2)
    const RIG_ANGLE_FACTOR = {0:1.00, 30:1.04, 60:1.16, 90:1.41, 120:2.00};

    function rigRow(label, value, color) {
      return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="color:var(--muted);font-size:11px;">${label}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${color};">${value}</span>
      </div>`;
    }

    function rigCalc() {
      const W_kgf  = parseFloat(document.getElementById('rc-load').value)   || 0;
      const n      = parseFloat(document.getElementById('rc-points').value)  || 1;
      const θ      = parseFloat(document.getElementById('rc-angle').value);
      const factor = RIG_ANGLE_FACTOR[θ] || 1.0;
      const nEff   = rigEffLegs(n);

      const T_kgf = W_kgf / nEff * factor;   // 1本あたり張力
      const T_kN  = kgf2kN(T_kgf);
      const W_kN  = kgf2kN(W_kgf);

      const angleWarn = θ >= 120
        ? `<span style="color:var(--bad);">⚠ 開き角120°は上限。超えると使用禁止。</span><br>`
        : θ >= 90
        ? `<span style="color:var(--warn);">⚠ 開き角90°以上は張力が大きい。注意。</span><br>`
        : '';
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
      const T_kgf = Math.ceil(W_kgf / rigEffLegs(n) * (RIG_ANGLE_FACTOR[θ] || 1));
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
       ・ウェッジ / メスネジは出典未確認のため許容荷重データなし（寸法も参考扱い）
    ══════════════════════════════════════════ */
    const ANC_TYPE_INFO = {
      ap:     { label:'旭化成 ARケミカルセッター AP（回転・打撃型）', color:'var(--accent)',
                desc:'ガラス管カプセルを穿孔に入れ、ボルトを回転・打撃で挿入して撹拌。<br>エポキシアクリレート樹脂。耐アルカリ性・初期剛性が高い。<br>' +
                     '硬化時間（気中）目安：0℃ 60分／10℃ 25分／20℃ 15分／30℃ 10分。硬化前は動かさない。<br>使用期限：製造から3年。' },
      mu:     { label:'旭化成 ARケミカルセッター MU（打込み型）', color:'#ff9966',
                desc:'カプセルをハンマーで打込むだけで施工完了。撹拌不要のためL字筋・U字筋も施工可。<br>' +
                     'ボルト先端は寸切り or Vカット（片面カット・丸棒は不可）。<br>' +
                     '<b style="color:var(--warn);">APと穿孔径・深さが違う（例：M12はAP φ14.5×100、MU φ15×110）。</b>' },
      'all-anc':{ label:'サンコーテクノ オールアンカー Cタイプ（芯棒打込み式）', color:'var(--good)',
                desc:'芯棒を打込んで拡張させる。施工簡単・即荷重OK。取付物の上から施工可。<br>' +
                     '<b style="color:var(--warn);">穿孔径はアンカー外径とほぼ同じ（M12→φ12.7）。</b><br>' +
                     'カタログ値は最大荷重のみ。許容はツール仮定（最大÷3）。' },
      wedge:  { label:'ウェッジアンカー ⚠未照合', color:'var(--warn)',
                desc:'<b style="color:var(--bad);">メーカー未定・出典未確認。寸法は参考、許容荷重は出さない。</b><br>使用品のカタログで必ず確認。' },
      female: { label:'メスネジアンカー（ドロップイン）⚠未照合', color:'#a0c4ff',
                desc:'<b style="color:var(--bad);">メーカー未定・出典未確認。寸法は参考、許容荷重は出さない。</b><br>埋込みが浅く引張には弱い。使用品のカタログで必ず確認。' },
    };

    // [種別, ねじ径, 下穴径, 下穴深さ, 埋込長, 端距離最小, 間隔最小, トルク(Nm), 備考]
    // 端距離・間隔はメーカー設計資料で確認（null＝要確認）
    const ANC_DATA = [
      // ── 旭化成 ARケミカルセッター AP（標準） ──
      ['ap','M8',  9.0,  70, 70, null,null,null,'AP-8'],
      ['ap','M10', 12.0, 90, 90, null,null,null,'AP-10'],
      ['ap','M12', 14.5, 100,100,null,null,null,'AP-12 ★'],
      ['ap','M16', 19.0, 130,130,null,null,null,'AP-16'],
      ['ap','M20', 24.0, 200,200,null,null,null,'AP-20（短い AP-2016 は深さ160）'],
      ['ap','M22', 28.0, 250,250,null,null,null,'AP-22'],
      ['ap','M24', 32.0, 300,300,null,null,null,'AP-24'],
      ['ap','M30', 40.0, 350,350,null,null,null,'AP-30'],
      ['ap','M36', 48.0, 400,400,null,null,null,'AP-36'],
      // ── 旭化成 ARケミカルセッター MU（打込み型） ──
      ['mu','M8',  9.5,  70, 70, null,null,null,'MU-8'],
      ['mu','M10', 12.0, 90, 90, null,null,null,'MU-10'],
      ['mu','M12', 15.0, 110,110,null,null,null,'MU-12 ★'],
      ['mu','M16', 19.0, 140,140,null,null,null,'MU-16（カプセル長120と穿孔深さ140が違う）'],
      ['mu','M20', 23.0, 170,170,null,null,null,'MU-20'],
      // ── サンコーテクノ オールアンカー Cタイプ（標準埋込み） ──
      ['all-anc','M6',  6.4,  36, 30, null,null,4,  'C-660 ほか'],
      ['all-anc','M8',  8.5,  43, 35, null,null,9,  'C-850 ほか（C-840は埋込25）'],
      ['all-anc','M10', 10.5, 50, 40, null,null,18, 'C-1060 ほか（C-1050は埋込30）'],
      ['all-anc','M12', 12.7, 62, 50, null,null,31, 'C-1270 ほか ★（C-1260は埋込40）'],
      ['all-anc','M16', 17.0, 76, 60, null,null,80, 'C-1610 ほか（C-1680は埋込50）'],
      ['all-anc','M20', 21.5, 100,80, null,null,150,'C-2013 ほか（C-2010は埋込60）'],
      // ── ウェッジアンカー（⚠未照合・旧データ） ──
      ['wedge','M8',  10, 70, 60, null,null,null,'⚠未照合'],
      ['wedge','M10', 12, 80, 70, null,null,null,'⚠未照合'],
      ['wedge','M12', 14, 95, 80, null,null,null,'⚠未照合'],
      ['wedge','M16', 18, 120,105,null,null,null,'⚠未照合'],
      ['wedge','M20', 22, 145,130,null,null,null,'⚠未照合'],
      // ── メスネジアンカー（⚠未照合・旧データ） ──
      ['female','M6',  10, 25, 22, null,null,null,'⚠未照合'],
      ['female','M8',  12, 30, 27, null,null,null,'⚠未照合'],
      ['female','M10', 15, 35, 32, null,null,null,'⚠未照合'],
      ['female','M12', 18, 42, 38, null,null,null,'⚠未照合'],
      ['female','M16', 22, 50, 46, null,null,null,'⚠未照合'],
    ];

    // 強度データ（kN, Fc21）
    //  Nl/Ns: 許容引張 長期/短期、Ql/Qs: 許容せん断 長期/短期（null＝記載なし）
    //  Nmax/Qmax: 最大荷重（オールアンカーのみ・カタログ値）
    const ANC_MAX_SF = 3;  // オールアンカー：最大荷重→長期許容 の仮定安全率
    const ANC_STRENGTH = {
      ap: {
        M8:{Nl:5.9,Ns:8.9}, M10:{Nl:9.4,Ns:14.2}, M12:{Nl:13.7,Ns:20.6}, M16:{Nl:25.4,Ns:38.1},
        M20:{Nl:38.3,Ns:57.5}, M22:{Nl:47.4,Ns:71.2}, M24:{Nl:55.3,Ns:82.9}, M30:{Nl:87.8,Ns:131.8}, M36:{Nl:119.4,Ns:179.1},
      },
      mu: {
        M8:{Nl:5.9,Ns:8.9}, M10:{Nl:9.4,Ns:14.2}, M12:{Nl:13.7,Ns:20.6}, M16:{Nl:25.3,Ns:38.0}, M20:{Nl:38.3,Ns:57.5},
      },
      'all-anc': Object.fromEntries(Object.entries({
        M6:[3.9,6.3], M8:[6.5,10.1], M10:[10.2,16.0], M12:[17.1,23.3], M16:[29.9,47.9], M20:[41.4,73.6],
      }).map(([k,[n,q]]) => [k, {Nmax:n, Qmax:q,
        Nl:+(n/ANC_MAX_SF).toFixed(2), Ns:+(n/ANC_MAX_SF*2).toFixed(2),
        Ql:+(q/ANC_MAX_SF).toFixed(2), Qs:+(q/ANC_MAX_SF*2).toFixed(2)}])),
    };

    // Fc補正：カタログはFc21の値。Fc21未満は√(Fc/21)で低減、Fc21以上は増やさない（安全側）
    const ancFcFactor = fc => fc < 21 ? Math.sqrt(fc / 21) : 1.0;

    const ANC_TYPE_LABEL = {
      ap:'旭化成 AP', mu:'旭化成 MU', 'all-anc':'サンコー オールアンカーC', wedge:'ウェッジ⚠', female:'メスネジ⚠'
    };
    const ANC_TYPE_COLOR = {
      ap:'var(--accent)', mu:'#ff9966', 'all-anc':'var(--good)', wedge:'var(--warn)', female:'#a0c4ff'
    };
