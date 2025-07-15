"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useSidebar from "apps/seller-ui/src/app/hooks/useSidebar";
import useSeller from "apps/seller-ui/src/app/hooks/useSeller";
import Box from "../box";
import Link from "next/link";
import { Sidebar } from "./sidebar.style";
import SidebarItem from "./sidebar.item";
import SidebarMenu from "./sidebar.menu"; // ✅ Make sure this file exists
import {
  BellRing,
  CalendarPlus,
  CreditCard,
  Home,
  ListOrdered,
  LogOut,
  Mail,
  PackageSearch,
  Settings,
  SquarePlus,
  TicketPercent,
} from "lucide-react"; // ✅ Adjust this import based on your icon library

const SidebarBarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href="/" className="flex justify-center text-center gap-2">
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name}
              </h3>
              <h5 className="font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>

      <Sidebar.Body className="body sidebar">
        <div className="block my-3 h-full">
          <SidebarItem
            title="Dashboard"
            icon={<Home fill={getIconColor("/dashboard")} />}
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />
        </div>

        <div className="mt-2 block">
          <SidebarMenu title="Main Menu">
            <SidebarItem
              isActive={activeSidebar === "/dashboard/orders"}
              title="Orders"
              href="/dashboard/orders"
              icon={
                <ListOrdered
                  size={26}
                  color={getIconColor("/dashboard/orders")}
                />
              }
            />

            <SidebarItem
              isActive={activeSidebar === "/dashboard/payments"}
              title="Payments"
              href="/dashboard/payments"
              icon={
                <CreditCard
                  size={22}
                  color={getIconColor("/dashboard/payments")}
                />
              }
            />
          </SidebarMenu>

          <SidebarMenu title="Products">
            <SidebarItem
              isActive={activeSidebar === "/dashboard/create-product"}
              title="Create Product"
              href="/dashboard/create-product"
              icon={
                <SquarePlus
                  size={24}
                  color={getIconColor("/dashboard/create-product")}
                />
              }
            />
            <SidebarItem
              isActive={activeSidebar === "/dashboard/all-products"}
              title="All Products"
              href="/dashboard/all-products"
              icon={
                <PackageSearch
                  size={22}
                  color={getIconColor("/dashboard/all-products")}
                />
              }
            />
          </SidebarMenu>
          <SidebarMenu title="Events">
            <SidebarItem
              isActive={activeSidebar === "/dashboard/create-event"}
              title="Create Event"
              href="/dashboard/create-event"
              icon={
                <CalendarPlus
                  size={24}
                  color={getIconColor("/dashboard/create-event")}
                />
              }
            />
          </SidebarMenu>
          <SidebarMenu title="Controllers">
            <SidebarItem
              isActive={activeSidebar === "/dashboard/inbox"}
              title="Inbox"
              href="/dashboard/inbox"
              icon={<Mail size={20} color={getIconColor("/dashboard/inbox")} />}
            />
            <SidebarItem
              isActive={activeSidebar === "/dashboard/settings"}
              title="Settings"
              href="/dashboard/settings"
              icon={
                <Settings
                  size={22}
                  color={getIconColor("/dashboard/settings")}
                />
              }
            />
            <SidebarItem
              isActive={activeSidebar === "/dashboard/notifications"}
              title="Notifications"
              href="/notifications"
              icon={
                <BellRing
                  size={24}
                  color={getIconColor("/dashboard/notifications")}
                />
              }
            />
          </SidebarMenu>
          <SidebarMenu title="Extras">
            <SidebarItem
              isActive={activeSidebar === "/dashboard/discount-codes"}
              title="Discount Codes"
              href="/dashboard/discount-codes"
              icon={
                <TicketPercent
                  size={22}
                  color={getIconColor("/dashboard/discount-codes")}
                />
              }
            />
            <SidebarItem
              isActive={activeSidebar === "/logout"}
              title="Logout"
              href="/"
              icon={<LogOut size={20} color={getIconColor("/logout")} />}
            />
          </SidebarMenu>
        </div>
      </Sidebar.Body>
    </Box>
  );
};

export default SidebarBarWrapper;
