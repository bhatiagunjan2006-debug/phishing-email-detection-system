const BookCard = ({
  book,
  isAdmin,
  onBorrow,
  onEdit,
  onDelete,
  borrowedRecord,
  onReturn,
}) => (
  <article className="book-card">
    <div className="book-art">
      {book.coverImage ? (
        <img src={book.coverImage} alt={book.title} />
      ) : (
        <div className="book-art-placeholder">{book.title.slice(0, 1)}</div>
      )}
    </div>

    <div className="book-content">
      <p className="book-tag">{book.category || "General"}</p>
      <h3>{book.title}</h3>
      <p className="book-meta">by {book.author}</p>
      <p className="book-description">
        {book.description || "A curated addition to the library collection."}
      </p>

      <div className="book-stats">
        <span>Available: {book.availableCopies}</span>
        <span>Total: {book.totalCopies}</span>
        {book.publishedYear && <span>Year: {book.publishedYear}</span>}
      </div>

      <div className="card-actions">
        {!isAdmin && onBorrow && !borrowedRecord && (
          <button
            className="primary-button"
            onClick={() => onBorrow(book._id)}
            disabled={book.availableCopies < 1}
          >
            Borrow
          </button>
        )}

        {!isAdmin && borrowedRecord && onReturn && (
          <button
            className="ghost-button"
            onClick={() => onReturn(borrowedRecord._id)}
          >
            Return
          </button>
        )}

        {isAdmin && (
          <>
            <button className="ghost-button" onClick={() => onEdit(book)}>
              Edit
            </button>
            <button className="danger-button" onClick={() => onDelete(book._id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  </article>
);

export default BookCard;
