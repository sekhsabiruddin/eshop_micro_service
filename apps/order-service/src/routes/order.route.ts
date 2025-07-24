import { Router } from "express";
// import { isAuthenticated } from "../middleware/isAuthenticated";
// import { isSeller } from "../middleware/isSeller";
import {
  getAdminOrders,
  getOrderDetails,
  getSellerOrders,
  verifyCouponCode,
} from "../controller/order.controller";
import isAuthenticated from "@packages/middleware/isAuthenticate";

const router = Router();

// List all orders for the authenticated seller
// router.get("/get-seller-orders", isAuthenticated, isSeller, getSellerOrders);

// Get a single order’s full details by order ID
router.get("/get-seller-orders", getSellerOrders);
router.get(
  "/get-order-details/:id",
  //   isAuthenticated,
  //   isSeller,
  getOrderDetails
);

// router.put("/update-status/:orderId", updateDeliveryStatus);

router.put(
  "/verify-coupon",

  verifyCouponCode
);
router.get("/get-admin-orders", isAuthenticated, getAdminOrders);

// router.get("/get-user-orders",  getUserOrders);
export default router;
