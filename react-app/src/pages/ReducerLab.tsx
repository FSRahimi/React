
import { useReducer, useState } from "react";
import type { FormEvent } from "react";

import type { Book } from "../types/Book";
import { books as initialBooks } from "../data/books";

/*
  STEP 1: DEFINE THE STATE

  WHAT: Store related library information together.
  WHY: One reducer controls their updates.
  WHEN: Multiple state changes must stay consistent.
*/
interface LibraryState {
  books: Book[];
  search: string;
  availableOnly: boolean;
  selectedId: number | null;
  message: string;
}

/*
  STEP 2: DEFINE TYPED ACTIONS

  WHAT: Describe all allowed actions.
  WHY: TypeScript validates each action.
  WHEN: Working with useReducer and complex state.

  This is a discriminated union.
*/
type LibraryAction =
  | {
      type: "SET_SEARCH";
      value: string;
    }
  | {
      type: "TOGGLE_AVAILABLE";
    }
  | {
      type: "SELECT_BOOK";
      id: number;
    }
  | {
      type: "ADD_BOOK";
      title: string;
    }
  | {
      type: "RESET_LIBRARY";
    };

/*
  STEP 3: CREATE INITIAL STATE

  WHAT: Define the starting values.
  WHY: useReducer needs an initial state.
*/
const initialState: LibraryState = {
  books: initialBooks,
  search: "",
  availableOnly: false,
  selectedId: null,
  message: "Welcome to the Reducer Lab!",
};

/*
  STEP 4: CREATE THE REDUCER

  WHAT: Calculate the next state from an action.
  WHY: Centralize related state updates.

  IMPORTANT:
  - Do not mutate the previous state.
  - Do not fetch APIs inside the reducer.
  - Do not write to localStorage here.
  - Return a new state value.
*/
function libraryReducer(
  state: LibraryState,
  action: LibraryAction
): LibraryState {
  switch (action.type) {
    /*
      ACTION 1: SET_SEARCH

      Update only the search value.
      Spread preserves the other state fields.
    */
    case "SET_SEARCH":
      return {
        ...state,
        search: action.value,
      };

    /*
      ACTION 2: TOGGLE_AVAILABLE

      Switch between all books and available books.
    */
    case "TOGGLE_AVAILABLE":
      return {
        ...state,
        availableOnly: !state.availableOnly,
      };

    /*
      ACTION 3: SELECT_BOOK

      Select one book by its unique ID.
    */
    case "SELECT_BOOK":
      return {
        ...state,
        selectedId: action.id,
        message: "Book selected successfully.",
      };

    /*
      ACTION 4: ADD_BOOK

      Add a new book and update multiple
      related fields together.

      This demonstrates why useReducer is useful.
    */
    case "ADD_BOOK": {
      const title = action.title.trim();

      // Return unchanged state for empty titles
      if (!title) {
        return state;
      }

      // Generate a deterministic ID from state
      const nextId =
        Math.max(0, ...state.books.map(b => b.id)) + 1;

      // Create the new book
      const newBook: Book = {
        id: nextId,
        title,
        author: "Classroom Example",
        year: 2026,
        category: "New Books",
        available: true,
      };

      // Update all related fields in one action
      return {
        ...state,
        books: [...state.books, newBook],
        search: "",
        availableOnly: false,
        selectedId: newBook.id,
        message: `"${title}" added successfully!`,
      };
    }

    /*
      ACTION 5: RESET_LIBRARY

      Restore all library values together.
    */
    case "RESET_LIBRARY":
      return initialState;

    /*
      EXHAUSTIVE SWITCH

      WHAT: Ensure all actions are handled.
      WHY: TypeScript reports missing cases.
    */
    default: {
      const unexpected: never = action;
      return unexpected;
    }
  }
}

