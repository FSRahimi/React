  
  import type { Book } from "../types/Book";
  

  type BookCardProps = Omit<Book, "id">;


function BookCard({
  title,
  author,
    year,   
    category,
    available,
}: BookCardProps) {
  return (  
    <article className="book-card">
        <div className= "book-icon" aria-hidden="true">📖
</div>
<h3> {title} </h3>
<p className="book-author">by {author}</p>
<p className="book-year">{year}</p>
<p className="book-category">{category}</p>
<p className="book-available">
<span className={available ? "book-status available" : "book-status not-available"}>Availability: {available ? "Available" : "Borrowed"}</span>
</p>
{!available && (
  <p className="borrowed-message"> This book is currently borrowed. </p>
)}
</article>

    );
}
export default BookCard;     
          
        