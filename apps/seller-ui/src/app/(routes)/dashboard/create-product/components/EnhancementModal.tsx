import React from "react";
import { Wand, X } from "lucide-react";
import Image from "next/image";
import { enhancements } from "apps/seller-ui/src/app/utils/Ai.enhancement";

const EnhancementModal = ({
  open,
  onClose,
  imageUrl,
  processing,
  applyTransformation,
  activeEffect,
}: any) => {
  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-[500px] text-white">
        <div className="flex justify-between items-center pb-3 mb-4">
          <h2 className="text-lg font-semibold">Enhance Product Image</h2>
          <X size={20} className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Image Preview */}
        <div className="w-full aspect-square rounded-md overflow-hidden border border-gray-600 relative bg-black">
          <Image
            src={imageUrl}
            alt="product-image"
            fill
            className="object-contain"
            unoptimized // ✅ disables _next/image processing
          />
        </div>

        {/* Enhancements */}
        {imageUrl && (
          <div className="mt-4 space-y-2">
            <h3 className="text-white text-sm font-semibold">
              AI Enhancements
            </h3>
            <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
              {enhancements.map(({ label, effect }) => (
                <button
                  key={effect}
                  className={`p-2 rounded-md flex items-center gap-2 ${
                    activeEffect === effect
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => applyTransformation(effect)}
                  disabled={processing}
                >
                  <Wand size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancementModal;
