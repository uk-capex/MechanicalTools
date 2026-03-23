# 顧客情報・自社情報パネル 折りたたみ機能 実装まとめ

## 概要

見積ツール起動時に画面を占領していた「顧客・件名」「自社情報」の2カラム入力エリアを、
デフォルト折りたたみ＋ワンクリック展開できるUIに改修した。

---

## 変更ファイル

`THK_EstiMate_Factory_V1_22.html` → `V1_25.html`（V1.23〜V1.25の3ステップ）

---

## 1. HTML構造の変更

### Before
```html
<div class="info-col">
  <div class="section-title">🏢 顧客・件名</div>
  <!-- フィールド群がそのまま展開 -->
  <div class="field">...</div>
</div>
```

### After
```html
<div class="info-col">
  <!-- ① クリック不可のヘッダーバー -->
  <div class="info-col-header" id="client-header">
    <div class="section-title">🏢 顧客・件名</div>
    <div class="toggle-indicator">
      <!-- 閉じているときだけ表示されるヒントテキスト（クリック可） -->
      <span class="toggle-hint" onclick="toggleInfoCol('client')">クリックして開く</span>
      <!-- 折りたたみ時に会社名・件名をプレビュー表示 -->
      <span class="info-col-summary" id="client-summary"></span>
      <!-- ▶ ボタン：唯一のクリック対象（開閉トリガー） -->
      <span class="toggle-arrow" onclick="toggleInfoCol('client')">▶</span>
    </div>
  </div>
  <!-- ② 折りたたまれるコンテンツ本体（初期は collapsed） -->
  <div class="info-col-body collapsed" id="client-body">
    <div class="field">...</div>
  </div>
</div>
```

**ポイント：**
- ヘッダー全体ではなく `toggle-arrow`（▶ボタン）と `toggle-hint` だけが `onclick` を持つ
- コンテンツ側に `collapsed` クラスをHTMLデフォルトで付与 → 初期表示から折りたたまれた状態
- サマリー用 `span#client-summary` を設置し、折りたたみ中も入力内容をヘッダーに表示

自社情報カラムも同じ構造で `company-header` / `company-body` として実装。

---

## 2. CSSの追加・変更

```css
/* ── レイアウト調整 ── */
.info-col {
  padding: 0;           /* 元の padding:10px 14px を廃止 */
  gap: 0;               /* bodyとheaderを密着させる */
}

/* ── ヘッダーバー ── */
.info-col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 14px;
  cursor: default;      /* ヘッダー全体はクリック不可を明示 */
  background: var(--surface2);
  border-bottom: 1px solid var(--border);
}

/* ── 「クリックして開く」ヒント：閉じているときだけ表示 ── */
.info-col-header:not(.open) .toggle-hint { display: inline; }
.info-col-header.open       .toggle-hint { display: none; }
.toggle-hint {
  font-size: 10px;
  color: var(--accent);
  cursor: pointer;
}

/* ── ▶ ボタン ── */
.toggle-arrow {
  width: 22px; height: 22px;
  border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 9px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--muted);
  cursor: pointer;
  transition: transform .22s, background .15s, border-color .15s, color .15s, box-shadow .15s;
}

/* 閉じているとき：青くパルスアニメーション */
.info-col-header:not(.open) .toggle-arrow {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  animation: pulse-arrow 1.8s ease-in-out infinite;
}
.info-col-header:not(.open) .toggle-arrow:hover {
  background: rgba(56,139,253,.75);
  box-shadow: 0 0 0 4px rgba(56,139,253,.2);
  animation: none;
}

/* 開いているとき：矢印を90°回転、ホバーで薄く反応 */
.info-col-header.open .toggle-arrow { transform: rotate(90deg); }
.info-col-header.open .toggle-arrow:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

@keyframes pulse-arrow {
  0%,100% { box-shadow: 0 0 0 0   rgba(56,139,253,.5); }
  50%      { box-shadow: 0 0 0 5px rgba(56,139,253,0);  }
}

/* ── コンテンツ本体（アコーディオン） ── */
.info-col-body {
  padding: 10px 14px;
  display: flex; flex-direction: column; gap: 6px;
  overflow: hidden;
  transition: max-height .28s ease, opacity .22s ease, padding .22s ease;
  max-height: 2000px;
  opacity: 1;
}
.info-col-body.collapsed {
  max-height: 0;
  opacity: 0;
  padding-top: 0; padding-bottom: 0;
  pointer-events: none;
}

/* ── サマリーテキスト（折りたたみ中にヘッダーへ表示） ── */
.info-col-summary {
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
```

