## IPA を開いてメインアプリのメタデータを確認する

iOS の `.ipa` ファイルをドラッグ＆ドロップするか、**IPA ファイルを開く**を選びます。ビューアーは `Payload/Trail Notes.app/Info.plist` のようなパスにあるメインアプリのプロパティリストを読み込みます。サンプル IPA で、表示される項目を事前に確認できます。アーカイブの展開とプロパティリストの解析はブラウザー内で行われます。

## バンドル ID、バージョン、プラットフォームを確認する

バンドル ID は `CFBundleIdentifier` に格納され、アプリバンドルを識別します。`CFBundleShortVersionString` はリリースバージョンで、`CFBundleVersion` はビルドを識別します。`MinimumOSVersion` と `CFBundleSupportedPlatforms` で、パッケージに記録された最小 OS バージョンとプラットフォーム名を確認できます。表示名は `CFBundleDisplayName` または `CFBundleName` から取得します。

## Info.plist を確認して書き出す

**Info.plist** を選ぶと、概要にないキーを含め、プロパティリスト全体を読みやすい XML で確認できます。バイナリ形式と XML 形式のプロパティリストに対応しています。読みやすい XML を別のツールで使うには **XML をコピー** を選び、元のファイルを保存するには **Info.plist をダウンロード** を選びます。表示されるアーカイブ内のパスで、メタデータの取得元となったアプリバンドルを確認できます。

[Apple の情報プロパティリストのリファレンス](https://developer.apple.com/documentation/bundleresources/information-property-list)
