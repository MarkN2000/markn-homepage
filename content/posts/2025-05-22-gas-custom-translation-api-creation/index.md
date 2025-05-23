---
title: "超簡単！無料で使える自分専用翻訳APIの作り方"
date: "2025-05-22T19:17:03+09:00"
draft: false
tags: ["作ったもの", "Resonite", "解説", "プログラミング"]
thumbnail: "thumbnail.webp"
thumbnail_alt: "Google Apps Scriptのロゴと、翻訳をイメージさせる吹き出しや地球儀のアイコンを組み合わせたもの。背景にうっすらとプログラムのコードが見えるデザイン"
description: "Google Apps Script(GAS)を使えば、プログラミング初心者でも無料で簡単に自分だけの翻訳APIが作れます！この記事では、その作成手順をステップバイステップで分かりやすく解説。Resonite等での活用にもおすすめです！"
prev_post_path:
next_post_path:
# foldername：2025-05-22-gas-custom-translation-api-creation
---

「自分だけの翻訳APIを、無料で簡単に作れたら便利だと思いませんか？
実はGoogleアカウントさえあれば、プログラミングの経験がない方でも、意外と手軽に自作できるんですよ。外部サービスの契約やサーバー構築といった難しそうな準備も、今回は必要ありません。

Google Apps Script (GAS) を使って、あなた専用の翻訳APIを作る手順を**超わかりやすく紹介します**。
完成したAPIは、**Resonite内での翻訳やアプリなどに組み込んだり、色々な場面でつかえますよ**。

## 完成するAPIの概要

* **呼び出し方法:** HTTP GETリクエスト
* **URL形式:** `https://script.google.com/macros/s/[あなたのデプロイID]/exec?text=翻訳したい文字列&source=翻訳元言語&target=翻訳先言語`
* **レスポンス (成功時):** 翻訳された文字列 (プレーンテキスト)
* **レスポンス (エラー時):** エラーメッセージ文字列 (プレーンテキスト)

例えば、ブラウザ以下のようなURLにアクセスすると、<br>
`https://script.google.com/macros/s/[あなたのデプロイID]/exec?text=Hello%20world&source=en&target=ja`

次のように翻訳結果が返ってきます。<br>
`こんにちは世界`

**Resoniteでの利用について**
今回作成するAPIは、「ここあさんや僕(MarkN)などが公開している翻訳機」で使われているものと互換性があるように作られています。
そのため、もしResoniteのビジュアルプログラミング機能であるFluxなどで、既にそういった翻訳APIのURLを設定して利用している場合、そのURLを今回ご自身で作成するAPIのURLに置き換えるだけで、同様に動作することが期待できますよ。

無料配布している翻訳機や翻訳機能付きキーボード<br>ここで紹介する方法でAPIを作っているので互換性があります。自分で使う場合は

<a href="https://uni-pocket.com/ja/items/3f063a9b-2968-448d-8146-b3d5795d480f" class="dynamic-link-card"></a>
    <noscript>
        <p><a href="https://uni-pocket.com/ja/items/3f063a9b-2968-448d-8146-b3d5795d480f ">二人で同時使用可能なシンプルな翻訳機です</a></p>
    </noscript>
<a href="https://uni-pocket.com/ja/items/7bbead22-32d7-4ee3-88c9-7beaa78c1c13" class="dynamic-link-card"></a>
    <noscript>
        <p><a href="https://uni-pocket.com/ja/items/7bbead22-32d7-4ee3-88c9-7beaa78c1c13">日本語変換・翻訳機能・カラータグ・なんちゃって電卓など、便利な機能がいっぱい付いたキーボードです</a></p>
    </noscript>

## 必要なもの

* Googleアカウント (GmailアカウントなどでOK)

## 作成手順

### ステップ1: Googleスプレッドシートの準備とApps Scriptエディタの起動

Google Apps Scriptのプロジェクトを作成する準備を行います。

