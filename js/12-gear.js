      // ════════════════════════════════════════
      // TAB: 歯車
      // ════════════════════════════════════════
      function gearModuleChange() {
        $("gear-module-custom-wrap").style.display =
          $("gear-module").value === "custom" ? "" : "none";
        calcGear();
      }
      function calcGear() {
        const mSel = $("gear-module").value;
        const m =
          mSel === "custom"
            ? +$("gear-module-custom").value
            : +mSel;
        const z1 = +$("gear-z1").value,
          z2 = +$("gear-z2").value;
        if (!m || !z1 || !z2) return;
        const pcd1 = m * z1,
          pcd2 = m * z2;
        const da1 = m * (z1 + 2),
          da2 = m * (z2 + 2);
        const df1 = m * (z1 - 2.5),
          df2 = m * (z2 - 2.5);
        const center = (m * (z1 + z2)) / 2;
        $("gr-center").innerHTML =
          `${center.toFixed(3)}<span class="card-unit"> mm</span>`;
        $("gr-ratio").innerHTML = (z2 / z1).toFixed(3);
        $("gr-ratio-sub").textContent =
          `Z₂/Z₁ = ${z2}/${z1}`;
        $("gr-mod").innerHTML = m;
        const rows = [
          ["歯数 Z", z1, z2],
          [
            "ピッチ円径 d (mm)",
            pcd1.toFixed(3),
            pcd2.toFixed(3),
          ],
          [
            "歯先円径 da (mm)",
            da1.toFixed(3),
            da2.toFixed(3),
          ],
          [
            "歯底円径 df (mm)",
            df1.toFixed(3),
            df2.toFixed(3),
          ],
          [
            "円ピッチ p (mm)",
            (Math.PI * m).toFixed(4),
            (Math.PI * m).toFixed(4),
          ],
        ];
        $("gear-tbody").innerHTML = rows
          .map(
            (r) =>
              `<tr><td>${r[0]}</td><td class="hl">${r[1]}</td><td class="hl">${r[2]}</td></tr>`,
          )
          .join("");
      }
