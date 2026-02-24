export async function getBooks(env) {
  const { results } = await env.book_tracker_db
    .prepare("SELECT * FROM books ORDER BY created_at DESC")
    .all();
  return results;
}

export async function addBook(env, book) {
  await env.book_tracker_db
    .prepare(
      "INSERT INTO books (title, author, cover_url, status) VALUES (?, ?, ?, '読みたい')"
    )
    .bind(book.title, book.author || null, book.cover_url || null)
    .run();
}

export async function updateStatus(env, id, status) {
  const validStatuses = ["読みたい", "読書中", "読了"];
  if (!validStatuses.includes(status)) {
    throw new Error("無効なステータス");
  }
  await env.book_tracker_db
    .prepare("UPDATE books SET status = ? WHERE id = ?")
    .bind(status, id)
    .run();
}

export async function deleteBook(env, id) {
  await env.book_tracker_db
    .prepare("DELETE FROM books WHERE id = ?")
    .bind(id)
    .run();
}
