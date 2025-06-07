# Receipt Snap - 経費申請アプリ

レシートを撮影して経費申請を行うモバイルファーストのWebアプリケーションです。

## 機能

- 📸 **レシート撮影**: カメラを使用してレシートを撮影
- 📝 **経費申請フォーム**: 名前、金額、日付、カテゴリ、備考を入力
- 📱 **モバイルファースト**: スマートフォンでの利用に最適化
- ✅ **バリデーション**: 画像ファイルの形式・サイズチェック
- 🎨 **シンプルなUI**: フォーマルで使いやすいデザイン

## 技術スタック

- **フレームワーク**: SolidJS
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript
- **リンター**: Biome

## プロジェクト構成

```
src/
├── components/          # UIコンポーネント
│   ├── Button.tsx      # ボタンコンポーネント
│   ├── Card.tsx        # カードコンポーネント
│   ├── Input.tsx       # 入力フィールド
│   ├── Label.tsx       # ラベル
│   ├── Select.tsx      # セレクトボックス
│   ├── Textarea.tsx    # テキストエリア
│   ├── ReceiptCamera.tsx   # レシート撮影
│   └── ExpenseForm.tsx     # メインフォーム
├── types/
│   └── expense.ts      # 型定義
├── utils/
│   └── api.ts         # API関連ユーティリティ
├── App.tsx            # メインアプリケーション
├── index.tsx          # エントリーポイント
└── index.css          # グローバルスタイル
```

## 開発環境のセットアップ

1. 依存関係のインストール:
   ```bash
   npm install
   ```

2. 開発サーバーの起動:
   ```bash
   npm run dev
   ```

3. ブラウザで `http://localhost:5173` にアクセス

## API仕様

### 経費申請送信

**エンドポイント**: `POST /api/expenses`

**リクエスト** (FormData):
- `name`: string - 申請者名
- `amount`: string - 金額
- `date`: string - 日付 (YYYY-MM-DD)
- `category`: string - カテゴリ
- `notes`: string - 備考 (オプション)
- `receiptImage`: File - レシート画像

**レスポンス**:
```json
{
  "id": "exp_1234567890",
  "status": "success" | "error",
  "message": "経費申請が正常に送信されました",
  "submittedAt": "2024-01-01T12:00:00.000Z"
}
```

## カテゴリ一覧

- 交通費 (transportation)
- 食事代 (meals)
- 宿泊費 (accommodation)
- 事務用品 (office_supplies)
- 通信費 (communication)
- 接待費 (entertainment)
- その他 (other)

## 画像ファイル要件

- **対応形式**: JPEG, PNG, WebP, HEIC/HEIF
- **最大サイズ**: 100MB（最新のスマートフォンカメラに対応）
- **自動圧縮**: 
  - 最大解像度: 800×1200px（標準）
  - JPEG品質: 30-70%（ファイルサイズに応じて動的調整）
  - 目標ファイルサイズ: 500KB以下
- **段階的圧縮**: 50MB以上の大きなファイルには段階的処理を適用
- **デバイス最適化**: デバイス性能に基づいて圧縮設定を自動調整
- **メモリ最適化**: 大きなファイル処理時のメモリ使用量を最小化
- **推奨**: スマートフォンのカメラで撮影したレシート画像

### パフォーマンス特性

- **小さなファイル（< 20MB）**: 高品質圧縮、高速処理
- **中程度ファイル（20-50MB）**: バランス型圧縮
- **大きなファイル（50-80MB）**: 段階的圧縮、プログレス表示
- **非常に大きなファイル（80-100MB）**: 積極的圧縮、メモリ最適化

## ビルド

本番用ビルドの作成:
```bash
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

## コード品質

- **フォーマット**: `npm run format`
- **リント**: `npm run lint`
- **チェック**: `npm run check`

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

Learn more about deploying your application with the [documentations](https://vite.dev/guide/static-deploy.html)
