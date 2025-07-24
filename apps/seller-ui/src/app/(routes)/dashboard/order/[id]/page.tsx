// apps/seller-ui/src/app/order/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "apps/seller-ui/src/app/utils/axiosinstance";

const statuses = [
  "Ordered",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  console.log("orderId", orderId);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch order details
  const fetchOrder = async () => {
    try {
      const res = await axiosInstance.get(
        `/order/api/get-order-details/${orderId}`
      );
      setOrder(res.data.order);
    } catch (err) {
      console.error("Failed to fetch order details", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delivery‐status update
  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await axiosInstance.put(`/order/api/update-status/${order.id}`, {
        deliveryStatus: newStatus,
      });
      setOrder((prev: any) => ({ ...prev, deliveryStatus: newStatus }));
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[40vh]">
        <div className="animate-spin w-6 h-6 text-gray-600">⏳</div>
      </div>
    );
  }

  if (!order) {
    return <p className="text-center text-sm text-red-500">Order not found.</p>;
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-gray-200">
      {/* Go Back */}
      <div className="my-4">
        <span
          className="flex items-center gap-2 font-semibold cursor-pointer text-gray-200 hover:text-gray-100"
          onClick={() => router.push("/dashboard/orders")}
        >
          <ArrowLeft size={18} /> Go Back to Dashboard
        </span>
      </div>

      {/* Order ID */}
      <h1 className="text-2xl font-bold mb-4">Order #{order.id.slice(-6)}</h1>

      {/* Status Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-300 mr-3">
          Update Delivery Status:
        </label>
        <select
          value={order.deliveryStatus}
          onChange={handleStatusChange}
          disabled={updating}
          className="border bg-transparent text-gray-200 border-gray-600 rounded-md px-2 py-1"
        >
          {statuses.map((status) => {
            const currentIndex = statuses.indexOf(order.deliveryStatus);
            const statusIndex = statuses.indexOf(status);
            return (
              <option
                key={status}
                value={status}
                disabled={statusIndex < currentIndex}
              >
                {status}
              </option>
            );
          })}
        </select>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
          {statuses.map((step) => (
            <div key={step} className="flex-1 text-left">
              {step}
            </div>
          ))}
        </div>
        <div className="flex items-center">
          {statuses.map((step, idx) => {
            const passed = statuses.indexOf(order.deliveryStatus) >= idx;
            const isCurrent = order.deliveryStatus === step;
            return (
              <React.Fragment key={step}>
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCurrent
                      ? "bg-blue-600"
                      : passed
                      ? "bg-green-600"
                      : "bg-gray-600"
                  }`}
                />
                {idx < statuses.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      passed ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Payment & Date */}
      <div className="space-y-1 mb-6 text-sm">
        <p>
          <span className="font-medium">Payment Status:</span>{" "}
          <span
            className={
              order.paymentStatus === "Paid"
                ? "text-green-500"
                : "text-yellow-400"
            }
          >
            {order.paymentStatus}
          </span>
        </p>
        <p>
          <span className="font-medium">Total Paid:</span> $
          {order.total.toFixed(2)}
        </p>
        <p>
          <span className="font-medium">Date:</span> {formattedDate}
        </p>
      </div>

      {/* Shipping Address */}
      <div className="mb-8 text-sm">
        <h2 className="font-medium mb-2">Shipping Address</h2>
        <p>{order.shippingAddress?.line1}</p>
        {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
        <p>
          {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
          {order.shippingAddress?.postalCode}
        </p>
        <p>{order.shippingAddress?.country}</p>
      </div>

      {/* Order Items */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.images[0]}
                  alt={item.product?.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="space-y-1">
                  <p className="font-medium">{item.product?.title}</p>
                  <p>Quantity: {item.quantity}</p>
                  {item.selectedOptions.size && (
                    <p>Size: {item.selectedOptions.size}</p>
                  )}
                </div>
              </div>
              <p className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
