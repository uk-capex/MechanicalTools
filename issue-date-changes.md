# 発行日・請求日 自動更新機能 実装まとめ

## 背景・課題

見積書作成時に保存したJSONを、後日納品書・請求書として発行する際、
`q-date`（作成日）が見積書の作成日のままになってしまい、手動で書き直す必要があった。

---

## 設計方針

| フィールド | 役割 | JSON読み込み時 |
|---|---|---|
| `q-date`（作成日） | 見積No生成の基準日。保持専用。 | 変更しない |
| `q-issue-date`（発行日・新設） | 印刷時に「発行日：」として出力される日付 | 常にTODAYに更新 |
| `q-bill-date`（請求日 / combo） | 納品書兼請求書の請求日 | 常にTODAYに更新 |
| `q-invoice-bill-date`（請求日 / invoice） | 請求書の請求日 | 常にTODAYに更新 |

モード判定は不要。JSONを読んだタイミングで無条件にTODAYへ更新することで、
過去データの日付に関係なく常に正しい発行日・請求日が入る。

---

## 変更内容

### 1. HTML — meta-barに発行日フィールドを追加

`q-date` のラベルを「発行日」→「**作成日**」に変更し、
新たに `q-issue-date`（発行日）フィールドを追加。
納品書・請求書・納品書兼請求書モードのときのみ表示。

```html
<!-- 作成日（旧:発行日） -->
<div class="field"><label>作成日</label>
  <input type="date" id="q-date"/></div>

<!-- 発行日（新設：納品書・請求書系モード時のみ表示） -->
<div id="issue-date-bar" class="field">
  <label style="color:var(--warn)">発行日</label>
  <input type="date" id="q-issue-date" style="width:130px;border-color:var(--warn);"/>
  <span style="font-size:10px;color:var(--warn);white-space:nowrap;">印刷時の発行日</span>
</div>
```

### 2. CSS — 発行日フィールドのスタイル

```css
#issue-date-bar { display: none; align-items: center; gap: 5px; }
#issue-date-bar label { font-size: 11px; color: var(--warn); white-space: nowrap; margin: 0; }
#issue-date-bar input { width: 130px; border-color: var(--warn) !important; }
```

### 3. JS — setPrintMode に表示切替を追加

```javascript
function setPrintMode(m, btn) {
  // ...既存処理...
  const isDelivery = (m === 'delivery');
  const needsIssueDate = (isDelivery || isInvoice || isCombo);
  document.getElementById('issue-date-bar').style.display = needsIssueDate ? 'flex' : 'none';
  // ...
}
```

### 4. JS — init() に q-issue-date の初期化を追加

```javascript
sv('q-date', fmt(today));
sv('q-valid', fmt(valid));
sv('q-issue-date', fmt(today)); // ← 追加
```

### 5. JS — 印刷出力の「発行日：」を q-issue-date から取得

印刷ドキュメント生成箇所（2箇所）を変更。
納品書・請求書系モードのときは `q-issue-date` を、見積書モードのときは `q-date` を使用。

```javascript
// Before
発行日：${gv('q-date')}

// After
発行日：${(isDelivery || isInvoice || isCombo)
  ? gv('q-issue-date') || gv('q-date')
  : gv('q-date')}
```

### 6. JS — applyJSON 末尾に日付の自動更新を追加（最終形）

モード判定なし。JSON読み込みのたびに無条件でTODAYへ更新。

```javascript
function applyJSON(data) {
  // ...既存の復元処理...
  renderRates(); renderAll(); recalcAll();
  updateInfoSummary();

  // JSON読み込み時、発行日・請求日系は常にTODAYに更新
  // q-date（作成日・見積No生成基準）は保持
  const _today = new Date().toISOString().slice(0, 10);
  sv('q-issue-date', _today);
  sv('q-bill-date', _today);
  sv('q-invoice-bill-date', _today);
}
```

### 7. JS — buildSaveData に issueDate を追加

```javascript
meta: {
  no: gv('q-no'),
  noPrefix: gv('q-no-prefix'),
  date: gv('q-date'),
  valid: gv('q-valid'),
  issueDate: gv('q-issue-date'), // ← 追加
  // ...
}
```

### 8. JS — applyJSON の読み込みに issueDate を追加

```javascript
sv('q-no', m.no || '');
sv('q-date', m.date || '');
sv('q-valid', m.valid || '');
sv('q-issue-date', m.issueDate || new Date().toISOString().slice(0, 10)); // ← 追加
```

### 9. JS — hardClear に q-issue-date を追加

```javascript
['q-no', 'q-no-prefix', 'q-date', 'q-valid', 'q-issue-date', /* ... */]
  .forEach(id => sv(id, ''));
```

---

## 実装チェックリスト（類似ツールへの移植時）

- [ ] `q-date` ラベルを「作成日」に変更
- [ ] `q-issue-date` フィールドをmeta-barに追加（`issue-date-bar` でラップ）
- [ ] CSS で `#issue-date-bar { display: none; }` を定義
- [ ] `setPrintMode` で `needsIssueDate` フラグを使って表示切替
- [ ] `init()` で `q-issue-date` を TODAY で初期化
- [ ] 印刷出力の「発行日：」を `q-issue-date` / `q-date` の条件分岐に変更（2箇所）
- [ ] `applyJSON` 末尾に3行のTODAY更新を追加
- [ ] `buildSaveData` の meta に `issueDate: gv('q-issue-date')` を追加
- [ ] `applyJSON` の復元処理に `sv('q-issue-date', m.issueDate || today)` を追加
- [ ] `hardClear` のリセット対象に `q-issue-date` を追加
