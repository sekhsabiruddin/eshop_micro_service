// import React, { useMemo } from "react";
// import { Controller } from "react-hook-form";

// const CategorySection = ({
//   control,
//   watch,
//   errors,
//   setValue,
//   categories = [],
//   subCategoriesData = {},
// }: any) => {
//   const selectedCategory = watch("category");
//   const subcategories = useMemo(() => {
//     return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
//   }, [selectedCategory, subCategoriesData]);

//   return (
//     <div className="space-y-4">
//       <label className="block font-semibold text-gray-300 mb-1">
//         Category *
//       </label>
//       <Controller
//         name="category"
//         control={control}
//         rules={{ required: "Category is required" }}
//         render={({ field }) => (
//           <select
//             {...field}
//             className="w-full border outline-none border-gray-700 bg-transparent text-white px-3 py-2 rounded-md"
//             defaultValue=""
//           >
//             <option value="" disabled className="bg-black text-gray-400">
//               Select Category
//             </option>
//             {categories.map((category: string) => (
//               <option
//                 key={category}
//                 value={category}
//                 className="bg-black text-white"
//               >
//                 {category}
//               </option>
//             ))}
//           </select>
//         )}
//       />

//       <label className="block font-semibold text-gray-300 mb-1">
//         Subcategory *
//       </label>
//       <Controller
//         name="subCategory"
//         control={control}
//         rules={{ required: "Subcategory is required" }}
//         render={({ field }) => (
//           <select
//             {...field}
//             className="w-full border outline-none border-gray-700 bg-transparent text-white px-3 py-2 rounded-md"
//           >
//             <option value="" className="bg-black text-gray-400">
//               Select Subcategory
//             </option>
//             {subcategories.map((subcategory: string) => (
//               <option
//                 key={subcategory}
//                 value={subcategory}
//                 className="bg-black text-white"
//               >
//                 {subcategory}
//               </option>
//             ))}
//           </select>
//         )}
//       />
//     </div>
//   );
// };

// export default CategorySection;

"use client";

import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "apps/seller-ui/src/app/utils/axiosinstance";

// ✅ Local fetch function inside this file
const fetchCategories = async () => {
  const res = await axiosInstance.get("/product/api/get-categories");
  return res.data;
};

const CategorySection = ({ control, watch, errors, setValue }: any) => {
  const selectedCategory = watch("category");

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};

  const subcategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  if (isLoading) return <p className="text-white">Loading categories...</p>;
  if (error) return <p className="text-red-500">Failed to load categories</p>;

  return (
    <div className="space-y-4">
      <label className="block font-semibold text-gray-300 mb-1">
        Category *
      </label>
      <Controller
        name="category"
        control={control}
        rules={{ required: "Category is required" }}
        render={({ field }) => (
          <select
            {...field}
            className="w-full border outline-none border-gray-700 bg-transparent text-white px-3 py-2 rounded-md"
            defaultValue=""
          >
            <option value="" disabled className="bg-black text-gray-400">
              Select Category
            </option>
            {categories.map((category: string) => (
              <option
                key={category}
                value={category}
                className="bg-black text-white"
              >
                {category}
              </option>
            ))}
          </select>
        )}
      />

      <label className="block font-semibold text-gray-300 mb-1">
        Subcategory *
      </label>
      <Controller
        name="subCategory"
        control={control}
        rules={{ required: "Subcategory is required" }}
        render={({ field }) => (
          <select
            {...field}
            className="w-full border outline-none border-gray-700 bg-transparent text-white px-3 py-2 rounded-md"
          >
            <option value="" className="bg-black text-gray-400">
              Select Subcategory
            </option>
            {subcategories.map((subcategory: string) => (
              <option
                key={subcategory}
                value={subcategory}
                className="bg-black text-white"
              >
                {subcategory}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
};

export default CategorySection;
