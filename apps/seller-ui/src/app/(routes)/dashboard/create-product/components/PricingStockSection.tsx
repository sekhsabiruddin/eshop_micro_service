import React from "react";
import Input from "packages/components/input/input";
import SizeSelector from "apps/seller-ui/src/shared/components/size-selector";

const PricingStockSection = ({ register, watch, errors, control }: any) => {
  const regularPrice = watch("regular_price");
  return (
    <div className="space-y-4">
      <Input
        label="Regular Price"
        placeholder="20$"
        {...register("regular_price", {
          valueAsNumber: true,
          min: { value: 1, message: "Price must be at least 1" },
          validate: (value: number) =>
            !isNaN(value) || "Only numbers are allowed",
        })}
      />
      {errors.regular_price && (
        <p className="text-red-500 text-xs">{errors.regular_price.message}</p>
      )}

      <Input
        label="Sale Price *"
        placeholder="15$"
        {...register("sale_price", {
          required: "Sale Price is required",
          valueAsNumber: true,
          min: { value: 1, message: "Sale Price must be at least 1" },
          validate: (value: number) => {
            if (isNaN(value)) return "Only numbers are allowed";
            if (regularPrice && value >= regularPrice) {
              return "Sale Price must be less than Regular Price";
            }
            return true;
          },
        })}
      />
      {errors.sale_price && (
        <p className="text-red-500 text-xs">{errors.sale_price.message}</p>
      )}

      <Input
        label="Stock *"
        placeholder="100"
        {...register("stock", {
          required: "Stock is required!",
          valueAsNumber: true,
          min: { value: 1, message: "Stock must be at least 1" },
          max: { value: 1000, message: "Stock cannot exceed 1,000" },
          validate: (value: number) => {
            if (isNaN(value)) return "Only numbers are allowed!";
            if (!Number.isInteger(value))
              return "Stock must be a whole number!";
            return true;
          },
        })}
      />
      {errors.stock && (
        <p className="text-red-500 text-xs">{errors.stock.message}</p>
      )}

      {control ? (
        <SizeSelector control={control} error={errors} />
      ) : (
        <p className="text-red-500">Control prop is missing for SizeSelector</p>
      )}
    </div>
  );
};

export default PricingStockSection;
