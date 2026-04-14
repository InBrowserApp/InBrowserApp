## Basic Auth とは？

Basic Auth は `username:password` を Base64 でエンコードしてから `Authorization` ヘッダーに入れます。実装は簡単で広く使われていますが、Base64 は暗号化ではなく単なるエンコードです。

## このツールが生成するもの

- API クライアントにそのまま貼り付けられる `Authorization: Basic ...` ヘッダー。
- すぐ試せる `curl` コマンド例。
- すべてブラウザ内でローカル実行。

## 注意しておきたいこと

- Basic Auth の認証情報を送るときは必ず HTTPS を使ってください。
- ヘッダーを見られると元のユーザー名とパスワードをデコードできます。
- Basic Auth は社内ツール、ステージング環境、簡単な API 確認に向いています。
