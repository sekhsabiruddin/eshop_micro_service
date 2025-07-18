import React from "react";
import { Controller } from "react-hook-form";
import Input from "packages/components/input/input";

const DescriptionEditor = ({ control, errors, register }: any) => {
  return (
    <div className="space-y-4">
      <Input
        type="textarea"
        rows={7}
        cols={10}
        label="Short Description * (Max 150 words)"
        placeholder="Enter product description for quick view"
        {...register("short_description", {
          required: "Short description is required",
          validate: (value: string) => {
            const wordCount = value.trim().split(/\s+/).length;
            return (
              wordCount <= 150 ||
              `Short description cannot exceed 150 words (Current: ${wordCount})`
            );
          },
        })}
      />

      <Controller
        name="detailed_description"
        control={control}
        rules={{
          required: "Detailed description is required!",
          validate: (value: string) => {
            const wordCount = value
              ?.replace(/<[^>]*>/g, "")
              .split(/\s+/)
              .filter(Boolean).length;
            return (
              wordCount >= 100 || "Description must be at least 100 words!"
            );
          },
        }}
        render={({ field }) => (
          <div className="mt-2">
            <label className="block font-semibold text-gray-300 mb-1">
              Detailed Description * (Min 100 words)
            </label>
            <textarea
              {...field}
              rows={10}
              className="w-full p-3 border border-gray-600 rounded-md bg-transparent text-white placeholder-gray-400"
              placeholder="Write a detailed product description here..."
            />
            {errors.detailed_description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.detailed_description.message as string}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default DescriptionEditor;
