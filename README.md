# 私のポートフォリオサイト プロジェクト

このプロジェクトは、個人の作品、解説記事、プロフィールなどを発信するためのポートフォリオサイトです。静的サイトジェネレーター Hugo を使用して構築します。

## サイトの目的

- 自身の制作物（[Resonite 関連の作品など、具体的に記載]）を紹介する。
- 技術的な知見や Tips などの解説記事を投稿する。
- プロフィールや活動内容を発信する。
- YouTube チャンネルや各種 SNS、オンラインショップなどへのハブとなる。

## 主な機能・デザイン要件

- **メインページ:**
  - ヘッダーにプロフィール画像、短い自己紹介、各種 SNS・お問い合わせ等へのアイコンリンクを表示。
  - 記事絞り込み用のタグ一覧（例: 作ったもの、解説記事、動画）を配置。
  - 記事をカード形式で一覧表示（デフォルトは全記事、タグクリックで絞り込み）。
    - カードデザイン: 正方形に近い形。上半分に 16:9 サムネイル、下半分にタイトル、短い紹介文、タグ。
    - レイアウト: PC/タブレットで 4 カラム、スマートフォンで 2 カラム。
- **個別記事ページ:**
  - タイトル、サムネイル、リード文を表示後、本文（画像、動画、外部リンクなどを自由に配置）。
  - YouTube 動画、Booth 商品ページ、Twitter(X)投稿などの外部コンテンツ埋め込みに対応（ショートコードで拡張予定）。
  - コメント機能なし、サイドバーなしのシンプルなデザイン。
- **レスポンシブデザイン:** PC、タブレット、スマートフォン各デバイスに対応。
- **フッター:** コピーライト表記、プライバシーポリシーへのリンク、SNS リンク。
- **フォント:** 無難なゴシック系（例: Noto Sans JP）。

## 技術スタック

- **静的サイトジェネレーター:** Hugo
- **CSS フレームワーク/設計:** Tailwind CSS (導入予定)
- **バージョン管理:** Git, GitHub
- **エディタ:** VSCode
- **記事作成:** Markdown

## プロジェクト構造（主要なもの）

markn-homepage/
├── archetypes/ # Markdown ファイルのテンプレート (default.md)
├── content/ # サイトのコンテンツ
│ └── posts/ # 記事を格納 (my-first-post.md)
├── layouts/ # サイトのテンプレートファイル（HTML）
│ ├── \_default/ # デフォルトのテンプレート (baseof.html, single.html)
│ ├── partials/ # ヘッダー、フッターなどの部分テンプレート (header.html, footer.html)
│ └── index.html # ホームページのテンプレート
├── static/ # 画像、CSS（手動配置の場合）などの静的ファイル
├── public/ # (Git 管理外) Hugo が生成する公開用ファイル
├── resources/ # (Git 管理外) Hugo Pipes が生成するキャッシュファイル
├── hugo.toml # Hugo の設定ファイル
├── .gitignore # Git で無視するファイルを指定
└── README.md # このファイル

## 開発環境セットアップとコマンド

### 前提条件

