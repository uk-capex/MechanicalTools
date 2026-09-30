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
        A: `<b style="color:var(--accent);">JISフランジ（JIS B 2220）</b><br>
<span style="color:var(--muted);">接合寸法</span>　外径・PCD・ボルト本数・ボルト径は JIS B 2220 の値<br>
<span style="color:var(--muted);">16K/20K</span>　接合寸法は同一（厚さなどが違う）<br>
<span style="color:var(--muted);">ガスケット</span>　寸法は JIS B 2404、材質・締付トルクはガスケットメーカー値で決める<br>
<hr style="border:none;border-top:1px solid var(--border);margin:6px 0;">
<span style="color:var(--bad);">⚠ PCD の罠</span><br>
同じ呼び径でもクラスでPCDが変わる。<br>
例）50A：5K=105　10K=120　16K/20K=120（ただし10Kは4本、16K/20Kは8本）<br>
例）80A：5K=145　10K=150　16K/20K=160<br>
例）10A〜40A：10K と 16K/20K は接合寸法同一 → 共通化可<br>
備考欄に他クラスとの比較を自動表示している。`,

        B: `<b style="color:#a0c4ff;">真空フランジ</b><br>
<b style="color:var(--muted);">▍NW/KF（〜10⁻³ Pa）</b><br>
<span style="color:var(--muted);">締結方式</span>　クランプ1本のみ（ボルト不要・着脱30秒）<br>
<span style="color:var(--muted);">シール材</span>　センタリングリング内蔵Oリング（NBR/FKM）<br>
<span style="color:var(--muted);">特徴</span>　　薄型フランジ。実験・研究装置の標準。再使用可<br>
<b style="color:var(--muted);">▍JIS丸フランジ（JIS B 2290）〜10⁻⁵ Pa〜10⁻⁸ Pa</b><br>
<span style="color:var(--muted);">締結方式</span>　ボルト・ナット（M5〜M16）<br>
<span style="color:var(--muted);">シール材</span>　Oリング溝（P系/G系）+ NBR/FKM/Cuガスケット<br>
<span style="color:var(--muted);">特徴</span>　　国内真空装置の標準。DN16〜DN630。<span style="color:var(--warn);">寸法表は未照合</span><br>
　　　　　Oリング材質で到達真空度が変わる<br>
<b style="color:var(--muted);">▍ISO-F（〜10⁻⁷ Pa）</b><br>
<span style="color:var(--muted);">締結方式</span>　ボルト（M8〜M10）<br>
<span style="color:var(--muted);">シール材</span>　Oリング（NBR/FKM/Viton）<br>
<span style="color:var(--muted);">特徴</span>　　大口径対応。ディフュージョンポンプ等に多用<br>
<b style="color:var(--muted);">▍ICF / ConFlat（〜10⁻¹⁰ Pa）</b><br>
<span style="color:var(--muted);">締結方式</span>　ボルト（M4〜M8）。ICFの呼び＝フランジ外径（ICF34〜253）<br>
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
          r.compatFlag === 'ng'   ? '<span style="color:var(--bad);">✕ 他クラスと互換なし</span>'  :
          r.compatFlag === 'warn' ? '<span style="color:var(--warn);">⚠ 一部のみ共通</span>'   :
                                    '<span style="color:var(--good);">✓ 他クラスと共通</span>';
        const torqueTxt = !r.torque ? '—'
          : (typeof r.torque === 'object')
            ? `${r.torque.w}${r.torque.g != null ? ' / ' + r.torque.g : ''}<br><span style="font-size:9px;color:var(--muted);">${r.torque.src}</span>`
            : `${r.torque} N·m`;
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
          <td style="font-size:11px;">${r.packOD || '—'}</td>
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

    /* JIS G 3525 ワイヤロープ A種（裸・普通より）破断力
       出典: テザック神鋼 ワイヤロープ規格表（JIS G 3525 準拠）
       A(標準断面積)はJIS記載なし・メーカー参考値 */
    const WIRE_DATA = [
      {構成:'6×7', d:6, A:14.4, Fb:21.4, kg:0.134, note:''},
      {構成:'6×7', d:8, A:25.5, Fb:38.1, kg:0.237, note:''},
      {構成:'6×7', d:9, A:32.3, Fb:48.2, kg:0.3, note:''},
      {構成:'6×7', d:10, A:39.9, Fb:59.5, kg:0.371, note:''},
      {構成:'6×7', d:12, A:57.5, Fb:85.6, kg:0.534, note:'旧1号・硬い'},
      {構成:'6×7', d:14, A:78.2, Fb:117, kg:0.727, note:''},
      {構成:'6×7', d:16, A:102, Fb:152, kg:0.95, note:''},
      {構成:'6×7', d:18, A:129, Fb:193, kg:1.2, note:''},
      {構成:'6×7', d:20, A:160, Fb:238, kg:1.48, note:''},
      {構成:'6×7', d:22, A:193, Fb:288, kg:1.8, note:''},
      {構成:'6×7', d:24, A:230, Fb:343, kg:2.14, note:''},
      {構成:'6×7', d:26, A:270, Fb:402, kg:2.51, note:''},
      {構成:'6×7', d:28, A:313, Fb:466, kg:2.91, note:''},
      {構成:'6×7', d:30, A:359, Fb:535, kg:3.34, note:''},
      {構成:'6×7', d:32, A:409, Fb:609, kg:3.8, note:''},
      {構成:'6×19', d:6, A:14.3, Fb:19.4, kg:0.131, note:''},
      {構成:'6×19', d:8, A:25.4, Fb:34.6, kg:0.233, note:''},
      {構成:'6×19', d:9, A:32.2, Fb:43.8, kg:0.295, note:''},
      {構成:'6×19', d:10, A:39.7, Fb:54.0, kg:0.364, note:''},
      {構成:'6×19', d:12, A:57.2, Fb:77.8, kg:0.524, note:'旧3号'},
      {構成:'6×19', d:14, A:77.8, Fb:106, kg:0.713, note:''},
      {構成:'6×19', d:16, A:102, Fb:138, kg:0.932, note:''},
      {構成:'6×19', d:18, A:129, Fb:175, kg:1.18, note:''},
      {構成:'6×19', d:20, A:159, Fb:216, kg:1.46, note:''},
      {構成:'6×19', d:22, A:192, Fb:261, kg:1.76, note:''},
      {構成:'6×19', d:24, A:229, Fb:311, kg:2.1, note:''},
      {構成:'6×19', d:26, A:268, Fb:365, kg:2.46, note:''},
      {構成:'6×19', d:28, A:311, Fb:424, kg:2.85, note:''},
      {構成:'6×24', d:6, A:12.9, Fb:17.7, kg:0.12, note:''},
      {構成:'6×24', d:8, A:22.9, Fb:31.6, kg:0.212, note:''},
      {構成:'6×24', d:9, A:29.0, Fb:39.9, kg:0.269, note:''},
      {構成:'6×24', d:10, A:35.8, Fb:49.3, kg:0.332, note:''},
      {構成:'6×24', d:12, A:51.6, Fb:71.0, kg:0.478, note:'★玉掛け最汎用（旧4号）'},
      {構成:'6×24', d:14, A:70.2, Fb:96.6, kg:0.651, note:''},
      {構成:'6×24', d:16, A:91.6, Fb:126, kg:0.85, note:''},
      {構成:'6×24', d:18, A:116, Fb:160, kg:1.08, note:''},
      {構成:'6×24', d:20, A:143, Fb:197, kg:1.33, note:''},
      {構成:'6×24', d:22, A:173, Fb:239, kg:1.61, note:''},
      {構成:'6×24', d:24, A:206, Fb:284, kg:1.91, note:''},
      {構成:'6×24', d:26, A:242, Fb:333, kg:2.24, note:''},
      {構成:'6×24', d:28, A:281, Fb:387, kg:2.6, note:''},
      {構成:'6×24', d:30, A:322, Fb:444, kg:2.99, note:''},
      {構成:'6×24', d:32, A:367, Fb:505, kg:3.4, note:''},
      {構成:'6×24', d:36, A:464, Fb:639, kg:4.3, note:''},
      {構成:'6×24', d:40, A:573, Fb:789, kg:5.31, note:''},
      {構成:'6×37', d:6, A:14.2, Fb:19.1, kg:0.129, note:''},
      {構成:'6×37', d:8, A:25.3, Fb:34.0, kg:0.23, note:''},
      {構成:'6×37', d:9, A:32.0, Fb:43.0, kg:0.291, note:''},
      {構成:'6×37', d:10, A:39.5, Fb:53.1, kg:0.359, note:''},
      {構成:'6×37', d:12, A:56.9, Fb:76.5, kg:0.517, note:'旧6号・柔軟'},
      {構成:'6×37', d:14, A:77.4, Fb:104, kg:0.704, note:''},
      {構成:'6×37', d:16, A:101, Fb:136, kg:0.92, note:''},
      {構成:'6×37', d:18, A:128, Fb:172, kg:1.16, note:''},
      {構成:'6×37', d:20, A:158, Fb:212, kg:1.44, note:''},
      {構成:'6×37', d:22, A:191, Fb:257, kg:1.74, note:''},
      {構成:'6×37', d:24, A:228, Fb:306, kg:2.07, note:''},
      {構成:'6×37', d:26, A:267, Fb:359, kg:2.43, note:''},
      {構成:'6×37', d:28, A:310, Fb:416, kg:2.82, note:''},
      {構成:'6×37', d:30, A:356, Fb:478, kg:3.23, note:''},
      {構成:'6×37', d:32, A:404, Fb:544, kg:3.68, note:''},
      {構成:'6×37', d:36, A:512, Fb:688, kg:4.66, note:''},
      {構成:'6×37', d:40, A:632, Fb:850, kg:5.75, note:''},
    ];

    /* アイボルト
       JIS : JIS B 1168:1994 付表1 使用荷重（垂直づり1個）。45度づりは「2個につき」の合計値で垂直と同値。
             質量はJIS参考値（ミスミ掲載値）
       RUD : ルッド ロードリング・プラス VLBG-PLUS（全方向・安全率4）
             出典: ルッドスパンセットジャパン リフティングポイントカタログ Edition-24.2
       v   : 使用荷重 kN（RUDは t×9.80665） */
    const EYEBOLT_DATA = [
      {type:'JIS', size:'M8',  d:8,  v:0.785, kg:0.03, note:'小型機器・計器類'},
      {type:'JIS', size:'M10', d:10, v:1.47,  kg:0.06, note:''},
      {type:'JIS', size:'M12', d:12, v:2.16,  kg:0.12, note:'★最汎用'},
      {type:'JIS', size:'M16', d:16, v:4.41,  kg:0.22, note:''},
      {type:'JIS', size:'M20', d:20, v:6.18,  kg:0.39, note:'中型機器'},
      {type:'JIS', size:'M24', d:24, v:9.32,  kg:0.80, note:''},
      {type:'JIS', size:'M30', d:30, v:14.7,  kg:1.56, note:'重量機器'},
      {type:'JIS', size:'M36', d:36, v:22.6,  kg:2.90, note:''},
      {type:'JIS', size:'M42', d:42, v:33.3,  kg:4.40, note:'大型設備'},
      {type:'JIS', size:'M48', d:48, v:44.1,  kg:6.10, note:''},
      {type:'RUD', size:'M8',  d:8,  t:0.63, model:'VLBG-PLUS 0.63t M8',  kg:0.30, torque:30,   note:''},
      {type:'RUD', size:'M10', d:10, t:0.9,  model:'VLBG-PLUS 0.9t M10',  kg:0.31, torque:60,   note:''},
      {type:'RUD', size:'M12', d:12, t:1.35, model:'VLBG-PLUS 1.35t M12', kg:0.34, torque:150,  note:''},
      {type:'RUD', size:'M16', d:16, t:2.0,  model:'VLBG-PLUS 2t M16',    kg:0.55, torque:150,  note:''},
      {type:'RUD', size:'M20', d:20, t:3.5,  model:'VLBG-PLUS 3.5t M20',  kg:1.30, torque:400,  note:''},
      {type:'RUD', size:'M24', d:24, t:4.5,  model:'VLBG-PLUS 4.5t M24',  kg:1.40, torque:760,  note:''},
      {type:'RUD', size:'M30', d:30, t:6.7,  model:'VLBG-PLUS 6.7t M30',  kg:3.22, torque:1000, note:''},
      {type:'RUD', size:'M36', d:36, t:8.0,  model:'VLBG-PLUS 8t M36',    kg:6.00, torque:800,  note:''},
      {type:'RUD', size:'M42', d:42, t:10.0, model:'VLBG-PLUS 10t M42',   kg:6.60, torque:1000, note:''},
      {type:'RUD', size:'M42', d:42, t:15.0, model:'VLBG-PLUS 15t M42',   kg:10.9, torque:1500, note:'大型リング'},
      {type:'RUD', size:'M48', d:48, t:20.0, model:'VLBG-PLUS 20t M48',   kg:11.6, torque:2000, note:''},
    ].map(r => r.type === 'RUD' ? {...r, v:+(r.t * 9.80665).toFixed(2)} : r);

    /* RUD VLBG-PLUS 吊り方係数（カタログ「吊り方における基本使用荷重G」）
       G(吊れる総重量) = 基本使用荷重 × 係数。β=吊り具の鉛直からの傾斜角（=開き角/2）
       4点吊りは3本で負担する前提（カタログ値 2.1 / 1.5 に一致） */
    function rudLoadFactor(n, beta) {
      if (n === 1) return 1.0;
      if (beta === 0) return n === 2 ? 2.0 : 3.0;   // 平行垂直吊り（3+4本は3本分）
      if (beta > 60) return 0;                      // 範囲外
      if (n === 2) return beta <= 45 ? 1.4 : 1.0;
      return beta <= 45 ? 2.1 : 1.5;                // 3点・4点
    }

    /* シャックル JIS B 2801:1996 等級M 使用荷重（t）
       呼び = 本体径 d（ピン径ではない）。呼び12〜18はSC/BC（ねじ込みピン）、20以上はSB/BB等
       出典: JIS B 2801-1996 表2（大洋製器 使用荷重一覧） */
    const SHACKLE_DATA = [
      [12,1.0],[14,1.25],[16,1.6],[18,2.0],[20,2.5],[22,3.15],[24,3.6],[26,4.0],[28,4.8],
      [30,5.0],[32,6.3],[34,7.0],[36,8.0],[38,9.0],[40,10.0],[42,11.0],[44,12.5],[46,13.0],
      [48,14.0],[50,16.0],[55,18.0],[60,20.0],[65,25.0],
    ].map(([nom, t]) => ({
      nom, t, wll: +(t * 9.80665).toFixed(2),
      form: nom <= 18 ? 'SC / BC（ねじ込み）' : 'SB / BB（ボルト・ナット）ほか',
    }));
