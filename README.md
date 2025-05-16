# 私のポートフォリオサイト プロジェクト

このプロジェクトは、個人の作品、解説記事、プロフィールなどを発信するためのポートフォリオサイトです。静的サイトジェネレーター Hugo と Tailwind CSS v4 を使用して構築します。

## サイトの目的

- 自身の制作物（[Resonite 関連の作品など、具体的に記載]）を紹介する。
- 技術的な知見や Tips などの解説記事を投稿する。
- プロフィールや活動内容を発信する。
- YouTube チャンネルや各種 SNS、オンラインショップなどへのハブとなる。

## 主な機能・デザイン要件

- **全般:**
  - レスポンシブデザイン: PC、タブレット、スマートフォン各デバイスに最適化された表示。
  - フォント: 無難なゴシック系（例: Noto Sans JP）。
- **ヘッダー:**
  - ナビゲーションメニューなし。
  - 上から順に:
    1.  自身の画像と短いプロフィール（2 行程度）。
    2.  お仕事依頼・お問い合わせ等へのリンク、各種 SNS・ショップへのリンク（アイコンで小さく表示）。
    3.  記事絞り込み用のタグ一覧（例: 作ったもの、解説記事、動画など）を横に並べて表示。
- **メインページ（ホームページ）:**
  - 記事をカード形式で一覧表示（デフォルトは全記事、ヘッダーのタグクリックで絞り込み）。
  - **カードデザイン:**
    - 形状: 正方形に近い。
    - 構成: 上半分に 16:9 のサムネイル画像、下半分にタイトル、短い紹介文、その下に小さくタグを表示。
  - **カードレイアウト:**
    - PC・タブレット表示時: 4 カラムのグリッドレイアウト。
    - スマートフォン表示時: 2 カラムのグリッドレイアウト。
- **個別記事ページ:**
  - 上から順に「記事タイトル」、「サムネイル画像（カードと同じもの）」、「リード文（カードと同じもの）」を表示。
  - その下に本文エリア（見出し、段落、画像、動画、外部リンクなどを自由に配置）。
  - 外部コンテンツの埋め込み: YouTube 動画、Booth 商品ページ（大きなプレビュー付きリンク）、Twitter(X)投稿などに対応（ショートコードで拡張予定）。
  - コメント機能なし、サイドバーなしのシンプルなデザイン。
- **フッター:**
  - コピーライト表記。
  - プライバシーポリシーページへのリンク。
  - SNS へのリンク（ヘッダーと共通のものを配置）。

## 技術スタック

- **静的サイトジェネレーター:** Hugo
- **CSS フレームワーク/設計:** Tailwind CSS v4 (導入済み)
- **バージョン管理:** Git, GitHub
- **エディタ:** VSCode
- **記事作成:** Markdown

## プロジェクト構造（主要なもの）

markn-homepage/
├── archetypes/ # Markdown ファイルのテンプレート (default.md)
├── assets/
│ └── css/ # CSS ファイル (main.css)
├── content/ # サイトのコンテンツ
│ └── posts/ # 記事を格納 (my-first-post.md)
├── layouts/ # サイトのテンプレートファイル（HTML）
│ ├── \_default/ # デフォルトのテンプレート (baseof.html, single.html)
│ ├── partials/ # ヘッダー、フッターなどの部分テンプレート (header.html, footer.html, css.html)
│ └── index.html # ホームページのテンプレート
├── node_modules/ # (Git 管理外) npm パッケージ
├── static/ # 画像などの静的ファイル
├── public/ # (Git 管理外) Hugo が生成する公開用ファイル
├── resources/ # (Git 管理外) Hugo Pipes が生成するキャッシュファイル
├── hugo.toml # Hugo の設定ファイル
├── package.json # npm パッケージ管理ファイル
├── package-lock.json # npm パッケージロックファイル
├── tailwind.config.js # Tailwind CSS 設定ファイル
├── .gitignore # Git で無視するファイルを指定
└── README.md # このファイル

