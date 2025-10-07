# Receipt Snap

レシートを撮影して経費申請を行うモバイルファーストのWebアプリケーション。

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

### 必要な環境

- Node.js 22.20.0 (Volta使用推奨)
- npm または pnpm

### セットアップ手順

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

## スクリプト

```bash
# 開発サーバー
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# コード品質
npm run check        # 全チェック (フォーマット + リント)
npm run lint         # リント実行
npm run format       # フォーマット確認

# 自動修正
npm run check:write  # 全自動修正
npm run lint:write   # リント自動修正
npm run format:write # フォーマット自動修正
```

## アーキテクチャ

### 設計原則

- **Mobile First**: スマートフォン利用を最優先に設計
- **関心の分離**: UI、ビジネスロジック、状態管理を明確に分離
- **単一責任**: 各コンポーネント・フックは一つの責務のみ
- **型安全性**: TypeScript strict modeによる厳格な型チェック

### 主要パターン

- **components/ui/**: プレゼンテーションのみ。ビジネスロジック禁止
- **components/features/**: ドメイン固有コンポーネント。hooks/storesと連携
- **hooks/**: UIから分離されたビジネスロジック・バリデーション
- **stores/**: `createRoot`によるグローバル状態管理
- **services/**: API通信・外部サービス連携の抽象化

### 状態管理戦略

- **Local State**: `createSignal`で単一コンポーネント内の状態
- **Global State**: stores/でアプリ全体の状態管理
- **Form State**: `expenseFormStore`で統一管理、リアクティブバリデーション
- **Server State**: `createResource`でAPI通信とキャッシュ
