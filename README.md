# markn-homepage

これは、Hugoを使用して構築された個人ホームページのプロジェクトです。スタイリングは素のCSS（カスタムプロパティによるデザイントークン方式）で、npm等のパッケージ管理には依存しません。
コンテンツはMarkdownファイルで直接管理し、GitHubにプッシュすることでCloudflare Pagesを通じてデプロイされます。

## コード・コンテンツの二次利用について

このリポジトリの**コード**（テンプレート、スクリプト、CSSなど）は [MITライセンス](LICENSE) の下で提供されています。

* **このサイトのコードの二次利用**

セキュリティ上の問題等があっても責任はおえませんが、このサイトのコードを改造して自分のサイトを作る分には問題ありません。
このサイトを参考にした際には私の名前かリンクなどを表示していただけると嬉しいです。（強制ではありません）

* **サイト内コンテンツの二次利用**

**画像（アイコンやチェック柄など）や記事のデータはMITライセンスの対象外です。**
記事の文章や画像、動画などを利用する際は必ずこのサイト(`https://markn2000.com/`)が出典であるとわかるように記載してください。

私の名前の表記：まーくん。(MarkN)
サイトのリンク：https://markn2000.com/

## サイト情報

* **サイトURL:** `https://markn2000.com/` (本番環境)

* **開発用デプロイURL:** `https://markn-homepage.pages.dev/` (Cloudflare Pagesによるプレビュー/ステージング環境)

* **技術スタック:**

  * 静的サイトジェネレーター: Hugo **v0.164.0 (extended) に固定**
    - ローカル: `bin/hugo.exe`（gitignore対象。[公式リリース](https://github.com/gohugoio/hugo/releases/tag/v0.164.0)から取得）
    - Cloudflare Pages: 環境変数 `HUGO_VERSION=0.164.0` を設定すること
  * CSS: 素のCSS（`assets/css/` を Hugo Pipes で結合・圧縮。ビルドツール不要）
  * JavaScript: vanilla JS 最小限（`assets/js/site.js`。検索・コードコピー・YouTubeファサード等）
  * ホスティング＆デプロイ: Cloudflare Pages（GitHub連携の自動ビルド）
  * バージョン管理: GitHub

* **設計ドキュメント:** リニューアルの確定仕様は `docs/redesign-spec.md`、デザイン設計の経緯も `docs/redesign-spec.md` を参照。

## コンテンツ管理

記事は `content/posts/<YYYY-MM-DD-slug>/index.md`（Page Bundle形式）で管理します。テンプレートは `archetypes/default.md` です。

```
hugo new content posts/新しい記事のフォルダ名/index.md
```

* **リンクカード・埋め込み**: 前後に空行のある**単独行のURL**を書くだけで、ビルド時に自動変換されます（YouTube→軽量埋め込み、X→静的引用カード、その他→OGPリンクカード）。文中URLや `[テキスト](URL)` は普通のリンクのままです。
* **キャプション付き画像**: `![alt](画像.png "キャプション")`
* **前後記事ナビ**: frontmatter に同じ `series: "名前"` を書いた記事同士が日付順で自動接続されます。
* **トップのピックアップ**: frontmatter に `pickup: true` を書いた記事がトップページに掲載されます。
* **サムネイルなし記事**: frontmatter の `emoji: "⚡"` がカバーになります（未指定は📝）。

## 開発環境

Hugo バイナリ1個で完結します（npm / Node.js は不要）。

### ローカル開発サーバー起動

```
hugo server -D
```

ブラウザで `http://localhost:1313/` にアクセスしてください（`-D` でドラフトのスタイルガイド記事 `/posts/0000-01-01-styleguide/` も表示されます）。
スマホ実機で確認する場合は `hugo server -D --bind 0.0.0.0` で起動し、同じWi-Fi内から `http://<PCのIP>:1313/` を開きます。

### ビルド

本番環境向けのファイルを生成する場合は、以下のコマンドを実行します。
生成されたファイルは `public/` ディレクトリに出力されます。

```
hugo --gc --minify
```

※ OGPリンクカード等の情報はビルド時にリンク先へ取得に行きます（失敗してもフォールバックカードになり、ビルドは失敗しません）。
