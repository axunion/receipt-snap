# Receipt Snap - Development Guidelines

SolidJSモバイルファーストPWAアプリケーション。経費申請レシート撮影に特化した開発ガイドライン。

## Core Principles
- **Mobile First**: スマートフォン利用を最優先に設計
- **Simplicity**: コードを最小限で明確に保つ
- **Best Practices**: SolidJS、TypeScript、Tailwindの規約に従う
- **Incremental Changes**: 慎重に計画し、段階的に実装する
- **Minimal Structure**: 不要なファイル作成やコードの複雑性を避ける
- **Type Safety**: 厳格な型チェックで実行時エラーを防止

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

## Architecture Patterns

### Project Structure
```
src/
├── components/
│   ├── ui/                # 汎用UIコンポーネント（Button、Input、Modal等）
│   └── features/          # 機能別コンポーネント（FormFields、ReceiptCamera等）
├── hooks/                 # ビジネスロジックとバリデーション
├── stores/                # グローバル状態管理（SolidJSシグナル）
├── services/              # API通信・外部サービス連携
├── types/                 # 型定義の一元管理
├── utils/                 # ユーティリティ関数
└── constants/             # 設定値・定数
```

### Component Design Patterns
- **ui/**: プレゼンテーションのみ。ビジネスロジック禁止
- **features/**: ドメイン固有のコンポーネント。hooks/storesと連携
- **1コンポーネント1ファイル**: 分割しすぎず、適切な粒度を保つ
- **props drilling回避**: 深いネストでのprops受け渡しは stores で解決

### State Management Strategy
- **Local State**: `createSignal`で単一コンポーネント内の状態
- **Global State**: `stores/`でアプリ全体の状態（`createRoot`で永続化）
- **Server State**: `createResource`でAPI通信とキャッシュ
- **Form State**: `expenseFormStore`で統一管理、リアクティブバリデーション

### Hook Design Patterns
- **Pure Logic**: UIから分離されたビジネスロジック
- **Validation**: リアルタイム + サブミット時の二段階バリデーション
- **Side Effects**: `createEffect`で適切な副作用管理
- **Composition**: 複数hookの組み合わせでカスタムフック作成

## Tech Stack Best Practices

### SolidJS
- **関数コンポーネントのみを使用**: すべてのUIは関数で定義する。
- **シグナル（`createSignal`）で状態管理**: 必要最小限の状態のみを持ち、props/stateの過剰なネストを避ける。
- **リアクティブプリミティブを活用**: `createSignal`, `createEffect`, `createMemo`, `createResource`などSolidのリアクティブAPIを正しく使う。
- **JSX内でシグナルは関数呼び出しで参照**: 例 `count()`。直接値を参照しない。
- **propsはreadonly**: propsを直接変更しない。必要に応じてsetter関数を渡す。
- **副作用は`createEffect`で管理**: DOM操作や非同期処理は`createEffect`内で行う。依存関係を明確に。
- **コンポーネント分割は最小限・単機能**: 再利用性と可読性を重視し、肥大化を避ける。
- **TypeScript型厳守**: propsや返り値に型を明示し、`any`禁止。
- **アクセシビリティ**: 適切なARIA属性を付与し、キーボード操作も考慮。
- **パフォーマンス**: 不要な再レンダリングを避け、必要な部分だけをリアクティブに。
- **条件付きレンダリング**: `<Show>`, `<For>`, `<Switch>`を適切に使い分ける。
- **Portal活用**: `<Portal>`でモーダル・オーバーレイを適切に実装。
- **リソース管理**: `onCleanup`でリソース解放を確実に行う。
- **Store設計**: `createRoot`でグローバルストアを作成、適切にスコープを管理。
- **アンチパターン回避**: 
  - React的なuseState/useEffectの思考を持ち込まない
  - シグナルやストアの過剰な多用を避ける
  - JSX内で重い計算や副作用を直接書かない
  - `createEffect`の依存関係を曖昧にしない

### TypeScript
- **型安全を最優先**: すべての値・関数・propsに型を明示。`any`は原則禁止。
- **型推論を活用**: 明示的な型注釈は必要な場合のみ。型推論を信頼する。
- **interfaceとtypeの使い分け**: オブジェクト形状は`interface`、ユニオンや型合成は`type`。
- **strictNullChecks有効化**: null/undefinedの扱いを厳格に。
- **関数の引数・返り値に型を付与**: コールバックや非同期関数も含めて型を明示。
- **リテラル型・ユニオン型を活用**: 状態や定数値の表現に使う（例：`TabType = "camera" | "file" | "no-image"`）。
- **型エイリアス・ジェネリクスの活用**: 再利用性・拡張性を意識。
- **型アサーションは最小限に**: 型安全を損なうため多用しない。型ガードを優先。
- **型定義ファイルの整理**: 共通型は`types/`ディレクトリ等で一元管理。
- **Discriminated Union活用**: API レスポンス等で`result: 'done' | 'error'`パターンを使用。
- **型安全なEvent Handler**: `Event`, `InputEvent`等の適切な型を使用。
- **Utility Types活用**: `Partial`, `Pick`, `Omit`, `Record`等を適切に使用。
- **const assertions**: `as const`でリテラル型を保持。
- **Optional Chaining**: `?.`演算子で安全なプロパティアクセス。
- **Nullish Coalescing**: `??`演算子でfalsyな値とnull/undefinedを区別。

### Tailwind CSS
- **ユーティリティファースト**: 可能な限りユーティリティクラスのみでスタイリング。
- **モバイルファースト設計**: レスポンシブは`sm:`, `md:`等のプリフィックスで段階的に。
- **状態・バリアント活用**: `hover:`, `focus:`, `focus-visible:`, `active:`, `disabled:`等で状態ごとに明示的に記述。
- **クラスの合成・再利用**: 複雑なUIはコンポーネント化し、クラスの重複を避ける。
- **カスタムCSSは最小限**: 必要な場合のみ`@layer`や`[style]`属性で追加。
- **アクセシビリティ考慮**: フォーカスリング（`focus:ring-2`）、コントラスト比、適切な色使い。
- **衝突回避**: 同じプロパティのクラスを複数指定しない。後勝ちルールに注意。
- **arbitrary value活用**: テーマ外の値は`[value]`記法で柔軟に指定（例：`h-[env(keyboard-inset-height)]`）。
- **セマンティックな色使い**: 用途別の色分け（`sky-`系統をプライマリ、`red-`系統をエラーに統一）。
- **レスポンシブタイポグラフィ**: `text-base lg:text-lg`等で段階的なサイズ調整。
- **Grid・Flexbox活用**: `grid`, `flex`レイアウトを適切に使い分け。
- **アニメーション**: `transition-*`, `animate-*`で適度なマイクロインタラクション。
- **Space・Gap**: `space-y-*`, `gap-*`で一貫した余白設計。
- **Container Queries**: `@container`でコンポーネント単位のレスポンシブ対応（Tailwind v4対応時）。

## Mobile & PWA Best Practices
- **タッチターゲット**: 最小44px x 44pxのタップ可能領域を確保
- **セーフエリア**: `env(safe-area-inset-*)`でノッチ・ホームバーに対応
- **キーボード表示**: `env(keyboard-inset-height)`で仮想キーボードレイアウト調整
- **ジェスチャー**: スワイプ・ピンチズーム等のネイティブ操作をサポート
- **オフライン対応**: ネットワーク状況に応じた適切なフィードバック
- **メタタグ最適化**: viewport, theme-color, manifest等のPWA設定

## Image Processing Guidelines
- **HEIC対応**: `createImageBitmap`でHEIC/HEIFをJPEGに変換
- **圧縮戦略**: レシート用（900x1600）、品質70%を標準設定
- **フォールバック**: HEIC処理失敗時は従来のImage要素で処理継続
- **メモリ管理**: `URL.revokeObjectURL`でオブジェクトURLを適切に解放
- **進捗表示**: 画像処理中のローディング状態を明示
- **エラー処理**: 形式未対応・サイズ超過時の分かりやすいエラーメッセージ

## Validation Strategy
- **リアルタイムバリデーション**: `createEffect`でフィールド変更時の即座な検証
- **段階的エラー表示**: フォーカス離脱後（touched）にエラーを表示
- **統一メッセージ**: `constants/validationMessages.ts`でメッセージを一元管理
- **型安全なバリデーション**: 各フィールド用のバリデーション関数を個別定義
- **複合バリデーション**: 複数フィールドにまたがる検証ルール

## Error Handling Patterns
- **レイヤー別エラー処理**: 
  - **UI Layer**: ユーザー向けエラー表示
  - **Service Layer**: API通信エラーのハンドリング
  - **Utility Layer**: 画像処理等の機能エラー
- **一貫性のあるエラー形式**: `{ result: 'error', error: string }`
- **ユーザビリティ重視**: 技術的詳細ではなく、対処法を伝える
- **ログ出力**: 開発環境でのみ詳細ログ、本番では最小限

## Code Quality

### Professional Development Process
- **計画重視**: 複数ファイル・複数パターンの変更前に、必ず綿密な実装計画を策定
- **段階的実装**: 大きな変更は小さな単位に分割し、各段階で動作検証を実施
- **影響分析**: 変更がシステム全体に与える影響を事前に評価・文書化
- **承認プロセス**: 重要な変更は実装前にレビューと承認を得る
- **リスク管理**: 各変更のリスクレベルを評価し、適切な対策を準備
- **ロールバック戦略**: 問題発生時の迅速な復旧手順を事前に計画

### Implementation Standards
- **自明なコメント・変更履歴コメント禁止**: コードを読めば分かることは書かない
- **複雑なロジックのみコメント**: アルゴリズムやビジネスルールの説明に集中
- **適切なARIA属性を配置**: アクセシビリティを常に考慮した実装
- **一貫性のある命名規則**: プロジェクト全体で統一された命名パターン
- **DRY原則の徹底**: 重複コードの排除、適切な抽象化の実践
- **SOLID原則の適用**: 単一責任、拡張性、依存関係の適切な管理

### Change Management Protocol
1. **要件分析**: 変更の必要性と範囲を明確化
2. **設計レビュー**: アーキテクチャへの影響を評価
3. **実装計画**: 段階的な実装ステップを詳細化
4. **テスト戦略**: 各段階での検証方法を策定
5. **デプロイ計画**: 安全な展開手順を準備
6. **モニタリング**: 変更後の動作監視体制を構築

### Quality Assurance
- **コードレビュー**: 全ての変更に対する peer review の実施
- **型チェック**: TypeScript strict mode での厳格な型検証
- **リント**: Biome による一貫したコード品質の維持
- **パフォーマンス**: メモリリーク、不要な再レンダリングの回避
- **アクセシビリティ**: WCAG 2.1 AA レベルへの準拠