- Git がインストールされていること。
- Hugo がインストールされていること。([Hugo 公式サイト](https://gohugo.io/installation/) 参照)
- Node.js と npm がインストールされていること (Tailwind CSS 導入に必要)。
- 開発環境: Windows, VSCode

### セットアップ手順（初回のみ）

1.  このリポジトリをクローン（または既存のフォルダで `git init`）。
    ```bash
    git clone [リポジトリURL]
    cd markn-homepage
    ```
2.  ([Tailwind CSS 導入後] 依存パッケージのインストール)
    ```bash
    npm install
    ```

### よく使うコマンド

- **Hugo ローカルサーバー起動:**

  ```bash
  hugo server -D
  ```

  (`-D` は下書き状態の記事も表示するオプションです。ブラウザで `http://localhost:1313/` を開くと確認できます。)

- **静的ファイルのビルド:**

  ```bash
  hugo
  ```

  (公開用のファイルが `public` フォルダ（デフォルト）に生成されます。)

- **新しい記事の作成:**
  ```bash
  hugo new posts/新しい記事のファイル名.md
  ```

## 開発タスク

プロジェクトの進行状況: ★ 完了 ☆ 未着手 ◎ 進行中

### 1. Hugo プロジェクト初期設定 (★)

    ★ Hugoインストール
    ★ プロジェクトフォルダ作成とGitリポジトリ初期化
    ★ GitHubリポジトリとの連携
    ★ Hugoサイト雛形作成 (`hugo new site . --force`)
    ★ `.gitignore` ファイル作成と設定
    ★ `hugo.toml` 初期設定 (baseURL, languageCode, title)

### 2. 基本 HTML テンプレート作成 (★)

    ★ ベーステンプレート作成 (`layouts/_default/baseof.html`)
        ★ HTML5基本構造、metaタグ、タイトル設定
        ★ `header` パーシャル呼び出し
        ★ `main` ブロック定義
        ★ `footer` パーシャル呼び出し
    ★ ヘッダーパーシャル作成 (`layouts/partials/header.html`) (仮の内容)
    ★ フッターパーシャル作成 (`layouts/partials/footer.html`) (仮の内容)
    ★ ホームページテンプレート作成 (`layouts/index.html`) (仮の内容)

### 3. コンテンツ作成と表示 (★)

    ★ 最初の記事作成 (`content/posts/my-first-post.md`)
        ★ フロントマター設定 (title, date, draft: false, thumbnail, excerpt, tags)
        ★ Markdownで本文記述
    ★ 個別記事ページテンプレート作成 (`layouts/_default/single.html`)
        ★ `baseof.html` 継承
        ★ タイトル、投稿日、タグ表示
        ★ サムネイル、紹介文表示 (フロントマターから)
        ★ 本文 (`.Content`) 表示
    ★ ローカルサーバーでの表示確認

### 4. スタイリング (Tailwind CSS 導入) (☆)

    ☆ Node.jsとnpmのインストール確認
    ☆ プロジェクトへのTailwind CSSインストール
        ☆ `npm init -y` (package.json作成)
        ☆ `npm install -D tailwindcss postcss autoprefixer`
    ☆ Tailwind CSS設定ファイル生成 (`npx tailwindcss init -p`)
    ☆ `tailwind.config.js` の設定 (contentパスの指定)
    ☆ HugoでTailwind CSSを処理するための設定
        ☆ `assets/css/tailwind.css` (または `main.css`など) ファイル作成と`@tailwind`ディレクティブ記述
        ☆ `hugo.toml` に PostCSS の設定を追記 (または `postcss.config.js` があればそちらで)
        ☆ `baseof.html` で生成されたCSSファイルを読み込む設定
    ☆ 動作確認: 簡単なTailwindクラスをテンプレートに適用し、表示が変わるか確認

### 5. ヘッダーデザイン実装 (☆)

    ☆ プロフィール画像表示エリア作成
        ☆ `static/images/` にプロフィール画像を配置
        ☆ `header.html` で画像を表示
    ☆ 短い自己紹介文表示エリア作成
    ☆ 各種SNS・お問い合わせ等へのアイコンリンク表示エリア作成
        ☆ Font Awesome や SVG アイコンの利用検討
        ☆ リンク先URLを `hugo.toml` の `params` などで管理することも検討
    ☆ 記事絞り込み用タグ一覧表示エリア作成
        ☆ タグ一覧の取得と表示ロジック (`header.html` または専用パーシャル)
        ☆ タグクリック時の動作（タグ別ページへの遷移）

### 6. ホームページ（記事一覧）デザイン実装 (☆)

    ☆ `layouts/index.html` を編集
    ☆ 記事カードのHTML構造作成
        ☆ サムネイル表示エリア (16:9)
        ☆ タイトル表示エリア
        ☆ 短い紹介文表示エリア (`.Params.excerpt`)
        ☆ タグ表示エリア
    ☆ 記事一覧をループで取得し、カードを動的に生成 (`range .Site.RegularPages.ByDate.Reverse` など)
    ☆ CSS Grid または Flexbox を使用したカラムレイアウト実装
        ☆ PC/タブレット: 4カラム
        ☆ スマートフォン: 2カラム
    ☆ レスポンシブ対応の調整

### 7. 個別記事ページデザイン実装 (☆)

    ☆ `layouts/_default/single.html` のスタイリング
    ☆ タイトル、メタ情報（日付、タグ）の見た目調整
    ☆ サムネイル、紹介文の表示調整
    ☆ 本文エリア (`.post-content`) のスタイリング
        ☆ 見出し、段落、リスト、画像などの基本的なMarkdown要素の表示調整
        ☆ `figure` タグ（画像とキャプション）のスタイリング（もしあれば）

### 8. フッターデザイン実装 (☆)

    ☆ `layouts/partials/footer.html` のスタイリング
    ☆ コピーライト表記の調整
    ☆ プライバシーポリシーページへのリンク作成と配置
    ☆ SNSリンクの再配置（ヘッダーと共通化も検討）

### 9. 基本的なショートコード作成 (☆)

    ☆ YouTube動画埋め込み用ショートコード (`layouts/shortcodes/youtube.html`)
    ☆ 画像表示用ショートコード（キャプション付きなど、必要であれば） (`layouts/shortcodes/figure.html` など)
    ☆ Booth商品ページやTwitter投稿の埋め込み用ショートコード検討・作成（oEmbedや公式埋め込みコード利用）

### 10. コンテンツ拡充と調整 (☆)

    ☆ プロフィール詳細ページ作成（必要であれば）
    ☆ 作品紹介記事、解説記事などを複数作成
    ☆ 各記事のフロントマター（サムネイル、紹介文、タグ）を適切に設定
    ☆ `static/images/` に記事関連画像を配置
    ☆ サイト全体のナビゲーションやリンク切れがないか確認

### 11. SEO・アクセシビリティ基本対策 (☆)

    ☆ 各ページの適切な `<title>` 設定（現状でもある程度対応済み）
    ☆ meta description の設定検討（記事ごと、またはサイト全体）
    ☆ 画像の `alt` 属性の適切な設定
    ☆ セマンティックHTMLの使用確認

### 12. 公開準備と公開 (☆)

    ☆ `hugo.toml` の `baseURL` を公開用URLに設定
    ☆ レンタルサーバーへのデプロイ手順確認・実施
        ☆ `public/` フォルダの中身をアップロード
    ☆ カスタムドメインの設定（もしあれば）
    ☆ GitHub Actionsなどを使った自動デプロイの検討（任意）

---

このドキュメントはプロジェクトの進行に合わせて更新していきます。
