import { useEffect, useState } from "react";

import api from "../api/client.js";
import BookCard from "../components/BookCard.jsx";
import useAuth from "../hooks/useAuth.js";

const initialForm = {
  title: "",
  author: "",
  category: "",
  description: "",
  coverImage: "",
  publishedYear: "",
  totalCopies: 1,
  availableCopies: 1,
};

const BooksPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async (query = "") => {
    const { data } = await api.get(`/books?search=${encodeURIComponent(query)}`);
    setBooks(data);
  };

  const fetchHistory = async () => {
    if (!isAuthenticated || isAdmin) return;

    const { data } = await api.get("/borrows/history");
    setHistory(data);
  };

  useEffect(() => {
    fetchBooks().catch(() => setError("Unable to load books"));
  }, []);

  useEffect(() => {
    fetchHistory().catch(() => null);
  }, [isAuthenticated, isAdmin]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await fetchBooks(search);
    } catch (_error) {
      setError("Search failed");
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await api.post("/borrows", { bookId });
      await Promise.all([fetchBooks(search), fetchHistory()]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Borrow request failed");
    }
  };

  const handleReturn = async (recordId) => {
    try {
      await api.post("/borrows/return", { recordId });
      await Promise.all([fetchBooks(search), fetchHistory()]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Return request failed");
    }
  };

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleAdminSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
      totalCopies: Number(form.totalCopies),
      availableCopies: Number(form.availableCopies),
    };

    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, payload);
      } else {
        await api.post("/books", payload);
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchBooks(search);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save book");
    }
  };

  const startEditing = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      publishedYear: book.publishedYear || "",
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
    });
  };

  const handleDelete = async (bookId) => {
    try {
      await api.delete(`/books/${bookId}`);
      await fetchBooks(search);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete book");
    }
  };

  return (
    <main className="page-shell">
      <section className="container page-header">
        <div>
          <p className="eyebrow">Library Catalog</p>
          <h1>Books</h1>
          <p>Browse the collection, search quickly, and manage inventory by role.</p>
        </div>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            placeholder="Search by title or author"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button className="primary-button">Search</button>
        </form>
      </section>

      {error && (
        <section className="container">
          <p className="form-error">{error}</p>
        </section>
      )}

      {isAdmin && (
        <section className="container admin-panel">
          <div className="section-heading">
            <h2>{editingId ? "Update Book" : "Add Book"}</h2>
            {editingId && (
              <button
                className="ghost-button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form className="admin-form" onSubmit={handleAdminSubmit}>
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            <input
              name="publishedYear"
              placeholder="Published Year"
              value={form.publishedYear}
              onChange={handleChange}
            />
            <input
              name="totalCopies"
              type="number"
              min="1"
              placeholder="Total Copies"
              value={form.totalCopies}
              onChange={handleChange}
              required
            />
            <input
              name="availableCopies"
              type="number"
              min="0"
              placeholder="Available Copies"
              value={form.availableCopies}
              onChange={handleChange}
              required
            />
            <input
              name="coverImage"
              placeholder="Cover Image URL"
              value={form.coverImage}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
            <button className="primary-button">
              {editingId ? "Update Book" : "Add Book"}
            </button>
          </form>
        </section>
      )}

      <section className="container books-grid">
        {books.map((book) => {
          const borrowedRecord = history.find(
            (record) => record.book?._id === book._id && record.status === "issued"
          );

          return (
            <BookCard
              key={book._id}
              book={book}
              isAdmin={isAdmin}
              onBorrow={isAuthenticated && !isAdmin ? handleBorrow : undefined}
              onEdit={isAdmin ? startEditing : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              borrowedRecord={borrowedRecord}
              onReturn={isAuthenticated && !isAdmin ? handleReturn : undefined}
            />
          );
        })}
      </section>
    </main>
  );
};

export default BooksPage;
