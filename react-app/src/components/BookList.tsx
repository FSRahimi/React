// WHAT: Import the Book type.
// WHY: Ensure that the books prop contains valid books.
import {type Book} from "../types/Book"

// WHAT: Import the reusable BookCard component.
import BookCard from "./BookCard";

// WHAT: Define BookList props.
// WHY: BookList expects an array of books.
type BookListProps = {
  books: Book[];
  search: string;
  availableOnly: boolean;
};

function BookList({ books, search, availableOnly   }: BookListProps) {



  if(books.length === 0) {
    return (
      <div className="empty-message">
        <h3> No books found. </h3>

        { search.trim() !== "" ?(
          <p>
            No Books match your search for "{search}". Please try a different search term.
          </p>
        ) :  availableOnly ? (
          <p>
            No available books match your search for "{search}". Please try a different search term.
          </p>
        ) : (
          <p> The library has no books yet</p>
        ) }
      </div>
    );
  }
 return(
  <div className="book-grid">
    {books.map((book) =>(
      <BookCard
      key={book.id}
      title={book.title}
      author={book.author}
      year={book.year}
      category={book.category}
      available ={book.available}
      />
    ))}

  </div>
 );
}

export default BookList;
