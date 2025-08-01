# Receipt Snap - 経費申請アプリ

レシートを撮影して経費申請を行うモバイルファーストのWebアプリケーション。

## 機能

- 📸 **レシート撮影**: カメラ・ファイル選択によるレシート画像の取得
- 📝 **経費申請フォーム**: 名前、金額、日付、詳細、目的、備考を入力
- 📱 **モバイルファースト**: スマートフォンでの利用に最適化
- ✅ **リアルタイムバリデーション**: 入力中の即座なフォーム検証
- 🗜️ **画像圧縮**: 自動的な画像圧縮とサイズ最適化

## 技術スタック

- **フレームワーク**: SolidJS
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript
- **リンター**: Biome

## プロジェクト構成

```
src/
├── components/             # UIコンポーネント
│   ├── ui/                # 汎用UIパーツ
│   └── features/          # 機能別コンポーネント
│       ├── expense/       # 経費申請関連
│       └── receipt-camera/ # レシート撮影関連
├── hooks/                 # ビジネスロジック
├── stores/                # 状態管理
├── services/              # API通信
├── types/                 # 型定義
├── utils/                 # ユーティリティ
└── constants/             # 定数
```

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

## スクリプト

```bash
# 開発
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# コード品質チェック
npm run check
npm run lint
npm run format
```

## アーキテクチャ

### 設計原則

- **関心の分離**: UI、ビジネスロジック、状態管理を分離
- **単一責任**: 各コンポーネント・フックは一つの責務のみ
- **型安全性**: TypeScriptによる厳格な型チェック

### 主要パターン

- **hooks/**: ビジネスロジックとバリデーション
- **stores/**: グローバル状態管理（SolidJSシグナル）
- **components/**: UIのみに集中したプレゼンテーション層
