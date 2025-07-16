"use client";
import React from "react";

type Props = {
  otp: string[];
  handleOtpChange: (index: number, value: string) => void;
  handleOtpKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onVerify: () => void; 
  isVerifying: boolean; 
  canResend: boolean;
  resendOtp: () => void;
  timer: number;
};

const OtpVerification = ({
  otp,
  handleOtpChange,
  handleOtpKeyDown,
  inputRefs,
  onVerify,
  isVerifying,
  canResend,
  resendOtp,
  timer,
}: Props) => {
  return (
    <div>
      <h2 className="text-center text-lg font-semibold mb-4">
        Enter the OTP sent to your email
      </h2>
      <div className="flex justify-center gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded"
            value={digit}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
          />
        ))}
      </div>

      <button
        onClick={onVerify}
        disabled={isVerifying}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="text-center text-sm mt-4">
        {canResend ? (
          <button onClick={resendOtp} className="text-blue-500 underline">
            Resend OTP
          </button>
        ) : (
          `Resend OTP in ${timer}s`
        )}
      </p>
    </div>
  );
};

export default OtpVerification;
