# Receipt Snap - 経費申請アプリ（リファクタリング版）

レシートを撮影して経費申請を行うモバイルファーストのWebアプリケーションです。

## 機能

- 📸 **レシート撮影**: カメラを使用してレシートを撮影
- 📝 **経費申請フォーム**: 名前、金額、日付、カテゴリ、備考を入力
- 📱 **モバイルファースト**: スマートフォンでの利用に最適化
- ✅ **バリデーション**: リアルタイムフォームバリデーション
- 🎨 **シンプルなUI**: フォーマルで使いやすいデザイン
- 🏗️ **拡張可能な設計**: 保守性と拡張性を重視した設計

## 技術スタック

- **フレームワーク**: SolidJS
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript
- **リンター**: Biome

## 新しいプロジェクト構成（リファクタリング後）

```
src/
├── components/              # プレゼンテーション層
│   ├── Button.tsx          # ボタンコンポーネント
│   ├── Input.tsx           # 入力フィールド
│   ├── Label.tsx           # ラベル
│   ├── Select.tsx          # セレクトボックス
│   ├── Textarea.tsx        # テキストエリア
│   ├── ReceiptCamera.refactored.tsx   # レシート撮影（リファクタリング版）
│   └── ExpenseForm.refactored.tsx     # メインフォーム（リファクタリング版）
├── hooks/                   # カスタムフック（状態管理）
│   ├── useExpenseForm.ts   # 経費フォームの状態管理
│   └── useImageUpload.ts   # 画像アップロード・圧縮の状態管理
├── services/               # サービス層（通信・ビジネスロジック）
│   ├── apiService.ts       # API通信サービス
│   ├── imageService.ts     # 画像処理サービス
│   └── performanceService.ts # パフォーマンス監視サービス
├── stores/                 # グローバル状態管理
│   └── appStore.ts         # アプリケーション全体の状態
├── validators/             # バリデーション機能
│   └── validation.ts       # 入力値検証ロジック
├── layouts/                # レイアウトコンポーネント
│   └── MainLayout.tsx      # メインレイアウト
├── types/                  # 型定義
│   ├── expense.ts          # 経費申請関連の型
│   ├── image.ts            # 画像処理関連の型
│   └── ui.ts               # UI関連の型
├── utils/                  # 純粋関数ユーティリティ
│   ├── dateUtils.ts        # 日付操作
│   ├── imageCompression.ts # 画像圧縮（既存）
│   └── api.ts              # 後方互換性用（@deprecated）
├── constants/              # 定数定義
│   └── compression.ts      # 圧縮設定
├── App.tsx                 # メインアプリケーション
├── index.tsx               # エントリーポイント
└── index.css               # グローバルスタイル
```

## アーキテクチャ設計原則

### 1. 関心の分離（Separation of Concerns）

- **プレゼンテーション層** (`components/`): UIの描画のみを担当
- **状態管理層** (`hooks/`, `stores/`): ビジネスロジックと状態管理
- **サービス層** (`services/`): 外部通信とデータ処理
- **バリデーション層** (`validators/`): 入力値検証
- **ユーティリティ層** (`utils/`): 純粋関数

### 2. 単一責任の原則（Single Responsibility Principle）

- 各ファイル・関数は一つの責務のみを持つ
- 例：`useExpenseForm`はフォーム状態のみ、`ApiService`は通信のみ

### 3. 依存性の逆転（Dependency Inversion Principle）

- 高レベルモジュールは低レベルモジュールに依存しない
- 抽象に依存し、具象に依存しない

### 4. 拡張可能性（Extensibility）

- 新機能追加が既存コードに影響しない設計
- インターフェースベースの設計

## コンポーネント設計指針

### カスタムフック (`hooks/`)

```typescript
// ✅ Good: 状態管理とビジネスロジックを分離
export function useExpenseForm() {
  const [state, setState] = createSignal();
  
  const submitForm = async () => {
    // ビジネスロジック
  };
  
  return { state, actions: { submitForm } };
}
```

### プレゼンテーション层 (`components/`)

```typescript
// ✅ Good: UIの描画のみに集中
export function ExpenseForm() {
  const { state, actions } = useExpenseForm();
  
  return (
    <form onSubmit={actions.submitForm}>
      {/* UI要素のみ */}
    </form>
  );
}
```

### サービス層 (`services/`)

```typescript
// ✅ Good: 通信とデータ処理を分離
export class ApiService {
  async submitExpense(data: ExpenseRequest): Promise<ExpenseResponse> {
    // API通信のみ
  }
}
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

## 新機能の追加方法

### 1. 新しいフォームフィールドの追加

1. `types/expense.ts` に型定義を追加
2. `hooks/useExpenseForm.ts` に状態管理を追加
3. `components/ExpenseForm.refactored.tsx` にUI要素を追加
4. `validators/validation.ts` にバリデーションを追加

### 2. 新しいAPIエンドポイントの追加

1. `types/` に新しい型定義を追加
2. `services/apiService.ts` に新しいメソッドを追加
3. 必要に応じて新しいカスタムフックを作成

### 3. 新しいページの追加

1. `layouts/` に必要に応じて新しいレイアウトを作成
2. `components/` に新しいページコンポーネントを作成
3. `hooks/` に状態管理フックを作成

## テスト戦略

```
tests/
├── unit/                   # 単体テスト
│   ├── hooks/             # カスタムフックのテスト
│   ├── services/          # サービス層のテスト
│   └── validators/        # バリデーション層のテスト
├── integration/           # 統合テスト
│   └── components/        # コンポーネントのテスト
└── e2e/                   # E2Eテスト
    └── flows/             # ユーザーフローのテスト
```

## パフォーマンス監視

- `PerformanceService`による処理時間の計測
- 画像圧縮のメトリクス収集
- デバッグモードでの詳細ログ出力

## ビルドとデプロイ

```bash
# 本番用ビルド
npm run build

# プレビュー
npm run preview

# コード品質チェック
npm run check
```

## 移行ガイド

### 旧バージョンからの移行

1. **API呼び出し**:
   ```typescript
   import { apiService } from "@/services/apiService";
   await apiService.submitExpense(data);
   ```

2. **バリデーション**:
   ```typescript
   import { ValidationService } from "@/validators/validation";
   ValidationService.validateImageFile(file);
   ```

3. **状態管理**:
   ```typescript
   // 旧: コンポーネント内で直接管理
   const [name, setName] = createSignal("");
   
   // 新（推奨）: カスタムフックを使用
   const { name, setName } = useExpenseForm();
   ```

## 貢献ガイドライン

1. 新機能は適切な層に実装する
2. 単一責任の原則を守る
3. TypeScriptの型安全性を活用する
4. 適切な抽象化レベルを保つ
5. テストを書く（今後追加予定）

## ライセンス

MIT License
