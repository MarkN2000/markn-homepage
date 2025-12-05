# markn-homepage

これは、Hugoを使用して構築された個人ホームページのプロジェクトです。Tailwind CSS を使用してスタイリングを行っています。
コンテンツはMarkdownファイルで直接管理し、GitHubにプッシュすることでCloudflare Pagesを通じてデプロイされます。

## コード・コンテンツの二次利用について

* **このサイトのコードの二次利用**

セキュリティ上の問題等があっても責任はおえませんが、このサイトを改造して自分のサイトを作る分には問題ありません。
ただし、画像（アイコンやチェック柄など）や記事のデータは使用しないようにしてください。
このサイトを参考にした際には私の名前かリンクなどを表示していただけると嬉しいです。（強制ではありません）

私の名前の表記：まーくん。(MarkN)

サイトのリンク：https://markn2000.com/

* **サイト内コンテンツの二次利用**

記事の文章や画像、動画などを利用する際は必ずこのサイト(`https://markn2000.com/`)が出典であるとわかるように記載してください。

## サイト情報

* **サイトURL:** `https://markn2000.com/` (本番環境)

* **開発用デプロイURL:** `https://markn-homepage.pages.dev/` (Cloudflare Pagesによるプレビュー/ステージング環境)

* **技術スタック:**

  * 静的サイトジェネレーター: Hugo

  * CSSフレームワーク: Tailwind CSS

  * ホスティング＆デプロイ: Cloudflare Pages

  * バージョン管理: GitHub

  * OGP取得API: Cloudflare Pages Functions (Node.jsランタイム)
  
  * クライアントサイドスクリプト: JavaScript (動的リンクカード生成)

## コンテンツ管理

記事やその他のコンテンツは、`content/` ディレクトリ内のMarkdownファイル (`.md`) を直接編集します。
VSCodeなどのテキストエディタで編集後、変更をGitでコミットし、GitHubリポジトリにプッシュすることで、Cloudflare Pagesが自動的にサイトをビルド・デプロイします。

新しい記事を作成する際は、`archetypes/default.md` をテンプレートとして利用できます。
コマンドラインから新しい記事を作成する場合:

```
hugo new content posts/新しい記事のフォルダ名/index.md

```
(Page Bundle形式を推奨)

## 開発環境

* **静的サイトジェネレーター**: Hugo (バージョンはCloudflare Pages環境変数 `HUGO_VERSION` で指定)

* **CSSフレームワーク**: Tailwind CSS

* **パッケージ管理**: npm (Node.js) (主にTailwind CSSビルド用 `package.json` 参照)

ローカルAPIテスト: Cloudflare Pages Functionsのローカル開発には wrangler CLI が利用できますが、現在の構成ではクライアントJavaScriptから /api/fetch-metadata を呼び出すため、Hugoサーバーと連携したテストが必要です。動的リンクカードの表示確認は、モックデータを使用するか（assets/js/main.js内のIS_LOCAL_DEBUGフラグとMOCK_METADATAを参照）、実際にCloudflare Pagesにデプロイして行います。

### ローカル開発サーバー起動

以下のコマンドでローカル開発サーバーを起動し、変更をリアルタイムでプレビューできます。

```

hugo server -D

```

ブラウザで `http://localhost:1313/` にアクセスしてください。

### ビルド

本番環境向けのファイルを生成する場合は、以下のコマンドを実行します。
生成されたファイルは `public/` ディレクトリに出力されます。

```

hugo --gc --minify

```