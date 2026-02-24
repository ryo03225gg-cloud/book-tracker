import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="タイトルや著者名で検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">検索</button>
    </form>
  );
}
