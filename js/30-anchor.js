    function ancFilter() {
      const type   = document.getElementById('anc-type').value;
      const query  = document.getElementById('anc-search').value.trim().toUpperCase();
      let rows = ANC_DATA;
      if (type !== 'all') rows = rows.filter(r => r[0] === type);
      if (query) rows = rows.filter(r => r[1].toUpperCase().includes(query) ||
                                         String(r[2]).includes(query));
      document.getElementById('anc-count').textContent = `${rows.length} 件`;

      // 種別説明更新
      const infoEl = document.getElementById('anc-type-info');
      if (type !== 'all' && ANC_TYPE_INFO[type]) {
        const info = ANC_TYPE_INFO[type];
        infoEl.innerHTML = `<b style="color:${info.color};">${info.label}</b><br>${info.desc}`;
      } else {
        infoEl.innerHTML = `<span style="color:var(--muted);">種別を選択すると説明が表示されます</span>`;
      }

      const mono = "font-family:'Inter',monospace;";
      const nv = v => (v === null || v === undefined) ? '<span style="color:var(--muted);">要確認</span>' : v;
      document.getElementById('anc-tbody').innerHTML = rows.map(r => {
        const [t, size, dHole, dDepth, embed, edge, pitch, torque, note] = r;
        const color = ANC_TYPE_COLOR[t] || 'var(--ink)';
        return `<tr>
          <td style="font-size:11px;color:${color};white-space:nowrap;">${ANC_TYPE_LABEL[t]}</td>
          <td style="${mono}font-weight:700;color:var(--ink);">${size}</td>
          <td style="${mono}color:var(--accent);font-weight:700;">φ${dHole}</td>
          <td style="${mono}">${dDepth}${t === 'all-anc' ? '以上' : ''}</td>
          <td style="${mono}color:var(--good);font-weight:700;">${embed}</td>
          <td style="${mono}">${nv(edge)}</td>
          <td style="${mono}">${nv(pitch)}</td>
          <td style="${mono}font-size:11px;">${torque ? torque : '—'}</td>
          <td style="font-size:11px;color:var(--muted);">${note}</td>
        </tr>`;
      }).join('');
    }

    function ancCalc() {
      const type   = document.getElementById('calc-anc-type').value;
      const size   = document.getElementById('calc-anc-size').value;
      const fc     = parseInt(document.getElementById('calc-fc').value);
      const N_kgf  = parseFloat(document.getElementById('calc-tension').value) || 0;
      const Q_kgf  = parseFloat(document.getElementById('calc-shear').value)   || 0;
      const toKN   = kgf => kgf * 9.80665 / 1000;
      const toKgf  = kN  => Math.round(kN * 1000 / 9.80665);
      const N_kN   = toKN(N_kgf);
      const Q_kN   = toKN(Q_kgf);
      const fcF    = ancFcFactor(fc);
      const dimEl  = document.getElementById('anc-r-dim');

      const st = ANC_STRENGTH[type]?.[size];
      if (!st) {
        ['anc-r-tension','anc-r-shear'].forEach(id => document.getElementById(id).textContent = '—');
        document.getElementById('anc-r-combo').innerHTML =
          `<span style="color:var(--muted);">この種別・サイズの組み合わせはカタログにありません</span>`;
        ['anc-r-n-tension','anc-r-n-shear','anc-r-n-combo'].forEach(id =>
          document.getElementById(id).textContent = '—');
        dimEl.innerHTML = '';
        return;
      }

      // 長期許容で判定（設備据付の常時荷重）。短期は参考表示
      const Na_kN = +(st.Nl * fcF).toFixed(2);
      // せん断：算定式（鋼材・支圧・へりあき）と、金属系はカタログ最大せん断÷3 の小さい方
      const edgeRaw = document.getElementById('calc-edge')?.value;
      const edge = edgeRaw === '' || edgeRaw == null ? null : parseFloat(edgeRaw);
      const sh = ancShearCalc(size, fc, edge);
      const pickMin = (o) => {
        const c = [['鋼材', o.q1], ['支圧', o.q2]];
        if (o.q3 != null) c.push(['へりあき', o.q3]);
        return c.reduce((m, x) => x[1] < m[1] ? x : m);
      };
      let Qa_kN = null, QaS_kN = null, qMode = '', qDetail = '';
      if (sh) {
        let [mL, vL] = pickMin(sh.L), [mS, vS] = pickMin(sh.S);
        if (st.Ql != null && st.Ql * fcF < vL) { vL = st.Ql * fcF; mL = 'カタログ最大÷3'; }
        if (st.Qs != null && st.Qs * fcF < vS) { vS = st.Qs * fcF; mS = 'カタログ最大÷3'; }
        Qa_kN = +vL.toFixed(2); QaS_kN = +vS.toFixed(2); qMode = mL;
        qDetail = `鋼材 ${sh.L.q1.toFixed(1)}／支圧 ${sh.L.q2.toFixed(1)}／へりあき ${sh.L.q3 != null ? sh.L.q3.toFixed(1) : '（縁なし）'}` +
                  (st.Ql != null ? `／カタログ ${(st.Ql * fcF).toFixed(1)}` : '') + ' kN';
      }
      const sub = (s) => `<br><span style="font-size:10px;color:var(--muted);">${s}</span>`;

      document.getElementById('anc-r-tension').innerHTML =
        `<span style="font-size:22px;">${toKgf(Na_kN).toLocaleString()}</span>
         <span style="font-size:11px;color:var(--muted);"> kgf</span>` +
        sub(`長期 ${Na_kN} kN／短期 ${(st.Ns * fcF).toFixed(1)} kN`) +
        (st.Nmax ? sub(`最大荷重 ${st.Nmax} kN ÷ ${ANC_MAX_SF}（ツール仮定）`)
          : type === 'mu' ? sub('カタログ許容値と Mねじ SS400 算定値の小さい方') : sub('メーカー算定値（Mねじ SS400）'));
      document.getElementById('anc-r-shear').innerHTML = Qa_kN != null
        ? `<span style="font-size:22px;">${toKgf(Qa_kN).toLocaleString()}</span>
           <span style="font-size:11px;color:var(--muted);"> kgf</span>` +
          sub(`長期 ${Qa_kN} kN／短期 ${QaS_kN} kN（${qMode}で決定）`) +
          sub(`長期内訳：${qDetail}`) +
          (edge == null ? sub('<span style="color:var(--warn);">へりあき未入力＝縁から十分離れている前提</span>') : '')
        : `<span style="font-size:13px;color:var(--warn);">算定できません</span>` +
          sub('このねじ径のボルト断面データなし');

      // 組み合わせ検定（線形和：安全側）
      const rN = N_kN > 0 ? N_kN / Na_kN : 0;
      const rQ = (Q_kN > 0 && Qa_kN) ? Q_kN / Qa_kN : 0;
      const shearUnchecked = Q_kN > 0 && Qa_kN == null;
      const ratio = rN + rQ;
      const ok = ratio <= 1.0 && !shearUnchecked;
      const ratioColor = ratio <= 1.0 ? 'var(--good)' : 'var(--bad)';
      const ratioJudge = shearUnchecked
        ? `<span style="color:var(--warn);">△ せん断未検討（引張のみ判定）</span>`
        : ok ? `<span style="color:var(--good);">✓ OK</span>`
             : `<span style="color:var(--bad);">✕ NG（本数を増やしてください）</span>`;
      document.getElementById('anc-r-combo').innerHTML = `
        <div style="font-family:'Inter',monospace;font-size:12px;">
          N/Na${Qa_kN != null ? ' + Q/Qa' : ''}<br>
          = ${rN.toFixed(3)}${Qa_kN != null ? ' + ' + rQ.toFixed(3) : ''}
          = <b style="color:${ratioColor};">${ratio.toFixed(3)}</b> ≤ 1.0 ${ratioJudge}
        </div>
        <div style="font-size:10px;color:var(--muted);margin-top:4px;">Fc${fc}${fc < 21 ? `：引張は √(${fc}/21)=${fcF.toFixed(3)} で低減` : '：引張はカタログFc21値のまま（割増しなし）'}。せん断は算定式に Fc${fc} を直接使用（Ec=${sh ? Math.round(sh.Ec).toLocaleString() : '—'} N/mm²）</div>`;

      // 必要本数
      const nTension = N_kN > 0 ? Math.ceil(rN) : 0;
      const nShear   = rQ > 0 ? Math.ceil(rQ) : 0;
      const nCombo   = ratio > 0 ? Math.ceil(ratio) : 0;
      document.getElementById('anc-r-n-tension').textContent = nTension || '—';
      document.getElementById('anc-r-n-shear').textContent   = shearUnchecked ? '要検討' : (nShear || '—');
      document.getElementById('anc-r-n-combo').textContent   = Math.max(nTension, nShear, nCombo) || '—';

      // 施工寸法参照
      const dimRow = ANC_DATA.find(r => r[0] === type && r[1] === size);
      if (dimRow) {
        const [,, dHole, dDepth, embed, edgeRec, pitchRec, torque, note] = dimRow;
        const b = (v, c) => `<b style="font-family:'Inter',monospace;${c ? 'color:' + c + ';' : ''}">${v}</b>`;
        dimEl.innerHTML = `
          <div style="color:var(--muted);font-size:10px;margin-bottom:6px;">施工寸法参照（${ANC_TYPE_LABEL[type]} ${size}・${note}）</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;font-size:12px;">
            <div><span style="color:var(--muted);">下穴径</span><br>${b('φ' + dHole + ' mm', 'var(--accent)')}</div>
            <div><span style="color:var(--muted);">下穴深さ</span><br>${b(dDepth + ' mm' + (type === 'all-anc' ? '以上' : ''))}</div>
            <div><span style="color:var(--muted);">埋込長</span><br>${b(embed + ' mm', 'var(--good)')}</div>
            <div><span style="color:var(--muted);">締付トルク</span><br>${b(torque ? torque + ' N·m' : '—')}</div>
          </div>
          <div style="font-size:11px;margin-top:6px;">推奨 へりあき ${b(edgeRec + ' mm以上')}　間隔 ${b(pitchRec + ' mm以上')}` +
          (edge != null && edgeRec && edge < edgeRec ? `　<span style="color:var(--warn);">⚠ 入力のへりあき ${edge}mm は推奨未満（せん断はへりあき計算に反映済み。引張の低減は未考慮）</span>` : '') +
          `</div>`;
      } else dimEl.innerHTML = '';
    }

    function showAnchorTab(name, btn) {
      const wrap = document.getElementById('anc-stab-wrap');
      wrap.querySelectorAll('.stab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('#tab-anchor .stab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('stab-anc-' + name).classList.add('active');
      if (btn) btn.classList.add('active');
    }
