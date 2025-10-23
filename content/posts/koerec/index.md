---
title: "Koerec - 高速音声コーパス作成ツール"
date: 2025-10-23T12:00:00+09:00
description: "合成音声制作のための音声コーパス作成を効率化するWebアプリケーションです。大量の文章を読み上げて録音し、文章と音声ファイルを対応付けたデータセットを簡単に作成できます。"
tags: ["作ったもの", "プログラミング", "AI"]
categories: ["ポートフォリオ"]
thumbnail: "images/default_thumbnail.webp" # 後ほど適切なサムネイル画像に差し替えることをお勧めします
externalUrl: "/koerec/"
---

ブラウザだけで音声コーパスの作成が完結するWebアプリケーション「Koerec」を公開しました。

[こちらからアクセスできます](/koerec/)

## 主な機能

*   **台本管理**: 事前定義台本の選択、カスタム台本のアップロード・編集
*   **効率的な録音**: ワンクリック録音、リアルタイム波形表示
*   **キーボードショートカット**: Space（録音）、Enter（次へ）、P（再生）
*   **進捗保存**: ブラウザを閉じても進捗が保持される
*   **データエクスポート**: ZIPファイル、TXTファイル形式での出力

## 技術仕様

*   **フロントエンド**: HTML5, CSS3 (Tailwind), JavaScript (ES6+)
*   **Web APIs**: MediaRecorder, Web Audio, IndexedDB, File API
*   **対応ブラウザ**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
*   **データ保存**: ローカル保存のみ（プライバシー保護）

このツールは、[GitHub](https://github.com/MarkN2000/koerec)でオープンソースとして公開しています。
