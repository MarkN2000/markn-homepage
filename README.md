# markn-homepage (Hugoサイト)

これは、Hugoを使用して構築された個人ホームページのプロジェクトです。Tailwind CSS を使用してスタイリングを行っています。
コンテンツはMarkdownファイルで直接管理し、GitHubにプッシュすることでCloudflare Pagesを通じてデプロイされます。

## サイト情報

* **サイトURL:** `https://markn2000.com/` (本番環境)

* **開発用デプロイURL:** `https://markn-homepage.pages.dev/` (Cloudflare Pagesによるプレビュー/ステージング環境)

* **技術スタック:**

  * 静的サイトジェネレーター: Hugo

  * CSSフレームワーク: Tailwind CSS

  * ホスティング＆デプロイ: Cloudflare Pages

  * バージョン管理: GitHub

## コンテンツ管理

記事やその他のコンテンツは、`content/` ディレクトリ内のMarkdownファイル (`.md`) を直接編集します。
VSCodeなどのテキストエディタで編集後、変更をGitでコミットし、GitHubリポジトリにプッシュすることで、Cloudflare Pagesが自動的にサイトをビルド・デプロイします。

新しい記事を作成する際は、`archetypes/default.md` をテンプレートとして利用できます。
コマンドラインから新しい記事を作成する場合:

```
hugo new content posts/新しい記事のフォルダ名/index.md

```

または

```
hugo new posts/新しい記事のファイル名.md

```

(Page Bundle形式を推奨する場合は前者)

## 開発環境

* **静的サイトジェネレーター**: Hugo (バージョンはCloudflare Pages環境変数 `HUGO_VERSION` で指定)

* **CSSフレームワーク**: Tailwind CSS

* **パッケージ管理**: npm (Node.js) (主にTailwind CSSビルド用 `package.json` 参照)

### ローカル開発サーバー起動

以下のコマンドでローカル開発サーバーを起動し、変更をリアルタイムでプレビューできます。

```
npm run dev
# または
hugo server -D --disableFastRender

```

ブラウザで `http://localhost:1313/` にアクセスしてください。

### ビルド

本番環境向けのファイルを生成する場合は、以下のコマンドを実行します。
生成されたファイルは `public/` ディレクトリに出力されます。

```
npm run build
# または baseURL を明示的に指定する場合
hugo --gc --minify --baseURL "[https://markn2000.com/](https://markn2000.com/)"

```

## 今後の予定 (例)

* コンテンツの拡充

* パフォーマンスの最適化

* さらなるデザイン改善
