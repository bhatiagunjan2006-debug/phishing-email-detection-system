import Book from "../models/Book.js";

export const getBooks = async (req, res, next) => {
  try {
    const { search = "" } = req.query;
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      description,
      category,
      coverImage,
      publishedYear,
      totalCopies,
      availableCopies,
    } = req.body;

    if (!title || !author || !totalCopies) {
      res.status(400);
      throw new Error("Title, author, and total copies are required");
    }

    const book = await Book.create({
      title,
      author,
      description,
      category,
      coverImage,
      publishedYear,
      totalCopies,
      availableCopies: availableCopies ?? totalCopies,
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    const fields = [
      "title",
      "author",
      "description",
      "category",
      "coverImage",
      "publishedYear",
      "totalCopies",
      "availableCopies",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    });

    if (book.availableCopies > book.totalCopies) {
      res.status(400);
      throw new Error("Available copies cannot exceed total copies");
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
};
