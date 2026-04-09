## OpenAPI to TypeScript Converter とは?

OpenAPI to TypeScript Converter は、OpenAPI 3.x ドキュメントをブラウザ内でそのまま TypeScript 型に変換します。すばやく型を確認したいとき、宣言ファイルをダウンロードしたいとき、あるいは schema をサーバーに送らずに `openapi-typescript` のオプションを安全に試したいときに便利です。

## 使う場面

JSON または YAML の OpenAPI schema がすでにあり、フロントエンドアプリや SDK の試作、API レビュー向けに型付きのリクエスト / レスポンスモデルが欲しいときに使います。出力をリポジトリに反映する前に生成オプションを比較したい場合にも特に役立ちます。

## 生成前に

このブラウザ版は、bundle 済みの OpenAPI 3.0 と 3.1 ドキュメントに対応しています。schema に外部 `$ref` の参照先が残っている場合は、先に bundle するか inline 化してから、ここで最終的な TypeScript 出力を生成してください。
