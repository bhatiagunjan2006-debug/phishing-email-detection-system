import Book from "../models/Book.js";
import BorrowRecord from "../models/BorrowRecord.js";

const BORROW_DAYS = 14;

export const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      res.status(400);
      throw new Error("Book ID is required");
    }

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    if (book.availableCopies < 1) {
      res.status(400);
      throw new Error("No copies available for borrowing");
    }

    const activeBorrow = await BorrowRecord.findOne({
      book: bookId,
      user: req.user._id,
      status: "issued",
    });

    if (activeBorrow) {
      res.status(400);
      throw new Error("You have already borrowed this book");
    }

    book.availableCopies -= 1;
    await book.save();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

    const record = await BorrowRecord.create({
      user: req.user._id,
      book: bookId,
      dueDate,
    });

    const populatedRecord = await record.populate("book");
    res.status(201).json(populatedRecord);
  } catch (error) {
    next(error);
  }
};

export const returnBook = async (req, res, next) => {
  try {
    const { recordId } = req.body;

    if (!recordId) {
      res.status(400);
      throw new Error("Borrow record ID is required");
    }

    const record = await BorrowRecord.findOne({
      _id: recordId,
      user: req.user._id,
      status: "issued",
    }).populate("book");

    if (!record) {
      res.status(404);
      throw new Error("Active borrow record not found");
    }

    record.status = "returned";
    record.returnedAt = new Date();
    await record.save();

    const book = await Book.findById(record.book._id);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
};

export const getMyBorrowHistory = async (req, res, next) => {
  try {
    const records = await BorrowRecord.find({ user: req.user._id })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    next(error);
  }
};
