import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import BookList from "./components/BookList";

export default function App() {
  const [page, setPage] = useState("list");
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (e) {
      console.error("読書リストの取得に失敗:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = async (query) => {
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (e) {
      console.error("検索に失敗:", e);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (book) => {
    try {
      await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      await fetchBooks();
      setPage("list");
      setSearchResults([]);
    } catch (e) {
      console.error("追加に失敗:", e);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`/api/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchBooks();
    } catch (e) {
      console.error("ステータス変更に失敗:", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      await fetchBooks();
    } catch (e) {
      console.error("削除に失敗:", e);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Book Tracker</h1>
        <nav className="nav">
          <button
            className={page === "list" ? "active" : ""}
            onClick={() => setPage("list")}
          >
            読書リスト ({books.length})
          </button>
          <button
            className={page === "search" ? "active" : ""}
            onClick={() => setPage("search")}
          >
            本を探す
          </button>
        </nav>
      </header>

      <main className="main">
        {page === "search" ? (
          <>
            <SearchBar onSearch={handleSearch} />
            <SearchResults
              results={searchResults}
              searching={searching}
              onAdd={handleAdd}
              existingBooks={books}
            />
          </>
        ) : (
          <BookList
            books={books}
            loading={loading}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
