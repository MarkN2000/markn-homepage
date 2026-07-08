# サイトリニューアル仕様書

markn2000.com を一から作り直すための設計ドキュメント。
(ステータス: ドラフト / 議論中)

## 1. リニューアルの目的

- 記事を**普通のMarkdownファイル**として書けるようにする(Hugoショートコード等の専用表記を全廃)
- スマホでも読みやすいレスポンシブデザイン
- 読み込み・動作の軽いサイト(クライアントJSを最小化)
- **何年も保守できる**構成(依存関係を最小化し、放置耐性を最大化)
- デザインは zenn.dev を参考にしたカード型・固定ライトテーマ

## 2. 技術選定

| 項目 | 選定 | 理由 |
|---|---|---|
| SSG | **Hugo**(継続) | 単一バイナリで動作し npm 依存ゼロにできる。バージョンを固定すれば何年後でも同じビルドを再現できる。画像処理・シンタックスハイライト・リモート取得(`resources.GetRemote`)を内蔵 |
| CSS | **素のCSS**(Tailwind廃止) | npm 依存の完全排除。カスタムプロパティによるデザイントークン方式で数百行に収める。デザインモックで品質を確認済み |
| JS | **vanilla JSのみ・最小限** | モバイルメニュー、リンクコピー、記事検索の絞り込み程度。フレームワーク・ライブラリなし |
| フォント | **システムフォント** | Webフォントを読み込まない(軽量化)。ヒラギノ / Noto Sans JP / Yu Gothic のスタック |
| ホスティング | Cloudflare Pages(継続) | Pages Functions は廃止(→ §5 OGPカード) |

### 保守方針

- Hugo のバージョンをリポジトリに明記して固定する(`.hugo-version` 等 + CI での指定)
- `package.json` / `node_modules` を撤廃し、ビルドは「Hugo バイナリ1個」で完結させる
- ビルド手順を README に1コマンドで書ける状態を維持する

## 3. 記事フォーマット(純粋Markdown)

記事は front matter + GitHub でそのまま読める Markdown のみで構成する。

```yaml
---
title: "記事タイトル"
date: 2026-01-01T00:00:00+09:00
tags: ["Resonite", "作ったもの"]
description: "OGP・一覧に使う説明文"
thumbnail: "thumbnail.webp"   # 任意。なければデフォルトのカバー表示
emoji: "⚡"                    # 任意。thumbnail がない場合のカバー絵文字
draft: false
---
```

### 専用表記の置き換え規則

| 現行(廃止) | 新しい書き方 | 実装 |
|---|---|---|
| `{{</* youtube ID */>}}` | YouTube の URL を行に単独で貼る | render hook で軽量埋め込み(クリックまで iframe を読まないファサード方式)に変換 |
| `{{</* x ... */>}}` | ポストの URL を行に単独で貼る | render hook で静的カードに変換(widgets.js は読み込まない) |
| OGPリンクカード | 任意の URL を行に単独で貼る | ビルド時に OGP 情報を取得して静的カード化(§5) |
| `{{</* figure src=... title=... */>}}` | `![alt](画像 "キャプション")` 標準記法 | render hook で `<figure>` + `<figcaption>` に変換 |
| (新規) メッセージボックス | `> [!NOTE]` / `> [!WARNING]` 等の GFM アラート | render hook で装飾(GitHub でもそのまま表示される標準記法) |

変換ルール: 「リンクテキストが URL そのもの(=裸のURL・オートリンク)」の場合のみカード化する。
`[テキスト](URL)` と書いた通常のインラインリンクは変換しない。

### 既存記事の移行

- `{{</* youtube ID */>}}` → `https://www.youtube.com/watch?v=ID` に一括変換(27箇所)
- `{{</* figure */>}}` → 標準画像記法に一括変換(18箇所)
- `{{</* x */>}}` → URL 記法に変換(1箇所)
- 変換はスクリプトで機械的に実施し、全記事の表示を目視確認する

## 4. デザイン

デザインモック(素のCSSで作成・承認済み)に準拠する。

- **固定ライトテーマ**(Zenn と同方針。ダークモードは実装しない)
  - ただし色はすべてカスタムプロパティで定義し、将来のテーマ追加を容易にしておく
