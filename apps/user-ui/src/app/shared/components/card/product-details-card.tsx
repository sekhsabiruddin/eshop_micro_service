"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Ratings from "../ratings";
import { Heart, MapPin, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
import { useStore } from "apps/user-ui/src/store";
import useUser from "apps/user-ui/src/hooks/useUser";

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const addToCart = useStore((state: any) => state.addToCart);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some((item: any) => item.id === data.id);
  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item.id === data.id);
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div
      className="fixed top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/10"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[90%] md:w-[70%] 2xl:mt-0 h-max max-h-[95vh] overflow-y-auto rounded-lg bg-white p-4 md:p-6 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row w-full">
          {/* Left Side - Image */}
          <div className="w-full md:w-1/2 h-full">
            <Image
              src={data?.images?.[activeImage]?.url}
              alt="product"
              width={500}
              height={500}
              className="w-full rounded-lg object-contain"
            />
            <div className="mt-4 flex gap-2">
              {data?.images?.map((img: any, index: number) => (
                <Image
                  key={index}
                  src={img?.url}
                  alt="thumb"
                  width={60}
                  height={60}
                  className={`cursor-pointer rounded-md border ${
                    activeImage === index
                      ? "border-gray-400"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0 relative">
            {/* Close Button */}
            <button
              className="absolute right-0 top-0 text-gray-600"
              onClick={() => setOpen(false)}
            >
              <X size={25} />
            </button>

            {/* Seller Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-3">
              <Image
                src={data?.Shop?.avatar}
                alt="Shop Logo"
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div>
                <Link
                  href={`/shop/${data?.Shop?.id}`}
                  className="font-medium text-lg"
                >
                  {data?.Shop?.name}
                </Link>
                <Ratings rating={data?.Shop?.ratings} />
                <p className="text-gray-600 flex items-center gap-1 text-sm">
                  <MapPin size={16} />
                  {data?.Shop?.address || "Location Not Available"}
                </p>
              </div>
              <button
                onClick={() => router.push(`/inbox?shopId=${data?.shop?._id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow transition"
              >
                💬 Chat with Seller
              </button>
            </div>

            {/* Product Info */}
            <h3 className="text-xl font-semibold mt-4">{data?.title}</h3>
            <p className="text-gray-700 mt-2">{data?.short_description}</p>

            {data?.brand && (
              <p className="mt-2">
                <strong>Brand:</strong> {data.brand}
              </p>
            )}

            {/* Color Options */}
            {data?.colors?.length > 0 && (
              <div className="mt-4">
                <strong>Color:</strong>
                <div className="flex gap-2 mt-1">
                  {data.colors.map((color: string, index: number) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 ${
                        isSelected === color
                          ? "border-gray-400 scale-110 shadow"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setIsSelected(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Options */}
            {data?.sizes?.length > 0 && (
              <div className="mt-4">
                <strong>Size:</strong>
                <div className="flex gap-2 mt-1">
                  {data.sizes.map((size: string, index: number) => (
                    <button
                      key={index}
                      className={`px-4 py-1 rounded-md ${
                        isSizeSelected === size
                          ? "bg-gray-800 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                      onClick={() => setIsSizeSelected(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Section */}
            <div className="mt-5 flex items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">
                ${data?.sale_price}
              </h3>
              {data?.regular_price && (
                <h3 className="text-lg text-red-600 line-through">
                  ${data.regular_price}
                </h3>
              )}
            </div>

            {/* Quantity + Cart + Wishlist */}
            <div className="mt-6 flex items-center gap-5 flex-wrap">
              <div className="flex rounded-md overflow-hidden">
                <button
                  className="bg-gray-300 px-4 py-2 text-black font-medium"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="bg-gray-100 px-5 py-2 text-black font-medium">
                  {quantity}
                </span>
                <button
                  className="bg-gray-300 px-4 py-2 text-black font-medium"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  className={`flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium px-5 py-2 rounded-md shadow hover:opacity-90 transition
  ${isInCart ? "cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={() =>
                    isInCart
                      ? removeFromCart(data.id, user, location, deviceInfo)
                      : addToCart(
                          { ...data, quantity: 1 },
                          user,
                          location,
                          deviceInfo
                        )
                  }
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>

                <button className="opacity-70">
                  <Heart
                    className="cursor-pointer hover:scale-110 transition"
                    size={20}
                    stroke={isWishlisted ? "red" : "#4B5563"}
                    fill={isWishlisted ? "red" : "transparent"}
                    onClick={() =>
                      isWishlisted
                        ? removeFromWishlist(
                            data.id,
                            user,
                            location,
                            deviceInfo
                          )
                        : addToWishlist(
                            { ...data, quantity: 1 },
                            user,
                            location,
                            deviceInfo
                          )
                    }
                  />
                </button>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="mt-3 text-gray-600 text-sm">
              Estimated Delivery:{" "}
              <strong>{estimatedDelivery.toDateString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
