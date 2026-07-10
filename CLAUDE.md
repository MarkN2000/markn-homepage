# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 基本ルール

- **ユーザーへの返答は必ず日本語で行うこと。**
- コードは **DRY 原則・SOLID 原則** を意識して設計・実装すること。
- **初回リリース前のため、後方互換を保つ必要はない。** 互換レイヤーや移行コードを積み重ねるのではなく、仕様そのものを新しい形に書き換え、リリース時点でできるだけきれいなコードにする。開発中のマイグレーション追加は極力避ける。

### サブエージェント活用ポリシー

メインエージェントの役割は「設計・タスク分解・サブエージェントへの委譲・成果物の監査・ユーザーへの最終報告」。トークンを消費する実作業（ファイルの読み込み・検索・実装・テスト実行など）はメインで抱え込まず、原則サブエージェントへ委譲し、必要に応じて並列実行する。上がってきた成果物は監査してから報告すること。

- サブエージェント起動時は **必ず `model` を明示する**。未指定だとメインのモデル（Fable）を継承し、利用制限を浪費するため原則禁止。
  - 定型的な調査・検索・機械的な作業 → `sonnet`
  - 数値計算のコアや難しいデバッグなど高難度タスク → `opus`
  - 考慮事項の多い複雑な判断・重要な意思決定 → `fable`
- `subagent_type: "fork"` はモデル指定を無視して Fable を継承するため使わない。

## プロジェクト概要

Hugo + Tailwind CSS で構築された個人ホームページ（https://markn2000.com/ 、ブログ中心）。GitHub への push をトリガーに Cloudflare Pages が自動ビルド・デプロイする。npm は Tailwind のビルド（PostCSS）にのみ使用しており、Hugo 本体は Go バイナリで npm 非依存。

- コードは MIT ライセンスだが、**コンテンツ（画像・記事文章）はライセンス対象外**。
- 画像（webp/jpg/jpeg/png/gif）は **Git LFS** 管理（`.gitattributes`）。
- テスト・リント・フォーマッタは未設定。品質担保は Hugo のビルド成功可否のみ。

## よく使うコマンド

```bash
hugo server -D                                # ローカル開発サーバー (http://localhost:1313/、ドラフト含む)
hugo --gc --minify                            # 本番ビルド (public/ に出力)
hugo new content posts/<フォルダ名>/index.md   # 新規記事作成 (archetypes/default.md がテンプレート)
```

- 記事フォルダ名は `YYYY-MM-DD-slug` 形式の Page Bundle（`index.md` + サムネイル + 画像を同フォルダに置く）。
- OGP 取得 API のローカルテストは wrangler が必要だが、通常は `assets/js/main.js` 内の `IS_LOCAL_DEBUG` フラグ + `MOCK_METADATA` によるモックで代替する。

## ⚠️ リニューアル仕様書と現行実装の乖離

**`docs/redesign-spec.md` はサイトリニューアルの確定仕様書だが、リニューアルは未着手。** 現行コードは旧構成（Tailwind / ショートコード / クライアント JS リンクカード / Cloudflare Functions / GAS API）のままなので、両者を混同しないこと。リニューアル作業ではこの仕様書が正となる。主な決定事項:

- SSG は Hugo 継続。Tailwind / PostCSS / npm を全廃し、素の CSS + カスタムプロパティ（デザイントークン）へ移行。JS は vanilla 最小限、Google Fonts 廃止。
- ショートコード表記を全廃し「普通の Markdown」へ。**前後に空行のある単独行 URL** をビルド時に自動変換（YouTube → ファサード埋め込み、X → ビルド時 oEmbed で静的カード化、その他 → OGP リンクカード）。
- OGP リンクカードは `resources.GetRemote` でビルド時に取得・WebP 化して**自サイトから配信**（クライアント JS・`functions/api/fetch-metadata`・GAS API は廃止）。
- 前後記事ナビは frontmatter の `series` フィールドで日付順に自動接続する方式へ（`prev_post_path`/`next_post_path` の手書きを廃止）。
- URL 構造（`/posts/<slug>/`, `/tags/<tag>/`）は SEO のため維持。
- 既存約35記事はスクリプトで一括変換して移行。

## アーキテクチャ（現行実装）

ビルド時のデータフロー: `content/posts/<slug>/index.md` → `layouts/` の Go テンプレートで HTML 生成 → `public/` を Cloudflare Pages が配信。

- **ページ生成**: トップは `layouts/index.html`（タグ絞り込み UI + `partials/card.html` のカードグリッド、12件ページネーション）。記事詳細は `layouts/posts/single.html`（`_default/baseof.html` を継承。前後記事ナビ・X シェア・関連記事6件 `Related` を含む）。タグ一覧は `_default/taxonomy.html`。
- **前後記事ナビ**: frontmatter の `prev_post_path` / `next_post_path` を手動記述し、`single.html` が `site.GetPage` で解決する（→ リニューアルで `series` 方式に変更予定）。
- **画像処理**: `layouts/_default/_markup/render-image.html`（render hook）が Markdown の `![alt](path)` を横取りし、ページリソースなら自動で WebP 化・リサイズ。カードのサムネイルは `partials/card.html` 内で `Fill "352x198 Center webp q40"` 生成。
- **アセットパイプライン**: CSS は `assets/css/main.css`（Tailwind v4 の CSS ファースト設定。`tailwind.config.js` は存在せず `@import "tailwindcss"` + `@theme {}`）を `partials/site_head.html` で `css.PostCSS | resources.Minify | resources.Fingerprint`。JS は `assets/js/main.js` を `baseof.html` で `js.Build` 経由。
- **動的リンクカード**: 記事内の `<a class="dynamic-link-card">` を `assets/js/main.js` が IntersectionObserver で遅延検出し、`/api/fetch-metadata`（Cloudflare Pages Function: `functions/api/fetch-metadata.js`、`HTMLRewriter` で OG タグ抽出）から取得してカード化。`<noscript>` フォールバックあり。
- **ショートコード**: `layouts/shortcodes/` に `youtube` / `figure` / `link-card` / `ogp-link-card`。※`{{< x >}}` は archetype・仕様書に記載があるが `x.html` が存在しない（実装漏れ）。
- **SEO/OGP**: `partials/site_head.html` が thumbnail/hero → サイトデフォルト `og_image` の優先順で OGP 画像を決定。タクソノミーページは自動で `noindex, follow`。
- **設定**: `hugo.toml`（`baseURL`、`pagination.pagerSize = 12`、関連記事の閾値、`enableGitInfo = true` で lastmod を git から取得、`ogpApiUrl` は現行 GAS の外部 API）。
- **デプロイ**: CI 設定なし。Cloudflare Pages の GitHub 連携が `HUGO_VERSION` 環境変数指定でビルド。リダイレクトは `static/_redirects`。`static/koerec/` は別リポジトリのため `.gitignore` で除外（ローカル実体なし）。
