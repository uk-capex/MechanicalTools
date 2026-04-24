# Mechanical Tools 引き継ぎドキュメント v2

> 作成日: 2026-04-24  
> 対象ファイル: `Mechanical_Tools_1_54.html`  
> 総行数: 約21,820行

---

## ファイル概要

製造業・設備保全向けの単一HTMLファイルツール集。オフラインで動作。  
ダークUI（Black Deep Tone）、JetBrains Mono + Noto Sans JP。  
uk-capex.com にホスティング予定（Cloudflare Pages）。

---

## タブ構成（ver.1.54時点）

| タブ | id | 内容 |
|---|---|---|
| 🔥 焼き嵌め | `tab-shrink` | 締め代計算・加熱温度 |
| ⚙️ ネジ | `tab-screw` | メートルねじ・ユニファイ・タップドリル径 |
| 🪛 インサート下穴 | `tab-insert` | ヘリコイル・E-サート下穴径 |
| 🚿 管用ネジ | `tab-pipe` | R/Rc/G ねじ寸法 |
| 🔩 座グリ | `tab-cbore` | キャップボルト用ざぐり寸法 |
| ⚙️ 歯車 | `tab-gear` | モジュール・歯数・中心距離 |
| ⛓️ チェーン | `tab-chain` | ローラーチェーン規格 |
| 🎡 ベアリング | `tab-bearing` | 型番検索・寿命計算・はめあい・スラスト・テーパーころ（6サブタブ） |
| 🔗 スナップリング | `tab-snap` | C形・E形 軸穴寸法 |
| 📏 はめあい公差 | `tab-fit` | 穴基準・軸基準の公差計算 |
| 📐 単位変換 | `tab-unit` | 長さ・重量・圧力・トルク・温度など |
| 🏗️ 梁計算 | `tab-beam` | 単純梁・片持ち梁・両端固定（断面係数サブタブあり）+ 丸パイプ |
| 🗝️ キー溝寸法 | `tab-keyway` | JIS B 1301 平行キー・半月キー |
| 🛢️ 油脂類 | `tab-oil` | 油種・粘度・ブランド対照表（4サブタブ） |
| 🔧 ポンプ/エア配管 | `tab-pump` | 配管損失・代替判定・ポンプ動力・管径探索（4サブタブ） |
| ⚖️ 重量計算 | `tab-weight` | 丸棒・パイプ・形鋼など10断面形状 × 6材質 |
| 🔵 Oリング/シール | `tab-seal` | 5サブタブ（後述） |
| 🔩 配管フランジ | `tab-flange` | 4カテゴリ一覧（後述） |
| 🪝 吊り具選定 | `tab-rigging` | 4サブタブ（後述） |

---

## 🔵 Oリング/シールタブ詳細

### サブタブ構成

| id | ボタンid | 内容 |
|---|---|---|
| `stab-seal-oring` | `sbtn-seal-oring` | Oリング溝寸法表（JIS B 2401） |
| `stab-seal-comp` | `sbtn-seal-comp` | 圧縮率・引張り率計算 + SVGビジュアライザ |
| `stab-seal-mat` | `sbtn-seal-mat` | 材質・適合流体（NBR/FKM/VMQ/EPDM/CR/PTFE） |
| `stab-seal-oilseal` | `sbtn-seal-oilseal` | オイルシール寸法表 + 呼び番号体系 |
| `stab-seal-pack` | `sbtn-seal-pack` | パッキン種類・選定ガイド |

### Oリングデータ（`OR_DATA`）

- **P系**：P3〜P800（運動用・内圧）
- **G系**：G25〜G800（固定用・外圧）
- **S系**：S6〜S300（小型シリンダ用）
- **V系**：V30〜V1000（真空フランジ用・細かいピッチ）

### サブタブ切り替え関数

