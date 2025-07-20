import Link from "next/link";
import React, { useEffect, useState } from "react";
import Ratings from "../ratings";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import ProductDetailsCard from "./product-details-card";
import Image from "next/image";
type ProductCardProps = {
  product: any;
  isEvent?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, isEvent }) => {
  console.log("...ProductCard..", product);
  const [timeLeft, setTimeLeft] = useState("");
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (isEvent && product?.ending_date) {
      const interval = setInterval(() => {
        const endTime = new Date(product.ending_date).getTime();
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price`);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isEvent, product?.ending_date]);

  return (
    <div className="w-full max-w-[250px] bg-white rounded-lg relative shadow-sm overflow-hidden">
      {/* Badges */}
      {isEvent && (
        <div className="absolute top-2 left-2 text-white text-[10px] bg-red-500 font-semibold px-2 py-1 rounded-sm shadow">
          OFFER
        </div>
      )}
      {product?.stock <= 5 && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-slate-800 text-[10px] font-semibold px-2 py-1 rounded-sm shadow">
          Limited Stock
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product?.slug}`}>
        <div>
          <Image
            src={product?.images?.[0]?.url}
            alt={product?.title}
            width={300} // required
            height={200} // required
            className="w-full h-[200px] object-contain bg-white p-4"
          />
        </div>
      </Link>

      {/* Shop Name */}
      <Link
        href={`/shop/${product?.Shop?.id}`}
        className="block text-blue-600 text-sm font-medium px-3 mt-1"
      >
        {product?.Shop?.name}
      </Link>

      {/* Title */}
      <Link href={`/product/${product?.slug}`}>
        <h3 className="text-[15px] font-semibold px-3 mt-1 text-gray-900 line-clamp-1">
          {product?.title}
        </h3>
      </Link>

      {/* Ratings */}
      <div className="px-3 mt-1">
        <Ratings rating={product?.rating} />
      </div>

      {/* Prices */}
      <div className="flex justify-between items-center px-3 mt-2">
        <div className="flex gap-2 items-center">
          <span className="text-base font-bold text-gray-900">
            ${product?.sale_price}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ${product?.regular_price}
          </span>
        </div>
        <span className="text-green-500 text-sm font-medium">
          {product.totalSales} sold
        </span>
      </div>

      {/* Time Left */}
      {isEvent && timeLeft && (
        <div className="px-3 mt-1">
          <span className="inline-block text-[11px] bg-orange-100 text-orange-600 px-2 py-[2px] rounded">
            {timeLeft}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute z-10 flex flex-col gap-2 right-2 top-[50%] -translate-y-1/2">
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <Heart
            className="cursor-pointer hover:scale-110 transition"
            size={20}
            fill="red"
            stroke="red"
          />
        </div>
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <Eye
            className="cursor-pointer text-gray-600 hover:scale-110 transition"
            size={20}
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <ShoppingBag
            className="cursor-pointer text-gray-600 hover:scale-110 transition"
            size={20}
          />
        </div>
      </div>
      {open && <ProductDetailsCard data={product} setOpen={setOpen} />}
    </div>
  );
};

export default ProductCard;
