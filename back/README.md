# back

## 環境構築

### パッケージインストール

```bash
./setup.sh
```

### 環境変数設定

`direnv`を使用して`.envrc`ファイルを作成し、以下の環境変数を設定する (xxx は適切なパスに置き換える)

```
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
