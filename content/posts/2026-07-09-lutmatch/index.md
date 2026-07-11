---
title: "LUT Match - 画像2枚からLUTを自動生成するツール"
date: 2026-07-09T12:00:00+09:00
lastmod:
description: "元画像と参考画像の2枚から、色合いを再現する3D LUT(.cube)を自動生成するWebアプリケーションです。処理はすべてブラウザ内で完結し、生成したLUTはDaVinci ResolveやPremiere Pro、OBSなどで使用できます。"
tags: ["制作物", "webアプリ"]
thumbnail: "thumbnail.webp"
externalUrl: "https://lutmatch.markn2000.com"
---

2枚の画像から3D LUT(.cube形式)を自動生成するWebアプリケーション「LUT Match」を公開しました。

デジタルカメラで撮った写真とフィルムカメラで撮った写真を比較して、フィルム風の色合いを再現するLUTを作る、といった使い方ができます。

## 主な機能

*   **LUT自動生成**: Source(元画像)とReference(目標画像)の2枚から、色合いを再現する3D LUTを自動生成
*   **3つのマッチモード**: ナチュラル(MKL)、忠実(ヒストグラムマッチング)、バランス(複合処理)から選択可能
*   **強度調整**: マッチングの適用強度を調整しながらリアルタイムでプレビュー
*   **柔軟な出力**: 17/33/65サイズの`.cube`ファイルとしてダウンロード
*   **幅広い対応ソフト**: DaVinci Resolve、Premiere Pro、Photoshop、OBS、Resoniteなど多数のソフトで使用可能
*   **プライバシー保護**: すべての処理はブラウザ内で完結し、画像がサーバーに送信されることはありません

## 使い方

1.  Source(元画像)とReference(目標画像)をドラッグ&ドロップ
2.  マッチングモードと強度を調整
3.  LUTサイズを指定して`.cube`ファイルをダウンロード

## 技術仕様

*   **フロントエンド**: Vite + TypeScript(フレームワークレス)
*   **処理方式**: Web Worker(計算)、WebGL2 + Canvas 2D(プレビュー)
*   **対応形式**: JPEG / PNG / WebP
*   **対応ブラウザ**: Chrome、Edge、Firefox、Safariの最新2メジャーバージョン(モバイル対応)

このツールは、[GitHub](https://github.com/MarkN2000/lutmatch)でオープンソースとして公開しています。
