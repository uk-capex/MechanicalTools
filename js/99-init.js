/* 初期化（即時実行）— 全関数定義の読み込み後に実行されるよう最後に配置 */

// ── block1 由来 ──
$("screw-type").addEventListener(
        "change",
        buildScrewSelect,
      );
buildScrewSelect();
$("cbore-type").addEventListener(
        "change",
        buildCboreSelect,
      );
buildCboreSelect();
calcGear();
$("chain-type").addEventListener("change", calcChain);
calcChain();
$("snap-type").addEventListener(
        "change",
        buildSnapSelect,
      );
buildSnapSelect();
calcFit();
$("pipe-type").addEventListener("change", calcPipe);
$("pipe-size").addEventListener("change", calcPipe);
calcPipe();
["sh-matH-sel", "sh-matS-sel"].forEach((id) =>
        $(id).addEventListener("change", () =>
          shrinkSyncMat(id.includes("H") ? "H" : "S"),
        ),
      );
shrinkSyncMat("H");
shrinkSyncMat("S");
window.addEventListener("DOMContentLoaded", () => {
        init(); // 梁計算初期化
        initKeyway();
        initOil();
        calcBearingLife();
        calcBearingFit();
        for (const n of document.head.childNodes) {
          if (
            n.nodeType === Node.COMMENT_NODE &&
            n.nodeValue.includes("build:")
          ) {
            // "冒頭のコメント欄からパース
            const parts = n.nodeValue
              .trim()
              .replace(/^build:\s*/, "")
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean);
            const ver = parts[0] || "--";
            const date = parts[1]
              ? parts[1].replace(
                  /(\d{4})(\d{2})(\d{2})/,
                  "$1.$2.$3",
                )
              : "";
            const el = document.getElementById("verBadge");
            if (el)
              el.textContent = `Mechanical Tools ver.${ver}${date ? "  " + date : ""}`;
            break;
          }
        }
      });
onFluidChange();
addSegment();
calcPumpPow();
calcPipeSiz();

// ── block2 由来 ──
insRender();

// ── block3 由来 ──
wtShapeChange();
orFilter();
calcComp();
initMatSelector();
osFilter();
pkFilter();
flFilter();
rigCalc();
wireFilter();
wireQuickCalc();
eyeboltFilter();
shackleFilter();
ancFilter();
ancCalc();
