import { useEffect, useState } from "react";

import type { FormEvent } from "react";

import "../OnlineBookExplorer.css";

interface ApiBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
}

interface BookResponse {
  docs: ApiBook[];
}

function OnlineBookExplorer() {
  const [searchInput, setSearchInput] = useState<string>("React");
  const [query, setQuery] = useState<string>("React");
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    let ignore = false;

    async function fetchBooks() {
      setLoading(true);
      setError(null);
      setBooks([]);

      const url =
        "https://openlibrary.org/search.json" +
        `?q=${encodeURIComponent(query)}` +
        "&fields=key,title,author_name,first_publish_year" +
        "&limit=10";

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data: BookResponse = await response.json();

        if (!ignore) {
          setBooks(data.docs ?? []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, [query, retryCount]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(searchInput.trim() || "React");
  };

  const handleRetry = () => {
    setRetryCount((count) => count + 1);
  };

  return (
    <div className="online-book-grid">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search books"
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
        {error && (
          <button type="button" onClick={handleRetry}>
            Retry
          </button>
        )}
      </form>

      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && books.length === 0 && <p>No books found.</p>}

      <ul>
        {books.map((book) => (
          <li key={book.key}>
            <h3>{book.title}</h3>
            <p>{book.author_name?.join(", ") ?? "Unknown author"}</p>
            {book.first_publish_year && (
              <p>First published: {book.first_publish_year}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OnlineBookExplorer;
