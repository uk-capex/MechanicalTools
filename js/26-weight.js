    /* ══════════════════════════════════════════
       重量計算
    ══════════════════════════════════════════ */
    const WT_MAT_LIST = [
      { label:'軟鋼・SS400',    rho:7.85, color:'var(--accent)' },
      { label:'SUS304',         rho:7.93, color:'#a0c4ff' },
      { label:'アルミ A5052',   rho:2.70, color:'var(--good)' },
      { label:'真鍮 C3604',     rho:8.50, color:'var(--warn)' },
      { label:'MCナイロン',     rho:1.15, color:'#c9a0ff' },
      { label:'純銅 C1100',     rho:8.96, color:'#ff9966' },
    ];

    const WT_SHAPE_DIMS = {
      round_bar:      [['外径 D','wt-d1',50]],
      pipe:           [['外径 D','wt-d1',60],['内径 d','wt-d2',50]],
      square_bar:     [['一辺 A','wt-d1',50]],
      square_pipe:    [['外寸 A','wt-d1',50],['肉厚 t','wt-d2',3]],
      flat_bar:       [['幅 W','wt-d1',50],['厚さ t','wt-d2',9]],
      plate:          [['幅 W','wt-d1',200],['厚さ t','wt-d2',9]],
      h_steel:        [['全高 H','wt-d1',200],['フランジ幅 B','wt-d2',100],['ウェブ厚 tw','wt-d3',5.5],['フランジ厚 tf','wt-d4',8]],
      c_steel:        [['全高 H','wt-d1',150],['フランジ幅 B','wt-d2',65],['ウェブ厚 tw','wt-d3',5.5],['フランジ厚 tf','wt-d4',8]],
      angle:          [['辺長 A','wt-d1',75],['板厚 t','wt-d2',6]],
      unequal_angle:  [['長辺 A','wt-d1',100],['短辺 B','wt-d2',75],['板厚 t','wt-d3',7]],
      i_beam:         [['全高 H','wt-d1',200],['フランジ幅 B','wt-d2',100],['ウェブ厚 tw','wt-d3',7],['フランジ厚 tf','wt-d4',11]],
    };

    const WT_DIM_LABELS = [
      ['wt-d1',''],['wt-d2',''],['wt-d3',''],['wt-d4','']
    ];

    function wtShapeChange() {
      const shape = document.getElementById('wt-shape').value;
      const defs   = WT_SHAPE_DIMS[shape];
      const wrap   = document.getElementById('wt-dims');
      wrap.innerHTML = defs.map(([lbl,id,def]) => `
        <div class="field">
          <label>${lbl}（mm）</label>
          <input type="number" id="${id}" value="${def}" min="0.1" step="0.1" oninput="wtCalc()">
        </div>`).join('');
      wtCalc();
    }

    function wtGetVal(id) {
      const el = document.getElementById(id);
      return el ? (parseFloat(el.value) || 0) : 0;
    }

    function wtArea(shape) {
      const d1=wtGetVal('wt-d1'), d2=wtGetVal('wt-d2'),
            d3=wtGetVal('wt-d3'), d4=wtGetVal('wt-d4');
      switch(shape) {
        case 'round_bar':     return Math.PI/4 * d1*d1;
        case 'pipe':          return Math.PI/4 * (d1*d1 - d2*d2);
        case 'square_bar':    return d1*d1;
        case 'square_pipe':   return d1*d1 - (d1-d2*2)*(d1-d2*2);
        case 'flat_bar':
        case 'plate':         return d1*d2;
        case 'h_steel':       return d2*d4*2 + (d1-d4*2)*d3;
        case 'c_steel':       return d2*d4*2 + (d1-d4*2)*d3;
        case 'angle':         return (2*d1 - d2)*d2;
        case 'unequal_angle': return (d1+d2-d3)*d3;
        case 'i_beam':        return d2*d4*2 + (d1-d4*2)*d3;
        default: return 0;
      }
    }

    function wtCalc() {
      const matSel = document.getElementById('wt-mat').value;
      const customField = document.getElementById('wt-custom-field');
      let rho;
      if (matSel === 'custom') {
        customField.style.display = '';
        rho = parseFloat(document.getElementById('wt-custom-rho').value) || 7.85;
      } else {
        customField.style.display = 'none';
        rho = parseFloat(matSel);
      }

      const shape = document.getElementById('wt-shape').value;
      const L     = wtGetVal('wt-len');
      const qty   = Math.max(1, wtGetVal('wt-qty'));
      const A     = wtArea(shape);   // mm²
      const vol   = A * L;           // mm³
      const massG = vol * rho * 1e-3; // g  (mm³ × g/cm³ × 1e-3)
      const massKg = massG / 1000;
      const kgm    = A * rho * 1e-3;  // kg/m

      const fmt = v => v >= 100   ? v.toFixed(1)
                     : v >= 1     ? v.toFixed(3)
                     : v >= 0.001 ? v.toFixed(4)
                     : v.toExponential(3);

      document.getElementById('wt-one').innerHTML    = `${fmt(massKg)}<span class="card-unit"> kg</span>`;
      document.getElementById('wt-one-g').textContent = `${massG >= 1000 ? (massG/1000).toFixed(2)+'kg' : massG.toFixed(1)+'g'}`;
      document.getElementById('wt-total').innerHTML  = `${fmt(massKg*qty)}<span class="card-unit"> kg</span>`;
      document.getElementById('wt-total-sub').textContent = qty > 1 ? `${qty}本 合計` : '1本';
      document.getElementById('wt-area').innerHTML   = `${A.toFixed(2)}<span class="card-unit"> mm²</span>`;
      document.getElementById('wt-len-show').textContent = `L = ${L} mm`;
      document.getElementById('wt-kgm').innerHTML    = `${kgm.toFixed(3)}<span class="card-unit"> kg/m</span>`;
      document.getElementById('wt-rho-show').innerHTML = `${rho}<span class="card-unit"> g/cm³</span>`;

      wtDrawSVG(shape);
      wtDrawCompare(shape, L, qty, rho);
    }

    function wtDrawSVG(shape) {
      const d1=wtGetVal('wt-d1'), d2=wtGetVal('wt-d2'),
            d3=wtGetVal('wt-d3'), d4=wtGetVal('wt-d4');
      const W=200, H=140, cx=100, cy=70;
      const s = '#388bfd', f = '#1c3a6b', g = '#cdd9e5';
      let svg = '', formula = '';

      const sc = (v, ref, max=80) => v>0 ? v/ref*max : max;

      switch(shape) {
        case 'round_bar': {
          const r = Math.min(60, sc(d1,100,60));
          svg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" stroke="${s}" stroke-width="1.5"/>`;
          svg += wtDimLine(cx-r, cy, cx+r, cy, `Φ${d1}`, 'h', W, H);
          formula = `A = π/4 × D²`;
          break;
        }
        case 'pipe': {
          const ro = Math.min(60, sc(d1,100,60));
          const ri = ro * (d2/d1);
          svg = `<circle cx="${cx}" cy="${cy}" r="${ro}" fill="${f}" stroke="${s}" stroke-width="1.5"/>
                 <circle cx="${cx}" cy="${cy}" r="${ri}" fill="var(--bg)" stroke="${s}" stroke-width="1.5"/>`;
          svg += wtDimLine(cx, cy, cx+ro, cy, `D=${d1}`, 'h', W, H);
          svg += wtDimLine(cx, cy, cx+ri, cy+15, `d=${d2}`, 'h', W, H);
          formula = `A = π/4 × (D² − d²)`;
          break;
        }
        case 'square_bar': {
          const a = Math.min(80, sc(d1,100,80));
          svg = `<rect x="${cx-a/2}" y="${cy-a/2}" width="${a}" height="${a}" fill="${f}" stroke="${s}" stroke-width="1.5"/>`;
          svg += wtDimLine(cx-a/2, cy+a/2+10, cx+a/2, cy+a/2+10, `${d1}`, 'h', W, H);
          formula = `A = A²`;
          break;
        }
        case 'square_pipe': {
          const ao = Math.min(80, sc(d1,100,80));
          const ai = ao * Math.max(0, (d1-d2*2)/d1);
          svg = `<rect x="${cx-ao/2}" y="${cy-ao/2}" width="${ao}" height="${ao}" fill="${f}" stroke="${s}" stroke-width="1.5"/>
                 <rect x="${cx-ai/2}" y="${cy-ai/2}" width="${ai}" height="${ai}" fill="var(--bg)" stroke="${s}" stroke-width="1.5"/>`;
          svg += wtDimLine(cx-ao/2, cy+ao/2+10, cx+ao/2, cy+ao/2+10, `A=${d1}`, 'h', W, H);
          svg += wtDimLine(cx+ao/2+12, cy-ao/2, cx+ao/2+12, cy+ao/2, `t=${d2}`, 'v', W, H);
          formula = `A = A² − (A−2t)²`;
          break;
        }
        case 'flat_bar':
        case 'plate': {
          const bw = Math.min(120, sc(d1,200,120));
          const bh = Math.min(40, sc(d2,50,40));
          svg = `<rect x="${cx-bw/2}" y="${cy-bh/2}" width="${bw}" height="${bh}" fill="${f}" stroke="${s}" stroke-width="1.5"/>`;
          svg += wtDimLine(cx-bw/2, cy+bh/2+12, cx+bw/2, cy+bh/2+12, `W=${d1}`, 'h', W, H);
          svg += wtDimLine(cx+bw/2+12, cy-bh/2, cx+bw/2+12, cy+bh/2, `t=${d2}`, 'v', W, H);
          formula = `A = W × t`;
          break;
        }
        case 'h_steel':
        case 'i_beam': {
          const fh = Math.min(90, sc(d1,300,90));
          const fw = Math.min(70, sc(d2,200,70));
          const tw = Math.max(3, sc(d3,20,10));
          const tf = Math.max(4, sc(d4,20,12));
          const x0=cx-fw/2, y0=cy-fh/2;
          svg = `<rect x="${x0}" y="${y0}" width="${fw}" height="${tf}" fill="${f}" stroke="${s}" stroke-width="1.5"/>
                 <rect x="${cx-tw/2}" y="${y0+tf}" width="${tw}" height="${fh-tf*2}" fill="${f}" stroke="${s}" stroke-width="1.5"/>
                 <rect x="${x0}" y="${y0+fh-tf}" width="${fw}" height="${tf}" fill="${f}" stroke="${s}" stroke-width="1.5"/>`;
          svg += wtDimLine(x0-14, y0, x0-14, y0+fh, `H=${d1}`, 'v', W, H);
          svg += wtDimLine(x0, y0-12, x0+fw, y0-12, `B=${d2}`, 'h', W, H);
          formula = `A = B×tf×2 + (H−tf×2)×tw`;
          break;
        }
        case 'c_steel': {
          const fh = Math.min(90, sc(d1,200,90));
          const fw = Math.min(55, sc(d2,100,55));
          const tw = Math.max(3, sc(d3,15,8));
          const tf = Math.max(4, sc(d4,15,10));
          const x0=cx-fw/2, y0=cy-fh/2;
          svg = `<rect x="${x0}" y="${y0}" width="${fw}" height="${tf}" fill="${f}" stroke="${s}" stroke-width="1.5"/>
                 <rect x="${x0}" y="${y0+tf}" width="${tw}" height="${fh-tf*2}" fill="${f}" stroke="${s}" stroke-width="1.5"/>
                 <rect x="${x0}" y="${y0+fh-tf}" width="${fw}" height="${tf}" fill="${f}" stroke="${s}" stroke-width="1.5"/>`;
          svg += wtDimLine(x0-14, y0, x0-14, y0+fh, `H=${d1}`, 'v', W, H);
          svg += wtDimLine(x0, y0-12, x0+fw, y0-12, `B=${d2}`, 'h', W, H);
          formula = `A = B×tf×2 + (H−tf×2)×tw`;
          break;
        }
        case 'angle': {
          const al = Math.min(70, sc(d1,100,70));
          const at = Math.max(3, sc(d2,15,10));
          const x0=cx-al/2, y0=cy-al/2;
          svg = `<rect x="${x0}" y="${y0}" width="${at}" height="${al}" fill="${f}" stroke="${s}" stroke-width="1.5"/>
                 <rect x="${x0+at}" y="${y0+al-at}" width="${al-at}" height="${at}" fill="${f}" stroke="${s}" stroke-width="1.5"/>`;
          svg += wtDimLine(x0-14, y0, x0-14, y0+al, `A=${d1}`, 'v', W, H);
          svg += wtDimLine(x0, y0+al+12, x0+al, y0+al+12, `A=${d1}`, 'h', W, H);
          formula = `A = (2A − t) × t`;
          break;
        }
        case 'unequal_angle': {
          const la = Math.min(80, sc(d1,120,80));
          const lb = Math.min(60, sc(d2,100,60));
          const at = Math.max(3, sc(d3,15,9));
          const x0=cx-la/2, y0=cy-la/2;
          svg = `<rect x="${x0}" y="${y0}" width="${at}" height="${la}" fill="${f}" stroke="${s}" stroke-width="1.5"/>
                 <rect x="${x0+at}" y="${y0+la-at}" width="${lb-at}" height="${at}" fill="${f}" stroke="${s}" stroke-width="1.5"/>`;
          svg += wtDimLine(x0-14, y0, x0-14, y0+la, `A=${d1}`, 'v', W, H);
          svg += wtDimLine(x0, y0+la+12, x0+lb, y0+la+12, `B=${d2}`, 'h', W, H);
          formula = `A = (A + B − t) × t`;
          break;
        }
      }

      document.getElementById('wt-svg-wrap').innerHTML =
        `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"
          style="overflow:visible">${svg}</svg>`;
      document.getElementById('wt-formula').textContent = formula;
    }

    function wtDimLine(x1,y1,x2,y2,label,dir,W,H) {
      const m='var(--muted)', fs=9;
      if(dir==='h') {
        const my=(y1+y2)/2;
        return `<line x1="${x1}" y1="${my}" x2="${x2}" y2="${my}" stroke="${m}" stroke-width="1" stroke-dasharray="3,2"/>
                <text x="${(x1+x2)/2}" y="${my-3}" fill="${m}" font-size="${fs}" text-anchor="middle"
                  font-family="JetBrains Mono,monospace">${label}</text>`;
      } else {
        const mx=(x1+x2)/2;
        return `<line x1="${mx}" y1="${y1}" x2="${mx}" y2="${y2}" stroke="${m}" stroke-width="1" stroke-dasharray="3,2"/>
                <text x="${mx+3}" y="${(y1+y2)/2+4}" fill="${m}" font-size="${fs}" text-anchor="start"
                  font-family="JetBrains Mono,monospace">${label}</text>`;
      }
    }

    function wtDrawCompare(shape, L, qty, currentRho) {
      const A = wtArea(shape);
      const maxKg = Math.max(...WT_MAT_LIST.map(m => A*L*m.rho*1e-6));
      const rows = WT_MAT_LIST.map(m => {
        const kg = A * L * m.rho * 1e-6;
        const pct = maxKg > 0 ? kg/maxKg*100 : 0;
        const isActive = Math.abs(m.rho - currentRho) < 0.01;
        return `<div style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
            <span style="color:${isActive?'var(--ink)':'var(--muted)'};font-weight:${isActive?700:400}">${m.label}</span>
            <span style="font-family:'JetBrains Mono',monospace;color:${isActive?'var(--accent)':'var(--muted)'}">
              ${kg>=100?kg.toFixed(1):kg.toFixed(3)} kg</span>
          </div>
          <div style="height:8px;background:var(--bg);border-radius:4px;overflow:hidden;">
            <div style="height:100%;width:${pct.toFixed(1)}%;background:${isActive?'var(--accent)':m.color};opacity:${isActive?1:0.45};border-radius:4px;transition:width .3s;"></div>
          </div>
        </div>`;
      }).join('');
      document.getElementById('wt-compare').innerHTML = rows;
    }

    /* 初期化 */
    
    /* ══════════════════════════════════════════
       🔵 Oリング / シール
    ══════════════════════════════════════════ */

    /* ── Oリングデータ (JIS B 2401) ── */
    const OR_DATA = [
      // P系 (運動用)
      {id:'P3',   d1:2.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'P'},
      {id:'P4',   d1:3.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'P'},
      {id:'P5',   d1:4.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'P'},
      {id:'P6',   d1:5.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'P'},
      {id:'P7',   d1:6.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'P'},
      {id:'P8',   d1:7.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'P'},
      {id:'P9',   d1:8.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'P'},
      {id:'P10',  d1:9.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'P'},
      {id:'P10A', d1:10.0, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P11',  d1:10.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P11A', d1:11.0, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P12',  d1:11.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P12A', d1:12.0, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P14',  d1:13.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P15',  d1:14.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P16',  d1:15.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P18',  d1:17.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P20',  d1:19.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P21',  d1:20.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P22',  d1:21.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'P'},
      {id:'P22A', d1:22.0, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P24',  d1:23.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P25',  d1:24.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P25A', d1:25.0, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P26',  d1:25.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P28',  d1:27.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P29',  d1:28.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P30',  d1:29.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P31',  d1:30.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P32',  d1:31.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P34',  d1:33.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P35',  d1:34.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P35A', d1:35.0, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P38',  d1:37.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P40',  d1:39.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P42',  d1:41.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P44',  d1:43.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P45',  d1:44.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P46',  d1:45.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P48',  d1:47.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P50',  d1:49.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P53',  d1:52.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P55',  d1:54.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P56',  d1:55.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P58',  d1:57.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P60',  d1:59.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'P'},
      {id:'P62',  d1:61.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P63',  d1:62.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P65',  d1:64.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P67',  d1:66.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P70',  d1:69.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P75',  d1:74.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P80',  d1:79.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P85',  d1:84.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P90',  d1:89.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P95',  d1:94.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P100', d1:99.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P105', d1:104.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P110', d1:109.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P112', d1:111.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P115', d1:114.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P118', d1:117.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P120', d1:119.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P125', d1:124.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P130', d1:129.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P132', d1:131.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P136', d1:135.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P140', d1:139.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P145', d1:144.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P150', d1:149.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'P'},
      {id:'P155', d1:154.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P160', d1:159.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P165', d1:164.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P170', d1:169.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P175', d1:174.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P180', d1:179.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P185', d1:184.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P190', d1:189.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P200', d1:199.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P210', d1:209.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P220', d1:219.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P230', d1:229.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P240', d1:239.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P250', d1:249.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P260', d1:259.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P270', d1:269.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P280', d1:279.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P290', d1:289.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P300', d1:299.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P315', d1:314.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P335', d1:334.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P355', d1:354.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P375', d1:374.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P400', d1:399.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      // P系 拡張（P425〜P800）※JIS B 2401参考値・大径
      {id:'P425', d1:424.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P450', d1:449.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P475', d1:474.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P500', d1:499.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'P'},
      {id:'P530', d1:529.8,d2:11.0,bDyn:13.5,bSta:13.2,tDyn:8.5, tSta:8.8, C:2.0, use:'dynamic', series:'P'},
      {id:'P560', d1:559.8,d2:11.0,bDyn:13.5,bSta:13.2,tDyn:8.5, tSta:8.8, C:2.0, use:'dynamic', series:'P'},
      {id:'P600', d1:599.8,d2:11.0,bDyn:13.5,bSta:13.2,tDyn:8.5, tSta:8.8, C:2.0, use:'dynamic', series:'P'},
      {id:'P630', d1:629.8,d2:11.0,bDyn:13.5,bSta:13.2,tDyn:8.5, tSta:8.8, C:2.0, use:'dynamic', series:'P'},
      {id:'P670', d1:669.8,d2:11.0,bDyn:13.5,bSta:13.2,tDyn:8.5, tSta:8.8, C:2.0, use:'dynamic', series:'P'},
      {id:'P710', d1:709.8,d2:11.0,bDyn:13.5,bSta:13.2,tDyn:8.5, tSta:8.8, C:2.0, use:'dynamic', series:'P'},
      {id:'P750', d1:749.8,d2:11.0,bDyn:13.5,bSta:13.2,tDyn:8.5, tSta:8.8, C:2.0, use:'dynamic', series:'P'},
      {id:'P800', d1:799.8,d2:11.0,bDyn:13.5,bSta:13.2,tDyn:8.5, tSta:8.8, C:2.0, use:'dynamic', series:'P'},
      // S系 (小型シリンダ用 / 運動用)
      {id:'S6',   d1:5.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'S'},
      {id:'S8',   d1:7.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'S'},
      {id:'S10',  d1:9.8,  d2:1.9, bDyn:2.4, bSta:2.3, tDyn:1.4, tSta:1.5, C:0.4, use:'dynamic', series:'S'},
      {id:'S12',  d1:11.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'S'},
      {id:'S14',  d1:13.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'S'},
      {id:'S15',  d1:14.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'S'},
      {id:'S16',  d1:15.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'S'},
      {id:'S18',  d1:17.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'S'},
      {id:'S20',  d1:19.8, d2:2.4, bDyn:3.0, bSta:2.9, tDyn:1.8, tSta:1.9, C:0.4, use:'dynamic', series:'S'},
      {id:'S22',  d1:21.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S24',  d1:23.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S25',  d1:24.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S28',  d1:27.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S30',  d1:29.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S32',  d1:31.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S35',  d1:34.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S38',  d1:37.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S40',  d1:39.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S45',  d1:44.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S50',  d1:49.8, d2:3.5, bDyn:4.4, bSta:4.2, tDyn:2.7, tSta:2.8, C:0.8, use:'dynamic', series:'S'},
      {id:'S55',  d1:54.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S60',  d1:59.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S65',  d1:64.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S70',  d1:69.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S75',  d1:74.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S80',  d1:79.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S85',  d1:84.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S90',  d1:89.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S95',  d1:94.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S100', d1:99.8, d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S110', d1:109.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S120', d1:119.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S125', d1:124.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S130', d1:129.8,d2:5.7, bDyn:7.1, bSta:6.9, tDyn:4.4, tSta:4.6, C:1.2, use:'dynamic', series:'S'},
      {id:'S140', d1:139.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'S'},
      {id:'S150', d1:149.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'S'},
      {id:'S160', d1:159.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'S'},
      {id:'S180', d1:179.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'S'},
      {id:'S200', d1:199.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'S'},
      {id:'S220', d1:219.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'S'},
      {id:'S250', d1:249.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'S'},
      {id:'S280', d1:279.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'S'},
      {id:'S300', d1:299.8,d2:8.4, bDyn:10.3,bSta:10.0,tDyn:6.4, tSta:6.7, C:1.6, use:'dynamic', series:'S'},
      // G系 (固定用)
      {id:'G25',  d1:24.4, d2:3.1, bDyn:null, bSta:3.8, tDyn:null, tSta:2.4, C:0.4, use:'static', series:'G'},
      {id:'G30',  d1:29.4, d2:3.1, bDyn:null, bSta:3.8, tDyn:null, tSta:2.4, C:0.4, use:'static', series:'G'},
      {id:'G35',  d1:34.4, d2:3.1, bDyn:null, bSta:3.8, tDyn:null, tSta:2.4, C:0.4, use:'static', series:'G'},
      {id:'G40',  d1:39.4, d2:3.1, bDyn:null, bSta:3.8, tDyn:null, tSta:2.4, C:0.4, use:'static', series:'G'},
      {id:'G45',  d1:44.4, d2:3.1, bDyn:null, bSta:3.8, tDyn:null, tSta:2.4, C:0.4, use:'static', series:'G'},
      {id:'G50',  d1:49.4, d2:3.1, bDyn:null, bSta:3.8, tDyn:null, tSta:2.4, C:0.4, use:'static', series:'G'},
      {id:'G55',  d1:54.4, d2:3.1, bDyn:null, bSta:3.8, tDyn:null, tSta:2.4, C:0.4, use:'static', series:'G'},
      {id:'G60',  d1:59.4, d2:3.1, bDyn:null, bSta:3.8, tDyn:null, tSta:2.4, C:0.4, use:'static', series:'G'},
      {id:'G65',  d1:63.1, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G70',  d1:68.1, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G75',  d1:73.1, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G80',  d1:78.1, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G85',  d1:83.1, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G90',  d1:88.1, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G95',  d1:93.1, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G100', d1:98.1, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G105', d1:103.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G110', d1:108.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G115', d1:113.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G120', d1:118.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G125', d1:123.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G130', d1:128.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G135', d1:133.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G140', d1:138.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G145', d1:143.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G150', d1:148.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      // G系 拡張（G160〜G800）※JIS B 2401参考値
      {id:'G160', d1:158.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G170', d1:168.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G180', d1:178.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G190', d1:188.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G200', d1:198.1,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'G'},
      {id:'G215', d1:213.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G220', d1:218.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G230', d1:228.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G240', d1:238.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G250', d1:248.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G260', d1:258.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G270', d1:268.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G280', d1:278.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G290', d1:288.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G300', d1:298.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G320', d1:318.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G340', d1:338.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G360', d1:358.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G380', d1:378.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G400', d1:398.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G420', d1:418.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G440', d1:438.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G460', d1:458.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G480', d1:478.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G500', d1:498.1,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'G'},
      {id:'G530', d1:528.1,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'G'},
      {id:'G560', d1:558.1,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'G'},
      {id:'G600', d1:598.1,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'G'},
      {id:'G630', d1:628.1,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'G'},
      {id:'G670', d1:668.1,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'G'},
      {id:'G710', d1:708.1,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'G'},
      {id:'G750', d1:748.1,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'G'},
      {id:'G800', d1:798.1,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'G'},
      // V系 (真空フランジ)
      {id:'V30',  d1:29.0, d2:3.5, bDyn:null, bSta:4.2, tDyn:null, tSta:2.8, C:0.8, use:'static', series:'V'},
      {id:'V40',  d1:39.0, d2:3.5, bDyn:null, bSta:4.2, tDyn:null, tSta:2.8, C:0.8, use:'static', series:'V'},
      {id:'V50',  d1:49.0, d2:3.5, bDyn:null, bSta:4.2, tDyn:null, tSta:2.8, C:0.8, use:'static', series:'V'},
      {id:'V63',  d1:62.0, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V75',  d1:74.0, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V90',  d1:88.0, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V100', d1:98.0, d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V110', d1:108.0,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V125', d1:122.5,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V140', d1:137.2,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V150', d1:147.0,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V160', d1:156.8,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V175', d1:171.5,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V200', d1:196.0,d2:5.7, bDyn:null, bSta:6.9, tDyn:null, tSta:4.6, C:0.8, use:'static', series:'V'},
      {id:'V225', d1:220.5,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V250', d1:245.0,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V275', d1:269.5,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V300', d1:294.0,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V325', d1:318.5,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V350', d1:343.0,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V375', d1:367.5,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V400', d1:392.0,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V425', d1:416.5,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V450', d1:441.0,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V475', d1:465.5,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V500', d1:490.0,d2:8.4, bDyn:null, bSta:10.3,tDyn:null, tSta:6.7, C:1.2, use:'static', series:'V'},
      {id:'V530', d1:519.4,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V560', d1:548.8,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V600', d1:588.0,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V630', d1:617.4,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V670', d1:656.6,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V700', d1:686.0,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V750', d1:735.0,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V800', d1:784.0,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V850', d1:833.0,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V900', d1:882.0,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V950', d1:931.0,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
      {id:'V1000',d1:980.0,d2:11.0,bDyn:null, bSta:13.5,tDyn:null, tSta:8.8, C:1.6, use:'static', series:'V'},
    ];
