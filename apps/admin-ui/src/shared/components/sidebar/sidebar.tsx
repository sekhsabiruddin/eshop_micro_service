// "use client";

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";
// import useSidebar from "apps/admin-ui/src/hooks/useSidebar";

// import Box from "../box";
// import Link from "next/link";
// import { Sidebar } from "./sidebar.style";
// import SidebarItem from "./sidebar.item";
// import SidebarMenu from "./sidebar.menu"; // ✅ Make sure this file exists
// import {
//   BellRing,
//   CalendarPlus,
//   CreditCard,
//   Home,
//   ListOrdered,
//   LogOut,
//   Mail,
//   PackageSearch,
//   Settings,
//   SquarePlus,
//   TicketPercent,
// } from "lucide-react"; // ✅ Adjust this import based on your icon library

// const SidebarBarWrapper = () => {
//   const { activeSidebar, setActiveSidebar } = useSidebar();
//   const pathName = usePathname();

//   useEffect(() => {
//     setActiveSidebar(pathName);
//   }, [pathName, setActiveSidebar]);

//   const getIconColor = (route: string) =>
//     activeSidebar === route ? "#0085ff" : "#969696";

//   return (
//     <Box
//       css={{
//         height: "100vh",
//         zIndex: 202,
//         position: "sticky",
//         padding: "8px",
//         top: "0",
//         overflowY: "scroll",
//         scrollbarWidth: "none",
//       }}
//       className="sidebar-wrapper"
//     >
//       <Sidebar.Header>
//         {/* <Box>
//           <Link href="/" className="flex justify-center text-center gap-2">
//             <Box>
//               <h3 className="text-xl font-medium text-[#ecedee]">
//                 {seller?.shop?.name}
//               </h3>
//               <h5 className="font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap">
//                 {seller?.shop?.address}
//               </h5>
//             </Box>
//           </Link>
//         </Box> */}
//       </Sidebar.Header>

//       <Sidebar.Body className="body sidebar">
//         <div className="block my-3 h-full">
//           <SidebarItem
//             title="Dashboard"
//             icon={<Home fill={getIconColor("/dashboard")} />}
//             isActive={activeSidebar === "/dashboard"}
//             href="/dashboard"
//           />
//         </div>

//         <div className="mt-2 block">
//           <SidebarMenu title="Main Menu">
//             <SidebarItem
//               isActive={activeSidebar === "/dashboard/orders"}
//               title="Orders"
//               href="/dashboard/orders"
//               icon={
//                 <ListOrdered
//                   size={26}
//                   color={getIconColor("/dashboard/orders")}
//                 />
//               }
//             />

//             <SidebarItem
//               isActive={activeSidebar === "/dashboard/payments"}
//               title="Payments"
//               href="/dashboard/payments"
//               icon={
//                 <CreditCard
//                   size={22}
//                   color={getIconColor("/dashboard/payments")}
//                 />
//               }
//             />
//           </SidebarMenu>

//           <SidebarMenu title="Products">
//             <SidebarItem
//               isActive={activeSidebar === "/dashboard/create-product"}
//               title="Create Product"
//               href="/dashboard/create-product"
//               icon={
//                 <SquarePlus
//                   size={24}
//                   color={getIconColor("/dashboard/create-product")}
//                 />
//               }
//             />
//             <SidebarItem
//               isActive={activeSidebar === "/dashboard/all-products"}
//               title="All Products"
//               href="/dashboard/all-products"
//               icon={
//                 <PackageSearch
//                   size={22}
//                   color={getIconColor("/dashboard/all-products")}
//                 />
//               }
//             />
//           </SidebarMenu>
//           <SidebarMenu title="Events">
//             <SidebarItem
//               isActive={activeSidebar === "/dashboard/create-event"}
//               title="Create Event"
//               href="/dashboard/create-event"
//               icon={
//                 <CalendarPlus
//                   size={24}
//                   color={getIconColor("/dashboard/create-event")}
//                 />
//               }
//             />
//           </SidebarMenu>
//           <SidebarMenu title="Controllers">
//             <SidebarItem
//               isActive={activeSidebar === "/dashboard/inbox"}
//               title="Inbox"
//               href="/dashboard/inbox"
//               icon={<Mail size={20} color={getIconColor("/dashboard/inbox")} />}
//             />
//             <SidebarItem
//               isActive={activeSidebar === "/dashboard/settings"}
//               title="Settings"
//               href="/dashboard/settings"
//               icon={
//                 <Settings
//                   size={22}
//                   color={getIconColor("/dashboard/settings")}
//                 />
//               }
//             />
//             <SidebarItem
//               isActive={activeSidebar === "/dashboard/notifications"}
//               title="Notifications"
//               href="/notifications"
//               icon={
//                 <BellRing
//                   size={24}
//                   color={getIconColor("/dashboard/notifications")}
//                 />
//               }
//             />
//           </SidebarMenu>
//           <SidebarMenu title="Extras">
//             <SidebarItem
//               isActive={activeSidebar === "/dashboard/discount-codes"}
//               title="Discount Codes"
//               href="/dashboard/discount-codes"
//               icon={
//                 <TicketPercent
//                   size={22}
//                   color={getIconColor("/dashboard/discount-codes")}
//                 />
//               }
//             />
//             <SidebarItem
//               isActive={activeSidebar === "/logout"}
//               title="Logout"
//               href="/"
//               icon={<LogOut size={20} color={getIconColor("/logout")} />}
//             />
//           </SidebarMenu>
//         </div>
//       </Sidebar.Body>
//     </Box>
//   );
// };