1.  **Googleスプレッドシートを開きます。** お使いのGoogleアカウントで、[Googleスプレッドシート](https://docs.google.com/spreadsheets/)にアクセスしてください。

1.  **新しいスプレッドシートを作成します。**
    * 画面左上の **「空白のスプレッドシート」** ボタンをクリックし、「無題のスプレッドシート」を用意します。
    * スプレッドシートが開いたら、ファイル名を付けます。例えば「my翻訳API」など、分かりやすい名前で問題ありません。このスプレッドシート自体にデータを入力することはありません。
    {{< figure src="image.png" title="Googleスプレッドシートの新規作成" alt="Googleドライブで新規ボタンからGoogleスプレッドシートを選択し、無題のスプレッドシートが開いた様子のスクリーンショット" class="figure-unindented-center" >}}

2.  **Apps Scriptエディタを開きます。**
    * 作成したスプレッドシートのメニューバーから「拡張機能」を選択し、その中にある「Apps Script」をクリックします。
    {{< figure src="スクリーンショット 2025-05-22 194123.png" title="Apps Scriptエディタを開く" alt="スプレッドシートの拡張機能メニューからApps Scriptを選択している様子のスクリーンショット" class="figure-unindented-center" >}}
    * 新しいタブでApps Scriptエディタが開きます。ここが、これからAPIのコードを記述する場所になります。

### ステップ2: スクリプトの作成

Apps Scriptエディタが開いたら、いよいよAPIの動作を定義するスクリプトを記述していきます。

1.  **既存コードの削除**
    スクリプトエディタに、もし最初から `function myFunction() {}` のようなサンプルコードが表示されていたら、それは全て選択して削除してください。エディタ内を空っぽの状態にします。

2.  **以下のコードを貼り付け**
    空になったスクリプトエディタに、下記のコード全体をコピーして、そのまま貼り付けてください。

    ```javascript
    function doGet(e) {
      var output = ContentService.createTextOutput();
      // レスポンスの形式をプレーンテキストに設定します
      output.setMimeType(ContentService.MimeType.TEXT); 

      // URLのパラメータ(?text=...&source=...&target=...)を取得します
      var textToTranslate = e.parameter.text;
      var sourceLanguage = e.parameter.source;
      var targetLanguage = e.parameter.target;

      // 必要なパラメータが揃っているかチェックします
      if (!textToTranslate || !sourceLanguage || !targetLanguage) {
        output.setContent("Error: Missing required parameters. Please provide 'text', 'source', and 'target'.");
        return output;
      }

      try {
        var translatedText;
        // 翻訳元言語が "auto" の場合、言語を自動検出します
        if (sourceLanguage.toLowerCase() === "auto") {
          translatedText = LanguageApp.translate(textToTranslate, '', targetLanguage);
        } else {
          // それ以外の場合は指定された言語で翻訳します
          translatedText = LanguageApp.translate(textToTranslate, sourceLanguage, targetLanguage);
        }
        
        // 成功時は翻訳された文字列のみを返します
        output.setContent(translatedText);
        return output;

      } catch (err) {
        // 翻訳中にエラーが発生した場合はエラーメッセージを返します
        output.setContent("Error: Translation failed - " + err.toString());
        return output;
      }
    }
    ```

### ステップ3: プロジェクトの保存

コードを貼り付けたら、忘れないうちにプロジェクトを保存しましょう。

1.  **プロジェクトを保存します。**
    スクリプトエディタの上部にある、フロッピーディスクのアイコンをクリックまたはCtrl+Sを押してください。
    {{< figure src="image-1.png" title="プロジェクトの保存" alt="Apps Scriptエディタの保存アイコン（フロッピーディスクの形）を指し示しているスクリーンショット" class="figure-unindented-center" >}}

2.  **プロジェクト名を設定します。**
    分かりやすい名前を入力してください。例えば「MyTranslateAPI」や「翻訳API」といった名前で大丈夫です。

### ステップ4: ウェブアプリとしてデプロイ

作成したスクリプトを、インターネット経由でアクセスできるAPIとして公開（デプロイ）します。

1.  **新しいデプロイを開始します。**
    スクリプトエディタの右上にある青色の「**デプロイ**」ボタンをクリックし、表示されたメニューから「**新しいデプロイ**」を選択してください。
    {{< figure src="スクリーンショット 2025-05-22 194758.png" title="「デプロイ」から「新しいデプロイ」を選択" alt="Apps Scriptエディタ右上の「デプロイ」ボタンを押し「新しいデプロイ」を選択している様子のスクリーンショット" class="figure-unindented-center" >}}

2.  **デプロイの種類を選択します。**
    歯車アイコン⚙️をクリックし、表示された選択肢の中から「**ウェブアプリ**」を選んでください。

3.  **ウェブアプリの設定を行います。**
    次に表示される画面で、以下の項目を設定していきます。

    * **説明:** このデプロイに関するメモです。例えば「最初のバージョン」や「v1.0」など、後で見て分かりやすい内容を入力します。
    * **次のユーザーとして実行:** 「**自分（あなたのメールアドレスが表示されています）**」を選択してください。これは、APIがあなたの権限で動作するという意味です。
    * **アクセスできるユーザー:** このAPIをどのように利用するかで設定を選びます。
        * **Resoniteで利用する場合など、特にアクセスを制限せず誰でも使えるようにしたい場合**は、「**全員**」を選択してください。これで、URLを知っていれば誰でもAPIにアクセスできるようになります。
        * もし利用者を限定したい場合は、「自分（あなたのメールアドレス）のみ」や、組織内のユーザー（Google Workspaceアカウントの場合）といった選択肢もありますので、用途に応じて設定してください。
        今回の記事では、Resoniteでの利用を想定し、「全員」を選択して進めます。

        {{< figure src="rapture_20250522195045.jpg" title="ウェブアプリの設定画面" alt="ウェブアプリのデプロイ設定画面で「説明」「次のユーザーとして実行」「アクセスできるユーザー」で「全員」を選択している状態が設定されているウェブアプリ設定画面全体が写っているものが分かりやすいです。" class="figure-unindented-center" >}}

4.  設定が終わったら、「**デプロイ**」ボタンをクリックします。

5.  **承認プロセスを行います (出てきた場合のみ)**
    「デプロイ」ボタンを押すと、多くの場合、初回は「承認プロセス」が必要になります。これは、作成したスクリプトにGoogle翻訳などの機能へのアクセスを許可するための手続きです。
    許可を選択してください。

6.  **ウェブアプリのURLを取得します！**
    承認が完了し、デプロイが成功すると、「ウェブアプリ」という項目にURLが表示されます。これが、今回作成したあなた専用の翻訳APIのURLです！
    * **このURLは後で使うので控えておいてください。** 後でAPIを呼び出すときに使います。
        {{< figure src="rapture_20250522195505.jpg" title="ウェブアプリURLの表示画面" alt="デプロイ成功後に表示されるウェブアプリのURLとコピーボタンが示されたスクリーンショット" class="figure-unindented-center" >}}

7.  URLを控えたら、「**完了**」ボタンをクリックします。

### ステップ5: 動作テスト

APIが正しく動作するか、ブラウザを使って確認してみましょう。

1.  **コピーしたURLをブラウザで開きます。**
    ステップ4で控えておいたウェブアプリのURLを、お使いのブラウザ（Google ChromeやFirefoxなど）のアドレスバーに貼り付けてください。
    まだEnterキーは押さないでください。

2.  **URLの末尾にパラメータを追加します。**
    貼り付けたURLの末尾に、翻訳したい内容を指定するための情報を「パラメータ」として追加します。
    具体的には、以下の形式で入力します。

    `[コピーしたURL]?text=翻訳したい文字列&source=翻訳元言語&target=翻訳先言語`

    * `?`: URLの本体とパラメータ部分の区切りです。
    * `text=...`: 翻訳したい文字列を指定します。
    * `source=...`: 翻訳元の言語コードを指定します（例: `en` は英語、 `ja` は日本語）。`auto` を指定すると自動で言語を判別してくれます。
    * `target=...`: 翻訳先の言語コードを指定します（例: `ja` は日本語、 `en` は英語）。
    * `&`: 複数のパラメータを繋ぐ記号です。

    **文字列のURLエンコードについて:**
    もし翻訳したい文字列にスペースや特殊文字（例: `?` や `&` など）が含まれている場合は、URLエンコードという処理が必要になることがあります。例えば、半角スペースは `%20` に置き換えます。多くのプログラミング言語にはこのための関数が用意されていますし、ブラウザのアドレスバーに直接日本語などを入力した場合、ブラウザが自動でエンコードしてくれることも多いです。

    Resoniteの場合は Escape URi data string というFluxノードが用意されています。これをつなぐことでURLエンコードを行ってくれます。
    {{< figure src="2025-05-23 15.50.30.jpg" title="Resoniteのスクショ" alt="FluxのEscape URi data stringノードのスクショ" class="figure-unindented-center" >}}

3.  **実際に試してみましょう！**
    以下にいくつかのテスト例を挙げます。ご自身のURLの末尾にそれぞれのパラメータを追記して、Enterキーを押してアクセスしてみてください。

    * **テスト例1 (英語→日本語):**
        `[あなたのAPIのURL]?text=Hello%20world&source=en&target=ja`
        ブラウザの画面に `こんにちは世界` と表示されれば成功です！

    * **テスト例2 (日本語→英語、言語自動検出):**
        `[あなたのAPIのURL]?text=これはペンです&source=auto&target=en`
        ブラウザの画面に `This is a pen.` と表示されれば成功です！

    * **テスト例3 (パラメータ不足エラーの確認):**
        `[あなたのAPIのURL]?text=Hello`
        ブラウザの画面に `Error: Missing required parameters. Please provide 'text', 'source', and 'target'.` といったエラーメッセージが表示されれば、エラー処理も正しく動いている証拠です。

## 注意点

* **利用回数の上限について**
    僕たちが使っているGoogle Apps Scriptの無料版では、翻訳機能（`LanguageApp.translate`）を呼び出せる1日あたりの回数に上限（個人アカウントだと20,000回？）が設けられています。もし、あまりにもたくさん使いすぎると、一時的にAPIがエラーを返すようになることがあります。

* **翻訳の精度について**
    このAPIの翻訳は、Google翻訳の機能を利用しています。そのため、翻訳結果の正確さや自然さはGoogle翻訳に準じます。

* **APIの公開範囲とセキュリティについて**
    ステップ4のデプロイ設定で「アクセスできるユーザー」を「全員」にした場合、作成したAPIのURLを知っていれば、誰でもそのAPIを利用できてしまいます。

## おわりに

これで、あなただけのオリジナル翻訳APIが完成しました！
このAPIを使えば、Resoniteのようなメタバースプラットフォームでのコミュニケーション支援ツールや、自作のアプリケーション、ウェブサイトなどに手軽に翻訳機能を組み込むことができますよ！

GASは非常に多機能なので、今回のAPIをベースにさらに高度な機能を追加していくことも可能です。ぜひ、色々なアイデアを試してみてくださいね！
{{< figure src="image-2.png" title="Resoniteのスクショ" alt="レゾナイトは良いぞ" class="figure-unindented-center" >}}