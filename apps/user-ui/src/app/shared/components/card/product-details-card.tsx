// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";
// import Ratings from "../ratings";
// import { Heart, MapPin, ShoppingBag, X } from "lucide-react";
// import { useRouter } from "next/navigation";

// const ProductDetailsCard = ({
//   data,
//   setOpen,
// }: {
//   data: any;
//   setOpen: (open: boolean) => void;
// }) => {
//   const [activeImage, setActiveImage] = useState(Number);
//   const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
//   const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
//   const [quantity, setQuantity] = useState(1);
//   const router = useRouter();
//   const estimatedDelivery = new Date(); // Example. Replace with actual logic if needed.
//   estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
//   console.log("console.log image ", data?.images?.[activeImage]?.url);
//   return (
//     <div
//       className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50"
//       onClick={() => setOpen(false)}
//     >
//       <div
//         className="w-[90%] md:w-[70%] md:mt-14 2xl:mt-0 h-max overflow-scroll min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="w-full flex flex-col md:flex-row">
//           <div className="w-full md:w-1/2 h-full">
//             <Image
//               src={data?.images?.[activeImage]?.url}
//               alt={data?.images?.[activeImage]?.url}
//               width={400}
//               height={400}
//               className="w-full rounded-lg object-contain"
//             />
//             {/* Thumbnails */}
//             <div className="flex gap-2 mt-4">
//               {data?.images?.map((img: any, index: number) => (
//                 <div
//                   key={index}
//                   className={`cursor-pointer border rounded-md ${
//                     activeImage === index
//                       ? "border-gray-500 pt-1"
//                       : "border-transparent"
//                   }`}
//                 >
//                   {/* Thumbnail Image can go here */}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
//             <div className="border-b relative pb-3 border-gray-200 flex items-start gap-3">
//               {/* Shop Logo */}
//               <Image
//                 src={data?.Shop?.avatar}
//                 alt="Shop Logo"
//                 width={60}
//                 height={60}
//                 className="rounded-full w-[60px] h-[60px] object-cover"
//               />
//             </div>

//             <div>
//               <Link
//                 href={`/shop/${data?.Shop?.id}`}
//                 className="text-lg font-medium"
//               >
//                 {data?.Shop?.name}
//               </Link>
//             </div>

//             {/* Shop Ratings */}
//             <span className="block mt-1">
//               <Ratings rating={data?.Shop?.ratings} />
//             </span>

//             {/* Shop Location */}
//             <p className="text-gray-600 mt-1 flex items-center gap-1">
//               <MapPin size={20} />{" "}
//               {data?.Shop?.address || "Location Not Available"}
//             </p>

//             {/* Chat with Seller Button */}
//             <button
//               className="flex cursor-pointer items-center gap-2 px-4 py-2 mt-4 border rounded"
//               onClick={() => router.push(`/inbox?shopId=${data?.Shop?.id}`)}
//             >
//               💬 Chat with Seller
//             </button>
//             {/* Close Button */}
//             <button className="w-full absolute cursor-pointer right-[-5px] top-[-5px] flex justify-end my-2 mt-[-10px]">
//               <X size={25} onClick={() => setOpen(false)} />
//             </button>
//             <h3 className="text-xl font-semibold mt-3">{data?.title}</h3>
//             <p className="mt-2 text-gray-700 whitespace-pre-wrap w-full">
//               {data?.short_description}{" "}
//             </p>
//             {/* Brand */}
//             {data?.brand && (
//               <p className="mt-2">
//                 <strong>Brand:</strong> {data.brand}
//               </p>
//             )}
//             {/* Color Options */}
//             {data?.colors?.length > 0 && (
//               <div>
//                 <strong>Color:</strong>
//                 <div className="flex gap-2 mt-1">
//                   {data.colors.map((color: string, index: number) => (
//                     <button
//                       key={index}
//                       className={`w-8 h-8 cursor-pointer rounded-full border-2
//             ${
//               isSelected === color
//                 ? "border-gray-400 scale-110 shadow-md"
//                 : "border-transparent"
//             }`}
//                       onClick={() => setIsSelected(color)}
//                       style={{ backgroundColor: color }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Size Options */}
//             {data?.sizes?.length > 0 && (
//               <div>
//                 <strong>Size:</strong>
//                 <div className="flex gap-2 mt-1">
//                   {data.sizes.map((size: string, index: number) => (
//                     <button
//                       key={index}
//                       className={`px-4 py-1 cursor-pointer rounded-md ${
//                         isSizeSelected === size
//                           ? "bg-gray-800 text-white"
//                           : "bg-gray-300 text-black"
//                       }`}
//                       onClick={() => setIsSizeSelected(size)}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {/* Price Section */}
//             <div className="mt-5 flex items-center gap-4">
//               <h3 className="text-2xl font-semibold text-gray-900">
//                 ${data?.sale_price}
//               </h3>

//               {data?.regular_price && (
//                 <h3 className="text-lg text-red-600 line-through">
//                   ${data.regular_price}
//                 </h3>
//               )}
//             </div>
//             <div className="mt-5 flex items-center gap-5">
//               {/* Quantity Control */}
//               <div className="flex items-center gap-5 mt-5">
//                 <button
//                   className="px-3 cursor-pointer py-1 bg-gray-300"
//                   onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
//                 >
//                   -
//                 </button>
//                 <span className="px-4 bg-gray-100 py-1">{quantity}</span>
//                 <button
//                   className="px-3 py-1 cursor-pointer bg-gray-300"
//                   onClick={() => setQuantity((prev) => prev + 1)}
//                 >
//                   +
//                 </button>
//               </div>
//               {/* Cart and Wishlist Buttons */}
//               <div className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] mt-5">
//                 <button className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5]">
//                   <ShoppingBag size={18} />
//                 </button>
//                 <button className="opacity-[.7] cursor-pointer">
//                   <Heart size={30} fill="red" color="black" />
//                 </button>
//               </div>
//               {/* //estimate delivery tine */}
//               <div className="mt-3 text-gray-600 text-sm">
//                 Estimated Delivery:{" "}
//                 <strong>{estimatedDelivery.toDateString()}</strong>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsCard;

"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Ratings from "../ratings";
import { Heart, MapPin, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";

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
                <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium px-5 py-2 rounded-md shadow hover:opacity-90 transition">
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>

                <button className="opacity-70">
                  <Heart size={30} fill="red" color="black" />
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
