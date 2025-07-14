# Receipt Snap - Development Guidelines

SolidJSモバイルファーストレシートアプリ。確立されたパターンとベストプラクティスに従う。

## Core Principles
- **Simplicity**: コードを最小限で明確に保つ
- **Best Practices**: SolidJS、TypeScript、Tailwindの規約に従う
- **Incremental Changes**: 慎重に計画し、段階的に実装する
- **Minimal Structure**: 不要なファイルや複雑性を避ける

## Tech Stack Best Practices

### SolidJS
- プロップドリリングよりもストア直接アクセス
- リアクティブ同期にはcreateEffectを使用
- カスタムフックは複雑なビジネスロジックのみ
- コンポーネントは100行以下、単一責任

### TypeScript
- 厳密な型安全性、`any`禁止
- 必要に応じてtype-onlyインポート
- オブジェクト形状にはinterface、ユニオンにはtype

### Tailwind CSS
- モバイルファースト設計
- ユーティリティクラス優先
- カスタムCSSは最小限

## Architecture
```
src/
├── components/ui/       # 再利用可能UIコンポーネント
├── components/features/ # 機能固有コンポーネント
├── hooks/              # ビジネスロジック
├── stores/             # グローバル状態
├── services/           # 外部API
├── types/              # 型定義
└── utils/              # 純粋関数
```

## Code Quality
- 複雑なロジックのみ英語でコメント
- 自明なコメントや変更履歴コメント禁止
- コンソールログは英語、開発環境のみ
- 適切なARIA属性を配置

## Change Management
- **Plan First**: 実装前に影響を分析
- **Step-by-Step**: 増分変更と検証
- **Simplify**: 新ファイル・複雑性が本当に必要か検討
- **Confirm**: 重要な変更は承認を得る
