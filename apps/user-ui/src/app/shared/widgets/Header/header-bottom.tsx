"use client";

import {
  AlignLeft,
  ChevronDown,
  HeartIcon,
  ShoppingCart,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { navItems, NavItemsTypes } from "../../../configs/consotant";
import Link from "next/link";
import useUser from "apps/user-ui/src/hooks/useUser";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, isLoading } = useUser();
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"
      }`}
    >
      <div
        className={`w-[80%] m-auto flex items-center justify-between ${
          isSticky ? "py-3" : "py-0"
        } relative`}
      >
        {/* Dropdown trigger */}
        <div
          className={`w-[260px] ${
            isSticky && "-mb-2"
          } cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff]`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="white" />
            <span className="text-white font-medium">All Departments</span>
          </div>
          <ChevronDown
            color="white"
            className={`transition-transform duration-300 ${
              show ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown menu */}
        {show && (
          <div
            className={`absolute left-0 ${
              isSticky ? "top-[70px]" : "top-[50px]"
            } w-[260px] h-[400px] bg-[#f5f5f5] border border-[#3489ff] z-50`}
          >
            <ul className="p-4">
              <li className="py-2 hover:bg-gray-100 cursor-pointer">
                Electronics
              </li>
              <li className="py-2 hover:bg-gray-100 cursor-pointer">Fashion</li>
              <li className="py-2 hover:bg-gray-100 cursor-pointer">
                Home & Kitchen
              </li>
              <li className="py-2 hover:bg-gray-100 cursor-pointer">
                Sports & Outdoors
              </li>
              <li className="py-2 hover:bg-gray-100 cursor-pointer">
                Health & Beauty
              </li>
            </ul>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex items-center gap-6 ml-6">
          {navItems.map((item: NavItemsTypes, index: number) => (
            <Link
              key={index}
              href={item.href}
              className="text-[#010f1c] font-medium text-[16px] hover:text-[#3489ff] transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </div>
        {/* //when it stick heart and cart will show here  */}
        {isSticky && (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {!isLoading && user ? (
                  <>
                    <Link href="/profile">
                      <User />
                    </Link>
                    <Link href="/login">
                      <span className="block font-medium">Hello,</span>
                      <span className="font-semibold">
                        {user?.name?.split(" ")[0]}
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="border-2 w-[50px] h-[50px] flex items-center justify-center"
                    >
                      <User />
                    </Link>
                    <Link href={"/login"}>
                      <span className="block font-medium">Hello,</span>
                      <span className="font-semibold">
                        {isLoading ? "..." : "Sign In"}
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/wishlist" className="relative">
                <HeartIcon />
                <div
                  className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center
              absolute top-[-10px] right-[-10px] 
              "
                >
                  <span className="text-white font-medium text-sm">0</span>
                </div>
              </Link>

              <Link href="/cart" className="relative">
                <ShoppingCart />
                <div
                  className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center
              absolute top-[-10px] right-[-10px] 
              "
                >
                  <span className="text-white font-medium text-sm">0</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderBottom;
