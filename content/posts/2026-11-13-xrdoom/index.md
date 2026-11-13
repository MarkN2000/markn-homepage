---
title: "XRiftでDOOMを遊べるワールド「XRDOOM」を作りました"
date: 2026-11-13T14:30:00+09:00
draft: false
tags: ["XRift", "制作物"]
thumbnail: "thumbnail.webp"
description: "XRift内のレトロPCでDOOMを遊べるワールド「XRDOOM」を作りました。PC・スマホ・VRに対応し、WebRTCでプレイ画面を共有して、周りの人も一緒に観戦できます。"
---

名作FPS「DOOM」を、ブラウザで遊べるメタバースXRiftに移植しました！

**ワールド内のレトロPCでDOOMを遊べる「XRDOOM」です。** PC・スマホ・VRに対応しています。

ワールドはこちらから。

https://app.xrift.net/world/d1e81a2d-e93f-4d4f-a50a-6aace92e176b

## レトロPCでDOOMをプレイ

部屋に置かれたPCや椅子を選んで着席し、モニターを選ぶとゲームを開始できます。

操作説明はワールド内に表示されます。スマホにはタッチ操作用のボタンがあり、VRではコントローラーで操作できます。

実際に遊んでいる様子は、こちらのX投稿の動画でご覧いただけます。

https://x.com/markn_chansan/status/2121112548460405143

## 周りの人も一緒に観戦

**プレイ画面はWebRTCで低遅延配信され、同じインスタンスにいる人も自動で観戦できます。**

遊んでいる人の画面を、周りの人もワールド内のモニターで見られます。フレンドと集まって、プレイを見ながら話すこともできます。

観戦中にゲームの音を聴きたい場合は、モニター横の音声ボタンをONにしてください。

## ソースコードも公開しています

DOOMの実行には、[doomgeneric](https://github.com/ozkl/doomgeneric)をXRift向けに改変して使用しています。ワールドで遊べるのはDOOMのシェアウェア版です。

ソースコードや開発手順はGitHubで公開しています。

https://github.com/MarkN2000/XRDOOM

XRDOOMは、DOOMの権利者およびXRift非公認のファンプロジェクトです。
