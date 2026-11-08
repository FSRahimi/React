import { useEffect, useState } from "react";

// Import components
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import LibraryClock from "./components/LibraryClock";
import StudyTimer from "./components/StudyTimer";
import Footer from "./components/Footer";

// Import library data
import { books } from "./data/books";

// Import pages
import OnlineBookExplorer from "./pages/OnlineBookExplorer";
import AddBookPage from "./pages/AddBookPage";
import ReactContextPage from "./pages/ReactContextPage";
import ReducerLab from "./pages/ReducerLab";
// Import Theme Provider
import { ThemeProvider } from "./context/ThemeContext";

// Import CSS
import "./App.css";
import "./OnlineBookExplorer.css";

// Define available pages
type Page = "library" | "online" | "add-book" | "react-context" | "reducer-lab";

// Main application content
function AppContent() {
  // Search state
  const [search, setSearch] = useState<string>("");

  // Current page state
  const [currentPage, setCurrentPage] = useState<Page>("library");

  // Available books filter state
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // Update browser tab title
  useEffect(() => {
    document.title = search.trim()
      ? `Search: ${search.trim()} | Kabul Community Library`
      : "Kabul Community Library";
  }, [search]);

  // Clear search when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Normalize search text
  const normalizedSearch = search.trim().toLowerCase();

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(normalizedSearch) ||
      book.author.toLowerCase().includes(normalizedSearch);

    const matchesAvailability = !availableOnly || book.available;

    return matchesSearch && matchesAvailability;
  });

  return (
    <div className="app">
      {/* Website Header */}
      <Header
        title="Kabul Community Library"
        subtitle="Discover, Read, and Learn"
      />

      {/* Navigation */}
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

        <button
          type="button"
          className={currentPage === "react-context" ? "active" : ""}
          onClick={() => setCurrentPage("react-context")}
        >
          React Context Guide
        </button>
        {/* Open the Reducer Lab page */}
        <button
          type="button"
          className={currentPage === "reducer-lab" ? "active" : ""}
          onClick={() => setCurrentPage("reducer-lab")}
        >
          Reducer Lab
        </button>
      </nav>

      {/* Main Page Content */}
      <main className="container">
        {currentPage === "library" ? (
          <>
            {/* Library Clock */}
            <LibraryClock />

            <section className="library-section">
              <h2>Explore Our Books</h2>

              {/* Search Bar */}
              <SearchBar search={search} onSearchChange={setSearch} />

              {/* Available Books Filter */}
              <label className="filter-label">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(event) => setAvailableOnly(event.target.checked)}
                />
                Show available books only
              </label>

              {/* Search Results Count */}
              <p className="result-count">
                Books Found: {filteredBooks.length}
              </p>

              {/* Filter Message */}
              {availableOnly && (
                <p className="filter-message">Showing available books only.</p>
              )}

              {/* Book List */}
              <BookList
                books={filteredBooks}
                search={search}
                availableOnly={availableOnly}
              />
            </section>

            {/* Study Timer */}
            <StudyTimer />
          </>
        ) : currentPage === "online" ? (
          <OnlineBookExplorer />
        ) : currentPage === "add-book" ? (
          <AddBookPage />
        ) : currentPage === "react-context" ? (
          <ReactContextPage />
        ) : (
          <ReducerLab />
        )}
      </main>

      {/* Website Footer */}
      <Footer />
    </div>
  );
}

// Main App with Theme Provider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
