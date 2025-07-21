"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Range } from "react-range";
import ProductCard from "../../shared/components/card/product-card";

const MIN = 0;
const MAX = 1199;

const Page = () => {
  const colors = [
    { name: "Black", code: "#000" },
    { name: "Red", code: "#ff0000" },
    { name: "Green", code: "#00ff00" },
    { name: "Blue", code: "#0000ff" },
    { name: "Yellow", code: "#ffff00" },
    { name: "Magenta", code: "#ff00ff" },
    { name: "Cyan", code: "#00ffff" },
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const router = useRouter();
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([MIN, MAX]);
  const [tempPriceRange, setTempPriceRange] = useState([MIN, MAX]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label)
        ? prev.filter((cat) => cat !== label)
        : [...prev, label]
    );
  };

  const toggleColor = (label: string) => {
    setSelectedColors((prev) =>
      prev.includes(label)
        ? prev.filter((col) => col !== label)
        : [...prev, label]
    );
  };

  const toggleSize = (label: string) => {
    setSelectedSizes((prev) =>
      prev.includes(label)
        ? prev.filter((size) => size !== label)
        : [...prev, label]
    );
  };

  const fetchFilteredProducts = async () => {
    setIsProductLoading(true);
    try {
      const query = new URLSearchParams();
      query.set("priceRange", priceRange.join(","));
      if (selectedCategories.length > 0)
        query.set("categories", selectedCategories.join(","));
      if (selectedColors.length > 0)
        query.set("colors", selectedColors.join(","));
      if (selectedSizes.length > 0) query.set("sizes", selectedSizes.join(","));
      query.set("page", page.toString());
      query.set("limit", "12");

      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_URI
        }/product/api/get-filtered-offers?${query.toString()}`
      );
      setProducts(res.data.products);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsProductLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    params.set("priceRange", priceRange.join(","));
    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (selectedColors.length > 0)
      params.set("colors", selectedColors.join(","));
    if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","));
    params.set("page", page.toString());
    router.replace(`/offers?${decodeURIComponent(params.toString())}`);
  };

  useEffect(() => {
    updateURL();
    fetchFilteredProducts();
  }, [priceRange, selectedCategories, selectedColors, selectedSizes, page]);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/product/api/get-categories`
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  return (
    <div className="w-full bg-[#f5f5f5] pb-10">
      <div className="w-[90%] lg:w-[80%] m-auto">
        <div className="pb-[50px]">
          <h1 className="md:pt-[40px] font-medium text-[44px] mb-[14px] font-Jost">
            All Products
          </h1>
          <Link href="/" className="text-[#55585b] hover:underline">
            Home
          </Link>
          <span className="inline-block mx-1">›</span>
          <span className="text-[#55585b]">All Products</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[270px] bg-white p-4 shadow space-y-6 rounded">
            {/* Price Filter */}
            <h3 className="text-xl font-Poppins font-medium">Price Filter</h3>
            <div className="ml-2">
              <Range
                step={1}
                min={MIN}
                max={MAX}
                values={tempPriceRange}
                onChange={setTempPriceRange}
                renderTrack={({ props, children }) => {
                  const [min, max] = tempPriceRange;
                  const percentageLeft = ((min - MIN) / (MAX - MIN)) * 100;
                  const percentageRight = ((max - MIN) / (MAX - MIN)) * 100;
                  return (
                    <div
                      {...props}
                      className="h-[6px] bg-blue-200 rounded relative"
                    >
                      <div
                        className="absolute h-full bg-blue-600 rounded"
                        style={{
                          left: `${percentageLeft}%`,
                          width: `${percentageRight - percentageLeft}%`,
                        }}
                      />
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-4 h-4 bg-blue-600 rounded-full shadow"
                  />
                )}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                ${tempPriceRange[0]} - ${tempPriceRange[1]}
              </div>
              <button
                onClick={() => {
                  setPriceRange(tempPriceRange);
                  setPage(1);
                }}
                className="text-sm px-4 py-1 bg-gray-200 hover:bg-blue-600 hover:text-white transition rounded"
              >
                Apply
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xl font-Poppins font-medium border-b border-b-slate-300 pb-1">
                Categories
              </h3>
              <ul className="space-y-2 mt-3">
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  data?.categories?.map((category: string) => (
                    <li
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <label className="flex items-center gap-3 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="accent-blue-600"
                        />
                        {category}
                      </label>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-xl font-Poppins font-medium border-b border-b-slate-300 pb-1">
                Filter by Color
              </h3>
              <ul className="space-y-2 mt-3">
                {colors.map((color) => (
                  <li
                    key={color.name}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color.name)}
                        onChange={() => toggleColor(color.name)}
                        className="accent-blue-600"
                      />
                      <span
                        className="w-[16px] h-[16px] rounded-full border border-gray-200"
                        style={{ backgroundColor: color.code }}
                      ></span>
                      {color.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-xl font-Poppins font-medium border-b border-b-slate-300 pb-1">
                Sizes
              </h3>
              <ul className="space-y-2 mt-3">
                {sizes.map((size) => (
                  <li key={size} className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleSize(size)}
                        className="accent-blue-600"
                      />
                      {size}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          {/* product grid */}
          <div className="flex-1 px-2 lg:px-3">
            {isProductLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
                  ></div>
                ))}
              </div>
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p>No Products found!</p>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 !rounded border border-gray-200 text-sm ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
