import BookCard from "./BookCard";

export default function SearchResults({ results, searching, onAdd, existingBooks }) {
  if (searching) {
    return <p className="message">検索中...</p>;
  }

  if (results.length === 0) {
    return null;
  }

  const existingTitles = new Set(existingBooks.map((b) => b.title));

  return (
    <div className="results">
      <h2>検索結果（{results.length}件）</h2>
      <div className="book-grid">
        {results.map((book, i) => (
          <BookCard key={i} book={book}>
            {existingTitles.has(book.title) ? (
              <span className="badge">追加済み</span>
            ) : (
              <button className="btn-add" onClick={() => onAdd(book)}>
                + 追加
              </button>
            )}
          </BookCard>
        ))}
      </div>
    </div>
  );
}
