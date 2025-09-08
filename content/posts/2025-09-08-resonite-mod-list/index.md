---
title: "MarkNが使っているResoniteのMod一覧"
date: 2025-09-08
draft: false
tags: ["Resonite", "Mod"]
thumbnail: "thumbnail.webp"
thumbnail_alt: "Resonite Mods"
description: "MarkNが現在使用しているResoniteのMod一覧。各ModのGitHubリンクと簡単な説明をまとめます。"
---

**注意（自己責任）**: 本記事で紹介するModの導入・使用はすべて自己責任で行ってください。トラブル（Resoniteのクラッシュ、データ破損、挙動不良など）が発生した場合はご自身で解決をお願いします。Resonite本体の不具合として公式へ報告しないでください。Resoniteの挙動に不審を感じたら、まずは導入したModを疑い、無効化・削除して検証してください。ResoniteのアップデートによりModが使えなくなることはよくあります。

## ResoniteModLoader（RML）の導入

- **公式リポジトリ**: [ResoniteModLoader (GitHub)](https://github.com/resonite-modding-group/ResoniteModLoader)
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

出典: [ResoniteModLoader README の Installation](https://github.com/resonite-modding-group/ResoniteModLoader)

## MarkNが入れているMod一覧

### 必須
- [BoundedUIX](https://github.com/lill-la/BoundedUIX): UIXの要素をdevツールで選択・選択範囲の表示ができるようになります。
- [CherryPick](https://cyro.blue/cyro/CherryPick): コンポーネントやFluxを検索できるようになります。
- [InspectorScroll](https://github.com/art0007i/InspectorScroll/): ジョイスティックでのスクロール機能を追加します。
- [ResoniteModSettings](https://github.com/badhaloninja/ResoniteModSettings): ゲーム内から各Modの設定を一元管理できます。

### おすすめ
- [BetterInventoryBrowser](https://github.com/hantabaru1014/BetterInventoryBrowser): インベントリのブックマーク・履歴などが使えるようになります。
- [DefaultToolOverride](https://github.com/art0007i/DefaultToolOverride/): デスクトップモードで数字キーから出せるツールを変更できます。
- [NoHeadMenuDash](https://github.com/art0007i/NoHeadMenuDash/): 手を頭に近づけるとコンテキストメニューボタンがダッシュメニューボタンになる謎仕様を変更します。
- [ResoniteMetricsCounter](https://github.com/esnya/ResoniteMetricsCounter): ワールド内のコンポーネントとFluxの実行時間を計測できます。
- [Reso-SaveToWhere](https://github.com/rassi0429/Reso-SaveToWhere): 保存先の指定をわかりやすくし、意図した場所へ確実に保存できます。
- [SpeedyURLs](https://github.com/dfgHiatus/SpeedyURLs/): URLを開くまでの待機時間をスキップします。

### 個人的に便利で使っている
- [CustomLegacyUI](https://github.com/HamoCorp/CustomLegacyUI/): 新規作成から出せるレガシーUIの見た目をカスタマイズします。
- [LegacyInventoryFix](https://github.com/rassi0429/LegacyInventoryFix): レガシーインベントリを横長にします。（あまり使っている人いないと思うけど）
- [ResoniteScreenshotExtensions](https://github.com/hantabaru1014/ResoniteScreenshotExtensions): スクリーンショットの画質設定やメタデータを追加します。
- [ScalableMaterialOrbs](https://github.com/AlexW-578/ScalableMaterialOrbs/): マテリアルオーブのサイズをスケーラブルにします。
- [ScalableWorldOrbs](https://github.com/XDelta/ScalableWorldOrbs): ワールドオーブのサイズをスケーラブルにします。
- [SimpleScalableMeshOrbs](https://github.com/AwesomeTornado/SimpleScalableMeshOrbs/): メッシュオーブのサイズをスケーラブルにします。
- [SlotInspectorHighlighter](https://github.com/sjsanjsrh/SlotInspectorHighlighter): インスペクタで選択中のスロットを視覚的に強調表示します。
- [TypePicker](https://github.com/TheJebForge/TypePicker/): 型選択UIを改良し、検索性と選択速度を向上させます。
