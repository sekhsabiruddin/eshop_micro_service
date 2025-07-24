"use client";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosinstance";
import { useAuthStore } from "../store/useAuthStore";
import { isPageStatic } from "next/dist/build/utils";
import { isProtected } from "../utils/protected";

// fetch user data from API
// fetch user data from API
const fetchUser = async (isLoggedIn: boolean) => {
  const config = isLoggedIn ? isProtected : {};
  const response = await axiosInstance.get("/api/logged-in-user", config);
  return response.data.user;
};

const useUser = () => {
  const { setLoggedIn, isLoggedIn } = useAuthStore();
  const {
    data: user,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(isLoggedIn),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: false,
    // @ts-ignore
    onSuccess: () => {
      setLoggedIn(true);
    },
    // @ts-ignore
    onError: () => {
      setLoggedIn(false);
    },
  });

  return {
    user: user as any,
    isLoading: isPending,
    isError,
  };
};

export default useUser;
