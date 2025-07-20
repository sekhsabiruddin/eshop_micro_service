"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Hero = () => {
  const [dummyimage, setDumyImage] = useState();
  const router = useRouter();

  return (
    <div className="bg-[#115061] h-[85vh] flex flex-col justify-center w-full">
      <div className="w-[80%] m-auto md:flex h-full items-center">
        <div className="md:w-1/2">
          <p className="font-Roboto font-normal text-white pb-2 text-xl">
            Starting from 40$
          </p>
          <h1 className="text-white text-6xl font-extrabold font-Roboto">
            The best watch <br />
            Collection 2025
          </h1>
          <p className="font-Oregano text-3xl pt-4 text-white">
            Exclusive offer <span className="text-yellow-400">10%</span> off
            this week
          </p>
          <br />
          <button
            onClick={() => router.push("/products")}
            className="bg-white text-black rounded-md px-5 py-2 font-semibold flex items-center gap-2 border border-transparent hover:bg-transparent hover:text-white hover:border-white transition"
          >
            Shop Now <MoveRight size={18} />
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          {/* <Image src={dummyimage} alt="image" width={450} height={450} /> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