---

## 3. JavaScriptの追加

```javascript
/* ── 開閉トグル ── */
function toggleInfoCol(which) {
  const header = document.getElementById(which + '-header');
  const body   = document.getElementById(which + '-body');
  if (!header || !body) return;

  const isOpen = !body.classList.contains('collapsed');
  body.classList.toggle('collapsed', isOpen);
  header.classList.toggle('open', !isOpen);

  // 開閉状態を localStorage に保存
  try {
    localStorage.setItem('thk-infocol-' + which, isOpen ? 'closed' : 'open');
  } catch(e) {}
}

/* ── サマリーテキスト更新（入力のたびに呼ぶ） ── */
function updateInfoSummary() {
  // 顧客サマリー：会社名 / 件名
  const client  = document.getElementById('q-client');
  const subject = document.getElementById('q-subject');
  const cs      = document.getElementById('client-summary');
  if (cs) {
    const parts = [];
    if (client?.value.trim())  parts.push(client.value.trim());
    if (subject?.value.trim()) parts.push(subject.value.trim());
    cs.textContent = parts.join(' / ');
  }
  // 自社サマリー：会社名のみ
  const company = document.getElementById('q-company');
  const coms    = document.getElementById('company-summary');
  if (coms) coms.textContent = company?.value.trim() || '';
}

/* ── localStorage から開閉状態を復元（デフォルトは閉じ） ── */
function restoreInfoColState() {
  ['client', 'company'].forEach(which => {
    let state = 'closed';
    try { state = localStorage.getItem('thk-infocol-' + which) || 'closed'; } catch(e) {}
    if (state === 'open') {
      const body   = document.getElementById(which + '-body');
      const header = document.getElementById(which + '-header');
      if (body)   body.classList.remove('collapsed');
      if (header) header.classList.add('open');
    }
  });
}
```

**呼び出しタイミング：**

```javascript
// init() 内に追加
function init() {
  // ... 既存処理 ...
  resetSections();
  renderRates(); renderAll(); recalcAll();
  restoreInfoColState();  // ← 追加
  updateInfoSummary();    // ← 追加
}

// applyJSON() 末尾に追加（JSONロード時もサマリーを更新）
function applyJSON(data) {
  // ... 既存処理 ...
  renderRates(); renderAll(); recalcAll();
  updateInfoSummary();  // ← 追加
}

// 顧客・自社情報の入力フィールドに oninput を追加
// <input id="q-client"  ... oninput="updateInfoSummary()"/>
// <input id="q-subject" ... oninput="updateInfoSummary()"/>
// <input id="q-company" ... oninput="updateInfoSummary()"/>
```

---

## 実装チェックリスト

移植先ツールで同様の改修を行う際は以下を確認。

- [ ] `info-col` の `padding` / `gap` を `0` にリセット
- [ ] ヘッダーバー要素（`info-col-header`）を追加、`id` をユニークに
- [ ] コンテンツ本体を `info-col-body collapsed` でラップ
- [ ] `toggle-arrow` と `toggle-hint` にのみ `onclick` を設定（ヘッダー全体には設定しない）
- [ ] `q-client` / `q-subject` / `q-company` の入力欄に `oninput="updateInfoSummary()"` を追加
- [ ] JS 3関数（`toggleInfoCol` / `updateInfoSummary` / `restoreInfoColState`）を追加
- [ ] `init()` に `restoreInfoColState()` と `updateInfoSummary()` の呼び出しを追加
- [ ] `applyJSON()` 末尾に `updateInfoSummary()` の呼び出しを追加
- [ ] CSS変数 `--accent` / `--accent-dim` が定義されていることを確認（パルスカラーに使用）
