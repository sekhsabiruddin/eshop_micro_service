import { cache } from "react";
import axiosInstance from "apps/user-ui/src/utils/axiosinstance";
import { Metadata } from "next";
import React from "react";
import ProductDetails from "../../../shared/modules/product/product-details";
import { debug } from "console";
import axios from "axios";

// ✅ Cache the product fetch to avoid double API calls
const fetchProductDetails = cache(async (slug: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URI}/product/api/get-products/${slug}`;
    console.log("Fetching:", url);
    const response = await axios.get(url);
    return response.data.product;
  } catch (err: any) {
    console.error("Error fetching product:", err.response?.status, err.message);
    return null;
  }
});
// ✅ Use the cached fetch in metadata generation
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  debugger;
  const product = await fetchProductDetails(params.slug);

  return {
    title: `${product?.title} | Becodemy Marketplace`,
    description:
      product?.short_description ||
      "Discover high-quality products on Becodemy Marketplace.",
    openGraph: {
      title: product?.title,
      description: product?.short_description || "",
      images: [product?.images?.[0]?.url || "/default-image.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product?.title,
      description: product?.short_description || "",
      images: [product?.images?.[0]?.url || "/default-image.jpg"],
    },
  };
}

// ✅ Also use the cached fetch in your page component
const Page = async ({ params }: { params: { slug: string } }) => {
  const productDetails = await fetchProductDetails(params.slug);
  return (
    <div>
      <ProductDetails productDetails={productDetails} />
    </div>
  );
};

export default Page;
