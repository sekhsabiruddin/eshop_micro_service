"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import GoogleButton from "../../shared/components/goole-button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// ✅ Form data type
type FormData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  // 🔐 State for showing/hiding password
  const [passwordVisible, setPasswordVisible] = useState(false);

  // ✅ OTP screen control and resend timer
  const [showOtp, setShowOtp] = useState(true);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);

  // 🔢 OTP input tracking
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  // 🧾 React Hook Form for managing validation and input
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // 📤 Signup form submission
  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data); // Trigger mutation
  };

  // 🔁 OTP change handler
  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus(); // auto-focus next
    }
  };

  // ⌨️ Handle backspace behavior across inputs
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 📦 Mutation to handle user signup via API
  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer(); // Start countdown
    },
  });

  // ⏱ Resend OTP timer logic
  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 🔐 OTP verification mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`,
        {
          ...userData,
          otp: otp.join(""), // Combine OTP digits
        }
      );

      return response.data;
    },
    onSuccess: () => {
      router.push("/login"); // Redirect after success
    },
  });

  // 🔁 Placeholder for resend OTP action
  const resendOtp = () => {
    if (userData) {
      signupMutation.mutate(userData);
    }
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      {/* 🧾 Page Title */}
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Signup
      </h1>

      {/* 🔗 Breadcrumb */}
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Signup
      </p>

      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          {/* 🔐 Header */}
          <h3 className="text-3xl font-semibold text-center mb-2">
            Signup to Eshop
          </h3>

          {/* 🔁 Redirect to Login */}
          <p className="text-center text-gray-500 mb-4 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>

          {/* 🔒 Google Auth */}
          <GoogleButton />

          {/* 🔻 Divider */}
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">or Sign in with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* 🔤 Form Content */}
          {showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Shahriar"
                className="w-full p-2 border border-gray-300 outline-none rounded-md mb-1"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {String(errors.name.message)}
                </p>
              )}

              {/* Email */}
              <label className="block text-gray-700 mb-1 mt-4">Email</label>
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
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {String(errors.email.message)}
                </p>
              )}

              {/* Password */}
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
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                >
                  {passwordVisible ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {String(errors.password.message)}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg mt-4"
              >
                {signupMutation.isPending ? "Signing up..." : "Signup"}
              </button>
            </form>
          ) : (
            <div>
              {/* 🔢 OTP Inputs */}
              <div className="flex justify-center gap-6">
                {otp?.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 outline-none !rounded"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>

              {/* ✅ Verify Button */}
              <button
                className="w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg"
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>

              {/* 🔁 Resend Logic */}
              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    onClick={resendOtp}
                    className="text-blue-500 cursor-pointer"
                  >
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>
            </div>
          )}

          {/* 🛑 Show server error */}
          {verifyOtpMutation?.isError &&
            verifyOtpMutation.error instanceof AxiosError && (
              <p className="text-red-500 text-sm mt-2">
                {verifyOtpMutation.error.response?.data?.message ||
                  verifyOtpMutation.error.message}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
