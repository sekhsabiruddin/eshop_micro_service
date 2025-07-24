import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// fetch admin data from API
const fetchAdmin = async () => {
  const response = await axiosInstance.get("/api/logged-in-admin");
  return response.data.user;
};

const useAdmin = () => {
  const {
    data: admin,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin"],
    queryFn: fetchAdmin,
  });

  const router = useRouter();

  useEffect(() => {
    if (isError) {
      router.push("/login"); // Redirect if admin fetch fails
    }
  }, [isError, router]);

  return {
    admin,
    isLoading,
    isError,
    refetch,
  };
};

export default useAdmin;
