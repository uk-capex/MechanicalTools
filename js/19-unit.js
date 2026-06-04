      function convLen(from) {
        if (from === "inch")
          $("u-mm").value = (
            +$("u-inch").value * 25.4
          ).toFixed(4);
        else
          $("u-inch").value = (
            +$("u-mm").value / 25.4
          ).toFixed(5);
      }
      function convFrac() {
        const v = +$("u-frac").value;
        if (!v) return;
        $("u-frac-result").textContent =
          `${v}" = ${(v * 25.4).toFixed(4)} mm`;
      }
      function convTorque(from) {
        if (from === "nm")
          $("u-kgfcm").value = (
            +$("u-nm").value * 10.197
          ).toFixed(4);
        else
          $("u-nm").value = (
            +$("u-kgfcm").value / 10.197
          ).toFixed(5);
      }
      function convTorque2(from) {
        if (from === "nm")
          $("u-lbfft").value = (
            +$("u-nm2").value * 0.7376
          ).toFixed(4);
        else
          $("u-nm2").value = (
            +$("u-lbfft").value / 0.7376
          ).toFixed(4);
      }
      function convLoad(from) {
        const vals = {
          n: 1,
          kgf: 9.80665,
          kn: 1000,
          lbf: 4.44822,
        };
        const ids = {
          n: "u-load-n",
          kgf: "u-load-kgf",
          kn: "u-load-kn",
          lbf: "u-load-lbf",
        };
        const n_val = +$(ids[from]).value * vals[from];
        for (const [k, f] of Object.entries(vals))
          if (k !== from)
            $(ids[k]).value = (n_val / f).toFixed(
              k === "kn" ? 6 : 4,
            );
      }
      function convTemp(from) {
        let c;
        if (from === "c") c = +$("u-temp-c").value;
        else if (from === "f")
          c = ((+$("u-temp-f").value - 32) * 5) / 9;
        else c = +$("u-temp-k").value - 273.15;
        if (c < -273.15) {
          c = -273.15;
        } // 絶対零度クランプ
        if (from !== "c")
          $("u-temp-c").value = c.toFixed(2);
        if (from !== "f")
          $("u-temp-f").value = ((c * 9) / 5 + 32).toFixed(
            2,
          );
        if (from !== "k")
          $("u-temp-k").value = (c + 273.15).toFixed(2);
      }
      function convPress(from) {
        // 全て Pa 基準で統一
        const vals = {
          mpa: 1e6,
          kpa: 1e3,
          hpa: 1e2,
          pa: 1,
          psi: 6894.757,
          kgfcm2: 98066.5,
          kgfmm2: 9806650,
          nmm2: 1e6, // 1 N/mm² = 1 MPa
          knmm2: 1e9, // 1 kN/mm² = 1 GPa
          bar: 1e5,
        };
        const ids = {
          mpa: "u-mpa",
          kpa: "u-kpa",
          hpa: "u-hpa",
          pa: "u-pa",
          psi: "u-psi",
          kgfcm2: "u-kgfcm2",
          kgfmm2: "u-kgfmm2",
          nmm2: "u-nmm2",
          knmm2: "u-knmm2",
          bar: "u-bar",
        };
        const pa_val = +$(ids[from]).value * vals[from];
        for (const [k, f] of Object.entries(vals)) {
          if (k === from) continue;
          const v = pa_val / f;
          let dec = 4;
          if (k === "pa") dec = 1;
          if (k === "hpa") dec = 2;
          if (k === "kpa") dec = 3;
          if (k === "knmm2") dec = 7;
          $(ids[k]).value = v.toFixed(dec);
        }
      }
      function convPow(from) {
        if (from === "kw")
          $("u-ps").value = (
            +$("u-kw").value * 1.3596
          ).toFixed(4);
        else
          $("u-kw").value = (
            +$("u-ps").value / 1.3596
          ).toFixed(5);
      }
      function calcPeriph() {
        const rpm = +$("u-rpm").value,
          d = +$("u-dia").value;
        if (!rpm || !d) return;
        $("u-periph").textContent =
          `${((Math.PI * d * rpm) / 1000).toFixed(2)} m/min = ${((Math.PI * d * rpm) / 60000).toFixed(3)} m/s`;
      }
      function convVol(from) {
        // 全て m³ 基準で統一
        const vals = {
          m3: 1,
          l: 1e-3, // 1 L = 0.001 m³
          cm3: 1e-6, // cm³ = cc = mL
          mm3: 1e-9,
          in3: 1.6387064e-5, // (0.0254)³
          ft3: 0.028316846592, // (0.3048)³
          usgal: 0.003785411784, // 231 in³
        };
        const ids = {
          m3: "u-vol-m3",
          l: "u-vol-l",
          cm3: "u-vol-cm3",
          mm3: "u-vol-mm3",
          in3: "u-vol-in3",
          ft3: "u-vol-ft3",
          usgal: "u-vol-usgal",
        };
        const m3_val = +$(ids[from]).value * vals[from];
        for (const [k, f] of Object.entries(vals)) {
          if (k === from) continue;
          const v = m3_val / f;
          let dec = 4;
          if (k === "m3") dec = 6;
          if (k === "l") dec = 4;
          if (k === "cm3") dec = 2;
          if (k === "mm3") dec = 0;
          if (k === "in3") dec = 4;
          if (k === "ft3") dec = 6;
          if (k === "usgal") dec = 5;
          $(ids[k]).value = v.toFixed(dec);
        }
      }
      function convFlow(from) {
        // 全て L/min 基準で統一
        const vals = {
          lpm: 1,
          m3h: 1000 / 60, // 1 m³/h = 16.6667 L/min
          gpm: 3.785411784, // 1 US gal/min
        };
        const ids = {
          lpm: "u-flow-lpm",
          m3h: "u-flow-m3h",
          gpm: "u-flow-gpm",
        };
        const lpm_val = +$(ids[from]).value * vals[from];
        for (const [k, f] of Object.entries(vals)) {
          if (k === from) continue;
          $(ids[k]).value = (lpm_val / f).toFixed(
            k === "lpm" ? 3 : 4,
          );
        }
      }

      // ════════════════════════════════════════
      // バージョン情報をコメントから読み込んで右上に表示
      // ════════════════════════════════════════

      // ════════════════════════════════════════════════════
      //  DATA
      // ════════════════════════════════════════════════════

      // 鉄/アルミの物性
