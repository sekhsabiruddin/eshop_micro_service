// // create payment intent
// import { ValidationError } from "@packages/errors";
// import { prisma } from "@packages/libs/prisma";
// import redis from "@packages/libs/redis";
// import { NextFunction, Response } from "express";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2022-11-15",
// });

// // create payment intent
// export const createPaymentIntent = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { amount, sellerStripeAccountId, sessionId } = req.body;

//   const customerAmount = Math.round(amount * 100);
//   const platformFee = Math.floor(customerAmount * 0.1);

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: customerAmount,
//       currency: "usd",
//       payment_method_types: ["card"],
//       application_fee_amount: platformFee,
//       transfer_data: {
//         destination: sellerStripeAccountId,
//       },
//       metadata: {
//         sessionId,
//         userId: req.user.id,
//       },
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const verifyingPaymentSession = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { cart, selectedAddressId, coupon } = req.body;
//     const userId = req.user.id;

//     if (!cart || !Array.isArray(cart) || cart.length === 0) {
//       return next(new ValidationError("Cart is empty or invalid."));
//     }

//     const normalizedCart = JSON.stringify(
//       cart
//         .map((item: any) => ({
//           id: item.id,
//           quantity: item.quantity,
//           sale_price: item.sale_price,
//           shopId: item.shopId,
//           selectedOptions: item.selectedOptions || {},
//         }))
//         .sort((a, b) => a.id.localeCompare(b.id))
//     );

//     const keys = await redis.keys("payment-session:*");
//     for (const key of keys) {
//       const data = await redis.get(key);
//       if (data) {
//         const session = JSON.parse(data);
//         if (session.userId === userId) {
//           const existingCart = JSON.stringify(
//             session.cart
//               .map((item: any) => ({
//                 id: item.id,
//                 quantity: item.quantity,
//                 sale_price: item.sale_price,
//                 shopId: item.shopId,
//                 selectedOptions: item.selectedOptions || {},
//               }))
//               .sort((a: any, b: any) => a.id.localeCompare(b.id))
//           );

//           if (existingCart === normalizedCart) {
//             return res.status(200).json({ sessionId: key.split(":")[1] });
//           } else {
//             await redis.del(key);
//           }
//         }
//       }
//     }

//     // Fetch sellers and their stripe accounts
//     const uniqueShopIds = [...new Set(cart.map((item: any) => item.shopId))];

//     const shops = await prisma.shops.findMany({
//       where: {
//         id: { in: uniqueShopIds },
//       },
//       select: {
//         id: true,
//         sellerId: true,
//         sellers: {
//           select: {
//             stripeId: true,
//           },
//         },
//       },
//     });

//     const sellerData = shops.map((shop) => ({
//       shopId: shop.id,
//       sellerId: shop.sellerId,
//       stripeAccountId: shop?.sellers?.stripeId,
//     }));

//     // Calculate total
//     const totalAmount = cart.reduce((total: number, item: any) => {
//       return total + item.quantity * item.sale_price;
//     }, 0);

//     // Create session payload
//     const sessionId = crypto.randomUUID();
//     const sessionData = {
//       userId,
//       cart,
//       sellers: sellerData,
//       totalAmount,
//       shippingAddressId: selectedAddressId || null,
//       coupon: coupon || null,
//     };

//     await redis.setex(
//       `payment-session:${sessionId}`,
//       600, // 10 minutes
//       JSON.stringify(sessionData)
//     );

//     res.status(200).json({ sessionId });
//   } catch (error) {
//     next(error);
//   }
// };

// // create order
// export const createOrder = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { cart, userId, shippingAddressId, coupon, name, email, sessionId } =
//       req.body;

//     const shopGrouped = cart.reduce((acc: any, item: any) => {
//       if (!acc[item.shopId]) acc[item.shopId] = [];
//       acc[item.shopId].push(item);
//       return acc;
//     }, {});

//     for (const shopId in shopGrouped) {
//       const orderItems = shopGrouped[shopId];

//       let orderTotal = orderItems.reduce(
//         (sum: number, p: any) => sum + p.quantity * p.sale_price,
//         0
//       );

//       // Apply discount if applicable
//       if (
//         coupon &&
//         coupon.discountedProductId &&
//         orderItems.some((item: any) => item.id === coupon.discountedProductId)
//       ) {
//         const discountedItem = orderItems.find(
//           (item: any) => item.id === coupon.discountedProductId
//         );
//         if (discountedItem) {
//           orderTotal -= coupon.discountAmount;
//         }
//       }

//       // Create order
//       await prisma.orders.create({
//         data: {
//           userId,
//           shopId,
//           total: orderTotal,
//           status: "Paid",
//           shippingAddressId: shippingAddressId || null,
//           couponCode: coupon?.code || null,
//           discountAmount: coupon?.discountAmount || 0,
//           items: {
//             create: orderItems.map((item: any) => ({
//               productId: item.id,
//               quantity: item.quantity,
//               price: item.sale_price,
//               selectedOptions: item.selectedOptions,
//             })),
//           },
//         },
//       });