```javascript
function showSealTab(name, btn) {
  const wrap = document.getElementById('seal-stab-wrap');
  wrap.querySelectorAll('.stab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#tab-seal .stab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('stab-seal-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
}
```

> ⚠️ ボタンid（`sbtn-seal-*`）とコンテンツid（`stab-seal-*`）は別名。  
> `seal-stab-wrap` 内に限定しないと他タブの stab-content を誤操作する。

---

## 🔩 配管フランジタブ詳細

### 4カテゴリ

| Cat | 内容 | 圧力クラス |
|---|---|---|
| A | JISフランジ（水・油・蒸気） | 5K / 10K / **16K** / 20K |
| B | 真空フランジ | NW/KF / ISO-F / ICF / **JIS丸フランジ(JIS B 2290)** |
| C | ねじ込み・継手系 | Rねじ / Swagelok |
| D | 衛生・サニタリー系 | ISO 2852（Tri-Clamp） |

### データ範囲

- **JIS 5K/10K/16K/20K**：10A〜300A
- **真空**：NW10〜NW63、ISO-F 63〜200、ICF 34〜152、JIS丸フランジ DN16〜DN630
- **ねじ込み**：R1/8〜R2、Swagelok 1/8"〜1"
- **サニタリー**：1.5"〜6"

### 構造上の注意点

フランジタブは `two-panel` クラスで囲まれているが、`panel-left` / `panel-right` のインラインstyleは削除済み（グリッドに任せる）。

---

## 🪝 吊り具選定タブ詳細

### サブタブ構成

| id | ボタンid | 内容 |
|---|---|---|
| `stab-rig-calc` | `sbtn-rig-calc` | 🎯 総合選定（先頭・メイン） |
| `stab-rig-wire` | `sbtn-rig-wire` | 🔗 ワイヤーロープ |
| `stab-rig-eyebolt` | `sbtn-rig-eyebolt` | 🔩 アイボルト |
| `stab-rig-shackle` | `sbtn-rig-shackle` | 🪝 シャックル |

### 総合選定タブ（`stab-rig-calc`）

- 荷重(kgf) / 吊り点数 / **開き角**（0〜120°）を入力
- 張力係数：0°=1.00, 30°=1.04, 60°=1.16, 90°=1.41, 120°=2.00
- **吊り点数連動ロジック**：
  - 1点吊り選択 → 開き角0°固定・disabled
  - 2点/4点選択 → 開き角60°にセット・有効化
  - 開き角0°選択 → 1点吊りに戻す・disabled
- 右パネルに推奨一覧（ワイヤー径/アイボルト径/シャックルピン径）を表示
- 「各タブへ反映」ボタンで荷重・角度を各タブに自動セット

### 荷重単位

全タブ **kgf ベース**。kN・tf は参考表示。  
ワイヤーテーブルには破断荷重(kN/tf) + **安全荷重(kgf)** を並記。

### シャックルの tbody id

`shackle-tbody`（`sh-tbody` は焼き嵌めタブで使用中のため別名）

### サブタブ切り替え関数

```javascript
function showRigTab(name, btn) {
  const wrap = document.getElementById('rig-stab-wrap');
  wrap.querySelectorAll('.stab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#tab-rigging .stab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('stab-rig-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
}
```

---

## CSS変数（デザインシステム）

```css
--bg: #0c1117;        /* ページ背景 */
--surface: #161b22;   /* パネル */
--surface2: #1c2230;  /* 入力・メモ */
--border: #2a3444;
--ink: #cdd9e5;       /* 本文テキスト */
--muted: #768390;     /* サブテキスト */
--accent: #388bfd;    /* 強調・リンク */
--accent-dim: #1c3a6b;
--good: #3fb950;      /* OK・適正 */
--good-dim: #0f2d17;
--warn: #d29922;      /* 注意 */
--warn-dim: #2e2009;
--bad: #f85149;       /* NG・禁止 */
--bad-dim: #3b1016;
```

