---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
tags:
  - Resonite
  - VR
  - 作ったもの
  - おすすめアイテム
  - 協力
thumbnail: "thumbnail.webp" # この記事のサムネイル (OGP画像にも使われる)
thumbnail_alt: "どのようなサムネイル画像かの説明"
description: "この記事では、サンプル記事のタイトルに関する詳細な情報を提供し、読者に有益な洞察を与えます。" # この記事固有のdescription
prev_post_path: "/posts/sample-article-2/" # 存在する記事のパスを指定
next_post_path:
# foldername：2024-11-06-mousepad
---

これはサンプル記事の**リード文**（導入文）です。この記事では、個別記事ページの基本的なレイアウトとMarkdown要素のスタイリングについて説明します。読みやすく、魅力的な記事ページを目指しましょう。

## 見出しH2のスタイル

ここからが本文の始まりです。

### 1.1. 見出しH3のスタイル

さらに細かいセクション分けにはH3を使用します。テキスト内の**太字**や*イタリック*も正しく表示されるか確認しましょう。 [これはサンプルリンクです](https://example.com)。

#### 1.1.1. 見出しH4のスタイル

H4はさらに細分化された内容に使います。

リスト表示

* 箇条書きリストのアイテム1
    * ネストされたアイテムA
    * ネストされたアイテムB
* 箇条書きリストのアイテム2
* 箇条書きリストのアイテム3

1.  番号付きリストのアイテム1
    1.  ネストされた番号付きアイテムA
    2.  ネストされた番号付きアイテムB
2.  番号付きリストのアイテム2
3.  番号付きリストのアイテム3

---

次は引用ブロックの表示

> これは引用ブロックです。他の情報源からの引用や、特に強調したいメッセージなどに使用します。
> The quick brown fox jumps over the lazy dog.

インラインの `code` スタイル
リストの外に出すようにしてください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>サンプルHTML</title>
</head>
<body>
    <h1>こんにちは</h1>
</body>
</html>
```


以下はショートコードを使って埋め込んだYouTube動画です。

{{< youtube "lC3F1dn66FY" >}}


記事内の画像表示方法

{{< figure src="placeholder-content.jpg" title="画像のタイトル" alt="画像についての説明文" class="figure-unindented-center">}}


以下は、外部サイトのサムネ付きリンクです
できるだけリストの外に出すようしてください。

<a href="https://sample.com/" class="dynamic-link-card"></a>
<noscript>
  <p><a href="ここにリンク先のURL">ここにリンク先の簡単な説明文を記述</a></p>
</noscript>

以下はショートコードを使って埋め込んだツイートの表示例です。

{{< x user="markn_chansan" id="1922893687190598063" >}}
