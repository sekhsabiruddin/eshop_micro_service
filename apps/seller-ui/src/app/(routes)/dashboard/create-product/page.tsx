"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "./components/ImageUpload";
import BasicInfoSection from "./components/BasicInfoSection";
import CategorySection from "./components/CategorySection";
import DescriptionEditor from "./components/DescriptionEditor";
import PricingStockSection from "./components/PricingStockSection";
import DiscountSelector from "./components/DiscountSelector";
import EnhancementModal from "./components/EnhancementModal";
import axiosInstance from "../../../utils/axiosinstance";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [images, setImages] = useState<(any | null)[]>([null]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [pictureUploadingLoader, setPictureUploadingLoader] = useState(false); // ✅ Add this line
  const [appliedEffects, setAppliedEffects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const applyTransformation = (effect: string) => {
    setProcessing(true);
    setActiveEffect(effect);

    setTimeout(() => {
      // ✅ Add new effect only if not already added
      const updatedEffects = Array.from(new Set([...appliedEffects, effect]));
      setAppliedEffects(updatedEffects);

      // ✅ Build single ?tr= URL with effects joined by `:`
      const [baseUrl] = selectedImage.split("?"); // remove previous ?tr= if any
      const newTransformedUrl = `${baseUrl}?tr=${updatedEffects.join(":")}`;

      console.log("Transformed URL:", newTransformedUrl);
      setSelectedImage(newTransformedUrl);
      setProcessing(false);
    }, 500);
  };
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const validImages = images
        .filter((img) => img?.fileId && img?.file_url)
        .map((img) => ({
          file_id: img.fileId,
          url: img.file_url,
        }));

      if (validImages.length === 0) {
        toast.error("Please upload at least one image");
        setLoading(false);
        return;
      }

      const payload = {
        ...data,
        images: validImages, // ✅ Matches Prisma JSON structure
      };
      console.log("payload", payload);
      await axiosInstance.post("/product/api/create-product", payload);
      router.push("/dashboard/all-products");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <ImageUpload
        images={images}
        setImages={setImages}
        setOpenImageModal={setOpenImageModal}
        setSelectedImage={setSelectedImage}
        setValue={setValue}
        pictureUploadingLoader={pictureUploadingLoader} // ✅ Pass state
        setPictureUploadingLoader={setPictureUploadingLoader} // ✅ Pass setter
      />

      <BasicInfoSection register={register} errors={errors} control={control} />

      <CategorySection
        control={control}
        watch={watch}
        errors={errors}
        setValue={setValue}
      />

      <DescriptionEditor
        control={control}
        errors={errors}
        register={register}
      />

      <PricingStockSection
        register={register}
        watch={watch}
        errors={errors}
        control={control}
      />

      <DiscountSelector control={control} watch={watch} setValue={setValue} />

      <div className="text-right">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Submit
        </button>
      </div>

      <EnhancementModal
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        imageUrl={selectedImage}
        applyTransformation={applyTransformation}
        processing={processing}
        activeEffect={activeEffect}
      />
    </form>
  );
};

export default Page;
