---
title: "合成音声Style-Bert-VITS2の学習方法"
date: 2025-10-28T12:00:00+09:00
lastmod: 2025-10-28
draft: false
thumbnail: "thumbnail.webp"
tags: ["AI", "解説", "プログラミング"]
description: "Style-Bert-VITS2 JP-Extraのシンプルな導入手順と音声データセットの作り方と合成音声モデルの制作手順を紹介します"
---

この記事では、Style-Bert-VITS2 をインストールして学習してモデルを作成するところまでを解説します。

## 注意事項
- Windows対象
- Nvidia製GPUが必要(RTXシリーズなど)
- 保存先は日本語が含まれないパスにすること（例: `C:\app\StyleBertVITS2`）

## インストール手順
1. ダウンロード
   - [GitHubの配布ページ](https://github.com/litagin02/Style-Bert-VITS2/releases)で最新の `sbv2.zip` をダウンロードしてください。
2. 解凍
   - ダウンロードした `sbv2.zip` を短い英数字のパスへ解凍（例: `C:\app\StyleBertVITS2`）。
3. インストール
   - フォルダ内の `Install-Style-Bert-VITS2.bat` をダブルクリックして、終わるまで待機。
4. 起動
   - `sbv2\Style-Bert-VITS2\` フォルダ内の `App.bat` をダブルクリックして、ブラウザのWebUIが開けば準備OK

## 音声モデルの準備
- 録音からデータ一式の生成まで、以下の専用ツールを使うと簡単です。
  - Koerec（高速音声コーパス作成ツール）: [https://koerec.markn2000.com/](https://koerec.markn2000.com/)
    - サイトを開き、台本を選んで録音 → すべて完了後に「ダウンロード」を押してZIPを取得します。
- ZIPの解凍前に、次の手順でセキュリティを許可してください（Windowsのブロック対策）。
  - ZIPを右クリック → 「プロパティ」 → 「全般」タブ下部の「セキュリティ」欄で「許可する」にチェック
- 解凍後の配置先:
  - `sbv2\Style-Bert-VITS2\` フォルダの中にある `data` フォルダへ、ダウンロードZIPを解凍してできたフォルダを「丸ごと」入れてください。
  - フォルダ名はボイスモデル名にするのがおすすめです（例: `StyleBertVITS2/data/MarkN_normal`）。

## 学習の開始
- webUI起動（起動していなければ）
  - フォルダ内の `App.bat` をダブルクリックして、ブラウザのWebUIが開けば準備OK
- 自動前処理を実行:
  - UIで学習タブを開く
  - モデル名（dataフォルダに入れたフォルダの名前）を入力してから `自動前処理を実行` をクリック
  - 自動前処理が終わったら、`学習を開始する` をクリック
  - `sbv2\Style-Bert-VITS2\model_assets` の中にモデルが生成されます。

## 合成音声の書き出し
- 後で追記するかも


## 参考リンク
- 公式リポジトリ: [Style-Bert-VITS2](https://github.com/litagin02/Style-Bert-VITS2)