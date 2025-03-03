# FastAPI Template

FastAPI によるバックエンド開発のためのテンプレートです

## 環境構築

### パッケージインストール

```bash
uv sync
```

### データ配置

- `back/submodules`配下に sam2 のリポジトリを配置する
- `back/checkpoints`配下に`sam2.1_hiera_large.pt`を配置する
- `back/configs/sam2.1`配下に`sam2.1_hiera_l.yaml`を配置する

### 環境変数設定

- `direnv`を使用して`.envrc`ファイルを作成し、以下の環境変数を設定する

```bash
export PYTHONPATH=/xxx/sam2-segmentation-app/back/api
export PUBLIC_DIR=/xxx/sam2-segmentation-app/front/public
```

### 開発サーバーの立ち上げ

```bash
make dev
```

```bash
# Swagger UIの確認
# ブラウザで`http://127.0.0.1:8000/docs`にアクセス
```
