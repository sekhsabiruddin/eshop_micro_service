"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { countries } from "../../utils/country";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import CreateShop from "apps/seller-ui/src/shared/modules/auth/create-shop";
import SignupForm from "./components/SignupForm";
import OtpVerification from "./components/OtpVerification";

// ✅ Form data type
type FormData = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  country: string;
};

const Signup = () => {
  const [activeStep, setActiveStep] = useState(1);
  // 🔐 State for showing/hiding password
  const [passwordVisible, setPasswordVisible] = useState(false);

  // ✅ OTP screen control and resend timer
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  // const [sellerId, setSellerId] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<"test-seller-123" | null>(null);

  // 🔢 OTP input tracking
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sellerData, setSellerData] = useState<FormData | null>(null);
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
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/seller-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setSellerData(formData);
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
      if (!sellerData) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-seller`,
        {
          ...sellerData,
          otp: otp.join(""), // Combine OTP digits
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      setSellerId(data?.seller?.id);
      setActiveStep(2); // Move to next step
    },
  });

  // 🔁 Placeholder for resend OTP action
  const resendOtp = () => {
    if (sellerData) {
      signupMutation.mutate(sellerData);
    }
  };
  console.log("step:", activeStep, "sellerId:", sellerId);

  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      <div className="relative flex items-center justify-between md:w-[50%] mb-8 ml-8">
        <div className="absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10" />
        {[1, 2].map((step) => (
          <div key={step}>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step <= activeStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {step}
            </div>
            <span className="ml-[-15px]">
              {step === 1
                ? "Create Account"
                : step === 2
                ? "Setup Shop"
                : "Connect Bank"}
            </span>
          </div>
        ))}
      </div>
      {/* //stepper end here  */}
      <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
        {activeStep === 1 && (
          <>
            {!showOtp && (
              <SignupForm
                onSubmit={(data) => signupMutation.mutate(data)}
                isLoading={signupMutation.isPending}
                passwordVisible={passwordVisible}
                setPasswordVisible={setPasswordVisible}
                errorsFromServer={
                  signupMutation.error instanceof AxiosError
                    ? signupMutation.error.response?.data?.message
                    : undefined
                }
              />
            )}

            {showOtp && (
              <OtpVerification
                otp={otp}
                handleOtpChange={handleOtpChange}
                handleOtpKeyDown={handleOtpKeyDown}
                inputRefs={inputRefs}
                onVerify={() => verifyOtpMutation.mutate()} // ✅ hook call
                isVerifying={verifyOtpMutation.isPending} // ✅ passing loading state
                canResend={canResend}
                resendOtp={resendOtp}
                timer={timer}
              />
            )}
          </>
        )}

        {activeStep === 2 && sellerId && (
          <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
        )}
      </div>
    </div>
  );
};

export default Signup;
