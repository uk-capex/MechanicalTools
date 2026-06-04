      // ════════════════════════════════════════
      // TAB: チェーン
      // ════════════════════════════════════════
      const CHAIN_SPECS = {
        "25A": {
          pitch: 6.35,
          roller: 3.18,
          width: 3.18,
          cr_kn: 4.4,
        },
        "35A": {
          pitch: 9.525,
          roller: 5.08,
          width: 5.08,
          cr_kn: 9.3,
        },
        "40A": {
          pitch: 12.7,
          roller: 7.92,
          width: 7.85,
          cr_kn: 14.4,
        },
        "50A": {
          pitch: 15.875,
          roller: 10.16,
          width: 9.4,
          cr_kn: 22.2,
        },
        "60A": {
          pitch: 19.05,
          roller: 11.91,
          width: 12.57,
          cr_kn: 31.8,
        },
        "80A": {
          pitch: 25.4,
          roller: 15.88,
          width: 15.75,
          cr_kn: 57.8,
        },
        "100A": {
          pitch: 31.75,
          roller: 19.05,
          width: 18.9,
          cr_kn: 88.5,
        },
        25: {
          pitch: 6.35,
          roller: 3.18,
          width: 3.18,
          cr_kn: 4.4,
        },
        35: {
          pitch: 9.525,
          roller: 5.08,
          width: 5.08,
          cr_kn: 9.3,
        },
        40: {
          pitch: 12.7,
          roller: 7.92,
          width: 7.85,
          cr_kn: 14.4,
        },
        50: {
          pitch: 15.875,
          roller: 10.16,
          width: 9.4,
          cr_kn: 22.2,
        },
        60: {
          pitch: 19.05,
          roller: 11.91,
          width: 12.57,
          cr_kn: 31.8,
        },
        80: {
          pitch: 25.4,
          roller: 15.88,
          width: 15.75,
          cr_kn: 57.8,
        },
        100: {
          pitch: 31.75,
          roller: 19.05,
          width: 18.9,
          cr_kn: 88.5,
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
        $("ch-links-sub").textContent =
          Math.ceil(Lp_raw) % 2 !== 0
            ? "⚠ オフセットリンク必要"
            : "偶数リンク（ストレート）";
        $("ch-ratio").innerHTML = (n2 / n1).toFixed(3);
        $("chain-tbody").innerHTML = [
          ["歯数 N", n1, n2],
          ["PCD (mm)", pcd1.toFixed(3), pcd2.toFixed(3)],
          [
            "外径(概算)mm",
            (pcd1 + sp.roller).toFixed(3),
            (pcd2 + sp.roller).toFixed(3),
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
          ["基本動定格荷重 kN", sp.cr_kn.toFixed(1)],
        ]
          .map(
            (r) =>
              `<tr><td>${r[0]}</td><td class="hl">${r[1]}</td></tr>`,
          )
          .join("");
      }
