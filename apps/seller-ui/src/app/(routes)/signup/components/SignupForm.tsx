"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { countries } from "../../../utils/country"; // adjust if needed

export type FormData = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  country: string;
};

type Props = {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  errorsFromServer?: string;
  passwordVisible: boolean;
  setPasswordVisible: (visible: boolean) => void;
};

const SignupForm = ({
  onSubmit,
  isLoading,
  errorsFromServer,
  passwordVisible,
  setPasswordVisible,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Shahriar"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="support@becodemy.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-gray-700">Phone Number</label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="880178583****"
          {...register("phone_number", {
            required: "Phone number is required",
            minLength: { value: 10, message: "At least 10 digits" },
          })}
        />
        {errors.phone_number && (
          <p className="text-red-500 text-sm">{errors.phone_number.message}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="block text-gray-700">Country</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          {...register("country", { required: "Country is required" })}
        >
          <option value="">Select your country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-700">Password</label>
        <div className="relative">
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type={passwordVisible ? "text" : "password"}
            placeholder="Min. 6 characters"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-400"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <Eye /> : <EyeOff />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white py-2 rounded-lg"
      >
        {isLoading ? "Signing up..." : "Signup"}
      </button>

      {/* Server error */}
      {errorsFromServer && (
        <p className="text-red-500 text-sm mt-2">{errorsFromServer}</p>
      )}
    </form>
  );
};

export default SignupForm;
