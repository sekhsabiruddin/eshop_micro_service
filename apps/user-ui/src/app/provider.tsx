// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import React, { useState } from "react";

// // 💡 Providers component wraps your app with QueryClientProvider
// const Providers = ({ children }: { children: React.ReactNode }) => {
//   const [queryClient] = useState(() => new QueryClient());

//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// };

// export default Providers;

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

// 💡 Providers component wraps your app with QueryClientProvider
const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // do not refetch on window focus
            refetchOnWindowFocus: false,
            // cache data for 5 minutes
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
