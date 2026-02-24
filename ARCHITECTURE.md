# ARCHITECTURE - Book Tracker

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | React（Vite） |
| バックエンド | Cloudflare Workers |
| データベース | Cloudflare D1（SQLite互換） |
| キャッシュ | Cloudflare KV |
| 外部API | Open Library API |
| ホスティング | Cloudflare Workers（静的アセット配信 + API） |

## ディレクトリ構成

```
book-tracker/
├── src/
│   ├── index.js          # Workers エントリーポイント（APIルーティング）
│   ├── api/
│   │   ├── books.js      # 読書リストのCRUD処理
│   │   └── search.js     # Open Library API検索処理
│   └── frontend/         # React アプリ（Vite でビルド）
│       ├── index.html
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/
│       │   ├── SearchBar.jsx      # 検索フォーム
│       │   ├── SearchResults.jsx  # 検索結果一覧
│       │   ├── BookList.jsx       # 読書リスト一覧
│       │   └── BookCard.jsx       # 本のカード（共通）
│       └── styles/
│           └── app.css
├── migrations/
│   └── 0001_create_books.sql     # テーブル定義
├── wrangler.jsonc
└── package.json
```

## 画面構成（2画面）

### 1. 検索画面
- 検索バー（タイトル or 著者で検索）
- 検索結果一覧（表紙サムネイル・タイトル・著者）
- 「追加」ボタン → 読書リストに保存

### 2. 読書リスト画面
- 本の一覧（表紙・タイトル・著者・ステータス）
- ステータス切替ボタン（読みたい → 読書中 → 読了）
- 削除ボタン

## Workers APIエンドポイント（4つ）

| メソッド | パス | 処理 |
|---------|------|------|
| GET | `/api/books` | 読書リスト一覧取得 |
| POST | `/api/books` | 本を読書リストに追加 |
| PATCH | `/api/books/:id` | ステータス変更 |
| DELETE | `/api/books/:id` | 読書リストから削除 |
| GET | `/api/search?q=キーワード` | Open Library APIで検索（KV経由） |

## D1 テーブル設計（1テーブル）

### books テーブル

| カラム | 型 | 説明 |
|--------|---|------|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 一意のID |
| title | TEXT NOT NULL | 書籍タイトル |
| author | TEXT | 著者名 |
| cover_url | TEXT | 表紙画像URL |
| status | TEXT DEFAULT '読みたい' | 読みたい / 読書中 / 読了 |
| created_at | TEXT DEFAULT (datetime('now')) | 登録日時 |

## KV キャッシュ設計

| キー | 値 | TTL |
|------|---|-----|
| `search:{検索キーワード}` | Open Library APIの検索結果JSON | 24時間（86400秒） |

Open Library APIは無制限だが、同じ検索を何度も投げる必要はない。
一度検索した結果は24時間キャッシュする。

## 外部API連携

### Open Library Search API
- エンドポイント: `https://openlibrary.org/search.json?q={キーワード}`
- 認証: 不要
- 取得するフィールド: title, author_name, cover_i
- 表紙画像URL: `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`
- Workers経由で呼ぶ（フロントから直接呼ばない）

## データの流れ

```
【検索】
ユーザー → React → Workers /api/search
  → KVにキャッシュあり → KVから返す
  → KVにキャッシュなし → Open Library API → KVに保存 → 返す

【追加】
ユーザー → React → Workers /api/books (POST) → D1に INSERT

【一覧】
ユーザー → React → Workers /api/books (GET) → D1から SELECT

【ステータス変更】
ユーザー → React → Workers /api/books/:id (PATCH) → D1で UPDATE

【削除】
ユーザー → React → Workers /api/books/:id (DELETE) → D1で DELETE
```
