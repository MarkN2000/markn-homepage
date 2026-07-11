---
title: "スタイルガイド(埋め込み・組版の確認用)"
date: 2000-01-01T00:00:00+09:00
draft: true
tags:
  - 制作物
  - 解説
description: "本文組版と単独行URL自動変換(YouTube / X / OGPリンクカード)の表示確認用ドラフト記事。draft のため本番ビルドには出力されない。"
emoji: "🧪"
---

この記事は **draft** で、`-D` 付きビルドでのみ出力されます。本文の組版要素と、単独行URLの自動変換(YouTube・X・OGPリンクカード)の表示を一括で確認するためのものです。

## 見出しと文字装飾

段落テキストの例です。**太字**、*イタリック*、`インラインコード`、[通常のテキストリンク](https://example.com/) が正しく表示されるかを確認します。文中に生の URL を書いた場合 https://zenn.dev/ は、埋め込みに変換されず**ただのリンク(またはテキスト)のまま**であることも確認します。

### 見出しH3

さらに細かいセクションです。

## リスト

- 箇条書き1
- 箇条書き2
  - ネストA
  - ネストB
- 箇条書き3

1. 番号付き1
2. 番号付き2
3. 番号付き3

## 引用とコード

> これは引用ブロックです。The quick brown fox jumps over the lazy dog.

```js
// コードブロックの例
function greet(name) {
  return `Hello, ${name}!`;
}
```

## 表

| 種類 | 変換結果 |
|---|---|
| YouTube | ファサード埋め込み |
| X | 静的引用カード |
| その他 | OGPリンクカード |

## キャプション付き画像

![サンプル画像の代替テキスト](sample.webp "これは画像キャプションです")

## YouTube(単独行URL)

https://www.youtube.com/watch?v=lC3F1dn66FY

## X ポスト(単独行URL)

https://x.com/jack/status/20

## 一般サイトのOGPリンクカード(単独行URL)

https://zenn.dev/

https://obsproject.com/

## フォールバック確認(存在しないドメイン)

https://this-domain-does-not-exist-markn-test-9z8x.example/

## 削除済みXポストのフォールバック確認

https://x.com/Interior_AI/status/1912978655815008409
