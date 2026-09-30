      // ════════════════════════════════════════
      // TAB: チェーン
      // ════════════════════════════════════════
      // cr_kn：ISO 606 最小引張強さ（つばき G8 カタログ記載値）。width：内リンク内幅の最小(ISO b1)。25/35はブシュ径
      const CHAIN_SPECS = {
        "25A": {
          pitch: 6.35,
          roller: 3.3,
          width: 3.18,
          cr_kn: 3.6,
        },
        "35A": {
          pitch: 9.525,
          roller: 5.08,
          width: 4.78,
          cr_kn: 8.7,
        },
        "40A": {
          pitch: 12.7,
          roller: 7.92,
          width: 7.85,
          cr_kn: 15.2,
        },
        "50A": {
          pitch: 15.875,
          roller: 10.16,
          width: 9.4,
          cr_kn: 24.0,
        },
        "60A": {
          pitch: 19.05,
          roller: 11.91,
          width: 12.57,
          cr_kn: 34.2,
        },
        "80A": {
          pitch: 25.4,
          roller: 15.88,
          width: 15.75,
          cr_kn: 61.2,
        },
        "100A": {
          pitch: 31.75,
          roller: 19.05,
          width: 18.9,
          cr_kn: 95.4,
        },
        25: {
          pitch: 6.35,
          roller: 3.3,
          width: 3.18,
          cr_kn: 3.6,
        },
        35: {
          pitch: 9.525,
          roller: 5.08,
          width: 4.78,
          cr_kn: 8.7,
        },
        40: {
          pitch: 12.7,
          roller: 7.92,
          width: 7.85,
          cr_kn: 15.2,
        },
        50: {
          pitch: 15.875,
          roller: 10.16,
          width: 9.4,
          cr_kn: 24.0,
        },
        60: {
          pitch: 19.05,
          roller: 11.91,
          width: 12.57,
          cr_kn: 34.2,
        },
        80: {
          pitch: 25.4,
          roller: 15.88,
          width: 15.75,
          cr_kn: 61.2,
        },
        100: {
          pitch: 31.75,
          roller: 19.05,
          width: 18.9,
          cr_kn: 95.4,
        },
      };
      function calcChain() {
        const sp = CHAIN_SPECS[$("chain-type").value];
        const n1 = +$("sp-n1").value,
          n2 = +$("sp-n2").value,
          C = +$("sp-span").value;
        if (!sp || !n1 || !n2 || !C) return;
        const P = sp.pitch;
        const pcd1 = P / Math.sin(Math.PI / n1),
          pcd2 = P / Math.sin(Math.PI / n2);
        const Lp_raw =
          (2 * C) / P +
          (n1 + n2) / 2 +
          Math.pow(n2 - n1, 2) /
            ((4 * Math.PI * Math.PI * C) / P);
        const Lp_even = Math.ceil(Lp_raw / 2) * 2;
        $("ch-pitch").innerHTML =
          `${P.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("ch-links").innerHTML =
          `${Lp_even}<span class="card-unit"> L</span>`;
        // 偶数リンクに切り上げたときの実軸間距離
        const A = Lp_even - (n1 + n2) / 2;
        const C_act = (P / 4) * (A + Math.sqrt(A * A - 2 * Math.pow((n2 - n1) / Math.PI, 2)));
        $("ch-links-sub").textContent =
          `計算値 ${Lp_raw.toFixed(1)} L → 偶数に切上げ（実軸間 ${C_act.toFixed(1)} mm）。奇数にするならオフセットリンク要`;
        $("ch-ratio").innerHTML = (n2 / n1).toFixed(3);
        $("chain-tbody").innerHTML = [
          ["歯数 N", n1, n2],
          ["PCD (mm)", pcd1.toFixed(3), pcd2.toFixed(3)],
          [
            "外径(概算)mm",
            (P * (0.6 + 1 / Math.tan(Math.PI / n1))).toFixed(1),
            (P * (0.6 + 1 / Math.tan(Math.PI / n2))).toFixed(1),
          ],
        ]
          .map(
            (r) =>
              `<tr><td>${r[0]}</td><td class="hl">${r[1]}</td><td class="hl">${r[2]}</td></tr>`,
          )
          .join("");
        $("chain-spec-tbody").innerHTML = [
          ["規格", $("chain-type").value],
          ["ピッチ mm", P.toFixed(3)],
          ["ローラー径 mm", sp.roller.toFixed(2)],
          ["内リンク幅 mm", sp.width.toFixed(2)],
          ["最小引張強さ（ISO 606）kN", sp.cr_kn.toFixed(1)],
        ]
          .map(
            (r) =>
              `<tr><td>${r[0]}</td><td class="hl">${r[1]}</td></tr>`,
          )
          .join("");
      }
