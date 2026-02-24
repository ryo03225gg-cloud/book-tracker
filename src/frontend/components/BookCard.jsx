export default function BookCard({ book, children }) {
  const coverSrc = book.cover_url || "https://via.placeholder.com/128x192?text=No+Cover";

  return (
    <div className="book-card">
      <img
        className="book-cover"
        src={coverSrc}
        alt={book.title}
        loading="lazy"
      />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author || "著者不明"}</p>
        {children}
      </div>
    </div>
  );
}
