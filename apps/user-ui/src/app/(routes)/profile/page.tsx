"use client";
import useUser from "apps/user-ui/src/hooks/useUser";
import {
  BadgeCheck,
  Bell,
  CheckCircle,
  Clock,
  Gift,
  Inbox,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  Pencil,
  PhoneCall,
  Receipt,
  Settings,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import StatCard from "../../shared/components/card/stat.card";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "apps/user-ui/src/utils/axiosinstance";
import Image from "next/image";
import QuickActionCard from "../../shared/components/card/quick-action-card";
import ShippingAddressSection from "../../shared/components/shippingAddress";
import OrdersTable from "../../shared/components/table/order-table";
import ChangePassword from "../../shared/components/change-password";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading } = useUser();
  const queryTab = searchParams.get("active") || "Profile";
  const [activeTab, setActiveTab] = useState(queryTab);

  useEffect(() => {
    if (activeTab !== queryTab) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("active", activeTab);
      router.replace(`/profile?${newParams.toString()}`);
    }
  }, [activeTab]);

  const logOutHandler = async () => {
    await axiosInstance.get("/api/logout-user").then(() => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/login");
    });
  };
  const { data: orders = [] } = useQuery({
    queryKey: ["user‑orders"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/order/api/get-user-orders`);
      return res.data.orders;
    },
  });

  // assuming `orders` is your array of order objects
  const totalOrders = orders.length;

  const processingOrders = orders.filter(
    (o: any) =>
      o.deliveryStatus !== "Delivered" && o.deliveryStatus !== "Cancelled"
  ).length;

  const completedOrders = orders.filter(
    (o: any) => o.deliveryStatus === "Delivered"
  ).length;

  return (
    <div className="bg-gray-50 p-6 pb-14">
      <div className="max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,&nbsp;
            <span className="text-blue-600">
              {isLoading ? (
                <Loader2 className="inline animate-spin w-5 h-5" />
              ) : (
                `${user?.name || "User"}`
              )}
            </span>
          </h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard title="Total Orders" count={totalOrders} Icon={Clock} />
          <StatCard
            title="Processing Orders"
            count={processingOrders}
            Icon={Truck}
          />
          <StatCard
            title="Completed Orders"
            count={completedOrders}
            Icon={CheckCircle}
          />
        </div>

        {/* Layout */}
        <div className="mt-10 flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="bg-white p-4 rounded-md shadow-md border border-gray-100 w-full md:w-1/5">
            <nav className="space-y-2">
              <NavItem
                label="Profile"
                Icon={User}
                active={activeTab === "Profile"}
                onClick={() => setActiveTab("Profile")}
              />
              <NavItem
                label="My Orders"
                Icon={ShoppingBag}
                active={activeTab === "My Orders"}
                onClick={() => setActiveTab("My Orders")}
              />
              <NavItem
                label="Inbox"
                Icon={Inbox}
                active={activeTab === "Inbox"}
                onClick={() => router.push("/inbox")}
              />
              <NavItem
                label="Notifications"
                Icon={Bell}
                active={activeTab === "Notifications"}
                onClick={() => setActiveTab("Notifications")}
              />
              <NavItem
                label="Shipping Address"
                Icon={MapPin}
                active={activeTab === "Shipping Address"}
                onClick={() => setActiveTab("Shipping Address")}
              />
              <NavItem
                label="Change Password"
                Icon={Lock}
                active={activeTab === "Change Password"}
                onClick={() => setActiveTab("Change Password")}
              />
              <NavItem
                label="Logout"
                Icon={LogOut}
                danger
                onClick={logOutHandler}
              />
            </nav>
          </div>

          {/* Main Content */}
          <div className="bg-white p-6 rounded-md shadow-md border border-gray-100 w-full md:w-[55%]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {activeTab}
            </h2>

            {activeTab === "Profile" && !isLoading ? (
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Image
                    src={user?.avatar || "/default-avatar.png"}
                    alt="user avatar"
                    width={60}
                    height={60}
                    className="w-16 h-16 rounded-full border border-gray-200"
                  />
                  <button className="flex items-center gap-1 text-blue-500 text-xs font-medium">
                    <Pencil className="w-4 h-4" /> Change Photo
                  </button>
                </div>
              </div>
            ) : activeTab === "Shipping Address" ? (
              <ShippingAddressSection />
            ) : activeTab === "My Orders" ? (
              <OrdersTable />
            ) : activeTab === "Inbox" ? (
              <div className="text-center text-gray-500">
                <p>Your inbox is empty.</p>
              </div>
            ) : activeTab === "Notifications" ? (
              <div className="text-center text-gray-500">
                <p>No new notifications.</p>
              </div>
            ) : activeTab === "Change Password" ? (
              <ChangePassword />
            ) : (
              <div className="text-center text-gray-500">
                <p>Content for {activeTab} is not available yet.</p>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/4 space-y-4">
            <QuickActionCard
              Icon={Gift}
              title="Referral Program"
              description="Invite friends and earn rewards."
            />
            <QuickActionCard
              Icon={BadgeCheck}
              title="Your Badges"
              description="View your earned achievements."
            />
            <QuickActionCard
              Icon={Settings}
              title="Account Settings"
              description="Manage preferences and security."
            />
            <QuickActionCard
              Icon={Receipt}
              title="Billing History"
              description="Check your recent payments."
            />
            <QuickActionCard
              Icon={PhoneCall}
              title="Support Center"
              description="Need help? Contact support."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

// Reusable Nav item component
const NavItem = ({
  label,
  Icon,
  active,
  danger,
  onClick,
}: {
  label: string;
  Icon: LucideIcon;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
      ${active ? "bg-blue-100 text-blue-600" : ""}
      ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);
