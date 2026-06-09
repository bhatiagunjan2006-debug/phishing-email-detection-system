import express from "express";

import {
  getAllUsers,
  getIssuedBooks,
  markIssuedBookReturned,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/users", getAllUsers);
router.get("/issued-books", getIssuedBooks);
router.patch("/issued-books/:id/return", markIssuedBookReturned);

export default router;
