    function orFilter() {
      const series = document.getElementById('or-series').value;
      const query  = document.getElementById('or-search').value.trim().toUpperCase();
      const useF   = document.getElementById('or-use').value;
      const tbody  = document.getElementById('or-tbody');
      let rows = OR_DATA.filter(r => r.series === series);
      if (useF !== 'all') rows = rows.filter(r => r.use === useF);
      if (query) rows = rows.filter(r => r.id.includes(query) || String(r.d1).startsWith(query.replace(/^[PGSV]/,'')));
      document.getElementById('or-count').textContent = `${rows.length} 件`;
      tbody.innerHTML = rows.map(r => {
        const nv = v => (v == null ? '—' : v);
        const bTxt = `${nv(r.bDyn)} / ${nv(r.bSta)}`;
        const tTxt = `${nv(r.tDyn)} / ${nv(r.tSta)}`;
        return `<tr onclick="orSelect(${JSON.stringify(r).replace(/"/g,'&quot;')})" style="cursor:pointer;">
          <td style="color:var(--accent);font-family:'Inter',monospace;">${r.id}</td>
          <td>${r.d1}</td><td>${r.d2}</td>
          <td>${bTxt}</td><td>${tTxt}</td><td>${r.C ?? '—'}</td>
          <td style="font-size:11px;color:var(--muted);">${r.use==='dynamic'?'運動用':'固定用'}</td>
        </tr>`;
      }).join('');
    }

    function orSelect(r) {
      const el = document.getElementById('or-selected-info');
      el.style.display = '';
      el.innerHTML = `
        <b style="color:var(--accent);">${r.id}</b> を選択 &nbsp;|&nbsp;
        内径 d1: <b>${r.d1} mm</b> &nbsp; 線径 d2: <b>${r.d2} mm</b><br>
        ${r.bSta == null
          ? '<span style="color:var(--warn);">溝寸法データなし</span><br>'
          : r.series === 'S'
            ? `溝幅 G: <b>${r.bSta}</b> mm（+0.25/0）&nbsp; 溝深さ: <b>${r.tSta}</b> mm（円筒面＝(D1−d)/2、平面＝H 0/−0.10）<br><span style="font-size:11px;color:var(--muted);">S系はJIS B 2406対象外。桜シールS規格表の推奨溝（圧縮率 約${Math.round((r.d2-r.tSta)/r.d2*100)}%。細線径のため一般の固定用目安より高め）</span><br>`
          : r.series === 'V'
            ? `溝幅 e: <b>${r.bSta}</b> mm（+0.1/0）&nbsp; 溝深さ S: <b>${r.tSta}</b> mm（0/−0.2）&nbsp; 溝内径 G1 ≒ 呼び番号<br><span style="font-size:11px;color:var(--muted);">JIS B 2290 附属書（旧JIS真空フランジ VG）の溝${r.id === 'V15' ? '。V15 は対応フランジなしのため線径4の溝を準用' : ''}</span><br>`
            : `溝幅 b: <b>${r.bSta}</b> mm（+0.25/0）&nbsp; 溝深さ t: <b>${r.tSta}</b> mm（0/−0.05）&nbsp; 溝底R: <b>${r.C}</b><br>`}
        <span style="color:var(--muted);">→ 圧縮率計算タブへ自動入力するには下のボタンを</span>
        <button onclick="orToComp(${r.d2},${r.tSta ?? 0},${r.d1})" style="margin-left:8px;padding:2px 8px;background:var(--accent-dim);border:1px solid var(--accent);color:var(--accent);border-radius:4px;cursor:pointer;font-size:11px;">
          📐 圧縮率計算へ
        </button>`;
    }

    function orToComp(d2, t, d1) {
      document.getElementById('cp-d2').value = d2;
      document.getElementById('cp-t').value  = t;
      document.getElementById('cp-d1').value = d1;
      calcComp();
      showSealTab('comp', document.getElementById('sbtn-seal-comp'));
    }

    /* ── 圧縮率計算 ── */
    function calcComp() {
      const d2   = parseFloat(document.getElementById('cp-d2').value) || 0;
      const t    = parseFloat(document.getElementById('cp-t').value)  || 0;
      const d1   = parseFloat(document.getElementById('cp-d1').value) || 0;
      const dg   = parseFloat(document.getElementById('cp-dg').value) || 0;
      const use  = document.getElementById('cp-use').value;
      const comp = d2 > 0 ? ((d2 - t) / d2 * 100) : 0;
      const delta = d2 - t;
      const str  = d1 > 0 ? ((dg - d1) / d1 * 100) : 0;

      const limits = {
        dynamic: {min:8, max:25, rec:'JIS B 2406 溝で約11〜21%'},
        static:  {min:15, max:30, rec:'15〜30%'},
        vacuum:  {min:25, max:35, rec:'25〜35%'},
      };
      const lim = limits[use];

      function judge(val, min, max) {
        if (val < min) return `<span style="color:var(--warn);">⚠ 低すぎ (推奨${min}〜${max}%)</span>`;
        if (val > max) return `<span style="color:var(--bad);">✕ 高すぎ (推奨${min}〜${max}%)</span>`;
        return `<span style="color:var(--good);">✓ 適正 (${lim.rec})</span>`;
      }

      document.getElementById('cp-r-comp').textContent       = comp.toFixed(1);
      document.getElementById('cp-r-comp-judge').innerHTML   = judge(comp, lim.min, lim.max);
      document.getElementById('cp-r-delta').textContent      = delta.toFixed(2);
      document.getElementById('cp-r-stretch').textContent    = str.toFixed(1);
      document.getElementById('cp-r-str-judge').innerHTML    =
        str < 0 ? `<span style="color:var(--bad);">✕ 負値（溝>Oリング?）</span>` :
        str > 8 ? `<span style="color:var(--bad);">✕ 引張り過大(推奨1〜5%)</span>` :
        str > 5 ? `<span style="color:var(--warn);">⚠ やや大(推奨1〜5%)</span>` :
        str < 1 ? `<span style="color:var(--muted);">— ほぼ0（ゆとりあり）</span>` :
                  `<span style="color:var(--good);">✓ 適正(1〜5%)</span>`;

      // SVGビジュアライザ
      const scale = Math.min(3.0, 30 / Math.max(d2, 1));
      const cx = 80, cy = 80;
      // t > d2 は物理的にありえないので d2 でクランプ（真円）
      const tClamped = Math.min(t, d2);
      const grooveH = Math.max(tClamped * scale, 4);
      const grooveW = Math.max(d2 * scale * 1.4, 10);
      const rx = (d2 * scale) / 2;
      const ry = (tClamped * scale) / 2;  // t>=d2のとき ry==rx → 真円
      const gy = cy - grooveH / 2;
      document.getElementById('cp-groove').setAttribute('x', cx - grooveW/2);
      document.getElementById('cp-groove').setAttribute('y', gy);
      document.getElementById('cp-groove').setAttribute('width', grooveW);
      document.getElementById('cp-groove').setAttribute('height', grooveH);
      document.getElementById('cp-oring-shape').setAttribute('cx', cx);
      document.getElementById('cp-oring-shape').setAttribute('cy', cy);
      document.getElementById('cp-oring-shape').setAttribute('rx', rx);
      document.getElementById('cp-oring-shape').setAttribute('ry', ry);
      document.getElementById('cp-oring-shape').setAttribute('stroke',
        comp < lim.min ? 'var(--warn)' : comp > lim.max ? 'var(--bad)' : 'var(--good)');

      document.getElementById('cp-detail').innerHTML =
        `線径 d2: <b>${d2} mm</b><br>溝深さ t: <b>${t} mm</b><br>圧縮量: <b>${delta.toFixed(2)} mm</b><br>` +
        `圧縮後 高さ: <b>${t.toFixed(2)} mm</b><br>` +
        `<span style="color:var(--muted);font-size:11px;">※断面イメージ（縮尺は概略）</span>`;
    }

    /* ── 材質データ ── */
    const SEAL_MAT = [
      {
        id:'NBR', name:'NBR（ニトリル）', color:'var(--accent)',
        temp:'-40〜+120℃', hardness:'A70±5',
        good:['鉱物油','グリース','水（温水）','燃料油','空気'],
        bad:['ケトン類','エステル','塩素系溶剤','臭素系流体'],
        feature:'最も汎用的。耐油性・耐水性バランス良好。コスト低。',
        note:'動的用途でよく使われる標準材。'
      },
      {
        id:'FKM', name:'FKM（フッ素ゴム/バイトン）', color:'#ff9966',
        temp:'-20〜+200℃', hardness:'A70±5',
        good:['有機溶剤','燃料油','鉱物油','酸類','アルカリ（薄）'],
        bad:['アセトン','MEK','アミン類','熱水（>150℃）'],
        feature:'耐熱・耐薬品性最高クラス。高価。高温油圧や化学機械に最適。',
        note:'NBRより大幅に高価。アミン系添加剤入りの油・熱水には注意。'
      },
      {
        id:'VMQ', name:'VMQ（シリコン）', color:'#a0c4ff',
        temp:'-60〜+200℃', hardness:'A50〜A70',
        good:['熱風','食品・飲料','薬品（弱）','水'],
        bad:['鉱物油（膨潤大）','スチーム','燃料油'],
        feature:'超広温度域・食品衛生OK。耐油性低いため注意。',
        note:'機械油の存在する環境では不適。'
      },
      {
        id:'EPDM', name:'EPDM（エチレンプロピレン）', color:'var(--good)',
        temp:'-40〜+150℃', hardness:'A60〜A80',
        good:['水（温水・スチーム）','ブレーキ液','アルカリ','希酸'],
        bad:['鉱物油','ガソリン','グリース'],
        feature:'耐候・耐オゾン・耐蒸気優秀。屋外・水配管に最適。油と絶対NG。',
        note:'水系・蒸気系の標準材。'
      },
      {
        id:'CR', name:'CR（クロロプレン/ネオプレン）', color:'var(--warn)',
        temp:'-40〜+120℃', hardness:'A60±5',
        good:['旧冷媒（R12等）','弱酸','アルカリ','海水','空気'],
        bad:['強酸','芳香族溶剤','ケトン'],
        feature:'耐候・難燃性あり。屋外用。R134a等の現行冷媒＋冷凍機油は HNBR 等をメーカー確認。',
        note:'鉱物油への耐性は中程度（NBRより劣る）。'
      },
      {
        id:'PTFE', name:'PTFE（テフロン）', color:'#c9a0ff',
        temp:'-200〜+260℃', hardness:'Shore D50〜65',
        good:['ほぼ全薬品','強酸','強アルカリ','溶剤'],
        bad:['溶融アルカリ金属','フッ素ガス'],
        feature:'最強耐薬品。弾性なし→バックアップリングや成形品として使用。',
        note:'Oリング単体より成形パッキンで使うことが多い。'
      },
    ];

    function initMatSelector() {
      const wrap = document.getElementById('mat-selector');
      wrap.innerHTML = SEAL_MAT.map(m => `
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);">
          <input type="checkbox" value="${m.id}" onchange="renderMatDetail()" style="accent-color:${m.color};">
          <span style="color:${m.color};font-weight:600;">${m.name}</span>
        </label>`).join('');
      // デフォルトでNBRとFKMにチェック
      wrap.querySelectorAll('input[type=checkbox]').forEach((cb,i) => { if(i<2) cb.checked=true; });
      renderMatDetail();
    }

    function renderMatDetail() {
      const checked = [...document.querySelectorAll('#mat-selector input:checked')].map(cb=>cb.value);
      const wrap = document.getElementById('mat-detail-wrap');
      wrap.innerHTML = checked.map(id => {
        const m = SEAL_MAT.find(x=>x.id===id);
        if(!m) return '';
        return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px;">
          <div style="font-weight:700;color:${m.color};font-size:14px;margin-bottom:6px;">${m.name}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;margin-bottom:8px;">
            <div><span style="color:var(--muted);">使用温度：</span><b>${m.temp}</b></div>
            <div><span style="color:var(--muted);">硬さ目安：</span><b>${m.hardness}</b></div>
          </div>
          <div style="font-size:12px;color:var(--good);margin-bottom:4px;">✓ 適合：${m.good.join('、')}</div>
          <div style="font-size:12px;color:var(--bad);margin-bottom:6px;">✕ 不適：${m.bad.join('、')}</div>
          <div style="font-size:12px;color:var(--ink);margin-bottom:4px;">${m.feature}</div>
          <div style="font-size:11px;color:var(--muted);">${m.note}</div>
        </div>`;
      }).join('');
      if(!checked.length) wrap.innerHTML = `<div style="color:var(--muted);padding:12px;">材質を選択してください</div>`;
    }

    /* ── オイルシールデータ（JIS B 2402-1:2013 表1 で照合）── */
    const OS_DATA = [
      // [d, D, b, JIS表1（ISO 6194-1）に載っている寸法か]
      // 2026-09 JIS B 2402-1:2013（＝ISO 6194-1:2007 表1）で照合。表に載る d×D は表の幅 b に修正
      //   （30×47・30×52 は 8→7、55×72・55×80・60×80・60×85 は 10→8、120×150 は 15→12）
      //   false の行は表で確認できなかった市販サイズ（NOK 等にはある。幅違いの市販品も多い）
      [6,16,7,true],[6,22,7,true],[7,22,7,true],[8,22,7,true],
      [8,24,7,true],[9,22,7,true],[10,22,7,true],[10,25,7,true],
      [12,22,7,false],[12,24,7,true],[12,25,7,true],[12,30,7,true],
      [14,25,7,false],[15,25,7,false],[15,26,7,true],[15,30,7,true],
      [15,35,7,true],[16,30,7,true],[17,30,7,false],[17,35,7,false],
      [18,30,7,true],[18,35,7,true],[20,35,7,true],[20,40,7,true],
      [20,47,7,false],[22,35,7,false],[22,40,7,false],[25,40,7,true],
      [25,47,7,false],[25,52,7,false],[28,47,7,false],[30,42,7,true],
      [30,45,8,false],[30,47,7,true],[30,50,8,false],[30,52,7,true],
      [32,45,8,true],[32,47,8,true],[32,52,8,true],[35,50,8,true],
      [35,52,8,true],[35,55,8,true],[35,62,8,false],[38,55,8,true],
      [38,58,8,true],[38,62,8,true],[40,55,8,true],[40,60,8,false],
      [40,62,8,true],[42,55,8,true],[42,62,8,false],[45,60,8,false],
      [45,62,8,true],[45,65,8,false],[45,68,10,false],[48,65,8,false],
      [50,65,8,false],[50,70,10,false],[50,72,10,false],[55,72,8,true],
      [55,80,8,true],[60,80,8,true],[60,85,8,true],[65,85,10,true],
      [65,90,10,true],[70,90,10,true],[70,95,10,true],[75,95,10,true],
      [75,100,10,true],[80,100,10,true],[80,105,10,false],[80,110,10,true],
      [85,110,12,true],[85,120,12,true],[90,115,12,false],[90,120,12,true],
      [95,120,12,false],[100,125,12,false],[110,140,12,false],[120,150,12,true],
      [150,180,15,true],[160,190,15,true],[170,200,15,true],[180,210,15,true],
      [190,220,15,true],[200,230,15,true],
    ];

    function osFilter() {
      const shaft = parseFloat(document.getElementById('os-shaft').value) || null;
      const outer = parseFloat(document.getElementById('os-outer').value) || null;
      const tbody = document.getElementById('os-tbody');
      let rows = OS_DATA;
      if (shaft !== null) rows = rows.filter(r => r[0] === shaft);
      if (outer !== null) rows = rows.filter(r => r[1] === outer);
      // 軸径が完全一致なければ近傍±5mm
      if (shaft !== null && rows.length === 0) {
        rows = OS_DATA.filter(r => Math.abs(r[0] - shaft) <= 5);
      }
      document.getElementById('os-count').textContent = `${rows.length} 件`;
      tbody.innerHTML = rows.map(r => {
        const d = r[0], D = r[1], B = r[2], iso = r[3];
        const code = `${String(d).padStart(3,'0')}${String(D).padStart(3,'0')}`;  // JIS 表7 寸法表示コード
        return `<tr>
          <td style="color:var(--accent);font-family:'Inter',monospace;font-weight:700;">${d}</td>
          <td>${D}</td><td>${B}</td>
          <td style="font-family:'Inter',monospace;font-size:11px;color:var(--ink);">TC ${d}×${D}×${B}</td>
          <td style="font-family:'Inter',monospace;font-size:11px;color:var(--muted);">${code}</td>
          <td style="font-size:11px;color:${iso ? 'var(--good)' : 'var(--muted)'};">${iso ? '✓ JIS表1' : '市販サイズ'}</td>
        </tr>`;
      }).join('');
    }

    /* ── パッキンデータ ── */
    const PK_DATA = [
      {
        name:'Oリング', icon:'🔵',
        use:['recipro','static','vacuum'], press:['low','mid','high'],
        feature:'最も汎用的なシール。溝設計が重要。静的・動的両対応。圧縮率管理がポイント。',
        pros:'小型・軽量・安価・種類豊富', cons:'溝加工が必要。高速摺動には不向き。',
        pressRange:'バックアップリングなし 約10MPaまで目安、ありで更に高圧（すき間・硬さによる）',
        speedRange:'往復動 1.5m/s以下推奨',
        temp:'-60〜+200℃（材質による）'
      },
      {
        name:'Uパッキン（リップパッキン）', icon:'🌙',
        use:['recipro'], press:['low','mid','high'],
        feature:'油圧・空圧シリンダの往復動に最適。方向性あり（片方向シール）。高圧ではバックアップリング併用。',
        pros:'低摩擦・低リーク・自己補償機能', cons:'一方向シール。組み付け向き注意。',
        pressRange:'〜40MPa',
        speedRange:'0.01〜1.5m/s',
        temp:'-30〜+110℃'
      },
      {
        name:'Vパッキン（シェブロンパッキン）', icon:'🔽',
        use:['recipro'], press:['mid','high'],
        feature:'高圧往復動。V形断面を複数積層。締め付け量で接触力調整可能。',
        pros:'高圧対応・耐久性高・多段積みで高圧化', cons:'摩擦大・スペース必要',
        pressRange:'10〜70MPa',
        speedRange:'0.1〜1m/s',
        temp:'-20〜+100℃'
      },
      {
        name:'オイルシール（リップシール）', icon:'🌀',
        use:['rotate'], press:['low'],
        feature:'回転軸の油漏れ防止専用。バネ付きリップが軸に密着。主に大気側漏れ防止。',
        pros:'高速回転対応・取り付け簡単・安価', cons:'高圧不可（JIS 0〜30kPa）。耐圧形は別型式',
        pressRange:'0〜0.03MPa（JIS B 2402-1）。耐圧形（NOK TCV等）は0.3MPa〜',
        speedRange:'周速4〜15m/s（型式による）',
        temp:'-40〜+150℃（NBR）'
      },
      {
        name:'メカニカルシール', icon:'⚙️',
        use:['rotate'], press:['low','mid','high'],
        feature:'回転機器（ポンプ・攪拌機）の完全密封。端面密封方式。漏れ最小。',
        pros:'低漏れ・高速・長寿命', cons:'高価・組み付け精度必要・ドライ運転厳禁（条件により冷却・フラッシング要）',
        pressRange:'〜3MPa（標準型）',
        speedRange:'〜25m/s',
        temp:'流体依存（〜200℃）'
      },
      {
        name:'ガスケット（平パッキン）', icon:'📄',
        use:['static'], press:['low','mid','high'],
        feature:'フランジ・蓋などの固定部シール。面圧で密封。各材質・形状あり。',
        pros:'安価・取り付け簡単・広面積対応', cons:'動的用途不可。再使用不可が多い。',
        pressRange:'材質・形状による（〜高圧対応品も）',
        speedRange:'固定専用',
        temp:'材質依存（〜500℃：金属ガスケット）'
      },
      {
        name:'メタルOリング', icon:'⭕',
        use:['static','vacuum'], press:['high'],
        feature:'超高圧・高真空・高温用途。アルミ・銅・ステンレス等。特殊フランジに使用。',
        pros:'超高圧・高温・高真空対応', cons:'高価・高面圧が必要・再使用不可',
        pressRange:'〜200MPa',
        speedRange:'固定専用',
        temp:'〜600℃（材質による）'
      },
    ];

    function pkFilter() {
      const use   = document.getElementById('pk-use').value;
      const press = document.getElementById('pk-press').value;
      const cards = document.getElementById('pk-cards');
      let rows = PK_DATA;
      if (use   !== 'all') rows = rows.filter(r => r.use.includes(use));
      if (press !== 'all') rows = rows.filter(r => r.press.includes(press));
      cards.innerHTML = rows.map(r => `
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px;">
          <div style="font-size:15px;font-weight:700;color:var(--accent);margin-bottom:6px;">${r.icon} ${r.name}</div>
          <div style="font-size:12px;color:var(--ink);margin-bottom:6px;">${r.feature}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:11px;margin-bottom:6px;">
            <div><span style="color:var(--muted);">圧力：</span>${r.pressRange}</div>
            <div><span style="color:var(--muted);">速度：</span>${r.speedRange}</div>
            <div><span style="color:var(--muted);">温度：</span>${r.temp}</div>
          </div>
          <div style="font-size:11px;">
            <span style="color:var(--good);">✓ ${r.pros}</span> &nbsp;
            <span style="color:var(--bad);">✕ ${r.cons}</span>
          </div>
        </div>`).join('');
      if(!rows.length) cards.innerHTML = `<div style="color:var(--muted);">該当するシール種類がありません</div>`;
    }

    /* ── サブタブ切り替え ── */
    function showSealTab(name, btn) {
      const wrap = document.getElementById('seal-stab-wrap');
      wrap.querySelectorAll('.stab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('#tab-seal .stab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('stab-seal-' + name).classList.add('active');
      if (btn) btn.classList.add('active');
    }

    /* ══════════════════════════════════════════
       🔩 配管フランジ
    ══════════════════════════════════════════ */
    /*
      カラム定義:
      cat, pclass, nom, od, pcd, boltN, boltSize, boltL, torque,
      packID(内径×外径), packMat, compatKey, compatFlag, note
      compatFlag: 'ok'=互換あり / 'warn'=要確認 / 'ng'=混用禁止
    */
    const FL_DATA = [
      // ═══ A: JIS 5K（JIS B 2220）═══
      {cat:'A', pclass:'5K', nom:'10A', od:75, pcd:55, boltN:4, boltSize:'M10', boltL:null, torque:{w:6.9, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'18×45', packMat:'NBR/EPDM ほか', compatKey:'5K-10A', compatFlag:'ng', note:'PCD違い：10K=65・16K=65・20K=65'},
      {cat:'A', pclass:'5K', nom:'15A', od:80, pcd:60, boltN:4, boltSize:'M10', boltL:null, torque:{w:8.4, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'22×50', packMat:'NBR/EPDM ほか', compatKey:'5K-15A', compatFlag:'ng', note:'PCD違い：10K=70・16K=70・20K=70'},
      {cat:'A', pclass:'5K', nom:'20A', od:85, pcd:65, boltN:4, boltSize:'M10', boltL:null, torque:{w:9.3, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'28×55', packMat:'NBR/EPDM ほか', compatKey:'5K-20A', compatFlag:'ng', note:'PCD違い：10K=75・16K=75・20K=75'},
      {cat:'A', pclass:'5K', nom:'25A', od:95, pcd:75, boltN:4, boltSize:'M10', boltL:null, torque:{w:13.0, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'35×65', packMat:'NBR/EPDM ほか', compatKey:'5K-25A', compatFlag:'ng', note:'PCD違い：10K=90・16K=90・20K=90'},
      {cat:'A', pclass:'5K', nom:'32A', od:115, pcd:90, boltN:4, boltSize:'M12', boltL:null, torque:{w:21.1, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'43×78', packMat:'NBR/EPDM ほか', compatKey:'5K-32A', compatFlag:'ng', note:'PCD違い：10K=100・16K=100・20K=100'},
      {cat:'A', pclass:'5K', nom:'40A', od:120, pcd:95, boltN:4, boltSize:'M12', boltL:null, torque:{w:22.3, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'49×83', packMat:'NBR/EPDM ほか', compatKey:'5K-40A', compatFlag:'ng', note:'PCD違い：10K=105・16K=105・20K=105'},
      {cat:'A', pclass:'5K', nom:'50A', od:130, pcd:105, boltN:4, boltSize:'M12', boltL:null, torque:{w:24.3, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'61×93', packMat:'NBR/EPDM ほか', compatKey:'5K-50A', compatFlag:'ng', note:'PCD違い：10K=120・16K=120・20K=120'},
      {cat:'A', pclass:'5K', nom:'65A', od:155, pcd:130, boltN:4, boltSize:'M12', boltL:null, torque:{w:34.9, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'84×118', packMat:'NBR/EPDM ほか', compatKey:'5K-65A', compatFlag:'ng', note:'PCD違い：10K=140・16K=140・20K=140'},
      {cat:'A', pclass:'5K', nom:'80A', od:180, pcd:145, boltN:4, boltSize:'M16', boltL:null, torque:{w:60.4, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'90×129', packMat:'NBR/EPDM ほか', compatKey:'5K-80A', compatFlag:'ng', note:'PCD違い：10K=150・16K=160・20K=160'},
      {cat:'A', pclass:'5K', nom:'100A', od:200, pcd:165, boltN:8, boltSize:'M16', boltL:null, torque:{w:30.7, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'115×149', packMat:'NBR/EPDM ほか', compatKey:'5K-100A', compatFlag:'ng', note:'PCD違い：10K=175・16K=185・20K=185'},
      {cat:'A', pclass:'5K', nom:'125A', od:235, pcd:200, boltN:8, boltSize:'M16', boltL:null, torque:{w:51.2, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'141×184', packMat:'NBR/EPDM ほか', compatKey:'5K-125A', compatFlag:'ng', note:'PCD違い：10K=210・16K=225・20K=225'},
      {cat:'A', pclass:'5K', nom:'150A', od:265, pcd:230, boltN:8, boltSize:'M16', boltL:null, torque:{w:67.2, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'167×214', packMat:'NBR/EPDM ほか', compatKey:'5K-150A', compatFlag:'ng', note:'PCD違い：10K=240・16K=260・20K=260'},
      {cat:'A', pclass:'5K', nom:'200A', od:320, pcd:280, boltN:8, boltSize:'M20', boltL:null, torque:{w:92.2, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'218×260', packMat:'NBR/EPDM ほか', compatKey:'5K-200A', compatFlag:'ng', note:'PCD違い：10K=290・16K=305・20K=305'},
      {cat:'A', pclass:'5K', nom:'250A', od:385, pcd:345, boltN:12, boltSize:'M20', boltL:null, torque:{w:106, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'270×325', packMat:'NBR/EPDM ほか', compatKey:'5K-250A', compatFlag:'ng', note:'PCD違い：10K=355・16K=380・20K=380'},
      {cat:'A', pclass:'5K', nom:'300A', od:430, pcd:390, boltN:12, boltSize:'M20', boltL:null, torque:{w:102, g:null, src:'ニチアス TOMBO No.1133 表'}, packOD:'321×370', packMat:'NBR/EPDM ほか', compatKey:'5K-300A', compatFlag:'ng', note:'PCD違い：10K=400・16K=430・20K=430'},
      // ═══ A: JIS 10K（JIS B 2220）═══
      {cat:'A', pclass:'10K', nom:'10A', od:90, pcd:65, boltN:4, boltSize:'M12', boltL:null, torque:{w:12.4, g:29.0, src:'ニチアス ジョイントシート表'}, packOD:'18×53', packMat:'NBR/EPDM ほか', compatKey:'10K-10A', compatFlag:'warn', note:'接合寸法同一：16K・20K。PCD違い：5K=55'},
      {cat:'A', pclass:'10K', nom:'15A', od:95, pcd:70, boltN:4, boltSize:'M12', boltL:null, torque:{w:14.7, g:34.2, src:'ニチアス ジョイントシート表'}, packOD:'22×58', packMat:'NBR/EPDM ほか', compatKey:'10K-15A', compatFlag:'warn', note:'接合寸法同一：16K・20K。PCD違い：5K=60'},
      {cat:'A', pclass:'10K', nom:'20A', od:100, pcd:75, boltN:4, boltSize:'M12', boltL:null, torque:{w:16.3, g:38.0, src:'ニチアス ジョイントシート表'}, packOD:'28×63', packMat:'NBR/EPDM ほか', compatKey:'10K-20A', compatFlag:'warn', note:'接合寸法同一：16K・20K。PCD違い：5K=65'},
      {cat:'A', pclass:'10K', nom:'25A', od:125, pcd:90, boltN:4, boltSize:'M16', boltL:null, torque:{w:30.1, g:70.3, src:'ニチアス ジョイントシート表'}, packOD:'35×74', packMat:'NBR/EPDM ほか', compatKey:'10K-25A', compatFlag:'warn', note:'接合寸法同一：16K・20K。PCD違い：5K=75'},
      {cat:'A', pclass:'10K', nom:'32A', od:135, pcd:100, boltN:4, boltSize:'M16', boltL:null, torque:{w:36.3, g:84.6, src:'ニチアス ジョイントシート表'}, packOD:'43×84', packMat:'NBR/EPDM ほか', compatKey:'10K-32A', compatFlag:'warn', note:'接合寸法同一：16K・20K。PCD違い：5K=90'},
      {cat:'A', pclass:'10K', nom:'40A', od:140, pcd:105, boltN:4, boltSize:'M16', boltL:null, torque:{w:38.4, g:89.7, src:'ニチアス ジョイントシート表'}, packOD:'49×89', packMat:'NBR/EPDM ほか', compatKey:'10K-40A', compatFlag:'warn', note:'接合寸法同一：16K・20K。PCD違い：5K=95'},
      {cat:'A', pclass:'10K', nom:'50A', od:155, pcd:120, boltN:4, boltSize:'M16', boltL:null, torque:{w:50.8, g:118, src:'ニチアス ジョイントシート表'}, packOD:'61×104', packMat:'NBR/EPDM ほか', compatKey:'10K-50A', compatFlag:'warn', note:'PCD同じだが本数/ボルト違い：16K(8-M16)・20K(8-M16)。PCD違い：5K=105'},
      {cat:'A', pclass:'10K', nom:'65A', od:175, pcd:140, boltN:4, boltSize:'M16', boltL:null, torque:{w:59.1, g:138, src:'ニチアス ジョイントシート表'}, packOD:'84×124', packMat:'NBR/EPDM ほか', compatKey:'10K-65A', compatFlag:'warn', note:'PCD同じだが本数/ボルト違い：16K(8-M16)・20K(8-M16)。PCD違い：5K=130'},
      {cat:'A', pclass:'10K', nom:'80A', od:185, pcd:150, boltN:8, boltSize:'M16', boltL:null, torque:{w:35.9, g:83.8, src:'ニチアス ジョイントシート表'}, packOD:'90×134', packMat:'NBR/EPDM ほか', compatKey:'10K-80A', compatFlag:'ng', note:'PCD違い：5K=145・16K=160・20K=160'},
      {cat:'A', pclass:'10K', nom:'100A', od:210, pcd:175, boltN:8, boltSize:'M16', boltL:null, torque:{w:44.2, g:103, src:'ニチアス ジョイントシート表'}, packOD:'115×159', packMat:'NBR/EPDM ほか', compatKey:'10K-100A', compatFlag:'ng', note:'PCD違い：5K=165・16K=185・20K=185'},
      {cat:'A', pclass:'10K', nom:'125A', od:250, pcd:210, boltN:8, boltSize:'M20', boltL:null, torque:{w:76.4, g:178, src:'ニチアス ジョイントシート表'}, packOD:'141×190', packMat:'NBR/EPDM ほか', compatKey:'10K-125A', compatFlag:'ng', note:'PCD違い：5K=200・16K=225・20K=225'},
      {cat:'A', pclass:'10K', nom:'150A', od:280, pcd:240, boltN:8, boltSize:'M20', boltL:null, torque:{w:98.5, g:230, src:'ニチアス ジョイントシート表'}, packOD:'167×220', packMat:'NBR/EPDM ほか', compatKey:'10K-150A', compatFlag:'ng', note:'PCD違い：5K=230・16K=260・20K=260'},
      {cat:'A', pclass:'10K', nom:'200A', od:330, pcd:290, boltN:12, boltSize:'M20', boltL:null, torque:{w:81.3, g:190, src:'ニチアス ジョイントシート表'}, packOD:'218×270', packMat:'NBR/EPDM ほか', compatKey:'10K-200A', compatFlag:'ng', note:'PCD違い：5K=280・16K=305・20K=305'},
      {cat:'A', pclass:'10K', nom:'250A', od:400, pcd:355, boltN:12, boltSize:'M22', boltL:null, torque:{w:136, g:317, src:'ニチアス ジョイントシート表'}, packOD:'270×333', packMat:'NBR/EPDM ほか', compatKey:'10K-250A', compatFlag:'ng', note:'PCD違い：5K=345・16K=380・20K=380'},
      {cat:'A', pclass:'10K', nom:'300A', od:445, pcd:400, boltN:16, boltSize:'M22', boltL:null, torque:{w:103, g:240, src:'ニチアス ジョイントシート表'}, packOD:'321×378', packMat:'NBR/EPDM ほか', compatKey:'10K-300A', compatFlag:'ng', note:'PCD違い：5K=390・16K=430・20K=430'},
      // ═══ A: JIS 16K（JIS B 2220）═══
      {cat:'A', pclass:'16K', nom:'10A', od:90, pcd:65, boltN:4, boltSize:'M12', boltL:null, torque:{w:12.4, g:29.0, src:'ニチアス TOMBO No.1133 表'}, packOD:'18×53', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-10A', compatFlag:'warn', note:'接合寸法同一：10K・20K。PCD違い：5K=55'},
      {cat:'A', pclass:'16K', nom:'15A', od:95, pcd:70, boltN:4, boltSize:'M12', boltL:null, torque:{w:14.7, g:34.2, src:'ニチアス TOMBO No.1133 表'}, packOD:'22×58', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-15A', compatFlag:'warn', note:'接合寸法同一：10K・20K。PCD違い：5K=60'},
      {cat:'A', pclass:'16K', nom:'20A', od:100, pcd:75, boltN:4, boltSize:'M12', boltL:null, torque:{w:16.3, g:38.0, src:'ニチアス TOMBO No.1133 表'}, packOD:'28×63', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-20A', compatFlag:'warn', note:'接合寸法同一：10K・20K。PCD違い：5K=65'},
      {cat:'A', pclass:'16K', nom:'25A', od:125, pcd:90, boltN:4, boltSize:'M16', boltL:null, torque:{w:30.1, g:70.3, src:'ニチアス TOMBO No.1133 表'}, packOD:'35×74', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-25A', compatFlag:'warn', note:'接合寸法同一：10K・20K。PCD違い：5K=75'},
      {cat:'A', pclass:'16K', nom:'32A', od:135, pcd:100, boltN:4, boltSize:'M16', boltL:null, torque:{w:36.3, g:84.6, src:'ニチアス TOMBO No.1133 表'}, packOD:'43×84', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-32A', compatFlag:'warn', note:'接合寸法同一：10K・20K。PCD違い：5K=90'},
      {cat:'A', pclass:'16K', nom:'40A', od:140, pcd:105, boltN:4, boltSize:'M16', boltL:null, torque:{w:38.4, g:89.7, src:'ニチアス TOMBO No.1133 表'}, packOD:'49×89', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-40A', compatFlag:'warn', note:'接合寸法同一：10K・20K。PCD違い：5K=95'},
      {cat:'A', pclass:'16K', nom:'50A', od:155, pcd:120, boltN:8, boltSize:'M16', boltL:null, torque:{w:25.4, g:59.2, src:'ニチアス TOMBO No.1133 表'}, packOD:'61×104', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-50A', compatFlag:'warn', note:'接合寸法同一：20K。PCD同じだが本数/ボルト違い：10K(4-M16)。PCD違い：5K=105'},
      {cat:'A', pclass:'16K', nom:'65A', od:175, pcd:140, boltN:8, boltSize:'M16', boltL:null, torque:{w:32.3, g:69.0, src:'ニチアス TOMBO No.1133 表'}, packOD:'84×124', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-65A', compatFlag:'warn', note:'接合寸法同一：20K。PCD同じだが本数/ボルト違い：10K(4-M16)。PCD違い：5K=130'},
      {cat:'A', pclass:'16K', nom:'80A', od:200, pcd:160, boltN:8, boltSize:'M20', boltL:null, torque:{w:53.8, g:126, src:'ニチアス TOMBO No.1133 表'}, packOD:'90×140', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-80A', compatFlag:'warn', note:'接合寸法同一：20K。PCD違い：5K=145・10K=150'},
      {cat:'A', pclass:'16K', nom:'100A', od:225, pcd:185, boltN:8, boltSize:'M20', boltL:null, torque:{w:72.3, g:167, src:'ニチアス TOMBO No.1133 表'}, packOD:'115×165', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-100A', compatFlag:'warn', note:'接合寸法同一：20K。PCD違い：5K=165・10K=175'},
      {cat:'A', pclass:'16K', nom:'125A', od:270, pcd:225, boltN:8, boltSize:'M22', boltL:null, torque:{w:115, g:269, src:'ニチアス TOMBO No.1133 表'}, packOD:'141×203', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-125A', compatFlag:'warn', note:'接合寸法同一：20K。PCD違い：5K=200・10K=210'},
      {cat:'A', pclass:'16K', nom:'150A', od:305, pcd:260, boltN:12, boltSize:'M22', boltL:null, torque:{w:106, g:247, src:'ニチアス TOMBO No.1133 表'}, packOD:'167×238', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-150A', compatFlag:'warn', note:'接合寸法同一：20K。PCD違い：5K=230・10K=240'},
      {cat:'A', pclass:'16K', nom:'200A', od:350, pcd:305, boltN:12, boltSize:'M22', boltL:null, torque:{w:134, g:278, src:'ニチアス TOMBO No.1133 表'}, packOD:'218×283', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-200A', compatFlag:'warn', note:'接合寸法同一：20K。PCD違い：5K=280・10K=290'},
      {cat:'A', pclass:'16K', nom:'250A', od:430, pcd:380, boltN:12, boltSize:'M24', boltL:null, torque:{w:224, g:497, src:'ニチアス TOMBO No.1133 表'}, packOD:'270×356', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-250A', compatFlag:'warn', note:'接合寸法同一：20K。PCD違い：5K=345・10K=355'},
      {cat:'A', pclass:'16K', nom:'300A', od:480, pcd:430, boltN:16, boltSize:'M24', boltL:null, torque:{w:210, g:428, src:'ニチアス TOMBO No.1133 表'}, packOD:'321×406', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'16K-300A', compatFlag:'warn', note:'接合寸法同一：20K。PCD違い：5K=390・10K=400'},
      // ═══ A: JIS 20K（JIS B 2220）═══
      {cat:'A', pclass:'20K', nom:'10A', od:90, pcd:65, boltN:4, boltSize:'M12', boltL:null, torque:{w:14, g:29, src:'ニチアス ジョイントシート表'}, packOD:'18×53', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-10A', compatFlag:'warn', note:'接合寸法同一：10K・16K。PCD違い：5K=55'},
      {cat:'A', pclass:'20K', nom:'15A', od:95, pcd:70, boltN:4, boltSize:'M12', boltL:null, torque:{w:16, g:34, src:'ニチアス ジョイントシート表'}, packOD:'22×58', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-15A', compatFlag:'warn', note:'接合寸法同一：10K・16K。PCD違い：5K=60'},
      {cat:'A', pclass:'20K', nom:'20A', od:100, pcd:75, boltN:4, boltSize:'M12', boltL:null, torque:{w:19, g:38, src:'ニチアス ジョイントシート表'}, packOD:'28×63', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-20A', compatFlag:'warn', note:'接合寸法同一：10K・16K。PCD違い：5K=65'},
      {cat:'A', pclass:'20K', nom:'25A', od:125, pcd:90, boltN:4, boltSize:'M16', boltL:null, torque:{w:34, g:70, src:'ニチアス ジョイントシート表'}, packOD:'35×74', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-25A', compatFlag:'warn', note:'接合寸法同一：10K・16K。PCD違い：5K=75'},
      {cat:'A', pclass:'20K', nom:'32A', od:135, pcd:100, boltN:4, boltSize:'M16', boltL:null, torque:{w:42, g:85, src:'ニチアス ジョイントシート表'}, packOD:'43×84', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-32A', compatFlag:'warn', note:'接合寸法同一：10K・16K。PCD違い：5K=90'},
      {cat:'A', pclass:'20K', nom:'40A', od:140, pcd:105, boltN:4, boltSize:'M16', boltL:null, torque:{w:46, g:90, src:'ニチアス ジョイントシート表'}, packOD:'49×89', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-40A', compatFlag:'warn', note:'接合寸法同一：10K・16K。PCD違い：5K=95'},
      {cat:'A', pclass:'20K', nom:'50A', od:155, pcd:120, boltN:8, boltSize:'M16', boltL:null, torque:{w:31, g:59, src:'ニチアス ジョイントシート表'}, packOD:'61×104', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-50A', compatFlag:'warn', note:'接合寸法同一：16K。PCD同じだが本数/ボルト違い：10K(4-M16)。PCD違い：5K=105'},
      {cat:'A', pclass:'20K', nom:'65A', od:175, pcd:140, boltN:8, boltSize:'M16', boltL:null, torque:{w:40, g:69, src:'ニチアス ジョイントシート表'}, packOD:'84×124', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-65A', compatFlag:'warn', note:'接合寸法同一：16K。PCD同じだが本数/ボルト違い：10K(4-M16)。PCD違い：5K=130'},
      {cat:'A', pclass:'20K', nom:'80A', od:200, pcd:160, boltN:8, boltSize:'M20', boltL:null, torque:{w:66, g:126, src:'ニチアス ジョイントシート表'}, packOD:'90×140', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-80A', compatFlag:'warn', note:'接合寸法同一：16K。PCD違い：5K=145・10K=150'},
      {cat:'A', pclass:'20K', nom:'100A', od:225, pcd:185, boltN:8, boltSize:'M20', boltL:null, torque:{w:91, g:167, src:'ニチアス ジョイントシート表'}, packOD:'115×165', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-100A', compatFlag:'warn', note:'接合寸法同一：16K。PCD違い：5K=165・10K=175'},
      {cat:'A', pclass:'20K', nom:'125A', od:270, pcd:225, boltN:8, boltSize:'M22', boltL:null, torque:{w:142, g:269, src:'ニチアス ジョイントシート表'}, packOD:'141×203', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-125A', compatFlag:'warn', note:'接合寸法同一：16K。PCD違い：5K=200・10K=210'},
      {cat:'A', pclass:'20K', nom:'150A', od:305, pcd:260, boltN:12, boltSize:'M22', boltL:null, torque:{w:127, g:247, src:'ニチアス ジョイントシート表'}, packOD:'167×238', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-150A', compatFlag:'warn', note:'接合寸法同一：16K。PCD違い：5K=230・10K=240'},
      {cat:'A', pclass:'20K', nom:'200A', od:350, pcd:305, boltN:12, boltSize:'M22', boltL:null, torque:{w:168, g:278, src:'ニチアス ジョイントシート表'}, packOD:'218×283', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-200A', compatFlag:'warn', note:'接合寸法同一：16K。PCD違い：5K=280・10K=290'},
      {cat:'A', pclass:'20K', nom:'250A', od:430, pcd:380, boltN:12, boltSize:'M24', boltL:null, torque:{w:280, g:497, src:'ニチアス ジョイントシート表'}, packOD:'270×356', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-250A', compatFlag:'warn', note:'接合寸法同一：16K。PCD違い：5K=345・10K=355'},
      {cat:'A', pclass:'20K', nom:'300A', od:480, pcd:430, boltN:16, boltSize:'M24', boltL:null, torque:{w:264, g:428, src:'ニチアス ジョイントシート表'}, packOD:'321×406', packMat:'ジョイントシート/PTFE/グラファイト ほか', compatKey:'20K-300A', compatFlag:'warn', note:'接合寸法同一：16K。PCD違い：5K=390・10K=400'},
      {cat:'B', pclass:'NW',  nom:'NW10', od:30,pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'12.5×6',  packMat:'NBR/FKM/Viton',compatKey:'NW-10', compatFlag:'ok',note:'KF(ISO 2861)：センタリングリング＋クランプ。NW10/16は外径30で共通'},
      {cat:'B', pclass:'NW',  nom:'NW16', od:30,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'19×12',   packMat:'NBR/FKM',      compatKey:'NW-16', compatFlag:'ok',note:'NW10と同外径（センタリングリングで区別）'},
      {cat:'B', pclass:'NW',  nom:'NW25', od:40,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'30×18',   packMat:'NBR/FKM',      compatKey:'NW-25', compatFlag:'ok',note:'最も一般的な真空規格。研究・分析機器に多用'},
      {cat:'B', pclass:'NW',  nom:'NW32', od:50,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'38×24',   packMat:'NBR/FKM',      compatKey:'NW-32', compatFlag:'ok',note:'⚠KF規格に32は通常なし（要確認）'},
      {cat:'B', pclass:'NW',  nom:'NW40', od:55,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'45×30',   packMat:'NBR/FKM',      compatKey:'NW-40', compatFlag:'ok',note:'ターボポンプ排気口等に使用'},
      {cat:'B', pclass:'NW',  nom:'NW50', od:75,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'57×38',   packMat:'NBR/FKM',      compatKey:'NW-50', compatFlag:'ok',note:''},
      {cat:'B', pclass:'NW',  nom:'NW63', od:83,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'71×50',   packMat:'NBR/FKM',      compatKey:'NW-63', compatFlag:'ok',note:'⚠KFは50まで。63以上はISO-K/F（要確認）'},
      {cat:'B', pclass:'ISO-F',nom:'ISO63', od:130,pcd:110,boltN:4, boltSize:'M8', boltL:null, torque:null, packOD:'センタリングリング外径70', packMat:'NBR/FKM',compatKey:'ISO-63',compatFlag:'ok',note:'ISO-F(ISO 1609＝JIS B 2290本体)：ボルト締め。Oリング＋センタリングリング。寸法は Kurt J. Lesker ほか規格表で照合'},
      {cat:'B', pclass:'ISO-F',nom:'ISO80', od:145,pcd:125,boltN:8, boltSize:'M8', boltL:null, torque:null, packOD:'センタリングリング外径83', packMat:'NBR/FKM',compatKey:'ISO-80',compatFlag:'ok',note:''},
      {cat:'B', pclass:'ISO-F',nom:'ISO100', od:165,pcd:145,boltN:8, boltSize:'M8', boltL:null, torque:null, packOD:'センタリングリング外径102', packMat:'NBR/FKM',compatKey:'ISO-100',compatFlag:'ok',note:''},
      {cat:'B', pclass:'ISO-F',nom:'ISO160', od:225,pcd:200,boltN:8, boltSize:'M10', boltL:null, torque:null, packOD:'センタリングリング外径153', packMat:'NBR/FKM',compatKey:'ISO-160',compatFlag:'ok',note:''},
      {cat:'B', pclass:'ISO-F',nom:'ISO200', od:285,pcd:260,boltN:12, boltSize:'M10', boltL:null, torque:null, packOD:'センタリングリング外径213', packMat:'NBR/FKM',compatKey:'ISO-200',compatFlag:'ok',note:''},
      {cat:'B', pclass:'ICF',  nom:'ICF34',  od:34,pcd:27,boltN:6,boltSize:'M4',  boltL:null, torque:null,   packOD:'メタルOリング',packMat:'Al/Cu',       compatKey:'ICF-34', compatFlag:'ok',note:'ICF(ConFlat)：メタルガスケット・ナイフエッジ。超高真空用（外径・PCD・ボルトはミスミ規格表で照合。締付はガスケットメーカー指示）'},
      {cat:'B', pclass:'ICF',  nom:'ICF70',  od:70,  pcd:58.7,boltN:6,boltSize:'M6',  boltL:null, torque:null,   packOD:'メタルOリング',packMat:'Al/Cu',       compatKey:'ICF-70', compatFlag:'ok',note:'超高真空専用。フランジ面傷つけ厳禁'},
      {cat:'B', pclass:'ICF',  nom:'ICF114', od:114, pcd:92.1, boltN:8,boltSize:'M8',  boltL:null, torque:null,   packOD:'メタルOリング',packMat:'Al/Cu',       compatKey:'ICF-114',compatFlag:'ok',note:'半導体・研究装置の高真空配管で標準'},
      {cat:'B', pclass:'ICF',  nom:'ICF152', od:152, pcd:130.2, boltN:16,boltSize:'M8', boltL:null, torque:null,   packOD:'メタルOリング',packMat:'Al/Cu',       compatKey:'ICF-152',compatFlag:'ok',note:''},
      // ═══ B: JIS 真空フランジ VG/VF（JIS B 2290:1998 附属書＝旧JIS 1968、国内で一般的）═══
      // 2026-09 バルカー寸法編「真空装置用フランジの溝寸法」で全面差替え（旧データは呼び・寸法とも規格にない値だった）
      // od=D, pcd=C, 厚さT（その他のフランジ）、ボルト材 SS400。boltL＝VG+VF 2枚締めの首下目安（2T＋座金2枚＋ナット高さ＋3山、5mm切上げ）
      {cat:'B', pclass:'JIS-F', nom:'10A（VG/VF10）', od:70, pcd:50, boltN:4, boltSize:'M8', boltL:30, torque:null, packOD:'Oリング V24', packMat:'NBR/FKM', compatKey:'JISVG-10', compatFlag:'ok', note:'厚さT8・適用管外径17.3。溝 G1=24・G2=34・深さ3（Oリング V24）。VG（溝付き）＋VF（溝なし）で組む。ISO（JIS B 2290本体）とは寸法が異なり互換なし'},
      {cat:'B', pclass:'JIS-F', nom:'20A（VG/VF20）', od:80, pcd:60, boltN:4, boltSize:'M8', boltL:30, torque:null, packOD:'Oリング V34', packMat:'NBR/FKM', compatKey:'JISVG-20', compatFlag:'ok', note:'厚さT8・適用管外径27.2。溝 G1=34・G2=44・深さ3（Oリング V34）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'25A（VG/VF25）', od:90, pcd:70, boltN:4, boltSize:'M8', boltL:30, torque:null, packOD:'Oリング V40', packMat:'NBR/FKM', compatKey:'JISVG-25', compatFlag:'ok', note:'厚さT8・適用管外径34。溝 G1=40・G2=50・深さ3（Oリング V40）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'40A（VG/VF40）', od:105, pcd:85, boltN:4, boltSize:'M8', boltL:35, torque:null, packOD:'Oリング V55', packMat:'NBR/FKM', compatKey:'JISVG-40', compatFlag:'ok', note:'厚さT10・適用管外径48.6。溝 G1=55・G2=65・深さ3（Oリング V55）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'50A（VG/VF50）', od:120, pcd:100, boltN:4, boltSize:'M8', boltL:35, torque:null, packOD:'Oリング V70', packMat:'NBR/FKM', compatKey:'JISVG-50', compatFlag:'ok', note:'厚さT10・適用管外径60.5。溝 G1=70・G2=80・深さ3（Oリング V70）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'65A（VG/VF65）', od:145, pcd:120, boltN:4, boltSize:'M10', boltL:40, torque:null, packOD:'Oリング V85', packMat:'NBR/FKM', compatKey:'JISVG-65', compatFlag:'ok', note:'厚さT10・適用管外径76.3。溝 G1=85・G2=95・深さ3（Oリング V85）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'80A（VG/VF80）', od:160, pcd:135, boltN:4, boltSize:'M10', boltL:45, torque:null, packOD:'Oリング V100', packMat:'NBR/FKM', compatKey:'JISVG-80', compatFlag:'ok', note:'厚さT12・適用管外径89.1。溝 G1=100・G2=110・深さ3（Oリング V100）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'100A（VG/VF100）', od:185, pcd:160, boltN:8, boltSize:'M10', boltL:45, torque:null, packOD:'Oリング V120', packMat:'NBR/FKM', compatKey:'JISVG-100', compatFlag:'ok', note:'厚さT12・適用管外径114.3。溝 G1=120・G2=130・深さ3（Oリング V120）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'125A（VG/VF125）', od:210, pcd:185, boltN:8, boltSize:'M10', boltL:45, torque:null, packOD:'Oリング V150', packMat:'NBR/FKM', compatKey:'JISVG-125', compatFlag:'ok', note:'厚さT12・適用管外径139.8。溝 G1=150・G2=160・深さ3（Oリング V150）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'150A（VG/VF150）', od:235, pcd:210, boltN:8, boltSize:'M10', boltL:45, torque:null, packOD:'Oリング V175', packMat:'NBR/FKM', compatKey:'JISVG-150', compatFlag:'ok', note:'厚さT12・適用管外径165.2。溝 G1=175・G2=185・深さ3（Oリング V175）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'200A（VG/VF200）', od:300, pcd:270, boltN:8, boltSize:'M12', boltL:55, torque:null, packOD:'Oリング V225', packMat:'NBR/FKM', compatKey:'JISVG-200', compatFlag:'ok', note:'厚さT16・適用管外径216.3。溝 G1=225・G2=241・深さ4.5（Oリング V225）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'250A（VG/VF250）', od:350, pcd:320, boltN:12, boltSize:'M12', boltL:55, torque:null, packOD:'Oリング V275', packMat:'NBR/FKM', compatKey:'JISVG-250', compatFlag:'ok', note:'厚さT16・適用管外径267.4。溝 G1=275・G2=291・深さ4.5（Oリング V275）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'300A（VG/VF300）', od:400, pcd:370, boltN:12, boltSize:'M12', boltL:55, torque:null, packOD:'Oリング V325', packMat:'NBR/FKM', compatKey:'JISVG-300', compatFlag:'ok', note:'厚さT16・適用管外径318.5。溝 G1=325・G2=341・深さ4.5（Oリング V325）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'350A（VG/VF350）', od:450, pcd:420, boltN:12, boltSize:'M12', boltL:60, torque:null, packOD:'Oリング V380', packMat:'NBR/FKM', compatKey:'JISVG-350', compatFlag:'ok', note:'厚さT20・適用管外径355.6。溝 G1=380・G2=396・深さ4.5（Oリング V380）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'400A（VG/VF400）', od:520, pcd:480, boltN:12, boltSize:'M16', boltL:70, torque:null, packOD:'Oリング V430', packMat:'NBR/FKM', compatKey:'JISVG-400', compatFlag:'ok', note:'厚さT20・適用管外径406.4。溝 G1=430・G2=446・深さ4.5（Oリング V430）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'450A（VG/VF450）', od:575, pcd:535, boltN:16, boltSize:'M16', boltL:70, torque:null, packOD:'Oリング V480', packMat:'NBR/FKM', compatKey:'JISVG-450', compatFlag:'ok', note:'厚さT20・適用管外径457.2。溝 G1=480・G2=504・深さ7（Oリング V480）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'B', pclass:'JIS-F', nom:'500A（VG/VF500）', od:625, pcd:585, boltN:16, boltSize:'M16', boltL:70, torque:null, packOD:'Oリング V530', packMat:'NBR/FKM', compatKey:'JISVG-500', compatFlag:'ok', note:'厚さT22・適用管外径508。溝 G1=530・G2=554・深さ7（Oリング V530）。VG（溝付き）＋VF（溝なし）で組む'},
      {cat:'C', pclass:'R',   nom:'R1/8',  od:null,pcd:null,boltN:0,boltSize:'—',    boltL:null,torque:null,packOD:'テーパーシール',packMat:'PTFE/麻',     compatKey:'R-1/8',  compatFlag:'ok',note:'Rねじ（旧PT）テーパーオスねじ。Rcねじと組み合わせ'},
      {cat:'C', pclass:'R',   nom:'R1/4',  od:null,pcd:null,boltN:0,boltSize:'—',    boltL:null,torque:null,packOD:'テーパーシール',packMat:'PTFE/麻',     compatKey:'R-1/4',  compatFlag:'ok',note:'最も一般的な計装・エア配管サイズ'},
      {cat:'C', pclass:'R',   nom:'R3/8',  od:null,pcd:null,boltN:0,boltSize:'—',    boltL:null,torque:null,packOD:'テーパーシール',packMat:'PTFE/麻',     compatKey:'R-3/8',  compatFlag:'ok',note:''},
      {cat:'C', pclass:'R',   nom:'R1/2',  od:null,pcd:null,boltN:0,boltSize:'—',    boltL:null,torque:null,packOD:'テーパーシール',packMat:'PTFE/麻',     compatKey:'R-1/2',  compatFlag:'ok',note:''},
      {cat:'C', pclass:'R',   nom:'R3/4',  od:null,pcd:null,boltN:0,boltSize:'—',    boltL:null,torque:null,packOD:'テーパーシール',packMat:'PTFE/麻',     compatKey:'R-3/4',  compatFlag:'ok',note:''},
      {cat:'C', pclass:'R',   nom:'R1',    od:null,pcd:null,boltN:0,boltSize:'—',    boltL:null,torque:null,packOD:'テーパーシール',packMat:'PTFE/麻',     compatKey:'R-1',    compatFlag:'ok',note:''},
      {cat:'C', pclass:'R',   nom:'R1-1/2',od:null,pcd:null,boltN:0,boltSize:'—',    boltL:null,torque:null,packOD:'テーパーシール',packMat:'PTFE/麻',     compatKey:'R-1h',   compatFlag:'ok',note:''},
      {cat:'C', pclass:'R',   nom:'R2',    od:null,pcd:null,boltN:0,boltSize:'—',    boltL:null,torque:null,packOD:'テーパーシール',packMat:'PTFE/麻',     compatKey:'R-2',    compatFlag:'ok',note:''},
      {cat:'C', pclass:'SWG', nom:'1/8"',  od:null,pcd:null,boltN:0,boltSize:'ナット',boltL:null,torque:5,   packOD:'フェルール',  packMat:'SS316',       compatKey:'SWG-1/8',compatFlag:'ok',note:'Swagelokフェルール継手。配管外径に直接接続。計装・高圧ガス配管'},
      {cat:'C', pclass:'SWG', nom:'1/4"',  od:null,pcd:null,boltN:0,boltSize:'ナット',boltL:null,torque:8,   packOD:'フェルール',  packMat:'SS316',       compatKey:'SWG-1/4',compatFlag:'ok',note:'最汎用サイズ。1-1/4回転締め込みルール'},
      {cat:'C', pclass:'SWG', nom:'3/8"',  od:null,pcd:null,boltN:0,boltSize:'ナット',boltL:null,torque:12,  packOD:'フェルール',  packMat:'SS316',       compatKey:'SWG-3/8',compatFlag:'ok',note:''},
      {cat:'C', pclass:'SWG', nom:'1/2"',  od:null,pcd:null,boltN:0,boltSize:'ナット',boltL:null,torque:20,  packOD:'フェルール',  packMat:'SS316',       compatKey:'SWG-1/2',compatFlag:'ok',note:''},
      {cat:'C', pclass:'SWG', nom:'3/4"',  od:null,pcd:null,boltN:0,boltSize:'ナット',boltL:null,torque:35,  packOD:'フェルール',  packMat:'SS316',       compatKey:'SWG-3/4',compatFlag:'ok',note:''},
      {cat:'C', pclass:'SWG', nom:'1"',    od:null,pcd:null,boltN:0,boltSize:'ナット',boltL:null,torque:55,  packOD:'フェルール',  packMat:'SS316',       compatKey:'SWG-1',  compatFlag:'ok',note:'VCR接続も選択肢として検討'},
      // ═══ D: 衛生・サニタリー系（ISO 2852 / JIS B 2808） ═══
      {cat:'D', pclass:'SAN', nom:'1.5"(38A)',od:50.5,pcd:null,boltN:0,boltSize:'クランプ',boltL:null,torque:null,packOD:'38×28',   packMat:'EPDM/PTFE/FKM',compatKey:'SAN-1.5',compatFlag:'ok',note:'サニタリークランプ（ISO 2852）。食品・飲料・医薬に標準。分解清掃容易'},
      {cat:'D', pclass:'SAN', nom:'2"(51A)', od:64,  pcd:null,boltN:0,boltSize:'クランプ',boltL:null,torque:null,packOD:'52×38',   packMat:'EPDM/PTFE/FKM',compatKey:'SAN-2',  compatFlag:'ok',note:'最も一般的なサニタリーサイズ。Tri-Clampとも呼ばれる'},
      {cat:'D', pclass:'SAN', nom:'2.5"(63A)',od:77.5,pcd:null,boltN:0,boltSize:'クランプ',boltL:null,torque:null,packOD:'66×50',   packMat:'EPDM/PTFE/FKM',compatKey:'SAN-2.5',compatFlag:'ok',note:''},
      {cat:'D', pclass:'SAN', nom:'3"(76A)', od:91,  pcd:null,boltN:0,boltSize:'クランプ',boltL:null,torque:null,packOD:'79×62',   packMat:'EPDM/PTFE/FKM',compatKey:'SAN-3',  compatFlag:'ok',note:'CIP洗浄・SIP滅菌対応配管で標準的使用'},
      {cat:'D', pclass:'SAN', nom:'4"(102A)',od:119, pcd:null,boltN:0,boltSize:'クランプ',boltL:null,torque:null,packOD:'106×84',  packMat:'EPDM/PTFE/FKM',compatKey:'SAN-4',  compatFlag:'ok',note:'大型タンクノズル、移送ライン'},
      {cat:'D', pclass:'SAN', nom:'6"(152A)',od:170, pcd:null,boltN:0,boltSize:'クランプ',boltL:null,torque:null,packOD:'158×128', packMat:'EPDM/PTFE/FKM',compatKey:'SAN-6',  compatFlag:'ok',note:'大型設備の移送ライン'},
    ];

    // カテゴリラベル
    const FL_CAT_LABEL = {A:'JIS', B:'真空', C:'ねじ込', D:'衛生'};
    const FL_CAT_COLOR = {A:'var(--accent)', B:'#a0c4ff', C:'var(--warn)', D:'var(--good)'};
