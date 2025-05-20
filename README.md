# markn-homepage (Hugoサイト)

これは、Hugoを使用して構築された個人ホームページのプロジェクトです。Tailwind CSS を使用してスタイリングを行っています。
コンテンツ管理を容易にするために Decap CMS (旧 Netlify CMS) を導入し、ホスティングを Cloudflare Pages に移行する計画で作業を進めています。

## サイト情報

- **サイトURL (移行後予定):** `https://markn2000.com/`
- **開発用デプロイURL:** `https://markn-homepage.pages.dev/`
- **技術スタック (移行後予定):**
    - 静的サイトジェネレーター: Hugo
    - CSSフレームワーク: Tailwind CSS
    - コンテンツ管理: Decap CMS (GitHub バックエンド、PKCE認証フロー)
    - ホスティング＆デプロイ: Cloudflare Pages
    - バージョン管理: GitHub

## 最近の主な更新と変更点 (2025年5月20日時点)

- **ページネーションの改良**:
    - ページネーションボタンに背景色を追加。
    - ページネーション全体を中央揃えに調整。
    - (`assets/css/main.css` にて対応)
- **Decap CMS 導入と認証フローの試行錯誤**:
    - **外部OAuthプロバイダ (`api.decapcms.org`) の廃止/変更**: 当初検討していた `https://api.decapcms.org/auth` を利用した外部OAuthプロバイダによる認証が、同ドメインのDNS解決不可により利用できないことが判明。
    - **Cloudflare Functions を利用した自己ホスト型認証の試行**: `i40west/netlify-cms-cloudflare-pages` のサンプルを参考に、認証用Function (`functions/api/auth.js`, `functions/api/callback.js`) を作成。アクセストークン取得までは成功するものの、ポップアップから親ウィンドウへの `postMessage` がCMS側で正しく処理されず、「Authentication successful. Please wait...」の画面で停止する問題が発生。
    - **PKCE認証フローへの移行検討**: 上記の問題と、外部プロバイダの廃止を受け、よりシンプルで推奨されるPKCE (Proof Key for Code Exchange) フローに移行する方針に変更。
        - Cloudflare Functions (`auth.js`, `callback.js`) はプロジェクトから削除。
        - GitHub OAuth App を「Public client」として再設定し、コールバックURLをCMS管理画面 (`/admin/`) に指定。
        - `static/admin/config.yml` の `backend` 設定をPKCEフロー用に変更 (`auth_type: pkce`, `app_id` を指定し、`base_url` や `auth_endpoint` を削除)。
        - `static/admin/index.html` はDecap CMS (v3.6.3固定) をCDNから読み込むシンプルな構成 (`defer` 属性付き)。
- **現状の課題 (重要)**:
    - **ローカル環境 (`hugo server -D`)**: `/admin/` にアクセスし「Login with GitHub」ボタンを押すと、**期待通りにGitHubの認証ポップアップが表示される。** `static/admin/config.yml` のPKCE設定が正しく解釈されている模様。
    - **Cloudflare Pagesデプロイ環境 (`https://markn-homepage.pages.dev/admin/`)**: ローカルと同様のPKCE設定が `config.yml` に反映されている (ブラウザから直接 `/admin/config.yml` を確認済み) にも関わらず、「Login with GitHub」ボタンを押すと、**依然として古いNetlifyの認証エンドポイント (`https://api.netlify.com/auth?...`) にリダイレクトされ、「Not Found」エラーとなる。**

## 今後の予定 (課題解決と移行完了に向けて)

1.  **Cloudflare Pages 環境での `api.netlify.com/auth` へのリダイレクト問題の解決 (最優先)**:
    * **原因の特定**:
        * デプロイされた `static/admin/config.yml` が最新であることは確認済み。
        * Cloudflare Pages のビルドキャッシュが影響している可能性を考慮し、もしあればキャッシュクリアを試す。
        * Decap CMS のスクリプト (`decap-cms.js`) が、Cloudflare Pages環境でのみ何らかの理由で古いデフォルト認証エンドポイントを優先してしまうのか、あるいは `config.yml` のPKCE設定を正しく認識できていないのかを切り分ける。
        * `markn-homepage.pages.dev` というホスト名自体が、Decap CMS内部で `site_id` として解釈され、特定のフォールバックロジックをトリガーしている可能性も探る。
    * **試行する対策**:
        * `config.yml` の `backend` セクションを、Decap CMS v3.6.3 の公式ドキュメントにあるPKCEフローの**最小限かつ正確な設定**に再度徹底的に合わせる。余計なキーは全て削除する。
        * `static/admin/index.html` で読み込むDecap CMSのCDN URLを、unpkg以外のもの (例: jsDelivr) に変更してみる、またはバージョンを微調整してみる。
        * `config.yml` に `site_url: https://markn-homepage.pages.dev` をトップレベルで追加し、挙動に変化があるか確認する。
        * それでも解決しない場合、Decap CMSのGitHubリポジトリのIssueやDiscussionsで同様の事例がないか徹底的に調査し、必要であればIssueを立ててコミュニティに助けを求める。

2.  **PKCE認証フローの完全な動作確認 (Cloudflare Pages環境)**:
    * 上記問題解決後、Cloudflare Pagesデプロイ環境の `/admin/` からGitHub認証が成功し、CMS管理画面にログインできることを確認する。
    * 記事の作成・編集・保存がGitHubリポジトリに反映され、Cloudflare Pagesで自動的にサイトが再ビルド・デプロイされる一連のフローを確認する。

3.  **カスタムドメインの設定**:
    * Cloudflare Pages の設定画面から、カスタムドメイン `https://markn2000.com/` を設定。
    * DNSレコードを適切に設定。
    * カスタムドメイン下のCMSも正しく動作することを確認。

4.  **コンテンツと設定の最終調整**:
    * `static/admin/config.yml` の `media_folder`, `public_folder`, `collections` 設定を、テスト用から本番用に最終調整。
    * Page Bundle構造における画像管理をCMSでテストし、必要に応じて設定や運用方法を調整。

5.  **レンタルサーバーからの完全移行**:
    * Cloudflare Pagesでのサイト運用が安定していることを確認後、現在のレンタルサーバーの契約を見直し、DNS設定などを整理して移行を完了する。

## 開発環境

- **静的サイトジェネレーター**: Hugo (バージョンはCloudflare Pages環境変数 `HUGO_VERSION` で指定)
- **CSSフレームワーク**: Tailwind CSS
- **パッケージ管理**: npm (Node.js) (主にTailwind CSSビルドとローカル開発スクリプト用 `package.json` 参照)

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