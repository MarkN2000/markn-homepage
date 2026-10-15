---
title: "MarkNが使っているResoniteのMod一覧"
date: 2025-09-08T12:00:00+09:00
lastmod: 2026-10-16T12:00:00+09:00
draft: false
tags: ["Resonite","解説"]
thumbnail: "thumbnail.webp"
description: "MarkNが現在使用しているResoniteのMod一覧。RMLとBepisLoader（Gale）の導入方法、VR・デスクトップ用の起動設定もまとめます。"
---

RMLとBepisLoaderを併用しています。BepisLoader側はGaleで管理しています（Windows・Steam版）。<br>
できるだけModの数は少なくする方針で運用しています

<p style="color:red"><strong style="color:inherit">注意</strong> : Modは自己責任で使用してください。アップデートで動かなくなることがよくあります。不調時はModを無効化して確認し、Mod使用中の問題をResonite公式に報告しないでください。</p>

## ResoniteModLoader（RML）の導入

- **公式リポジトリ**: [ResoniteModLoader (GitHub)](https://github.com/resonite-modding-group/ResoniteModLoader)
- RMLのModを使用しない場合はこの手順は不要です。

### インストール手順

1. `ResoniteModLoader.dll`をResoniteの`Libraries`フォルダに置きます（例: `C:\Program Files (x86)\Steam\steamapps\common\Resonite\Libraries`）。フォルダが無い場合は作成します。
2. `0Harmony.dll`を`rml_libs`フォルダに置きます（例: `C:\Program Files (x86)\Steam\steamapps\common\Resonite\rml_libs`）。無い場合は作成します。
3. 使いたいRMLのModのDLLを`rml_mods`フォルダに置きます（例: `C:\Program Files (x86)\Steam\steamapps\common\Resonite\rml_mods`）。無い場合は作成します。

更新時は新しいDLLで上書きします。RMLのModは[Resolute](https://github.com/Gawdl3y/Resolute)でも導入・更新できます。

## BepisLoaderの導入（Galeを使用）

- **公式リポジトリ**: [Gale (GitHub)](https://github.com/Kesomannen/gale) / [BepisLoader (GitHub)](https://github.com/ResoniteModding/BepisLoader)
- GaleでBepisLoaderのModを導入・更新します。

### インストール手順

1. [GaleのReleases](https://github.com/Kesomannen/gale/releases/latest)からWindows用の`.msi`をダウンロードし、インストールします。
2. GaleでResoniteを選び、`Default`プロファイルを開きます。
3. 「Install mods」で使いたいModを検索・インストールします。BepisLoaderや必要な前提Modも自動で入ります。

Gale経由で使う場合、Steamに設定済みの引数は外しておきます（RML用等で設定済みだった場合）。

### Modの追加

1. Resoniteが選択されている状態でサイドバーの`install mods`タブを開く。
2. modを検索してインストールボタンを押す。この際必須な関連modも自動でインストールインストールされます。
![galeでmodを検索](rapture_20261012181850.jpg)

### ショートカットの作成

1. Galeで使うプロファイル（例: `Default`）を選びます。
2. 「Profile → Create desktop shortcut」でショートカットを作成します。
3. 作成したショートカットからResoniteを起動できます。
![alt text](rapture_20261012182055.jpg)

<details>
<summary>VR用・デスクトップ用に分ける場合（任意）</summary>

起動モード別にショートカットを分けたい場合だけ行います。

1. `Default`をVR用として残します。
2. 「Profile → Duplicate profile」で複製し、名前を`Desktop`等にします。（手動でプロファイルを追加してmodを一つづつ追加したり、`Exprot as code`等で一覧をコピーしてまとめてインポートでもok）
3. `Desktop`を選び、「Edit manager settings → Profile settings → Launch → Custom launch arguments」に`-Screen`を追加します。入力後は別の場所をクリックします。
4. `Desktop`でも「Profile → Create desktop shortcut」でショートカットを作成します。

`-Screen`は**Profile settings側**に入れます。Resonite settings側に入れると全プロファイルに適用されます。

![alt text](rapture_20261012182240.jpg)

複製後のGale側のModは別管理です。同じプロファイルを共用したい場合は、末尾のおまけを参照してください。
</details>

## MarkNが入れているMod一覧
### RMLのMod

`rml_mods`に配置します。
<details>
<summary>展開</summary>


#### おすすめ

- [BetterInventoryBrowser](https://github.com/hantabaru1014/BetterInventoryBrowser): インベントリのブックマーク・履歴などが使えるようになります。
- [Reso-SaveToWhere](https://github.com/rassi0429/Reso-SaveToWhere): 保存先の指定をわかりやすくします。
- [BoundedUIX](https://github.com/djsime1/BoundedUIX): UIXの要素をdevツールで選択し、選択範囲を表示できます。（アプデで壊れがち）

#### あると便利

- [LegacyInventoryFix](https://github.com/rassi0429/LegacyInventoryFix): レガシーインベントリを横長にします。
- [ResoniteScreenshotExtensions](https://github.com/hantabaru1014/ResoniteScreenshotExtensions): スクリーンショットの画質設定やメタデータを追加します。
- [SessionTweaks](https://github.com/kazu0617/SessionTweaks): フレンド一覧に、セッションオーブ生成やURIコピーのボタンを追加します。
- [ScalableMaterialOrbs](https://github.com/AlexW-578/ScalableMaterialOrbs/): マテリアルオーブのサイズを変更できます。
- [ScalableWorldOrbs](https://github.com/XDelta/ScalableWorldOrbs): ワールドオーブのサイズを変更できます。
- [SimpleScalableMeshOrbs](https://github.com/AwesomeTornado/SimpleScalableMeshOrbs/): メッシュオーブのサイズを変更できます。
- [SlotInspectorHighlighter](https://github.com/sjsanjsrh/SlotInspectorHighlighter): 選択中のスロットをインスペクタで色付き表示します。

</details>

### BepisLoaderのMod
<details>
<summary>展開</summary>

Galeで管理しています。GaleでMod名を検索してインストールするのがおすすめです。
![alt text](rapture_20261012180833.jpg)

#### 必須級

- [ResoniteModLoaderLoader](https://github.com/DevL0rd/ResoniteModLoaderLoader): RMLのModを使うため、BepisLoaderからRMLを読み込みます。
- [RMLModSettings](https://github.com/NepuShiro/RMLModSettings): BepisModSettingsからRML側のMod設定を変更できます。


#### おすすめ

- [InspectorScroll](https://github.com/art0007i/InspectorScroll): ジョイスティックでスクロールできます。
- [ResoniteYAP](https://github.com/NepuShiro/ResoniteYAP): コンポーネントやFluxノードを検索できます。
- [NoHeadMenuDash](https://github.com/art0007i/NoHeadMenuDash): 手を頭に近づけるとボタンがダッシュメニューに変わる謎仕様を消します。
- [ResoniteBetterIMESupport](https://github.com/blhsrwznrghfzpr/ResoniteBetterIMESupport): 日本語入力などの変換中の文字を正しく表示します。
- [DefaultToolOverride](https://github.com/art0007i/DefaultToolOverride): デスクトップモードで数字キーから出せるツールを変更できます。
- [SpeedyURLs](https://github.com/lecloutpanda/SpeedyURLs): URLを開くまでの待機時間をスキップします。

#### あると便利

- [ShowDelegates](https://github.com/art0007i/ShowDelegates): デリゲート一覧を折りたたみ、隠しデリゲートも表示します。（自分で開いたインスペクターのみ）
- [TypePicker](https://github.com/TumnusB/TypePicker): コンポーネントやFluxノードの型を選ぶUIを追加します。
- [ResoniteSpout](https://github.com/Zozokasu/ResoniteSpout): カメラ映像をSpout経由でOBSなどに出力します。
- [EnumDropdown](https://github.com/LeCloutPanda/EnumDropdown): 列挙型（Enum）の値をドロップダウンから選べるようにします。（自分で開いたインスペクターのみ）
- [MyInspectors](https://github.com/art0007i/MyInspectors): インスペクタの内容をホストではなく自分側で生成するようにします。（壊れたとき影響範囲が大きいので注意。自分や他人のインスペクターの挙動がおかしくなったらまず疑いましょう）
- [ClassicLegacyUI](https://github.com/MarkN2000/ClassicLegacyUI): 新規作成のレガシーUIの色等がおかしいのを修正します。NeosVRの頃のような見た目になります。
- [VideoReloader](https://github.com/MarkN2000/VideoReloader): Cookie取得用ブラウザや優先解像度の変更時などに、動画を自分側で再読み込みできます。
- [SmoothContacts](https://github.com/MarkN2000/SmoothContacts): フレンド一覧を開いたときや検索を解除したときのフリーズを軽減します。
</details>

## おまけ：一つのプロファイルでVR・デスクトップ・mod無しのショートカット作る

一つの`Default`を共用すれば、Modの更新や設定変更を一か所で行えます。

長いパスがショートカットの「リンク先」欄に収まるよう、シンボリックリンクで短くします。
<details>
<summary>やり方</summary>

### シンボリックリンクの作成

1. Galeで`Default`を選び、一度「Launch modded」から起動します。
2. コマンドプロンプトを管理者として開き、以下を実行します。

```bat
mklink /D C:\resmod "%APPDATA%\com.kesomannen.gale\resonite\profiles\Default"
```

`Default`は使うプロファイル名に変更します。`C:\resmod`がすでにあれば別名にします。保存先を変更している場合は「File → Open profile folder」のパスを使います。

参考: [mklinkコマンド](https://learn.microsoft.com/ja-jp/windows-server/administration/windows-commands/mklink)

### VR用ショートカットの用意

以下のどちらかで用意します。

- **Gale**：`Default`を選び、「Profile → Create desktop shortcut」で作成したショートカットを使います。
- **Steam**：Resoniteの「プロパティ → 一般 → 起動オプション」に以下を設定し、通常のショートカット（`steam://rungameid/2519830`）を使います。

```text
"--hookfxr-enable" "--bepinex-target" "C:/resmod/BepInEx" "--doorstop-enabled" "true" "--doorstop-target-assembly" "C:/resmod/Renderer/BepInEx/core/BepInEx.Preloader.dll"
```

どちらも`Default`を使い、VR用には`-Screen`を付けません。

### デスクトップ用ショートカットの作成

1. デスクトップで右クリックし、「新規作成 → ショートカット」を選択します。
2. `Resonite.exe`のパスに、短縮した引数と`-Screen`を付けます。私の例は以下です。

```text
"C:\Program Files (x86)\Steam\steamapps\common\Resonite\Resonite.exe" "--hookfxr-enable" "--bepinex-target" "C:/resmod/BepInEx" "--doorstop-enabled" "true" "--doorstop-target-assembly" "C:/resmod/Renderer/BepInEx/core/BepInEx.Preloader.dll" -Screen
```

3. 名前を「Resonite（デスクトップ）」などにし、プロパティの「作業フォルダー」に`Resonite.exe`のあるフォルダを指定します。
4. Steamを起動した状態で、ショートカットから動作を確認します。

パスは自分のインストール先・リンク名に合わせて変更します。ローダーを更新したら、一度Galeから起動します。

### mod無しショートカットの作成

動作がおかしいときに、modが悪いのか、Resonite自体が悪いのか切り分けするときに使います。バグ報告する際にもこちらで起動します。

1. デスクトップで右クリックし、「新規作成 → ショートカット」を選択します。
2. 以下のパスを指定します（インストール先に合わせて変更）。

```text
"C:\Program Files (x86)\Steam\steamapps\common\Resonite\Resonite.exe"
```

3. 名前を「Resonite（mod無し）」などにして作成します。

デスクトップ用にする場合は、パスの末尾に半角スペースと`-screen`を付けます。
</details>
