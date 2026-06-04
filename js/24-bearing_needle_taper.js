      const TAPER_DB = [
        // ── 320xx 幅広系列 ──
        [
          "32004",
          20,
          42,
          15,
          20.8,
          22.0,
          0.4,
          1.5,
          0.8,
          14000,
          0.09,
        ],
        [
          "32005",
          25,
          47,
          15,
          23.0,
          25.5,
          0.4,
          1.5,
          0.8,
          12000,
          0.105,
        ],
        [
          "32006",
          30,
          55,
          17,
          32.0,
          36.5,
          0.4,
          1.5,
          0.8,
          10000,
          0.175,
        ],
        [
          "32007",
          35,
          62,
          18,
          38.0,
          44.0,
          0.4,
          1.5,
          0.8,
          9000,
          0.225,
        ],
        [
          "32008",
          40,
          68,
          19,
          44.5,
          52.0,
          0.4,
          1.5,
          0.8,
          8000,
          0.275,
        ],
        [
          "32009",
          45,
          75,
          20,
          52.0,
          62.5,
          0.4,
          1.5,
          0.8,
          7500,
          0.355,
        ],
        [
          "32010",
          50,
          80,
          20,
          56.0,
          69.5,
          0.4,
          1.5,
          0.8,
          7000,
          0.385,
        ],
        [
          "32011",
          55,
          90,
          23,
          72.0,
          90.5,
          0.4,
          1.5,
          0.8,
          6300,
          0.56,
        ],
        [
          "32012",
          60,
          95,
          23,
          77.5,
          100,
          0.4,
          1.5,
          0.8,
          6000,
          0.6,
        ],
        [
          "32013",
          65,
          100,
          23,
          80.5,
          107,
          0.4,
          1.5,
          0.8,
          5600,
          0.64,
        ],
        [
          "32014",
          70,
          110,
          25,
          98.0,
          132,
          0.4,
          1.5,
          0.8,
          5300,
          0.84,
        ],
        [
          "32015",
          75,
          115,
          25,
          102,
          140,
          0.4,
          1.5,
          0.8,
          5000,
          0.88,
        ],
        [
          "32016",
          80,
          125,
          29,
          125,
          172,
          0.4,
          1.5,
          0.8,
          4500,
          1.2,
        ],
        [
          "32017",
          85,
          130,
          29,
          130,
          182,
          0.4,
          1.5,
          0.8,
          4300,
          1.28,
        ],
        [
          "32018",
          90,
          140,
          32,
          153,
          218,
          0.4,
          1.5,
          0.8,
          4000,
          1.65,
        ],
        [
          "32020",
          100,
          150,
          32,
          163,
          240,
          0.4,
          1.5,
          0.8,
          3600,
          1.8,
        ],
        [
          "32022",
          110,
          170,
          38,
          218,
          330,
          0.4,
          1.5,
          0.8,
          3200,
          3.0,
        ],
        [
          "32024",
          120,
          180,
          38,
          228,
          355,
          0.4,
          1.5,
          0.8,
          3000,
          3.25,
        ],
        [
          "32026",
          130,
          200,
          45,
          298,
          480,
          0.4,
          1.5,
          0.8,
          2800,
          5.0,
        ],
        [
          "32030",
          150,
          225,
          48,
          358,
          605,
          0.4,
          1.5,
          0.8,
          2400,
          6.8,
        ],
        [
          "32034",
          170,
          260,
          57,
          465,
          820,
          0.4,
          1.5,
          0.8,
          2000,
          11.5,
        ],
        [
          "32038",
          190,
          290,
          64,
          560,
          1020,
          0.4,
          1.5,
          0.8,
          1800,
          16.0,
        ],
        // ── 302xx 中幅系列 ──
        [
          "30202",
          15,
          35,
          11,
          12.0,
          11.7,
          0.35,
          1.72,
          0.92,
          18000,
          0.045,
        ],
        [
          "30203",
          17,
          40,
          13,
          16.4,
          16.8,
          0.35,
          1.72,
          0.92,
          16000,
          0.075,
        ],
        [
          "30204",
          20,
          47,
          15,
          22.5,
          23.5,
          0.35,
          1.72,
          0.92,
          14000,
          0.115,
        ],
        [
          "30205",
          25,
          52,
          16,
          26.5,
          28.5,
          0.35,
          1.72,
          0.92,
          12000,
          0.14,
        ],
        [
          "30206",
          30,
          62,
          17,
          36.5,
          40.5,
          0.35,
          1.72,
          0.92,
          10000,
          0.225,
        ],
        [
          "30207",
          35,
          72,
          18,
          47.5,
          54.0,
          0.35,
          1.72,
          0.92,
          8500,
          0.33,
        ],
        [
          "30208",
          40,
          80,
          19,
          57.5,
          67.5,
          0.35,
          1.72,
          0.92,
          7500,
          0.44,
        ],
        [
          "30209",
          45,
          85,
          20,
          63.5,
          76.5,
          0.35,
          1.72,
          0.92,
          7000,
          0.495,
        ],
        [
          "30210",
          50,
          90,
          21,
          69.5,
          85.5,
          0.35,
          1.72,
          0.92,
          6700,
          0.55,
        ],
        [
          "30211",
          55,
          100,
          22,
          87.0,
          109,
          0.35,
          1.72,
          0.92,
          6000,
          0.74,
        ],
        [
          "30212",
          60,
          110,
          23,
          105,
          136,
          0.35,
          1.72,
          0.92,
          5600,
          0.975,
        ],
        [
          "30213",
          65,
          120,
          24,
          123,
          163,
          0.35,
          1.72,
          0.92,
          5000,
          1.25,
        ],
        [
          "30215",
          75,
          130,
          25,
          133,
          183,
          0.35,
          1.72,
          0.92,
          4500,
          1.4,
        ],
        [
          "30216",
          80,
          140,
          26,
          158,
          224,
          0.35,
          1.72,
          0.92,
          4300,
          1.85,
        ],
        [
          "30218",
          90,
          160,
          30,
          215,
          320,
          0.35,
          1.72,
          0.92,
          3800,
          3.0,
        ],
        [
          "30220",
          100,
          180,
          34,
          283,
          445,
          0.35,
          1.72,
          0.92,
          3400,
          4.6,
        ],
        [
          "30222",
          110,
          200,
          38,
          355,
          580,
          0.35,
          1.72,
          0.92,
          3000,
          6.6,
        ],
        [
          "30224",
          120,
          215,
          40,
          400,
          675,
          0.35,
          1.72,
          0.92,
          2800,
          8.2,
        ],
        // ── 303xx 中幅・大接触角系列 ──
        [
          "30303",
          17,
          47,
          15,
          22.0,
          21.0,
          0.29,
          2.07,
          1.1,
          15000,
          0.105,
        ],
        [
          "30304",
          20,
          52,
          16,
          27.5,
          27.5,
          0.29,
          2.07,
          1.1,
          13000,
          0.14,
        ],
        [
          "30305",
          25,
          62,
          18,
          38.5,
          40.5,
          0.29,
          2.07,
          1.1,
          11000,
          0.235,
        ],
        [
          "30306",
          30,
          72,
          20,
          52.5,
          57.5,
          0.29,
          2.07,
          1.1,
          9500,
          0.38,
        ],
        [
          "30307",
          35,
          80,
          22,
          65.0,
          73.5,
          0.29,
          2.07,
          1.1,
          8000,
          0.53,
        ],
        [
          "30308",
          40,
          90,
          25,
          82.5,
          97.5,
          0.29,
          2.07,
          1.1,
          7000,
          0.76,
        ],
        [
          "30309",
          45,
          100,
          27,
          100,
          123,
          0.29,
          2.07,
          1.1,
          6300,
          1.05,
        ],
        [
          "30310",
          50,
          110,
          29,
          120,
          153,
          0.29,
          2.07,
          1.1,
          5600,
          1.38,
        ],
        [
          "30311",
          55,
          120,
          31,
          143,
          190,
          0.29,
          2.07,
          1.1,
          5300,
          1.8,
        ],
        [
          "30312",
          60,
          130,
          33,
          170,
          232,
          0.29,
          2.07,
          1.1,
          5000,
          2.3,
        ],
        [
          "30314",
          70,
          150,
          38,
          228,
          325,
          0.29,
          2.07,
          1.1,
          4300,
          3.7,
        ],
        [
          "30315",
          75,
          160,
          40,
          258,
          380,
          0.29,
          2.07,
          1.1,
          4000,
          4.55,
        ],
        [
          "30316",
          80,
          170,
          42,
          292,
          440,
          0.29,
          2.07,
          1.1,
          3800,
          5.6,
        ],
        [
          "30318",
          90,
          190,
          46,
          365,
          580,
          0.29,
          2.07,
          1.1,
          3400,
          8.0,
        ],
        [
          "30320",
          100,
          215,
          51,
          468,
          790,
          0.29,
          2.07,
          1.1,
          3000,
          12.5,
        ],
      ];

      let filteredTapers = [];
      let selectedTaper = null;

      // ════════════════════════════════════════════════════
      // 🪡 ニードルころ型式DB
      // [型式, 系列, d, D, B, Cr(kN), C0r(kN), 限界rpm, 質量(kg), 備考]
      // ════════════════════════════════════════════════════
      const NEEDLE_DB = [
        // ── NA49系（フランジ付・内輪あり） ──
        ['NA4900', 'NA', 10, 22, 13,  6.55,  5.85, 16000, 0.025, ''],
        ['NA4901', 'NA', 12, 24, 13,  7.35,  6.60, 14000, 0.028, ''],
        ['NA4902', 'NA', 15, 28, 13,  8.80,  8.15, 12000, 0.033, ''],
        ['NA4903', 'NA', 17, 30, 13,  9.55,  9.15, 11000, 0.038, ''],
        ['NA4904', 'NA', 20, 37, 17, 15.9,  15.3,  9000, 0.075, ''],
        ['NA4905', 'NA', 25, 42, 17, 18.0,  17.6,  8000, 0.088, ''],
        ['NA4906', 'NA', 30, 47, 17, 20.0,  20.0,  7000, 0.102, ''],
        ['NA4907', 'NA', 35, 55, 20, 28.0,  28.5,  6000, 0.165, ''],
        ['NA4908', 'NA', 40, 62, 22, 34.5,  36.5,  5500, 0.228, ''],
        ['NA4909', 'NA', 45, 68, 22, 37.5,  40.5,  5000, 0.265, ''],
        ['NA4910', 'NA', 50, 72, 22, 39.0,  43.5,  4800, 0.288, ''],
        ['NA4911', 'NA', 55, 80, 25, 49.5,  57.0,  4300, 0.420, ''],
        ['NA4912', 'NA', 60, 85, 25, 52.0,  61.5,  4000, 0.458, ''],
        ['NA4913', 'NA', 65, 90, 25, 54.0,  65.5,  3800, 0.498, ''],
        ['NA4914', 'NA', 70,100, 30, 72.0,  90.0,  3500, 0.742, ''],
        ['NA4916', 'NA', 80,110, 30, 78.0, 100.0,  3200, 0.835, ''],
        ['NA4918', 'NA', 90,125, 35, 104.0,135.0,  2800, 1.27,  ''],
        ['NA4920', 'NA',100,140, 40, 128.0,170.0,  2500, 1.83,  ''],
        ['NA4922', 'NA',110,150, 40, 138.0,188.0,  2300, 2.06,  ''],
        ['NA4924', 'NA',120,165, 45, 170.0,238.0,  2100, 2.92,  ''],
        ['NA4926', 'NA',130,180, 50, 202.0,292.0,  1900, 3.92,  ''],
        ['NA4928', 'NA',140,190, 50, 212.0,312.0,  1800, 4.28,  ''],
        ['NA4930', 'NA',150,210, 60, 270.0,415.0,  1700, 6.60,  ''],
        // ── RNA49系（フランジ付・内輪なし） ──
        ['RNA4900', 'RNA', 14, 22, 13,  6.55,  5.85, 16000, 0.015, '軸HRC58以上推奨'],
        ['RNA4901', 'RNA', 16, 24, 13,  7.35,  6.60, 14000, 0.017, ''],
        ['RNA4902', 'RNA', 20, 28, 13,  8.80,  8.15, 12000, 0.020, ''],
        ['RNA4903', 'RNA', 22, 30, 13,  9.55,  9.15, 11000, 0.023, ''],
        ['RNA4904', 'RNA', 25, 37, 17, 15.9,  15.3,  9000, 0.050, ''],
        ['RNA4905', 'RNA', 30, 42, 17, 18.0,  17.6,  8000, 0.058, ''],
        ['RNA4906', 'RNA', 35, 47, 17, 20.0,  20.0,  7000, 0.066, ''],
        ['RNA4907', 'RNA', 40, 55, 20, 28.0,  28.5,  6000, 0.110, ''],
        ['RNA4908', 'RNA', 45, 62, 22, 34.5,  36.5,  5500, 0.155, ''],
        ['RNA4909', 'RNA', 50, 68, 22, 37.5,  40.5,  5000, 0.178, ''],
        ['RNA4910', 'RNA', 55, 72, 22, 39.0,  43.5,  4800, 0.192, ''],
        ['RNA4911', 'RNA', 60, 80, 25, 49.5,  57.0,  4300, 0.285, ''],
        ['RNA4912', 'RNA', 65, 85, 25, 52.0,  61.5,  4000, 0.310, ''],
        ['RNA4914', 'RNA', 75,100, 30, 72.0,  90.0,  3500, 0.510, ''],
        ['RNA4916', 'RNA', 85,110, 30, 78.0, 100.0,  3200, 0.572, ''],
        ['RNA4918', 'RNA', 95,125, 35,104.0, 135.0,  2800, 0.880, ''],
        ['RNA4920', 'RNA',105,140, 40,128.0, 170.0,  2500, 1.28,  ''],
        // ── HK系（シェル型・底なし） ──
        ['HK0306', 'HK',  3,  6.5, 6,  1.27,  0.88, 32000, 0.001, '超小型'],
        ['HK0408', 'HK',  4,  8,   8,  2.00,  1.45, 26000, 0.002, ''],
        ['HK0509', 'HK',  5,  9,   9,  2.40,  1.85, 22000, 0.002, ''],
        ['HK0608', 'HK',  6, 10,   8,  2.55,  2.10, 20000, 0.003, ''],
        ['HK0709', 'HK',  7, 11,   9,  3.10,  2.60, 18000, 0.003, ''],
        ['HK0810', 'HK',  8, 12,  10,  3.90,  3.35, 16000, 0.004, ''],
        ['HK1010', 'HK', 10, 14,  10,  4.75,  4.25, 14000, 0.005, ''],
        ['HK1012', 'HK', 10, 14,  12,  5.60,  5.10, 14000, 0.006, ''],
        ['HK1210', 'HK', 12, 16,  10,  5.50,  5.10, 12000, 0.006, ''],
        ['HK1212', 'HK', 12, 16,  12,  6.55,  6.20, 12000, 0.007, ''],
        ['HK1516', 'HK', 15, 21,  16,  9.50,  9.50, 10000, 0.015, ''],
        ['HK1522', 'HK', 15, 21,  22, 11.5,  12.0,  10000, 0.020, ''],
        ['HK1614', 'HK', 16, 22,  14,  9.35,  9.50,  9500, 0.016, ''],
        ['HK2010', 'HK', 20, 26,  10,  7.20,  7.65,  8500, 0.014, ''],
        ['HK2012', 'HK', 20, 26,  12,  8.50,  9.30,  8500, 0.017, ''],
        ['HK2016', 'HK', 20, 26,  16, 11.0,  12.5,   8500, 0.022, '汎用'],
        ['HK2020', 'HK', 20, 26,  20, 12.5,  14.5,   8500, 0.027, ''],
        ['HK2516', 'HK', 25, 32,  16, 13.5,  16.0,   7500, 0.032, ''],
        ['HK2520', 'HK', 25, 32,  20, 15.5,  19.0,   7500, 0.040, ''],
        ['HK3016', 'HK', 30, 37,  16, 15.5,  19.5,   6500, 0.042, ''],
        ['HK3020', 'HK', 30, 37,  20, 18.0,  23.5,   6500, 0.052, ''],
        ['HK3520', 'HK', 35, 42,  20, 19.5,  26.0,   6000, 0.063, ''],
        ['HK4020', 'HK', 40, 48,  20, 22.0,  30.5,   5500, 0.090, ''],
        ['HK4025', 'HK', 40, 48,  25, 26.5,  38.5,   5500, 0.112, ''],
        ['HK5020', 'HK', 50, 58,  20, 26.0,  38.0,   4800, 0.138, ''],
        ['HK5025', 'HK', 50, 58,  25, 30.5,  46.5,   4800, 0.172, ''],
        // ── BK系（シェル型・底付き） ──
        ['BK0408', 'BK',  4,  8,   8,  1.90,  1.38, 26000, 0.002, '底付き・位置決め用途'],
        ['BK0609', 'BK',  6, 10,   9,  2.65,  2.25, 20000, 0.003, ''],
        ['BK0810', 'BK',  8, 12,  10,  3.90,  3.40, 16000, 0.004, ''],
        ['BK1010', 'BK', 10, 14,  10,  4.75,  4.30, 14000, 0.005, ''],
        ['BK1012', 'BK', 10, 14,  12,  5.60,  5.20, 14000, 0.006, ''],
        ['BK1210', 'BK', 12, 16,  10,  5.50,  5.15, 12000, 0.006, ''],
        ['BK1212', 'BK', 12, 16,  12,  6.55,  6.30, 12000, 0.007, ''],
        ['BK1516', 'BK', 15, 21,  16,  9.50,  9.65, 10000, 0.015, ''],
        ['BK2016', 'BK', 20, 26,  16, 11.0,  12.7,   8500, 0.022, ''],
        ['BK2520', 'BK', 25, 32,  20, 15.5,  19.5,   7500, 0.040, ''],
        ['BK3020', 'BK', 30, 37,  20, 18.0,  24.0,   6500, 0.052, ''],
        // ── SL4系（複列・内輪あり） ──
        ['SL4-5004', 'SL', 20, 42, 30, 28.5,  28.0,  9000, 0.150, 'NR=止め輪溝付き'],
        ['SL4-5005', 'SL', 25, 47, 30, 32.5,  33.5,  8000, 0.180, ''],
        ['SL4-5006', 'SL', 30, 55, 34, 45.0,  48.0,  7000, 0.295, ''],
        ['SL4-5007', 'SL', 35, 62, 35, 55.0,  60.5,  6000, 0.395, ''],
        ['SL4-5008', 'SL', 40, 68, 38, 65.0,  74.5,  5500, 0.525, 'NR付き型：SL4-5008NR'],
        ['SL4-5009', 'SL', 45, 75, 40, 76.5,  90.0,  5000, 0.680, ''],
        ['SL4-5010', 'SL', 50, 80, 40, 80.0,  96.5,  4800, 0.745, ''],
        ['SL4-5012', 'SL', 60, 95, 46,109.0, 138.0,  4000, 1.20,  ''],
        ['SL4-5014', 'SL', 70,110, 54,145.0, 192.0,  3500, 1.95,  ''],
        ['SL4-5016', 'SL', 80,125, 60,180.0, 248.0,  3200, 2.81,  ''],
        ['SL4-5018', 'SL', 90,140, 67,222.0, 318.0,  2800, 4.02,  ''],
        ['SL4-5020', 'SL',100,150, 67,238.0, 348.0,  2500, 4.60,  ''],
        // ── NKI系（内輪付・つば付） ──
        ['NKI15/16', 'NKI', 15, 27, 16, 13.2, 13.5, 10000, 0.028, ''],
        ['NKI17/16', 'NKI', 17, 29, 16, 14.0, 14.5,  9500, 0.032, ''],
        ['NKI20/16', 'NKI', 20, 33, 16, 16.5, 17.8,  8500, 0.042, ''],
        ['NKI22/16', 'NKI', 22, 35, 16, 17.5, 19.3,  8000, 0.048, ''],
        ['NKI25/20', 'NKI', 25, 38, 20, 22.5, 25.5,  7500, 0.072, ''],
        ['NKI28/20', 'NKI', 28, 42, 20, 25.5, 29.5,  7000, 0.086, ''],
        ['NKI30/20', 'NKI', 30, 45, 20, 28.5, 33.5,  6500, 0.098, ''],
        ['NKI32/20', 'NKI', 32, 47, 20, 30.0, 36.0,  6200, 0.108, ''],
        ['NKI35/20', 'NKI', 35, 52, 20, 34.5, 42.5,  6000, 0.134, ''],
        ['NKI40/20', 'NKI', 40, 58, 20, 38.5, 49.0,  5500, 0.170, ''],
        ['NKI40/30', 'NKI', 40, 58, 30, 53.0, 70.5,  5500, 0.252, ''],
        ['NKI45/25', 'NKI', 45, 62, 25, 45.5, 60.5,  5000, 0.215, ''],
        ['NKI50/25', 'NKI', 50, 68, 25, 50.0, 68.5,  4800, 0.258, ''],
        ['NKI55/25', 'NKI', 55, 75, 25, 57.5, 81.5,  4300, 0.330, ''],
        ['NKI60/25', 'NKI', 60, 80, 25, 60.5, 87.5,  4000, 0.368, ''],
        ['NKI65/25', 'NKI', 65, 85, 25, 63.5, 93.5,  3800, 0.408, ''],
        ['NKI70/25', 'NKI', 70, 92, 25, 70.5,106.0,  3500, 0.482, ''],
      ];

      let filteredNeedles = [];

      function filterNeedle() {
        const query  = $('ndl-query').value.trim().toUpperCase();
        const bore   = parseFloat($('ndl-bore').value) || null;
        const od     = parseFloat($('ndl-od').value)   || null;
        const series = $('ndl-series').value;

        filteredNeedles = NEEDLE_DB.filter(b => {
          if (series !== 'all' && b[1] !== series) return false;
          if (bore !== null && b[2] !== bore)       return false;
          if (od   !== null && b[3] !== od)         return false;
          if (query && !b[0].includes(query))       return false;
          return true;
        });

        $('ndl-hit-info').textContent = filteredNeedles.length
          ? `${filteredNeedles.length} 件ヒット`
          : query || bore || od ? '該当なし' : '';

        const SERIES_COLOR = {
          NA:'var(--accent)', RNA:'var(--good)', HK:'var(--warn)',
          BK:'#a0c4ff', SL:'#ff9966', NKI:'var(--muted)'
        };

        $('ndl-tbody').innerHTML = filteredNeedles.length
          ? filteredNeedles.map((b, idx) => `
            <tr onclick="needleRowClick(${idx})" style="cursor:pointer;">
              <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--ink);">${b[0]}</td>
              <td style="color:${SERIES_COLOR[b[1]]||'var(--muted)'};font-size:11px;font-weight:700;">${b[1]}</td>
              <td>${b[2]}</td>
              <td>${b[3]}</td>
              <td>${b[4]}</td>
              <td style="color:var(--accent);font-weight:700;">${b[5]}</td>
              <td>${b[6]}</td>
              <td style="color:var(--muted);">${b[7].toLocaleString()}</td>
              <td>${b[8]}</td>
              <td style="font-size:11px;color:var(--muted);">${b[9]}</td>
            </tr>`).join('')
          : `<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:20px;">
              ${query || bore || od ? '該当なし' : '型式または内径を入力してください'}
            </td></tr>`;
      }

      function needleRowClick(idx) {
        const b = filteredNeedles[idx];
        if (!b) return;
        // 寿命計算タブに初期値セット
        $('bl-type').value = 'roller';  // ころ軸受（p=10/3）
        $('bl-cr').value   = b[5];
        $('bl-c0r').value  = b[6];
        $('bl-fr').value   = parseFloat((b[5] / 10).toFixed(2));
        $('bl-fa').value   = 0;         // ラジアル専用なのでFa=0
        $('bl-n').value    = Math.floor(b[7] / 2 / 10) * 10;
        $('bl-fw').value   = 1.2;
        // 寿命計算タブへ切り替え
        showBearingTab('blife', document.getElementById('btab-blife'));
        calcBearingLife?.();
      }

      function filterTaper() {
        const q = ($("tp-query").value || "")
          .toUpperCase()
          .trim();
        const bore =
          $("tp-bore").value !== ""
            ? +$("tp-bore").value
            : null;
        const od =
          $("tp-od").value !== ""
            ? +$("tp-od").value
            : null;
        if (!q && bore === null && od === null) {
          $("tp-tbody").innerHTML =
            `<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:20px">型式または内径を入力してください</td></tr>`;
          $("tp-hit-info").textContent = "";
          return;
        }
        filteredTapers = TAPER_DB.filter((b) => {
          const mQ = q.length < 2 || b[0].includes(q);
          const mB = bore === null || b[1] === bore;
          const mO = od === null || b[2] === od;
          return mQ && mB && mO;
        });
        $("tp-hit-info").textContent = filteredTapers.length
          ? `${filteredTapers.length} 件ヒット`
          : "該当なし";
        $("tp-tbody").innerHTML = filteredTapers.length
          ? filteredTapers
              .map(
                (
                  b,
                ) => `<tr style="cursor:pointer" onclick="taperRowClick(${TAPER_DB.indexOf(b)})">
        <td style="font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:600">${b[0]}</td>
        <td>${b[1]}</td><td>${b[2]}</td><td>${b[3]}</td>
        <td style="color:var(--accent);font-weight:600">${b[4]}</td>
        <td>${b[5]}</td><td>${b[6]}</td><td>${b[7]}</td>
        <td style="color:var(--warn)">${b[9].toLocaleString()}</td>
        <td style="color:var(--muted)">${b[10]}</td>
      </tr>`,
              )
              .join("")
          : `<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:20px">該当なし</td></tr>`;
      }

      function taperRowClick(idx) {
        const b = TAPER_DB[idx];
        if (!b) return;
        selectedTaper = b;
        $("tl-model").value = b[0];
        $("tl-cr").value = b[4];
        $("tl-c0r").value = b[5];
        $("tl-e").value = b[6];
        $("tl-Y").value = b[7];
        $("tl-Y0").value = b[8];
        // Fr = Cr/10、n = 限界rpm÷2
        const frInit = parseFloat((b[4] / 10).toFixed(2));
        $("tl-fr").value = frInit;
        $("tl-fa").value = 0;
        $("tl-n").value = Math.floor(b[9] / 2 / 10) * 10;
        $("tl-fw").value = 1.2;
        document
          .querySelectorAll("#stab-btplife .preset-btn")
          .forEach((btn) => {
            btn.classList.toggle(
              "selected",
              btn.textContent.startsWith("1.2"),
            );
          });
        calcTaperLife();
        // テーパーころ寿命タブへ切り替え
        showBearingTab("btplife", $("btab-tplife"));
        // フラッシュ通知
        $("tp-hit-info").textContent =
          `✔ ${b[0]}  Fr=${frInit} kN / n=${$("tl-n").value} rpm をセットしました`;
        setTimeout(() => {
          filterTaper();
        }, 2500);
      }

      function onTaperModelInput() {
        const q = ($("tl-model").value || "").toUpperCase();
        const b = TAPER_DB.find((r) => r[0] === q);
        if (b) taperRowClick(TAPER_DB.indexOf(b));
        else calcTaperLife();
      }

      function setTLfw(v, el) {
        $("tl-fw").value = v;
        document
          .querySelectorAll("#stab-btplife .preset-btn")
          .forEach((b) => b.classList.remove("selected"));
        el.classList.add("selected");
        calcTaperLife();
      }

      function calcTaperLife() {
        const Cr = +$("tl-cr").value || 0;
        const Fr = +$("tl-fr").value || 0;
        const Fa = +$("tl-fa").value || 0;
        const n = +$("tl-n").value || 0;
        const fw = +$("tl-fw").value || 1.2;
        const Y = +$("tl-Y").value || 0;
        const e = +$("tl-e").value || 0;
        const cfg = $("tl-config").value;
        const faDir = $("tl-fa-dir").value;
        const Lh_target = +$("tl-lh-target").value || 20000;
        const fmt = (v, d = 2) =>
          isFinite(v) && v > 0 ? v.toFixed(d) : "—";

        if (!Cr || !Fr || !n || !Y) {
          [
            "tl-fai1",
            "tl-fai2",
            "tl-p1",
            "tl-p2",
            "tl-l10-1",
            "tl-l10-2",
            "tl-l10h-min",
            "tl-rpm-limit",
          ].forEach((id) => {
            const el = $(id);
            if (el) el.textContent = "—";
          });
          return;
        }

        const Fai1 = Fr / (2 * Y);
        const Fai2 = Fr / (2 * Y);
        const Fa_signed = faDir === "pos" ? Fa : -Fa;

        let P1, P2, note;
        if (cfg === "DT") {
          const Fr2 = Fr / 2,
            Fa2 = Math.abs(Fa) / 2;
          P1 = Fa2 / Fr2 > e ? 0.4 * Fr2 + Y * Fa2 : Fr2;
          P2 = P1;
          note = "直列(DT)：各軸受に荷重を均等分担";
        } else {
          const Fa_total_1 = Fai2 + Fa_signed;
          const Fa_total_2 = Fai1 - Fa_signed;
          if (Fa_total_1 > 0 && Fa_total_1 / Fr > e) {
            P1 = 0.4 * Fr + Y * Fa_total_1;
            P2 = Fr;
            note = "軸受①が負荷側";
          } else if (
            Fa_total_2 > 0 &&
            Fa_total_2 / Fr > e
          ) {
            P1 = Fr;
            P2 = 0.4 * Fr + Y * Fa_total_2;
            note = "軸受②が負荷側";
          } else {
            P1 = Fr;
            P2 = Fr;
            note = "Fa/Fr ≤ e → 両軸受 P = Fr";
          }
        }
        P1 *= fw;
        P2 *= fw;

        const p = 10 / 3;
        const L10_1 = Math.pow(Cr / P1, p);
        const L10_2 = Math.pow(Cr / P2, p);
        const Lh1 = (L10_1 * 1e6) / (60 * n);
        const Lh2 = (L10_2 * 1e6) / (60 * n);
        const Lh_min = Math.min(Lh1, Lh2);
        const rpmLimit = selectedTaper
          ? selectedTaper[9]
          : null;

        const hPerYear = 365.25 * 24;
        const fmtYear = (h) =>
          h >= 8760
            ? `≈ ${(h / hPerYear).toFixed(1)} 年`
            : `≈ ${(h / 730).toFixed(1)} ヶ月`;

        $("tl-fai1").textContent = fmt(Fai1, 3);
        $("tl-fai2").textContent = fmt(Fai2, 3);
        $("tl-p1").textContent = fmt(P1, 3);
        $("tl-p2").textContent = fmt(P2, 3);
        $("tl-p-note").textContent = note || "";
        $("tl-l10-1").innerHTML =
          `${fmt(L10_1, 2)}<span class="card-unit"> ×10⁶回</span>`;
        $("tl-l10h-1").textContent =
          `≈ ${Math.round(Lh1).toLocaleString()} h`;
        $("tl-l10y-1").textContent = fmtYear(Lh1);
        $("tl-l10-2").innerHTML =
          `${fmt(L10_2, 2)}<span class="card-unit"> ×10⁶回</span>`;
        $("tl-l10h-2").textContent =
          `≈ ${Math.round(Lh2).toLocaleString()} h`;
        $("tl-l10y-2").textContent = fmtYear(Lh2);
        $("tl-l10h-min").innerHTML =
          `${Math.round(Lh_min).toLocaleString()}<span class="card-unit"> h</span>`;
        $("tl-l10y-min").textContent = fmtYear(Lh_min);
        $("tl-rpm-limit").innerHTML = rpmLimit
          ? `${rpmLimit.toLocaleString()}<span class="card-unit"> rpm</span>`
          : "—";

        const ratio = Lh_min / Lh_target;
        const vc = $("tl-verdict-card");
        let icon, main, sub, color;
        if (rpmLimit && n > rpmLimit) {
          icon = "⚠️";
          main = "回転速度が限界を超えています";
          sub = `n=${n} rpm > 限界 ${rpmLimit.toLocaleString()} rpm`;
          color = "var(--bad)";
        } else if (ratio >= 2.0) {
          icon = "🟢";
          main = "寿命は十分余裕があります";
          sub = `L10h ${Math.round(Lh_min).toLocaleString()} h（目標の ${ratio.toFixed(1)}倍）`;
          color = "var(--good)";
        } else if (ratio >= 1.2) {
          icon = "✅";
          main = "寿命は目標を満たしています";
          sub = `L10h ${Math.round(Lh_min).toLocaleString()} h（目標の ${ratio.toFixed(1)}倍）`;
          color = "var(--good)";
        } else if (ratio >= 1.0) {
          icon = "🔶";
          main = "寿命はギリギリ目標を達成";
          sub = `L10h ${Math.round(Lh_min).toLocaleString()} h — より大きな軸受を検討してください`;
          color = "var(--warn)";
        } else {
          icon = "❌";
          main = "寿命不足 — 軸受の見直しが必要です";
          sub = `L10h ${Math.round(Lh_min).toLocaleString()} h（目標の ${(ratio * 100).toFixed(0)}%）`;
          color = "var(--bad)";
        }
        $("tl-verdict-icon").textContent = icon;
        $("tl-verdict-main").textContent = main;
        $("tl-verdict-sub").textContent = sub;
        vc.style.borderColor = color;
        vc.style.background = "var(--surface)";

        $("tl-detail-tbody").innerHTML = [
          ["ラジアル荷重 Fr", `${Fr} kN`, `${Fr} kN`],
          ["外部アキシャル Fa", `${Fa} kN`, "—"],
          [
            "内部アキシャル Fai",
            `${fmt(Fai1, 3)} kN`,
            `${fmt(Fai2, 3)} kN`,
          ],
          ["荷重係数 fw", `×${fw}`, `×${fw}`],
          [
            "等価動荷重 P",
            `${fmt(P1, 3)} kN`,
            `${fmt(P2, 3)} kN`,
          ],
          ["L10（×10⁶回）", fmt(L10_1, 3), fmt(L10_2, 3)],
          [
            "L10h（h）",
            `${Math.round(Lh1).toLocaleString()} h`,
            `${Math.round(Lh2).toLocaleString()} h`,
          ],
        ]
          .map(
            (r) => `<tr>
    <td style="padding:4px 6px;border-bottom:1px solid var(--border)">${r[0]}</td>
    <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace;color:var(--accent)">${r[1]}</td>
    <td style="text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace;color:var(--accent)">${r[2]}</td>
  </tr>`,
          )
          .join("");
      }
