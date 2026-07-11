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

Hugo 製の個人ホームページ（https://markn2000.com/ 、ブログ中心）。GitHub への push をトリガーに Cloudflare Pages が自動ビルド・デプロイする。**2026-07 に全面リニューアル済み**: Tailwind/PostCSS/npm/Cloudflare Functions/GAS API は全廃され、**Hugo バイナリ1個（v0.164.0 extended に固定）で完結**する。確定仕様は `docs/redesign-spec.md`、承認済みデザインは `docs/design-mock.html` が正。

- コードは MIT ライセンスだが、**コンテンツ（画像・記事文章）はライセンス対象外**。
- 画像（webp/jpg/jpeg/png/gif）は **Git LFS** 管理（`.gitattributes`）。
- テスト・リント・フォーマッタは未設定。品質担保は Hugo のビルド成功可否＋ドラフトのスタイルガイド記事（`/posts/0000-01-01-styleguide/`、全埋め込み・組版を網羅）の表示確認。
- `static/koerec/` は別リポジトリで管理・デプロイされており、このリポジトリでは何もしない（`.gitignore` 除外を維持）。
- Hugo バイナリはローカルでは `bin/hugo.exe`（gitignore対象）、Cloudflare Pages では環境変数 `HUGO_VERSION=0.164.0`。

## よく使うコマンド

```bash
./bin/hugo.exe server -D                          # ローカル開発サーバー (http://localhost:1313/、ドラフト含む)
./bin/hugo.exe server -D --bind 0.0.0.0           # スマホ実機確認用 (同一Wi-Fiから http://<PCのIP>:1313/)
./bin/hugo.exe --gc --minify                      # 本番ビルド (public/ に出力)
./bin/hugo.exe new content posts/<フォルダ名>/index.md   # 新規記事作成 (archetypes/default.md がテンプレート)
```

- 記事フォルダ名は `YYYY-MM-DD-slug` 形式の Page Bundle（`index.md` + サムネイル + 画像を同フォルダに置く）。
- OGP/oEmbed はビルド時に取得するため、フルビルドにはネット接続が必要（失敗時はフォールバックカードでビルドは落ちない）。

## アーキテクチャ

ビルド時のデータフロー: `content/posts/<slug>/index.md` → `layouts/` の Go テンプレートで HTML 生成 → `public/` を Cloudflare Pages が配信。テンプレートは Hugo v0.146+ の新構造（`layouts/baseof.html` + `_partials/` + `_markup/`）。

- **記事フォーマット**: 純粋 Markdown。**前後に空行のある単独行URL**がビルド時に自動変換される（YouTube→ファサード埋め込み、X→oEmbedで静的引用カード、その他→OGPリンクカード）。実装は `layouts/_partials/content-embeds.html`（`.Content` 後処理で `<p><a href=URL>URL</a></p>` 形の段落のみ置換）+ `_partials/embeds/`（youtube / x-card / link-card / meta）。
- **画像・OGPの自己配信**: OGP画像（正方形Smartクロップ）・YouTubeサムネ・faviconはビルド時に `resources.GetRemote` で取得しWebP化して自サイトから配信。キャッシュは永続化せず毎ビルド再取得（仕様決定）。
- **ページ構成**: トップ `layouts/home.html`（ヒーロー→ピックアップ `pickup: true` →タグ棚 `params.home.shelves` →最新記事。トップのみヘッダーバー非表示）。記事一覧 `section.html`（検索+タグチップ+12件ページネーション。検索インデックスは `section.json` が `/posts/index.json` を生成）。記事 `posts/page.html`（タイトルカード+折りたたみ/追従目次+本文カード+シェア+seriesナビ+関連6件）。
- **前後記事ナビ**: frontmatter の `series` が同じ記事を日付順で自動接続。
- **CSS**: `assets/css/` の番号プレフィックス付きファイル（00-tokens / 10-base / 20-layout / 30-components/ / 40-syntax）を Hugo Pipes で結合・圧縮・fingerprint。色・余白等は必ず `00-tokens.css` のカスタムプロパティ経由（ダークモード追加用スロットあり）。
- **JS**: `assets/js/site.js`（vanilla、依存ゼロ）: 検索絞り込み・コードコピー・リンクコピー・YouTubeファサード・TOC scrollspy・トップへ戻る。
- **レンダーフック**: `_markup/render-image.html`（ページリソースをWebP化、title付きは figure+figcaption）、`_markup/render-codeblock.html`（コピーボタン付きコードブロック）。
- **SEO/OGP**: `_partials/head.html`（OGP画像は thumbnail → サイトデフォルトの優先順、JSON-LD、タクソノミーは noindex）。RSSは `home.rss.xml` で description のみ配信。
- **設定**: `hugo.toml`（`pagination.pagerSize=12`、関連記事設定、`enableGitInfo=true`、`[params.home]` にピックアップ/棚の設定、`[[params.sns]]` にSNSリンク一覧）。
- **デプロイ**: CI 設定なし。Cloudflare Pages の GitHub 連携が `HUGO_VERSION=0.164.0` でビルド。リダイレクトは `static/_redirects`（`/resonite/*` の301を維持）。
- **移行の記録**: 旧ショートコード等からの一括変換は `scripts/convert-articles.mjs`（2026-07 実行済み、記録として保存）。
