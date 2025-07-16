import express, { Router } from "express";
import {
  createDiscountCodes,
  deleteDiscountCode,
  getCategories,
  getDiscountCodes,
} from "../controllers/product.controllers";
import isAuthenticated from "@packages/middleware/isAuthenticate";

const router: Router = express.Router();

router.get("/get-categories", getCategories);

// router.post("/create-discount-code", isAuthenticated, createDiscountCodes);

// router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);

// router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);
router.post("/create-discount-code", createDiscountCodes);

router.get("/get-discount-codes", getDiscountCodes);

router.delete("/delete-discount-code/:id", deleteDiscountCode);

export default router;