//       // Update product & analytics
//       for (const item of orderItems) {
//         const { id: productId, quantity } = item;

//         await prisma.products.update({
//           where: { id: productId },
//           data: {
//             stock: { decrement: quantity },
//             totalSales: { increment: quantity },
//           },
//         });

//         await prisma.productAnalytics.upsert({
//           where: { productId },
//           create: {
//             productId,
//             shopId,
//             purchases: quantity,
//             lastViewedAt: new Date(),
//           },
//           update: {
//             purchases: { increment: quantity },
//           },
//         });
//       }
//     }

//     // Send email to user
//     await sendEmail(
//       email,
//       "🛍️ Your Eshop Order Confirmation",
//       "order-confirmation",
//       {
//         name,
//         cart,
//         totalAmount: coupon?.discountAmount
//           ? totalAmount - coupon.discountAmount
//           : totalAmount,
//         trackingUrl: `https://eshop.com/order/${sessionId}`,
//       }
//     );

//     // Notify seller(s)
//     const sellerShops = Object.keys(shopGrouped).map((id) => ({
//       id,
//       sellerId: shopGrouped[id][0].sellerId,
//     }));
//     for (const shop of sellerShops) {
//       const firstProduct = shopGrouped[shop.id][0];
//       const productTitle = firstProduct?.title || "new item";

//       await prisma.notifications.create({
//         data: {
//           title: "🛒 New Order Received",
//           message: `A customer just ordered ${productTitle} from your shop.`,
//           creatorId: userId,
//           receiverId: shop.sellerId,
//           redirect_link: `https://eshop.com/order/${sessionId}`,
//         },
//       });
//     }

//     // Notify admin
//     await prisma.notifications.create({
//       data: {
//         title: "📦 Platform Order Alert",
//         message: `A new order was placed by ${name}.`,
//         creatorId: userId,
//         receiverId: "admin",
//         redirect_link: `https://eshop.com/order/${sessionId}`,
//       },
//     });

//     // Clear session
//     await redis.del(sessionKey);

//     res.status(200).json({ received: true });
//   } catch (error) {
//     next(error);
//   }
// };

import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "@packages/libs/prisma";
import { ValidationError } from "@packages/errors";

// export const getSellerOrders: RequestHandler = async (req, res, next) => {
//   try {
//     const shop = await prisma.shops.findUnique({
//       where: { sellerId: (req as any).seller.id },
//     });

//     const orders = await prisma.orders.findMany({
//       where: { shopId: shop?.id },
//       include: {
//         user: {
//           select: { id: true, name: true, email: true, avatar: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // Notice: no `return` here
//     res.status(201).json({ success: true, orders });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getOrderDetails: RequestHandler = async (req, res, next) => {
//   try {
//     // 1. Grab the order ID from the URL params
//     const orderId = req.params.id;

//     // 2. Load the order and its line items
//     const order = await prisma.orders.findUnique({
//       where: { id: orderId },
//       include: { items: true },
//     });

//     if (!order) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });
//     }

//     // 3. Optionally load the shipping address
//     const shippingAddress = order.shippingAddressId
//       ? await prisma.address.findUnique({
//           where: { id: order.shippingAddressId },
//         })
//       : null;

//     // 4. Optionally load the coupon/discount code
//     const coupon = order.couponCode
//       ? await prisma.discount_codes.findUnique({
//           where: { discountCode: order.couponCode },
//         })
//       : null;

//     // 5. Fetch all products referenced by the line items
//     const productIds = order.items.map((item) => item.productId);
//     const products = await prisma.products.findMany({
//       where: { id: { in: productIds } },
//       select: {
//         id: true,
//         title: true,
//         images: true,
//       },
//     });

//     // 6. Build a lookup map so we can merge product details back onto each item
//     const productMap = new Map(products.map((p) => [p.id, p]));

//     // 7. Assemble the items array with selectedOptions + full product details
//     const items = order.items.map((item) => ({
//       ...item,
//       selectedOptions: item.selectedOptions,
//       product: productMap.get(item.productId) ?? null,
//     }));

//     // 8. Respond with a combined payload
//     res.status(200).json({
//       success: true,
//       order: {
//         ...order,
//         items,
//         shippingAddress,
//         coupon,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// ——————————————
// Sample hard‑coded data
// ——————————————
// ——————————————
// Sample hard‑coded data
// ——————————————

interface OrderSummary {
  id: string;
  orderId: string;
  buyer: string;
  total: number;
  status: string;
  date: string;
}

interface OrderDetails extends Omit<OrderSummary, "orderId" | "status"> {
  paymentStatus: string;
  deliveryStatus: string;
  shippingAddress: {
    id: string;
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    title: string;
    images: string[];
    quantity: number;
    selectedOptions: Record<string, any>;
    unitPrice: number;
  }>;
}

