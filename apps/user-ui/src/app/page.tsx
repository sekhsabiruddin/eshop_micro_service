"use client";
import React from "react";
import Hero from "./shared/modules/hero";
import SectionTitle from "./shared/components/section/section-tite";
import axiosInstance from "../utils/axiosinstance";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./shared/components/card/product-card";
import ShopCard from "./shared/components/card/shop.card";
const fetchProducts = async () => {
  const res = await axiosInstance.get(
    "/product/api/get-all-products?page=1&limit=10"
  );
  console.log("All product in frontend components===>", res.data.products);
  return res.data.products;
};

const Page = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Optionally alias the data as "products"
  const products = data ?? [];

  const { data: latestProducts } = useQuery({
    queryKey: ["latest-products"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/product/api/get-all-products?page=1&limit=10&type=latest"
      );

      return res.data.products;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
  const { data: shops, isLoading: shopLoading } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/top-shops");
      return res.data.shops;
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/product/api/get-all-events?page=1&limit=10"
      );
      return res.data.events;
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div>
      {/* Hero section start here  */}
      <Hero />
      {/* Hero section end here  */}
      {/* section title start  here  */}
      <div className="md:w-[80%] w-[90%] my-10 m-auto">
        <div className="mb-8">
          <SectionTitle title="Suggested Product" />
        </div>
        {/* section title end  here  */}
        {isLoading && (
          <div className="m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
              />
            ))}
          </div>
        )}
        {!isLoading && !isError && (
          <div className="m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {/* product is not found */}
        {products?.length === 0 && !isLoading && (
          <div className="text-center text-gray-500">No products found.</div>
        )}
        {/* Lazy loading section */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
              ></div>
            ))}
          </div>
        )}
        {/* Lastest Products start here */}
        <div className="my-8 block">
          <SectionTitle title="Latest Products" />
        </div>

        {!isLoading && !isError && (
          <div className="m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">
            {latestProducts?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {latestProducts?.length === 0 && (
          <p className="text-center">No products available yet!</p>
        )}

        {/* Lastest Products end here */}
        {/* //top shops section start here */}
        <div className="my-8 block">
          <SectionTitle title="Top Shops" />
        </div>

        {!shopLoading && (
          <div className="m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">
            {shops?.map((shop: any) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
        {shops?.length === 0 && (
          <p className="text-center">No shops available yet!</p>
        )}
        {/* //top shops section end here */}
        {/* Offers section start here */}
        <div className="my-8 block">
          <SectionTitle title="Top offers" />
        </div>

        {!offersLoading && !isError && (
          <div className="m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">
            {offers?.map((product: any) => (
              <ProductCard key={product.id} product={product} isEvent={true} />
            ))}
          </div>
        )}
        {/* Offers section end here */}
      </div>
    </div>
  );
};

export default Page;
