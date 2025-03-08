# SAM2 Segmentation App

## 概要

SAM2 Segmentation App は、SAM2（セグメンテーション手法）を活用した動画セグメンテーションアプリケーションです。このアプリケーションを使用すると、ユーザーは動画を柔軟にセグメンテーションし、結果を取得、管理することができます。

特徴

- セグメンテーション処理: SAM2 を使用して、動画内のオブジェクトを高精度で分割し、識別します。
- 動画対応: 動画に対してフレームごとにセグメンテーション処理を行い、連続的なデータとして管理することが可能です。
- プロンプトの反映: ユーザーが動画の特定部分にクリックによるプロンプトを追加し、その情報をセグメンテーションに反映させることができます。
- セグメンテーション管理: 生成されたセグメンテーション結果を保存し、後で編集や再利用することができます。
- プロンプトの伝播: 一度設定したプロンプトをすべてのフレームに反映させることが可能です。

使い方

1. 動画のアップロード: `/front/public/videos`配下に動画を配置し、ファイル名を入力して`Start Viewer`ボタンをクリックすると、SAM2 による編集画面に遷移します。
2. プロンプトの追加: セグメンテーションしたい部分をクリックしてプロンプトを追加し、セグメンテーションに反映させます。
3. プロンプトの一時的反映: プロンプトを追加した後、`Apply Prompts`ボタンをクリックすると、セグメンテーション結果がプロンプトを追加したフレームにのみ反映されます。
4. プロンプトの永続的反映: `Propagate Prompts`ボタンをクリックすると、セグメンテーション結果が全フレームに反映されます。
5. 結果の確認と管理: セグメンテーション結果を確認し、`Export Video`ボタンをクリックすることで mp4 形式で保存することができます。

技術スタック

- フロントエンド: Next.js
- バックエンド: FastAPI
- セグメンテーション手法: SAM2

## デモ画像

![demo](/images/demo.png)

## 環境構築

### back

1. `back`ディレクトリに移動する

   ```bash
   cd back
   ```

2. 以下のコマンドを実行し、依存パッケージをインストールする

   ```bash
   ./setup.sh
   ```

3. `direnv`を使用して`.envrc`ファイルを作成し、以下の環境変数を設定する (xxxxx は適切なパスに置き換える)

   ```
   export PYTHONPATH=/xxxxx/sam2-segmentation-app/back/api
   export PUBLIC_DIR=/xxxxx/sam2-segmentation-app/front/public
   ```

4. 以下のコマンドを実行し、開発サーバーを立ち上げる
   ```bash
   make dev
   ```

### front

1. `front`ディレクトリに移動する

   ```bash
   cd front
   ```

2. [Volta](https://volta.sh/) を使用して Node.js と Yarn をインストールする

   ```bash
   volta install node
   volta install yarn
   ```

3. 以下のコマンドを実行し、依存パッケージをインストールする

   ```bash
   yarn
   ```

4. 環境変数ファイル`.env.local`を作成し、以下の環境変数を設定する

   ```
   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
   ```

5. `public/videos`配下に mp4 ファイルを配置する

6. 以下のコマンドを実行し、開発サーバーを立ち上げる

   ```bash
   yarn dev
   ```

7. [http://localhost:3000](http://localhost:3000)へアクセスしてページが表示されれば OK

## TODOs

- [x] Implement the function to apply prompts temporarily
- [x] Implement the function to propagate prompts to forward frames
- [x] Implement the function to export the segmented video
- [x] Implement the function to propagate prompts to all frames
- [ ] Implement functions for MPS (CPU) devices
- [ ] Clean the code further

