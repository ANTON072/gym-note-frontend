# TanStack Router ファイル命名規則

TanStack Router のファイルベースルーティングにおける命名規則のまとめです。

## 基本的な規則

### 1. ハイフン（`-`）プレフィックス - 除外

ファイルやフォルダをルート生成から**完全に除外**します。

```
routes/
├── posts.tsx
├── -posts-table.tsx        // 👈 除外される
├── -components/            // 👈 除外される
│   ├── header.tsx         // 👈 除外される
│   └── footer.tsx         // 👈 除外される
```

使用例：コンポーネント、ユーティリティ、ヘルパー関数などをルートディレクトリ内に配置したい場合

### 2. アンダースコア（`_`）プレフィックス - パスレスルート

URL パスを持たない**パスレスルート**を作成します。子ルートをラップしますが、URL には現れません。

```
routes/
├── _auth.tsx              // URLに現れない
├── _auth.dashboard.tsx    // URL: /dashboard （/_auth/dashboardではない）
├── _auth.profile.tsx      // URL: /profile
```

使用例：認証ガード、共通レイアウト、共通ロジックの適用

### 3. アンダースコア（`_`）サフィックス - 親ルートからの独立

親ルートの下にネストされずに、独立したルートを作成します。

```
routes/
├── posts.tsx           // URL: /posts
├── posts.post.tsx      // URL: /posts/post
├── posts_.edit.tsx     // URL: /edit （/posts/editではない！）
```

使用例：ファイル階層は保ちつつ、URL 階層は独立させたい場合

### 4. ドット（`.`）- ネストされたルート

ネストされた子ルートを表現します。

```
routes/
├── blog.tsx            // URL: /blog
├── blog.post.tsx       // URL: /blog/post
├── blog.category.tsx   // URL: /blog/category
```

### 5. ドルサイン（`$`）- 動的セグメント

動的な URL パラメータを定義します。

```
routes/
├── users.$id.tsx       // URL: /users/:id
├── posts.$slug.tsx     // URL: /posts/:slug
├── $lang.about.tsx     // URL: /:lang/about
```

### 6. 括弧（`()`）- ルートグループ

純粋に組織的な目的のグループ。ルートツリーやコンポーネントツリーには影響しません。

```
routes/
├── (app)/
│   ├── dashboard.tsx   // URL: /dashboard
│   ├── settings.tsx    // URL: /settings
├── (auth)/
│   ├── login.tsx       // URL: /login
│   └── register.tsx    // URL: /register
```

## 特殊なファイル名

- `index.tsx` または `route.tsx` - ディレクトリのメインルート
- `layout.tsx` または `route.tsx` - レイアウトコンポーネント
- `__root.tsx` - アプリケーションのルートレイアウト

## 実践的な例

```
routes/
├── __root.tsx                    // アプリケーションルート
├── index.tsx                     // URL: /
├── about.tsx                     // URL: /about
├── -components/                  // 除外（コンポーネント置き場）
│   └── Header.tsx
├── _auth.tsx                     // パスレス（認証レイアウト）
├── _auth.dashboard.tsx           // URL: /dashboard
├── admin.tsx                     // URL: /admin
├── admin.users.tsx               // URL: /admin/users
├── admin_.settings.tsx           // URL: /settings （独立）
├── blog/
│   ├── route.tsx                 // URL: /blog
│   ├── $slug.tsx                 // URL: /blog/:slug
│   └── -components/              // 除外
│       └── BlogCard.tsx
└── (marketing)/                  // グループ（URLに影響なし）
    ├── pricing.tsx               // URL: /pricing
    └── features.tsx              // URL: /features
```

## 注意事項

- `routeFilePrefix`、`routeFileIgnorePrefix`、`routeFileIgnorePattern`オプションを設定する際は、これらのトークンと競合しないよう注意が必要です
- ファイル名の命名規則は組み合わせて使用できます（例：`_auth.users.$id.tsx`）

## 参考

- [TanStack Router File Naming Conventions](https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions)
