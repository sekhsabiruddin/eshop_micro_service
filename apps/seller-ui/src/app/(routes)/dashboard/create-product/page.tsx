"use client";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import ImagePlaceHolder from "apps/seller-ui/src/shared/components/image-placeholder";
import Input from "packages/components/input/input";
import ColorSelector from "packages/components/color-selctor";
import CustomSpecifications from "packages/components/custom-specifications";
import CustomProperties from "packages/components/custom-properties";
const Page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = file;

    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    }

    setImages(updatedImages);
    setValue("images", updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);

      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      return updatedImages;
    });
  };

  const onSubmit = (data: any) => {
    console.log("Form Submitted:", data);
  };

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Product
      </h2>
      <div className="flex items-center">
        <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        <ChevronRight size={20} />
        <span>Create Product</span>
      </div>

      <div className="py-4 w-full flex gap-6">
        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="765 x 850"
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            {images.slice(1).map((_, index) => (
              <ImagePlaceHolder
                key={index}
                setOpenImageModal={setOpenImageModal}
                size="765 x 850"
                small
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>
        {/* Right side – form inputs */}
        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            {/* Product Title Input */}
            <div className="w-2/4">
              {/* Add input here */}
              <Input
                label="Product Title *"
                placeholder="Enter product title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message as string}
                </p>
              )}
              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short Description * (Max 150 words)"
                  placeholder="Enter product description for quick view"
                  {...register("description", {
                    required: "Description is required",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description cannot exceed 150 words (Current: ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message as string}
                  </p>
                )}
                <div className="mt-2">
                  <Input
                    label="Tags *"
                    placeholder="apple,flagship"
                    {...register("tags", {
                      required: "Separate related products tags with a comma,",
                    })}
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.tags.message as string}
                    </p>
                  )}
                  <div className="mt-2">
                    <Input
                      label="Warranty *"
                      placeholder="1 Year / No Warranty"
                      {...register("warranty", {
                        required: "Warranty is required!",
                      })}
                    />
                    {errors.warranty && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.warranty.message as string}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <Input
                      label="Slug *"
                      placeholder="product_slug"
                      {...register("slug", {
                        required: "Slug is required!",
                        pattern: {
                          value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                          message:
                            "Invalid slug format! Use only lowercase letters, numbers, and hyphens.",
                        },
                        minLength: {
                          value: 3,
                          message: "Slug must be at least 3 characters long.",
                        },
                        maxLength: {
                          value: 50,
                          message: "Slug cannot be longer than 50 characters.",
                        },
                      })}
                    />

                    {errors.slug && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.slug.message as string}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <ColorSelector control={control} errors={errors} />
                  </div>
                  <div className="mt-2">
                    <CustomSpecifications control={control} errors={errors} />
                  </div>
                  <div className="mt-2">
                    <CustomProperties control={control} errors={errors} />
                  </div>
                  <div className="mt-2">
                    <div className="mt-2">
                      <label className="block font-semibold text-gray-300 mb-1">
                        Cash On Delivery *
                      </label>
                    </div>

                    <select
                      {...register("cash_on_delivery", {
                        required: "Cash on Delivery is required",
                      })}
                      defaultValue="yes"
                      className="w-full border outline-none border-gray-700 bg-transparent"
                    >
                      <option value="yes" className="bg-black">
                        Yes
                      </option>
                      <option value="no" className="bg-black">
                        No
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* //child-right side categories */}
          <div className="w-2/4">
            <label className="block font-semibold text-gray-300 mb-1">
              Category *
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