- 水色基調 + タータン柄をアクセントに使用(ヘッダー上部の帯・ロゴマーク。CSSグラデーションで描画し画像を使わない)
- トップページ: カードグリッド(3列 → 2列 → 1列のレスポンシブ)、タグ絞り込み、ページネーション
- 記事ページ: デスクトップは本文 + 追従目次の2カラム、モバイルは1カラム
- カードのカバーは thumbnail 画像、なければ emoji + 淡いグラデーション

### デザイントークン(モックより)

```css
--ground:#EDF4F8;  --surface:#FFFFFF;  --ink:#243642;
--muted:#63798A;   --accent:#2AA3D4;   --accent-deep:#1479AC;
--accent-soft:#E3F2FA;  --border:#DAE6ED;  --code-bg:#1C2B35;
```

## 5. OGPリンクカード(方式変更)

- **現行**: 閲覧時にクライアントJSが Cloudflare Pages Function(`/api/fetch-metadata`)を呼んで描画
- **新方式**: **ビルド時**に Hugo の `resources.GetRemote` でリンク先の OGP 情報を取得し、静的HTMLとして出力
  - 表示は即時・レイアウトシフトなし・クライアントJS不要
  - 取得結果は Hugo のキャッシュに保存(TTL 長め)。情報の更新は再ビルド時
  - 取得失敗時はドメイン名のみのシンプルなカードにフォールバック
- これに伴い `functions/` ディレクトリと GAS の `ogpApiUrl` を**廃止**

## 6. 機能一覧

### 引き継ぐ機能

- タグ(taxonomy ページ含む)
- 関連記事
- 記事ごとの OGP メタタグ / デフォルト OGP 画像
- シェアボタン(X、リンクコピー)
- 画像の WebP 自動変換・リサイズ(render hook)
- ビルド時シンタックスハイライト(Chroma / JS不要)
- RSS、sitemap、robots.txt、404ページ
- プライバシーポリシーページ
- git 履歴による lastmod 自動設定

### 新規機能

- **記事検索**: ビルド時にタイトル・タグ・説明文の JSON インデックスを出力し、
  数十行の vanilla JS でインクリメンタル絞り込み(全文検索はしない。将来必要なら Pagefind を後付け可能)
- **読了時間の目安表示**
- **GFM アラート**(`> [!NOTE]` 等)
- **YouTube 軽量埋め込み**(サムネイルのみ先行表示、クリックで iframe 読み込み)

### 廃止するもの

- Hugo ショートコード全般(youtube / figure / x / ogp-link-card / link-card)
- クライアントサイドの OGP 取得 JS + Cloudflare Pages Function
- Tailwind CSS / PostCSS / npm 依存一式

## 7. ディレクトリ構成(案)

```
markn-homepage/
├── hugo.toml
├── content/
│   ├── posts/<記事スラッグ>/index.md + 画像   # 現行のページバンドル形式を継続
│   └── privacy-policy.md
├── layouts/
│   ├── _default/ (baseof, list, single, taxonomy, 404)
│   ├── _default/_markup/  # render hooks(image, link ← URL→カード変換の本体)
│   ├── partials/
│   └── index.html
├── assets/
│   ├── css/main.css       # 素のCSS(トークン + コンポーネント)
│   └── js/main.js         # 最小限のvanilla JS
├── static/
└── docs/redesign-spec.md  # このドキュメント
```

## 8. 移行手順(案)

1. 新テーマ(layouts / css / js)をゼロから実装
2. render hooks(URL→カード変換、画像、アラート)を実装
3. 既存記事のショートコードをスクリプトで一括変換
4. 全35記事の表示を確認
5. Tailwind / npm / functions を撤去
6. Cloudflare Pages のビルド設定を更新して切り替え

## 9. 未決事項

- [ ] Hugo の固定バージョン(最新安定版を採用予定)
- [ ] トップページの構成詳細(ヒーロー部に何を置くか、About への導線)
- [ ] X 埋め込みの静的カードのデザイン
- [ ] 既存 URL 構造を維持するか(SEO 的には維持推奨: `/posts/<slug>/`)
- [ ] OGP カード取得のキャッシュ TTL
