import React from "react";
import SidebarBarWrapper from "../../shared/components/sidebar/sidebar"; // Make sure this path is correct

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full bg-black min-h-screen text-white">
      {/* sidebar */}
      <aside className="w-[280px] min-w-[250px] max-w-[300px] border-r border-r-slate-800">
        <div className="sticky top-0">
          <SidebarBarWrapper />
        </div>
      </aside>

      {/* main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
