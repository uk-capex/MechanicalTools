      // ════════════════════════════════════════
      // TAB: ベアリング
      // ════════════════════════════════════════
      // BEARING_DB: [型式, d, D, B, Cr, C0r, grease_rpm, oil_rpm, Fmin, mass_kg]
      // NTN CAT.No.2203 の値に更新 2026-09（Cr,C0r,許容回転数,質量）
      //  深溝玉 60/62/63/64・アンギュラ 72/73（接触角30°）・自動調心玉 12/13（S）
      //  円筒ころ NU/N/NJ：208以上／308以上は標準形、204〜207／304〜307はEA形（標準形が廃止のため）
      //  E形・EA形は標準形より定格が大きい。NU208〜218EA・308〜314EA（ULTAGE、樹脂保持器）、NU220E・316E〜320E を追加 2026-09
      //   （NTN CAT.No.2203 円筒ころ寸法表。ころ内接円径 Fw が標準形と違い互換性なし。N/NJ 形も同じ定格）
      //  NA/RNA49：NTN CAT.No.2300/J ソリッド形針状ころ軸受の値に更新 2026-09
      //  606〜609：NTN CAT.No.2203 ミニアチュア・小径玉軸受表（609 は 609JX2）で照合 2026-09
      // Fmin: 最小荷重 kN（下で 0.01Cr/0.02Cr に再計算）  mass: kg（概算）
      const BEARING_DB = [
        // ── 深溝玉軸受 60xx (極小系列) ──
        ["606", 6, 17, 6, 2.43, 0.865, 35000, 42000, 0.02, 0.006],
        ["607", 7, 19, 6, 2.48, 0.91, 34000, 40000, 0.03, 0.008],
        ["608", 8, 22, 7, 3.70, 1.40, 32000, 37000, 0.04, 0.012],
        ["609", 9, 24, 7, 3.75, 1.45, 31000, 36000, 0.04, 0.014],
        // ── 深溝玉軸受 600x ──
        ["6000", 10, 26, 8, 5.05, 1.96, 29000, 34000, 0.06, 0.019],
        ["6001", 12, 28, 8, 5.65, 2.39, 26000, 30000, 0.06, 0.021],
        ["6002", 15, 32, 9, 6.2, 2.84, 22000, 26000, 0.07, 0.03],
        ["6003", 17, 35, 10, 7.55, 3.35, 20000, 24000, 0.08, 0.039],
        ["6004", 20, 42, 12, 10.4, 5.05, 18000, 21000, 0.12, 0.069],
        ["6005", 25, 47, 12, 11.2, 5.85, 15000, 18000, 0.13, 0.08],
        ["6006", 30, 55, 13, 14.7, 8.3, 13000, 15000, 0.16, 0.116],
        ["6007", 35, 62, 14, 17.7, 10.3, 12000, 14000, 0.2, 0.155],
        ["6008", 40, 68, 15, 18.6, 11.5, 10000, 12000, 0.22, 0.19],
        ["6009", 45, 75, 16, 23.2, 15.1, 9200, 11000, 0.26, 0.237],
        ["6010", 50, 80, 16, 24.2, 16.6, 8400, 9800, 0.28, 0.261],
        ["6011", 55, 90, 18, 31.5, 21.2, 7700, 9000, 0.35, 0.388],
        ["6012", 60, 95, 18, 32.5, 23.2, 7000, 8300, 0.38, 0.414],
        ["6013", 65, 100, 18, 34.0, 25.2, 6500, 7700, 0.41, 0.421],
        ["6014", 70, 110, 20, 42.0, 31.0, 6100, 7100, 0.5, 0.604],
        ["6015", 75, 115, 20, 44.0, 33.5, 5700, 6700, 0.53, 0.649],
        ["6016", 80, 125, 22, 53.0, 40.0, 5300, 6200, 0.66, 0.854],
        ["6017", 85, 130, 22, 55.0, 43.0, 5000, 5900, 0.7, 0.89],
        ["6018", 90, 140, 24, 64.5, 49.5, 4700, 5600, 0.8, 1.02],
        ["6020", 100, 150, 24, 66.5, 54.0, 4200, 5000, 0.88, 1.15],
        // ── 深溝玉軸受 62xx ──
        ["6200", 10, 30, 9, 5.65, 2.39, 25000, 30000, 0.06, 0.032],
        ["6201", 12, 32, 10, 6.75, 2.75, 22000, 26000, 0.09, 0.037],
        ["6202", 15, 35, 11, 8.6, 3.6, 19000, 23000, 0.1, 0.045],
        ["6203", 17, 40, 12, 10.6, 4.6, 18000, 21000, 0.12, 0.066],
        ["6204", 20, 47, 14, 14.2, 6.65, 16000, 18000, 0.16, 0.106],
        ["6205", 25, 52, 15, 15.5, 7.85, 13000, 15000, 0.19, 0.128],
        ["6206", 30, 62, 16, 21.6, 11.3, 11000, 13000, 0.25, 0.199],
        ["6207", 35, 72, 17, 28.4, 15.3, 9800, 11000, 0.33, 0.288],
        ["6208", 40, 80, 18, 32.5, 17.8, 8700, 10000, 0.41, 0.366],
        ["6209", 45, 85, 19, 36.0, 20.4, 7800, 9200, 0.44, 0.398],
        ["6210", 50, 90, 20, 39.0, 23.2, 7100, 8300, 0.48, 0.454],
        ["6211", 55, 100, 21, 48.0, 29.2, 6400, 7600, 0.59, 0.601],
        ["6212", 60, 110, 22, 58.0, 36.0, 6000, 7000, 0.72, 0.783],
        ["6213", 65, 120, 23, 63.5, 40.0, 5500, 6500, 0.88, 0.99],
        ["6214", 70, 125, 24, 69.0, 44.0, 5100, 6000, 0.96, 1.07],
        ["6215", 75, 130, 25, 73.5, 49.5, 4800, 5600, 1.04, 1.18],
        ["6216", 80, 140, 26, 80.5, 53.0, 4500, 5300, 1.21, 1.4],
        ["6217", 85, 150, 28, 92.0, 64.0, 4200, 5000, 1.41, 1.79],
        ["6218", 90, 160, 30, 106, 71.5, 4000, 4700, 1.6, 2.15],
        ["6220", 100, 180, 34, 135, 93.0, 3500, 4200, 2.03, 3.14],
        // ── 深溝玉軸受 63xx ──
        ["6300", 10, 35, 11, 9.1, 3.5, 23000, 27000, 0.1, 0.053],
        ["6301", 12, 37, 12, 10.8, 4.2, 20000, 24000, 0.12, 0.06],
        ["6302", 15, 42, 13, 12.7, 5.45, 17000, 21000, 0.14, 0.082],
        ["6303", 17, 47, 14, 15.0, 6.55, 16000, 19000, 0.17, 0.115],
        ["6304", 20, 52, 15, 17.6, 7.9, 14000, 17000, 0.2, 0.144],
        ["6305", 25, 62, 17, 23.5, 10.9, 12000, 14000, 0.28, 0.232],
        ["6306", 30, 72, 19, 29.5, 15.0, 10000, 12000, 0.36, 0.36],
        ["6307", 35, 80, 21, 37.0, 19.1, 8800, 10000, 0.44, 0.457],
        ["6308", 40, 90, 23, 45.0, 24.0, 7800, 9200, 0.53, 0.63],
        ["6309", 45, 100, 25, 58.5, 32.0, 7000, 8200, 0.69, 0.814],
        ["6310", 50, 110, 27, 68.5, 38.5, 6400, 7500, 0.81, 1.07],
        ["6311", 55, 120, 29, 79.5, 45.0, 5800, 6800, 0.96, 1.37],
        ["6312", 60, 130, 31, 90.5, 52.0, 5400, 6300, 1.11, 1.73],
        ["6313", 65, 140, 33, 103, 60.0, 4900, 5800, 1.3, 2.08],
        ["6314", 70, 150, 35, 115, 68.0, 4600, 5400, 1.49, 2.52],
        ["6315", 75, 160, 37, 126, 77.0, 4300, 5000, 1.69, 3.02],
        ["6316", 80, 170, 39, 136, 86.5, 4000, 4700, 1.92, 3.59],
        ["6317", 85, 180, 41, 147, 97.0, 3800, 4500, 2.13, 4.23],
        ["6318", 90, 190, 43, 158, 107, 3600, 4200, 2.42, 4.91],
        ["6320", 100, 215, 47, 192, 141, 3200, 3700, 3.19, 7.0],
        // ── 深溝玉軸受 64xx ──
        ["6404", 20, 72, 19, 31.5, 13.9, 12000, 14000, 0.4, 0.4],
        ["6405", 25, 80, 21, 38.5, 17.5, 10000, 12000, 0.48, 0.53],
        ["6406", 30, 90, 23, 48.0, 23.9, 8800, 10000, 0.59, 0.735],
        ["6407", 35, 100, 25, 61.0, 31.0, 7800, 9100, 0.76, 0.952],
        ["6408", 40, 110, 27, 70.5, 36.5, 7000, 8200, 0.91, 1.23],
        ["6409", 45, 120, 29, 85.5, 45.0, 6300, 7400, 1.11, 1.53],
        ["6410", 50, 130, 31, 92.0, 49.5, 5700, 6700, 1.25, 1.88],
        ["6412", 60, 150, 35, 113, 64.5, 4800, 5700, 1.68, 2.77],
        // ── アンギュラ玉軸受 72xx ──
        ["7200", 10, 30, 9, 6, 2.74, 28000, 37000, 0.13, 0.029],
        ["7201", 12, 32, 10, 8.4, 3.95, 25000, 33000, 0.14, 0.035],
        ["7202", 15, 35, 11, 10, 4.7, 22000, 29000, 0.17, 0.046],
        ["7203", 17, 40, 12, 13.2, 6.6, 19000, 26000, 0.2, 0.064],
        ["7204", 20, 47, 14, 16.1, 8.4, 17000, 23000, 0.29, 0.1],
        ["7205", 25, 52, 15, 18, 10.3, 14000, 19000, 0.36, 0.125],
        ["7206", 30, 62, 16, 24.9, 14.8, 12000, 16000, 0.49, 0.193],
        ["7207", 35, 72, 17, 33, 20.1, 11000, 14000, 0.64, 0.281],
        ["7208", 40, 80, 18, 39, 25.1, 9600, 13000, 0.77, 0.355],
        ["7209", 45, 85, 19, 44, 28.7, 8700, 12000, 0.85, 0.404],
        ["7210", 50, 90, 20, 45.5, 31.5, 7900, 10000, 0.95, 0.457],
        ["7211", 55, 100, 21, 56.5, 39.5, 7100, 9500, 1.12, 0.6],
        ["7212", 60, 110, 22, 68.5, 49, 6600, 8800, 1.33, 0.765],
        ["7213", 65, 120, 23, 78, 58, 6100, 8100, 1.65, 0.962],
        ["7214", 70, 125, 24, 84.5, 63.5, 5700, 7600, 1.73, 1.09],
        ["7215", 75, 130, 25, 87.5, 68.5, 5300, 7100, 1.89, 1.17],
        ["7216", 80, 140, 26, 98.5, 76, 5000, 6600, 2.24, 1.39],
        ["7217", 85, 150, 28, 110, 88.5, 4700, 6200, 2.56, 1.78],
        ["7218", 90, 160, 30, 130, 103, 4400, 5900, 2.86, 2.18],
        ["7220", 100, 180, 34, 159, 126, 3900, 5200, 3.62, 3.2],
        // ── アンギュラ玉軸受 73xx ──
        ["7300", 10, 35, 11, 11.2, 4.95, 26000, 34000, 0.2, 0.04],
        ["7301", 12, 37, 12, 12.4, 5.25, 23000, 30000, 0.24, 0.044],
        ["7302", 15, 42, 13, 14.9, 7.2, 19000, 26000, 0.29, 0.055],
        ["7303", 17, 47, 14, 17.7, 8.65, 18000, 24000, 0.35, 0.107],
        ["7304", 20, 52, 15, 20.7, 10.4, 16000, 21000, 0.39, 0.138],
        ["7305", 25, 62, 17, 29.3, 15.8, 13000, 17000, 0.56, 0.23],
        ["7306", 30, 72, 19, 37.5, 22.3, 11000, 15000, 0.73, 0.345],
        ["7307", 35, 80, 21, 44, 26.3, 9800, 13000, 0.89, 0.462],
        ["7308", 40, 90, 23, 54, 33, 8600, 12000, 1.12, 0.625],
        ["7309", 45, 100, 25, 70.5, 44, 7800, 10000, 1.38, 0.837],
        ["7310", 50, 110, 27, 82.5, 52.5, 7100, 9400, 1.65, 1.09],
        ["7311", 55, 120, 29, 95, 61.5, 6400, 8600, 1.95, 1.39],
        ["7312", 60, 130, 31, 109, 71.5, 5900, 7900, 2.26, 1.74],
        ["7313", 65, 140, 33, 123, 82, 5500, 7300, 2.64, 2.11],
        ["7314", 70, 150, 35, 138, 93.5, 5100, 6800, 3.1, 2.56],
        ["7316", 80, 170, 39, 163, 119, 4500, 5900, 3.92, 3.65],
        // ── 円筒ころ軸受 NU2xx ──
        ["NU204", 20, 47, 14, 32.5, 24.7, 15000, 21600, 0.45, 0.115],
        ["NU205", 25, 52, 15, 34.5, 27.7, 13000, 18000, 0.55, 0.151],
        ["NU206", 30, 62, 16, 46, 37.5, 11000, 15600, 0.77, 0.226],
        ["NU207", 35, 72, 17, 59.5, 50, 9500, 13200, 1.02, 0.327],
        ["NU208", 40, 80, 18, 48.5, 43, 9400, 11000, 1.21, 0.378],
        ["NU208EA", 40, 80, 18, 66.0, 55.5, 8500, 12000, 0.0, 0.426],
        ["NU209", 45, 85, 19, 51, 47, 8400, 9900, 1.38, 0.432],
        ["NU209EA", 45, 85, 19, 74.5, 66.5, 7600, 10800, 0.0, 0.495],
        ["NU210", 50, 90, 20, 53.5, 51, 7600, 9000, 1.5, 0.47],
        ["NU210EA", 50, 90, 20, 81.5, 76.5, 6900, 9700, 0.0, 0.503],
        ["NU211", 55, 100, 21, 64.5, 62.5, 6900, 8200, 1.83, 0.638],
        ["NU211EA", 55, 100, 21, 102, 98.5, 6300, 8900, 0.0, 0.675],
        ["NU212", 60, 110, 22, 76, 75, 6400, 7600, 2.16, 0.818],
        ["NU212EA", 60, 110, 22, 115, 107, 5800, 8200, 0.0, 0.923],
        ["NU213", 65, 120, 23, 93, 94.5, 5900, 7000, 2.54, 1.02],
        ["NU213EA", 65, 120, 23, 127, 119, 5400, 7600, 0.0, 1.21],
        ["NU214", 70, 125, 24, 92.5, 95, 5500, 6500, 2.68, 1.12],
        ["NU214EA", 70, 125, 24, 140, 137, 5000, 7100, 0.0, 1.3],
        ["NU215", 75, 130, 25, 107, 111, 5100, 6000, 2.86, 1.23],
        ["NU215EA", 75, 130, 25, 154, 156, 4700, 6600, 0.0, 1.41],
        ["NU216", 80, 140, 26, 118, 122, 4800, 5700, 3.36, 1.5],
        ["NU216EA", 80, 140, 26, 165, 167, 4400, 6100, 0.0, 1.67],
        ["NU217", 85, 150, 28, 134, 140, 4500, 5300, 3.92, 1.87],
        ["NU217EA", 85, 150, 28, 198, 199, 4100, 5800, 0.0, 2.11],
        ["NU218", 90, 160, 30, 169, 178, 4300, 5000, 4.48, 2.3],
        ["NU218EA", 90, 160, 30, 215, 217, 3900, 5500, 0.0, 2.44],
        ["NU220", 100, 180, 34, 203, 217, 3800, 4500, 5.7, 3.33],
        ["NU220E", 100, 180, 34, 277, 305, 3500, 4100, 0.0, 3.66],
        // ── 円筒ころ軸受 NU3xx ──
        ["NU304", 20, 52, 15, 37.5, 26.9, 13000, 18000, 0.56, 0.176],
        ["NU305", 25, 62, 17, 49, 37.5, 11000, 15600, 0.72, 0.275],
        ["NU306", 30, 72, 19, 63, 50, 9300, 13200, 0.96, 0.398],
        ["NU307", 35, 80, 21, 83.5, 71, 8100, 11500, 1.21, 0.545],
        ["NU308", 40, 90, 23, 65, 57, 8000, 9400, 1.5, 0.658],
        ["NU308EA", 40, 90, 23, 98.5, 81.5, 7200, 10200, 0.0, 0.754],
        ["NU309", 45, 100, 25, 82, 71, 7200, 8400, 1.9, 0.877],
        ["NU309EA", 45, 100, 25, 115, 98.5, 6500, 9100, 0.0, 0.996],
        ["NU310", 50, 110, 27, 96.5, 86, 6500, 7700, 2.16, 1.14],
        ["NU310EA", 50, 110, 27, 130, 113, 5900, 8300, 0.0, 1.3],
        ["NU311", 55, 120, 29, 123, 111, 5900, 7000, 2.54, 1.45],
        ["NU311EA", 55, 120, 29, 162, 143, 5300, 7600, 0.0, 1.65],
        ["NU312", 60, 130, 31, 137, 126, 5500, 6500, 3.0, 1.8],
        ["NU312EA", 60, 130, 31, 177, 157, 4900, 7000, 0.0, 2.05],
        ["NU314", 70, 150, 35, 175, 168, 4700, 5500, 3.9, 2.71],
        ["NU314EA", 70, 150, 35, 242, 222, 4200, 6000, 0.0, 3.1],
        ["NU316", 80, 170, 39, 211, 207, 4100, 4800, 4.84, 3.86],
        ["NU316E", 80, 170, 39, 284, 282, 3700, 4400, 0.0, 4.22],
        ["NU318", 90, 190, 43, 266, 265, 3700, 4300, 5.7, 5.3],
        ["NU318E", 90, 190, 43, 350, 355, 3300, 3900, 0.0, 5.72],
        ["NU320", 100, 215, 47, 330, 335, 3300, 3800, 7.3, 7.49],
        ["NU320E", 100, 215, 47, 420, 425, 2900, 3500, 0.0, 8.57],
        // ── 円筒ころ軸受 N2xx ──
        ["N204", 20, 47, 14, 32.5, 24.7, 15000, 21600, 0.45, 0.115],
        ["N205", 25, 52, 15, 34.5, 27.7, 13000, 18000, 0.55, 0.151],
        ["N206", 30, 62, 16, 46, 37.5, 11000, 15600, 0.77, 0.226],
        ["N207", 35, 72, 17, 59.5, 50, 9500, 13200, 1.02, 0.327],
        ["N208", 40, 80, 18, 48.5, 43, 9400, 11000, 1.21, 0.378],
        ["N209", 45, 85, 19, 51, 47, 8400, 9900, 1.38, 0.432],
        ["N210", 50, 90, 20, 53.5, 51, 7600, 9000, 1.5, 0.47],
        ["N212", 60, 110, 22, 76, 75, 6400, 7600, 2.16, 0.818],
        // ── 円筒ころ軸受 NJ2xx ──
        ["NJ204", 20, 47, 14, 32.5, 24.7, 15000, 21600, 0.45, 0.115],
        ["NJ205", 25, 52, 15, 34.5, 27.7, 13000, 18000, 0.55, 0.151],
        ["NJ206", 30, 62, 16, 46, 37.5, 11000, 15600, 0.77, 0.226],
        ["NJ207", 35, 72, 17, 59.5, 50, 9500, 13200, 1.02, 0.327],
        ["NJ208", 40, 80, 18, 48.5, 43, 9400, 11000, 1.21, 0.378],
        ["NJ209", 45, 85, 19, 51, 47, 8400, 9900, 1.38, 0.432],
        ["NJ210", 50, 90, 20, 53.5, 51, 7600, 9000, 1.5, 0.47],
        ["NJ211", 55, 100, 21, 64.5, 62.5, 6900, 8200, 1.83, 0.638],
        ["NJ212", 60, 110, 22, 76, 75, 6400, 7600, 2.16, 0.818],
        ["NJ213", 65, 120, 23, 93, 94.5, 5900, 7000, 2.54, 1.02],
        ["NJ215", 75, 130, 25, 107, 111, 5100, 6000, 2.86, 1.23],
        ["NJ216", 80, 140, 26, 118, 122, 4800, 5700, 3.36, 1.5],
        ["NJ218", 90, 160, 30, 169, 178, 4300, 5000, 4.48, 2.3],
        ["NJ220", 100, 180, 34, 203, 217, 3800, 4500, 5.7, 3.33],
        // ── 自動調心玉軸受 12xx ──
        ["1204", 20, 47, 14, 10, 2.61, 14000, 17000, 0.0, 0.12],
        ["1205", 25, 52, 15, 12.2, 3.3, 12000, 14000, 0.0, 0.14],
        ["1206", 30, 62, 16, 15.8, 4.65, 10000, 12000, 0.0, 0.22],
        ["1207", 35, 72, 17, 15.9, 5.1, 8500, 10000, 0.0, 0.33],
        ["1208", 40, 80, 18, 19.3, 6.5, 7500, 9000, 0.0, 0.42],
        ["1209", 45, 85, 19, 22, 7.35, 7100, 8500, 0.0, 0.47],
        ["1210", 50, 90, 20, 22.8, 8.1, 6300, 8000, 0.0, 0.535],
        ["1211", 55, 100, 21, 26.9, 10, 6000, 7100, 0.0, 0.708],
        ["1212", 60, 110, 22, 30.5, 11.5, 5300, 6300, 0.0, 0.91],
        ["1213", 65, 120, 23, 31, 12.5, 4800, 6000, 0.0, 1.16],
        ["1215", 75, 130, 25, 39, 15.7, 4300, 5300, 0.0, 1.36],
        ["1216", 80, 140, 26, 40, 17, 4000, 5000, 0.0, 1.68],
        ["1218", 90, 160, 30, 57.5, 23.5, 3600, 4300, 0.0, 2.56],
        ["1220", 100, 180, 34, 69.5, 29.7, 3200, 3800, 0.0, 3.74],
        // ── 自動調心玉軸受 13xx ──
        ["1304", 20, 52, 15, 12.6, 3.35, 12000, 15000, 0.0, 0.164],
        ["1305", 25, 62, 17, 18.2, 5, 10000, 13000, 0.0, 0.261],
        ["1306", 30, 72, 19, 21.4, 6.3, 8500, 11000, 0.0, 0.391],
        ["1307", 35, 80, 21, 25.3, 7.85, 7500, 9500, 0.0, 0.52],
        ["1308", 40, 90, 23, 29.8, 9.7, 6700, 8500, 0.0, 0.727],
        ["1309", 45, 100, 25, 38.5, 12.7, 6000, 7500, 0.0, 0.971],
        ["1310", 50, 110, 27, 43.5, 14.1, 5600, 6700, 0.0, 1.23],
        ["1311", 55, 120, 29, 51.5, 17.9, 5000, 6300, 0.0, 1.6],
        ["1312", 60, 130, 31, 57.5, 20.8, 4500, 5600, 0.0, 2],
        ["1313", 65, 140, 33, 62.5, 22.9, 4300, 5300, 0.0, 2.47],
        ["1315", 75, 160, 37, 80, 30, 3800, 4500, 0.0, 3.63],
        ["1316", 80, 170, 39, 89, 33, 3600, 4300, 0.0, 4.24],
        ["1318", 90, 190, 43, 117, 44.5, 3200, 3800, 0.0, 5.83],
        ["1320", 100, 215, 47, 140, 57.5, 2800, 3400, 0.0, 8.4],
        // ── 針状ころ軸受 NA49xx ──
        ["NA4900", 10, 22, 13, 9.55, 9.2, 16000, 24000, 0.0, 0.024],
        ["NA4901", 12, 24, 13, 10.6, 10.9, 15000, 23000, 0.0, 0.026],
        ["NA4902", 15, 28, 13, 11.5, 12.8, 13000, 20000, 0.0, 0.036],
        ["NA4903", 17, 30, 13, 12.4, 14.6, 12000, 18000, 0.0, 0.037],
        ["NA4904", 20, 37, 17, 23.6, 25.5, 11000, 16000, 0.0, 0.074],
        ["NA4905", 25, 42, 17, 26.7, 31.5, 8500, 13000, 0.0, 0.088],
        ["NA4906", 30, 47, 17, 28.3, 35.5, 7500, 11000, 0.0, 0.101],
        ["NA4907", 35, 55, 20, 35.5, 50, 6500, 9500, 0.0, 0.171],
        ["NA4908", 40, 62, 22, 48.5, 66.5, 5500, 8500, 0.0, 0.232],
        ["NA4909", 45, 68, 22, 51, 73, 5000, 7500, 0.0, 0.27],
        ["NA4910", 50, 72, 22, 53.5, 80, 4700, 7000, 0.0, 0.276],
        ["NA4911", 55, 80, 25, 65, 99.5, 4300, 6500, 0.0, 0.396],
        ["NA4912", 60, 85, 25, 68, 108, 4000, 6000, 0.0, 0.427],
        ["NA4914", 70, 100, 30, 95, 156, 3300, 5000, 0.0, 0.727],
        ["NA4916", 80, 110, 30, 100, 174, 2900, 4400, 0.0, 0.82],
        ["NA4920", 100, 140, 40, 140, 260, 2300, 3500, 0.0, 1.93],
        // ── 針状ころ軸受 RNA49xx（内輪なし）──
        ["RNA4904", null, 37, 17, 23.6, 25.5, 11000, 16000, 0.0, 0.052],
        ["RNA4906", null, 47, 17, 28.3, 35.5, 7500, 11000, 0.0, 0.069],
        ["RNA4908", null, 62, 22, 48.5, 66.5, 5500, 8500, 0.0, 0.14],
        ["RNA4910", null, 72, 22, 53.5, 80, 4700, 7000, 0.0, 0.163],
        ["RNA4912", null, 85, 25, 68, 108, 4000, 6000, 0.0, 0.275],
        ["RNA4916", null, 110, 30, 100, 174, 2900, 4400, 0.0, 0.516],
        ["RNA4920", null, 140, 40, 140, 260, 2300, 3500, 0.0, 1.15],
      ];
      // 最小荷重 Fmin を NTN の目安（玉軸受 0.01·Cr、ころ軸受 0.02·Cr）で再計算 2026-09（旧値は根拠不明）
      BEARING_DB.forEach((b) => {
        const roller = /^(NU|NJ|NF|N[0-9]|NA|RNA)/.test(b[0]);
        b[8] = +(b[4] * (roller ? 0.02 : 0.01)).toFixed(2);
      });

      let filteredBearings = [];

      function showBearingTab(name, btn) {
        document
          .querySelectorAll("#tab-bearing .stab-btn")
          .forEach((e) => e.classList.remove("active"));
        document
          .querySelectorAll("#tab-bearing .stab-content")
          .forEach((e) => e.classList.remove("active"));
        btn.classList.add("active");
        const el = $("stab-" + name);
        if (el) el.classList.add("active");
      }

      function filterBearing() {
        const q = $("bearing-query")
          .value.toUpperCase()
          .trim();
        const bore =
          $("bearing-bore").value !== ""
            ? +$("bearing-bore").value
            : null;
        const od =
          $("bearing-od").value !== ""
            ? +$("bearing-od").value
            : null;
        const COLS = 10;
        if (!q && bore === null && od === null) {
          $("bearing-tbody").innerHTML =
            `<tr><td colspan="${COLS}" style="text-align:center;color:var(--muted);padding:20px">型式または内径を入力してください</td></tr>`;
          $("bearing-hit-info").textContent = "";
          return;
        }
        if (
          q.length === 1 &&
          bore === null &&
          od === null
        ) {
          $("bearing-tbody").innerHTML =
            `<tr><td colspan="${COLS}" style="text-align:center;color:var(--muted);padding:20px">型式は2文字以上入力してください</td></tr>`;
          $("bearing-hit-info").textContent = "";
          return;
        }
        filteredBearings = BEARING_DB.filter((b) => {
          const matchQ =
            q.length < 2 || b[0].toUpperCase().includes(q);
          const matchBore = bore === null || b[1] === bore;
          const matchOD = od === null || b[2] === od;
          return matchQ && matchBore && matchOD;
        });
        renderBearingTable();
      }

      function renderBearingTable() {
        $("bearing-hit-info").textContent =
          filteredBearings.length
            ? `${filteredBearings.length} 件ヒット`
            : "該当なし";
        $("bearing-tbody").innerHTML =
          filteredBearings.length
            ? filteredBearings
                .map((b) => {
                  const grpm = b[6]
                    ? b[6].toLocaleString()
                    : "—";
                  const orpm = b[7]
                    ? b[7].toLocaleString()
                    : "—";
                  const fmin =
                    b[8] != null ? b[8].toFixed(2) : "—";
                  const mass =
                    b[9] != null ? b[9].toFixed(3) : "—";
                  return `<tr style="cursor:pointer;" onclick="bearingRowClick(${BEARING_DB.indexOf(b)})">
          <td style="font-family:'Inter',monospace;color:var(--accent);font-weight:600">${b[0]}</td>
          <td>${b[1] != null ? b[1] : "—"}</td><td>${b[2]}</td><td>${b[3]}</td>
          <td style="color:var(--accent);font-weight:600">${b[4]}</td>
          <td>${b[5]}</td>
          <td style="color:var(--warn)">${grpm}</td>
          <td style="color:var(--warn)">${orpm}</td>
          <td style="color:var(--muted)">${fmin}</td>
          <td style="color:var(--muted)">${mass}</td>
        </tr>`;
                })
                .join("")
            : `<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:20px">該当なし</td></tr>`;
      }

      function bearingRowClick(idx) {
        const b = BEARING_DB[idx];
        if (!b) return;
        // 型式でころ軸受判定
        const isRoller = /^(NU|NJ|NF|N[0-9]|NA|RNA)/.test(
          b[0],
        );
        $("bl-type").value = isRoller ? "roller" : "ball";
        // アンギュラ玉（NTN 72/73 記号なし）は接触角30°、それ以外の玉軸受は深溝扱い
        if ($("bl-angle")) $("bl-angle").value =
          /^7\d{3}$/.test(b[0]) ? "30" : /^1[23]\d{2}$/.test(b[0]) ? "-1" : "0";
        // Cr / C0r
        $("bl-cr").value = b[4];
        $("bl-c0r").value = b[5];
        // Fr 初期値 = Fmin × 2（最小荷重の2倍）。fmin=0の型式はCr/10で概算
        const fmin = b[8] || 0;
        const frInit =
          fmin > 0
            ? parseFloat((fmin * 2).toFixed(2))
            : parseFloat((b[4] / 10).toFixed(2));
        $("bl-fr").value = frInit;
        // Fa 初期値 = 0
        $("bl-fa").value = 0;
        // n 初期値 = グリス限界rpm ÷ 2（切り捨て、10rpm単位）
        const grppm = b[6] || 0;
        $("bl-n").value = grppm
          ? Math.floor(grppm / 2 / 10) * 10
          : 1450;
        // fw は 1.2 固定（プリセット選択状態も更新）
        $("bl-fw").value = 1.2;
        document
          .querySelectorAll("#stab-blife .preset-btn")
          .forEach((btn) => {
            btn.classList.toggle(
              "selected",
              btn.textContent.startsWith("1.2"),
            );
          });
        // はめあいタブへ d/D をセット
        if (b[1] != null) $("bfit-d").value = b[1];
        $("bfit-D").value = b[2];
        if ($("bfit-Cr")) $("bfit-Cr").value = b[4];
        if ($("bfit-type")) {
          const nm = String(b[0]);
          $("bfit-type").value = /^(N|NU|NJ|NUP|NF|3\d{4})/.test(nm) ? "cyl" : /^2[1-4]\d{3}/.test(nm) ? "sph" : "ball";
        }
        calcBearingLife();
        calcBearingFit();
        // フラッシュ通知
        $("bearing-hit-info").textContent =
          `✔ ${b[0]}  Fr=${(fmin * 2).toFixed(2)}kN / n=${$("bl-n").value}rpm をセットしました`;
        setTimeout(() => {
          filterBearing();
        }, 2500);
      }

      // ── 寿命計算 ──
      // 深溝玉の e・Y 係数（ISO 281 / JIS B 1518、f0を標準値とした Fa/C0r 表）
      // [Fa/C0r, e, X(Fa/Fr>e), Y(Fa/Fr>e)]  中間は直線補間。下限未満は先頭行（安全側）
      const DGB_EXY = [
        [0.014, 0.19, 0.56, 2.30],
        [0.028, 0.22, 0.56, 1.99],
        [0.056, 0.26, 0.56, 1.71],
        [0.084, 0.28, 0.56, 1.55],
        [0.11,  0.30, 0.56, 1.45],
        [0.17,  0.34, 0.56, 1.31],
        [0.28,  0.38, 0.56, 1.15],
        [0.42,  0.42, 0.56, 1.04],
        [0.56,  0.44, 0.56, 1.00],
      ];
      function dgbEY(ratio) {
        const T = DGB_EXY;
        if (ratio <= T[0][0]) return { e: T[0][1], Y: T[0][3] };
        if (ratio >= T[T.length - 1][0]) return { e: T[T.length - 1][1], Y: T[T.length - 1][3] };
        for (let i = 0; i < T.length - 1; i++) {
          const [r0, e0, , y0] = T[i], [r1, e1, , y1] = T[i + 1];
          if (ratio <= r1) {
            const k = (ratio - r0) / (r1 - r0);
            return { e: +(e0 + (e1 - e0) * k).toFixed(3), Y: +(y0 + (y1 - y0) * k).toFixed(3) };
          }
        }
      }
      // アンギュラ玉（単列）の X/Y/e（ISO 281）。15°は Fa/C0r により変わるため最大Y側（安全側）で固定
      const ANG_X = { 15: 0.44, 25: 0.41, 30: 0.39, 40: 0.35 };
      const ANG_Y = { 15: 1.47, 25: 0.87, 30: 0.76, 40: 0.57 };
      const ANG_e = { 15: 0.38, 25: 0.68, 30: 0.80, 40: 1.14 };

      function setBLfw(v, el) {
        $("bl-fw").value = v;
        document
          .querySelectorAll("#stab-blife .preset-btn")
          .forEach((b) => b.classList.remove("selected"));
        el.classList.add("selected");
        calcBearingLife();
      }

      function calcBearingLife() {
        const type = $("bl-type").value;
        const Cr = +$("bl-cr").value;
        const C0r = +$("bl-c0r").value || Cr * 0.6;
        const Fr = +$("bl-fr").value || 0;
        const Fa = +$("bl-fa").value || 0;
        const n = +$("bl-n").value || 0;
        const fw = +$("bl-fw").value || 1;
        const angle = +$("bl-angle").value;
        if (!Cr || !n) {
          clearBLResult();
          return;
        }

        const p = type === "ball" ? 3 : 10 / 3;
        let Pr,
          xyInfo = "";

        if (type === "roller") {
          // 円筒ころ：アキシアル荷重不可→Pr=Fr
          Pr = Fr * fw;
          xyInfo =
            "円筒ころ軸受：当量荷重 Pr = Fr × fw（アキシアル荷重は受けない）";
        } else if (angle === -1) {
          // 自動調心玉（ISO 281：Y1=0.42cotα, Y2=0.65cotα, e=1.5tanα → Y1=0.63/e, Y2=0.975/e）
          const e = +($("bl-sa-e") ? $("bl-sa-e").value : 0.2) || 0.2;
          const Y1 = 0.63 / e, Y2 = 0.975 / e;
          const ratio = Fr > 0 ? Fa / Fr : Infinity;
          const [X, Y] = (Fa > 0 && ratio > e) ? [0.65, Y2] : [1, Fa > 0 ? Y1 : 0];
          Pr = (X * Fr + Y * Fa) * fw;
          xyInfo = `自動調心玉：e=${e}（入力）→ Y1=${Y1.toFixed(2)}, Y2=${Y2.toFixed(2)}<br>` +
                   `Fa/Fr${ratio > e ? '>' : '≤'}e → X=${X}, Y=${Y.toFixed(2)} / Pr = (X·Fr+Y·Fa) × fw`;
        } else if (angle > 0) {
          // アンギュラ玉（ISO 281）
          const e = ANG_e[angle] || 0.57;
          const Xh = ANG_X[angle] || 0.41; // Fa/Fr > e のとき
          const Yh = ANG_Y[angle] || 0.92; // Fa/Fr > e のとき
          let X, Y2;
          if (Fr === 0 || Fa / Fr > e) {
            X = Xh;
            Y2 = Yh;
          } else {
            X = 1.0;
            Y2 = 0;
          }
          Pr = Math.max(X * Fr + Y2 * Fa, 0.5 * Fr) * fw;
          xyInfo = `アンギュラ玉 ${angle}°：e=${e}、Fa/Fr=${Fr ? (Fa / Fr).toFixed(2) : "—"}<br>→ X=${X}, Y=${Y2} / Pr = max(X·Fr+Y·Fa, 0.5·Fr) × fw`;
        } else {
          // 深溝玉
          const c0rRatio = C0r > 0 ? Fa / C0r : 0;
          const { e, Y: Yh } = dgbEY(c0rRatio);
          let X = 1.0, Y = 0;
          if (Fa > 0 && (Fr === 0 || Fa / Fr > e)) {   // 純アキシアル（Fr=0）も含む
            X = 0.56; Y = Yh;
          }
          Pr = (X * Fr + Y * Fa) * fw;
          xyInfo = `深溝玉：Fa/C0r≈${c0rRatio.toFixed(3)}、e=${e}（表を直線補間）<br>→ X=${X}, Y=${Y} / Pr = (X·Fr+Y·Fa) × fw`;
        }

        // Fr=Fa=0（荷重未入力）はガード
        if (Pr <= 0) {
          clearBLResult();
          return;
        }

        const L10Mill = Math.pow(Cr / Pr, p); // ×10⁶ 回転
        const L10h = (L10Mill * 1e6) / (60 * n);
        const crPrRatio = Cr / Pr;

        $("bl-pr").innerHTML =
          `${Pr.toFixed(2)}<span class="card-unit"> kN</span>`;
        $("bl-pr-sub").textContent =
          `Fr=${Fr} kN / Fa=${Fa} kN / fw=${fw}`;
        $("bl-l10").innerHTML =
          `${L10Mill.toFixed(2)}<span class="card-unit"> ×10⁶回</span>`;
        $("bl-ratio").innerHTML = crPrRatio.toFixed(2);
        $("bl-l10h").innerHTML =
          `${Math.round(L10h).toLocaleString()}<span class="card-unit"> h</span>`;
        $("bl-l10h-year").textContent =
          `≈ ${(L10h / 8760).toFixed(1)} 年（24h連続稼働換算）`;
        $("bl-l10h5").innerHTML =
          `${Math.round(L10h * 5).toLocaleString()}<span class="card-unit"> h</span>`;
        $("bl-xy-info").innerHTML = xyInfo;

        // 判定バナー
        const vc = $("bl-life-card");
        let icon, main, sub;
        if (L10h < 5000) {
          icon = "⚠️";
          main = "寿命不足の可能性";
          sub = `L10h = ${Math.round(L10h).toLocaleString()} h（目安 20,000 h以上推奨）`;
          vc.style.borderColor = "var(--bad)";
          vc.style.background = "var(--bad-dim)";
        } else if (L10h < 20000) {
          icon = "🔶";
          main = "寿命やや短め";
          sub = `L10h = ${Math.round(L10h).toLocaleString()} h（一般機械の目安 20,000 h）`;
          vc.style.borderColor = "var(--warn)";
          vc.style.background = "var(--warn-dim)";
        } else if (L10h < 50000) {
          icon = "✅";
          main = "標準的な寿命";
          sub = `L10h = ${Math.round(L10h).toLocaleString()} h`;
          vc.style.borderColor = "var(--good)";
          vc.style.background = "var(--good-dim)";
        } else {
          icon = "🟢";
          main = "寿命十分";
          sub = `L10h = ${Math.round(L10h).toLocaleString()} h（長寿命設計）`;
          vc.style.borderColor = "var(--good)";
          vc.style.background = "var(--good-dim)";
        }
        $("bl-verdict-main").textContent = main;
        $("bl-verdict-sub").textContent = sub;
        vc.querySelector(".verdict-icon").textContent =
          icon;

        // 詳細テーブル
        $("bl-detail-tbody").innerHTML = [
          ["動定格荷重 Cr", `${Cr} kN`, "—"],
          [
            "静定格荷重 C0r",
            `${C0r.toFixed(1)} kN`,
            "e値・Y値の算出基準",
          ],
          [
            "当量動荷重 Pr",
            `${Pr.toFixed(3)} kN`,
            `fw=${fw} 適用済み`,
          ],
          ["Cr/Pr", crPrRatio.toFixed(3), "大きいほど余裕"],
          [
            "寿命指数 p",
            p === 3 ? "3（玉軸受）" : "10/3（ころ軸受）",
            "—",
          ],
          [
            "基本寿命 L10",
            `${L10Mill.toFixed(2)} ×10⁶回転`,
            `= ${(L10Mill * 100).toFixed(0)} 万回転`,
          ],
          ["回転数 n", `${n.toLocaleString()} rpm`, "—"],
          [
            "L10h",
            `${Math.round(L10h).toLocaleString()} h`,
            `${(L10h / 8760).toFixed(1)} 年`,
          ],
          [
            "L50 ≈ 5×L10（参考）",
            `${Math.round(L10h * 5).toLocaleString()} h`,
            "半数が壊れるまでの目安。設計は L10 で判断",
          ],
        ]
          .map(
            (r) =>
              `<tr><td>${r[0]}</td><td style="font-family:'Inter',monospace;color:var(--accent);font-weight:600">${r[1]}</td><td style="color:var(--muted);font-size:11px">${r[2]}</td></tr>`,
          )
          .join("");
      }

      function clearBLResult() {
        [
          "bl-pr",
          "bl-l10",
          "bl-ratio",
          "bl-l10h",
          "bl-l10h5",
        ].forEach((id) => {
          const el = $(id);
          if (el) el.innerHTML = "—";
        });
        const sub = $("bl-pr-sub");
        if (sub) sub.textContent = "";
        const year = $("bl-l10h-year");
        if (year) year.textContent = "";
        const xy = $("bl-xy-info");
        if (xy) xy.innerHTML = "";
        const vm = $("bl-verdict-main");
        if (vm) vm.textContent = "—";
        const vs = $("bl-verdict-sub");
        if (vs) vs.textContent = "";
        const vc = $("bl-life-card");
        if (vc) {
          vc.style.borderColor = "var(--border)";
          vc.style.background = "var(--surface)";
        }
        const vi = vc
          ? vc.querySelector(".verdict-icon")
          : null;
        if (vi) vi.textContent = "—";
        $("bl-detail-tbody").innerHTML = "";
      }

      // ── はめあい推奨（2026-09 作り直し）──
      //  推奨記号：NTN 転がり軸受総合カタログ CAT.No.2203 表7.2（ラジアル軸受 0級・6X級・6級、鋼製中実軸・鋼/鋳鉄ハウジング）
      //  締め代：軸・穴の公差は はめあいタブ（16-fit.js）の JIS B 0401 エンジン、軸受側は JIS B 1514 の平均内径/外径の寸法差
      //  荷重区分（NTN 注1）：軽 P≦0.05Cr／普通 0.05Cr＜P≦0.10Cr／重 P＞0.10Cr
      const BFIT_SHAFT = {
        // [を超え, 以下, 記号]
        light: {
          ball: [[0,18,"h5"],[18,100,"js6"],[100,200,"k6"]],
          cyl:  [[0,40,"js6"],[40,140,"k6"],[140,200,"m6"]],
          sph:  null,
        },
        normal: {
          ball: [[0,18,"js5"],[18,100,"k5"],[100,140,"m5"],[140,200,"m6"],[200,280,"n6"]],
          cyl:  [[0,40,"k5"],[40,100,"m5"],[100,140,"m6"],[140,200,"n6"],[200,400,"p6"]],
          sph:  [[0,40,"k5"],[40,65,"m5"],[65,100,"m6"],[100,140,"n6"],[140,280,"p6"],[280,500,"r6"]],
        },
        heavy: {
          ball: null,
          cyl:  [[50,140,"n6"],[140,200,"p6"],[200,500,"r6"]],
          sph:  [[50,100,"n6"],[100,140,"p6"],[140,200,"r6"]],
        },
      };
      // JIS B 1514-1 平面内平均内径/外径の寸法差の下の値（上は0）[以下, 0級, 6級] μm
      //  0級は NTN 表7.5 の値。6級は JIS B 1514-1 の値（18〜30は NTN 精度表で確認）
      const BRG_DMP = [[6,8,7],[10,8,7],[18,8,7],[30,10,8],[50,12,10],[80,15,12],[120,20,15],[180,25,18],[250,30,22],[315,35,25],[400,40,30],[500,45,35]];
      const BRG_DMP_OD = [[18,8,7],[30,9,8],[50,11,9],[80,13,11],[120,15,13],[150,18,15],[180,25,18],[250,30,20],[315,35,25],[400,40,28],[500,45,33]];
      function brgTol(tbl, x, cls) {
        const r = tbl.find(t => x <= t[0]);
        return r ? -(cls === "p6" ? r[2] : r[1]) : null;
      }
      // 軸・穴の許容差（μm）。js/JS は ±IT/2（NTN 表と同じ扱い）、穴 G を追加
      function bfitLimits(sym, x, isHole) {
        const p = parseSymbol(sym); if (!p) return null;
        const it = getIT(x, p.grade);
        if (p.symbol === "js" || p.symbol === "JS") return { up: it / 2, lo: -it / 2 };
        if (p.symbol === "G") { const g = SHAFT_DEV.g[fitIdx(x)]; return { up: g + it, lo: g }; }
        const L = isHole ? getHoleLimits(x, p.symbol, p.grade) : getShaftLimits(x, p.symbol, p.grade);
        return L ? { up: Math.round(L.upper * 1000 * 10) / 10, lo: Math.round(L.lower * 1000 * 10) / 10 } : null;
      }
      // しめしろ（+）/すきま（−）の範囲 → 表示
      const fmtTL = v => v > 0 ? `${+v.toFixed(1)}T` : v < 0 ? `${+(-v).toFixed(1)}L` : "0";
      function fitKind(max, min) { return min >= 0 ? "しまりばめ" : max <= 0 ? "すきまばめ" : "中間ばめ"; }

      function calcBearingFit() {
        const d = +$("bfit-d").value;
        const D = +$("bfit-D").value;
        const rot = $("bfit-rot").value;
        const type = $("bfit-type") ? $("bfit-type").value : "ball";
        const cls = $("bfit-class").value; // 'normal'(0級) | 'p6'(6級)
        const P = parseFloat($("bfit-P")?.value), Cr = parseFloat($("bfit-Cr")?.value);
        let load = $("bfit-load").value;
        let ratioTxt = "";
        if (P > 0 && Cr > 0) {
          const r = P / Cr;
          load = r <= 0.05 ? "light" : r <= 0.10 ? "normal" : "heavy";
          $("bfit-load").value = load;
          ratioTxt = `P/Cr = ${r.toFixed(3)} → 自動判定`;
        }
        if ($("bfit-ratio")) $("bfit-ratio").textContent = ratioTxt;
        if (!d || !D) return;

        const notes = [];
        let shaftSym, holeSym;
        const typeName = { ball: "玉軸受", cyl: "円筒ころ・円すいころ", sph: "自動調心ころ" }[type];
        if (rot === "inner") {
          let tbl = BFIT_SHAFT[load][type];
          let row = tbl && tbl.find(r => d > r[0] && d <= r[1]);
          if (!row) {
            const nrow = BFIT_SHAFT.normal[type].find(r => d > r[0] && d <= r[1]);
            if (nrow) { row = nrow; notes.push(`この荷重・軸径は表7.2に該当欄なし → 普通荷重の値を表示`); }
          }
          shaftSym = row ? row[2] : null;
          if (!row) notes.push(`軸径 ${d}mm は NTN 表の範囲外（NTN に照会）`);
          if (load === "light" && row && ["js6","k6","m6"].includes(shaftSym)) notes.push("精密を要する場合は js5・k5・m5 を用いる");
          if (load === "heavy") notes.push("重荷重・衝撃荷重は CN より大きい内部すきま（C3 等）の軸受を用いる");
          if (type === "cyl" && load === "normal" && ["k5","m5"].includes(shaftSym)) notes.push("単列アンギュラ玉・円すいころは k6・m6 でも可");
          holeSym = "H7";
          notes.push("ハウジング（外輪静止）：一般 H7。軽・普通荷重の二つ割りは H8、軸側が高温になる場合は G7、精密回転は玉 JS6／ころ K6、静粛運転は H6");
        } else {
          shaftSym = "h6";
          notes.push("軸（内輪静止）：内輪が軸上を動く必要がある自由側は g6（精密は g5）、動く必要がなければ h6（精密は h5）");
          holeSym = load === "light" ? "M7" : "N7";
          notes.push(load === "light" ? "外輪回転・軽荷重または変動荷重：M7" : "外輪回転・普通／重荷重：N7（主に玉軸受）。薄肉ハウジングで重荷重・大きな衝撃は P7（主にころ軸受）");
        }

        // しめしろ計算
        const dLow = brgTol(BRG_DMP, d, cls), DLow = brgTol(BRG_DMP_OD, D, cls);
        const sL = shaftSym ? bfitLimits(shaftSym, d, false) : null;
        const hL = bfitLimits(holeSym, D, true);
        let sMax = null, sMin = null, hMax = null, hMin = null;
        if (sL && dLow != null) { sMax = sL.up - dLow; sMin = sL.lo - 0; }
        if (hL && DLow != null) { hMax = 0 - hL.lo; hMin = DLow - hL.up; }
        // 最大しめしろを「d の 1/○○○」で表す（NTN 7.3.3：上限は軸径の1/1000以下が目安）
        const ratioOf = v => v > 0 ? Math.round(d * 1000 / v) : null;   // d[mm]→μm で割る
        const sRatio = sMax != null ? ratioOf(sMax) : null;
        const ratioTag = sRatio ? `（d の 1/${sRatio.toLocaleString()}）` : "";
        if (sRatio && sRatio < 1000) {
          // 50mm未満は公差幅の最小値が効いて推奨どおりでも超えやすい（例 d20 k5＝1/952）→ 注意に留める
          if (d < 50)
            notes.push(`<span style="color:var(--warn)">最大しめしろ ${+sMax.toFixed(1)}μm＝d の 1/${sRatio}。50mm未満は公差幅の最小値が効いて、推奨どおりでも 1/1000 を少し超えることがある。NTN は小径・薄肉軸受ではしめしろを小さめにと推奨（7.3.4）→ 一段ゆるい記号（js5→h5、k5→js5 等）も検討</span>`);
          else
            notes.push(`<span style="color:var(--bad)">最大しめしろ ${+sMax.toFixed(1)}μm＝d の 1/${sRatio} で、上限目安 1/1000（${d}μm）を超える → 内輪の割れ・寿命低下の恐れ</span>`);
        }
        notes.push(`最大しめしろの上限目安は軸径の 1/1000（d${d} なら ${d}μm）。軌道輪にかかる応力で割れ・寿命低下を起こさないための線で、狙う値ではない（NTN 7.3.3、はめあい応力は 127MPa 程度まで）`);

        $("bfit-shaft-symbol").textContent = shaftSym || "—";
        $("bfit-housing-symbol").textContent = holeSym;
        const clsLabel = cls === "p6" ? "6級" : "0級";
        const loadLabel = { light: "軽荷重", normal: "普通荷重", heavy: "重荷重・衝撃" }[load];
        const rotLabel = rot === "inner" ? "内輪回転" : "外輪回転";

        const rowsHtml = (sym, L, brgTxt, mx, mn, label, tag = "") => sym == null
          ? `<div class="fit-dim-row"><span class="fit-dim-label">${label}</span><span class="fit-dim-val">—</span></div>`
          : `<div class="fit-dim-row"><span class="fit-dim-label">${label}</span><span class="fit-dim-val" style="color:var(--accent)">${sym}</span></div>
      <div class="fit-dim-row"><span class="fit-dim-label">公差</span><span class="fit-dim-val" style="font-size:12px">${L ? `${L.up >= 0 ? "+" : ""}${L.up} / ${L.lo >= 0 ? "+" : ""}${L.lo} μm` : "—"}</span></div>
      <div class="fit-dim-row"><span class="fit-dim-label">軸受側（${clsLabel}）</span><span class="fit-dim-val" style="font-size:12px">${brgTxt}</span></div>
      <div class="fit-dim-row"><span class="fit-dim-label">しめしろ／すきま</span><span class="fit-dim-val" style="font-size:12px">${mx != null ? `${fmtTL(mx)} 〜 ${fmtTL(mn)}（${fitKind(mx, mn)}）` : "—"}</span></div>${tag ? `
      <div class="fit-dim-row"><span class="fit-dim-label">最大しめしろ</span><span class="fit-dim-val" style="font-size:12px">${tag.slice(1, -1)}　上限目安 1/1000</span></div>` : ""}`;
        $("bfit-shaft-rows").innerHTML = rowsHtml(shaftSym, sL, dLow != null ? `内径 0 / ${dLow} μm` : "—", sMax, sMin, "軸公差記号", ratioTag);
        $("bfit-housing-rows").innerHTML = rowsHtml(holeSym, hL, DLow != null ? `外径 0 / ${DLow} μm` : "—", hMax, hMin, "穴公差記号");

        const vc = $("bfit-verdict");
        vc.innerHTML = `<div class="verdict-icon">📋</div><div>
    <div class="verdict-main">${typeName}・${rotLabel}・${loadLabel}（${clsLabel}）— 推奨 軸 <b>${shaftSym || "—"}</b>／穴 <b>${holeSym}</b></div>
    <div class="verdict-sub">内径 d=${d}mm / 外径 D=${D}mm。T＝しめしろ、L＝すきま。出典：NTN CAT.No.2203 表7.2</div>
  </div>`;
        vc.style.borderColor = "var(--accent)";
        vc.style.background = "var(--accent-dim)";

        $("bfit-tbody").innerHTML = [
          ["内輪側（軸）", shaftSym || "—", sMax != null ? fitKind(sMax, sMin) : "—", sMax != null ? `${fmtTL(sMax)} 〜 ${fmtTL(sMin)}${ratioTag}` : "—", ""],
          ["外輪側（穴）", holeSym, hMax != null ? fitKind(hMax, hMin) : "—", hMax != null ? `${fmtTL(hMax)} 〜 ${fmtTL(hMin)}` : "—", ""],
        ].map(r => `<tr><td>${r[0]}</td><td style="font-family:'Inter',monospace;color:var(--accent);font-weight:700">${r[1]}</td><td>${r[2]}</td><td style="font-family:'Inter',monospace;font-size:12px">${r[3]}</td><td></td></tr>`).join("")
          + `<tr><td colspan="5" style="font-size:11px;color:var(--muted);text-align:left;line-height:1.7">${notes.map(n => "・" + n).join("<br>")}<br>・必要しめしろの下限は、荷重による減少 0.08√(d·Fr/B)μm・温度差 0.0015·d·ΔT μm・面粗さ（研削1〜2.5／旋削5〜7μm）を見込む（NTN 7.3.3）</td></tr>`;
      }

      // ── スラスト軸受DB ──
      // [型式, d, D, H, Ca(kN), C0a(kN)]
      const THRUST_DB = [ // NTN CAT.No.2203 スラスト玉軸受の値に更新 2026-09 [型式,d,D,T,Ca,C0a]
        // 51100系（極軽系列）
        ["51100", 10, 24, 9, 10.0, 14.0],
        ["51101", 12, 26, 9, 10.3, 15.4],
        ["51102", 15, 28, 9, 10.5, 16.8],
        ["51103", 17, 30, 9, 10.8, 18.2],
        ["51104", 20, 35, 10, 14.2, 24.7],
        ["51105", 25, 42, 11, 19.6, 37.0],
        ["51106", 30, 47, 11, 20.4, 42.0],
        ["51107", 35, 52, 12, 20.4, 44.5],
        ["51108", 40, 60, 13, 26.9, 63.0],
        ["51109", 45, 65, 14, 27.9, 69.0],
        ["51110", 50, 70, 14, 28.8, 75.5],
        ["51111", 55, 78, 16, 35.0, 93.0],
        ["51112", 60, 85, 17, 41.5, 113],
        ["51113", 65, 90, 18, 41.5, 117],
        ["51114", 70, 95, 18, 43.0, 127],
        ["51115", 75, 100, 19, 44.5, 136],
        ["51116", 80, 105, 19, 44.5, 141],
        ["51117", 85, 110, 19, 46.0, 150],
        ["51118", 90, 120, 22, 59.5, 190],
        ["51120", 100, 135, 25, 85.0, 268],
        // 51200系（軽系列）
        ["51200", 10, 26, 11, 12.7, 17.1],
        ["51201", 12, 28, 11, 13.2, 19.0],
        ["51202", 15, 32, 12, 16.6, 24.8],
        ["51203", 17, 35, 12, 17.2, 27.3],
        ["51204", 20, 40, 14, 22.3, 37.5],
        ["51205", 25, 47, 15, 27.8, 50.5],
        ["51206", 30, 52, 16, 29.3, 58.0],
        ["51207", 35, 62, 18, 39.0, 78.0],
        ["51208", 40, 68, 19, 47.0, 98.5],
        ["51209", 45, 73, 20, 47.5, 105],
        ["51210", 50, 78, 22, 48.5, 111],
        ["51211", 55, 90, 25, 69.5, 159],
        ["51212", 60, 95, 26, 73.5, 179],
        ["51213", 65, 100, 27, 75.0, 189],
        ["51214", 70, 105, 27, 76.0, 199],
        ["51215", 75, 110, 27, 77.5, 209],
        ["51216", 80, 115, 28, 78.5, 218],
        ["51217", 85, 125, 31, 95.5, 264],
        ["51218", 90, 135, 35, 117, 325],
        ["51220", 100, 150, 38, 147, 410],
        // 51300系（中系列）
        ["51305", 25, 52, 18, 35.5, 61.5],
        ["51306", 30, 60, 21, 43.0, 78.5],
        ["51307", 35, 68, 24, 55.5, 105],
        ["51308", 40, 78, 26, 69.0, 135],
        ["51309", 45, 85, 28, 80.0, 163],
        ["51310", 50, 95, 31, 96.5, 202],
        ["51311", 55, 105, 35, 119, 246],
        ["51312", 60, 110, 35, 123, 267],
        ["51313", 65, 115, 36, 128, 287],
        ["51314", 70, 125, 40, 148, 340],
        ["51315", 75, 135, 44, 171, 395],
        ["51316", 80, 140, 44, 176, 425],
        ["51317", 85, 150, 49, 206, 490],
        ["51318", 90, 155, 50, 213, 525],
        ["51320", 100, 170, 55, 237, 595],
      ];

      let filteredThrust = [];

      function filterThrust() {
        const q = $("thrust-query")
          .value.toUpperCase()
          .trim();
        const bore =
          $("thrust-bore").value !== ""
            ? +$("thrust-bore").value
            : null;
        if (!q && bore === null) {
          $("thrust-tbody").innerHTML =
            '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">型式または内径を入力してください</td></tr>';
          $("thrust-hit-info").textContent = "";
          return;
        }
        filteredThrust = THRUST_DB.filter((b) => {
          const matchQ =
            q.length < 2 || b[0].toUpperCase().includes(q);
          const matchBore = bore === null || b[1] === bore;
          return matchQ && matchBore;
        });
        $("thrust-hit-info").textContent =
          filteredThrust.length
            ? `${filteredThrust.length} 件ヒット`
            : "該当なし";
        $("thrust-tbody").innerHTML = filteredThrust.length
          ? filteredThrust
              .map(
                (b) => `<tr>
        <td style="font-family:'Inter',monospace;color:var(--accent);font-weight:600">${b[0]}</td>
        <td>${b[1]}</td><td>${b[2]}</td><td>${b[3]}</td>
        <td style="color:var(--accent);font-weight:600">${b[4]}</td>
        <td>${b[5]}</td>
      </tr>`,
              )
              .join("")
          : '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">該当なし</td></tr>';
      }
