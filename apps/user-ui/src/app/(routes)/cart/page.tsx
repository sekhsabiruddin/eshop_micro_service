"use client";
import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useUser from "apps/user-ui/src/hooks/useUser";
import { useStore } from "apps/user-ui/src/store";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CartPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [discountedProductId, setDiscountedProductId] = useState("");
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();

  const cart = useStore((state: any) => state.cart);
  const removeFromCart = useStore((state: any) => state.removeFromCart);

  const [loading, setLoading] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const decreaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  };

  const increaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id
          ? { ...item, quantity: item.quantity ? item.quantity + 1 : 2 }
          : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    removeFromCart(id, user, location, deviceInfo);
  };
  const discountAmount = cart.reduce((acc: number, item: any) => {
    if (item.id === discountedProductId) {
      const originalPrice = item.sale_price;
      const discounted = (originalPrice * (100 - discountPercent)) / 100;
      return acc + (originalPrice - discounted) * (item.quantity || 1);
    }
    return acc;
  }, 0);
  const subtotal = cart.reduce((acc: number, item: any) => {
    return acc + item.sale_price * (item.quantity || 1);
  }, 0);

  return (
    <div className="w-full bg-white">
      <div className="md:w-[80%] w-[95%] mx-auto min-h-screen">
        <div className="pb-[50px]">
          <h1 className="md:pt-[50px] font-medium text-[44px] leading-[1] mb-[16px] font-jost">
            {/* Your heading text here */}
            Shpoing cart
          </h1>
          <Link href="/" className="text-[#55585b] hover:underline">
            Home
          </Link>

          <span className="inline-block p-[1.5px] mx-1 bg-[#a8acb0] rounded-full"></span>

          <span className="text-[#55585b]">Wishlist</span>
        </div>
        {cart.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            Your cart is empty! Start adding products.
          </div>
        ) : (
          <div className="lg:flex items-start gap-10">
            <table className="w-full lg:w-[70%] border-collapse">
              <thead className="bg-[#f1f3f4] rounded">
                <tr>
                  <th className="py-3 text-left pl-6 align-middle">Product</th>
                  <th className="py-3 text-center align-middle">Price</th>
                  <th className="py-3 text-center align-middle">Quantity</th>
                  <th className="py-3 text-center align-middle"></th>
                </tr>
              </thead>
              <tbody>
                {cart?.map((item: any) => (
                  <tr key={item.id} className="border-b border-b-[#0000000e]">
                    <td className="flex items-center gap-4 p-4">
                      <Image
                        src={item?.images[0]?.url}
                        alt={item.title}
                        width={80}
                        height={80}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        {item?.selectedOptions && (
                          <div className="text-sm text-gray-500">
                            {item?.selectedOptions?.color && (
                              // You can render the color here, e.g.
                              <span>
                                Color:{" "}
                                <span
                                  style={{
                                    backgroundColor:
                                      item?.selectedOptions?.color,
                                    width: "12px",
                                    height: "12px",
                                    display: "inline-block",
                                    borderRadius: "50%",
                                    marginLeft: "4px",
                                  }}
                                />
                              </span>
                            )}
                          </div>
                        )}
                        {item?.selectedOptions?.size && (
                          <span className="ml-2">
                            Size: {item?.selectedOptions?.size}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 text-lg text-center">
                      {item?.id === discountedProductId ? (
                        <div className="flex flex-col items-center">
                          <span className="line-through text-gray-500 text-sm">
                            ${item.sale_price.toFixed(2)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            $
                            {(
                              (item.sale_price * (100 - discountPercent)) /
                              100
                            ).toFixed(2)}
                          </span>
                          <span className="text-xs text-green-700 bg">
                            Discount Applied
                          </span>
                        </div>
                      ) : (
                        <span>${item.sale_price.toFixed(2)}</span>
                      )}
                    </td>
                    <td>
                      <div className="flex justify-center items-center border border-gray-200 rounded-[20px] w-[90px] p-[2px]">
                        <button
                          className="text-black cursor-pointer text-xl"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          className="text-black cursor-pointer text-xl"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="text-[#818487] cursor-pointer hover:text-[#ff1826] transition duration-200"
                        onClick={() => removeItem(item.id)}
                      >
                        {/* Icon or text like "Remove" can be placed here */}x x
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 shadow-md w-full max-w-md bg-white rounded-md">
              {/* Discount Row */}
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-[#010f1c] text-base font-medium mb-2">
                  <span className="font-jost">
                    Discount ({discountPercent}%)
                  </span>
                  <span className="text-green-600">
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Subtotal Row */}
              <div className="flex justify-between items-center text-[#010f1c] text-[18px] font-semibold mb-4">
                <span className="font-jost">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Divider */}
              <hr className="my-4 border-slate-200" />

              {/* Coupon Section */}
              <div className="mb-4">
                <h4 className="mb-2 font-medium text-sm text-[#010f1c]">
                  Have a Coupon?
                </h4>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full p-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:border-[#010f1c]"
                  />
                  <button
                    // onClick={handleApplyCoupon}
                    className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition-all text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Address Selector */}
              <div className="mb-4">
                <h4 className="mb-[7px] font-medium text-[15px]">
                  Select Shipping Address
                </h4>
                <select
                  className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none"
                //   value={selectedAddressId}
                //   onChange={(e) => setSelectedAddressId(e.target.value)}
                >
                  <option value="">Select Address</option>
                  <option value="home_ny">Home - New York - USA</option>
                  <option value="office_ca">Office - California - USA</option>
                </select>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-4">
                <h4 className="mb-[7px] font-[500] text-[15px]">
                  Select Payment Method
                </h4>
                <select
                  className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none"
                //   value={paymentMethod}
                //   onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="credit_card">Online Payment</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>

              {/* Divider */}
              <hr className="my-4 text-slate-200" />

              {/* Total */}
              <div className="flex justify-between items-center text-[#010f1c] text-[18px] font-semibold mb-4">
                <span className="font-jost">Total</span>
                <span>${(subtotal - discountAmount).toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button
                // onClick={handleCheckout}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 cursor-pointer mt-4 py-3 bg-[#010f1c] text-white hover:bg-[#0989FF] transition-all rounded-lg"
              >
                {loading && <Loader2 className="animate-spin w-5 h-5" />}
                {loading ? "Redirecting..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
