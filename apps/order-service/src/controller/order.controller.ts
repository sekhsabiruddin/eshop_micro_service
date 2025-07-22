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
