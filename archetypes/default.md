---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
tags: ["Resonite"]
description: "記事の概要。一覧・検索結果・OGP に表示される1〜2文の説明。"
thumbnail: "thumbnail.webp"
# emoji: "🧪"          # 任意: thumbnail 画像が無いときに一覧などで使う絵文字
# series: "シリーズ名"  # 任意: 同じ値を持つ記事を日付順に前後記事ナビで自動連結
draft: true
---

<!--
記事の書き方メモ（このコメントは削除してよい）:
- フォルダ名は YYYY-MM-DD-slug 形式。この index.md と画像を同じフォルダに置く。
- 画像は ![説明](ファイル名.png "キャプション") で挿入（キャプションは省略可）。
- 動画・投稿・外部ページは URL を「前後に空行を入れた1行」で書くだけで、
  ビルド時に自動でカード化される（YouTube 埋め込み / X カード / OGP リンクカード）。
  例:

  https://www.youtube.com/watch?v=xxxxxxxxxxx
-->

これはリード文（導入文）です。
