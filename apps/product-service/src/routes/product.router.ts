import express, { Router } from "express";
import {
  createDiscountCodes,
  createProduct,
  deleteDiscountCode,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getCategories,
  getDiscountCodes,
  getShopProducts,
  restoreProduct,
  uploadProductImage,
} from "../controllers/product.controllers";
import isAuthenticated from "@packages/middleware/isAuthenticate";
import { isSeller } from "@packages/middleware/authorizeRoles";

const router: Router = express.Router();

router.get("/get-categories", getCategories);
// router.post("/create-product", isAuthenticated, isSeller, createProduct);
router.post("/create-product", isAuthenticated, isSeller, createProduct);
router.post("/upload-product-image", uploadProductImage);
router.get("/get-shop-products", isAuthenticated, getShopProducts);
router.post("/create-discount-code", isAuthenticated, createDiscountCodes);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);
router.delete("/delete-product-image", isAuthenticated, deleteProductImage);
router.delete("/delete-product/:productId", deleteProduct);
router.put("/restore-product/:productId", restoreProduct);
router.get("/get-all-products", getAllProducts);
export default router;
