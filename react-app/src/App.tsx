import { useEffect, useState } from "react";

// Import our components
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import LibraryClock from "./components/LibraryClock";
import StudyTimer from "./components/StudyTimer";
import Footer from "./components/Footer";

// Import library data
import { books } from "./data/books";
import OnlineBookExplorer from "./pages/OnlineBookExplorer";


import AddBookPage from "./pages/AddBookPage";
// Import CSS
import "./App.css";
import "./OnlineBookExplorer.css";

function App() {
  // State 1: Store the search text
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<"library" | "online" | "add-book">("library");
  /*
    NEW STATE: Available only filter

    WHAT: Store whether the checkbox is checked.
    WHY: Users can show only available books.
    WHEN: When adding interactive filtering.
  */
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // Previous useEffect: Browser tab title
  useEffect(() => {
    document.title = search.trim()
      ? `Search: ${search.trim()} | Kabul Community Library`
      : "Kabul Community Library";
  }, [search]);

  // Previous useEffect: Escape keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);


    
    // Cleanup event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
    STEP 1: Normalize search text.

    WHAT: Remove spaces and ignore letter case.
    WHY: Make searching easier.
  */
  const normalizedSearch = search.trim().toLowerCase();

  /*
    STEP 2: Filter books.

    WHAT: Check title and author.
    WHY: Display books matching the search.
    WHEN: During rendering, without useEffect.
  */
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(normalizedSearch) ||
      book.author.toLowerCase().includes(normalizedSearch);

    /*
      NEW: Check availability.

      If availableOnly is false, show all books.
      If true, show only available books.
    */
    const matchesAvailability = !availableOnly || book.available;

    return matchesSearch && matchesAvailability;
  });

  // Render the user interface
  return (
    <div className="app">
      {/* Header from previous steps */}
      <Header
        title="Kabul Community Library"
        subtitle="Discover, Read, and Learn"
      />
      <nav className="library-navigation">
        <button
          type="button"
          className={currentPage === "library" ? "active" : ""}
          onClick={() => setCurrentPage("library")}
        >
          Our Library
        </button>

        <button
          type="button"
          className={currentPage === "online" ? "active" : ""}
          onClick={() => setCurrentPage("online")}
        >
          Online Book Explorer
        </button>

        <button
          type="button"
          className={currentPage === "add-book" ? "active" : ""}
          onClick={() => setCurrentPage("add-book")}
        >
          Add New Book
        </button>
      </nav>

      <main className="container">
        {currentPage === "library" ? (
          <>
            {/* Live clock */}
            <LibraryClock />

            <section className="library-section">
              <h2>Explore Our Books</h2>

              {/* Existing search component */}
              <SearchBar search={search} onSearchChange={setSearch} />

              {/*
                NEW: Available Only checkbox

                WHAT: Change availableOnly state.
                WHY: Let users filter books.
              */}
              <label className="filter-label">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(event) => setAvailableOnly(event.target.checked)}
                />
                Show available books only
              </label>

              {/* Display number of matching books */}
              <p className="result-count">Books Found: {filteredBooks.length}</p>

              {/*
                CONDITIONAL RENDERING WITH &&

                WHAT: Show filter message when active.
              */}
              {availableOnly && (
                <p className="filter-message">Showing available books only.</p>
              )}

              {/* Render the list or its empty state */}
              <BookList
                books={filteredBooks}
                search={search}
                availableOnly={availableOnly}
              />
            </section>

            {/* Existing study timer */}
            <StudyTimer />
          </>
        ) : currentPage === "online" ? (
          <OnlineBookExplorer />
        ) : (
          <AddBookPage />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
