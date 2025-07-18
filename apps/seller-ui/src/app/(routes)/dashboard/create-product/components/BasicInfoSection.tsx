import React from "react";
import Input from "packages/components/input/input";
import ColorSelector from "packages/components/color-selctor";
import CustomSpecifications from "packages/components/custom-specifications";
import CustomProperties from "packages/components/custom-properties";

const BasicInfoSection = ({ register, errors, control }: any) => {
  if (!control) {
    console.error("'control' is undefined or null in BasicInfoSection props");
    return null;
  }

  return (
    <div className="space-y-4">
      <Input
        label="Product Title *"
        placeholder="Enter product title"
        {...register("title", { required: "Title is required" })}
      />
      <Input
        label="Tags *"
        placeholder="e.g. apple, phone"
        {...register("tags", { required: "Tags are required" })}
      />
      <Input
        label="Warranty *"
        placeholder="1 Year / No Warranty"
        {...register("warranty", { required: "Warranty is required" })}
      />
      <Input
        label="Slug *"
        placeholder="product_slug"
        {...register("slug", {
          required: "Slug is required!",
          pattern: {
            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            message: "Only lowercase letters, numbers, and hyphens allowed."
          },
          minLength: {
            value: 3,
            message: "Slug must be at least 3 characters long."
          },
          maxLength: {
            value: 50,
            message: "Slug cannot be longer than 50 characters."
          },
        })}
      />

      <ColorSelector control={control} errors={errors} />
      <CustomSpecifications control={control} errors={errors} />
      <CustomProperties control={control} errors={errors} />

      <label className="block font-semibold text-gray-300 mb-1">
        Cash On Delivery *
      </label>
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
  );
};

export default BasicInfoSection;