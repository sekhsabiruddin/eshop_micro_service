import React from "react";

const DiscountSelector = ({
  control,
  watch,
  setValue,
  discountCodes = [],
}: any) => {
  const selected = watch("discountCodes") || [];

  return (
    <div className="mt-3">
      <label className="block font-semibold text-gray-300 mb-1">
        Select Discount Codes (optional)
      </label>
      <div className="flex flex-wrap gap-2">
        {discountCodes.map((code: any) => (
          <button
            key={code.id}
            type="button"
            className={`px-3 py-1 rounded-md text-sm font-semibold border ${
              selected.includes(code.id)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
            }`}
            onClick={() => {
              const updatedSelection = selected.includes(code.id)
                ? selected.filter((id: string) => id !== code.id)
                : [...selected, code.id];
              setValue("discountCodes", updatedSelection);
            }}
          >
            {code.public_name} ({code.discountValue}
            {code.discountType === "percentage" ? "%" : "$"})
          </button>
        ))}
      </div>
    </div>
  );
};

export default DiscountSelector;
