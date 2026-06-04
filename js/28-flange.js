    function flFilter() {
      const cat     = document.getElementById('fl-cat').value;
      const pclass  = document.getElementById('fl-pclass').value;
      const query   = document.getElementById('fl-search').value.trim().toUpperCase();
      const compat  = document.getElementById('fl-compat').value;
      const tbody   = document.getElementById('fl-tbody');

      let rows = FL_DATA;
      if (cat    !== 'all') rows = rows.filter(r => r.cat === cat);
      if (pclass !== 'all') rows = rows.filter(r => r.pclass === pclass);
      if (query)            rows = rows.filter(r => r.nom.toUpperCase().includes(query) || r.pclass.includes(query));
      if (compat === 'warn') rows = rows.filter(r => r.compatFlag !== 'ok');
      if (compat === 'ok')   rows = rows.filter(r => r.compatFlag === 'ok');

      document.getElementById('fl-count').textContent = `${rows.length} 件`;

      // 接続方式テキスト説明更新
      const catSelected = document.getElementById('fl-cat').value;
      const infoBox = document.getElementById('fl-info-box');
      const FL_INFO = {
        all: `<span style="color:var(--muted);">← カテゴリーを選択すると接続方式の説明が表示されます</span>`,
        A: `<b style="color:var(--accent);">JISフランジ（水・油・汎用ガス・蒸気）</b><br>
<span style="color:var(--muted);">締結方式</span>　ボルト・ナット（M12〜M27）<br>
<span style="color:var(--muted);">シール材</span>　5K/10K：平パッキン（NBR/EPDM）<br>
　　　　　16K：グラファイト/FKM（蒸気対応）<br>
　　　　　20K：Oリング（溝型シート M/F）<br>
<span style="color:var(--muted);">シート面</span>　5K：フラット　10K/16K：ライズドフェイス　20K：溝型<br>
<span style="color:var(--muted);">16K の特徴</span>　蒸気・高圧用途専用クラス。25A〜100AはPCDが10Kと同じため<br>
　　　　　ボルト本数・サイズも同一なら共通化可。50A/65Aは要注意。<br>
<hr style="border:none;border-top:1px solid var(--border);margin:6px 0;">
<span style="color:var(--bad);">⚠ PCD の罠</span><br>
同じ呼び径でも 5K・10K・16K・20K でPCDが異なる場合があります。<br>
例）50A：5K=105mm　10K=120mm　16K=125mm　20K=130mm<br>
例）25A：10K=16K=20K=PCD90mm　→ 共通化可`,

        B: `<b style="color:#a0c4ff;">真空フランジ</b><br>
<b style="color:var(--muted);">▍NW/KF（〜10⁻³ Pa）</b><br>
<span style="color:var(--muted);">締結方式</span>　クランプ1本のみ（ボルト不要・着脱30秒）<br>
<span style="color:var(--muted);">シール材</span>　センタリングリング内蔵Oリング（NBR/FKM）<br>
<span style="color:var(--muted);">特徴</span>　　薄型フランジ。実験・研究装置の標準。再使用可<br>
<b style="color:var(--muted);">▍JIS丸フランジ（JIS B 2290）〜10⁻⁵ Pa〜10⁻⁸ Pa</b><br>
<span style="color:var(--muted);">締結方式</span>　ボルト・ナット（M5〜M16）<br>
<span style="color:var(--muted);">シール材</span>　Oリング溝（P系/G系）+ NBR/FKM/Cuガスケット<br>
<span style="color:var(--muted);">特徴</span>　　国内真空装置の標準。DN16〜DN630。汎用性高い<br>
　　　　　Oリング材質で到達真空度が変わる<br>
<b style="color:var(--muted);">▍ISO-F（〜10⁻⁷ Pa）</b><br>
<span style="color:var(--muted);">締結方式</span>　ボルト（M8〜M10）<br>
<span style="color:var(--muted);">シール材</span>　Oリング（NBR/FKM/Viton）<br>
<span style="color:var(--muted);">特徴</span>　　大口径対応。ディフュージョンポンプ等に多用<br>
<b style="color:var(--muted);">▍ICF / ConFlat（〜10⁻¹⁰ Pa）</b><br>
<span style="color:var(--muted);">締結方式</span>　ボルト（M6〜M8）<br>
<span style="color:var(--muted);">シール材</span>　メタルガスケット（Al/Cu）→ナイフエッジが食い込む<br>
<span style="color:var(--muted);">特徴</span>　　超高真空専用。<span style="color:var(--bad);">ガスケット再使用不可</span>。フランジ面傷つけ厳禁`,

        C: `<b style="color:var(--warn);">ねじ込み・継手系</b><br>
<b style="color:var(--muted);">▍Rねじ / Rcねじ（管用テーパーねじ）</b><br>
<span style="color:var(--muted);">締結方式</span>　テーパーねじの食い込みでシール<br>
<span style="color:var(--muted);">シール材</span>　PTFE（シールテープ）または麻糸<br>
<span style="color:var(--muted);">特徴</span>　　Rねじ（オス）＋Rcねじ（メス）の組み合わせ<br>
　　　　　Gネジ（平行ねじ）と混用禁止<br>
<span style="color:var(--muted);">締め込み目安</span>　手締め後 2〜3回転<br>
<b style="color:var(--muted);">▍Swagelok / VCR（フェルール継手）</b><br>
<span style="color:var(--muted);">締結方式</span>　ナット締めでフェルールが管に食い込む<br>
<span style="color:var(--muted);">シール材</span>　フェルール本体（SS316）<br>
<span style="color:var(--muted);">特徴</span>　　初回：手締め後 1-1/4回転（重要）<br>
　　　　　再締め：1/4〜1/2回転で再シール可<br>
<span style="color:var(--bad);">⚠ 締め過ぎ注意：フェルールが変形して交換必要になる</span>`,

        D: `<b style="color:var(--good);">衛生・サニタリー系（ISO 2852 / Tri-Clamp）</b><br>
<span style="color:var(--muted);">締結方式</span>　クランプ＋蝶ネジ（工具不要・片手で着脱）<br>
<span style="color:var(--muted);">シール材</span>　EPDM / PTFE / FKM（食品・薬品グレード）<br>
<span style="color:var(--muted);">シート面</span>　テーパー溝（パッキンが脱落しにくい形状）<br>
<span style="color:var(--muted);">特徴</span>　　内面鏡面仕上げ（Ra0.8以下推奨）<br>
　　　　　CIP洗浄・SIP蒸気滅菌対応<br>
　　　　　ガスケット定期交換が前提（耐薬品性確認必須）<br>
<hr style="border:none;border-top:1px solid var(--border);margin:6px 0;">
<span style="color:var(--muted);">呼び径の注意</span>　インチ表記（1.5"=38A相当）と<br>
JIS呼び径（A表記）が混在しているため確認が必要`,
      };
      infoBox.innerHTML = FL_INFO[catSelected] || FL_INFO.all;

      tbody.innerHTML = rows.map(r => {
        // 行の背景色（互換性フラグ）
        const rowBg =
          r.compatFlag === 'ng'   ? 'background:var(--bad-dim);'  :
          r.compatFlag === 'warn' ? 'background:var(--warn-dim);' : '';
        const compatIcon =
          r.compatFlag === 'ng'   ? '<span style="color:var(--bad);">✕ 混用禁止</span>'  :
          r.compatFlag === 'warn' ? '<span style="color:var(--warn);">⚠ 要確認</span>'   :
                                    '<span style="color:var(--good);">✓ 互換OK</span>';
        const torqueTxt = r.torque ? `${r.torque} N·m` : '—';
        const odTxt     = r.od     ? `${r.od}` : '—';
        const pcdTxt    = r.pcd    ? `${r.pcd}` : '—';
        const boltLTxt  = r.boltL  ? `${r.boltL}` : '—';
        return `<tr style="${rowBg}">
          <td style="color:${FL_CAT_COLOR[r.cat]};font-weight:700;white-space:nowrap;">${FL_CAT_LABEL[r.cat]}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;white-space:nowrap;">${r.pclass}</td>
          <td style="font-weight:700;color:var(--ink);white-space:nowrap;">${r.nom}</td>
          <td>${odTxt}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-weight:${r.pcd?'700':'400'};color:${r.pcd?'var(--ink)':'var(--muted)'};">${pcdTxt}</td>
          <td style="text-align:center;">${r.boltN > 0 ? r.boltN : '—'}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${r.boltSize}</td>
          <td style="text-align:center;">${boltLTxt}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${r.torque?'var(--warn)':'var(--muted)'};">${torqueTxt}</td>
          <td style="font-size:11px;">${r.packOD}</td>
          <td style="font-size:11px;color:var(--muted);">${r.packMat}</td>
          <td style="font-size:11px;white-space:nowrap;">${compatIcon}</td>
          <td style="font-size:11px;color:var(--muted);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${r.note}">${r.note||'—'}</td>
        </tr>`;
      }).join('');

      if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;color:var(--muted);padding:20px;">該当するフランジデータがありません</td></tr>`;
      }
    }

    /* ── 初期化 ── */
                        
    /* ══════════════════════════════════════════
       🪝 吊り具選定
    ══════════════════════════════════════════ */

    const WIRE_DATA = [
      {構成:'6×7',d:6,   A:13.8, Fb:16.0,  kg:0.13, note:'小型クレーン・ホイスト'},
      {構成:'6×7',d:8,   A:24.6, Fb:28.7,  kg:0.24, note:''},
      {構成:'6×7',d:9,   A:31.1, Fb:36.3,  kg:0.30, note:''},
      {構成:'6×7',d:10,  A:38.4, Fb:44.8,  kg:0.37, note:''},
      {構成:'6×7',d:12,  A:55.3, Fb:64.5,  kg:0.53, note:'汎用・玉掛け標準'},
      {構成:'6×7',d:14,  A:75.3, Fb:87.8,  kg:0.73, note:''},
      {構成:'6×7',d:16,  A:98.4, Fb:115,   kg:0.95, note:''},
      {構成:'6×7',d:18,  A:124,  Fb:145,   kg:1.20, note:''},
      {構成:'6×7',d:20,  A:154,  Fb:180,   kg:1.49, note:'重量物吊り'},
      {構成:'6×7',d:22,  A:186,  Fb:217,   kg:1.80, note:''},
      {構成:'6×7',d:24,  A:221,  Fb:258,   kg:2.14, note:''},
      {構成:'6×7',d:26,  A:260,  Fb:304,   kg:2.52, note:''},
      {構成:'6×7',d:28,  A:302,  Fb:352,   kg:2.92, note:''},
      {構成:'6×7',d:30,  A:346,  Fb:404,   kg:3.35, note:'大型クレーン'},
      {構成:'6×19',d:6,  A:13.8, Fb:15.4,  kg:0.13, note:'小型・精密作業'},
      {構成:'6×19',d:8,  A:24.6, Fb:27.4,  kg:0.24, note:''},
      {構成:'6×19',d:9,  A:31.1, Fb:34.6,  kg:0.30, note:''},
      {構成:'6×19',d:10, A:38.4, Fb:42.7,  kg:0.37, note:''},
      {構成:'6×19',d:12, A:55.3, Fb:61.5,  kg:0.53, note:'★最汎用。玉掛け標準'},
      {構成:'6×19',d:14, A:75.3, Fb:83.8,  kg:0.73, note:''},
      {構成:'6×19',d:16, A:98.4, Fb:109,   kg:0.95, note:''},
      {構成:'6×19',d:18, A:124,  Fb:138,   kg:1.20, note:''},
      {構成:'6×19',d:20, A:154,  Fb:171,   kg:1.49, note:''},
      {構成:'6×19',d:22, A:186,  Fb:207,   kg:1.80, note:''},
      {構成:'6×19',d:24, A:221,  Fb:246,   kg:2.14, note:''},
      {構成:'6×19',d:26, A:260,  Fb:289,   kg:2.52, note:''},
      {構成:'6×19',d:28, A:302,  Fb:336,   kg:2.92, note:''},
      {構成:'6×19',d:30, A:346,  Fb:385,   kg:3.35, note:''},
      {構成:'6×19',d:32, A:394,  Fb:438,   kg:3.81, note:''},
      {構成:'6×19',d:36, A:499,  Fb:555,   kg:4.83, note:'大型設備搬入'},
      {構成:'6×19',d:40, A:616,  Fb:685,   kg:5.96, note:''},
      {構成:'6×37',d:10, A:38.4, Fb:41.7,  kg:0.37, note:'シーブ多用・ウインチ'},
      {構成:'6×37',d:12, A:55.3, Fb:60.0,  kg:0.53, note:''},
      {構成:'6×37',d:14, A:75.3, Fb:81.7,  kg:0.73, note:''},
      {構成:'6×37',d:16, A:98.4, Fb:107,   kg:0.95, note:''},
      {構成:'6×37',d:18, A:124,  Fb:135,   kg:1.20, note:''},
      {構成:'6×37',d:20, A:154,  Fb:167,   kg:1.49, note:''},
      {構成:'6×37',d:24, A:221,  Fb:240,   kg:2.14, note:''},
      {構成:'6×37',d:28, A:302,  Fb:328,   kg:2.92, note:''},
      {構成:'6×37',d:32, A:394,  Fb:428,   kg:3.81, note:''},
      {構成:'6×37',d:36, A:499,  Fb:541,   kg:4.83, note:'大型クレーン'},
      {構成:'6×37',d:40, A:616,  Fb:668,   kg:5.96, note:''},
    ];

    const EYEBOLT_DATA = [
      {type:'JIS', size:'M8',  v:1.57, a60:0.79, a45:0.49, kg:0.03, note:'小型機器・計器類'},
      {type:'JIS', size:'M10', v:2.45, a60:1.23, a45:0.76, kg:0.05, note:''},
      {type:'JIS', size:'M12', v:3.43, a60:1.72, a45:1.07, kg:0.09, note:'★最汎用'},
      {type:'JIS', size:'M16', v:6.86, a60:3.43, a45:2.13, kg:0.19, note:''},
      {type:'JIS', size:'M20', v:9.81, a60:4.91, a45:3.05, kg:0.37, note:'中型機器'},
      {type:'JIS', size:'M24', v:14.7, a60:7.35, a45:4.57, kg:0.61, note:''},
      {type:'JIS', size:'M30', v:24.5, a60:12.3, a45:7.63, kg:1.20, note:'重量機器'},
      {type:'JIS', size:'M36', v:34.3, a60:17.2, a45:10.7, kg:2.06, note:''},
      {type:'JIS', size:'M42', v:49.0, a60:24.5, a45:15.2, kg:3.30, note:'大型設備'},
      {type:'JIS', size:'M48', v:63.7, a60:31.9, a45:19.8, kg:4.80, note:''},
      {type:'SWIVEL', size:'M12', v:4.90, a60:4.90, a45:4.90, kg:0.15, note:'斜め吊り対応'},
      {type:'SWIVEL', size:'M16', v:9.81, a60:9.81, a45:9.81, kg:0.28, note:'360°回転'},
      {type:'SWIVEL', size:'M20', v:14.7, a60:14.7, a45:14.7, kg:0.52, note:''},
      {type:'SWIVEL', size:'M24', v:24.5, a60:24.5, a45:24.5, kg:0.85, note:''},
      {type:'SWIVEL', size:'M30', v:39.2, a60:39.2, a45:39.2, kg:1.70, note:''},
      {type:'SWIVEL', size:'M36', v:58.8, a60:58.8, a45:58.8, kg:2.90, note:''},
    ];

    const SHACKLE_DATA = [
      {shape:'bow', pin:13, nom:'13mm', wll:9.8,  t:1.0,  kg:0.16, wire:'6〜8',   note:''},
      {shape:'bow', pin:16, nom:'16mm', wll:15.7, t:1.6,  kg:0.30, wire:'8〜10',  note:''},
      {shape:'bow', pin:19, nom:'19mm', wll:22.6, t:2.3,  kg:0.50, wire:'10〜12', note:'★汎用'},
      {shape:'bow', pin:22, nom:'22mm', wll:31.9, t:3.25, kg:0.80, wire:'12〜14', note:''},
      {shape:'bow', pin:25, nom:'25mm', wll:44.1, t:4.5,  kg:1.16, wire:'14〜16', note:''},
      {shape:'bow', pin:28, nom:'28mm', wll:58.8, t:6.0,  kg:1.65, wire:'16〜18', note:''},
      {shape:'bow', pin:32, nom:'32mm', wll:78.5, t:8.0,  kg:2.40, wire:'18〜20', note:''},
      {shape:'bow', pin:35, nom:'35mm', wll:98.1, t:10.0, kg:3.20, wire:'20〜22', note:'重量物'},
      {shape:'bow', pin:40, nom:'40mm', wll:137,  t:14.0, kg:4.80, wire:'22〜26', note:''},
      {shape:'bow', pin:45, nom:'45mm', wll:176,  t:18.0, kg:6.90, wire:'26〜30', note:''},
      {shape:'bow', pin:50, nom:'50mm', wll:216,  t:22.0, kg:9.50, wire:'30〜36', note:'大型吊り'},
      {shape:'dee', pin:13, nom:'13mm', wll:9.8,  t:1.0,  kg:0.12, wire:'6〜8',   note:''},
      {shape:'dee', pin:16, nom:'16mm', wll:15.7, t:1.6,  kg:0.22, wire:'8〜10',  note:''},
      {shape:'dee', pin:19, nom:'19mm', wll:22.6, t:2.3,  kg:0.37, wire:'10〜12', note:'★汎用'},
      {shape:'dee', pin:22, nom:'22mm', wll:31.9, t:3.25, kg:0.59, wire:'12〜14', note:''},
      {shape:'dee', pin:25, nom:'25mm', wll:44.1, t:4.5,  kg:0.87, wire:'14〜16', note:''},
      {shape:'dee', pin:28, nom:'28mm', wll:58.8, t:6.0,  kg:1.22, wire:'16〜18', note:''},
      {shape:'dee', pin:32, nom:'32mm', wll:78.5, t:8.0,  kg:1.78, wire:'18〜20', note:''},
      {shape:'dee', pin:35, nom:'35mm', wll:98.1, t:10.0, kg:2.35, wire:'20〜22', note:''},
      {shape:'dee', pin:40, nom:'40mm', wll:137,  t:14.0, kg:3.50, wire:'22〜26', note:''},
      {shape:'dee', pin:45, nom:'45mm', wll:176,  t:18.0, kg:5.10, wire:'26〜30', note:''},
    ];
