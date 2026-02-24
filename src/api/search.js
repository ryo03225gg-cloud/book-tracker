const CACHE_TTL = 86400;

export async function searchBooks(env, query) {
  const cacheKey = `search:${query.toLowerCase()}`;

  const cached = await env.book_tracker_cache.get(cacheKey, "json");
  if (cached) {
    return cached;
  }

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;
  const res = await fetch(url);
  const data = await res.json();

  const books = (data.docs || []).slice(0, 10).map((doc) => ({
    title: doc.title,
    author: doc.author_name ? doc.author_name[0] : null,
    cover_url: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  }));

  await env.book_tracker_cache.put(cacheKey, JSON.stringify(books), {
    expirationTtl: CACHE_TTL,
  });

  return books;
}
