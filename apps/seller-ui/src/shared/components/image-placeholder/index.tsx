"use client";
import { Pencil, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface ImagePlaceHolderProps {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove?: (index: number) => void;
  defaultImage?: string | null;
  setOpenImageModal: (open: boolean) => void;
  index?: number;
  setSelectedImage: (url: string) => void;
  images?: any[];
  pictureUploadingLoader?: boolean;
}

const ImagePlaceHolder: React.FC<ImagePlaceHolderProps> = ({
  size,
  small = false,
  onImageChange,
  onRemove,
  defaultImage = null,
  setOpenImageModal,
  index = 0,
  setSelectedImage,
  images = [],
  pictureUploadingLoader,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      onImageChange(file, index);
    }
  };

  const uploadedImage = images[index];

  // Fallback to uploaded image from backend
  const imageToShow = imagePreview || uploadedImage?.file_url;

  return (
    <div
      className={`relative ${
        small ? "h-[180px]" : "h-[450px]"
      } w-full cursor-pointer bg-[#1e1e1e] border border-gray-600 rounded-lg flex flex-col justify-center items-center overflow-hidden`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`image-upload-${index}`}
        onChange={handleFileChange}
      />

      {/* ICONS */}
      {imageToShow ? (
        <>
          <button
            disabled={pictureUploadingLoader}
            type="button"
            onClick={() => onRemove?.(index!)}
            className="absolute top-3 right-3 p-2 rounded bg-red-600 shadow-lg text-white z-10"
          >
            <X size={16} />
          </button>

          <button
            disabled={pictureUploadingLoader}
            type="button"
            onClick={() => {
              if (uploadedImage?.file_url || imagePreview) {
                setSelectedImage(uploadedImage?.file_url || imagePreview);
                setOpenImageModal(true);
              }
            }}
            className="absolute top-3 right-[70px] p-2 rounded bg-blue-500 shadow-lg text-white z-10"
          >
            <WandSparkles size={16} />
          </button>
        </>
      ) : (
        <label
          htmlFor={`image-upload-${index}`}
          className="absolute top-3 right-3 p-2 rounded bg-slate-700 shadow-lg cursor-pointer text-white z-10"
        >
          <Pencil size={16} />
        </label>
      )}

      {/* IMAGE or PLACEHOLDER TEXT */}
      {imageToShow ? (
        <Image
          src={imageToShow}
          alt="uploaded"
          fill
          className="object-cover rounded-lg z-0"
        />
      ) : (
        <>
          <p
            className={`text-gray-400 ${
              small ? "text-xl" : "text-4xl"
            } font-semibold`}
          >
            {size}
          </p>
          <p
            className={`text-gray-500 ${
              small ? "text-sm" : "text-lg"
            } pt-2 text-center`}
          >
            Please choose an image <br />
            according to the expected ratio
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePlaceHolder;
