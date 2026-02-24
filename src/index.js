import { getBooks, addBook, updateStatus, deleteBook } from "./api/books.js";
import { searchBooks } from "./api/search.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (path.startsWith("/api/")) {
      return handleApi(path, method, request, url, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleApi(path, method, request, url, env) {
  try {
    if (path === "/api/books" && method === "GET") {
      const books = await getBooks(env);
      return json(books);
    }

    if (path === "/api/books" && method === "POST") {
      const body = await request.json();
      await addBook(env, body);
      return json({ ok: true }, 201);
    }

    const bookMatch = path.match(/^\/api\/books\/(\d+)$/);
    if (bookMatch) {
      const id = Number(bookMatch[1]);

      if (method === "PATCH") {
        const body = await request.json();
        await updateStatus(env, id, body.status);
        return json({ ok: true });
      }

      if (method === "DELETE") {
        await deleteBook(env, id);
        return json({ ok: true });
      }
    }

    if (path === "/api/search" && method === "GET") {
      const q = url.searchParams.get("q");
      if (!q) return json({ error: "検索キーワードが必要です" }, 400);
      const results = await searchBooks(env, q);
      return json(results);
    }

    return json({ error: "Not found" }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
