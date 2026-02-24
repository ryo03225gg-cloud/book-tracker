import BookCard from "./BookCard";

const STATUS_FLOW = ["読みたい", "読書中", "読了"];

export default function BookList({ books, loading, onStatusChange, onDelete }) {
  if (loading) {
    return <p className="message">読み込み中...</p>;
  }

  if (books.length === 0) {
    return (
      <div className="empty">
        <p>まだ本が登録されていません</p>
        <p>「本を探す」から追加してみましょう</p>
      </div>
    );
  }

  const grouped = {
    読みたい: books.filter((b) => b.status === "読みたい"),
    読書中: books.filter((b) => b.status === "読書中"),
    読了: books.filter((b) => b.status === "読了"),
  };

  return (
    <div className="book-list">
      {STATUS_FLOW.map((status) => (
        <section key={status}>
          <h2>
            {status}（{grouped[status].length}）
          </h2>
          {grouped[status].length === 0 ? (
            <p className="message-small">なし</p>
          ) : (
            <div className="book-grid">
              {grouped[status].map((book) => {
                const currentIndex = STATUS_FLOW.indexOf(book.status);
                const nextStatus = STATUS_FLOW[currentIndex + 1];
                const prevStatus = STATUS_FLOW[currentIndex - 1];

                return (
                  <BookCard key={book.id} book={book}>
                    <div className="card-actions">
                      {prevStatus && (
                        <button
                          className="btn-status btn-back"
                          onClick={() => onStatusChange(book.id, prevStatus)}
                        >
                          ← {prevStatus}
                        </button>
                      )}
                      {nextStatus && (
                        <button
                          className="btn-status"
                          onClick={() => onStatusChange(book.id, nextStatus)}
                        >
                          {nextStatus} →
                        </button>
                      )}
                      <button
                        className="btn-delete"
                        onClick={() => onDelete(book.id)}
                      >
                        削除
                      </button>
                    </div>
                  </BookCard>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
