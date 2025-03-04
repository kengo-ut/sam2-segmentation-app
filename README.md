# SAM2 Segmentation App

## 概要

SAM2-SEGMENTER は、SAM2（セグメンテーション手法）を活用した動画セグメンテーションアプリケーションです。このアプリケーションを使用すると、ユーザーは動画を柔軟にセグメンテーションし、結果を取得、管理することができます。

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
4. プロンプトの永続的反映: `Propagate Forward`ボタンをクリックすると、セグメンテーション結果が全フレームに反映されます。
5. 結果の確認と管理: セグメンテーション結果を確認し、`Export Video`ボタンをクリックすることで mp4 形式で保存することができます。

技術スタック

- フロントエンド: Next.js
- バックエンド: FastAPI
- セグメンテーション手法: SAM2

## デモ画像

![demo](/images/demo.png)

## 環境構築

### back

1. `back/.envrc`ファイルを作成し、必要な環境変数を設定する

2. `back/data/`配下に必要なデータを配置する

   - `back/submodules`配下に sam2 のリポジトリを配置する
   - `back/checkpoints`配下に`sam2.1_hiera_large.pt`を配置する
   - `back/configs/sam2.1`配下に`sam2.1_hiera_l.yaml`を配置する

3. `back`ディレクトリで以下のコマンドを実行し、依存パッケージをインストールする

   ```bash
   uv sync
   ```

4. `back`ディレクトリで以下のコマンドを実行し、開発サーバーを立ち上げる
   ```bash
   . .venv/bin/activate
   make dev
   ```

### front

5. `front`で使用する Node.js と Yarn のバージョンを設定する

   ```bash
   # 初回（package.jsonへ固定）
   volta pin node@20.15.0
   volta pin yarn@4.3.1

   # 以降（package.jsonから指定）
   volta install node
   volta install yarn
   ```

6. `front`ディレクトリで以下のコマンドを実行し、依存パッケージをインストールする

   ```bash
   yarn
   ```

7. `front`ディレクトリで以下のコマンドを実行し、Schema・API クライアントを生成

   ```bash
   yarn gen
   ```

8. `front`ディレクトリで、以下の環境変数ファイル`front/.env.local`を作成する

   ```
   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
   ```

9. `/front/public/videos`配下に mp4 ファイルを配置する

10. `front`ディレクトリで以下のコマンドを実行し、開発サーバーを立ち上げる

    ```bash
    yarn dev
    ```

11. [http://localhost:3000](http://localhost:3000)へアクセスしてページが表示されれば OK

## TODOs

- [ ] Implementation for MPS (CPU) Devices (Currently only supports CUDA)
- [ ] Clean the code further
- [x] Both directions of prompt propagation
