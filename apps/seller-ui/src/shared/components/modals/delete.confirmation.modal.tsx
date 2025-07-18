import React from "react";

type DeleteConfirmationModalProps = {
  product: any;
  onClose: () => void;
  onConfirm: () => void;
  onRestore?: () => void;
};

const DeleteConfirmationModal = ({
  product,
  onClose,
  onConfirm,
  onRestore,
}: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-[#1f2937] p-6 rounded-lg w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Delete Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <strong>{product?.title}</strong>?{" "}
          <br />
          This product will be moved to a <strong>"delete state"</strong> and
          permanently removed
          <strong> after 24 hours</strong>. You can recover it within this time.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          {onRestore && (
            <button
              onClick={onRestore}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Restore
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
