# Receipt Snap

個人や小規模チーム向けの、シンプルなレシート管理・経費申請アプリです。スマートフォンでレシートを撮影し、任意のバックエンドAPIに送信して記録できます。

## 機能

- 📸 **レシート撮影**: カメラ・ファイルアップロード・画像なしの3つの入力方法
- 📝 **経費申請フォーム**: 名前、金額、日付、詳細、目的、備考を入力
- 📱 **モバイルファースト**: スマートフォンでの利用に最適化されたUI
- ✅ **リアルタイムバリデーション**: 入力中の即座なフォーム検証
- 🗜️ **画像圧縮**: HEIC/HEIF対応の自動画像圧縮とサイズ最適化
- 🔄 **オンボーディング**: 初回利用時の名前設定とローカル保存

## 技術スタック

- **フレームワーク**: SolidJS
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript
- **コード品質**: Biome
- **アイコン**: Iconify Icon

## クイックスタート

```bash
# 1. 依存関係のインストール
pnpm install

# 2. 環境変数の設定
# .env.localファイルをプロジェクトルートに作成し、以下を設定してください
# VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
# VITE_API_BASE_URL=your_backend_api_url

# 3. 開発サーバー起動
pnpm run dev

# 4. ブラウザで http://localhost:5173 を開く
```

## プロジェクト構成

```
src/
├── components/            # UIコンポーネント
│   ├── ui/               # 汎用UIコンポーネント
│   └── features/         # 機能別コンポーネント
├── hooks/                # ビジネスロジック・バリデーション
├── stores/               # グローバル状態管理
├── services/             # API通信・外部サービス連携
├── types/                # 型定義
├── utils/                # ユーティリティ関数
├── constants/            # 設定値・定数
└── layouts/              # レイアウトコンポーネント
```

## 開発環境のセットアップ

### 環境変数の設定

`.env.local`ファイルをプロジェクトルートに作成してください：

```env
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
VITE_API_BASE_URL=your_backend_api_url
```

**必要な環境変数：**
- `VITE_RECAPTCHA_SITE_KEY`: Google reCAPTCHA v3のサイトキー
- `VITE_API_BASE_URL`: バックエンドAPIのURL

### セットアップ手順

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm run dev

# ブラウザで http://localhost:5173 にアクセス
```