/*
  STEP 5: BUILD THE PAGE
*/
export default function ReducerLab() {
  /*
    useReducer returns:
    1. Current state
    2. Dispatch function
  */
  const [state, dispatch] = useReducer(
    libraryReducer,
    initialState
  );

  /*
    This is LOCAL STATE for the add-book input.

    It stays separate because it is just a temporary
    draft controlled by this component.
  */
  const [newTitle, setNewTitle] = useState("");

  /*
    DERIVED DATA

    Calculate the book list from reducer state.
    No extra state is needed.
  */
  const normalizedSearch =
    state.search.trim().toLowerCase();

  const filteredBooks = state.books.filter((book) => {
    const matchesText =
      book.title.toLowerCase().includes(normalizedSearch) ||
      book.author.toLowerCase().includes(normalizedSearch);

    const matchesAvailability =
      !state.availableOnly || book.available;

    return matchesText && matchesAvailability;
  });

  /*
    Find the selected book.
    This is also a calculated value.
  */
  const selectedBook =
    state.books.find(
      (book) => book.id === state.selectedId
    ) ?? null;

  /*
    Submit a new book.

    WHAT: Send an ADD_BOOK action.
    WHY: Let the reducer update related state.
  */
  const handleAddBook = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!newTitle.trim()) return;

    dispatch({
      type: "ADD_BOOK",
      title: newTitle,
    });

    // Clear the temporary form input
    setNewTitle("");
  };

  return (
    <section className="reducer-lab">
      <h2>useReducer — Library Management</h2>

      <p>
        Manage related library state with actions.
      </p>

      {/* ACTION: SET_SEARCH */}
      <div className="reducer-controls">
        <label htmlFor="reducer-search">
          Search books
        </label>

        <input
          id="reducer-search"
          type="search"
          placeholder="Search by title or author..."
          value={state.search}
          onChange={(event) =>
            dispatch({
              type: "SET_SEARCH",
              value: event.target.value,
            })
          }
        />

        {/* ACTION: TOGGLE_AVAILABLE */}
        <label className="reducer-checkbox">
          <input
            type="checkbox"
            checked={state.availableOnly}
            onChange={() =>
              dispatch({
                type: "TOGGLE_AVAILABLE",
              })
            }
          />
          Available books only
        </label>
      </div>

      {/* ADD BOOK FORM */}
      <form
        className="reducer-add-form"
        onSubmit={handleAddBook}
      >
        <label htmlFor="reducer-new-title">
          Add a sample book
        </label>

        <input
          id="reducer-new-title"
          value={newTitle}
          onChange={(event) =>
            setNewTitle(event.target.value)
          }
          placeholder="Enter a book title..."
        />

        <button
          type="submit"
          disabled={!newTitle.trim()}
        >
          Add Book
        </button>
      </form>

      {/* DERIVED RESULT COUNT */}
      <p>Books Found: {filteredBooks.length}</p>

      {/* DISPLAY LIBRARY BOOKS */}
      <div className="reducer-book-grid">
        {filteredBooks.map((book) => (
          <article
            key={book.id}
            className="reducer-book-card"
          >
            <h3>{book.title}</h3>

            <p>Author: {book.author}</p>

            <p>
              {book.available
                ? "Available"
                : "Borrowed"}
            </p>

            {/* ACTION: SELECT_BOOK */}
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "SELECT_BOOK",
                  id: book.id,
                })
              }
            >
              Select Book
            </button>
          </article>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredBooks.length === 0 && (
        <p className="reducer-empty">
          No matching books found.
        </p>
      )}

      {/* SELECTED BOOK INFORMATION */}
      {selectedBook && (
        <div className="reducer-selected">
          <h3>Selected Book</h3>

          <p>{selectedBook.title}</p>
          <p>Author: {selectedBook.author}</p>
          <p>Category: {selectedBook.category}</p>
        </div>
      )}

      {/* FEEDBACK FROM REDUCER STATE */}
      <p className="reducer-message" role="status">
        {state.message}
      </p>

      {/* ACTION: RESET_LIBRARY */}
      <button
        type="button"
        className="reducer-reset"
        onClick={() => {
          dispatch({ type: "RESET_LIBRARY" });
          setNewTitle("");
        }}
      >
        Reset Library
      </button>
    </section>
  );
}