---

## よくあるバグパターン

### 1. サブタブが動かない / 他のサブタブが消える

- **原因A**：ボタンidとコンテンツdivのidが同名
- **対策**：ボタンは `sbtn-seal-*`、コンテンツは `stab-seal-*` で分離
- **原因B**：`querySelectorAll('.stab-content')` がページ全体を巻き込む
- **対策**：必ずスコープを限定する（`wrap.querySelectorAll` or `#tab-xxx .stab-content`）

### 2. タブの中身が表示されない

- **原因**：`</div>` の過不足。特に `two-panel` を後から追加したときに `panel-right` の閉じタグを忘れやすい
- **症状**：後続タブが前タブの子要素に巻き込まれて非表示になる

### 3. id の重複

- `sh-tbody` は焼き嵌めタブ（shrink）が使用中 → シャックルは `shackle-tbody`
- 新しいテーブルを追加するときは `grep -n 'id="xxx"'` で重複確認

---

## ✅ HTML構造チェックスクリプト（必ず実行）

### 標準チェック（行単位depth追跡・最も正確）

```python
import re

with open('Mechanical_Tools_1_XX.html') as f:
    lines = f.readlines()

def check_tab(lines, start_key, end_key, label):
    start = next(i for i,l in enumerate(lines) if start_key in l)
    end   = next(i for i,l in enumerate(lines) if end_key in l)
    depth = 0
    in_script = False
    for i in range(start, end+1):
        line = lines[i]
        if '<script' in line: in_script = True
        if '</script>' in line: in_script = False; continue
        if in_script: continue
        line_clean = re.sub(r'`[^`]*`', '', line)  # テンプレートリテラル除去
        depth += len(re.findall(r'<div[\s>]', line_clean)) - line_clean.count('</div>')
    print(f'{label}: {"OK" if depth==0 else f"NG depth={depth}"}')

check_tab(lines, 'id="tab-seal"',    '<!-- /tab-seal -->',    'tab-seal')
check_tab(lines, 'id="tab-flange"',  '<!-- /tab-flange -->',  'tab-flange')
check_tab(lines, 'id="tab-rigging"', '<!-- /tab-rigging -->', 'tab-rigging')
```

> ⚠️ `re.sub(r'<script.*?</script>', '', chunk)` 方式はテンプレートリテラル内の `<div>` を誤カウントするため非推奨。必ず**行単位でscriptをskip + バックティック除去**の方式を使うこと。

### idの重複チェック

```python
import re
from collections import Counter

with open('Mechanical_Tools_1_XX.html') as f:
    src = f.read()

ids = re.findall(r'id="([^"]+)"', src)
dupes = [(id,cnt) for id,cnt in Counter(ids).items() if cnt > 1]
for id, cnt in dupes:
    print(f'重複: {id} × {cnt}')
```

---

## バージョン履歴

| ver | 日付 | 主な変更 |
|---|---|---|
| 1.50 | 2026-03-30 | 重量計算タブ追加 |
| 1.51 | 2026-04-07 | Oリング/シールタブ新設、配管フランジタブ新設 |
| 1.52 | 2026-04-08 | S系・P系大サイズ追加、オイルシール呼び番号体系、Oリング種別早見表、divバグ修正 |
| 1.53 | 2026-04-23 | JIS 16K追加、JIS丸フランジ(B2290)追加、吊り具選定タブ新設（ワイヤー/アイボルト/シャックル）、梁計算に丸パイプ追加 |
| 1.54 | 2026-04-24 | 吊り具総合選定サブタブ追加（開き角連動）、荷重kgfベース統一、フランジスマホ対応、div閉じタグバグ修正（panel-right欠落） |

---

## 今後の追加候補

- [ ] 配管フランジ断面SVG（カテゴリ選択時に切り替え）
- [ ] フランジタブ：締め付けトルク計算（ボルト径・本数・摩擦係数入力）
- [ ] 吊り具：スリング（ベルト・チェーン）タブ追加
- [ ] 電気タブ（ブレーカー選定・電線太さ）

---

## 開発スタンス

- ダークUI・JetBrains Mono + Noto Sans JP を統一
- 単一HTMLファイル・オフライン動作が絶対条件
- 左パネルで絞り込み・右パネルで常時表示の2カラム構成を基本とする
- `two-panel` を後から追加するときは `panel-left` + `panel-right` 両方の閉じタグを確認
- 新しいサブタブのid命名：ボタン `sbtn-[tab]-[name]`、コンテンツ `stab-[tab]-[name]`
- querySelectorAll はタブスコープ内に必ず限定する
- HTML編集後は必ず行単位depth追跡スクリプトでチェックすること


> 作成日: 2026-04-08  
> 対象ファイル: `Mechanical_Tools_1_52.html`  
> 総行数: 約20,890行

---

## ファイル概要

製造業・設備保全向けの単一HTMLファイルツール集。オフラインで動作。  
ダークUI（Black Deep Tone）、JetBrains Mono + Noto Sans JP。  
uk-capex.com にホスティング予定（Cloudflare Pages）。

---

## タブ構成（ver.1.52時点）

| タブ | id | 内容 |
|---|---|---|
| 🔥 焼き嵌め | `tab-shrink` | 締め代計算・加熱温度 |
| ⚙️ ネジ | `tab-screw` | メートルねじ・ユニファイ・タップドリル径 |
| 🪛 インサート下穴 | `tab-insert` | ヘリコイル・E-サート下穴径 |
| 🚿 管用ネジ | `tab-pipe` | R/Rc/G ねじ寸法 |
| 🔩 座グリ | `tab-cbore` | キャップボルト用ざぐり寸法 |
| ⚙️ 歯車 | `tab-gear` | モジュール・歯数・中心距離 |
| ⛓️ チェーン | `tab-chain` | ローラーチェーン規格 |
| 🎡 ベアリング | `tab-bearing` | 型番検索・寿命計算・はめあい・スラスト・テーパーころ（6サブタブ） |
| 🔗 スナップリング | `tab-snap` | C形・E形 軸穴寸法 |
| 📏 はめあい公差 | `tab-fit` | 穴基準・軸基準の公差計算 |
| 📐 単位変換 | `tab-unit` | 長さ・重量・圧力・トルク・温度など |
| 🏗️ 梁計算 | `tab-beam` | 単純梁・片持ち梁・両端固定（断面係数サブタブあり） |
| 🗝️ キー溝寸法 | `tab-keyway` | JIS B 1301 平行キー・半月キー |
| 🛢️ 油脂類 | `tab-oil` | 油種・粘度・ブランド対照表（4サブタブ） |
| 🔧 ポンプ/エア配管 | `tab-pump` | 配管損失・代替判定・ポンプ動力・管径探索（4サブタブ） |
| ⚖️ 重量計算 | `tab-weight` | 丸棒・パイプ・形鋼など10断面形状 × 6材質 |
| 🔵 Oリング/シール | `tab-seal` | 5サブタブ（後述） |
| 🔩 配管フランジ | `tab-flange` | 4カテゴリ一覧（後述） |

---

## 🔵 Oリング/シールタブ詳細

### サブタブ構成

| id | ボタンid | 内容 |
|---|---|---|
| `stab-seal-oring` | `sbtn-seal-oring` | Oリング溝寸法表（JIS B 2401） |
| `stab-seal-comp` | `sbtn-seal-comp` | 圧縮率・引張り率計算 + SVGビジュアライザ |
| `stab-seal-mat` | `sbtn-seal-mat` | 材質・適合流体（NBR/FKM/VMQ/EPDM/CR/PTFE） |
| `stab-seal-oilseal` | `sbtn-seal-oilseal` | オイルシール寸法表 + 呼び番号体系 |
| `stab-seal-pack` | `sbtn-seal-pack` | パッキン種類・選定ガイド |

### Oリングデータ（`OR_DATA`）

- **P系**：P3〜P400（運動用・内圧）線径 1.9 / 2.4 / 3.5 / 5.7 / 8.4mm
- **G系**：G25〜G150（固定用・外圧）
- **S系**：S6〜S300（小型シリンダ用）
- **V系**：V75〜V300（真空フランジ用）

### 種別早見表（溝寸法タブ左パネルに配置）

| 種別 | 硬さ | 用途 |
|---|---|---|
| 1種A | Hs70±5 | 標準・最汎用。迷ったらこれ |
| 1種B | Hs90±5 | 高圧・バックアップリング代わり |
| 2種 | Hs60±5 | 真空・精密・低面圧シール |

> 同じ型番でも種別が違うと線径公差が異なり圧縮率が変わる。無指定時は通常1種Aが供給。

### オイルシール呼び番号（`osFilter()`で自動生成）

| 種類 | 例（40×55×9） |
|---|---|
| 通称(TC呼び) | `TC40×55×9` |
| JIS呼び記号 | `JIS D 40 55 9` |
| ISO呼び記号 | `TYPE 4 40 55 9` |
| NOK品番(参考) | `AE4005500E0` |
| 武蔵(参考) | `AD4005500E0` |

### サブタブ切り替え関数

```javascript
function showSealTab(name, btn) {
  const wrap = document.getElementById('seal-stab-wrap');
  wrap.querySelectorAll('.stab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#tab-seal .stab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('stab-seal-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
}
```

> ⚠️ 注意：ボタンid（`sbtn-seal-*`）とコンテンツid（`stab-seal-*`）は別名。  
> `seal-stab-wrap` で querySelectorAll を限定しないと他タブのstab-contentを誤操作する。

---

## 🔩 配管フランジタブ詳細

### レイアウト

- **左パネル**：絞り込み（カテゴリ・圧力クラス・呼び径テキスト・互換性フィルター）+ 接続方式テキスト説明（`fl-info-box`）+ 互換性凡例
- **右パネル**：13列テーブル常時表示（`fl-tbody`）

### 4カテゴリ

| Cat | 内容 | 圧力クラス |
|---|---|---|
| A | JISフランジ（水・油・汎用ガス） | 5K / 10K / 20K |
| B | 真空フランジ | NW/KF / ISO-F / ICF |
| C | ねじ込み・継手系 | Rねじ / Swagelok |
| D | 衛生・サニタリー系 | ISO 2852（Tri-Clamp） |

### データ範囲

- **JIS 5K**：10A〜300A（15サイズ）
- **JIS 10K**：10A〜300A（15サイズ）
- **JIS 20K**：25A〜300A（10サイズ）
- **真空**：NW10〜NW63、ISO63〜ISO200、ICF34〜ICF152
- **ねじ込み**：R1/8〜R2、Swagelok 1/8"〜1"
- **サニタリー**：1.5"〜6"（6サイズ）

### 互換性フラグ（`compatFlag`）

| フラグ | 表示 | 行背景色 | 意味 |
|---|---|---|---|
| `ok` | ✓ 互換OK | なし | PCDが一致・共通化可 |
| `warn` | ⚠ 要確認 | `--warn-dim` | 要現物確認 |
| `ng` | ✕ 混用禁止 | `--bad-dim` | PCD不一致・絶対混用禁止 |

### 接続方式テキスト説明（`FL_INFO`）

カテゴリ選択時に `fl-info-box` の innerHTML を差し替え。  
A→ライズドフェイス・PCD罠の説明、B→NW/ISO-F/ICF 3種比較、C→ねじ込みルール、D→CIP/SIP対応。

---

## CSS変数（デザインシステム）

```css
--bg: #0c1117;        /* ページ背景 */
--surface: #161b22;   /* パネル */
--surface2: #1c2230;  /* 入力・メモ */
--border: #2a3444;
--ink: #cdd9e5;       /* 本文テキスト */
--muted: #768390;     /* サブテキスト */
--accent: #388bfd;    /* 強調・リンク */
--accent-dim: #1c3a6b;
--good: #3fb950;      /* OK・適正 */
--good-dim: #0f2d17;
--warn: #d29922;      /* 注意 */
--warn-dim: #2e2009;
--bad: #f85149;       /* NG・禁止 */
--bad-dim: #3b1016;
```

---

## よくあるバグパターン

### 1. サブタブが動かない / 他のサブタブが消える
- **原因**：ボタンidとコンテンツdivのidが同名（`stab-oring` vs `stab-oring`）
- **対策**：ボタンは `sbtn-seal-*`、コンテンツは `stab-seal-*` で分離
- **対策**：`querySelectorAll` は `#seal-stab-wrap` で限定すること

### 2. Oリング/シールタブや配管フランジタブが表示されない
- **原因**：`</div>` の過不足（切り貼り時に発生しやすい）
- **確認方法**：
  ```python
  import re
  with open('file.html') as f: src = f.read()
  chunk = re.sub(r'<script.*?</script>', '', src[src.find('id="tab-seal"'):src.find('<!-- /tab-seal -->')+20], flags=re.DOTALL)
  print(len(re.findall(r'<div[\s>]', chunk)), chunk.count('</div>'))  # 一致すればOK
  ```
- **修正手順**：各サブタブ区間をdepth追跡して不足/余分な `</div>` を特定

### 3. HTML編集後の確認スクリプト（必ず実行）
```python
import re
with open('Mechanical_Tools_1_XX.html') as f: src = f.read()
for label, tag1, tag2 in [
    ('tab-seal',   'id="tab-seal"',   '<!-- /tab-seal -->'),
    ('tab-flange', 'id="tab-flange"', '<!-- /tab-flange -->')]:
    chunk = re.sub(r'<script.*?</script>', '', src[src.find(tag1):src.find(tag2)], flags=re.DOTALL)
    o = len(re.findall(r'<div[\s>]', chunk))
    c = chunk.count('</div>')
    print(f'{label}: <div>={o} </div>={c} {"OK" if o==c else "NG 差="+str(o-c)}')
```

---

## バージョン履歴

| ver | 日付 | 主な変更 |
|---|---|---|
| 1.50 | 2026-03-30 | 重量計算タブ追加（10断面 × 6材質・材質比較グラフ） |
| 1.51 | 2026-04-07 | Oリング/シールタブ新設、配管フランジタブ新設 |
| 1.52 | 2026-04-08 | S系・P系大サイズ追加、オイルシール呼び番号体系追加、Oリング種別早見表追加、div閉じタグバグ修正 |

---

## 今後の追加候補

- [ ] 配管フランジ断面SVG（4カテゴリ×1枚ずつ、カテゴリ選択時に切り替え）
- [ ] Oリングサブタブ：圧縮率計算からOリング溝寸法タブへの逆引きリンク
- [ ] フランジタブ：締め付けトルク計算（ボルト径・本数・摩擦係数入力）
- [ ] 電気タブ（ブレーカー選定・電線太さ）との統合

---

## 開発スタンス

- ダークUI・JetBrains Mono + Noto Sans JP を統一。
- 単一HTMLファイル・オフライン動作が絶対条件。
- 左パネルで絞り込み・右パネルで常時表示の2カラム構成を基本とする。
- テーブル行数が多いときはスクロール（`max-height` + `overflow-y: auto`）。
- `panel-left` / `panel-right` / `two-panel` / `stab-content` などのクラスは既存から流用。
- 新しいサブタブを追加するときはボタンid / コンテンツidの命名規則に注意（上記参照）。
