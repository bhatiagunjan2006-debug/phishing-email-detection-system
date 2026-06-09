import express from "express";

import {
  borrowBook,
  getMyBorrowHistory,
  returnBook,
} from "../controllers/borrowController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/history", getMyBorrowHistory);
router.post("/", borrowBook);
router.post("/return", returnBook);

export default router;
