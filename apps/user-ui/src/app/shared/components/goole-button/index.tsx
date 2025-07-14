import React from "react";

const GoogleButton = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="h-[46px] cursor-pointer border border-blue-100 flex items-center gap-2 px-4 rounded">
        {/* Google Logo SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="30"
          height="30"
          viewBox="0 0 48 48"
        >
          <path
            fill="#fbc02d"
            d="M43.611,20.083H42v-0.042H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
              c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.158,7.938,3.042l5.657-5.657C34.371,6.766,29.418,4.5,24,4.5
              c-10.769,0-19.5,8.731-19.5,19.5S13.231,43.5,24,43.5c9.896,0,18.5-7.354,18.5-19.5C42.5,22.708,43.611,20.083,43.611,20.083z"
          ></path>
          <path
            fill="#e53935"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
              c3.059,0,5.842,1.158,7.938,3.042l5.657-5.657C34.371,6.766,29.418,4.5,24,4.5C16.318,4.5,9.655,9.042,6.306,14.691z"
          ></path>
          <path
            fill="#4caf50"
            d="M24,43.5c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
              c-2.277,1.538-5.201,2.43-8.219,2.43c-5.202,0-9.631-3.343-11.28-8.01l-6.493,5.002C9.633,38.418,16.176,43.5,24,43.5z"
          ></path>
          <path
            fill="#1565c0"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.083,5.626
              c0,0,0.001,0.001,0.001,0.002l6.19,5.238C39.421,35.487,42.5,30.708,42.5,24C42.5,22.708,43.611,20.083,43.611,20.083z"
          ></path>
        </svg>

        {/* Button Text */}
        <span className="text-[16px] opacity-[0.8] font-Poppins">
          Sign In with Google
        </span>
      </div>
    </div>
  );
};

export default GoogleButton;