// export default SidebarBarWrapper;

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useSidebar from "apps/admin-ui/src/hooks/useSidebar";

import {
  Home,
  ListOrdered,
  CreditCard,
  PackageSearch,
  CalendarPlus,
  Users,
  Store,
  ScrollText,
  Settings,
  BellRing,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import Box from "../box";
import SidebarItem from "./sidebar.item";
import SidebarMenu from "./sidebar.menu";

const SidebarBarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#ffffff" : "#9ca3af";

  return (
    <Box className="bg-black text-white h-screen w-[260px] py-6 px-3 flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="mb-8 px-3">
        <h2 className="text-lg font-semibold leading-tight">Shahriar Sajeeb</h2>
        <p className="text-xs text-gray-400">support@becodemy.com</p>
      </div>

      <nav className="space-y-6 text-sm flex-1 overflow-y-auto scrollbar-none pr-1">
        {/* Dashboard */}
        <div>
          <SidebarItem
            title="Dashboard"
            href="/dashboard"
            isActive={activeSidebar === "/dashboard"}
            icon={
              <LayoutDashboard size={20} color={getIconColor("/dashboard")} />
            }
          />
        </div>

        {/* Main Menu */}
        <SidebarMenu title="Main Menu">
          <SidebarItem
            title="Orders"
            href="/dashboard/orders"
            isActive={activeSidebar === "/dashboard/orders"}
            icon={
              <ListOrdered
                size={20}
                color={getIconColor("/dashboard/orders")}
              />
            }
          />
          <SidebarItem
            title="Payments"
            href="/dashboard/payments"
            isActive={activeSidebar === "/dashboard/payments"}
            icon={
              <CreditCard
                size={20}
                color={getIconColor("/dashboard/payments")}
              />
            }
          />
          <SidebarItem
            title="Products"
            href="/dashboard/products"
            isActive={activeSidebar === "/dashboard/products"}
            icon={
              <PackageSearch
                size={20}
                color={getIconColor("/dashboard/products")}
              />
            }
          />
          <SidebarItem
            title="Events"
            href="/dashboard/events"
            isActive={activeSidebar === "/dashboard/events"}
            icon={
              <CalendarPlus
                size={20}
                color={getIconColor("/dashboard/events")}
              />
            }
          />
          <SidebarItem
            title="Users"
            href="/dashboard/users"
            isActive={activeSidebar === "/dashboard/users"}
            icon={<Users size={20} color={getIconColor("/dashboard/users")} />}
          />
          <SidebarItem
            title="Sellers"
            href="/dashboard/sellers"
            isActive={activeSidebar === "/dashboard/sellers"}
            icon={
              <Store size={20} color={getIconColor("/dashboard/sellers")} />
            }
          />
        </SidebarMenu>

        {/* Controllers */}
        <SidebarMenu title="Controllers">
          <SidebarItem
            title="Loggers"
            href="/dashboard/loggers"
            isActive={activeSidebar === "/dashboard/loggers"}
            icon={
              <ScrollText
                size={20}
                color={getIconColor("/dashboard/loggers")}
              />
            }
          />
          <SidebarItem
            title="Management"
            href="/dashboard/management"
            isActive={activeSidebar === "/dashboard/management"}
            icon={
              <Settings
                size={20}
                color={getIconColor("/dashboard/management")}
              />
            }
          />
          <SidebarItem
            title="Notifications"
            href="/dashboard/notifications"
            isActive={activeSidebar === "/dashboard/notifications"}
            icon={
              <BellRing
                size={20}
                color={getIconColor("/dashboard/notifications")}
              />
            }
          />
        </SidebarMenu>

        {/* Customization */}
        <SidebarMenu title="Customization">
          <SidebarItem
            title="All Customization"
            href="/dashboard/customization"
            isActive={activeSidebar === "/dashboard/customization"}
            icon={
              <Settings
                size={20}
                color={getIconColor("/dashboard/customization")}
              />
            }
          />
        </SidebarMenu>

        {/* Extras */}
        <SidebarMenu title="Extras">
          <SidebarItem
            title="Logout"
            href="/logout"
            isActive={activeSidebar === "/logout"}
            icon={<LogOut size={20} color={getIconColor("/logout")} />}
          />
        </SidebarMenu>
      </nav>
    </Box>
  );
};

export default SidebarBarWrapper;