const sampleOrders: OrderSummary[] = [
  {
    id: "69cec3",
    orderId: "#69CEC3",
    buyer: "Shahriar Sajeeb",
    total: 40,
    status: "Paid",
    date: "25/05/2025",
  },
  {
    id: "47db6f",
    orderId: "#47DB6F",
    buyer: "Shahriar Sajeeb",
    total: 40,
    status: "Paid",
    date: "25/05/2025",
  },
  // ...more rows if you like
];

let sampleOrderDetails: OrderDetails = {
  id: "69cec3",
  paymentStatus: "Paid",
  total: 40,
  date: "25/05/2025",
  deliveryStatus: "Ordered",
  buyer: "Shahriar Sajeeb",
  shippingAddress: {
    id: "addr_123",
    name: "Rivercity Condo",
    street: "Jalan Ipoh",
    city: "Kuala Lumpur",
    postalCode: "7421",
    country: "Malaysia",
  },
  items: [
    {
      productId: "prod_abc",
      title: "test",
      images: ["https://example.com/test.png"],
      quantity: 1,
      selectedOptions: { size: "XS" },
      unitPrice: 40,
    },
  ],
};

// ——————————————
// Controller stubs
// ——————————————

/** GET /get-seller-orders */
export const getSellerOrders: RequestHandler = (_req, res) => {
  return res.status(200).json({ success: true, orders: sampleOrders });
};

/** GET /get-order-details/:id */
export const getOrderDetails: RequestHandler = (req, res) => {
  const { id } = req.params;
  if (id !== sampleOrderDetails.id) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  return res.status(200).json({ success: true, order: sampleOrderDetails });
};

/** PUT /update-status/:id */

// export const updateDeliveryStatus = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { orderId } = req.params;
//     const { deliveryStatus } = req.body;

//     if (!orderId || !deliveryStatus) {
//       return res
//         .status(400)
//         .json({ error: "Missing order ID or delivery status." });
//     }

//     const allowedStatuses = [
//       "Ordered",
//       "Packed",
//       "Shipped",
//       "Out for Delivery",
//       "Delivered",
//     ];

//     if (!allowedStatuses.includes(deliveryStatus)) {
//       return next(new ValidationError("Invalid delivery status."));
//     }

//     const existingOrder = await prisma.orders.findUnique({
//       where: { id: orderId },
//     });

//     if (!existingOrder) {
//       return next(new NotFoundError("Order not found!"));
//     }

//     const updatedOrder = await prisma.orders.update({
//       where: { id: orderId },
//       data: {
//         deliveryStatus,
//         updatedAt: new Date(),
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Delivery status updated successfully.",
//       order: updatedOrder,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

export const verifyCouponCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Grab couponCode + cart from the request body
    const { couponCode, cart } = req.body as {
      couponCode?: string;
      cart?: Array<{
        id: string;
        sale_price: number;
        quantity: number;
        discount_codes?: Array<{ id: string }>;
      }>;
    };

    // 2) Validate presence
    if (!couponCode || !Array.isArray(cart) || cart.length === 0) {
      return next(new ValidationError("Coupon code and cart are required!"));
    }

    // 3) Fetch the discount record
    const discount = await prisma.discount_codes.findUnique({
      where: { discountCode: couponCode },
    });

    if (!discount) {
      return next(new ValidationError("Coupon code isn't valid!"));
    }

    // 4) Find a cart item which lists this discount’s ID
    const matchingProduct = cart.find((item) =>
      item.discount_codes?.some((d) => d.id === discount.id)
    );

    if (!matchingProduct) {
      // valid request but no eligible product in cart
      return res.status(200).json({
        valid: false,
        discount: 0,
        discountAmount: 0,
        message: "No matching product found in cart for this coupon",
      });
    }

    // 5) Compute the line‐item total
    const price = matchingProduct.sale_price * matchingProduct.quantity;

    // 6) Calculate the discount amount
    let discountAmount = 0;
    if (discount.discountType === "percentage") {
      discountAmount = (price * discount.discountValue) / 100;
    } else if (discount.discountType === "flat") {
      discountAmount = discount.discountValue;
    }

    // 7) Never exceed the item’s total
    discountAmount = Math.min(discountAmount, price);

    // 8) Return a 200 JSON payload
    return res.status(200).json({
      valid: true,
      discount: discount.discountValue,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      discountedProductId: matchingProduct.id,
      discountType: discount.discountType,
      message: `Discount applied to 1 eligible product`,
    });
  } catch (err) {
    next(err);
  }
};

// export const getUserOrders: RequestHandler = async (req, res, next) => {
//   try {
//     // 1) Find all orders for the currently authenticated user
//     const orders = await prisma.orders.findMany({
//       where: {
//         userId: (req as any).user.id, // ← filter by logged‑in user
//       },
//       include: {
//         items: true, // include line items
//         shippingAddress: true, // include address if you like
//         coupon: true, // etc.
//       },
//       orderBy: {
//         createdAt: "desc", // newest first
//       },
//     });

//     // 2) Return them
//     res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const getAdminOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch all orders
    const orders = await prisma.orders.findMany({
      include: {
        user: true,
        shop: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
