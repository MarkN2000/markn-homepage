---
title: "MarkNが使っているResoniteのMod一覧"
date: 2025-09-08
lastmod: 2025-09-18
draft: false
tags: ["Resonite", "Mod"]
thumbnail: "thumbnail.webp"
thumbnail_alt: "Resonite Mods"
description: "MarkNが現在使用しているResoniteのMod一覧。各ModのGitHubリンクと簡単な説明をまとめます。"
---

**注意（自己責任）**: 本記事で紹介するModの導入・使用はすべて自己責任で行ってください。トラブル（Resoniteのクラッシュ、データ破損、挙動不良など）が発生した場合はご自身で解決をお願いします。Resonite本体の不具合として公式へ報告しないでください。Resoniteの挙動に不審を感じたら、まずは導入したModを疑い、無効化・削除して検証してください。ResoniteのアップデートによりModが使えなくなることはよくあります。

## ResoniteModLoader（RML）の導入

- **公式リポジトリ**: <a href="https://github.com/resonite-modding-group/ResoniteModLoader" target="_blank" rel="noopener noreferrer">ResoniteModLoader (GitHub)</a>
- **概要**: Resonite向けのModローダー。上記リポジトリの手順に従って導入します。

### インストール手順
1. `ResoniteModLoader.dll` を Resonite の `Libraries` フォルダに置きます（例: `C:\Program Files (x86)\Steam\steamapps\common\Resonite\Libraries`）。フォルダが無い場合は作成します。
2. `0Harmony.dll` を `rml_libs` フォルダ（例: `C:\Program Files (x86)\Steam\steamapps\common\Resonite\rml_libs`）に置きます。無い場合は作成します。
3. Steam の起動オプションに以下を追加します:
```
-LoadAssembly Libraries/ResoniteModLoader.dll
```
4. 任意: Mod の DLL は `rml_mods` フォルダ（例: `C:\Program Files (x86)\Steam\steamapps\common\Resonite\rml_mods`）に配置します。RML導入後に一度起動すると自動作成されることがあります。
5. ゲームを起動し、`Logs` フォルダ内のログで RML が読み込まれているか確認します（`C:\Program Files (x86)\Steam\steamapps\common\Resonite\Logs`）。

出典: <a href="https://github.com/resonite-modding-group/ResoniteModLoader" target="_blank" rel="noopener noreferrer">ResoniteModLoader README の Installation</a>

## MarkNが入れているMod一覧

### 必須
- <a href="https://github.com/lill-la/BoundedUIX" target="_blank" rel="noopener noreferrer">BoundedUIX</a>: UIXの要素をdevツールで選択・選択範囲の表示ができるようにします。
- <a href="https://cyro.blue/cyro/CherryPick" target="_blank" rel="noopener noreferrer">CherryPick</a>: コンポーネントプラウザやFluxノードプラウザに検索欄を追加します。
- <a href="https://github.com/art0007i/InspectorScroll/" target="_blank" rel="noopener noreferrer">InspectorScroll</a>: ジョイスティックでのスクロール機能を追加します。
- <a href="https://github.com/badhaloninja/ResoniteModSettings" target="_blank" rel="noopener noreferrer">ResoniteModSettings</a>: ゲーム内から各Modの設定を一元管理できます。
- <a href="https://github.com/art0007i/NoHeadMenuDash/" target="_blank" rel="noopener noreferrer">NoHeadMenuDash</a>: 手を頭に近づけるとコンテキストメニューボタンがダッシュメニューボタンになる謎仕様を消します。

### おすすめ
- <a href="https://github.com/hantabaru1014/BetterInventoryBrowser" target="_blank" rel="noopener noreferrer">BetterInventoryBrowser</a>: インベントリのブックマーク・履歴などが使えるようになります。
- <a href="https://github.com/art0007i/DefaultToolOverride/" target="_blank" rel="noopener noreferrer">DefaultToolOverride</a>: デスクトップモードで数字キーから出せるツールを変更できます。
- <a href="https://github.com/esnya/ResoniteMetricsCounter" target="_blank" rel="noopener noreferrer">ResoniteMetricsCounter</a>: ワールド内のコンポーネントとFluxの実行時間を計測できます。
- <a href="https://github.com/rassi0429/Reso-SaveToWhere" target="_blank" rel="noopener noreferrer">Reso-SaveToWhere</a>: 保存先の指定をわかりやすくし、意図した場所へ確実に保存できます。
- <a href="https://github.com/dfgHiatus/SpeedyURLs/" target="_blank" rel="noopener noreferrer">SpeedyURLs</a>: URLを開くまでの待機時間をスキップします。

### 個人的に便利で使っている
- <a href="https://github.com/HamoCorp/CustomLegacyUI/" target="_blank" rel="noopener noreferrer">CustomLegacyUI</a>: 新規作成から出せるレガシーUIの見た目をカスタマイズします。
- <a href="https://github.com/rassi0429/LegacyInventoryFix" target="_blank" rel="noopener noreferrer">LegacyInventoryFix</a>: レガシーインベントリを横長にします。
- <a href="https://github.com/hantabaru1014/ResoniteScreenshotExtensions" target="_blank" rel="noopener noreferrer">ResoniteScreenshotExtensions</a>: スクリーンショットの画質設定やメタデータを追加します。
- <a href="https://github.com/AlexW-578/ScalableMaterialOrbs/" target="_blank" rel="noopener noreferrer">ScalableMaterialOrbs</a>: マテリアルオーブのサイズをスケーラブルにします。
- <a href="https://github.com/XDelta/ScalableWorldOrbs" target="_blank" rel="noopener noreferrer">ScalableWorldOrbs</a>: ワールドオーブのサイズをスケーラブルにします。
- <a href="https://github.com/art0007i/ShowDelegates" target="_blank" rel="noopener noreferrer">ShowDelegates</a>: インスペクタパネルでデリゲート一覧を折りたたみにし、隠しデリゲートを使えるようにします。
- <a href="https://github.com/AwesomeTornado/SimpleScalableMeshOrbs/" target="_blank" rel="noopener noreferrer">SimpleScalableMeshOrbs</a>: メッシュオーブのサイズをスケーラブルにします。
- <a href="https://github.com/sjsanjsrh/SlotInspectorHighlighter" target="_blank" rel="noopener noreferrer">SlotInspectorHighlighter</a>: インスペクタで選択中のスロットに色をつけて強調表示します。
- <a href="https://github.com/TheJebForge/TypePicker/" target="_blank" rel="noopener noreferrer">TypePicker</a>: 型選択UIを改良し、検索性を向上させます。
