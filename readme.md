# slackのbot（slackbotではない）
## 概要

- メッセージを送ると画像を返してくれるbot
- 画像検索はFlickrのAPIを利用
- Outgoing Webhooksを利用
- nodejsで書いてCentOSで動かしてる

![](https://i.gyazo.com/7a93ddf11858305d67c90f7eb74a049d.gif)

## もうちょっと詳しく

### Outgoing Webhooksについて
 - Slackがチャンネルを監視してくれていて、条件に合うポストが投稿されるとあらかじめ設定された特定のURLにそのポストについての情報をPOSTリクエストで投げてくれる
 - 自サーバはそれに決められた形式のJSONで応答すると、今度はSlackがJSONの内容を解釈してSlackにbotとして投稿してくれる

### 動作内容

#### slackbot.js
1. SlackのOutgoing Webhooksが特定のチャンネルで「@bot」というワードを含むポストを補足すると、特定のURL（自分で用意）に補足したポストの内容を含むPOSTリクエストを投げてくれる
2. 特定のURLにはnodejsで建てたAPIサーバ(?)が常にPOSTリクエストをLISTENしている
3. POSTリクエストが来たらFlickrAPIを利用して「@bot」以降の文字列で検索をする
4. 検索結果の一部からランダムに一枚選び、slackのPOSTリクエストのレスポンスとして画像のURLを含むJSONを返す
5. Slackがbotとしてそれをチャンネルに投稿（返信）する

#### delete_message.js
1. SlackのAPIのsearchメソッドを利用して特定の条件で検索
2. 条件に合うメッセージをchat.deleteメソッドで削除
3. 実際は上記のスクリプトをcronで数分ごとに実行している。いらない画像とか不適切な画像を:no\_entry\_sign:のリアクションとかを付けて、「botが投稿したポスト、:no\_entry\_sign:のリアクションが付いたポスト」とかで検索かけて消すポスト抽出してる。

#### testsフォルダ
 - 最初のテスト用に書いた必要最小限のコード
 - シェルスクリプトとjsで書いてる

## 現状の問題点と今後の展望
 - ソースコード汚いのでコメント入れたりする
 - 画像の精度がクソすぎる（検索結果をランダムに選んでるのもいけないし、そもそもFlickrの文化が自分の好みに合わないというのもありそう）のでとりあえずGoogle Custom Search APIとか試してみたい
