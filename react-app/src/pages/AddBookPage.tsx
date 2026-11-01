import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface BookForm {
  title: string;
  author: string;
  year: string;
}

function AddBookPage() {
  const [form, setForm] = useState<BookForm>({
    title: "",
    author: "",
    year: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const errors = {
    title: form.title.trim() === "" ? "Book title is Required" : "",

    author: form.author.trim() === "" ? "Author is Required" : "",

    year:
      !/^\d{4}$/.test(form.year) ||
      Number(form.year) < 1450 ||
      Number(form.year) > new Date().getFullYear()
        ? " Enter a valid Year"
        : "",
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    console.log("Valid book:", form);
    setSubmitted(true);
  };
  return (
    <section className="add-book-page">
      <h2> Add New Book</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="title"> Book Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className="field-error"> {errors.title}</p>}

        <label htmlFor="author"> Author</label>
        <input
          id="author"
          name="author"
          value={form.author}
          onChange={handleChange}
          aria-invalid={!!errors.author}
        />
        {errors.author && <p className="field-error"> {errors.author}</p>}

        <label htmlFor="year"> Year</label>
        <input
          id="year"
          name="year"
          value={form.year}
          onChange={handleChange}
          aria-invalid={!!errors.year}
        />
        {errors.year && <p className="field-error"> {errors.year}</p>}

        <button type="submit"> Add Book</button>
      </form>

      {submitted &&(
        <p> Book Information validate Successfully!</p>
      )}

     
    </section>


  );
}
export default AddBookPage