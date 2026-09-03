---
title: "AndroidスマホでResoniteヘッドレスを動かす方法"
date: 2026-09-03T12:00:00+09:00
lastmod:
draft: true
tags: ["Resonite", "解説"]
thumbnail: "thumbnail.webp"
emoji: "📱"
description: "AndroidスマホにTermuxとUbuntu環境を用意し、MRHCを使ってResoniteヘッドレスを動かす手順を解説します。快適ではありません。"
---

余っているAndroidスマホに、[MarkN Resonite Headless Controller（MRHC）](/posts/2025-11-12-resonite-headless-controller/)を入れて、Resoniteヘッドレスを動かしてみます。

構成は `Android → Termux → Ubuntu（PRoot）→ MRHC → Resonite Headless` です。

root化不要です。

> **注意:** スマホはPCと比べて性能が低く、ホストに負荷のかかる処理は厳しいです。人数も数人がおすすめ

## 用意するもの

* ARM64（64bit ARM）のAndroidスマホ
* 同じネットワークに接続したPC
* ヘッドレスに必要なもの（headlessコードやsteamのサブ垢等）

ヘッドレスコードとSteamアカウントの準備は、[MRHCの紹介記事](/posts/2025-11-12-resonite-headless-controller/#使い始める前に事前準備)も参照してください。

## 1. Termuxをインストールする

スマホのブラウザで[TermuxのF-Droid配布ページ](https://f-droid.org/packages/com.termux/)を開き、最新バージョンの「Download APK」からAPKをダウンロードしてインストールします。F-Droidアプリ自体を入れる必要はありません。

インストール時に確認が出た場合は、Androidの設定で使用中のブラウザに「不明なアプリのインストール」を一時的に許可してください。インストール後は許可を元に戻して構いません。

インストール後はAndroidの設定からTermuxのアプリ情報を開き、**省電力設定をOFF**にします。設定名や場所はメーカーによって異なり、「バッテリーの最適化」「バックグラウンドでの使用」「省電力対象外」などの名前になっている場合があります。Termuxがバックグラウンドで制限されない設定を選んでください。

> Google Play版は実験的な別系統のため、この記事ではTermux公式が案内しているF-Droid版を使用します。

## 2. Termuxを準備する

Termuxを開き、必要なパッケージを入れます。

```sh
pkg update
pkg install openssh proot-distro tmux
```

SSH接続用のパスワードを決め、SSHサーバーを起動します。

```sh
passwd
sshd
whoami
```

`whoami` で表示されたユーザー名と、AndroidのWi-Fi設定画面に表示されるIPアドレスを使って、PCから接続します。TermuxのSSHポートは `8022` です。

```sh
ssh -p 8022 <Termuxのユーザー名>@<スマホのIPアドレス>
```

Androidでは `ip a` や `ifconfig` が権限エラーになる場合があるため、IPアドレスはAndroidの設定画面から確認するのが確実です。

## 3. Ubuntuを入れる

Termux上でUbuntu 24.04をインストールし、ログインします。

```sh
proot-distro install ubuntu:24.04
proot-distro login ubuntu
```

Ubuntu内で必要なパッケージを入れます。

```sh
apt update
apt upgrade -y
apt install -y curl ca-certificates libfreetype6 libicu74
```

続けて、MRHCを動かす一般ユーザーを作成します。以降の `<ユーザー名>` は、好きな半角英小文字のユーザー名に置き換えてください。

```sh
useradd -m -s /bin/bash <ユーザー名>
exit
```

一般ユーザーでUbuntuへ入り直し、ARM64環境になっていることを確認します。

```sh
proot-distro login ubuntu --user <ユーザー名>
whoami
uname -m
```

設定したユーザー名と `aarch64` が表示されればOKです。

## 4. .NETのGCエラーを回避する

Android + PRoot + ARM64では、MRHCが使うDepotDownloaderの実行時にGCエラーが出る場合があります。先にメモリ上限を設定しておきます。

4Bとはメモリの75％を上限とするという意味です。メモリ不足で落ちる場合は40（64%）などに下げてみてください

```sh
echo 'export DOTNET_GCHeapHardLimitPercent=4B' >> ~/.bashrc
source ~/.bashrc
```

## 5. MRHCをインストールする

Ubuntuの一般ユーザーで実行します。

```sh
cd ~
curl -fsSL https://github.com/MarkN2000/MarkNResoniteHeadlessController/releases/latest/download/install.sh | sh
cd ~/mrhc-linux-arm64
./mrhc
```

初回セットアップで管理パスワードやSteamアカウント、ヘッドレスコードを設定すると、Resonite本体がダウンロードされます。起動後は、同じWi-Fiに接続したPCのブラウザから次のURLを開きます。

```text
http://<スマホのIPアドレス>:8080
```

## SSHを切っても動かし続ける

普段は、Termux側のtmux内でUbuntuとMRHCを動かします。PCからTermuxへSSH接続したあと、次の順で起動します。

```sh
tmux new-session -A -s mrhc
proot-distro login ubuntu --user <ユーザー名>
cd ~/mrhc-linux-arm64
./mrhc
```

MRHCの起動後に `Ctrl + B`、続けて `D` を押すとtmuxから離れられます。この状態ならSSHを切ってもMRHCは動き続けます。戻るときは次を実行します。

```sh
tmux attach -t mrhc
```

Termux側でも次を実行して、画面OFF中に停止しにくくします。

```sh
termux-wake-lock
```

スマホを再起動したあとは、Termuxを開いて `sshd` と `termux-wake-lock` を再実行し、tmuxからMRHCを起動し直してください。


## 実際に動かしてみた結果

5年前のミドルスペックのスマホ（Snapdragon 732G, メモリ6GB）

グリッドスペースでesnyaさんのRailX（ホストが挙動を計算する電車）を1台走らせて、軽めのフルボディーアバター2人とネオロイド1人の場合、

ホストが30~50fpsほどで、会話やモーションの同期は問題なくできていました。

この構成は、余っているスマホで試したり、小規模なセッションを一時的に動かしたりする用途向けです。実際の快適さは端末性能・ワールドの重さ・参加人数で大きく変わるため、常設や安定性を重視するならPCやVPSをおすすめします。

