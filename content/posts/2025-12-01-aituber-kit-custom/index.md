---
title: "AItuberKitを改造してわんコメ連携や最新モデル対応を追加しました"
date: 2025-12-01T23:10:00+09:00
lastmod: 2025-12-07T17:30:00+09:00
draft: false
tags: ["プログラミング", "AI", "作ったもの"]
thumbnail: "thumbnail.webp"
thumbnail_alt: "AItuberKit Custom"
description: "AItuberKitをフォークして、わんコメ連携やGemini 2.5対応などの機能追加を行いました"
prev_post_path:
next_post_path:
# FolderName：2025-12-01-aituber-kit-custom
---

誰でも簡単にAIキャラクターとチャットできるWebアプリケーション「AItuberKit」をフォークして、いくつか便利な機能を追加しました。

使用方法は本家と同じです。

## 主な追加機能

オリジナル版に対して、以下の機能強化を行っています。

1.  **わんコメ連携機能**
    *   「わんコメ」を使ってYouTubeのコメントを取得・連携できるようにしました。これにより、配信でのコメント取得がYouTubeAPIの制限を受けなくなり、長時間の配信が可能となります。HTTP APIを使用する仕組みに変更しました。
        わんコメの利用規約に従うようにしてください。
        わんコメ側は通常通り起動して配信に接続するだけで使えます。ただし同じPCで起動している必要があります。

2.  **日本時間（JST）対応**
    *   時間の認識をJST（日本標準時）など好きなタイムゾーンの時刻の選択に対応させました。AIが日本の現在時刻を正しく認識しやすくなります。（UTCのみだと時刻の計算を間違えやすい）

3.  **最新AIモデル対応**
    *   Gemini 2.5などの最新モデルに対応し、検索機能などを含めた高度な応答が可能になりました。（デフォルトだと最新モデルで検索が使えない）

## リポジトリ

ソースコードはGitHubで公開しています。
<a href="https://github.com/MarkN2000/aituber-kit" class="dynamic-link-card"></a>

フォーク元（本家）
<a href="https://github.com/tegnike/aituber-kit" class="dynamic-link-card"></a>