## 開発環境とコマンド

### 前提条件

リポジトリをクローンまたはダウンロードした後、開発を開始する前に以下がシステムにインストールされていることを確認してください。

- Git
- Hugo (extended version 推奨) - [Hugo 公式サイト](https://gohugo.io/installation/)
- Node.js と npm (Tailwind CSS v4 に必要)

開発は主に Windows 上の VSCode で行うことを想定しています。

### プロジェクト設定の概要

このプロジェクトでは、Hugo と Tailwind CSS v4 を連携させるために以下の設定が行われています。

1.  **Tailwind CSS のインストール:**
    `package.json` に基づき `npm install` を実行することで、`tailwindcss` と `@tailwindcss/cli` がインストールされます。
2.  **Tailwind CSS 設定 (`tailwind.config.js`):**
    プロジェクトルートの `tailwind.config.js` で、HTML や Markdown ファイルなどをスキャン対象として指定しています。
    ```javascript
    // tailwind.config.js
    module.exports = {
      content: [
        "./hugo_stats.json",
        "./layouts/**/*.html",
        "./content/**/*.md",
        "./assets/js/**/*.js",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    ```
3.  **メイン CSS (`assets/css/main.css`):**
    Tailwind CSS のコアスタイルをインポートしています。
    ```css
    /* assets/css/main.css */
    @import "tailwindcss";
    ```
4.  **Hugo 設定 (`hugo.toml`):**
    `buildStats = true` を設定し、Tailwind CSS が Hugo のクラス使用状況をスキャンできるようにしています。
5.  **Hugo テンプレートでの CSS 処理 (`layouts/partials/css.html`):**
    Hugo Pipes の `css.TailwindCSS` 関数を利用して、`main.css` を処理し、サイトに適用しています。これは `layouts/_default/baseof.html` から呼び出されます。

### よく使うコマンド

- **Hugo ローカルサーバー起動:**

  ```bash
  hugo server -D
  (-D は下書き状態の記事も表示するオプションです。ブラウザで http://localhost:1313/ を開くと確認できます。)静的ファイルのビルド:hugo
  (公開用のファイルが public フォルダ（デフォルト）に生成されます。)新しい記事の作成:hugo new posts/新しい記事のファイル名.md
  ```

## プロジェクトの進捗状況

**凡例:** ★:完了　 ◎:進行中　 ☆:未着手

---

### フェーズ 1: プロジェクト基盤構築 (★ 全て完了)

★ Hugo プロジェクト初期設定 (インストール、サイト雛形、Git 連携、.gitignore、hugo.toml)
★ 基本 HTML テンプレート作成 (baseof.html, header.html, footer.html, index.html)
★ サンプルコンテンツ作成と表示 (最初の記事、個別記事ページテンプレート single.html)

### フェーズ 2: スタイリングと基本デザイン (◎ 進行中)

◎ Tailwind CSS v4 導入と設定完了
☆ ヘッダーデザイン実装 (プロフィール、SNS リンク、タグフィルター)
☆ ホームページ（記事カード一覧）デザイン実装 (カードデザイン、4 列/2 列グリッドレイアウト)
☆ 個別記事ページデザイン実装 (本文エリアの基本スタイリング)
☆ フッターデザイン実装

### フェーズ 3: 機能拡張とコンテンツ充実 (☆ 未着手)

☆ 基本的なショートコード作成 (YouTube 埋め込みなど)
☆ 記事コンテンツの追加と画像の配置
☆ プロフィールページ作成 (必要に応じて)
☆ プライバシーポリシーページ作成

### フェーズ 4: 仕上げと公開 (☆ 未着手)

☆ SEO およびアクセシビリティの基本対策 (meta タグ、alt 属性など)
☆ サイト全体の動作確認、リンクチェック
☆ 公開準備 (`baseURL`設定、ビルド) とレンタルサーバーへのデプロ
