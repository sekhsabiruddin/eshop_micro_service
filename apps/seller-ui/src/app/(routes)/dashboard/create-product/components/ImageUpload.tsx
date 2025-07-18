"use client";
import React from "react";
import ImagePlaceHolder from "apps/seller-ui/src/shared/components/image-placeholder";
import axiosInstance from "apps/seller-ui/src/app/utils/axiosinstance";

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadProductImage = async (file: File) => {
  try {
    const base64String = await convertFileToBase64(file);

    const response = await axiosInstance.post(
      "http://localhost:8080/product/api/upload-product-image",
      {
        fileName: base64String,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // { file_url, fileId }
  } catch (error) {
    console.error("Upload failed", error);
    throw error;
  }
};
const ImageUpload = ({
  images,
  setImages,
  setValue,
  setOpenImageModal,
  setSelectedImage,
  pictureUploadingLoader,
  setPictureUploadingLoader,
}: any) => {
  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;
    setPictureUploadingLoader(true);

    try {
      const uploadedImage = await uploadProductImage(file);

      const updatedImages = [...images];
      updatedImages[index] = uploadedImage;

      // Add new placeholder slot
      if (index === images.length - 1 && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setPictureUploadingLoader(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const updatedImages = [...images];
      const imageToDelete = updatedImages[index];

      if (imageToDelete && imageToDelete.fileId) {
        await axiosInstance.delete(
          "http://localhost:8080/product/api/delete-product-image",
          {
            data: { fileId: imageToDelete.fileId },
          }
        );
      }

      updatedImages[index] = null;

      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="md:w-[35%]">
      {images.length > 0 && (
        <ImagePlaceHolder
          setOpenImageModal={setOpenImageModal}
          size="765 x 850"
          small={false}
          index={0}
          onImageChange={handleImageChange}
          onRemove={handleRemoveImage}
          setSelectedImage={setSelectedImage}
          images={images}
          pictureUploadingLoader={pictureUploadingLoader}
        />
      )}

      <div className="grid grid-cols-2 gap-3 mt-4">
        {images.slice(1).map((_: any, index: number) => (
          <ImagePlaceHolder
            key={index}
            setOpenImageModal={setOpenImageModal}
            size="765 x 850"
            small
            index={index + 1}
            onImageChange={handleImageChange}
            onRemove={handleRemoveImage}
            setSelectedImage={setSelectedImage}
            images={images}
            pictureUploadingLoader={pictureUploadingLoader}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
