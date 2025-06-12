# Receipt Snap - GitHub Copilot Instructions

SolidJS製モバイルファーストレシート登録アプリ。最適化済みアーキテクチャに従って開発してください。

## 技術スタック
- **SolidJS** + **TypeScript** + **Tailwind CSS** + **Vite**
- **アーキテクチャ**: 3層分離（UI・ロジック・状態）

## ディレクトリ構造
```
src/
├── components/ui/       # 汎用UIコンポーネント
├── components/features/ # 機能別コンポーネント（expense/, receipt-camera/）
├── hooks/              # ビジネスロジック
├── stores/             # グローバル状態管理
├── services/           # 外部API
├── types/              # TypeScript型
└── utils/              # ユーティリティ
```

## SolidJSパターン

### ✅ 推奨パターン
```typescript
// ストア直接アクセス
function MyComponent() {
  return <input value={store.value()} onInput={store.setValue} />;
}

// 複雑なロジックのみフック化
export function useExpenseForm() {
  const validation = useFormValidation();
  const submitForm = async () => { /* 複雑なロジック */ };
  return { validation, submitForm };
}

// createEffectで自動同期
createEffect(() => {
  if (store.resetTrigger()) {
    // 自動クリーンアップ
  }
});
```

### ❌ 禁止パターン
```typescript
// プロップス地獄（5個以上）
function BadComponent(props: { name: string; amount: string; onChange1: ...; onChange2: ...; }) { }

// ストアとフックの混在
export const badStore = { useValue: () => createSignal("") };

// 直接DOM操作
document.getElementById("input").value = "";
```

## 品質基準
- **SolidJS**: 哲学を守りベストプラクティスに従う
- **コンポーネント**: 100行以下、単一責任
- **型安全性**: `any`型禁止、type-onlyインポート
- **リアクティビティ**: ストア直接アクセス、createEffect活用
- **UI/UX**: モバイルファースト、適切なARIA属性
- **コメント**: わかりきったコメント禁止、変更履歴をコメントにしない、重要なコメントは英語で記述
- **コンソール出力**: console.log等のテキストは英語で統一、出力するのは開発環境のみ

## コメント・ログ規約

### ✅ 推奨パターン
```typescript
// Complex business logic explanation in English
const calculateCompression = (file: File) => {
  // Implementation without obvious comments
  return compressedFile;
};

console.log("Image compression completed:", metrics);
console.error("Failed to process image:", error.message);
```

### ❌ 禁止パターン
```typescript
// ❌ わかりきったコメント
const name = "田中"; // 名前を設定

// ❌ 日本語コンソール出力
console.log("画像を圧縮中...");
console.error("エラーが発生しました");
```
