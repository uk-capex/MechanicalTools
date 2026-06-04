    function orFilter() {
      const series = document.getElementById('or-series').value;
      const query  = document.getElementById('or-search').value.trim().toUpperCase();
      const useF   = document.getElementById('or-use').value;
      const tbody  = document.getElementById('or-tbody');
      let rows = OR_DATA.filter(r => r.series === series);
      if (useF !== 'all') rows = rows.filter(r => r.use === useF);
      if (query) rows = rows.filter(r => r.id.includes(query) || String(r.d1).startsWith(query.replace('P','').replace('G','').replace('V','')));
      document.getElementById('or-count').textContent = `${rows.length} 件`;
      tbody.innerHTML = rows.map(r => {
        const bTxt = r.bDyn ? `${r.bDyn} / ${r.bSta}` : `— / ${r.bSta}`;
        const tTxt = r.tDyn ? `${r.tDyn} / ${r.tSta}` : `— / ${r.tSta}`;
        return `<tr onclick="orSelect(${JSON.stringify(r).replace(/"/g,'&quot;')})" style="cursor:pointer;">
          <td style="color:var(--accent);font-family:'JetBrains Mono',monospace;">${r.id}</td>
          <td>${r.d1}</td><td>${r.d2}</td>
          <td>${bTxt}</td><td>${tTxt}</td><td>${r.C}</td>
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
        溝幅 b: 動的 <b>${r.bDyn??'—'}</b> / 静的 <b>${r.bSta}</b> mm &nbsp;
        溝深さ t: 動的 <b>${r.tDyn??'—'}</b> / 静的 <b>${r.tSta}</b> mm<br>
        <span style="color:var(--muted);">→ 圧縮率計算タブへ自動入力するには下のボタンを</span>
        <button onclick="orToComp(${r.d2},${r.tSta??r.tDyn},${r.d1})" style="margin-left:8px;padding:2px 8px;background:var(--accent-dim);border:1px solid var(--accent);color:var(--accent);border-radius:4px;cursor:pointer;font-size:11px;">
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
        dynamic: {min:15, max:30, rec:'20%前後'},
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
        note:'価格はNBRの約10〜20倍。'
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
        good:['冷媒フロン','弱酸','アルカリ','海水','空気'],
        bad:['強酸','芳香族溶剤','ケトン'],
        feature:'耐フロン・耐候・難燃性あり。冷凍機・空調・屋外用。',
        note:'冷媒用Oリングとして重宝。'
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

    /* ── オイルシールデータ (JIS B 2402-1参考) ── */
    const OS_DATA = [
      // [d, D, B, ハウジング公差, 軸公差]
      [8,22,7,'H8','h8'],[10,22,7,'H8','h8'],[10,25,7,'H8','h8'],
      [12,22,7,'H8','h8'],[12,25,7,'H8','h8'],[12,30,7,'H8','h8'],
      [14,25,7,'H8','h8'],[15,25,7,'H8','h8'],[15,30,7,'H8','h8'],[15,35,7,'H8','h8'],
      [16,30,7,'H8','h8'],[17,30,7,'H8','h8'],[17,35,7,'H8','h8'],
      [18,30,7,'H8','h8'],[18,35,7,'H8','h8'],[20,35,7,'H8','h8'],
      [20,40,7,'H8','h8'],[20,47,7,'H8','h8'],[22,35,7,'H8','h8'],
      [22,40,7,'H8','h8'],[25,40,7,'H8','h8'],[25,47,7,'H8','h8'],
      [25,52,7,'H8','h8'],[28,47,7,'H8','h8'],[30,45,8,'H8','h8'],
      [30,47,8,'H8','h8'],[30,50,8,'H8','h8'],[30,52,8,'H8','h8'],
      [32,47,8,'H8','h8'],[32,52,8,'H8','h8'],[35,50,8,'H8','h8'],
      [35,52,8,'H8','h8'],[35,55,8,'H8','h8'],[35,62,8,'H8','h8'],
      [38,55,8,'H8','h8'],[40,55,8,'H8','h8'],[40,60,8,'H8','h8'],
      [40,62,8,'H8','h8'],[42,62,8,'H8','h8'],[45,60,8,'H8','h8'],
      [45,65,8,'H8','h8'],[45,68,10,'H8','h8'],[48,65,8,'H8','h8'],
      [50,65,8,'H8','h8'],[50,70,10,'H8','h8'],[50,72,10,'H8','h8'],
      [55,72,10,'H8','h8'],[55,80,10,'H8','h8'],[60,80,10,'H8','h8'],
      [60,85,10,'H8','h8'],[65,85,10,'H8','h8'],[65,90,10,'H8','h8'],
      [70,90,10,'H8','h8'],[70,95,10,'H8','h8'],[75,95,10,'H8','h8'],
      [75,100,10,'H8','h8'],[80,100,10,'H8','h8'],[80,105,10,'H8','h8'],
      [85,110,12,'H8','h8'],[90,115,12,'H8','h8'],[95,120,12,'H8','h8'],
      [100,125,12,'H8','h8'],[110,140,12,'H8','h8'],[120,150,15,'H8','h8'],
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
        const d = r[0], D = r[1], B = r[2];
        // 各種呼び番号を生成
        const tcCode  = `TC${d}×${D}×${B}`;           // 通称
        const jisCode = `JIS D ${d} ${D} ${B}`;         // JIS呼び記号
        const isoCode = `TYPE 4 ${d} ${D} ${B}`;        // ISO呼び記号
        // NOK品番: AE + d(3桁) + D(3桁) + E0  ※参考生成
        const nokCode = `AE${String(d).padStart(2,'0')}${String(D).padStart(3,'0')}E0`;
        // 武蔵: AD + 同様
        const muCode  = `AD${String(d).padStart(2,'0')}${String(D).padStart(3,'0')}E0`;
        return `<tr>
          <td style="color:var(--accent);font-family:'JetBrains Mono',monospace;font-weight:700;">${d}</td>
          <td>${D}</td><td>${B}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--ink);">${tcCode}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);">${jisCode}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);">${isoCode}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);">${nokCode}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);">${muCode}</td>
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
        pressRange:'〜35MPa（静的）、〜10MPa（動的）',
        speedRange:'往復動 1.5m/s以下推奨',
        temp:'-60〜+200℃（材質による）'
      },
      {
        name:'Uパッキン（リップパッキン）', icon:'🌙',
        use:['recipro'], press:['low','mid','high'],
        feature:'油圧・空圧シリンダの往復動に最適。方向性あり（片方向シール）。バックアップ不要。',
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
        pros:'高速回転対応・取り付け簡単・安価', cons:'高圧不可（通常0.05MPa以下）',
        pressRange:'〜0.05MPa（基本的に大気圧側）',
        speedRange:'周速4〜15m/s（型式による）',
        temp:'-40〜+150℃（NBR）'
      },
      {
        name:'メカニカルシール', icon:'⚙️',
        use:['rotate'], press:['low','mid','high'],
        feature:'回転機器（ポンプ・攪拌機）の完全密封。端面密封方式。漏れ最小。',
        pros:'低漏れ・高速・長寿命', cons:'高価・組み付け精度必要・冷却水要',
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
      // ═══ A: JIS 5K ═══
      {cat:'A', pclass:'5K',  nom:'10A',  od:75,  pcd:55,  boltN:4, boltSize:'M12', boltL:45,  torque:25,  packOD:'30×15',  packMat:'NBR/EPDM',  compatKey:'5K-10A',  compatFlag:'warn', note:'5K-10Aと10K-10AはPCD同じ(55mm)。ボルト本数同じなら共通化可能'},
      {cat:'A', pclass:'5K',  nom:'15A',  od:80,  pcd:60,  boltN:4, boltSize:'M12', boltL:45,  torque:25,  packOD:'36×20',  packMat:'NBR/EPDM',  compatKey:'5K-15A',  compatFlag:'warn', note:'10K-15AとPCD同じ(65mm)。10K兼用可の場合あり'},
      {cat:'A', pclass:'5K',  nom:'20A',  od:85,  pcd:65,  boltN:4, boltSize:'M12', boltL:45,  torque:25,  packOD:'42×26',  packMat:'NBR/EPDM',  compatKey:'5K-20A',  compatFlag:'warn', note:'10K-20AとPCD同じ(75mm)の場合あり。要確認'},
      {cat:'A', pclass:'5K',  nom:'25A',  od:95,  pcd:75,  boltN:4, boltSize:'M12', boltL:45,  torque:25,  packOD:'48×32',  packMat:'NBR/EPDM',  compatKey:'5K-25A',  compatFlag:'ng',   note:'10K-25AはPCD90mm。5K-25A(PCD75mm)と混用禁止'},
      {cat:'A', pclass:'5K',  nom:'32A',  od:115, pcd:90,  boltN:4, boltSize:'M16', boltL:55,  torque:60,  packOD:'58×40',  packMat:'NBR/EPDM',  compatKey:'5K-32A',  compatFlag:'ng',   note:'10K-32AはPCD100mm。混用禁止'},
      {cat:'A', pclass:'5K',  nom:'40A',  od:120, pcd:95,  boltN:4, boltSize:'M16', boltL:55,  torque:60,  packOD:'66×46',  packMat:'NBR/EPDM',  compatKey:'5K-40A',  compatFlag:'ng',   note:'10K-40AはPCD105mm。混用禁止'},
      {cat:'A', pclass:'5K',  nom:'50A',  od:130, pcd:105, boltN:4, boltSize:'M16', boltL:55,  torque:60,  packOD:'76×58',  packMat:'NBR/EPDM',  compatKey:'5K-50A',  compatFlag:'ng',   note:'10K-50AはPCD120mm。混用禁止 ★よくある混同'},
      {cat:'A', pclass:'5K',  nom:'65A',  od:155, pcd:130, boltN:4, boltSize:'M16', boltL:55,  torque:60,  packOD:'96×74',  packMat:'NBR/EPDM',  compatKey:'5K-65A',  compatFlag:'ng',   note:'10K-65AはPCD145mm。混用禁止'},
      {cat:'A', pclass:'5K',  nom:'80A',  od:180, pcd:150, boltN:8, boltSize:'M16', boltL:55,  torque:60,  packOD:'110×88', packMat:'NBR/EPDM',  compatKey:'5K-80A',  compatFlag:'ng',   note:'10K-80AはPCD160mm。混用禁止'},
      {cat:'A', pclass:'5K',  nom:'100A', od:200, pcd:175, boltN:8, boltSize:'M16', boltL:55,  torque:60,  packOD:'135×112',packMat:'NBR/EPDM',  compatKey:'5K-100A', compatFlag:'ng',   note:'10K-100AはPCD190mm。混用禁止'},
      {cat:'A', pclass:'5K',  nom:'125A', od:235, pcd:210, boltN:8, boltSize:'M20', boltL:65,  torque:120, packOD:'162×138',packMat:'NBR/EPDM',  compatKey:'5K-125A', compatFlag:'ng',   note:'10K-125AはPCD220mm。混用禁止'},
      {cat:'A', pclass:'5K',  nom:'150A', od:265, pcd:240, boltN:8, boltSize:'M20', boltL:65,  torque:120, packOD:'192×164',packMat:'NBR/EPDM',  compatKey:'5K-150A', compatFlag:'ng',   note:'10K-150AはPCD250mm。混用禁止'},
      {cat:'A', pclass:'5K',  nom:'200A', od:320, pcd:290, boltN:12,boltSize:'M20', boltL:65,  torque:120, packOD:'245×212',packMat:'NBR/EPDM',  compatKey:'5K-200A', compatFlag:'ng',   note:'10K-200AはPCD310mm。混用禁止'},
      {cat:'A', pclass:'5K',  nom:'250A', od:385, pcd:350, boltN:12,boltSize:'M22', boltL:70,  torque:150, packOD:'300×262',packMat:'NBR/EPDM',  compatKey:'5K-250A', compatFlag:'ng',   note:'10K-250AはPCD370mm。混用禁止'},
      {cat:'A', pclass:'5K',  nom:'300A', od:430, pcd:400, boltN:16,boltSize:'M22', boltL:70,  torque:150, packOD:'352×312',packMat:'NBR/EPDM',  compatKey:'5K-300A', compatFlag:'ng',   note:'10K-300AはPCD430mm。混用禁止'},
      // ═══ A: JIS 10K ═══
      {cat:'A', pclass:'10K', nom:'10A',  od:90,  pcd:55,  boltN:4, boltSize:'M12', boltL:50,  torque:30,  packOD:'30×15',  packMat:'NBR/EPDM',  compatKey:'10K-10A', compatFlag:'ok',   note:'5K-10AとPCD同じ(55mm)・ボルト同じ→共通化可'},
      {cat:'A', pclass:'10K', nom:'15A',  od:95,  pcd:65,  boltN:4, boltSize:'M12', boltL:50,  torque:30,  packOD:'36×20',  packMat:'NBR/EPDM',  compatKey:'10K-15A', compatFlag:'ok',   note:'5K-15AとPCD同じ可能性あり。現物確認推奨'},
      {cat:'A', pclass:'10K', nom:'20A',  od:100, pcd:75,  boltN:4, boltSize:'M12', boltL:50,  torque:30,  packOD:'42×26',  packMat:'NBR/EPDM',  compatKey:'10K-20A', compatFlag:'warn', note:'5K-20Aと同じPCDの場合あり。要確認'},
      {cat:'A', pclass:'10K', nom:'25A',  od:125, pcd:90,  boltN:4, boltSize:'M16', boltL:60,  torque:70,  packOD:'48×32',  packMat:'NBR/EPDM',  compatKey:'10K-25A', compatFlag:'ok',   note:'20K-25AとPCD同じ(90mm)→共通化可 ★重要'},
      {cat:'A', pclass:'10K', nom:'32A',  od:135, pcd:100, boltN:4, boltSize:'M16', boltL:60,  torque:70,  packOD:'58×40',  packMat:'NBR/EPDM',  compatKey:'10K-32A', compatFlag:'ok',   note:'20K-32AとPCD同じ(100mm)→共通化可'},
      {cat:'A', pclass:'10K', nom:'40A',  od:140, pcd:105, boltN:4, boltSize:'M16', boltL:60,  torque:70,  packOD:'66×46',  packMat:'NBR/EPDM',  compatKey:'10K-40A', compatFlag:'ok',   note:'20K-40AとPCD同じ(105mm)→共通化可'},
      {cat:'A', pclass:'10K', nom:'50A',  od:155, pcd:120, boltN:4, boltSize:'M16', boltL:60,  torque:70,  packOD:'76×58',  packMat:'NBR/EPDM',  compatKey:'10K-50A', compatFlag:'ng',   note:'5K-50A(PCD105mm)と混用禁止 ★最多トラブル事例'},
      {cat:'A', pclass:'10K', nom:'65A',  od:175, pcd:145, boltN:4, boltSize:'M16', boltL:60,  torque:70,  packOD:'96×74',  packMat:'NBR/EPDM',  compatKey:'10K-65A', compatFlag:'ng',   note:'5K-65A(PCD130mm)と混用禁止'},
      {cat:'A', pclass:'10K', nom:'80A',  od:200, pcd:160, boltN:8, boltSize:'M16', boltL:60,  torque:70,  packOD:'110×88', packMat:'NBR/EPDM',  compatKey:'10K-80A', compatFlag:'ng',   note:'5K-80A(PCD150mm)と混用禁止'},
      {cat:'A', pclass:'10K', nom:'100A', od:225, pcd:190, boltN:8, boltSize:'M16', boltL:60,  torque:70,  packOD:'135×112',packMat:'NBR/EPDM',  compatKey:'10K-100A',compatFlag:'ng',   note:'5K-100A(PCD175mm)と混用禁止'},
      {cat:'A', pclass:'10K', nom:'125A', od:270, pcd:220, boltN:8, boltSize:'M20', boltL:70,  torque:130, packOD:'162×138',packMat:'NBR/EPDM',  compatKey:'10K-125A',compatFlag:'ng',   note:'5K-125A(PCD210mm)と混用禁止'},
      {cat:'A', pclass:'10K', nom:'150A', od:305, pcd:250, boltN:8, boltSize:'M20', boltL:70,  torque:130, packOD:'192×164',packMat:'NBR/EPDM',  compatKey:'10K-150A',compatFlag:'ng',   note:'5K-150A(PCD240mm)と混用禁止'},
      {cat:'A', pclass:'10K', nom:'200A', od:350, pcd:310, boltN:12,boltSize:'M20', boltL:70,  torque:130, packOD:'245×212',packMat:'NBR/EPDM',  compatKey:'10K-200A',compatFlag:'ng',   note:'5K-200A(PCD290mm)と混用禁止'},
      {cat:'A', pclass:'10K', nom:'250A', od:430, pcd:370, boltN:12,boltSize:'M24', boltL:80,  torque:200, packOD:'300×262',packMat:'NBR/EPDM',  compatKey:'10K-250A',compatFlag:'ng',   note:'5K-250A(PCD350mm)と混用禁止'},
      {cat:'A', pclass:'10K', nom:'300A', od:480, pcd:430, boltN:16,boltSize:'M24', boltL:80,  torque:200, packOD:'352×312',packMat:'NBR/EPDM',  compatKey:'10K-300A',compatFlag:'ng',   note:'5K-300A(PCD400mm)と混用禁止'},
      // ═══ A: JIS 20K ═══
      {cat:'A', pclass:'20K', nom:'25A',  od:125, pcd:90,  boltN:4, boltSize:'M16', boltL:65,  torque:80,  packOD:'48×32',  packMat:'NBR/FKM',   compatKey:'20K-25A', compatFlag:'ok',   note:'10K-25AとPCD同じ(90mm)→共通化可'},
      {cat:'A', pclass:'20K', nom:'32A',  od:135, pcd:100, boltN:4, boltSize:'M16', boltL:65,  torque:80,  packOD:'58×40',  packMat:'NBR/FKM',   compatKey:'20K-32A', compatFlag:'ok',   note:'10K-32AとPCD同じ(100mm)→共通化可'},
      {cat:'A', pclass:'20K', nom:'40A',  od:140, pcd:105, boltN:4, boltSize:'M16', boltL:65,  torque:80,  packOD:'66×46',  packMat:'NBR/FKM',   compatKey:'20K-40A', compatFlag:'ok',   note:'10K-40AとPCD同じ(105mm)→共通化可'},
      {cat:'A', pclass:'20K', nom:'50A',  od:165, pcd:130, boltN:8, boltSize:'M16', boltL:65,  torque:80,  packOD:'76×58',  packMat:'NBR/FKM',   compatKey:'20K-50A', compatFlag:'ng',   note:'10K-50A(PCD120mm)と混用禁止'},
      {cat:'A', pclass:'20K', nom:'65A',  od:185, pcd:155, boltN:8, boltSize:'M20', boltL:75,  torque:140, packOD:'96×74',  packMat:'NBR/FKM',   compatKey:'20K-65A', compatFlag:'ng',   note:'10K-65A(PCD145mm)と混用禁止'},
      {cat:'A', pclass:'20K', nom:'80A',  od:210, pcd:170, boltN:8, boltSize:'M20', boltL:75,  torque:140, packOD:'110×88', packMat:'NBR/FKM',   compatKey:'20K-80A', compatFlag:'ng',   note:'10K-80A(PCD160mm)と混用禁止'},
      {cat:'A', pclass:'20K', nom:'100A', od:250, pcd:200, boltN:8, boltSize:'M22', boltL:80,  torque:180, packOD:'135×112',packMat:'NBR/FKM',   compatKey:'20K-100A',compatFlag:'ng',   note:'10K-100A(PCD190mm)と混用禁止'},
      {cat:'A', pclass:'20K', nom:'150A', od:325, pcd:270, boltN:12,boltSize:'M22', boltL:80,  torque:180, packOD:'192×164',packMat:'NBR/FKM',   compatKey:'20K-150A',compatFlag:'ng',   note:'10K-150A(PCD250mm)と混用禁止'},
      {cat:'A', pclass:'20K', nom:'200A', od:390, pcd:330, boltN:12,boltSize:'M24', boltL:90,  torque:230, packOD:'245×212',packMat:'NBR/FKM',   compatKey:'20K-200A',compatFlag:'ng',   note:'10K-200A(PCD310mm)と混用禁止'},
      {cat:'A', pclass:'20K', nom:'250A', od:445, pcd:385, boltN:16,boltSize:'M24', boltL:90,  torque:230, packOD:'300×262',packMat:'NBR/FKM',   compatKey:'20K-250A',compatFlag:'ng',   note:'10K-250A(PCD370mm)と混用禁止'},
      {cat:'A', pclass:'20K', nom:'300A', od:510, pcd:450, boltN:16,boltSize:'M27', boltL:100, torque:310, packOD:'352×312',packMat:'NBR/FKM',   compatKey:'20K-300A',compatFlag:'ng',   note:'10K-300A(PCD430mm)と混用禁止。大型・高圧設備専用'},
      // ═══ A: JIS 16K（蒸気・高圧用） ═══
      {cat:'A', pclass:'16K', nom:'10A',  od:90,  pcd:60,  boltN:4, boltSize:'M12', boltL:55,  torque:35,  packOD:'30×15',  packMat:'NBR/FKM/グラファイト',compatKey:'16K-10A', compatFlag:'ng',  note:'蒸気配管用高圧クラス。10K-10A(PCD55mm)と混用禁止'},
      {cat:'A', pclass:'16K', nom:'15A',  od:95,  pcd:65,  boltN:4, boltSize:'M12', boltL:55,  torque:35,  packOD:'36×20',  packMat:'NBR/FKM/グラファイト',compatKey:'16K-15A', compatFlag:'ng',  note:'蒸気・高圧流体配管標準'},
      {cat:'A', pclass:'16K', nom:'20A',  od:100, pcd:75,  boltN:4, boltSize:'M12', boltL:55,  torque:35,  packOD:'42×26',  packMat:'NBR/FKM/グラファイト',compatKey:'16K-20A', compatFlag:'warn',note:'10K-20AとPCDが同じ(75mm)場合あり。要確認'},
      {cat:'A', pclass:'16K', nom:'25A',  od:125, pcd:90,  boltN:4, boltSize:'M16', boltL:65,  torque:80,  packOD:'48×32',  packMat:'NBR/FKM/グラファイト',compatKey:'16K-25A', compatFlag:'ok',  note:'10K/20K-25AとPCD同じ(90mm)→共通化可'},
      {cat:'A', pclass:'16K', nom:'32A',  od:135, pcd:100, boltN:4, boltSize:'M16', boltL:65,  torque:80,  packOD:'58×40',  packMat:'NBR/FKM/グラファイト',compatKey:'16K-32A', compatFlag:'ok',  note:'10K/20K-32AとPCD同じ(100mm)→共通化可'},
      {cat:'A', pclass:'16K', nom:'40A',  od:140, pcd:105, boltN:4, boltSize:'M16', boltL:65,  torque:80,  packOD:'66×46',  packMat:'NBR/FKM/グラファイト',compatKey:'16K-40A', compatFlag:'ok',  note:'10K/20K-40AとPCD同じ(105mm)→共通化可'},
      {cat:'A', pclass:'16K', nom:'50A',  od:160, pcd:125, boltN:4, boltSize:'M16', boltL:65,  torque:80,  packOD:'76×58',  packMat:'NBR/FKM/グラファイト',compatKey:'16K-50A', compatFlag:'ng',  note:'10K-50A(PCD120mm)・20K-50A(PCD130mm)と混用禁止 ★要注意'},
      {cat:'A', pclass:'16K', nom:'65A',  od:180, pcd:150, boltN:8, boltSize:'M16', boltL:65,  torque:80,  packOD:'96×74',  packMat:'NBR/FKM/グラファイト',compatKey:'16K-65A', compatFlag:'ng',  note:'10K-65A(PCD145mm)・20K-65A(PCD155mm)と混用禁止'},
      {cat:'A', pclass:'16K', nom:'80A',  od:200, pcd:160, boltN:8, boltSize:'M16', boltL:65,  torque:80,  packOD:'110×88', packMat:'NBR/FKM/グラファイト',compatKey:'16K-80A', compatFlag:'ok',  note:'10K-80AとPCD同じ(160mm)→共通化可'},
      {cat:'A', pclass:'16K', nom:'100A', od:225, pcd:190, boltN:8, boltSize:'M16', boltL:70,  torque:90,  packOD:'135×112',packMat:'NBR/FKM/グラファイト',compatKey:'16K-100A',compatFlag:'ok',  note:'10K-100AとPCD同じ(190mm)→共通化可'},
      {cat:'A', pclass:'16K', nom:'125A', od:270, pcd:220, boltN:8, boltSize:'M20', boltL:75,  torque:140, packOD:'162×138',packMat:'NBR/FKM/グラファイト',compatKey:'16K-125A',compatFlag:'ok',  note:'10K-125AとPCD同じ(220mm)→共通化可'},
      {cat:'A', pclass:'16K', nom:'150A', od:305, pcd:250, boltN:8, boltSize:'M20', boltL:75,  torque:140, packOD:'192×164',packMat:'NBR/FKM/グラファイト',compatKey:'16K-150A',compatFlag:'ok',  note:'10K-150AとPCD同じ(250mm)→共通化可'},
      {cat:'A', pclass:'16K', nom:'200A', od:370, pcd:310, boltN:12,boltSize:'M22', boltL:85,  torque:190, packOD:'245×212',packMat:'NBR/FKM/グラファイト',compatKey:'16K-200A',compatFlag:'ok',  note:'10K-200AとPCD同じ(310mm)→共通化可'},
      {cat:'A', pclass:'16K', nom:'250A', od:430, pcd:370, boltN:12,boltSize:'M24', boltL:90,  torque:220, packOD:'300×262',packMat:'NBR/FKM/グラファイト',compatKey:'16K-250A',compatFlag:'ok',  note:'10K-250AとPCD同じ(370mm)→共通化可'},
      {cat:'A', pclass:'16K', nom:'300A', od:485, pcd:430, boltN:16,boltSize:'M24', boltL:90,  torque:220, packOD:'352×312',packMat:'NBR/FKM/グラファイト',compatKey:'16K-300A',compatFlag:'ng',  note:'10K-300A(PCD430mm)とPCD同じだがボルト本数・長さが異なる場合あり。要確認'},
      {cat:'B', pclass:'NW',  nom:'NW10', od:21.5,pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'12.5×6',  packMat:'NBR/FKM/Viton',compatKey:'NW-10', compatFlag:'ok',note:'センタリングリング+クランプで接続。ボルト不要'},
      {cat:'B', pclass:'NW',  nom:'NW16', od:28,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'19×12',   packMat:'NBR/FKM',      compatKey:'NW-16', compatFlag:'ok',note:'NW/KF規格はDIN28403準拠。クランプ接続'},
      {cat:'B', pclass:'NW',  nom:'NW25', od:40,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'30×18',   packMat:'NBR/FKM',      compatKey:'NW-25', compatFlag:'ok',note:'最も一般的な真空規格。研究・分析機器に多用'},
      {cat:'B', pclass:'NW',  nom:'NW32', od:50,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'38×24',   packMat:'NBR/FKM',      compatKey:'NW-32', compatFlag:'ok',note:'NW25より大流量が必要な場合に使用'},
      {cat:'B', pclass:'NW',  nom:'NW40', od:55,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'45×30',   packMat:'NBR/FKM',      compatKey:'NW-40', compatFlag:'ok',note:'ターボポンプ排気口等に使用'},
      {cat:'B', pclass:'NW',  nom:'NW50', od:67,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'57×38',   packMat:'NBR/FKM',      compatKey:'NW-50', compatFlag:'ok',note:''},
      {cat:'B', pclass:'NW',  nom:'NW63', od:83,  pcd:null,boltN:0, boltSize:'クランプ', boltL:null,torque:null,packOD:'71×50',   packMat:'NBR/FKM',      compatKey:'NW-63', compatFlag:'ok',note:''},
      {cat:'B', pclass:'ISO-F',nom:'ISO63',  od:114,pcd:94.5,boltN:4, boltSize:'M8',  boltL:25, torque:8,   packOD:'75.0×61.2',packMat:'NBR/FKM/Viton',compatKey:'ISO-63', compatFlag:'ok',note:'ISO-F規格 ボルト締め接続。超高真空(UHV)用途'},
      {cat:'B', pclass:'ISO-F',nom:'ISO100', od:152,pcd:130, boltN:8, boltSize:'M8',  boltL:25, torque:8,   packOD:'114×98',   packMat:'NBR/FKM/Viton',compatKey:'ISO-100',compatFlag:'ok',note:'ディフュージョンポンプ等に多用'},
      {cat:'B', pclass:'ISO-F',nom:'ISO160', od:213,pcd:189, boltN:8, boltSize:'M10', boltL:30, torque:15,  packOD:'172×154',  packMat:'NBR/FKM/Viton',compatKey:'ISO-160',compatFlag:'ok',note:''},
      {cat:'B', pclass:'ISO-F',nom:'ISO200', od:261,pcd:235, boltN:8, boltSize:'M10', boltL:30, torque:15,  packOD:'213×192',  packMat:'NBR/FKM/Viton',compatKey:'ISO-200',compatFlag:'ok',note:''},
      {cat:'B', pclass:'ICF',  nom:'ICF34',  od:55.5,pcd:44.5,boltN:4,boltSize:'M6',  boltL:20, torque:4,   packOD:'メタルOリング',packMat:'Al/Cu',       compatKey:'ICF-34', compatFlag:'ok',note:'ICF(ConFlat)規格 メタルガスケット使用。超高真空(UHV)専用。再使用不可'},
      {cat:'B', pclass:'ICF',  nom:'ICF70',  od:92,  pcd:79.5,boltN:6,boltSize:'M8',  boltL:20, torque:8,   packOD:'メタルOリング',packMat:'Al/Cu',       compatKey:'ICF-70', compatFlag:'ok',note:'超高真空専用。フランジ面傷つけ厳禁。ナイフエッジ接続'},
      {cat:'B', pclass:'ICF',  nom:'ICF114', od:146, pcd:130, boltN:8,boltSize:'M8',  boltL:20, torque:8,   packOD:'メタルOリング',packMat:'Al/Cu',       compatKey:'ICF-114',compatFlag:'ok',note:'半導体・研究装置の高真空配管で標準'},
      {cat:'B', pclass:'ICF',  nom:'ICF152', od:202, pcd:184, boltN:16,boltSize:'M8', boltL:20, torque:8,   packOD:'メタルOリング',packMat:'Al/Cu',       compatKey:'ICF-152',compatFlag:'ok',note:''},
      // ═══ B: JIS 丸フランジ（JIS B 2290）===
      // 締結：ボルト・ナット / シール：Oリング溝（JIS B 2401 P系またはG系）
      // 真空度目安：〜10⁻⁵Pa（ゴムOリング）/ 〜10⁻⁸Pa（メタルOリング）
      {cat:'B', pclass:'JIS-F', nom:'DN16（25A）',  od:45,  pcd:32,  boltN:4, boltSize:'M5',  boltL:20, torque:3,   packOD:'P18(d1:17.8)',  packMat:'NBR/FKM/Cu',  compatKey:'JISF-16',  compatFlag:'ok',note:'JIS B 2290 最小径。小型真空装置・計装配管'},
      {cat:'B', pclass:'JIS-F', nom:'DN25（32A）',  od:58,  pcd:44,  boltN:4, boltSize:'M6',  boltL:20, torque:5,   packOD:'P22(d1:21.8)',  packMat:'NBR/FKM/Cu',  compatKey:'JISF-25',  compatFlag:'ok',note:'真空チャンバー小口径ポート・ゲートバルブに多用'},
      {cat:'B', pclass:'JIS-F', nom:'DN40（50A）',  od:75,  pcd:60,  boltN:4, boltSize:'M8',  boltL:25, torque:8,   packOD:'P35(d1:34.8)',  packMat:'NBR/FKM/Cu',  compatKey:'JISF-40',  compatFlag:'ok',note:'ターボポンプ排気ポート・フォアライン標準サイズ'},
      {cat:'B', pclass:'JIS-F', nom:'DN50（65A）',  od:90,  pcd:74,  boltN:4, boltSize:'M8',  boltL:25, torque:8,   packOD:'P44(d1:43.8)',  packMat:'NBR/FKM/Cu',  compatKey:'JISF-50',  compatFlag:'ok',note:''},
      {cat:'B', pclass:'JIS-F', nom:'DN63（80A）',  od:110, pcd:90,  boltN:6, boltSize:'M8',  boltL:25, torque:8,   packOD:'P56(d1:55.8)',  packMat:'NBR/FKM/Cu',  compatKey:'JISF-63',  compatFlag:'ok',note:'スパッタ装置・CVD装置の主配管に多用'},
      {cat:'B', pclass:'JIS-F', nom:'DN80（100A）', od:130, pcd:110, boltN:6, boltSize:'M8',  boltL:25, torque:8,   packOD:'P70(d1:69.8)',  packMat:'NBR/FKM/Cu',  compatKey:'JISF-80',  compatFlag:'ok',note:''},
      {cat:'B', pclass:'JIS-F', nom:'DN100（125A）',od:152, pcd:130, boltN:8, boltSize:'M8',  boltL:25, torque:8,   packOD:'P90(d1:89.8)',  packMat:'NBR/FKM/Cu',  compatKey:'JISF-100', compatFlag:'warn',note:'ICF114とPCDが同じ(130mm)・ボルト本数同じ→混用に注意。規格が異なるため互換なし'},
      {cat:'B', pclass:'JIS-F', nom:'DN125（150A）',od:180, pcd:156, boltN:8, boltSize:'M10', boltL:30, torque:15,  packOD:'P115(d1:114.8)',packMat:'NBR/FKM/Cu',  compatKey:'JISF-125', compatFlag:'ok',note:'大型真空チャンバーメインポート'},
      {cat:'B', pclass:'JIS-F', nom:'DN160（200A）',od:218, pcd:192, boltN:8, boltSize:'M10', boltL:30, torque:15,  packOD:'P150(d1:149.8)',packMat:'NBR/FKM/Cu',  compatKey:'JISF-160', compatFlag:'ok',note:''},
      {cat:'B', pclass:'JIS-F', nom:'DN200（250A）',od:270, pcd:240, boltN:12,boltSize:'M10', boltL:30, torque:15,  packOD:'P190(d1:189.8)',packMat:'NBR/FKM/Cu',  compatKey:'JISF-200', compatFlag:'ok',note:'大型装置・ロードロック室ポート'},
      {cat:'B', pclass:'JIS-F', nom:'DN250（300A）',od:325, pcd:292, boltN:12,boltSize:'M12', boltL:35, torque:25,  packOD:'P240(d1:239.8)',packMat:'NBR/FKM/Cu',  compatKey:'JISF-250', compatFlag:'ok',note:''},
      {cat:'B', pclass:'JIS-F', nom:'DN320（400A）',od:410, pcd:370, boltN:16,boltSize:'M12', boltL:35, torque:25,  packOD:'P310(d1:309.8)',packMat:'NBR/FKM/Cu',  compatKey:'JISF-320', compatFlag:'ok',note:'大型真空チャンバー本体フランジ'},
      {cat:'B', pclass:'JIS-F', nom:'DN400（500A）',od:505, pcd:460, boltN:20,boltSize:'M12', boltL:35, torque:25,  packOD:'P390(d1:389.8)',packMat:'NBR/FKM/Cu',  compatKey:'JISF-400', compatFlag:'ok',note:''},
      {cat:'B', pclass:'JIS-F', nom:'DN500（600A）',od:615, pcd:565, boltN:20,boltSize:'M16', boltL:45, torque:55,  packOD:'P490(d1:489.8)',packMat:'NBR/FKM/Cu',  compatKey:'JISF-500', compatFlag:'ok',note:'大型スパッタ・蒸着装置チャンバー本体'},
      {cat:'B', pclass:'JIS-F', nom:'DN630（800A）',od:765, pcd:710, boltN:24,boltSize:'M16', boltL:45, torque:55,  packOD:'P630(d1:629.8)',packMat:'NBR/FKM/Cu',  compatKey:'JISF-630', compatFlag:'ok',note:'超大型チャンバー。Cuガスケット使用が多い'},
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
