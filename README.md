# markn-homepage (Hugoサイト)

これは、Hugoを使用して構築された個人ホームページのプロジェクトです。Tailwind CSS を使用してスタイリングを行っています。
将来的には、コンテンツ管理を容易にするために Decap CMS (旧 Netlify CMS) を導入し、ホスティングを Cloudflare Pages に移行する予定です。

## サイト情報

- **サイトURL (移行後予定):** `https://markn2000.com/`
- **技術スタック (移行後予定):**
    - 静的サイトジェネレーター: Hugo
    - CSSフレームワーク: Tailwind CSS
    - コンテンツ管理: Decap CMS
    - ホスティング＆デプロイ: Cloudflare Pages
    - バージョン管理: GitHub

## 最近の主な更新と変更点 (2025年5月時点)

- **ページネーションの改良**:
    - ページネーションボタンに背景色を追加。
    - ページネーション全体を中央揃えに調整。
    - これらの変更は `assets/css/main.css` に追記されたカスタムCSSによって実現されています。
- **Decap CMS 導入準備とローカルテスト**:
    - `static/admin/index.html` を作成し、Decap CMS のフロントエンドを読み込むように設定。
        - スクリプトタグに `defer` 属性を追加し、CMSの初期化エラー (`Cannot read properties of null (reading 'appendChild')`) を解消。
    - `static/admin/config.yml` を作成し、ローカルテスト (`local_backend: true`) およびGitHub連携のための基本的な設定（リポジトリ情報、記事コレクションの定義など）を記述。
        - 記事コレクション (`posts`) は、Page Bundle 形式 (`content/posts/記事フォルダ/index.md`) を意識した設定 (`path: "{{slug}}/index"`) を導入。
        - フロントマターのフィールド（`title`, `date`, `draft`, `tags`, `thumbnail`, `description`, `prev_post_path`, `next_post_path`, `body`）を定義。
    - `npx decap-server` と `hugo server -D` を使用したローカルでのCMS動作確認を実施。

## 今後の予定 (移行計画)

1.  **Decap CMS の GitHub 認証設定の完了**:
    * `static/admin/config.yml` から `local_backend: true` を削除（またはコメントアウト）。
    * Decap CMS のドキュメントに基づき、GitHub App または OAuth を利用した認証方法を設定。
        * GitHub App の作成と認証情報の取得。
        * `config.yml` の `backend` セクションに必要な認証情報を追記。
        * 必要に応じて、Cloudflare Pages の環境変数に認証関連の機密情報を設定。
    * CMS 管理画面 (`/admin/`) から GitHub リポジトリへの認証とアクセスが可能になることを確認。

2.  **Cloudflare Pages へのデプロイ**:
    * Hugo プロジェクト全体（`public` フォルダを除く）を GitHub リポジトリのメインブランチ (`main` または `master`) にプッシュ。
    * Cloudflare Pages で新規プロジェクトを作成し、対象の GitHub リポジトリと連携。
    * **ビルド設定**:
        * フレームワークプリセット: `Hugo`
        * ビルドコマンド: `hugo --gc --minify` (現在の `package.json` のビルドスクリプト)
        * ビルド出力ディレクトリ: `/public`
        * 環境変数:
            * `HUGO_VERSION`: 使用する Hugo のバージョン (例: `0.125.7` など最新安定版を推奨)
            * `HUGO_BASEURL`: `https://markn2000.com/` (Hugo 設定ファイルと合わせて確認)
            * その他、Decap CMS の認証に必要な環境変数があれば設定。
    * 最初のデプロイを実行し、`*.pages.dev` のURLでサイト表示と CMS の動作を確認。

3.  **カスタムドメインの設定**:
    * Cloudflare Pages の設定画面から、カスタムドメイン `markn2000.com` を設定。
    * DNS レコードを適切に設定し、ドメインが Cloudflare Pages に向くようにする。

4.  **CMS経由でのコンテンツ更新テストと本格運用**:
    * カスタムドメイン下のCMS管理画面 (`https://markn2000.com/admin/`) から記事の作成・編集・保存を実行。
    * GitHubへの自動コミット、Cloudflare Pagesでの自動ビルド＆デプロイ、公開サイトへの変更反映という一連のフローを確認。
    * Page Bundle 構造における画像管理（CMSからのアップロードと `index.md` からの相対パス参照）が意図通りに動作するか詳細にテストし、必要であれば `config.yml` の `media_folder`, `public_folder` 設定やウィジェット設定を調整。

5.  **レンタルサーバーからの完全移行**:
    * Cloudflare Pages でのサイト運用が安定していることを確認後、現在のレンタルサーバーの契約を見直し、DNS設定などを整理して移行を完了する。

## 開発環境

- **静的サイトジェネレーター**: Hugo
- **CSSフレームワーク**: Tailwind CSS
- **パッケージ管理**: npm (Node.js)

### ローカル開発サーバー起動

```bash
npm run dev
# または
hugo server -D --disableFastRender

```
ブラウザで 
http://localhost:1313/admin/
にアクセス。

```bash
npm run build
# または baseURL を明示的に指定する場合
hugo --gc --minify --baseURL "[https://markn2000.com/](https://markn2000.com/)"
```