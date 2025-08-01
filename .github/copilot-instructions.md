# Receipt Snap - Development Guidelines

SolidJSモバイルファーストアプリケーション。確立されたパターンとベストプラクティスに従う。

## Core Principles
- **Simplicity**: コードを最小限で明確に保つ
- **Best Practices**: SolidJS、TypeScript、Tailwindの規約に従う
- **Incremental Changes**: 慎重に計画し、段階的に実装する
- **Minimal Structure**: 不要なファイル作成やコードの複雑性を避ける

## Communication & Convention
- チャットのやり取りは日本語
- コメントは英語
- エラーメッセージは英語
- コンソールログは英語（開発環境のみ）
- コミットメッセージは英語
- **Commit Messages**: 
  - `feat:` 新機能追加
  - `fix:` バグ修正
  - `chore:` その他の変更（ドキュメント、設定等）
  - `refactor:` リファクタリング
  - `style:` スタイルの変更（コードフォーマット等）
- **Branch Naming**:
  - `feature/` 新機能
  - `bugfix/` バグ修正
  - `chore/` その他の変更
  - `refactor/` リファクタリング
- **Pull Request**:
  - タイトルは英語で簡潔に
  - 説明は日本語で詳細に

## Change Management
- **Plan First**: 実装前に影響を分析
- **Step-by-Step**: 増分変更と検証
- **Simplify**: 新ファイル・複雑性が本当に必要か検討
- **Confirm**: 重要な変更は承認を得る

## Tech Stack Best Practices

### SolidJS
- **関数コンポーネントのみを使用**: すべてのUIは関数で定義する。
- **シグナル（`createSignal`）で状態管理**: 必要最小限の状態のみを持ち、props/stateの過剰なネストを避ける。
- **リアクティブプリミティブを活用**: `createSignal`, `createEffect`, `createMemo`などSolidのリアクティブAPIを正しく使う。
- **JSX内でシグナルは関数呼び出しで参照**: 例 `count()`。直接値を参照しない。
- **propsはreadonly**: propsを直接変更しない。
- **副作用は`createEffect`で管理**: DOM操作や非同期処理は`createEffect`内で行う。
- **コンポーネント分割は最小限・単機能**: 再利用性と可読性を重視し、肥大化を避ける。
- **TypeScript型厳守**: propsや返り値に型を明示し、`any`禁止。
- **アクセシビリティ**: 適切なARIA属性を付与し、キーボード操作も考慮。
- **パフォーマンス**: 不要な再レンダリングを避け、必要な部分だけをリアクティブに。
- **アンチパターン回避**: 
  - React的なuseState/useEffectの思考を持ち込まない
  - シグナルやストアの過剰な多用を避ける
  - JSX内で重い計算や副作用を直接書かない

### TypeScript
- **型安全を最優先**: すべての値・関数・propsに型を明示。`any`は原則禁止。
- **型推論を活用**: 明示的な型注釈は必要な場合のみ。型推論を信頼する。
- **interfaceとtypeの使い分け**: オブジェクト形状は`interface`、ユニオンや型合成は`type`。
- **strictNullChecks有効化**: null/undefinedの扱いを厳格に。
- **関数の引数・返り値に型を付与**: コールバックや非同期関数も含めて型を明示。
- **リテラル型・ユニオン型を活用**: 状態や定数値の表現に使う。
- **型エイリアス・ジェネリクスの活用**: 再利用性・拡張性を意識。
- **型アサーションは最小限に**: 型安全を損なうため多用しない。
- **型定義ファイルの整理**: 共通型は`types/`ディレクトリ等で一元管理。

### Tailwind CSS
- **ユーティリティファースト**: 可能な限りユーティリティクラスのみでスタイリング。
- **モバイルファースト設計**: レスポンシブは`sm:`, `md:`等のプリフィックスで段階的に。
- **状態・バリアント活用**: `hover:`, `focus:`, `dark:`等で状態ごとに明示的に記述。
- **クラスの合成・再利用**: 複雑なUIはコンポーネント化し、クラスの重複を避ける。
- **カスタムCSSは最小限**: 必要な場合のみ`@layer`や`[style]`属性で追加。
- **アクセシビリティ考慮**: ARIA属性やフォーカスリング等を適切に付与。
- **衝突回避**: 同じプロパティのクラスを複数指定しない。
- **arbitrary value活用**: テーマ外の値は`[value]`記法で柔軟に指定。

## Code Quality
- 自明なコメント・変更履歴コメント禁止
- 複雑なロジックのみコメント可
- 適切なARIA属性を配置
