import axiosInstance from "apps/user-ui/src/utils/axiosinstance";
import React from "react";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff } from "lucide-react";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const onSubmit = async (data: FormValues) => {
    setError("");
    setMessage("");
    try {
      await axiosInstance.post("/api/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setMessage("Password updated successfully!");
      reset();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <div className="relative">
          <label
            htmlFor="currentPassword"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <Lock className="absolute left-3 top-9 text-gray-400" size={16} />
          <input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            autoComplete="current-password"
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            className="w-full px-10 py-2 border focus:outline-none focus:ring"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-9"
          >
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password with strength validators */}
        <div className="relative">
          <label
            htmlFor="newPassword"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <Lock className="absolute left-3 top-9 text-gray-400" size={16} />
          <input
            id="newPassword"
            type={showNew ? "text" : "password"}
            autoComplete="new-password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 8, message: "Must be at least 8 characters" },
              validate: {
                hasLower: (value) =>
                  /[a-z]/.test(value) || "Must include a lowercase letter",
                hasUpper: (value) =>
                  /[A-Z]/.test(value) || "Must include an uppercase letter",
                hasNumber: (value) =>
                  /\d/.test(value) || "Must include a number",
              },
            })}
            className="w-full px-10 py-2 border focus:outline-none focus:ring"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-9"
          >
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {errors.newPassword?.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <label
            htmlFor="confirmPassword"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <Lock className="absolute left-3 top-9 text-gray-400" size={16} />
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            {...register("confirmPassword", {
              required: "Please confirm your new password",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            })}
            className="w-full px-10 py-2 border  focus:outline-none focus:ring"
            placeholder="Re-enter new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-9"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Global error/success */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Updating…" : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
