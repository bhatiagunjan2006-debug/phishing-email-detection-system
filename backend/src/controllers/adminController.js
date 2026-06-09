import BorrowRecord from "../models/BorrowRecord.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

export const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getIssuedBooks = async (_req, res, next) => {
  try {
    const records = await BorrowRecord.find()
      .populate("user", "name email role")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    next(error);
  }
};

export const markIssuedBookReturned = async (req, res, next) => {
  try {
    const record = await BorrowRecord.findById(req.params.id).populate("book");

    if (!record) {
      res.status(404);
      throw new Error("Borrow record not found");
    }

    if (record.status === "returned") {
      res.status(400);
      throw new Error("Book has already been returned");
    }

    record.status = "returned";
    record.returnedAt = new Date();
    await record.save();

    const book = await Book.findById(record.book._id);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    const updatedRecord = await BorrowRecord.findById(record._id)
      .populate("user", "name email role")
      .populate("book", "title author");

    res.json(updatedRecord);
  } catch (error) {
    next(error);
  }
};
