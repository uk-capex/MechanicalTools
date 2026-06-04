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

      document.getElementById('anc-tbody').innerHTML = rows.map(r => {
        const [t, size, dHole, dDepth, embed, edge, pitch, torque, note] = r;
        const color = ANC_TYPE_COLOR[t] || 'var(--ink)';
        const torqueTxt = torque ? `${torque}` : '専用ツール';
        return `<tr>
          <td style="font-size:11px;color:${color};white-space:nowrap;">${ANC_TYPE_LABEL[t]}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--ink);">${size}</td>
          <td style="font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:700;">φ${dHole}</td>
          <td style="font-family:'JetBrains Mono',monospace;">${dDepth}</td>
          <td style="font-family:'JetBrains Mono',monospace;color:var(--good);font-weight:700;">${embed}</td>
          <td style="font-family:'JetBrains Mono',monospace;">${edge}</td>
          <td style="font-family:'JetBrains Mono',monospace;">${pitch}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${torqueTxt}</td>
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
      const N_kN   = N_kgf * 9.807 / 1000;
      const Q_kN   = Q_kgf * 9.807 / 1000;
      const fcF    = FC_FACTOR[fc] || 1.0;

      const allow = ANC_ALLOW[type]?.[size];
      if (!allow) {
        ['anc-r-tension','anc-r-shear'].forEach(id =>
          document.getElementById(id).textContent = '—');
        document.getElementById('anc-r-combo').innerHTML =
          `<span style="color:var(--muted);">この種別・サイズの組み合わせはデータがありません</span>`;
        ['anc-r-n-tension','anc-r-n-shear','anc-r-n-combo'].forEach(id =>
          document.getElementById(id).textContent = '—');
        return;
      }

      const Na_kN  = +(allow[0] * fcF).toFixed(2);
      const Qa_kN  = +(allow[1] * fcF).toFixed(2);
      const Na_kgf = Math.round(Na_kN * 1000 / 9.807);
      const Qa_kgf = Math.round(Qa_kN * 1000 / 9.807);

      // カード表示（kgfメイン・kN換算）
      document.getElementById('anc-r-tension').innerHTML =
        `<span style="font-size:22px;">${Na_kgf.toLocaleString()}</span>
         <span style="font-size:11px;color:var(--muted);"> kgf</span><br>
         <span style="font-size:11px;color:var(--muted);">(${Na_kN} kN)</span>`;
      document.getElementById('anc-r-shear').innerHTML =
        `<span style="font-size:22px;">${Qa_kgf.toLocaleString()}</span>
         <span style="font-size:11px;color:var(--muted);"> kgf</span><br>
         <span style="font-size:11px;color:var(--muted);">(${Qa_kN} kN)</span>`;

      // 組み合わせ検定
      const ratio = (N_kN > 0 ? N_kN/Na_kN : 0) + (Q_kN > 0 ? Q_kN/Qa_kN : 0);
      const ratioColor = ratio <= 1.0 ? 'var(--good)' : 'var(--bad)';
      const ratioJudge = ratio <= 1.0
        ? `<span style="color:var(--good);">✓ OK</span>`
        : `<span style="color:var(--bad);">✕ NG（本数を増やしてください）</span>`;
      document.getElementById('anc-r-combo').innerHTML = `
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;">
          N/Na + Q/Qa<br>
          = ${N_kN > 0 ? (N_kN/Na_kN).toFixed(3) : '0.000'}
          + ${Q_kN > 0 ? (Q_kN/Qa_kN).toFixed(3) : '0.000'}
          = <b style="color:${ratioColor};">${ratio.toFixed(3)}</b> ≤ 1.0 ${ratioJudge}
        </div>`;

      // 必要本数
      const nTension = N_kN > 0 ? Math.ceil(N_kN / Na_kN) : 0;
      const nShear   = Q_kN > 0 ? Math.ceil(Q_kN / Qa_kN) : 0;
      const nCombo   = N_kN > 0 || Q_kN > 0 ? Math.ceil(ratio) : 0;
      document.getElementById('anc-r-n-tension').textContent = nTension || '—';
      document.getElementById('anc-r-n-shear').textContent   = nShear   || '—';
      document.getElementById('anc-r-n-combo').textContent   = Math.max(nTension, nShear, nCombo) || '—';

      // 施工寸法参照
      const dimRow = ANC_DATA.find(r => r[0] === type && r[1] === size);
      if (dimRow) {
        const [,, dHole, dDepth, embed, edge, pitch, torque] = dimRow;
        document.getElementById('anc-r-dim').innerHTML = `
          <div style="color:var(--muted);font-size:10px;margin-bottom:6px;">施工寸法参照（${ANC_TYPE_LABEL[type]} ${size}）</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">
            <div><span style="color:var(--muted);">下穴径</span><br>
              <b style="font-family:'JetBrains Mono',monospace;color:var(--accent);">φ${dHole} mm</b></div>
            <div><span style="color:var(--muted);">下穴深さ</span><br>
              <b style="font-family:'JetBrains Mono',monospace;">${dDepth} mm</b></div>
            <div><span style="color:var(--muted);">埋込長</span><br>
              <b style="font-family:'JetBrains Mono',monospace;color:var(--good);">${embed} mm</b></div>
            <div><span style="color:var(--muted);">端距離最小</span><br>
              <b style="font-family:'JetBrains Mono',monospace;">${edge} mm</b></div>
            <div><span style="color:var(--muted);">間隔最小</span><br>
              <b style="font-family:'JetBrains Mono',monospace;">${pitch} mm</b></div>
            <div><span style="color:var(--muted);">締付トルク</span><br>
              <b style="font-family:'JetBrains Mono',monospace;">${torque ? torque+' N·m' : '専用ツール'}</b></div>
          </div>`;
      }
    }

    function showAnchorTab(name, btn) {
      const wrap = document.getElementById('anc-stab-wrap');
      wrap.querySelectorAll('.stab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('#tab-anchor .stab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('stab-anc-' + name).classList.add('active');
      if (btn) btn.classList.add('active');
    }
