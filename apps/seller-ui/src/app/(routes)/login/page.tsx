"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// ✅ Define form fields including email and password
type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  // 🔒 Show/hide password toggle
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post("/your-login-endpoint", data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setServerError(null);
      router.push("/");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid credentials!";
      setServerError(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // TODO: Replace with API call
  };

  return (
    <div className="w-full py-10 min-h-screen bg-[#f1f1f1]">
      {/* Page Title */}
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Login
      </h1>

      {/* Breadcrumb */}
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Login
      </p>

      {/* Login Card */}
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          {/* Form Header */}
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to Eshop
          </h3>

          {/* Optional Server Error */}

          {/* Sign Up Redirect */}
          <p className="text-center text-gray-500 mb-4 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">or Sign in with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="support@becodemy.com"
              className="w-full p-2 border border-gray-300 outline-none rounded-md mb-1"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {/* Email Error */}
            {errors.email && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
            )}

            {/* Password Input */}
            <label className="block text-gray-700 mb-1 mt-4">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Min. 6 characters"
                className="w-full p-2 border border-gray-300 outline-none rounded-md mb-1"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {/* Toggle Visibility Icon */}
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {/* Password Error */}
            {errors.password && (
              <p className="text-red-500 text-sm">
                {String(errors.password.message)}
              </p>
            )}

            {/* Remember Me & Forgot Link */}
            <div className="flex justify-between items-center my-4">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-blue-500 text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
            >
              {loginMutation.isPending ? "Loging..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
