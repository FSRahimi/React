
// WHAT: Import only a TypeScript type.
// WHY: Describe the type of an input change event.
import type { ChangeEvent } from "react";

// WHAT: Define SearchBar props.
// WHY: The parent controls the search value.
type SearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

function SearchBar({
  search,
  onSearchChange,
}: SearchBarProps) {
  // WHAT: Handle changes in the input field.
  // WHY: Send the new value to the parent.
  // WHEN: Whenever the user types.
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="search-section">
      {/* Associate the label with the input */}
      <label htmlFor="book-search">
        Search Books
      </label>

      {/*
        WHAT: Controlled input.
        WHY: Its value comes from React state.
        WHEN: When React must manage user input.
      */}
      <input
        id="book-search"
        type="search"
        placeholder="Search by title or author..."
        value={search}
        onChange={handleChange}
        className="search-input"
      />

      <p className="search-help">
        Tip: Press Escape to clear the search.
      </p>
    </div>
  );
}

export default SearchBar;
